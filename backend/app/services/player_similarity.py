from ..models.dataset import Player, PlayerDataset
import numpy as np
from typing import List, Dict, Any, Tuple
from ..models.player import PlayerStats, SimilarPlayer

class PlayerSimilarityService:
    def __init__(self, player_repository):
        self.player_repository = player_repository
        self.dataset = None
        self._data_loaded = False

    def find_similar_players(self, player_name: str, season: str = "2023_24",
                            num_similar: int = 5) -> Tuple[PlayerStats, List[SimilarPlayer]]:
        self.load_data()

        print(f"Finding similar players for {player_name} in season {season}")

        if not self.dataset or not self.dataset.players:
            print("Error: No player data available")
            raise ValueError("No player data available")

        try:
            season_players = self.dataset.get_players_by_season(season)

            if not season_players:
                raise ValueError(f"No players found for season {season}")

            query_player = self.dataset.get_player(player_name, season)
            if not query_player:
                raise ValueError(f"Player '{player_name}' not found in season {season}")

            player_stats_vector = self._get_player_stats_vector(query_player)
        except ValueError as e:
            print(f"Error getting player stats vector: {str(e)}")
            raise ValueError(str(e))
        except Exception as e:
            print(f"Unexpected error getting player stats vector: {str(e)}")
            raise

        distances = []

        try:
            for idx, player in enumerate(self.dataset.players):
                if player["Player"] == player_name and player["Season"] == season:
                    continue

                try:
                    compared_player_vector = self._get_player_stats_vector(player)

                    if compared_player_vector.shape != player_stats_vector.shape:
                        print(f"Warning: Vector shape mismatch for player {player['Player']}: {compared_player_vector.shape} vs {player_stats_vector.shape}")
                        continue

                    distance = self._calculate_distance(player_stats_vector, compared_player_vector)

                    if np.isnan(distance) or np.isinf(distance):
                        print(f"Warning: Invalid distance value for player {player['Player']}: {distance}")
                        continue

                    player_age = 0
                    try:
                        player_age = int(player["Age"]) if player["Age"] is not None else 0
                    except (ValueError, TypeError):
                        print(f"Warning: Could not convert age to int for player {player['Player']}")

                    distances.append({
                        'player': player["Player"],
                        'season': player["Season"],
                        'position': player["Pos"],
                        'age': player_age,
                        'distance': distance,
                        'idx': idx
                    })
                except Exception as e:
                    print(f"Error processing player {player['Player']}: {str(e)}")
                    continue

            if not distances:
                raise ValueError(f"Could not calculate distances for any players similar to {player_name}")

            distances.sort(key=lambda x: x['distance'])

            similar_players = []
            for i in range(min(num_similar, len(distances))):
                player_info = distances[i]
                idx = player_info['idx']
                player_data = self.dataset.players[idx]

                try:
                    player_stats = self._player_to_stats(player_data)

                    similar_player = SimilarPlayer(
                        player=player_info['player'],
                        season=player_info['season'],
                        position=player_info['position'],
                        age=player_info['age'],
                        similarity_score=1.0 - (player_info['distance'] / 4.0),  # Normalize to 0-1 scale
                        stats=player_stats
                    )

                    similar_players.append(similar_player)
                except Exception as e:
                    print(f"Error creating SimilarPlayer for {player_info['player']}: {str(e)}")
                    continue

            query_player_stats = self._player_to_stats(query_player)

            print(f"Found {len(similar_players)} similar players")
            return query_player_stats, similar_players

        except Exception as e:
            print(f"Error calculating similar players: {str(e)}")
            raise

    def load_data(self) -> None:
        if not self._data_loaded:
            try:
                print("Loading player data from repository")
                raw_data = self.player_repository.get_all_players()
                print(f"Loaded {len(raw_data)} players from repository")

                if not raw_data:
                    print("Warning: No player data returned from repository")
                    self.dataset = PlayerDataset([])
                else:
                    self.dataset = PlayerDataset(raw_data)
                    self.dataset.normalize_data()

                self._data_loaded = True
            except Exception as e:
                print(f"Error loading player data: {str(e)}")
                self.dataset = PlayerDataset([])
                self._data_loaded = True
                raise

    def get_all_players(self, season: str = None) -> List[Dict[str, Any]]:
        return self.player_repository.get_all_players(season)

    def get_seasons(self) -> List[str]:
        try:
            seasons = self.player_repository.get_seasons()
            print(f"Retrieved seasons: {seasons}")
            return seasons
        except Exception as e:
            print(f"Error retrieving seasons: {str(e)}")
            raise

    def _calculate_distance(self, player_vector: np.ndarray, compared_player_vector: np.ndarray) -> float:
        return np.sqrt(np.sum((player_vector - compared_player_vector) ** 2))

    def _get_player_stats_vector(self, player: Player) -> np.ndarray:
        norm_cols = [
            'PTS_norm', 'MP_norm', 'FG_norm', 'FGA_norm', 'FG3_norm', 'FG3A_norm',
            'FG2_norm', 'FG2A_norm', 'FT_norm', 'FTA_norm', 'ORB_norm', 'DRB_norm',
            'AST_norm', 'STL_norm', 'TOV_norm', 'BLK_norm'
        ]

        vector = []
        for col in norm_cols:
            try:
                val = player.normalized_stats.get(col, 0.0)
                if isinstance(val, str) and not val.strip():
                    vector.append(0.0)
                else:
                    vector.append(float(val))
            except (ValueError, TypeError) as e:
                print(f"Warning: Could not convert normalized stat '{col}' to float: {e}. Using 0.0 instead.")
                vector.append(0.0)

        return np.array(vector)


    def _player_to_stats(self, player: Player) -> PlayerStats:
        data = player.data

        def safe_convert(value, convert_func, default=0):
            if value is None:
                return default
            if isinstance(value, str) and not value.strip():
                return default
            try:
                return convert_func(value)
            except (ValueError, TypeError):
                return default

        return PlayerStats(
            player=data.get('Player', ''),
            season=data.get('Season', ''),
            position=data.get('Pos', ''),
            age=safe_convert(data.get('Age'), int),
            team=data.get('Team', ''),
            games_played=safe_convert(data.get('G'), int),
            games_started=safe_convert(data.get('GS'), int),
            minutes_per_game=safe_convert(data.get('MP'), float),
            points_per_game=safe_convert(data.get('PTS'), float),
            field_goals_per_game=safe_convert(data.get('FG'), float),
            field_goal_attempts_per_game=safe_convert(data.get('FGA'), float),
            field_goal_percentage=safe_convert(data.get('FG%'), float),
            three_pointers_per_game=safe_convert(data.get('FG3'), float),
            three_point_attempts_per_game=safe_convert(data.get('FG3A'), float),
            three_point_percentage=safe_convert(data.get('FG3%'), float),
            two_pointers_per_game=safe_convert(data.get('FG2'), float),
            two_point_attempts_per_game=safe_convert(data.get('FG2A'), float),
            two_point_percentage=safe_convert(data.get('FG2%'), float),
            effective_field_goal_percentage=safe_convert(data.get('eFG%'), float),
            free_throws_per_game=safe_convert(data.get('FT'), float),
            free_throw_attempts_per_game=safe_convert(data.get('FTA'), float),
            free_throw_percentage=safe_convert(data.get('FT%'), float),
            offensive_rebounds_per_game=safe_convert(data.get('ORB'), float),
            defensive_rebounds_per_game=safe_convert(data.get('DRB'), float),
            total_rebounds_per_game=safe_convert(data.get('TRB'), float) if 'TRB' in data else safe_convert(data.get('ORB'), float) + safe_convert(data.get('DRB'), float),
            assists_per_game=safe_convert(data.get('AST'), float),
            steals_per_game=safe_convert(data.get('STL'), float),
            blocks_per_game=safe_convert(data.get('BLK'), float),
            turnovers_per_game=safe_convert(data.get('TOV'), float),
            personal_fouls_per_game=safe_convert(data.get('PF'), float),
            player_id=data.get('Player-additional', '')
        )
