from __future__ import annotations

from datetime import datetime, timedelta, timezone
from uuid import uuid4

from pocketcorn.collectors.models import CoverageStats, MissionRunSummary
from pocketcorn.mission_tracking.mission_repository import MissionRepository


def test_repository_creates_and_retrieves_mission() -> None:
    repo = MissionRepository()
    mission = repo.create_mission(
        name="Test Mission",
        criteria={"industry": "ai", "geography": ["CN"], "revenue_threshold": 10000},
        schedule={"cadence": "daily"},
    )

    fetched = repo.get_mission(str(mission.mission_id))
    assert fetched.mission_id == mission.mission_id
    assert fetched.next_run_at is not None


def test_repository_caches_latest_run() -> None:
    repo = MissionRepository()
    mission = repo.create_mission(
        name="Test Mission",
        criteria={"industry": "ai", "geography": ["CN"], "revenue_threshold": 10000},
        schedule={"cadence": "daily"},
    )

    run = MissionRunSummary(
        run_id=uuid4(),
        mission_id=mission.mission_id,
        run_timestamp=datetime.now(timezone.utc),
        companies_detected=[],
        signal_highlights=[],
        coverage_stats=CoverageStats(platforms_scanned=["zhihu"], latency_seconds=12, gaps=[]),
        confidence_interval=0.8,
        next_actions=[],
    )
    repo.save_run(run)

    cached = repo.get_latest_run(str(mission.mission_id))
    assert cached is not None
    assert cached.run_id == run.run_id

    repo.update_last_run_timestamp(str(mission.mission_id))
    refreshed = repo.get_mission(str(mission.mission_id))
    assert refreshed.last_run_at is not None
    assert refreshed.next_run_at and refreshed.next_run_at > datetime.now(timezone.utc) - timedelta(seconds=1)
