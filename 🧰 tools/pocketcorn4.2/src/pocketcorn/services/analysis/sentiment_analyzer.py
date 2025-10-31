from __future__ import annotations

import json
import math
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, List, Optional

try:
    import yaml
except ImportError:  # pragma: no cover - optional dependency
    yaml = None

PROJECT_ROOT = Path(__file__).resolve().parents[3]
CONFIG_ROOT = PROJECT_ROOT / "config" / "analysis"
DEFAULT_CONFIG = CONFIG_ROOT / "sentiment.yaml"
DEFAULT_LEXICON = PROJECT_ROOT / "data" / "samples" / "sentiment_lexicon.json"


@dataclass
class SentimentResult:
    score: float
    polarity: str
    confidence: float
    labels: List[str]


class SentimentAnalyzer:
    """Lightweight sentiment analyzer with pluggable model backends.

    当前实现基于词典和简单规则；后续可替换为真实模型推理：
      - 将 config 中的 `backend` 设置为 MindSpider/Weibo 模型路径
      - 在 `analyze` 方法中调用外部推理服务
    """

    def __init__(self, config_path: Optional[Path] = None) -> None:
        self.config_path = config_path or DEFAULT_CONFIG
        self.config = self._load_config(self.config_path)
        self.positive_lexicon, self.negative_lexicon = self._load_lexicon(self.config.get("lexicon"))
        self.neutral_window = float(self.config.get("neutral_window", 0.1))

    def analyze(self, text: str, metadata: Optional[Dict[str, object]] = None) -> SentimentResult:
        score = self._score_text(text)
        polarity, confidence = self._polarity(score)
        labels: List[str] = []
        if metadata:
            if "platform" in metadata:
                labels.append(f"platform:{metadata['platform']}")
            if "language" in metadata:
                labels.append(f"lang:{metadata['language']}")
        return SentimentResult(score=score, polarity=polarity, confidence=confidence, labels=labels)

    def batch(self, texts: Iterable[str]) -> List[SentimentResult]:  # pragma: no cover - thin wrapper
        return [self.analyze(text) for text in texts]

    def _score_text(self, text: str) -> float:
        if not text:
            return 0.0
        tokens = text.lower()
        pos_hits = sum(1 for term in self.positive_lexicon if term in tokens)
        neg_hits = sum(1 for term in self.negative_lexicon if term in tokens)
        if pos_hits == 0 and neg_hits == 0:
            return 0.0
        return (pos_hits - neg_hits) / max(pos_hits + neg_hits, 1)

    def _polarity(self, score: float) -> tuple[str, float]:
        magnitude = min(abs(score), 1.0)
        if -self.neutral_window <= score <= self.neutral_window:
            return "neutral", 1.0 - magnitude
        return ("positive" if score > 0 else "negative", magnitude)

    @staticmethod
    def _load_config(path: Path) -> Dict[str, object]:
        if not path.exists():
            return {
                "backend": "lexicon",
                "lexicon": str(DEFAULT_LEXICON.relative_to(PROJECT_ROOT)),
                "neutral_window": 0.15,
            }
        if yaml is None:
            return {}
        return yaml.safe_load(path.read_text(encoding="utf-8")) or {}

    @staticmethod
    def _load_lexicon(lexicon_field: Optional[str]) -> tuple[List[str], List[str]]:
        if lexicon_field:
            lex_path = (PROJECT_ROOT / lexicon_field).resolve()
        else:
            lex_path = DEFAULT_LEXICON
        if lex_path.exists():
            payload = json.loads(lex_path.read_text(encoding="utf-8"))
            return payload.get("positive", []), payload.get("negative", [])
        # fallback minimal lexicon
        return ["增长", "融资", "获奖", "突破"], ["亏损", "被裁", "下滑", "风险"]
