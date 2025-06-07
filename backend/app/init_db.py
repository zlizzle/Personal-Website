from database import engine
from models import Base, BlogPost
from datetime import datetime

def init_db():
    # Create tables
    Base.metadata.create_all(bind=engine)

    # Add a sample blog post
    sample_post = BlogPost(
        title="Welcome to My Blog!",
        content="""This is my first blog post. I'll be sharing my thoughts on software engineering, 
        technology, and maybe some personal projects here. Stay tuned for more content!

        In the meantime, feel free to poke me using the form below. I'd love to hear from you!""",
        created_at=datetime.utcnow(),
        slug="welcome-to-my-blog"
    )

    # Add to database
    from database import SessionLocal
    db = SessionLocal()
    try:
        # Check if post already exists
        existing = db.query(BlogPost).filter(BlogPost.slug == sample_post.slug).first()
        if not existing:
            db.add(sample_post)
            db.commit()
            print("Added sample blog post!")
        else:
            print("Sample blog post already exists!")
    finally:
        db.close()

if __name__ == "__main__":
    init_db() 