#!/usr/bin/env python3
"""
Agent OS System - Customer Intelligence Analysis Engine
Agent OS系统 - 客户智能分析引擎

核心功能：客户需求智能分析、市场机会识别、个性化推荐、价值评估
基于四层BMAD混合智能架构
Version: 1.0
Created: 2025-01-22
"""

import asyncio
import json
import logging
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple, Set
from dataclasses import dataclass, field
from enum import Enum
import uuid
import re
import math
from collections import defaultdict, Counter
import statistics

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CustomerSegment(Enum):
    """客户细分"""
    INDIVIDUAL = "individual"           # 个人用户
    SMALL_BUSINESS = "small_business"     # 小企业
    MEDIUM_ENTERPRISE = "medium_enterprise"  # 中型企业
    LARGE_ENTERPRISE = "large_enterprise"  # 大型企业
    GOVERNMENT = "government"             # 政府机构
    EDUCATIONAL = "educational"          # 教育机构
    NONPROFIT = "nonprofit"             # 非营利组织

class RequirementType(Enum):
    """需求类型"""
    CONTENT_CREATION = "content_creation"      # 内容创作
    DATA_ANALYTICS = "data_analytics"          # 数据分析
    CUSTOMER_SERVICE = "customer_service"      # 客户服务
    SYSTEM_INTEGRATION = "system_integration"  # 系统集成
    CONSULTING = "consulting"                # 咨询服务
    TRAINING = "training"                    # 培训服务
    AUTOMATION = "automation"                # 自动化服务

class MarketOpportunityType(Enum):
    """市场机会类型"""
    EMERGING_NEED = "emerging_need"         # 新兴需求
    EFFICIENCY_GAIN = "efficiency_gain"       # 效率提升
    COST_REDUCTION = "cost_reduction"         # 成本降低
    REVENUE_EXPANSION = "revenue_expansion"   # 收入扩展
    COMPETITIVE_ADVANTAGE = "competitive_advantage" # 竞争优势
    REGULATORY_COMPLIANCE = "regulatory_compliance" # 合规需求
    MARKET_EXPANSION = "market_expansion"     # 市场扩展

@dataclass
class CustomerProfile:
    """客户画像"""
    customer_id: str
    segment: CustomerSegment
    company_size: str
    industry: str
    location: str
    budget_range: Tuple[float, float]
    decision_makers: List[str]
    pain_points: List[str]
    current_solutions: List[str]
    digital_maturity: str  # low, medium, high
    growth_stage: str       # startup, growth, mature, declining
    created_at: datetime = field(default_factory=datetime.now)
    last_updated: datetime = field(default_factory=datetime.now)

@dataclass
class Requirement:
    """需求"""
    requirement_id: str
    customer_id: str
    requirement_type: RequirementType
    title: str
    description: str
    priority: str  # low, medium, high, critical
    urgency: str  # low, medium, high, critical
    budget: Optional[float] = None
    timeline: Optional[int] = None  # 天数
    success_criteria: List[str] = field(default_factory=list)
    constraints: List[str] = field(default_factory=list)
    stakeholders: List[str] = field(default_factory=list)

@dataclass
class MarketOpportunity:
    """市场机会"""
    opportunity_id: str
    opportunity_type: MarketOpportunityType
    title: str
    description: str
    target_segments: List[CustomerSegment]
    market_size: float  # 市场规模
    growth_rate: float  # 增长率
    competition_level: str  # low, medium, high
    investment_required: float
    expected_roi: float
    timeline: int  # 月数
    risk_factors: List[str] = field(default_factory=list)
    success_probability: float = 0.5
    created_at: datetime = field(default_factory=datetime.now)

@dataclass
class PersonalizedRecommendation:
    """个性化推荐"""
    recommendation_id: str
    customer_id: str
    recommendation_type: str
    title: str
    description: str
    products_services: List[Dict[str, Any]]
    value_proposition: str
    confidence: float
    expected_impact: str
    implementation_effort: str
    business_value: float
    created_at: datetime = field(default_factory=datetime.now)

