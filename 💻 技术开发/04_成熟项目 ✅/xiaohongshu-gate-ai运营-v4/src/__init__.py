"""
小红书Gate AI智能运营系统 - V1V3集成版本
基于CC原生基础 + Gate OS调度层的智能运营系统
"""

__version__ = "4.0.0-V1V3-Integration"
__author__ = "LaunchX Team"
__description__ = "V1小红书运营实践智慧 + V3证据驱动决策哲学融合系统"

# 导入核心组件
from .agents import *
from .tools import *
from .core import *

__all__ = [
    # V1组件
    'FourDimensionalDataCollector',
    'ForumCollaborationSchedulingAgent',

    # V3组件
    'EvidenceLedgerTool',
    'AutonomyLevelManagementAgent',

    # 核心系统
    'GateWorkflowEngine',
]