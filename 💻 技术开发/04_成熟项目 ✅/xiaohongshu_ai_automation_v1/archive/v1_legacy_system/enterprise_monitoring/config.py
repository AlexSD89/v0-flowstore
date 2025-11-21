"""
企业级监控系统配置
包含监控指标定义、告警规则、可视化配置等
"""

from typing import Dict, Any, List
from dataclasses import dataclass
from enum import Enum

from .monitoring_dashboard import MetricType, AlertSeverity, TimeWindow


@dataclass
class MonitoringConfig:
    """监控配置"""
    # 基础配置
    collection_interval: int = 60          # 数据收集间隔(秒)
    alert_evaluation_interval: int = 300   # 告警评估间隔(秒)
    insight_generation_interval: int = 3600 # 洞察生成间隔(秒)
    cache_expiry: int = 300                # 缓存过期时间(秒)
    max_samples: int = 10000              # 最大样本数

    # 小红书业务配置
    viral_content_threshold: float = 0.05     # 爆款内容率阈值
    engagement_rate_threshold: float = 0.03   # 互动率阈值
    content_quality_threshold: float = 0.80   # 内容质量阈值
    user_satisfaction_threshold: float = 4.0  # 用户满意度阈值

    # AI性能配置
    ai_accuracy_threshold: float = 0.95       # AI准确率阈值
    response_time_threshold: float = 1000.0   # 响应时间阈值(ms)
    system_availability_threshold: float = 0.99 # 系统可用性阈值
    error_rate_threshold: float = 0.01        # 错误率阈值

    # 告警配置
    alert_cooldown: int = 900               # 告警冷却时间(秒)
    max_alerts_per_hour: int = 20           # 每小时最大告警数
    alert_retention_days: int = 30          # 告警保留天数

    # 可视化配置
    dashboard_refresh_interval: int = 30    # 仪表板刷新间隔(秒)
    chart_data_points: int = 100           # 图表数据点数
    export_format: str = "json"            # 导出格式

    # 集成配置
    enable_webhook: bool = False           # 启用Webhook通知
    webhook_url: str = ""                  # Webhook URL
    enable_email: bool = False            # 启用邮件通知
    email_recipients: List[str] = None    # 邮件接收者列表

    def __post_init__(self):
        if self.email_recipients is None:
            self.email_recipients = []


