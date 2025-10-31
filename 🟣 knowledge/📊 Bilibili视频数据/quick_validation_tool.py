#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
快速URL验证工具
用于验证采集到的Bilibili视频URL的有效性
"""

import requests
import time
import json
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Dict, Any


class QuickValidator:
    """快速URL验证器"""
    
    def __init__(self, max_workers: int = 5, timeout: int = 10):
        self.max_workers = max_workers
        self.timeout = timeout
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    
    def validate_single_url(self, url: str) -> Dict[str, Any]:
        """验证单个URL"""
        try:
            response = requests.head(url, headers=self.headers, timeout=self.timeout, allow_redirects=True)
            return {
                'url': url,
                'valid': response.status_code == 200,
                'status_code': response.status_code,
                'response_time': response.elapsed.total_seconds(),
                'error': None
            }
        except Exception as e:
            return {
                'url': url,
                'valid': False,
                'status_code': None,
                'response_time': None,
                'error': str(e)
            }
    
    def batch_validate(self, urls: List[str], progress_callback=None) -> List[Dict[str, Any]]:
        """批量验证URL"""
        results = []
        completed_count = 0
        
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            # 提交所有任务
            future_to_url = {executor.submit(self.validate_single_url, url): url for url in urls}
            
            # 处理完成的任务
            for future in as_completed(future_to_url):
                result = future.result()
                results.append(result)
                completed_count += 1
                
                if progress_callback:
                    progress_callback(completed_count, len(urls))
                
                # 添加小延迟避免请求过快
                time.sleep(0.1)
        
        return results
    
    def validate_from_file(self, file_path: str) -> Dict[str, Any]:
        """从文件读取URL并验证"""
        # 读取URL
        with open(file_path, 'r', encoding='utf-8') as f:
            urls = [line.strip() for line in f if line.strip()]
        
        print(f"从 {file_path} 读取了 {len(urls)} 个URL")
        
        # 进度回调函数
        def progress_callback(completed, total):
            percentage = (completed / total) * 100
            print(f"验证进度: {completed}/{total} ({percentage:.1f}%)")
        
        # 开始验证
        print("开始批量验证...")
        start_time = time.time()
        results = self.batch_validate(urls, progress_callback)
        end_time = time.time()
        
        # 统计结果
        valid_count = sum(1 for r in results if r['valid'])
        invalid_count = len(results) - valid_count
        total_time = end_time - start_time
        
        report = {
            'total_urls': len(urls),
            'valid_count': valid_count,
            'invalid_count': invalid_count,
            'success_rate': (valid_count / len(urls)) * 100 if urls else 0,
            'total_time': total_time,
            'avg_time_per_url': total_time / len(urls) if urls else 0,
            'results': results
        }
        
        return report
    
    def generate_validation_report(self, report: Dict[str, Any], output_file: str = None) -> str:
        """生成验证报告"""
        report_content = f"""# URL验证报告

## 基本统计
- 总URL数量: {report['total_urls']}
- 有效URL: {report['valid_count']}
- 无效URL: {report['invalid_count']}
- 成功率: {report['success_rate']:.2f}%
- 总验证时间: {report['total_time']:.2f}秒
- 平均每URL耗时: {report['avg_time_per_url']:.3f}秒

## 详细结果

### 有效URL ({report['valid_count']}个)
"""
        
        # 添加有效URL
        valid_urls = [r for r in report['results'] if r['valid']]
        for i, result in enumerate(valid_urls, 1):
            report_content += f"{i}. {result['url']} (状态码: {result['status_code']}, 响应时间: {result['response_time']:.3f}s)\n"
        
        if report['invalid_count'] > 0:
            report_content += f"\n### 无效URL ({report['invalid_count']}个)\n"
            invalid_urls = [r for r in report['results'] if not r['valid']]
            for i, result in enumerate(invalid_urls, 1):
                error_info = f"错误: {result['error']}" if result['error'] else f"状态码: {result['status_code']}"
                report_content += f"{i}. {result['url']} ({error_info})\n"
        
        if output_file:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(report_content)
            print(f"验证报告已保存到: {output_file}")
        
        return report_content


def main():
    """主函数"""
    import sys
    import os
    
    if len(sys.argv) < 2:
        print("使用方法: python quick_validation_tool.py <url_file>")
        print("示例: python quick_validation_tool.py all_145_urls.txt")
        return
    
    url_file = sys.argv[1]
    if not os.path.exists(url_file):
        print(f"文件不存在: {url_file}")
        return
    
    # 创建验证器
    validator = QuickValidator(max_workers=3, timeout=10)
    
    # 验证URL
    report = validator.validate_from_file(url_file)
    
    # 显示结果摘要
    print(f"\n=== 验证完成 ===")
    print(f"总URL数量: {report['total_urls']}")
    print(f"有效URL: {report['valid_count']}")
    print(f"无效URL: {report['invalid_count']}")
    print(f"成功率: {report['success_rate']:.2f}%")
    print(f"总耗时: {report['total_time']:.2f}秒")
    
    # 生成报告
    report_file = f"{os.path.splitext(url_file)[0]}_validation_report.md"
    validator.generate_validation_report(report, report_file)
    
    # 保存详细结果为JSON
    json_file = f"{os.path.splitext(url_file)[0]}_validation_results.json"
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    print(f"详细结果已保存到: {json_file}")


if __name__ == "__main__":
    main()