"""
证据驱动引擎 - 基于V3哲学的证据驱动叙事-意向匹配引擎

整合V3的"证据驱动的叙事—意向匹配引擎"哲学，为V1设计哲学提供证据基础和决策质量保障

核心哲学：
- 信息即证据，验证即真理
- 决策即责任，透明即信任
- 自动化即效率，边界即安全
- 进化即学习，失败即智慧
"""

import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, field
from enum import Enum
import json
import uuid

logger = logging.getLogger(__name__)

class EvidenceLevel(Enum):
    """证据等级金字塔"""
    LEVEL_1_DIRECT_OBSERVATION = "direct_observation"  # 一方行为
    LEVEL_2_CONTROLLED_EXPERIMENT = "controlled_experiment"  # 受控实验
    LEVEL_3_QUASI_EXPERIMENT = "quasi_experiment"  # 准实验
    LEVEL_4_PANEL_DATA = "panel_data"  # 面板
    LEVEL_5_SECONDARY_DATA = "secondary_data"  # 二手资料

class AutonomyLevel(Enum):
    """自主等级系统 (LOA)"""
    LOA0_ADVICE = "advice"  # 纯建议性质
    LOA1_ALTERNATIVES = "alternatives"  # 备选方案
    LOA2_LOW_RISK_AUTO = "low_risk_auto"  # 低风险自动执行
    LOA3_GUARDRAIL_AUTO = "guardrail_auto"  # 守护栏内自动执行
    LOA4_HUMAN_ONLY = "human_only"  # 人类专属

@dataclass
class Evidence:
    """证据数据结构"""
    claim: str
    sources: List[Dict[str, Any]]
    context: Dict[str, Any]
    evidence_level: EvidenceLevel
    triangulation_score: float
    confidence_level: float
    timestamp: datetime = field(default_factory=datetime.now)
    expires_at: Optional[datetime] = None
    traceability_id: str = field(default_factory=lambda: str(uuid.uuid4()))

@dataclass
class DecisionRecord:
    """决策记录"""
    decision_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    decision_type: str = ""
    context: Dict[str, Any] = field(default_factory=dict)
    autonomy_level: AutonomyLevel = AutonomyLevel.LOA0_ADVICE
    evidence_references: List[str] = field(default_factory=list)
    reasoning_process: str = ""
    expected_outcome: Dict[str, Any] = field(default_factory=dict)
    timestamp: datetime = field(default_factory=datetime.now)
    feedback_experiment_id: Optional[str] = None

class EvidenceLedger:
    """证据账本系统 - 所有决策和洞察的可追溯来源"""

    def __init__(self):
        self.evidence_pyramid = EvidencePyramid()
        self.triangulation_engine = TriangulationEngine()
        self.confidence_scorer = ConfidenceScorer()
        self.traceability_manager = TraceabilityManager()
        self.evidence_storage: Dict[str, Evidence] = {}

    async def record_evidence(self, claim: str, sources: List[Dict[str, Any]],
                            context: Dict[str, Any]) -> Evidence:
        """记录证据到账本"""

        # 证据等级评估
        evidence_level = self.evidence_pyramid.evaluate(sources)

        # 三角校验
        triangulation_score = await self.triangulation_engine.validate(sources)

        # 置信度计算
        confidence_level = self.confidence_scorer.calculate(claim, evidence_level, triangulation_score)

        # 过期时间计算
        expires_at = self._calculate_expiry(evidence_level)

        evidence = Evidence(
            claim=claim,
            sources=sources,
            context=context,
            evidence_level=evidence_level,
            triangulation_score=triangulation_score,
            confidence_level=confidence_level,
            expires_at=expires_at
        )

        # 记录到可追溯管理器
        await self.traceability_manager.record(evidence)

        # 存储证据
        self.evidence_storage[evidence.traceability_id] = evidence

        logger.info(f"证据已记录: {evidence.traceability_id}, 置信度: {confidence_level:.2f}")
        return evidence

    def _calculate_expiry(self, evidence_level: EvidenceLevel) -> datetime:
        """计算证据过期时间"""
        expiry_mapping = {
            EvidenceLevel.LEVEL_1_DIRECT_OBSERVATION: 30,  # 30天
            EvidenceLevel.LEVEL_2_CONTROLLED_EXPERIMENT: 90,  # 90天
            EvidenceLevel.LEVEL_3_QUASI_EXPERIMENT: 60,  # 60天
            EvidenceLevel.LEVEL_4_PANEL_DATA: 45,  # 45天
            EvidenceLevel.LEVEL_5_SECONDARY_DATA: 30,  # 30天
        }
        days = expiry_mapping.get(evidence_level, 30)
        return datetime.now() + timedelta(days=days)

    async def get_evidence(self, traceability_id: str) -> Optional[Evidence]:
        """获取证据"""
        return self.evidence_storage.get(traceability_id)

    async def search_evidence(self, claim_keywords: List[str],
                            min_confidence: float = 0.5) -> List[Evidence]:
        """搜索证据"""
        results = []
        for evidence in self.evidence_storage.values():
            # 检查是否过期
            if evidence.expires_at and evidence.expires_at < datetime.now():
                continue

            # 检查置信度
            if evidence.confidence_level < min_confidence:
                continue

            # 关键词匹配
            claim_text = evidence.claim.lower()
            if any(keyword.lower() in claim_text for keyword in claim_keywords):
                results.append(evidence)

        # 按置信度排序
        results.sort(key=lambda e: e.confidence_level, reverse=True)
        return results

