"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../src/components/ProtectedRoute";
import { useAuth } from "../../src/context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type ActivityItem = {
  type: string;
  title: string;
  detail: string;
  risk_level: string | null;
  created_at: string;
};

type ActivityStats = {
  total_scam_scans: number;
  total_url_scans: number;
  total_job_checks: number;
  total_reports: number;
  total_log_scans: number;
  dangerous_count: number;
  lessons_completed: number;
};

type ActivityResponse = {
  stats: ActivityStats;
  items: ActivityItem[];
};

type Tier = {
  id: number;
  name_en: string;
  name_bn: string;
  order_index: number;
  unlocked: boolean;
  lessons_completed: number;
  lessons_total: number;
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

function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div
      className="card"
      style={{
        textAlign: "center",
        padding: "1rem 0.5rem",
        transition: "transform 0.2s",
        cursor: "default",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div style={{ fontSize: "1.4rem" }}>{icon}</div>
      <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--text-dark)" }}>{value}</div>
      <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>{label}</div>
    </div>
  );
}

function MyProgressContent() {
  const { user } = useAuth();
  const [data, setData] = useState<ActivityResponse | null>(null);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tiersLoading, setTiersLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/me/activity", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return res.json();
      })
      .then((json: ActivityResponse) => setData(json))
      .catch(() => setError("Could not load your activity. Is the backend running?"))
      .finally(() => setLoading(false));

    fetch("http://localhost:8000/learn/tiers", { credentials: "include" })
      .then((res) => res.json())
      .then((json: Tier[]) => {
        setTiers(json);
        setTiersLoading(false);
      })
      .catch(() => setTiersLoading(false));
  }, []);

  const now = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const chartData = days.map((day) => {
    const count = data?.items.filter(
      (item) => new Date(item.created_at).toISOString().split("T")[0] === day
    ).length || 0;
    return { date: day, count };
  });

  const stats = data?.stats || {
    total_scam_scans: 0,
    total_url_scans: 0,
    total_job_checks: 0,
    total_reports: 0,
    total_log_scans: 0,
    dangerous_count: 0,
    lessons_completed: 0,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Back to Home Button - Styled */}
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 1.2rem",
            borderRadius: "2rem",
            border: "1px solid var(--border-color)",
            background: "var(--card-bg)",
            color: "var(--text-primary)",
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: 500,
            transition: "all 0.3s",
            marginBottom: "1.5rem",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--bg-secondary)";
            e.currentTarget.style.transform = "translateX(-4px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--card-bg)";
            e.currentTarget.style.transform = "translateX(0)";
          }}
        >
          <span>🏠</span> Back to Home
        </a>

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div>
            <h1 style={{ fontSize: "2.2rem", fontWeight: 700, color: "var(--text-dark)" }}>
              👋 Welcome back, {user?.full_name || "User"}!
            </h1>
            <p style={{ color: "var(--text-secondary)", marginTop: "0.3rem" }}>
              Here's your activity summary and progress.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            <a href="/scan" className="btn-primary" style={{ fontSize: "0.85rem", padding: "0.5rem 1.2rem" }}>
              🔍 Scan
            </a>
            <a href="/report" className="btn-secondary" style={{ fontSize: "0.85rem", padding: "0.5rem 1.2rem" }}>
              📋 Report
            </a>
            <a href="/learn-hub" className="btn-secondary" style={{ fontSize: "0.85rem", padding: "0.5rem 1.2rem" }}>
              🎓 Learn
            </a>
          </div>
        </div>

        {loading && <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>Loading dashboard...</p>}
        {error && <p style={{ textAlign: "center", color: "#dc3545" }}>{error}</p>}

        {!loading && !error && data && (
          <>
            {/* Stats grid - single row with 7 columns */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "0.8rem",
                marginBottom: "2rem",
              }}
            >
              <StatCard label="Scam Checks" value={stats.total_scam_scans} icon="📩" />
              <StatCard label="URL/QR Checks" value={stats.total_url_scans} icon="🔗" />
              <StatCard label="Job Checks" value={stats.total_job_checks} icon="🕵️" />
              <StatCard label="Reports Filed" value={stats.total_reports} icon="📢" />
              <StatCard label="Log Scans" value={stats.total_log_scans} icon="🛰️" />
              <StatCard label="Lessons Done" value={stats.lessons_completed} icon="🎓" />
              <StatCard label="Dangers Caught" value={stats.dangerous_count} icon="🚨" />
            </div>

            {/* Two columns: Chart + Learning Progress */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
                marginBottom: "2rem",
              }}
            >
              {/* Chart */}
              <div
                className="card"
                style={{
                  padding: "1.5rem",
                }}
              >
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-dark)", marginBottom: "1rem" }}>
                  📊 Daily Activity (Last 7 Days)
                </h3>
                <div style={{ width: "100%", height: "200px" }}>
                  <ResponsiveContainer>
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--text-secondary)" }} />
                      <YAxis tick={{ fontSize: 10, fill: "var(--text-secondary)" }} allowDecimals={false} />
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
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.count > 0 ? "var(--accent)" : "var(--border-color)"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Learning Progress */}
              <div
                className="card"
                style={{
                  padding: "1.5rem",
                }}
              >
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-dark)", marginBottom: "1rem" }}>
                  🎓 Learning Progress
                </h3>
                {tiersLoading ? (
                  <p style={{ color: "var(--text-secondary)" }}>Loading tiers...</p>
                ) : tiers.length === 0 ? (
                  <p style={{ color: "var(--text-secondary)" }}>No learning tiers available.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                    {tiers.map((tier) => (
                      <div
                        key={tier.id}
                        style={{
                          padding: "0.8rem 1rem",
                          borderRadius: "0.5rem",
                          background: tier.unlocked ? "var(--bg-secondary)" : "var(--bg-secondary)",
                          opacity: tier.unlocked ? 1 : 0.6,
                          border: tier.unlocked ? "1px solid var(--accent)" : "1px solid var(--border-color)",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontWeight: 500, color: "var(--text-dark)" }}>
                            {tier.name_en} {!tier.unlocked && "🔒"}
                          </span>
                          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                            {tier.lessons_completed}/{tier.lessons_total} lessons
                          </span>
                        </div>
                        <div
                          style={{
                            width: "100%",
                            height: "4px",
                            background: "var(--border-color)",
                            borderRadius: "4px",
                            marginTop: "4px",
                          }}
                        >
                          <div
                            style={{
                              width: `${(tier.lessons_completed / tier.lessons_total) * 100}%`,
                              height: "4px",
                              background: tier.unlocked ? "var(--accent)" : "#6b7280",
                              borderRadius: "4px",
                              transition: "width 0.3s",
                            }}
                          />
                        </div>
                        {tier.unlocked && tier.lessons_completed === tier.lessons_total && (
                          <div style={{ fontSize: "0.7rem", color: "#4CAF50", marginTop: "4px" }}>
                            ✅ Completed!
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity Timeline */}
            <h2
              style={{
                fontSize: "1.3rem",
                fontWeight: 700,
                color: "var(--text-dark)",
                marginBottom: "1rem",
              }}
            >
              🔄 Recent Activity
            </h2>

            {data.items.length === 0 ? (
              <div
                className="card"
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "var(--text-secondary)",
                }}
              >
                No activity yet — try the Scam Detector, QR Scanner, or Job Checker to get started.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                {data.items.slice(0, 20).map((item, idx) => (
                  <div
                    key={idx}
                    className="card"
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.9rem",
                      padding: "1rem 1.2rem",
                      transition: "transform 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateX(4px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateX(0)")}
                  >
                    <span style={{ fontSize: "1.4rem" }}>{TYPE_ICON[item.type] || "•"}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "0.5rem",
                          flexWrap: "wrap",
                        }}
                      >
                        <span style={{ fontWeight: 600, color: "var(--text-dark)", fontSize: "0.9rem" }}>
                          {item.title}
                        </span>
                        {item.risk_level && (
                          <span
                            style={{
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              color: riskColor(item.risk_level),
                            }}
                          >
                            {item.risk_level}
                          </span>
                        )}
                      </div>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--text-secondary)",
                          margin: "0.25rem 0 0",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.detail}
                      </p>
                      <p style={{ fontSize: "0.7rem", color: "var(--text-secondary)", margin: "0.3rem 0 0" }}>
                        {TYPE_LABEL[item.type]} · {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function MyProgressPage() {
  return (
    <ProtectedRoute>
      <MyProgressContent />
    </ProtectedRoute>
  );
}