from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import BlogPost
from pydantic import BaseModel
from datetime import datetime, timedelta
from .admin import verify_token
import functools
from typing import Any, Callable

router = APIRouter()

# Simple in-memory cache with TTL
class Cache:
    def __init__(self, ttl_seconds: int = 300):  # 5 minutes default TTL
        self._cache = {}
        self._ttl = ttl_seconds

    def get(self, key: str) -> Optional[Any]:
        if key in self._cache:
            value, timestamp = self._cache[key]
            if datetime.utcnow() - timestamp < timedelta(seconds=self._ttl):
                return value
            del self._cache[key]
        return None

    def set(self, key: str, value: Any) -> None:
        self._cache[key] = (value, datetime.utcnow())

    def invalidate(self, key: str) -> None:
        if key in self._cache:
            del self._cache[key]

# Initialize cache
cache = Cache()

def cached(ttl_seconds: int = 300):
    def decorator(func: Callable):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            # Create cache key from function name and arguments
            cache_key = f"{func.__name__}:{str(args)}:{str(kwargs)}"
            
            # Try to get from cache
            cached_result = cache.get(cache_key)
            if cached_result is not None:
                return cached_result
            
            # If not in cache, call the function
            result = await func(*args, **kwargs)
            
            # Store in cache
            cache.set(cache_key, result)
            return result
        return wrapper
    return decorator

class BlogPostResponse(BaseModel):
    id: int
    title: str
    content: str
    created_at: datetime
    slug: str

    class Config:
        from_attributes = True

class BlogPostCreate(BaseModel):
    title: str
    content: str
    slug: str

@router.get("/blog", response_model=List[BlogPostResponse])
@cached(ttl_seconds=300)  # Cache for 5 minutes
async def get_blog_posts(db: Session = Depends(get_db)):
    posts = db.query(BlogPost).order_by(BlogPost.created_at.desc()).all()
    return posts

@router.get("/blog/{slug}", response_model=BlogPostResponse)
@cached(ttl_seconds=300)  # Cache for 5 minutes
async def get_blog_post(slug: str, db: Session = Depends(get_db)):
    post = db.query(BlogPost).filter(BlogPost.slug == slug).first()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post

@router.post("/blog", response_model=BlogPostResponse)
async def create_blog_post(
    post: BlogPostCreate, 
    db: Session = Depends(get_db),
    token: dict = Depends(verify_token)
):
    # Check if slug already exists
    existing = db.query(BlogPost).filter(BlogPost.slug == post.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="A post with this slug already exists")
    
    # Create new post
    db_post = BlogPost(
        title=post.title,
        content=post.content,
        slug=post.slug,
        created_at=datetime.utcnow()
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    
    # Invalidate cache
    cache.invalidate("get_blog_posts")
    return db_post

@router.delete("/blog/{slug}")
async def delete_blog_post(
    slug: str,
    db: Session = Depends(get_db),
    token: dict = Depends(verify_token)
):
    # Find the post
    post = db.query(BlogPost).filter(BlogPost.slug == slug).first()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    # Delete the post
    db.delete(post)
    db.commit()
    
    # Invalidate cache
    cache.invalidate("get_blog_posts")
    cache.invalidate(f"get_blog_post:{slug}")
    return {"message": "Blog post deleted successfully"} 