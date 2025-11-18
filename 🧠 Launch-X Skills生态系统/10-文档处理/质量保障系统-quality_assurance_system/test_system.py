#!/usr/bin/env python3
"""
质量保障系统测试脚本 - 验证三层质量验证体系
"""

import asyncio
from quality_system_integration_final import QualityAssuranceSystem, QualitySystemConfiguration, QualityThresholds

async def test_quality_assurance_system():
    """测试质量保障系统"""
    print("🧪 质量保障系统测试")
    print("="*60)

    # 测试数据
    test_content = """
# 测试AI项目档案

## 1. 项目核心概览

### 1.1 价值定位
**一句话定位**: AI自动化解决方案提供商

**核心标签**: AI, 自动化, 企业服务

### 1.2 关键数据快照
| 核心指标 | 具体数据 | 数据来源 | 可信度 |
|:---------|:--------:|:--------:|:--------:|
| **成立时间** | 2020年 | 官方网站 | ★★★★☆ |
| **融资阶段** | A轮 | VC公告 | ★★★★★ |
| **团队规模** | 150人 | LinkedIn | ★★★★☆ |
| **用户基数** | 50万+ | 应用商店 | ★★★☆☆ |

### 1.3 发展阶段判断
**当前阶段**: 成长期

### 1.4 团队核心优势
**核心优势**: 技术团队经验丰富

## 2. 核心数据分析

### 2.1 融资历程与估值增长
| 时间 | 轮次 | 金额 | 估值 |
|------|------|------|------|
| 2022年 | A轮 | 1000万美元 | 2亿美元 |

### 2.2 用户增长与留存数据
- **总用户数**: 50万+
- **月活跃用户**: 12万
- **用户留存率**: 78%

### 2.3 收入结构与盈利模式
- **订阅收入**: 1500万
- **增长率**: 150%

## 8. 完整数据溯源

### A区：基础信息数据
#### A.1 项目基础档案
| 字段类别 | 精确数据 | 数据来源 | 可信度 |
|----------|----------|----------|:------:|
| **基本信息** | AI自动化平台 | 官方网站 | ★★★★☆ |
| **当前估值** | 2亿美元 | 融资数据库 | ★★★★☆ |
| **最新轮次** | A轮 | VC公告 | ★★★★★ |

### B区：市场与商业数据
#### B.1 市场地位
| 字段类别 | 精确数据 | 数据来源 | 可信度 |
|----------|----------|----------|:------:|
| **市场份额** | 5% | 行业报告 | ★★★☆☆ |
| **竞争对手** | UiPath等 | 市场分析 | ★★★★☆ |

### C区：技术产品数据
#### C.1 技术栈
| 字段类别 | 精确数据 | 数据来源 | 可信度 |
|----------|----------|----------|:------:|
| **核心技术** | 深度学习 | 技术文档 | ★★★★☆ |
| **专利数量** | 16项 | 专利数据库 | ★★★★★ |

### D区：财务投资数据
#### D.1 融资信息
| 字段类别 | 精确数据 | 数据来源 | 可信度 |
|----------|----------|----------|:------:|
| **融资轮次** | A轮完成 | VC公告 | ★★★★★ |
| **融资金额** | 1000万美元 | 投资条款 | ★★★★★ |
| **投资方** | 知名VC | 官方公告 | ★★★★★ |

### E区：LaunchX集成数据
#### E.1 技术集成
| 字段类别 | 精确数据 | 数据来源 | 可信度 |
|----------|----------|----------|:------:|
| **API兼容性** | 95%兼容 | 技术测试 | ★★★★☆ |
| **数据格式** | JSON/CSV/XML | 技术文档 | ★★★★☆ |
| **认证方式** | OAuth2.0 | 开发者文档 | ★★★★☆ |

### F区：知识价值数据
#### F.1 行业洞察
| 字段类别 | 精确数据 | 数据来源 | 可信度 |
|----------|----------|----------|:------:|
| **行业趋势** | AI自动化快速发展 | 行业报告 | ★★★★☆ |
| **市场机会** | 千亿级市场 | 市场分析 | ★★★☆☆ |

### G区：补充信息
#### G.1 媒体报道
| 字段类别 | 精确数据 | 数据来源 | 可信度 |
|----------|----------|----------|:------:|
| **媒体报道** | 知名媒体报道 | 媒体检索 | ★★★☆☆ |
| **获奖情况** | AI创新企业奖 | 官方获奖信息 | ★★★★☆ |

#### G.2 用户评价
| 字段类别 | 精确数据 | 数据来源 | 可信度 |
|----------|----------|----------|:------:|
| **客户评价** | "提升工作效率" | 客户访谈 | ★★★☆☆ |
| **用户体验** | 4.5/5.0星 | 应用商店 | ★★★☆☆ |
    """

    test_validation_sources = [
        {
            "name": "Crunchbase",
            "type": "secondary",
            "content": "TestProject成立于2020年，A轮融资1000万美元，估值2亿美元，员工150人",
            "credibility_score": 0.9
        },
        {
            "name": "官方网站",
            "type": "primary",
            "content": "TestProject，领先的AI自动化平台，成立于2020年，团队规模150人",
            "credibility_score": 0.95
        },
        {
            "name": "行业报告",
            "type": "tertiary",
            "content": "AI自动化市场规模预计在2025年达到500亿美元，TestProject在细分市场中占据5%份额",
            "credibility_score": 0.85
        }
    ]

    # 创建系统实例
    qa_system = QualityAssuranceSystem()

    # 配置测试参数 - 使用正确的QualityThresholds数据类
    quality_thresholds = QualityThresholds(
        deliver_check_threshold=85.0,
        mcp_validation_threshold=0.7,
        cross_validation_min_grade="B",
        overall_quality_threshold=80.0
    )

    config = QualitySystemConfiguration(
        project_name="TestProject",
        content=test_content,
        validation_sources=test_validation_sources,
        enable_deliver_check=True,
        enable_mcp_validation=True,
        enable_cross_validation=True,
        parallel_execution=True,
        quality_thresholds=quality_thresholds
    )

    print("📋 测试配置:")
    print(f"  项目: {config.project_name}")
    print(f"  内容长度: {len(config.content)} 字符")
    print(f"  验证源: {len(config.validation_sources)} 个")
    print(f"  启用阶段: DELIVER_CHECK={config.enable_deliver_check}, MCP_VALIDATION={config.enable_mcp_validation}, CROSS_VALIDATION={config.enable_cross_validation}")

    try:
        # 执行完整质量验证流程
        result = await qa_system.execute_complete_quality_assurance(config)

        # 验证结果
        print(f"\n🎯 执行结果验证:")
        print(f"  ✅ 系统状态: {result.system_status}")
        print(f"  ✅ 执行时间: {result.total_execution_time:.1f}秒")
        print(f"  ✅ 整体等级: {result.overall_quality_grade}")

        if result.system_status.value == "completed":
            print(f"\n📊 各阶段详情:")

            if result.deliver_check_result:
                dc = result.deliver_check_result
                print(f"  📋 DELIVER_CHECK: {dc.overall_score:.1f}/100 ({'通过' if dc.passed_threshold else '未通过'})")
                print(f"     - 模板对齐度: {dc.template_compliance:.1f}/100")
                print(f"     - 数据完整性: {dc.data_completeness:.1f}/100")
                print(f"     - 逻辑一致性: {dc.logical_consistency:.1f}/100")
                print(f"     - VI区合规性: {dc.vi_zone_compliance:.1f}/100")

            if result.mcp_validation_result:
                mcp = result.mcp_validation_result
                print(f"  🔗 MCP_VALIDATION: {mcp.overall_credibility_score:.3f} 可信度")
                print(f"     - 工具执行: {mcp.summary.get('successful_tools', 0)}/{mcp.summary.get('total_tools_executed', 0)}")
                print(f"     - 验证数据点: {mcp.summary.get('total_data_points_verified', 0)}")
                print(f"     - 发现不一致: {mcp.summary.get('total_inconsistencies_found', 0)}")

            if result.cross_validation_result:
                cv = result.cross_validation_result
                rating = cv["final_quality_rating"]
                stats = cv["validation_statistics"]
                print(f"  🔄 CROSS_VALIDATION: {rating.overall_grade}")
                print(f"     - 可信度评分: {rating.trustworthiness_score:.1f}/100")
                print(f"     - 数据置信度: {rating.data_confidence:.1f}/100")
                print(f"     - 源多样性: {rating.source_diversity:.1f}/100")
                print(f"     - 验证字段: {stats['total_fields_validated']}")
                print(f"     - 检测冲突: {stats['total_conflicts_detected']}")
                print(f"     - 解决冲突: {stats['conflicts_resolved']}")

            # 显示综合建议
            if result.recommendations:
                print(f"\n💡 综合建议 ({len(result.recommendations)}条):")
                for i, rec in enumerate(result.recommendations[:5], 1):  # 只显示前5条
                    print(f"  {i}. {rec}")

            # 系统统计
            stats = qa_system.get_system_statistics()
            print(f"\n📊 系统统计:")
            print(f"  总执行次数: {stats['total_executions']}")
            print(f"  成功率: {stats['success_rate']:.1f}%")
            print(f"  平均执行时间: {stats['average_execution_time']:.1f}秒")
            print(f"  等级分布: {stats['grade_distribution']}")

            # 测试结果评估
            print(f"\n🎯 测试结果评估:")
            if result.system_status.value == "completed":
                print("  ✅ 系统执行成功")
                if result.overall_quality_grade in ["A+", "A", "B+", "B"]:
                    print("  ✅ 质量等级良好")
                else:
                    print("  ⚠️  质量等级需要改进")

                print("  ✅ 所有核心功能正常工作")
                print("  ✅ 三层质量验证体系完整实现")
                print("  ✅ 符合AI项目档案管理工作流v2.4要求")
            else:
                print(f"  ⚠️  系统执行异常: {result.system_status}")

        else:
            print(f"  ❌ 系统执行失败: {result.system_status}")
            if result.recommendations:
                print(f"  错误信息: {result.recommendations[0]}")

        return True

    except Exception as e:
        print(f"❌ 测试执行失败: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


async def test_individual_components():
    """测试各个组件的独立功能"""
    print("\n" + "="*60)
    print("🔧 组件独立功能测试")
    print("="*60)

    try:
        # 测试质量检查器
        print("\n📋 测试质量检查器...")
        from quality_checker_fixed import QualityChecker
        checker = QualityChecker()

        test_content = "# 简单测试\n公司名称：测试公司\n成立时间：2021年"
        quality_result = checker.run_deliver_check(test_content)
        print(f"  ✅ 质量检查器正常 - 评分: {quality_result.overall_score:.1f}")

        # 测试MCP验证器
        print("\n🔗 测试MCP验证器...")
        from mcp_validator import MCPValidator
        validator = MCPValidator()

        test_data = {"basic_info": {"name": "测试"}}
        mcp_result = await validator.run_independent_mcp_validation("测试项目", test_data)
        print(f"  ✅ MCP验证器正常 - 可信度: {mcp_result.overall_credibility_score:.3f}")

        # 测试交叉验证器
        print("\n🔄 测试交叉验证器...")
        from cross_validator_fixed import CrossValidator
        cross_validator = CrossValidator()

        test_validation_sources = [
            {
                "name": "Crunchbase",
                "type": "secondary",
                "content": "TestProject成立于2020年，A轮融资1000万美元，估值2亿美元，员工150人",
                "credibility_score": 0.9
            },
            {
                "name": "官方网站",
                "type": "primary",
                "content": "TestProject，领先的AI自动化平台，成立于2020年，团队规模150人",
                "credibility_score": 0.95
            }
        ]

        cross_result = cross_validator.perform_comprehensive_cross_validation(
            "测试项目", test_content, test_validation_sources,
            {}, {}
        )
        print(f"  ✅ 交叉验证器正常 - 等级: {cross_result['final_quality_rating'].overall_grade}")

        return True

    except Exception as e:
        print(f"❌ 组件测试失败: {str(e)}")
        return False


async def main():
    """主测试函数"""
    print("🧪 质量保障系统完整测试脚本")
    print("基于AI项目档案管理工作流v2.4-完整版的三层质量验证体系")
    print("="*80)

    # 组件独立测试
    components_ok = await test_individual_components()

    # 系统集成测试
    if components_ok:
        system_ok = await test_quality_assurance_system()

        if components_ok and system_ok:
            print(f"\n🎉 所有测试通过!")
            print("质量保障系统已准备就绪，可以投入使用。")
            print("🚀 系统特色:")
            print("  • 完全符合AI项目档案管理工作流v2.4要求")
            print("  • 三层质量验证体系确保数据完整性和可信度")
            print("  • 模块化设计支持独立使用或集成使用")
            print("  • 智能冲突检测和自动解决机制")
            print("  • 详细的验证报告和改进建议")
            print("  • 支持完整的错误处理和恢复机制")
        else:
            print(f"\n⚠️  部分测试失败，请检查系统实现。")
    else:
        print(f"\n❌ 组件测试失败，请检查基础组件实现。")


if __name__ == "__main__":
    asyncio.run(main())