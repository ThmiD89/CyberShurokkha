"use client";

import dynamic from "next/dynamic";

const MapInner = dynamic(() => import("./MapInner"), {
  ssr: false,
  loading: () => <div style={{ padding: "2rem" }}>Loading map...</div>,
});

export default function ThreatMapPage() {
  return <MapInner />;
}