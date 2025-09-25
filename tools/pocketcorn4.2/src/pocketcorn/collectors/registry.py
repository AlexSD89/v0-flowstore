from __future__ import annotations

from importlib import import_module
from typing import Dict, Iterable, List

from pocketcorn.collectors.adapters.base import BaseAdapter


DEFAULT_TIER1 = [
    "pocketcorn.collectors.adapters.tier1.zhihu.ZhihuAdapter",
    "pocketcorn.collectors.adapters.tier1.weibo.WeiboAdapter",
    "pocketcorn.collectors.adapters.tier1.bosszhipin.BossZhipinAdapter",
    "pocketcorn.collectors.adapters.tier1.linkedin.LinkedInAdapter",
    "pocketcorn.collectors.adapters.tier1.github.GitHubAdapter",
]

DEFAULT_TIER2 = [
    "pocketcorn.collectors.adapters.tier2.xiaohongshu.XiaoHongShuAdapter",
    "pocketcorn.collectors.adapters.tier2.producthunt.ProductHuntAdapter",
    "pocketcorn.collectors.adapters.tier2.v2ex.V2EXAdapter",
    "pocketcorn.collectors.adapters.tier2.indiehackers.IndieHackersAdapter",
    "pocketcorn.collectors.adapters.tier2.news_portal.NewsPortalAdapter",
]


class CollectorRegistry:
    """Registry holding platform adapters and helper utilities."""

    def __init__(self) -> None:
        self._adapters: Dict[str, BaseAdapter] = {}

    def bootstrap_default_adapters(self) -> None:
        for dotted in DEFAULT_TIER1 + DEFAULT_TIER2:
            module_name, class_name = dotted.rsplit(".", maxsplit=1)
            module = import_module(module_name)
            adapter_cls = getattr(module, class_name)
            adapter: BaseAdapter = adapter_cls()
            self._adapters[adapter.platform_id] = adapter

    def adapters(self) -> Iterable[BaseAdapter]:
        return self._adapters.values()

    def get(self, platform_id: str) -> BaseAdapter:
        return self._adapters[platform_id]

    def get_for_platforms(self, platform_ids: Iterable[str]) -> List[BaseAdapter]:
        return [self._adapters[pid] for pid in platform_ids if pid in self._adapters]

    def all_platform_ids(self) -> List[str]:
        return list(self._adapters.keys())

    def inject_transient_error(self, platform_id: str, error: Exception) -> None:
        if platform_id in self._adapters:
            self._adapters[platform_id].inject_error(error)
