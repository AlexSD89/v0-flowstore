"""
用户互动优化算法
专门针对小红书平台的用户互动行为进行深度优化
"""

import asyncio
import json
import logging
import numpy as np
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta
import re

from ..utils.base import BaseAIModel
from ..utils.config import Config

@dataclass
class EngagementMetrics:
    """互动数据结构"""
    likes_count: int = 0
    comments_count: int = 0
    shares_count: int = 0
    saves_count: int = 0
    follows_count: int = 0
    click_rate: float = 0.0
    dwell_time: float = 0.0
    engagement_rate: float = 0.0

    def calculate_total_engagement(self) -> int:
        """计算总互动数"""
        return self.likes_count + self.comments_count + self.shares_count + self.saves_count

    def calculate_engagement_rate(self, impressions: int) -> float:
        """计算互动率"""
        total_engagement = self.calculate_total_engagement()
        return (total_engagement / impressions * 100) if impressions > 0 else 0.0

@dataclass
class ContentOptimization:
    """内容优化建议"""
    title_optimization: Dict[str, Any]
    content_optimization: Dict[str, Any]
    hashtag_optimization: Dict[str, Any]
    posting_time_optimization: Dict[str, Any]
    call_to_action_optimization: Dict[str, Any]
    expected_improvement: Dict[str, float]

