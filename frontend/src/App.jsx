import { useState } from "react";
import "./App.css";

function App() {
  const [showBanner, setShowBanner] = useState(true);
  const [showProjects, setShowProjects] = useState(false);
  const [pokeHandle, setPokeHandle] = useState("");
  const [pokeMsg, setPokeMsg] = useState("");
  const [pokeSent, setPokeSent] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [pokeAttempts, setPokeAttempts] = useState(0);
  const [pokeError, setPokeError] = useState(false);
  const [pokeBackendError, setPokeBackendError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pokeRetryAfter, setPokeRetryAfter] = useState(60);

  return (
    <>
      <div className="container">
        {/* Virus Banner */}
        {showBanner && (
          <div className="virus-banner">
            ⚠️ WARNING: You are now infected with Vibe.js. Some boring code on this site may have been hallucinated by AI.
            <button onClick={() => setShowBanner(false)}>Dismiss</button>
          </div>
        )}

        {/* Name and intro */}
        <h1>Ernesto Diaz, SWE</h1>
        <p>Backend-focused software engineer, API design, and technical problem-solving.</p>

        {/* Projects button/list */}
        <button onClick={() => setShowProjects(!showProjects)}>
          {showProjects ? "Hide Projects" : "Show Projects"}
        </button>
        {showProjects && (
          <div className="projects-list">
            <h2>Projects</h2>
            <ul>
              <li>
                <strong>Portfolio Tracker</strong> – Python/FastAPI/Rust. Tracks your assets. Perhaps, in the future a DEX.
              </li>
              <li>
                <strong>This Website!</strong> – React/FastAPI, open source.
              </li>
            </ul>
          </div>
        )}

        {/* Socials row */}
        <div className="socials-row">
          <a href="https://x.com/zlizzle" target="_blank" rel="noopener noreferrer" title="X/Twitter" aria-label="X/Twitter">
            {/* Modern X Logo */}
            <svg width="32" height="32" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="1200" height="1227" rx="240" fill="#eebbc3"/>
              <path d="M889.8 248H1093.29L718.01 644.57L1159.77 1175.42H874.51L604.88 865.93L304.22 1175.42H100.09L494.98 747.56L80 248H373.53L612.06 525.6L889.8 248ZM838.13 1086.47H924.3L406.91 334.71H316.74L838.13 1086.47Z" fill="#232946"/>
            </svg>
          </a>
          <a href="https://github.com/zlizzle" target="_blank" rel="noopener noreferrer" title="GitHub" aria-label="GitHub">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 2.4c-7.5 0-13.6 6.1-13.6 13.6 0 6 3.9 11.1 9.3 12.9.7.1 1-.3 1-.7v-2.7c-3.8.8-4.6-1.7-4.6-1.7-.7-1.8-1.8-2.3-1.8-2.3-1.5-1 .1-1 .1-1 1.6.1 2.4 1.6 2.4 1.6 1.5 2.4 3.9 1.7 4.8 1.3.1-1.1.6-1.7 1.1-2.1-3-.3-6.2-1.5-6.2-6.6 0-1.5.5-2.7 1.4-3.6-.1-.4-.6-1.7.1-3.5 0 0 1.2-.4 3.7 1.3a12.6 12.6 0 0 1 6.8 0c2.5-1.7 3.7-1.3 3.7-1.3.7 1.8.3 3.1.1 3.5.8.9 1.4 2.1 1.4 3.6 0 5.1-3.2 6.3-6.2 6.6.6.5 1.1 1.5 1.1 3v4.4c0 .4.3.8 1 .7C25.7 27.1 29.6 22 29.6 16c0-7.5-6.1-13.6-13.6-13.6z" fill="#eebbc3"/>
            </svg>
          </a>
          <a href="https://linkedin.com/in/ediaz100" target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label="LinkedIn">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="2" y="2" width="28" height="28" rx="6" fill="#eebbc3"/>
              <path d="M10.67 23h-3V13.3h3V23zm-1.5-11.06c-.97 0-1.58-.66-1.58-1.48 0-.83.62-1.48 1.6-1.48.98 0 1.58.65 1.6 1.48 0 .82-.62 1.48-1.6 1.48zm12.29 11.06h-3v-4.94c0-1.24-.44-2.1-1.53-2.1-.84 0-1.33.57-1.55 1.12-.08.2-.1.47-.1.75V23h-3s.04-8.32 0-9.7h3v1.38c.4-.62 1.13-1.5 2.76-1.5 2.01 0 3.53 1.32 3.53 4.16V23z" fill="#232946"/>
            </svg>
          </a>
        </div>

        {/* View Source Link */}
        <div className="view-source-link">
          <a href="https://github.com/zlizzle/Personal-Website" target="_blank" rel="noopener noreferrer" aria-label="View Source on GitHub">
            View Source on GitHub
          </a>
        </div>
      </div> {/* End .container */}

      {/* Poke Section as Card or Sticky Footer */}
      <div className="poke-section">
        <h2>Poke Me</h2>
        {/* Backend error (fetch failed or server error) */}
        {pokeBackendError && (
          <div className="poke-backend-error">
            🚨 Server error: Couldn't send your poke.<br />
            <em>Try again in a minute, or check your network connection.</em>
          </div>
        )}
        {pokeError ? (
          <div className="poke-easter-egg">
            🛑 Ouch! You poked a little too hard. (Try again in {pokeRetryAfter} seconds.)
          </div>
        ) : pokeSent ? (
          <div className="poke-thankyou">
            Thanks for the poke! I'll see your handle in my logs (eventually 😉).
          </div>
        ) : (
          // Accessible poke form
          <form
            aria-label="Poke form"
            onSubmit={async e => {
              e.preventDefault();
              setPokeBackendError(false);

              if (pokeAttempts >= 3) {
                setPokeError(true);
                return;
              }
              setPokeAttempts(prev => prev + 1);
              setIsSubmitting(true);

              // Send poke data to backend
              try {
                const response = await fetch("https://your-backend.onrender.com/poke", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    handle: pokeHandle,
                    message: pokeMsg
                  }),
                });
                const result = await response.json();
                if (result.success) {
                  setPokeSent(true);
                  setPokeHandle("");
                  setPokeMsg("");
                  setTimeout(() => setPokeSent(false), 2000);
                } else {
                  setPokeError(true);
                  // Try to get Retry-After header from response
                  const retryAfter = response.headers.get("Retry-After");
                  setPokeRetryAfter(retryAfter ? parseInt(retryAfter, 10) : 60);
                }
              } catch (err) {
                setPokeError(true);
                setPokeRetryAfter(60);
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            {/* Twitter handle input with ARIA label */}
            <label htmlFor="poke-handle">Your X (Twitter) handle:</label>
            <input
              id="poke-handle"
              type="text"
              value={pokeHandle}
              onChange={e => setPokeHandle(e.target.value)}
              placeholder="@yourhandle"
              required
              aria-required="true"
              aria-label="Your X (Twitter) handle"
            />
            {/* Optional message input with ARIA label */}
            <label htmlFor="poke-message">Optional message:</label>
            <input
              id="poke-message"
              type="text"
              value={pokeMsg}
              onChange={e => setPokeMsg(e.target.value)}
              placeholder="Say hi!"
              aria-label="Optional message"
            />
            {/* Submit button with ARIA label */}
            <button type="submit" aria-label="Send poke" disabled={isSubmitting}>Poke</button>
            {/* Subtle sending message */}
            {isSubmitting && (
              <div style={{textAlign: 'center', color: '#ffd583', marginTop: '0.5em', fontSize: '0.98em'}} aria-live="polite">Sending...</div>
            )}
          </form>
        )}
      </div>

      {/* AI Chat Widget Toggle and Widget */}
      <button
        className="ai-chat-toggle"
        onClick={() => setShowAIChat(!showAIChat)}
        style={{
          position: "fixed",
          right: "2vw",
          bottom: "80px",
          zIndex: 150,
          borderRadius: "20px",
          background: "#ffd583",
          color: "#232323",
          border: "1.5px solid #232323",
          padding: "0.4em 1.2em",
          cursor: "pointer",
          fontFamily: "monospace",
          fontWeight: "bold",
          fontSize: "1em",
          boxShadow: "0 2px 8px rgba(34,34,54,0.12)"
        }}
        aria-label={showAIChat ? "Hide AI" : "Ask AI"}
      >
        {showAIChat ? "Hide AI" : "Ask AI"}
      </button>

      {showAIChat && (
        <div className="ai-chat-widget">
          <div className="ai-chat-header">🤖 AI Assistant</div>
          <div className="ai-chat-body">
            <div className="ai-chat-msg user">
              <span className="chat-label">You:</span>
              Can you help me build a personal website?
            </div>
            <div className="ai-chat-msg ai">
              <span className="chat-label">AI:</span>
              Sure! Here's 99% of it. Just copy-paste and claim the vibes.
            </div>
            <div className="ai-chat-msg user">
              <span className="chat-label">You:</span>
              Wait, what about tests?
            </div>
            <div className="ai-chat-msg ai">
              <span className="chat-label">AI:</span>
              Tests?
            </div>
          </div>
          <div className="ai-chat-footer">
            <em>Powered by Redbull</em>
          </div>
        </div>
      )}

      {/* Copyright Footer */}
      <footer style={{textAlign: 'center', fontSize: '0.93em', color: '#bbb', margin: '1.5em 0 0.5em 0'}}>
        © {new Date().getFullYear()} All rights reserved.
      </footer>
    </>
  );
}

export default App;
