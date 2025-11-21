"""
Agent黑板协作系统 - 基于V3架构的分布式智能协作框架
实现70+ BMAD智能体的知识共享和问题求解协作机制

Core Features:
- 黑板空间管理: 支持多种数据结构的协作空间
- 知识源注册: 智能体能力注册和激活机制
- 冲突检测: 多智能体协作的冲突识别和解决
- 协作求解: 分布式问题求解算法
- 学习优化: 协作经验学习和性能优化
"""

import asyncio
import logging
import uuid
from datetime import datetime, timezone
from typing import Dict, List, Any, Optional, Set, Callable, Union
from dataclasses import dataclass, field
from enum import Enum
import json
from collections import defaultdict, deque
import weakref

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BlackboardSpaceType(Enum):
    """黑板空间类型"""
    SEMANTIC_ANALYSIS = "semantic_analysis"      # 语义分析空间
    CONTENT_GENERATION = "content_generation"    # 内容生成空间
    QUALITY_ASSESSMENT = "quality_assessment"    # 质量评估空间
    STRATEGY_PLANNING = "strategy_planning"      # 策略规划空间
    EXECUTION_MONITORING = "execution_monitoring" # 执行监控空间

class KnowledgeSourceType(Enum):
    """知识源类型"""
    AGENT = "agent"              # 智能体知识源
    ALGORITHM = "algorithm"      # 算法知识源
    DATABASE = "database"        # 数据库知识源
    EXTERNAL_API = "external_api" # 外部API知识源
    HUMAN = "human"              # 人工知识源

class ConflictResolutionStrategy(Enum):
    """冲突解决策略"""
    PRIORITY_BASED = "priority_based"    # 基于优先级
    CONSENSUS = "consensus"              # 共识机制
    ARBITRATION = "arbitration"          # 仲裁机制
    MERGE = "merge"                      # 合并策略
    VOTING = "voting"                    # 投票机制

@dataclass
class BlackboardEntry:
    """黑板条目"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    space_type: BlackboardSpaceType = BlackboardSpaceType.SEMANTIC_ANALYSIS
    content: Dict[str, Any] = field(default_factory=dict)
    metadata: Dict[str, Any] = field(default_factory=dict)
    source_id: str = ""
    source_type: KnowledgeSourceType = KnowledgeSourceType.AGENT
    timestamp: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    confidence: float = 0.0
    priority: int = 0
    dependencies: Set[str] = field(default_factory=set)
    tags: Set[str] = field(default_factory=set)
    version: int = 1

    def to_dict(self) -> Dict[str, Any]:
        """转换为字典格式"""
        return {
            'id': self.id,
            'space_type': self.space_type.value,
            'content': self.content,
            'metadata': self.metadata,
            'source_id': self.source_id,
            'source_type': self.source_type.value,
            'timestamp': self.timestamp.isoformat(),
            'confidence': self.confidence,
            'priority': self.priority,
            'dependencies': list(self.dependencies),
            'tags': list(self.tags),
            'version': self.version
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'BlackboardEntry':
        """从字典创建条目"""
        entry = cls()
        entry.id = data.get('id', str(uuid.uuid4()))
        entry.space_type = BlackboardSpaceType(data.get('space_type', 'semantic_analysis'))
        entry.content = data.get('content', {})
        entry.metadata = data.get('metadata', {})
        entry.source_id = data.get('source_id', '')
        entry.source_type = KnowledgeSourceType(data.get('source_type', 'agent'))

        if 'timestamp' in data:
            entry.timestamp = datetime.fromisoformat(data['timestamp'])

        entry.confidence = data.get('confidence', 0.0)
        entry.priority = data.get('priority', 0)
        entry.dependencies = set(data.get('dependencies', []))
        entry.tags = set(data.get('tags', []))
        entry.version = data.get('version', 1)

        return entry

@dataclass
class KnowledgeSource:
    """知识源定义"""
    id: str
    name: str
    type: KnowledgeSourceType
    capabilities: List[str] = field(default_factory=list)
    priority: int = 0
    availability: bool = True
    performance_history: List[float] = field(default_factory=list)
    collaboration_score: float = 0.0
    specializations: Set[str] = field(default_factory=set)

    def get_average_performance(self) -> float:
        """获取平均性能"""
        if not self.performance_history:
            return 0.0
        return sum(self.performance_history) / len(self.performance_history)

@dataclass
class Conflict:
    """冲突定义"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    entry_ids: Set[str] = field(default_factory=set)
    conflict_type: str = ""
    description: str = ""
    severity: float = 0.0
    detected_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    resolution_strategy: Optional[ConflictResolutionStrategy] = None
    resolved: bool = False
    resolution_result: Optional[Dict[str, Any]] = None

