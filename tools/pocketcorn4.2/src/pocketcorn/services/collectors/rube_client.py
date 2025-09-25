from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Iterable, List, Optional

try:
    import yaml
except ImportError:  # pragma: no cover
    yaml = None

PROJECT_ROOT = Path(__file__).resolve().parents[4]
CONFIG_PATH = PROJECT_ROOT / "config" / "mcp" / "rube.yaml"


@dataclass
class RubeSignal:
    company: str
    category: str
    summary: str
    link: str
    captured_at: datetime
    reliability: float
    cultural_tags: List[str]
    extras: Dict[str, object]


class RubeMCPService:
    """Service wrapper for Rube MCP structured tasks."""

    def __init__(self, config_path: Optional[Path] = None) -> None:
        self.config_path = Path(config_path) if config_path else CONFIG_PATH
        config = self._load_config(self.config_path)
        sample_data = config.get("sample_data")
        if isinstance(sample_data, str):
            candidate = (self.config_path.parent / sample_data).resolve()
            if not candidate.exists():
                candidate = (PROJECT_ROOT / sample_data).resolve()
            self.sample_path = candidate if candidate.exists() else None
        else:
            self.sample_path = None
        self.raw_config = config

    def collect(self, task_name: str, mission_criteria: Dict[str, object]) -> List[RubeSignal]:
        if self.sample_path:
            data = json.loads(self.sample_path.read_text(encoding="utf-8"))
            entries = data.get(task_name, [])
            return list(self._build_signals(entries, mission_criteria))
        raise RuntimeError(
            "Rube MCP 尚未配置 sample 数据或真实运行结果。请在 config/mcp/rube.yaml 中设置 sample_data，"
            "或扩展该服务读取 Rube 输出存储。"
        )

    def _build_signals(self, entries: Iterable[Dict[str, object]], mission_criteria: Dict[str, object]) -> Iterable[RubeSignal]:
        industry = str(mission_criteria.get("industry", "ai")).lower()
        for entry in entries:
            company = entry.get("company") or f"{industry}-{entry.get('source', 'rube')}"
            captured_at = self._parse_timestamp(entry.get("captured_at"))
            yield RubeSignal(
                company=company,
                category=entry.get("category", "insight"),
                summary=entry.get("summary", ""),
                link=entry.get("link", ""),
                captured_at=captured_at,
                reliability=float(entry.get("reliability", 0.65)),
                cultural_tags=list(entry.get("cultural_tags", [])),
                extras={k: v for k, v in entry.items() if k not in {"company", "category", "summary", "link", "captured_at", "reliability", "cultural_tags", "source"}},
            )

    @staticmethod
    def _parse_timestamp(value: Optional[str]) -> datetime:
        if not value:
            return datetime.now(timezone.utc)
        try:
            dt = datetime.fromisoformat(value)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt
        except Exception:
            return datetime.now(timezone.utc)

    @staticmethod
    def _load_config(path: Path) -> Dict[str, object]:
        if not path.exists():
            raise FileNotFoundError(f"Rube MCP 配置不存在: {path}")
        if yaml is None:
            return {"sample_data": "../../data/samples/rube_samples.json"}
        return yaml.safe_load(path.read_text(encoding="utf-8")) or {}
