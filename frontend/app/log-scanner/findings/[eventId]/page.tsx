"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function LogFindingDetailPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [finding, setFinding] = useState<any>(null);
  const [solution, setSolution] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const findingRes = await fetch(`http://localhost:8000/logs/events/${eventId}`, {
          credentials: "include",
        });
        const findingData = await findingRes.json();

        if (!findingRes.ok) {
          setError(findingData.detail || "Error loading finding.");
          setLoading(false);
          return;
        }

        setFinding(findingData);

        const solutionRes = await fetch(`http://localhost:8000/logs/events/${eventId}/solution`, {
          credentials: "include",
        });
        if (solutionRes.ok) {
          const solutionData = await solutionRes.json();
          setSolution(solutionData);
        }
      } catch (err) {
        setError("Failed to connect to the server. Make sure the backend is running.");
      }
      setLoading(false);
    };

    fetchData();
  }, [eventId]);

  const severityColor = (severity: string | null) => {
    if (!severity) return "#6c757d";
    const s = severity.toLowerCase();
    return s === "critical" ? "#dc3545" : s === "high" ? "#e65100" : s === "medium" ? "#ff9800" : "#4CAF50";
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-primary)", padding: "2rem 1rem", textAlign: "center" }}>
        <p style={{ color: "var(--text-secondary)" }}>Loading finding...</p>
      </div>
    );
  }

  if (error || !finding) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-primary)", padding: "2rem 1rem" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <a href="/log-scanner" style={{ color: "var(--accent)", textDecoration: "none", display: "inline-block", marginBottom: "1.5rem" }}>
            ← Back to Log Scanner
          </a>
          <div style={{ padding: "1rem", background: "rgba(244, 67, 54, 0.1)", border: "1px solid #dc3545", borderRadius: "0.75rem", color: "#dc3545" }}>
            ❌ {error || "Finding not found."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <a href="/log-scanner" style={{ color: "var(--accent)", textDecoration: "none", display: "inline-block", marginBottom: "1.5rem" }}>
          ← Back to Log Scanner
        </a>

        {/* Finding Detail Card */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "1.5rem", overflow: "hidden", boxShadow: "var(--card-shadow)", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.2rem 1.5rem", background: "var(--bg-secondary)", borderBottom: "1px solid var(--card-border)" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-dark)" }}>
              {finding.attack_name || "Unknown Finding"}
            </h3>
            <span style={{ padding: "0.3rem 0.9rem", borderRadius: "1rem", fontSize: "0.75rem", fontWeight: 700, background: `${severityColor(finding.severity)}33`, color: severityColor(finding.severity) }}>
              {(finding.severity || "unknown").toUpperCase()}
            </span>
          </div>

          <div style={{ padding: "1.5rem" }}>
            <div style={{ marginBottom: "1rem" }}>
              <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.2rem" }}>Detection Type</span>
              <span style={{ fontSize: "0.95rem", color: "var(--text-dark)" }}>{finding.detection_type || "N/A"}</span>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.2rem" }}>Evidence</span>
              <span style={{ fontSize: "0.95rem", color: "var(--text-dark)" }}>{finding.evidence || "N/A"}</span>
            </div>

            {finding.source_ip && (
              <div style={{ marginBottom: "1rem" }}>
                <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.2rem" }}>Source IP</span>
                <span style={{ fontSize: "0.95rem", color: "var(--text-dark)" }}>{finding.source_ip}</span>
              </div>
            )}

            {finding.request_url && (
              <div>
                <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.2rem" }}>Request URL</span>
                <span style={{ fontSize: "0.95rem", color: "var(--text-dark)", wordBreak: "break-all" }}>{finding.request_url}</span>
              </div>
            )}
          </div>
        </div>

        {/* Solution Card */}
        {solution && (
          <div style={{ background: "rgba(76, 175, 80, 0.1)", border: "2px solid #4CAF50", borderRadius: "1.5rem", padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-dark)", marginBottom: "0.75rem" }}>
              <i className="fas fa-lightbulb" style={{ color: "#4CAF50" }}></i> Recommended Fix
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-primary)", lineHeight: 1.5 }}>{solution.fix_description}</p>

            {solution.command && (
              <div style={{ marginTop: "1rem" }}>
                <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.3rem" }}>Suggested command</span>
                <code style={{ display: "block", padding: "0.75rem 1rem", background: "var(--bg-secondary)", borderRadius: "0.5rem", fontSize: "0.85rem", color: "var(--text-dark)", overflowX: "auto" }}>
                  {solution.command}
                </code>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}