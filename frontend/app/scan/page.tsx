"use client";

import { useState } from "react";
import PageContainer from "../../src/components/common/PageContainer";
import BackHome from "../../src/components/common/BackHome";
import PageHero from "../../src/components/common/PageHero";
import GlassCard from "../../src/components/ui/Card";
import Button from "../../src/components/ui/Button";
import Input from "../../src/components/ui/Input";
import Badge from "../../src/components/ui/Badge";

export default function ScanPage() {
  const [channel, setChannel] = useState("sms");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${API_BASE}/analyze-scam`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ channel, text }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.detail || "Error analyzing message.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the scam detector. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "dangerous":
        return { bg: "#fee2e2", border: "#f44336", text: "#b71c1c", badge: "danger" };
      case "medium":
        return { bg: "#fef9e7", border: "#ff9800", text: "#e65100", badge: "warning" };
      default:
        return { bg: "#e8f5e9", border: "#4caf50", text: "#1b5e20", badge: "success" };
    }
  };

  const getLevelEmoji = (level: string) => {
    switch (level) {
      case "dangerous":
        return "🚨";
      case "medium":
        return "⚠️";
      default:
        return "✅";
    }
  };

  return (
    <PageContainer>
      <BackHome />

      <PageHero
        badge="🤖 AI Detection Engine"
        icon=""
        title="Scam Detector"
        subtitle="Paste a suspicious SMS, email, or chat message to check if it's a scam"
      />

      {/* ─── Form ─── */}
      <GlassCard>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.2rem" }}>
            <label
              style={{
                display: "block",
                fontWeight: 600,
                color: "var(--text-dark)",
                marginBottom: "0.4rem",
                fontSize: "0.9rem",
              }}
            >
              Channel
            </label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                border: "2px solid var(--border-color)",
                borderRadius: "0.75rem",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                fontSize: "0.95rem",
                transition: "border-color 0.3s",
                outline: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
            >
              <option value="sms">📱 SMS</option>
              <option value="email">✉️ Email</option>
              <option value="messenger">💬 Messenger</option>
              <option value="whatsapp">📲 WhatsApp</option>
              <option value="other">📌 Other</option>
            </select>
          </div>

          <div style={{ marginBottom: "1.2rem" }}>
            <label
              style={{
                display: "block",
                fontWeight: 600,
                color: "var(--text-dark)",
                marginBottom: "0.4rem",
                fontSize: "0.9rem",
              }}
            >
              Message Text <span style={{ color: "#dc3545" }}>*</span>
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              placeholder="Paste the suspicious message here..."
              required
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                border: "2px solid var(--border-color)",
                borderRadius: "0.75rem",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                fontSize: "0.95rem",
                resize: "vertical",
                fontFamily: "inherit",
                transition: "border-color 0.3s",
                outline: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
            />
          </div>

          {/* Quick Examples */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              flexWrap: "wrap",
              margin: "0 0 1.2rem",
            }}
          >
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              Try:
            </span>
            <button
              type="button"
              onClick={() =>
                setText(
                  "Congratulations! You've won a $1000 gift card. Click here to claim: https://scam-link.com"
                )
              }
              style={{
                padding: "0.3rem 0.8rem",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "2rem",
                fontSize: "0.75rem",
                cursor: "pointer",
                color: "var(--text-secondary)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--accent)";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--bg-secondary)";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              ⚠️ Scam
            </button>
            <button
              type="button"
              onClick={() =>
                setText(
                  "Your package will be delivered tomorrow between 2-4 PM. Tracking: #TRK123456"
                )
              }
              style={{
                padding: "0.3rem 0.8rem",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "2rem",
                fontSize: "0.75rem",
                cursor: "pointer",
                color: "var(--text-secondary)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#4CAF50";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--bg-secondary)";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              ✅ Safe
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            disabled={loading}
            icon="🔍"
          >
            Check for Scam
          </Button>
        </form>

        {error && (
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1rem",
              background: "#fee2e2",
              border: "1px solid #f44336",
              borderRadius: "0.5rem",
              color: "#b71c1c",
            }}
          >
            ❌ {error}
          </div>
        )}

        {/* ─── Results ─── */}
        {result && (
          <div
            style={{
              marginTop: "2rem",
              animation: "slideUp 0.4s ease",
            }}
          >
            <div
              style={{
                padding: "1.5rem",
                borderRadius: "0.75rem",
                borderLeft: `6px solid ${getLevelColor(result.risk_level).border}`,
                background: getLevelColor(result.risk_level).bg,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontSize: "2.5rem" }}>
                  {getLevelEmoji(result.risk_level)}
                </span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.8rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <p
                      style={{
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                        color: "var(--text-dark)",
                        margin: 0,
                      }}
                    >
                      Risk Score: {result.risk_score}/100
                    </p>
                    <Badge
                      variant={getLevelColor(result.risk_level).badge as "success" | "warning" | "danger"}
                    >
                      {result.risk_level.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Reasons */}
            <div
              style={{
                marginTop: "1rem",
                padding: "1rem",
                background: "var(--bg-secondary)",
                borderRadius: "0.75rem",
              }}
            >
              <p
                style={{
                  fontWeight: 600,
                  color: "var(--text-dark)",
                  marginBottom: "0.5rem",
                }}
              >
                📋 Reasons
              </p>
              <ul
                style={{
                  listStyle: "disc",
                  paddingLeft: "1.5rem",
                  color: "var(--text-secondary)",
                  margin: 0,
                }}
              >
                {result.reasons.map((reason: string, idx: number) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
            </div>

            {/* Recommendation */}
            <div
              style={{
                marginTop: "1rem",
                padding: "1rem",
                background: "#e3f2fd",
                borderRadius: "0.75rem",
                border: "1px solid #90caf9",
              }}
            >
              <p
                style={{
                  fontWeight: 600,
                  color: "#0d47a1",
                  marginBottom: "0.25rem",
                }}
              >
                💡 Recommendation
              </p>
              <p style={{ color: "#0d47a1", margin: 0 }}>
                {result.recommendation}
              </p>
            </div>
          </div>
        )}
      </GlassCard>

      {/* ─── Security Tips ─── */}
      <div
        style={{
          marginTop: "2rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {[
          {
            icon: "🔍",
            title: "Check the Sender",
            desc: "Always verify who sent the message, especially for urgent requests.",
          },
          {
            icon: "🔗",
            title: "Don't Click Suspicious Links",
            desc: "Hover over links to see the actual URL before clicking.",
          },
          {
            icon: "📞",
            title: "Verify by Phone",
            desc: "Call the official number of the organization to confirm any request.",
          },
        ].map((tip, idx) => (
          <div
            key={idx}
            style={{
              background: "var(--card-bg)",
              padding: "1.5rem",
              borderRadius: "1rem",
              border: "1px solid var(--card-border)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{tip.icon}</div>
            <h4
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "var(--text-dark)",
              }}
            >
              {tip.title}
            </h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              {tip.desc}
            </p>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </PageContainer>
  );
}