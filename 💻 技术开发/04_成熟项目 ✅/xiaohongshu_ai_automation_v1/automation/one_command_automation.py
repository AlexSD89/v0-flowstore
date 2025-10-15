#!/usr/bin/env python3
"""
LaunchX XiaoHongShu automation orchestrator.

该脚本用于按既定流水线（情报 → 模板 → 审核 → 发布 → 复盘）调度自动化任务。
支持按模式运行：plan（规划阶段）、publish（执行阶段）、full（全流程）。
"""

from __future__ import annotations

import argparse
import json
import logging
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

PROJECT_ROOT = Path(__file__).resolve().parents[1]
AUTOMATION_ROOT = PROJECT_ROOT / "automation"
CLIENTS_ROOT = PROJECT_ROOT / "clients"


# --------------------------------------------------------------------------- #
# Logging helpers
# --------------------------------------------------------------------------- #

def setup_logger(client_slug: str, timestamp: str) -> tuple[logging.Logger, Path]:
    log_dir = CLIENTS_ROOT / client_slug / "logs"
    log_dir.mkdir(parents=True, exist_ok=True)
    log_path = log_dir / f"one_command_{timestamp}.log"

    logger = logging.getLogger("one_command")
    logger.handlers.clear()
    logger.setLevel(logging.INFO)

    formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")

    file_handler = logging.FileHandler(log_path, encoding="utf-8")
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    logger.debug("日志初始化完成: %s", log_path)
    return logger, log_path


# --------------------------------------------------------------------------- #
# Utility functions
# --------------------------------------------------------------------------- #

def run_subprocess(command: List[str], logger: logging.Logger, dry_run: bool = False) -> None:
    """Run a subprocess command with logging."""
    logger.info("执行命令: %s", " ".join(command))
    if dry_run:
        logger.info("Dry-run 开启，命令未真正执行。")
        return

    result = subprocess.run(command, cwd=PROJECT_ROOT)
    if result.returncode != 0:
        raise RuntimeError(f"命令执行失败: {' '.join(command)}")


