from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Dict, Any
from ..services.player_similarity import PlayerSimilarityService
from ..models.player import PlayerQuery, SimilarPlayersResponse
from ..repositories.file_player_repository import FilePlayerRepository
from ..repositories.dynamodb_player_repository import DynamoDBPlayerRepository
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/players",
    tags=["players"],
    responses={404: {"description": "Not found"}},
)

def get_player_repository():
    use_dynamodb = os.environ.get("USE_DYNAMODB", "false").lower() == "true"
    if use_dynamodb:
        table_name = os.environ.get("DYNAMODB_TABLE", "nba_player_stats")
        logger.info(f"Using DynamoDB repository with table: {table_name}")
        return DynamoDBPlayerRepository(table_name=table_name)
    else:
        data_dir = os.environ.get("DATA_DIR", "./data")
        logger.info(f"Using File repository with data directory: {data_dir}")
        return FilePlayerRepository(data_dir=data_dir)

def get_player_similarity_service(repository=Depends(get_player_repository)):
    return PlayerSimilarityService(player_repository=repository)

async def get_players(
    season: str = Query(None, description="Filter players by season (e.g., '2023_24')"),
    service: PlayerSimilarityService = Depends(get_player_similarity_service)
):
    try:
        logger.info(f"Getting players for season: {season}")
        players = service.get_all_players(season)
        logger.info(f"Found {len(players)} players")
        return players
    except Exception as e:
        logger.error(f"Error getting players: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving players: {str(e)}")

router.get("/", response_model=List[Dict[str, Any]])(get_players)
router.get("", response_model=List[Dict[str, Any]])(get_players)

async def get_seasons(
    service: PlayerSimilarityService = Depends(get_player_similarity_service)
):
    try:
        logger.info("Getting seasons")
        seasons = service.get_seasons()
        logger.info(f"Found seasons: {seasons}")
        return seasons
    except Exception as e:
        logger.error(f"Error getting seasons: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving seasons: {str(e)}")

router.get("/seasons", response_model=List[str])(get_seasons)
router.get("/seasons/", response_model=List[str])(get_seasons)
router.get("seasons", response_model=List[str])(get_seasons)

async def find_similar_players_post(
    query: PlayerQuery,
    service: PlayerSimilarityService = Depends(get_player_similarity_service)
):
    try:
        logger.info(f"Finding similar players for {query.player_name} in season {query.season}")
        query_player, similar_players = service.find_similar_players(
            player_name=query.player_name,
            season=query.season,
            num_similar=query.num_similar
        )

        logger.info(f"Found {len(similar_players)} similar players for {query.player_name}")
        return SimilarPlayersResponse(
            query_player=query_player,
            similar_players=similar_players
        )
    except ValueError as e:
        logger.error(f"Player not found: {str(e)}")
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error in find_similar_players_post: {str(e)}")
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
    try:
        logger.info(f"Finding similar players for {player_name} in season {season}")
        query_player, similar_players = service.find_similar_players(
            player_name=player_name,
            season=season,
            num_similar=num_similar
        )

        logger.info(f"Found {len(similar_players)} similar players for {player_name}")
        return SimilarPlayersResponse(
            query_player=query_player,
            similar_players=similar_players
        )
    except ValueError as e:
        logger.error(f"Player not found: {str(e)}")
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error in find_similar_players_get: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

router.get("/similar", response_model=SimilarPlayersResponse)(find_similar_players_get)
router.get("/similar/", response_model=SimilarPlayersResponse)(find_similar_players_get)
router.get("similar", response_model=SimilarPlayersResponse)(find_similar_players_get)
