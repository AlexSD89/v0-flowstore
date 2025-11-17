#!/usr/bin/env python3
"""
LaunchX-Serena Memory Bank 双向同步服务
实现LaunchX Memory Bank与Serena Memory的双向同步功能
"""

import time
import json
import hashlib
import logging
from pathlib import Path
from datetime import datetime

class MemorySyncService:
    def __init__(self, launchx_root):
        self.launchx_root = Path(launchx_root)
        self.memory_bank_path = self.launchx_root / "🛠️ 系统管理/memory-bank"
        self.serena_memories_path = self.launchx_root / ".serena" / "memories"
        self.sync_log = []
        self.serena_logs_dir = self.launchx_root / ".serena" / "logs"

        # 确保目录存在
        self.memory_bank_path.mkdir(parents=True, exist_ok=True)
        self.serena_memories_path.mkdir(parents=True, exist_ok=True)
        self.serena_logs_dir.mkdir(parents=True, exist_ok=True)

        # 配置日志
        self._setup_logging()

    def _setup_logging(self):
        """配置日志系统"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        log_file = self.serena_logs_dir / f"memory_sync_{timestamp}.log"

        # 创建logger
        self.logger = logging.getLogger('memory_sync')
        self.logger.setLevel(logging.INFO)

        # 避免重复添加handler
        if not self.logger.handlers:
            # 文件handler
            file_handler = logging.FileHandler(log_file, encoding='utf-8')
            file_handler.setLevel(logging.INFO)

            # 控制台handler
            console_handler = logging.StreamHandler()
            console_handler.setLevel(logging.INFO)

            # 格式化器
            formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                datefmt='%Y-%m-%d %H:%M:%S'
            )
            file_handler.setFormatter(formatter)
            console_handler.setFormatter(formatter)

            # 添加handler
            self.logger.addHandler(file_handler)
            self.logger.addHandler(console_handler)

        self.logger.info("Memory Sync Service 启动")

    def _generate_serena_filename(self, launchx_file):
        """生成规范化的Serena文件名，避免重复"""
        relative_path = launchx_file.relative_to(self.memory_bank_path)

        # 根据路径生成分类
        if 'support_modules' in str(relative_path):
            category = 'support_modules'
            name = launchx_file.stem
        elif 'scripts' in str(relative_path):
            category = 'scripts'
            name = launchx_file.stem
        elif 'MCP服务资产库' in str(relative_path):
            category = 'mcp_assets'
            name = launchx_file.stem
        else:
            category = 'general'
            name = launchx_file.stem

        # 添加时间戳避免重复
        timestamp = datetime.now().strftime('%Y%m%d')
        return f"{category}-{name}-{timestamp}.md"

    def calculate_file_hash(self, file_path):
        """计算文件MD5哈希值"""
        if not file_path.exists():
            return None

        hash_md5 = hashlib.md5()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_md5.update(chunk)
        return hash_md5.hexdigest()

    def convert_to_serena_format(self, source_file, source_content):
        """将LaunchX Memory Bank文件转换为Serena格式"""
        file_name = source_file.stem

        # 生成Serena格式的Memory
        serena_memory = f"""---
title: "{file_name}"
source: "LaunchX Memory Bank"
original_path: "{source_file.relative_to(self.launchx_root)}"
sync_timestamp: "{datetime.now().isoformat()}"
tags: ["launchx", "memory-bank", "auto-sync"]
---

# {file_name}

> **来源**: LaunchX Memory Bank
> **原始路径**: {source_file.relative_to(self.launchx_root)}
> **同步时间**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## 内容

{source_content}

---

*此Memory由LaunchX-Serena双向同步服务自动生成*
"""

        return serena_memory

    def convert_to_launchx_format(self, serena_file, serena_content):
        """将Serena Memory转换为LaunchX Memory Bank格式"""
        file_name = serena_file.stem

        # 提取主要内容（去掉frontmatter）
        lines = serena_content.split('\n')
        content_start = 0
        for i, line in enumerate(lines):
            if line.strip() == '---' and i > 0:
                content_start = i + 1
                break

        main_content = '\n'.join(lines[content_start:]).strip()

        # 生成LaunchX格式的文档
        launchx_doc = f"""---
title: "{file_name}"
owners: ["Serena Sync Service"]
status: "active"
last_update: "{datetime.now().strftime('%Y-%m-%d')}"
related: []
source: "Serena Memory (auto-sync)"
impact: "medium"
---

# {file_name}

> **来源**: Serena Memory自动同步
> **同步时间**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

{main_content}

---

## 同步信息

