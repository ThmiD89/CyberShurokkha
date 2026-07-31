"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Tier = {
  id: number;
  name_en: string;
  name_bn: string;
  order_index: number;
  unlocked: boolean;
  lessons_completed: number;
  lessons_total: number;
};

export default function LearningHubPage() {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [lang, setLang] = useState<"bn" | "en">("bn");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/learn/tiers", {
      credentials: "include", // ✅ Sends the auth cookie
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return res.json();
      })
      .then((data) => setTiers(data))
      .catch(() => setError("Could not reach the backend. Is uvicorn running?"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="hero-section">
      <div className="container" style={{ maxWidth: "700px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="hero-badge">
            <span className="badge-icon">🎓</span>
            <span>{lang === "bn" ? "শিক্ষা কেন্দ্র" : "Learning Hub"}</span>
          </div>
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

        <h1 className="hero-title" style={{ fontSize: "2.2rem", textAlign: "left" }}>
          {lang === "bn"
            ? "শূন্য থেকে উন্নত পর্যায় পর্যন্ত"
            : "Zero to Advanced"}
        </h1>
        <p
          className="hero-subtitle"
          style={{ textAlign: "left", margin: "0 0 2rem 0" }}
        >
          {lang === "bn"
            ? "ধাপে ধাপে সাইবার নিরাপত্তা শিখুন — বেসিক থেকে টেকনিক্যাল পর্যন্ত।"
            : "Learn cybersecurity step by step — from the basics to technical depth."}
        </p>

        {loading && <p>{lang === "bn" ? "লোড হচ্ছে..." : "Loading..."}</p>}
        {error && <p style={{ color: "#e74c3c" }}>{error}</p>}

        {tiers.map((tier) => {
          const progressPct =
            tier.lessons_total > 0
              ? Math.round((tier.lessons_completed / tier.lessons_total) * 100)
              : 0;

          const cardBody = (
            <div className="card">
              <div className="tier-card-header">
                <span className="tier-card-title">
                  {lang === "bn" ? tier.name_bn : tier.name_en}
                </span>
                {!tier.unlocked && <span className="tier-lock-icon">🔒</span>}
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="progress-label">
                {tier.lessons_completed}/{tier.lessons_total}{" "}
                {lang === "bn" ? "সম্পন্ন" : "completed"}
              </span>
            </div>
          );

          return tier.unlocked ? (
            <Link
              key={tier.id}
              href={`/learn-hub/${tier.id}?lang=${lang}`}
              className="tier-card"
            >
              {cardBody}
            </Link>
          ) : (
            <div key={tier.id} className="tier-card locked">
              {cardBody}
            </div>
          );
        })}
      </div>
    </section>
  );
}