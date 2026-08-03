export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="logo-icon">🛡️</span>
            <span className="logo-text">সাইবার সুরক্ষা ৩৬০</span>
          </div>
          <p className="footer-desc">
            AI-Powered Scam Detection & Threat Intelligence for Bangladesh
          </p>
          {/* Hotline - moved here for quick access */}
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <a href="tel:+880123456789" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              📞 +880 1234-56789
            </a>
            <a href="mailto:support@cybershurokkha.com" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              ✉️ support@cybershurokkha.com
            </a>
          </div>
        </div>

        {/* Footer Links - 4 columns */}
        <div className="footer-links" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
          {/* Tools */}
          <div className="footer-column">
            <h4>Tools</h4>
            <a href="/scan">Scam Detector</a>
            <a href="/qr-scan">URL &amp; QR Scanner</a>
            <a href="/log-scanner">Log Scanner</a>
            <a href="/job-check">Fraud Job Detection</a>
          </div>

          {/* Threat Intelligence */}
          <div className="footer-column">
            <h4>Threat Intelligence</h4>
            <a href="/threat-map">Threat Map</a>
            <a href="/all-reports">Threat Feed</a>
            <a href="/report">Report Incident</a>
          </div>

          {/* Learn & Support */}
          <div className="footer-column">
            <h4>Learn</h4>
            <a href="/learn-hub">Learning Hub</a>
            <h4 style={{ marginTop: "1.5rem" }}>Support</h4>
            <a href="/faq">FAQ</a>
            <a href="/contact">Contact Us</a>
          </div>

          {/* Legal & Social */}
          <div className="footer-column">
            <h4>Legal</h4>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/cookies">Cookie Policy</a>
            
            {/* Social Icons */}
            <h4 style={{ marginTop: "1.5rem" }}>Follow Us</h4>
            <div style={{ display: "flex", gap: "0.8rem", marginTop: "0.5rem" }}>
              <a href="#" target="_blank" rel="noopener noreferrer" style={{ fontSize: "1.3rem", color: "var(--text-secondary)", transition: "color 0.3s" }} onMouseEnter={(e) => e.currentTarget.style.color = "#1877f2"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}>
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" style={{ fontSize: "1.3rem", color: "var(--text-secondary)", transition: "color 0.3s" }} onMouseEnter={(e) => e.currentTarget.style.color = "#1da1f2"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}>
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" style={{ fontSize: "1.3rem", color: "var(--text-secondary)", transition: "color 0.3s" }} onMouseEnter={(e) => e.currentTarget.style.color = "#0a66c2"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}>
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" style={{ fontSize: "1.3rem", color: "var(--text-secondary)", transition: "color 0.3s" }} onMouseEnter={(e) => e.currentTarget.style.color = "#ff0000"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}>
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar with extra info */}
      <div className="footer-bottom">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <p>&copy; 2026 সাইবার সুরক্ষা ৩৬০ - Built with ❤️ for Bangladesh</p>
          <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            <span>🔒 Secured by SSL</span>
            <span>🇧🇩 Made in Bangladesh</span>
          </div>
        </div>
      </div>
    </footer>
  );
}