#!/usr/bin/env python3
"""Path Guard: 路径约束执行机制

防止文件被创建在项目根目录，确保所有文件按规范存储在正确位置。
基于LaunchX架构分析报告的建议实现。
"""
from __future__ import annotations

import os
from pathlib import Path
from typing import Dict, List, Optional
import logging

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 项目根目录
PROJECT_ROOT = Path(__file__).resolve().parents[1]

# 允许的文件存储路径规范
ALLOWED_PATHS: Dict[str, List[str]] = {
    "client_assets": [
        "clients/{client_slug}/assets/generated/",
        "clients/{client_slug}/assets/content/", 
        "clients/{client_slug}/reports/",
        "clients/{client_slug}/strategy/",
        "clients/{client_slug}/execution/",
        "clients/{client_slug}/data/",
    ],
    "project_files": [
        "projects/{project_slug}/assets/generated/",
        "projects/{project_slug}/data/",
        "projects/{project_slug}/reports/",
    ],
    "automation_outputs": [
        "automation/outputs/",
        "automation/logs/",
        "automation/temp/",
    ],
    "system_config": [
        ".claude/",
        "automation/spec-kit/configs/",
        "automation/claude_tasks/",
    ]
}

# 根目录禁止文件类型
FORBIDDEN_ROOT_EXTENSIONS = {
    '.png', '.jpg', '.jpeg', '.gif', '.svg',  # 图片文件
    '.txt', '.md', '.doc', '.docx',           # 文档文件  
    '.json', '.yaml', '.yml', '.xml',         # 配置文件
    '.csv', '.xlsx', '.xls',                  # 数据文件
    '.log',                                   # 日志文件
}

# 允许在根目录的系统文件
ALLOWED_ROOT_FILES = {
    'CLAUDE.md',
    'README.md', 
    'requirements.txt',
    'pyproject.toml',
    '.gitignore',
    '.gitattributes',
}

class PathGuard:
    """路径约束保护器"""
    
    def __init__(self, project_root: Optional[Path] = None):
        self.project_root = project_root or PROJECT_ROOT
        self.violations: List[Dict[str, str]] = []
        
    def validate_path(self, target_path: str | Path, file_type: str = "unknown") -> Dict[str, any]:
        """验证文件路径是否符合规范
        
        Args:
            target_path: 目标文件路径
            file_type: 文件类型 (client_assets, project_files, etc.)
            
        Returns:
            {
                "valid": bool,
                "reason": str,
                "suggested_path": str,
                "violation": dict
            }
        """
        target = Path(target_path).resolve()
        
        # 检查是否为绝对路径在项目根目录内
        try:
            relative_path = target.relative_to(self.project_root)
        except ValueError:
            return {
                "valid": False,
                "reason": "路径不在项目根目录内",
                "suggested_path": None,
                "violation": None
            }
        
        # 检查是否在根目录创建文件
        if len(relative_path.parts) == 1:
            filename = relative_path.name
            file_ext = Path(filename).suffix.lower()
            
            # 检查是否为允许的系统文件
            if filename in ALLOWED_ROOT_FILES:
                return {
                    "valid": True,
                    "reason": "允许的系统文件",
                    "suggested_path": str(target),
                    "violation": None
                }
            
            # 检查是否为禁止的文件类型
            if file_ext in FORBIDDEN_ROOT_EXTENSIONS:
                violation = {
                    "file": str(target),
                    "type": "root_directory_violation",
                    "extension": file_ext,
                    "timestamp": self._get_timestamp()
                }
                
                suggested_path = self._suggest_correct_path(filename, file_type)
                
                return {
                    "valid": False,
                    "reason": f"禁止在根目录创建 {file_ext} 文件",
                    "suggested_path": suggested_path,
                    "violation": violation
                }
        
        # 检查路径是否符合规范
        path_str = str(relative_path)
        if not self._is_path_allowed(path_str, file_type):
            violation = {
                "file": str(target),
                "type": "path_convention_violation", 
                "path": path_str,
                "timestamp": self._get_timestamp()
            }
            
            suggested_path = self._suggest_correct_path(target.name, file_type)
            
            return {
                "valid": False,
                "reason": f"路径不符合 {file_type} 规范",
                "suggested_path": suggested_path,
                "violation": violation
            }
        
        return {
            "valid": True,
            "reason": "路径符合规范",
            "suggested_path": str(target),
            "violation": None
        }
    
    def _is_path_allowed(self, path_str: str, file_type: str) -> bool:
        """检查路径是否被允许"""
        if file_type not in ALLOWED_PATHS:
            return True  # 未知类型默认允许
            
        allowed_patterns = ALLOWED_PATHS[file_type]
        for pattern in allowed_patterns:
            # 简单的通配符匹配
            if self._match_pattern(path_str, pattern):
                return True
        return False
    
    def _match_pattern(self, path: str, pattern: str) -> bool:
        """简单的路径模式匹配"""
        # 替换 {client_slug} 和 {project_slug} 为通配符
        pattern = pattern.replace("{client_slug}", "*").replace("{project_slug}", "*")
        
        # 检查路径是否以模式开头
        if pattern.endswith("/"):
            return path.startswith(pattern.rstrip("/"))
        return path == pattern.rstrip("/")
    
    def _suggest_correct_path(self, filename: str, file_type: str) -> str:
        """建议正确的文件路径"""
        if file_type == "client_assets":
            return f"clients/launch-x/assets/generated/{filename}"
        elif file_type == "project_files":
            return f"projects/xiaohongshu-automation/assets/generated/{filename}"
        elif file_type == "automation_outputs":
            return f"automation/outputs/{filename}"
        else:
            # 根据文件扩展名推测
            ext = Path(filename).suffix.lower()
            if ext in ['.png', '.jpg', '.jpeg', '.gif', '.svg']:
                return f"clients/launch-x/assets/generated/{filename}"
            elif ext in ['.txt', '.md']:
                return f"clients/launch-x/reports/{filename}"
            elif ext in ['.json', '.yaml', '.yml']:
                return f"automation/outputs/{filename}"
            else:
                return f"clients/launch-x/data/{filename}"
    
    def _get_timestamp(self) -> str:
        """获取时间戳"""
        from datetime import datetime
        return datetime.now().strftime("%Y-%m-%d_%H%M%S")
    
    def record_violation(self, violation: Dict[str, str]) -> None:
        """记录路径违规"""
        self.violations.append(violation)
        logger.warning(f"路径违规: {violation}")
    
    def get_violations_report(self) -> str:
        """生成违规报告"""
        if not self.violations:
            return "无路径违规记录"
        
        report_lines = ["# 路径违规报告", ""]
        for i, violation in enumerate(self.violations, 1):
            report_lines.extend([
                f"## 违规 {i}",
                f"- 文件: {violation['file']}",
                f"- 类型: {violation['type']}",
                f"- 时间: {violation['timestamp']}",
                ""
            ])
        
        return "\n".join(report_lines)


