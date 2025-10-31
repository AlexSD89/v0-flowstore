from __future__ import annotations

from pocketcorn.collectors.mission_parser import MissionDescriptionParser


def test_parser_extracts_key_fields() -> None:
    parser = MissionDescriptionParser()
    description = "Scan mainland China AI startups hitting 50k MRR and ramping up hiring"

    parsed = parser.parse(description)

    assert parsed.criteria["industry"] == "artificial intelligence"
    assert parsed.criteria["revenue_threshold"] == 50_000
    assert "CN" in parsed.criteria["geography"]
    assert "hiring" in parsed.criteria["growth_signals"]
    assert not parsed.messages  # all key fields resolved


def test_parser_prompts_for_missing_information() -> None:
    parser = MissionDescriptionParser()
    description = "Find promising startups overseas"

    parsed = parser.parse(description)

    assert any("Specify priority geographies" in msg for msg in parsed.messages)
    assert any("Provide a revenue" in msg for msg in parsed.messages)
    assert any("Clarify target industry" in msg for msg in parsed.messages)
