"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
  showMoodOverlay: boolean;
  openMoodSelector: () => void;
  selectMood: (theme: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<string>("default");
  const [showMoodOverlay, setShowMoodOverlay] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("lumen_mood_preference");
    if (saved) {
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
    <ThemeContext.Provider value={{ theme, setTheme, showMoodOverlay, openMoodSelector, selectMood }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}