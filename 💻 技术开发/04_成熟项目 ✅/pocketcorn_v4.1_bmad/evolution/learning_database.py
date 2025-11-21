#!/usr/bin/env python3
"""
PocketCorn Learning Database - 自我迭代学习系统
基于Darwin-Gödel Machine思想和GitHub高分迭代项目设计

记录每次思索过程、数据源、加权平均，为日后优化提供基础
实现递归自我改进，构建智能化投资决策演化系统
"""

import asyncio
import json
import sqlite3
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta
import hashlib
import logging
import statistics
from pathlib import Path
from .history_manager import HistoryManager, StrategySnapshot, WeightEvolution, ExecutionResult

logger = logging.getLogger(__name__)

@dataclass
class DecisionRecord:
    """决策记录数据结构"""
    decision_id: str
    timestamp: datetime
    decision_type: str  # "investment", "verification", "data_collection"
    input_data: Dict
    decision_process: Dict  # 思索过程记录
    output_result: Dict
    confidence_score: float
    data_sources: List[str]
    weighted_factors: Dict  # 加权因子
    performance_metrics: Optional[Dict] = None
    feedback_score: Optional[float] = None

@dataclass 
class IterationSession:
    """迭代会话记录"""
    session_id: str
    timestamp: datetime
    session_type: str
    decisions: List[str]  # decision_id列表
    overall_performance: Dict
    learned_insights: List[str]
    optimization_suggestions: List[str]
    evolution_direction: Dict

