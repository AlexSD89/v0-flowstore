#!/usr/bin/env python3
"""
Agent OS四层BMAD混合智能架构 - Layer4 数据持久化层
Data Persistence Layer - 知识生命周期管理、价值评估优化、数据存储与检索

基于小红书业务场景的智能数据管理和知识持久化系统
"""

import asyncio
import json
import logging
import sqlite3
import hashlib
import pickle
import time
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
from typing import Dict, List, Optional, Any, Set, Tuple, Callable, Union
from pathlib import Path
import uuid
from collections import defaultdict, deque
import statistics
import threading
from concurrent.futures import ThreadPoolExecutor
import gzip
import shutil

logger = logging.getLogger(__name__)


class StorageType(Enum):
    """存储类型"""
    KNOWLEDGE_GRAPH = "knowledge_graph"         # 知识图谱
    LEARNING_HISTORY = "learning_history"       # 学习历史
    USER_PROFILES = "user_profiles"             # 用户配置
    CONTENT_LIBRARY = "content_library"         # 内容库
    PERFORMANCE_DATA = "performance_data"       # 性能数据
    DECISION_LOGS = "decision_logs"            # 决策日志
    SYSTEM_STATE = "system_state"               # 系统状态


class DataLifecycleStage(Enum):
    """数据生命周期阶段"""
    CREATION = "creation"                      # 创建
    ACTIVE = "active"                          # 活跃
    MATURE = "mature"                          # 成熟
    DECLINING = "declining"                    # 衰减
    ARCHIVED = "archived"                      # 归档
    DELETED = "deleted"                        # 删除


class CompressionType(Enum):
    """压缩类型"""
    NONE = "none"                              # 无压缩
    GZIP = "gzip"                              # GZIP压缩
    PICKLE = "pickle"                          # Pickle序列化
    JSON = "json"                              # JSON格式


