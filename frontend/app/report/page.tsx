"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../src/context/AuthContext";

interface District {
  district_id: number;
  name_en: string;
  name_bn: string;
}

export default function ReportPage() {
  const { user } = useAuth();
  const [districts, setDistricts] = useState<District[]>([]);
  const [formData, setFormData] = useState({
    district_id: "",
    category: "",
    description: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("http://localhost:8000/districts")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDistricts(data);
        } else {
          console.error("Districts API returned non-array:", data);
          setDistricts([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch districts:", err);
        setDistricts([]);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const form = new FormData();
    form.append("district_id", formData.district_id);
    form.append("category", formData.category);
    form.append("description", formData.description);
    form.append("screenshot_url", ""); // ✅ Always send
    if (file) form.append("attachment", file);

    try {
      const res = await fetch("http://localhost:8000/reports", {
        method: "POST",
        body: form,
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.detail) {
          if (Array.isArray(data.detail)) {
            const errorMessages = data.detail.map((err: any) => {
              const field = err.loc ? err.loc[err.loc.length - 1] : "field";
              return `${field}: ${err.msg || "Invalid value"}`;
            });
            throw new Error(errorMessages.join(" • "));
          } else if (typeof data.detail === "string") {
            throw new Error(data.detail);
          } else {
            throw new Error(JSON.stringify(data.detail));
          }
        } else {
          throw new Error("Submission failed");
        }
      }

      setSuccess(true);
      setFormData({ district_id: "", category: "", description: "" });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      setError(err.message || "Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "4rem 1.5rem", minHeight: "70vh" }}>
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <div style={{ display: "inline-block", padding: "0.3rem 1.2rem", borderRadius: "2rem", background: "var(--accent)", color: "white", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.5px", marginBottom: "1rem" }}>
          🚨 Help the Community
        </div>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--text-dark)", marginBottom: "0.5rem" }}>
          Report Incident
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", maxWidth: "550px", margin: "0 auto" }}>
          Help protect your community by reporting scams you've encountered
        </p>
      </div>

      {success && (
        <div style={{ padding: "1rem 1.5rem", background: "#e8f5e9", borderRadius: "0.75rem", color: "#1b5e20", marginBottom: "1.5rem", border: "1px solid #4caf50", display: "flex", alignItems: "center", gap: "0.8rem" }}>
          <span style={{ fontSize: "1.5rem" }}>✅</span>
          <div>
            <strong>Report submitted successfully!</strong>
            <p style={{ margin: 0, fontSize: "0.9rem", color: "#2e7d32" }}>Our team will review it shortly.</p>
          </div>
        </div>
      )}

      {error && (
        <div style={{ padding: "1rem 1.5rem", background: "#fee2e2", borderRadius: "0.75rem", color: "#b71c1c", marginBottom: "1.5rem", border: "1px solid #f44336", display: "flex", alignItems: "center", gap: "0.8rem" }}>
          <span style={{ fontSize: "1.5rem" }}>❌</span>
          <div>
            <strong>Submission failed</strong>
            <p style={{ margin: 0, fontSize: "0.9rem", color: "#b71c1c" }}>{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: "var(--card-bg)", padding: "2rem", borderRadius: "1.2rem", border: "1px solid var(--card-border)", boxShadow: "var(--card-shadow)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", fontWeight: 600, color: "var(--text-dark)", marginBottom: "0.4rem", fontSize: "0.95rem" }}>
              District <span style={{ color: "var(--text-secondary)", fontWeight: 400 }}>(required)</span>
            </label>
            <select
              value={formData.district_id}
              onChange={(e) => setFormData({ ...formData, district_id: e.target.value })}
              required
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                border: "2px solid var(--border-color)",
                borderRadius: "0.75rem",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                fontSize: "0.95rem",
                transition: "border-color 0.3s",
                outline: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
            >
              <option value="">Select your district</option>
              {Array.isArray(districts) && districts.map((d) => (
                <option key={d.district_id} value={d.district_id}>
                  {d.name_en} ({d.name_bn})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontWeight: 600, color: "var(--text-dark)", marginBottom: "0.4rem", fontSize: "0.95rem" }}>
              Category <span style={{ color: "var(--text-secondary)", fontWeight: 400 }}>(required)</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                border: "2px solid var(--border-color)",
                borderRadius: "0.75rem",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                fontSize: "0.95rem",
                transition: "border-color 0.3s",
                outline: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
            >
              <option value="">Select category</option>
              <option value="sms_scam">📱 SMS Scam</option>
              <option value="scam_call">📞 Scam Call</option>
              <option value="phishing_url">🔗 Phishing URL</option>
              <option value="fake_job">💼 Fake Job</option>
              <option value="social_media_scam">📲 Social Media Scam</option>
              <option value="investment_fraud">💰 Investment Fraud</option>
              <option value="other">📌 Other</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontWeight: 600, color: "var(--text-dark)", marginBottom: "0.4rem", fontSize: "0.95rem" }}>
              Description <span style={{ color: "var(--text-secondary)", fontWeight: 400 }}>(required)</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what happened in detail..."
              required
              rows={5}
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                border: "2px solid var(--border-color)",
                borderRadius: "0.75rem",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                fontSize: "0.95rem",
                resize: "vertical",
                fontFamily: "inherit",
                transition: "border-color 0.3s",
                outline: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
            />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: 600, color: "var(--text-dark)", marginBottom: "0.4rem", fontSize: "0.95rem" }}>
              Attachment <span style={{ color: "var(--text-secondary)", fontWeight: 400 }}>(optional)</span>
            </label>
            <div
              style={{
                border: "2px dashed var(--border-color)",
                borderRadius: "0.75rem",
                padding: "1.5rem",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.3s",
                background: "var(--bg-secondary)",
              }}
              onDragOver={(e) => {
                e.preventDefault();
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)";
              }}
              onDragLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-color)";
              }}
              onDrop={(e) => {
                e.preventDefault();
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-color)";
                const dropped = e.dataTransfer.files[0];
                if (dropped) setFile(dropped);
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt,.xls,.xlsx"
                style={{ display: "none" }}
              />
              {file ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.8rem" }}>
                  <span style={{ fontSize: "2rem" }}>📎</span>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: 500, color: "var(--text-dark)" }}>{file.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                      {(file.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "1.2rem",
                      cursor: "pointer",
                      color: "var(--text-secondary)",
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📤</div>
                  <p style={{ fontWeight: 500, color: "var(--text-dark)" }}>Drag & drop or click to upload</p>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    Supported: PDF, Word, Excel, Images, Text (Max 10MB)
                  </p>
                </>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.9rem",
              border: "none",
              borderRadius: "0.75rem",
              background: "var(--accent)",
              color: "white",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer",
              opacity: loading ? 0.6 : 1,
              transition: "all 0.3s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent)")}
          >
            {loading ? (
              <>
                <span style={{ display: "inline-block", width: "18px", height: "18px", border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                Submitting...
              </>
            ) : (
              <>
                <span>🚨</span> Submit Report
              </>
            )}
          </button>
        </div>
      </form>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}