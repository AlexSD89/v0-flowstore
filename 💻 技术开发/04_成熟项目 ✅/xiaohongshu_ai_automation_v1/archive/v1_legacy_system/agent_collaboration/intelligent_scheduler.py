"""
智能任务调度器
基于Agent能力、工作负载、协同效应和任务优先级进行智能任务调度
"""

import asyncio
import json
import logging
import heapq
from typing import Dict, List, Optional, Tuple, Any, Set
from dataclasses import dataclass, asdict, field
from datetime import datetime, timedelta
from enum import Enum
import numpy as np
from collections import defaultdict, deque

from .collaboration_manager import CollaborationTask, TaskPriority, CollaborationType, AgentCollaborationProfile
from ..agents.base_agent import BaseAgent, AgentStatus
from ..utils.base import BaseModel
from ..utils.config import Config

class SchedulingStrategy(Enum):
    """调度策略"""
    PRIORITY_FIRST = "priority_first"           # 优先级优先
    CAPABILITY_MATCH = "capability_match"       # 能力匹配
    WORKLOAD_BALANCE = "workload_balance"       # 工作负载平衡
    SYNERGY_MAXIMIZE = "synergy_maximize"       # 协同效应最大化
    DEADLINE_AWARE = "deadline_aware"           # 截止时间感知
    COST_OPTIMAL = "cost_optimal"               # 成本最优
    QUALITY_FOCUSED = "quality_focused"         # 质量导向

class SchedulingStatus(Enum):
    """调度状态"""
    PENDING = "pending"
    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

@dataclass
class SchedulingConstraint:
    """调度约束"""
    constraint_type: str  # "deadline", "resource", "agent_availability", "dependency"
    constraint_value: Any
    priority: int = 1  # 1-10, 10为最高优先级
    description: str = ""

@dataclass
class SchedulingDecision:
    """调度决策"""
    task_id: str
    assigned_agents: List[str]
    scheduled_start_time: datetime
    estimated_completion_time: datetime
    scheduling_strategy: SchedulingStrategy
    confidence_score: float
    optimization_objectives: Dict[str, float]
    constraints_satisfied: List[str]
    expected_synergy_score: float
    resource_allocation: Dict[str, Any]

@dataclass
class ResourceUtilization:
    """资源利用率"""
    agent_id: str
    cpu_utilization: float
    memory_utilization: float
    task_utilization: float
    collaboration_load: float
    availability_window: Tuple[datetime, datetime]
    utilization_trend: List[float] = field(default_factory=list)

