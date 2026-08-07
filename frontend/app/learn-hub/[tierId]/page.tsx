"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import PageContainer from "../../../src/components/common/PageContainer";
import BackHome from "../../../src/components/common/BackHome";
import PageHero from "../../../src/components/common/PageHero";
import GlassCard from "../../../src/components/ui/Card";
import Button from "../../../src/components/ui/Button";
import Badge from "../../../src/components/ui/Badge";
import Spinner from "../../../src/components/ui/Spinner";

type Lesson = {
  id: string;
  title: string;
  order_index: number;
  estimated_minutes: number;
  completed: boolean;
};

type Tier = {
  id: number;
  name_en: string;
  name_bn: string;
  order_index: number;
  unlocked: boolean;
  lessons_completed: number;
  lessons_total: number;
};

export default function TierLessonsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const tierId = params.tierId as string;

  const [lang, setLang] = useState<"bn" | "en">(
    (searchParams.get("lang") as "bn" | "en") || "en"
  );
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetch(`${API_BASE}/learn/tiers`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setTiers(data);
      })
      .catch(() => setError("Could not load tiers."));
  }, []);

  useEffect(() => {
    if (tiers.length === 0) return;

    setLoading(true);
    fetch(
      `${API_BASE}/learn/lessons?tier_id=${tierId}&lang=${lang}`,
      {
        credentials: "include",
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return res.json();
      })
      .then((data) => setLessons(data))
      .catch(() => setError("Could not reach the backend."))
      .finally(() => setLoading(false));
  }, [tierId, lang, tiers]);

  const currentTier = tiers.find((t) => t.id === parseInt(tierId));

  if (loading) {
    return (
      <PageContainer>
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <Spinner size={40} />
          <p style={{ marginTop: "1rem", color: "var(--text-secondary)" }}>
            Loading...
          </p>
        </div>
      </PageContainer>
    );
  }

  if (error || !currentTier) {
    return (
      <PageContainer>
        <BackHome />
        <div
          style={{
            padding: "1rem 1.5rem",
            background: "rgba(244, 67, 54, 0.1)",
            border: "1px solid #dc3545",
            borderRadius: "0.75rem",
            color: "#dc3545",
          }}
        >
          ❌ {error || "Tier not found."}
        </div>
      </PageContainer>
    );
  }

  const displayTitle = lang === "bn" ? currentTier.name_bn : currentTier.name_en;

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
        badge="🎓 Learn Cybersecurity"
        icon=""
        title={displayTitle}
        subtitle="Bite‑sized lessons and quizzes to build your scam‑spotting skills"
      >
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap", marginTop: "1rem" }}>
          <Link href="/learn-hub">
            <Button variant="secondary" size="sm">
              ← All Tiers
            </Button>
          </Link>
          <span
            style={{
              fontSize: "0.85rem",
              color: "var(--text-secondary)",
              alignSelf: "center",
            }}
          >
            {lessons.filter((l) => l.completed).length}/{lessons.length} lessons completed
          </span>
        </div>
      </PageHero>

      <GlassCard>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {lessons.map((lesson, idx) => (
            <Link
              key={lesson.id}
              href={`/learn-hub/lesson/${lesson.id}?lang=${lang}&tierId=${tierId}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.9rem 1.2rem",
                borderRadius: "0.75rem",
                borderBottom: idx !== lessons.length - 1 ? "1px solid var(--border-color)" : "none",
                textDecoration: "none",
                transition: "all 0.2s",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--bg-secondary)";
                e.currentTarget.style.transform = "translateX(6px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <span style={{ fontWeight: 500, color: "var(--text-dark)" }}>
                {lesson.order_index}. {lesson.title}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  {lesson.estimated_minutes} min
                </span>
                {lesson.completed && (
                  <Badge variant="success" size="sm">
                    ✅ Done
                  </Badge>
                )}
              </div>
            </Link>
          ))}
        </div>
      </GlassCard>
    </PageContainer>
  );
}