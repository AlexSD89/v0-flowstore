"""Simple Task Orchestrator for Pocketcorn v4.2 upgrade plan.

Usage examples:

    python manage_tasks.py list
    python manage_tasks.py list --phase phase2_analysis
    python manage_tasks.py run T201              # dry-run single task
    python manage_tasks.py run phase1_collectors --execute

The script consumes YAML task definitions placed under tasks/.
"""
from __future__ import annotations

import argparse
import datetime as dt
import subprocess
import sys
from collections import deque
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Set

try:
    import yaml
except ImportError as exc:  # pragma: no cover - dependency guard
    sys.stderr.write(
        "PyYAML 未安装。请先运行 `pip install pyyaml rich` 或参考 tasks/README.md 再重试。\n"
    )
    raise

ROOT_DIR = Path(__file__).resolve().parent
TASK_DIR = ROOT_DIR / "tasks"
LOG_DIR = ROOT_DIR / "reports" / "task_logs"


@dataclass
class Task:
    id: str
    name: str
    description: str
    commands: List[str] = field(default_factory=list)
    depends_on: List[str] = field(default_factory=list)
    outputs: List[str] = field(default_factory=list)
    tags: List[str] = field(default_factory=list)
    phase: str = ""
    source_file: Path = Path()
    follows: Optional[str] = None  # for master_plan meta tasks

    def is_meta(self) -> bool:
        return not self.commands and self.follows is not None


def load_tasks(task_dir: Path) -> Dict[str, Task]:
    tasks: Dict[str, Task] = {}
    for yaml_path in sorted(task_dir.glob("*.yaml")):
        data = yaml.safe_load(yaml_path.read_text(encoding="utf-8"))
        if not data:
            continue
        phase = data.get("phase", yaml_path.stem)
        for entry in data.get("tasks", []):
            task = Task(
                id=entry["id"],
                name=entry.get("name", ""),
                description=entry.get("description", ""),
                commands=entry.get("commands", []) or [],
                depends_on=entry.get("depends_on", []) or entry.get("depends", []) or [],
                outputs=entry.get("outputs", []) or [],
                tags=entry.get("tags", []) or [],
                phase=phase,
                source_file=yaml_path,
                follows=entry.get("follows"),
            )
            if task.id in tasks:
                raise ValueError(f"Duplicate task id detected: {task.id}")
            tasks[task.id] = task
    return tasks


def list_tasks(tasks: Dict[str, Task], phase: Optional[str]) -> None:
    filtered: Iterable[Task]
    if phase:
        filtered = (t for t in tasks.values() if t.phase == phase)
    else:
        filtered = tasks.values()
    for task in sorted(filtered, key=lambda t: (t.phase, task_order_key(t))):
        print(f"[{task.phase}] {task.id}: {task.name}")
        print(f"  描述: {task.description.strip()}")
        if task.depends_on:
            print(f"  依赖: {', '.join(task.depends_on)}")
        if task.commands:
            print(f"  Commands: {', '.join(task.commands)}")
        if task.outputs:
            print(f"  输出: {', '.join(task.outputs)}")
        if task.tags:
            print(f"  Tags: {', '.join(task.tags)}")
        if task.is_meta():
            print(f"  Follows phase: {task.follows}")
        print()


def task_order_key(task: Task) -> tuple:
    # keep numeric tasks sorted by numeric part, else lexical
    digits = ''.join(ch for ch in task.id if ch.isdigit())
    return int(digits) if digits else task.id


def resolve_sequence(tasks: Dict[str, Task], target: str) -> List[Task]:
    if target in tasks:
        seeds = [target]
    else:
        seeds = [task.id for task in tasks.values() if task.phase == target]
        if not seeds:
            raise ValueError(f"Unknown task or phase: {target}")

    resolved: List[Task] = []
    visited: Set[str] = set()

    def dfs(task_id: str) -> None:
        if task_id in visited:
            return
        if task_id not in tasks:
            raise ValueError(f"Task {task_id} referenced but not defined")
        task = tasks[task_id]
        for dep in task.depends_on:
            dfs(dep)
        visited.add(task_id)
        resolved.append(task)

    for seed in seeds:
        dfs(seed)
    return resolved


def run_tasks(tasks: Dict[str, Task], target: str, execute: bool, continue_on_error: bool) -> None:
    to_run = resolve_sequence(tasks, target)
    expanded: List[Task] = []
    for task in to_run:
        if task.is_meta() and task.follows:
            expanded.extend(resolve_sequence(tasks, task.follows))
        else:
            expanded.append(task)

    seen: Set[str] = set()
    final_sequence: List[Task] = []
    for task in expanded:
        if task.id not in seen:
            final_sequence.append(task)
            seen.add(task.id)

    LOG_DIR.mkdir(parents=True, exist_ok=True)
    log_path = LOG_DIR / f"task_run_{dt.datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.log"
    with log_path.open("w", encoding="utf-8") as log_fp:
        for task in final_sequence:
            header = f"\n=== {task.id} | {task.name} (phase: {task.phase}) ===\n"
            sys.stdout.write(header)
            log_fp.write(header)
            log_fp.write(task.description.strip() + "\n")
            if not task.commands:
                info = "(no commands – meta or documentation task)\n"
                sys.stdout.write(info)
                log_fp.write(info)
                continue
            for cmd in task.commands:
                cmd_line = f"$ {cmd}\n"
                sys.stdout.write(cmd_line)
                log_fp.write(cmd_line)
                if not execute:
                    continue
                try:
                    subprocess.run(cmd, shell=True, check=True, cwd=ROOT_DIR)
                except subprocess.CalledProcessError as exc:
                    error_line = f"Command failed with exit code {exc.returncode}\n"
                    sys.stdout.write(error_line)
                    log_fp.write(error_line)
                    if not continue_on_error:
                        sys.stdout.write(f"终止执行，日志保存于 {log_path}\n")
                        return
        sys.stdout.write(f"\n任务执行完成，日志保存于 {log_path}\n")


def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Pocketcorn Task Orchestrator")
    sub = parser.add_subparsers(dest="command", required=True)

    list_parser = sub.add_parser("list", help="列出任务")
    list_parser.add_argument("--phase", help="按阶段过滤，如 phase1_collectors")

    run_parser = sub.add_parser("run", help="执行任务或阶段")
    run_parser.add_argument("target", help="任务 ID 或阶段名，例如 T201 或 phase2_analysis")
    run_parser.add_argument("--execute", action="store_true", help="实际执行 commands（默认只预览）")
    run_parser.add_argument("--continue-on-error", action="store_true", help="出错时继续执行余下任务")

    return parser


def main(argv: Optional[List[str]] = None) -> int:
    parser = build_arg_parser()
    args = parser.parse_args(argv)

    if not TASK_DIR.exists():
        parser.error(f"tasks 目录不存在: {TASK_DIR}")

    tasks = load_tasks(TASK_DIR)

    if args.command == "list":
        list_tasks(tasks, args.phase)
        return 0

    if args.command == "run":
        run_tasks(tasks, args.target, execute=args.execute, continue_on_error=args.continue_on_error)
        return 0

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
