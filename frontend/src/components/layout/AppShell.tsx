"use client";

import { useTheme } from "../../context/ThemeContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import MoodOverlay from "../widgets/MoodOverlay";
import FloatingBackground from "../common/FloatingBackground";
import EmailVerificationGuard from "../guards/EmailVerificationGuard";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { showMoodOverlay } = useTheme();

  return (
    <>
      <MoodOverlay />
      <div style={{ display: showMoodOverlay ? "none" : "block" }}>
        <FloatingBackground />
        <Navbar />
        <main style={{ position: "relative", zIndex: 1 }}>
          <EmailVerificationGuard>{children}</EmailVerificationGuard>
        </main>
        <Footer />
      </div>
    </>
  );
}