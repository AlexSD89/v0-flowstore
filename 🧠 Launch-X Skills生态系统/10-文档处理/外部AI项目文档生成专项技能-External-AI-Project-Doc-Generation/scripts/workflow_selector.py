#!/usr/bin/env python3
"""
智能工作流选择器 (Workflow Selector) - 根据用户输入自动选择最优工作流
基于项目特征、用户意图和系统状态智能决策最适合的分析工作流

Author: LaunchX Claude Team
Version: 1.0.0
Created: 2025-11-18
"""

import re
import json
import asyncio
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
from enum import Enum
from pathlib import Path

from unified_skill_executor import WorkflowType, SkillExecutionContext


class UserIntentType(Enum):
    """用户意图类型"""
    NEW_ANALYSIS = "new_analysis"           # 新项目分析
    UPDATE_EXISTING = "update_existing"     # 更新现有项目
    DEEP_DIVE = "deep_dive"                 # 深度分析
    QUICK_CHECK = "quick_check"             # 快速检查
    COMPARISON = "comparison"               # 对比分析
    DUE_DILIGENCE = "due_diligence"         # 尽职调查
    TREND_ANALYSIS = "trend_analysis"       # 趋势分析
    UNKNOWN = "unknown"                     # 未知意图


class ProjectComplexity(Enum):
    """项目复杂度"""
    LOW = "low"           # 简单项目
    MEDIUM = "medium"     # 中等复杂度
    HIGH = "high"         # 高复杂度
    VERY_HIGH = "very_high"  # 极高复杂度


@dataclass
class WorkflowSelectionCriteria:
    """工作流选择标准"""
    project_name: str
    user_input: str
    has_website: bool
    has_existing_archive: bool
    project_maturity: str  # early, growth, mature
    data_availability: str  # rich, limited, unknown
    urgency_level: str     # low, medium, high
    quality_requirement: str  # standard, high, premium
    user_intent: UserIntentType
    project_complexity: ProjectComplexity


@dataclass
class WorkflowRecommendation:
    """工作流推荐结果"""
    recommended_workflow: WorkflowType
    confidence_score: float
    reasoning: List[str]
    alternative_workflows: List[Tuple[WorkflowType, float]]
    selection_factors: Dict[str, Any]
    estimated_execution_time: float
    expected_quality_level: str


