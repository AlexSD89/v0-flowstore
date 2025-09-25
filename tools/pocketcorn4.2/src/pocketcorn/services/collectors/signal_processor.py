from __future__ import annotations

from collections import defaultdict
from typing import Dict, Iterable, List, Optional, Set

from pocketcorn.collectors.models import SignalRecord
from pocketcorn.services.analysis.culture_profiler import CultureProfiler
from pocketcorn.services.analysis.risk_profiler import RiskProfiler
from pocketcorn.services.analysis.sentiment_analyzer import SentimentAnalyzer
from pocketcorn.services.analysis.topic_analyzer import TopicAnalyzer

CATEGORY_WEIGHTS: Dict[str, float] = {
    "revenue": 1.3,
    "hiring": 1.1,
    "funding": 1.4,
    "product": 1.0,
    "launch": 1.0,
    "community": 0.8,
    "partnership": 1.2,
}

CULTURAL_TAG_KEYWORDS: Dict[str, str] = {
    "社区": "community-engagement",
    "招聘": "localized-hiring",
    "hiring": "talent-expansion",
    "出海": "overseas-expansion",
    "融资": "capital-events",
    "funding": "capital-events",
}


class SignalProcessor:
    """Derive company-level insights from normalized signals."""

    def __init__(self) -> None:
        self.sentiment_analyzer = SentimentAnalyzer()
        self.topic_analyzer = TopicAnalyzer()
        self.risk_profiler = RiskProfiler()
        self.culture_profiler = CultureProfiler()

    def enrich(
        self,
        records: Iterable[SignalRecord],
        mission_context: Optional[Dict[str, object]] = None,
    ) -> Dict[str, Dict[str, object]]:
        mission_context = mission_context or {}
        company_signals: Dict[str, Dict[str, object]] = defaultdict(lambda: {
            "score_sum": 0.0,
            "weight_sum": 0.0,
            "insight_tags": set(),
            "evidence": set(),
            "sentiment_scores": [],
            "risk_scores": [],
            "risk_levels": [],
            "risk_tags": set(),
            "culture_scores": [],
            "culture_notes": set(),
            "topics": set(),
        })

        for record in records:
            sentiment = self.sentiment_analyzer.analyze(
                record.content_summary,
                {"platform": record.platform_id, "language": record.cultural_tags[0] if record.cultural_tags else "unknown"},
            )
            topic = self.topic_analyzer.analyze(record.content_summary)
            risk = self.risk_profiler.assess(record, sentiment, topic)
            culture = self.culture_profiler.assess(record, mission_context)

            weight = self._weight_for_category(record.signal_category)
            base_score = self._base_signal_score(record)
            derived_tags = self._derive_tags(record)
            record.cultural_tags = sorted(derived_tags)
            record.numeric_metrics["sentiment_score"] = sentiment.score
            record.numeric_metrics["risk_score"] = risk.score
            record.numeric_metrics["culture_score"] = culture.score
            metadata = {
                "sentiment": {
                    "score": sentiment.score,
                    "polarity": sentiment.polarity,
                    "confidence": sentiment.confidence,
                    "labels": sentiment.labels,
                },
                "topics": topic.topics,
                "risk": {
                    "score": risk.score,
                    "level": risk.level,
                    "tags": risk.tags,
                },
                "culture": {
                    "score": culture.score,
                    "alignment": culture.alignment,
                    "notes": culture.notes,
                },
            }
            record.analysis_metadata = metadata

            company_entry = company_signals[record.company_identifier]
            company_entry["score_sum"] += base_score * weight
            company_entry["weight_sum"] += weight
            company_entry["insight_tags"].update(derived_tags)
            company_entry["evidence"].add(record.source_link)
            company_entry["sentiment_scores"].append(sentiment.score)
            company_entry["risk_scores"].append(risk.score)
            company_entry["risk_levels"].append(risk.level)
            company_entry["risk_tags"].update(risk.tags)
            company_entry["culture_scores"].append(culture.score)
            company_entry["culture_notes"].update(culture.notes)
            company_entry["topics"].update(topic.topics)

        return {
            company: self._summarize_company(entry)
            for company, entry in company_signals.items()
        }

    def _base_signal_score(self, record: SignalRecord) -> float:
        return round(record.freshness_score * 0.6 + record.reliability_score * 0.4, 3)

    def _weight_for_category(self, category: str) -> float:
        return CATEGORY_WEIGHTS.get(category, 0.7)

    def _derive_tags(self, record: SignalRecord) -> Set[str]:
        tags = set(record.cultural_tags)
        lowered_summary = record.content_summary.lower()
        for keyword, tag in CULTURAL_TAG_KEYWORDS.items():
            if keyword in lowered_summary or keyword in record.content_summary:
                tags.add(tag)
        if record.numeric_metrics.get("mrr", 0) >= 50_000:
            tags.add("meaningful-revenue")
        if record.numeric_metrics.get("headcount", 0) >= 20:
            tags.add("team-scaling")
        return tags

    def _next_actions(self, score_sum: float, tags: Set[str], risk_levels: List[str]) -> List[str]:
        actions: List[str] = []
        if score_sum >= 3.0:
            actions.append("Fast-track for investment committee review")
        if "capital-events" in tags:
            actions.append("Verify funding source and round size")
        if "talent-expansion" in tags:
            actions.append("Engage talent intelligence agent for hiring trend")
        if "high" in risk_levels:
            actions.append("Investigate risk signals with compliance team")
        if not actions:
            actions.append("Schedule follow-up scan in 48h")
        return actions

    def _summarize_company(self, entry: Dict[str, object]) -> Dict[str, object]:
        weight_sum = entry["weight_sum"] or 1.0
        average_sentiment = sum(entry["sentiment_scores"]) / max(len(entry["sentiment_scores"]), 1)
        average_culture = sum(entry["culture_scores"]) / max(len(entry["culture_scores"]), 1)
        max_risk_score = max(entry["risk_scores"] or [0.0])
        risk_level = self._max_risk_level(entry["risk_levels"])
        return {
            "score": round(entry["score_sum"] / weight_sum, 2),
            "insight_tags": sorted(entry["insight_tags"]),
            "evidence_links": sorted(entry["evidence"]),
            "next_actions": self._next_actions(entry["score_sum"], entry["insight_tags"], entry["risk_levels"]),
            "sentiment": {
                "average_score": round(average_sentiment, 2),
            },
            "risk": {
                "score": round(max_risk_score, 2),
                "level": risk_level,
                "tags": sorted(entry["risk_tags"]),
            },
            "culture": {
                "average_score": round(average_culture, 2),
                "notes": sorted(entry["culture_notes"]),
            },
            "topics": sorted(entry["topics"]),
        }

    @staticmethod
    def _max_risk_level(levels: List[str]) -> str:
        if "high" in levels:
            return "high"
        if "medium" in levels:
            return "medium"
        return "low"
