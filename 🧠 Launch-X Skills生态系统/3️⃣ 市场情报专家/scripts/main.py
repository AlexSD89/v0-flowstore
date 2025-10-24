#!/usr/bin/env python3
"""
市场情报专家 - 主要分析脚本
基于Launch-X市场档案和技术趋势研究的市场分析系统

作者: Launch-X市场研究团队
版本: v1.0.0
日期: 2025-10-23
"""

import json
import os
import sys
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, asdict
import logging
import re

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class MarketOverview:
    """市场概览"""
    market_name: str
    market_size: float
    growth_rate: float
    maturity_stage: str
    key_drivers: List[str]
    barriers: List[str]
    geographic_focus: str

@dataclass
class TrendAnalysis:
    """趋势分析"""
    technology_trends: List[Dict]
    user_behavior_trends: List[Dict]
    policy_trends: List[Dict]
    competitive_trends: List[Dict]
    trend_timeline: List[Dict]

@dataclass
class OpportunityAssessment:
    """机会评估"""
    market_gaps: List[Dict]
    technology_opportunities: List[Dict]
    business_model_innovations: List[Dict]
    cross_industry_opportunities: List[Dict]
    opportunity_matrix: Dict

@dataclass
class CompetitiveLandscape:
    """竞争格局"""
    key_players: List[Dict]
    market_concentration: str
    competitive_strategies: List[Dict]
    entry_barriers: List[Dict]
    threat_level: str

@dataclass
class MarketIntelligence:
    """市场情报"""
    market_overview: MarketOverview
    trend_analysis: TrendAnalysis
    opportunity_assessment: OpportunityAssessment
    competitive_landscape: CompetitiveLandscape
    investment_recommendations: List[Dict]
    risk_factors: List[Dict]

