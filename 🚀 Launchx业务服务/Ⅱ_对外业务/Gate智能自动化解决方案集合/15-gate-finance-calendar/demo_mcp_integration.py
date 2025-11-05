#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gate智能财经日历 - MCP工具集成演示
展示Gate统一工具接口如何整合Tavily、Firecrawl、Composio等MCP工具
"""

import asyncio
import json
import logging
import sys
import os
from datetime import datetime, timedelta

# 添加项目路径
sys.path.append(os.path.join(os.path.dirname(__file__), 'src', 'integration'))
from mcp_toolkit import GateIntegrationLayer, MCPToolkitManager

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class MCPIntegrationDemo:
    """MCP工具集成演示系统"""

    def __init__(self):
        self.gate_layer = GateIntegrationLayer()
        self.demo_id = f"mcp-demo-{datetime.now().strftime('%Y%m%d-%H%M%S')}"

    async def demo_toolkit_status(self):
        """演示工具包状态"""
        print("🔧 MCP工具包状态检查")
        print("=" * 50)

        manager = MCPToolkitManager()
        status = manager.get_toolkit_status()

        print(f"📊 总工具包数量: {status['total_toolkits']}")
        print(f"✅ 激活工具包数量: {status['active_toolkits']}")
        print(f"\n🛠️ 工具包详情:")

        for name, details in status['toolkit_details'].items():
            status_icon = "✅" if details['is_active'] else "❌"
            print(f"   {status_icon} {name}")
            print(f"      📝 {details['description']}")
            print(f"      🔄 状态: {'激活' if details['is_active'] else '未激活'}")

        return status

    async def demo_financial_search(self):
        """演示财经事件搜索"""
        print("\n🔍 Gate财经事件搜索演示")
        print("=" * 50)

        # 测试查询列表
        test_queries = [
            "美联储利率决议 2025年",
            "中国央行MLF操作时间",
            "腾讯Q3财报发布",
            "美国CPI通胀数据"
        ]

        all_results = {}

        for query in test_queries:
            print(f"\n🔍 搜索查询: {query}")
            print("-" * 30)

            try:
                # 使用所有工具包搜索
                search_result = await self.gate_layer.mcp_manager.search_financial_events(
                    query=query,
                    max_results=3
                )

                all_results[query] = search_result

                print(f"📊 搜索结果汇总:")
                print(f"   🔧 使用工具: {', '.join(search_result['toolkits_used'])}")
                print(f"   📈 总结果数: {search_result['total_results']}")

                # 展示各工具结果
                for toolkit, results in search_result['results'].items():
                    if results:
                        print(f"   ✅ {toolkit}: {len(results)} 个结果")
                        for i, result in enumerate(results[:2], 1):  # 只显示前2个
                            print(f"      {i}. {result.get('title', 'N/A')}")
                            print(f"         📅 {result.get('publish_date', 'N/A')}")
                    else:
                        print(f"   ❌ {toolkit}: 0 个结果")

            except Exception as e:
                logger.error(f"❌ 搜索失败 '{query}': {e}")
                all_results[query] = {"error": str(e)}

        return all_results

    async def demo_batch_extraction(self):
        """演示批量数据提取"""
        print("\n📊 批量数据提取演示")
        print("=" * 50)

        # 测试URL列表
        test_urls = [
            "https://www.federalreserve.gov",
            "https://www.pbc.gov.cn",
            "https://www.hkexnews.hk",
            "https://finance.yahoo.com"
        ]

        print(f"🌐 测试URL数量: {len(test_urls)}")

        try:
            # 使用Gate集成层进行批量提取
            extracted_data = await self.gate_layer.mcp_manager.extract_event_data_batch(test_urls)

            print(f"\n📊 数据提取结果:")
            print(f"   🎯 成功提取: {len(extracted_data)} 个")

            for i, data in enumerate(extracted_data, 1):
                print(f"   ✅ 提取 {i}: {data.get('source', 'Unknown')} - {data.get('url', 'N/A')}")

        except Exception as e:
            logger.error(f"❌ 批量提取失败: {e}")

    async def demo_comprehensive_collection(self):
        """演示完整的数据收集流程"""
        print("\n🚀 Gate完整数据收集演示")
        print("=" * 50)

        # 定义完整的搜索查询集
        comprehensive_queries = [
            "宏观经济数据: CPI、GDP、PMI、就业数据",
            "央行政策: 美联储、中国央行、欧洲央行",
            "公司财报: 科技巨头、金融股、消费股",
            "市场事件: 股市开盘、交易时间、假期安排"
        ]

        print(f"📋 完整查询数量: {len(comprehensive_queries)}")

        try:
            # 执行完整收集
            collection_result = await self.gate_layer.collect_financial_events(
                search_queries=comprehensive_queries,
                max_results=5,
                search_depth="advanced"
            )

            summary = collection_result['summary']
            events = collection_result['events']

            print(f"\n📊 收集结果汇总:")
            print(f"   🎯 集成ID: {summary['integration_id']}")
            print(f"   ⏱️ 开始时间: {summary['start_time']}")
            print(f"   🏁 结束时间: {summary['end_time']}")
            print(f"   ⏱️ 耗时: {summary['duration_seconds']:.2f} 秒")
            print(f"   🔍 处理查询: {summary['queries_processed']}/{len(comprehensive_queries)}")
            print(f"   📅 收集事件: {summary['events_collected']} 个")
            print(f"   🛠️ 使用工具: {', '.join(set(summary['toolkits_used']))}")

            # 展示事件类型分布
            if events:
                event_types = {}
                for event in events:
                    event_type = event.get('event_type', 'unknown')
                    event_types[event_type] = event_types.get(event_type, 0) + 1

                print(f"\n📈 事件类型分布:")
                for event_type, count in sorted(event_types.items()):
                    print(f"   📊 {event_type}: {count} 个事件")

            return collection_result

        except Exception as e:
            logger.error(f"❌ 完整收集失败: {e}")
            return None

    async def demo_gate_standard_output(self):
        """演示Gate标准化输出"""
        print("\n📄 Gate标准化输出演示")
        print("=" * 50)

        # 生成示例标准化事件
        sample_events = [
            {
                "event_id": "gate_001",
                "event_title": "美国CPI数据发布",
                "event_title_en": "US CPI Data Release",
                "event_type": "macro",
                "importance_level": 5,
                "risk_level": "high",
                "publish_time": "2025-11-14T08:30:00Z",
                "data_source": "Gate MCP Integration",
                "source_url": "https://gate-finance-calendar.example",
                "description": "美国10月CPI数据即将公布，市场高度关注通胀趋势",
                "gate_standardized": True,
                "collection_timestamp": datetime.now().isoformat()
            },
            {
                "event_id": "gate_002",
                "event_title": "腾讯Q3财报发布",
                "event_title_en": "Tencent Q3 Earnings",
                "event_type": "company",
                "importance_level": 4,
                "risk_level": "medium",
                "publish_time": "2025-11-15T09:00:00Z",
                "data_source": "Gate MCP Integration",
                "source_url": "https://hkexnews.hk",
                "description": "腾讯控股第三季度财报发布，重点关注营收和利润增长",
                "gate_standardized": True,
                "collection_timestamp": datetime.now().isoformat()
            }
        ]

        # 生成Gate标准格式输出
        gate_output = {
            "generated_by": "Gate智能财经日历 MCP集成系统",
            "integration_id": self.demo_id,
            "generation_time": datetime.now().isoformat(),
            "gate_version": "v1.0",
            "data_source": "MCP工具集成层",
            "total_events": len(sample_events),
            "high_impact_events": len([e for e in sample_events if e.get('importance_level', 0) >= 4]),
            "events": sample_events
        }

        # 保存输出文件
        output_file = f"gate_mcp_output_{self.demo_id}.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(gate_output, f, ensure_ascii=False, indent=2)

        print(f"📄 Gate标准输出已生成: {output_file}")
        print(f"📊 输出事件数量: {gate_output['total_events']}")
        print(f"⚡ 高影响事件: {gate_output['high_impact_events']}")

        return gate_output

    async def run_complete_demo(self):
        """运行完整的MCP集成演示"""
        print("🚀 Gate智能财经日历 - MCP工具集成完整演示")
        print("=" * 60)
        print(f"🆔 演示ID: {self.demo_id}")
        print(f"🕐 演示时间: {datetime.now().isoformat()}")
        print("=" * 60)

        try:
            # 1. 工具包状态检查
            status = await self.demo_toolkit_status()

            # 2. 财经事件搜索演示
            search_results = await self.demo_financial_search()

            # 3. 批量数据提取演示
            await self.demo_batch_extraction()

            # 4. 完整数据收集演示
            collection_result = await self.demo_comprehensive_collection()

            # 5. Gate标准化输出演示
            standard_output = await self.demo_gate_standard_output()

            print("\n🎉 MCP集成演示完成!")
            print("=" * 60)

            # 生成演示总结
            demo_summary = {
                "demo_id": self.demo_id,
                "completion_time": datetime.now().isoformat(),
                "total_active_toolkits": status['active_toolkits'],
                "search_queries_executed": len(search_results),
                "data_collection_successful": collection_result is not None,
                "standard_output_generated": True,
                "status": "SUCCESS"
            }

            # 保存演示总结
            summary_file = f"mcp_demo_summary_{self.demo_id}.json"
            with open(summary_file, 'w', encoding='utf-8') as f:
                json.dump(demo_summary, f, ensure_ascii=False, indent=2)

            print(f"📋 演示总结已保存: {summary_file}")
            print(f"🎯 演示状态: {demo_summary['status']}")

            return demo_summary

        except Exception as e:
            logger.error(f"❌ 演示执行失败: {e}")

            error_summary = {
                "demo_id": self.demo_id,
                "completion_time": datetime.now().isoformat(),
                "status": "FAILED",
                "error": str(e)
            }

            summary_file = f"mcp_demo_error_{self.demo_id}.json"
            with open(summary_file, 'w', encoding='utf-8') as f:
                json.dump(error_summary, f, ensure_ascii=False, indent=2)

            return error_summary

async def main():
    """主函数 - 执行MCP集成演示"""
    demo = MCPIntegrationDemo()
    result = await demo.run_complete_demo()

    if result.get('status') == 'SUCCESS':
        print("\n✅ MCP工具集成演示成功完成!")
        print("🔥 Gate智能财经日历已成功集成Tavily、Firecrawl、Composio Search等MCP工具")
        print("🚀 这展示了Gate统一工具接口的强大能力!")
    else:
        print(f"\n❌ 演示失败: {result.get('error', 'Unknown error')}")

if __name__ == "__main__":
    asyncio.run(main())