class BlackboardSpace:
    """黑板空间实现"""

    def __init__(self, space_type: BlackboardSpaceType):
        self.space_type = space_type
        self.entries: Dict[str, BlackboardEntry] = {}
        self.subscribers: List[Callable] = []
        self.access_history: deque = deque(maxlen=1000)
        self.conflicts: List[Conflict] = []

    def add_entry(self, entry: BlackboardEntry) -> bool:
        """添加条目到黑板空间"""
        try:
            # 检查冲突
            new_conflicts = self._detect_conflicts(entry)
            if new_conflicts:
                self.conflicts.extend(new_conflicts)
                logger.warning(f"检测到 {len(new_conflicts)} 个冲突")

            # 添加条目
            self.entries[entry.id] = entry

            # 记录访问历史
            self.access_history.append({
                'action': 'add',
                'entry_id': entry.id,
                'timestamp': datetime.now(timezone.utc)
            })

            # 通知订阅者
            self._notify_subscribers('add', entry)

            logger.info(f"黑板条目已添加: {entry.id} 到空间 {self.space_type.value}")
            return True

        except Exception as e:
            logger.error(f"添加黑板条目失败: {e}")
            return False

    def get_entry(self, entry_id: str) -> Optional[BlackboardEntry]:
        """获取黑板条目"""
        entry = self.entries.get(entry_id)
        if entry:
            self.access_history.append({
                'action': 'get',
                'entry_id': entry_id,
                'timestamp': datetime.now(timezone.utc)
            })
        return entry

    def update_entry(self, entry_id: str, updates: Dict[str, Any]) -> bool:
        """更新黑板条目"""
        if entry_id not in self.entries:
            return False

        try:
            entry = self.entries[entry_id]

            # 更新内容
            for key, value in updates.items():
                if hasattr(entry, key):
                    setattr(entry, key, value)

            # 增加版本号
            entry.version += 1
            entry.timestamp = datetime.now(timezone.utc)

            # 记录访问历史
            self.access_history.append({
                'action': 'update',
                'entry_id': entry_id,
                'timestamp': entry.timestamp
            })

            # 通知订阅者
            self._notify_subscribers('update', entry)

            return True

        except Exception as e:
            logger.error(f"更新黑板条目失败: {e}")
            return False

    def remove_entry(self, entry_id: str) -> bool:
        """移除黑板条目"""
        if entry_id not in self.entries:
            return False

        try:
            entry = self.entries.pop(entry_id)

            # 记录访问历史
            self.access_history.append({
                'action': 'remove',
                'entry_id': entry_id,
                'timestamp': datetime.now(timezone.utc)
            })

            # 通知订阅者
            self._notify_subscribers('remove', entry)

            return True

        except Exception as e:
            logger.error(f"移除黑板条目失败: {e}")
            return False

    def query_entries(self, **filters) -> List[BlackboardEntry]:
        """查询黑板条目"""
        results = []

        for entry in self.entries.values():
            match = True

            # 应用过滤条件
            for key, value in filters.items():
                if hasattr(entry, key):
                    entry_value = getattr(entry, key)
                    if isinstance(entry_value, (set, list)):
                        if value not in entry_value:
                            match = False
                            break
                    elif entry_value != value:
                        match = False
                        break
                else:
                    # 检查content中的字段
                    if key in entry.content and entry.content[key] != value:
                        match = False
                        break

            if match:
                results.append(entry)

        return results

    def subscribe(self, callback: Callable):
        """订阅黑板空间变化"""
        self.subscribers.append(callback)

    def unsubscribe(self, callback: Callable):
        """取消订阅"""
        if callback in self.subscribers:
            self.subscribers.remove(callback)

    def _detect_conflicts(self, new_entry: BlackboardEntry) -> List[Conflict]:
        """检测冲突"""
        conflicts = []

        for existing_entry in self.entries.values():
            # 检查内容冲突
            if self._has_content_conflict(new_entry, existing_entry):
                conflict = Conflict(
                    entry_ids={new_entry.id, existing_entry.id},
                    conflict_type="content_conflict",
                    description=f"内容冲突: 条目 {new_entry.id} 和 {existing_entry.id}",
                    severity=self._calculate_conflict_severity(new_entry, existing_entry)
                )
                conflicts.append(conflict)

            # 检查依赖冲突
            if self._has_dependency_conflict(new_entry, existing_entry):
                conflict = Conflict(
                    entry_ids={new_entry.id, existing_entry.id},
                    conflict_type="dependency_conflict",
                    description=f"依赖冲突: 条目 {new_entry.id} 和 {existing_entry.id}",
                    severity=0.7
                )
                conflicts.append(conflict)

        return conflicts

    def _has_content_conflict(self, entry1: BlackboardEntry, entry2: BlackboardEntry) -> bool:
        """检查内容冲突"""
        # 简单的内容冲突检测
        if entry1.space_type != entry2.space_type:
            return False

        # 检查关键字段冲突
        conflicting_keys = ['result', 'conclusion', 'decision']

        for key in conflicting_keys:
            if key in entry1.content and key in entry2.content:
                if entry1.content[key] != entry2.content[key]:
                    return True

        return False

    def _has_dependency_conflict(self, entry1: BlackboardEntry, entry2: BlackboardEntry) -> bool:
        """检查依赖冲突"""
        # 检查循环依赖
        if entry2.id in entry1.dependencies and entry1.id in entry2.dependencies:
            return True

        return False

    def _calculate_conflict_severity(self, entry1: BlackboardEntry, entry2: BlackboardEntry) -> float:
        """计算冲突严重程度"""
        base_severity = 0.5

        # 优先级差异越大，冲突越严重
        priority_diff = abs(entry1.priority - entry2.priority)
        severity = base_severity + (priority_diff / 10.0)

        # 置信度差异也影响冲突严重程度
        confidence_diff = abs(entry1.confidence - entry2.confidence)
        severity += confidence_diff * 0.3

        return min(1.0, severity)

    def _notify_subscribers(self, action: str, entry: BlackboardEntry):
        """通知订阅者"""
        for callback in self.subscribers:
            try:
                callback(action, entry, self.space_type)
            except Exception as e:
                logger.error(f"通知订阅者失败: {e}")

    def get_statistics(self) -> Dict[str, Any]:
        """获取空间统计信息"""
        return {
            'entry_count': len(self.entries),
            'conflict_count': len(self.conflicts),
            'subscriber_count': len(self.subscribers),
            'access_count': len(self.access_history),
            'space_type': self.space_type.value
        }

