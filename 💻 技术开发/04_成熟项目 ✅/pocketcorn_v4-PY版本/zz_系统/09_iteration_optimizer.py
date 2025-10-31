#!/usr/bin/env python3
"""
Pocketcorn v4 迭代优化系统
从上一版接入的数据源追踪、方法论效果评估和项目表现追踪功能
"""

import json
import sqlite3
import datetime
import hashlib
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
import os

@dataclass
class DataSource:
    """数据源记录"""
    source_id: str
    name: str
    type: str  # 'founder_interview', 'public_data', 'user_survey', 'industry_report'
    reliability_score: float  # 0-1
    last_updated: str
    validation_method: str
    confidence_level: float
    usage_count: int = 0
    accuracy_history: List[float] = None
    
    def __post_init__(self):
        if self.accuracy_history is None:
            self.accuracy_history = []

@dataclass
class MethodologyEffectiveness:
    """方法论效果记录"""
    method_name: str
    project_id: str
    predicted_score: float
    actual_outcome: float
    prediction_date: str
    outcome_date: str
    error_margin: float
    factors_correct: List[str]
    factors_incorrect: List[str]

@dataclass
class ProjectPerformance:
    """项目表现追踪"""
    project_id: str
    name: str
    initial_evaluation: Dict[str, Any]
    follow_up_data: List[Dict[str, Any]]
    investment_decision: str
    actual_performance: Dict[str, float]
    methodology_version: str
    data_sources_used: List[str]

class IterationOptimizer:
    """迭代优化系统"""
    
    def __init__(self, db_path: str = "zz_数据/iteration_system.db"):
        self.db_path = db_path
        self.init_database()
        
    def init_database(self):
        """初始化数据库"""
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # 数据源表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS data_sources (
                source_id TEXT PRIMARY KEY,
                name TEXT,
                type TEXT,
                reliability_score REAL,
                last_updated TEXT,
                validation_method TEXT,
                confidence_level REAL,
                usage_count INTEGER DEFAULT 0,
                accuracy_history TEXT
            )
        ''')
        
        # 方法论效果表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS methodology_effectiveness (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                method_name TEXT,
                project_id TEXT,
                predicted_score REAL,
                actual_outcome REAL,
                prediction_date TEXT,
                outcome_date TEXT,
                error_margin REAL,
                factors_correct TEXT,
                factors_incorrect TEXT
            )
        ''')
        
        # 项目表现表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS project_performance (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_id TEXT,
                name TEXT,
                initial_evaluation TEXT,
                follow_up_data TEXT,
                investment_decision TEXT,
                actual_performance TEXT,
                methodology_version TEXT,
                data_sources_used TEXT,
                created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def add_data_source(self, source: DataSource):
        """添加数据源"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT OR REPLACE INTO data_sources 
            (source_id, name, type, reliability_score, last_updated, validation_method, confidence_level, usage_count, accuracy_history)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            source.source_id,
            source.name,
            source.type,
            source.reliability_score,
            source.last_updated,
            source.validation_method,
            source.confidence_level,
            source.usage_count,
            json.dumps(source.accuracy_history)
        ))
        
        conn.commit()
        conn.close()
    
    def track_methodology_effectiveness(self, project_id: str, predicted_score: float, actual_outcome: float, factors: Dict[str, Any]):
        """追踪方法论效果"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        error_margin = abs(predicted_score - actual_outcome)
        factors_correct = factors.get("correct", [])
        factors_incorrect = factors.get("incorrect", [])
        
        cursor.execute('''
            INSERT INTO methodology_effectiveness 
            (method_name, project_id, predicted_score, actual_outcome, prediction_date, outcome_date, error_margin, factors_correct, factors_incorrect)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            "pocketcorn_v4",
            project_id,
            predicted_score,
            actual_outcome,
            datetime.datetime.now().isoformat(),
            datetime.datetime.now().isoformat(),
            error_margin,
            json.dumps(factors_correct),
            json.dumps(factors_incorrect)
        ))
        
        conn.commit()
        conn.close()
    
    def optimize_methodology(self) -> Dict[str, Any]:
        """优化方法论"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # 分析方法论效果
        cursor.execute('''
            SELECT AVG(error_margin), COUNT(*) 
            FROM methodology_effectiveness 
            WHERE method_name = 'pocketcorn_v4'
        ''')
        
        avg_error, total_predictions = cursor.fetchone()
        
        # 分析数据源可靠性
        cursor.execute('''
            SELECT AVG(reliability_score), COUNT(*) 
            FROM data_sources
        ''')
        
        avg_reliability, total_sources = cursor.fetchone()
        
        conn.close()
        
        return {
            "avg_prediction_error": avg_error or 0,
            "total_predictions": total_predictions or 0,
            "avg_data_reliability": avg_reliability or 0,
            "total_data_sources": total_sources or 0,
            "optimization_recommendations": self.generate_optimization_recommendations({
                "avg_error": avg_error,
                "avg_reliability": avg_reliability
            })
        }
    
    def generate_optimization_recommendations(self, factor_effectiveness: Dict[str, Any]) -> List[str]:
        """生成优化建议"""
        recommendations = []
        
        if factor_effectiveness.get("avg_error", 0) > 0.2:
            recommendations.append("预测误差较高，建议增加数据源多样性")
        
        if factor_effectiveness.get("avg_reliability", 0) < 0.7:
            recommendations.append("数据源可靠性较低，建议优先使用直接访谈数据")
        
        if not recommendations:
            recommendations.append("当前方法论表现良好，建议继续监控")
        
        return recommendations
    
    def generate_iteration_report(self) -> str:
        """生成迭代报告"""
        optimization_data = self.optimize_methodology()
        
        report = f"""
# Pocketcorn v4 迭代优化报告

## 方法论效果
- 平均预测误差: {optimization_data['avg_prediction_error']:.3f}
- 总预测次数: {optimization_data['total_predictions']}
- 数据源平均可靠性: {optimization_data['avg_data_reliability']:.3f}
- 总数据源数量: {optimization_data['total_data_sources']}

## 优化建议
"""
        
        for rec in optimization_data['optimization_recommendations']:
            report += f"- {rec}\n"
        
        return report

def main():
    """主函数"""
    optimizer = IterationOptimizer()
    
    # 示例：添加数据源
    source = DataSource(
        source_id="github_stars",
        name="GitHub Stars",
        type="public_data",
        reliability_score=0.6,
        last_updated=datetime.datetime.now().isoformat(),
        validation_method="cross_validation",
        confidence_level=0.7
    )
    optimizer.add_data_source(source)
    
    # 生成报告
    report = optimizer.generate_iteration_report()
    print(report)

if __name__ == "__main__":
    main() 