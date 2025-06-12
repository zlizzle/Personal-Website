import React, { useState, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const BlogContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--surface);
  border-radius: 4px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: var(--text-muted);
  font-family: 'DM Sans', monospace;
`;

const LoadingText = styled.div`
  position: relative;
  padding-left: 1.5rem;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 1rem;
    height: 1rem;
    border: 2px solid var(--accent);
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: translateY(-50%) rotate(360deg); }
  }
`;

const ErrorContainer = styled.div`
  padding: 2rem;
  text-align: center;
  color: var(--text-muted);
  font-family: 'DM Sans', monospace;
`;

const RetryButton = styled.button`
  background: var(--accent);
  color: var(--bg);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 1rem;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const BlogPost = styled.article`
  margin-bottom: 2rem;
  padding: 1.5rem;
  border-radius: 4px;
  background: var(--bg);
  transition: all 0.2s ease;
  border: 1px solid transparent;

  &:hover {
    background: var(--surface-hover);
    border-color: var(--accent);
    transform: translateY(-2px);
  }
`;

const PostTitle = styled.h2`
  margin: 0 0 1rem 0;
  color: var(--text);
  font-size: 1.8rem;
  font-weight: 600;
  letter-spacing: -0.02em;
`;

const PostMeta = styled.div`
  color: var(--text-muted);
  font-size: 0.95rem;
  margin-bottom: 1rem;
  font-family: 'DM Sans', sans-serif;
`;

const PostExcerpt = styled.p`
  color: var(--text-muted);
  line-height: 1.6;
  margin: 0;
  font-size: 1rem;
`;

const ReadMoreLink = styled(Link)`
  display: inline-block;
  margin-top: 1rem;
  color: var(--accent);
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:hover {
    color: var(--accent-hover);
    transform: translateX(4px);
  }
`;

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/blog', { signal });
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

    return () => controller.abort();
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (loading) {
    return (
      <BlogContainer>
        <LoadingContainer>
          <LoadingText>Loading posts...</LoadingText>
        </LoadingContainer>
      </BlogContainer>
    );
  }

  if (error) {
    return (
      <BlogContainer>
        <ErrorContainer>
          <p>Oops! Something went wrong.</p>
          <p>{error}</p>
          <RetryButton onClick={handleRetry}>Try Again</RetryButton>
        </ErrorContainer>
      </BlogContainer>
    );
  }

  return (
    <BlogContainer>
      <h1>Blog</h1>
      {posts.length === 0 ? (
        <p>No blog posts yet. Check back soon!</p>
      ) : (
        posts.map((post) => (
          <BlogPost key={post.id}>
            <PostTitle>{post.title}</PostTitle>
            <PostMeta>
              {new Date(post.created_at).toLocaleDateString()}
            </PostMeta>
            <PostExcerpt>{post.content.substring(0, 200)}...</PostExcerpt>
            <ReadMoreLink to={`/blog/${post.slug}`}>
              Read More →
            </ReadMoreLink>
          </BlogPost>
        ))
      )}
    </BlogContainer>
  );
};

export default Blog; 