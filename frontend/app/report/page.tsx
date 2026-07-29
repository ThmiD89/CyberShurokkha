"use client";

import { useState } from "react";

type District = {
  id: number;
  name_en: string;
  name_bn: string;
};

const CATEGORIES = [
  { value: "sms_scam", label: "SMS Scam" },
  { value: "phishing_url", label: "Phishing URL" },
  { value: "fake_job", label: "Fake Job Posting" },
  { value: "qr_scam", label: "QR Code Scam" },
  { value: "social_media_scam", label: "Social Media Scam" },
  { value: "investment_fraud", label: "Investment Fraud" },
  { value: "other", label: "Other" },
];

export default function ReportPage() {
  const [districtId, setDistrictId] = useState("");
  const [category, setCategory] = useState("sms_scam");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("http://localhost:8000/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          district_id: parseInt(districtId),
          category,
          description,
          screenshot_url: null,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setStatus("success");
      setDescription("");
      setDistrictId("");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "2rem auto", padding: "1rem" }}>
      <h1>Report a Scam</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>District ID (1-64)</label>
          <input
            type="number"
            min="1"
            max="64"
            value={districtId}
            onChange={(e) => setDistrictId(e.target.value)}
            required
            style={{ display: "block", width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ display: "block", width: "100%", padding: "0.5rem" }}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            style={{ display: "block", width: "100%", padding: "0.5rem" }}
          />
        </div>

        <button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Submitting..." : "Submit Report"}
        </button>

        {status === "success" && <p style={{ color: "green" }}>Report submitted successfully!</p>}
        {status === "error" && <p style={{ color: "red" }}>Something went wrong. Try again.</p>}
      </form>
    </div>
  );
}