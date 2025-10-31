#!/usr/bin/env python3
"""
PocketCorn Strategy Evolution Engine
基于GitHub高分项目的策略进化模式设计

参考项目:
- python-adaptive/adaptive: 智能采样策略自适应选择
- OpenAI Evolution Strategies: 多策略参数进化
- codelion/adaptive-classifier: 持续学习和策略适应
"""

import asyncio
import json
from typing import Dict, List, Optional, Any, Type
from dataclasses import dataclass
from datetime import datetime
import statistics
import logging

logger = logging.getLogger(__name__)

@dataclass
class DataCollectionStrategy:
    """数据采集策略基类"""
    name: str
    description: str
    target_regions: List[str]
    target_project_stages: List[str]  # ["seed", "series_a", "series_b", "growth"]
    data_sources: List[str]
    success_rate: float = 0.0
    last_performance_update: Optional[datetime] = None
    
    def get_strategy_config(self) -> Dict:
        """获取策略具体配置"""
        raise NotImplementedError

@dataclass 
class RegionalStrategy(DataCollectionStrategy):
    """地区特化策略"""
    
    def get_strategy_config(self) -> Dict:
        config_map = {
            # 中国大陆策略
            "china": {
                "primary_sources": ["xiaohongshu", "zhihu", "weibo", "36kr"],
                "hiring_platforms": ["lagou", "boss", "liepin"], 
                "funding_sources": ["itjuzi", "pedaily"],
                "keywords_cn": ["招聘", "试用期", "实习生", "融资", "天使轮"],
                "signal_weights": {
                    "xiaohongshu_hiring": 0.35,  # 小红书招聘权重最高
                    "zhihu_discussion": 0.25,
                    "36kr_news": 0.20,
                    "weibo_trending": 0.20
                }
            },
            # 美国策略  
            "us": {
                "primary_sources": ["linkedin", "twitter", "ycombinator", "crunchbase"],
                "hiring_platforms": ["linkedin", "glassdoor", "indeed"],
                "funding_sources": ["crunchbase", "pitchbook", "angellist"],
                "keywords_en": ["hiring", "internship", "series a", "seed funding"],
                "signal_weights": {
                    "linkedin_hiring": 0.40,
                    "twitter_product": 0.30, 
                    "yc_batch": 0.20,
                    "crunchbase_funding": 0.10
                }
            },
            # 欧洲策略
            "europe": {
                "primary_sources": ["linkedin", "techcrunch", "sifted"],
                "hiring_platforms": ["linkedin", "xing", "stepstone"],
                "funding_sources": ["dealroom", "techcrunch"],
                "keywords_multi": ["hiring", "embauche", "einstellung"],
                "signal_weights": {
                    "linkedin_hiring": 0.45,
                    "techcrunch_coverage": 0.25,
                    "sifted_analysis": 0.30
                }
            }
        }
        
        region_key = self.target_regions[0].lower() if self.target_regions else "us"
        return config_map.get(region_key, config_map["us"])

@dataclass
class StageStrategy(DataCollectionStrategy):
    """项目阶段特化策略"""
    
    def get_strategy_config(self) -> Dict:
        stage_configs = {
            # 种子期策略
            "seed": {
                "focus_signals": ["founder_hiring", "mvp_launch", "early_users"],
                "data_emphasis": {
                    "team_expansion": 0.40,    # 重点关注团队扩张
                    "product_traction": 0.35,  # 产品牵引力
                    "founder_activity": 0.25   # 创始人活跃度
                },
                "discovery_keywords": ["stealth", "beta", "mvp", "pre-seed"]
            },
            
            # A轮策略
            "series_a": {
                "focus_signals": ["revenue_signals", "customer_growth", "team_scaling"],
                "data_emphasis": {
                    "revenue_indicators": 0.45,  # 收入指标最重要
                    "market_traction": 0.30,
                    "competitive_advantage": 0.25
                },
                "discovery_keywords": ["series a", "growth", "revenue", "customers"]
            },
            
            # 成长期策略  
            "growth": {
                "focus_signals": ["expansion", "partnerships", "market_leadership"],
                "data_emphasis": {
                    "market_position": 0.40,
                    "strategic_partnerships": 0.35, 
                    "expansion_signals": 0.25
                },
                "discovery_keywords": ["expansion", "enterprise", "partnerships", "ipo"]
            }
        }
        
        stage = self.target_project_stages[0] if self.target_project_stages else "seed"
        return stage_configs.get(stage, stage_configs["seed"])

