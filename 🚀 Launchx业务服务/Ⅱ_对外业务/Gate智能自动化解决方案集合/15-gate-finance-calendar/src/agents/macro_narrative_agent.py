"""
Gate智能财经日历 - 宏观叙述Agent
MacroNarrativeAgent - 复刻原作者"AI点评"体验，支持多语言和自定义语气的宏观事件分析
"""

import asyncio
import json
import logging
from datetime import datetime
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from enum import Enum

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class NarrativeTone(Enum):
    """叙述语气枚举"""
    PROFESSIONAL = "professional"      # 专业客观
    ANALYTICAL = "analytical"          # 分析深入
    PESSIMISTIC = "pessimistic"        # 悲观谨慎
    OPTIMISTIC = "optimistic"          # 乐观积极
    BALANCED = "balanced"              # 平衡中立
    CAUTIOUS = "cautious"             # 谨慎保守

class NarrativeLanguage(Enum):
    """叙述语言枚举"""
    CHINESE = "chinese"
    ENGLISH = "english"
    BILINGUAL = "bilingual"

@dataclass
class MacroNarrative:
    """宏观叙述结果"""
    event_id: str
    chinese_narrative: str           # 中文叙述
    english_narrative: str           # 英文叙述
    key_insights: List[str]          # 关键洞察
    market_implications: List[str]    # 市场影响
    policy_analysis: str             # 政策分析
    investment_implications: str     # 投资启示
    risk_factors: List[str]          # 风险因素
    confidence_level: float          # 置信度
    tone: NarrativeTone              # 语气风格
    generation_time: str              # 生成时间

