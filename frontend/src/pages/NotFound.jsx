import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
  background: var(--bg);
  color: var(--text);
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: 700;
  margin: 0;
  font-family: 'Inter', sans-serif;
  color: var(--text);
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  margin: 1rem 0 2rem;
  color: var(--text-muted);
  font-family: 'DM Sans', sans-serif;
`;

const HomeLink = styled(Link)`
  color: var(--accent);
  text-decoration: none;
  font-family: 'DM Sans', sans-serif;
  font-size: 1rem;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const NotFound = () => {
  return (
    <NotFoundContainer>
      <Title>404</Title>
      <Subtitle>Page not found</Subtitle>
      <HomeLink to="/">Return Home</HomeLink>
    </NotFoundContainer>
  );
};

export default NotFound; 