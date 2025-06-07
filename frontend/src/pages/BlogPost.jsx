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
  color: #232323;
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: 0.01em;
  text-align: center;
`;

const PostMeta = styled.div`
  color: #6c6c6c;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 2rem;
`;

const PostContent = styled.article`
  color: #232323;
  line-height: 1.5;
  font-size: 1.13rem;
  max-width: 700px;
  margin: 0 auto;
  text-align: left;

  p {
    margin-bottom: 1.1rem;
    margin-top: 0;
  }
`;

const BackButton = styled.button`
  background: #232946;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.7em 1.5em;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 2rem auto 2.5rem auto;
  display: block;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #eebbc3;
    color: #232946;
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