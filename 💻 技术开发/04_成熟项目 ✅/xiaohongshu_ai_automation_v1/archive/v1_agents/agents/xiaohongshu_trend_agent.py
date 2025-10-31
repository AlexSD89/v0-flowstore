"""
小红书趋势分析Agent - 最佳效果实现
专门负责爆款识别、趋势预测、市场分析
"""

import asyncio
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, field

from ..agent_os.base_agent import BaseAgent, AgentTask, AgentMessage, MessageType
from ..models.tenant import ContentRepository, Analytics
from ..utils.mcp_client import MCPClient

logger = logging.getLogger(__name__)


@dataclass
class TrendData:
    """趋势数据结构"""
    topic: str
    heat_score: float  # 0-100 热度分数
    growth_rate: float  # 增长率 %
    potential_score: float  # 潜力分数
    keywords: List[str]
    related_tags: List[str]
    best_posting_time: str  # 最佳发布时间
    content_format: str  # 推荐内容格式
    competitor_analysis: Dict[str, Any]
    predicted_performance: Dict[str, float]


@dataclass
class ViralContent:
    """爆款内容分析"""
    content_id: str
    title: str
    content_text: str
    tags: List[str]
    engagement_metrics: Dict[str, int]
    viral_score: float  # 爆款分数 0-100
    success_factors: List[str]  # 成功因子
    replication_potential: float  # 复制潜力 0-100
    improvement_suggestions: List[str]


