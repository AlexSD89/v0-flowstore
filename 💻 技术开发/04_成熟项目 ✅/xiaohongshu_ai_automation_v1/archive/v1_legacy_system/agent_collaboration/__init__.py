"""
Agent协作模块
实现智能Agent协作机制和任务调度系统，支持1+1>2的协同效应
"""

from .collaboration_manager import (
    CollaborationManager,
    CollaborationType,
    TaskPriority,
    SynergyType,
    CollaborationTask,
    AgentCollaborationProfile,
    SynergyMetrics,
    CollaborationSession
)

from .intelligent_scheduler import (
    IntelligentScheduler,
    SchedulingStrategy,
    SchedulingStatus,
    SchedulingConstraint,
    SchedulingDecision,
    ResourceUtilization
)

__all__ = [
    # 核心类
    "CollaborationManager",
    "IntelligentScheduler",

    # 枚举类型
    "CollaborationType",
    "TaskPriority",
    "SynergyType",
    "SchedulingStrategy",
    "SchedulingStatus",

    # 数据结构
    "CollaborationTask",
    "AgentCollaborationProfile",
    "SynergyMetrics",
    "CollaborationSession",
    "SchedulingConstraint",
    "SchedulingDecision",
    "ResourceUtilization"
]