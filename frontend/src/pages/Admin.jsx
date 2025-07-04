import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const AdminContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--surface);
  color: var(--text);
  border-radius: 4px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid var(--text-muted);
  border-radius: 4px;
  background: var(--bg);
  color: var(--text);
  font-size: 1rem;
  width: 100%;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--accent);
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid var(--text-muted);
  border-radius: 4px;
  background: var(--bg);
  color: var(--text);
  font-size: 1rem;
  min-height: 200px;
  resize: vertical;
  width: 100%;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--accent);
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: var(--accent);
  color: var(--bg);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s ease;

  &:hover {
    background: var(--accent-hover);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 4px;
  background: ${props => props.success ? 'rgba(0, 255, 204, 0.1)' : 'rgba(255, 0, 0, 0.1)'};
  color: ${props => props.success ? 'var(--accent)' : '#ff6b6b'};
`;

const PostsList = styled.div`
  margin-top: 2rem;
  border-top: 1px solid var(--text-muted);
  padding-top: 1.5rem;

  h2 {
    color: var(--accent);
    margin-bottom: 1rem;
    font-size: 1.3rem;
  }

  p {
    color: var(--text-muted);
    font-style: italic;
  }
`;

const PostItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 0.5rem;
  background: var(--bg);
  border-radius: 4px;
  transition: background-color 0.2s ease;

  &:hover {
    background: var(--surface-hover);
  }
`;

const PostInfo = styled.div`
  flex: 1;
`;

const PostTitle = styled.h3`
  margin: 0;
  color: var(--text);
  font-size: 1.1rem;
  font-weight: 600;
`;

const PostSlug = styled.div`
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-top: 0.25rem;
`;

const DeleteButton = styled.button`
  background: #ff6b6b;
  color: var(--bg);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-left: 1rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #ff8787;
  }

  &:disabled {
    background: var(--text-muted);
    cursor: not-allowed;
  }
`;

const Admin = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [posts, setPosts] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch posts when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      setMessage('Error fetching posts');
      setIsSuccess(false);
    }
  };

  const handleDelete = async (slug) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/blog/${slug}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (response.ok) {
        setMessage('Post deleted successfully');
        setIsSuccess(true);
        // Refresh the posts list
        fetchPosts();
      } else {
        setMessage('Failed to delete post');
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage('Error deleting post');
      setIsSuccess(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('adminToken', data.access_token);
        setIsAuthenticated(true);
        setAuthError('');
      } else {
        setAuthError('Invalid password');
      }
    } catch (error) {
      setAuthError('Error connecting to server');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create a slug from the title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({
          title,
          content,
          slug,
        }),
      });

      if (response.ok) {
        setMessage('Blog post added successfully!');
        setIsSuccess(true);
        setTitle('');
        setContent('');
      } else {
        setMessage('Failed to add blog post. Please try again.');
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage('Error: Could not connect to the server.');
      setIsSuccess(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <AdminContainer>
        <h1>Admin Access</h1>
        <Form onSubmit={handleAuth}>
          <div>
            <label htmlFor="password">Password:</label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Login</Button>
          {authError && <Message success={false}>{authError}</Message>}
        </Form>
      </AdminContainer>
    );
  }

  return (
    <AdminContainer>
      <h1>Blog Admin</h1>
      
      {/* New Post Form */}
      <h2>Add New Post</h2>
      <Form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <TextArea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Add Post</Button>
      </Form>
      {message && <Message success={isSuccess}>{message}</Message>}

      {/* Existing Posts List */}
      <PostsList>
        <h2>Existing Posts</h2>
        {posts.map((post) => (
          <PostItem key={post.id}>
            <PostInfo>
              <PostTitle>{post.title}</PostTitle>
              <PostSlug>/{post.slug}</PostSlug>
            </PostInfo>
            <DeleteButton 
              onClick={() => handleDelete(post.slug)}
              disabled={isDeleting}
            >
              Delete
            </DeleteButton>
          </PostItem>
        ))}
        {posts.length === 0 && (
          <p>No posts yet. Add your first post above!</p>
        )}
      </PostsList>
    </AdminContainer>
  );
};

export default Admin; 