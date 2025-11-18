#!/usr/bin/env python3
"""
Enhanced Data Collector Demo
演示增强版数据采集器的完整功能

Usage:
    python3 demo_enhanced_data_collector.py

Features demonstrated:
- 线索驱动的数据采集策略
- 四级信源分级系统
- 交叉验证机制
- 智能工具选择算法
- 数据质量评估
"""

import asyncio
import json
import sys
from pathlib import Path
from datetime import datetime

# Add the scripts directory to the path
sys.path.append(str(Path(__file__).parent / "scripts"))

from scripts.data_collector import (
    EnhancedDataCollector,
    CollectionStrategy,
    DataSourceTier,
    MCP_AVAILABLE
)


async def demo_clue_driven_collection():
    """演示线索驱动的数据采集"""
    print("🎯 Demo: Clue-Driven Collection Strategy")
    print("=" * 50)

    # 创建采集器
    collector = EnhancedDataCollector(
        project_name="SERVAL",
        website="https://www.serval.com/",
        strategy=CollectionStrategy.CLUE_DRIVEN,
        mcp_enabled=False  # Demo模式不使用真实MCP
    )

    # 模拟一些用户分享线索
    simulated_clues = [
        {
            "content": "SERVAL的AI写作助手真的很棒，CEO张明之前在Google工作，最近刚完成A轮融资",
            "source": "xiaohongshu_user",
            "confidence": 0.9
        },
        {
            "content": "我们公司试用SERVAL三个月，提升了50%的写作效率，虽然价格有点贵但值得",
            "source": "twitter_user",
            "confidence": 0.8
        }
    ]

    # 从线索中提取关键信息
    for clue_data in simulated_clues:
        print(f"\n📝 Processing clue from {clue_data['source']}:")
        print(f"   Content: {clue_data['content'][:50]}...")

        # 模拟提取关键信息
        collector._add_data_point(
            "user_sharing_clue",
            clue_data,
            DataSourceTier.TIER3_INDUSTRY
        )

    # 提取结构化信息
    collector._add_data_point(
        "ceo_founder",
        "张明 (前Google)",
        DataSourceTier.TIER3_INDUSTRY
    )

    collector._add_data_point(
        "funding_stage",
        "Series A",
        DataSourceTier.TIER3_INDUSTRY
    )

    # 评估数据质量
    quality_assessment = collector._assess_data_quality()

    print(f"\n📊 Collection Quality Assessment:")
    print(f"   Overall Score: {quality_assessment['overall_score']:.1f}%")
    print(f"   Quality Grade: {quality_assessment['quality_grade']}")
    print(f"   Cross-verified Ratio: {quality_assessment['cross_verified_ratio']:.1f}%")
    print(f"   Average Credibility: {quality_assessment['average_credibility']:.2f}")

    return collector


async def demo_comprehensive_collection():
    """演示全面覆盖策略"""
    print("\n\n📊 Demo: Comprehensive Collection Strategy")
    print("=" * 50)

    # 创建采集器
    collector = EnhancedDataCollector(
        project_name="Anthropic",
        website="https://www.anthropic.com/",
        strategy=CollectionStrategy.COMPREHENSIVE,
        mcp_enabled=False
    )

    # 模拟各级数据源采集
    tier1_data = [
        ("company_name", "Anthropic PBC", DataSourceTier.TIER1_PRIMARY),
        ("ceo_founder", "Dario Amodei", DataSourceTier.TIER1_PRIMARY),
        ("funding_stage", "Series C+", DataSourceTier.TIER1_PRIMARY),
        ("total_funding", "$4 billion+", DataSourceTier.TIER1_PRIMARY),
    ]

    tier2_data = [
        ("media_coverage", "TechCrunch: Anthropic raises $450M", DataSourceTier.TIER2_AUTHORITATIVE),
        ("vc_announcements", "Spark Capital leads Series C", DataSourceTier.TIER2_AUTHORITATIVE),
        ("industry_reports", "Forrester: Leader in AI Safety", DataSourceTier.TIER2_AUTHORITATIVE),
    ]

    tier3_data = [
        ("user_reviews", "G2: 4.5/5 stars from 200+ reviews", DataSourceTier.TIER3_INDUSTRY),
        ("competitor_mentions", "Compared to OpenAI's GPT models", DataSourceTier.TIER3_INDUSTRY),
        ("patent_data", "Multiple AI safety patents filed", DataSourceTier.TIER3_INDUSTRY),
    ]

    tier4_data = [
        ("social_media", "Twitter: 150K followers", DataSourceTier.TIER4_CONTEXTUAL),
        ("forum_discussions", "Reddit: Active r/anthropic community", DataSourceTier.TIER4_CONTEXTUAL),
    ]

    # 添加模拟数据
    for field, value, tier in tier1_data + tier2_data + tier3_data + tier4_data:
        collector._add_data_point(field, value, tier)

    # 模拟交叉验证
    collector.collection_stats["cross_verified_points"] = 8

    # 质量评估
    quality_assessment = collector._assess_data_quality()
    completeness = collector._assess_completeness_detailed(collector.collected_data)

    print(f"📈 Comprehensive Collection Results:")
    print(f"   Total Data Points: {collector.collection_stats['data_points_collected']}")
    print(f"   Quality Score: {quality_assessment['overall_score']:.1f}%")
    print(f"   Cross-verified: {collector.collection_stats['cross_verified_points']} points")
    print(f"   Essential Completeness: {completeness['essential_completeness']:.1f}%")
    print(f"   Optional Completeness: {completeness['optional_completeness']:.1f}%")

    # 显示可信度分布
    print(f"\n🎯 Credibility Distribution:")
    for tier_name, count in quality_assessment['credibility_distribution'].items():
        if count > 0:
            print(f"   Tier {tier_name}: {count} data points")

    return collector


