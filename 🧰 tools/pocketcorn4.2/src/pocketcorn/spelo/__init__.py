"""
SPELO Framework - Study-Plan-Execute-Learn-Optimize
基于LaunchX Master Plan的投资决策闭环系统
"""

from .framework import SPELOFramework, SPELOProcessingPipeline
from .nodes import StudyNode, PlanNode, ExecuteNode, LearnNode, OptimizeNode
from .decision_engine import SPELODecisionEngine

__all__ = [
    'SPELOFramework',
    'SPELOProcessingPipeline', 
    'StudyNode',
    'PlanNode',
    'ExecuteNode',
    'LearnNode',
    'OptimizeNode',
    'SPELODecisionEngine'
]