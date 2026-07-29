"use client";

import { useTheme } from "../context/ThemeContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import MoodOverlay from "./MoodOverlay";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { showMoodOverlay } = useTheme();

  return (
    <>
      <MoodOverlay />
      <div style={{ display: showMoodOverlay ? "none" : "block" }}>
        <Navbar />
        {children}
        <Footer />
      </div>
    </>
  );
}