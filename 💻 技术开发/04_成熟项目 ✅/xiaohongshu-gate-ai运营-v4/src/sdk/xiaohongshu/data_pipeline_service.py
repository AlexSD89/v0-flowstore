"""XHSDataPipelineService 占位实现

负责根据 dev-docs/xiaohongshu-data-pipeline/ 中的约定，
为 Project SDK 提供数据访问与任务入口。
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict


@dataclass
class XHSDataPipelineService:
    """小红书数据管道服务占位实现。"""

    root: Path

    def resolve_path(self, relative: str) -> Path:
        return (self.root / relative).resolve()

    async def get_trending_snapshot(self, snapshot_id: str) -> Dict[str, Any]:  # pragma: no cover - 占位
        """根据 snapshot_id 返回占位数据。"""
        return {"snapshot_id": snapshot_id, "data": "noop"}


__all__ = ["XHSDataPipelineService"]

