from __future__ import annotations

import pytest
from datetime import datetime, timedelta, timezone

from pocketcorn.collectors.scheduler import MissionScheduler
from pocketcorn.collectors.registry import CollectorRegistry
from pocketcorn.collectors.mission_orchestrator import MissionOrchestrator
from pocketcorn.mission_tracking.mission_repository import MissionRepository


@pytest.mark.asyncio()
async def test_scheduler_triggers_due_mission() -> None:
    repository = MissionRepository()
    registry = CollectorRegistry()
    registry.bootstrap_default_adapters()
    orchestrator = MissionOrchestrator(repository=repository, collector_registry=registry)

    mission = repository.create_mission(
        name="Scheduled Mission",
        criteria={"industry": "ai", "geography": ["CN"], "revenue_threshold": 30000},
        schedule={"cadence": "daily"},
    )
    mission.next_run_at = datetime.now(timezone.utc) - timedelta(minutes=5)

    scheduler = MissionScheduler(repository=repository, orchestrator=orchestrator, interval_seconds=1)

    await scheduler.tick()

    latest_run = repository.get_latest_run(str(mission.mission_id))
    assert latest_run is not None
    assert latest_run.mission_id == mission.mission_id
    assert str(mission.mission_id) in scheduler.run_history
    hist = scheduler.run_history[str(mission.mission_id)]
    assert hist.get("signals", 0) >= 1
