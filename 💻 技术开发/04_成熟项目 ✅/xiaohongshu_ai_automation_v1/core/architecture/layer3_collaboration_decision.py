#!/usr/bin/env python3
"""
Agent OS四层BMAD混合智能架构 - Layer3 协作决策逻辑层
Collaboration Decision Logic Layer - 人机边界清晰化、质量控制门禁、智能决策系统

基于小红书业务场景的智能协作和质量控制决策系统
"""

import asyncio
import json
import logging
import time
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
from typing import Dict, List, Optional, Any, Set, Tuple, Callable, Union
from pathlib import Path
import uuid
from collections import defaultdict, deque
import statistics
from concurrent.futures import ThreadPoolExecutor

logger = logging.getLogger(__name__)


class DecisionType(Enum):
    """决策类型"""
    CONTENT_APPROVAL = "content_approval"         # 内容审核
    QUALITY_GATE = "quality_gate"                # 质量门控
    HUMAN_INTERVENTION = "human_intervention"    # 人工干预
    AUTO_EXECUTION = "auto_execution"            # 自动执行
    COLLABORATION_ASSIGNMENT = "collaboration_assignment"  # 协作分配
    RISK_ASSESSMENT = "risk_assessment"          # 风险评估


class CollaborationMode(Enum):
    """协作模式"""
    HUMAN_ONLY = "human_only"                   # 纯人工
    AI_ONLY = "ai_only"                        # 纯AI
    HUMAN_AI_COLLAB = "human_ai_collab"         # 人机协作
    AI_HUMAN_COLLAB = "ai_human_collab"         # AI人协作
    PEER_REVIEW = "peer_review"                 # 同行评审
    COMMITTEE_DECISION = "committee_decision"   # 委员会决策


class QualityLevel(Enum):
    """质量等级"""
    EXCELLENT = "excellent"                    # 优秀
    GOOD = "good"                              # 良好
    ACCEPTABLE = "acceptable"                  # 可接受
    NEEDS_IMPROVEMENT = "needs_improvement"    # 需改进
    REJECTED = "rejected"                      # 拒绝


class RiskLevel(Enum):
    """风险等级"""
    LOW = "low"                                # 低风险
    MEDIUM = "medium"                          # 中风险
    HIGH = "high"                              # 高风险
    CRITICAL = "critical"                      # 严重风险


@dataclass
class DecisionRequest:
    """决策请求"""
    request_id: str
    decision_type: DecisionType
    requester: str
    context: Dict[str, Any]
    data: Dict[str, Any]
    priority: int = 2
    timestamp: datetime = field(default_factory=datetime.now)
    deadline: Optional[datetime] = None
    required_approvals: int = 1
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class DecisionResult:
    """决策结果"""
    request_id: str
    decision: str
    confidence: float
    reasoning: List[str]
    approved_by: List[str]
    quality_level: Optional[QualityLevel] = None
    risk_level: Optional[RiskLevel] = None
    execution_plan: Optional[Dict[str, Any]] = None
    conditions: List[str] = field(default_factory=list)
    timestamp: datetime = field(default_factory=datetime.now)
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class QualityGate:
    """质量门控"""
    gate_id: str
    name: str
    criteria: Dict[str, Any]
    thresholds: Dict[str, float]
    required_score: float
    auto_approve_threshold: float
    human_review_threshold: float
    escalation_conditions: List[str] = field(default_factory=list)


@dataclass
class HumanAIBoundary:
    """人机边界定义"""
    boundary_id: str
    task_type: str
    ai_capabilities: List[str]
    human_capabilities: List[str]
    collaboration_points: List[str]
    handoff_conditions: Dict[str, Any]
    fallback_triggers: List[str]


