import boto3
import sys
from boto3.dynamodb.conditions import Key

def verify_dynamodb_data(table_name, seasons=None):
    """Verify data in DynamoDB table"""
    dynamodb = boto3.resource('dynamodb', region_name='eu-west-1')
    table = dynamodb.Table(table_name)

    seasons_to_check = seasons if seasons else ['2024_25', '2025_26']

    print(f"\n=== DynamoDB Verification ===")
    print(f"Table: {table_name}")
    print(f"Seasons to verify: {seasons_to_check}\n")

    for season in seasons_to_check:
        try:
            response = table.query(
                KeyConditionExpression=Key('Season').eq(season)
            )

            items = response.get('Items', [])
            count = len(items)

            print(f"Season {season}: {count} players")

            if count > 0:
                sample_player = items[0]
                print(f"  Sample player: {sample_player.get('Player', 'N/A')}")
                print(f"  Team: {sample_player.get('Team', 'N/A')}")
                print(f"  PTS: {sample_player.get('PTS', 'N/A')}")
            else:
                print(f"  ⚠️  No players found for season {season}")
            print()

        except Exception as e:
            print(f"Error querying season {season}: {e}\n")

    print("=============================\n")


if __name__ == "__main__":
    table_name = sys.argv[1] if len(sys.argv) > 1 else "nba-player-stats-dev"
    seasons = sys.argv[2].split(',') if len(sys.argv) > 2 else ['2024_25', '2025_26']

    verify_dynamodb_data(table_name, seasons)
