import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const PostContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--surface);
  border-radius: 4px;
`;

const BackButtonRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1.5rem;
`;

const PostTitle = styled.h1`
  margin: 0 0 1rem 0;
  color: var(--text);
  font-size: 2.5rem;
  font-weight: 600;
  letter-spacing: -0.02em;
`;

const PostMeta = styled.div`
  color: var(--text-muted);
  font-size: 1rem;
  margin-bottom: 2rem;
  font-family: 'DM Sans', sans-serif;
`;

const HeroSection = styled.div`
  position: relative;
  width: 100%;
  min-height: 280px;
  background: 
    linear-gradient(rgba(18, 18, 18, 0.8), rgba(18, 18, 18, 0.8)),
    url(${props => props.img}) center/cover no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  border-radius: 4px;
`;

const HeroOverlay = styled.div`
  background: var(--surface);
  padding: 2rem;
  border-radius: 4px;
  text-align: center;
`;

const HeroTitle = styled.h1`
  color: var(--text);
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
`;

const HeroSubtitle = styled.div`
  color: var(--accent);
  font-size: 1.2rem;
  font-family: 'DM Sans', sans-serif;
`;

const PostContent = styled.article`
  color: var(--text-muted);
  background: var(--bg);
  border-radius: 4px;
  padding: 2rem;
  margin: 0 auto 2rem auto;
  line-height: 1.8;
  font-size: 1.1rem;
  max-width: 700px;

  p {
    margin-bottom: 1.5rem;
    margin-top: 0;
    text-align: left;
  }

  .subtitle {
    color: var(--accent);
    margin-bottom: 2rem;
    font-size: 1.2rem;
    font-family: 'DM Sans', sans-serif;
    display: block;
    text-align: left;
  }
`;

const BackButton = styled.button`
  background: var(--accent);
  color: var(--bg);
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: var(--accent-hover);
  }
`;

const heavySlug = 'a-stillness-that-builds'; // or use post.weight === 'heavy' if available
const HERO_IMAGE_URL = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80';

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

  // Split content into blocks by double newlines for paragraphs
  const blocks = post.content.split(/\n\n+/).filter(b => b.trim());
  const subtitle = blocks[0];
  const rest = blocks.slice(1);

  // Detect if this is a heavy post
  const isHeavy = slug === heavySlug; // or post.weight === 'heavy'

  // Optionally, treat the last 4 blocks as the final block for heavy posts
  let mainBlocks = rest;

  return (
    <PostContainer>
      {isHeavy && (
        <HeroSection img={HERO_IMAGE_URL}>
          <HeroOverlay>
            <HeroTitle>{post.title}</HeroTitle>
            <HeroSubtitle>{subtitle}</HeroSubtitle>
          </HeroOverlay>
        </HeroSection>
      )}
      {!isHeavy && (
        <>
          <BackButtonRow>
            <BackButton onClick={() => navigate('/blog')}>
              ← Back to Blog
            </BackButton>
          </BackButtonRow>
          <PostTitle>{post.title}</PostTitle>
          <PostMeta>Posted on {new Date(post.created_at).toLocaleDateString()}</PostMeta>
        </>
      )}
      <PostContent>
        {!isHeavy && <span className="subtitle">{subtitle}</span>}
        {mainBlocks.map((block, index) => (
          <p key={index}>
            {block.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < block.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        ))}
      </PostContent>
    </PostContainer>
  );
};

export default BlogPost;