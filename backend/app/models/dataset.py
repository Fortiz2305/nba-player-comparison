from typing import List, Dict, Any, Optional

class Player:
    def __init__(self, data: Dict[str, Any]):
        self.data = data
        self.normalized_stats = {}

    def __getitem__(self, key: str) -> Any:
        return self.data.get(key)

class PlayerDataset:
    def __init__(self, players: List[Dict[str, Any]]):
        self.players = [Player(player) for player in players]
        self.seasons = set(player["Season"] for player in self.players)
        self.normalized = False

        print(f"PlayerDataset initialized with {len(self.players)} players and {len(self.seasons)} seasons")
        if self.seasons:
            print(f"Seasons in dataset: {sorted(list(self.seasons))}")

    def normalize_data(self) -> None:
        if not self.players:
            print("No players to normalize")
            return

        cols_to_norm = [
            'PTS', 'MP', 'FG', 'FGA', 'FG3', 'FG3A', 'FG2', 'FG2A',
            'FT', 'FTA', 'ORB', 'DRB', 'AST', 'STL', 'TOV', 'BLK'
        ]

        for season in self.seasons:
            season_players = [p for p in self.players if p["Season"] == season]
            for col in cols_to_norm:
                values = []
                for p in season_players:
                    val = p[col]
                    if val is not None:
                        try:
                            if isinstance(val, str) and not val.strip():
                                values.append(0.0)
                            else:
                                values.append(float(val))
                        except (ValueError, TypeError):
                            print(f"Warning: Could not convert value '{val}' for column {col} to float. Using 0.0 instead.")
                            values.append(0.0)
                    else:
                        values.append(0.0)

                min_val = min(values) if values else 0
                max_val = max(values) if values else 0

                if max_val > min_val:
                    for i, player in enumerate(season_players):
                        player.normalized_stats[f"{col}_norm"] = (values[i] - min_val) / (max_val - min_val)
                else:
                    for player in season_players:
                        player.normalized_stats[f"{col}_norm"] = 0.0

        self.normalized = True
        print("Normalization complete")

    def get_player(self, player_name: str, season: str) -> Optional[Player]:
        for player in self.players:
            if player["Player"] == player_name and player["Season"] == season:
                return player

        for player in self.players:
            if player["Player"].lower() == player_name.lower() and player["Season"] == season:
                return player

        return None

    def get_players_by_season(self, season: str) -> List[Player]:
        return [p for p in self.players if p["Season"] == season]

    def get_seasons_list(self) -> List[str]:
        return sorted(list(self.seasons), reverse=True)