class MacroNarrativeAgent:
    """
    宏观叙述Agent
    
    功能：
    1. 分析宏观事件的核心要点
    2. 生成中英文双语点评
    3. 提供政策分析和市场影响评估
    4. 生成投资启示和风险提示
    5. 支持多种语气风格定制
    """
    
    def __init__(self, config_path: str = "config/macro_narrative_config.json"):
        """
        初始化宏观叙述Agent
        
        Args:
            config_path: 配置文件路径
        """
        self.config = self._load_config(config_path)
        self.narrative_templates = self._load_narrative_templates()
        self.policy_knowledge_base = self._load_policy_knowledge()
        self.market_context = {}
        
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
            "default_tone": "professional",
            "default_language": "bilingual",
            "max_insights_count": 5,
            "min_confidence_threshold": 0.7,
            "narrative_length": {
                "chinese": {"min": 200, "max": 500},
                "english": {"min": 150, "max": 400}
            },
            "tone_styles": {
                "professional": {
                    "chinese_keywords": ["数据显示", "分析表明", "值得关注"],
                    "english_keywords": ["data shows", "analysis indicates", "notable"]
                },
                "analytical": {
                    "chinese_keywords": ["深入分析", "从多角度看", "结构化影响"],
                    "english_keywords": ["in-depth analysis", "multiple perspectives", "structured impact"]
                },
                "pessimistic": {
                    "chinese_keywords": ["风险不容忽视", "悲观预期", "谨慎应对"],
                    "english_keywords": ["risks cannot be ignored", "pessimistic outlook", "cautious response"]
                },
                "optimistic": {
                    "chinese_keywords": ["积极信号", "乐观预期", "机遇与挑战并存"],
                    "english_keywords": ["positive signals", "optimistic outlook", "opportunities and challenges"]
                }
            }
        }
    
    def _load_narrative_templates(self) -> Dict:
        """加载叙述模板"""
        return {
            "chinese_templates": {
                "policy_event": """
事件概述：{event_summary}

政策背景：{policy_background}

影响分析：{impact_analysis}

投资启示：{investment_implications}

风险提示：{risk_factors}
                """.strip(),
                
                "economic_data": """
数据发布：{data_summary}

趋势解读：{trend_analysis}

市场影响：{market_impact}

投资建议：{investment_suggestions}
                """.strip(),
                
                "geopolitical": """
地缘事件：{event_description}

影响范围：{impact_scope}

投资策略：{investment_strategy}

风险管控：{risk_management}
                """.strip()
            },
            
            "english_templates": {
                "policy_event": """
Event Overview: {event_summary}

Policy Context: {policy_background}

Impact Analysis: {impact_analysis}

Investment Implications: {investment_implications}

Risk Factors: {risk_factors}
                """.strip(),
                
                "economic_data": """
Data Release: {data_summary}

Trend Interpretation: {trend_analysis}

Market Impact: {market_impact}

Investment Recommendations: {investment_suggestions}
                """.strip(),
                
                "geopolitical": """
Geopolitical Event: {event_description}

Impact Scope: {impact_scope}

Investment Strategy: {investment_strategy}

Risk Management: {risk_management}
                """.strip()
            }
        }
    
    def _load_policy_knowledge(self) -> Dict:
        """加载政策知识库"""
        return {
            "monetary_policy": {
                "interest_rate": {
                    "impact": "利率变化直接影响企业融资成本和资产估值",
                    "sectors": ["金融", "房地产", "消费"],
                    "time_horizon": "3-6个月"
                },
                "quantitative_easing": {
                    "impact": "量化宽松影响流动性和资产价格",
                    "sectors": ["股票", "债券", "大宗商品"],
                    "time_horizon": "6-12个月"
                }
            },
            "fiscal_policy": {
                "tax_policy": {
                    "impact": "税收政策调整影响企业盈利和消费能力",
                    "sectors": ["企业", "消费", "投资"],
                    "time_horizon": "6-18个月"
                },
                "government_spending": {
                    "impact": "政府支出影响相关行业需求",
                    "sectors": ["基建", "科技", "国防"],
                    "time_horizon": "12-24个月"
                }
            },
            "regulatory_policy": {
                "financial_regulation": {
                    "impact": "金融监管影响银行业务模式和风险控制",
                    "sectors": ["银行", "保险", "证券"],
                    "time_horizon": "12-36个月"
                }
            }
        }
    
    async def generate_macro_narrative(self, event_data: Dict, tone: NarrativeTone = None, language: NarrativeLanguage = None) -> MacroNarrative:
        """
        生成宏观事件叙述
        
        Args:
            event_data: 事件数据字典
            tone: 叙述语气
            language: 叙述语言
            
        Returns:
            MacroNarrative: 叙述结果
        """
        try:
            # 设置默认参数
            tone = tone or NarrativeTone(self.config.get("default_tone", "professional"))
            language = language or NarrativeLanguage(self.config.get("default_language", "bilingual"))
            
            # 分析事件类型
            event_type = self._classify_event_type(event_data)
            
            # 生成中文叙述
            chinese_narrative = await self._generate_chinese_narrative(event_data, event_type, tone)
            
            # 生成英文叙述
            english_narrative = await self._generate_english_narrative(event_data, event_type, tone)
            
            # 提取关键洞察
            key_insights = await self._extract_key_insights(event_data)
            
            # 分析市场影响
            market_implications = await self._analyze_market_implications(event_data)
            
            # 政策分析
            policy_analysis = await self._analyze_policy_implications(event_data)
            
            # 投资启示
            investment_implications = await self._generate_investment_implications(event_data)
            
            # 识别风险因素
            risk_factors = await self._identify_risk_factors(event_data)
            
            # 计算置信度
            confidence_level = self._calculate_confidence(event_data)
            
            return MacroNarrative(
                event_id=event_data.get("event_id", ""),
                chinese_narrative=chinese_narrative,
                english_narrative=english_narrative,
                key_insights=key_insights,
                market_implications=market_implications,
                policy_analysis=policy_analysis,
                investment_implications=investment_implications,
                risk_factors=risk_factors,
                confidence_level=confidence_level,
                tone=tone,
                generation_time=datetime.now().isoformat()
            )
            
        except Exception as e:
            logger.error(f"生成宏观叙述时发生错误: {str(e)}")
            return MacroNarrative(
                event_id=event_data.get("event_id", ""),
                chinese_narrative=f"生成失败: {str(e)}",
                english_narrative=f"Generation failed: {str(e)}",
                key_insights=[],
                market_implications=[],
                policy_analysis="",
                investment_implications="",
                risk_factors=[],
                confidence_level=0.0,
                tone=tone or NarrativeTone.PROFESSIONAL,
                generation_time=datetime.now().isoformat()
            )
    
    def _classify_event_type(self, event_data: Dict) -> str:
        """分类事件类型"""
        event_type = event_data.get("event_type", "").lower()
        event_subtype = event_data.get("event_subtype", "").lower()
        
        # 政策类事件
        if "policy" in event_type or "regulation" in event_type:
            if "monetary" in event_subtype or "interest" in event_subtype:
                return "monetary_policy"
            elif "fiscal" in event_subtype or "tax" in event_subtype:
                return "fiscal_policy"
            else:
                return "regulatory_policy"
        
        # 经济数据类事件
        elif "macro" in event_type or "economic" in event_type:
            return "economic_data"
        
        # 地缘政治类事件
        elif "geopolitical" in event_type or "international" in event_type:
            return "geopolitical"
        
        # 默认分类
        else:
            return "general_macro"
    
    async def _generate_chinese_narrative(self, event_data: Dict, event_type: str, tone: NarrativeTone) -> str:
        """生成中文叙述"""
        # 获取语气风格关键词
        tone_config = self.config.get("tone_styles", {}).get(tone.value, {})
        chinese_keywords = tone_config.get("chinese_keywords", [])
        
        # 选择模板
        template = self.narrative_templates["chinese_templates"].get(
            event_type, 
            self.narrative_templates["chinese_templates"]["policy_event"]
        )
        
        # 生成各部分内容
        event_summary = self._generate_event_summary_chinese(event_data)
        policy_background = self._generate_policy_background_chinese(event_data, event_type)
        impact_analysis = self._generate_impact_analysis_chinese(event_data, tone)
        investment_implications = self._generate_investment_implications_chinese(event_data, tone)
        risk_factors_chinese = self._generate_risk_factors_chinese(event_data, tone)
        
        # 填充模板
        narrative = template.format(
            event_summary=event_summary,
            policy_background=policy_background,
            impact_analysis=impact_analysis,
            investment_implications=investment_implications,
            risk_factors=risk_factors_chinese
        )
        
        # 添加语气风格词汇
        for keyword in chinese_keywords:
            if keyword not in narrative:
                narrative = narrative.replace("。", f"，{keyword}。", 1)
                break
        
        return narrative
    
    async def _generate_english_narrative(self, event_data: Dict, event_type: str, tone: NarrativeTone) -> str:
        """生成英文叙述"""
        # 获取语气风格关键词
        tone_config = self.config.get("tone_styles", {}).get(tone.value, {})
        english_keywords = tone_config.get("english_keywords", [])
        
        # 选择模板
        template = self.narrative_templates["english_templates"].get(
            event_type,
            self.narrative_templates["english_templates"]["policy_event"]
        )
        
        # 生成各部分内容
        event_summary = self._generate_event_summary_english(event_data)
        policy_background = self._generate_policy_background_english(event_data, event_type)
        impact_analysis = self._generate_impact_analysis_english(event_data, tone)
        investment_implications_english = self._generate_investment_implications_english(event_data, tone)
        risk_factors_english = self._generate_risk_factors_english(event_data, tone)
        
        # 填充模板
        narrative = template.format(
            event_summary=event_summary,
            policy_background=policy_background,
            impact_analysis=impact_analysis,
            investment_implications=investment_implications_english,
            risk_factors=risk_factors_english
        )
        
        # 添加语气风格词汇
        for keyword in english_keywords:
            if keyword not in narrative:
                narrative = narrative.replace(".", f". {keyword.capitalize()}", 1)
                break
        
        return narrative
    
    def _generate_event_summary_chinese(self, event_data: Dict) -> str:
        """生成事件概述（中文）"""
        event_title = event_data.get("event_title", "")
        event_type = event_data.get("event_type", "")
        importance = event_data.get("importance_level", 1)
        
        importance_desc = {
            5: "极其重要",
            4: "非常重要", 
            3: "较为重要",
            2: "一般重要",
            1: "相对普通"
        }.get(importance, "一般")
        
        return f"{event_title}是一项{importance_desc}的{event_type}事件，值得市场密切关注。"
    
    def _generate_event_summary_english(self, event_data: Dict) -> str:
        """生成事件概述（英文）"""
        event_title = event_data.get("event_title_en", event_data.get("event_title", ""))
        event_type = event_data.get("event_type", "")
        importance = event_data.get("importance_level", 1)
        
        importance_desc = {
            5: "extremely important",
            4: "very important",
            3: "quite important", 
            2: "moderately important",
            1: "relatively normal"
        }.get(importance, "relatively normal")
        
        return f"{event_title} is an {importance_desc} {event_type} event that warrants close market attention."
    
    def _generate_policy_background_chinese(self, event_data: Dict, event_type: str) -> str:
        """生成政策背景（中文）"""
        policy_context = self.policy_knowledge_base.get(event_type, {})
        
        if policy_context:
            impact = policy_context.get("impact", "")
            sectors = policy_context.get("sectors", [])
            time_horizon = policy_context.get("time_horizon", "")
            
            sectors_text = "、".join(sectors) if sectors else "多个行业"
            
            return f"该事件{impact}，主要影响{sectors_text}等，预期影响周期为{time_horizon}。"
        
        return "该事件具有重要的政策指导意义，对相关行业和市场结构将产生深远影响。"
    
    def _generate_policy_background_english(self, event_data: Dict, event_type: str) -> str:
        """生成政策背景（英文）"""
        policy_context = self.policy_knowledge_base.get(event_type, {})
        
        if policy_context:
            impact = policy_context.get("impact", "")
            sectors = policy_context.get("sectors", [])
            time_horizon = policy_context.get("time_horizon", "")
            
            sectors_text = ", ".join(sectors) if sectors else "multiple sectors"
            
            return f"This event {impact}, primarily affecting {sectors_text}, with an expected impact period of {time_horizon}."
        
        return "This event has significant policy implications and will have far-reaching effects on related industries and market structure."
    
    def _generate_impact_analysis_chinese(self, event_data: Dict, tone: NarrativeTone) -> str:
        """生成影响分析（中文）"""
        affected_sectors = event_data.get("affected_sectors", [])
        affected_regions = event_data.get("affected_regions", [])
        
        sectors_text = "、".join(affected_sectors) if affected_sectors else "多个行业"
        regions_text = "、".join(affected_regions) if affected_regions else "多个地区"
        
        # 根据语气调整表达
        tone_adjustments = {
            NarrativeTone.PROFESSIONAL: "从专业角度分析",
            NarrativeTone.ANALYTICAL: "深入分析表明",
            NarrativeTone.PESSIMISTIC: "不容忽视的是",
            NarrativeTone.OPTIMISTIC: "积极来看",
            NarrativeTone.BALANCED: "综合来看",
            NarrativeTone.CAUTIOUS: "需要谨慎关注的是"
        }
        
        analysis_intro = tone_adjustments.get(tone, "综合来看")
        
        return f"{analysis_intro}，该事件将对{sectors_text}产生结构性影响，特别是在{regions_text}地区。市场预期将重新定价相关风险和机遇。"
    
    def _generate_impact_analysis_english(self, event_data: Dict, tone: NarrativeTone) -> str:
        """生成影响分析（英文）"""
        affected_sectors = event_data.get("affected_sectors", [])
        affected_regions = event_data.get("affected_regions", [])
        
        sectors_text = ", ".join(affected_sectors) if affected_sectors else "multiple sectors"
        regions_text = ", ".join(affected_regions) if affected_regions else "multiple regions"
        
        # 根据语气调整表达
        tone_adjustments = {
            NarrativeTone.PROFESSIONAL: "From a professional perspective",
            NarrativeTone.ANALYTICAL: "In-depth analysis indicates",
            NarrativeTone.PESSIMISTIC: "Notably concerning",
            NarrativeTone.OPTIMISTIC: "Positively speaking",
            NarrativeTone.BALANCED: "Overall",
            NarrativeTone.CAUTIOUS: "Requiring careful attention"
        }
        
        analysis_intro = tone_adjustments.get(tone, "Overall")
        
        return f"{analysis_intro}, this event will have structural impacts on {sectors_text}, particularly in {regions_text}. Market expectations will reprice related risks and opportunities."
    
    def _generate_investment_implications_chinese(self, event_data: Dict, tone: NarrativeTone) -> str:
        """生成投资启示（中文）"""
        investment_suggestions = []
        
        affected_sectors = event_data.get("affected_sectors", [])
        if "technology" in affected_sectors:
            investment_suggestions.append("科技板块面临重新估值机会")
        if "finance" in affected_sectors:
            investment_suggestions.append("金融股需要关注政策传导效应")
        if "energy" in affected_sectors:
            investment_suggestions.append("能源价格波动带来交易机会")
        
        # 根据语气调整建议
        tone_suggestions = {
            NarrativeTone.PROFESSIONAL: "建议投资者保持关注",
            NarrativeTone.ANALYTICAL: "基于分析，投资者应",
            NarrativeTone.PESSIMISTIC: "投资者需要谨慎对待",
            NarrativeTone.OPTIMISTIC: "投资者可积极把握",
            NarrativeTone.BALANCED: "投资者应平衡考虑",
            NarrativeTone.CAUTIOUS: "建议投资者观望为主"
        }
        
        suggestion_intro = tone_suggestions.get(tone, "投资者应")
        
        if investment_suggestions:
            return f"{suggestion_intro}：{'; '.join(investment_suggestions)}。"
        
        return f"{suggestion_intro}相关行业的政策影响和市场反应。"
    
    def _generate_investment_implications_english(self, event_data: Dict, tone: NarrativeTone) -> str:
        """生成投资启示（英文）"""
        investment_suggestions = []
        
        affected_sectors = event_data.get("affected_sectors", [])
        if "technology" in affected_sectors:
            investment_suggestions.append("technology sector faces revaluation opportunities")
        if "finance" in affected_sectors:
            investment_suggestions.append("financial stocks need attention to policy transmission effects")
        if "energy" in affected_sectors:
            investment_suggestions.append("energy price volatility creates trading opportunities")
        
        # 根据语气调整建议
        tone_suggestions = {
            NarrativeTone.PROFESSIONAL: "Investors should monitor",
            NarrativeTone.ANALYTICAL: "Based on analysis, investors should",
            NarrativeTone.PESSIMISTIC: "Investors need to approach cautiously",
            NarrativeTone.OPTIMISTIC: "Investors can actively pursue",
            NarrativeTone.BALANCED: "Investors should consider a balanced approach",
            NarrativeTone.CAUTIOUS: "Investors should maintain a wait-and-see approach"
        }
        
        suggestion_intro = tone_suggestions.get(tone, "Investors should")
        
        if investment_suggestions:
            return f"{suggestion_intro}: {'; '.join(investment_suggestions)}."
        
        return f"{suggestion_intro} policy impacts and market reactions in related sectors."
    
    def _generate_risk_factors_chinese(self, event_data: Dict, tone: NarrativeTone) -> str:
        """生成风险因素（中文）"""
        risk_factors = []
        
        uncertainty_level = event_data.get("uncertainty_level", 1)
        if uncertainty_level >= 3:
            risk_factors.append("事件结果存在不确定性")
        
        market_volatility = event_data.get("market_volatility", 1)
        if market_volatility >= 3:
            risk_factors.append("市场波动性加剧")
        
        # 根据语气调整风险描述
        tone_risk = {
            NarrativeTone.PROFESSIONAL: "需要专业风险管理",
            NarrativeTone.ANALYTICAL: "需要深入风险评估",
            NarrativeTone.PESSIMISTIC: "风险不容忽视",
            NarrativeTone.OPTIMISTIC: "风险可控但需关注",
            NarrativeTone.BALANCED: "风险与机遇并存",
            NarrativeTone.CAUTIOUS: "需要高度警惕风险"
        }
        
        risk_intro = tone_risk.get(tone, "需要关注风险")
        
        if risk_factors:
            return f"{risk_intro}：{'; '.join(risk_factors)}。"
        
        return f"{risk_intro}相关事件的潜在影响。"
    
    def _generate_risk_factors_english(self, event_data: Dict, tone: NarrativeTone) -> str:
        """生成风险因素（英文）"""
        risk_factors = []
        
        uncertainty_level = event_data.get("uncertainty_level", 1)
        if uncertainty_level >= 3:
            risk_factors.append("event outcomes contain uncertainty")
        
        market_volatility = event_data.get("market_volatility", 1)
        if market_volatility >= 3:
            risk_factors.append("increased market volatility")
        
        # 根据语气调整风险描述
        tone_risk = {
            NarrativeTone.PROFESSIONAL: "requires professional risk management",
            NarrativeTone.ANALYTICAL: "needs in-depth risk assessment",
            NarrativeTone.PESSIMISTIC: "risks cannot be ignored",
            NarrativeTone.OPTIMISTIC: "risks are manageable but require attention",
            NarrativeTone.BALANCED: "risks and opportunities coexist",
            NarrativeTone.CAUTIOUS: "requires high vigilance to risks"
        }
        
        risk_intro = tone_risk.get(tone, "requires attention to risks")
        
        if risk_factors:
            return f"{risk_intro}: {'; '.join(risk_factors)}."
        
        return f"{risk_intro} potential impacts of related events."
    
    async def _extract_key_insights(self, event_data: Dict) -> List[str]:
        """提取关键洞察"""
        insights = []
        
        # 从事件重要性提取
        importance = event_data.get("importance_level", 1)
        if importance >= 4:
            insights.append("该事件具有高影响力，需要重点关注")
        
        # 从影响范围提取
        affected_sectors = event_data.get("affected_sectors", [])
        if len(affected_sectors) >= 3:
            insights.append(f"事件影响{len(affected_sectors)}个主要行业，范围广泛")
        
        # 从数据源可信度提取
        source_priority = event_data.get("source_priority", 5)
        if source_priority >= 8:
            insights.append("信息来源权威性强，可信度高")
        
        # 从时间敏感度提取
        urgency = event_data.get("urgency_level", 1)
        if urgency >= 4:
            insights.append("事件具有高度时效性，需要及时响应")
        
        return insights
    
    async def _analyze_market_implications(self, event_data: Dict) -> List[str]:
        """分析市场影响"""
        implications = []
        
        event_type = event_data.get("event_type", "").lower()
        
        if "policy" in event_type:
            implications.append("政策变化将引导市场预期重新定价")
            implications.append("相关监管环境可能发生调整")
        
        if "macro" in event_type:
            implications.append("宏观经济数据影响市场流动性预期")
            implications.append("投资者风险偏好可能发生变化")
        
        # 从影响行业分析
        affected_sectors = event_data.get("affected_sectors", [])
        if affected_sectors:
            implications.append(f"重点影响{', '.join(affected_sectors[:3])}等板块")
        
        # 从影响地区分析
        affected_regions = event_data.get("affected_regions", [])
        if len(affected_regions) >= 2:
            implications.append("跨区域市场将产生连锁反应")
        
        return implications
    
    async def _analyze_policy_implications(self, event_data: Dict) -> str:
        """分析政策影响"""
        event_type = event_data.get("event_type", "").lower()
        
        policy_types = {
            "monetary": "货币政策调整将影响资金成本和流动性环境",
            "fiscal": "财政政策变化将影响政府支出和税收结构",
            "regulatory": "监管政策调整将重塑行业竞争格局"
        }
        
        for policy_type, implication in policy_types.items():
            if policy_type in event_type:
                return implication
        
        return "政策变化将对市场结构和参与者行为产生深远影响"
    
    async def _generate_investment_implications(self, event_data: Dict) -> str:
        """生成投资启示"""
        event_type = event_data.get("event_type", "").lower()
        
        investment_guidance = {
            "monetary": "利率敏感型资产需要重新评估，固定收益投资策略需要调整",
            "fiscal": "受益行业和公司值得关注，相关产业链投资机会增加",
            "regulatory": "合规成本上升，行业整合加速，龙头企业优势凸显",
            "macro": "宏观经济预期调整，资产配置需要重新平衡"
        }
        
        for investment_type, guidance in investment_guidance.items():
            if investment_type in event_type:
                return guidance
        
        return "投资者需要根据事件影响调整投资组合和风险管理策略"
    
    async def _identify_risk_factors(self, event_data: Dict) -> List[str]:
        """识别风险因素"""
        risk_factors = []
        
        # 数据不确定性风险
        uncertainty = event_data.get("uncertainty_level", 1)
        if uncertainty >= 3:
            risk_factors.append("事件结果存在较大不确定性")
        
        # 市场波动风险
        volatility = event_data.get("market_volatility", 1)
        if volatility >= 3:
            risk_factors.append("市场波动性显著增加")
        
        # 时间滞后风险
        urgency = event_data.get("urgency_level", 1)
        if urgency <= 2:
            risk_factors.append("政策效果可能存在时滞")
        
        # 信息不对称风险
        source_priority = event_data.get("source_priority", 5)
        if source_priority <= 5:
            risk_factors.append("信息来源可信度需要进一步验证")
        
        return risk_factors
    
    def _calculate_confidence(self, event_data: Dict) -> float:
        """计算置信度"""
        confidence_factors = []
        
        # 数据完整性
        required_fields = ["event_title", "event_type", "importance_level"]
        completeness = sum(1 for field in required_fields if field in event_data and event_data[field])
        confidence_factors.append(completeness / len(required_fields))
        
        # 数据源可信度
        source_priority = event_data.get("source_priority", 5)
        confidence_factors.append(min(source_priority / 10, 1.0))
        
        # 信息新鲜度
        if "publish_time" in event_data:
            try:
                publish_time = event_data["publish_time"]
                if isinstance(publish_time, str):
                    publish_dt = datetime.fromisoformat(publish_time.replace('Z', '+00:00'))
                else:
                    publish_dt = publish_time
                
                time_diff = (datetime.now(publish_dt.tzinfo) - publish_dt).total_seconds() / 3600
                time_confidence = max(0.3, 1.0 - time_diff / 168)  # 一周内衰减
                confidence_factors.append(time_confidence)
            except:
                confidence_factors.append(0.5)
        else:
            confidence_factors.append(0.3)
        
        return sum(confidence_factors) / len(confidence_factors)
    
    async def batch_generate_narratives(self, events: List[Dict], tone: NarrativeTone = None, language: NarrativeLanguage = None) -> List[MacroNarrative]:
        """批量生成叙述"""
        tasks = [self.generate_macro_narrative(event, tone, language) for event in events]
        return await asyncio.gather(*tasks)
    
    def export_narratives_to_json(self, narratives: List[MacroNarrative], output_path: str):
        """导出叙述为JSON格式"""
        results = []
        for narrative in narratives:
            result = {
                "event_id": narrative.event_id,
                "chinese_narrative": narrative.chinese_narrative,
                "english_narrative": narrative.english_narrative,
                "key_insights": narrative.key_insights,
                "market_implications": narrative.market_implications,
                "policy_analysis": narrative.policy_analysis,
                "investment_implications": narrative.investment_implications,
                "risk_factors": narrative.risk_factors,
                "confidence_level": narrative.confidence_level,
                "tone": narrative.tone.value,
                "generation_time": narrative.generation_time
            }
            results.append(result)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        
        logger.info(f"宏观叙述结果已导出到: {output_path}")

