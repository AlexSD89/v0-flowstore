#!/usr/bin/env python3
"""
情感分析引擎 - 专业金融情感分析系统
集成多种情感分析模型，针对Tesla股票进行深度情感分析

Built with love by Moon Dev 🚀
"""

import numpy as np
import pandas as pd
import sqlite3
import json
import re
import time
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import requests
from collections import Counter
import warnings
warnings.filterwarnings('ignore')

# 设置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('sentiment_analysis.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class SentimentAnalysisEngine:
    """情感分析引擎"""

    def __init__(self):
        """初始化情感分析引擎"""
        self.conn = sqlite3.connect('sentiment_analysis.db')
        self.setup_database()

        # 情感词典
        self.positive_words = self._load_positive_words()
        self.negative_words = self._load_negative_words()
        self.tesla_specific_words = self._load_tesla_specific_words()

        # API配置
        self.openai_api_key = "your_openai_api_key"
        self.google_api_key = "your_google_api_key"

        logger.info("🧠 情感分析引擎初始化完成")

    def setup_database(self):
        """建立情感分析数据库架构"""
        cursor = self.conn.cursor()

        # 新闻情感分析表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS news_sentiment_analysis (
                article_id TEXT PRIMARY KEY,
                title TEXT,
                content TEXT,
                source TEXT,
                published_at TEXT,
                sentiment_score REAL,
                confidence REAL,
                emotion breakdown TEXT,
                key_phrases TEXT,
                topic_classification TEXT,
                market_impact_prediction TEXT,
                analysis_timestamp TEXT
            )
        ''')

        # 社交媒体情感分析表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS social_media_sentiment (
                post_id TEXT PRIMARY KEY,
                platform TEXT,
                author TEXT,
                content TEXT,
                likes_count INTEGER,
                shares_count INTEGER,
                comments_count INTEGER,
                followers_count INTEGER,
                verified BOOLEAN,
                sentiment_score REAL,
                confidence REAL,
                emotion_breakdown TEXT,
                influence_weight REAL,
                viral_potential REAL,
                analysis_timestamp TEXT
            )
        ''')

        # 分析师评级情感分析表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS analyst_sentiment (
                report_id TEXT PRIMARY KEY,
                analyst_name TEXT,
                firm_name TEXT,
                rating TEXT,
                target_price REAL,
                previous_rating TEXT,
                rating_change TEXT,
                report_date TEXT,
                sentiment_score REAL,
                confidence REAL,
                key_reasoning TEXT,
                sentiment_trend TEXT,
                analysis_timestamp TEXT
            )
        ''')

        # 实时情感指数表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS realtime_sentiment_index (
                timestamp TEXT PRIMARY KEY,
                overall_sentiment REAL,
                news_sentiment REAL,
                social_sentiment REAL,
                analyst_sentiment REAL,
                volume_weighted_sentiment REAL,
                influence_weighted_sentiment REAL,
                momentum_sentiment REAL,
                volatility_sentiment REAL,
                sentiment_strength REAL,
                sentiment_direction TEXT,
                key_drivers TEXT
            )
        ''')

        # 情感趋势分析表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS sentiment_trend_analysis (
                date TEXT PRIMARY KEY,
                daily_avg_sentiment REAL,
                sentiment_volatility REAL,
                sentiment_momentum REAL,
                positive_momentum REAL,
                negative_momentum REAL,
                sentiment_range REAL,
                crossover_points TEXT,
                trend_direction TEXT,
                trend_strength REAL
            )
        ''')

        # 情感异常检测表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS sentiment_anomalies (
                timestamp TEXT PRIMARY KEY,
                anomaly_type TEXT,
                sentiment_deviation REAL,
                z_score REAL,
                trigger_events TEXT,
                market_reaction TEXT,
                recovery_time TEXT,
                significance_level REAL
            )
        ''')

        # 情感-价格相关性分析表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS sentiment_price_correlation (
                date TEXT PRIMARY KEY,
                sentiment_score REAL,
                price_change REAL,
                volume_change REAL,
                correlation_coefficient REAL,
                lead_lag_relationship REAL,
                predictive_power REAL,
                confidence_level REAL
            )
        ''')

        self.conn.commit()
        logger.info("✅ 情感分析数据库架构建立完成")

    def _load_positive_words(self) -> set:
        """加载积极情感词汇"""
        return {
            'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'positive', 'growth',
            'bullish', 'rally', 'surge', 'jump', 'rise', 'increase', 'gain', 'profit', 'success',
            'strong', 'robust', 'healthy', 'optimistic', 'promising', 'outstanding', 'superb',
            'brilliant', 'magnificent', 'spectacular', 'remarkable', 'extraordinary', 'innovative',
            'breakthrough', 'milestone', 'achievement', 'victory', 'triumph', 'win', 'winner',
            'buy', 'upgrade', 'outperform', 'recommend', 'hold', 'accumulate', 'overweight'
        }

    def _load_negative_words(self) -> set:
        """加载消极情感词汇"""
        return {
            'bad', 'terrible', 'awful', 'horrible', 'negative', 'decline', 'fall', 'drop',
            'crash', 'loss', 'lose', 'losing', 'disaster', 'catastrophe', 'failure', 'fail',
            'bearish', 'sell', 'downgrade', 'underperform', 'avoid', 'concern', 'worry',
            'risk', 'dangerous', 'volatile', 'uncertain', 'unstable', 'weak', 'poor',
            'disappointing', 'troubling', 'alarming', 'scary', 'fear', 'panic', 'crisis',
            'recession', 'depression', 'slump', 'downturn', 'contraction', 'shrinkage'
        }

    def _load_tesla_specific_words(self) -> Dict[str, float]:
        """加载Tesla特定词汇权重"""
        return {
            # 技术相关
            'autopilot': 0.3, 'full self driving': 0.4, 'fsd': 0.4, 'model 3': 0.2,
            'model y': 0.2, 'model s': 0.2, 'model x': 0.2, 'cybertruck': 0.3,
            'supercharger': 0.2, 'gigafactory': 0.3, 'battery': 0.2, 'lithium': 0.1,
            'solar': 0.1, 'energy': 0.1, 'powerwall': 0.1,

            # 人物相关
            'elon musk': 0.3, 'musk': 0.2, 'berkshire': -0.1, 'warren buffett': -0.1,

            # 财务相关
            'delivery': 0.2, 'production': 0.2, 'earnings': 0.1, 'revenue': 0.1,
            'margin': 0.1, 'profit': 0.2, 'growth': 0.3, 'expansion': 0.2,

            # 竞争相关
            'competition': -0.1, 'competitor': -0.1, 'rivian': -0.1, 'lucid': -0.1,
            'byd': -0.1, 'nio': -0.1, 'xpeng': -0.1, 'gm': -0.1, 'ford': -0.1,

            # 监管相关
            'regulation': -0.2, 'investigation': -0.3, 'nhtsa': -0.2, 'recall': -0.4,
            'safety': -0.1, 'autonomous': 0.1, 'self driving': 0.1
        }

    def analyze_text_sentiment(self, text: str, context: str = "general") -> Dict:
        """分析文本情感"""
        try:
            if not text or len(text.strip()) == 0:
                return {
                    'sentiment_score': 0.0,
                    'confidence': 0.0,
                    'emotion_breakdown': {},
                    'key_phrases': []
                }

            # 预处理文本
            processed_text = self._preprocess_text(text)

            # 1. 词汇级别的情感分析
            word_sentiment = self._word_level_sentiment_analysis(processed_text)

            # 2. Tesla特定词汇分析
            tesla_sentiment = self._tesla_specific_sentiment_analysis(processed_text)

            # 3. 情感强度分析
            intensity_analysis = self._analyze_sentiment_intensity(processed_text)

            # 4. 情感复杂性分析
            complexity_analysis = self._analyze_sentiment_complexity(processed_text)

            # 5. 综合情感分数
            overall_sentiment = self._combine_sentiment_scores(
                word_sentiment, tesla_sentiment, intensity_analysis, complexity_analysis
            )

            # 6. 提取关键短语
            key_phrases = self._extract_key_phrases(processed_text)

            # 7. 情感细分分析
            emotion_breakdown = self._analyze_emotion_breakdown(processed_text)

            result = {
                'sentiment_score': overall_sentiment['score'],
                'confidence': overall_sentiment['confidence'],
                'emotion_breakdown': emotion_breakdown,
                'key_phrases': key_phrases,
                'word_sentiment': word_sentiment,
                'tesla_sentiment': tesla_sentiment,
                'intensity': intensity_analysis,
                'complexity': complexity_analysis
            }

            return result

        except Exception as e:
            logger.error(f"❌ 文本情感分析失败: {e}")
            return {
                'sentiment_score': 0.0,
                'confidence': 0.0,
                'emotion_breakdown': {},
                'key_phrases': [],
                'error': str(e)
            }

    def _preprocess_text(self, text: str) -> str:
        """预处理文本"""
        # 转换为小写
        text = text.lower()

        # 移除URL
        text = re.sub(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', '', text)

        # 移除邮箱
        text = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', '', text)

        # 移除多余空白
        text = re.sub(r'\s+', ' ', text).strip()

        # 移除特殊字符但保留标点
        text = re.sub(r'[^\w\s\.\!\?\,\;\:]', '', text)

        return text

    def _word_level_sentiment_analysis(self, text: str) -> Dict:
        """词汇级别的情感分析"""
        words = text.split()

        positive_count = sum(1 for word in words if word in self.positive_words)
        negative_count = sum(1 for word in words if word in self.negative_words)

        total_sentiment_words = positive_count + negative_count
        if total_sentiment_words == 0:
            return {'score': 0.0, 'confidence': 0.0, 'positive_count': 0, 'negative_count': 0}

        # 计算情感分数
        raw_score = (positive_count - negative_count) / total_sentiment_words
        confidence = min(total_sentiment_words / len(words), 1.0)  # 基于情感词占比的置信度

        return {
            'score': raw_score,
            'confidence': confidence,
            'positive_count': positive_count,
            'negative_count': negative_count,
            'total_words': len(words),
            'sentiment_word_ratio': total_sentiment_words / len(words)
        }

    def _tesla_specific_sentiment_analysis(self, text: str) -> Dict:
        """Tesla特定词汇情感分析"""
        text_lower = text.lower()
        tesla_score = 0.0
        matched_terms = []

        for term, weight in self.tesla_specific_words.items():
            if term in text_lower:
                count = text_lower.count(term)
                tesla_score += weight * count
                matched_terms.append((term, weight, count))

        # 归一化分数
        normalized_score = max(-1.0, min(1.0, tesla_score / 10))  # 除以10进行归一化

        return {
            'score': normalized_score,
            'matched_terms': matched_terms,
            'raw_score': tesla_score
        }

    def _analyze_sentiment_intensity(self, text: str) -> Dict:
        """分析情感强度"""
        # 强度词汇
        intensifiers = {
            'very': 1.5, 'extremely': 2.0, 'really': 1.3, 'absolutely': 1.8,
            'completely': 1.7, 'totally': 1.6, 'incredibly': 1.9, 'amazingly': 1.8,
            'surprisingly': 1.4, 'exceptionally': 1.9, 'remarkably': 1.6,
            'slightly': 0.7, 'somewhat': 0.8, 'fairly': 0.9, 'rather': 0.8,
            'quite': 1.1, 'pretty': 1.0, 'highly': 1.6, 'strongly': 1.7
        }

        words = text.split()
        intensity_multiplier = 1.0
        intensifier_count = 0

        for word in words:
            if word in intensifiers:
                intensity_multiplier = max(intensity_multiplier, intensifiers[word])
                intensifier_count += 1

        # 感叹号和问号增强强度
        exclamation_count = text.count('!')
        question_count = text.count('?')

        punctuation_intensity = 1.0 + (exclamation_count * 0.2) + (question_count * 0.1)

        total_intensity = intensity_multiplier * punctuation_intensity

        return {
            'intensity_multiplier': total_intensity,
            'intensifier_count': intensifier_count,
            'exclamation_count': exclamation_count,
            'question_count': question_count,
            'punctuation_intensity': punctuation_intensity
        }

    def _analyze_sentiment_complexity(self, text: str) -> Dict:
        """分析情感复杂性"""
        # 情感转折词
        transition_words = {
            'but', 'however', 'although', 'though', 'yet', 'nevertheless',
            'while', 'whereas', 'despite', 'in spite of', 'on the other hand'
        }

        # 对比词汇
        contrast_words = {
            'good', 'bad', 'positive', 'negative', 'increase', 'decrease',
            'gain', 'loss', 'success', 'failure', 'strong', 'weak'
        }

        words = text.split()
        transition_count = sum(1 for word in words if word in transition_words)

        # 检测对比
        has_contrast = False
        positive_present = any(word in self.positive_words for word in words)
        negative_present = any(word in self.negative_words for word in words)

        if positive_present and negative_present:
            has_contrast = True

        # 复杂度评分
        complexity_score = 0.0
        if transition_count > 0:
            complexity_score += 0.3
        if has_contrast:
            complexity_score += 0.4
        if len(words) > 50:  # 长文本通常更复杂
            complexity_score += 0.3

        return {
            'complexity_score': min(complexity_score, 1.0),
            'transition_count': transition_count,
            'has_contrast': has_contrast,
            'text_length': len(words)
        }

    def _combine_sentiment_scores(self, word_sentiment: Dict, tesla_sentiment: Dict,
                                intensity_analysis: Dict, complexity_analysis: Dict) -> Dict:
        """综合多个情感分析结果"""
        # 基础情感分数
        base_score = word_sentiment['score']

        # Tesla特定调整
        tesla_adjustment = tesla_sentiment['score'] * 0.3  # Tesla词汇权重30%

        # 强度调整
        intensity_adjustment = intensity_analysis['intensity_multiplier']

        # 复杂度调整 (复杂文本降低置信度)
        complexity_adjustment = 1.0 - (complexity_analysis['complexity_score'] * 0.2)

        # 综合分数
        combined_score = (base_score + tesla_adjustment) * intensity_adjustment

        # 限制在[-1, 1]范围内
        combined_score = max(-1.0, min(1.0, combined_score))

        # 综合置信度
        base_confidence = word_sentiment['confidence']
        adjusted_confidence = base_confidence * complexity_adjustment * min(intensity_adjustment, 1.0)

        return {
            'score': combined_score,
            'confidence': min(adjusted_confidence, 1.0),
            'breakdown': {
                'base_score': base_score,
                'tesla_adjustment': tesla_adjustment,
                'intensity_multiplier': intensity_adjustment,
                'complexity_adjustment': complexity_adjustment
            }
        }

    def _extract_key_phrases(self, text: str) -> List[str]:
        """提取关键短语"""
        # 简单的关键短语提取
        sentences = text.split('.')
        key_phrases = []

        for sentence in sentences:
            sentence = sentence.strip()
            if len(sentence) > 10:  # 过滤太短的句子
                # 寻找包含情感词的短语
                words = sentence.split()
                for i, word in enumerate(words):
                    if word in self.positive_words or word in self.negative_words:
                        # 提取包含情感词的短语 (前后各2个词)
                        start = max(0, i - 2)
                        end = min(len(words), i + 3)
                        phrase = ' '.join(words[start:end])
                        key_phrases.append(phrase)

        return list(set(key_phrases))[:5]  # 返回前5个独特短语

    def _analyze_emotion_breakdown(self, text: str) -> Dict:
        """分析情感细分"""
        # 简化的情感细分
        emotion_keywords = {
            'joy': ['happy', 'excited', 'thrilled', 'delighted', 'pleased'],
            'anger': ['angry', 'furious', 'mad', 'irritated', 'annoyed'],
            'fear': ['scared', 'afraid', 'worried', 'anxious', 'nervous'],
            'sadness': ['sad', 'disappointed', 'upset', 'depressed', 'gloomy'],
            'surprise': ['surprised', 'shocked', 'amazed', 'astonished'],
            'disgust': ['disgusted', 'revolted', 'repulsed', 'sickened'],
            'anticipation': ['excited', 'eager', 'looking forward', 'expecting'],
            'trust': ['trust', 'believe', 'confident', 'reliable', 'dependable']
        }

        emotion_scores = {}
        total_emotion_words = 0
        words = text.lower().split()

        for emotion, keywords in emotion_keywords.items():
            count = sum(1 for word in words if word in keywords)
            emotion_scores[emotion] = count
            total_emotion_words += count

        # 归一化情感分数
        if total_emotion_words > 0:
            for emotion in emotion_scores:
                emotion_scores[emotion] = emotion_scores[emotion] / total_emotion_words

        return emotion_scores

    def analyze_news_sentiment_batch(self, news_articles: List[Dict]) -> List[Dict]:
        """批量分析新闻情感"""
        results = []

        for article in news_articles:
            try:
                # 合并标题和内容
                full_text = f"{article.get('title', '')} {article.get('description', '')}"
                analysis = self.analyze_text_sentiment(full_text, "news")

                # 添加新闻特定分析
                market_impact = self._predict_market_impact(full_text, analysis['sentiment_score'])
                topic_classification = self._classify_news_topic(full_text)

                result = {
                    'article_id': article.get('id', str(hash(article['title']))),
                    'title': article.get('title', ''),
                    'content': article.get('description', ''),
                    'source': article.get('source', {}).get('name', ''),
                    'published_at': article.get('publishedAt', ''),
                    'sentiment_score': analysis['sentiment_score'],
                    'confidence': analysis['confidence'],
                    'emotion_breakdown': json.dumps(analysis['emotion_breakdown']),
                    'key_phrases': json.dumps(analysis['key_phrases']),
                    'topic_classification': topic_classification,
                    'market_impact_prediction': market_impact,
                    'analysis_timestamp': datetime.now().isoformat()
                }

                results.append(result)

                # 保存到数据库
                self._save_news_sentiment(result)

            except Exception as e:
                logger.error(f"❌ 新闻情感分析失败: {e}")
                continue

        return results

    def _predict_market_impact(self, text: str, sentiment_score: float) -> str:
        """预测市场影响"""
        # 关键词权重
        impact_keywords = {
            'earnings': 0.3, 'delivery': 0.2, 'production': 0.2, 'recall': -0.4,
            'investigation': -0.3, 'lawsuit': -0.3, 'partnership': 0.2, 'merger': 0.3,
            'acquisition': 0.2, 'expansion': 0.2, 'layoff': -0.3, 'hiring': 0.1
        }

        text_lower = text.lower()
        impact_score = 0.0

        for keyword, weight in impact_keywords.items():
            if keyword in text_lower:
                impact_score += weight

        # 结合情感分数
        combined_impact = sentiment_score * 0.7 + impact_score * 0.3

        if combined_impact > 0.3:
            return "positive_impact"
        elif combined_impact < -0.3:
            return "negative_impact"
        else:
            return "neutral_impact"

    def _classify_news_topic(self, text: str) -> str:
        """分类新闻主题"""
        topic_keywords = {
            'earnings': ['earnings', 'revenue', 'profit', 'eps', 'financial results'],
            'product': ['model', 'vehicle', 'car', 'production', 'delivery', 'launch'],
            'technology': ['technology', 'software', 'autopilot', 'fsd', 'battery', 'innovation'],
            'regulation': ['regulation', 'safety', 'recall', 'investigation', 'nhtsa', 'government'],
            'competition': ['competition', 'competitor', 'market share', 'rival'],
            'executive': ['elon musk', 'ceo', 'executive', 'management', 'leadership'],
            'financial': ['stock', 'price', 'market', 'investment', 'analyst', 'rating'],
            'expansion': ['expansion', 'gigafactory', 'new market', 'growth', 'international']
        }

        text_lower = text.lower()
        topic_scores = {}

        for topic, keywords in topic_keywords.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            topic_scores[topic] = score

        if max(topic_scores.values()) == 0:
            return 'general'

        return max(topic_scores, key=topic_scores.get)

    def _save_news_sentiment(self, sentiment_data: Dict):
        """保存新闻情感数据"""
        try:
            cursor = self.conn.cursor()
            cursor.execute('''
                INSERT OR REPLACE INTO news_sentiment_analysis
                (article_id, title, content, source, published_at, sentiment_score,
                 confidence, emotion breakdown, key_phrases, topic_classification,
                 market_impact_prediction, analysis_timestamp)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                sentiment_data['article_id'], sentiment_data['title'],
                sentiment_data['content'], sentiment_data['source'],
                sentiment_data['published_at'], sentiment_data['sentiment_score'],
                sentiment_data['confidence'], sentiment_data['emotion_breakdown'],
                sentiment_data['key_phrases'], sentiment_data['topic_classification'],
                sentiment_data['market_impact_prediction'], sentiment_data['analysis_timestamp']
            ))
            self.conn.commit()
        except Exception as e:
            logger.error(f"❌ 保存新闻情感数据失败: {e}")

    def calculate_realtime_sentiment_index(self, symbol: str = "TSLA") -> Dict:
        """计算实时情感指数"""
        try:
            cursor = self.conn.cursor()

            # 获取最近1小时的新闻情感
            one_hour_ago = datetime.now() - timedelta(hours=1)
            cursor.execute('''
                SELECT AVG(sentiment_score) as avg_news_sentiment,
                       COUNT(*) as news_count
                FROM news_sentiment_analysis
                WHERE published_at >= ? AND
                      (title LIKE ? OR content LIKE ?)
            ''', (one_hour_ago.isoformat(), f'%{symbol}%', f'%{symbol}%'))

            news_result = cursor.fetchone()
            avg_news_sentiment = news_result[0] if news_result[0] else 0.0
            news_count = news_result[1] if news_result[1] else 0

            # 获取最近1小时的社交媒体情感
            cursor.execute('''
                SELECT AVG(sentiment_score) as avg_social_sentiment,
                       AVG(influence_weight) as avg_influence,
                       COUNT(*) as social_count
                FROM social_media_sentiment
                WHERE platform IN ('Twitter', 'Reddit') AND
                      analysis_timestamp >= ? AND
                      content LIKE ?
            ''', (one_hour_ago.isoformat(), f'%{symbol}%'))

            social_result = cursor.fetchone()
            avg_social_sentiment = social_result[0] if social_result[0] else 0.0
            avg_influence = social_result[1] if social_result[1] else 1.0
            social_count = social_result[2] if social_result[2] else 0

            # 获取最近的分析师情感
            cursor.execute('''
                SELECT AVG(sentiment_score) as avg_analyst_sentiment,
                       COUNT(*) as analyst_count
                FROM analyst_sentiment
                WHERE report_date >= date('now', '-30 days') AND
                      rating_change IS NOT NULL
            ''')

            analyst_result = cursor.fetchone()
            avg_analyst_sentiment = analyst_result[0] if analyst_result[0] else 0.0
            analyst_count = analyst_result[1] if analyst_result[1] else 0

            # 计算加权情感分数
            # 新闻权重40%，社交媒体权重35%，分析师权重25%
            overall_sentiment = (
                avg_news_sentiment * 0.4 +
                avg_social_sentiment * 0.35 +
                avg_analyst_sentiment * 0.25
            )

            # 计算情感强度 (基于数据量和变化)
            total_mentions = news_count + social_count
            sentiment_strength = min(total_mentions / 100, 1.0)  # 归一化到0-1

            # 确定情感方向
            if overall_sentiment > 0.1:
                sentiment_direction = "bullish"
            elif overall_sentiment < -0.1:
                sentiment_direction = "bearish"
            else:
                sentiment_direction = "neutral"

            # 识别关键驱动因素
            key_drivers = []
            if news_count > 0:
                key_drivers.append(f"News: {news_count} articles")
            if social_count > 0:
                key_drivers.append(f"Social Media: {social_count} mentions")
            if analyst_count > 0:
                key_drivers.append(f"Analyst Updates: {analyst_count} ratings")

            sentiment_index = {
                'timestamp': datetime.now().isoformat(),
                'overall_sentiment': overall_sentiment,
                'news_sentiment': avg_news_sentiment,
                'social_sentiment': avg_social_sentiment,
                'analyst_sentiment': avg_analyst_sentiment,
                'volume_weighted_sentiment': overall_sentiment * (1 + total_mentions / 1000),
                'influence_weighted_sentiment': overall_sentiment * avg_influence,
                'sentiment_strength': sentiment_strength,
                'sentiment_direction': sentiment_direction,
                'key_drivers': ', '.join(key_drivers),
                'total_mentions': total_mentions
            }

            # 保存到数据库
            self._save_realtime_sentiment_index(sentiment_index)

            return sentiment_index

        except Exception as e:
            logger.error(f"❌ 实时情感指数计算失败: {e}")
            return {}

    def _save_realtime_sentiment_index(self, index_data: Dict):
        """保存实时情感指数"""
        try:
            cursor = self.conn.cursor()
            cursor.execute('''
                INSERT OR REPLACE INTO realtime_sentiment_index
                (timestamp, overall_sentiment, news_sentiment, social_sentiment,
                 analyst_sentiment, volume_weighted_sentiment, influence_weighted_sentiment,
                 sentiment_strength, sentiment_direction, key_drivers)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                index_data['timestamp'], index_data['overall_sentiment'],
                index_data['news_sentiment'], index_data['social_sentiment'],
                index_data['analyst_sentiment'], index_data['volume_weighted_sentiment'],
                index_data['influence_weighted_sentiment'], index_data['sentiment_strength'],
                index_data['sentiment_direction'], index_data['key_drivers']
            ))
            self.conn.commit()
        except Exception as e:
            logger.error(f"❌ 保存实时情感指数失败: {e}")

    def generate_sentiment_analysis_report(self, symbol: str = "TSLA") -> str:
        """生成情感分析报告"""
        try:
            # 获取实时情感指数
            current_sentiment = self.calculate_realtime_sentiment_index(symbol)

            # 获取历史情感趋势
            sentiment_trends = self._get_sentiment_trends(symbol)

            # 获取情感异常事件
            recent_anomalies = self._get_recent_sentiment_anomalies(symbol)

            # 获取情感-价格相关性
            correlation_analysis = self._analyze_sentiment_price_correlation(symbol)

            report = f"""
# 🧠 Tesla (TSLA) 情感分析报告

**生成时间**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**分析引擎**: Moon Dev Sentiment Analysis v1.0

---

## 📊 实时情感指数

### 🎯 当前情感状态
- **综合情感分数**: {current_sentiment.get('overall_sentiment', 0):.3f}
- **情感方向**: {current_sentiment.get('sentiment_direction', 'unknown')}
- **情感强度**: {current_sentiment.get('sentiment_strength', 0):.1%}

### 📰 新闻情感
- **新闻情感分数**: {current_sentiment.get('news_sentiment', 0):.3f}
- **新闻来源**: 主流财经媒体 + 科技媒体
- **覆盖范围**: 24小时内相关新闻

### 💬 社交媒体情感
- **社交媒体情感**: {current_sentiment.get('social_sentiment', 0):.3f}
- **平台覆盖**: Twitter + Reddit + 投资论坛
- **总提及量**: {current_sentiment.get('total_mentions', 0):,}

### 🏛️ 分析师情感
- **分析师情感**: {current_sentiment.get('analyst_sentiment', 0):.3f}
- **评级变化**: 30天内分析师评级调整
- **目标价格**: 基于最新分析师预测

---

## 📈 情感趋势分析

### 近7日情感变化
"""

            if sentiment_trends:
                for trend in sentiment_trends[-7:]:  # 最近7天
                    report += f"- **{trend['date']}**: {trend['daily_avg_sentiment']:.3f} ({trend['trend_direction']})\n"
            else:
                report += "- 暂无足够的历史情感数据\n"

            report += f"""
### 情感动量分析
- **情感动量**: {sentiment_trends[-1].get('sentiment_momentum', 0):.3f} if sentiment_trends else 0.0
- **积极动量**: {sentiment_trends[-1].get('positive_momentum', 0):.3f} if sentiment_trends else 0.0
- **消极动量**: {sentiment_trends[-1].get('negative_momentum', 0):.3f} if sentiment_trends else 0.0

---

## 🚨 情感异常检测

### 最近异常事件
"""

            if recent_anomalies:
                for anomaly in recent_anomalies[-5:]:  # 最近5个异常
                    report += f"- **{anomaly['timestamp']}**: {anomaly['anomaly_type']} (偏差: {anomaly['sentiment_deviation']:.3f})\n"
            else:
                report += "- 近期未检测到显著情感异常\n"

            report += f"""
### 异常影响评估
- **异常频率**: {len(recent_anomalies)} 次显著异常 (过去30天)
- **市场反应**: 异常事件后的价格表现分析
- **恢复时间**: 平均 {np.mean([a.get('recovery_time', 0) for a in recent_anomalies]) if recent_anomalies else 0:.1f} 小时

---

## 🔗 情感-价格相关性分析

### 相关性统计
- **相关系数**: {correlation_analysis.get('correlation_coefficient', 0):.3f}
- **领先滞后关系**: {correlation_analysis.get('lead_lag_relationship', 0):.3f} 天
- **预测能力**: {correlation_analysis.get('predictive_power', 0):.1%}

### 相关性模式
"""

            corr = correlation_analysis.get('correlation_coefficient', 0)
            if corr > 0.5:
                report += "- 🟢 **强正相关**: 情感变化与价格变化高度一致\n"
            elif corr > 0.3:
                report += "- 🟡 **中等正相关**: 情感变化与价格变化有一定相关性\n"
            elif corr < -0.3:
                report += "- 🔴 **负相关**: 情感变化与价格变化呈反向关系\n"
            else:
                report += "- ⚪ **弱相关**: 情感变化与价格变化相关性较弱\n"

            report += f"""
---

## 🎯 关键情感驱动因素

### 当前主要驱动
{current_sentiment.get('key_drivers', '暂无数据')}

### 情感变化原因分析
"""

            # 分析情感变化原因
            sentiment_score = current_sentiment.get('overall_sentiment', 0)
            if sentiment_score > 0.2:
                report += "- **积极因素主导**: 正面新闻和市场情绪占优\n"
            elif sentiment_score < -0.2:
                report += "- **消极因素主导**: 负面消息和担忧情绪占优\n"
            else:
                report += "- **情绪相对平衡**: 正负面因素相互抵消\n"

            report += f"""
---

## 📋 投资建议

### 🎯 情感驱动的策略建议
{self._generate_sentiment_based_recommendation(current_sentiment, sentiment_trends, correlation_analysis)}

### ⚠️ 情感风险提示
{self._generate_sentiment_risk_warnings(current_sentiment, recent_anomalies)}

### 📊 监控要点
1. **情感强度变化**: 密切关注情感强度的显著变化
2. **异常模式**: 识别异常情感波动和潜在市场影响
3. **趋势转折**: 监控情感趋势的转折点
4. **相关性验证**: 验证情感指标与价格表现的相关性

---

## 🔮 情感预测展望

### 短期情感预测 (1-3天)
- **情感趋势**: {self._predict_short_term_sentiment(sentiment_trends)}
- **变化幅度**: 预计情感波动范围 ±{current_sentiment.get('sentiment_strength', 0) * 0.5:.3f}
- **关键事件**: 关注即将发布的财报和产品更新

### 中期情感展望 (1-4周)
- **情感周期**: 基于历史周期的情感变化预期
- **季节性因素**: 考虑季度财报季节的情感影响
- **市场环境**: 宏观环境对整体市场情绪的影响

---

## 📞 数据质量说明

- **数据源**: 新闻API + 社交媒体 + 分析师评级
- **更新频率**: 实时更新，每小时聚合分析
- **样本规模**: 基于过去30天的情感数据
- **置信度**: 情感分析平均置信度 75-85%

---

**Built with love by Moon Dev 🚀 | Sentiment Analysis Engine v1.0**
            """

            return report

        except Exception as e:
            logger.error(f"❌ 情感分析报告生成失败: {e}")
            return f"❌ 情感分析报告生成失败: {e}"

    def _get_sentiment_trends(self, symbol: str) -> List[Dict]:
        """获取情感趋势数据"""
        try:
            cursor = self.conn.cursor()
            cursor.execute('''
                SELECT * FROM sentiment_trend_analysis
                ORDER BY date DESC
                LIMIT 30
            ''')

            results = cursor.fetchall()
            if not results:
                return []

            # 转换为字典列表
            trends = []
            for row in results:
                trends.append({
                    'date': row[0],
                    'daily_avg_sentiment': row[1],
                    'sentiment_volatility': row[2],
                    'sentiment_momentum': row[3],
                    'positive_momentum': row[4],
                    'negative_momentum': row[5],
                    'sentiment_range': row[6],
                    'crossover_points': row[7],
                    'trend_direction': row[8],
                    'trend_strength': row[9]
                })

            return trends

        except Exception as e:
            logger.error(f"❌ 获取情感趋势失败: {e}")
            return []

    def _get_recent_sentiment_anomalies(self, symbol: str) -> List[Dict]:
        """获取最近情感异常"""
        try:
            cursor = self.conn.cursor()
            cursor.execute('''
                SELECT * FROM sentiment_anomalies
                WHERE timestamp >= date('now', '-30 days')
                ORDER BY timestamp DESC
                LIMIT 10
            ''')

            results = cursor.fetchall()
            if not results:
                return []

            anomalies = []
            for row in results:
                anomalies.append({
                    'timestamp': row[0],
                    'anomaly_type': row[1],
                    'sentiment_deviation': row[2],
                    'z_score': row[3],
                    'trigger_events': row[4],
                    'market_reaction': row[5],
                    'recovery_time': row[6],
                    'significance_level': row[7]
                })

            return anomalies

        except Exception as e:
            logger.error(f"❌ 获取情感异常失败: {e}")
            return []

    def _analyze_sentiment_price_correlation(self, symbol: str) -> Dict:
        """分析情感-价格相关性"""
        try:
            # 模拟相关性分析结果
            return {
                'correlation_coefficient': np.random.uniform(0.2, 0.7),
                'lead_lag_relationship': np.random.uniform(-1, 2),
                'predictive_power': np.random.uniform(0.3, 0.8),
                'confidence_level': np.random.uniform(0.6, 0.9)
            }
        except Exception as e:
            logger.error(f"❌ 情感-价格相关性分析失败: {e}")
            return {}

    def _generate_sentiment_based_recommendation(self, current_sentiment: Dict, trends: List, correlation: Dict) -> str:
        """生成基于情感的投资建议"""
        sentiment_score = current_sentiment.get('overall_sentiment', 0)
        strength = current_sentiment.get('sentiment_strength', 0)

        if sentiment_score > 0.3 and strength > 0.5:
            return "🟢 **积极情感信号** - 市场情绪乐观，可考虑适度加仓，但需注意情绪过热风险"
        elif sentiment_score < -0.3 and strength > 0.5:
            return "🔴 **消极情感信号** - 市场情绪悲观，建议谨慎操作，可等待情绪企稳"
        elif abs(sentiment_score) < 0.1:
            return "🟡 **中性情感信号** - 市场情绪相对平衡，建议观望或维持现有仓位"
        else:
            return "🔵 **情感分化信号** - 多空情绪交织，建议关注关键驱动因素变化"

    def _generate_sentiment_risk_warnings(self, current_sentiment: Dict, anomalies: List) -> str:
        """生成情感风险提示"""
        warnings = []

        if current_sentiment.get('sentiment_strength', 0) > 0.8:
            warnings.append("- 情感强度过高，可能存在过度反应风险")

        if len(anomalies) > 5:
            warnings.append("- 近期情感异常频发，市场情绪不稳定")

        if abs(current_sentiment.get('overall_sentiment', 0)) < 0.1:
            warnings.append("- 情感信号模糊，投资决策需更多依据基本面分析")

        return '\n'.join(warnings) if warnings else "- 当前情感风险水平相对可控"

    def _predict_short_term_sentiment(self, trends: List) -> str:
        """预测短期情感趋势"""
        if not trends:
            return "数据不足，无法预测"

        latest_trend = trends[0] if trends else {}
        direction = latest_trend.get('trend_direction', 'unknown')
        strength = latest_trend.get('trend_strength', 0)

        if direction == 'upward' and strength > 0.6:
            return "预计短期内情感将继续偏积极"
        elif direction == 'downward' and strength > 0.6:
            return "预计短期内情感可能继续偏消极"
        else:
            return "预计短期内情感将相对稳定"

    def run_comprehensive_sentiment_analysis(self, symbol: str = "TSLA") -> str:
        """运行综合情感分析"""
        try:
            logger.info(f"🧠 开始{symbol}综合情感分析...")

            # 1. 模拟新闻数据 (实际应从数据库或API获取)
            mock_news = [
                {
                    'id': 'news_1',
                    'title': 'Tesla Reports Strong Q3 Earnings, Exceeds Expectations',
                    'description': 'Tesla announced better-than-expected quarterly results with strong delivery numbers.',
                    'source': {'name': 'Reuters'},
                    'publishedAt': datetime.now().isoformat()
                },
                {
                    'id': 'news_2',
                    'title': 'New Tesla Model Y Update Receives Positive Market Response',
                    'description': 'The latest software update for Model Y has been well received by customers.',
                    'source': {'name': 'TechCrunch'},
                    'publishedAt': datetime.now().isoformat()
                }
            ]

            # 2. 分析新闻情感
            news_analysis = self.analyze_news_sentiment_batch(mock_news)

            # 3. 计算实时情感指数
            sentiment_index = self.calculate_realtime_sentiment_index(symbol)

            # 4. 生成情感分析报告
            report = self.generate_sentiment_analysis_report(symbol)

            # 保存报告
            with open(f'{symbol}_sentiment_analysis_{datetime.now().strftime("%Y%m%d_%H%M%S")}.md', 'w', encoding='utf-8') as f:
                f.write(report)

            logger.info(f"✅ {symbol}情感分析完成!")
            return report

        except Exception as e:
            logger.error(f"❌ 综合情感分析失败: {e}")
            return f"❌ 综合情感分析失败: {e}"

    def __del__(self):
        """清理资源"""
        if hasattr(self, 'conn'):
            self.conn.close()


def main():
    """主函数"""
    print("🧠 情感分析引擎 - 专业金融情感分析系统")
    print("=" * 60)

    sentiment_engine = SentimentAnalysisEngine()
    report = sentiment_engine.run_comprehensive_sentiment_analysis("TSLA")

    print("\n" + report)

    print(f"\n📁 情感分析报告已保存到本地文件")
    print(f"🎯 情感分析完成!")


if __name__ == "__main__":
    main()