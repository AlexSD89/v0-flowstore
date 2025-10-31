from __future__ import annotations

from datetime import datetime, timezone
from typing import Dict, Optional

from pocketcorn.collectors.mission_parser import MissionDescriptionParser, merge_criteria
from pocketcorn.collectors.mission_orchestrator import MissionOrchestrator
from pocketcorn.mission_tracking.mission_repository import MissionRepository

REQUIRED_CRITERIA_FIELDS = {"industry", "geography", "revenue_threshold"}


def create_mission(payload: Dict[str, object], repository: MissionRepository) -> Dict[str, object]:
    parser = MissionDescriptionParser()
    parsed_messages: list[str] = []
    criteria: Dict[str, object] = {}

    description = str(payload.get("description", "")).strip()
    if description:
        parsed = parser.parse(description)
        criteria = merge_criteria(criteria, parsed.criteria)
        parsed_messages.extend(parsed.messages)

    if "criteria" in payload and isinstance(payload["criteria"], dict):
        criteria = merge_criteria(criteria, payload["criteria"])

    outstanding_messages = _filter_resolved_messages(criteria, parsed_messages)
    validation_errors = _validate_criteria(criteria)
    if validation_errors:
        raise ValueError("; ".join(validation_errors))

    mission = repository.create_mission(
        name=str(payload.get("name", "Unnamed Mission")),
        criteria=criteria,
        schedule=dict(payload.get("schedule", {})),
        priority=str(payload.get("priority", "standard")),
        notification_channel=payload.get("notification_channel"),
        analyst_id=str(payload.get("analyst_id", "automation")),
    )
    response = {
        "mission_id": str(mission.mission_id),
        "coverage_platforms": [
            "zhihu",
            "weibo",
            "boss",
            "linkedin",
            "github",
            "xiaohongshu",
            "producthunt",
            "v2ex",
            "indiehackers",
        ],
        "next_run_at": (mission.next_run_at or datetime.now(timezone.utc)).isoformat(),
        "validation_messages": outstanding_messages,
    }
    return response


def _filter_resolved_messages(criteria: Dict[str, object], messages: list[str]) -> list[str]:
    filtered: list[str] = []
    for message in messages:
        lower = message.lower()
        if "industry" in lower and "industry" in criteria:
            continue
        if "geograph" in lower and criteria.get("geography"):
            continue
        if "revenue" in lower and criteria.get("revenue_threshold"):
            continue
        filtered.append(message)
    return filtered


def _validate_criteria(criteria: Dict[str, object]) -> list[str]:
    errors: list[str] = []
    missing = REQUIRED_CRITERIA_FIELDS - set(criteria.keys())
    if missing:
        errors.append(
            "Missing required criteria fields: " + ", ".join(sorted(missing))
        )
    geography = criteria.get("geography")
    if not geography:
        errors.append(
            "Specify geography so we can choose the correct tiered platform coverage"
        )
    return errors


def run_mission(
    mission_id: str,
    mode: str,
    requested_by: str,
    orchestrator: MissionOrchestrator,
    override_criteria: Optional[Dict[str, object]] = None,
) -> Dict[str, object]:
    summary = orchestrator.execute_mission(
        mission_id,
        mode=mode,
        criteria_override=override_criteria,
    )
    response = {
        "run_id": str(summary.run_id),
        "mission_id": str(summary.mission_id),
        "accepted_at": summary.run_timestamp.isoformat(),
        "estimated_completion": summary.run_timestamp.isoformat(),
        "requested_by": requested_by,
    }
    if override_criteria:
        response["override_applied"] = True
    return response


def get_mission_run(run_id: str, repository: MissionRepository) -> Dict[str, object]:
    return repository.serialize_run(run_id)
