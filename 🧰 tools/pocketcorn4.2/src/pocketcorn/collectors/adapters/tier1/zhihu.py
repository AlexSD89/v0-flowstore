from __future__ import annotations

from datetime import datetime, timezone, timedelta
from typing import Dict, List

from pocketcorn.collectors.adapters.base import BaseAdapter, RawSignal


class ZhihuAdapter(BaseAdapter):
    platform_id = "zhihu"
    display_name = "Zhihu"
    supported_categories = ("revenue", "hiring", "product")

    def collect(self, mission_criteria: Dict[str, object]) -> List[RawSignal]:
        self._ensure_not_rate_limited()
        company = f"{mission_criteria.get('industry', 'ai')}-zhihu-co"
        return [
            RawSignal(
                company=company,
                category="revenue",
                summary="Community report shows monthly revenue surpassing 5万 RMB",
                metrics={"mrr": float(mission_criteria.get("revenue_threshold", 50_000))},
                link="https://zhihu.com/pocketcorn",
                captured_at=datetime.now(timezone.utc) - timedelta(hours=6),
                reliability=0.9,
                cultural_tags=["zh-CN", "community"],
            )
        ]
