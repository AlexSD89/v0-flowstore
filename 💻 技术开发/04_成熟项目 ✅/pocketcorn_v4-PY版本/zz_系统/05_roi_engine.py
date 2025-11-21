#!/usr/bin/env python3
"""
05_roi_engine.py - ROI导向解决方案引擎
直接交付MRR增长和可验证ROI的项目识别系统
"""

import json
import datetime
from typing import Dict, List, Any
import math

class ROISolutionEngine:
    """专注于解决方案而非AI技术本身的项目筛选引擎"""
    
    def __init__(self):
        self.solution_categories = {
            'direct_mrr': ['saas_subscription', 'usage_based', 'enterprise_contract'],
            'growth_curve': ['viral_growth', 'network_effects', 'platform_effects'],
            'roi_verifiable': ['cost_reduction', 'revenue_increase', 'time_saving']
        }
    
    def identify_roi_solutions(self, project: Dict) -> Dict[str, Any]:
        """识别可直接交付ROI的解决方案"""
        
        # 反脆弱检查
        antifragile_score = self._calculate_antifragile_score(project)
        
        # ROI直接验证
        roi_metrics = self._calculate_direct_roi(project)
        
        # MRR增长曲线预测
        growth_curve = self._predict_mrr_growth(project)
        
        # 解决方案成熟度
        solution_maturity = self._assess_solution_maturity(project)
        
        return {
            'project_name': project.get('name'),
            'antifragile_score': antifragile_score,
            'roi_verification': roi_metrics,
            'mrr_growth_prediction': growth_curve,
            'solution_maturity': solution_maturity,
            'investment_recommendation': self._generate_roi_recommendation(
                antifragile_score, roi_metrics, growth_curve, solution_maturity
            )
        }
    
    def _calculate_antifragile_score(self, project: Dict) -> Dict[str, float]:
        """计算反脆弱因子 - 保留并增强"""
        
        # 原始反脆弱因子
        base_antifragile = {
            'market_volatility_benefit': 0.0,  # 市场波动受益度
            'competition_pressure': 0.0,       # 竞争压力转化
            'regulatory_shock': 0.0,          # 监管冲击适应性
            'tech_disruption': 0.0,           # 技术颠覆受益度
            'black_swan_resilience': 0.0      # 黑天鹅韧性
        }
        
        # 基于项目特征计算反脆弱
        mrr = project.get('mrr_rmb', 0)
        growth_rate = project.get('growth_rate', 0.2)
        team_size = project.get('team_size', 5)
        
        # 市场波动受益
        if project.get('category') in ['saas', 'marketplace']:
            base_antifragile['market_volatility_benefit'] = min(0.8, growth_rate * 2)
        
        # 竞争压力转化
        base_antifragile['competition_pressure'] = min(0.9, 1 - (mrr / 100000))
        
        # 监管冲击适应
        if project.get('location') in ['深圳', '北京', '杭州']:
            base_antifragile['regulatory_shock'] = 0.7
        
        # 技术颠覆受益
        base_antifragile['tech_disruption'] = min(1.0, team_size / 10)
        
        # 黑天鹅韧性
        base_antifragile['black_swan_resilience'] = min(0.8, growth_rate * 3)
        
        # 综合反脆弱分数
        overall_score = sum(base_antifragile.values()) / len(base_antifragile)
        
        return {
            'overall_score': overall_score,
            'breakdown': base_antifragile,
            'risk_category': 'antifragile' if overall_score > 0.6 else 'fragile'
        }
    
    def _calculate_direct_roi(self, project: Dict) -> Dict[str, Any]:
        """直接可验证的ROI计算"""
        
        # 客户价值计算
        customer_value = {
            'cost_reduction': 0,
            'revenue_increase': 0,
            'time_saving': 0,
            'error_reduction': 0
        }
        
        # 基于产品类型估算价值
        category = project.get('category', '')
        avg_customer_value = project.get('avg_customer_value', 2000)
        
        if 'ai_video' in category.lower():
            customer_value.update({
                'time_saving': avg_customer_value * 0.4,      # 节省80%制作时间
                'cost_reduction': avg_customer_value * 0.3,   # 降低60%制作成本
                'revenue_increase': avg_customer_value * 0.5  # 提升200%内容产出
            })
        elif 'ai_finance' in category.lower():
            customer_value.update({
                'cost_reduction': avg_customer_value * 0.5,   # 降低80%人工成本
                'error_reduction': avg_customer_value * 0.3,  # 减少90%财务错误
                'time_saving': avg_customer_value * 0.2       # 节省70%处理时间
            })
        elif 'ai_content' in category.lower():
            customer_value.update({
                'time_saving': avg_customer_value * 0.6,      # 节省90%创作时间
                'revenue_increase': avg_customer_value * 0.4  # 提升300%内容效率
            })
        
        total_roi = sum(customer_value.values())
        roi_multiple = total_roi / avg_customer_value
        
        return {
            'customer_value_breakdown': customer_value,
            'total_roi_per_customer': total_roi,
            'roi_multiple': roi_multiple,
            'payback_period_months': max(1, int(avg_customer_value / (total_roi / 12))),
            'verifiable_metrics': list(customer_value.keys())
        }
    
    def _predict_mrr_growth(self, project: Dict) -> Dict[str, Any]:
        """MRR增长曲线预测"""
        
        current_mrr = project.get('mrr_rmb', 0)
        current_growth = project.get('growth_rate', 0.2)
        team_size = project.get('team_size', 5)
        
        # 增长阶段识别
        if current_mrr < 10000:
            stage = 'early_growth'
            expected_growth = current_growth * 1.5
        elif current_mrr < 50000:
            stage = 'growth'
            expected_growth = current_growth
        else:
            stage = 'scale'
            expected_growth = current_growth * 0.7
        
        # 12个月预测
        monthly_projections = []
        for month in range(1, 13):
            projected_mrr = current_mrr * ((1 + expected_growth) ** month)
            monthly_projections.append({
                'month': month,
                'mrr': int(projected_mrr),
                'cumulative_growth': ((projected_mrr / current_mrr) - 1) * 100
            })
        
        # 关键节点
        milestones = {
            '100k_mrr_month': self._calculate_milestone_month(current_mrr, 100000, expected_growth),
            '1m_arr_month': self._calculate_milestone_month(current_mrr, 83333, expected_growth),
            'series_a_month': self._calculate_milestone_month(current_mrr, 200000, expected_growth)
        }
        
        return {
            'current_stage': stage,
            'expected_monthly_growth': expected_growth,
            '12_month_projections': monthly_projections,
            'milestones': milestones,
            'confidence_level': min(0.9, 0.5 + (team_size / 10))
        }
    
    def _assess_solution_maturity(self, project: Dict) -> Dict[str, Any]:
        """评估解决方案成熟度"""
        
        # 解决方案维度
        maturity_scores = {
            'problem_solution_fit': 0.0,
            'customer_validation': 0.0,
            'scalability': 0.0,
            'unit_economics': 0.0,
            'team_execution': 0.0
        }
        
        # 基于数据评估
        mrr = project.get('mrr_rmb', 0)
        growth_rate = project.get('growth_rate', 0.2)
        team_size = project.get('team_size', 5)
        
        # Problem-Solution Fit
        if mrr > 10000:
            maturity_scores['problem_solution_fit'] = 0.8
        elif mrr > 5000:
            maturity_scores['problem_solution_fit'] = 0.6
        else:
            maturity_scores['problem_solution_fit'] = 0.4
        
        # Customer Validation
        customer_count = mrr / 200  # 假设平均客单价200
        if customer_count > 100:
            maturity_scores['customer_validation'] = 0.9
        elif customer_count > 50:
            maturity_scores['customer_validation'] = 0.7
        else:
            maturity_scores['customer_validation'] = 0.5
        
        # Scalability
        maturity_scores['scalability'] = min(0.9, growth_rate * 3)
        
        # Unit Economics
        maturity_scores['unit_economics'] = min(0.9, (mrr / (team_size * 15000)))
        
        # Team Execution
        maturity_scores['team_execution'] = min(1.0, team_size / 10 + 0.3)
        
        overall_maturity = sum(maturity_scores.values()) / len(maturity_scores)
        
        return {
            'overall_maturity': overall_maturity,
            'breakdown': maturity_scores,
            'readiness_level': 'ready' if overall_maturity > 0.7 else 'needs_validation'
        }
    
    def _generate_roi_recommendation(self, antifragile: Dict, roi: Dict, 
                                   growth: Dict, maturity: Dict) -> Dict[str, str]:
        """基于ROI的推荐"""
        
        antifragile_score = antifragile['overall_score']
        roi_multiple = roi['roi_multiple']
        maturity_score = maturity['overall_maturity']
        
        # 综合评分
        overall_score = (antifragile_score * 0.3 + 
                        min(1.0, roi_multiple / 10) * 0.4 + 
                        maturity_score * 0.3)
        
        if overall_score >= 0.8:
            recommendation = "立即投资 - 高ROI解决方案"
            priority = "P0"
            investment_range = "¥500万-1000万"
        elif overall_score >= 0.6:
            recommendation = "重点关注 - 中等成熟度"
            priority = "P1"
            investment_range = "¥200万-500万"
        elif overall_score >= 0.4:
            recommendation = "观察验证 - 需要数据支撑"
            priority = "P2"
            investment_range = "¥50万-200万"
        else:
            recommendation = "暂缓投资 - 风险过高"
            priority = "P3"
            investment_range = "¥0-50万"
        
        return {
            'recommendation': recommendation,
            'priority': priority,
            'investment_range': investment_range,
            'key_reasons': [
                f"反脆弱评分: {antifragile_score:.2f}",
                f"ROI倍数: {roi_multiple:.1f}x",
                f"成熟度: {maturity_score:.2f}",
                f"预期12个月MRR: ¥{growth['12_month_projections'][-1]['mrr']:,}"
            ]
        }
    
    def _calculate_milestone_month(self, current_mrr: float, target_mrr: float, growth_rate: float) -> int:
        """计算达到里程碑的月份"""
        if growth_rate <= 0:
            return 999
        months = math.log(target_mrr / current_mrr) / math.log(1 + growth_rate)
        return max(1, int(months))