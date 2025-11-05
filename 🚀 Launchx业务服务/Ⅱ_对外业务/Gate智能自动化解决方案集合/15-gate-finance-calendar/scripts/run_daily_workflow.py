#!/usr/bin/env python3
"""
Gate智能财经日历 - 每日工作流程脚本
Daily Workflow Script - 自动化执行数据抓取、分析、决策和同步的完整流程
"""

import asyncio
import json
import logging
import sys
import os
from datetime import datetime, timedelta
from pathlib import Path

# 添加项目根目录到Python路径
sys.path.append(str(Path(__file__).parent.parent / "src"))

from agents.event_scraper_agent import EventScraperAgent
from agents.impact_scoring_agent import ImpactScoringAgent
from agents.macro_narrative_agent import MacroNarrativeAgent
from agents.action_planner_agent import ActionPlannerAgent

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/daily_workflow.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class DailyWorkflowManager:
    """每日工作流程管理器"""
    
    def __init__(self, project_root: str = None):
        """
        初始化工作流程管理器
        
        Args:
            project_root: 项目根目录
        """
        if project_root is None:
            project_root = Path(__file__).parent.parent
        
        self.project_root = Path(project_root)
        self.config_dir = self.project_root / "config"
        self.data_dir = self.project_root / "datasets"
        self.output_dir = self.project_root / "outputs"
        self.logs_dir = self.project_root / "logs"
        
        # 确保必要的目录存在
        self._ensure_directories()
        
        # 初始化各种Agent
        self.event_scraper = EventScraperAgent()
        self.impact_scorer = ImpactScoringAgent()
        self.narrative_agent = MacroNarrativeAgent()
        self.action_planner = ActionPlannerAgent()
        
        # 加载配置
        self.workflow_config = self._load_workflow_config()
        
    def _ensure_directories(self):
        """确保必要的目录存在"""
        for directory in [self.config_dir, self.data_dir, self.output_dir, self.logs_dir]:
            directory.mkdir(parents=True, exist_ok=True)
    
    def _load_workflow_config(self) -> dict:
        """加载工作流程配置"""
        config_path = self.config_dir / "workflow_config.json"
        
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            logger.warning(f"工作流程配置文件不存在，使用默认配置")
            return self._get_default_workflow_config()
        except json.JSONDecodeError:
            logger.error(f"工作流程配置文件格式错误，使用默认配置")
            return self._get_default_workflow_config()
    
    def _get_default_workflow_config(self) -> dict:
        """获取默认工作流程配置"""
        return {
            "execution_times": {
                "data_collection": "07:00",
                "impact_analysis": "07:30",
                "narrative_generation": "08:00",
                "action_planning": "08:30",
                "notification_sending": "09:00"
            },
            "data_sources": {
                "enabled": ["wind", "bloomberg", "reuters", "central_banks"],
                "fallback_sources": ["financial_news", "social_media"]
            },
            "quality_thresholds": {
                "minimum_events": 10,
                "confidence_threshold": 0.7,
                "data_completeness": 0.8
            },
            "output_formats": {
                "json": True,
                "markdown": True,
                "obsidian": True,
                "gate_ui": True
            },
            "notification_channels": {
                "email": True,
                "slack": True,
                "wechat": False,
                "webhook": False
            }
        }
    
    async def run_daily_workflow(self, execution_date: str = None) -> dict:
        """
        执行每日工作流程
        
        Args:
            execution_date: 执行日期 (YYYY-MM-DD格式)，默认为今天
            
        Returns:
            dict: 工作流程执行结果
        """
        if execution_date is None:
            execution_date = datetime.now().strftime("%Y-%m-%d")
        
        logger.info(f"开始执行 {execution_date} 的每日工作流程")
        
        workflow_result = {
            "execution_date": execution_date,
            "start_time": datetime.now().isoformat(),
            "success": False,
            "phases": {},
            "errors": [],
            "statistics": {}
        }
        
        try:
            # Phase 1: 数据收集
            workflow_result["phases"]["data_collection"] = await self._execute_data_collection(execution_date)
            
            # Phase 2: 影响分析
            workflow_result["phases"]["impact_analysis"] = await self._execute_impact_analysis(execution_date)
            
            # Phase 3: 叙述生成
            workflow_result["phases"]["narrative_generation"] = await self._execute_narrative_generation(execution_date)
            
            # Phase 4: 行动规划
            workflow_result["phases"]["action_planning"] = await self._execute_action_planning(execution_date)
            
            # Phase 5: 结果输出和通知
            workflow_result["phases"]["output_and_notification"] = await self._execute_output_and_notification(execution_date)
            
            workflow_result["success"] = True
            workflow_result["end_time"] = datetime.now().isoformat()
            
            # 生成统计信息
            workflow_result["statistics"] = self._generate_workflow_statistics(workflow_result)
            
            logger.info(f"{execution_date} 每日工作流程执行成功")
            
        except Exception as e:
            logger.error(f"执行每日工作流程时发生错误: {str(e)}")
            workflow_result["errors"].append(str(e))
            workflow_result["end_time"] = datetime.now().isoformat()
        
        # 保存工作流程结果
        await self._save_workflow_result(workflow_result, execution_date)
        
        return workflow_result
    
    async def _execute_data_collection(self, execution_date: str) -> dict:
        """执行数据收集阶段"""
        logger.info("开始执行数据收集阶段")
        
        phase_result = {
            "start_time": datetime.now().isoformat(),
            "events_collected": 0,
            "data_sources_used": [],
            "errors": []
        }
        
        try:
            # 使用事件抓取Agent收集数据
            events = await self.event_scraper.collect_daily_events(execution_date)
            phase_result["events_collected"] = len(events)
            
            # 保存收集到的事件数据
            events_file = self.data_dir / f"events_{execution_date}.json"
            with open(events_file, 'w', encoding='utf-8') as f:
                json.dump(events, f, ensure_ascii=False, indent=2)
            
            phase_result["data_sources_used"] = self.workflow_config["data_sources"]["enabled"]
            phase_result["end_time"] = datetime.now().isoformat()
            
            logger.info(f"数据收集阶段完成，共收集 {len(events)} 个事件")
            
        except Exception as e:
            logger.error(f"数据收集阶段发生错误: {str(e)}")
            phase_result["errors"].append(str(e))
            phase_result["end_time"] = datetime.now().isoformat()
        
        return phase_result
    
    async def _execute_impact_analysis(self, execution_date: str) -> dict:
        """执行影响分析阶段"""
        logger.info("开始执行影响分析阶段")
        
        phase_result = {
            "start_time": datetime.now().isoformat(),
            "events_analyzed": 0,
            "high_impact_events": 0,
            "errors": []
        }
        
        try:
            # 加载收集到的事件数据
            events_file = self.data_dir / f"events_{execution_date}.json"
            with open(events_file, 'r', encoding='utf-8') as f:
                events = json.load(f)
            
            # 使用影响评分Agent分析事件
            impact_scores = await self.impact_scorer.batch_score_events(events)
            phase_result["events_analyzed"] = len(impact_scores)
            
            # 统计高影响事件
            high_impact_levels = ["very_high", "high"]
            phase_result["high_impact_events"] = sum(
                1 for score in impact_scores 
                if score.level.value in high_impact_levels
            )
            
            # 保存影响分析结果
            impacts_file = self.output_dir / f"impact_scores_{execution_date}.json"
            self.impact_scorer.export_impact_scores_to_json(impact_scores, str(impacts_file))
            
            phase_result["end_time"] = datetime.now().isoformat()
            
            logger.info(f"影响分析阶段完成，分析了 {len(impact_scores)} 个事件")
            
        except Exception as e:
            logger.error(f"影响分析阶段发生错误: {str(e)}")
            phase_result["errors"].append(str(e))
            phase_result["end_time"] = datetime.now().isoformat()
        
        return phase_result
    
    async def _execute_narrative_generation(self, execution_date: str) -> dict:
        """执行叙述生成阶段"""
        logger.info("开始执行叙述生成阶段")
        
        phase_result = {
            "start_time": datetime.now().isoformat(),
            "narratives_generated": 0,
            "bilingual_narratives": 0,
            "errors": []
        }
        
        try:
            # 加载事件数据和影响分析结果
            events_file = self.data_dir / f"events_{execution_date}.json"
            impacts_file = self.output_dir / f"impact_scores_{execution_date}.json"
            
            with open(events_file, 'r', encoding='utf-8') as f:
                events = json.load(f)
            
            with open(impacts_file, 'r', encoding='utf-8') as f:
                impact_scores = json.load(f)
            
            # 只为重要事件生成叙述
            important_events = []
            important_impacts = []
            
            for event, impact in zip(events, impact_scores):
                if impact.score >= 60:  # 只为评分较高的事件生成叙述
                    important_events.append(event)
                    important_impacts.append(impact)
            
            # 使用宏观叙述Agent生成叙述
            narratives = await self.narrative_agent.batch_generate_narratives(
                important_events, 
                tone=None,  # 使用默认专业语气
                language=None  # 使用默认双语模式
            )
            
            phase_result["narratives_generated"] = len(narratives)
            phase_result["bilingual_narratives"] = len([
                n for n in narratives 
                if n.chinese_narrative and n.english_narrative
            ])
            
            # 保存叙述结果
            narratives_file = self.output_dir / f"narratives_{execution_date}.json"
            self.narrative_agent.export_narratives_to_json(narratives, str(narratives_file))
            
            phase_result["end_time"] = datetime.now().isoformat()
            
            logger.info(f"叙述生成阶段完成，生成了 {len(narratives)} 个叙述")
            
        except Exception as e:
            logger.error(f"叙述生成阶段发生错误: {str(e)}")
            phase_result["errors"].append(str(e))
            phase_result["end_time"] = datetime.now().isoformat()
        
        return phase_result
    
    async def _execute_action_planning(self, execution_date: str) -> dict:
        """执行行动规划阶段"""
        logger.info("开始执行行动规划阶段")
        
        phase_result = {
            "start_time": datetime.now().isoformat(),
            "action_cards_created": 0,
            "high_priority_actions": 0,
            "errors": []
        }
        
        try:
            # 加载事件数据、影响分析和叙述结果
            events_file = self.data_dir / f"events_{execution_date}.json"
            impacts_file = self.output_dir / f"impact_scores_{execution_date}.json"
            narratives_file = self.output_dir / f"narratives_{execution_date}.json"
            
            with open(events_file, 'r', encoding='utf-8') as f:
                events = json.load(f)
            
            with open(impacts_file, 'r', encoding='utf-8') as f:
                impact_scores = json.load(f)
            
            with open(narratives_file, 'r', encoding='utf-8') as f:
                narratives = json.load(f)
            
            # 只为需要行动的事件生成行动规划
            action_required_events = []
            action_required_impacts = []
            action_required_narratives = []
            
            for i, (event, impact) in enumerate(zip(events, impact_scores)):
                # 如果事件需要行动（影响评分较高或类型需要响应）
                if impact.score >= 50 or event.get("event_type") in ["policy", "macro"]:
                    action_required_events.append(event)
                    action_required_impacts.append(impact)
                    if i < len(narratives):
                        action_required_narratives.append(narratives[i])
            
            # 使用行动规划Agent生成行动卡片
            action_cards = await self.action_planner.batch_create_action_plans(
                action_required_events, 
                action_required_impacts, 
                action_required_narratives
            )
            
            phase_result["action_cards_created"] = len(action_cards)
            phase_result["high_priority_actions"] = sum(
                1 for card in action_cards 
                if card.priority.value in ["urgent", "high"]
            )
            
            # 保存行动卡片
            actions_file = self.output_dir / f"action_cards_{execution_date}.json"
            self.action_planner.export_action_cards_to_json(action_cards, str(actions_file))
            
            phase_result["end_time"] = datetime.now().isoformat()
            
            logger.info(f"行动规划阶段完成，创建了 {len(action_cards)} 个行动卡片")
            
        except Exception as e:
            logger.error(f"行动规划阶段发生错误: {str(e)}")
            phase_result["errors"].append(str(e))
            phase_result["end_time"] = datetime.now().isoformat()
        
        return phase_result
    
    async def _execute_output_and_notification(self, execution_date: str) -> dict:
        """执行输出和通知阶段"""
        logger.info("开始执行输出和通知阶段")
        
        phase_result = {
            "start_time": datetime.now().isoformat(),
            "outputs_generated": [],
            "notifications_sent": [],
            "errors": []
        }
        
        try:
            # 生成多格式输出
            output_formats = self.workflow_config.get("output_formats", {})
            
            # JSON格式输出（已在前面的阶段保存）
            phase_result["outputs_generated"].append("json")
            
            # Markdown格式输出
            if output_formats.get("markdown", False):
                markdown_file = await self._generate_markdown_report(execution_date)
                phase_result["outputs_generated"].append("markdown")
            
            # Obsidian格式输出
            if output_formats.get("obsidian", False):
                await self._generate_obsidian_output(execution_date)
                phase_result["outputs_generated"].append("obsidian")
            
            # Gate UI格式输出
            if output_formats.get("gate_ui", False):
                await self._generate_gate_ui_output(execution_date)
                phase_result["outputs_generated"].append("gate_ui")
            
            # 发送通知
            notification_channels = self.workflow_config.get("notification_channels", {})
            
            if notification_channels.get("email", False):
                # TODO: 实现邮件通知
                phase_result["notifications_sent"].append("email")
            
            if notification_channels.get("slack", False):
                # TODO: 实现Slack通知
                phase_result["notifications_sent"].append("slack")
            
            phase_result["end_time"] = datetime.now().isoformat()
            
            logger.info(f"输出和通知阶段完成，生成了 {len(phase_result['outputs_generated'])} 种格式输出")
            
        except Exception as e:
            logger.error(f"输出和通知阶段发生错误: {str(e)}")
            phase_result["errors"].append(str(e))
            phase_result["end_time"] = datetime.now().isoformat()
        
        return phase_result
    
    async def _generate_markdown_report(self, execution_date: str) -> str:
        """生成Markdown格式报告"""
        markdown_file = self.output_dir / f"daily_report_{execution_date}.md"
        
        # 加载各种数据
        events_file = self.data_dir / f"events_{execution_date}.json"
        impacts_file = self.output_dir / f"impact_scores_{execution_date}.json"
        narratives_file = self.output_dir / f"narratives_{execution_date}.json"
        actions_file = self.output_dir / f"action_cards_{execution_date}.json"
        
        with open(events_file, 'r', encoding='utf-8') as f:
            events = json.load(f)
        with open(impacts_file, 'r', encoding='utf-8') as f:
            impacts = json.load(f)
        with open(narratives_file, 'r', encoding='utf-8') as f:
            narratives = json.load(f)
        with open(actions_file, 'r', encoding='utf-8') as f:
            actions = json.load(f)
        
        # 生成Markdown内容
        markdown_content = f"""# Gate智能财经日历 - 每日报告

**日期**: {execution_date}
**生成时间**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## 📊 今日概览

- **事件总数**: {len(events)}
- **高影响事件**: {len([i for i in impacts if i['score'] >= 60])}
- **生成叙述**: {len(narratives)}
- **行动卡片**: {len(actions)}

## 📅 重要事件列表

| 时间 | 事件 | 重要性 | 影响等级 | 置信度 |
|------|------|--------|----------|--------|
"""
        
        # 添加重要事件表格
        for event, impact in zip(events, impacts):
            if impact['score'] >= 60:
                markdown_content += f"| {event.get('publish_time', '未知')} | {event.get('event_title', '未知')} | {event.get('importance_level', 1)} | {impact['level']} | {impact['confidence']:.1%} |\n"
        
        markdown_content += "\n## 🔍 AI叙述分析\n\n"
        
        # 添加重要事件的AI叙述
        for narrative in narratives[:5]:  # 只显示前5个
            markdown_content += f"### {narrative['event_id']}\n\n"
            markdown_content += f"**中文叙述**:\n{narrative['chinese_narrative']}\n\n"
            markdown_content += f"**English Narrative**:\n{narrative['english_narrative']}\n\n"
            markdown_content += f"**关键洞察**: {', '.join(narrative['key_insights'])}\n\n"
            markdown_content += "---\n\n"
        
        markdown_content += "## 🎯 行动建议\n\n"
        
        # 添加高优先级行动
        high_priority_actions = [a for a in actions if a['priority'] in ['urgent', 'high']]
        for action in high_priority_actions[:3]:  # 只显示前3个
            markdown_content += f"### {action['title']}\n\n"
            markdown_content += f"**行动类型**: {action['action_type']}\n"
            markdown_content += f"**执行时间线**: {action['execution_timeline']}\n"
            markdown_content += f"**目标资产**: {', '.join(action['target_assets'][:5])}\n\n"
            markdown_content += f"**具体行动**:\n"
            for i, act in enumerate(action['specific_actions'], 1):
                markdown_content += f"{i}. {act}\n"
            markdown_content += "\n"
        
        # 保存Markdown文件
        with open(markdown_file, 'w', encoding='utf-8') as f:
            f.write(markdown_content)
        
        logger.info(f"Markdown报告已生成: {markdown_file}")
        return str(markdown_file)
    
    async def _generate_obsidian_output(self, execution_date: str):
        """生成Obsidian格式输出"""
        obsidian_dir = self.output_dir / "obsidian"
        obsidian_dir.mkdir(exist_ok=True)
        
        # 加载行动卡片
        actions_file = self.output_dir / f"action_cards_{execution_date}.json"
        with open(actions_file, 'r', encoding='utf-8') as f:
            actions = json.load(f)
        
        # 为每个行动卡片生成Obsidian笔记
        for action in actions:
            obsidian_content = self.action_planner.generate_obsidian_format(action)
            
            obsidian_file = obsidian_dir / f"action_{action['card_id']}.md"
            with open(obsidian_file, 'w', encoding='utf-8') as f:
                f.write(obsidian_content)
        
        logger.info(f"Obsidian输出已生成: {len(actions)} 个文件")
    
    async def _generate_gate_ui_output(self, execution_date: str):
        """生成Gate UI格式输出"""
        gate_ui_file = self.output_dir / f"gate_ui_data_{execution_date}.json"
        
        # 整合所有数据为Gate UI格式
        gate_ui_data = {
            "date": execution_date,
            "summary": {
                "total_events": 0,
                "high_impact_events": 0,
                "action_cards_created": 0,
                "narratives_generated": 0
            },
            "events": [],
            "impacts": [],
            "narratives": [],
            "action_cards": []
        }
        
        # 加载各种数据
        events_file = self.data_dir / f"events_{execution_date}.json"
        impacts_file = self.output_dir / f"impact_scores_{execution_date}.json"
        narratives_file = self.output_dir / f"narratives_{execution_date}.json"
        actions_file = self.output_dir / f"action_cards_{execution_date}.json"
        
        with open(events_file, 'r', encoding='utf-8') as f:
            gate_ui_data["events"] = json.load(f)
        
        with open(impacts_file, 'r', encoding='utf-8') as f:
            gate_ui_data["impacts"] = json.load(f)
        
        with open(narratives_file, 'r', encoding='utf-8') as f:
            gate_ui_data["narratives"] = json.load(f)
        
        with open(actions_file, 'r', encoding='utf-8') as f:
            gate_ui_data["action_cards"] = json.load(f)
        
        # 生成统计数据
        gate_ui_data["summary"]["total_events"] = len(gate_ui_data["events"])
        gate_ui_data["summary"]["high_impact_events"] = len([
            i for i in gate_ui_data["impacts"] 
            if i['level'] in ['very_high', 'high']
        ])
        gate_ui_data["summary"]["action_cards_created"] = len(gate_ui_data["action_cards"])
        gate_ui_data["summary"]["narratives_generated"] = len(gate_ui_data["narratives"])
        
        # 保存Gate UI数据
        with open(gate_ui_file, 'w', encoding='utf-8') as f:
            json.dump(gate_ui_data, f, ensure_ascii=False, indent=2)
        
        logger.info(f"Gate UI数据已生成: {gate_ui_file}")
    
    def _generate_workflow_statistics(self, workflow_result: dict) -> dict:
        """生成工作流程统计信息"""
        stats = {
            "total_execution_time": 0,
            "phases_completed": 0,
            "total_events_processed": 0,
            "total_actions_created": 0,
            "error_count": len(workflow_result.get("errors", []))
        }
        
        try:
            # 计算总执行时间
            start_time = datetime.fromisoformat(workflow_result["start_time"])
            end_time = datetime.fromisoformat(workflow_result["end_time"])
            stats["total_execution_time"] = (end_time - start_time).total_seconds()
            
            # 统计完成的阶段数
            stats["phases_completed"] = len([
                phase for phase in workflow_result["phases"].values()
                if phase.get("end_time") and not phase.get("errors")
            ])
            
            # 统计处理的事件数
            if "data_collection" in workflow_result["phases"]:
                stats["total_events_processed"] = workflow_result["phases"]["data_collection"].get("events_collected", 0)
            
            # 统计创建的行动数
            if "action_planning" in workflow_result["phases"]:
                stats["total_actions_created"] = workflow_result["phases"]["action_planning"].get("action_cards_created", 0)
            
        except Exception as e:
            logger.error(f"生成统计信息时发生错误: {str(e)}")
        
        return stats
    
    async def _save_workflow_result(self, workflow_result: dict, execution_date: str):
        """保存工作流程结果"""
        result_file = self.output_dir / f"workflow_result_{execution_date}.json"
        
        with open(result_file, 'w', encoding='utf-8') as f:
            json.dump(workflow_result, f, ensure_ascii=False, indent=2)
        
        logger.info(f"工作流程结果已保存: {result_file}")

