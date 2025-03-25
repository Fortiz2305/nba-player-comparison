from ..models.dataset import PlayerDataset
import numpy as np
from typing import List, Dict, Any, Tuple, Optional
from ..models.player import PlayerStats
from ..models.cluster import PlayerCluster, ClusteringResult


class ClusteringService:
    def __init__(self, player_repository):
        self.player_repository = player_repository
        self.dataset = None
        self._data_loaded = False

    def get_clustering(self, season: str = "2023_24", num_clusters: int = 8) -> ClusteringResult:
        try:
            print(f"Getting clustering for season {season} with {num_clusters} clusters")
            return self.cluster_players(season, num_clusters)
        except Exception as e:
            print(f"Error getting clustering: {str(e)}")
            raise

    def cluster_players(self, season: str = "2023_24", num_clusters: int = 8, max_iterations: int = 100) -> ClusteringResult:
        self.load_data()

        print(f"Clustering players for season {season} into {num_clusters} clusters")

        if not self.dataset or not self.dataset.players:
            raise ValueError("No player data available")

        try:
            season_players = self.dataset.get_players_by_season(season)
            if not season_players:
                raise ValueError(f"No players found for season {season}")

            min_games = 10
            filtered_players = [p for p in season_players if self._safe_convert(p["G"], int, 0) > min_games]
            if not filtered_players:
                raise ValueError(f"No players with more than {min_games} games found for season {season}")

            print(f"Found {len(filtered_players)} players for season {season} with more than {min_games} games")

            player_data, player_indices = self._prepare_data_for_clustering(filtered_players)
            clusters, centroids = self._run_kmeans(player_data, num_clusters, max_iterations)

            return self._format_clustering_results(clusters, centroids, filtered_players, player_indices, season, num_clusters)

        except Exception as e:
            raise

    def load_data(self) -> None:
        if not self._data_loaded:
            try:
                raw_data = self.player_repository.get_all_players()
                print(f"Loaded {len(raw_data)} players from repository")

                if not raw_data:
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

    def get_seasons(self) -> List[str]:
        try:
            seasons = self.player_repository.get_seasons()
            return seasons
        except Exception as e:
            print(f"Error retrieving seasons: {str(e)}")
            raise

    def _prepare_data_for_clustering(self, players: List) -> Tuple[np.ndarray, List[int]]:
        norm_cols = [
            'PTS_norm', 'MP_norm', 'FG_norm', 'FGA_norm', 'FG3_norm', 'FG3A_norm',
            'FG2_norm', 'FG2A_norm', 'FT_norm', 'FTA_norm', 'ORB_norm', 'DRB_norm',
            'AST_norm', 'STL_norm', 'TOV_norm', 'BLK_norm'
        ]

        data = []
        valid_indices = []

        for i, player in enumerate(players):
            player_stats = []

            for col in norm_cols:
                try:
                    val = player.normalized_stats.get(col, 0.0)
                    if isinstance(val, str) and not val.strip():
                        player_stats.append(0.0)
                    else:
                        player_stats.append(float(val))
                except (ValueError, TypeError) as e:
                    print(f"Warning: Could not convert normalized stat '{col}' to float: {e}. Using 0.0 instead.")
                    player_stats.append(0.0)

            if np.isnan(np.sum(player_stats)) or np.isinf(np.sum(player_stats)):
                continue

            data.append(player_stats)
            valid_indices.append(i)

        if not data:
            raise ValueError("No valid player data available for clustering")

        data_array = np.array(data)
        min_vals = np.min(data_array, axis=0)
        max_vals = np.max(data_array, axis=0)

        range_vals = max_vals - min_vals
        range_vals[range_vals == 0] = 1

        scaled_data = ((data_array - min_vals) / range_vals) * 9 + 1

        return scaled_data, valid_indices

    def _run_kmeans(self, data: np.ndarray, k: int, max_iterations: int) -> Tuple[np.ndarray, np.ndarray]:
        centroid_indices = np.random.choice(data.shape[0], k, replace=False)
        centroids = data[centroid_indices]

        clusters = np.zeros(data.shape[0], dtype=int)
        old_centroids = np.zeros_like(centroids)

        iteration = 0
        converged = False

        while iteration < max_iterations and not converged:
            for i in range(data.shape[0]):
                distances = np.sqrt(np.sum((data[i] - centroids) ** 2, axis=1))
                clusters[i] = np.argmin(distances)

            old_centroids = centroids.copy()

            for j in range(k):
                if np.sum(clusters == j) > 0:
                    cluster_points = data[clusters == j]
                    epsilon = 1e-10
                    centroids[j] = np.exp(np.mean(np.log(cluster_points + epsilon), axis=0))

            converged = np.all(np.abs(centroids - old_centroids) < 1e-4)

            iteration += 1
            print(f"K-means iteration {iteration}, converged: {converged}")

        return clusters, centroids

    def _format_clustering_results(self, clusters: np.ndarray, centroids: np.ndarray,
                                  players: List, player_indices: List[int],
                                  season: str, num_clusters: int) -> ClusteringResult:
        cluster_results = []

        stats_cols = [
            'PTS', 'MP', 'FG', 'FGA', 'FG3', 'FG3A',
            'FG2', 'FG2A', 'FT', 'FTA', 'ORB', 'DRB',
            'AST', 'STL', 'TOV', 'BLK'
        ]

        for cluster_id in range(num_clusters):
            cluster_player_indices = [idx for i, idx in enumerate(player_indices) if clusters[i] == cluster_id]

            if not cluster_player_indices:
                continue

            cluster_players = []
            for idx in cluster_player_indices:
                player = players[idx]
                player_stats = self._player_to_stats(player)
                cluster_players.append(player_stats)

            centroid_dict = {}
            for i, stat in enumerate(stats_cols):
                if i < len(centroids[cluster_id]):
                    centroid_dict[stat] = float(centroids[cluster_id][i])

            cluster_results.append(
                PlayerCluster(
                    cluster_id=cluster_id,
                    players=sorted(cluster_players, key=lambda x: x.points_per_game, reverse=True),
                    centroid=centroid_dict
                )
            )

        return ClusteringResult(
            clusters=sorted(cluster_results, key=lambda x: len(x.players), reverse=True),
            season=season,
            num_clusters=num_clusters
        )

    def _player_to_stats(self, player) -> PlayerStats:
        data = player.data

        return PlayerStats(
            player=data.get('Player', ''),
            season=data.get('Season', ''),
            position=data.get('Pos', ''),
            age=self._safe_convert(data.get('Age'), int),
            team=data.get('Team', ''),
            games_played=self._safe_convert(data.get('G'), int),
            games_started=self._safe_convert(data.get('GS'), int),
            minutes_per_game=self._safe_convert(data.get('MP'), float),
            points_per_game=self._safe_convert(data.get('PTS'), float),
            field_goals_per_game=self._safe_convert(data.get('FG'), float),
            field_goal_attempts_per_game=self._safe_convert(data.get('FGA'), float),
            field_goal_percentage=self._safe_convert(data.get('FG%'), float),
            three_pointers_per_game=self._safe_convert(data.get('FG3'), float),
            three_point_attempts_per_game=self._safe_convert(data.get('FG3A'), float),
            three_point_percentage=self._safe_convert(data.get('FG3%'), float),
            two_pointers_per_game=self._safe_convert(data.get('FG2'), float),
            two_point_attempts_per_game=self._safe_convert(data.get('FG2A'), float),
            two_point_percentage=self._safe_convert(data.get('FG2%'), float),
            effective_field_goal_percentage=self._safe_convert(data.get('eFG%'), float),
            free_throws_per_game=self._safe_convert(data.get('FT'), float),
            free_throw_attempts_per_game=self._safe_convert(data.get('FTA'), float),
            free_throw_percentage=self._safe_convert(data.get('FT%'), float),
            offensive_rebounds_per_game=self._safe_convert(data.get('ORB'), float),
            defensive_rebounds_per_game=self._safe_convert(data.get('DRB'), float),
            total_rebounds_per_game=self._safe_convert(data.get('TRB'), float) if 'TRB' in data else
                                  self._safe_convert(data.get('ORB'), float) + self._safe_convert(data.get('DRB'), float),
            assists_per_game=self._safe_convert(data.get('AST'), float),
            steals_per_game=self._safe_convert(data.get('STL'), float),
            blocks_per_game=self._safe_convert(data.get('BLK'), float),
            turnovers_per_game=self._safe_convert(data.get('TOV'), float),
            personal_fouls_per_game=self._safe_convert(data.get('PF'), float),
            player_id=data.get('Player-additional', '')
        )

    def _safe_convert(self, value, convert_func, default=0):
        if value is None:
            return default
        if isinstance(value, str) and not value.strip():
            return default
        try:
            return convert_func(value)
        except (ValueError, TypeError):
            return default
