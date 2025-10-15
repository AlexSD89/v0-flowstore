from __future__ import annotations

import json
import os
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Iterable, List, Optional

try:  # optional dependency
    import yaml
except ImportError:  # pragma: no cover - lazily handled in runtime
    yaml = None

PROJECT_ROOT = Path(__file__).resolve().parents[5]
CONFIG_DEFAULT = PROJECT_ROOT / "config" / "mindspider" / "weibo.yaml"


def _load_yaml(path: Path) -> Dict[str, object]:
    if not path.exists():
        raise FileNotFoundError(f"MindSpider Weibo 配置不存在: {path}")
    if yaml is None:
        # 后备方案：返回一个默认配置，至少包含 sample_data。
        return {
            "keywords": ["AI 初创", "大模型融资"],
            "rate_limit": {"requests_per_minute": 90},
            "storage": {
                "type": "mongodb",
                "uri": "mongodb://localhost:27017",
                "database": "pocketcorn_raw",
                "collection": "weibo_signals",
            },
            "sample_data": "../../data/samples/weibo_mindspider_sample.json",
        }
    return yaml.safe_load(path.read_text(encoding="utf-8")) or {}


@dataclass
class MindSpiderWeiboSignal:
    company: str
    category: str
    summary: str
    link: str
    captured_at: datetime
    reliability: float
    cultural_tags: List[str]
    extras: Dict[str, object]


class MindSpiderWeiboService:
    """轻量包装 MindSpider 的微博采集能力。

    - 如果配置里提供 `sample_data`，则读取本地样本返回结果。
    - 否则，需要运行 MindSpider 采集流程并将结果写入指定存储，然后实现 TODO 部分。
    """

    def __init__(self, config_path: Optional[Path] = None) -> None:
        self.config_path = Path(config_path) if config_path else CONFIG_DEFAULT
        config = _load_yaml(self.config_path)
        self.sample_data_path: Optional[Path] = None
        sample_data = config.get("sample_data")
        if isinstance(sample_data, str):
            sample_path = (self.config_path.parent / sample_data).resolve()
            if not sample_path.exists():
                sample_path = (PROJECT_ROOT / sample_data).resolve()
            if sample_path.exists():
                self.sample_data_path = sample_path
        self.keywords: List[str] = list(config.get("keywords", []))
        self.rate_limit = config.get("rate_limit", {})
        self.storage = config.get("storage", {})
        self.raw_config = config

    def collect(self, mission_criteria: Dict[str, object]) -> List[MindSpiderWeiboSignal]:
        """Collect signals for provided mission criteria.

        当前实现以 sample_data 作为数据来源，方便在未部署 MindSpider 时快速演示。
        后续可根据 storage 配置读取 Mongo/MySQL 中 MindSpider 的真实抓取结果。
        """

        if self.sample_data_path:
            return list(self._load_from_sample(mission_criteria))
        raise RuntimeError(
            "尚未配置 MindSpider 运行时。请在 config/mindspider/weibo.yaml 中配置 sample_data，"
            "或根据 storage 指向 MindSpider 的数据库，再扩展 `collect` 读取真实数据。"
        )

    def _load_from_sample(self, mission_criteria: Dict[str, object]) -> Iterable[MindSpiderWeiboSignal]:
        data = json.loads(self.sample_data_path.read_text(encoding="utf-8"))
        industry = str(mission_criteria.get("industry", "ai")).lower()
        for entry in data:
            company = entry.get("company") or f"{industry}-weibo"
            try:
                captured_at = datetime.fromisoformat(entry["captured_at"]).replace(tzinfo=timezone.utc)
            except Exception:
                captured_at = datetime.now(timezone.utc)
            yield MindSpiderWeiboSignal(
                company=company,
                category=entry.get("category", "other"),
                summary=entry.get("summary", ""),
                link=entry.get("link", ""),
                captured_at=captured_at,
                reliability=float(entry.get("reliability", 0.7)),
                cultural_tags=list(entry.get("cultural_tags", [])),
                extras={k: v for k, v in entry.items() if k not in {"company", "category", "summary", "link", "captured_at", "reliability", "cultural_tags"}},
            )
