from __future__ import annotations

import asyncio
import contextlib
from datetime import datetime, timezone
from typing import Dict, Optional

from pocketcorn.collectors.models import DiscoveryMission
from pocketcorn.common.logging import get_logger
from pocketcorn.collectors.mission_orchestrator import MissionOrchestrator
from pocketcorn.mission_tracking.mission_repository import MissionRepository

logger = get_logger("collectors.scheduler")


def should_run(mission: DiscoveryMission, now: datetime | None = None) -> bool:
    current = now or datetime.now(timezone.utc)
    if mission.next_run_at is None:
        mission.schedule_next_run(current)
        return True
    return current >= mission.next_run_at


def mark_run(mission: DiscoveryMission, now: datetime | None = None) -> None:
    mission.last_run_at = now or datetime.now(timezone.utc)
    mission.schedule_next_run(now)
    logger.info("mission.scheduled", extra={"extra_data": {"next_run_at": mission.next_run_at.isoformat()}})


class MissionScheduler:
    """Simple async scheduler that executes missions on cadence."""

    def __init__(
        self,
        repository: MissionRepository,
        orchestrator: MissionOrchestrator,
        interval_seconds: int = 300,
        max_concurrent_runs: int = 4,
    ) -> None:
        self.repository = repository
        self.orchestrator = orchestrator
        self.interval_seconds = interval_seconds
        self._task: Optional[asyncio.Task[None]] = None
        self._running = False
        self._semaphore = asyncio.Semaphore(max(1, max_concurrent_runs))
        self.run_history: Dict[str, Dict[str, object]] = {}

    async def start(self) -> None:
        if self._task and not self._task.done():
            return
        self._running = True
        loop = asyncio.get_running_loop()
        self._task = loop.create_task(self._run_loop())
        logger.info("scheduler.started", extra={"extra_data": {"interval_seconds": self.interval_seconds}})

    async def stop(self) -> None:
        self._running = False
        if self._task is None:
            return
        self._task.cancel()
        with contextlib.suppress(asyncio.CancelledError):
            await self._task
        self._task = None
        logger.info("scheduler.stopped")

    async def tick(self) -> None:
        missions = list(self.repository.list_missions())
        tasks = []
        for mission in missions:
            if should_run(mission):
                mission_id = str(mission.mission_id)
                logger.info("scheduler.run", extra={"extra_data": {"mission_id": mission_id}})
                tasks.append(asyncio.create_task(self._run_with_limit(mission_id)))
        if tasks:
            await asyncio.gather(*tasks)

    async def _run_loop(self) -> None:
        while self._running:
            await self.tick()
            await asyncio.sleep(self.interval_seconds)

    async def _run_with_limit(self, mission_id: str) -> None:
        async with self._semaphore:
            await asyncio.to_thread(self._run_mission, mission_id)

    def _run_mission(self, mission_id: str) -> None:
        start = datetime.now(timezone.utc)
        try:
            summary = self.orchestrator.execute_mission(mission_id, mode="scheduled")
            duration = (datetime.now(timezone.utc) - start).total_seconds()
            self.run_history[mission_id] = {
                "last_run_at": summary.run_timestamp,
                "signals": len(summary.signal_highlights),
                "platforms": summary.coverage_stats.platforms_scanned,
                "duration_seconds": duration,
            }
            logger.info(
                "scheduler.run_success",
                extra={
                    "extra_data": {
                        "mission_id": mission_id,
                        "signals": len(summary.signal_highlights),
                        "platforms": summary.coverage_stats.platforms_scanned,
                        "duration_seconds": duration,
                    }
                },
            )
        except Exception as exc:  # pragma: no cover - defensive logging
            self.run_history.setdefault(mission_id, {})
            self.run_history[mission_id].update(
                {
                    "last_error": str(exc),
                    "last_error_at": datetime.now(timezone.utc),
                }
            )
            logger.error(
                "scheduler.run_failed",
                extra={"extra_data": {"mission_id": mission_id, "error": str(exc)}},
            )
