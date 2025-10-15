from __future__ import annotations

import json
from pathlib import Path
from statistics import mean

REPORTS = [
    Path("reports/staging_phase1.json"),
    Path("reports/staging_phase2.json"),
    Path("reports/final_demo.json"),
]
OUTPUT = Path("reports/metrics_overview.json")


def extract_signals(report_path: Path) -> dict:
    data = json.loads(report_path.read_text(encoding="utf-8"))
    report = data.get("report", data)  # allow direct report payload
    return {
        "mission_id": report.get("mission_id"),
        "signals": len(report.get("signal_highlights", [])),
        "companies": len(report.get("companies_detected", [])),
    }


def main() -> None:
    metrics = []
    for report in REPORTS:
        if report.exists():
            metrics.append(extract_signals(report))
    if not metrics:
        raise FileNotFoundError("No report files available for metric verification")
    avg_signals = mean(m["signals"] for m in metrics)
    overview = {
        "missions_analyzed": len(metrics),
        "avg_signals": avg_signals,
        "missions": metrics,
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(overview, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Metrics overview written to {OUTPUT}")


if __name__ == "__main__":
    main()