class EvidencePyramid:
    """证据金字塔评估器"""

    def __init__(self):
        self.level_weights = {
            EvidenceLevel.LEVEL_1_DIRECT_OBSERVATION: 1.0,
            EvidenceLevel.LEVEL_2_CONTROLLED_EXPERIMENT: 0.9,
            EvidenceLevel.LEVEL_3_QUASI_EXPERIMENT: 0.7,
            EvidenceLevel.LEVEL_4_PANEL_DATA: 0.5,
            EvidenceLevel.LEVEL_5_SECONDARY_DATA: 0.3,
        }

    def evaluate(self, sources: List[Dict[str, Any]]) -> EvidenceLevel:
        """评估证据等级"""
        if not sources:
            return EvidenceLevel.LEVEL_5_SECONDARY_DATA

        # 分析来源类型
        has_direct_observation = any(s.get('type') == 'direct_observation' for s in sources)
        has_controlled_experiment = any(s.get('type') == 'controlled_experiment' for s in sources)
        has_quasi_experiment = any(s.get('type') == 'quasi_experiment' for s in sources)
        has_panel_data = any(s.get('type') == 'panel_data' for s in sources)

        # 确定最高等级
        if has_direct_observation:
            return EvidenceLevel.LEVEL_1_DIRECT_OBSERVATION
        elif has_controlled_experiment:
            return EvidenceLevel.LEVEL_2_CONTROLLED_EXPERIMENT
        elif has_quasi_experiment:
            return EvidenceLevel.LEVEL_3_QUASI_EXPERIMENT
        elif has_panel_data:
            return EvidenceLevel.LEVEL_4_PANEL_DATA
        else:
            return EvidenceLevel.LEVEL_5_SECONDARY_DATA

