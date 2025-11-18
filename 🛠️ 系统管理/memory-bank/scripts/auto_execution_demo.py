#!/usr/bin/env python3
"""
自动执行演示脚本
展示如何真正实现自动执行，无需用户输入
"""
import os
import sys
import time
import json
import logging
from pathlib import Path
from safe_script_template import SafeScript

class AutoExecutionDemo(SafeScript):
    """自动执行演示类"""

    def __init__(self):
        super().__init__(
            name="AutoExecutionDemo",
            max_iterations=10,  # 限制执行次数
            timeout_seconds=30   # 限制总执行时间
        )
        self.auto_actions = []
        self.current_action = 0

    def setup_actions(self):
        """设置自动执行动作列表"""
        self.auto_actions = [
            {
                "name": "检查日志系统状态",
                "action": self.check_logging_status,
                "timeout": 5
            },
            {
                "name": "清理临时文件",
                "action": self.cleanup_temp_files,
                "timeout": 3
            },
            {
                "name": "验证系统健康",
                "action": self.verify_system_health,
                "timeout": 5
            },
            {
                "name": "生成执行报告",
                "action": self.generate_report,
                "timeout": 5
            }
        ]

    def execute(self):
        """自动执行主要逻辑"""
        if not self.auto_actions:
            self.setup_actions()

        if self.current_action >= len(self.auto_actions):
            self.logger.info("所有动作执行完成")
            return False

        action = self.auto_actions[self.current_action]
        self.logger.info(f"执行动作 {self.current_action + 1}/{len(self.auto_actions)}: {action['name']}")

        try:
            # 执行动作
            success = action["action"]()

            if success:
                self.logger.info(f"✅ {action['name']} 执行成功")
            else:
                self.logger.warning(f"⚠️ {action['name']} 执行失败")

            self.current_action += 1
            return True  # 继续执行下一个动作

        except Exception as e:
            self.logger.error(f"❌ {action['name']} 执行异常: {e}")
            return False

    def check_logging_status(self):
        """检查日志系统状态"""
        try:
            # 检查日志目录
            log_dir = Path(".serena/logs")
            if not log_dir.exists():
                log_dir.mkdir(parents=True, exist_ok=True)

            # 检查日志配置文件
            config_file = log_dir / "enhanced_logging_config.json"
            if config_file.exists():
                with open(config_file, 'r', encoding='utf-8') as f:
                    config = json.load(f)
                self.logger.info("日志配置文件存在且有效")
                return True
            else:
                self.logger.warning("日志配置文件不存在")
                return False

        except Exception as e:
            self.logger.error(f"检查日志系统状态失败: {e}")
            return False

    def cleanup_temp_files(self):
        """清理临时文件"""
        try:
            temp_patterns = [
                "*.tmp",
                "*.temp",
                "*.bak",
                ".DS_Store"
            ]

            cleaned_count = 0
            for pattern in temp_patterns:
                for file_path in Path(".").glob(pattern):
                    try:
                        if file_path.is_file():
                            file_path.unlink()
                            cleaned_count += 1
                    except Exception:
                        continue

            self.logger.info(f"清理了 {cleaned_count} 个临时文件")
            return True

        except Exception as e:
            self.logger.error(f"清理临时文件失败: {e}")
            return False

    def verify_system_health(self):
        """验证系统健康"""
        try:
            import psutil

            # 获取系统资源信息
            cpu_percent = psutil.cpu_percent(interval=1)
            memory = psutil.virtual_memory()
            disk = psutil.disk_usage('/')

            health_status = {
                "cpu": cpu_percent,
                "memory": memory.percent,
                "disk": (disk.used / disk.total) * 100
            }

            self.logger.info(f"系统健康状态: CPU={cpu_percent:.1f}%, 内存={memory.percent:.1f}%, 磁盘={health_status['disk']:.1f}%")

            # 判断健康状态
            healthy = all([
                health_status['cpu'] < 80,
                health_status['memory'] < 85,
                health_status['disk'] < 90
            ])

            if healthy:
                self.logger.info("✅ 系统健康状态良好")
            else:
                self.logger.warning("⚠️ 系统资源使用较高")

            return healthy

        except ImportError:
            self.logger.warning("psutil未安装，跳过系统健康检查")
            return True
        except Exception as e:
            self.logger.error(f"系统健康检查失败: {e}")
            return False

    def generate_report(self):
        """生成执行报告"""
        try:
            report = {
                "execution_time": time.time(),
                "actions_completed": self.current_action,
                "total_actions": len(self.auto_actions),
                "status": "completed" if self.current_action >= len(self.auto_actions) else "partial",
                "iteration_count": self.iteration_count
            }

            report_file = Path(".serena/logs/auto_execution_report.json")
            report_file.parent.mkdir(parents=True, exist_ok=True)

            with open(report_file, 'w', encoding='utf-8') as f:
                json.dump(report, f, indent=2, ensure_ascii=False)

            self.logger.info(f"✅ 报告已生成: {report_file}")
            return True

        except Exception as e:
            self.logger.error(f"生成报告失败: {e}")
            return False

class FullyAutomatedScript(SafeScript):
    """完全自动化的脚本示例 - 无需任何用户输入"""

    def __init__(self):
        super().__init__(
            name="FullyAutomatedScript",
            max_iterations=5,  # 只执行5次迭代
            timeout_seconds=15   # 15秒超时
        )

    def execute(self):
        """完全自动执行"""
        self.logger.info("开始自动化任务执行...")

        # 模拟一些自动化工作
        tasks = [
            self.task_1_data_processing,
            self.task_2_system_maintenance,
            self.task_3_report_generation
        ]

        for i, task in enumerate(tasks, 1):
            self.logger.info(f"执行任务 {i}: {task.__name__}")

            try:
                success = task()
                if success:
                    self.logger.info(f"✅ 任务 {i} 完成")
                else:
                    self.logger.warning(f"⚠️ 任务 {i} 失败")
            except Exception as e:
                self.logger.error(f"❌ 任务 {i} 异常: {e}")

            # 任务间隔
            time.sleep(1)

        self.logger.info("🎉 所有自动化任务执行完成!")
        return False  # 结束执行

    def task_1_data_processing(self):
        """任务1: 数据处理"""
        self.logger.info("处理数据...")
        time.sleep(1)
        return True

    def task_2_system_maintenance(self):
        """任务2: 系统维护"""
        self.logger.info("执行系统维护...")
        time.sleep(1)
        return True

    def task_3_report_generation(self):
        """任务3: 报告生成"""
        self.logger.info("生成报告...")
        time.sleep(1)
        return True

if __name__ == "__main__":
    print("🤖 自动执行演示")
    print("=" * 50)

    # 演示两种自动执行方式

    # 方式1: 有步骤的自动执行
    print("\n📋 方式1: 步骤化自动执行")
    demo = AutoExecutionDemo()
    demo.run()

    print("\n" + "=" * 50)

    # 方式2: 完全自动化执行
    print("\n🚀 方式2: 完全自动化执行")
    auto_script = FullyAutomatedScript()
    auto_script.run()

    print("\n✅ 自动执行演示完成!")