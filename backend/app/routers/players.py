from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Dict, Any
from ..services.player_similarity import PlayerSimilarityService
from ..models.player import PlayerQuery, SimilarPlayersResponse

router = APIRouter(
    prefix="/players",
    tags=["players"],
    responses={404: {"description": "Not found"}},
)

def get_player_similarity_service():
    return PlayerSimilarityService(data_dir="./data")

async def get_players(
    season: str = Query(None, description="Filter players by season (e.g., '2023_24')"),
    service: PlayerSimilarityService = Depends(get_player_similarity_service)
):
    """
    Get a list of all players, optionally filtered by season.
    """
    return service.get_all_players(season)

router.get("/", response_model=List[Dict[str, Any]])(get_players)
router.get("", response_model=List[Dict[str, Any]])(get_players)

async def get_seasons(
    service: PlayerSimilarityService = Depends(get_player_similarity_service)
):
    """
    Get a list of all available seasons.
    """
    if service.df is None or service.df.empty:
        return []
    return sorted(service.df['Season'].unique().tolist())

router.get("/seasons", response_model=List[str])(get_seasons)
router.get("/seasons/", response_model=List[str])(get_seasons)
router.get("seasons", response_model=List[str])(get_seasons)

async def find_similar_players_post(
    query: PlayerQuery,
    service: PlayerSimilarityService = Depends(get_player_similarity_service)
):
    """
    Find players most similar to the given player.
    """
    try:
        query_player, similar_players = service.find_similar_players(
            player_name=query.player_name,
            season=query.season,
            num_similar=query.num_similar
        )

        return SimilarPlayersResponse(
            query_player=query_player,
            similar_players=similar_players
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        # Log the error for debugging
        print(f"Error in find_similar_players_post: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

router.post("/similar", response_model=SimilarPlayersResponse)(find_similar_players_post)
router.post("/similar/", response_model=SimilarPlayersResponse)(find_similar_players_post)
router.post("similar", response_model=SimilarPlayersResponse)(find_similar_players_post)

async def find_similar_players_get(
    player_name: str = Query(..., description="Name of the player to find similar players for"),
    season: str = Query("2023_24", description="Season to search in (e.g., '2023_24')"),
    num_similar: int = Query(5, description="Number of similar players to return"),
    service: PlayerSimilarityService = Depends(get_player_similarity_service)
):
    """
    Find players most similar to the given player (GET endpoint).
    """
    try:
        query_player, similar_players = service.find_similar_players(
            player_name=player_name,
            season=season,
            num_similar=num_similar
        )

        return SimilarPlayersResponse(
            query_player=query_player,
            similar_players=similar_players
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        print(f"Error in find_similar_players_get: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

router.get("/similar", response_model=SimilarPlayersResponse)(find_similar_players_get)
router.get("/similar/", response_model=SimilarPlayersResponse)(find_similar_players_get)
router.get("similar", response_model=SimilarPlayersResponse)(find_similar_players_get)
