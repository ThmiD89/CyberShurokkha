"use client";

import Link from "next/link";

export default function BackHome() {
  return (
    <Link
      href="/"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.6rem",
        padding: "0.6rem 1.4rem",
        borderRadius: "999px",
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(18px)",
        border: "1px solid rgba(167,139,250,0.18)",
        color: "var(--accent)",
        fontWeight: 600,
        fontSize: "0.9rem",
        textDecoration: "none",
        transition: "all 0.3s ease",
        marginBottom: "1.5rem",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 12px 30px rgba(167,139,250,0.18)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <span>🏠</span>
      <span>Back to Home</span>
    </Link>
  );
}