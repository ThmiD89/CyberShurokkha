"use client";

import { useTheme, THEMES } from "../../context/ThemeContext";

export default function MoodOverlay() {
  const { theme, selectMood, showMoodOverlay } = useTheme();

  if (!showMoodOverlay) return null;

  // Map theme IDs to descriptions
  const getDescription = (id: string) => {
    const descriptions: Record<string, string> = {
      default: "Soft Lavender",
      dark: "Sleek & Mysterious",
      happy: "Bright & Energetic",
      calm: "Peaceful & Relaxed",
      energetic: "Vibrant & Dynamic",
      professional: "Corporate & Formal",
      white: "Clean & Minimal",
      sad: "Mellow & Deep",
    };
    return descriptions[id] || "";
  };

  return (
    <div className="mood-overlay">
      <div className="mood-container">
        <button 
          className="mood-close-btn"
          onClick={() => selectMood(theme)}
          aria-label="Close mood selector"
        >
          ✕
        </button>

        <div className="mood-header">
          <div className="mood-brand">
            <span className="mood-logo-icon">🛡️</span>
            <span className="mood-logo-text">সাইবার সুরক্ষা ৩৬০</span>
          </div>
          <h1 className="mood-title">AI-Powered Scam Detection Platform</h1>
          <p className="mood-question">How are you feeling today?</p>
        </div> Input cards about my head and phase now appoint two o'clock that's okay live map I am sad user at the top. Thirty percent

        <div className="mood-grid">
          {THEMES.map((t) => (
            <button
              key={t.id}
              className={`mood-btn ${theme === t.id ? "active" : ""}`}
              onClick={() => selectMood(t.id)}
            >
              <div className="theme-swatch">
                {t.colors.map((color, i) => (
                  <span 
                    key={i} 
                    className="theme-swatch-color"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="mood-emoji">{t.emoji}</span>
              <span className="mood-name">{t.name}</span>
              <span className="mood-desc">{getDescription(t.id)}</span>
            </button>
          ))}
        </div>

        <div className="mood-footer">
          <p className="mood-note">Your mood preference will be saved</p>
        </div>
      </div>
    </div>
  );
}