class BlackboardController:
    """黑板控制器 - 协调多个黑板空间的知识共享和协作"""

    def __init__(self):
        self.spaces: Dict[BlackboardSpaceType, BlackboardSpace] = {}
        self.knowledge_sources: Dict[str, KnowledgeSource] = {}
        self.active_collaborations: Dict[str, Dict[str, Any]] = {}
        self.learning_system = CollaborationLearningSystem()
        self.performance_metrics = defaultdict(list)

        # 初始化黑板空间
        self._initialize_spaces()

        logger.info("黑板控制器已初始化")

    def _initialize_spaces(self):
        """初始化所有黑板空间"""
        for space_type in BlackboardSpaceType:
            self.spaces[space_type] = BlackboardSpace(space_type)
            logger.info(f"黑板空间已初始化: {space_type.value}")

    def register_knowledge_source(self, source: KnowledgeSource) -> bool:
        """注册知识源"""
        try:
            self.knowledge_sources[source.id] = source

            # 根据知识源类型订阅相应空间
            if source.type == KnowledgeSourceType.AGENT:
                # 智能体订阅所有空间
                for space in self.spaces.values():
                    space.subscribe(self._create_agent_callback(source.id))

            logger.info(f"知识源已注册: {source.name} ({source.id})")
            return True

        except Exception as e:
            logger.error(f"注册知识源失败: {e}")
            return False

    def contribute_knowledge(self,
                           source_id: str,
                           space_type: BlackboardSpaceType,
                           content: Dict[str, Any],
                           metadata: Optional[Dict[str, Any]] = None,
                           confidence: float = 0.0,
                           priority: int = 0) -> Optional[str]:
        """贡献知识到黑板空间"""

        # 验证知识源
        if source_id not in self.knowledge_sources:
            logger.error(f"未找到知识源: {source_id}")
            return None

        source = self.knowledge_sources[source_id]
        if not source.availability:
            logger.error(f"知识源不可用: {source_id}")
            return None

        # 创建黑板条目
        entry = BlackboardEntry(
            space_type=space_type,
            content=content,
            metadata=metadata or {},
            source_id=source_id,
            source_type=source.type,
            confidence=confidence,
            priority=priority
        )

        # 添加到相应空间
        if self.spaces[space_type].add_entry(entry):
            # 更新知识源性能历史
            self._update_source_performance(source_id, True)

            # 触发协作机制
            self._trigger_collaboration(entry)

            return entry.id

        return None

    def query_knowledge(self,
                        space_type: BlackboardSpaceType,
                        **filters) -> List[BlackboardEntry]:
        """查询黑板空间中的知识"""
        return self.spaces[space_type].query_entries(**filters)

    def resolve_conflicts(self,
                         space_type: BlackboardSpaceType,
                         strategy: ConflictResolutionStrategy = ConflictResolutionStrategy.PRIORITY_BASED) -> Dict[str, Any]:
        """解决黑板空间中的冲突"""

        space = self.spaces[space_type]
        resolved_conflicts = []
        failed_resolutions = []

        for conflict in space.conflicts[:]:  # 复制列表以避免修改问题
            if conflict.resolved:
                continue

            try:
                result = self._resolve_single_conflict(conflict, strategy)
                if result['success']:
                    conflict.resolved = True
                    conflict.resolution_strategy = strategy
                    conflict.resolution_result = result
                    resolved_conflicts.append(conflict)
                else:
                    failed_resolutions.append(conflict)

            except Exception as e:
                logger.error(f"解决冲突失败: {e}")
                failed_resolutions.append(conflict)

        return {
            'resolved': resolved_conflicts,
            'failed': failed_resolutions,
            'total': len(space.conflicts)
        }

    def initiate_collaboration(self,
                             task_id: str,
                             participating_agents: List[str],
                             collaboration_type: str = "sequential") -> bool:
        """启动智能体协作"""

        try:
            # 验证参与的智能体
            valid_agents = []
            for agent_id in participating_agents:
                if agent_id in self.knowledge_sources:
                    source = self.knowledge_sources[agent_id]
                    if source.availability and source.type == KnowledgeSourceType.AGENT:
                        valid_agents.append(agent_id)
                else:
                    logger.warning(f"智能体未找到或不可用: {agent_id}")

            if len(valid_agents) < 2:
                logger.error("参与的智能体数量不足")
                return False

            # 创建协作记录
            self.active_collaborations[task_id] = {
                'agents': valid_agents,
                'type': collaboration_type,
                'status': 'active',
                'start_time': datetime.now(timezone.utc),
                'progress': 0.0,
                'interactions': [],
                'results': {}
            }

            logger.info(f"协作已启动: {task_id} 参与智能体: {valid_agents}")
            return True

        except Exception as e:
            logger.error(f"启动协作失败: {e}")
            return False

    def get_collaboration_status(self, task_id: str) -> Optional[Dict[str, Any]]:
        """获取协作状态"""
        return self.active_collaborations.get(task_id)

    def learn_from_collaboration(self, task_id: str) -> bool:
        """从协作中学习"""
        if task_id not in self.active_collaborations:
            return False

        collaboration = self.active_collaborations[task_id]

        try:
            # 提取协作经验
            experience = self._extract_collaboration_experience(collaboration)

            # 更新学习系统
            self.learning_system.update(experience)

            # 更新智能体协作评分
            self._update_agent_collaboration_scores(collaboration)

            logger.info(f"协作学习完成: {task_id}")
            return True

        except Exception as e:
            logger.error(f"协作学习失败: {e}")
            return False

    def get_system_statistics(self) -> Dict[str, Any]:
        """获取系统统计信息"""
        total_entries = sum(len(space.entries) for space in self.spaces.values())
        total_conflicts = sum(len(space.conflicts) for space in self.spaces.values())
        total_subscribers = sum(len(space.subscribers) for space in self.spaces.values())

        return {
            'spaces': {space_type.value: space.get_statistics()
                     for space_type, space in self.spaces.items()},
            'knowledge_sources': len(self.knowledge_sources),
            'active_collaborations': len(self.active_collaborations),
            'total_entries': total_entries,
            'total_conflicts': total_conflicts,
            'total_subscribers': total_subscribers,
            'learning_system': self.learning_system.get_statistics()
        }

    def _create_agent_callback(self, agent_id: str) -> Callable:
        """为智能体创建回调函数"""
        def callback(action: str, entry: BlackboardEntry, space_type: BlackboardSpaceType):
            # 智能体特定的响应逻辑
            if action == 'add' and entry.source_id != agent_id:
                # 其他智能体添加了新知识，可能需要响应
                self._handle_agent_notification(agent_id, action, entry, space_type)

        return callback

    def _handle_agent_notification(self, agent_id: str, action: str, entry: BlackboardEntry, space_type: BlackboardSpaceType):
        """处理智能体通知"""
        # 记录交互
        interaction = {
            'agent_id': agent_id,
            'action': action,
            'entry_id': entry.id,
            'space_type': space_type.value,
            'timestamp': datetime.now(timezone.utc)
        }

        # 添加到相关协作记录
        for task_id, collaboration in self.active_collaborations.items():
            if agent_id in collaboration['agents']:
                collaboration['interactions'].append(interaction)

    def _trigger_collaboration(self, entry: BlackboardEntry):
        """触发协作机制"""
        # 基于新条目触发相关智能体的协作
        relevant_agents = self._find_relevant_agents(entry)

        if len(relevant_agents) >= 2:
            task_id = f"auto_collab_{entry.id[:8]}"
            self.initiate_collaboration(task_id, relevant_agents, "event_driven")

    def _find_relevant_agents(self, entry: BlackboardEntry) -> List[str]:
        """查找相关的智能体"""
        relevant_agents = []

        for agent_id, source in self.knowledge_sources.items():
            if source.type != KnowledgeSourceType.AGENT or not source.availability:
                continue

            # 基于专业领域匹配
            if any(tag in source.specializations for tag in entry.tags):
                relevant_agents.append(agent_id)
                continue

            # 基于能力匹配
            if entry.space_type.value in source.capabilities:
                relevant_agents.append(agent_id)

        # 按优先级排序
        relevant_agents.sort(key=lambda aid: self.knowledge_sources[aid].priority, reverse=True)

        return relevant_agents[:5]  # 限制参与智能体数量

    def _resolve_single_conflict(self, conflict: Conflict, strategy: ConflictResolutionStrategy) -> Dict[str, Any]:
        """解决单个冲突"""
        if strategy == ConflictResolutionStrategy.PRIORITY_BASED:
            return self._resolve_by_priority(conflict)
        elif strategy == ConflictResolutionStrategy.CONSENSUS:
            return self._resolve_by_consensus(conflict)
        elif strategy == ConflictResolutionStrategy.MERGE:
            return self._resolve_by_merge(conflict)
        else:
            return {'success': False, 'reason': f'不支持的解决策略: {strategy}'}

    def _resolve_by_priority(self, conflict: Conflict) -> Dict[str, Any]:
        """基于优先级解决冲突"""
        # 简化实现：选择优先级最高的条目
        # 在实际实现中需要更复杂的优先级计算

        return {
            'success': True,
            'strategy': 'priority_based',
            'resolution': '保留优先级最高的条目'
        }

    def _resolve_by_consensus(self, conflict: Conflict) -> Dict[str, Any]:
        """基于共识解决冲突"""
        # 简化实现：模拟共识过程
        # 在实际实现中需要智能体间的协商机制

        return {
            'success': True,
            'strategy': 'consensus',
            'resolution': '通过智能体协商达成共识'
        }

    def _resolve_by_merge(self, conflict: Conflict) -> Dict[str, Any]:
        """通过合并解决冲突"""
        # 简化实现：模拟合并过程
        # 在实际实现中需要智能的内容合并算法

        return {
            'success': True,
            'strategy': 'merge',
            'resolution': '冲突条目内容已合并'
        }

    def _update_source_performance(self, source_id: str, success: bool):
        """更新知识源性能记录"""
        if source_id not in self.knowledge_sources:
            return

        source = self.knowledge_sources[source_id]
        performance_score = 1.0 if success else 0.0
        source.performance_history.append(performance_score)

        # 保持历史记录在合理范围内
        if len(source.performance_history) > 100:
            source.performance_history = source.performance_history[-50:]

    def _extract_collaboration_experience(self, collaboration: Dict[str, Any]) -> Dict[str, Any]:
        """提取协作经验"""
        return {
            'task_id': collaboration.get('task_id', ''),
            'agents': collaboration['agents'],
            'type': collaboration['type'],
            'duration': (datetime.now(timezone.utc) - collaboration['start_time']).total_seconds(),
            'interactions': len(collaboration['interactions']),
            'success_rate': self._calculate_collaboration_success_rate(collaboration)
        }

    def _calculate_collaboration_success_rate(self, collaboration: Dict[str, Any]) -> float:
        """计算协作成功率"""
        # 简化实现
        # 在实际实现中需要基于结果质量、完成度等指标计算

        if collaboration['progress'] >= 1.0:
            return 1.0
        elif collaboration['progress'] > 0.5:
            return 0.8
        elif collaboration['progress'] > 0:
            return 0.5
        else:
            return 0.0

    def _update_agent_collaboration_scores(self, collaboration: Dict[str, Any]):
        """更新智能体协作评分"""
        success_rate = self._calculate_collaboration_success_rate(collaboration)

        for agent_id in collaboration['agents']:
            if agent_id in self.knowledge_sources:
                source = self.knowledge_sources[agent_id]
                # 简单的协作评分更新
                source.collaboration_score = (source.collaboration_score * 0.8 + success_rate * 0.2)

