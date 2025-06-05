from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, constr
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from fastapi import FastAPI, Request
from slowapi.errors import RateLimitExceeded
import os
import logging
import html

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Set up basic logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')

class PokeData(BaseModel):
    handle: constr(strip_whitespace=True, min_length=2, max_length=32)
    message: constr(strip_whitespace=True, max_length=140) = ""

static_path = os.path.join(os.path.dirname(__file__), "static")
app.mount("/static", StaticFiles(directory=static_path), name="static")

templates = Jinja2Templates(directory=os.path.join(os.path.dirname(__file__), "templates"))

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/poke")
async def receive_poke(data: PokeData, request: Request):
    # Here you could log/store pokes, add spam detection, etc.
    # For now, just print it and send a playful response.
    print(f"POKE from {data.handle}: {data.message}")
    # Optional: Rate limiting/spam-check could go here

    return {"success": True, "msg": "Poke received!", "your_ip": request.client.host}

@app.post("/poke")
@limiter.limit("3/minute")  # Allow 3 pokes per minute per IP
async def receive_poke(data: PokeData, request: Request):
    # Sanitize input to prevent XSS
    handle = html.escape(data.handle)
    message = html.escape(data.message)
    user_ip = request.client.host

    # Log the poke (could be extended to DB or email)
    logging.info(f"POKE from {handle} (IP: {user_ip}): {message}")

    # Return a generic message, no sensitive info
    return {"success": True, "msg": "Poke received!", "your_ip": user_ip}