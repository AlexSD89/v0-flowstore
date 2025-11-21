#!/usr/bin/env python3
"""
V1V3组件集成演示
展示Gate OS调度Agent如何在CC原生基础之上协调V1和V3组件工作
"""

import asyncio
import json
from dataclasses import asdict
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any

import sys

# 将项目根目录和 src 加入 sys.path，便于作为脚本直接运行
CURRENT_FILE = Path(__file__).resolve()
PROJECT_ROOT = CURRENT_FILE.parents[1]
SRC_DIR = PROJECT_ROOT / "src"

# 仅将 src 目录加入 sys.path，避免触发 src.__init__ 的重型导入
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

# 导入V1组件（通过 src/ 下的轻量级 tools / agents 包）
from tools.data_collector_v1 import FourDimensionalDataCollector
from agents.forum_collaboration_v1 import (
    ForumCollaborationSchedulingAgent,
    ForumCollaborationTask,
    AgentRole,
)

# 导入V3组件
from tools.evidence_ledger_v3 import EvidenceLedgerTool, EvidenceChain, EvidenceRecord
from agents.autonomy_management_v3 import (
    AutonomyLevelManagementAgent,
    DecisionRequest,
    LOALevel,
)


class GateOSV1V3IntegrationDemo:
    """
    Gate OS V1V3集成演示系统
    展示如何在CC原生基础之上，通过Gate OS调度层协调V1和V3组件
    """

    def __init__(self):
        # V1组件 (小红书运营实践智慧)
        self.v1_data_collector = FourDimensionalDataCollector()
        self.v1_forum_agent = ForumCollaborationSchedulingAgent()

        # V3组件 (证据驱动决策哲学)
        self.v3_evidence_ledger = EvidenceLedgerTool()
        self.v3_loa_manager = AutonomyLevelManagementAgent()

        # 系统状态
        self.session_state = {
            'session_id': f"v1v3_demo_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            'current_phase': 'initialization',
            'evidence_records': [],
            'decisions_made': [],
            'data_collected': {},
            'agent_insights': {}
        }

    async def demonstrate_content_creation_workflow(self, user_request: str) -> Dict[str, Any]:
        """
        演示完整的内容创作工作流程
        融合V1四维数据收集 + V3证据驱动决策 + 论坛协作 + LOA管理
        """
        print(f"🚀 开始Gate OS V1V3集成演示")
        print(f"📝 用户请求: {user_request}")
        print(f"🔧 会话ID: {self.session_state['session_id']}")

        try:
            # Phase 1: V1四维数据收集
            print("\n📊 === Phase 1: V1四维数据收集 ===")
            data_collection_result = await self.execute_v1_data_collection(user_request)

            # Phase 2: V3证据收集和评估
            print("\n🔍 === Phase 2: V3证据收集和评估 ===")
            evidence_assessment_result = await self.execute_v3_evidence_assessment(
                user_request, data_collection_result
            )

            # Phase 3: V1论坛协作决策
            print("\n💬 === Phase 3: V1多Agent论坛协作 ===")
            forum_collaboration_result = await self.execute_v1_forum_collaboration(
                user_request, evidence_assessment_result
            )

            # Phase 4: V3自主等级决策和执行
            print("\n🎯 === Phase 4: V3自主等级管理和执行 ===")
            loa_execution_result = await self.execute_v3_loa_execution(
                user_request, forum_collaboration_result
            )

            # Phase 5: 结果汇总和反馈
            print("\n✅ === Phase 5: 结果汇总 ===")
            final_result = await self.aggregate_results(
                data_collection_result,
                evidence_assessment_result,
                forum_collaboration_result,
                loa_execution_result
            )

            return final_result

        except Exception as e:
            print(f"❌ 演示执行失败: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'session_state': self.session_state
            }

    async def execute_v1_data_collection(self, user_request: str) -> Dict[str, Any]:
        """执行V1四维数据收集"""
        print("🔄 收集AI工具市场数据...")
        ai_tools_data = await self.v1_data_collector.collect_dimension_data(
            'ai_tools_market', user_request
        )

        print("🔄 分析用户行为数据...")
        user_behavior_data = await self.v1_data_collector.collect_dimension_data(
            'user_behavior', user_request
        )

        print("🔄 监控竞争对手动态...")
        competitor_data = await self.v1_data_collector.collect_dimension_data(
            'competitor_monitoring', user_request
        )

        print("🔄 分析行业趋势...")
        industry_trends_data = await self.v1_data_collector.collect_dimension_data(
            'industry_trends', user_request
        )

        # 整合四维数据
        integrated_data = {
            'ai_tools_insights': ai_tools_data,
            'user_behavior_patterns': user_behavior_data,
            'competitor_intelligence': competitor_data,
            'industry_trend_analysis': industry_trends_data,
            'data_collection_timestamp': datetime.now().isoformat(),
            'v1_methodology_applied': 'four_dimensional_data_collection'
        }

        self.session_state['data_collected'] = integrated_data
        print(f"✅ V1数据收集完成，共整合4个维度数据")

        return integrated_data

    async def execute_v3_evidence_assessment(self, user_request: str, data_result: Dict) -> Dict[str, Any]:
        """执行V3证据收集和评估"""
        print("🔍 收集初始证据...")

        # 创建证据记录
        evidence_records: List[EvidenceRecord] = []

        # 为当前用户请求生成一个声明ID，后续查询同一证据链
        claim_id = f"claim_{datetime.now().timestamp()}"

        # 证据1: 数据收集结果 (二级证据 - 对照实验)
        data_evidence = await self.v3_evidence_ledger.record_evidence({
            'content': data_result,
            'source': 'v1_four_dimensional_collection',
            'collection_method': 'observational',
            'context': {'user_request': user_request},
            'metadata': {'type': 'four_dimensional_data'},
            'claim_ids': [claim_id],
        })
        evidence_records.append(data_evidence)

        # 证据2: 历史成功案例 (四级证据 - 面板数据)
        historical_evidence = await self.v3_evidence_ledger.record_evidence({
            'content': {
                'similar_cases': 5,
                'success_rate': 0.85,
                'roi_average': 2.3
            },
            'source': 'historical_analysis',
            'collection_method': 'panel_data',
            'context': {'scenario': 'similar_campaigns'},
            'metadata': {'type': 'historical_panel'},
            'claim_ids': [claim_id],
        })
        evidence_records.append(historical_evidence)

        # 获取证据链并做链级分析
        print("⚡ 执行证据链分析...")
        evidence_chain: EvidenceChain = await self.v3_evidence_ledger.get_evidence_chain(claim_id)

        # 简化版决策置信度：取证据平均置信度
        if evidence_records:
            confidence_score = sum(r.confidence_score for r in evidence_records) / len(evidence_records)
        else:
            confidence_score = 0.0

        assessment_result = {
            'evidence_records': [asdict(record) for record in evidence_records],
            'triangulation_validation': {
                'overall_strength': evidence_chain.overall_strength,
                'chain_analysis': evidence_chain.chain_analysis,
                'evidence_gaps': evidence_chain.evidence_gaps,
            },
            'confidence_score': confidence_score,
            'evidence_based_recommendation': self.generate_evidence_recommendation(confidence_score),
            'v3_methodology_applied': 'evidence_driven_decision',
            'assessment_timestamp': datetime.now().isoformat()
        }

        self.session_state['evidence_records'] = evidence_records
        print(f"✅ V3证据评估完成，置信度: {confidence_score:.2f}")

        return assessment_result

    async def execute_v1_forum_collaboration(self, user_request: str, evidence_result: Dict) -> Dict[str, Any]:
        """执行V1多Agent论坛协作"""
        print("👥 启动多Agent论坛协作...")

        # 创建协作任务（使用V1定义的任务数据结构）
        task = ForumCollaborationTask(
            task_id=f"forum_task_{datetime.now().timestamp()}",
            title="Gate OS V1论坛协作 - 内容创作决策",
            description=user_request,
            context={
                'user_request': user_request,
                'evidence_assessment': evidence_result,
                'collaboration_mode': 'professional_insight_integration'
            },
            constraints=['brand_safety', 'platform_policy'],
            objectives=[
                '生成内容策略建议',
                '评估风险与ROI',
                '形成可执行的创作计划'
            ],
            stakeholders=['运营团队', '品牌团队']
        )

        # 执行论坛协作
        forum_result = await self.v1_forum_agent.coordinate_forum_collaboration(task)

        # 提取关键洞察（按角色划分）
        agent_contribs = forum_result.agent_contributions
        key_insights = {
            'market_analyst_insight': asdict(agent_contribs.get(AgentRole.MARKET_ANALYST)) if AgentRole.MARKET_ANALYST in agent_contribs else {},
            'content_strategist_insight': asdict(agent_contribs.get(AgentRole.CONTENT_STRATEGIST)) if AgentRole.CONTENT_STRATEGIST in agent_contribs else {},
            'data_scientist_insight': asdict(agent_contribs.get(AgentRole.DATA_SCIENTIST)) if AgentRole.DATA_SCIENTIST in agent_contribs else {},
            'creative_director_insight': asdict(agent_contribs.get(AgentRole.CREATIVE_DIRECTOR)) if AgentRole.CREATIVE_DIRECTOR in agent_contribs else {},
            'community_manager_insight': asdict(agent_contribs.get(AgentRole.COMMUNITY_MANAGER)) if AgentRole.COMMUNITY_MANAGER in agent_contribs else {},
            'tech_expert_insight': asdict(agent_contribs.get(AgentRole.TECH_EXPERT)) if AgentRole.TECH_EXPERT in agent_contribs else {},
            'business_analyst_insight': asdict(agent_contribs.get(AgentRole.BUSINESS_ANALYST)) if AgentRole.BUSINESS_ANALYST in agent_contribs else {}
        }

        consensus_level = forum_result.consensus_result.consensus_level if forum_result.consensus_result else 0.0

        collaboration_result = {
            'task_id': task.task_id,
            'forum_insights': key_insights,
            'consensus_score': consensus_level,
            'ai_host_coordination': {
                'coordination_rounds': forum_result.coordination_result.coordination_rounds,
                'final_consensus_level': forum_result.coordination_result.final_consensus_level,
            },
            'quality_assessment': asdict(forum_result.quality_assessment),
            'v1_methodology_applied': 'multi_agent_forum_collaboration',
            'collaboration_timestamp': datetime.now().isoformat()
        }

        self.session_state['agent_insights'] = key_insights
        print(f"✅ V1论坛协作完成，共识评分: {consensus_level:.2f}")

        return collaboration_result

    async def execute_v3_loa_execution(self, user_request: str, forum_result: Dict) -> Dict[str, Any]:
        """执行V3自主等级管理和执行"""
        print("🎯 评估决策自主等级...")

        # 构建决策请求（V3 LOA系统使用的统一结构）
        decision_request = DecisionRequest(
            id=f"loa_exec_{datetime.now().timestamp()}",
            title="小红书内容创作执行决策",
            description=user_request,
            context={
                'forum_consensus': forum_result.get('consensus_score', 0),
                'complexity_level': 'medium',
                'risk_tolerance': 'moderate',
                'safety_constraints': ['content_quality', 'brand_safety', 'legal_compliance']
            },
            priority='medium',
            stakeholders=['运营团队', '品牌团队']
        )

        # 确定自主等级
        loa = await self.v3_loa_manager.determine_autonomy_level(decision_request)

        # 执行决策
        execution_result = await self.v3_loa_manager.execute_with_loa(
            decision_request=decision_request,
            loa=loa
        )

        # 将AutonomyLevel压缩为适合下游使用的结构
        loa_determination = {
            'recommended_loa': {
                'level': {
                    LOALevel.LOA0_SUGGESTION: 0,
                    LOALevel.LOA1_ALTERNATIVES: 1,
                    LOALevel.LOA2_LOW_RISK_AUTO: 2,
                    LOALevel.LOA3_GUARDED_AUTO: 3,
                    LOALevel.LOA4_HUMAN_EXCLUSIVE: 4,
                }.get(loa.level, 0),
                'level_name': loa.level.value,
                'score': loa.score,
                'reasoning': loa.reasoning,
                'constraints': loa.constraints,
                'monitoring_requirements': loa.monitoring_requirements,
                'rollback_strategy': loa.rollback_strategy,
            }
        }

        loa_result = {
            'decision_request': asdict(decision_request),
            'loa_determination': loa_determination,
            'execution_result': asdict(execution_result),
            'safety_mechanisms': execution_result.monitoring_data or {},
            'rollback_plan': execution_result.rollback_point or {},
            'v3_methodology_applied': 'autonomy_level_management',
            'execution_timestamp': datetime.now().isoformat()
        }

        print(f"✅ V3 LOA执行完成，自主等级: {loa.level.value}")

        return loa_result

    async def aggregate_results(self, data_result: Dict, evidence_result: Dict,
                              forum_result: Dict, loa_result: Dict) -> Dict[str, Any]:
        """汇总所有结果"""
        final_result = {
            'session_summary': {
                'session_id': self.session_state['session_id'],
                'execution_completed_at': datetime.now().isoformat(),
                'total_phases': 5,
                'success_status': 'completed'
            },
            'v1_contributions': {
                'four_dimensional_data': data_result,
                'forum_collaboration_insights': forum_result
            },
            'v3_contributions': {
                'evidence_driven_assessment': evidence_result,
                'autonomy_level_execution': loa_result
            },
            'integrated_recommendations': self.generate_integrated_recommendations(
                data_result, evidence_result, forum_result, loa_result
            ),
            'quality_metrics': {
                'evidence_confidence': evidence_result.get('confidence_score', 0),
                'forum_consensus': forum_result.get('consensus_score', 0),
                'execution_success': loa_result.get('execution_result', {}).get('success', False)
            },
            'next_steps': self.generate_next_steps(loa_result)
        }

        print("\n🎉 === Gate OS V1V3集成演示完成 ===")
        print(f"📊 证据置信度: {final_result['quality_metrics']['evidence_confidence']:.2f}")
        print(f"💬 论坛共识度: {final_result['quality_metrics']['forum_consensus']:.2f}")
        print(f"✅ 执行成功率: {final_result['quality_metrics']['execution_success']}")

        return final_result

    def generate_evidence_recommendation(self, confidence_score: float) -> str:
        """基于证据置信度生成推荐"""
        if confidence_score >= 0.9:
            return "强烈推荐执行 - 证据支持充分"
        elif confidence_score >= 0.7:
            return "推荐执行 - 证据支持较好"
        elif confidence_score >= 0.5:
            return "谨慎执行 - 需要额外证据"
        else:
            return "暂缓执行 - 证据支持不足"

    def generate_integrated_recommendations(self, data_result: Dict, evidence_result: Dict,
                                         forum_result: Dict, loa_result: Dict) -> List[str]:
        """生成综合推荐"""
        recommendations = []

        # 基于数据洞察的推荐
        if data_result['ai_tools_insights'].get('trending_tools'):
            recommendations.append("采用AI工具推荐的创作方法")

        # 基于证据评估的推荐
        if evidence_result['confidence_score'] > 0.8:
            recommendations.append("基于强证据支持推进内容创作")

        # 基于论坛协作的推荐
        if forum_result['consensus_score'] > 0.7:
            recommendations.append("采用多专家协作的创意方案")

        # 基于LOA执行的推荐
        if loa_result['execution_result'].get('success'):
            recommendations.append("采用建议的执行策略和安全措施")

        return recommendations

    def generate_next_steps(self, loa_result: Dict) -> List[str]:
        """生成下一步行动"""
        next_steps = [
            "1. 根据综合推荐制定详细内容创作计划",
            "2. 执行安全检查和质量验证",
            "3. 监控执行过程和收集反馈数据",
            "4. 记录执行结果用于学习优化",
            "5. 更新V1V3组件的知识库"
        ]

        # 根据LOA等级调整行动
        loa_level = loa_result.get('loa_determination', {}).get('recommended_loa', {}).get('level', 0)
        if loa_level >= 3:
            next_steps.insert(0, "0. 自动执行已批准的行动计划")
        else:
            next_steps.insert(0, "0. 等待人工确认后开始执行")

        return next_steps


