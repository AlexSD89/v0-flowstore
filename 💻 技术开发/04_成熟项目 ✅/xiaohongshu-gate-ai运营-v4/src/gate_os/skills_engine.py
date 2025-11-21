"""Gate OS SkillsEngine 占位实现

参考设计：dev-docs/gate-os/01-模块与接口设计.md

为后续技能注册与调用提供统一入口，目前以内存注册表形式占位。
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional


class BaseSkillsEngine(ABC):
    """Skills 引擎抽象基类。"""

    @abstractmethod
    def register_skill(self, name: str, descriptor: Dict[str, Any]) -> None:
        """注册一个 Skill。"""

    @abstractmethod
    def list_skills(self, filters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """列出可用 Skill。"""

    @abstractmethod
    async def invoke(self, name: str, payload: Dict[str, Any], context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """调用指定 Skill。"""


class InMemorySkillsEngine(BaseSkillsEngine):
    """简单的内存技能注册表，占位实现。"""

    def __init__(self) -> None:
        self._skills: Dict[str, Dict[str, Any]] = {}

    def register_skill(self, name: str, descriptor: Dict[str, Any]) -> None:  # pragma: no cover - 占位实现
        self._skills[name] = descriptor

    def list_skills(self, filters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:  # pragma: no cover
        items = list(self._skills.values())
        if not filters:
            return items
        return [s for s in items if all(s.get(k) == v for k, v in filters.items())]

    async def invoke(self, name: str, payload: Dict[str, Any], context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """占位调用：目前仅返回 echo 结果。"""  # pragma: no cover
        if name not in self._skills:
            return {"error": f"skill_not_found: {name}", "payload": payload}
        return {"skill": name, "payload": payload, "context": context or {}, "result": "noop"}


__all__ = ["BaseSkillsEngine", "InMemorySkillsEngine"]

