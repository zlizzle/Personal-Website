import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const PostContainer = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 2rem 1.5rem;
  background: #f8f6f0;
  border-radius: 10px;
  box-shadow: 0 1px 8px #f8e7bb40;
  font-family: system-ui, Arial, Helvetica, sans-serif;
`;

const BackButtonRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1.5rem;
`;

const PostTitle = styled.h1`
  margin: 0 0 0.7rem 0;
  color: #232323;
  font-size: 2.3rem;
  font-weight: 800;
  letter-spacing: 0.01em;
  text-align: left;
`;

const PostMeta = styled.div`
  color: #6c6c6c;
  font-size: 1rem;
  text-align: left;
  margin-bottom: 2rem;
`;

const PostContent = styled.article`
  color: #232323;
  background: #fcfbf7;
  border: 1.5px solid #ece7df;
  border-radius: 8px;
  padding: 2rem 1.5rem;
  margin-top: 1.5rem;
  margin-bottom: 2rem;
  line-height: 1.7;
  font-size: 1.13rem;
  text-align: left !important;
  width: 100%;
  box-shadow: 0 2px 8px #f8e7bb18;
  font-family: system-ui, Arial, Helvetica, sans-serif;

  p {
    margin-bottom: 1.6rem;
    margin-top: 0;
    text-indent: 0;
    padding-left: 0;
    text-align: left !important;
    width: 100%;
  }

  .subtitle {
    font-style: italic;
    color: #444;
    margin-bottom: 2.2rem;
    font-size: 1.13rem;
    display: block;
    text-align: left !important;
    width: 100%;
  }
`;

const BackButton = styled.button`
```

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/${slug}`);
        if (!response.ok) {
          throw new Error('Failed to fetch blog post');
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) return <PostContainer>Loading...</PostContainer>;
  if (error) return <PostContainer>Error: {error}</PostContainer>;
  if (!post) return <PostContainer>Post not found</PostContainer>;

  // Split content into paragraphs, treat the first as subtitle
  const paragraphs = post.content.split('\n').filter(p => p.trim());
  const subtitle = paragraphs[0];
  const rest = paragraphs.slice(1);

  return (
    <PostContainer>
      <BackButtonRow>
        <BackButton onClick={() => navigate('/blog')}>
          ← Back to Blog
        </BackButton>
      </BackButtonRow>
      <PostTitle>{post.title}</PostTitle>
      <PostMeta>Posted on {new Date(post.created_at).toLocaleDateString()}</PostMeta>
      <PostContent>
        <span className="subtitle">{subtitle}</span>
        {rest.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </PostContent>
    </PostContainer>
  );
};

export default BlogPost;