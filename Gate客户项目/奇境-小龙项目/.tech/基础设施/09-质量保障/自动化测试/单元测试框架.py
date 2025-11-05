#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
单元测试框架
提供完整的单元测试执行和报告生成功能
"""

import os
import sys
import json
import unittest
import time
import traceback
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Any, Callable
import importlib.util

class UnitTestFramework:
    """单元测试框架"""

    def __init__(self, base_path: str):
        self.base_path = Path(base_path)
        self.test_results = []
        self.coverage_data = {}
        self.performance_data = {}

    def discover_tests(self, test_directory: str) -> List[str]:
        """发现测试文件"""
        test_dir = self.base_path / test_directory
        test_files = []

        for file_path in test_dir.glob("**/test_*.py"):
            test_files.append(str(file_path))

        return test_files

    def run_test_file(self, test_file_path: str) -> Dict:
        """运行单个测试文件"""
        start_time = time.time()
        test_file = Path(test_file_path)

        # 动态导入测试模块
        spec = importlib.util.spec_from_file_location("test_module", test_file)
        test_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(test_module)

        # 创建测试套件
        loader = unittest.TestLoader()
        suite = loader.loadTestsFromModule(test_module)

        # 运行测试
        runner = CustomTestRunner()
        result = runner.run(suite)

        execution_time = time.time() - start_time

        return {
            "test_file": str(test_file),
            "tests_run": result.testsRun,
            "failures": len(result.failures),
            "errors": len(result.errors),
            "skipped": len(result.skipped),
            "success_rate": (result.testsRun - len(result.failures) - len(result.errors)) / result.testsRun if result.testsRun > 0 else 0,
            "execution_time": execution_time,
            "details": {
                "failures": [{"test": str(f[0]), "error": f[1]} for f in result.failures],
                "errors": [{"test": str(e[0]), "error": e[1]} for e in result.errors],
                "skipped": [{"test": str(s[0]), "reason": s[1]} for s in result.skipped]
            }
        }

    def run_all_tests(self, test_directories: List[str]) -> Dict:
        """运行所有测试"""
        all_results = {
            "execution_time": 0,
            "total_tests": 0,
            "total_failures": 0,
            "total_errors": 0,
            "total_skipped": 0,
            "overall_success_rate": 0,
            "test_files": [],
            "summary": {},
            "timestamp": datetime.now().isoformat()
        }

        start_time = time.time()

        for test_dir in test_directories:
            test_files = self.discover_tests(test_dir)

            for test_file in test_files:
                try:
                    result = self.run_test_file(test_file)
                    all_results["test_files"].append(result)

                    all_results["total_tests"] += result["tests_run"]
                    all_results["total_failures"] += result["failures"]
                    all_results["total_errors"] += result["errors"]
                    all_results["total_skipped"] += result["skipped"]

                except Exception as e:
                    error_result = {
                        "test_file": test_file,
                        "tests_run": 0,
                        "failures": 0,
                        "errors": 1,
                        "skipped": 0,
                        "success_rate": 0,
                        "execution_time": 0,
                        "details": {
                            "errors": [{"test": "test_file_error", "error": str(e)}]
                        }
                    }
                    all_results["test_files"].append(error_result)
                    all_results["total_errors"] += 1

        all_results["execution_time"] = time.time() - start_time

        if all_results["total_tests"] > 0:
            successful_tests = all_results["total_tests"] - all_results["total_failures"] - all_results["total_errors"]
            all_results["overall_success_rate"] = successful_tests / all_results["total_tests"]

        # 生成摘要
        all_results["summary"] = self._generate_summary(all_results)

        return all_results

    def _generate_summary(self, results: Dict) -> Dict:
        """生成测试摘要"""
        return {
            "status": "PASSED" if results["overall_success_rate"] >= 0.95 else "FAILED",
            "quality_grade": self._calculate_quality_grade(results["overall_success_rate"]),
            "key_metrics": {
                "测试执行数": results["total_tests"],
                "成功率": f"{results['overall_success_rate']:.2%}",
                "失败数": results["total_failures"],
                "错误数": results["total_errors"],
                "执行时间": f"{results['execution_time']:.2f}秒"
            },
            "recommendations": self._generate_recommendations(results)
        }

    def _calculate_quality_grade(self, success_rate: float) -> str:
        """计算质量等级"""
        if success_rate >= 0.99:
            return "A+ (优秀)"
        elif success_rate >= 0.95:
            return "A (良好)"
        elif success_rate >= 0.90:
            return "B (合格)"
        elif success_rate >= 0.80:
            return "C (需改进)"
        else:
            return "D (不合格)"

    def _generate_recommendations(self, results: Dict) -> List[str]:
        """生成改进建议"""
        recommendations = []

        if results["overall_success_rate"] < 0.95:
            recommendations.append("整体测试成功率偏低，建议检查失败的测试用例")

        if results["total_errors"] > 0:
            recommendations.append("发现测试执行错误，建议检查测试环境和代码")

        if results["execution_time"] > 300:  # 5分钟
            recommendations.append("测试执行时间较长，建议优化测试性能")

        if results["total_tests"] < 50:
            recommendations.append("测试用例数量偏少，建议增加测试覆盖率")

        # 分析失败的测试文件
        failed_files = [f for f in results["test_files"] if f["success_rate"] < 1.0]
        if failed_files:
            recommendations.append(f"以下测试文件存在问题: {', '.join([Path(f['test_file']).name for f in failed_files])}")

        return recommendations

    def generate_test_report(self, results: Dict, output_path: str):
        """生成测试报告"""
        report_content = self._generate_markdown_report(results)

        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(report_content)

        # 同时生成JSON格式的详细报告
        json_path = output_path.replace('.md', '.json')
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)

    def _generate_markdown_report(self, results: Dict) -> str:
        """生成Markdown格式的测试报告"""
        report = f"""# 单元测试执行报告

