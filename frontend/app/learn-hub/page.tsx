"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageContainer from "../../src/components/common/PageContainer";
import BackHome from "../../src/components/common/BackHome";
import PageHero from "../../src/components/common/PageHero";
import GlassCard from "../../src/components/ui/Card";
import Spinner from "../../src/components/ui/Spinner";

interface Tier {
  id: number;
  name_en: string;
  name_bn: string;
  order_index: number;
  lessons_completed: number;
  lessons_total: number;
}

export default function LearnHubIndexPage() {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [lang, setLang] = useState<"bn" | "en">("en");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetch(`${API_BASE}/learn/tiers`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return res.json();
      })
      .then((data) => setTiers(data))
      .catch(() => setError("Could not reach the backend. Is uvicorn running?"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageContainer>
      <BackHome />

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          maxWidth: "700px",
          margin: "0 auto 1rem",
        }}
      >
        <div className="lang-toggle">
          <button
            className={`lang-btn ${lang === "bn" ? "active" : ""}`}
            onClick={() => setLang("bn")}
          >
            বাংলা
          </button>
          <button
            className={`lang-btn ${lang === "en" ? "active" : ""}`}
            onClick={() => setLang("en")}
          >
            English
          </button>
        </div>
      </div>

      <PageHero
        badge="🎓 Learning Hub"
        icon=""
        title={lang === "bn" ? "শূন্য থেকে উন্নত পর্যায় পর্যন্ত" : "Zero to Advanced"}
        subtitle={
          lang === "bn"
            ? "ধাপে ধাপে সাইবার নিরাপত্তা শিখুন — বেসিক থেকে টেকনিক্যাল পর্যন্ত।"
            : "Learn cybersecurity step by step — from the basics to technical depth."
        }
      />

      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <Spinner size={40} />
        </div>
      ) : error ? (
        <p style={{ color: "#e74c3c", textAlign: "center" }}>{error}</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", maxWidth: "700px", margin: "0 auto" }}>
          {tiers.map((tier) => {
            const progressPct =
              tier.lessons_total > 0
                ? Math.round((tier.lessons_completed / tier.lessons_total) * 100)
                : 0;
            const displayName = lang === "bn" ? tier.name_bn : tier.name_en;

            return (
              <Link key={tier.id} href={`/learn-hub/${tier.id}?lang=${lang}`} style={{ textDecoration: "none" }}>
                <GlassCard
                  hoverable
                  style={{
                    padding: "1.5rem 1.8rem",
                    borderLeft: `4px solid ${progressPct === 100 ? "#4caf50" : "var(--accent)"}`,
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-dark)" }}>
                      {displayName}
                    </span>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                      {progressPct === 100 ? "✅" : `${progressPct}%`}
                    </span>
                  </div>

                  <div className="progress-track" style={{ height: "6px" }}>
                    <div
                      className="progress-fill"
                      style={{
                        width: `${progressPct}%`,
                        background: progressPct === 100 ? "#4caf50" : "var(--accent)",
                      }}
                    />
                  </div>
                  <span className="progress-label" style={{ fontSize: "0.85rem", marginTop: "0.3rem" }}>
                    {tier.lessons_completed}/{tier.lessons_total}{" "}
                    {lang === "bn" ? "সম্পন্ন" : "completed"}
                  </span>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}