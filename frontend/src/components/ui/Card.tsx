"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  variant?: "default" | "glass" | "outline" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  hoverable?: boolean;
}

const variantStyles = {
  default: {
    background: "var(--card-bg)",
    border: "1px solid var(--card-border)",
    boxShadow: "var(--card-shadow)",
  },
  glass: {
    background: "rgba(255,255,255,0.55)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    border: "1px solid rgba(255,255,255,0.6)",
    boxShadow: "var(--card-shadow)",
  },
  outline: {
    background: "transparent",
    border: "1px solid var(--border-color)",
    boxShadow: "none",
  },
  elevated: {
    background: "var(--card-bg)",
    border: "1px solid var(--card-border)",
    boxShadow: "var(--card-shadow-hover)",
  },
};

const paddingStyles = {
  none: { padding: "0" },
  sm: { padding: "0.8rem" },
  md: { padding: "1.5rem" },
  lg: { padding: "2rem" },
};

export default function Card({
  children,
  variant = "default",
  padding = "md",
  className = "",
  style = {},
  onClick,
  hoverable = false,
}: CardProps) {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        borderRadius: "1rem",
        transition: "all 0.3s ease",
        cursor: onClick ? "pointer" : "default",
        ...variantStyles[variant],
        ...paddingStyles[padding],
        ...(hoverable && {
          boxShadow: "var(--card-shadow)",
          ":hover": {
            transform: "translateY(-4px)",
            boxShadow: "var(--card-shadow-hover)",
          },
        }),
        ...style,
      }}
      onMouseEnter={(e) => {
        if (hoverable) {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "var(--card-shadow-hover)";
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable) {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "var(--card-shadow)";
        }
      }}
    >
      {children}
    </div>
  );
}