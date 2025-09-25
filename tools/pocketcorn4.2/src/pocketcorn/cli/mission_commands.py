from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Dict

from pocketcorn.api import missions
from pocketcorn.collectors.mission_orchestrator import MissionOrchestrator
from pocketcorn.collectors.registry import CollectorRegistry
from pocketcorn.mission_tracking.mission_repository import MissionRepository


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Pocketcorn mission management")
    sub = parser.add_subparsers(dest="command", required=True)

    create = sub.add_parser("create", help="Create a discovery mission")
    create.add_argument("--criteria", help="Path to JSON file describing criteria")
    create.add_argument("--description", help="Natural language mission description")
    create.add_argument("--name", required=True)
    create.add_argument("--priority", default="standard")

    run = sub.add_parser("run", help="Trigger a mission run")
    run.add_argument("mission_id")
    run.add_argument("--mode", default="on-demand")

    report = sub.add_parser("report", help="Fetch last mission run")
    report.add_argument("mission_id")
    report.add_argument("--format", choices=["json", "md"], default="json")
    report.add_argument("--output", help="When format is md, path to write report")

    analyze = sub.add_parser("analyze", help="Show analysis summary for a mission run")
    analyze.add_argument("mission_id")
    analyze.add_argument("--run-id", help="Specific run ID; defaults to latest")

    full = sub.add_parser("full", help="Create, run and export a mission report")
    full.add_argument("--name", default="Auto Mission")
    full.add_argument("--description", default="扫描 AI 初创公司融资与招聘动态")
    full.add_argument("--geography", default="CN")
    full.add_argument("--revenue-threshold", type=int, default=40000, dest="revenue_threshold")
    full.add_argument("--output-json", default="reports/full_mission.json")
    full.add_argument("--output-md", default="reports/full_mission.md")

    return parser


_GLOBAL_REPOSITORY: MissionRepository | None = None
_GLOBAL_ORCHESTRATOR: MissionOrchestrator | None = None


def _build_services() -> tuple[MissionRepository, MissionOrchestrator]:
    global _GLOBAL_REPOSITORY, _GLOBAL_ORCHESTRATOR
    if _GLOBAL_REPOSITORY is None or _GLOBAL_ORCHESTRATOR is None:
        repository = MissionRepository()
        registry = CollectorRegistry()
        registry.bootstrap_default_adapters()
        orchestrator = MissionOrchestrator(repository=repository, collector_registry=registry)
        _GLOBAL_REPOSITORY = repository
        _GLOBAL_ORCHESTRATOR = orchestrator
    return _GLOBAL_REPOSITORY, _GLOBAL_ORCHESTRATOR


def _serialize_analysis(summary: Dict[str, object]) -> Dict[str, object]:
    companies = summary.get("companies_detected", [])
    topics: List[str] = []
    sentiments: List[float] = []
    risk_levels: List[str] = []
    for company in companies:
        topics.extend(company.get("topics", []))
        sentiment = company.get("sentiment", {})
        if "average_score" in sentiment:
            sentiments.append(sentiment["average_score"])
        risk = company.get("risk", {})
        risk_levels.append(risk.get("level", "unknown"))
    avg_sentiment = sum(sentiments) / len(sentiments) if sentiments else 0.0
    return {
        "company_count": len(companies),
        "risk_levels": risk_levels,
        "average_sentiment": round(avg_sentiment, 2),
        "top_topics": topics,
    }


TOOLS_ROOT = Path(__file__).resolve().parents[3] / "tools"
if str(TOOLS_ROOT) not in sys.path:
    sys.path.append(str(TOOLS_ROOT))
try:  # pragma: no cover
    from export_report import export_md
except Exception:  # pragma: no cover
    export_md = None


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    repository, orchestrator = _build_services()

    if args.command == "create":
        payload: dict = {}
        if args.criteria:
            criteria_path = Path(args.criteria)
            payload["criteria"] = json.loads(criteria_path.read_text(encoding="utf-8"))
        if args.description:
            payload["description"] = args.description
        payload["name"] = args.name
        payload["priority"] = args.priority
        response = missions.create_mission(payload, repository=repository)
        print(json.dumps(response, indent=2, ensure_ascii=False))
    elif args.command == "run":
        meta = missions.run_mission(
            mission_id=args.mission_id,
            mode=args.mode,
            requested_by="cli",
            orchestrator=orchestrator,
        )
        print(json.dumps(meta, indent=2, ensure_ascii=False))
    elif args.command == "report":
        run = repository.get_latest_run(args.mission_id)
        if not run:
            print(json.dumps({"error": "no runs recorded"}))
        else:
            summary = repository.serialize_run(str(run.run_id))
            if args.format == "json":
                print(json.dumps(summary, indent=2, ensure_ascii=False))
            elif args.format == "md":
                if not args.output:
                    parser.error("--output is required when format=md")
                if export_md is None:
                    parser.error("export_md helper unavailable; ensure tools/export_report.py is accessible")
                markdown = export_md({"mission": {}, "run_meta": {}, "report": summary})
                output_path = Path(args.output)
                output_path.parent.mkdir(parents=True, exist_ok=True)
                output_path.write_text(markdown, encoding="utf-8")
                print(f"Markdown report written to {output_path}")
    elif args.command == "analyze":
        run_id = args.run_id
        if run_id:
            summary = repository.serialize_run(run_id)
        else:
            latest = repository.get_latest_run(args.mission_id)
            if not latest:
                print(json.dumps({"error": "no runs recorded"}))
                return 0
            summary = repository.serialize_run(str(latest.run_id))
        analysis = _serialize_analysis(summary)
        print(json.dumps(analysis, indent=2, ensure_ascii=False))
    elif args.command == "full":
        geos = [geo.strip() for geo in args.geography.split(",") if geo.strip()]
        mission_payload = {
            "name": args.name,
            "description": args.description,
            "priority": "high",
            "criteria": {
                "industry": "ai",
                "geography": geos,
                "revenue_threshold": args.revenue_threshold,
                "growth_signals": ["hiring", "funding", "product"],
            },
        }
        mission = missions.create_mission(mission_payload, repository=repository)
        run_meta = missions.run_mission(
            mission_id=mission["mission_id"],
            mode="on-demand",
            requested_by="cli-full",
            orchestrator=orchestrator,
        )
        summary = missions.get_mission_run(run_meta["run_id"], repository=repository)
        full_summary = {
            "mission": mission,
            "run_meta": run_meta,
            "report": summary,
        }
        json_path = Path(args.output_json)
        json_path.parent.mkdir(parents=True, exist_ok=True)
        json_path.write_text(json.dumps(full_summary, ensure_ascii=False, indent=2), encoding="utf-8")
        if export_md is not None:
            markdown = export_md(full_summary)
            md_path = Path(args.output_md)
            md_path.parent.mkdir(parents=True, exist_ok=True)
            md_path.write_text(markdown, encoding="utf-8")
            print(f"Full mission report saved: {md_path}")
        else:
            print("Full mission executed (Markdown export unavailable)")
        print(f"JSON summary saved: {json_path}")
    return 0


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main())
