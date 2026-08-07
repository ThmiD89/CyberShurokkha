"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "../../src/components/common/PageContainer";
import BackHome from "../../src/components/common/BackHome";
import PageHero from "../../src/components/common/PageHero";
import GlassCard from "../../src/components/ui/Card";
import Button from "../../src/components/ui/Button";
import Input from "../../src/components/ui/Input";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setEmail("");
      } else {
        setError(data.detail || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <BackHome />

      <PageHero
        badge="🔑 Reset Password"
        icon=""
        title="Forgot Password?"
        subtitle="Enter your email address and we'll send you a reset link."
      />

      <div style={{ maxWidth: "440px", margin: "0 auto" }}>
        <GlassCard>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <Input
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon="✉️"
            />

            {success && (
              <div
                style={{
                  padding: "0.75rem 1rem",
                  background: "#e8f5e9",
                  border: "1px solid #4caf50",
                  borderRadius: "0.5rem",
                  color: "#1b5e20",
                  fontSize: "0.9rem",
                }}
              >
                ✅ If an account with that email exists, a reset link has been sent. Please check your inbox.
              </div>
            )}

            {error && (
              <div
                style={{
                  padding: "0.75rem 1rem",
                  background: "rgba(244,67,54,0.1)",
                  border: "1px solid #dc3545",
                  borderRadius: "0.5rem",
                  color: "#dc3545",
                  fontSize: "0.9rem",
                }}
              >
                ❌ {error}
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: "1.2rem",
              fontSize: "0.9rem",
              color: "var(--text-secondary)",
            }}
          >
            Remember your password?{" "}
            <a href="/login" style={{ color: "var(--accent)", fontWeight: 600 }}>
              Log in
            </a>
          </p>
        </GlassCard>
      </div>
    </PageContainer>
  );
}