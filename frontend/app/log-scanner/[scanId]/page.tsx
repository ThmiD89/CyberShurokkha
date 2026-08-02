"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function LogScanDashboardPage() {
  const params = useParams();
  const scanId = params.scanId as string;

  const [scan, setScan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchScan = async () => {
      try {
        const res = await fetch(`http://localhost:8000/logs/scans/${scanId}`, {
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok) {
          setScan(data);
        } else {
          setError(data.detail || "Error loading scan.");
        }
      } catch (err) {
        setError("Failed to connect to the server. Make sure the backend is running.");
      }
      setLoading(false);
    };

    fetchScan();
  }, [scanId]);

  const riskColor = (level: string) =>
    level === "dangerous" ? "#dc3545" : level === "medium" ? "#ff9800" : "#4CAF50";

  const severityColor = (severity: string | null) => {
    if (!severity) return "#6c757d";
    const s = severity.toLowerCase();
    return s === "critical" ? "#dc3545" : s === "high" ? "#e65100" : s === "medium" ? "#ff9800" : "#4CAF50";
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-primary)", padding: "2rem 1rem", textAlign: "center" }}>
        <p style={{ color: "var(--text-secondary)" }}>Loading scan...</p>
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-primary)", padding: "2rem 1rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <a href="/log-scanner" style={{ color: "var(--accent)", textDecoration: "none", display: "inline-block", marginBottom: "1.5rem" }}>
            ← Back to Log Scanner
          </a>
          <div style={{ padding: "1rem", background: "rgba(244, 67, 54, 0.1)", border: "1px solid #dc3545", borderRadius: "0.75rem", color: "#dc3545" }}>
            ❌ {error || "Scan not found."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <a href="/log-scanner" style={{ color: "var(--accent)", textDecoration: "none", display: "inline-block", marginBottom: "1.5rem" }}>
          ← Back to Log Scanner
        </a>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-dark)" }}>
            📊 Scan Dashboard
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>{scan.original_filename}</p>
        </div>

        {/* Summary Card */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "1.5rem", padding: "1.5rem", boxShadow: "var(--card-shadow)", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-dark)" }}>Overview</h3>
            <span style={{ padding: "0.4rem 1rem", borderRadius: "2rem", fontWeight: 700, fontSize: "0.85rem", background: `${riskColor(scan.overall_risk_level)}33`, color: riskColor(scan.overall_risk_level) }}>
              {scan.overall_risk_level.toUpperCase()}
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div style={{ background: "var(--bg-secondary)", padding: "0.75rem 1rem", borderRadius: "0.5rem" }}>
              <span style={{ display: "block", fontSize: "0.7rem", color: "var(--text-secondary)" }}>Log Type</span>
              <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-dark)" }}>{scan.log_type}</span>
            </div>
            <div style={{ background: "var(--bg-secondary)", padding: "0.75rem 1rem", borderRadius: "0.5rem" }}>
              <span style={{ display: "block", fontSize: "0.7rem", color: "var(--text-secondary)" }}>Findings</span>
              <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-dark)" }}>{scan.findings.length}</span>
            </div>
          </div>
        </div>

        {/* Findings List */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "1.5rem", overflow: "hidden", boxShadow: "var(--card-shadow)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "1.2rem 1.5rem", background: "var(--bg-secondary)", borderBottom: "1px solid var(--card-border)" }}>
            <i className="fas fa-list" style={{ color: "var(--accent)" }}></i>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-dark)" }}>Findings</h3>
          </div>

          <div style={{ padding: "1.5rem" }}>
            {scan.findings.length === 0 ? (
              <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "1rem 0" }}>
                ✅ No findings — this log looks clean.
              </p>
            ) : (
              scan.findings.map((f: any) => (
   <a             
                  key={f.id}
                  href={`/log-scanner/findings/${f.id}`}
                  style={{ display: "block", padding: "1rem", background: "var(--bg-secondary)", borderRadius: "0.75rem", marginBottom: "0.75rem", textDecoration: "none", border: `1px solid ${severityColor(f.severity)}55` }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                    <strong style={{ color: "var(--text-dark)" }}>{f.attack_name || "Unknown"}</strong>
                    <span style={{ padding: "0.2rem 0.7rem", borderRadius: "1rem", fontSize: "0.7rem", fontWeight: 700, background: `${severityColor(f.severity)}33`, color: severityColor(f.severity) }}>
                      {(f.severity || "unknown").toUpperCase()}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>{f.evidence}</p>
                  {f.source_ip && (
                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", margin: "0.3rem 0 0 0" }}>
                      IP: {f.source_ip} {f.request_url ? `· URL: ${f.request_url}` : ""}
                    </p>
                  )}
                </a>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}