#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
自动化反馈收集器
自动收集客户使用反馈、系统性能数据和改进建议
"""

import os
import json
import time
import sqlite3
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
import threading

@dataclass
class FeedbackData:
    """反馈数据结构"""
    feedback_id: str
    timestamp: str
    feedback_type: str  # usage, error, suggestion, satisfaction
    customer_id: str
    specialization: str  # excel_analyzer, design_reviewer, project_coordinator
    content: str
    context: Dict[str, Any]
    severity: str  # low, medium, high, critical
    status: str  # new, reviewed, resolved, closed

class AutomatedFeedbackCollector:
    """自动化反馈收集器"""

    def __init__(self, base_path: str):
        self.base_path = Path(base_path)
        self.setup_database()
        self.collection_rules = self.load_collection_rules()
        self.is_running = False
        self.collection_thread = None

    def setup_database(self):
        """设置反馈数据库"""
        self.db_path = self.base_path / "feedback_database.db"

        conn = sqlite3.connect(str(self.db_path))
        cursor = conn.cursor()

        # 创建反馈表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS feedback (
                feedback_id TEXT PRIMARY KEY,
                timestamp TEXT NOT NULL,
                feedback_type TEXT NOT NULL,
                customer_id TEXT,
                specialization TEXT,
                content TEXT NOT NULL,
                context TEXT,
                severity TEXT,
                status TEXT DEFAULT 'new',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # 创建系统指标表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS system_metrics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                metric_type TEXT NOT NULL,
                metric_name TEXT NOT NULL,
                metric_value REAL,
                metadata TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # 创建使用统计表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS usage_statistics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                customer_id TEXT,
                specialization TEXT,
                action_type TEXT,
                action_details TEXT,
                duration_ms INTEGER,
                success BOOLEAN,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        conn.commit()
        conn.close()

    def load_collection_rules(self) -> Dict:
        """加载收集规则"""
        rules_file = self.base_path / "collection_rules.json"
        if rules_file.exists():
            with open(rules_file, 'r', encoding='utf-8') as f:
                return json.load(f)

        # 默认收集规则
        default_rules = {
            "usage_tracking": {
                "enabled": True,
                "track_actions": ["file_upload", "analysis_start", "analysis_complete", "report_generation"],
                "sampling_rate": 1.0,
                "max_records_per_hour": 1000
            },
            "error_tracking": {
                "enabled": True,
                "error_types": ["file_error", "processing_error", "system_error"],
                "include_stack_trace": True,
                "max_error_records": 100
            },
            "performance_monitoring": {
                "enabled": True,
                "metrics": ["response_time", "memory_usage", "cpu_usage", "disk_io"],
                "collection_interval": 60,  # 秒
                "retention_days": 30
            },
            "satisfaction_survey": {
                "enabled": True,
                "trigger_after_tasks": 5,
                "survey_interval_days": 7,
                "questions": [
                    "您对分析结果的满意度如何？",
                    "系统操作是否便捷？",
                    "是否有需要改进的地方？"
                ]
            }
        }

        with open(rules_file, 'w', encoding='utf-8') as f:
            json.dump(default_rules, f, ensure_ascii=False, indent=2)

        return default_rules

    def start_collection(self):
        """启动自动收集"""
        if self.is_running:
            return False

        self.is_running = True
        self.collection_thread = threading.Thread(target=self._collection_loop, daemon=True)
        self.collection_thread.start()
        return True

    def stop_collection(self):
        """停止自动收集"""
        self.is_running = False
        if self.collection_thread:
            self.collection_thread.join(timeout=5)

    def _collection_loop(self):
        """收集循环"""
        while self.is_running:
            try:
                # 收集系统指标
                if self.collection_rules["performance_monitoring"]["enabled"]:
                    self._collect_system_metrics()

                # 收集使用统计
                if self.collection_rules["usage_tracking"]["enabled"]:
                    self._process_usage_logs()

                # 检查满意度调查触发条件
                if self.collection_rules["satisfaction_survey"]["enabled"]:
                    self._check_satisfaction_triggers()

                # 清理过期数据
                self._cleanup_old_data()

                time.sleep(self.collection_rules["performance_monitoring"]["collection_interval"])

            except Exception as e:
                print(f"反馈收集过程中出错: {e}")
                time.sleep(60)  # 出错时等待1分钟再重试

    def collect_feedback(self, feedback_type: str, content: str,
                         customer_id: str = None, specialization: str = None,
                         context: Dict = None, severity: str = "medium") -> str:
        """收集反馈"""
        import uuid

        feedback_id = str(uuid.uuid4())
        feedback_data = FeedbackData(
            feedback_id=feedback_id,
            timestamp=datetime.now().isoformat(),
            feedback_type=feedback_type,
            customer_id=customer_id,
            specialization=specialization,
            content=content,
            context=context or {},
            severity=severity,
            status="new"
        )

        # 保存到数据库
        conn = sqlite3.connect(str(self.db_path))
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO feedback (feedback_id, timestamp, feedback_type, customer_id,
                               specialization, content, context, severity, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            feedback_data.feedback_id,
            feedback_data.timestamp,
            feedback_data.feedback_type,
            feedback_data.customer_id,
            feedback_data.specialization,
            feedback_data.content,
            json.dumps(feedback_data.context, ensure_ascii=False),
            feedback_data.severity,
            feedback_data.status
        ))

        conn.commit()
        conn.close()

        # 高严重性反馈立即处理
        if severity in ["high", "critical"]:
            self._process_urgent_feedback(feedback_id)

        return feedback_id

    def track_usage(self, customer_id: str, specialization: str, action_type: str,
                   action_details: Dict = None, duration_ms: int = None,
                   success: bool = True):
        """跟踪使用情况"""
        if not self.collection_rules["usage_tracking"]["enabled"]:
            return

        # 采样检查
        import random
        if random.random() > self.collection_rules["usage_tracking"]["sampling_rate"]:
            return

        conn = sqlite3.connect(str(self.db_path))
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO usage_statistics (timestamp, customer_id, specialization,
                                       action_type, action_details, duration_ms, success)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            datetime.now().isoformat(),
            customer_id,
            specialization,
            action_type,
            json.dumps(action_details or {}, ensure_ascii=False),
            duration_ms,
            success
        ))

        conn.commit()
        conn.close()

    def track_error(self, error_type: str, error_message: str, specialization: str = None,
                   context: Dict = None, severity: str = "medium"):
        """跟踪错误"""
        if not self.collection_rules["error_tracking"]["enabled"]:
            return

        feedback_content = f"错误类型: {error_type}\n错误信息: {error_message}"
        if self.collection_rules["error_tracking"]["include_stack_trace"] and context:
            feedback_content += f"\n上下文: {json.dumps(context, ensure_ascii=False, indent=2)}"

        self.collect_feedback(
            feedback_type="error",
            content=feedback_content,
            specialization=specialization,
            context=context,
            severity=severity
        )

    def _collect_system_metrics(self):
        """收集系统指标"""
        import psutil

        metrics = self.collection_rules["performance_monitoring"]["metrics"]
        conn = sqlite3.connect(str(self.db_path))
        cursor = conn.cursor()

        timestamp = datetime.now().isoformat()

        if "response_time" in metrics:
            # 这里可以添加响应时间收集逻辑
            pass

        if "memory_usage" in metrics:
            memory_info = psutil.virtual_memory()
            cursor.execute('''
                INSERT INTO system_metrics (timestamp, metric_type, metric_name, metric_value, metadata)
                VALUES (?, ?, ?, ?, ?)
            ''', (timestamp, "memory", "usage_percent", memory_info.percent,
                   json.dumps({"total": memory_info.total, "available": memory_info.available}, ensure_ascii=False)))

        if "cpu_usage" in metrics:
            cpu_percent = psutil.cpu_percent(interval=1)
            cursor.execute('''
                INSERT INTO system_metrics (timestamp, metric_type, metric_name, metric_value, metadata)
                VALUES (?, ?, ?, ?, ?)
            ''', (timestamp, "cpu", "usage_percent", cpu_percent, "{}"))

        if "disk_io" in metrics:
            disk_io = psutil.disk_io_counters()
            if disk_io:
                cursor.execute('''
                    INSERT INTO system_metrics (timestamp, metric_type, metric_name, metric_value, metadata)
                    VALUES (?, ?, ?, ?, ?)
                ''', (timestamp, "disk", "read_bytes", disk_io.read_bytes,
                       json.dumps({"write_bytes": disk_io.write_bytes}, ensure_ascii=False)))

        conn.commit()
        conn.close()

    def _process_usage_logs(self):
        """处理使用日志"""
        # 这里可以添加日志文件处理逻辑
        pass

    def _check_satisfaction_triggers(self):
        """检查满意度调查触发条件"""
        # 检查任务完成次数
        trigger_after_tasks = self.collection_rules["satisfaction_survey"]["trigger_after_tasks"]

        conn = sqlite3.connect(str(self.db_path))
        cursor = conn.cursor()

        # 统计各客户的使用次数
        cursor.execute('''
            SELECT customer_id, specialization, COUNT(*) as task_count
            FROM usage_statistics
            WHERE timestamp > date('now', '-7 days')
            GROUP BY customer_id, specialization
            HAVING task_count >= ?
        ''', (trigger_after_tasks,))

        for row in cursor.fetchall():
            customer_id, specialization, task_count = row

            # 检查是否已经发送过调查
            cursor.execute('''
                SELECT COUNT(*) FROM feedback
                WHERE feedback_type = 'satisfaction'
                AND customer_id = ?
                AND specialization = ?
                AND timestamp > date('now', '-7 days')
            ''', (customer_id, specialization))

            if cursor.fetchone()[0] == 0:
                # 发送满意度调查
                self._send_satisfaction_survey(customer_id, specialization)

        conn.commit()
        conn.close()

    def _send_satisfaction_survey(self, customer_id: str, specialization: str):
        """发送满意度调查"""
        questions = self.collection_rules["satisfaction_survey"]["questions"]

        survey_content = "我们希望了解您的使用体验，请花几分钟时间回答以下问题：\n\n"
        for i, question in enumerate(questions, 1):
            survey_content += f"{i}. {question}\n"

        self.collect_feedback(
            feedback_type="satisfaction",
            content=survey_content,
            customer_id=customer_id,
            specialization=specialization,
            context={"survey_questions": questions},
            severity="low"
        )

    def _process_urgent_feedback(self, feedback_id: str):
        """处理紧急反馈"""
        # 这里可以添加紧急反馈处理逻辑
        # 例如发送通知、创建工单等
        print(f"收到紧急反馈: {feedback_id}")

    def _cleanup_old_data(self):
        """清理过期数据"""
        retention_days = self.collection_rules["performance_monitoring"]["retention_days"]
        cutoff_date = datetime.now() - timedelta(days=retention_days)

        conn = sqlite3.connect(str(self.db_path))
        cursor = conn.cursor()

        # 清理系统指标
        cursor.execute('DELETE FROM system_metrics WHERE timestamp < ?', (cutoff_date.isoformat(),))

        # 清理使用统计
        cursor.execute('DELETE FROM usage_statistics WHERE timestamp < ?', (cutoff_date.isoformat(),))

        conn.commit()
        conn.close()

    def get_feedback_summary(self, days: int = 7) -> Dict:
        """获取反馈摘要"""
        conn = sqlite3.connect(str(self.db_path))
        cursor = conn.cursor()

        cutoff_date = datetime.now() - timedelta(days=days)

        # 反馈类型统计
        cursor.execute('''
            SELECT feedback_type, COUNT(*) as count
            FROM feedback
            WHERE timestamp > ?
            GROUP BY feedback_type
        ''', (cutoff_date.isoformat(),))

        feedback_by_type = dict(cursor.fetchall())

        # 严重性统计
        cursor.execute('''
            SELECT severity, COUNT(*) as count
            FROM feedback
            WHERE timestamp > ?
            GROUP BY severity
        ''', (cutoff_date.isoformat(),))

        feedback_by_severity = dict(cursor.fetchall())

        # 特化模块统计
        cursor.execute('''
            SELECT specialization, COUNT(*) as count
            FROM feedback
            WHERE timestamp > ? AND specialization IS NOT NULL
            GROUP BY specialization
        ''', (cutoff_date.isoformat(),))

        feedback_by_specialization = dict(cursor.fetchall())

        conn.close()

        return {
            "period_days": days,
            "total_feedback": sum(feedback_by_type.values()),
            "feedback_by_type": feedback_by_type,
            "feedback_by_severity": feedback_by_severity,
            "feedback_by_specialization": feedback_by_specialization
        }

    def get_system_performance_report(self, days: int = 7) -> Dict:
        """获取系统性能报告"""
        conn = sqlite3.connect(str(self.db_path))
        cursor = conn.cursor()

        cutoff_date = datetime.now() - timedelta(days=days)

        # 内存使用统计
        cursor.execute('''
            SELECT AVG(metric_value), MIN(metric_value), MAX(metric_value)
            FROM system_metrics
            WHERE timestamp > ? AND metric_type = 'memory' AND metric_name = 'usage_percent'
        ''', (cutoff_date.isoformat(),))

        memory_stats = cursor.fetchone()

        # CPU使用统计
        cursor.execute('''
            SELECT AVG(metric_value), MIN(metric_value), MAX(metric_value)
            FROM system_metrics
            WHERE timestamp > ? AND metric_type = 'cpu' AND metric_name = 'usage_percent'
        ''', (cutoff_date.isoformat(),))

        cpu_stats = cursor.fetchone()

        conn.close()

        return {
            "period_days": days,
            "memory_usage": {
                "average": memory_stats[0] if memory_stats[0] else 0,
                "minimum": memory_stats[1] if memory_stats[1] else 0,
                "maximum": memory_stats[2] if memory_stats[2] else 0
            },
            "cpu_usage": {
                "average": cpu_stats[0] if cpu_stats[0] else 0,
                "minimum": cpu_stats[1] if cpu_stats[1] else 0,
                "maximum": cpu_stats[2] if cpu_stats[2] else 0
            }
        }

# 使用示例
if __name__ == "__main__":
    # 创建反馈收集器
    collector = AutomatedFeedbackCollector("./反馈收集")

    # 启动自动收集
    collector.start_collection()

    # 手动收集反馈示例
    feedback_id = collector.collect_feedback(
        feedback_type="suggestion",
        content="希望增加更多的数据可视化功能",
        customer_id="customer_001",
        specialization="excel_analyzer",
        context={"feature_request": "data_visualization"},
        severity="medium"
    )

    # 跟踪使用情况
    collector.track_usage(
        customer_id="customer_001",
        specialization="excel_analyzer",
        action_type="file_upload",
        action_details={"file_name": "sales_data.xlsx", "file_size": 1024000},
        duration_ms=1500,
        success=True
    )

    # 获取反馈摘要
    summary = collector.get_feedback_summary(days=7)
    print(f"反馈摘要: {summary}")

    # 获取性能报告
    performance_report = collector.get_system_performance_report(days=7)
    print(f"性能报告: {performance_report}")

    print("反馈收集器运行中...")