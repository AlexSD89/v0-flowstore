#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
自动Git同步脚本 - 每小时自动上传到GitHub
作者: LaunchX团队
创建时间: 2025-08-13
"""

import os
import sys
import time
import subprocess
import logging
from datetime import datetime
from pathlib import Path
from typing import Optional, Tuple, Dict, Any
import json

class GitAutoSync:
    """Git自动同步类"""
    
    def __init__(self, project_root: Optional[str] = None):
        """初始化Git自动同步器"""
        if project_root:
            self.project_root = Path(project_root)
        else:
            # 查找Git仓库根目录
            current_dir = Path(__file__).parent
            while current_dir != current_dir.parent:
                if (current_dir / ".git").exists():
                    self.project_root = current_dir
                    break
                current_dir = current_dir.parent
            else:
                # 如果没找到，使用脚本所在目录的父目录
                self.project_root = Path(__file__).parent.parent
        
        self.log_dir = self.project_root / "logs"
        self.log_file = self.log_dir / "git-sync.log"
        self.config_file = self.project_root / "scripts" / "git-sync-config.json"
        
        # 创建日志目录
        self.log_dir.mkdir(exist_ok=True)
        
        # 设置日志
        self.setup_logging()
        
        # 加载配置
        self.config = self.load_config()
        
        self.logger.info("Git自动同步器初始化完成")
        self.logger.info(f"项目根目录: {self.project_root}")
        self.logger.info(f"日志文件: {self.log_file}")
    
    def setup_logging(self):
        """设置日志配置"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s [%(levelname)s] %(message)s',
            handlers=[
                logging.FileHandler(self.log_file, encoding='utf-8'),
                logging.StreamHandler(sys.stdout)
            ]
        )
        self.logger = logging.getLogger(__name__)
    
    def load_config(self) -> Dict[str, Any]:
        """加载配置文件"""
        default_config = {
            "auto_sync": True,
            "sync_interval_hours": 1,
            "commit_message_template": "🤖 自动同步更新 - {timestamp}",
            "max_retries": 3,
            "retry_delay_seconds": 60,
            "exclude_patterns": [
                "*.log",
                "*.tmp",
                "node_modules/",
                ".next/",
                "dist/",
                "build/"
            ],
            "include_patterns": [
                "*.py",
                "*.ts",
                "*.tsx",
                "*.js",
                "*.jsx",
                "*.md",
                "*.json",
                "*.yaml",
                "*.yml"
            ]
        }
        
        if self.config_file.exists():
            try:
                with open(self.config_file, 'r', encoding='utf-8') as f:
                    user_config = json.load(f)
                    default_config.update(user_config)
                    self.logger.info("配置文件加载成功")
            except Exception as e:
                self.logger.warning(f"配置文件加载失败: {e}, 使用默认配置")
        else:
            # 创建默认配置文件
            self.save_config(default_config)
            self.logger.info("创建默认配置文件")
        
        return default_config
    
    def save_config(self, config: Dict[str, Any]):
        """保存配置文件"""
        try:
            with open(self.config_file, 'w', encoding='utf-8') as f:
                json.dump(config, f, indent=2, ensure_ascii=False)
        except Exception as e:
            self.logger.error(f"保存配置文件失败: {e}")
    
    def run_command(self, command: str, cwd: Optional[str] = None) -> Tuple[int, str, str]:
        """执行命令并返回结果"""
        try:
            result = subprocess.run(
                command,
                shell=True,
                cwd=cwd or self.project_root,
                capture_output=True,
                text=True,
                encoding='utf-8'
            )
            return result.returncode, result.stdout, result.stderr
        except Exception as e:
            return -1, "", str(e)
    
    def check_git_status(self) -> bool:
        """检查Git仓库状态"""
        if not (self.project_root / ".git").exists():
            self.logger.error("当前目录不是Git仓库")
            return False
        
        # 检查远程仓库配置
        code, stdout, stderr = self.run_command("git remote get-url origin")
        if code != 0:
            self.logger.error("未配置远程仓库origin")
            return False
        
        self.logger.info(f"远程仓库: {stdout.strip()}")
        return True
    
    def get_git_status(self) -> Tuple[bool, Dict[str, Any]]:
        """获取Git状态信息"""
        status_info = {
            "has_changes": False,
            "staged_files": [],
            "unstaged_files": [],
            "untracked_files": [],
            "total_changes": 0
        }
        
        # 获取暂存区状态
        code, stdout, stderr = self.run_command("git status --porcelain")
        if code == 0 and stdout.strip():
            lines = stdout.strip().split('\n')
            for line in lines:
                if line.startswith('M ') or line.startswith('A ') or line.startswith('D '):
                    status_info["staged_files"].append(line[3:])
                elif line.startswith(' M') or line.startswith(' A') or line.startswith(' D'):
                    status_info["unstaged_files"].append(line[3:])
            
            status_info["has_changes"] = True
        
        # 获取未跟踪文件
        code, stdout, stderr = self.run_command("git ls-files --others --exclude-standard")
        if code == 0 and stdout.strip():
            status_info["untracked_files"] = stdout.strip().split('\n')
            status_info["has_changes"] = True
        
        status_info["total_changes"] = (
            len(status_info["staged_files"]) + 
            len(status_info["unstaged_files"]) + 
            len(status_info["untracked_files"])
        )
        
        return status_info["has_changes"], status_info
    
    def perform_git_sync(self) -> bool:
        """执行Git同步操作"""
        start_time = time.time()
        self.logger.info("开始Git同步操作...")
        
        try:
            # 获取当前分支
            code, stdout, stderr = self.run_command("git branch --show-current")
            if code != 0:
                self.logger.error("获取当前分支失败")
                return False
            
            current_branch = stdout.strip()
            self.logger.info(f"当前分支: {current_branch}")
            
            # 拉取最新代码
            self.logger.info("拉取远程最新代码...")
            code, stdout, stderr = self.run_command(f"git pull origin {current_branch} --rebase")
            if code != 0:
                self.logger.warning("拉取远程代码失败，尝试合并模式")
                code, stdout, stderr = self.run_command(f"git pull origin {current_branch}")
                if code != 0:
                    self.logger.error("拉取远程代码失败")
                    return False
            
            # 检查是否有变更需要提交
            has_changes, status_info = self.get_git_status()
            if not has_changes:
                self.logger.info("没有新的变更需要提交")
                return True
            
            # 添加所有变更
            self.logger.info("添加所有变更到暂存区...")
            code, stdout, stderr = self.run_command("git add -A")
            if code != 0:
                self.logger.error("添加变更失败")
                return False
            
            # 生成提交信息
            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            commit_message = f"""🤖 自动同步更新 - {timestamp}

📊 变更统计:
- 暂存文件: {len(status_info['staged_files'])}
- 未暂存文件: {len(status_info['unstaged_files'])}
- 新增文件: {len(status_info['untracked_files'])}
- 总变更数: {status_info['total_changes']}
- 同步时间: {timestamp}
- 分支: {current_branch}

🔄 自动同步任务执行"""
            
            # 提交变更
            self.logger.info("提交变更...")
            code, stdout, stderr = self.run_command(f'git commit -m "{commit_message}"')
            if code != 0:
                self.logger.error("变更提交失败")
                return False
            
            self.logger.info("变更提交成功")
            
            # 推送到远程仓库
            self.logger.info("推送到远程仓库...")
            code, stdout, stderr = self.run_command(f"git push origin {current_branch}")
            if code != 0:
                self.logger.error("推送失败")
                return False
            
            self.logger.info("推送成功")
            
            duration = time.time() - start_time
            self.logger.info(f"Git同步操作完成，耗时: {duration:.2f}秒")
            
            return True
            
        except Exception as e:
            self.logger.error(f"Git同步操作出错: {e}")
            return False
    
    def run_sync_loop(self):
        """运行同步循环"""
        self.logger.info("启动Git自动同步循环...")
        self.logger.info(f"同步间隔: {self.config['sync_interval_hours']}小时")
        
        try:
            while True:
                # 检查Git状态
                if not self.check_git_status():
                    self.logger.error("Git仓库检查失败，等待下次重试")
                    time.sleep(self.config['retry_delay_seconds'])
                    continue
                
                # 执行同步
                if self.perform_git_sync():
                    self.logger.info("同步成功")
                else:
                    self.logger.error("同步失败")
                
                # 等待下次同步
                wait_seconds = self.config['sync_interval_hours'] * 3600
                self.logger.info(f"等待 {self.config['sync_interval_hours']} 小时后进行下次同步...")
                time.sleep(wait_seconds)
                
        except KeyboardInterrupt:
            self.logger.info("收到中断信号，停止同步循环")
        except Exception as e:
            self.logger.error(f"同步循环出错: {e}")
    
    def run_once(self) -> bool:
        """执行一次同步"""
        self.logger.info("执行单次Git同步...")
        
        if not self.check_git_status():
            return False
        
        return self.perform_git_sync()

def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Git自动同步工具")
    parser.add_argument("--once", action="store_true", help="只执行一次同步")
    parser.add_argument("--config", help="配置文件路径")
    parser.add_argument("--project-root", help="项目根目录路径")
    
    args = parser.parse_args()
    
    # 创建同步器
    sync = GitAutoSync(project_root=args.project_root)
    
    if args.once:
        # 执行单次同步
        success = sync.run_once()
        sys.exit(0 if success else 1)
    else:
        # 运行同步循环
        sync.run_sync_loop()

if __name__ == "__main__":
    main()