"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
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
  category: string;
  description: string;
  created_at: string;
};

export default function ThreatMapPage() {
  const [data, setData] = useState<DistrictSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportsByDistrict, setReportsByDistrict] = useState<Record<number, Report[]>>({});

  useEffect(() => {
    fetch("http://localhost:8000/threat-map/summary")
      .then((res) => res.json())
      .then((json: DistrictSummary[]) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load threat map data:", err);
        setLoading(false);
      });

    // Fetch ALL reports once, group by district client-side
    // (avoids firing 64 separate requests, one per district)
    fetch("http://localhost:8000/reports")
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
  }, []);

  if (loading) {
    return <div style={{ padding: "2rem" }}>Loading threat map...</div>;
  }

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={[23.685, 90.3563]}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
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
            >
              <Tooltip direction="top" offset={[0, -radius]} opacity={1}>
                <div style={{ minWidth: "180px" }}>
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
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}