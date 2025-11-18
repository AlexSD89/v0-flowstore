"""
MCP集成演示代码
===============

演示完整的MCP工具集成功能，包括RUBE搜索、并行执行和远程工作台分析。
基于AI项目档案管理工作流v2.4-完整版的实际使用场景。

Author: LaunchX Claude Team
Version: 1.0.0
Created: 2025-01-18
"""

import asyncio
import json
import logging
from datetime import datetime

from mcp_integration import init_mcp_integration, get_mcp_integration
from rube_tools import (
    init_rube_tools, get_rube_tools,
    RUBESearchConfig, RUBEToolConfig, RUBEMultiExecuteConfig, RUBEWorkbenchConfig
)
from parallel_executor import (
    init_parallel_executor, get_parallel_executor,
    ParallelTask, TaskPriority, TaskStatus
)


def setup_logging():
    """设置日志"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )


async def demo_rube_search_tools():
    """演示RUBE搜索工具"""
    print("\n" + "="*60)
    print("🔍 演示1: RUBE搜索工具集成")
    print("="*60)

    try:
        # 初始化RUBE工具管理器
        rube_tools = get_rube_tools()

        # 执行搜索
        search_result = await rube_tools.rube_search_tools(
            use_case="AI项目深度分析",
            max_results=15,
            search_depth="deep"
        )

        print(f"✅ 搜索成功完成")
        print(f"   会话ID: {search_result.session_id}")
        print(f"   可用工具数量: {search_result.tool_count}")
        print(f"   搜索能力: {', '.join(search_result.search_capabilities)}")
        print(f"   可用工具: {', '.join(search_result.available_tools)}")

        return search_result.session_id

    except Exception as e:
        print(f"❌ 搜索工具演示失败: {str(e)}")
        return None


async def demo_parallel_execution():
    """演示并行执行工具"""
    print("\n" + "="*60)
    print("🚀 演示2: RUBE并行工具执行集成")
    print("="*60)

    try:
        # 初始化并行执行器
        executor = get_parallel_executor()

        # 创建工具配置
        tools_to_execute = [
            RUBEToolConfig(
                tool_slug="TAVILY_TAVILY_SEARCH",
                arguments={
                    "query": "AI workflow automation",
                    "max_results": 10
                },
                priority=3
            ),
            RUBEToolConfig(
                tool_slug="FIRECRAWL_SEARCH",
                arguments={
                    "query": "AI project documentation",
                    "limit": 8
                },
                priority=3
            ),
            RUBEToolConfig(
                tool_slug="GITHUB_SEARCH_REPOSITORIES",
                arguments={
                    "query": "AI automation tools",
                    "language": "python"
                },
                priority=2
            )
        ]

        # 创建多工具执行配置
        multi_execute_config = RUBEMultiExecuteConfig(
            tools=tools_to_execute,
            session_id="demo_parallel_session",
            memory={"project_focus": ["AI项目档案管理", "工作流自动化"]},
            parallel_limit=2,
            continue_on_error=True
        )

        # 执行并行任务
        execution_result = await executor.execute_parallel_tasks([
            ParallelTask(
                task_id="search_task_1",
                tool_slug="TAVILY_TAVILY_SEARCH",
                arguments=tools_to_execute[0].arguments,
                priority=TaskPriority.HIGH
            ),
            ParallelTask(
                task_id="search_task_2",
                tool_slug="FIRECRAWL_SEARCH",
                arguments=tools_to_execute[1].arguments,
                priority=TaskPriority.HIGH
            ),
            ParallelTask(
                task_id="search_task_3",
                tool_slug="GITHUB_SEARCH_REPOSITORIES",
                arguments=tools_to_execute[2].arguments,
                priority=TaskPriority.NORMAL
            )
        ], parallel_limit=2)

        print(f"✅ 并行执行成功完成")
        print(f"   计划ID: {execution_result.plan_id}")
        print(f"   总任务数: {execution_result.total_tasks}")
        print(f"   成功任务数: {execution_result.completed_tasks}")
        print(f"   失败任务数: {execution_result.failed_tasks}")
        print(f"   成功率: {execution_result.success_rate:.1f}%")
        print(f"   总执行时间: {execution_result.total_execution_time:.2f}s")

        # 显示详细结果
        for result in execution_result.results:
            status_emoji = "✅" if result["status"] == "completed" else "❌"
            print(f"   {status_emoji} {result['task_id']}: {result['status']} ({result['execution_time']:.2f}s)")

        return execution_result.plan_id

    except Exception as e:
        print(f"❌ 并行执行演示失败: {str(e)}")
        return None


async def demo_remote_workbench(session_id: str):
    """演示RUBE远程工作台"""
    print("\n" + "="*60)
    print("🧠 演示3: RUBE远程工作台分析集成")
    print("="*60)

    try:
        # 初始化RUBE工具管理器
        rube_tools = get_rube_tools()

        # 分析代码
        analysis_code = """
