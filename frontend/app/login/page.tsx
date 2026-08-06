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

export default function LoginPage() {
  const { login, logout } = useAuth();
  const router = useRouter();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [activeTab, setActiveTab] = useState<"user" | "admin">("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const token = recaptchaRef.current?.getValue();
    if (!token) {
      setError("Please complete the reCAPTCHA verification.");
      return;
    }

    setLoading(true);
    const result = await login(email, password, token);
    setLoading(false);

    if (result.ok && result.user) {
      // ✅ Check role matches selected tab
      const userRole = result.user.role;
      if (activeTab === "admin" && userRole !== "admin") {
        setError("You are not authorized to log in as admin.");
        await logout(); // clear invalid session
        recaptchaRef.current?.reset();
        return;
      }
      if (activeTab === "user" && userRole === "admin") {
        setError("Admin accounts cannot log in as regular user. Please use the Admin tab.");
        await logout();
        recaptchaRef.current?.reset();
        return;
      }
      // Success – redirect to home
      router.push("/");
    } else {
      setError(result.error || "Login failed");
      recaptchaRef.current?.reset();
    }
  };

  return (
    <PageContainer>
      <BackHome />

      <PageHero
        badge="🔐 Secure Access"
        icon=""
        title="Welcome Back"
        subtitle="Log in to CyberShurokkha 360"
      />

      <div style={{ maxWidth: "440px", margin: "0 auto" }}>
        <GlassCard>
          {/* ─── Role Tabs ─── */}
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              marginBottom: "1.5rem",
              background: "var(--bg-secondary)",
              padding: "0.3rem",
              borderRadius: "0.75rem",
              border: "1px solid var(--border-color)",
            }}
          >
            <button
              onClick={() => setActiveTab("user")}
              style={{
                flex: 1,
                padding: "0.6rem 1rem",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontWeight: 600,
                background: activeTab === "user" ? "var(--accent)" : "transparent",
                color: activeTab === "user" ? "white" : "var(--text-secondary)",
                transition: "all 0.3s",
              }}
            >
              👤 User
            </button>
            <button
              onClick={() => setActiveTab("admin")}
              style={{
                flex: 1,
                padding: "0.6rem 1rem",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontWeight: 600,
                background: activeTab === "admin" ? "var(--accent)" : "transparent",
                color: activeTab === "admin" ? "white" : "var(--text-secondary)",
                transition: "all 0.3s",
              }}
            >
              🛠️ Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
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
                  placeholder="Enter your password"
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

              {/* Forgot password link */}
              <div style={{ textAlign: "right", marginTop: "0.5rem" }}>
                <a
                  href="/forgot-password"
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                  }}
                >
                  Forgot password?
                </a>
              </div>
            </div>

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
              {loading ? "Logging in..." : `Log in as ${activeTab === "admin" ? "Admin" : "User"}`}
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
            Don't have an account?{" "}
            <a href="/signup" style={{ color: "var(--accent)", fontWeight: 600 }}>
              Sign up
            </a>
          </p>
        </GlassCard>
      </div>
    </PageContainer>
  );
}