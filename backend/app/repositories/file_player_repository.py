import os
import csv
from typing import List, Dict, Any, Optional
from .player_repository import PlayerRepository


class FilePlayerRepository(PlayerRepository):
    def __init__(self, data_dir: str = './data'):
        self.data_dir = data_dir
        self._players = None
        self._seasons = None
        self._load_data()

    def get_all_players(self, season: Optional[str] = None) -> List[Dict[str, Any]]:
        if self._players is None:
            return []

        if season:
            print(f"Getting players for season {season}")
            return [player for player in self._players if player.get('Season') == season]
        else:
            return self._players

    def get_seasons(self) -> List[str]:
        if self._seasons is None:
            return []
        return self._seasons

    def _load_data(self) -> None:
        all_players = []

        for file in os.listdir(self.data_dir):
            if file.endswith('.csv'):
                season = file.replace('.csv', '')
                file_path = os.path.join(self.data_dir, file)
                players = self._load_csv(file_path, season)
                all_players.extend(players)

        if all_players:
            self._players = [player for player in all_players if int(player.get('G', 0)) > 10]
        else:
            self._players = []

        all_seasons = set(player.get('Season', '') for player in self._players)
        print(f"All seasons found: {all_seasons}")

        self._seasons = sorted(list(all_seasons), reverse=True)

    def _load_csv(self, file_path: str, season: str) -> List[Dict[str, Any]]:
        players = []

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    player_data = {}
                    for key, value in row.items():
                        if key != 'Rk':
                            player_data[key] = value

                    # Calculate eFG% if not present
                    if 'eFG%' not in player_data:
                        try:
                            fg = float(player_data.get('FG', 0)) if player_data.get('FG', '').strip() else 0
                            fg3 = float(player_data.get('3P', 0)) if player_data.get('3P', '').strip() else 0
                            fga = float(player_data.get('FGA', 0)) if player_data.get('FGA', '').strip() else 0

                            if fga > 0:
                                player_data['eFG%'] = (fg + 0.5 * fg3) / fga
                            else:
                                player_data['eFG%'] = 0
                        except (ValueError, TypeError) as e:
                            print(f"Error calculating eFG% for player: {e}")
                            player_data['eFG%'] = 0

                    # Rename 3P columns to FG3
                    mapping = {
                        '3P': 'FG3',
                        '3PA': 'FG3A',
                        '3P%': 'FG3%',
                        '2P': 'FG2',
                        '2PA': 'FG2A',
                        '2P%': 'FG2%'
                    }

                    for old_key, new_key in mapping.items():
                        if old_key in player_data:
                            player_data[new_key] = player_data.pop(old_key)

                    # Convert numeric values
                    for key, value in list(player_data.items()):
                        if isinstance(value, str) and value.strip():
                            try:
                                if '.' in value:
                                    player_data[key] = float(value)
                                else:
                                    player_data[key] = int(value)
                            except (ValueError, TypeError):
                                # Keep as string if conversion fails
                                pass
                        elif isinstance(value, str) and not value.strip():
                            if key in ['G', 'GS', 'Age']:
                                player_data[key] = 0
                            elif key in ['Player', 'Pos', 'Team', 'Player-additional', 'Awards']:
                                player_data[key] = ''
                            else:
                                player_data[key] = 0.0

                    # Ensure season is set correctly
                    player_data['Season'] = season
                    players.append(player_data)
        except Exception as e:
            print(f"Error loading CSV file {file_path}: {e}")

        return players