class TriangulationEngine:
    """三角校验引擎"""

    async def validate(self, sources: List[Dict[str, Any]]) -> float:
        """验证多个来源的一致性"""
        if len(sources) < 2:
            return 0.3  # 单一来源置信度较低

        # 计算来源间的独立性
        independence_score = self._calculate_independence(sources)

        # 计算内容一致性
        consistency_score = self._calculate_consistency(sources)

        # 综合评分
        triangulation_score = (independence_score + consistency_score) / 2

        return min(triangulation_score, 1.0)

    def _calculate_independence(self, sources: List[Dict[str, Any]]) -> float:
        """计算来源独立性"""
        # 简化实现：基于来源类型的多样性
        source_types = set(s.get('type', 'unknown') for s in sources)
        type_diversity = len(source_types) / len(sources) if sources else 0

        # 基于作者/机构的独立性
        authors = set(s.get('author', 'unknown') for s in sources)
        author_diversity = len(authors) / len(sources) if sources else 0

        return (type_diversity + author_diversity) / 2

    def _calculate_consistency(self, sources: List[Dict[str, Any]]) -> float:
        """计算内容一致性"""
        # 简化实现：基于时间戳和数据值的一致性
        if not sources:
            return 0.0

        # 检查时间戳一致性
        timestamps = [s.get('timestamp') for s in sources if s.get('timestamp')]
        if len(timestamps) > 1:
            time_span = max(timestamps) - min(timestamps)
            time_consistency = max(0, 1 - time_span.total_seconds() / (30 * 24 * 3600))  # 30天窗口
        else:
            time_consistency = 1.0

        # 检查数值一致性（如果有数值数据）
        numeric_values = [s.get('value') for s in sources if isinstance(s.get('value'), (int, float))]
        if len(numeric_values) > 1:
            value_range = max(numeric_values) - min(numeric_values)
            value_mean = sum(numeric_values) / len(numeric_values)
            value_consistency = max(0, 1 - (value_range / value_mean)) if value_mean != 0 else 1.0
        else:
            value_consistency = 1.0

        return (time_consistency + value_consistency) / 2

class ConfidenceScorer:
    """置信度评分器"""

    def calculate(self, claim: str, evidence_level: EvidenceLevel,
                  triangulation_score: float) -> float:
        """计算综合置信度"""

        # 证据等级权重
        level_weights = {
            EvidenceLevel.LEVEL_1_DIRECT_OBSERVATION: 1.0,
            EvidenceLevel.LEVEL_2_CONTROLLED_EXPERIMENT: 0.9,
            EvidenceLevel.LEVEL_3_QUASI_EXPERIMENT: 0.7,
            EvidenceLevel.LEVEL_4_PANEL_DATA: 0.5,
            EvidenceLevel.LEVEL_5_SECONDARY_DATA: 0.3,
        }

        level_weight = level_weights.get(evidence_level, 0.3)

        # 声明质量评估
        claim_quality = self._assess_claim_quality(claim)

        # 综合置信度
        confidence = (level_weight * 0.4 + triangulation_score * 0.4 + claim_quality * 0.2)

        return min(confidence, 1.0)

    def _assess_claim_quality(self, claim: str) -> float:
        """评估声明质量"""
        if not claim:
            return 0.0

        quality_score = 0.5  # 基础分

        # 长度适中（不要太短也不要太长）
        claim_length = len(claim)
        if 10 <= claim_length <= 200:
            quality_score += 0.2

        # 包含量化信息
        if any(char.isdigit() for char in claim):
            quality_score += 0.1

        # 避免绝对化表述
        absolute_words = ['总是', '从不', '全部', '绝对', '必然']
        if not any(word in claim for word in absolute_words):
            quality_score += 0.1

        # 包含条件或限制
        conditional_words = ['如果', '当', '在...情况下', '假设', '可能']
        if any(word in claim for word in conditional_words):
            quality_score += 0.1

        return min(quality_score, 1.0)

class TraceabilityManager:
    """可追溯性管理器"""

    def __init__(self):
        self.traceability_log: List[Dict[str, Any]] = []

    async def record(self, evidence: Evidence):
        """记录证据追踪信息"""
        log_entry = {
            'traceability_id': evidence.traceability_id,
            'claim': evidence.claim,
            'evidence_level': evidence.evidence_level.value,
            'confidence_level': evidence.confidence_level,
            'timestamp': evidence.timestamp.isoformat(),
            'action': 'evidence_recorded'
        }

        self.traceability_log.append(log_entry)
        logger.debug(f"可追溯性记录: {evidence.traceability_id}")

    async def get_traceability_chain(self, traceability_id: str) -> List[Dict[str, Any]]:
        """获取可追溯链"""
        return [entry for entry in self.traceability_log
                if entry.get('traceability_id') == traceability_id]

