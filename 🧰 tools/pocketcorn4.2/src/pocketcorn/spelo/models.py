"""
SPELO Data Models
基于LaunchX Master Plan的数据模型定义
"""

from dataclasses import dataclass, field
from typing import Dict, Any, Optional, List
from enum import Enum
from datetime import datetime


class InvestmentDecision(Enum):
    """投资决策枚举"""
    STRONG_RECOMMEND = "强烈推荐投资"  # >= 0.85
    RECOMMEND = "推荐投资"        # >= 0.70
    CAUTIOUS_WATCH = "谨慎观望"    # >= 0.55
    NOT_RECOMMEND = "不推荐投资"   # < 0.55


@dataclass
class InvestmentContext:
    """投资上下文信息"""
    company_name: str
    company_url: Optional[str] = None
    founder_info: Optional[Dict[str, Any]] = None
    product_description: Optional[str] = None
    known_metrics: Optional[Dict[str, Any]] = None
    source_platform: Optional[str] = None
    discovery_signals: List[str] = field(default_factory=list)
    timestamp: datetime = field(default_factory=datetime.now)


@dataclass
class SPELOContext:
    """SPELO处理上下文"""
    investment_context: InvestmentContext
    config: Any  # SPELOConfig
    
    # 各阶段结果
    study_result: Optional[Any] = None
    plan_result: Optional[Any] = None
    execute_result: Optional[Any] = None
    learn_result: Optional[Any] = None
    optimize_result: Optional[Any] = None
    
    # 处理元数据
    processing_start_time: datetime = field(default_factory=datetime.now)
    current_phase: Optional[str] = None


@dataclass
class StudyResult:
    """Study阶段结果"""
    company_profile: Dict[str, Any]
    market_analysis: Dict[str, Any]
    investment_thesis: str
    confidence_level: float
    data_sources: List[str] = field(default_factory=list)
    risk_signals: List[str] = field(default_factory=list)
    opportunity_signals: List[str] = field(default_factory=list)
    
    # Pocketcorn特定指标
    estimated_mrr: Optional[float] = None
    team_size_estimate: Optional[int] = None
    growth_indicators: List[str] = field(default_factory=list)
    pmf_signals: List[str] = field(default_factory=list)


@dataclass
class PlanResult:
    """Plan阶段结果"""
    investment_strategy: str
    fund_allocation: Dict[str, float]
    risk_control_measures: List[str]
    recovery_timeline: tuple
    growth_support_plan: List[str]
    
    # 尽调计划
    due_diligence_checklist: List[str] = field(default_factory=list)
    key_validation_points: List[str] = field(default_factory=list)
    decision_criteria: Dict[str, float] = field(default_factory=dict)


@dataclass
class ExecuteResult:
    """Execute阶段结果"""
    investment_recommendation: InvestmentDecision
    detailed_analysis: Dict[str, Any]
    seven_dimension_scores: Dict[str, float]
    total_score: float
    
    # 投资条款建议
    investment_terms: Dict[str, Any] = field(default_factory=dict)
    negotiation_strategy: List[str] = field(default_factory=list)
    success_milestones: List[str] = field(default_factory=list)


@dataclass
class LearnResult:
    """Learn阶段结果"""
    key_insights: List[str]
    success_factors: List[str]
    risk_factors: List[str]
    pattern_recognition: Dict[str, Any]
    
    # 经验总结
    lessons_learned: List[str] = field(default_factory=list)
    model_updates: Dict[str, Any] = field(default_factory=dict)
    prediction_accuracy: Optional[float] = None


@dataclass
class OptimizeResult:
    """Optimize阶段结果"""
    final_recommendation: InvestmentDecision
    success_probability: float
    optimization_suggestions: List[str]
    
    # 系统优化建议
    algorithm_improvements: List[str] = field(default_factory=list)
    data_collection_improvements: List[str] = field(default_factory=list)
    process_improvements: List[str] = field(default_factory=list)


