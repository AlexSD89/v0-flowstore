"""
Gate智能财经日历 - 行动规划Agent
ActionPlannerAgent - 生成可执行checklist，并回写到Gate任务面板/Obsidian
"""

import asyncio
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from enum import Enum

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ActionType(Enum):
    """行动类型枚举"""
    BUY = "buy"                    # 建议买入
    SELL = "sell"                  # 建议卖出
    HOLD = "hold"                  # 建议持有
    MONITOR = "monitor"            # 密切监控
    REBALANCE = "rebalance"        # 调整组合
    REDUCE_RISK = "reduce_risk"    # 降低风险
    INCREASE_POSITION = "increase_position"  # 增加仓位
    HEDGE = "hedge"                # 对冲风险

class PriorityLevel(Enum):
    """优先级枚举"""
    URGENT = "urgent"              # 紧急
    HIGH = "high"                  # 高
    MEDIUM = "medium"              # 中
    LOW = "low"                    # 低
    INFORMATIONAL = "informational"  # 信息性

class RiskLevel(Enum):
    """风险等级枚举"""
    HIGH = "high"                  # 高风险
    MEDIUM = "medium"              # 中风险
    LOW = "low"                    # 低风险

@dataclass
class ActionCard:
    """行动卡片"""
    card_id: str                    # 卡片ID
    event_id: str                   # 关联事件ID
    action_type: ActionType          # 行动类型
    title: str                      # 卡片标题
    description: str                 # 详细描述
    specific_actions: List[str]      # 具体行动清单
    target_sectors: List[str]       # 目标行业
    target_assets: List[str]        # 目标资产
    execution_timeline: str         # 执行时间线
    priority: PriorityLevel         # 优先级
    risk_level: RiskLevel           # 风险等级
    expected_outcome: str           # 预期结果
    monitoring_metrics: List[str]   # 监控指标
    contingency_plan: str           # 应急预案
    responsible_party: str          # 负责人
    approval_required: bool         # 是否需要审批
    creation_time: str              # 创建时间
    last_updated: str              # 最后更新时间

