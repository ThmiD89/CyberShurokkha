"use client";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export default function SectionTitle({
  title,
  subtitle,
  align = "center",
  className = "",
}: SectionTitleProps) {
  return (
    <div
      className={className}
      style={{
        textAlign: align,
        marginBottom: "2rem",
      }}
    >
      <h2
        style={{
          fontSize: "1.9rem",
          fontWeight: 700,
          color: "var(--text-dark)",
          letterSpacing: "-0.01em",
          marginBottom: subtitle ? "0.5rem" : "0",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            fontSize: "1rem",
            color: "var(--text-secondary)",
            maxWidth: "600px",
            margin: align === "center" ? "0 auto" : "0",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}