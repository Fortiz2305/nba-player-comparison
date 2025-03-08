import boto3
from boto3.dynamodb.conditions import Key
from decimal import Decimal
import pandas as pd
from typing import List, Dict, Any, Optional
from .player_repository import PlayerRepository


class DynamoDBPlayerRepository(PlayerRepository):
    def __init__(self, table_name: str = "nba_player_stats"):
        self.dynamodb = boto3.resource('dynamodb')
        self.table = self.dynamodb.Table(table_name)
        self._df = None
        self._load_data()

    def _load_data(self) -> None:
        """Load and process player data from DynamoDB"""
        items = []

        scan_kwargs = {}
        done = False

        while not done:
            response = self.table.scan(**scan_kwargs)
            items.extend(response.get('Items', []))

            if 'LastEvaluatedKey' in response:
                scan_kwargs['ExclusiveStartKey'] = response['LastEvaluatedKey']
            else:
                done = True

        if items:
            for item in items:
                for key, value in item.items():
                    if isinstance(value, Decimal):
                        item[key] = float(value)

            self._df = pd.DataFrame(items)

            self._df = self._aggregate_player_in_same_season(self._df)
            self._df = self._df[self._df['G'] > 10]
        else:
            self._df = pd.DataFrame(columns=[
                'Player', 'Season', 'Pos', 'Age', 'Team', 'G', 'GS', 'MP', 'PTS',
                'FG', 'FGA', 'FG%', 'FG3', 'FG3A', 'FG3%', 'FG2', 'FG2A', 'FG2%',
                'eFG%', 'FT', 'FTA', 'FT%', 'ORB', 'DRB', 'TRB', 'AST', 'STL',
                'BLK', 'TOV', 'PF', 'Player-additional'
            ])

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