class HumanAIBoundaryManager:
    """人机边界管理器 - 定义和管理人机协作边界"""

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self.logger = logging.getLogger(f"{__name__}.HumanAIBoundaryManager")

        # 边界定义存储
        self.boundaries: Dict[str, HumanAIBoundary] = {}
        self.active_collaborations: Dict[str, Dict[str, Any]] = {}

        # 边界策略配置
        self.default_ai_capabilities = [
            "data_analysis", "pattern_recognition", "content_generation",
            "quality_assessment", "trend_prediction", "performance_optimization"
        ]
        self.default_human_capabilities = [
            "strategic_thinking", "creative_direction", "ethical_judgment",
            "brand_strategy", "relationship_management", "crisis_handling"
        ]

        # 初始化边界定义
        self._initialize_default_boundaries()

    def _initialize_default_boundaries(self):
        """初始化默认边界定义"""
        # 内容创作边界
        self.boundaries["content_creation"] = HumanAIBoundary(
            boundary_id="content_creation",
            task_type="content_creation",
            ai_capabilities=[
                "content_drafting", "seo_optimization", "trend_analysis",
                "performance_prediction", "brand_matching"
            ],
            human_capabilities=[
                "creative_direction", "brand_voice", "strategic_messaging",
                "final_approval", "quality_judgment"
            ],
            collaboration_points=[
                "concept_development", "draft_review", "final_approval"
            ],
            handoff_conditions={
                "to_human": {"quality_score_below": 0.7, "brand_risk_high": True},
                "to_ai": {"routine_task": True, "data_available": True}
            },
            fallback_triggers=[
                "quality_concerns", "brand_violations", "legal_issues",
                "user_complaints", "performance_issues"
            ]
        )

        # 趋势分析边界
        self.boundaries["trend_analysis"] = HumanAIBoundary(
            boundary_id="trend_analysis",
            task_type="trend_analysis",
            ai_capabilities=[
                "data_collection", "pattern_identification", "trend_prediction",
                "statistical_analysis", "visualization"
            ],
            human_capabilities=[
                "market_insight", "business_context", "strategic_implications",
                "risk_assessment", "action_planning"
            ],
            collaboration_points=[
                "hypothesis_formulation", "result_interpretation", "strategy_development"
            ],
            handoff_conditions={
                "to_human": {"prediction_confidence_below": 0.8, "business_impact_high": True},
                "to_ai": {"historical_data_available": True, "clear_objectives": True}
            },
            fallback_triggers=[
                "prediction_accuracy_drop", "market_volatility", "unexpected_events"
            ]
        )

        # 质量控制边界
        self.boundaries["quality_control"] = HumanAIBoundary(
            boundary_id="quality_control",
            task_type="quality_control",
            ai_capabilities=[
                "automated_checks", "compliance_verification", "quality_scoring",
                "error_detection", "consistency_checks"
            ],
            human_capabilities=[
                "contextual_judgment", "nuanced_evaluation", "brand_integrity",
                "user_experience_assessment", "strategic_alignment"
            ],
            collaboration_points=[
                "quality_standard_setting", "exception_handling", "final_approval"
            ],
            handoff_conditions={
                "to_human": {"quality_score_below": 0.8, "exceptions_detected": True},
                "to_ai": {"clear_criteria": True, "high_volume": True}
            },
            fallback_triggers=[
                "quality_issues", "compliance_concerns", "user_feedback_negative"
            ]
        )

    async def determine_collaboration_mode(self, task_data: Dict[str, Any]) -> CollaborationMode:
        """确定协作模式"""
        task_type = task_data.get("task_type", "general")
        complexity = task_data.get("complexity", 0.5)
        risk_level = task_data.get("risk_level", "medium")
        data_quality = task_data.get("data_quality", 0.8)
        human_preference = task_data.get("human_preference", "balanced")

        # 获取边界定义
        boundary = self.boundaries.get(task_type)
        if not boundary:
            boundary = self._get_general_boundary()

        # 评估AI处理能力
        ai_capability_score = await self._evaluate_ai_capability(boundary, task_data)

        # 评估人工需求
        human_necessity_score = await self._evaluate_human_necessity(boundary, task_data)

        # 决策逻辑
        if ai_capability_score > 0.8 and human_necessity_score < 0.3:
            return CollaborationMode.AI_ONLY
        elif human_necessity_score > 0.8 and ai_capability_score < 0.3:
            return CollaborationMode.HUMAN_ONLY
        elif ai_capability_score > 0.6 and human_necessity_score > 0.4:
            if human_preference == "ai_first":
                return CollaborationMode.AI_HUMAN_COLLAB
            else:
                return CollaborationMode.HUMAN_AI_COLLAB
        elif complexity > 0.8 or risk_level == "critical":
            return CollaborationMode.COMMITTEE_DECISION
        else:
            return CollaborationMode.PEER_REVIEW

    async def evaluate_handoff_need(self, task_id: str, current_handler: str,
                                  task_data: Dict[str, Any]) -> Optional[str]:
        """评估是否需要交接"""
        task_type = task_data.get("task_type", "general")
        boundary = self.boundaries.get(task_type)

        if not boundary:
            return None

        # 检查交接条件
        handoff_conditions = boundary.handoff_conditions

        if current_handler == "ai":
            # AI到人工的交接条件
            human_conditions = handoff_conditions.get("to_human", {})
            for condition, value in human_conditions.items():
                if await self._check_condition(condition, value, task_data):
                    return "human"
        else:
            # 人工到AI的交接条件
            ai_conditions = handoff_conditions.get("to_ai", {})
            for condition, value in ai_conditions.items():
                if await self._check_condition(condition, value, task_data):
                    return "ai"

        # 检查回退触发器
        for trigger in boundary.fallback_triggers:
            if await self._check_trigger(trigger, task_data):
                return "human" if current_handler == "ai" else "ai"

        return None

    async def create_collaboration_session(self, task_id: str, mode: CollaborationMode,
                                        participants: List[str], context: Dict[str, Any]) -> str:
        """创建协作会话"""
        session_id = f"collab_{uuid.uuid4().hex[:8]}"

        session_data = {
            "session_id": session_id,
            "task_id": task_id,
            "mode": mode,
            "participants": participants,
            "context": context,
            "status": "active",
            "created_at": datetime.now(),
            "handoff_history": [],
            "decisions_made": []
        }

        self.active_collaborations[session_id] = session_data
        self.logger.info(f"Created collaboration session: {session_id} (mode: {mode.value})")

        return session_id

    async def handle_handoff(self, session_id: str, from_handler: str, to_handler: str,
                           reason: str, handoff_data: Dict[str, Any]):
        """处理交接"""
        if session_id not in self.active_collaborations:
            self.logger.error(f"Collaboration session not found: {session_id}")
            return

        session = self.active_collaborations[session_id]

        handoff_record = {
            "timestamp": datetime.now(),
            "from_handler": from_handler,
            "to_handler": to_handler,
            "reason": reason,
            "data": handoff_data
        }

        session["handoff_history"].append(handoff_record)
        session["current_handler"] = to_handler

        self.logger.info(f"Handoff in session {session_id}: {from_handler} -> {to_handler} ({reason})")

    async def _evaluate_ai_capability(self, boundary: HumanAIBoundary, task_data: Dict[str, Any]) -> float:
        """评估AI处理能力"""
        capability_score = 0.0
        total_capabilities = len(boundary.ai_capabilities)

        for capability in boundary.ai_capabilities:
            if capability in task_data.get("available_ai_capabilities", []):
                capability_score += 1.0
            elif await self._can_ai_handle_capability(capability, task_data):
                capability_score += 0.8
            else:
                capability_score += 0.2

        return capability_score / total_capabilities if total_capabilities > 0 else 0.0

    async def _evaluate_human_necessity(self, boundary: HumanAIBoundary, task_data: Dict[str, Any]) -> float:
        """评估人工需求"""
        necessity_score = 0.0
        total_capabilities = len(boundary.human_capabilities)

        for capability in boundary.human_capabilities:
            if capability in task_data.get("required_human_skills", []):
                necessity_score += 1.0
            elif await self._requires_human_capability(capability, task_data):
                necessity_score += 0.8
            else:
                necessity_score += 0.2

        return necessity_score / total_capabilities if total_capabilities > 0 else 0.0

    async def _can_ai_handle_capability(self, capability: str, task_data: Dict[str, Any]) -> bool:
        """判断AI是否可以处理某项能力"""
        ai_capability_map = {
            "data_analysis": lambda d: d.get("data_available", False),
            "pattern_recognition": lambda d: d.get("historical_data_size", 0) > 100,
            "content_generation": lambda d: d.get("content_templates", False),
            "quality_assessment": lambda d: d.get("quality_criteria", False),
            "trend_prediction": lambda d: d.get("time_series_data", False),
            "performance_optimization": lambda d: d.get("performance_metrics", False)
        }

        evaluator = ai_capability_map.get(capability, lambda d: False)
        return evaluator(task_data)

    async def _requires_human_capability(self, capability: str, task_data: Dict[str, Any]) -> bool:
        """判断是否需要人工能力"""
        human_capability_map = {
            "strategic_thinking": lambda d: d.get("business_impact", 0) > 0.8,
            "creative_direction": lambda d: d.get("creativity_required", False),
            "ethical_judgment": lambda d: d.get("ethical_concerns", False),
            "brand_strategy": lambda d: d.get("brand_sensitivity", 0) > 0.7,
            "relationship_management": lambda d: d.get("customer_facing", False),
            "crisis_handling": lambda d: d.get("urgency_level", 0) > 0.9
        }

        evaluator = human_capability_map.get(capability, lambda d: False)
        return evaluator(task_data)

    async def _check_condition(self, condition: str, expected_value: Any, task_data: Dict[str, Any]) -> bool:
        """检查交接条件"""
        condition_evaluators = {
            "quality_score_below": lambda v, d: d.get("quality_score", 1.0) < v,
            "brand_risk_high": lambda v, d: d.get("brand_risk_score", 0) > 0.7,
            "prediction_confidence_below": lambda v, d: d.get("confidence", 1.0) < v,
            "business_impact_high": lambda v, d: d.get("business_impact", 0) > 0.8,
            "routine_task": lambda v, d: d.get("task_complexity", 0) < 0.5,
            "data_available": lambda v, d: d.get("data_status") == "available",
            "historical_data_available": lambda v, d: d.get("historical_data_points", 0) > 100,
            "clear_objectives": lambda v, d: bool(d.get("objectives")),
            "clear_criteria": lambda v, d: bool(d.get("evaluation_criteria")),
            "high_volume": lambda v, d: d.get("task_volume", 0) > 100
        }

        evaluator = condition_evaluators.get(condition)
        if evaluator:
            return evaluator(expected_value, task_data)
        return False

    async def _check_trigger(self, trigger: str, task_data: Dict[str, Any]) -> bool:
        """检查回退触发器"""
        trigger_conditions = {
            "quality_concerns": lambda d: d.get("quality_issues", []),
            "compliance_concerns": lambda d: d.get("compliance_flags", []),
            "user_feedback_negative": lambda d: d.get("user_sentiment", "positive") == "negative",
            "prediction_accuracy_drop": lambda d: d.get("accuracy_trend", "stable") == "declining",
            "market_volatility": lambda d: d.get("market_volatility_index", 0) > 0.8,
            "unexpected_events": lambda d: d.get("anomaly_detected", False),
            "performance_issues": lambda d: d.get("performance_metrics", {}).get("error_rate", 0) > 0.1
        }

        evaluator = trigger_conditions.get(trigger)
        if evaluator:
            return evaluator(task_data)
        return False

    def _get_general_boundary(self) -> HumanAIBoundary:
        """获取通用边界定义"""
        return HumanAIBoundary(
            boundary_id="general",
            task_type="general",
            ai_capabilities=self.default_ai_capabilities,
            human_capabilities=self.default_human_capabilities,
            collaboration_points=["decision_making", "review", "execution"],
            handoff_conditions={
                "to_human": {"complexity_above": 0.7, "risk_above": 0.6},
                "to_ai": {"routine_task": True, "clear_inputs": True}
            },
            fallback_triggers=["errors", "timeouts", "quality_issues"]
        )