@dataclass
class SPELOResult:
    """完整SPELO结果"""
    success: bool
    final_recommendation: InvestmentDecision
    confidence_score: float
    
    # 各阶段结果
    study: Optional[StudyResult] = None
    plan: Optional[PlanResult] = None
    execute: Optional[ExecuteResult] = None
    learn: Optional[LearnResult] = None
    optimize: Optional[OptimizeResult] = None
    
    # 元数据
    processing_time: Optional[float] = None
    spelo_context: Optional[SPELOContext] = None
    error: Optional[str] = None
    
    def to_investment_report(self) -> Dict[str, Any]:
        """生成投资报告"""
        return {
            "investment_recommendation": self.final_recommendation.value,
            "confidence_score": self.confidence_score,
            "executive_summary": self._generate_executive_summary(),
            "detailed_analysis": self._generate_detailed_analysis(),
            "risk_assessment": self._generate_risk_assessment(),
            "next_steps": self._generate_next_steps(),
            "metadata": {
                "processing_time": self.processing_time,
                "analysis_timestamp": datetime.now().isoformat(),
                "spelo_version": "1.0"
            }
        }
    
    def _generate_executive_summary(self) -> str:
        """生成执行摘要"""
        if not self.study or not self.execute:
            return "分析未完成，无法生成摘要"
            
        return f"""
        投资建议: {self.final_recommendation.value}
        信心指数: {self.confidence_score:.2%}
        
        企业概况: {self.study.company_profile.get('description', '未知')}
        估计MRR: {self.study.estimated_mrr or '未知'}
        团队规模: {self.study.team_size_estimate or '未知'}人
        
        核心优势: {', '.join(self.study.opportunity_signals[:3])}
        主要风险: {', '.join(self.study.risk_signals[:3])}
        """
    
    def _generate_detailed_analysis(self) -> Dict[str, Any]:
        """生成详细分析"""
        if not self.execute:
            return {}
            
        return {
            "seven_dimension_analysis": self.execute.seven_dimension_scores,
            "total_score": self.execute.total_score,
            "detailed_breakdown": self.execute.detailed_analysis
        }
    
    def _generate_risk_assessment(self) -> Dict[str, Any]:
        """生成风险评估"""
        if not self.study or not self.plan:
            return {}
            
        return {
            "identified_risks": self.study.risk_signals,
            "risk_control_measures": self.plan.risk_control_measures,
            "risk_mitigation_score": 1.0 - (len(self.study.risk_signals) * 0.1)
        }
    
    def _generate_next_steps(self) -> List[str]:
        """生成下一步行动建议"""
        if not self.plan:
            return ["完善分析后重新评估"]
            
        steps = []
        
        if self.final_recommendation in [InvestmentDecision.STRONG_RECOMMEND, InvestmentDecision.RECOMMEND]:
            steps.extend([
                "启动尽职调查流程",
                "联系创始人团队",
                "验证关键业务指标",
                "制定投资条款清单"
            ])
        elif self.final_recommendation == InvestmentDecision.CAUTIOUS_WATCH:
            steps.extend([
                "持续监控企业发展",
                "关注关键指标变化",
                "等待更明确的成长信号"
            ])
        else:
            steps.extend([
                "暂不考虑投资",
                "归档分析结果",
                "关注同赛道其他机会"
            ])
            
        return steps


@dataclass
class SevenDimensionScore:
    """7维度评分详细结果"""
    technology: float = 0.0           # 技术评估
    market: float = 0.0              # 市场评估
    team: float = 0.0                # 团队评估
    business_model: float = 0.0      # 商业模式
    competitive_advantage: float = 0.0  # 竞争优势
    cultural_compatibility: float = 0.0  # 文化兼容性(产品本地化转化)
    risk_assessment: float = 0.0     # 风险评估
    
    def calculate_weighted_score(self, weights: Dict[str, float]) -> float:
        """计算加权总分"""
        total_score = 0.0
        for dimension, weight in weights.items():
            score = getattr(self, dimension, 0.0)
            total_score += score * weight
        return total_score
    
    def to_dict(self) -> Dict[str, float]:
        """转换为字典格式"""
        return {
            "technology": self.technology,
            "market": self.market,
            "team": self.team,
            "business_model": self.business_model,
            "competitive_advantage": self.competitive_advantage,
            "cultural_compatibility": self.cultural_compatibility,
            "risk_assessment": self.risk_assessment
        }