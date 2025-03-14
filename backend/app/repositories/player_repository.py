import abc
from typing import List, Dict, Any, Optional
import pandas as pd


class PlayerRepository(abc.ABC):
    @abc.abstractmethod
    def load_players_data(self) -> pd.DataFrame:
        pass

    @abc.abstractmethod
    def get_all_players(self, season: Optional[str] = None) -> List[Dict[str, Any]]:
        pass

    @abc.abstractmethod
    def get_seasons(self) -> List[str]:
        pass