@dataclass
class DataRecord:
    """数据记录"""
    record_id: str
    storage_type: StorageType
    data: Any
    metadata: Dict[str, Any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
    access_count: int = 0
    last_accessed: datetime = field(default_factory=datetime.now)
    lifecycle_stage: DataLifecycleStage = DataLifecycleStage.ACTIVE
    value_score: float = 1.0
    compression_type: CompressionType = CompressionType.NONE
    size_bytes: int = 0
    checksum: str = ""
    tags: Set[str] = field(default_factory=set)


@dataclass
class KnowledgeItem:
    """知识项"""
    item_id: str
    content: Dict[str, Any]
    knowledge_type: str
    domain: str
    confidence: float
    value_metrics: Dict[str, float] = field(default_factory=dict)
    relationships: Set[str] = field(default_factory=set)
    created_at: datetime = field(default_factory=datetime.now)
    last_validated: datetime = field(default_factory=datetime.now)
    validation_score: float = 1.0
    usage_count: int = 0
    feedback_score: float = 0.0


@dataclass
class BackupConfig:
    """备份配置"""
    backup_interval: timedelta
    retention_period: timedelta
    compression_enabled: bool = True
    encryption_enabled: bool = False
    backup_location: str = "./backups"
    max_backup_size: int = 1024 * 1024 * 1024  # 1GB


class DataLifecycleManager:
    """数据生命周期管理器"""

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self.logger = logging.getLogger(f"{__name__}.DataLifecycleManager")

        # 生命周期策略配置
        self.stage_transitions = {
            DataLifecycleStage.CREATION: {
                "duration": timedelta(days=1),
                "next_stage": DataLifecycleStage.ACTIVE,
                "conditions": lambda record: record.access_count > 0
            },
            DataLifecycleStage.ACTIVE: {
                "duration": timedelta(days=30),
                "next_stage": DataLifecycleStage.MATURE,
                "conditions": lambda record: record.access_count >= 5
            },
            DataLifecycleStage.MATURE: {
                "duration": timedelta(days=90),
                "next_stage": DataLifecycleStage.DECLINING,
                "conditions": lambda record: record.access_count > 0
            },
            DataLifecycleStage.DECLINING: {
                "duration": timedelta(days=30),
                "next_stage": DataLifecycleStage.ARCHIVED,
                "conditions": lambda record: record.value_score > 0.3
            },
            DataLifecycleStage.ARCHIVED: {
                "duration": timedelta(days=365),
                "next_stage": DataLifecycleStage.DELETED,
                "conditions": lambda record: record.value_score > 0.1
            }
        }

        # 生命周期事件处理器
        self.lifecycle_handlers = {
            DataLifecycleStage.ACTIVE: self._handle_active_stage,
            DataLifecycleStage.MATURE: self._handle_mature_stage,
            DataLifecycleStage.DECLINING: self._handle_declining_stage,
            DataLifecycleStage.ARCHIVED: self._handle_archived_stage,
            DataLifecycleStage.DELETED: self._handle_deleted_stage
        }

        # 启动生命周期管理任务
        asyncio.create_task(self._lifecycle_management_loop())

    async def manage_lifecycle(self, records: List[DataRecord]) -> Dict[str, List[str]]:
        """管理数据记录生命周期"""
        transitions = defaultdict(list)

        for record in records:
            current_stage = record.lifecycle_stage
            transition_info = self.stage_transitions.get(current_stage)

            if not transition_info:
                continue

            # 检查是否需要转换阶段
            should_transition = await self._should_transition_stage(record, transition_info)

            if should_transition:
                next_stage = transition_info["next_stage"]
                old_stage = record.lifecycle_stage

                # 执行阶段转换
                await self._transition_stage(record, next_stage)

                transitions[next_stage.value].append(record.record_id)
                self.logger.info(f"Record {record.record_id} transitioned: {old_stage.value} -> {next_stage.value}")

        return dict(transitions)

    async def _should_transition_stage(self, record: DataRecord, transition_info: Dict[str, Any]) -> bool:
        """判断是否应该转换阶段"""
        # 检查时间条件
        stage_duration = transition_info["duration"]
        time_in_stage = datetime.now() - record.updated_at

        if time_in_stage < stage_duration:
            return False

        # 检查条件
        conditions_met = transition_info["conditions"](record)

        # 检查值分数
        value_threshold = self._get_value_threshold(record.lifecycle_stage)
        value_sufficient = record.value_score >= value_threshold

        return conditions_met and value_sufficient

    async def _transition_stage(self, record: DataRecord, new_stage: DataLifecycleStage):
        """执行阶段转换"""
        old_stage = record.lifecycle_stage
        record.lifecycle_stage = new_stage
        record.updated_at = datetime.now()

        # 调用阶段处理器
        handler = self.lifecycle_handlers.get(new_stage)
        if handler:
            await handler(record, old_stage)

    async def _handle_active_stage(self, record: DataRecord, old_stage: DataLifecycleStage):
        """处理活跃阶段"""
        # 优化存储位置，确保快速访问
        pass

    async def _handle_mature_stage(self, record: DataRecord, old_stage: DataLifecycleStage):
        """处理成熟阶段"""
        # 可能需要压缩存储
        if record.size_bytes > 1024 * 1024:  # 1MB
            record.compression_type = CompressionType.GZIP

    async def _handle_declining_stage(self, record: DataRecord, old_stage: DataLifecycleStage):
        """处理衰减阶段"""
        # 考虑压缩或归档
        if record.compression_type == CompressionType.NONE:
            record.compression_type = CompressionType.GZIP

    async def _handle_archived_stage(self, record: DataRecord, old_stage: DataLifecycleStage):
        """处理归档阶段"""
        # 强制压缩
        record.compression_type = CompressionType.GZIP

    async def _handle_deleted_stage(self, record: DataRecord, old_stage: DataLifecycleStage):
        """处理删除阶段"""
        # 准备删除，可以在这里执行清理操作
        self.logger.info(f"Record {record.record_id} marked for deletion")

    def _get_value_threshold(self, stage: DataLifecycleStage) -> float:
        """获取阶段值阈值"""
        thresholds = {
            DataLifecycleStage.CREATION: 0.1,
            DataLifecycleStage.ACTIVE: 0.3,
            DataLifecycleStage.MATURE: 0.5,
            DataLifecycleStage.DECLINING: 0.3,
            DataLifecycleStage.ARCHIVED: 0.1,
            DataLifecycleStage.DELETED: 0.0
        }
        return thresholds.get(stage, 0.0)

    async def _lifecycle_management_loop(self):
        """生命周期管理循环"""
        while True:
            try:
                await asyncio.sleep(3600)  # 每小时检查一次

                # 这里应该获取所有记录并管理生命周期
                # 简化实现，实际应该从数据库获取
                self.logger.debug("Running lifecycle management check")

            except Exception as e:
                self.logger.error(f"Lifecycle management error: {e}")


class ValueAssessmentEngine:
    """价值评估引擎"""

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self.logger = logging.getLogger(f"{__name__}.ValueAssessmentEngine")

        # 价值评估因子权重
        self.value_factors = {
            "usage_frequency": 0.3,      # 使用频率
            "recency": 0.2,              # 近期性
            "feedback_score": 0.25,      # 反馈分数
            "business_impact": 0.15,     # 业务影响
            "knowledge_connections": 0.1   # 知识连接度
        }

        # 价值衰减配置
        self.decay_rate = 0.1  # 每月衰减率
        self.boost_factor = 1.5  # 使用时提升因子

    async def assess_value(self, record: DataRecord, context: Optional[Dict[str, Any]] = None) -> float:
        """评估数据记录价值"""
        scores = {}

        # 使用频率评估
        scores["usage_frequency"] = await self._assess_usage_frequency(record)

        # 近期性评估
        scores["recency"] = await self._assess_recency(record)

        # 反馈分数评估
        scores["feedback_score"] = await self._assess_feedback_score(record)

        # 业务影响评估
        scores["business_impact"] = await self._assess_business_impact(record, context)

        # 知识连接度评估
        scores["knowledge_connections"] = await self._assess_knowledge_connections(record)

        # 计算综合价值分数
        total_score = sum(
            scores[factor] * weight
            for factor, weight in self.value_factors.items()
        )

        # 应用时间衰减
        decay_factor = await self._calculate_decay_factor(record)
        final_score = total_score * decay_factor

        return min(1.0, max(0.0, final_score))

    async def _assess_usage_frequency(self, record: DataRecord) -> float:
        """评估使用频率"""
        days_since_creation = (datetime.now() - record.created_at).days
        if days_since_creation == 0:
            return 1.0

        daily_usage = record.access_count / max(1, days_since_creation)

        # 标准化到0-1范围
        return min(1.0, daily_usage / 10.0)  # 假设每天10次使用为满分

    async def _assess_recency(self, record: DataRecord) -> float:
        """评估近期性"""
        days_since_access = (datetime.now() - record.last_accessed).days

        # 近期访问得分：最近7天内有访问得分较高
        if days_since_access <= 1:
            return 1.0
        elif days_since_access <= 7:
            return 0.8
        elif days_since_access <= 30:
            return 0.5
        else:
            return max(0.0, 1.0 - days_since_access / 90.0)

    async def _assess_feedback_score(self, record: DataRecord) -> float:
        """评估反馈分数"""
        feedback_score = record.metadata.get("feedback_score", 0.0)
        return max(0.0, min(1.0, feedback_score))

    async def _assess_business_impact(self, record: DataRecord, context: Optional[Dict[str, Any]]) -> float:
        """评估业务影响"""
        impact_score = record.metadata.get("business_impact", 0.5)

        # 根据存储类型调整影响分数
        type_impacts = {
            StorageType.KNOWLEDGE_GRAPH: 0.8,
            StorageType.LEARNING_HISTORY: 0.6,
            StorageType.USER_PROFILES: 0.7,
            StorageType.CONTENT_LIBRARY: 0.9,
            StorageType.PERFORMANCE_DATA: 0.7,
            StorageType.DECISION_LOGS: 0.5,
            StorageType.SYSTEM_STATE: 0.4
        }

        type_factor = type_impacts.get(record.storage_type, 0.5)
        return impact_score * type_factor

    async def _assess_knowledge_connections(self, record: DataRecord) -> float:
        """评估知识连接度"""
        connections = record.metadata.get("connections", 0)
        return min(1.0, connections / 20.0)  # 假设20个连接为满分

    async def _calculate_decay_factor(self, record: DataRecord) -> float:
        """计算衰减因子"""
        days_since_update = (datetime.now() - record.updated_at).days
        monthly_decay = days_since_update / 30.0
        return max(0.1, 1.0 - (monthly_decay * self.decay_rate))

    async def update_value_on_access(self, record: DataRecord):
        """基于访问更新价值"""
        # 提升价值分数
        record.value_score = min(1.0, record.value_score * self.boost_factor)
        record.access_count += 1
        record.last_accessed = datetime.now()


class IntelligentStorageManager:
    """智能存储管理器"""

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self.logger = logging.getLogger(f"{__name__}.IntelligentStorageManager")

        # 存储配置
        self.storage_paths = {
            "primary": "./data/primary",
            "archive": "./data/archive",
            "cache": "./data/cache",
            "backup": "./data/backup"
        }

        # 确保目录存在
        for path in self.storage_paths.values():
            Path(path).mkdir(parents=True, exist_ok=True)

        # 存储策略
        self.storage_strategies = {
            DataLifecycleStage.CREATION: "cache",
            DataLifecycleStage.ACTIVE: "primary",
            DataLifecycleStage.MATURE: "primary",
            DataLifecycleStage.DECLINING: "archive",
            DataLifecycleStage.ARCHIVED: "archive",
            DataLifecycleStage.DELETED: "trash"
        }

        # 初始化数据库
        self._init_database()

        # 压缩和序列化处理器
        self.compressors = {
            CompressionType.GZIP: self._compress_gzip,
            CompressionType.NONE: lambda x: x
        }

        self.serializers = {
            CompressionType.PICKLE: self._serialize_pickle,
            CompressionType.JSON: self._serialize_json,
            CompressionType.NONE: lambda x: x
        }

    def _init_database(self):
        """初始化数据库"""
        self.db_path = Path(self.storage_paths["primary"]) / "agent_os.db"

        conn = sqlite3.connect(str(self.db_path))
        cursor = conn.cursor()

        # 创建数据记录表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS data_records (
                record_id TEXT PRIMARY KEY,
                storage_type TEXT NOT NULL,
                metadata TEXT,
                created_at TEXT,
                updated_at TEXT,
                access_count INTEGER,
                last_accessed TEXT,
                lifecycle_stage TEXT,
                value_score REAL,
                compression_type TEXT,
                size_bytes INTEGER,
                checksum TEXT,
                file_path TEXT
            )
        ''')

        # 创建知识项表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS knowledge_items (
                item_id TEXT PRIMARY KEY,
                content TEXT,
                knowledge_type TEXT,
                domain TEXT,
                confidence REAL,
                value_metrics TEXT,
                relationships TEXT,
                created_at TEXT,
                last_validated TEXT,
                validation_score REAL,
                usage_count INTEGER,
                feedback_score REAL
            )
        ''')

        conn.commit()
        conn.close()

    async def store_record(self, record: DataRecord) -> bool:
        """存储数据记录"""
        try:
            # 序列化和压缩数据
            serialized_data = await self._serialize_data(record.data, record.compression_type)

            # 计算校验和
            record.checksum = self._calculate_checksum(serialized_data)
            record.size_bytes = len(serialized_data)

            # 确定存储路径
            storage_strategy = self.storage_strategies.get(record.lifecycle_stage, "primary")
            base_path = self.storage_paths[storage_strategy]
            file_path = Path(base_path) / f"{record.record_id}.dat"

            # 写入文件
            with open(file_path, 'wb') as f:
                f.write(serialized_data)

            # 更新记录元数据
            record.metadata["file_path"] = str(file_path)

            # 保存到数据库
            await self._save_record_to_db(record)

            self.logger.info(f"Stored record: {record.record_id} ({record.size_bytes} bytes)")
            return True

        except Exception as e:
            self.logger.error(f"Failed to store record {record.record_id}: {e}")
            return False

    async def retrieve_record(self, record_id: str) -> Optional[DataRecord]:
        """检索数据记录"""
        try:
            # 从数据库获取记录元数据
            record = await self._get_record_from_db(record_id)
            if not record:
                return None

            # 读取文件数据
            file_path = record.metadata.get("file_path")
            if not file_path or not Path(file_path).exists():
                self.logger.error(f"Data file not found: {file_path}")
                return None

            with open(file_path, 'rb') as f:
                compressed_data = f.read()

            # 验证校验和
            current_checksum = self._calculate_checksum(compressed_data)
            if current_checksum != record.checksum:
                self.logger.warning(f"Checksum mismatch for record {record_id}")
                return None

            # 解压缩和反序列化
            data = await self._deserialize_data(compressed_data, record.compression_type)
            record.data = data

            # 更新访问信息
            record.access_count += 1
            record.last_accessed = datetime.now()
            await self._update_record_access(record)

            return record

        except Exception as e:
            self.logger.error(f"Failed to retrieve record {record_id}: {e}")
            return None

    async def store_knowledge_item(self, item: KnowledgeItem) -> bool:
        """存储知识项"""
        try:
            conn = sqlite3.connect(str(self.db_path))
            cursor = conn.cursor()

            cursor.execute('''
                INSERT OR REPLACE INTO knowledge_items
                (item_id, content, knowledge_type, domain, confidence, value_metrics,
                 relationships, created_at, last_validated, validation_score,
                 usage_count, feedback_score)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                item.item_id,
                json.dumps(item.content),
                item.knowledge_type,
                item.domain,
                item.confidence,
                json.dumps(item.value_metrics),
                json.dumps(list(item.relationships)),
                item.created_at.isoformat(),
                item.last_validated.isoformat(),
                item.validation_score,
                item.usage_count,
                item.feedback_score
            ))

            conn.commit()
            conn.close()

            self.logger.info(f"Stored knowledge item: {item.item_id}")
            return True

        except Exception as e:
            self.logger.error(f"Failed to store knowledge item {item.item_id}: {e}")
            return False

    async def retrieve_knowledge_items(self, domain: Optional[str] = None,
                                     knowledge_type: Optional[str] = None,
                                     limit: int = 100) -> List[KnowledgeItem]:
        """检索知识项"""
        try:
            conn = sqlite3.connect(str(self.db_path))
            cursor = conn.cursor()

            query = "SELECT * FROM knowledge_items WHERE 1=1"
            params = []

            if domain:
                query += " AND domain = ?"
                params.append(domain)

            if knowledge_type:
                query += " AND knowledge_type = ?"
                params.append(knowledge_type)

            query += " ORDER BY validation_score DESC, usage_count DESC LIMIT ?"
            params.append(limit)

            cursor.execute(query, params)
            rows = cursor.fetchall()
            conn.close()

            items = []
            for row in rows:
                item = KnowledgeItem(
                    item_id=row[0],
                    content=json.loads(row[1]),
                    knowledge_type=row[2],
                    domain=row[3],
                    confidence=row[4],
                    value_metrics=json.loads(row[5]),
                    relationships=set(json.loads(row[6])),
                    created_at=datetime.fromisoformat(row[7]),
                    last_validated=datetime.fromisoformat(row[8]),
                    validation_score=row[9],
                    usage_count=row[10],
                    feedback_score=row[11]
                )
                items.append(item)

            return items

        except Exception as e:
            self.logger.error(f"Failed to retrieve knowledge items: {e}")
            return []

    async def optimize_storage(self) -> Dict[str, Any]:
        """优化存储"""
        optimization_results = {
            "compressed_files": 0,
            "archived_files": 0,
            "deleted_files": 0,
            "space_saved": 0
        }

        try:
            # 获取所有记录
            records = await self._get_all_records()

            for record in records:
                # 检查是否需要压缩
                if (record.compression_type == CompressionType.NONE and
                    record.size_bytes > 1024 * 100):  # 100KB
                    await self._compress_existing_record(record)
                    optimization_results["compressed_files"] += 1

                # 检查是否需要归档
                if record.lifecycle_stage in [DataLifecycleStage.DECLINING, DataLifecycleStage.ARCHIVED]:
                    old_path = record.metadata.get("file_path")
                    if old_path and old_path.startswith(self.storage_paths["primary"]):
                        new_path = await self._archive_record(record)
                        if new_path:
                            optimization_results["archived_files"] += 1

                # 检查是否需要删除
                if record.lifecycle_stage == DataLifecycleStage.DELETED:
                    if await self._delete_record(record):
                        optimization_results["deleted_files"] += 1

        except Exception as e:
            self.logger.error(f"Storage optimization error: {e}")

        return optimization_results

    async def _serialize_data(self, data: Any, compression_type: CompressionType) -> bytes:
        """序列化数据"""
        # 首先序列化
        serializer = self.serializers.get(compression_type, self.serializers[CompressionType.JSON])
        serialized = serializer(data)

        # 然后压缩
        compressor = self.compressors.get(compression_type, self.compressors[CompressionType.NONE])
        return compressor(serialized)

    async def _deserialize_data(self, data: bytes, compression_type: CompressionType) -> Any:
        """反序列化数据"""
        # 首先解压缩
        if compression_type == CompressionType.GZIP:
            decompressed = gzip.decompress(data)
        else:
            decompressed = data

        # 然后反序列化
        if compression_type == CompressionType.PICKLE:
            return pickle.loads(decompressed)
        elif compression_type == CompressionType.JSON:
            return json.loads(decompressed.decode('utf-8'))
        else:
            return decompressed

    def _serialize_pickle(self, data: Any) -> bytes:
        """Pickle序列化"""
        return pickle.dumps(data)

    def _serialize_json(self, data: Any) -> bytes:
        """JSON序列化"""
        return json.dumps(data, ensure_ascii=False).encode('utf-8')

    def _compress_gzip(self, data: bytes) -> bytes:
        """GZIP压缩"""
        return gzip.compress(data)

    def _calculate_checksum(self, data: bytes) -> str:
        """计算校验和"""
        return hashlib.sha256(data).hexdigest()

    async def _save_record_to_db(self, record: DataRecord):
        """保存记录到数据库"""
        conn = sqlite3.connect(str(self.db_path))
        cursor = conn.cursor()

        cursor.execute('''
            INSERT OR REPLACE INTO data_records
            (record_id, storage_type, metadata, created_at, updated_at,
             access_count, last_accessed, lifecycle_stage, value_score,
             compression_type, size_bytes, checksum, file_path)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            record.record_id,
            record.storage_type.value,
            json.dumps(record.metadata),
            record.created_at.isoformat(),
            record.updated_at.isoformat(),
            record.access_count,
            record.last_accessed.isoformat(),
            record.lifecycle_stage.value,
            record.value_score,
            record.compression_type.value,
            record.size_bytes,
            record.checksum,
            record.metadata.get("file_path", "")
        ))

        conn.commit()
        conn.close()

    async def _get_record_from_db(self, record_id: str) -> Optional[DataRecord]:
        """从数据库获取记录"""
        conn = sqlite3.connect(str(self.db_path))
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM data_records WHERE record_id = ?", (record_id,))
        row = cursor.fetchone()
        conn.close()

        if not row:
            return None

        return DataRecord(
            record_id=row[0],
            storage_type=StorageType(row[1]),
            data=None,  # 将在检索时加载
            metadata=json.loads(row[2]),
            created_at=datetime.fromisoformat(row[3]),
            updated_at=datetime.fromisoformat(row[4]),
            access_count=row[5],
            last_accessed=datetime.fromisoformat(row[6]),
            lifecycle_stage=DataLifecycleStage(row[7]),
            value_score=row[8],
            compression_type=CompressionType(row[9]),
            size_bytes=row[10],
            checksum=row[11]
        )

    async def _update_record_access(self, record: DataRecord):
        """更新记录访问信息"""
        conn = sqlite3.connect(str(self.db_path))
        cursor = conn.cursor()

        cursor.execute('''
            UPDATE data_records
            SET access_count = ?, last_accessed = ?, updated_at = ?
            WHERE record_id = ?
        ''', (
            record.access_count,
            record.last_accessed.isoformat(),
            datetime.now().isoformat(),
            record.record_id
        ))

        conn.commit()
        conn.close()

    async def _get_all_records(self) -> List[DataRecord]:
        """获取所有记录"""
        conn = sqlite3.connect(str(self.db_path))
        cursor = conn.cursor()

        cursor.execute("SELECT record_id FROM data_records")
        rows = cursor.fetchall()
        conn.close()

        records = []
        for (record_id,) in rows:
            record = await self._get_record_from_db(record_id)
            if record:
                records.append(record)

        return records

    async def _compress_existing_record(self, record: DataRecord):
        """压缩现有记录"""
        old_path = record.metadata.get("file_path")
        if not old_path or not Path(old_path).exists():
            return

        # 读取原始数据
        with open(old_path, 'rb') as f:
            original_data = f.read()

        # 压缩数据
        compressed_data = gzip.compress(original_data)

        # 写入压缩文件
        with open(old_path, 'wb') as f:
            f.write(compressed_data)

        # 更新记录
        record.compression_type = CompressionType.GZIP
        record.size_bytes = len(compressed_data)
        record.checksum = self._calculate_checksum(compressed_data)
        await self._save_record_to_db(record)

    async def _archive_record(self, record: DataRecord) -> Optional[str]:
        """归档记录"""
        old_path = record.metadata.get("file_path")
        if not old_path or not Path(old_path).exists():
            return None

        # 创建归档路径
        archive_path = Path(self.storage_paths["archive"]) / Path(old_path).name

        # 移动文件
        shutil.move(old_path, archive_path)

        # 更新记录
        record.metadata["file_path"] = str(archive_path)
        await self._save_record_to_db(record)

        return str(archive_path)

    async def _delete_record(self, record: DataRecord) -> bool:
        """删除记录"""
        try:
            # 删除文件
            file_path = record.metadata.get("file_path")
            if file_path and Path(file_path).exists():
                Path(file_path).unlink()

            # 从数据库删除
            conn = sqlite3.connect(str(self.db_path))
            cursor = conn.cursor()
            cursor.execute("DELETE FROM data_records WHERE record_id = ?", (record.record_id,))
            conn.commit()
            conn.close()

            return True

        except Exception as e:
            self.logger.error(f"Failed to delete record {record.record_id}: {e}")
            return False


