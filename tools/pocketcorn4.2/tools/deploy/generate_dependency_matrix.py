"""Generate a simple dependency matrix for Pocketcorn runtime and dev packages."""
from __future__ import annotations

import json
from pathlib import Path

RUNTIME_DEPS = {
    "pydantic": ">=2.5",
    "httpx": ">=0.27",
    "jinja2": ">=3.1",
    "PyYAML": ">=6.0",
}
DEV_DEPS = {
    "pytest": ">=8.0",
    "pytest-asyncio": ">=0.23",
}

OUTPUT = Path("reports/dependency_matrix.json")


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    matrix = {"runtime": RUNTIME_DEPS, "dev": DEV_DEPS}
    OUTPUT.write_text(json.dumps(matrix, indent=2), encoding="utf-8")
    print(f"Dependency matrix written to {OUTPUT}")


if __name__ == "__main__":
    main()
