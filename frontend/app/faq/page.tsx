"use client";

import { useState, useRef, useEffect } from "react";

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
}

const faqData: FAQItem[] = [
  // ===== GENERAL =====
  {
    id: "what-is",
    category: "General",
    question: "What is CyberShurokkha 360?",
    keywords: ["platform", "about", "cybershurokkha", "cyber", "security", "what"],
    answer:
      "CyberShurokkha 360 is an AI-powered cybersecurity platform built for Bangladesh. It helps individuals and organizations detect scams, phishing URLs, fraudulent job postings, and suspicious log files. Our mission is to create a safer digital Bangladesh through community-driven threat intelligence.",
  },
  {
    id: "free",
    category: "General",
    question: "Is CyberShurokkha 360 free to use?",
    keywords: ["free", "cost", "price", "money", "paid", "pricing"],
    answer:
      "Yes, all tools on CyberShurokkha 360 are completely free for everyone. We believe that cybersecurity should be accessible to all citizens of Bangladesh, regardless of their technical background or financial situation.",
  },
  {
    id: "who-built",
    category: "General",
    question: "Who built CyberShurokkha 360?",
    keywords: ["builder", "developer", "creator", "team", "made", "by"],
    answer:
      "CyberShurokkha 360 was built by a team of cybersecurity enthusiasts, AI engineers, and full-stack developers from Bangladesh. We are passionate about using technology to protect our fellow citizens from online threats.",
  },

  // ===== HOW TO USE =====
  {
    id: "how-to-scam-detector",
    category: "How To Use",
    question: "How do I use the Scam Detector?",
    keywords: ["scam", "detector", "analyze", "message", "sms", "email", "use", "scan", "check"],
    answer:
      "1. Go to the Scam Detector page (`/scan`).\n2. Paste the suspicious SMS, email, or message into the text box.\n3. Select the message channel (SMS, Email, WhatsApp, etc.).\n4. Click 'Analyze'.\n5. View the results: risk score, risk level (Safe/Medium/Dangerous), reasons, and a recommendation.",
  },
  {
    id: "how-to-url-scanner",
    category: "How To Use",
    question: "How do I scan a URL or QR code?",
    keywords: ["url", "qr", "scan", "code", "link", "phishing", "check", "camera"],
    answer:
      "**Option A – Paste a URL:**\n- Go to URL & QR Scanner (`/qr-scan`), click the 'URL' tab, paste the link, and click 'Scan URL'.\n\n**Option B – Upload a QR Code:**\n- Click the 'Upload' tab, drag & drop or browse for a QR image, then click 'Scan QR Code'.\n\n**Option C – Scan with Camera:**\n- Click the 'Camera' tab, click 'Start Camera', point at a QR code – the camera stops automatically and shows the verdict.",
  },
  {
    id: "how-to-log-scanner",
    category: "How To Use",
    question: "How do I use the Log Scanner?",
    keywords: ["log", "logs", "server", "apache", "nginx", "linux", "windows", "security", "upload", "scan"],
    answer:
      "1. Go to the Log Scanner page (`/log-scanner`).\n2. Upload a log file (Apache, Nginx, Linux auth, Windows security).\n3. Click 'Upload & Scan'.\n4. View the overall risk level and a list of findings with severity, source IP, and evidence.\n5. Click 'View Solution' for remediation steps.",
  },
  {
    id: "how-to-job-checker",
    category: "How To Use",
    question: "How do I check a job posting for fraud?",
    keywords: ["job", "post", "posting", "fraud", "fake", "scam", "check", "verify"],
    answer:
      "1. Go to Fraud Job Detection (`/job-check`).\n2. Paste the job title, company description, full job description, requirements, and benefits.\n3. Click 'Check Job'.\n4. View whether it's fake, the confidence score, and a list of risk factors (e.g., 'Requests upfront payment').",
  },
  {
    id: "how-to-report",
    category: "How To Use",
    question: "How do I report a scam?",
    keywords: ["report", "post", "submit", "upload", "incident", "scam", "file", "complaint"],
    answer:
      "1. Go to Report Incident (`/report`).\n2. Select the district where the scam occurred.\n3. Choose a category (Scam Call, Phishing, Fake Job, etc.).\n4. Write a description of what happened.\n5. Optionally upload a screenshot.\n6. Click 'Submit Report'.\nYour report will be reviewed by the admin team and, if approved, appear on the Threat Map.",
  },
  {
    id: "how-to-learning-hub",
    category: "How To Use",
    question: "How do I use the Learning Hub?",
    keywords: ["learn", "lesson", "quiz", "tier", "education", "course", "study", "hub"],
    answer:
      "1. Go to the Learning Hub (`/learn-hub`).\n2. View available Tiers (Beginner, Intermediate, Advanced).\n3. Unlock tiers by completing previous ones.\n4. Click a lesson to read the content.\n5. Take the quiz (4 questions) after each lesson.\n6. Pass (score ≥ 3) to mark the lesson as complete and track progress in your Dashboard.",
  },
  {
    id: "how-to-dashboard",
    category: "How To Use",
    question: "How do I view my activity and progress?",
    keywords: ["dashboard", "activity", "progress", "stats", "history", "view"],
    answer:
      "Log in and go to your Dashboard (`/dashboard`) – you'll see:\n- Stats: total scans, checks, reports, lessons completed, etc.\n- Recent activity feed with timestamps and risk levels.\n- Learning progress and completion status.",
  },
  {
    id: "how-to-themes",
    category: "How To Use",
    question: "How do I change the theme/mood?",
    keywords: ["theme", "mood", "appearance", "color", "look", "dark", "light", "change"],
    answer:
      "1. Click the 'Appearance' button in the navbar.\n2. Select a mood: Default, Dark, Happy, Calm, Energetic, Professional, White, or Sad.\n3. The theme is saved to your browser preferences.",
  },

  // ===== SCAM DETECTION =====
  {
    id: "scam-detector",
    category: "Scam Detection",
    question: "How does the Scam Detector work?",
    keywords: ["scam", "detector", "ai", "ml", "machine learning", "algorithm", "work"],
    answer:
      "The Scam Detector uses a machine learning model trained on thousands of scam SMS, emails, and messages. When you paste a suspicious text, the AI analyzes patterns, keywords, and context to assign a risk score (safe, medium, or dangerous). It also provides a plain-language explanation and recommendation.",
  },
  {
    id: "scam-accurate",
    category: "Scam Detection",
    question: "How accurate is the Scam Detector?",
    keywords: ["accurate", "accuracy", "trust", "reliable", "confidence", "percent"],
    answer:
      "Our model achieves over 90% accuracy on known scam patterns. However, AI is not perfect. We recommend using common sense and verifying important information through official channels. We continuously retrain the model with new scam examples reported by the community.",
  },

  // ===== URL & QR SCANNER =====
  {
    id: "qr-scanner",
    category: "URL & QR Scanner",
    question: "What does the URL & QR Scanner do?",
    keywords: ["url", "qr", "scan", "phishing", "link", "code"],
    answer:
      "This tool checks if a URL or QR code leads to a phishing website. It examines the domain, HTTPS usage, URL structure, and known phishing patterns. You can either paste a link or upload a QR code image. The scanner returns a verdict (safe or dangerous) with a confidence score.",
  },
  {
    id: "qr-privacy",
    category: "URL & QR Scanner",
    question: "Is my scanned URL stored?",
    keywords: ["privacy", "stored", "saved", "data", "url", "scan", "history"],
    answer:
      "Yes, scans are stored in our database to improve the model and generate anonymous threat intelligence. However, we do not store any personally identifiable information unless you are logged in. Your privacy is always protected.",
  },

  // ===== LOG SCANNER =====
  {
    id: "log-scanner",
    category: "Log Scanner",
    question: "What types of logs can I upload?",
    keywords: ["log", "logs", "type", "upload", "apache", "nginx", "linux", "windows", "security"],
    answer:
      "You can upload Apache/Nginx access logs, Linux authentication logs, Windows security logs, and general system logs. The scanner automatically detects the log type and analyses for brute-force attacks, SQL injection attempts, port scans, and other suspicious activities.",
  },
  {
    id: "log-results",
    category: "Log Scanner",
    question: "What do the scan results mean?",
    keywords: ["results", "mean", "severity", "risk", "dangerous", "safe", "medium"],
    answer:
      "Results include a list of detected events, each with a severity level (low, medium, high, critical). For each finding, we provide a description, the source IP, and recommended remediation steps. The overall risk level (safe, medium, dangerous) helps you prioritize actions.",
  },

  // ===== FRAUD JOB DETECTION =====
  {
    id: "job-detector",
    category: "Fraud Job Detection",
    question: "How does Fraud Job Detection work?",
    keywords: ["job", "fraud", "fake", "posting", "detect", "work"],
    answer:
      "This tool analyzes job postings for red flags such as upfront payment requests, vague company descriptions, unrealistic salary claims, and urgent hiring language. It uses a combination of machine learning and rule-based analysis to flag suspicious posts.",
  },
  {
    id: "job-report",
    category: "Fraud Job Detection",
    question: "Can I report a fraudulent job posting?",
    keywords: ["job", "fraud", "fake", "report", "posting", "scam"],
    answer:
      "Yes, you can report suspicious job postings through our Community Reports feature. Your report will be reviewed by our team and, if verified, added to the threat map to warn others.",
  },

  // ===== LEARNING HUB =====
  {
    id: "learning-hub",
    category: "Learning Hub",
    question: "What is the Learning Hub?",
    keywords: ["learn", "education", "hub", "lessons", "quiz"],
    answer:
      "The Learning Hub is a free educational resource that teaches you how to spot scams, protect your digital identity, and understand cybersecurity basics. It is divided into tiers, each with lessons and quizzes. You earn progress as you complete each tier.",
  },
  {
    id: "learning-progress",
    category: "Learning Hub",
    question: "How is my progress tracked?",
    keywords: ["progress", "track", "lessons", "completed", "quiz", "score"],
    answer:
      "When you are logged in, your completed lessons and quiz scores are saved to your account. You can view your progress in the dashboard. This helps you track your learning journey and unlock higher tiers.",
  },

  // ===== COMMUNITY REPORTS =====
  {
    id: "community-reports",
    category: "Community Reports",
    question: "What is the Community Reports feature?",
    keywords: ["community", "report", "feature", "scam", "incident"],
    answer:
      "Community Reports allow you to submit scam incidents you've encountered. These reports are reviewed, approved, and displayed on the Threat Map. This crowdsourced intelligence helps others avoid the same scams.",
  },
  {
    id: "report-anonymous",
    category: "Community Reports",
    question: "Can I report anonymously?",
    keywords: ["anonymous", "report", "login", "privacy", "identity"],
    answer:
      "Yes, you can submit reports without logging in. However, logged-in users can view their report history and receive updates on moderation status.",
  },

  // ===== PRIVACY & SECURITY =====
  {
    id: "data-protection",
    category: "Privacy & Security",
    question: "How is my personal data protected?",
    keywords: ["privacy", "security", "data", "protected", "encryption", "safe", "secure"],
    answer:
      "We use industry-standard encryption (HTTPS), secure authentication (bcrypt hashing), and strict access controls. Your data is stored in a secure PostgreSQL database with regular backups. We never sell your personal information.",
  },
  {
    id: "data-retention",
    category: "Privacy & Security",
    question: "How long do you keep my data?",
    keywords: ["data", "retention", "delete", "keep", "how long"],
    answer:
      "We retain data only as long as necessary to provide our services, improve detection models, and comply with legal obligations. You can request deletion of your account and associated data at any time.",
  },

  // ===== ACCOUNT & SUPPORT =====
  {
    id: "account-delete",
    category: "Account & Support",
    question: "How do I delete my account?",
    keywords: ["delete", "account", "remove", "cancel", "terminate"],
    answer:
      "To delete your account, contact our support team via the Contact page. We will process your request within 72 hours. Note that anonymized reports and aggregated data may remain for analytics purposes.",
  },
  {
    id: "contact-support",
    category: "Account & Support",
    question: "How can I get support?",
    keywords: ["support", "help", "contact", "email", "phone", "call", "hotline", "chat"],
    answer:
      "You can reach us through the Contact page, email us at support@cybershurokkha.com, or call our hotline at +880 1234-56789. We also have a live chat widget on every page for quick assistance.",
  },
];

