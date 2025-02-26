import requests

def test_endpoints():
    """Test that endpoints work without redirects."""
    base_url = "http://localhost:8000"

    # Test endpoints with and without trailing slashes
    endpoints = [
        "/players",
        "/players/",
        "/players?season=2023_24",
        "/players/?season=2023_24",
        "/players/seasons",
        "/players/seasons/",
        "/players/similar?player_name=LeBron%20James&season=2023_24&num_similar=5",
        "/players/similar/?player_name=LeBron%20James&season=2023_24&num_similar=5"
    ]

    for endpoint in endpoints:
        url = f"{base_url}{endpoint}"
        print(f"Testing: {url}")

        response = requests.get(url, allow_redirects=False)

        if 300 <= response.status_code < 400:
            print(f"❌ Redirect detected: {response.status_code} to {response.headers.get('Location')}")
        else:
            print(f"✅ No redirect: {response.status_code}")

        print("-" * 50)

if __name__ == "__main__":
    test_endpoints()
