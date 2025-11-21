"""
V1多Agent论坛协作机制 - Gate OS调度Agent
基于V1小红书运营实践智慧的论坛协作系统
"""

import asyncio
import datetime
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, field
from abc import ABC, abstractmethod
from enum import Enum

class AgentRole(Enum):
    """Agent角色枚举"""
    MARKET_ANALYST = "MARKET_ANALYST"
    CONTENT_STRATEGIST = "CONTENT_STRATEGIST"
    DATA_SCIENTIST = "DATA_SCIENTIST"
    CREATIVE_DIRECTOR = "CREATIVE_DIRECTOR"
    COMMUNITY_MANAGER = "COMMUNITY_MANAGER"
    TECH_EXPERT = "TECH_EXPERT"
    BUSINESS_ANALYST = "BUSINESS_ANALYST"

@dataclass
class AgentContribution:
    """Agent贡献"""
    agent_name: str
    agent_role: str
    contribution_type: str
    content: str
    reasoning: str
    confidence_score: float
    supporting_evidence: List[str]
    recommendations: List[str]
    execution_metadata: Dict[str, Any]

@dataclass
class TaskAnalysis:
    """任务分析"""
    task_type: str
    complexity: str
    domain: str
    scope: str
    constraints: List[str]
    requirements: List[str]

@dataclass
class DiscussionState:
    """讨论状态"""
    viewpoint_distribution: Dict[str, Any]
    identified_conflicts: List[str]
    evidence_quality_assessment: Dict[str, Any]
    diversity_score: float
    overall_coherence: float

@dataclass
class CoordinationResult:
    """协调结果"""
    coordination_rounds: int
    final_consensus_level: float
    coordination_questions_asked: List[str]
    agent_responses_received: List[str]
    final_contributions: Dict[str, AgentContribution]
    coordination_metadata: Dict[str, Any]

@dataclass
class ConsensusResult:
    """共识结果"""
    consensus_level: float
    majority_position: str
    minority_positions: List[str]
    confidence_level: float
    supporting_arguments: Dict[str, List[str]]
    action_items: List[str]

@dataclass
class QualityAssessment:
    """质量评估"""
    overall_score: float
    quality_metrics: Dict[str, float]
    improvement_areas: List[str]
    best_practices: List[str]

@dataclass
class ForumResult:
    """论坛协作结果"""
    task_analysis: TaskAnalysis
    agent_contributions: Dict[str, AgentContribution]
    coordination_result: CoordinationResult
    consensus_result: Optional[ConsensusResult]
    quality_assessment: QualityAssessment
    final_output: Dict[str, Any]
    collaboration_metadata: Dict[str, Any]

@dataclass
class ForumCollaborationTask:
    """论坛协作任务"""
    task_id: str
    title: str
    description: str
    context: Dict[str, Any]
    constraints: List[str]
    objectives: List[str]
    stakeholders: List[str]
    deadline: Optional[datetime.datetime] = None

@dataclass
class AgentConfig:
    """Agent配置"""
    agent_name: str
    role: str
    capabilities: List[str]
    expertise_areas: List[str]
    confidence_threshold: float
    interaction_style: str

