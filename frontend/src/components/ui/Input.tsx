"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helper,
      fullWidth = true,
      icon,
      iconPosition = "left",
      className = "",
      style = {},
      ...props
    },
    ref
  ) => {
    return (
      <div
        style={{
          width: fullWidth ? "100%" : "auto",
          marginBottom: "1rem",
        }}
      >
        {label && (
          <label
            style={{
              display: "block",
              fontWeight: 600,
              color: "var(--text-dark)",
              marginBottom: "0.4rem",
              fontSize: "0.9rem",
            }}
          >
            {label}
          </label>
        )}
        <div style={{ position: "relative" }}>
          {icon && iconPosition === "left" && (
            <span
              style={{
                position: "absolute",
                left: "0.8rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-secondary)",
                pointerEvents: "none",
              }}
            >
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={className}
            style={{
              width: "100%",
              padding: icon && iconPosition === "left" ? "0.8rem 0.8rem 0.8rem 2.8rem" : "0.8rem 1rem",
              paddingRight: icon && iconPosition === "right" ? "2.8rem" : "1rem",
              border: error ? "2px solid #dc3545" : "2px solid var(--border-color)",
              borderRadius: "0.75rem",
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              fontSize: "0.95rem",
              transition: "border-color 0.3s ease, box-shadow 0.3s ease",
              outline: "none",
              ...style,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(167,139,250,0.15)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = error ? "#dc3545" : "var(--border-color)";
              e.currentTarget.style.boxShadow = "none";
            }}
            {...props}
          />
          {icon && iconPosition === "right" && (
            <span
              style={{
                position: "absolute",
                right: "0.8rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-secondary)",
                pointerEvents: "none",
              }}
            >
              {icon}
            </span>
          )}
        </div>
        {error && (
          <p style={{ color: "#dc3545", fontSize: "0.8rem", marginTop: "0.3rem" }}>{error}</p>
        )}
        {helper && !error && (
          <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginTop: "0.3rem" }}>{helper}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;