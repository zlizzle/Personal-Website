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

const HeroSection = styled.div`
  position: relative;
  width: 100%;
  min-height: 220px;
  background: 
    linear-gradient(rgba(36,36,36,0.45), rgba(36,36,36,0.45)),
    url(${props => props.img}) center/cover no-repeat,
    #232946; /* fallback color */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  filter: grayscale(0.2) brightness(0.8);
  margin-bottom: 2.5rem;
  border-radius: 10px 10px 0 0;
`;

const HeroOverlay = styled.div`
  background: rgba(36, 36, 36, 0.45);
  padding: 2.5rem 2rem;
  border-radius: 10px;
  text-align: center;
`;

const HeroTitle = styled.h1`
  color: #fff;
  font-family: 'Lato', Arial, Helvetica, sans-serif;
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.7rem;
  text-shadow: 0 2px 12px #232946cc, 0 1px 0 #0008;
`;

const HeroSubtitle = styled.div`
  color: #ffd583;
  font-family: 'Merriweather', Georgia, serif;
  font-size: 1.2rem;
  font-style: italic;
  text-shadow: 0 1px 6px #23294699;
`;

const PostContent = styled.article`
  font-family: 'Merriweather', Georgia, serif;
  color: #232323;
  background: #fcfbf7;
  border: 1.5px solid #ece7df;
  border-radius: 0 0 8px 8px;
  padding: 2.5rem 2rem;
  margin: 0 auto 2rem auto;
  line-height: 1.85;
  font-size: 1.15rem;
  max-width: 600px;
  text-align: left !important;
  box-shadow: 0 2px 8px #f8e7bb18;

  p {
    margin-bottom: 1.7rem;
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
  background: #232946;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.7em 1.5em;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  display: inline-block;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #eebbc3;
    color: #232946;
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