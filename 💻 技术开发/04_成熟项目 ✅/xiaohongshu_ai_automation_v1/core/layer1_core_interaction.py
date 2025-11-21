#!/usr/bin/env python3
"""
Agent OS System - Layer1 Core Interaction Logic
Agent OS系统 - 第一层：核心交互逻辑层

核心功能：上下文感知与意图理解、动态路由与任务分配、状态同步与一致性保证
Based on BMAD Hybrid Intelligence Architecture
Version: 1.0
Created: 2025-01-22
"""

import asyncio
import json
import logging
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple, Callable
from dataclasses import dataclass, field
from enum import Enum
import uuid
import re
from collections import defaultdict

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class IntentType(Enum):
    """意图类型枚举"""
    CONTENT_CREATION = "content_creation"
    TREND_ANALYSIS = "trend_analysis"
    INVESTMENT_RESEARCH = "investment_research"
    CUSTOMER_SERVICE = "customer_service"
    SYSTEM_MANAGEMENT = "system_management"
    LEARNING_RESEARCH = "learning_research"
    TECHNICAL_DEVELOPMENT = "technical_development"

class TaskComplexity(Enum):
    """任务复杂度"""
    SIMPLE = 1      # 简单任务，直接执行
    MEDIUM = 2     # 中等任务，需要分解
    COMPLEX = 3    # 复杂任务，需要多Agent协作
    STRATEGIC = 4  # 战略任务，需要人机深度协作

@dataclass
class UserContext:
    """用户上下文信息"""
    user_id: str
    session_id: str
    conversation_history: List[Dict[str, Any]] = field(default_factory=list)
    user_preferences: Dict[str, Any] = field(default_factory=dict)
    current_intent: Optional[IntentType] = None
    task_stack: List[str] = field(default_factory=list)
    last_activity: datetime = field(default_factory=datetime.now)
    language_preference: str = "zh-CN"
    expertise_level: str = "beginner"  # beginner, intermediate, expert

@dataclass
class TaskRequest:
    """任务请求"""
    task_id: str
    user_input: str
    intent: IntentType
    complexity: TaskComplexity
    context: UserContext
    required_tools: List[str] = field(default_factory=list)
    estimated_duration: timedelta = field(default_factory=lambda: timedelta(minutes=5))
    priority: int = 5  # 1-10, 10为最高优先级
    dependencies: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)

class ContextManager:
    """智能上下文管理器"""

    def __init__(self, max_history: int = 100, session_timeout: timedelta = timedelta(hours=2)):
        self.max_history = max_history
        self.session_timeout = session_timeout
        self.active_contexts: Dict[str, UserContext] = {}
        self.context_embeddings: Dict[str, List[float]] = {}  # 简化的嵌入存储

    def create_or_update_context(self, user_id: str, session_id: str,
                                user_input: str, metadata: Dict[str, Any] = None) -> UserContext:
        """创建或更新用户上下文"""
        context_key = f"{user_id}:{session_id}"

        if context_key not in self.active_contexts:
            self.active_contexts[context_key] = UserContext(
                user_id=user_id,
                session_id=session_id
            )
            logger.info(f"Created new context for {context_key}")

        context = self.active_contexts[context_key]

        # 更新对话历史
        context.conversation_history.append({
            "timestamp": datetime.now().isoformat(),
            "user_input": user_input,
            "metadata": metadata or {}
        })

        # 限制历史记录长度
        if len(context.conversation_history) > self.max_history:
            context.conversation_history = context.conversation_history[-self.max_history:]

        # 更新活动时间
        context.last_activity = datetime.now()

        # 更新用户偏好（基于历史行为）
        self._update_user_preferences(context, user_input)

        return context

    def get_context(self, user_id: str, session_id: str) -> Optional[UserContext]:
        """获取用户上下文"""
        context_key = f"{user_id}:{session_id}"
        context = self.active_contexts.get(context_key)

        if context and datetime.now() - context.last_activity > self.session_timeout:
            # 会话超时，清理上下文
            self.cleanup_context(context_key)
            return None

        return context

    def cleanup_context(self, context_key: str):
        """清理过期上下文"""
        if context_key in self.active_contexts:
            del self.active_contexts[context_key]
            logger.info(f"Cleaned up context for {context_key}")

    def _update_user_preferences(self, context: UserContext, user_input: str):
        """基于用户输入更新偏好"""
        # 简化的偏好学习逻辑
        input_lower = user_input.lower()

        # 检测专业程度
        technical_terms = ['api', '算法', '架构', '部署', '优化', '集成']
        tech_score = sum(1 for term in technical_terms if term in input_lower)

        if tech_score >= 3:
            context.expertise_level = "expert"
        elif tech_score >= 1:
            context.expertise_level = "intermediate"

        # 检测语言偏好
        chinese_chars = len(re.findall(r'[\u4e00-\u9fff]', user_input))
        if chinese_chars > len(user_input) * 0.7:
            context.language_preference = "zh-CN"
        else:
            context.language_preference = "en-US"

    def get_context_summary(self, context: UserContext) -> Dict[str, Any]:
        """获取上下文摘要"""
        return {
            "user_id": context.user_id,
            "session_id": context.session_id,
            "conversation_length": len(context.conversation_history),
            "current_intent": context.current_intent.value if context.current_intent else None,
            "expertise_level": context.expertise_level,
            "language_preference": context.language_preference,
            "last_activity": context.last_activity.isoformat(),
            "active_tasks": len(context.task_stack)
        }