class ActionPlannerAgent:
    """
    行动规划Agent
    
    功能：
    1. 基于事件分析生成可执行行动卡片
    2. 提供具体的操作建议和checklist
    3. 评估行动的优先级和风险等级
    4. 设计监控指标和应急预案
    5. 同步行动卡片到任务管理系统
    """
    
    def __init__(self, config_path: str = "config/action_planner_config.json"):
        """
        初始化行动规划Agent
        
        Args:
            config_path: 配置文件路径
        """
        self.config = self._load_config(config_path)
        self.action_templates = self._load_action_templates()
        self.risk_assessment_rules = self._load_risk_rules()
        self.priority_matrix = self._load_priority_matrix()
        
    def _load_config(self, config_path: str) -> Dict:
        """加载配置文件"""
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            logger.warning(f"配置文件 {config_path} 不存在，使用默认配置")
            return self._get_default_config()
        except json.JSONDecodeError:
            logger.error(f"配置文件 {config_path} 格式错误，使用默认配置")
            return self._get_default_config()
    
    def _get_default_config(self) -> Dict:
        """获取默认配置"""
        return {
            "default_time_horizon": "1-4周",
            "max_actions_per_card": 5,
            "default_responsible_party": "投资决策委员会",
            "approval_threshold": 0.7,  # 风险阈值，超过需要审批
            "monitoring_frequency": "daily",
            "action_types": {
                "buy": {"risk_weight": 1.2, "priority_bonus": 1.1},
                "sell": {"risk_weight": 1.1, "priority_bonus": 1.0},
                "hold": {"risk_weight": 0.8, "priority_bonus": 0.9},
                "monitor": {"risk_weight": 0.6, "priority_bonus": 1.2}
            }
        }
    
    def _load_action_templates(self) -> Dict:
        """加载行动模板"""
        return {
            "monetary_policy": {
                "title_template": "货币政策调整行动方案",
                "actions": [
                    "评估利率变化对投资组合的影响",
                    "调整固定收益类资产配置",
                    "重新评估利率敏感型股票仓位",
                    "关注央行政策传导路径",
                    "制定阶段性调整策略"
                ]
            },
            "economic_data": {
                "title_template": "经济数据发布应对策略",
                "actions": [
                    "分析数据对市场预期的影响",
                    "调整行业配置权重",
                    "评估经济增长预期变化",
                    "关注数据修正风险",
                    "制定基于数据的投资调整计划"
                ]
            },
            "geopolitical": {
                "title_template": "地缘政治事件应对计划",
                "actions": [
                    "评估事件对全球市场的影响",
                    "调整地区配置权重",
                    "增加避险资产配置",
                    "关注供应链影响",
                    "制定风险对冲策略"
                ]
            },
            "regulatory": {
                "title_template": "监管政策变化应对方案",
                "actions": [
                    "分析监管变化对目标行业的影响",
                    "评估合规成本变化",
                    "调整受影响公司仓位",
                    "关注政策执行时间表",
                    "制定监管风险应对措施"
                ]
            }
        }
    
    def _load_risk_rules(self) -> Dict:
        """加载风险评估规则"""
        return {
            "risk_factors": {
                "high_risk_indicators": [
                    "市场波动性 > 3%",
                    "事件不确定性 > 3",
                    "政策执行难度 > 4",
                    "影响范围 > 3个行业"
                ],
                "medium_risk_indicators": [
                    "市场波动性 2-3%",
                    "事件不确定性 2-3",
                    "政策执行难度 3-4",
                    "影响范围 2-3个行业"
                ],
                "low_risk_indicators": [
                    "市场波动性 < 2%",
                    "事件不确定性 < 2",
                    "政策执行难度 < 3",
                    "影响范围 < 2个行业"
                ]
            },
            "risk_levels": {
                "high": {"score_threshold": 7.0, "approval_required": True},
                "medium": {"score_threshold": 4.0, "approval_required": False},
                "low": {"score_threshold": 0.0, "approval_required": False}
            }
        }
    
    def _load_priority_matrix(self) -> Dict:
        """加载优先级矩阵"""
        return {
            "urgency_factors": {
                "time_sensitivity": {
                    "immediate": 3.0,    # 立即影响
                    "short_term": 2.0,    # 短期影响
                    "medium_term": 1.0,   # 中期影响
                    "long_term": 0.5       # 长期影响
                },
                "importance_level": {
                    5: 3.0,    # 极其重要
                    4: 2.5,    # 非常重要
                    3: 2.0,    # 比较重要
                    2: 1.5,    # 一般重要
                    1: 1.0     # 相对次要
                }
            },
            "priority_thresholds": {
                "urgent": 7.0,
                "high": 5.0,
                "medium": 3.0,
                "low": 1.0
            }
        }
    
    async def create_action_plan(self, event_data: Dict, impact_analysis: Dict = None, narrative: Dict = None) -> ActionCard:
        """
        创建行动规划
        
        Args:
            event_data: 事件数据
            impact_analysis: 影响分析结果
            narrative: 叙述分析结果
            
        Returns:
            ActionCard: 行动卡片
        """
        try:
            # 确定行动类型
            action_type = self._determine_action_type(event_data, impact_analysis)
            
            # 生成行动卡片ID
            card_id = f"ACTION_{event_data.get('event_id', 'UNKNOWN')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            
            # 生成标题和描述
            title, description = self._generate_title_and_description(event_data, action_type)
            
            # 生成具体行动清单
            specific_actions = await self._generate_specific_actions(event_data, action_type)
            
            # 识别目标行业和资产
            target_sectors, target_assets = await self._identify_targets(event_data, action_type)
            
            # 制定执行时间线
            execution_timeline = self._create_execution_timeline(event_data, action_type)
            
            # 评估优先级
            priority = self._assess_priority(event_data, action_type)
            
            # 评估风险等级
            risk_level = self._assess_risk_level(event_data, action_type, impact_analysis)
            
            # 描述预期结果
            expected_outcome = self._describe_expected_outcome(event_data, action_type)
            
            # 设定监控指标
            monitoring_metrics = self._define_monitoring_metrics(event_data, action_type)
            
            # 制定应急预案
            contingency_plan = self._create_contingency_plan(event_data, action_type)
            
            # 确定是否需要审批
            approval_required = self._determine_approval_requirement(risk_level)
            
            # 创建行动卡片
            action_card = ActionCard(
                card_id=card_id,
                event_id=event_data.get("event_id", ""),
                action_type=action_type,
                title=title,
                description=description,
                specific_actions=specific_actions,
                target_sectors=target_sectors,
                target_assets=target_assets,
                execution_timeline=execution_timeline,
                priority=priority,
                risk_level=risk_level,
                expected_outcome=expected_outcome,
                monitoring_metrics=monitoring_metrics,
                contingency_plan=contingency_plan,
                responsible_party=self.config.get("default_responsible_party", "投资决策委员会"),
                approval_required=approval_required,
                creation_time=datetime.now().isoformat(),
                last_updated=datetime.now().isoformat()
            )
            
            return action_card
            
        except Exception as e:
            logger.error(f"创建行动规划时发生错误: {str(e)}")
            # 返回基础行动卡片
            return ActionCard(
                card_id=f"ACTION_ERROR_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                event_id=event_data.get("event_id", ""),
                action_type=ActionType.MONITOR,
                title="行动规划生成失败",
                description=f"生成失败: {str(e)}",
                specific_actions=["请联系技术支持"],
                target_sectors=[],
                target_assets=[],
                execution_timeline="待定",
                priority=PriorityLevel.LOW,
                risk_level=RiskLevel.MEDIUM,
                expected_outcome="待定",
                monitoring_metrics=[],
                contingency_plan="待定",
                responsible_party="技术支持团队",
                approval_required=False,
                creation_time=datetime.now().isoformat(),
                last_updated=datetime.now().isoformat()
            )
    
    def _determine_action_type(self, event_data: Dict, impact_analysis: Dict = None) -> ActionType:
        """确定行动类型"""
        # 基于事件影响分析确定行动类型
        if impact_analysis:
            impact_level = impact_analysis.get("level", "")
            volatility_estimate = impact_analysis.get("volatility_estimate", 0)
            
            if volatility_estimate >= 5.0:
                return ActionType.SELL  # 高波动建议减仓
            elif volatility_estimate >= 3.0:
                return ActionType.REDUCE_RISK  # 中高波动建议降风险
            elif volatility_estimate >= 1.0:
                return ActionType.REBALANCE  # 中等波动建议调仓
            elif impact_level == "information":
                return ActionType.MONITOR  # 信息类仅监控
            else:
                return ActionType.HOLD  # 其他情况持有
        
        # 基于事件类型确定行动类型
        event_type = event_data.get("event_type", "").lower()
        
        if "policy" in event_type:
            importance = event_data.get("importance_level", 1)
            if importance >= 4:
                return ActionType.REBALANCE  # 重要政策变化调整组合
            else:
                return ActionType.MONITOR  # 一般政策变化监控
        
        elif "macro" in event_type:
            return ActionType.MONITOR  # 宏观数据主要监控
        
        else:
            return ActionType.MONITOR  # 默认监控
    
    def _generate_title_and_description(self, event_data: Dict, action_type: ActionType) -> Tuple[str, str]:
        """生成标题和描述"""
        event_title = event_data.get("event_title", "未知事件")
        event_type = event_data.get("event_type", "")
        
        # 获取模板
        event_subtype = event_data.get("event_subtype", "")
        template = self.action_templates.get(event_subtype, 
                                              self.action_templates.get("economic_data", {}))
        
        title = template.get("title_template", f"{event_title}应对方案")
        
        # 生成描述
        action_descriptions = {
            ActionType.BUY: "基于当前市场环境，建议逐步建立相应仓位",
            ActionType.SELL: "基于风险评估，建议及时减少相关敞口",
            ActionType.HOLD: "建议维持当前配置，密切关注市场变化",
            ActionType.MONITOR: "建议密切监控相关指标，等待更明确的信号",
            ActionType.REBALANCE: "建议调整投资组合配置以适应新环境",
            ActionType.REDUCE_RISK: "建议降低投资组合风险敞口",
            ActionType.INCREASE_POSITION: "建议在合适的时机增加相关配置",
            ActionType.HEDGE: "建议采取对冲策略降低风险"
        }
        
        description = action_descriptions.get(action_type, "建议根据市场情况采取相应行动")
        
        return title, description
    
    async def _generate_specific_actions(self, event_data: Dict, action_type: ActionType) -> List[str]:
        """生成具体行动清单"""
        event_subtype = event_data.get("event_subtype", "")
        template = self.action_templates.get(event_subtype, 
                                              self.action_templates.get("economic_data", {}))
        
        base_actions = template.get("actions", [])
        
        # 根据行动类型调整行动清单
        action_modifications = {
            ActionType.BUY: [
                "评估买入时机和价格区间",
                "制定分批建仓计划",
                "设定止损和止盈点位"
            ],
            ActionType.SELL: [
                "评估卖出时机和价格目标",
                "制定分批减仓计划",
                "设定再投资策略"
            ],
            ActionType.HOLD: [
                "定期评估持仓表现",
                "关注催化剂事件",
                "维护风险控制措施"
            ],
            ActionType.MONITOR: [
                "设定关键监控指标",
                "建立预警机制",
                "定期评估市场反应"
            ],
            ActionType.REBALANCE: [
                "分析目标配置比例",
                "制定调仓时间表",
                "考虑交易成本影响"
            ],
            ActionType.REDUCE_RISK: [
                "识别主要风险敞口",
                "制定对冲策略",
                "调整资产配置比例"
            ],
            ActionType.HEDGE: [
                "评估对冲工具选择",
                "计算对冲比例",
                "监控对冲效果"
            ]
        }
        
        modifications = action_modifications.get(action_type, [])
        
        # 合并基础行动和修改行动
        all_actions = base_actions + modifications
        
        # 限制行动数量
        max_actions = self.config.get("max_actions_per_card", 5)
        return all_actions[:max_actions]
    
    async def _identify_targets(self, event_data: Dict, action_type: ActionType) -> Tuple[List[str], List[str]]:
        """识别目标行业和资产"""
        target_sectors = event_data.get("affected_sectors", [])
        target_assets = event_data.get("affected_stocks", [])
        
        # 如果没有明确目标，基于事件类型推断
        if not target_sectors:
            event_type = event_data.get("event_type", "").lower()
            if "policy" in event_type:
                target_sectors = ["金融", "房地产", "消费"]
            elif "macro" in event_type:
                target_sectors = ["科技", "金融", "能源", "消费"]
        
        if not target_assets:
            # 基于行业推荐代表性资产
            sector_assets = {
                "科技": ["AAPL", "MSFT", "GOOGL", "TSLA", "NVDA"],
                "金融": ["JPM", "BAC", "GS", "MS", "C"],
                "消费": ["AMZN", "WMT", "PG", "KO", "HD"],
                "能源": ["XOM", "CVX", "COP", "SLB"],
                "房地产": ["SPG", "AMT", "PSA"],
                "医疗": ["JNJ", "PFE", "UNH", "ABBV"]
            }
            
            for sector in target_sectors:
                if sector in sector_assets:
                    target_assets.extend(sector_assets[sector])
            
            # 去重
            target_assets = list(set(target_assets))
        
        return target_sectors, target_assets
    
    def _create_execution_timeline(self, event_data: Dict, action_type: ActionType) -> str:
        """创建执行时间线"""
        urgency = event_data.get("urgency_level", 1)
        
        if urgency >= 4:
            return "立即执行，24小时内完成主要行动"
        elif urgency >= 3:
            return "1-3个工作日内完成评估和调整"
        elif urgency >= 2:
            return "1-2周内完成阶段性调整"
        else:
            return "2-4周内观察市场反应后行动"
    
    def _assess_priority(self, event_data: Dict, action_type: ActionType) -> PriorityLevel:
        """评估优先级"""
        # 计算紧急度分数
        urgency_score = self.priority_matrix["urgency_factors"]["time_sensitivity"].get(
            "immediate", 1.0
        ) * event_data.get("urgency_level", 1)
        
        importance_score = self.priority_matrix["urgency_factors"]["importance_level"].get(
            event_data.get("importance_level", 1), 1.0
        )
        
        # 行动类型优先级调整
        action_priority_bonus = self.config.get("action_types", {}).get(
            action_type.value, {}
        ).get("priority_bonus", 1.0)
        
        total_score = (urgency_score + importance_score) * action_priority_bonus
        
        # 根据分数确定优先级
        thresholds = self.priority_matrix["priority_thresholds"]
        if total_score >= thresholds["urgent"]:
            return PriorityLevel.URGENT
        elif total_score >= thresholds["high"]:
            return PriorityLevel.HIGH
        elif total_score >= thresholds["medium"]:
            return PriorityLevel.MEDIUM
        else:
            return PriorityLevel.LOW
    
    def _assess_risk_level(self, event_data: Dict, action_type: ActionType, impact_analysis: Dict = None) -> RiskLevel:
        """评估风险等级"""
        risk_score = 0.0
        
        # 基于影响分析的风险评估
        if impact_analysis:
            volatility = impact_analysis.get("volatility_estimate", 0)
            if volatility >= 5.0:
                risk_score += 3.0
            elif volatility >= 3.0:
                risk_score += 2.0
            elif volatility >= 1.0:
                risk_score += 1.0
        
        # 基于事件数据的风险评估
        uncertainty = event_data.get("uncertainty_level", 1)
        risk_score += uncertainty * 0.5
        
        # 行动类型风险权重
        action_risk_weight = self.config.get("action_types", {}).get(
            action_type.value, {}
        ).get("risk_weight", 1.0)
        
        total_risk_score = risk_score * action_risk_weight
        
        # 确定风险等级
        risk_levels = self.risk_assessment_rules["risk_levels"]
        if total_risk_score >= risk_levels["high"]["score_threshold"]:
            return RiskLevel.HIGH
        elif total_risk_score >= risk_levels["medium"]["score_threshold"]:
            return RiskLevel.MEDIUM
        else:
            return RiskLevel.LOW
    
    def _describe_expected_outcome(self, event_data: Dict, action_type: ActionType) -> str:
        """描述预期结果"""
        event_title = event_data.get("event_title", "当前事件")
        
        outcome_descriptions = {
            ActionType.BUY: f"通过执行{event_title}应对方案，预期在市场回暖时获得收益",
            ActionType.SELL: f"通过执行{event_title}应对方案，预期降低投资组合损失",
            ActionType.HOLD: f"通过执行{event_title}应对方案，预期保持投资组合稳定",
            ActionType.MONITOR: f"通过执行{event_title}应对方案，预期及时捕捉市场机会和风险",
            ActionType.REBALANCE: f"通过执行{event_title}应对方案，预期优化投资组合配置",
            ActionType.REDUCE_RISK: f"通过执行{event_title}应对方案，预期降低投资组合风险",
            ActionType.INCREASE_POSITION: f"通过执行{event_title}应对方案，预期增加投资组合收益潜力",
            ActionType.HEDGE: f"通过执行{event_title}应对方案，预期降低投资组合系统性风险"
        }
        
        return outcome_descriptions.get(action_type, f"通过执行{event_title}应对方案，预期优化投资结果")
    
    def _define_monitoring_metrics(self, event_data: Dict, action_type: ActionType) -> List[str]:
        """设定监控指标"""
        base_metrics = [
            "市场指数表现",
            "目标资产价格变化",
            "成交量变化",
            "波动率指标",
            "投资者情绪指标"
        ]
        
        # 根据行动类型添加特定指标
        action_specific_metrics = {
            ActionType.BUY: ["建仓成本", "买入时机信号"],
            ActionType.SELL: ["减仓收益", "卖出时机信号"],
            ActionType.HOLD: ["持仓收益", "相对表现"],
            ActionType.MONITOR: ["市场信号", "催化剂事件"],
            ActionType.REBALANCE: ["配置比例", "再平衡频率"],
            ActionType.REDUCE_RISK: ["风险敞口", "对冲效果"],
            ActionType.INCREASE_POSITION: ["增量收益", "仓位利用率"],
            ActionType.HEDGE: ["对冲比例", "对冲成本"]
        }
        
        specific_metrics = action_specific_metrics.get(action_type, [])
        
        return base_metrics + specific_metrics
    
    def _create_contingency_plan(self, event_data: Dict, action_type: ActionType) -> str:
        """制定应急预案"""
        event_title = event_data.get("event_title", "当前事件")
        
        contingency_plans = {
            ActionType.BUY: f"如果{event_title}影响超预期，暂停建仓并重新评估",
            ActionType.SELL: f"如果市场过度反应，考虑分批减仓而非一次性清仓",
            ActionType.HOLD: f"如果出现重大不利变化，考虑转为主动管理策略",
            ActionType.MONITOR: f"如果监控指标突破阈值，立即启动应对方案",
            ActionType.REBALANCE: f"如果市场波动剧烈，考虑延迟调整并增加观察期",
            ActionType.REDUCE_RISK: f"如果避险效果不佳，考虑增加对冲工具使用",
            ActionType.INCREASE_POSITION: f"如果市场环境恶化，立即暂停增仓计划",
            ActionType.HEDGE: f"如果对冲成本过高，考虑调整对冲策略"
        }
        
        return contingency_plans.get(action_type, "密切监控市场变化，必要时调整策略")
    
    def _determine_approval_requirement(self, risk_level: RiskLevel) -> bool:
        """确定是否需要审批"""
        if risk_level == RiskLevel.HIGH:
            return True
        
        # 也可以基于风险分数阈值判断
        # approval_threshold = self.config.get("approval_threshold", 0.7)
        
        return False
    
    async def batch_create_action_plans(self, events: List[Dict], impact_analyses: List[Dict] = None, narratives: List[Dict] = None) -> List[ActionCard]:
        """批量创建行动规划"""
        tasks = []
        
        # 确保输入列表长度一致
        impact_analyses = impact_analyses or [None] * len(events)
        narratives = narratives or [None] * len(events)
        
        for event, impact, narrative in zip(events, impact_analyses, narratives):
            task = self.create_action_plan(event, impact, narrative)
            tasks.append(task)
        
        return await asyncio.gather(*tasks)
    
    def export_action_cards_to_json(self, action_cards: List[ActionCard], output_path: str):
        """导出行动卡片为JSON格式"""
        results = []
        for card in action_cards:
            result = {
                "card_id": card.card_id,
                "event_id": card.event_id,
                "action_type": card.action_type.value,
                "title": card.title,
                "description": card.description,
                "specific_actions": card.specific_actions,
                "target_sectors": card.target_sectors,
                "target_assets": card.target_assets,
                "execution_timeline": card.execution_timeline,
                "priority": card.priority.value,
                "risk_level": card.risk_level.value,
                "expected_outcome": card.expected_outcome,
                "monitoring_metrics": card.monitoring_metrics,
                "contingency_plan": card.contingency_plan,
                "responsible_party": card.responsible_party,
                "approval_required": card.approval_required,
                "creation_time": card.creation_time,
                "last_updated": card.last_updated
            }
            results.append(result)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        
        logger.info(f"行动卡片结果已导出到: {output_path}")
    
    def generate_gate_task_format(self, action_card: ActionCard) -> Dict:
        """生成Gate任务面板格式"""
        return {
            "task_id": action_card.card_id,
            "task_title": action_card.title,
            "task_type": "investment_action",
            "priority": action_card.priority.value,
            "status": "pending",
            "assigned_to": action_card.responsible_party,
            "due_date": self._calculate_due_date(action_card.execution_timeline),
            "description": action_card.description,
            "checklist": action_card.specific_actions,
            "metadata": {
                "event_id": action_card.event_id,
                "action_type": action_card.action_type.value,
                "risk_level": action_card.risk_level.value,
                "target_sectors": action_card.target_sectors,
                "target_assets": action_card.target_assets,
                "monitoring_metrics": action_card.monitoring_metrics,
                "contingency_plan": action_card.contingency_plan
            }
        }
    
    def _calculate_due_date(self, execution_timeline: str) -> str:
        """计算到期日期"""
        now = datetime.now()
        
        if "立即" in execution_timeline:
            due_date = now + timedelta(hours=24)
        elif "24小时内" in execution_timeline:
            due_date = now + timedelta(hours=24)
        elif "1-3个工作日" in execution_timeline:
            due_date = now + timedelta(days=3)
        elif "1-2周" in execution_timeline:
            due_date = now + timedelta(days=14)
        elif "2-4周" in execution_timeline:
            due_date = now + timedelta(days=28)
        else:
            due_date = now + timedelta(days=7)
        
        return due_date.isoformat()
    
    def generate_obsidian_format(self, action_card: ActionCard) -> str:
        """生成Obsidian格式"""
        obsidian_content = f"""# {action_card.title}

## 📋 基本信息
- **事件ID**: {action_card.event_id}
- **行动类型**: {action_card.action_type.value}
- **优先级**: {action_card.priority.value}
- **风险等级**: {action_card.risk_level.value}
- **负责人**: {action_card.responsible_party}
- **创建时间**: {action_card.creation_time}

## 📝 详细描述
{action_card.description}

## ✅ 行动清单
"""
        
        for i, action in enumerate(action_card.specific_actions, 1):
            obsidian_content += f"{i}. [ ] {action}\n"
        
        obsidian_content += f"""
## 🎯 目标范围
- **目标行业**: {', '.join(action_card.target_sectors)}
- **目标资产**: {', '.join(action_card.target_assets)}

## ⏰ 执行时间线
{action_card.execution_timeline}

## 📈 预期结果
{action_card.expected_outcome}

## 🔍 监控指标
"""
        
        for metric in action_card.monitoring_metrics:
            obsidian_content += f"- {metric}\n"
        
        obsidian_content += f"""
## ⚠️ 应急预案
{action_card.contingency_plan}

---
*最后更新: {action_card.last_updated}*
*状态: 待执行*
"""
        
        return obsidian_content

