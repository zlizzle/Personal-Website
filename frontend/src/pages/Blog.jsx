import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const BlogContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: #f8f6f0; /* subtle off-white for contrast */
  border-radius: 10px;
`;

const BlogPost = styled.article`
  margin-bottom: 2rem;
  padding: 1.5rem;
  border-radius: 8px;
  background: #fffdfa;
  box-shadow: 0 1px 8px #f8e7bb40;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px #ffd58360;
  }
`;

const PostTitle = styled.h2`
  margin: 0 0 1rem 0;
  color: #232323; /* much darker for readability */
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 0.01em;
`;

const PostMeta = styled.div`
  color: #6c6c6c; /* darker gray for date */
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const PostExcerpt = styled.p`
  color: #232323; /* dark text for excerpt */
  line-height: 1.6;
  margin: 0;
  font-size: 1.08rem;
`;

const ReadMoreLink = styled(Link)`
  display: inline-block;
  margin-top: 1rem;
  color: #eebbc3;
  text-decoration: underline;
  font-weight: 600;
  font-size: 1.05rem;
  transition: color 0.2s;

  &:hover {
    color: #232323;
    background: #ffd583;
    border-radius: 4px;
    text-decoration: none;
    padding: 0 0.3em;
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