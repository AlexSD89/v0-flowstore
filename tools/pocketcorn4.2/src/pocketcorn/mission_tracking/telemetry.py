"""Telemetry helpers bridging to LaunchX observability stack."""
from __future__ import annotations

from typing import Dict

from pocketcorn.common.logging import get_logger, mission_context

logger = get_logger("collectors.telemetry")


def record_metric(name: str, value: float, tags: Dict[str, str] | None = None) -> None:
    payload = {"metric": name, "value": value}
    if tags:
        payload.update({f"tag_{k}": v for k, v in tags.items()})
    logger.info("metric", extra={"extra_data": payload})


def record_event(event_type: str, message: str, **fields: str) -> None:
    ctx = mission_context()
    payload = {"event_type": event_type, "message": message, **fields, **ctx}
    logger.info("event", extra={"extra_data": payload})
