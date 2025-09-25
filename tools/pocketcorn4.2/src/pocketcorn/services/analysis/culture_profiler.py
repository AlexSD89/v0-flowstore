from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Optional

from pocketcorn.collectors.models import SignalRecord


@dataclass
class CultureAssessment:
    score: float
    alignment: str
    notes: List[str]


class CultureProfiler:
    """Assess cultural/geographic alignment between signal and mission criteria."""

    def assess(self, record: SignalRecord, mission_context: Optional[Dict[str, object]] = None) -> CultureAssessment:
        mission_context = mission_context or {}
        geographies = [str(g).upper() for g in mission_context.get("geography", [])]
        score = 0.5
        notes: List[str] = []

        tag_str = " ".join(record.cultural_tags).upper()
        if geographies:
            matched = any(geo in tag_str or geo in record.content_summary.upper() for geo in geographies)
            if matched:
                score += 0.3
                notes.append("Geography matched mission focus")
            else:
                score -= 0.2
                notes.append("Geography mismatch")

        if any(tag.startswith("lang:") for tag in record.cultural_tags):
            notes.append("Language hint present")
            score += 0.1

        score = max(0.0, min(score, 1.0))
        if score >= 0.7:
            alignment = "strong"
        elif score >= 0.4:
            alignment = "moderate"
        else:
            alignment = "weak"

        return CultureAssessment(score=score, alignment=alignment, notes=notes)
