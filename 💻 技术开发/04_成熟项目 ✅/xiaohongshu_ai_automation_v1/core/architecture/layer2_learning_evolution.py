#!/usr/bin/env python3
"""
Agent OS四层BMAD混合智能架构 - Layer2 学习进化逻辑层
Learning Evolution Logic Layer - 行为模式学习、知识生态进化、个性化权重调整

基于小红书业务场景的实时学习和自优化系统
"""

import asyncio
import json
import logging
import numpy as np
import pickle
import time
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
from typing import Dict, List, Optional, Any, Set, Tuple, Callable, Union
from pathlib import Path
import uuid
from collections import defaultdict, deque
import threading
import statistics
from concurrent.futures import ThreadPoolExecutor

logger = logging.getLogger(__name__)


class LearningEventType(Enum):
    """学习事件类型"""
    USER_INTERACTION = "user_interaction"      # 用户交互
    CONTENT_PERFORMANCE = "content_performance"  # 内容表现
    TREND_CHANGE = "trend_change"             # 趋势变化
    AGENT_COLLABORATION = "agent_collaboration" # Agent协作
    SYSTEM_FEEDBACK = "system_feedback"       # 系统反馈
    ERROR_CORRECTION = "error_correction"     # 错误纠正
    KNOWLEDGE_UPDATE = "knowledge_update"     # 知识更新


class LearningMode(Enum):
    """学习模式"""
    ONLINE_LEARNING = "online_learning"       # 在线学习
    BATCH_LEARNING = "batch_learning"         # 批量学习
    REINFORCEMENT = "reinforcement"           # 强化学习
    TRANSFER_LEARNING = "transfer_learning"   # 迁移学习
    FEDERATED_LEARNING = "federated_learning" # 联邦学习


class KnowledgeType(Enum):
    """知识类型"""
    EXPLICIT = "explicit"                     # 显性知识
    TACIT = "tacit"                          # 隐性知识
    PROCEDURAL = "procedural"               # 程序性知识
    DECLARATIVE = "declarative"             # 陈述性知识


@dataclass
class LearningEvent:
    """学习事件"""
    event_id: str
    event_type: LearningEventType
    timestamp: datetime
    source: str
    data: Dict[str, Any]
    context: Dict[str, Any] = field(default_factory=dict)
    confidence: float = 1.0
    priority: int = 2
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class BehaviorPattern:
    """行为模式"""
    pattern_id: str
    pattern_type: str
    features: Dict[str, Any]
    frequency: float
    confidence: float
    last_seen: datetime
    success_rate: float
    associated_outcomes: List[str] = field(default_factory=list)


@dataclass
class KnowledgeNode:
    """知识节点"""
    node_id: str
    knowledge_type: KnowledgeType
    content: Dict[str, Any]
    connections: Set[str] = field(default_factory=set)
    weight: float = 1.0
    created_at: datetime = field(default_factory=datetime.now)
    last_accessed: datetime = field(default_factory=datetime.now)
    access_count: int = 0
    confidence: float = 1.0


@dataclass
class PersonalizationProfile:
    """个性化配置文件"""
    user_id: str
    preference_weights: Dict[str, float] = field(default_factory=dict)
    behavior_patterns: List[BehaviorPattern] = field(default_factory=list)
    learning_history: List[str] = field(default_factory=list)
    adaptation_rate: float = 0.1
    last_updated: datetime = field(default_factory=datetime.now)


