import React, { useState, useEffect, useRef } from 'react';
import { usePlayerComparison } from '../hooks/usePlayerComparison';
import { Player } from '../models/player';
import { PlayerComparisonLayout } from './PlayerComparisonLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadarChart } from './ui/radar-chart';
import { BarChart } from './ui/bar-chart';
import { Search, ChevronRight } from 'lucide-react';

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

  const handlePlayerSelect = (value: string) => {
    setSelectedPlayer(value);
  };

  const handleSeasonSelect = (value: string) => {
    setSelectedSeason(value);
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

  // Prepare data for radar chart
  const prepareRadarData = () => {
    if (!similarPlayers) return [];

    const stats = [
      { stat: 'Points', fullName: 'Points Per Game' },
      { stat: 'Rebounds', fullName: 'Rebounds Per Game' },
      { stat: 'Assists', fullName: 'Assists Per Game' },
      { stat: 'Steals', fullName: 'Steals Per Game' },
      { stat: 'Blocks', fullName: 'Blocks Per Game' },
      { stat: '3PT', fullName: '3-Point Percentage' }
    ];

    return stats.map(({ stat, fullName }) => {
      const dataPoint: any = { stat: fullName };

      // Add query player data
      if (stat === 'Points') {
        dataPoint.queryPlayer = similarPlayers.query_player.points_per_game / 30; // Normalize to 0-1
      } else if (stat === 'Rebounds') {
        dataPoint.queryPlayer = similarPlayers.query_player.total_rebounds_per_game / 15; // Normalize to 0-1
      } else if (stat === 'Assists') {
        dataPoint.queryPlayer = similarPlayers.query_player.assists_per_game / 10; // Normalize to 0-1
      } else if (stat === 'Steals') {
        dataPoint.queryPlayer = similarPlayers.query_player.steals_per_game / 3; // Normalize to 0-1
      } else if (stat === 'Blocks') {
        dataPoint.queryPlayer = similarPlayers.query_player.blocks_per_game / 3; // Normalize to 0-1
      } else if (stat === '3PT') {
        dataPoint.queryPlayer = similarPlayers.query_player.three_point_percentage; // Already 0-1
      }

      // Add similar players data (just the first one for simplicity)
      if (similarPlayers.similar_players.length > 0) {
        const similarPlayer = similarPlayers.similar_players[0];
        if (stat === 'Points') {
          dataPoint.similarPlayer = similarPlayer.stats.points_per_game / 30; // Normalize to 0-1
        } else if (stat === 'Rebounds') {
          dataPoint.similarPlayer = similarPlayer.stats.total_rebounds_per_game / 15; // Normalize to 0-1
        } else if (stat === 'Assists') {
          dataPoint.similarPlayer = similarPlayer.stats.assists_per_game / 10; // Normalize to 0-1
        } else if (stat === 'Steals') {
          dataPoint.similarPlayer = similarPlayer.stats.steals_per_game / 3; // Normalize to 0-1
        } else if (stat === 'Blocks') {
          dataPoint.similarPlayer = similarPlayer.stats.blocks_per_game / 3; // Normalize to 0-1
        } else if (stat === '3PT') {
          dataPoint.similarPlayer = similarPlayer.stats.three_point_percentage; // Already 0-1
        }
      }

      return dataPoint;
    });
  };

  // Prepare data for bar chart
  const prepareBarData = () => {
    if (!similarPlayers) return [];

    return similarPlayers.similar_players.map(player => ({
      name: player.player,
      similarity: player.similarity_score * 100,
      points: player.stats.points_per_game,
      rebounds: player.stats.total_rebounds_per_game,
      assists: player.stats.assists_per_game
    }));
  };

  // Sidebar content
  const sidebarContent = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="season" className="text-sm font-medium">Season</label>
          <Select value={selectedSeason} onValueChange={handleSeasonSelect}>
            <SelectTrigger id="season" disabled={isLoading || seasons.length === 0}>
              <SelectValue placeholder="Select season" />
            </SelectTrigger>
            <SelectContent>
              {seasons.map(season => (
                <SelectItem key={season} value={season}>
                  {season.replace('_', '-')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="search" className="text-sm font-medium">Search Player</label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Type to search players..."
              disabled={isLoading || players.length === 0}
              className="w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="player" className="text-sm font-medium">Select Player</label>
          <Select value={selectedPlayer} onValueChange={handlePlayerSelect}>
            <SelectTrigger id="player" disabled={isLoading || filteredPlayers.length === 0}>
              <SelectValue placeholder="Select player" />
            </SelectTrigger>
            <SelectContent>
              {filteredPlayers.map((player, index) => (
                <SelectItem key={`${player.Player}-${player.Season}-${index}`} value={player.Player}>
                  {player.Player} ({player.Pos})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="numSimilar" className="text-sm font-medium">Number of Similar Players</label>
          <input
            type="number"
            id="numSimilar"
            min="1"
            max="20"
            value={numSimilar}
            onChange={handleNumSimilarChange}
            disabled={isLoading}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      <div className="pt-4 border-t">
        <p className="text-sm font-medium mb-3">
          Select a player and season above, then click the button below to find similar players.
        </p>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || !selectedPlayer || !selectedSeason}
          className="w-full h-12 text-base flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white border-2 border-blue-800 shadow-md"
        >
          <Search className="h-5 w-5" />
          {isLoading ? 'Loading...' : 'Find Similar Players'}
        </Button>
      </div>
    </div>
  );

  return (
    <PlayerComparisonLayout sidebar={sidebarContent}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Similar Players Finder</h2>
        </div>

        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {isLoading && (
          <Card>
            <CardContent className="pt-6 flex justify-center items-center h-40">
              <p>Loading...</p>
            </CardContent>
          </Card>
        )}

        {!similarPlayers && !isLoading && !error && (
          <Card>
            <CardContent className="py-12 flex flex-col justify-center items-center">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Find Similar Players</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                Use the sidebar to select a season and player, then click the "Find Similar Players" button to discover players with similar statistical profiles.
              </p>

              <div className="flex flex-col items-center mt-4 w-full max-w-md">
                <div className="flex items-center justify-between w-full mb-4 px-4 py-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Selected Player:</p>
                    <p className="text-muted-foreground">{selectedPlayer || "None selected"}</p>
                  </div>
                  <div>
                    <p className="font-medium">Season:</p>
                    <p className="text-muted-foreground">{selectedSeason.replace('_', '-')}</p>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading || !selectedPlayer || !selectedSeason}
                  className="w-full h-12 text-base bg-blue-700 hover:bg-blue-800 text-white border-2 border-blue-800 shadow-md"
                >
                  {isLoading ? 'Loading...' : 'Find Similar Players'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {similarPlayers && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Player Profile: {similarPlayers.query_player.player}</CardTitle>
                <CardDescription>
                  {similarPlayers.query_player.position} | {similarPlayers.query_player.team} | {similarPlayers.query_player.season.replace('_', '-')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Key Stats</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Points Per Game</span>
                        <span className="font-medium">{similarPlayers.query_player.points_per_game.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rebounds Per Game</span>
                        <span className="font-medium">{similarPlayers.query_player.total_rebounds_per_game.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Assists Per Game</span>
                        <span className="font-medium">{similarPlayers.query_player.assists_per_game.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Field Goal %</span>
                        <span className="font-medium">{(similarPlayers.query_player.field_goal_percentage * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">3-Point %</span>
                        <span className="font-medium">{(similarPlayers.query_player.three_point_percentage * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    {similarPlayers.similar_players.length > 0 && (
                      <RadarChart
                        data={prepareRadarData()}
                        nameKey="stat"
                        dataKeys={[
                          { key: 'queryPlayer', name: similarPlayers.query_player.player, color: 'hsl(var(--nba-blue))' },
                          { key: 'similarPlayer', name: similarPlayers.similar_players[0].player, color: 'hsl(var(--nba-red))' }
                        ]}
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <h3 className="text-2xl font-bold tracking-tight mt-8">Similar Players</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {similarPlayers.similar_players.map((player, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">{player.player}</CardTitle>
                    <CardDescription>
                      {player.position} | {player.season.replace('_', '-')} | Similarity: {(player.similarity_score * 100).toFixed(1)}%
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">PPG</span>
                        <span className="text-sm font-medium">{player.stats.points_per_game.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">RPG</span>
                        <span className="text-sm font-medium">{player.stats.total_rebounds_per_game.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">APG</span>
                        <span className="text-sm font-medium">{player.stats.assists_per_game.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">FG%</span>
                        <span className="text-sm font-medium">{(player.stats.field_goal_percentage * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <span>View Details</span>
                      <ChevronRight className="ml-auto h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Similarity Comparison</CardTitle>
                <CardDescription>
                  Points, rebounds, and assists per game for similar players
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={prepareBarData()}
                  xAxisKey="name"
                  dataKeys={[
                    { key: 'points', name: 'Points Per Game', color: 'hsl(var(--nba-blue))' },
                    { key: 'rebounds', name: 'Rebounds Per Game', color: 'hsl(var(--nba-red))' },
                    { key: 'assists', name: 'Assists Per Game', color: 'hsl(var(--primary))' }
                  ]}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PlayerComparisonLayout>
  );
};

export default PlayerComparison;