## 📊 测试概览

**执行时间**: {results['timestamp']}
**总执行时间**: {results['execution_time']:.2f} 秒

### 关键指标
| 指标 | 数值 | 状态 |
|------|------|------|
| 测试用例总数 | {results['total_tests']} | {'✅' if results['total_tests'] > 0 else '❌'} |
| 成功执行 | {results['total_tests'] - results['total_failures'] - results['total_errors']} | {'✅' if results['overall_success_rate'] >= 0.95 else '❌'} |
| 失败用例 | {results['total_failures']} | {'✅' if results['total_failures'] == 0 else '❌'} |
| 错误用例 | {results['total_errors']} | {'✅' if results['total_errors'] == 0 else '❌'} |
| 跳过用例 | {results['total_skipped']} | {'✅' if results['total_skipped'] == 0 else '⚠️'} |
| 成功率 | {results['overall_success_rate']:.2%} | {'✅' if results['overall_success_rate'] >= 0.95 else '❌'} |
| 质量等级 | {results['summary']['quality_grade']} | {'✅' if 'A' in results['summary']['quality_grade'] else '⚠️'} |

## 🎯 测试结果状态

**总体状态**: {results['summary']['status']}

"""

        if results['total_failures'] > 0 or results['total_errors'] > 0:
            report += "## ❌ 失败和错误详情\n\n"

            for test_file in results['test_files']:
                if test_file['failures'] > 0 or test_file['errors'] > 0:
                    report += f"### {Path(test_file['test_file']).name}\n\n"
                    report += f"- 测试数: {test_file['tests_run']}\n"
                    report += f"- 成功率: {test_file['success_rate']:.2%}\n"
                    report += f"- 执行时间: {test_file['execution_time']:.2f}秒\n\n"

                    if test_file['details']['failures']:
                        report += "**失败用例**:\n"
                        for failure in test_file['details']['failures']:
                            report += f"- `{failure['test']}`\n"
                            report += f"```\n{failure['error']}\n```\n\n"

                    if test_file['details']['errors']:
                        report += "**错误用例**:\n"
                        for error in test_file['details']['errors']:
                            report += f"- `{error['test']}`\n"
                            report += f"```\n{error['error']}\n```\n\n"

        if results['summary']['recommendations']:
            report += "## 💡 改进建议\n\n"
            for i, recommendation in enumerate(results['summary']['recommendations'], 1):
                report += f"{i}. {recommendation}\n"

        report += f"""
## 📈 性能分析

### 执行时间分布
"""

        # 添加执行时间分析
        if results['test_files']:
            slow_tests = sorted(results['test_files'], key=lambda x: x['execution_time'], reverse=True)[:5]
            if slow_tests:
                report += "最慢的5个测试文件:\n\n"
                for test in slow_tests:
                    report += f"- {Path(test['test_file']).name}: {test['execution_time']:.2f}秒\n"

        report += f"""
## 📋 详细测试文件结果

"""

        for test_file in results['test_files']:
            status = "✅ 通过" if test_file['success_rate'] == 1.0 else "❌ 失败"
            report += f"| {Path(test_file['test_file']).name} | {test_file['tests_run']} | {test_file['success_rate']:.2%} | {status} |\n"

        report += f"""
---

**报告生成时间**: {datetime.now().isoformat()}
**框架版本**: 1.0.0
"""

        return report

    def run_performance_tests(self, test_file: str, iterations: int = 10) -> Dict:
        """运行性能测试"""
        times = []
        memory_usage = []

        for i in range(iterations):
            start_time = time.time()
            result = self.run_test_file(test_file)
            end_time = time.time()

            times.append(end_time - start_time)
            # 这里可以添加内存使用统计

        return {
            "test_file": test_file,
            "iterations": iterations,
            "performance_metrics": {
                "average_time": sum(times) / len(times),
                "min_time": min(times),
                "max_time": max(times),
                "std_deviation": self._calculate_std_deviation(times),
                "total_time": sum(times)
            }
        }

    def _calculate_std_deviation(self, values: List[float]) -> float:
        """计算标准差"""
        if len(values) < 2:
            return 0

        mean = sum(values) / len(values)
        variance = sum((x - mean) ** 2 for x in values) / len(values)
        return variance ** 0.5

class CustomTestRunner:
    """自定义测试运行器"""

    def __init__(self):
        self.stream = open(os.devnull, 'w')  # 静默输出
        self.verbosity = 2

    def run(self, test_suite):
        """运行测试套件"""
        result = unittest.TestResult()
        test_suite.run(result)
        return result

# 使用示例
if __name__ == "__main__":
    # 创建测试框架
    framework = UnitTestFramework("./测试用例")

    # 定义测试目录
    test_directories = [
        "特化1-Excel分析器测试",
        "特化2-设计审查器测试",
        "特化3-项目协调器测试",
        "集成测试"
    ]

    # 运行所有测试
    results = framework.run_all_tests(test_directories)

    # 生成测试报告
    output_path = "./测试报告/单元测试执行报告.md"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    framework.generate_test_report(results, output_path)

    # 输出结果摘要
    print(f"测试执行完成!")
    print(f"总测试数: {results['total_tests']}")
    print(f"成功率: {results['overall_success_rate']:.2%}")
    print(f"质量等级: {results['summary']['quality_grade']}")
    print(f"详细报告: {output_path}")