class AutonomyLevelManager:
    """自主等级管理系统 - 智能决策边界控制"""

    def __init__(self):
        self.impact_assessor = ImpactAssessor()
        self.reversibility_analyzer = ReversibilityAnalyzer()
        self.risk_calculator = RiskCalculator()
        self.context_analyzer = ContextAnalyzer()

    def determine_loa(self, decision_type: str, context: Dict[str, Any],
                     constraints: Dict[str, Any]) -> AutonomyLevel:
        """确定决策的自主等级"""

        # 影响评估
        impact_score = self.impact_assessor.calculate(decision_type, context)

        # 可逆性分析
        reversibility_score = self.reversibility_analyzer.analyze(decision_type, context)

        # 风险计算
        risk_score = self.risk_calculator.assess(decision_type, context)

        # 上下文稳定性
        context_stability = self.context_analyzer.evaluate(context)

        # LOA决策矩阵
        if impact_score >= 0.8 or risk_score >= 0.9:
            return AutonomyLevel.LOA4_HUMAN_ONLY
        elif impact_score >= 0.6 or risk_score >= 0.7:
            return AutonomyLevel.LOA3_GUARDRAIL_AUTO
        elif impact_score >= 0.4 or risk_score >= 0.5:
            return AutonomyLevel.LOA2_LOW_RISK_AUTO
        elif reversibility_score >= 0.7:
            return AutonomyLevel.LOA1_ALTERNATIVES
        else:
            return AutonomyLevel.LOA0_ADVICE

class ImpactAssessor:
    """影响评估器"""

    def calculate(self, decision_type: str, context: Dict[str, Any]) -> float:
        """计算决策影响分数"""

        # 基础影响分数
        base_impact = self._get_base_impact(decision_type)

        # 上下文调整
        context_multiplier = self._get_context_multiplier(context)

        # 资源影响
        resource_impact = self._get_resource_impact(context)

        impact_score = base_impact * context_multiplier + resource_impact

        return min(impact_score, 1.0)

    def _get_base_impact(self, decision_type: str) -> float:
        """获取基础影响分数"""
        high_impact_types = ['content_publish', 'budget_allocation', 'strategy_change']
        medium_impact_types = ['data_analysis', 'content_draft', 'trend_monitoring']
        low_impact_types = ['data_collection', 'report_generation', 'internal_notification']

        if decision_type in high_impact_types:
            return 0.8
        elif decision_type in medium_impact_types:
            return 0.5
        elif decision_type in low_impact_types:
            return 0.2
        else:
            return 0.4  # 默认中等影响

    def _get_context_multiplier(self, context: Dict[str, Any]) -> float:
        """获取上下文调整系数"""
        multiplier = 1.0

        # 公开内容影响更大
        if context.get('is_public', False):
            multiplier *= 1.5

        # 高价值客户影响更大
        if context.get('is_high_value_client', False):
            multiplier *= 1.3

        # 节假日期间影响更大
        if context.get('is_holiday_season', False):
            multiplier *= 1.2

        return min(multiplier, 2.0)

    def _get_resource_impact(self, context: Dict[str, Any]) -> float:
        """获取资源影响分数"""
        resource_impact = 0.0

        # 财务影响
        budget_amount = context.get('budget_amount', 0)
        if budget_amount > 10000:
            resource_impact += 0.3
        elif budget_amount > 1000:
            resource_impact += 0.2
        elif budget_amount > 100:
            resource_impact += 0.1

        # 时间影响
        time_cost_hours = context.get('time_cost_hours', 0)
        if time_cost_hours > 40:
            resource_impact += 0.2
        elif time_cost_hours > 8:
            resource_impact += 0.1

        return min(resource_impact, 0.5)

