import abc
from typing import List, Dict, Any, Optional
import pandas as pd


class PlayerRepository(abc.ABC):
    @abc.abstractmethod
    def load_players_data(self) -> pd.DataFrame:
        """Load player data from the data source and return as a DataFrame"""
        pass

    @abc.abstractmethod
    def get_all_players(self, season: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get all players, optionally filtered by season"""
        pass
