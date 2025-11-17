#!/usr/bin/env python3
"""
系统监控服务
提供全面的系统监控、性能分析和告警功能
"""

import os
import time
import json
import psutil
import threading
import logging
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional
from collections import defaultdict, deque
import socket

class SystemMonitor:
    def __init__(self, launchx_root):
        self.launchx_root = Path(launchx_root)
        self.serena_memories_dir = self.launchx_root / ".serena" / "memories"
        self.memory_bank_dir = self.launchx_root / "🛠️ 系统管理" / "memory-bank"
        self.logs_dir = self.launchx_root / ".serena" / "logs"

        # 确保目录存在
        self.logs_dir.mkdir(parents=True, exist_ok=True)
        (self.logs_dir / "monitors").mkdir(exist_ok=True)

        # 配置日志
        self._setup_logging()

        # 监控配置
        self.monitor_config = {
            'check_interval': 30,  # 30秒检查间隔
            'history_size': 1440,  # 保留24小时的历史数据 (48小时 * 30分钟)
            'alert_thresholds': {
                'cpu_usage': 80.0,      # CPU使用率阈值
                'memory_usage': 85.0,   # 内存使用率阈值
                'disk_usage': 90.0,     # 磁盘使用率阈值
                'response_time': 2.0,   # API响应时间阈值
                'error_rate': 5.0       # 错误率阈值
            }
        }

        # 数据存储
        self.metrics_history = defaultdict(lambda: deque(maxlen=self.monitor_config['history_size']))
        self.alerts_history = deque(maxlen=100)
        self.system_info = {}
        self.last_check_time = None

        # 监控状态
        self.monitoring_active = False
        self.monitor_thread = None

        self.logger.info("系统监控服务初始化完成")

    def _setup_logging(self):
        """配置日志"""
        log_file = self.logs_dir / "system_monitor.log"
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s [%(levelname)s] %(message)s',
            handlers=[
                logging.FileHandler(log_file, encoding='utf-8'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger('system_monitor')

    def start_monitoring(self):
        """启动监控"""
        if self.monitoring_active:
            self.logger.warning("监控已在运行中")
            return

        self.monitoring_active = True
        self.monitor_thread = threading.Thread(target=self._monitoring_loop, daemon=True)
        self.monitor_thread.start()

        self.logger.info("系统监控已启动")

    def stop_monitoring(self):
        """停止监控"""
        self.monitoring_active = False
        if self.monitor_thread:
            self.monitor_thread.join(timeout=5)

        self.logger.info("系统监控已停止")

    def _monitoring_loop(self):
        """监控主循环"""
        while self.monitoring_active:
            try:
                start_time = time.time()

                # 收集系统指标
                self._collect_system_metrics()

                # 检查服务状态
                self._check_service_status()

                # 分析性能指标
                self._analyze_performance()

                # 检查告警条件
                self._check_alerts()

                # 保存监控数据
                self._save_metrics()

                # 记录检查耗时
                check_duration = time.time() - start_time
                self.metrics_history['monitoring_duration'].append({
                    'timestamp': datetime.now().isoformat(),
                    'duration': check_duration
                })

                self.last_check_time = datetime.now().isoformat()

                # 等待下次检查
                time.sleep(self.monitor_config['check_interval'])

            except Exception as e:
                self.logger.error(f"监控循环异常: {str(e)}")
                time.sleep(5)  # 出错后短暂等待

    def _collect_system_metrics(self):
        """收集系统指标"""
        timestamp = datetime.now().isoformat()

        # CPU使用率
        cpu_percent = psutil.cpu_percent(interval=1)
        self.metrics_history['cpu_usage'].append({
            'timestamp': timestamp,
            'value': cpu_percent
        })

        # 内存使用率
        memory = psutil.virtual_memory()
        self.metrics_history['memory_usage'].append({
            'timestamp': timestamp,
            'value': memory.percent,
            'used_gb': memory.used / (1024**3),
            'total_gb': memory.total / (1024**3)
        })

        # 磁盘使用率
        disk = psutil.disk_usage('/')
        disk_percent = (disk.used / disk.total) * 100
        self.metrics_history['disk_usage'].append({
            'timestamp': timestamp,
            'value': disk_percent,
            'used_gb': disk.used / (1024**3),
            'total_gb': disk.total / (1024**3)
        })

        # 网络IO
        net_io = psutil.net_io_counters()
        self.metrics_history['network_io'].append({
            'timestamp': timestamp,
            'bytes_sent': net_io.bytes_sent,
            'bytes_recv': net_io.bytes_recv
        })

        # 进程信息
        self.metrics_history['process_count'].append({
            'timestamp': timestamp,
            'value': len(psutil.pids())
        })

        # 系统负载
        try:
            load_avg = os.getloadavg()
            self.metrics_history['load_average'].append({
                'timestamp': timestamp,
                'load_1m': load_avg[0],
                'load_5m': load_avg[1],
                'load_15m': load_avg[2]
            })
        except (AttributeError, OSError):
            # Windows系统不支持
            pass

    def _check_service_status(self):
        """检查服务状态"""
        timestamp = datetime.now().isoformat()

        # 检查端口状态
        ports_to_check = [24282, 24283, 24284]  # Serena服务、基础API、增强API

        for port in ports_to_check:
            status = self._check_port_status('127.0.0.1', port)
            self.metrics_history[f'port_{port}'].append({
                'timestamp': timestamp,
                'status': status
            })

        # 检查目录状态
        directories = [
            ('serena_memories', self.serena_memories_dir),
            ('memory_bank', self.memory_bank_dir),
            ('logs', self.logs_dir)
        ]

        for name, path in directories:
            exists = path.exists()
            self.metrics_history[f'directory_{name}'].append({
                'timestamp': timestamp,
                'exists': exists
            })

        # 检查文件数量
        try:
            serena_file_count = len(list(self.serena_memories_dir.rglob("*.md")))
            memory_bank_file_count = len(list(self.memory_bank_dir.rglob("*.md")))

            self.metrics_history['file_counts'].append({
                'timestamp': timestamp,
                'serena_memories': serena_file_count,
                'memory_bank': memory_bank_file_count
            })
        except Exception as e:
            self.logger.warning(f"检查文件数量失败: {str(e)}")

    def _analyze_performance(self):
        """分析性能指标"""
        timestamp = datetime.now().isoformat()

        # API响应时间检查（简单检查）
        api_endpoints = [
            ('http://127.0.0.1:24283/api/health', 'basic_api'),
            ('http://127.0.0.1:24284/api/health', 'enhanced_api')
        ]

        for url, name in api_endpoints:
            start_time = time.time()
            try:
                response = self._make_http_request(url)
                response_time = time.time() - start_time

                self.metrics_history[f'api_response_time_{name}'].append({
                    'timestamp': timestamp,
                    'response_time': response_time,
                    'status': 'success'
                })
            except Exception as e:
                response_time = time.time() - start_time
                self.metrics_history[f'api_response_time_{name}'].append({
                    'timestamp': timestamp,
                    'response_time': response_time,
                    'status': 'error',
                    'error': str(e)
                })

    def _check_alerts(self):
        """检查告警条件"""
        timestamp = datetime.now().isoformat()
        alerts = []

        # 检查CPU使用率
        if self.metrics_history['cpu_usage']:
            latest_cpu = self.metrics_history['cpu_usage'][-1]['value']
            if latest_cpu > self.monitor_config['alert_thresholds']['cpu_usage']:
                alerts.append({
                    'type': 'cpu_high',
                    'level': 'warning',
                    'message': f'CPU使用率过高: {latest_cpu:.1f}%',
                    'timestamp': timestamp,
                    'value': latest_cpu,
                    'threshold': self.monitor_config['alert_thresholds']['cpu_usage']
                })

        # 检查内存使用率
        if self.metrics_history['memory_usage']:
            latest_memory = self.metrics_history['memory_usage'][-1]['value']
            if latest_memory > self.monitor_config['alert_thresholds']['memory_usage']:
                alerts.append({
                    'type': 'memory_high',
                    'level': 'warning',
                    'message': f'内存使用率过高: {latest_memory:.1f}%',
                    'timestamp': timestamp,
                    'value': latest_memory,
                    'threshold': self.monitor_config['alert_thresholds']['memory_usage']
                })

        # 检查磁盘使用率
        if self.metrics_history['disk_usage']:
            latest_disk = self.metrics_history['disk_usage'][-1]['value']
            if latest_disk > self.monitor_config['alert_thresholds']['disk_usage']:
                alerts.append({
                    'type': 'disk_high',
                    'level': 'critical',
                    'message': f'磁盘使用率过高: {latest_disk:.1f}%',
                    'timestamp': timestamp,
                    'value': latest_disk,
                    'threshold': self.monitor_config['alert_thresholds']['disk_usage']
                })

        # 检查API响应时间
        for api_name in ['basic_api', 'enhanced_api']:
            key = f'api_response_time_{api_name}'
            if key in self.metrics_history and self.metrics_history[key]:
                latest = self.metrics_history[key][-1]
                if latest['response_time'] > self.monitor_config['alert_thresholds']['response_time']:
                    alerts.append({
                        'type': 'api_slow',
                        'level': 'warning',
                        'message': f'{api_name}响应时间过慢: {latest["response_time"]:.2f}s',
                        'timestamp': timestamp,
                        'api': api_name,
                        'response_time': latest['response_time'],
                        'threshold': self.monitor_config['alert_thresholds']['response_time']
                    })

        # 检查服务状态
        for port in [24282, 24283, 24284]:
            key = f'port_{port}'
            if key in self.metrics_history and self.metrics_history[key]:
                latest = self.metrics_history[key][-1]
                if not latest['status']:
                    alerts.append({
                        'type': 'service_down',
                        'level': 'critical',
                        'message': f'端口{port}服务不可用',
                        'timestamp': timestamp,
                        'port': port
                    })

        # 记录告警
        for alert in alerts:
            self.alerts_history.append(alert)
            self.logger.warning(f"告警: {alert['message']}")

            # 写入告警日志文件
            alert_log = self.logs_dir / "monitors" / f"alerts_{datetime.now().strftime('%Y%m')}.log"
            with open(alert_log, 'a', encoding='utf-8') as f:
                f.write(f"{timestamp} [{alert['level'].upper()}] {alert['message']}\n")

    def _check_port_status(self, host, port, timeout=3):
        """检查端口状态"""
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
                sock.settimeout(timeout)
                result = sock.connect_ex((host, port))
                return result == 0
        except:
            return False

    def _make_http_request(self, url, timeout=5):
        """简单的HTTP请求"""
        import urllib.request
        import urllib.error

        try:
            with urllib.request.urlopen(url, timeout=timeout) as response:
                return response.read().decode('utf-8')
        except urllib.error.URLError as e:
            raise Exception(f"HTTP请求失败: {str(e)}")

    def _save_metrics(self):
        """保存监控指标"""
        timestamp = datetime.now().isoformat()

        # 准备要保存的数据
        current_metrics = {}
        for key, data in self.metrics_history.items():
            if data:
                current_metrics[key] = data[-1]  # 只保存最新数据

        # 系统信息
        self.system_info = {
            'timestamp': timestamp,
            'hostname': socket.gethostname(),
            'platform': os.name,
            'python_version': f"{os.sys.version_info.major}.{os.sys.version_info.minor}.{os.sys.version_info.micro}",
            'monitoring_config': self.monitor_config,
            'last_check': self.last_check_time
        }

        # 保存到文件
        metrics_file = self.logs_dir / "monitors" / "current_metrics.json"
        try:
            with open(metrics_file, 'w', encoding='utf-8') as f:
                json.dump({
                    'system_info': self.system_info,
                    'current_metrics': dict(current_metrics),
                    'recent_alerts': list(self.alerts_history)[-10:]  # 最近10个告警
                }, f, ensure_ascii=False, indent=2)
        except Exception as e:
            self.logger.error(f"保存监控指标失败: {str(e)}")

    def get_monitoring_status(self) -> Dict:
        """获取监控状态"""
        return {
            'monitoring_active': self.monitoring_active,
            'last_check_time': self.last_check_time,
            'check_interval': self.monitor_config['check_interval'],
            'history_size': self.monitor_config['history_size'],
            'total_alerts': len(self.alerts_history),
            'recent_alerts': list(self.alerts_history)[-5:],
            'system_info': self.system_info
        }

    def get_current_metrics(self) -> Dict:
        """获取当前监控指标"""
        current_metrics = {}

        for key, data in self.metrics_history.items():
            if data:
                current_metrics[key] = data[-1]

        return current_metrics

    def get_metrics_history(self, metric_name: str, hours: int = 1) -> List:
        """获取历史指标数据"""
        if metric_name not in self.metrics_history:
            return []

        cutoff_time = datetime.now() - timedelta(hours=hours)
        return [
            item for item in self.metrics_history[metric_name]
            if datetime.fromisoformat(item['timestamp'].replace('Z', '+00:00')) > cutoff_time
        ]

    def generate_monitoring_report(self) -> Dict:
        """生成监控报告"""
        timestamp = datetime.now().isoformat()

        report = {
            'timestamp': timestamp,
            'monitoring_status': self.get_monitoring_status(),
            'current_metrics': self.get_current_metrics(),
            'performance_summary': {},
            'alerts_summary': {},
            'recommendations': []
        }

        # 性能摘要
        if 'cpu_usage' in self.metrics_history and self.metrics_history['cpu_usage']:
            cpu_values = [item['value'] for item in self.metrics_history['cpu_usage']]
            report['performance_summary']['cpu'] = {
                'current': cpu_values[-1] if cpu_values else 0,
                'average': sum(cpu_values) / len(cpu_values),
                'max': max(cpu_values),
                'min': min(cpu_values)
            }

        if 'memory_usage' in self.metrics_history and self.metrics_history['memory_usage']:
            memory_values = [item['value'] for item in self.metrics_history['memory_usage']]
            report['performance_summary']['memory'] = {
                'current': memory_values[-1] if memory_values else 0,
                'average': sum(memory_values) / len(memory_values),
                'max': max(memory_values),
                'min': min(memory_values)
            }

        # 告警摘要
        recent_alerts = [alert for alert in self.alerts_history
                        if datetime.fromisoformat(alert['timestamp'].replace('Z', '+00:00')) >
                        datetime.now() - timedelta(hours=24)]

        alert_counts = defaultdict(int)
        for alert in recent_alerts:
            alert_counts[alert['type']] += 1

        report['alerts_summary'] = {
            'total_24h': len(recent_alerts),
            'by_type': dict(alert_counts),
            'critical_count': sum(1 for alert in recent_alerts if alert['level'] == 'critical'),
            'warning_count': sum(1 for alert in recent_alerts if alert['level'] == 'warning')
        }

        # 生成建议
        recommendations = []

        if report['performance_summary'].get('cpu', {}).get('average', 0) > 70:
            recommendations.append("CPU使用率较高，建议优化系统负载或增加计算资源")

        if report['performance_summary'].get('memory', {}).get('average', 0) > 80:
            recommendations.append("内存使用率较高，建议检查内存泄漏或增加内存容量")

        if report['alerts_summary']['critical_count'] > 0:
            recommendations.append("存在严重告警，建议立即处理相关服务问题")

        if report['alerts_summary']['total_24h'] > 10:
            recommendations.append("24小时内告警数量较多，建议进行系统健康检查")

        report['recommendations'] = recommendations

        return report

def main():
    """主函数 - 运行系统监控"""
    launchx_root = "/Users/dangsiyuan/Documents/obsidion/launch x"
    monitor = SystemMonitor(launchx_root)

    print("🔍 启动系统监控服务...")

    try:
        monitor.start_monitoring()

        print("📊 监控服务运行中...")
        print("按 Ctrl+C 停止监控")

        # 定期显示状态
        while True:
            time.sleep(60)  # 每分钟显示一次状态
            status = monitor.get_monitoring_status()
            current = monitor.get_current_metrics()

            print(f"\n📈 监控状态 ({datetime.now().strftime('%H:%M:%S')}):")
            print(f"   CPU: {current.get('cpu_usage', {}).get('value', 0):.1f}%")
            print(f"   内存: {current.get('memory_usage', {}).get('value', 0):.1f}%")
            print(f"   磁盘: {current.get('disk_usage', {}).get('value', 0):.1f}%")
            print(f"   告警数: {status['total_alerts']}")

    except KeyboardInterrupt:
        print("\n⏹️ 正在停止监控...")
        monitor.stop_monitoring()
        print("✅ 监控服务已停止")

if __name__ == "__main__":
    main()