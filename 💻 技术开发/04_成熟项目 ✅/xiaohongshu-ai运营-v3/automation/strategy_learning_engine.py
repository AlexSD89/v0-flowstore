#!/usr/bin/env python3
"""
LaunchX V3.0 策略学习优化引擎
基于运营效果数据，持续学习和优化策略
"""

import asyncio
import json
import logging
import statistics
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Tuple
from enum import Enum
import uuid

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class OptimizationType(Enum):
    """优化类型"""
    CONTENT_STRATEGY = "content_strategy"        # 内容策略优化
    PUBLISHING_SCHEDULE = "publishing_schedule"  # 发布时间优化
    TARGET_AUDIENCE = "target_audience"         # 目标受众优化
    CONTENT_FORMAT = "content_format"           # 内容格式优化
    ENGAGEMENT_TACTICS = "engagement_tactics"   # 互动策略优化


class PerformanceLevel(Enum):
    """表现等级"""
    EXCELLENT = "excellent"    # 优秀 (> 0.9)
    GOOD = "good"             # 良好 (0.7-0.9)
    AVERAGE = "average"       # 平均 (0.5-0.7)
    POOR = "poor"             # 较差 (0.3-0.5)
    CRITICAL = "critical"     # 临界 (< 0.3)


@dataclass
class StrategyPerformance:
    """策略表现数据"""
    strategy_id: str
    customer_id: str
    period_start: datetime
    period_end: datetime
    content_performance: Dict[str, float] = field(default_factory=dict)
    audience_metrics: Dict[str, float] = field(default_factory=dict)
    business_impact: Dict[str, float] = field(default_factory=dict)
    quality_scores: Dict[str, float] = field(default_factory=dict)

    @property
    def overall_score(self) -> float:
        """计算综合表现分数"""
        if not any([self.content_performance, self.audience_metrics, self.business_impact]):
            return 0.0

        # 内容表现权重 40%
        content_score = statistics.mean(self.content_performance.values()) if self.content_performance else 0.5

        # 受众指标权重 30%
        audience_score = statistics.mean(self.audience_metrics.values()) if self.audience_metrics else 0.5

        # 业务影响权重 30%
        business_score = statistics.mean(self.business_impact.values()) if self.business_impact else 0.5

        return round(content_score * 0.4 + audience_score * 0.3 + business_score * 0.3, 3)

    @property
    def performance_level(self) -> PerformanceLevel:
        """获取表现等级"""
        score = self.overall_score

        if score >= 0.9:
            return PerformanceLevel.EXCELLENT
        elif score >= 0.7:
            return PerformanceLevel.GOOD
        elif score >= 0.5:
            return PerformanceLevel.AVERAGE
        elif score >= 0.3:
            return PerformanceLevel.POOR
        else:
            return PerformanceLevel.CRITICAL


@dataclass
class LearningInsight:
    """学习洞察"""
    insight_id: str
    insight_type: OptimizationType
    title: str
    description: str
    confidence: float
    impact_potential: float
    data_evidence: List[str] = field(default_factory=list)
    recommendation: str = ""
    implementation_difficulty: str = "medium"


@dataclass
class OptimizationRecommendation:
    """优化建议"""
    recommendation_id: str
    optimization_type: OptimizationType
    priority: str  # "high", "medium", "low"
    title: str
    description: str
    expected_improvement: Dict[str, float]
    implementation_steps: List[str]
    resources_needed: List[str] = field(default_factory=list)
    timeline: str = ""
    risk_factors: List[str] = field(default_factory=list)


