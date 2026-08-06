"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../src/context/AuthContext";
import PageContainer from "../../src/components/common/PageContainer";
import BackHome from "../../src/components/common/BackHome";
import PageHero from "../../src/components/common/PageHero";
import GlassCard from "../../src/components/ui/Card";
import Button from "../../src/components/ui/Button";
import SectionTitle from "../../src/components/common/SectionTitle";

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
    form.append("screenshot_url", "");
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

  // ─── Emergency Contacts ──────────────────────────────
  const emergencyContacts = [
    { label: "জাতীয় জরুরি সেবা", number: "999", icon: "🚨" },
    { label: "জাতীয় তথ্য সেবা", number: "333", icon: "📞" },
    { label: "স্বাস্থ্য বাতায়ন", number: "16263", icon: "🏥" },
    { label: "শিশু সহায়তা", number: "1098", icon: "👶" },
    { label: "নারী ও শিশু নির্যাতন", number: "109", icon: "👩" },
    { label: "দুদক হটলাইন", number: "106", icon: "⚖️" },
  ];

  return (
    <PageContainer>
      <BackHome />

      <PageHero
        badge="🤝 Help Protect the Community"
        icon="🛡️"
        title="Report Incident"
        subtitle="Report suspicious cyber incidents and strengthen Bangladesh's collective cyber defense"
      />

      {/* ─── How It Works ─── */}
      <SectionTitle title="📋 How Reporting Works" align="left" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1.5rem",
          marginBottom: "2.5rem",
        }}
      >
        {[
          { step: 1, title: "Fill Report", desc: "Provide details about the incident", icon: "📝" },
          { step: 2, title: "Admin Reviews", desc: "Our team verifies the information", icon: "🔍" },
          { step: 3, title: "Appears on Feed", desc: "Approved reports go to Threat Feed", icon: "📡" },
          { step: 4, title: "Improves AI", desc: "Helps train our detection models", icon: "🤖" },
        ].map((item) => (
          <div
            key={item.step}
            style={{
              background: "var(--card-bg)",
              padding: "1.5rem 1rem",
              borderRadius: "1rem",
              border: "1px solid var(--card-border)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{item.icon}</div>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                color: "var(--accent)",
                marginBottom: "0.3rem",
              }}
            >
              {item.step}
            </div>
            <h4
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "var(--text-dark)",
                marginBottom: "0.2rem",
              }}
            >
              {item.title}
            </h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* ─── Form ─── */}
      <SectionTitle title="📝 Incident Report Form" align="left" />

      {success && (
        <div
          style={{
            padding: "1rem 1.5rem",
            background: "#e8f5e9",
            borderRadius: "0.75rem",
            color: "#1b5e20",
            marginBottom: "1.5rem",
            border: "1px solid #4caf50",
          }}
        >
          ✅ Report submitted successfully! Our team will review it shortly.
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "1rem 1.5rem",
            background: "#fee2e2",
            borderRadius: "0.75rem",
            color: "#b71c1c",
            marginBottom: "1.5rem",
            border: "1px solid #f44336",
          }}
        >
          ❌ {error}
        </div>
      )}

      <GlassCard>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* District */}
            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: 600,
                  color: "var(--text-dark)",
                  marginBottom: "0.4rem",
                  fontSize: "0.95rem",
                }}
              >
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
                {Array.isArray(districts) &&
                  districts.map((d) => (
                    <option key={d.district_id} value={d.district_id}>
                      {d.name_en} ({d.name_bn})
                    </option>
                  ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: 600,
                  color: "var(--text-dark)",
                  marginBottom: "0.4rem",
                  fontSize: "0.95rem",
                }}
              >
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

            {/* Description */}
            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: 600,
                  color: "var(--text-dark)",
                  marginBottom: "0.4rem",
                  fontSize: "0.95rem",
                }}
              >
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

            {/* Attachment */}
            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: 600,
                  color: "var(--text-dark)",
                  marginBottom: "0.4rem",
                  fontSize: "0.95rem",
                }}
              >
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

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              🚨 Submit Report
            </Button>
          </div>
        </form>
      </GlassCard>

      {/* ─── Privacy Notice ─── */}
      <div
        style={{
          marginTop: "1.5rem",
          padding: "1rem 1.5rem",
          background: "var(--bg-secondary)",
          borderRadius: "0.75rem",
          border: "1px solid var(--border-color)",
          fontSize: "0.85rem",
          color: "var(--text-secondary)",
          textAlign: "center",
        }}
      >
        🔒 Your report is private and will be reviewed by our team before publication.
        Personal information is never shared publicly.
      </div>

      {/* ─── Emergency Contacts ─── */}
      <SectionTitle
        title="🆘 Need Immediate Help?"
        subtitle="If you're in immediate danger, call these emergency services"
        align="center"
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "0.8rem",
          marginTop: "1.5rem",
        }}
      >
        {emergencyContacts.map((contact) => (
          <a
            key={contact.number}
            href={`tel:${contact.number}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              padding: "0.8rem 1rem",
              background: "var(--card-bg)",
              borderRadius: "0.75rem",
              border: "1px solid var(--border-color)",
              textDecoration: "none",
              color: "var(--text-dark)",
              transition: "all 0.2s",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "var(--card-shadow)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>{contact.icon}</span>
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{contact.number}</div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-secondary)" }}>{contact.label}</div>
            </div>
          </a>
        ))}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </PageContainer>
  );
}