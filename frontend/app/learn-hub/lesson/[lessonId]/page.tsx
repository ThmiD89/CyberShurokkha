"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import PageContainer from "../../../../src/components/common/PageContainer";
import BackHome from "../../../../src/components/common/BackHome";
import PageHero from "../../../../src/components/common/PageHero";
import GlassCard from "../../../../src/components/ui/Card";
import Button from "../../../../src/components/ui/Button";
import Spinner from "../../../../src/components/ui/Spinner";

type LessonDetail = {
  id: string;
  title: string;
  content: string;
  estimated_minutes: number;
};

type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
};

type QuizAnswerResult = {
  question_id: string;
  correct_option_index: number;
  is_correct: boolean;
};

type QuizResult = {
  score: number;
  total: number;
  passed: boolean;
  lesson_completed: boolean;
  results: QuizAnswerResult[];
};

export default function LessonPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const lessonId = params.lessonId as string;
  const tierId = searchParams.get("tierId") || "1";

  const [lang, setLang] = useState<"bn" | "en">(
    (searchParams.get("lang") as "bn" | "en") || "en"
  );
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setResult(null);
    setAnswers({});
    Promise.all([
      fetch(`http://localhost:8000/learn/lessons/${lessonId}?lang=${lang}`, {
        credentials: "include",
      }).then((r) => {
        if (!r.ok) throw new Error(`Server returned ${r.status}`);
        return r.json();
      }),
      fetch(`http://localhost:8000/learn/lessons/${lessonId}/quiz?lang=${lang}`, {
        credentials: "include",
      }).then((r) => {
        if (!r.ok) throw new Error(`Server returned ${r.status}`);
        return r.json();
      }),
    ])
      .then(([lessonData, quizData]) => {
        setLesson(lessonData);
        setQuestions(quizData);
      })
      .catch(() => setError("Could not reach the backend."))
      .finally(() => setLoading(false));
  }, [lessonId, lang]);

  function selectAnswer(questionId: string, optionIndex: number) {
    if (result) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  }

  async function submitQuiz() {
    try {
      const res = await fetch("http://localhost:8000/learn/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ lesson_id: lessonId, answers }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Could not submit quiz.");
    }
  }

  const allAnswered = questions.length > 0 && questions.every((q) => answers[q.id] !== undefined);

  if (loading) {
    return (
      <PageContainer>
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <Spinner size={40} />
          <p style={{ marginTop: "1rem", color: "var(--text-secondary)" }}>
            Loading lesson...
          </p>
        </div>
      </PageContainer>
    );
  }

  if (error || !lesson) {
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
          ❌ {error || "Lesson not found."}
        </div>
      </PageContainer>
    );
  }

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
        badge="📚 Lesson"
        icon=""
        title={lesson.title}
        subtitle={`${lesson.estimated_minutes} min read`}
      >
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap", marginTop: "1rem" }}>
          <Link href={`/learn-hub/${tierId}?lang=${lang}`}>
            <Button variant="secondary" size="sm">
              ← Back to Lessons
            </Button>
          </Link>
        </div>
      </PageHero>

      <GlassCard style={{ marginBottom: "1.5rem" }}>
        <div
          style={{
            color: "var(--text-secondary)",
            lineHeight: "1.8",
            fontSize: "1rem",
            whiteSpace: "pre-wrap",
          }}
          dangerouslySetInnerHTML={{ __html: lesson.content }}
        />
      </GlassCard>

      <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text-dark)", marginBottom: "1rem" }}>
        📝 Quiz
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
        {questions.map((q, qi) => (
          <GlassCard key={q.id} style={{ padding: "1.2rem 1.5rem" }}>
            <p style={{ fontWeight: 600, marginBottom: "0.8rem", color: "var(--text-dark)" }}>
              {qi + 1}. {q.question}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {q.options.map((opt, oi) => {
                const isSelected = answers[q.id] === oi;
                let background = "var(--card-bg)";
                let borderColor = "var(--border-color)";

                if (result) {
                  const qResult = result.results.find((r) => r.question_id === q.id);
                  if (qResult) {
                    if (oi === qResult.correct_option_index) {
                      background = "#e8f5e9";
                      borderColor = "#4caf50";
                    } else if (isSelected && !qResult.is_correct) {
                      background = "#fee2e2";
                      borderColor = "#dc3545";
                    }
                  }
                } else if (isSelected) {
                  background = "var(--bg-secondary)";
                  borderColor = "var(--accent)";
                }

                return (
                  <button
                    key={oi}
                    onClick={() => selectAnswer(q.id, oi)}
                    disabled={!!result}
                    style={{
                      padding: "0.6rem 1rem",
                      borderRadius: "0.5rem",
                      border: `2px solid ${borderColor}`,
                      background: background,
                      cursor: result ? "default" : "pointer",
                      textAlign: "left",
                      color: "var(--text-primary)",
                      fontSize: "0.95rem",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (!result && !isSelected) {
                        e.currentTarget.style.borderColor = "var(--accent)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!result && !isSelected) {
                        e.currentTarget.style.borderColor = "var(--border-color)";
                      }
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </GlassCard>
        ))}
      </div>

      {!result ? (
        <Button
          variant="primary"
          size="lg"
          fullWidth
          style={{ marginTop: "1.5rem" }}
          onClick={submitQuiz}
          disabled={!allAnswered}
        >
          {!allAnswered ? "Answer all questions first" : "Submit Quiz"}
        </Button>
      ) : (
        <GlassCard
          style={{
            textAlign: "center",
            border: result.passed ? "2px solid #4caf50" : "2px solid #dc3545",
            marginTop: "1.5rem",
            padding: "2rem",
          }}
        >
          <span style={{ fontSize: "3rem" }}>{result.passed ? "🎉" : "😅"}</span>
          <h3 style={{ fontSize: "1.5rem", color: result.passed ? "#1b5e20" : "#b71c1c" }}>
            {result.score}/{result.total}
          </h3>
          <p style={{ color: result.passed ? "#2e7d32" : "#b71c1c" }}>
            {result.passed
              ? "✅ Lesson completed! 🎉"
              : "❌ You need 3/4 correct to pass. Try again!"}
          </p>
          <Link href={`/learn-hub/${tierId}?lang=${lang}`}>
            <Button variant="primary" style={{ marginTop: "1rem" }}>
              Back to Lessons
            </Button>
          </Link>
        </GlassCard>
      )}
    </PageContainer>
  );
}