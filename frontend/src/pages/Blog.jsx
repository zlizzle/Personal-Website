import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const BlogContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--surface);
  border-radius: 4px;
`;

const BlogPost = styled.article`
  margin-bottom: 2rem;
  padding: 1.5rem;
  border-radius: 4px;
  background: var(--bg);
  transition: background-color 0.2s ease;

  &:hover {
    background: var(--surface-hover);
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
  transition: color 0.2s ease;

  &:hover {
    color: var(--accent-hover);
  }
`;

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog');
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <BlogContainer>Loading...</BlogContainer>;
  if (error) return <BlogContainer>Error: {error}</BlogContainer>;

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
              Read More
            </ReadMoreLink>
          </BlogPost>
        ))
      )}
    </BlogContainer>
  );
};

export default Blog; 