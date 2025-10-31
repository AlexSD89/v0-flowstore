"""Utility script for integrating MindSpider Weibo client.

目前脚本会：
1. 确保 sample 数据文件存在（data/samples/weibo_mindspider_sample.json）。
2. 在 config/mindspider/weibo.yaml 中补充 sample_data 配置（如缺失）。
3. 打印后续接入 MindSpider 爬虫的提示。
"""
from __future__ import annotations

import json
from pathlib import Path

CONFIG_PATH = Path(__file__).resolve().parents[2] / "config" / "mindspider" / "weibo.yaml"
SAMPLE_PATH = Path(__file__).resolve().parents[2] / "data" / "samples" / "weibo_mindspider_sample.json"
SAMPLE_PAYLOAD = [
    {
        "company": "aurora-ai",
        "category": "product",
        "summary": "产品官方号发布了多模态升级，强调企业级安全能力。",
        "link": "https://weibo.com/aurora_ai/post/1",
        "captured_at": "2025-09-19T01:12:00+00:00",
        "reliability": 0.82,
        "cultural_tags": ["zh-CN", "enterprise"],
        "engagement": 352,
        "sentiment_hint": "positive"
    }
]


def ensure_sample_file() -> None:
    SAMPLE_PATH.parent.mkdir(parents=True, exist_ok=True)
    if SAMPLE_PATH.exists():
        return
    SAMPLE_PATH.write_text(json.dumps(SAMPLE_PAYLOAD, ensure_ascii=False, indent=2), encoding="utf-8")


def ensure_config_sample_ref() -> None:
    if not CONFIG_PATH.exists():
        raise FileNotFoundError(f"未找到配置文件: {CONFIG_PATH}")
    text = CONFIG_PATH.read_text(encoding="utf-8")
    marker = "sample_data:"
    if marker in text:
        return
    addition = "sample_data: \"../../data/samples/weibo_mindspider_sample.json\"\n"
    CONFIG_PATH.write_text(text.strip() + "\n" + addition, encoding="utf-8")


def main() -> None:
    ensure_sample_file()
    ensure_config_sample_ref()
    print("MindSpider Weibo 集成准备完成。")
    print("- 如需使用真实 MindSpider，配置 credentials/cookies 后运行 MindSpider 抓取流程，并在 weibo_service.py 中扩展 collect 方法。")


if __name__ == "__main__":
    main()
