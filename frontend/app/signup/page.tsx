"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../src/context/AuthContext";
import PageContainer from "../../src/components/common/PageContainer";
import BackHome from "../../src/components/common/BackHome";
import PageHero from "../../src/components/common/PageHero";
import GlassCard from "../../src/components/ui/Card";
import Button from "../../src/components/ui/Button";
import Input from "../../src/components/ui/Input";
import ReCAPTCHA from "react-google-recaptcha";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // ✅ Get reCAPTCHA token
    const token = recaptchaRef.current?.getValue();
    if (!token) {
      setError("Please complete the reCAPTCHA verification.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      recaptchaRef.current?.reset();
      return;
    }

    setLoading(true);
    const result = await signup(fullName, email, password, token);
    setLoading(false);

    if (result.ok) {
      // ✅ Redirect to email verification page
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } else {
      setError(result.error || "Signup failed");
      recaptchaRef.current?.reset();
    }
  };

  return (
    <PageContainer>
      <BackHome />

      <PageHero
        badge="🛡️ Join the Community"
        icon=""
        title="Create Account"
        subtitle="Join CyberShurokkha 360 and help protect Bangladesh"
      />

      <div style={{ maxWidth: "440px", margin: "0 auto" }}>
        <GlassCard>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <Input
              type="text"
              label="Full Name"
              placeholder="e.g., Md. Rahman"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              icon="👤"
            />

            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon="✉️"
            />

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
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-secondary)",
                  marginTop: "0.3rem",
                }}
              >
                At least 8 characters with uppercase, lowercase, number, and special character
              </p>
            </div>

            {/* ✅ reCAPTCHA */}
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
              onChange={() => {
                if (error === "Please complete the reCAPTCHA verification.") {
                  setError("");
                }
              }}
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
              {loading ? "Creating account..." : "Sign Up"}
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
            Already have an account?{" "}
            <a href="/login" style={{ color: "var(--accent)", fontWeight: 600 }}>
              Log in
            </a>
          </p>
        </GlassCard>
      </div>
    </PageContainer>
  );
}