async def demo_cross_validation():
    """演示交叉验证机制"""
    print("\n\n🔍 Demo: Cross-Validation Mechanism")
    print("=" * 50)

    collector = EnhancedDataCollector(
        project_name="OpenAI",
        strategy=CollectionStrategy.VERIFICATION_FOCUSED,
        mcp_enabled=False
    )

    # 添加多个来源的相同信息进行交叉验证
    critical_field = "funding_stage"

    # Tier 1: 官方来源
    collector._add_data_point(
        critical_field,
        "Series D (Microsoft led)",
        DataSourceTier.TIER1_PRIMARY,
        "https://openai.com/blog/microsoft-partnership"
    )

    # Tier 2: 媒体报道
    collector._add_data_point(
        critical_field,
        "$10B Series D from Microsoft",
        DataSourceTier.TIER2_AUTHORITATIVE,
        "https://techcrunch.com/2023/openai-microsoft"
    )

    # Tier 2: VC公告
    collector._add_data_point(
        critical_field,
        "Microsoft strategic investment",
        DataSourceTier.TIER2_AUTHORITATIVE,
        "https://news.crunchbase.com/openai-series-d"
    )

    # 执行交叉验证
    validated_data = await collector._cross_validation_mechanism()

    if critical_field in validated_data:
        verified_points = validated_data[critical_field]
        print(f"✅ Cross-validation for '{critical_field}':")
        for i, point in enumerate(verified_points, 1):
            print(f"   {i}. Value: {point.value}")
            print(f"      Credibility: {point.credibility_score}")
            print(f"      Cross-verified: {point.cross_verified}")
            print(f"      Verification Count: {point.verification_count}")
            print(f"      Source: {point.source_url}")

    return collector


async def demo_intelligent_tool_selection():
    """演示智能工具选择算法"""
    print("\n\n🧠 Demo: Intelligent Tool Selection")
    print("=" * 50)

    # 早期项目特征
    early_stage_characteristics = {
        "project_stage": "early_stage",
        "data_availability": "limited",
        "analysis_depth": "standard"
    }

    collector = EnhancedDataCollector(
        project_name="Poke",
        strategy=CollectionStrategy.CLUE_DRIVEN
    )

    # 智能工具选择
    selected_tools = collector._intelligent_tool_selection(early_stage_characteristics)

    print("🔧 Tool Selection for Early-Stage Project:")
    print(f"   Primary Tools ({len(selected_tools['primary_tools'])}):")
    for tool in selected_tools['primary_tools']:
        print(f"     • {tool}")

    print(f"   Secondary Tools ({len(selected_tools['secondary_tools'])}):")
    for tool in selected_tools['secondary_tools']:
        print(f"     • {tool}")

    print(f"   Fallback Strategy: {selected_tools['fallback_strategy']}")

    # 成长期项目特征
    growth_stage_characteristics = {
        "project_stage": "growth_stage",
        "data_availability": "rich",
        "analysis_depth": "comprehensive"
    }

    growth_tools = collector._intelligent_tool_selection(growth_stage_characteristics)

    print("\n🔧 Tool Selection for Growth-Stage Project:")
    print(f"   Primary Tools ({len(growth_tools['primary_tools'])}):")
    for tool in growth_tools['primary_tools']:
        print(f"     • {tool}")

    return collector


