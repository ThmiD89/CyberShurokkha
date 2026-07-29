"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type DistrictSummary = {
  district_id: number;
  name_en: string;
  name_bn: string;
  centroid_lat: string | null;
  centroid_lng: string | null;
  total_reports: number;
};

export default function ThreatMapPage() {
  const [data, setData] = useState<DistrictSummary[]>([]);
  const [loading, setLoading] = useState(true);

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

          // Radius scales with report count — minimum visible dot even at 0
          const radius = 6 + Math.min(d.total_reports * 4, 30);

          // Color scales from safe (green) to dangerous (red) based on count
          const color =
            d.total_reports === 0
              ? "#22c55e"
              : d.total_reports < 5
              ? "#eab308"
              : "#ef4444";

          return (
            <CircleMarker
              key={d.district_id}
              center={[lat, lng]}
              radius={radius}
              pathOptions={{ color, fillColor: color, fillOpacity: 0.6 }}
            >
              <Popup>
                <strong>{d.name_en}</strong> ({d.name_bn})
                <br />
                Reports: {d.total_reports}
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}