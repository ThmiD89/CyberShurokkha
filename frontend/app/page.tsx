"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "../src/context/AuthContext";
import AnimatedNumber from "../src/components/AnimatedNumber";
import HomepageActivity from "../src/components/HomepageActivity";

function FadeInSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`fade-in-section ${visible ? "is-visible" : ""} ${className}`}>
      {children}
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const [stats, setStats] = useState<{ total_checks: number; dangerous_count: number; total_reports: number } | null>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("http://localhost:8000/platform-stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {});
  }, []);

  // IntersectionObserver to restart animation when stats come into view
  useEffect(() => {
    const node = statsRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Increment key to remount AnimatedNumber components
          setAnimationKey((prev) => prev + 1);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="main-content">
      {/* ===== HERO SECTION ===== */}
      <section className="hero-section hero-video-section">
        <video
          className="hero-video-bg"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="hero-video-overlay"></div>
        <div className="hero-container" style={{ position: "relative", zIndex: 2 }}>
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

          {/* Stats container with ref for visibility detection */}
          <div className="hero-stats" ref={statsRef}>
            <div className="stat">
              <span className="stat-number">
                <AnimatedNumber
                  key={`districts-${animationKey}`}
                  value={64}
                  duration={1200}
                  delay={300}
                />
              </span>
              <span className="stat-label">Districts Covered</span>
            </div>
            <div className="stat">
              <span className="stat-number">
                {stats ? (
                  <AnimatedNumber
                    key={`scans-${animationKey}`}
                    value={stats.total_checks}
                    duration={1500}
                    delay={500}
                    formatter={(n) => n.toLocaleString()}
                  />
                ) : (
                  <span className="opacity-50">—</span>
                )}
              </span>
              <span className="stat-label">Scans Run</span>
            </div>
            <div className="stat">
              <span className="stat-number stat-free">Free</span>
              <span className="stat-label">For Everyone</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <FadeInSection>
        <section className="how-it-works">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Three steps to check if something's a scam.</p>
          <div className="how-it-works-grid">
            <div className="how-it-works-step">
              <div className="how-it-works-icon">
                <i className="fas fa-paste"></i>
              </div>
              <span className="how-it-works-number">STEP 1</span>
              <div className="how-it-works-title">Paste or Upload</div>
              <div className="how-it-works-desc">
                Drop in a suspicious SMS, link, QR code, job post, or log file.
              </div>
            </div>
            <div className="how-it-works-step">
              <div className="how-it-works-icon">
                <i className="fas fa-brain"></i>
              </div>
              <span className="how-it-works-number">STEP 2</span>
              <div className="how-it-works-title">AI Analyzes It</div>
              <div className="how-it-works-desc">
                Our models check it against known scam and attack patterns in seconds.
              </div>
            </div>
            <div className="how-it-works-step">
              <div className="how-it-works-icon">
                <i className="fas fa-shield-halved"></i>
              </div>
              <span className="how-it-works-number">STEP 3</span>
              <div className="how-it-works-title">Get Your Risk Score</div>
              <div className="how-it-works-desc">
                See a clear verdict and plain‑language explanation of what to do next.
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ===== SHIELD BANNER ===== */}
      <FadeInSection>
        <section className="shield-banner">
          <img src="/images/bangladesh-shield.png" alt="" className="shield-banner-bg" />
          <div className="shield-banner-overlay"></div>
          <div className="shield-banner-content">
            <h2>Guarding All 64 Districts</h2>
            <p>
              Every scam check, QR scan, job posting, and log file you run feeds a
              growing threat picture of Bangladesh — helping every citizen stay a
              step ahead of scammers.
            </p>
          </div>
        </section>
      </FadeInSection>

      {/* ===== MODULES ===== */}
      <FadeInSection>
        <section className="modules-section">
          <h2 className="section-title">Our Modules</h2>
          <p className="section-subtitle">
            Six tools working together to keep you safe online.
          </p>
          <div className="modules-grid">
            <a href="/scan" className="module-card">
              <img src="/images/scam-alert.png" alt="Scam Detector" className="module-card-image" />
              <div className="module-card-body">
                <div className="module-card-title">📩 Scam Detector</div>
                <div className="module-card-desc">
                  Paste a suspicious SMS or email and get an instant AI risk score,
                  with a plain‑language explanation of what looks off.
                </div>
              </div>
            </a>

            <a href="/qr-scan" className="module-card">
              <img src="/images/qr-verify.png" alt="URL & QR Scanner" className="module-card-image" />
              <div className="module-card-body">
                <div className="module-card-title">🔗 URL & QR Scanner</div>
                <div className="module-card-desc">
                  Upload a QR code or paste a link — we check it against known
                  phishing patterns before you ever open it.
                </div>
              </div>
            </a>

            <a href="/log-scanner" className="module-card">
              <img src="/images/log-scanner.png" alt="Log Scanner" className="module-card-image" />
              <div className="module-card-body">
                <div className="module-card-title">🛰️ Log Scanner</div>
                <div className="module-card-desc">
                  Upload an Apache/Nginx, Linux, or Windows security log and get
                  automatic detection of brute‑force attacks, SQL injection, and more.
                </div>
              </div>
            </a>

            <a href="/threat-map" className="module-card">
              <img src="/images/threat-dashboard.png" alt="Threat Intelligence" className="module-card-image" />
              <div className="module-card-body">
                <div className="module-card-title">🌍 Threat Intelligence</div>
                <div className="module-card-desc">
                  A live map of scam reports across all 64 districts, built from
                  what the community has reported.
                </div>
              </div>
            </a>

            <a href="/job-check" className="module-card">
              <img src="/images/job-verification.png" alt="Fraud Job Detection" className="module-card-image" />
              <div className="module-card-body">
                <div className="module-card-title">🕵️ Fraud Job Detection</div>
                <div className="module-card-desc">
                  Paste a job posting and our model flags red flags like upfront
                  payment requests or unrealistic salary claims.
                </div>
              </div>
            </a>

            <a href="/learn-hub" className="module-card">
              <img src="/images/learning-hub.png" alt="Learning Hub" className="module-card-image" />
              <div className="module-card-body">
                <div className="module-card-title">🎓 Learning Hub</div>
                <div className="module-card-desc">
                  Bite‑sized lessons and quizzes that build your scam‑spotting
                  skills, tier by tier.
                </div>
              </div>
            </a>
          </div>
        </section>
      </FadeInSection>


      {/* ===== LIVE ACTIVITY ===== */}
      <FadeInSection>
        <HomepageActivity />
      </FadeInSection>          

      {/* ===== HOTLINE / CONTACT ===== */}
      <FadeInSection>
        <section className="hotline-section" style={{ padding: "4rem 2rem", background: "var(--bg-primary)" }}>
          <div className="container" style={{ maxWidth: "1280px", margin: "0 auto", textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1.5rem", borderRadius: "2rem", background: "var(--card-bg)", border: "1px solid var(--border-color)", marginBottom: "1.5rem" }}>
              <span style={{ fontSize: "1.2rem" }}>🆘</span>
              <span style={{ fontWeight: 600, color: "var(--text-dark)" }}>Need urgent help?</span>
            </div>
            <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-dark)", marginBottom: "1rem" }}>
              Report a scam or get support
            </h2>
            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto 2rem" }}>
              If you've been targeted by a scam, call our helpline or email us – we're here to help.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap" }}>
              <a href="tel:+8801533143206" style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.8rem 1.8rem", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "3rem", textDecoration: "none", color: "var(--text-dark)", fontWeight: 500, boxShadow: "var(--card-shadow)", transition: "transform 0.2s" }}>
                <span style={{ fontSize: "1.5rem" }}>📞</span>
                <span>+880 1234-56789</span>
              </a>
              <a href="mailto:support@cybershurokkha.com" style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.8rem 1.8rem", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "3rem", textDecoration: "none", color: "var(--text-dark)", fontWeight: 500, boxShadow: "var(--card-shadow)", transition: "transform 0.2s" }}>
                <span style={{ fontSize: "1.5rem" }}>✉️</span>
                <span>support@cybershurokkha.com</span>
              </a>
              <a href="/report" style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.8rem 1.8rem", background: "var(--btn-primary)", border: "none", borderRadius: "3rem", textDecoration: "none", color: "white", fontWeight: 600, boxShadow: "var(--card-shadow)", transition: "transform 0.2s" }}>
                <span>🚨</span>
                <span>Report Now</span>
              </a>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ===== CLOSING CTA ===== */}
      <FadeInSection>
        <section className="closing-cta">
          <h2>Ready to Protect Yourself?</h2>
          <p>
            Join thousands of Bangladeshis staying ahead of scams — track your
            checks, earn progress in the Learning Hub, and help build a safer
            digital community.
          </p>
          <div className="closing-cta-buttons">
            {user ? (
              <a href="/dashboard" className="btn-primary">
                <i className="fas fa-gauge"></i> Go to Dashboard
              </a>
            ) : (
              <a href="/signup" className="btn-primary">
                <i className="fas fa-user-plus"></i> Get Started Free
              </a>
            )}
            <a href="/scan" className="btn-secondary">
              <i className="fas fa-rocket"></i> Try It Now
            </a>
          </div>
        </section>
      </FadeInSection>
    </div>
  );
}