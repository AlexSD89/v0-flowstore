#!/usr/bin/env python3
"""Generate an auto-iteration report from execution feedback.

Usage:
    python automation/update_spec_from_feedback.py --client launch-x
"""
from __future__ import annotations

import argparse
import json
from datetime import datetime
from pathlib import Path
from typing import Dict, List

ROOT = Path(__file__).resolve().parents[1]
CLIENTS_ROOT = ROOT / "clients"


def load_status(client_slug: str) -> List[Dict[str, object]]:
    status_path = CLIENTS_ROOT / client_slug / "status.json"
    if not status_path.exists():
        return []
    try:
        data = json.loads(status_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return []
    return data.get("runs", [])


def summarise_status(runs: List[Dict[str, object]]) -> Dict[str, object]:
    summary = {
        "total_runs": len(runs),
        "success": 0,
        "failure": 0,
        "latest": None,
        "latest_timestamp": None,
    }
    for run in runs:
        status = str(run.get("status", "")).lower()
        if status == "success":
            summary["success"] += 1
        elif status:
            summary["failure"] += 1
    if runs:
        latest = runs[-1]
        summary["latest"] = latest
        summary["latest_timestamp"] = latest.get("timestamp")
    return summary


def build_recommendations(summary: Dict[str, object]) -> List[str]:
    recs: List[str] = []
    total = summary["total_runs"]
    success = summary["success"]
    failure = summary["failure"]
    if total == 0:
        recs.append("首次运行前，请记录基准 KPI 并收集竞品爆款参考。")
    else:
        success_rate = success / total
        if success_rate < 0.6:
            recs.append("成功率低于 60%，建议重新审视选题与发布时间窗口。")
        elif success_rate < 0.85:
            recs.append("成功率处于中位区间，可继续迭代标题与视觉风格。")
        else:
            recs.append("成功率已达到优良水平，保持当前节奏并挑选可扩散内容进行加码。")
        if failure:
            recs.append("针对失败任务，回溯 status.json 中的错误信息，明确是否为登录态或文案问题。")
    recs.append("结合 `LaunchX_XHS_Publication_Success_Record_*` 分析曝光、互动、转化，挑选传播率最高的内容要素。")
    recs.append("基于最新竞品情报，更新 `client-config.json` 中的爆款特征关键词和图片风格。")
    return recs


def write_report(client_slug: str, summary: Dict[str, object], recs: List[str]) -> Path:
    reports_dir = CLIENTS_ROOT / client_slug / "reports"
    reports_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
    report_path = reports_dir / f"Auto_Iteration_Report_{timestamp}.md"
    lines: List[str] = []
    lines.append(f"# 自动化迭代报告 ({timestamp})")
    lines.append("")
    lines.append("## 运行概览")
    lines.append(f"- 总运行次数: {summary['total_runs']}")
    lines.append(f"- 成功: {summary['success']} 次")
    lines.append(f"- 失败: {summary['failure']} 次")
    if summary["latest_timestamp"]:
        lines.append(f"- 最近一次执行: {summary['latest_timestamp']}")
    lines.append("")
    lines.append("## 建议与下一步")
    for rec in recs:
        lines.append(f"- {rec}")
    lines.append("")
    lines.append("## 数据参考")
    lines.append("- 阅读 `clients/<client>/data/` 下的情报与草稿，确认是否需要调整内容角度。")
    lines.append("- 更新 `automation/spec-kit/configs/<client>.json`，随后运行 `bootstrap_client.py --force` 刷新文档。")
    report_path.write_text("\n".join(lines), encoding="utf-8")
    return report_path


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate iteration report from status.json")
    parser.add_argument("--client", required=True, help="Client slug (e.g. launch-x)")
    args = parser.parse_args()

    client_slug = args.client
    runs = load_status(client_slug)
    summary = summarise_status(runs)
    recs = build_recommendations(summary)
    report_path = write_report(client_slug, summary, recs)
    print(f"[info] 自动化迭代报告已生成: {report_path}")


if __name__ == "__main__":
    main()