class CustomerProfileManager:
    """客户画像管理器"""

    def __init__(self):
        self.customer_profiles: Dict[str, CustomerProfile] = {}
        self.segmentation_rules = self._initialize_segmentation_rules()
        self.industry_patterns = self._initialize_industry_patterns()

    def _initialize_segmentation_rules(self) -> Dict[str, Any]:
        """初始化细分规则"""
        return {
            "company_size_mapping": {
                "1-10": CustomerSegment.SMALL_BUSINESS,
                "11-50": CustomerSegment.SMALL_BUSINESS,
                "51-200": CustomerSegment.MEDIUM_ENTERPRISE,
                "201-1000": CustomerSegment.MEDIUM_ENTERPRISE,
                "1000+": CustomerSegment.LARGE_ENTERPRISE
            },
            "industry_b2b_focus": [
                "technology", "manufacturing", "finance", "healthcare",
                "retail", "education", "government", "logistics"
            ],
            "digital_maturity_indicators": {
                "website": lambda data: "professional" in data.get("website_type", ""),
                "social_media": lambda data: data.get("social_presence", False),
                "analytics": lambda data: data.get("uses_analytics", False),
                "automation": lambda data: data.get("has_automation", False)
            }
        }

    def _initialize_industry_patterns(self) -> Dict[str, Any]:
        """初始化行业模式"""
        return {
            "technology": {
                "common_pain_points": [" scalability", "integration", "security", "talent_shortage"],
                "typical_budget_range": (50000, 500000),
                "decision_makers": ["CTO", "VP Engineering", "CEO"],
                "digital_maturity": "high"
            },
            "retail": {
                "common_pain_points": ["inventory_management", "customer_experience", "competition", "supply_chain"],
                "typical_budget_range": (10000, 100000),
                "decision_makers": ["CEO", "VP Marketing", "Operations Manager"],
                "digital_maturity": "medium"
            },
            "healthcare": {
                "common_pain_points": ["patient_experience", "regulatory_compliance", "data_security", "cost_management"],
                "typical_budget_range": (100000, 1000000),
                "decision_makers": ["CMO", "Medical Director", "IT Director"],
                "digital_maturity": "medium"
            },
            "finance": {
                "common_pain_points": ["risk_management", "compliance", "automation", "data_analytics"],
                "typical_budget_range": (200000, 2000000),
                "decision_makers": ["CFO", "Risk Manager", "Compliance Officer"],
                "digital_maturity": "high"
            }
        }

    def create_profile(self, customer_id: str, profile_data: Dict[str, Any]) -> CustomerProfile:
        """创建客户画像"""
        # 确定客户细分
        segment = self._determine_segment(profile_data)

        # 估算数字成熟度
        digital_maturity = self._assess_digital_maturity(profile_data)

        profile = CustomerProfile(
            customer_id=customer_id,
            segment=segment,
            company_size=profile_data.get("company_size", "unknown"),
            industry=profile_data.get("industry", "unknown"),
            location=profile_data.get("location", "unknown"),
            budget_range=self._extract_budget_range(profile_data),
            decision_makers=profile_data.get("decision_makers", []),
            pain_points=profile_data.get("pain_points", []),
            current_solutions=profile_data.get("current_solutions", []),
            digital_maturity=digital_maturity,
            growth_stage=profile_data.get("growth_stage", "unknown")
        )

        self.customer_profiles[customer_id] = profile
        logger.info(f"Created profile for customer: {customer_id}")
        return profile

    def _determine_segment(self, profile_data: Dict[str, Any]) -> CustomerSegment:
        """确定客户细分"""
        company_size = profile_data.get("company_size", "unknown")

        # 基于公司规模确定细分
        if company_size in self.segmentation_rules["company_size_mapping"]:
            return self.segmentation_rules["company_size_mapping"][company_size]

        # 基于业务类型判断
        business_type = profile_data.get("business_type", "").lower()
        if "individual" in business_type or "freelancer" in business_type:
            return CustomerSegment.INDIVIDUAL
        elif "nonprofit" in business_type or "ngo" in business_type:
            return CustomerSegment.NONPROFIT
        elif "government" in business_type or "public" in business_type:
            return CustomerSegment.GOVERNMENT
        elif "education" in business_type or "school" in business_type:
            return CustomerSegment.EDUCATIONAL
        else:
            return CustomerSegment.SMALL_BUSINESS  # 默认

    def _assess_digital_maturity(self, profile_data: Dict[str, Any]) -> str:
        """评估数字成熟度"""
        indicators = self.segmentation_rules["digital_maturity_indicators"]
        scores = []

        for indicator, check_func in indicators.items():
            if indicator in profile_data:
                try:
                    score = check_func(profile_data[indicator])
                    scores.append(1 if score else 0)
                except:
                    scores.append(0)

        if len(scores) == 0:
            return "low"

        avg_score = sum(scores) / len(scores)
        if avg_score >= 0.75:
            return "high"
        elif avg_score >= 0.4:
            return "medium"
        else:
            return "low"

    def _extract_budget_range(self, profile_data: Dict[str, Any]) -> Tuple[float, float]:
        """提取预算范围"""
        budget_info = profile_data.get("budget", {})

        if isinstance(budget_info, dict):
            min_budget = budget_info.get("min", 0)
            max_budget = budget_info.get("max", 0)
        elif isinstance(budget_info, (int, float)):
            min_budget = max(0, budget_info * 0.8)
            max_budget = budget_info * 1.2
        else:
            # 基于行业默认值
            industry = profile_data.get("industry", "unknown")
            if industry in self.industry_patterns:
                return self.industry_patterns[industry]["typical_budget_range"]
            else:
                return (50000, 200000)

        return (min_budget, max_budget)

    def update_profile(self, customer_id: str, update_data: Dict[str, Any]):
        """更新客户画像"""
        if customer_id not in self.customer_profiles:
            logger.warning(f"Profile not found for customer: {customer_id}")
            return

        profile = self.customer_profiles[customer_id]

        # 更新字段
        for key, value in update_data.items():
            if hasattr(profile, key):
                setattr(profile, key, value)

        profile.last_updated = datetime.now()
        logger.info(f"Updated profile for customer: {customer_id}")

    def get_profile(self, customer_id: str) -> Optional[CustomerProfile]:
        """获取客户画像"""
        return self.customer_profiles.get(customer_id)

    def find_similar_customers(self, customer_id: str, limit: int = 10) -> List[CustomerProfile]:
        """找到相似客户"""
        if customer_id not in self.customer_profiles:
            return []

        target_profile = self.customer_profiles[customer_id]
        similarities = []

        for other_id, other_profile in self.customer_profiles.items():
            if other_id == customer_id:
                continue

            similarity_score = self._calculate_profile_similarity(target_profile, other_profile)
            similarities.append((other_profile, similarity_score))

        # 按相似度排序
        similarities.sort(key=lambda x: x[1], reverse=True)
        return [profile for profile, _ in similarities[:limit]]

    def _calculate_profile_similarity(self, profile1: CustomerProfile, profile2: CustomerProfile) -> float:
        """计算画像相似度"""
        similarity_score = 0

        # 行业相似度
        if profile1.industry == profile2.industry:
            similarity_score += 0.3

        # 细分相似度
        if profile1.segment == profile2.segment:
            similarity_score += 0.3

        # 规模相似度
        size_similarity = 1.0 - abs(float(profile1.company_size) - float(profile2.company_size)) / max(float(profile1.company_size), float(profile2.company_size))
        similarity_score += size_similarity * 0.2

        # 数字成熟度相似度
        maturity_scores = {"low": 0.33, "medium": 0.66, "high": 1.0}
        maturity1 = maturity_scores.get(profile1.digital_maturity, 0.5)
        maturity2 = maturity_scores.get(profile2.digital_maturity, 0.5)
        maturity_similarity = 1.0 - abs(maturity1 - maturity2)
        similarity_score += maturity_similarity * 0.2

        return similarity_score

