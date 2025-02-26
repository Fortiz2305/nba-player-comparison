# NBA Player Comparison App

A full-stack web application for comparing NBA players and finding similar players based on statistical analysis.

## Project Structure

The project is organized into two main directories:

- `frontend/`: React/TypeScript frontend application
- `backend/`: Python FastAPI backend application

## Features

- Find similar NBA players using K-nearest neighbors algorithm
- Compare player statistics across different seasons
- Interactive UI for exploring player similarities
- RESTful API for player data and similarity calculations

## Backend

The backend is built with FastAPI and provides the following endpoints:

- `GET /players`: Get a list of all players, optionally filtered by season
- `GET /players/seasons`: Get a list of all available seasons
- `GET /players/similar`: Find players most similar to a given player
- `POST /players/similar`: Find players most similar to a given player (POST method)

### Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the server:

```bash
python run.py
```

The API will be available at http://localhost:8000

## Frontend

The frontend is built with React and TypeScript and provides a user interface for interacting with the backend API.

### Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm start
```

The frontend will be available at http://localhost:3000

## Data

The application uses NBA player statistics stored in CSV files in the `backend/data` directory. Each file should be named with the season (e.g., `2023_24.csv`) and contain player statistics for that season.

## Technologies Used

### Frontend
- React
- TypeScript
- React Router
- CSS

### Backend
- Python
- FastAPI
- Pandas
- NumPy
- scikit-learn

## License

MIT
