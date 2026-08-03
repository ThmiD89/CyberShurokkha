"use client";

import { useEffect, useState } from "react";

type ActivityItem = {
  type: string;
  title: string;
  detail: string;
  risk_level: string | null;
  user_name: string | null;
  created_at: string;
};

const TYPE_ICON: Record<string, string> = {
  scam_scan: "📩",
  url_scan: "🔗",
  job_check: "🕵️",
  report: "📢",
  log_scan: "🛰️",
};

const TYPE_LABEL: Record<string, string> = {
  scam_scan: "Scam Detector",
  url_scan: "QR/URL Scanner",
  job_check: "Job Checker",
  report: "Community Report",
  log_scan: "Log Scanner",
};

function riskColor(level: string | null) {
  if (level === "dangerous") return "#dc3545";
  if (level === "medium") return "#ff9800";
  if (level === "safe") return "#4CAF50";
  return "var(--text-secondary)";
}

export default function AdminActivityTab() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [module, setModule] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [search, setSearch] = useState("");

  const fetchActivity = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (module) params.append("module", module);
      if (riskLevel) params.append("risk_level", riskLevel);
      if (search) params.append("search", search);

      const res = await fetch(`http://localhost:8000/admin/activity?${params}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setItems(data.items);
        setTotal(data.total);
      } else {
        setError(data.detail || "Error loading activity.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module, riskLevel]);

  return (
    <div>
      {/* Filter bar */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1rem", alignItems: "center" }}>
        <select
          value={module}
          onChange={(e) => setModule(e.target.value)}
          style={{ padding: "0.5rem 0.9rem", borderRadius: "0.5rem", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-primary)" }}
        >
          <option value="">All Modules</option>
          <option value="scam_scan">Scam Detector</option>
          <option value="url_scan">QR/URL Scanner</option>
          <option value="job_check">Job Checker</option>
          <option value="report">Community Report</option>
          <option value="log_scan">Log Scanner</option>
        </select>

        <select
          value={riskLevel}
          onChange={(e) => setRiskLevel(e.target.value)}
          style={{ padding: "0.5rem 0.9rem", borderRadius: "0.5rem", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-primary)" }}
        >
          <option value="">All Risk Levels</option>
          <option value="safe">Safe</option>
          <option value="medium">Medium</option>
          <option value="dangerous">Dangerous</option>
        </select>

        <input
          type="text"
          placeholder="Search by user or content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchActivity()}
          style={{ flex: 1, minWidth: "200px", padding: "0.5rem 0.9rem", borderRadius: "0.5rem", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-primary)" }}
        />

        <button
          onClick={fetchActivity}
          style={{ padding: "0.5rem 1.2rem", borderRadius: "0.5rem", border: "none", background: "var(--accent)", color: "white", fontWeight: 600, cursor: "pointer" }}
        >
          <i className="fas fa-filter"></i> Filter
        </button>
      </div>

      {!loading && !error && (
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
          Showing {items.length} of {total} matching actions
        </p>
      )}

      {loading && <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>Loading...</p>}
      {error && <p style={{ textAlign: "center", color: "#dc3545" }}>{error}</p>}
      {!loading && !error && items.length === 0 && (
        <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>No activity matches these filters.</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
        {items.map((item, idx) => (
          <div key={idx} className="card" style={{ display: "flex", alignItems: "flex-start", gap: "0.9rem", padding: "0.9rem 1.1rem" }}>
            <span style={{ fontSize: "1.3rem" }}>{TYPE_ICON[item.type] || "•"}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" }}>
                <span style={{ fontWeight: 600, color: "var(--text-dark)", fontSize: "0.88rem" }}>{item.title}</span>
                {item.risk_level && (
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", color: riskColor(item.risk_level) }}>
                    {item.risk_level}
                  </span>
                )}
              </div>
              <p style={{ fontSize: "0.83rem", color: "var(--text-secondary)", margin: "0.2rem 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {item.detail}
              </p>
              <p style={{ fontSize: "0.7rem", color: "var(--text-secondary)", margin: "0.25rem 0 0" }}>
                {item.user_name || "Deleted User"} · {TYPE_LABEL[item.type]} · {new Date(item.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}