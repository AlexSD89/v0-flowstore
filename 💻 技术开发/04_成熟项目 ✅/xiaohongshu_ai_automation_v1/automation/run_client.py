#!/usr/bin/env python3
"""Run a client's automation task with logging.

This script reads the client's configuration, resolves the Claude
Task blueprint, executes it, and snapshots stdout/stderr into the
client's logs directory for later review.
"""
from __future__ import annotations

import argparse
import json
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Dict, Optional

AUTOMATION_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = AUTOMATION_DIR.parent
CLIENTS_ROOT = PROJECT_ROOT / "clients"
CLAUDE_TASKS_ROOT = AUTOMATION_DIR / "claude_tasks"


def _ensure_within_project(path: Path, description: str) -> Path:
    """Confirm a path resolves under PROJECT_ROOT to avoid stray outputs."""

    resolved = path.resolve()
    try:
        resolved.relative_to(PROJECT_ROOT)
    except ValueError as exc:
        raise ValueError(f"{description} resolved outside project root: {resolved}") from exc
    return resolved


def update_status(client_slug: str, record: Dict[str, object]) -> None:
    status_path = CLIENTS_ROOT / client_slug / "status.json"
    status_path.parent.mkdir(parents=True, exist_ok=True)
    if status_path.exists():
        try:
            data = json.loads(status_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            data = {"runs": []}
    else:
        data = {"runs": []}
    data.setdefault("runs", []).append(record)
    status_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

def load_client_config(client_slug: str) -> dict:
    config_path = CLIENTS_ROOT / client_slug / "client-config.json"
    if not config_path.exists():
        raise FileNotFoundError(f"client-config.json not found for '{client_slug}': {config_path}")
    return json.loads(config_path.read_text(encoding="utf-8"))

def resolve_task_file(client_slug: str, override: Optional[str]) -> Path:
    if override:
        task_path = Path(override)
        if not task_path.is_absolute():
            task_path = (PROJECT_ROOT / override).resolve()
    else:
        task_path = (CLAUDE_TASKS_ROOT / f"{client_slug}.yaml").resolve()
    if not task_path.exists():
        raise FileNotFoundError(f"Claude task file not found: {task_path}")
    return _ensure_within_project(task_path, "Task file")

def ensure_logs_dir(client_slug: str) -> Path:
    logs_dir = (CLIENTS_ROOT / client_slug / "logs").resolve()
    logs_dir.mkdir(parents=True, exist_ok=True)
    return _ensure_within_project(logs_dir, "Logs directory")

def ensure_client_outputs(client_slug: str, config: Dict[str, object]) -> None:
    """Create configured output directories and validate they stay in-project."""

    def _resolve_optional_dir(key: str) -> Optional[Path]:
        raw = config.get(key)
        if not raw:
            return None
        candidate = Path(raw)
        if not candidate.is_absolute():
            candidate = PROJECT_ROOT / candidate
        return _ensure_within_project(candidate, f"Configured path '{key}'")

    base_dir = _ensure_within_project(CLIENTS_ROOT / client_slug, "Client directory")
    required_dirs = {base_dir}

    for maybe_dir in (
        _resolve_optional_dir("asset_output_dir"),
        _resolve_optional_dir("content_output_dir"),
        _resolve_optional_dir("data_output_dir"),
    ):
        if maybe_dir:
            required_dirs.add(maybe_dir)

    for directory in required_dirs:
        directory.mkdir(parents=True, exist_ok=True)


def run_claude_task(task_file: Path, task_id: str, dry_run: bool) -> subprocess.CompletedProcess[str]:
    command = ["claude", "tasks", "run", str(task_file), task_id]
    if dry_run:
        print("[dry-run]", " ".join(command))
        return subprocess.CompletedProcess(command, 0, "", "")
    try:
        result = subprocess.run(
            command,
            check=False,
            capture_output=True,
            text=True,
        )
    except FileNotFoundError as exc:
        raise RuntimeError("Claude CLI not found. Ensure 'claude' is installed and on PATH.") from exc
    return result

def write_log(logs_dir: Path, task_id: str, result: subprocess.CompletedProcess[str]) -> Path:
    timestamp = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
    log_path = logs_dir / f"{task_id}_{timestamp}.log"
    header = [
        f"timestamp: {timestamp}",
        f"command: {' '.join(result.args)}",
        f"exit_code: {result.returncode}",
        "--- stdout ---",
    ]
    body = "".join([result.stdout or "", "\n--- stderr ---\n", result.stderr or ""])
    log_path.write_text("\n".join(header) + "\n" + body, encoding="utf-8")
    return log_path

def main() -> None:
    parser = argparse.ArgumentParser(description="Run a client's automation task")
    parser.add_argument("--client", required=True, help="Client slug (e.g. launch-x)")
    parser.add_argument("--task-id", help="Claude task ID to run (default: <client>_automation)")
    parser.add_argument("--task-file", help="Override Claude task YAML path")
    parser.add_argument("--dry-run", action="store_true", help="Print command without executing")
    args = parser.parse_args()

    client_slug = args.client
    config = load_client_config(client_slug)
    default_task_id = args.task_id or config.get("default_run_id") or f"{client_slug}_automation"
    task_file = resolve_task_file(client_slug, args.task_file)
    logs_dir = ensure_logs_dir(client_slug)
    ensure_client_outputs(client_slug, config)

    print(f"[info] Running client '{client_slug}'")
    print(f"[info] Task file: {task_file}")
    print(f"[info] Task ID: {default_task_id}")

    result = run_claude_task(task_file, default_task_id, args.dry_run)
    if args.dry_run:
        return

    log_path = write_log(logs_dir, default_task_id, result)

    status = "success" if result.returncode == 0 else "failure"
    print(f"[info] Run finished with status: {status}")
    print(f"[info] Log saved to: {log_path}")

    try:
        relative_log = log_path.relative_to(PROJECT_ROOT)
        log_reference = str(relative_log)
    except ValueError:
        log_reference = str(log_path)

    record = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "task_id": default_task_id,
        "status": status,
        "exit_code": result.returncode,
        "log": log_reference,
    }
    update_status(client_slug, record)

    if result.returncode != 0:
        raise SystemExit(result.returncode)

if __name__ == "__main__":
    main()
