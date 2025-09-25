from __future__ import annotations

from pocketcorn.api import missions


def test_mission_run_contract(orchestrator, mission_repository) -> None:
    payload = {
        "name": "AI Startups 50k MRR",
        "criteria": {
            "industry": "enterprise AI",
            "geography": ["CN", "HK"],
            "revenue_threshold": 50_000,
            "growth_signals": ["hiring"],
            "cultural_focus": "mainland",
        },
        "schedule": {"cadence": "daily"},
    }

    creation = missions.create_mission(payload, repository=mission_repository)
    run_meta = missions.run_mission(
        mission_id=creation["mission_id"],
        mode="on-demand",
        requested_by="analyst@launchx",
        orchestrator=orchestrator,
    )

    assert run_meta["run_id"]
    summary = missions.get_mission_run(run_meta["run_id"], repository=mission_repository)

    assert summary["mission_id"] == creation["mission_id"]
    assert isinstance(summary["companies_detected"], list)
    assert summary["companies_detected"]
    company = summary["companies_detected"][0]
    assert {"company_identifier", "overall_score", "signal_highlights"}.issubset(company)
    assert "insight_tags" in company
    assert "evidence_links" in company
    assert company["recommendations"]
    assert isinstance(summary["coverage_stats"], dict)
    assert isinstance(summary["audit_trail"], list)
