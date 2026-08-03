"use client";

import { useState, useEffect } from "react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read: boolean;
  replied: boolean;
}

export default function AdminContactTab() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchMessages = async () => {
    try {
      const res = await fetch("http://localhost:8000/admin/contact-messages", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(data);
      setFilteredMessages(data);
    } catch (err) {
      setError("Could not load contact messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Search/filter logic
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredMessages(messages);
      return;
    }
    const term = searchTerm.toLowerCase();
    const filtered = messages.filter(
      (msg) =>
        msg.name.toLowerCase().includes(term) ||
        msg.email.toLowerCase().includes(term) ||
        msg.message.toLowerCase().includes(term)
    );
    setFilteredMessages(filtered);
  }, [searchTerm, messages]);

  const markAsRead = async (id: string) => {
    try {
      await fetch(`http://localhost:8000/admin/contact-messages/${id}/read`, {
        method: "PUT",
        credentials: "include",
      });
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, read: true } : msg))
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const markAsReplied = async (id: string) => {
    try {
      await fetch(`http://localhost:8000/admin/contact-messages/${id}/replied`, {
        method: "PUT",
        credentials: "include",
      });
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, replied: true } : msg))
      );
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, replied: true });
      }
    } catch (err) {
      console.error("Failed to mark as replied", err);
    }
  };

  const openModal = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMessage(null);
  };

  // Opens Gmail compose in browser
  const replyViaGmail = (email: string, name: string, originalMessage: string) => {
    const subject = encodeURIComponent(`Re: Contact from ${name}`);
    const body = encodeURIComponent(
      `Hi ${name},\n\nThank you for reaching out to CyberShurokkha 360.\n\nWe'll get back to you shortly.\n\n---\nOriginal Message:\n${originalMessage}`
    );
    window.open(
      `https://mail.google.com/mail/u/0/?view=cm&to=${email}&su=${subject}&body=${body}`,
      "_blank"
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <div className="spinner" />
        <p>Loading messages...</p>
      </div>
    );
  }

  if (error) {
    return <div style={{ color: "var(--text-secondary)", padding: "1rem" }}>⚠️ {error}</div>;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 600, color: "var(--text-dark)" }}>
          Contact Messages
        </h2>
        <input
          type="text"
          placeholder="Search by name, email, or message..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "0.5rem 1rem",
            border: "1px solid var(--border-color)",
            borderRadius: "0.5rem",
            background: "var(--bg-secondary)",
            color: "var(--text-primary)",
            fontSize: "0.9rem",
            minWidth: "250px",
          }}
        />
      </div>

      {filteredMessages.length === 0 ? (
        <p style={{ color: "var(--text-secondary)" }}>
          {searchTerm ? "No messages match your search." : "No messages yet."}
        </p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ background: "var(--bg-secondary)", borderBottom: "2px solid var(--border-color)" }}>
                <th style={{ padding: "0.8rem 0.5rem", textAlign: "left" }}>Name</th>
                <th style={{ padding: "0.8rem 0.5rem", textAlign: "left" }}>Email</th>
                <th style={{ padding: "0.8rem 0.5rem", textAlign: "left" }}>Message</th>
                <th style={{ padding: "0.8rem 0.5rem", textAlign: "left" }}>Received</th>
                <th style={{ padding: "0.8rem 0.5rem", textAlign: "center" }}>Status</th>
                <th style={{ padding: "0.8rem 0.5rem", textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map((msg) => (
                <tr
                  key={msg.id}
                  onClick={() => openModal(msg)}
                  style={{
                    borderBottom: "1px solid var(--border-color)",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-secondary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "0.8rem 0.5rem" }}>{msg.name}</td>
                  <td style={{ padding: "0.8rem 0.5rem" }}>
                    <a href={`mailto:${msg.email}`} onClick={(e) => e.stopPropagation()} style={{ color: "var(--accent)" }}>
                      {msg.email}
                    </a>
                  </td>
                  <td style={{ padding: "0.8rem 0.5rem", maxWidth: "250px", wordBreak: "break-word" }}>
                    {msg.message.length > 80 ? msg.message.slice(0, 80) + "…" : msg.message}
                  </td>
                  <td style={{ padding: "0.8rem 0.5rem", whiteSpace: "nowrap" }}>
                    {new Date(msg.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "0.8rem 0.5rem", textAlign: "center" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "2rem",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        background: msg.read ? "var(--bg-secondary)" : "#4caf50",
                        color: msg.read ? "var(--text-secondary)" : "white",
                      }}
                    >
                      {msg.read ? "Read" : "New"}
                    </span>
                    {msg.replied && (
                      <span style={{ marginLeft: "0.3rem", fontSize: "0.7rem", color: "var(--text-secondary)" }}>
                        (Replied)
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "0.8rem 0.5rem", textAlign: "center" }}>
                    {!msg.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(msg.id);
                        }}
                        style={{
                          padding: "0.3rem 0.8rem",
                          border: "none",
                          borderRadius: "0.5rem",
                          background: "var(--accent)",
                          color: "white",
                          cursor: "pointer",
                          fontSize: "0.75rem",
                        }}
                      >
                        Mark Read
                      </button>
                    )}
                    {msg.read && (
                      <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>✔</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ===== MODAL ===== */}
      {modalOpen && selectedMessage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              borderRadius: "1.2rem",
              padding: "2rem",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "var(--card-shadow)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "0.8rem",
                right: "1rem",
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                color: "var(--text-secondary)",
              }}
            >
              ✕
            </button>

            <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--text-dark)", marginBottom: "1rem" }}>
              Message from {selectedMessage.name}
            </h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${selectedMessage.email}`} style={{ color: "var(--accent)" }}>
                {selectedMessage.email}
              </a>
            </p>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
              <strong>Received:</strong> {new Date(selectedMessage.created_at).toLocaleString()}
            </p>
            <div
              style={{
                background: "var(--bg-secondary)",
                padding: "1rem",
                borderRadius: "0.5rem",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                color: "var(--text-primary)",
                marginBottom: "1.5rem",
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              {selectedMessage.message}
            </div>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {/* Gmail reply button */}
              <button
                onClick={() =>
                  replyViaGmail(
                    selectedMessage.email,
                    selectedMessage.name,
                    selectedMessage.message
                  )
                }
                style={{
                  padding: "0.6rem 1.2rem",
                  border: "none",
                  borderRadius: "0.5rem",
                  background: "var(--accent)",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                ✉️ Reply via Gmail
              </button>

              {!selectedMessage.replied && (
                <button
                  onClick={() => markAsReplied(selectedMessage.id)}
                  style={{
                    padding: "0.6rem 1.2rem",
                    border: "1px solid var(--border-color)",
                    borderRadius: "0.5rem",
                    background: "transparent",
                    color: "var(--text-primary)",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Mark as Replied
                </button>
              )}
              {selectedMessage.replied && (
                <span style={{ padding: "0.6rem 1.2rem", color: "var(--text-secondary)" }}>
                  ✅ Replied
                </span>
              )}
              {!selectedMessage.read && (
                <button
                  onClick={() => markAsRead(selectedMessage.id)}
                  style={{
                    padding: "0.6rem 1.2rem",
                    border: "1px solid var(--border-color)",
                    borderRadius: "0.5rem",
                    background: "transparent",
                    color: "var(--text-primary)",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Mark as Read
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}