class ReversibilityAnalyzer:
    """可逆性分析器"""

    def analyze(self, decision_type: str, context: Dict[str, Any]) -> float:
        """分析决策的可逆性"""

        # 基础可逆性
        base_reversibility = self._get_base_reversibility(decision_type)

        # 回滚成本
        rollback_cost = self._get_rollback_cost(context)

        # 时间约束
        time_constraint = self._get_time_constraint(context)

        reversibility_score = base_reversibility - rollback_cost - time_constraint

        return max(reversibility_score, 0.0)

    def _get_base_reversibility(self, decision_type: str) -> float:
        """获取基础可逆性分数"""
        reversible_types = ['data_collection', 'draft_generation', 'internal_test']
        semi_reversible_types = ['content_publish', 'automated_response']
        irreversible_types = ['account_deletion', 'data_permanent_delete', 'public_statement']

        if decision_type in reversible_types:
            return 0.9
        elif decision_type in semi_reversible_types:
            return 0.6
        elif decision_type in irreversible_types:
            return 0.1
        else:
            return 0.5

    def _get_rollback_cost(self, context: Dict[str, Any]) -> float:
        """获取回滚成本"""
        cost = 0.0

        # 财务回滚成本
        rollback_budget = context.get('rollback_budget', 0)
        if rollback_budget > 1000:
            cost += 0.3
        elif rollback_budget > 100:
            cost += 0.2
        elif rollback_budget > 0:
            cost += 0.1

        # 声誉回滚成本
        if context.get('public_visibility', False):
            cost += 0.2

        return min(cost, 0.5)

    def _get_time_constraint(self, context: Dict[str, Any]) -> float:
        """获取时间约束分数"""
        constraint = 0.0

        # 紧急程度
        urgency = context.get('urgency', 'normal')
        if urgency == 'critical':
            constraint += 0.3
        elif urgency == 'high':
            constraint += 0.2
        elif urgency == 'low':
            constraint -= 0.1

        # 时间窗口
        time_window_hours = context.get('time_window_hours', 24)
        if time_window_hours < 1:
            constraint += 0.2
        elif time_window_hours < 4:
            constraint += 0.1

        return min(constraint, 0.4)

class RiskCalculator:
    """风险计算器"""

    def assess(self, decision_type: str, context: Dict[str, Any]) -> float:
        """评估决策风险"""

        # 基础风险
        base_risk = self._get_base_risk(decision_type)

        # 外部环境风险
        environment_risk = self._get_environment_risk(context)

        # 依赖风险
        dependency_risk = self._get_dependency_risk(context)

        # 合规风险
        compliance_risk = self._get_compliance_risk(context)

        risk_score = (base_risk + environment_risk + dependency_risk + compliance_risk) / 4

        return min(risk_score, 1.0)

    def _get_base_risk(self, decision_type: str) -> float:
        """获取基础风险分数"""
        high_risk_types = ['account_modification', 'public_content', 'payment_processing']
        medium_risk_types = ['data_analysis', 'content_generation', 'automated_response']
        low_risk_types = ['data_collection', 'report_generation', 'internal_process']

        if decision_type in high_risk_types:
            return 0.8
        elif decision_type in medium_risk_types:
            return 0.5
        elif decision_type in low_risk_types:
            return 0.2
        else:
            return 0.4

    def _get_environment_risk(self, context: Dict[str, Any]) -> float:
        """获取外部环境风险"""
        risk = 0.0

        # 平台稳定性
        platform_stability = context.get('platform_stability', 'stable')
        if platform_stability == 'unstable':
            risk += 0.3
        elif platform_stability == 'volatile':
            risk += 0.5

        # 市场波动性
        market_volatility = context.get('market_volatility', 'normal')
        if market_volatility == 'high':
            risk += 0.2
        elif market_volatility == 'extreme':
            risk += 0.4

        return min(risk, 0.8)

    def _get_dependency_risk(self, context: Dict[str, Any]) -> float:
        """获取依赖风险"""
        risk = 0.0

        # 外部依赖数量
        external_dependencies = context.get('external_dependencies', 0)
        if external_dependencies > 5:
            risk += 0.3
        elif external_dependencies > 2:
            risk += 0.2

        # 关键依赖状态
        critical_dependencies = context.get('critical_dependencies', [])
        if critical_dependencies:
            risk += 0.2

        return min(risk, 0.6)

    def _get_compliance_risk(self, context: Dict[str, Any]) -> float:
        """获取合规风险"""
        risk = 0.0

        # 数据敏感性
        data_sensitivity = context.get('data_sensitivity', 'low')
        if data_sensitivity == 'high':
            risk += 0.4
        elif data_sensitivity == 'medium':
            risk += 0.2

        # 监管要求
        regulatory_requirements = context.get('regulatory_requirements', [])
        if regulatory_requirements:
            risk += len(regulatory_requirements) * 0.1

        return min(risk, 0.8)

