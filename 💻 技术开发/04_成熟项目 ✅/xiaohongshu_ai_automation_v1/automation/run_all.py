#!/usr/bin/env python3
"""Batch runner for multi-client automation flows."""
from __future__ import annotations

import argparse
import json
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Dict, Iterable, List

ROOT = Path(__file__).resolve().parents[1]
REGISTRY_PATH = ROOT / "automation" / "client_registry.json"
BOOTSTRAP = ROOT / "automation" / "spec-kit" / "bootstrap_client.py"
RUNNER = ROOT / "automation" / "run_client.py"


def load_registry() -> Dict[str, object]:
    if not REGISTRY_PATH.exists():
        raise FileNotFoundError(f"未找到客户注册表: {REGISTRY_PATH}")
    return json.loads(REGISTRY_PATH.read_text(encoding="utf-8"))


def iter_clients(data: Dict[str, object]) -> Iterable[Dict[str, object]]:
    clients = data.get("clients", [])
    for entry in clients:
        if not entry.get("enabled", True):
            continue
        yield entry


def run_bootstrap(client: Dict[str, object], force: bool, dry: bool) -> None:
    slug = client["slug"]
    config_path = client.get("config")
    if not config_path:
        print(f"[warn] {slug}: 未配置 config 路径，跳过模板生成")
        return
    config_abs = (ROOT / config_path).resolve()
    cmd = ["python", str(BOOTSTRAP), "--client", slug, "--config", str(config_abs)]
    if force:
        cmd.append("--force")
    if dry:
        print("[dry-run]", " ".join(cmd))
        return
    print(f"[info] 生成模板: {' '.join(cmd)}")
    subprocess.run(cmd, check=True)


def run_client(slug: str, dry: bool) -> int:
    cmd = ["python", str(RUNNER), "--client", slug]
    if dry:
        cmd.append("--dry-run")
    print(f"[info] 执行客户端: {' '.join(cmd)}")
    result = subprocess.run(cmd, check=False)
    return result.returncode


def main() -> None:
    parser = argparse.ArgumentParser(description="Run automation for all registered clients")
    parser.add_argument("--filter", nargs="*", help="Only run selected client slugs")
    parser.add_argument("--refresh-docs", action="store_true", help="Regenerate templates before running")
    parser.add_argument("--force", action="store_true", help="Force overwrite when regenerating templates")
    parser.add_argument("--dry-run", action="store_true", help="Print commands without executing")
    args = parser.parse_args()

    registry = load_registry()
    filters = set(args.filter or [])
    summary: List[Dict[str, object]] = []

    for entry in iter_clients(registry):
        slug = entry["slug"]
        if filters and slug not in filters:
            continue
        print(f"\n=== {slug} ===")
        start = datetime.utcnow()
        status = "success"
        message = ""
        try:
            if args.refresh_docs:
                run_bootstrap(entry, args.force, args.dry_run)
            code = run_client(slug, args.dry_run)
            if code != 0 and not args.dry_run:
                status = "failed"
                message = f"exit_code={code}"
        except subprocess.CalledProcessError as exc:
            status = "failed"
            message = f"command failed: {exc}"
        summary.append({
            "slug": slug,
            "status": status if not args.dry_run else "dry-run",
            "message": message,
            "started_at": start.isoformat() + "Z",
        })

    print("\n=== 运行总结 ===")
    for item in summary:
        print(f"- {item['slug']}: {item['status']} {item['message']}")


if __name__ == "__main__":
    main()