def load_status(client_slug: str) -> Dict[str, Any]:
    status_path = CLIENTS_ROOT / client_slug / "status.json"
    if status_path.exists():
        try:
            return json.loads(status_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            return {}
    return {}


def save_status(client_slug: str, status: Dict[str, Any]) -> None:
    status_path = CLIENTS_ROOT / client_slug / "status.json"
    status_path.parent.mkdir(parents=True, exist_ok=True)
    status_path.write_text(json.dumps(status, ensure_ascii=False, indent=2), encoding="utf-8")


def append_pipeline_status(
    client_slug: str,
    mode: str,
    schedule: Optional[str],
    dry_run: bool,
    stages: List[Dict[str, Any]],
    log_path: Path,
) -> None:
    status = load_status(client_slug)
    pipeline_runs = status.setdefault("pipeline_runs", [])
    pipeline_runs.append(
        {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "mode": mode,
            "schedule": schedule,
            "dry_run": dry_run,
            "stages": stages,
            "log": log_path.relative_to(PROJECT_ROOT).as_posix(),
        }
    )
    save_status(client_slug, status)


def ensure_quality_gate(client_slug: str, logger: logging.Logger) -> None:
    quality_dir = CLIENTS_ROOT / client_slug / "data" / "quality_logs"
    if not quality_dir.exists():
        raise RuntimeError(f"未找到质量审核目录: {quality_dir}")

    quality_files = sorted(quality_dir.glob("quality_log_*.json"))
    if not quality_files:
        raise RuntimeError(f"未找到质量审核记录，请先完成人工审核: {quality_dir}")

    latest_path = quality_files[-1]
    logger.info("检测质量日志: %s", latest_path)
    payload = json.loads(latest_path.read_text(encoding="utf-8"))

    reviews = payload.get("draft_reviews", [])
    approved = any(str(item.get("status")).lower() == "approved" for item in reviews)
    if not approved:
        raise RuntimeError(f"{latest_path} 中未发现 Approved 状态，请确认审核已通过。")


# --------------------------------------------------------------------------- #
# Pipeline orchestration
# --------------------------------------------------------------------------- #

def stage_daily_intel(client_slug: str, logger: logging.Logger, dry_run: bool) -> Dict[str, Any]:
    command = [
        "python",
        str(AUTOMATION_ROOT / "daily_intel_task.py"),
        "--client",
        client_slug,
    ]
    run_subprocess(command, logger, dry_run=dry_run)
    return {"stage": "daily_intel", "status": "dry-run" if dry_run else "completed"}


def stage_spec_refresh(client_slug: str, logger: logging.Logger, dry_run: bool) -> Dict[str, Any]:
    config_path = AUTOMATION_ROOT / "spec-kit" / "configs" / f"{client_slug}.json"
    command = [
        "python",
        str(AUTOMATION_ROOT / "spec-kit" / "bootstrap_client.py"),
        "--client",
        client_slug,
        "--config",
        str(config_path),
        "--force",
    ]
    run_subprocess(command, logger, dry_run=dry_run)
    return {"stage": "spec_refresh", "status": "dry-run" if dry_run else "completed"}


def stage_run_client(
    client_slug: str,
    logger: logging.Logger,
    dry_run: bool,
    task_id: Optional[str] = None,
    skip_quality_gate: bool = False,
) -> Dict[str, Any]:
    command = [
        "python",
        str(AUTOMATION_ROOT / "run_client.py"),
        "--client",
        client_slug,
    ]
    if task_id:
        command.extend(["--task-id", task_id])
    if dry_run:
        command.append("--dry-run")
    if skip_quality_gate:
        command.append("--no-quality-gate")
    run_subprocess(command, logger, dry_run=dry_run)
    return {
        "stage": "run_client",
        "status": "dry-run" if dry_run else "completed",
        "task_id": task_id or "default",
        "quality_gate": "skipped" if skip_quality_gate or dry_run else "enforced",
    }


def stage_learn_from_trending(client_slug: str, logger: logging.Logger, dry_run: bool) -> Dict[str, Any]:
    command = [
        "python",
        str(AUTOMATION_ROOT / "learn_from_trending.py"),
        "--client",
        client_slug,
    ]
    run_subprocess(command, logger, dry_run=dry_run)
    return {"stage": "learn_from_trending", "status": "dry-run" if dry_run else "completed"}


def stage_update_spec(client_slug: str, logger: logging.Logger, dry_run: bool) -> Dict[str, Any]:
    command = [
        "python",
        str(AUTOMATION_ROOT / "update_spec_from_feedback.py"),
        "--client",
        client_slug,
    ]
    run_subprocess(command, logger, dry_run=dry_run)
    return {"stage": "update_spec_from_feedback", "status": "dry-run" if dry_run else "completed"}


def orchestrate_pipeline(
    client_slug: str,
    mode: str,
    schedule: Optional[str],
    dry_run: bool,
    skip_intel: bool,
    skip_analysis: bool,
    override_quality_gate: bool,
    safe_mode: bool,
    notify: bool,
    custom_task_id: Optional[str],
) -> Path:
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    logger, log_path = setup_logger(client_slug, timestamp)

    logger.info("启动一键自动化: client=%s mode=%s schedule=%s dry_run=%s", client_slug, mode, schedule, dry_run)

    stages: List[Dict[str, Any]] = []

    try:
        if safe_mode and not dry_run:
            logger.warning("Safe Mode：执行前请人工确认是否继续 (Y/n)")
            answer = input().strip().lower()
            if answer.startswith("n"):
                logger.info("用户取消执行。")
                append_pipeline_status(client_slug, mode, schedule, dry_run, stages, log_path)
                return log_path

        if mode in ("plan", "full") and not skip_intel:
            logger.info("阶段: 情报采集")
            stages.append(stage_daily_intel(client_slug, logger, dry_run))
        else:
            stages.append({"stage": "daily_intel", "status": "skipped"})

        if mode in ("plan", "full"):
            logger.info("阶段: 模板刷新")
            stages.append(stage_spec_refresh(client_slug, logger, dry_run))
        else:
            stages.append({"stage": "spec_refresh", "status": "skipped"})

        if mode in ("publish", "full"):
            if dry_run:
                logger.info("Dry-run 模式跳过质量 gate 检查。")
            elif not override_quality_gate:
                logger.info("阶段: 质量 gate 检查")
                ensure_quality_gate(client_slug, logger)
            else:
                logger.warning("质量 gate 已被覆盖，直接进入执行阶段。")
            logger.info("阶段: 发布/互动执行")
            stages.append(
                stage_run_client(
                    client_slug,
                    logger,
                    dry_run,
                    custom_task_id,
                    skip_quality_gate=override_quality_gate,
                )
            )
        else:
            stages.append({"stage": "run_client", "status": "skipped"})

        if mode == "full" and not skip_analysis:
            logger.info("阶段: 爆款学习")
            stages.append(stage_learn_from_trending(client_slug, logger, dry_run))
            logger.info("阶段: 复盘报告")
            stages.append(stage_update_spec(client_slug, logger, dry_run))
        else:
            stages.append({"stage": "learn_from_trending", "status": "skipped"})
            stages.append({"stage": "update_spec_from_feedback", "status": "skipped"})

        append_pipeline_status(client_slug, mode, schedule, dry_run, stages, log_path)
        logger.info("一键自动化完成。详情记录于 %s", log_path)
        if notify and not dry_run:
            logger.warning("通知：流程执行成功（可扩展为 Slack/邮件）。")

    except Exception as exc:  # pylint: disable=broad-except
        logger.exception("流水线执行失败: %s", exc)
        stages.append({"stage": "error", "status": "failed", "reason": str(exc)})
        append_pipeline_status(client_slug, mode, schedule, dry_run, stages, log_path)
        if notify:
            logger.warning("通知：流程执行失败（可扩展为 Slack/邮件）。")
        raise

    return log_path


# --------------------------------------------------------------------------- #
# CLI
# --------------------------------------------------------------------------- #

def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="LaunchX XiaoHongShu automation orchestrator")
    parser.add_argument("--client", required=True, help="客户 slug，例如 launch-x")
    parser.add_argument(
        "--mode",
        choices=["plan", "publish", "full"],
        default="full",
        help="plan=情报+模板，publish=执行，full=全流程",
    )
    parser.add_argument("--schedule", choices=["daily", "weekly", "adhoc"], help="用于记录的调度标签")
    parser.add_argument("--dry-run", action="store_true", help="仅打印命令，不实际执行")
    parser.add_argument("--skip-intel", action="store_true", help="跳过情报采集阶段")
    parser.add_argument("--skip-analysis", action="store_true", help="跳过分析与复盘阶段")
    parser.add_argument("--override-quality-gate", action="store_true", help="忽略质量审核 gate")
    parser.add_argument("--safe-mode", action="store_true", help="安全模式：执行前需人工确认")
    parser.add_argument("--notify", action="store_true", help="完成后发送通知（TODO: 接入 Slack/邮件）")
    parser.add_argument("--task-id", help="指定 Claude Task ID，默认为 client_slug_automation")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    orchestrate_pipeline(
        client_slug=args.client,
        mode=args.mode,
        schedule=args.schedule,
        dry_run=args.dry_run,
        skip_intel=args.skip_intel,
        skip_analysis=args.skip_analysis,
        override_quality_gate=args.override_quality_gate,
        safe_mode=args.safe_mode,
        notify=args.notify,
        custom_task_id=args.task_id,
    )


if __name__ == "__main__":
    main()
