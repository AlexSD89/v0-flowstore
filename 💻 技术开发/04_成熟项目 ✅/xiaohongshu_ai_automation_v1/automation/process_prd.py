#!/usr/bin/env python3
"""Parse a customer PRD and populate automation configs.

This utility performs lightweight keyword extraction from a Markdown/文本PRD,
fills `automation/spec-kit/configs/<client>.json`, and records outstanding
questions for missing fields. It is intentionally rule-based so it can run
without额外依赖;对于复杂自然语言，可先由 Rube/BMAD agent 预处理，再调用此脚本。
"""
from __future__ import annotations

import argparse
import json
import re
import shutil
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple

ROOT = Path(__file__).resolve().parents[1]
CONFIG_DIR = ROOT / "automation" / "spec-kit" / "configs"
CLIENTS_DIR = ROOT / "clients"

FIELD_PATTERNS: Dict[str, Tuple[str, List[str]]] = {
    "industry": ("行业", [r"行业[:：]\s*(.+)", r"所属行业[:：]\s*(.+)"]),
    "target_audience": ("目标受众", [r"目标用户[:：]\s*(.+)", r"受众[:：]\s*(.+)"]),
    "brand_voice_keywords": ("品牌语调", [r"语调[:：]\s*(.+)", r"语气[:：]\s*(.+)"]),
    "disallowed_phrases": ("禁忌表述", [r"禁忌[:：]\s*(.+)", r"避开词[:：]\s*(.+)"]),
    "publish_frequency": ("发布频率", [r"发布频率[:：]\s*(.+)", r"频次[:：]\s*(.+)"]),
    "platforms": ("渠道平台", [r"(小红书|知乎|B站|微博|抖音)", r"平台[:：]\s*(.+)"]),
    "business_goals": ("商业目标", [r"商业目标[:：]\s*(.+)", r"KPI[:：]\s*(.+)"]),
    "report_frequency": ("报告频率", [r"报告频率[:：]\s*(.+)"]),
}

DEFAULT_LIST_FIELDS = {"brand_voice_keywords", "disallowed_phrases", "platforms"}


def parse_fields(text: str) -> Tuple[Dict[str, object], List[str]]:
    extracted: Dict[str, object] = {}
    missing: List[str] = []
    lowered = text.lower()
    for key, (label, patterns) in FIELD_PATTERNS.items():
        value = None
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                value = match.group(1).strip()
                break
        if value:
            if key in DEFAULT_LIST_FIELDS:
                parts = re.split(r"[,，/、]\s*", value)
                extracted[key] = [p.strip() for p in parts if p.strip()]
            else:
                extracted[key] = value
        else:
            # 简单启发式：部分字段可从文本中判断
            if key == "platforms":
                platforms = sorted({p for p in ["小红书", "知乎", "B站", "微博", "抖音"] if p.lower() in lowered})
                if platforms:
                    extracted[key] = platforms
                else:
                    missing.append(label)
            else:
                missing.append(label)
    return extracted, missing


def merge_config(base: Dict[str, object], updates: Dict[str, object]) -> Dict[str, object]:
    merged = dict(base)
    for key, value in updates.items():
        if key in DEFAULT_LIST_FIELDS:
            existing = merged.get(key, []) or []
            if not isinstance(existing, list):
                existing = [str(existing)]
            new_values = list(dict.fromkeys(existing + list(value)))
            merged[key] = new_values
        else:
            if not merged.get(key):
                merged[key] = value
    return merged


def normalise_config(config: Dict[str, object]) -> Dict[str, object]:
    # Map parsed keys to config schema
    mapping = {
        "industry": "industry",
        "target_audience": "target_audience",
        "brand_voice_keywords": "brand_voice_keywords",
        "disallowed_phrases": "disallowed_phrases",
        "platforms": "platform_mix",
        "publish_frequency": "publish_frequency",
        "business_goals": "project_goal",
        "report_frequency": "report_frequency",
    }
    normalised: Dict[str, object] = {}
    for src, dest in mapping.items():
        if src in config:
            value = config[src]
            if src == "platforms" and isinstance(value, list):
                normalised[dest] = "、".join(value)
            else:
                normalised[dest] = value
    return normalised


def write_questions(client_slug: str, missing: List[str]) -> None:
    if not missing:
        return
    target = CLIENTS_DIR / client_slug / "questions.md"
    lines = ["# 待确认信息", "", *(f"- {item}" for item in missing), ""]
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text("\n".join(lines), encoding="utf-8")
    print(f"[info] 仍需确认: {', '.join(missing)} → {target}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Parse client PRD into config placeholders")
    parser.add_argument("--client", required=True, help="client slug, e.g. launch-x")
    parser.add_argument("--prd", required=True, help="path to PRD markdown/text")
    parser.add_argument("--output", help="override output config path")
    parser.add_argument("--force", action="store_true", help="overwrite existing fields")
    args = parser.parse_args()

    client_slug = args.client
    prd_path = Path(args.prd).resolve()
    if not prd_path.exists():
        raise FileNotFoundError(prd_path)

    text = prd_path.read_text(encoding="utf-8")
    parsed, missing = parse_fields(text)
    normalised = normalise_config(parsed)

    output_path = Path(args.output) if args.output else (CONFIG_DIR / f"{client_slug}.json")
    existing = {}
    if output_path.exists():
        try:
            existing = json.loads(output_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            print(f"[warn] {output_path} 不是合法 JSON，使用空配置重建。")
            existing = {}

    if args.force:
        merged = {**existing, **normalised}
    else:
        merged = merge_config(existing, normalised)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(merged, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"[info] 配置已写入 {output_path}")

    # 归档 PRD 文件
    dest_dir = CLIENTS_DIR / client_slug / "docs"
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest_path = dest_dir / prd_path.name
    if dest_path.exists() and not prd_path.samefile(dest_path):
        suffix = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
        dest_path = dest_dir / f"{prd_path.stem}_{suffix}{prd_path.suffix}"
    shutil.copy2(prd_path, dest_path)
    print(f"[info] PRD 已归档至 {dest_path}")

    write_questions(client_slug, missing)


if __name__ == "__main__":
    main()
