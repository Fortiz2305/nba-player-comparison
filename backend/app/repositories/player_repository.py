import abc
from typing import List, Dict, Any, Optional


class PlayerRepository(abc.ABC):
    @abc.abstractmethod
    def get_all_players(self, season: Optional[str] = None) -> List[Dict[str, Any]]:
        pass

    @abc.abstractmethod
    def get_seasons(self) -> List[str]:
        pass