class MarketIntelligenceExpert:
    """市场情报专家主类"""

    def __init__(self, market_name: str):
        self.market_name = market_name
        self.analysis_date = datetime.now().strftime("%Y-%m-%d")
        self.analysis_results = {}
        self.config = self._load_config()

    def _load_config(self) -> Dict:
        """加载配置文件"""
        config_path = "../resources/data/market-intelligence-config.json"
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            logger.warning(f"配置文件未找到: {config_path}, 使用默认配置")
            return self._get_default_config()

    def _get_default_config(self) -> Dict:
        """获取默认配置"""
        return {
            "market_segments": {
                "technology": {"growth_potential": "high", "innovation_speed": "fast"},
                "healthcare": {"growth_potential": "medium", "innovation_speed": "medium"},
                "education": {"growth_potential": "high", "innovation_speed": "fast"},
                "finance": {"growth_potential": "low", "innovation_speed": "slow"}
            },
            "trend_weights": {
                "technology": 0.4,
                "market": 0.3,
                "policy": 0.2,
                "social": 0.1
            },
            "opportunity_criteria": {
                "market_size": {"weight": 0.3, "threshold": 1000000000},
                "growth_rate": {"weight": 0.25, "threshold": 0.15},
                "competition": {"weight": 0.2, "threshold": 0.5},
                "timing": {"weight": 0.15, "threshold": 0.7},
                "resources": {"weight": 0.1, "threshold": 0.6}
            }
        }

    def analyze_market_overview(self, market_input: Dict) -> MarketOverview:
        """分析市场概览"""
        logger.info(f"分析 {self.market_name} 市场概览")

        # 基于输入和配置生成市场概览
        market_size = market_input.get('market_size', self._estimate_market_size())
        growth_rate = market_input.get('growth_rate', self._estimate_growth_rate())

        # 确定市场成熟度
        maturity_stage = self._determine_maturity_stage(growth_rate, market_size)

        # 识别关键驱动因素和阻碍因素
        key_drivers = self._identify_key_drivers(market_input)
        barriers = self._identify_barriers(market_input)

        overview = MarketOverview(
            market_name=self.market_name,
            market_size=market_size,
            growth_rate=growth_rate,
            maturity_stage=maturity_stage,
            key_drivers=key_drivers,
            barriers=barriers,
            geographic_focus=market_input.get('geographic_focus', '中国')
        )

        return overview

    def analyze_trends(self, market_input: Dict, overview: MarketOverview) -> TrendAnalysis:
        """分析市场趋势"""
        logger.info("分析市场发展趋势")

        # 技术趋势分析
        technology_trends = self._analyze_technology_trends(market_input)

        # 用户行为趋势
        user_behavior_trends = self._analyze_user_behavior_trends(market_input)

        # 政策趋势
        policy_trends = self._analyze_policy_trends(market_input)

        # 竞争趋势
        competitive_trends = self._analyze_competitive_trends(market_input)

        # 趋势时间线
        trend_timeline = self._create_trend_timeline(
            technology_trends, user_behavior_trends, policy_trends, competitive_trends
        )

        return TrendAnalysis(
            technology_trends=technology_trends,
            user_behavior_trends=user_behavior_trends,
            policy_trends=policy_trends,
            competitive_trends=competitive_trends,
            trend_timeline=trend_timeline
        )

    def identify_opportunities(self, market_input: Dict, trends: TrendAnalysis) -> OpportunityAssessment:
        """识别市场机会"""
        logger.info("识别市场商业机会")

        # 市场空白点
        market_gaps = self._identify_market_gaps(market_input, trends)

        # 技术机会
        technology_opportunities = self._identify_technology_opportunities(trends)

        # 商业模式创新机会
        business_model_innovations = self._identify_business_model_innovations(market_input)

        # 跨行业机会
        cross_industry_opportunities = self._identify_cross_industry_opportunities(market_input)

        # 机会矩阵
        opportunity_matrix = self._create_opportunity_matrix(
            market_gaps, technology_opportunities, business_model_innovations, cross_industry_opportunities
        )

        return OpportunityAssessment(
            market_gaps=market_gaps,
            technology_opportunities=technology_opportunities,
            business_model_innovations=business_model_innovations,
            cross_industry_opportunities=cross_industry_opportunities,
            opportunity_matrix=opportunity_matrix
        )

    def analyze_competition(self, market_input: Dict) -> CompetitiveLandscape:
        """分析竞争格局"""
        logger.info("分析市场竞争格局")

        # 主要竞争者
        key_players = self._identify_key_players(market_input)

        # 市场集中度
        market_concentration = self._assess_market_concentration(key_players)

        # 竞争策略
        competitive_strategies = self._analyze_competitive_strategies(key_players)

        # 进入壁垒
        entry_barriers = self._identify_entry_barriers(market_input)

        # 威胁等级
        threat_level = self._assess_threat_level(market_concentration, entry_barriers)

        return CompetitiveLandscape(
            key_players=key_players,
            market_concentration=market_concentration,
            competitive_strategies=competitive_strategies,
            entry_barriers=entry_barriers,
            threat_level=threat_level
        )

    def generate_recommendations(self, analysis_results: Dict) -> List[Dict]:
        """生成投资建议"""
        logger.info("生成市场投资建议")

        recommendations = []

        # 基于机会评估的建议
        opportunities = analysis_results['opportunity_assessment']
        for opp_type in ['market_gaps', 'technology_opportunities']:
            for opportunity in getattr(opportunities, opp_type, []):
                if opportunity.get('priority') == 'high':
                    recommendations.append({
                        'type': 'opportunity',
                        'title': f"抓住{opportunity['name']}机会",
                        'description': opportunity['description'],
                        'urgency': opportunity.get('urgency', 'medium'),
                        'potential_return': opportunity.get('potential_return', 'medium'),
                        'time_horizon': opportunity.get('time_horizon', 'medium_term')
                    })

        # 基于竞争分析的建议
        competition = analysis_results['competitive_landscape']
        if competition.threat_level == 'low':
            recommendations.append({
                'type': 'market_entry',
                'title': "考虑市场进入",
                'description': f"当前{self.market_name}市场竞争相对温和，是进入的好时机",
                'urgency': 'high',
                'potential_return': 'high',
                'time_horizon': 'short_term'
            })

        # 基于趋势分析的建议
        trends = analysis_results['trend_analysis']
        for trend in trends.technology_trends[:2]:  # 取前两个最重要的技术趋势
            if trend.get('impact') == 'high':
                recommendations.append({
                    'type': 'technology_investment',
                    'title': f"投资{trend['name']}技术",
                    'description': trend['description'],
                    'urgency': 'medium',
                    'potential_return': 'high',
                    'time_horizon': 'long_term'
                })

        # 风险提醒
        risk_factors = self._identify_risk_factors(analysis_results)

        return recommendations

    def generate_intelligence_report(self, analysis_results: Dict) -> str:
        """生成市场情报报告"""
        logger.info("生成完整的市场情报报告")

        template_path = "../resources/templates/market-intelligence-report.md"
        try:
            with open(template_path, 'r', encoding='utf-8') as f:
                template = f.read()
        except FileNotFoundError:
            logger.warning("模板文件未找到，使用默认格式")
            template = self._get_default_report_template()

        # 准备模板变量
        template_vars = {
            'market_name': self.market_name,
            'analysis_date': self.analysis_date,
            'version': '1.0.0',
            **analysis_results
        }

        # 简单的模板替换
        report = template.format(**template_vars)

        return report

    def analyze_market(self, market_input: Dict) -> Dict:
        """完整的市场分析流程"""
        logger.info(f"开始对 {self.market_name} 进行市场情报分析")

        try:
            # 第一步：市场概览分析
            market_overview = self.analyze_market_overview(market_input)

            # 第二步：趋势分析
            trend_analysis = self.analyze_trends(market_input, market_overview)

            # 第三步：机会识别
            opportunity_assessment = self.identify_opportunities(market_input, trend_analysis)

            # 第四步：竞争分析
            competitive_landscape = self.analyze_competition(market_input)

            # 第五步：生成建议
            investment_recommendations = self.generate_recommendations({
                'opportunity_assessment': opportunity_assessment,
                'competitive_landscape': competitive_landscape,
                'trend_analysis': trend_analysis
            })

            # 识别风险因素
            risk_factors = self._identify_risk_factors({
                'market_overview': market_overview,
                'trend_analysis': trend_analysis,
                'competitive_landscape': competitive_landscape
            })

            # 整合分析结果
            intelligence = MarketIntelligence(
                market_overview=market_overview,
                trend_analysis=trend_analysis,
                opportunity_assessment=opportunity_assessment,
                competitive_landscape=competitive_landscape,
                investment_recommendations=investment_recommendations,
                risk_factors=risk_factors
            )

            analysis_results = {
                'market_name': self.market_name,
                'analysis_date': self.analysis_date,
                'market_intelligence': asdict(intelligence),
                'market_overview': asdict(market_overview),
                'trend_analysis': asdict(trend_analysis),
                'opportunity_assessment': asdict(opportunity_assessment),
                'competitive_landscape': asdict(competitive_landscape),
                'investment_recommendations': investment_recommendations,
                'risk_factors': risk_factors,
                'overall_attractiveness': self._calculate_overall_attractiveness(intelligence)
            }

            # 生成报告
            report = self.generate_intelligence_report(analysis_results)
            analysis_results['intelligence_report'] = report

            logger.info(f"{self.market_name} 市场情报分析完成")
            return analysis_results

        except Exception as e:
            logger.error(f"分析过程中出现错误: {str(e)}")
            return {
                'error': str(e),
                'market_name': self.market_name,
                'analysis_date': self.analysis_date,
                'status': 'FAILED'
            }

    # 辅助方法
    def _estimate_market_size(self) -> float:
        """估算市场规模"""
        # 简化的市场规模估算
        base_sizes = {
            "AI": 50000000000,      # 500亿
            "教育": 30000000000,     # 300亿
            "医疗": 80000000000,     # 800亿
            "金融": 200000000000,    # 2000亿
            "电商": 100000000000,    # 1000亿
        }

        for key, size in base_sizes.items():
            if key in self.market_name:
                return size

        return 10000000000  # 默认100亿

    def _estimate_growth_rate(self) -> float:
        """估算增长率"""
        growth_rates = {
            "AI": 0.35,
            "教育": 0.20,
            "医疗": 0.15,
            "金融": 0.10,
            "电商": 0.12,
        }

        for key, rate in growth_rates.items():
            if key in self.market_name:
                return rate

        return 0.15  # 默认15%

    def _determine_maturity_stage(self, growth_rate: float, market_size: float) -> str:
        """确定市场成熟度"""
        if growth_rate > 0.3 and market_size < 50000000000:
            return "emerging"  # 新兴市场
        elif growth_rate > 0.15:
            return "growing"   # 成长市场
        elif growth_rate > 0.05:
            return "mature"    # 成熟市场
        else:
            return "declining" # 衰退市场

    def _identify_key_drivers(self, market_input: Dict) -> List[str]:
        """识别关键驱动因素"""
        drivers = [
            "技术进步推动创新",
            "政策支持促进发展",
            "消费升级带来需求",
            "数字化转型加速"
        ]

        # 根据市场类型调整驱动因素
        if "AI" in self.market_name:
            drivers.extend(["算法突破", "算力提升", "数据增长"])
        elif "教育" in self.market_name:
            drivers.extend(["在线教育普及", "个性化需求", "政策支持"])

        return drivers[:4]  # 返回前4个

    def _identify_barriers(self, market_input: Dict) -> List[str]:
        """识别阻碍因素"""
        barriers = [
            "技术门槛较高",
            "监管政策不确定性",
            "用户接受度有限",
            "成本控制压力"
        ]

        return barriers[:3]  # 返回前3个

    def _analyze_technology_trends(self, market_input: Dict) -> List[Dict]:
        """分析技术趋势"""
        trends = [
            {
                "name": "人工智能技术普及",
                "description": "AI技术在各行业的应用加速，智能化成为标配",
                "impact": "high",
                "timeline": "2024-2026",
                "confidence": 0.8
            },
            {
                "name": "云计算基础设施完善",
                "description": "云服务成本下降，推动企业数字化转型",
                "impact": "medium",
                "timeline": "2024-2025",
                "confidence": 0.9
            }
        ]

        # 根据市场类型调整技术趋势
        if "AI" in self.market_name:
            trends.insert(0, {
                "name": "大模型技术突破",
                "description": "GPT等大模型推动AI应用边界扩展",
                "impact": "critical",
                "timeline": "2024-2025",
                "confidence": 0.9
            })

        return trends

    def _analyze_user_behavior_trends(self, market_input: Dict) -> List[Dict]:
        """分析用户行为趋势"""
        return [
            {
                "name": "数字化接受度提升",
                "description": "用户对数字化产品和服务的接受度持续提高",
                "impact": "high",
                "demographic": "全年龄段",
                "confidence": 0.85
            },
            {
                "name": "个性化需求增强",
                "description": "用户对个性化、定制化服务的需求日益增长",
                "impact": "medium",
                "demographic": "年轻用户",
                "confidence": 0.8
            }
        ]

    def _analyze_policy_trends(self, market_input: Dict) -> List[Dict]:
        """分析政策趋势"""
        return [
            {
                "name": "数字化转型政策支持",
                "description": "政府推出多项政策支持企业数字化转型",
                "impact": "high",
                "timeline": "2024-2026",
                "confidence": 0.9
            }
        ]

    def _analyze_competitive_trends(self, market_input: Dict) -> List[Dict]:
        """分析竞争趋势"""
        return [
            {
                "name": "行业整合加速",
                "description": "大型企业通过并购整合市场，行业集中度提升",
                "impact": "medium",
                "timeline": "2025-2027",
                "confidence": 0.7
            }
        ]

    def _create_trend_timeline(self, *trend_lists) -> List[Dict]:
        """创建趋势时间线"""
        timeline = []
        current_year = datetime.now().year

        for trend_list in trend_lists:
            for trend in trend_list:
                if 'timeline' in trend:
                    years = trend['timeline'].split('-')
                    if len(years) >= 2:
                        start_year = int(years[0])
                        if start_year >= current_year:
                            timeline.append({
                                'year': start_year,
                                'trend': trend['name'],
                                'impact': trend.get('impact', 'medium'),
                                'description': trend.get('description', '')
                            })

        return sorted(timeline, key=lambda x: x['year'])

    def _identify_market_gaps(self, market_input: Dict, trends: TrendAnalysis) -> List[Dict]:
        """识别市场空白点"""
        return [
            {
                "name": "中小企业服务缺口",
                "description": "中小企业对专业服务的需求未得到充分满足",
                "size": "large",
                "priority": "high",
                "urgency": "medium",
                "potential_return": "high"
            },
            {
                "name": "细分市场机会",
                "description": "特定细分领域的专业化服务存在空白",
                "size": "medium",
                "priority": "medium",
                "urgency": "low",
                "potential_return": "medium"
            }
        ]

    def _identify_technology_opportunities(self, trends: TrendAnalysis) -> List[Dict]:
        """识别技术机会"""
        opportunities = []

        for trend in trends.technology_trends:
            if trend.get('impact') in ['high', 'critical']:
                opportunities.append({
                    "name": f"{trend['name']}应用",
                    "description": f"基于{trend['description']}的商业模式创新",
                    "technology": trend['name'],
                    "readiness": trend.get('confidence', 0.7),
                    "priority": "high",
                    "time_horizon": "medium_term",
                    "potential_return": "high"
                })

        return opportunities

    def _identify_business_model_innovations(self, market_input: Dict) -> List[Dict]:
        """识别商业模式创新机会"""
        return [
            {
                "name": "订阅制服务模式",
                "description": "从一次性销售转向持续性订阅收入模式",
                "innovation_level": "incremental",
                "market_fit": "high",
                "priority": "medium",
                "potential_return": "medium"
            }
        ]

    def _identify_cross_industry_opportunities(self, market_input: Dict) -> List[Dict]:
        """识别跨行业机会"""
        return [
            {
                "name": "AI+传统行业融合",
                "description": "将AI技术应用于传统行业，创造新的价值链",
                "industries": ["制造业", "金融", "医疗"],
                "complexity": "high",
                "priority": "medium",
                "potential_return": "high"
            }
        ]

    def _create_opportunity_matrix(self, *opportunity_lists) -> Dict:
        """创建机会矩阵"""
        all_opportunities = []
        for opp_list in opportunity_lists:
            all_opportunities.extend(opp_list)

        # 按优先级和回报率分类
        matrix = {
            "high_priority_high_return": [],
            "high_priority_medium_return": [],
            "medium_priority_high_return": [],
            "quick_wins": []
        }

        for opp in all_opportunities:
            priority = opp.get('priority', 'medium')
            return_potential = opp.get('potential_return', 'medium')

            if priority == 'high' and return_potential == 'high':
                matrix["high_priority_high_return"].append(opp['name'])
            elif priority == 'high' and return_potential == 'medium':
                matrix["high_priority_medium_return"].append(opp['name'])
            elif priority == 'medium' and return_potential == 'high':
                matrix["medium_priority_high_return"].append(opp['name'])
            elif opp.get('urgency') == 'high':
                matrix["quick_wins"].append(opp['name'])

        return matrix

    def _identify_key_players(self, market_input: Dict) -> List[Dict]:
        """识别主要竞争者"""
        # 基于市场类型生成主要竞争者
        players = {
            "AI": [
                {"name": "百度", "market_share": 0.25, "strength": "技术领先"},
                {"name": "阿里巴巴", "market_share": 0.20, "strength": "生态完整"},
                {"name": "腾讯", "market_share": 0.18, "strength": "数据优势"}
            ],
            "教育": [
                {"name": "新东方", "market_share": 0.15, "strength": "品牌影响力"},
                {"name": "好未来", "market_share": 0.12, "strength": "技术能力"},
                {"name": "猿辅导", "market_share": 0.10, "strength": "用户规模"}
            ]
        }

        for key, player_list in players.items():
            if key in self.market_name:
                return player_list

        # 默认竞争者
        return [
            {"name": "市场领导者A", "market_share": 0.30, "strength": "规模优势"},
            {"name": "技术专家B", "market_share": 0.20, "strength": "技术领先"},
            {"name": "新进入者C", "market_share": 0.10, "strength": "创新能力强"}
        ]

    def _assess_market_concentration(self, key_players: List[Dict]) -> str:
        """评估市场集中度"""
        total_share = sum(player.get('market_share', 0) for player in key_players)

        if total_share > 0.7:
            return "high"
        elif total_share > 0.4:
            return "medium"
        else:
            return "low"

    def _analyze_competitive_strategies(self, key_players: List[Dict]) -> List[Dict]:
        """分析竞争策略"""
        strategies = [
            {
                "strategy": "技术领先",
                "description": "通过技术创新建立竞争优势",
                "adopters": [p["name"] for p in key_players if "技术" in p.get("strength", "")],
                "effectiveness": "high"
            },
            {
                "strategy": "规模扩张",
                "description": "通过规模经济降低成本",
                "adopters": [p["name"] for p in key_players if "规模" in p.get("strength", "")],
                "effectiveness": "medium"
            }
        ]

        return strategies

    def _identify_entry_barriers(self, market_input: Dict) -> List[Dict]:
        """识别进入壁垒"""
        return [
            {
                "barrier": "技术门槛",
                "description": "需要深厚的技术积累和专业人才",
                "height": "high",
                "persistence": "long_term"
            },
            {
                "barrier": "资金要求",
                "description": "需要大量初始投资和持续投入",
                "height": "medium",
                "persistence": "medium_term"
            },
            {
                "barrier": "用户粘性",
                "description": "现有用户对品牌的忠诚度较高",
                "height": "medium",
                "persistence": "long_term"
            }
        ]

    def _assess_threat_level(self, concentration: str, barriers: List[Dict]) -> str:
        """评估威胁等级"""
        high_barriers = sum(1 for b in barriers if b.get('height') == 'high')

        if concentration == 'high' and high_barriers >= 2:
            return "high"
        elif concentration == 'medium' or high_barriers >= 1:
            return "medium"
        else:
            return "low"

    def _identify_risk_factors(self, analysis_results: Dict) -> List[Dict]:
        """识别风险因素"""
        risks = [
            {
                "category": "市场风险",
                "risk": "竞争加剧",
                "probability": "medium",
                "impact": "high",
                "mitigation": "差异化定位，专注于细分市场"
            },
            {
                "category": "技术风险",
                "risk": "技术迭代快速",
                "probability": "high",
                "impact": "medium",
                "mitigation": "持续研发投入，跟踪技术发展趋势"
            },
            {
                "category": "政策风险",
                "risk": "监管政策变化",
                "probability": "medium",
                "impact": "medium",
                "mitigation": "建立政府关系，提前布局合规"
            }
        ]

        return risks

    def _calculate_overall_attractiveness(self, intelligence: MarketIntelligence) -> float:
        """计算整体市场吸引力评分"""
        # 基于多个维度计算综合评分
        scores = {
            'market_growth': min(100, intelligence.market_overview.growth_rate * 200),
            'opportunity_quality': len(intelligence.opportunity_assessment.market_gaps) * 15,
            'competition_favorable': 40 if intelligence.competitive_landscape.threat_level == 'low' else 20,
            'trend_positive': len(intelligence.trend_analysis.technology_trends) * 10
        }

        overall_score = sum(scores.values()) / len(scores)
        return min(100, max(0, overall_score))

    def _get_default_report_template(self) -> str:
        """获取默认报告模板"""
        return """
# {market_name} - 市场情报分析报告

> 分析日期: {analysis_date}
> 报告版本: {version}

## 市场概览

**市场规模**: ¥{market_overview[market_size]:,.0f}
**增长率**: {market_overview[growth_rate]:.1%}
**成熟度**: {market_overview[maturity_stage]}
**地理焦点**: {market_overview[geographic_focus]}

**关键驱动因素**:
{chr(10).join([f"- {driver}" for driver in market_overview[key_drivers]])}

**主要阻碍因素**:
{chr(10).join([f"- {barrier}" for barrier in market_overview[barriers]])}

## 趋势分析

### 技术趋势
{chr(10).join([f"- **{trend['name']}**: {trend['description']}" for trend in trend_analysis[technology_trends]])}

### 用户行为趋势
{chr(10).join([f"- **{trend['name']}**: {trend['description']}" for trend in trend_analysis[user_behavior_trends]])}

### 趋势时间线
{chr(10).join([f"- **{timeline['year']}年**: {timeline['trend']}" for timeline in trend_analysis[trend_timeline]])}

## 机会识别

### 市场空白点
{chr(10).join([f"- **{gap['name']}**: {gap['description']} (优先级: {gap['priority']})" for gap in opportunity_assessment[market_gaps]])}

### 技术机会
{chr(10).join([f"- **{opp['name']}**: {opp['description']}" for opp in opportunity_assessment[technology_opportunities]])}

### 机会矩阵
- 高优先级高回报: {', '.join(opportunity_assessment[opportunity_matrix][high_priority_high_return])}
- 快速胜利: {', '.join(opportunity_assessment[opportunity_matrix][quick_wins])}

## 竞争分析

**市场集中度**: {competitive_landscape[market_concentration]}
**威胁等级**: {competitive_landscape[threat_level]}

### 主要竞争者
{chr(10).join([f"- **{player['name']}**: 市场份额 {player['market_share']:.1%}, 优势: {player['strength']}" for player in competitive_landscape[key_players]])}

### 进入壁垒
{chr(10).join([f"- **{barrier['barrier']}**: {barrier['description']} (高度: {barrier['height']})" for barrier in competitive_landscape[entry_barriers]])}

## 投资建议

{chr(10).join([f"### {rec['title']}{chr(10)}{rec['description']}{chr(10)}- 紧急程度: {rec['urgency']}{chr(10)}- 潜在回报: {rec['potential_return']}{chr(10)}- 时间跨度: {rec['time_horizon']}{chr(10)}" for rec in investment_recommendations])}

## 风险因素

{chr(10).join([f"- **{risk['category']}**: {risk['risk']} (概率: {risk['probability']}, 影响: {risk['impact']}){chr(10)}  缓解措施: {risk['mitigation']}" for risk in risk_factors])}

---

*报告生成: 市场情报专家 v1.0.0*
*分析框架: Launch-X市场研究方法论*
*数据来源: 🟣 Launch-X知识体系*
        """

def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("使用方法: python main.py <市场名称> [配置文件路径]")
        sys.exit(1)

    market_name = sys.argv[1]
    config_path = sys.argv[2] if len(sys.argv) > 2 else None

    # 创建专家实例
    expert = MarketIntelligenceExpert(market_name)

    # 示例市场数据
    sample_market_data = {
        "market_name": market_name,
        "market_size": 50000000000,  # 500亿
        "growth_rate": 0.25,          # 25%增长
        "geographic_focus": "中国",
        "key_segments": ["企业级", "消费级"],
        "technology_intensity": "high",
        "regulatory_environment": "supportive"
    }

    # 执行分析
    logger.info(f"开始分析市场: {market_name}")
    results = expert.analyze_market(sample_market_data)

    # 输出结果
    output_path = f"{market_name}_market_intelligence_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"市场情报分析完成！结果已保存至: {output_path}")

    # 生成Markdown报告
    if 'intelligence_report' in results:
        report_path = f"{market_name}_intelligence_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(results['intelligence_report'])
        print(f"市场情报报告已保存至: {report_path}")

if __name__ == "__main__":
    main()