#!/usr/bin/env python3
"""
Agent OS四层BMAD混合智能架构 - Layer1 核心交互逻辑层
Core Interaction Logic Layer - 上下文感知、意图理解、动态路由、状态同步

基于小红书自动化业务场景的上下文管理和交互处理核心
"""

import asyncio
import json
import logging
import time
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
from typing import Dict, List, Optional, Any, Set, Tuple, Callable
from pathlib import Path
import uuid
import re
from collections import defaultdict, deque

logger = logging.getLogger(__name__)


class InteractionMode(Enum):
    """交互模式定义"""
    NATURAL_LANGUAGE = "natural_language"  # 自然语言交互
    TASK_ORIENTED = "task_oriented"       # 任务导向交互
    LEARNING_MODE = "learning_mode"       # 学习模式
    EMERGENCY_MODE = "emergency_mode"     # 紧急模式


class IntentType(Enum):
    """用户意图类型"""
    CONTENT_ANALYSIS = "content_analysis"      # 内容分析
    TREND_PREDICTION = "trend_prediction"      # 趋势预测
    BRAND_MATCHING = "brand_matching"          # 品牌匹配
    PERFORMANCE_OPTIMIZATION = "performance_optimization"  # 性能优化
    SYSTEM_MANAGEMENT = "system_management"    # 系统管理
    QUALITY_CONTROL = "quality_control"        # 质量控制
    LEARNING_REQUEST = "learning_request"      # 学习请求


class ContextState(Enum):
    """上下文状态"""
    ACTIVE = "active"           # 活跃状态
    SUSPENDED = "suspended"     # 暂停状态
    ARCHIVED = "archived"       # 归档状态
    ERROR = "error"            # 错误状态


