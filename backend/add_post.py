from app.database import SessionLocal
from app.models import BlogPost

def add_test_post():
    # Create a new session
    db = SessionLocal()
    
    try:
        # Create a new blog post
        post = BlogPost(
            title="My First Blog Post",
            content="""Hello! This is my first blog post.

I'm excited to share my thoughts and experiences here. This blog will be a place where I document my journey as a software engineer, share interesting projects, and discuss technical topics.

Stay tuned for more posts!""",
            slug="my-first-blog-post"
        )
        
        # Add it to the database
        db.add(post)
        db.commit()
        print("Blog post added successfully!")
        
    except Exception as e:
        print(f"Error adding blog post: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_test_post() 