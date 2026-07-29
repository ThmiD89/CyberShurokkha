"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";

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
    (searchParams.get("lang") as "bn" | "en") || "bn"
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
      fetch(`http://localhost:8000/learn/lessons/${lessonId}?lang=${lang}`).then((r) => r.json()),
      fetch(`http://localhost:8000/learn/lessons/${lessonId}/quiz?lang=${lang}`).then((r) => r.json()),
    ])
      .then(([lessonData, quizData]) => {
        setLesson(lessonData);
        setQuestions(quizData);
      })
      .catch(() => setError("Could not reach the backend. Is uvicorn running?"))
      .finally(() => setLoading(false));
  }, [lessonId, lang]);

  function selectAnswer(questionId: string, optionIndex: number) {
    if (result) return; // lock answers after submitting
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  }

  async function submitQuiz() {
    try {
      const res = await fetch("http://localhost:8000/learn/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lesson_id: lessonId, answers }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Could not submit quiz. Is uvicorn running?");
    }
  }

  const allAnswered = questions.length > 0 && questions.every((q) => answers[q.id] !== undefined);

  return (
    <section className="hero-section">
      <div className="container" style={{ maxWidth: "700px", textAlign: "left" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href={`/learn-hub/${tierId}?lang=${lang}`} className="nav-link" style={{ fontSize: "0.9rem" }}>
            ‹ {lang === "bn" ? "পাঠের তালিকা" : "Lesson List"}
          </Link>
          <div className="lang-toggle">
            <button className={`lang-btn ${lang === "bn" ? "active" : ""}`} onClick={() => setLang("bn")}>বাংলা</button>
            <button className={`lang-btn ${lang === "en" ? "active" : ""}`} onClick={() => setLang("en")}>English</button>
          </div>
        </div>

        {loading && <p>{lang === "bn" ? "লোড হচ্ছে..." : "Loading..."}</p>}
        {error && <p style={{ color: "#e74c3c" }}>{error}</p>}

        {lesson && (
          <>
            <h1 className="hero-title" style={{ fontSize: "1.8rem", margin: "1rem 0 0.3rem" }}>
              {lesson.title}
            </h1>
            <p className="progress-label" style={{ marginBottom: "1.5rem" }}>
              {lesson.estimated_minutes} {lang === "bn" ? "মিনিট" : "min"}
            </p>

            <div className="card" style={{ marginBottom: "2rem", whiteSpace: "pre-line", lineHeight: 1.7 }}>
              {lesson.content}
            </div>

            <h2 className="tier-card-title" style={{ marginBottom: "1rem" }}>
              {lang === "bn" ? "কুইজ" : "Quiz"}
            </h2>

            {questions.map((q, qi) => (
              <div key={q.id} className="card" style={{ marginBottom: "1rem" }}>
                <p style={{ fontWeight: 600, marginBottom: "0.8rem" }}>
                  {qi + 1}. {q.question}
                </p>
                {q.options.map((opt, oi) => {
  const isSelected = answers[q.id] === oi;
  let cls = "quiz-option";

  if (result) {
    const qResult = result.results.find((r) => r.question_id === q.id);
    if (qResult) {
      if (oi === qResult.correct_option_index) {
        cls += " correct";
      } else if (isSelected && !qResult.is_correct) {
        cls += " incorrect";
      }
    }
  } else if (isSelected) {
    cls += " selected";
  }

  return (
    <button
      key={oi}
      className={cls}
      onClick={() => selectAnswer(q.id, oi)}
      disabled={!!result}
    >
      {opt}
    </button>
  );
})}
              </div>
            ))}

            {!result && (
              <button
                className="btn-primary"
                disabled={!allAnswered}
                onClick={submitQuiz}
                style={{ opacity: allAnswered ? 1 : 0.5, cursor: allAnswered ? "pointer" : "not-allowed" }}
              >
                {lang === "bn" ? "জমা দিন" : "Submit Quiz"}
              </button>
            )}

            {result && (
              <div
                className="card"
                style={{
                  textAlign: "center",
                  borderColor: result.passed ? "#2ecc71" : "#e74c3c",
                }}
              >
                <p style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                  {result.passed ? "🎉" : "😕"} {result.score}/{result.total}
                </p>
                <p style={{ marginBottom: "1rem" }}>
                  {result.passed
                    ? lang === "bn" ? "পাঠ সম্পন্ন হয়েছে!" : "Lesson completed!"
                    : lang === "bn" ? "আবার চেষ্টা করুন — ৩/৪ সঠিক দরকার" : "Try again — you need 3/4 correct"}
                </p>
                <Link href={`/learn-hub/${tierId}?lang=${lang}`} className="btn-secondary">
                  {lang === "bn" ? "পাঠের তালিকায় ফিরুন" : "Back to Lesson List"}
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}