"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../src/context/AuthContext";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    border: "1px solid var(--border-color)",
    background: "var(--bg-secondary)",
    color: "var(--text-primary)",
    fontSize: "1rem",
  };
  const passwordInputStyle = { ...inputStyle, padding: "0.75rem 3rem 0.75rem 1rem" };
  const labelStyle = { display: "block" as const, fontWeight: 500, marginBottom: "0.5rem", color: "var(--text-dark)" };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    const result = await signup(fullName, email, password);
    setLoading(false);
    if (result.ok) {
      router.push("/");
    } else {
      setError(result.error || "Signup failed");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "440px", margin: "0 auto" }}>
        <a href="/" style={{ color: "var(--accent)", textDecoration: "none", display: "inline-block", marginBottom: "1.5rem" }}>
          ← Back to Home
        </a>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 700, color: "var(--text-dark)" }}>🛡️ Create Account</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>Join CyberShurokkha 360</p>
        </div>

        <div className="card" style={{ background: "var(--card-bg)" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={passwordInputStyle}
                  required
                  minLength={8}
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
                    fontSize: "0.9rem",
                    padding: "0.25rem",
                  }}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.3rem" }}>At least 8 characters</p>
            </div>

            {error && (
              <div style={{ padding: "0.75rem 1rem", background: "rgba(244,67,54,0.1)", border: "1px solid #dc3545", borderRadius: "0.5rem", color: "#dc3545", fontSize: "0.9rem" }}>
                ❌ {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", justifyContent: "center", opacity: loading ? 0.6 : 1 }}>
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "1.2rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Already have an account? <a href="/login" style={{ color: "var(--accent)" }}>Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
}