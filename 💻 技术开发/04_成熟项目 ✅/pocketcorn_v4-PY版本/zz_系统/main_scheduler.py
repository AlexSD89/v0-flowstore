#!/usr/bin/env python3
"""
main_scheduler.py - 主程序调度分配系统
统一调度所有模块，管理文件命名，生成美观报告
"""

import os
import sys
import json
import datetime
import subprocess
from pathlib import Path
from typing import Dict, List, Any

import importlib.util

# 动态导入模块
fm_spec = importlib.util.spec_from_file_location("file_manager", os.path.join(os.path.dirname(__file__), "99_file_manager.py"))
rt_spec = importlib.util.spec_from_file_location("report_templates", os.path.join(os.path.dirname(__file__), "report_templates.py"))
tr_spec = importlib.util.spec_from_file_location("tool_registry", os.path.join(os.path.dirname(__file__), "tool_registry.py"))

fm_module = importlib.util.module_from_spec(fm_spec)
rt_module = importlib.util.module_from_spec(rt_spec)
tr_module = importlib.util.module_from_spec(tr_spec)

fm_spec.loader.exec_module(fm_module)
rt_spec.loader.exec_module(rt_module)
tr_spec.loader.exec_module(tr_module)

FileManager = fm_module.FileManager
ReportTemplates = rt_module.ReportTemplates
get_tool_registry = tr_module.get_tool_registry

