"use client";

import { useState } from "react";
import AdminRoute from "../../src/components/AdminRoute";
import AdminUsersTab from "./AdminUsersTab";
import AdminReportsTab from "./AdminReportsTab";
import AdminActivityTab from "./AdminActivityTab";

type Tab = "users" | "reports" | "activity";

function AdminPageContent() {
  const [activeTab, setActiveTab] = useState<Tab>("reports");

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "reports", label: "Pending Reports", icon: "fa-flag" },
    { id: "users", label: "Users", icon: "fa-users" },
    { id: "activity", label: "Activity", icon: "fa-chart-line" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <a href="/" style={{ color: "var(--accent)", textDecoration: "none", display: "inline-block", marginBottom: "1.5rem" }}>
          ← Back to Home
        </a>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 700, color: "var(--text-dark)" }}>
            🛠️ Admin Panel
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
            Manage reports, users, and platform activity
          </p>
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: "0.6rem", justifyContent: "center", marginBottom: "2rem", flexWrap: "wrap" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "0.6rem 1.2rem",
                borderRadius: "2rem",
                border: activeTab === tab.id ? "2px solid var(--accent)" : "1px solid var(--card-border)",
                background: activeTab === tab.id ? "var(--accent)" : "var(--card-bg)",
                color: activeTab === tab.id ? "white" : "var(--text-primary)",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <i className={`fas ${tab.icon}`}></i> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "reports" && <AdminReportsTab />}
        {activeTab === "users" && <AdminUsersTab />}
        {activeTab === "activity" && <AdminActivityTab />}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminRoute>
      <AdminPageContent />
    </AdminRoute>
  );
}