class QualityGateController:
    """质量门控控制器 - 管理质量检查和审批流程"""

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self.logger = logging.getLogger(f"{__name__}.QualityGateController")

        # 质量门控定义
        self.quality_gates: Dict[str, QualityGate] = {}
        self.active_reviews: Dict[str, Dict[str, Any]] = {}

        # 质量检查配置
        self.auto_approval_enabled = True
        self.escalation_threshold = 0.3
        self.review_timeout = timedelta(hours=24)

        # 初始化默认质量门控
        self._initialize_default_gates()

    def _initialize_default_gates(self):
        """初始化默认质量门控"""
        # 内容质量门控
        self.quality_gates["content_quality"] = QualityGate(
            gate_id="content_quality",
            name="内容质量门控",
            criteria={
                "content_length": {"min": 100, "max": 5000},
                "readability_score": {"min": 0.6},
                "seo_score": {"min": 0.7},
                "brand_alignment": {"min": 0.8},
                "engagement_potential": {"min": 0.6}
            },
            thresholds={
                "excellent": 0.9,
                "good": 0.8,
                "acceptable": 0.7,
                "needs_improvement": 0.6
            },
            required_score=0.7,
            auto_approve_threshold=0.85,
            human_review_threshold=0.7,
            escalation_conditions=[
                "brand_violations", "legal_concerns", "quality_score_below_0.5"
            ]
        )

        # 性能质量门控
        self.quality_gates["performance_quality"] = QualityGate(
            gate_id="performance_quality",
            name="性能质量门控",
            criteria={
                "viral_potential": {"min": 0.6},
                "engagement_prediction": {"min": 0.7},
                "conversion_potential": {"min": 0.5},
                "technical_quality": {"min": 0.8}
            },
            thresholds={
                "excellent": 0.9,
                "good": 0.8,
                "acceptable": 0.7,
                "needs_improvement": 0.6
            },
            required_score=0.7,
            auto_approve_threshold=0.8,
            human_review_threshold=0.65,
            escalation_conditions=[
                "performance_decline", "user_complaints", "technical_issues"
            ]
        )

        # 合规性门控
        self.quality_gates["compliance_gate"] = QualityGate(
            gate_id="compliance_gate",
            name="合规性门控",
            criteria={
                "content_compliance": {"min": 0.9},
                "brand_guidelines": {"min": 0.95},
                "legal_requirements": {"min": 1.0},
                "platform_policies": {"min": 0.9}
            },
            thresholds={
                "excellent": 0.95,
                "good": 0.9,
                "acceptable": 0.85,
                "needs_improvement": 0.8
            },
            required_score=0.9,
            auto_approve_threshold=0.95,
            human_review_threshold=0.85,
            escalation_conditions=[
                "compliance_violations", "legal_risks", "policy_breaches"
            ]
        )

    async def evaluate_quality(self, gate_id: str, content_data: Dict[str, Any]) -> Dict[str, Any]:
        """评估内容质量"""
        gate = self.quality_gates.get(gate_id)
        if not gate:
            raise ValueError(f"Quality gate not found: {gate_id}")

        # 计算各项指标得分
        scores = {}
        total_score = 0.0
        weight_sum = 0.0

        for criterion, criterion_config in gate.criteria.items():
            score = await self._calculate_criterion_score(criterion, content_data, criterion_config)
            scores[criterion] = score
            total_score += score
            weight_sum += 1.0

        # 计算综合得分
        overall_score = total_score / weight_sum if weight_sum > 0 else 0.0

        # 确定质量等级
        quality_level = self._determine_quality_level(overall_score, gate.thresholds)

        # 检查升级条件
        escalation_needed = await self._check_escalation_conditions(gate, content_data, scores)

        # 决定处理方式
        if overall_score >= gate.auto_approve_threshold and not escalation_needed:
            decision = "auto_approve"
        elif overall_score >= gate.human_review_threshold:
            decision = "human_review"
        else:
            decision = "reject"

        return {
            "gate_id": gate_id,
            "overall_score": overall_score,
            "quality_level": quality_level.value,
            "criterion_scores": scores,
            "decision": decision,
            "escalation_needed": escalation_needed,
            "evaluation_time": datetime.now().isoformat()
        }

    async def create_review_process(self, gate_id: str, content_data: Dict[str, Any],
                                 requester: str, priority: int = 2) -> str:
        """创建质量审核流程"""
        review_id = f"review_{uuid.uuid4().hex[:8]}"

        # 首先进行自动评估
        auto_evaluation = await self.evaluate_quality(gate_id, content_data)

        review_data = {
            "review_id": review_id,
            "gate_id": gate_id,
            "content_data": content_data,
            "requester": requester,
            "priority": priority,
            "auto_evaluation": auto_evaluation,
            "status": "pending",
            "created_at": datetime.now(),
            "reviewers": [],
            "review_history": [],
            "final_decision": None,
            "deadline": datetime.now() + self.review_timeout
        }

        self.active_reviews[review_id] = review_data

        # 如果可以自动批准，直接完成
        if auto_evaluation["decision"] == "auto_approve":
            await self._complete_review(review_id, "approved", auto_evaluation)

        self.logger.info(f"Created review process: {review_id} (decision: {auto_evaluation['decision']})")
        return review_id

    async def submit_review(self, review_id: str, reviewer: str, decision: str,
                          comments: str, score: Optional[float] = None) -> bool:
        """提交审核结果"""
        if review_id not in self.active_reviews:
            self.logger.error(f"Review not found: {review_id}")
            return False

        review = self.active_reviews[review_id]

        # 添加审核记录
        review_record = {
            "reviewer": reviewer,
            "decision": decision,
            "comments": comments,
            "score": score,
            "timestamp": datetime.now()
        }

        review["review_history"].append(review_record)
        review["reviewers"].append(reviewer)

        # 检查是否需要更多审核
        required_approvals = self.quality_gates[review["gate_id"]].required_approvals
        approvals = sum(1 for r in review["review_history"] if r["decision"] == "approved")

        if approvals >= required_approvals:
            await self._complete_review(review_id, "approved", review_record)
        elif len(review["review_history"]) >= required_approvals * 2:
            # 如果审核次数过多，根据多数决定
            decisions = [r["decision"] for r in review["review_history"]]
            final_decision = max(set(decisions), key=decisions.count)
            await self._complete_review(review_id, final_decision, review_record)

        return True

    async def _calculate_criterion_score(self, criterion: str, content_data: Dict[str, Any],
                                      criterion_config: Dict[str, Any]) -> float:
        """计算单个标准得分"""
        evaluators = {
            "content_length": self._evaluate_content_length,
            "readability_score": self._evaluate_readability,
            "seo_score": self._evaluate_seo,
            "brand_alignment": self._evaluate_brand_alignment,
            "engagement_potential": self._evaluate_engagement_potential,
            "viral_potential": self._evaluate_viral_potential,
            "engagement_prediction": self._evaluate_engagement_prediction,
            "conversion_potential": self._evaluate_conversion_potential,
            "technical_quality": self._evaluate_technical_quality,
            "content_compliance": self._evaluate_compliance,
            "brand_guidelines": self._evaluate_brand_guidelines,
            "legal_requirements": self._evaluate_legal_requirements,
            "platform_policies": self._evaluate_platform_policies
        }

        evaluator = evaluators.get(criterion, lambda d, c: 0.5)
        return evaluator(content_data, criterion_config)

    async def _evaluate_content_length(self, content_data: Dict[str, Any], config: Dict[str, Any]) -> float:
        """评估内容长度"""
        content = content_data.get("content", "")
        length = len(content)

        min_len = config.get("min", 50)
        max_len = config.get("max", 2000)

        if min_len <= length <= max_len:
            return 1.0
        elif length < min_len:
            return max(0.0, length / min_len)
        else:
            return max(0.0, 1.0 - (length - max_len) / max_len)

    async def _evaluate_readability(self, content_data: Dict[str, Any], config: Dict[str, Any]) -> float:
        """评估可读性"""
        content = content_data.get("content", "")
        if not content:
            return 0.0

        # 简化的可读性计算
        sentences = content.count('。') + content.count('！') + content.count('？') + 1
        avg_sentence_length = len(content) / max(1, sentences)

        # 理想句子长度为15-25个字符
        if 15 <= avg_sentence_length <= 25:
            readability = 1.0
        else:
            readability = max(0.0, 1.0 - abs(avg_sentence_length - 20) / 20)

        # 考虑段落结构
        paragraphs = content.split('\n\n')
        structure_bonus = min(0.2, len(paragraphs) * 0.05)

        return min(1.0, readability + structure_bonus)

    async def _evaluate_seo(self, content_data: Dict[str, Any], config: Dict[str, Any]) -> float:
        """评估SEO优化"""
        title = content_data.get("title", "")
        content = content_data.get("content", "")
        tags = content_data.get("tags", [])

        score = 0.0

        # 标题优化
        if title and 10 <= len(title) <= 30:
            score += 0.3

        # 关键词密度
        keywords = content_data.get("keywords", [])
        if keywords:
            keyword_count = sum(content.lower().count(kw.lower()) for kw in keywords)
            keyword_density = keyword_count / len(content) if content else 0
            if 0.02 <= keyword_density <= 0.05:  # 2%-5%密度
                score += 0.3

        # 标签相关性
        if tags and len(tags) >= 3:
            score += 0.2

        # 内容结构
        if content and content.count('\n') >= 2:
            score += 0.2

        return score

    async def _evaluate_brand_alignment(self, content_data: Dict[str, Any], config: Dict[str, Any]) -> float:
        """评估品牌一致性"""
        brand_keywords = content_data.get("brand_keywords", [])
        content = content_data.get("content", "") + " " + content_data.get("title", "")

        if not brand_keywords:
            return 0.8  # 默认分数

        content_lower = content.lower()
        matches = sum(1 for kw in brand_keywords if kw.lower() in content_lower)

        return min(1.0, matches / len(brand_keywords))

    async def _evaluate_engagement_potential(self, content_data: Dict[str, Any], config: Dict[str, Any]) -> float:
        """评估互动潜力"""
        content = content_data.get("content", "")
        score = 0.0

        # 问题元素
        if '？' in content or '问题' in content:
            score += 0.3

        # 情感词汇
        emotional_words = ['震惊', '惊喜', '感动', '实用', '必看', '推荐']
        emotional_count = sum(1 for word in emotional_words if word in content)
        score += min(0.3, emotional_count * 0.1)

        # 行动召唤
        cta_phrases = ['关注', '收藏', '评论', '分享', '点赞']
        cta_count = sum(1 for phrase in cta_phrases if phrase in content)
        score += min(0.2, cta_count * 0.07)

        # 价值主张
        value_words = ['干货', '攻略', '教程', '技巧', '方法']
        value_count = sum(1 for word in value_words if word in content)
        score += min(0.2, value_count * 0.05)

        return score

    async def _evaluate_viral_potential(self, content_data: Dict[str, Any], config: Dict[str, Any]) -> float:
        """评估爆款潜力"""
        # 简化实现，基于多个因子
        title = content_data.get("title", "")
        content = content_data.get("content", "")

        viral_factors = {
            "title_hook": self._calculate_title_hook(title),
            "content_quality": await self._evaluate_readability(content_data, {}),
            "trending_topics": self._check_trending_topics(content_data),
            "emotional_impact": self._calculate_emotional_impact(content),
            "shareability": self._calculate_shareability(content_data)
        }

        return sum(viral_factors.values()) / len(viral_factors)

    async def _evaluate_engagement_prediction(self, content_data: Dict[str, Any], config: Dict[str, Any]) -> float:
        """评估互动预测"""
        # 基于历史数据的简化预测
        historical_performance = content_data.get("historical_performance", {})
        if historical_performance:
            avg_engagement = historical_performance.get("avg_engagement_rate", 0.05)
            return min(1.0, avg_engagement * 10)  # 标准化到0-1
        return 0.5  # 默认值

    async def _evaluate_conversion_potential(self, content_data: Dict[str, Any], config: Dict[str, Any]) -> float:
        """评估转化潜力"""
        content = content_data.get("content", "")

        # 商业关键词检测
        business_keywords = ['购买', '优惠', '折扣', '限时', '免费', '试用']
        business_count = sum(1 for word in business_keywords if word in content)

        # 紧迫性检测
        urgency_words = ['立即', '马上', '最后', '仅限', '今日']
        urgency_count = sum(1 for word in urgency_words if word in content)

        return min(1.0, (business_count + urgency_count) * 0.2)

    async def _evaluate_technical_quality(self, content_data: Dict[str, Any], config: Dict[str, Any]) -> float:
        """评估技术质量"""
        score = 1.0  # 默认满分

        # 检查技术问题
        content = content_data.get("content", "")

        # 重复内容检测
        sentences = content.split('。')
        unique_sentences = set(sentences)
        if len(sentences) > 0 and len(unique_sentences) / len(sentences) < 0.8:
            score -= 0.2

        # 格式问题
        if content.count('\n') == 0 and len(content) > 200:
            score -= 0.1

        return max(0.0, score)

    async def _evaluate_compliance(self, content_data: Dict[str, Any], config: Dict[str, Any]) -> float:
        """评估合规性"""
        # 简化的合规检查
        prohibited_words = ['违法', '欺诈', '虚假', '误导', '侵权']
        content = content_data.get("content", "") + " " + content_data.get("title", "")

        violations = sum(1 for word in prohibited_words if word in content)
        return max(0.0, 1.0 - violations * 0.5)

    async def _evaluate_brand_guidelines(self, content_data: Dict[str, Any], config: Dict[str, Any]) -> float:
        """评估品牌指导原则"""
        return await self._evaluate_brand_alignment(content_data, config)

    async def _evaluate_legal_requirements(self, content_data: Dict[str, Any], config: Dict[str, Any]) -> float:
        """评估法律要求"""
        # 简化法律检查
        content = content_data.get("content", "")

        # 需要免责声明的内容类型
        disclaimer_needed = ['投资', '理财', '健康', '医疗']
        needs_disclaimer = any(word in content for word in disclaimer_needed)
        has_disclaimer = '免责声明' in content or '风险提示' in content

        if needs_disclaimer and not has_disclaimer:
            return 0.5
        return 1.0

    async def _evaluate_platform_policies(self, content_data: Dict[str, Any], config: Dict[str, Any]) -> float:
        """评估平台政策"""
        # 简化平台政策检查
        content = content_data.get("content", "")

        # 检查可能的违规内容
        policy_violations = [
            '联系方式', '二维码', '链接', '广告', '推广'
        ]
        violation_count = sum(1 for word in policy_violations if word in content)

        return max(0.0, 1.0 - violation_count * 0.2)

    def _calculate_title_hook(self, title: str) -> float:
        """计算标题吸引力"""
        if not title:
            return 0.0

        hook_words = ['震惊', '必看', '绝了', '太香了', 'yyds', '宝藏', '干货']
        hook_count = sum(1 for word in hook_words if word in title)

        return min(1.0, hook_count * 0.3 + (10 <= len(title) <= 30) * 0.4)

    def _check_trending_topics(self, content_data: Dict[str, Any]) -> float:
        """检查热门话题"""
        trending_topics = ['AI工具', '数字化转型', '效率提升', '智能办公']
        content = content_data.get("content", "") + " " + content_data.get("title", "")

        topic_matches = sum(1 for topic in trending_topics if topic in content)
        return min(1.0, topic_matches * 0.3)

    def _calculate_emotional_impact(self, content: str) -> float:
        """计算情感影响"""
        emotional_words = ['惊喜', '感动', '震惊', '温暖', '治愈']
        emotional_count = sum(1 for word in emotional_words if word in content)

        return min(1.0, emotional_count * 0.2)

    def _calculate_shareability(self, content_data: Dict[str, Any]) -> float:
        """计算可分享性"""
        content = content_data.get("content", "")

        # 实用性
        practical_words = ['方法', '技巧', '攻略', '教程', '步骤']
        practical_score = sum(1 for word in practical_words if word in content) * 0.1

        # 独特性
        unique_words = ['独家', '首次', '原创', '首发']
        unique_score = sum(1 for word in unique_words if word in content) * 0.2

        return min(1.0, practical_score + unique_score)

    def _determine_quality_level(self, score: float, thresholds: Dict[str, float]) -> QualityLevel:
        """确定质量等级"""
        if score >= thresholds.get("excellent", 0.9):
            return QualityLevel.EXCELLENT
        elif score >= thresholds.get("good", 0.8):
            return QualityLevel.GOOD
        elif score >= thresholds.get("acceptable", 0.7):
            return QualityLevel.ACCEPTABLE
        elif score >= thresholds.get("needs_improvement", 0.6):
            return QualityLevel.NEEDS_IMPROVEMENT
        else:
            return QualityLevel.REJECTED

    async def _check_escalation_conditions(self, gate: QualityGate, content_data: Dict[str, Any],
                                         scores: Dict[str, float]) -> bool:
        """检查升级条件"""
        for condition in gate.escalation_conditions:
            if condition == "brand_violations" and scores.get("brand_alignment", 1.0) < 0.5:
                return True
            elif condition == "legal_concerns" and scores.get("legal_requirements", 1.0) < 0.8:
                return True
            elif condition == "quality_score_below_0.5":
                overall_score = sum(scores.values()) / len(scores) if scores else 0.0
                if overall_score < 0.5:
                    return True

        return False

    async def _complete_review(self, review_id: str, decision: str, evaluation: Dict[str, Any]):
        """完成审核"""
        if review_id in self.active_reviews:
            review = self.active_reviews[review_id]
            review["final_decision"] = decision
            review["status"] = "completed"
            review["completed_at"] = datetime.now()

            self.logger.info(f"Review completed: {review_id} (decision: {decision})")


