"""
LaunchX v4.0 Agent OS 启动器
智能协作AI系统的统一启动和管理入口
"""

import asyncio
import logging
import signal
import sys
import os
from pathlib import Path
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from datetime import datetime
import json

# 添加src目录到路径
sys.path.insert(0, str(Path(__file__).parent))

# 临时配置类，用于兼容性
class Config:
    def __init__(self, config_dict):
        self.config = config_dict

    def get(self, key, default=None):
        return self.config.get(key, default)

# 临时Agent注册表，用于兼容性
class AgentRegistry:
    def __init__(self, config):
        self.config = config
        self.agents = {}

    async def initialize(self):
        pass

    async def register_agent(self, agent):
        self.agents[agent.agent_id] = agent

from core.agent_collaboration.collaboration_manager import CollaborationManager
from core.agent_collaboration.intelligent_scheduler import IntelligentScheduler
from core.learning.realtime_learning_engine import RealtimeLearningEngine
from core.learning.self_optimization_system import SelfOptimizationSystem
from core.enterprise_monitoring.monitoring_dashboard import MonitoringDashboard

# AI算法组件的占位符，用于兼容性
class ViralContentDetector:
    def __init__(self, config):
        self.config = config
    async def initialize(self):
        pass
    async def shutdown(self):
        pass

class TrendPredictor:
    def __init__(self, config):
        self.config = config
    async def initialize(self):
        pass
    async def shutdown(self):
        pass

class BrandPersonalityMatcher:
    def __init__(self, config):
        self.config = config
    async def initialize(self):
        pass
    async def shutdown(self):
        pass

class EngagementOptimizer:
    def __init__(self, config):
        self.config = config
    async def initialize(self):
        pass
    async def shutdown(self):
        pass

class ContentPerformancePredictor:
    def __init__(self, config):
        self.config = config
    async def initialize(self):
        pass
    async def shutdown(self):
        pass

class ContinuousLearningEngine:
    def __init__(self, config):
        self.config = config
    async def initialize(self):
        pass
    async def shutdown(self):
        pass

# 专业化Agent的占位符
class TrendAgent:
    def __init__(self, agent_id, name, config):
        self.agent_id = agent_id
        self.name = name
        self.config = config
    async def initialize(self):
        pass
    async def shutdown(self):
        pass
    async def predict_trends(self, category, time_horizon, data_sources):
        return {"trends": [], "confidence": 0.8}

class ContentAgent:
    def __init__(self, agent_id, name, config):
        self.agent_id = agent_id
        self.name = name
        self.config = config
    async def initialize(self):
        pass
    async def shutdown(self):
        pass
    async def analyze_content(self, content, platform, analysis_type):
        return {"analysis": "complete", "quality_score": 0.85}

class MasterAgent:
    def __init__(self, agent_id, name, config):
        self.agent_id = agent_id
        self.name = name
        self.config = config
    async def initialize(self):
        pass
    async def shutdown(self):
        pass

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('agent_os.log'),
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)


@dataclass
class SystemStatus:
    """系统状态"""
    is_running: bool = False
    start_time: Optional[datetime] = None
    active_agents: List[str] = None
    active_services: List[str] = None
    system_health: str = "unknown"
    last_update: Optional[datetime] = None

    def __post_init__(self):
        if self.active_agents is None:
            self.active_agents = []
        if self.active_services is None:
            self.active_services = []


