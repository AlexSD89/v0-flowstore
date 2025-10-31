"""
Configuration management utilities for LaunchX v4.0 Agent OS
"""

import json
import logging
from typing import Dict, Any, Optional
from pathlib import Path

logger = logging.getLogger(__name__)


class Config:
    """Configuration class for system settings"""

    def __init__(self, config_dict: Optional[Dict[str, Any]] = None):
        self.config = config_dict or {}

    def get(self, key: str, default: Any = None) -> Any:
        """Get configuration value"""
        try:
            keys = key.split('.')
            value = self.config
            for k in keys:
                if isinstance(value, dict) and k in value:
                    value = value[k]
                else:
                    return default
            return value
        except Exception:
            return default

    def set(self, key: str, value: Any):
        """Set configuration value"""
        keys = key.split('.')
        config = self.config
        for k in keys[:-1]:
            if k not in config:
                config[k] = {}
            config = config[k]
        config[keys[-1]] = value

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary"""
        return self.config.copy()

    @classmethod
    def from_file(cls, config_path: str) -> 'Config':
        """Load configuration from file"""
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                config_dict = json.load(f)
            return cls(config_dict)
        except Exception as e:
            logger.error(f"Failed to load config from {config_path}: {e}")
            return cls()

    def save_to_file(self, config_path: str):
        """Save configuration to file"""
        try:
            Path(config_path).parent.mkdir(parents=True, exist_ok=True)
            with open(config_path, 'w', encoding='utf-8') as f:
                json.dump(self.config, f, indent=2, ensure_ascii=False)
        except Exception as e:
            logger.error(f"Failed to save config to {config_path}: {e}")


def load_default_config() -> Config:
    """Load default configuration"""
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