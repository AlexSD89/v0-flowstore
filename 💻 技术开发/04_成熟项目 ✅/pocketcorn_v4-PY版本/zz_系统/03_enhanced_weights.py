#!/usr/bin/env python3
"""
03_enhanced_weights.py - 动态权重引擎
基于市场环境、数据质量、时效性的智能权重系统
"""

import json
import datetime
from typing import Dict, List, Any
import math

class DynamicWeightEngine:
    def __init__(self):
        self.config_path = "../02_config/"
        self.market_data_cache = {}
        self.global_sources = {
            'us': ['techcrunch', 'pitchbook', 'crunchbase', 'producthunt', 'hacker_news'],
            'europe': ['sifted', 'tech_eu', 'startup_europe'],
            'asia': ['techinasia', 'kr_asia', 'e27'],
            'china': ['36kr', 'itjuzi', 'tianyancha', 'xiaohongshu', 'douyin']
        }
        
    def calculate_dynamic_weights(self, context: Dict) -> Dict[str, float]:
        """基于多维因子计算动态权重"""
        
        # 1. 市场环境因子
        market_factor = self._get_market_environment_factor()
        
        # 2. 数据质量因子
        data_quality_factor = self._get_data_quality_factor(context)
        
        # 3. 时效性因子
        recency_factor = self._get_recency_factor(context)
        
        # 4. 竞争强度因子
        competition_factor = self._get_competition_factor(context)
        
        # 5. 基础权重
        base_weights = self._load_base_weights()
        
        # 动态调整公式
        adjusted_weights = {}
        for key, weight in base_weights.items():
            adjustment = (
                market_factor * 0.3 +
                data_quality_factor * 0.25 +
                recency_factor * 0.2 +
                competition_factor * 0.15 +
                0.1  # 基础置信度
            )
            adjusted_weights[key] = max(5, min(40, weight * adjustment))
        
        return self._normalize_weights(adjusted_weights)
    
    def _get_market_environment_factor(self) -> float:
        """市场环境因子 - 全球趋势版本"""
        # 全球趋势分析
        global_trends = self._analyze_global_trends()
        
        market_indicators = {
            'us_trend_strength': self._get_us_trend_impact(),
            'europe_trend_strength': self._get_europe_trend_impact(),
            'asia_trend_strength': self._get_asia_trend_impact(),
            'china_follower_score': self._calculate_china_follower_score(),
            'trend_migration_speed': self._get_trend_migration_speed(),
            'market_saturation': self._calculate_market_saturation(),
            'investor_sentiment': self._get_global_investor_sentiment(),
            'black_swan_risk': self._calculate_black_swan_factor(),
            'competitive_pressure': self._get_competitive_pressure(),
            'cross_border_opportunity': self._calculate_cross_border_opportunity()
        }
        
        # 全球事件矩阵
        global_events = self._get_global_market_events()
        
        # 趋势迁移事件权重
        trend_weights = {
            'us_trend': 0.4,      # 美国趋势权重
            'europe_trend': 0.25,  # 欧洲趋势权重
            'asia_trend': 0.2,    # 亚洲趋势权重
            'china_follow': 0.15  # 中国追随权重
        }
        
        # 实时事件响应
        event_impact = 1.0
        for event in global_events:
            if event['region'] == 'us' and event['type'] == 'unicorn_ipo':
                event_impact *= 1.25  # 美国独角兽IPO提升全球估值
            elif event['region'] == 'china' and event['type'] == 'policy_support':
                event_impact *= 1.3   # 中国政策支持加速追随
            elif event['type'] == 'tech_breakthrough':
                event_impact *= 1.5   # 技术突破红利
            elif event['type'] == 'market_crash':
                event_impact *= 0.6   # 市场崩盘风险
                
        # 加权平均全球趋势
        weighted_score = sum(
            market_indicators[key] * trend_weights.get(key.split('_')[0] + '_trend', 0.25)
            for key in market_indicators.keys()
        )
        
        return weighted_score * event_impact
    
    def _get_data_quality_factor(self, context: Dict) -> float:
        """数据质量因子 - 增强社交媒体权重"""
        quality_indicators = {
            'source_credibility': context.get('source_score', 0.8),
            'data_completeness': context.get('completeness', 0.9),
            'cross_validation': context.get('validation_score', 0.85),
            'update_frequency': context.get('freshness', 0.8),
            'social_media_sentiment': self._get_social_sentiment_score(),  # 新增
            'ugc_quality_score': self._get_ugc_quality_score(),  # 新增
            'negative_sentiment_ratio': self._get_negative_sentiment_ratio()  # 新增
        }
        
        # 社交媒体权重提升到30%
        social_weight = 0.3
        base_weight = 0.7
        
        base_score = sum([
            quality_indicators['source_credibility'],
            quality_indicators['data_completeness'],
            quality_indicators['cross_validation'],
            quality_indicators['update_frequency']
        ]) / 4
        
        social_score = sum([
            quality_indicators['social_media_sentiment'],
            quality_indicators['ugc_quality_score'],
            1 - quality_indicators['negative_sentiment_ratio']
        ]) / 3
        
        return base_score * base_weight + social_score * social_weight
    
    def _get_recency_factor(self, context: Dict) -> float:
        """时效性因子"""
        days_old = context.get('days_since_update', 0)
        return max(0.5, 1.0 - (days_old / 365))  # 一年内衰减
    
    def _get_competition_factor(self, context: Dict) -> float:
        """竞争强度因子"""
        competition_level = context.get('competition_level', 'medium')
        mapping = {'low': 1.2, 'medium': 1.0, 'high': 0.8}
        return mapping.get(competition_level, 1.0)
    
    def _load_base_weights(self) -> Dict[str, float]:
        """加载基础权重"""
        try:
            with open(f"{self.config_path}02_weights_config.json") as f:
                return json.load(f)
        except FileNotFoundError:
            return {
                "MRR": 25,
                "GROWTH": 20,
                "TEAM": 15,
                "MEDIA": 15,
                "TECH": 15,
                "LOCATION": 5,
                "MARKET": 5
            }
    
    def _normalize_weights(self, weights: Dict[str, float]) -> Dict[str, float]:
        """权重归一化"""
        total = sum(weights.values())
        return {k: round(v / total * 100, 1) for k, v in weights.items()}

    def learn_from_history(self, history_db_path: str = "../zz_数据/history.db") -> Dict[str, float]:
        """基于历史观测，微调基础权重（简单启发式）"""
        import sqlite3
        import os
        base = self._load_base_weights()
        if not os.path.exists(history_db_path):
            return base
        try:
            conn = sqlite3.connect(history_db_path)
            cur = conn.cursor()
            # 使用观测覆盖度与均值作为信号：
            cur.execute("SELECT COUNT(*), AVG(mrr) FROM observations")
            row = cur.fetchone() or (0, 0)
            total_obs, avg_mrr = row[0] or 0, row[1] or 0
            conn.close()
            adjusted = base.copy()
            # 若历史观测丰富，提高MRR和GROWTH权重
            if total_obs > 100:
                adjusted["MRR"] = min(adjusted.get("MRR", 25) + 3, 40)
                adjusted["GROWTH"] = min(adjusted.get("GROWTH", 20) + 2, 35)
            # 若平均MRR较低，提升TEAM与MEDIA关注
            if avg_mrr < 20000:
                adjusted["TEAM"] = min(adjusted.get("TEAM", 15) + 2, 30)
                adjusted["MEDIA"] = min(adjusted.get("MEDIA", 15) + 2, 30)
            return self._normalize_weights(adjusted)
        except Exception:
            return self._normalize_weights(base)

