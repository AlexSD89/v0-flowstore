#!/usr/bin/env python3
"""
Agent OS v2.0 配置管理
四层BMAD混合智能架构的统一配置系统
"""

from __future__ import annotations

import json
import yaml
from pathlib import Path
from typing import Dict, Any, Optional, List
from dataclasses import dataclass, asdict
import os
from datetime import datetime

@dataclass
class MCPConfig:
    """MCP配置"""
    servers: Dict[str, Any]
    connection_pool: Dict[str, Any]
    scheduler: Dict[str, Any]
    timeout_settings: Dict[str, int]

@dataclass
class ContextConfig:
    """上下文管理配置"""
    cache_size: int
    context_window: int
    session_timeout: int
    context_retention_policy: str

@dataclass
class QualityConfig:
    """质量控制配置"""
    quality_gates: Dict[str, Any]
    approval_workflows: Dict[str, Any]
    quality_metrics: List[str]
    auto_approval_thresholds: Dict[str, float]

@dataclass
class KnowledgeConfig:
    """知识库配置"""
    knowledge_graph_path: str
    learning_rate: float
    pattern_threshold: float
    update_frequency: str

@dataclass
class PersistenceConfig:
    """持久化配置"""
    database_path: str
    backup_strategy: str
    cache_layers: Dict[str, Any]
    data_retention: Dict[str, int]

@dataclass
class AgentOSConfig:
    """Agent OS主配置"""
    version: str
    mcp_config: MCPConfig
    context_config: ContextConfig
    quality_config: QualityConfig
    knowledge_config: KnowledgeConfig
    persistence_config: PersistenceConfig
    system_settings: Dict[str, Any]

class ConfigLoader:
    """配置加载器"""

    @staticmethod
    def load_from_file(config_path: Path) -> Dict[str, Any]:
        """从文件加载配置"""

        if not config_path.exists():
            raise FileNotFoundError(f"配置文件不存在: {config_path}")

        with open(config_path, 'r', encoding='utf-8') as f:
            if config_path.suffix.lower() == '.json':
                return json.load(f)
            elif config_path.suffix.lower() in ['.yml', '.yaml']:
                return yaml.safe_load(f)
            else:
                raise ValueError(f"不支持的配置文件格式: {config_path.suffix}")