class RequirementAnalyzer:
    """需求分析器"""

    def __init__(self):
        self.requirement_patterns = {
            RequirementType.CONTENT_CREATION: {
                "keywords": ["content", "creative", "writing", "design", "production", "media"],
                "complexity_indicators": ["scope", "timeline", "deliverables", "quality"],
                "success_metrics": ["engagement", "reach", "conversion", "satisfaction"]
            },
            RequirementType.DATA_ANALYTICS: {
                "keywords": ["analytics", "insights", "data", "reports", "dashboards", "metrics"],
                "complexity_indicators": ["sources", "integration", "accuracy", "visualization"],
                "success_metrics": ["actionable_insights", "data_quality", "reporting_frequency"]
            },
            RequirementType.CUSTOMER_SERVICE: {
                "keywords": ["support", "service", "help", "assistance", "response", "satisfaction"],
                "complexity_indicators": ["channels", "response_time", "resolution", "escalation"],
                "success_metrics": ["response_time", "resolution_rate", "customer_satisfaction"]
            },
            RequirementType.SYSTEM_INTEGRATION: {
                "keywords": ["integration", "api", "connection", "system", "platform", "workflow"],
                "complexity_indicators": ["interfaces", "data_flow", "security", "compatibility"],
                "success_metrics": ["integration_success", "data_flow", "system_stability"]
            },
            RequirementType.CONSULTING: {
                "keywords": ["consulting", "advisory", "strategy", "planning", "expertise", "guidance"],
                "complexity_indicators": ["scope", "methodology", "deliverables", "timeline"],
                "success_metrics": ["recommendation_quality", "implementation_success", "client_satisfaction"]
            },
            RequirementType.TRAINING: {
                "keywords": ["training", "education", "learning", "skill", "development", "certification"],
                "complexity_indicators": ["curriculum", "delivery", "assessment", "outcomes"],
                "success_metrics": ["skill_improvement", "certification_rate", "participant_satisfaction"]
            },
            RequirementType.AUTOMATION: {
                "keywords": ["automation", "efficiency", "process", "workflow", "optimization", "productivity"],
                "complexity_indicators": ["processes", "tools", "integration", "maintenance"],
                "success_metrics": ["efficiency_gain", "cost_savings", "error_reduction"]
            }
        }

    def analyze_requirement(self, customer_id: str, requirement_text: str,
                           context: Dict[str, Any] = None) -> Requirement:
        """分析需求"""
        requirement_id = str(uuid.uuid4())

        # 识别需求类型
        req_type = self._classify_requirement(requirement_text)

        # 分析需求内容
        analysis_result = self._extract_requirement_details(requirement_text)

        # 确定优先级和紧急程度
        priority, urgency = self._assess_priority_urgency(requirement_text, context)

        # 估算预算和时间线
        estimated_budget, estimated_timeline = self._estimate_budget_timeline(
            req_type, requirement_text, context
        )

        requirement = Requirement(
            requirement_id=requirement_id,
            customer_id=customer_id,
            requirement_type=req_type,
            title=analysis_result.get("title", ""),
            description=requirement_text,
            priority=priority,
            urgency=urgency,
            budget=estimated_budget,
            timeline=estimated_timeline,
            success_criteria=analysis_result.get("success_criteria", []),
            constraints=analysis_result.get("constraints", []),
            stakeholders=analysis_result.get("stakeholders", [])
        )

        return requirement

    def _classify_requirement(self, requirement_text: str) -> RequirementType:
        """分类需求类型"""
        text_lower = requirement_text.lower()
        scores = {}

        for req_type, pattern in self.requirement_patterns.items():
            score = sum(1 for keyword in pattern["keywords"] if keyword in text_lower)
            scores[req_type] = score

        if scores:
            return max(scores, key=scores.get)

        return RequirementType.CONSULTING  # 默认类型

    def _extract_requirement_details(self, requirement_text: str) -> Dict[str, Any]:
        """提取需求详情"""
        details = {}

        # 提取标题（前50个字符作为标题）
        details["title"] = requirement_text[:50] + ("..." if len(requirement_text) > 50 else "")

        # 提取成功标准
        success_indicators = ["success", "achieve", "goal", "target", "kpi", "metric", "outcome"]
        success_criteria = []
        for indicator in success_indicators:
            if indicator in requirement_text.lower():
                # 简化的成功标准提取
                sentences = requirement_text.split('.')
                for sentence in sentences:
                    if indicator in sentence.lower():
                        success_criteria.append(sentence.strip())
        details["success_criteria"] = success_criteria

        # 提取约束条件
        constraint_indicators = ["constraint", "limitation", "restriction", "must", "should", "within", "budget", "timeline"]
        constraints = []
        for indicator in constraint_indicators:
            if indicator in requirement_text.lower():
                sentences = requirement_text.split('.')
                for sentence in sentences:
                    if indicator in sentence.lower():
                        constraints.append(sentence.strip())
        details["constraints"] = constraints

        # 提取利益相关者
        stakeholder_indicators = ["stakeholder", "team", "department", "user", "customer", "client"]
        stakeholders = []
        for indicator in stakeholder_indicators:
            if indicator in requirement_text.lower():
                # 简化的利益相关者提取
                words = requirement_text.split()
                for i, word in enumerate(words):
                    if indicator in word.lower():
                        if i + 1 < len(words):
                            stakeholders.append(words[i + 1])
        details["stakeholders"] = list(set(stakeholders))

        return details

    def _assess_priority_urgency(self, requirement_text: str, context: Dict[str, Any] = None) -> Tuple[str, str]:
        """评估优先级和紧急程度"""
        # 优先级关键词
        high_priority_words = ["critical", "urgent", "important", "priority", "essential", "strategic"]
        medium_priority_words = ["significant", "valuable", "beneficial", "useful"]
        low_priority_words = ["nice", "optional", "future", "consider", "enhancement"]

        text_lower = requirement_text.lower()

        if any(word in text_lower for word in high_priority_words):
            priority = "high"
        elif any(word in text_lower for word in medium_priority_words):
            priority = "medium"
        else:
            priority = "low"

        # 紧急程度关键词
        high_urgency_words = ["asap", "immediately", "urgent", "emergency", "critical", "deadline", "overdue"]
        medium_urgency_words = ["soon", "this week", "next", "upcoming", "planned"]

        if any(word in text_lower for word in high_urgency_words):
            urgency = "high"
        elif any(word in text_lower for word in medium_urgency_words):
            urgency = "medium"
        else:
            urgency = "low"

        return priority, urgency

    def _estimate_budget_timeline(self, req_type: RequirementType, requirement_text: str,
                               context: Dict[str, Any] = None) -> Tuple[Optional[float], Optional[int]]:
        """估算预算和时间线"""
        # 基于需求类型的基准值
        baselines = {
            RequirementType.CONTENT_CREATION: {"budget": (5000, 50000), "timeline": 7},
            RequirementType.DATA_ANALYTICS: {"budget": (10000, 100000), "timeline": 14},
            RequirementType.CUSTOMER_SERVICE: {"budget": (2000, 20000), "timeline": 5},
            RequirementType.SYSTEM_INTEGRATION: {"budget": (20000, 200000), "timeline": 30},
            RequirementType.CONSULTING: {"budget": (10000, 100000), "timeline": 21},
            RequirementType.TRAINING: {"budget": (5000, 50000), "timeline": 14},
            RequirementType.AUTOMATION: {"budget": (15000, 150000), "timeline": 45}
        }

        baseline = baselines.get(req_type, {"budget": (10000, 50000), "timeline": 14})

        # 从文本中提取数字信息
        budget_estimate = self._extract_financial_info(requirement_text)
        timeline_estimate = self._extract_timeline_info(requirement_text)

        # 如果从文本中提取到信息，使用实际值；否则使用基准值
        if budget_estimate:
            estimated_budget = budget_estimate
        else:
            estimated_budget = (baseline["budget"][0] + baseline["budget"][1]) / 2

        if timeline_estimate:
            estimated_timeline = timeline_estimate
        else:
            estimated_timeline = baseline["timeline"]

        return estimated_budget, estimated_timeline

    def _extract_financial_info(self, text: str) -> Optional[float]:
        """提取财务信息"""
        # 匹配金额模式
        money_patterns = [
            r'\$(\d+(?:\.\d+)?[kmb]?)',  # $100k, $2.5M
            r'(\d+(?:\d+)?)\s*(?:USD|dollars?)',  # 1000 USD
            r'budget[:\s]*(\d+(?:\.\d+)?)',  # budget: 50000
            r'(\d+(?:\.\d+)?)\s*k',  # 50k
            r'(\d+(?:\d+)?)\s*m',  # 2M
        ]

        for pattern in money_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                try:
                    # 处理金额单位
                    amount_str = matches[0]
                    amount_str = amount_str.replace('$', '').replace('USD', '').replace('dollars', '')

                    if 'k' in amount_str:
                        amount = float(amount_str.replace('k', '')) * 1000
                    elif 'm' in amount_str:
                        amount = float(amount_str.replace('m', '')) * 1000000
                    else:
                        amount = float(amount_str)

                    return amount
                except ValueError:
                    continue

        return None

    def _extract_timeline_info(self, text: str) -> Optional[int]:
        """提取时间信息"""
        time_patterns = [
            r'(\d+)\s*days?',
            r'(\d+)\s*weeks?',
            r'(\d+)\s*months?',
            r'(\d+)\s*years?'
        ]

        for pattern in time_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                try:
                    unit = pattern.split('\\')[1].replace('?', '')
                    if 'day' in unit:
                        return int(matches[0])
                    elif 'week' in unit:
                        return int(matches[0]) * 7
                    elif 'month' in unit:
                        return int(matches[0]) * 30
                    elif 'year' in unit:
                        return int(matches[0]) * 365
                except ValueError:
                    continue

        return None

