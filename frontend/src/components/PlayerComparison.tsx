import React, { useState, useEffect, useRef } from 'react';
import { usePlayerComparison } from '../hooks/usePlayerComparison';
import { Player } from '../models/player';
import './PlayerComparison.css';

const PlayerComparison: React.FC = () => {
  const {
    players,
    seasons,
    isLoading,
    error,
    similarPlayers,
    fetchPlayers,
    findSimilarPlayers
  } = usePlayerComparison();

  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [selectedSeason, setSelectedSeason] = useState<string>('2023_24');
  const [numSimilar, setNumSimilar] = useState<number>(5);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Use a ref to track if we've already fetched players for this season
  const fetchedSeasonsRef = useRef<Set<string>>(new Set());

  // Fetch players for the selected season, but only once per season
  useEffect(() => {
    if (selectedSeason && !fetchedSeasonsRef.current.has(selectedSeason)) {
      fetchedSeasonsRef.current.add(selectedSeason);
      fetchPlayers(selectedSeason);
    }
  }, [selectedSeason, fetchPlayers]);

  // Filter players based on search term
  useEffect(() => {
    if (players.length > 0 && searchTerm) {
      const filtered = players.filter(player =>
        player.Player.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPlayers(filtered);
    } else {
      setFilteredPlayers(players);
    }
  }, [players, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePlayerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlayer(e.target.value);
  };

  const handleSeasonSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSeason(e.target.value);
  };

  const handleNumSimilarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumSimilar(parseInt(e.target.value, 10));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlayer && selectedSeason) {
      findSimilarPlayers(selectedPlayer, selectedSeason, numSimilar);
    }
  };

  return (
    <div className="player-comparison">
      <h2>NBA Player Comparison</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="season">Season:</label>
          <select
            id="season"
            value={selectedSeason}
            onChange={handleSeasonSelect}
            disabled={isLoading || seasons.length === 0}
          >
            {seasons.map(season => (
              <option key={season} value={season}>{season.replace('_', '-')}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="search">Search Player:</label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Type to search players..."
            disabled={isLoading || players.length === 0}
          />
        </div>

        <div className="form-group">
          <label htmlFor="player">Select Player:</label>
          <select
            id="player"
            value={selectedPlayer}
            onChange={handlePlayerSelect}
            disabled={isLoading || filteredPlayers.length === 0}
          >
            <option value="">-- Select a player --</option>
            {filteredPlayers.map((player, index) => (
              <option key={`${player.Player}-${player.Season}-${index}`} value={player.Player}>
                {player.Player} ({player.Pos})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="numSimilar">Number of Similar Players:</label>
          <input
            type="number"
            id="numSimilar"
            min="1"
            max="20"
            value={numSimilar}
            onChange={handleNumSimilarChange}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !selectedPlayer || !selectedSeason}
        >
          {isLoading ? 'Loading...' : 'Find Similar Players'}
        </button>
      </form>

      {isLoading && <div className="loading">Loading...</div>}

      {similarPlayers && (
        <div className="results">
          <h3>Results for {similarPlayers.query_player.player}</h3>

          <div className="query-player">
            <h4>Selected Player Stats</h4>
            <table>
              <thead>
                <tr>
                  <th>Season</th>
                  <th>Team</th>
                  <th>Pos</th>
                  <th>Age</th>
                  <th>GP</th>
                  <th>MPG</th>
                  <th>PPG</th>
                  <th>RPG</th>
                  <th>APG</th>
                  <th>SPG</th>
                  <th>BPG</th>
                  <th>FG%</th>
                  <th>3P%</th>
                  <th>FT%</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{similarPlayers.query_player.season.replace('_', '-')}</td>
                  <td>{similarPlayers.query_player.team}</td>
                  <td>{similarPlayers.query_player.position}</td>
                  <td>{similarPlayers.query_player.age}</td>
                  <td>{similarPlayers.query_player.games_played}</td>
                  <td>{similarPlayers.query_player.minutes_per_game.toFixed(1)}</td>
                  <td>{similarPlayers.query_player.points_per_game.toFixed(1)}</td>
                  <td>{similarPlayers.query_player.total_rebounds_per_game.toFixed(1)}</td>
                  <td>{similarPlayers.query_player.assists_per_game.toFixed(1)}</td>
                  <td>{similarPlayers.query_player.steals_per_game.toFixed(1)}</td>
                  <td>{similarPlayers.query_player.blocks_per_game.toFixed(1)}</td>
                  <td>{(similarPlayers.query_player.field_goal_percentage * 100).toFixed(1)}%</td>
                  <td>{(similarPlayers.query_player.three_point_percentage * 100).toFixed(1)}%</td>
                  <td>{(similarPlayers.query_player.free_throw_percentage * 100).toFixed(1)}%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4>Similar Players</h4>
          <table>
            <thead>
              <tr>
                <th>Player</th>
                <th>Season</th>
                <th>Team</th>
                <th>Pos</th>
                <th>Age</th>
                <th>Similarity</th>
                <th>PPG</th>
                <th>RPG</th>
                <th>APG</th>
                <th>SPG</th>
                <th>BPG</th>
                <th>FG%</th>
                <th>3P%</th>
                <th>FT%</th>
              </tr>
            </thead>
            <tbody>
              {similarPlayers.similar_players.map((player, index) => (
                <tr key={`${player.player}-${player.season}-${index}`}>
                  <td>{player.player}</td>
                  <td>{player.season.replace('_', '-')}</td>
                  <td>{player.stats.team}</td>
                  <td>{player.position}</td>
                  <td>{player.age}</td>
                  <td>{(player.similarity_score * 100).toFixed(1)}%</td>
                  <td>{player.stats.points_per_game.toFixed(1)}</td>
                  <td>{player.stats.total_rebounds_per_game.toFixed(1)}</td>
                  <td>{player.stats.assists_per_game.toFixed(1)}</td>
                  <td>{player.stats.steals_per_game.toFixed(1)}</td>
                  <td>{player.stats.blocks_per_game.toFixed(1)}</td>
                  <td>{(player.stats.field_goal_percentage * 100).toFixed(1)}%</td>
                  <td>{(player.stats.three_point_percentage * 100).toFixed(1)}%</td>
                  <td>{(player.stats.free_throw_percentage * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PlayerComparison;