- **同步方向**: Serena → LaunchX
- **同步时间**: {datetime.now().isoformat()}
- **同步服务**: LaunchX-Serena Memory Bank双向同步服务
"""

        return launchx_doc

    def sync_launchx_to_serena(self):
        """同步LaunchX Memory Bank到Serena"""
        sync_count = 0

        # 扫描LaunchX Memory Bank中的所有.md文件
        for launchx_file in self.memory_bank_path.rglob("*.md"):
            if launchx_file.name.startswith('.'):
                continue

            # 获取对应的Serena Memory文件 - 规范化命名避免重复
            serena_file_name = self._generate_serena_filename(launchx_file)
            serena_file = self.serena_memories_path / serena_file_name

            # 检查是否需要同步
            launchx_hash = self.calculate_file_hash(launchx_file)
            serena_hash = self.calculate_file_hash(serena_file) if serena_file.exists() else None

            # 创建映射文件来跟踪同步状态
            sync_state_file = self.serena_memories_path / ".sync_state.json"
            sync_state = {}
            if sync_state_file.exists():
                with open(sync_state_file, 'r', encoding='utf-8') as f:
                    sync_state = json.load(f)

            file_key = str(launchx_file.relative_to(self.memory_bank_path))
            last_sync_hash = sync_state.get(file_key, {}).get('launchx_hash')

            # 检查内容是否重复（避免同步已有的内容）
            if serena_hash == launchx_hash:
                self.logger.debug(f"内容相同，跳过同步: {launchx_file.name}")
                continue

            if launchx_hash != last_sync_hash:
                # 需要同步
                launchx_content = launchx_file.read_text(encoding='utf-8')
                serena_content = self.convert_to_serena_format(launchx_file, launchx_content)

                # 写入Serena Memory
                serena_file.write_text(serena_content, encoding='utf-8')

                # 更新同步状态
                sync_state[file_key] = {
                    'launchx_hash': launchx_hash,
                    'serena_hash': self.calculate_file_hash(serena_file),
                    'last_sync': datetime.now().isoformat(),
                    'sync_direction': 'launchx_to_serena',
                    'original_path': str(launchx_file.relative_to(self.memory_bank_path))
                }

                sync_count += 1
                self.log_sync(f"LaunchX → Serena: {launchx_file.name} → {serena_file_name}")

        # 保存同步状态
        if sync_count > 0:
            with open(sync_state_file, 'w', encoding='utf-8') as f:
                json.dump(sync_state, f, ensure_ascii=False, indent=2)

        return sync_count

    def sync_serena_to_launchx(self):
        """同步Serena Memory到LaunchX Memory Bank"""
        sync_count = 0

        # 扫描Serena Memory中的所有文件
        for serena_file in self.serena_memories_path.glob("*.md"):
            if serena_file.name.startswith('.'):
                continue

            # 只同步非LaunchX来源的Memory（避免循环同步）
            serena_content = serena_file.read_text(encoding='utf-8')
            if 'source: "LaunchX Memory Bank"' in serena_content:
                continue

            # 生成对应的LaunchX文件路径
            launchx_relative_path = f"support_modules/{serena_file.name}"
            launchx_file = self.memory_bank_path / launchx_relative_path

            # 检查是否需要同步
            serena_hash = self.calculate_file_hash(serena_file)
            launchx_hash = self.calculate_file_hash(launchx_file) if launchx_file.exists() else None

            # 创建映射文件来跟踪同步状态
            sync_state_file = self.serena_memories_path / ".sync_state.json"
            sync_state = {}
            if sync_state_file.exists():
                with open(sync_state_file, 'r', encoding='utf-8') as f:
                    sync_state = json.load(f)

            file_key = f"serena_to_launchx/{serena_file.stem}"
            last_sync_hash = sync_state.get(file_key, {}).get('serena_hash')

            if serena_hash != last_sync_hash:
                # 需要同步
                launchx_content = self.convert_to_launchx_format(serena_file, serena_content)

                # 确保目标目录存在
                launchx_file.parent.mkdir(parents=True, exist_ok=True)

                # 写入LaunchX Memory Bank
                launchx_file.write_text(launchx_content, encoding='utf-8')

                # 更新同步状态
                sync_state[file_key] = {
                    'serena_hash': serena_hash,
                    'launchx_hash': self.calculate_file_hash(launchx_file),
                    'last_sync': datetime.now().isoformat(),
                    'sync_direction': 'serena_to_launchx'
                }

                sync_count += 1
                self.log_sync(f"Serena → LaunchX: {serena_file.name}")

        # 保存同步状态
        if sync_count > 0:
            with open(sync_state_file, 'w', encoding='utf-8') as f:
                json.dump(sync_state, f, ensure_ascii=False, indent=2)

        return sync_count

    def log_sync(self, message):
        """记录同步日志"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        log_entry = f"[{timestamp}] {message}"
        self.sync_log.append(log_entry)

        # 使用logger记录到文件
        self.logger.info(message)

        # 同时输出到控制台
        print(log_entry)

    def run_bidirectional_sync(self):
        """运行双向同步"""
        print("🔄 开始LaunchX-Serena双向同步...")

        # 1. LaunchX → Serena
        launchx_to_serena_count = self.sync_launchx_to_serena()

        # 2. Serena → LaunchX
        serena_to_launchx_count = self.sync_serena_to_launchx()

        total_synced = launchx_to_serena_count + serena_to_launchx_count

        print(f"✅ 双向同步完成:")
        print(f"   - LaunchX → Serena: {launchx_to_serena_count}个文件")
        print(f"   - Serena → LaunchX: {serena_to_launchx_count}个文件")
        print(f"   - 总计同步: {total_synced}个文件")

        return {
            'launchx_to_serena': launchx_to_serena_count,
            'serena_to_launchx': serena_to_launchx_count,
            'total': total_synced
        }

    def start_continuous_sync(self, interval=300):
        """启动持续同步服务"""
        print(f"🚀 启动持续同步服务，间隔: {interval}秒")

        try:
            while True:
                self.run_bidirectional_sync()
                time.sleep(interval)
        except KeyboardInterrupt:
            print("\n⏹️ 同步服务已停止")

def main():
    """主函数"""
    launchx_root = "/Users/dangsiyuan/Documents/obsidion/launch x"

    sync_service = MemorySyncService(launchx_root)

    # 运行一次同步测试
    result = sync_service.run_bidirectional_sync()

    if result['total'] > 0:
        print("✅ 双向同步功能验证通过")
    else:
        print("ℹ️ 没有需要同步的文件")

if __name__ == "__main__":
    main()