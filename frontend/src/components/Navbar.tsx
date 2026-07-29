"use client";

import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { openMoodSelector } = useTheme();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <span className="logo-icon">🛡️</span>
          <span className="logo-text">CyberShurokkha 360</span>
        </div>
        <div className="nav-links">
          <a href="/scan" className="nav-link">Scam Detector</a>
          <a href="/qr-scan" className="nav-link">QR Scanner</a>
          <a href="/threat-map" className="nav-link">Threat Map</a>
          <a href="/report" className="nav-link">Report</a>
          <a href="/job-check" className="nav-link">Job Check</a>
          <a href="/learn" className="nav-link">Learn</a>
        </div>
        <div className="nav-actions">
          <button onClick={openMoodSelector} className="mood-changer-btn">
            <i className="fas fa-palette"></i> Theme
          </button>
        </div>
      </div>
    </nav>
  );
}