export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="logo-icon">🛡️</span>
            <span className="logo-text">সাইবার সুরক্ষা ৩৬০</span>
          </div>
          <p className="footer-desc">
            AI-Powered Scam Detection & Threat Intelligence for Bangladesh
          </p>
        </div>
        <div className="footer-links">
          <div className="footer-column">
            <h4>Tools</h4>
            <a href="/scan">Scam Detector</a>
            <a href="/qr-scan">URL &amp; QR Scanner</a>
            <a href="/log-scanner">Log Scanner</a>
            <a href="/job-check">Fraud Job Detection</a>
          </div>
          <div className="footer-column">
            <h4>Threat Intelligence</h4>
            <a href="/threat-map">Threat Map</a>
            <a href="/all-reports">Threat Feed</a>
            <a href="/report">Report Incident</a>
          </div>
          <div className="footer-column">
            <h4>Learn</h4>
            <a href="/learn-hub">Learning Hub</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 সাইবার সুরক্ষা ৩৬০ - Built with ❤️ for Bangladesh</p>
      </div>
    </footer>
  );
}