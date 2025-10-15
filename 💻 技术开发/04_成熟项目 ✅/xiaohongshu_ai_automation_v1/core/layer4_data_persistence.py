#!/usr/bin/env python3
"""
Agent OS System - Layer4 Data Persistence
Agent OS系统 - 第四层：数据持久化层

核心功能：数据生命周期管理、知识存储管理、价值评估优化
Based on BMAD Hybrid Intelligence Architecture
Version: 1.0
Created: 2025-01-22
"""

import asyncio
import json
import logging
import sqlite3
import hashlib
import pickle
import gzip
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple, Set, Union
from dataclasses import dataclass, field
from enum import Enum
import uuid
import re
import math
from collections import defaultdict, Counter
import aiofiles
import aiofiles.os

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DataLifecycleStage(Enum):
    """数据生命周期阶段"""
    CREATION = "creation"           # 创建
    ACTIVE = "active"              # 活跃使用
    ARCHIVAL = "archival"           # 归档
    COLD_STORAGE = "cold_storage"   # 冷存储
    DELETION_CANDIDATE = "deletion_candidate"  # 删除候选
    DELETED = "deleted"             # 已删除

class KnowledgeCategory(Enum):
    """知识类别"""
    USER_BEHAVIOR = "user_behavior"           # 用户行为
    BUSINESS_LOGIC = "business_logic"         # 业务逻辑
    SYSTEM_CONFIG = "system_config"           # 系统配置
    ANALYTICS_DATA = "analytics_data"         # 分析数据
    CONTENT_LIBRARY = "content_library"       # 内容库
    QUALITY_METRICS = "quality_metrics"       # 质量指标
    PERFORMANCE_DATA = "performance_data"     # 性能数据
    KNOWLEDGE_GRAPH = "knowledge_graph"       # 知识图谱

class StorageTier(Enum):
    """存储层级"""
    HOT = "hot"               # 热存储 - 快速访问
    WARM = "warm"             # 温存储 - 中等访问
    COLD = "cold"             # 冷存储 - 长期保存
    ARCHIVE = "archive"       # 归档存储 - 合规保存

@dataclass
class DataRecord:
    """数据记录"""
    record_id: str
    data_type: str
    category: KnowledgeCategory
    content: Any
    metadata: Dict[str, Any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.now)
    last_accessed: datetime = field(default_factory=datetime.now)
    access_count: int = 0
    size_bytes: int = 0
    lifecycle_stage: DataLifecycleStage = DataLifecycleStage.ACTIVE
    storage_tier: StorageTier = StorageTier.HOT
    tags: Set[str] = field(default_factory=set)
    checksum: str = ""
    retention_days: Optional[int] = None

@dataclass
class AccessPattern:
    """访问模式"""
    record_id: str
    access_timestamp: datetime
    access_type: str  # read, write, update, delete
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    response_time_ms: Optional[float] = None

