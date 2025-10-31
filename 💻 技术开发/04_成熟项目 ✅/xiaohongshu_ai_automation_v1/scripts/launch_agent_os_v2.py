#!/usr/bin/env python3
"""
LaunchX Agent OS v2.0 启动脚本
用于快速启动和测试智能业务战略平台

使用方法:
  python scripts/launch_agent_os_v2.py [选项]

选项:
  --test              运行集成测试
  --demo              运行演示模式
  --config <path>     指定配置文件路径
  --debug             启用调试模式
  --health            仅执行健康检查
  --help              显示帮助信息

创建时间: 2025-01-22
版本: v2.0.0
"""

import asyncio
import argparse
import json
import logging
import os
import sys
from datetime import datetime
from pathlib import Path

# 添加项目根目录到Python路径
project_root = Path(__file__).parent.parent
sys.path.append(str(project_root))

from core.agent_os_system_v2 import AgentOSSystemV2
from core.architecture_integration_test import ArchitectureIntegrationTest


class AgentOSLauncher:
    """Agent OS启动器"""

    def __init__(self):
        self.logger = self._setup_logging()
        self.system = None

    def _setup_logging(self, debug=False):
        """设置日志"""
        level = logging.DEBUG if debug else logging.INFO
        logging.basicConfig(
            level=level,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.StreamHandler(sys.stdout),
                logging.FileHandler(f'logs/agent_os_{datetime.now().strftime("%Y%m%d")}.log')
            ]
        )
        return logging.getLogger("AgentOSLauncher")

    async def run_health_check(self, config_path=None):
        """运行健康检查"""
        print("🔍 执行系统健康检查...")

        try:
            # 创建系统实例
            system = AgentOSSystemV2(config_path)

            # 初始化系统
            if not await system.initialize():
                print("❌ 系统初始化失败")
                return False

            # 获取系统状态
            status = system.get_system_status()

            # 显示健康状态
            print(f"\n📊 系统健康状态:")
            print(f"  整体状态: {status['system_health']['status']}")
            print(f"  系统版本: {status['config']['version']}")
            print(f"  最后检查: {status['system_health'].get('last_check', '未知')}")

            # 显示各层状态
            components = status['system_health'].get('components', {})
            for component_name, component_status in components.items():
                comp_status = component_status.get('status', 'unknown')
                print(f"  {component_name}: {comp_status}")

                if component_status.get('components'):
                    for sub_comp, sub_status in component_status['components'].items():
                        print(f"    - {sub_comp}: {sub_status}")

            # 显示问题
            issues = status['system_health'].get('issues', [])
            if issues:
                print(f"\n⚠️  发现的问题:")
                for issue in issues:
                    print(f"  • {issue}")
            else:
                print(f"\n✅ 未发现系统问题")

            return status['system_health']['status'] in ['healthy', 'degraded']

        except Exception as e:
            print(f"❌ 健康检查失败: {str(e)}")
            return False

    async def run_integration_test(self, config_path=None):
        """运行集成测试"""
        print("🧪 启动集成测试套件...")

        try:
            # 创建测试系统
            test_system = ArchitectureIntegrationTest()

            # 运行完整测试套件
            test_results = await test_system.run_comprehensive_test_suite()

            # 显示测试结果摘要
            print(f"\n📊 集成测试结果摘要:")
            print(f"  总测试场景: {test_results['total_scenarios']}")
            print(f"  通过场景: {test_results['passed_scenarios']}")
            print(f"  失败场景: {test_results['failed_scenarios']}")
            print(f"  部分成功: {test_results['partial_scenarios']}")
            print(f"  成功率: {test_results['success_rate']:.2%}")

            # 显示系统健康状态
            system_health = test_results.get('system_health', {})
            print(f"\n🏥 系统健康状态:")
            print(f"  整体状态: {system_health.get('overall_status', '未知')}")
            print(f"  最后检查: {system_health.get('last_check', '未知')}")

            # 显示性能摘要
            performance = test_results.get('performance_summary', {})
            if performance:
                print(f"\n⚡ 性能摘要:")
                print(f"  平均执行时间: {performance.get('average_execution_time', 0):.2f}秒")
                print(f"  最大执行时间: {performance.get('max_execution_time', 0):.2f}秒")
                print(f"  最小执行时间: {performance.get('min_execution_time', 0):.2f}秒")

            # 显示改进建议
            recommendations = test_results.get('recommendations', [])
            if recommendations:
                print(f"\n💡 改进建议:")
                for i, rec in enumerate(recommendations[:5], 1):  # 显示前5条建议
                    print(f"  {i}. {rec}")

            # 保存详细测试报告
            report = await test_system.generate_test_report(test_results)
            report_path = project_root / "test_reports" / f"integration_test_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
            report_path.parent.mkdir(exist_ok=True)

            with open(report_path, 'w', encoding='utf-8') as f:
                f.write(report)

            print(f"\n📄 详细测试报告已保存到: {report_path}")

            return test_results['success_rate'] >= 0.8

        except Exception as e:
            print(f"❌ 集成测试失败: {str(e)}")
            import traceback
            traceback.print_exc()
            return False

    async def run_demo(self, config_path=None):
        """运行演示模式"""
        print("🎬 启动演示模式...")

        try:
            # 创建系统实例
            system = AgentOSSystemV2(config_path)

            # 初始化和启动系统
            if not await system.initialize():
                print("❌ 系统初始化失败")
                return False

            await system.start()

            # 显示系统信息
            status = system.get_system_status()
            print(f"\n✅ {status['config']['name']} 已启动")
            print(f"📊 版本: {status['config']['version']}")
            print(f"🏥 系统状态: {status['system_health']['status']}")

            # 演示请求列表
            demo_requests = [
                {
                    "name": "投资分析请求",
                    "input": "我是一个制造业投资人，想了解AI质检技术的投资机会，请为我分析市场前景并推荐合适的投资标的",
                    "context": {
                        "company_name": "智能制造投资公司",
                        "industry": "投资管理",
                        "company_size": "medium",
                        "investment_focus": ["AI", "智能制造", "工业4.0"],
                        "ticket_size": "100-500万"
                    }
                },
                {
                    "name": "企业转型咨询",
                    "input": "我们是一家传统制造企业，计划进行AI数字化转型，请为我们制定详细的转型策略和实施路线图",
                    "context": {
                        "company_name": "精密制造有限公司",
                        "industry": "制造业",
                        "company_size": "large_enterprise",
                        "current_stage": "traditional",
                        "transformation_goals": ["智能化", "降本增效", "质量提升"]
                    }
                },
                {
                    "name": "市场趋势分析",
                    "input": "分析2025年AI Agent市场的发展趋势，包括主要玩家、技术方向和商业机会",
                    "context": {
                        "user_type": "market_researcher",
                        "analysis_depth": "comprehensive",
                        "time_horizon": "2025-2026",
                        "geographic_focus": "global"
                    }
                },
                {
                    "name": "技术选型咨询",
                    "input": "我们需要为企业级应用选择合适的AI技术栈，请推荐最佳的技术组合和架构方案",
                    "context": {
                        "project_type": "enterprise_application",
                        "scale": "large",
                        "requirements": ["可扩展性", "安全性", "易维护性"],
                        "technical_constraints": ["现有系统集成", "合规要求"]
                    }
                }
            ]

            # 处理演示请求
            for i, demo in enumerate(demo_requests, 1):
                print(f"\n{'='*60}")
                print(f"🎯 演示场景 {i}: {demo['name']}")
                print(f"{'='*60}")
                print(f"📝 用户输入: {demo['input'][:80]}...")

                request_data = {
                    "user_input": demo['input'],
                    "user_context": demo['context'],
                    "session_id": f"demo_session_{i:03d}",
                    "metadata": {
                        "demo_mode": True,
                        "scenario": demo['name']
                    }
                }

                # 处理请求
                start_time = datetime.now()
                response = await system.process_request(request_data)
                processing_time = (datetime.now() - start_time).total_seconds()

                # 显示结果
                if response.success:
                    print(f"✅ 处理成功 (耗时: {processing_time:.2f}秒)")
                    print(f"🎯 意图识别: {response.metadata.get('intent', 'unknown')}")
                    print(f"📊 置信度: {response.metadata.get('confidence', 0):.1%}")

                    print(f"\n📋 响应内容:")
                    print("-" * 40)
                    print(response.content)
                    print("-" * 40)

                    if response.recommendations:
                        print(f"\n💡 建议:")
                        for j, rec in enumerate(response.recommendations, 1):
                            print(f"  {j}. {rec}")

                    if response.next_actions:
                        print(f"\n🎯 下一步行动:")
                        for action in response.next_actions:
                            print(f"  • {action}")
                else:
                    print(f"❌ 处理失败: {response.metadata.get('error', '未知错误')}")

                # 添加分隔线
                if i < len(demo_requests):
                    print("\n" + "="*60)
                    await asyncio.sleep(1)  # 短暂停顿

            # 显示最终统计
            final_status = system.get_system_status()
            stats = final_status['session_stats']

            print(f"\n{'='*60}")
            print(f"📊 演示统计摘要")
            print(f"{'='*60}")
            print(f"  总请求数: {stats['total_requests']}")
            print(f"  成功处理: {stats['successful_requests']}")
            print(f"  处理失败: {stats['failed_requests']}")
            print(f"  成功率: {stats['successful_requests']/stats['total_requests']:.1%}")
            print(f"  平均响应时间: {stats['average_response_time']:.2f}秒")

            # 停止系统
            await system.stop()
            print(f"\n✅ 演示完成，系统已停止")

            return True

        except Exception as e:
            print(f"❌ 演示运行失败: {str(e)}")
            import traceback
            traceback.print_exc()
            return False

    async def run_interactive_mode(self, config_path=None):
        """运行交互模式"""
        print("🎮 启动交互模式...")
        print("输入 'help' 查看可用命令，输入 'quit' 退出")

        try:
            # 创建系统实例
            system = AgentOSSystemV2(config_path)

            # 初始化和启动系统
            if not await system.initialize():
                print("❌ 系统初始化失败")
                return False

            await system.start()
            print(f"\n✅ {system.config['system']['name']} 已就绪")
            print("💬 您可以开始输入您的业务需求...")

            session_id = f"interactive_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

            while True:
                try:
                    # 获取用户输入
                    user_input = input("\n👤 您: ").strip()

                    if not user_input:
                        continue

                    # 处理特殊命令
                    if user_input.lower() in ['quit', 'exit', '退出']:
                        break
                    elif user_input.lower() in ['help', '帮助']:
                        self._show_help()
                        continue
                    elif user_input.lower() in ['status', '状态']:
                        status = system.get_system_status()
                        self._show_status(status)
                        continue
                    elif user_input.lower() in ['clear', '清屏']:
                        os.system('clear' if os.name == 'posix' else 'cls')
                        continue

                    # 处理业务请求
                    print("🤖 AI: 正在分析您的需求...")

                    request_data = {
                        "user_input": user_input,
                        "user_context": {
                            "interaction_mode": "interactive",
                            "timestamp": datetime.now().isoformat()
                        },
                        "session_id": session_id
                    }

                    # 处理请求
                    start_time = datetime.now()
                    response = await system.process_request(request_data)
                    processing_time = (datetime.now() - start_time).total_seconds()

                    # 显示响应
                    print(f"\n🤖 AI ({processing_time:.2f}秒):")
                    if response.success:
                        print(response.content)

                        if response.recommendations:
                            print(f"\n💡 建议:")
                            for rec in response.recommendations:
                                print(f"  • {rec}")
                    else:
                        print(f"抱歉，处理过程中遇到了问题: {response.metadata.get('error', '未知错误')}")

                except KeyboardInterrupt:
                    print("\n\n👋 用户中断，正在退出...")
                    break
                except EOFError:
                    print("\n\n👋 输入结束，正在退出...")
                    break
                except Exception as e:
                    print(f"\n❌ 处理输入时发生错误: {str(e)}")

            # 停止系统
            await system.stop()
            print("✅ 交互模式已退出")

            return True

        except Exception as e:
            print(f"❌ 交互模式启动失败: {str(e)}")
            return False

    def _show_help(self):
        """显示帮助信息"""
        help_text = """
🎮 交互模式帮助

可用命令:
  help/帮助      - 显示此帮助信息
  status/状态    - 显示系统状态
  clear/清屏     - 清空屏幕
  quit/exit/退出 - 退出交互模式

使用示例:
  👤 您: 分析AI视频生成行业的投资机会
  👤 您: 为制造业设计AI质检解决方案
  👤 您: 评估企业AI转型的关键成功因素

💡 提示: 您可以直接输入业务需求，系统会自动识别意图并提供相应的分析和建议
        """
        print(help_text)

    def _show_status(self, status):
        """显示系统状态"""
        print(f"\n📊 系统状态:")
        print(f"  系统名称: {status['config']['name']}")
        print(f"  版本: {status['config']['version']}")
        print(f"  运行状态: {'运行中' if status['is_running'] else '已停止'}")
        print(f"  健康状态: {status['system_health']['status']}")

        stats = status['session_stats']
        print(f"  会话统计:")
        print(f"    总请求数: {stats['total_requests']}")
        print(f"    成功请求: {stats['successful_requests']}")
        print(f"    失败请求: {stats['failed_requests']}")
        if stats['total_requests'] > 0:
            print(f"    成功率: {stats['successful_requests']/stats['total_requests']:.1%}")
        if stats['average_response_time'] > 0:
            print(f"    平均响应时间: {stats['average_response_time']:.2f}秒")


