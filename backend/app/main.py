from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from pydantic import BaseModel
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from .routes import blog, admin
from .database import engine
from .models import Base
import os
import logging
from datetime import datetime

Base.metadata.create_all(bind=engine)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('app.log')
    ]
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Personal Website API",
    description="Backend API for personal website",
    version="1.0.0",
    docs_url=None,
    redoc_url=None,
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"] if os.getenv("ENVIRONMENT") == "development" else [
        "localhost",
        "127.0.0.1",
        "www.edsolutions.space",
        "edsolutions.space",
    ]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if os.getenv("ENVIRONMENT") == "development" else [
        "https://www.edsolutions.space",
        "https://edsolutions.space",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["*"],
    max_age=3600
)

app.add_middleware(GZipMiddleware, minimum_size=1000)

limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200/hour", "50/minute"]
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

static_path = os.path.join(os.path.dirname(__file__), "static")
app.mount("/static", StaticFiles(directory=static_path, html=True, check_dir=True), name="static")

templates = Jinja2Templates(
    directory=os.path.join(os.path.dirname(__file__), "templates"),
    auto_reload=os.getenv("ENVIRONMENT") == "development"
)

@app.api_route("/health", methods=["GET", "HEAD"])
@limiter.exempt
async def health_check():
    return {"status": "healthy"}

@app.api_route("/", methods=["GET", "HEAD"], include_in_schema=False)
@limiter.exempt
async def serve_root(request: Request):
    logger.info(f"[serve_root] Method={request.method}, User-Agent={request.headers.get('user-agent', '')}")
    if request.method == "HEAD":
        return JSONResponse({"status": "ok"})
    try:
        return templates.TemplateResponse("index.html", {"request": request})
    except Exception as e:
        logger.error(f"[serve_root] Failed to render index.html: {e}")
        return JSONResponse(status_code=500, content={"detail": "Failed to render index.html"})



app.include_router(
    blog.router,
    prefix="/api",
    tags=["blog"],
    responses={404: {"description": "Not found"}},
)

app.include_router(
    admin.router,
    prefix="/api",
    tags=["admin"],
    responses={404: {"description": "Not found"}},
)

@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    return JSONResponse(status_code=404, content={"detail": "Not found"})

@app.exception_handler(500)
async def server_error_handler(request: Request, exc):
    logger.error(f"Server error: {exc}", exc_info=True)
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})
