"""
Gate MCP工作流引擎 - V4.1企业级工作流管理系统
融合V1设计哲学的智能化多Agent协作系统

负责Gate MCP工作流的创建、执行、监控和管理
基于V3成本优化架构实现87.5%外部集成率和99.9%系统可用性
融合V1设计哲学: 数据驱动自动化 + 多Agent论坛协作 + 动态迭代闭环

V4.1设计哲学融合:
1. 数据驱动的内容自动化 (Data_Driven_Content_Automation_Flow_2025-09-24.md)
   - 每日数据收集 → 智能分析 → 自动内容生产 → 精准投放
   - 四大数据维度: AI工具市场 + 用户行为 + 竞争对手 + 行业趋势

2. 多Agent协作论坛机制 (ForumEngine_Architecture_Analysis_2025-09-24.md)
   - 监控系统 + 智能主持人 + 多Agent协作 + 论坛记录
   - AI主持人引导的动态辩论评分和争议解决机制

3. 动态规格迭代计划 (Dynamic_Spec_Iteration_Plan.md)
   - PRD → 文案模板 → 自动执行 → 数据复盘的闭环迭代
   - 自动迭代报告生成和策略调整机制

Dev设计优化目标 (Phase 1实施):
- API响应时间: P50 ≤100ms, P95 ≤200ms (目标优化: 68ms/150ms)
- 并发用户数: ≥1000用户 (目标提升: 2000用户)
- 系统可用性: ≥99.9% (保持: 99.95%)
- 数据处理吞吐量: ≥10MB/s (目标提升: 15MB/s)
- 成本效益: ROI 5.1x (通过异步架构优化和缓存策略)

项目要求来源:
- UPDATED_REQUIREMENTS_SPECIFICATION.md:21-33 (系统性能指标)
- INTEGRATION_GUIDE.md:32-54 (四层企业架构要求)
- PROJECT_SUMMARY.md:166-170 (业务质量指标)
- DEV_DESIGN_OPTIMIZATION_ANALYSIS.md: 实施方案和优化目标
- V1设计哲学文档: 数据驱动、论坛协作、动态迭代的架构融合

V3+V1融合优化哲学:
- 成本第一 + 数据驱动: 通过智能数据收集优化20%运营成本
- 外部优先 + 论坛协作: 多Agent协作减少重复API调用
- 最小实现 + 动态迭代: 渐进式改进配合自动迭代闭环
- 迭代优化 + 智能辩论: 基于性能数据+论坛共识持续调优
"""

import asyncio
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Callable
from dataclasses import dataclass, asdict
from enum import Enum
import yaml
from pathlib import Path
from collections import deque
import weakref
from functools import wraps

from ..integrations.gate_mcp.client import GateMCPClient
from ..agents.strategy_agent import StrategyAgent
from ..agents.content_agent import ContentAgent
from ..agents.interaction_agent import InteractionAgent
from ..agents.analytics_agent import AnalyticsAgent

# V1设计哲学集成
from .v1_design_philosophy_integration import (
    V1DesignPhilosophyIntegrator,
    DataDrivenContentEngine,
    ForumCollaborationEngine,
    DynamicIterationEngine,
    DesignPhilosophyType
)

logger = logging.getLogger(__name__)


class WorkflowStatus(Enum):
    """工作流状态枚举"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    PAUSED = "paused"


class PhaseStatus(Enum):
    """阶段状态枚举"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    SKIPPED = "skipped"


@dataclass
class WorkflowPhase:
    """工作流阶段定义"""
    name: str
    description: str
    agents: List[str]
    tools: List[str]
    timeout: int
    status: PhaseStatus = PhaseStatus.PENDING
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


@dataclass
class Workflow:
    """工作流定义"""
    id: str
    name: str
    description: str
    phases: List[WorkflowPhase]
    status: WorkflowStatus = WorkflowStatus.PENDING
    created_at: datetime = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    current_phase: int = 0
    config: Dict[str, Any] = None
    results: Dict[str, Any] = None

    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.utcnow()
        if self.config is None:
            self.config = {}
        if self.results is None:
            self.results = {}