class DataLifecycleManager:
    """数据生命周期管理器"""

    def __init__(self, db_path: str = "data_lifecycle.db"):
        self.db_path = db_path
        self.lifecycle_rules = {
            DataLifecycleStage.ACTIVE: {
                "max_access_days": 30,
                "min_access_count": 5,
                "promote_to": DataLifecycleStage.ARCHIVAL
            },
            DataLifecycleStage.ARCHIVAL: {
                "max_access_days": 365,
                "min_access_count": 1,
                "promote_to": DataLifecycleStage.COLD_STORAGE
            },
            DataLifecycleStage.COLD_STORAGE: {
                "max_access_days": 1095,  # 3年
                "min_access_count": 0,
                "promote_to": DataLifecycleStage.DELETION_CANDIDATE
            },
            DataLifecycleStage.DELETION_CANDIDATE: {
                "grace_period_days": 30,
                "promote_to": DataLifecycleStage.DELETED
            }
        }
        self.storage_tier_rules = {
            StorageTier.HOT: {
                "max_size_gb": 10,
                "max_access_time_ms": 100,
                "min_access_frequency": 0.1  # 每天至少访问0.1次
            },
            StorageTier.WARM: {
                "max_size_gb": 100,
                "max_access_time_ms": 500,
                "min_access_frequency": 0.01  # 每天至少访问0.01次
            },
            StorageTier.COLD: {
                "max_size_gb": 1000,
                "max_access_time_ms": 5000,
                "min_access_frequency": 0.001  # 每天至少访问0.001次
            },
            StorageTier.ARCHIVE: {
                "max_size_gb": 10000,
                "max_access_time_ms": 30000,
                "min_access_frequency": 0.0001  # 每天至少访问0.0001次
            }
        }

        self._initialize_database()

    def _initialize_database(self):
        """初始化数据库"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        # 创建数据记录表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS data_records (
                record_id TEXT PRIMARY KEY,
                data_type TEXT NOT NULL,
                category TEXT NOT NULL,
                content BLOB,
                metadata TEXT,
                created_at TIMESTAMP,
                last_accessed TIMESTAMP,
                access_count INTEGER DEFAULT 0,
                size_bytes INTEGER DEFAULT 0,
                lifecycle_stage TEXT DEFAULT 'active',
                storage_tier TEXT DEFAULT 'hot',
                tags TEXT,
                checksum TEXT,
                retention_days INTEGER
            )
        ''')

        # 创建访问模式表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS access_patterns (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                record_id TEXT,
                access_timestamp TIMESTAMP,
                access_type TEXT,
                user_id TEXT,
                session_id TEXT,
                response_time_ms REAL,
                FOREIGN KEY (record_id) REFERENCES data_records (record_id)
            )
        ''')

        # 创建索引
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_records_category ON data_records(category)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_records_lifecycle ON data_records(lifecycle_stage)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_records_tier ON data_records(storage_tier)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_records_last_accessed ON data_records(last_accessed)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_access_patterns_record ON access_patterns(record_id)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_access_patterns_timestamp ON access_patterns(access_timestamp)')

        conn.commit()
        conn.close()

    async def store_record(self, record: DataRecord) -> bool:
        """存储数据记录"""
        try:
            # 计算校验和
            record.checksum = self._calculate_checksum(record.content)
            record.size_bytes = len(pickle.dumps(record.content))

            # 序列化数据
            content_blob = pickle.dumps(record.content)
            metadata_json = json.dumps(record.metadata)
            tags_json = json.dumps(list(record.tags))

            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()

            cursor.execute('''
                INSERT OR REPLACE INTO data_records
                (record_id, data_type, category, content, metadata, created_at, last_accessed,
                 access_count, size_bytes, lifecycle_stage, storage_tier, tags, checksum, retention_days)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                record.record_id, record.data_type, record.category.value, content_blob,
                metadata_json, record.created_at, record.last_accessed,
                record.access_count, record.size_bytes, record.lifecycle_stage.value,
                record.storage_tier.value, tags_json, record.checksum, record.retention_days
            ))

            conn.commit()
            conn.close()

            logger.info(f"Stored record: {record.record_id}")
            return True

        except Exception as e:
            logger.error(f"Error storing record {record.record_id}: {e}")
            return False

    async def retrieve_record(self, record_id: str) -> Optional[DataRecord]:
        """检索数据记录"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()

            cursor.execute('SELECT * FROM data_records WHERE record_id = ?', (record_id,))
            row = cursor.fetchone()

            if row:
                # 反序列化数据
                content = pickle.loads(row[3])
                metadata = json.loads(row[4])
                tags = set(json.loads(row[10]))

                record = DataRecord(
                    record_id=row[0],
                    data_type=row[1],
                    category=KnowledgeCategory(row[2]),
                    content=content,
                    metadata=metadata,
                    created_at=datetime.fromisoformat(row[5]),
                    last_accessed=datetime.fromisoformat(row[6]),
                    access_count=row[7],
                    size_bytes=row[8],
                    lifecycle_stage=DataLifecycleStage(row[9]),
                    storage_tier=StorageTier(row[10]),
                    tags=tags,
                    checksum=row[11],
                    retention_days=row[12]
                )

                # 更新访问统计
                await self._update_access_stats(record_id)

                conn.close()
                return record

            conn.close()
            return None

        except Exception as e:
            logger.error(f"Error retrieving record {record_id}: {e}")
            return None

    async def _update_access_stats(self, record_id: str, access_type: str = "read",
                                 user_id: Optional[str] = None, session_id: Optional[str] = None):
        """更新访问统计"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()

            # 更新记录访问统计
            cursor.execute('''
                UPDATE data_records
                SET access_count = access_count + 1, last_accessed = ?
                WHERE record_id = ?
            ''', (datetime.now(), record_id))

            # 记录访问模式
            cursor.execute('''
                INSERT INTO access_patterns
                (record_id, access_timestamp, access_type, user_id, session_id)
                VALUES (?, ?, ?, ?, ?)
            ''', (record_id, datetime.now(), access_type, user_id, session_id))

            conn.commit()
            conn.close()

        except Exception as e:
            logger.error(f"Error updating access stats for {record_id}: {e}")

    async def process_lifecycle_transitions(self):
        """处理生命周期转换"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()

            # 获取需要检查的记录
            cursor.execute('''
                SELECT record_id, lifecycle_stage, last_accessed, access_count, created_at, retention_days
                FROM data_records
                WHERE lifecycle_stage != 'deleted'
            ''')

            records = cursor.fetchall()
            transitions_made = 0

            for row in records:
                record_id, current_stage_str, last_accessed_str, access_count, created_at_str, retention_days = row
                current_stage = DataLifecycleStage(current_stage_str)
                last_accessed = datetime.fromisoformat(last_accessed_str)
                created_at = datetime.fromisoformat(created_at_str)

                new_stage = self._evaluate_lifecycle_stage(
                    current_stage, last_accessed, access_count, created_at, retention_days
                )

                if new_stage != current_stage:
                    # 更新生命周期阶段
                    cursor.execute('''
                        UPDATE data_records SET lifecycle_stage = ? WHERE record_id = ?
                    ''', (new_stage.value, record_id))

                    transitions_made += 1
                    logger.info(f"Lifecycle transition: {record_id} {current_stage.value} -> {new_stage.value}")

            conn.commit()
            conn.close()

            logger.info(f"Processed {transitions_made} lifecycle transitions")

        except Exception as e:
            logger.error(f"Error processing lifecycle transitions: {e}")

    def _evaluate_lifecycle_stage(self, current_stage: DataLifecycleStage, last_accessed: datetime,
                                access_count: int, created_at: datetime, retention_days: Optional[int]) -> DataLifecycleStage:
        """评估生命周期阶段"""
        now = datetime.now()

        # 检查明确的保留期限
        if retention_days:
            expiry_date = created_at + timedelta(days=retention_days)
            if now > expiry_date:
                return DataLifecycleStage.DELETION_CANDIDATE

        days_since_access = (now - last_accessed).days
        days_since_creation = (now - created_at).days

        # 基于规则评估
        if current_stage in self.lifecycle_rules:
            rules = self.lifecycle_rules[current_stage]

            # 检查是否达到最大访问天数
            if days_since_access > rules["max_access_days"]:
                # 检查访问频率
                access_frequency = access_count / max(days_since_creation, 1)
                if access_frequency < rules["min_access_count"] / rules["max_access_days"]:
                    return rules["promote_to"]

        return current_stage

    def _calculate_checksum(self, content: Any) -> str:
        """计算内容校验和"""
        content_bytes = pickle.dumps(content)
        return hashlib.sha256(content_bytes).hexdigest()

    async def cleanup_deleted_records(self, days_old: int = 30):
        """清理已删除记录"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()

            cutoff_date = datetime.now() - timedelta(days=days_old)
            cursor.execute('''
                DELETE FROM data_records
                WHERE lifecycle_stage = 'deleted' AND last_accessed < ?
            ''', (cutoff_date,))

            deleted_count = cursor.rowcount
            conn.commit()
            conn.close()

            logger.info(f"Cleaned up {deleted_count} deleted records")

        except Exception as e:
            logger.error(f"Error cleaning up deleted records: {e}")

    async def get_lifecycle_statistics(self) -> Dict[str, Any]:
        """获取生命周期统计"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()

            # 统计各阶段记录数
            cursor.execute('''
                SELECT lifecycle_stage, COUNT(*)
                FROM data_records
                GROUP BY lifecycle_stage
            ''')
            stage_stats = dict(cursor.fetchall())

            # 统计各存储层级记录数
            cursor.execute('''
                SELECT storage_tier, COUNT(*)
                FROM data_records
                GROUP BY storage_tier
            ''')
            tier_stats = dict(cursor.fetchall())

            # 统计各类别记录数
            cursor.execute('''
                SELECT category, COUNT(*)
                FROM data_records
                GROUP BY category
            ''')
            category_stats = dict(cursor.fetchall())

            conn.close()

            return {
                "stage_distribution": stage_stats,
                "tier_distribution": tier_stats,
                "category_distribution": category_stats,
                "total_records": sum(stage_stats.values())
            }

        except Exception as e:
            logger.error(f"Error getting lifecycle statistics: {e}")
            return {}