async def generate_demo_report():
    """生成演示报告"""
    print("\n\n📋 Generating Demo Collection Report")
    print("=" * 50)

    # 运行所有演示
    clue_collector = await demo_clue_driven_collection()
    comprehensive_collector = await demo_comprehensive_collection()
    validation_collector = await demo_cross_validation()
    tool_selector = await demo_intelligent_tool_selection()

    # 生成综合报告
    demo_report = {
        "demo_timestamp": datetime.now().isoformat(),
        "demo_version": "2.0.0",
        "mcp_available": MCP_AVAILABLE,

        "demonstrated_features": [
            "Clue-driven data collection strategy",
            "Four-tier source credibility system",
            "Cross-validation mechanism",
            "Intelligent tool selection algorithm",
            "Data quality assessment",
            "Multi-round collection strategy"
        ],

        "demo_results": {
            "clue_driven_demo": {
                "project": clue_collector.project_name,
                "data_points_collected": clue_collector.collection_stats["data_points_collected"],
                "quality_score": clue_collector._assess_data_quality()["overall_score"]
            },

            "comprehensive_demo": {
                "project": comprehensive_collector.project_name,
                "data_points_collected": comprehensive_collector.collection_stats["data_points_collected"],
                "quality_score": comprehensive_collector._assess_data_quality()["overall_score"],
                "cross_verified_points": comprehensive_collector.collection_stats["cross_verified_points"]
            },

            "cross_validation_demo": {
                "project": validation_collector.project_name,
                "validation_success": True,
                "verified_critical_fields": len([k for k in validation_collector.collected_data.keys()
                                              if any(dp.cross_verified for dp in validation_collector.collected_data[k])])
            }
        },

        "technical_specifications": {
            "data_source_tiers": {
                "Tier 1": "Official sources (1.0 credibility)",
                "Tier 2": "Authoritative sources (0.8 credibility)",
                "Tier 3": "Industry sources (0.6 credibility)",
                "Tier 4": "Contextual sources (0.3 credibility)"
            },

            "collection_strategies": [
                "clue_driven",
                "comprehensive",
                "verification_focused",
                "market_intelligence"
            ],

            "quality_metrics": [
                "cross_validation_ratio",
                "average_credibility",
                "completeness_score",
                "overall_quality_score"
            ]
        },

        "integration_capabilities": {
            "mcp_tools": [
                "RUBE_SEARCH_TOOLS",
                "RUBE_MULTI_EXECUTE_TOOL",
                "RUBE_REMOTE_WORKBENCH",
                "xiaohongshu_mcp",
                "crunchbase_api",
                "patent_search"
            ],

            "parallel_execution": "Yes - up to 10 concurrent tools",
            "fallback_mechanisms": "Yes - graceful degradation",
            "error_handling": "Comprehensive with retry logic"
        },

        "usage_examples": [
            {
                "command": "python3 data_collector.py --project SERVAL --website https://serval.com/ --strategy clue_driven",
                "description": "Clue-driven collection for early-stage project"
            },
            {
                "command": "python3 data_collector.py --project Anthropic --depth comprehensive",
                "description": "Comprehensive collection with full analysis"
            },
            {
                "command": "python3 data_collector.py --project OpenAI --strategy verification_focused",
                "description": "Verification-focused collection with cross-validation"
            }
        ],

        "next_steps": [
            "Install real MCP integration modules",
            "Configure actual API keys for data sources",
            "Test with real projects",
            "Integrate with CONTENT_GEN phase",
            "Deploy to production environment"
        ]
    }

    # 保存演示报告
    report_file = Path("enhanced_data_collector_demo_report.json")
    with open(report_file, 'w', encoding='utf-8') as f:
        json.dump(demo_report, f, indent=2, ensure_ascii=False, default=str)

    print(f"📄 Demo report saved to: {report_file}")

    # 输出关键统计
    total_data_points = (
        clue_collector.collection_stats["data_points_collected"] +
        comprehensive_collector.collection_stats["data_points_collected"] +
        validation_collector.collection_stats["data_points_collected"]
    )

    print(f"\n📊 Demo Summary:")
    print(f"   Total Projects Analyzed: 4")
    print(f"   Total Data Points Collected: {total_data_points}")
    print(f"   Cross-validated Points: {comprehensive_collector.collection_stats['cross_verified_points']}")
    print(f"   Features Demonstrated: {len(demo_report['demonstrated_features'])}")
    print(f"   MCP Integration Available: {MCP_AVAILABLE}")

    return demo_report


def main():
    """主执行函数"""
    print("🚀 Enhanced Data Collector Demo")
    print("🎯 Demonstrating Advanced Data Collection Capabilities")
    print("🔧 MCP Integration Status:", "Available" if MCP_AVAILABLE else "Not Available")
    print("=" * 70)

    try:
        # 运行演示
        demo_report = asyncio.run(generate_demo_report())

        print("\n✅ Demo completed successfully!")
        print("🎉 All enhanced data collection features demonstrated")

        # 显示建议
        print(f"\n💡 Implementation Recommendations:")
        for i, recommendation in enumerate(demo_report["next_steps"], 1):
            print(f"   {i}. {recommendation}")

        print(f"\n🔧 Ready for integration with external AI project workflow!")

    except Exception as e:
        print(f"❌ Demo failed: {e}")
        import traceback
        traceback.print_exc()
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())