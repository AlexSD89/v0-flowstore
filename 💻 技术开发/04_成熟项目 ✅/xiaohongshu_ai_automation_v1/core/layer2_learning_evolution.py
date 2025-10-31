#!/usr/bin/env python3
"""
Agent OS System - Layer2 Learning Evolution Logic
Agent OS系统 - 第二层：学习进化逻辑层

核心功能：行为模式学习、知识生态进化、个性化权重调整
Based on BMAD Hybrid Intelligence Architecture
Version: 1.0
Created: 2025-01-22
"""

import asyncio
import json
import logging
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple, Set
from dataclasses import dataclass, field
from enum import Enum
import uuid
import re
import math
from collections import defaultdict, Counter

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BehaviorPattern(Enum):
    """行为模式类型"""
    CONTENT_PREFERENCE = "content_preference"        # 内容偏好模式
    TIME_USAGE = "time_usage"                       # 时间使用模式
    INTERACTION_STYLE = "interaction_style"        # 交互风格模式
    DECISION_MAKING = "decision_making"            # 决策模式
    LEARNING_PROGRESS = "learning_progress"         # 学习进度模式
    TASK_SEQUENCING = "task_sequencing"           # 任务序列模式
    ERROR_HANDLING = "error_handling"              # 错误处理模式

class KnowledgeType(Enum):
    """知识类型"""
    FACTUAL = "factual"           # 事实性知识
    PROCEDURAL = "procedural"     # 程序性知识
    CONCEPTUAL = "conceptual"     # 概念性知识
    META_COGNITIVE = "meta"       # 元认知知识
    EXPERIENTIAL = "experiential" # 经验性知识

class LearningEventType(Enum):
    """学习事件类型"""
    SUCCESSFUL_TASK = "successful_task"           # 成功完成任务
    FAILED_TASK = "failed_task"                   # 任务失败
    USER_FEEDBACK = "user_feedback"               # 用户反馈
    PATTERN_DETECTED = "pattern_detected"         # 检测到模式
    KNOWLEDGE_ACQUIRED = "knowledge_acquired"     # 获得知识
    PERFORMANCE_CHANGE = "performance_change"     # 性能变化
    CONTEXT_SWITCH = "context_switch"             # 上下文切换

@dataclass
class BehaviorData:
    """行为数据"""
    user_id: str
    session_id: str
    timestamp: datetime
    action_type: str
    action_data: Dict[str, Any]
    context: Dict[str, Any]
    outcome: Optional[str] = None
    duration: Optional[float] = None
    satisfaction_score: Optional[float] = None

@dataclass
class LearningEvent:
    """学习事件"""
    event_id: str
    event_type: LearningEventType
    user_id: str
    timestamp: datetime
    data: Dict[str, Any]
    confidence: float = 1.0
    impact_score: float = 1.0

@dataclass
class KnowledgeNode:
    """知识节点"""
    node_id: str
    knowledge_type: KnowledgeType
    content: str
    confidence: float
    last_updated: datetime
    access_count: int = 0
    related_nodes: Set[str] = field(default_factory=set)
    value_score: float = 1.0
    decay_rate: float = 0.1