class ValueAssessmentEngine:
    """价值评估引擎"""

    def __init__(self):
        self.value_factors = {
            "access_frequency": {"weight": 0.25, "decay_rate": 0.1},
            "freshness": {"weight": 0.15, "decay_rate": 0.05},
            "size_importance": {"weight": 0.10, "decay_rate": 0.02},
            "category_importance": {"weight": 0.20, "decay_rate": 0.03},
            "user_feedback": {"weight": 0.20, "decay_rate": 0.08},
            "business_impact": {"weight": 0.10, "decay_rate": 0.04}
        }

        self.category_importance = {
            KnowledgeCategory.USER_BEHAVIOR: 0.9,
            KnowledgeCategory.BUSINESS_LOGIC: 0.8,
            KnowledgeCategory.SYSTEM_CONFIG: 0.7,
            KnowledgeCategory.ANALYTICS_DATA: 0.8,
            KnowledgeCategory.CONTENT_LIBRARY: 0.7,
            KnowledgeCategory.QUALITY_METRICS: 0.9,
            KnowledgeCategory.PERFORMANCE_DATA: 0.8,
            KnowledgeCategory.KNOWLEDGE_GRAPH: 0.9
        }

    def calculate_value_score(self, record: DataRecord, access_patterns: List[AccessPattern] = None) -> float:
        """计算价值分数"""
        if access_patterns is None:
            access_patterns = []

        now = datetime.now()

        # 计算各项因子分数
        scores = {}

        # 访问频率分数
        days_since_creation = (now - record.created_at).days
        access_frequency = record.access_count / max(days_since_creation, 1)
        scores["access_frequency"] = min(access_frequency / 10.0, 1.0)

        # 新鲜度分数
        days_since_access = (now - record.last_accessed).days
        freshness_score = max(0, 1 - days_since_access / 365.0)  # 一年内的新鲜度
        scores["freshness"] = freshness_score

        # 大小重要性分数
        size_score = min(record.size_bytes / (1024 * 1024), 1.0)  # 1MB为满分
        scores["size_importance"] = size_score

        # 类别重要性分数
        category_score = self.category_importance.get(record.category, 0.5)
        scores["category_importance"] = category_score

        # 用户反馈分数（从元数据获取）
        feedback_score = record.metadata.get("user_feedback", 0.5)
        scores["user_feedback"] = feedback_score

        # 业务影响分数（从元数据获取）
        business_impact = record.metadata.get("business_impact", 0.5)
        scores["business_impact"] = business_impact

        # 计算加权总分
        total_score = 0
        total_weight = 0

        for factor, score in scores.items():
            if factor in self.value_factors:
                weight = self.value_factors[factor]["weight"]
                total_score += score * weight
                total_weight += weight

        final_score = total_score / total_weight if total_weight > 0 else 0
        return min(max(final_score, 0), 1)

    def update_value_scores(self, records: List[DataRecord], access_patterns: Dict[str, List[AccessPattern]]):
        """批量更新价值分数"""
        for record in records:
            record_access_patterns = access_patterns.get(record.record_id, [])
            value_score = self.calculate_value_score(record, record_access_patterns)

            # 更新元数据中的价值分数
            record.metadata["value_score"] = value_score
            record.metadata["value_updated"] = datetime.now().isoformat()

    def get_high_value_records(self, records: List[DataRecord], threshold: float = 0.7, limit: int = 100) -> List[DataRecord]:
        """获取高价值记录"""
        scored_records = []

        for record in records:
            value_score = record.metadata.get("value_score", 0)
            if value_score >= threshold:
                scored_records.append((record, value_score))

        # 按价值分数排序
        scored_records.sort(key=lambda x: x[1], reverse=True)

        return [record for record, _ in scored_records[:limit]]

    def get_value_decay_schedule(self, days: int = 365) -> Dict[str, List[float]]:
        """获取价值衰减时间表"""
        schedule = {}

        for factor_name, factor_config in self.value_factors.items():
            decay_rate = factor_config["decay_rate"]
            daily_values = []

            for day in range(days + 1):
                decayed_value = math.exp(-decay_rate * day)
                daily_values.append(decayed_value)

            schedule[factor_name] = daily_values

        return schedule

