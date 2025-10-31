"""
MasterAgent - 基于BMAD方法论的主控Agent
负责协调所有专业化Agent，实现1+1>2的协同效应
"""

import asyncio
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Set
from dataclasses import dataclass, field
from enum import Enum

from ..agent_os.base_agent import BaseAgent, AgentTask, AgentMessage, MessageType
from ..models.tenant import ContentRepository, Analytics

logger = logging.getLogger(__name__)


class CollaborationMode(Enum):
    """协作模式"""
    SEQUENTIAL = "sequential"  # 顺序执行
    PARALLEL = "parallel"     # 并行执行
    ITERATIVE = "iterative"   # 迭代优化
    CONSENSUS = "consensus"   # 共识决策


class OptimizationRound(Enum):
    """BMAD优化轮次"""
    PRODUCTION = "production"     # 第一轮：初始方案
    VALIDATION = "validation"     # 第二轮：验证增强
    CRITICAL = "critical"         # 第三轮：关键分析
    INTEGRATION = "integration"   # 第四轮：整合优化


@dataclass
class CollaborationTask:
    """协作任务"""
    task_id: str
    objective: str
    participating_agents: List[str]
    collaboration_mode: CollaborationMode
    optimization_rounds: List[OptimizationRound]
    dependencies: List[str] = field(default_factory=list)
    success_criteria: Dict[str, Any] = field(default_factory=dict)
    deadline: Optional[datetime] = None
    priority: int = 1


@dataclass
class AgentCapability:
    """Agent能力描述"""
    agent_id: str
    capabilities: List[str]
    performance_metrics: Dict[str, float]
    availability: bool = True
    current_load: int = 0
    specialization_areas: List[str] = field(default_factory=list)


@dataclass
class CollaborationResult:
    """协作结果"""
    task_id: str
    final_result: Dict[str, Any]
    agent_contributions: Dict[str, Any]
    collaboration_efficiency: float  # 协作效率 0-100
    synergy_score: float  # 协同效应分数 0-100
    optimization_history: List[Dict[str, Any]]
    success_achievement: float  # 成功目标达成度 0-100


