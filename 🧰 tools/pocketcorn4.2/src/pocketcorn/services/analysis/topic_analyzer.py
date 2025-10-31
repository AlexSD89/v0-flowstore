from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Optional

try:
    import yaml
except ImportError:  # pragma: no cover
    yaml = None

PROJECT_ROOT = Path(__file__).resolve().parents[3]
CONFIG_DEFAULT = PROJECT_ROOT / "config" / "analysis" / "topic.yaml"
KEYWORDS_DEFAULT = PROJECT_ROOT / "data" / "samples" / "topic_keywords.json"


@dataclass
class TopicResult:
    topics: List[str]
    keywords: Dict[str, List[str]]


class TopicAnalyzer:
    def __init__(self, config_path: Optional[Path] = None) -> None:
        self.config_path = config_path or CONFIG_DEFAULT
        self.config = self._load_config(self.config_path)
        self.keyword_map = self._load_keywords(self.config.get("keywords"))
        self.min_hits = int(self.config.get("min_hits", 1))

    def analyze(self, text: str) -> TopicResult:
        text_lower = text.lower()
        matched: Dict[str, List[str]] = {}
        for topic, keywords in self.keyword_map.items():
            hits = [kw for kw in keywords if kw.lower() in text_lower]
            if len(hits) >= self.min_hits:
                matched[topic] = hits
        topics = sorted(matched.keys())
        return TopicResult(topics=topics, keywords=matched)

    @staticmethod
    def _load_config(path: Path) -> Dict[str, object]:
        if not path.exists() or yaml is None:
            return {
                "keywords": str(KEYWORDS_DEFAULT.relative_to(PROJECT_ROOT)),
                "min_hits": 1,
            }
        return yaml.safe_load(path.read_text(encoding="utf-8")) or {}

    @staticmethod
    def _load_keywords(keywords_field: Optional[str]) -> Dict[str, List[str]]:
        if keywords_field:
            candidate = (PROJECT_ROOT / keywords_field).resolve()
        else:
            candidate = KEYWORDS_DEFAULT
        if candidate.exists():
            payload = json.loads(candidate.read_text(encoding="utf-8"))
            return {topic: list(words) for topic, words in payload.items()}
        return {
            "growth": ["增长", "扩张", "用户", "流水"],
            "funding": ["融资", "投资", "轮次", "募资"],
            "product": ["上线", "发布", "迭代", "功能"],
        }