class BackupManager:
    """备份管理器"""

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self.logger = logging.getLogger(f"{__name__}.BackupManager")

        # 备份配置
        self.backup_config = BackupConfig(
            backup_interval=timedelta(hours=6),
            retention_period=timedelta(days=30),
            compression_enabled=True,
            backup_location="./backups",
            max_backup_size=1024 * 1024 * 1024  # 1GB
        )

        # 确保备份目录存在
        Path(self.backup_config.backup_location).mkdir(parents=True, exist_ok=True)

        # 启动定期备份任务
        asyncio.create_task(self._backup_loop())

    async def create_backup(self, backup_name: Optional[str] = None) -> str:
        """创建备份"""
        if not backup_name:
            backup_name = f"backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

        backup_path = Path(self.backup_config.backup_location) / f"{backup_name}.tar.gz"

        try:
            # 创建备份
            import tarfile

            with tarfile.open(backup_path, "w:gz") as tar:
                # 添加数据库
                db_path = Path("./data/primary/agent_os.db")
                if db_path.exists():
                    tar.add(db_path, arcname="agent_os.db")

                # 添加数据目录
                data_path = Path("./data")
                for file_path in data_path.rglob("*"):
                    if file_path.is_file() and not file_path.name.endswith('.tmp'):
                        arcname = str(file_path.relative_to(data_path.parent))
                        tar.add(file_path, arcname=arcname)

            self.logger.info(f"Backup created: {backup_path}")
            return str(backup_path)

        except Exception as e:
            self.logger.error(f"Backup creation failed: {e}")
            raise

    async def restore_backup(self, backup_path: str) -> bool:
        """恢复备份"""
        try:
            import tarfile

            # 备份当前数据
            await self._create_emergency_backup()

            # 解压备份
            with tarfile.open(backup_path, "r:gz") as tar:
                tar.extractall(path="./")

            self.logger.info(f"Backup restored from: {backup_path}")
            return True

        except Exception as e:
            self.logger.error(f"Backup restoration failed: {e}")
            return False

    async def cleanup_old_backups(self):
        """清理旧备份"""
        try:
            backup_dir = Path(self.backup_config.backup_location)
            cutoff_time = datetime.now() - self.backup_config.retention_period

            removed_count = 0
            for backup_file in backup_dir.glob("backup_*.tar.gz"):
                # 从文件名提取时间
                try:
                    time_str = backup_file.stem.split("_", 1)[1]  # 提取时间部分
                    backup_time = datetime.strptime(time_str, "%Y%m%d_%H%M%S")

                    if backup_time < cutoff_time:
                        backup_file.unlink()
                        removed_count += 1
                        self.logger.info(f"Removed old backup: {backup_file}")
                except:
                    # 如果无法解析时间，跳过
                    continue

            self.logger.info(f"Cleanup completed. Removed {removed_count} old backups.")

        except Exception as e:
            self.logger.error(f"Backup cleanup error: {e}")

    async def _backup_loop(self):
        """定期备份循环"""
        while True:
            try:
                await asyncio.sleep(self.backup_config.backup_interval.total_seconds())

                # 创建备份
                await self.create_backup()

                # 清理旧备份
                await self.cleanup_old_backups()

            except Exception as e:
                self.logger.error(f"Backup loop error: {e}")

    async def _create_emergency_backup(self):
        """创建紧急备份"""
        emergency_name = f"emergency_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        await self.create_backup(emergency_name)