class StrategyLearningEngine:
    """策略学习引擎"""

    def __init__(self):
        self.performance_history: List[StrategyPerformance] = []
        self.learning_insights: List[LearningInsight] = []
        self.optimization_patterns: Dict[str, Any] = {}
        self.benchmark_data: Dict[str, float] = {}

        # 初始化基准数据
        self._initialize_benchmarks()

    def _initialize_benchmarks(self):
        """初始化基准数据"""
        self.benchmark_data = {
            'engagement_rate': 0.06,      # 行业平均互动率
            'follower_growth': 0.12,     # 行业平均粉丝增长率
            'content_quality': 0.75,     # 内容质量基准
            'reach_efficiency': 0.40,    # 触达效率基准
            'conversion_rate': 0.03      # 转化率基准
        }

    async def analyze_performance_data(self, performance_data: Dict) -> StrategyPerformance:
        """分析表现数据"""
        try:
            logger.info("开始分析表现数据")

            # 解析输入数据
            strategy_id = performance_data.get('strategy_id', '')
            customer_id = performance_data.get('customer_id', '')
            period_data = performance_data.get('period_data', {})

            # 分析各维度表现
            content_performance = self._analyze_content_performance(period_data)
            audience_metrics = self._analyze_audience_metrics(period_data)
            business_impact = self._analyze_business_impact(period_data)
            quality_scores = self._analyze_quality_scores(period_data)

            # 创建表现对象
            performance = StrategyPerformance(
                strategy_id=strategy_id,
                customer_id=customer_id,
                period_start=datetime.fromisoformat(period_data.get('start_date', datetime.now().isoformat())),
                period_end=datetime.fromisoformat(period_data.get('end_date', datetime.now().isoformat())),
                content_performance=content_performance,
                audience_metrics=audience_metrics,
                business_impact=business_impact,
                quality_scores=quality_scores
            )

            # 添加到历史记录
            self.performance_history.append(performance)

            logger.info(f"表现分析完成，综合分数: {performance.overall_score}")
            return performance

        except Exception as e:
            logger.error(f"表现数据分析失败: {str(e)}")
            raise

    async def identify_success_patterns(self, history: List[StrategyPerformance]) -> List[Dict[str, Any]]:
        """识别成功模式"""
        try:
            logger.info("开始识别成功模式")

            if not history:
                return []

            # 筛选高表现案例
            high_performers = [p for p in history if p.performance_level in [PerformanceLevel.EXCELLENT, PerformanceLevel.GOOD]]

            if not high_performers:
                logger.warning("未找到高表现案例")
                return []

            # 分析共同特征
            patterns = self._analyze_common_patterns(high_performers)

            # 识别关键成功因素
            success_factors = self._identify_success_factors(high_performers)

            # 生成模式描述
            success_patterns = self._generate_pattern_descriptions(patterns, success_factors)

            logger.info(f"识别到 {len(success_patterns)} 个成功模式")
            return success_patterns

        except Exception as e:
            logger.error(f"成功模式识别失败: {str(e)}")
            return []

    async def generate_optimization_recommendations(self, performance: StrategyPerformance) -> List[OptimizationRecommendation]:
        """生成优化建议"""
        try:
            logger.info("开始生成优化建议")

            recommendations = []

            # 基于表现水平生成建议
            if performance.performance_level in [PerformanceLevel.POOR, PerformanceLevel.CRITICAL]:
                recommendations.extend(await self._generate_critical_improvements(performance))
            elif performance.performance_level == PerformanceLevel.AVERAGE:
                recommendations.extend(await self._generate_enhancement_suggestions(performance))
            else:
                recommendations.extend(await self._generate_optimization_fine_tuning(performance))

            # 基于具体问题生成针对性建议
            detailed_recommendations = await self._generate_specific_recommendations(performance)
            recommendations.extend(detailed_recommendations)

            # 排序和筛选建议
            prioritized_recommendations = self._prioritize_recommendations(recommendations)

            logger.info(f"生成了 {len(prioritized_recommendations)} 个优化建议")
            return prioritized_recommendations

        except Exception as e:
            logger.error(f"优化建议生成失败: {str(e)}")
            return []

    async def apply_learning_to_strategy(self, strategy: Dict, insights: List[LearningInsight]) -> Dict:
        """将学习应用到策略"""
        try:
            logger.info("开始应用学习洞察到策略")

            enhanced_strategy = strategy.copy()

            # 按优化类型分组洞察
            insights_by_type = self._group_insights_by_type(insights)

            # 应用各类优化
            for optimization_type, type_insights in insights_by_type.items():
                enhanced_strategy = await self._apply_type_specific_optimizations(
                    enhanced_strategy, optimization_type, type_insights
                )

            # 更新策略元数据
            enhanced_strategy['learning_applied'] = True
            enhanced_strategy['learning_timestamp'] = datetime.now().isoformat()
            enhanced_strategy['applied_insights_count'] = len(insights)

            logger.info("学习洞察应用完成")
            return enhanced_strategy

        except Exception as e:
            logger.error(f"学习应用失败: {str(e)}")
            return strategy

    async def learn_from_a_b_test(self, test_results: Dict) -> LearningInsight:
        """从A/B测试中学习"""
        try:
            logger.info("开始从A/B测试结果中学习")

            # 解析测试结果
            variant_a = test_results.get('variant_a', {})
            variant_b = test_results.get('variant_b', {})

            # 计算统计显著性
            significance = self._calculate_statistical_significance(variant_a, variant_b)

            # 确定胜出版本
            winner = self._determine_test_winner(variant_a, variant_b, significance)

            # 生成学习洞察
            insight = self._generate_test_insight(test_results, winner, significance)

            # 添加到洞察库
            self.learning_insights.append(insight)

            logger.info(f"A/B测试学习完成，胜出版本: {winner}")
            return insight

        except Exception as e:
            logger.error(f"A/B测试学习失败: {str(e)}")
            raise

    def _analyze_content_performance(self, period_data: Dict) -> Dict[str, float]:
        """分析内容表现"""
        content_metrics = period_data.get('content_metrics', {})

        return {
            'engagement_rate': self._normalize_metric(
                content_metrics.get('engagement_rate', 0), 'engagement_rate'
            ),
            'reach_rate': self._normalize_metric(
                content_metrics.get('reach_rate', 0), 'reach_rate'
            ),
            'share_rate': self._normalize_metric(
                content_metrics.get('share_rate', 0), 'share_rate'
            ),
            'save_rate': self._normalize_metric(
                content_metrics.get('save_rate', 0), 'save_rate'
            ),
            'completion_rate': self._normalize_metric(
                content_metrics.get('completion_rate', 0), 'completion_rate'
            )
        }

    def _analyze_audience_metrics(self, period_data: Dict) -> Dict[str, float]:
        """分析受众指标"""
        audience_metrics = period_data.get('audience_metrics', {})

        return {
            'follower_growth': self._normalize_metric(
                audience_metrics.get('follower_growth', 0), 'follower_growth'
            ),
            'audience_retention': self._normalize_metric(
                audience_metrics.get('audience_retention', 0), 'audience_retention'
            ),
            'new_follower_quality': self._normalize_metric(
                audience_metrics.get('new_follower_quality', 0), 'new_follower_quality'
            ),
            'audience_engagement_depth': self._normalize_metric(
                audience_metrics.get('engagement_depth', 0), 'engagement_depth'
            )
        }

    def _analyze_business_impact(self, period_data: Dict) -> Dict[str, float]:
        """分析业务影响"""
        business_metrics = period_data.get('business_metrics', {})

        return {
            'conversion_rate': self._normalize_metric(
                business_metrics.get('conversion_rate', 0), 'conversion_rate'
            ),
            'lead_quality': self._normalize_metric(
                business_metrics.get('lead_quality', 0), 'lead_quality'
            ),
            'brand_mention_increase': self._normalize_metric(
                business_metrics.get('brand_mentions', 0), 'brand_mentions'
            ),
            'customer_acquisition_cost': self._normalize_cost_metric(
                business_metrics.get('cac', 0), 'cac'
            )
        }

    def _analyze_quality_scores(self, period_data: Dict) -> Dict[str, float]:
        """分析质量分数"""
        quality_metrics = period_data.get('quality_metrics', {})

        return {
            'content_relevance': quality_metrics.get('relevance_score', 0.5),
            'visual_appeal': quality_metrics.get('visual_score', 0.5),
            'information_value': quality_metrics.get('value_score', 0.5),
            'brand_consistency': quality_metrics.get('brand_score', 0.5)
        }

    def _normalize_metric(self, value: float, metric_type: str) -> float:
        """标准化指标值到0-1范围"""
        if value <= 0:
            return 0.0

        # 根据指标类型进行不同的标准化
        normalization_ranges = {
            'engagement_rate': (0, 0.20),     # 互动率通常在0-20%
            'reach_rate': (0, 1.0),          # 触达率0-100%
            'share_rate': (0, 0.10),         # 分享率0-10%
            'save_rate': (0, 0.15),          # 收藏率0-15%
            'completion_rate': (0, 1.0),      # 完成率0-100%
            'follower_growth': (0, 0.50),     # 粉丝增长率0-50%
            'audience_retention': (0, 1.0),   # 留存率0-100%
            'conversion_rate': (0, 0.10),     # 转化率0-10%
            'brand_mentions': (0, 1000)       # 品牌提及数
        }

        if metric_type in normalization_ranges:
            min_val, max_val = normalization_ranges[metric_type]
            normalized = min(max((value - min_val) / (max_val - min_val), 0), 1)
            return round(normalized, 3)

        # 默认标准化
        return round(min(value / 10.0, 1.0), 3)

    def _normalize_cost_metric(self, value: float, metric_type: str) -> float:
        """标准化成本指标（值越低越好）"""
        if value <= 0:
            return 1.0

        # CAC标准化（假设合理范围是0-100）
        if metric_type == 'cac':
            # 反向标准化：成本越低分数越高
            normalized = max(1 - (value / 100.0), 0)
            return round(normalized, 3)

        return 0.5

    def _analyze_common_patterns(self, high_performers: List[StrategyPerformance]) -> Dict[str, Any]:
        """分析共同模式"""
        patterns = {}

        # 内容类型模式
        content_patterns = []
        for performer in high_performers:
            if performer.content_performance:
                best_content_type = max(performer.content_performance.items(), key=lambda x: x[1])
                content_patterns.append(best_content_type[0])

        if content_patterns:
            patterns['preferred_content_types'] = statistics.mode(content_patterns)

        # 发布时间模式
        # 这里需要更详细的数据，暂时跳过

        # 主题模式
        # 这里需要主题数据，暂时跳过

        return patterns

    def _identify_success_factors(self, high_performers: List[StrategyPerformance]) -> List[str]:
        """识别成功因素"""
        factors = []

        # 计算各维度平均表现
        avg_content_score = statistics.mean([
            statistics.mean(p.content_performance.values()) if p.content_performance else 0.5
            for p in high_performers
        ])

        avg_audience_score = statistics.mean([
            statistics.mean(p.audience_metrics.values()) if p.audience_metrics else 0.5
            for p in high_performers
        ])

        avg_quality_score = statistics.mean([
            statistics.mean(p.quality_scores.values()) if p.quality_scores else 0.5
            for p in high_performers
        ])

        # 识别优势因素
        if avg_content_score > 0.8:
            factors.append("优质内容创作")
        if avg_audience_score > 0.8:
            factors.append("精准受众定位")
        if avg_quality_score > 0.8:
            factors.append("高质量视觉呈现")

        # 通用成功因素
        factors.extend([
            "持续的发布频率",
            "与受众的良好互动",
            "紧跟热点话题"
        ])

        return factors

    def _generate_pattern_descriptions(self, patterns: Dict, success_factors: List[str]) -> List[Dict[str, Any]]:
        """生成模式描述"""
        descriptions = []

        # 内容模式描述
        if 'preferred_content_types' in patterns:
            content_type = patterns['preferred_content_types']
            descriptions.append({
                'pattern_type': 'content',
                'description': f'高表现案例倾向于使用{content_type}内容',
                'confidence': 0.75,
                'evidence_count': len([p for p in self.performance_history if p.performance_level.value in ['excellent', 'good']])
            })

        # 成功因素描述
        if success_factors:
            descriptions.append({
                'pattern_type': 'success_factors',
                'description': f'关键成功因素包括: {", ".join(success_factors[:3])}',
                'confidence': 0.80,
                'factors': success_factors
            })

        return descriptions

    async def _generate_critical_improvements(self, performance: StrategyPerformance) -> List[OptimizationRecommendation]:
        """生成关键改进建议"""
        recommendations = []

        # 基于表现问题生成建议
        if performance.overall_score < 0.3:
            recommendations.append(OptimizationRecommendation(
                recommendation_id=str(uuid.uuid4()),
                optimization_type=OptimizationType.CONTENT_STRATEGY,
                priority="high",
                title="全面优化内容策略",
                description="当前表现处于临界水平，需要全面重新评估和优化内容策略",
                expected_improvement={
                    'engagement_rate': 0.15,
                    'follower_growth': 0.20,
                    'overall_score': 0.40
                },
                implementation_steps=[
                    "重新分析目标受众需求",
                    "调整内容支柱和主题",
                    "优化内容创作流程",
                    "加强质量管控"
                ],
                resources_needed=["内容策略师", "设计资源", "数据分析工具"],
                timeline="4-6周",
                risk_factors=["需要额外资源投入", "短期内可能影响发布频率"]
            ))

        # 具体维度改进建议
        if performance.content_performance:
            avg_content_score = statistics.mean(performance.content_performance.values())
            if avg_content_score < 0.4:
                recommendations.append(await self._create_content_improvement_recommendation(performance))

        if performance.audience_metrics:
            avg_audience_score = statistics.mean(performance.audience_metrics.values())
            if avg_audience_score < 0.4:
                recommendations.append(await self._create_audience_improvement_recommendation(performance))

        return recommendations

    async def _generate_enhancement_suggestions(self, performance: StrategyPerformance) -> List[OptimizationRecommendation]:
        """生成增强建议"""
        recommendations = []

        # 识别表现中等但有提升潜力的领域
        improvement_areas = []

        if performance.content_performance:
            for metric, score in performance.content_performance.items():
                if 0.5 <= score <= 0.7:  # 中等表现
                    improvement_areas.append(('content', metric, score))

        if improvement_areas:
            for area, metric, score in improvement_areas:
                recommendation = await self._create_enhancement_recommendation(area, metric, score, performance)
                recommendations.append(recommendation)

        return recommendations

    async def _generate_optimization_fine_tuning(self, performance: StrategyPerformance) -> List[OptimizationRecommendation]:
        """生成精细化优化建议"""
        recommendations = []

        # 针对已经表现良好的领域进行微调
        if performance.content_performance:
            for metric, score in performance.content_performance.items():
                if score > 0.8:  # 表现良好
                    recommendation = await self._create_fine_tuning_recommendation('content', metric, score)
                    recommendations.append(recommendation)

        return recommendations

    async def _generate_specific_recommendations(self, performance: StrategyPerformance) -> List[OptimizationRecommendation]:
        """生成针对性建议"""
        recommendations = []

        # 互动率问题
        engagement_rate = performance.content_performance.get('engagement_rate', 0)
        if engagement_rate < self.benchmark_data['engagement_rate']:
            recommendations.append(await self._create_engagement_improvement_recommendation(performance))

        # 粉丝增长问题
        follower_growth = performance.audience_metrics.get('follower_growth', 0)
        if follower_growth < self.benchmark_data['follower_growth']:
            recommendations.append(await self._create_growth_improvement_recommendation(performance))

        # 内容质量问题
        if performance.quality_scores:
            avg_quality = statistics.mean(performance.quality_scores.values())
            if avg_quality < 0.7:
                recommendations.append(await self._create_quality_improvement_recommendation(performance))

        return recommendations

    async def _create_content_improvement_recommendation(self, performance: StrategyPerformance) -> OptimizationRecommendation:
        """创建内容改进建议"""
        return OptimizationRecommendation(
            recommendation_id=str(uuid.uuid4()),
            optimization_type=OptimizationType.CONTENT_STRATEGY,
            priority="high",
            title="内容质量提升计划",
            description="系统性改进内容创作质量，提升用户参与度",
            expected_improvement={
                'engagement_rate': 0.08,
                'content_quality': 0.20,
                'share_rate': 0.10
            },
            implementation_steps=[
                "建立内容质量评估标准",
                "优化内容选题流程",
                "加强视觉设计投入",
                "改进文案写作技巧"
            ],
            resources_needed=["内容编辑", "设计师", "摄影设备"],
            timeline="3-4周"
        )

    async def _create_audience_improvement_recommendation(self, performance: StrategyPerformance) -> OptimizationRecommendation:
        """创建受众改进建议"""
        return OptimizationRecommendation(
            recommendation_id=str(uuid.uuid4()),
            optimization_type=OptimizationType.TARGET_AUDIENCE,
            priority="high",
            title="受众定位优化",
            description="重新评估和优化目标受众定位，提升内容匹配度",
            expected_improvement={
                'follower_growth': 0.15,
                'audience_retention': 0.20,
                'new_follower_quality': 0.25
            },
            implementation_steps=[
                "深入分析现有受众特征",
                "重新定义目标受众画像",
                "调整内容方向和语言风格",
                "优化发布时间和平台"
            ],
            resources_needed=["数据分析工具", "市场调研"],
            timeline="2-3周"
        )

    async def _create_engagement_improvement_recommendation(self, performance: StrategyPerformance) -> OptimizationRecommendation:
        """创建互动改进建议"""
        return OptimizationRecommendation(
            recommendation_id=str(uuid.uuid4()),
            optimization_type=OptimizationType.ENGAGEMENT_TACTICS,
            priority="medium",
            title="互动策略优化",
            description="提升用户互动质量和频率",
            expected_improvement={
                'engagement_rate': 0.12,
                'comment_rate': 0.15,
                'share_rate': 0.10
            },
            implementation_steps=[
                "设计互动式内容形式",
                "优化发布时间和互动时机",
                "制定回复和互动策略",
                "开展用户互动活动"
            ],
            resources_needed=["社群运营", "活动策划"],
            timeline="2-3周"
        )

    async def _create_growth_improvement_recommendation(self, performance: StrategyPerformance) -> OptimizationRecommendation:
        """创建增长改进建议"""
        return OptimizationRecommendation(
            recommendation_id=str(uuid.uuid4()),
            optimization_type=OptimizationType.TARGET_AUDIENCE,
            priority="high",
            title="粉丝增长策略",
            description="制定有效的粉丝增长策略",
            expected_improvement={
                'follower_growth': 0.18,
                'new_follower_quality': 0.15
            },
            implementation_steps=[
                "分析竞品增长策略",
                "优化内容可发现性",
                "加强跨平台推广",
                "建立粉丝转化机制"
            ],
            resources_needed=["推广预算", "跨平台运营"],
            timeline="4-6周"
        )

    async def _create_quality_improvement_recommendation(self, performance: StrategyPerformance) -> OptimizationRecommendation:
        """创建质量改进建议"""
        return OptimizationRecommendation(
            recommendation_id=str(uuid.uuid4()),
            optimization_type=OptimizationType.CONTENT_FORMAT,
            priority="medium",
            title="内容质量标准化",
            description="建立内容质量标准和流程",
            expected_improvement={
                'content_quality': 0.25,
                'brand_consistency': 0.20
            },
            implementation_steps=[
                "制定内容质量标准",
                "建立审核流程",
                "优化视觉风格指南",
                "培训内容创作团队"
            ],
            resources_needed=["质量标准文档", "培训资源"],
            timeline="2-4周"
        )

    def _prioritize_recommendations(self, recommendations: List[OptimizationRecommendation]) -> List[OptimizationRecommendation]:
        """优先级排序建议"""
        # 按优先级和预期影响排序
        priority_order = {'high': 3, 'medium': 2, 'low': 1}

        # 计算综合优先级分数
        for rec in recommendations:
            priority_score = priority_order.get(rec.priority, 1)
            impact_score = sum(rec.expected_improvement.values()) / len(rec.expected_improvement) if rec.expected_improvement else 0
            rec.priority_score = priority_score * 0.6 + impact_score * 0.4

        # 排序
        sorted_recommendations = sorted(recommendations, key=lambda x: x.priority_score, reverse=True)

        return sorted_recommendations[:10]  # 返回前10个最重要的建议

    def _group_insights_by_type(self, insights: List[LearningInsight]) -> Dict[str, List[LearningInsight]]:
        """按类型分组洞察"""
        grouped = {}
        for insight in insights:
            insight_type = insight.insight_type.value
            if insight_type not in grouped:
                grouped[insight_type] = []
            grouped[insight_type].append(insight)
        return grouped

    async def _apply_type_specific_optimizations(self, strategy: Dict, optimization_type: str, insights: List[LearningInsight]) -> Dict:
        """应用特定类型的优化"""
        if optimization_type == OptimizationType.CONTENT_STRATEGY.value:
            return await self._apply_content_strategy_optimizations(strategy, insights)
        elif optimization_type == OptimizationType.PUBLISHING_SCHEDULE.value:
            return await self._apply_publishing_schedule_optimizations(strategy, insights)
        elif optimization_type == OptimizationType.TARGET_AUDIENCE.value:
            return await self._apply_target_audience_optimizations(strategy, insights)
        else:
            return strategy

    async def _apply_content_strategy_optimizations(self, strategy: Dict, insights: List[LearningInsight]) -> Dict:
        """应用内容策略优化"""
        content_strategy = strategy.get('content_strategy', {})

        # 基于洞察调整内容支柱
        pillars = content_strategy.get('pillars', [])
        for insight in insights:
            if '内容类型' in insight.title:
                # 调整内容类型建议
                recommended_types = content_strategy.get('recommended_types', [])
                if insight.recommendation:
                    recommended_types.append(insight.recommendation.split(':')[1].strip())
                content_strategy['recommended_types'] = list(set(recommended_types))

        strategy['content_strategy'] = content_strategy
        return strategy

    async def _apply_publishing_schedule_optimizations(self, strategy: Dict, insights: List[LearningInsight]) -> Dict:
        """应用发布时间优化"""
        content_strategy = strategy.get('content_strategy', {})
        publishing_schedule = content_strategy.get('publishing_schedule', {})

        # 基于洞察调整发布时间
        for insight in insights:
            if '发布时间' in insight.title:
                # 调整最优发布时间
                if insight.recommendation:
                    new_times = insight.recommendation.split(':')[1].strip()
                    publishing_schedule['optimal_times'] = [time.strip() for time in new_times.split(',')]

        content_strategy['publishing_schedule'] = publishing_schedule
        strategy['content_strategy'] = content_strategy
        return strategy

    async def _apply_target_audience_optimizations(self, strategy: Dict, insights: List[LearningInsight]) -> Dict:
        """应用目标受众优化"""
        # 这里可以添加受众优化逻辑
        return strategy

    def _calculate_statistical_significance(self, variant_a: Dict, variant_b: Dict) -> float:
        """计算统计显著性"""
        # 简化的显著性计算
        a_conversions = variant_a.get('conversions', 0)
        a_visitors = variant_a.get('visitors', 1)
        b_conversions = variant_b.get('conversions', 0)
        b_visitors = variant_b.get('visitors', 1)

        a_rate = a_conversions / a_visitors if a_visitors > 0 else 0
        b_rate = b_conversions / b_visitors if b_visitors > 0 else 0

        # 简化的显著性计算（实际应该使用更严格的统计方法）
        if abs(a_rate - b_rate) > 0.05:  # 5%差异阈值
            return 0.95
        elif abs(a_rate - b_rate) > 0.02:  # 2%差异阈值
            return 0.80
        else:
            return 0.60

    def _determine_test_winner(self, variant_a: Dict, variant_b: Dict, significance: float) -> str:
        """确定测试胜出版本"""
        a_rate = variant_a.get('conversion_rate', 0)
        b_rate = variant_b.get('conversion_rate', 0)

        if significance < 0.8:
            return "no_significant_difference"

        if a_rate > b_rate:
            return "variant_a"
        elif b_rate > a_rate:
            return "variant_b"
        else:
            return "tie"

    def _generate_test_insight(self, test_results: Dict, winner: str, significance: float) -> LearningInsight:
        """生成测试洞察"""
        variant_a = test_results.get('variant_a', {})
        variant_b = test_results.get('variant_b', {})

        if winner == "no_significant_difference":
            description = f"A/B测试未显示显著差异（显著性: {significance:.2f}），两个版本效果相当"
        else:
            winning_variant = variant_a if winner == "variant_a" else variant_b
            improvement = test_results.get('improvement_percentage', 0)
            description = f"A/B测试显示{winner}胜出，提升{improvement:.1f}%（显著性: {significance:.2f}）"

        return LearningInsight(
            insight_id=str(uuid.uuid4()),
            insight_type=OptimizationType.CONTENT_STRATEGY,
            title=f"A/B测试学习: {test_results.get('test_name', '未知测试')}",
            description=description,
            confidence=significance,
            impact_potential=test_results.get('improvement_percentage', 0) / 100.0,
            data_evidence=[f"版本A转化率: {variant_a.get('conversion_rate', 0):.3f}",
                         f"版本B转化率: {variant_b.get('conversion_rate', 0):.3f}"],
            recommendation=self._generate_test_recommendation(winner, test_results)
        )

    def _generate_test_recommendation(self, winner: str, test_results: Dict) -> str:
        """生成测试建议"""
        if winner == "no_significant_difference":
            return "两个版本效果相当，可以选择成本更低或更易实施的版本"
        elif winner == "variant_a":
            return "建议采用版本A的策略"
        else:
            return "建议采用版本B的策略"

    async def create_learning_plan(self, customer_config: Dict, content_strategy: Dict) -> Dict[str, Any]:
        """创建学习计划"""
        try:
            logger.info("开始创建学习计划")

            learning_plan = {
                'learning_objectives': self._define_learning_objectives(customer_config, content_strategy),
                'data_collection_strategy': self._define_data_collection_strategy(),
                'analysis_schedule': self._create_analysis_schedule(),
                'optimimization_cycles': self._define_optimization_cycles(),
                'success_metrics': self._define_learning_success_metrics(),
                'resource_requirements': self._define_learning_resources()
            }

            logger.info("学习计划创建完成")
            return learning_plan

        except Exception as e:
            logger.error(f"学习计划创建失败: {str(e)}")
            return {}

    def _define_learning_objectives(self, customer_config: Dict, content_strategy: Dict) -> List[str]:
        """定义学习目标"""
        objectives = [
            "识别最有效的内容类型和主题",
            "优化发布时间和频率",
            "理解受众互动模式",
            "建立内容质量评估体系"
        ]

        # 根据客户成熟度调整目标
        maturity_level = customer_config.get('insights', {}).get('maturity_level', 1)
        if maturity_level <= 2:
            objectives.insert(0, "建立基础数据收集和分析能力")

        return objectives

    def _define_data_collection_strategy(self) -> Dict[str, Any]:
        """定义数据收集策略"""
        return {
            'primary_metrics': [
                'engagement_rate',
                'follower_growth',
                'content_performance',
                'audience_demographics'
            ],
            'secondary_metrics': [
                'share_rate',
                'save_rate',
                'comment_quality',
                'brand_mentions'
            ],
            'collection_frequency': {
                'daily_metrics': ['daily_engagement', 'daily_growth'],
                'weekly_metrics': ['content_performance', 'audience_analysis'],
                'monthly_metrics': ['strategy_effectiveness', 'ROI_analysis']
            },
            'data_sources': [
                'platform_analytics',
                'content_performance_data',
                'audience_feedback',
                'competitor_analysis'
            ]
        }

    def _create_analysis_schedule(self) -> Dict[str, Any]:
        """创建分析计划"""
        return {
            'daily_analysis': {
                'time': '每日09:00',
                'focus': ['前日内容表现', '用户互动情况'],
                'duration': '30分钟'
            },
            'weekly_analysis': {
                'time': '每周一10:00',
                'focus': ['周度趋势', '内容类型效果', '最佳发布时间'],
                'duration': '2小时'
            },
            'monthly_analysis': {
                'time': '每月第一个周三14:00',
                'focus': ['月度策略评估', '受众分析', '竞品对比'],
                'duration': '4小时'
            },
            'quarterly_review': {
                'time': '季度末',
                'focus': ['整体策略效果', '学习成果总结', '下季度规划'],
                'duration': '1天'
            }
        }

    def _define_optimization_cycles(self) -> List[Dict[str, Any]]:
        """定义优化周期"""
        return [
            {
                'cycle_name': '快速优化',
                'duration': '1周',
                'focus': ['发布时间', '内容格式', '标题优化'],
                'success_criteria': '提升3-5%关键指标'
            },
            {
                'cycle_name': '策略调整',
                'duration': '1个月',
                'focus': ['内容支柱', '目标受众', '互动策略'],
                'success_criteria': '提升10-15%整体表现'
            },
            {
                'cycle_name': '战略升级',
                'duration': '1季度',
                'focus': ['整体定位', '品牌策略', '长期规划'],
                'success_criteria': '显著提升市场竞争力'
            }
        ]

    def _define_learning_success_metrics(self) -> List[str]:
        """定义学习成功指标"""
        return [
            '策略优化成功率',
            '关键指标改善幅度',
            '学习洞察应用率',
            '数据驱动决策比例',
            'ROI提升效果'
        ]

    def _define_learning_resources(self) -> Dict[str, List[str]]:
        """定义学习所需资源"""
        return {
            'tools': [
                '数据分析平台',
                'A/B测试工具',
                '用户调研工具',
                '竞品监控系统'
            ],
            'skills': [
                '数据分析能力',
                '用户洞察分析',
                '内容策略优化',
                '实验设计能力'
            ],
            'time_investment': {
                'daily_monitoring': '30分钟',
                'weekly_analysis': '2小时',
                'monthly_review': '4小时',
                'quarterly_planning': '1天'
            }
        }