class AgentOSConfig:
    """Agent OS配置管理器"""

    def __init__(self, config_data: Optional[Dict[str, Any]] = None,
                 config_path: Optional[Path] = None):

        if config_data:
            self.config_data = config_data
        elif config_path:
            self.config_data = ConfigLoader.load_from_file(config_path)
        else:
            # 使用默认配置
            self.config_data = self._get_default_config()

        self._validate_config()
        self._initialize_sub_configs()

    @classmethod
    def load_config(cls, config_path: Optional[Path] = None) -> 'AgentOSConfig':
        """加载配置"""
        return cls(config_path=config_path)

    def _get_default_config(self) -> Dict[str, Any]:
        """获取默认配置"""

        return {
            "version": "2.0.0",
            "system_settings": {
                "environment": "production",
                "debug_mode": False,
                "log_level": "INFO",
                "max_concurrent_sessions": 100,
                "system_language": "zh-CN"
            },

            "mcp_config": {
                "servers": {
                    "tavily-search": {
                        "enabled": True,
                        "base_url": "http://localhost:3001",
                        "api_key": os.getenv("TAVILY_API_KEY", ""),
                        "search_strategy": "multi_source_intelligence",
                        "timeout": 30
                    },
                    "xiaohongshu-mcp": {
                        "enabled": True,
                        "base_url": "http://localhost:3002",
                        "data_scope": "comprehensive_platform_data",
                        "monitoring_depth": "detailed_analytics",
                        "timeout": 45
                    },
                    "workspace-filesystem": {
                        "enabled": True,
                        "base_path": str(Path.cwd()),
                        "access_level": "full_workspace",
                        "backup_strategy": "automatic_incremental"
                    },
                    "python-sandbox": {
                        "enabled": True,
                        "memory_limit": "4GB",
                        "execution_timeout": 300,
                        "library_support": ["pandas", "numpy", "scikit-learn", "matplotlib"]
                    },
                    "rube-workflow": {
                        "enabled": False,
                        "base_url": "http://localhost:3003",
                        "workflow_types": ["customer_service", "content_strategy", "data_analysis"],
                        "cross_app_integration": True
                    },
                    "playwright-automation": {
                        "enabled": False,
                        "base_url": "http://localhost:3004",
                        "browser_types": ["chromium", "firefox"],
                        "automation_scope": ["content_publishing", "data_scraping"]
                    },
                    "context7-knowledge": {
                        "enabled": False,
                        "base_url": "http://localhost:3005",
                        "knowledge_domains": ["business", "marketing", "technology"],
                        "update_frequency": "daily"
                    }
                },
                "connection_pool": {
                    "max_connections_per_server": 10,
                    "connection_timeout": 30,
                    "keep_alive": True,
                    "retry_attempts": 3
                },
                "scheduler": {
                    "max_concurrent_tasks": 50,
                    "task_timeout": 300,
                    "priority_levels": 3,
                    "load_balancing_strategy": "round_robin"
                },
                "timeout_settings": {
                    "default_timeout": 30,
                    "long_running_timeout": 300,
                    "quick_task_timeout": 10
                }
            },

            "context_config": {
                "cache_size": 1000,
                "context_window": 10000,
                "session_timeout": 3600,
                "context_retention_policy": "lru_with_ttl",
                "max_context_depth": 10,
                "context_compression": True
            },

            "quality_config": {
                "quality_gates": {
                    "input_quality": {
                        "enabled": True,
                        "data_completeness_threshold": 0.9,
                        "accuracy_threshold": 0.85,
                        "relevance_threshold": 0.8,
                        "auto_approval": True
                    },
                    "process_quality": {
                        "enabled": True,
                        "logical_consistency_threshold": 0.9,
                        "methodology_appropriateness_threshold": 0.85,
                        "resource_efficiency_threshold": 0.75,
                        "auto_approval": False
                    },
                    "output_quality": {
                        "enabled": True,
                        "goal_alignment_threshold": 0.9,
                        "actionability_threshold": 0.85,
                        "innovation_level_threshold": 0.7,
                        "auto_approval": False
                    }
                },
                "approval_workflows": {
                    "automatic_approval": {
                        "conditions": ["all_quality_gates_passed", "low_risk_assessment"],
                        "confidence_threshold": 0.9
                    },
                    "human_review": {
                        "required_for": ["high_risk_tasks", "strategic_decisions"],
                        "review_timeout": 7200,
                        "escalation_rules": ["no_response_within_timeout", "quality_score_below_threshold"]
                    }
                },
                "quality_metrics": [
                    "accuracy",
                    "completeness",
                    "consistency",
                    "relevance",
                    "actionability",
                    "innovation_level"
                ],
                "auto_approval_thresholds": {
                    "low_complexity": 0.9,
                    "medium_complexity": 0.85,
                    "high_complexity": 0.8
                }
            },

            "knowledge_config": {
                "knowledge_graph_path": "./data/knowledge_graph.db",
                "learning_rate": 0.01,
                "pattern_threshold": 0.7,
                "update_frequency": "daily",
                "max_patterns_per_session": 100,
                "pattern_validation_enabled": True,
                "knowledge_retention_days": 365
            },

            "persistence_config": {
                "database_path": "./data/agent_os.db",
                "backup_strategy": "incremental_with_full_weekly",
                "cache_layers": {
                    "l1_memory": {
                        "enabled": True,
                        "max_size": 1000,
                        "ttl": 3600
                    },
                    "l2_redis": {
                        "enabled": True,
                        "host": "localhost",
                        "port": 6379,
                        "ttl": 86400
                    },
                    "l3_disk": {
                        "enabled": True,
                        "path": "./cache",
                        "max_size_gb": 10,
                        "ttl": 604800
                    }
                },
                "data_retention": {
                    "session_data_days": 30,
                    "analysis_results_days": 90,
                    "knowledge_graph_days": 365,
                    "logs_days": 7
                }
            }
        }

    def _validate_config(self):
        """验证配置有效性"""

        required_sections = [
            "system_settings",
            "mcp_config",
            "context_config",
            "quality_config",
            "knowledge_config",
            "persistence_config"
        ]

        for section in required_sections:
            if section not in self.config_data:
                raise ValueError(f"缺少必要配置节: {section}")

    def _initialize_sub_configs(self):
        """初始化子配置对象"""

        self.mcp_config = MCPConfig(**self.config_data["mcp_config"])
        self.context_config = ContextConfig(**self.config_data["context_config"])
        self.quality_config = QualityConfig(**self.config_data["quality_config"])
        self.knowledge_config = KnowledgeConfig(**self.config_data["knowledge_config"])
        self.persistence_config = PersistenceConfig(**self.config_data["persistence_config"])

        self.version = self.config_data["version"]
        self.system_settings = self.config_data["system_settings"]

    def get_server_config(self, server_name: str) -> Optional[Dict[str, Any]]:
        """获取特定MCP服务器配置"""
        return self.mcp_config.servers.get(server_name)

    def is_server_enabled(self, server_name: str) -> bool:
        """检查MCP服务器是否启用"""
        server_config = self.get_server_config(server_name)
        return server_config is not None and server_config.get("enabled", False)

    def get_enabled_servers(self) -> List[str]:
        """获取所有启用的MCP服务器"""
        return [
            name for name, config in self.mcp_config.servers.items()
            if config.get("enabled", False)
        ]

    def update_config(self, section: str, updates: Dict[str, Any]):
        """更新配置"""
        if section in self.config_data:
            self.config_data[section].update(updates)
            self._initialize_sub_configs()
        else:
            raise ValueError(f"未知配置节: {section}")

    def save_config(self, output_path: Path):
        """保存配置到文件"""

        # 确保目录存在
        output_path.parent.mkdir(parents=True, exist_ok=True)

        with open(output_path, 'w', encoding='utf-8') as f:
            if output_path.suffix.lower() == '.json':
                json.dump(self.config_data, f, indent=2, ensure_ascii=False)
            elif output_path.suffix.lower() in ['.yml', '.yaml']:
                yaml.dump(self.config_data, f, default_flow_style=False, allow_unicode=True)
            else:
                raise ValueError(f"不支持的配置文件格式: {output_path.suffix}")

    def get_quality_gate_config(self, gate_name: str) -> Optional[Dict[str, Any]]:
        """获取质量门禁配置"""
        return self.quality_config.quality_gates.get(gate_name)

    def is_quality_gate_enabled(self, gate_name: str) -> bool:
        """检查质量门禁是否启用"""
        gate_config = self.get_quality_gate_config(gate_name)
        return gate_config is not None and gate_config.get("enabled", False)

    def get_cache_config(self, layer: str) -> Optional[Dict[str, Any]]:
        """获取缓存层配置"""
        return self.persistence_config.cache_layers.get(layer)

    def is_cache_enabled(self, layer: str) -> bool:
        """检查缓存层是否启用"""
        cache_config = self.get_cache_config(layer)
        return cache_config is not None and cache_config.get("enabled", False)

    def validate_environment(self) -> Dict[str, Any]:
        """验证环境配置"""

        validation_results = {
            "valid": True,
            "issues": [],
            "warnings": []
        }

        # 检查必要的环境变量
        required_env_vars = {
            "TAVILY_API_KEY": "tavily-search需要API密钥",
        }

        for var_name, description in required_env_vars.items():
            if not os.getenv(var_name):
                if self.get_server_config(var_name.split('_')[0].lower()):
                    validation_results["issues"].append(f"缺少环境变量 {var_name}: {description}")
                    validation_results["valid"] = False

        # 检查目录权限
        required_dirs = [
            Path(self.persistence_config.database_path).parent,
            Path(self.knowledge_config.knowledge_graph_path).parent,
        ]

        for dir_path in required_dirs:
            if not dir_path.exists():
                try:
                    dir_path.mkdir(parents=True, exist_ok=True)
                except PermissionError:
                    validation_results["issues"].append(f"无法创建目录: {dir_path}")
                    validation_results["valid"] = False

        # 检查磁盘空间
        import shutil
        total_space = shutil.disk_usage(Path.cwd()).total
        free_space = shutil.disk_usage(Path.cwd()).free

        if free_space < 1024 * 1024 * 1024:  # 1GB
            validation_results["warnings"].append(f"磁盘空间不足: {free_space / (1024**3):.2f}GB 可用")

        return validation_results

    def get_system_info(self) -> Dict[str, Any]:
        """获取系统信息"""

        return {
            "version": self.version,
            "environment": self.system_settings.get("environment"),
            "debug_mode": self.system_settings.get("debug_mode", False),
            "enabled_mcp_servers": self.get_enabled_servers(),
            "quality_gates_enabled": [
                name for name in self.quality_config.quality_gates.keys()
                if self.is_quality_gate_enabled(name)
            ],
            "cache_layers_enabled": [
                layer for layer in self.persistence_config.cache_layers.keys()
                if self.is_cache_enabled(layer)
            ],
            "config_loaded_at": datetime.now().isoformat()
        }

# 配置工厂函数
def create_production_config() -> AgentOSConfig:
    """创建生产环境配置"""
    config_data = AgentOSConfig()._get_default_config()
    config_data["system_settings"]["environment"] = "production"
    config_data["system_settings"]["debug_mode"] = False
    config_data["system_settings"]["log_level"] = "INFO"
    return AgentOSConfig(config_data=config_data)

def create_development_config() -> AgentOSConfig:
    """创建开发环境配置"""
    config_data = AgentOSConfig()._get_default_config()
    config_data["system_settings"]["environment"] = "development"
    config_data["system_settings"]["debug_mode"] = True
    config_data["system_settings"]["log_level"] = "DEBUG"
    return AgentOSConfig(config_data=config_data)

def create_testing_config() -> AgentOSConfig:
    """创建测试环境配置"""
    config_data = AgentOSConfig()._get_default_config()
    config_data["system_settings"]["environment"] = "testing"
    config_data["system_settings"]["debug_mode"] = True
    config_data["system_settings"]["log_level"] = "DEBUG"
    # 减少测试环境的资源使用
    config_data["context_config"]["cache_size"] = 100
    config_data["system_settings"]["max_concurrent_sessions"] = 10
    return AgentOSConfig(config_data=config_data)