# 主函数
async def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Gate智能财经日历 - 每日工作流程")
    parser.add_argument(
        "--date",
        type=str,
        help="执行日期 (YYYY-MM-DD格式)，默认为今天"
    )
    parser.add_argument(
        "--project-root",
        type=str,
        help="项目根目录路径"
    )
    parser.add_argument(
        "--debug",
        action="store_true",
        help="启用调试模式"
    )
    
    args = parser.parse_args()
    
    if args.debug:
        logging.getLogger().setLevel(logging.DEBUG)
    
    # 创建工作流程管理器
    manager = DailyWorkflowManager(args.project_root)
    
    # 执行每日工作流程
    result = await manager.run_daily_workflow(args.date)
    
    # 输出结果摘要
    print("\n" + "=" * 60)
    print("🚀 Gate智能财经日历 - 每日工作流程执行完成")
    print("=" * 60)
    print(f"📅 执行日期: {result['execution_date']}")
    print(f"✅ 执行状态: {'成功' if result['success'] else '失败'}")
    print(f"⏱️ 开始时间: {result['start_time']}")
    print(f"🏁 结束时间: {result['end_time']}")
    print(f"📊 统计信息:")
    stats = result.get('statistics', {})
    print(f"  - 处理事件总数: {stats.get('total_events_processed', 0)}")
    print(f"  - 创建行动卡片数: {stats.get('total_actions_created', 0)}")
    print(f"  - 总执行时间: {stats.get('total_execution_time', 0):.1f}秒")
    print(f"  - 错误数量: {stats.get('error_count', 0)}")
    
    if result['errors']:
        print("❌ 错误详情:")
        for error in result['errors']:
            print(f"  - {error}")
    
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())