class IntelligentStorageManager:
    """智能存储管理器"""

    def __init__(self, base_path: str = "data_storage"):
        self.base_path = Path(base_path)
        self.storage_paths = {
            StorageTier.HOT: self.base_path / "hot",
            StorageTier.WARM: self.base_path / "warm",
            StorageTier.COLD: self.base_path / "cold",
            StorageTier.ARCHIVE: self.base_path / "archive"
        }

        # 创建存储目录
        for tier_path in self.storage_paths.values():
            tier_path.mkdir(parents=True, exist_ok=True)

        self.tier_capacities = {
            StorageTier.HOT: 10 * 1024 * 1024 * 1024,   # 10GB
            StorageTier.WARM: 100 * 1024 * 1024 * 1024,  # 100GB
            StorageTier.COLD: 1000 * 1024 * 1024 * 1024, # 1TB
            StorageTier.ARCHIVE: 10000 * 1024 * 1024 * 1024 # 10TB
        }

        self.tier_usage = defaultdict(int)
        self.migration_queue = []

    async def store_to_tier(self, record: DataRecord, tier: StorageTier) -> bool:
        """存储到指定层级"""
        try:
            tier_path = self.storage_paths[tier]

            # 创建分类目录
            category_path = tier_path / record.category.value
            category_path.mkdir(exist_ok=True)

            # 生成文件路径
            file_path = category_path / f"{record.record_id}.dat"

            # 序列化数据
            record_data = {
                "record": record,
                "stored_at": datetime.now().isoformat(),
                "tier": tier.value
            }

            # 压缩存储以节省空间
            compressed_data = gzip.compress(pickle.dumps(record_data))

            async with aiofiles.open(file_path, 'wb') as f:
                await f.write(compressed_data)

            # 更新使用统计
            self.tier_usage[tier] += len(compressed_data)

            logger.info(f"Stored {record.record_id} to {tier.value} tier")
            return True

        except Exception as e:
            logger.error(f"Error storing record {record.record_id} to {tier.value} tier: {e}")
            return False

    async def retrieve_from_tier(self, record_id: str, tier: StorageTier) -> Optional[DataRecord]:
        """从指定层级检索"""
        try:
            # 需要先确定记录的类别
            # 在实际系统中，这里会有索引映射
            category_path = self.storage_paths[tier]

            # 在所有类别目录中搜索
            for category_dir in category_path.iterdir():
                if category_dir.is_dir():
                    file_path = category_dir / f"{record_id}.dat"
                    if file_path.exists():
                        async with aiofiles.open(file_path, 'rb') as f:
                            compressed_data = await f.read()

                        # 解压缩数据
                        record_data = pickle.loads(gzip.decompress(compressed_data))
                        return record_data["record"]

            return None

        except Exception as e:
            logger.error(f"Error retrieving {record_id} from {tier.value} tier: {e}")
            return None

    async def optimize_storage_allocation(self, records: List[DataRecord]):
        """优化存储分配"""
        # 计算当前存储使用情况
        total_usage = sum(self.tier_usage.values())
        total_capacity = sum(self.tier_capacities.values())
        usage_percentage = total_usage / total_capacity

        logger.info(f"Storage usage: {usage_percentage:.2%} ({total_usage / (1024**3):.2f}GB / {total_capacity / (1024**3):.2f}GB)")

        # 检查是否需要存储迁移
        if usage_percentage > 0.8:  # 使用率超过80%
            await self._plan_storage_migration(records)

    async def _plan_storage_migration(self, records: List[DataRecord]):
        """规划存储迁移"""
        migration_plan = []

        # 找出可以迁移到较低层级的记录
        for record in records:
            current_tier = record.storage_tier

            # 检查是否可以降级
            if current_tier == StorageTier.HOT:
                days_since_access = (datetime.now() - record.last_accessed).days
                if days_since_access > 7:  # 7天未访问
                    new_tier = StorageTier.WARM
                    migration_plan.append((record, current_tier, new_tier))
            elif current_tier == StorageTier.WARM:
                days_since_access = (datetime.now() - record.last_accessed).days
                if days_since_access > 30:  # 30天未访问
                    new_tier = StorageTier.COLD
                    migration_plan.append((record, current_tier, new_tier))
            elif current_tier == StorageTier.COLD:
                days_since_access = (datetime.now() - record.last_accessed).days
                if days_since_access > 365:  # 1年未访问
                    new_tier = StorageTier.ARCHIVE
                    migration_plan.append((record, current_tier, new_tier))

        # 执行迁移
        for record, old_tier, new_tier in migration_plan:
            # 从旧层级删除
            await self._remove_from_tier(record.record_id, old_tier)
            # 存储到新层级
            await self.store_to_tier(record, new_tier)
            # 更新记录的存储层级
            record.storage_tier = new_tier

            logger.info(f"Migrated {record.record_id} from {old_tier.value} to {new_tier.value}")

    async def _remove_from_tier(self, record_id: str, tier: StorageTier):
        """从层级移除记录"""
        try:
            tier_path = self.storage_paths[tier]

            # 在所有类别目录中搜索并删除
            for category_dir in tier_path.iterdir():
                if category_dir.is_dir():
                    file_path = category_dir / f"{record_id}.dat"
                    if file_path.exists():
                        file_size = file_path.stat().st_size
                        await aiofiles.os.remove(file_path)
                        self.tier_usage[tier] -= file_size
                        break

        except Exception as e:
            logger.error(f"Error removing {record_id} from {tier.value} tier: {e}")

    def get_storage_statistics(self) -> Dict[str, Any]:
        """获取存储统计"""
        return {
            "tier_usage": {tier.value: usage / (1024**3) for tier, usage in self.tier_usage.items()},
            "tier_capacities": {tier.value: capacity / (1024**3) for tier, capacity in self.tier_capacities.items()},
            "total_usage": sum(self.tier_usage.values()) / (1024**3),
            "total_capacity": sum(self.tier_capacities.values()) / (1024**3),
            "usage_percentage": sum(self.tier_usage.values()) / sum(self.tier_capacities.values()) * 100
        }

