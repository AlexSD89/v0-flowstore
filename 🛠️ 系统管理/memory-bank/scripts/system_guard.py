#!/usr/bin/env python3
"""
系统守护进程
实时监控系统资源，自动处理异常情况
"""
import os
import sys
import time
import json
import signal
import psutil
import logging
from datetime import datetime, timedelta
from pathlib import Path

class SystemGuard:
    """系统守护进程"""

    def __init__(self, config_file=None):
        self.config = self.load_config(config_file)
        self.setup_logging()
        self.running = False
        self.alerts = []

    def load_config(self, config_file):
        """加载配置文件"""
        default_config = {
            "cpu_threshold": 80,
            "memory_threshold": 85,
            "disk_threshold": 90,
            "process_cpu_threshold": 95,
            "process_memory_threshold": 512,  # MB
            "check_interval": 5,  # 秒
            "auto_kill_threshold": 98,  # 自动终止阈值
            "log_file": ".serena/logs/system_guard.log",
            "alert_history_file": ".serena/logs/alerts.json",
            "protected_processes": ["python", "node", "claude"]
        }

        if config_file and Path(config_file).exists():
            try:
                with open(config_file, 'r', encoding='utf-8') as f:
                    user_config = json.load(f)
                default_config.update(user_config)
            except Exception as e:
                print(f"⚠️ 配置文件加载失败，使用默认配置: {e}")

        return default_config

    def setup_logging(self):
        """设置日志"""
        log_dir = Path(self.config["log_file"]).parent
        log_dir.mkdir(parents=True, exist_ok=True)

        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
            handlers=[
                logging.FileHandler(self.config["log_file"], encoding='utf-8'),
                logging.StreamHandler(sys.stdout)
            ]
        )
        self.logger = logging.getLogger("SystemGuard")

    def check_system_resources(self):
        """检查系统资源"""
        try:
            # CPU使用率
            cpu_percent = psutil.cpu_percent(interval=1)

            # 内存使用率
            memory = psutil.virtual_memory()
            memory_percent = memory.percent

            # 磁盘使用率
            disk = psutil.disk_usage('/')
            disk_percent = disk.percent

            return {
                "cpu": cpu_percent,
                "memory": memory_percent,
                "disk": disk_percent,
                "memory_available_gb": memory.available / (1024**3),
                "disk_free_gb": disk.free / (1024**3)
            }
        except Exception as e:
            self.logger.error(f"系统资源检查失败: {e}")
            return None

    def check_problematic_processes(self):
        """检查有问题的进程"""
        problematic = []

        for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent', 'memory_info']):
            try:
                proc_info = proc.info

                # 检查CPU使用率
                if proc_info['cpu_percent'] > self.config['process_cpu_threshold']:
                    problematic.append({
                        "pid": proc_info['pid'],
                        "name": proc_info['name'],
                        "type": "high_cpu",
                        "value": proc_info['cpu_percent'],
                        "threshold": self.config['process_cpu_threshold']
                    })

                # 检查内存使用
                memory_mb = proc_info['memory_info'].rss / 1024 / 1024
                if memory_mb > self.config['process_memory_threshold']:
                    problematic.append({
                        "pid": proc_info['pid'],
                        "name": proc_info['name'],
                        "type": "high_memory",
                        "value": memory_mb,
                        "threshold": self.config['process_memory_threshold']
                    })

            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                continue

        return problematic

    def handle_problematic_process(self, proc_info):
        """处理有问题的进程"""
        pid = proc_info['pid']
        name = proc_info['name']
        problem_type = proc_info['type']

        # 检查是否是受保护的进程
        if name.lower() in self.config['protected_processes']:
            self.logger.warning(f"受保护进程 {name}({pid}) 出现问题: {problem_type}")
            return False

        try:
            process = psutil.Process(pid)

            if problem_type == "high_cpu" and proc_info['value'] > self.config['auto_kill_threshold']:
                self.logger.critical(f"自动终止高CPU进程: {name}({pid}) - {proc_info['value']:.1f}%")
                process.terminate()
                return True

            elif problem_type == "high_memory":
                memory_mb = proc_info['value']
                if memory_mb > self.config['process_memory_threshold'] * 3:  # 超过3倍阈值
                    self.logger.critical(f"自动终止高内存进程: {name}({pid}) - {memory_mb:.1f}MB")
                    process.terminate()
                    return True

        except (psutil.NoSuchProcess, psutil.AccessDenied):
            self.logger.warning(f"无法访问进程 {pid}")
            return False

        return False

    def save_alert(self, alert_data):
        """保存告警记录"""
        try:
            alerts_file = Path(self.config["alert_history_file"])
            alerts_file.parent.mkdir(parents=True, exist_ok=True)

            # 读取现有告警
            alerts = []
            if alerts_file.exists():
                try:
                    with open(alerts_file, 'r', encoding='utf-8') as f:
                        alerts = json.load(f)
                except json.JSONDecodeError:
                    alerts = []

            # 添加新告警
            alert = {
                "timestamp": datetime.now().isoformat(),
                **alert_data
            }
            alerts.append(alert)

            # 保留最近100条告警
            if len(alerts) > 100:
                alerts = alerts[-100:]

            # 保存告警
            with open(alerts_file, 'w', encoding='utf-8') as f:
                json.dump(alerts, f, indent=2, ensure_ascii=False)

        except Exception as e:
            self.logger.error(f"保存告警失败: {e}")

    def run_once(self):
        """执行一次检查"""
        # 检查系统资源
        resources = self.check_system_resources()
        if resources:
            self.logger.info(f"系统资源: CPU={resources['cpu']:.1f}%, "
                           f"内存={resources['memory']:.1f}%, "
                           f"磁盘={resources['disk']:.1f}%")

            # 检查阈值告警
            if resources['cpu'] > self.config['cpu_threshold']:
                alert = {"type": "system_high_cpu", "value": resources['cpu'], "threshold": self.config['cpu_threshold']}
                self.save_alert(alert)
                self.logger.warning(f"系统CPU使用率过高: {resources['cpu']:.1f}%")

            if resources['memory'] > self.config['memory_threshold']:
                alert = {"type": "system_high_memory", "value": resources['memory'], "threshold": self.config['memory_threshold']}
                self.save_alert(alert)
                self.logger.warning(f"系统内存使用率过高: {resources['memory']:.1f}%")

            if resources['disk'] > self.config['disk_threshold']:
                alert = {"type": "system_high_disk", "value": resources['disk'], "threshold": self.config['disk_threshold']}
                self.save_alert(alert)
                self.logger.warning(f"系统磁盘使用率过高: {resources['disk']:.1f}%")

        # 检查问题进程
        problematic = self.check_problematic_processes()
        if problematic:
            self.logger.warning(f"发现 {len(problematic)} 个问题进程")

            for proc_info in problematic:
                self.save_alert({"type": "process_issue", "details": proc_info})
                killed = self.handle_problematic_process(proc_info)
                if killed:
                    self.logger.info(f"已处理问题进程: {proc_info['name']}({proc_info['pid']})")

        return resources, problematic

    def run(self):
        """运行守护进程"""
        self.running = True
        self.logger.info("系统守护进程启动")

        try:
            while self.running:
                start_time = time.time()

                resources, problematic = self.run_once()

                # 计算下次检查时间
                elapsed = time.time() - start_time
                sleep_time = max(0, self.config['check_interval'] - elapsed)

                if sleep_time > 0:
                    time.sleep(sleep_time)

        except KeyboardInterrupt:
            self.logger.info("收到中断信号，正在停止...")
        except Exception as e:
            self.logger.error(f"守护进程运行异常: {e}")
        finally:
            self.running = False
            self.logger.info("系统守护进程停止")

    def stop(self):
        """停止守护进程"""
        self.running = False

