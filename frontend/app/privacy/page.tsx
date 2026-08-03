export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "4rem 1.5rem", minHeight: "70vh" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--text-dark)", marginBottom: "0.5rem" }}>Privacy Policy</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>Last updated: August 2026</p>
      
      <div style={{ color: "var(--text-secondary)", lineHeight: "1.8" }}>
        <p>CyberShurokkha 360 is committed to protecting your privacy and handling your information responsibly. This Privacy Policy explains what information we collect, why we collect it, and how we protect it.</p>

        <h3 style={{ marginTop: "2rem", color: "var(--text-dark)", fontWeight: 600 }}>Information We Collect</h3>
        <p>Depending on how you use the platform, we may collect:</p>
        
        <h4 style={{ marginTop: "1rem", color: "var(--text-dark)", fontWeight: 500 }}>Account Information</h4>
        <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }}>
          <li>Name</li>
          <li>Email address</li>
          <li>Encrypted authentication credentials</li>
          <li>Account preferences</li>
        </ul>

        <h4 style={{ marginTop: "1rem", color: "var(--text-dark)", fontWeight: 500 }}>User Activity</h4>
        <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }}>
          <li>Scam messages submitted for analysis</li>
          <li>URLs and QR codes scanned</li>
          <li>Fake job postings analyzed</li>
          <li>Community scam reports</li>
          <li>Learning Hub progress</li>
          <li>Threat map contributions</li>
        </ul>

        <h4 style={{ marginTop: "1rem", color: "var(--text-dark)", fontWeight: 500 }}>Technical Information</h4>
        <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }}>
          <li>Browser type</li>
          <li>Device information</li>
          <li>IP address (for security purposes)</li>
          <li>Log files</li>
          <li>Session information</li>
          <li>Performance and diagnostic data</li>
        </ul>

        <h3 style={{ marginTop: "2rem", color: "var(--text-dark)", fontWeight: 600 }}>How We Use Your Information</h3>
        <p>We use collected information to:</p>
        <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }}>
          <li>Deliver AI-powered cybersecurity services</li>
          <li>Improve scam detection accuracy</li>
          <li>Detect fraud and platform abuse</li>
          <li>Generate anonymized threat intelligence</li>
          <li>Improve system performance and reliability</li>
          <li>Personalize your platform experience</li>
          <li>Respond to support requests</li>
          <li>Notify users about important security updates (where permitted)</li>
        </ul>

        <h3 style={{ marginTop: "2rem", color: "var(--text-dark)", fontWeight: 600 }}>Community Reports</h3>
        <p>Scam reports displayed on the Threat Map are anonymized before publication. Personally identifiable information is not intentionally displayed publicly.</p>

        <h3 style={{ marginTop: "2rem", color: "var(--text-dark)", fontWeight: 600 }}>Data Security</h3>
        <p>We implement reasonable technical and organizational safeguards to protect user information, including:</p>
        <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }}>
          <li>Secure authentication</li>
          <li>Encrypted communication (HTTPS)</li>
          <li>Access controls</li>
          <li>Database protection</li>
          <li>Security monitoring</li>
          <li>Regular platform updates</li>
        </ul>
        <p>While we work to safeguard your information, no online service can guarantee absolute security.</p>

        <h3 style={{ marginTop: "2rem", color: "var(--text-dark)", fontWeight: 600 }}>Data Sharing</h3>
        <p>CyberShurokkha 360 does not sell your personal information.</p>
        <p>We may share limited information only when:</p>
        <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }}>
          <li>Required by applicable law</li>
          <li>Necessary to protect users or the platform</li>
          <li>Working with trusted service providers who assist in operating the platform under appropriate confidentiality obligations</li>
        </ul>

        <h3 style={{ marginTop: "2rem", color: "var(--text-dark)", fontWeight: 600 }}>Data Retention</h3>
        <p>We retain information only for as long as necessary to provide services, improve detection systems, comply with legal obligations, and maintain platform security.</p>
        <p>Users may request deletion of their accounts and associated personal data, subject to applicable legal and operational requirements.</p>

        <h3 style={{ marginTop: "2rem", color: "var(--text-dark)", fontWeight: 600 }}>Your Rights</h3>
        <p>You may have the right to:</p>
        <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }}>
          <li>Access your personal information</li>
          <li>Correct inaccurate information</li>
          <li>Request deletion of your account</li>
          <li>Withdraw consent where applicable</li>
          <li>Contact us regarding privacy concerns</li>
        </ul>

        <h3 style={{ marginTop: "2rem", color: "var(--text-dark)", fontWeight: 600 }}>Children's Privacy</h3>
        <p>CyberShurokkha 360 is not intended for children under the age required by applicable law without appropriate parental or guardian supervision.</p>

        <h3 style={{ marginTop: "2rem", color: "var(--text-dark)", fontWeight: 600 }}>Changes to This Policy</h3>
        <p>This Privacy Policy may be updated periodically to reflect changes in our services, security practices, or legal obligations. The latest version will always be available on this page.</p>

        <h3 style={{ marginTop: "2rem", color: "var(--text-dark)", fontWeight: 600 }}>Contact</h3>
        <p>If you have questions about this Privacy Policy or your personal information, please contact the CyberShurokkha 360 team through the <a href="/contact" style={{ color: "var(--accent)" }}>Contact page</a>.</p>
      </div>
    </div>
  );
}