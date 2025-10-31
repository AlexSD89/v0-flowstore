#!/usr/bin/env python3
"""
LaunchX V3.0 自动化模块
包含客户分析、策略生成、学习优化等核心功能
"""

__version__ = "3.0.0"
__author__ = "LaunchX Tech Core"

# 导入核心类
from .customer_prd_analyzer import CustomerPRDAnalyzer
from .mcp_strategy_system import MCPStrategySystem
from .strategy_learning_engine import StrategyLearningEngine
from .LaunchX_Customer_Workflow import LaunchXCustomerWorkflow, CustomerInput, WorkflowOutput

__all__ = [
    'CustomerPRDAnalyzer',
    'MCPStrategySystem',
    'StrategyLearningEngine',
    'LaunchXCustomerWorkflow',
    'CustomerInput',
    'WorkflowOutput'
]