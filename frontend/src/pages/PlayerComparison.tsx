import React from 'react';
import PlayerComparisonComponent from '../components/PlayerComparison';

/**
 * PlayerComparison component
 * Allows users to compare statistics between NBA players
 */
const PlayerComparison: React.FC = () => {
  return (
    <div className="page player-comparison-page">
      <h1>Player Comparison</h1>
      <p>
        Find NBA players with similar statistical profiles using our advanced comparison tool.
        Select a player and season to see which other players throughout NBA history have
        similar playing styles and statistical output.
      </p>
      <PlayerComparisonComponent />
    </div>
  );
};

export default PlayerComparison;
