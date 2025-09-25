from __future__ import annotations

from datetime import datetime, timezone, timedelta
from typing import Dict, List

from pocketcorn.collectors.adapters.base import BaseAdapter, RawSignal


class ProductHuntAdapter(BaseAdapter):
    platform_id = "producthunt"
    display_name = "Product Hunt"
    supported_categories = ("launch", "community")

    def collect(self, mission_criteria: Dict[str, object]) -> List[RawSignal]:
        self._ensure_not_rate_limited()
        company = f"{mission_criteria.get('industry', 'ai')}-ph-co"
        return [
            RawSignal(
                company=company,
                category="launch",
                summary="Launch page reached top 5 with 600 upvotes",
                metrics={"upvotes": 600},
                link="https://producthunt.com/pocketcorn",
                captured_at=datetime.now(timezone.utc) - timedelta(days=2),
                reliability=0.65,
                cultural_tags=["en-US", "maker"],
            )
        ]