class ContextAnalyzer:
    """上下文分析器"""

    def evaluate(self, context: Dict[str, Any]) -> float:
        """评估上下文稳定性"""

        stability = 0.5  # 基础稳定性

        # 数据质量
        data_quality = self._assess_data_quality(context)
        stability += data_quality * 0.3

        # 模型可靠性
        model_reliability = self._assess_model_reliability(context)
        stability += model_reliability * 0.3

        # 环境变化频率
        environment_stability = self._assess_environment_stability(context)
        stability += environment_stability * 0.2

        # 历史成功率
        historical_success = self._assess_historical_success(context)
        stability += historical_success * 0.2

        return min(stability, 1.0)

    def _assess_data_quality(self, context: Dict[str, Any]) -> float:
        """评估数据质量"""
        quality = 0.0

        # 数据完整性
        if context.get('data_complete', True):
            quality += 0.3

        # 数据新鲜度
        data_age_hours = context.get('data_age_hours', 0)
        if data_age_hours < 1:
            quality += 0.3
        elif data_age_hours < 24:
            quality += 0.2
        elif data_age_hours < 168:  # 一周
            quality += 0.1

        # 数据准确性
        if context.get('data_verified', False):
            quality += 0.4

        return min(quality, 1.0)

    def _assess_model_reliability(self, context: Dict[str, Any]) -> float:
        """评估模型可靠性"""
        reliability = 0.0

        # 模型版本稳定性
        if context.get('model_version_stable', True):
            reliability += 0.3

        # 历史准确率
        historical_accuracy = context.get('historical_accuracy', 0.8)
        reliability += historical_accuracy * 0.4

        # 负载状态
        model_load = context.get('model_load', 'normal')
        if model_load == 'low':
            reliability += 0.3
        elif model_load == 'normal':
            reliability += 0.2

        return min(reliability, 1.0)

    def _assess_environment_stability(self, context: Dict[str, Any]) -> float:
        """评估环境稳定性"""
        stability = 0.0

        # 系统状态
        system_status = context.get('system_status', 'healthy')
        if system_status == 'healthy':
            stability += 0.4
        elif system_status == 'degraded':
            stability += 0.2

        # 网络状态
        network_status = context.get('network_status', 'good')
        if network_status == 'good':
            stability += 0.3
        elif network_status == 'fair':
            stability += 0.2

        # 外部服务状态
        external_services = context.get('external_services_status', 'available')
        if external_services == 'available':
            stability += 0.3

        return min(stability, 1.0)

    def _assess_historical_success(self, context: Dict[str, Any]) -> float:
        """评估历史成功率"""
        success_rate = context.get('historical_success_rate', 0.8)
        return min(success_rate, 1.0)

# 导出主要接口
__all__ = [
    'EvidenceDrivenEngine',
    'EvidenceLedger',
    'AutonomyLevelManager',
    'Evidence',
    'DecisionRecord',
    'EvidenceLevel',
    'AutonomyLevel'
]

