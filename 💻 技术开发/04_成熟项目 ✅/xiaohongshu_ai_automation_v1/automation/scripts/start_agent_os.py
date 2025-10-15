#!/usr/bin/env python3
"""
LaunchX v4.0 Agent OS 启动脚本
一键启动完整的AI协作系统
"""

import os
import sys
import json
import asyncio
import logging
from pathlib import Path

# 添加src目录到路径
project_root = Path(__file__).parent.parent
src_path = project_root / "src"
sys.path.insert(0, str(src_path))

from agent_os_launcher import AgentOSLauncher

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)


def print_banner():
    """打印启动横幅"""
    banner = """
    ╔══════════════════════════════════════════════════════════════╗
    ║                LaunchX v4.0 Agent OS                       ║
    ║              智能协作AI系统 - 小红书专用版                      ║
    ║                                                              ║
    ║  🚀 Agent OS - 智能代理操作系统                               ║
    ║  🤖 专业AI协作 - 1+1>2 协同效应                              ║
    ║  📊 实时学习 - 自我优化能力                                   ║
    ║  🎯 小红书专用 - 爆款识别、趋势预测、内容优化                    ║
    ║  📈 企业级监控 - 深度业务洞察                                 ║
    ╚══════════════════════════════════════════════════════════════╝
    """
    print(banner)


async def main():
    """主函数"""
    print_banner()

    try:
        # 检查配置文件
        config_path = project_root / "config" / "agent_os_config.json"
        if not config_path.exists():
            logger.error(f"Configuration file not found: {config_path}")
            sys.exit(1)

        # 创建数据目录
        data_dir = project_root / "data"
        data_dir.mkdir(exist_ok=True)

        # 创建日志目录
        log_dir = project_root / "logs"
        log_dir.mkdir(exist_ok=True)

        logger.info("Starting LaunchX v4.0 Agent OS...")
        logger.info(f"Project root: {project_root}")
        logger.info(f"Config file: {config_path}")

        # 创建启动器
        launcher = AgentOSLauncher(str(config_path))

        # 启动系统
        success = await launcher.start()
        if not success:
            logger.error("Failed to start Agent OS")
            sys.exit(1)

    except KeyboardInterrupt:
        logger.info("Received interrupt signal, shutting down...")
    except Exception as e:
        logger.error(f"Fatal error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())