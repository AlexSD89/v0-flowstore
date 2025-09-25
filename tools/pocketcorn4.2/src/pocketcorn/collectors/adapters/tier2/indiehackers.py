from __future__ import annotations

from datetime import datetime, timezone, timedelta
from typing import Dict, List

from pocketcorn.collectors.adapters.base import BaseAdapter, RawSignal


class IndieHackersAdapter(BaseAdapter):
    platform_id = "indiehackers"
    display_name = "Indie Hackers"
    supported_categories = ("revenue", "community")

    def collect(self, mission_criteria: Dict[str, object]) -> List[RawSignal]:
        self._ensure_not_rate_limited()
        company = f"{mission_criteria.get('industry', 'ai')}-ih-co"
        return [
            RawSignal(
                company=company,
                category="revenue",
                summary="Founder report highlights reaching $8k MRR",
                metrics={"mrr": 8_000.0},
                link="https://indiehackers.com/pocketcorn",
                captured_at=datetime.now(timezone.utc) - timedelta(days=3),
                reliability=0.6,
                cultural_tags=["en-US", "bootstrap"],
            )
        ]
