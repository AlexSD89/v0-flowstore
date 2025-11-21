"""
Base classes for AI models and components in LaunchX v4.0 Agent OS
"""

import asyncio
import logging
from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional
from datetime import datetime

logger = logging.getLogger(__name__)


class BaseModel(ABC):
    """基础模型类"""

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self.logger = logging.getLogger(f"{__name__}.{self.__class__.__name__}")
        self.is_initialized = False
        self.performance_metrics = {
            "total_requests": 0,
            "successful_requests": 0,
            "average_response_time": 0.0,
            "error_rate": 0.0
        }

    async def initialize(self) -> bool:
        """初始化模型"""
        try:
            await self._on_initialize()
            self.is_initialized = True
            self.logger.info(f"{self.__class__.__name__} initialized successfully")
            return True
        except Exception as e:
            self.logger.error(f"Failed to initialize {self.__class__.__name__}: {e}")
            return False

    async def shutdown(self):
        """关闭模型"""
        try:
            await self._on_shutdown()
            self.is_initialized = False
            self.logger.info(f"{self.__class__.__name__} shutdown successfully")
        except Exception as e:
            self.logger.error(f"Error during {self.__class__.__name__} shutdown: {e}")

    @abstractmethod
    async def _on_initialize(self):
        """子类实现的初始化逻辑"""
        pass

    @abstractmethod
    async def _on_shutdown(self):
        """子类实现的关闭逻辑"""
        pass

    async def is_healthy(self) -> bool:
        """健康检查"""
        return self.is_initialized

    def _update_metrics(self, success: bool, response_time: float):
        """更新性能指标"""
        self.performance_metrics["total_requests"] += 1

        if success:
            self.performance_metrics["successful_requests"] += 1

        # 更新平均响应时间
        total = self.performance_metrics["total_requests"]
        current_avg = self.performance_metrics["average_response_time"]
        self.performance_metrics["average_response_time"] = (
            (current_avg * (total - 1) + response_time) / total
        )

        # 更新错误率
        self.performance_metrics["error_rate"] = (
            (total - self.performance_metrics["successful_requests"]) / total * 100
        )


class BaseAIModel(BaseModel):
    """AI模型基类"""

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        super().__init__(config)
        self.model_version = "1.0.0"
        self.last_prediction_time = None
        self.prediction_count = 0

    async def predict(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """执行预测"""
        if not self.is_initialized:
            raise RuntimeError(f"{self.__class__.__name__} not initialized")

        start_time = datetime.now()
        try:
            result = await self._predict_internal(input_data)

            # 更新指标
            response_time = (datetime.now() - start_time).total_seconds()
            self._update_metrics(True, response_time)
            self.prediction_count += 1
            self.last_prediction_time = datetime.now()

            return result

        except Exception as e:
            response_time = (datetime.now() - start_time).total_seconds()
            self._update_metrics(False, response_time)
            self.logger.error(f"Prediction failed: {e}")
            raise

    @abstractmethod
    async def _predict_internal(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """子类实现的预测逻辑"""
        pass

    def get_model_info(self) -> Dict[str, Any]:
        """获取模型信息"""
        return {
            "model_name": self.__class__.__name__,
            "version": self.model_version,
            "is_initialized": self.is_initialized,
            "prediction_count": self.prediction_count,
            "last_prediction_time": self.last_prediction_time.isoformat() if self.last_prediction_time else None,
            "performance_metrics": self.performance_metrics.copy()
        }


class BaseAgent(BaseModel):
    """Agent基类"""

    def __init__(self, agent_id: str, config: Optional[Dict[str, Any]] = None):
        super().__init__(config)
        self.agent_id = agent_id
        self.task_history = []
        self.current_task = None

    async def process_task(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """处理任务"""
        if not self.is_initialized:
            raise RuntimeError(f"Agent {self.agent_id} not initialized")

        self.current_task = {
            "task_id": task_data.get("task_id", f"task_{int(datetime.now().timestamp())}"),
            "data": task_data,
            "status": "processing",
            "start_time": datetime.now()
        }

        try:
            result = await self._process_task_internal(task_data)

            self.current_task["status"] = "completed"
            self.current_task["end_time"] = datetime.now()
            self.current_task["result"] = result

            self.task_history.append(self.current_task.copy())

            return result

        except Exception as e:
            self.current_task["status"] = "failed"
            self.current_task["error"] = str(e)
            self.current_task["end_time"] = datetime.now()

            self.task_history.append(self.current_task.copy())
            self.logger.error(f"Task processing failed: {e}")
            raise
        finally:
            self.current_task = None

    @abstractmethod
    async def _process_task_internal(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """子类实现的任务处理逻辑"""
        pass

    def get_agent_status(self) -> Dict[str, Any]:
        """获取Agent状态"""
        return {
            "agent_id": self.agent_id,
            "agent_type": self.__class__.__name__,
            "is_initialized": self.is_initialized,
            "is_busy": self.current_task is not None,
            "current_task": self.current_task,
            "total_tasks_processed": len(self.task_history),
            "performance_metrics": self.performance_metrics.copy()
        }