# 使用示例
async def main():
    """主函数示例"""
    # 创建行动规划Agent
    agent = ActionPlannerAgent()
    
    # 示例事件数据
    sample_event = {
        "event_id": "FED_20251113_RATE_DECISION",
        "event_title": "美联储利率决议",
        "event_type": "policy",
        "event_subtype": "monetary_policy",
        "importance_level": 5,
        "urgency_level": 4,
        "publish_time": "2025-11-13T20:00:00Z",
        "source_priority": 9,
        "affected_regions": ["US", "Global"],
        "affected_sectors": ["finance", "technology", "real_estate"],
        "affected_stocks": ["JPM", "BAC", "AAPL", "GOOGL"],
        "uncertainty_level": 2,
        "market_volatility": 3
    }
    
    # 示例影响分析
    sample_impact = {
        "level": "high",
        "score": 85.0,
        "volatility_estimate": 4.5,
        "confidence": 0.85,
        "reasoning": "重要货币政策变化，预期产生显著市场波动"
    }
    
    # 创建行动规划
    action_card = await agent.create_action_plan(sample_event, sample_impact)
    
    # 输出结果
    print("=" * 60)
    print("行动卡片:")
    print(f"标题: {action_card.title}")
    print(f"行动类型: {action_card.action_type.value}")
    print(f"优先级: {action_card.priority.value}")
    print(f"风险等级: {action_card.risk_level.value}")
    print(f"执行时间线: {action_card.execution_timeline}")
    print("=" * 60)
    print("具体行动:")
    for i, action in enumerate(action_card.specific_actions, 1):
        print(f"{i}. {action}")
    print("=" * 60)
    print("监控指标:")
    for metric in action_card.monitoring_metrics:
        print(f"- {metric}")
    
    # 生成Gate任务格式
    gate_task = agent.generate_gate_task_format(action_card)
    print(f"\nGate任务ID: {gate_task['task_id']}")

if __name__ == "__main__":
    asyncio.run(main())