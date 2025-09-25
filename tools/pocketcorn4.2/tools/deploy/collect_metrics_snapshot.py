from __future__ import annotations

import argparse
import json
from pathlib import Path
from statistics import mean

SOURCE = Path("reports/metrics_overview.json")


def main() -> None:
    parser = argparse.ArgumentParser(description="Collect production metrics snapshot")
    parser.add_argument("--output", required=True, help="JSON file to write snapshot")
    args = parser.parse_args()

    if SOURCE.exists():
        data = json.loads(SOURCE.read_text(encoding="utf-8"))
    else:
        data = {"missions_analyzed": 0, "avg_signals": 0, "missions": []}
    # simple derived metrics
    total_signals = sum(m.get("signals", 0) for m in data.get("missions", []))
    snapshot = {
        "missions_analyzed": data.get("missions_analyzed", 0),
        "total_signals": total_signals,
        "avg_signals": data.get("avg_signals", 0),
    }
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Production metrics snapshot written to {output}")


if __name__ == "__main__":
    main()