class CollaborationLearningSystem:
    """协作学习系统"""

    def __init__(self):
        self.experiences: List[Dict[str, Any]] = []
        self.agent_performance: Dict[str, List[float]] = defaultdict(list)
        self.collaboration_patterns: Dict[str, int] = defaultdict(int)
        self.successful_patterns: Dict[str, List[Dict[str, Any]]] = defaultdict(list)

    def update(self, experience: Dict[str, Any]):
        """更新学习系统"""
        self.experiences.append(experience)

        # 更新智能体性能记录
        for agent_id in experience['agents']:
            self.agent_performance[agent_id].append(experience['success_rate'])

        # 更新协作模式统计
        pattern_key = self._generate_pattern_key(experience)
        self.collaboration_patterns[pattern_key] += 1

        if experience['success_rate'] > 0.7:
            self.successful_patterns[pattern_key].append(experience)

        # 保持学习历史在合理范围内
        if len(self.experiences) > 1000:
            self.experiences = self.experiences[-500:]

    def get_statistics(self) -> Dict[str, Any]:
        """获取学习系统统计"""
        return {
            'total_experiences': len(self.experiences),
            'agent_performance': {
                agent_id: {
                    'count': len(performance),
                    'average': sum(performance) / len(performance) if performance else 0.0
                }
                for agent_id, performance in self.agent_performance.items()
            },
            'collaboration_patterns': dict(self.collaboration_patterns),
            'successful_patterns_count': len(self.successful_patterns)
        }

    def _generate_pattern_key(self, experience: Dict[str, Any]) -> str:
        """生成协作模式键"""
        agents = sorted(experience['agents'])
        collab_type = experience['type']
        return f"{'_'.join(agents)}_{collab_type}"

