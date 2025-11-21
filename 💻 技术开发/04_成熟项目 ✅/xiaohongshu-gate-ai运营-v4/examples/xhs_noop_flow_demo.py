"""小红书 Gate v4 · Noop 工作流演示脚本

用途：
- 演示从 Post Spec → Project SDK → Gate OS WorkflowOrchestrator 的最小闭环；
- 当前不调用外部网络，也不真正发布，只打印经过的意向与阶段状态。

运行方式（在项目根目录下）：

    python examples/xhs_noop_flow_demo.py

依赖：
- 使用 src/ 下的占位实现：
  - NoopXiaohongshuProjectSDK
  - NoopWorkflowOrchestrator
"""

from __future__ import annotations

import asyncio
import sys
from pathlib import Path
from typing import Dict, Any


def _project_root() -> Path:
    """返回项目根目录路径。"""
    return Path(__file__).resolve().parents[1]


async def run_noop_flow() -> None:
    root = _project_root()
    # 将项目根目录加入 sys.path，方便直接 import src.* 模块
    if str(root) not in sys.path:
        sys.path.append(str(root))

    # 延迟导入，避免在模块加载时依赖环境
    from src.sdk.xiaohongshu.project_sdk import NoopXiaohongshuProjectSDK
    from src.gate_os.workflow_orchestrator import NoopWorkflowOrchestrator

    # 选用一条现有的 Gate 场景日记 Post Spec 作为示例
    post_spec_rel = "dev-docs/xiaohongshu-ops-spec/post-2025-11-22-gate-finance-diary-02.md"

    sdk = NoopXiaohongshuProjectSDK()
    orchestrator = NoopWorkflowOrchestrator()

    # 从 Post Spec 构造意向包（当前为占位实现，仅包含路径信息）
    intent: Dict[str, Any] = await sdk.build_content_intent(post_spec_rel)

    # 交给 Gate OS 工作流编排器处理（Noop 版本只按阶段改状态）
    result: Dict[str, Any] = await orchestrator.handle_intent(intent)

    print("[Noop Flow] 输入 Intent:")
    print(intent)
    print("\n[Noop Flow] 工作流处理结果摘要:")
    print(result)


if __name__ == "__main__":  # pragma: no cover - 手工运行脚本
    asyncio.run(run_noop_flow())

