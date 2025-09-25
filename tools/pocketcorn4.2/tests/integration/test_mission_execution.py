from __future__ import annotations

from pocketcorn.collectors.errors import RateLimitError


def test_full_mission_execution(orchestrator, mission_repository) -> None:
    mission = mission_repository.create_mission(
        name="AI Growth Signals",
        criteria={
            "industry": "ai",
            "geography": ["CN"],
            "revenue_threshold": 40_000,
            "growth_signals": ["hiring", "revenue"],
        },
        schedule={"cadence": "daily"},
        priority="standard",
        notification_channel=None,
    )

    run_summary = orchestrator.execute_mission(mission.mission_id, mode="on-demand")

    assert run_summary.mission_id == mission.mission_id
    assert len(run_summary.companies_detected) >= 1
    assert run_summary.coverage_stats.platforms_scanned
    assert run_summary.signal_highlights
    assert all(company["insight_tags"] for company in run_summary.companies_detected)
    for highlight in run_summary.signal_highlights:
        assert highlight.freshness_score <= 1.0
        assert highlight.reliability_score <= 1.0


def test_rate_limit_records_audit_event(orchestrator, mission_repository, collector_registry) -> None:
    mission = mission_repository.create_mission(
        name="Rate limit scenario",
        criteria={"industry": "ai", "geography": ["CN"], "revenue_threshold": 10_000},
        schedule={"cadence": "daily"},
        priority="standard",
        notification_channel=None,
    )

    collector_registry.inject_transient_error("weibo", RateLimitError("Rate limit exceeded"))

    run_summary = orchestrator.execute_mission(mission.mission_id, mode="on-demand")

    assert run_summary.audit_trail_events
    assert any(event.event_type == "rate_limit" for event in run_summary.audit_trail_events)
    assert all(event.run_id == run_summary.run_id for event in run_summary.audit_trail_events)
