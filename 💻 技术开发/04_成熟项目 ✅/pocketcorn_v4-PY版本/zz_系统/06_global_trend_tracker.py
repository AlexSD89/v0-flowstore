#!/usr/bin/env python3
"""
06_global_trend_tracker.py - 全球趋势追踪与追随者识别
海外趋势→国内追随者的预判机制
"""

import json
import datetime
from typing import Dict, List, Any
import math

class GlobalTrendTracker:
    """全球信息雷达系统"""
    
    def __init__(self):
        self.global_sources = {
            'us': {
                'techcrunch': {'weight': 0.9, 'delay_hours': 0},
                'pitchbook': {'weight': 0.95, 'delay_hours': 2},
                'producthunt': {'weight': 0.85, 'delay_hours': 0},
                'hacker_news': {'weight': 0.8, 'delay_hours': 0},
                'crunchbase': {'weight': 0.92, 'delay_hours': 4}
            },
            'europe': {
                'sifted': {'weight': 0.8, 'delay_hours': 8},
                'tech_eu': {'weight': 0.75, 'delay_hours': 12},
                'startup_europe': {'weight': 0.7, 'delay_hours': 16}
            },
            'asia': {
                'techinasia': {'weight': 0.85, 'delay_hours': 6},
                'kr_asia': {'weight': 0.8, 'delay_hours': 8},
                'e27': {'weight': 0.75, 'delay_hours': 10}
            }
        }
        
        self.follower_patterns = {
            'time_delay': {
                'saas': 6,      # 6个月延迟
                'ai_tools': 3,  # 3个月延迟
                'marketplace': 9,  # 9个月延迟
                'fintech': 4    # 4个月延迟
            },
            'adaptation_factor': {
                'china': 1.5,   # 中国市场放大效应
                'southeast_asia': 1.2,
                'india': 1.3
            }
        }
    
    def track_global_trends(self, category: str) -> Dict[str, Any]:
        """追踪全球趋势并识别国内追随者机会"""
        
        # 获取海外趋势
        global_trends = self._fetch_global_trends(category)
        
        # 预测国内追随者时间窗口
        follower_window = self._calculate_follower_window(category, global_trends)
        
        # 识别潜在追随者项目
        potential_followers = self._identify_potential_followers(category, global_trends)
        
        # 计算ROI放大效应
        roi_multiplier = self._calculate_roi_multiplier(category, global_trends)
        
        return {
            'category': category,
            'global_trends': global_trends,
            'follower_opportunities': {
                'time_window_months': follower_window,
                'potential_projects': potential_followers,
                'roi_multiplier': roi_multiplier,
                'investment_timeline': self._generate_investment_timeline(follower_window)
            }
        }
    
    def _fetch_global_trends(self, category: str) -> List[Dict[str, Any]]:
        """获取全球趋势数据"""
        
        # 模拟全球趋势数据
        trends = []
        
        # AI视频生成趋势（美国）
        if 'ai_video' in category.lower():
            trends.append({
                'company': 'RunwayML',
                'country': 'us',
                'mrr': 500000,  # 美元
                'growth_rate': 0.35,
                'valuation': 1500000000,  # 15亿美元
                'funding_stage': 'Series C',
                'key_metrics': {
                    'customer_count': 20000,
                    'arpu': 250,
                    'churn_rate': 0.05
                },
                'trend_start': '2024-03',
                'chinese_adaptation': {
                    'market_size_multiplier': 2.5,
                    'localization_factor': 0.8,
                    'competition_intensity': 0.9
                }
            })
        
        # AI财务趋势
        elif 'ai_finance' in category.lower():
            trends.append({
                'company': 'Pilot',
                'country': 'us',
                'mrr': 800000,
                'growth_rate': 0.4,
                'valuation': 1200000000,
                'funding_stage': 'Series D',
                'key_metrics': {
                    'customer_count': 15000,
                    'arpu': 533,
                    'churn_rate': 0.03
                },
                'trend_start': '2023-12',
                'chinese_adaptation': {
                    'market_size_multiplier': 3.0,
                    'localization_factor': 0.9,
                    'competition_intensity': 0.7
                }
            })
        
        return trends
    
    def _calculate_follower_window(self, category: str, trends: List[Dict]) -> int:
        """计算追随者时间窗口"""
        
        base_delay = self.follower_patterns['time_delay'].get(category.lower(), 6)
        
        # 考虑技术复杂度调整
        complexity_factor = 1.0
        if any('ai' in trend.get('company', '').lower() for trend in trends):
            complexity_factor = 0.8  # AI项目更快
        
        # 中国速度因子
        china_speed = self.follower_patterns['adaptation_factor']['china']
        
        return int(base_delay * complexity_factor / china_speed)
    
    def _identify_potential_followers(self, category: str, trends: List[Dict]) -> List[Dict[str, Any]]:
        """识别潜在追随者项目"""
        
        followers = []
        
        for trend in trends:
            # 计算中国市场机会
            market_opportunity = {
                'expected_mrr': int(trend['mrr'] * trend['chinese_adaptation']['market_size_multiplier'] * 0.1),
                'expected_valuation': int(trend['valuation'] * trend['chinese_adaptation']['market_size_multiplier'] * 0.05),
                'timeline_months': self._calculate_follower_window(category, [trend]),
                'key_adaptations': [
                    '本土化功能',
                    '合规性调整',
                    '支付集成',
                    '内容审核'
                ]
            }
            
            followers.append(market_opportunity)
        
        return followers
    
    def _calculate_roi_multiplier(self, category: str, trends: List[Dict]) -> float:
        """计算ROI放大倍数"""
        
        base_multiplier = 1.0
        
        for trend in trends:
            # 市场规模放大
            market_size = trend['chinese_adaptation']['market_size_multiplier']
            
            # 竞争强度调整
            competition = trend['chinese_adaptation']['competition_intensity']
            
            # 本土化优势
            localization = trend['chinese_adaptation']['localization_factor']
            
            multiplier = market_size * (1 - competition * 0.3) * localization
            base_multiplier = max(base_multiplier, multiplier)
        
        return base_multiplier
    
    def _generate_investment_timeline(self, window_months: int) -> Dict[str, str]:
        """生成投资时间线"""
        
        today = datetime.datetime.now()
        
        return {
            'research_phase': f"{today.strftime('%Y-%m')} - {(today + datetime.timedelta(days=30)).strftime('%Y-%m')}",
            'early_investment': f"{(today + datetime.timedelta(days=30)).strftime('%Y-%m')} - {(today + datetime.timedelta(days=90)).strftime('%Y-%m')}",
            'growth_investment': f"{(today + datetime.timedelta(days=90)).strftime('%Y-%m')} - {(today + datetime.timedelta(days=window_months*30)).strftime('%Y-%m')}",
            'exit_preparation': f"{(today + datetime.timedelta(days=window_months*30)).strftime('%Y-%m')} onwards"
        }
    
    def generate_trend_report(self, category: str) -> str:
        """生成趋势报告"""
        
        analysis = self.track_global_trends(category)
        
        report = f"""
# 🌍 {category} 全球趋势追踪报告

## 海外标杆案例
{self._format_trend_summary(analysis['global_trends'])}

## 中国追随者机会窗口
- **时间窗口**: {analysis['follower_opportunities']['time_window_months']}个月
- **ROI放大倍数**: {analysis['follower_opportunities']['roi_multiplier']:.1f}x
- **潜在项目**: {len(analysis['follower_opportunities']['potential_projects'])}个

## 投资建议时间线
{json.dumps(analysis['follower_opportunities']['investment_timeline'], indent=2, ensure_ascii=False)}

## 关键策略
1. **早期识别**: 关注海外独角兽B轮后项目
2. **快速本土化**: 3-6个月内完成产品适配
3. **市场抢占**: 利用中国速度优势
4. **退出时机**: 海外IPO前12-18个月
"""
        
        return report
    
    def _format_trend_summary(self, trends: List[Dict]) -> str:
        """格式化趋势摘要"""
        summary = ""
        for trend in trends:
            summary += f"""
### {trend['company']} ({trend['country'].upper()})
- **当前MRR**: ${trend['mrr']:,}
- **增长率**: {trend['growth_rate']*100:.1f}%
- **估值**: ${trend['valuation']:,}
- **中国市场潜力**: ${int(trend['mrr'] * trend['chinese_adaptation']['market_size_multiplier'] * 0.1):,}
"""
        return summary

# 使用示例
if __name__ == "__main__":
    tracker = GlobalTrendTracker()
    
    # AI视频生成趋势追踪
    report = tracker.generate_trend_report("AI视频生成")
    print(report)
    
    # 获取具体机会
    opportunities = tracker.track_global_trends("AI财务")
    print(f"中国追随者机会: {opportunities['follower_opportunities']}")