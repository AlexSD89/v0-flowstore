"""ContentSpecService 占位实现

负责读取/写入小红书运营相关的 Client SDK、Post Spec、Weekly Plan 文档，
并在后续版本中为 Project SDK 构建 ContentIntent 提供支持。
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Tuple

import yaml


@dataclass
class ContentSpecService:
    """内容 Spec 服务占位实现。"""

    root: Path

    def resolve_path(self, relative: str) -> Path:
        """将相对路径解析为仓库内绝对路径。"""
        return (self.root / relative).resolve()

    def _read_file(self, path: Path) -> str:
        return path.read_text(encoding="utf-8")

    def _parse_frontmatter(self, text: str) -> Tuple[Dict[str, Any], str]:
        """解析 Markdown frontmatter，返回 (meta, body)。

        如果没有 frontmatter，则 meta 为空字典，body 为原文。
        """
        if not text.startswith("---"):
            return {}, text

        parts = text.split("---", 2)
        if len(parts) < 3:
            return {}, text

        _, fm, rest = parts
        try:
            meta = yaml.safe_load(fm) or {}
        except Exception:
            meta = {}
        return meta, rest.lstrip("\n")

    async def load_post_spec(self, spec_path: str) -> Dict[str, Any]:  # pragma: no cover - 轻逻辑
        """加载 Post Spec，解析 frontmatter 与一级标题。

        返回结构：
        {
          "spec_path": str,
          "frontmatter": dict,
          "title": str | None
        }
        """
        path = self.resolve_path(spec_path)
        text = self._read_file(path)
        frontmatter, body = self._parse_frontmatter(text)

        title = None
        for line in body.splitlines():
            if line.startswith("# "):
                title = line[2:].strip()
                break

        return {
            "spec_path": str(path),
            "frontmatter": frontmatter,
            "title": title,
        }

    async def load_client_sdk(self, client_sdk_path: str) -> Dict[str, Any]:  # pragma: no cover - 占位
        path = self.resolve_path(client_sdk_path)
        return {"client_sdk_path": str(path)}

    async def load_weekly_plan(self, weekly_plan_path: str) -> Dict[str, Any]:  # pragma: no cover - 占位
        path = self.resolve_path(weekly_plan_path)
        return {"weekly_plan_path": str(path)}


__all__ = ["ContentSpecService"]
