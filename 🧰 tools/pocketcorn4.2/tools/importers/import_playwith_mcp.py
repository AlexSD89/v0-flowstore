"""Prepare Playwith MCP integration.

- Ensures sample data JSON exists.
- Appends sample_data field in config if missing.
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CONFIG_PATH = ROOT / "config" / "mcp" / "playwith.yaml"
SAMPLE_PATH = ROOT / "data" / "samples" / "playwith_samples.json"

SAMPLE_CONTENT = {
    "linkedin": [
        {
            "company": "aurora-ai",
            "category": "fundraising",
            "summary": "创始人在 LinkedIn 发布融资动态，宣布完成 1000 万美元 A 轮。",
            "link": "https://linkedin.com/posts/aurora_ai/funding",
            "captured_at": "2025-09-18T15:00:00+00:00",
            "reliability": 0.78,
            "cultural_tags": ["en-US", "investor"],
            "round": "Series A",
            "amount_musd": 10
        }
    ],
    "github": [
        {
            "company": "aurora-ai",
            "category": "technology",
            "summary": "核心仓库在过去一周新增 5 名贡献者。",
            "link": "https://github.com/aurora-ai/core",
            "captured_at": "2025-09-19T00:30:00+00:00",
            "reliability": 0.9,
            "cultural_tags": ["developer"],
            "new_contributors": 5
        }
    ]
}


def ensure_sample_file() -> None:
    SAMPLE_PATH.parent.mkdir(parents=True, exist_ok=True)
    if SAMPLE_PATH.exists():
        return
    SAMPLE_PATH.write_text(json.dumps(SAMPLE_CONTENT, ensure_ascii=False, indent=2), encoding="utf-8")


def ensure_config_reference() -> None:
    if not CONFIG_PATH.exists():
        raise FileNotFoundError(f"未找到配置文件: {CONFIG_PATH}")
    text = CONFIG_PATH.read_text(encoding="utf-8")
    if "sample_data:" in text:
        return
    CONFIG_PATH.write_text(text.rstrip() + "\n\nsample_data: \"../../data/samples/playwith_samples.json\"\n", encoding="utf-8")


def main() -> None:
    ensure_sample_file()
    ensure_config_reference()
    print("Playwith MCP 集成准备完成。")
    print("- 如需接入真实 Playwith MCP，请在配置中写入 endpoint/auth，并将服务输出写入统一存储后扩展 playwith_client.py。")


if __name__ == "__main__":
    main()
