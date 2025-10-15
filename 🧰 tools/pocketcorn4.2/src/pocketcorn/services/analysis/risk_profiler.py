from __future__ import annotations

from dataclasses import dataclass
from typing import List

from pocketcorn.collectors.models import SignalRecord
from pocketcorn.services.analysis.sentiment_analyzer import SentimentResult
from pocketcorn.services.analysis.topic_analyzer import TopicResult


@dataclass
class RiskAssessment:
    score: float
    level: str
    tags: List[str]
    reasons: List[str]


class RiskProfiler:
    """Heuristic risk profiler combining sentiment, topics and signal metadata."""

    def assess(self, record: SignalRecord, sentiment: SentimentResult, topics: TopicResult) -> RiskAssessment:
        score = 0.0
        tags: List[str] = []
        reasons: List[str] = []

        if sentiment.polarity == "negative":
            score += 0.4
            tags.append("negative-sentiment")
            reasons.append("Sentiment indicates negative polarity")
        if "risk" in topics.topics or "risk" in record.signal_category.lower():
            score += 0.3
            tags.append("risk-keyword")
            reasons.append("Risk-related keywords detected")
        if record.reliability_score < 0.6:
            score += 0.2
            tags.append("low-reliability")
            reasons.append("Low reliability score")
        if record.freshness_score < 0.2:
            score += 0.1
            tags.append("stale")
            reasons.append("Signal is stale")

        score = min(score, 1.0)
        if score >= 0.6:
            level = "high"
        elif score >= 0.3:
            level = "medium"
        else:
            level = "low"

        return RiskAssessment(score=score, level=level, tags=tags, reasons=reasons)
