from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from pydantic import BaseModel, constr
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from .routes import blog, admin
from .database import engine
from .models import Base
import os
import logging
import html
from typing import List
from datetime import datetime
from fastapi.responses import JSONResponse

# Create database tables
Base.metadata.create_all(bind=engine)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('app.log')
    ]
)
logger = logging.getLogger(__name__)

# Initialize FastAPI with optimized settings
app = FastAPI(
    title="Personal Website API",
    description="Backend API for personal website",
    version="1.0.0",
    docs_url=None,  # Disable Swagger UI in production
    redoc_url=None,  # Disable ReDoc in production
)

# Add middleware in correct order
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
    max_age=3600,  # Cache preflight requests for 1 hour
)

app.add_middleware(GZipMiddleware, minimum_size=1000)  # Compress responses > 1KB

# Configure rate limiter
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200/hour", "50/minute"]  # Global rate limits
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

class PokeData(BaseModel):
    handle: constr(strip_whitespace=True, min_length=2, max_length=32)
    message: constr(strip_whitespace=True, max_length=140) = ""

# Configure static files with caching
static_path = os.path.join(os.path.dirname(__file__), "static")
app.mount(
    "/static",
    StaticFiles(
        directory=static_path,
        html=True,
        check_dir=True
    ),
    name="static"
)

# Configure templates
templates = Jinja2Templates(
    directory=os.path.join(os.path.dirname(__file__), "templates"),
    auto_reload=os.getenv("ENVIRONMENT") == "development"
)

# Include routers with rate limits
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

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/poke")
@limiter.limit("3/minute")  # Allow 3 pokes per minute per IP
async def receive_poke(data: PokeData, request: Request):
    # Sanitize input to prevent XSS
    handle = html.escape(data.handle)
    message = html.escape(data.message)
    user_ip = request.client.host

    # Log the poke
    logger.info(f"POKE from {handle} (IP: {user_ip}): {message}")

    return {"success": True, "msg": "Poke received!"}

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    return JSONResponse(
        status_code=404,
        content={"detail": "Not found"}
    )

@app.exception_handler(500)
async def server_error_handler(request: Request, exc):
    logger.error(f"Server error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )