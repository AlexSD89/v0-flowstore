"""
Core utilities module for LaunchX v4.0 Agent OS
Provides common utilities and helper functions
"""

import logging
import time
from typing import Dict, List, Any, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

def setup_logging(level: str = "INFO") -> None:
    """设置日志配置"""
    logging.basicConfig(
        level=getattr(logging, level.upper()),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(),
            logging.FileHandler('launchx_agent_os.log')
        ]
    )

def validate_config(config: Dict[str, Any], required_keys: List[str]) -> bool:
    """验证配置是否包含必需的键"""
    for key in required_keys:
        if key not in config:
            logger.error(f"Missing required config key: {key}")
            return False
    return True

def format_timestamp(timestamp: Optional[float] = None) -> str:
    """格式化时间戳"""
    if timestamp is None:
        timestamp = time.time()
    return datetime.fromtimestamp(timestamp).strftime("%Y-%m-%d %H:%M:%S")

def calculate_success_rate(success_count: int, total_count: int) -> float:
    """计算成功率"""
    if total_count == 0:
        return 0.0
    return (success_count / total_count) * 100

def safe_get(data: Dict[str, Any], key: str, default: Any = None) -> Any:
    """安全获取字典值"""
    try:
        return data.get(key, default)
    except (AttributeError, TypeError):
        return default

def sanitize_text(text: str) -> str:
    """清理文本内容"""
    if not isinstance(text, str):
        return str(text)
    # 移除多余的空白字符
    return ' '.join(text.split())

def generate_task_id() -> str:
    """生成任务ID"""
    return f"task_{int(time.time() * 1000)}"