"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../src/context/AuthContext";
import PageContainer from "../../src/components/common/PageContainer";
import BackHome from "../../src/components/common/BackHome";
import PageHero from "../../src/components/common/PageHero";
import GlassCard from "../../src/components/ui/Card";
import Button from "../../src/components/ui/Button";
import Input from "../../src/components/ui/Input";
import ReCAPTCHA from "react-google-recaptcha";

interface District {
  district_id: number;
  name_en: string;
  name_bn: string;
}

const OCCUPATIONS = [
  "Student",
  "Government Employee",
  "Private Sector Employee",
  "Business Owner / Entrepreneur",
  "Freelancer",
  "Teacher / Educator",
  "Healthcare Worker",
  "Engineer / IT Professional",
  "Homemaker",
  "Retired",
  "Unemployed",
  "Other",
];

const TERMS_TEXT = `
1. Acceptance of Terms
By creating an account on CyberShurokkha 360, you agree to these Terms of Service.

2. Purpose of the Platform
CyberShurokkha 360 is a community-driven scam detection and cybersecurity awareness platform for Bangladesh. It is provided for informational and educational purposes only.

3. No Guarantee of Accuracy
Risk scores, scam detection results, and threat map data are generated using automated models and community reports. They are best-effort estimates, not guarantees. Always use independent judgment before acting on any result.

4. User Responsibilities
You agree to provide accurate information, not submit false or malicious reports, and not misuse the platform to harass or defame others.

5. Community Reports
Reports you submit may be reviewed by moderators before appearing publicly. We reserve the right to reject or remove reports that violate these terms.

6. Account Security
You are responsible for keeping your password confidential. Notify us immediately if you suspect unauthorized access to your account.

7. Changes to These Terms
We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the updated terms.
`;

const PRIVACY_TEXT = `
1. Information We Collect
We collect the information you provide during signup (name, email, phone number, district, occupation) and the content you submit (scam checks, reports, quiz results).

2. How We Use Your Information
Your information is used to operate your account, personalize your experience, generate aggregate/anonymous platform statistics, and improve scam detection accuracy.

3. What We Don't Do
We do not sell your personal data to third parties. We do not publicly display your phone number, email, or full name on the public threat map or reports list.

4. Data Storage
Your data is stored securely in our database. Passwords are hashed and never stored in plain text.

5. Your Rights
You may request deletion of your account and associated personal data at any time by contacting support.

6. Cookies
We use a secure session cookie to keep you logged in. We do not use third-party tracking or advertising cookies.

7. Changes to This Policy
We may update this policy from time to time. Material changes will be communicated where possible.
`;

// ===== VALIDATION — mirrors backend schemas.py rules exactly =====

function validateFullName(v: string): string {
  const trimmed = v.trim();
  if (!trimmed) return "Full name is required.";
  if (trimmed.length < 2) return "Full name must be at least 2 characters.";
  if (trimmed.length > 120) return "Full name is too long.";
  if (!/^[a-zA-Z\u0980-\u09FF .'-]+$/.test(trimmed))
    return "Full name contains invalid characters.";
  return "";
}

function validateEmail(v: string): string {
  const trimmed = v.trim();
  if (!trimmed) return "Email is required.";
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmed))
    return "Enter a valid email address.";
  return "";
}

function validatePhoneNumber(v: string): string {
  const cleaned = v.trim().replace(/[\s-]/g, "");

  if (!cleaned) {
    return "Phone number is required.";
  }

  const bdPhoneRegex = /^(?:\+8801|8801|01)[3-9]\d{8}$/;

  if (!bdPhoneRegex.test(cleaned)) {
    return "Enter a valid Bangladeshi phone number.";
  }

  return "";
}

function validatePassword(v: string): string {
  if (!v) return "Password is required.";
  if (v.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(v)) return "Add at least one uppercase letter.";
  if (!/[a-z]/.test(v)) return "Add at least one lowercase letter.";
  if (!/\d/.test(v)) return "Add at least one number.";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(v))
    return "Add at least one special character (!@#$%...).";
  return "";
}

