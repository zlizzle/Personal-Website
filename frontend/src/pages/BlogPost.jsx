import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const PostContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const PostHeader = styled.header`
  margin-bottom: 2rem;
`;

const PostTitle = styled.h1`
  margin: 0 0 1rem 0;
  color: #fff;
  font-size: 2.5rem;
`;

const PostMeta = styled.div`
  color: #888;
  font-size: 0.9rem;
`;

const PostContent = styled.article`
  color: #fff;
  line-height: 1.8;
  font-size: 1.1rem;

  p {
    margin-bottom: 1.5rem;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #eebbc3;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  margin-bottom: 2rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

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

  return (
    <PostContainer>
      <BackButton onClick={() => navigate('/blog')}>← Back to Blog</BackButton>
      <PostHeader>
        <PostTitle>{post.title}</PostTitle>
        <PostMeta>
          Posted on {new Date(post.created_at).toLocaleDateString()}
        </PostMeta>
      </PostHeader>
      <PostContent>
        {post.content.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </PostContent>
    </PostContainer>
  );
};

export default BlogPost; 