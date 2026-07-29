export default function Footer() {
  return (
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
            <a href="/threat-map">Threat Map</a>
            <a href="/report">Report Scam</a>
          </div>
          <div className="footer-column">
            <h4>Learn</h4>
            <a href="/learn-hub">Learning Hub</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 CyberShurokkha 360 - Built with ❤️ for Bangladesh</p>
      </div>
    </footer>
  );
}