"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import { useRouter } from "next/navigation";
import "leaflet/dist/leaflet.css";

type DistrictSummary = {
  district_id: number;
  name_en: string;
  name_bn: string;
  centroid_lat: string | null;
  centroid_lng: string | null;
  total_reports: number;
};

type Report = {
  id: string;
  district_id: number;
  category: string;
  description: string;
  created_at: string;
  status: string;
};

// Stable reference — created once at module load, not on every render.
// Prevents the useEffect below from re-running (and re-fetching) infinitely.
const DEFAULT_FILTERS = { category: "", status: "" };

interface MapInnerProps {
  filters?: { category: string; status: string };
  showHeatmap?: boolean;
}

export default function MapInner({ filters = DEFAULT_FILTERS, showHeatmap = false }: MapInnerProps) {
  const [data, setData] = useState<DistrictSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportsByDistrict, setReportsByDistrict] = useState<Record<number, Report[]>>({});
  const router = useRouter();

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category) params.append("category", filters.category);
    if (filters.status) params.append("status", filters.status);

    fetch(`${API_BASE}/threat-map/summary?${params.toString()}`)
      .then((res) => res.json())
      .then((json: DistrictSummary[]) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load threat map data:", err);
        setLoading(false);
      });

    fetch(`${API_BASE}/reports?${params.toString()}`)
      .then((res) => res.json())
      .then((reports: (Report & { district_id: number })[]) => {
        const grouped: Record<number, Report[]> = {};
        reports.forEach((r) => {
          if (!grouped[r.district_id]) grouped[r.district_id] = [];
          grouped[r.district_id].push(r);
        });
        setReportsByDistrict(grouped);
      })
      .catch((err) => console.error("Failed to load reports:", err));
  }, [filters]);

  const handleMarkerClick = (districtId: number) => {
    router.push(`/threat-map/${districtId}`);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "40px", height: "40px", border: "4px solid var(--border-color)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }} />
          <p style={{ marginTop: "1rem", color: "var(--text-secondary)" }}>Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative", zIndex: 0 }}>
      <MapContainer
        center={[23.685, 90.3563]}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {data.map((d) => {
          if (!d.centroid_lat || !d.centroid_lng) return null;

          const lat = parseFloat(d.centroid_lat);
          const lng = parseFloat(d.centroid_lng);
          const radius = 6 + Math.min(d.total_reports * 4, 30);
          const color =
            d.total_reports === 0 ? "#22c55e" : d.total_reports < 5 ? "#eab308" : "#ef4444";

          const reports = reportsByDistrict[d.district_id] || [];

          return (
            <CircleMarker
              key={d.district_id}
              center={[lat, lng]}
              radius={radius}
              pathOptions={{ color, fillColor: color, fillOpacity: 0.6 }}
              eventHandlers={{
                click: () => handleMarkerClick(d.district_id),
              }}
            >
              <Tooltip direction="top" offset={[0, -radius]} opacity={1} permanent={false}>
                <div style={{ minWidth: "180px", cursor: "pointer" }}>
                  <strong>{d.name_en}</strong> ({d.name_bn})
                  <br />
                  Total reports: {d.total_reports}
                  {reports.length > 0 && (
                    <ul style={{ margin: "6px 0 0", paddingLeft: "16px" }}>
                      {reports.slice(0, 3).map((r) => (
                        <li key={r.id} style={{ fontSize: "0.8rem" }}>
                          <strong>{r.category.replace(/_/g, " ")}</strong>: {r.description.slice(0, 40)}
                          {r.description.length > 40 ? "..." : ""}
                        </li>
                      ))}
                      {reports.length > 3 && <li>+{reports.length - 3} more...</li>}
                    </ul>
                  )}
                  <div style={{ marginTop: "4px", fontSize: "0.7rem", color: "var(--accent)" }}>
                    Click for details →
                  </div>
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}