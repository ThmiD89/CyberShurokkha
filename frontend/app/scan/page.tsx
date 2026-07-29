"use client";

import { useState } from "react";
import axios from "axios";

export default function ScanPage() {
  const [channel, setChannel] = useState("sms");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await axios.post("http://localhost:8000/analyze-scam", {
        channel,
        text,
      });
      setResult(response.data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to connect to the scam detector. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "dangerous":
        return { bg: "#fee2e2", border: "#f44336", text: "#b71c1c" };
      case "medium":
        return { bg: "#fef9e7", border: "#ff9800", text: "#e65100" };
      default:
        return { bg: "#e8f5e9", border: "#4caf50", text: "#1b5e20" };
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
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Back link */}
        <a href="/" style={{ color: "var(--accent)", textDecoration: "none", display: "inline-block", marginBottom: "1.5rem" }}>
          ← Back to Home
        </a>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--text-dark)" }}>AI Scam Detector</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
            Paste a suspicious SMS, email, or chat message to check if it's a scam
          </p>
        </div>

        <div className="card" style={{ background: "var(--card-bg)" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <label style={{ display: "block", fontWeight: 500, marginBottom: "0.5rem", color: "var(--text-dark)" }}>
                Channel
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  fontSize: "1rem",
                }}
              >
                <option value="sms">SMS</option>
                <option value="email">Email</option>
                <option value="messenger">Messenger</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 500, marginBottom: "0.5rem", color: "var(--text-dark)" }}>
                Message Text
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={6}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  fontSize: "1rem",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
                placeholder="Paste the suspicious message here..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                opacity: loading ? 0.6 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Analyzing..." : "Check for Scam"}
            </button>
          </form>

          {error && (
            <div style={{ marginTop: "1.5rem", padding: "1rem", background: "#fee2e2", border: "1px solid #f44336", borderRadius: "0.5rem", color: "#b71c1c" }}>
              {error}
            </div>
          )}

          {result && (
            <div style={{ marginTop: "2rem" }}>
              <div
                style={{
                  padding: "1.5rem",
                  borderRadius: "0.5rem",
                  borderLeft: `6px solid ${getLevelColor(result.risk_level).border}`,
                  background: getLevelColor(result.risk_level).bg,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontSize: "2.5rem" }}>{getLevelEmoji(result.risk_level)}</span>
                  <div>
                    <p style={{ fontWeight: "bold", fontSize: "1.2rem", color: "var(--text-dark)" }}>
                      Risk Score: {result.risk_score}/100
                    </p>
                    <p style={{ fontWeight: 500, textTransform: "capitalize", color: getLevelColor(result.risk_level).text }}>
                      Risk Level: {result.risk_level}
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "1rem", padding: "1rem", background: "var(--bg-secondary)", borderRadius: "0.5rem" }}>
                <p style={{ fontWeight: 500, color: "var(--text-dark)" }}>Reasons:</p>
                <ul style={{ listStyle: "disc", paddingLeft: "1.5rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
                  {result.reasons.map((reason: string, idx: number) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              </div>

              <div style={{ marginTop: "1rem", padding: "1rem", background: "#e3f2fd", borderRadius: "0.5rem" }}>
                <p style={{ fontWeight: 500, color: "#0d47a1" }}>Recommendation:</p>
                <p style={{ color: "#0d47a1", marginTop: "0.25rem" }}>{result.recommendation}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}