#!/usr/bin/env python3
"""
PocketCorn v4.1 BMAD - 临时文件自动管理系统
自动管理工作流程中产生的临时文件，完成后自动清理
"""

import os
import json
import shutil
from datetime import datetime, timedelta
from pathlib import Path
import re

class TempFileManager:
    def __init__(self, base_dir=None):
        if base_dir is None:
            self.base_dir = Path(__file__).parent
        else:
            self.base_dir = Path(base_dir)
        
        # 临时文件存储目录
        self.temp_dir = self.base_dir / ".temp_files"
        self.temp_dir.mkdir(exist_ok=True)
        
        # 工作会话目录 - 按时间戳命名
        self.session_id = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.session_dir = self.temp_dir / f"session_{self.session_id}"
        self.session_dir.mkdir(exist_ok=True)
        
        # 记录文件
        self.session_log = self.session_dir / "session_log.json"
        
        # 临时文件模式（正则表达式）
        self.temp_patterns = [
            r".*_temp_.*\.py$",
            r".*_test_.*\.py$", 
            r".*_validation.*\.py$",
            r".*_demo.*\.py$",
            r".*_analysis.*\.py$",
            r"corrected_.*\.py$",
            r"enhanced_.*\.py$",
            r"simple_.*\.py$",
            r".*_backup_\d+.*",
            r".*\.tmp$",
            r".*\.cache$",
            r".*_\d{8}_\d{6}\..*$",  # 时间戳文件
        ]
        
        self.initialize_session()
    
    def initialize_session(self):
        """初始化工作会话"""
        session_info = {
            "session_id": self.session_id,
            "start_time": datetime.now().isoformat(),
            "temp_files_created": [],
            "permanent_files_created": [],
            "status": "active"
        }
        
        with open(self.session_log, 'w', encoding='utf-8') as f:
            json.dump(session_info, f, indent=2, ensure_ascii=False)
        
        print(f"🔄 临时文件管理会话已启动: {self.session_id}")
        print(f"📁 临时目录: {self.session_dir}")
    
    def is_temp_file(self, file_path):
        """判断是否为临时文件"""
        file_name = os.path.basename(file_path)
        
        for pattern in self.temp_patterns:
            if re.match(pattern, file_name, re.IGNORECASE):
                return True
        
        # 检查文件内容是否包含临时标识
        try:
            if file_path.endswith(('.py', '.md', '.json')):
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read(1000)  # 只读前1000字符
                    if any(marker in content.lower() for marker in 
                          ['临时文件', 'temp file', 'temporary', 'test only', 'demo only']):
                        return True
        except:
            pass
        
        return False
    
    def move_to_temp(self, file_path):
        """移动文件到临时目录"""
        if not os.path.exists(file_path):
            return False
        
        source_path = Path(file_path)
        temp_file_path = self.session_dir / source_path.name
        
        # 如果目标文件已存在，添加序号
        counter = 1
        original_temp_path = temp_file_path
        while temp_file_path.exists():
            stem = original_temp_path.stem
            suffix = original_temp_path.suffix
            temp_file_path = self.session_dir / f"{stem}_{counter}{suffix}"
            counter += 1
        
        try:
            shutil.move(str(source_path), str(temp_file_path))
            self.log_temp_file(str(temp_file_path))
            print(f"📦 临时文件已移动: {source_path.name} -> {temp_file_path}")
            return True
        except Exception as e:
            print(f"❌ 移动临时文件失败: {e}")
            return False
    
    def log_temp_file(self, file_path):
        """记录临时文件"""
        with open(self.session_log, 'r', encoding='utf-8') as f:
            session_info = json.load(f)
        
        session_info["temp_files_created"].append({
            "path": file_path,
            "created_at": datetime.now().isoformat(),
            "size": os.path.getsize(file_path) if os.path.exists(file_path) else 0
        })
        
        with open(self.session_log, 'w', encoding='utf-8') as f:
            json.dump(session_info, f, indent=2, ensure_ascii=False)
    
    def log_permanent_file(self, file_path):
        """记录永久文件"""
        with open(self.session_log, 'r', encoding='utf-8') as f:
            session_info = json.load(f)
        
        session_info["permanent_files_created"].append({
            "path": file_path,
            "created_at": datetime.now().isoformat(),
            "size": os.path.getsize(file_path) if os.path.exists(file_path) else 0
        })
        
        with open(self.session_log, 'w', encoding='utf-8') as f:
            json.dump(session_info, f, indent=2, ensure_ascii=False)
    
    def scan_and_organize(self):
        """扫描并整理当前目录的临时文件"""
        moved_count = 0
        
        print("🔍 扫描临时文件...")
        
        for file_path in self.base_dir.rglob('*'):
            if file_path.is_file() and not str(file_path).startswith(str(self.temp_dir)):
                if self.is_temp_file(str(file_path)):
                    if self.move_to_temp(str(file_path)):
                        moved_count += 1
        
        print(f"✅ 已整理 {moved_count} 个临时文件")
        return moved_count
    
    def cleanup_session(self, keep_days=7):
        """清理当前会话的临时文件"""
        try:
            # 更新会话状态
            with open(self.session_log, 'r', encoding='utf-8') as f:
                session_info = json.load(f)
            
            session_info["status"] = "completed"
            session_info["end_time"] = datetime.now().isoformat()
            
            with open(self.session_log, 'w', encoding='utf-8') as f:
                json.dump(session_info, f, indent=2, ensure_ascii=False)
            
            temp_file_count = len(session_info.get("temp_files_created", []))
            permanent_file_count = len(session_info.get("permanent_files_created", []))
            
            print(f"🧹 当前会话清理完成:")
            print(f"   📦 临时文件: {temp_file_count} 个")
            print(f"   📄 永久文件: {permanent_file_count} 个")
            print(f"   📁 会话目录: {self.session_dir}")
            
        except Exception as e:
            print(f"❌ 会话清理失败: {e}")
    
    def cleanup_old_sessions(self, keep_days=7):
        """清理过期的会话目录"""
        cutoff_date = datetime.now() - timedelta(days=keep_days)
        removed_count = 0
        
        for session_dir in self.temp_dir.glob("session_*"):
            if session_dir.is_dir():
                try:
                    # 从目录名提取日期
                    session_name = session_dir.name
                    date_str = session_name.replace("session_", "").split("_")[0]
                    session_date = datetime.strptime(date_str, "%Y%m%d")
                    
                    if session_date < cutoff_date:
                        shutil.rmtree(session_dir)
                        removed_count += 1
                        print(f"🗑️ 已删除过期会话: {session_name}")
                        
                except Exception as e:
                    print(f"⚠️ 清理会话失败 {session_dir}: {e}")
        
        if removed_count > 0:
            print(f"✅ 已清理 {removed_count} 个过期会话目录")
        else:
            print("✅ 无需清理过期会话")
    
    def list_current_files(self):
        """列出当前会话的文件"""
        try:
            with open(self.session_log, 'r', encoding='utf-8') as f:
                session_info = json.load(f)
            
            print(f"\n📋 当前会话 {self.session_id} 文件列表:")
            
            temp_files = session_info.get("temp_files_created", [])
            if temp_files:
                print(f"📦 临时文件 ({len(temp_files)} 个):")
                for temp_file in temp_files:
                    path = Path(temp_file["path"])
                    size_kb = temp_file["size"] / 1024
                    print(f"   - {path.name} ({size_kb:.1f} KB)")
            
            permanent_files = session_info.get("permanent_files_created", [])
            if permanent_files:
                print(f"📄 永久文件 ({len(permanent_files)} 个):")
                for perm_file in permanent_files:
                    path = Path(perm_file["path"])
                    size_kb = perm_file["size"] / 1024
                    print(f"   - {path.name} ({size_kb:.1f} KB)")
            
        except Exception as e:
            print(f"❌ 列出文件失败: {e}")


def main():
    """主函数 - 命令行调用"""
    import sys
    
    manager = TempFileManager()
    
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        
        if command == "scan":
            manager.scan_and_organize()
        elif command == "cleanup":
            manager.cleanup_session()
        elif command == "clean-old":
            keep_days = int(sys.argv[2]) if len(sys.argv) > 2 else 7
            manager.cleanup_old_sessions(keep_days)
        elif command == "list":
            manager.list_current_files()
        elif command == "auto":
            # 自动模式：扫描 -> 清理
            manager.scan_and_organize()
            manager.cleanup_session()
        else:
            print("用法: python temp_file_manager.py [scan|cleanup|clean-old|list|auto]")
    else:
        # 默认执行自动模式
        manager.scan_and_organize()
        manager.cleanup_session()


if __name__ == "__main__":
    main()