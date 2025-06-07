from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import BlogPost
from pydantic import BaseModel
from datetime import datetime
from .admin import verify_token

router = APIRouter()

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
def get_blog_posts(db: Session = Depends(get_db)):
    posts = db.query(BlogPost).order_by(BlogPost.created_at.desc()).all()
    return posts

@router.get("/blog/{slug}", response_model=BlogPostResponse)
def get_blog_post(slug: str, db: Session = Depends(get_db)):
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
    return {"message": "Blog post deleted successfully"} 