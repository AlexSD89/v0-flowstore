"""
Gate智能财经日历 - AI Agents模块

本模块包含负责不同金融分析任务的AI Agent实现：
- EventScraperAgent: 事件抓取和数据标准化
- ImpactScoringAgent: 事件影响评分和风险等级评估
- MacroNarrativeAgent: 宏观点评和分析报告生成
- ActionPlannerAgent: 投资行动规划和建议生成

每个Agent都遵循Gate方法论的设计原则：
1. 专业领域专精
2. 数据驱动决策
3. 可解释性输出
4. 质量可验证
"""

__version__ = "1.0.0"
__author__ = "LaunchX Business Ops Team"

from .event_scraper_agent import EventScraperAgent
from .impact_scoring_agent import ImpactScoringAgent
from .macro_narrative_agent import MacroNarrativeAgent
from .action_planner_agent import ActionPlannerAgent

__all__ = [
    "EventScraperAgent",
    "ImpactScoringAgent", 
    "MacroNarrativeAgent",
    "ActionPlannerAgent"
]