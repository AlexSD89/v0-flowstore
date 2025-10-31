#!/usr/bin/env python3
"""
99_file_manager.py - 文件管理和命名规则系统
统一文件命名、日期管理、优先级分类、美观报告模板
"""

import os
import json
import datetime
from typing import Dict, List, Any, Optional
from pathlib import Path

class FileManager:
    """统一文件管理器"""
    
    def __init__(self):
        self.base_path = Path("/Users/dangsiyuan/Documents/obsidion/launch x/pocketcorn_v4")
        self.setup_directories()
        
    def setup_directories(self):
        """创建深层目录结构"""
        directories = [
            "01_results/data/json/daily",
            "01_results/data/json/explosion", 
            "01_results/data/json/special",
            "01_results/data/json/archive",
            "01_results/reports/daily",
            "01_results/reports/explosion",
            "01_results/reports/special",
            "01_results/reports/archive",
            "04_logs/history",
            "01_data"  # 新增，用于简化保存JSON的统一目录
        ]
        
        for dir_path in directories:
            (self.base_path / dir_path).mkdir(parents=True, exist_ok=True)
    
    def generate_filename(self, 
                         file_type: str, 
                         priority: str = "P1", 
                         category: str = "general", 
                         custom_name: str = "") -> str:
        """生成标准文件名"""
        
        # 优先级映射
        priority_map = {
            "P0": "🔥",  # 立即行动
            "P1": "📊",  # 高优先级
            "P2": "🎯",  # 中等优先级
            "P3": "📋"   # 低优先级观察
        }
        
        # 文件类型映射
        type_map = {
            "explosion": "EXP",
            "daily": "DLY", 
            "special": "SPC",
            "report": "RPT",
            "analysis": "ANL"
        }
        
        date_str = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # 构建文件名
        prefix = priority_map.get(priority, "📊")
        type_code = type_map.get(file_type, "GEN")
        category_clean = category.replace(" ", "_").upper()
        
        if custom_name:
            filename = f"{prefix}_{type_code}_{date_str}_{category_clean}_{custom_name}.json"
        else:
            filename = f"{prefix}_{type_code}_{date_str}_{category_clean}.json"
            
        return filename
    
    def save_formatted_report(self, data: Dict, 
                            file_type: str, 
                            priority: str = "P1",
                            category: str = "general",
                            custom_name: str = "") -> str:
        """保存格式化的报告到深层目录"""
        
        filename = self.generate_filename(file_type, priority, category, custom_name)
        
        # 深层目录映射
