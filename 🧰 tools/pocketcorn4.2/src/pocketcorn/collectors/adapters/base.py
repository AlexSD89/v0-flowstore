"""Adapter interface for platform-specific collectors."""
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Dict, Iterable, List, Optional

from pocketcorn.collectors.errors import RateLimitError


@dataclass
class RawSignal:
    company: str
    category: str
    summary: str
    metrics: Dict[str, float]
    link: str
    captured_at: datetime
    reliability: float
    cultural_tags: List[str]


class BaseAdapter:
    platform_id: str = ""
    display_name: str = ""
    supported_categories: Iterable[str] = ()

    def __init__(self) -> None:
        self._injected_error: Optional[Exception] = None

    def collect(self, mission_criteria: Dict[str, object]) -> List[RawSignal]:
        """Collect signals for the platform. Subclasses override this method."""

        raise NotImplementedError

    def inject_error(self, error: Exception) -> None:
        self._injected_error = error

    def _ensure_not_rate_limited(self) -> None:
        if isinstance(self._injected_error, RateLimitError):
            error = self._injected_error
            self._injected_error = None
            raise error

        if self._injected_error is not None:
            error = self._injected_error
            self._injected_error = None
            raise error