class DataPersistenceLayer:
    """数据持久化层主控制器"""

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self.logger = logging.getLogger(f"{__name__}.DataPersistenceLayer")

        # 初始化组件
        self.lifecycle_manager = DataLifecycleManager(config)
        self.value_assessor = ValueAssessmentEngine(config)
        self.storage_manager = IntelligentStorageManager(config)
        self.backup_manager = BackupManager(config)

        # 性能指标
        self.persistence_metrics = {
            "total_records": 0,
            "total_knowledge_items": 0,
            "storage_used_bytes": 0,
            "compression_ratio": 0.0,
            "average_access_time": 0.0,
            "backup_success_rate": 1.0
        }

        # 启动维护任务
        asyncio.create_task(self._maintenance_loop())

    async def store_data(self, storage_type: StorageType, data: Any,
                        metadata: Optional[Dict[str, Any]] = None) -> str:
        """存储数据"""
        record_id = f"record_{uuid.uuid4().hex[:8]}"

        record = DataRecord(
            record_id=record_id,
            storage_type=storage_type,
            data=data,
            metadata=metadata or {},
            value_score=await self.value_assessor.assess_value(DataRecord(record_id, storage_type, data, metadata or {}))
        )

        success = await self.storage_manager.store_record(record)
        if success:
            self.persistence_metrics["total_records"] += 1
            self.persistence_metrics["storage_used_bytes"] += record.size_bytes

        return record_id if success else ""

    async def retrieve_data(self, record_id: str) -> Optional[Any]:
        """检索数据"""
        start_time = time.time()

        record = await self.storage_manager.retrieve_record(record_id)
        if record:
            # 更新价值评估
            await self.value_assessor.update_value_on_access(record)

            # 更新性能指标
            access_time = time.time() - start_time
            total = self.persistence_metrics.get("access_count", 0)
            current_avg = self.persistence_metrics.get("average_access_time", 0.0)
            self.persistence_metrics["average_access_time"] = (
                (current_avg * total + access_time) / (total + 1)
            )
            self.persistence_metrics["access_count"] = total + 1

            return record.data

        return None

    async def store_knowledge(self, content: Dict[str, Any], knowledge_type: str,
                           domain: str, confidence: float = 1.0) -> str:
        """存储知识"""
        item_id = f"knowledge_{uuid.uuid4().hex[:8]}"

        item = KnowledgeItem(
            item_id=item_id,
            content=content,
            knowledge_type=knowledge_type,
            domain=domain,
            confidence=confidence
        )

        success = await self.storage_manager.store_knowledge_item(item)
        if success:
            self.persistence_metrics["total_knowledge_items"] += 1

        return item_id if success else ""

    async def retrieve_knowledge(self, domain: Optional[str] = None,
                               knowledge_type: Optional[str] = None,
                               limit: int = 50) -> List[Dict[str, Any]]:
        """检索知识"""
        items = await self.storage_manager.retrieve_knowledge_items(domain, knowledge_type, limit)

        return [
            {
                "item_id": item.item_id,
                "content": item.content,
                "knowledge_type": item.knowledge_type,
                "domain": item.domain,
                "confidence": item.confidence,
                "validation_score": item.validation_score,
                "usage_count": item.usage_count
            }
            for item in items
        ]

    async def search_data(self, query: str, storage_types: Optional[List[StorageType]] = None,
                         limit: int = 100) -> List[Dict[str, Any]]:
        """搜索数据"""
        # 简化的搜索实现
        results = []

        # 从数据库搜索元数据
        conn = sqlite3.connect(str(self.storage_manager.db_path))
        cursor = conn.cursor()

        query_sql = "SELECT record_id, storage_type, metadata FROM data_records"
        params = []

        if storage_types:
            placeholders = ",".join(["?" for _ in storage_types])
            query_sql += f" WHERE storage_type IN ({placeholders})"
            params.extend([st.value for st in storage_types])

        query_sql += " LIMIT ?"
        params.append(limit)

        cursor.execute(query_sql, params)
        rows = cursor.fetchall()
        conn.close()

        for record_id, storage_type, metadata_json in rows:
            metadata = json.loads(metadata_json)

            # 简单的文本匹配
            content_match = query.lower() in json.dumps(metadata).lower()

            if content_match:
                results.append({
                    "record_id": record_id,
                    "storage_type": storage_type,
                    "metadata": metadata
                })

        return results

    async def optimize_storage(self) -> Dict[str, Any]:
        """优化存储"""
        optimization_results = await self.storage_manager.optimize_storage()

        # 更新压缩比
        self.persistence_metrics["compression_ratio"] = await self._calculate_compression_ratio()

        return optimization_results

    async def create_backup(self, backup_name: Optional[str] = None) -> str:
        """创建备份"""
        try:
            backup_path = await self.backup_manager.create_backup(backup_name)
            return backup_path
        except Exception as e:
            self.logger.error(f"Backup creation failed: {e}")
            return ""

    async def get_storage_statistics(self) -> Dict[str, Any]:
        """获取存储统计信息"""
        # 获取数据库大小
        db_size = Path(self.storage_manager.db_path).stat().st_size

        # 获取数据目录大小
        data_size = 0
        data_path = Path("./data")
        for file_path in data_path.rglob("*"):
            if file_path.is_file():
                data_size += file_path.stat().st_size

        return {
            "total_records": self.persistence_metrics["total_records"],
            "total_knowledge_items": self.persistence_metrics["total_knowledge_items"],
            "database_size_bytes": db_size,
            "data_directory_size_bytes": data_size,
            "total_storage_bytes": self.persistence_metrics["storage_used_bytes"],
            "compression_ratio": self.persistence_metrics["compression_ratio"],
            "average_access_time": self.persistence_metrics["average_access_time"],
            "backup_success_rate": self.persistence_metrics["backup_success_rate"]
        }

    async def _calculate_compression_ratio(self) -> float:
        """计算压缩比"""
        try:
            conn = sqlite3.connect(str(self.storage_manager.db_path))
            cursor = conn.cursor()

            cursor.execute('''
                SELECT AVG(CAST(size_bytes AS REAL) /
                           (SELECT AVG(size_bytes) FROM data_records WHERE compression_type = 'none'))
                FROM data_records WHERE compression_type != 'none'
            ''')

            result = cursor.fetchone()
            conn.close()

            if result and result[0]:
                return 1.0 - result[0]  # 压缩节省的比例
            return 0.0

        except Exception as e:
            self.logger.error(f"Compression ratio calculation error: {e}")
            return 0.0

    async def _maintenance_loop(self):
        """维护循环"""
        while True:
            try:
                await asyncio.sleep(3600)  # 每小时执行一次维护

                # 优化存储
                await self.optimize_storage()

                # 更新统计信息
                await self._update_statistics()

            except Exception as e:
                self.logger.error(f"Maintenance loop error: {e}")

    async def _update_statistics(self):
        """更新统计信息"""
        # 更新存储使用量
        data_path = Path("./data")
        total_size = 0
        for file_path in data_path.rglob("*"):
            if file_path.is_file():
                total_size += file_path.stat().st_size

        self.persistence_metrics["storage_used_bytes"] = total_size

    async def get_layer_status(self) -> Dict[str, Any]:
        """获取层状态信息"""
        return {
            "layer_name": "layer4_data_persistence",
            "components": {
                "lifecycle_manager": {
                    "stage_transitions": len(self.lifecycle_manager.stage_transitions),
                    "lifecycle_handlers": len(self.lifecycle_manager.lifecycle_handlers)
                },
                "value_assessor": {
                    "value_factors": len(self.value_assessor.value_factors),
                    "decay_rate": self.value_assessor.decay_rate
                },
                "storage_manager": {
                    "storage_paths": len(self.storage_manager.storage_paths),
                    "compression_types": len(self.storage_manager.compressors)
                },
                "backup_manager": {
                    "backup_interval": str(self.backup_manager.backup_config.backup_interval),
                    "retention_period": str(self.backup_manager.backup_config.retention_period)
                }
            },
            "persistence_metrics": self.persistence_metrics.copy(),
            "storage_statistics": await self.get_storage_statistics()
        }


