export interface PlayerStats {
  player: string;
  season: string;
  position: string;
  age: number;
  team: string;
  games_played: number;
  games_started: number;
  minutes_per_game: number;
  points_per_game: number;
  field_goals_per_game: number;
  field_goal_attempts_per_game: number;
  field_goal_percentage: number;
  three_pointers_per_game: number;
  three_point_attempts_per_game: number;
  three_point_percentage: number;
  two_pointers_per_game: number;
  two_point_attempts_per_game: number;
  two_point_percentage: number;
  effective_field_goal_percentage: number;
  free_throws_per_game: number;
  free_throw_attempts_per_game: number;
  free_throw_percentage: number;
  offensive_rebounds_per_game: number;
  defensive_rebounds_per_game: number;
  total_rebounds_per_game: number;
  assists_per_game: number;
  steals_per_game: number;
  blocks_per_game: number;
  turnovers_per_game: number;
  personal_fouls_per_game: number;
  player_id: string;
}

export interface SimilarPlayer {
  player: string;
  season: string;
  position: string;
  age: number;
  similarity_score: number;
  stats: PlayerStats;
}

export interface SimilarPlayersResponse {
  query_player: PlayerStats;
  similar_players: SimilarPlayer[];
}

export interface PlayerSkillRatings {
  scoring: number;
  playmaking: number;
  defense: number;
  athleticism: number;
  basketball_iq: number;
}

export interface PlayerWithSkillRatings extends PlayerStats {
  skillRatings: PlayerSkillRatings;
}

export interface SimilarPlayerWithSkillRatings extends SimilarPlayer {
  skillRatings: PlayerSkillRatings;
}
