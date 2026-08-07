"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "../src/context/AuthContext";
import AnimatedNumber from "../src/components/widgets/AnimatedNumber";
import HomepageActivity from "../src/components/widgets/HomepageActivity";

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
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/platform-stats`)
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
          <div className="container" style={{ maxWidth: "1280px", margin: "0 auto" }}>
            {/* Section Header */}
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 1.5rem", borderRadius: "2rem", background: "var(--accent)", color: "white", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.5px", marginBottom: "1rem" }}>
                🆘 জরুরি সহায়তা
              </div>
              <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-dark)", marginBottom: "0.5rem" }}>
                Report a Scam or Get Support
              </h2>
              <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto" }}>
                If you've been targeted by a scam, contact us or reach out to these official helplines.
              </p>
            </div>

            {/* Two-column layout: CyberShurokkha support + Emergency numbers */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
              {/* Left: CyberShurokkha Support */}
              <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "1rem", padding: "2rem", boxShadow: "var(--card-shadow)" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-dark)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span>🛡️</span> CyberShurokkha 360 Support
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <a href="tel:999" style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.8rem 1rem", background: "var(--bg-secondary)", borderRadius: "0.75rem", textDecoration: "none", color: "var(--text-dark)", transition: "all 0.2s" }}>
                    <span style={{ fontSize: "1.3rem" }}>📞</span>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>Hotline</div>
                      <div style={{ fontWeight: 600 }}>999</div>
                    </div>
                  </a>
                  <a href="mailto:support@cybershurokkha.com" style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.8rem 1rem", background: "var(--bg-secondary)", borderRadius: "0.75rem", textDecoration: "none", color: "var(--text-dark)", transition: "all 0.2s" }}>
                    <span style={{ fontSize: "1.3rem" }}>✉️</span>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>Email</div>
                      <div style={{ fontWeight: 600 }}>support@cybershurokkha.com</div>
                    </div>
                  </a>
                  <a href="/report" style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.8rem 1rem", background: "var(--btn-primary)", borderRadius: "0.75rem", textDecoration: "none", color: "white", fontWeight: 600, justifyContent: "center", transition: "all 0.2s" }}>
                    <span>🚨</span> Report Now
                  </a>
                </div>
              </div>

              {/* Right: Emergency Helplines (Bangladesh) */}
              <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "1rem", padding: "2rem", boxShadow: "var(--card-shadow)" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-dark)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span>🇧🇩</span> জাতীয় জরুরি সেবা
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                  <a href="tel:999" style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.6rem 0.8rem", background: "var(--bg-secondary)", borderRadius: "0.5rem", textDecoration: "none", color: "var(--text-dark)", fontSize: "0.85rem", transition: "all 0.2s" }}>
                    <span style={{ fontWeight: 700, color: "var(--accent)" }}>৯৯৯</span>
                    <span>জাতীয় জরুরি সেবা</span>
                  </a>
                  <a href="tel:333" style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.6rem 0.8rem", background: "var(--bg-secondary)", borderRadius: "0.5rem", textDecoration: "none", color: "var(--text-dark)", fontSize: "0.85rem", transition: "all 0.2s" }}>
                    <span style={{ fontWeight: 700, color: "var(--accent)" }}>৩৩৩</span>
                    <span>জাতীয় তথ্য সেবা</span>
                  </a>
                  <a href="tel:16263" style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.6rem 0.8rem", background: "var(--bg-secondary)", borderRadius: "0.5rem", textDecoration: "none", color: "var(--text-dark)", fontSize: "0.85rem", transition: "all 0.2s" }}>
                    <span style={{ fontWeight: 700, color: "var(--accent)" }}>১৬২৬৩</span>
                    <span>স্বাস্থ্য বাতায়ন</span>
                  </a>
                  <a href="tel:1098" style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.6rem 0.8rem", background: "var(--bg-secondary)", borderRadius: "0.5rem", textDecoration: "none", color: "var(--text-dark)", fontSize: "0.85rem", transition: "all 0.2s" }}>
                    <span style={{ fontWeight: 700, color: "var(--accent)" }}>১০৯৮</span>
                    <span>শিশু সহায়তা</span>
                  </a>
                  <a href="tel:109" style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.6rem 0.8rem", background: "var(--bg-secondary)", borderRadius: "0.5rem", textDecoration: "none", color: "var(--text-dark)", fontSize: "0.85rem", transition: "all 0.2s" }}>
                    <span style={{ fontWeight: 700, color: "var(--accent)" }}>১০৯</span>
                    <span>নারী ও শিশু নির্যাতন</span>
                  </a>
                  <a href="tel:106" style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.6rem 0.8rem", background: "var(--bg-secondary)", borderRadius: "0.5rem", textDecoration: "none", color: "var(--text-dark)", fontSize: "0.85rem", transition: "all 0.2s" }}>
                    <span style={{ fontWeight: 700, color: "var(--accent)" }}>১০৬</span>
                    <span>দুদক হটলাইন</span>
                  </a>
                  <a href="tel:16430" style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.6rem 0.8rem", background: "var(--bg-secondary)", borderRadius: "0.5rem", textDecoration: "none", color: "var(--text-dark)", fontSize: "0.85rem", transition: "all 0.2s" }}>
                    <span style={{ fontWeight: 700, color: "var(--accent)" }}>১৬৪৩০</span>
                    <span>জরুরি আইন সেবা</span>
                  </a>
                </div>
                <p style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "0.8rem", textAlign: "center" }}>
                  📍 ঢাকা, বাংলাদেশ • ২৪/৭ সেবা
                </p>
              </div>
            </div>

            {/* ===== POLISHED DIVIDER ===== */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              margin: "3rem auto",
              maxWidth: "900px",
            }}>
              <div style={{
                flex: 1,
                height: "1px",
                background: "linear-gradient(90deg, transparent, var(--border-color))",
              }} />
              <span style={{
                fontSize: "1.5rem",
                color: "var(--accent)",
                background: "var(--bg-primary)",
                padding: "0 1rem",
                fontWeight: 400,
              }}>
                👮
              </span>
              <div style={{
                flex: 1,
                height: "1px",
                background: "linear-gradient(270deg, transparent, var(--border-color))",
              }} />
            </div>

            {/* ===== CID Police Contacts ===== */}
            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "1rem", padding: "2rem", boxShadow: "var(--card-shadow)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "1.5rem" }}>
                <span style={{ fontSize: "1.5rem" }}>🛡️</span>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-dark)" }}>
                  সাইবার ক্রাইম সেল – CID
                </h3>
                <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginLeft: "auto", background: "var(--bg-secondary)", padding: "0.2rem 0.8rem", borderRadius: "2rem" }}>
                  Police Headquarters
                </span>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "var(--bg-secondary)", borderBottom: "2px solid var(--border-color)" }}>
                      <th style={{ padding: "0.8rem 0.5rem", textAlign: "left", fontWeight: 600 }}>Designation</th>
                      <th style={{ padding: "0.8rem 0.5rem", textAlign: "left", fontWeight: 600 }}>Phone</th>
                      <th style={{ padding: "0.8rem 0.5rem", textAlign: "left", fontWeight: 600 }}>PABX</th>
                      <th style={{ padding: "0.8rem 0.5rem", textAlign: "left", fontWeight: 600 }}>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                      <td style={{ padding: "0.8rem 0.5rem" }}>SSP (Forensic Training Center)</td>
                      <td style={{ padding: "0.8rem 0.5rem" }}><a href="tel:01320010073" style={{ color: "var(--accent)" }}>01320-010073</a></td>
                      <td style={{ padding: "0.8rem 0.5rem" }}>22446, 44070061</td>
                      <td style={{ padding: "0.8rem 0.5rem" }}><a href="mailto:ssp.fti.cid@police.gov.bd" style={{ color: "var(--accent)" }}>ssp.fti.cid@police.gov.bd</a></td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                      <td style={{ padding: "0.8rem 0.5rem" }}>SSP (Cyber Training Center)</td>
                      <td style={{ padding: "0.8rem 0.5rem" }}><a href="tel:01320010069" style={{ color: "var(--accent)" }}>01320-010069</a></td>
                      <td style={{ padding: "0.8rem 0.5rem" }}>—</td>
                      <td style={{ padding: "0.8rem 0.5rem" }}>—</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                      <td style={{ padding: "0.8rem 0.5rem" }}>SSP (Cyber Intelligence & Risk Management)</td>
                      <td style={{ padding: "0.8rem 0.5rem" }}><a href="tel:01320010081" style={{ color: "var(--accent)" }}>01320-010081</a></td>
                      <td style={{ padding: "0.8rem 0.5rem" }}>22413, 48310949</td>
                      <td style={{ padding: "0.8rem 0.5rem" }}><a href="mailto:ssp.cyirm.cid@police.gov.bd" style={{ color: "var(--accent)" }}>ssp.cyirm.cid@police.gov.bd</a></td>
                    </tr>
                    <tr>
                      <td style={{ padding: "0.8rem 0.5rem" }}>SSP (Cyber Investigation & Operations)</td>
                      <td style={{ padding: "0.8rem 0.5rem" }}><a href="tel:01320010082" style={{ color: "var(--accent)" }}>01320-010082</a></td>
                      <td style={{ padding: "0.8rem 0.5rem" }}>48321741</td>
                      <td style={{ padding: "0.8rem 0.5rem" }}><a href="mailto:ssp.cio.cid@police.gov.bd" style={{ color: "var(--accent)" }}>ssp.cio.cid@police.gov.bd</a></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: "1rem", fontSize: "0.75rem", color: "var(--text-secondary)", textAlign: "center", borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
                <span>🕐 সকাল ৯টা – সন্ধ্যা ৬টা (সপ্তাহের ৭ দিন)</span>
                <span style={{ margin: "0 0.5rem" }}>•</span>
                <span>📍 রাজারবাগ পুলিশ লাইনস, ঢাকা</span>
              </div>
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