# 数据排序和质量评估
import pandas as pd
import numpy as np

# 模拟采集的数据
collected_data = {
    "web_search": {"relevance": 0.8, "authority": 0.7, "recency": 0.9},
    "github_repos": {"relevance": 0.9, "authority": 0.6, "recency": 0.8},
    "technical_docs": {"relevance": 0.7, "authority": 0.9, "recency": 0.7}
}

# 计算综合质量分数
quality_scores = []
for source, metrics in collected_data.items():
    weighted_score = (
        metrics["relevance"] * 0.4 +
        metrics["authority"] * 0.4 +
        metrics["recency"] * 0.2
    )
    quality_scores.append({"source": source, "score": weighted_score})

# 排序并生成洞察
sorted_data = sorted(quality_scores, key=lambda x: x["score"], reverse=True)
key_insights = [
    f"最高质量数据源: {sorted_data[0]['source']} (分数: {sorted_data[0]['score']:.2f})",
    f"平均质量分数: {np.mean([item['score'] for item in sorted_data]):.2f}"
]

print(f"数据质量分析完成，共处理{len(collected_data)}个数据源")
"""

        # 执行工作台分析
        workbench_result = await rube_tools.rube_remote_workbench(
            session_id=session_id or "demo_workbench_session",
            code_to_execute=analysis_code,
            thought_process="对采集的数据进行质量评估和排序分析",
            analysis_type="analysis",
            data_context={"analysis_type": "data_quality_assessment"}
        )

        print(f"✅ 工作台分析成功完成")
        print(f"   会话ID: {workbench_result.session_id}")
        print(f"   分析结果: {workbench_result.analysis_result}")
        print(f"   数据质量分数: {workbench_result.data_quality_score}/100")
        print(f"   生成的洞察数量: {len(workbench_result.insights)}")
        print(f"   建议数量: {len(workbench_result.recommendations)}")

        # 显示关键洞察
        if workbench_result.insights:
            print(f"   🔍 关键洞察:")
            for i, insight in enumerate(workbench_result.insights[:3], 1):
                print(f"      {i}. {insight}")

        # 显示建议
        if workbench_result.recommendations:
            print(f"   💡 建议:")
            for i, rec in enumerate(workbench_result.recommendations[:3], 1):
                print(f"      {i}. {rec}")

        return workbench_result

    except Exception as e:
        print(f"❌ 远程工作台演示失败: {str(e)}")
        return None


async def demo_complete_project_analysis():
    """演示完整的项目分析工作流"""
    print("\n" + "="*60)
    print("🎯 演示4: 完整项目分析工作流")
    print("="*60)

    try:
        # 初始化RUBE工具管理器
        rube_tools = get_rube_tools()

        # 执行完整工作流
        workflow_result = await rube_tools.execute_project_analysis_workflow(
            project_name="SERVAL",
            analysis_depth="comprehensive"
        )

        print(f"📊 工作流执行摘要:")
        print(f"   项目名称: {workflow_result['project_name']}")
        print(f"   分析深度: {workflow_result['analysis_depth']}")

        if workflow_result['final_result']['status'] == 'success':
            final_result = workflow_result['final_result']
            print(f"   ✅ 工作流成功完成")
            print(f"   📈 数据质量分数: {final_result['data_quality_score']}/100")
            print(f"   💡 洞察数量: {final_result['insights_count']}")
            print(f"   🎯 建议数量: {final_result['recommendations_count']}")
            print(f"   ⏱️  总执行时间: {final_result['total_execution_time']:.2f}s")

            # 显示各步骤结果
            for step_name, step_result in workflow_result['steps'].items():
                print(f"\n   📋 {step_name.upper()}:")
                if isinstance(step_result, dict):
                    for key, value in step_result.items():
                        if key not in ['timestamp']:
                            print(f"      • {key}: {value}")
        else:
            print(f"   ❌ 工作流执行失败: {workflow_result['final_result']['error']}")

        return workflow_result

    except Exception as e:
        print(f"❌ 完整工作流演示失败: {str(e)}")
        return None


async def demo_mcp_integration_status():
    """演示MCP集成状态检查"""
    print("\n" + "="*60)
    print("📊 演示5: MCP集成状态检查")
    print("="*60)

    try:
        # MCP集成状态
        mcp_integration = get_mcp_integration()
        mcp_stats = mcp_integration.get_statistics()

        print(f"🔧 MCP集成核心状态:")
        print(f"   • 总会话数: {mcp_stats['total_sessions']}")
        print(f"   • 总执行次数: {mcp_stats['total_executions']}")
        print(f"   • 成功率: {mcp_stats['success_rate']:.1f}%")
        print(f"   • 注册工具数: {mcp_stats['registered_tools']}")
        print(f"   • 活跃会话数: {mcp_stats['active_sessions']}")

        # RUBE工具状态
        rube_tools = get_rube_tools()
        rube_status = await rube_tools.get_tool_status()

        print(f"\n🛠️  RUBE工具状态:")
        print(f"   • RUBE工具总数: {rube_status['total_rube_tools']}")
        print(f"   • 集成状态: {rube_status['integration_status']}")

        for tool in rube_status['available_tools']:
            print(f"      • {tool['name']} (优先级: {tool['priority']})")

        # 并行执行器统计
        executor = get_parallel_executor()
        executor_stats = executor.get_execution_statistics()

        print(f"\n🚀 并行执行器统计:")
        print(f"   • 总执行次数: {executor_stats['total_executions']}")
        print(f"   • 平均成功率: {executor_stats['average_success_rate']:.1f}%")
        print(f"   • 总任务数: {executor_stats['total_tasks_executed']}")
        print(f"   • 平均执行时间: {executor_stats['average_execution_time']:.2f}s")

        return True

    except Exception as e:
        print(f"❌ 状态检查失败: {str(e)}")
        return False


async def main():
    """主演示函数"""
    print("🎉 MCP集成完整功能演示")
    print("基于AI项目档案管理工作流v2.4-完整版")
    print("=" * 80)

    # 设置日志
    setup_logging()

    # 初始化所有组件
    print("\n🔧 初始化MCP集成组件...")
    try:
        mcp_integration = init_mcp_integration()
        rube_tools = init_rube_tools(mcp_integration)
        parallel_executor = init_parallel_executor(mcp_integration, rube_tools)
        print("✅ 所有组件初始化成功")
    except Exception as e:
        print(f"❌ 组件初始化失败: {str(e)}")
        return

    # 执行演示序列
    demo_results = {}

    try:
        # 演示1: RUBE搜索工具
        session_id = await demo_rube_search_tools()
        demo_results["search"] = session_id is not None

        # 演示2: 并行执行
        plan_id = await demo_parallel_execution()
        demo_results["parallel"] = plan_id is not None

        # 演示3: 远程工作台
        workbench_result = await demo_remote_workbench(session_id or "demo_session")
        demo_results["workbench"] = workbench_result is not None

        # 演示4: 完整工作流
        workflow_result = await demo_complete_project_analysis()
        demo_results["workflow"] = workflow_result is not None

        # 演示5: 状态检查
        status_ok = await demo_mcp_integration_status()
        demo_results["status"] = status_ok

    except KeyboardInterrupt:
        print("\n\n⚠️  演示被用户中断")
    except Exception as e:
        print(f"\n\n❌ 演示过程中出现错误: {str(e)}")

    # 最终摘要
    print("\n" + "="*80)
    print("📊 演示结果摘要")
    print("="*80)

    total_demos = len(demo_results)
    successful_demos = sum(demo_results.values())

    print(f"✅ 成功演示: {successful_demos}/{total_demos}")

    for demo_name, success in demo_results.items():
        status_emoji = "✅" if success else "❌"
        demo_display_name = {
            "search": "RUBE搜索工具",
            "parallel": "并行执行工具",
            "workbench": "远程工作台",
            "workflow": "完整工作流",
            "status": "状态检查"
        }.get(demo_name, demo_name)
        print(f"   {status_emoji} {demo_display_name}")

    if successful_demos == total_demos:
        print(f"\n🎉 所有演示均成功完成！MCP集成功能完全正常。")
    else:
        print(f"\n⚠️  部分演示失败，请检查相关配置和依赖。")

    print(f"\n📝 演示完成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")


if __name__ == "__main__":
    # 运行演示
    asyncio.run(main())