class BehaviorPatternAnalyzer:
    """行为模式分析器 - 识别和学习用户行为模式"""

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self.logger = logging.getLogger(f"{__name__}.BehaviorPatternAnalyzer")

        # 模式检测配置
        self.min_pattern_frequency = 3
        self.pattern_confidence_threshold = 0.7
        self.max_pattern_history = 1000

        # 行为序列存储
        self.behavior_sequences = deque(maxlen=self.max_pattern_history)
        self.detected_patterns: Dict[str, BehaviorPattern] = {}

        # 模式检测算法
        self.pattern_detectors = {
            "sequential": self._detect_sequential_patterns,
            "temporal": self._detect_temporal_patterns,
            "contextual": self._detect_contextual_patterns,
            "collaborative": self._detect_collaborative_patterns
        }

    async def analyze_behavior(self, events: List[LearningEvent]) -> List[BehaviorPattern]:
        """分析行为并识别模式"""
        # 添加事件到序列
        for event in events:
            self.behavior_sequences.append({
                "event": event,
                "timestamp": event.timestamp,
                "features": self._extract_features(event)
            })

        # 运行模式检测
        new_patterns = []
        for detector_name, detector_func in self.pattern_detectors.items():
            try:
                patterns = await detector_func()
                new_patterns.extend(patterns)
            except Exception as e:
                self.logger.error(f"Pattern detector {detector_name} error: {e}")

        # 更新模式库
        await self._update_pattern_library(new_patterns)

        return new_patterns

    async def _extract_features(self, event: LearningEvent) -> Dict[str, Any]:
        """提取事件特征"""
        features = {
            "event_type": event.event_type.value,
            "source": event.source,
            "hour_of_day": event.timestamp.hour,
            "day_of_week": event.timestamp.weekday(),
            "confidence": event.confidence,
            "priority": event.priority
        }

        # 提取特定事件类型的特征
        if event.event_type == LearningEventType.USER_INTERACTION:
            features.update({
                "interaction_type": event.data.get("interaction_type", "unknown"),
                "content_type": event.data.get("content_type", "unknown"),
                "duration": event.data.get("duration", 0)
            })
        elif event.event_type == LearningEventType.CONTENT_PERFORMANCE:
            features.update({
                "performance_metrics": event.data.get("metrics", {}),
                "content_category": event.data.get("category", "unknown"),
                "viral_score": event.data.get("viral_score", 0)
            })

        return features

    async def _detect_sequential_patterns(self) -> List[BehaviorPattern]:
        """检测序列模式"""
        if len(self.behavior_sequences) < self.min_pattern_frequency:
            return []

        patterns = []
        sequence_window = 5

        # 滑动窗口分析序列
        for i in range(len(self.behavior_sequences) - sequence_window + 1):
            window = list(self.behavior_sequences)[i:i + sequence_window]
            sequence_pattern = self._create_sequence_pattern(window)
            if sequence_pattern:
                patterns.append(sequence_pattern)

        return patterns

    async def _detect_temporal_patterns(self) -> List[BehaviorPattern]:
        """检测时间模式"""
        patterns = []

        # 按时间分组分析
        time_groups = defaultdict(list)
        for seq in self.behavior_sequences:
            hour = seq["timestamp"].hour
            time_groups[hour].append(seq)

        # 分析时间模式
        for hour, sequences in time_groups.items():
            if len(sequences) >= self.min_pattern_frequency:
                pattern = await self._create_temporal_pattern(hour, sequences)
                if pattern:
                    patterns.append(pattern)

        return patterns

    async def _detect_contextual_patterns(self) -> List[BehaviorPattern]:
        """检测上下文模式"""
        patterns = []

        # 按上下文分组
        context_groups = defaultdict(list)
        for seq in self.behavior_sequences:
            context_key = self._create_context_key(seq["event"])
            context_groups[context_key].append(seq)

        # 分析上下文模式
        for context, sequences in context_groups.items():
            if len(sequences) >= self.min_pattern_frequency:
                pattern = await self._create_contextual_pattern(context, sequences)
                if pattern:
                    patterns.append(pattern)

        return patterns

    async def _detect_collaborative_patterns(self) -> List[BehaviorPattern]:
        """检测协作模式"""
        patterns = []

        # 分析Agent协作模式
        collaboration_events = [
            seq for seq in self.behavior_sequences
            if seq["event"].event_type == LearningEventType.AGENT_COLLABORATION
        ]

        if len(collaboration_events) >= self.min_pattern_frequency:
            pattern = await self._create_collaboration_pattern(collaboration_events)
            if pattern:
                patterns.append(pattern)

        return patterns

    def _create_sequence_pattern(self, window: List[Dict]) -> Optional[BehaviorPattern]:
        """创建序列模式"""
        event_types = [seq["features"]["event_type"] for seq in window]
        pattern_key = "->".join(event_types)

        # 计算模式频率和置信度
        frequency = self._calculate_pattern_frequency(pattern_key)
        confidence = self._calculate_pattern_confidence(window)

        if frequency >= self.min_pattern_frequency and confidence >= self.pattern_confidence_threshold:
            return BehaviorPattern(
                pattern_id=f"seq_{uuid.uuid4().hex[:8]}",
                pattern_type="sequential",
                features={
                    "event_sequence": event_types,
                    "avg_confidence": statistics.mean([seq["features"]["confidence"] for seq in window]),
                    "context_features": self._extract_context_features(window)
                },
                frequency=frequency,
                confidence=confidence,
                last_seen=window[-1]["timestamp"],
                success_rate=self._calculate_success_rate(window)
            )

        return None

    async def _create_temporal_pattern(self, hour: int, sequences: List[Dict]) -> Optional[BehaviorPattern]:
        """创建时间模式"""
        # 分析该时间段的行为特征
        event_types = [seq["features"]["event_type"] for seq in sequences]
        most_common_type = statistics.mode(event_types)

        confidence = len(sequences) / len(self.behavior_sequences)

        return BehaviorPattern(
            pattern_id=f"temp_{uuid.uuid4().hex[:8]}",
            pattern_type="temporal",
            features={
                "hour": hour,
                "dominant_event_type": most_common_type,
                "event_distribution": {etype: event_types.count(etype) for etype in set(event_types)}
            },
            frequency=len(sequences),
            confidence=confidence,
            last_seen=max([seq["timestamp"] for seq in sequences]),
            success_rate=self._calculate_success_rate(sequences)
        )

    async def _create_contextual_pattern(self, context: str, sequences: List[Dict]) -> Optional[BehaviorPattern]:
        """创建上下文模式"""
        confidence = len(sequences) / len(self.behavior_sequences)

        return BehaviorPattern(
            pattern_id=f"ctx_{uuid.uuid4().hex[:8]}",
            pattern_type="contextual",
            features={
                "context": context,
                "typical_events": [seq["features"]["event_type"] for seq in sequences[:5]],
                "avg_confidence": statistics.mean([seq["features"]["confidence"] for seq in sequences])
            },
            frequency=len(sequences),
            confidence=confidence,
            last_seen=max([seq["timestamp"] for seq in sequences]),
            success_rate=self._calculate_success_rate(sequences)
        )

    async def _create_collaboration_pattern(self, collaboration_events: List[Dict]) -> Optional[BehaviorPattern]:
        """创建协作模式"""
        # 分析Agent协作模式
        agent_pairs = []
        for seq in collaboration_events:
            agents = seq["event"].data.get("agents", [])
            if len(agents) >= 2:
                agent_pairs.append(tuple(sorted(agents)))

        # 找出最常见的协作对
        if agent_pairs:
            most_common_pair = statistics.mode(agent_pairs)
            frequency = agent_pairs.count(most_common_pair)

            return BehaviorPattern(
                pattern_id=f"col_{uuid.uuid4().hex[:8]}",
                pattern_type="collaborative",
                features={
                    "agent_pair": most_common_pair,
                    "collaboration_type": collaboration_events[0]["event"].data.get("type", "unknown")
                },
                frequency=frequency,
                confidence=frequency / len(collaboration_events),
                last_seen=max([seq["timestamp"] for seq in collaboration_events]),
                success_rate=self._calculate_success_rate(collaboration_events)
            )

        return None

    def _create_context_key(self, event: LearningEvent) -> str:
        """创建上下文键"""
        context_parts = [
            event.source,
            event.data.get("content_type", "unknown"),
            str(event.timestamp.hour),
        ]
        return "_".join(context_parts)

    def _calculate_pattern_frequency(self, pattern_key: str) -> int:
        """计算模式频率"""
        # 简化实现，实际应该更复杂的序列匹配
        count = 0
        sequence_window = 5
        pattern_events = pattern_key.split("->")

        for i in range(len(self.behavior_sequences) - sequence_window + 1):
            window = list(self.behavior_sequences)[i:i + sequence_window]
            window_events = [seq["features"]["event_type"] for seq in window]
            if window_events == pattern_events:
                count += 1

        return count

    def _calculate_pattern_confidence(self, window: List[Dict]) -> float:
        """计算模式置信度"""
        confidences = [seq["features"]["confidence"] for seq in window]
        return statistics.mean(confidences)

    def _calculate_success_rate(self, sequences: List[Dict]) -> float:
        """计算成功率"""
        successes = sum(1 for seq in sequences if seq["event"].data.get("success", True))
        return successes / len(sequences) if sequences else 0.0

    def _extract_context_features(self, window: List[Dict]) -> Dict[str, Any]:
        """提取上下文特征"""
        return {
            "avg_duration": statistics.mean([seq["features"].get("duration", 0) for seq in window]),
            "time_span": (window[-1]["timestamp"] - window[0]["timestamp"]).total_seconds(),
            "unique_sources": len(set(seq["event"].source for seq in window))
        }

    async def _update_pattern_library(self, new_patterns: List[BehaviorPattern]):
        """更新模式库"""
        for pattern in new_patterns:
            # 检查是否已存在相似模式
            existing_pattern = await self._find_similar_pattern(pattern)
            if existing_pattern:
                # 更新现有模式
                await self._merge_patterns(existing_pattern, pattern)
            else:
                # 添加新模式
                self.detected_patterns[pattern.pattern_id] = pattern

        # 清理过期模式
        await self._cleanup_expired_patterns()

    async def _find_similar_pattern(self, pattern: BehaviorPattern) -> Optional[BehaviorPattern]:
        """查找相似模式"""
        for existing in self.detected_patterns.values():
            if existing.pattern_type == pattern.pattern_type:
                similarity = await self._calculate_pattern_similarity(existing, pattern)
                if similarity > 0.8:
                    return existing
        return None

    async def _calculate_pattern_similarity(self, pattern1: BehaviorPattern, pattern2: BehaviorPattern) -> float:
        """计算模式相似度"""
        if pattern1.pattern_type != pattern2.pattern_type:
            return 0.0

        # 简化的相似度计算
        feature_similarity = 0.0
        common_features = set(pattern1.features.keys()) & set(pattern2.features.keys())

        for feature in common_features:
            if pattern1.features[feature] == pattern2.features[feature]:
                feature_similarity += 1.0

        return feature_similarity / len(common_features) if common_features else 0.0

    async def _merge_patterns(self, existing: BehaviorPattern, new: BehaviorPattern):
        """合并模式"""
        # 更新频率和置信度
        existing.frequency = (existing.frequency + new.frequency) / 2
        existing.confidence = max(existing.confidence, new.confidence)
        existing.last_seen = max(existing.last_seen, new.last_seen)
        existing.success_rate = (existing.success_rate + new.success_rate) / 2

    async def _cleanup_expired_patterns(self):
        """清理过期模式"""
        cutoff_time = datetime.now() - timedelta(days=7)
        expired_patterns = [
            pid for pid, pattern in self.detected_patterns.items()
            if pattern.last_seen < cutoff_time
        ]

        for pid in expired_patterns:
            del self.detected_patterns[pid]
            self.logger.info(f"Cleaned up expired pattern: {pid}")


