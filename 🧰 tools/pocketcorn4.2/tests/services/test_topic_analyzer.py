from __future__ import annotations

from pocketcorn.services.analysis.topic_analyzer import TopicAnalyzer


def test_topic_analyzer_detects_growth_and_funding() -> None:
    analyzer = TopicAnalyzer()
    text = "公司本季度用户增长 200%，同时完成新一轮融资"
    result = analyzer.analyze(text)
    assert "growth" in result.topics
    assert "funding" in result.topics
    assert result.keywords["growth"]


def test_topic_analyzer_neutral_when_no_keyword() -> None:
    analyzer = TopicAnalyzer()
    text = "产品目前在内部测试"
    result = analyzer.analyze(text)
    assert result.topics == []
