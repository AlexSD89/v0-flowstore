"""
企业级监控和分析系统
提供深度业务洞察和决策支持，专为小红书AI自动化平台设计
"""

import time
import json
import asyncio
import statistics
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass, field
from enum import Enum
from collections import defaultdict, deque
import logging

# 假设的基础模型导入
from ..core.base_agent import BaseAIModel, Config

logger = logging.getLogger(__name__)


class MetricType(Enum):
    """指标类型"""
    COUNTER = "counter"           # 计数器
    GAUGE = "gauge"              # 瞬时值
    HISTOGRAM = "histogram"       # 直方图
    RATE = "rate"                # 比率


class AlertSeverity(Enum):
    """告警严重程度"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class TimeWindow(Enum):
    """时间窗口"""
    REALTIME = "realtime"        # 实时
    LAST_5_MIN = "5m"           # 最近5分钟
    LAST_15_MIN = "15m"         # 最近15分钟
    LAST_1_HOUR = "1h"          # 最近1小时
    LAST_24_HOUR = "24h"        # 最近24小时
    LAST_7_DAYS = "7d"          # 最近7天


@dataclass
class MetricDefinition:
    """指标定义"""
    name: str
    metric_type: MetricType
    description: str
    unit: str
    tags: Dict[str, str] = field(default_factory=dict)
    threshold: Optional[float] = None


@dataclass
class MetricValue:
    """指标值"""
    timestamp: float
    value: float
    labels: Dict[str, str] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return {
            'timestamp': self.timestamp,
            'value': self.value,
            'labels': self.labels
        }


@dataclass
class Alert:
    """告警"""
    id: str
    metric_name: str
    severity: AlertSeverity
    message: str
    current_value: float
    threshold: float
    timestamp: float
    labels: Dict[str, str] = field(default_factory=dict)
    resolved: bool = False

    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'metric_name': self.metric_name,
            'severity': self.severity.value,
            'message': self.message,
            'current_value': self.current_value,
            'threshold': self.threshold,
            'timestamp': self.timestamp,
            'labels': self.labels,
            'resolved': self.resolved
        }


@dataclass
class BusinessInsight:
    """业务洞察"""
    category: str                 # 洞察类别
    title: str                   # 洞察标题
    description: str             # 详细���述
    impact_level: str            # 影响程度 (high/medium/low)
    recommended_actions: List[str] = field(default_factory=list)
    data_points: Dict[str, Any] = field(default_factory=dict)
    timestamp: float = field(default_factory=time.time)

    def to_dict(self) -> Dict[str, Any]:
        return {
            'category': self.category,
            'title': self.title,
            'description': self.description,
            'impact_level': self.impact_level,
            'recommended_actions': self.recommended_actions,
            'data_points': self.data_points,
            'timestamp': self.timestamp
        }


class MetricsRegistry:
    """指标注册表"""

    def __init__(self, max_samples: int = 10000):
        self.max_samples = max_samples
        self.metrics: Dict[str, MetricDefinition] = {}
        self.values: Dict[str, deque] = defaultdict(lambda: deque(maxlen=max_samples))
        self.lock = asyncio.Lock()

    def register_metric(self, metric_def: MetricDefinition) -> bool:
        """注册指标"""
        try:
            self.metrics[metric_def.name] = metric_def
            logger.info(f"Registered metric: {metric_def.name}")
            return True
        except Exception as e:
            logger.error(f"Failed to register metric {metric_def.name}: {e}")
            return False

    def record_metric(self, name: str, value: float, labels: Optional[Dict[str, str]] = None) -> bool:
        """记录指标值"""
        try:
            if name not in self.metrics:
                logger.warning(f"Metric {name} not registered, auto-registering as gauge")
                self.register_metric(MetricDefinition(
                    name=name,
                    metric_type=MetricType.GAUGE,
                    description=f"Auto-registered metric {name}",
                    unit="unit"
                ))

            metric_value = MetricValue(
                timestamp=time.time(),
                value=value,
                labels=labels or {}
            )

            self.values[name].append(metric_value)
            return True
        except Exception as e:
            logger.error(f"Failed to record metric {name}: {e}")
            return False

    def get_metric_values(self, name: str, time_window: Optional[TimeWindow] = None) -> List[MetricValue]:
        """获取指标值"""
        try:
            values = list(self.values.get(name, []))

            if time_window:
                current_time = time.time()
                window_seconds = self._get_window_seconds(time_window)
                cutoff_time = current_time - window_seconds
                values = [v for v in values if v.timestamp >= cutoff_time]

            return sorted(values, key=lambda x: x.timestamp)
        except Exception as e:
            logger.error(f"Failed to get metric values {name}: {e}")
            return []

    def _get_window_seconds(self, window: TimeWindow) -> int:
        """获取时间窗口秒数"""
        mapping = {
            TimeWindow.REALTIME: 60,      # 1分钟
            TimeWindow.LAST_5_MIN: 300,
            TimeWindow.LAST_15_MIN: 900,
            TimeWindow.LAST_1_HOUR: 3600,
            TimeWindow.LAST_24_HOUR: 86400,
            TimeWindow.LAST_7_DAYS: 604800
        }
        return mapping.get(window, 300)


class AlertManager:
    """告警管理器"""

    def __init__(self):
        self.alert_rules: Dict[str, Dict] = {}
        self.active_alerts: Dict[str, Alert] = {}
        self.alert_history: List[Alert] = []
        self.lock = asyncio.Lock()

    def add_alert_rule(self, metric_name: str, condition: str, severity: AlertSeverity,
                      threshold: float, message_template: str) -> bool:
        """添加告警规则"""
        try:
            rule_id = f"{metric_name}_{condition}_{severity.value}"
            self.alert_rules[rule_id] = {
                'metric_name': metric_name,
                'condition': condition,
                'severity': severity,
                'threshold': threshold,
                'message_template': message_template
            }
            logger.info(f"Added alert rule: {rule_id}")
            return True
        except Exception as e:
            logger.error(f"Failed to add alert rule: {e}")
            return False

    async def evaluate_alerts(self, metrics_registry: MetricsRegistry) -> List[Alert]:
        """评估告警"""
        triggered_alerts = []

        try:
            async with self.lock:
                for rule_id, rule in self.alert_rules.items():
                    metric_name = rule['metric_name']
                    values = metrics_registry.get_metric_values(
                        metric_name,
                        TimeWindow.LAST_15_MIN
                    )

                    if not values:
                        continue

                    latest_value = values[-1].value
                    threshold = rule['threshold']
                    condition = rule['condition']

                    should_alert = self._evaluate_condition(latest_value, condition, threshold)

                    if should_alert:
                        if rule_id not in self.active_alerts:
                            alert = Alert(
                                id=rule_id,
                                metric_name=metric_name,
                                severity=rule['severity'],
                                message=rule['message_template'].format(
                                    metric=metric_name,
                                    value=latest_value,
                                    threshold=threshold
                                ),
                                current_value=latest_value,
                                threshold=threshold,
                                timestamp=time.time()
                            )

                            self.active_alerts[rule_id] = alert
                            self.alert_history.append(alert)
                            triggered_alerts.append(alert)
                            logger.warning(f"Alert triggered: {alert.message}")
                    else:
                        if rule_id in self.active_alerts:
                            self.active_alerts[rule_id].resolved = True
                            del self.active_alerts[rule_id]
                            logger.info(f"Alert resolved: {rule_id}")

                return triggered_alerts

        except Exception as e:
            logger.error(f"Failed to evaluate alerts: {e}")
            return []

    def _evaluate_condition(self, value: float, condition: str, threshold: float) -> bool:
        """评估条件"""
        try:
            if condition == "gt":
                return value > threshold
            elif condition == "lt":
                return value < threshold
            elif condition == "gte":
                return value >= threshold
            elif condition == "lte":
                return value <= threshold
            elif condition == "eq":
                return abs(value - threshold) < 1e-6
            else:
                logger.warning(f"Unknown condition: {condition}")
                return False
        except Exception as e:
            logger.error(f"Failed to evaluate condition: {e}")
            return False

    def get_active_alerts(self) -> List[Alert]:
        """获取活跃告警"""
        return list(self.active_alerts.values())

    def get_alert_history(self, limit: int = 100) -> List[Alert]:
        """获取告警历史"""
        return sorted(self.alert_history, key=lambda x: x.timestamp, reverse=True)[:limit]


class BusinessInsightGenerator:
    """业务洞察生成器"""

    def __init__(self):
        self.insight_patterns = self._init_insight_patterns()

    def _init_insight_patterns(self) -> Dict[str, Dict]:
        """初始化洞察模式"""
        return {
            'viral_content_decline': {
                'condition': lambda metrics: self._check_viral_content_decline(metrics),
                'title': '爆款内容率下降',
                'category': 'content_performance',
                'impact': 'high',
                'description': '爆款内容率低于正常水平，可能影响平台整体表现',
                'actions': [
                    '检查内容创作策略',
                    '分析爆款内容特征',
                    '优化内容推荐算法',
                    '加强创作者激励'
                ]
            },
            'engagement_drop': {
                'condition': lambda metrics: self._check_engagement_drop(metrics),
                'title': '用户互动率下降',
                'category': 'user_engagement',
                'impact': 'medium',
                'description': '用户互动率出现明显下降，需要关注用户体验',
                'actions': [
                    '分析互动下降的具体原因',
                    '优化内容推荐策略',
                    '改善用户界面体验',
                    '增加互动功能设计'
                ]
            },
            'trend_prediction_accuracy_low': {
                'condition': lambda metrics: self._check_trend_prediction_accuracy(metrics),
                'title': '趋势预测准确率偏低',
                'category': 'ai_performance',
                'impact': 'medium',
                'description': 'AI趋势预测准确率低于目标值，需要优化算法',
                'actions': [
                    '重新训练预测模型',
                    '增加特征工程',
                    '调整算法参数',
                    '扩充训练数据集'
                ]
            },
            'brand_alignment_improvement': {
                'condition': lambda metrics: self._check_brand_alignment_improvement(metrics),
                'title': '品牌调性匹配度提升',
                'category': 'content_quality',
                'impact': 'positive',
                'description': '品牌调性匹配度显著提升，内容质量改善',
                'actions': [
                    '保持当前策略',
                    '分享最佳实践',
                    '扩大应用范围',
                    '设置更高目标'
                ]
            }
        }

    async def generate_insights(self, metrics_registry: MetricsRegistry) -> List[BusinessInsight]:
        """生成业务洞察"""
        insights = []

        try:
            # 收集关键指标
            metrics = self._collect_key_metrics(metrics_registry)

            # 评估各种洞察模式
            for pattern_name, pattern in self.insight_patterns.items():
                try:
                    if pattern['condition'](metrics):
                        insight = BusinessInsight(
                            category=pattern['category'],
                            title=pattern['title'],
                            description=pattern['description'],
                            impact_level=pattern['impact'],
                            recommended_actions=pattern['actions'],
                            data_points=metrics
                        )
                        insights.append(insight)
                        logger.info(f"Generated insight: {pattern['title']}")
                except Exception as e:
                    logger.error(f"Failed to evaluate pattern {pattern_name}: {e}")

            return insights

        except Exception as e:
            logger.error(f"Failed to generate insights: {e}")
            return []

    def _collect_key_metrics(self, metrics_registry: MetricsRegistry) -> Dict[str, Any]:
        """收集关键指标"""
        metrics = {}

        # 小红书核心业务指标
        key_metrics = [
            'viral_content_rate',
            'engagement_rate',
            'trend_prediction_accuracy',
            'brand_personality_alignment',
            'content_quality_score',
            'user_satisfaction_score',
            'ai_model_accuracy',
            'response_time_ms',
            'system_availability'
        ]

        for metric_name in key_metrics:
            values = metrics_registry.get_metric_values(metric_name, TimeWindow.LAST_24_HOUR)
            if values:
                latest_value = values[-1].value
                metrics[metric_name] = latest_value

                # 计算趋势
                if len(values) >= 2:
                    previous_value = values[-2].value
                    trend = ((latest_value - previous_value) / previous_value) * 100
                    metrics[f"{metric_name}_trend"] = trend

        return metrics

    def _check_viral_content_decline(self, metrics: Dict[str, Any]) -> bool:
        """检查爆款内容率下降"""
        if 'viral_content_rate' in metrics:
            rate = metrics['viral_content_rate']
            return rate < 0.05  # 低于5%认为下降
        return False

    def _check_engagement_drop(self, metrics: Dict[str, Any]) -> bool:
        """检查互动率下降"""
        if 'engagement_rate_trend' in metrics:
            trend = metrics['engagement_rate_trend']
            return trend < -10  # 下降超过10%
        return False

    def _check_trend_prediction_accuracy(self, metrics: Dict[str, Any]) -> bool:
        """检查趋势预测准确率"""
        if 'trend_prediction_accuracy' in metrics:
            accuracy = metrics['trend_prediction_accuracy']
            return accuracy < 0.85  # 低于85%
        return False

    def _check_brand_alignment_improvement(self, metrics: Dict[str, Any]) -> bool:
        """检查品牌调性匹配度改善"""
        if 'brand_personality_alignment_trend' in metrics:
            trend = metrics['brand_personality_alignment_trend']
            return trend > 5  # 提升超过5%
        return False


class MonitoringDashboard:
    """监控仪表板"""

    def __init__(self, config: Optional[Config] = None):
        super().__init__("monitoring_dashboard_v3.0", config)

        # 核心组件
        self.metrics_registry = MetricsRegistry(max_samples=10000)
        self.alert_manager = AlertManager()
        self.insight_generator = BusinessInsightGenerator()

        # 配置参数
        self.collection_interval = self.config.get("collection_interval", 60)  # 秒
        self.alert_evaluation_interval = self.config.get("alert_evaluation_interval", 300)  # 秒
        self.insight_generation_interval = self.config.get("insight_generation_interval", 3600)  # 秒

        # 运行状态
        self.is_running = False
        self.collection_task: Optional[asyncio.Task] = None
        self.alert_task: Optional[asyncio.Task] = None
        self.insight_task: Optional[asyncio.Task] = None

        # 数据缓存
        self.dashboard_cache: Dict[str, Any] = {}
        self.cache_expiry = 300  # 5分钟缓存

        self.logger = logger

        # 初始化指标和告警
        self._setup_metrics()
        self._setup_alerts()

    def _setup_metrics(self) -> None:
        """设置监控指标"""
        # 小红书业务指标
        business_metrics = [
            MetricDefinition(
                name="viral_content_rate",
                metric_type=MetricType.GAUGE,
                description="爆款内容率",
                unit="percentage",
                threshold=0.05
            ),
            MetricDefinition(
                name="engagement_rate",
                metric_type=MetricType.GAUGE,
                description="用户互动率",
                unit="percentage",
                threshold=0.03
            ),
            MetricDefinition(
                name="content_creation_volume",
                metric_type=MetricType.COUNTER,
                description="内容创作量",
                unit="count"
            ),
            MetricDefinition(
                name="user_growth_rate",
                metric_type=MetricType.RATE,
                description="用户增长率",
                unit="percentage"
            ),
            MetricDefinition(
                name="trend_prediction_accuracy",
                metric_type=MetricType.GAUGE,
                description="趋势预测准确率",
                unit="percentage",
                threshold=0.90
            ),
            MetricDefinition(
                name="brand_personality_alignment",
                metric_type=MetricType.GAUGE,
                description="品牌调性匹配度",
                unit="percentage",
                threshold=0.95
            ),
            MetricDefinition(
                name="content_quality_score",
                metric_type=MetricType.GAUGE,
                description="内容质量评分",
                unit="score",
                threshold=0.80
            ),
            MetricDefinition(
                name="user_satisfaction_score",
                metric_type=MetricType.GAUGE,
                description="用户满意度评分",
                unit="score",
                threshold=4.0
            )
        ]

        # AI系统性能指标
        performance_metrics = [
            MetricDefinition(
                name="ai_model_accuracy",
                metric_type=MetricType.GAUGE,
                description="AI模型准确率",
                unit="percentage",
                threshold=0.95
            ),
            MetricDefinition(
                name="response_time_ms",
                metric_type=MetricType.HISTOGRAM,
                description="响应时间",
                unit="milliseconds",
                threshold=1000.0
            ),
            MetricDefinition(
                name="system_availability",
                metric_type=MetricType.GAUGE,
                description="系统可用性",
                unit="percentage",
                threshold=0.99
            ),
            MetricDefinition(
                name="api_request_rate",
                metric_type=MetricType.RATE,
                description="API请求率",
                unit="requests_per_second"
            ),
            MetricDefinition(
                name="error_rate",
                metric_type=MetricType.RATE,
                description="错误率",
                unit="percentage",
                threshold=0.01
            ),
            MetricDefinition(
                name="resource_utilization",
                metric_type=MetricType.GAUGE,
                description="资源利用率",
                unit="percentage",
                threshold=0.80
            )
        ]

        # 注册所有指标
        all_metrics = business_metrics + performance_metrics
        for metric_def in all_metrics:
            self.metrics_registry.register_metric(metric_def)

    def _setup_alerts(self) -> None:
        """设置告警规则"""
        # 业务告警
        self.alert_manager.add_alert_rule(
            metric_name="viral_content_rate",
            condition="lt",
            severity=AlertSeverity.HIGH,
            threshold=0.03,
            message_template="爆款内容率过低: {value:.2%} < {threshold:.2%}"
        )

        self.alert_manager.add_alert_rule(
            metric_name="engagement_rate",
            condition="lt",
            severity=AlertSeverity.MEDIUM,
            threshold=0.02,
            message_template="用户互动率下降: {value:.2%} < {threshold:.2%}"
        )

        self.alert_manager.add_alert_rule(
            metric_name="trend_prediction_accuracy",
            condition="lt",
            severity=AlertSeverity.MEDIUM,
            threshold=0.85,
            message_template="趋势预测准确率偏低: {value:.2%} < {threshold:.2%}"
        )

        # 性能告警
        self.alert_manager.add_alert_rule(
            metric_name="ai_model_accuracy",
            condition="lt",
            severity=AlertSeverity.HIGH,
            threshold=0.90,
            message_template="AI模型准确率过低: {value:.2%} < {threshold:.2%}"
        )

        self.alert_manager.add_alert_rule(
            metric_name="response_time_ms",
            condition="gt",
            severity=AlertSeverity.MEDIUM,
            threshold=2000.0,
            message_template="响应时间过长: {value:.0f}ms > {threshold:.0f}ms"
        )

        self.alert_manager.add_alert_rule(
            metric_name="system_availability",
            condition="lt",
            severity=AlertSeverity.CRITICAL,
            threshold=0.99,
            message_template="系统可用性过低: {value:.2%} < {threshold:.2%}"
        )

        self.alert_manager.add_alert_rule(
            metric_name="error_rate",
            condition="gt",
            severity=AlertSeverity.HIGH,
            threshold=0.05,
            message_template="错误率过高: {value:.2%} > {threshold:.2%}"
        )

    async def start(self) -> bool:
        """启动监控仪表板"""
        try:
            if self.is_running:
                self.logger.warning("Monitoring dashboard is already running")
                return True

            self.is_running = True

            # 启动数据收集任务
            self.collection_task = asyncio.create_task(self._collect_metrics_loop())

            # 启动告警评估任务
            self.alert_task = asyncio.create_task(self._evaluate_alerts_loop())

            # 启动洞察生成任务
            self.insight_task = asyncio.create_task(self._generate_insights_loop())

            self.logger.info("Monitoring dashboard started successfully")
            return True

        except Exception as e:
            self.logger.error(f"Failed to start monitoring dashboard: {e}")
            self.is_running = False
            return False

    async def stop(self) -> bool:
        """停止监控仪表板"""
        try:
            self.is_running = False

            # 取消所有任务
            tasks = [self.collection_task, self.alert_task, self.insight_task]
            for task in tasks:
                if task and not task.done():
                    task.cancel()
                    try:
                        await task
                    except asyncio.CancelledError:
                        pass

            self.logger.info("Monitoring dashboard stopped successfully")
            return True

        except Exception as e:
            self.logger.error(f"Failed to stop monitoring dashboard: {e}")
            return False

    async def _collect_metrics_loop(self) -> None:
        """指标收集循环"""
        while self.is_running:
            try:
                await self._collect_system_metrics()
                await asyncio.sleep(self.collection_interval)
            except asyncio.CancelledError:
                break
            except Exception as e:
                self.logger.error(f"Error in metrics collection loop: {e}")
                await asyncio.sleep(60)  # 错误时等待1分钟

    async def _evaluate_alerts_loop(self) -> None:
        """告警评估循环"""
        while self.is_running:
            try:
                await self.alert_manager.evaluate_alerts(self.metrics_registry)
                await asyncio.sleep(self.alert_evaluation_interval)
            except asyncio.CancelledError:
                break
            except Exception as e:
                self.logger.error(f"Error in alert evaluation loop: {e}")
                await asyncio.sleep(60)

    async def _generate_insights_loop(self) -> None:
        """洞察生成循环"""
        while self.is_running:
            try:
                insights = await self.insight_generator.generate_insights(self.metrics_registry)
                if insights:
                    self.logger.info(f"Generated {len(insights)} business insights")
                await asyncio.sleep(self.insight_generation_interval)
            except asyncio.CancelledError:
                break
            except Exception as e:
                self.logger.error(f"Error in insight generation loop: {e}")
                await asyncio.sleep(60)

    async def _collect_system_metrics(self) -> None:
        """收集系统指标"""
        try:
            current_time = time.time()

            # 这里应该实际收集系统指标
            # 为了演示，我们生成一些模拟数据

            # 小红书业务指标（模拟）
            viral_content_rate = 0.08 + (current_time % 100) / 1000  # 8-18%
            engagement_rate = 0.045 + (current_time % 50) / 1000  # 4.5-9.5%
            trend_accuracy = 0.92 + (current_time % 30) / 1000   # 92-95%
            brand_alignment = 0.96 + (current_time % 20) / 1000  # 96-98%

            self.metrics_registry.record_metric("viral_content_rate", viral_content_rate)
            self.metrics_registry.record_metric("engagement_rate", engagement_rate)
            self.metrics_registry.record_metric("trend_prediction_accuracy", trend_accuracy)
            self.metrics_registry.record_metric("brand_personality_alignment", brand_alignment)

            # 系统性能指标（模拟）
            ai_model_accuracy = 0.94 + (current_time % 40) / 1000
            response_time = 800 + (current_time % 400)
            system_availability = 0.995 + (current_time % 10) / 1000
            error_rate = 0.005 + (current_time % 20) / 10000

            self.metrics_registry.record_metric("ai_model_accuracy", ai_model_accuracy)
            self.metrics_registry.record_metric("response_time_ms", response_time)
            self.metrics_registry.record_metric("system_availability", system_availability)
            self.metrics_registry.record_metric("error_rate", error_rate)

        except Exception as e:
            self.logger.error(f"Failed to collect system metrics: {e}")

    def get_dashboard_data(self, time_window: TimeWindow = TimeWindow.LAST_24_HOUR) -> Dict[str, Any]:
        """获取仪表板数据"""
        try:
            current_time = time.time()

            # 检查缓存
            if (self.dashboard_cache and
                current_time - self.dashboard_cache.get('timestamp', 0) < self.cache_expiry):
                return self.dashboard_cache['data']

            # 收集指标数据
            metrics_data = {}
            for metric_name in self.metrics_registry.metrics.keys():
                values = self.metrics_registry.get_metric_values(metric_name, time_window)
                if values:
                    latest = values[-1].value

                    # 计算统计信息
                    if len(values) > 1:
                        values_list = [v.value for v in values]
                        metrics_data[metric_name] = {
                            'current': latest,
                            'min': min(values_list),
                            'max': max(values_list),
                            'avg': statistics.mean(values_list),
                            'trend': ((latest - values[-2].value) / values[-2].value) * 100 if len(values) >= 2 else 0,
                            'count': len(values)
                        }
                    else:
                        metrics_data[metric_name] = {
                            'current': latest,
                            'min': latest,
                            'max': latest,
                            'avg': latest,
                            'trend': 0,
                            'count': 1
                        }

            # 获取告警数据
            active_alerts = [alert.to_dict() for alert in self.alert_manager.get_active_alerts()]
            recent_alerts = [alert.to_dict() for alert in self.alert_manager.get_alert_history(10)]

            # 获取洞察数据（这里简化处理）
            insights = []

            dashboard_data = {
                'timestamp': current_time,
                'time_window': time_window.value,
                'metrics': metrics_data,
                'alerts': {
                    'active': active_alerts,
                    'recent': recent_alerts,
                    'active_count': len(active_alerts),
                    'total_count': len(self.alert_manager.alert_history)
                },
                'insights': [insight.to_dict() for insight in insights],
                'summary': self._generate_summary(metrics_data, active_alerts)
            }

            # 更新缓存
            self.dashboard_cache = {
                'timestamp': current_time,
                'data': dashboard_data
            }

            return dashboard_data

        except Exception as e:
            self.logger.error(f"Failed to get dashboard data: {e}")
            return {'error': str(e)}

    def _generate_summary(self, metrics_data: Dict[str, Any], active_alerts: List[Dict]) -> Dict[str, Any]:
        """生成摘要信息"""
        try:
            summary = {
                'overall_health': 'good',  # good/warning/critical
                'key_metrics': {},
                'critical_issues': [],
                'recommendations': []
            }

            # 分析关键指标
            key_metric_names = [
                'viral_content_rate',
                'engagement_rate',
                'trend_prediction_accuracy',
                'ai_model_accuracy',
                'system_availability'
            ]

            for metric_name in key_metric_names:
                if metric_name in metrics_data:
                    metric_info = metrics_data[metric_name]
                    current_value = metric_info['current']
                    trend = metric_info['trend']

                    # 获取阈值
                    metric_def = self.metrics_registry.metrics.get(metric_name)
                    threshold = metric_def.threshold if metric_def else None

                    summary['key_metrics'][metric_name] = {
                        'value': current_value,
                        'trend': trend,
                        'status': 'good'
                    }

                    # 评估状态
                    if threshold:
                        if metric_def.metric_type == MetricType.GAUGE:
                            if current_value < threshold * 0.8:
                                summary['key_metrics'][metric_name]['status'] = 'warning'
                                if summary['overall_health'] == 'good':
                                    summary['overall_health'] = 'warning'
                            elif current_value < threshold * 0.5:
                                summary['key_metrics'][metric_name]['status'] = 'critical'
                                summary['overall_health'] = 'critical'

            # 分析活跃告警
            critical_alerts = [alert for alert in active_alerts if alert['severity'] == 'critical']
            high_alerts = [alert for alert in active_alerts if alert['severity'] == 'high']

            if critical_alerts:
                summary['overall_health'] = 'critical'
                summary['critical_issues'] = [alert['message'] for alert in critical_alerts]
            elif high_alerts:
                summary['overall_health'] = 'warning'
                summary['critical_issues'] = [alert['message'] for alert in high_alerts]

            # 生成建议
            if summary['overall_health'] != 'good':
                summary['recommendations'] = [
                    '检查系统日志以获取详细错误信息',
                    '联系技术团队进行故障排查',
                    '考虑启动应急响应预案'
                ]

            return summary

        except Exception as e:
            self.logger.error(f"Failed to generate summary: {e}")
            return {'error': str(e)}

    def get_metric_history(self, metric_name: str, time_window: TimeWindow = TimeWindow.LAST_24_HOUR) -> List[Dict[str, Any]]:
        """获取指标历史数据"""
        try:
            values = self.metrics_registry.get_metric_values(metric_name, time_window)
            return [value.to_dict() for value in values]
        except Exception as e:
            self.logger.error(f"Failed to get metric history for {metric_name}: {e}")
            return []

    async def record_custom_metric(self, name: str, value: float, labels: Optional[Dict[str, str]] = None) -> bool:
        """记录自定义指标"""
        return self.metrics_registry.record_metric(name, value, labels)

    def get_system_health(self) -> Dict[str, Any]:
        """获取系统健康状态"""
        try:
            dashboard_data = self.get_dashboard_data(TimeWindow.LAST_5_MIN)
            summary = dashboard_data.get('summary', {})

            return {
                'status': summary.get('overall_health', 'unknown'),
                'active_alerts_count': len(self.alert_manager.get_active_alerts()),
                'last_update': time.time(),
                'uptime': time.time() - (self.start_time if hasattr(self, 'start_time') else time.time()),
                'services': {
                    'metrics_collection': 'running' if self.is_running else 'stopped',
                    'alert_evaluation': 'running' if self.is_running else 'stopped',
                    'insight_generation': 'running' if self.is_running else 'stopped'
                }
            }
        except Exception as e:
            self.logger.error(f"Failed to get system health: {e}")
            return {'status': 'error', 'error': str(e)}