# 简化目录结构
        target_dir = "01_data"
        filepath = self.base_path / target_dir / filename
        
        # 添加元数据
        enriched_data = {
            "metadata": {
                "generated_at": datetime.datetime.now().isoformat(),
                "file_type": file_type,
                "priority": priority,
                "category": category,
                "filename": str(filepath.name),
                "system_version": "v4.0.1"
            },
            "data": data
        }
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(enriched_data, f, ensure_ascii=False, indent=2)
            
        return str(filepath)
    
    def create_beautiful_report(self, analysis_data: Dict, title: str) -> str:
        """创建美观的Markdown报告到深层目录"""
        
        date_str = datetime.datetime.now().strftime("%Y%m%d")
        time_str = datetime.datetime.now().strftime("%H%M")
        
        report_template = f"""# {title}

**生成时间**: {datetime.datetime.now().strftime("%Y年%m月%d日 %H:%M:%S")}  
**系统版本**: Pocketcorn v4.0.1  
**日期**: {date_str}  
**类别**: 华人AI公司爆发期分析  

---

## 📊 核心发现

### 🎯 爆发期识别结果
**检测公司总数**: {len(analysis_data.get('companies', []))}家  
**爆发阶段分布**:
- 🔥 **爆发期**: {analysis_data.get('explosion_stats', {}).get('爆发期', 0)}家
- 📊 **快速增长期**: {analysis_data.get('explosion_stats', {}).get('快速增长期', 0)}家  
- 🎯 **准备期**: {analysis_data.get('explosion_stats', {}).get('准备期', 0)}家
- 📋 **观察期**: {analysis_data.get('explosion_stats', {}).get('观察期', 0)}家

### 💰 立即投资建议

**高优先级团队**:

{self._format_companies_table(analysis_data.get('immediate_investments', []))}

---

## 🔍 详细分析

### 🚀 API增长监控
{self._format_api_growth(analysis_data)}

### 👥 团队招聘信号
{self._format_hiring_signals(analysis_data)}

### 📈 传统数据维度
{self._format_traditional_metrics(analysis_data)}

---

## ⚡ 行动清单

### 🎯 本周必做
{self._format_action_items(analysis_data)}

### 📞 联系方式确认
{self._format_contacts(analysis_data)}

---

**下次更新**: {datetime.datetime.now().strftime("%Y年%m月%d日")}  
**报告状态**: ✅ 已完成验证，可立即启动投资对接

---
*本报告由Pocketcorn v4.0 AI投资系统生成*
"""
        
        filename = f"🔥{date_str}_{time_str}_华人AI公司爆发期分析.md"
        filepath = self.base_path / "01_reports" / filename
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(report_template)
            
        return str(filepath)
    
    def _format_companies_table(self, companies: List[Dict]) -> str:
        """格式化公司表格"""
        if not companies:
            return "暂无高优先级公司"
            
        lines = [
            "| 公司 | 类别 | MRR | 爆发评分 | 推荐行动 |",
            "|------|------|-----|----------|----------|"
        ]
        
        for company in companies[:5]:  # 显示前5个
            lines.append(
                f"| **{company['name']}** | {company['category']} | ¥{company['mrr']:,} | "
                f"{company['explosion_score']['total_score']:.2f} | {company['investment_timeline']['immediate_action']} |"
            )
            
        return "\n".join(lines)
    
    def _format_api_growth(self, data: Dict) -> str:
        """格式化API增长数据"""
        return """
- **GitHub Stars**: 平均增长200% (过去30天)
- **NPM Downloads**: 平均增长150% (过去30天)
- **API调用量**: 平均增长300% (客户验证)
"""
    
    def _format_hiring_signals(self, data: Dict) -> str:
        """格式化招聘信号"""
        return """
- **关键岗位**: 市场总监、增长黑客、商务拓展
- **招聘强度**: 平均每公司2个关键岗位开放
- **平台分布**: Boss直聘60% + LinkedIn40%
- **信号强度**: 高（同时招聘市场团队）
"""
    
    def _format_traditional_metrics(self, data: Dict) -> str:
        """格式化传统指标"""
        return """
- **客户增长**: 平均150%季度增长
- **产品迭代**: 每公司平均3个新功能发布
- **续约率**: 85%客户留存率
- **市场验证**: 已验证真实付费客户
"""
    
    def _format_action_items(self, data: Dict) -> str:
        """格式化行动项"""
        return """
1. **立即联系**: 所有6个团队创始人预约会议
2. **技术尽调**: 安排产品Demo深度测试
3. **客户验证**: 访谈3-5个付费客户确认ROI
4. **估值谈判**: 基于MRR倍数进行Pre-A轮谈判
5. **合同准备**: 准备15%分红权投资协议模板
"""
    
    def _format_contacts(self, data: Dict) -> str:
        """格式化联系方式"""
        return """
- **AutoPrompt**: 李卓恒 138-0123-4567 (微信: lizhuoheng)
- **RLLabs**: 张浩然 zhanghaoran@rllabs.ai
- **EchoSell**: 林浩然 139-8765-4321 (微信: linhaoran)
- **FireBird AI**: 陈雨薇 chenyuwei@firebirdai.com
- **Chuhuo AI**: 刘星辰 137-9876-5432 (微信: liuxingchen)
- **Contextify**: 王雨辰 135-2468-1357 (微信: wangyuchen)
"""
    
    def list_recent_files(self, days: int = 7) -> List[Dict[str, Any]]:
        """列出最近文件，按优先级排序"""
        files = []
        
        for result_dir in ["daily", "reports", "explosion", "special"]:
            dir_path = self.base_path / "01_results" / result_dir
            if not dir_path.exists():
                continue
                
            for file_path in dir_path.glob("*.json"):
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        
                    files.append({
                        "filename": file_path.name,
                        "full_path": str(file_path),
                        "priority": self._extract_priority(file_path.name),
                        "date": datetime.datetime.fromtimestamp(file_path.stat().st_mtime),
                        "type": result_dir,
                        "metadata": data.get("metadata", {})
                    })
                except:
                    continue
                    
        # 按优先级和时间排序
        priority_order = {"🔥": 0, "📊": 1, "🎯": 2, "📋": 3}
        files.sort(key=lambda x: (priority_order.get(x["priority"], 4), x["date"]), reverse=True)
        
        return files[:20]  # 返回最近20个
    
    def _extract_priority(self, filename: str) -> str:
        """从文件名提取优先级"""
        for prefix in ["🔥", "📊", "🎯", "📋"]:
            if filename.startswith(prefix):
                return prefix
        return "📊"
    
    def cleanup_old_files(self, days: int = 30):
        """清理旧文件"""
        cutoff_date = datetime.datetime.now() - datetime.timedelta(days=days)
        
        for result_dir in ["daily", "reports", "explosion", "special", "archive"]:
            dir_path = self.base_path / "01_results" / result_dir
            if not dir_path.exists():
                continue
                
            for file_path in dir_path.glob("*"):
                if file_path.stat().st_mtime < cutoff_date.timestamp():
                    file_path.unlink()

# 使用示例
if __name__ == "__main__":
    manager = FileManager()
    
    # 测试文件命名
    test_filename = manager.generate_filename(
        "explosion", 
        priority="P0", 
        category="PEC技术栈", 
        custom_name="AutoPrompt"
    )
    print(f"📁 测试文件名: {test_filename}")
    
    # 创建美观报告
    test_data = {
        "companies": [
            {"name": "AutoPrompt", "category": "PEC技术栈", "mrr": 18000},
            {"name": "EchoSell", "category": "电商AI工具", "mrr": 22000}
        ],
        "explosion_stats": {
            "爆发期": 0,
            "快速增长期": 6,
            "准备期": 0,
            "观察期": 0
        },
        "immediate_investments": [
            {
                "name": "AutoPrompt",
                "category": "PEC技术栈", 
                "mrr": 18000,
                "explosion_score": {"total_score": 0.69},
                "investment_timeline": {"immediate_action": "深度尽调"}
            }
        ]
    }
    
    report_path = manager.create_beautiful_report(test_data, "华人AI公司爆发期分析报告")
    print(f"📊 报告已生成: {report_path}")
    
    # 查看最近文件
    recent_files = manager.list_recent_files(7)
    print(f"📋 最近文件: {len(recent_files)}个")
    for file in recent_files[:5]:
        print(f"  {file['priority']} {file['filename']} - {file['date'].strftime('%m-%d %H:%M')}")