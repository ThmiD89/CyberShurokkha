"use client";

import { useEffect, useState } from "react";

type Report = {
  id: string;
  district_id: number;
  district_name_en: string;
  district_name_bn: string;
  category: string;
  description: string;
  screenshot_url: string | null;
  attachment_path: string | null;  // <-- ADDED
  status: string;
  reporter_name: string | null;
  created_at: string;
};

type District = {
  district_id: number;
  name_en: string;
  name_bn: string;
};

const CATEGORY_LABELS: Record<string, string> = {
  sms_scam: "SMS Scam",
  phishing_url: "Phishing URL",
  fake_job: "Fake Job",
  qr_scam: "QR Scam",
  social_media_scam: "Social Media Scam",
  investment_fraud: "Investment Fraud",
  other: "Other",
};

const statusColor = (status: string) => {
  if (status === "approved") return "#4CAF50";
  if (status === "rejected") return "#dc3545";
  return "#ff9800";
};

export default function AdminReportsTab() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [districts, setDistricts] = useState<District[]>([]);

  // Filters
  const [status, setStatus] = useState("pending");
  const [category, setCategory] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/threat-map/summary")
      .then((res) => res.json())
      .then((data) => setDistricts(data))
      .catch(() => {});
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ status });
      if (category) params.append("category", category);
      if (districtId) params.append("district_id", districtId);
      if (search) params.append("search", search);

      const res = await fetch(`http://localhost:8000/admin/reports/pending?${params}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setReports(data);
      } else {
        setError(data.detail || "Error loading reports.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, districtId]);

  const handleModerate = async (reportId: string, action: "approve" | "reject") => {
    try {
      const res = await fetch(`http://localhost:8000/admin/reports/${reportId}/${action}`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setReports((prev) => prev.filter((r) => r.id !== reportId));
      }
    } catch (err) {
      // silently fail, report stays in list
    }
  };

  return (
    <div>
      {/* Filter bar */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.5rem", alignItems: "center" }}>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ padding: "0.5rem 0.9rem", borderRadius: "0.5rem", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-primary)" }}
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="all">All</option>
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: "0.5rem 0.9rem", borderRadius: "0.5rem", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-primary)" }}
        >
          <option value="">All Categories</option>
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <select
          value={districtId}
          onChange={(e) => setDistrictId(e.target.value)}
          style={{ padding: "0.5rem 0.9rem", borderRadius: "0.5rem", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-primary)" }}
        >
          <option value="">All Districts</option>
          {districts.map((d) => (
            <option key={d.district_id} value={d.district_id}>{d.name_en}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchReports()}
          style={{ flex: 1, minWidth: "160px", padding: "0.5rem 0.9rem", borderRadius: "0.5rem", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-primary)" }}
        />

        <button
          onClick={fetchReports}
          style={{ padding: "0.5rem 1.2rem", borderRadius: "0.5rem", border: "none", background: "var(--accent)", color: "white", fontWeight: 600, cursor: "pointer" }}
        >
          <i className="fas fa-filter"></i> Filter
        </button>
      </div>

      {loading && <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>Loading...</p>}
      {error && <p style={{ textAlign: "center", color: "#dc3545" }}>{error}</p>}
      {!loading && !error && reports.length === 0 && (
        <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>No reports match these filters.</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {reports.map((r) => (
          <div key={r.id} className="card" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span style={{ fontWeight: 600, color: "var(--accent)" }}>
                {CATEGORY_LABELS[r.category] || r.category}
              </span>
              <span style={{ padding: "0.2rem 0.8rem", borderRadius: "1rem", fontSize: "0.75rem", fontWeight: 700, background: `${statusColor(r.status)}33`, color: statusColor(r.status) }}>
                {r.status.toUpperCase()}
              </span>
            </div>

            <p style={{ color: "var(--text-primary)", marginBottom: "0.5rem" }}>{r.description}</p>

            {/* ===== ATTACHMENT DOWNLOAD ===== */}
            {r.attachment_path && (
              <div style={{ marginBottom: "0.5rem" }}>
                <a
                  href={`http://localhost:8000/reports/${r.id}/attachment`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--accent)", textDecoration: "none", fontSize: "0.85rem" }}
                >
                  📎 Download Attachment
                </a>
              </div>
            )}

            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              {r.district_name_en} · Reported by {r.reporter_name || "Deleted User"} · {new Date(r.created_at).toLocaleString()}
            </p>

            {r.status === "pending" && (
              <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.9rem" }}>
                <button
                  onClick={() => handleModerate(r.id, "approve")}
                  style={{ padding: "0.4rem 1rem", borderRadius: "0.5rem", border: "none", background: "#4CAF50", color: "white", fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}
                >
                  <i className="fas fa-check"></i> Approve
                </button>
                <button
                  onClick={() => handleModerate(r.id, "reject")}
                  style={{ padding: "0.4rem 1rem", borderRadius: "0.5rem", border: "none", background: "#dc3545", color: "white", fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}
                >
                  <i className="fas fa-times"></i> Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}