class IntentAnalyzer:
    """意图理解分析器"""

    def __init__(self):
        # 意图关键词映射
        self.intent_keywords = {
            IntentType.CONTENT_CREATION: [
                '创作', '生成', '写', '设计', '制作', 'create', 'generate', 'write', 'design'
            ],
            IntentType.TREND_ANALYSIS: [
                '趋势', '分析', '调研', '洞察', 'trend', 'analyze', 'research', 'insight'
            ],
            IntentType.INVESTMENT_RESEARCH: [
                '投资', '融资', '估值', '回报', 'invest', 'funding', 'valuation', 'roi'
            ],
            IntentType.CUSTOMER_SERVICE: [
                '客服', '服务', '支持', '帮助', 'customer', 'service', 'support', 'help'
            ],
            IntentType.SYSTEM_MANAGEMENT: [
                '管理', '配置', '设置', '维护', 'manage', 'config', 'setting', 'maintenance'
            ],
            IntentType.LEARNING_RESEARCH: [
                '学习', '研究', '了解', '掌握', 'learn', 'study', 'understand', 'research'
            ],
            IntentType.TECHNICAL_DEVELOPMENT: [
                '开发', '编程', '代码', '系统', 'develop', 'code', 'programming', 'system'
            ]
        }

        # 复杂度评估关键词
        self.complexity_indicators = {
            TaskComplexity.SIMPLE: ['查询', '搜索', '显示', '获取', 'query', 'search', 'show', 'get'],
            TaskComplexity.MEDIUM: ['分析', '比较', '总结', '整理', 'analyze', 'compare', 'summary'],
            TaskComplexity.COMPLEX: ['设计', '开发', '集成', '优化', 'design', 'develop', 'integrate'],
            TaskComplexity.STRATEGIC: ['战略', '规划', '决策', '投资', 'strategy', 'planning', 'decision']
        }

    def analyze_intent(self, user_input: str, context: UserContext) -> IntentType:
        """分析用户意图"""
        input_lower = user_input.lower()

        # 计算每种意图的匹配分数
        intent_scores = {}
        for intent, keywords in self.intent_keywords.items():
            score = sum(1 for keyword in keywords if keyword in input_lower)
            intent_scores[intent] = score

        # 获取最高分意图
        if intent_scores:
            best_intent = max(intent_scores, key=intent_scores.get)
            # 如果分数为0，使用历史意图或默认意图
            if intent_scores[best_intent] == 0:
                return context.current_intent or IntentType.LEARNING_RESEARCH
            return best_intent

        return IntentType.LEARNING_RESEARCH

    def assess_complexity(self, user_input: str, intent: IntentType) -> TaskComplexity:
        """评估任务复杂度"""
        input_lower = user_input.lower()

        # 基础复杂度分析
        complexity_scores = {}
        for complexity, indicators in self.complexity_indicators.items():
            score = sum(1 for indicator in indicators if indicator in input_lower)
            complexity_scores[complexity] = score

        if complexity_scores:
            base_complexity = max(complexity_scores, key=complexity_scores.get)
        else:
            base_complexity = TaskComplexity.MEDIUM

        # 基于意图类型调整复杂度
        intent_complexity_map = {
            IntentType.CONTENT_CREATION: TaskComplexity.MEDIUM,
            IntentType.TREND_ANALYSIS: TaskComplexity.COMPLEX,
            IntentType.INVESTMENT_RESEARCH: TaskComplexity.STRATEGIC,
            IntentType.CUSTOMER_SERVICE: TaskComplexity.SIMPLE,
            IntentType.SYSTEM_MANAGEMENT: TaskComplexity.MEDIUM,
            IntentType.LEARNING_RESEARCH: TaskComplexity.MEDIUM,
            IntentType.TECHNICAL_DEVELOPMENT: TaskComplexity.COMPLEX
        }

        intent_complexity = intent_complexity_map.get(intent, TaskComplexity.MEDIUM)

        # 取较高复杂度
        return max(base_complexity, intent_complexity, key=lambda x: x.value)

    def extract_entities(self, user_input: str) -> Dict[str, List[str]]:
        """提取实体信息"""
        entities = {
            "time_expressions": [],
            "numbers": [],
            "names": [],
            "locations": [],
            "technical_terms": []
        }

        # 简化的实体提取
        # 时间表达式
        time_patterns = [r'\d{4}年', r'\d{1,2}月', r'\d{1,2}日', r'今天', r'明天', r'昨天']
        for pattern in time_patterns:
            matches = re.findall(pattern, user_input)
            entities["time_expressions"].extend(matches)

        # 数字
        number_pattern = r'\d+(?:\.\d+)?'
        entities["numbers"] = re.findall(number_pattern, user_input)

        # 技术术语
        tech_terms = ['AI', '人工智能', '机器学习', '深度学习', '算法', 'API', '云计算']
        for term in tech_terms:
            if term.lower() in user_input.lower():
                entities["technical_terms"].append(term)

        return entities

