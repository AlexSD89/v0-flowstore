from __future__ import annotations

from datetime import timezone
from typing import Dict, List

from pocketcorn.collectors.adapters.base import BaseAdapter, RawSignal
from pocketcorn.services.collectors.rube_client import RubeMCPService


class NewsPortalAdapter(BaseAdapter):
    platform_id = "news_portal"
    display_name = "News Portal"
    supported_categories = ("insight", "market")

    def __init__(self) -> None:
        super().__init__()
        self._service = RubeMCPService()

    def collect(self, mission_criteria: Dict[str, object]) -> List[RawSignal]:
        self._ensure_not_rate_limited()
        signals = self._service.collect("news_portal", mission_criteria)
        raw_signals: List[RawSignal] = []
        for signal in signals:
            raw_signals.append(
                RawSignal(
                    company=signal.company,
                    category=signal.category,
                    summary=signal.summary,
                    metrics={k: v for k, v in signal.extras.items() if isinstance(v, (int, float))},
                    link=signal.link,
                    captured_at=signal.captured_at if signal.captured_at.tzinfo else signal.captured_at.replace(tzinfo=timezone.utc),
                    reliability=signal.reliability,
                    cultural_tags=signal.cultural_tags,
                )
            )
        return raw_signals
