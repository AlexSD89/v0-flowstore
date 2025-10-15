from __future__ import annotations

import statistics
from datetime import datetime, timezone
from typing import Dict, Iterable, List, Tuple, Optional
from uuid import UUID, uuid4

from pocketcorn.collectors.adapters.base import BaseAdapter
from pocketcorn.collectors.errors import CollectorError, RateLimitError
from pocketcorn.collectors.models import (
    AuditTrailEvent,
    CoverageStats,
    DiscoveryMission,
    MissionRunSummary,
    SignalHighlight,
)
from pocketcorn.collectors.registry import CollectorRegistry
from pocketcorn.collectors.mission_parser import merge_criteria
from pocketcorn.common.logging import bind_mission, get_logger
from pocketcorn.mission_tracking.mission_repository import MissionRepository
from pocketcorn.mission_tracking.telemetry import record_event, record_metric
from pocketcorn.normalization.signal_normalizer import SignalNormalizer
from pocketcorn.services.collectors import SignalProcessor

logger = get_logger("collectors.mission_orchestrator")


class MissionOrchestrator:
    """Coordinates adapters, normalization and storage for mission runs."""

    def __init__(self, repository: MissionRepository, collector_registry: CollectorRegistry) -> None:
        self.repository = repository
        self.collector_registry = collector_registry
        self.normalizer = SignalNormalizer()
        self.processor = SignalProcessor()

    def execute_mission(
        self,
        mission_id: str | UUID,
        mode: str = "on-demand",
        criteria_override: Optional[Dict[str, object]] = None,
    ) -> MissionRunSummary:
        mission_identifier = str(mission_id)
        mission = self.repository.get_mission(mission_identifier)
        run_id = uuid4()
        effective_criteria: Dict[str, object] = dict(mission.criteria)
        if criteria_override:
            effective_criteria = merge_criteria(effective_criteria, criteria_override)
        with bind_mission(str(mission.mission_id), str(run_id)):
            logger.info("mission.start", extra={"extra_data": {"mode": mode}})
            normalized_records, audit_events, scanned_platforms = self._collect_signals(
                mission,
                run_id,
                effective_criteria,
            )
            company_profiles = self.processor.enrich(normalized_records, mission.criteria)
            highlights = self.normalizer.highlights(normalized_records)
            companies = self._aggregate_companies(normalized_records, company_profiles)
            coverage = CoverageStats(platforms_scanned=scanned_platforms, latency_seconds=10, gaps=[])
            summary = MissionRunSummary(
                run_id=run_id,
                mission_id=mission.mission_id,
                run_timestamp=datetime.now(timezone.utc),
                companies_detected=companies,
                signal_highlights=highlights,
                coverage_stats=coverage,
                confidence_interval=0.8,
                next_actions=["Run Study phase analysis", "Trigger cultural intelligence review"],
                audit_trail_events=audit_events,
            )
            if criteria_override:
                summary.add_audit_event(
                    "criteria_override",
                    "Applied temporary mission criteria override",
                    mission_id=mission.mission_id,
                )
            self.repository.save_run(summary)
            self.repository.update_last_run_timestamp(str(mission.mission_id))
            record_metric(
                "mission.signals_collected",
                float(len(normalized_records)),
                tags={"mode": mode, "mission_id": str(mission.mission_id), "run_id": str(run_id)},
            )
            record_event(
                "mission_completed",
                "Mission collected signals",
                run_id=str(run_id),
                mission_id=str(mission.mission_id),
            )
            return summary

    # Internal helpers ----------------------------------------------------
    def _collect_signals(
        self,
        mission: DiscoveryMission,
        run_id: UUID,
        criteria: Dict[str, object],
    ) -> Tuple[List, List[AuditTrailEvent], List[str]]:
        normalized_records: List = []
        audit_events: List[AuditTrailEvent] = []
        scanned: List[str] = []
        for adapter in self.collector_registry.adapters():
            scanned.append(adapter.platform_id)
            with bind_mission(str(mission.mission_id), str(run_id)):
                try:
                    raw_signals = self._collect_from_adapter(adapter, criteria)
                except RateLimitError as exc:
                    event = AuditTrailEvent(
                        mission_id=mission.mission_id,
                        run_id=run_id,
                        event_type="rate_limit",
                        details=str(exc),
                        recorded_at=datetime.now(timezone.utc),
                    )
                    audit_events.append(event)
                    record_event(
                        "rate_limit",
                        str(exc),
                        platform=adapter.platform_id,
                        mission_id=str(mission.mission_id),
                        run_id=str(run_id),
                    )
                    continue
                except CollectorError as exc:
                    event = AuditTrailEvent(
                        mission_id=mission.mission_id,
                        run_id=run_id,
                        event_type="collector_error",
                        details=str(exc),
                        recorded_at=datetime.now(timezone.utc),
                    )
                    audit_events.append(event)
                    record_event(
                        "collector_error",
                        str(exc),
                        platform=adapter.platform_id,
                        mission_id=str(mission.mission_id),
                        run_id=str(run_id),
                    )
                    continue
                if not raw_signals:
                    continue
                normalized = self.normalizer.normalize(str(mission.mission_id), adapter.platform_id, raw_signals)
                normalized_records.extend(normalized)
        return normalized_records, audit_events, scanned

    def _collect_from_adapter(self, adapter: BaseAdapter, criteria: Dict[str, object]):
        return adapter.collect(criteria)

    def _aggregate_companies(self, records: List, profiles: Dict[str, Dict[str, object]]) -> List[Dict[str, object]]:
        grouped: Dict[str, List[SignalHighlight]] = {}
        highlights = self.normalizer.highlights(records)
        for highlight in highlights:
            grouped.setdefault(highlight.company_identifier, []).append(highlight)
        companies: List[Dict[str, object]] = []
        for company, company_highlights in grouped.items():
            scores = [(h.freshness_score + h.reliability_score) / 2 for h in company_highlights]
            base_score = round(statistics.mean(scores), 2) if scores else 0.0
            profile = profiles.get(
                company,
                {
                    "score": base_score,
                    "insight_tags": [],
                    "evidence": [],
                    "next_actions": ["Review signals"],
                },
            )
            overall_score = profile.get("score", base_score) or base_score
            company_payload = {
                "company_identifier": company,
                "overall_score": overall_score,
                "signal_highlights": [h.model_dump(mode="json") for h in company_highlights],
                "insight_tags": profile.get("insight_tags", []),
                "evidence_links": profile.get("evidence_links", profile.get("evidence", [])),
                "recommendations": profile.get("next_actions", ["Proceed to committee debate"]),
            }
            if "sentiment" in profile:
                company_payload["sentiment"] = profile["sentiment"]
            if "risk" in profile:
                company_payload["risk"] = profile["risk"]
            if "culture" in profile:
                company_payload["culture"] = profile["culture"]
            if "topics" in profile:
                company_payload["topics"] = profile["topics"]
            companies.append(company_payload)
        return companies

    def adapters(self) -> Iterable[BaseAdapter]:  # pragma: no cover - simple passthrough
        return self.collector_registry.adapters()
