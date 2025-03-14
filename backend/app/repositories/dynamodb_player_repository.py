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
        self._seasons_cache = None
        self._players_cache = {}

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
        if self._df is None:
            self._load_data()
        return self._df

    def get_all_players(self, season: Optional[str] = None) -> List[Dict[str, Any]]:
        cache_key = season if season else "all_seasons"
        if cache_key in self._players_cache:
            return self._players_cache[cache_key]

        if season:
            response = self.table.query(
                KeyConditionExpression=Key('Season').eq(season),
                ProjectionExpression='Player, Season, Pos',
                Select='SPECIFIC_ATTRIBUTES'
            )
            items = response.get('Items', [])

            while 'LastEvaluatedKey' in response:
                response = self.table.query(
                    KeyConditionExpression=Key('Season').eq(season),
                    ProjectionExpression='Player, Season, Pos',
                    ExclusiveStartKey=response['LastEvaluatedKey'],
                    Select='SPECIFIC_ATTRIBUTES'
                )
                items.extend(response.get('Items', []))
        else:
            items = []
            scan_kwargs = {
                'ProjectionExpression': 'Player, Season, Pos',
                'Select': 'SPECIFIC_ATTRIBUTES'
            }
            done = False

            while not done:
                response = self.table.scan(**scan_kwargs)
                items.extend(response.get('Items', []))

                if 'LastEvaluatedKey' in response:
                    scan_kwargs['ExclusiveStartKey'] = response['LastEvaluatedKey']
                else:
                    done = True

        players = []
        seen = set()

        for item in items:
            key = (item.get('Player', ''), item.get('Season', ''))
            if key not in seen:
                seen.add(key)
                players.append({
                    'Player': item.get('Player', ''),
                    'Season': item.get('Season', ''),
                    'Pos': item.get('Pos', '')
                })

        self._players_cache[cache_key] = players
        return players

    def get_seasons(self) -> List[str]:
        if self._seasons_cache is not None:
            return self._seasons_cache

        response = self.table.scan(
            ProjectionExpression='Season',
            Select='SPECIFIC_ATTRIBUTES'
        )

        seasons = set()
        for item in response.get('Items', []):
            if 'Season' in item:
                seasons.add(item['Season'])

        while 'LastEvaluatedKey' in response:
            response = self.table.scan(
                ProjectionExpression='Season',
                ExclusiveStartKey=response['LastEvaluatedKey'],
                Select='SPECIFIC_ATTRIBUTES'
            )

            for item in response.get('Items', []):
                if 'Season' in item:
                    seasons.add(item['Season'])

        self._seasons_cache = sorted(list(seasons), reverse=True)
        return self._seasons_cache
