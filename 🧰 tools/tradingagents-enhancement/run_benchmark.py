#!/usr/bin/env python3
"""
运行TradingAgents性能基准测试
"""

import sys
sys.path.append('.')

from performance_monitor import PerformanceMonitor, run_benchmark_test
from datetime import datetime, timedelta

def main():
    """运行基准测试"""
    api_key = "d1vm82hr01qqgeemb9r0d1vm82hr01qqgeemb9rg"
    
    print("🚀 开始TradingAgents基准性能测试")
    print("="*60)
    
    monitor = PerformanceMonitor(api_key, monitoring_interval=30)
    
    # 运行3分钟的基准测试
    monitor.start_time = datetime.now()
    end_time = monitor.start_time + timedelta(minutes=3)
    
    test_round = 1
    while datetime.now() < end_time:
        print(f"\n📊 基准测试轮次 {test_round}")
        print("-"*40)
        
        try:
            metrics = monitor.collect_metrics()
            monitor.print_real_time_status(metrics)
            
            test_round += 1
            
            # 保存中间结果
            if test_round % 3 == 0:
                monitor.save_metrics_to_file()
            
        except KeyboardInterrupt:
            print("\n测试被用户中断")
            break
        except Exception as e:
            print(f"测试轮次失败: {str(e)}")
            continue
        
        # 等待30秒进行下一轮测试
        import time
        time.sleep(30)
    
    monitor.stop_monitoring()
    print("\n✅ 基准性能测试完成!")

if __name__ == "__main__":
    main()