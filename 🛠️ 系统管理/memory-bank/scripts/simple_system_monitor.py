#!/usr/bin/env python3
"""
简化版系统监控服务
使用标准库实现基本的监控和告警功能
"""

import os
import time
import json
import socket
import threading
import logging
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional
from collections import defaultdict, deque
import urllib.request
import urllib.error

class SimpleSystemMonitor:
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
            'check_interval': 60,  # 60秒检查间隔
            'history_size': 720,   # 保留12小时的历史数据 (12小时 * 60分钟)
            'alert_thresholds': {
                'response_time': 3.0,   # API响应时间阈值
                'error_rate': 10.0      # 错误率阈值
            }
        }

        # 数据存储
        self.metrics_history = defaultdict(lambda: deque(maxlen=self.monitor_config['history_size']))
        self.alerts_history = deque(maxlen=50)
        self.service_status = {}
        self.last_check_time = None

        # 监控状态
        self.monitoring_active = False
        self.monitor_thread = None

        # 服务端口列表
        self.service_ports = {
            'serena_dashboard': 24282,
            'basic_api': 24283,
            'enhanced_api': 24284
        }

        self.logger.info("简化版系统监控服务初始化完成")

    def _setup_logging(self):
        """配置日志"""
        log_file = self.logs_dir / "simple_system_monitor.log"
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s [%(levelname)s] %(message)s',
            handlers=[
                logging.FileHandler(log_file, encoding='utf-8'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger('simple_system_monitor')

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

                # 检查服务状态
                self._check_service_status()

                # 检查文件系统状态
                self._check_filesystem_status()

                # 检查API性能
                self._check_api_performance()

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
                time.sleep(10)  # 出错后等待

    def _check_service_status(self):
        """检查服务状态"""
        timestamp = datetime.now().isoformat()

        # 检查各服务端口状态
        for service_name, port in self.service_ports.items():
            status = self._check_port_status('127.0.0.1', port)
            self.service_status[service_name] = status

            self.metrics_history[f'service_{service_name}'].append({
                'timestamp': timestamp,
                'status': status
            })

            # 记录端口状态变化
            key = f'service_{service_name}_history'
            if key not in self.metrics_history:
                self.metrics_history[key] = deque(maxlen=100)

            if len(self.metrics_history[key]) > 0:
                previous_status = self.metrics_history[key][-1]['status']
                if previous_status != status:
                    change_type = 'up' if status else 'down'
                    self.logger.info(f"服务状态变化: {service_name} {change_type}")

            self.metrics_history[key].append({
                'timestamp': timestamp,
                'status': status
            })

    def _check_filesystem_status(self):
        """检查文件系统状态"""
        timestamp = datetime.now().isoformat()

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

        # 检查日志文件大小
        try:
            log_files = list(self.logs_dir.glob("*.log"))
            total_log_size = sum(f.stat().st_size for f in log_files)

            self.metrics_history['log_size'].append({
                'timestamp': timestamp,
                'total_size_bytes': total_log_size,
                'file_count': len(log_files)
            })

        except Exception as e:
            self.logger.warning(f"检查日志大小失败: {str(e)}")

    def _check_api_performance(self):
        """检查API性能"""
        timestamp = datetime.now().isoformat()

        # 检查基础API
        basic_api_url = "http://127.0.0.1:24283/api/health"
        self._check_api_endpoint(basic_api_url, 'basic_api', timestamp)

        # 检查增强API
        enhanced_api_url = "http://127.0.0.1:24284/api/health"
        self._check_api_endpoint(enhanced_api_url, 'enhanced_api', timestamp)

    def _check_api_endpoint(self, url: str, api_name: str, timestamp: str):
        """检查单个API端点"""
        start_time = time.time()
        try:
            response = self._make_http_request(url)
            response_time = time.time() - start_time

            # 尝试解析JSON响应
            try:
                response_data = json.loads(response)
                api_status = response_data.get('success', True)
            except:
                api_status = True  # 如果不是JSON，认为响应成功

            self.metrics_history[f'api_response_time_{api_name}'].append({
                'timestamp': timestamp,
                'response_time': response_time,
                'status': 'success',
                'api_status': api_status
            })

        except Exception as e:
            response_time = time.time() - start_time
            self.metrics_history[f'api_response_time_{api_name}'].append({
                'timestamp': timestamp,
                'response_time': response_time,
                'status': 'error',
                'error': str(e)
            })

            self.logger.warning(f"API检查失败 {api_name}: {str(e)}")

    def _check_alerts(self):
        """检查告警条件"""
        timestamp = datetime.now().isoformat()
        alerts = []

        # 检查服务状态
        for service_name, port in self.service_ports.items():
            key = f'service_{service_name}'
            if key in self.metrics_history and self.metrics_history[key]:
                latest = self.metrics_history[key][-1]
                if not latest['status']:
                    alerts.append({
                        'type': 'service_down',
                        'level': 'critical',
                        'message': f'{service_name}服务不可用 (端口{port})',
                        'timestamp': timestamp,
                        'service': service_name,
                        'port': port
                    })

        # 检查API响应时间
        for api_name in ['basic_api', 'enhanced_api']:
            key = f'api_response_time_{api_name}'
            if key in self.metrics_history and self.metrics_history[key]:
                latest = self.metrics_history[key][-1]
                if (latest['status'] == 'error' or
                    latest['response_time'] > self.monitor_config['alert_thresholds']['response_time']):

                    level = 'critical' if latest['status'] == 'error' else 'warning'
                    message = (f'{api_name}响应异常: '
                             f'{"连接失败" if latest["status"] == "error" else f"响应时间过慢({latest['response_time']:.2f}s)"}')

                    alerts.append({
                        'type': 'api_issue',
                        'level': level,
                        'message': message,
                        'timestamp': timestamp,
                        'api': api_name,
                        'response_time': latest.get('response_time', 0),
                        'status': latest['status']
                    })

        # 检查文件系统问题
        for dir_name in ['serena_memories', 'memory_bank', 'logs']:
            key = f'directory_{dir_name}'
            if key in self.metrics_history and self.metrics_history[key]:
                latest = self.metrics_history[key][-1]
                if not latest['exists']:
                    alerts.append({
                        'type': 'directory_missing',
                        'level': 'critical',
                        'message': f'关键目录不存在: {dir_name}',
                        'timestamp': timestamp,
                        'directory': dir_name
                    })

        # 记录告警
        for alert in alerts:
            self.alerts_history.append(alert)
            self.logger.warning(f"告警: {alert['message']}")

            # 写入告警日志文件
            alert_log = self.logs_dir / "monitors" / f"alerts_{datetime.now().strftime('%Y%m')}.log"
            with open(alert_log, 'a', encoding='utf-8') as f:
                f.write(f"{timestamp} [{alert['level'].upper()}] {alert['message']}\n")

    def _check_port_status(self, host: str, port: int, timeout: int = 3) -> bool:
        """检查端口状态"""
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
                sock.settimeout(timeout)
                result = sock.connect_ex((host, port))
                return result == 0
        except:
            return False

    def _make_http_request(self, url: str, timeout: int = 5) -> str:
        """简单的HTTP请求"""
        with urllib.request.urlopen(url, timeout=timeout) as response:
            return response.read().decode('utf-8')

    def _save_metrics(self):
        """保存监控指标"""
        timestamp = datetime.now().isoformat()

        # 准备要保存的数据
        current_metrics = {}
        for key, data in self.metrics_history.items():
            if data:
                current_metrics[key] = data[-1]  # 只保存最新数据

        # 系统信息
        system_info = {
            'timestamp': timestamp,
            'hostname': socket.gethostname(),
            'platform': os.name,
            'monitoring_config': self.monitor_config,
            'last_check': self.last_check_time,
            'service_status': self.service_status
        }

        # 保存到文件
        metrics_file = self.logs_dir / "monitors" / "current_metrics.json"
        try:
            with open(metrics_file, 'w', encoding='utf-8') as f:
                json.dump({
                    'system_info': system_info,
                    'current_metrics': dict(current_metrics),
                    'recent_alerts': list(self.alerts_history)[-10:],  # 最近10个告警
                    'total_alerts': len(self.alerts_history)
                }, f, ensure_ascii=False, indent=2)
        except Exception as e:
            self.logger.error(f"保存监控指标失败: {str(e)}")

    def get_monitoring_dashboard(self) -> Dict:
        """获取监控仪表板数据"""
        timestamp = datetime.now().isoformat()

        dashboard = {
            'timestamp': timestamp,
            'status': {
                'monitoring_active': self.monitoring_active,
                'last_check_time': self.last_check_time,
                'total_alerts': len(self.alerts_history)
            },
            'services': {},
            'performance': {},
            'filesystem': {},
            'recent_alerts': list(self.alerts_history)[-5:],
            'uptime_info': self._calculate_uptime()
        }

        # 服务状态
        for service_name in self.service_ports.keys():
            key = f'service_{service_name}'
            if key in self.metrics_history and self.metrics_history[key]:
                latest = self.metrics_history[key][-1]
                dashboard['services'][service_name] = {
                    'status': 'online' if latest['status'] else 'offline',
                    'port': self.service_ports[service_name],
                    'last_check': latest['timestamp']
                }

        # API性能
        for api_name in ['basic_api', 'enhanced_api']:
            key = f'api_response_time_{api_name}'
            if key in self.metrics_history and len(self.metrics_history[key]) >= 5:
                recent_data = list(self.metrics_history[key])[-10:]  # 最近10次
                response_times = [d['response_time'] for d in recent_data if d['status'] == 'success']
                error_count = sum(1 for d in recent_data if d['status'] == 'error')

                if response_times:
                    dashboard['performance'][api_name] = {
                        'avg_response_time': sum(response_times) / len(response_times),
                        'min_response_time': min(response_times),
                        'max_response_time': max(response_times),
                        'success_rate': (len(response_times) / len(recent_data)) * 100,
                        'error_count': error_count,
                        'status': 'healthy' if error_count == 0 else 'warning'
                    }

        # 文件系统状态
        if 'file_counts' in self.metrics_history and self.metrics_history['file_counts']:
            latest_files = self.metrics_history['file_counts'][-1]
            dashboard['filesystem']['files'] = {
                'serena_memories': latest_files.get('serena_memories', 0),
                'memory_bank': latest_files.get('memory_bank', 0),
                'total': latest_files.get('serena_memories', 0) + latest_files.get('memory_bank', 0)
            }

        if 'log_size' in self.metrics_history and self.metrics_history['log_size']:
            latest_logs = self.metrics_history['log_size'][-1]
            dashboard['filesystem']['logs'] = {
                'total_size_mb': latest_logs.get('total_size_bytes', 0) / (1024*1024),
                'file_count': latest_logs.get('file_count', 0)
            }

        return dashboard

    def _calculate_uptime(self) -> Dict:
        """计算运行时间统计"""
        uptime_info = {
            'monitor_start_time': None,
            'current_uptime': 0
        }

        if self.monitoring_active and self.last_check_time:
            # 简化的运行时间计算
            try:
                # 检查监控日志文件的时间
                monitor_log = self.logs_dir / "simple_system_monitor.log"
                if monitor_log.exists():
                    stat = monitor_log.stat()
                    uptime_info['monitor_start_time'] = datetime.fromtimestamp(stat.st_ctime).isoformat()
                    uptime_info['current_uptime'] = int((datetime.now() - stat.st_ctime) / 60)  # 分钟
            except:
                pass

        return uptime_info

    def get_monitoring_report(self) -> Dict:
        """生成监控报告"""
        timestamp = datetime.now().isoformat()

        report = {
            'timestamp': timestamp,
            'summary': self.get_monitoring_dashboard(),
            'alerts_analysis': self._analyze_alerts(),
            'trends': self._analyze_trends(),
            'recommendations': self._generate_recommendations()
        }

        return report

    def _analyze_alerts(self) -> Dict:
        """分析告警数据"""
        recent_alerts = [alert for alert in self.alerts_history
                        if datetime.fromisoformat(alert['timestamp'].replace('Z', '+00:00')) >
                        datetime.now() - timedelta(hours=24)]

        alert_types = defaultdict(int)
        alert_levels = defaultdict(int)

        for alert in recent_alerts:
            alert_types[alert['type']] += 1
            alert_levels[alert['level']] += 1

        return {
            'total_24h': len(recent_alerts),
            'by_type': dict(alert_types),
            'by_level': dict(alert_levels),
            'critical_count': alert_levels['critical'],
            'warning_count': alert_levels['warning']
        }

    def _analyze_trends(self) -> Dict:
        """分析趋势"""
        trends = {}

        # 分析API响应时间趋势
        for api_name in ['basic_api', 'enhanced_api']:
            key = f'api_response_time_{api_name}'
            if key in self.metrics_history and len(self.metrics_history[key]) >= 10:
                recent_data = list(self.metrics_history[key])[-20:]
                response_times = [d['response_time'] for d in recent_data if d['status'] == 'success']

                if response_times:
                    first_half = response_times[:len(response_times)//2]
                    second_half = response_times[len(response_times)//2:]

                    if first_half and second_half:
                        first_avg = sum(first_half) / len(first_half)
                        second_avg = sum(second_half) / len(second_half)

                        trend = 'improving' if second_avg < first_avg else 'degrading'
                        change_percent = ((second_avg - first_avg) / first_avg) * 100 if first_avg > 0 else 0

                        trends[f'{api_name}_response_time'] = {
                            'trend': trend,
                            'change_percent': change_percent,
                            'recent_avg': second_avg
                        }

        return trends

    def _generate_recommendations(self) -> List[str]:
        """生成建议"""
        recommendations = []
        recent_alerts = list(self.alerts_history)[-10:]

        # 基于告警生成建议
        critical_alerts = [a for a in recent_alerts if a['level'] == 'critical']
        if critical_alerts:
            recommendations.append("存在严重告警，建议立即处理相关服务问题")

        service_down_alerts = [a for a in recent_alerts if a['type'] == 'service_down']
        if service_down_alerts:
            recommendations.append("检测到服务不可用，建议检查服务状态并重启")

        api_issue_alerts = [a for a in recent_alerts if a['type'] == 'api_issue']
        if api_issue_alerts:
            recommendations.append("API响应异常，建议检查API服务性能和可用性")

        # 基于趋势生成建议
        if len(recent_alerts) > 5:
            recommendations.append("近期告警频率较高，建议进行系统健康检查")

        return recommendations

def main():
    """主函数 - 运行系统监控"""
    launchx_root = "/Users/dangsiyuan/Documents/obsidion/launch x"
    monitor = SimpleSystemMonitor(launchx_root)

    print("🔍 启动简化版系统监控服务...")

    try:
        monitor.start_monitoring()

        print("📊 监控服务运行中...")
        print("按 Ctrl+C 停止监控")

        # 定期显示状态
        while True:
            time.sleep(120)  # 每2分钟显示一次状态
            dashboard = monitor.get_monitoring_dashboard()

            print(f"\n📈 监控状态 ({datetime.now().strftime('%H:%M:%S')}):")
            print(f"   活跃服务: {sum(1 for s in dashboard['services'].values() if s['status'] == 'online')}/{len(dashboard['services'])}")
            print(f"   总告警数: {dashboard['status']['total_alerts']}")

            for service_name, service_info in dashboard['services'].items():
                status_icon = "✅" if service_info['status'] == 'online' else "❌"
                print(f"   {status_icon} {service_name}: {service_info['status']}")

    except KeyboardInterrupt:
        print("\n⏹️ 正在停止监控...")
        monitor.stop_monitoring()
        print("✅ 监控服务已停止")

if __name__ == "__main__":
    main()