class DynamicRouter:
    """动态路由与任务分配器"""

    def __init__(self):
        self.agent_capabilities = {
            "content_creator": ["content_creation", "design", "writing"],
            "trend_analyst": ["trend_analysis", "market_research", "data_analysis"],
            "investment_advisor": ["investment_research", "financial_analysis", "risk_assessment"],
            "customer_support": ["customer_service", "support", "communication"],
            "system_admin": ["system_management", "maintenance", "monitoring"],
            "research_specialist": ["learning_research", "knowledge_synthesis", "analysis"],
            "technical_developer": ["technical_development", "coding", "system_design"]
        }

        self.agent_workload: Dict[str, int] = defaultdict(int)
        self.task_queue: List[TaskRequest] = []
        self.active_tasks: Dict[str, TaskRequest] = {}

    def route_task(self, task: TaskRequest) -> List[str]:
        """为任务路由到合适的Agent"""
        required_capabilities = self._get_required_capabilities(task)

        suitable_agents = []
        for agent, capabilities in self.agent_capabilities.items():
            if any(cap in capabilities for cap in required_capabilities):
                # 计算匹配度
                match_score = sum(1 for cap in required_capabilities if cap in capabilities)
                workload_penalty = self.agent_workload[agent] * 0.1
                total_score = match_score - workload_penalty
                suitable_agents.append((agent, total_score))

        # 按分数排序
        suitable_agents.sort(key=lambda x: x[1], reverse=True)

        # 根据复杂度决定Agent数量
        if task.complexity == TaskComplexity.SIMPLE:
            return [agent for agent, _ in suitable_agents[:1]]
        elif task.complexity == TaskComplexity.MEDIUM:
            return [agent for agent, _ in suitable_agents[:2]]
        else:
            return [agent for agent, _ in suitable_agents[:3]]

    def _get_required_capabilities(self, task: TaskRequest) -> List[str]:
        """获取任务所需能力"""
        capability_map = {
            IntentType.CONTENT_CREATION: ["content_creation", "design", "writing"],
            IntentType.TREND_ANALYSIS: ["trend_analysis", "market_research", "data_analysis"],
            IntentType.INVESTMENT_RESEARCH: ["investment_research", "financial_analysis"],
            IntentType.CUSTOMER_SERVICE: ["customer_service", "communication"],
            IntentType.SYSTEM_MANAGEMENT: ["system_management", "maintenance"],
            IntentType.LEARNING_RESEARCH: ["learning_research", "knowledge_synthesis"],
            IntentType.TECHNICAL_DEVELOPMENT: ["technical_development", "coding"]
        }

        return capability_map.get(task.intent, ["general"])

    def assign_task(self, task: TaskRequest, agents: List[str]):
        """分配任务给Agent"""
        self.active_tasks[task.task_id] = task

        for agent in agents:
            self.agent_workload[agent] += 1
            logger.info(f"Assigned task {task.task_id} to {agent}")

    def complete_task(self, task_id: str, agents: List[str]):
        """完成任务"""
        if task_id in self.active_tasks:
            del self.active_tasks[task_id]

        for agent in agents:
            if self.agent_workload[agent] > 0:
                self.agent_workload[agent] -= 1

        logger.info(f"Completed task {task_id}")

    def get_system_status(self) -> Dict[str, Any]:
        """获取系统状态"""
        return {
            "active_tasks": len(self.active_tasks),
            "queued_tasks": len(self.task_queue),
            "agent_workload": dict(self.agent_workload),
            "total_capacity": len(self.agent_capabilities) * 10  # 假设每个Agent容量为10
        }