class KnowledgeGraphManager:
    """知识图谱管理器 - 构建和维护知识生态系统"""

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self.logger = logging.getLogger(f"{__name__}.KnowledgeGraphManager")

        # 知识图谱存储
        self.knowledge_nodes: Dict[str, KnowledgeNode] = {}
        self.knowledge_edges: Dict[str, Dict[str, float]] = defaultdict(dict)  # node_id -> {connected_node_id: weight}

        # 图谱配置
        self.max_nodes = 10000
        self.edge_weight_threshold = 0.1
        self.knowledge_decay_rate = 0.01

        # 知识类型处理器
        self.knowledge_processors = {
            KnowledgeType.EXPLICIT: self._process_explicit_knowledge,
            KnowledgeType.TACIT: self._process_tacit_knowledge,
            KnowledgeType.PROCEDURAL: self._process_procedural_knowledge,
            KnowledgeType.DECLARATIVE: self._process_declarative_knowledge
        }

        # 启动知识维护任务
        asyncio.create_task(self._knowledge_maintenance())

    async def add_knowledge(self, knowledge_type: KnowledgeType, content: Dict[str, Any],
                          source: str, confidence: float = 1.0) -> str:
        """添加知识节点"""
        node_id = f"knowledge_{uuid.uuid4().hex[:8]}"

        # 创建知识节点
        node = KnowledgeNode(
            node_id=node_id,
            knowledge_type=knowledge_type,
            content=content,
            confidence=confidence,
            weight=self._calculate_initial_weight(knowledge_type, content)
        )

        # 添加元数据
        node.content["source"] = source
        node.content["created_at"] = datetime.now().isoformat()

        # 处理知识
        processor = self.knowledge_processors.get(knowledge_type)
        if processor:
            await processor(node)

        # 存储节点
        self.knowledge_nodes[node_id] = node

        # 建立连接
        await self._establish_connections(node)

        self.logger.info(f"Added knowledge node: {node_id} ({knowledge_type.value})")
        return node_id

    async def query_knowledge(self, query: Dict[str, Any], max_results: int = 10) -> List[KnowledgeNode]:
        """查询知识"""
        relevant_nodes = []

        for node in self.knowledge_nodes.values():
            relevance_score = await self._calculate_relevance(node, query)
            if relevance_score > 0.3:  # 相关性阈值
                relevant_nodes.append((node, relevance_score))

        # 按相关性排序
        relevant_nodes.sort(key=lambda x: x[1], reverse=True)

        # 更新访问信息
        results = []
        for node, _ in relevant_nodes[:max_results]:
            node.last_accessed = datetime.now()
            node.access_count += 1
            results.append(node)

        return results

    async def evolve_knowledge(self, feedback: Dict[str, Any]):
        """基于反馈进化知识"""
        for node_id, feedback_data in feedback.items():
            node = self.knowledge_nodes.get(node_id)
            if not node:
                continue

            # 更新置信度
            if "accuracy" in feedback_data:
                node.confidence = node.confidence * 0.8 + feedback_data["accuracy"] * 0.2

            # 更新权重
            if "usefulness" in feedback_data:
                node.weight *= (1.0 + feedback_data["usefulness"] * 0.1)

            # 更新内容
            if "corrections" in feedback_data:
                await self._apply_corrections(node, feedback_data["corrections"])

        # 重新计算连接权重
        await self._recalculate_edge_weights()

    async def _process_explicit_knowledge(self, node: KnowledgeNode):
        """处理显性知识"""
        # 显性知识通常有明确的结构化信息
        content = node.content

        # 提取关键词和概念
        if "keywords" not in content:
            content["keywords"] = self._extract_keywords(content)

        # 建立分类标签
        if "categories" not in content:
            content["categories"] = self._classify_content(content)

    async def _process_tacit_knowledge(self, node: KnowledgeNode):
        """处理隐性知识"""
        # 隐性知识需要通过模式识别来提取
        content = node.content

        # 识别隐含的模式和规则
        patterns = self._identify_implicit_patterns(content)
        content["patterns"] = patterns

        # 推断隐含关系
        relations = self._infer_implicit_relations(content)
        content["relations"] = relations

    async def _process_procedural_knowledge(self, node: KnowledgeNode):
        """处理程序性知识"""
        # 程序性知识涉及操作步骤和流程
        content = node.content

        # 标准化流程描述
        if "steps" in content:
            content["steps"] = self._standardize_procedure(content["steps"])

        # 提取前置条件和后置条件
        content["preconditions"] = self._extract_preconditions(content)
        content["postconditions"] = self._extract_postconditions(content)

    async def _process_declarative_knowledge(self, node: KnowledgeNode):
        """处理陈述性知识"""
        # 陈述性知识涉及事实和概念
        content = node.content

        # 提取实体和属性
        content["entities"] = self._extract_entities(content)
        content["attributes"] = self._extract_attributes(content)

        # 建立语义关系
        content["semantic_relations"] = self._establish_semantic_relations(content)

    async def _establish_connections(self, new_node: KnowledgeNode):
        """建立知识节点间的连接"""
        for existing_node in self.knowledge_nodes.values():
            if existing_node.node_id == new_node.node_id:
                continue

            # 计算连接权重
            connection_weight = await self._calculate_connection_weight(new_node, existing_node)

            if connection_weight > self.edge_weight_threshold:
                # 建立双向连接
                self.knowledge_edges[new_node.node_id][existing_node.node_id] = connection_weight
                self.knowledge_edges[existing_node.node_id][new_node.node_id] = connection_weight

                # 更新节点连接
                new_node.connections.add(existing_node.node_id)
                existing_node.connections.add(new_node.node_id)

    async def _calculate_connection_weight(self, node1: KnowledgeNode, node2: KnowledgeNode) -> float:
        """计算连接权重"""
        weight = 0.0

        # 内容相似度
        content_similarity = await self._calculate_content_similarity(node1.content, node2.content)
        weight += content_similarity * 0.4

        # 类型兼容性
        if node1.knowledge_type == node2.knowledge_type:
            weight += 0.2

        # 主题相关性
        topic_overlap = await self._calculate_topic_overlap(node1.content, node2.content)
        weight += topic_overlap * 0.3

        # 时间相关性
        time_diff = abs((node1.created_at - node2.created_at).total_seconds())
        time_relevance = max(0, 1.0 - time_diff / (30 * 24 * 3600))  # 30天内的相关性
        weight += time_relevance * 0.1

        return min(1.0, weight)

    async def _calculate_content_similarity(self, content1: Dict[str, Any], content2: Dict[str, Any]) -> float:
        """计算内容相似度"""
        # 简化的相似度计算
        common_keys = set(content1.keys()) & set(content2.keys())
        if not common_keys:
            return 0.0

        similarity = 0.0
        for key in common_keys:
            if content1[key] == content2[key]:
                similarity += 1.0
            elif isinstance(content1[key], str) and isinstance(content2[key], str):
                # 文本相似度
                words1 = set(content1[key].lower().split())
                words2 = set(content2[key].lower().split())
                intersection = words1 & words2
                union = words1 | words2
                similarity += len(intersection) / len(union) if union else 0.0

        return similarity / len(common_keys)

    async def _calculate_topic_overlap(self, content1: Dict[str, Any], content2: Dict[str, Any]) -> float:
        """计算主题重叠度"""
        topics1 = set(content1.get("keywords", []))
        topics2 = set(content2.get("keywords", []))

        if not topics1 or not topics2:
            return 0.0

        intersection = topics1 & topics2
        union = topics1 | topics2
        return len(intersection) / len(union) if union else 0.0

    async def _calculate_relevance(self, node: KnowledgeNode, query: Dict[str, Any]) -> float:
        """计算节点与查询的相关性"""
        relevance = 0.0

        # 关键词匹配
        query_keywords = set(query.get("keywords", []))
        node_keywords = set(node.content.get("keywords", []))
        keyword_match = len(query_keywords & node_keywords) / len(query_keywords) if query_keywords else 0.0
        relevance += keyword_match * 0.4

        # 类型匹配
        if query.get("knowledge_type") == node.knowledge_type:
            relevance += 0.2

        # 内容匹配
        content_match = await self._calculate_content_similarity(node.content, query)
        relevance += content_match * 0.3

        # 权重和置信度
        relevance += (node.weight * node.confidence) * 0.1

        return min(1.0, relevance)

    async def _knowledge_maintenance(self):
        """知识维护任务"""
        while True:
            try:
                await asyncio.sleep(3600)  # 每小时维护一次

                # 知识衰减
                await self._apply_knowledge_decay()

                # 清理无用知识
                await self._cleanup_useless_knowledge()

                # 重新计算连接
                await self._recalculate_edge_weights()

            except Exception as e:
                self.logger.error(f"Knowledge maintenance error: {e}")

    async def _apply_knowledge_decay(self):
        """应用知识衰减"""
        for node in self.knowledge_nodes.values():
            # 基于时间衰减
            days_since_creation = (datetime.now() - node.created_at).days
            decay_factor = max(0.5, 1.0 - days_since_creation * self.knowledge_decay_rate)

            node.weight *= decay_factor
            node.confidence *= decay_factor

    async def _cleanup_useless_knowledge(self):
        """清理无用知识"""
        # 删除权重过低的知识
        useless_nodes = [
            node_id for node_id, node in self.knowledge_nodes.items()
            if node.weight < 0.1 and node.confidence < 0.3
        ]

        for node_id in useless_nodes:
            await self._remove_knowledge_node(node_id)

        # 限制知识节点总数
        if len(self.knowledge_nodes) > self.max_nodes:
            # 删除最不重要的节点
            sorted_nodes = sorted(
                self.knowledge_nodes.items(),
                key=lambda x: x[1].weight * x[1].confidence
            )
            excess = len(self.knowledge_nodes) - self.max_nodes
            for node_id, _ in sorted_nodes[:excess]:
                await self._remove_knowledge_node(node_id)

    async def _remove_knowledge_node(self, node_id: str):
        """删除知识节点"""
        if node_id in self.knowledge_nodes:
            node = self.knowledge_nodes[node_id]

            # 删除连接
            for connected_id in node.connections:
                self.knowledge_edges[connected_id].pop(node_id, None)
                self.knowledge_edges[node_id].pop(connected_id, None)

            # 删除节点
            del self.knowledge_nodes[node_id]
            self.logger.info(f"Removed knowledge node: {node_id}")

    async def _recalculate_edge_weights(self):
        """重新计算边权重"""
        for node_id in self.knowledge_nodes:
            self.knowledge_edges[node_id].clear()

        for node1 in self.knowledge_nodes.values():
            for node2 in self.knowledge_nodes.values():
                if node1.node_id >= node2.node_id:
                    continue

                weight = await self._calculate_connection_weight(node1, node2)
                if weight > self.edge_weight_threshold:
                    self.knowledge_edges[node1.node_id][node2.node_id] = weight
                    self.knowledge_edges[node2.node_id][node1.node_id] = weight

    # 辅助方法
    def _calculate_initial_weight(self, knowledge_type: KnowledgeType, content: Dict[str, Any]) -> float:
        """计算初始权重"""
        base_weights = {
            KnowledgeType.EXPLICIT: 0.8,
            KnowledgeType.TACIT: 0.6,
            KnowledgeType.PROCEDURAL: 0.7,
            KnowledgeType.DECLARATIVE: 0.9
        }
        return base_weights.get(knowledge_type, 0.5)

    def _extract_keywords(self, content: Dict[str, Any]) -> List[str]:
        """提取关键词"""
        # 简化的关键词提取
        text = str(content.get("text", "") + " " + str(content.get("title", "")))
        words = text.lower().split()
        # 过滤常见词
        stop_words = {"的", "是", "在", "了", "和", "与", "the", "a", "an", "is", "are", "in", "on", "at"}
        keywords = [word for word in words if len(word) > 2 and word not in stop_words]
        return list(set(keywords[:10]))  # 返回前10个唯一关键词

    def _classify_content(self, content: Dict[str, Any]) -> List[str]:
        """内容分类"""
        # 简化的分类逻辑
        text = str(content).lower()
        categories = []

        if "小红书" in text or "内容" in text:
            categories.append("content_marketing")
        if "分析" in text or "数据" in text:
            categories.append("data_analysis")
        if "趋势" in text or "预测" in text:
            categories.append("trend_prediction")
        if "品牌" in text or "调性" in text:
            categories.append("brand_management")

        return categories or ["general"]

    def _identify_implicit_patterns(self, content: Dict[str, Any]) -> List[str]:
        """识别隐含模式"""
        # 简化实现
        return ["pattern_" + str(i) for i in range(3)]

    def _infer_implicit_relations(self, content: Dict[str, Any]) -> List[str]:
        """推断隐含关系"""
        # 简化实现
        return ["relation_" + str(i) for i in range(2)]

    def _standardize_procedure(self, steps: List[Any]) -> List[Dict[str, Any]]:
        """标准化流程"""
        standardized = []
        for i, step in enumerate(steps):
            standardized.append({
                "step_number": i + 1,
                "description": str(step),
                "type": "action"
            })
        return standardized

    def _extract_preconditions(self, content: Dict[str, Any]) -> List[str]:
        """提取前置条件"""
        return content.get("preconditions", [])

    def _extract_postconditions(self, content: Dict[str, Any]) -> List[str]:
        """提取后置条件"""
        return content.get("postconditions", [])

    def _extract_entities(self, content: Dict[str, Any]) -> List[str]:
        """提取实体"""
        text = str(content)
        # 简化的实体识别
        entities = []
        if "LaunchX" in text:
            entities.append("LaunchX")
        if "小红书" in text:
            entities.append("XiaoHongShu")
        return entities

    def _extract_attributes(self, content: Dict[str, Any]) -> Dict[str, Any]:
        """提取属性"""
        return content.get("attributes", {})

    def _establish_semantic_relations(self, content: Dict[str, Any]) -> List[Dict[str, Any]]:
        """建立语义关系"""
        return content.get("semantic_relations", [])

    async def _apply_corrections(self, node: KnowledgeNode, corrections: List[Dict[str, Any]]):
        """应用修正"""
        for correction in corrections:
            field = correction.get("field")
            value = correction.get("value")
            if field and value is not None:
                node.content[field] = value