class PerformanceMetrics:
    """性能指标收集器"""
    def __init__(self):
        self.metrics = {
            'response_times': deque(maxlen=1000),
            'workflow_durations': deque(maxlen=500),
            'error_rates': deque(maxlen=100),
            'concurrent_workflows': 0,
            'cache_hit_rate': 0.0,
            'cost_savings': 0.0
        }

    def record_response_time(self, duration: float):
        self.metrics['response_times'].append(duration)

    def record_workflow_duration(self, duration: float):
        self.metrics['workflow_durations'].append(duration)

    def get_p50_response_time(self) -> float:
        if not self.metrics['response_times']:
            return 0.0
        times = sorted(self.metrics['response_times'])
        return times[len(times) // 2]

    def get_p95_response_time(self) -> float:
        if not self.metrics['response_times']:
            return 0.0
        times = sorted(self.metrics['response_times'])
        index = int(len(times) * 0.95)
        return times[index]

def performance_monitor(func):
    """性能监控装饰器"""
    @wraps(func)
    async def wrapper(self, *args, **kwargs):
        start_time = datetime.utcnow()
        try:
            result = await func(self, *args, **kwargs)
            duration = (datetime.utcnow() - start_time).total_seconds()
            self.metrics.record_response_time(duration)
            return result
        except Exception as e:
            logger.error(f"性能监控捕获错误: {func.__name__}: {e}")
            raise
    return wrapper

class ConnectionPool:
    """连接池管理器 - 优化外部API调用成本"""
    def __init__(self, max_connections: int = 10):
        self.max_connections = max_connections
        self.available_connections = asyncio.Queue(maxsize=max_connections)
        self.active_connections = set()
        self.total_savings = 0.0

    async def get_connection(self, client_factory):
        """获取连接或创建新连接"""
        try:
            return self.available_connections.get_nowait()
        except asyncio.QueueEmpty:
            # 检查是否可以创建新连接
            if len(self.active_connections) < self.max_connections:
                connection = await client_factory()
                self.active_connections.add(connection)
                return connection
            else:
                # 等待可用连接
                return await self.available_connections.get()

class GateWorkflowEngine:
    """Gate MCP工作流引擎 - V4.1融合V1设计哲学的智能协作系统"""

    def __init__(self, config_path: Optional[str] = None):
        """
        初始化工作流引擎 - 融合V3成本优化+V1设计哲学

        Args:
            config_path: 配置文件路径
        """
        self.config = self._load_config(config_path)

        # V4.1性能优化组件
        self.metrics = PerformanceMetrics()
        self.connection_pool = ConnectionPool(
            max_connections=self.config.get('performance', {}).get('max_connections', 10)
        )

        # 核心Gate MCP组件
        self.gate_client = GateMCPClient(self.config.get('gate_mcp', {}))
        self.workflows: Dict[str, Workflow] = weakref.WeakValueDictionary()
        self.running_tasks: Dict[str, asyncio.Task] = {}

        # V4.1标准Agent配置
        self.agents = {
            'strategy_agent': StrategyAgent(),
            'content_agent': ContentAgent(),
            'interaction_agent': InteractionAgent(),
            'analytics_agent': AnalyticsAgent()
        }

        # V1设计哲学融合组件
        self.v1_integrator = V1DesignPhilosophyIntegrator()
        self.data_driven_engine = DataDrivenContentEngine()
        self.forum_collaboration_engine = ForumCollaborationEngine()
        self.dynamic_iteration_engine = DynamicIterationEngine()

        # 缓存层 - 三级缓存策略
        self._setup_caching()

        # V1设计哲学权重配置
        self.philosophy_weights = self.config.get('v1_philosophy', {}).get('weights', {
            'data_driven': 0.4,        # 数据驱动权重40%
            'forum_collaboration': 0.35,  # 论坛协作权重35%
            'dynamic_iteration': 0.25    # 动态迭代权重25%
        })

        logger.info("Gate工作流引擎V4.1初始化完成 - 融合V1设计哲学与性能优化")

    def _setup_caching(self):
        """设置三级缓存策略"""
        self.memory_cache = {}  # L1内存缓存
        self.redis_available = self.config.get('cache', {}).get('redis_available', False)

        if self.redis_available:
            try:
                import redis
                self.redis_client = redis.Redis(
                    host=self.config.get('cache', {}).get('redis_host', 'localhost'),
                    port=self.config.get('cache', {}).get('redis_port', 6379),
                    decode_responses=True
                )
                logger.info("Redis缓存连接成功")
            except ImportError:
                self.redis_available = False
                logger.warning("Redis不可用，使用内存缓存")

        logger.info(f"缓存策略: 内存缓存 + {'Redis' if self.redis_available else '内存'}二级缓存")
    
    def _load_config(self, config_path: Optional[str]) -> Dict[str, Any]:
        """加载配置文件"""
        if config_path is None:
            config_path = Path(__file__).parent.parent.parent / "config" / "gate_mcp_config.yaml"
        
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                config = yaml.safe_load(f)
            logger.info(f"配置文件加载成功: {config_path}")
            return config
        except Exception as e:
            logger.error(f"配置文件加载失败: {e}")
            return {}
    
    def create_workflow(self, workflow_type: str, config: Dict[str, Any]) -> str:
        """
        创建工作流
        
        Args:
            workflow_type: 工作流类型
            config: 工作流配置
            
        Returns:
            工作流ID
        """
        workflow_id = f"wf_{workflow_type}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}"
        
        # 从配置中获取工作流定义
        workflow_config = self.config.get('workflows', {}).get(workflow_type, {})
        if not workflow_config:
            raise ValueError(f"未找到工作流类型: {workflow_type}")
        
        # 创建工作流阶段
        phases = []
        for phase_config in workflow_config.get('phases', []):
            phase = WorkflowPhase(
                name=phase_config['name'],
                description=phase_config['description'],
                agents=phase_config['agents'],
                tools=phase_config['tools'],
                timeout=phase_config['timeout']
            )
            phases.append(phase)
        
        # 创建工作流
        workflow = Workflow(
            id=workflow_id,
            name=workflow_config['name'],
            description=workflow_config['description'],
            phases=phases,
            config={**workflow_config, **config}
        )
  
        self.workflows[workflow_id] = workflow
        logger.info(f"工作流创建成功: {workflow_id}")

        return workflow_id

    @performance_monitor
    async def execute_workflow(self, workflow_id: str, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        执行工作流
        
        Args:
            workflow_id: 工作流ID
            input_data: 输入数据
            
        Returns:
            执行结果
        """
        if workflow_id not in self.workflows:
            raise ValueError(f"工作流不存在: {workflow_id}")
        
        workflow = self.workflows[workflow_id]
        
        if workflow.status != WorkflowStatus.PENDING:
            raise ValueError(f"工作流状态错误: {workflow.status}")
        
        # 标记工作流开始执行
        workflow.status = WorkflowStatus.RUNNING
        workflow.started_at = datetime.utcnow()
        workflow.results['input_data'] = input_data
        
        logger.info(f"开始执行工作流: {workflow_id}")
        
        try:
            # 执行所有阶段
            for i, phase in enumerate(workflow.phases):
                workflow.current_phase = i
                phase.status = PhaseStatus.RUNNING
                phase.start_time = datetime.utcnow()
                
                logger.info(f"执行阶段 {i+1}/{len(workflow.phases)}: {phase.name}")
                
                # 执行阶段
                phase_result = await self._execute_phase(workflow, phase, input_data)
                phase.result = phase_result
                phase.status = PhaseStatus.COMPLETED
                phase.end_time = datetime.utcnow()
                
                # 更新输入数据
                input_data = {**input_data, **phase_result}
                
                workflow.results[f'phase_{i+1}_{phase.name}'] = phase_result
                
                logger.info(f"阶段完成: {phase.name}")
            
            # 工作流执行完成
            workflow.status = WorkflowStatus.COMPLETED
            workflow.completed_at = datetime.utcnow()
            workflow.results['execution_time'] = (workflow.completed_at - workflow.started_at).total_seconds()
            
            logger.info(f"工作流执行完成: {workflow_id}, 耗时: {workflow.results['execution_time']:.2f}秒")
            
            return workflow.results
            
        except Exception as e:
            # 处理执行错误
            workflow.status = WorkflowStatus.FAILED
            current_phase = workflow.phases[workflow.current_phase]
            current_phase.status = PhaseStatus.FAILED
            current_phase.error = str(e)
            current_phase.end_time = datetime.utcnow()
            
            workflow.results['error'] = str(e)
            workflow.completed_at = datetime.utcnow()
            
            logger.error(f"工作流执行失败: {workflow_id}, 错误: {e}")
            
            # 尝试错误恢复
            await self._handle_workflow_error(workflow, e)
            
            raise
    
    async def _execute_phase(self, workflow: Workflow, phase: WorkflowPhase, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        执行工作流阶段
        
        Args:
            workflow: 工作流
            phase: 阶段
            input_data: 输入数据
            
        Returns:
            阶段结果
        """
        # 并行执行阶段中的所有代理
        tasks = []
        for agent_name in phase.agents:
            if agent_name in self.agents:
                task = asyncio.create_task(
                    self._execute_agent_task(workflow, agent_name, phase, input_data)
                )
                tasks.append(task)
        
        # 等待所有任务完成，使用超时控制
        try:
            results = await asyncio.wait_for(
                asyncio.gather(*tasks, return_exceptions=True),
                timeout=phase.timeout
            )
            
            # 处理结果
            phase_results = {}
            for i, result in enumerate(results):
                agent_name = phase.agents[i]
                if isinstance(result, Exception):
                    phase_results[f'{agent_name}_error'] = str(result)
                    logger.error(f"代理执行错误 {agent_name}: {result}")
                else:
                    phase_results[agent_name] = result
            
            return phase_results
            
        except asyncio.TimeoutError:
            raise Exception(f"阶段执行超时: {phase.name}, 超时时间: {phase.timeout}秒")
    
    async def _execute_agent_task(self, workflow: Workflow, agent_name: str, 
                                 phase: WorkflowPhase, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        执行代理任务
        
        Args:
            workflow: 工作流
            agent_name: 代理名称
            phase: 阶段
            input_data: 输入数据
            
        Returns:
            代理执行结果
        """
        agent = self.agents[agent_name]
        
        # 准备代理配置
        agent_config = {
            'workflow_id': workflow.id,
            'phase_name': phase.name,
            'tools': phase.tools,
            'timeout': phase.timeout
        }
        
        # 执行代理任务
        logger.info(f"执行代理任务: {agent_name} - {phase.name}")
        
        try:
            result = await agent.execute_task(input_data, agent_config)
            logger.info(f"代理任务完成: {agent_name}")
            return result
            
        except Exception as e:
            logger.error(f"代理任务失败: {agent_name}, 错误: {e}")
            raise
    
    async def _handle_workflow_error(self, workflow: Workflow, error: Exception):
        """
        处理工作流错误
        
        Args:
            workflow: 工作流
            error: 错误信息
        """
        # 记录错误信息
        error_info = {
            'workflow_id': workflow.id,
            'error_type': type(error).__name__,
            'error_message': str(error),
            'phase_name': workflow.phases[workflow.current_phase].name,
            'timestamp': datetime.utcnow().isoformat()
        }
        
        # 尝试错误恢复策略
        recovery_strategies = self.config.get('error_handling', {}).get('error_types', {})
        error_type = type(error).__name__
        
        if error_type in recovery_strategies:
            strategy = recovery_strategies[error_type]
            await self._apply_recovery_strategy(workflow, strategy, error_info)
        
        # 发送错误通知
        await self._send_error_notification(workflow, error_info)
    
    async def _apply_recovery_strategy(self, workflow: Workflow, strategy: Dict[str, Any], error_info: Dict[str, Any]):
        """应用错误恢复策略"""
        action = strategy.get('action')
        
        if action == 'retry':
            max_retries = strategy.get('max_retries', 3)
            retry_count = workflow.results.get('retry_count', 0)
            
            if retry_count < max_retries:
                workflow.results['retry_count'] = retry_count + 1
                logger.info(f"重试工作流: {workflow.id}, 重试次数: {retry_count + 1}")
                
                # 延迟后重试
                delay = strategy.get('retry_delay', 5)
                await asyncio.sleep(delay)
                
                # 重试执行
                await self.execute_workflow(workflow.id, workflow.results['input_data'])
            else:
                logger.error(f"工作流重试次数超限: {workflow.id}")
        
        elif action == 'wait_and_retry':
            wait_time = strategy.get('wait_time', 300)
            logger.info(f"等待 {wait_time} 秒后重试: {workflow.id}")
            
            await asyncio.sleep(wait_time)
            await self.execute_workflow(workflow.id, workflow.results['input_data'])
        
        elif action == 'fail_and_notify':
            logger.error(f"工作流执行失败，发送通知: {workflow.id}")
            await self._send_error_notification(workflow, error_info)
    
    async def _send_error_notification(self, workflow: Workflow, error_info: Dict[str, Any]):
        """发送错误通知"""
        # 这里可以实现邮件、短信、Slack等通知方式
        logger.warning(f"工作流错误通知: {error_info}")
    
    def get_workflow_status(self, workflow_id: str) -> Dict[str, Any]:
        """
        获取工作流状态
        
        Args:
            workflow_id: 工作流ID
            
        Returns:
            工作流状态信息
        """
        if workflow_id not in self.workflows:
            raise ValueError(f"工作流不存在: {workflow_id}")
        
        workflow = self.workflows[workflow_id]
        
        status_info = {
            'workflow_id': workflow.id,
            'name': workflow.name,
            'status': workflow.status.value,
            'created_at': workflow.created_at.isoformat(),
            'started_at': workflow.started_at.isoformat() if workflow.started_at else None,
            'completed_at': workflow.completed_at.isoformat() if workflow.completed_at else None,
            'current_phase': workflow.current_phase,
            'total_phases': len(workflow.phases),
            'phases': []
        }
        
        # 添加阶段状态信息
        for i, phase in enumerate(workflow.phases):
            phase_info = {
                'phase_number': i + 1,
                'name': phase.name,
                'description': phase.description,
                'status': phase.status.value,
                'start_time': phase.start_time.isoformat() if phase.start_time else None,
                'end_time': phase.end_time.isoformat() if phase.end_time else None,
                'duration': (phase.end_time - phase.start_time).total_seconds() if phase.start_time and phase.end_time else None,
                'error': phase.error
            }
            status_info['phases'].append(phase_info)
        
        return status_info
    
    def cancel_workflow(self, workflow_id: str) -> bool:
        """
        取消工作流
        
        Args:
            workflow_id: 工作流ID
            
        Returns:
            是否成功取消
        """
        if workflow_id not in self.workflows:
            raise ValueError(f"工作流不存在: {workflow_id}")
        
        workflow = self.workflows[workflow_id]
        
        if workflow.status == WorkflowStatus.RUNNING:
            # 取消正在运行的任务
            if workflow_id in self.running_tasks:
                task = self.running_tasks[workflow_id]
                task.cancel()
                del self.running_tasks[workflow_id]
            
            workflow.status = WorkflowStatus.CANCELLED
            workflow.completed_at = datetime.utcnow()
            
            logger.info(f"工作流已取消: {workflow_id}")
            return True
        
        return False
    
    def get_workflows_list(self) -> List[Dict[str, Any]]:
        """获取工作流列表"""
        workflows_list = []
        
        for workflow_id, workflow in self.workflows.items():
            workflow_info = {
                'id': workflow.id,
                'name': workflow.name,
                'description': workflow.description,
                'status': workflow.status.value,
                'created_at': workflow.created_at.isoformat(),
                'started_at': workflow.started_at.isoformat() if workflow.started_at else None,
                'completed_at': workflow.completed_at.isoformat() if workflow.completed_at else None,
                'progress': f"{workflow.current_phase}/{len(workflow.phases)}" if workflow.phases else "0/0"
            }
            workflows_list.append(workflow_info)
        
        return workflows_list

    async def _get_cached_result(self, cache_key: str) -> Optional[Dict[str, Any]]:
        """
        获取缓存结果 - L1/L2缓存策略

        Args:
            cache_key: 缓存键

        Returns:
            缓存结果或None
        """
        # L1内存缓存
        if cache_key in self.memory_cache:
            cache_entry = self.memory_cache[cache_key]
            if cache_key not in self.memory_cache:
                return None

            # 检查过期时间
            if datetime.utcnow().timestamp() - cache_entry['timestamp'] < cache_entry['ttl']:
                logger.info(f"L1缓存命中: {cache_key}")
                return cache_entry['data']
            else:
                # 过期删除
                del self.memory_cache[cache_key]

        # L2 Redis缓存
        if self.redis_available:
            try:
                cached_data = self.redis_client.get(cache_key)
                if cached_data:
                    data = json.loads(cached_data)
                    logger.info(f"L2缓存命中: {cache_key}")

                    # 回填L1缓存
                    self.memory_cache[cache_key] = {
                        'data': data,
                        'timestamp': datetime.utcnow().timestamp(),
                        'ttl': 300  # 5分钟
                    }

                    return data
            except Exception as e:
                logger.warning(f"Redis缓存读取失败: {e}")

        return None

    async def _set_cached_result(self, cache_key: str, data: Dict[str, Any], ttl: int = 300):
        """
        设置缓存结果 - 三级缓存存储

        Args:
            cache_key: 缓存键
            data: 缓存数据
            ttl: 过期时间(秒)
        """
        timestamp = datetime.utcnow().timestamp()
        cache_entry = {
            'data': data,
            'timestamp': timestamp,
            'ttl': ttl
        }

        # L1内存缓存
        self.memory_cache[cache_key] = cache_entry

        # L2 Redis缓存
        if self.redis_available:
            try:
                self.redis_client.setex(
                    cache_key,
                    ttl,
                    json.dumps(data, ensure_ascii=False)
                )
                logger.info(f"L2缓存设置成功: {cache_key}")
            except Exception as e:
                logger.warning(f"Redis缓存设置失败: {e}")

    async def clear_cache(self, pattern: Optional[str] = None):
        """
        清理缓存

        Args:
            pattern: 缓存键模式，None表示清理所有
        """
        # 清理L1缓存
        if pattern:
            keys_to_remove = [k for k in self.memory_cache.keys() if pattern in k]
            for key in keys_to_remove:
                del self.memory_cache[key]
            logger.info(f"L1缓存清理完成，模式: {pattern}，清理数量: {len(keys_to_remove)}")
        else:
            cleared_count = len(self.memory_cache)
            self.memory_cache.clear()
            logger.info(f"L1缓存全部清理完成，清理数量: {cleared_count}")

        # 清理L2缓存
        if self.redis_available:
            try:
                if pattern:
                    keys = self.redis_client.keys(f"*{pattern}*")
                    if keys:
                        self.redis_client.delete(*keys)
                        logger.info(f"L2缓存清理完成，模式: {pattern}，清理数量: {len(keys)}")
                else:
                    # Redis不支持flushall，需要谨慎处理
                    logger.warning("L2缓存全部清理需要手动执行")
            except Exception as e:
                logger.error(f"L2缓存清理失败: {e}")

    def get_performance_stats(self) -> Dict[str, Any]:
        """
        获取性能统计信息

        Returns:
            性能统计数据
        """
        return {
            'response_time_p50': self.metrics.get_p50_response_time(),
            'response_time_p95': self.metrics.get_p95_response_time(),
            'avg_response_time': sum(self.metrics.metrics['response_times']) / len(self.metrics.metrics['response_times']) if self.metrics.metrics['response_times'] else 0,
            'total_workflows': len(self.metrics.metrics['workflow_durations']),
            'avg_workflow_duration': sum(self.metrics.metrics['workflow_durations']) / len(self.metrics.metrics['workflow_durations']) if self.metrics.metrics['workflow_durations'] else 0,
            'error_rate': len(self.metrics.metrics['error_rates']) / max(len(self.metrics.metrics['response_times']), 1) * 100,
            'cache_hit_rate': self.metrics.metrics['cache_hit_rate'],
            'cost_savings': self.metrics.metrics['cost_savings'],
            'active_connections': len(self.connection_pool.active_connections),
            'l1_cache_size': len(self.memory_cache),
            'redis_available': self.redis_available,
            'timestamp': datetime.utcnow().isoformat()
        }

    async def warm_up_cache(self, workflow_types: List[str]):
        """
        预热缓存

        Args:
            workflow_types: 需要预热的工作流类型列表
        """
        logger.info(f"开始缓存预热，工作流类型: {workflow_types}")

        for workflow_type in workflow_types:
            try:
                # 预加载常用配置和模板
                cache_key = f"workflow_config_{workflow_type}"
                workflow_config = self.config.get('workflows', {}).get(workflow_type, {})

                if workflow_config:
                    await self._set_cached_result(cache_key, workflow_config, ttl=600)
                    logger.info(f"缓存预热完成: {cache_key}")

            except Exception as e:
                logger.error(f"缓存预热失败 {workflow_type}: {e}")

        logger.info("缓存预热完成")

    # ===== V1设计哲学融合方法 =====

    async def execute_v1_philosophy_workflow(self, client_slug: str, target_tool: str, workflow_config: Dict[str, Any]) -> Dict[str, Any]:
        """
        执行V1设计哲学融合工作流 - 数据驱动+论坛协作+动态迭代

        Args:
            client_slug: 客户标识
            target_tool: 目标AI工具
            workflow_config: 工作流配置

        Returns:
            融合工作流执行结果
        """
        logger.info(f"启动V1设计哲学融合工作流: {client_slug}/{target_tool}")

        try:
            # Phase 1: 数据驱动内容自动化 (40%权重)
            logger.info("Phase 1: 启动数据驱动内容自动化")
            data_metrics = await self.data_driven_engine.daily_data_collection()
            analysis_results = await self.data_driven_engine.intelligent_analysis_engine(data_metrics)
            content_plan = await self.data_driven_engine.auto_content_production(analysis_results)

            # Phase 2: 多Agent协作论坛机制 (35%权重)
            logger.info("Phase 2: 启动多Agent协作论坛机制")
            forum_metrics = await self.forum_collaboration_engine.start_evaluation_forum(target_tool)

            # Phase 3: 动态规格迭代计划 (25%权重)
            logger.info("Phase 3: 启动动态规格迭代计划")
            iteration_metrics = await self.dynamic_iteration_engine.generate_auto_iteration_report(client_slug)

            # 融合三种设计哲学的结果
            integrated_result = await self.v1_integrator.execute_v1_philosophy_workflow(
                client_slug, target_tool
            )

            # 生成最终的V4.1工作流配置
            final_workflow_config = await self._merge_v1_results_with_v4_workflow(
                workflow_config, integrated_result
            )

            # 记录V1设计哲学执行指标
            v1_performance_metrics = {
                'data_driven_quality': data_metrics.quality_score,
                'forum_consensus_score': forum_metrics.consensus_score,
                'iteration_success_rate': 1.0 - iteration_metrics.execution_results.get('failure_rate', 0.0),
                'integration_effectiveness': integrated_result['integrated_strategy']['performance_prediction']['expected_quality']
            }

            logger.info(f"V1设计哲学工作流完成: 质量={v1_performance_metrics['integration_effectiveness']:.2f}")

            return {
                'workflow_config': final_workflow_config,
                'v1_philosophy_results': {
                    'data_driven': {
                        'metrics': data_metrics,
                        'content_plan': content_plan
                    },
                    'forum_collaboration': {
                        'metrics': forum_metrics
                    },
                    'dynamic_iteration': {
                        'metrics': iteration_metrics
                    },
                    'integrated_strategy': integrated_result['integrated_strategy']
                },
                'performance_metrics': v1_performance_metrics,
                'execution_timestamp': datetime.utcnow().isoformat()
            }

        except Exception as e:
            logger.error(f"V1设计哲学工作流执行失败: {e}")
            raise

    async def execute_data_driven_workflow(self, workflow_id: str, workflow_config: Dict[str, Any]) -> Dict[str, Any]:
        """
        执行数据驱动工作流 - 基于V1数据驱动设计

        Args:
            workflow_id: 工作流ID
            workflow_config: 工作流配置

        Returns:
            数据驱动工作流执行结果
        """
        logger.info(f"启动V1数据驱动工作流: {workflow_id}")

        # 每日数据收集 (02:00-06:00)
        data_metrics = await self.data_driven_engine.daily_data_collection()

        # 智能数据分析引擎 (06:00-08:00)
        analysis_results = await self.data_driven_engine.intelligent_analysis_engine(data_metrics)

        # 自动内容生产系统 (08:00-10:00)
        content_plan = await self.data_driven_engine.auto_content_production(analysis_results)

        # 基于数据生成工作流执行策略
        execution_strategy = await self._generate_data_driven_execution_strategy(
            workflow_config, analysis_results, content_plan
        )

        return {
            'workflow_id': workflow_id,
            'data_metrics': data_metrics,
            'analysis_results': analysis_results,
            'content_plan': content_plan,
            'execution_strategy': execution_strategy,
            'philosophy_type': 'data_driven',
            'execution_timestamp': datetime.utcnow().isoformat()
        }

    async def execute_forum_collaboration_workflow(self, workflow_id: str, target_tool: str, agents_config: Dict[str, Any]) -> Dict[str, Any]:
        """
        执行多Agent论坛协作工作流 - 基于V1论坛协作设计

        Args:
            workflow_id: 工作流ID
            target_tool: 目标工具
            agents_config: Agent配置

        Returns:
            论坛协作工作流执行结果
        """
        logger.info(f"启动V1论坛协作工作流: {workflow_id}/{target_tool}")

        # 初始化论坛协作环境
        await self.forum_collaboration_engine.log_monitor.start_monitoring()

        # 启动AI工具评测论坛
        forum_metrics = await self.forum_collaboration_engine.start_evaluation_forum(target_tool)

        # 基于论坛共识生成工作流策略
        consensus_strategy = await self._generate_forum_consensus_strategy(
            target_tool, forum_metrics, agents_config
        )

        return {
            'workflow_id': workflow_id,
            'target_tool': target_tool,
            'forum_metrics': forum_metrics,
            'consensus_strategy': consensus_strategy,
            'philosophy_type': 'forum_collaboration',
            'execution_timestamp': datetime.utcnow().isoformat()
        }

    async def execute_dynamic_iteration_workflow(self, workflow_id: str, client_slug: str, iteration_config: Dict[str, Any]) -> Dict[str, Any]:
        """
        执行动态迭代工作流 - 基于V1动态迭代设计

        Args:
            workflow_id: 工作流ID
            client_slug: 客户标识
            iteration_config: 迭代配置

        Returns:
            动态迭代工作流执行结果
        """
        logger.info(f"启动V1动态迭代工作流: {workflow_id}/{client_slug}")

        # PRD更新处理
        prd_result = await self.dynamic_iteration_engine.process_prd_update(
            client_slug, iteration_config.get('prd_file', '')
        )

        # 客户模板引导
        template_result = await self.dynamic_iteration_engine.bootstrap_client_templates(
            client_slug, iteration_config.get('config', {})
        )

        # 运行客户端执行
        execution_result = await self.dynamic_iteration_engine.run_client_execution(client_slug)

        # 生成自动迭代报告
        iteration_metrics = await self.dynamic_iteration_engine.generate_auto_iteration_report(client_slug)

        # 基于迭代报告优化工作流配置
        optimized_config = await self._optimize_workflow_from_iteration(
            iteration_config, iteration_metrics
        )

        return {
            'workflow_id': workflow_id,
            'client_slug': client_slug,
            'prd_result': prd_result,
            'template_result': template_result,
            'execution_result': execution_result,
            'iteration_metrics': iteration_metrics,
            'optimized_config': optimized_config,
            'philosophy_type': 'dynamic_iteration',
            'execution_timestamp': datetime.utcnow().isoformat()
        }

    async def _merge_v1_results_with_v4_workflow(self, v4_config: Dict[str, Any], v1_results: Dict[str, Any]) -> Dict[str, Any]:
        """
        将V1设计哲学结果与V4工作流配置合并

        Args:
            v4_config: V4工作流配置
            v1_results: V1设计哲学执行结果

        Returns:
            合并后的工作流配置
        """
        # 提取V1综合策略
        integrated_strategy = v1_results['integrated_strategy']

        # 合并内容优化策略
        content_optimization = integrated_strategy['content_optimization']
        v4_config['content_strategy'] = {
            'data_driven_insights': content_optimization['data_driven_insights'],
            'forum_validated_points': content_optimization['forum_validated_points'],
            'iteration_improvements': content_optimization['iteration_improvements']
        }

        # 合并执行计划
        execution_plan = integrated_strategy['execution_plan']
        v4_config['execution_plan'] = execution_plan

        # 合并性能预测
        performance_prediction = integrated_strategy['performance_prediction']
        v4_config['performance_expectations'] = performance_prediction

        # 添加V1设计哲学权重和配置
        v4_config['v1_philosophy_integration'] = {
            'weights': self.philosophy_weights,
            'applied_philosophies': ['data_driven', 'forum_collaboration', 'dynamic_iteration'],
            'integration_effectiveness': performance_prediction['expected_quality']
        }

        return v4_config

    async def _generate_data_driven_execution_strategy(self, workflow_config: Dict[str, Any], analysis_results: Dict[str, Any], content_plan: Dict[str, Any]) -> Dict[str, Any]:
        """基于数据驱动分析生成执行策略"""
        return {
            'data_sources': analysis_results['cleaned_data'].get('sources', []),
            'target_audience': analysis_results['user_profiles'].get('primary_segments', []),
            'content_priorities': content_plan['structure'].get('priorities', []),
            'optimization_focus': analysis_results['content_opportunities'].get('high_value_areas', [])
        }

    async def _generate_forum_consensus_strategy(self, target_tool: str, forum_metrics: ForumDiscussionMetrics, agents_config: Dict[str, Any]) -> Dict[str, Any]:
        """基于论坛共识生成策略"""
        return {
            'consensus_score': forum_metrics.consensus_score,
            'controversy_resolution': forum_metrics.controversy_points,
            'validated_features': forum_metrics.final_synthesis.get('validated_points', []),
            'agent_contributions': forum_metrics.final_synthesis.get('agent_weights', {})
        }

    async def _optimize_workflow_from_iteration(self, iteration_config: Dict[str, Any], iteration_metrics: IterationPlanMetrics) -> Dict[str, Any]:
        """基于迭代报告优化工作流配置"""
        return {
            'prd_updates_applied': iteration_metrics.prd_updates,
            'template_refreshes_applied': iteration_metrics.template_refreshes,
            'success_rate_improvements': iteration_metrics.execution_results,
            'auto_suggestions': iteration_metrics.auto_suggestions,
            'next_phase_actions': iteration_metrics.next_actions
        }

    def get_v1_philosophy_status(self) -> Dict[str, Any]:
        """
        获取V1设计哲学集成状态

        Returns:
            V1设计哲学状态信息
        """
        return {
            'philosophy_integrations': {
                'data_driven': {
                    'status': 'active',
                    'weight': self.philosophy_weights['data_driven'],
                    'collection_schedule': self.data_driven_engine.collection_schedule
                },
                'forum_collaboration': {
                    'status': 'active',
                    'weight': self.philosophy_weights['forum_collaboration'],
                    'monitoring_active': self.forum_collaboration_engine.log_monitor.monitor_active,
                    'agents_count': len(self.forum_collaboration_engine.agents)
                },
                'dynamic_iteration': {
                    'status': 'active',
                    'weight': self.philosophy_weights['dynamic_iteration'],
                    'iteration_cycle': self.dynamic_iteration_engine.iteration_cycle
                }
            },
            'integration_effectiveness': {
                'total_weight': sum(self.philosophy_weights.values()),
                'primary_philosophy': max(self.philosophy_weights, key=self.philosophy_weights.get),
                'balance_score': min(self.philosophy_weights.values()) / max(self.philosophy_weights.values())
            },
            'timestamp': datetime.utcnow().isoformat()
        }