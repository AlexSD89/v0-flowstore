#!/usr/bin/env python3
"""
AI项目数据收集器
多渠道收集AI项目数据，支持多种数据源和验证

Usage:
  python scripts/data_collector.py --project "Project Name" --company "Company Name" --output data.json
  python scripts/data_collector.py --sources "github,crunchbase,linkedin" --output data.json
"""

import json
import argparse
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any

class AIDataCollector:
    def __init__(self):
        """初始化数据收集器"""
        self.sources = {
            "github": self.collect_github_data,
            "linkedin": self.collect_linkedin_data,
            "crunchbase": self.collect_crunchbase_data,
            "web": self.collect_web_data
        }

    def collect_project_data(self, project_name: str, company_name: str,
                              sources: List[str] = None) -> Dict[str, Any]:
        """收集项目数据"""

        if sources is None:
            sources = ["github", "web"]  # 默认数据源

        print(f"🔍 开始收集项目数据: {project_name} / {company_name}")
        print(f"📊 数据源: {', '.join(sources)}")

        collected_data = {
            "project_name": project_name,
            "company_name": company_name,
            "collection_time": datetime.now().isoformat(),
            "sources_used": sources,
            "data_sources": {}
        }

        for source in sources:
            if source in self.sources:
                print(f"  收集 {source} 数据...")
                try:
                    source_data = self.sources[source](project_name, company_name)
                    collected_data["data_sources"][source] = source_data
                    print(f"  ✅ {source} 数据收集完成")
                except Exception as e:
                    print(f"  ❌ {source} 数据收集失败: {str(e)}")
                    collected_data["data_sources"][source] = {
                        "error": str(e),
                        "status": "failed"
                    }

        return collected_data

    def collect_github_data(self, project_name: str, company_name: str) -> Dict[str, Any]:
        """收集GitHub数据"""
        # 这里应该调用GitHub API或进行GitHub搜索
        # 现在返回模拟数据，实际使用时需要替换为真实的API调用

        return {
            "status": "simulated",
            "repository_url": f"https://github.com/{company_name.lower()}/{project_name.lower().replace(' ', '-')}",
            "language": "Python",
            "stars": 1234,
            "forks": 234,
            "last_updated": "2024-01-15",
            "open_issues": 12,
            "description": f"{project_name} - AI innovation platform"
        }

    def collect_linkedin_data(self, project_name: str, company_name: str) -> Dict[str, Any]:
        """收集LinkedIn数据"""
        # 这里应该调用LinkedIn API或进行LinkedIn搜索
        # 现在返回模拟数据

        return {
            "status": "simulated",
            "company_url": f"https://www.linkedin.com/company/{company_name.lower().replace(' ', '-')}",
            "employee_count": "50-200",
            "industry": "Information Technology & Services",
            "company_description": f"Leading AI company developing {project_name}",
            "headquarters": "San Francisco, CA"
        }

    def collect_crunchbase_data(self, project_name: str, company_name: str) -> Dict[str, Any]:
        """收集Crunchbase数据"""
        # 这里应该调用Crunchbase API
        # 现在返回模拟数据

        return {
            "status": "simulated",
            "funding_stage": "Series A",
            "total_funding": "8M USD",
            "investors": ["Venture Firm A", "Angel Investor B"],
            "founded_date": "2020-01-01",
            "website": f"https://{company_name.lower().replace(' ', '')}.com"
        }

    def collect_web_data(self, project_name: str, company_name: str) -> Dict[str, Any]:
        """收集Web数据"""
        # 这里应该进行网络搜索和数据抓取
        # 现在返回模拟数据

        return {
            "status": "simulated",
            "website": f"https://{company_name.lower().replace(' ', '')}.com",
            "blog": f"https://blog.{company_name.lower().replace(' ', '')}.com",
            "twitter": f"@{company_name.lower().replace(' ', '')}",
            "mentions": 156,
            "news_articles": 8,
            "tech_stack": ["Python", "TensorFlow", "React", "AWS"]
        }

    def save_collected_data(self, data: Dict[str, Any], output_path: str):
        """保存收集的数据"""
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        print(f"💾 数据已保存到: {output_path}")

    def validate_collected_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """验证收集的数据质量"""
        validation_results = {
            "total_sources": len(data.get("data_sources", {})),
            "successful_sources": 0,
            "failed_sources": 0,
            "data_completeness": {},
            "recommendations": []
        }

        for source, source_data in data.get("data_sources", {}).items():
            if source_data.get("status") == "simulated" or "error" not in source_data:
                validation_results["successful_sources"] += 1
            else:
                validation_results["failed_sources"] += 1
                validation_results["recommendations"].append(
                    f"Consider manual verification for {source} data"
                )

        # 检查数据完整性
        data_completeness = {
            "has_company_info": bool(data.get("company_name")),
            "has_project_info": bool(data.get("project_name")),
            "has_collection_time": bool(data.get("collection_time")),
            "has_source_data": len(data.get("data_sources", {})) > 0
        }

        validation_results["data_completeness"] = data_completeness

        # 计算质量分数
        total_checks = len(data_completeness)
        passed_checks = sum(data_completeness.values())
        validation_results["quality_score"] = (passed_checks / total_checks) * 100

        return validation_results

