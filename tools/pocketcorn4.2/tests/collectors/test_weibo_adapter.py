from __future__ import annotations

from pocketcorn.collectors.adapters.tier1.weibo import WeiboAdapter


def test_weibo_adapter_loads_sample_signals() -> None:
    adapter = WeiboAdapter()
    criteria = {"industry": "aurora"}
    signals = adapter.collect(criteria)
    assert signals, "Expected sample signals"
    first = signals[0]
    assert first.company.startswith("aurora"), "Company name should originate from sample"
    assert first.link.startswith("https://"), "Link should be well formed"
    assert first.captured_at.tzinfo is not None, "Timestamp should be timezone aware"
    assert 0.0 <= first.reliability <= 1.0
