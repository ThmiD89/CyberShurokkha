export default function FAQPage() {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "4rem 1.5rem", minHeight: "70vh" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--text-dark)", marginBottom: "0.5rem" }}>Frequently Asked Questions</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>Find answers to the most common questions about CyberShurokkha 360.</p>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div style={{ background: "var(--card-bg)", padding: "1.5rem", borderRadius: "1rem", border: "1px solid var(--card-border)" }}>
          <h3 style={{ fontWeight: 600, color: "var(--text-dark)", marginBottom: "0.5rem" }}>What is CyberShurokkha 360?</h3>
          <p style={{ color: "var(--text-secondary)" }}>It's an AI-powered platform that helps detect scams, phishing URLs, fraudulent job postings, and suspicious log files – built for Bangladesh.</p>
        </div>
        
        <div style={{ background: "var(--card-bg)", padding: "1.5rem", borderRadius: "1rem", border: "1px solid var(--card-border)" }}>
          <h3 style={{ fontWeight: 600, color: "var(--text-dark)", marginBottom: "0.5rem" }}>Is it free to use?</h3>
          <p style={{ color: "var(--text-secondary)" }}>Yes, all tools are completely free for everyone.</p>
        </div>
        
        <div style={{ background: "var(--card-bg)", padding: "1.5rem", borderRadius: "1rem", border: "1px solid var(--card-border)" }}>
          <h3 style={{ fontWeight: 600, color: "var(--text-dark)", marginBottom: "0.5rem" }}>How do I report a scam?</h3>
          <p style={{ color: "var(--text-secondary)" }}>Go to the "Report Incident" page, fill in the details, and submit. Our team will review it.</p>
        </div>
        
        <div style={{ background: "var(--card-bg)", padding: "1.5rem", borderRadius: "1rem", border: "1px solid var(--card-border)" }}>
          <h3 style={{ fontWeight: 600, color: "var(--text-dark)", marginBottom: "0.5rem" }}>How accurate is the AI?</h3>
          <p style={{ color: "var(--text-secondary)" }}>Our models are trained on thousands of scam patterns and continuously improved. Always use common sense alongside AI results.</p>
        </div>
        
        <div style={{ background: "var(--card-bg)", padding: "1.5rem", borderRadius: "1rem", border: "1px solid var(--card-border)" }}>
          <h3 style={{ fontWeight: 600, color: "var(--text-dark)", marginBottom: "0.5rem" }}>How is my data protected?</h3>
          <p style={{ color: "var(--text-secondary)" }}>We use encryption, secure authentication, and strict access controls. Your privacy is our priority. Read our <a href="/privacy" style={{ color: "var(--accent)" }}>Privacy Policy</a> for details.</p>
        </div>
      </div>
    </div>
  );
}