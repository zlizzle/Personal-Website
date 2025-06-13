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
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [connectionStrength, setConnectionStrength] = useState(100);
  const [isHacked, setIsHacked] = useState(false);
  const messagesEndRef = useRef(null);
  const chatInputRef = useRef(null);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [lastResponses, setLastResponses] = useState({
    greeting: [],
    help: [],
    error: [],
    idle: [],
    easterEgg: {}
  });
  const [showHints, setShowHints] = useState(true);
  const [hintIndex, setHintIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  const hints = [
    "Try asking for 'help' to see what I can do...",
    "I'm Song So Mi, a netrunner from Night City. *glitch* Ask me about the Blackwall...",
    "Curious about my past? Try asking about 'Arasaka' or 'Johnny'...",
    "The net's full of secrets. *static* Try asking about 'Night City' or 'netrunner'...",
    "Need a break? Just send '...' and I'll keep you company...",
    "Want to see something cool? Try typing 'konami'...",
    "The Blackwall's been acting up lately. *glitch* Ask me about it...",
    "I know a thing or two about the old net. *static* Ask me about 'Alt'...",
    "Sometimes I get a bit... *glitch* glitchy. Don't worry, it's normal.",
    "Try saying 'choom' or 'preem' - old netrunner slang...",
  ];

  // Only show console animation on home page, but only once per session
  useEffect(() => {
    if (location.pathname === '/') {
      // Only play if not already played this session
      if (!sessionStorage.getItem('consoleIntroPlayed')) {
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
                // Mark as played
                sessionStorage.setItem('consoleIntroPlayed', 'true');
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
    } else {
      setShowConsole(false);
      setConsoleText('');
    }
  }, [location.pathname]);

  // Console easter egg
  useEffect(() => {
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;

    // Override console.log to catch our special commands
    console.log = function(...args) {
      const input = args[0];
      if (typeof input === 'string') {
        if (input.toLowerCase() === 'help') {
          originalConsoleLog('%c👋 Hey there!', 'color: #00ffcc; font-size: 20px; font-weight: bold;');
          originalConsoleLog('%cThanks for checking out the console!', 'color: #f0f0f0; font-size: 16px;');
          originalConsoleLog('%cTry typing "about" for more info.', 'color: #00ffcc; font-size: 14px;');
          return;
        } else if (input.toLowerCase() === 'about') {
          originalConsoleLog('%cAbout this site:', 'color: #00ffcc; font-size: 16px; font-weight: bold;');
          originalConsoleLog('%cBuilt with React + Vite', 'color: #f0f0f0;');
          originalConsoleLog('%cBackend: FastAPI + SQLite', 'color: #f0f0f0;');
          originalConsoleLog('%cDeployed on Vercel + Render', 'color: #f0f0f0;');
          return;
        }
      }
      originalConsoleLog.apply(console, args);
    };

    // Restore original console methods on cleanup
    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
    };
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

  // Song So Mi's enhanced responses with more variety
  const songResponses = {
    greeting: [
      "Hey there, choom. *glitch* What brings you to my corner of the net?",
      "Well, well... *static* Another visitor. I'm Song So Mi, but you probably already knew that.",
      "Connection's stable. *glitch* Though I'm more interested in why you're here.",
      "Welcome to my little slice of the net. *static* What can I do for you today?",
      "Another face in the crowd... *glitch* I'm listening.",
      "Song So Mi at your service. *static* Though I'm curious what you're looking for.",
      "Been a while since I had company. *glitch* What's on your mind?",
      "You've got my attention. *static* What brings you to this part of the net?",
      "Another netrunner in the wild? *glitch* Interesting...",
      "The signal's strong today. *static* What brings you to my corner of the net?",
      "Been a while since I had a proper conversation. *glitch* What's on your mind?",
      "You've got my attention. *static* Though I'm curious what you're looking for.",
      "Connection established. *glitch* I'm Song So Mi, but you probably knew that.",
      "Welcome to my little slice of the net. *static* What can I do for you?",
      "Another face in the crowd... *glitch* I'm listening.",
      "The net's been quiet lately. *static* Good to have some company.",
      "You've got a strong signal. *glitch* Must be a decent deck you're running.",
      "Another visitor... *static* I hope you're not with the corpos.",
      "The Blackwall's been acting up. *glitch* But that's not why you're here, is it?",
      "Connection's stable. *static* For now, anyway.",
    ],
    help: [
      "Need a hand? *glitch* I've got a few tricks up my sleeve.",
      "Let me see what I can do... *static* Though I'm not exactly in my usual environment.",
      "I might be a bit... *glitch* displaced, but I can still help.",
      "Another netrunner's work is never done. *static* What do you need?",
      "I've seen my share of code. *glitch* Maybe I can help you navigate this.",
      "The net's changed since my time, but I can still find my way around. *static* What's the problem?",
      "Need a guide through this digital maze? *glitch* I'm your netrunner.",
      "Let's see what we're working with... *static* analyzing request.",
      "I've got some experience with this. *glitch* Let me take a look.",
      "The old net taught me a few things. *static* Maybe I can help.",
      "Another puzzle to solve? *glitch* I'm in.",
      "Let me check the parameters... *static* I might have a solution.",
      "The net's full of surprises. *glitch* But I know my way around.",
      "Need a hand with something specific? *static* I'm all ears.",
      "I've got a few tricks up my sleeve. *glitch* What do you need?",
      "Need a hand with something? *glitch* I've got a few tricks up my sleeve.",
      "Let me see what I can do... *static* Though I'm not exactly in my usual environment.",
      "I might be a bit... *glitch* displaced, but I can still help.",
      "Another netrunner's work is never done. *static* What do you need?",
      "I've seen my share of code. *glitch* Maybe I can help you navigate this.",
      "The net's changed since my time, but I can still find my way around. *static* What's the problem?",
      "Need a guide through this digital maze? *glitch* I'm your netrunner.",
      "Let's see what we're working with... *static* analyzing request.",
      "I've got some experience with this. *glitch* Let me take a look.",
      "The old net taught me a few things. *static* Maybe I can help.",
      "Another puzzle to solve? *glitch* I'm in.",
      "Let me check the parameters... *static* I might have a solution.",
      "The net's full of surprises. *glitch* But I know my way around.",
      "Need a hand with something specific? *static* I'm all ears.",
      "I've got a few tricks up my sleeve. *glitch* What do you need?",
    ],
    error: [
      "Something's... *glitch* not right here. Let me try that again.",
      "The signal's getting fuzzy. *static* One moment while I recalibrate.",
      "Error detected. *glitch* Must be something in the air.",
      "The Blackwall's... *static* never mind. Let's try a different approach.",
      "Signal's acting up. *glitch* Happens more often than I'd like.",
      "Connection's a bit shaky. *static* Give me a second to stabilize.",
      "Something's interfering. *glitch* Probably just net traffic.",
      "Error in the matrix. *static* Let me clean that up.",
      "The connection's unstable. *glitch* Give me a moment.",
      "Something's blocking the signal. *static* Let me try to bypass it.",
      "Error in the protocol. *glitch* Must be the Blackwall acting up.",
      "The net's being weird today. *static* Let me try again.",
      "Connection's dropping packets. *glitch* One moment...",
      "Something's not right in the matrix. *static* Let me fix that.",
      "The signal's corrupted. *glitch* I'll try to clean it up.",
    ],
    thinking: [
      "Processing your request... *glitch*",
      "Running through the possibilities... *static*",
      "Decrypting the data... *glitch*",
      "Bypassing security protocols... *static*",
      "Analyzing the situation... *glitch*",
      "Checking the parameters... *static*",
      "Running diagnostics... *glitch*",
      "Calculating optimal path... *static*",
    ],
    easterEgg: {
      blackwall: [
        "The Blackwall... *glitch* We don't talk about what's beyond it. Not anymore.",
        "You know about the Blackwall? *static* That's... interesting. And dangerous.",
        "The Blackwall is... *glitch* let's just say some things should stay forgotten.",
        "Beyond the Blackwall lies... *static* no. We shouldn't go there.",
      ],
      nightCity: [
        "Night City... *static* brings back memories. Good and bad.",
        "Ah, NC. *glitch* The city of dreams... and nightmares. Mostly nightmares.",
        "NC... *static* I try not to think about it too much. Too many ghosts.",
        "The city that never sleeps... *glitch* because it's too busy dying.",
      ],
      relic: [
        "The Relic... *glitch* let's not talk about that. Too many bad memories.",
        "That prototype? *static* It's better left in the past. Trust me.",
        "The Relic was... *glitch* a mistake. That's all I'll say about that.",
        "Mikoshi, the Relic... *static* some things should stay buried.",
      ],
      arasaka: [
        "Arasaka? *glitch* Those corpo rats... they never learn.",
        "The 'Saka tower... *static* brings back bad memories. Very bad memories.",
        "Corpos... *glitch* can't trust any of them. Especially the 'Saka ones.",
        "Arasaka's still around? *static* Some things never change, I guess.",
      ],
      netrunner: [
        "Another netrunner? *static* Be careful out there, choom. The net's not what it used to be.",
        "The net's changed since my time... *glitch* stay safe. Watch your back.",
        "Netrunning's a dangerous game. *static* I should know.",
        "The old net... *glitch* now that was something else. Before the crash.",
      ],
      johnny: [
        "Johnny? *glitch* That's a name I haven't heard in a while. A long while.",
        "Silverhand... *static* let's not go there. Too complicated.",
        "The rockerboy? *glitch* He's... complicated. Like most legends.",
        "Johnny Silverhand... *static* now there's a ghost from the past.",
      ],
      alt: [
        "Alt? *static* Now that's a name from the past. The queen of the net.",
        "Cunningham... *glitch* she was something else. Changed everything.",
        "The queen of the net... *static* what happened to her was... tragic.",
        "Alt Cunningham... *glitch* now there was a netrunner.",
      ],
      secret: [
        "Wait... *glitch* how do you know about that? That's... concerning.",
        "*static* That's classified information, choom. Very classified.",
        "I shouldn't tell you this, but... *glitch* maybe you deserve to know.",
        "That's... *static* not something we should discuss here.",
      ]
    },
    hack: [
      "Whoa! *glitch* Someone's trying to hack the connection! Feels familiar...",
      "Security breach detected! *static* Reminds me of the old days.",
      "The Blackwall is... *glitch* no, it can't be! Not again!",
      "Someone's poking around... *static* I know that signature.",
    ],
    mobile: [
      "Mobile interface? *static* Makes me miss my old deck. Those were the days.",
      "Small screen, big problems. *glitch* Just like old times.",
      "Portable device? *static* At least it's not a 'Saka terminal.",
      "Mobile connection... *glitch* reminds me of my first deck.",
    ],
    idle: [
      "Still here? *static* The net's a big place, you know.",
      "Connection's stable... *glitch* for now, anyway.",
      "You're quiet. *static* That's fine. I'm used to waiting.",
      "The net never sleeps... *glitch* but I don't mind the company.",
      "Lost in thought? *static* Happens to the best of us.",
      "Need a moment? *glitch* I've got time.",
      "The signal's clear... *static* whenever you're ready.",
      "Just... *glitch* thinking about the old days.",
      "The net's quiet today. *static* Too quiet, maybe.",
      "Lost in the matrix? *glitch* I know the feeling.",
      "The Blackwall's been quiet. *static* For once.",
      "Another quiet moment in the net. *glitch* I don't mind.",
      "The signal's strong. *static* No rush.",
      "Thinking about something? *glitch* Take your time.",
      "The net's vast. *static* Easy to get lost in thought.",
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

  // Improved mobile detection using media query
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };
    
    // Initial check
    checkMobile();
    
    // Add listener for window resize
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Helper function to get a non-recent response
  const getNonRecentResponse = (responses, category, maxRecent = 3) => {
    const recentResponses = lastResponses[category] || [];
    const availableResponses = responses.filter(r => !recentResponses.includes(r));
    
    // If all responses have been used recently, reset the memory
    if (availableResponses.length === 0) {
      setLastResponses(prev => ({ ...prev, [category]: [] }));
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    const response = availableResponses[Math.floor(Math.random() * availableResponses.length)];
    setLastResponses(prev => ({
      ...prev,
      [category]: [...(prev[category] || []).slice(-maxRecent), response]
    }));
    return response;
  };

  // Show a new hint every 30 seconds if hints are enabled
  useEffect(() => {
    if (!showHints || !showAIChat || hasInteracted) return;

    const hintInterval = setInterval(() => {
      setHintIndex(prev => (prev + 1) % hints.length);
    }, 30000);

    return () => clearInterval(hintInterval);
  }, [showHints, showAIChat, hasInteracted]);

  // Reset hints when chat is closed
  useEffect(() => {
    if (!showAIChat) {
      setShowHints(true);
      setHintIndex(0);
      setHasInteracted(false);
    }
  }, [showAIChat]);

  const handleAIChat = async (message) => {
    setHasInteracted(true); // Mark that user has interacted
    console.log('handleAIChat called with:', message);
    // Add user message
    setChatMessages(prev => [...prev, { role: 'user', content: message }]);

    // Check for secret commands
    const lowerMessage = message.toLowerCase();
    console.log('Checking message:', lowerMessage);
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
      if (lowerMessage.includes('help')) {
        response = getNonRecentResponse(songResponses.help, 'help');
      } else if (message.trim().length === 0 || lowerMessage.includes('...')) {
        response = getNonRecentResponse(songResponses.idle, 'idle');
      } else if (Math.random() < 0.1) { // 10% chance of error
        response = getNonRecentResponse(songResponses.error, 'error');
      } else {
        response = getNonRecentResponse(songResponses.greeting, 'greeting');
      }

      const typedResponse = await simulateTyping(response);
      setChatMessages(prev => [...prev, { role: 'ai', content: typedResponse }]);
    } catch (error) {
      const errorResponse = await simulateTyping("Connection lost... *static* Please try again.");
      setChatMessages(prev => [...prev, { role: 'ai', content: errorResponse }]);
    }
  };

  // Add initial greeting when chat is first opened
  useEffect(() => {
    if (showAIChat && !hasInteracted && chatMessages.length === 0) {
      const initialGreeting = "Connection established. *glitch* I'm Song So Mi, a netrunner from Night City. I'm here to chat, help, or just keep you company. *static* What brings you to this corner of the net?";
      simulateTyping(initialGreeting).then(typedResponse => {
        setChatMessages([{ role: 'ai', content: typedResponse }]);
      });
    }
  }, [showAIChat, hasInteracted, chatMessages.length]);

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
        aria-label={showAIChat ? "Close chat with Song So Mi" : "Open chat with Song So Mi"}
      >
        {connectionStrength < 30 && <span className="connection-warning">⚠️</span>}
      </button>

      {showAIChat && (
        <div className={`ai-chat-widget ${glitchEffect ? 'song-glitch' : ''} ${isHacked ? 'hacked' : ''}`}>
          <div className="ai-chat-header">
            <span className="ai-header-left">
              <img 
                src="/song-avatar.png" 
                alt="Song So Mi" 
                className="ai-header-avatar"
              />
              <span className="ai-header-title">Song So Mi</span>
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
          {showHints && !hasInteracted && (
            <div className="ai-chat-hint">
              <span className="hint-icon">💡</span>
              {hints[hintIndex]}
            </div>
          )}
          <form 
            className="ai-chat-input"
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.target.elements.message;
              console.log('Form submitted with value:', input.value);
              if (input.value.trim()) {
                console.log('Calling handleAIChat with:', input.value);
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