async def main():
    """主函数"""
    parser = argparse.ArgumentParser(
        description="LaunchX Agent OS v2.0 启动器",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例用法:
  python scripts/launch_agent_os_v2.py --demo
  python scripts/launch_agent_os_v2.py --test
  python scripts/launch_agent_os_v2.py --health
  python scripts/launch_agent_os_v2.py --interactive
  python scripts/launch_agent_os_v2.py --config custom_config.json --demo
        """
    )

    parser.add_argument('--test', action='store_true', help='运行集成测试')
    parser.add_argument('--demo', action='store_true', help='运行演示模式')
    parser.add_argument('--interactive', action='store_true', help='运行交互模式')
    parser.add_argument('--health', action='store_true', help='执行健康检查')
    parser.add_argument('--config', type=str, help='指定配置文件路径')
    parser.add_argument('--debug', action='store_true', help='启用调试模式')

    args = parser.parse_args()

    # 创建启动器
    launcher = AgentOSLauncher()

    # 确保日志目录存在
    os.makedirs("logs", exist_ok=True)
    os.makedirs("test_reports", exist_ok=True)

    print("🚀 LaunchX Agent OS v2.0 启动器")
    print("=" * 50)

    try:
        success = False

        if args.health:
            success = await launcher.run_health_check(args.config)
        elif args.test:
            success = await launcher.run_integration_test(args.config)
        elif args.demo:
            success = await launcher.run_demo(args.config)
        elif args.interactive:
            success = await launcher.run_interactive_mode(args.config)
        else:
            # 默认运行演示模式
            print("未指定模式，运行演示模式...")
            success = await launcher.run_demo(args.config)

        if success:
            print(f"\n✅ 操作完成")
            return 0
        else:
            print(f"\n❌ 操作失败")
            return 1

    except KeyboardInterrupt:
        print(f"\n\n👋 用户中断操作")
        return 0
    except Exception as e:
        print(f"\n❌ 启动器异常: {str(e)}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)