class BackupManager:
    """备份管理器"""

    def __init__(self, backup_path: str = "backups"):
        self.backup_path = Path(backup_path)
        self.backup_path.mkdir(parents=True, exist_ok=True)

        self.backup_schedule = {
            "hot": {"frequency": "hourly", "retention_days": 7},
            "warm": {"frequency": "daily", "retention_days": 30},
            "cold": {"frequency": "weekly", "retention_days": 90},
            "archive": {"frequency": "monthly", "retention_days": 365}
        }

    async def create_backup(self, tier: StorageTier, backup_type: str = "full") -> str:
        """创建备份"""
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_filename = f"backup_{tier.value}_{backup_type}_{timestamp}.tar.gz"
            backup_filepath = self.backup_path / backup_filename

            # 在实际系统中，这里会执行真正的备份操作
            logger.info(f"Created backup: {backup_filename}")
            return backup_filename

        except Exception as e:
            logger.error(f"Error creating backup for {tier.value} tier: {e}")
            return ""

    async def restore_from_backup(self, backup_filename: str, target_tier: StorageTier) -> bool:
        """从备份恢复"""
        try:
            backup_filepath = self.backup_path / backup_filename

            if not backup_filepath.exists():
                logger.error(f"Backup file not found: {backup_filename}")
                return False

            # 在实际系统中，这里会执行真正的恢复操作
            logger.info(f"Restored from backup: {backup_filename}")
            return True

        except Exception as e:
            logger.error(f"Error restoring from backup {backup_filename}: {e}")
            return False

    async def cleanup_old_backups(self):
        """清理过期备份"""
        try:
            now = datetime.now()
            cleaned_count = 0

            for backup_file in self.backup_path.glob("*.tar.gz"):
                # 从文件名解析时间戳
                try:
                    parts = backup_file.stem.split('_')
                    if len(parts) >= 3:
                        backup_date = datetime.strptime(parts[-1], "%Y%m%d_%H%M%S")

                        # 确定保留期限
                        tier = parts[1]
                        if tier in self.backup_schedule:
                            retention_days = self.backup_schedule[tier]["retention_days"]
                            if now - backup_date > timedelta(days=retention_days):
                                backup_file.unlink()
                                cleaned_count += 1
                except:
                    continue

            logger.info(f"Cleaned up {cleaned_count} old backup files")

        except Exception as e:
            logger.error(f"Error cleaning up old backups: {e}")

