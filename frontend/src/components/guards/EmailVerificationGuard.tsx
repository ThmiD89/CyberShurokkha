"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function EmailVerificationGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Allowed pages (no verification required)
    const allowedPages = [
      "/verify-email",
      "/login",
      "/signup",
      "/forgot-password",
      "/reset-password",
      "/",
    ];

    if (loading) return;

    if (user && !user.email_verified && !allowedPages.includes(pathname)) {
      router.push(`/verify-email?email=${encodeURIComponent(user.email)}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "40px", height: "40px", border: "4px solid var(--border-color)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }} />
          <p style={{ marginTop: "1rem", color: "var(--text-secondary)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  // If user is verified or on allowed page, render children
  if (!user || user.email_verified || ["/verify-email", "/login", "/signup", "/forgot-password", "/reset-password", "/"].includes(pathname)) {
    return <>{children}</>;
  }

  // Redirecting, render nothing
  return null;
}