"use client";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { openMoodSelector } = useTheme();
  const { user, logout } = useAuth();

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
          <a href="/all-reports" className="nav-link">All Reports</a>
          <a href="/report" className="nav-link">Report</a>
          <a href="/job-check" className="nav-link">Job Check</a>
          <a href="/learn-hub" className="nav-link">Learn</a>
        </div>
        <div className="nav-actions">
          <button onClick={openMoodSelector} className="mood-changer-btn">
            <i className="fas fa-palette"></i> Theme
          </button>
          {user ? (
            <>
              <span style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>
                👋 {user.full_name.split(" ")[0]}
              </span>
              <button
                onClick={logout}
                className="btn-secondary"
                style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
              >
                Log Out
              </button>
            </>
          ) : (
            <a href="/login" className="btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}>
              Log In
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}