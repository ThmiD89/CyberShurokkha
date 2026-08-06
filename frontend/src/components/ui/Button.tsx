"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  style?: React.CSSProperties;
  icon?: ReactNode;
}

const variantStyles = {
  primary: {
    background: "var(--accent)",
    color: "white",
    border: "none",
    hoverBackground: "var(--accent-hover)",
  },
  secondary: {
    background: "var(--btn-secondary)",
    color: "var(--text-primary)",
    border: "1px solid var(--border-color)",
    hoverBackground: "var(--btn-secondary-hover)",
  },
  outline: {
    background: "transparent",
    color: "var(--text-primary)",
    border: "1px solid var(--border-color)",
    hoverBackground: "var(--bg-secondary)",
  },
  ghost: {
    background: "transparent",
    color: "var(--text-primary)",
    border: "none",
    hoverBackground: "var(--bg-secondary)",
  },
  danger: {
    background: "#dc3545",
    color: "white",
    border: "none",
    hoverBackground: "#c82333",
  },
};

const sizeStyles = {
  sm: { padding: "0.4rem 1rem", fontSize: "0.8rem" },
  md: { padding: "0.6rem 1.5rem", fontSize: "0.9rem" },
  lg: { padding: "0.8rem 2rem", fontSize: "1rem" },
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  className = "",
  style = {},
  icon,
}: ButtonProps) {
  const variantStyle = variantStyles[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        borderRadius: "0.5rem",
        fontWeight: 600,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        transition: "all 0.3s ease",
        width: fullWidth ? "100%" : "auto",
        opacity: disabled || loading ? 0.6 : 1,
        ...variantStyle,
        ...sizeStyles[size],
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading && variantStyle.hoverBackground) {
          e.currentTarget.style.background = variantStyle.hoverBackground;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.background = variantStyle.background;
          if (variantStyle.border) {
            e.currentTarget.style.border = variantStyle.border;
          }
        }
      }}
    >
      {loading ? (
        <>
          <span
            style={{
              display: "inline-block",
              width: "18px",
              height: "18px",
              border: "2px solid currentColor",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          Loading...
        </>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}