class XiaohongshuMetrics:
    """小红书专用监控指标定义"""

    @staticmethod
    def get_business_metrics() -> List[Dict[str, Any]]:
        """获取业务指标定义"""
        return [
            {
                "name": "viral_content_rate",
                "type": MetricType.GAUGE,
                "description": "爆款内容率",
                "unit": "percentage",
                "threshold": 0.05,
                "category": "content_performance",
                "tags": {"platform": "xiaohongshu", "type": "business"}
            },
            {
                "name": "engagement_rate",
                "type": MetricType.GAUGE,
                "description": "用户互动率",
                "unit": "percentage",
                "threshold": 0.03,
                "category": "user_engagement",
                "tags": {"platform": "xiaohongshu", "type": "business"}
            },
            {
                "name": "content_creation_volume",
                "type": MetricType.COUNTER,
                "description": "内容创作量",
                "unit": "count",
                "category": "content_creation",
                "tags": {"platform": "xiaohongshu", "type": "business"}
            },
            {
                "name": "user_growth_rate",
                "type": MetricType.RATE,
                "description": "用户增长率",
                "unit": "percentage",
                "category": "user_growth",
                "tags": {"platform": "xiaohongshu", "type": "business"}
            },
            {
                "name": "trend_prediction_accuracy",
                "type": MetricType.GAUGE,
                "description": "趋势预测准确率",
                "unit": "percentage",
                "threshold": 0.90,
                "category": "ai_performance",
                "tags": {"platform": "xiaohongshu", "type": "ai"}
            },
            {
                "name": "brand_personality_alignment",
                "type": MetricType.GAUGE,
                "description": "品牌调性匹配度",
                "unit": "percentage",
                "threshold": 0.95,
                "category": "content_quality",
                "tags": {"platform": "xiaohongshu", "type": "ai"}
            },
            {
                "name": "content_quality_score",
                "type": MetricType.GAUGE,
                "description": "内容质量评分",
                "unit": "score",
                "threshold": 0.80,
                "category": "content_quality",
                "tags": {"platform": "xiaohongshu", "type": "quality"}
            },
            {
                "name": "user_satisfaction_score",
                "type": MetricType.GAUGE,
                "description": "用户满意度评分",
                "unit": "score",
                "threshold": 4.0,
                "category": "user_experience",
                "tags": {"platform": "xiaohongshu", "type": "quality"}
            },
            {
                "name": "conversion_rate",
                "type": MetricType.GAUGE,
                "description": "转化率",
                "unit": "percentage",
                "threshold": 0.02,
                "category": "business_metrics",
                "tags": {"platform": "xiaohongshu", "type": "conversion"}
            },
            {
                "name": "average_session_duration",
                "type": MetricType.GAUGE,
                "description": "平均会话时长",
                "unit": "seconds",
                "threshold": 300,
                "category": "user_engagement",
                "tags": {"platform": "xiaohongshu", "type": "engagement"}
            }
        ]

    @staticmethod
    def get_technical_metrics() -> List[Dict[str, Any]]:
        """获取技术指标定义"""
        return [
            {
                "name": "ai_model_accuracy",
                "type": MetricType.GAUGE,
                "description": "AI模型准确率",
                "unit": "percentage",
                "threshold": 0.95,
                "category": "ai_performance",
                "tags": {"component": "ai_engine", "type": "performance"}
            },
            {
                "name": "response_time_ms",
                "type": MetricType.HISTOGRAM,
                "description": "响应时间",
                "unit": "milliseconds",
                "threshold": 1000.0,
                "category": "performance",
                "tags": {"component": "api", "type": "latency"}
            },
            {
                "name": "system_availability",
                "type": MetricType.GAUGE,
                "description": "系统可用性",
                "unit": "percentage",
                "threshold": 0.99,
                "category": "availability",
                "tags": {"component": "system", "type": "uptime"}
            },
            {
                "name": "api_request_rate",
                "type": MetricType.RATE,
                "description": "API请求率",
                "unit": "requests_per_second",
                "category": "throughput",
                "tags": {"component": "api", "type": "traffic"}
            },
            {
                "name": "error_rate",
                "type": MetricType.RATE,
                "description": "错误率",
                "unit": "percentage",
                "threshold": 0.01,
                "category": "reliability",
                "tags": {"component": "system", "type": "errors"}
            },
            {
                "name": "resource_utilization",
                "type": MetricType.GAUGE,
                "description": "资源利用率",
                "unit": "percentage",
                "threshold": 0.80,
                "category": "resources",
                "tags": {"component": "infrastructure", "type": "utilization"}
            },
            {
                "name": "cache_hit_rate",
                "type": MetricType.GAUGE,
                "description": "缓存命中率",
                "unit": "percentage",
                "threshold": 0.90,
                "category": "performance",
                "tags": {"component": "cache", "type": "efficiency"}
            },
            {
                "name": "database_connection_pool",
                "type": MetricType.GAUGE,
                "description": "数据库连接池使用率",
                "unit": "percentage",
                "threshold": 0.80,
                "category": "database",
                "tags": {"component": "database", "type": "connections"}
            },
            {
                "name": "queue_size",
                "type": MetricType.GAUGE,
                "description": "消息队列大小",
                "unit": "count",
                "threshold": 1000,
                "category": "messaging",
                "tags": {"component": "queue", "type": "backlog"}
            },
            {
                "name": "processing_time_avg",
                "type": MetricType.HISTOGRAM,
                "description": "平均处理时间",
                "unit": "milliseconds",
                "threshold": 500.0,
                "category": "performance",
                "tags": {"component": "workers", "type": "latency"}
            }
        ]


