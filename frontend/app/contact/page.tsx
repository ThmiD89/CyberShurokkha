"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Failed to send message");
      
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const developers = [
    {
      name: "Sadia Tabassum Nodi",
      email: "nodi@cybershurokkha.com",
      phone: "+880 1794-178002",
      avatar: "👩‍💻",
    },
    {
      name: "Tahmid Ezaz",
      email: "tahmid@cybershurokkha.com",
      phone: "+880 1533-143206",
      avatar: "👨‍💻",
    },
    {
      name: "Md. Ratul Ryhan Rafi",
      email: "rafi@cybershurokkha.com",
      phone: "+880 1608-434479",
      avatar: "🧑‍💻",
    },
  ];

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "4rem 1.5rem", minHeight: "70vh" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <div style={{ display: "inline-block", padding: "0.3rem 1.2rem", borderRadius: "2rem", background: "var(--accent)", color: "white", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.5px", marginBottom: "1rem" }}>
          📬 Get in Touch
        </div>
        <h1 style={{ fontSize: "2.8rem", fontWeight: 700, color: "var(--text-dark)", marginBottom: "0.5rem" }}>
          Contact Us
        </h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: "550px", margin: "0 auto" }}>
          Have questions or feedback? Reach out – we'd love to hear from you.
        </p>
      </div>

      {/* Two-column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem" }}>
        {/* Left: Contact Form */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "1.2rem", padding: "2.5rem", boxShadow: "var(--card-shadow)" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, color: "var(--text-dark)", marginBottom: "0.5rem" }}>
            Send us a message
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", fontSize: "0.95rem" }}>
            We'll get back to you within 24 hours.
          </p>

          {submitted ? (
            <div style={{ padding: "2rem", background: "#e8f5e9", borderRadius: "1rem", textAlign: "center", border: "1px solid #4caf50" }}>
              <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>✅</div>
              <h3 style={{ color: "#1b5e20", marginBottom: "0.5rem" }}>Message sent!</h3>
              <p style={{ color: "#2e7d32" }}>Thanks for reaching out. We'll respond shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "var(--text-dark)", marginBottom: "0.3rem" }}>
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Md. Rahman"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
                    border: "1px solid var(--border-color)",
                    borderRadius: "0.75rem",
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    fontSize: "0.95rem",
                    transition: "border-color 0.3s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "var(--text-dark)", marginBottom: "0.3rem" }}>
                  Your Email
                </label>
                <input
                  type="email"
                  placeholder="e.g., you@example.com"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
                    border: "1px solid var(--border-color)",
                    borderRadius: "0.75rem",
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    fontSize: "0.95rem",
                    transition: "border-color 0.3s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "var(--text-dark)", marginBottom: "0.3rem" }}>
                  Your Message
                </label>
                <textarea
                  placeholder="Describe your question, feedback, or report..."
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
                    border: "1px solid var(--border-color)",
                    borderRadius: "0.75rem",
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    fontSize: "0.95rem",
                    resize: "vertical",
                    fontFamily: "inherit",
                    transition: "border-color 0.3s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                />
              </div>

              {error && (
                <div style={{ padding: "0.8rem", background: "#fee2e2", borderRadius: "0.5rem", color: "#b71c1c", fontSize: "0.9rem" }}>
                  ❌ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "0.9rem 2rem",
                  border: "none",
                  borderRadius: "0.75rem",
                  background: "var(--accent)",
                  color: "white",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "1rem",
                  transition: "all 0.3s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent)")}
              >
                {loading ? (
                  <>
                    <span style={{ display: "inline-block", width: "18px", height: "18px", border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    Sending...
                  </>
                ) : (
                  <>
                    <span>✉️</span> Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right: Developer Profiles */}
        <div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--text-dark)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>👨‍💻</span> Meet the Team
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", fontSize: "0.95rem" }}>
            Built with ❤️ by these cybersecurity enthusiasts.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {developers.map((dev, index) => (
              <div
                key={index}
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "1rem",
                  padding: "1.5rem",
                  boxShadow: "var(--card-shadow)",
                  transition: "transform 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "1.2rem",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateX(4px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateX(0)")}
              >
                <div style={{ fontSize: "2.5rem", flexShrink: 0 }}>{dev.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: "var(--text-dark)", fontSize: "1.05rem" }}>{dev.name}</div>
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    <a href={`mailto:${dev.email}`} style={{ color: "var(--accent)", textDecoration: "none" }}>
                      ✉️ {dev.email}
                    </a>
                    <a href={`tel:${dev.phone}`} style={{ color: "var(--accent)", textDecoration: "none" }}>
                      📞 {dev.phone}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick contact alternative */}
          <div style={{ marginTop: "2rem", padding: "1.5rem", background: "var(--card-bg)", borderRadius: "1rem", border: "1px solid var(--border-color)", textAlign: "center" }}>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              📍 Dhaka, Bangladesh &nbsp;•&nbsp; 🕒 24/7 Support
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginTop: "0.5rem" }}>
              <a href="tel:+880123456789" style={{ color: "var(--accent)", textDecoration: "none" }}>
                📞 999
              </a>
              <a href="mailto:support@cybershurokkha.com" style={{ color: "var(--accent)", textDecoration: "none" }}>
                ✉️ support@cybershurokkha.com
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}