class StateSynchronizer:
    """状态同步与一致性保证"""

    def __init__(self):
        self.global_state: Dict[str, Any] = {}
        self.layer_states: Dict[int, Dict[str, Any]] = {
            1: {},  # Layer1
            2: {},  # Layer2
            3: {},  # Layer3
            4: {}   # Layer4
        }
        self.state_locks: Dict[str, asyncio.Lock] = {}
        self.state_history: List[Dict[str, Any]] = []
        self.max_history = 1000

    async def update_global_state(self, key: str, value: Any, source_layer: int = None):
        """更新全局状态"""
        if key not in self.state_locks:
            self.state_locks[key] = asyncio.Lock()

        async with self.state_locks[key]:
            old_value = self.global_state.get(key)
            self.global_state[key] = value

            # 记录状态变更历史
            self._record_state_change(key, old_value, value, source_layer)

            # 通知其他层
            await self._notify_state_change(key, value, source_layer)

    async def update_layer_state(self, layer: int, key: str, value: Any):
        """更新层级状态"""
        if layer not in self.layer_states:
            self.layer_states[layer] = {}

        layer_key = f"layer_{layer}_{key}"
        await self.update_global_state(layer_key, value, layer)
        self.layer_states[layer][key] = value

    async def get_state(self, key: str, default: Any = None) -> Any:
        """获取状态值"""
        if key in self.state_locks:
            async with self.state_locks[key]:
                return self.global_state.get(key, default)
        return self.global_state.get(key, default)

    async def sync_states(self, keys: List[str]) -> Dict[str, Any]:
        """同步多个状态值"""
        result = {}
        for key in keys:
            result[key] = await self.get_state(key)
        return result

    def _record_state_change(self, key: str, old_value: Any, new_value: Any, source_layer: int):
        """记录状态变更"""
        change_record = {
            "timestamp": datetime.now().isoformat(),
            "key": key,
            "old_value": old_value,
            "new_value": new_value,
            "source_layer": source_layer
        }

        self.state_history.append(change_record)

        # 限制历史记录长度
        if len(self.state_history) > self.max_history:
            self.state_history = self.state_history[-self.max_history:]

    async def _notify_state_change(self, key: str, value: Any, source_layer: int):
        """通知状态变更"""
        # 简化的通知机制
        logger.info(f"State changed: {key} = {value} (from layer {source_layer})")

        # 这里可以添加更复杂的通知逻辑，比如：
        # - 通知相关的Agent
        # - 触发相关的业务逻辑
        # - 更新缓存等

    def get_state_summary(self) -> Dict[str, Any]:
        """获取状态摘要"""
        return {
            "global_state_size": len(self.global_state),
            "layer_states": {layer: len(state) for layer, state in self.layer_states.items()},
            "recent_changes": len([h for h in self.state_history if
                                datetime.fromisoformat(h["timestamp"]) > datetime.now() - timedelta(minutes=5)]),
            "total_changes": len(self.state_history)
        }

