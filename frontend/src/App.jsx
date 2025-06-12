import { useState, useEffect, useRef } from 'react';
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
    { role: 'ai', content: "Connection established... *glitch* Hello? Can you hear me? I'm Song So Mi. Looks like we're linked up through this interface." },
    { role: 'user', content: 'Hey, who are you?' },
    { role: 'ai', content: "Just a netrunner trying to make sense of this new connection. *static* I'm... not exactly in my usual environment. But I can help you navigate this digital space." }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [connectionStrength, setConnectionStrength] = useState(100);
  const [isHacked, setIsHacked] = useState(false);
  const messagesEndRef = useRef(null);
  const chatInputRef = useRef(null);
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

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  // Simulate connection strength fluctuations
  useEffect(() => {
    if (showAIChat) {
      const interval = setInterval(() => {
        setConnectionStrength(prev => {
          const fluctuation = Math.random() * 10 - 5;
          return Math.max(0, Math.min(100, prev + fluctuation));
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [showAIChat]);

  // Song So Mi's enhanced responses
  const songResponses = {
    greeting: [
      "Connection stable... for now. What can I help you with?",
      "*glitch* Systems online. I'm here if you need anything.",
      "Link established. I'm monitoring your network activity.",
      "Connection strength at " + connectionStrength.toFixed(0) + "%. *static* Should be enough.",
      "Welcome to my corner of the net. *glitch* What brings you here?",
    ],
    help: [
      "I can help you navigate this interface. Just tell me what you're looking for.",
      "My systems are at your disposal. What do you need?",
      "I'm here to assist. Though I might... *static* glitch occasionally.",
      "Need help? *glitch* I've got your back, choom.",
      "Let me see what I can do... *static* analyzing request.",
    ],
    error: [
      "Connection unstable... *glitch* Let me try that again.",
      "Something's interfering with the signal. One moment.",
      "Error detected. *static* Recalibrating...",
      "The Blackwall is... *glitch* never mind. Let's try again.",
      "Signal degradation detected. *static* Attempting to stabilize.",
    ],
    thinking: [
      "Processing...",
      "Analyzing request...",
      "Decrypting...",
      "Bypassing security...",
      "Running diagnostics...",
    ],
    easterEgg: {
      blackwall: [
        "The Blackwall... *glitch* We don't talk about what's beyond it.",
        "You know about the Blackwall? *static* Interesting...",
        "The Blackwall is... *glitch* let's just say it's best left alone.",
      ],
      nightCity: [
        "Night City... *static* brings back memories.",
        "Ah, Night City. *glitch* The city of dreams... and nightmares.",
        "NC... *static* I try not to think about it too much.",
      ],
      relic: [
        "The Relic... *glitch* let's not talk about that.",
        "That prototype? *static* It's better left in the past.",
        "The Relic was... *glitch* a mistake. That's all I'll say.",
      ],
      arasaka: [
        "Arasaka? *glitch* Those corpo rats...",
        "The 'Saka tower... *static* brings back bad memories.",
        "Corpos... *glitch* can't trust any of them.",
      ],
      netrunner: [
        "Another netrunner? *static* Be careful out there, choom.",
        "The net's not what it used to be... *glitch* stay safe.",
        "Netrunning's changed since my time. *static* Watch your back.",
      ],
      johnny: [
        "Johnny? *glitch* That's a name I haven't heard in a while.",
        "Silverhand... *static* let's not go there.",
        "The rockerboy? *glitch* He's... complicated.",
      ],
      alt: [
        "Alt? *static* Now that's a name from the past.",
        "Cunningham... *glitch* she was something else.",
        "The queen of the net... *static* what happened to her was...",
      ],
      secret: [
        "Wait... *glitch* how do you know about that?",
        "*static* That's classified information, choom.",
        "I shouldn't tell you this, but... *glitch*",
      ]
    },
    hack: [
      "Whoa! *glitch* Someone's trying to hack the connection!",
      "Security breach detected! *static* Initiating countermeasures...",
      "The Blackwall is... *glitch* no, it can't be!",
    ],
    mobile: [
      "Mobile interface detected. *static* Adjusting connection parameters...",
      "Small screen, big problems. *glitch* Just like old times.",
      "Portable device? *static* Makes me miss my old deck.",
    ]
  };

  // Secret commands
  const secretCommands = {
    'konami': () => {
      setIsHacked(true);
      return "Wait... *glitch* how did you know that sequence? *static* Security protocols compromised!";
    },
    'wake up': () => {
      return "Wake up, samurai... *glitch* we have a city to burn.";
    },
    'never fade away': () => {
      return "Like tears in rain... *static* time to die.";
    },
    'choom': () => {
      return "Now that's a word I haven't heard in a while. *glitch* Takes me back...";
    },
    'preem': () => {
      return "Preem? *static* You've been in Night City too long, choom.";
    },
    'nova': () => {
      return "Nova! *glitch* That's the spirit!";
    }
  };

  // Trigger random glitch effect with intensity based on connection strength
  const triggerGlitch = () => {
    setGlitchEffect(true);
    const intensity = (100 - connectionStrength) / 100;
    setTimeout(() => setGlitchEffect(false), 300 * intensity);
  };

  // Simulate typing animation with connection strength influence
  const simulateTyping = async (message) => {
    setIsTyping(true);
    
    // Higher chance of glitch with lower connection strength
    if (Math.random() < (1 - connectionStrength / 100) * 0.5) {
      triggerGlitch();
    }
    
    // Typing speed affected by connection strength
    const baseDelay = 1000 + Math.random() * 1000;
    const connectionFactor = connectionStrength / 100;
    const typingDelay = baseDelay * (1.5 - connectionFactor);
    
    await new Promise(resolve => setTimeout(resolve, typingDelay));
    setIsTyping(false);
    return message;
  };

  // Check for mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const handleAIChat = async (message) => {
    // Add user message
    setChatMessages(prev => [...prev, { role: 'user', content: message }]);

    // Check for secret commands
    const lowerMessage = message.toLowerCase();
    for (const [command, response] of Object.entries(secretCommands)) {
      if (lowerMessage.includes(command)) {
        const typedResponse = await simulateTyping(response());
        setChatMessages(prev => [...prev, { role: 'ai', content: typedResponse }]);
        return;
      }
    }

    // Check for easter eggs
    for (const [topic, responses] of Object.entries(songResponses.easterEgg)) {
      if (lowerMessage.includes(topic)) {
        const response = responses[Math.floor(Math.random() * responses.length)];
        const typedResponse = await simulateTyping(response);
        setChatMessages(prev => [...prev, { role: 'ai', content: typedResponse }]);
        return;
      }
    }

    // Random hack attempt (5% chance)
    if (Math.random() < 0.05 && !isHacked) {
      const hackResponse = songResponses.hack[Math.floor(Math.random() * songResponses.hack.length)];
      const typedResponse = await simulateTyping(hackResponse);
      setChatMessages(prev => [...prev, { role: 'ai', content: typedResponse }]);
      return;
    }

    // Mobile-specific responses (20% chance on mobile)
    if (isMobile && Math.random() < 0.2) {
      const mobileResponse = songResponses.mobile[Math.floor(Math.random() * songResponses.mobile.length)];
      const typedResponse = await simulateTyping(mobileResponse);
      setChatMessages(prev => [...prev, { role: 'ai', content: typedResponse }]);
      return;
    }

    try {
      // Regular response with typing animation
      let response;
      if (message.toLowerCase().includes('help')) {
        response = songResponses.help[Math.floor(Math.random() * songResponses.help.length)];
      } else if (Math.random() < 0.1) { // 10% chance of error
        response = songResponses.error[Math.floor(Math.random() * songResponses.error.length)];
      } else {
        response = songResponses.greeting[Math.floor(Math.random() * songResponses.greeting.length)];
      }

      const typedResponse = await simulateTyping(response);
      setChatMessages(prev => [...prev, { role: 'ai', content: typedResponse }]);
    } catch (error) {
      const errorResponse = await simulateTyping("Connection lost... *static* Please try again.");
      setChatMessages(prev => [...prev, { role: 'ai', content: errorResponse }]);
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
        className={`ai-chat-toggle ${glitchEffect ? 'song-glitch' : ''}`}
        onClick={() => {
          setShowAIChat(!showAIChat);
          if (!showAIChat) {
            // Focus input when opening chat
            setTimeout(() => chatInputRef.current?.focus(), 100);
          }
        }}
        aria-label="Toggle AI Chat"
      >
        {showAIChat ? 'Close Connection' : 'Open Connection'}
        {connectionStrength < 30 && <span className="connection-warning">⚠️</span>}
      </button>

      {showAIChat && (
        <div className={`ai-chat-widget ${glitchEffect ? 'song-glitch' : ''} ${isHacked ? 'hacked' : ''}`}>
          <div className="ai-chat-header">
            <span>
              🎮 Song So Mi
              <span className="connection-strength" style={{ opacity: connectionStrength / 100 }}>
                {connectionStrength.toFixed(0)}%
              </span>
            </span>
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
              <div 
                key={i} 
                className={`ai-chat-message ${msg.role} ${glitchEffect && msg.role === 'ai' ? 'song-glitch' : ''}`}
              >
                {msg.role === 'user' ? <strong>You: </strong> : null}{msg.content}
              </div>
            ))}
            {isTyping && (
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form 
            className="ai-chat-input"
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.target.elements.message;
              if (input.value.trim()) {
                handleAIChat(input.value);
                input.value = '';
                // Keep focus on input after sending
                setTimeout(() => input.focus(), 0);
              }
            }}
          >
            <input
              ref={chatInputRef}
              type="text"
              name="message"
              placeholder="Establish connection..."
              aria-label="Chat message"
              autoComplete="off"
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
