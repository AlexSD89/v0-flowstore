from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Dict, List, Tuple

COUNTRY_ALIASES: Dict[str, str] = {
    "china": "CN",
    "mainland": "CN",
    "cn": "CN",
    "beijing": "CN",
    "shanghai": "CN",
    "hong kong": "HK",
    "hk": "HK",
    "singapore": "SG",
    "sg": "SG",
    "taiwan": "TW",
    "tw": "TW",
    "us": "US",
    "united states": "US",
    "europe": "EU",
}

INDUSTRY_KEYWORDS: Dict[str, str] = {
    "ai": "artificial intelligence",
    "machine learning": "artificial intelligence",
    "llm": "artificial intelligence",
    "saas": "saas",
    "developer": "developer tools",
    "devtools": "developer tools",
    "robotics": "robotics",
    "biotech": "biotech",
}

SIGNAL_KEYWORDS: Dict[str, str] = {
    "hiring": "hiring",
    "招聘": "hiring",
    "mrr": "revenue",
    "revenue": "revenue",
    "growth": "growth",
    "融资": "funding",
    "funding": "funding",
    "partnership": "partnership",
}

REVENUE_PATTERNS = [
    re.compile(r"(?P<amount>\d+(?:\.\d+)?)\s*(?P<unit>k|万|m|million|亿|万元|人民币|rmb)?\s*(mrr|收入|revenue)?", re.IGNORECASE),
    re.compile(r"达(?P<amount>\d+)(?P<unit>万)\s*mr?\b", re.IGNORECASE),
]


@dataclass
class ParsedMission:
    criteria: Dict[str, object]
    messages: List[str]


class MissionDescriptionParser:
    """Heuristic parser turning free-form descriptions into mission criteria."""

    def parse(self, description: str) -> ParsedMission:
        description_lower = description.lower()
        criteria: Dict[str, object] = {}
        messages: List[str] = []

        industry = self._extract_industry(description_lower)
        if industry:
            criteria["industry"] = industry
        else:
            messages.append("Clarify target industry (e.g., enterprise AI, SaaS)")

        geography = self._extract_geography(description_lower)
        if geography:
            criteria["geography"] = geography
        else:
            messages.append("Specify priority geographies so we can select platform mix")

        revenue = self._extract_revenue_threshold(description_lower)
        if revenue:
            criteria["revenue_threshold"] = revenue
        else:
            messages.append("Provide a revenue or traction threshold (e.g., 50k MRR)")

        growth_signals = self._extract_signals(description_lower)
        if growth_signals:
            criteria["growth_signals"] = growth_signals

        cultural_focus = self._extract_cultural_focus(description_lower)
        if cultural_focus:
            criteria["cultural_focus"] = cultural_focus

        return ParsedMission(criteria=criteria, messages=messages)

    def _extract_industry(self, text: str) -> str | None:
        for keyword, normalized in INDUSTRY_KEYWORDS.items():
            if keyword in text:
                return normalized
        return None

    def _extract_geography(self, text: str) -> List[str]:
        geos: List[str] = []
        for alias, code in COUNTRY_ALIASES.items():
            if alias in text:
                if code not in geos:
                    geos.append(code)
        return geos

    def _extract_revenue_threshold(self, text: str) -> int | None:
        for pattern in REVENUE_PATTERNS:
            match = pattern.search(text)
            if not match:
                continue
            amount = float(match.group("amount"))
            unit = match.group("unit") or ""
            unit = unit.lower()
            if unit in {"k", "千"}:
                amount *= 1_000
            elif unit in {"m", "million"}:
                amount *= 1_000_000
            elif unit in {"万", "万元"}:
                amount *= 10_000
            elif unit in {"亿"}:
                amount *= 100_000_000
            return int(amount)
        return None

    def _extract_signals(self, text: str) -> List[str]:
        signals: List[str] = []
        for keyword, mapped in SIGNAL_KEYWORDS.items():
            if keyword in text and mapped not in signals:
                signals.append(mapped)
        return signals

    def _extract_cultural_focus(self, text: str) -> str | None:
        if "mainland" in text or "本土" in text:
            return "mainland"
        if "global" in text:
            return "global"
        if "overseas" in text or "出海" in text:
            return "overseas"
        return None


def merge_criteria(primary: Dict[str, object], overrides: Dict[str, object]) -> Dict[str, object]:
    merged = dict(primary)
    for key, value in overrides.items():
        if isinstance(value, list):
            base = list(merged.get(key, []))
            for item in value:
                if item not in base:
                    base.append(item)
            merged[key] = base
        else:
            merged[key] = value
    return merged
