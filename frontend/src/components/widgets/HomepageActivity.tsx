"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Card from "../ui/Card";
import SectionTitle from "../common/SectionTitle";
import Spinner from "../ui/Spinner";

// --------------------- Types ---------------------
interface ModuleStats {
  scam_scans: number;
  url_scans: number;
  log_scans: number;
  job_checks: number;
  reports: number;
}

interface ActivityItem {
  type: string;
  module: string;
  summary: string;
  risk: string | null;
  timestamp: string;
}

interface DailyTrend {
  date: string;
  count: number;
}

interface HomepageActivityData {
  module_stats: ModuleStats;
  recent_activity: ActivityItem[];
  daily_trend: DailyTrend[];
}

// --------------------- Helpers ---------------------
function formatTimeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}

function getRiskColor(risk: string | null): string {
  if (risk === "dangerous") return "#e74c3c";
  if (risk === "medium") return "#f39c12";
  if (risk === "safe") return "#2ecc71";
  return "#95a5a6";
}

function getRiskIcon(risk: string | null): string {
  if (risk === "dangerous") return "🚨";
  if (risk === "medium") return "⚠️";
  if (risk === "safe") return "✅";
  return "📌";
}

function getModuleIcon(module: string): string {
  const map: Record<string, string> = {
    "Scam Detector": "📩",
    "URL & QR Scanner": "🔗",
    "Log Scanner": "🛰️",
    "Fraud Job Detection": "🕵️",
    "Community Reports": "📋",
  };
  return map[module] || "📊";
}

// --------------------- Main Component ---------------------
export default function HomepageActivity() {
  const [data, setData] = useState<HomepageActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/homepage-activity")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // ─── Loading State ────────────────────────────────
  if (loading) {
    return (
      <>
        <Divider />
        <section
          style={{
            padding: "4rem 2rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <Spinner size={40} />
            <p style={{ marginTop: "1rem", color: "var(--text-secondary)" }}>
              Loading activity…
            </p>
          </div>
        </section>
        <Divider />
      </>
    );
  }

  // ─── Error State ──────────────────────────────────
  if (error || !data) {
    return (
      <>
        <Divider />
        <section style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <p style={{ color: "var(--text-secondary)" }}>
            ⚠️ Could not load live activity.
          </p>
        </section>
        <Divider />
      </>
    );
  }

  const { module_stats, recent_activity, daily_trend } = data;

  // Stats cards configuration
  const statCards = [
    { key: "scam_scans", label: "Scam Detector", icon: "📩", value: module_stats.scam_scans },
    { key: "url_scans", label: "URL & QR Scanner", icon: "🔗", value: module_stats.url_scans },
    { key: "log_scans", label: "Log Scanner", icon: "🛰️", value: module_stats.log_scans },
    { key: "job_checks", label: "Fraud Job Detection", icon: "🕵️", value: module_stats.job_checks },
    { key: "reports", label: "Community Reports", icon: "📋", value: module_stats.reports },
  ];

  // ─── Render ────────────────────────────────────────
  return (
    <>
      <Divider />

      <section
        style={{
          padding: "4rem 2rem",
          background: "var(--bg-secondary)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
          }}
        >
          <SectionTitle
            title="📊 Live Activity"
            subtitle="Real‑time checks and reports from the community"
          />

          {/* ── Stats Row ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1.5rem",
              marginBottom: "3rem",
            }}
          >
            {statCards.map((stat) => (
              <Card
                key={stat.key}
                variant="default"
                hoverable
                style={{
                  textAlign: "center",
                  padding: "1.5rem 1rem",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>
                  {stat.icon}
                </div>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: "var(--text-dark)",
                  }}
                >
                  {stat.value.toLocaleString()}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  {stat.label}
                </div>
              </Card>
            ))}
          </div>

          {/* ── Split View: Feed + Chart ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2rem",
              alignItems: "start",
            }}
          >
            {/* Activity Feed */}
            <Card variant="glass" style={{ padding: "1.5rem" }}>
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  color: "var(--text-dark)",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span>🔄</span> Recent Activity
              </h3>
              <div
                style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  paddingRight: "0.5rem",
                }}
              >
                {recent_activity.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.6rem 0.8rem",
                      background: "var(--bg-secondary)",
                      borderRadius: "0.75rem",
                      borderLeft: `4px solid ${getRiskColor(item.risk)}`,
                    }}
                  >
                    <span style={{ fontSize: "1.2rem" }}>
                      {getModuleIcon(item.module)}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 500,
                          color: "var(--text-dark)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.summary}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          fontSize: "0.7rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        <span>{item.module}</span>
                        {item.risk && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.2rem",
                            }}
                          >
                            {getRiskIcon(item.risk)} {item.risk}
                          </span>
                        )}
                        <span>•</span>
                        <span>{formatTimeAgo(item.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {recent_activity.length === 0 && (
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      textAlign: "center",
                      padding: "1rem",
                    }}
                  >
                    No recent activity
                  </p>
                )}
              </div>
            </Card>

            {/* Chart */}
            <Card variant="glass" style={{ padding: "1.5rem" }}>
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  color: "var(--text-dark)",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span>📈</span> Daily Scan Trend
              </h3>
              <div style={{ width: "100%", height: "250px" }}>
                <ResponsiveContainer>
                  <BarChart
                    data={daily_trend}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  >
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: "var(--text-secondary)" }}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "var(--text-secondary)" }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "var(--card-bg)",
                        border: "1px solid var(--card-border)",
                        borderRadius: "0.5rem",
                      }}
                      labelStyle={{ color: "var(--text-dark)" }}
                      itemStyle={{ color: "var(--text-secondary)" }}
                    />
                    <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]}>
                      {daily_trend.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.count > 0 ? "var(--accent)" : "var(--border-color)"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <Divider />
    </>
  );
}

// ─── Reusable Divider ──────────────────────────────
function Divider() {
  return (
    <div
      style={{
        width: "100%",
        height: "2px",
        background:
          "linear-gradient(90deg, transparent, var(--border-color), transparent)",
        margin: "0 auto",
        maxWidth: "1280px",
      }}
    />
  );
}