class EvidenceDrivenEngine:
    """证据驱动引擎主类 - 整合所有组件"""

    def __init__(self):
        self.evidence_ledger = EvidenceLedger()
        self.autonomy_manager = AutonomyLevelManager()
        self.decision_history: List[DecisionRecord] = []

    async def make_decision(self, claim: str, evidence_sources: List[Dict[str, Any]],
                          decision_type: str, context: Dict[str, Any],
                          constraints: Dict[str, Any]) -> DecisionRecord:
        """基于证据做出决策"""

        # 1. 记录证据
        evidence = await self.evidence_ledger.record_evidence(claim, evidence_sources, context)

        # 2. 确定自主等级
        autonomy_level = self.autonomy_manager.determine_loa(decision_type, context, constraints)

        # 3. 创建决策记录
        decision = DecisionRecord(
            decision_type=decision_type,
            context=context,
            autonomy_level=autonomy_level,
            evidence_references=[evidence.traceability_id],
            reasoning_process=self._generate_reasoning_process(evidence, autonomy_level),
            expected_outcome=self._predict_outcome(evidence, context)
        )

        # 4. 记录决策
        self.decision_history.append(decision)

        logger.info(f"决策已制定: {decision.decision_id}, 自主等级: {autonomy_level.value}")
        return decision

    def _generate_reasoning_process(self, evidence: Evidence, autonomy_level: AutonomyLevel) -> str:
        """生成推理过程说明"""
        process = f"基于证据等级 {evidence.evidence_level.value} (置信度: {evidence.confidence_level:.2f}) "
        process += f"和三角校验分数 {evidence.triangulation_score:.2f}，"
        process += f"确定自主等级为 {autonomy_level.value}。"

        if autonomy_level == AutonomyLevel.LOA4_HUMAN_ONLY:
            process += "此决策需要人工审核和批准。"
        elif autonomy_level == AutonomyLevel.LOA3_GUARDRAIL_AUTO:
            process += "在护栏内自动执行，设有监控和熔断机制。"
        elif autonomy_level == AutonomyLevel.LOA2_LOW_RISK_AUTO:
            process += "低风险自动执行，包含回滚机制。"
        elif autonomy_level == AutonomyLevel.LOA1_ALTERNATIVES:
            process += "提供多个备选方案供人类选择。"
        else:
            process += "提供决策建议，由人类最终决定。"

        return process

    def _predict_outcome(self, evidence: Evidence, context: Dict[str, Any]) -> Dict[str, Any]:
        """预测决策结果"""
        outcome = {
            'success_probability': evidence.confidence_level,
            'expected_benefit': self._estimate_benefit(evidence, context),
            'potential_risks': self._identify_risks(evidence, context),
            'monitoring_metrics': self._define_monitoring_metrics(context)
        }
        return outcome

    def _estimate_benefit(self, evidence: Evidence, context: Dict[str, Any]) -> str:
        """估算预期收益"""
        if evidence.confidence_level > 0.8:
            return "高预期收益"
        elif evidence.confidence_level > 0.6:
            return "中等预期收益"
        else:
            return "低预期收益"

    def _identify_risks(self, evidence: Evidence, context: Dict[str, Any]) -> List[str]:
        """识别潜在风险"""
        risks = []

        if evidence.confidence_level < 0.5:
            risks.append("证据置信度较低，决策可能不准确")

        if evidence.evidence_level == EvidenceLevel.LEVEL_5_SECONDARY_DATA:
            risks.append("依赖二手资料，信息可能过时或不准确")

        if context.get('public_visibility', False):
            risks.append("公开决策，可能影响声誉")

        return risks

    def _define_monitoring_metrics(self, context: Dict[str, Any]) -> List[str]:
        """定义监控指标"""
        metrics = ["执行状态", "结果准确性"]

        if context.get('budget_amount', 0) > 0:
            metrics.append("成本控制")

        if context.get('time_cost_hours', 0) > 0:
            metrics.append("时间效率")

        if context.get('public_visibility', False):
            metrics.append("用户反馈")
            metrics.append("声誉影响")

        return metrics

    async def get_decision_summary(self) -> Dict[str, Any]:
        """获取决策摘要"""
        if not self.decision_history:
            return {"total_decisions": 0}

        total = len(self.decision_history)
        by_autonomy = {}
        for decision in self.decision_history:
            loa = decision.autonomy_level.value
            by_autonomy[loa] = by_autonomy.get(loa, 0) + 1

        recent = self.decision_history[-10:]  # 最近10个决策

        return {
            "total_decisions": total,
            "by_autonomy_level": by_autonomy,
            "recent_decisions": [d.decision_id for d in recent],
            "total_evidence_records": len(self.evidence_ledger.evidence_storage)
        }