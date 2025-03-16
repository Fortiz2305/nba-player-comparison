import boto3
from boto3.dynamodb.conditions import Key
from decimal import Decimal
from typing import List, Dict, Any, Optional
from .player_repository import PlayerRepository


class DynamoDBPlayerRepository(PlayerRepository):
    def __init__(self, table_name: str = "nba_player_stats"):
        self.dynamodb = boto3.resource('dynamodb')
        self.table = self.dynamodb.Table(table_name)
        self._players_cache = {}
        self._seasons_cache = None

    def get_all_players(self, season: Optional[str] = None) -> List[Dict[str, Any]]:
        cache_key = season if season else "all_seasons"
        if cache_key in self._players_cache:
            return self._players_cache[cache_key]

        items = []

        try:
            if season:
                print(f"DynamoDB: Getting players for season {season}")
                response = self.table.query(
                    KeyConditionExpression=Key('Season').eq(season)
                )
                items = response.get('Items', [])

                while 'LastEvaluatedKey' in response:
                    response = self.table.query(
                        KeyConditionExpression=Key('Season').eq(season),
                        ExclusiveStartKey=response['LastEvaluatedKey']
                    )
                    items.extend(response.get('Items', []))
            else:
                scan_kwargs = {}
                done = False

                while not done:
                    response = self.table.scan(**scan_kwargs)
                    items.extend(response.get('Items', []))

                    if 'LastEvaluatedKey' in response:
                        scan_kwargs['ExclusiveStartKey'] = response['LastEvaluatedKey']
                    else:
                        done = True

            # Process items
            for item in items:
                for key, value in item.items():
                    # Convert Decimal to float
                    if isinstance(value, Decimal):
                        item[key] = float(value)
                    # Handle empty strings
                    elif isinstance(value, str) and not value.strip():
                        if key in ['G', 'GS', 'Age']:
                            item[key] = 0
                        else:
                            item[key] = 0.0

            players = self._aggregate_players_in_same_season(items)

            self._players_cache[cache_key] = players
            return players
        except Exception as e:
            print(f"Error retrieving data from DynamoDB: {e}")
            return []

    def _aggregate_players_in_same_season(self, items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        player_seasons = {}

        for item in items:
            season = item.get('Season', '')
            player = item.get('Player', '')

            if not season or not player:
                continue

            key = (season, player)

            if key not in player_seasons:
                player_seasons[key] = {
                    'Season': season,
                    'Player': player,
                    'Player-additional': item.get('Player-additional', ''),
                    'Pos': item.get('Pos', ''),
                    'Age': self._safe_convert(item.get('Age'), int, 0),
                    'Team': item.get('Team', ''),
                    'G': 0,
                    'GS': 0,
                    'MP': 0.0,
                    'PTS': 0.0,
                    'FG': 0.0,
                    'FGA': 0.0,
                    'FG%': 0.0,
                    'FG3': 0.0,
                    'FG3A': 0.0,
                    'FG3%': 0.0,
                    'FG2': 0.0,
                    'FG2A': 0.0,
                    'FG2%': 0.0,
                    'eFG%': 0.0,
                    'FT': 0.0,
                    'FTA': 0.0,
                    'FT%': 0.0,
                    'ORB': 0.0,
                    'DRB': 0.0,
                    'TRB': 0.0,
                    'AST': 0.0,
                    'STL': 0.0,
                    'BLK': 0.0,
                    'TOV': 0.0,
                    'PF': 0.0,
                    'teams_count': 0
                }

            player_data = player_seasons[key]
            player_data['G'] += self._safe_convert(item.get('G'), int, 0)
            player_data['GS'] += self._safe_convert(item.get('GS'), int, 0)
            player_data['teams_count'] += 1

            for stat in ['MP', 'PTS', 'FG', 'FGA', 'FG%', 'FG3', 'FG3A', 'FG3%',
                         'FG2', 'FG2A', 'FG2%', 'eFG%', 'FT', 'FTA', 'FT%',
                         'ORB', 'DRB', 'TRB', 'AST', 'STL', 'BLK', 'TOV', 'PF']:
                if stat in item:
                    player_data[stat] += self._safe_convert(item.get(stat), float, 0.0)

        # Calculate averages for stats that need to be averaged
        for player_data in player_seasons.values():
            teams_count = player_data.pop('teams_count')
            if teams_count > 0:
                for stat in ['MP', 'PTS', 'FG', 'FGA', 'FG%', 'FG3', 'FG3A', 'FG3%',
                             'FG2', 'FG2A', 'FG2%', 'eFG%', 'FT', 'FTA', 'FT%',
                             'ORB', 'DRB', 'TRB', 'AST', 'STL', 'BLK', 'TOV', 'PF']:
                    player_data[stat] /= teams_count

        return list(player_seasons.values())

    def _safe_convert(self, value, convert_func, default):
        if value is None:
            return default
        if isinstance(value, str) and not value.strip():
            return default
        try:
            return convert_func(value)
        except (ValueError, TypeError):
            return default

    def get_seasons(self) -> List[str]:
        if self._seasons_cache is not None:
            return self._seasons_cache

        try:
            response = self.table.scan(
                ProjectionExpression='Season',
                Select='SPECIFIC_ATTRIBUTES'
            )

            seasons = set()
            for item in response.get('Items', []):
                if 'Season' in item:
                    season = item['Season']
                    if season and isinstance(season, str):
                        seasons.add(season)

            while 'LastEvaluatedKey' in response:
                response = self.table.scan(
                    ProjectionExpression='Season',
                    ExclusiveStartKey=response['LastEvaluatedKey'],
                    Select='SPECIFIC_ATTRIBUTES'
                )

                for item in response.get('Items', []):
                    if 'Season' in item:
                        season = item['Season']
                        if season and isinstance(season, str):
                            seasons.add(season)

            self._seasons_cache = sorted(list(seasons), reverse=True)
            print(f"DynamoDB: All seasons found: {self._seasons_cache}")
            return self._seasons_cache
        except Exception as e:
            print(f"Error retrieving seasons from DynamoDB: {e}")
            return []