class PersonalizationEngine:
    """个性化引擎 - 个性化权重调整和配置"""

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self.logger = logging.getLogger(f"{__name__}.PersonalizationEngine")

        # 用户配置文件存储
        self.user_profiles: Dict[str, PersonalizationProfile] = {}

        # 个性化参数
        self.learning_rate = 0.1
        self.adaptation_threshold = 0.05
        self.max_profile_history = 1000

        # 权重类别
        self.weight_categories = {
            "content_preference": 0.3,
            "interaction_style": 0.2,
            "time_preference": 0.15,
            "quality_threshold": 0.15,
            "exploration_tendency": 0.1,
            "collaboration_style": 0.1
        }

    async def create_profile(self, user_id: str) -> PersonalizationProfile:
        """创建用户配置文件"""
        profile = PersonalizationProfile(
            user_id=user_id,
            preference_weights=self.weight_categories.copy(),
            adaptation_rate=self.learning_rate
        )

        self.user_profiles[user_id] = profile
        self.logger.info(f"Created profile for user: {user_id}")
        return profile

    async def update_profile(self, user_id: str, interaction_data: Dict[str, Any]):
        """更新用户配置文件"""
        profile = self.user_profiles.get(user_id)
        if not profile:
            profile = await self.create_profile(user_id)

        # 分析交互数据
        insights = await self._analyze_interaction(interaction_data)

        # 更新偏好权重
        await self._update_preference_weights(profile, insights)

        # 更新行为模式
        await self._update_behavior_patterns(profile, interaction_data)

        # 记录学习历史
        profile.learning_history.append(json.dumps(interaction_data))
        if len(profile.learning_history) > self.max_profile_history:
            profile.learning_history.pop(0)

        profile.last_updated = datetime.now()

        self.logger.debug(f"Updated profile for user: {user_id}")

    async def get_personalized_weights(self, user_id: str) -> Dict[str, float]:
        """获取个性化权重"""
        profile = self.user_profiles.get(user_id)
        if not profile:
            return self.weight_categories.copy()

        return profile.preference_weights.copy()

    async def get_personalized_recommendations(self, user_id: str, context: Dict[str, Any]) -> List[Dict[str, Any]]:
        """获取个性化推荐"""
        profile = self.user_profiles.get(user_id)
        if not profile:
            return []

        recommendations = []

        # 基于行为模式推荐
        for pattern in profile.behavior_patterns:
            if await self._is_pattern_applicable(pattern, context):
                recommendations.append({
                    "type": "behavior_pattern",
                    "pattern": pattern.pattern_type,
                    "confidence": pattern.confidence,
                    "suggestion": f"基于您的{pattern.pattern_type}模式，建议..."
                })

        # 基于偏好权重推荐
        top_preferences = sorted(
            profile.preference_weights.items(),
            key=lambda x: x[1],
            reverse=True
        )[:3]

        for preference, weight in top_preferences:
            if weight > 0.6:
                recommendations.append({
                    "type": "preference_based",
                    "category": preference,
                    "weight": weight,
                    "suggestion": f"您对{preference}有较强偏好，建议关注相关内容"
                })

        return recommendations

    async def _analyze_interaction(self, interaction_data: Dict[str, Any]) -> Dict[str, Any]:
        """分析交互数据"""
        insights = {}

        # 分析内容偏好
        if "content_type" in interaction_data:
            content_type = interaction_data["content_type"]
            insights["content_preference"] = content_type

        # 分析交互风格
        if "interaction_duration" in interaction_data:
            duration = interaction_data["interaction_duration"]
            if duration > 60:  # 长时间交互
                insights["interaction_style"] = "detailed"
            else:
                insights["interaction_style"] = "quick"

        # 分析时间偏好
        if "timestamp" in interaction_data:
            timestamp = interaction_data["timestamp"]
            if isinstance(timestamp, str):
                timestamp = datetime.fromisoformat(timestamp)
            hour = timestamp.hour
            if 9 <= hour <= 17:
                insights["time_preference"] = "business_hours"
            elif 18 <= hour <= 22:
                insights["time_preference"] = "evening"
            else:
                insights["time_preference"] = "other"

        # 分析质量要求
        if "feedback_score" in interaction_data:
            score = interaction_data["feedback_score"]
            insights["quality_threshold"] = "high" if score > 0.8 else "medium"

        return insights

    async def _update_preference_weights(self, profile: PersonalizationProfile, insights: Dict[str, Any]):
        """更新偏好权重"""
        for category, insight in insights.items():
            if category in profile.preference_weights:
                # 计算权重调整
                current_weight = profile.preference_weights[category]
                adjustment = profile.adaptation_rate * (0.1 if insight == "high" else -0.05)
                new_weight = max(0.0, min(1.0, current_weight + adjustment))

                # 只在变化足够大时更新
                if abs(new_weight - current_weight) > self.adaptation_threshold:
                    profile.preference_weights[category] = new_weight

    async def _update_behavior_patterns(self, profile: PersonalizationProfile, interaction_data: Dict[str, Any]):
        """更新行为模式"""
        # 简化的行为模式更新
        new_pattern = BehaviorPattern(
            pattern_id=f"pattern_{uuid.uuid4().hex[:8]}",
            pattern_type="user_interaction",
            features={
                "interaction_type": interaction_data.get("type", "unknown"),
                "content_category": interaction_data.get("content_type", "unknown"),
                "timestamp": interaction_data.get("timestamp", datetime.now().isoformat())
            },
            frequency=1.0,
            confidence=0.5,
            last_seen=datetime.now(),
            success_rate=interaction_data.get("success", True)
        )

        # 检查是否已存在相似模式
        similar_pattern = await self._find_similar_behavior_pattern(profile, new_pattern)
        if similar_pattern:
            # 更新现有模式
            similar_pattern.frequency = (similar_pattern.frequency + new_pattern.frequency) / 2
            similar_pattern.confidence = max(similar_pattern.confidence, new_pattern.confidence)
            similar_pattern.last_seen = new_pattern.last_seen
        else:
            # 添加新模式
            profile.behavior_patterns.append(new_pattern)
            # 限制模式数量
            if len(profile.behavior_patterns) > 50:
                profile.behavior_patterns.pop(0)

    async def _find_similar_behavior_pattern(self, profile: PersonalizationProfile, new_pattern: BehaviorPattern) -> Optional[BehaviorPattern]:
        """查找相似行为模式"""
        for existing in profile.behavior_patterns:
            if (existing.pattern_type == new_pattern.pattern_type and
                existing.features.get("interaction_type") == new_pattern.features.get("interaction_type")):
                return existing
        return None

    async def _is_pattern_applicable(self, pattern: BehaviorPattern, context: Dict[str, Any]) -> bool:
        """判断模式是否适用"""
        # 简化的适用性判断
        pattern_time = pattern.last_seen
        current_time = datetime.now()
        time_diff = (current_time - pattern_time).total_seconds()

        # 如果模式最近被观察到且置信度较高，则认为适用
        return time_diff < 7 * 24 * 3600 and pattern.confidence > 0.6