def main():
    """主函数"""
    parser = argparse.ArgumentParser(
        description='AI项目数据收集器',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例用法:
  # 收集指定项目数据
  python scripts/data_collector.py --project "AI推荐系统" --company "TechCorp" --output data.json

  # 指定数据源
  python scripts/data_collector.py --project "AI推荐系统" --company "TechCorp" --sources "github,linkedin" --output data.json

  # 验证数据文件
  python scripts/data_collector.py --validate data.json
        """
    )

    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--project', help='项目名称')
    group.add_argument('--validate', help='验证现有数据文件')

    parser.add_argument('--company', help='公司名称（与--project一起使用）')
    parser.add_argument('--sources', help='数据源列表，逗号分隔 (github,linkedin,crunchbase,web)')
    parser.add_argument('--output', help='输出数据文件路径')
    parser.add_argument('--validate-only', action='store_true', help='仅验证数据，不收集新数据')

    args = parser.parse_args()

    collector = AIDataCollector()

    if args.validate:
        # 验证现有数据文件
        try:
            with open(args.validate, 'r', encoding='utf-8') as f:
                data = json.load(f)

            validation_results = collector.validate_collected_data(data)

            print(f"📊 数据验证结果:")
            print(f"  数据源总数: {validation_results['total_sources']}")
            print(f"  成功收集: {validation_results['successful_sources']}")
            print(f"  收集失败: {validation_results['failed_sources']}")
            print(f"  质量分数: {validation_results['quality_score']:.1f}%")

            if validation_results["recommendations"]:
                print(f"  建议:")
                for rec in validation_results["recommendations"]:
                    print(f"    • {rec}")

            sys.exit(0 if validation_results['quality_score'] >= 70 else 1)

        except FileNotFoundError:
            print(f"❌ 文件不存在: {args.validate}")
            sys.exit(1)
        except json.JSONDecodeError:
            print(f"❌ 文件格式错误: {args.validate}")
            sys.exit(1)

    # 收集数据模式
    sources = ["github", "web"]  # 默认数据源
    if args.sources:
        sources = [s.strip() for s in args.sources.split(',')]

    try:
        collected_data = collector.collect_project_data(
            args.project, args.company, sources
        )

        # 验证收集的数据
        validation_results = collector.validate_collected_data(collected_data)

        print(f"\n📊 收集结果:")
        print(f"  数据源总数: {validation_results['total_sources']}")
        print(f"  成功收集: {validation_results['successful_sources']}")
        print(f"  质量分数: {validation_results['quality_score']:.1f}%")

        # 保存数据
        if args.output:
            collector.save_collected_data(collected_data, args.output)
        else:
            # 输出到控制台
            print(f"\n📋 收集的数据:")
            print(json.dumps(collected_data, indent=2, ensure_ascii=False))

        sys.exit(0 if validation_results['quality_score'] >= 50 else 1)

    except Exception as e:
        print(f"❌ 数据收集失败: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()