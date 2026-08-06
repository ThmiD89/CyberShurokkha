// src/components/common/StatsRow.tsx

interface StatItem {
  label: string;
  value: number | string;
  icon: string;
}

export default function StatsRow({ stats }: { stats: StatItem[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${Math.min(stats.length, 6)}, 1fr)`,
        gap: "1rem",
        marginBottom: "2rem",
      }}
    >
      {stats.map((stat, index) => (
        <div
          key={index}
          className="card"
          style={{
            textAlign: "center",
            padding: "1.2rem",
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            borderRadius: "0.8rem",
            boxShadow: "var(--card-shadow)",
          }}
        >
          <div style={{ fontSize: "1.6rem" }}>{stat.icon}</div>
          <div
            style={{
              fontSize: "1.6rem",
              fontWeight: 700,
              color: "var(--text-dark)",
            }}
          >
            {stat.value}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}