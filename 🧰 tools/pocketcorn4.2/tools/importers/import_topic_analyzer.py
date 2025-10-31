from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CONFIG_PATH = ROOT / "config" / "analysis" / "topic.yaml"
KEYWORDS_PATH = ROOT / "data" / "samples" / "topic_keywords.json"
DEFAULT_KEYWORDS = {
    "growth": ["增长", "扩张", "用户", "留存", "ARPU"],
    "funding": ["融资", "投资", "募资", "轮次", "估值"],
    "product": ["发布", "迭代", "功能", "上线", "版本"],
    "partnership": ["合作", "签约", "联盟", "共建"],
    "risk": ["风险", "预警", "危机", "纠纷"]
}


def main() -> None:
    KEYWORDS_PATH.parent.mkdir(parents=True, exist_ok=True)
    CONFIG_PATH.parent.mkdir(parents=True, exist_ok=True)

    if not KEYWORDS_PATH.exists():
        KEYWORDS_PATH.write_text(json.dumps(DEFAULT_KEYWORDS, ensure_ascii=False, indent=2), encoding="utf-8")

    if not CONFIG_PATH.exists():
        CONFIG_PATH.write_text("keywords: data/samples/topic_keywords.json\nmin_hits: 1\n", encoding="utf-8")

    print("Topic analyzer resources ready.")


if __name__ == "__main__":
    main()