class StrategyEvolutionEngine:
    """策略进化引擎 - 基于GitHub高分项目模式"""
    
    def __init__(self):
        # 初始化策略池
        self.strategy_pool = self._initialize_strategy_pool()
        
        # 策略性能追踪
        self.strategy_performance = {}
        
        # 策略选择配置 (基于python-adaptive模式)
        self.selection_config = {
            "exploration_rate": 0.3,      # 30%时间探索新策略
            "exploitation_rate": 0.7,     # 70%时间利用最佳策略
            "performance_window": 50,     # 性能评估窗口
            "adaptation_threshold": 0.1,  # 策略切换阈值
        }
        
        # 当前最佳策略
        self.current_best_strategy = None
        
    def _initialize_strategy_pool(self) -> Dict[str, DataCollectionStrategy]:
        """初始化策略池"""
        strategies = {}
        
        # 地区策略
        regions = ["china", "us", "europe", "southeast_asia"]
        for region in regions:
            strategies[f"regional_{region}"] = RegionalStrategy(
                name=f"regional_{region}",
                description=f"{region.upper()}地区特化数据采集策略",
                target_regions=[region],
                target_project_stages=["seed", "series_a", "growth"],
                data_sources=self._get_region_sources(region)
            )
        
        # 阶段策略
        stages = ["seed", "series_a", "series_b", "growth"]
        for stage in stages:
            strategies[f"stage_{stage}"] = StageStrategy(
                name=f"stage_{stage}",
                description=f"{stage}阶段特化数据采集策略", 
                target_regions=["global"],
                target_project_stages=[stage],
                data_sources=self._get_stage_sources(stage)
            )
        
        return strategies
    
    def _get_region_sources(self, region: str) -> List[str]:
        """获取地区数据源"""
        source_map = {
            "china": ["xiaohongshu", "zhihu", "weibo", "36kr", "lagou"],
            "us": ["linkedin", "twitter", "ycombinator", "crunchbase", "glassdoor"],
            "europe": ["linkedin", "techcrunch", "sifted", "dealroom"],
            "southeast_asia": ["linkedin", "techinasia", "dealstreetasia"]
        }
        return source_map.get(region, ["linkedin", "twitter"])
    
    def _get_stage_sources(self, stage: str) -> List[str]:
        """获取阶段数据源"""
        stage_sources = {
            "seed": ["twitter", "linkedin", "angellist", "founder_networks"],
            "series_a": ["crunchbase", "linkedin", "techcrunch", "pitchbook"], 
            "series_b": ["crunchbase", "bloomberg", "reuters", "pitchbook"],
            "growth": ["public_filings", "news_apis", "analyst_reports"]
        }
        return stage_sources.get(stage, ["linkedin", "crunchbase"])
    
    async def select_optimal_strategy(self, 
                                    target_region: str = None,
                                    target_stage: str = None,
                                    context: Dict = None) -> DataCollectionStrategy:
        """智能选择最优策略 - 基于adaptive库模式"""
        
        # 1. 筛选候选策略
        candidate_strategies = self._filter_candidate_strategies(target_region, target_stage)
        
        # 2. 基于历史性能评分
        strategy_scores = {}
        for strategy_name, strategy in candidate_strategies.items():
            score = await self._calculate_strategy_score(strategy, context)
            strategy_scores[strategy_name] = score
        
        # 3. 探索vs利用决策 (基于Evolution Strategies模式)
        if self._should_explore():
            # 探索模式：选择较少使用的策略
            selected_strategy = self._select_exploration_strategy(candidate_strategies)
        else:
            # 利用模式：选择历史表现最佳策略
            best_strategy_name = max(strategy_scores, key=strategy_scores.get)
            selected_strategy = candidate_strategies[best_strategy_name]
        
        logger.info(f"选择策略: {selected_strategy.name} (分数: {strategy_scores.get(selected_strategy.name, 0.0):.3f})")
        return selected_strategy
    
    def _filter_candidate_strategies(self, 
                                   target_region: str = None, 
                                   target_stage: str = None) -> Dict[str, DataCollectionStrategy]:
        """筛选候选策略"""
        candidates = {}
        
        for name, strategy in self.strategy_pool.items():
            # 地区匹配
            if target_region:
                if not (target_region in strategy.target_regions or "global" in strategy.target_regions):
                    continue
            
            # 阶段匹配  
            if target_stage:
                if not (target_stage in strategy.target_project_stages or "all" in strategy.target_project_stages):
                    continue
                    
            candidates[name] = strategy
        
        return candidates
    
    async def _calculate_strategy_score(self, 
                                      strategy: DataCollectionStrategy, 
                                      context: Dict = None) -> float:
        """计算策略得分"""
        
        base_score = strategy.success_rate
        
        # 上下文适配性加分
        context_bonus = 0.0
        if context:
            # 地区匹配度
            if "target_region" in context:
                if context["target_region"] in strategy.target_regions:
                    context_bonus += 0.1
            
            # 项目阶段匹配度
            if "project_stage" in context:
                if context["project_stage"] in strategy.target_project_stages:
                    context_bonus += 0.1
            
            # 数据源可用性
            if "available_sources" in context:
                available = set(context["available_sources"])
                strategy_sources = set(strategy.data_sources)
                overlap_ratio = len(available & strategy_sources) / len(strategy_sources)
                context_bonus += overlap_ratio * 0.2
        
        # 时效性惩罚
        time_penalty = 0.0
        if strategy.last_performance_update:
            days_old = (datetime.now() - strategy.last_performance_update).days
            time_penalty = min(days_old * 0.01, 0.1)  # 最多扣10%
        
        final_score = base_score + context_bonus - time_penalty
        return max(0.0, min(1.0, final_score))  # 限制在[0,1]区间
    
    def _should_explore(self) -> bool:
        """探索vs利用决策"""
        import random
        return random.random() < self.selection_config["exploration_rate"]
    
    def _select_exploration_strategy(self, candidates: Dict[str, DataCollectionStrategy]) -> DataCollectionStrategy:
        """探索模式策略选择"""
        # 选择使用次数最少的策略
        usage_counts = {}
        for name, strategy in candidates.items():
            usage_counts[name] = self.strategy_performance.get(name, {}).get("usage_count", 0)
        
        least_used_name = min(usage_counts, key=usage_counts.get)
        return candidates[least_used_name]
    
    async def update_strategy_performance(self, 
                                        strategy_name: str,
                                        performance_metrics: Dict):
        """更新策略性能 - 基于反馈学习"""
        
        if strategy_name not in self.strategy_performance:
            self.strategy_performance[strategy_name] = {
                "usage_count": 0,
                "success_history": [],
                "average_performance": 0.0,
                "last_update": None
            }
        
        perf_data = self.strategy_performance[strategy_name]
        
        # 更新使用次数
        perf_data["usage_count"] += 1
        
        # 更新成功历史
        success_score = performance_metrics.get("success_rate", 0.0)
        perf_data["success_history"].append(success_score)
        
        # 保持历史窗口大小
        window_size = self.selection_config["performance_window"]
        if len(perf_data["success_history"]) > window_size:
            perf_data["success_history"] = perf_data["success_history"][-window_size:]
        
        # 计算平均性能
        perf_data["average_performance"] = statistics.mean(perf_data["success_history"])
        perf_data["last_update"] = datetime.now()
        
        # 更新策略本身的成功率
        if strategy_name in self.strategy_pool:
            self.strategy_pool[strategy_name].success_rate = perf_data["average_performance"]
            self.strategy_pool[strategy_name].last_performance_update = datetime.now()
        
        logger.info(f"策略性能更新: {strategy_name} -> 成功率: {perf_data['average_performance']:.3f}")
        
        # 触发策略进化检查
        await self._check_strategy_evolution()
    
    async def _check_strategy_evolution(self):
        """检查是否需要策略进化"""
        
        # 获取表现最佳的策略
        best_performers = sorted(
            self.strategy_performance.items(),
            key=lambda x: x[1]["average_performance"],
            reverse=True
        )
        
        if len(best_performers) >= 2:
            best_name, best_perf = best_performers[0]
            second_name, second_perf = best_performers[1]
            
            # 如果性能差异显著，触发策略进化
            performance_gap = best_perf["average_performance"] - second_perf["average_performance"]
            
            if performance_gap > self.selection_config["adaptation_threshold"]:
                await self._evolve_strategies(best_name, best_perf)
    
    async def _evolve_strategies(self, best_strategy_name: str, best_performance: Dict):
        """策略进化 - 基于最佳策略生成新策略"""
        
        best_strategy = self.strategy_pool[best_strategy_name]
        
        # 生成新的变异策略
        new_strategy = await self._create_mutated_strategy(best_strategy)
        
        if new_strategy:
            # 添加到策略池
            self.strategy_pool[new_strategy.name] = new_strategy
            logger.info(f"策略进化: 基于 {best_strategy_name} 生成新策略 {new_strategy.name}")
    
    async def _create_mutated_strategy(self, base_strategy: DataCollectionStrategy) -> Optional[DataCollectionStrategy]:
        """创建变异策略"""
        
        # 基于基础策略的配置进行变异
        base_config = base_strategy.get_strategy_config()
        
        # 创建变异版本 (示例: 调整权重分布)
        if "signal_weights" in base_config:
            mutated_weights = {}
            for signal, weight in base_config["signal_weights"].items():
                # 应用小幅变异 (+/- 10%)
                mutation = weight * 0.1 * (0.5 - __import__("random").random())  # -5% to +5%
                mutated_weights[signal] = max(0.05, min(0.95, weight + mutation))
            
            # 归一化权重
            total_weight = sum(mutated_weights.values())
            mutated_weights = {k: v/total_weight for k, v in mutated_weights.items()}
            
            # 创建新策略实例
            mutation_id = datetime.now().strftime("%m%d_%H%M")
            new_strategy = RegionalStrategy(
                name=f"{base_strategy.name}_evolved_{mutation_id}",
                description=f"基于{base_strategy.name}的进化策略",
                target_regions=base_strategy.target_regions,
                target_project_stages=base_strategy.target_project_stages,
                data_sources=base_strategy.data_sources
            )
            
            return new_strategy
        
        return None
    
    def get_strategy_performance_report(self) -> Dict:
        """获取策略性能报告"""
        
        report = {
            "total_strategies": len(self.strategy_pool),
            "active_strategies": len([s for s in self.strategy_pool.values() if s.success_rate > 0]),
            "strategy_rankings": [],
            "performance_summary": {}
        }
        
        # 策略排名
        if self.strategy_performance:
            rankings = sorted(
                self.strategy_performance.items(),
                key=lambda x: x[1]["average_performance"],
                reverse=True
            )
            
            for i, (name, perf) in enumerate(rankings[:10]):  # 前10名
                report["strategy_rankings"].append({
                    "rank": i + 1,
                    "strategy_name": name,
                    "success_rate": perf["average_performance"],
                    "usage_count": perf["usage_count"],
                    "last_update": perf["last_update"].isoformat() if perf["last_update"] else None
                })
        
        # 性能摘要
        if self.strategy_performance:
            all_performances = [p["average_performance"] for p in self.strategy_performance.values()]
            report["performance_summary"] = {
                "average_success_rate": statistics.mean(all_performances),
                "best_success_rate": max(all_performances),
                "worst_success_rate": min(all_performances),
                "performance_std": statistics.stdev(all_performances) if len(all_performances) > 1 else 0
            }
        
        return report

