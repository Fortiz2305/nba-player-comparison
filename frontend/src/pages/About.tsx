import React from 'react';

/**
 * About page component
 * Provides information about the NBA player comparison application
 */
const About: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-[hsl(var(--nba-blue))] text-center">About NBA Player Comparison</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-[hsl(var(--nba-blue))]">Our Mission</h2>
        <p className="text-base leading-relaxed">
          The NBA Player Comparison tool was created to help basketball fans, analysts, and enthusiasts
          explore and compare player statistics in an intuitive and visually appealing way. Our goal is
          to make advanced basketball analytics accessible to everyone, regardless of their statistical
          background.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-[hsl(var(--nba-blue))]">How It Works</h2>
        <p className="text-base leading-relaxed">
          Our application uses data from various NBA seasons to provide comprehensive player comparisons.
          The clustering feature employs machine learning algorithms to group players with similar
          statistical profiles, helping users discover players with comparable playing styles.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-[hsl(var(--nba-blue))]">Data Sources</h2>
        <p className="text-base leading-relaxed">
          All data used in this application is sourced from publicly available NBA statistics.
          The data is updated regularly to ensure accuracy and relevance. Please note that this
          application is for educational and entertainment purposes only.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-[hsl(var(--nba-blue))]">Development Team</h2>
        <p className="text-base leading-relaxed">
          This project was developed by a team of basketball enthusiasts with a passion for data
          visualization and web development. We're constantly working to improve the application
          and add new features.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-[hsl(var(--nba-blue))]">Contact Us</h2>
        <p className="text-base leading-relaxed">
          Have questions, suggestions, or feedback? We'd love to hear from you! Please reach out
          to us at <a href="mailto:contact@nbaplayercomparison.com" className="text-[hsl(var(--nba-blue))] font-medium hover:underline">contact@nbaplayercomparison.com</a>.
        </p>
      </section>
    </div>
  );
};

export default About;
