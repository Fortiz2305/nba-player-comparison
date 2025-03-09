import requests
import json
import sys

def test_api(player_name="LeBron James", season="2023_24", num_similar=5):
    """Test the player similarity API by making a request and printing the results."""
    base_url = "http://localhost:8000"

    # Test the root endpoint
    print("Testing root endpoint...")
    response = requests.get(f"{base_url}/")
    print(f"Status code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print("\n" + "-"*50 + "\n")

    # Test the seasons endpoint
    print("Testing seasons endpoint...")
    response = requests.get(f"{base_url}/players/seasons")
    print(f"Status code: {response.status_code}")
    if response.status_code == 200:
        seasons = response.json()
        print(f"Available seasons: {seasons}")
    else:
        print(f"Error: {response.text}")
    print("\n" + "-"*50 + "\n")

    # Test the players endpoint
    print(f"Testing players endpoint for season {season}...")
    response = requests.get(f"{base_url}/players?season={season}")
    print(f"Status code: {response.status_code}")
    if response.status_code == 200:
        players = response.json()
        print(f"Number of players: {len(players)}")
        print(f"First 5 players: {players[:5]}")
    else:
        print(f"Error: {response.text}")
    print("\n" + "-"*50 + "\n")

    # Test the similar players endpoint
    print(f"Testing similar players endpoint for {player_name} in {season}...")
    response = requests.get(
        f"{base_url}/players/similar?player_name={player_name}&season={season}&num_similar={num_similar}"
    )
    print(f"Status code: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        query_player = data["query_player"]
        similar_players = data["similar_players"]

        print(f"\nQuery Player: {query_player['player']}")
        print(f"Season: {query_player['season']}")
        print(f"Position: {query_player['position']}")
        print(f"Team: {query_player['team']}")
        print(f"Age: {query_player['age']}")
        print(f"PPG: {query_player['points_per_game']:.1f}")
        print(f"RPG: {query_player['total_rebounds_per_game']:.1f}")
        print(f"APG: {query_player['assists_per_game']:.1f}")

        print("\nSimilar Players:")
        for i, player in enumerate(similar_players, 1):
            print(f"{i}. {player['player']} ({player['season']}) - {player['position']}")
            print(f"   Similarity: {player['similarity_score']:.2f}")
            print(f"   PPG: {player['stats']['points_per_game']:.1f}, "
                  f"RPG: {player['stats']['total_rebounds_per_game']:.1f}, "
                  f"APG: {player['stats']['assists_per_game']:.1f}")
    else:
        print(f"Error: {response.text}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        player_name = sys.argv[1]
        season = sys.argv[2] if len(sys.argv) > 2 else "2023_24"
        num_similar = int(sys.argv[3]) if len(sys.argv) > 3 else 5
        test_api(player_name, season, num_similar)
    else:
        test_api()
