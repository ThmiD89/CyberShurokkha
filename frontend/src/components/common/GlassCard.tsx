// src/components/ui/GlassCard.tsx

export default function GlassCard({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{
        background: "var(--card-bg)",
        padding: "2rem",
        borderRadius: "1.2rem",
        border: "1px solid var(--card-border)",
        boxShadow: "var(--card-shadow)",
        transition: "all 0.3s ease",
        ...style,
      }}
    >
      {children}
    </div>
  );
}