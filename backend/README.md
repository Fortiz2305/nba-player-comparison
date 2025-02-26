# NBA Player Comparison Backend

This is the backend API for the NBA Player Comparison application. It provides endpoints to find similar NBA players based on statistical analysis using the K-nearest neighbors algorithm.

## Features

- Load and process NBA player statistics from CSV files
- Normalize player statistics for fair comparison
- Find similar players using K-nearest neighbors algorithm
- RESTful API endpoints for frontend integration

## Setup

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Run the server:

```bash
python run.py
```

The API will be available at http://localhost:8000

## API Documentation

Once the server is running, you can access the interactive API documentation at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

- `GET /players`: Get a list of all players, optionally filtered by season
- `GET /players/seasons`: Get a list of all available seasons
- `GET /players/similar`: Find players most similar to a given player (GET method)
- `POST /players/similar`: Find players most similar to a given player (POST method)

## Data

The application uses NBA player statistics stored in CSV files in the `data` directory. Each file should be named with the season (e.g., `2023_24.csv`) and contain player statistics for that season.

## Integration with Frontend

The backend API is designed to be consumed by the React frontend application. The API includes CORS middleware to allow cross-origin requests from the frontend.