class EngagementOptimizer(BaseAIModel):
    """用户互动优化器"""

    def __init__(self, config: Optional[Config] = None):
        super().__init__("engagement_optimizer_v3.0", config)

        # 核心配置
        self.engagement_boost_target = self.config.get("engagement_boost_target", 200)  # 200%提升目标
        self.optimization_accuracy_target = self.config.get("optimization_accuracy_target", 0.90)

        # 互动权重配置
        self.engagement_weights = {
            "likes": 0.15,      # 点赞权重
            "comments": 0.35,   # 评论权重（最重要）
            "shares": 0.25,     # 分享权重
            "saves": 0.20,      # 收藏权重
            "follows": 0.05     # 关注权重
        }

        # 优化因子权重
        self.optimization_factors = {
            "title_catchiness": 0.25,        # 标题吸引力
            "content_value": 0.20,          # 内容价值
            "emotional_impact": 0.20,       # 情感冲击力
            "visual_appeal": 0.15,          # 视觉效果
            "hashtag_relevance": 0.10,      # 话题相关性
            "posting_timing": 0.10          # 发布时机
        }

        # 小红书平台特定优化模式
        self.xiaohongshu_patterns = self._load_xiaohongshu_patterns()

        # 优化历史记录
        self.optimization_history: List[Dict[str, Any]] = []

        self.logger.info("EngagementOptimizer initialized with engagement boost target: {}%".format(
            self.engagement_boost_target))

    def _load_xiaohongshu_patterns(self) -> Dict[str, Any]:
        """加载小红书平台优化模式"""
        return {
            "high_engagement_titles": [
                # 高互动标题模式
                r".*?绝了.*?",       # "绝了"系列
                r".*?真的.*?",       # "真的"系列
                r".*?必看.*?",       # "必看"系列
                r".*?收藏.*?",       # "收藏"系列
                r".*?干货.*?",       # "干货"系列
                r".*?攻略.*?",       # "攻略"系列
                r".*?测评.*?",       # "测评"系列
                r".*?\d+种.*?",      # 数字种草
                r".*?\d+个.*?",      # 数字清单
                r".*?新手.*?"        # 新手友好
            ],
            "popular_hashtags": [
                # 热门话题标签
                "种草", "好物推荐", "干货分享", "新手必看",
                "生活小技巧", "美妆护肤", "穿搭日记", "美食探店",
                "学习打卡", "职场经验", "旅行攻略", "家居好物"
            ],
            "optimal_posting_times": [
                # 最佳发布时间段（小红书用户活跃时间）
                {"day": "weekday", "start": "07:00", "end": "09:00", "score": 0.8},
                {"day": "weekday", "start": "12:00", "end": "14:00", "score": 0.9},
                {"day": "weekday", "start": "18:00", "end": "22:00", "score": 1.0},
                {"day": "weekend", "start": "09:00", "end": "12:00", "score": 0.9},
                {"day": "weekend", "start": "14:00", "end": "18:00", "score": 0.8},
                {"day": "weekend", "start": "19:00", "end": "23:00", "score": 1.0}
            ],
            "content_formats": [
                # 高互动内容格式
                {"type": "图文", "engagement_multiplier": 1.0},
                {"type": "视频", "engagement_multiplier": 1.3},
                {"type": "直播", "engagement_multiplier": 2.1},
                {"type": "图文+视频", "engagement_multiplier": 1.5}
            ]
        }

    async def analyze_engagement_metrics(self, content_data: Dict[str, Any]) -> EngagementMetrics:
        """分析内容互动数据"""
        try:
            # 提取互动数据
            metrics = EngagementMetrics(
                likes_count=content_data.get("likes_count", 0),
                comments_count=content_data.get("comments_count", 0),
                shares_count=content_data.get("shares_count", 0),
                saves_count=content_data.get("saves_count", 0),
                follows_count=content_data.get("follows_count", 0),
                click_rate=content_data.get("click_rate", 0.0),
                dwell_time=content_data.get("dwell_time", 0.0)
            )

            # 计算互动率
            impressions = content_data.get("impressions", 0)
            metrics.engagement_rate = metrics.calculate_engagement_rate(impressions)

            # 计算加权互动分数
            weighted_score = (
                metrics.likes_count * self.engagement_weights["likes"] +
                metrics.comments_count * self.engagement_weights["comments"] +
                metrics.shares_count * self.engagement_weights["shares"] +
                metrics.saves_count * self.engagement_weights["saves"] +
                metrics.follows_count * self.engagement_weights["follows"]
            )

            # 存储分析结果
            analysis_result = {
                "content_id": content_data.get("content_id"),
                "metrics": asdict(metrics),
                "weighted_score": weighted_score,
                "analysis_time": datetime.now().isoformat(),
                "benchmark_percentile": await self._calculate_benchmark_percentile(weighted_score)
            }

            self.optimization_history.append(analysis_result)

            self.logger.info("Engagement analysis completed for content: {}, weighted_score: {:.2f}".format(
                content_data.get("content_id"), weighted_score))

            return metrics

        except Exception as e:
            self.logger.error("Error analyzing engagement metrics: {}".format(str(e)))
            raise

    async def optimize_content_for_engagement(self, content_data: Dict[str, Any],
                                           target_metrics: Optional[Dict[str, float]] = None) -> ContentOptimization:
        """优化内容以提升互动"""
        try:
            # 分析当前内容
            current_metrics = await self.analyze_engagement_metrics(content_data)

            # 设定优化目标
            if target_metrics is None:
                target_metrics = {
                    "engagement_rate_boost": self.engagement_boost_target / 100,  # 200%提升
                    "comments_increase": 150,  # 评论数目标
                    "shares_increase": 100,    # 分享数目标
                    "saves_increase": 120      # 收藏数目标
                }

            # 分析当前内容特征
            content_analysis = await self._analyze_content_features(content_data)

            # 生成优化建议
            optimization = ContentOptimization(
                title_optimization=await self._optimize_title(content_data, content_analysis, target_metrics),
                content_optimization=await self._optimize_content_body(content_data, content_analysis, target_metrics),
                hashtag_optimization=await self._optimize_hashtags(content_data, content_analysis, target_metrics),
                posting_time_optimization=await self._optimize_posting_time(content_data, content_analysis, target_metrics),
                call_to_action_optimization=await self._optimize_call_to_action(content_data, content_analysis, target_metrics),
                expected_improvement=await self._predict_improvement(content_analysis, target_metrics)
            )

            # 计算优化置信度
            optimization_confidence = await self._calculate_optimization_confidence(
                content_analysis, optimization, target_metrics)

            # 存储优化记录
            optimization_record = {
                "content_id": content_data.get("content_id"),
                "current_metrics": asdict(current_metrics),
                "target_metrics": target_metrics,
                "optimization": asdict(optimization),
                "confidence_score": optimization_confidence,
                "optimization_time": datetime.now().isoformat()
            }

            self.optimization_history.append(optimization_record)

            self.logger.info("Content optimization completed for content: {}, confidence: {:.2f}%".format(
                content_data.get("content_id"), optimization_confidence * 100))

            return optimization

        except Exception as e:
            self.logger.error("Error optimizing content: {}".format(str(e)))
            raise

    async def _analyze_content_features(self, content_data: Dict[str, Any]) -> Dict[str, Any]:
        """分析内容特征"""
        features = {
            "title_features": await self._analyze_title_features(content_data.get("title", "")),
            "content_features": await self._analyze_content_body_features(content_data.get("content", "")),
            "hashtag_features": await self._analyze_hashtag_features(content_data.get("hashtags", [])),
            "format_features": await self._analyze_format_features(content_data),
            "timing_features": await self._analyze_timing_features(content_data.get("publish_time"))
        }

        # 计算综合质量分数
        quality_score = await self._calculate_content_quality_score(features)
        features["overall_quality_score"] = quality_score

        return features

    async def _optimize_title(self, content_data: Dict[str, Any], content_analysis: Dict[str, Any],
                            target_metrics: Dict[str, float]) -> Dict[str, Any]:
        """优化标题"""
        current_title = content_data.get("title", "")
        title_features = content_analysis["title_features"]

        # 生成优化策略
        optimization_strategies = []

        # 标题长度优化
        if len(current_title) < 10:
            optimization_strategies.append({
                "type": "length_extension",
                "suggestion": "增加标题长度，添加更多吸引人的描述",
                "examples": ["绝了！", "真的太好用了", "新手必看"]
            })
        elif len(current_title) > 50:
            optimization_strategies.append({
                "type": "length_reduction",
                "suggestion": "精简标题，突出核心卖点",
                "examples": ["精简至20-30字，突出重点"]
            })

        # 添加吸引词
        attractive_patterns = self.xiaohongshu_patterns["high_engagement_titles"]
        if not any(re.match(pattern, current_title) for pattern in attractive_patterns):
            optimization_strategies.append({
                "type": "add_attractive_words",
                "suggestion": "添加高互动吸引词",
                "examples": ["绝了", "真的", "必看", "收藏", "干货"]
            })

        # 数字化优化
        if not re.search(r'\d+', current_title):
            optimization_strategies.append({
                "type": "add_numbers",
                "suggestion": "添加具体数字增强可信度",
                "examples": ["5个技巧", "3种方法", "100%有效"]
            })

        # 情感词汇优化
        emotional_words = ["惊喜", "治愈", "温暖", "感动", "震撼", "惊艳"]
        if not any(word in current_title for word in emotional_words):
            optimization_strategies.append({
                "type": "add_emotional_words",
                "suggestion": "添加情感词汇增强共鸣",
                "examples": emotional_words
            })

        # 生成优化标题建议
        optimized_titles = await self._generate_optimized_titles(current_title, optimization_strategies)

        return {
            "current_title": current_title,
            "optimization_strategies": optimization_strategies,
            "optimized_suggestions": optimized_titles,
            "expected_improvement": await self._estimate_title_improvement(optimization_strategies)
        }

    async def _optimize_content_body(self, content_data: Dict[str, Any], content_analysis: Dict[str, Any],
                                   target_metrics: Dict[str, float]) -> Dict[str, Any]:
        """优化正文内容"""
        current_content = content_data.get("content", "")
        content_features = content_analysis["content_features"]

        optimization_strategies = []

        # 内容结构优化
        if content_features["paragraph_count"] < 3:
            optimization_strategies.append({
                "type": "structure_improvement",
                "suggestion": "分段展示，提高可读性",
                "action": "将内容分成3-5个段落"
            })

        # 互动引导优化
        if content_features["call_to_action_count"] == 0:
            optimization_strategies.append({
                "type": "add_call_to_action",
                "suggestion": "添加互动引导语",
                "examples": [
                    "你们觉得怎么样？评论区告诉我～",
                    "还有什么想了解的？评论区聊聊天～",
                    "收藏起来慢慢看，感谢支持～"
                ]
            })

        # 价值密度优化
        if content_features["value_density"] < 0.7:
            optimization_strategies.append({
                "type": "increase_value_density",
                "suggestion": "增加实用信息密度",
                "action": "添加更多具体细节、数据、案例"
            })

        # 情感共鸣优化
        if content_features["emotional_impact"] < 0.6:
            optimization_strategies.append({
                "type": "enhance_emotional_impact",
                "suggestion": "增强情感共鸣",
                "examples": [
                    "添加个人体验和感受",
                    "分享真实的心路历程",
                    "表达对读者的关心和期待"
                ]
            })

        return {
            "current_content_analysis": content_features,
            "optimization_strategies": optimization_strategies,
            "expected_improvement": await self._estimate_content_improvement(optimization_strategies)
        }

    async def _optimize_hashtags(self, content_data: Dict[str, Any], content_analysis: Dict[str, Any],
                                target_metrics: Dict[str, float]) -> Dict[str, Any]:
        """优化话题标签"""
        current_hashtags = content_data.get("hashtags", [])
        hashtag_features = content_analysis["hashtag_features"]

        optimization_strategies = []

        # 标签数量优化
        if len(current_hashtags) < 3:
            optimization_strategies.append({
                "type": "increase_hashtag_count",
                "suggestion": "增加相关话题标签",
                "target_count": "5-8个标签",
                "recommended_tags": self.xiaohongshu_patterns["popular_hashtags"][:3]
            })
        elif len(current_hashtags) > 10:
            optimization_strategies.append({
                "type": "optimize_hashtag_count",
                "suggestion": "精简标签数量，突出重点",
                "target_count": "5-8个最相关标签"
            })

        # 标签相关性优化
        popular_tags = self.xiaohongshu_patterns["popular_hashtags"]
        missing_popular_tags = [tag for tag in popular_tags if tag not in current_hashtags]

        if missing_popular_tags:
            optimization_strategies.append({
                "type": "add_trending_hashtags",
                "suggestion": "添加热门相关标签",
                "recommended_tags": missing_popular_tags[:3]
            })

        return {
            "current_hashtags": current_hashtags,
            "hashtag_analysis": hashtag_features,
            "optimization_strategies": optimization_strategies,
            "recommended_hashtag_set": await self._generate_optimal_hashtag_set(
                current_hashtags, optimization_strategies)
        }

    async def _optimize_posting_time(self, content_data: Dict[str, Any], content_analysis: Dict[str, Any],
                                   target_metrics: Dict[str, float]) -> Dict[str, Any]:
        """优化发布时间"""
        current_time = content_data.get("publish_time")
        timing_features = content_analysis["timing_features"]

        # 获取最佳发布时间
        optimal_times = self.xiaohongshu_patterns["optimal_posting_times"]
        day_of_week = datetime.now().strftime("%A").lower()

        best_times_today = [
            time for time in optimal_times
            if time["day"] == ("weekend" if day_of_week in ["saturday", "sunday"] else "weekday")
        ]

        # 按评分排序
        best_times_today.sort(key=lambda x: x["score"], reverse=True)

        optimization_suggestions = []

        if current_time:
            # 分析当前发布时间的优劣
            current_score = await self._calculate_timing_score(current_time, optimal_times)

            if current_score < 0.8:
                optimization_suggestions.append({
                    "type": "change_posting_time",
                    "current_score": current_score,
                    "suggestion": "调整到更高活跃时段发布",
                    "recommended_times": best_times_today[:2]
                })
        else:
            optimization_suggestions.append({
                "type": "set_optimal_time",
                "suggestion": "设定最佳发布时间",
                "recommended_times": best_times_today[:3]
            })

        return {
            "current_time": current_time,
            "timing_analysis": timing_features,
            "optimization_suggestions": optimization_suggestions,
            "optimal_time_slots": best_times_today
        }

    async def _optimize_call_to_action(self, content_data: Dict[str, Any], content_analysis: Dict[str, Any],
                                     target_metrics: Dict[str, float]) -> Dict[str, Any]:
        """优化行动召唤"""
        current_content = content_data.get("content", "")

        # 分析现有的CTA
        cta_patterns = [
            r".*?评论区.*?",
            r".*?告诉我.*?",
            r".*?收藏.*?",
            r".*?关注.*?",
            r".*?点赞.*?"
        ]

        existing_ctas = []
        for pattern in cta_patterns:
            matches = re.findall(pattern, current_content, re.IGNORECASE)
            existing_ctas.extend(matches)

        optimization_strategies = []

        if len(existing_ctas) == 0:
            optimization_strategies.append({
                "type": "add_cta",
                "suggestion": "添加互动引导语",
                "examples": [
                    "你们觉得怎么样？评论区聊聊～",
                    "还有什么想了解的？告诉我吧～",
                    "收藏起来，感谢支持❤️"
                ]
            })
        elif len(existing_ctas) > 3:
            optimization_strategies.append({
                "type": "optimize_cta_count",
                "suggestion": "精简CTA数量，提高转化率",
                "action": "保留1-2个最有效的CTA"
            })

        # CTA位置优化
        optimization_strategies.append({
            "type": "optimize_cta_position",
            "suggestion": "将CTA放在内容结尾处",
            "reasoning": "结尾处的CTA转化率更高"
        })

        return {
            "existing_ctas": existing_ctas,
            "cta_count": len(existing_ctas),
            "optimization_strategies": optimization_strategies,
            "recommended_ctas": await self._generate_effective_ctas(content_data.get("content_type", "general"))
        }

    async def _predict_improvement(self, content_analysis: Dict[str, Any],
                                 target_metrics: Dict[str, float]) -> Dict[str, float]:
        """预测优化效果"""
        base_improvements = {
            "engagement_rate_increase": 0.0,
            "likes_increase": 0.0,
            "comments_increase": 0.0,
            "shares_increase": 0.0,
            "saves_increase": 0.0
        }

        # 基于内容质量分数计算改进幅度
        quality_score = content_analysis.get("overall_quality_score", 0.5)

        if quality_score < 0.3:
            # 低质量内容，改进空间大
            base_improvements["engagement_rate_increase"] = 2.5  # 250%
            base_improvements["comments_increase"] = 3.0
            base_improvements["shares_increase"] = 2.0
            base_improvements["saves_increase"] = 2.8
        elif quality_score < 0.6:
            # 中等质量内容
            base_improvements["engagement_rate_increase"] = 1.8  # 180%
            base_improvements["comments_increase"] = 2.2
            base_improvements["shares_increase"] = 1.6
            base_improvements["saves_increase"] = 2.0
        else:
            # 高质量内容，改进空间相对较小
            base_improvements["engagement_rate_increase"] = 1.3  # 130%
            base_improvements["comments_increase"] = 1.5
            base_improvements["shares_increase"] = 1.2
            base_improvements["saves_increase"] = 1.4

        # 应用优化因子调整
        for factor, weight in self.optimization_factors.items():
            if factor in content_analysis:
                factor_score = content_analysis[factor].get("score", 0.5)
                if factor_score < 0.7:
                    # 该因子有改进空间，增加预期改进
                    improvement_boost = (0.7 - factor_score) * weight
                    for key in base_improvements:
                        base_improvements[key] += improvement_boost

        return base_improvements

    async def _calculate_optimization_confidence(self, content_analysis: Dict[str, Any],
                                               optimization: ContentOptimization,
                                               target_metrics: Dict[str, float]) -> float:
        """计算优化置信度"""
        confidence_factors = []

        # 基于历史优化成功率
        recent_optimizations = [opt for opt in self.optimization_history[-20:]
                              if "confidence_score" in opt]
        if recent_optimizations:
            avg_success_rate = sum(opt["confidence_score"] for opt in recent_optimizations) / len(recent_optimizations)
            confidence_factors.append(avg_success_rate)

        # 基于内容质量
        quality_score = content_analysis.get("overall_quality_score", 0.5)
        quality_confidence = 0.6 + (quality_score * 0.4)  # 质量越高，置信度越高
        confidence_factors.append(quality_confidence)

        # 基于优化策略数量
        total_strategies = (
            len(optimization.title_optimization.get("optimization_strategies", [])) +
            len(optimization.content_optimization.get("optimization_strategies", [])) +
            len(optimization.hashtag_optimization.get("optimization_strategies", [])) +
            len(optimization.posting_time_optimization.get("optimization_suggestions", [])) +
            len(optimization.call_to_action_optimization.get("optimization_strategies", []))
        )

        strategy_confidence = min(1.0, 0.4 + (total_strategies * 0.1))
        confidence_factors.append(strategy_confidence)

        # 计算综合置信度
        overall_confidence = sum(confidence_factors) / len(confidence_factors)

        return min(1.0, overall_confidence)

    async def generate_engagement_report(self, content_data: Dict[str, Any]) -> Dict[str, Any]:
        """生成互动优化报告"""
        try:
            # 分析当前互动数据
            metrics = await self.analyze_engagement_metrics(content_data)

            # 生成优化建议
            optimization = await self.optimize_content_for_engagement(content_data)

            # 创建综合报告
            report = {
                "content_info": {
                    "content_id": content_data.get("content_id"),
                    "title": content_data.get("title"),
                    "content_type": content_data.get("content_type"),
                    "analysis_time": datetime.now().isoformat()
                },
                "current_performance": {
                    "metrics": asdict(metrics),
                    "benchmark_percentile": await self._calculate_benchmark_percentile(
                        metrics.calculate_total_engagement()),
                    "strengths": await self._identify_content_strengths(content_data),
                    "weaknesses": await self._identify_content_weaknesses(content_data)
                },
                "optimization_recommendations": {
                    "title": optimization.title_optimization,
                    "content": optimization.content_optimization,
                    "hashtags": optimization.hashtag_optimization,
                    "posting_time": optimization.posting_time_optimization,
                    "call_to_action": optimization.call_to_action_optimization
                },
                "expected_improvements": optimization.expected_improvement,
                "implementation_priority": await self._prioritize_optimizations(optimization),
                "success_metrics": {
                    "target_engagement_rate": metrics.engagement_rate * (1 + optimization.expected_improvement["engagement_rate_increase"]),
                    "target_total_engagement": metrics.calculate_total_engagement() * (1 + optimization.expected_improvement["engagement_rate_increase"]),
                    "confidence_level": await self._calculate_optimization_confidence(
                        await self._analyze_content_features(content_data), optimization, {})
                }
            }

            self.logger.info("Engagement optimization report generated for content: {}".format(
                content_data.get("content_id")))

            return report

        except Exception as e:
            self.logger.error("Error generating engagement report: {}".format(str(e)))
            raise

    # 辅助方法实现
    async def _calculate_benchmark_percentile(self, engagement_score: float) -> float:
        """计算基准百分位"""
        # 简化实现，实际应基于历史数据
        return min(95.0, engagement_score / 100 * 100)

    async def _analyze_title_features(self, title: str) -> Dict[str, Any]:
        """���析标题特征"""
        return {
            "length": len(title),
            "word_count": len(title.split()),
            "has_numbers": bool(re.search(r'\d+', title)),
            "has_emotional_words": any(word in title for word in ["绝了", "真的", "必看"]),
            "catchiness_score": min(1.0, len(title) / 30 + (0.3 if re.search(r'\d+', title) else 0))
        }

    async def _analyze_content_body_features(self, content: str) -> Dict[str, Any]:
        """分析正文特征"""
        paragraphs = [p.strip() for p in content.split('\n') if p.strip()]

        return {
            "length": len(content),
            "paragraph_count": len(paragraphs),
            "avg_paragraph_length": sum(len(p) for p in paragraphs) / len(paragraphs) if paragraphs else 0,
            "call_to_action_count": len(re.findall(r'评论区|告诉我|收藏', content)),
            "value_density": min(1.0, len(content) / 1000),
            "emotional_impact": min(1.0, content.count('❤️') * 0.1 + content.count('😊') * 0.05)
        }

    async def _analyze_hashtag_features(self, hashtags: List[str]) -> Dict[str, Any]:
        """分析标签特征"""
        popular_tags = self.xiaohongshu_patterns["popular_hashtags"]

        return {
            "count": len(hashtags),
            "popular_count": sum(1 for tag in hashtags if tag in popular_tags),
            "avg_length": sum(len(tag) for tag in hashtags) / len(hashtags) if hashtags else 0,
            "relevance_score": min(1.0, sum(1 for tag in hashtags if tag in popular_tags) / max(5, len(hashtags)))
        }

    async def _analyze_format_features(self, content_data: Dict[str, Any]) -> Dict[str, Any]:
        """分析格式特征"""
        content_format = content_data.get("content_type", "图文")
        format_info = next((f for f in self.xiaohongshu_patterns["content_formats"]
                          if f["type"] == content_format), {"engagement_multiplier": 1.0})

        return {
            "format_type": content_format,
            "engagement_multiplier": format_info["engagement_multiplier"],
            "has_visuals": content_data.get("has_images", False) or content_data.get("has_video", False)
        }

    async def _analyze_timing_features(self, publish_time: Optional[str]) -> Dict[str, Any]:
        """分析时间特征"""
        if not publish_time:
            return {"has_time": False, "optimal_score": 0.0}

        # 简化时间分析
        return {
            "has_time": True,
            "optimal_score": 0.7  # 默认分数
        }

    async def _calculate_content_quality_score(self, features: Dict[str, Any]) -> float:
        """计算内容质量分数"""
        scores = []

        # 标题质量分数
        title_score = features["title_features"].get("catchiness_score", 0.5)
        scores.append(title_score * 0.25)

        # 内容质量分数
        content_score = features["content_features"].get("value_density", 0.5)
        scores.append(content_score * 0.35)

        # 标签质量分数
        hashtag_score = features["hashtag_features"].get("relevance_score", 0.5)
        scores.append(hashtag_score * 0.20)

        # 格式分数
        format_multiplier = features["format_features"].get("engagement_multiplier", 1.0)
        format_score = min(1.0, format_multiplier)
        scores.append(format_score * 0.20)

        return sum(scores)

    async def _generate_optimized_titles(self, current_title: str, strategies: List[Dict[str, Any]]) -> List[str]:
        """生成优化标题建议"""
        optimized_titles = []

        # 基于策略生成标题
        for strategy in strategies:
            if strategy["type"] == "add_attractive_words":
                for word in strategy["examples"][:2]:
                    optimized_titles.append(f"{word}！{current_title}")
                    optimized_titles.append(f"{current_title}，{word}！")

            elif strategy["type"] == "add_numbers":
                optimized_titles.append(f"5个技巧！{current_title}")
                optimized_titles.append(f"2025年{current_title}")

        return optimized_titles[:5]  # 返回前5个建议

    async def _estimate_title_improvement(self, strategies: List[Dict[str, Any]]) -> float:
        """估算标题改进效果"""
        improvement = 0.0

        for strategy in strategies:
            if strategy["type"] == "add_attractive_words":
                improvement += 0.15
            elif strategy["type"] == "add_numbers":
                improvement += 0.10
            elif strategy["type"] == "length_optimization":
                improvement += 0.08

        return min(0.5, improvement)  # 最多50%改进

    async def _estimate_content_improvement(self, strategies: List[Dict[str, Any]]) -> float:
        """估算内容改进效果"""
        improvement = 0.0

        for strategy in strategies:
            if strategy["type"] == "add_call_to_action":
                improvement += 0.20
            elif strategy["type"] == "increase_value_density":
                improvement += 0.25
            elif strategy["type"] == "enhance_emotional_impact":
                improvement += 0.15

        return min(0.6, improvement)  # 最多60%改进

    async def _generate_optimal_hashtag_set(self, current_hashtags: List[str],
                                          strategies: List[Dict[str, Any]]) -> List[str]:
        """生成最优标签集合"""
        # 基础标签
        optimal_set = current_hashtags.copy()

        # 添加推荐的热门标签
        for strategy in strategies:
            if strategy["type"] == "add_trending_hashtags":
                optimal_set.extend(strategy["recommended_tags"][:2])

        # 确保标签数量适中（5-8个）
        if len(optimal_set) > 8:
            optimal_set = optimal_set[:8]
        elif len(optimal_set) < 5:
            # 添加更多热门标签
            popular_tags = self.xiaohongshu_patterns["popular_hashtags"]
            for tag in popular_tags:
                if tag not in optimal_set and len(optimal_set) < 5:
                    optimal_set.append(tag)

        return optimal_set

    async def _generate_effective_ctas(self, content_type: str) -> List[str]:
        """生成有效的CTA"""
        cta_templates = [
            "你们觉得怎么样？评论区告诉我～",
            "还有什么想了解的？评论区聊聊天～",
            "收藏起来慢慢看，感谢支持❤️",
            "关注我，每天分享干货～",
            "点赞收藏，下次不迷路～"
        ]

        return cta_templates

    async def _calculate_timing_score(self, publish_time: str, optimal_times: List[Dict[str, Any]]) -> float:
        """计算时间评分"""
        # 简化实现
        return 0.7

    async def _identify_content_strengths(self, content_data: Dict[str, Any]) -> List[str]:
        """识别内容优势"""
        strengths = []

        title = content_data.get("title", "")
        if len(title) > 20 and len(title) < 40:
            strengths.append("标题长度适中")

        content = content_data.get("content", "")
        if len(content) > 500:
            strengths.append("内容丰富详细")

        hashtags = content_data.get("hashtags", [])
        if len(hashtags) >= 5:
            strengths.append("话题标签充分")

        return strengths

    async def _identify_content_weaknesses(self, content_data: Dict[str, Any]) -> List[str]:
        """识别内容劣势"""
        weaknesses = []

        title = content_data.get("title", "")
        if len(title) < 10:
            weaknesses.append("标题过短，吸引力不足")

        content = content_data.get("content", "")
        if "评论区" not in content and "告诉我" not in content:
            weaknesses.append("缺乏互动引导")

        hashtags = content_data.get("hashtags", [])
        if len(hashtags) < 3:
            weaknesses.append("话题标签过少")

        return weaknesses

    async def _prioritize_optimizations(self, optimization: ContentOptimization) -> List[Dict[str, Any]]:
        """优先级排序优化建议"""
        priorities = []

        # 计算每个优化策略的预期改进
        title_impact = optimization.title_optimization.get("expected_improvement", 0)
        content_impact = optimization.content_optimization.get("expected_improvement", 0)
        hashtag_impact = len(optimization.hashtag_optimization.get("optimization_strategies", [])) * 0.1

        # 按影响程度排序
        optimizations = [
            {"area": "内容优化", "impact": content_impact, "effort": "medium"},
            {"area": "标题优化", "impact": title_impact, "effort": "low"},
            {"area": "标签优化", "impact": hashtag_impact, "effort": "low"},
            {"area": "发布时间优化", "impact": 0.15, "effort": "low"},
            {"area": "CTA优化", "impact": 0.20, "effort": "low"}
        ]

        optimizations.sort(key=lambda x: x["impact"], reverse=True)

        return optimizations