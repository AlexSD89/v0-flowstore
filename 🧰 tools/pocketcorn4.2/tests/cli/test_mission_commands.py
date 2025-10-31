from __future__ import annotations

import json
from pathlib import Path

from pocketcorn.cli import mission_commands as cli


def reset_services() -> None:
    cli._GLOBAL_REPOSITORY = None
    cli._GLOBAL_ORCHESTRATOR = None


def test_cli_full_and_analyze(tmp_path, capsys) -> None:
    reset_services()
    json_path = tmp_path / "full.json"
    md_path = tmp_path / "full.md"
    cli.main([
        "full",
        "--geography",
        "CN,US",
        "--output-json",
        str(json_path),
        "--output-md",
        str(md_path),
    ])
    assert json_path.exists()
    assert md_path.exists()

    capsys.readouterr()  # clear output

    summary = json.loads(json_path.read_text(encoding="utf-8"))
    mission_id = summary["mission"]["mission_id"]

    cli.main(["analyze", mission_id])
    output = capsys.readouterr().out
    assert "company_count" in output
