import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../src/styles/globals.css";
import { ThemeProvider } from "../src/context/ThemeContext";
import AppShell from "../src/components/AppShell";
import { AuthProvider } from "../src/context/AuthContext";
import UserChatWidget from "../src/components/UserChatWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CyberShurokkha 360",
  description: "AI-powered scam detection & threat intelligence platform for Bangladesh",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="default">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <AppShell>{children}</AppShell>
          </AuthProvider>
        </ThemeProvider>
        <UserChatWidget />
      </body>
    </html>
  );
}