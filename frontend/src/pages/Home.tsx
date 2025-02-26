import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { BarChart3, Users, Info } from 'lucide-react';

/**
 * Home page component
 * Serves as the landing page for the NBA player comparison application
 */
const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-4xl font-bold mb-6 text-[hsl(var(--nba-blue))]">NBA Player Comparison</h1>
      <p className="text-xl mb-8">
        Welcome to the NBA Player Comparison tool. This application allows you to:
      </p>
      <ul className="max-w-2xl mx-auto space-y-4 mb-12">
        <li className="p-4 bg-card rounded-lg shadow-sm">
          Find players with similar statistical profiles
        </li>
        <li className="p-4 bg-card rounded-lg shadow-sm">
          View player clusters based on similar playing styles
        </li>
        <li className="p-4 bg-card rounded-lg shadow-sm">
          Analyze historical and current player data
        </li>
      </ul>

      <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/comparison" className="w-full">
          <Button variant="nba" size="lg" className="w-full h-16 flex items-center justify-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <span>Similar Players</span>
          </Button>
        </Link>

        <Link to="/clusters" className="w-full">
          <Button variant="outline" size="lg" className="w-full h-16 flex items-center justify-center gap-2">
            <Users className="h-5 w-5" />
            <span>Player Clusters</span>
          </Button>
        </Link>

        <Link to="/about" className="w-full">
          <Button variant="secondary" size="lg" className="w-full h-16 flex items-center justify-center gap-2">
            <Info className="h-5 w-5" />
            <span>About</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
