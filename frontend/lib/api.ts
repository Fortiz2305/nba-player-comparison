import { PlayerStats, SimilarPlayersResponse } from '@/types/player';
import { ClusteringResult } from '@/types/cluster';

// Define an interface for the raw player data from the API
interface RawPlayerData {
  Player?: string;
  player?: string;
  Player_ID?: string;
  player_id?: string;
  Season?: string;
  season?: string;
  Pos?: string;
  position?: string;
  Tm?: string;
  Team?: string;
  team?: string;
  Age?: number;
  age?: number;
  G?: number;
  games_played?: number;
  GS?: number;
  games_started?: number;
  MP?: number;
  minutes_per_game?: number;
  PTS?: number;
  points_per_game?: number;
  FG_PCT?: number;
  field_goal_percentage?: number;
  THREE_P_PCT?: number;
  three_point_percentage?: number;
  FT_PCT?: number;
  free_throw_percentage?: number;
  ORB?: number;
  offensive_rebounds_per_game?: number;
  DRB?: number;
  defensive_rebounds_per_game?: number;
  TRB?: number;
  total_rebounds_per_game?: number;
  AST?: number;
  assists_per_game?: number;
  STL?: number;
  steals_per_game?: number;
  BLK?: number;
  blocks_per_game?: number;
  TOV?: number;
  turnovers_per_game?: number;
  PF?: number;
  personal_fouls_per_game?: number;
  [key: string]: string | number | undefined; // For any other properties
}

// Interface for raw similar player data from the API
interface RawSimilarPlayerData {
  player?: string;
  Player?: string;
  season?: string;
  Season?: string;
  position?: string;
  Pos?: string;
  age?: number;
  Age?: number;
  similarity_score?: number;
  stats?: RawPlayerData;
  [key: string]: string | number | RawPlayerData | undefined;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getAllPlayers(season?: string): Promise<PlayerStats[]> {
  const url = new URL(`${API_BASE_URL}/players`);
  if (season) {
    url.searchParams.append('season', season);
  }

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}): ${errorText}`);
      throw new Error(`Failed to fetch players: ${response.statusText}`);
    }

    const data = await response.json();

    const transformedData = data.map((player: RawPlayerData) => ({
      player: player.Player || player.player || '',
      player_id: player.Player_ID || player.player_id || player.Player || player.player || '',
      season: player.Season || player.season || '',
      position: player.Pos || player.position || '',
      team: player.Tm || player.Team || player.team || '',
      age: player.Age || player.age || 0,
      games_played: player.G || player.games_played || 0,
      games_started: player.GS || player.games_started || 0,
      minutes_per_game: player.MP || player.minutes_per_game || 0,
      points_per_game: player.PTS || player.points_per_game || 0,
      field_goal_percentage: player.FG_PCT || player.field_goal_percentage || 0,
      three_point_percentage: player.THREE_P_PCT || player.three_point_percentage || 0,
      free_throw_percentage: player.FT_PCT || player.free_throw_percentage || 0,
      offensive_rebounds_per_game: player.ORB || player.offensive_rebounds_per_game || 0,
      defensive_rebounds_per_game: player.DRB || player.defensive_rebounds_per_game || 0,
      total_rebounds_per_game: player.TRB || player.total_rebounds_per_game || 0,
      assists_per_game: player.AST || player.assists_per_game || 0,
      steals_per_game: player.STL || player.steals_per_game || 0,
      blocks_per_game: player.BLK || player.blocks_per_game || 0,
      turnovers_per_game: player.TOV || player.turnovers_per_game || 0,
      personal_fouls_per_game: player.PF || player.personal_fouls_per_game || 0,
      field_goals_per_game: 0,
      field_goal_attempts_per_game: 0,
      three_pointers_per_game: 0,
      three_point_attempts_per_game: 0,
      two_pointers_per_game: 0,
      two_point_attempts_per_game: 0,
      two_point_percentage: 0,
      effective_field_goal_percentage: 0,
      free_throws_per_game: 0,
      free_throw_attempts_per_game: 0,
    }));

    return transformedData;
  } catch (error) {
    console.error('Error in getAllPlayers:', error);
    throw error;
  }
}

export async function getSeasons(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/players/seasons`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}): ${errorText}`);
      throw new Error(`Failed to fetch seasons: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error in getSeasons:', error);
    throw error;
  }
}

