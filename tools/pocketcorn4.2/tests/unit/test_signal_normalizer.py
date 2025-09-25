from __future__ import annotations

from datetime import datetime, timedelta, timezone
from uuid import uuid4

from pocketcorn.collectors.adapters.base import RawSignal
from pocketcorn.normalization.signal_normalizer import SignalNormalizer


def test_normalizer_maps_raw_signal_to_record() -> None:
    normalizer = SignalNormalizer()
    mission_id = str(uuid4())
    signal = RawSignal(
        company="test-co",
        category="revenue",
        summary="Reached 50k MRR",
        metrics={"mrr": 50_000.0},
        link="https://example.com",
        captured_at=datetime.now(timezone.utc) - timedelta(hours=1),
        reliability=0.8,
        cultural_tags=["zh-CN"],
    )

    records = normalizer.normalize(mission_id, "zhihu", [signal])

    assert len(records) == 1
    record = records[0]
    assert record.company_identifier == "test-co"
    assert 0.9 <= record.freshness_score <= 1.0
    assert record.reliability_score == 0.8

    highlights = normalizer.highlights(records)
    assert highlights[0].summary == "Reached 50k MRR"


def test_normalizer_caps_stale_signals() -> None:
    normalizer = SignalNormalizer()
    mission_id = str(uuid4())
    stale_signal = RawSignal(
        company="old-co",
        category="product",
        summary="Outdated update",
        metrics={},
        link="https://example.com/stale",
        captured_at=datetime.now(timezone.utc) - timedelta(hours=72),
        reliability=1.2,
        cultural_tags=[],
    )

    [record] = normalizer.normalize(mission_id, "producthunt", [stale_signal])
    assert record.freshness_score == 0.0
    assert record.reliability_score == 1.0
