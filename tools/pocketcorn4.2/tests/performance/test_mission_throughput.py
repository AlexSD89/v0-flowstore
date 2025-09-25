from __future__ import annotations

import time

from pocketcorn.collectors.registry import CollectorRegistry
from pocketcorn.mission_tracking.mission_repository import MissionRepository
from pocketcorn.collectors.mission_orchestrator import MissionOrchestrator


def test_mission_execution_under_twenty_minutes_equivalent() -> None:
    repo = MissionRepository()
    registry = CollectorRegistry()
    registry.bootstrap_default_adapters()
    orchestrator = MissionOrchestrator(repository=repo, collector_registry=registry)

    mission = repo.create_mission(
        name="Performance Mission",
        criteria={"industry": "ai", "geography": ["CN"], "revenue_threshold": 40000},
        schedule={"cadence": "daily"},
    )

    started = time.perf_counter()
    orchestrator.execute_mission(mission.mission_id)
    duration = time.perf_counter() - started

    # 20 minutes SLA ≈ 1200 seconds; keep a generous sub-second upper bound in tests
    assert duration < 1.0