class IntelligentScheduler(BaseModel):
    """智能任务调度器"""

    def __init__(self, config: Optional[Config] = None):
        super().__init__("intelligent_scheduler_v3.0", config)

        # 核心配置
        self.scheduling_horizon = self.config.get("scheduling_horizon", 24)  # 小时
        self.max_concurrent_tasks = self.config.get("max_concurrent_tasks", 50)
        self.rescheduling_interval = self.config.get("rescheduling_interval", 300)  # 秒
        self.optimization_weight = self.config.get("optimization_weight", {
            "completion_time": 0.3,
            "quality": 0.25,
            "synergy": 0.2,
            "resource_efficiency": 0.15,
            "cost": 0.1
        })

        # 调度队列管理
        self.priority_queue: List[Tuple[float, CollaborationTask]] = []  # (priority_score, task)
        self.scheduled_tasks: Dict[str, SchedulingDecision] = {}
        self.execution_queue: deque = deque()
        self.completed_tasks: List[str] = []

        # Agent状态管理
        self.agent_status: Dict[str, AgentStatus] = {}
        self.agent_availability: Dict[str, List[Tuple[datetime, datetime]]] = {}
        self.agent_workload: Dict[str, int] = defaultdict(int)
        self.agent_capabilities: Dict[str, Set[str]] = defaultdict(set)

        # 资源监控
        self.resource_utilization: Dict[str, ResourceUtilization] = {}
        self.resource_history: List[Dict[str, Any]] = []

        # 调度策略配置
        self.strategy_configs = self._initialize_strategy_configs()

        # 优化算法
        self.optimization_algorithms = self._initialize_optimization_algorithms()

        # 预测模型
        self.execution_time_predictor = self._initialize_execution_time_predictor()
        self.synergy_predictor = self._initialize_synergy_predictor()
        self.workload_predictor = self._initialize_workload_predictor()

        # 调度历史和学习
        self.scheduling_history: List[Dict[str, Any]] = []
        self.performance_metrics: Dict[str, List[float]] = defaultdict(list)

        # 小红书特定调度配置
        self.xiaohongshu_scheduling_config = self._load_xiaohongshu_scheduling_config()

        # 动态调度器
        self.background_scheduler_task: Optional[asyncio.Task] = None

        self.logger.info("IntelligentScheduler initialized with horizon: {} hours".format(
            self.scheduling_horizon))

    def _load_xiaohongshu_scheduling_config(self) -> Dict[str, Any]:
        """加载小红书特定调度配置"""
        return {
            "content_creation_priorities": {
                # 内容创作优先级配置
                "viral_content_detection": {"priority": 10, "max_delay": 300},      # 5分钟
                "trend_analysis": {"priority": 9, "max_delay": 600},                # 10分钟
                "content_generation": {"priority": 8, "max_delay": 900},             # 15分钟
                "quality_review": {"priority": 7, "max_delay": 1200},                # 20分钟
                "engagement_optimization": {"priority": 6, "max_delay": 1800}         # 30分钟
            },
            "time_sensitive_tasks": [
                # 时间敏感任务
                {"task_type": "viral_alert", "response_time": 60},      # 1分钟
                {"task_type": "trend_spike", "response_time": 300},     # 5分钟
                {"task_type": "competitor_analysis", "response_time": 1800}  # 30分钟
            ],
            "resource_requirements": {
                # 资源需求配置
                "ai_heavy_tasks": ["viral_detection", "trend_prediction"],
                "io_heavy_tasks": ["data_collection", "content_scraping"],
                "collaboration_intensive": ["content_creation", "brand_matching"]
            },
            "peak_hours_schedule": {
                # 高峰时段调度配置
                "morning_peak": {"start": "09:00", "end": "11:00", "priority_boost": 1.2},
                "afternoon_peak": {"start": "14:00", "end": "16:00", "priority_boost": 1.1},
                "evening_peak": {"start": "19:00", "end": "22:00", "priority_boost": 1.3},
                "late_night": {"start": "23:00", "end": "02:00", "priority_boost": 0.8}
            }
        }

    def _initialize_strategy_configs(self) -> Dict[SchedulingStrategy, Dict[str, Any]]:
        """初始化调度策略配置"""
        return {
            SchedulingStrategy.PRIORITY_FIRST: {
                "description": "优先级优先调度",
                "weight_factors": {"priority": 1.0, "deadline": 0.8, "complexity": 0.3},
                "optimization_target": "minimize_waiting_time"
            },
            SchedulingStrategy.CAPABILITY_MATCH: {
                "description": "能力匹配调度",
                "weight_factors": {"capability_match": 1.0, "skill_level": 0.7, "experience": 0.5},
                "optimization_target": "maximize_success_rate"
            },
            SchedulingStrategy.WORKLOAD_BALANCE: {
                "description": "工作负载平衡调度",
                "weight_factors": {"workload_balance": 1.0, "agent_availability": 0.8, "efficiency": 0.6},
                "optimization_target": "balance_resource_utilization"
            },
            SchedulingStrategy.SYNERGY_MAXIMIZE: {
                "description": "协同效应最大化调度",
                "weight_factors": {"synergy_score": 1.0, "collaboration_history": 0.7, "team_compatibility": 0.5},
                "optimization_target": "maximize_collaboration_effectiveness"
            },
            SchedulingStrategy.DEADLINE_AWARE: {
                "description": "截止时间感知调度",
                "weight_factors": {"deadline_urgency": 1.0, "task_duration": 0.8, "slack_time": 0.6},
                "optimization_target": "meet_all_deadlines"
            },
            SchedulingStrategy.COST_OPTIMAL: {
                "description": "成本最优调度",
                "weight_factors": {"resource_cost": 1.0, "execution_efficiency": 0.7, "quality_cost": 0.5},
                "optimization_target": "minimize_total_cost"
            },
            SchedulingStrategy.QUALITY_FOCUSED: {
                "description": "质量导向调度",
                "weight_factors": {"quality_score": 1.0, "agent_expertise": 0.8, "review_coverage": 0.6},
                "optimization_target": "maximize_output_quality"
            }
        }

    def _initialize_optimization_algorithms(self) -> Dict[str, Any]:
        """初始化优化算法"""
        return {
            "genetic_algorithm": {
                "population_size": 50,
                "generations": 100,
                "mutation_rate": 0.1,
                "crossover_rate": 0.8,
                "selection_method": "tournament"
            },
            "simulated_annealing": {
                "initial_temperature": 1000,
                "cooling_rate": 0.95,
                "min_temperature": 1,
                "iterations_per_temperature": 100
            },
            "particle_swarm": {
                "swarm_size": 30,
                "inertia_weight": 0.7,
                "cognitive_weight": 1.5,
                "social_weight": 1.5,
                "max_iterations": 200
            },
            "ant_colony": {
                "colony_size": 20,
                "pheromone_evaporation": 0.1,
                "alpha": 1.0,
                "beta": 2.0,
                "iterations": 100
            }
        }

    def _initialize_execution_time_predictor(self) -> Dict[str, Any]:
        """初始化执行时间预测器"""
        return {
            "model_type": "ensemble_regression",
            "features": [
                "task_complexity",
                "agent_capabilities",
                "collaboration_overhead",
                "resource_availability",
                "historical_performance"
            ],
            "base_times": {
                "simple_task": 300,      # 5分钟
                "moderate_task": 900,    # 15分钟
                "complex_task": 1800,    # 30分钟
                "very_complex_task": 3600  # 1小时
            },
            "multipliers": {
                "collaboration_overhead": 1.2,
                "resource_contention": 1.3,
                "agent_inexperience": 1.5,
                "quality_requirements": 1.1
            }
        }

    def _initialize_synergy_predictor(self) -> Dict[str, Any]:
        """初始化协同效应预测器"""
        return {
            "model_type": "collaborative_filtering",
            "factors": [
                "historical_synergy",
                "capability_compatibility",
                "communication_patterns",
                "workload_compatibility",
                "personality_match"
            ],
            "base_synergy": 0.5,
            "boost_factors": {
                "successful_history": 0.3,
                "complementary_skills": 0.2,
                "good_communication": 0.15,
                "balanced_workload": 0.1
            }
        }

    def _initialize_workload_predictor(self) -> Dict[str, Any]:
        """初始化工作负载预测器"""
        return {
            "model_type": "time_series_forecasting",
            "prediction_window": 24,  # 小时
            "factors": [
                "historical_workload",
                "task_patterns",
                "seasonal_trends",
                "agent_capacity",
                "resource_constraints"
            ],
            "capacity_factors": {
                "max_concurrent_tasks": 5,
                "preferred_workload": 3,
                "overload_threshold": 0.8
            }
        }

    async def start_scheduler(self) -> None:
        """启动调度器"""
        try:
            if self.background_scheduler_task is None:
                self.background_scheduler_task = asyncio.create_task(self._scheduler_loop())
                self.logger.info("Intelligent scheduler started")

        except Exception as e:
            self.logger.error("Error starting scheduler: {}".format(str(e)))
            raise

    async def stop_scheduler(self) -> None:
        """停止调度器"""
        try:
            if self.background_scheduler_task:
                self.background_scheduler_task.cancel()
                self.background_scheduler_task = None
                self.logger.info("Intelligent scheduler stopped")

        except Exception as e:
            self.logger.error("Error stopping scheduler: {}".format(str(e)))

    async def _scheduler_loop(self) -> None:
        """调度器主循环"""
        while True:
            try:
                # 处理优先级队列中的任务
                await self._process_priority_queue()

                # 执行当前调度队列中的任务
                await self._execute_scheduled_tasks()

                # 更新资源利用率
                await self._update_resource_utilization()

                # 重新调度 overdue tasks
                await self._reschedule_overdue_tasks()

                # 等待下一个调度周期
                await asyncio.sleep(self.rescheduling_interval)

            except asyncio.CancelledError:
                break
            except Exception as e:
                self.logger.error("Error in scheduler loop: {}".format(str(e)))
                await asyncio.sleep(60)  # 错误后等待1分钟再继续

    async def submit_task(self, task: CollaborationTask,
                         constraints: Optional[List[SchedulingConstraint]] = None,
                         preferred_strategy: Optional[SchedulingStrategy] = None) -> str:
        """提交任务到调度器"""
        try:
            # 计算任务优先级分数
            priority_score = await self._calculate_priority_score(task, constraints)

            # 添加到优先级队列
            heapq.heappush(self.priority_queue, (-priority_score, task))

            # 记录任务提交
            submission_record = {
                "task_id": task.task_id,
                "submission_time": datetime.now().isoformat(),
                "priority_score": priority_score,
                "constraints": [asdict(c) for c in constraints] if constraints else [],
                "preferred_strategy": preferred_strategy.value if preferred_strategy else None
            }

            self.scheduling_history.append(submission_record)

            self.logger.info("Task submitted to scheduler: {} (priority: {:.2f})".format(
                task.task_id, priority_score))
            return task.task_id

        except Exception as e:
            self.logger.error("Error submitting task {}: {}".format(task.task_id, str(e)))
            raise

    async def _calculate_priority_score(self, task: CollaborationTask,
                                     constraints: Optional[List[SchedulingConstraint]]) -> float:
        """计算任务优先级分数"""
        base_score = 0.0

        # 基于任务优先级
        priority_values = {
            TaskPriority.CRITICAL: 100,
            TaskPriority.HIGH: 80,
            TaskPriority.MEDIUM: 60,
            TaskPriority.LOW: 40,
            TaskPriority.BACKGROUND: 20
        }
        base_score += priority_values.get(task.priority, 50)

        # 基于小红书特定优先级
        xiaohongshu_priorities = self.xiaohongshu_scheduling_config["content_creation_priorities"]
        for capability in task.required_capabilities:
            if capability in xiaohongshu_priorities:
                priority_info = xiaohongshu_priorities[capability]
                base_score += priority_info["priority"]

        # 基于约束条件
        if constraints:
            for constraint in constraints:
                if constraint.constraint_type == "deadline":
                    # 截止时间约束
                    if isinstance(constraint.constraint_value, datetime):
                        time_to_deadline = (constraint.constraint_value - datetime.now()).total_seconds()
                        urgency_score = max(0, 100 - time_to_deadline / 3600)  # 越近截止时间分数越高
                        base_score += urgency_score * constraint.priority / 10

                elif constraint.constraint_type == "resource":
                    # 资源约束
                    base_score += constraint.priority * 5

        # 基于任务复杂度
        complexity_penalty = len(task.required_capabilities) * 2
        base_score -= complexity_penalty

        # 基于时间段调整（高峰时段优先级提升）
        current_hour = datetime.now().hour
        peak_hours = self.xiaohongshu_scheduling_config["peak_hours_schedule"]
        for peak_config in peak_hours.values():
            start_hour = int(peak_config["start"].split(":")[0])
            end_hour = int(peak_config["end"].split(":")[0])
            if start_hour <= current_hour < end_hour:
                base_score *= peak_config["priority_boost"]
                break

        return base_score

    async def _process_priority_queue(self) -> None:
        """处理优先级队列"""
        while self.priority_queue and len(self.scheduled_tasks) < self.max_concurrent_tasks:
            try:
                # 获取最高优先级任务
                negative_priority, task = heapq.heappop(self.priority_queue)
                priority_score = -negative_priority

                # 检查任务是否仍然有效
                if task.task_id in self.scheduled_tasks:
                    continue

                # 选择最优调度策略
                strategy = await self._select_optimal_strategy(task)

                # 生成调度决策
                scheduling_decision = await self._generate_scheduling_decision(task, strategy)

                if scheduling_decision:
                    self.scheduled_tasks[task.task_id] = scheduling_decision
                    self.execution_queue.append(task.task_id)

                    # 记录调度决策
                    decision_record = {
                        "task_id": task.task_id,
                        "decision_time": datetime.now().isoformat(),
                        "strategy": strategy.value,
                        "confidence_score": scheduling_decision.confidence_score,
                        "assigned_agents": scheduling_decision.assigned_agents,
                        "expected_synergy": scheduling_decision.expected_synergy_score
                    }

                    self.scheduling_history.append(decision_record)

                    self.logger.info("Task scheduled: {} using {} strategy (confidence: {:.2f})".format(
                        task.task_id, strategy.value, scheduling_decision.confidence_score))

            except Exception as e:
                self.logger.error("Error processing priority queue: {}".format(str(e)))
                break

    async def _select_optimal_strategy(self, task: CollaborationTask) -> SchedulingStrategy:
        """选择最优调度策略"""
        strategy_scores = {}

        for strategy in SchedulingStrategy:
            score = await self._evaluate_strategy_for_task(task, strategy)
            strategy_scores[strategy] = score

        # 选择得分最高的策略
        optimal_strategy = max(strategy_scores.items(), key=lambda x: x[1])[0]

        self.logger.debug("Selected strategy {} for task {} (score: {:.2f})".format(
            optimal_strategy.value, task.task_id, strategy_scores[optimal_strategy]))

        return optimal_strategy

    async def _evaluate_strategy_for_task(self, task: CollaborationTask, strategy: SchedulingStrategy) -> float:
        """评估策略对任务的适用性"""
        config = self.strategy_configs[strategy]
        score = 0.0

        # 基于任务特性评估
        if strategy == SchedulingStrategy.PRIORITY_FIRST:
            # 优先级优先策略适用于紧急任务
            if task.priority in [TaskPriority.CRITICAL, TaskPriority.HIGH]:
                score += 0.8
            else:
                score += 0.4

        elif strategy == SchedulingStrategy.CAPABILITY_MATCH:
            # 能力匹配策略适用于复杂任务
            if len(task.required_capabilities) > 2:
                score += 0.9
            else:
                score += 0.5

        elif strategy == SchedulingStrategy.WORKLOAD_BALANCE:
            # 工作负载平衡策略适用于负载不均的情况
            workload_variance = np.var(list(self.agent_workload.values())) if self.agent_workload else 0
            if workload_variance > 2:
                score += 0.8
            else:
                score += 0.4

        elif strategy == SchedulingStrategy.SYNERGY_MAXIMIZE:
            # 协同效应最大化策略适用于协作密集型任务
            if task.collaboration_type in [CollaborationType.PARALLEL, CollaborationType.SWARM]:
                score += 0.9
            else:
                score += 0.5

        elif strategy == SchedulingStrategy.DEADLINE_AWARE:
            # 截止时间感知策略适用于有时间限制的任务
            if task.estimated_duration:
                score += 0.7
            else:
                score += 0.3

        elif strategy == SchedulingStrategy.COST_OPTIMAL:
            # 成本最优策略适用于资源敏感的任务
            if len(task.required_capabilities) > 3:
                score += 0.6
            else:
                score += 0.4

        elif strategy == SchedulingStrategy.QUALITY_FOCUSED:
            # 质量导向策略适用于高精度要求任务
            if task.priority in [TaskPriority.CRITICAL, TaskPriority.HIGH]:
                score += 0.8
            else:
                score += 0.5

        # 基于历史表现调整分数
        historical_performance = self._get_strategy_historical_performance(strategy)
        score *= (0.7 + historical_performance * 0.3)  # 30%权重给历史表现

        return score

    def _get_strategy_historical_performance(self, strategy: SchedulingStrategy) -> float:
        """获取策略历史表现"""
        strategy_history = [record for record in self.scheduling_history
                           if record.get("strategy") == strategy.value]

        if not strategy_history:
            return 0.5  # 默认中性表现

        # 计算平均置信度作为历史表现指标
        confidences = [record.get("confidence_score", 0.5) for record in strategy_history
                      if "confidence_score" in record]

        return np.mean(confidences) if confidences else 0.5

    async def _generate_scheduling_decision(self, task: CollaborationTask,
                                           strategy: SchedulingStrategy) -> Optional[SchedulingDecision]:
        """生成调度决策"""
        try:
            # 预测执行时间
            estimated_duration = await self._predict_execution_time(task, strategy)

            # 选择最优Agent组合
            optimal_agents = await self._select_optimal_agents_for_strategy(task, strategy)

            if not optimal_agents:
                self.logger.warning("No suitable agents found for task: {}".format(task.task_id))
                return None

            # 计算调度时间
            scheduled_start_time = await self._calculate_optimal_start_time(task, optimal_agents, strategy)
            estimated_completion_time = scheduled_start_time + estimated_duration

            # 计算优化目标
            optimization_objectives = await self._calculate_optimization_objectives(task, optimal_agents, strategy)

            # 计算置信度
            confidence_score = await self._calculate_scheduling_confidence(task, optimal_agents, strategy)

            # 预测协同效应
            expected_synergy = await self._predict_collaboration_synergy(optimal_agents, task)

            # 资源分配
            resource_allocation = await self._allocate_resources(task, optimal_agents, strategy)

            # 检查约束满足情况
            constraints_satisfied = await self._check_constraints_satisfaction(task, optimal_agents, strategy)

            decision = SchedulingDecision(
                task_id=task.task_id,
                assigned_agents=optimal_agents,
                scheduled_start_time=scheduled_start_time,
                estimated_completion_time=estimated_completion_time,
                scheduling_strategy=strategy,
                confidence_score=confidence_score,
                optimization_objectives=optimization_objectives,
                constraints_satisfied=constraints_satisfied,
                expected_synergy_score=expected_synergy,
                resource_allocation=resource_allocation
            )

            return decision

        except Exception as e:
            self.logger.error("Error generating scheduling decision for task {}: {}".format(
                task.task_id, str(e)))
            return None

    async def _predict_execution_time(self, task: CollaborationTask, strategy: SchedulingStrategy) -> timedelta:
        """预测执行时间"""
        try:
            # 基于任务复杂度确定基础时间
            complexity_level = len(task.required_capabilities)
            if complexity_level <= 1:
                base_time = self.execution_time_predictor["base_times"]["simple_task"]
            elif complexity_level <= 3:
                base_time = self.execution_time_predictor["base_times"]["moderate_task"]
            elif complexity_level <= 5:
                base_time = self.execution_time_predictor["base_times"]["complex_task"]
            else:
                base_time = self.execution_time_predictor["base_times"]["very_complex_task"]

            # 应用策略倍数
            strategy_multipliers = {
                SchedulingStrategy.PRIORITY_FIRST: 0.8,  # 快速执行
                SchedulingStrategy.CAPABILITY_MATCH: 1.0,
                SchedulingStrategy.WORKLOAD_BALANCE: 1.1,
                SchedulingStrategy.SYNERGY_MAXIMIZE: 1.2,
                SchedulingStrategy.DEADLINE_AWARE: 0.9,
                SchedulingStrategy.COST_OPTIMAL: 1.3,
                SchedulingStrategy.QUALITY_FOCUSED: 1.4
            }

            multiplier = strategy_multipliers.get(strategy, 1.0)

            # 应用其他倍数
            multipliers = self.execution_time_predictor["multipliers"]
            total_multiplier = multiplier

            if task.collaboration_type in [CollaborationType.PARALLEL, CollaborationType.SWARM]:
                total_multiplier *= multipliers["collaboration_overhead"]

            # 小红书特定调整
            xiaohongshu_config = self.xiaohongshu_scheduling_config
            for capability in task.required_capabilities:
                if capability in xiaohongshu_config.get("resource_requirements", {}):
                    total_multiplier *= 1.1

            estimated_seconds = int(base_time * total_multiplier)
            return timedelta(seconds=estimated_seconds)

        except Exception as e:
            self.logger.error("Error predicting execution time: {}".format(str(e)))
            return timedelta(minutes=30)  # 默认30分钟

    async def _select_optimal_agents_for_strategy(self, task: CollaborationTask,
                                                strategy: SchedulingStrategy) -> List[str]:
        """为策略选择最优Agent"""
        try:
            available_agents = list(self.agent_workload.keys())

            if not available_agents:
                return []

            # 根据策略选择Agent
            if strategy == SchedulingStrategy.CAPABILITY_MATCH:
                return await self._select_agents_by_capability_match(task, available_agents)
            elif strategy == SchedulingStrategy.WORKLOAD_BALANCE:
                return await self._select_agents_by_workload_balance(task, available_agents)
            elif strategy == SchedulingStrategy.SYNERGY_MAXIMIZE:
                return await self._select_agents_by_synergy(task, available_agents)
            elif strategy == SchedulingStrategy.COST_OPTIMAL:
                return await self._select_agents_by_cost_efficiency(task, available_agents)
            elif strategy == SchedulingStrategy.QUALITY_FOCUSED:
                return await self._select_agents_by_quality(task, available_agents)
            else:  # PRIORITY_FIRST or DEADLINE_AWARE
                return await self._select_agents_by_availability(task, available_agents)

        except Exception as e:
            self.logger.error("Error selecting optimal agents: {}".format(str(e)))
            return []

    async def _select_agents_by_capability_match(self, task: CollaborationTask, available_agents: List[str]) -> List[str]:
        """根据能力匹配选择Agent"""
        required_capabilities = set(task.required_capabilities)
        best_agents = []

        for agent_id in available_agents:
            agent_capabilities = self.agent_capabilities.get(agent_id, set())
            capability_match = len(required_capabilities.intersection(agent_capabilities)) / len(required_capabilities)

            if capability_match > 0.7:  # 至少70%能力匹配
                best_agents.append((agent_id, capability_match))

        # 按匹配度排序
        best_agents.sort(key=lambda x: x[1], reverse=True)

        # 返回匹配度最高的Agent
        return [agent[0] for agent in best_agents[:3]] if best_agents else available_agents[:1]

    async def _select_agents_by_workload_balance(self, task: CollaborationTask, available_agents: List[str]) -> List[str]:
        """根据工作负载平衡选择Agent"""
        # 按当前工作负载排序，选择负载最低的Agent
        agent_workloads = [(agent_id, self.agent_workload[agent_id]) for agent_id in available_agents]
        agent_workloads.sort(key=lambda x: x[1])

        return [agent[0] for agent in agent_workloads[:2]]

    async def _select_agents_by_synergy(self, task: CollaborationTask, available_agents: List[str]) -> List[str]:
        """根据协同效应选择Agent"""
        # 对于协同效应最大化，需要考虑Agent之间的配合
        if len(available_agents) < 2:
            return available_agents[:1]

        best_combination = []
        best_synergy = 0.0

        # 简化实现：检查前几个Agent的组合
        for i, agent1 in enumerate(available_agents[:5]):
            for agent2 in available_agents[i+1:i+6]:
                synergy_score = await self._predict_collaboration_synergy([agent1, agent2], task)
                if synergy_score > best_synergy:
                    best_synergy = synergy_score
                    best_combination = [agent1, agent2]

        return best_combination if best_combination else available_agents[:2]

    async def _select_agents_by_cost_efficiency(self, task: CollaborationTask, available_agents: List[str]) -> List[str]:
        """根据成本效率选择Agent"""
        # 简化实现：选择工作负载较低的Agent（假设成本与资源使用相关）
        return await self._select_agents_by_workload_balance(task, available_agents)

    async def _select_agents_by_quality(self, task: CollaborationTask, available_agents: List[str]) -> List[str]:
        """根据质量选择Agent"""
        # 简化实现：基于历史成功率选择Agent
        agent_success_rates = []

        for agent_id in available_agents:
            # 模拟成功率计算
            success_rate = 0.7 + np.random.normal(0, 0.1)
            success_rate = max(0.5, min(1.0, success_rate))
            agent_success_rates.append((agent_id, success_rate))

        # 按成功率排序
        agent_success_rates.sort(key=lambda x: x[1], reverse=True)

        return [agent[0] for agent in agent_success_rates[:2]]

    async def _select_agents_by_availability(self, task: CollaborationTask, available_agents: List[str]) -> List[str]:
        """根据可用性选择Agent"""
        # 选择当前工作负载最低且可用的Agent
        available_now = []

        for agent_id in available_agents:
            # 检查Agent是否可用
            if self.agent_workload[agent_id] < 5:  # 假设最大负载为5
                available_now.append(agent_id)

        if not available_now:
            available_now = available_agents

        # 按工作负载排序
        available_now.sort(key=lambda aid: self.agent_workload[aid])

        return available_now[:1]

    async def _calculate_optimal_start_time(self, task: CollaborationTask, agents: List[str],
                                           strategy: SchedulingStrategy) -> datetime:
        """计算最优开始时间"""
        current_time = datetime.now()

        # 对于优先级优先策略，立即开始
        if strategy == SchedulingStrategy.PRIORITY_FIRST:
            return current_time

        # 对于工作负载平衡策略，等待负载较低的时段
        if strategy == SchedulingStrategy.WORKLOAD_BALANCE:
            max_workload = max(self.agent_workload[aid] for aid in agents) if agents else 0
            if max_workload > 3:  # 负载较高，延迟开始
                return current_time + timedelta(minutes=15)
            return current_time

        # 对于截止时间感知策略，确保有足够时间完成
        if strategy == SchedulingStrategy.DEADLINE_AWARE:
            return current_time  # 简化实现，实际应考虑截止时间

        # 默认立即开始
        return current_time

    async def _calculate_optimization_objectives(self, task: CollaborationTask, agents: List[str],
                                                strategy: SchedulingStrategy) -> Dict[str, float]:
        """计算优化目标"""
        objectives = {}

        # 完成时间目标
        estimated_duration = await self._predict_execution_time(task, strategy)
        objectives["completion_time"] = 1.0 / (estimated_duration.total_seconds() / 3600)  # 小时的倒数

        # 质量目标
        avg_agent_quality = 0.8  # 简化实现
        objectives["quality"] = avg_agent_quality

        # 协同效应目标
        synergy_score = await self._predict_collaboration_synergy(agents, task)
        objectives["synergy"] = synergy_score

        # 资源效率目标
        avg_workload = np.mean([self.agent_workload[aid] for aid in agents]) if agents else 0
        objectives["resource_efficiency"] = 1.0 - (avg_workload / 5)  # 假设最大负载为5

        # 成本目标
        objectives["cost"] = 1.0 / (len(agents) + 1)  # Agent越少成本越低

        return objectives

    async def _calculate_scheduling_confidence(self, task: CollaborationTask, agents: List[str],
                                             strategy: SchedulingStrategy) -> float:
        """计算调度置信度"""
        confidence_factors = []

        # Agent可用性置信度
        availability_confidence = 1.0
        for agent_id in agents:
            if self.agent_workload.get(agent_id, 0) > 4:
                availability_confidence *= 0.8
        confidence_factors.append(availability_confidence)

        # 策略适用性置信度
        strategy_score = await self._evaluate_strategy_for_task(task, strategy)
        confidence_factors.append(strategy_score / 100)

        # 历史表现置信度
        historical_performance = self._get_strategy_historical_performance(strategy)
        confidence_factors.append(historical_performance)

        # 资源充足性置信度
        resource_confidence = 0.9  # 简化实现
        confidence_factors.append(resource_confidence)

        return np.mean(confidence_factors)

    async def _predict_collaboration_synergy(self, agents: List[str], task: CollaborationTask) -> float:
        """预测协作协同效应"""
        if len(agents) < 2:
            return 0.5

        # 基础协同分数
        base_synergy = self.synergy_predictor["base_synergy"]

        # 能力互补性加分
        all_capabilities = set()
        for agent_id in agents:
            all_capabilities.update(self.agent_capabilities.get(agent_id, set()))

        capability_bonus = min(0.2, len(all_capabilities) / 20)

        # 工作负载平衡加分
        workloads = [self.agent_workload.get(aid, 0) for aid in agents]
        workload_balance = 1.0 - (np.std(workloads) / (np.mean(workloads) + 1e-6))
        workload_bonus = workload_balance * 0.15

        # 协作类型适配加分
        collaboration_bonus = 0.0
        if task.collaboration_type == CollaborationType.PARALLEL and len(agents) > 2:
            collaboration_bonus = 0.1
        elif task.collaboration_type == CollaborationType.SYNERGY_MAXIMIZE:
            collaboration_bonus = 0.15

        total_synergy = base_synergy + capability_bonus + workload_bonus + collaboration_bonus
        return min(1.0, total_synergy)

    async def _allocate_resources(self, task: CollaborationTask, agents: List[str],
                               strategy: SchedulingStrategy) -> Dict[str, Any]:
        """分配资源"""
        allocation = {
            "cpu_allocation": {},
            "memory_allocation": {},
            "task_slots": {},
            "collaboration_channels": [],
            "monitoring_level": "standard"
        }

        # 为每个Agent分配资源
        for agent_id in agents:
            allocation["cpu_allocation"][agent_id] = 0.8  # 80% CPU
            allocation["memory_allocation"][agent_id] = 1024  # 1GB内存
            allocation["task_slots"][agent_id] = 1

        # 协作通道
        if len(agents) > 1:
            allocation["collaboration_channels"] = [
                f"channel_{i}_{j}" for i in range(len(agents)) for j in range(i+1, len(agents))
            ]

        # 监控级别
        if task.priority in [TaskPriority.CRITICAL, TaskPriority.HIGH]:
            allocation["monitoring_level"] = "intensive"

        return allocation

    async def _check_constraints_satisfaction(self, task: CollaborationTask, agents: List[str],
                                            strategy: SchedulingStrategy) -> List[str]:
        """检查约束满足情况"""
        satisfied_constraints = []

        # 基础约束：能力覆盖
        required_capabilities = set(task.required_capabilities)
        available_capabilities = set()
        for agent_id in agents:
            available_capabilities.update(self.agent_capabilities.get(agent_id, set()))

        if required_capabilities.issubset(available_capabilities):
            satisfied_constraints.append("capability_coverage")

        # 资源约束
        total_workload = sum(self.agent_workload.get(aid, 0) for aid in agents)
        if total_workload < len(agents) * 4:  # 假设每个Agent最大负载为4
            satisfied_constraints.append("resource_availability")

        # 协作约束
        if len(agents) >= 2 or task.collaboration_type == CollaborationType.SEQUENTIAL:
            satisfied_constraints.append("collaboration_feasibility")

        return satisfied_constraints

    async def _execute_scheduled_tasks(self) -> None:
        """执行调度队列中的任务"""
        while self.execution_queue:
            task_id = self.execution_queue.popleft()

            if task_id not in self.scheduled_tasks:
                continue

            decision = self.scheduled_tasks[task_id]

            # 检查是否到了执行时间
            if datetime.now() >= decision.scheduled_start_time:
                try:
                    # 更新Agent工作负载
                    for agent_id in decision.assigned_agents:
                        self.agent_workload[agent_id] += 1

                    # 执行任务（这里应该调用实际的执行逻辑）
                    self.logger.info("Executing task: {} with agents: {}".format(
                        task_id, decision.assigned_agents))

                    # 模拟任务执行
                    await asyncio.sleep(1)

                    # 任务完成，更新状态
                    self.completed_tasks.append(task_id)
                    del self.scheduled_tasks[task_id]

                    # 更新Agent工作负载
                    for agent_id in decision.assigned_agents:
                        self.agent_workload[agent_id] -= 1

                    # 记录性能指标
                    actual_duration = (datetime.now() - decision.scheduled_start_time).total_seconds()
                    self.performance_metrics["execution_time"].append(actual_duration)
                    self.performance_metrics["synergy_score"].append(decision.expected_synergy_score)

                except Exception as e:
                    self.logger.error("Error executing task {}: {}".format(task_id, str(e)))
                    # 任务失败，清理资源
                    for agent_id in decision.assigned_agents:
                        self.agent_workload[agent_id] -= 1
            else:
                # 还未到执行时间，重新放回队列
                self.execution_queue.appendleft(task_id)
                break

    async def _update_resource_utilization(self) -> None:
        """更新资源利用率"""
        current_time = datetime.now()

        for agent_id, workload in self.agent_workload.items():
            if agent_id not in self.resource_utilization:
                self.resource_utilization[agent_id] = ResourceUtilization(
                    agent_id=agent_id,
                    cpu_utilization=0.0,
                    memory_utilization=0.0,
                    task_utilization=workload / 5.0,  # 假设最大负载为5
                    collaboration_load=0.0,
                    availability_window=(current_time, current_time + timedelta(hours=24))
                )
            else:
                self.resource_utilization[agent_id].task_utilization = workload / 5.0
                # 添加历史趋势
                self.resource_utilization[agent_id].utilization_trend.append(workload / 5.0)
                if len(self.resource_utilization[agent_id].utilization_trend) > 100:
                    self.resource_utilization[agent_id].utilization_trend.pop(0)

    async def _reschedule_overdue_tasks(self) -> None:
        """重新调度过期任务"""
        current_time = datetime.now()
        overdue_tasks = []

        for task_id, decision in self.scheduled_tasks.items():
            # 检查是否超过预估完成时间
            if current_time > decision.estimated_completion_time + timedelta(minutes=30):
                overdue_tasks.append(task_id)

        for task_id in overdue_tasks:
            # 重新调度过期任务
            self.logger.warning("Rescheduling overdue task: {}".format(task_id))

            # 清理当前调度
            del self.scheduled_tasks[task_id]

            # 重新加入优先级队列
            # 这里需要重新构造task对象，简化实现
            # await self.submit_task(task, constraints=task.constraints, preferred_strategy=task.preferred_strategy)

    async def get_scheduler_status(self) -> Dict[str, Any]:
        """获取调度器状态"""
        return {
            "scheduler_status": "running" if self.background_scheduler_task else "stopped",
            "queue_length": len(self.priority_queue),
            "scheduled_tasks": len(self.scheduled_tasks),
            "execution_queue_length": len(self.execution_queue),
            "completed_tasks": len(self.completed_tasks),
            "agent_count": len(self.agent_workload),
            "average_workload": np.mean(list(self.agent_workload.values())) if self.agent_workload else 0,
            "resource_utilization": {
                agent_id: {
                    "task_utilization": ru.task_utilization,
                    "utilization_trend": np.mean(ru.utilization_trend) if ru.utilization_trend else 0
                }
                for agent_id, ru in self.resource_utilization.items()
            },
            "performance_metrics": {
                key: {
                    "average": np.mean(values) if values else 0,
                    "latest": values[-1] if values else 0,
                    "count": len(values)
                }
                for key, values in self.performance_metrics.items()
            }
        }