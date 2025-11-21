"""ClientConfigService 占位实现

负责读取不同 client 的 SDK 文档和 V1 客户数据目录，
为 Project SDK 提供标准化的 client 配置视图。
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict


@dataclass
class ClientConfigService:
    """客户端配置服务占位实现。"""

    root: Path

    def resolve_path(self, relative: str) -> Path:
        return (self.root / relative).resolve()

    async def load_client_sdk(self, client_slug: str) -> Dict[str, Any]:  # pragma: no cover - 占位
        """根据 client_slug 返回占位配置。"""
        return {"client_slug": client_slug, "config": "noop"}


__all__ = ["ClientConfigService"]

