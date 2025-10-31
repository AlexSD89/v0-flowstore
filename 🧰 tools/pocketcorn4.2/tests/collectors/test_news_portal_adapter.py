from __future__ import annotations

from pocketcorn.collectors.adapters.tier2.news_portal import NewsPortalAdapter


def test_news_portal_adapter_returns_rube_samples() -> None:
    adapter = NewsPortalAdapter()
    signals = adapter.collect({"industry": "aurora"})
    assert signals
    first = signals[0]
    assert "aurora" in first.company
    assert first.summary
    assert first.captured_at.tzinfo is not None
