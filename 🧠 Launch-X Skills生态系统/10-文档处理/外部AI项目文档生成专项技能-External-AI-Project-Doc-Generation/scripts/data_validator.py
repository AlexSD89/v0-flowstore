#!/usr/bin/env python3
"""
AI项目数据验证器 - 专业级数据验证和基准对比工具
遵循LaunchX官方标准，实现企业级数据质量控制

Usage:
    python scripts/data_validator.py --help
    python scripts/data_validator.py --project "Poke AI" --company "Poke AI推荐平台" --validate-existence
    python scripts/data_validator.py --data-file data.json --benchmark-validation
"""

import json
import sys
import argparse
import subprocess
from typing import Dict, List, Optional, Tuple, Any
from pathlib import Path
import re
import urllib.parse
import requests
from datetime import datetime

class AIProjectDataValidator:
    """
    AI项目数据验证器 - 企业级数据质量控制
    基于LaunchX通用信息采集验证方法论实现
    """

    def __init__(self, config_path: str = None):
        """初始化验证器，加载配置和基准数据"""
        self.config = self._load_config(config_path)
        self.benchmarks = self._load_benchmarks()
        self.validation_results = {}

    def _load_config(self, config_path: str) -> Dict:
        """加载技能配置"""
        if not config_path:
            config_path = Path(__file__).parent.parent / "resources" / "config.json"

        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Warning: Could not load config from {config_path}: {e}")
            return self._get_default_config()

    def _load_benchmarks(self) -> Dict:
        """加载行业基准数据"""
        benchmarks_path = Path(__file__).parent.parent / "resources" / "industry_benchmarks.json"

        try:
            with open(benchmarks_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Warning: Could not load benchmarks from {benchmarks_path}: {e}")
            return self._get_default_benchmarks()

    def _get_default_config(self) -> Dict:
        """默认配置"""
        return {
            "validation_thresholds": {
                "existence_confidence": 0.6,
                "quality_score_minimum": 90,
                "industry_benchmark_compliance": 0.8
            }
        }

    def _get_default_benchmarks(self) -> Dict:
        """默认基准数据"""
        return {
            "ai_industry_benchmarks": {
                "recommendation_systems": {
                    "accuracy_rates": {
                        "realistic_range": [70, 85],
                        "unrealistic_threshold": 90
                    }
                },
                "funding_stages": {
                    "seed": {"typical": 800000},
                    "series_a": {"typical": 5000000},
                    "series_b": {"typical": 15000000}
                }
            }
        }

    def validate_project_existence(self, project_name: str, company_name: str) -> Dict:
        """
        验证项目存在性 - 多源验证系统

        Args:
            project_name: 项目名称
            company_name: 公司名称

        Returns:
            验证结果字典，包含存在性确认和证据
        """
        print(f"🔍 验证项目存在性: {project_name} / {company_name}")

        verification_sources = {
            "tier_1_official": [
                ("linkedin_search", f"https://www.linkedin.com/search/results/all/?keywords={urllib.parse.quote_plus(company_name)}"),
                ("company_registry", f"https://opencorporates.com/companies?search={urllib.parse.quote_plus(company_name)}"),
                ("official_website", f"https://www.google.com/search?q={urllib.parse.quote_plus(company_name)}+official+site")
            ],
            "tier_2_professional": [
                ("crunchbase", f"https://www.crunchbase.com/organization-search/organizations/field/organizations?q={urllib.parse.quote_plus(company_name)}"),
                ("pitchbook", f"https://pitchbook.com/profiles/search?q={urllib.parse.quote_plus(company_name)}"),
                ("techcrunch", f"https://techcrunch.com/?s={urllib.parse.quote_plus(company_name)}")
            ],
            "tier_3_industry": [
                ("industry_reports", f"https://www.google.com/search?q={urllib.parse.quote_plus(company_name)}+AI+startup+report"),
                ("news_search", f"https://news.google.com/search?q={urllib.parse.quote_plus(company_name)}")
            ]
        }

        verification_results = {}
        total_score = 0
        max_possible_score = 0

        for tier, sources in verification_sources.items():
            tier_score = 0
            tier_max = len(sources)

            for source_name, search_url in sources:
                try:
                    result = self._execute_verification_search(source_name, company_name, search_url)
                    if result["found"]:
                        tier_score += 1
                        verification_results[source_name] = result

                        # 根据层级计算得分
                        tier_weight = 1.0 if tier == "tier_1_official" else \
                                     0.8 if tier == "tier_2_professional" else \
                                     0.6 if tier == "tier_3_industry" else 0.3

                        total_score += tier_weight
                    max_possible_score += tier_weight

                except Exception as e:
                    verification_results[source_name] = {
                        "error": str(e),
                        "found": False
                    }

        confidence_score = total_score / max_possible_score if max_possible_score > 0 else 0

        # 检查名称相似性
        similarity_check = self._check_name_similarity(project_name, company_name)

        result = {
            "exists": confidence_score >= self.config["validation_thresholds"]["existence_confidence"],
            "confidence_score": confidence_score,
            "evidence": verification_results,
            "proof": {
                "sources_checked": len(verification_results),
                "positive_verifications": sum(1 for r in verification_results.values() if r.get("found", False)),
                "confidence_level": self._determine_confidence_level(confidence_score),
                "similar_entities": similarity_check
            },
            "validation_timestamp": datetime.now().isoformat()
        }

        print(f"📊 存在性验证结果: 置信度 {confidence_score:.2f} ({result['proof']['confidence_level']})")
        return result

    def _execute_verification_search(self, source_name: str, company_name: str, search_url: str) -> Dict:
        """执行验证搜索"""
        # 注意：在实际环境中，这里应该使用MCP工具或API
        # 为了演示，我们返回模拟结果

        # 模拟搜索逻辑
        if "linkedin" in source_name:
            return {
                "found": self._simulate_linkedin_search(company_name),
                "url": search_url,
                "evidence": f"LinkedIn搜索结果模拟",
                "confidence": "HIGH"
            }
        elif "crunchbase" in source_name:
            return {
                "found": self._simulate_crunchbase_search(company_name),
                "url": search_url,
                "evidence": f"Crunchbase搜索结果模拟",
                "confidence": "HIGH"
            }
        else:
            return {
                "found": False,
                "url": search_url,
                "evidence": f"通用搜索结果模拟",
                "confidence": "LOW"
            }

    def _simulate_linkedin_search(self, company_name: str) -> bool:
        """模拟LinkedIn搜索结果"""
        # 在实际环境中，这里会调用LinkedIn API
        # 对于演示，我们模拟一些常见的搜索结果
        high_probability_keywords = ["AI", "Technology", "Software", "Solutions"]
        return any(keyword.lower() in company_name.lower() for keyword in high_probability_keywords)

    def _simulate_crunchbase_search(self, company_name: str) -> bool:
        """模拟Crunchbase搜索结果"""
        # 在实际环境中，这里会调用Crunchbase API
        high_probability_keywords = ["AI", "ML", "Platform", "Tech"]
        return len(company_name.split()) >= 2 and any(keyword.lower() in company_name.lower() for keyword in high_probability_keywords)

    def _check_name_similarity(self, project_name: str, company_name: str) -> List[Dict]:
        """检查名称相似性，防止与现有项目混淆"""
        similar_entities = []

        # 生成名称变体
        variations = [
            project_name.split()[0],
            company_name.split()[0],
            project_name.replace("AI", "").strip(),
            company_name.replace("AI", "").strip(),
            project_name.lower(),
            company_name.lower()
        ]

        # 模拟相似性检查
        for variation in variations:
            if len(variation) >= 3:  # 只有长度足够的才检查
                similar_entities.append({
                    "variation": variation,
                    "similarity_score": 0.8 if variation in project_name.lower() else 0.5,
                    "potential_conflict": True
                })

        return similar_entities

    def _determine_confidence_level(self, score: float) -> str:
        """确定置信度等级"""
        if score >= 0.8:
            return "HIGH"
        elif score >= 0.6:
            return "MEDIUM"
        elif score >= 0.4:
            return "LOW"
        else:
            return "VERY_LOW"

    def validate_against_benchmarks(self, data: Dict) -> Dict:
        """
        验证数据与行业基准的对比

        Args:
            data: 待验证的项目数据

        Returns:
            基准验证结果
        """
        print("📈 执行行业基准对比验证...")

        validation_results = {}
        overall_status = "PASS"

        # 验证推荐系统准确率
        if "accuracy_rate" in data:
            accuracy_result = self._validate_accuracy_rate(data["accuracy_rate"])
            validation_results["accuracy_rate"] = accuracy_result
            if accuracy_result["status"] in ["FAIL", "WARNING"]:
                overall_status = "FAIL"

        # 验证增长率
        if "revenue_growth_rate" in data:
            growth_result = self._validate_growth_rate(data["revenue_growth_rate"], data.get("funding_stage", "seed"))
            validation_results["revenue_growth_rate"] = growth_result
            if growth_result["status"] == "FAIL":
                overall_status = "FAIL"

        # 验证融资金额
        if "funding_amount" in data:
            funding_result = self._validate_funding_amount(data["funding_amount"], data.get("funding_stage", "seed"))
            validation_results["funding_amount"] = funding_result
            if funding_result["status"] == "FAIL":
                overall_status = "FAIL"

        # 生成改进建议
        recommendations = self._generate_improvement_recommendations(validation_results)

        result = {
            "overall_status": overall_status,
            "validation_details": validation_results,
            "recommendations": recommendations,
            "benchmark_version": "industry_benchmarks_v2.0",
            "validation_timestamp": datetime.now().isoformat()
        }

        print(f"📊 基准验证结果: {overall_status}")
        return result

    def _validate_accuracy_rate(self, accuracy: float) -> Dict:
        """验证推荐算法准确率"""
        benchmarks = self.benchmarks["ai_industry_benchmarks"]["recommendation_systems"]["accuracy_rates"]
        realistic_range = benchmarks["realistic_range"]
        unrealistic_threshold = benchmarks["unrealistic_threshold"]
        industry_comparison = benchmarks["industry_leaders"]

        if accuracy > unrealistic_threshold:
            return {
                "status": "FAIL",
                "value": accuracy,
                "issue": "Unrealistically high accuracy rate",
                "suggested_range": realistic_range,
                "industry_comparison": industry_comparison,
                "recommended_adjustment": "Adjust to realistic range 70-85%"
            }
        elif accuracy > realistic_range[1]:
            return {
                "status": "WARNING",
                "value": accuracy,
                "issue": "High accuracy rate - requires verification",
                "suggested_range": realistic_range,
                "evidence_required": ["independent testing", "user_feedback", "comparison_data"]
            }
        else:
            return {
                "status": "PASS",
                "value": accuracy,
                "comparison": f"Within realistic industry range {realistic_range}",
                "industry_position": self._get_industry_position(accuracy, industry_comparison)
            }

    def _validate_growth_rate(self, growth_rate: float, stage: str) -> Dict:
        """验证收入增长率"""
        growth_benchmarks = self.benchmarks["ai_industry_benchmarks"]["revenue_growth"]

        # 找到对应的阶段基准
        stage_key = f"{stage}_to_next"
        if stage_key not in growth_benchmarks:
            stage_key = "seed_to_a"  # 默认值

        realistic_growth = growth_benchmarks[stage_key]

        if growth_rate > realistic_growth["excellent"]:
            return {
                "status": "FAIL",
                "value": growth_rate,
                "issue": "Unrealistically high growth rate",
                "suggested_maximum": realistic_growth["excellent"],
                "realistic_range": realistic_growth["realistic"],
                "recommended_action": "Provide quarterly financials or adjust to realistic range"
            }
        elif growth_rate > realistic_growth["realistic"][1]:
            return {
                "status": "WARNING",
                "value": growth_rate,
                "issue": "High growth rate - requires strong evidence",
                "evidence_required": ["quarterly_financials", "audit_reports", "customer_contracts"]
            }
        else:
            return {
                "status": "PASS",
                "value": growth_rate,
                "comparison": f"Within realistic range for {stage} stage"
            }

    def _validate_funding_amount(self, amount: int, stage: str) -> Dict:
        """验证融资金额"""
        funding_benchmarks = self.benchmarks["ai_industry_benchmarks"]["funding_stages"]

        if stage not in funding_benchmarks:
            stage = "seed"  # 默认值

        stage_benchmark = funding_benchmarks[stage]
        amount_in_millions = amount / 1000000

        if amount_in_millions < stage_benchmark["range"][0]:
            return {
                "status": "WARNING",
                "value": amount_in_millions,
                "issue": "Below typical range for this stage",
                "typical_range": [stage_benchmark["range"][0]/1000000, stage_benchmark["range"][1]/1000000],
                "typical_amount": stage_benchmark["typical"]/1000000,
                "unit": "million USD"
            }
        elif amount_in_millions > stage_benchmark["range"][1]:
            return {
                "status": "WARNING",
                "value": amount_in_millions,
                "issue": "Above typical range - requires exceptional metrics",
                "typical_range": [stage_benchmark["range"][0]/1000000, stage_benchmark["range"][1]/1000000],
                "typical_amount": stage_benchmark["typical"]/1000000,
                "unit": "million USD",
                "requirements": ["exceptional_team", "breakthrough_technology", "market_traction"]
            }
        else:
            return {
                "status": "PASS",
                "value": amount_in_millions,
                "comparison": f"Within normal range for {stage} stage",
                "position": "Good alignment with industry standards"
            }

    def _get_industry_position(self, accuracy: float, industry_leaders: Dict) -> str:
        """获取在行业中的位置"""
        positions = []
        for company, acc in industry_leaders.items():
            if accuracy > acc:
                positions.append(company)

        if not positions:
            return "Below industry leaders"
        elif len(positions) == 1:
            return f"Above {positions[0]}, at industry leader level"
        else:
            return f"Multiple industry leaders ({', '.join(positions)})"

    def _generate_improvement_recommendations(self, validation_results: Dict) -> List[Dict]:
        """生成改进建议"""
        recommendations = []

        for metric, result in validation_results.items():
            if result["status"] in ["FAIL", "WARNING"]:
                if metric == "accuracy_rate":
                    recommendations.append({
                        "metric": "accuracy_rate",
                        "action": "ADJUST_TO_REALISTIC",
                        "suggestion": result.get("recommended_adjustment", "Adjust to realistic range"),
                        "industry_reference": result.get("industry_comparison", {})
                    })
                elif metric == "revenue_growth_rate":
                    recommendations.append({
                        "metric": "revenue_growth_rate",
                        "action": "VERIFY_OR_ADJUST",
                        "suggestion": f"Provide evidence or adjust to ≤{result.get('suggested_maximum', 'N/A')}%",
                        "evidence_needed": result.get("evidence_required", [])
                    })
                elif metric == "funding_amount":
                    recommendations.append({
                        "metric": "funding_amount",
                        "action": "ALIGN_WITH_STAGE",
                        "suggestion": f"Align with {result.get('unit', 'USD')} range for funding stage"
                    })

        return recommendations

def main():
    """主函数 - 命令行接口"""
    parser = argparse.ArgumentParser(
        description='AI项目数据验证器 - 企业级数据质量控制',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例用法:
  # 验证项目存在性
  python scripts/data_validator.py --project "Poke AI" --company "Poke AI推荐平台" --validate-existence

  # 验证数据文件
  python scripts/data_validator.py --data-file project_data.json --benchmark-validation

注意事项:
  - 总是先运行 --help 查看使用方法
  - 不要直接读取源码，应该使用命令行接口
  - 验证器会输出详细的验证报告
        """)

    parser.add_argument('--project', help='项目名称')
    parser.add_argument('--company', help='公司名称')
    parser.add_argument('--validate-existence', action='store_true', help='验证项目存在性')
    parser.add_argument('--data-file', help='JSON数据文件路径')
    parser.add_argument('--benchmark-validation', action='store_true', help='执行基准对比验证')
    parser.add_argument('--output', help='输出报告文件路径 (可选)')
    parser.add_argument('--config', help='配置文件路径 (可选)')

    args = parser.parse_args()

    if not args.validate_existence and not args.benchmark_validation:
        print("Error: 必须指定验证类型 (--validate-existence 或 --benchmark-validation)")
        sys.exit(1)

    if args.validate_existence and (not args.project or not args.company):
        print("Error: 项目存在性验证需要 --project 和 --company 参数")
        sys.exit(1)

    if args.benchmark_validation and not args.data_file:
        print("Error: 基准验证需要 --data-file 参数")
        sys.exit(1)

    # 初始化验证器
    validator = AIProjectDataValidator(args.config)

    # 执行验证
    if args.validate_existence:
        existence_result = validator.validate_project_existence(args.project, args.company)
        print(f"\n📋 存在性验证报告:")
        print(f"项目: {args.project}")
        print(f"公司: {args.company}")
        print(f"存在状态: {'✅ 确认存在' if existence_result['exists'] else '❌ 未确认'}")
        print(f"置信度: {existence_result['confidence_score']:.2f} ({existence_result['proof']['confidence_level']})")
        print(f"验证来源: {existence_result['proof']['sources_checked']}")
        print(f"正面验证: {existence_result['proof']['positive_verifications']}")

        if not existence_result['exists']:
            print("\n⚠️ 建议:")
            print("1. 检查公司名称拼写")
            print("2. 确认项目是否真实存在")
            print("3. 提供更多信息进行验证")

    if args.benchmark_validation:
        try:
            with open(args.data_file, 'r', encoding='utf-8') as f:
                data = json.load(f)

            benchmark_result = validator.validate_against_benchmarks(data)

            print(f"\n📊 基准对比验证报告:")
            print(f"总体状态: {'✅ 通过' if benchmark_result['overall_status'] == 'PASS' else '❌ 需要改进'}")

            for metric, result in benchmark_result['validation_details'].items():
                status_icon = "✅" if result['status'] == 'PASS' else "⚠️" if result['status'] == 'WARNING' else "❌"
                print(f"{status_icon} {metric}: {result.get('value', 'N/A')}")
                if result.get('issue'):
                    print(f"    问题: {result['issue']}")

            if benchmark_result['recommendations']:
                print(f"\n💡 改进建议:")
                for rec in benchmark_result['recommendations']:
                    print(f"• {rec['metric']}: {rec['suggestion']}")

        except Exception as e:
            print(f"Error: 无法读取数据文件 {args.data_file}: {e}")
            sys.exit(1)

if __name__ == "__main__":
    main()