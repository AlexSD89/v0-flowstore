"""Pytest fixtures for Pocketcorn v4.2 tests."""
from __future__ import annotations

import sys
from pathlib import Path

import pytest

# Ensure the src directory is importable
PROJECT_ROOT = Path(__file__).resolve().parents[1]
SRC_PATH = PROJECT_ROOT / "src"
if str(SRC_PATH) not in sys.path:
    sys.path.insert(0, str(SRC_PATH))

from pocketcorn.collectors.mission_orchestrator import MissionOrchestrator  # noqa: E402
from pocketcorn.collectors.registry import CollectorRegistry  # noqa: E402
from pocketcorn.mission_tracking.mission_repository import MissionRepository  # noqa: E402


@pytest.fixture()
def mission_repository() -> MissionRepository:
    return MissionRepository()


@pytest.fixture()
def collector_registry() -> CollectorRegistry:
    registry = CollectorRegistry()
    registry.bootstrap_default_adapters()
    return registry


@pytest.fixture()
def orchestrator(mission_repository: MissionRepository, collector_registry: CollectorRegistry) -> MissionOrchestrator:
    return MissionOrchestrator(repository=mission_repository, collector_registry=collector_registry)