class MarketOpportunityIdentifier:
    """市场机会识别器"""

    def __init__(self):
        self.market_trends = self._initialize_market_trends()
        self.opportunity_templates = self._initialize_opportunity_templates()
        self.success_patterns = self._initialize_success_patterns()

    def _initialize_market_trends(self) -> Dict[str, Any]:
        """初始化市场趋势"""
        return {
            "ai_automation": {
                "growth_rate": 0.35,
                "market_size": 50000000000,
                "key_drivers": ["efficiency", "cost_reduction", "skill_shortage"],
                "emerging_needs": ["generative_ai", "autonomous_agents", "intelligent_automation"]
            },
            "digital_transformation": {
                "growth_rate": 0.15,
                "market_size": 100000000000,
                "key_drivers": ["customer_experience", "operational_efficiency", "competitive_advantage"],
                "emerging_needs": ["cloud_migration", "data_analytics", "customer_journey"]
            },
            "sustainability": {
                "growth_rate": 0.25,
                "market_size": 30000000000,
                "target_segments": [CustomerSegment.MEDIUM_ENTERPRISE, CustomerSegment.LARGE_ENTERPRISE],
                "key_drivers": ["regulatory_compliance", "cost_savings", "brand_reputation"],
                "emerging_needs": ["carbon_tracking", "esg_reporting", "sustainable_supply_chain"]
            },
            "remote_work": {
                "growth_rate": 0.20,
                "market_size": 80000000000,
                "key_drivers": ["talent_access", "cost_reduction", "flexibility"],
                "emerging_needs": ["collaboration_tools", "security", "productivity_monitoring"]
            }
        }

    def _initialize_opportunity_templates(self) -> Dict[str, Dict[str, Any]]:
        """初始化机会模板"""
        return {
            "efficiency_improvement": {
                "investment_multiplier": 0.5,
                "success_factors": ["clear_roi", "measurable_outcomes", "executive_support"],
                "risk_factors": ["change_resistance", "integration_complexity"]
            },
            "revenue_generation": {
                "investment_multiplier": 1.0,
                "success_factors": ["market_demand", "competitive_differentiation", "scalability"],
                "risk_factors": ["market_risk", "execution_risk", "time_to_market"]
            },
            "cost_reduction": {
                "investment_multiplier": 0.3,
                "success_factors": ["clear_savings", "automation_potential", "process_standardization"],
                "risk_factors": ["disruption_risk", "quality_impact"]
            }
        }

    def _initialize_success_patterns(self) -> Dict[str, Any]:
        """初始化成功模式"""
        return {
            "early_adopters": {
                "success_rate": 0.75,
                "risk_tolerance": "high",
                "typical_timeline": 12,
                "key_factors": ["innovation", "speed", "vision"]
            },
            "fast_followers": {
                "success_rate": 0.65,
                "risk_tolerance": "medium",
                "typical_timeline": 6,
                "key_factors": ["learning", "adaptation", "execution"]
            },
            "majority_players": {
                "success_rate": 0.85,
                "risk_tolerance": "low",
                "typical_timeline": 3,
                "key_factors": ["resources", "market_share", "brand_recognition"]
            }
        }

    def identify_opportunities(self, customer_profiles: List[CustomerProfile],
                                market_data: Dict[str, Any] = None) -> List[MarketOpportunity]:
        """识别市场机会"""
        opportunities = []

        # 分析客户群体的共同需求和痛点
        common_pain_points = self._analyze_common_pain_points(customer_profiles)
        emerging_trends = self._identify_emerging_trends(customer_profiles, market_data)

        # 基于趋势和痛点生成机会
        for trend in emerging_trends:
            for pain_point in common_pain_points:
                opportunity = self._create_opportunity_from_trend_pain_point(trend, pain_point)
                if opportunity:
                    opportunities.append(opportunity)

        # 基于细分市场机会
        for trend in self.market_trends.values():
            if trend["growth_rate"] > 0.2:  # 高增长趋势
                opportunity = self._create_trend_opportunity(trend)
                if opportunity:
                    opportunities.append(opportunity)

        # 评估和排序机会
        scored_opportunities = []
        for opp in opportunities:
            score = self._calculate_opportunity_score(opp, customer_profiles)
            scored_opportunities.append((opp, score))

        scored_opportunities.sort(key=lambda x: x[1], reverse=True)
        return [opp for opp, _ in scored_opportunities]

    def _analyze_common_pain_points(self, customer_profiles: List[CustomerProfile]) -> List[str]:
        """分析共同痛点"""
        pain_point_counts = defaultdict(int)

        for profile in customer_profiles:
            for pain_point in profile.pain_points:
                pain_point_counts[pain_point] += 1

        # 返回出现频率最高的痛点
        sorted_pain_points = sorted(pain_point_counts.items(), key=lambda x: x[1], reverse=True)
        return [pain_point for pain_point, _ in sorted_pain_points[:10]]

    def _identify_emerging_trends(self, customer_profiles: List[CustomerProfiles],
                                market_data: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """识别新兴趋势"""
        trends = []

        # 基于客户画像识别趋势
        digital_maturity_levels = [p.digital_maturity for p in customer_profiles]
        high_maturity_rate = sum(1 for level in digital_maturity_levels if level == "high") / len(digital_maturity_levels)

        if high_maturity_rate > 0.6:
            trends.append({
                "trend": "Advanced_Digital_Adoption",
                "growth_rate": 0.25,
                "market_potential": "high",
                "customer_segments": [CustomerSegment.MEDIUM_ENTERPRISE, CustomerSegment.LARGE_ENTERPRISE]
            })

        return trends

    def _create_opportunity_from_trend_pain_point(self, trend: Dict[str, Any], pain_point: str) -> Optional[MarketOpportunity]:
        """从趋势和痛点创建机会"""
        # 查找最匹配的机会类型
        opportunity_type = self._match_opportunity_type(trend, pain_point)

        if not opportunity_type:
            return None

        opportunity = MarketOpportunity(
            opportunity_id=str(uuid.uuid4()),
            opportunity_type=opportunity_type,
            title=f"{pain_point}解决方案",
            description=f"基于{trend.get('trend_name', 'trend')}趋势，解决{pain_point}问题",
            target_segments=trend.get("target_segments", [CustomerSegment.MEDIUM_ENTERPRISE]),
            market_size=trend.get("market_size", 10000000),
            growth_rate=trend.get("growth_rate", 0.1),
            competition_level="medium",
            investment_required=50000,  # 默认投资额
            expected_roi=0.3,  # 默认ROI
            timeline=90,  # 默认时间线
            risk_factors=["market_risk", "execution_risk"],
            success_probability=0.6
        )

        return opportunity

    def _create_trend_opportunity(self, trend: Dict[str, Any]) -> Optional[MarketOpportunity]:
        """创建趋势机会"""
        trend_name = trend.get("trend_name", "Unknown Trend")

        # 根据趋势特点确定机会类型
        if "efficiency" in trend_name.lower() or "automation" in trend_name.lower():
            opportunity_type = MarketOpportunityType.EFFICIENCY_GAIN
        elif "revenue" in trend_name.lower() or "growth" in trend_name.lower():
            opportunity_type = MarketOpportunityType.REVENUE_EXPANSION
        elif "cost" in trend_name.lower() or "sustainability" in trend_name.lower():
            opportunity_type = MarketOpportunityType.COST_REDUCTION
        else:
            opportunity_type = MarketOpportunityType.EMERGING_NEED

        opportunity = MarketOpportunity(
            opportunity_id=str(uuid.uuid4()),
            opportunity_type=opportunity_type,
            title=f"{trend_name}市场机会",
            description=f"把握{trend_name}趋势带来的市场机会",
            target_segments=trend.get("target_segments", [CustomerSegment.SMALL_BUSINESS]),
            market_size=trend.get("market_size", 5000000),
            growth_rate=trend.get("growth_rate", 0.15),
            competition_level="medium",
            investment_required=30000,
            expected_roi=0.25,
            timeline=60,
            risk_factors=["adoption_risk", "technology_risk"],
            success_probability=0.7
        )

        return opportunity

    def _match_opportunity_type(self, trend: Dict[str, Any], pain_point: str) -> Optional[MarketOpportunityType]:
        """匹配机会类型"""
        trend_name = trend.get("trend_name", "").lower()
        pain_point_lower = pain_point.lower()

        if any(keyword in pain_point_lower for keyword in ["cost", "expense", "budget"]):
            return MarketOpportunityType.COST_REDUCTION
        elif any(keyword in pain_point_lower for keyword in ["revenue", "sales", "growth"]):
            return MarketOpportunityType.REVENUE_EXPANSION
        elif any(keyword in pain_point_lower for keyword in ["efficiency", "productivity", "automation"]):
            return MarketOpportunityType.EFFICIENCY_GAIN
        else:
            return MarketOpportunityType.EMERGING_NEED

    def _calculate_opportunity_score(self, opportunity: MarketOpportunity,
                                   customer_profiles: List[CustomerProfile]) -> float:
        """计算机会评分"""
        score = 0

        # 市场规模评分 (30%)
        market_score = min(opportunity.market_size / 100000000, 1.0)
        score += market_score * 0.3

        # 增长率评分 (25%)
        growth_score = min(opportunity.growth_rate / 0.5, 1.0)
        score += growth_score * 0.25

        # 投资回报率评分 (20%)
        roi_score = min(opportunity.expected_roi / 1.0, 1.0)
        score += roi_score * 0.2

        # 成功概率评分 (15%)
        score += opportunity.success_probability * 0.15

        # 竞争程度评分 (10%)
        competition_scores = {"low": 1.0, "medium": 0.7, "high": 0.4}
        competition_score = competition_scores.get(opportunity.competition_level, 0.5)
        score += competition_score * 0.1

        return score

class PersonalizationEngine:
    """个性化推荐引擎"""

    def __init__(self):
        self.recommendation_rules = {
            "content_similarity": self._content_similarity_rule,
            "behavior_based": self._behavior_based_rule,
            "collaborative_filtering": self._collaborative_filtering_rule,
            "market_trend_based": self._market_trend_based_rule
        }

    def generate_recommendations(self, customer_id: str, customer_profile: CustomerProfile,
                                  requirements: List[Requirement],
                                  opportunities: List[MarketOpportunity]) -> List[PersonalizedRecommendation]:
        """生成个性化推荐"""
        recommendations = []

        # 基于需求生成推荐
        for requirement in requirements:
            rec = self._recommendation_from_requirement(customer_id, customer_profile, requirement)
            if rec:
                recommendations.append(rec)

        # 基于机会生成推荐
        for opportunity in opportunities:
            rec = self._recommendation_from_opportunity(customer_id, customer_profile, opportunity)
            if rec:
                recommendations.append(rec)

        # 基于相似客户生成推荐
        similar_customers = self._find_similar_customers(customer_id)
        if similar_customers:
            rec = self._recommendation_from_similar_customers(customer_id, customer_profile, similar_customers)
            if rec:
                recommendations.extend(rec)

        # 去重并按置信度排序
        unique_recommendations = self._deduplicate_recommendations(recommendations)
        unique_recommendations.sort(key=lambda x: x.confidence, reverse=True)

        return unique_recommendations[:10]  # 返回前10个推荐

    def _recommendation_from_requirement(self, customer_id: str, customer_profile: CustomerProfile,
                                          requirement: Requirement) -> Optional[PersonalizedRecommendation]:
        """基于需求生成推荐"""
        req_type = requirement.requirement_type

        if req_type == RequirementType.CONTENT_CREATION:
            recommendation = PersonalizedRecommendation(
                recommendation_id=str(uuid.uuid4()),
                customer_id=customer_id,
                recommendation_type="content_solution",
                title=f"AI内容创作解决方案",
                description=f"满足{requirement.title}的AI驱动内容创作服务",
                products_services=[
                    {
                        "name": "AI内容生成平台",
                        "type": "SaaS",
                        "features": ["智能写作", "多格式支持", "SEO优化", "社交媒体发布"],
                        "estimated_cost": 5000
                    }
                ],
                value_proposition=f"通过AI技术提高内容创作效率和质量",
                confidence=0.8,
                expected_impact="内容产出提升60%",
                implementation_effort="2-4周",
                business_value=30000
            )
            return recommendation

        elif req_type == RequirementType.DATA_ANALYTICS:
            recommendation = PersonalizedRecommendation(
                recommendation_id=str(uuid.uuid4()),
                customer_id=customer_id,
                recommendation_type="analytics_solution",
                title="智能数据分析平台",
                description="满足数据洞察需求的分析解决方案",
                products_services=[
                    {
                        "name": "实时分析仪表板",
                        "type": "Platform",
                        "features": ["数据可视化", "实时监控", "预测分析", "报告生成"],
                        "estimated_cost": 8000
                    }
                ],
                value_proposition="提供数据驱动的决策支持",
                confidence=0.85,
                expected_impact="决策效率提升40%",
                implementation_effort="3-6周",
                business_value=50000
            )
            return recommendation

        return None

    def _recommendation_from_opportunity(self, customer_id: str, customer_profile: CustomerProfile,
                                          opportunity: MarketOpportunity) -> Optional[PersonalizedRecommendation]:
        """基于机会生成推荐"""
        if opportunity.opportunity_type == MarketOpportunityType.EFFICIENCY_GAIN:
            recommendation = PersonalizedRecommendation(
                recommendation_id=str(uuid.uuid4()),
                customer_id=customer_id,
                recommendation_type="efficiency_solution",
                title=f"效率提升解决方案",
                description=f"基于{opportunity.title}的效率改进方案",
                products_services=[
                    {
                        "name": "流程自动化平台",
                        "type": "Platform",
                        "features": ["工作流自动化", "任务分配", "进度跟踪", "报告分析"],
                        "estimated_cost": opportunity.investment_required
                    }
                ],
                value_proposition=f"通过{opportunity.expected_roi:.1%}的ROI提升运营效率",
                confidence=opportunity.success_probability,
                expected_impact="效率显著提升",
                implementation_effort=f"{opportunity.timeline}天",
                business_value=opportunity.investment_required * opportunity.expected_roi
            )
            return recommendation

        return None

    def _recommendation_from_similar_customers(self, customer_id: str, customer_profile: CustomerProfile,
                                              similar_customers: List[CustomerProfile]) -> List[PersonalizedRecommendation]:
        """基于相似客户生成推荐"""
        recommendations = []

        # 分析相似客户的成功模式
        successful_patterns = self._analyze_successful_patterns(similar_customers)

        for pattern in successful_patterns:
            recommendation = PersonalizedRecommendation(
                recommendation_id=str(uuid.uuid4()),
                customer_id=customer_id,
                recommendation_type="peer_recommended",
                title=f"同行推荐: {pattern['solution_type']}",
                description=f"基于{len(similar_customers)}个相似客户的成功经验",
                products_services=[pattern["solution"]],
                value_proposition=f"经过验证的解决方案，成功率{pattern['success_rate']:.1%}",
                confidence=0.7,
                expected_impact="减少实施风险",
                implementation_effort="中等",
                business_value=pattern["average_value"]
            )
            recommendations.append(recommendation)

        return recommendations

    def _content_similarity_rule(self, customer_profile: CustomerProfile,
                                    candidate: Any) -> float:
        """内容相似度规则"""
        # 简化实现
        return 0.7

    def _behavior_based_rule(self, customer_profile: CustomerProfile,
                                 candidate: Any) -> float:
        """行为模式规则"""
        # 简化实现
        return 0.8

    def _collaborative_filtering_rule(self, customer_profile: CustomerProfile,
                                         candidate: Any) -> float:
        """协同过滤规则"""
        # 简化实现
        return 0.6

    def _market_trend_based_rule(self, customer_profile: CustomerProfile,
                                     candidate: Any) -> float:
        """市场趋势规则"""
        # 简化实现
        return 0.75

    def _deduplicate_recommendations(self, recommendations: List[PersonalizedRecommendation]) -> List[PersonalizedRecommendation]:
        """去重推荐"""
        seen = set()
        unique_recommendations = []

        for rec in recommendations:
            rec_key = f"{rec.recommendation_type}_{rec.title}_{rec.value_proposition}"
            if rec_key not in seen:
                seen.add(rec_key)
                unique_recommendations.append(rec)

        return unique_recommendations

    def _analyze_successful_patterns(self, customer_profiles: List[CustomerProfile]) -> List[Dict[str, Any]]:
        """分析成功模式"""
        patterns = []

        # 简化的成功模式分析
        content_creation_success = {
            "solution_type": "AI内容平台",
            "success_rate": 0.85,
            "average_value": 25000,
            "typical_timeline": 21
        }

        data_analytics_success = {
            "solution_type": "分析仪表板",
            "success_rate": 0.80,
            "average_value": 40000,
            "typical_timeline": 28
        }

        automation_success = {
            "solution_type": "自动化工具",
            "success_rate": 0.75,
            "average_value": 35000,
            "typical_timeline": 35
        }

        patterns = [content_creation_success, data_analytics_success, automation_success]

        return patterns

class CustomerIntelligenceEngine:
    """客户智能分析引擎主控制器"""

    def __init__(self):
        self.profile_manager = CustomerProfileManager()
        self.requirement_analyzer = RequirementAnalyzer()
        self.opportunity_identifier = MarketOpportunityIdentifier()
        self.personalization_engine = PersonalizationEngine()

        # 数据存储
        self.customer_profiles: Dict[str, CustomerProfile] = {}
        self.requirements: Dict[str, List[Requirement]] = defaultdict(list)
        self.opportunities: List[MarketOpportunity] = []

    async def analyze_customer(self, customer_id: str, profile_data: Dict[str, Any]) -> CustomerProfile:
        """分析客户"""
        profile = self.profile_manager.create_profile(customer_id, profile_data)
        self.customer_profiles[customer_id] = profile
        return profile

    async def process_requirement(self, customer_id: str, requirement_text: str,
                                   context: Dict[str, Any] = None) -> Requirement:
        """处理需求"""
        requirement = self.requirement_analyzer.analyze_requirement(customer_id, requirement_text, context)
        self.requirements[customer_id].append(requirement)
        return requirement

    async def generate_recommendations(self, customer_id: str) -> List[PersonalizedRecommendation]:
        """生成推荐"""
        profile = self.profile_manager.get_profile(customer_id)
        if not profile:
            return []

        requirements = self.requirements.get(customer_id, [])
        return self.personalization_engine.generate_recommendations(
            customer_id, profile, requirements, self.opportunities
        )

    async def update_market_intelligence(self):
        """更新市场智能"""
        # 识别市场机会
        profile_list = list(self.customer_profiles.values())
        self.opportunities = self.opportunity_identifier.identify_opportunities(profile_list)

        logger.info(f"Identified {len(self.opportunities)} market opportunities")

    async def get_customer_intelligence_summary(self, customer_id: str) -> Dict[str, Any]:
        """获取客户智能分析摘要"""
        profile = self.profile_manager.get_profile(customer_id)
        if not profile:
            return {"error": "Customer profile not found"}

        requirements = self.requirements.get(customer_id, [])
        recommendations = await self.generate_recommendations(customer_id)

        return {
            "customer_profile": {
                "segment": profile.segment.value,
                "digital_maturity": profile.digital_maturity,
                "company_size": profile.company_size,
                "industry": profile.industry,
                "budget_range": profile.budget_range,
                "pain_points_count": len(profile.pain_points),
                "last_updated": profile.last_updated.isoformat()
            },
            "requirements_summary": {
                "total_requirements": len(requirements),
                "by_type": Counter([req.requirement_type.value for req in requirements]),
                "high_priority_count": len([req for req in requirements if req.priority == "high"]),
                "urgent_count": len([req for req in requirements if req.urgency == "high"])
            },
            "opportunities_count": len(self.opportunities),
            "recommendations": {
                "total_recommendations": len(recommendations),
                "high_confidence_count": len([rec for rec in recommendations if rec.confidence > 0.7]),
                "estimated_total_value": sum(rec.business_value for rec in recommendations)
            },
            "similar_customers_count": len(self.profile_manager.find_similar_customers(customer_id))
        }

    async def get_system_status(self) -> Dict[str, Any]:
        """获取系统状态"""
        return {
            "total_customers": len(self.customer_profiles),
            "total_requirements": sum(len(reqs) for reqs in self.requirements.values()),
            "identified_opportunities": len(self.opportunities),
            "active_profiles": len([p for p in self.customer_profiles.values() if
                                     (datetime.now() - p.last_updated).days < 30]),
            "market_trends": list(self.opportunity_identifier.market_trends.keys()),
            "recent_analyses": 0  # 可以添加实际的分析统计
        }

# 使用示例
async def main():
    """主函数示例"""
    engine = CustomerIntelligenceEngine()

    # 模拟客户分析
    customer_data = {
        "company_size": "50-200",
        "industry": "technology",
        "location": "Beijing",
        "business_type": "software",
        "pain_points": ["data_sil", "report_generation", "automation_needs"],
        "digital_maturity": "medium",
        "growth_stage": "growth"
    }

    profile = await engine.analyze_customer("customer_001", customer_data)
    print(f"Created customer profile: {profile.segment.value}")

    # 模拟需求处理
    requirement = await engine.process_requirement(
        "customer_001",
        "我们需要一个AI内容创作系统来提高我们的营销效率",
        context={"urgency": "high", "budget": 50000}
    )
    print(f"Processed requirement: {requirement.requirement_type.value}")

    # 更新市场智能
    await engine.update_market_intelligence()

    # 生成推荐
    recommendations = await engine.generate_recommendations("customer_001")
    print(f"Generated {len(recommendations)} recommendations")

    # 获取分析摘要
    summary = await engine.get_customer_intelligence_summary("customer_001")
    print("Customer Intelligence Summary:")
    print(json.dumps(summary, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    asyncio.run(main())