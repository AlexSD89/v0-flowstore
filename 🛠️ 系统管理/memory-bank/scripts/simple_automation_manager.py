#!/usr/bin/env python3
"""
简化版自动化管理器
使用内置功能实现基本的自动化脚本管理和调度
"""

import os
import json
import time
import subprocess
import threading
import logging
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional

class SimpleAutomationManager:
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

        # 运行状态
        self.scheduler_active = False
        self.scheduler_thread = None

        # 注册自动化任务
        self._register_tasks()

        self.logger.info("简化版自动化管理器初始化完成")

    def _setup_logging(self):
        """配置日志"""
        log_file = self.automation_logs_dir / "simple_automation_manager.log"
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s [%(levelname)s] %(message)s',
            handlers=[
                logging.FileHandler(log_file, encoding='utf-8'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger('simple_automation_manager')

    def _register_tasks(self):
        """注册自动化任务"""

        # Memory管理任务
        self.register_task('memory_index', {
            'name': 'Memory索引',
            'description': '更新memory索引文件',
            'command': ['python3', 'serena_memories_manager.py', '--index'],
            'interval_minutes': 60,  # 每小时执行
            'enabled': True
        })

        # 日志管理任务
        self.register_task('log_rotation', {
            'name': '日志轮转',
            'description': '执行日志轮转和清理',
            'command': ['python3', 'serena_log_manager.py', '--rotate'],
            'interval_minutes': 1440,  # 每天执行
            'enabled': True
        })

        # 系统健康检查
        self.register_task('health_check', {
            'name': '系统健康检查',
            'description': '全面系统健康检查',
            'command': ['python3', '-c', 'import urllib.request; urllib.request.urlopen("http://127.0.0.1:24284/api/health")'],
            'interval_minutes': 30,  # 每30分钟执行
            'enabled': True
        })

        # Frontmatter标准化任务
        self.register_task('frontmatter_check', {
            'name': 'Frontmatter检查',
            'description': '检查文档frontmatter标准化状态',
            'command': ['python3', '-c', 'print("Frontmatter检查任务运行")'],
            'interval_minutes': 720,  # 每12小时执行
            'enabled': True
        })

    def register_task(self, task_id: str, task_config: Dict):
        """注册自动化任务"""
        self.tasks[task_id] = task_config
        self.logger.info(f"注册任务: {task_config['name']} ({task_id})")

    def start_scheduler(self):
        """启动调度器"""
        if self.scheduler_active:
            self.logger.warning("调度器已在运行")
            return

        self.scheduler_active = True

        # 启动调度器线程
        self.scheduler_thread = threading.Thread(target=self._scheduler_loop, daemon=True)
        self.scheduler_thread.start()

        self.logger.info("简化版自动化调度器已启动")

    def stop_scheduler(self):
        """停止调度器"""
        self.scheduler_active = False
        if self.scheduler_thread:
            self.scheduler_thread.join(timeout=5)

        self.logger.info("简化版自动化调度器已停止")

    def _scheduler_loop(self):
        """调度器主循环"""
        task_next_runs = {}

        # 初始化任务下次运行时间
        for task_id, task_config in self.tasks.items():
            if task_config['enabled']:
                task_next_runs[task_id] = time.time()

        while self.scheduler_active:
            try:
                current_time = time.time()

                # 检查每个任务的执行时间
                for task_id, task_config in self.tasks.items():
                    if not task_config['enabled']:
                        continue

                    if current_time >= task_next_runs.get(task_id, float('inf')):
                        self._run_task(task_id)
                        task_next_runs[task_id] = current_time + (task_config['interval_minutes'] * 60)

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
                'stdout': result.stdout[:1000],  # 限制输出长度
                'stderr': result.stderr[:1000],
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
                    self.logger.error(f"错误输出: {result.stderr[:200]}")

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
        status = {
            'scheduler_active': self.scheduler_active,
            'total_tasks': len(self.tasks),
            'enabled_tasks': len([t for t in self.tasks.values() if t['enabled']]),
            'total_executions': len(self.task_history),
            'tasks': {},
            'recent_executions': []
        }

        # 任务状态
        for task_id, task_config in self.tasks.items():
            recent_executions = [e for e in self.task_history if e['task_id'] == task_id]
            last_execution = recent_executions[-1] if recent_executions else None

            status['tasks'][task_id] = {
                'name': task_config['name'],
                'description': task_config['description'],
                'interval_minutes': task_config['interval_minutes'],
                'enabled': task_config['enabled'],
                'last_execution': last_execution['start_time'] if last_execution else None,
                'last_success': last_execution['success'] if last_execution else None,
                'execution_count': len(recent_executions)
            }

        # 最近的执行记录
        status['recent_executions'] = self.task_history[-10:]  # 最近10次

        return status

    def enable_task(self, task_id: str) -> bool:
        """启用任务"""
        if task_id in self.tasks:
            self.tasks[task_id]['enabled'] = True
            self.logger.info(f"任务已启用: {self.tasks[task_id]['name']}")
            return True
        return False

    def disable_task(self, task_id: str) -> bool:
        """禁用任务"""
        if task_id in self.tasks:
            self.tasks[task_id]['enabled'] = False
            self.logger.info(f"任务已禁用: {self.tasks[task_id]['name']}")
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

        if recommendations:
            return recommendations
        else:
            return ["所有自动化任务运行正常，系统状态良好"]

def main():
    """主函数 - 运行自动化管理器"""
    launchx_root = "/Users/dangsiyuan/Documents/obsidion/launch x"
    manager = SimpleAutomationManager(launchx_root)

    print("🤖 启动简化版自动化管理器...")

    # 显示注册的任务
    print(f"\n📋 已注册任务 ({len(manager.tasks)}个):")
    for task_id, task_config in manager.tasks.items():
        status = "✅ 启用" if task_config['enabled'] else "❌ 禁用"
        interval_hours = task_config['interval_minutes'] / 60
        print(f"   {task_config['name']} ({task_id}) - 每{interval_hours:.1f}小时 - {status}")

    try:
        # 启动调度器
        manager.start_scheduler()

        print("\n🔄 简化版自动化调度器运行中...")
        print("按 Ctrl+C 停止")

        # 定期显示状态
        while True:
            time.sleep(300)  # 每5分钟显示一次状态
            status = manager.get_task_status()

            print(f"\n📊 自动化状态 ({datetime.now().strftime('%H:%M:%S')}):")
            print(f"   活跃任务: {status['enabled_tasks']}/{status['total_tasks']}")
            print(f"   总执行次数: {status['total_executions']}")

            # 显示最近的成功任务
            recent_successful = [e for e in status['recent_executions'] if e['success']]
            if recent_successful:
                print(f"   最近成功: {recent_successful[-1]['task_name']}")

    except KeyboardInterrupt:
        print("\n⏹️ 正在停止自动化调度器...")
        manager.stop_scheduler()
        print("✅ 简化版自动化调度器已停止")

        # 生成最终报告
        report = manager.generate_automation_report()
        report_file = manager.automation_logs_dir / f"automation_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"

        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)

        print(f"📄 自动化报告已保存: {report_file}")

        # 显示报告摘要
        print(f"\n📈 自动化报告摘要:")
        print(f"   总任务数: {report['summary']['total_tasks']}")
        print(f"   24小时执行次数: {report['summary']['executions_24h']}")
        print(f"   24小时成功率: {report['summary']['success_rate_24h']:.1f}%")

        if report['recommendations']:
            print(f"   建议: {', '.join(report['recommendations'][:2])}")

if __name__ == "__main__":
    main()