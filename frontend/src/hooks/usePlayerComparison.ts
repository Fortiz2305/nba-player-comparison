import { useState, useEffect, useCallback } from 'react';
import {
  SimilarPlayersResponse,
  Player
} from '../models/player';

// API base URL
const API_BASE_URL = 'http://localhost:8000';

export const usePlayerComparison = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [seasons, setSeasons] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [similarPlayers, setSimilarPlayers] = useState<SimilarPlayersResponse | null>(null);

  // Fetch all players - memoized with useCallback
  const fetchPlayers = useCallback(async (season?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const url = season
        ? `${API_BASE_URL}/players?season=${encodeURIComponent(season)}`
        : `${API_BASE_URL}/players`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch players: ${response.statusText}`);
      }

      const data = await response.json();
      setPlayers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch all seasons - memoized with useCallback
  const fetchSeasons = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/players/seasons`);

      if (!response.ok) {
        throw new Error(`Failed to fetch seasons: ${response.statusText}`);
      }

      const data = await response.json();
      setSeasons(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Find similar players - memoized with useCallback
  const findSimilarPlayers = useCallback(async (playerName: string, season: string = '2023_24', numSimilar: number = 5) => {
    setIsLoading(true);
    setError(null);
    setSimilarPlayers(null);

    try {
      const url = `${API_BASE_URL}/players/similar?player_name=${encodeURIComponent(playerName)}&season=${encodeURIComponent(season)}&num_similar=${numSimilar}`;

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to find similar players: ${response.statusText}`);
      }

      const data = await response.json();
      setSimilarPlayers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load seasons on initial mount
  useEffect(() => {
    fetchSeasons();
  }, [fetchSeasons]);

  return {
    players,
    seasons,
    isLoading,
    error,
    similarPlayers,
    fetchPlayers,
    fetchSeasons,
    findSimilarPlayers
  };
};
