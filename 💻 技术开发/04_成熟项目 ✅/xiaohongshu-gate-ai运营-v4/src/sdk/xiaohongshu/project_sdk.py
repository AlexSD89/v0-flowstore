"""小红书运营 Project SDK 占位实现

设计参考：dev-docs/sdk/xiaohongshu-project-sdk.md

XiaohongshuProjectSDK 作为 Gate OS 与具体项目文档/数据之间的门面层，
后续会将 content_spec_service / data_pipeline_service / evolution_service 等组合在一起。
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from pathlib import Path
from typing import Any, Dict

from .content_spec_service import ContentSpecService


class BaseXiaohongshuProjectSDK(ABC):
    """小红书运营 Project SDK 抽象基类。"""

    @abstractmethod
    async def load_client(self, client_slug: str) -> Dict[str, Any]:
        """加载指定 client 的配置（品牌、任务类型、Search Spec 等）。"""

    @abstractmethod
    async def build_content_intent(self, post_spec_path: str) -> Dict[str, Any]:
        """从 Post Spec 文件生成发送给 Gate OS 的意向包。"""

    @abstractmethod
    async def build_weekly_plan_intent(self, weekly_plan_path: str) -> Dict[str, Any]:
        """从 Weekly Plan 生成一组需要执行的任务意向。"""

    @abstractmethod
    async def summarize_experiment(self, experiment_id: str) -> Dict[str, Any]:
        """根据 Experiment Log 和数据结果，总结一次实验的结论。"""


class NoopXiaohongshuProjectSDK(BaseXiaohongshuProjectSDK):
    """占位实现：用于早期集成与测试的空 SDK。"""

    async def load_client(self, client_slug: str) -> Dict[str, Any]:  # pragma: no cover - 占位实现
        return {"client_slug": client_slug, "config": "noop"}

    async def build_content_intent(self, post_spec_path: str) -> Dict[str, Any]:  # pragma: no cover
        """从 Post Spec 构造一个带少量语义信息的 Intent。

        后续可以在此处接入 ContentSpecService，解析完整结构。
        """
        root = Path(__file__).resolve().parents[2]
        service = ContentSpecService(root=root)
        spec_info = await service.load_post_spec(post_spec_path)

        return {
            "task_type": "generate_xhs_post",
            "spec_path": spec_info["spec_path"],
            "title": spec_info.get("title"),
            "frontmatter": spec_info.get("frontmatter", {}),
        }

    async def build_weekly_plan_intent(self, weekly_plan_path: str) -> Dict[str, Any]:  # pragma: no cover
        return {"task_type": "run_weekly_plan", "plan_path": weekly_plan_path}

    async def summarize_experiment(self, experiment_id: str) -> Dict[str, Any]:  # pragma: no cover
        return {"experiment_id": experiment_id, "summary": "noop"}


__all__ = ["BaseXiaohongshuProjectSDK", "NoopXiaohongshuProjectSDK"]
