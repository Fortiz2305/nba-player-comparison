import boto3
import pandas as pd
import os
import sys
from decimal import Decimal

# Add the parent directory to the path so we can import from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.repositories.file_player_repository import FilePlayerRepository


def create_dynamodb_table(table_name="nba_player_stats"):
    """Create the DynamoDB table if it doesn't exist"""
    dynamodb = boto3.resource('dynamodb')

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


def migrate_data_to_dynamodb(data_dir="../data", table_name="nba_player_stats"):
    """Migrate data from CSV files to DynamoDB"""
    create_dynamodb_table(table_name)

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(table_name)

    file_repo = FilePlayerRepository(data_dir)
    df = file_repo.load_players_data()

    items_processed = 0
    items_failed = 0

    for _, row in df.iterrows():
        try:
            item = row.to_dict()

            for key, value in item.items():
                if pd.isna(value):
                    item[key] = None
                elif isinstance(value, (int, float)):
                    item[key] = Decimal(str(value))

            table.put_item(Item=item)
            items_processed += 1

            if items_processed % 100 == 0:
                print(f"Processed {items_processed} items")

        except Exception as e:
            print(f"Error processing item: {e}")
            items_failed += 1

    print(f"Migration completed. Processed {items_processed} items. Failed: {items_failed}")


if __name__ == "__main__":
    data_dir = sys.argv[1] if len(sys.argv) > 1 else "../data"
    table_name = sys.argv[2] if len(sys.argv) > 2 else "nba_player_stats"

    print(f"Migrating data from {data_dir} to DynamoDB table {table_name}")
    migrate_data_to_dynamodb(data_dir, table_name)
