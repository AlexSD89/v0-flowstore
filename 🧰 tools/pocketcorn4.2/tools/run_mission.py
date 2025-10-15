from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Dict

from pocketcorn.api import missions
from pocketcorn.collectors.registry import CollectorRegistry
from pocketcorn.collectors.mission_orchestrator import MissionOrchestrator
from pocketcorn.mission_tracking.mission_repository import MissionRepository
from pocketcorn.mission_tracking.persistence import InMemoryPersistenceLayer


def build_services(config: Dict[str, object]) -> tuple[MissionRepository, MissionOrchestrator]:
    persistence = InMemoryPersistenceLayer()
    repository = MissionRepository(persistence=persistence)
    registry = CollectorRegistry()
    registry.bootstrap_default_adapters()
    orchestrator = MissionOrchestrator(repository=repository, collector_registry=registry)
    return repository, orchestrator


def main() -> None:
    parser = argparse.ArgumentParser(description="Run a Pocketcorn mission and export report metadata")
    parser.add_argument("--name", default="Auto Mission", help="Mission name")
    parser.add_argument(
        "--description",
        default="扫描 AI 初创公司融资与招聘动态",
        help="Mission description (natural language)",
    )
    parser.add_argument(
        "--geography",
        default="CN",
        help="Comma separated geography list, e.g. CN,US",
    )
    parser.add_argument(
        "--revenue-threshold",
        type=int,
        default=30000,
        dest="revenue_threshold",
        help="Revenue threshold in local currency",
    )
    parser.add_argument("--output", default="reports/staging_phase1.json", help="Path to write report metadata")
    args = parser.parse_args()

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    repository, orchestrator = build_services({})
    mission_payload = {
        "name": args.name,
        "description": args.description,
        "priority": "high",
        "criteria": {
            "industry": "ai",
            "geography": [geo.strip() for geo in args.geography.split(",") if geo.strip()],
            "revenue_threshold": args.revenue_threshold,
            "growth_signals": ["hiring", "funding", "product"],
        },
    }
    mission = missions.create_mission(mission_payload, repository=repository)
    run_meta = missions.run_mission(
        mission_id=mission["mission_id"],
        mode="on-demand",
        requested_by="automation",
        orchestrator=orchestrator,
    )
    report = missions.get_mission_run(run_meta["run_id"], repository=repository)
    summary = {
        "mission": mission,
        "run_meta": run_meta,
        "report": report,
    }
    output_path.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Report metadata written to {output_path}")


if __name__ == "__main__":
    main()