# 使用示例
async def main():
    """主函数示例"""
    # 创建宏观叙述Agent
    agent = MacroNarrativeAgent()
    
    # 示例事件数据
    sample_event = {
        "event_id": "FED_20251113_RATE_DECISION",
        "event_title": "美联储利率决议",
        "event_title_en": "Fed Interest Rate Decision",
        "event_type": "policy",
        "event_subtype": "monetary_policy",
        "importance_level": 5,
        "urgency_level": 4,
        "publish_time": "2025-11-13T20:00:00Z",
        "source_priority": 9,
        "affected_regions": ["US", "Global"],
        "affected_sectors": ["finance", "technology", "real_estate"],
        "uncertainty_level": 2,
        "market_volatility": 3
    }
    
    # 生成叙述
    narrative = await agent.generate_macro_narrative(
        sample_event, 
        tone=NarrativeTone.PROFESSIONAL,
        language=NarrativeLanguage.BILINGUAL
    )
    
    # 输出结果
    print("=" * 60)
    print("中文叙述:")
    print(narrative.chinese_narrative)
    print("=" * 60)
    print("English Narrative:")
    print(narrative.english_narrative)
    print("=" * 60)
    print("关键洞察:")
    for insight in narrative.key_insights:
        print(f"- {insight}")
    print("=" * 60)
    print("市场影响:")
    for implication in narrative.market_implications:
        print(f"- {implication}")

if __name__ == "__main__":
    asyncio.run(main())