"""Gate OS WorkflowOrchestrator 占位实现

设计参考：dev-docs/gate-os/01-模块与接口设计.md

负责接收 Project/Client SDK 传入的 Intent Package，
并在后续版本中串联 Collect/Model/Compare/Align/Deliver 五个阶段。
当前实现仅保留接口和最小的状态透传，便于上层先行集成。
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any, Dict


class BaseWorkflowOrchestrator(ABC):
    """工作流编排抽象基类。"""

    @abstractmethod
    async def handle_intent(self, intent: Dict[str, Any]) -> Dict[str, Any]:
        """处理来自 SDK 的意向包，返回执行结果摘要。"""

    @abstractmethod
    async def collect_phase(self, intent: Dict[str, Any]) -> Dict[str, Any]:
        """Collect 阶段占位接口。"""

    @abstractmethod
    async def model_phase(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Model 阶段占位接口。"""

    @abstractmethod
    async def compare_phase(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Compare 阶段占位接口。"""

    @abstractmethod
    async def align_phase(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Align 阶段占位接口。"""

    @abstractmethod
    async def deliver_phase(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Deliver 阶段占位接口。"""


class NoopWorkflowOrchestrator(BaseWorkflowOrchestrator):
    """占位工作流编排器：只把输入原样返回。

    便于在实现真实逻辑前，先让 Project SDK / 测试代码集成。
    """

    async def handle_intent(self, intent: Dict[str, Any]) -> Dict[str, Any]:  # pragma: no cover - 占位实现
        state = await self.collect_phase(intent)
        state = await self.model_phase(state)
        state = await self.compare_phase(state)
        state = await self.align_phase(state)
        state = await self.deliver_phase(state)
        return {"intent": intent, "state": state, "status": "noop"}

    async def collect_phase(self, intent: Dict[str, Any]) -> Dict[str, Any]:  # pragma: no cover
        return {"stage": "collect", "intent": intent}

    async def model_phase(self, state: Dict[str, Any]) -> Dict[str, Any]:  # pragma: no cover
        state["stage"] = "model"
        return state

    async def compare_phase(self, state: Dict[str, Any]) -> Dict[str, Any]:  # pragma: no cover
        state["stage"] = "compare"
        return state

    async def align_phase(self, state: Dict[str, Any]) -> Dict[str, Any]:  # pragma: no cover
        state["stage"] = "align"
        return state

    async def deliver_phase(self, state: Dict[str, Any]) -> Dict[str, Any]:  # pragma: no cover
        state["stage"] = "deliver"
        return state


__all__ = ["BaseWorkflowOrchestrator", "NoopWorkflowOrchestrator"]

