from __future__ import annotations

from pocketcorn.collectors.adapters.tier1.linkedin import LinkedInAdapter


def test_linkedin_adapter_returns_playwith_samples() -> None:
    adapter = LinkedInAdapter()
    signals = adapter.collect({"industry": "aurora"})
    assert signals
    first = signals[0]
    assert "aurora" in first.company
    assert first.cultural_tags
    assert first.captured_at.tzinfo is not None
