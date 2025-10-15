from __future__ import annotations

from fastapi.testclient import TestClient

from pocketcorn.api.main import create_app


def _client() -> TestClient:
    app = create_app()
    return TestClient(app)


def test_create_and_run_mission_via_api() -> None:
    with _client() as client:
        response = client.post(
            "/missions",
            json={
                "name": "API Mission",
                "description": "Scan mainland AI companies hitting 50k MRR",
                "priority": "high",
            },
        )
        assert response.status_code == 201
        mission_id = response.json()["mission_id"]

        run_response = client.post(
            f"/missions/{mission_id}/run",
            json={"mode": "on-demand", "requested_by": "test-suite"},
        )
        assert run_response.status_code == 202
        run_payload = run_response.json()
        assert run_payload["mission_id"] == mission_id

        summary = client.get(f"/missions/runs/{run_payload['run_id']}")
        assert summary.status_code == 200
        body = summary.json()
        assert body["mission_id"] == mission_id
        assert body["companies_detected"]


def test_run_with_override_records_flag() -> None:
    with _client() as client:
        mission = client.post(
            "/missions",
            json={
                "name": "Override Mission",
                "criteria": {
                    "industry": "artificial intelligence",
                    "geography": ["CN"],
                    "revenue_threshold": 40000,
                },
            },
        ).json()
        run_meta = client.post(
            f"/missions/{mission['mission_id']}/run",
            json={
                "mode": "on-demand",
                "override_criteria": {"geography": ["CN", "HK"]},
                "requested_by": "integration-test",
            },
        )
        assert run_meta.status_code == 202
        payload = run_meta.json()
        assert payload.get("override_applied") is True

        summary = client.get(f"/missions/runs/{payload['run_id']}").json()
        assert any(event["event_type"] == "criteria_override" for event in summary["audit_trail"])  # type: ignore[index]
