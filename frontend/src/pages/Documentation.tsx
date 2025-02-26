import React from 'react';

/**
 * Documentation page component
 * Provides usage instructions and documentation for the application
 */
const Documentation: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-[hsl(var(--nba-blue))] text-center">Documentation</h1>

      <section className="mb-10 bg-card p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-4 text-[hsl(var(--nba-blue))] pb-2 border-b">Getting Started</h2>
        <p className="text-base leading-relaxed mb-4">
          Welcome to the NBA Player Comparison tool! This documentation will help you navigate
          and make the most of our application's features.
        </p>
      </section>

      <section className="mb-10 bg-card p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-4 text-[hsl(var(--nba-blue))] pb-2 border-b">Player Comparison</h2>
        <div className="mt-6">
          <h3 className="text-xl font-medium mb-3">How to Compare Players</h3>
          <p className="text-base leading-relaxed mb-4">
            1. Navigate to the Player Comparison page
            2. Enter the names of two NBA players you want to compare
            3. Click the "Compare Players" button
            4. View the detailed statistical comparison
          </p>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-medium mb-3">Available Statistics</h3>
          <p className="text-base leading-relaxed mb-4">
            Our comparison tool includes the following statistical categories:
          </p>
          <ul className="ml-6 mb-4 list-disc">
            <li className="mb-2">Basic stats (points, rebounds, assists, etc.)</li>
            <li className="mb-2">Shooting percentages (FG%, 3P%, FT%)</li>
            <li className="mb-2">Advanced metrics (PER, True Shooting %, Win Shares)</li>
            <li className="mb-2">Defensive metrics (Defensive Rating, Steals, Blocks)</li>
            <li className="mb-2">Career totals and averages</li>
          </ul>
        </div>
      </section>

      <section className="mb-10 bg-card p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-4 text-[hsl(var(--nba-blue))] pb-2 border-b">Player Clusters</h2>
        <p className="text-base leading-relaxed mb-4">
          The Clusters feature groups players with similar statistical profiles and playing styles.
        </p>

        <div className="mt-6">
          <h3 className="text-xl font-medium mb-3">Exploring Clusters</h3>
          <p className="text-base leading-relaxed mb-4">
            1. Navigate to the Clusters page
            2. Browse the different cluster categories
            3. Click on a cluster to view all players in that group
            4. Select individual players to see their detailed statistics
          </p>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-medium mb-3">Cluster Methodology</h3>
          <p className="text-base leading-relaxed mb-4">
            Our clustering algorithm uses k-means clustering on normalized player statistics.
            Players are grouped based on statistical similarities across multiple categories,
            creating meaningful clusters that represent different playing styles and roles.
          </p>
        </div>
      </section>

      <section className="mb-10 bg-card p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-4 text-[hsl(var(--nba-blue))] pb-2 border-b">API Access</h2>
        <p className="text-base leading-relaxed mb-4">
          For developers interested in accessing our data programmatically, we offer a REST API.
          Please contact us for API documentation and access credentials.
        </p>
      </section>

      <section className="mb-10 bg-card p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-4 text-[hsl(var(--nba-blue))] pb-2 border-b">Troubleshooting</h2>
        <p className="text-base leading-relaxed mb-4">
          If you encounter any issues while using the application, please try the following steps:
        </p>
        <ol className="ml-6 mb-4 list-decimal">
          <li className="mb-2">Refresh your browser</li>
          <li className="mb-2">Clear your browser cache</li>
          <li className="mb-2">Try a different browser</li>
          <li className="mb-2">Contact our support team if the issue persists</li>
        </ol>
      </section>
    </div>
  );
};

export default Documentation;
