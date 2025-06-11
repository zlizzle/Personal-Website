import { useState } from "react";

function Home() {
  const [showProjects, setShowProjects] = useState(false);

  return (
    <>
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
      <div className="contact-links">
        <a href="https://x.com/zlizzle" target="_blank" rel="noopener noreferrer" title="X/Twitter" aria-label="X/Twitter" className="contact-link">
          <svg width="24" height="24" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M889.8 248H1093.29L718.01 644.57L1159.77 1175.42H874.51L604.88 865.93L304.22 1175.42H100.09L494.98 747.56L80 248H373.53L612.06 525.6L889.8 248ZM838.13 1086.47H924.3L406.91 334.71H316.74L838.13 1086.47Z" fill="currentColor"/>
          </svg>
        </a>
        <a href="https://github.com/zlizzle" target="_blank" rel="noopener noreferrer" title="GitHub" aria-label="GitHub" className="contact-link">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
            <path d="M16 2.4c-7.5 0-13.6 6.1-13.6 13.6 0 6 3.9 11.1 9.3 12.9.7.1 1-.3 1-.7v-2.7c-3.8.8-4.6-1.7-4.6-1.7-.7-1.8-1.8-2.3-1.8-2.3-1.5-1 .1-1 .1-1 1.6.1 2.4 1.6 2.4 1.6 1.5 2.4 3.9 1.7 4.8 1.3.1-1.1.6-1.7 1.1-2.1-3-.3-6.2-1.5-6.2-6.6 0-1.5.5-2.7 1.4-3.6-.1-.4-.6-1.7.1-3.5 0 0 1.2-.4 3.7 1.3a12.6 12.6 0 0 1 6.8 0c2.5-1.7 3.7-1.3 3.7-1.3.7 1.8.3 3.1.1 3.5.8.9 1.4 2.1 1.4 3.6 0 5.1-3.2 6.3-6.2 6.6.6.5 1.1 1.5 1.1 3v4.4c0 .4.3.8 1 .7C25.7 27.1 29.6 22 29.6 16c0-7.5-6.1-13.6-13.6-13.6z" fill="currentColor"/>
          </svg>
        </a>
        <a href="https://linkedin.com/in/ediaz100" target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label="LinkedIn" className="contact-link">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
            <path d="M10.67 23h-3V13.3h3V23zm-1.5-11.06c-.97 0-1.58-.66-1.58-1.48 0-.83.62-1.48 1.6-1.48.98 0 1.58.65 1.6 1.48 0 .82-.62 1.48-1.6 1.48zm12.29 11.06h-3v-4.94c0-1.24-.44-2.1-1.53-2.1-.84 0-1.33.57-1.55 1.12-.08.2-.1.47-.1.75V23h-3s.04-8.32 0-9.7h3v1.38c.4-.62 1.13-1.5 2.76-1.5 2.01 0 3.53 1.32 3.53 4.16V23z" fill="currentColor"/>
          </svg>
        </a>
      </div>

      {/* View Source Link */}
      <div className="dm-line">
        <a href="https://github.com/zlizzle/Personal-Website" target="_blank" rel="noopener noreferrer" aria-label="View Source on GitHub">
          View Source on GitHub
        </a>
      </div>
    </>
  );
}

export default Home; 