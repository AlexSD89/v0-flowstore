#!/usr/bin/env python3
"""
13_data_source_registry.py - 数据源注册表与质量评估
- 记录各数据源观测
- 计算字段冲突与一致性
- 生成来源权重建议
- 数据库: zz_数据/data_registry.db
"""

import os
import sqlite3
import json
import datetime
from typing import Dict, Any, List

DB_PATH = "zz_数据/data_registry.db"

class DataSourceRegistry:
    def __init__(self, db_path: str = DB_PATH):
        self.db_path = db_path
        self._init_db()
    
    def _init_db(self):
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS sources (
                name TEXT PRIMARY KEY,
                type TEXT,
                base_weight REAL,
                last_updated TEXT
            )
            """
        )
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS observations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                entity_id TEXT,
                field TEXT,
                value TEXT,
                source_name TEXT,
                observed_at TEXT
            )
            """
        )
        conn.commit()
        conn.close()
    
    def register_source(self, name: str, type_: str, base_weight: float = 0.7):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute(
            "INSERT OR REPLACE INTO sources (name, type, base_weight, last_updated) VALUES (?, ?, ?, ?)",
            (name, type_, base_weight, datetime.datetime.now().isoformat())
        )
        conn.commit()
        conn.close()
    
    def record_observation(self, entity_id: str, field: str, value: Any, source_name: str, observed_at: str = None):
        if observed_at is None:
            observed_at = datetime.datetime.now().isoformat()
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO observations (entity_id, field, value, source_name, observed_at) VALUES (?, ?, ?, ?, ?)",
            (entity_id, field, json.dumps(value, ensure_ascii=False), source_name, observed_at)
        )
        conn.commit()
        conn.close()
    
    def evaluate_source_reliability(self, field: str) -> List[Dict[str, Any]]:
        """基于字段一致性评估各来源的可靠性（越少冲突，可靠性越高）"""
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute(
            "SELECT source_name, COUNT(*) FROM observations WHERE field=? GROUP BY source_name",
            (field,)
        )
        counts = {row[0]: row[1] for row in cur.fetchall()}
        
        # 简化冲突：统计同一entity_id、field下不同value的数量
        cur.execute(
            """
            SELECT entity_id, source_name, value FROM observations WHERE field=?
            """,
            (field,)
        )
        records = cur.fetchall()
        conn.close()
        
        # 构建entity->values by source
        entity_values: Dict[str, Dict[str, Any]] = {}
        for entity_id, source_name, value_json in records:
            value = json.loads(value_json)
            entity_values.setdefault(entity_id, {})[source_name] = value
        
        # 计算每源的冲突次数
        conflicts_by_source = {s: 0 for s in counts}
        for entity_id, by_source in entity_values.items():
            values = list(by_source.values())
            if len(values) <= 1:
                continue
            # 以字符串比较近似
            base = json.dumps(values[0], ensure_ascii=False)
            for s, v in by_source.items():
                if json.dumps(v, ensure_ascii=False) != base:
                    conflicts_by_source[s] = conflicts_by_source.get(s, 0) + 1
        
        # 计算可靠性分数 = 1 - 冲突率
        reliability = []
        for s, total in counts.items():
            conflict = conflicts_by_source.get(s, 0)
            conflict_rate = min(1.0, conflict / max(1, total))
            reliability.append({
                "source_name": s,
                "observations": total,
                "conflicts": conflict,
                "conflict_rate": conflict_rate,
                "suggested_weight": round(max(0.3, 1 - conflict_rate), 2)
            })
        
        reliability.sort(key=lambda x: (x["suggested_weight"], x["observations"]), reverse=True)
        return reliability


def main():
    reg = DataSourceRegistry()
    # 示例注册
    reg.register_source("zz_数据/explosion_analysis", "json_file", 0.8)
    # 示例记录
    reg.record_observation("AutoPrompt", "mrr", 18000, "zz_数据/explosion_analysis")
    reg.record_observation("AutoPrompt", "mrr", 20000, "manual_estimation")
    # 评估
    summary = reg.evaluate_source_reliability("mrr")
    print(json.dumps(summary, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()