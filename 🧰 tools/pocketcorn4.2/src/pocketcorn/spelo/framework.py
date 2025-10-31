"""
SPELO Framework Core Implementation
Based on LaunchX Master Plan - SPELO Decision Framework
"""

import asyncio
from typing import Dict, Any, Optional
from dataclasses import dataclass
from enum import Enum

from .nodes import StudyNode, PlanNode, ExecuteNode, LearnNode, OptimizeNode
from .models import SPELOContext, SPELOResult, InvestmentContext


class SPELOPhase(Enum):
    """SPELO处理阶段枚举"""
    STUDY = "study"
    PLAN = "plan"
    EXECUTE = "execute"
    LEARN = "learn"
    OPTIMIZE = "optimize"


@dataclass
class SPELOConfig:
    """SPELO配置参数"""
    # Pocketcorn投资配置
    investment_amount: int = 500000  # 50万投资额
    target_return_timeline: tuple = (6, 8)  # 6-8个月回收期
    mrr_threshold: int = 50000  # 5万RMB MRR门槛
    team_size_range: tuple = (3, 10)  # 3-10人团队规模
    growth_rate_minimum: float = 0.15  # 15%月增长率要求
    cultural_compatibility_minimum: float = 0.7  # 产品本地化转化能力最低要求
    
    # 评估权重配置
    dimension_weights: Dict[str, float] = None
    
    def __post_init__(self):
        if self.dimension_weights is None:
            self.dimension_weights = {
                "technology": 0.15,        # 技术评估
                "market": 0.20,           # 市场评估  
                "team": 0.20,             # 团队评估
                "business_model": 0.20,   # 商业模式
                "competitive_advantage": 0.10,  # 竞争优势
                "cultural_compatibility": 0.10,  # 文化兼容性
                "risk_assessment": 0.05   # 风险评估
            }


class SPELOFramework:
    """
    SPELO框架主控制器
    基于LaunchX Master Plan实现的投资决策闭环系统
    """
    
    def __init__(self, config: Optional[SPELOConfig] = None):
        self.config = config or SPELOConfig()
        self.current_phase = None
        self.processing_pipeline = SPELOProcessingPipeline(self.config)
        
    async def analyze_investment_opportunity(self, context: InvestmentContext) -> SPELOResult:
        """
        分析投资机会的完整SPELO流程
        
        Args:
            context: 投资上下文信息
            
        Returns:
            SPELOResult: 完整的SPELO分析结果
        """
        try:
            # 执行完整SPELO循环
            result = await self.processing_pipeline.execute_spelo_cycle(context)
            
            return result
            
        except Exception as e:
            # 错误处理和回退机制
            return SPELOResult(
                success=False,
                error=str(e),
                final_recommendation="ANALYSIS_FAILED",
                confidence_score=0.0
            )
    
    def get_current_phase(self) -> Optional[SPELOPhase]:
        """获取当前处理阶段"""
        return self.current_phase
    
    def update_config(self, **kwargs):
        """更新配置参数"""
        for key, value in kwargs.items():
            if hasattr(self.config, key):
                setattr(self.config, key, value)


class SPELOProcessingPipeline:
    """
    SPELO处理管道
    实现Study-Plan-Execute-Learn-Optimize的系统化决策流程
    """
    
    def __init__(self, config: SPELOConfig):
        self.config = config
        
        # 初始化各个处理节点
        self.study_node = StudyNode(config)
        self.plan_node = PlanNode(config)
        self.execute_node = ExecuteNode(config)
        self.learn_node = LearnNode(config)
        self.optimize_node = OptimizeNode(config)
        
    async def execute_spelo_cycle(self, investment_context: InvestmentContext) -> SPELOResult:
        """
        执行完整SPELO决策循环
        按照Master Plan中的SPELO实施策略
        """
        
        spelo_context = SPELOContext(
            investment_context=investment_context,
            config=self.config
        )
        
        # Study Phase: 企业发现与深度调研
        print("🔍 SPELO Study Phase: 企业发现与深度调研")
        study_result = await self.study_node.process(spelo_context)
        spelo_context.study_result = study_result
        
        # Plan Phase: 投资策略制定
        print("📋 SPELO Plan Phase: 投资策略制定")
        plan_result = await self.plan_node.process(spelo_context)
        spelo_context.plan_result = plan_result
        
        # Execute Phase: 投资执行
        print("⚡ SPELO Execute Phase: 投资执行分析")
        execute_result = await self.execute_node.process(spelo_context)
        spelo_context.execute_result = execute_result
        
        # Learn Phase: 经验学习
        print("🧠 SPELO Learn Phase: 经验学习")
        learn_result = await self.learn_node.process(spelo_context)
        spelo_context.learn_result = learn_result
        
        # Optimize Phase: 系统优化
        print("🚀 SPELO Optimize Phase: 系统优化")
        optimize_result = await self.optimize_node.process(spelo_context)
        
        return SPELOResult(
            success=True,
            study=study_result,
            plan=plan_result,
            execute=execute_result,
            learn=learn_result,
            optimize=optimize_result,
            final_recommendation=optimize_result.final_recommendation,
            confidence_score=optimize_result.success_probability,
            spelo_context=spelo_context
        )
        
    async def process_phase(self, phase: SPELOPhase, context: SPELOContext) -> Any:
        """处理单个SPELO阶段"""
        node_map = {
            SPELOPhase.STUDY: self.study_node,
            SPELOPhase.PLAN: self.plan_node,
            SPELOPhase.EXECUTE: self.execute_node,
            SPELOPhase.LEARN: self.learn_node,
            SPELOPhase.OPTIMIZE: self.optimize_node
        }
        
        node = node_map.get(phase)
        if not node:
            raise ValueError(f"Unknown SPELO phase: {phase}")
            
        return await node.process(context)