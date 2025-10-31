from __future__ import annotations

from datetime import datetime, timezone
from typing import Iterable, List
from uuid import UUID, uuid4

from pocketcorn.collectors.adapters.base import RawSignal
from pocketcorn.collectors.models import SignalHighlight, SignalRecord

FRESHNESS_THRESHOLD_HOURS = 48


def _freshness_score(captured_at: datetime) -> float:
    delta = datetime.now(timezone.utc) - captured_at
    hours = max(delta.total_seconds() / 3600, 0.0)
    if hours >= FRESHNESS_THRESHOLD_HOURS:
        return 0.0
    return max(0.0, 1.0 - (hours / FRESHNESS_THRESHOLD_HOURS))


def _clamp(value: float) -> float:
    return max(0.0, min(1.0, value))


class SignalNormalizer:
    """Transforms raw platform payloads into Pocketcorn's universal schema."""

    def normalize(self, mission_id: str, platform_id: str, signals: Iterable[RawSignal]) -> List[SignalRecord]:
        records: List[SignalRecord] = []
        for signal in signals:
            freshness = _freshness_score(signal.captured_at)
            reliability = _clamp(signal.reliability)
            mission_uuid = mission_id if isinstance(mission_id, UUID) else UUID(str(mission_id))
            record = SignalRecord(
                signal_id=uuid4(),
                mission_id=mission_uuid,
                platform_id=platform_id,
                company_identifier=signal.company,
                signal_category=signal.category,
                content_summary=signal.summary,
                numeric_metrics=signal.metrics,
                source_link=signal.link,
                captured_at=signal.captured_at,
                freshness_score=freshness,
                reliability_score=reliability,
                cultural_tags=signal.cultural_tags,
            )
            records.append(record)
        return records

    def highlights(self, records: Iterable[SignalRecord]) -> List[SignalHighlight]:
        return [
            SignalHighlight(
                company_identifier=record.company_identifier,
                signal_category=record.signal_category,
                summary=record.content_summary,
                freshness_score=_clamp(record.freshness_score),
                reliability_score=_clamp(record.reliability_score),
                source_link=record.source_link,
            )
            for record in records
        ]