class BehaviorPatternAnalyzer:
    """行为模式分析器"""

    def __init__(self, pattern_window: timedelta = timedelta(days=30)):
        self.pattern_window = pattern_window
        self.behavior_history: List[BehaviorData] = []
        self.detected_patterns: Dict[str, Dict[str, Any]] = {}
        self.pattern_models = {
            BehaviorPattern.CONTENT_PREFERENCE: self._analyze_content_preference,
            BehaviorPattern.TIME_USAGE: self._analyze_time_usage,
            BehaviorPattern.INTERACTION_STYLE: self._analyze_interaction_style,
            BehaviorPattern.DECISION_MAKING: self._analyze_decision_making,
            BehaviorPattern.LEARNING_PROGRESS: self._analyze_learning_progress,
            BehaviorPattern.TASK_SEQUENCING: self._analyze_task_sequencing,
            BehaviorPattern.ERROR_HANDLING: self._analyze_error_handling
        }

    def record_behavior(self, behavior: BehaviorData):
        """记录行为数据"""
        self.behavior_history.append(behavior)

        # 限制历史数据长度
        cutoff_date = datetime.now() - self.pattern_window
        self.behavior_history = [
            b for b in self.behavior_history if b.timestamp > cutoff_date
        ]

        # 触发模式检测
        asyncio.create_task(self._detect_patterns(behavior.user_id))

    async def _detect_patterns(self, user_id: str):
        """检测用户行为模式"""
        user_behaviors = [b for b in self.behavior_history if b.user_id == user_id]

        for pattern_type, analyzer in self.pattern_models.items():
            try:
                pattern_result = analyzer(user_behaviors)
                if pattern_result:
                    pattern_key = f"{user_id}_{pattern_type.value}"
                    self.detected_patterns[pattern_key] = {
                        "pattern_type": pattern_type.value,
                        "detected_at": datetime.now().isoformat(),
                        "confidence": pattern_result.get("confidence", 0.0),
                        "features": pattern_result.get("features", {}),
                        "predictions": pattern_result.get("predictions", {})
                    }
                    logger.info(f"Detected {pattern_type.value} pattern for user {user_id}")
            except Exception as e:
                logger.error(f"Error detecting pattern {pattern_type.value}: {e}")

    def _analyze_content_preference(self, behaviors: List[BehaviorData]) -> Dict[str, Any]:
        """分析内容偏好模式"""
        content_actions = [b for b in behaviors if "content" in b.action_type.lower()]

        if len(content_actions) < 5:
            return {}

        # 分析内容主题偏好
        topics = []
        satisfaction_scores = []

        for action in content_actions:
            if "topic" in action.action_data:
                topics.append(action.action_data["topic"])
            if action.satisfaction_score:
                satisfaction_scores.append(action.satisfaction_score)

        # 计算主题偏好强度
        topic_counts = Counter(topics)
        total_actions = len(content_actions)
        topic_preferences = {topic: count/total_actions for topic, count in topic_counts.items()}

        # 计算平均满意度
        avg_satisfaction = sum(satisfaction_scores) / len(satisfaction_scores) if satisfaction_scores else 0

        return {
            "confidence": min(len(content_actions) / 20.0, 1.0),
            "features": {
                "preferred_topics": topic_preferences,
                "avg_satisfaction": avg_satisfaction,
                "content_diversity": len(topic_counts) / max(total_actions, 1)
            },
            "predictions": {
                "next_likely_topic": max(topic_preferences.items(), key=lambda x: x[1])[0] if topic_preferences else None,
                "satisfaction_trend": "improving" if len(satisfaction_scores) > 5 and satisfaction_scores[-1] > satisfaction_scores[0] else "stable"
            }
        }

    def _analyze_time_usage(self, behaviors: List[BehaviorData]) -> Dict[str, Any]:
        """分析时间使用模式"""
        if len(behaviors) < 10:
            return {}

        # 按小时分组
        hourly_activity = defaultdict(int)
        session_durations = []

        for behavior in behaviors:
            hour = behavior.timestamp.hour
            hourly_activity[hour] += 1

            if behavior.duration:
                session_durations.append(behavior.duration)

        # 计算活跃时间段
        sorted_hours = sorted(hourly_activity.items(), key=lambda x: x[1], reverse=True)
        peak_hours = [hour for hour, count in sorted_hours[:3] if count > 0]

        # 计算平均会话时长
        avg_session_duration = sum(session_durations) / len(session_durations) if session_durations else 0

        return {
            "confidence": min(len(behaviors) / 50.0, 1.0),
            "features": {
                "peak_hours": peak_hours,
                "hourly_distribution": dict(hourly_activity),
                "avg_session_duration": avg_session_duration,
                "activity_consistency": len(set(hour for hour in hourly_activity.keys())) / 24.0
            },
            "predictions": {
                "next_active_hour": peak_hours[0] if peak_hours else None,
                "optimal_session_length": avg_session_duration * 1.2
            }
        }

    def _analyze_interaction_style(self, behaviors: List[BehaviorData]) -> Dict[str, Any]:
        """分析交互风格模式"""
        interaction_actions = [b for b in behaviors if "query" in b.action_type.lower() or "request" in b.action_type.lower()]

        if len(interaction_actions) < 5:
            return {}

        # 分析查询长度和复杂度
        query_lengths = []
        formal_indicators = []
        question_types = []

        for action in interaction_actions:
            if "query_text" in action.action_data:
                query_text = action.action_data["query_text"]
                query_lengths.append(len(query_text))

                # 正式程度指标
                formal_score = 0
                if any(indicator in query_text.lower() for indicator in ["请", "您", "谢谢"]):
                    formal_score += 1
                if query_text.endswith("?") or query_text.endswith("？"):
                    formal_score += 1
                formal_indicators.append(formal_score)

                # 问题类型
                if query_text.startswith(("如何", "怎么", "how")):
                    question_types.append("how")
                elif query_text.startswith(("什么", "which", "what")):
                    question_types.append("what")
                elif query_text.startswith(("为什么", "why")):
                    question_types.append("why")
                else:
                    question_types.append("other")

        avg_query_length = sum(query_lengths) / len(query_lengths) if query_lengths else 0
        avg_formality = sum(formal_indicators) / len(formal_indicators) if formal_indicators else 0

        return {
            "confidence": min(len(interaction_actions) / 30.0, 1.0),
            "features": {
                "avg_query_length": avg_query_length,
                "formality_level": avg_formality / 2.0,  # 归一化到0-1
                "question_type_distribution": dict(Counter(question_types)),
                "query_diversity": len(set(query_lengths)) / max(len(query_lengths), 1)
            },
            "predictions": {
                "communication_style": "formal" if avg_formality > 1.5 else "casual",
                "preferred_response_length": "detailed" if avg_query_length > 50 else "concise"
            }
        }

    def _analyze_decision_making(self, behaviors: List[BehaviorData]) -> Dict[str, Any]:
        """分析决策模式"""
        decision_actions = [b for b in behaviors if "decision" in b.action_type.lower() or "choice" in b.action_type.lower()]

        if len(decision_actions) < 3:
            return {}

        # 分析决策速度和结果
        decision_times = []
        decision_outcomes = []

        for action in decision_actions:
            if "decision_time" in action.action_data:
                decision_times.append(action.action_data["decision_time"])
            if action.outcome:
                decision_outcomes.append(action.outcome)

        # 计算决策特征
        avg_decision_time = sum(decision_times) / len(decision_times) if decision_times else 0
        success_rate = len([o for o in decision_outcomes if o == "success"]) / len(decision_outcomes) if decision_outcomes else 0

        return {
            "confidence": min(len(decision_actions) / 15.0, 1.0),
            "features": {
                "avg_decision_time": avg_decision_time,
                "success_rate": success_rate,
                "decision_frequency": len(decision_actions),
                "risk_tolerance": self._calculate_risk_tolerance(decision_actions)
            },
            "predictions": {
                "decision_style": "analytical" if avg_decision_time > 10 else "intuitive",
                "future_success_probability": success_rate * 1.1  # 简单预测
            }
        }

    def _analyze_learning_progress(self, behaviors: List[BehaviorData]) -> Dict[str, Any]:
        """分析学习进度模式"""
        learning_actions = [b for b in behaviors if "learn" in b.action_type.lower() or "study" in b.action_type.lower()]

        if len(learning_actions) < 5:
            return {}

        # 按时间排序分析进度
        learning_actions.sort(key=lambda x: x.timestamp)
        completion_rates = []
        difficulty_levels = []

        for i, action in enumerate(learning_actions):
            if "completion_rate" in action.action_data:
                completion_rates.append(action.action_data["completion_rate"])
            if "difficulty_level" in action.action_data:
                difficulty_levels.append(action.action_data["difficulty_level"])

        # 计算学习趋势
        learning_trend = 0
        if len(completion_rates) >= 3:
            recent_avg = sum(completion_rates[-3:]) / 3
            early_avg = sum(completion_rates[:3]) / 3
            learning_trend = (recent_avg - early_avg) / early_avg if early_avg > 0 else 0

        avg_difficulty = sum(difficulty_levels) / len(difficulty_levels) if difficulty_levels else 0

        return {
            "confidence": min(len(learning_actions) / 25.0, 1.0),
            "features": {
                "learning_frequency": len(learning_actions),
                "completion_trend": learning_trend,
                "avg_difficulty_level": avg_difficulty,
                "learning_consistency": self._calculate_learning_consistency(learning_actions)
            },
            "predictions": {
                "next_difficulty_level": avg_difficulty + 0.1,
                "mastery_probability": max(completion_rates) if completion_rates else 0
            }
        }

    def _analyze_task_sequencing(self, behaviors: List[BehaviorData]) -> Dict[str, Any]:
        """分析任务序列模式"""
        if len(behaviors) < 10:
            return {}

        # 提取任务序列
        task_sequence = [b.action_type for b in behaviors]
        task_pairs = [(task_sequence[i], task_sequence[i+1]) for i in range(len(task_sequence)-1)]

        # 计算转换频率
        transition_counts = Counter(task_pairs)
        total_transitions = len(task_pairs)

        # 找出常见模式
        common_patterns = [(pair, count/total_transitions) for pair, count in transition_counts.most_common(5)]

        return {
            "confidence": min(len(behaviors) / 40.0, 1.0),
            "features": {
                "common_transitions": dict(common_patterns),
                "sequence_diversity": len(set(task_pairs)) / max(total_transitions, 1),
                "task_switching_frequency": len(set(task_sequence)) / len(task_sequence)
            },
            "predictions": {
                "next_likely_task": transition_counts.most_common(1)[0][0][1] if transition_counts else None,
                "optimal_sequence_length": self._calculate_optimal_sequence_length(behaviors)
            }
        }

    def _analyze_error_handling(self, behaviors: List[BehaviorData]) -> Dict[str, Any]:
        """分析错误处理模式"""
        error_actions = [b for b in behaviors if b.outcome == "error" or "error" in b.action_type.lower()]

        if len(error_actions) < 2:
            return {}

        # 分析错误恢复模式
        recovery_times = []
        recovery_strategies = []

        for i, error_action in enumerate(error_actions):
            if i < len(behaviors) - 1:
                next_action = behaviors[i + 1]
                if next_action.outcome == "success":
                    recovery_time = (next_action.timestamp - error_action.timestamp).total_seconds()
                    recovery_times.append(recovery_time)

                    # 识别恢复策略
                    if "retry" in next_action.action_type.lower():
                        recovery_strategies.append("retry")
                    elif "help" in next_action.action_type.lower():
                        recovery_strategies.append("seek_help")
                    else:
                        recovery_strategies.append("alternative")

        avg_recovery_time = sum(recovery_times) / len(recovery_times) if recovery_times else 0
        recovery_success_rate = len(recovery_times) / len(error_actions) if error_actions else 0

        return {
            "confidence": min(len(error_actions) / 20.0, 1.0),
            "features": {
                "error_frequency": len(error_actions),
                "avg_recovery_time": avg_recovery_time,
                "recovery_success_rate": recovery_success_rate,
                "preferred_recovery_strategy": Counter(recovery_strategies).most_common(1)[0][0] if recovery_strategies else None
            },
            "predictions": {
                "resilience_score": recovery_success_rate * (1 / (1 + avg_recovery_time/60)),
                "improvement_trend": self._calculate_error_trend(error_actions)
            }
        }

    def _calculate_risk_tolerance(self, decision_actions: List[BehaviorData]) -> float:
        """计算风险承受能力"""
        # 简化实现：基于决策时间和结果多样性
        decision_times = [action.action_data.get("decision_time", 0) for action in decision_actions]
        outcomes = [action.outcome for action in decision_actions if action.outcome]

        if not decision_times or not outcomes:
            return 0.5

        avg_time = sum(decision_times) / len(decision_times)
        outcome_diversity = len(set(outcomes)) / len(outcomes)

        # 快速决策 + 多样化结果 = 高风险承受能力
        risk_score = (1 / (1 + avg_time/10)) * outcome_diversity
        return min(max(risk_score, 0), 1)

    def _calculate_learning_consistency(self, learning_actions: List[BehaviorData]) -> float:
        """计算学习一致性"""
        if len(learning_actions) < 5:
            return 0.5

        # 计算时间间隔的一致性
        time_intervals = []
        for i in range(1, len(learning_actions)):
            interval = (learning_actions[i].timestamp - learning_actions[i-1].timestamp).total_seconds()
            time_intervals.append(interval)

        if not time_intervals:
            return 0.5

        avg_interval = sum(time_intervals) / len(time_intervals)
        variance = sum((interval - avg_interval)**2 for interval in time_intervals) / len(time_intervals)

        # 低方差 = 高一致性
        consistency = 1 / (1 + variance / (avg_interval**2 + 1))
        return min(max(consistency, 0), 1)

    def _calculate_optimal_sequence_length(self, behaviors: List[BehaviorData]) -> int:
        """计算最优序列长度"""
        # 简化实现：基于成功序列的平均长度
        successful_sequences = []
        current_sequence = []

        for behavior in behaviors:
            current_sequence.append(behavior)
            if behavior.outcome == "success":
                successful_sequences.append(len(current_sequence))
                current_sequence = []
            elif behavior.outcome == "error":
                current_sequence = []

        return int(sum(successful_sequences) / len(successful_sequences)) if successful_sequences else 3

    def _calculate_error_trend(self, error_actions: List[BehaviorData]) -> str:
        """计算错误趋势"""
        if len(error_actions) < 5:
            return "stable"

        # 简化趋势分析
        recent_errors = error_actions[-3:]
        early_errors = error_actions[:3]

        recent_rate = len(recent_errors) / 3
        early_rate = len(early_errors) / 3

        if recent_rate < early_rate * 0.8:
            return "improving"
        elif recent_rate > early_rate * 1.2:
            return "worsening"
        else:
            return "stable"

    def get_user_patterns(self, user_id: str) -> Dict[str, Any]:
        """获取用户行为模式"""
        user_patterns = {}
        for pattern_key, pattern_data in self.detected_patterns.items():
            if pattern_key.startswith(f"{user_id}_"):
                pattern_type = pattern_key[len(f"{user_id}_"):]
                user_patterns[pattern_type] = pattern_data

        return user_patterns