class Layer1CoreInteraction:
    """第一层核心交互逻辑主控制器"""

    def __init__(self):
        self.context_manager = ContextManager()
        self.intent_analyzer = IntentAnalyzer()
        self.dynamic_router = DynamicRouter()
        self.state_synchronizer = StateSynchronizer()

        # 性能监控
        self.performance_metrics = {
            "total_requests": 0,
            "avg_response_time": 0.0,
            "intent_accuracy": 0.0,
            "routing_success_rate": 0.0
        }

    async def process_user_input(self, user_id: str, session_id: str,
                               user_input: str, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """处理用户输入的主要接口"""
        start_time = datetime.now()

        try:
            # 1. 获取或创建用户上下文
            context = self.context_manager.create_or_update_context(
                user_id, session_id, user_input, metadata
            )

            # 2. 分析意图
            intent = self.intent_analyzer.analyze_intent(user_input, context)
            context.current_intent = intent

            # 3. 评估复杂度
            complexity = self.intent_analyzer.assess_complexity(user_input, intent)

            # 4. 提取实体
            entities = self.intent_analyzer.extract_entities(user_input)

            # 5. 创建任务请求
            task = TaskRequest(
                task_id=str(uuid.uuid4()),
                user_input=user_input,
                intent=intent,
                complexity=complexity,
                context=context,
                metadata={
                    "entities": entities,
                    **(metadata or {})
                }
            )

            # 6. 路由任务
            assigned_agents = self.dynamic_router.route_task(task)
            self.dynamic_router.assign_task(task, assigned_agents)

            # 7. 更新状态
            await self.state_synchronizer.update_layer_state(
                1, f"task_{task.task_id}", {
                    "status": "routed",
                    "agents": assigned_agents,
                    "intent": intent.value,
                    "complexity": complexity.value
                }
            )

            # 8. 更新性能指标
            self._update_performance_metrics(start_time, True)

            return {
                "task_id": task.task_id,
                "intent": intent.value,
                "complexity": complexity.value,
                "assigned_agents": assigned_agents,
                "entities": entities,
                "context_summary": self.context_manager.get_context_summary(context),
                "estimated_duration": task.estimated_duration.total_seconds()
            }

        except Exception as e:
            self._update_performance_metrics(start_time, False)
            logger.error(f"Error processing user input: {e}")
            raise

    def _update_performance_metrics(self, start_time: datetime, success: bool):
        """更新性能指标"""
        response_time = (datetime.now() - start_time).total_seconds()

        self.performance_metrics["total_requests"] += 1

        # 更新平均响应时间
        total = self.performance_metrics["total_requests"]
        current_avg = self.performance_metrics["avg_response_time"]
        self.performance_metrics["avg_response_time"] = (
            (current_avg * (total - 1) + response_time) / total
        )

        # 更新成功率
        if not hasattr(self, 'successful_requests'):
            self.successful_requests = 0
        if success:
            self.successful_requests += 1

        self.performance_metrics["routing_success_rate"] = (
            self.successful_requests / total * 100
        )

    async def get_system_status(self) -> Dict[str, Any]:
        """获取系统整体状态"""
        return {
            "layer1_status": {
                "active_contexts": len(self.context_manager.active_contexts),
                "routing_status": self.dynamic_router.get_system_status(),
                "state_summary": self.state_synchronizer.get_state_summary(),
                "performance_metrics": self.performance_metrics
            },
            "timestamp": datetime.now().isoformat()
        }

    async def cleanup_expired_resources(self):
        """清理过期资源"""
        # 清理过期上下文
        expired_contexts = []
        now = datetime.now()

        for context_key, context in self.context_manager.active_contexts.items():
            if now - context.last_activity > self.context_manager.session_timeout:
                expired_contexts.append(context_key)

        for context_key in expired_contexts:
            self.context_manager.cleanup_context(context_key)

        logger.info(f"Cleaned up {len(expired_contexts)} expired contexts")

# 使用示例
async def main():
    """主函数示例"""
    layer1 = Layer1CoreInteraction()

    # 模拟用户输入
    test_inputs = [
        ("user1", "session1", "帮我分析一下AI投资的趋势"),
        ("user1", "session1", "生成一个关于小红书的内容创作策略"),
        ("user2", "session1", "我想学习机器学习的基础知识"),
        ("user1", "session2", "系统状态怎么样？")
    ]

    for user_id, session_id, user_input in test_inputs:
        result = await layer1.process_user_input(user_id, session_id, user_input)
        print(f"Processed: {user_input}")
        print(f"Intent: {result['intent']}, Complexity: {result['complexity']}")
        print(f"Agents: {result['assigned_agents']}")
        print("-" * 50)

    # 获取系统状态
    status = await layer1.get_system_status()
    print("System Status:", json.dumps(status, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    asyncio.run(main())