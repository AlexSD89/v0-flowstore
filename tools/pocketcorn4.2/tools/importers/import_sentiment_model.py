from __future__ import annotations

import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CONFIG_PATH = ROOT / "config" / "analysis" / "sentiment.yaml"
LEXICON_PATH = ROOT / "data" / "samples" / "sentiment_lexicon.json"
DEFAULT_LEXICON = {
    "positive": ["融资", "增长", "突破", "创新", "稳健", "扩张"],
    "negative": ["裁员", "亏损", "风险", "下滑", "警告", "迟缓"],
}


def main() -> None:
    parser = argparse.ArgumentParser(description="Prepare sentiment analysis resources")
    parser.add_argument("--model", default="lexicon", help="Model identifier (for future extension)")
    args = parser.parse_args()

    CONFIG_PATH.parent.mkdir(parents=True, exist_ok=True)
    LEXICON_PATH.parent.mkdir(parents=True, exist_ok=True)

    if not LEXICON_PATH.exists():
        LEXICON_PATH.write_text(json.dumps(DEFAULT_LEXICON, ensure_ascii=False, indent=2), encoding="utf-8")

    if not CONFIG_PATH.exists():
        CONFIG_PATH.write_text(
            "backend: lexicon\nlexicon: data/samples/sentiment_lexicon.json\nneutral_window: 0.15\n",
            encoding="utf-8",
        )
    print("Sentiment resources ready.")


if __name__ == "__main__":
    main()
