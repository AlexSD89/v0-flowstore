"""Domain models used by the signal collector pipeline.

These models use Pydantic BaseModel to satisfy the spec requirement of strict
validation while remaining lightweight enough for the automation runtime.
"""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from enum import Enum
from typing import Dict, Iterable, List, Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, ConfigDict, Field, computed_field


class PriorityTier(str, Enum):
    STANDARD = "standard"
    HIGH = "high"
    AUDIT = "audit"


class MissionStatus(str, Enum):
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    RUNNING = "running"
    COMPLETED = "completed"
    PAUSED = "paused"


class DiscoveryMission(BaseModel):
    """Mission definition supplied by analysts or automation."""

    model_config = ConfigDict(validate_assignment=True)

    mission_id: UUID = Field(default_factory=uuid4)
    name: str
    criteria: Dict[str, object]
    schedule: Dict[str, object] = Field(default_factory=dict)
    analyst_id: Optional[str] = None
    priority_tier: PriorityTier = PriorityTier.STANDARD
    status: MissionStatus = MissionStatus.DRAFT
    notification_channel: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_run_at: Optional[datetime] = None
    next_run_at: Optional[datetime] = None

    def schedule_next_run(self, now: Optional[datetime] = None) -> None:
        """Calculate the next run time based on cadence."""

        cadence = str(self.schedule.get("cadence", "daily")).lower()
        window = self.schedule.get("time_window")
        base = now or datetime.now(timezone.utc)

        if cadence == "daily":
            delta = timedelta(days=1)
        elif cadence == "weekly":
            delta = timedelta(weeks=1)
        elif cadence == "custom" and isinstance(self.schedule.get("interval_hours"), (int, float)):
            delta = timedelta(hours=float(self.schedule["interval_hours"]))
        else:
            delta = timedelta(days=1)

        next_run = base + delta
        if window and isinstance(window, str) and ":" in window:
            hour, minute = window.split(":", maxsplit=1)
            next_run = next_run.replace(hour=int(hour), minute=int(minute), second=0, microsecond=0)

        self.next_run_at = next_run
        self.status = MissionStatus.SCHEDULED

    @computed_field  # type: ignore[misc]
    @property
    def mission_identifier(self) -> str:
        return str(self.mission_id)


class SourcePlatformProfile(BaseModel):
    platform_id: str
    name: str
    tier: int
    rate_limit_policy: str
    signal_types: Iterable[str]
    language_profile: str
    compliance_notes: Optional[str] = None
    update_frequency_minutes: int = 60


class SignalRecord(BaseModel):
    signal_id: UUID = Field(default_factory=uuid4)
    mission_id: UUID
    platform_id: str
    company_identifier: str
    signal_category: str
    content_summary: str
    numeric_metrics: Dict[str, float] = Field(default_factory=dict)
    source_link: str
    captured_at: datetime
    freshness_score: float
    reliability_score: float
    cultural_tags: List[str] = Field(default_factory=list)
    analysis_metadata: Dict[str, object] = Field(default_factory=dict)


class SignalHighlight(BaseModel):
    company_identifier: str
    signal_category: str
    summary: str
    freshness_score: float
    reliability_score: float
    source_link: str


class CoverageStats(BaseModel):
    platforms_scanned: List[str]
    latency_seconds: int
    gaps: List[str] = Field(default_factory=list)


class AuditTrailEvent(BaseModel):
    event_id: UUID = Field(default_factory=uuid4)
    mission_id: Optional[UUID] = None
    run_id: Optional[UUID] = None
    event_type: str
    details: str
    recorded_at: datetime


class MissionRunSummary(BaseModel):
    run_id: UUID = Field(default_factory=uuid4)
    mission_id: UUID
    run_timestamp: datetime
    companies_detected: List[Dict[str, object]]
    signal_highlights: List[SignalHighlight]
    coverage_stats: CoverageStats
    confidence_interval: float
    next_actions: List[str]
    audit_trail_events: List[AuditTrailEvent] = Field(default_factory=list)
    status: MissionStatus = MissionStatus.COMPLETED

    def add_audit_event(self, event_type: str, details: str, mission_id: Optional[UUID] = None) -> None:
        event = AuditTrailEvent(
            mission_id=mission_id or self.mission_id,
            run_id=self.run_id,
            event_type=event_type,
            details=details,
            recorded_at=datetime.now(timezone.utc),
        )
        self.audit_trail_events.append(event)
