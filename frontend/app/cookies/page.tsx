export default function CookiesPage() {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "4rem 1.5rem", minHeight: "70vh" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--text-dark)", marginBottom: "0.5rem" }}>Cookie Policy</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>Last updated: August 2026</p>
      
      <div style={{ color: "var(--text-secondary)", lineHeight: "1.8" }}>
        <p>Welcome to <strong>CyberShurokkha 360</strong>. This Cookie Policy explains how we use cookies and similar technologies to provide a secure, reliable, and personalized experience while you use our platform.</p>

        <h3 style={{ marginTop: "2rem", color: "var(--text-dark)", fontWeight: 600 }}>What Are Cookies?</h3>
        <p>Cookies are small text files stored on your device by your web browser. They help websites recognize your device, remember your preferences, improve performance, and enhance security.</p>

        <h3 style={{ marginTop: "2rem", color: "var(--text-dark)", fontWeight: 600 }}>How We Use Cookies</h3>

        <h4 style={{ marginTop: "1rem", color: "var(--text-dark)", fontWeight: 500 }}>Essential Cookies</h4>
        <p>These cookies are required for the platform to function correctly. They enable features such as:</p>
        <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }}>
          <li>Secure user authentication</li>
          <li>Maintaining active login sessions</li>
          <li>Protecting against unauthorized access</li>
          <li>Remembering security preferences</li>
          <li>Saving your selected theme and language</li>
        </ul>
        <p>These cookies cannot be disabled because they are necessary for core platform functionality.</p>

        <h4 style={{ marginTop: "1rem", color: "var(--text-dark)", fontWeight: 500 }}>Performance & Analytics Cookies</h4>
        <p>We use privacy-conscious analytics to understand how users interact with CyberShurokkha 360. This information helps us:</p>
        <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }}>
          <li>Improve detection tools</li>
          <li>Optimize website performance</li>
          <li>Identify technical issues</li>
          <li>Enhance user experience</li>
        </ul>
        <p>Analytics data is collected in an aggregated form and is not intended to personally identify individual users.</p>

        <h4 style={{ marginTop: "1rem", color: "var(--text-dark)", fontWeight: 500 }}>Preference Cookies</h4>
        <p>Preference cookies remember your choices so you don't have to configure them every time you visit, including:</p>
        <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }}>
          <li>Theme selection</li>
          <li>Language preference</li>
          <li>Interface settings</li>
          <li>Accessibility preferences</li>
        </ul>

        <h3 style={{ marginTop: "2rem", color: "var(--text-dark)", fontWeight: 600 }}>Security</h3>
        <p>Some cookies help us protect both users and the platform by:</p>
        <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }}>
          <li>Detecting suspicious login activity</li>
          <li>Preventing session hijacking</li>
          <li>Supporting rate limiting and abuse prevention</li>
          <li>Maintaining secure authenticated sessions</li>
        </ul>

        <h3 style={{ marginTop: "2rem", color: "var(--text-dark)", fontWeight: 600 }}>Managing Cookies</h3>
        <p>Most browsers allow you to control or disable cookies through their settings. Please note that disabling essential cookies may affect authentication, saved preferences, and certain platform features.</p>

        <h3 style={{ marginTop: "2rem", color: "var(--text-dark)", fontWeight: 600 }}>Changes to This Policy</h3>
        <p>We may update this Cookie Policy to reflect changes in technology, security practices, or legal requirements. The updated version will always be published on this page with a revised "Last Updated" date.</p>

        <h3 style={{ marginTop: "2rem", color: "var(--text-dark)", fontWeight: 600 }}>Contact</h3>
        <p>If you have questions regarding this Cookie Policy, please contact the CyberShurokkha 360 team through the <a href="/contact" style={{ color: "var(--accent)" }}>Contact page</a>.</p>
      </div>
    </div>
  );
}