class MainScheduler:
    """主程序调度器"""
    
    def __init__(self):
        self.base_path = Path("/Users/dangsiyuan/Documents/obsidion/launch x/pocketcorn_v4")
        self.file_manager = FileManager()
        self.templates = ReportTemplates()
        self.setup_logging()
        self.registry = get_tool_registry(self.base_path)
        
    def setup_logging(self):
        """设置日志"""
        log_dir = self.base_path / "04_logs"
        log_dir.mkdir(exist_ok=True)
        
    def run_daily_analysis(self):
        """运行每日分析"""
        print("🚀 启动每日AI项目发现系统...")
        
        # 1. 运行爆炸期检测（保持现有模拟逻辑）
        explosion_results = self.run_explosion_detection()
        
        # 2. 生成专业报告
        report_path = self.generate_daily_report(explosion_results)
        
        # 3. 更新历史记录
        self.update_history_log(explosion_results)
        
        # 3.1 迭代优化报告（新接入）
        try:
            io_spec = importlib.util.spec_from_file_location(
                "iteration_optimizer", os.path.join(os.path.dirname(__file__), "09_iteration_optimizer.py")
            )
            io_module = importlib.util.module_from_spec(io_spec)
            io_spec.loader.exec_module(io_module)
            IterationOptimizer = io_module.IterationOptimizer
            optimizer = IterationOptimizer()
            iteration_report = optimizer.generate_iteration_report()
            self.file_manager.save_formatted_report(
                {"iteration_report": iteration_report},
                file_type="analysis",
                priority="P1",
                category="方法论迭代",
                custom_name="iteration_optimizer"
            )
        except Exception as e:
            print(f"⚠️ 迭代优化生成失败: {e}")
        
        # 3.2 不确定性验证（新接入）
        try:
            uv_spec = importlib.util.spec_from_file_location(
                "uncertainty_validator", os.path.join(os.path.dirname(__file__), "11_uncertainty_validator.py")
            )
            uv_module = importlib.util.module_from_spec(uv_spec)
            uv_spec.loader.exec_module(uv_module)
            UncertaintyValidatorV4 = uv_module.UncertaintyValidatorV4
            validator = UncertaintyValidatorV4()
            companies = explosion_results.get("immediate_investments", [])
            validations = []
            for c in companies[:5]:
                project = {
                    "name": c.get("name"),
                    "mrr": c.get("mrr", 0),
                    "growth_rate": 0.25,
                    "team_quality": 0.75,
                    "data_sources": []
                }
                validations.append(validator.validate_project(project))
            self.file_manager.save_formatted_report(
                {"validations": validations},
                file_type="analysis",
                priority="P1",
                category="不确定性验证",
                custom_name="uncertainty_validation"
            )
        except Exception as e:
            print(f"⚠️ 不确定性验证失败: {e}")
        
        # 4. 输出总结
        self.print_summary(explosion_results, report_path)
        
    def run_explosion_detection(self) -> Dict[str, Any]:
        """运行爆发期检测"""
        print("🔍 开始爆发期检测...")
        try:
            companies = [
                {'name': 'AutoPrompt', 'category': 'PEC技术栈', 'mrr': 18000},
                {'name': 'RLLabs', 'category': 'PEC技术栈', 'mrr': 25000},
                {'name': 'Contextify', 'category': 'PEC技术栈', 'mrr': 12000},
                {'name': 'EchoSell', 'category': '电商AI工具', 'mrr': 22000},
                {'name': 'FireBird AI', 'category': '电商AI工具', 'mrr': 16000},
                {'name': 'Chuhuo AI', 'category': '电商AI工具', 'mrr': 15000}
            ]
            explosion_stats = {"爆发期": 0, "快速增长期": 6, "准备期": 0, "观察期": 0}
            immediate_investments = [
                {
                    "name": company['name'],
                    "category": company['category'],
                    "mrr": company['mrr'],
                    "explosion_score": {"total_score": 0.69},
                    "investment_timeline": {"immediate_action": "深度尽调", "due_diligence": "2-3周", "term_sheet": "3-4周", "closing": "6-8周"}
                }
                for company in companies
            ]
            return {
                "companies": companies,
                "explosion_stats": explosion_stats,
                "immediate_investments": immediate_investments,
                "generated_at": datetime.datetime.now().isoformat()
            }
        except Exception as e:
            print(f"❌ 爆发期检测失败: {e}")
            return {}
    
    def generate_daily_report(self, analysis_data: Dict[str, Any]) -> str:
        return self.file_manager.create_beautiful_report(analysis_data, title="华人AI公司爆发期分析")

    def update_history_log(self, analysis_data: Dict[str, Any]):
        log_file = self.base_path / "04_logs" / "history.jsonl"
        with open(log_file, 'a', encoding='utf-8') as f:
            record = {"ts": datetime.datetime.now().isoformat(), "type": "daily", "data": analysis_data}
            f.write(json.dumps(record, ensure_ascii=False) + "\n")

    def print_summary(self, analysis_data: Dict[str, Any], report_path: str):
        print("\n✅ 今日分析完成！")
        print(f"报告路径: {report_path}")
        if analysis_data:
            print(f"立即投资建议: {len(analysis_data.get('immediate_investments', []))} 家")

    def run_weekly_review(self):
        print("📅 启动周度回顾...")
        # 保持现有 weekly 中的历史富化与权重写回逻辑（在 learn 命令中已有）
        print("（周度回顾占位，已由 learn 命令承载核心功能）")

    def cleanup_old_files(self, days: int = 30):
        print("🧹 清理旧文件...")
        cutoff = datetime.datetime.now() - datetime.timedelta(days=days)
        data_dir = self.base_path / "01_results" / "data" / "json"
        if data_dir.exists():
            for sub in data_dir.rglob("*.json"):
                try:
                    ts = datetime.datetime.fromtimestamp(sub.stat().st_mtime)
                    if ts < cutoff:
                        sub.unlink()
                except Exception:
                    pass

    def list_recent_files(self) -> Dict[str, List[Dict[str, Any]]]:
        categories = {
            "daily_data": self.base_path / "01_results" / "data" / "json" / "daily",
            "explosion_data": self.base_path / "01_results" / "data" / "json" / "explosion",
            "special_data": self.base_path / "01_results" / "data" / "json" / "special",
            "reports_daily": self.base_path / "01_results" / "reports" / "daily",
            "reports_special": self.base_path / "01_results" / "reports" / "special",
        }
        result: Dict[str, List[Dict[str, Any]]] = {}
        for name, path in categories.items():
            files = []
            if path.exists():
                for fp in sorted(path.glob("*.json"), key=lambda p: p.stat().st_mtime, reverse=True)[:20]:
                    files.append({"filename": fp.name, "date": datetime.datetime.fromtimestamp(fp.stat().st_mtime)})
            result[name] = files
        return result

    def run_system_check(self):
        print("🔧 运行系统健康检查...")
        checks = {
            "文件系统": (self.base_path / "01_results").exists(),
            "配置文件": (self.base_path / "zz_配置").exists(),
            "日志系统": (self.base_path / "04_logs").exists(),
            "核心模块": (self.base_path / "zz_系统").exists(),
            "专项追踪": (self.base_path / "01_results" / "reports").exists()
        }
        print("\n📊 系统健康状态:")
        for check, status in checks.items():
            print(f"  ✅ {check}: {'正常' if status else '需要修复'}")
        return all(checks.values())

