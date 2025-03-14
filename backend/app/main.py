from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import players
from mangum import Mangum
import logging

app = FastAPI(
    title="NBA Player Comparison API",
    description="API for finding similar NBA players using statistical analysis",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(players.router)

handler = Mangum(app, lifespan="off")

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
