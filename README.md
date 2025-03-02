# NBA Player Comparison

This application allows users to compare NBA players based on their statistics and find similar players.

## Project Structure

- `backend/`: Flask API for player similarity analysis
- `frontend/`: Next.js frontend application

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Start the backend server:
   ```
   python run.py
   ```

   The backend API will be available at http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install the required dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file with the following content:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. Start the frontend development server:
   ```
   npm run dev
   ```

   The frontend application will be available at http://localhost:3000

## Features

- Search for NBA players
- View player statistics in radar and bar charts
- Find similar players based on statistical analysis
- Compare players side by side

## API Endpoints

- `GET /players`: Get a list of all players
- `GET /players/seasons`: Get a list of all available seasons
- `GET /players/similar`: Find players most similar to a given player

## Technologies Used

- Backend:
  - Flask
  - FastAPI
  - Pandas for data analysis
  - Scikit-learn for similarity calculations

- Frontend:
  - Next.js
  - React
  - TypeScript
  - Tailwind CSS
  - Recharts for data visualization
  - Shadcn UI components

## License

MIT