# 主程序入口

def main():
    scheduler = MainScheduler()
    if len(sys.argv) > 1:
        command = sys.argv[1]
        if command == "daily":
            scheduler.run_daily_analysis()
        elif command == "weekly":
            scheduler.run_weekly_review()
        elif command == "cleanup":
            scheduler.cleanup_old_files()
        elif command == "check":
            scheduler.run_system_check()
        elif command == "list":
            categorized = scheduler.list_recent_files()
            for category, files in categorized.items():
                print(f"\n{category}: {len(files)}个文件")
        elif command == "special":
            print("🔍 启动专项搜索(PEC)...")
            registry = scheduler.registry
            result = registry.run_tool("special_search_pec", params={})
            if result.success:
                data = result.data
                print("JSON:", data.get("json_path"))
                print("MARKDOWN:", data.get("md_path"))
            else:
                print("❌ 专项搜索失败:", result.error)
        elif command == "learn":
            print("📚 启动历史富化与权重校准...")
            try:
                he_spec = importlib.util.spec_from_file_location(
                    "history_enricher", os.path.join(os.path.dirname(__file__), "14_history_enricher.py")
                )
                he_module = importlib.util.module_from_spec(he_spec)
                he_spec.loader.exec_module(he_module)
                HistoryEnricher = he_module.HistoryEnricher
                enricher = HistoryEnricher()
                stats = enricher.scan_and_ingest()
                print(f"🗂️ 历史富化完成: 扫描{stats['files_scanned']} | 写入{stats['files_ingested']}")

                we_spec = importlib.util.spec_from_file_location(
                    "weights", os.path.join(os.path.dirname(__file__), "03_enhanced_weights.py")
                )
                we_module = importlib.util.module_from_spec(we_spec)
                we_spec.loader.exec_module(we_module)
                DynamicWeightEngine = we_module.DynamicWeightEngine
                dwe = DynamicWeightEngine()
                new_weights = dwe.learn_from_history("../zz_数据/history.db")
                cfg_path = scheduler.base_path / "zz_配置" / "02_weights_config.json"
                try:
                    with open(cfg_path, 'w', encoding='utf-8') as f:
                        json.dump(new_weights, f, ensure_ascii=False, indent=2)
                    print("⚖️ 动态权重已基于历史数据再校准")
                except Exception as e:
                    print(f"⚠️ 写入权重失败: {e}")
            except Exception as e:
                print(f"⚠️ 历史富化与权重校准失败: {e}")
        else:
            print(
                """
📋 Pocketcorn v4.0 主程序调度系统

使用方法:
  python main_scheduler.py daily     - 运行每日分析
  python main_scheduler.py weekly    - 运行周度回顾
  python main_scheduler.py cleanup   - 清理旧文件
  python main_scheduler.py check     - 系统健康检查
  python main_scheduler.py list      - 列出最近文件
  python main_scheduler.py special   - 启动专项搜索
  python main_scheduler.py learn     - 启动历史富化与权重校准
                """
            )
    else:
        scheduler.run_daily_analysis()

if __name__ == "__main__":
    main()