#!/usr/bin/env python3
"""
11_uncertainty_validator.py - 不确定性验证器 (v4)
- 计算数据源置信度与一致性分数
- 生成置信区间与建议
- 将验证结果持久化到 zz_数据/uncertainty_validation.db
"""

import json
import sqlite3
import math
from datetime import datetime
from typing import Dict, List, Any, Optional
import os

class UncertaintyValidatorV4:
    def __init__(self, db_path: str = "zz_数据/uncertainty_validation.db"):
        self.db_path = db_path
        self._init_database()
    
    def _init_database(self):
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS project_evaluations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_name TEXT,
                evaluation_date TEXT,
                mrr_estimate INTEGER,
                mrr_low INTEGER,
                mrr_high INTEGER,
                mrr_confidence REAL,
                growth_estimate REAL,
                growth_confidence REAL,
                team_quality_score REAL,
                data_sources TEXT,
                overall_score REAL,
                recommendation TEXT,
                notes TEXT
            )
            """
        )
        conn.commit()
        conn.close()
    
    def calculate_uncertainty(self, data_sources: List[Dict[str, Any]]) -> Dict[str, float]:
        if not data_sources:
            return {"confidence": 0.1, "consistency_score": 0.0, "source_quality": 0.0}
        
        source_weights = {
            "founder_direct": 0.9,
            "paid_user_interview": 0.8,
            "industry_report": 0.7,
            "competitor_analysis": 0.6,
            "public_info": 0.4,
            "estimation": 0.3
        }
        
        mrr_values = [ds.get("mrr", 0) for ds in data_sources if ds.get("mrr") is not None]
        if len(mrr_values) >= 2:
            avg_mrr = sum(mrr_values) / len(mrr_values)
            variance = sum((v - avg_mrr) ** 2 for v in mrr_values) / len(mrr_values)
            consistency_score = max(0.0, 1 - (math.sqrt(variance) / avg_mrr)) if avg_mrr else 0.0
        else:
            consistency_score = 0.5
        
        weighted_sources = sum(source_weights.get(ds.get("type", "estimation"), 0.3) for ds in data_sources)
        avg_source_quality = weighted_sources / max(1, len(data_sources))
        
        confidence = min(1.0, (avg_source_quality * 0.5 + consistency_score * 0.5))
        return {
            "confidence": confidence,
            "consistency_score": consistency_score,
            "source_quality": avg_source_quality,
        }
    
    def build_confidence_interval(self, estimate: float, confidence: float, spread_ratio: float = 0.35) -> Dict[str, int]:
        # 简化版置信区间：区间宽度随置信度缩放
        spread = max(0.1, spread_ratio * (1.0 - confidence))
        low = int(estimate * (1 - spread))
        high = int(estimate * (1 + spread))
        return {"low": low, "high": high}
    
    def validate_project(self, project: Dict[str, Any]) -> Dict[str, Any]:
        data_sources = project.get("data_sources", [])
        mrr_estimate = project.get("mrr", 0)
        growth_estimate = project.get("growth_rate", 0.2)
        team_quality = project.get("team_quality", 0.7)
        
        metrics = self.calculate_uncertainty(data_sources)
        interval = self.build_confidence_interval(mrr_estimate, metrics["confidence"]) 
        
        # 简单总体评分
        overall_score = (
            metrics["confidence"] * 0.5 + 
            min(1.0, growth_estimate * 2) * 0.3 + 
            min(1.0, team_quality) * 0.2
        )
        
        recommendation = (
            "立即尽调" if overall_score >= 0.75 else 
            "重点关注" if overall_score >= 0.6 else 
            "持续跟踪"
        )
        
        result = {
            "project_name": project.get("name", "unknown"),
            "mrr_estimate": mrr_estimate,
            "growth_estimate": growth_estimate,
            "team_quality_score": team_quality,
            "confidence": metrics["confidence"],
            "consistency_score": metrics["consistency_score"],
            "source_quality": metrics["source_quality"],
            "mrr_low": interval["low"],
            "mrr_high": interval["high"],
            "overall_score": overall_score,
            "recommendation": recommendation
        }
        
        self._persist_evaluation(result, data_sources)
        return result
    
    def _persist_evaluation(self, result: Dict[str, Any], data_sources: List[Dict[str, Any]]):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO project_evaluations (
                project_name, evaluation_date, mrr_estimate, mrr_low, mrr_high, mrr_confidence,
                growth_estimate, growth_confidence, team_quality_score, data_sources, overall_score,
                recommendation, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                result["project_name"], datetime.now().isoformat(), result["mrr_estimate"],
                result["mrr_low"], result["mrr_high"], result["confidence"],
                result["growth_estimate"], min(1.0, result["growth_estimate"] * 2),
                result["team_quality_score"], json.dumps(data_sources, ensure_ascii=False),
                result["overall_score"], result["recommendation"], "v4_uncertainty_validator"
            )
        )
        conn.commit()
        conn.close()


def main():
    validator = UncertaintyValidatorV4()
    sample_project = {
        "name": "示例项目A",
        "mrr": 20000,
        "growth_rate": 0.3,
        "team_quality": 0.8,
        "data_sources": [
            {"type": "public_info", "mrr": 18000},
            {"type": "founder_direct", "mrr": 22000},
            {"type": "industry_report", "mrr": 21000}
        ]
    }
    result = validator.validate_project(sample_project)
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()