"""Shared logging utilities for Pocketcorn services.

Provides helpers to inject mission context into structured logs and to
initialise loggers that follow the LaunchX observability convention:
`service.component` logger names and JSON friendly key/value payloads.
"""
from __future__ import annotations

import json
import logging
from contextlib import contextmanager
from contextvars import ContextVar
from datetime import datetime, timezone
from typing import Any, Dict, Iterator, Optional

# Mission specific context stored in context variables so async workers inherit them
_mission_id: ContextVar[Optional[str]] = ContextVar("mission_id", default=None)
_run_id: ContextVar[Optional[str]] = ContextVar("run_id", default=None)


def get_logger(component: str) -> logging.Logger:
    """Return a logger configured for the given component.

    Components should use dotted names (e.g. "collectors.scheduler").
    The logger emits JSON payloads to ease ingestion by the observability stack.
    """

    logger_name = f"pocketcorn.{component}" if not component.startswith("pocketcorn") else component
    logger = logging.getLogger(logger_name)

    if not logger.handlers:
        handler = logging.StreamHandler()
        handler.setFormatter(_JsonFormatter())
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)

    return logger


def mission_context() -> Dict[str, Optional[str]]:
    """Expose the current mission context for downstream consumers."""

    return {"mission_id": _mission_id.get(), "run_id": _run_id.get()}


@contextmanager
def bind_mission(mission_id: Optional[str], run_id: Optional[str] = None) -> Iterator[None]:
    """Context manager that binds mission and run identifiers for log enrichment."""

    token_mission = _mission_id.set(mission_id)
    token_run = _run_id.set(run_id)
    try:
        yield
    finally:
        _mission_id.reset(token_mission)
        _run_id.reset(token_run)


class _JsonFormatter(logging.Formatter):
    """Formatter producing JSON logs with contextual fields."""

    def format(self, record: logging.LogRecord) -> str:  # noqa: D401 - standard override
        payload: Dict[str, Any] = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "logger": record.name,
        }
        context = mission_context()
        if context["mission_id"]:
            payload.update(context)
        if record.exc_info:
            payload["exception"] = self.formatException(record.exc_info)
        if record.__dict__.get("extra_data"):
            payload.update(record.__dict__["extra_data"])
        return json.dumps(payload, ensure_ascii=False)