class AlertRules:
    """告警规则定义"""

    @staticmethod
    def get_business_alerts() -> List[Dict[str, Any]]:
        """获取业务告警规则"""
        return [
            {
                "name": "viral_content_rate_low",
                "metric": "viral_content_rate",
                "condition": "lt",
                "threshold": 0.03,
                "severity": AlertSeverity.HIGH,
                "message": "爆款内容率过低: {value:.2%} < {threshold:.2%}",
                "description": "爆款内容率低于3%，可能影响平台整体表现",
                "actions": ["检查内容策略", "优化推荐算法", "加强创作者激励"]
            },
            {
                "name": "engagement_rate_drop",
                "metric": "engagement_rate",
                "condition": "lt",
                "threshold": 0.02,
                "severity": AlertSeverity.MEDIUM,
                "message": "用户互动率下降: {value:.2%} < {threshold:.2%}",
                "description": "用户互动率低于2%，需要关注用户体验",
                "actions": ["分析互动下降原因", "优化推荐策略", "改善用户界面"]
            },
            {
                "name": "trend_accuracy_low",
                "metric": "trend_prediction_accuracy",
                "condition": "lt",
                "threshold": 0.85,
                "severity": AlertSeverity.MEDIUM,
                "message": "趋势预测准确率偏低: {value:.2%} < {threshold:.2%}",
                "description": "AI趋势预测准确率低于85%",
                "actions": ["重新训练模型", "调整算法参数", "扩充训练数据"]
            },
            {
                "name": "brand_alignment_drop",
                "metric": "brand_personality_alignment",
                "condition": "lt",
                "threshold": 0.90,
                "severity": AlertSeverity.MEDIUM,
                "message": "品牌调性匹配度下降: {value:.2%} < {threshold:.2%}",
                "description": "品牌调性匹配度低于90%",
                "actions": ["检查品牌分析模型", "更新品牌画像", "优化匹配算法"]
            },
            {
                "name": "user_satisfaction_low",
                "metric": "user_satisfaction_score",
                "condition": "lt",
                "threshold": 3.5,
                "severity": AlertSeverity.HIGH,
                "message": "用户满意度评分过低: {value:.1f} < {threshold:.1f}",
                "description": "用户满意度评分低于3.5分",
                "actions": ["收集用户反馈", "分析满意度问题", "制定改进方案"]
            }
        ]

    @staticmethod
    def get_technical_alerts() -> List[Dict[str, Any]]:
        """获取技术告警规则"""
        return [
            {
                "name": "ai_accuracy_degraded",
                "metric": "ai_model_accuracy",
                "condition": "lt",
                "threshold": 0.90,
                "severity": AlertSeverity.HIGH,
                "message": "AI模型准确率过低: {value:.2%} < {threshold:.2%}",
                "description": "AI模型准确率低于90%，可能影响内容质量",
                "actions": ["检查模型状态", "重新训练模型", "回滚到稳定版本"]
            },
            {
                "name": "response_time_high",
                "metric": "response_time_ms",
                "condition": "gt",
                "threshold": 2000.0,
                "severity": AlertSeverity.MEDIUM,
                "message": "响应时间过长: {value:.0f}ms > {threshold:.0f}ms",
                "description": "系统响应时间超过2秒",
                "actions": ["检查系统负载", "优化代码性能", "增加资源"]
            },
            {
                "name": "system_unavailable",
                "metric": "system_availability",
                "condition": "lt",
                "threshold": 0.99,
                "severity": AlertSeverity.CRITICAL,
                "message": "系统可用性过低: {value:.2%} < {threshold:.2%}",
                "description": "系统可用性低于99%",
                "actions": ["立即检查系统状态", "启动故障恢复", "通知运维团队"]
            },
            {
                "name": "error_rate_high",
                "metric": "error_rate",
                "condition": "gt",
                "threshold": 0.05,
                "severity": AlertSeverity.HIGH,
                "message": "错误率过高: {value:.2%} > {threshold:.2%}",
                "description": "系统错误率超过5%",
                "actions": ["检查错误日志", "定位问题根因", "紧急修复"]
            },
            {
                "name": "resource_utilization_high",
                "metric": "resource_utilization",
                "condition": "gt",
                "threshold": 0.90,
                "severity": AlertSeverity.MEDIUM,
                "message": "资源利用率过高: {value:.1%} > {threshold:.1%}",
                "description": "系统资源利用率超过90%",
                "actions": ["检查资源使用", "优化资源分配", "考虑扩容"]
            },
            {
                "name": "queue_backlog",
                "metric": "queue_size",
                "condition": "gt",
                "threshold": 5000,
                "severity": AlertSeverity.HIGH,
                "message": "消息队列积压: {value:.0f} > {threshold:.0f}",
                "description": "消息队列积压超过5000条",
                "actions": ["检查消费者状态", "增加处理能力", "清理积压消息"]
            }
        ]


