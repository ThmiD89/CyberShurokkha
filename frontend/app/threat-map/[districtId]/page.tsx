"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Report {
  id: string;
  category: string;
  description: string;
  created_at: string;
  status: string;
  district_name_en: string;
  district_name_bn: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  sms_scam: "SMS Scam",
  scam_call: "Scam Call",
  phishing_url: "Phishing URL",
  fake_job: "Fake Job",
  qr_scam: "QR Scam",
  social_media_scam: "Social Media Scam",
  investment_fraud: "Investment Fraud",
  other: "Other",
};

const CATEGORY_ICONS: Record<string, string> = {
  sms_scam: "📱",
  scam_call: "📞",
  phishing_url: "🔗",
  fake_job: "💼",
  qr_scam: "📷",
  social_media_scam: "📲",
  investment_fraud: "💰",
  other: "📌",
};

const statusColors: Record<string, string> = {
  approved: "#4CAF50",
  pending: "#ff9800",
  rejected: "#dc3545",
};

export default function DistrictDetailPage() {
  const params = useParams();
  const router = useRouter();
  const districtId = params.districtId as string;
  const [reports, setReports] = useState<Report[]>([]);
  const [districtName, setDistrictName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetch(`${API_BASE}/reports?district_id=${districtId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch reports");
        return res.json();
      })
      .then((data) => {
        setReports(data);
        if (data.length > 0) {
          setDistrictName(`${data[0].district_name_en} (${data[0].district_name_bn})`);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [districtId]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "40px", height: "40px", border: "4px solid var(--border-color)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }} />
          <p style={{ marginTop: "1rem", color: "var(--text-secondary)" }}>Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "4rem 1.5rem", textAlign: "center" }}>
        <p style={{ color: "#dc3545" }}>Error: {error}</p>
        <button onClick={() => router.push("/threat-map")} style={{ marginTop: "1rem", padding: "0.5rem 1.5rem", borderRadius: "0.5rem", border: "none", background: "var(--accent)", color: "white", cursor: "pointer" }}>
          ← Back to Map
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "4rem 1.5rem", minHeight: "70vh" }}>
      <button
        onClick={() => router.push("/threat-map")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.5rem 1.2rem",
          borderRadius: "0.5rem",
          border: "none",
          background: "var(--bg-secondary)",
          color: "var(--text-primary)",
          cursor: "pointer",
          marginBottom: "2rem",
        }}
      >
        ← Back to Map
      </button>

      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--text-dark)" }}>
          📍 {districtName || "District"}
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          {reports.length} report{reports.length !== 1 ? "s" : ""} in this district
        </p>
      </div>

      {reports.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", background: "var(--card-bg)", borderRadius: "1rem", border: "1px solid var(--card-border)" }}>
          <span style={{ fontSize: "3rem" }}>🔍</span>
          <h3 style={{ color: "var(--text-dark)" }}>No reports found</h3>
          <p style={{ color: "var(--text-secondary)" }}>This district has no scam reports yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          {reports.map((report) => (
            <div
              key={report.id}
              style={{
                background: "var(--card-bg)",
                padding: "1.5rem 1.8rem",
                borderRadius: "1rem",
                border: "1px solid var(--card-border)",
                boxShadow: "var(--card-shadow)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", flexWrap: "wrap", gap: "0.5rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "1.5rem" }}>{CATEGORY_ICONS[report.category] || "📌"}</span>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--text-dark)" }}>
                      {CATEGORY_LABELS[report.category] || report.category}
                    </h3>
                  </div>
                </div>
                <span
                  style={{
                    padding: "0.3rem 1rem",
                    borderRadius: "2rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    background: `${statusColors[report.status] || "#95a5a6"}22`,
                    color: statusColors[report.status] || "#95a5a6",
                    border: `1px solid ${statusColors[report.status] || "#95a5a6"}44`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {report.status.toUpperCase()}
                </span>
              </div>

              <p style={{ fontSize: "1rem", color: "var(--text-primary)", margin: "0.8rem 0", lineHeight: "1.6" }}>
                {report.description}
              </p>

              <small style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                📅 {new Date(report.created_at).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}