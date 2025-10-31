from __future__ import annotations

import argparse
import sys
from pathlib import Path

from pocketcorn.api import missions
from pocketcorn.collectors.mission_orchestrator import MissionOrchestrator
from pocketcorn.collectors.registry import CollectorRegistry
from pocketcorn.mission_tracking.mission_repository import MissionRepository
from pocketcorn.mission_tracking.persistence import InMemoryPersistenceLayer

TOOLS_DIR = Path(__file__).resolve().parent
if str(TOOLS_DIR) not in sys.path:
    sys.path.append(str(TOOLS_DIR))
from export_report import export_md
import json


def build_services() -> tuple[MissionRepository, MissionOrchestrator]:
    persistence = InMemoryPersistenceLayer()
    repository = MissionRepository(persistence=persistence)
    registry = CollectorRegistry()
    registry.bootstrap_default_adapters()
    orchestrator = MissionOrchestrator(repository=repository, collector_registry=registry)
    return repository, orchestrator


def main() -> None:
    parser = argparse.ArgumentParser(description="Run mission end-to-end and export Markdown report")
    parser.add_argument("--name", default="Auto Mission", help="Mission name")
    parser.add_argument(
        "--description", default="扫描 AI 初创公司融资与招聘动态", help="Mission description"
    )
    parser.add_argument(
        "--geography", default="CN", help="Comma separated geography list (e.g. CN,US)"
    )
    parser.add_argument("--revenue-threshold", type=int, default=40000, dest="revenue_threshold")
    parser.add_argument("--output-json", default="reports/full_mission.json")
    parser.add_argument("--output-md", default="reports/full_mission.md")
    args = parser.parse_args()

    repository, orchestrator = build_services()
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

    output_json = Path(args.output_json)
    output_json.parent.mkdir(parents=True, exist_ok=True)
    output_json.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")

    output_md = Path(args.output_md)
    markdown = export_md(summary)
    output_md.write_text(markdown, encoding="utf-8")

    print(f"Full mission executed. JSON: {output_json}, Markdown: {output_md}")


if __name__ == "__main__":
    main()