async def main():
    """主演示函数"""
    print("=" * 80)
    print("🚀 Gate OS V1V3组件集成演示系统")
    print("📍 展示V1小红书运营智慧 + V3证据驱动哲学的融合应用")
    print("=" * 80)

    # 创建集成演示系统
    demo_system = GateOSV1V3IntegrationDemo()

    # 演示场景
    demo_scenario = """
    创建一个小红书美食探店内容，需要：
    1. 分析当前美食内容趋势
    2. 结合用户偏好数据
    3. 参考竞品成功案例
    4. 确保内容质量和安全性
    """

    print(f"\n🎬 演示场景: {demo_scenario.strip()}")
    print("-" * 80)

    # 执行演示
    result = await demo_system.demonstrate_content_creation_workflow(demo_scenario)

    # 输出结果
    print("\n" + "=" * 80)
    print("📊 演示结果汇总:")
    print("=" * 80)

    if result.get('success', True):
        print("✅ 集成演示执行成功!")
        print(f"\n🎯 综合推荐:")
        for i, rec in enumerate(result.get('integrated_recommendations', []), 1):
            print(f"  {i}. {rec}")

        print(f"\n📋 下一步行动:")
        for step in result.get('next_steps', []):
            print(f"  {step}")

        # 保存结果到文件
        output_file = f"v1v3_integration_demo_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2, default=str)
        print(f"\n💾 详细结果已保存到: {output_file}")

    else:
        print(f"❌ 演示执行失败: {result.get('error', '未知错误')}")

    print("\n" + "=" * 80)
    print("🏁 Gate OS V1V3集成演示结束")
    print("=" * 80)


if __name__ == "__main__":
    asyncio.run(main())
