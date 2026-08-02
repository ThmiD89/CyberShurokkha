"use client";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { openMoodSelector } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [threatMenuOpen, setThreatMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo" onClick={() => router.push("/")} style={{ cursor: "pointer" }}>
          <span className="logo-icon">🛡️</span>
          <span className="logo-text">সাইবার সুরক্ষা ৩৬০</span>
        </div>
        <div className="nav-links">
          <div
            onMouseEnter={() => setThreatMenuOpen(true)}
            onMouseLeave={() => setThreatMenuOpen(false)}
            style={{ position: "relative", display: "inline-block" }}
          >
            <span className="nav-link" style={{ cursor: "pointer" }}>
              Threat Intelligence <i className="fas fa-chevron-down" style={{ fontSize: "0.65rem", marginLeft: "0.3rem" }}></i>
            </span>
            {threatMenuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  background: "var(--card-bg)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "0.75rem",
                  boxShadow: "var(--card-shadow)",
                  minWidth: "190px",
                  padding: "0.5rem",
                  zIndex: 50,
                }}
              >
                <a href="/threat-map" className="nav-link" style={{ display: "block", padding: "0.5rem 0.75rem" }}>
                  Threat Map
                </a>
                <a href="/all-reports" className="nav-link" style={{ display: "block", padding: "0.5rem 0.75rem" }}>
                  Threat Feed
                </a>
                <a href="/report" className="nav-link" style={{ display: "block", padding: "0.5rem 0.75rem" }}>
                  Report Incident
                </a>
              </div>
            )}
          </div>
          <a href="/qr-scan" className="nav-link">URL &amp; QR Scanner</a>
          <a href="/log-scanner" className="nav-link">Log Scanner</a>
          <a href="/scan" className="nav-link">Scam Detector</a>
          <a href="/job-check" className="nav-link">Fraud Job Detection</a>
          <a href="/learn-hub" className="nav-link">Learning Hub</a>
        </div>
        <div className="nav-actions">
          {/* Appearance button with theme preview dots */}
          <button onClick={openMoodSelector} className="mood-changer-btn">
            <span className="theme-preview-mini">
              <span className="theme-preview-dot" style={{ backgroundColor: 'var(--btn-primary)' }} />
              <span className="theme-preview-dot" style={{ backgroundColor: 'var(--bg-secondary)' }} />
              <span className="theme-preview-dot" style={{ backgroundColor: 'var(--text-primary)' }} />
            </span>
            Appearance
          </button>

          {user ? (
            <div
              onMouseEnter={() => setUserMenuOpen(true)}
              onMouseLeave={() => setUserMenuOpen(false)}
              style={{ position: "relative", display: "inline-block" }}
            >
              <span style={{ fontSize: "0.85rem", color: "var(--text-primary)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                👋 {user.full_name.split(" ")[0]} <i className="fas fa-chevron-down" style={{ fontSize: "0.65rem" }}></i>
              </span>
              {userMenuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    background: "var(--card-bg)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "0.75rem",
                    boxShadow: "var(--card-shadow)",
                    minWidth: "150px",
                    padding: "0.5rem",
                    zIndex: 50,
                  }}
                >
                  <a href="/dashboard" className="nav-link" style={{ display: "block", padding: "0.5rem 0.75rem" }}>
                    Dashboard
                  </a>
                  <button
                    onClick={logout}
                    style={{ display: "block", width: "100%", textAlign: "left", padding: "0.5rem 0.75rem", background: "transparent", border: "none", color: "var(--text-primary)", cursor: "pointer", fontSize: "0.88rem", fontWeight: 500 }}
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
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