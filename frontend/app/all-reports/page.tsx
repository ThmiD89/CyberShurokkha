"use client";

import { useState, useEffect } from "react";
import PageContainer from "../../src/components/common/PageContainer";
import BackHome from "../../src/components/common/BackHome";
import PageHero from "../../src/components/common/PageHero";
import StatsRow from "../../src/components/common/StatsRow";
import GlassCard from "../../src/components/ui/Card";
import Button from "../../src/components/ui/Button";
import Badge from "../../src/components/ui/Badge";

interface Report {
  id: string;
  district_id: number;
  district_name_en: string;
  district_name_bn: string;
  category: string;
  description: string;
  status: string;
  created_at: string;
}

interface District {
  district_id: number;
  name_en: string;
  name_bn: string;
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

const statusLabels: Record<string, string> = {
  approved: "Approved",
  pending: "Pending Review",
  rejected: "Rejected",
};

export default function AllReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    district_id: "",
    category: "",
    status: "",
    date_from: "",
    date_to: "",
    search: "",
  });

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetch(`${API_BASE}/districts`)
      .then((res) => res.json())
      .then((data) => setDistricts(data))
      .catch(() => console.error("Failed to fetch districts"));
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filters.district_id) params.append("district_id", filters.district_id);
      if (filters.category) params.append("category", filters.category);
      if (filters.status) params.append("status", filters.status);
      if (filters.date_from) params.append("date_from", filters.date_from);
      if (filters.date_to) params.append("date_to", filters.date_to);
      if (filters.search) params.append("search", filters.search);

      const res = await fetch(`${API_BASE}/reports?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch reports");
      const data = await res.json();
      setReports(data);
    } catch (err) {
      setError("Could not load reports. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchReports();
  };

  const clearFilters = () => {
    setFilters({
      district_id: "",
      category: "",
      status: "",
      date_from: "",
      date_to: "",
      search: "",
    });
    setTimeout(fetchReports, 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ─── Stats for StatsRow ──────────────────────────────
  const stats = [
    {
      label: "Total Reports",
      value: reports.length,
      icon: "📋",
    },
    {
      label: "Approved",
      value: reports.filter((r) => r.status === "approved").length,
      icon: "✅",
    },
    {
      label: "Pending Review",
      value: reports.filter((r) => r.status === "pending").length,
      icon: "⏳",
    },
    {
      label: "High Risk",
      value: reports.filter((r) => r.category === "phishing_url" || r.category === "scam_call").length,
      icon: "🚨",
    },
  ];

  return (
    <PageContainer>
      <BackHome />

      <PageHero
        badge="📡 Live Threat Intelligence"
        icon="🛡️"
        title="Threat Feed"
        subtitle="Verified community reports across Bangladesh"
      />

      {/* Stats */}
      <StatsRow stats={stats} />

      {/* ─── Filters ─── */}
      <GlassCard style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
          }}
        >
          {/* District */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "var(--text-secondary)",
                marginBottom: "0.3rem",
              }}
            >
              District
            </label>
            <select
              value={filters.district_id}
              onChange={(e) => handleFilterChange("district_id", e.target.value)}
              style={{
                width: "100%",
                padding: "0.6rem 0.9rem",
                borderRadius: "0.6rem",
                border: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                fontSize: "0.9rem",
              }}
            >
              <option value="">All Districts</option>
              {districts.map((d) => (
                <option key={d.district_id} value={d.district_id}>
                  {d.name_en}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "var(--text-secondary)",
                marginBottom: "0.3rem",
              }}
            >
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              style={{
                width: "100%",
                padding: "0.6rem 0.9rem",
                borderRadius: "0.6rem",
                border: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                fontSize: "0.9rem",
              }}
            >
              <option value="">All Categories</option>
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "var(--text-secondary)",
                marginBottom: "0.3rem",
              }}
            >
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              style={{
                width: "100%",
                padding: "0.6rem 0.9rem",
                borderRadius: "0.6rem",
                border: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                fontSize: "0.9rem",
              }}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Date From */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "var(--text-secondary)",
                marginBottom: "0.3rem",
              }}
            >
              Date From
            </label>
            <input
              type="date"
              value={filters.date_from}
              onChange={(e) => handleFilterChange("date_from", e.target.value)}
              style={{
                width: "100%",
                padding: "0.6rem 0.9rem",
                borderRadius: "0.6rem",
                border: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                fontSize: "0.9rem",
              }}
            />
          </div>

          {/* Date To */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "var(--text-secondary)",
                marginBottom: "0.3rem",
              }}
            >
              Date To
            </label>
            <input
              type="date"
              value={filters.date_to}
              onChange={(e) => handleFilterChange("date_to", e.target.value)}
              style={{
                width: "100%",
                padding: "0.6rem 0.9rem",
                borderRadius: "0.6rem",
                border: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                fontSize: "0.9rem",
              }}
            />
          </div>

          {/* Search */}
          <div style={{ gridColumn: "span 1" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "var(--text-secondary)",
                marginBottom: "0.3rem",
              }}
            >
              Search
            </label>
            <input
              type="text"
              placeholder="Search description..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              style={{
                width: "100%",
                padding: "0.6rem 0.9rem",
                borderRadius: "0.6rem",
                border: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                fontSize: "0.9rem",
              }}
            />
          </div>
        </div>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            gap: "0.8rem",
            marginTop: "1.2rem",
            flexWrap: "wrap",
          }}
        >
          <Button variant="primary" onClick={applyFilters}>
            🔍 Apply Filters
          </Button>
          <Button variant="outline" onClick={clearFilters}>
            ✕ Clear Filters
          </Button>
          <span
            style={{
              marginLeft: "auto",
              fontSize: "0.85rem",
              color: "var(--text-secondary)",
              alignSelf: "center",
            }}
          >
            {reports.length} report{reports.length !== 1 ? "s" : ""} found
          </span>
        </div>
      </GlassCard>

      {/* ─── Results ─── */}
      {loading && (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid var(--border-color)",
              borderTopColor: "var(--accent)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto",
            }}
          />
          <p style={{ marginTop: "1rem", color: "var(--text-secondary)" }}>
            Loading reports...
          </p>
        </div>
      )}

      {error && (
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            background: "#fee2e2",
            borderRadius: "0.8rem",
            color: "#b71c1c",
          }}
        >
          ❌ {error}
        </div>
      )}

      {!loading && !error && reports.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            background: "var(--card-bg)",
            borderRadius: "1rem",
            border: "1px solid var(--card-border)",
          }}
        >
          <span style={{ fontSize: "3rem", display: "block", marginBottom: "0.5rem" }}>
            🔍
          </span>
          <h3 style={{ color: "var(--text-dark)" }}>No reports found</h3>
          <p style={{ color: "var(--text-secondary)" }}>
            {filters.search ||
            filters.district_id ||
            filters.category ||
            filters.status ||
            filters.date_from ||
            filters.date_to
              ? "Try adjusting your filters."
              : "No reports have been submitted yet."}
          </p>
        </div>
      )}

      {/* ─── Threat Cards ─── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
        {reports.map((report) => (
          <GlassCard
            key={report.id}
            hoverable
            style={{ padding: "1.5rem 1.8rem" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ fontSize: "1.5rem" }}>
                    {CATEGORY_ICONS[report.category] || "📌"}
                  </span>
                  <h3
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 600,
                      color: "var(--text-dark)",
                    }}
                  >
                    {CATEGORY_LABELS[report.category] || report.category}
                  </h3>
                  <Badge
                    variant={
                      report.status === "approved"
                        ? "success"
                        : report.status === "pending"
                        ? "warning"
                        : "danger"
                    }
                    size="sm"
                  >
                    {statusLabels[report.status] || report.status}
                  </Badge>
                </div>
                <p
                  style={{
                    fontSize: "0.95rem",
                    color: "var(--text-secondary)",
                    marginTop: "0.3rem",
                  }}
                >
                  📍 {report.district_name_en}{" "}
                  <span
                    style={{
                      color: "var(--text-secondary)",
                      opacity: 0.7,
                    }}
                  >
                    ({report.district_name_bn})
                  </span>
                </p>
              </div>
            </div>

            <p
              style={{
                fontSize: "1rem",
                color: "var(--text-primary)",
                margin: "0.8rem 0",
                lineHeight: "1.6",
              }}
            >
              {report.description}
            </p>

            <small
              style={{
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
              }}
            >
              📅 {formatDate(report.created_at)}
            </small>
          </GlassCard>
        ))}
      </div>

      {/* ─── Report CTA ─── */}
      {!loading && reports.length > 0 && (
        <div
          style={{
            marginTop: "3rem",
            padding: "2rem",
            background: "var(--bg-secondary)",
            borderRadius: "1rem",
            textAlign: "center",
            border: "1px solid var(--border-color)",
          }}
        >
          <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--text-dark)" }}>
            👀 See something suspicious?
          </h3>
          <p style={{ color: "var(--text-secondary)", margin: "0.5rem 0 1rem" }}>
            Help protect your community by reporting incidents.
          </p>
          <a href="/report">
            <Button variant="primary">🚨 Report Incident</Button>
          </a>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </PageContainer>
  );
}