class AgentOSLauncher:
    """Agent OS 启动器"""

    def __init__(self, config_path: Optional[str] = None):
        self.config = self._load_config(config_path)
        self.status = SystemStatus()

        # 核心组件
        self.agent_registry: Optional[AgentRegistry] = None
        self.collaboration_manager: Optional[CollaborationManager] = None
        self.scheduler: Optional[IntelligentScheduler] = None
        self.learning_engine: Optional[RealtimeLearningEngine] = None
        self.optimization_system: Optional[SelfOptimizationSystem] = None
        self.monitoring_dashboard: Optional[MonitoringDashboard] = None

        # AI算法组件
        self.viral_detector: Optional[ViralContentDetector] = None
        self.trend_predictor: Optional[TrendPredictor] = None
        self.brand_matcher: Optional[BrandPersonalityMatcher] = None
        self.engagement_optimizer: Optional[EngagementOptimizer] = None
        self.content_predictor: Optional[ContentPerformancePredictor] = None
        self.learning_engine_advanced: Optional[ContinuousLearningEngine] = None

        # 专业化Agent
        self.trend_agent: Optional[TrendAgent] = None
        self.content_agent: Optional[ContentAgent] = None
        self.master_agent: Optional[MasterAgent] = None

        # 运行状态
        self.shutdown_event = asyncio.Event()

        # 注册信号处理
        self._setup_signal_handlers()

    def _load_config(self, config_path: Optional[str]) -> Config:
        """加载配置"""
        if config_path and os.path.exists(config_path):
            with open(config_path, 'r', encoding='utf-8') as f:
                config_data = json.load(f)
            return Config(config_data)
        else:
            # 默认配置
            return Config({
                "system": {
                    "name": "LaunchX v4.0 Agent OS",
                    "version": "4.0.0",
                    "environment": "production"
                },
                "agents": {
                    "max_concurrent_agents": 10,
                    "default_timeout": 300,
                    "retry_attempts": 3
                },
                "collaboration": {
                    "max_concurrent_collaborations": 10,
                    "synergy_threshold": 0.7
                },
                "learning": {
                    "learning_enabled": True,
                    "learning_rate": 0.01,
                    "optimization_interval": 3600
                },
                "monitoring": {
                    "collection_interval": 60,
                    "alert_evaluation_interval": 300,
                    "insight_generation_interval": 3600
                }
            })

    def _setup_signal_handlers(self):
        """设置信号处理器"""
        def signal_handler(signum, frame):
            logger.info(f"Received signal {signum}, initiating shutdown...")
            self.shutdown_event.set()

        signal.signal(signal.SIGINT, signal_handler)
        signal.signal(signal.SIGTERM, signal_handler)

    async def initialize(self) -> bool:
        """初始化系统"""
        try:
            logger.info("Initializing LaunchX v4.0 Agent OS...")

            # 初始化核心组件
            await self._initialize_core_components()

            # 初始化AI算法组件
            await self._initialize_ai_algorithms()

            # 初始化专业化Agent
            await self._initialize_specialized_agents()

            # 启动监控仪表板
            await self._start_monitoring()

            # 更新系统状态
            self.status.is_running = True
            self.status.start_time = datetime.now()
            self.status.system_health = "healthy"
            self.status.last_update = datetime.now()

            logger.info("Agent OS initialization completed successfully!")
            return True

        except Exception as e:
            logger.error(f"Failed to initialize Agent OS: {e}")
            return False

    async def _initialize_core_components(self) -> None:
        """初始化核心组件"""
        logger.info("Initializing core components...")

        # 1. Agent注册表
        self.agent_registry = AgentRegistry(self.config)
        await self.agent_registry.initialize()
        self.status.active_services.append("agent_registry")

        # 2. 协作管理器
        self.collaboration_manager = CollaborationManager(self.config)
        await self.collaboration_manager.initialize()
        self.status.active_services.append("collaboration_manager")

        # 3. 智能调度器
        self.scheduler = IntelligentScheduler(self.config)
        await self.scheduler.initialize()
        self.status.active_services.append("intelligent_scheduler")

        # 4. 实时学习引擎
        self.learning_engine = RealtimeLearningEngine(self.config)
        await self.learning_engine.initialize()
        self.status.active_services.append("realtime_learning_engine")

        # 5. 自优化系统
        self.optimization_system = SelfOptimizationSystem(self.config)
        await self.optimization_system.initialize()
        self.status.active_services.append("self_optimization_system")

        logger.info("Core components initialized successfully!")

    async def _initialize_ai_algorithms(self) -> None:
        """初始化AI算法组件"""
        logger.info("Initializing AI algorithms...")

        # 1. 爆款内容检测器
        self.viral_detector = ViralContentDetector(self.config)
        await self.viral_detector.initialize()
        self.status.active_services.append("viral_content_detector")

        # 2. 趋势预测器
        self.trend_predictor = TrendPredictor(self.config)
        await self.trend_predictor.initialize()
        self.status.active_services.append("trend_predictor")

        # 3. 品牌调性匹配器
        self.brand_matcher = BrandPersonalityMatcher(self.config)
        await self.brand_matcher.initialize()
        self.status.active_services.append("brand_personality_matcher")

        # 4. 互动优化器
        self.engagement_optimizer = EngagementOptimizer(self.config)
        await self.engagement_optimizer.initialize()
        self.status.active_services.append("engagement_optimizer")

        # 5. 内容表现预测器
        self.content_predictor = ContentPerformancePredictor(self.config)
        await self.content_predictor.initialize()
        self.status.active_services.append("content_performance_predictor")

        # 6. 持续学习引擎
        self.learning_engine_advanced = ContinuousLearningEngine(self.config)
        await self.learning_engine_advanced.initialize()
        self.status.active_services.append("continuous_learning_engine")

        logger.info("AI algorithms initialized successfully!")

    async def _initialize_specialized_agents(self) -> None:
        """初始化专业化Agent"""
        logger.info("Initializing specialized agents...")

        # 1. 趋势分析Agent
        self.trend_agent = TrendAgent(
            agent_id="trend_agent_v1",
            name="趋势分析专家",
            config=self.config
        )
        await self.trend_agent.initialize()
        await self.agent_registry.register_agent(self.trend_agent)
        self.status.active_agents.append("trend_agent")

        # 2. 内容创作Agent
        self.content_agent = ContentAgent(
            agent_id="content_agent_v1",
            name="内容创作专家",
            config=self.config
        )
        await self.content_agent.initialize()
        await self.agent_registry.register_agent(self.content_agent)
        self.status.active_agents.append("content_agent")

        # 3. 主控Agent
        self.master_agent = MasterAgent(
            agent_id="master_agent_v1",
            name="系统主控专家",
            config=self.config
        )
        await self.master_agent.initialize()
        await self.agent_registry.register_agent(self.master_agent)
        self.status.active_agents.append("master_agent")

        logger.info("Specialized agents initialized successfully!")

    async def _start_monitoring(self) -> None:
        """启动监控"""
        logger.info("Starting monitoring dashboard...")

        self.monitoring_dashboard = MonitoringDashboard(self.config)
        await self.monitoring_dashboard.start()
        self.status.active_services.append("monitoring_dashboard")

        logger.info("Monitoring dashboard started successfully!")

    async def start(self) -> bool:
        """启动系统"""
        try:
            logger.info("Starting LaunchX v4.0 Agent OS...")

            # 初始化系统
            if not await self.initialize():
                return False

            # 启动主控循环
            await self._run_main_loop()

            return True

        except Exception as e:
            logger.error(f"Failed to start Agent OS: {e}")
            return False

    async def _run_main_loop(self) -> None:
        """运行主循环"""
        logger.info("Starting main control loop...")

        try:
            while not self.shutdown_event.is_set():
                # 系统健康检查
                await self._health_check()

                # 更新系统状态
                self.status.last_update = datetime.now()

                # 等待下一个循环
                try:
                    await asyncio.wait_for(self.shutdown_event.wait(), timeout=60.0)
                except asyncio.TimeoutError:
                    continue

        except Exception as e:
            logger.error(f"Error in main loop: {e}")
        finally:
            logger.info("Main control loop ended")

    async def _health_check(self) -> None:
        """健康检查"""
        try:
            health_issues = []

            # 检查核心组件
            components = [
                ("agent_registry", self.agent_registry),
                ("collaboration_manager", self.collaboration_manager),
                ("intelligent_scheduler", self.scheduler),
                ("realtime_learning_engine", self.learning_engine),
                ("self_optimization_system", self.optimization_system),
                ("monitoring_dashboard", self.monitoring_dashboard)
            ]

            for name, component in components:
                if component and hasattr(component, 'is_healthy'):
                    try:
                        if not await component.is_healthy():
                            health_issues.append(f"{name} is unhealthy")
                    except Exception as e:
                        health_issues.append(f"{name} health check failed: {e}")

            # 检查AI算法组件
            ai_components = [
                ("viral_content_detector", self.viral_detector),
                ("trend_predictor", self.trend_predictor),
                ("brand_personality_matcher", self.brand_matcher),
                ("engagement_optimizer", self.engagement_optimizer),
                ("content_performance_predictor", self.content_predictor),
                ("continuous_learning_engine", self.learning_engine_advanced)
            ]

            for name, component in ai_components:
                if component and hasattr(component, 'is_healthy'):
                    try:
                        if not await component.is_healthy():
                            health_issues.append(f"{name} is unhealthy")
                    except Exception as e:
                        health_issues.append(f"{name} health check failed: {e}")

            # 更新系统健康状态
            if health_issues:
                self.status.system_health = "unhealthy"
                for issue in health_issues:
                    logger.warning(f"Health issue: {issue}")
            else:
                self.status.system_health = "healthy"

        except Exception as e:
            logger.error(f"Health check failed: {e}")
            self.status.system_health = "unknown"

    async def shutdown(self) -> None:
        """关闭系统"""
        try:
            logger.info("Shutting down LaunchX v4.0 Agent OS...")

            # 关闭监控
            if self.monitoring_dashboard:
                await self.monitoring_dashboard.stop()

            # 关闭AI算法组件
            ai_components = [
                self.viral_detector,
                self.trend_predictor,
                self.brand_matcher,
                self.engagement_optimizer,
                self.content_predictor,
                self.learning_engine_advanced
            ]

            for component in ai_components:
                if component:
                    try:
                        await component.shutdown()
                    except Exception as e:
                        logger.error(f"Error shutting down AI component: {e}")

            # 关闭专业化Agent
            agents = [self.trend_agent, self.content_agent, self.master_agent]
            for agent in agents:
                if agent:
                    try:
                        await agent.shutdown()
                    except Exception as e:
                        logger.error(f"Error shutting down agent {agent.name}: {e}")

            # 关闭核心组件
            core_components = [
                self.optimization_system,
                self.learning_engine,
                self.scheduler,
                self.collaboration_manager,
                self.agent_registry
            ]

            for component in core_components:
                if component:
                    try:
                        await component.shutdown()
                    except Exception as e:
                        logger.error(f"Error shutting down core component: {e}")

            # 更新状态
            self.status.is_running = False
            self.status.system_health = "shutdown"

            logger.info("Agent OS shutdown completed successfully!")

        except Exception as e:
            logger.error(f"Error during shutdown: {e}")

    def get_system_status(self) -> Dict[str, Any]:
        """获取系统状态"""
        return {
            "system_name": "LaunchX v4.0 Agent OS",
            "version": "4.0.0",
            "is_running": self.status.is_running,
            "start_time": self.status.start_time.isoformat() if self.status.start_time else None,
            "uptime_seconds": (datetime.now() - self.status.start_time).total_seconds() if self.status.start_time else 0,
            "system_health": self.status.system_health,
            "last_update": self.status.last_update.isoformat() if self.status.last_update else None,
            "active_agents": self.status.active_agents.copy(),
            "active_services": self.status.active_services.copy(),
            "agent_count": len(self.status.active_agents),
            "service_count": len(self.status.active_services)
        }

    async def execute_task(self, task_type: str, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """执行任务"""
        try:
            logger.info(f"Executing task: {task_type}")

            if task_type == "xiaohongshu_content_analysis":
                return await self._execute_content_analysis(task_data)
            elif task_type == "trend_prediction":
                return await self._execute_trend_prediction(task_data)
            elif task_type == "brand_matching":
                return await self._execute_brand_matching(task_data)
            elif task_type == "content_optimization":
                return await self._execute_content_optimization(task_data)
            else:
                return {
                    "success": False,
                    "error": f"Unknown task type: {task_type}",
                    "task_id": task_data.get("task_id")
                }

        except Exception as e:
            logger.error(f"Error executing task {task_type}: {e}")
            return {
                "success": False,
                "error": str(e),
                "task_id": task_data.get("task_id")
            }

    async def _execute_content_analysis(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """执行内容分析任务"""
        try:
            # 使用内容创作Agent
            if not self.content_agent:
                return {"success": False, "error": "Content agent not available"}

            result = await self.content_agent.analyze_content(
                content=task_data.get("content"),
                platform=task_data.get("platform", "xiaohongshu"),
                analysis_type=task_data.get("analysis_type", "comprehensive")
            )

            return {
                "success": True,
                "result": result,
                "task_id": task_data.get("task_id")
            }

        except Exception as e:
            logger.error(f"Error in content analysis: {e}")
            return {"success": False, "error": str(e), "task_id": task_data.get("task_id")}

    async def _execute_trend_prediction(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """执行趋势预测任务"""
        try:
            # 使用趋势分析Agent
            if not self.trend_agent:
                return {"success": False, "error": "Trend agent not available"}

            result = await self.trend_agent.predict_trends(
                category=task_data.get("category"),
                time_horizon=task_data.get("time_horizon", 7),
                data_sources=task_data.get("data_sources", ["xiaohongshu"])
            )

            return {
                "success": True,
                "result": result,
                "task_id": task_data.get("task_id")
            }

        except Exception as e:
            logger.error(f"Error in trend prediction: {e}")
            return {"success": False, "error": str(e), "task_id": task_data.get("task_id")}

    async def _execute_brand_matching(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """执行品牌匹配任务"""
        try:
            # 使用品牌调性匹配器
            if not self.brand_matcher:
                return {"success": False, "error": "Brand matcher not available"}

            result = await self.brand_matcher.match_brand_personality(
                content=task_data.get("content"),
                brand_profile=task_data.get("brand_profile"),
                target_audience=task_data.get("target_audience")
            )

            return {
                "success": True,
                "result": result,
                "task_id": task_data.get("task_id")
            }

        except Exception as e:
            logger.error(f"Error in brand matching: {e}")
            return {"success": False, "error": str(e), "task_id": task_data.get("task_id")}

    async def _execute_content_optimization(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """执行内容优化任务"""
        try:
            # 使用互动优化器
            if not self.engagement_optimizer:
                return {"success": False, "error": "Engagement optimizer not available"}

            result = await self.engagement_optimizer.optimize_content(
                content=task_data.get("content"),
                optimization_goals=task_data.get("goals", ["engagement", "reach"]),
                target_audience=task_data.get("target_audience")
            )

            return {
                "success": True,
                "result": result,
                "task_id": task_data.get("task_id")
            }

        except Exception as e:
            logger.error(f"Error in content optimization: {e}")
            return {"success": False, "error": str(e), "task_id": task_data.get("task_id")}


async def main():
    """主函数"""
    import argparse

    parser = argparse.ArgumentParser(description="LaunchX v4.0 Agent OS")
    parser.add_argument("--config", type=str, help="Configuration file path")
    parser.add_argument("--task", type=str, help="Task type to execute")
    parser.add_argument("--task-data", type=str, help="Task data (JSON string)")

    args = parser.parse_args()

    # 创建启动器
    launcher = AgentOSLauncher(args.config)

    try:
        if args.task:
            # 执行单个任务
            if not await launcher.initialize():
                sys.exit(1)

            task_data = {}
            if args.task_data:
                task_data = json.loads(args.task_data)

            result = await launcher.execute_task(args.task, task_data)
            print(json.dumps(result, ensure_ascii=False, indent=2))

            await launcher.shutdown()
        else:
            # 启动完整系统
            await launcher.start()

    except KeyboardInterrupt:
        logger.info("Received interrupt signal")
    except Exception as e:
        logger.error(f"Fatal error: {e}")
        sys.exit(1)
    finally:
        await launcher.shutdown()


if __name__ == "__main__":
    asyncio.run(main())