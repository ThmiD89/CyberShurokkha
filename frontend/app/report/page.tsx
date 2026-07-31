// frontend/app/report/page.tsx
"use client";

import { useState } from "react";

const CATEGORIES = [
  { value: "sms_scam", label: "SMS Scam" },
  { value: "phishing_url", label: "Phishing URL" },
  { value: "fake_job", label: "Fake Job Posting" },
  { value: "qr_scam", label: "QR Code Scam" },
  { value: "social_media_scam", label: "Social Media Scam" },
  { value: "investment_fraud", label: "Investment Fraud" },
  { value: "other", label: "Other" },
];

export default function ReportPage() {
  const [districtId, setDistrictId] = useState("");
  const [category, setCategory] = useState("sms_scam");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("http://localhost:8000/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // <-- ADDED: sends the httpOnly cookie
        body: JSON.stringify({
          district_id: parseInt(districtId),
          category,
          description,
          screenshot_url: null,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setStatus("success");
      setDescription("");
      setDistrictId("");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    border: "1px solid var(--border-color)",
    background: "var(--bg-secondary)",
    color: "var(--text-primary)",
    fontSize: "1rem",
    fontFamily: "inherit",
  };

  const labelStyle = {
    display: "block" as const,
    fontWeight: 500,
    marginBottom: "0.5rem",
    color: "var(--text-dark)",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <a href="/" style={{ color: "var(--accent)", textDecoration: "none", display: "inline-block", marginBottom: "1.5rem" }}>
          ← Back to Home
        </a>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--text-dark)" }}>
            📢 Report a Scam
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
            Help protect your community by reporting scams you've encountered
          </p>
        </div>

        <div className="card" style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "1rem", padding: "1.5rem" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <label style={labelStyle}>District ID (1-64)</label>
              <input
                type="number"
                min="1"
                max="64"
                value={districtId}
                onChange={(e) => setDistrictId(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={inputStyle}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                style={{ ...inputStyle, resize: "vertical" as const }}
                placeholder="Describe what happened..."
              />
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                opacity: status === "submitting" ? 0.6 : 1,
                cursor: status === "submitting" ? "not-allowed" : "pointer",
              }}
            >
              {status === "submitting" ? "Submitting..." : "Submit Report"}
            </button>

            {status === "success" && (
              <div style={{ padding: "1rem", background: "#e8f5e9", border: "1px solid #4caf50", borderRadius: "0.5rem", color: "#1b5e20" }}>
                ✅ Report submitted successfully!
              </div>
            )}
            {status === "error" && (
              <div style={{ padding: "1rem", background: "#fee2e2", border: "1px solid #f44336", borderRadius: "0.5rem", color: "#b71c1c" }}>
                ❌ Something went wrong. Try again.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}