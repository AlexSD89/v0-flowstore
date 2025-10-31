#!/usr/bin/env python3
"""
PocketCorn 历史记录管理器
专门记录策略进化、权重变化和决策结果的历史数据
基于GitHub高分项目的版本管理和追踪模式设计
"""

import asyncio
import json
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from datetime import datetime
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

@dataclass
class StrategySnapshot:
    """策略快照"""
    timestamp: datetime
    strategy_name: str
    region: str
    stage: str
    sources: List[str]
    weights: Dict[str, float]
    performance_score: float
    success_rate: float
    context: Dict[str, Any]

@dataclass
class WeightEvolution:
    """权重进化记录"""
    timestamp: datetime
    weight_type: str  # "signal_weights", "source_weights", "regional_weights"
    previous_weights: Dict[str, float]
    new_weights: Dict[str, float]
    trigger_event: str  # "performance_feedback", "mutation", "exploration"
    performance_delta: float
    confidence: float

@dataclass
class ExecutionResult:
    """执行结果记录"""
    timestamp: datetime
    workflow_id: str
    strategy_used: str
    region: str
    stage: str
    input_params: Dict
    discovered_projects: int
    verified_projects: int
    execution_time: float
    success_rate: float
    feedback_score: Optional[float]
    insights: List[str]

