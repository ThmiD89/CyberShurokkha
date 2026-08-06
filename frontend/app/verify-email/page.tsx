"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../src/context/AuthContext";
import PageContainer from "../../src/components/common/PageContainer";
import BackHome from "../../src/components/common/BackHome";
import PageHero from "../../src/components/common/PageHero";
import GlassCard from "../../src/components/ui/Card";
import Button from "../../src/components/ui/Button";
import Input from "../../src/components/ui/Input";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const { fetchMe } = useAuth();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Guards against React 18 Strict Mode double-invoking this effect in dev,
  // which was causing two separate OTP emails to be sent on page load.
  const otpSentRef = useRef(false);

  // Auto-send OTP when page loads — but only once
  useEffect(() => {
    if (email && !otpSentRef.current) {
      otpSentRef.current = true;
      handleResendOTP();
    }
  }, [email]);

  const handleResendOTP = async () => {
    if (!email) {
      setError("Email address is missing. Please go back and try again.");
      return;
    }

    setResendLoading(true);
    setResendSuccess(false);
    setError("");

    try {
      const res = await fetch("http://localhost:8000/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 5000);
      } else {
        setError(data.detail || "Failed to send OTP. Please try again.");
      }
    } catch {
      setError("Failed to connect to the server.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email address is missing.");
      return;
    }
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8000/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (res.ok && data.verified) {
        await fetchMe();
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <PageContainer>
        <BackHome />
        <GlassCard>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <span style={{ fontSize: "3rem" }}>⚠️</span>
            <h3 style={{ color: "var(--text-dark)" }}>Missing Email</h3>
            <p style={{ color: "var(--text-secondary)" }}>
              No email address provided. Please go back and try again.
            </p>
            <Button variant="primary" onClick={() => router.push("/signup")}>
              Back to Signup
            </Button>
          </div>
        </GlassCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <BackHome />

      <PageHero
        badge="📧 Verify Your Email"
        icon=""
        title="Check Your Inbox"
        subtitle={`We've sent a 6-digit verification code to ${email}`}
      />

      <div style={{ maxWidth: "440px", margin: "0 auto" }}>
        <GlassCard>
          {success ? (
            <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
              <span style={{ fontSize: "4rem" }}>✅</span>
              <h3 style={{ color: "#1b5e20", marginTop: "0.5rem" }}>Email Verified!</h3>
              <p style={{ color: "var(--text-secondary)" }}>
                Your email has been verified. Redirecting to dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div style={{ textAlign: "center", padding: "0.5rem" }}>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                  Enter the 6-digit code sent to your email.
                </p>
              </div>

              <Input
                type="text"
                label="Verification Code"
                placeholder="e.g., 123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                icon="🔑"
                maxLength={6}
              />

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
                {loading ? "Verifying..." : "Verify Email"}
              </Button>

              <div style={{ textAlign: "center" }}>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendLoading}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--accent)",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    opacity: resendLoading ? 0.6 : 1,
                  }}
                >
                  {resendLoading ? "Sending..." : resendSuccess ? "✅ Resent!" : "Resend Code"}
                </button>
              </div>
            </form>
          )}
        </GlassCard>
      </div>
    </PageContainer>
  );
}