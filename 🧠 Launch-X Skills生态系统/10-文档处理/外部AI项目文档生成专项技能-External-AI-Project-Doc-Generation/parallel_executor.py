"""
并行执行引擎模块
==============

基于AI项目档案管理工作流v2.4-完整版的要求，
实现高效的并行工具执行引擎，支持任务编排、结果聚合和错误处理。

Author: LaunchX Claude Team
Version: 1.0.0
Created: 2025-01-18
"""

import asyncio
import concurrent.futures
import logging
import threading
import time
from typing import Dict, List, Any, Optional, Union, Callable, Tuple
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta
from enum import Enum
from queue import Queue, PriorityQueue
import uuid
import json

from mcp_integration import MCPIntegrationCore, MCPExecutionResult, MCPExecutionResult as MCPResult
from rube_tools import RUBEToolsManager, RUBEToolConfig, RUBEMultiExecuteConfig


class TaskStatus(Enum):
    """任务状态枚举"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    TIMEOUT = "timeout"


class TaskPriority(Enum):
    """任务优先级枚举"""
    LOW = 1
    NORMAL = 2
    HIGH = 3
    CRITICAL = 4


@dataclass
class ParallelTask:
    """并行任务"""
    task_id: str
    tool_slug: str
    arguments: Dict[str, Any]
    priority: TaskPriority
    timeout: int = 30
    retry_count: int = 0
    max_retries: int = 3
    status: TaskStatus = TaskStatus.PENDING
    created_at: datetime = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    execution_time: float = 0.0
    dependencies: List[str] = None

    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now()
        if self.dependencies is None:
            self.dependencies = []


@dataclass
class ExecutionPlan:
    """执行计划"""
    plan_id: str
    tasks: List[ParallelTask]
    parallel_limit: int = 3
    continue_on_error: bool = True
    max_execution_time: int = 300  # 5分钟
    created_at: datetime = None

    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now()


@dataclass
class ExecutionSummary:
    """执行摘要"""
    plan_id: str
    total_tasks: int
    completed_tasks: int
    failed_tasks: int
    cancelled_tasks: int
    timeout_tasks: int
    total_execution_time: float
    success_rate: float
    results: List[Dict[str, Any]]
    errors: List[str]
    start_time: datetime
    end_time: datetime


class TaskDependencyResolver:
    """任务依赖解析器"""

    def __init__(self):
        self.logger = self._setup_logger()

    def _setup_logger(self) -> logging.Logger:
        """设置日志记录器"""
        logger = logging.getLogger("TaskDependencyResolver")
        logger.setLevel(logging.DEBUG)

        if not logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            )
            handler.setFormatter(formatter)
            logger.addHandler(handler)

        return logger

    def resolve_dependencies(self, tasks: List[ParallelTask]) -> List[List[str]]:
        """
        解析任务依赖关系，返回执行层级

        Args:
            tasks: 任务列表

        Returns:
            List[List[str]]: 每一层可并行执行的任务ID列表
        """
        # 构建依赖图
        task_map = {task.task_id: task for task in tasks}
        dependency_graph = {}
        in_degree = {}

        # 初始化图
        for task in tasks:
            dependency_graph[task.task_id] = task.dependencies
            in_degree[task.task_id] = len(task.dependencies)

        # 拓扑排序
        execution_levels = []
        remaining_tasks = set(task_map.keys())

        while remaining_tasks:
            current_level = []

            # 找到当前可以执行的任务（无依赖或依赖已完成）
            for task_id in list(remaining_tasks):
                if in_degree[task_id] == 0:
                    current_level.append(task_id)

            if not current_level:
                # 检测循环依赖
                remaining_list = list(remaining_tasks)
                raise ValueError(f"检测到循环依赖，剩余任务: {remaining_list}")

            execution_levels.append(current_level)

            # 更新剩余任务的入度
            for task_id in current_level:
                remaining_tasks.remove(task_id)

                # 更新依赖此任务的其他任务
                for dependent_id, deps in dependency_graph.items():
                    if task_id in deps:
                        in_degree[dependent_id] -= 1

        self.logger.info(f"依赖解析完成，共{len(execution_levels)}个执行层级")
        return execution_levels


class ParallelExecutor:
    """并行执行引擎"""

    def __init__(
        self,
        mcp_integration: Optional[MCPIntegrationCore] = None,
        rube_tools: Optional[RUBEToolsManager] = None,
        max_workers: int = 3
    ):
        """
        初始化并行执行引擎

        Args:
            mcp_integration: MCP集成实例
            rube_tools: RUBE工具管理器
            max_workers: 最大工作线程数
        """
        self.mcp = mcp_integration
        self.rube_tools = rube_tools
        self.max_workers = max_workers
        self.logger = self._setup_logger()
        self.dependency_resolver = TaskDependencyResolver()
        self.execution_history: List[ExecutionSummary] = []

        # 执行状态
        self.is_running = False
        self.current_execution: Optional[ExecutionPlan] = None
        self.execution_thread: Optional[threading.Thread] = None

    def _setup_logger(self) -> logging.Logger:
        """设置日志记录器"""
        logger = logging.getLogger("ParallelExecutor")
        logger.setLevel(logging.INFO)

        if not logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            )
            handler.setFormatter(formatter)
            logger.addHandler(handler)

        return logger

    async def execute_task(self, task: ParallelTask) -> ParallelTask:
        """
        执行单个任务

        Args:
            task: 要执行的任务

        Returns:
            ParallelTask: 执行后的任务状态
        """
        self.logger.info(f"开始执行任务: {task.task_id} ({task.tool_slug})")

        task.status = TaskStatus.RUNNING
        task.started_at = datetime.now()

        try:
            # 选择执行器
            if self.rube_tools and task.tool_slug.startswith("RUBE_"):
                # 使用RUBE工具执行
                result = await self._execute_rube_task(task)
            else:
                # 使用通用MCP工具执行
                result = await self._execute_mcp_task(task)

            # 更新任务状态
            task.status = TaskStatus.COMPLETED
            task.result = result
            task.error = None

        except asyncio.TimeoutError:
            task.status = TaskStatus.TIMEOUT
            task.error = f"任务执行超时 ({task.timeout}s)"
            self.logger.warning(f"任务超时: {task.task_id}")

        except Exception as e:
            task.status = TaskStatus.FAILED
            task.error = str(e)
            self.logger.error(f"任务执行失败: {task.task_id}, 错误: {str(e)}")

        finally:
            task.completed_at = datetime.now()
            if task.started_at:
                task.execution_time = (task.completed_at - task.started_at).total_seconds()

        self.logger.info(f"任务执行完成: {task.task_id}, 状态: {task.status.value}")
        return task

    async def _execute_rube_task(self, task: ParallelTask) -> Dict[str, Any]:
        """执行RUBE任务"""
        if not self.rube_tools:
            raise RuntimeError("RUBE工具管理器未初始化")

        if task.tool_slug == "RUBE_SEARCH_TOOLS":
            result = await self.rube_tools.rube_search_tools(**task.arguments)
            return asdict(result)

        elif task.tool_slug == "RUBE_MULTI_EXECUTE_TOOL":
            # 将arguments转换为RUBEMultiExecuteConfig
            tools_config = [
                RUBEToolConfig(**tool_config)
                for tool_config in task.arguments.get("tools", [])
            ]
            config = RUBEMultiExecuteConfig(
                tools=tools_config,
                session_id=task.arguments.get("session", {}).get("id"),
                memory=task.arguments.get("memory"),
                parallel_limit=task.arguments.get("parallel_limit", 3)
            )
            result = await self.rube_tools.rube_multi_execute_tool(**asdict(config))
            return asdict(result)

        elif task.tool_slug == "RUBE_REMOTE_WORKBENCH":
            result = await self.rube_tools.rube_remote_workbench(**task.arguments)
            return asdict(result)

        else:
            raise ValueError(f"未知的RUBE工具: {task.tool_slug}")

    async def _execute_mcp_task(self, task: ParallelTask) -> Dict[str, Any]:
        """执行通用MCP任务"""
        if not self.mcp:
            raise RuntimeError("MCP集成实例未初始化")

        result = await self.mcp.execute_tool(
            tool_slug=task.tool_slug,
            parameters=task.arguments,
            timeout=task.timeout
        )

        return {
            "status": result.status.value,
            "data": result.data,
            "error": result.error,
            "execution_time": result.execution_time,
            "session_id": result.session_id
        }

    async def execute_parallel_tasks(
        self,
        tasks: List[ParallelTask],
        parallel_limit: Optional[int] = None,
        continue_on_error: bool = True,
        timeout: Optional[int] = None
    ) -> ExecutionSummary:
        """
        并行执行多个任务

        Args:
            tasks: 要执行的任务列表
            parallel_limit: 并行限制
            continue_on_error: 遇到错误是否继续
            timeout: 总超时时间

        Returns:
            ExecutionSummary: 执行摘要
        """
        if not tasks:
            raise ValueError("任务列表不能为空")

        parallel_limit = parallel_limit or self.max_workers
        timeout = timeout or 300  # 默认5分钟

        # 创建执行计划
        plan = ExecutionPlan(
            plan_id=str(uuid.uuid4()),
            tasks=tasks,
            parallel_limit=parallel_limit,
            continue_on_error=continue_on_error,
            max_execution_time=timeout
        )

        self.logger.info(f"开始并行执行计划: {plan.plan_id}, 任务数: {len(tasks)}")

        start_time = datetime.now()

        try:
            # 解析任务依赖
            execution_levels = self.dependency_resolver.resolve_dependencies(tasks)
            self.logger.info(f"任务依赖解析完成，共{len(execution_levels)}个执行层级")

            # 按层级执行任务
            all_results = []
            all_errors = []

            for level_idx, level_tasks in enumerate(execution_levels):
                self.logger.info(f"执行第{level_idx + 1}层级，任务数: {len(level_tasks)}")

                # 获取当前层级的任务对象
                current_tasks = [
                    task for task in tasks
                    if task.task_id in level_tasks
                ]

                # 并行执行当前层级任务
                level_results = await self._execute_task_level(
                    current_tasks,
                    parallel_limit,
                    continue_on_error
                )

                all_results.extend(level_results)

                # 检查是否有失败的任务（如果continue_on_error=False）
                if not continue_on_error:
                    failed_tasks = [t for t in current_tasks if t.status == TaskStatus.FAILED]
                    if failed_tasks:
                        error_msg = f"第{level_idx + 1}层级有任务失败，停止执行"
                        self.logger.error(error_msg)
                        all_errors.append(error_msg)
                        break

        except Exception as e:
            self.logger.error(f"并行执行计划失败: {str(e)}")
            all_errors.append(str(e))

        end_time = datetime.now()
        total_time = (end_time - start_time).total_seconds()

        # 生成执行摘要
        summary = self._generate_execution_summary(plan, all_results, all_errors, start_time, end_time)
        self.execution_history.append(summary)

        self.logger.info(f"并行执行计划完成: {plan.plan_id}, 成功率: {summary.success_rate:.1f}%")
        return summary

    async def _execute_task_level(
        self,
        tasks: List[ParallelTask],
        parallel_limit: int,
        continue_on_error: bool
    ) -> List[ParallelTask]:
        """执行一个层级的任务"""
        semaphore = asyncio.Semaphore(parallel_limit)

        async def execute_with_semaphore(task: ParallelTask):
            async with semaphore:
                return await self.execute_task(task)

        # 并行执行所有任务
        tasks_with_semaphore = [execute_with_semaphore(task) for task in tasks]
        results = await asyncio.gather(*tasks_with_semaphore, return_exceptions=True)

        # 处理异常结果
        processed_results = []
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                tasks[i].status = TaskStatus.FAILED
                tasks[i].error = str(result)
                if not continue_on_error:
                    raise result
            processed_results.append(tasks[i])

        return processed_results

    def _generate_execution_summary(
        self,
        plan: ExecutionPlan,
        results: List[ParallelTask],
        errors: List[str],
        start_time: datetime,
        end_time: datetime
    ) -> ExecutionSummary:
        """生成执行摘要"""
        completed_tasks = len([r for r in results if r.status == TaskStatus.COMPLETED])
        failed_tasks = len([r for r in results if r.status == TaskStatus.FAILED])
        cancelled_tasks = len([r for r in results if r.status == TaskStatus.CANCELLED])
        timeout_tasks = len([r for r in results if r.status == TaskStatus.TIMEOUT])

        total_execution_time = (end_time - start_time).total_seconds()
        success_rate = (completed_tasks / len(plan.tasks)) * 100 if plan.tasks else 0

        # 整理结果
        task_results = []
        for task in results:
            task_results.append({
                "task_id": task.task_id,
                "tool_slug": task.tool_slug,
                "status": task.status.value,
                "execution_time": task.execution_time,
                "result": task.result,
                "error": task.error
            })

        return ExecutionSummary(
            plan_id=plan.plan_id,
            total_tasks=len(plan.tasks),
            completed_tasks=completed_tasks,
            failed_tasks=failed_tasks,
            cancelled_tasks=cancelled_tasks,
            timeout_tasks=timeout_tasks,
            total_execution_time=total_execution_time,
            success_rate=success_rate,
            results=task_results,
            errors=errors,
            start_time=start_time,
            end_time=end_time
        )

    def create_execution_plan_from_config(
        self,
        config: RUBEMultiExecuteConfig
    ) -> ExecutionPlan:
        """
        从配置创建执行计划

        Args:
            config: RUBE多工具执行配置

        Returns:
            ExecutionPlan: 执行计划
        """
        tasks = []

        for i, tool_config in enumerate(config.tools):
            task = ParallelTask(
                task_id=f"{config.session_id or 'plan'}_task_{i}",
                tool_slug=tool_config.tool_slug,
                arguments=tool_config.arguments,
                priority=TaskPriority(tool_config.priority),
                timeout=tool_config.timeout or 30,
                max_retries=3
            )
            tasks.append(task)

        return ExecutionPlan(
            plan_id=config.session_id or str(uuid.uuid4()),
            tasks=tasks,
            parallel_limit=config.parallel_limit,
            continue_on_error=True
        )

    def get_execution_statistics(self) -> Dict[str, Any]:
        """获取执行统计信息"""
        if not self.execution_history:
            return {
                "total_executions": 0,
                "average_success_rate": 0.0,
                "total_tasks_executed": 0,
                "average_execution_time": 0.0
            }

        total_executions = len(self.execution_history)
        total_tasks = sum(summary.total_tasks for summary in self.execution_history)
        total_completed = sum(summary.completed_tasks for summary in self.execution_history)
        total_time = sum(summary.total_execution_time for summary in self.execution_history)

        average_success_rate = sum(summary.success_rate for summary in self.execution_history) / total_executions
        average_execution_time = total_time / total_executions

        return {
            "total_executions": total_executions,
            "average_success_rate": average_success_rate,
            "total_tasks_executed": total_tasks,
            "total_tasks_completed": total_completed,
            "average_execution_time": average_execution_time,
            "recent_executions": [
                {
                    "plan_id": summary.plan_id,
                    "success_rate": summary.success_rate,
                    "execution_time": summary.total_execution_time,
                    "timestamp": summary.end_time.isoformat()
                }
                for summary in self.execution_history[-5:]
            ]
        }

    def export_execution_report(self, output_path: str, plan_id: Optional[str] = None):
        """导出执行报告"""
        if plan_id:
            summaries = [s for s in self.execution_history if s.plan_id == plan_id]
            if not summaries:
                raise ValueError(f"未找到执行计划: {plan_id}")
        else:
            summaries = self.execution_history

        report_data = {
            "report_generated_at": datetime.now().isoformat(),
            "filter_plan_id": plan_id,
            "execution_count": len(summaries),
            "executions": [
                {
                    "plan_id": summary.plan_id,
                    "total_tasks": summary.total_tasks,
                    "completed_tasks": summary.completed_tasks,
                    "failed_tasks": summary.failed_tasks,
                    "success_rate": summary.success_rate,
                    "total_execution_time": summary.total_execution_time,
                    "start_time": summary.start_time.isoformat(),
                    "end_time": summary.end_time.isoformat(),
                    "detailed_results": summary.results,
                    "errors": summary.errors
                }
                for summary in summaries
            ]
        }

        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(report_data, f, ensure_ascii=False, indent=2)

        self.logger.info(f"执行报告已导出到: {output_path}")


# 全局并行执行器实例
_parallel_executor: Optional[ParallelExecutor] = None


def get_parallel_executor(
    mcp_integration: Optional[MCPIntegrationCore] = None,
    rube_tools: Optional[RUBEToolsManager] = None,
    max_workers: int = 3
) -> ParallelExecutor:
    """获取全局并行执行器实例"""
    global _parallel_executor

    if _parallel_executor is None:
        _parallel_executor = ParallelExecutor(mcp_integration, rube_tools, max_workers)

    return _parallel_executor


def init_parallel_executor(
    mcp_integration: Optional[MCPIntegrationCore] = None,
    rube_tools: Optional[RUBEToolsManager] = None,
    max_workers: int = 3
) -> ParallelExecutor:
    """初始化并行执行器"""
    global _parallel_executor
    _parallel_executor = ParallelExecutor(mcp_integration, rube_tools, max_workers)
    return _parallel_executor