# 使用示例
async def main():
    """主函数示例"""
    learning_engine = StrategyLearningEngine()

    # 示例表现数据
    performance_data = {
        'strategy_id': 'strategy_123',
        'customer_id': 'customer_456',
        'period_data': {
            'start_date': '2025-09-01T00:00:00',
            'end_date': '2025-09-30T23:59:59',
            'content_metrics': {
                'engagement_rate': 0.08,
                'reach_rate': 0.65,
                'share_rate': 0.05,
                'save_rate': 0.12
            },
            'audience_metrics': {
                'follower_growth': 0.15,
                'audience_retention': 0.82
            },
            'business_metrics': {
                'conversion_rate': 0.035,
                'brand_mentions': 150
            },
            'quality_metrics': {
                'relevance_score': 0.85,
                'visual_score': 0.78,
                'value_score': 0.82
            }
        }
    }

    try:
        # 分析表现数据
        performance = await learning_engine.analyze_performance_data(performance_data)
        print(f"表现分析结果:")
        print(f"综合分数: {performance.overall_score}")
        print(f"表现等级: {performance.performance_level.value}")

        # 识别成功模式
        if len(learning_engine.performance_history) > 1:
            patterns = await learning_engine.identify_success_patterns(learning_engine.performance_history)
            print(f"\n成功模式: {len(patterns)} 个")

        # 生成优化建议
        recommendations = await learning_engine.generate_optimization_recommendations(performance)
        print(f"\n优化建议: {len(recommendations)} 个")
        for rec in recommendations[:3]:  # 显示前3个建议
            print(f"- {rec.title}: {rec.description}")

    except Exception as e:
        print(f"学习引擎执行失败: {str(e)}")


if __name__ == "__main__":
    asyncio.run(main())