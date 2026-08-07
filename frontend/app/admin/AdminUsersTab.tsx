"use client";

import { useEffect, useState } from "react";

type AdminUser = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  preferred_lang: string;
  created_at: string;
};

export default function AdminUsersTab({ onViewActivity }: { onViewActivity: (userId: string, userName: string) => void }) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (role) params.append("role", role);

      const res = await fetch(`${API_BASE}/admin/users?${params}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      } else {
        setError(data.detail || "Error loading users.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const handleDelete = async (userId: string) => {
    setDeletingId(userId);
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      } else {
        const data = await res.json();
        alert(data.detail || "Could not delete user.");
      }
    } catch (err) {
      alert("Failed to connect to the server.");
    }
    setDeletingId(null);
    setConfirmId(null);
  };

  return (
    <div>
      {/* Filter bar */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.5rem", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
          style={{ flex: 1, minWidth: "200px", padding: "0.5rem 0.9rem", borderRadius: "0.5rem", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-primary)" }}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ padding: "0.5rem 0.9rem", borderRadius: "0.5rem", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-primary)" }}
        >
          <option value="">All Roles</option>
          <option value="citizen">Citizen</option>
          <option value="admin">Admin</option>
        </select>

        <button
          onClick={fetchUsers}
          style={{ padding: "0.5rem 1.2rem", borderRadius: "0.5rem", border: "none", background: "var(--accent)", color: "white", fontWeight: 600, cursor: "pointer" }}
        >
          <i className="fas fa-filter"></i> Filter
        </button>
      </div>

      <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
        Click a user's name to see their activity.
      </p>

      {loading && <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>Loading...</p>}
      {error && <p style={{ textAlign: "center", color: "#dc3545" }}>{error}</p>}
      {!loading && !error && users.length === 0 && (
        <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>No users match these filters.</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
        {users.map((u) => (
          <div key={u.id} className="card" style={{ padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <button
                  onClick={() => onViewActivity(u.id, u.full_name)}
                  style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontWeight: 700, fontSize: "1rem", color: "var(--accent)", textDecoration: "underline" }}
                >
                  {u.full_name}
                </button>
                {u.role === "admin" && (
                  <span style={{ padding: "0.15rem 0.6rem", borderRadius: "1rem", fontSize: "0.7rem", fontWeight: 700, background: "var(--accent)", color: "white" }}>
                    ADMIN
                  </span>
                )}
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: "0.2rem 0 0" }}>{u.email}</p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", margin: "0.2rem 0 0" }}>
                Joined {new Date(u.created_at).toLocaleDateString()}
              </p>
            </div>

            <div>
              {confirmId === u.id ? (
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Delete this user?</span>
                  <button
                    onClick={() => handleDelete(u.id)}
                    disabled={deletingId === u.id}
                    style={{ padding: "0.35rem 0.9rem", borderRadius: "0.5rem", border: "none", background: "#dc3545", color: "white", fontWeight: 600, cursor: "pointer", fontSize: "0.8rem" }}
                  >
                    {deletingId === u.id ? "Deleting..." : "Confirm"}
                  </button>
                  <button
                    onClick={() => setConfirmId(null)}
                    style={{ padding: "0.35rem 0.9rem", borderRadius: "0.5rem", border: "1px solid var(--card-border)", background: "transparent", color: "var(--text-primary)", cursor: "pointer", fontSize: "0.8rem" }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmId(u.id)}
                  style={{ padding: "0.4rem 1rem", borderRadius: "0.5rem", border: "1px solid #dc3545", background: "transparent", color: "#dc3545", fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}
                >
                  <i className="fas fa-trash"></i> Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}