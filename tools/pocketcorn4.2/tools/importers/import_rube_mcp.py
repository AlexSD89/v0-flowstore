"""Prepare Rube MCP integration."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CONFIG_PATH = ROOT / "config" / "mcp" / "rube.yaml"
SAMPLE_PATH = ROOT / "data" / "samples" / "rube_samples.json"

SAMPLE_DATA = {
    "news_portal": [
        {
            "company": "aurora-ai",
            "category": "market",
            "summary": "36氪报道 Aurora AI 计划在东南亚设立区域总部。",
            "link": "https://36kr.com/p/1234567890",
            "captured_at": "2025-09-19T02:20:00+00:00",
            "reliability": 0.72,
            "cultural_tags": ["zh-CN", "international"],
            "region": "SEA"
        }
    ]
}


def ensure_sample_file() -> None:
    SAMPLE_PATH.parent.mkdir(parents=True, exist_ok=True)
    if SAMPLE_PATH.exists():
        return
    SAMPLE_PATH.write_text(json.dumps(SAMPLE_DATA, ensure_ascii=False, indent=2), encoding="utf-8")


def ensure_config_reference() -> None:
    if not CONFIG_PATH.exists():
        raise FileNotFoundError(f"未找到配置文件: {CONFIG_PATH}")
    text = CONFIG_PATH.read_text(encoding="utf-8")
    if "sample_data:" in text:
        return
    CONFIG_PATH.write_text(text.rstrip() + "\nsample_data: \"../../data/samples/rube_samples.json\"\n", encoding="utf-8")


def main() -> None:
    ensure_sample_file()
    ensure_config_reference()
    print("Rube MCP 集成准备完成。")
    print("- 若要连接真实 Rube 服务，请配置 endpoint/auth，并让任务将输出写入统一存储后扩展 rube_client.py。")


if __name__ == "__main__":
    main()