class KnowledgeGraphManager:
    """知识图谱管理器"""

    def __init__(self, max_nodes: int = 10000):
        self.max_nodes = max_nodes
        self.knowledge_nodes: Dict[str, KnowledgeNode] = {}
        self.relationships: Dict[Tuple[str, str], str] = {}  # (node1_id, node2_id) -> relationship_type
        self.access_history: List[Tuple[str, datetime]] = []  # (node_id, timestamp)
        self.decay_scheduler = None

    def add_knowledge(self, content: str, knowledge_type: KnowledgeType,
                     confidence: float = 1.0, related_nodes: List[str] = None) -> str:
        """添加知识节点"""
        node_id = str(uuid.uuid4())

        # 创建知识节点
        node = KnowledgeNode(
            node_id=node_id,
            knowledge_type=knowledge_type,
            content=content,
            confidence=confidence,
            last_updated=datetime.now(),
            related_nodes=set(related_nodes or [])
        )

        # 检查容量限制
        if len(self.knowledge_nodes) >= self.max_nodes:
            self._prune_knowledge()

        self.knowledge_nodes[node_id] = node

        # 建立关系
        if related_nodes:
            for related_id in related_nodes:
                if related_id in self.knowledge_nodes:
                    self.relationships[(node_id, related_id)] = "related"
                    self.relationships[(related_id, node_id)] = "related"
                    self.knowledge_nodes[related_id].related_nodes.add(node_id)

        logger.info(f"Added knowledge node: {node_id} ({knowledge_type.value})")
        return node_id

    def access_knowledge(self, node_id: str) -> Optional[KnowledgeNode]:
        """访问知识节点"""
        if node_id not in self.knowledge_nodes:
            return None

        node = self.knowledge_nodes[node_id]
        node.access_count += 1
        node.last_updated = datetime.now()

        # 记录访问历史
        self.access_history.append((node_id, datetime.now()))

        # 限制访问历史长度
        if len(self.access_history) > 10000:
            self.access_history = self.access_history[-5000:]

        return node

    def update_knowledge_value(self, node_id: str, value_delta: float):
        """更新知识价值"""
        if node_id in self.knowledge_nodes:
            node = self.knowledge_nodes[node_id]
            node.value_score = max(0, node.value_score + value_delta)
            node.last_updated = datetime.now()

    def find_related_knowledge(self, node_id: str, max_depth: int = 2) -> List[str]:
        """查找相关知识"""
        if node_id not in self.knowledge_nodes:
            return []

        related = set()
        visited = set()
        queue = [(node_id, 0)]

        while queue:
            current_id, depth = queue.pop(0)
            if current_id in visited or depth >= max_depth:
                continue

            visited.add(current_id)

            if current_id in self.knowledge_nodes:
                related_nodes = self.knowledge_nodes[current_id].related_nodes
                for related_id in related_nodes:
                    if related_id not in visited:
                        related.add(related_id)
                        if depth + 1 < max_depth:
                            queue.append((related_id, depth + 1))

        return list(related)

    def search_knowledge(self, query: str, knowledge_type: Optional[KnowledgeType] = None,
                        limit: int = 10) -> List[Tuple[str, float]]:
        """搜索知识"""
        query_lower = query.lower()
        results = []

        for node_id, node in self.knowledge_nodes.items():
            # 类型过滤
            if knowledge_type and node.knowledge_type != knowledge_type:
                continue

            # 简单的文本匹配
            content_lower = node.content.lower()
            if query_lower in content_lower:
                # 计算相关性分数
                relevance_score = self._calculate_relevance(query_lower, content_lower, node)
                results.append((node_id, relevance_score))

        # 按相关性排序
        results.sort(key=lambda x: x[1], reverse=True)
        return results[:limit]

    def _calculate_relevance(self, query: str, content: str, node: KnowledgeNode) -> float:
        """计算相关性分数"""
        # 文本匹配分数
        text_score = sum(1 for word in query.split() if word in content.split()) / max(len(query.split()), 1)

        # 置信度权重
        confidence_weight = 0.3
        confidence_score = node.confidence * confidence_weight

        # 访问频率权重
        access_weight = 0.2
        access_score = min(node.access_count / 10.0, 1.0) * access_weight

        # 价值分数权重
        value_weight = 0.2
        value_score = min(node.value_score, 1.0) * value_weight

        # 新鲜度权重
        freshness_weight = 0.3
        days_old = (datetime.now() - node.last_updated).days
        freshness_score = max(0, 1 - days_old / 365) * freshness_weight

        total_score = (text_score * 0.7 + confidence_score + access_score + value_score + freshness_score)

        return total_score

    def _prune_knowledge(self):
        """清理低价值知识"""
        # 按价值分数排序，移除最低价值的节点
        sorted_nodes = sorted(self.knowledge_nodes.items(), key=lambda x: x[1].value_score)

        # 移除最低价值的10%节点
        prune_count = max(1, len(self.knowledge_nodes) // 10)
        nodes_to_remove = sorted_nodes[:prune_count]

        for node_id, node in nodes_to_remove:
            self._remove_node(node_id)

        logger.info(f"Pruned {prune_count} low-value knowledge nodes")

    def _remove_node(self, node_id: str):
        """移除知识节点"""
        if node_id in self.knowledge_nodes:
            node = self.knowledge_nodes[node_id]

            # 移除关系
            for related_id in node.related_nodes:
                self.relationships.pop((node_id, related_id), None)
                self.relationships.pop((related_id, node_id), None)
                if related_id in self.knowledge_nodes:
                    self.knowledge_nodes[related_id].related_nodes.discard(node_id)

            del self.knowledge_nodes[node_id]

    def get_knowledge_statistics(self) -> Dict[str, Any]:
        """获取知识图谱统计"""
        type_counts = defaultdict(int)
        total_value = 0
        total_access = 0

        for node in self.knowledge_nodes.values():
            type_counts[node.knowledge_type.value] += 1
            total_value += node.value_score
            total_access += node.access_count

        return {
            "total_nodes": len(self.knowledge_nodes),
            "total_relationships": len(self.relationships),
            "type_distribution": dict(type_counts),
            "total_value_score": total_value,
            "avg_access_count": total_access / len(self.knowledge_nodes) if self.knowledge_nodes else 0,
            "recent_accesses": len([t for _, t in self.access_history if datetime.now() - t < timedelta(days=7)])
        }

class PersonalizationEngine:
    """个性化权重调整引擎"""

    def __init__(self, learning_rate: float = 0.1):
        self.learning_rate = learning_rate
        self.user_profiles: Dict[str, Dict[str, Any]] = {}
        self.default_weights = {
            "content_creation": 0.5,
            "trend_analysis": 0.5,
            "investment_research": 0.5,
            "customer_service": 0.5,
            "system_management": 0.5,
            "learning_research": 0.5,
            "technical_development": 0.5
        }
        self.adaptation_history: List[Dict[str, Any]] = []

    def get_user_profile(self, user_id: str) -> Dict[str, Any]:
        """获取用户个性化配置"""
        if user_id not in self.user_profiles:
            self.user_profiles[user_id] = {
                "weights": self.default_weights.copy(),
                "preferences": {},
                "performance_history": [],
                "last_updated": datetime.now().isoformat()
            }

        return self.user_profiles[user_id]

    def update_weights(self, user_id: str, feedback: Dict[str, float]):
        """基于反馈更新权重"""
        profile = self.get_user_profile(user_id)
        weights = profile["weights"]

        for dimension, feedback_score in feedback.items():
            if dimension in weights:
                # 计算权重调整
                error = feedback_score - weights[dimension]
                adjustment = self.learning_rate * error
                weights[dimension] = max(0, min(1, weights[dimension] + adjustment))

        profile["last_updated"] = datetime.now().isoformat()

        # 记录调整历史
        self.adaptation_history.append({
            "user_id": user_id,
            "timestamp": datetime.now().isoformat(),
            "feedback": feedback,
            "new_weights": weights.copy(),
            "learning_rate": self.learning_rate
        })

        logger.info(f"Updated weights for user {user_id}")

    def adapt_learning_rate(self, user_id: str, performance_trend: float):
        """根据性能趋势调整学习率"""
        profile = self.get_user_profile(user_id)

        if performance_trend > 0.1:  # 性能提升
            new_rate = min(0.2, self.learning_rate * 1.1)
        elif performance_trend < -0.1:  # 性能下降
            new_rate = max(0.01, self.learning_rate * 0.9)
        else:  # 性能稳定
            new_rate = self.learning_rate

        self.learning_rate = new_rate
        profile["learning_rate"] = new_rate

    def get_personalized_recommendations(self, user_id: str) -> Dict[str, Any]:
        """获取个性化推荐"""
        profile = self.get_user_profile(user_id)
        weights = profile["weights"]

        # 找出权重最高的维度
        top_dimensions = sorted(weights.items(), key=lambda x: x[1], reverse=True)[:3]

        recommendations = {
            "preferred_dimensions": [dim for dim, _ in top_dimensions],
            "development_suggestions": self._generate_development_suggestions(weights),
            "content_preferences": self._infer_content_preferences(weights),
            "interaction_style": self._infer_interaction_style(profile)
        }

        return recommendations

    def _generate_development_suggestions(self, weights: Dict[str, float]) -> List[str]:
        """生成发展建议"""
        suggestions = []

        # 找出低权重的维度
        low_weights = [(dim, weight) for dim, weight in weights.items() if weight < 0.3]

        for dimension, weight in low_weights:
            suggestions.append(f"建议加强{dimension}方面的学习和实践")

        # 找出高权重的维度
        high_weights = [(dim, weight) for dim, weight in weights.items() if weight > 0.7]

        for dimension, weight in high_weights:
            suggestions.append(f"您在{dimension}方面表现出色，可以继续深入发展")

        return suggestions

    def _infer_content_preferences(self, weights: Dict[str, float]) -> Dict[str, str]:
        """推断内容偏好"""
        preferences = {}

        if weights.get("content_creation", 0) > 0.6:
            preferences["content_format"] = "creative_detailed"
        else:
            preferences["content_format"] = "structured_concise"

        if weights.get("trend_analysis", 0) > 0.6:
            preferences["analysis_depth"] = "comprehensive"
        else:
            preferences["analysis_depth"] = "summary"

        if weights.get("learning_research", 0) > 0.6:
            preferences["learning_style"] = "self_directed"
        else:
            preferences["learning_style"] = "guided"

        return preferences

    def _infer_interaction_style(self, profile: Dict[str, Any]) -> str:
        """推断交互风格"""
        weights = profile["weights"]

        technical_sum = weights.get("technical_development", 0) + weights.get("system_management", 0)
        creative_sum = weights.get("content_creation", 0) + weights.get("trend_analysis", 0)
        analytical_sum = weights.get("investment_research", 0) + weights.get("learning_research", 0)

        if technical_sum > creative_sum and technical_sum > analytical_sum:
            return "technical_direct"
        elif creative_sum > analytical_sum:
            return "creative_exploratory"
        else:
            return "analytical_methodical"

class Layer2LearningEvolution:
    """第二层学习进化逻辑主控制器"""

    def __init__(self):
        self.behavior_analyzer = BehaviorPatternAnalyzer()
        self.knowledge_manager = KnowledgeGraphManager()
        self.personalization_engine = PersonalizationEngine()

        # 学习事件处理
        self.learning_events: List[LearningEvent] = []
        self.event_handlers = {
            LearningEventType.SUCCESSFUL_TASK: self._handle_successful_task,
            LearningEventType.FAILED_TASK: self._handle_failed_task,
            LearningEventType.USER_FEEDBACK: self._handle_user_feedback,
            LearningEventType.PATTERN_DETECTED: self._handle_pattern_detected,
            LearningEventType.KNOWLEDGE_ACQUIRED: self._handle_knowledge_acquired,
            LearningEventType.PERFORMANCE_CHANGE: self._handle_performance_change,
            LearningEventType.CONTEXT_SWITCH: self._handle_context_switch
        }

    async def process_learning_event(self, event_type: LearningEventType,
                                    user_id: str, data: Dict[str, Any],
                                    confidence: float = 1.0, impact_score: float = 1.0):
        """处理学习事件"""
        event = LearningEvent(
            event_id=str(uuid.uuid4()),
            event_type=event_type,
            user_id=user_id,
            timestamp=datetime.now(),
            data=data,
            confidence=confidence,
            impact_score=impact_score
        )

        self.learning_events.append(event)

        # 调用相应的事件处理器
        if event_type in self.event_handlers:
            try:
                await self.event_handlers[event_type](event)
                logger.info(f"Processed learning event: {event_type.value} for user {user_id}")
            except Exception as e:
                logger.error(f"Error processing learning event {event_type.value}: {e}")

    async def _handle_successful_task(self, event: LearningEvent):
        """处理成功任务事件"""
        user_id = event.user_id
        task_data = event.data

        # 更新个性化权重
        feedback = {
            task_data.get("task_type", "general"): 1.0,
            "overall_performance": event.impact_score
        }
        self.personalization_engine.update_weights(user_id, feedback)

        # 添加成功经验知识
        knowledge_content = f"成功完成{task_data.get('task_type', '任务')}: {task_data.get('description', '')}"
        self.knowledge_manager.add_knowledge(
            content=knowledge_content,
            knowledge_type=KnowledgeType.EXPERIENTIAL,
            confidence=event.confidence
        )

    async def _handle_failed_task(self, event: LearningEvent):
        """处理任务失败事件"""
        user_id = event.user_id
        task_data = event.data

        # 更新个性化权重（负面反馈）
        feedback = {
            task_data.get("task_type", "general"): -0.5,
            "overall_performance": -event.impact_score * 0.5
        }
        self.personalization_engine.update_weights(user_id, feedback)

        # 添加错误处理知识
        knowledge_content = f"任务失败教训: {task_data.get('error_reason', '未知错误')} - {task_data.get('description', '')}"
        self.knowledge_manager.add_knowledge(
            content=knowledge_content,
            knowledge_type=KnowledgeType.META_COGNITIVE,
            confidence=event.confidence * 0.7  # 降低失败经验的置信度
        )

    async def _handle_user_feedback(self, event: LearningEvent):
        """处理用户反馈事件"""
        user_id = event.user_id
        feedback_data = event.data

        # 直接更新个性化权重
        self.personalization_engine.update_weights(user_id, feedback_data.get("ratings", {}))

        # 添加用户偏好知识
        if "preferences" in feedback_data:
            preferences = feedback_data["preferences"]
            knowledge_content = f"用户偏好: {json.dumps(preferences, ensure_ascii=False)}"
            self.knowledge_manager.add_knowledge(
                content=knowledge_content,
                knowledge_type=KnowledgeType.CONCEPTUAL,
                confidence=event.confidence
            )

    async def _handle_pattern_detected(self, event: LearningEvent):
        """处理模式检测事件"""
        user_id = event.user_id
        pattern_data = event.data

        # 添加行为模式知识
        pattern_type = pattern_data.get("pattern_type", "unknown")
        pattern_features = pattern_data.get("features", {})

        knowledge_content = f"用户行为模式 {pattern_type}: {json.dumps(pattern_features, ensure_ascii=False)}"
        self.knowledge_manager.add_knowledge(
            content=knowledge_content,
            knowledge_type=KnowledgeType.PROCEDURAL,
            confidence=event.confidence
        )

    async def _handle_knowledge_acquired(self, event: LearningEvent):
        """处理知识获取事件"""
        user_id = event.user_id
        knowledge_data = event.data

        # 添加到知识图谱
        content = knowledge_data.get("content", "")
        knowledge_type = KnowledgeType(knowledge_data.get("type", "factual"))
        confidence = event.confidence

        self.knowledge_manager.add_knowledge(
            content=content,
            knowledge_type=knowledge_type,
            confidence=confidence
        )

    async def _handle_performance_change(self, event: LearningEvent):
        """处理性能变化事件"""
        user_id = event.user_id
        performance_data = event.data

        # 调整学习率
        performance_trend = performance_data.get("trend", 0)
        self.personalization_engine.adapt_learning_rate(user_id, performance_trend)

    async def _handle_context_switch(self, event: LearningEvent):
        """处理上下文切换事件"""
        user_id = event.user_id
        context_data = event.data

        # 记录上下文切换模式
        from_context = context_data.get("from", "")
        to_context = context_data.get("to", "")

        knowledge_content = f"上下文切换模式: {from_context} -> {to_context}"
        self.knowledge_manager.add_knowledge(
            content=knowledge_content,
            knowledge_type=KnowledgeType.PROCEDURAL,
            confidence=event.confidence * 0.8
        )

    async def get_learning_insights(self, user_id: str) -> Dict[str, Any]:
        """获取学习洞察"""
        # 获取行为模式
        behavior_patterns = self.behavior_analyzer.get_user_patterns(user_id)

        # 获取个性化推荐
        personalization = self.personalization_engine.get_personalized_recommendations(user_id)

        # 获取相关知识
        user_profile = self.personalization_engine.get_user_profile(user_id)
        top_dimension = max(user_profile["weights"].items(), key=lambda x: x[1])[0]

        related_knowledge = self.knowledge_manager.search_knowledge(
            query=top_dimension[0],
            limit=5
        )

        return {
            "behavior_patterns": behavior_patterns,
            "personalization": personalization,
            "top_interest_dimension": top_dimension[0],
            "related_knowledge_count": len(related_knowledge),
            "learning_events_count": len([e for e in self.learning_events if e.user_id == user_id])
        }

    async def get_layer_status(self) -> Dict[str, Any]:
        """获取层级状态"""
        return {
            "behavior_patterns": {
                "total_patterns": len(self.behavior_analyzer.detected_patterns),
                "behaviors_analyzed": len(self.behavior_analyzer.behavior_history)
            },
            "knowledge_graph": self.knowledge_manager.get_knowledge_statistics(),
            "personalization": {
                "active_profiles": len(self.personalization_engine.user_profiles),
                "adaptation_history": len(self.personalization_engine.adaptation_history),
                "current_learning_rate": self.personalization_engine.learning_rate
            },
            "learning_events": {
                "total_events": len(self.learning_events),
                "recent_events": len([e for e in self.learning_events if
                                   datetime.now() - e.timestamp < timedelta(hours=24)])
            }
        }

# 使用示例
async def main():
    """主函数示例"""
    layer2 = Layer2LearningEvolution()

    # 模拟学习事件
    await layer2.process_learning_event(
        LearningEventType.SUCCESSFUL_TASK,
        "user1",
        {
            "task_type": "content_creation",
            "description": "成功生成小红书内容",
            "duration": 300
        },
        confidence=0.9,
        impact_score=0.8
    )

    await layer2.process_learning_event(
        LearningEventType.USER_FEEDBACK,
        "user1",
        {
            "ratings": {
                "content_creation": 0.9,
                "trend_analysis": 0.7
            },
            "preferences": {
                "style": "professional",
                "length": "medium"
            }
        },
        confidence=1.0,
        impact_score=0.9
    )

    # 获取学习洞察
    insights = await layer2.get_learning_insights("user1")
    print("Learning Insights:", json.dumps(insights, indent=2, ensure_ascii=False))

    # 获取层级状态
    status = await layer2.get_layer_status()
    print("Layer2 Status:", json.dumps(status, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    asyncio.run(main())