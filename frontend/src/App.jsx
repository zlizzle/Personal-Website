import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
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

        {/* Navigation */}
        <nav className="main-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/blog" className="nav-link">Blog</Link>
          {/* <li><Link to="/admin">Admin</Link></li> */}
        </nav>

        {/* Render child routes */}
        <Outlet />
      </div>

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
                const response = await fetch("https://personal-website-ul2i.onrender.com/poke", {
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
                  setTimeout(() => setPokeSent(false), 5000);
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

      {/* AI Chat Toggle */}
      <button
        className="ai-chat-toggle"
        onClick={() => setShowAIChat(!showAIChat)}
        aria-label={showAIChat ? "Hide AI" : "Ask AI"}
      >
        {showAIChat ? "Hide AI" : "Ask AI"}
      </button>

      {/* AI Chat Widget */}
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

      {/* Footer */}
      <footer>
        © {new Date().getFullYear()} All rights reserved.
      </footer>
    </>
  );
}

export default App;
