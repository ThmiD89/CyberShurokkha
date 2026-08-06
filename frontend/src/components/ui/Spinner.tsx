"use client";

export default function Spinner({
  size = 30,
  color = "var(--accent)",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `3px solid var(--border-color)`,
        borderTopColor: color,
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
  );
}