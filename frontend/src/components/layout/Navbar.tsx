"use client";
import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const { openMoodSelector } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [threatMenuOpen, setThreatMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname === href;

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        <div className="nav-logo" onClick={() => router.push("/")} style={{ cursor: "pointer" }}>
          <img src="/logo.svg" alt="সাইবার সুরক্ষা ৩৬০" style={{ height: "74px", width: "auto" }} />
        </div>
        <div className="nav-links">
          <div
            onMouseEnter={() => setThreatMenuOpen(true)}
            onMouseLeave={() => setThreatMenuOpen(false)}
            style={{ position: "relative", display: "inline-block" }}
          >
            <span
              className={`nav-link ${
                isActive("/threat-map") || isActive("/all-reports") || isActive("/report") ? "active" : ""
              }`}
              style={{ cursor: "pointer" }}
            >
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
                  padding: "0.6rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                  zIndex: 50,
                }}
              >
                <a href="/threat-map" className={`nav-link ${isActive("/threat-map") ? "active" : ""}`}>
                  Threat Map
                </a>
                <a href="/all-reports" className={`nav-link ${isActive("/all-reports") ? "active" : ""}`}>
                  Threat Feed
                </a>
                <a href="/report" className={`nav-link ${isActive("/report") ? "active" : ""}`}>
                  Report Incident
                </a>
              </div>
            )}
          </div>
          <a href="/qr-scan" className={`nav-link ${isActive("/qr-scan") ? "active" : ""}`}>URL &amp; QR Scanner</a>
          <a href="/log-scanner" className={`nav-link ${isActive("/log-scanner") ? "active" : ""}`}>Log Scanner</a>
          <a href="/scan" className={`nav-link ${isActive("/scan") ? "active" : ""}`}>Scam Detector</a>
          <a href="/job-check" className={`nav-link ${isActive("/job-check") ? "active" : ""}`}>Fraud Job Detection</a>
          <a href="/learn-hub" className={`nav-link ${isActive("/learn-hub") ? "active" : ""}`}>Learning Hub</a>
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
                    padding: "0.6rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.4rem",
                    zIndex: 50,
                  }}
                >
                  <a href="/dashboard" className="nav-link">
                    Dashboard
                  </a>
                  {user.role === "admin" && (
                    <a href="/admin" className="nav-link">
                      Admin Panel
                    </a>
                  )}
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