def path_guard(target_path: str | Path, file_type: str = "unknown") -> Dict[str, any]:
    """路径保护装饰器函数
    
    用于在创建文件前验证路径是否符合规范
    
    Args:
        target_path: 目标文件路径
        file_type: 文件类型
        
    Returns:
        验证结果字典
        
    Raises:
        ValueError: 路径不符合规范时抛出异常
    """
    guard = PathGuard()
    result = guard.validate_path(target_path, file_type)
    
    if not result["valid"]:
        if result["violation"]:
            guard.record_violation(result["violation"])
        
        error_msg = f"""
        路径违规: {result['reason']}
        当前路径: {target_path}
        建议路径: {result['suggested_path']}
        
        请使用建议路径或通过自动化流程创建文件。
        """
        raise ValueError(error_msg.strip())
    
    return result


def scan_root_violations() -> List[str]:
    """扫描项目根目录的违规文件"""
    violations = []
    
    for item in PROJECT_ROOT.iterdir():
        if item.is_file():
            filename = item.name
            if filename not in ALLOWED_ROOT_FILES:
                ext = item.suffix.lower()
                if ext in FORBIDDEN_ROOT_EXTENSIONS:
                    violations.append(str(item))
    
    return violations


def cleanup_root_violations(dry_run: bool = True) -> Dict[str, any]:
    """清理根目录违规文件
    
    Args:
        dry_run: 是否为模拟运行
        
    Returns:
        清理结果报告
    """
    violations = scan_root_violations()
    
    if not violations:
        return {
            "status": "success",
            "message": "未发现违规文件",
            "moved_files": [],
            "failed_files": []
        }
    
    moved_files = []
    failed_files = []
    
    for violation_path in violations:
        try:
            src = Path(violation_path)
            filename = src.name
            
            # 确定目标路径
            guard = PathGuard()
            suggested = guard._suggest_correct_path(filename, "client_assets")
            dest = PROJECT_ROOT / suggested
            
            if not dry_run:
                # 创建目标目录
                dest.parent.mkdir(parents=True, exist_ok=True)
                
                # 移动文件
                src.rename(dest)
                logger.info(f"移动文件: {src} -> {dest}")
            
            moved_files.append({
                "source": str(src),
                "destination": str(dest),
                "action": "would_move" if dry_run else "moved"
            })
            
        except Exception as e:
            failed_files.append({
                "file": violation_path,
                "error": str(e)
            })
            logger.error(f"移动文件失败 {violation_path}: {e}")
    
    return {
        "status": "success" if not failed_files else "partial",
        "message": f"{'模拟' if dry_run else '实际'}处理 {len(violations)} 个违规文件",
        "moved_files": moved_files,
        "failed_files": failed_files
    }


if __name__ == "__main__":
    # 命令行使用示例
    import sys
    
    if len(sys.argv) > 1:
        if sys.argv[1] == "scan":
            violations = scan_root_violations()
            if violations:
                print(f"发现 {len(violations)} 个违规文件:")
                for v in violations:
                    print(f"  - {v}")
            else:
                print("未发现违规文件")
        
        elif sys.argv[1] == "cleanup":
            dry_run = "--dry-run" in sys.argv
            result = cleanup_root_violations(dry_run)
            print(f"清理结果: {result['message']}")
            
            if result['moved_files']:
                print("移动的文件:")
                for item in result['moved_files']:
                    print(f"  {item['action']}: {item['source']} -> {item['destination']}")
            
            if result['failed_files']:
                print("失败的文件:")
                for item in result['failed_files']:
                    print(f"  {item['file']}: {item['error']}")
    else:
        print("使用方法:")
        print("  python path_guard.py scan       # 扫描违规文件")
        print("  python path_guard.py cleanup    # 清理违规文件")
        print("  python path_guard.py cleanup --dry-run  # 模拟清理")