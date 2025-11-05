#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
客户数据存储管理器
提供完整的数据存储、检索、归档功能
"""

import os
import json
import shutil
import hashlib
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Any

class CustomerDataManager:
    """客户数据存储管理器"""

    def __init__(self, base_path: str):
        self.base_path = Path(base_path)
        self.setup_directories()
        self.load_metadata()

    def setup_directories(self):
        """设置目录结构"""
        self.raw_data_path = self.base_path / "原始数据接收区"
        self.processing_path = self.base_path / "处理中数据区"
        self.completed_path = self.base_path / "已完成数据区"
        self.archive_path = self.base_path / "数据归档区"

        for path in [self.raw_data_path, self.processing_path,
                    self.completed_path, self.archive_path]:
            path.mkdir(parents=True, exist_ok=True)

    def load_metadata(self):
        """加载元数据"""
        self.metadata_file = self.base_path / "metadata.json"
        if self.metadata_file.exists():
            with open(self.metadata_file, 'r', encoding='utf-8') as f:
                self.metadata = json.load(f)
        else:
            self.metadata = {
                "total_files": 0,
                "processing_files": 0,
                "completed_files": 0,
                "archived_files": 0,
                "files": {}
            }

    def save_metadata(self):
        """保存元数据"""
        with open(self.metadata_file, 'w', encoding='utf-8') as f:
            json.dump(self.metadata, f, ensure_ascii=False, indent=2)

    def generate_file_id(self, file_path: str) -> str:
        """生成文件唯一ID"""
        hash_md5 = hashlib.md5()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_md5.update(chunk)
        return hash_md5.hexdigest()

    def store_raw_data(self, source_file: str, customer_id: str,
                      file_type: str = "unknown") -> str:
        """存储原始数据"""
        source_path = Path(source_file)
        if not source_path.exists():
            raise FileNotFoundError(f"源文件不存在: {source_file}")

        # 生成文件ID
        file_id = self.generate_file_id(source_file)

        # 创建目标文件路径
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{customer_id}_{timestamp}_{source_path.name}"
        target_path = self.raw_data_path / filename

        # 复制文件
        shutil.copy2(source_path, target_path)

        # 更新元数据
        self.metadata["files"][file_id] = {
            "customer_id": customer_id,
            "original_name": source_path.name,
            "stored_name": filename,
            "file_type": file_type,
            "status": "raw",
            "created_at": datetime.now().isoformat(),
            "file_path": str(target_path),
            "file_size": source_path.stat().st_size
        }
        self.metadata["total_files"] += 1
        self.save_metadata()

        return file_id

    def move_to_processing(self, file_id: str, processing_config: Dict = None) -> bool:
        """移动文件到处理中区域"""
        if file_id not in self.metadata["files"]:
            return False

        file_info = self.metadata["files"][file_id]
        if file_info["status"] != "raw":
            return False

        # 移动文件
        source_path = Path(file_info["file_path"])
        target_path = self.processing_path / file_info["stored_name"]

        if source_path.exists():
            shutil.move(str(source_path), str(target_path))

            # 更新元数据
            file_info["status"] = "processing"
            file_info["file_path"] = str(target_path)
            file_info["processing_started_at"] = datetime.now().isoformat()
            file_info["processing_config"] = processing_config or {}

            self.metadata["processing_files"] += 1
            self.save_metadata()
            return True

        return False

    def move_to_completed(self, file_id: str, results: Dict = None) -> bool:
        """移动文件到已完成区域"""
        if file_id not in self.metadata["files"]:
            return False

        file_info = self.metadata["files"][file_id]
        if file_info["status"] != "processing":
            return False

        # 移动文件
        source_path = Path(file_info["file_path"])
        target_path = self.completed_path / file_info["stored_name"]

        if source_path.exists():
            shutil.move(str(source_path), str(target_path))

            # 更新元数据
            file_info["status"] = "completed"
            file_info["file_path"] = str(target_path)
            file_info["completed_at"] = datetime.now().isoformat()
            file_info["results"] = results or {}

            self.metadata["processing_files"] -= 1
            self.metadata["completed_files"] += 1
            self.save_metadata()
            return True

        return False

    def archive_file(self, file_id: str, archive_reason: str = "manual") -> bool:
        """归档文件"""
        if file_id not in self.metadata["files"]:
            return False

        file_info = self.metadata["files"][file_id]
        if file_info["status"] != "completed":
            return False

        # 创建归档目录
        archive_date = datetime.now().strftime("%Y%m")
        archive_dir = self.archive_path / archive_date
        archive_dir.mkdir(exist_ok=True)

        # 移动文件
        source_path = Path(file_info["file_path"])
        target_path = archive_dir / file_info["stored_name"]

        if source_path.exists():
            shutil.move(str(source_path), str(target_path))

            # 更新元数据
            file_info["status"] = "archived"
            file_info["file_path"] = str(target_path)
            file_info["archived_at"] = datetime.now().isoformat()
            file_info["archive_reason"] = archive_reason

            self.metadata["completed_files"] -= 1
            self.metadata["archived_files"] += 1
            self.save_metadata()
            return True

        return False

    def get_file_info(self, file_id: str) -> Optional[Dict]:
        """获取文件信息"""
        return self.metadata["files"].get(file_id)

    def list_files_by_status(self, status: str, customer_id: str = None) -> List[Dict]:
        """按状态列出文件"""
        files = []
        for file_id, file_info in self.metadata["files"].items():
            if file_info["status"] == status:
                if customer_id is None or file_info["customer_id"] == customer_id:
                    files.append({"file_id": file_id, **file_info})
        return files

    def get_storage_statistics(self) -> Dict:
        """获取存储统计信息"""
        return {
            "total_files": self.metadata["total_files"],
            "raw_files": len(self.list_files_by_status("raw")),
            "processing_files": self.metadata["processing_files"],
            "completed_files": self.metadata["completed_files"],
            "archived_files": self.metadata["archived_files"],
            "storage_size": self._calculate_storage_size()
        }

    def _calculate_storage_size(self) -> int:
        """计算存储大小"""
        total_size = 0
        for root, dirs, files in os.walk(self.base_path):
            for file in files:
                file_path = os.path.join(root, file)
                if os.path.exists(file_path):
                    total_size += os.path.getsize(file_path)
        return total_size

    def cleanup_old_files(self, days: int = 30) -> int:
        """清理旧文件"""
        cutoff_date = datetime.now() - timedelta(days=days)
        cleaned_count = 0

        for file_id, file_info in list(self.metadata["files"].items()):
            if file_info["status"] == "completed":
                completed_at = datetime.fromisoformat(file_info["completed_at"])
                if completed_at < cutoff_date:
                    if self.archive_file(file_id, "auto_cleanup"):
                        cleaned_count += 1

        return cleaned_count

    def export_metadata(self, export_path: str):
        """导出元数据"""
        with open(export_path, 'w', encoding='utf-8') as f:
            json.dump(self.metadata, f, ensure_ascii=False, indent=2)

    def import_metadata(self, import_path: str):
        """导入元数据"""
        with open(import_path, 'r', encoding='utf-8') as f:
            imported_metadata = json.load(f)

        # 合并元数据
        for file_id, file_info in imported_metadata.get("files", {}).items():
            if file_id not in self.metadata["files"]:
                self.metadata["files"][file_id] = file_info

        self.save_metadata()

# 使用示例
if __name__ == "__main__":
    # 创建数据管理器
    manager = CustomerDataManager("./客户数据存储")

    # 存储文件示例
    # file_id = manager.store_raw_data("example.xlsx", "customer_001", "excel")
    # manager.move_to_processing(file_id)
    # manager.move_to_completed(file_id, {"result": "success"})

    # 获取统计信息
    stats = manager.get_storage_statistics()
    print(f"存储统计: {stats}")