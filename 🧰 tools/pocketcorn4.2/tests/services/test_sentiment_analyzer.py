from __future__ import annotations

from pocketcorn.services.analysis.sentiment_analyzer import SentimentAnalyzer


def test_sentiment_analyzer_positive_text() -> None:
    analyzer = SentimentAnalyzer()
    result = analyzer.analyze("公司宣布融资突破")
    assert result.polarity == "positive"
    assert result.score > 0


def test_sentiment_analyzer_negative_text() -> None:
    analyzer = SentimentAnalyzer()
    result = analyzer.analyze("近期裁员风险增加")
    assert result.polarity == "negative"
    assert result.score < 0


def test_sentiment_analyzer_neutral_text() -> None:
    analyzer = SentimentAnalyzer()
    result = analyzer.analyze("产品正在测试阶段")
    assert result.polarity == "neutral"
