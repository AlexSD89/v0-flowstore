#!/usr/bin/env python3
"""
工具注册表 - 统一工具调用接口与元数据管理
支持动态加载、并发执行、缓存、成本控制
"""

import json
import time
import hashlib
import sqlite3
from dataclasses import dataclass
from typing import Dict, List, Optional, Any
from pathlib import Path
from enum import Enum
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading
import importlib.util

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ToolError(Exception):
    """工具执行错误"""
    def __init__(self, kind: str, message: str, hint: str = ""):
        self.kind = kind  # recoverable|quota|invalid_input|transient
        self.message = message
        self.hint = hint
        super().__init__(f"[{kind}] {message} {hint}")

class ToolKind(Enum):
    SEARCH = "search"
    ANALYZE = "analyze" 
    VALIDATE = "validate"
    COMPARE = "compare"
    DECIDE = "decide"
    MONITOR = "monitor"

@dataclass
class ToolResult:
    """工具执行结果标准格式"""
    success: bool
    data: Any
    metadata: Dict[str, Any]
    cost_ms: int
    confidence: float
    provenance: Dict[str, Any]
    error: Optional[str] = None

@dataclass
class ToolMeta:
    """工具能力描述"""
    tool_id: str
    name: str
    version: str
    capabilities: List[str]
    cost_estimate_ms: int
    concurrent_limit: int = 1
    rate_limit_per_min: int = 60
    enabled: bool = True
    weight: float = 1.0

