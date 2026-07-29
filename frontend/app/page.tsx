export default function Home() {
  return (
    <div className="main-content">
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
            <a href="/threat-map" className="btn-secondary">
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
    </div>
  );
}