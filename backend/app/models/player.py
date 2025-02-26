from pydantic import BaseModel
from typing import List, Optional


class PlayerStats(BaseModel):
    player: str
    season: str
    position: str
    age: int
    team: str
    games_played: int
    games_started: int
    minutes_per_game: float
    points_per_game: float
    field_goals_per_game: float
    field_goal_attempts_per_game: float
    field_goal_percentage: float
    three_pointers_per_game: float
    three_point_attempts_per_game: float
    three_point_percentage: float
    two_pointers_per_game: float
    two_point_attempts_per_game: float
    two_point_percentage: float
    effective_field_goal_percentage: float
    free_throws_per_game: float
    free_throw_attempts_per_game: float
    free_throw_percentage: float
    offensive_rebounds_per_game: float
    defensive_rebounds_per_game: float
    total_rebounds_per_game: float
    assists_per_game: float
    steals_per_game: float
    blocks_per_game: float
    turnovers_per_game: float
    personal_fouls_per_game: float
    player_id: str


class SimilarPlayer(BaseModel):
    player: str
    season: str
    position: str
    age: int
    similarity_score: float
    stats: PlayerStats


class SimilarPlayersResponse(BaseModel):
    query_player: PlayerStats
    similar_players: List[SimilarPlayer]


class PlayerQuery(BaseModel):
    player_name: str
    season: str = "2023_24"
    num_similar: int = 5
