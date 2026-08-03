export default function TermsPage() {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "4rem 1.5rem", minHeight: "70vh" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--text-dark)", marginBottom: "0.5rem" }}>Terms of Service</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>Last updated: August 2026</p>
      
      <div style={{ color: "var(--text-secondary)", lineHeight: "1.8" }}>
        <p>Welcome to <strong>CyberShurokkha 360</strong>. By accessing or using our platform, you agree to comply with these Terms of Service.</p>

        <h3 style={{ marginTop: "2rem", color: "var(--text-dark)", fontWeight: 600 }}>Acceptance of Terms</h3>
        <p>By using CyberShurokkha 360, you acknowledge that you have read, understood, and agreed to these Terms. If you do not agree, please discontinue use of the platform.</p>

        <h3 style={{ marginTop: "2rem", color: "var(--text-dark)", fontWeight: 600 }}>Purpose of the Platform</h3>
        <p>CyberShurokkha 360 provides AI-powered cybersecurity tools, including:</p>
        <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }}>
          <li>Scam message analysis</li>
          <li>URL and QR phishing detection</li>
          <li>Fake job posting analysis</li>
          <li>Community threat reporting</li>
          <li>Threat intelligence visualization</li>
          <li>Cybersecurity education</li>
        </ul>
        <p>These services are provided to assist users in making informed cybersecurity decisions.</p>

        <h3 style={{ marginTop: "2rem", color: "var(--text-dark)", fontWeight: 600 }}>User Responsibilities</h3>
        <p>When using the platform, you agree to:</p>
        <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }}>
          <li>Provide accurate and truthful information</li>
          <li>Submit reports in good faith</li>
          <li>Use the platform only for lawful purposes</li>
          <li>Respect other users and the community</li>
          <li>Refrain from uploading malicious files, harmful content, or illegal material</li>
          <li>Avoid attempting to disrupt, abuse, or compromise platform security</li>
        </ul>

        <h3 style={{ marginTop: "2rem", color: "var(--text-dark)", fontWeight: 600 }}>Community Reporting</h3>
        <p>Reports submitted by users may be reviewed before publication. CyberShurokkha 360 reserves the right to edit, reject, or remove reports that are:</p>
        <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }}>
          <li>False or misleading</li>
          <li>Offensive or abusive</li>
          <li>Spam or promotional content</li>
          <li>In violation of applicable laws</li>
        </ul>

        <h3 style={{ marginTop: "2rem", color: "var(--text-dark)", fontWeight: 600 }}>AI-Based Analysis Disclaimer</h3>
        <p>CyberShurokkha 360 uses machine learning models and automated analysis to evaluate suspicious messages, URLs, QR codes, and job postings.</p>
        <p>Although we continuously improve our detection systems, AI predictions are probabilistic and should not be considered definitive security advice.</p>
        <p>Users should always verify important decisions through official sources and exercise independent judgment.</p>

        <h3 style={{ marginTop: "2rem", color: "var(--text-dark)", fontWeight: 600 }}>Intellectual Property</h3>
        <p>All platform content, software, branding, design, educational materials, and AI-generated reports remain the intellectual property of CyberShurokkha 360 unless otherwise stated.</p>

        <h3 style={{ marginTop: "2rem", color: "var(--text-dark)", fontWeight: 600 }}>Service Availability</h3>
        <p>We strive to maintain reliable service but cannot guarantee uninterrupted availability. Features may be updated, modified, suspended, or discontinued without prior notice.</p>

        <h3 style={{ marginTop: "2rem", color: "var(--text-dark)", fontWeight: 600 }}>Limitation of Liability</h3>
        <p>CyberShurokkha 360 is provided on an "as available" basis. We are not liable for any direct, indirect, incidental, or consequential damages resulting from the use of the platform or reliance on automated analysis.</p>

        <h3 style={{ marginTop: "2rem", color: "var(--text-dark)", fontWeight: 600 }}>Changes to These Terms</h3>
        <p>We may revise these Terms of Service periodically. Continued use of the platform after updates constitutes acceptance of the revised Terms.</p>

        <h3 style={{ marginTop: "2rem", color: "var(--text-dark)", fontWeight: 600 }}>Contact</h3>
        <p>Questions regarding these Terms may be directed through the <a href="/contact" style={{ color: "var(--accent)" }}>Contact page</a>.</p>
      </div>
    </div>
  );
}