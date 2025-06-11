import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import "./App.css";

function App() {
  const [showConsole, setShowConsole] = useState(true);
  const [consoleText, setConsoleText] = useState('');
  const [showAIChat, setShowAIChat] = useState(false);

  useEffect(() => {
    const text = 'const identity = "Ernesto Diaz";';
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setConsoleText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        setTimeout(() => setShowConsole(false), 1000);
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <Router>
      <div className="app">
        {showConsole && (
          <div className="console-intro">
            <pre>
              <code>{consoleText}<span className="console-cursor"></span></code>
            </pre>
          </div>
        )}

        <div className="virus-banner">
          <span>🚨 This site is virus-free. <a href="https://github.com/zlizzle/Personal-Website" target="_blank" rel="noopener noreferrer">View source</a> to verify.</span>
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

        <button 
          className="ai-chat-toggle"
          onClick={() => setShowAIChat(!showAIChat)}
          aria-label="Toggle AI Chat"
        >
          {showAIChat ? 'Close Chat' : 'Open Chat'}
        </button>
      </div>
    </Router>
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

export default App;