class MasterAgent(BaseAgent):
    """主控Agent - BMAD方法论实现"""

    def __init__(self):
        super().__init__(
            agent_id="master-agent",
            name="系统主控协调器",
            capabilities=[
                "agent_orchestration",
                "task_decomposition",
                "collaboration_optimization",
                "quality_assurance",
                "performance_monitoring",
                "bmad_methodology"
            ],
            tools=[
                "orchestration-engine",
                "performance-monitor",
                "quality-assessor",
                "knowledge-synthesis"
            ],
            config={
                "claude_model": "claude-3-opus-20240229",
                "claude_temperature": 0.2,  # 低温度保证决策质量
                "optimization_iterations": 4,  # BMAD 4轮优化
                "collaboration_timeout": 300,  # 5分钟协作超时
                "synergy_threshold": 0.8,  # 协同效应阈值
                "quality_standard": 95  # 质量标准
            }
        )

        # Agent注册表
        self.registered_agents: Dict[str, AgentCapability] = {}

        # 协作管理
        self.active_collaborations: Dict[str, CollaborationTask] = {}
        self.collaboration_history: List[CollaborationResult] = []

        # BMAD优化器
        self.optimization_engine = BMADOptimizationEngine()

        # 知识库
        self.collaboration_patterns: List[Dict[str, Any]] = []
        self.successful_templates: List[Dict[str, Any]] = []

        # 性能监控
        self.performance_metrics: Dict[str, Any] = {}
        self.synergy_records: List[Dict[str, Any]] = []

    async def execute_task(self, task: AgentTask) -> Dict[str, Any]:
        """执行主控任务"""
        task_type = task.task_type

        if task_type == "orchestrate_campaign":
            return await self._orchestrate_campaign(task.parameters)
        elif task_type == "coordinate_agents":
            return await self._coordinate_agent_collaboration(task.parameters)
        elif task_type == "optimize_system_performance":
            return await self._optimize_system_performance(task.parameters)
        elif task_type == "execute_bmad_optimization":
            return await self._execute_bmad_optimization_cycle(task.parameters)
        elif task_type == "synthesize_intelligence":
            return await self._synthesize_multi_agent_intelligence(task.parameters)
        elif task_type == "manage_crisis":
            return await self._manage_system_crisis(task.parameters)
        else:
            raise ValueError(f"Unknown task type: {task_type}")

    async def register_agent(self, agent_capability: AgentCapability) -> bool:
        """注册Agent能力"""
        try:
            # 验证Agent能力
            validation_result = await self._validate_agent_capability(agent_capability)

            if validation_result["valid"]:
                self.registered_agents[agent_capability.agent_id] = agent_capability
                logger.info(f"Agent {agent_capability.agent_id} 注册成功")
                return True
            else:
                logger.warning(f"Agent {agent_capability.agent_id} 注册失败: {validation_result['reason']}")
                return False

        except Exception as e:
            logger.error(f"Agent注册异常: {e}")
            return False

    async def _orchestrate_campaign(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """协调营销活动 - 核心协作功能"""
        try:
            campaign_objective = params.get("objective", "")
            campaign_scope = params.get("scope", "comprehensive")
            target_metrics = params.get("target_metrics", {})
            constraints = params.get("constraints", {})

            # 1. 任务分解 (BMAD Round 1: Production)
            task_decomposition = await self._decompose_campaign_task(
                campaign_objective, campaign_scope, target_metrics, constraints
            )

            # 2. Agent选择和分配
            agent_allocation = await self._allocate_agents_to_tasks(task_decomposition)

            # 3. 执行BMAD 4轮优化
            optimization_result = await self._execute_bmad_optimization_cycle({
                "task_type": "campaign",
                "decomposition": task_decomposition,
                "agent_allocation": agent_allocation,
                "objective": campaign_objective,
                "target_metrics": target_metrics
            })

            # 4. 协作执行
            execution_result = await self._execute_collaborative_campaign(optimization_result)

            # 5. 结果整合
            final_result = await self._integrate_campaign_results(execution_result)

            # 6. 学习和改进
            await self._learn_from_campaign_experience(final_result)

            return {
                "status": "success",
                "campaign_id": f"campaign_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                "objective": campaign_objective,
                "task_decomposition": task_decomposition,
                "agent_allocation": agent_allocation,
                "optimization_result": optimization_result,
                "execution_result": execution_result,
                "final_result": final_result,
                "performance_metrics": await self._calculate_campaign_performance(final_result),
                "collaboration_efficiency": execution_result.get("efficiency_score", 0),
                "synergy_achieved": execution_result.get("synergy_score", 0)
            }

        except Exception as e:
            logger.error(f"营销活动协调失败: {e}")
            return {"status": "error", "message": str(e)}

    async def _execute_bmad_optimization_cycle(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """执行BMAD 4轮优化循环"""
        try:
            optimization_history = []
            current_solution = params.get("initial_solution", {})

            # Round 1: Production - 初始方案
            production_result = await self._production_round(current_solution, params)
            optimization_history.append({
                "round": "production",
                "result": production_result,
                "timestamp": datetime.now().isoformat(),
                "quality_score": production_result.get("quality_score", 0)
            })

            # Round 2: Validation - 验证增强
            validation_result = await self._validation_round(production_result, params)
            optimization_history.append({
                "round": "validation",
                "result": validation_result,
                "timestamp": datetime.now().isoformat(),
                "quality_score": validation_result.get("quality_score", 0)
            })

            # Round 3: Critical - 关键分析
            critical_result = await self._critical_round(validation_result, params)
            optimization_history.append({
                "round": "critical",
                "result": critical_result,
                "timestamp": datetime.now().isoformat(),
                "quality_score": critical_result.get("quality_score", 0),
                "identified_issues": critical_result.get("issues", []),
                "optimization_opportunities": critical_result.get("opportunities", [])
            })

            # Round 4: Integration - 整合优化
            integration_result = await self._integration_round(critical_result, params)
            optimization_history.append({
                "round": "integration",
                "result": integration_result,
                "timestamp": datetime.now().isoformat(),
                "quality_score": integration_result.get("quality_score", 0),
                "final_optimizations": integration_result.get("optimizations", [])
            })

            # 计算优化效果
            improvement_metrics = await self._calculate_optimization_improvement(optimization_history)

            return {
                "status": "success",
                "optimization_history": optimization_history,
                "final_solution": integration_result,
                "improvement_metrics": improvement_metrics,
                "overall_quality_improvement": improvement_metrics.get("quality_improvement", 0),
                "optimization_efficiency": improvement_metrics.get("efficiency_score", 0)
            }

        except Exception as e:
            logger.error(f"BMAD优化循环失败: {e}")
            return {"status": "error", "message": str(e)}

    async def _production_round(self, current_solution: Dict[str, Any], params: Dict[str, Any]) -> Dict[str, Any]:
        """第一轮：初始方案生成"""
        production_prompt = f"""
        作为MasterAgent，请生成初始解决方案：

        当前方案：{json.dumps(current_solution, ensure_ascii=False)}
        任务参数：{json.dumps(params, ensure_ascii=False)}

        基于以下原则生成初始方案：
        1. 内部一致性：确保方案逻辑自洽
        2. 可行性评估：基于现有资源和约束
        3. 利益相关者分析：考虑所有相关方需求
        4. 风险初步评估：识别主要风险点

        返回JSON格式的初始方案，包括：
        - solution_outline: 解决方案大纲
        - stakeholder_analysis: 利益相关者分析
        - feasibility_assessment: 可行性评估
        - initial_risks: 初步风险识别
        - resource_requirements: 资源需求
        - implementation_plan: 实施计划
        """

        production_result = await self.call_claude(production_prompt, max_tokens=3000)

        try:
            solution_data = json.loads(production_result)
        except:
            solution_data = await self._fallback_production_generation(current_solution, params)

        # 质量评估
        quality_score = await self._assess_solution_quality(solution_data)
        solution_data["quality_score"] = quality_score
        solution_data["generation_method"] = "production_round"

        return solution_data

    async def _validation_round(self, production_result: Dict[str, Any], params: Dict[str, Any]) -> Dict[str, Any]:
        """第二轮：外部验证和增强"""
        validation_prompt = f"""
        对初始方案进行外部验证和增强：

        初始方案：{json.dumps(production_result, ensure_ascii=False)}
        任务背景：{json.dumps(params, ensure_ascii=False)}

        请执行以下验证：
        1. 行业最佳实践对标
        2. 竞争对手分析
        3. 学术研究支持
        4. 法规合规检查
        5. 技术可行性验证

        基于验证结果，提出：
        - 增强建议
        - 优化机会
        - 风险缓解措施
        - 创新改进点

        返回JSON格式的验证增强方案。
        """

        validation_result = await self.call_claude(validation_prompt, max_tokens=3000)

        try:
            validation_data = json.loads(validation_result)
        except:
            validation_data = await self._fallback_validation_generation(production_result, params)

        # 整合验证结果
        enhanced_solution = await self._integrate_validation_results(production_result, validation_data)
        enhanced_solution["quality_score"] = await self._assess_solution_quality(enhanced_solution)
        enhanced_solution["generation_method"] = "validation_round"

        return enhanced_solution

    async def _critical_round(self, validation_result: Dict[str, Any], params: Dict[str, Any]) -> Dict[str, Any]:
        """第三轮：关键分析和优化识别"""
        critical_prompt = f"""
        对验证增强方案进行关键分析：

        方案：{json.dumps(validation_result, ensure_ascii=False)}
        目标：{json.dumps(params.get('target_metrics', {}), ensure_ascii=False)}

        执行关键分析：
        1. 质量差距识别
        2. 关键成功因素分析
        3. 潜在失败点识别
        4. 优化机会挖掘
        5. 创新突破点寻找

        重点关注：
        - 哪些方面可能成为瓶颈？
        - 哪些改进能带来最大价值？
        - 如何避免常见失败模式？
        - 如何创造差异化优势？

        返回JSON格式的关键分析报告。
        """

        critical_result = await self.call_claude(critical_prompt, max_tokens=3000)

        try:
            critical_data = json.loads(critical_result)
        except:
            critical_data = await self._fallback_critical_generation(validation_result, params)

        # 生成优化建议
        optimization_recommendations = await self._generate_optimization_recommendations(
            validation_result, critical_data
        )

        critical_solution = {
            "base_solution": validation_result,
            "critical_analysis": critical_data,
            "optimization_recommendations": optimization_recommendations,
            "quality_score": await self._assess_solution_quality(validation_result),
            "generation_method": "critical_round"
        }

        return critical_solution

    async def _integration_round(self, critical_result: Dict[str, Any], params: Dict[str, Any]) -> Dict[str, Any]:
        """第四轮：整合优化和最终方案"""
        integration_prompt = f"""
        整合前三轮分析结果，生成最终优化方案：

        关键分析结果：{json.dumps(critical_result, ensure_ascii=False)}
        项目目标：{json.dumps(params, ensure_ascii=False)}

        整合要求：
        1. 融合所有优化建议
        2. 解决识别的所有问题
        3. 确保方案的完整性和一致性
        4. 制定详细的实施路线图
        5. 建立质量保证机制

        生成最终方案包括：
        - 最终解决方案描述
        - 详细实施步骤
        - 质量控制点
        - 风险管理计划
        - 成功评估指标
        - 持续改进机制

        返回JSON格式的最终优化方案。
        """

        integration_result = await self.call_claude(integration_prompt, max_tokens=4000)

        try:
            integration_data = json.loads(integration_result)
        except:
            integration_data = await self._fallback_integration_generation(critical_result, params)

        # 最终质量验证
        final_quality_score = await self._comprehensive_quality_assessment(integration_data)
        integration_data["quality_score"] = final_quality_score
        integration_data["generation_method"] = "integration_round"
        integration_data["optimization_applied"] = critical_result.get("optimization_recommendations", [])

        return integration_data

    async def _coordinate_agent_collaboration(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """协调Agent协作"""
        try:
            collaboration_task = CollaborationTask(
                task_id=params.get("task_id", f"collab_{datetime.now().strftime('%Y%m%d_%H%M%S')}"),
                objective=params.get("objective", ""),
                participating_agents=params.get("agents", []),
                collaboration_mode=CollaborationMode(params.get("mode", "parallel")),
                optimization_rounds=[OptimizationRound(r) for r in params.get("rounds", ["production", "validation", "critical", "integration"])],
                dependencies=params.get("dependencies", []),
                success_criteria=params.get("success_criteria", {}),
                deadline=datetime.fromisoformat(params["deadline"]) if params.get("deadline") else None,
                priority=params.get("priority", 1)
            )

            # 1. 验证Agent可用性
            availability_check = await self._check_agent_availability(collaboration_task.participating_agents)
            if not availability_check["all_available"]:
                return {"status": "error", "message": "部分Agent不可用", "availability": availability_check}

            # 2. 创建协作上下文
            collaboration_context = await self._create_collaboration_context(collaboration_task)

            # 3. 执行协作
            collaboration_result = await self._execute_collaboration_workflow(collaboration_task, collaboration_context)

            # 4. 评估协作效果
            collaboration_assessment = await self._assess_collaboration_effectiveness(collaboration_result)

            # 5. 保存协作记录
            await self._save_collaboration_record(collaboration_task, collaboration_result, collaboration_assessment)

            return {
                "status": "success",
                "collaboration_task": self._serialize_collaboration_task(collaboration_task),
                "collaboration_result": collaboration_result,
                "effectiveness_assessment": collaboration_assessment,
                "synergy_achieved": collaboration_assessment.get("synergy_score", 0),
                "efficiency_score": collaboration_assessment.get("efficiency_score", 0)
            }

        except Exception as e:
            logger.error(f"Agent协作协调失败: {e}")
            return {"status": "error", "message": str(e)}

    # ========== BMAD方法论专业实现 ==========

    async def _decompose_campaign_task(self, objective: str, scope: str, target_metrics: Dict[str, Any], constraints: Dict[str, Any]) -> Dict[str, Any]:
        """任务分解 - BMAD方法论第一步"""
        decomposition_prompt = f"""
        基于BMAD方法论，将营销活动目标分解为可执行的子任务：

        活动目标：{objective}
        活动范围：{scope}
        目标指标：{json.dumps(target_metrics, ensure_ascii=False)}
        约束条件：{json.dumps(constraints, ensure_ascii=False)}

        请按照以下维度分解任务：
        1. 利益相关者分析
        2. 技术架构需求
        3. 业务流程设计
        4. 执行实施方案

        每个维度分解为具体的、可衡量的、可分配的子任务。
        确保任务之间的逻辑关系和依赖性。

        返回JSON格式的任务分解结果。
        """

        decomposition_result = await self.call_claude(decomposition_prompt, max_tokens=3000)

        try:
            return json.loads(decomposition_result)
        except:
            return await self._fallback_task_decomposition(objective, scope, target_metrics, constraints)

    async def _allocate_agents_to_tasks(self, task_decomposition: Dict[str, Any]) -> Dict[str, Any]:
        """Agent分配优化"""
        allocation_prompt = f"""
        基于任务分解结果和可用Agent能力，进行最优分配：

        任务分解：{json.dumps(task_decomposition, ensure_ascii=False)}
        可用Agent：{json.dumps({aid: cap.capabilities for aid, cap in self.registered_agents.items()}, ensure_ascii=False)}

        分配原则：
        1. 能力匹配：Agent能力与任务需求匹配
        2. 负载均衡：避免单一Agent过载
        3. 协作优化：最大化Agent间协同效应
        4. 效率优先：选择最高效的Agent组合

        返回JSON格式的Agent分配方案。
        """

        allocation_result = await self.call_claude(allocation_prompt, max_tokens=2000)

        try:
            return json.loads(allocation_result)
        except:
            return await self._fallback_agent_allocation(task_decomposition)

    # ========== 辅助方法 ==========

    def _serialize_collaboration_task(self, task: CollaborationTask) -> Dict[str, Any]:
        """序列化协作任务"""
        return {
            "task_id": task.task_id,
            "objective": task.objective,
            "participating_agents": task.participating_agents,
            "collaboration_mode": task.collaboration_mode.value,
            "optimization_rounds": [r.value for r in task.optimization_rounds],
            "dependencies": task.dependencies,
            "success_criteria": task.success_criteria,
            "deadline": task.deadline.isoformat() if task.deadline else None,
            "priority": task.priority
        }

    async def _get_status(self) -> Dict[str, Any]:
        """获取MasterAgent状态"""
        base_status = super().get_status()

        master_metrics = {
            "registered_agents": len(self.registered_agents),
            "active_collaborations": len(self.active_collaborations),
            "collaboration_history": len(self.collaboration_history),
            "average_synergy_score": sum(r.synergy_score for r in self.collaboration_history) / len(self.collaboration_history) if self.collaboration_history else 0,
            "optimization_cycles_completed": len([r for r in self.collaboration_history if r.optimization_history]),
            "bmad_methodology_active": True,
            "agent_utilization": await self._calculate_agent_utilization(),
            "collaboration_patterns": len(self.collaboration_patterns)
        }

        base_status["master_metrics"] = master_metrics
        return base_status


class BMADOptimizationEngine:
    """BMAD优化引擎 - 专门实现4轮优化逻辑"""

    def __init__(self):
        self.optimization_templates = {}
        self.quality_thresholds = {
            "production": 70,
            "validation": 80,
            "critical": 85,
            "integration": 95
        }

    async def evaluate_round_quality(self, round_result: Dict[str, Any], round_type: str) -> float:
        """评估轮次质量"""
        base_score = round_result.get("quality_score", 0)
        threshold = self.quality_thresholds.get(round_type, 80)

        # 质量调整因子
        if round_type == "production":
            return min(base_score * 1.1, 100)  # 创新加分
        elif round_type == "validation":
            return min(base_score * 1.05, 100)  # 外部验证加分
        elif round_type == "critical":
            return min(base_score * 1.0, 100)  # 严格评分
        elif round_type == "integration":
            return min(base_score * 1.15, 100)  # 整合价值加分

        return base_score

    async def should_continue_optimization(self, history: List[Dict[str, Any]]) -> bool:
        """判断是否继续优化"""
        if len(history) < 2:
            return True

        last_improvement = history[-1]["quality_score"] - history[-2]["quality_score"]

        # 如果改进幅度小于5%，可以停止
        if last_improvement < 5:
            return False

        # 如果已经达到95分，可以停止
        if history[-1]["quality_score"] >= 95:
            return False

        return True