class BaseAgent(ABC):
    """Agent基类"""
    
    def __init__(self, config: AgentConfig):
        self.config = config
        self.name = config.agent_name
        self.role = config.role
        
    @abstractmethod
    async def execute_with_context(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """基于上下文执行"""
        pass

class MarketTrendAnalystAgent(BaseAgent):
    """市场趋势分析师Agent"""
    
    async def execute_with_context(self, context: Dict[str, Any]) -> Dict[str, Any]:
        return {
            'type': 'market_analysis',
            'content': '市场趋势分析：AI工具市场持续增长，用户行为向视频内容倾斜',
            'reasoning': '基于四维数据收集结果，发现AI工具相关内容增长35%',
            'confidence': 0.85,
            'evidence': ['github_trending_data', 'pypi_download_stats'],
            'recommendations': ['增加AI工具内容比重', '关注新兴AI应用场景']
        }

class ContentStrategyAgent(BaseAgent):
    """内容策略Agent"""
    
    async def execute_with_context(self, context: Dict[str, Any]) -> Dict[str, Any]:
        return {
            'type': 'content_strategy',
            'content': '内容策略建议：重点发展短视频内容，结合用户偏好优化发布时间',
            'reasoning': '用户行为数据显示视频内容参与度最高，晚间19-23点活跃度峰值',
            'confidence': 0.90,
            'evidence': ['user_engagement_metrics', 'timing_analysis'],
            'recommendations': ['增加视频生产比例', '优化发布时间策略']
        }

class DataScientistAgent(BaseAgent):
    """数据科学家Agent"""
    
    async def execute_with_context(self, context: Dict[str, Any]) -> Dict[str, Any]:
        return {
            'type': 'data_analysis',
            'content': '数据分析结果：内容-用户匹配度可提升28%，建议优化推荐算法',
            'reasoning': '通过相关性分析发现内容与用户偏好存在显著优化空间',
            'confidence': 0.88,
            'evidence': ['correlation_analysis', 'ab_testing_results'],
            'recommendations': ['优化内容推荐算法', '实施A/B测试验证']
        }

class CreativeDirectorAgent(BaseAgent):
    """创意总监Agent"""
    
    async def execute_with_context(self, context: Dict[str, Any]) -> Dict[str, Any]:
        return {
            'type': 'creative_guidance',
            'content': '创意指导建议：提升视觉质量，强化品牌一致性，突出差异化价值',
            'reasoning': '竞品分析显示视觉质量和品牌一致性是影响用户参与的关键因素',
            'confidence': 0.82,
            'evidence': ['competitor_analysis', 'brand_guidelines'],
            'recommendations': ['优化视觉设计标准', '建立品牌风格指南']
        }

class CommunityManagerAgent(BaseAgent):
    """社区运营经理Agent"""
    
    async def execute_with_context(self, context: Dict[str, Any]) -> Dict[str, Any]:
        return {
            'type': 'community_strategy',
            'content': '社区运营策略：加强用户互动，建立KOL关系，优化社区治理',
            'reasoning': '用户反馈显示社区互动不足，需要加强用户参与和关系建设',
            'confidence': 0.87,
            'evidence': ['user_feedback_analysis', 'engagement_metrics'],
            'recommendations': ['实施用户互动计划', '建立KOL合作网络']
        }

class TechnicalExpertAgent(BaseAgent):
    """技术专家Agent"""
    
    async def execute_with_context(self, context: Dict[str, Any]) -> Dict[str, Any]:
        return {
            'type': 'technical_advice',
            'content': '技术建议：采用微服务架构，优化数据库性能，加强安全防护',
            'reasoning': '系统性能分析显示存在优化机会，需要提升技术基础设施',
            'confidence': 0.89,
            'evidence': ['performance_metrics', 'security_audit'],
            'recommendations': ['架构优化方案', '性能提升计划']
        }

class BusinessAnalystAgent(BaseAgent):
    """商业分析师Agent"""
    
    async def execute_with_context(self, context: Dict[str, Any]) -> Dict[str, Any]:
        return {
            'type': 'business_analysis',
            'content': '商业分析：ROI预期25%，风险可控，建议扩大投入规模',
            'reasoning': '基于市场数据和成本效益分析，项目具有良好的商业前景',
            'confidence': 0.86,
            'evidence': ['roi_calculation', 'risk_assessment'],
            'recommendations': ['扩大投资规模', '建立监控体系']
        }

class IntelligentForumHost:
    """智能论坛主持人 - V1核心创新"""

    def __init__(self):
        self.coordination_strategies = {
            'debate_facilitation': DebateFacilitationStrategy(),
            'consensus_building': ConsensusBuildingStrategy(),
            'conflict_resolution': ConflictResolutionStrategy(),
            'quality_control': QualityControlStrategy()
        }
        
    async def coordinate_discussion(self, 
                                  agent_contributions: Dict[str, AgentContribution],
                                  collaboration_task: ForumCollaborationTask,
                                  config: Dict[str, Any]) -> CoordinationResult:
        """AI主持人协调讨论的核心算法"""

        coordination_rounds = 0
        max_rounds = config.get('debate_rounds', 3)
        consensus_threshold = config.get('consensus_threshold', 0.7)
        
        current_contributions = agent_contributions.copy()
        
        # 多轮协调循环
        while coordination_rounds < max_rounds:
            
            # 1. 分析当前讨论状态
            discussion_state = await self.analyze_discussion_state(current_contributions)
            
            # 2. 检查是否达到共识
            consensus_level = await self.calculate_consensus_level(current_contributions)
            
            if consensus_level >= consensus_threshold:
                break
            
            # 3. 生成协调问题
            coordination_questions = await self.generate_coordination_questions(
                discussion_state, current_contributions
            )
            
            # 4. Agent响应协调问题
            if coordination_questions:
                agent_responses = await self.facilitate_agent_responses(
                    coordination_questions, list(current_contributions.keys())
                )
                
                # 5. 更新贡献内容
                current_contributions = await self.update_contributions_with_responses(
                    current_contributions, agent_responses
                )
            
            coordination_rounds += 1
            
            if coordination_rounds >= max_rounds:
                break
        
        return CoordinationResult(
            coordination_rounds=coordination_rounds,
            final_consensus_level=consensus_level,
            coordination_questions_asked=coordination_questions,
            agent_responses_received=agent_responses if 'agent_responses' in locals() else [],
            final_contributions=current_contributions,
            coordination_metadata={
                'strategy_used': 'iterative_consensus_building',
                'threshold_achieved': consensus_level >= consensus_threshold,
                'termination_reason': 'consensus_achieved' if consensus_level >= consensus_threshold else 'max_rounds_reached'
            }
        )

    async def analyze_discussion_state(self, 
                                      contributions: Dict[str, AgentContribution]) -> DiscussionState:
        """分析讨论状态"""
        
        # 提取所有观点
        all_viewpoints = []
        for contribution in contributions.values():
            if contribution.contribution_type == 'analysis':
                all_viewpoints.append(contribution.content)
        
        # 分析观点分布
        viewpoint_analysis = self.analyze_viewpoint_distribution(all_viewpoints)
        
        # 识别冲突点
        conflicts = self.identify_conflicts(all_viewpoints)
        
        # 计算多样性指标
        diversity_score = self.calculate_diversity_score(all_viewpoints)
        
        return DiscussionState(
            viewpoint_distribution=viewpoint_analysis,
            identified_conflicts=conflicts,
            evidence_quality_assessment={'overall': 0.8},  # 简化实现
            diversity_score=diversity_score,
            overall_coherence=self.calculate_overall_coherence(viewpoint_analysis, conflicts)
        )

    async def calculate_consensus_level(self, 
                                      contributions: Dict[str, AgentContribution]) -> float:
        """计算共识水平"""
        
        if not contributions:
            return 0.0
        
        # 简化的共识计算
        positions = {}
        for contribution in contributions.values():
            if contribution.content:
                # 提取关键立场
                position = self.extract_agent_position(contribution.content)
                if position:
                    positions[position] = positions.get(position, 0) + contribution.confidence_score
        
        if not positions:
            return 0.0
        
        # 计算加权共识
        total_weight = sum(positions.values())
        max_weight = max(positions.values())
        
        return max_weight / total_weight if total_weight > 0 else 0.0

    def extract_agent_position(self, content: str) -> Optional[str]:
        """提取Agent立场"""
        # 简化实现，实际应用中需要NLP处理
        content_lower = content.lower()
        
        if '增加' in content_lower or '提升' in content_lower:
            return 'increase_investment'
        elif '优化' in content_lower or '改进' in content_lower:
            return 'optimize_existing'
        elif '维持' in content_lower or '保持' in content_lower:
            return 'maintain_current'
        else:
            return 'neutral_position'

    def analyze_viewpoint_distribution(self, viewpoints: List[str]) -> Dict[str, Any]:
        """分析观点分布"""
        return {
            'total_viewpoints': len(viewpoints),
            'unique_perspectives': len(set(viewpoints)),
            'dominant_themes': ['optimization', 'growth', 'quality']  # 简化实现
        }

    def identify_conflicts(self, viewpoints: List[str]) -> List[str]:
        """识别冲突点"""
        # 简化实现
        conflicts = []
        if len(viewpoints) > 3:
            conflicts.append("Resource allocation priority conflict")
        return conflicts

    def calculate_diversity_score(self, viewpoints: List[str]) -> float:
        """计算多样性评分"""
        if not viewpoints:
            return 0.0
        
        unique_count = len(set(viewpoints))
        total_count = len(viewpoints)
        
        return unique_count / total_count if total_count > 0 else 0.0

    def calculate_overall_coherence(self, viewpoint_analysis: Dict[str, Any], 
                                    conflicts: List[str]) -> float:
        """计算整体一致性"""
        base_coherence = 0.8
        conflict_penalty = len(conflicts) * 0.1
        return max(0.0, base_coherence - conflict_penalty)

    async def generate_coordination_questions(self, 
                                              discussion_state: DiscussionState,
                                              contributions: Dict[str, AgentContribution]) -> List[str]:
        """生成协调问题"""
        
        questions = []
        
        # 基于冲突点生成问题
        for conflict in discussion_state.identified_conflicts:
            questions.append(f"关于{conflict}，各位Agent有什么补充说明？")
        
        # 基于多样性生成问题
        if discussion_state.diversity_score < 0.5:
            questions.append("我们需要更多样化的观点，请各位从不同角度提供见解。")
        
        # 基于一致性生成问题
        if discussion_state.overall_coherence < 0.6:
            questions.append("当前观点较为分散，请各位寻找共同点和一致意见。")
        
        return questions

    async def facilitate_agent_responses(self, 
                                        questions: List[str],
                                        agent_names: List[str]) -> List[str]:
        """协调Agent响应"""
        responses = []
        
        for question in questions:
            # 简化实现，实际应用中需要调用各Agent
            for agent_name in agent_names:
                response = f"{agent_name}回应：关于{question}，我认为需要进一步讨论。"
                responses.append(response)
        
        return responses

    async def update_contributions_with_responses(self, 
                                                   contributions: Dict[str, AgentContribution],
                                                   responses: List[str]) -> Dict[str, AgentContribution]:
        """更新贡献内容"""
        # 简化实现，实际应用中需要解析响应并更新对应Agent的贡献
        return contributions

class QualityAssessmentStrategy:
    """质量评估策略"""
    
    async def assess(self, forum_result: ForumResult) -> QualityAssessment:
        """评估论坛协作质量"""
        
        # 计算各项质量指标
        participation_score = self.calculate_participation_score(forum_result)
        consensus_quality = self.calculate_consensus_quality(forum_result)
        content_quality = self.calculate_content_quality(forum_result)
        
        # 综合评分
        overall_score = (participation_score * 0.3 + 
                         consensus_quality * 0.4 + 
                         content_quality * 0.3)
        
        return QualityAssessment(
            overall_score=overall_score,
            quality_metrics={
                'participation': participation_score,
                'consensus': consensus_quality,
                'content': content_quality
            },
            improvement_areas=self.identify_improvement_areas(forum_result),
            best_practices=self.identify_best_practices(forum_result)
        )

    def calculate_participation_score(self, forum_result: ForumResult) -> float:
        """计算参与度评分"""
        agent_count = len(forum_result.agent_contributions)
        
        # 7个专业Agent是理想状态
        ideal_count = 7
        participation_rate = agent_count / ideal_count
        
        # 考虑贡献质量
        avg_confidence = 0.0
        if agent_count > 0:
            total_confidence = sum(contrib.confidence_score 
                               for contrib in forum_result.agent_contributions.values())
            avg_confidence = total_confidence / agent_count
        
        return participation_rate * 0.6 + avg_confidence * 0.4

    def calculate_consensus_quality(self, forum_result: ForumResult) -> float:
        """计算共识质量"""
        if not forum_result.consensus_result:
            return 0.0
        
        consensus_level = forum_result.consensus_result.consensus_level
        confidence_level = forum_result.consensus_result.confidence_level
        
        return (consensus_level + confidence_level) / 2

    def calculate_content_quality(self, forum_result: ForumResult) -> float:
        """计算内容质量"""
        # 基于Agent贡献的内容质量评估
        if not forum_result.agent_contributions:
            return 0.0
        
        quality_scores = []
        for contribution in forum_result.agent_contributions.values():
            # 简化的内容质量评估
            content_length = len(contribution.content)
            evidence_count = len(contribution.supporting_evidence)
            reasoning_length = len(contribution.reasoning)
            
            # 综合质量评分
            quality = (min(content_length / 100, 1.0) * 0.4 +
                      min(evidence_count / 3, 1.0) * 0.3 +
                      min(reasoning_length / 50, 1.0) * 0.3)
            quality_scores.append(quality)
        
        return sum(quality_scores) / len(quality_scores)

    def identify_improvement_areas(self, forum_result: ForumResult) -> List[str]:
        """识别改进领域"""
        improvements = []
        
        # 基于质量指标识别
        if len(forum_result.agent_contributions) < 7:
            improvements.append("增加Agent参与度")
        
        if not forum_result.consensus_result or forum_result.consensus_result.consensus_level < 0.7:
            improvements.append("提升共识达成效率")
        
        improvements.append("优化协作流程和时间管理")
        
        return improvements

    def identify_best_practices(self, forum_result: ForumResult) -> List[str]:
        """识别最佳实践"""
        practices = []
        
        if forum_result.coordination_result.coordination_rounds <= 2:
            practices.append("高效的协调机制")
        
        if forum_result.consensus_result and forum_result.consensus_result.consensus_level >= 0.8:
            practices.append("高质量的共识形成")
        
        practices.append("多角度分析和证据支持")
        
        return practices

# 验证策略实现
class DebateFacilitationStrategy:
    """辩论促进策略"""
    pass

class ConsensusBuildingStrategy:
    """共识建立策略"""
    pass

class ConflictResolutionStrategy:
    """冲突解决策略"""
    pass

class QualityControlStrategy:
    """质量控制策略"""
    pass

class ForumCollaborationSchedulingAgent:
    """V1多Agent论坛协作调度Agent - Gate OS实现"""

    def __init__(self):
        # V1定义的7个专业运营Agent
        self.professional_agents = {
            AgentRole.MARKET_ANALYST: MarketTrendAnalystAgent(
                AgentConfig(
                    agent_name="MARKET_ANALYST",
                    role="市场趋势分析师",
                    capabilities=["市场分析", "趋势预测", "竞品研究"],
                    expertise_areas=["AI工具市场", "用户行为分析"],
                    confidence_threshold=0.7,
                    interaction_style="data_driven"
                )
            ),
            AgentRole.CONTENT_STRATEGIST: ContentStrategyAgent(
                AgentConfig(
                    agent_name="CONTENT_STRATEGIST",
                    role="内容策略师",
                    capabilities=["内容规划", "创意指导", "质量把控"],
                    expertise_areas=["内容策略", "用户需求", "平台规则"],
                    confidence_threshold=0.8,
                    interaction_style="creative"
                )
            ),
            AgentRole.DATA_SCIENTIST: DataScientistAgent(
                AgentConfig(
                    agent_name="DATA_SCIENTIST",
                    role="数据科学家",
                    capabilities=["数据分析", "统计建模", "洞察提取"],
                    expertise_areas=["数据挖掘", "机器学习", "统计分析"],
                    confidence_threshold=0.75,
                    interaction_style="analytical"
                )
            ),
            AgentRole.CREATIVE_DIRECTOR: CreativeDirectorAgent(
                AgentConfig(
                    agent_name="CREATIVE_DIRECTOR",
                    role="创意总监",
                    capabilities=["创意指导", "美学把控", "品牌建设"],
                    expertise_areas=["视觉设计", "创意策划", "品牌管理"],
                    confidence_threshold=0.8,
                    interaction_style="visionary"
                )
            ),
            AgentRole.COMMUNITY_MANAGER: CommunityManagerAgent(
                AgentConfig(
                    agent_name="COMMUNITY_MANAGER",
                    role="社区运营经理",
                    capabilities=["社区管理", "用户关系", "活动策划"],
                    expertise_areas=["用户运营", "社区治理", "KOL管理"],
                    confidence_threshold=0.7,
                    interaction_style="relational"
                )
            ),
            AgentRole.TECH_EXPERT: TechnicalExpertAgent(
                AgentConfig(
                    agent_name="TECH_EXPERT",
                    role="技术专家",
                    capabilities=["技术架构", "性能优化", "安全防护"],
                    expertise_areas=["系统架构", "技术选型", "安全合规"],
                    confidence_threshold=0.85,
                    interaction_style="technical"
                )
            ),
            AgentRole.BUSINESS_ANALYST: BusinessAnalystAgent(
                AgentConfig(
                    agent_name="BUSINESS_ANALYST",
                    role="商业分析师",
                    capabilities=["商业分析", "ROI计算", "风险评估"],
                    expertise_areas=["商业模式", "财务分析", "市场研究"],
                    confidence_threshold=0.8,
                    interaction_style="business_focused"
                )
            )
        }
        
        # AI主持人
        self.forum_host = IntelligentForumHost()
        
        # 协作配置
        self.collaboration_config = {
            'consensus_threshold': 0.7,
            'coordination_frequency': 5,
            'debate_rounds': 3,
            'voting_mechanism': 'weighted',
            'conflict_resolution': 'mediated'
        }
        
        # 质量评估策略
        self.quality_assessor = QualityAssessmentStrategy()

    async def coordinate_forum_collaboration(self, 
                                          collaboration_task: ForumCollaborationTask) -> ForumResult:
        """协调V1论坛协作的核心流程"""

        # 1. 任务分析和Agent选择
        task_analysis = await self.analyze_collaboration_task(collaboration_task)
        selected_agents = await self.select_optimal_agents(task_analysis)
        
        # 2. 并行Agent执行
        agent_contributions = await self.parallel_agent_execution(
            selected_agents, collaboration_task
        )
        
        # 3. AI主持人协调
        coordination_result = await self.forum_host.coordinate_discussion(
            agent_contributions, collaboration_task, self.collaboration_config
        )
        
        # 4. 共识形成
        consensus_result = await self.form_consensus(
            coordination_result, self.collaboration_config
        )
        
        # 5. 质量评估
        quality_assessment = await self.quality_assessor.assess(ForumResult(
            task_analysis=task_analysis,
            agent_contributions=agent_contributions,
            coordination_result=coordination_result,
            consensus_result=consensus_result,
            quality_assessment=QualityAssessment(0, {}, [], []),
            final_output={},
            collaboration_metadata={}
        ))
        
        # 6. 输出生成
        final_output = await self.generate_forum_output(
            consensus_result, quality_assessment
        )
        
        return ForumResult(
            task_analysis=task_analysis,
            agent_contributions=agent_contributions,
            coordination_result=coordination_result,
            consensus_result=consensus_result,
            quality_assessment=quality_assessment,
            final_output=final_output,
            collaboration_metadata={
                'agents_participated': list(selected_agents.keys()),
                'coordination_rounds': coordination_result.coordination_rounds,
                'consensus_level': consensus_result.consensus_level if consensus_result else 0.0,
                'quality_score': quality_assessment.overall_score
            }
        )

    async def analyze_collaboration_task(self, 
                                         collaboration_task: ForumCollaborationTask) -> TaskAnalysis:
        """分析协作任务"""
        
        return TaskAnalysis(
            task_type=self.infer_task_type(collaboration_task.description),
            complexity=self.assess_complexity(collaboration_task),
            domain=self.identify_domain(collaboration_task),
            scope=self.define_scope(collaboration_task),
            constraints=collaboration_task.constraints,
            requirements=collaboration_task.objectives
        )

    def infer_task_type(self, description: str) -> str:
        """推断任务类型"""
        desc_lower = description.lower()
        
        if '市场' in desc_lower or '竞争' in desc_lower:
            return 'market_analysis'
        elif '内容' in desc_lower or '创意' in desc_lower:
            return 'content_creation'
        elif '技术' in desc_lower or '系统' in desc_lower:
            return 'technical_optimization'
        else:
            return 'general'

    def assess_complexity(self, task: ForumCollaborationTask) -> str:
        """评估任务复杂度"""
        factors = len(task.objectives) + len(task.constraints)
        
        if factors <= 3:
            return 'low'
        elif factors <= 6:
            return 'medium'
        else:
            return 'high'

    def identify_domain(self, task: ForumCollaborationTask) -> str:
        """识别领域"""
        # 简化实现
        return 'xiaohongshu_marketing'

    def define_scope(self, task: ForumCollaborationTask) -> str:
        """定义范围"""
        return 'comprehensive' if len(task.objectives) > 5 else 'focused'

    async def select_optimal_agents(self, task_analysis: TaskAnalysis) -> Dict[AgentRole, BaseAgent]:
        """智能Agent选择算法"""
        
        task_type = task_analysis.task_type
        complexity = task_analysis.complexity
        
        # 基于任务类型和复杂度选择Agent
        selection_matrix = {
            'market_analysis': {
                'low': [AgentRole.MARKET_ANALYST],
                'medium': [AgentRole.MARKET_ANALYST, AgentRole.DATA_SCIENTIST],
                'high': [AgentRole.MARKET_ANALYST, AgentRole.DATA_SCIENTIST, AgentRole.BUSINESS_ANALYST]
            },
            'content_creation': {
                'low': [AgentRole.CONTENT_STRATEGIST, AgentRole.CREATIVE_DIRECTOR],
                'medium': [AgentRole.CONTENT_STRATEGIST, AgentRole.CREATIVE_DIRECTOR, AgentRole.COMMUNITY_MANAGER],
                'high': [AgentRole.CONTENT_STRATEGIST, AgentRole.CREATIVE_DIRECTOR, AgentRole.COMMUNITY_MANAGER, AgentRole.DATA_SCIENTIST]
            },
            'technical_optimization': {
                'low': [AgentRole.TECH_EXPERT],
                'medium': [AgentRole.TECH_EXPERT, AgentRole.DATA_SCIENTIST],
                'high': [AgentRole.TECH_EXPERT, AgentRole.DATA_SCIENTIST, AgentRole.BUSINESS_ANALYST]
            }
        }

        # 默认选择：内容策略 + 数据科学，保证至少有两个视角参与
        default_roles = [AgentRole.CONTENT_STRATEGIST, AgentRole.DATA_SCIENTIST]

        task_matrix = selection_matrix.get(task_type)
        if task_matrix:
            recommended_roles = task_matrix.get(complexity, default_roles)
        else:
            recommended_roles = default_roles
        
        selected_agents = {}
        for role in recommended_roles:
            if role in self.professional_agents:
                selected_agents[role] = self.professional_agents[role]
        
        return selected_agents

    async def parallel_agent_execution(self, 
                                     selected_agents: Dict[AgentRole, BaseAgent],
                                     collaboration_task: ForumCollaborationTask) -> Dict[str, AgentContribution]:
        """并行Agent执行"""
        
        execution_tasks = []
        
        for role, agent in selected_agents.items():
            task = self.execute_single_agent(role.value, agent, collaboration_task)
            execution_tasks.append(task)
        
        contributions = await asyncio.gather(*execution_tasks)
        
        # 整理结果
        agent_contributions = {}
        for i, contribution in enumerate(contributions):
            role_name = list(selected_agents.keys())[i]
            agent_contributions[role_name] = contribution
        
        return agent_contributions

    async def execute_single_agent(self, role_name: str, agent: BaseAgent,
                                 collaboration_task: ForumCollaborationTask) -> AgentContribution:
        """单个Agent执行"""
        
        try:
            # 执行Agent
            agent_context = self.build_agent_context(role_name, collaboration_task)
            agent_result = await agent.execute_with_context(agent_context)
            
            return AgentContribution(
                agent_name=role_name,
                agent_role=role_name,
                contribution_type=agent_result.get('type', 'analysis'),
                content=agent_result.get('content', ''),
                reasoning=agent_result.get('reasoning', ''),
                confidence_score=agent_result.get('confidence', 0.5),
                supporting_evidence=agent_result.get('evidence', []),
                recommendations=agent_result.get('recommendations', []),
                execution_metadata={
                    'execution_time': datetime.datetime.now().isoformat(),
                    'tools_used': ['analysis_engine'],
                    'data_sources': agent_result.get('data_sources', [])
                }
            )
            
        except Exception as e:
            return AgentContribution(
                agent_name=role_name,
                agent_role=role_name,
                contribution_type='error',
                content=f"Agent执行失败: {str(e)}",
                reasoning="执行过程中发生异常",
                confidence_score=0.0,
                supporting_evidence=[],
                recommendations=[],
                execution_metadata={'error': str(e)}
            )

    def build_agent_context(self, agent_name: str, 
                            collaboration_task: ForumCollaborationTask) -> Dict[str, Any]:
        """构建Agent上下文"""
        return {
            'task': collaboration_task,
            'agent_name': agent_name,
            'collaboration_context': collaboration_task.context,
            'timestamp': datetime.datetime.now().isoformat()
        }

    async def form_consensus(self, 
                             coordination_result: CoordinationResult,
                             config: Dict[str, Any]) -> Optional[ConsensusResult]:
        """形成共识"""
        
        if coordination_result.final_consensus_level >= config['consensus_threshold']:
            return ConsensusResult(
                consensus_level=coordination_result.final_consensus_level,
                majority_position="优化建议方案",
                minority_positions=["维持现状", "增加投入"],
                confidence_level=coordination_result.final_consensus_level,
                supporting_arguments={"优化方案": ["数据支持", "ROI分析"], "其他方案": ["风险考虑"]},
                action_items=["实施优化计划", "监控执行效果"]
            )
        
        return None

    async def generate_forum_output(self, 
                                    consensus_result: Optional[ConsensusResult],
                                    quality_assessment: QualityAssessment) -> Dict[str, Any]:
        """生成论坛输出"""
        
        output = {
            'timestamp': datetime.datetime.now().isoformat(),
            'quality_assessment': quality_assessment.__dict__,
            'recommendations': []
        }
        
        if consensus_result:
            output['consensus_result'] = consensus_result.__dict__
            output['recommendations'] = consensus_result.action_items
        
        return output
