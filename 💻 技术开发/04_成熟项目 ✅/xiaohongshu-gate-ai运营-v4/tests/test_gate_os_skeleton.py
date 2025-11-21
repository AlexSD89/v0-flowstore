"""针对 Gate OS / SDK 骨架的最小存在性测试

目的：
- 确认占位模块和类可以被正常 import；
- 为后续补充真实测试提供路径参考。
"""

from __future__ import annotations


def test_can_import_gate_os_modules() -> None:
    from xiaohongshu_gate_ai运营_v4.src.gate_os.agent_runtime import BaseAgentRuntime, NoopAgentRuntime  # type: ignore
    from xiaohongshu_gate_ai运营_v4.src.gate_os.skills_engine import BaseSkillsEngine, InMemorySkillsEngine  # type: ignore
    from xiaohongshu_gate_ai运营_v4.src.gate_os.evidence_ledger import BaseEvidenceLedger, V3EvidenceLedgerAdapter  # type: ignore
    from xiaohongshu_gate_ai运营_v4.src.gate_os.autonomy_manager import BaseLOAManager, V3LOAManagerAdapter  # type: ignore
    from xiaohongshu_gate_ai运营_v4.src.gate_os.workflow_orchestrator import (  # type: ignore
        BaseWorkflowOrchestrator,
        NoopWorkflowOrchestrator,
    )

    # 仅断言类存在，后续由具体实现补充行为测试
    assert BaseAgentRuntime is not None
    assert NoopAgentRuntime is not None
    assert BaseSkillsEngine is not None
    assert InMemorySkillsEngine is not None
    assert BaseEvidenceLedger is not None
    assert V3EvidenceLedgerAdapter is not None
    assert BaseLOAManager is not None
    assert V3LOAManagerAdapter is not None
    assert BaseWorkflowOrchestrator is not None
    assert NoopWorkflowOrchestrator is not None


def test_can_import_xhs_project_sdk() -> None:
    from xiaohongshu_gate_ai运营_v4.src.sdk.xiaohongshu.project_sdk import (  # type: ignore
        BaseXiaohongshuProjectSDK,
        NoopXiaohongshuProjectSDK,
    )

    assert BaseXiaohongshuProjectSDK is not None
    assert NoopXiaohongshuProjectSDK is not None

