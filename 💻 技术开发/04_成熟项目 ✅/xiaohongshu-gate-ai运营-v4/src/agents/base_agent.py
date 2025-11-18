"""
基础代理类

所有智能代理的基类，提供通用的代理功能
"""

import asyncio
import logging
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List
from datetime import datetime
import json

logger = logging.getLogger(__name__)


class BaseAgent(ABC):
    """基础代理类"""
    
    def __init__(self, name: str, config: Dict[str, Any] = None):
        """
        初始化基础代理
        
        Args:
            name: 代理名称
            config: 配置信息
        """
        self.name = name
        self.config = config or {}
        self.agent_id = f"{name}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}"
        self.created_at = datetime.utcnow()
        self.last_used = None
        self.execution_count = 0
        
        # 从配置中获取代理特定设置
        self.llm_model = self.config.get('llm_model', 'claude-3-sonnet')
        self.temperature = self.config.get('temperature', 0.7)
        self.max_tokens = self.config.get('max_tokens', 3000)
        self.timeout = self.config.get('timeout', 300)
        
        logger.info(f"代理初始化完成: {self.name} ({self.agent_id})")
    
    @abstractmethod
    async def execute_task(self, input_data: Dict[str, Any], agent_config: Dict[str, Any]) -> Dict[str, Any]:
        """
        执行代理任务（子类必须实现）
        
        Args:
            input_data: 输入数据
            agent_config: 代理配置
            
        Returns:
            执行结果
        """
        pass
    
    @abstractmethod
    def get_capabilities(self) -> List[str]:
        """
        获取代理能力列表（子类必须实现）
        
        Returns:
            能力列表
        """
        pass
    
    async def validate_input(self, input_data: Dict[str, Any]) -> bool:
        """
        验证输入数据
        
        Args:
            input_data: 输入数据
            
        Returns:
            是否有效
        """
        # 基础验证
        if not input_data:
            logger.warning(f"{self.name}: 输入数据为空")
            return False
        
        # 子类可以重写此方法进行特定验证
        return True
    
    async def prepare_execution_context(self, input_data: Dict[str, Any], 
                                        agent_config: Dict[str, Any]) -> Dict[str, Any]:
        """
        准备执行上下文
        
        Args:
            input_data: 输入数据
            agent_config: 代理配置
            
        Returns:
            执行上下文
        """
        context = {
            'agent_id': self.agent_id,
            'agent_name': self.name,
            'execution_id': f"exec_{datetime.utcnow().strftime('%Y%m%d_%H%M%S_%f')}",
            'timestamp': datetime.utcnow().isoformat(),
            'input_data': input_data,
            'agent_config': agent_config,
            'llm_config': {
                'model': self.llm_model,
                'temperature': self.temperature,
                'max_tokens': self.max_tokens,
                'timeout': self.timeout
            }
        }
        
        return context
    
    async def log_execution_start(self, context: Dict[str, Any]):
        """记录执行开始"""
        self.last_used = datetime.utcnow()
        self.execution_count += 1
        
        logger.info(f"{self.name} 开始执行任务 (执行ID: {context['execution_id']})")
    
    async def log_execution_complete(self, context: Dict[str, Any], result: Dict[str, Any], 
                                      execution_time: float):
        """记录执行完成"""
        logger.info(f"{self.name} 执行完成 (执行ID: {context['execution_id']}, 耗时: {execution_time:.2f}秒)")
        
        # 记录执行统计
        self._update_execution_stats(execution_time, result)
    
    async def log_execution_error(self, context: Dict[str, Any], error: Exception):
        """记录执行错误"""
        logger.error(f"{self.name} 执行失败 (执行ID: {context['execution_id']}), 错误: {error}")
    
    def _update_execution_stats(self, execution_time: float, result: Dict[str, Any]):
        """更新执行统计"""
        # 这里可以实现执行统计的持久化
        # 例如：平均执行时间、成功率等
        pass
    
    async def get_agent_status(self) -> Dict[str, Any]:
        """
        获取代理状态
        
        Returns:
            代理状态信息
        """
        return {
            'agent_id': self.agent_id,
            'agent_name': self.name,
            'created_at': self.created_at.isoformat(),
            'last_used': self.last_used.isoformat() if self.last_used else None,
            'execution_count': self.execution_count,
            'capabilities': self.get_capabilities(),
            'llm_model': self.llm_model,
            'temperature': self.temperature,
            'max_tokens': self.max_tokens,
            'timeout': self.timeout,
            'status': 'ready'
        }
    
    async def health_check(self) -> Dict[str, Any]:
        """
        健康检查
        
        Returns:
            健康状态
        """
        health_status = {
            'agent_id': self.agent_id,
            'agent_name': self.name,
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat(),
            'checks': {}
        }
        
        # 基础健康检查
        try:
            # 检查配置
            if self.config:
                health_status['checks']['config'] = 'passed'
            else:
                health_status['checks']['config'] = 'warning'
            
            # 检查能力
            capabilities = self.get_capabilities()
            if capabilities:
                health_status['checks']['capabilities'] = 'passed'
                health_status['capabilities_count'] = len(capabilities)
            else:
                health_status['checks']['capabilities'] = 'failed'
                health_status['status'] = 'unhealthy'
            
            # 检查执行统计
            if self.execution_count > 0:
                health_status['checks']['execution_history'] = 'passed'
                health_status['total_executions'] = self.execution_count
            else:
                health_status['checks']['execution_history'] = 'warning'
                health_status['total_executions'] = 0
            
        except Exception as e:
            health_status['status'] = 'unhealthy'
            health_status['error'] = str(e)
        
        return health_status
    
    def __str__(self) -> str:
        return f"{self.name} ({self.agent_id})"
    
    def __repr__(self) -> str:
        return f"<{self.__class__.__name__}: {self.name} ({self.agent_id})>"