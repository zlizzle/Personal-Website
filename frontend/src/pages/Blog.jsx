import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const BlogContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const BlogPost = styled.article`
  margin-bottom: 2rem;
  padding: 1.5rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const PostTitle = styled.h2`
  margin: 0 0 1rem 0;
  color: #fff;
  font-size: 1.8rem;
`;

const PostMeta = styled.div`
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const PostExcerpt = styled.p`
  color: #ccc;
  line-height: 1.6;
  margin: 0;
`;

const ReadMoreLink = styled(Link)`
  display: inline-block;
  margin-top: 1rem;
  color: #eebbc3;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
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