def create_guard_config():
    """创建默认配置文件"""
    config = {
        "cpu_threshold": 80,
        "memory_threshold": 85,
        "disk_threshold": 90,
        "process_cpu_threshold": 95,
        "process_memory_threshold": 512,
        "check_interval": 5,
        "auto_kill_threshold": 98,
        "log_file": ".serena/logs/system_guard.log",
        "alert_history_file": ".serena/logs/alerts.json",
        "protected_processes": ["python", "node", "claude"]
    }

    config_file = Path(".serena/config/system_guard.json")
    config_file.parent.mkdir(parents=True, exist_ok=True)

    with open(config_file, 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=2, ensure_ascii=False)

    print(f"✅ 配置文件已创建: {config_file}")
    return str(config_file)

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="系统守护进程")
    parser.add_argument("--config", help="配置文件路径")
    parser.add_argument("--create-config", action="store_true", help="创建默认配置文件")
    parser.add_argument("--daemon", action="store_true", help="后台运行")
    parser.add_argument("--test", action="store_true", help="测试运行一次")

    args = parser.parse_args()

    if args.create_config:
        create_guard_config()
        sys.exit(0)

    # 创建守护进程
    guard = SystemGuard(args.config)

    if args.test:
        # 测试运行一次
        resources, problematic = guard.run_once()
        print(f"测试完成 - 资源: {resources}, 问题进程: {len(problematic) if problematic else 0}")
    elif args.daemon:
        # 后台运行
        import daemon
        with daemon.DaemonContext():
            guard.run()
    else:
        # 前台运行
        guard.run()