class DecisionEngine:
    """决策引擎 - 智能决策制定"""

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self.logger = logging.getLogger(f"{__name__}.DecisionEngine")

        # 决策规则存储
        self.decision_rules: Dict[str, Callable] = {}
        self.decision_history: List[Dict[str, Any]] = []

        # 决策权重配置
        self.decision_weights = {
            "data_driven": 0.4,
            "experience_based": 0.3,
            "risk_aversion": 0.2,
            "efficiency_focus": 0.1
        }

        # 初始化决策规则
        self._initialize_decision_rules()

    def _initialize_decision_rules(self):
        """初始化决策规则"""
        self.decision_rules = {
            DecisionType.CONTENT_APPROVAL: self._decide_content_approval,
            DecisionType.QUALITY_GATE: self._decide_quality_gate,
            DecisionType.HUMAN_INTERVENTION: self._decide_human_intervention,
            DecisionType.AUTO_EXECUTION: self._decide_auto_execution,
            DecisionType.COLLABORATION_ASSIGNMENT: self._decide_collaboration_assignment,
            DecisionType.RISK_ASSESSMENT: self._decide_risk_assessment
        }

    async def make_decision(self, request: DecisionRequest) -> DecisionResult:
        """制定决策"""
        start_time = time.time()

        try:
            # 获取决策规则
            decision_rule = self.decision_rules.get(request.decision_type)
            if not decision_rule:
                raise ValueError(f"No decision rule for type: {request.decision_type}")

            # 执行决策
            decision_data = await decision_rule(request)

            # 构建决策结果
            result = DecisionResult(
                request_id=request.request_id,
                decision=decision_data["decision"],
                confidence=decision_data["confidence"],
                reasoning=decision_data["reasoning"],
                approved_by=decision_data["approved_by"],
                quality_level=decision_data.get("quality_level"),
                risk_level=decision_data.get("risk_level"),
                execution_plan=decision_data.get("execution_plan"),
                conditions=decision_data.get("conditions", [])
            )

            # 记录决策历史
            decision_record = {
                "request_id": request.request_id,
                "decision_type": request.decision_type.value,
                "decision": result.decision,
                "confidence": result.confidence,
                "processing_time": time.time() - start_time,
                "timestamp": datetime.now().isoformat()
            }
            self.decision_history.append(decision_record)

            # 限制历史记录数量
            if len(self.decision_history) > 1000:
                self.decision_history.pop(0)

            self.logger.info(f"Decision made: {request.request_id} -> {result.decision}")
            return result

        except Exception as e:
            self.logger.error(f"Decision making error: {e}")
            return DecisionResult(
                request_id=request.request_id,
                decision="error",
                confidence=0.0,
                reasoning=[f"Decision error: {str(e)}"],
                approved_by=["system"]
            )

    async def _decide_content_approval(self, request: DecisionRequest) -> Dict[str, Any]:
        """内容审批决策"""
        content_data = request.data.get("content", {})
        quality_score = content_data.get("quality_score", 0.5)
        risk_score = content_data.get("risk_score", 0.3)
        brand_alignment = content_data.get("brand_alignment", 0.7)

        # 决策逻辑
        if quality_score >= 0.8 and risk_score <= 0.2 and brand_alignment >= 0.8:
            decision = "approve"
            confidence = 0.9
            reasoning = ["高质量内容", "低风险", "品牌一致性好"]
        elif quality_score >= 0.6 and risk_score <= 0.5:
            decision = "conditional_approve"
            confidence = 0.7
            reasoning = ["内容质量可接受", "需要监控风险", "建议小幅修改"]
        else:
            decision = "reject"
            confidence = 0.8
            reasoning = ["质量不达标", "风险较高", "需要重新制作"]

        return {
            "decision": decision,
            "confidence": confidence,
            "reasoning": reasoning,
            "approved_by": ["ai_system"],
            "quality_level": self._map_score_to_quality_level(quality_score),
            "risk_level": self._map_score_to_risk_level(risk_score),
            "conditions": self._generate_approval_conditions(decision, content_data)
        }

    async def _decide_quality_gate(self, request: DecisionRequest) -> Dict[str, Any]:
        """质量门控决策"""
        gate_results = request.data.get("gate_results", {})
        overall_score = gate_results.get("overall_score", 0.5)
        escalation_needed = gate_results.get("escalation_needed", False)

        if escalation_needed:
            decision = "escalate"
            confidence = 1.0
            reasoning = ["触发升级条件", "需要人工审核"]
            approved_by = ["system_escalation"]
        elif overall_score >= 0.8:
            decision = "pass"
            confidence = 0.9
            reasoning = ["质量评估优秀", "符合所有标准"]
            approved_by = ["ai_quality_system"]
        elif overall_score >= 0.6:
            decision = "conditional_pass"
            confidence = 0.7
            reasoning = ["质量基本达标", "需要小幅改进"]
            approved_by = ["ai_quality_system"]
        else:
            decision = "fail"
            confidence = 0.8
            reasoning = ["质量不达标", "需要重大改进"]
            approved_by = ["ai_quality_system"]

        return {
            "decision": decision,
            "confidence": confidence,
            "reasoning": reasoning,
            "approved_by": approved_by,
            "quality_level": self._map_score_to_quality_level(overall_score)
        }

    async def _decide_human_intervention(self, request: DecisionRequest) -> Dict[str, Any]:
        """人工干预决策"""
        complexity = request.data.get("complexity", 0.5)
        risk_level = request.data.get("risk_level", "medium")
        automation_confidence = request.data.get("automation_confidence", 0.7)

        if (complexity >= 0.8 or risk_level == "critical" or
            automation_confidence < 0.6):
            decision = "require_human_intervention"
            confidence = 0.9
            reasoning = ["高复杂度或高风险", "自动化置信度不足"]
            approved_by = ["risk_assessment_system"]
        else:
            decision = "proceed_with_automation"
            confidence = 0.8
            reasoning = ["风险可控", "自动化能力充足"]
            approved_by = ["automation_system"]

        return {
            "decision": decision,
            "confidence": confidence,
            "reasoning": reasoning,
            "approved_by": approved_by,
            "risk_level": RiskLevel(risk_level) if isinstance(risk_level, str) else None
        }

    async def _decide_auto_execution(self, request: DecisionRequest) -> Dict[str, Any]:
        """自动执行决策"""
        task_complexity = request.data.get("complexity", 0.5)
        resource_availability = request.data.get("resource_availability", 0.8)
        error_rate = request.data.get("historical_error_rate", 0.1)

        success_probability = (1 - task_complexity) * resource_availability * (1 - error_rate)

        if success_probability >= 0.9:
            decision = "auto_execute"
            confidence = 0.95
            reasoning = ["成功概率高", "资源充足", "历史错误率低"]
        elif success_probability >= 0.7:
            decision = "auto_execute_with_monitoring"
            confidence = 0.8
            reasoning = ["成功概率中等", "建议执行监控"]
        else:
            decision = "manual_execution_required"
            confidence = 0.85
            reasoning = ["成功概率低", "建议人工执行"]

        return {
            "decision": decision,
            "confidence": confidence,
            "reasoning": reasoning,
            "approved_by": ["execution_planner"],
            "execution_plan": self._generate_execution_plan(decision, request.data)
        }

    async def _decide_collaboration_assignment(self, request: DecisionRequest) -> Dict[str, Any]:
        """协作分配决策"""
        task_requirements = request.data.get("task_requirements", {})
        available_agents = request.data.get("available_agents", [])
        team_workload = request.data.get("team_workload", {})

        # 计算最佳分配
        best_assignment = None
        best_score = 0.0

        for agent in available_agents:
            score = await self._calculate_assignment_score(agent, task_requirements, team_workload)
            if score > best_score:
                best_score = score
                best_assignment = agent

        if best_score >= 0.8:
            decision = f"assign_to_{best_assignment}"
            confidence = best_score
            reasoning = [f"{best_assignment}最适合此任务", "能力匹配度高"]
        elif best_score >= 0.6:
            decision = f"assign_to_{best_assignment}_with_support"
            confidence = best_score
            reasoning = [f"{best_assignment}基本适合", "建议提供支持"]
        else:
            decision = "require_team_collaboration"
            confidence = 0.7
            reasoning = ["需要团队协作", "单一Agent能力不足"]

        return {
            "decision": decision,
            "confidence": confidence,
            "reasoning": reasoning,
            "approved_by": ["task_assignment_system"],
            "execution_plan": {
                "primary_agent": best_assignment,
                "support_required": decision.endswith("_with_support"),
                "collaboration_needed": decision == "require_team_collaboration"
            }
        }

    async def _decide_risk_assessment(self, request: DecisionRequest) -> Dict[str, Any]:
        """风险评估决策"""
        risk_factors = request.data.get("risk_factors", {})
        impact_level = request.data.get("impact_level", "medium")
        probability = request.data.get("probability", 0.5)

        # 计算风险分数
        risk_score = self._calculate_risk_score(risk_factors, impact_level, probability)

        if risk_score >= 0.8:
            decision = "high_risk"
            confidence = 0.9
            reasoning = ["高风险识别", "需要立即关注"]
        elif risk_score >= 0.6:
            decision = "medium_risk"
            confidence = 0.8
            reasoning = ["中等风险", "需要监控"]
        else:
            decision = "low_risk"
            confidence = 0.85
            reasoning = ["风险较低", "可正常执行"]

        return {
            "decision": decision,
            "confidence": confidence,
            "reasoning": reasoning,
            "approved_by": ["risk_assessment_system"],
            "risk_level": self._map_score_to_risk_level(risk_score),
            "conditions": self._generate_risk_mitigation_conditions(decision, risk_factors)
        }

    async def _calculate_assignment_score(self, agent: str, requirements: Dict[str, Any],
                                        workload: Dict[str, Any]) -> float:
        """计算分配得分"""
        # 简化实现
        base_score = 0.7
        if agent in requirements.get("preferred_agents", []):
            base_score += 0.2
        if workload.get(agent, 0) < 0.8:
            base_score += 0.1
        return min(1.0, base_score)

    def _calculate_risk_score(self, risk_factors: Dict[str, Any], impact_level: str, probability: float) -> float:
        """计算风险分数"""
        impact_weights = {"low": 0.3, "medium": 0.6, "high": 0.9, "critical": 1.0}
        impact_weight = impact_weights.get(impact_level, 0.6)

        factor_score = sum(risk_factors.values()) / len(risk_factors) if risk_factors else 0.5

        return (factor_score * 0.6 + probability * 0.4) * impact_weight

    def _map_score_to_quality_level(self, score: float) -> QualityLevel:
        """映射分数到质量等级"""
        if score >= 0.9:
            return QualityLevel.EXCELLENT
        elif score >= 0.8:
            return QualityLevel.GOOD
        elif score >= 0.7:
            return QualityLevel.ACCEPTABLE
        elif score >= 0.6:
            return QualityLevel.NEEDS_IMPROVEMENT
        else:
            return QualityLevel.REJECTED

    def _map_score_to_risk_level(self, score: float) -> RiskLevel:
        """映射分数到风险等级"""
        if score >= 0.8:
            return RiskLevel.CRITICAL
        elif score >= 0.6:
            return RiskLevel.HIGH
        elif score >= 0.4:
            return RiskLevel.MEDIUM
        else:
            return RiskLevel.LOW

    def _generate_approval_conditions(self, decision: str, content_data: Dict[str, Any]) -> List[str]:
        """生成审批条件"""
        conditions = []
        if decision == "conditional_approve":
            conditions.append("需要修改后重新审核")
            conditions.append("增加品牌关键词")
        return conditions

    def _generate_execution_plan(self, decision: str, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """生成执行计划"""
        plan = {
            "execution_mode": decision,
            "monitoring_required": decision.endswith("_with_monitoring"),
            "estimated_duration": task_data.get("estimated_duration", 3600)
        }
        return plan

    def _generate_risk_mitigation_conditions(self, decision: str, risk_factors: Dict[str, Any]) -> List[str]:
        """生成风险缓解条件"""
        conditions = []
        if decision == "high_risk":
            conditions.append("需要额外审核")
            conditions.append("制定应急预案")
        elif decision == "medium_risk":
            conditions.append("加强监控")
            conditions.append("定期风险评估")
        return conditions


class CollaborationDecisionLayer:
    """协作决策逻辑层主控制器"""

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self.logger = logging.getLogger(f"{__name__}.CollaborationDecisionLayer")

        # 初始化组件
        self.boundary_manager = HumanAIBoundaryManager(config)
        self.quality_gate = QualityGateController(config)
        self.decision_engine = DecisionEngine(config)

        # 决策请求队列
        self.decision_queue = asyncio.Queue()
        self.active_decisions: Dict[str, Dict[str, Any]] = {}

        # 性能指标
        self.decision_metrics = {
            "total_decisions": 0,
            "auto_approvals": 0,
            "human_interventions": 0,
            "average_decision_time": 0.0,
            "decision_accuracy": 0.0,
            "quality_gates_passed": 0
        }

        # 启动决策处理任务
        asyncio.create_task(self._process_decision_queue())

    async def process_decision_request(self, request: DecisionRequest) -> DecisionResult:
        """处理决策请求"""
        start_time = time.time()

        try:
            # 添加到队列
            await self.decision_queue.put(request)

            # 确定协作模式
            collaboration_mode = await self.boundary_manager.determine_collaboration_mode(
                request.context
            )

            # 如果需要质量门控，先执行质量评估
            if request.decision_type == DecisionType.CONTENT_APPROVAL:
                quality_result = await self.quality_gate.create_review_process(
                    "content_quality",
                    request.data,
                    request.requester,
                    request.priority
                )
                request.data["quality_review_id"] = quality_result

            # 执行决策
            result = await self.decision_engine.make_decision(request)

            # 添加协作信息
            result.metadata["collaboration_mode"] = collaboration_mode.value

            # 更新性能指标
            processing_time = time.time() - start_time
            await self._update_decision_metrics(result, processing_time)

            # 如果需要，创建协作会话
            if collaboration_mode in [CollaborationMode.HUMAN_AI_COLLAB, CollaborationMode.AI_HUMAN_COLLAB]:
                session_id = await self.boundary_manager.create_collaboration_session(
                    request.request_id,
                    collaboration_mode,
                    result.approved_by,
                    request.context
                )
                result.metadata["collaboration_session_id"] = session_id

            self.logger.info(f"Decision processed: {request.request_id} -> {result.decision}")
            return result

        except Exception as e:
            self.logger.error(f"Decision processing error: {e}")
            return DecisionResult(
                request_id=request.request_id,
                decision="error",
                confidence=0.0,
                reasoning=[f"Processing error: {str(e)}"],
                approved_by=["system"]
            )

    async def request_human_intervention(self, task_id: str, reason: str,
                                       context: Dict[str, Any]) -> str:
        """请求人工干预"""
        request = DecisionRequest(
            request_id=f"human_intervention_{uuid.uuid4().hex[:8]}",
            decision_type=DecisionType.HUMAN_INTERVENTION,
            requester="system",
            context=context,
            data={
                "task_id": task_id,
                "reason": reason,
                "urgency": context.get("urgency", "medium")
            },
            priority=1
        )

        result = await self.process_decision_request(request)
        return result.request_id

    async def submit_for_quality_review(self, content_data: Dict[str, Any],
                                      requester: str) -> str:
        """提交质量审核"""
        request = DecisionRequest(
            request_id=f"quality_review_{uuid.uuid4().hex[:8]}",
            decision_type=DecisionType.QUALITY_GATE,
            requester=requester,
            context={"content_type": content_data.get("type", "unknown")},
            data=content_data
        )

        result = await self.process_decision_request(request)
        return result.request_id

    async def evaluate_collaboration_needs(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """评估协作需求"""
        collaboration_mode = await self.boundary_manager.determine_collaboration_mode(task_data)

        # 检查交接需求
        handoff_need = await self.boundary_manager.evaluate_handoff_need(
            task_data.get("task_id", "unknown"),
            task_data.get("current_handler", "unknown"),
            task_data
        )

        return {
            "collaboration_mode": collaboration_mode.value,
            "handoff_recommended": handoff_need,
            "human_involvement_required": collaboration_mode in [
                CollaborationMode.HUMAN_ONLY,
                CollaborationMode.HUMAN_AI_COLLAB,
                CollaborationMode.AI_HUMAN_COLLAB,
                CollaborationMode.PEER_REVIEW,
                CollaborationMode.COMMITTEE_DECISION
            ],
            "recommended_participants": await self._get_recommended_participants(collaboration_mode, task_data)
        }

    async def _get_recommended_participants(self, mode: CollaborationMode,
                                         task_data: Dict[str, Any]) -> List[str]:
        """获取推荐参与者"""
        participants = []

        if mode == CollaborationMode.AI_ONLY:
            participants = ["AI_Content_Creator", "AI_Quality_Assessor"]
        elif mode == CollaborationMode.HUMAN_ONLY:
            participants = ["Human_Content_Strategist", "Human_Brand_Manager"]
        elif mode in [CollaborationMode.HUMAN_AI_COLLAB, CollaborationMode.AI_HUMAN_COLLAB]:
            participants = ["AI_Content_Creator", "Human_Content_Strategist", "AI_Quality_Assessor"]
        elif mode == CollaborationMode.PEER_REVIEW:
            participants = ["Senior_Content_Expert", "Brand_Specialist"]
        elif mode == CollaborationMode.COMMITTEE_DECISION:
            participants = ["Content_Director", "Brand_Manager", "Legal_Advisor", "AI_Advisor"]

        return participants

    async def _process_decision_queue(self):
        """处理决策队列"""
        while True:
            try:
                request = await self.decision_queue.get()
                self.active_decisions[request.request_id] = {
                    "request": request,
                    "status": "processing",
                    "started_at": datetime.now()
                }

                # 处理决策（已在process_decision_request中完成）
                await asyncio.sleep(0.1)

            except Exception as e:
                self.logger.error(f"Decision queue processing error: {e}")

    async def _update_decision_metrics(self, result: DecisionResult, processing_time: float):
        """更新决策性能指标"""
        self.decision_metrics["total_decisions"] += 1

        # 更新平均处理时间
        total = self.decision_metrics["total_decisions"]
        current_avg = self.decision_metrics["average_decision_time"]
        self.decision_metrics["average_decision_time"] = (
            (current_avg * (total - 1) + processing_time) / total
        )

        # 统计决策类型
        if "auto" in result.decision.lower():
            self.decision_metrics["auto_approvals"] += 1
        elif "human" in result.decision.lower():
            self.decision_metrics["human_interventions"] += 1

        # 统计质量门控
        if result.quality_level in [QualityLevel.EXCELLENT, QualityLevel.GOOD]:
            self.decision_metrics["quality_gates_passed"] += 1

    async def get_layer_status(self) -> Dict[str, Any]:
        """获取层状态信息"""
        return {
            "layer_name": "layer3_collaboration_decision",
            "components": {
                "boundary_manager": {
                    "boundaries_defined": len(self.boundary_manager.boundaries),
                    "active_collaborations": len(self.boundary_manager.active_collaborations)
                },
                "quality_gate": {
                    "gates_defined": len(self.quality_gate.quality_gates),
                    "active_reviews": len(self.quality_gate.active_reviews)
                },
                "decision_engine": {
                    "decision_rules": len(self.decision_engine.decision_rules),
                    "decision_history": len(self.decision_engine.decision_history)
                }
            },
            "decision_metrics": self.decision_metrics.copy(),
            "queue_status": {
                "pending_decisions": self.decision_queue.qsize(),
                "active_decisions": len(self.active_decisions)
            }
        }


# 工厂函数和便利接口
async def create_collaboration_decision_layer(config: Optional[Dict[str, Any]] = None) -> CollaborationDecisionLayer:
    """创建协作决策逻辑层实例"""
    return CollaborationDecisionLayer(config)


if __name__ == "__main__":
    # 示例用法和测试
    async def main():
        config = {
            "auto_approval_enabled": True,
            "review_timeout_hours": 24
        }

        layer = await create_collaboration_decision_layer(config)

        # 测试内容审批决策
        request = DecisionRequest(
            request_id="test_request_001",
            decision_type=DecisionType.CONTENT_APPROVAL,
            requester="content_creator",
            context={"content_type": "xiaohongshu_post", "urgency": "normal"},
            data={
                "content": {
                    "title": "AI工具深度评测",
                    "content": "这是一篇关于AI工具的详细评测内容...",
                    "quality_score": 0.85,
                    "risk_score": 0.2,
                    "brand_alignment": 0.9
                }
            },
            priority=2
        )

        result = await layer.process_decision_request(request)
        print("Decision Result:", json.dumps({
            "decision": result.decision,
            "confidence": result.confidence,
            "reasoning": result.reasoning,
            "quality_level": result.quality_level.value if result.quality_level else None,
            "collaboration_mode": result.metadata.get("collaboration_mode")
        }, indent=2, ensure_ascii=False))

        # 获取层状态
        status = await layer.get_layer_status()
        print("\nLayer Status:", json.dumps(status, indent=2, ensure_ascii=False))

    asyncio.run(main())