export async function getSimilarPlayers(
  playerName: string,
  season: string = '2023_24',
  numSimilar: number = 5
): Promise<SimilarPlayersResponse> {
  const url = new URL(`${API_BASE_URL}/players/similar`);
  url.searchParams.append('player_name', playerName);
  url.searchParams.append('season', season);
  url.searchParams.append('num_similar', numSimilar.toString());

  try {
    console.log(`Fetching similar players from: ${url.toString()}`);
    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}): ${errorText}`);
      throw new Error(`Failed to fetch similar players: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Similar players response:', data);

    // Transform the data to match our expected format
    const transformPlayerData = (player: RawPlayerData): PlayerStats => ({
      player: player.Player || player.player || '',
      player_id: player.Player_ID || player.player_id || player.Player || player.player || '',
      season: player.Season || player.season || '',
      position: player.Pos || player.position || '',
      team: player.Tm || player.Team || player.team || '',
      age: player.Age || player.age || 0,
      games_played: player.G || player.games_played || 0,
      games_started: player.GS || player.games_started || 0,
      minutes_per_game: player.MP || player.minutes_per_game || 0,
      points_per_game: player.PTS || player.points_per_game || 0,
      field_goal_percentage: player.FG_PCT || player.field_goal_percentage || 0,
      three_point_percentage: player.THREE_P_PCT || player.three_point_percentage || 0,
      free_throw_percentage: player.FT_PCT || player.free_throw_percentage || 0,
      offensive_rebounds_per_game: player.ORB || player.offensive_rebounds_per_game || 0,
      defensive_rebounds_per_game: player.DRB || player.defensive_rebounds_per_game || 0,
      total_rebounds_per_game: player.TRB || player.total_rebounds_per_game || 0,
      assists_per_game: player.AST || player.assists_per_game || 0,
      steals_per_game: player.STL || player.steals_per_game || 0,
      blocks_per_game: player.BLK || player.blocks_per_game || 0,
      turnovers_per_game: player.TOV || player.turnovers_per_game || 0,
      personal_fouls_per_game: player.PF || player.personal_fouls_per_game || 0,
      field_goals_per_game: 0,
      field_goal_attempts_per_game: 0,
      three_pointers_per_game: 0,
      three_point_attempts_per_game: 0,
      two_pointers_per_game: 0,
      two_point_attempts_per_game: 0,
      two_point_percentage: 0,
      effective_field_goal_percentage: 0,
      free_throws_per_game: 0,
      free_throw_attempts_per_game: 0,
    });

    // Transform the query player
    const queryPlayer = transformPlayerData(data.query_player || {});

    // Transform the similar players
    const similarPlayers = (data.similar_players || []).map((player: RawSimilarPlayerData) => ({
      player: player.player || player.Player || '',
      season: player.season || player.Season || '',
      position: player.position || player.Pos || '',
      age: player.age || player.Age || 0,
      similarity_score: player.similarity_score || 0,
      stats: transformPlayerData(player.stats || (player as unknown as RawPlayerData)),
    }));

    return {
      query_player: queryPlayer,
      similar_players: similarPlayers,
    };
  } catch (error) {
    console.error('Error in getSimilarPlayers:', error);
    throw error;
  }
}

export function calculateSkillRatings(player: PlayerStats): {
  scoring: number;
  playmaking: number;
  defense: number;
  athleticism: number;
  basketball_iq: number;
} {
  return {
    scoring: calculateScoringRating(player),
    playmaking: calculatePlaymakingRating(player),
    defense: calculateDefenseRating(player),
    athleticism: calculateAthleticismRating(player),
    basketball_iq: calculateBasketballIQRating(player),
  };
}

function calculateScoringRating(player: PlayerStats): number {
  const ppgWeight = 0.5;
  const fgPctWeight = 0.3;
  const threePtWeight = 0.2;

  const ppgScore = Math.min(player.points_per_game / 30 * 100, 100);
  const fgPctScore = player.field_goal_percentage * 100;
  const threePtScore = player.three_point_percentage * 100;

  return Math.round(
    ppgWeight * ppgScore +
    fgPctWeight * fgPctScore +
    threePtWeight * threePtScore
  );
}

function calculatePlaymakingRating(player: PlayerStats): number {
  const apgWeight = 0.7;
  const toRatioWeight = 0.3;

  const apgScore = Math.min(player.assists_per_game / 10 * 100, 100);
  const toRatio = player.turnovers_per_game > 0
    ? player.assists_per_game / player.turnovers_per_game
    : player.assists_per_game;
  const toRatioScore = Math.min(toRatio / 4 * 100, 100);

  return Math.round(apgWeight * apgScore + toRatioWeight * toRatioScore);
}

function calculateDefenseRating(player: PlayerStats): number {
  const stlWeight = 0.4;
  const blkWeight = 0.4;
  const drbWeight = 0.2;

  const stlScore = Math.min(player.steals_per_game / 2.5 * 100, 100);
  const blkScore = Math.min(player.blocks_per_game / 2.5 * 100, 100);
  const drbScore = Math.min(player.defensive_rebounds_per_game / 8 * 100, 100);

  return Math.round(stlWeight * stlScore + blkWeight * blkScore + drbWeight * drbScore);
}

function calculateAthleticismRating(player: PlayerStats): number {
  const position = player.position;
  let athleticismScore = 0;

  // This is a simplified approximation based on available stats
  const mpgFactor = Math.min(player.minutes_per_game / 36, 1);
  const reboundFactor = player.total_rebounds_per_game / (position.includes('C') ? 12 : position.includes('F') ? 8 : 5);
  const stealBlockFactor = (player.steals_per_game + player.blocks_per_game) / 3;

  athleticismScore = (mpgFactor * 30) + (reboundFactor * 40) + (stealBlockFactor * 30);

  return Math.round(Math.min(athleticismScore, 100));
}

function calculateBasketballIQRating(player: PlayerStats): number {
  const astToRatio = player.turnovers_per_game > 0
    ? player.assists_per_game / player.turnovers_per_game
    : player.assists_per_game;
  const astToScore = Math.min(astToRatio / 4 * 100, 100);

  const fgPctScore = player.field_goal_percentage * 100;
  const ftPctScore = player.free_throw_percentage * 100;

  const foulsPerMinute = player.minutes_per_game > 0
    ? player.personal_fouls_per_game / player.minutes_per_game
    : 0;
  const foulScore = Math.max(100 - (foulsPerMinute * 100 * 36), 0);

  return Math.round((astToScore * 0.4) + (fgPctScore * 0.3) + (ftPctScore * 0.2) + (foulScore * 0.1));
}

export async function getPlayerClusters(
  season: string = '2023_24',
  numClusters: number = 4
): Promise<ClusteringResult> {
  const url = new URL(`${API_BASE_URL}/players/clusters`);
  url.searchParams.append('season', season);
  url.searchParams.append('num_clusters', numClusters.toString());

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}): ${errorText}`);
      throw new Error(`Failed to fetch player clusters: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error in getPlayerClusters:', error);
    throw error;
  }
}
