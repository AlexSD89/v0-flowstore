#!/usr/bin/env python3
"""
自动化管理器
提供全面的自动化脚本管理和调度功能
"""

import os
import json
import time
import subprocess
import threading
import logging
import schedule
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Callable

class AutomationManager:
    def __init__(self, launchx_root):
        self.launchx_root = Path(launchx_root)
        self.scripts_dir = self.launchx_root / "🛠️ 系统管理" / "memory-bank" / "scripts"
        self.logs_dir = self.launchx_root / ".serena" / "logs"
        self.automation_logs_dir = self.logs_dir / "automation"

        # 确保目录存在
        self.automation_logs_dir.mkdir(parents=True, exist_ok=True)

        # 配置日志
        self._setup_logging()

        # 自动化任务注册表
        self.tasks = {}
        self.task_history = []
        self.schedules = {}

        # 运行状态
        self.scheduler_active = False
        self.scheduler_thread = None

        # 注册自动化任务
        self._register_tasks()

        self.logger.info("自动化管理器初始化完成")

    def _setup_logging(self):
        """配置日志"""
        log_file = self.automation_logs_dir / "automation_manager.log"
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s [%(levelname)s] %(message)s',
            handlers=[
                logging.FileHandler(log_file, encoding='utf-8'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger('automation_manager')

    def _register_tasks(self):
        """注册自动化任务"""

        # Memory管理任务
        self.register_task('memory_analysis', {
            'name': 'Memory分析',
            'description': '分析Serena memories状态和健康状况',
            'command': ['python3', 'serena_memories_manager.py', '--analyze'],
            'schedule': 'daily',
            'enabled': True
        })

        self.register_task('memory_cleanup', {
            'name': 'Memory清理',
            'description': '清理重复和过时的memory文件',
            'command': ['python3', 'serena_memories_manager.py', '--cleanup-execute'],
            'schedule': 'weekly',
            'enabled': True
        })

        self.register_task('memory_index', {
            'name': 'Memory索引',
            'description': '更新memory索引文件',
            'command': ['python3', 'serena_memories_manager.py', '--index'],
            'schedule': 'hourly',
            'enabled': True
        })

        # 日志管理任务
        self.register_task('log_rotation', {
            'name': '日志轮转',
            'description': '执行日志轮转和清理',
            'command': ['python3', 'serena_log_manager.py', '--rotate'],
            'schedule': 'daily',
            'enabled': True
        })

        self.register_task('log_cleanup', {
            'name': '日志清理',
            'description': '清理过期日志文件',
            'command': ['python3', 'serena_log_manager.py', '--cleanup'],
            'schedule': 'weekly',
            'enabled': True
        })

        # 同步任务
        self.register_task('memory_sync', {
            'name': 'Memory同步',
            'description': '执行Memory Bank双向同步',
            'command': ['python3', 'memory_sync_service.py'],
            'schedule': 'hourly',
            'enabled': True
        })

        # 搜索索引任务
        self.register_task('search_index_rebuild', {
            'name': '搜索索引重建',
            'description': '重建语义搜索索引',
            'command': ['python3', 'semantic_search_engine.py'],
            'schedule': 'daily',
            'enabled': True
        })

        # Frontmatter标准化任务
        self.register_task('frontmatter_standardization', {
            'name': 'Frontmatter标准化',
            'description': '标准化文档frontmatter格式',
            'command': ['python3', 'frontmatter_standardizer.py'],
            'schedule': 'weekly',
            'enabled': True
        })

        # 系统健康检查
        self.register_task('health_check', {
            'name': '系统健康检查',
            'description': '全面系统健康检查',
            'command': ['python3', '-c', 'import requests; requests.get("http://127.0.0.1:24284/api/health")'],
            'schedule': 'hourly',
            'enabled': True
        })

        # 备份任务
        self.register_task('backup_config', {
            'name': '配置备份',
            'description': '备份重要配置文件',
            'command': [self._create_backup_script()],
            'schedule': 'daily',
            'enabled': True
        })

    def register_task(self, task_id: str, task_config: Dict):
        """注册自动化任务"""
        self.tasks[task_id] = task_config
        self.logger.info(f"注册任务: {task_config['name']} ({task_id})")

    def _create_backup_script(self):
        """创建备份脚本"""
        backup_script = self.scripts_dir / "backup_config.py"
        if not backup_script.exists():
            backup_content = '''#!/usr/bin/env python3
"""
配置文件备份脚本
"""

import shutil
import json
from datetime import datetime
from pathlib import Path

def backup_configurations():
    """备份配置文件"""
    launchx_root = Path("/Users/dangsiyuan/Documents/obsidion/launch x")
    backup_dir = launchx_root / "🛠️ 系统管理" / "memory-bank" / "backups"
    backup_dir.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_folder = backup_dir / f"config_backup_{timestamp}"
    backup_folder.mkdir(exist_ok=True)

    # 备份重要配置文件
    configs_to_backup = [
        ".serena/serena_config.yml",
        ".serena/logs/logging_config.json",
        ".serena/search_index.json"
    ]

    for config_path in configs_to_backup:
        source = launchx_root / config_path
        if source.exists():
            dest = backup_folder / Path(config_path).name
            shutil.copy2(source, dest)
            print(f"备份: {config_path}")

    print(f"配置备份完成: {backup_folder}")

if __name__ == "__main__":
    backup_configurations()
'''
            backup_script.write_text(backup_content, encoding='utf-8')
            backup_script.chmod(0o755)

        return str(backup_script)

    def start_scheduler(self):
        """启动调度器"""
        if self.scheduler_active:
            self.logger.warning("调度器已在运行")
            return

        self.scheduler_active = True

        # 设置调度任务
        self._setup_schedules()

        # 启动调度器线程
        self.scheduler_thread = threading.Thread(target=self._scheduler_loop, daemon=True)
        self.scheduler_thread.start()

        self.logger.info("自动化调度器已启动")

    def stop_scheduler(self):
        """停止调度器"""
        self.scheduler_active = False
        if self.scheduler_thread:
            self.scheduler_thread.join(timeout=5)

        self.logger.info("自动化调度器已停止")

    def _setup_schedules(self):
        """设置任务调度"""
        schedule.clear()

        for task_id, task_config in self.tasks.items():
            if not task_config['enabled']:
                continue

            schedule_time = task_config['schedule']

            if schedule_time == 'hourly':
                schedule.every().hour.do(self._run_task, task_id)
            elif schedule_time == 'daily':
                schedule.every().day.at("02:00").do(self._run_task, task_id)
            elif schedule_time == 'weekly':
                schedule.every().week.do(self._run_task, task_id)
            elif schedule_time.startswith('daily_at_'):
                time_str = schedule_time.replace('daily_at_', '')
                schedule.every().day.at(time_str).do(self._run_task, task_id)

            self.logger.info(f"设置调度: {task_config['name']} - {schedule_time}")

    def _scheduler_loop(self):
        """调度器主循环"""
        while self.scheduler_active:
            try:
                schedule.run_pending()
                time.sleep(60)  # 每分钟检查一次
            except Exception as e:
                self.logger.error(f"调度器循环异常: {str(e)}")
                time.sleep(60)

    def _run_task(self, task_id: str):
        """执行单个任务"""
        if task_id not in self.tasks:
            self.logger.error(f"任务不存在: {task_id}")
            return

        task_config = self.tasks[task_id]
        task_name = task_config['name']
        command = task_config['command']

        start_time = datetime.now()
        self.logger.info(f"开始执行任务: {task_name}")

        try:
            # 准备工作目录
            cwd = self.scripts_dir

            # 执行任务
            result = subprocess.run(
                command,
                cwd=cwd,
                capture_output=True,
                text=True,
                timeout=300  # 5分钟超时
            )

            duration = (datetime.now() - start_time).total_seconds()

            # 记录任务执行结果
            task_result = {
                'task_id': task_id,
                'task_name': task_name,
                'start_time': start_time.isoformat(),
                'duration': duration,
                'exit_code': result.returncode,
                'success': result.returncode == 0,
                'stdout': result.stdout,
                'stderr': result.stderr,
                'command': ' '.join(command)
            }

            self.task_history.append(task_result)

            # 保存任务日志
            self._save_task_log(task_result)

            if result.returncode == 0:
                self.logger.info(f"任务执行成功: {task_name} (耗时: {duration:.2f}秒)")
            else:
                self.logger.error(f"任务执行失败: {task_name} (退出码: {result.returncode})")
                if result.stderr:
                    self.logger.error(f"错误输出: {result.stderr}")

        except subprocess.TimeoutExpired:
            duration = (datetime.now() - start_time).total_seconds()
            self.logger.error(f"任务执行超时: {task_name} (超时时间: {duration:.2f}秒)")

            task_result = {
                'task_id': task_id,
                'task_name': task_name,
                'start_time': start_time.isoformat(),
                'duration': duration,
                'exit_code': -1,
                'success': False,
                'stdout': '',
                'stderr': 'Task execution timeout',
                'command': ' '.join(command)
            }

            self.task_history.append(task_result)
            self._save_task_log(task_result)

        except Exception as e:
            duration = (datetime.now() - start_time).total_seconds()
            self.logger.error(f"任务执行异常: {task_name} - {str(e)}")

            task_result = {
                'task_id': task_id,
                'task_name': task_name,
                'start_time': start_time.isoformat(),
                'duration': duration,
                'exit_code': -2,
                'success': False,
                'stdout': '',
                'stderr': str(e),
                'command': ' '.join(command)
            }

            self.task_history.append(task_result)
            self._save_task_log(task_result)

    def _save_task_log(self, task_result: Dict):
        """保存任务日志"""
        timestamp = datetime.now().strftime("%Y%m%d")
        log_file = self.automation_logs_dir / f"tasks_{timestamp}.log"

        log_entry = (
            f"{task_result['start_time']} [{task_result['task_id']}] "
            f"{task_result['task_name']} - "
            f"{'SUCCESS' if task_result['success'] else 'FAILED'} "
            f"({task_result['duration']:.2f}s)\n"
        )

        with open(log_file, 'a', encoding='utf-8') as f:
            f.write(log_entry)

        # 保存详细结果到JSON文件
        result_file = self.automation_logs_dir / f"task_result_{task_result['task_id']}_{int(time.time())}.json"
        with open(result_file, 'w', encoding='utf-8') as f:
            json.dump(task_result, f, ensure_ascii=False, indent=2)

    def run_task_now(self, task_id: str) -> Dict:
        """立即执行指定任务"""
        if task_id not in self.tasks:
            return {
                'success': False,
                'error': f"任务不存在: {task_id}"
            }

        self.logger.info(f"手动执行任务: {self.tasks[task_id]['name']}")
        self._run_task(task_id)

        # 返回最新执行结果
        recent_results = [r for r in self.task_history if r['task_id'] == task_id]
        if recent_results:
            return {
                'success': True,
                'result': recent_results[-1]
            }

        return {
            'success': False,
            'error': '任务执行结果未找到'
        }

    def get_task_status(self) -> Dict:
        """获取任务状态"""
        now = datetime.now()

        status = {
            'scheduler_active': self.scheduler_active,
            'total_tasks': len(self.tasks),
            'enabled_tasks': len([t for t in self.tasks.values() if t['enabled']]),
            'total_executions': len(self.task_history),
            'tasks': {},
            'recent_executions': [],
            'next_runs': {}
        }

        # 任务状态
        for task_id, task_config in self.tasks.items():
            recent_executions = [e for e in self.task_history if e['task_id'] == task_id]
            last_execution = recent_executions[-1] if recent_executions else None

            status['tasks'][task_id] = {
                'name': task_config['name'],
                'description': task_config['description'],
                'schedule': task_config['schedule'],
                'enabled': task_config['enabled'],
                'last_execution': last_execution['start_time'] if last_execution else None,
                'last_success': last_execution['success'] if last_execution else None,
                'execution_count': len(recent_executions)
            }

        # 最近的执行记录
        status['recent_executions'] = self.task_history[-10:]  # 最近10次

        # 下次执行时间（简化版）
        for task_id, task_config in self.tasks.items():
            if task_config['enabled']:
                if task_config['schedule'] == 'hourly':
                    next_run = now + timedelta(hours=1)
                elif task_config['schedule'] == 'daily':
                    next_run = now.replace(hour=2, minute=0, second=0) + timedelta(days=1)
                elif task_config['schedule'] == 'weekly':
                    next_run = now + timedelta(weeks=1)
                else:
                    next_run = None

                if next_run:
                    status['next_runs'][task_id] = next_run.isoformat()

        return status

    def enable_task(self, task_id: str) -> bool:
        """启用任务"""
        if task_id in self.tasks:
            self.tasks[task_id]['enabled'] = True
            self.logger.info(f"任务已启用: {self.tasks[task_id]['name']}")

            # 如果调度器正在运行，重新设置调度
            if self.scheduler_active:
                self._setup_schedules()

            return True
        return False

    def disable_task(self, task_id: str) -> bool:
        """禁用任务"""
        if task_id in self.tasks:
            self.tasks[task_id]['enabled'] = False
            self.logger.info(f"任务已禁用: {self.tasks[task_id]['name']}")

            # 如果调度器正在运行，重新设置调度
            if self.scheduler_active:
                self._setup_schedules()

            return True
        return False

    def generate_automation_report(self) -> Dict:
        """生成自动化报告"""
        now = datetime.now()

        # 统计最近24小时的执行情况
        recent_executions = [
            e for e in self.task_history
            if datetime.fromisoformat(e['start_time']) > now - timedelta(hours=24)
        ]

        success_count = sum(1 for e in recent_executions if e['success'])
        total_count = len(recent_executions)

        # 按任务统计
        task_stats = {}
        for task_id in self.tasks:
            task_executions = [e for e in recent_executions if e['task_id'] == task_id]
            task_success = sum(1 for e in task_executions if e['success'])

            task_stats[task_id] = {
                'name': self.tasks[task_id]['name'],
                'total_executions': len(task_executions),
                'success_executions': task_success,
                'success_rate': (task_success / len(task_executions) * 100) if task_executions else 0
            }

        report = {
            'timestamp': now.isoformat(),
            'summary': {
                'scheduler_active': self.scheduler_active,
                'total_tasks': len(self.tasks),
                'enabled_tasks': len([t for t in self.tasks.values() if t['enabled']]),
                'executions_24h': total_count,
                'success_rate_24h': (success_count / total_count * 100) if total_count > 0 else 0
            },
            'task_stats': task_stats,
            'recent_executions': recent_executions[-20:],  # 最近20次
            'recommendations': self._generate_recommendations(task_stats)
        }

        return report

    def _generate_recommendations(self, task_stats: Dict) -> List[str]:
        """生成建议"""
        recommendations = []

        # 检查失败率高的任务
        for task_id, stats in task_stats.items():
            if stats['success_rate'] < 80 and stats['total_executions'] > 0:
                recommendations.append(f"任务 {stats['name']} 失败率较高 ({stats['success_rate']:.1f}%)，建议检查任务配置")

        # 检查长期未执行的任务
        for task_id, task_config in self.tasks.items():
            if task_config['enabled'] and task_id not in task_stats:
                recommendations.append(f"任务 {task_config['name']} 长期未执行，建议检查调度配置")

        return recommendations

def main():
    """主函数 - 运行自动化管理器"""
    launchx_root = "/Users/dangsiyuan/Documents/obsidion/launch x"
    manager = AutomationManager(launchx_root)

    print("🤖 启动自动化管理器...")

    # 显示注册的任务
    print(f"\n📋 已注册任务 ({len(manager.tasks)}个):")
    for task_id, task_config in manager.tasks.items():
        status = "✅ 启用" if task_config['enabled'] else "❌ 禁用"
        print(f"   {task_config['name']} ({task_id}) - {task_config['schedule']} - {status}")

    try:
        # 启动调度器
        manager.start_scheduler()

        print("\n🔄 自动化调度器运行中...")
        print("按 Ctrl+C 停止")

        # 定期显示状态
        while True:
            time.sleep(300)  # 每5分钟显示一次状态
            status = manager.get_task_status()

            print(f"\n📊 自动化状态 ({datetime.now().strftime('%H:%M:%S')}):")
            print(f"   活跃任务: {status['enabled_tasks']}/{status['total_tasks']}")
            print(f"   总执行次数: {status['total_executions']}")
            print(f"   最近执行: {status['recent_executions'][-1]['task_name'] if status['recent_executions'] else '无'}")

    except KeyboardInterrupt:
        print("\n⏹️ 正在停止自动化调度器...")
        manager.stop_scheduler()
        print("✅ 自动化调度器已停止")

        # 生成最终报告
        report = manager.generate_automation_report()
        report_file = manager.automation_logs_dir / f"automation_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"

        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)

        print(f"📄 自动化报告已保存: {report_file}")

if __name__ == "__main__":
    main()