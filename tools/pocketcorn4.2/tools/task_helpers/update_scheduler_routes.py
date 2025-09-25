"""Informational script for scheduler updates.

在 CI 或本地执行后，会打印当前调度器并发/间隔配置，便于确认调整。
"""
from __future__ import annotations

from pocketcorn.collectors.scheduler import MissionScheduler
from pocketcorn.collectors.mission_orchestrator import MissionOrchestrator
from pocketcorn.collectors.registry import CollectorRegistry
from pocketcorn.mission_tracking.mission_repository import MissionRepository


def main() -> None:
    repo = MissionRepository()
    registry = CollectorRegistry()
    registry.bootstrap_default_adapters()
    orchestrator = MissionOrchestrator(repository=repo, collector_registry=registry)
    scheduler = MissionScheduler(repository=repo, orchestrator=orchestrator)
    print("MissionScheduler 当前配置：")
    print(f"- interval_seconds: {scheduler.interval_seconds}")
    print(f"- max_concurrent_runs: {scheduler._semaphore._value}")
    print("如需修改，请在部署配置或构造函数中调整 interval_seconds / max_concurrent_runs。")


if __name__ == "__main__":
    main()