# 测试函数
async def test_strategy_evolution():
    """测试策略进化引擎"""
    
    print("=== PocketCorn策略进化引擎测试 ===")
    
    engine = StrategyEvolutionEngine()
    
    # 测试策略选择
    print("\n1. 测试中国地区种子期项目策略选择:")
    strategy = await engine.select_optimal_strategy(
        target_region="china", 
        target_stage="seed",
        context={
            "target_region": "china",
            "project_stage": "seed", 
            "available_sources": ["xiaohongshu", "zhihu", "weibo"]
        }
    )
    print(f"选择策略: {strategy.name}")
    print(f"策略描述: {strategy.description}")
    print(f"目标地区: {strategy.target_regions}")
    print(f"数据源: {strategy.data_sources}")
    
    # 模拟性能更新
    print("\n2. 模拟策略性能更新:")
    await engine.update_strategy_performance(strategy.name, {
        "success_rate": 0.85,
        "projects_found": 12,
        "verification_rate": 0.90
    })
    
    # 测试美国地区A轮项目策略
    print("\n3. 测试美国地区A轮项目策略选择:")
    us_strategy = await engine.select_optimal_strategy(
        target_region="us",
        target_stage="series_a"
    )
    print(f"选择策略: {us_strategy.name}")
    config = us_strategy.get_strategy_config()
    print(f"策略配置: {json.dumps(config, indent=2, ensure_ascii=False)}")
    
    # 生成性能报告
    print("\n4. 策略性能报告:")
    report = engine.get_strategy_performance_report()
    print(json.dumps(report, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    asyncio.run(test_strategy_evolution())