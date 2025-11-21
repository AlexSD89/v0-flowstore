"""Gate OS EvidenceLedger 占位包装

设计参考：dev-docs/gate-os/01-模块与接口设计.md

当前简单包装 V3 版本证据账本工具，提供统一接口，
便于后续从 Gate OS 层调用，而不用关心底层实现细节。
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any, Dict

from ..tools import evidence_ledger_v3 as v3_evidence


class BaseEvidenceLedger(ABC):
    """证据账本抽象基类。"""

    @abstractmethod
    async def record(self, claim_id: str, evidence: Dict[str, Any]) -> str:
        """记录一条证据，返回 evidence_id。"""

    @abstractmethod
    async def triangulate(self, claim_id: str) -> Dict[str, Any]:
        """对某个 claim 做三角校验。"""

    @abstractmethod
    async def confidence(self, claim_id: str) -> float:
        """计算某个 claim 的置信度分数。"""


class V3EvidenceLedgerAdapter(BaseEvidenceLedger):
    """基于 V3 证据账本实现的适配层。"""

    def __init__(self) -> None:
        # 这里不深入实现，只保留一个最小状态占位
        self._chains: Dict[str, v3_evidence.EvidenceChain] = {}

    async def record(self, claim_id: str, evidence: Dict[str, Any]) -> str:  # pragma: no cover - 占位实现
        # 实际实现可以把 dict 转成 PreprocessedEvidence 等
        evidence_id = f"evidence-{len(self._chains.get(claim_id, []).evidence_records) if claim_id in self._chains else 0}"
        return evidence_id

    async def triangulate(self, claim_id: str) -> Dict[str, Any]:  # pragma: no cover - 占位实现
        return {"claim_id": claim_id, "triangulated": False}

    async def confidence(self, claim_id: str) -> float:  # pragma: no cover - 占位实现
        return 0.0


__all__ = ["BaseEvidenceLedger", "V3EvidenceLedgerAdapter"]

