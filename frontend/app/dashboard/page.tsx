"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../src/components/ProtectedRoute";
import { useAuth } from "../../src/context/AuthContext";

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
    <div className="card" style={{ textAlign: "center", padding: "1.2rem" }}>
      <div style={{ fontSize: "1.6rem" }}>{icon}</div>
      <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--text-dark)" }}>{value}</div>
      <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{label}</div>
    </div>
  );
}

function MyProgressContent() {
  const { user } = useAuth();
  const [data, setData] = useState<ActivityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/me/activity", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return res.json();
      })
      .then((json: ActivityResponse) => setData(json))
      .catch(() => setError("Could not load your activity. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <a href="/" style={{ color: "var(--accent)", textDecoration: "none", display: "inline-block", marginBottom: "1.5rem" }}>
          ← Back to Home
        </a>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 700, color: "var(--text-dark)" }}>📊 Dashboard</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
            Welcome back, {user?.full_name}
          </p>
        </div>

        {loading && <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>Loading...</p>}
        {error && <p style={{ textAlign: "center", color: "#dc3545" }}>{error}</p>}

        {data && (
          <>
            {/* Stats grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "0.6rem",
                marginBottom: "2rem",
              }}
            >
              <StatCard label="Scam Checks" value={data.stats.total_scam_scans} icon="📩" />
              <StatCard label="URL/QR Checks" value={data.stats.total_url_scans} icon="🔗" />
              <StatCard label="Job Checks" value={data.stats.total_job_checks} icon="🕵️" />
              <StatCard label="Reports Filed" value={data.stats.total_reports} icon="📢" />
              <StatCard label="Log Scans" value={data.stats.total_log_scans} icon="🛰️" />
              <StatCard label="Lessons Done" value={data.stats.lessons_completed} icon="🎓" />
              <StatCard label="Dangers Caught" value={data.stats.dangerous_count} icon="🚨" />
            </div>

            {/* Activity timeline */}
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text-dark)", marginBottom: "1rem" }}>
              Recent Activity
            </h2>

            {data.items.length === 0 ? (
              <div className="card" style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>
                No activity yet — try the Scam Detector, QR Scanner, or Job Checker to get started.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                {data.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="card"
                    style={{ display: "flex", alignItems: "flex-start", gap: "0.9rem", padding: "1rem 1.2rem" }}
                  >
                    <span style={{ fontSize: "1.4rem" }}>{TYPE_ICON[item.type] || "•"}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" }}>
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