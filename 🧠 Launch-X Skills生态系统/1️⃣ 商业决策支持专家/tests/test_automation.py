#!/usr/bin/env python3
"""
商业决策支持专家 - 自动化测试脚本
Automated Test Script for Business Decision Support Expert
"""

import sys
import os
import json
import time
from datetime import datetime

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import BusinessDecisionSupportExpert

class BusinessDecisionTestSuite:
    """商业决策支持专家测试套件"""

    def __init__(self):
        self.test_results = []
        self.start_time = time.time()

    def test_complete_analysis(self):
        """测试完整投资分析流程"""
        print("🧪 测试完整投资分析流程...")

        test_cases = [
            {
                "name": "AI教育平台案例",
                "project_data": {
                    "project_name": "AI智能教育平台",
                    "industry": "AI教育",
                    "stage": "Pre-A轮",
                    "team_size": 15,
                    "mrr": 500000,
                    "growth_rate": 0.15,
                    "technology": "AI个性化学习"
                },
                "expected_scores": {
                    "overall_score_range": [75, 95],
                    "risk_level": "中等",
                    "investment_grade": ["A", "B+"]
                }
            },
            {
                "name": "SaaS软件案例",
                "project_data": {
                    "project_name": "企业CRM平台",
                    "industry": "企业SaaS",
                    "stage": "A轮",
                    "team_size": 30,
                    "mrr": 1000000,
                    "growth_rate": 0.20,
                    "technology": "云计算架构"
                },
                "expected_scores": {
                    "overall_score_range": [80, 90],
                    "risk_level": "低",
                    "investment_grade": ["A", "A+"]
                }
            }
        ]

        passed_tests = 0
        for test_case in test_cases:
            print(f"  执行测试: {test_case['name']}")

            try:
                expert = BusinessDecisionSupportExpert(test_case['project_data']['project_name'])
                result = expert.analyze_project(test_case['project_data'])

                success = self._validate_result(result, test_case['expected_scores'])

                test_result = {
                    "test_name": test_case['name'],
                    "success": success,
                    "execution_time": time.time() - self.start_time,
                    "result": result,
                    "validation": self._detailed_validation(result, test_case['expected_scores'])
                }

                self.test_results.append(test_result)

                if success:
                    print(f"    ✅ 通过 - 用时: {test_result['execution_time']:.1f}秒")
                    passed_tests += 1
                else:
                    print(f"    ❌ 失败 - 问题: {test_result['validation'].get('issues', [])}")

            except Exception as e:
                print(f"    💥 异常: {str(e)}")

        return {
            "total_tests": len(test_cases),
            "passed_tests": passed_tests,
            "success_rate": passed_tests / len(test_cases),
            "test_results": self.test_results
        }

    def test_performance_stress(self):
        """测试性能压力"""
        print("⚡ 测试性能压力...")

        # 大批量测试数据
        stress_test_projects = [
            {"project_name": f"压力测试项目_{i}", "industry": "AI教育", "stage": "A轮", "team_size": 20, "mrr": 2000000 * (i + 1)}
            for i in range(10)
        ]

        stress_results = []
        start_time = time.time()

        for i, project in enumerate(stress_test_projects):
            print(f"  压力测试 {i+1}/10...")

            expert = BusinessDecisionSupportExpert(project['project_name'])
            result = expert.analyze_project(project)

            stress_results.append({
                "project_index": i,
                "execution_time": time.time() - start_time,
                "data_size": "large",
                "success": result is not None
            })

        avg_time = sum(r['execution_time'] for r in stress_results) / len(stress_results)

        return {
            "stress_test_count": len(stress_test_projects),
            "average_execution_time": avg_time,
            "max_execution_time": max(r['execution_time'] for r in stress_results),
            "performance_rating": "优秀" if avg_time < 30 else "良好" if avg_time < 60 else "需要优化"
        }

    def test_error_handling(self):
        """测试错误处理能力"""
        print("🛡️ 测试错误处理能力...")

        error_test_cases = [
            {
                "name": "空数据测试",
                "project_data": {},  # 空数据
                "should_handle": True
            },
            {
                "name": "无效数据类型测试",
                "project_data": {
                    "project_name": "测试项目",
                    "mrr": "invalid_mrr",  # 无效MRR
                    "growth_rate": "not_a_number",  # 非数字增长率
                },
                "should_handle": True
            },
            {
                "name": "边界值测试",
                "project_data": {
                    "project_name": "边界测试",
                    "team_size": 10000,  # 极大团队
                    "mrr": -1000000,  # 负MRR
                    "growth_rate": 5.0  # 极高增长率
                },
                "should_handle": True
            }
        ]

        error_handling_results = []
        for test_case in error_test_cases:
            print(f"  错误处理测试: {test_case['name']}")

            try:
                expert = BusinessDecisionSupportExpert(test_case['project_data']['project_name'])
                result = expert.analyze_project(test_case['project_data'])

                # 检查是否优雅处理错误
                handled_gracefully = (
                    result is not None and
                    result.get('analysis_results', {}).get('confidence_level') == '低' and
                    'validation_errors' in str(result)
                )

                error_handling_results.append({
                    "test_name": test_case['name'],
                    "handled_gracefully": handled_gracefully,
                    "has_validation_errors": result and 'validation_errors' in str(result),
                    "result_summary": result.get('analysis_results', {}) if result else {}
                })

                print(f"    {'✅ 优雅处理' if handled_gracefully else '❌ 处理不当'}")

            except Exception as e:
                error_handling_results.append({
                    "test_name": test_case['name'],
                    "exception_thrown": True,
                    "error_message": str(e)
                })
                print(f"    💥 异常: {str(e)}")

        return {
            "total_error_tests": len(error_test_cases),
            "graceful_handling_count": sum(1 for r in error_handling_results if r['handled_gracefully']),
            "error_handling_rate": sum(1 for r in error_handling_results if r['handled_gracefully']) / len(error_test_cases),
            "error_handling_results": error_handling_results
        }

    def _validate_result(self, result, expected_scores):
        """验证分析结果是否符合预期"""
        if not result or 'analysis_results' not in result:
            return False

        analysis = result['analysis_results']
        overall_score = analysis.get('overall_score', 0)
        investment_rec = analysis.get('investment_recommendation', {})

        # 检查评分范围
        score_range = expected_scores.get('overall_score_range', [0, 100])
        in_range = score_range[0] <= overall_score <= score_range[1]

        # 检查投资等级
        grade_valid = investment_rec.get('rating', '') in expected_scores.get('investment_grade', [])

        # 检查风险等级
        risk_valid = analysis.get('risk_analysis', {}).get('overall_risk_level', '') == expected_scores.get('risk_level', '')

        return in_range and grade_valid and risk_valid and result.get('execution_status') == 'SUCCESS'

    def _detailed_validation(self, result, expected_scores):
        """详细验证分析结果"""
        issues = []

        analysis = result.get('analysis_results', {})

        # 检查各分析部分完整性
        required_sections = ['basic_analysis', 'market_analysis', 'financial_analysis', 'risk_analysis']
        for section in required_sections:
            if section not in analysis or not analysis[section]:
                issues.append(f"缺失或无效的{section}部分")

        # 检查数据质量
        overall_score = analysis.get('overall_score', 0)
        if not (0 <= overall_score <= 100):
            issues.append(f"无效的综合评分: {overall_score}")

        return {
            "is_valid": len(issues) == 0,
            "issues": issues,
            "completeness_score": max(0, 100 - len(issues) * 10)
        }

    def generate_test_report(self, complete_results, performance_results, error_results):
        """生成测试报告"""
        report = {
            "test_suite": "商业决策支持专家自动化测试",
            "test_date": datetime.now().isoformat(),
            "total_execution_time": time.time() - self.start_time,

            "complete_analysis_tests": {
                "total_tests": complete_results.get('total_tests', 0),
                "passed_tests": complete_results.get('passed_tests', 0),
                "success_rate": complete_results.get('success_rate', 0),
                "average_time": sum(r['execution_time'] for r in complete_results.get('test_results', [])) / len(complete_results.get('test_results', [])) if complete_results.get('test_results', []) else 0
            },

            "performance_stress_tests": performance_results or {},

            "error_handling_tests": error_results or {},

            "overall_assessment": {
                "skill_maturity": "生产就绪" if complete_results.get('success_rate', 0) > 0.8 else "需要改进",
                "performance_rating": performance_results.get('performance_rating', '未知') if performance_results else '未测试',
                "error_handling_quality": error_results.get('error_handling_rate', 0) if error_results else '未测试',
                "recommendations": self._generate_recommendations(complete_results, performance_results, error_results)
            }
        }

        return report

    def _generate_recommendations(self, complete_results, performance_results, error_results):
        """生成改进建议"""
        recommendations = []

        # 基于完整分析测试结果的建议
        if complete_results.get('success_rate', 0) < 0.8:
            recommendations.append("优化分析算法以提高准确性")
            recommendations.append("增加更全面的测试用例覆盖边缘场景")
            recommendations.append("改进错误处理机制的健壮性")

        # 基于性能测试结果的建议
        if performance_results:
            if performance_results.get('performance_rating') == '需要优化':
                recommendations.append("优化数据处理效率以减少执行时间")
                recommendations.append("考虑实现结果缓存机制")
                recommendations.append("增加并发处理能力")

        # 基于错误处理测试结果的建议
        if error_results:
            if error_results.get('error_handling_rate', 0) < 0.9:
                recommendations.append("增强输入验证机制")
                recommendations.append("改进异常信息的可读性")
                recommendations.append("实现更细粒度的错误分类")

        if not recommendations:
            recommendations.append("当前实现质量良好，继续保持")

        return recommendations

