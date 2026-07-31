"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";

type Lesson = {
  id: string;
  title: string;
  order_index: number;
  estimated_minutes: number;
  completed: boolean;
};

// Tier name mapping (matches your seeded tiers)
const tierNames: Record<string, { en: string; bn: string }> = {
  "1": { en: "Digital Basics", bn: "ডিজিটাল বেসিক্স" },
  "2": { en: "Cyber Hygiene", bn: "সাইবার স্বাস্থ্যবিধি" },
  "3": { en: "Threat Awareness", bn: "হুমকি সচেতনতা" },
  "4": { en: "Advanced / Technical", bn: "উন্নত / প্রযুক্তিগত" },
};

export default function TierLessonsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const tierId = params.tierId as string;

  const [lang, setLang] = useState<"bn" | "en">(
    (searchParams.get("lang") as "bn" | "en") || "bn"
  );
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get the tier name based on the ID
  const tierName = tierNames[tierId] || { en: "Lessons", bn: "পাঠ" };
  const displayTitle = lang === "bn" ? tierName.bn : tierName.en;

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8000/learn/lessons?tier_id=${tierId}&lang=${lang}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return res.json();
      })
      .then((data) => setLessons(data))
      .catch(() => setError("Could not reach the backend. Is uvicorn running?"))
      .finally(() => setLoading(false));
  }, [tierId, lang]);

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
          <Link href="/learn-hub" className="nav-link" style={{ fontSize: "0.9rem" }}>
            ‹ {lang === "bn" ? "শিক্ষা কেন্দ্র" : "Learning Hub"}
          </Link>
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

        <h1
          className="hero-title"
          style={{ fontSize: "2rem", textAlign: "left", margin: "1rem 0 1.5rem" }}
        >
          {displayTitle}
        </h1>

        {loading && <p>{lang === "bn" ? "লোড হচ্ছে..." : "Loading..."}</p>}
        {error && <p style={{ color: "#e74c3c" }}>{error}</p>}

        <div className="card" style={{ padding: "0.5rem 1.5rem" }}>
          {lessons.map((lesson, idx) => (
            <Link
              key={lesson.id}
              href={`/learn-hub/lesson/${lesson.id}?lang=${lang}&tierId=${tierId}`}
              className="lesson-row"
              style={{
                borderBottom:
                  idx !== lessons.length - 1 ? "1px solid var(--border-color)" : "none",
                padding: "1rem 0",
              }}
            >
              <span className="lesson-row-title">
                {lesson.completed ? "✅ " : "⬜ "}
                {lesson.order_index}. {lesson.title}
              </span>
              <span className="lesson-row-meta">
                {lesson.estimated_minutes} {lang === "bn" ? "মিনিট" : "min"}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}