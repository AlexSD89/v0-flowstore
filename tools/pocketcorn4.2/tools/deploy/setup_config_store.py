"""Ensure configuration scaffolding exists and remind to populate .env."""
from __future__ import annotations

from pathlib import Path

CONFIG_DIR = Path("config")
ENV_EXAMPLE = CONFIG_DIR / ".env.example"


def main() -> None:
    CONFIG_DIR.mkdir(exist_ok=True)
    if ENV_EXAMPLE.exists():
        print(f"Config directory ready. Populate secrets based on {ENV_EXAMPLE}.")
    else:
        raise FileNotFoundError(f"Missing {ENV_EXAMPLE}; re-run importers to regenerate.")


if __name__ == "__main__":
    main()