@dataclass
class UserContext:
    """用户上下文信息"""
    user_id: str
    session_id: str
    interaction_mode: InteractionMode
    current_intent: Optional[IntentType] = None
    context_data: Dict[str, Any] = field(default_factory=dict)
    conversation_history: List[Dict[str, Any]] = field(default_factory=list)
    active_tasks: List[str] = field(default_factory=list)
    preferences: Dict[str, Any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
    state: ContextState = ContextState.ACTIVE

    def update_timestamp(self):
        """更新时间戳"""
        self.updated_at = datetime.now()

    def add_to_history(self, message: Dict[str, Any]):
        """添加到对话历史"""
        self.conversation_history.append(message)
        if len(self.conversation_history) > 100:  # 保持最近100条记录
            self.conversation_history.pop(0)
        self.update_timestamp()


@dataclass
class IntentAnalysisResult:
    """意图分析结果"""
    intent_type: IntentType
    confidence: float
    entities: Dict[str, Any] = field(default_factory=dict)
    parameters: Dict[str, Any] = field(default_factory=dict)
    suggested_actions: List[str] = field(default_factory=list)
    processing_priority: int = 2
    estimated_complexity: float = 0.5


@dataclass
class RoutingDecision:
    """路由决策"""
    target_layer: str
    target_agent: Optional[str] = None
    routing_path: List[str] = field(default_factory=list)
    required_mcp_tools: List[str] = field(default_factory=list)
    estimated_execution_time: float = 0.0
    confidence: float = 0.0


class ContextManager:
    """上下文管理器 - 负责用户上下文的存储、检索和管理"""

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self.contexts: Dict[str, UserContext] = {}
        self.session_contexts: Dict[str, str] = {}  # session_id -> user_id mapping
        self.context_cache = {}
        self.logger = logging.getLogger(f"{__name__}.ContextManager")

        # 上下文策略配置
        self.max_context_age = timedelta(hours=24)
        self.max_contexts_per_user = 10
        self.context_cleanup_interval = timedelta(minutes=30)

        # 启动后台清理任务
        asyncio.create_task(self._periodic_cleanup())

    async def create_context(self, user_id: str, session_id: str,
                           interaction_mode: InteractionMode = InteractionMode.NATURAL_LANGUAGE) -> UserContext:
        """创建新的用户上下文"""
        context_id = str(uuid.uuid4())
        context = UserContext(
            user_id=user_id,
            session_id=session_id,
            interaction_mode=interaction_mode
        )

        self.contexts[context_id] = context
        self.session_contexts[session_id] = context_id

        self.logger.info(f"Created context {context_id} for user {user_id}")
        return context

    async def get_context(self, session_id: str) -> Optional[UserContext]:
        """获取用户上下文"""
        context_id = self.session_contexts.get(session_id)
        if context_id:
            return self.contexts.get(context_id)
        return None

    async def update_context(self, session_id: str, updates: Dict[str, Any]) -> bool:
        """更新用户上下文"""
        context = await self.get_context(session_id)
        if not context:
            return False

        for key, value in updates.items():
            if hasattr(context, key):
                setattr(context, key, value)
            else:
                context.context_data[key] = value

        context.update_timestamp()
        return True

    async def add_conversation_entry(self, session_id: str, role: str, content: str,
                                   metadata: Optional[Dict[str, Any]] = None):
        """添加对话记录"""
        context = await self.get_context(session_id)
        if not context:
            return

        entry = {
            "role": role,
            "content": content,
            "timestamp": datetime.now().isoformat(),
            "metadata": metadata or {}
        }
        context.add_to_history(entry)

    async def get_context_history(self, session_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """获取上下文历史"""
        context = await self.get_context(session_id)
        if not context:
            return []
        return context.conversation_history[-limit:]

    async def _periodic_cleanup(self):
        """定期清理过期上下文"""
        while True:
            try:
                await asyncio.sleep(self.context_cleanup_interval.total_seconds())
                await self._cleanup_expired_contexts()
            except Exception as e:
                self.logger.error(f"Context cleanup error: {e}")

    async def _cleanup_expired_contexts(self):
        """清理过期上下文"""
        current_time = datetime.now()
        expired_contexts = []

        for context_id, context in self.contexts.items():
            if current_time - context.updated_at > self.max_context_age:
                expired_contexts.append(context_id)

        for context_id in expired_contexts:
            context = self.contexts.pop(context_id, None)
            if context:
                self.session_contexts.pop(context.session_id, None)
                self.logger.info(f"Cleaned up expired context {context_id}")


class IntentAnalyzer:
    """意图分析器 - 理解用户意图和需求"""

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self.logger = logging.getLogger(f"{__name__}.IntentAnalyzer")

        # 意图识别模式
        self.intent_patterns = {
            IntentType.CONTENT_ANALYSIS: [
                r"分析.*内容", r"评估.*质量", r"检测.*爆款", r"分析.*表现",
                r"analyze.*content", r"evaluate.*quality", r"detect.*viral"
            ],
            IntentType.TREND_PREDICTION: [
                r"预测.*趋势", r"分析.*趋势", r"热门.*话题", r"趋势.*预测",
                r"predict.*trend", r"analyze.*trend", r"hot.*topic"
            ],
            IntentType.BRAND_MATCHING: [
                r"品牌.*匹配", r"调性.*一致", r"品牌.*风格", r"符合.*品牌",
                r"brand.*match", r"tone.*consistency", r"brand.*style"
            ],
            IntentType.PERFORMANCE_OPTIMIZATION: [
                r"优化.*性能", r"提升.*效果", r"改进.*策略", r"优化.*方案",
                r"optimize.*performance", r"improve.*effectiveness"
            ],
            IntentType.SYSTEM_MANAGEMENT: [
                r"系统.*状态", r"管理.*配置", r"监控.*系统", r"系统.*管理",
                r"system.*status", r"manage.*config", r"monitor.*system"
            ],
            IntentType.QUALITY_CONTROL: [
                r"质量.*控制", r"审核.*内容", r"质量.*检查", r"内容.*审核",
                r"quality.*control", r"review.*content", r"quality.*check"
            ],
            IntentType.LEARNING_REQUEST: [
                r"学习.*模式", r"训练.*模型", r"优化.*算法", r"机器.*学习",
                r"learning.*mode", r"train.*model", r"optimize.*algorithm"
            ]
        }

        # 实体提取模式
        self.entity_patterns = {
            "content_type": r"(内容|笔记|视频|图文|article|content|note|video)",
            "platform": r"(小红书|xiaohongshu|微博|抖音|douyin)",
            "time_range": r"(今天|昨天|本周|本月|today|this week|this month)",
            "metrics": r"(点赞|评论|转发|浏览|互动|likes|comments|shares|views|engagement)",
            "brand_name": r"(LaunchX|launchx|品牌|brand)"
        }

    async def analyze_intent(self, text: str, context: Optional[UserContext] = None) -> IntentAnalysisResult:
        """分析用户意图"""
        text_lower = text.lower()

        # 计算每种意图的匹配度
        intent_scores = {}
        for intent_type, patterns in self.intent_patterns.items():
            score = 0
            for pattern in patterns:
                matches = len(re.findall(pattern, text_lower))
                score += matches
            intent_scores[intent_type] = score

        # 确定主要意图
        if not any(intent_scores.values()):
            # 默认为内容分析
            primary_intent = IntentType.CONTENT_ANALYSIS
            confidence = 0.3
        else:
            primary_intent = max(intent_scores, key=intent_scores.get)
            confidence = min(1.0, intent_scores[primary_intent] / 3.0)

        # 提取实体
        entities = await self._extract_entities(text)

        # 推断参数
        parameters = await self._infer_parameters(text, entities, primary_intent)

        # 生成建议操作
        suggested_actions = await self._generate_suggested_actions(primary_intent, entities)

        # 估算复杂度
        complexity = await self._estimate_complexity(primary_intent, parameters)

        return IntentAnalysisResult(
            intent_type=primary_intent,
            confidence=confidence,
            entities=entities,
            parameters=parameters,
            suggested_actions=suggested_actions,
            processing_priority=await self._determine_priority(primary_intent, confidence),
            estimated_complexity=complexity
        )

    async def _extract_entities(self, text: str) -> Dict[str, Any]:
        """提取实体信息"""
        entities = {}
        for entity_type, pattern in self.entity_patterns.items():
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                entities[entity_type] = matches
        return entities

    async def _infer_parameters(self, text: str, entities: Dict[str, Any],
                               intent: IntentType) -> Dict[str, Any]:
        """推断任务参数"""
        parameters = {}

        # 基于意图类型推断参数
        if intent == IntentType.CONTENT_ANALYSIS:
            parameters["analysis_type"] = "comprehensive"
            if "metrics" in entities:
                parameters["focus_metrics"] = entities["metrics"]

        elif intent == IntentType.TREND_PREDICTION:
            parameters["prediction_horizon"] = "7_days"
            if "time_range" in entities:
                parameters["time_range"] = entities["time_range"][0]

        elif intent == IntentType.BRAND_MATCHING:
            parameters["matching_threshold"] = 0.8
            if "brand_name" in entities:
                parameters["target_brand"] = entities["brand_name"][0]

        return parameters

    async def _generate_suggested_actions(self, intent: IntentType,
                                        entities: Dict[str, Any]) -> List[str]:
        """生成建议操作"""
        action_map = {
            IntentType.CONTENT_ANALYSIS: [
                "执行内容质量分析",
                "检测爆款潜力",
                "生成优化建议"
            ],
            IntentType.TREND_PREDICTION: [
                "分析历史趋势数据",
                "生成趋势预测报告",
                "推荐热门话题"
            ],
            IntentType.BRAND_MATCHING: [
                "分析品牌调性",
                "评估内容一致性",
                "生成品牌优化建议"
            ],
            IntentType.PERFORMANCE_OPTIMIZATION: [
                "分析当前性能",
                "识别优化机会",
                "制定改进策略"
            ]
        }

        return action_map.get(intent, ["处理请求"])

    async def _estimate_complexity(self, intent: IntentType, parameters: Dict[str, Any]) -> float:
        """估算任务复杂度"""
        base_complexity = {
            IntentType.CONTENT_ANALYSIS: 0.4,
            IntentType.TREND_PREDICTION: 0.7,
            IntentType.BRAND_MATCHING: 0.5,
            IntentType.PERFORMANCE_OPTIMIZATION: 0.6,
            IntentType.SYSTEM_MANAGEMENT: 0.3,
            IntentType.QUALITY_CONTROL: 0.5,
            IntentType.LEARNING_REQUEST: 0.8
        }

        complexity = base_complexity.get(intent, 0.5)

        # 根据参数调整复杂度
        if len(parameters) > 5:
            complexity += 0.2

        return min(1.0, complexity)

    async def _determine_priority(self, intent: IntentType, confidence: float) -> int:
        """确定处理优先级"""
        if confidence > 0.8:
            return 1  # 高优先级
        elif confidence > 0.5:
            return 2  # 中优先级
        else:
            return 3  # 低优先级


class DynamicRouter:
    """动态路由器 - 智能任务路由和分发"""

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self.logger = logging.getLogger(f"{__name__}.DynamicRouter")

        # 路由规则配置
        self.routing_rules = {
            IntentType.CONTENT_ANALYSIS: {
                "primary_layer": "layer2_learning",
                "primary_agents": ["TrendAnalystAgent", "ContentCreatorAgent"],
                "mcp_tools": ["tavily-search", "content-analyzer"],
                "fallback_route": ["layer3_collaboration", "QualityController"]
            },
            IntentType.TREND_PREDICTION: {
                "primary_layer": "layer2_learning",
                "primary_agents": ["TrendAnalystAgent", "TrendPredictor"],
                "mcp_tools": ["tavily-search", "trend-analyzer"],
                "fallback_route": ["layer4_persistence", "KnowledgeRetriever"]
            },
            IntentType.BRAND_MATCHING: {
                "primary_layer": "layer3_collaboration",
                "primary_agents": ["BrandMatcherAgent", "ContentCreatorAgent"],
                "mcp_tools": ["brand-analyzer", "content-matcher"],
                "fallback_route": ["layer2_learning", "StyleLearner"]
            },
            IntentType.PERFORMANCE_OPTIMIZATION: {
                "primary_layer": "layer3_collaboration",
                "primary_agents": ["EngagementOptimizer", "PerformancePredictor"],
                "mcp_tools": ["performance-monitor", "optimizer"],
                "fallback_route": ["layer2_learning", "PerformanceLearner"]
            },
            IntentType.SYSTEM_MANAGEMENT: {
                "primary_layer": "layer1_interaction",
                "primary_agents": ["SystemManager"],
                "mcp_tools": ["system-monitor", "config-manager"],
                "fallback_route": ["layer4_persistence", "SystemArchiver"]
            },
            IntentType.QUALITY_CONTROL: {
                "primary_layer": "layer3_collaboration",
                "primary_agents": ["QualityController", "BrandMatcherAgent"],
                "mcp_tools": ["quality-analyzer", "content-validator"],
                "fallback_route": ["layer1_interaction", "UserFeedbackHandler"]
            },
            IntentType.LEARNING_REQUEST: {
                "primary_layer": "layer2_learning",
                "primary_agents": ["LearningEngine", "ModelOptimizer"],
                "mcp_tools": ["ml-trainer", "model-updater"],
                "fallback_route": ["layer4_persistence", "KnowledgeManager"]
            }
        }

        # 负载均衡配置
        self.agent_load = defaultdict(int)
        self.mcp_tool_load = defaultdict(int)

    async def route_request(self, intent_result: IntentAnalysisResult,
                          context: Optional[UserContext] = None) -> RoutingDecision:
        """路由请求到合适的处理层和Agent"""

        # 获取基础路由规则
        routing_rule = self.routing_rules.get(intent_result.intent_type, {})

        # 选择主要目标
        primary_layer = routing_rule.get("primary_layer", "layer2_learning")
        primary_agents = routing_rule.get("primary_agents", [])
        mcp_tools = routing_rule.get("mcp_tools", [])

        # 负载均衡选择
        selected_agent = await self._select_agent(primary_agents)
        selected_tools = await self._select_mcp_tools(mcp_tools)

        # 构建路由路径
        routing_path = [primary_layer]
        if selected_agent:
            routing_path.append(selected_agent)

        # 估算执行时间
        execution_time = await self._estimate_execution_time(
            intent_result.intent_type, intent_result.estimated_complexity
        )

        # 计算路由置信度
        confidence = await self._calculate_routing_confidence(
            intent_result, routing_rule
        )

        return RoutingDecision(
            target_layer=primary_layer,
            target_agent=selected_agent,
            routing_path=routing_path,
            required_mcp_tools=selected_tools,
            estimated_execution_time=execution_time,
            confidence=confidence
        )

    async def _select_agent(self, agents: List[str]) -> Optional[str]:
        """负载均衡选择Agent"""
        if not agents:
            return None

        # 选择负载最低的Agent
        selected_agent = min(agents, key=lambda x: self.agent_load[x])
        self.agent_load[selected_agent] += 1

        # 异步减载
        asyncio.create_task(self._unload_agent(selected_agent, delay=5.0))

        return selected_agent

    async def _select_mcp_tools(self, tools: List[str]) -> List[str]:
        """选择MCP工具"""
        if not tools:
            return []

        # 选择可用且负载较低的工具
        selected_tools = []
        for tool in tools:
            if self.mcp_tool_load[tool] < 5:  # 最大并发限制
                selected_tools.append(tool)
                self.mcp_tool_load[tool] += 1
                asyncio.create_task(self._unload_mcp_tool(tool, delay=2.0))

        return selected_tools

    async def _unload_agent(self, agent: str, delay: float):
        """Agent负载减载"""
        await asyncio.sleep(delay)
        self.agent_load[agent] = max(0, self.agent_load[agent] - 1)

    async def _unload_mcp_tool(self, tool: str, delay: float):
        """MCP工具负载减载"""
        await asyncio.sleep(delay)
        self.mcp_tool_load[tool] = max(0, self.mcp_tool_load[tool] - 1)

    async def _estimate_execution_time(self, intent: IntentType, complexity: float) -> float:
        """估算执行时间"""
        base_time = {
            IntentType.CONTENT_ANALYSIS: 2.0,
            IntentType.TREND_PREDICTION: 5.0,
            IntentType.BRAND_MATCHING: 3.0,
            IntentType.PERFORMANCE_OPTIMIZATION: 4.0,
            IntentType.SYSTEM_MANAGEMENT: 1.0,
            IntentType.QUALITY_CONTROL: 2.5,
            IntentType.LEARNING_REQUEST: 8.0
        }

        return base_time.get(intent, 3.0) * (1 + complexity)

    async def _calculate_routing_confidence(self, intent_result: IntentAnalysisResult,
                                          routing_rule: Dict[str, Any]) -> float:
        """计算路由置信度"""
        if not routing_rule:
            return 0.3

        confidence = intent_result.confidence * 0.7  # 意图识别权重

        # 规则匹配度
        if routing_rule.get("primary_agents"):
            confidence += 0.2
        if routing_rule.get("mcp_tools"):
            confidence += 0.1

        return min(1.0, confidence)


class StateSynchronizer:
    """状态同步器 - 管理系统各层之间的状态同步"""

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self.logger = logging.getLogger(f"{__name__}.StateSynchronizer")

        # 状态存储
        self.layer_states = {
            "layer1_interaction": {},
            "layer2_learning": {},
            "layer3_collaboration": {},
            "layer4_persistence": {}
        }

        # 同步订阅
        self.state_subscribers = defaultdict(list)

        # 同步队列
        self.sync_queue = asyncio.Queue()

        # 启动同步处理任务
        asyncio.create_task(self._process_sync_events())

    async def update_layer_state(self, layer: str, state_updates: Dict[str, Any]):
        """更新层状态"""
        if layer not in self.layer_states:
            self.logger.warning(f"Unknown layer: {layer}")
            return

        # 更新状态
        timestamp = datetime.now().isoformat()
        state_updates["updated_at"] = timestamp
        self.layer_states[layer].update(state_updates)

        # 发布同步事件
        sync_event = {
            "type": "state_update",
            "layer": layer,
            "updates": state_updates,
            "timestamp": timestamp
        }
        await self.sync_queue.put(sync_event)

        self.logger.debug(f"Updated {layer} state: {list(state_updates.keys())}")

    async def get_layer_state(self, layer: str) -> Dict[str, Any]:
        """获取层状态"""
        return self.layer_states.get(layer, {}).copy()

    async def get_system_state(self) -> Dict[str, Any]:
        """获取系统整体状态"""
        return {
            "layers": self.layer_states.copy(),
            "system_health": await self._assess_system_health(),
            "last_sync": datetime.now().isoformat()
        }

    async def subscribe_to_state_changes(self, layer: str, callback: Callable):
        """订阅状态变化"""
        self.state_subscribers[layer].append(callback)

    async def sync_states_between_layers(self, source_layer: str, target_layer: str,
                                       sync_data: Dict[str, Any]):
        """层间状态同步"""
        sync_event = {
            "type": "cross_layer_sync",
            "source_layer": source_layer,
            "target_layer": target_layer,
            "sync_data": sync_data,
            "timestamp": datetime.now().isoformat()
        }
        await self.sync_queue.put(sync_event)

    async def _process_sync_events(self):
        """处理同步事件"""
        while True:
            try:
                event = await self.sync_queue.get()
                await self._handle_sync_event(event)
            except Exception as e:
                self.logger.error(f"Sync event processing error: {e}")

    async def _handle_sync_event(self, event: Dict[str, Any]):
        """处理同步事件"""
        event_type = event.get("type")

        if event_type == "state_update":
            layer = event.get("layer")
            await self._notify_subscribers(layer, event)

        elif event_type == "cross_layer_sync":
            source_layer = event.get("source_layer")
            target_layer = event.get("target_layer")
            sync_data = event.get("sync_data")

            # 更新目标层状态
            await self.update_layer_state(target_layer, {
                f"synced_from_{source_layer}": sync_data
            })

            # 通知目标层订阅者
            await self._notify_subscribers(target_layer, event)

    async def _notify_subscribers(self, layer: str, event: Dict[str, Any]):
        """通知订阅者"""
        subscribers = self.state_subscribers.get(layer, [])
        for callback in subscribers:
            try:
                await callback(event)
            except Exception as e:
                self.logger.error(f"Subscriber notification error: {e}")

    async def _assess_system_health(self) -> Dict[str, Any]:
        """评估系统健康状态"""
        health_status = {
            "overall": "healthy",
            "layers": {},
            "issues": []
        }

        for layer, state in self.layer_states.items():
            layer_health = "healthy"
            if not state:
                layer_health = "no_data"
            elif state.get("error_count", 0) > 5:
                layer_health = "degraded"
            elif state.get("last_error"):
                layer_health = "warning"

            health_status["layers"][layer] = layer_health

            if layer_health in ["degraded", "warning"]:
                health_status["issues"].append(f"{layer}: {layer_health}")

        if health_status["issues"]:
            health_status["overall"] = "degraded" if len(health_status["issues"]) < 3 else "unhealthy"

        return health_status


class CoreInteractionLayer:
    """核心交互逻辑层主控制器"""

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self.logger = logging.getLogger(f"{__name__}.CoreInteractionLayer")

        # 初始化组件
        self.context_manager = ContextManager(config)
        self.intent_analyzer = IntentAnalyzer(config)
        self.dynamic_router = DynamicRouter(config)
        self.state_synchronizer = StateSynchronizer(config)

        # 性能指标
        self.performance_metrics = {
            "total_requests": 0,
            "successful_requests": 0,
            "average_response_time": 0.0,
            "intent_accuracy": 0.0,
            "routing_success_rate": 0.0
        }

        # 启动健康监控
        asyncio.create_task(self._health_monitor())

    async def process_user_request(self, session_id: str, user_input: str,
                                 metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """处理用户请求的主要入口点"""
        start_time = time.time()

        try:
            # 1. 获取或创建用户上下文
            context = await self.context_manager.get_context(session_id)
            if not context:
                user_id = metadata.get("user_id", "anonymous") if metadata else "anonymous"
                context = await self.context_manager.create_context(
                    user_id=user_id,
                    session_id=session_id
                )

            # 2. 记录用户输入
            await self.context_manager.add_conversation_entry(
                session_id, "user", user_input, metadata
            )

            # 3. 意图分析
            intent_result = await self.intent_analyzer.analyze_intent(user_input, context)

            # 4. 动态路由
            routing_decision = await self.dynamic_router.route_request(intent_result, context)

            # 5. 更新上下文
            await self.context_manager.update_context(session_id, {
                "current_intent": intent_result.intent_type,
                "context_data": {
                    "last_intent": intent_result.intent_type.value,
                    "last_entities": intent_result.entities,
                    "routing_decision": routing_decision.__dict__
                }
            })

            # 6. 状态同步
            await self.state_synchronizer.update_layer_state(
                "layer1_interaction", {
                    "active_session": session_id,
                    "current_intent": intent_result.intent_type.value,
                    "routing_target": routing_decision.target_layer,
                    "request_count": self.performance_metrics["total_requests"] + 1
                }
            )

            # 7. 构建响应
            response_time = time.time() - start_time
            response = await self._build_response(
                intent_result, routing_decision, context, response_time
            )

            # 8. 记录系统响应
            await self.context_manager.add_conversation_entry(
                session_id, "system", response.get("message", ""),
                {"response_time": response_time, "routing": routing_decision.__dict__}
            )

            # 9. 更新性能指标
            await self._update_performance_metrics(response_time, True)

            return response

        except Exception as e:
            response_time = time.time() - start_time
            self.logger.error(f"Request processing error: {e}")

            await self._update_performance_metrics(response_time, False)

            return {
                "success": False,
                "error": str(e),
                "response_time": response_time,
                "session_id": session_id
            }

    async def _build_response(self, intent_result: IntentAnalysisResult,
                            routing_decision: RoutingDecision, context: UserContext,
                            response_time: float) -> Dict[str, Any]:
        """构建响应消息"""
        response = {
            "success": True,
            "session_id": context.session_id,
            "intent": intent_result.intent_type.value,
            "confidence": intent_result.confidence,
            "routing": {
                "target_layer": routing_decision.target_layer,
                "target_agent": routing_decision.target_agent,
                "estimated_time": routing_decision.estimated_execution_time
            },
            "suggested_actions": intent_result.suggested_actions,
            "response_time": response_time,
            "message": await self._generate_response_message(intent_result, routing_decision)
        }

        return response

    async def _generate_response_message(self, intent_result: IntentAnalysisResult,
                                       routing_decision: RoutingDecision) -> str:
        """生成响应消息"""
        intent_type = intent_result.intent_type
        confidence = intent_result.confidence

        if confidence < 0.5:
            return "我不太确定您的需求，能否提供更多详细信息？"

        messages = {
            IntentType.CONTENT_ANALYSIS: "我正在为您分析内容，请稍候...",
            IntentType.TREND_PREDICTION: "正在分析趋势数据并生成预测报告...",
            IntentType.BRAND_MATCHING: "正在进行品牌调性匹配分析...",
            IntentType.PERFORMANCE_OPTIMIZATION: "正在分析性能数据并制定优化方案...",
            IntentType.SYSTEM_MANAGEMENT: "正在处理您的系统管理请求...",
            IntentType.QUALITY_CONTROL: "正在进行内容质量控制...",
            IntentType.LEARNING_REQUEST: "正在启动学习模式，优化系统性能..."
        }

        base_message = messages.get(intent_type, "正在处理您的请求...")

        if routing_decision.target_agent:
            base_message += f" 已分配给{routing_decision.target_agent}处理。"

        return base_message

    async def _update_performance_metrics(self, response_time: float, success: bool):
        """更新性能指标"""
        self.performance_metrics["total_requests"] += 1

        if success:
            self.performance_metrics["successful_requests"] += 1

        # 更新平均响应时间
        total = self.performance_metrics["total_requests"]
        current_avg = self.performance_metrics["average_response_time"]
        self.performance_metrics["average_response_time"] = (
            (current_avg * (total - 1) + response_time) / total
        )

    async def get_layer_status(self) -> Dict[str, Any]:
        """获取层状态信息"""
        return {
            "layer_name": "layer1_core_interaction",
            "components": {
                "context_manager": {
                    "active_contexts": len(self.context_manager.contexts),
                    "session_mappings": len(self.context_manager.session_contexts)
                },
                "intent_analyzer": {
                    "intent_types": len(IntentType),
                    "pattern_count": sum(len(patterns) for patterns in self.intent_analyzer.intent_patterns.values())
                },
                "dynamic_router": {
                    "routing_rules": len(self.dynamic_router.routing_rules),
                    "current_load": dict(self.dynamic_router.agent_load)
                },
                "state_synchronizer": {
                    "layer_states": len(self.state_synchronizer.layer_states),
                    "subscribers": sum(len(subs) for subs in self.state_synchronizer.state_subscribers.values())
                }
            },
            "performance_metrics": self.performance_metrics.copy(),
            "system_health": await self.state_synchronizer._assess_system_health()
        }

    async def _health_monitor(self):
        """健康监控任务"""
        while True:
            try:
                await asyncio.sleep(60)  # 每分钟检查一次

                # 更新系统状态
                await self.state_synchronizer.update_layer_state(
                    "layer1_interaction", {
                        "health_status": "healthy",
                        "performance_metrics": self.performance_metrics,
                        "timestamp": datetime.now().isoformat()
                    }
                )

                # 检查性能指标
                if self.performance_metrics["average_response_time"] > 10.0:
                    self.logger.warning("High average response time detected")

                success_rate = (
                    self.performance_metrics["successful_requests"] /
                    max(1, self.performance_metrics["total_requests"])
                )
                if success_rate < 0.9:
                    self.logger.warning(f"Low success rate: {success_rate:.2%}")

            except Exception as e:
                self.logger.error(f"Health monitor error: {e}")


# 工厂函数和便利接口
async def create_core_interaction_layer(config: Optional[Dict[str, Any]] = None) -> CoreInteractionLayer:
    """创建核心交互逻辑层实例"""
    return CoreInteractionLayer(config)


# 主要接口函数
async def process_user_interaction(session_id: str, user_input: str,
                                 metadata: Optional[Dict[str, Any]] = None,
                                 config: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """处理用户交互的便利函数"""
    layer = await create_core_interaction_layer(config)
    return await layer.process_user_request(session_id, user_input, metadata)


if __name__ == "__main__":
    # 示例用法和测试
    async def main():
        config = {
            "max_context_age": 3600,  # 1 hour
            "cleanup_interval": 600,   # 10 minutes
        }

        layer = await create_core_interaction_layer(config)

        # 测试用户请求处理
        session_id = "test_session_001"
        user_input = "分析这篇小红书笔记的爆款潜力"

        response = await layer.process_user_request(
            session_id=session_id,
            user_input=user_input,
            metadata={"user_id": "test_user"}
        )

        print("Response:", json.dumps(response, indent=2, ensure_ascii=False))

        # 获取层状态
        status = await layer.get_layer_status()
        print("\nLayer Status:", json.dumps(status, indent=2, ensure_ascii=False))

    asyncio.run(main())