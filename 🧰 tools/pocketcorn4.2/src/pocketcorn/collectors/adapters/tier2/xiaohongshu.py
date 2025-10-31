from __future__ import annotations

from datetime import datetime, timezone, timedelta
from typing import Dict, List

from pocketcorn.collectors.adapters.base import BaseAdapter, RawSignal


class XiaoHongShuAdapter(BaseAdapter):
    platform_id = "xiaohongshu"
    display_name = "Xiaohongshu"
    supported_categories = ("product", "community")

    def collect(self, mission_criteria: Dict[str, object]) -> List[RawSignal]:
        self._ensure_not_rate_limited()
        company = f"{mission_criteria.get('industry', 'ai')}-xhs-co"
        return [
            RawSignal(
                company=company,
                category="product",
                summary="User reviews praise localized onboarding experience",
                metrics={},
                link="https://xiaohongshu.com/pocketcorn",
                captured_at=datetime.now(timezone.utc) - timedelta(days=1),
                reliability=0.7,
                cultural_tags=["zh-CN", "consumer"],
            )
        ]
