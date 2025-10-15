#!/usr/bin/env python3
"""
LaunchX V3.0 演示脚本
展示系统核心功能和完整工作流
"""

import asyncio
import json
import logging
import sys
from pathlib import Path
from datetime import datetime

# 添加项目根目录到Python路径
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
sys.path.insert(0, str(PROJECT_ROOT))

# 导入项目模块
from automation.customer_prd_analyzer import CustomerPRDAnalyzer
from automation.mcp_strategy_system import MCPStrategySystem
from automation.strategy_learning_engine import StrategyLearningEngine
from automation.LaunchX_Customer_Workflow import LaunchXCustomerWorkflow, CustomerInput

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class LaunchXDemo:
    """LaunchX V3.0 演示类"""

    def __init__(self):
        self.prd_analyzer = CustomerPRDAnalyzer()
        self.strategy_system = MCPStrategySystem()
        self.learning_engine = StrategyLearningEngine()
        self.workflow = LaunchXCustomerWorkflow()

    async def run_complete_demo(self):
        """运行完整演示"""
        print("=" * 60)
        print("🚀 LaunchX V3.0 系统演示")
        print("=" * 60)

        try:
            # 1. 创建演示客户数据
            print("\n📋 步骤 1: 创建演示客户数据")
            customer_input = self.create_demo_customer()
            print(f"✅ 客户ID: {customer_input.customer_id}")

            # 2. 执行完整工作流
            print("\n🔄 步骤 2: 执行完整工作流")
            result = await self.workflow.execute_complete_workflow(customer_input)
            print(f"✅ 工作流ID: {result.workflow_id}")
            print(f"✅ 执行时间: {result.execution_summary.get('execution_time', 0):.2f}秒")

            # 3. 展示结果
            print("\n📊 步骤 3: 展示执行结果")
            await self.display_results(result)

            # 4. 生成演示报告
            print("\n📄 步骤 4: 生成演示报告")
            report_path = await self.generate_demo_report(result)
            print(f"✅ 演示报告已保存: {report_path}")

            print("\n🎉 演示完成！系统运行正常。")

        except Exception as e:
            logger.error(f"演示执行失败: {str(e)}")
            print(f"\n❌ 演示失败: {str(e)}")
            return False

        return True

    def create_demo_customer(self) -> CustomerInput:
        """创建演示客户数据"""
        demo_prd = """
# LaunchX 科技公司 - 智能AI助手产品

## 基本信息
- 公司名称：LaunchX 科技有限公司
- 行业：人工智能/软件开发
- 公司规模：中型（50-200人）
- 成立时间：2020年
- 官网：https://launchx.ai

## 品牌定位
- 品牌名称：LaunchX AI
- 品牌价值：让AI技术赋能每个人
- 市场定位：AI助手领域的创新者
- 竞争优势：技术创新能力强，产品易用性好
- 品牌语调：专业、创新、友好、可靠

## 目标受众
- 主要用户：25-45岁职场人士、技术开发者、创业者
- 用户特征：对AI技术感兴趣，追求效率提升，乐于尝试新工具
- 痛点：工作重复性高、效率提升困难、技术门槛高
- 兴趣爱好：科技产品、效率工具、人工智能、职业发展
- 消费习惯：理性消费，重视产品价值和技术实力

## 业务目标
- 主要目标：
  1. 品牌知名度建设（3个月内达到10万+用户认知）
  2. 用户增长（月活跃用户达到1万+）
  3. 产品推广（完成产品核心功能的用户教育）
- 成功指标：
  - 社交媒体互动率 > 8%
  - 粉丝增长率 > 15%
  - 内容转化率 > 3%
  - 品牌提及量月增长 > 20%
- 时间线：6个月
- 预算范围：中等（月投入2-5万）
- 预期ROI：用户获取成本 < 50元/人

## 运营要求
- 内容类型偏好：技术教程、产品测评、行业分析、用户故事
- 发布频率：每日1-2条高质量内容
- 平台要求：小红书为主，同步到抖音、B站
- 质量要求：专业、有价值、易于理解
- 互动要求：及时回复用户评论和问题
"""

        return CustomerInput(
            customer_id="demo_launchx_001",
            prd_content=demo_prd,
            business_context={
                "product_type": "AI助手",
                "target_market": "B2C",
                "competitive_landscape": "高度竞争",
                "unique_selling_proposition": "易用性强"
            },
            additional_requirements=[
                "注重技术专业性",
                "建立开发者社区",
                "加强用户教育"
            ]
        )

    async def display_results(self, result):
        """展示执行结果"""
        print("\n📈 执行摘要:")
        summary = result.execution_summary
        print(f"   • 工作流状态: {summary.get('status', 'unknown')}")
        print(f"   • 完成进度: {summary.get('progress', 0):.1f}%")
        print(f"   • 成功率: {summary.get('success_rate', 0)*100:.1f}%")

        if result.customer_analysis:
            print("\n👤 客户分析结果:")
            analysis = result.customer_analysis
            basic_info = analysis.get('basic_info', {})
            print(f"   • 公司名称: {basic_info.get('company_name', 'N/A')}")
            print(f"   • 行业: {basic_info.get('industry', 'N/A')}")

            insights = analysis.get('insights', {})
            maturity = insights.get('maturity_level', 'unknown')
            print(f"   • 成熟度等级: {maturity}")

        if result.strategy:
            print("\n🎯 策略生成结果:")
            strategy = result.strategy
            print(f"   • 策略ID: {strategy.get('strategy_id', 'N/A')}")
            print(f"   • 置信度: {strategy.get('confidence_score', 0):.2f}")

            content_strategy = strategy.get('content_strategy', {})
            pillars = content_strategy.get('pillars', [])
            print(f"   • 内容支柱数量: {len(pillars)}")

            if pillars:
                print("   • 主要内容支柱:")
                for i, pillar in enumerate(pillars[:3], 1):
                    print(f"     {i}. {pillar.get('name', 'N/A')}")

        if result.content_plan:
            print("\n📅 内容规划结果:")
            content_plan = result.content_plan
            calendar = content_plan.get('content_calendar', [])
            print(f"   • 计划内容数量: {len(calendar)}")
            print(f"   • 内容类型: {', '.join(set(item.get('content_type', 'N/A') for item in calendar[:5]))}")

        if result.performance_projections:
            print("\n📊 性能预测:")
            projections = result.performance_projections
            print(f"   • 预期互动率: {projections.get('expected_engagement_rate', 0):.3f}")
            print(f"   • 预期粉丝增长率: {projections.get('expected_follower_growth', 0):.3f}")
            print(f"   • 预期内容质量: {projections.get('expected_content_quality', 0):.3f}")

        if result.recommendations:
            print("\n💡 主要建议:")
            for i, rec in enumerate(result.recommendations[:5], 1):
                print(f"   {i}. {rec}")

        if result.next_steps:
            print("\n🔄 下一步行动:")
            for i, step in enumerate(result.next_steps[:5], 1):
                print(f"   {i}. {step}")

    async def generate_demo_report(self, result) -> str:
        """生成演示报告"""
        report = {
            "demo_info": {
                "demo_id": f"demo_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                "timestamp": datetime.now().isoformat(),
                "version": "3.0.0"
            },
            "execution_summary": result.execution_summary,
            "key_results": {
                "customer_analysis_completed": bool(result.customer_analysis),
                "strategy_generated": bool(result.strategy),
                "content_plan_created": bool(result.content_plan),
                "learning_plan_setup": bool(result.learning_plan),
                "final_report_generated": bool(result.final_report)
            },
            "performance_projections": result.performance_projections,
            "recommendations": result.recommendations,
            "next_steps": result.next_steps
        }

        # 保存报告
        reports_dir = PROJECT_ROOT / "demo_reports"
        reports_dir.mkdir(exist_ok=True)

        report_path = reports_dir / f"demo_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"

        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2, default=str)

        return str(report_path)

    async def run_individual_demos(self):
        """运行单独的模块演示"""
        print("=" * 60)
        print("🔧 LaunchX V3.0 模块演示")
        print("=" * 60)

        # 1. 客户PRD分析演示
        print("\n📋 客户PRD分析演示")
        await self.demo_customer_analysis()

        # 2. MCP策略生成演示
        print("\n🎯 MCP策略生成演示")
        await self.demo_strategy_generation()

        # 3. 学习优化引擎演示
        print("\n🧠 学习优化引擎演示")
        await self.demo_learning_engine()

        print("\n✅ 所有模块演示完成！")

    async def demo_customer_analysis(self):
        """演示客户分析功能"""
        try:
            customer_input = self.create_demo_customer()

            if customer_input.prd_content:
                analysis = await self.prd_analyzer.analyze_prd_content(customer_input.prd_content)

                print(f"✅ 分析ID: {analysis.get('analysis_id')}")
                print(f"✅ 数据质量完整性: {analysis.get('data_quality', {}).get('completeness', 0):.2f}")
                print(f"✅ 客户成熟度: {analysis.get('insights', {}).get('maturity_level', 'unknown')}")
            else:
                print("❌ 没有PRD内容可供分析")

        except Exception as e:
            print(f"❌ 客户分析演示失败: {str(e)}")

    async def demo_strategy_generation(self):
        """演示策略生成功能"""
        try:
            # 准备客户数据
            customer_data = {
                'customer_id': 'demo_001',
                'basic_info': {
                    'company_name': 'LaunchX 科技',
                    'industry': '人工智能',
                    'company_size': '中型'
                },
                'brand_positioning': {
                    'brand_name': 'LaunchX AI',
                    'brand_value': '让AI技术赋能每个人'
                },
                'target_audience': {
                    'primary_demographic': '25-45岁职场人士'
                },
                'business_goals': {
                    'primary_goals': ['品牌建设', '用户增长']
                }
            }

            strategy = await self.strategy_system.generate_comprehensive_strategy(customer_data)

            print(f"✅ 策略ID: {strategy.get('strategy_id')}")
            print(f"✅ 策略类型: {strategy.get('strategy_type')}")
            print(f"✅ 置信度: {strategy.get('confidence_score', 0):.2f}")

            # 验证策略可行性
            feasibility = await self.strategy_system.validate_strategy_feasibility(strategy)
            print(f"✅ 可行性评分: {feasibility:.2f}")

        except Exception as e:
            print(f"❌ 策略生成演示失败: {str(e)}")

    async def demo_learning_engine(self):
        """演示学习优化引擎"""
        try:
            # 模拟表现数据
            performance_data = {
                'strategy_id': 'demo_strategy_001',
                'customer_id': 'demo_customer_001',
                'period_data': {
                    'start_date': '2025-09-01T00:00:00',
                    'end_date': '2025-09-30T23:59:59',
                    'content_metrics': {
                        'engagement_rate': 0.08,
                        'reach_rate': 0.65,
                        'share_rate': 0.05,
                        'save_rate': 0.12
                    },
                    'audience_metrics': {
                        'follower_growth': 0.15,
                        'audience_retention': 0.82
                    },
                    'business_metrics': {
                        'conversion_rate': 0.035,
                        'brand_mentions': 150
                    },
                    'quality_metrics': {
                        'relevance_score': 0.85,
                        'visual_score': 0.78,
                        'value_score': 0.82
                    }
                }
            }

            performance = await self.learning_engine.analyze_performance_data(performance_data)

            print(f"✅ 表现分析完成")
            print(f"✅ 综合分数: {performance.overall_score:.3f}")
            print(f"✅ 表现等级: {performance.performance_level.value}")

            # 生成优化建议
            recommendations = await self.learning_engine.generate_optimization_recommendations(performance)
            print(f"✅ 优化建议数量: {len(recommendations)}")

            # 创建学习计划
            customer_config = {'industry': '人工智能'}
            content_strategy = {'pillars': []}
            learning_plan = await self.learning_engine.create_learning_plan(customer_config, content_strategy)
            print(f"✅ 学习计划创建完成")

        except Exception as e:
            print(f"❌ 学习引擎演示失败: {str(e)}")


async def main():
    """主函数"""
    print("🎯 LaunchX V3.0 演示系统")
    print("自动运行完整工作流演示...")

    # 自动选择完整工作流演示
    demo = LaunchXDemo()

    print("\n🚀 执行完整工作流演示")
    success = await demo.run_complete_demo()
    if success:
        print("\n🎉 完整工作流演示成功完成！")
    else:
        print("\n❌ 演示过程中出现问题")
        sys.exit(1)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\n👋 演示已取消")
    except Exception as e:
        print(f"\n❌ 演示执行出错: {str(e)}")
        sys.exit(1)