import React from 'react';

/**
 * Privacy Policy page component
 * Provides information about data collection and privacy practices
 */
const Privacy: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2 text-[hsl(var(--nba-blue))] text-center">Privacy Policy</h1>
      <p className="text-center text-sm text-muted-foreground mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-[hsl(var(--nba-blue))]">Introduction</h2>
        <p className="text-base leading-relaxed mb-4">
          At NBA Player Comparison, we respect your privacy and are committed to protecting your
          personal data. This privacy policy will inform you about how we look after your personal
          data when you visit our website and tell you about your privacy rights and how the law
          protects you.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-[hsl(var(--nba-blue))]">Information We Collect</h2>
        <p className="text-base leading-relaxed mb-4">
          We collect minimal information to provide and improve our service. The types of information
          we may collect include:
        </p>
        <ul className="ml-6 mb-4 space-y-3">
          <li className="mb-3">
            <strong className="block mb-1">Usage Data</strong>
            <p className="text-sm">
              Information on how you use our website, including pages visited, time spent on pages,
              and other diagnostic data.
            </p>
          </li>
          <li className="mb-3">
            <strong className="block mb-1">Cookies</strong>
            <p className="text-sm">
              We use cookies and similar tracking technologies to track activity on our website and
              hold certain information. You can instruct your browser to refuse all cookies or to
              indicate when a cookie is being sent.
            </p>
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-[hsl(var(--nba-blue))]">How We Use Your Information</h2>
        <p className="text-base leading-relaxed mb-4">
          We use the information we collect for various purposes, including:
        </p>
        <ul className="ml-6 mb-4 list-disc space-y-2">
          <li>To provide and maintain our service</li>
          <li>To notify you about changes to our service</li>
          <li>To provide customer support</li>
          <li>To gather analysis or valuable information to improve our service</li>
          <li>To monitor the usage of our service</li>
          <li>To detect, prevent, and address technical issues</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-[hsl(var(--nba-blue))]">Data Security</h2>
        <p className="text-base leading-relaxed mb-4">
          The security of your data is important to us, but remember that no method of transmission
          over the Internet or method of electronic storage is 100% secure. While we strive to use
          commercially acceptable means to protect your personal data, we cannot guarantee its
          absolute security.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-[hsl(var(--nba-blue))]">Third-Party Services</h2>
        <p className="text-base leading-relaxed mb-4">
          We may employ third-party companies and individuals to facilitate our service, provide
          the service on our behalf, perform service-related services, or assist us in analyzing
          how our service is used. These third parties have access to your personal data only to
          perform these tasks on our behalf and are obligated not to disclose or use it for any
          other purpose.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-[hsl(var(--nba-blue))]">Changes to This Privacy Policy</h2>
        <p className="text-base leading-relaxed mb-4">
          We may update our Privacy Policy from time to time. We will notify you of any changes by
          posting the new Privacy Policy on this page and updating the "Last Updated" date at the
          top of this Privacy Policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-[hsl(var(--nba-blue))]">Contact Us</h2>
        <p className="text-base leading-relaxed mb-4">
          If you have any questions about this Privacy Policy, please contact us at{' '}
          <a href="mailto:privacy@nbaplayercomparison.com" className="text-[hsl(var(--nba-blue))] font-medium hover:underline">
            privacy@nbaplayercomparison.com
          </a>.
        </p>
      </section>
    </div>
  );
};

export default Privacy;
