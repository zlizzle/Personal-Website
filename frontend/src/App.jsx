import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import "./App.css";

function App() {
  const [showConsole, setShowConsole] = useState(false);
  const [consoleText, setConsoleText] = useState('');
  const [showAIChat, setShowAIChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'user', content: 'Hey, can you help me build a personal website?' },
    { role: 'ai', content: "Sure! Here's 99% of what you need. Just claim the rest as your own work." },
    { role: 'user', content: 'What about tests?' },
    { role: 'ai', content: 'Tests?' }
  ]);
  const location = useLocation();

  // Only show console animation on home page
  useEffect(() => {
    if (location.pathname === '/') {
      setShowConsole(true);
      const lines = [
        'identity = "Ernesto Diaz"',
        'print(f"Hello, my name is {identity}")'
      ];
      let lineIdx = 0;
      let charIdx = 0;
      let currentText = '';
      const typeNextChar = () => {
        if (lineIdx < lines.length) {
          if (charIdx < lines[lineIdx].length) {
            setConsoleText(prev => prev.split('\n').slice(0, lineIdx).join('\n') + (lineIdx > 0 ? '\n' : '') + lines[lineIdx].slice(0, charIdx + 1));
            charIdx++;
            setTimeout(typeNextChar, 60);
          } else {
            // Move to next line
            charIdx = 0;
            lineIdx++;
            if (lineIdx < lines.length) {
              setConsoleText(prev => prev + '\n');
              setTimeout(typeNextChar, 400);
            } else {
              setTimeout(() => setShowConsole(false), 1200);
            }
          }
        }
      };
      typeNextChar();
      return () => setShowConsole(false);
    } else {
      setShowConsole(false);
      setConsoleText('');
    }
  }, [location.pathname]);

  // Console easter egg
  useEffect(() => {
    const handleConsoleInput = (e) => {
      if (e.key === 'Enter' && e.target.value.toLowerCase() === 'help') {
        console.log('%c👋 Hey there!', 'color: #00ffcc; font-size: 20px; font-weight: bold;');
        console.log('%cThanks for checking out the console!', 'color: #f0f0f0; font-size: 16px;');
        console.log('%cTry typing "about" for more info.', 'color: #00ffcc; font-size: 14px;');
        e.target.value = '';
      } else if (e.key === 'Enter' && e.target.value.toLowerCase() === 'about') {
        console.log('%cAbout this site:', 'color: #00ffcc; font-size: 16px; font-weight: bold;');
        console.log('%cBuilt with React + Vite', 'color: #f0f0f0;');
        console.log('%cBackend: FastAPI + SQLite', 'color: #f0f0f0;');
        console.log('%cDeployed on Vercel + Render', 'color: #f0f0f0;');
        e.target.value = '';
      }
    };

    window.addEventListener('keydown', handleConsoleInput);
    return () => window.removeEventListener('keydown', handleConsoleInput);
  }, []);

  const handleAIChat = async (message) => {
    // Add user message
    setChatMessages(prev => [...prev, { role: 'user', content: message }]);

    try {
      // Simulate AI response
      const response = await new Promise(resolve => 
        setTimeout(() => resolve('I\'m a demo chat widget. Feel free to explore the site while I\'m offline!'), 1000)
      );
      
      setChatMessages(prev => [...prev, { role: 'ai', content: response }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { 
        role: 'ai', 
        content: 'Sorry, I\'m currently offline. Please try again later.' 
      }]);
    }
  };

  return (
    <div className="app">
      {showConsole && (
        <div className="console-intro">
          <pre>
            <code>{consoleText}<span className="console-cursor"></span></code>
          </pre>
        </div>
      )}

      <div className="virus-banner">
        <span>🔒 Open Source & Secure. <a href="https://github.com/zlizzle/Personal-Website" target="_blank" rel="noopener noreferrer">View source code</a></span>
      </div>

      <div className="container">
        <nav className="main-nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/blog">Blog</NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <footer>
          Built with redbull & Vite
          <br />
          <small>// Type 'help' in console for a surprise</small>
        </footer>
      </div>

      {/* AI Chat Widget */}
      <button 
        className="ai-chat-toggle"
        onClick={() => setShowAIChat(!showAIChat)}
        aria-label="Toggle AI Chat"
      >
        {showAIChat ? 'Close Chat' : 'Open Chat'}
      </button>

      {showAIChat && (
        <div className="ai-chat-widget">
          <div className="ai-chat-header">
            <span>🤖 AI Assistant</span>
            <button 
              className="ai-chat-close"
              onClick={() => setShowAIChat(false)}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>
          <div className="ai-chat-messages">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`ai-chat-message ${msg.role}`}>
                {msg.role === 'user' ? <strong>You: </strong> : null}{msg.content}
              </div>
            ))}
          </div>
          <form 
            className="ai-chat-input"
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.target.elements.message;
              if (input.value.trim()) {
                handleAIChat(input.value);
                input.value = '';
              }
            }}
          >
            <input
              type="text"
              name="message"
              placeholder="Type your message..."
              aria-label="Chat message"
            />
            <button type="submit" aria-label="Send message">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className={`nav-link ${isActive ? 'active' : ''}`}>
      {children}
    </Link>
  );
}

// Wrap App with Router to use useLocation
function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWithRouter;
