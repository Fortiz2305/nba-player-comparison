import pandas as pd
import numpy as np
from typing import List, Dict, Any, Tuple
from ..models.player import PlayerStats, SimilarPlayer
from ..repositories.player_repository import PlayerRepository


class PlayerSimilarityService:
    def __init__(self, player_repository: PlayerRepository):
        self.player_repository = player_repository
        self.df = None
        self.df_norm = None
        self.load_data()
        self.normalize_data()

    def load_data(self) -> None:
        """Load player data from the repository"""
        self.df = self.player_repository.load_players_data()

    def normalize_data(self) -> None:
        """Normalize player statistics for comparison"""
        if self.df is None or self.df.empty:
            self.df_norm = pd.DataFrame()
            return

        # Columns to normalize
        cols_to_norm = [
            'PTS', 'MP', 'FG', 'FGA', 'FG3', 'FG3A', 'FG2', 'FG2A',
            'FT', 'FTA', 'ORB', 'DRB', 'AST', 'STL', 'TOV', 'BLK'
        ]

        # Create a copy of the dataframe
        self.df_norm = self.df.copy()

        # Normalize each column within each season
        for season in self.df_norm['Season'].unique():
            season_mask = self.df_norm['Season'] == season
            for col in cols_to_norm:
                col_data = self.df_norm.loc[season_mask, col]
                min_val = col_data.min()
                max_val = col_data.max()

                # Avoid division by zero
                if max_val > min_val:
                    self.df_norm.loc[season_mask, f'{col}_norm'] = (col_data - min_val) / (max_val - min_val)
                else:
                    self.df_norm.loc[season_mask, f'{col}_norm'] = 0

    def _calculate_distance(self, player_vector: np.ndarray, compared_player_vector: np.ndarray) -> float:
        """Calculate Euclidean distance between two player vectors"""
        return np.sqrt(np.sum((player_vector - compared_player_vector) ** 2))

    def _get_player_stats_vector(self, player_name: str, season: str) -> np.ndarray:
        """Get normalized stats vector for a player"""
        player_data = self.df_norm[(self.df_norm['Player'] == player_name) &
                                   (self.df_norm['Season'] == season)]

        if player_data.empty:
            raise ValueError(f"Player '{player_name}' not found in season {season}")

        # Get normalized stats
        norm_cols = [
            'PTS_norm', 'MP_norm', 'FG_norm', 'FGA_norm', 'FG3_norm', 'FG3A_norm',
            'FG2_norm', 'FG2A_norm', 'FT_norm', 'FTA_norm', 'ORB_norm', 'DRB_norm',
            'AST_norm', 'STL_norm', 'TOV_norm', 'BLK_norm'
        ]

        return player_data[norm_cols].values[0]

    def find_similar_players(self, player_name: str, season: str = "2023_24",
                            num_similar: int = 5) -> Tuple[PlayerStats, List[SimilarPlayer]]:
        """Find players most similar to the given player"""
        print(f"Finding similar players for {player_name} in season {season}")

        if self.df_norm is None or self.df_norm.empty:
            print("Error: No player data available")
            raise ValueError("No player data available")

        try:
            print(f"Looking for player in dataframe with shape: {self.df_norm.shape}")
            print(f"Available seasons: {self.df_norm['Season'].unique().tolist()}")
            print(f"Available players in {season}: {self.df_norm[self.df_norm['Season'] == season]['Player'].unique().tolist()}")

            player_stats_vector = self._get_player_stats_vector(player_name, season)
            print(f"Found player stats vector: {player_stats_vector}")
        except ValueError as e:
            print(f"Error getting player stats vector: {str(e)}")
            raise ValueError(str(e))
        except Exception as e:
            print(f"Unexpected error getting player stats vector: {str(e)}")
            raise

        distances = []

        try:
            for idx, row in self.df_norm.iterrows():
                if row['Player'] == player_name and row['Season'] == season:
                    continue

                compared_player_vector = np.array([
                    row.PTS_norm if hasattr(row, 'PTS_norm') else 0,
                    row.MP_norm if hasattr(row, 'MP_norm') else 0,
                    row.FG_norm if hasattr(row, 'FG_norm') else 0,
                    row.FGA_norm if hasattr(row, 'FGA_norm') else 0,
                    row.FG3_norm if hasattr(row, 'FG3_norm') else 0,
                    row.FG3A_norm if hasattr(row, 'FG3A_norm') else 0,
                    row.FG2_norm if hasattr(row, 'FG2_norm') else 0,
                    row.FG2A_norm if hasattr(row, 'FG2A_norm') else 0,
                    row.FT_norm if hasattr(row, 'FT_norm') else 0,
                    row.FTA_norm if hasattr(row, 'FTA_norm') else 0,
                    row.ORB_norm if hasattr(row, 'ORB_norm') else 0,
                    row.DRB_norm if hasattr(row, 'DRB_norm') else 0,
                    row.AST_norm if hasattr(row, 'AST_norm') else 0,
                    row.STL_norm if hasattr(row, 'STL_norm') else 0,
                    row.TOV_norm if hasattr(row, 'TOV_norm') else 0,
                    row.BLK_norm if hasattr(row, 'BLK_norm') else 0
                ])

                distance = self._calculate_distance(player_stats_vector, compared_player_vector)

                distances.append({
                    'player': row['Player'],
                    'season': row['Season'],
                    'position': row['Pos'],
                    'age': row['Age'],
                    'distance': distance,
                    'idx': idx
                })

            distances.sort(key=lambda x: x['distance'])

            similar_players = []
            for i in range(min(num_similar, len(distances))):
                player_info = distances[i]
                idx = player_info['idx']
                player_row = self.df_norm.loc[idx]

                player_stats = self._row_to_player_stats(player_row)

                similar_player = SimilarPlayer(
                    player=player_info['player'],
                    season=player_info['season'],
                    position=player_info['position'],
                    age=player_info['age'],
                    similarity_score=1.0 - (player_info['distance'] / 4.0),  # Normalize to 0-1 scale
                    stats=player_stats
                )

                similar_players.append(similar_player)

            # Get the query player's stats
            query_player_data = self.df_norm[(self.df_norm['Player'] == player_name) &
                                            (self.df_norm['Season'] == season)]

            if query_player_data.empty:
                raise ValueError(f"Player '{player_name}' not found in season {season}")

            query_player_stats = self._row_to_player_stats(query_player_data.iloc[0])

            print(f"Found {len(similar_players)} similar players")
            return query_player_stats, similar_players

        except Exception as e:
            print(f"Error calculating similar players: {str(e)}")
            raise

    def _row_to_player_stats(self, row: pd.Series) -> PlayerStats:
        """Convert a dataframe row to a PlayerStats object"""
        return PlayerStats(
            player=row['Player'],
            season=row['Season'],
            position=row['Pos'],
            age=row['Age'],
            team=row['Team'],
            games_played=row['G'],
            games_started=row['GS'],
            minutes_per_game=row['MP'],
            points_per_game=row['PTS'],
            field_goals_per_game=row['FG'],
            field_goal_attempts_per_game=row['FGA'],
            field_goal_percentage=row['FG%'],
            three_pointers_per_game=row['FG3'],
            three_point_attempts_per_game=row['FG3A'],
            three_point_percentage=row['FG3%'] if pd.notna(row['FG3%']) else 0.0,
            two_pointers_per_game=row['FG2'],
            two_point_attempts_per_game=row['FG2A'],
            two_point_percentage=row['FG2%'] if pd.notna(row['FG2%']) else 0.0,
            effective_field_goal_percentage=row['eFG%'],
            free_throws_per_game=row['FT'],
            free_throw_attempts_per_game=row['FTA'],
            free_throw_percentage=row['FT%'] if pd.notna(row['FT%']) else 0.0,
            offensive_rebounds_per_game=row['ORB'],
            defensive_rebounds_per_game=row['DRB'],
            total_rebounds_per_game=row['TRB'] if 'TRB' in row else row['ORB'] + row['DRB'],
            assists_per_game=row['AST'],
            steals_per_game=row['STL'],
            blocks_per_game=row['BLK'],
            turnovers_per_game=row['TOV'],
            personal_fouls_per_game=row['PF'],
            player_id=row['Player-additional']
        )

    def get_all_players(self, season: str = None) -> List[Dict[str, Any]]:
        """Get all players, optionally filtered by season"""
        return self.player_repository.get_all_players(season)
