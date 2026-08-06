"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageContainer from "../../src/components/common/PageContainer";
import BackHome from "../../src/components/common/BackHome";
import PageHero from "../../src/components/common/PageHero";
import GlassCard from "../../src/components/ui/Card";
import Button from "../../src/components/ui/Button";
import Input from "../../src/components/ui/Input";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [validToken, setValidToken] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token) {
      setValidToken(false);
    } else {
      // Token is present; we'll validate it on submit.
      setValidToken(true);
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token, new_password: newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(data.detail || "Invalid or expired token. Please request a new reset link.");
      }
    } catch {
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (validToken === false) {
    return (
      <PageContainer>
        <BackHome />
        <div style={{ maxWidth: "440px", margin: "0 auto" }}>
          <GlassCard>
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
              <span style={{ fontSize: "3rem" }}>⚠️</span>
              <h3 style={{ color: "var(--text-dark)" }}>Invalid Reset Link</h3>
              <p style={{ color: "var(--text-secondary)" }}>
                The reset link is missing or invalid. Please request a new one.
              </p>
              <Button variant="primary" onClick={() => router.push("/forgot-password")}>
                Request New Link
              </Button>
            </div>
          </GlassCard>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <BackHome />

      <PageHero
        badge="🔐 Reset Password"
        icon=""
        title="Create New Password"
        subtitle="Enter your new password below."
      />

      <div style={{ maxWidth: "440px", margin: "0 auto" }}>
        <GlassCard>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: 600,
                  color: "var(--text-dark)",
                  marginBottom: "0.4rem",
                  fontSize: "0.9rem",
                }}
              >
                New Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  style={{
                    width: "100%",
                    padding: "0.8rem 3rem 0.8rem 1rem",
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
                  placeholder="Minimum 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-secondary)",
                    fontSize: "1.2rem",
                    padding: "0.25rem",
                  }}
                  tabIndex={-1}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <Input
              type="password"
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              icon="🔒"
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
                ✅ Password reset successfully! Redirecting to login...
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

            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} disabled={loading || success}>
              {loading ? "Resetting..." : success ? "Done!" : "Reset Password"}
            </Button>
          </form>
        </GlassCard>
      </div>
    </PageContainer>
  );
}