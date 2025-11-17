#!/usr/bin/env python3
"""
Memory Bank日志系统初始化脚本
自动创建和配置完整的日志记录系统
"""

import os
import logging
import logging.handlers
from pathlib import Path
from datetime import datetime

class LoggingSystemInitializer:
    def __init__(self, launchx_root):
        self.launchx_root = Path(launchx_root)
        self.serena_logs_dir = self.launchx_root / ".serena" / "logs"
        self.memory_bank_logs_dir = self.launchx_root / "🛠️ 系统管理" / "memory-bank" / "logs"

        # 确保日志目录存在
        self.serena_logs_dir.mkdir(parents=True, exist_ok=True)
        self.memory_bank_logs_dir.mkdir(parents=True, exist_ok=True)

        # 日志配置
        self.log_categories = {
            'serena_main': {
                'file': 'serena.log',
                'description': 'Serena主服务日志',
                'max_size': 10 * 1024 * 1024,  # 10MB
                'backup_count': 5
            },
            'memory_sync': {
                'file': 'memory_sync.log',
                'description': 'Memory Bank双向同步日志',
                'max_size': 5 * 1024 * 1024,   # 5MB
                'backup_count': 3
            },
            'web_dashboard': {
                'file': 'web_dashboard.log',
                'description': 'Web仪表板访问日志',
                'max_size': 5 * 1024 * 1024,   # 5MB
                'backup_count': 3
            },
            'ai_enhancement': {
                'file': 'ai_enhancement.log',
                'description': 'AI功能增强日志',
                'max_size': 3 * 1024 * 1024,   # 3MB
                'backup_count': 2
            },
            'system_monitor': {
                'file': 'system_monitor.log',
                'description': '系统监控日志',
                'max_size': 8 * 1024 * 1024,   # 8MB
                'backup_count': 4
            }
        }

    def initialize_logging_system(self):
        """初始化完整的日志系统"""
        print("🚀 初始化Memory Bank日志系统...")

        # 创建各类日志文件
        for category, config in self.log_categories.items():
            self._create_log_file(category, config)

        # 创建日志索引文件
        self._create_log_index()

        # 创建日志管理配置
        self._create_log_config()

        # 记录初始化日志
        self._log_initialization()

        print("✅ 日志系统初始化完成")

    def _create_log_file(self, category, config):
        """创建单个日志文件"""
        log_file = self.serena_logs_dir / config['file']

        # 创建空日志文件（如果不存在）
        if not log_file.exists():
            log_file.touch()
            print(f"  📄 创建日志: {config['file']} ({config['description']})")

            # 写入日志头部信息
            header = f"""# {config['description']}
# 创建时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
# 日志大小限制: {config['max_size'] // (1024*1024)}MB
# 备份文件数: {config['backup_count']}

"""
            log_file.write_text(header, encoding='utf-8')

        # 创建归档目录
        archive_dir = self.memory_bank_logs_dir / category
        archive_dir.mkdir(exist_ok=True)

    def _create_log_index(self):
        """创建日志索引文件"""
        index_content = f"""---
title: "Memory Bank日志系统索引"
owners: ["LaunchX Memory Team"]
status: "active"
last_update: "{datetime.now().strftime('%Y-%m-%d')}"
source: "日志系统自动生成"
impact: "medium"
---

# Memory Bank日志系统索引

> **初始化时间**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
> **日志目录**: `.serena/logs/`
> **归档目录**: `🛠️ 系统管理/memory-bank/logs/`

---

## 📊 日志分类

| 类别 | 文件名 | 描述 | 大小限制 | 备份数量 |
|------|--------|------|----------|----------|
"""

        for category, config in self.log_categories.items():
            index_content += f"| {category} | {config['file']} | {config['description']} | {config['max_size'] // (1024*1024)}MB | {config['backup_count']} |\n"

        index_content += f"""

---

## 🛠️ 管理命令

### 查看实时日志
```bash
# 查看Serena主日志
tail -f .serena/logs/serena.log

# 查看同步日志
tail -f .serena/logs/memory_sync.log

# 查看Web仪表板日志
tail -f .serena/logs/web_dashboard.log
```

### 日志轮转管理
```bash
# 手动执行日志轮转
python3 🛠️\\ 系统管理/memory-bank/scripts/serena_log_manager.py --rotate

# 清理旧日志
python3 🛠️\\ 系统管理/memory-bank/scripts/serena_log_manager.py --cleanup
```

### 日志分析
```bash
# 生成日志分析报告
python3 🛠️\\ 系统管理/memory-bank/scripts/serena_log_manager.py --analyze
```

---

*此索引由日志系统自动生成*
"""

        index_file = self.serena_logs_dir / "log_index.md"
        index_file.write_text(index_content, encoding='utf-8')
        print(f"  📋 创建日志索引: log_index.md")

    def _create_log_config(self):
        """创建日志配置文件"""
        config_content = {
            "version": 1,
            "disable_existing_loggers": False,
            "formatters": {
                "standard": {
                    "format": "%(asctime)s [%(levelname)s] %(name)s: %(message)s",
                    "datefmt": "%Y-%m-%d %H:%M:%S"
                },
                "detailed": {
                    "format": "%(asctime)s [%(levelname)s] %(name)s:%(lineno)d: %(message)s",
                    "datefmt": "%Y-%m-%d %H:%M:%S"
                }
            },
            "handlers": {
                "console": {
                    "class": "logging.StreamHandler",
                    "level": "INFO",
                    "formatter": "standard",
                    "stream": "ext://sys.stdout"
                }
            },
            "loggers": {
                "": {
                    "level": "INFO",
                    "handlers": ["console"],
                    "propagate": False
                }
            }
        }

        # 为每个日志类别添加处理器
        for category, config in self.log_categories.items():
            handler_name = f"{category}_handler"
            config_content["handlers"][handler_name] = {
                "class": "logging.handlers.RotatingFileHandler",
                "level": "INFO",
                "formatter": "detailed",
                "filename": str(self.serena_logs_dir / config['file']),
                "maxBytes": config['max_size'],
                "backupCount": config['backup_count'],
                "encoding": "utf-8"
            }

            logger_name = category.replace('_', '.')
            config_content["loggers"][logger_name] = {
                "level": "INFO",
                "handlers": ["console", handler_name],
                "propagate": False
            }

        import json
        config_file = self.serena_logs_dir / "logging_config.json"
        with open(config_file, 'w', encoding='utf-8') as f:
            json.dump(config_content, f, indent=2, ensure_ascii=False)

        print(f"  ⚙️ 创建日志配置: logging_config.json")

    def _log_initialization(self):
        """记录初始化日志"""
        import json

        # 加载配置
        config_file = self.serena_logs_dir / "logging_config.json"
        with open(config_file, 'r', encoding='utf-8') as f:
            config = json.load(f)

        # 应用配置
        import logging.config
        logging.config.dictConfig(config)

        # 记录初始化日志
        logger = logging.getLogger('serena.main')
        logger.info("="*60)
        logger.info("Memory Bank日志系统初始化完成")
        logger.info(f"初始化时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        logger.info(f"日志目录: {self.serena_logs_dir}")
        logger.info(f"归档目录: {self.memory_bank_logs_dir}")
        logger.info(f"日志类别数量: {len(self.log_categories)}")
        for category, config in self.log_categories.items():
            logger.info(f"  - {category}: {config['file']}")
        logger.info("="*60)

def main():
    """主函数"""
    launchx_root = "/Users/dangsiyuan/Documents/obsidion/launch x"
    initializer = LoggingSystemInitializer(launchx_root)
    initializer.initialize_logging_system()

if __name__ == "__main__":
    main()