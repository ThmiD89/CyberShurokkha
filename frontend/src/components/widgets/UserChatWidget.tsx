"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

type Msg = { role: "user" | "assistant"; content: string };

export default function UserChatWidget() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I can help you find your way around, file a report, or point you to a learn-hub lesson. What do you need?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: nextMessages.slice(0, -1),
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
        if (data.action?.type === "navigate") {
          router.push(data.action.payload);
        }
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Couldn't reach the server. Please try again." }]);
    }
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close assistant" : "Open assistant"}
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          width: "3.4rem",
          height: "3.4rem",
          borderRadius: "50%",
          border: "none",
          background: "var(--accent)",
          color: "white",
          fontSize: "1.3rem",
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
          zIndex: 1000,
        }}
      >
        <i className={`fas ${open ? "fa-xmark" : "fa-comment-dots"}`}></i>
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "5.2rem",
            right: "1.5rem",
            width: "min(340px, calc(100vw - 2rem))",
            height: "min(460px, calc(100vh - 8rem))",
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            borderRadius: "1rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 1000,
          }}
        >
          <div style={{ padding: "0.9rem 1rem", borderBottom: "1px solid var(--card-border)", fontWeight: 700, color: "var(--text-dark)" }}>
            <i className="fas fa-shield-halved" style={{ color: "var(--accent)", marginRight: "0.5rem" }}></i>
            Platform Assistant
          </div>

          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  padding: "0.55rem 0.8rem",
                  borderRadius: "0.9rem",
                  fontSize: "0.88rem",
                  lineHeight: 1.4,
                  background: m.role === "user" ? "var(--accent)" : "var(--bg-primary)",
                  color: m.role === "user" ? "white" : "var(--text-primary)",
                  border: m.role === "user" ? "none" : "1px solid var(--card-border)",
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: "flex-start", fontSize: "0.8rem", color: "var(--text-secondary)" }}>Thinking...</div>
            )}
          </div>

          <div style={{ display: "flex", gap: "0.5rem", padding: "0.75rem", borderTop: "1px solid var(--card-border)" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask or tell me what you need..."
              style={{
                flex: 1,
                padding: "0.5rem 0.8rem",
                borderRadius: "0.6rem",
                border: "1px solid var(--card-border)",
                background: "var(--bg-primary)",
                color: "var(--text-primary)",
                fontSize: "0.85rem",
              }}
            />
            <button
              onClick={send}
              disabled={loading}
              style={{
                padding: "0.5rem 0.9rem",
                borderRadius: "0.6rem",
                border: "none",
                background: "var(--accent)",
                color: "white",
                cursor: loading ? "default" : "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
}