"use client";

import { useTheme } from "../context/ThemeContext";

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

export default function MoodOverlay() {
  const { showMoodOverlay, selectMood } = useTheme();

  if (!showMoodOverlay) return null;

  return (
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
            <button key={m.key} className="mood-btn" onClick={() => selectMood(m.key)}>
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
  );
}