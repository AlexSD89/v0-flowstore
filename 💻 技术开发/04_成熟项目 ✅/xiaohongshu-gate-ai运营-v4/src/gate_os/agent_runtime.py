"""Gate OS AgentRuntime 占位实现

设计参考：dev-docs/gate-os/01-模块与接口设计.md

当前仅提供抽象基类和一个最小的空实现，
用于后续在不修改调用方接口的前提下逐步填充逻辑。
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any, Dict


class BaseAgentRuntime(ABC):
    """Agent 运行时抽象基类。

    负责 Agent 的启动、停止、状态查询和任务派发。
    """

    @abstractmethod
    async def start_agent(self, agent_id: str, config: Dict[str, Any]) -> str:
        """启动指定 Agent，返回运行实例 ID。"""

    @abstractmethod
    async def stop_agent(self, instance_id: str) -> None:
        """停止 Agent 实例。"""

    @abstractmethod
    async def get_status(self, instance_id: str) -> Dict[str, Any]:
        """查询 Agent 实例状态。"""

    @abstractmethod
    async def dispatch_task(self, instance_id: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """向 Agent 实例派发任务，返回任务结果或任务 ID。"""


class NoopAgentRuntime(BaseAgentRuntime):
    """占位实现：什么都不做的 AgentRuntime。

    用于早期集成和单元测试时，避免因为尚未实现运行时而阻塞上层开发。
    后续可以用真实实现替换，接口保持不变。
    """

    async def start_agent(self, agent_id: str, config: Dict[str, Any]) -> str:  # pragma: no cover - 占位实现
        return f"noop-instance-{agent_id}"

    async def stop_agent(self, instance_id: str) -> None:  # pragma: no cover - 占位实现
        return None

    async def get_status(self, instance_id: str) -> Dict[str, Any]:  # pragma: no cover - 占位实现
        return {"instance_id": instance_id, "status": "noop"}

    async def dispatch_task(self, instance_id: str, payload: Dict[str, Any]) -> Dict[str, Any]:  # pragma: no cover
        return {"instance_id": instance_id, "payload": payload, "result": "noop"}


__all__ = ["BaseAgentRuntime", "NoopAgentRuntime"]