def main():
    """主测试函数"""
    print("🚀 开始商业决策支持专家自动化测试套件...")

    if len(sys.argv) > 1 and sys.argv[1] == "--full":
        # 完整测试套件
        test_suite = BusinessDecisionTestSuite()

        print("\n1. 执行完整分析测试...")
        complete_results = test_suite.test_complete_analysis()

        print("\n2. 执行性能压力测试...")
        performance_results = test_suite.test_performance_stress()

        print("\n3. 执行错误处理测试...")
        error_results = test_suite.test_error_handling()

        print("\n4. 生成测试报告...")
        test_report = test_suite.generate_test_report(complete_results, performance_results, error_results)

        # 保存测试报告
        report_path = "tests/automated_test_report.json"
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(test_report, f, ensure_ascii=False, indent=2)

        print(f"\n🎉 自动化测试完成！")
        print(f"📄 测试报告已保存到: {report_path}")
        print(f"\n📊 测试总结:")
        print(f"  - 完整分析测试通过率: {complete_results.get('success_rate', 0):.1%}")
        print(f"  - 性能评级: {performance_results.get('performance_rating', '未测试')}")
        print(f"  - 错误处理质量: {error_results.get('error_handling_rate', 0):.1%}")

        # 返回结果用于CI/CD集成
        return test_report

    elif len(sys.argv) > 1 and sys.argv[1] == "--quick":
        # 快速验证测试
        print("执行快速功能验证...")

        expert = BusinessDecisionSupportExpert("快速测试项目")
        result = expert.analyze_project({
            "project_name": "快速测试项目",
            "industry": "AI教育",
            "stage": "Pre-A轮",
            "team_size": 15,
            "mrr": 500000,
            "growth_rate": 0.15
        })

        if result and result.get('execution_status') == 'SUCCESS':
            print("✅ 快速测试通过 - 商业决策支持专家功能正常")
            return True
        else:
            print("❌ 快速测试失败 - 商业决策支持专家需要修复")
            return False

    else:
        print("使用方法:")
        print("  python test_automation.py --full    # 执行完整自动化测试套件")
        print("  python test_automation.py --quick   # 执行快速功能验证")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)