class XiaohongshuTrendAgent(BaseAgent):
    """小红书趋势分析Agent - 追求95%+爆款识别准确率"""

    def __init__(self):
        super().__init__(
            agent_id="xiaohongshu-trend-agent",
            name="小红书趋势分析专家",
            capabilities=[
                "trend_analysis",
                "viral_content_detection",
                "market_prediction",
                "competitor_analysis",
                "content_optimization"
            ],
            tools=[
                "xiaohongshu-mcp",
                "tavily-search",
                "ai-analytics",
                "sentiment-analysis"
            ],
            config={
                "claude_model": "claude-3-opus-20240229",
                "claude_temperature": 0.3,  # 低温度保证分析准确性
                "trend_analysis_model": "advanced_v2",
                "prediction_accuracy_target": 0.95,
                "learning_rate": 0.001
            }
        )

        # 专业工具客户端
        self.mcp_client = MCPClient()

        # 趋势数据库
        self.trend_history: Dict[str, List[TrendData]] = {}
        self.viral_content_db: List[ViralContent] = []
        self.competitor_analysis_cache: Dict[str, Any] = {}

        # AI模型缓存
        self.prediction_model = None
        self.viral_classifier = None

        # 学习机制
        self.feedback_buffer: List[Dict[str, Any]] = []
        self.model_performance_history: List[float] = []

    async def execute_task(self, task: AgentTask) -> Dict[str, Any]:
        """执行趋势分析任务"""
        task_type = task.task_type

        if task_type == "analyze_trends":
            return await self._analyze_current_trends(task.parameters)
        elif task_type == "detect_viral_content":
            return await self._detect_viral_content(task.parameters)
        elif task_type == "predict_content_performance":
            return await self._predict_content_performance(task.parameters)
        elif task_type == "analyze_competitors":
            return await self._analyze_competitors(task.parameters)
        elif task_type == "generate_trend_report":
            return await self._generate_comprehensive_trend_report(task.parameters)
        elif task_type == "optimize_content_strategy":
            return await self._optimize_content_strategy(task.parameters)
        else:
            raise ValueError(f"Unknown task type: {task_type}")

    async def _analyze_current_trends(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """分析当前趋势 - 核心爆款识别功能"""
        try:
            # 1. 获取实时数据
            trending_topics = await self._fetch_trending_topics()

            # 2. AI深度分析
            analyzed_trends = []
            for topic in trending_topics:
                trend_data = await self._analyze_topic_trend(topic)
                analyzed_trends.append(trend_data)

            # 3. 预测趋势发展
            predictions = await self._predict_trend_evolution(analyzed_trends)

            # 4. 生成行动建议
            recommendations = await self._generate_trend_recommendations(analyzed_trends, predictions)

            # 5. 存储学习数据
            await self._store_trend_analysis(analyzed_trends, predictions)

            return {
                "status": "success",
                "trends": [self._serialize_trend_data(t) for t in analyzed_trends],
                "predictions": predictions,
                "recommendations": recommendations,
                "confidence_score": self._calculate_analysis_confidence(),
                "analysis_timestamp": datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"趋势分析失败: {e}")
            return {"status": "error", "message": str(e)}

    async def _detect_viral_content(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """爆款内容检测 - 95%准确率目标"""
        try:
            content_pool = params.get("content_pool", [])
            if not content_pool:
                content_pool = await self._fetch_recent_content()

            viral_contents = []
            for content in content_pool:
                viral_score = await self._calculate_viral_score(content)

                if viral_score > 70:  # 爆款阈值
                    viral_content = ViralContent(
                        content_id=content.get("id"),
                        title=content.get("title", ""),
                        content_text=content.get("content", ""),
                        tags=content.get("tags", []),
                        engagement_metrics=content.get("metrics", {}),
                        viral_score=viral_score,
                        success_factors=await self._identify_success_factors(content),
                        replication_potential=await self._calculate_replication_potential(content),
                        improvement_suggestions=await self._generate_improvement_suggestions(content)
                    )
                    viral_contents.append(viral_content)

            # 按爆款分数排序
            viral_contents.sort(key=lambda x: x.viral_score, reverse=True)

            return {
                "status": "success",
                "viral_contents": [self._serialize_viral_content(vc) for vc in viral_contents],
                "total_analyzed": len(content_pool),
                "viral_found": len(viral_contents),
                "average_viral_score": sum(vc.viral_score for vc in viral_contents) / len(viral_contents) if viral_contents else 0,
                "detection_confidence": self._calculate_detection_confidence()
            }

        except Exception as e:
            logger.error(f"爆款检测失败: {e}")
            return {"status": "error", "message": str(e)}

    async def _predict_content_performance(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """内容表现预测 - AI模型驱动"""
        try:
            content_data = params.get("content")
            if not content_data:
                return {"status": "error", "message": "内容数据缺失"}

            # 1. 特征提取
            features = await self._extract_content_features(content_data)

            # 2. 多模型预测
            predictions = {}

            # 互动量预测
            engagement_pred = await self._predict_engagement(features)
            predictions["engagement"] = engagement_pred

            # 爆款概率预测
            viral_probability = await self._predict_viral_probability(features)
            predictions["viral_probability"] = viral_probability

            # 最优发布时间预测
            optimal_timing = await self._predict_optimal_timing(features)
            predictions["optimal_timing"] = optimal_timing

            # 竞争度分析
            competition_analysis = await self._analyze_competition_level(content_data)
            predictions["competition"] = competition_analysis

            # 3. 综合评分
            overall_score = self._calculate_overformance_score(predictions)

            # 4. 优化建议
            optimization_tips = await self._generate_optimization_tips(content_data, predictions)

            return {
                "status": "success",
                "content_id": content_data.get("id"),
                "predictions": predictions,
                "overall_score": overall_score,
                "optimization_tips": optimization_tips,
                "confidence_interval": await self._calculate_prediction_confidence(features),
                "model_version": "viral_predictor_v2.1"
            }

        except Exception as e:
            logger.error(f"内容预测失败: {e}")
            return {"status": "error", "message": str(e)}

    async def _analyze_competitors(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """竞争对手分析"""
        try:
            competitor_list = params.get("competitors", [])
            analysis_depth = params.get("depth", "comprehensive")

            competitor_insights = []
            for competitor in competitor_list:
                insight = await self._analyze_single_competitor(competitor, analysis_depth)
                competitor_insights.append(insight)

            # 生成竞争策略
            competitive_strategy = await self._generate_competitive_strategy(competitor_insights)

            return {
                "status": "success",
                "competitor_analysis": competitor_insights,
                "competitive_strategy": competitive_strategy,
                "market_positioning": await self._analyze_market_positioning(competitor_insights),
                "opportunity_gaps": await self._identify_opportunity_gaps(competitor_insights)
            }

        except Exception as e:
            logger.error(f"竞品分析失败: {e}")
            return {"status": "error", "message": str(e)}

    async def _generate_comprehensive_trend_report(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """生成综合趋势报告"""
        try:
            report_period = params.get("period", "weekly")
            target_audience = params.get("target_audience", "general")

            # 1. 收集所有趋势数据
            trend_analysis = await self._analyze_current_trends({})

            # 2. 爆款内容分析
            viral_analysis = await self._detect_viral_content({})

            # 3. 竞争格局分析
            competitor_analysis = await self._analyze_competitors({})

            # 4. 生成战略建议
            strategic_recommendations = await self._generate_strategic_recommendations(
                trend_analysis, viral_analysis, competitor_analysis
            )

            # 5. 风险评估
            risk_assessment = await self._assess_market_risks(trend_analysis, competitor_analysis)

            # 6. 机会识别
            opportunity_analysis = await self._identify_market_opportunities(
                trend_analysis, viral_analysis
            )

            report = {
                "report_metadata": {
                    "generated_at": datetime.now().isoformat(),
                    "period": report_period,
                    "target_audience": target_audience,
                    "data_sources": ["xiaohongshu", "tavily", "ai_models"],
                    "confidence_level": "high"
                },
                "executive_summary": await self._generate_executive_summary(
                    trend_analysis, viral_analysis, competitor_analysis
                ),
                "trend_analysis": trend_analysis,
                "viral_content_insights": viral_analysis,
                "competitive_landscape": competitor_analysis,
                "strategic_recommendations": strategic_recommendations,
                "risk_assessment": risk_assessment,
                "opportunity_analysis": opportunity_analysis,
                "action_items": await self._generate_action_items(strategic_recommendations),
                "success_metrics": await self._define_success_metrics(),
                "next_steps": await self._define_next_steps()
            }

            return {"status": "success", "report": report}

        except Exception as e:
            logger.error(f"报告生成失败: {e}")
            return {"status": "error", "message": str(e)}

    async def _optimize_content_strategy(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """内容策略优化"""
        try:
            current_performance = params.get("current_performance", {})
            target_goals = params.get("target_goals", {})
            time_horizon = params.get("time_horizon", "30_days")

            # 1. 性能分析
            performance_analysis = await self._analyze_current_performance(current_performance)

            # 2. 目标差距分析
            gap_analysis = await self._analyze_performance_gaps(current_performance, target_goals)

            # 3. 策略优化建议
            optimization_strategy = await self._generate_optimization_strategy(
                performance_analysis, gap_analysis, time_horizon
            )

            # 4. 内容日历优化
            content_calendar_optimization = await self._optimize_content_calendar(optimization_strategy)

            # 5. 资源分配建议
            resource_allocation = await self._optimize_resource_allocation(optimization_strategy)

            return {
                "status": "success",
                "performance_analysis": performance_analysis,
                "gap_analysis": gap_analysis,
                "optimization_strategy": optimization_strategy,
                "content_calendar": content_calendar_optimization,
                "resource_allocation": resource_allocation,
                "expected_improvements": await self._predict_strategy_impact(optimization_strategy),
                "implementation_timeline": await self._create_implementation_timeline(optimization_strategy)
            }

        except Exception as e:
            logger.error(f"策略优化失败: {e}")
            return {"status": "error", "message": str(e)}

    # ========== 专业化AI算法实现 ==========

    async def _fetch_trending_topics(self) -> List[Dict[str, Any]]:
        """获取实时趋势话题"""
        # 使用MCP服务获取小红书热门话题
        trending_data = await self.mcp_client.call_tool("xiaohongshu-mcp", {
            "action": "get_trending_topics",
            "time_range": "24h",
            "category": "all"
        })

        return trending_data.get("topics", [])

    async def _analyze_topic_trend(self, topic: Dict[str, Any]) -> TrendData:
        """深度分析单个话题趋势"""
        topic_name = topic.get("name", "")

        # 1. 获取话题历史数据
        historical_data = await self._get_topic_history(topic_name)

        # 2. 使用AI分析趋势
        analysis_prompt = f"""
        分析小红书话题 "{topic_name}" 的趋势潜力：

        当前数据：{json.dumps(topic, ensure_ascii=False)}
        历史数据：{json.dumps(historical_data, ensure_ascii=False)}

        请从以下维度分析：
        1. 热度分数 (0-100)
        2. 增长率 (%)
        3. 潜力分数 (0-100)
        4. 相关关键词
        5. 推荐标签
        6. 最佳发布时间
        7. 推荐内容格式
        8. 预测表现指标

        返回JSON格式的分析结果。
        """

        analysis_result = await self.call_claude(analysis_prompt, max_tokens=2000)

        # 3. 解析AI分析结果
        try:
            analysis = json.loads(analysis_result)
        except:
            # 如果解析失败，使用基础分析
            analysis = await self._fallback_topic_analysis(topic, historical_data)

        # 4. 生成趋势数据
        return TrendData(
            topic=topic_name,
            heat_score=analysis.get("heat_score", 50),
            growth_rate=analysis.get("growth_rate", 0),
            potential_score=analysis.get("potential_score", 50),
            keywords=analysis.get("keywords", []),
            related_tags=analysis.get("related_tags", []),
            best_posting_time=analysis.get("best_posting_time", "19:00"),
            content_format=analysis.get("content_format", "图文"),
            competitor_analysis=analysis.get("competitor_analysis", {}),
            predicted_performance=analysis.get("predicted_performance", {})
        )

    async def _calculate_viral_score(self, content: Dict[str, Any]) -> float:
        """计算爆款分数 - 多因子AI模型"""
        # 1. 提取内容特征
        features = await self._extract_content_features(content)

        # 2. 使用训练好的模型预测
        if self.viral_classifier:
            viral_score = self.viral_classifier.predict(features)
        else:
            # 使用Claude进行爆款分数计算
            score_prompt = f"""
            分析以下小红书内容的爆款潜力 (0-100分)：

            标题：{content.get('title', '')}
            内容：{content.get('content', '')[:500]}...
            标签：{content.get('tags', [])}
            当前数据：{content.get('metrics', {})}

            请从以下维度评估：
            1. 内容质量 (20分)
            2. 话题热度 (15分)
            3. 情感共鸣 (20分)
            4. 实用价值 (15分)
            5. 视觉吸引力 (10分)
            6. 互动引导 (10分)
            7. 发布时机 (10分)

            返回0-100的爆款分数和简要分析。
            """

            result = await self.call_claude(score_prompt, max_tokens=500)
            viral_score = self._extract_score_from_text(result)

        return min(max(viral_score, 0), 100)  # 确保分数在0-100范围内

    async def _learn_from_feedback(self, feedback_data: Dict[str, Any]):
        """从反馈中学习 - 持续改进模型"""
        self.feedback_buffer.append(feedback_data)

        # 每50个反馈更新一次模型
        if len(self.feedback_buffer) >= 50:
            await self._update_models_with_feedback()
            self.feedback_buffer.clear()

    async def _update_models_with_feedback(self):
        """使用反馈更新模型"""
        feedback_data = self.feedback_buffer

        # 1. 分析反馈模式
        feedback_analysis = await self._analyze_feedback_patterns(feedback_data)

        # 2. 调整模型参数
        if feedback_analysis["accuracy_needs_improvement"]:
            await self._adjust_prediction_models(feedback_analysis)

        # 3. 更新权重配置
        await self._update_feature_weights(feedback_analysis)

        # 4. 记录性能改进
        new_performance = feedback_analysis["current_accuracy"]
        self.model_performance_history.append(new_performance)

        logger.info(f"模型更新完成，当前准确率: {new_performance:.2%}")

    # ========== 辅助方法 ==========

    def _serialize_trend_data(self, trend: TrendData) -> Dict[str, Any]:
        """序列化趋势数据"""
        return {
            "topic": trend.topic,
            "heat_score": trend.heat_score,
            "growth_rate": trend.growth_rate,
            "potential_score": trend.potential_score,
            "keywords": trend.keywords,
            "related_tags": trend.related_tags,
            "best_posting_time": trend.best_posting_time,
            "content_format": trend.content_format,
            "competitor_analysis": trend.competitor_analysis,
            "predicted_performance": trend.predicted_performance
        }

    def _serialize_viral_content(self, viral: ViralContent) -> Dict[str, Any]:
        """序列化爆款内容数据"""
        return {
            "content_id": viral.content_id,
            "title": viral.title,
            "content_text": viral.content_text,
            "tags": viral.tags,
            "engagement_metrics": viral.engagement_metrics,
            "viral_score": viral.viral_score,
            "success_factors": viral.success_factors,
            "replication_potential": viral.replication_potential,
            "improvement_suggestions": viral.improvement_suggestions
        }

    async def _get_status(self) -> Dict[str, Any]:
        """获取Agent状态"""
        base_status = super().get_status()

        # 添加专业指标
        professional_metrics = {
            "trend_analysis_accuracy": self.model_performance_history[-1] if self.model_performance_history else 0,
            "viral_detection_count": len(self.viral_content_db),
            "tracked_topics": len(self.trend_history),
            "feedback_buffer_size": len(self.feedback_buffer),
            "last_model_update": max(self.model_performance_history.index(x) for x in self.model_performance_history) if self.model_performance_history else 0,
            "active_models": {
                "prediction_model": self.prediction_model is not None,
                "viral_classifier": self.viral_classifier is not None
            }
        }

        base_status["professional_metrics"] = professional_metrics
        return base_status