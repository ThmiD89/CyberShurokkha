"use client";

import { useEffect, useState } from "react";

type Report = {
  id: string;
  district_id: number;
  district_name_en: string;
  district_name_bn: string;
  category: string;
  description: string;
  status: string;
  created_at: string;
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

export default function AllReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/reports")
      .then((res) => res.json())
      .then((data) => {
        setReports(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <a href="/" style={{ color: "var(--accent)", textDecoration: "none", display: "inline-block", marginBottom: "1.5rem" }}>
          ← Back to Home
        </a>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--text-dark)" }}>
            📋 All Scam Reports
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
            {reports.length} report{reports.length !== 1 ? "s" : ""} across Bangladesh
          </p>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>Loading reports...</p>
        ) : reports.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>No reports yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {reports.map((r) => (
              <div
                key={r.id}
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "1rem",
                  padding: "1.25rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                  <span style={{ fontWeight: 600, color: "var(--accent)" }}>
                    {CATEGORY_LABELS[r.category] || r.category}
                  </span>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    {r.district_name_en} ({r.district_name_bn})
                  </span>
                </div>
                <p style={{ marginTop: "0.5rem", color: "var(--text-primary)" }}>{r.description}</p>
                <p style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                  {new Date(r.created_at).toLocaleString()} · Status: {r.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}