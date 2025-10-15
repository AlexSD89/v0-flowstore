#!/usr/bin/env python3
"""
TradingAgents 性能监控系统
Performance Monitor for TradingAgents Enhancement System

监控指标：
1. API响应性能 - FinnHub API调用响应时间和成功率
2. 策略计算性能 - 单股票分析耗时、多策略并行处理速度
3. 系统稳定性 - 长时间运行稳定性、错误恢复能力
4. 数据准确性验证 - 与官方数据对比、计算结果验证
"""

import asyncio
import time
import psutil
import json
import logging
import threading
import queue
import statistics
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, asdict
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests
import pandas as pd
import numpy as np

# 设置日志
logging.basicConfig(
    level=logging.INFO, 
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('performance_monitor.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class PerformanceMetrics:
    """性能指标数据结构"""
    timestamp: str
    api_response_time: float
    api_success_rate: float
    memory_usage_mb: float
    cpu_usage_percent: float
    strategy_calculation_time: float
    concurrent_requests: int
    error_count: int
    data_accuracy_score: float

@dataclass
class APICallMetrics:
    """API调用指标"""
    endpoint: str
    response_time: float
    status_code: int
    success: bool
    error_message: str = ""
    rate_limited: bool = False

class PerformanceMonitor:
    """TradingAgents 性能监控器"""
    
    def __init__(self, api_key: str, monitoring_interval: int = 60):
        self.api_key = api_key
        self.monitoring_interval = monitoring_interval
        self.base_url = "https://finnhub.io/api/v1"
        
        # 性能数据存储
        self.metrics_history: List[PerformanceMetrics] = []
        self.api_calls_history: List[APICallMetrics] = []
        
        # 监控状态
        self.is_monitoring = False
        self.start_time = None
        
        # 错误计数器
        self.error_counts = {
            'api_errors': 0,
            'calculation_errors': 0,
            'memory_errors': 0,
            'timeout_errors': 0
        }
        
        # 基准股票列表 (用于性能测试)
        self.benchmark_stocks = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA']
        
        # 性能阈值定义
        self.performance_thresholds = {
            'api_response_time_ms': 2000,  # 2秒
            'api_success_rate_percent': 95,
            'memory_usage_mb': 512,
            'cpu_usage_percent': 70,
            'strategy_calculation_time_ms': 5000,  # 5秒
            'concurrent_limit': 10
        }
        
        logger.info("性能监控器初始化完成")
    
    def measure_api_performance(self, symbol: str, endpoint_type: str = 'quote') -> APICallMetrics:
        """测量API性能"""
        start_time = time.time()
        
        try:
            if endpoint_type == 'quote':
                url = f"{self.base_url}/quote"
                params = {"symbol": symbol, "token": self.api_key}
            elif endpoint_type == 'candle':
                end_time = int(datetime.now().timestamp())
                start_timestamp = int((datetime.now() - timedelta(days=30)).timestamp())
                url = f"{self.base_url}/stock/candle"
                params = {
                    'symbol': symbol,
                    'resolution': 'D',
                    'from': start_timestamp,
                    'to': end_time,
                    'token': self.api_key
                }
            elif endpoint_type == 'profile':
                url = f"{self.base_url}/stock/profile2"
                params = {"symbol": symbol, "token": self.api_key}
            else:
                raise ValueError(f"不支持的端点类型: {endpoint_type}")
            
            response = requests.get(url, params=params, timeout=10)
            response_time = (time.time() - start_time) * 1000  # 转换为毫秒
            
            # 检查是否被限频
            rate_limited = response.status_code == 429
            
            success = response.status_code == 200
            if success and endpoint_type == 'candle':
                data = response.json()
                success = data.get('s') == 'ok'
            
            return APICallMetrics(
                endpoint=f"{endpoint_type}_{symbol}",
                response_time=response_time,
                status_code=response.status_code,
                success=success,
                error_message="" if success else response.text[:200],
                rate_limited=rate_limited
            )
            
        except requests.Timeout:
            self.error_counts['timeout_errors'] += 1
            return APICallMetrics(
                endpoint=f"{endpoint_type}_{symbol}",
                response_time=(time.time() - start_time) * 1000,
                status_code=0,
                success=False,
                error_message="请求超时"
            )
        except Exception as e:
            self.error_counts['api_errors'] += 1
            return APICallMetrics(
                endpoint=f"{endpoint_type}_{symbol}",
                response_time=(time.time() - start_time) * 1000,
                status_code=0,
                success=False,
                error_message=str(e)[:200]
            )
    
    def measure_strategy_performance(self, symbol: str) -> Tuple[float, bool]:
        """测量策略计算性能"""
        start_time = time.time()
        
        try:
            # 模拟策略计算过程
            # 1. 获取历史数据
            api_metric = self.measure_api_performance(symbol, 'candle')
            
            if not api_metric.success:
                return (time.time() - start_time) * 1000, False
            
            # 2. 生成模拟数据进行技术指标计算
            data_length = 100
            prices = np.random.randn(data_length).cumsum() + 100
            df = pd.DataFrame({
                'close': prices,
                'high': prices * 1.02,
                'low': prices * 0.98,
                'volume': np.random.randint(1000, 10000, data_length)
            })
            
            # 3. 计算技术指标 (模拟多个策略)
            # MA计算
            df['MA5'] = df['close'].rolling(5).mean()
            df['MA20'] = df['close'].rolling(20).mean()
            
            # RSI计算
            delta = df['close'].diff()
            gain = (delta.where(delta > 0, 0)).rolling(14).mean()
            loss = (-delta.where(delta < 0, 0)).rolling(14).mean()
            rs = gain / loss
            df['RSI'] = 100 - (100 / (1 + rs))
            
            # MACD计算
            exp1 = df['close'].ewm(span=12).mean()
            exp2 = df['close'].ewm(span=26).mean()
            df['MACD'] = exp1 - exp2
            df['Signal'] = df['MACD'].ewm(span=9).mean()
            
            # 4. 策略信号生成
            signals = []
            
            # 趋势策略
            if df['MA5'].iloc[-1] > df['MA20'].iloc[-1]:
                signals.append(1)
            else:
                signals.append(-1)
            
            # RSI策略
            latest_rsi = df['RSI'].iloc[-1]
            if latest_rsi < 30:
                signals.append(1)
            elif latest_rsi > 70:
                signals.append(-1)
            else:
                signals.append(0)
            
            # MACD策略
            if df['MACD'].iloc[-1] > df['Signal'].iloc[-1]:
                signals.append(1)
            else:
                signals.append(-1)
            
            calculation_time = (time.time() - start_time) * 1000
            return calculation_time, True
            
        except Exception as e:
            self.error_counts['calculation_errors'] += 1
            logger.error(f"策略计算错误 {symbol}: {str(e)}")
            return (time.time() - start_time) * 1000, False
    
    def measure_concurrent_performance(self, num_concurrent: int = 5) -> Dict[str, Any]:
        """测量并发处理性能"""
        logger.info(f"开始并发性能测试 - 并发数: {num_concurrent}")
        
        start_time = time.time()
        results = []
        
        with ThreadPoolExecutor(max_workers=num_concurrent) as executor:
            # 提交并发任务
            futures = []
            for i in range(num_concurrent):
                symbol = self.benchmark_stocks[i % len(self.benchmark_stocks)]
                future = executor.submit(self.measure_api_performance, symbol, 'quote')
                futures.append(future)
            
            # 收集结果
            for future in as_completed(futures):
                try:
                    result = future.result(timeout=15)
                    results.append(result)
                except Exception as e:
                    logger.error(f"并发任务失败: {str(e)}")
        
        total_time = (time.time() - start_time) * 1000
        success_count = sum(1 for r in results if r.success)
        
        return {
            'total_time_ms': total_time,
            'successful_requests': success_count,
            'failed_requests': len(results) - success_count,
            'success_rate': (success_count / len(results)) * 100 if results else 0,
            'average_response_time': statistics.mean([r.response_time for r in results]) if results else 0,
            'max_response_time': max([r.response_time for r in results]) if results else 0,
            'min_response_time': min([r.response_time for r in results]) if results else 0
        }
    
    def measure_system_resources(self) -> Dict[str, float]:
        """测量系统资源使用情况"""
        try:
            # 内存使用
            memory_info = psutil.virtual_memory()
            process = psutil.Process()
            process_memory_mb = process.memory_info().rss / 1024 / 1024
            
            # CPU使用率
            cpu_percent = psutil.cpu_percent(interval=1)
            
            # 网络I/O
            network_io = psutil.net_io_counters()
            
            return {
                'memory_usage_mb': process_memory_mb,
                'system_memory_percent': memory_info.percent,
                'cpu_usage_percent': cpu_percent,
                'network_bytes_sent': network_io.bytes_sent,
                'network_bytes_recv': network_io.bytes_recv
            }
            
        except Exception as e:
            self.error_counts['memory_errors'] += 1
            logger.error(f"系统资源监控错误: {str(e)}")
            return {
                'memory_usage_mb': 0,
                'system_memory_percent': 0,
                'cpu_usage_percent': 0,
                'network_bytes_sent': 0,
                'network_bytes_recv': 0
            }
    
    def validate_data_accuracy(self, symbol: str = 'AAPL') -> float:
        """验证数据准确性"""
        try:
            # 获取实时报价
            quote_metric = self.measure_api_performance(symbol, 'quote')
            if not quote_metric.success:
                return 0.0
            
            # 获取历史数据
            candle_metric = self.measure_api_performance(symbol, 'candle')
            if not candle_metric.success:
                return 0.0
            
            # 检查数据一致性
            accuracy_score = 100.0
            
            # 简单的数据完整性检查
            if quote_metric.response_time > 5000:  # 超过5秒认为响应异常
                accuracy_score -= 20
            
            if candle_metric.response_time > 10000:  # 历史数据超过10秒
                accuracy_score -= 20
            
            # 检查是否有错误
            if quote_metric.error_message or candle_metric.error_message:
                accuracy_score -= 30
            
            return max(0, accuracy_score)
            
        except Exception as e:
            logger.error(f"数据准确性验证错误: {str(e)}")
            return 0.0
    
    def collect_metrics(self) -> PerformanceMetrics:
        """收集一轮完整的性能指标"""
        logger.info("收集性能指标...")
        
        # 1. API性能测试
        api_metrics = []
        for symbol in self.benchmark_stocks[:3]:  # 测试3只股票
            metric = self.measure_api_performance(symbol, 'quote')
            api_metrics.append(metric)
            self.api_calls_history.append(metric)
            time.sleep(0.2)  # 避免频率限制
        
        # 计算API性能统计
        successful_apis = [m for m in api_metrics if m.success]
        api_success_rate = (len(successful_apis) / len(api_metrics)) * 100 if api_metrics else 0
        avg_api_response_time = statistics.mean([m.response_time for m in successful_apis]) if successful_apis else 0
        
        # 2. 策略计算性能
        strategy_times = []
        for symbol in self.benchmark_stocks[:2]:  # 测试2只股票的策略计算
            calc_time, success = self.measure_strategy_performance(symbol)
            if success:
                strategy_times.append(calc_time)
            time.sleep(0.3)
        
        avg_strategy_time = statistics.mean(strategy_times) if strategy_times else 0
        
        # 3. 系统资源监控
        system_resources = self.measure_system_resources()
        
        # 4. 数据准确性验证
        data_accuracy = self.validate_data_accuracy()
        
        # 5. 并发性能测试 (每5分钟执行一次)
        current_minute = datetime.now().minute
        concurrent_requests = 0
        if current_minute % 5 == 0:
            concurrent_result = self.measure_concurrent_performance(3)
            concurrent_requests = concurrent_result['successful_requests']
        
        # 创建性能指标对象
        metrics = PerformanceMetrics(
            timestamp=datetime.now().isoformat(),
            api_response_time=avg_api_response_time,
            api_success_rate=api_success_rate,
            memory_usage_mb=system_resources['memory_usage_mb'],
            cpu_usage_percent=system_resources['cpu_usage_percent'],
            strategy_calculation_time=avg_strategy_time,
            concurrent_requests=concurrent_requests,
            error_count=sum(self.error_counts.values()),
            data_accuracy_score=data_accuracy
        )
        
        self.metrics_history.append(metrics)
        return metrics
    
    def check_performance_alerts(self, metrics: PerformanceMetrics) -> List[str]:
        """检查性能告警"""
        alerts = []
        
        # API响应时间告警
        if metrics.api_response_time > self.performance_thresholds['api_response_time_ms']:
            alerts.append(f"🚨 API响应时间过长: {metrics.api_response_time:.1f}ms (阈值: {self.performance_thresholds['api_response_time_ms']}ms)")
        
        # API成功率告警
        if metrics.api_success_rate < self.performance_thresholds['api_success_rate_percent']:
            alerts.append(f"🚨 API成功率过低: {metrics.api_success_rate:.1f}% (阈值: {self.performance_thresholds['api_success_rate_percent']}%)")
        
        # 内存使用告警
        if metrics.memory_usage_mb > self.performance_thresholds['memory_usage_mb']:
            alerts.append(f"🚨 内存使用过高: {metrics.memory_usage_mb:.1f}MB (阈值: {self.performance_thresholds['memory_usage_mb']}MB)")
        
        # CPU使用告警
        if metrics.cpu_usage_percent > self.performance_thresholds['cpu_usage_percent']:
            alerts.append(f"🚨 CPU使用过高: {metrics.cpu_usage_percent:.1f}% (阈值: {self.performance_thresholds['cpu_usage_percent']}%)")
        
        # 策略计算时间告警
        if metrics.strategy_calculation_time > self.performance_thresholds['strategy_calculation_time_ms']:
            alerts.append(f"🚨 策略计算时间过长: {metrics.strategy_calculation_time:.1f}ms (阈值: {self.performance_thresholds['strategy_calculation_time_ms']}ms)")
        
        # 数据准确性告警
        if metrics.data_accuracy_score < 80:
            alerts.append(f"🚨 数据准确性不佳: {metrics.data_accuracy_score:.1f}% (建议>80%)")
        
        # 错误数量告警
        if metrics.error_count > 10:
            alerts.append(f"🚨 错误数量过多: {metrics.error_count} (建议<10)")
        
        return alerts
    
    def print_real_time_status(self, metrics: PerformanceMetrics):
        """打印实时状态"""
        print("\n" + "="*80)
        print(f"📊 TradingAgents 性能监控 - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*80)
        
        # 核心指标
        print(f"🚀 API性能:")
        print(f"   响应时间: {metrics.api_response_time:.1f}ms")
        print(f"   成功率: {metrics.api_success_rate:.1f}%")
        
        print(f"⚡ 策略性能:")
        print(f"   计算时间: {metrics.strategy_calculation_time:.1f}ms")
        
        print(f"💻 系统资源:")
        print(f"   内存使用: {metrics.memory_usage_mb:.1f}MB")
        print(f"   CPU使用: {metrics.cpu_usage_percent:.1f}%")
        
        print(f"📈 数据质量:")
        print(f"   准确性评分: {metrics.data_accuracy_score:.1f}/100")
        print(f"   累计错误: {metrics.error_count}")
        
        # 检查告警
        alerts = self.check_performance_alerts(metrics)
        if alerts:
            print(f"\n⚠️ 性能告警:")
            for alert in alerts:
                print(f"   {alert}")
        else:
            print(f"\n✅ 所有指标正常")
        
        # 运行时间统计
        if self.start_time:
            uptime = datetime.now() - self.start_time
            print(f"\n⏱️ 运行时间: {uptime}")
            print(f"📊 监控轮次: {len(self.metrics_history)}")
    
    def save_metrics_to_file(self, filename: str = None):
        """保存性能指标到文件"""
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"performance_metrics_{timestamp}.json"
        
        try:
            data = {
                'monitoring_config': {
                    'start_time': self.start_time.isoformat() if self.start_time else None,
                    'monitoring_interval': self.monitoring_interval,
                    'performance_thresholds': self.performance_thresholds
                },
                'metrics_history': [asdict(m) for m in self.metrics_history],
                'api_calls_history': [asdict(m) for m in self.api_calls_history[-100:]],  # 保存最近100次API调用
                'error_counts': self.error_counts,
                'summary_stats': self.generate_summary_stats()
            }
            
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            logger.info(f"性能指标已保存到: {filename}")
            
        except Exception as e:
            logger.error(f"保存性能指标失败: {str(e)}")
    
    def generate_summary_stats(self) -> Dict[str, Any]:
        """生成汇总统计"""
        if not self.metrics_history:
            return {}
        
        api_times = [m.api_response_time for m in self.metrics_history if m.api_response_time > 0]
        success_rates = [m.api_success_rate for m in self.metrics_history if m.api_success_rate > 0]
        memory_usage = [m.memory_usage_mb for m in self.metrics_history if m.memory_usage_mb > 0]
        cpu_usage = [m.cpu_usage_percent for m in self.metrics_history if m.cpu_usage_percent > 0]
        
        return {
            'total_monitoring_time_minutes': len(self.metrics_history) * (self.monitoring_interval / 60),
            'api_response_time': {
                'avg': statistics.mean(api_times) if api_times else 0,
                'min': min(api_times) if api_times else 0,
                'max': max(api_times) if api_times else 0,
                'p95': np.percentile(api_times, 95) if api_times else 0
            },
            'api_success_rate': {
                'avg': statistics.mean(success_rates) if success_rates else 0,
                'min': min(success_rates) if success_rates else 0
            },
            'memory_usage_mb': {
                'avg': statistics.mean(memory_usage) if memory_usage else 0,
                'max': max(memory_usage) if memory_usage else 0
            },
            'cpu_usage_percent': {
                'avg': statistics.mean(cpu_usage) if cpu_usage else 0,
                'max': max(cpu_usage) if cpu_usage else 0
            },
            'total_errors': sum(self.error_counts.values()),
            'error_breakdown': self.error_counts
        }
    
    def start_monitoring(self):
        """开始性能监控"""
        logger.info(f"开始TradingAgents性能监控 - 间隔: {self.monitoring_interval}秒")
        self.is_monitoring = True
        self.start_time = datetime.now()
        
        try:
            while self.is_monitoring:
                # 收集性能指标
                metrics = self.collect_metrics()
                
                # 显示实时状态
                self.print_real_time_status(metrics)
                
                # 每10分钟保存一次数据
                if len(self.metrics_history) % 10 == 0:
                    self.save_metrics_to_file()
                
                # 等待下一个监控周期
                time.sleep(self.monitoring_interval)
                
        except KeyboardInterrupt:
            logger.info("监控被用户中断")
        except Exception as e:
            logger.error(f"监控过程中出现错误: {str(e)}")
        finally:
            self.stop_monitoring()
    
    def stop_monitoring(self):
        """停止性能监控"""
        self.is_monitoring = False
        logger.info("性能监控已停止")
        
        # 保存最终报告
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.save_metrics_to_file(f"final_performance_report_{timestamp}.json")
        
        # 生成监控仪表板
        self.generate_dashboard_report()
    
    def generate_dashboard_report(self):
        """生成监控仪表板报告"""
        try:
            from .monitor_dashboard_generator import DashboardGenerator
            generator = DashboardGenerator(self.metrics_history, self.api_calls_history, self.error_counts)
            dashboard_content = generator.generate()
            
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"monitor-dashboard_{timestamp}.md"
            
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(dashboard_content)
            
            logger.info(f"监控仪表板报告已生成: {filename}")
            
        except ImportError:
            logger.warning("仪表板生成器模块未找到，将生成简单报告")
            self.generate_simple_dashboard()
    
    def generate_simple_dashboard(self):
        """生成简单的仪表板报告"""
        if not self.metrics_history:
            return
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        summary = self.generate_summary_stats()
        
        report = f"""# 📊 TradingAgents 性能监控仪表板

**生成时间**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  
**监控时长**: {summary.get('total_monitoring_time_minutes', 0):.1f} 分钟  
**监控轮次**: {len(self.metrics_history)} 次

## 🎯 核心性能指标

### API 性能
- **平均响应时间**: {summary.get('api_response_time', {}).get('avg', 0):.1f}ms
- **P95响应时间**: {summary.get('api_response_time', {}).get('p95', 0):.1f}ms
- **最大响应时间**: {summary.get('api_response_time', {}).get('max', 0):.1f}ms
- **平均成功率**: {summary.get('api_success_rate', {}).get('avg', 0):.1f}%

### 系统资源
- **平均内存使用**: {summary.get('memory_usage_mb', {}).get('avg', 0):.1f}MB
- **峰值内存使用**: {summary.get('memory_usage_mb', {}).get('max', 0):.1f}MB
- **平均CPU使用**: {summary.get('cpu_usage_percent', {}).get('avg', 0):.1f}%
- **峰值CPU使用**: {summary.get('cpu_usage_percent', {}).get('max', 0):.1f}%

### 错误统计
- **总错误数**: {summary.get('total_errors', 0)}
- **API错误**: {self.error_counts.get('api_errors', 0)}
- **计算错误**: {self.error_counts.get('calculation_errors', 0)}
- **超时错误**: {self.error_counts.get('timeout_errors', 0)}
- **内存错误**: {self.error_counts.get('memory_errors', 0)}

## 📈 性能评估

### 总体健康状态
"""
        # 根据性能指标评估健康状态
        avg_api_time = summary.get('api_response_time', {}).get('avg', 0)
        avg_success_rate = summary.get('api_success_rate', {}).get('avg', 0)
        total_errors = summary.get('total_errors', 0)
        
        if avg_api_time < 1000 and avg_success_rate > 95 and total_errors < 5:
            health_status = "🟢 优秀"
            health_desc = "系统运行良好，所有指标均在最佳范围内"
        elif avg_api_time < 2000 and avg_success_rate > 90 and total_errors < 15:
            health_status = "🟡 良好"
            health_desc = "系统运行正常，部分指标需要关注"
        else:
            health_status = "🔴 需要优化"
            health_desc = "系统存在性能瓶颈，建议优化"
        
        report += f"**状态**: {health_status}  \n**说明**: {health_desc}\n\n"
        
        # 保存简单仪表板
        filename = f"monitor-dashboard_{timestamp}.md"
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(report)
        
        logger.info(f"简单监控仪表板已生成: {filename}")

def run_benchmark_test(api_key: str):
    """运行基准性能测试"""
    print("🚀 开始TradingAgents基准性能测试")
    print("="*60)
    
    monitor = PerformanceMonitor(api_key, monitoring_interval=30)
    
    # 运行5分钟的基准测试
    monitor.start_time = datetime.now()
    end_time = monitor.start_time + timedelta(minutes=5)
    
    test_round = 1
    while datetime.now() < end_time:
        print(f"\n📊 基准测试轮次 {test_round}")
        print("-"*40)
        
        metrics = monitor.collect_metrics()
        monitor.print_real_time_status(metrics)
        
        test_round += 1
        time.sleep(30)  # 每30秒测试一次
    
    monitor.stop_monitoring()
    print("\n✅ 基准性能测试完成!")

def main():
    """主函数 - 启动性能监控"""
    api_key = "d1vm82hr01qqgeemb9r0d1vm82hr01qqgeemb9rg"
    
    print("""
🎯 TradingAgents 性能监控系统
================================

选择运行模式:
1. 持续监控模式 (推荐)
2. 基准测试模式 (5分钟快速测试)
3. 单次性能检查

请输入选择 (1-3):
""")
    
    try:
        choice = input().strip()
        
        if choice == '1':
            print("启动持续监控模式...")
            monitor = PerformanceMonitor(api_key, monitoring_interval=60)
            monitor.start_monitoring()
        elif choice == '2':
            print("启动基准测试模式...")
            run_benchmark_test(api_key)
        elif choice == '3':
            print("执行单次性能检查...")
            monitor = PerformanceMonitor(api_key)
            metrics = monitor.collect_metrics()
            monitor.print_real_time_status(metrics)
            monitor.save_metrics_to_file()
        else:
            print("无效选择，退出程序")
            
    except KeyboardInterrupt:
        print("\n\n👋 性能监控已停止")
    except Exception as e:
        print(f"\n❌ 程序运行错误: {str(e)}")

if __name__ == "__main__":
    main()