class Layer4DataPersistence:
    """第四层数据持久化主控制器"""

    def __init__(self, db_path: str = "layer4_data.db"):
        self.lifecycle_manager = DataLifecycleManager(db_path)
        self.value_engine = ValueAssessmentEngine()
        self.storage_manager = IntelligentStorageManager()
        self.backup_manager = BackupManager()

        # 后台任务
        self.background_tasks = {
            "lifecycle_processing": self._background_lifecycle_processing,
            "value_assessment": self._background_value_assessment,
            "storage_optimization": self._background_storage_optimization,
            "backup_management": self._background_backup_management
        }

    async def store_data(self, data_type: str, category: KnowledgeCategory,
                         content: Any, metadata: Dict[str, Any] = None) -> str:
        """存储数据"""
        record_id = str(uuid.uuid4())

        record = DataRecord(
            record_id=record_id,
            data_type=data_type,
            category=category,
            content=content,
            metadata=metadata or {},
            tags=set(metadata.get("tags", [])) if metadata else set()
        )

        # 存储到数据库
        success = await self.lifecycle_manager.store_record(record)
        if not success:
            raise Exception(f"Failed to store record {record_id}")

        # 计算价值分数
        value_score = self.value_engine.calculate_value_score(record)
        record.metadata["value_score"] = value_score

        # 根据价值确定存储层级
        storage_tier = self._determine_storage_tier(record, value_score)
        record.storage_tier = storage_tier

        # 存储到文件系统
        await self.storage_manager.store_to_tier(record, storage_tier)

        logger.info(f"Stored data: {record_id} ({category.value})")
        return record_id

    async def retrieve_data(self, record_id: str) -> Optional[Any]:
        """检索数据"""
        # 先从数据库获取记录信息
        record = await self.lifecycle_manager.retrieve_record(record_id)
        if not record:
            return None

        # 从文件系统检索实际数据
        stored_record = await self.storage_manager.retrieve_from_tier(record_id, record.storage_tier)
        if stored_record:
            return stored_record.content

        return None

    def _determine_storage_tier(self, record: DataRecord, value_score: float) -> StorageTier:
        """确定存储层级"""
        if value_score > 0.8:
            return StorageTier.HOT
        elif value_score > 0.6:
            return StorageTier.WARM
        elif value_score > 0.4:
            return StorageTier.COLD
        else:
            return StorageTier.ARCHIVE

    async def start_background_tasks(self):
        """启动后台任务"""
        for task_name, task_func in self.background_tasks.items():
            asyncio.create_task(self._run_background_task(task_name, task_func))

    async def _run_background_task(self, task_name: str, task_func: Callable):
        """运行后台任务"""
        while True:
            try:
                await task_func()
                # 根据任务类型调整运行间隔
                if task_name == "lifecycle_processing":
                    await asyncio.sleep(3600)  # 每小时运行一次
                elif task_name == "value_assessment":
                    await asyncio.sleep(1800)  # 每30分钟运行一次
                elif task_name == "storage_optimization":
                    await asyncio.sleep(7200)  # 每2小时运行一次
                elif task_name == "backup_management":
                    await asyncio.sleep(86400)  # 每天运行一次
                else:
                    await asyncio.sleep(3600)  # 默认每小时

            except Exception as e:
                logger.error(f"Error in background task {task_name}: {e}")
                await asyncio.sleep(300)  # 错误后等待5分钟再试

    async def _background_lifecycle_processing(self):
        """后台生命周期处理"""
        await self.lifecycle_manager.process_lifecycle_transitions()
        await self.lifecycle_manager.cleanup_deleted_records()

    async def _background_value_assessment(self):
        """后台价值评估"""
        # 获取所有活跃记录并更新价值分数
        # 在实际系统中，这里会批量处理记录
        pass

    async def _background_storage_optimization(self):
        """后台存储优化"""
        # 在实际系统中，这里会处理存储优化
        pass

    async def _background_backup_management(self):
        """后台备份管理"""
        for tier in StorageTier:
            await self.backup_manager.create_backup(tier)
        await self.backup_manager.cleanup_old_backups()

    async def get_layer_status(self) -> Dict[str, Any]:
        """获取层级状态"""
        lifecycle_stats = await self.lifecycle_manager.get_lifecycle_statistics()
        storage_stats = self.storage_manager.get_storage_statistics()

        return {
            "lifecycle_manager": lifecycle_stats,
            "storage_manager": storage_stats,
            "value_engine": {
                "value_factors": list(self.value_engine.value_factors.keys()),
                "category_importance": self.value_engine.category_importance
            },
            "backup_manager": {
                "backup_schedule": self.backup_manager.backup_schedule,
                "backup_path": str(self.backup_manager.backup_path)
            }
        }

# 使用示例
async def main():
    """主函数示例"""
    layer4 = Layer4DataPersistence()

    # 启动后台任务
    await layer4.start_background_tasks()

    # 模拟存储数据
    record_id = await layer4.store_data(
        data_type="user_behavior",
        category=KnowledgeCategory.USER_BEHAVIOR,
        content={
            "user_id": "user123",
            "actions": ["view", "like", "comment", "share"],
            "timestamps": ["2025-01-01T10:00:00", "2025-01-01T11:00:00"]
        },
        metadata={
            "tags": ["social", "engagement"],
            "user_feedback": 0.8,
            "business_impact": 0.7
        }
    )

    # 检索数据
    retrieved_data = await layer4.retrieve_data(record_id)
    print(f"Retrieved data: {retrieved_data}")

    # 获取层级状态
    status = await layer4.get_layer_status()
    print("Layer4 Status:", json.dumps(status, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    asyncio.run(main())