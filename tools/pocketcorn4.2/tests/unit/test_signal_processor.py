from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from pocketcorn.collectors.models import SignalRecord
from pocketcorn.services.collectors import SignalProcessor


def _record(category: str, summary: str, metrics=None) -> SignalRecord:
    return SignalRecord(
        mission_id=uuid4(),
        platform_id="zhihu",
        company_identifier="acme-ai",
        signal_category=category,
        content_summary=summary,
        numeric_metrics=metrics or {},
        source_link="https://example.com/signal",
        captured_at=datetime.now(timezone.utc),
        freshness_score=0.9,
        reliability_score=0.8,
        cultural_tags=["zh-CN"],
    )


def test_signal_processor_scores_company() -> None:
    processor = SignalProcessor()
    records = [
        _record("revenue", "MRR突破50k人民币", {"mrr": 60_000}),
        _record("hiring", "Hiring 10 engineers in Beijing", {"headcount": 25}),
    ]

    enriched = processor.enrich(records, {"geography": ["CN"]})

    assert "acme-ai" in enriched
    company = enriched["acme-ai"]
    assert company["score"] > 0.5
    assert "meaningful-revenue" in company["insight_tags"]
    assert company["next_actions"]
    assert "sentiment" in company and "risk" in company and "culture" in company
    assert "evidence_links" in company
