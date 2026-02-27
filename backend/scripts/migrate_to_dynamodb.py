import boto3
import pandas as pd
import os
import sys
from decimal import Decimal

# Add the parent directory to the path so we can import from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.repositories.file_player_repository import FilePlayerRepository


def create_dynamodb_table(table_name):
    """Create the DynamoDB table if it doesn't exist"""
    dynamodb = boto3.resource('dynamodb', region_name='eu-west-1')

    existing_tables = [table.name for table in dynamodb.tables.all()]
    if table_name in existing_tables:
        print(f"Table {table_name} already exists")
        return

    table = dynamodb.create_table(
        TableName=table_name,
        KeySchema=[
            {
                'AttributeName': 'Season',
                'KeyType': 'HASH'
            },
            {
                'AttributeName': 'Player',
                'KeyType': 'RANGE'
            }
        ],
        AttributeDefinitions=[
            {
                'AttributeName': 'Season',
                'AttributeType': 'S'
            },
            {
                'AttributeName': 'Player',
                'AttributeType': 'S'
            }
        ],
        BillingMode='PAY_PER_REQUEST'
    )

    table.meta.client.get_waiter('table_exists').wait(TableName=table_name)
    print(f"Table {table_name} created successfully")
    return table


def migrate_data_to_dynamodb(data_dir, table_name, seasons=None):
    """Migrate data from CSV files to DynamoDB"""
    create_dynamodb_table(table_name)

    dynamodb = boto3.resource('dynamodb', region_name='eu-west-1')
    table = dynamodb.Table(table_name)

    file_repo = FilePlayerRepository(data_dir)
    players_data = file_repo.get_all_players()

    items_processed = 0
    items_failed = 0
    seasons_to_migrate = seasons if seasons else ['2024_25', '2025_26']

    print(f"Migrating seasons: {seasons_to_migrate}")
    print(f"Total players loaded from CSV: {len(players_data)}")

    season_counts = {}
    for season in seasons_to_migrate:
        season_counts[season] = 0

    for player in players_data:
        try:
            item = player.copy()
            season = item.get('Season')

            if season not in seasons_to_migrate:
                continue

            for key, value in list(item.items()):
                if pd.isna(value):
                    item[key] = None
                elif isinstance(value, (int, float)):
                    item[key] = Decimal(str(value))

            table.put_item(Item=item)
            items_processed += 1
            season_counts[season] += 1

            if items_processed % 100 == 0:
                print(f"Processed {items_processed} items...")

        except Exception as e:
            print(f"Error processing player {player.get('Player', 'Unknown')} ({player.get('Season', 'Unknown')}): {e}")
            items_failed += 1

    print(f"\n=== Migration completed ===")
    print(f"Total processed: {items_processed}")
    print(f"Total failed: {items_failed}")
    for season, count in season_counts.items():
        print(f"  {season}: {count} players")
    print(f"==========================")


if __name__ == "__main__":
    data_dir = sys.argv[1] if len(sys.argv) > 1 else "./data"
    table_name = sys.argv[2] if len(sys.argv) > 2 else "nba-player-stats-dev"
    seasons = sys.argv[3].split(',') if len(sys.argv) > 3 else ['2024_25', '2025_26']

    print(f"=== DynamoDB Migration ===")
    print(f"Data directory: {data_dir}")
    print(f"Table name: {table_name}")
    print(f"Seasons: {seasons}")
    print(f"==========================\n")

    migrate_data_to_dynamodb(data_dir, table_name, seasons)