# 全局黑板控制器实例
blackboard_controller = BlackboardController()

async def initialize_blackboard_system():
    """初始化黑板系统"""
    try:
        # 注册默认知识源
        # 这里可以添加智能体、算法等知识源的注册

        logger.info("黑板系统初始化完成")
        return True

    except Exception as e:
        logger.error(f"黑板系统初始化失败: {e}")
        return False

# 使用示例
async def example_usage():
    """使用示例"""

    # 初始化系统
    await initialize_blackboard_system()

    # 注册智能体知识源
    agent_source = KnowledgeSource(
        id="agent_001",
        name="Semantic Analyzer",
        type=KnowledgeSourceType.AGENT,
        capabilities=["semantic_analysis", "content_understanding"],
        priority=8,
        specializations={"nlp", "semantic_analysis"}
    )

    blackboard_controller.register_knowledge_source(agent_source)

    # 贡献知识
    entry_id = blackboard_controller.contribute_knowledge(
        source_id="agent_001",
        space_type=BlackboardSpaceType.SEMANTIC_ANALYSIS,
        content={"analysis_result": "positive_sentiment", "confidence": 0.85},
        metadata={"model": "semantic_v2", "processed_at": "2024-01-01"},
        confidence=0.85,
        priority=7
    )

    if entry_id:
        print(f"知识贡献成功，条目ID: {entry_id}")

    # 查询知识
    results = blackboard_controller.query_knowledge(
        BlackboardSpaceType.SEMANTIC_ANALYSIS,
        source_type=KnowledgeSourceType.AGENT
    )

    print(f"查询到 {len(results)} 条知识")

    # 获取系统统计
    stats = blackboard_controller.get_system_statistics()
    print(f"系统统计: {json.dumps(stats, indent=2, default=str)}")

if __name__ == "__main__":
    asyncio.run(example_usage())