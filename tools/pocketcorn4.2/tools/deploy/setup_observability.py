"""Stub script to signal observability configuration."""
from __future__ import annotations

from pathlib import Path

CONFIG = Path("config/observability.yaml")


def main() -> None:
    if CONFIG.exists():
        print(f"Observability config found: {CONFIG}")
    else:
        raise FileNotFoundError("config/observability.yaml missing")


if __name__ == "__main__":
    main()
