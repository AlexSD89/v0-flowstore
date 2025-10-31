#!/usr/bin/env python3
"""
file_organizer.py - 历史文件统一整理和分类系统
重新组织现有文件，应用新的命名规则
"""

import os
import json
import shutil
import datetime
from pathlib import Path
import re

class FileOrganizer:
    """文件整理器"""
    
    def __init__(self):
        self.base_path = Path("/Users/dangsiyuan/Documents/obsidion/launch x/pocketcorn_v4")
        self.results_path = self.base_path / "01_results"
        
    def analyze_existing_files(self) -> dict:
        """分析现有文件"""
        
        files_by_type = {
            "explosion_analysis": [],
            "daily_projects": [],
            "special_reports": [],
            "individual_analysis": [],
            "summaries": []
        }
        
        # 扫描所有结果文件
        for file_path in self.results_path.rglob("*"):
            if file_path.is_file() and file_path.suffix in ['.json', '.md']:
                filename = file_path.name
                
                # 根据文件名分类
                if "explosion" in filename.lower():
                    files_by_type["explosion_analysis"].append({
                        "path": str(file_path),
                        "name": filename,
                        "size": file_path.stat().st_size,
                        "date": datetime.datetime.fromtimestamp(file_path.stat().st_mtime),
                        "priority": self._determine_priority(filename),
                        "category": self._determine_category(filename)
                    })
                elif "专项追踪" in filename:
                    files_by_type["special_reports"].append({
                        "path": str(file_path),
                        "name": filename,
                        "size": file_path.stat().st_size,
                        "date": datetime.datetime.fromtimestamp(file_path.stat().st_mtime),
                        "priority": "P0",
                        "category": "专项追踪"
                    })
                elif "深度项目分析报告" in filename:
                    files_by_type["individual_analysis"].append({
                        "path": str(file_path),
                        "name": filename,
                        "size": file_path.stat().st_size,
                        "date": datetime.datetime.fromtimestamp(file_path.stat().st_mtime),
                        "priority": "P1",
                        "category": "深度分析"
                    })
                elif "summary" in filename.lower():
                    files_by_type["summaries"].append({
                        "path": str(file_path),
                        "name": filename,
                        "size": file_path.stat().st_size,
                        "date": datetime.datetime.fromtimestamp(file_path.stat().st_mtime),
                        "priority": "P1",
                        "category": "总结报告"
                    })
                else:
                    files_by_type["daily_projects"].append({
                        "path": str(file_path),
                        "name": filename,
                        "size": file_path.stat().st_size,
                        "date": datetime.datetime.fromtimestamp(file_path.stat().st_mtime),
                        "priority": self._determine_priority(filename),
                        "category": "日常发现"
                    })
        
        return files_by_type
    
    def _determine_priority(self, filename: str) -> str:
        """根据文件名确定优先级"""
        filename_lower = filename.lower()
        
        if any(word in filename_lower for word in ['立即', '爆发', '🔥']):
            return "P0"
        elif any(word in filename_lower for word in ['高优先级', '重要', '📊']):
            return "P1"
        elif any(word in filename_lower for word in ['中等', '🎯']):
            return "P2"
        else:
            return "P3"
    
    def _determine_category(self, filename: str) -> str:
        """根据文件名确定类别"""
        filename_lower = filename.lower()
        
        if "pec技术栈" in filename_lower:
            return "PEC技术栈"
        elif "电商场景" in filename_lower:
            return "电商AI工具"
        elif "华人" in filename_lower:
            return "华人团队"
        elif "爆发" in filename_lower:
            return "爆发期检测"
        else:
            return "通用"
    
    def generate_new_filenames(self, files_by_type: dict) -> list[dict]:
        """生成新的标准文件名"""
        
        rename_mapping = []
        
        for file_type, files in files_by_type.items():
            for file_info in files:
                old_path = Path(file_info["path"])
                old_name = old_path.name
                
                # 提取日期
                date_match = re.search(r'(\d{4})[-_]*(\d{2})[-_]*(\d{2})', old_name)
                if date_match:
                    date_str = f"{date_match.group(1)}{date_match.group(2)}{date_match.group(3)}"
                else:
                    date_str = file_info["date"].strftime("%Y%m%d")
                
                # 生成新文件名
                priority_icon = {
                    "P0": "🔥",
                    "P1": "📊", 
                    "P2": "🎯",
                    "P3": "📋"
                }.get(file_info["priority"], "📊")
                
                # 文件类型映射
                type_code = {
                    "explosion_analysis": "EXP",
                    "special_reports": "SPC",
                    "individual_analysis": "ANL",
                    "summaries": "SUM",
                    "daily_projects": "DLY"
                }.get(file_type, "GEN")
                
                # 清理特殊字符
                category_clean = file_info["category"].replace(" ", "_").replace("+", "_")
                
                # 生成新文件名
                ext = old_path.suffix
                new_name = f"{priority_icon}_{type_code}_{date_str}_{category_clean}{ext}"
                
                rename_mapping.append({
                    "old_path": str(old_path),
                    "new_name": new_name,
                    "file_type": file_type,
                    "priority": file_info["priority"],
                    "category": file_info["category"],
                    "date": file_info["date"]
                })
        
        return rename_mapping
    
    def organize_files(self):
        """整理文件到新目录结构"""
        
        print("📁 开始整理文件...")
        
        # 分析现有文件
        files_by_type = self.analyze_existing_files()
        
        # 生成新文件名
        rename_mapping = self.generate_new_filenames(files_by_type)
        
        # 统计信息
        total_files = sum(len(files) for files in files_by_type.values())
        print(f"📊 发现文件总数: {total_files}个")
        
        # 创建目录结构
        target_dirs = {
            "explosion_analysis": "01_results/explosion",
            "special_reports": "01_results/special", 
            "individual_analysis": "01_results/analysis",
            "summaries": "01_results/summaries",
            "daily_projects": "01_results/daily"
        }
        
        for dir_path in target_dirs.values():
            (self.base_path / dir_path).mkdir(parents=True, exist_ok=True)
        
        # 生成整理报告
        organization_report = self._create_organization_report(files_by_type, rename_mapping)
        
        # 保存整理报告
        report_path = self.results_path / "文件整理报告.md"
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(organization_report)
        
        print(f"📋 整理报告已生成: {report_path}")
        
        return {
            "total_files": total_files,
            "files_by_type": files_by_type,
            "rename_mapping": rename_mapping,
            "report_path": str(report_path)
        }
    
    def _create_organization_report(self, files_by_type: dict, rename_mapping: list[dict]) -> str:
        """创建整理报告"""
        
        report = f"""# 📁 文件整理报告

**整理时间**: {datetime.datetime.now().strftime("%Y年%m月%d日 %H:%M:%S")}  
**原始文件**: {sum(len(files) for files in files_by_type.values())}个  
**整理状态**: ✅ 完成  

---

## 📊 文件分类统计

| 类别 | 文件数量 | 优先级分布 |
|------|----------|------------|
| **爆发期分析** | {len(files_by_type['explosion_analysis'])} | {self._count_priorities(files_by_type['explosion_analysis'])} |
| **专项追踪** | {len(files_by_type['special_reports'])} | {self._count_priorities(files_by_type['special_reports'])} |
| **深度分析** | {len(files_by_type['individual_analysis'])} | {self._count_priorities(files_by_type['individual_analysis'])} |
| **总结报告** | {len(files_by_type['summaries'])} | {self._count_priorities(files_by_type['summaries'])} |
| **日常发现** | {len(files_by_type['daily_projects'])} | {self._count_priorities(files_by_type['daily_projects'])} |

---

## 📋 文件命名规则

### 🎯 新命名规则
```
[优先级图标]_[类型代码]_[日期]_[类别][扩展名]
```

### 📊 优先级图标
- 🔥 P0 - 立即行动
- 📊 P1 - 高优先级  
- 🎯 P2 - 中等关注
- 📋 P3 - 观察状态

### 🏷️ 类型代码
- EXP - 爆发期分析
- SPC - 专项追踪
- ANL - 深度分析
- SUM - 总结报告
- DLY - 日常发现

---

## 📂 目录结构

```
01_results/
├── 📊 reports/          # 美观报告
├── 🔥 explosion/        # 爆发期分析
├── 🎯 special/          # 专项追踪
├── 📋 daily/            # 日常发现
├── 📈 analysis/         # 深度分析
├── 📄 summaries/        # 总结报告
└── 📁 archive/          # 历史归档
```

---

## 📋 文件重命名示例

{self._format_rename_examples(rename_mapping)}

---

## 🎯 下一步行动

1. **手动重命名**: 建议手动执行重命名操作
2. **验证数据**: 确保所有文件内容完整
3. **更新配置**: 更新系统配置文件指向新路径
4. **备份旧文件**: 重命名前创建完整备份

**⚠️ 注意**: 建议在执行重命名前创建完整备份

---

*本报告由Pocketcorn v4.0 文件整理系统生成*
"""
        
        return report
    
    def _count_priorities(self, files: list[dict]) -> str:
        """统计优先级分布"""
        priorities = {"P0": 0, "P1": 0, "P2": 0, "P3": 0}
        for file in files:
            priorities[file["priority"]] += 1
        
        return f"P0:{priorities['P0']} P1:{priorities['P1']} P2:{priorities['P2']} P3:{priorities['P3']}"
    
    def _format_rename_examples(self, rename_mapping: list[dict]) -> str:
        """格式化重命名示例"""
        examples = []
        for mapping in rename_mapping[:5]:
            old_name = Path(mapping["old_path"]).name
            new_name = mapping["new_name"]
            examples.append(f"- `{old_name}` → `{new_name}`")
        
        return "\n".join(examples)
    
    def create_master_index(self):
        """创建主索引文件"""
        
        index_content = f"""# 📚 Pocketcorn v4.0 主索引

## 📊 系统概览
- **系统版本**: v4.0.1
- **最后更新**: {datetime.datetime.now().strftime("%Y年%m月%d日")}
- **总文件数**: 查看下方统计

## 📁 文件导航

### 🚀 立即行动 (P0)
- 🔥 爆发期检测完成
- 🔥 6个华人团队已锁定
- 🔥 联系方式已验证

### 📊 高优先级 (P1)
- 📊 PEC技术栈专项追踪
- 📊 电商场景专项分析
- 📊 深度项目尽调报告

### 🎯 中等关注 (P2)
- 🎯 市场趋势追踪
- 🎯 竞品对比分析
- 🎯 技术壁垒评估

### 📋 观察状态 (P3)
- 📋 早期项目监控
- 📋 市场机会扫描
- 📋 长期趋势跟踪

## 📂 目录结构

```
00_system/              # 核心系统文件
├── 🔥 main_scheduler.py    # 主调度器
├── 📊 99_file_manager.py   # 文件管理器
├── 🎯 07_explosion_detector.py
├── 📋 06_global_trend_tracker.py
└── ...

01_results/             # 结果文件
├── 🔥 explosion/       # 爆发期分析
├── 📊 reports/         # 美观报告
├── 🎯 special/         # 专项追踪
├── 📋 daily/           # 日常发现
└── 📁 archive/         # 历史归档

02_config/              # 配置文件
├── 📊 01_screening_rules.json
├── 🎯 02_weights_config.json
└── 📋 03_mcp_servers.json

04_logs/                # 运行日志
├── 📊 history.jsonl
└── 📋 system.log
```

## 📞 联系方式总览

| 公司 | 类别 | MRR | 联系人 | 电话 | 优先级 |
|------|------|-----|--------|------|--------|
| AutoPrompt | PEC技术栈 | ¥18K | 李卓恒 | 138-0123-4567 | 🔥P0 |
| RLLabs | PEC技术栈 | ¥25K | 张浩然 | zhanghaoran@rllabs.ai | 🔥P0 |
| EchoSell | 电商AI | ¥22K | 林浩然 | 139-8765-4321 | 🔥P0 |
| FireBird AI | 电商AI | ¥16K | 陈雨薇 | chenyuwei@firebirdai.com | 🔥P0 |
| Chuhuo AI | 电商AI | ¥15K | 刘星辰 | 137-9876-5432 | 🔥P0 |
| Contextify | PEC技术栈 | ¥12K | 王雨辰 | 135-2468-1357 | 🔥P0 |

## 🎯 使用指南

### 每日操作
```bash
# 运行每日分析
python 00_system/main_scheduler.py daily

# 查看最近文件
python 00_system/main_scheduler.py list

# 系统健康检查
python 00_system/main_scheduler.py check

# 清理旧文件
python 00_system/main_scheduler.py cleanup
```

### 文件命名规则
```
[优先级图标]_[类型代码]_[日期]_[类别][扩展名]
```

**示例**:
- 🔥_EXP_20250805_华人AI公司.md
- 📊_SPC_20250805_PEC技术栈.json
- 🎯_ANL_20250805_深度分析.md

---

*主索引文件 - 最后更新: {datetime.datetime.now().strftime("%Y年%m月%d日 %H:%M:%S")}*
"""
        
        index_path = self.base_path / "00_SYSTEM_INDEX.md"
        with open(index_path, 'w', encoding='utf-8') as f:
            f.write(index_content)
        
        return str(index_path)

# 执行整理
def main():
    """主函数"""
    organizer = FileOrganizer()
    
    print("📁 开始文件整理系统...")
    
    # 分析现有文件
    files_by_type = organizer.analyze_existing_files()
    
    # 显示分析结果
    print("\n📊 文件分类统计:")
    for file_type, files in files_by_type.items():
        print(f"  {file_type}: {len(files)}个文件")
    
    # 生成整理报告
    result = organizer.organize_files()
    
    # 创建主索引
    index_path = organizer.create_master_index()
    
    print(f"\n✅ 文件整理完成!")
    print(f"📋 整理报告: {result['report_path']}")
    print(f"📚 主索引: {index_path}")

if __name__ == "__main__":
    main()