function validateDistrict(v: string): string {
  if (!v) return "Please select your district.";
  return "";
}

function validateOccupation(v: string): string {
  if (!v) return "Please select your occupation.";
  return "";
}

function LegalModal({
  title,
  text,
  onClose,
}: {
  title: string;
  text: string;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1.5rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--bg-primary)",
          borderRadius: "1rem",
          maxWidth: "560px",
          width: "100%",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          border: "1px solid var(--border-color)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "1.2rem 1.5rem",
            borderBottom: "1px solid var(--border-color)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ margin: 0, color: "var(--text-dark)" }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.4rem",
              cursor: "pointer",
              color: "var(--text-secondary)",
            }}
          >
            ✕
          </button>
        </div>
        <div
          style={{
            padding: "1.5rem",
            overflowY: "auto",
            whiteSpace: "pre-line",
            fontSize: "0.9rem",
            lineHeight: 1.6,
            color: "var(--text-secondary)",
          }}
        >
          {text}
        </div>
        <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid var(--border-color)" }}>
          <Button variant="primary" fullWidth onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

function FieldError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p style={{ color: "#dc3545", fontSize: "0.78rem", marginTop: "0.3rem" }}>
      ⚠ {message}
    </p>
  );
}

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [occupation, setOccupation] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [districts, setDistricts] = useState<District[]>([]);
  const [activeModal, setActiveModal] = useState<"terms" | "privacy" | null>(null);

  // Per-field errors — only shown after a field has been touched (blurred) at least once
  const [fieldErrors, setFieldErrors] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    districtId: "",
    occupation: "",
  });
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    phoneNumber: false,
    password: false,
    districtId: false,
    occupation: false,
  });

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetch(`${API_BASE}/districts`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDistricts(data);
      })
      .catch((err) => console.error("Failed to load districts:", err));
  }, []);

  const markTouched = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Re-validate a field live as its value changes, but only display the
  // result once the user has left the field at least once (touched)
  useEffect(() => {
    setFieldErrors((prev) => ({ ...prev, fullName: validateFullName(fullName) }));
  }, [fullName]);
  useEffect(() => {
    setFieldErrors((prev) => ({ ...prev, email: validateEmail(email) }));
  }, [email]);
  useEffect(() => {
    setFieldErrors((prev) => ({ ...prev, phoneNumber: validatePhoneNumber(phoneNumber) }));
  }, [phoneNumber]);
  useEffect(() => {
    setFieldErrors((prev) => ({ ...prev, password: validatePassword(password) }));
  }, [password]);
  useEffect(() => {
    setFieldErrors((prev) => ({ ...prev, districtId: validateDistrict(districtId) }));
  }, [districtId]);
  useEffect(() => {
    setFieldErrors((prev) => ({ ...prev, occupation: validateOccupation(occupation) }));
  }, [occupation]);

  const isFormValid =
    !validateFullName(fullName) &&
    !validateEmail(email) &&
    !validatePhoneNumber(phoneNumber) &&
    !validatePassword(password) &&
    !validateDistrict(districtId) &&
    !validateOccupation(occupation) &&
    termsAccepted;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Mark every field touched so all inline errors show if something's wrong
    setTouched({
      fullName: true,
      email: true,
      phoneNumber: true,
      password: true,
      districtId: true,
      occupation: true,
    });

    if (!isFormValid) {
      setError("Please fix the highlighted fields before continuing.");
      return;
    }

    const token = recaptchaRef.current?.getValue();
    if (!token) {
      setError("Please complete the reCAPTCHA verification.");
      return;
    }

    setLoading(true);
    const result = await signup(
      fullName,
      email,
      password,
      token,
      phoneNumber,
      parseInt(districtId),
      occupation,
      termsAccepted
    );
    setLoading(false);

    if (result.ok) {
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } else {
      setError(result.error || "Signup failed");
      recaptchaRef.current?.reset();
    }
  };

  const inputBoxStyle = (hasError: boolean) => ({
    width: "100%",
    padding: "0.8rem 1rem",
    border: `2px solid ${hasError ? "#dc3545" : "var(--border-color)"}`,
    borderRadius: "0.75rem",
    background: "var(--bg-secondary)",
    color: "var(--text-primary)",
    fontSize: "0.95rem",
    outline: "none",
  });

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
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }} noValidate>
            <div>
              <Input
                type="text"
                label="Full Name"
                placeholder="e.g., Md. Rahman"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onBlur={() => markTouched("fullName")}
                required
                icon="👤"
              />
              {touched.fullName && <FieldError message={fieldErrors.fullName} />}
            </div>

            <div>
              <Input
                type="email"
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => markTouched("email")}
                required
                icon="✉️"
              />
              {touched.email && <FieldError message={fieldErrors.email} />}
            </div>

            <div>
              <Input
                type="tel"
                label="Phone Number"
                placeholder="e.g., 01712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                onBlur={() => markTouched("phoneNumber")}
                required
                icon="📱"
              />
              {touched.phoneNumber && <FieldError message={fieldErrors.phoneNumber} />}
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 600, color: "var(--text-dark)", marginBottom: "0.4rem", fontSize: "0.9rem" }}>
                District
              </label>
              <select
                value={districtId}
                onChange={(e) => setDistrictId(e.target.value)}
                onBlur={() => markTouched("districtId")}
                required
                style={inputBoxStyle(touched.districtId && !!fieldErrors.districtId)}
              >
                <option value="">Select your district</option>
                {districts.map((d) => (
                  <option key={d.district_id} value={d.district_id}>
                    {d.name_en} ({d.name_bn})
                  </option>
                ))}
              </select>
              {touched.districtId && <FieldError message={fieldErrors.districtId} />}
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 600, color: "var(--text-dark)", marginBottom: "0.4rem", fontSize: "0.9rem" }}>
                Occupation
              </label>
              <select
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                onBlur={() => markTouched("occupation")}
                required
                style={inputBoxStyle(touched.occupation && !!fieldErrors.occupation)}
              >
                <option value="">Select your occupation</option>
                {OCCUPATIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              {touched.occupation && <FieldError message={fieldErrors.occupation} />}
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 600, color: "var(--text-dark)", marginBottom: "0.4rem", fontSize: "0.9rem" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => markTouched("password")}
                  required
                  minLength={8}
                  style={{ ...inputBoxStyle(touched.password && !!fieldErrors.password), padding: "0.8rem 3rem 0.8rem 1rem" }}
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
                  }}
                  tabIndex={-1}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {touched.password ? (
                <FieldError message={fieldErrors.password} />
              ) : (
                <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.3rem" }}>
                  At least 8 characters with uppercase, lowercase, number, and special character
                </p>
              )}
            </div>

            <label style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", fontSize: "0.85rem", color: "var(--text-secondary)", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                style={{ marginTop: "0.2rem" }}
              />
              <span>
                I agree to the{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveModal("terms");
                  }}
                  style={{ color: "var(--accent)", fontWeight: 600 }}
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveModal("privacy");
                  }}
                  style={{ color: "var(--accent)", fontWeight: 600 }}
                >
                  Privacy Policy
                </a>
              </span>
            </label>

            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
              onChange={() => {
                if (error === "Please complete the reCAPTCHA verification.") setError("");
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

          <p style={{ textAlign: "center", marginTop: "1.2rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Already have an account?{" "}
            <a href="/login" style={{ color: "var(--accent)", fontWeight: 600 }}>
              Log in
            </a>
          </p>
        </GlassCard>
      </div>

      {activeModal === "terms" && (
        <LegalModal title="Terms of Service" text={TERMS_TEXT} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "privacy" && (
        <LegalModal title="Privacy Policy" text={PRIVACY_TEXT} onClose={() => setActiveModal(null)} />
      )}
    </PageContainer>
  );
}