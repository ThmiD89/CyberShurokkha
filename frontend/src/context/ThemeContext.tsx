"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// ============================================
// THEME DEFINITIONS – Original Names Preserved
// ============================================
export const THEMES = [
  { id: "default", name: "Default", emoji: "🌸", colors: ["#8966B0", "#DCC8EB", "#F7F3FA"] },
  { id: "dark", name: "Dark", emoji: "🌙", colors: ["#8B6FD4", "#231D34", "#14101E"] },
  { id: "happy", name: "Happy", emoji: "☀️", colors: ["#DC8E3E", "#F7DFBE", "#FEF9F0"] },
  { id: "calm", name: "Calm", emoji: "🌊", colors: ["#2E9A8A", "#C1E3DB", "#F2FBF9"] },
  { id: "energetic", name: "Energetic", emoji: "🍂", colors: ["#E85540", "#F5A48E", "#FDE4DD"] },
  { id: "professional", name: "Professional", emoji: "🏢", colors: ["#3B82F6", "#1A3050", "#0A1628"] },
  { id: "white", name: "White", emoji: "🤍", colors: ["#3B4047", "#DCE0E6", "#FFFFFF"] },
  { id: "sad", name: "Sad", emoji: "🌧️", colors: ["#6B7F8F", "#1C2733", "#0C1118"] },
];

type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
  showMoodOverlay: boolean;
  openMoodSelector: () => void;
  selectMood: (theme: string) => void;
  themes: typeof THEMES;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<string>("default");
  const [showMoodOverlay, setShowMoodOverlay] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("lumen_mood_preference");
    if (saved && THEMES.some(t => t.id === saved)) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
      setShowMoodOverlay(false);
    } else {
      setShowMoodOverlay(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("lumen_mood_preference", theme);
  }, [theme]);

  const openMoodSelector = () => setShowMoodOverlay(true);

  const selectMood = (newTheme: string) => {
    setTheme(newTheme);
    setShowMoodOverlay(false);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, showMoodOverlay, openMoodSelector, selectMood, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}