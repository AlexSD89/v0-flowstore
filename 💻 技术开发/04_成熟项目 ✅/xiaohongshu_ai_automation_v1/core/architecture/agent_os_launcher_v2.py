#!/usr/bin/env python3
"""
Agent OS v2.0 Launcher - 智能商业战略平台
基于四层BMAD混合智能架构的全新系统启动器

从内容生成器转型为智能客户需求分析与策略制定平台
"""

from __future__ import annotations

import asyncio
import json
import logging
import argparse
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional, List

from .layer1_core_interaction import CoreInteractionLayer
from .layer2_learning_evolution import LearningEvolutionLayer
from .layer3_collaboration_decision import CollaborationDecisionLayer
from .layer4_data_persistence import DataPersistenceLayer
from ..mcp_integration.mcp_orchestrator import MCPOrchestrator
from ..config.agent_os_config import AgentOSConfig

class AgentOSLauncherV2:
    """Agent OS v2.0 主启动器"""

    def __init__(self, config_path: Optional[Path] = None):
        self.config = AgentOSConfig.load_config(config_path)
        self.logger = self._setup_logging()

        # 初始化MCP集成器
        self.mcp_orchestrator = MCPOrchestrator(self.config.mcp_config)

        # 初始化四层架构
        self.layer1 = CoreInteractionLayer(
            mcp_integrator=self.mcp_orchestrator,
            context_manager=ContextManager(self.config.context_config),
            quality_controller=QualityController(self.config.quality_config)
        )

        self.layer2 = LearningEvolutionLayer(
            mcp_integrator=self.mcp_orchestrator,
            knowledge_base=KnowledgeBase(self.config.knowledge_config)
        )

        self.layer3 = CollaborationDecisionLayer()
        self.layer4 = DataPersistenceLayer(self.config.persistence_config)

        self.session_manager = SessionManager()
        self.request_router = RequestRouter()

    async def start_intelligent_service(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """启动智能服务 - 从内容生成器转型为智能战略平台"""

        session_id = self.session_manager.create_session(request)

        try:
            self.logger.info(f"启动智能服务会话: {session_id}")

            # Layer 1: 核心交互逻辑 - 客户需求智能分析
            self.logger.info("Layer 1: 执行客户需求智能分析...")
            layer1_result = await self.layer1.process_customer_request(
                request.get('customer_input', '')
            )

            # Layer 2: 学习进化逻辑 - 基于历史数据优化
            self.logger.info("Layer 2: 执行学习进化分析...")
            layer2_result = await self.layer2.learn_from_interaction({
                'session_id': session_id,
                'customer_request': request,
                'layer1_analysis': layer1_result,
                'historical_data': await self._get_historical_data(request)
            })

            # Layer 3: 协作决策逻辑 - 人机协作质量控制
            self.logger.info("Layer 3: 执行协作决策...")
            layer3_result = await self.layer3.make_collaborative_decision(
                context={
                    'customer_request': request,
                    'layer1_analysis': layer1_result,
                    'layer2_learning': layer2_result
                },
                task_complexity=layer1_result.get('routing_decision', {}).get('complexity_score', 3.0)
            )

            # Layer 4: 数据持久化 - 知识沉淀和状态管理
            self.logger.info("Layer 4: 执行数据持久化...")
            await self._persist_service_data(session_id, {
                'layer1': layer1_result,
                'layer2': layer2_result,
                'layer3': layer3_result
            })

            # 整合结果并生成商业策略
            final_result = await self._generate_business_strategy(
                layer1_result, layer2_result, layer3_result
            )

            self.logger.info(f"智能服务完成: {session_id}")

            return {
                'session_id': session_id,
                'business_strategy': final_result,
                'layer_results': {
                    'requirement_analysis': layer1_result,
                    'learning_insights': layer2_result,
                    'collaboration_decision': layer3_result
                },
                'service_metadata': {
                    'timestamp': datetime.now().isoformat(),
                    'service_version': 'v2.0.0',
                    'processing_time': self._calculate_processing_time(session_id)
                }
            }

        except Exception as e:
            self.logger.error(f"智能服务执行失败: {e}")
            await self._handle_service_error(session_id, e)
            raise

    async def _generate_business_strategy(self, layer1_result: Dict,
                                        layer2_result: Dict,
                                        layer3_result: Dict) -> Dict[str, Any]:
        """生成商业策略 - 从内容生成转向战略制定"""

        # 客户需求分析结果
        customer_analysis = layer1_result.get('requirement_analysis', {})

        # 学习洞察
        learning_insights = layer2_result.get('strategy_improvements', {})

        # 协作决策结果
        collaboration_decision = layer3_result.get('decision_result', {})

        # 整合生成商业策略
        business_strategy = {
            'customer_understanding': {
                'business_goals': customer_analysis.get('business_goals', []),
                'target_audience': customer_analysis.get('target_audience', {}),
                'competitive_positioning': customer_analysis.get('competitive_landscape', {}),
                'success_metrics': customer_analysis.get('success_criteria', [])
            },

            'strategic_recommendations': {
                'market_opportunities': await self._identify_market_opportunities(
                    customer_analysis, learning_insights
                ),
                'content_strategy': await self._develop_content_strategy(
                    customer_analysis, collaboration_decision
                ),
                'engagement_strategy': await self._design_engagement_strategy(
                    customer_analysis, learning_insights
                ),
                'performance_tracking': await self._setup_performance_tracking(
                    customer_analysis.get('business_goals', [])
                )
            },

            'execution_plan': {
                'timeline': collaboration_decision.get('execution_plan', {}).get('timeline', {}),
                'resource_allocation': collaboration_decision.get('resource_optimized', {}),
                'risk_mitigation': collaboration_decision.get('risk_assessment', {}),
                'quality_gates': collaboration_decision.get('quality_assessment', {})
            },

            'expected_outcomes': {
                'roi_projection': await self._calculate_roi_projection(
                    customer_analysis, collaboration_decision
                ),
                'success_probability': collaboration_decision.get('quality_assessment', {}).get('overall_quality_score', 0.0),
                'key_performance_indicators': customer_analysis.get('business_goals', [])
            }
        }

        return business_strategy

    async def _identify_market_opportunities(self, customer_analysis: Dict,
                                          learning_insights: Dict) -> List[Dict[str, Any]]:
        """识别市场机会"""

        opportunities = []

        # 基于客户分析识别机会
        customer_opportunities = await self.mcp_orchestrator.execute_task(
            'market_analysis',
            {
                'industry': customer_analysis.get('industry'),
                'target_audience': customer_analysis.get('target_audience'),
                'business_goals': customer_analysis.get('business_goals')
            }
        )

        # 基于学习洞察优化机会
        if customer_opportunities:
            for opp in customer_opportunities.get('opportunities', []):
                # 应用学习洞察
                optimized_opp = await self._apply_learning_insights(opp, learning_insights)
                opportunities.append(optimized_opp)

        return opportunities

    async def _develop_content_strategy(self, customer_analysis: Dict,
                                      collaboration_decision: Dict) -> Dict[str, Any]:
        """制定内容策略"""

        # 基于客户需求制定内容方向
        content_direction = {
            'brand_positioning': customer_analysis.get('brand_identity', {}),
            'content_pillars': self._identify_content_pillars(customer_analysis),
            'target_audience_insights': customer_analysis.get('target_audience', {}),
            'competitive_differentiation': customer_analysis.get('competitive_landscape', {})
        }

        # 整合协作决策优化
        optimized_strategy = {
            **content_direction,
            'strategic_approvals': collaboration_decision.get('synthesized_result', {}),
            'quality_standards': collaboration_decision.get('quality_assessment', {}),
            'resource_constraints': collaboration_decision.get('resource_optimized', {})
        }

        return optimized_strategy

    async def _setup_performance_tracking(self, business_goals: List[str]) -> Dict[str, Any]:
        """设置性能跟踪"""

        tracking_config = {
            'primary_metrics': self._extract_primary_metrics(business_goals),
            'secondary_metrics': self._extract_secondary_metrics(business_goals),
            'monitoring_frequency': 'daily',
            'reporting_schedule': 'weekly',
            'alert_thresholds': self._set_alert_thresholds(business_goals),
            'optimimization_triggers': self._define_optimization_triggers()
        }

        return tracking_config

# 兼容现有系统的包装器
class LegacySystemAdapter:
    """现有系统兼容适配器"""

    def __init__(self, agent_os_v2: AgentOSLauncherV2):
        self.agent_os_v2 = agent_os_v2
        self.logger = logging.getLogger(__name__)

    async def adapt_one_command_automation(self, client_slug: str, mode: str,
                                         schedule: Optional[str] = None) -> Dict[str, Any]:
        """适配现有的一键自动化系统"""

        self.logger.info(f"适配现有自动化请求: client={client_slug}, mode={mode}")

        # 将现有流水线模式转换为智能服务请求
        if mode == "plan":
            # 情报+模板 -> 客户需求分析 + 策略制定
            request = {
                'customer_input': f"为客户 {client_slug} 制定内容策略规划",
                'request_type': 'strategic_planning',
                'client_slug': client_slug,
                'schedule': schedule
            }

        elif mode == "publish":
            # 执行阶段 -> 基于已有策略的执行
            request = {
                'customer_input': f"执行客户 {client_slug} 的内容发布策略",
                'request_type': 'strategy_execution',
                'client_slug': client_slug,
                'schedule': schedule
            }

        elif mode == "full":
            # 全流程 -> 完整智能服务
            request = {
                'customer_input': f"为客户提供 {client_slug} 的完整智能服务",
                'request_type': 'comprehensive_service',
                'client_slug': client_slug,
                'schedule': schedule
            }

        else:
            raise ValueError(f"Unsupported mode: {mode}")

        # 执行新的智能服务
        result = await self.agent_os_v2.start_intelligent_service(request)

        # 转换结果格式以兼容现有系统
        legacy_compatible_result = self._convert_to_legacy_format(result, mode)

        return legacy_compatible_result

    def _convert_to_legacy_format(self, result: Dict[str, Any], mode: str) -> Dict[str, Any]:
        """将新系统结果转换为现有系统兼容格式"""

        if mode == "plan":
            return {
                'stages': [
                    {
                        'stage': 'requirement_analysis',
                        'status': 'completed',
                        'output': result['business_strategy']['customer_understanding']
                    },
                    {
                        'stage': 'strategy_formulation',
                        'status': 'completed',
                        'output': result['business_strategy']['strategic_recommendations']
                    }
                ],
                'session_id': result['session_id'],
                'log_path': f"logs/agent_os_v2_{result['session_id']}.log"
            }

        elif mode == "publish":
            return {
                'stages': [
                    {
                        'stage': 'strategy_execution',
                        'status': 'completed',
                        'output': result['business_strategy']['execution_plan']
                    }
                ],
                'session_id': result['session_id'],
                'log_path': f"logs/agent_os_v2_{result['session_id']}.log"
            }

        elif mode == "full":
            return {
                'stages': [
                    {
                        'stage': 'customer_analysis',
                        'status': 'completed',
                        'output': result['layer_results']['requirement_analysis']
                    },
                    {
                        'stage': 'learning_optimization',
                        'status': 'completed',
                        'output': result['layer_results']['learning_insights']
                    },
                    {
                        'stage': 'collaborative_decision',
                        'status': 'completed',
                        'output': result['layer_results']['collaboration_decision']
                    },
                    {
                        'stage': 'business_strategy',
                        'status': 'completed',
                        'output': result['business_strategy']
                    }
                ],
                'session_id': result['session_id'],
                'log_path': f"logs/agent_os_v2_{result['session_id']}.log"
            }

# 命令行接口
async def main():
    parser = argparse.ArgumentParser(description="Agent OS v2.0 - 智能商业战略平台")
    parser.add_argument("--config", type=Path, help="配置文件路径")
    parser.add_argument("--client", required=True, help="客户标识")
    parser.add_argument("--mode", choices=["plan", "publish", "full", "intelligent"],
                       default="intelligent", help="运行模式")
    parser.add_argument("--schedule", help="调度标签")
    parser.add_argument("--dry-run", action="store_true", help="模拟运行")

    args = parser.parse_args()

    # 初始化系统
    launcher = AgentOSLauncherV2(args.config)
    adapter = LegacySystemAdapter(launcher)

    try:
        if args.mode == "intelligent":
            # 新的智能服务模式
            request = {
                'customer_input': f"启动客户 {args.client} 的智能商业战略服务",
                'request_type': 'comprehensive_service',
                'client_slug': args.client,
                'schedule': args.schedule
            }

            if args.dry_run:
                print(f"[DRY-RUN] 将启动智能服务: {request}")
                return

            result = await launcher.start_intelligent_service(request)
            print(f"智能服务完成: {result['session_id']}")
            print(f"商业策略已生成，包含 {len(result['business_strategy']['strategic_recommendations']['market_opportunities'])} 个市场机会")

        else:
            # 兼容现有系统的模式
            result = await adapter.adapt_one_command_automation(
                args.client, args.mode, args.schedule
            )
            print(f"适配服务完成: {result['session_id']}")
            print(f"执行阶段: {len(result['stages'])} 个")

    except Exception as e:
        logging.error(f"服务执行失败: {e}")
        raise

if __name__ == "__main__":
    asyncio.run(main())