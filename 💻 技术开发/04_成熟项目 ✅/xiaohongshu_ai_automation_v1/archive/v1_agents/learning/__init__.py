"""
实时学习模块
实现实时学习和自我优化能力，支持持续改进和性能提升
"""

from .realtime_learning_engine import (
    RealtimeLearningEngine,
    LearningEventType,
    LearningMode,
    OptimizationType,
    LearningEvent,
    LearningSignal,
    OptimizationResult,
    LearningInsight
)

from .self_optimization_system import (
    SelfOptimizationSystem,
    OptimizationScope,
    OptimizationTrigger,
    OptimizationStatus,
    OptimizationTarget,
    OptimizationAction,
    OptimizationResult as SelfOptimizationResult
)

__all__ = [
    # 核心类
    "RealtimeLearningEngine",
    "SelfOptimizationSystem",

    # 枚举类型
    "LearningEventType",
    "LearningMode",
    "OptimizationType",
    "OptimizationScope",
    "OptimizationTrigger",
    "OptimizationStatus",

    # 数据结构
    "LearningEvent",
    "LearningSignal",
    "LearningInsight",
    "OptimizationTarget",
    "OptimizationAction",
    "OptimizationResult",
    "SelfOptimizationResult"
]