class IntelligentWorkflowSelector:
    """智能工作流选择器"""

    def __init__(self):
        """初始化工作流选择器"""
        self.intent_patterns = self._initialize_intent_patterns()
        self.complexity_indicators = self._initialize_complexity_indicators()
        self.workflow_profiles = self._initialize_workflow_profiles()

    def _initialize_intent_patterns(self) -> Dict[UserIntentType, List[str]]:
        """初始化意图识别模式"""
        return {
            UserIntentType.NEW_ANALYSIS: [
                r"生成.*文档", r"创建.*档案", r"新建.*分析", r"首次.*分析",
                r"建立.*档案", r"制作.*报告", r"开始.*分析", r"初始化"
            ],
            UserIntentType.UPDATE_EXISTING: [
                r"更新.*信息", r"刷新.*数据", r"维护.*档案", r"补充.*内容",
                r"修订.*报告", r"升级.*分析", r"同步.*数据", r"重新.*分析"
            ],
            UserIntentType.DEEP_DIVE: [
                r"深度.*分析", r"全面.*研究", r"详细.*调查", r"彻底.*分析",
                r"comprehensive", r"thorough", r"in-depth", r"详细.*分析"
            ],
            UserIntentType.QUICK_CHECK: [
                r"快速.*检查", r"简单.*分析", r"基础.*信息", r"概览",
                r"quick.*check", r"basic.*analysis", r"summary", r"概况"
            ],
            UserIntentType.COMPARISON: [
                r"对比.*分析", r"比较.*研究", r"与.*比较", r"竞争.*分析",
                r"competitive.*analysis", r"comparison", r"benchmark"
            ],
            UserIntentType.DUE_DILIGENCE: [
                r"尽职.*调查", r"投资.*分析", r"风险.*评估", r"尽调",
                r"due.*diligence", r"investment.*research", r"risk.*assessment"
            ],
            UserIntentType.TREND_ANALYSIS: [
                r"趋势.*分析", r"市场.*动态", r"发展.*趋势", r"行业.*变化",
                r"trend.*analysis", r"market.*dynamics", r"industry.*trends"
            ]
        }

    def _initialize_complexity_indicators(self) -> Dict[str, List[str]]:
        """初始化复杂度指标"""
        return {
            "high_complexity": [
                r"集团", r"控股", r"跨国", r"多业务", r"复杂", r"多元化",
                r"集团", r"conglomerate", r"multi.*business", r"complex"
            ],
            "medium_complexity": [
                r"平台", r"生态", r"多产品", r"综合", r"全链路",
                r"platform", r"ecosystem", r"multiple.*product"
            ],
            "tech_indicators": [
                r"AI", r"人工智能", r"机器学习", r"深度学习", r"区块链",
                r"物联网", r"云计算", r"big.*data", r"machine.*learning"
            ],
            "finance_indicators": [
                r"金融", r"fintech", r"支付", r"银行", r"保险", r"投资",
                r"financial", r"banking", r"investment", r"insurance"
            ]
        }

    def _initialize_workflow_profiles(self) -> Dict[WorkflowType, Dict[str, Any]]:
        """初始化工作流配置文件"""
        return {
            WorkflowType.NEW_PROJECT_ANALYSIS: {
                "name": "新项目分析工作流",
                "steps": 4,
                "estimated_time": (5, 15),  # (min, max) minutes
                "quality_level": "standard_to_high",
                "data_requirement": "medium",
                "suitable_for": [
                    UserIntentType.NEW_ANALYSIS,
                    UserIntentType.QUICK_CHECK,
                    UserIntentType.DUE_DILIGENCE
                ],
                "complexity_range": [ProjectComplexity.LOW, ProjectComplexity.MEDIUM],
                "description": "4步标准分析流程，适用于新发现的AI项目"
            },
            WorkflowType.PROJECT_UPDATE_MAINTENANCE: {
                "name": "项目更新维护工作流",
                "steps": 4,
                "estimated_time": (3, 10),
                "quality_level": "high",
                "data_requirement": "existing_data",
                "suitable_for": [
                    UserIntentType.UPDATE_EXISTING,
                    UserIntentType.TREND_ANALYSIS
                ],
                "complexity_range": [ProjectComplexity.LOW, ProjectComplexity.HIGH],
                "description": "4步更新维护流程，基于现有档案增量更新"
            },
            WorkflowType.COMPREHENSIVE_DEEP_ANALYSIS: {
                "name": "完整深度分析工作流",
                "steps": 6,
                "estimated_time": (15, 45),
                "quality_level": "premium",
                "data_requirement": "comprehensive",
                "suitable_for": [
                    UserIntentType.DEEP_DIVE,
                    UserIntentType.COMPARISON,
                    UserIntentType.DUE_DILIGENCE,
                    UserIntentType.TREND_ANALYSIS
                ],
                "complexity_range": [ProjectComplexity.MEDIUM, ProjectComplexity.VERY_HIGH],
                "description": "6步深度分析流程，包含MCP验证和交叉验证"
            }
        }

    async def select_optimal_workflow(
        self,
        project_name: str,
        user_input: str,
        website: Optional[str] = None,
        has_existing_archive: bool = False,
        additional_context: Optional[Dict[str, Any]] = None
    ) -> WorkflowRecommendation:
        """
        选择最优工作流

        Args:
            project_name: 项目名称
            user_input: 用户输入
            website: 项目网站
            has_existing_archive: 是否存在现有档案
            additional_context: 额外上下文信息

        Returns:
            WorkflowRecommendation: 工作流推荐结果
        """
        print(f"🧠 智能工作流选择器启动...")
        print(f"📋 项目: {project_name}")
        print(f"💬 用户输入: {user_input[:100]}{'...' if len(user_input) > 100 else ''}")

        # 步骤1: 分析用户意图
        user_intent = self._analyze_user_intent(user_input)
        print(f"🎯 识别用户意图: {user_intent.value}")

        # 步骤2: 评估项目复杂度
        project_complexity = self._assess_project_complexity(project_name, user_input)
        print(f"📊 评估项目复杂度: {project_complexity.value}")

        # 步骤3: 分析项目特征
        project_features = self._analyze_project_features(
            project_name, user_input, website, has_existing_archive, additional_context
        )
        print(f"🔍 项目特征分析完成")

        # 步骤4: 生成工作流候选评分
        workflow_scores = self._score_workflow_candidates(
            user_intent, project_complexity, project_features
        )

        # 步骤5: 选择最优工作流
        recommended_workflow, confidence = self._select_best_workflow(workflow_scores)

        # 步骤6: 生成推荐理由
        reasoning = self._generate_reasoning(
            recommended_workflow, user_intent, project_complexity, project_features, workflow_scores
        )

        # 步骤7: 生成备选方案
        alternatives = self._generate_alternatives(workflow_scores, recommended_workflow)

        # 步骤8: 估算执行参数
        estimated_time, expected_quality = self._estimate_execution_parameters(
            recommended_workflow, project_complexity, project_features
        )

        recommendation = WorkflowRecommendation(
            recommended_workflow=recommended_workflow,
            confidence_score=confidence,
            reasoning=reasoning,
            alternative_workflows=alternatives,
            selection_factors={
                "user_intent": user_intent.value,
                "project_complexity": project_complexity.value,
                "has_website": bool(website),
                "has_existing_archive": has_existing_archive,
                "project_features": project_features
            },
            estimated_execution_time=estimated_time,
            expected_quality_level=expected_quality
        )

        print(f"✅ 智能选择完成")
        print(f"🎯 推荐工作流: {recommended_workflow.value}")
        print(f"📊 置信度: {confidence:.1%}")
        print(f"⏱️  预估时间: {estimated_time:.1f}分钟")

        return recommendation

    def _analyze_user_intent(self, user_input: str) -> UserIntentType:
        """分析用户意图"""
        user_input_lower = user_input.lower()

        # 计算每种意图的匹配分数
        intent_scores = {}
        for intent, patterns in self.intent_patterns.items():
            score = 0
            for pattern in patterns:
                matches = len(re.findall(pattern, user_input_lower, re.IGNORECASE))
                score += matches * (2 if intent in [UserIntentType.DEEP_DIVE, UserIntentType.UPDATE_EXISTING] else 1)
            intent_scores[intent] = score

        # 找到最高分的意图
        if intent_scores:
            best_intent = max(intent_scores.items(), key=lambda x: x[1])
            if best_intent[1] > 0:
                return best_intent[0]

        # 如果没有明确意图，使用启发式规则
        if any(word in user_input_lower for word in ["新", "创建", "生成", "首次"]):
            return UserIntentType.NEW_ANALYSIS
        elif any(word in user_input_lower for word in ["更新", "刷新", "维护", "补充"]):
            return UserIntentType.UPDATE_EXISTING
        elif any(word in user_input_lower for word in ["深度", "全面", "详细", "彻底"]):
            return UserIntentType.DEEP_DIVE
        else:
            return UserIntentType.NEW_ANALYSIS  # 默认为新分析

    def _assess_project_complexity(self, project_name: str, user_input: str) -> ProjectComplexity:
        """评估项目复杂度"""
        combined_text = f"{project_name} {user_input}".lower()

        # 复杂度评分
        complexity_score = 0

        # 高复杂度指标
        for pattern in self.complexity_indicators["high_complexity"]:
            if re.search(pattern, combined_text):
                complexity_score += 3

        # 技术复杂度
        for pattern in self.complexity_indicators["tech_indicators"]:
            if re.search(pattern, combined_text):
                complexity_score += 2

        # 金融复杂度
        for pattern in self.complexity_indicators["finance_indicators"]:
            if re.search(pattern, combined_text):
                complexity_score += 2

        # 中等复杂度指标
        for pattern in self.complexity_indicators["medium_complexity"]:
            if re.search(pattern, combined_text):
                complexity_score += 1

        # 基于项目名称的复杂度评估
        if any(keyword in project_name.lower() for keyword in ["group", "group", "holdings", "international"]):
            complexity_score += 2

        # 转换为复杂度等级
        if complexity_score >= 5:
            return ProjectComplexity.VERY_HIGH
        elif complexity_score >= 3:
            return ProjectComplexity.HIGH
        elif complexity_score >= 1:
            return ProjectComplexity.MEDIUM
        else:
            return ProjectComplexity.LOW

    def _analyze_project_features(
        self,
        project_name: str,
        user_input: str,
        website: Optional[str],
        has_existing_archive: bool,
        additional_context: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """分析项目特征"""
        features = {
            "has_website": bool(website),
            "has_existing_archive": has_existing_archive,
            "domain_indicators": self._extract_domain_indicators(user_input),
            "data_hints": self._extract_data_hints(user_input),
            "urgency_indicators": self._extract_urgency_indicators(user_input),
            "quality_requirements": self._extract_quality_requirements(user_input),
            "scope_indicators": self._extract_scope_indicators(user_input)
        }

        # 添加额外上下文
        if additional_context:
            features.update(additional_context)

        return features

    def _extract_domain_indicators(self, user_input: str) -> List[str]:
        """提取领域指标"""
        domains = []
        domain_keywords = {
            "AI/ML": ["ai", "ml", "artificial intelligence", "machine learning", "人工智能", "机器学习"],
            "FinTech": ["fintech", "金融科技", "支付", "banking", "保险"],
            "HealthTech": ["healthtech", "医疗", "健康", "医疗科技", "biotech"],
            "EdTech": ["edtech", "教育", "在线教育", "学习"],
            "E-commerce": ["电商", "电子商务", "e-commerce", "retail"],
            "SaaS": ["saas", "软件即服务", "software", "平台"],
            "Blockchain": ["blockchain", "区块链", "crypto", "加密"],
            "IoT": ["iot", "物联网", "smart devices", "智能设备"]
        }

        for domain, keywords in domain_keywords.items():
            if any(keyword in user_input.lower() for keyword in keywords):
                domains.append(domain)

        return domains

    def _extract_data_hints(self, user_input: str) -> str:
        """提取数据可用性提示"""
        user_input_lower = user_input.lower()

        if any(word in user_input_lower for word in ["大量数据", "丰富信息", "详细资料", "多数据源"]):
            return "rich"
        elif any(word in user_input_lower for word in ["信息有限", "数据少", "资料不足"]):
            return "limited"
        else:
            return "unknown"

    def _extract_urgency_indicators(self, user_input: str) -> str:
        """提取紧急程度指标"""
        user_input_lower = user_input.lower()

        if any(word in user_input_lower for word in ["紧急", "急需", "立即", "马上", "urgent"]):
            return "high"
        elif any(word in user_input_lower for word in ["尽快", "优先", "重要"]):
            return "medium"
        else:
            return "low"

    def _extract_quality_requirements(self, user_input: str) -> str:
        """提取质量要求"""
        user_input_lower = user_input.lower()

        if any(word in user_input_lower for word in ["高质量", "精确", "详细", "严格", "专业"]):
            return "premium"
        elif any(word in user_input_lower for word in ["标准", "一般", "普通"]):
            return "standard"
        else:
            return "high"

    def _extract_scope_indicators(self, user_input: str) -> str:
        """提取范围指标"""
        user_input_lower = user_input.lower()

        if any(word in user_input_lower for word in ["全面", "完整", "所有", "整体"]):
            return "comprehensive"
        elif any(word in user_input_lower for word in ["基础", "概要", "简单"]):
            return "basic"
        else:
            return "standard"

    def _score_workflow_candidates(
        self,
        user_intent: UserIntentType,
        project_complexity: ProjectComplexity,
        project_features: Dict[str, Any]
    ) -> Dict[WorkflowType, float]:
        """为工作流候选评分"""
        scores = {}

        for workflow_type, profile in self.workflow_profiles.items():
            score = 0.0

            # 意图匹配评分 (40%)
            if user_intent in profile["suitable_for"]:
                score += 40
                # 特殊意图加分
                if user_intent == UserIntentType.DEEP_DIVE and workflow_type == WorkflowType.COMPREHENSIVE_DEEP_ANALYSIS:
                    score += 20
                elif user_intent == UserIntentType.UPDATE_EXISTING and workflow_type == WorkflowType.PROJECT_UPDATE_MAINTENANCE:
                    score += 20

            # 复杂度匹配评分 (20%)
            if project_complexity in profile["complexity_range"]:
                score += 20
            elif project_complexity == ProjectComplexity.VERY_HIGH and workflow_type == WorkflowType.COMPREHENSIVE_DEEP_ANALYSIS:
                score += 15
            elif project_complexity == ProjectComplexity.LOW and workflow_type == WorkflowType.NEW_PROJECT_ANALYSIS:
                score += 15

            # 项目特征匹配评分 (25%)
            if project_features["has_existing_archive"] and workflow_type == WorkflowType.PROJECT_UPDATE_MAINTENANCE:
                score += 15
            elif not project_features["has_existing_archive"] and workflow_type == WorkflowType.NEW_PROJECT_ANALYSIS:
                score += 15

            if project_features["has_website"]:
                score += 5

            # 质量要求匹配评分 (15%)
            quality_req = project_features["quality_requirements"]
            if quality_req == "premium" and workflow_type == WorkflowType.COMPREHENSIVE_DEEP_ANALYSIS:
                score += 15
            elif quality_req == "standard" and workflow_type == WorkflowType.NEW_PROJECT_ANALYSIS:
                score += 10
            elif quality_req == "high" and workflow_type in [WorkflowType.PROJECT_UPDATE_MAINTENANCE, WorkflowType.COMPREHENSIVE_DEEP_ANALYSIS]:
                score += 12

            scores[workflow_type] = score

        return scores

    def _select_best_workflow(self, workflow_scores: Dict[WorkflowType, float]) -> Tuple[WorkflowType, float]:
        """选择最佳工作流"""
        if not workflow_scores:
            return WorkflowType.NEW_PROJECT_ANALYSIS, 0.5

        best_workflow = max(workflow_scores.items(), key=lambda x: x[1])
        confidence = min(best_workflow[1] / 100, 1.0)  # 标准化到0-1

        return best_workflow[0], confidence

    def _generate_reasoning(
        self,
        recommended_workflow: WorkflowType,
        user_intent: UserIntentType,
        project_complexity: ProjectComplexity,
        project_features: Dict[str, Any],
        workflow_scores: Dict[WorkflowType, float]
    ) -> List[str]:
        """生成推荐理由"""
        reasoning = []
        profile = self.workflow_profiles[recommended_workflow]

        # 基于意图的理由
        if user_intent in profile["suitable_for"]:
            reasoning.append(f"检测到用户意图为'{user_intent.value}'，该工作流适合此类需求")

        # 基于复杂度的理由
        if project_complexity in profile["complexity_range"]:
            reasoning.append(f"项目复杂度为'{project_complexity.value}'，与工作流复杂度范围匹配")

        # 基于特征的理由
        if project_features["has_existing_archive"] and recommended_workflow == WorkflowType.PROJECT_UPDATE_MAINTENANCE:
            reasoning.append("检测到现有项目档案，推荐使用更新维护工作流")
        elif not project_features["has_existing_archive"] and recommended_workflow == WorkflowType.NEW_PROJECT_ANALYSIS:
            reasoning.append("未发现现有项目档案，推荐使用新项目分析工作流")

        if project_features["has_website"]:
            reasoning.append("项目有官方网站，有利于数据采集和验证")

        # 基于质量要求的理由
        quality_req = project_features["quality_requirements"]
        if quality_req == "premium" and recommended_workflow == WorkflowType.COMPREHENSIVE_DEEP_ANALYSIS:
            reasoning.append("用户要求高质量分析，推荐使用包含MCP验证的深度分析工作流")

        # 基于评分的理由
        score = workflow_scores.get(recommended_workflow, 0)
        reasoning.append(f"综合评分为{score:.1f}分，在候选工作流中得分最高")

        return reasoning

    def _generate_alternatives(
        self,
        workflow_scores: Dict[WorkflowType, float],
        recommended_workflow: WorkflowType
    ) -> List[Tuple[WorkflowType, float]]:
        """生成备选方案"""
        # 排除推荐的工作流，按评分排序
        sorted_workflows = sorted(
            [(wf, score) for wf, score in workflow_scores.items() if wf != recommended_workflow],
            key=lambda x: x[1],
            reverse=True
        )

        # 返回前2个备选方案
        return sorted_workflows[:2]

    def _estimate_execution_parameters(
        self,
        workflow: WorkflowType,
        complexity: ProjectComplexity,
        features: Dict[str, Any]
    ) -> Tuple[float, str]:
        """估算执行参数"""
        profile = self.workflow_profiles[workflow]
        min_time, max_time = profile["estimated_time"]

        # 基于复杂度调整时间
        complexity_multiplier = {
            ProjectComplexity.LOW: 0.8,
            ProjectComplexity.MEDIUM: 1.0,
            ProjectComplexity.HIGH: 1.3,
            ProjectComplexity.VERY_HIGH: 1.6
        }

        adjusted_min = min_time * complexity_multiplier[complexity]
        adjusted_max = max_time * complexity_multiplier[complexity]

        # 基于特征调整
        if features["has_website"]:
            adjusted_min *= 0.9  # 有网站会更快
        if features["quality_requirements"] == "premium":
            adjusted_max *= 1.2  # 高质量要求需要更多时间

        estimated_time = (adjusted_min + adjusted_max) / 2
        expected_quality = profile["quality_level"]

        return estimated_time, expected_quality

    def get_workflow_explanation(self, workflow_type: WorkflowType) -> str:
        """获取工作流解释"""
        profile = self.workflow_profiles.get(workflow_type)
        if not profile:
            return "未知工作流类型"

        explanation = f"""
## {profile['name']}

**描述**: {profile['description']}

**执行步骤**: {profile['steps']}步
**预估执行时间**: {profile['estimated_time'][0]}-{profile['estimated_time'][1]}分钟
**预期质量水平**: {profile['quality_level']}

**适用场景**:
{chr(10).join(f"- {intent.value}" for intent in profile['suitable_for'])}

**适用项目复杂度**:
{chr(10).join(f"- {complexity.value}" for complexity in profile['complexity_range'])}
        """.strip()

        return explanation

    def create_selection_context(
        self,
        project_name: str,
        user_input: str,
        website: Optional[str] = None,
        additional_context: Optional[Dict[str, Any]] = None
    ) -> SkillExecutionContext:
        """基于智能选择结果创建执行上下文"""
        # 执行智能选择
        recommendation = asyncio.run(self.select_optimal_workflow(
            project_name, user_input, website, False, additional_context
        ))

        # 创建执行上下文
        context = SkillExecutionContext(
            project_name=project_name,
            website=website,
            workflow_type=recommendation.recommended_workflow,
            user_requirements=user_input,
            quality_threshold=85.0 if recommendation.expected_quality_level == "premium" else 80.0,
            enable_mcp=True,
            enable_quality_system=True,
            execution_mode="thorough" if recommendation.expected_quality_level == "premium" else "balanced"
        )

        return context, recommendation


# 便捷函数
async def smart_workflow_selection(
    project_name: str,
    user_input: str,
    website: Optional[str] = None,
    additional_context: Optional[Dict[str, Any]] = None
) -> Tuple[SkillExecutionContext, WorkflowRecommendation]:
    """智能工作流选择的便捷函数"""
    selector = IntelligentWorkflowSelector()
    return selector.create_selection_context(project_name, user_input, website, additional_context)


def get_workflow_guide() -> str:
    """获取工作流选择指南"""
    return """
# 外部AI项目文档生成 - 工作流智能选择指南

## 🎯 工作流类型

### 1. 新项目分析工作流 (4步)
- **适用场景**: 首次发现AI项目、需要建立完整档案
- **执行时间**: 5-15分钟
- **质量水平**: 标准-高级
- **典型用户输入**: "生成这个AI项目的文档", "创建项目档案"

### 2. 项目更新维护工作流 (4步)
- **适用场景**: 更新现有项目档案、补充最新信息
- **执行时间**: 3-10分钟
- **质量水平**: 高级
- **典型用户输入**: "更新项目信息", "补充最新数据"

### 3. 完整深度分析工作流 (6步)
- **适用场景**: 深度分析、尽职调查、重要决策支持
- **执行时间**: 15-45分钟
- **质量水平**: 顶级
- **典型用户输入**: "深度分析这家公司", "全面调研项目"

## 🤖 智能选择策略

系统会根据以下因素自动选择最适合的工作流：

1. **用户意图分析**: 识别您的真实需求类型
2. **项目复杂度评估**: 评估项目的技术和业务复杂度
3. **数据可用性判断**: 分析可获取的信息丰富程度
4. **质量要求识别**: 判断分析质量要求级别
5. **时间紧急度**: 考虑执行时间要求

## 💡 使用建议

- **简单查询**: 直接描述需求，系统会自动选择
- **明确需求**: 指定工作流类型可获得更精确结果
- **高质量要求**: 使用"深度分析"、"全面调研"等关键词
- **快速更新**: 使用"更新"、"刷新"等关键词触发更新工作流

## 📊 质量保证

所有工作流都包含完整的质量保障机制：
- 数据源可信度验证
- 内容完整性检查
- 逻辑一致性验证
- VI区合规性检查
    """


# 主函数演示
async def main():
    """演示智能工作流选择器"""
    print("🧠 智能工作流选择器演示")
    print("="*50)

    selector = IntelligentWorkflowSelector()

    # 演示案例
    test_cases = [
        {
            "project": "SERVAL",
            "input": "生成这个AI项目的完整档案文档",
            "website": "https://www.serval.com/"
        },
        {
            "project": "Anthropic",
            "input": "深度分析这家AI公司，需要高质量报告用于投资决策",
            "website": "https://www.anthropic.com/"
        },
        {
            "project": "OpenAI",
            "input": "更新现有档案，补充最新的融资信息"
        },
        {
            "project": "Midjourney",
            "input": "快速分析这个图像生成AI项目的基础信息"
        }
    ]

    for i, case in enumerate(test_cases, 1):
        print(f"\n📋 案例 {i}: {case['project']}")
        print(f"💬 用户输入: {case['input']}")

        recommendation = await selector.select_optimal_workflow(
            project_name=case["project"],
            user_input=case["input"],
            website=case.get("website")
        )

        print(f"🎯 推荐工作流: {recommendation.recommended_workflow.value}")
        print(f"📊 置信度: {recommendation.confidence_score:.1%}")
        print(f"⏱️  预估时间: {recommendation.estimated_execution_time:.1f}分钟")
        print(f"⭐ 质量水平: {recommendation.expected_quality_level}")

        print("📝 推荐理由:")
        for reason in recommendation.recommendation.reasoning:
            print(f"   • {reason}")

        if recommendation.alternative_workflows:
            print("🔄 备选方案:")
            for alt_wf, score in recommendation.alternative_workflows:
                print(f"   • {alt_wf.value} (评分: {score:.1f})")

        print("-" * 50)


if __name__ == "__main__":
    asyncio.run(main())