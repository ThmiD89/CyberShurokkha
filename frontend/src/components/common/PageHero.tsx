// src/components/common/PageHero.tsx
"use client";

interface PageHeroProps {
  badge?: string;
  icon?: string;
  title: string;
  subtitle?: string;
  description?: string;
  children?: React.ReactNode;
}

export default function PageHero({
  badge,
  icon,
  title,
  subtitle,
  description,
  children,
}: PageHeroProps) {
  return (
    <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
      {badge && (
        <div
          style={{
            display: "inline-block",
            padding: "0.3rem 1.2rem",
            borderRadius: "2rem",
            background: "var(--accent)",
            color: "white",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.5px",
            marginBottom: "0.8rem",
          }}
        >
          {badge}
        </div>
      )}
      <h1
        style={{
          fontSize: "2.8rem",
          fontWeight: 700,
          color: "var(--text-dark)",
          marginBottom: "0.3rem",
        }}
      >
        {icon && <span style={{ marginRight: "0.5rem" }}>{icon}</span>}
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            fontSize: "1.1rem",
            color: "var(--text-secondary)",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          {subtitle}
        </p>
      )}
      {description && (
        <p
          style={{
            fontSize: "0.95rem",
            color: "var(--text-secondary)",
            maxWidth: "500px",
            margin: "0.5rem auto 0",
            opacity: 0.8,
          }}
        >
          {description}
        </p>
      )}
      {children && <div style={{ marginTop: "1.5rem" }}>{children}</div>}
    </div>
  );
}