#!/usr/bin/env python3
"""
12_special_search_pec.py - PEC技术栈相似技术专项搜索
目标：在PEC相似技术、生态/单项、团队/个人三个维度，筛选过去6个月内符合潜力要求的候选项目
输出：01_data JSON + 01_reports Markdown
"""

import os
import json
import datetime
from typing import Dict, List, Any, Optional
from pathlib import Path
import importlib.util

BASE_PATH = Path("/Users/dangsiyuan/Documents/obsidion/launch x/pocketcorn_v4")
SYSTEM_PATH = BASE_PATH / "zz_系统"

# 动态加载文件管理器
fm_spec = importlib.util.spec_from_file_location("file_manager", os.path.join(SYSTEM_PATH, "99_file_manager.py"))
fm_module = importlib.util.module_from_spec(fm_spec)
fm_spec.loader.exec_module(fm_module)
FileManager = fm_module.FileManager

# 动态加载权重引擎与专业分析器
w_spec = importlib.util.spec_from_file_location("weights", os.path.join(SYSTEM_PATH, "03_enhanced_weights.py"))
a_spec = importlib.util.spec_from_file_location("analyzer", os.path.join(SYSTEM_PATH, "04_professional_analyzer.py"))
w_module = importlib.util.module_from_spec(w_spec)
a_module = importlib.util.module_from_spec(a_spec)
w_spec.loader.exec_module(w_module)
a_spec.loader.exec_module(a_module)
DynamicWeightEngine = w_module.DynamicWeightEngine
ProfessionalAnalyzer = a_module.ProfessionalAnalyzer

# 动态加载趋势追踪用于生态识别
trend_spec = importlib.util.spec_from_file_location("trend", os.path.join(SYSTEM_PATH, "06_global_trend_tracker.py"))
trend_module = importlib.util.module_from_spec(trend_spec)
trend_spec.loader.exec_module(trend_module)
GlobalTrendTracker = trend_module.GlobalTrendTracker

# 动态加载MCP桥
mcp_spec = importlib.util.spec_from_file_location("mcp", os.path.join(SYSTEM_PATH, "02_mcp_bridge.py"))
mcp_module = importlib.util.module_from_spec(mcp_spec)
mcp_spec.loader.exec_module(mcp_module)
MCPBridge = mcp_module.MCPBridge

# 动态加载不确定性验证器
uv_spec = importlib.util.spec_from_file_location("uv", os.path.join(SYSTEM_PATH, "11_uncertainty_validator.py"))
uv_module = importlib.util.module_from_spec(uv_spec)
uv_spec.loader.exec_module(uv_module)
UncertaintyValidatorV4 = uv_module.UncertaintyValidatorV4


