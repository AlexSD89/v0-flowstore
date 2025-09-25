from __future__ import annotations

from datetime import datetime, timezone, timedelta
from typing import Dict, List

from pocketcorn.collectors.adapters.base import BaseAdapter, RawSignal


class BossZhipinAdapter(BaseAdapter):
    platform_id = "boss"
    display_name = "Boss直聘"
    supported_categories = ("hiring",)

    def collect(self, mission_criteria: Dict[str, object]) -> List[RawSignal]:
        self._ensure_not_rate_limited()
        company = f"{mission_criteria.get('industry', 'ai')}-boss-co"
        return [
            RawSignal(
                company=company,
                category="hiring",
                summary="Job postings for senior ML engineer indicate team expansion",
                metrics={"open_roles": 3},
                link="https://www.zhipin.com/pocketcorn",
                captured_at=datetime.now(timezone.utc) - timedelta(hours=12),
                reliability=0.8,
                cultural_tags=["zh-CN", "talent"],
            )
        ]
