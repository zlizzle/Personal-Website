from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import BlogPost
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class BlogPostResponse(BaseModel):
    id: int
    title: str
    content: str
    created_at: datetime
    slug: str

    class Config:
        from_attributes = True

@router.get("/blog", response_model=List[BlogPostResponse])
def get_blog_posts(db: Session = Depends(get_db)):
    posts = db.query(BlogPost).order_by(BlogPost.created_at.desc()).all()
    return posts

@router.get("/blog/{slug}", response_model=BlogPostResponse)
def get_blog_post(slug: str, db: Session = Depends(get_db)):
    post = db.query(BlogPost).filter(BlogPost.slug == slug).first()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post 