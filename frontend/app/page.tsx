"use client";

import { useState, useEffect } from "react";
import { useTheme } from "../src/context/ThemeContext";

// List of all available moods/themes
const moods = [
  { key: "default", emoji: "🪻", name: "Default", desc: "Soft Lavender" },
  { key: "happy", emoji: "😊", name: "Happy", desc: "Bright & Energetic" },
  { key: "calm", emoji: "🌊", name: "Calm", desc: "Peaceful & Relaxed" },
  { key: "dark", emoji: "🌙", name: "Dark", desc: "Sleek & Mysterious" },
  { key: "energetic", emoji: "⚡", name: "Energetic", desc: "Vibrant & Dynamic" },
  { key: "white", emoji: "🤍", name: "White", desc: "Clean & Minimal" },
  { key: "professional", emoji: "💼", name: "Professional", desc: "Corporate & Formal" },
  { key: "sad", emoji: "😔", name: "Sad", desc: "Mellow & Deep" },
];

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [showMoodOverlay, setShowMoodOverlay] = useState(false);

  // Check if user already has a saved mood
  useEffect(() => {
    const saved = localStorage.getItem("lumen_mood_preference");
    if (saved) {
      setShowMoodOverlay(false); // Hide overlay if they already chose
    } else {
      setShowMoodOverlay(true); // Show overlay for first-time visitors
    }
  }, []);

  // When user clicks a mood
  const handleMoodSelect = (moodKey: string) => {
    setTheme(moodKey);
    setShowMoodOverlay(false);
  };

  // Show mood overlay (when "Theme" button is clicked)
  const handleShowMoodOverlay = () => {
    setShowMoodOverlay(true);
  };

  return (
    <>
      {/* ===== MOOD SELECTOR OVERLAY ===== */}
      {showMoodOverlay && (
        <div className="mood-overlay" style={{ display: "flex" }}>
          <div className="mood-container">
            <div className="mood-header">
              <div className="lumen-icon">
                <span className="shield-icon">🛡️</span>
              </div>
              <h1 className="mood-title">CyberShurokkha 360</h1>
              <p className="mood-subtitle">AI-Powered Scam Detection Platform</p>
              <p className="mood-question">How are you feeling today?</p>
            </div>

            <div className="mood-grid">
              {moods.map((m) => (
                <button
                  key={m.key}
                  className="mood-btn"
                  onClick={() => handleMoodSelect(m.key)}
                >
                  <span className="mood-emoji">{m.emoji}</span>
                  <span className="mood-name">{m.name}</span>
                  <span className="mood-desc">{m.desc}</span>
                </button>
              ))}
            </div>

            <div className="mood-footer">
              <p className="mood-note">✨ Your mood preference will be saved ✨</p>
            </div>
          </div>
        </div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <div
        id="mainContent"
        className="main-content"
        style={{ display: showMoodOverlay ? "none" : "block" }}
      >
        {/* ===== NAVIGATION ===== */}
        <nav className="navbar">
          <div className="nav-container">
            <div className="nav-logo">
              <span className="logo-icon">🛡️</span>
              <span className="logo-text">CyberShurokkha 360</span>
            </div>
            <div className="nav-links">
              <a href="/scan" className="nav-link">Scam Detector</a>
              <a href="/qr-scan" className="nav-link">QR Scanner</a>
              <a href="/map" className="nav-link">Threat Map</a>
              <a href="/report" className="nav-link">Report</a>
              <a href="/job-check" className="nav-link">Job Check</a>
              <a href="/learn" className="nav-link">Learn</a>
            </div>
            <div className="nav-actions">
              <button onClick={handleShowMoodOverlay} className="mood-changer-btn">
                <i className="fas fa-palette"></i> Theme
              </button>
            </div>
          </div>
        </nav>

        {/* ===== HERO SECTION ===== */}
        <section className="hero-section">
          <div className="hero-container">
            <div className="hero-badge">
              <span className="badge-icon">🔒</span>
              <span>AI-Powered Security Analysis</span>
            </div>
            <h1 className="hero-title">
              Detect Scams Instantly,<br />
              <span className="hero-highlight">Protect Bangladesh</span>
            </h1>
            <p className="hero-subtitle">
              Paste a suspicious SMS, email, or QR code to check if it's a scam.
              Community-driven threat map for Bangladesh.
            </p>
            <div className="hero-buttons">
              <a href="/scan" className="btn-primary">
                <i className="fas fa-rocket"></i> Try Scam Detector
              </a>
              <a href="/map" className="btn-secondary">
                <i className="fas fa-map"></i> View Threat Map
              </a>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">64</span>
                <span className="stat-label">Districts Covered</span>
              </div>
              <div className="stat">
                <span className="stat-number">AI</span>
                <span className="stat-label">Powered Detection</span>
              </div>
              <div className="stat">
                <span className="stat-number">Free</span>
                <span className="stat-label">For Everyone</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="logo-icon">🛡️</span>
                <span className="logo-text">CyberShurokkha 360</span>
              </div>
              <p className="footer-desc">
                AI-Powered Scam Detection & Threat Intelligence for Bangladesh
              </p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Tools</h4>
                <a href="/scan">Scam Detector</a>
                <a href="/qr-scan">QR Scanner</a>
                <a href="/job-check">Job Check</a>
              </div>
              <div className="footer-column">
                <h4>Community</h4>
                <a href="/map">Threat Map</a>
                <a href="/report">Report Scam</a>
              </div>
              <div className="footer-column">
                <h4>Learn</h4>
                <a href="/learn">Learning Hub</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 CyberShurokkha 360 - Built with ❤️ for Bangladesh</p>
          </div>
        </footer>
      </div>
    </>
  );
}