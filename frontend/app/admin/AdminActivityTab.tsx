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

type District = {
  district_id: number;
  name_en: string;
  name_bn: string;
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

type Props = {
  initialUserFilter: { id: string; name: string } | null;
  onClearUserFilter: () => void;
};

export default function AdminActivityTab({ initialUserFilter, onClearUserFilter }: Props) {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [districts, setDistricts] = useState<District[]>([]);
  const [module, setModule] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("");

  // Note: district isn't sent to /admin/activity (the backend doesn't
  // track district per-activity-item outside of reports) — it's included
  // here as a search-assist: selecting one auto-fills the search box with
  // that district's name so report-type activity for that area surfaces.
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/threat-map/summary`)
      .then((res) => res.json())
      .then((data) => setDistricts(data))
      .catch(() => {});
  }, []);

  const fetchActivity = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (module) params.append("module", module);
      if (riskLevel) params.append("risk_level", riskLevel);
      if (search) params.append("search", search);
      if (initialUserFilter) params.append("user_id", initialUserFilter.id);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/admin/activity?${params}`, { credentials: "include" });
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
  }, [module, riskLevel, initialUserFilter]);

  const handleDistrictChange = (value: string) => {
    setDistrict(value);
    const found = districts.find((d) => String(d.district_id) === value);
    setSearch(found ? found.name_en : "");
  };

  return (
    <div>
      {initialUserFilter && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.6rem 1rem", background: "var(--accent)", borderRadius: "0.6rem", marginBottom: "1rem", color: "white", fontSize: "0.88rem" }}>
          <i className="fas fa-user"></i>
          Showing activity for <strong>{initialUserFilter.name}</strong>
          <button
            onClick={onClearUserFilter}
            style={{ marginLeft: "auto", background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "0.4rem", color: "white", padding: "0.25rem 0.7rem", cursor: "pointer", fontSize: "0.8rem" }}
          >
            <i className="fas fa-times"></i> Clear
          </button>
        </div>
      )}

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

        <select
          value={district}
          onChange={(e) => handleDistrictChange(e.target.value)}
          style={{ padding: "0.5rem 0.9rem", borderRadius: "0.5rem", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-primary)" }}
        >
          <option value="">All Districts</option>
          {districts.map((d) => (
            <option key={d.district_id} value={d.district_id}>{d.name_en}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by user or content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchActivity()}
          style={{ flex: 1, minWidth: "180px", padding: "0.5rem 0.9rem", borderRadius: "0.5rem", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-primary)" }}
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