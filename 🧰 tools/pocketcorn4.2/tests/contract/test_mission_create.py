from __future__ import annotations

from datetime import datetime, timedelta, timezone

import pytest

from pocketcorn.api import missions
from pocketcorn.mission_tracking.mission_repository import MissionRepository


@pytest.fixture()
def payload() -> dict:
    return {
        "name": "AI Startups 50k MRR",
        "criteria": {
            "industry": "enterprise AI",
            "geography": ["CN", "HK", "SG"],
            "revenue_threshold": 50_000,
            "growth_signals": ["hiring", "mrr"],
            "cultural_focus": "mainland",
        },
        "schedule": {"cadence": "daily", "time_window": "03:00"},
        "priority": "high",
        "notification_channel": "analyst@launchx",
    }


def test_mission_create_contract(payload: dict, mission_repository: MissionRepository) -> None:
    result = missions.create_mission(payload, repository=mission_repository)

    assert "mission_id" in result
    assert isinstance(result["mission_id"], str)
    assert result["coverage_platforms"], "expected coverage platforms"
    assert set(result["coverage_platforms"]).issuperset({"zhihu", "weibo", "linkedin"})

    next_run = datetime.fromisoformat(result["next_run_at"])
    assert next_run > datetime.now(timezone.utc) - timedelta(minutes=1)
    assert result["validation_messages"] == []


def test_mission_create_validation(payload: dict, mission_repository: MissionRepository) -> None:
    payload["criteria"]["geography"] = []

    with pytest.raises(ValueError) as exc:
        missions.create_mission(payload, repository=mission_repository)

    assert "Specify geography" in str(exc.value)


def test_mission_create_from_description(mission_repository: MissionRepository) -> None:
    payload = {
        "name": "Natural Mission",
        "description": "Scan mainland China AI startups around 60k MRR that are hiring fast",
        "schedule": {"cadence": "daily"},
    }

    result = missions.create_mission(payload, repository=mission_repository)

    assert result["mission_id"]
    assert result["validation_messages"] == []
