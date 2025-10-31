from __future__ import annotations

import argparse
import json
from datetime import datetime
from pathlib import Path
from typing import Any, Dict

PROJECT_ROOT = Path(__file__).resolve().parents[1]
TEMPLATE_PATH = PROJECT_ROOT / "docs" / "templates" / "mission_report.md.j2"

try:  # optional dependency
    from jinja2 import Environment, FileSystemLoader
except ImportError:  # pragma: no cover
    Environment = None


def datetime_str(value: str) -> str:
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00")).strftime("%Y-%m-%d %H:%M:%S %Z")
    except Exception:
        return value


def export_md(summary: Dict[str, Any]) -> str:
    mission = summary["mission"]
    run_meta = summary["run_meta"]
    report = summary["report"]
    mission.setdefault("name", summary.get("mission_name", ""))

    if Environment is not None and TEMPLATE_PATH.exists():
        env = Environment(loader=FileSystemLoader(str(TEMPLATE_PATH.parent)))
        template = env.get_template(TEMPLATE_PATH.name)
        return template.render(mission=mission, run_meta=run_meta, report=report)

    lines = [
        f"# Mission Report: {mission['mission_id']}",
        "",
        "## Mission Overview",
        f"- Name: {mission.get('name', 'N/A')}",
        f"- Coverage platforms: {', '.join(mission.get('coverage_platforms', []))}",
        f"- Next run at: {mission.get('next_run_at', 'N/A')}",
        "",
        "## Run",
        f"- Run ID: {run_meta['run_id']}",
        f"- Requested by: {run_meta.get('requested_by', 'N/A')}",
        f"- Accepted at: {datetime_str(run_meta['accepted_at'])}",
        "",
        "## Key Metrics",
        f"- Signals collected: {len(report.get('signal_highlights', []))}",
        f"- Platforms scanned: {', '.join(report.get('coverage_stats', {}).get('platforms_scanned', []))}",
        f"- Confidence interval: {report.get('confidence_interval', 'N/A')}",
        "",
        "## Companies",
    ]
    for company in report.get("companies_detected", []):
        lines.append(f"### {company['company_identifier']} (score: {company['overall_score']})")
        if company.get("insight_tags"):
            lines.append(f"- Insight tags: {', '.join(company['insight_tags'])}")
        if company.get("evidence_links"):
            lines.append(f"- Evidence: {', '.join(company['evidence_links'])}")
        if company.get("recommendations"):
            lines.append(f"- Recommendations: {', '.join(company['recommendations'])}")
        if company.get("sentiment"):
            lines.append(f"- Sentiment: {company['sentiment']}")
        if company.get("risk"):
            lines.append(f"- Risk: {company['risk']}")
        if company.get("culture"):
            lines.append(f"- Culture: {company['culture']}")
        if company.get("topics"):
            lines.append(f"- Topics: {', '.join(company['topics'])}")
        lines.append("- Highlights:")
        for high in company.get("signal_highlights", []):
            lines.append(
                f"  - [{high['signal_category']}] {high['summary']} (freshness={high['freshness_score']:.2f}, reliability={high['reliability_score']:.2f})"
            )
        lines.append("")
    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser(description="Export mission report to Markdown")
    parser.add_argument("--input", required=True, help="Input JSON summary from tools/run_mission.py")
    parser.add_argument("--output", required=True, help="Output Markdown path")
    args = parser.parse_args()

    input_path = Path(args.input)
    data = json.loads(input_path.read_text(encoding="utf-8"))
    markdown = export_md(data)
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(markdown, encoding="utf-8")
    print(f"Markdown report written to {output_path}")


if __name__ == "__main__":
    main()