// ===== Category Filter =====
const categories = ["All", ...new Set(faqData.map((item) => item.category))];

// ===== Stop Words to ignore in search =====
const stopWords = [
  "how", "do", "i", "you", "we", "they", "me", "us", "the", "a", "an",
  "to", "for", "of", "with", "on", "at", "from", "by", "in", "into",
  "what", "when", "where", "which", "who", "whom", "whose", "why",
  "is", "are", "am", "was", "were", "be", "been", "being",
  "have", "has", "had", "does", "did", "will", "would", "could",
  "can", "may", "might", "must", "shall", "should",
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredItems, setFilteredItems] = useState<FAQItem[]>(faqData);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Filter logic with stop word removal
  useEffect(() => {
    let filtered = faqData;
    if (activeCategory !== "All") {
      filtered = filtered.filter((item) => item.category === activeCategory);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();

      // Split into words and remove stop words
      const searchWords = term
        .split(/\s+/)
        .filter((w) => w.length > 0 && !stopWords.includes(w));

      // If no meaningful words left, return all items
      if (searchWords.length === 0) {
        setFilteredItems(filtered);
        return;
      }

      filtered = filtered.filter((item) => {
        const combinedText = (item.question + " " + item.answer).toLowerCase();
        const keywordText = item.keywords.join(" ").toLowerCase();

        // Check if any meaningful word matches
        const textMatch = searchWords.some((word) => combinedText.includes(word));
        const keywordMatch = searchWords.some((word) => keywordText.includes(word));
        const exactMatch = combinedText.includes(term) || keywordText.includes(term);

        return textMatch || keywordMatch || exactMatch;
      });
    }
    setFilteredItems(filtered);
  }, [searchTerm, activeCategory]);

  // Scroll listener for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "4rem 1.5rem", minHeight: "70vh" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <div style={{ display: "inline-block", padding: "0.3rem 1.2rem", borderRadius: "2rem", background: "var(--accent)", color: "white", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.5px", marginBottom: "1rem" }}>
          ❓ Help Center
        </div>
        <h1 style={{ fontSize: "2.8rem", fontWeight: 700, color: "var(--text-dark)", marginBottom: "0.5rem" }}>
          Frequently Asked Questions
        </h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto" }}>
          Find answers to the most common questions about CyberShurokkha 360.
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ maxWidth: "600px", margin: "0 auto 2.5rem" }}>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }}>
            🔍
          </span>
          <input
            type="text"
            placeholder="Search for questions or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "0.9rem 1rem 0.9rem 3rem",
              border: "2px solid var(--border-color)",
              borderRadius: "3rem",
              fontSize: "1rem",
              background: "var(--card-bg)",
              color: "var(--text-primary)",
              transition: "border-color 0.3s",
              outline: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
          />
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "2.5rem" }}>
        {/* Sidebar */}
        <div
          style={{
            position: "sticky",
            top: "5rem",
            alignSelf: "start",
            background: "var(--card-bg)",
            borderRadius: "1rem",
            padding: "1.5rem",
            border: "1px solid var(--card-border)",
            boxShadow: "var(--card-shadow)",
            maxHeight: "calc(100vh - 120px)",
            overflowY: "auto",
          }}
        >
          <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-dark)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "1rem" }}>
            Categories
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "0.5rem 0.8rem",
                  border: "none",
                  borderRadius: "0.5rem",
                  textAlign: "left",
                  cursor: "pointer",
                  background: activeCategory === cat ? "var(--accent)" : "transparent",
                  color: activeCategory === cat ? "white" : "var(--text-secondary)",
                  fontWeight: activeCategory === cat ? 600 : 400,
                  fontSize: "0.9rem",
                  transition: "all 0.2s",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div>
          {filteredItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-secondary)" }}>
              <span style={{ fontSize: "3rem", display: "block", marginBottom: "1rem" }}>🔍</span>
              <h3 style={{ color: "var(--text-dark)" }}>No results found</h3>
              <p>Try adjusting your search or category filter.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  ref={(el) => {
                    itemRefs.current[item.id] = el;
                  }}
                  style={{
                    background: "var(--card-bg)",
                    borderRadius: "1rem",
                    padding: "1.5rem",
                    border: "1px solid var(--card-border)",
                    boxShadow: "var(--card-shadow)",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateX(6px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateX(0)")}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem" }}>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 600, color: "var(--text-dark)", marginBottom: "0.5rem" }}>
                      {item.question}
                    </h3>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        background: "var(--bg-secondary)",
                        padding: "0.15rem 0.6rem",
                        borderRadius: "2rem",
                        color: "var(--text-secondary)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.category}
                    </span>
                  </div>
                  <div style={{ color: "var(--text-secondary)", lineHeight: "1.7", fontSize: "0.95rem", whiteSpace: "pre-wrap" }}>
                    {item.answer}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Back to Top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            padding: "0.8rem 1rem",
            borderRadius: "50%",
            border: "none",
            background: "var(--accent)",
            color: "white",
            fontSize: "1.2rem",
            cursor: "pointer",
            boxShadow: "var(--card-shadow)",
            transition: "all 0.3s",
            zIndex: 100,
          }}
        >
          ↑
        </button>
      )}
    </div>
  );
}