class ToolRegistry:
    """工具注册表"""
    
    def __init__(self, base_path: Path):
        self.base_path = base_path
        self.system_path = base_path / "zz_系统"
        self.tools: Dict[str, ToolMeta] = {}
        self.cache_db = base_path / "zz_数据" / "tool_cache.db"
        self.cache_lock = threading.Lock()
        self._init_cache_db()
        self._register_tools()
    
    def _init_cache_db(self):
        """初始化缓存数据库"""
        self.cache_db.parent.mkdir(exist_ok=True)
        with sqlite3.connect(self.cache_db) as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS tool_cache (
                    cache_key TEXT PRIMARY KEY,
                    tool_id TEXT,
                    result_data TEXT,
                    cost_ms INTEGER,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    expires_at TIMESTAMP
                )
                """
            )
            conn.execute("CREATE INDEX IF NOT EXISTS idx_tool_cache_expires ON tool_cache(expires_at)")
    
    def _register_tools(self):
        """注册所有可用工具"""
        tool_configs = [
            {"tool_id": "special_search_pec", "name": "PEC专项搜索", "version": "1.0", "capabilities": ["search", "analyze"], "cost_estimate_ms": 5000, "concurrent_limit": 1, "rate_limit_per_min": 10},
            {"tool_id": "explosion_detector", "name": "爆发期检测器", "version": "1.0", "capabilities": ["monitor", "analyze"], "cost_estimate_ms": 3000, "concurrent_limit": 2, "rate_limit_per_min": 20},
            {"tool_id": "uncertainty_validator", "name": "不确定性验证器", "version": "1.0", "capabilities": ["validate", "analyze"], "cost_estimate_ms": 2000, "concurrent_limit": 3, "rate_limit_per_min": 30},
            {"tool_id": "roi_engine", "name": "ROI解决方案引擎", "version": "1.0", "capabilities": ["analyze", "decide"], "cost_estimate_ms": 4000, "concurrent_limit": 2, "rate_limit_per_min": 15},
            {"tool_id": "professional_analyzer", "name": "专业分析师", "version": "1.0", "capabilities": ["analyze", "compare"], "cost_estimate_ms": 3000, "concurrent_limit": 2, "rate_limit_per_min": 25},
            {"tool_id": "iteration_optimizer", "name": "迭代优化器", "version": "1.0", "capabilities": ["analyze", "monitor"], "cost_estimate_ms": 2000, "concurrent_limit": 1, "rate_limit_per_min": 5}
        ]
        for config in tool_configs:
            self.tools[config["tool_id"]] = ToolMeta(**config)
    
    def _get_cache_key(self, tool_id: str, params: Dict) -> str:
        """生成缓存键"""
        param_str = json.dumps(params, sort_keys=True, ensure_ascii=False)
        return hashlib.md5(f"{tool_id}:{param_str}".encode()).hexdigest()
    
    def _get_cached_result(self, cache_key: str) -> Optional[ToolResult]:
        with self.cache_lock:
            with sqlite3.connect(self.cache_db) as conn:
                cur = conn.execute(
                    "SELECT result_data, cost_ms FROM tool_cache WHERE cache_key = ? AND expires_at > datetime('now')",
                    (cache_key,)
                )
                row = cur.fetchone()
                if row:
                    return ToolResult(True, json.loads(row[0]), {"cached": True}, row[1], 0.8, {"source": "cache", "cache_key": cache_key})
        return None
    
    def _cache_result(self, cache_key: str, tool_id: str, result: ToolResult, ttl_hours: int = 12):
        with self.cache_lock:
            with sqlite3.connect(self.cache_db) as conn:
                expires_at = time.time() + (ttl_hours * 3600)
                conn.execute(
                    "INSERT OR REPLACE INTO tool_cache (cache_key, tool_id, result_data, cost_ms, expires_at) VALUES (?, ?, ?, ?, datetime(?, 'unixepoch'))",
                    (cache_key, tool_id, json.dumps(result.data, ensure_ascii=False), result.cost_ms, expires_at)
                )
    
    def _load_module_by_filename(self, filename: str):
        path = self.system_path / filename
        spec = importlib.util.spec_from_file_location(filename.replace('.py',''), str(path))
        mod = importlib.util.module_from_spec(spec)
        assert spec and spec.loader
        spec.loader.exec_module(mod)
        return mod

    def run_tool(self, tool_id: str, params: Dict[str, Any], use_cache: bool = True) -> ToolResult:
        if tool_id not in self.tools:
            raise ToolError("invalid_input", f"Tool {tool_id} not registered")
        meta = self.tools[tool_id]
        if not meta.enabled:
            raise ToolError("recoverable", f"Tool {tool_id} is disabled")

        cache_key = self._get_cache_key(tool_id, params) if use_cache else None
        if use_cache:
            cached = self._get_cached_result(cache_key)
            if cached:
                logger.info(f"Cache hit for {tool_id}")
                return cached

        start = time.time()
        try:
            if tool_id == "special_search_pec":
                mod = self._load_module_by_filename("12_special_search_pec.py")
                result_data = mod.run_task(params or None)
            elif tool_id == "explosion_detector":
                mod = self._load_module_by_filename("07_explosion_detector.py")
                Detector = getattr(mod, "ExplosionDetector")
                detector = Detector()
                companies = params.get("companies", [])
                items = []
                for c in companies:
                    items.append(detector.detect_explosion_signals(c))
                result_data = {"items": items}
            elif tool_id == "uncertainty_validator":
                mod = self._load_module_by_filename("11_uncertainty_validator.py")
                Validator = getattr(mod, "UncertaintyValidatorV4")
                validator = Validator()
                projects = params.get("projects")
                project = params.get("project")
                if projects:
                    results = [validator.validate_project(p) for p in projects]
                    result_data = {"items": results}
                elif project:
                    result_data = validator.validate_project(project)
                else:
                    raise ToolError("invalid_input", "missing project(s) for uncertainty_validator")
            elif tool_id == "roi_engine":
                mod = self._load_module_by_filename("05_roi_engine.py")
                Engine = getattr(mod, "ROISolutionEngine")
                engine = Engine()
                result_data = engine.analyze_roi_potential(**params) if hasattr(engine, 'analyze_roi_potential') else engine.generate_roi_plan(**params)
            elif tool_id == "professional_analyzer":
                mod = self._load_module_by_filename("04_professional_analyzer.py")
                Analyzer = getattr(mod, "ProfessionalAnalyzer")
                analyzer = Analyzer()
                if hasattr(analyzer, 'analyze_professional_metrics'):
                    result_data = analyzer.analyze_professional_metrics(**params)
                else:
                    item = params.get("item", {})
                    result_data = {
                        "risk": analyzer.generate_risk_matrix(item),
                        "valuation": analyzer.calculate_valuation(item)
                    }
            elif tool_id == "iteration_optimizer":
                mod = self._load_module_by_filename("09_iteration_optimizer.py")
                Optim = getattr(mod, "IterationOptimizer")
                opt = Optim()
                if hasattr(opt, 'optimize_iteration_strategy'):
                    result_data = opt.optimize_iteration_strategy(**params)
                else:
                    result_data = opt.generate_iteration_report()
            else:
                raise ToolError("invalid_input", f"Unknown tool_id: {tool_id}")

            cost_ms = int((time.time() - start) * 1000)
            result = ToolResult(True, result_data, {"tool_id": tool_id, "version": meta.version, "capabilities": meta.capabilities}, cost_ms, 0.9, {"source": "tool_execution", "tool_id": tool_id, "ts": time.time()})
            if use_cache:
                self._cache_result(cache_key, tool_id, result)
            return result
        except Exception as e:
            cost_ms = int((time.time() - start) * 1000)
            logger.error(f"Tool {tool_id} execution failed: {e}")
            return ToolResult(False, None, {"tool_id": tool_id}, cost_ms, 0.0, {"source": "tool_execution", "tool_id": tool_id}, str(e))

    def run_tools_parallel(self, tool_calls: List[Dict[str, Any]], max_workers: int = 4) -> List[ToolResult]:
        results: List[ToolResult] = []
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            futures = {executor.submit(self.run_tool, c["tool_id"], c.get("params", {})): c for c in tool_calls}
            for fut in as_completed(futures):
                try:
                    results.append(fut.result())
                except Exception as e:
                    call = futures[fut]
                    logger.error(f"Parallel execution failed for {call['tool_id']}: {e}")
                    results.append(ToolResult(False, None, {"tool_id": call["tool_id"]}, 0, 0.0, {"source": "parallel"}, str(e)))
        return results

    def get_tool_info(self, tool_id: str) -> Optional[ToolMeta]:
        return self.tools.get(tool_id)

    def list_tools(self) -> List[ToolMeta]:
        return list(self.tools.values())

    def enable_tool(self, tool_id: str, enabled: bool = True):
        if tool_id in self.tools:
            self.tools[tool_id].enabled = enabled
            logger.info(f"Tool {tool_id} {'enabled' if enabled else 'disabled'}")

    def update_tool_weight(self, tool_id: str, weight: float):
        if tool_id in self.tools:
            self.tools[tool_id].weight = weight
            logger.info(f"Tool {tool_id} weight -> {weight}")

_registry_instance = None

def get_tool_registry(base_path: Optional[Path] = None) -> ToolRegistry:
    global _registry_instance
    if _registry_instance is None:
        if base_path is None:
            base_path = Path(__file__).parent.parent
        _registry_instance = ToolRegistry(base_path)
    return _registry_instance 