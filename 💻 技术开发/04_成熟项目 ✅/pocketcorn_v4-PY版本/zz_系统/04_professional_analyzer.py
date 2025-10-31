#!/usr/bin/env python3
"""
04_professional_analyzer.py - AI投资人级专业分析引擎
包含风险矩阵、退出策略、估值模型、尽职调查清单
"""

import json
import datetime
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
import math

@dataclass
class RiskFactor:
    name: str
    probability: float
    impact: float
    mitigation: str
    time_horizon: str

@dataclass
class ValuationMetrics:
    revenue_multiple: float
    user_based_valuation: int
    growth_adjusted_valuation: int
    risk_adjusted_valuation: int
    final_valuation: int

class ProfessionalAnalyzer:
    def __init__(self):
        self.risk_categories = {
            'market': ['market_size', 'competition', 'timing'],
            'technology': ['technical_debt', 'scalability', 'moat'],
            'team': ['key_person_risk', 'execution_capability', 'network'],
            'financial': ['cash_burn', 'unit_economics', 'funding_risk'],
            'regulatory': ['policy_changes', 'compliance', 'data_privacy']
        }
    
    def generate_risk_matrix(self, project: Dict) -> Dict[str, Any]:
        """生成专业风险矩阵"""
        
        risks = []
        
        # 市场风险
        risks.extend([
            RiskFactor(
                name="市场竞争加剧",
                probability=0.4,
                impact=0.7,
                mitigation="建立技术护城河，专注垂直场景",
                time_horizon="6-12个月"
            ),
            RiskFactor(
                name="市场教育成本超预期",
                probability=0.3,
                impact=0.5,
                mitigation="优化产品市场匹配，降低获客成本",
                time_horizon="3-6个月"
            )
        ])
        
        # 技术风险
        tech_maturity = project.get('tech_maturity', 'medium')
        if tech_maturity == 'early':
            risks.append(RiskFactor(
                name="技术实现难度超预期",
                probability=0.6,
                impact=0.8,
                mitigation="增加技术投入，建立专家顾问团",
                time_horizon="3-9个月"
            ))
        
        # 团队风险
        team_size = project.get('team_size', 5)
        if team_size < 4:
            risks.append(RiskFactor(
                name="团队执行力不足",
                probability=0.5,
                impact=0.6,
                mitigation="引入资深运营合伙人，建立顾问体系",
                time_horizon="1-3个月"
            ))
        
        # 财务风险
        mrr = project.get('mrr_rmb', 0)
        burn_rate = project.get('monthly_burn', mrr * 0.8)
        runway = project.get('cash_reserves', 0) / burn_rate if burn_rate > 0 else 0
        
        if runway < 12:
            risks.append(RiskFactor(
                name="现金流紧张",
                probability=0.7,
                impact=0.9,
                mitigation="加速收入增长，控制成本，准备过桥融资",
                time_horizon="1-6个月"
            ))
        
        # 计算风险评分
        risk_score = sum(r.probability * r.impact for r in risks) / len(risks) if risks else 0
        
        return {
            'overall_risk_score': risk_score,
            'risk_level': self._get_risk_level(risk_score),
            'risk_factors': [
                {
                    'name': r.name,
                    'probability': r.probability,
                    'impact': r.impact,
                    'risk_score': r.probability * r.impact,
                    'mitigation': r.mitigation,
                    'time_horizon': r.time_horizon
                }
                for r in risks
            ],
            'risk_distribution': self._get_risk_distribution(risks)
        }
    
    def calculate_valuation(self, project: Dict) -> ValuationMetrics:
        """专业估值计算"""
        
        mrr = project.get('mrr_rmb', 0)
        growth_rate = project.get('growth_rate', 0.2)
        team_size = project.get('team_size', 5)
        
        # 收入倍数法
        base_multiple = 8  # SaaS行业平均
        growth_adjustment = 1 + (growth_rate * 2)
        size_adjustment = 1 + ((team_size - 5) * 0.05)
        
        revenue_multiple = base_multiple * growth_adjustment * size_adjustment
        revenue_based = mrr * 12 * revenue_multiple
        
        # 用户价值法
        avg_customer_value = project.get('avg_customer_value', 2000)
        customer_count = mrr / avg_customer_value if avg_customer_value > 0 else 0
        user_based = customer_count * 5000  # 每用户5000元估值
        
        # 增长调整估值
        growth_adjusted = revenue_based * (1 + growth_rate * 3)
        
        # 风险调整
        risk_score = self.generate_risk_matrix(project)['overall_risk_score']
        risk_discount = 1 - (risk_score * 0.3)
        risk_adjusted = growth_adjusted * risk_discount
        
        # 最终估值 (取平均值)
        final_valuation = int((revenue_based + user_based + risk_adjusted) / 3)
        
        return ValuationMetrics(
            revenue_multiple=revenue_multiple,
            user_based_valuation=user_based,
            growth_adjusted_valuation=growth_adjusted,
            risk_adjusted_valuation=risk_adjusted,
            final_valuation=final_valuation
        )
    
    def generate_exit_strategy(self, project: Dict) -> Dict[str, Any]:
        """退出策略分析"""
        
        mrr = project.get('mrr_rmb', 0)
        growth_rate = project.get('growth_rate', 0.2)
        
        # 退出时间线
        if mrr >= 50000 and growth_rate >= 0.3:
            exit_timeline = "12-18个月"
            likely_exit = "Series A收购"
            expected_multiple = 15
        elif mrr >= 100000:
            exit_timeline = "18-24个月"
            likely_exit = "战略收购"
            expected_multiple = 20
        else:
            exit_timeline = "24-36个月"
            likely_exit = "Series B/C收购"
            expected_multiple = 25
        
        return {
            'exit_timeline': exit_timeline,
            'likely_exit_scenarios': [
                {
                    'scenario': likely_exit,
                    'probability': 0.6,
                    'expected_return': expected_multiple,
                    'key_triggers': ['MRR milestone', 'market leadership', 'strategic partnerships']
                },
                {
                    'scenario': 'IPO路径',
                    'probability': 0.2,
                    'expected_return': 50,
                    'key_triggers': ['unicorn valuation', 'clear path to 100M revenue']
                },
                {
                    'scenario': 'secondary sale',
                    'probability': 0.2,
                    'expected_return': 8,
                    'key_triggers': ['early acquisition offer', 'founder decision']
                }
            ],
            'exit_preparation_checklist': [
                '建立月度关键指标追踪',
                '每季度更新估值模型',
                '维护潜在收购方关系',
                '准备财务审计材料',
                '建立投资者关系档案'
            ]
        }
    
    def generate_due_diligence_checklist(self, project: Dict) -> Dict[str, List[str]]:
        """尽职调查清单"""
        
        return {
            'financial_due_diligence': [
                '过去12个月银行流水',
                '客户合同和订阅协议',
                '成本结构和毛利率分析',
                '现金流预测模型',
                '税务合规检查',
                '应收账款质量评估'
            ],
            'technical_due_diligence': [
                '代码质量审查',
                '技术架构可扩展性评估',
                'AI模型性能测试',
                '数据安全和隐私合规',
                '技术债务评估',
                '第三方依赖风险分析'
            ],
            'commercial_due_diligence': [
                '客户访谈（至少10个）',
                '竞争格局深度分析',
                '定价策略验证',
                '市场扩张可行性',
                '渠道合作伙伴验证',
                '用户留存率分析'
            ],
            'legal_due_diligence': [
                '公司股权结构核查',
                '知识产权归属确认',
                '员工期权池设置',
                '历史融资协议审查',
                '合规性文件检查',
                '关键合同法律风险评估'
            ],
            'team_due_diligence': [
                '创始人背景深度调查',
                '核心团队能力评估',
                '员工流失率分析',
                '激励机制合理性',
                '顾问团队质量',
                '招聘计划和人才储备'
            ]
        }
    
    def _get_risk_level(self, score: float) -> str:
        """风险等级判断"""
        if score < 0.3:
            return "低风险"
        elif score < 0.5:
            return "中低风险"
        elif score < 0.7:
            return "中等风险"
        else:
            return "高风险"
    
    def _get_risk_distribution(self, risks: List[RiskFactor]) -> Dict[str, int]:
        """风险分布统计"""
        distribution = {'low': 0, 'medium': 0, 'high': 0}
        for risk in risks:
            risk_score = risk.probability * risk.impact
            if risk_score < 0.2:
                distribution['low'] += 1
            elif risk_score < 0.5:
                distribution['medium'] += 1
            else:
                distribution['high'] += 1
        return distribution
    
    def generate_comprehensive_analysis(self, project: Dict) -> Dict[str, Any]:
        """生成综合专业分析 - 包含博弈论分析"""
        
        risk_analysis = self.generate_risk_matrix(project)
        valuation = self.calculate_valuation(project)
        exit_strategy = self.generate_exit_strategy(project)
        dd_checklist = self.generate_due_diligence_checklist(project)
        game_theory = self._generate_game_theory_analysis(project)
        
        return {
            'analysis_date': datetime.datetime.now().isoformat(),
            'project_name': project.get('name'),
            'executive_summary': {
                'investment_recommendation': 'PROCEED' if project.get('pocketcorn_score', 0) >= 4.0 else 'CAUTION',
                'key_strengths': [
                    f"MRR ¥{project.get('mrr_rmb', 0):,} 处于种子期最佳区间",
                    f"团队{project.get('team_size')}人配置合理",
                    f"{project.get('growth_rate', 0)*100:.1f}% 月增长率优秀"
                ],
                'key_concerns': self._identify_key_concerns(project)
            },
            'risk_analysis': risk_analysis,
            'valuation': {
                'current_valuation': valuation.final_valuation,
                'valuation_method': 'Hybrid (Revenue + User + Risk + Game Theory Adjusted)',
                'valuation_range': f"¥{int(valuation.final_valuation * 0.8)} - ¥{int(valuation.final_valuation * 1.2)}",
                'investment_multiple': round(valuation.final_valuation / (project.get('mrr_rmb', 1) * 12), 1),
                'game_theory_adjustment': game_theory['valuation_impact']
            },
            'exit_strategy': exit_strategy,
            'due_diligence_checklist': dd_checklist,
            'game_theory_analysis': game_theory,
            'monitoring_kpis': {
                'monthly_targets': [
                    f"MRR增长 ≥ {max(10, project.get('growth_rate', 0.2) * 100 * 0.8):.0f}%",
                    "客户留存率 ≥ 85%",
                    "毛利率 ≥ 70%",
                    "竞争对手响应时间 ≤ 3个月"
                ],
                'quarterly_reviews': [
                    "竞争格局变化",
                    "产品路线图执行",
                    "团队稳定性评估",
                    "博弈论均衡状态更新"
                ]
            }
        }
    
    def _generate_game_theory_analysis(self, project: Dict) -> Dict[str, Any]:
        """博弈论分析模块"""
        mrr = project.get('mrr_rmb', 0)
        growth_rate = project.get('growth_rate', 0.2)
        market_size = project.get('market_size', 1000000)
        
        # 竞争响应函数建模
        market_share = mrr / market_size
        competitive_response = self._calculate_competitive_response(market_share, growth_rate)
        
        # 投资人博弈均衡
        investor_equilibrium = self._calculate_investor_equilibrium(mrr, growth_rate)
        
        # 退出时机纳什均衡
        exit_nash_equilibrium = self._calculate_exit_nash_equilibrium(mrr, growth_rate)
        
        return {
            'competitive_response_model': competitive_response,
            'investor_equilibrium': investor_equilibrium,
            'exit_nash_equilibrium': exit_nash_equilibrium,
            'valuation_impact': self._calculate_game_theory_valuation_adjustment(
                competitive_response, investor_equilibrium, exit_nash_equilibrium
            ),
            'strategic_recommendations': [
                f"在{competitive_response['response_time']}个月内建立技术护城河",
                f"利用{investor_equilibrium['funding_window']}个月融资窗口期",
                f"在{exit_nash_equilibrium['optimal_exit']}时间窗口启动退出"
            ]
        }
    
    def _identify_key_concerns(self, project: Dict) -> List[str]:
        """识别关键关注点"""
        concerns = []
        
        if project.get('mrr_rmb', 0) < 15000:
            concerns.append("MRR相对较低，需要验证商业模式可持续性")
        
        if project.get('team_size', 5) < 4:
            concerns.append("团队规模较小，可能影响执行速度")
        
        if project.get('growth_rate', 0) < 0.2:
            concerns.append("增长率偏低，需要分析获客瓶颈")
        
        return concerns
    
    def _calculate_competitive_response(self, market_share: float, growth_rate: float) -> Dict[str, Any]:
        """竞争响应函数建模"""
        # 基于市场份额和增长率预测竞品反应时间
        response_time = max(3, int(12 * (1 - market_share) / (1 + growth_rate)))
        
        return {
            'response_time': response_time,
            'response_intensity': min(1.0, market_share * 2),
            'expected_actions': [
                '功能复制',
                '价格战',
                '渠道争夺',
                '人才挖角'
            ],
            'defensive_strategies': [
                '技术护城河建设',
                '客户锁定机制',
                '专利布局',
                '品牌差异化'
            ]
        }
    
    def _calculate_investor_equilibrium(self, mrr: float, growth_rate: float) -> Dict[str, Any]:
        """投资人博弈均衡"""
        # 计算最佳融资时机和估值
        funding_window = max(6, int(18 * (mrr / 50000) / growth_rate))
        expected_valuation = int(mrr * 12 * 8 * (1 + growth_rate * 2))
        
        return {
            'funding_window': funding_window,
            'expected_valuation': expected_valuation,
            'competitive_intensity': min(1.0, mrr / 100000),
            'optimal_round': 'Pre-A' if mrr > 20000 else 'Seed',
            'investor_types': [
                '垂直领域天使',
                '战略投资人',
                '加速器基金'
            ]
        }
    
    def _calculate_exit_nash_equilibrium(self, mrr: float, growth_rate: float) -> Dict[str, Any]:
        """退出时机纳什均衡"""
        # 基于收入和增长计算最优退出时机
        optimal_exit_months = int(24 * (1 + growth_rate) / (1 + mrr / 50000))
        
        return {
            'optimal_exit': f"{optimal_exit_months}个月",
            'exit_scenarios': [
                {
                    'type': '战略收购',
                    'probability': 0.6,
                    'multiple': 15 + growth_rate * 20
                },
                {
                    'type': '财务收购',
                    'probability': 0.25,
                    'multiple': 10 + growth_rate * 15
                },
                {
                    'type': 'IPO',
                    'probability': 0.15,
                    'multiple': 25 + growth_rate * 30
                }
            ]
        }
    
    def _calculate_game_theory_valuation_adjustment(self, 
                                                   competitive_response: Dict, 
                                                   investor_equilibrium: Dict, 
                                                   exit_nash_equilibrium: Dict) -> float:
        """计算博弈论估值调整"""
        competitive_risk = competitive_response['response_intensity'] * 0.2
        funding_premium = investor_equilibrium['competitive_intensity'] * 0.15
        exit_premium = sum([s['probability'] * (s['multiple'] - 15) / 15 
                           for s in exit_nash_equilibrium['exit_scenarios']]) * 0.1
        
        return 1 + funding_premium - competitive_risk + exit_premium