"use client";

import { useState } from "react";

export default function LogScannerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Please choose a log file to upload.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("log_file", file);

    try {
      const res = await fetch(`${API_BASE}/logs/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data);
      } else {
        setError(data.detail || "Error scanning log file.");
      }
    } catch (err) {
      setError("Failed to connect to the server. Make sure the backend is running.");
    }

    setLoading(false);
  };

  const resetForm = () => {
    setFile(null);
    setResult(null);
    setError("");
  };

  const riskColor = (level: string) =>
    level === "dangerous" ? "#dc3545" : level === "medium" ? "#ff9800" : "#4CAF50";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <a href="/" style={{ color: "var(--accent)", textDecoration: "none", display: "inline-block", marginBottom: "1.5rem" }}>
          ← Back to Home
        </a>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--text-dark)" }}>
            🛰️ Log Scanner
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
            Upload an Apache/Nginx, Linux, or Windows security log to scan for attacks
          </p>
          <a href="/log-scanner/history" style={{ display: "inline-block", marginTop: "0.75rem", fontSize: "0.85rem", color: "var(--accent)" }}>
            <i className="fas fa-clock-rotate-left"></i> View Scan History
          </a>
        </div>

        {/* Upload Card */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "1.5rem", overflow: "hidden", boxShadow: "var(--card-shadow)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "1.2rem 1.5rem", background: "var(--bg-secondary)", borderBottom: "1px solid var(--card-border)" }}>
            <i className="fas fa-file-upload" style={{ color: "var(--accent)" }}></i>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-dark)" }}>Upload a Log File</h3>
          </div>

          <div style={{ padding: "1.5rem" }}>
            {error && (
              <div style={{ padding: "0.75rem 1rem", background: "rgba(244, 67, 54, 0.1)", border: "1px solid #dc3545", borderRadius: "0.75rem", color: "#dc3545", marginBottom: "1rem" }}>
                ❌ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "1.2rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "var(--text-dark)", marginBottom: "0.4rem" }}>
                  <i className="fas fa-file" style={{ color: "var(--accent)" }}></i> Log File <span style={{ color: "#dc3545" }}>*</span>
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  style={{ width: "100%", padding: "0.75rem 1rem", border: "2px solid var(--card-border)", borderRadius: "0.75rem", fontSize: "0.95rem", background: "var(--bg-secondary)", color: "var(--text-primary)" }}
                />
                <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.4rem" }}>
                  Supports Apache/Nginx access logs, Linux syslog/auth.log, and Windows Security Event exports (CSV or text).
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ width: "100%", padding: "0.9rem", background: "var(--accent)", color: "white", border: "none", borderRadius: "0.75rem", fontWeight: 600, fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
              >
                <i className="fas fa-shield-halved"></i>
                {loading ? "Scanning..." : "Scan Log File"}
              </button>
            </form>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div style={{ marginTop: "2rem", padding: "1.5rem", borderRadius: "1.5rem", animation: "slideUp 0.4s ease", background: `${riskColor(result.overall_risk_level)}22`, border: `2px solid ${riskColor(result.overall_risk_level)}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-dark)" }}>
                <i className="fas fa-search"></i> Scan Result
              </h3>
              <span style={{ padding: "0.4rem 1rem", borderRadius: "2rem", fontWeight: 700, fontSize: "0.85rem", background: `${riskColor(result.overall_risk_level)}33`, color: riskColor(result.overall_risk_level) }}>
                {result.overall_risk_level.toUpperCase()}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", margin: "1rem 0" }}>
              <div style={{ background: "var(--bg-secondary)", padding: "0.75rem 1rem", borderRadius: "0.5rem" }}>
                <span style={{ display: "block", fontSize: "0.7rem", color: "var(--text-secondary)" }}>Detected Log Type</span>
                <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-dark)" }}>{result.log_type}</span>
              </div>
              <div style={{ background: "var(--bg-secondary)", padding: "0.75rem 1rem", borderRadius: "0.5rem" }}>
                <span style={{ display: "block", fontSize: "0.7rem", color: "var(--text-secondary)" }}>Total Findings</span>
                <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-dark)" }}>{result.total_findings}</span>
              </div>
            </div>

            {result.findings && result.findings.length > 0 && (
              <div style={{ margin: "1rem 0" }}>
                <h4 style={{ fontSize: "0.9rem", color: "var(--text-dark)" }}>
                  <i className="fas fa-exclamation-triangle" style={{ color: "#dc3545" }}></i> Findings
                </h4>
                {result.findings.map((f: any, idx: number) => (
                  <div key={idx} style={{ padding: "0.6rem 0.9rem", background: "var(--bg-secondary)", borderRadius: "0.5rem", marginBottom: "0.4rem", fontSize: "0.85rem", color: "var(--text-primary)" }}>
                    <strong>{f.attack}</strong> — {f.evidence} (IP: {f.ip})
                  </div>
                ))}
              </div>
            )}

            <a
              href={`/log-scanner/${result.scan_id}`}
              style={{ display: "inline-block", marginTop: "0.75rem", padding: "0.6rem 1.2rem", background: "var(--accent)", color: "white", borderRadius: "0.5rem", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600 }}
            >
              <i className="fas fa-chart-bar"></i> View Full Dashboard
            </a>

            <button onClick={resetForm} style={{ marginTop: "1rem", marginLeft: "0.75rem", padding: "0.5rem 1rem", background: "#6c757d", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontSize: "0.85rem" }}>
              <i className="fas fa-redo"></i> Scan Another
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}