class DashboardLayouts:
    """仪表板布局配置"""

    @staticmethod
    def get_main_dashboard_layout() -> Dict[str, Any]:
        """获取主仪表板布局"""
        return {
            "title": "小红书AI自动化平台监控",
            "layout": "grid",
            "refresh_interval": 30,
            "panels": [
                {
                    "id": "overview",
                    "title": "系统概览",
                    "type": "summary",
                    "position": {"row": 1, "col": 1, "width": 12, "height": 2},
                    "metrics": [
                        "viral_content_rate",
                        "engagement_rate",
                        "ai_model_accuracy",
                        "system_availability"
                    ]
                },
                {
                    "id": "business_metrics",
                    "title": "业务指标",
                    "type": "metric_grid",
                    "position": {"row": 3, "col": 1, "width": 6, "height": 4},
                    "metrics": [
                        "viral_content_rate",
                        "engagement_rate",
                        "trend_prediction_accuracy",
                        "brand_personality_alignment",
                        "content_quality_score",
                        "user_satisfaction_score"
                    ]
                },
                {
                    "id": "performance_metrics",
                    "title": "性能指标",
                    "type": "metric_grid",
                    "position": {"row": 3, "col": 7, "width": 6, "height": 4},
                    "metrics": [
                        "ai_model_accuracy",
                        "response_time_ms",
                        "system_availability",
                        "error_rate",
                        "resource_utilization",
                        "api_request_rate"
                    ]
                },
                {
                    "id": "viral_content_trend",
                    "title": "爆款内容趋势",
                    "type": "time_series",
                    "position": {"row": 7, "col": 1, "width": 6, "height": 4},
                    "metric": "viral_content_rate",
                    "time_window": TimeWindow.LAST_24_HOUR
                },
                {
                    "id": "engagement_trend",
                    "title": "用户互动趋势",
                    "type": "time_series",
                    "position": {"row": 7, "col": 7, "width": 6, "height": 4},
                    "metric": "engagement_rate",
                    "time_window": TimeWindow.LAST_24_HOUR
                },
                {
                    "id": "alerts_panel",
                    "title": "活跃告警",
                    "type": "alerts",
                    "position": {"row": 11, "col": 1, "width": 12, "height": 3},
                    "max_alerts": 10
                },
                {
                    "id": "insights_panel",
                    "title": "业务洞察",
                    "type": "insights",
                    "position": {"row": 14, "col": 1, "width": 12, "height": 3},
                    "max_insights": 5
                }
            ]
        }

    @staticmethod
    def get_ai_performance_dashboard() -> Dict[str, Any]:
        """获取AI性能仪表板布局"""
        return {
            "title": "AI系统性能监控",
            "layout": "grid",
            "refresh_interval": 30,
            "panels": [
                {
                    "id": "ai_overview",
                    "title": "AI系统概览",
                    "type": "summary",
                    "position": {"row": 1, "col": 1, "width": 12, "height": 2},
                    "metrics": [
                        "trend_prediction_accuracy",
                        "brand_personality_alignment",
                        "ai_model_accuracy",
                        "response_time_ms"
                    ]
                },
                {
                    "id": "prediction_accuracy",
                    "title": "预测准确率趋势",
                    "type": "time_series",
                    "position": {"row": 3, "col": 1, "width": 6, "height": 4},
                    "metric": "trend_prediction_accuracy",
                    "time_window": TimeWindow.LAST_7_DAYS
                },
                {
                    "id": "brand_alignment",
                    "title": "品牌匹配度趋势",
                    "type": "time_series",
                    "position": {"row": 3, "col": 7, "width": 6, "height": 4},
                    "metric": "brand_personality_alignment",
                    "time_window": TimeWindow.LAST_7_DAYS
                },
                {
                    "id": "response_time_distribution",
                    "title": "响应时间分布",
                    "type": "histogram",
                    "position": {"row": 7, "col": 1, "width": 12, "height": 4},
                    "metric": "response_time_ms",
                    "time_window": TimeWindow.LAST_24_HOUR
                }
            ]
        }

    @staticmethod
    def get_business_dashboard() -> Dict[str, Any]:
        """获取业务仪表板布局"""
        return {
            "title": "小红书业务指标监控",
            "layout": "grid",
            "refresh_interval": 60,
            "panels": [
                {
                    "id": "business_kpi",
                    "title": "核心业务KPI",
                    "type": "kpi_grid",
                    "position": {"row": 1, "col": 1, "width": 12, "height": 3},
                    "kpis": [
                        {
                            "title": "爆款内容率",
                            "metric": "viral_content_rate",
                            "unit": "%",
                            "target": 0.05,
                            "status": "good"
                        },
                        {
                            "title": "用户互动率",
                            "metric": "engagement_rate",
                            "unit": "%",
                            "target": 0.03,
                            "status": "warning"
                        },
                        {
                            "title": "内容质量评分",
                            "metric": "content_quality_score",
                            "unit": "分",
                            "target": 0.80,
                            "status": "good"
                        },
                        {
                            "title": "用户满意度",
                            "metric": "user_satisfaction_score",
                            "unit": "分",
                            "target": 4.0,
                            "status": "good"
                        }
                    ]
                },
                {
                    "id": "content_performance",
                    "title": "内容表现分析",
                    "type": "multi_time_series",
                    "position": {"row": 4, "col": 1, "width": 12, "height": 5},
                    "metrics": [
                        "viral_content_rate",
                        "engagement_rate",
                        "content_quality_score"
                    ],
                    "time_window": TimeWindow.LAST_7_DAYS
                },
                {
                    "id": "growth_metrics",
                    "title": "增长指标",
                    "type": "metric_grid",
                    "position": {"row": 9, "col": 1, "width": 6, "height": 3},
                    "metrics": [
                        "user_growth_rate",
                        "content_creation_volume",
                        "conversion_rate"
                    ]
                },
                {
                    "id": "engagement_metrics",
                    "title": "互动指标",
                    "type": "metric_grid",
                    "position": {"row": 9, "col": 7, "width": 6, "height": 3},
                    "metrics": [
                        "engagement_rate",
                        "average_session_duration",
                        "user_satisfaction_score"
                    ]
                }
            ]
        }


