from __future__ import annotations

from datetime import datetime, timezone
from typing import Dict, Optional, Iterable

from pocketcorn.collectors.models import (
    DiscoveryMission,
    MissionRunSummary,
    MissionStatus,
    PriorityTier,
)
from pocketcorn.mission_tracking.cache import MissionCache, RedisMissionCache
from pocketcorn.mission_tracking.persistence import PersistenceLayer, create_persistence_layer


class MissionRepository:
    """Facade orchestrating mission persistence and caching."""

    def __init__(
        self,
        persistence: Optional[PersistenceLayer] = None,
        cache: Optional[MissionCache] = None,
    ) -> None:
        self._persistence = persistence or create_persistence_layer()
        self._cache = cache or RedisMissionCache.fallback()

    # Mission lifecycle ---------------------------------------------------
    def create_mission(
        self,
        name: str,
        criteria: Dict[str, object],
        schedule: Dict[str, object],
        priority: str = "standard",
        notification_channel: Optional[str] = None,
        analyst_id: Optional[str] = None,
    ) -> DiscoveryMission:
        mission = DiscoveryMission(
            name=name,
            criteria=criteria,
            schedule=schedule,
            priority_tier=PriorityTier(priority.lower()),
            notification_channel=notification_channel,
            analyst_id=analyst_id,
        )
        mission.schedule_next_run()
        self._persistence.save_mission(mission)
        return mission

    def get_mission(self, mission_id: str) -> DiscoveryMission:
        mission = self._persistence.get_mission(mission_id)
        if not mission:
            raise KeyError(f"Mission {mission_id} not found")
        return mission

    def list_missions(self) -> Iterable[DiscoveryMission]:
        return list(self._persistence.list_missions())

    # Run lifecycle -------------------------------------------------------
    def save_run(self, summary: MissionRunSummary) -> None:
        self._persistence.save_run(summary)
        cache_key = f"mission:{summary.mission_id}:last-run"
        self._cache.set(cache_key, summary.model_dump(mode="json"))

    def get_run(self, run_id: str) -> MissionRunSummary:
        run = self._persistence.get_run(run_id)
        if not run:
            raise KeyError(f"Run {run_id} not found")
        return run

    def get_latest_run(self, mission_id: str) -> Optional[MissionRunSummary]:
        cache_key = f"mission:{mission_id}:last-run"
        cached = self._cache.get(cache_key)
        if cached:
            if isinstance(cached, dict):
                return MissionRunSummary(**cached)
            return cached
        runs = self._persistence.list_runs(mission_id)
        if not runs:
            return None
        return max(runs, key=lambda r: r.run_timestamp)

    def serialize_run(self, run_id: str) -> Dict[str, object]:
        run = self.get_run(run_id)
        return self._persistence.serialize_run(run)

    def update_last_run_timestamp(self, mission_id: str) -> None:
        mission = self.get_mission(mission_id)
        mission.last_run_at = datetime.now(timezone.utc)
        mission.schedule_next_run()
        mission.status = MissionStatus.COMPLETED
        self._persistence.save_mission(mission)
