#!/usr/bin/env python3
"""
Serena Memories管理器
清理、规范化和组织Serena Memory存储
"""

import os
import shutil
import json
import hashlib
from pathlib import Path
from datetime import datetime, timedelta

class SerenaMemoriesManager:
    def __init__(self, launchx_root):
        self.launchx_root = Path(launchx_root)
        self.serena_memories_dir = self.launchx_root / ".serena" / "memories"
        self.memory_bank_dir = self.launchx_root / "🛠️ 系统管理" / "memory-bank"
        self.archive_dir = self.memory_bank_dir / "archives" / "serena_memories"

        # 确保目录存在
        self.archive_dir.mkdir(parents=True, exist_ok=True)

    def analyze_memories(self):
        """分析Serena memories状态"""
        print("🔍 分析Serena memories状态...")

        analysis = {
            'total_files': 0,
            'categories': {},
            'test_files': 0,
            'temp_files': 0,
            'duplicate_candidates': [],
            'size_total': 0
        }

        if not self.serena_memories_dir.exists():
            print("❌ Serena memories目录不存在")
            return analysis

        # 扫描所有memory文件
        for memory_file in self.serena_memories_dir.glob("*.md"):
            analysis['total_files'] += 1
            analysis['size_total'] += memory_file.stat().st_size

            # 分类检测
            category = self._categorize_memory(memory_file)
            analysis['categories'][category] = analysis['categories'].get(category, 0) + 1

            # 特殊文件检测
            if self._is_test_file(memory_file):
                analysis['test_files'] += 1
            if self._is_temp_file(memory_file):
                analysis['temp_files'] += 1

        # 检测重复内容
        analysis['duplicate_candidates'] = self._find_duplicates()

        # 输出分析结果
        self._print_analysis(analysis)
        return analysis

    def _categorize_memory(self, memory_file):
        """分类memory文件"""
        name = memory_file.name.lower()
        content = memory_file.read_text(encoding='utf-8', errors='ignore')[:1000]

        if any(keyword in name for keyword in ['test', 'temp', 'debug']):
            return 'test_temp'
        elif 'source: "LaunchX Memory Bank"' in content:
            return 'launchx_synced'
        elif any(keyword in name for keyword in ['useme', 'readme']):
            return 'documentation'
        elif any(keyword in content.lower() for keyword in ['useme', 'readme']):
            return 'documentation'
        elif name.startswith('support_modules-'):
            return 'support_module'
        elif name.startswith('data-'):
            return 'data'
        elif any(keyword in name for keyword in ['finance', 'calendar', 'event']):
            return 'business'
        else:
            return 'other'

    def _is_test_file(self, memory_file):
        """判断是否为测试文件"""
        name = memory_file.name.lower()
        return any(keyword in name for keyword in ['test', 'temp', 'debug'])

    def _is_temp_file(self, memory_file):
        """判断是否为临时文件"""
        name = memory_file.name.lower()
        return any(keyword in name for keyword in ['temp', 'debug', 'scratch'])

    def _find_duplicates(self):
        """查找重复内容"""
        content_hashes = {}
        duplicates = []

        for memory_file in self.serena_memories_dir.glob("*.md"):
            # 计算文件内容的哈希
            content = memory_file.read_text(encoding='utf-8')
            content_hash = hashlib.md5(content.encode()).hexdigest()

            if content_hash in content_hashes:
                duplicates.append({
                    'file1': content_hashes[content_hash],
                    'file2': str(memory_file.relative_to(self.serena_memories_dir)),
                    'hash': content_hash
                })
            else:
                content_hashes[content_hash] = str(memory_file.relative_to(self.serena_memories_dir))

        return duplicates

    def _print_analysis(self, analysis):
        """打印分析结果"""
        print(f"📊 Serena Memories分析结果:")
        print(f"  📁 总文件数: {analysis['total_files']}")
        print(f"  💾 总大小: {analysis['size_total']/1024:.1f}KB")
        print(f"  🧪 测试文件: {analysis['test_files']}")
        print(f"  🗂️ 临时文件: {analysis['temp_files']}")
        print(f"  🔄 重复候选: {len(analysis['duplicate_candidates'])}")

        print("\n📋 文件分类:")
        for category, count in analysis['categories'].items():
            print(f"  {category}: {count}个文件")

        if analysis['duplicate_candidates']:
            print("\n⚠️ 发现重复内容:")
            for dup in analysis['duplicate_candidates'][:5]:  # 只显示前5个
                print(f"  - {dup['file1']} ↔ {dup['file2']}")

    def cleanup_memories(self, dry_run=True):
        """清理memories"""
        print(f"🧹 {'模拟' if dry_run else '执行'}清理Serena memories...")

        actions = []

        # 1. 清理测试和临时文件
        for memory_file in self.serena_memories_dir.glob("*.md"):
            if self._is_test_file(memory_file):
                actions.append({
                    'action': 'delete',
                    'file': memory_file,
                    'reason': 'test/temp file'
                })

        # 2. 归档重复文件（保留最新的）
        duplicates = self._find_duplicates()
        for dup in duplicates:
            file1 = self.serena_memories_dir / dup['file1']
            file2 = self.serena_memories_dir / dup['file2']

            # 保留修改时间较新的文件
            if file1.stat().st_mtime > file2.stat().st_mtime:
                actions.append({
                    'action': 'archive',
                    'file': file2,
                    'reason': 'duplicate (keeping newer)'
                })
            else:
                actions.append({
                    'action': 'archive',
                    'file': file1,
                    'reason': 'duplicate (keeping newer)'
                })

        # 3. 整理通用文档
        general_docs = []
        for memory_file in self.serena_memories_dir.glob("*.md"):
            if memory_file.name in ['README.md', 'USEME.md']:
                general_docs.append(memory_file)

        if len(general_docs) > 1:
            # 保留最新的，归档其他的
            general_docs.sort(key=lambda f: f.stat().st_mtime, reverse=True)
            keep_file = general_docs[0]
            for doc in general_docs[1:]:
                actions.append({
                    'action': 'archive',
                    'file': doc,
                    'reason': 'duplicate general documentation'
                })

        # 执行或显示操作
        if dry_run:
            print(f"📋 计划执行 {len(actions)} 个操作:")
            for i, action in enumerate(actions, 1):
                print(f"  {i}. {action['action']}: {action['file'].name} - {action['reason']}")
        else:
            self._execute_actions(actions)

        return actions

    def _execute_actions(self, actions):
        """执行清理操作"""
        archive_subdir = self.archive_dir / f"cleanup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        archive_subdir.mkdir(exist_ok=True)

        executed = 0
        for action in actions:
            try:
                if action['action'] == 'delete':
                    action['file'].unlink()
                    print(f"  🗑️ 删除: {action['file'].name}")

                elif action['action'] == 'archive':
                    archive_file = archive_subdir / action['file'].name
                    shutil.move(str(action['file']), str(archive_file))
                    print(f"  📦 归档: {action['file'].name}")

                executed += 1
            except Exception as e:
                print(f"  ❌ 错误: {action['file'].name} - {e}")

        print(f"✅ 执行完成，共处理 {executed} 个文件")

    def organize_memories(self):
        """组织memories结构"""
        print("🗂️ 组织Serena memories结构...")

        # 创建分类目录
        categories = {
            'support_modules': '支持模块',
            'data': '数据文件',
            'business': '业务相关',
            'documentation': '文档',
            'other': '其他'
        }

        organized = 0

        for category, desc in categories.items():
            category_dir = self.serena_memories_dir / category
            category_dir.mkdir(exist_ok=True)

            # 移动相关文件到分类目录
            for memory_file in list(self.serena_memories_dir.glob("*.md")):
                if self._categorize_memory(memory_file) == category:
                    # 跳过目录文件本身
                    if memory_file.parent == category_dir:
                        continue

                    target_file = category_dir / memory_file.name
                    shutil.move(str(memory_file), str(target_file))
                    organized += 1
                    print(f"  📁 移动: {memory_file.name} → {category}/")

        print(f"✅ 组织完成，共移动 {organized} 个文件")

    def create_memories_index(self):
        """创建memories索引"""
        print("📋 创建Serena memories索引...")

        memories = []
        for memory_file in self.serena_memories_dir.rglob("*.md"):
            if memory_file.parent.name in ['support_modules', 'data', 'business', 'documentation', 'other']:
                category = memory_file.parent.name
            else:
                category = 'root'

            stat = memory_file.stat()
            memories.append({
                'name': memory_file.name,
                'path': str(memory_file.relative_to(self.serena_memories_dir)),
                'category': category,
                'size': stat.st_size,
                'modified': datetime.fromtimestamp(stat.st_mtime),
                'created': datetime.fromtimestamp(stat.st_ctime)
            })

        # 按类别和修改时间排序
        memories.sort(key=lambda x: (x['category'], x['modified']), reverse=True)

        # 生成索引内容
        content = f"""---
title: "Serena Memories索引"
owners: ["LaunchX Memory Team"]
status: "active"
last_update: "{datetime.now().strftime('%Y-%m-%d')}"
source: "Serena Memories管理器自动生成"
impact: "medium"
---

# Serena Memories索引

> **生成时间**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
> **总Memory数**: {len(memories)} 个
> **存储位置**: `.serena/memories/`

---

## 📊 统计信息

### 按类别统计
"""

        # 统计各类别数量
        categories = {}
        for memory in memories:
            category = memory['category']
            categories[category] = categories.get(category, 0) + 1

        for category, count in categories.items():
            category_name = {
                'support_modules': '支持模块',
                'data': '数据文件',
                'business': '业务相关',
                'documentation': '文档',
                'other': '其他',
                'root': '根目录'
            }.get(category, category)
            content += f"- **{category_name}**: {count} 个Memory\n"

        content += f"""
### 按时间统计
- **最近7天**: {len([m for m in memories if m['modified'] > datetime.now() - timedelta(days=7)])} 个
- **最近30天**: {len([m for m in memories if m['modified'] > datetime.now() - timedelta(days=30)])} 个
- **总大小**: {sum(m['size'] for m in memories) / 1024:.1f} KB

---

## 📋 Memory列表

| 名称 | 类别 | 大小 | 修改时间 | 路径 |
|------|------|------|----------|------|
"""

        # 添加Memory列表
        for memory in memories:
            size_str = f"{memory['size']}B" if memory['size'] < 1024 else f"{memory['size']/1024:.1f}KB"
            category_name = {
                'support_modules': '支持模块',
                'data': '数据',
                'business': '业务',
                'documentation': '文档',
                'other': '其他',
                'root': '根目录'
            }.get(memory['category'], memory['category'])

            content += f"| {memory['name']} | {category_name} | {size_str} | {memory['modified'].strftime('%Y-%m-%d %H:%M')} | {memory['path']} |\n"

        content += f"""

---

## 🛠️ 管理

### 查看Memory
```bash
# 列出所有memories
ls -la .serena/memories/

# 查看特定memory
cat .serena/memories/support_modules/example.md
```

### 搜索Memory
```python
# 通过Serena API搜索
import requests
response = requests.get('http://127.0.0.1:24282/api/memories/search?q=关键词')
print(response.json())
```

---

*此索引由Serena Memories管理器自动生成，最后更新时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*
"""

        # 写入索引文件
        index_file = self.serena_memories_dir / "memories_index.md"
        with open(index_file, 'w', encoding='utf-8') as f:
            f.write(content)

        print(f"  📄 索引文件已创建: {index_file}")
        return index_file

def main():
    """主函数"""
    import argparse

    parser = argparse.ArgumentParser(description='Serena Memories管理器')
    parser.add_argument('--analyze', action='store_true', help='分析memories状态')
    parser.add_argument('--cleanup', action='store_true', help='清理memories（模拟模式）')
    parser.add_argument('--cleanup-execute', action='store_true', help='执行清理memories')
    parser.add_argument('--organize', action='store_true', help='组织memories结构')
    parser.add_argument('--index', action='store_true', help='创建memories索引')

    args = parser.parse_args()

    launchx_root = "/Users/dangsiyuan/Documents/obsidion/launch x"
    manager = SerenaMemoriesManager(launchx_root)

    if args.analyze:
        manager.analyze_memories()

    elif args.cleanup:
        manager.cleanup_memories(dry_run=True)

    elif args.cleanup_execute:
        manager.cleanup_memories(dry_run=False)

    elif args.organize:
        manager.organize_memories()

    elif args.index:
        manager.create_memories_index()

    else:
        # 默认执行分析
        manager.analyze_memories()
        print("\n💡 使用 --help 查看所有可用选项")

if __name__ == "__main__":
    main()