class PocketCornLearningDB:
    """PocketCorn学习数据库 - DGM启发的递归自我改进系统"""
    
    def __init__(self, db_path: str = "pocketcorn_learning.db"):
        self.db_path = db_path
        self.db_connection = None
        
        # 初始化历史记录管理器
        self.history_manager = HistoryManager("evolution/history")
        
        # DGM启发的进化配置
        self.evolution_config = {
            "mutation_rate": 0.1,           # 决策策略变异率
            "selection_pressure": 0.7,      # 选择压力
            "diversity_threshold": 0.8,     # 多样性保持阈值
            "performance_window": 100,      # 性能评估窗口
            "learning_rate": 0.05,          # 学习率
            "exploration_ratio": 0.3        # 探索vs利用比例
        }
        
        # 加权因子进化追踪
        self.weight_evolution = {
            "signal_weights": {
                "yc_batch": {"current": 0.30, "history": [], "performance": []},
                "funding_round": {"current": 0.25, "history": [], "performance": []},
                "linkedin_hiring": {"current": 0.20, "history": [], "performance": []},
                "twitter_product": {"current": 0.15, "history": [], "performance": []},
                "github_activity": {"current": 0.10, "history": [], "performance": []}
            },
            "decision_thresholds": {
                "authenticity_threshold": {"current": 0.85, "history": [], "performance": []},
                "immediate_investment": {"current": 6.0, "history": [], "performance": []},
                "recommended_investment": {"current": 8.0, "history": [], "performance": []},
                "cautious_observation": {"current": 12.0, "history": [], "performance": []}
            }
        }
        
        self._initialize_database()

    def _initialize_database(self):
        """初始化学习数据库结构"""
        
        self.db_connection = sqlite3.connect(self.db_path)
        cursor = self.db_connection.cursor()
        
        # 决策记录表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS decision_records (
                decision_id TEXT PRIMARY KEY,
                timestamp TEXT NOT NULL,
                decision_type TEXT NOT NULL,
                input_data_hash TEXT NOT NULL,
                input_data TEXT NOT NULL,
                decision_process TEXT NOT NULL,
                output_result TEXT NOT NULL,
                confidence_score REAL NOT NULL,
                data_sources TEXT NOT NULL,
                weighted_factors TEXT NOT NULL,
                performance_metrics TEXT,
                feedback_score REAL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # 迭代会话表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS iteration_sessions (
                session_id TEXT PRIMARY KEY,
                timestamp TEXT NOT NULL,
                session_type TEXT NOT NULL,
                decisions TEXT NOT NULL,
                overall_performance TEXT NOT NULL,
                learned_insights TEXT NOT NULL,
                optimization_suggestions TEXT NOT NULL,
                evolution_direction TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # 权重进化表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS weight_evolution (
                evolution_id TEXT PRIMARY KEY,
                timestamp TEXT NOT NULL,
                parameter_name TEXT NOT NULL,
                old_value REAL NOT NULL,
                new_value REAL NOT NULL,
                performance_delta REAL NOT NULL,
                mutation_type TEXT NOT NULL,
                success_rate REAL NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # 性能指标表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS performance_metrics (
                metric_id TEXT PRIMARY KEY,
                timestamp TEXT NOT NULL,
                metric_type TEXT NOT NULL,
                metric_name TEXT NOT NULL,
                value REAL NOT NULL,
                context TEXT NOT NULL,
                related_decisions TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        self.db_connection.commit()
        logger.info(f"PocketCorn学习数据库初始化完成: {self.db_path}")

    def record_decision(self, decision_type: str = "investment",
                       decision_data: Dict = None,
                       outcome: str = "completed", 
                       confidence: float = 0.8) -> str:
        """
        记录决策过程 - DGM启发的决策跟踪
        
        Args:
            decision_type: 决策类型
            decision_data: 输入决策数据  
            outcome: 决策结果
            confidence: 置信度
        """
        
        if decision_data is None:
            decision_data = {}
            
        decision_process = {
            "decision_type": decision_type,
            "confidence_score": confidence,
            "data_sources": [],
            "weighted_factors": {}
        }
        
        output_result = {
            "outcome": outcome,
            "confidence": confidence
        }
        
        # 生成决策ID
        decision_hash = hashlib.sha256(
            json.dumps(decision_data, sort_keys=True).encode()
        ).hexdigest()[:16]
        
        decision_id = f"decision_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{decision_hash}"
        
        # 提取关键信息
        confidence_score = decision_process.get("confidence_score", 0.0)
        data_sources = decision_process.get("data_sources", [])
        weighted_factors = decision_process.get("weighted_factors", {})
        decision_type = decision_process.get("decision_type", "unknown")
        
        # 创建决策记录
        decision_record = DecisionRecord(
            decision_id=decision_id,
            timestamp=datetime.now(),
            decision_type=decision_type,
            input_data=decision_data,
            decision_process=decision_process,
            output_result=output_result,
            confidence_score=confidence_score,
            data_sources=data_sources,
            weighted_factors=weighted_factors
        )
        
        # 存储到数据库
        self._store_decision_record(decision_record)
        
        # 实时学习和优化 (简化版本)
        # await self._analyze_decision_pattern(decision_record)
        
        logger.info(f"决策记录完成: {decision_id}, 类型: {decision_type}, 置信度: {confidence_score}")
        
        return decision_id

    def _store_decision_record(self, record: DecisionRecord):
        """存储决策记录到数据库"""
        
        cursor = self.db_connection.cursor()
        
        # 计算输入数据哈希
        input_hash = hashlib.sha256(
            json.dumps(record.input_data, sort_keys=True).encode()
        ).hexdigest()
        
        cursor.execute('''
            INSERT INTO decision_records 
            (decision_id, timestamp, decision_type, input_data_hash, input_data, 
             decision_process, output_result, confidence_score, data_sources, 
             weighted_factors, performance_metrics, feedback_score)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            record.decision_id,
            record.timestamp.isoformat(),
            record.decision_type,
            input_hash,
            json.dumps(record.input_data),
            json.dumps(record.decision_process),
            json.dumps(record.output_result),
            record.confidence_score,
            json.dumps(record.data_sources),
            json.dumps(record.weighted_factors),
            json.dumps(record.performance_metrics) if record.performance_metrics else None,
            record.feedback_score
        ))
        
        self.db_connection.commit()

    async def _analyze_decision_pattern(self, record: DecisionRecord):
        """分析决策模式 - DGM启发的模式识别"""
        
        # 获取相似决策的历史记录
        similar_decisions = await self._get_similar_decisions(record)
        
        if len(similar_decisions) >= 5:  # 有足够数据进行分析
            # 分析性能趋势
            performance_trend = self._analyze_performance_trend(similar_decisions)
            
            # 识别优化机会
            optimization_opportunities = self._identify_optimization_opportunities(
                record, similar_decisions, performance_trend
            )
            
            # 触发权重进化
            if optimization_opportunities:
                await self._trigger_weight_evolution(optimization_opportunities)

    async def _get_similar_decisions(self, record: DecisionRecord, 
                                   similarity_threshold: float = 0.7) -> List[DecisionRecord]:
        """获取相似决策记录"""
        
        cursor = self.db_connection.cursor()
        
        # 查询相同类型的决策
        cursor.execute('''
            SELECT * FROM decision_records 
            WHERE decision_type = ? 
            ORDER BY timestamp DESC 
            LIMIT 50
        ''', (record.decision_type,))
        
        rows = cursor.fetchall()
        similar_decisions = []
        
        for row in rows:
            # 计算输入数据相似度
            stored_input = json.loads(row[4])  # input_data
            similarity = self._calculate_input_similarity(record.input_data, stored_input)
            
            if similarity >= similarity_threshold:
                # 重构DecisionRecord对象
                decision_record = DecisionRecord(
                    decision_id=row[0],
                    timestamp=datetime.fromisoformat(row[1]),
                    decision_type=row[2],
                    input_data=json.loads(row[4]),
                    decision_process=json.loads(row[5]),
                    output_result=json.loads(row[6]),
                    confidence_score=row[7],
                    data_sources=json.loads(row[8]),
                    weighted_factors=json.loads(row[9]),
                    performance_metrics=json.loads(row[10]) if row[10] else None,
                    feedback_score=row[11]
                )
                similar_decisions.append(decision_record)
        
        return similar_decisions

    def _calculate_input_similarity(self, input1: Dict, input2: Dict) -> float:
        """计算输入数据相似度"""
        
        # 提取关键特征
        features1 = self._extract_key_features(input1)
        features2 = self._extract_key_features(input2)
        
        # 计算特征重叠度
        common_features = set(features1.keys()) & set(features2.keys())
        if not common_features:
            return 0.0
        
        similarity_scores = []
        for feature in common_features:
            val1, val2 = features1[feature], features2[feature]
            
            if isinstance(val1, (int, float)) and isinstance(val2, (int, float)):
                # 数值特征：计算相对差异
                if max(val1, val2) == 0:
                    score = 1.0
                else:
                    score = 1.0 - abs(val1 - val2) / max(abs(val1), abs(val2))
            else:
                # 分类特征：精确匹配
                score = 1.0 if val1 == val2 else 0.0
            
            similarity_scores.append(score)
        
        return statistics.mean(similarity_scores) if similarity_scores else 0.0

    def _extract_key_features(self, input_data: Dict) -> Dict:
        """提取输入数据的关键特征"""
        
        features = {}
        
        # 项目特征
        if "name" in input_data:
            features["project_name"] = input_data["name"]
        
        if "estimated_mrr" in input_data:
            # MRR分档
            mrr = input_data["estimated_mrr"]
            if mrr <= 20000:
                features["mrr_tier"] = "low"
            elif mrr <= 50000:
                features["mrr_tier"] = "medium"
            else:
                features["mrr_tier"] = "high"
        
        if "team_size" in input_data:
            # 团队规模分档
            team = input_data["team_size"]
            if team <= 5:
                features["team_tier"] = "startup"
            elif team <= 25:
                features["team_tier"] = "growing"
            else:
                features["team_tier"] = "mature"
        
        if "signals" in input_data:
            # 信号特征
            signals = input_data["signals"]
            features["signal_count"] = len(signals)
            features["has_yc"] = any("YC" in signal for signal in signals)
            features["has_funding"] = any("轮" in signal or "funding" in signal.lower() for signal in signals)
        
        return features

    def _analyze_performance_trend(self, decisions: List[DecisionRecord]) -> Dict:
        """分析性能趋势"""
        
        # 按时间排序
        decisions.sort(key=lambda x: x.timestamp)
        
        # 提取性能指标
        confidence_scores = [d.confidence_score for d in decisions]
        feedback_scores = [d.feedback_score for d in decisions if d.feedback_score is not None]
        
        trend_analysis = {
            "confidence_trend": self._calculate_trend(confidence_scores),
            "feedback_trend": self._calculate_trend(feedback_scores) if feedback_scores else None,
            "recent_performance": statistics.mean(confidence_scores[-10:]) if len(confidence_scores) >= 10 else None,
            "historical_performance": statistics.mean(confidence_scores[:-10]) if len(confidence_scores) >= 10 else None,
            "volatility": statistics.stdev(confidence_scores) if len(confidence_scores) > 1 else 0,
            "improvement_rate": self._calculate_improvement_rate(confidence_scores)
        }
        
        return trend_analysis

    def _calculate_trend(self, values: List[float]) -> float:
        """计算趋势方向 (正数=上升趋势，负数=下降趋势)"""
        
        if len(values) < 2:
            return 0.0
        
        # 简单线性回归
        n = len(values)
        x_mean = (n - 1) / 2  # 时间序列平均
        y_mean = statistics.mean(values)
        
        numerator = sum((i - x_mean) * (y - y_mean) for i, y in enumerate(values))
        denominator = sum((i - x_mean) ** 2 for i in range(n))
        
        return numerator / denominator if denominator != 0 else 0.0

    def _calculate_improvement_rate(self, values: List[float]) -> float:
        """计算改进速率"""
        
        if len(values) < 5:
            return 0.0
        
        # 比较前半部分和后半部分的平均值
        mid_point = len(values) // 2
        early_avg = statistics.mean(values[:mid_point])
        recent_avg = statistics.mean(values[mid_point:])
        
        if early_avg == 0:
            return 0.0
        
        return (recent_avg - early_avg) / early_avg

    def _identify_optimization_opportunities(self, current_record: DecisionRecord,
                                           similar_decisions: List[DecisionRecord],
                                           performance_trend: Dict) -> List[Dict]:
        """识别优化机会 - DGM启发的自我改进机会识别"""
        
        opportunities = []
        
        # 1. 权重优化机会
        if performance_trend["confidence_trend"] < -0.01:  # 下降趋势
            # 分析表现最好的决策的权重配置
            best_decisions = sorted(similar_decisions, 
                                  key=lambda x: x.confidence_score, reverse=True)[:5]
            
            best_weights = self._analyze_optimal_weights(best_decisions)
            current_weights = current_record.weighted_factors
            
            for param, optimal_value in best_weights.items():
                if param in current_weights:
                    current_value = current_weights[param]
                    if abs(optimal_value - current_value) > 0.05:  # 显著差异
                        opportunities.append({
                            "type": "weight_optimization",
                            "parameter": param,
                            "current_value": current_value,
                            "suggested_value": optimal_value,
                            "confidence": 0.8,
                            "reason": f"历史最优决策使用权重 {optimal_value:.3f}"
                        })
        
        # 2. 阈值优化机会
        if performance_trend["volatility"] > 0.15:  # 波动性过高
            opportunities.append({
                "type": "threshold_optimization",
                "parameter": "decision_stability",
                "current_value": performance_trend["volatility"],
                "suggested_action": "stabilize_decision_thresholds",
                "confidence": 0.7,
                "reason": "决策波动性过高，建议稳定决策阈值"
            })
        
        # 3. 数据源优化机会
        data_source_performance = self._analyze_data_source_performance(similar_decisions)
        for source, perf in data_source_performance.items():
            if perf["success_rate"] < 0.6:  # 成功率低的数据源
                opportunities.append({
                    "type": "data_source_optimization",
                    "parameter": source,
                    "current_value": perf["success_rate"],
                    "suggested_action": "reduce_weight_or_improve_processing",
                    "confidence": 0.6,
                    "reason": f"数据源 {source} 成功率仅 {perf['success_rate']:.2f}"
                })
        
        return opportunities

    def _analyze_optimal_weights(self, decisions: List[DecisionRecord]) -> Dict:
        """分析最优权重配置"""
        
        weight_combinations = {}
        
        for decision in decisions:
            weights = decision.weighted_factors
            performance = decision.confidence_score
            
            for param, weight in weights.items():
                if param not in weight_combinations:
                    weight_combinations[param] = []
                weight_combinations[param].append((weight, performance))
        
        optimal_weights = {}
        for param, weight_perf_pairs in weight_combinations.items():
            # 找到性能最高的权重
            best_pair = max(weight_perf_pairs, key=lambda x: x[1])
            optimal_weights[param] = best_pair[0]
        
        return optimal_weights

    def _analyze_data_source_performance(self, decisions: List[DecisionRecord]) -> Dict:
        """分析数据源性能"""
        
        source_stats = {}
        
        for decision in decisions:
            sources = decision.data_sources
            performance = decision.confidence_score
            
            for source in sources:
                if source not in source_stats:
                    source_stats[source] = {"scores": [], "count": 0}
                
                source_stats[source]["scores"].append(performance)
                source_stats[source]["count"] += 1
        
        source_performance = {}
        for source, stats in source_stats.items():
            avg_score = statistics.mean(stats["scores"])
            source_performance[source] = {
                "success_rate": avg_score,
                "usage_count": stats["count"],
                "reliability": 1 - statistics.stdev(stats["scores"]) if len(stats["scores"]) > 1 else 1.0
            }
        
        return source_performance

    async def _trigger_weight_evolution(self, opportunities: List[Dict]):
        """触发权重进化 - DGM启发的参数演化"""
        
        for opp in opportunities:
            if opp["type"] == "weight_optimization" and opp["confidence"] > 0.7:
                param = opp["parameter"]
                current_value = opp["current_value"]
                suggested_value = opp["suggested_value"]
                
                # 计算变异方向和幅度
                mutation_direction = 1 if suggested_value > current_value else -1
                mutation_magnitude = abs(suggested_value - current_value)
                
                # 应用变异
                new_value = current_value + mutation_direction * mutation_magnitude * self.evolution_config["mutation_rate"]
                
                # 记录进化到数据库
                await self._record_weight_evolution(
                    param, current_value, new_value, 
                    0.0,  # performance_delta待计算
                    "optimization_mutation",
                    opp["confidence"]
                )
                
                # 记录进化到历史文件
                await self._record_weight_evolution_to_history(
                    param, current_value, new_value, 0.0,
                    "optimization_mutation", opp["confidence"]
                )
                
                # 更新权重
                self._update_weight(param, new_value)
                
                logger.info(f"权重进化: {param} {current_value:.3f} -> {new_value:.3f}")

    async def _record_weight_evolution(self, parameter_name: str, old_value: float,
                                     new_value: float, performance_delta: float,
                                     mutation_type: str, success_rate: float):
        """记录权重进化过程"""
        
        cursor = self.db_connection.cursor()
        
        evolution_id = f"evolution_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{parameter_name}"
        
        cursor.execute('''
            INSERT INTO weight_evolution 
            (evolution_id, timestamp, parameter_name, old_value, new_value,
             performance_delta, mutation_type, success_rate)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            evolution_id,
            datetime.now().isoformat(),
            parameter_name,
            old_value,
            new_value,
            performance_delta,
            mutation_type,
            success_rate
        ))
        
        self.db_connection.commit()

    def _update_weight(self, parameter: str, new_value: float):
        """更新权重配置"""
        
        # 更新信号权重
        for signal_name in self.weight_evolution["signal_weights"]:
            if parameter.endswith(signal_name):
                old_value = self.weight_evolution["signal_weights"][signal_name]["current"]
                self.weight_evolution["signal_weights"][signal_name]["current"] = new_value
                self.weight_evolution["signal_weights"][signal_name]["history"].append({
                    "timestamp": datetime.now().isoformat(),
                    "old_value": old_value,
                    "new_value": new_value
                })
                break
        
        # 更新决策阈值
        for threshold_name in self.weight_evolution["decision_thresholds"]:
            if parameter.endswith(threshold_name):
                old_value = self.weight_evolution["decision_thresholds"][threshold_name]["current"]
                self.weight_evolution["decision_thresholds"][threshold_name]["current"] = new_value
                self.weight_evolution["decision_thresholds"][threshold_name]["history"].append({
                    "timestamp": datetime.now().isoformat(),
                    "old_value": old_value,
                    "new_value": new_value
                })
                break

    async def record_iteration_session(self, session_type: str, decisions: List[str],
                                     performance_data: Dict) -> str:
        """记录迭代会话 - DGM启发的会话级学习"""
        
        session_id = f"session_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # 分析会话性能
        overall_performance = await self._analyze_session_performance(decisions, performance_data)
        
        # 生成学习洞察
        learned_insights = await self._generate_learned_insights(decisions, overall_performance)
        
        # 生成优化建议
        optimization_suggestions = await self._generate_optimization_suggestions(overall_performance)
        
        # 确定进化方向
        evolution_direction = await self._determine_evolution_direction(
            learned_insights, optimization_suggestions
        )
        
        # 创建会话记录
        iteration_session = IterationSession(
            session_id=session_id,
            timestamp=datetime.now(),
            session_type=session_type,
            decisions=decisions,
            overall_performance=overall_performance,
            learned_insights=learned_insights,
            optimization_suggestions=optimization_suggestions,
            evolution_direction=evolution_direction
        )
        
        # 存储会话记录
        await self._store_iteration_session(iteration_session)
        
        logger.info(f"迭代会话记录完成: {session_id}, 类型: {session_type}, 决策数: {len(decisions)}")
        
        return session_id

    async def _analyze_session_performance(self, decisions: List[str], 
                                         performance_data: Dict) -> Dict:
        """分析会话级性能"""
        
        # 获取决策记录
        cursor = self.db_connection.cursor()
        
        decision_records = []
        for decision_id in decisions:
            cursor.execute('''
                SELECT confidence_score, feedback_score FROM decision_records 
                WHERE decision_id = ?
            ''', (decision_id,))
            result = cursor.fetchone()
            if result:
                decision_records.append({
                    "confidence": result[0],
                    "feedback": result[1]
                })
        
        if not decision_records:
            return {"error": "没有找到决策记录"}
        
        # 计算会话级指标
        confidences = [r["confidence"] for r in decision_records]
        feedbacks = [r["feedback"] for r in decision_records if r["feedback"] is not None]
        
        session_performance = {
            "decision_count": len(decision_records),
            "average_confidence": statistics.mean(confidences),
            "confidence_std": statistics.stdev(confidences) if len(confidences) > 1 else 0,
            "max_confidence": max(confidences),
            "min_confidence": min(confidences),
            "feedback_available": len(feedbacks),
            "average_feedback": statistics.mean(feedbacks) if feedbacks else None,
            "external_performance": performance_data,
            "session_success_rate": len([c for c in confidences if c >= 0.8]) / len(confidences)
        }
        
        return session_performance

    async def _generate_learned_insights(self, decisions: List[str], 
                                       performance: Dict) -> List[str]:
        """生成学习洞察"""
        
        insights = []
        
        # 性能洞察
        if performance["average_confidence"] >= 0.85:
            insights.append("高置信度决策策略已经成熟，应该保持当前参数配置")
        elif performance["average_confidence"] < 0.7:
            insights.append("决策置信度偏低，需要优化权重配置或改进验证策略")
        
        # 稳定性洞察
        if performance["confidence_std"] > 0.15:
            insights.append("决策稳定性不足，建议标准化决策流程")
        else:
            insights.append("决策稳定性良好，可以考虑提高探索力度")
        
        # 成功率洞察
        success_rate = performance["session_success_rate"]
        if success_rate >= 0.8:
            insights.append("当前策略成功率高，可以增加投资决策的激进度")
        elif success_rate < 0.6:
            insights.append("成功率偏低，应该采取更保守的投资策略")
        
        # 反馈洞察
        if performance["feedback_available"] > 0 and performance["average_feedback"]:
            if performance["average_feedback"] >= 0.8:
                insights.append("用户反馈积极，当前决策质量得到认可")
            else:
                insights.append("用户反馈一般，需要关注决策实用性")
        
        return insights

    async def _generate_optimization_suggestions(self, performance: Dict) -> List[str]:
        """生成优化建议"""
        
        suggestions = []
        
        # 基于性能指标的建议
        avg_conf = performance["average_confidence"]
        
        if avg_conf < 0.75:
            suggestions.append("建议增加数据源权重，提高验证覆盖面")
            suggestions.append("考虑降低决策阈值，减少过度严格的筛选")
        
        if performance["confidence_std"] > 0.12:
            suggestions.append("建议标准化加权算法，减少决策波动性")
            suggestions.append("优化异常值处理机制，提高决策稳定性")
        
        # 基于成功率的建议
        if performance["session_success_rate"] < 0.7:
            suggestions.append("建议重新校准投资回收期阈值")
            suggestions.append("考虑引入新的验证信号源")
        
        # 基于反馈的建议
        if performance.get("average_feedback") and performance["average_feedback"] < 0.7:
            suggestions.append("建议改进决策解释性，提供更多决策依据")
            suggestions.append("考虑增加用户自定义参数选项")
        
        return suggestions

    async def _determine_evolution_direction(self, insights: List[str], 
                                           suggestions: List[str]) -> Dict:
        """确定进化方向 - DGM启发的自适应进化"""
        
        evolution_direction = {
            "primary_focus": "stability",  # 主要关注点
            "secondary_focus": "performance",  # 次要关注点
            "mutation_targets": [],  # 变异目标
            "conservation_targets": [],  # 保守目标
            "exploration_areas": []  # 探索领域
        }
        
        # 分析洞察以确定进化重点
        insight_text = " ".join(insights)
        suggestion_text = " ".join(suggestions)
        
        # 确定主要关注点
        if "稳定性" in insight_text or "波动" in suggestion_text:
            evolution_direction["primary_focus"] = "stability"
        elif "成功率" in insight_text or "激进" in suggestion_text:
            evolution_direction["primary_focus"] = "performance"
        elif "置信度" in insight_text:
            evolution_direction["primary_focus"] = "confidence"
        
        # 确定变异目标
        if "权重配置" in suggestion_text:
            evolution_direction["mutation_targets"].append("signal_weights")
        if "阈值" in suggestion_text:
            evolution_direction["mutation_targets"].append("decision_thresholds")
        if "数据源" in suggestion_text:
            evolution_direction["mutation_targets"].append("data_sources")
        
        # 确定保守目标
        if "保持当前" in insight_text:
            evolution_direction["conservation_targets"].append("current_parameters")
        if "已经成熟" in insight_text:
            evolution_direction["conservation_targets"].append("mature_strategies")
        
        # 确定探索领域
        if "新的" in suggestion_text or "引入" in suggestion_text:
            evolution_direction["exploration_areas"].append("new_data_sources")
            evolution_direction["exploration_areas"].append("alternative_algorithms")
        
        return evolution_direction

    async def _store_iteration_session(self, session: IterationSession):
        """存储迭代会话记录"""
        
        cursor = self.db_connection.cursor()
        
        cursor.execute('''
            INSERT INTO iteration_sessions 
            (session_id, timestamp, session_type, decisions, overall_performance,
             learned_insights, optimization_suggestions, evolution_direction)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            session.session_id,
            session.timestamp.isoformat(),
            session.session_type,
            json.dumps(session.decisions),
            json.dumps(session.overall_performance),
            json.dumps(session.learned_insights),
            json.dumps(session.optimization_suggestions),
            json.dumps(session.evolution_direction)
        ))
        
        self.db_connection.commit()

    async def get_evolution_insights(self, time_window_days: int = 30) -> Dict:
        """获取进化洞察报告"""
        
        cursor = self.db_connection.cursor()
        
        # 查询时间窗口内的数据
        since_date = datetime.now() - timedelta(days=time_window_days)
        
        # 决策趋势分析
        cursor.execute('''
            SELECT decision_type, confidence_score, timestamp 
            FROM decision_records 
            WHERE timestamp > ? 
            ORDER BY timestamp
        ''', (since_date.isoformat(),))
        
        decision_data = cursor.fetchall()
        
        # 权重进化分析
        cursor.execute('''
            SELECT parameter_name, old_value, new_value, performance_delta, timestamp
            FROM weight_evolution 
            WHERE timestamp > ?
            ORDER BY timestamp
        ''', (since_date.isoformat(),))
        
        evolution_data = cursor.fetchall()
        
        # 会话性能分析
        cursor.execute('''
            SELECT session_type, overall_performance, learned_insights, timestamp
            FROM iteration_sessions 
            WHERE timestamp > ?
            ORDER BY timestamp
        ''', (since_date.isoformat(),))
        
        session_data = cursor.fetchall()
        
        # 生成洞察报告
        insights_report = {
            "analysis_period": f"{time_window_days} 天",
            "total_decisions": len(decision_data),
            "evolution_events": len(evolution_data),
            "learning_sessions": len(session_data),
            "performance_trends": self._analyze_decision_trends(decision_data),
            "parameter_evolution": self._analyze_parameter_evolution(evolution_data),
            "learning_effectiveness": self._analyze_learning_effectiveness(session_data),
            "recommendations": self._generate_system_recommendations(decision_data, evolution_data, session_data)
        }
        
        return insights_report

    def _analyze_decision_trends(self, decision_data: List[Tuple]) -> Dict:
        """分析决策趋势"""
        
        if not decision_data:
            return {"error": "无决策数据"}
        
        # 按决策类型分组
        by_type = {}
        for decision_type, confidence, timestamp in decision_data:
            if decision_type not in by_type:
                by_type[decision_type] = []
            by_type[decision_type].append(confidence)
        
        trends = {}
        for dec_type, confidences in by_type.items():
            trends[dec_type] = {
                "count": len(confidences),
                "average_confidence": statistics.mean(confidences),
                "confidence_trend": self._calculate_trend(confidences),
                "stability": 1 - statistics.stdev(confidences) if len(confidences) > 1 else 1.0
            }
        
        return trends

    def _analyze_parameter_evolution(self, evolution_data: List[Tuple]) -> Dict:
        """分析参数进化"""
        
        if not evolution_data:
            return {"no_evolution": True}
        
        evolution_summary = {}
        for param_name, old_val, new_val, perf_delta, timestamp in evolution_data:
            if param_name not in evolution_summary:
                evolution_summary[param_name] = {
                    "evolution_count": 0,
                    "total_change": 0,
                    "performance_impact": 0
                }
            
            evolution_summary[param_name]["evolution_count"] += 1
            evolution_summary[param_name]["total_change"] += abs(new_val - old_val)
            evolution_summary[param_name]["performance_impact"] += perf_delta
        
        return evolution_summary

    def _analyze_learning_effectiveness(self, session_data: List[Tuple]) -> Dict:
        """分析学习有效性"""
        
        if not session_data:
            return {"no_learning_data": True}
        
        learning_metrics = {
            "total_sessions": len(session_data),
            "insights_generated": 0,
            "suggestions_generated": 0,
            "avg_performance_improvement": 0
        }
        
        for session_type, performance_json, insights_json, timestamp in session_data:
            performance = json.loads(performance_json)
            insights = json.loads(insights_json)
            
            learning_metrics["insights_generated"] += len(insights)
            
            # 计算性能改进
            if "average_confidence" in performance:
                learning_metrics["avg_performance_improvement"] += performance["average_confidence"]
        
        if learning_metrics["total_sessions"] > 0:
            learning_metrics["avg_performance_improvement"] /= learning_metrics["total_sessions"]
        
        return learning_metrics

    def _generate_system_recommendations(self, decision_data, evolution_data, session_data) -> List[str]:
        """生成系统级建议"""
        
        recommendations = []
        
        # 基于决策数据的建议
        if decision_data:
            avg_confidence = statistics.mean([conf for _, conf, _ in decision_data])
            if avg_confidence < 0.75:
                recommendations.append("系统整体决策置信度偏低，建议全面优化参数配置")
            elif avg_confidence > 0.9:
                recommendations.append("决策质量很高，可以考虑增加决策复杂度和投资激进度")
        
        # 基于进化数据的建议
        if len(evolution_data) < 5:
            recommendations.append("参数进化频率较低，建议增加自适应学习机制")
        elif len(evolution_data) > 20:
            recommendations.append("参数变化过于频繁，建议增加决策稳定性")
        
        # 基于学习数据的建议
        if len(session_data) > 0:
            recommendations.append("学习机制运行正常，建议持续监控学习效果")
        else:
            recommendations.append("缺少学习会话数据，建议启动定期学习评估")
        
        return recommendations

    async def _record_weight_evolution_to_history(self, parameter_name: str, old_value: float,
                                                 new_value: float, performance_delta: float,
                                                 mutation_type: str, confidence: float):
        """将权重进化记录到历史文件"""
        try:
            weight_evolution = WeightEvolution(
                timestamp=datetime.now(),
                weight_type=self._determine_weight_type(parameter_name),
                previous_weights={parameter_name: old_value},
                new_weights={parameter_name: new_value},
                trigger_event=mutation_type,
                performance_delta=performance_delta,
                confidence=confidence
            )
            
            await self.history_manager.record_weight_evolution(weight_evolution)
            logger.info(f"权重进化历史记录完成: {parameter_name}")
            
        except Exception as e:
            logger.error(f"记录权重进化历史失败: {e}")
    
    def _determine_weight_type(self, parameter_name: str) -> str:
        """确定权重类型"""
        if any(signal in parameter_name for signal in ['yc_batch', 'funding_round', 'linkedin_hiring', 'twitter_product', 'github_activity']):
            return "signal_weights"
        elif any(threshold in parameter_name for threshold in ['authenticity_threshold', 'investment', 'observation']):
            return "decision_thresholds"
        else:
            return "other_weights"
    
    async def record_strategy_execution(self, strategy_name: str, region: str, stage: str,
                                      sources: List[str], weights: Dict[str, float],
                                      execution_result: Dict) -> str:
        """记录策略执行结果到历史"""
        try:
            # 记录策略快照
            strategy_snapshot = StrategySnapshot(
                timestamp=datetime.now(),
                strategy_name=strategy_name,
                region=region,
                stage=stage,
                sources=sources,
                weights=weights,
                performance_score=execution_result.get('performance_score', 0.0),
                success_rate=execution_result.get('success_rate', 0.0),
                context=execution_result.get('context', {})
            )
            
            strategy_path = await self.history_manager.record_strategy_snapshot(strategy_snapshot)
            
            # 记录执行结果
            result = ExecutionResult(
                timestamp=datetime.now(),
                workflow_id=execution_result.get('workflow_id', 'unknown'),
                strategy_used=strategy_name,
                region=region,
                stage=stage,
                input_params=execution_result.get('input_params', {}),
                discovered_projects=execution_result.get('discovered_projects', 0),
                verified_projects=execution_result.get('verified_projects', 0),
                execution_time=execution_result.get('execution_time', 0.0),
                success_rate=execution_result.get('success_rate', 0.0),
                feedback_score=execution_result.get('feedback_score'),
                insights=execution_result.get('insights', [])
            )
            
            result_path = await self.history_manager.record_execution_result(result)
            
            logger.info(f"策略执行历史记录完成: {strategy_name} -> {strategy_path}")
            return strategy_path
            
        except Exception as e:
            logger.error(f"记录策略执行历史失败: {e}")
            return ""
    
    async def get_historical_insights(self, days: int = 7) -> Dict[str, Any]:
        """获取历史洞察，结合数据库和文件历史"""
        try:
            # 获取数据库洞察
            db_insights = await self.get_evolution_insights(days)
            
            # 获取文件历史洞察
            evolution_report = await self.history_manager.generate_evolution_report(days)
            
            # 合并洞察
            combined_insights = {
                "database_insights": db_insights,
                "file_history_insights": evolution_report,
                "combined_recommendations": self._merge_recommendations(
                    db_insights.get('recommendations', []),
                    evolution_report.get('recommendations', [])
                )
            }
            
            return combined_insights
            
        except Exception as e:
            logger.error(f"获取历史洞察失败: {e}")
            return {"error": str(e)}
    
    def _merge_recommendations(self, db_recs: List[str], file_recs: List[str]) -> List[str]:
        """合并来自不同数据源的建议"""
        merged = []
        
        # 添加数据库建议
        for rec in db_recs:
            merged.append(f"[数据库分析] {rec}")
            
        # 添加文件历史建议
        for rec in file_recs:
            merged.append(f"[历史追踪] {rec}")
            
        # 去重相似建议
        unique_merged = []
        for rec in merged:
            is_duplicate = False
            for existing in unique_merged:
                if self._calculate_text_similarity(rec, existing) > 0.7:
                    is_duplicate = True
                    break
            if not is_duplicate:
                unique_merged.append(rec)
                
        return unique_merged
    
    def _calculate_text_similarity(self, text1: str, text2: str) -> float:
        """计算文本相似度"""
        words1 = set(text1.lower().split())
        words2 = set(text2.lower().split())
        
        if not words1 and not words2:
            return 1.0
        if not words1 or not words2:
            return 0.0
            
        intersection = len(words1 & words2)
        union = len(words1 | words2)
        
        return intersection / union if union > 0 else 0.0

    def get_current_weights(self) -> Dict:
        """获取当前权重配置"""
        return {
            "signal_weights": {k: v["current"] for k, v in self.weight_evolution["signal_weights"].items()},
            "decision_thresholds": {k: v["current"] for k, v in self.weight_evolution["decision_thresholds"].items()}
        }

    def close(self):
        """关闭数据库连接"""
        if self.db_connection:
            self.db_connection.close()

# 测试函数
async def test_learning_database():
    """测试学习数据库"""
    
    print("=== PocketCorn学习数据库测试 ===")
    
    db = PocketCornLearningDB("test_learning.db")
    
    try:
        # 模拟决策记录
        decision_data = {
            "name": "Test AI Company",
            "estimated_mrr": 50000,
            "team_size": 8,
            "signals": ["YC W25", "Series A $5M", "LinkedIn招聘"]
        }
        
        decision_process = {
            "decision_type": "investment",
            "confidence_score": 0.85,
            "data_sources": ["yc", "crunchbase", "linkedin"],
            "weighted_factors": {
                "yc_batch": 0.30,
                "funding_round": 0.25,
                "linkedin_hiring": 0.20
            }
        }
        
        output_result = {
            "investment_recommendation": "推荐投资",
            "recovery_months": 6.2,
            "annual_roi": 78.5
        }
        
        # 记录决策
        decision_id = await db.record_decision(decision_data, decision_process, output_result)
        print(f"决策记录完成: {decision_id}")
        
        # 记录迭代会话
        session_id = await db.record_iteration_session(
            "investment_analysis",
            [decision_id],
            {"session_success": True, "user_satisfaction": 0.9}
        )
        print(f"迭代会话记录: {session_id}")
        
        # 获取进化洞察
        insights = await db.get_evolution_insights(7)
        print(f"进化洞察: {json.dumps(insights, indent=2, ensure_ascii=False)}")
        
        # 显示当前权重
        current_weights = db.get_current_weights()
        print(f"当前权重配置: {json.dumps(current_weights, indent=2, ensure_ascii=False)}")
        
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(test_learning_database())