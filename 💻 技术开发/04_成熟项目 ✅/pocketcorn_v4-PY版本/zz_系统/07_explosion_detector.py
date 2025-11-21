#!/usr/bin/env python3
"""
07_explosion_detector.py - AI公司爆发期识别系统
通过API增长、招聘节点、传统数据维度追踪爆发信号
"""

import json
import datetime
import requests
from typing import Dict, List, Any
import re

class ExplosionDetector:
    """AI公司爆发期识别引擎"""
    
    def __init__(self):
        self.api_monitors = {
            'github': {'weight': 0.9, 'delay_hours': 0},
            'npm': {'weight': 0.8, 'delay_hours': 2},
            'pypi': {'weight': 0.85, 'delay_hours': 1},
            'docker_hub': {'weight': 0.75, 'delay_hours': 4}
        }
        
        self.hiring_channels = {
            'boss_zhipin': {'weight': 0.9, 'freshness_hours': 24},
            'lagou': {'weight': 0.85, 'freshness_hours': 48},
            'linkedin': {'weight': 0.95, 'freshness_hours': 12},
            'weibo_recruit': {'weight': 0.8, 'freshness_hours': 6},
            'twitter_hiring': {'weight': 0.75, 'freshness_hours': 8},
            'xiaohongshu': {'weight': 0.7, 'freshness_hours': 4}
        }
        
        self.ai_dimensions = {
            'api_growth': {'threshold': 50, 'period_days': 30},
            'team_growth': {'threshold': 3, 'period_months': 2},
            'market_hiring': {'roles': ['市场总监', '增长黑客', '商务拓展']},
            'product_signals': ['新功能上线', 'API发布', '集成公告'],
            'customer_signals': ['客户增长', '案例发布', '续约率']
        }
    
    def detect_explosion_signals(self, company: Dict) -> Dict[str, Any]:
        """检测AI公司爆发期信号"""
        
        # 1. API增长监控
        api_signals = self._monitor_api_growth(company)
        
        # 2. 招聘关键节点
        hiring_signals = self._analyze_hiring_patterns(company)
        
        # 3. 传统数据维度
        traditional_signals = self._collect_traditional_dimensions(company)
        
        # 4. 综合爆发评分
        explosion_score = self._calculate_explosion_score(
            api_signals, hiring_signals, traditional_signals
        )
        
        # 5. 爆发期预警
        timeline = self._predict_explosion_timeline(explosion_score)
        
        return {
            'company_name': company.get('name'),
            'explosion_score': explosion_score,
            'api_signals': api_signals,
            'hiring_signals': hiring_signals,
            'traditional_signals': traditional_signals,
            'explosion_timeline': timeline,
            'investment_timeline': self._generate_investment_timeline(explosion_score)
        }
    
    def _monitor_api_growth(self, company: Dict) -> Dict[str, Any]:
        """监控API增长"""
        
        # 模拟API数据
        api_data = {
            'github_stars': self._get_github_growth(company.get('github_repo', '')),
            'npm_downloads': self._get_npm_downloads(company.get('npm_package', '')),
            'pypi_downloads': self._get_pypi_downloads(company.get('pypi_package', '')),
            'api_calls': self._get_api_usage(company.get('api_endpoint', ''))
        }
        
        # 计算增长率
        growth_rates = {}
        for metric, data in api_data.items():
            if data and len(data) >= 2:
                current = data[-1]['value']
                previous = data[-2]['value']
                growth_rates[metric] = ((current - previous) / previous) * 100
        
        return {
            'current_metrics': api_data,
            'growth_rates': growth_rates,
            'explosion_indicator': max(growth_rates.values()) > 50 if growth_rates else False
        }
    
    def _analyze_hiring_patterns(self, company: Dict) -> Dict[str, Any]:
        """分析招聘关键节点"""
        
        # 模拟招聘数据
        hiring_data = self._fetch_hiring_data(company.get('name', ''))
        
        # 关键岗位识别
        critical_roles = {
            'market_director': False,
            'growth_hacker': False,
            'business_development': False,
            'sales_director': False,
            'product_manager': False
        }
        
        # 检查关键岗位
        for job in hiring_data:
            role = job.get('role', '').lower()
            if '市场总监' in role or 'marketing director' in role:
                critical_roles['market_director'] = True
            elif '增长黑客' in role or 'growth hacker' in role:
                critical_roles['growth_hacker'] = True
            elif '商务拓展' in role or 'business development' in role:
                critical_roles['business_development'] = True
            elif '销售总监' in role or 'sales director' in role:
                critical_roles['sales_director'] = True
            elif '产品经理' in role or 'product manager' in role:
                critical_roles['product_manager'] = True
        
        # 爆发期信号
        critical_hires = sum(critical_roles.values())
        explosion_signal = critical_hires >= 2
        
        return {
            'hiring_data': hiring_data,
            'critical_roles': critical_roles,
            'explosion_signal': explosion_signal,
            'hiring_intensity': len(hiring_data)
        }
    
    def _collect_traditional_dimensions(self, company: Dict) -> Dict[str, Any]:
        """收集AI公司传统数据维度"""
        
        dimensions = {
            'product_metrics': {
                'new_features': 0,
                'api_releases': 0,
                'integration_announcements': 0
            },
            'customer_signals': {
                'customer_growth': 0,
                'case_studies': 0,
                'renewal_rate': 0
            },
            'market_signals': {
                'competitor_mentions': 0,
                'industry_reports': 0,
                'media_coverage': 0
            },
            'financial_signals': {
                'funding_announcements': 0,
                'revenue_growth': 0,
                'burn_rate': 0
            }
        }
        
        # 模拟数据收集
        company_name = company.get('name', '')
        
        # 产品信号
        dimensions['product_metrics'].update({
            'new_features': self._count_product_updates(company_name),
            'api_releases': self._count_api_releases(company_name),
            'integration_announcements': self._count_integrations(company_name)
        })
        
        # 客户信号
        dimensions['customer_signals'].update({
            'customer_growth': self._get_customer_growth(company_name),
            'case_studies': self._count_case_studies(company_name),
            'renewal_rate': self._get_renewal_rate(company_name)
        })
        
        return dimensions
    
    def _calculate_explosion_score(self, api_signals: Dict, hiring_signals: Dict, 
                                 traditional_signals: Dict) -> Dict[str, float]:
        """计算综合爆发评分"""
        
        # 权重配置
        weights = {
            'api_growth': 0.3,
            'hiring_intensity': 0.25,
            'product_signals': 0.2,
            'customer_signals': 0.15,
            'financial_signals': 0.1
        }
        
        # 计算各维度分数
        scores = {
            'api_growth': min(1.0, max(api_signals['growth_rates'].values()) / 100) if api_signals['growth_rates'] else 0,
            'hiring_intensity': min(1.0, hiring_signals['hiring_intensity'] / 10),
            'product_signals': sum(traditional_signals['product_metrics'].values()) / 10,
            'customer_signals': traditional_signals['customer_signals']['customer_growth'] / 100,
            'financial_signals': traditional_signals['financial_signals']['revenue_growth'] / 100
        }
        
        # 综合评分
        total_score = sum(scores[key] * weights[key] for key in weights.keys())
        
        return {
            'total_score': total_score,
            'breakdown': scores,
            'explosion_stage': self._determine_stage(total_score),
            'confidence': 0.85
        }
    
    def _determine_stage(self, score: float) -> str:
        """确定爆发阶段"""
        if score >= 0.8:
            return "爆发期"
        elif score >= 0.6:
            return "快速增长期"
        elif score >= 0.4:
            return "准备期"
        else:
            return "观察期"
    
    def _predict_explosion_timeline(self, explosion_score: Dict) -> Dict[str, Any]:
        """预测爆发时间线"""
        
        score = explosion_score['total_score']
        
        if score >= 0.8:
            return {
                "event": "爆发期开始",
                "timeline": "0-2周",
                "confidence": 0.9,
                "signals": ["API增长>200%", "关键岗位招聘", "产品迭代加速"]
            }
        elif score >= 0.6:
            return {
                "event": "快速增长期",
                "timeline": "2-4周",
                "confidence": 0.85,
                "signals": ["API增长>100%", "团队扩张", "客户增长"]
            }
        elif score >= 0.4:
            return {
                "event": "准备期",
                "timeline": "4-8周",
                "confidence": 0.75,
                "signals": ["API稳定增长", "技术迭代", "市场验证"]
            }
        else:
            return {
                "event": "观察期",
                "timeline": "8+周",
                "confidence": 0.6,
                "signals": ["持续监控", "技术积累", "市场测试"]
            }

    def _generate_investment_timeline(self, explosion_score: Dict) -> Dict[str, str]:
        """生成投资时间线"""
        
        stage = explosion_score['explosion_stage']
        score = explosion_score['total_score']
        
        timelines = {
            "爆发期": {
                "immediate_action": "立即投资",
                "due_diligence": "1-2周",
                "term_sheet": "2-3周",
                "closing": "4-6周"
            },
            "快速增长期": {
                "immediate_action": "深度尽调",
                "due_diligence": "2-3周",
                "term_sheet": "3-4周", 
                "closing": "6-8周"
            },
            "准备期": {
                "immediate_action": "持续关注",
                "due_diligence": "4-6周",
                "term_sheet": "6-8周",
                "closing": "8-12周"
            },
            "观察期": {
                "immediate_action": "定期监控",
                "due_diligence": "持续评估",
                "term_sheet": "时机待定",
                "closing": "时机待定"
            }
        }
        
        return timelines.get(stage, timelines["观察期"])
    
    def get_real_time_signals(self, company_name: str) -> List[Dict[str, Any]]:
        """获取实时爆发信号"""
        
        # 模拟实时数据
        return [
            {
                'type': 'api_growth',
                'signal': 'GitHub stars增长200%',
                'timestamp': datetime.datetime.now().isoformat(),
                'confidence': 0.9
            },
            {
                'type': 'hiring',
                'signal': '招聘市场总监+增长黑客',
                'timestamp': datetime.datetime.now().isoformat(),
                'confidence': 0.95
            },
            {
                'type': 'product',
                'signal': '发布新API版本',
                'timestamp': datetime.datetime.now().isoformat(),
                'confidence': 0.8
            }
        ]
    
    # 模拟数据获取函数
    def _get_github_growth(self, repo: str) -> List[Dict[str, Any]]:
        """获取GitHub增长数据"""
        return [
            {'date': '2025-07-01', 'value': 100},
            {'date': '2025-08-01', 'value': 300}
        ]
    
    def _get_npm_downloads(self, package: str) -> List[Dict[str, Any]]:
        """获取NPM下载数据"""
        return [
            {'date': '2025-07-01', 'value': 1000},
            {'date': '2025-08-01', 'value': 2500}
        ]
    
    def _get_pypi_downloads(self, package: str) -> List[Dict[str, Any]]:
        """获取PyPI下载数据"""
        return [
            {'date': '2025-07-01', 'value': 500},
            {'date': '2025-08-01', 'value': 1200}
        ]
    
    def _get_api_usage(self, endpoint: str) -> List[Dict[str, Any]]:
        """获取API使用数据"""
        return [
            {'date': '2025-07-01', 'value': 10000},
            {'date': '2025-08-01', 'value': 25000}
        ]
    
    def _fetch_hiring_data(self, company_name: str) -> List[Dict[str, Any]]:
        """获取招聘数据"""
        return [
            {
                'role': '市场总监',
                'platform': 'boss_zhipin',
                'posted_date': '2025-08-03',
                'compensation': '30-50K'
            },
            {
                'role': '增长黑客',
                'platform': 'linkedin',
                'posted_date': '2025-08-01',
                'compensation': '25-40K'
            }
        ]
    
    def _count_product_updates(self, company_name: str) -> int:
        """统计产品更新"""
        return 3
    
    def _get_customer_growth(self, company_name: str) -> int:
        """获取客户增长"""
        return 150  # 百分比增长
    
    def _count_api_releases(self, company_name: str) -> int:
        """统计API发布"""
        return 2
    
    def _count_integrations(self, company_name: str) -> int:
        """统计集成公告"""
        return 1
    
    def _count_case_studies(self, company_name: str) -> int:
        """统计客户案例"""
        return 3
    
    def _get_renewal_rate(self, company_name: str) -> float:
        """获取续约率"""
        return 0.85

# 使用示例
if __name__ == "__main__":
    detector = ExplosionDetector()
    
    # 示例公司数据
    company = {
        'name': 'AutoPrompt',
        'github_repo': 'autoprompt/autoprompt',
        'npm_package': '@autoprompt/core',
        'category': 'PEC技术栈'
    }
    
    signals = detector.detect_explosion_signals(company)
    print(json.dumps(signals, indent=2, ensure_ascii=False))