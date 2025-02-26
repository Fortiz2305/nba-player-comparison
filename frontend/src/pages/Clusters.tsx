import React from 'react';

/**
 * Clusters component
 * Displays player clusters based on similar playing styles and statistics
 */
const Clusters: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-[hsl(var(--nba-blue))] text-center">Player Clusters</h1>
      <p className="text-xl mb-8 text-center max-w-3xl mx-auto">
        Explore groups of NBA players with similar playing styles and statistical profiles.
        Players are clustered based on advanced metrics and performance data.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div className="bg-card rounded-lg p-6 shadow-sm transition-all hover:translate-y-[-5px] hover:shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-[hsl(var(--nba-blue))]">Scoring Guards</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Guards who excel at scoring and creating their own shots.
          </p>
          <button className="px-4 py-2 bg-[hsl(var(--nba-blue))] text-white rounded-md text-sm hover:bg-[hsl(var(--nba-blue))/0.9]">
            View Players
          </button>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm transition-all hover:translate-y-[-5px] hover:shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-[hsl(var(--nba-blue))]">Defensive Specialists</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Players who make their biggest impact on the defensive end.
          </p>
          <button className="px-4 py-2 bg-[hsl(var(--nba-blue))] text-white rounded-md text-sm hover:bg-[hsl(var(--nba-blue))/0.9]">
            View Players
          </button>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm transition-all hover:translate-y-[-5px] hover:shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-[hsl(var(--nba-blue))]">Stretch Bigs</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Big men who can space the floor with outside shooting.
          </p>
          <button className="px-4 py-2 bg-[hsl(var(--nba-blue))] text-white rounded-md text-sm hover:bg-[hsl(var(--nba-blue))/0.9]">
            View Players
          </button>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm transition-all hover:translate-y-[-5px] hover:shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-[hsl(var(--nba-blue))]">Playmaking Forwards</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Forwards who excel at creating for others and handling the ball.
          </p>
          <button className="px-4 py-2 bg-[hsl(var(--nba-blue))] text-white rounded-md text-sm hover:bg-[hsl(var(--nba-blue))/0.9]">
            View Players
          </button>
        </div>
      </div>

      <div className="bg-card rounded-lg p-8 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4 text-[hsl(var(--nba-blue))]">About Clustering</h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          Our clustering algorithm uses machine learning techniques to group players based on
          statistical similarities. The algorithm analyzes dozens of metrics including scoring,
          efficiency, defensive impact, and playing style to create meaningful player clusters.
        </p>
      </div>
    </div>
  );
};

export default Clusters;