# 工厂函数和便利接口
async def create_data_persistence_layer(config: Optional[Dict[str, Any]] = None) -> DataPersistenceLayer:
    """创建数据持久化层实例"""
    return DataPersistenceLayer(config)


if __name__ == "__main__":
    # 示例用法和测试
    async def main():
        config = {
            "backup_interval_hours": 6,
            "retention_days": 30,
            "compression_enabled": True
        }

        layer = await create_data_persistence_layer(config)

        # 测试数据存储
        test_data = {
            "title": "小红书AI工具评测",
            "content": "这是一篇关于AI工具的详细评测内容...",
            "tags": ["AI", "工具", "评测"],
            "quality_score": 0.85
        }

        record_id = await layer.store_data(
            StorageType.CONTENT_LIBRARY,
            test_data,
            {"author": "AI系统", "version": "1.0"}
        )

        print(f"Stored data with ID: {record_id}")

        # 测试数据检索
        retrieved_data = await layer.retrieve_data(record_id)
        if retrieved_data:
            print(f"Retrieved data: {retrieved_data['title']}")

        # 测试知识存储
        knowledge_id = await layer.store_knowledge(
            {"content": "AI工具可以提高工作效率", "evidence": ["案例1", "案例2"]},
            "procedural_knowledge",
            "productivity",
            0.9
        )

        print(f"Stored knowledge with ID: {knowledge_id}")

        # 获取层状态
        status = await layer.get_layer_status()
        print("\nLayer Status:", json.dumps(status, indent=2, ensure_ascii=False))

        # 获取存储统计
        stats = await layer.get_storage_statistics()
        print("\nStorage Statistics:", json.dumps(stats, indent=2, ensure_ascii=False))

    asyncio.run(main())