class NotificationChannels:
    """通知渠道配置"""

    @staticmethod
    def get_webhook_config() -> Dict[str, Any]:
        """获取Webhook配置"""
        return {
            "enabled": False,
            "url": "",
            "timeout": 30,
            "retry_count": 3,
            "headers": {
                "Content-Type": "application/json",
                "User-Agent": "LaunchX-Monitoring/1.0"
            },
            "payload_template": {
                "alert_id": "{{alert.id}}",
                "title": "{{alert.title}}",
                "message": "{{alert.message}}",
                "severity": "{{alert.severity}}",
                "timestamp": "{{alert.timestamp}}",
                "metric": "{{alert.metric_name}}",
                "current_value": "{{alert.current_value}}",
                "threshold": "{{alert.threshold}}"
            }
        }

    @staticmethod
    def get_email_config() -> Dict[str, Any]:
        """获取邮件配置"""
        return {
            "enabled": False,
            "smtp_server": "",
            "smtp_port": 587,
            "username": "",
            "password": "",
            "from_address": "",
            "to_addresses": [],
            "subject_template": "[{{severity}}] {{alert.metric_name}} - {{alert.title}}",
            "body_template": """
告警详情:
- 告警ID: {{alert.id}}
- 指标名称: {{alert.metric_name}}
- 当前值: {{alert.current_value}}
- 阈值: {{alert.threshold}}
- 严重程度: {{alert.severity}}
- 时间: {{alert.timestamp}}

详细信息:
{{alert.message}}

建议措施:
{{alert.actions}}
            """.strip()
        }

    @staticmethod
    def get_slack_config() -> Dict[str, Any]:
        """获取Slack配置"""
        return {
            "enabled": False,
            "webhook_url": "",
            "channel": "#monitoring",
            "username": "LaunchX Monitor",
            "icon_emoji": ":warning:",
            "message_template": {
                "text": "{{alert.title}}",
                "attachments": [
                    {
                        "color": "danger" if "{{alert.severity}}" == "critical" else "warning",
                        "fields": [
                            {
                                "title": "指标",
                                "value": "{{alert.metric_name}}",
                                "short": True
                            },
                            {
                                "title": "当前值",
                                "value": "{{alert.current_value}}",
                                "short": True
                            },
                            {
                                "title": "阈值",
                                "value": "{{alert.threshold}}",
                                "short": True
                            },
                            {
                                "title": "时间",
                                "value": "{{alert.timestamp}}",
                                "short": True
                            }
                        ],
                        "text": "{{alert.message}}"
                    }
                ]
            }
        }


# 默认配置实例
DEFAULT_CONFIG = MonitoringConfig()

# 导出配置类
__all__ = [
    "MonitoringConfig",
    "XiaohongshuMetrics",
    "AlertRules",
    "DashboardLayouts",
    "NotificationChannels",
    "DEFAULT_CONFIG"
]