class HistoryManager:
    """历史记录管理器"""
    
    def __init__(self, history_base_path: str = "evolution/history"):
        self.history_path = Path(history_base_path)
        self.strategies_path = self.history_path / "strategies"
        self.weights_path = self.history_path / "weights" 
        self.results_path = self.history_path / "results"
        
        # 确保目录存在
        for path in [self.strategies_path, self.weights_path, self.results_path]:
            path.mkdir(parents=True, exist_ok=True)
            
        logger.info(f"历史记录管理器初始化完成: {history_base_path}")

    async def record_strategy_snapshot(self, snapshot: StrategySnapshot) -> str:
        """记录策略快照"""
        try:
            timestamp_str = snapshot.timestamp.strftime("%Y%m%d_%H%M%S")
            filename = f"strategy_{snapshot.strategy_name}_{snapshot.region}_{timestamp_str}.json"
            filepath = self.strategies_path / filename
            
            # 转换为可序列化格式
            snapshot_dict = asdict(snapshot)
            snapshot_dict['timestamp'] = snapshot.timestamp.isoformat()
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(snapshot_dict, f, ensure_ascii=False, indent=2)
                
            logger.info(f"策略快照已保存: {filename}")
            return str(filepath)
            
        except Exception as e:
            logger.error(f"保存策略快照失败: {e}")
            raise

    async def record_weight_evolution(self, evolution: WeightEvolution) -> str:
        """记录权重进化"""
        try:
            timestamp_str = evolution.timestamp.strftime("%Y%m%d_%H%M%S")
            filename = f"weights_{evolution.weight_type}_{timestamp_str}.json"
            filepath = self.weights_path / filename
            
            # 转换为可序列化格式
            evolution_dict = asdict(evolution)
            evolution_dict['timestamp'] = evolution.timestamp.isoformat()
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(evolution_dict, f, ensure_ascii=False, indent=2)
                
            logger.info(f"权重进化记录已保存: {filename}")
            return str(filepath)
            
        except Exception as e:
            logger.error(f"保存权重进化记录失败: {e}")
            raise

    async def record_execution_result(self, result: ExecutionResult) -> str:
        """记录执行结果"""
        try:
            timestamp_str = result.timestamp.strftime("%Y%m%d_%H%M%S")
            filename = f"result_{result.workflow_id}_{timestamp_str}.json"
            filepath = self.results_path / filename
            
            # 转换为可序列化格式
            result_dict = asdict(result)
            result_dict['timestamp'] = result.timestamp.isoformat()
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(result_dict, f, ensure_ascii=False, indent=2)
                
            logger.info(f"执行结果记录已保存: {filename}")
            return str(filepath)
            
        except Exception as e:
            logger.error(f"保存执行结果失败: {e}")
            raise

    async def get_strategy_history(self, strategy_name: str = None, 
                                 region: str = None, 
                                 days: int = 30) -> List[StrategySnapshot]:
        """获取策略历史"""
        try:
            cutoff_date = datetime.now() - timedelta(days=days)
            snapshots = []
            
            for filepath in self.strategies_path.glob("strategy_*.json"):
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        
                    # 转换时间戳
                    data['timestamp'] = datetime.fromisoformat(data['timestamp'])
                    
                    # 过滤条件
                    if data['timestamp'] < cutoff_date:
                        continue
                        
                    if strategy_name and data['strategy_name'] != strategy_name:
                        continue
                        
                    if region and data['region'] != region:
                        continue
                        
                    snapshots.append(StrategySnapshot(**data))
                    
                except Exception as e:
                    logger.warning(f"读取策略文件失败 {filepath}: {e}")
                    continue
                    
            # 按时间排序
            snapshots.sort(key=lambda x: x.timestamp, reverse=True)
            logger.info(f"获取策略历史记录: {len(snapshots)}条")
            return snapshots
            
        except Exception as e:
            logger.error(f"获取策略历史失败: {e}")
            return []

    async def get_weight_evolution_history(self, weight_type: str = None, 
                                         days: int = 30) -> List[WeightEvolution]:
        """获取权重进化历史"""
        try:
            cutoff_date = datetime.now() - timedelta(days=days)
            evolutions = []
            
            for filepath in self.weights_path.glob("weights_*.json"):
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        
                    # 转换时间戳
                    data['timestamp'] = datetime.fromisoformat(data['timestamp'])
                    
                    # 过滤条件
                    if data['timestamp'] < cutoff_date:
                        continue
                        
                    if weight_type and data['weight_type'] != weight_type:
                        continue
                        
                    evolutions.append(WeightEvolution(**data))
                    
                except Exception as e:
                    logger.warning(f"读取权重文件失败 {filepath}: {e}")
                    continue
                    
            # 按时间排序
            evolutions.sort(key=lambda x: x.timestamp, reverse=True)
            logger.info(f"获取权重进化历史: {len(evolutions)}条")
            return evolutions
            
        except Exception as e:
            logger.error(f"获取权重进化历史失败: {e}")
            return []

    async def get_execution_results_history(self, region: str = None,
                                          strategy: str = None, 
                                          days: int = 30) -> List[ExecutionResult]:
        """获取执行结果历史"""
        try:
            cutoff_date = datetime.now() - timedelta(days=days)
            results = []
            
            for filepath in self.results_path.glob("result_*.json"):
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        
                    # 转换时间戳
                    data['timestamp'] = datetime.fromisoformat(data['timestamp'])
                    
                    # 过滤条件
                    if data['timestamp'] < cutoff_date:
                        continue
                        
                    if region and data['region'] != region:
                        continue
                        
                    if strategy and data['strategy_used'] != strategy:
                        continue
                        
                    results.append(ExecutionResult(**data))
                    
                except Exception as e:
                    logger.warning(f"读取结果文件失败 {filepath}: {e}")
                    continue
                    
            # 按时间排序
            results.sort(key=lambda x: x.timestamp, reverse=True)
            logger.info(f"获取执行结果历史: {len(results)}条")
            return results
            
        except Exception as e:
            logger.error(f"获取执行结果历史失败: {e}")
            return []

    async def generate_evolution_report(self, days: int = 7) -> Dict[str, Any]:
        """生成进化报告"""
        try:
            # 获取各类历史数据
            strategies = await self.get_strategy_history(days=days)
            weights = await self.get_weight_evolution_history(days=days)
            results = await self.get_execution_results_history(days=days)
            
            report = {
                "report_period_days": days,
                "generated_at": datetime.now().isoformat(),
                "summary": {
                    "total_strategy_changes": len(strategies),
                    "total_weight_evolutions": len(weights),
                    "total_executions": len(results)
                },
                "strategy_analysis": self._analyze_strategies(strategies),
                "weight_analysis": self._analyze_weights(weights),
                "performance_analysis": self._analyze_results(results),
                "recommendations": self._generate_recommendations(strategies, weights, results)
            }
            
            # 保存报告
            timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S")
            report_filename = f"evolution_report_{timestamp_str}.json"
            report_path = self.history_path / report_filename
            
            with open(report_path, 'w', encoding='utf-8') as f:
                json.dump(report, f, ensure_ascii=False, indent=2)
                
            logger.info(f"进化报告已生成: {report_filename}")
            return report
            
        except Exception as e:
            logger.error(f"生成进化报告失败: {e}")
            return {"error": str(e)}

    def _analyze_strategies(self, strategies: List[StrategySnapshot]) -> Dict[str, Any]:
        """分析策略数据"""
        if not strategies:
            return {"message": "无策略数据"}
            
        # 统计各地区策略使用情况
        region_usage = {}
        stage_usage = {}
        avg_performance = 0
        
        for strategy in strategies:
            region_usage[strategy.region] = region_usage.get(strategy.region, 0) + 1
            stage_usage[strategy.stage] = stage_usage.get(strategy.stage, 0) + 1
            avg_performance += strategy.performance_score
            
        avg_performance /= len(strategies)
        
        return {
            "total_strategies": len(strategies),
            "region_distribution": region_usage,
            "stage_distribution": stage_usage,
            "average_performance": round(avg_performance, 3),
            "best_performing_strategy": max(strategies, key=lambda x: x.performance_score).strategy_name
        }

    def _analyze_weights(self, weights: List[WeightEvolution]) -> Dict[str, Any]:
        """分析权重数据"""
        if not weights:
            return {"message": "无权重数据"}
            
        # 统计权重变化类型
        trigger_stats = {}
        avg_delta = 0
        
        for weight in weights:
            trigger_stats[weight.trigger_event] = trigger_stats.get(weight.trigger_event, 0) + 1
            avg_delta += abs(weight.performance_delta)
            
        avg_delta /= len(weights)
        
        return {
            "total_weight_changes": len(weights),
            "trigger_distribution": trigger_stats,
            "average_performance_delta": round(avg_delta, 3),
            "most_active_weight_type": max(weights, key=lambda x: x.confidence).weight_type
        }

    def _analyze_results(self, results: List[ExecutionResult]) -> Dict[str, Any]:
        """分析执行结果"""
        if not results:
            return {"message": "无执行结果数据"}
            
        total_discovered = sum(r.discovered_projects for r in results)
        total_verified = sum(r.verified_projects for r in results)
        avg_success_rate = sum(r.success_rate for r in results) / len(results)
        avg_execution_time = sum(r.execution_time for r in results) / len(results)
        
        return {
            "total_executions": len(results),
            "total_projects_discovered": total_discovered,
            "total_projects_verified": total_verified,
            "verification_rate": round(total_verified / total_discovered * 100, 2) if total_discovered > 0 else 0,
            "average_success_rate": round(avg_success_rate * 100, 2),
            "average_execution_time": round(avg_execution_time, 2)
        }

    def _generate_recommendations(self, strategies: List[StrategySnapshot], 
                                weights: List[WeightEvolution], 
                                results: List[ExecutionResult]) -> List[str]:
        """生成优化建议"""
        recommendations = []
        
        # 基于策略表现的建议
        if strategies:
            best_strategy = max(strategies, key=lambda x: x.performance_score)
            worst_strategy = min(strategies, key=lambda x: x.performance_score)
            
            if best_strategy.performance_score > worst_strategy.performance_score * 1.2:
                recommendations.append(f"建议更多使用 {best_strategy.strategy_name} 策略，在 {best_strategy.region} 地区表现优异")
        
        # 基于权重变化的建议
        if weights:
            recent_weights = sorted(weights, key=lambda x: x.timestamp, reverse=True)[:5]
            positive_deltas = [w for w in recent_weights if w.performance_delta > 0]
            
            if len(positive_deltas) > len(recent_weights) * 0.6:
                recommendations.append("权重进化趋势良好，建议继续当前的自适应策略")
            else:
                recommendations.append("权重进化效果有限，建议增强探索机制")
        
        # 基于执行结果的建议  
        if results:
            recent_results = sorted(results, key=lambda x: x.timestamp, reverse=True)[:10]
            avg_verification = sum(r.verified_projects for r in recent_results) / len(recent_results)
            
            if avg_verification < 2:
                recommendations.append("项目验证通过率较低，建议优化筛选策略")
            elif avg_verification > 5:
                recommendations.append("项目发现效果良好，可以考虑提高筛选标准")
        
        if not recommendations:
            recommendations.append("数据积累中，暂无具体优化建议")
            
        return recommendations

# 为了与现有系统集成，添加便捷的导入
from datetime import timedelta