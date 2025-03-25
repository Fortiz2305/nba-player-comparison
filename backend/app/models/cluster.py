from pydantic import BaseModel
from typing import List, Dict, Any

from .player import PlayerStats


class PlayerCluster(BaseModel):
    cluster_id: int
    players: List[PlayerStats]
    centroid: Dict[str, float]


class ClusteringResult(BaseModel):
    clusters: List[PlayerCluster]
    season: str
    num_clusters: int