class InformationSourceProcessor:
    def __init__(self):
        self.source_weights = {
            # 官方数据源
            'official_website': 0.95,
            'tianyancha_api': 0.98,  # 新增企业征信
            'qichacha_api': 0.97,    # 新增企业征信
            'crunchbase': 0.90,
            'itjuzi_api': 0.92,      # 新增IT桔子
            
            # 技术数据源
            'github': 0.80,
            'producthunt': 0.85,
            'gongzhonghao': 0.88,    # 新增公众号
            
            # 社交媒体（权重提升）
            'xiaohongshu': 0.80,     # 从0.7提升到0.8
            'douyin': 0.75,          # 从0.6提升到0.75
            'zhihu': 0.72,           # 从0.65提升到0.72
            
            # 专业网络
            'linkedin': 0.75,
            'wechat': 0.85
        }
        
        # MCP服务器集成配置
        self.mcp_integrations = {
            'tianyancha': {
                'endpoint': 'https://api.tianyancha.com',
                'real_time': True,
                'cache_ttl': 300  # 5分钟缓存
            },
            'itjuzi': {
                'endpoint': 'https://api.itjuzi.com',
                'real_time': True,
                'cache_ttl': 600  # 10分钟缓存
            }
        }
        
    def process_source_data(self, raw_data: List[Dict]) -> Dict[str, Any]:
        """处理多源数据并计算置信度"""
        
        processed = {
            'consolidated_data': {},
            'confidence_scores': {},
            'data_conflicts': [],
            'weighted_values': {}
        }
        
        # 按字段聚合数据
        field_data = {}
        for source_data in raw_data:
            source = source_data.get('source')
            weight = self.source_weights.get(source, 0.5)
            
            for field, value in source_data.get('data', {}).items():
                if field not in field_data:
                    field_data[field] = []
                field_data[field].append({
                    'value': value,
                    'weight': weight,
                    'source': source,
                    'timestamp': source_data.get('timestamp')
                })
        
        # 计算加权值和置信度
        for field, values in field_data.items():
            if len(values) == 1:
                processed['weighted_values'][field] = values[0]['value']
                processed['confidence_scores'][field] = values[0]['weight']
            else:
                # 数值型数据加权平均
                if all(isinstance(v['value'], (int, float)) for v in values):
                    total_weight = sum(v['weight'] for v in values)
                    weighted_sum = sum(v['value'] * v['weight'] for v in values)
                    processed['weighted_values'][field] = weighted_sum / total_weight
                    
                    # 计算置信度（基于一致性）
                    values_list = [v['value'] for v in values]
                    mean = sum(values_list) / len(values_list)
                    variance = sum((v - mean) ** 2 for v in values_list) / len(values_list)
                    consistency = 1.0 / (1.0 + math.sqrt(variance))
                    processed['confidence_scores'][field] = consistency
        
        return processed