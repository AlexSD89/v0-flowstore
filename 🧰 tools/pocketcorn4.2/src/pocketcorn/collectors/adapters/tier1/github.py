from __future__ import annotations

from datetime import timezone
from typing import Dict, List

from pocketcorn.collectors.adapters.base import BaseAdapter, RawSignal
from pocketcorn.services.collectors.playwith_client import PlaywithMCPService


class GitHubAdapter(BaseAdapter):
    platform_id = "github"
    display_name = "GitHub"
    supported_categories = ("technology", "community")

    def __init__(self) -> None:
        super().__init__()
        self._service = PlaywithMCPService()

    def collect(self, mission_criteria: Dict[str, object]) -> List[RawSignal]:
        self._ensure_not_rate_limited()
        signals = self._service.collect("github", mission_criteria)
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
