"use client";

import { useEffect, useState } from "react";

export default function LogScanHistoryPage() {
  const [scans, setScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const res = await fetch("http://localhost:8000/logs/scans", {
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok) {
          setScans(data);
        } else {
          setError(data.detail || "Error loading scan history.");
        }
      } catch (err) {
        setError("Failed to connect to the server. Make sure the backend is running.");
      }
      setLoading(false);
    };

    fetchScans();
  }, []);

  const riskColor = (level: string) =>
    level === "dangerous" ? "#dc3545" : level === "medium" ? "#ff9800" : "#4CAF50";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <a href="/log-scanner" style={{ color: "var(--accent)", textDecoration: "none", display: "inline-block", marginBottom: "1.5rem" }}>
          ← Back to Log Scanner
        </a>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-dark)" }}>
            📜 Scan History
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
            Every log file you've scanned
          </p>
        </div>

        {loading && (
          <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>Loading...</p>
        )}

        {error && (
          <div style={{ padding: "1rem", background: "rgba(244, 67, 54, 0.1)", border: "1px solid #dc3545", borderRadius: "0.75rem", color: "#dc3545" }}>
            ❌ {error}
          </div>
        )}

        {!loading && !error && scans.length === 0 && (
          <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>
            You haven't scanned any log files yet.
          </p>
        )}

        {scans.map((s) => (
   <a       
            key={s.id}
            href={`/log-scanner/${s.id}`}
            style={{ display: "block", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "1rem", padding: "1.2rem 1.5rem", marginBottom: "1rem", textDecoration: "none", boxShadow: "var(--card-shadow)" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong style={{ color: "var(--text-dark)", fontSize: "1rem" }}>{s.original_filename}</strong>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: "0.3rem 0 0 0" }}>
                  {s.log_type} · {s.total_findings} finding{s.total_findings !== 1 ? "s" : ""} · {new Date(s.uploaded_at).toLocaleString()}
                </p>
              </div>
              <span style={{ padding: "0.3rem 0.9rem", borderRadius: "1rem", fontSize: "0.75rem", fontWeight: 700, background: `${riskColor(s.overall_risk_level)}33`, color: riskColor(s.overall_risk_level) }}>
                {s.overall_risk_level.toUpperCase()}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}