"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type User = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  preferred_lang: string;
  email_verified: boolean;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, recaptchaToken: string) => Promise<{ ok: boolean; error?: string; user?: User }>;
  signup: (
    full_name: string,
    email: string,
    password: string,
    recaptchaToken: string,
    phone_number: string,
    district_id: number,
    occupation: string,
    terms_accepted: boolean
  ) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, { credentials: "include" });
      if (res.ok) {
        setUser(await res.json());
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const formatError = (detail: any): string => {
    if (!detail) return "An error occurred.";
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail.map((err: any) => err.msg || JSON.stringify(err)).join(" • ");
    }
    if (typeof detail === "object") {
      return JSON.stringify(detail);
    }
    return String(detail);
  };

  const login = async (email: string, password: string, recaptchaToken: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, recaptcha_token: recaptchaToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: formatError(data.detail) };
      }
      setUser(data);
      return { ok: true, user: data };
    } catch {
      return { ok: false, error: "Failed to connect to the server." };
    }
  };

  const signup = async (
    full_name: string,
    email: string,
    password: string,
    recaptchaToken: string,
    phone_number: string,
    district_id: number,
    occupation: string,
    terms_accepted: boolean
  ) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          full_name,
          email,
          password,
          recaptcha_token: recaptchaToken,
          phone_number,
          district_id,
          occupation,
          terms_accepted,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: formatError(data.detail) };
      }
      setUser(data);
      return { ok: true };
    } catch {
      return { ok: false, error: "Failed to connect to the server." };
    }
  };

  const logout = async () => {
    await fetch(`${API_BASE_URL}/auth/logout`, { method: "POST", credentials: "include" });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}