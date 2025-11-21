#!/usr/bin/env python3
"""
14_history_enricher.py - 历史数据富化与时间序列构建
- 扫描 zz_数据/*.json 与 01_data/*.json（若存在）
- 提取公司名、类别、MRR、时间戳等观测
- 存入 zz_数据/history.db（projects, observations）
"""

import os
import json
import datetime
import sqlite3
from pathlib import Path
from typing import Dict, Any, List

BASE_PATH = Path("/Users/dangsiyuan/Documents/obsidion/launch x/pocketcorn_v4")
DATA_DIR = BASE_PATH / "zz_数据"
ONE_DATA_DIR = BASE_PATH / "01_data"
DB_PATH = DATA_DIR / "history.db"

class HistoryEnricher:
    def __init__(self, db_path: Path = DB_PATH):
        self.db_path = str(db_path)
        self._init_db()
    
    def _init_db(self):
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE
            )
            """
        )
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS observations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_id INTEGER,
                observed_at TEXT,
                category TEXT,
                mrr INTEGER,
                source_file TEXT,
                FOREIGN KEY(project_id) REFERENCES projects(id)
            )
            """
        )
        conn.commit()
        conn.close()
    
    def _ensure_project(self, conn, name: str) -> int:
        cur = conn.cursor()
        # 确保 name 是字符串
        if not isinstance(name, str):
            name = str(name)
        cur.execute("INSERT OR IGNORE INTO projects (name) VALUES (?)", (name,))
        conn.commit()
        cur.execute("SELECT id FROM projects WHERE name=?", (name,))
        row = cur.fetchone()
        return row[0]
    
    def ingest_json_file(self, path: Path):
        try:
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except Exception:
            return
        
        # 兼容多种结构：list 直接视为 companies；dict 则从常见键提取
        companies: List[Dict[str, Any]] = []
        timestamp = datetime.datetime.now().isoformat()
        if isinstance(data, list):
            companies = data
        elif isinstance(data, dict):
            meta = data.get('metadata') or {}
            timestamp = meta.get('generated_at') or data.get('generated_at') or timestamp
            # 常见位置：data.items / data.companies / companies / items
            if isinstance(data.get('data'), dict):
                inner = data['data']
                if isinstance(inner.get('companies'), list):
                    companies = inner['companies']
                elif isinstance(inner.get('items'), list):
                    companies = inner['items']
            if not companies:
                if isinstance(data.get('companies'), list):
                    companies = data['companies']
                elif isinstance(data.get('items'), list):
                    companies = data['items']
        else:
            return
        
        if not companies:
            return
        
        conn = sqlite3.connect(self.db_path)
        for c in companies:
            if not isinstance(c, dict):
                continue
            name = c.get('name') or c.get('company')
            if not name:
                continue
            category = c.get('category', '')
            # 尝试多种字段名
            mrr_val = c.get('mrr') or c.get('mrr_rmb') or 0
            try:
                mrr = int(mrr_val)
            except Exception:
                mrr = 0
            pid = self._ensure_project(conn, name)
            conn.execute(
                "INSERT INTO observations (project_id, observed_at, category, mrr, source_file) VALUES (?, ?, ?, ?, ?)",
                (pid, timestamp, category, mrr, str(path.name))
            )
        conn.commit()
        conn.close()
    
    def scan_and_ingest(self) -> Dict[str, int]:
        files = []
        if DATA_DIR.exists():
            files += list(DATA_DIR.glob("*.json"))
        if ONE_DATA_DIR.exists():
            files += list(ONE_DATA_DIR.glob("*.json"))
        ingested = 0
        for fp in files:
            self.ingest_json_file(fp)
            ingested += 1
        return {"files_scanned": len(files), "files_ingested": ingested}

    def top_projects(self, limit: int = 10) -> List[Dict[str, Any]]:
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute(
            """
            SELECT p.name, AVG(o.mrr) as avg_mrr, COUNT(o.id) as cnt
            FROM observations o JOIN projects p ON o.project_id = p.id
            GROUP BY p.name ORDER BY avg_mrr DESC, cnt DESC LIMIT ?
            """,
            (limit,)
        )
        rows = cur.fetchall()
        conn.close()
        return [
            {"name": r[0], "avg_mrr": int(r[1] or 0), "observations": r[2]} for r in rows
        ]


def main():
    h = HistoryEnricher()
    stats = h.scan_and_ingest()
    print("SCANNED:", stats["files_scanned"], "INGESTED:", stats["files_ingested"])
    print(json.dumps({"top": h.top_projects()}, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()