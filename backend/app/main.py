from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import players

app = FastAPI(
    title="NBA Player Comparison API",
    description="API for finding similar NBA players using statistical analysis",
    version="1.0.0"
)

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(players.router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to the NBA Player Comparison API",
        "docs": "/docs",
        "endpoints": {
            "players": "/players",
            "seasons": "/players/seasons",
            "similar_players": "/players/similar"
        }
    }
