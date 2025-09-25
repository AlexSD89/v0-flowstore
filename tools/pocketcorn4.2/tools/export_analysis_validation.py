from __future__ import annotations

import argparse
import json
from collections import Counter
from pathlib import Path
from typing import Any, Dict


def summarize_analysis(report: Dict[str, Any]) -> Dict[str, Any]:
    companies = report.get("companies_detected", [])
    sentiment_scores = []
    risk_levels = Counter()
    topics = Counter()

    for company in companies:
        sentiment = company.get("sentiment", {})
        if "average_score" in sentiment:
            sentiment_scores.append(sentiment["average_score"])
        risk = company.get("risk", {})
        if "level" in risk:
            risk_levels[risk["level"]] += 1
        for topic in company.get("topics", []):
            topics[topic] += 1

    avg_sentiment = sum(sentiment_scores) / len(sentiment_scores) if sentiment_scores else 0.0
    return {
        "company_count": len(companies),
        "average_sentiment": round(avg_sentiment, 2),
        "risk_distribution": dict(risk_levels),
        "top_topics": topics.most_common(5),
    }


def render_markdown(summary: Dict[str, Any], report: Dict[str, Any]) -> str:
    lines = [
        "# Analysis Validation",
        "",
        f"- Company count: {summary['company_count']}",
        f"- Average sentiment score: {summary['average_sentiment']}",
        "- Risk distribution:",
    ]
    for level, count in summary["risk_distribution"].items():
        lines.append(f"  - {level}: {count}")
    lines.append("- Top topics:")
    for topic, count in summary["top_topics"]:
        lines.append(f"  - {topic}: {count}")
    lines.append("")
    lines.append("## Company Details")
    for company in report.get("companies_detected", []):
        lines.append(f"### {company['company_identifier']}")
        lines.append(f"- Score: {company.get('overall_score', company.get('score', 'N/A'))}")
        lines.append(f"- Sentiment: {company.get('sentiment', {})}")
        lines.append(f"- Risk: {company.get('risk', {})}")
        lines.append(f"- Culture: {company.get('culture', {})}")
        if company.get("topics"):
            lines.append(f"- Topics: {', '.join(company['topics'])}")
        lines.append("")
    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser(description="Export analysis validation report")
    parser.add_argument("--input", required=True, help="Input JSON from run_mission.py")
    parser.add_argument("--output", required=True, help="Output Markdown path")
    args = parser.parse_args()

    data = json.loads(Path(args.input).read_text(encoding="utf-8"))
    report = data.get("report", {})
    summary = summarize_analysis(report)
    markdown = render_markdown(summary, report)
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(markdown, encoding="utf-8")
    print(f"Analysis validation report written to {output_path}")


if __name__ == "__main__":
    main()
