"use client";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const variantStyles = {
  default: {
    background: "var(--bg-secondary)",
    color: "var(--text-primary)",
  },
  success: {
    background: "#4CAF50",
    color: "white",
  },
  warning: {
    background: "#ff9800",
    color: "white",
  },
  danger: {
    background: "#dc3545",
    color: "white",
  },
  info: {
    background: "var(--accent)",
    color: "white",
  },
};

const sizeStyles = {
  sm: { fontSize: "0.65rem", padding: "0.15rem 0.6rem" },
  md: { fontSize: "0.75rem", padding: "0.25rem 0.8rem" },
  lg: { fontSize: "0.85rem", padding: "0.35rem 1rem" },
};

export default function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        borderRadius: "999px",
        fontWeight: 600,
        letterSpacing: "0.3px",
        ...variantStyles[variant],
        ...sizeStyles[size],
      }}
    >
      {children}
    </span>
  );
}