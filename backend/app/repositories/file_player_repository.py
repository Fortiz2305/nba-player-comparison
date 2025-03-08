import os
import pandas as pd
from typing import List, Dict, Any, Optional
from .player_repository import PlayerRepository


class FilePlayerRepository(PlayerRepository):
    def __init__(self, data_dir: str = './data'):
        self.data_dir = data_dir
        self._df = None
        self._load_data()

    def _load_data(self) -> None:
        """Load and process player data from CSV files"""
        all_df_list = []

        for file in os.listdir(self.data_dir):
            if file.endswith('.csv'):
                season = file.replace('.csv', '')
                file_path = os.path.join(self.data_dir, file)

                df = pd.read_csv(file_path, header=0)
                formatted_df = self._format_dataframe(df, season)
                all_df_list.append(formatted_df)

        if all_df_list:
            self._df = pd.concat(all_df_list)
            self._df = self._aggregate_player_in_same_season(self._df)
            self._df = self._df[self._df['G'] > 10]
        else:
            self._df = pd.DataFrame(columns=[
                'Player', 'Season', 'Pos', 'Age', 'Team', 'G', 'GS', 'MP', 'PTS',
                'FG', 'FGA', 'FG%', 'FG3', 'FG3A', 'FG3%', 'FG2', 'FG2A', 'FG2%',
                'eFG%', 'FT', 'FTA', 'FT%', 'ORB', 'DRB', 'TRB', 'AST', 'STL',
                'BLK', 'TOV', 'PF', 'Player-additional'
            ])

    def _format_dataframe(self, df: pd.DataFrame, season: str) -> pd.DataFrame:
        """Format the raw dataframe from CSV"""
        result = df.drop(columns=['Rk'])
        result.insert(loc=1, column='Season', value=season)
        # Calculate effective field goal percentage if not already present
        if 'eFG%' not in result.columns:
            result['eFG%'] = (df['FG'] + 0.5 * df['3P']) / df['FGA']
        # Rename columns for consistency
        result = result.rename(columns={
            '3P': 'FG3', '3PA': 'FG3A', '3P%': 'FG3%',
            '2P': 'FG2', '2PA': 'FG2A', '2P%': 'FG2%'
        })
        return result

    def _aggregate_player_in_same_season(self, df: pd.DataFrame) -> pd.DataFrame:
        """Aggregate stats for players who played for multiple teams in a season"""
        return df.groupby(['Season', 'Player', 'Player-additional', 'Pos', 'Age']).agg({
            'G': 'sum',
            'GS': 'sum',
            'MP': 'mean',
            'PTS': 'mean',
            'FG': 'mean',
            'FGA': 'mean',
            'FG%': 'mean',
            'FG3': 'mean',
            'FG3A': 'mean',
            'FG3%': 'mean',
            'FG2': 'mean',
            'FG2A': 'mean',
            'FG2%': 'mean',
            'FT': 'mean',
            'FTA': 'mean',
            'FT%': 'mean',
            'eFG%': 'mean',
            'ORB': 'mean',
            'DRB': 'mean',
            'TRB': 'mean',
            'AST': 'mean',
            'STL': 'mean',
            'BLK': 'mean',
            'TOV': 'mean',
            'PF': 'mean',
            'Team': 'first'
        }).reset_index()

    def load_players_data(self) -> pd.DataFrame:
        """Return the loaded player data as a DataFrame"""
        return self._df

    def get_all_players(self, season: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get all players, optionally filtered by season"""
        if self._df is None or self._df.empty:
            return []

        if season:
            players_df = self._df[self._df['Season'] == season]
        else:
            players_df = self._df

        players = players_df[['Player', 'Season', 'Pos']].drop_duplicates().to_dict('records')
        return players