class LearningEvolutionLayer:
    """学习进化逻辑层主控制器"""

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self.logger = logging.getLogger(f"{__name__}.LearningEvolutionLayer")

        # 初始化组件
        self.behavior_analyzer = BehaviorPatternAnalyzer(config)
        self.knowledge_manager = KnowledgeGraphManager(config)
        self.personalization_engine = PersonalizationEngine(config)

        # 学习事件队列
        self.learning_events = asyncio.Queue()
        self.learning_results = defaultdict(list)

        # 性能指标
        self.learning_metrics = {
            "total_events_processed": 0,
            "patterns_discovered": 0,
            "knowledge_nodes_created": 0,
            "personalization_updates": 0,
            "average_learning_time": 0.0,
            "learning_accuracy": 0.0
        }

        # 启动学习处理任务
        asyncio.create_task(self._process_learning_events())
        asyncio.create_task(self._periodic_learning_report())

    async def process_learning_event(self, event: LearningEvent) -> Dict[str, Any]:
        """处理学习事件"""
        start_time = time.time()

        try:
            # 添加到事件队列
            await self.learning_events.put(event)

            # 根据事件类型处理
            result = await self._handle_learning_event(event)

            # 更新性能指标
            processing_time = time.time() - start_time
            await self._update_learning_metrics(processing_time, True)

            return {
                "success": True,
                "event_id": event.event_id,
                "processing_time": processing_time,
                "result": result
            }

        except Exception as e:
            processing_time = time.time() - start_time
            self.logger.error(f"Learning event processing error: {e}")
            await self._update_learning_metrics(processing_time, False)

            return {
                "success": False,
                "event_id": event.event_id,
                "error": str(e),
                "processing_time": processing_time
            }

    async def _handle_learning_event(self, event: LearningEvent) -> Dict[str, Any]:
        """处理具体的学习事件"""
        result = {"event_type": event.event_type.value, "actions_taken": []}

        if event.event_type == LearningEventType.USER_INTERACTION:
            # 分析用户行为模式
            patterns = await self.behavior_analyzer.analyze_behavior([event])
            if patterns:
                result["actions_taken"].append(f"Discovered {len(patterns)} behavior patterns")
                result["new_patterns"] = [p.pattern_id for p in patterns]

            # 更新个性化配置
            if event.source and event.data:
                await self.personalization_engine.update_profile(event.source, event.data)
                result["actions_taken"].append("Updated personalization profile")

        elif event.event_type == LearningEventType.CONTENT_PERFORMANCE:
            # 添加内容性能知识
            knowledge_id = await self.knowledge_manager.add_knowledge(
                KnowledgeType.EXPLICIT,
                {
                    "type": "content_performance",
                    "metrics": event.data.get("metrics", {}),
                    "content_id": event.data.get("content_id"),
                    "performance_score": event.data.get("score", 0)
                },
                event.source,
                event.confidence
            )
            result["actions_taken"].append(f"Added performance knowledge: {knowledge_id}")

        elif event.event_type == LearningEventType.TREND_CHANGE:
            # 添加趋势知识
            knowledge_id = await self.knowledge_manager.add_knowledge(
                KnowledgeType.DECLARATIVE,
                {
                    "type": "trend_change",
                    "trend_data": event.data,
                    "detected_at": event.timestamp.isoformat()
                },
                event.source,
                event.confidence
            )
            result["actions_taken"].append(f"Added trend knowledge: {knowledge_id}")

        elif event.event_type == LearningEventType.AGENT_COLLABORATION:
            # 添加协作知识
            knowledge_id = await self.knowledge_manager.add_knowledge(
                KnowledgeType.PROCEDURAL,
                {
                    "type": "agent_collaboration",
                    "collaboration_data": event.data,
                    "agents": event.data.get("agents", []),
                    "outcome": event.data.get("outcome", "unknown")
                },
                event.source,
                event.confidence
            )
            result["actions_taken"].append(f"Added collaboration knowledge: {knowledge_id}")

        # 存储学习结果
        self.learning_results[event.event_type.value].append(result)

        return result

    async def query_knowledge(self, query: Dict[str, Any], max_results: int = 10) -> List[Dict[str, Any]]:
        """查询知识库"""
        knowledge_nodes = await self.knowledge_manager.query_knowledge(query, max_results)

        return [
            {
                "node_id": node.node_id,
                "knowledge_type": node.knowledge_type.value,
                "content": node.content,
                "confidence": node.confidence,
                "weight": node.weight,
                "access_count": node.access_count
            }
            for node in knowledge_nodes
        ]

    async def get_personalized_insights(self, user_id: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """获取个性化洞察"""
        # 获取个性化权重
        weights = await self.personalization_engine.get_personalized_weights(user_id)

        # 获取个性化推荐
        recommendations = await self.personalization_engine.get_personalized_recommendations(user_id, context)

        # 获取相关知识
        relevant_knowledge = await self.query_knowledge(
            {"keywords": context.get("keywords", []), "user_context": True},
            max_results=5
        )

        return {
            "user_id": user_id,
            "personalization_weights": weights,
            "recommendations": recommendations,
            "relevant_knowledge": relevant_knowledge,
            "generated_at": datetime.now().isoformat()
        }

    async def get_behavior_patterns(self, pattern_type: Optional[str] = None) -> List[Dict[str, Any]]:
        """获取行为模式"""
        patterns = list(self.behavior_analyzer.detected_patterns.values())

        if pattern_type:
            patterns = [p for p in patterns if p.pattern_type == pattern_type]

        return [
            {
                "pattern_id": p.pattern_id,
                "pattern_type": p.pattern_type,
                "frequency": p.frequency,
                "confidence": p.confidence,
                "last_seen": p.last_seen.isoformat(),
                "features": p.features
            }
            for p in patterns
        ]

    async def evolve_system(self, feedback: Dict[str, Any]):
        """系统进化"""
        # 进化知识图谱
        if "knowledge_feedback" in feedback:
            await self.knowledge_manager.evolve_knowledge(feedback["knowledge_feedback"])

        # 调整个性化参数
        if "personalization_feedback" in feedback:
            for user_id, user_feedback in feedback["personalization_feedback"].items():
                await self.personalization_engine.update_profile(user_id, user_feedback)

        self.logger.info("System evolution completed based on feedback")

    async def _process_learning_events(self):
        """处理学习事件队列"""
        while True:
            try:
                event = await self.learning_events.get()
                await self._handle_learning_event(event)
            except Exception as e:
                self.logger.error(f"Learning event queue processing error: {e}")

    async def _periodic_learning_report(self):
        """定期学习报告"""
        while True:
            try:
                await asyncio.sleep(3600)  # 每小时报告一次

                report = await self.generate_learning_report()
                self.logger.info(f"Learning report: {report}")

            except Exception as e:
                self.logger.error(f"Learning report generation error: {e}")

    async def generate_learning_report(self) -> Dict[str, Any]:
        """生成学习报告"""
        return {
            "timestamp": datetime.now().isoformat(),
            "metrics": self.learning_metrics.copy(),
            "behavior_patterns": len(self.behavior_analyzer.detected_patterns),
            "knowledge_nodes": len(self.knowledge_manager.knowledge_nodes),
            "knowledge_edges": sum(len(edges) for edges in self.knowledge_manager.knowledge_edges.values()),
            "user_profiles": len(self.personalization_engine.user_profiles),
            "learning_events_in_queue": self.learning_events.qsize()
        }

    async def _update_learning_metrics(self, processing_time: float, success: bool):
        """更新学习性能指标"""
        self.learning_metrics["total_events_processed"] += 1

        if success:
            # 更新平均处理时间
            total = self.learning_metrics["total_events_processed"]
            current_avg = self.learning_metrics["average_learning_time"]
            self.learning_metrics["average_learning_time"] = (
                (current_avg * (total - 1) + processing_time) / total
            )

    async def get_layer_status(self) -> Dict[str, Any]:
        """获取层状态信息"""
        return {
            "layer_name": "layer2_learning_evolution",
            "components": {
                "behavior_analyzer": {
                    "patterns_detected": len(self.behavior_analyzer.detected_patterns),
                    "behavior_sequences": len(self.behavior_analyzer.behavior_sequences)
                },
                "knowledge_manager": {
                    "knowledge_nodes": len(self.knowledge_manager.knowledge_nodes),
                    "knowledge_edges": sum(len(edges) for edges in self.knowledge_manager.knowledge_edges.values())
                },
                "personalization_engine": {
                    "user_profiles": len(self.personalization_engine.user_profiles),
                    "learning_rate": self.personalization_engine.learning_rate
                }
            },
            "learning_metrics": self.learning_metrics.copy(),
            "queue_status": {
                "learning_events": self.learning_events.qsize()
            }
        }


# 工厂函数和便利接口
async def create_learning_evolution_layer(config: Optional[Dict[str, Any]] = None) -> LearningEvolutionLayer:
    """创建学习进化逻辑层实例"""
    return LearningEvolutionLayer(config)


# 主要接口函数
async def process_learning(event_data: Dict[str, Any], config: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """处理学习事件的便利函数"""
    layer = await create_learning_evolution_layer(config)

    event = LearningEvent(
        event_id=event_data.get("event_id", f"event_{uuid.uuid4().hex[:8]}"),
        event_type=LearningEventType(event_data["event_type"]),
        timestamp=datetime.fromisoformat(event_data.get("timestamp", datetime.now().isoformat())),
        source=event_data["source"],
        data=event_data["data"],
        confidence=event_data.get("confidence", 1.0)
    )

    return await layer.process_learning_event(event)


if __name__ == "__main__":
    # 示例用法和测试
    async def main():
        config = {
            "max_nodes": 5000,
            "learning_rate": 0.15
        }

        layer = await create_learning_evolution_layer(config)

        # 测试学习事件处理
        event_data = {
            "event_type": "user_interaction",
            "timestamp": datetime.now().isoformat(),
            "source": "user_001",
            "data": {
                "interaction_type": "content_analysis",
                "content_type": "xiaohongshu_post",
                "duration": 120,
                "success": True
            },
            "confidence": 0.9
        }

        result = await process_learning(event_data, config)
        print("Learning Result:", json.dumps(result, indent=2, ensure_ascii=False))

        # 获取层状态
        status = await layer.get_layer_status()
        print("\nLayer Status:", json.dumps(status, indent=2, ensure_ascii=False))

        # 生成学习报告
        report = await layer.generate_learning_report()
        print("\nLearning Report:", json.dumps(report, indent=2, ensure_ascii=False))

    asyncio.run(main())