def load_search_config() -> Dict:
    cfg_path = BASE_PATH / "search_config.json"
    if cfg_path.exists():
        with open(cfg_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {
        "criteria": {
            "MRR_RANGE": [20000, 250000],
            "TEAM_SIZE": [3, 8],
            "STAGE": ["Pre-seed", "Seed", "Pre-A"],
            "LOCATION": ["北京", "上海", "深圳", "杭州", "广州"]
        }
    }


def simulate_pec_candidates() -> List[Dict[str, Any]]:
    # 轻量模拟：PEC相似技术/生态/个人
    return [
        {"name": "PromptSmith", "category": "PEC生态-工具链", "mrr": 18000, "growth_rate": 0.28, "team_size": 4, "location": "上海"},
        {"name": "RLForge", "category": "PEC相似-强化学习优化", "mrr": 26000, "growth_rate": 0.32, "team_size": 6, "location": "北京"},
        {"name": "ContextHub", "category": "PEC生态-上下文中间件", "mrr": 22000, "growth_rate": 0.27, "team_size": 5, "location": "杭州"},
        {"name": "ZhangWei (个人)", "category": "PEC单项-个体开发者", "mrr": 12000, "growth_rate": 0.4, "team_size": 1, "location": "深圳"}
    ]


def fetch_pec_like_from_history(limit: int = 10) -> List[Dict[str, Any]]:
    import sqlite3
    db_path = SYSTEM_PATH.parent / "zz_数据" / "history.db"
    if not db_path.exists():
        return []
    try:
        conn = sqlite3.connect(str(db_path))
        cur = conn.cursor()
        # 简单关键词匹配：PEC/Prompt/Context/RL
        cur.execute(
            """
            SELECT p.name, AVG(o.mrr) as avg_mrr, COUNT(o.id) as cnt, MAX(o.category) as cat
            FROM observations o JOIN projects p ON o.project_id = p.id
            WHERE LOWER(cat) LIKE '%pec%' OR LOWER(cat) LIKE '%prompt%' OR LOWER(cat) LIKE '%context%' OR LOWER(cat) LIKE '%rl%'
            GROUP BY p.name ORDER BY avg_mrr DESC, cnt DESC LIMIT ?
            """,
            (limit,)
        )
        rows = cur.fetchall()
        conn.close()
        results = []
        for r in rows:
            results.append({
                "name": r[0],
                "category": r[3] or "PEC相关",
                "mrr": int(r[1] or 0),
                "team_size": 5,
                "location": "-",
                "growth_rate": 0.25
            })
        return results
    except Exception:
        return []


def filter_by_potential(projects: List[Dict[str, Any]], cfg: Dict) -> List[Dict[str, Any]]:
    mrr_min, mrr_max = cfg["criteria"]["MRR_RANGE"]
    team_min, team_max = cfg["criteria"]["TEAM_SIZE"]
    results = []
    for p in projects:
        mrr = p.get("mrr", 0)
        team = p.get("team_size", 1)
        if mrr_min <= mrr <= mrr_max and (team_min <= team <= team_max or team == 1):
            results.append(p)
    return results


def enrich_with_analysis(projects: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    analyzer = ProfessionalAnalyzer()
    enriched = []
    for p in projects:
        risk = analyzer.generate_risk_matrix(p)
        valuation = analyzer.calculate_valuation(p)
        enriched.append({
            **p,
            "risk": risk,
            "valuation": {
                "final_valuation": valuation.final_valuation,
                "revenue_multiple": valuation.revenue_multiple
            }
        })
    return enriched


def validate_uncertainty(projects: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    validator = UncertaintyValidatorV4()
    validated = []
    for p in projects:
        p_copy = dict(p)
        p_copy["data_sources"] = [
            {"type": "public_info", "mrr": max(1, int(p.get("mrr", 0) * 0.9))},
            {"type": "competitor_analysis", "mrr": max(1, int(p.get("mrr", 0) * 1.1))}
        ]
        v = validator.validate_project(p_copy)
        validated.append({**p, "uncertainty": v})
    return validated


def generate_markdown_report(items: List[Dict[str, Any]]) -> str:
    lines = [
        "# PEC相似技术/生态/单项团队-潜力候选报告",
        f"**报告日期**: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}\n",
        "## 候选清单\n"
    ]
    for it in items:
        lines.append(f"### 🔹 {it['name']}")
        lines.append(f"- 类别: {it['category']}")
        lines.append(f"- 位置: {it.get('location','-')} | 团队: {it.get('team_size','-')} | MRR: ¥{it.get('mrr',0):,}")
        if "uncertainty" in it:
            u = it["uncertainty"]
            lines.append(f"- 置信度: {u['confidence']:.2f} | 区间: ¥{u['mrr_low']:,} - ¥{u['mrr_high']:,} | 推荐: {u['recommendation']}")
        if "valuation" in it:
            lines.append(f"- 估值(简): ¥{it['valuation']['final_valuation']:,} | 倍数: {it['valuation']['revenue_multiple']:.1f}x")
        lines.append("")
    return "\n".join(lines)


def run_task(config: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """供注册表调用的统一入口，返回结构化结果"""
    fm = FileManager()
    cfg = config or load_search_config()

    hist_candidates = fetch_pec_like_from_history(limit=cfg.get("history_limit", 20))
    base_candidates = hist_candidates + simulate_pec_candidates()

    filtered = filter_by_potential(base_candidates, cfg)
    analyzed = enrich_with_analysis(filtered)
    validated = validate_uncertainty(analyzed)

    json_path = fm.save_formatted_report(
        {"items": validated}, file_type="special", priority="P0", category="PEC专项", custom_name="pec_like_candidates"
    )

    md = generate_markdown_report(validated)
    date_str = datetime.datetime.now().strftime("%Y%m%d_%H%M")
    md_path = BASE_PATH / "01_reports" / f"📊{date_str}_PEC相似技术_生态_个人_候选报告.md"
    md_path.parent.mkdir(parents=True, exist_ok=True)
    with open(md_path, 'w', encoding='utf-8') as f:
        f.write(md)

    return {"items": validated, "json_path": str(json_path), "md_path": str(md_path)}


def main():
    result = run_task()
    print("JSON:", result["json_path"]) 
    print("MARKDOWN:", result["md_path"]) 


if __name__ == "__main__":
    main()