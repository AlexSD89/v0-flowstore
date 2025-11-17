#!/usr/bin/env python3
"""
Serena日志管理器
确保Serena生成的所有日志文件都按规范存放到正确位置
"""

import os
import shutil
import glob
from pathlib import Path
from datetime import datetime, timedelta

class SerenaLogManager:
    def __init__(self, launchx_root):
        self.launchx_root = Path(launchx_root)
        self.serena_logs_dir = self.launchx_root / ".serena" / "logs"
        self.memory_bank_logs_dir = self.launchx_root / "🛠️ 系统管理" / "memory-bank" / "logs"

        # 确保目录存在
        self.serena_logs_dir.mkdir(parents=True, exist_ok=True)
        self.memory_bank_logs_dir.mkdir(parents=True, exist_ok=True)

    def scan_and_organize_logs(self):
        """扫描并整理所有Serena相关日志"""
        print("🔍 扫描Serena日志文件...")

        organized_count = 0

        # 1. 查找根目录下的Serena日志
        root_pattern = str(self.launchx_root / "*serena*.log")
        for log_file in glob.glob(root_pattern):
            if self._organize_log_file(log_file):
                organized_count += 1

        # 2. 查找.serena目录下的日志
        serena_pattern = str(self.launchx_root / ".serena" / "*.log")
        for log_file in glob.glob(serena_pattern):
            if self._organize_log_file(log_file):
                organized_count += 1

        # 3. 查找项目中的其他日志文件
        for log_file in self.launchx_root.rglob("*.log"):
            if "serena" in log_file.name.lower() or "mcp" in log_file.name.lower():
                if self._organize_log_file(log_file):
                    organized_count += 1

        print(f"✅ 整理完成，共处理 {organized_count} 个日志文件")
        return organized_count

    def _organize_log_file(self, log_file_path):
        """整理单个日志文件"""
        source_path = Path(log_file_path)

        if not source_path.exists():
            return False

        # 根据文件名确定分类
        category = self._determine_log_category(source_path.name)

        # 生成目标文件名
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        target_name = f"{category}_{timestamp}_{source_path.name}"

        # 移动到.serena/logs
        serena_target = self.serena_logs_dir / target_name
        shutil.move(str(source_path), str(serena_target))

        # 复制到memory-bank/logs作为归档
        memory_bank_target = self.memory_bank_logs_dir / target_name
        shutil.copy2(str(serena_target), str(memory_bank_target))

        print(f"  📁 整理: {source_path.name} -> {category}/")

        return True

    def _determine_log_category(self, filename):
        """根据文件名确定日志分类"""
        filename_lower = filename.lower()

        if "mcp" in filename_lower or "server" in filename_lower:
            return "mcp_server"
        elif "sync" in filename_lower or "memory" in filename_lower:
            return "memory_sync"
        elif "ai" in filename_lower or "enhance" in filename_lower:
            return "ai_enhancement"
        elif "web" in filename_lower or "dashboard" in filename_lower:
            return "web_dashboard"
        else:
            return "main"

    def create_log_index(self):
        """创建日志索引文件"""
        print("📋 创建日志索引...")

        index_file = self.memory_bank_logs_dir / "log_index.md"

        # 收集所有日志文件信息
        log_files = []
        for log_file in self.memory_bank_logs_dir.glob("*.log"):
            stat = log_file.stat()
            log_files.append({
                'name': log_file.name,
                'size': stat.st_size,
                'modified': datetime.fromtimestamp(stat.st_mtime),
                'category': self._determine_log_category(log_file.name)
            })

        # 按修改时间排序
        log_files.sort(key=lambda x: x['modified'], reverse=True)

        # 生成索引内容
        content = f"""---
title: "Serena日志索引"
owners: ["LaunchX System Team"]
status: "active"
last_update: "{datetime.now().strftime('%Y-%m-%d')}"
source: "Serena日志管理器自动生成"
impact: "medium"
---

# Serena日志索引

> **生成时间**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
> **日志总数**: {len(log_files)} 个文件
> **存储位置**: `.serena/logs/` 和 `🛠️ 系统管理/memory-bank/logs/`

---

## 📊 日志统计

### 按分类统计
"""

        # 统计各类别数量
        categories = {}
        for log_file in log_files:
            category = log_file['category']
            categories[category] = categories.get(category, 0) + 1

        for category, count in categories.items():
            content += f"- **{category}**: {count} 个文件\n"

        content += f"""
### 按时间统计
- **最近24小时**: {len([f for f in log_files if f['modified'] > datetime.now() - timedelta(days=1)])} 个文件
- **最近7天**: {len([f for f in log_files if f['modified'] > datetime.now() - timedelta(days=7)])} 个文件
- **最近30天**: {len([f for f in log_files if f['modified'] > datetime.now() - timedelta(days=30)])} 个文件

---

## 📋 日志文件列表

| 文件名 | 分类 | 大小 | 修改时间 |
|--------|------|------|----------|
"""

        # 添加文件列表
        for log_file in log_files:
            size_mb = log_file['size'] / (1024 * 1024)
            size_str = f"{size_mb:.2f}MB" if size_mb >= 1 else f"{log_file['size']}B"

            content += f"| {log_file['name']} | {log_file['category']} | {size_str} | {log_file['modified'].strftime('%Y-%m-%d %H:%M:%S')} |\n"

        content += f"""

---

## 🔍 日志分类说明

- **main**: Serena主系统日志
- **mcp_server**: MCP服务器运行日志
- **memory_sync**: Memory Bank双向同步日志
- **ai_enhancement**: AI增强功能日志
- **web_dashboard**: Web仪表板访问日志

---

## 🛠️ 日志管理

### 查看日志
```bash
# 查看最新主日志
tail -f .serena/logs/serena.log

# 查看同步日志
tail -f .serena/logs/memory_sync_*.log

# 查看MCP服务器日志
tail -f .serena/logs/mcp_server_*.log
```

### 清理旧日志
```bash
# 删除30天前的日志
python3 🛠️\\ 系统管理/memory-bank/scripts/serena_log_manager.py --cleanup-days 30
```

---

*此索引由Serena日志管理器自动生成，最后更新时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*
"""

        # 写入索引文件
        with open(index_file, 'w', encoding='utf-8') as f:
            f.write(content)

        print(f"  📄 日志索引已创建: {index_file}")
        return index_file

    def cleanup_old_logs(self, days=30):
        """清理旧的日志文件"""
        print(f"🧹 清理 {days} 天前的日志文件...")

        cutoff_time = datetime.now() - timedelta(days=days)
        deleted_count = 0

        # 清理.serena/logs中的旧文件
        for log_file in self.serena_logs_dir.glob("*.log"):
            if datetime.fromtimestamp(log_file.stat().st_mtime) < cutoff_time:
                log_file.unlink()
                deleted_count += 1

        print(f"  ✅ 已删除 {deleted_count} 个旧日志文件")
        return deleted_count

def main():
    """主函数"""
    import argparse

    parser = argparse.ArgumentParser(description='Serena日志管理器')
    parser.add_argument('--cleanup-days', type=int, help='清理N天前的日志文件')

    args = parser.parse_args()

    launchx_root = "/Users/dangsiyuan/Documents/obsidion/launch x"
    log_manager = SerenaLogManager(launchx_root)

    if args.cleanup_days:
        log_manager.cleanup_old_logs(args.cleanup_days)
    else:
        # 整理现有日志
        log_manager.scan_and_organize_logs()

        # 创建日志索引
        log_manager.create_log_index()

        print("\n🎉 Serena日志管理完成！")
        print("📁 主日志目录: .serena/logs/")
        print("📁 归档目录: 🛠️ 系统管理/memory-bank/logs/")
        print("📄 日志索引: 🛠️ 系统管理/memory-bank/logs/log_index.md")

if __name__ == "__main__":
    main()