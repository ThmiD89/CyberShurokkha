"use client";

import { useState } from "react";
import PageContainer from "../../src/components/common/PageContainer";
import BackHome from "../../src/components/common/BackHome";
import PageHero from "../../src/components/common/PageHero";
import GlassCard from "../../src/components/ui/Card";
import Button from "../../src/components/ui/Button";
import Input from "../../src/components/ui/Input";
import Badge from "../../src/components/ui/Badge";

export default function JobCheckPage() {
  const [formData, setFormData] = useState({
    title: "",
    company_profile: "",
    description: "",
    requirements: "",
    benefits: "",
    telecommuting: 0,
    has_company_logo: 0,
    has_questions: 0,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

  const loadExample = (type: string) => {
    const examples: any = {
      real: {
        title: "Senior Software Engineer",
        company_profile: "Google is a multinational technology company specializing in Internet services.",
        description: "We are looking for a Senior Software Engineer to join our team. You will be responsible for designing and developing scalable systems. 5+ years experience required.",
        requirements: "BS in Computer Science. 5+ years software development. Strong knowledge of Python, Java, or C++.",
        benefits: "Competitive salary, health insurance, 401k matching, flexible work hours.",
        telecommuting: 1,
        has_company_logo: 1,
        has_questions: 1,
      },
      fake: {
        title: "URGENT HIRING! Work From Home - $5000/week!!!",
        company_profile: "Fast-growing company looking for motivated individuals. No experience needed!",
        description: "Make $5000 per week working from home! No experience required! Just need a computer and internet. Start immediately!",
        requirements: "No experience required! Just need to be motivated! Must have internet access.",
        benefits: "Unlimited earning potential! Work from home! Flexible hours!",
        telecommuting: 1,
        has_company_logo: 0,
        has_questions: 0,
      },
      scam: {
        title: "Account Manager Needed - $8000/month",
        company_profile: "International Financial Services. We help people invest in crypto and forex markets.",
        description: "Join our team and earn $8000/month. We need someone to manage client accounts and process payments. Training provided.",
        requirements: "No experience required. Must have bank account. Must be willing to transfer funds.",
        benefits: "High salary, commission, work from home, flexible hours.",
        telecommuting: 1,
        has_company_logo: 0,
        has_questions: 0,
      },
    };

    const example = examples[type];
    if (example) {
      setFormData(example);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      setError("Please fill in at least the title and description.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`${API_BASE}/check-job`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data);
      } else {
        setError(data.detail || "Error analyzing job posting.");
      }
    } catch (err) {
      setError("Failed to connect to the server. Make sure the backend is running.");
    }

    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      company_profile: "",
      description: "",
      requirements: "",
      benefits: "",
      telecommuting: 0,
      has_company_logo: 0,
      has_questions: 0,
    });
    setResult(null);
    setError("");
  };

  return (
    <PageContainer>
      <BackHome />

      <PageHero
        badge="🕵️ AI Fraud Detection"
        icon=""
        title="Fraud Job Detection"
        subtitle="Analyze job postings to detect potential scams and fraudulent offers"
      />

      {/* ─── Form ─── */}
      <GlassCard>
        {error && (
          <div
            style={{
              padding: "0.75rem 1rem",
              background: "rgba(244, 67, 54, 0.1)",
              border: "1px solid #dc3545",
              borderRadius: "0.75rem",
              color: "#dc3545",
              marginBottom: "1rem",
            }}
          >
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Job Title */}
          <Input
            label="Job Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Senior Software Engineer"
            required
            style={{ marginBottom: "1.2rem" }}
          />

          {/* Company Profile */}
          <div style={{ marginBottom: "1.2rem" }}>
            <label
              style={{
                display: "block",
                fontWeight: 600,
                color: "var(--text-dark)",
                marginBottom: "0.4rem",
                fontSize: "0.9rem",
              }}
            >
              Company Profile
            </label>
            <textarea
              name="company_profile"
              value={formData.company_profile}
              onChange={handleChange}
              rows={2}
              placeholder="Describe the company..."
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

          {/* Job Description */}
          <div style={{ marginBottom: "1.2rem" }}>
            <label
              style={{
                display: "block",
                fontWeight: 600,
                color: "var(--text-dark)",
                marginBottom: "0.4rem",
                fontSize: "0.9rem",
              }}
            >
              Job Description <span style={{ color: "#dc3545" }}>*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Paste the job description here..."
              required
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

          {/* Requirements */}
          <div style={{ marginBottom: "1.2rem" }}>
            <label
              style={{
                display: "block",
                fontWeight: 600,
                color: "var(--text-dark)",
                marginBottom: "0.4rem",
                fontSize: "0.9rem",
              }}
            >
              Requirements
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={2}
              placeholder="List the job requirements..."
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

          {/* Benefits */}
          <div style={{ marginBottom: "1.2rem" }}>
            <label
              style={{
                display: "block",
                fontWeight: 600,
                color: "var(--text-dark)",
                marginBottom: "0.4rem",
                fontSize: "0.9rem",
              }}
            >
              Benefits
            </label>
            <textarea
              name="benefits"
              value={formData.benefits}
              onChange={handleChange}
              rows={2}
              placeholder="Describe the benefits..."
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

          {/* Flags - Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1rem",
              marginBottom: "1.2rem",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  color: "var(--text-dark)",
                  marginBottom: "0.3rem",
                }}
              >
                Telecommuting
              </label>
              <select
                name="telecommuting"
                value={formData.telecommuting}
                onChange={handleSelectChange}
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  border: "2px solid var(--border-color)",
                  borderRadius: "0.6rem",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                }}
              >
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </select>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  color: "var(--text-dark)",
                  marginBottom: "0.3rem",
                }}
              >
                Company Logo
              </label>
              <select
                name="has_company_logo"
                value={formData.has_company_logo}
                onChange={handleSelectChange}
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  border: "2px solid var(--border-color)",
                  borderRadius: "0.6rem",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                }}
              >
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </select>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  color: "var(--text-dark)",
                  marginBottom: "0.3rem",
                }}
              >
                Has Questions
              </label>
              <select
                name="has_questions"
                value={formData.has_questions}
                onChange={handleSelectChange}
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  border: "2px solid var(--border-color)",
                  borderRadius: "0.6rem",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                }}
              >
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </select>
            </div>
          </div>

          {/* Quick Examples */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              flexWrap: "wrap",
              margin: "1rem 0 1.5rem",
            }}
          >
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              Try:
            </span>
            <button
              type="button"
              onClick={() => loadExample("real")}
              style={{
                padding: "0.3rem 0.8rem",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "2rem",
                fontSize: "0.75rem",
                cursor: "pointer",
                color: "var(--text-secondary)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--accent)";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--bg-secondary)";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              ✅ Real Job
            </button>
            <button
              type="button"
              onClick={() => loadExample("fake")}
              style={{
                padding: "0.3rem 0.8rem",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "2rem",
                fontSize: "0.75rem",
                cursor: "pointer",
                color: "var(--text-secondary)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#ff9800";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--bg-secondary)";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              ⚠️ Fake Job
            </button>
            <button
              type="button"
              onClick={() => loadExample("scam")}
              style={{
                padding: "0.3rem 0.8rem",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "2rem",
                fontSize: "0.75rem",
                cursor: "pointer",
                color: "var(--text-secondary)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#dc3545";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--bg-secondary)";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              🚨 Scam
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            disabled={loading}
            icon="🤖"
          >
            Analyze Job Posting
          </Button>
        </form>
      </GlassCard>

      {/* ─── Results ─── */}
      {result && (
        <GlassCard
          style={{
            marginTop: "2rem",
            animation: "slideUp 0.4s ease",
            border: result.is_fake ? "2px solid #dc3545" : "2px solid #4CAF50",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-dark)" }}>
              📊 Analysis Result
            </h3>
            <Badge
              variant={result.is_fake ? "danger" : "success"}
              size="lg"
            >
              {result.is_fake ? "⚠️ FAKE / SCAM" : "✅ REAL / LEGITIMATE"}
            </Badge>
          </div>

          {/* Confidence Bar */}
          <div style={{ margin: "1rem 0" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
                marginBottom: "0.25rem",
              }}
            >
              <span>Confidence</span>
              <span>{result.confidence.toFixed(1)}%</span>
            </div>
            <div
              style={{
                height: "10px",
                background: "var(--bg-secondary)",
                borderRadius: "5px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: "5px",
                  transition: "width 0.8s ease",
                  width: `${result.confidence}%`,
                  background:
                    result.confidence >= 70
                      ? "#dc3545"
                      : result.confidence >= 40
                      ? "#ff9800"
                      : "#4CAF50",
                }}
              />
            </div>
          </div>

          {/* Details Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem",
              margin: "1rem 0",
            }}
          >
            <div
              style={{
                background: "var(--bg-secondary)",
                padding: "0.75rem 1rem",
                borderRadius: "0.5rem",
              }}
            >
              <span
                style={{
                  display: "block",
                  fontSize: "0.7rem",
                  color: "var(--text-secondary)",
                }}
              >
                Job Title
              </span>
              <span
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "var(--text-dark)",
                }}
              >
                {result.title || "N/A"}
              </span>
            </div>
            <div
              style={{
                background: "var(--bg-secondary)",
                padding: "0.75rem 1rem",
                borderRadius: "0.5rem",
              }}
            >
              <span
                style={{
                  display: "block",
                  fontSize: "0.7rem",
                  color: "var(--text-secondary)",
                }}
              >
                Risk Level
              </span>
              <span
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: result.is_fake ? "#dc3545" : "#2E7D32",
                }}
              >
                {result.is_fake ? "⚠️ High Risk" : "✅ Low Risk"}
              </span>
            </div>
          </div>

          {/* Risk Factors */}
          {result.risk_factors && result.risk_factors.length > 0 && (
            <div style={{ margin: "1rem 0" }}>
              <h4
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-dark)",
                  marginBottom: "0.5rem",
                }}
              >
                🚨 Risk Factors
              </h4>
              {result.risk_factors.map((factor: string, idx: number) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.4rem 0.75rem",
                    background: "var(--bg-secondary)",
                    borderRadius: "0.5rem",
                    marginBottom: "0.3rem",
                    fontSize: "0.85rem",
                    color: "var(--text-primary)",
                  }}
                >
                  <i
                    className="fas fa-circle"
                    style={{ color: "#dc3545", fontSize: "0.5rem" }}
                  />
                  {factor}
                </div>
              ))}
            </div>
          )}

          {/* Verdict */}
          <div
            style={{
              marginTop: "1rem",
              padding: "0.75rem 1rem",
              borderRadius: "0.75rem",
              background: result.is_fake
                ? "rgba(244, 67, 54, 0.1)"
                : "rgba(76, 175, 80, 0.1)",
              border: result.is_fake ? "1px solid #dc3545" : "1px solid #4CAF50",
              color: result.is_fake ? "#dc3545" : "#2E7D32",
            }}
          >
            <i
              className={`fas ${
                result.is_fake ? "fa-exclamation-triangle" : "fa-check-circle"
              }`}
            />
            {result.is_fake
              ? " ⚠️ This job posting shows signs of being a scam or fraudulent listing. Please be cautious."
              : " ✅ This job posting appears legitimate based on our analysis."}
          </div>

          <Button
            variant="outline"
            onClick={resetForm}
            style={{ marginTop: "1rem" }}
          >
            🔄 New Analysis
          </Button>
        </GlassCard>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </PageContainer>
  );
}