#!/usr/bin/env python3
"""
00_manus_core.py - 动态计划设计师 (增强版)
基于TrueManusSystem + MasterSystem核心功能整合
Pocketcorn v4.0 核心引擎 - 负责搜索策略设计、权重优化、规则管理
"""

import json
import datetime
import os
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from enum import Enum

class ThoughtStage(Enum):
    DISCOVERY = "discovery"
    THINKING = "thinking" 
    HYPOTHESIS = "hypothesis"
    VALIDATION = "validation"
    ANTITHESIS = "antithesis"
    CONCLUSION = "conclusion"
    DELIVERY = "delivery"

@dataclass
class SearchStrategy:
    """搜索策略数据结构"""
    data_sources: List[str]
    keywords: List[str]
    weights: Dict[str, float]
    time_window: str
    confidence: float = 0.8
    next_jump: str = "validation"

class ManusCore:
    def __init__(self):
        self.config_path = "../zz_配置/"
        self.results_path = "../01_results/"
        self.logs_path = "../04_logs/"
        
    def design_search_strategy(self, context: Dict) -> SearchStrategy:
        """基于Manus思维链设计搜索策略"""
        rules = self.load_rules()
        weights = self.get_dynamic_weights()
        
        # 1. 发现阶段 - 发散思维
        discovery_keywords = self.generate_discovery_keywords(context)
        
        # 2. 思考阶段 - 结构化优化
        thinking_keywords = self.refine_keywords(discovery_keywords, rules)
        
        # 3. 验证阶段 - 实证调整
        validated_sources = self.validate_data_sources(context)
        
        return SearchStrategy(
            data_sources=validated_sources,
            keywords=thinking_keywords,
            weights=weights,
            time_window=self.calculate_time_window(context),
            confidence=self.calculate_confidence(context),
            next_jump="validation"
        )
    
    def load_rules(self) -> Dict:
        """加载筛选规则 - 增强版"""
        try:
            with open(f"{self.config_path}01_screening_rules.json") as f:
                rules = json.load(f)
            # 添加MasterSystem的增强规则
            rules.update({
                "INVESTMENT_STAGE": ["Pre-seed", "Seed", "Pre-A"],
                "LOCATION_PRIORITY": ["北京", "上海", "深圳", "杭州", "广州"],
                "MEDIA_INFLUENCE": {"min_followers": 1000, "engagement_rate": 0.03},
                "FOUNDER_BACKGROUND": ["前腾讯", "前阿里", "前字节", "连续创业者"]
            })
            return rules
        except FileNotFoundError:
            return self.get_default_rules()
    
    def get_dynamic_weights(self) -> Dict[str, float]:
        """获取动态权重 - 基于MasterSystem优化"""
        try:
            with open(f"{self.config_path}02_weights_config.json") as f:
                weights = json.load(f)
            
            # 动态调整权重
            market_context = self.analyze_market_context()
            return self.adjust_weights_by_context(weights, market_context)
            
        except FileNotFoundError:
            return self.get_default_weights()
    
    def generate_discovery_keywords(self, context: Dict) -> List[str]:
        """发现阶段关键词生成 - 发散思维"""
        base_keywords = [
            "AI SaaS MRR 2万-25万",
            "初创团队 3-8人",
            "AI企业服务 年收入增长",
            "中国AI初创 融资前",
            "SaaS产品 月收入",
            "AI工具 订阅模式"
        ]
        
        if context.get("focus_area"):
            area_keywords = []
            for area in context["focus_area"]:
                area_keywords.extend([
                    f"{area} AI SaaS",
                    f"{area} 初创企业",
                    f"{area} MRR 增长"
                ])
            base_keywords.extend(area_keywords)
        
        return base_keywords
    
    def refine_keywords(self, keywords: List[str], rules: Dict) -> List[str]:
        """思考阶段关键词优化 - 结构化思维"""
        refined = []
        mrr_range = rules.get("MRR_RANGE", [2000, 25000])
        
        for keyword in keywords:
            # 添加MRR范围
            if "MRR" in keyword:
                refined.append(f"{keyword} {mrr_range[0]}-{mrr_range[1]}人民币")
            else:
                refined.append(keyword)
        
        # 添加地域限定
        locations = rules.get("LOCATION_PRIORITY", [])
        for location in locations[:3]:  # 取前3个城市
            refined.extend([
                f"{location} AI初创",
                f"{location} SaaS企业"
            ])
        
        return refined
    
    def validate_data_sources(self, context: Dict) -> List[str]:
        """验证数据源可靠性"""
        sources = {
            "ProductHunt": 0.9,
            "xiaohongshu": 0.8,
            "zhihu": 0.85,
            "抖音": 0.7,
            "B站": 0.75,
            "GitHub": 0.95,
            "TechCrunch": 0.9
        }
        
        # 根据上下文调整数据源权重
        if context.get("platform_focus"):
            focused_sources = context["platform_focus"]
            return [s for s in focused_sources if s in sources]
        
        # 默认返回高可信度源
        return [s for s, score in sources.items() if score >= 0.8]
    
    def calculate_time_window(self, context: Dict) -> str:
        """计算时间窗口"""
        urgency = context.get("urgency", "normal")
        windows = {
            "high": "7d",
            "normal": "30d", 
            "low": "90d"
        }
        return windows.get(urgency, "30d")
    
    def calculate_confidence(self, context: Dict) -> float:
        """计算策略置信度"""
        base_confidence = 0.8
        
        # 根据数据完整性调整
        data_completeness = context.get("data_completeness", 0.8)
        market_validation = context.get("market_validation", 0.7)
        
        return min(base_confidence * data_completeness * market_validation, 1.0)
    
    def analyze_market_context(self) -> Dict:
        """分析当前市场环境"""
        return {
            "ai_market_growth": 0.35,
            "competition_level": "high",
            "investor_sentiment": "cautious",
            "funding_climate": "selective"
        }
    
    def adjust_weights_by_context(self, base_weights: Dict, context: Dict) -> Dict:
        """根据市场环境调整权重"""
        adjusted = base_weights.copy()
        
        # 竞争激烈时增加团队权重
        if context["competition_level"] == "high":
            adjusted["TEAM"] = min(adjusted.get("TEAM", 15) + 5, 30)
            adjusted["MRR"] = max(adjusted.get("MRR", 25) - 3, 15)
        
        # 融资环境谨慎时增加MRR权重
        if context["funding_climate"] == "selective":
            adjusted["MRR"] = min(adjusted.get("MRR", 25) + 5, 35)
        
        return adjusted
    
    def get_default_rules(self) -> Dict:
        """默认规则配置"""
        return {
            "MRR_RANGE": [2000, 25000],
            "GROWTH_RATE": [0.15, 0.35],
            "TEAM_SIZE": [3, 7],
            "INVESTMENT_STAGE": ["Pre-seed", "Seed", "Pre-A"],
            "LOCATION_PRIORITY": ["北京", "上海", "深圳", "杭州", "广州"]
        }
    
    def get_default_weights(self) -> Dict[str, float]:
        """默认权重配置"""
        return {
            "MRR": 25, "GROWTH": 20, "TEAM": 15, "MEDIA": 15, 
            "TECH": 15, "LOCATION": 5, "MARKET": 5
        }
    
    def save_strategy(self, strategy: SearchStrategy):
        """保存搜索策略"""
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        strategy_file = f"{self.results_path}strategy_{timestamp}.json"
        
        strategy_dict = {
            "timestamp": datetime.datetime.now().isoformat(),
            "data_sources": strategy.data_sources,
            "keywords": strategy.keywords,
            "weights": strategy.weights,
            "time_window": strategy.time_window,
            "confidence": strategy.confidence,
            "next_jump": strategy.next_jump
        }
        
        with open(strategy_file, 'w', encoding='utf-8') as f:
            json.dump(strategy_dict, f, ensure_ascii=False, indent=2)
        
        return strategy_file
    
    def generate_roi_solution_package(self, project: Dict) -> Dict[str, Any]:
        """生成ROI导向解决方案包"""
        
        # 动态加载，避免相对导入与数字开头模块名问题
        import importlib.util, os
        base_dir = os.path.dirname(__file__)
        roi_path = os.path.join(base_dir, "05_roi_engine.py")
        trend_path = os.path.join(base_dir, "06_global_trend_tracker.py")

        roi_spec = importlib.util.spec_from_file_location("roi_engine_mod", roi_path)
        roi_mod = importlib.util.module_from_spec(roi_spec)
        roi_spec.loader.exec_module(roi_mod)
        trend_spec = importlib.util.spec_from_file_location("trend_mod", trend_path)
        trend_mod = importlib.util.module_from_spec(trend_spec)
        trend_spec.loader.exec_module(trend_mod)

        roi_engine = roi_mod.ROISolutionEngine()
        trend_tracker = trend_mod.GlobalTrendTracker()
        
        # 1. 反脆弱分析（保留并增强）
        antifragile = roi_engine._calculate_antifragile_score(project)
        
        # 2. 直接ROI验证
        roi_verification = roi_engine._calculate_direct_roi(project)
        
        # 3. 全球趋势对齐
        category = project.get('category', '')
        global_trends = trend_tracker.track_global_trends(category)
        
        # 4. 解决方案成熟度
        solution_maturity = roi_engine._assess_solution_maturity(project)
        
        # 5. 综合投资决策
        investment_rec = roi_engine._generate_roi_recommendation(
            antifragile, roi_verification, 
            roi_engine._predict_mrr_growth(project), 
            solution_maturity
        )
        
        return {
            "project_name": project.get('name'),
            "antifragile_score": antifragile,
            "roi_verification": roi_verification,
            "global_trends": global_trends,
            "solution_maturity": solution_maturity,
            "investment_recommendation": investment_rec
        }