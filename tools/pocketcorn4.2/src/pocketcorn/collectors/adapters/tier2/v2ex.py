from __future__ import annotations

from datetime import datetime, timezone, timedelta
from typing import Dict, List

from pocketcorn.collectors.adapters.base import BaseAdapter, RawSignal


class V2EXAdapter(BaseAdapter):
    platform_id = "v2ex"
    display_name = "V2EX"
    supported_categories = ("community", "hiring")

    def collect(self, mission_criteria: Dict[str, object]) -> List[RawSignal]:
        self._ensure_not_rate_limited()
        company = f"{mission_criteria.get('industry', 'ai')}-v2ex-co"
        return [
            RawSignal(
                company=company,
                category="community",
                summary="Founder AMA reveals doubling of active users in quarter",
                metrics={"active_users_growth": 2.0},
                link="https://v2ex.com/pocketcorn",
                captured_at=datetime.now(timezone.utc) - timedelta(hours=30),
                reliability=0.68,
                cultural_tags=["zh-CN", "developer"],
            )
        ]
