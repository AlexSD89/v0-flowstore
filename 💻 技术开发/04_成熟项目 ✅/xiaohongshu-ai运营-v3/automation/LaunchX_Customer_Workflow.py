#!/usr/bin/env python3
"""
LaunchX V3.0 客户工作流执行器
完整的端到端客户服务工作流执行
"""

import asyncio
import json
import logging
import uuid
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field, asdict
from enum import Enum

# 导入自定义模块
from .customer_prd_analyzer import CustomerPRDAnalyzer
from .mcp_strategy_system import MCPStrategySystem
from .strategy_learning_engine import StrategyLearningEngine

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class WorkflowStage(Enum):
    """工作流阶段"""
    CUSTOMER_ANALYSIS = "customer_analysis"
    MARKET_RESEARCH = "market_research"
    STRATEGY_GENERATION = "strategy_generation"
    CONTENT_PLANNING = "content_planning"
    LEARNING_SETUP = "learning_setup"
    FINAL_REPORT = "final_report"


class WorkflowStatus(Enum):
    """工作流状态"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    PAUSED = "paused"


@dataclass
class WorkflowState:
    """工作流状态"""
    workflow_id: str
    customer_id: str
    current_stage: WorkflowStage
    status: WorkflowStatus
    progress_percentage: float
    start_time: datetime
    estimated_completion: Optional[datetime] = None
    stage_results: Dict[str, Any] = field(default_factory=dict)
    errors: List[str] = field(default_factory=list)
    logs: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        """转换为字典"""
        return {
            'workflow_id': self.workflow_id,
            'customer_id': self.customer_id,
            'current_stage': self.current_stage.value,
            'status': self.status.value,
            'progress_percentage': self.progress_percentage,
            'start_time': self.start_time.isoformat(),
            'estimated_completion': self.estimated_completion.isoformat() if self.estimated_completion else None,
            'stage_results': self.stage_results,
            'errors': self.errors,
            'logs': self.logs
        }


@dataclass
class CustomerInput:
    """客户输入数据"""
    customer_id: str
    prd_file_path: Optional[str] = None
    prd_content: Optional[str] = None
    business_context: Dict[str, Any] = field(default_factory=dict)
    additional_requirements: List[str] = field(default_factory=list)


@dataclass
class WorkflowOutput:
    """工作流输出"""
    workflow_id: str
    customer_id: str
    execution_summary: Dict[str, Any]
    customer_analysis: Optional[Dict[str, Any]] = None
    strategy: Optional[Dict[str, Any]] = None
    content_plan: Optional[Dict[str, Any]] = None
    learning_plan: Optional[Dict[str, Any]] = None
    final_report: Optional[Dict[str, Any]] = None
    performance_projections: Dict[str, float] = field(default_factory=dict)
    recommendations: List[str] = field(default_factory=list)
    next_steps: List[str] = field(default_factory=list)


class LaunchXCustomerWorkflow:
    """LaunchX客户工作流执行器"""

    def __init__(self):
        self.prd_analyzer = CustomerPRDAnalyzer()
        self.strategy_system = MCPStrategySystem()
        self.learning_engine = StrategyLearningEngine()

        # 工作流配置
        self.workflow_config = {
            'max_execution_time': 3600,  # 最大执行时间（秒）
            'retry_attempts': 3,          # 重试次数
            'enable_learning': True,       # 启用学习功能
            'generate_reports': True       # 生成报告
        }

    async def execute_complete_workflow(self, customer_input: CustomerInput) -> WorkflowOutput:
        """执行完整工作流"""
        try:
            logger.info(f"开始执行客户工作流，客户ID: {customer_input.customer_id}")

            # 初始化工作流状态
            workflow_state = self._initialize_workflow(customer_input)

            # 执行工作流各阶段
            workflow_output = await self._execute_workflow_stages(workflow_state, customer_input)

            logger.info(f"工作流执行完成，工作流ID: {workflow_state.workflow_id}")
            return workflow_output

        except Exception as e:
            logger.error(f"工作流执行失败: {str(e)}")
            raise

    def _initialize_workflow(self, customer_input: CustomerInput) -> WorkflowState:
        """初始化工作流状态"""
        workflow_id = f"workflow_{uuid.uuid4().hex[:12]}_{int(datetime.now().timestamp())}"

        return WorkflowState(
            workflow_id=workflow_id,
            customer_id=customer_input.customer_id,
            current_stage=WorkflowStage.CUSTOMER_ANALYSIS,
            status=WorkflowStatus.IN_PROGRESS,
            progress_percentage=0.0,
            start_time=datetime.now(),
            estimated_completion=datetime.now() + timedelta(hours=2)
        )

    async def _execute_workflow_stages(self, workflow_state: WorkflowState, customer_input: CustomerInput) -> WorkflowOutput:
        """执行工作流各阶段"""

        # 阶段1: 客户分析
        customer_analysis = await self._execute_customer_analysis(workflow_state, customer_input)
        workflow_state.stage_results['customer_analysis'] = customer_analysis

        # 阶段2: 市场研究
        market_research = await self._execute_market_research(workflow_state, customer_analysis)
        workflow_state.stage_results['market_research'] = market_research

        # 阶段3: 策略生成
        strategy = await self._execute_strategy_generation(workflow_state, customer_analysis, market_research)
        workflow_state.stage_results['strategy'] = strategy

        # 阶段4: 内容规划
        content_plan = await self._execute_content_planning(workflow_state, strategy)
        workflow_state.stage_results['content_plan'] = content_plan

        # 阶段5: 学习设置
        if self.workflow_config['enable_learning']:
            learning_plan = await self._execute_learning_setup(workflow_state, customer_analysis, strategy)
            workflow_state.stage_results['learning_plan'] = learning_plan

        # 阶段6: 最终报告
        final_report = await self._execute_final_report(workflow_state, workflow_state.stage_results)

        # 构建输出
        workflow_output = WorkflowOutput(
            workflow_id=workflow_state.workflow_id,
            customer_id=workflow_state.customer_id,
            execution_summary=self._create_execution_summary(workflow_state),
            customer_analysis=customer_analysis,
            strategy=strategy,
            content_plan=content_plan,
            learning_plan=workflow_state.stage_results.get('learning_plan'),
            final_report=final_report,
            performance_projections=self._generate_performance_projections(strategy),
            recommendations=self._generate_recommendations(workflow_state.stage_results),
            next_steps=self._generate_next_steps(workflow_state.stage_results)
        )

        # 更新最终状态
        workflow_state.status = WorkflowStatus.COMPLETED
        workflow_state.progress_percentage = 100.0

        return workflow_output

    async def _execute_customer_analysis(self, workflow_state: WorkflowState, customer_input: CustomerInput) -> Dict[str, Any]:
        """执行客户分析阶段"""
        try:
            logger.info(f"执行客户分析，工作流ID: {workflow_state.workflow_id}")

            self._update_stage_progress(workflow_state, 10)

            # 分析客户PRD
            if customer_input.prd_file_path:
                customer_analysis = await self.prd_analyzer.analyze_prd_file(customer_input.prd_file_path)
            elif customer_input.prd_content:
                # 直接分析内容
                customer_analysis = self._analyze_prd_content(customer_input.prd_content)
            else:
                raise ValueError("必须提供PRD文件路径或内容")

            self._update_stage_progress(workflow_state, 20)
            logger.info("客户分析完成")

            return customer_analysis

        except Exception as e:
            error_msg = f"客户分析失败: {str(e)}"
            logger.error(error_msg)
            workflow_state.errors.append(error_msg)
            raise

    async def _execute_market_research(self, workflow_state: WorkflowState, customer_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """执行市场研究阶段"""
        try:
            logger.info(f"执行市场研究，工作流ID: {workflow_state.workflow_id}")

            self._update_stage_progress(workflow_state, 30)

            # 准备客户信息
            customer_info = self._prepare_customer_info(customer_analysis)

            # 模拟市场研究（实际会调用MCP服务）
            market_research = {
                'trends': [
                    {
                        'topic': 'AI工具应用',
                        'growth_rate': 0.35,
                        'relevance_score': 0.92,
                        'confidence': 0.85
                    },
                    {
                        'topic': '效率提升',
                        'growth_rate': 0.28,
                        'relevance_score': 0.88,
                        'confidence': 0.80
                    }
                ],
                'competitors': [
                    {
                        'name': '竞品A',
                        'market_position': '挑战者',
                        'strengths': ['品牌知名度高', '用户基础好'],
                        'weaknesses': ['创新不足', '响应速度慢']
                    }
                ],
                'opportunities': [
                    {
                        'topic': 'AI效率工具测评',
                        'potential_reach': 15000,
                        'estimated_engagement': 0.12,
                        'difficulty_level': '中等'
                    }
                ],
                'analysis_timestamp': datetime.now().isoformat()
            }

            self._update_stage_progress(workflow_state, 40)
            logger.info("市场研究完成")

            return market_research

        except Exception as e:
            error_msg = f"市场研究失败: {str(e)}"
            logger.error(error_msg)
            workflow_state.errors.append(error_msg)
            raise

    async def _execute_strategy_generation(self, workflow_state: WorkflowState, customer_analysis: Dict[str, Any], market_research: Dict[str, Any]) -> Dict[str, Any]:
        """执行策略生成阶段"""
        try:
            logger.info(f"执行策略生成，工作流ID: {workflow_state.workflow_id}")

            self._update_stage_progress(workflow_state, 50)

            # 准备策略生成输入
            customer_data = self._prepare_customer_data(customer_analysis, market_research)

            # 生成综合策略
            strategy = await self.strategy_system.generate_comprehensive_strategy(customer_data)

            # 验证策略可行性
            feasibility = await self.strategy_system.validate_strategy_feasibility(strategy)
            strategy['feasibility_score'] = feasibility

            self._update_stage_progress(workflow_state, 70)
            logger.info("策略生成完成")

            return strategy

        except Exception as e:
            error_msg = f"策略生成失败: {str(e)}"
            logger.error(error_msg)
            workflow_state.errors.append(error_msg)
            raise

    async def _execute_content_planning(self, workflow_state: WorkflowState, strategy: Dict[str, Any]) -> Dict[str, Any]:
        """执行内容规划阶段"""
        try:
            logger.info(f"执行内容规划，工作流ID: {workflow_state.workflow_id}")

            self._update_stage_progress(workflow_state, 75)

            # 基于策略生成内容计划
            content_plan = {
                'content_calendar': self._generate_content_calendar(strategy),
                'content_pillars': strategy.get('content_strategy', {}).get('pillars', []),
                'publishing_schedule': strategy.get('content_strategy', {}).get('publishing_schedule', {}),
                'quality_guidelines': self._generate_quality_guidelines(strategy),
                'resource_requirements': self._calculate_content_resources(strategy)
            }

            self._update_stage_progress(workflow_state, 85)
            logger.info("内容规划完成")

            return content_plan

        except Exception as e:
            error_msg = f"内容规划失败: {str(e)}"
            logger.error(error_msg)
            workflow_state.errors.append(error_msg)
            raise

    async def _execute_learning_setup(self, workflow_state: WorkflowState, customer_analysis: Dict[str, Any], strategy: Dict[str, Any]) -> Dict[str, Any]:
        """执行学习设置阶段"""
        try:
            logger.info(f"执行学习设置，工作流ID: {workflow_state.workflow_id}")

            self._update_stage_progress(workflow_state, 90)

            # 创建学习计划
            customer_config = customer_analysis.get('basic_info', {})
            content_strategy = strategy.get('content_strategy', {})

            learning_plan = await self.learning_engine.create_learning_plan(customer_config, content_strategy)

            self._update_stage_progress(workflow_state, 95)
            logger.info("学习设置完成")

            return learning_plan

        except Exception as e:
            error_msg = f"学习设置失败: {str(e)}"
            logger.error(error_msg)
            workflow_state.errors.append(error_msg)
            # 学习设置失败不应该中断整个流程
            return {'error': error_msg}

    async def _execute_final_report(self, workflow_state: WorkflowState, stage_results: Dict[str, Any]) -> Dict[str, Any]:
        """执行最终报告阶段"""
        try:
            logger.info(f"生成最终报告，工作流ID: {workflow_state.workflow_id}")

            final_report = {
                'report_id': f"report_{workflow_state.workflow_id}",
                'customer_id': workflow_state.customer_id,
                'workflow_summary': {
                    'workflow_id': workflow_state.workflow_id,
                    'execution_time': (datetime.now() - workflow_state.start_time).total_seconds(),
                    'stages_completed': len([s for s in stage_results.values() if s and 'error' not in s]),
                    'total_stages': len(stage_results),
                    'success_rate': len([s for s in stage_results.values() if s and 'error' not in s]) / len(stage_results)
                },
                'key_findings': self._extract_key_findings(stage_results),
                'deliverables': self._list_deliverables(stage_results),
                'next_actions': self._define_next_actions(stage_results),
                'support_requirements': self._identify_support_requirements(stage_results),
                'generated_at': datetime.now().isoformat()
            }

            logger.info("最终报告生成完成")
            return final_report

        except Exception as e:
            error_msg = f"最终报告生成失败: {str(e)}"
            logger.error(error_msg)
            workflow_state.errors.append(error_msg)
            raise

    def _update_stage_progress(self, workflow_state: WorkflowState, progress: float):
        """更新阶段进度"""
        workflow_state.progress_percentage = progress
        workflow_state.logs.append(f"进度更新: {progress}% - {datetime.now().isoformat()}")

    def _analyze_prd_content(self, prd_content: str) -> Dict[str, Any]:
        """分析PRD内容"""
        # 简化的PRD内容分析
        return {
            'analysis_id': f"analysis_{uuid.uuid4().hex[:12]}",
            'analyzed_at': datetime.now().isoformat(),
            'basic_info': {
                'company_name': '示例公司',
                'industry': '科技',
                'company_size': '中型'
            },
            'brand_positioning': {
                'brand_name': '示例品牌',
                'brand_value': '创新技术'
            },
            'target_audience': {
                'primary_demographic': '25-35岁职场人士'
            },
            'business_goals': {
                'primary_goals': ['品牌建设', '用户增长']
            },
            'data_quality': {
                'completeness': 0.8,
                'quality': 0.75
            }
        }

    def _prepare_customer_info(self, customer_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """准备客户信息"""
        basic_info = customer_analysis.get('basic_info', {})
        brand_positioning = customer_analysis.get('brand_positioning', {})
        target_audience = customer_analysis.get('target_audience', {})
        business_goals = customer_analysis.get('business_goals', {})

        return {
            'customer_id': customer_analysis.get('analysis_id', ''),
            'basic_info': basic_info,
            'brand_positioning': brand_positioning,
            'target_audience': target_audience,
            'business_goals': business_goals,
            'insights': customer_analysis.get('insights', {})
        }

    def _prepare_customer_data(self, customer_analysis: Dict[str, Any], market_research: Dict[str, Any]) -> Dict[str, Any]:
        """准备客户数据"""
        customer_info = self._prepare_customer_info(customer_analysis)

        # 添加市场研究数据
        customer_info['market_context'] = market_research

        return customer_info

    def _generate_content_calendar(self, strategy: Dict[str, Any]) -> List[Dict[str, Any]]:
        """生成内容日历"""
        publishing_schedule = strategy.get('content_strategy', {}).get('publishing_schedule', {})
        optimal_times = publishing_schedule.get('optimal_times', ['09:00', '14:00', '20:00'])
        content_types = strategy.get('content_strategy', {}).get('recommended_types', ['图文'])

        # 生成7天的内容日历
        calendar = []
        for day_offset in range(7):
            date = datetime.now() + timedelta(days=day_offset)
            day_name = date.strftime('%A')

            # 每天生成1-2个内容
            daily_posts = min(2, len(optimal_times))
            for i in range(daily_posts):
                post_time = optimal_times[i] if i < len(optimal_times) else optimal_times[0]

                calendar.append({
                    'date': date.strftime('%Y-%m-%d'),
                    'day': day_name,
                    'time': post_time,
                    'content_type': content_types[i % len(content_types)],
                    'topic': f'每日话题 {day_offset + 1}',
                    'status': 'planned'
                })

        return calendar

    def _generate_quality_guidelines(self, strategy: Dict[str, Any]) -> Dict[str, Any]:
        """生成质量指南"""
        return {
            'content_standards': {
                'min_word_count': 500,
                'max_word_count': 2000,
                'required_elements': ['标题', '正文', '标签', '封面图'],
                'brand_consistency': True
            },
            'visual_guidelines': {
                'image_quality': '高清',
                'brand_colors': ['#FF6B6B', '#4ECDC4', '#45B7D1'],
                'font_consistency': True,
                'logo_placement': 'consistent'
            },
            'engagement_guidelines': {
                'call_to_action': 'included',
                'question_engagement': 'encouraged',
                'response_time': 'within_24h'
            }
        }

    def _calculate_content_resources(self, strategy: Dict[str, Any]) -> Dict[str, Any]:
        """计算内容资源需求"""
        publishing_frequency = strategy.get('content_strategy', {}).get('publishing_schedule', {}).get('posting_frequency', '每日1次')
        recommended_types = strategy.get('content_strategy', {}).get('recommended_types', ['图文'])

        # 基于发布频率和内容类型计算资源
        weekly_posts = 7 if '每日' in publishing_frequency else 3

        return {
            'content_creation': {
                'weekly_capacity': weekly_posts,
                'content_types': recommended_types,
                'estimated_hours_per_post': {
                    '图文': 2,
                    '视频': 4,
                    '直播': 3
                }
            },
            'design_resources': {
                'templates_needed': len(recommended_types),
                'image_per_post': 3,
                'video_per_week': 1 if '视频' in recommended_types else 0
            },
            'human_resources': {
                'content_creator': 1,
                'designer': 0.5,
                'community_manager': 0.3
            }
        }

    def _create_execution_summary(self, workflow_state: WorkflowState) -> Dict[str, Any]:
        """创建执行摘要"""
        return {
            'workflow_id': workflow_state.workflow_id,
            'customer_id': workflow_state.customer_id,
            'execution_time': (datetime.now() - workflow_state.start_time).total_seconds(),
            'status': workflow_state.status.value,
            'progress': workflow_state.progress_percentage,
            'stages_completed': len(workflow_state.stage_results),
            'errors_count': len(workflow_state.errors),
            'success_rate': (len(workflow_state.stage_results) - len(workflow_state.errors)) / max(len(workflow_state.stage_results), 1)
        }

    def _generate_performance_projections(self, strategy: Dict[str, Any]) -> Dict[str, float]:
        """生成性能预测"""
        expected_outcomes = strategy.get('expected_outcomes', {})

        return {
            'expected_engagement_rate': expected_outcomes.get('expected_engagement_rate', 0.06),
            'expected_follower_growth': expected_outcomes.get('expected_follower_growth', 0.12),
            'expected_content_quality': expected_outcomes.get('expected_content_quality', 0.75),
            'expected_brand_awareness': expected_outcomes.get('expected_brand_awareness', 0.70),
            'confidence_level': strategy.get('confidence_score', 0.80)
        }

    def _generate_recommendations(self, stage_results: Dict[str, Any]) -> List[str]:
        """生成建议"""
        recommendations = []

        strategy = stage_results.get('strategy', {})
        if strategy:
            confidence = strategy.get('confidence_score', 0.5)
            if confidence < 0.7:
                recommendations.append("建议收集更多市场数据以提高策略准确性")

        content_plan = stage_results.get('content_plan', {})
        if content_plan:
            resources = content_plan.get('resource_requirements', {})
            if resources:
                recommendations.append("确保有足够的人力资源支持内容创作计划")

        # 通用建议
        recommendations.extend([
            "定期监控运营数据并及时调整策略",
            "保持与目标受众的互动以提高用户粘性",
            "关注行业趋势并灵活调整内容方向"
        ])

        return recommendations

    def _generate_next_steps(self, stage_results: Dict[str, Any]) -> List[str]:
        """生成下一步行动"""
        next_steps = [
            "确认并执行内容发布计划",
            "设置数据监控和分析体系",
            "建立用户互动和反馈机制",
            "准备第一周的内容创作"
        ]

        learning_plan = stage_results.get('learning_plan')
        if learning_plan:
            next_steps.append("实施学习计划并定期评估效果")

        return next_steps

    def _extract_key_findings(self, stage_results: Dict[str, Any]) -> List[str]:
        """提取关键发现"""
        findings = []

        customer_analysis = stage_results.get('customer_analysis', {})
        if customer_analysis:
            insights = customer_analysis.get('insights', {})
            maturity_level = insights.get('maturity_level', 'unknown')
            findings.append(f"客户成熟度等级: {maturity_level}")

        strategy = stage_results.get('strategy', {})
        if strategy:
            confidence = strategy.get('confidence_score', 0)
            findings.append(f"策略置信度: {confidence:.2f}")

            content_strategy = strategy.get('content_strategy', {})
            if content_strategy:
                pillars = content_strategy.get('pillars', [])
                findings.append(f"识别了 {len(pillars)} 个核心内容支柱")

        return findings

    def _list_deliverables(self, stage_results: Dict[str, Any]) -> List[Dict[str, str]]:
        """列出交付物"""
        deliverables = []

        for stage_name, stage_data in stage_results.items():
            if stage_data and 'error' not in stage_data:
                deliverables.append({
                    'stage': stage_name,
                    'deliverable': f"{stage_name}_results",
                    'format': 'JSON',
                    'status': 'completed'
                })

        return deliverables

    def _define_next_actions(self, stage_results: Dict[str, Any]) -> List[Dict[str, str]]:
        """定义下一步行动"""
        actions = []

        # 基于策略的行动
        strategy = stage_results.get('strategy', {})
        if strategy:
            actions.append({
                'action': 'Strategy Implementation',
                'priority': 'High',
                'timeline': 'Week 1-2',
                'owner': 'Content Team'
            })

        # 基于内容计划的行动
        content_plan = stage_results.get('content_plan', {})
        if content_plan:
            actions.append({
                'action': 'Content Creation',
                'priority': 'High',
                'timeline': 'Week 1',
                'owner': 'Content Creator'
            })

        # 基于学习计划的行动
        learning_plan = stage_results.get('learning_plan', {})
        if learning_plan:
            actions.append({
                'action': 'Learning System Setup',
                'priority': 'Medium',
                'timeline': 'Week 1',
                'owner': 'Data Analyst'
            })

        return actions

    def _identify_support_requirements(self, stage_results: Dict[str, Any]) -> List[str]:
        """识别支持需求"""
        requirements = []

        content_plan = stage_results.get('content_plan', {})
        if content_plan:
            resources = content_plan.get('resource_requirements', {})
            if resources:
                requirements.append("内容创作资源和设计支持")

        strategy = stage_results.get('strategy', {})
        if strategy:
            confidence = strategy.get('confidence_score', 0)
            if confidence < 0.8:
                requirements.append("市场数据收集和分析支持")

        requirements.extend([
            "数据监控和分析工具",
            "用户互动和社区管理",
            "定期策略评估和优化服务"
        ])

        return requirements


# 使用示例
async def main():
    """主函数示例"""
    workflow = LaunchXCustomerWorkflow()

    # 示例客户输入
    customer_input = CustomerInput(
        customer_id="customer_demo_001",
        prd_content="""
        公司名称：科技创新有限公司
        行业：科技
        品牌价值：创新技术，改变未来
        目标受众：25-35岁职场人士
        业务目标：品牌建设、用户增长
        """
    )

    try:
        # 执行完整工作流
        result = await workflow.execute_complete_workflow(customer_input)

        print("工作流执行结果:")
        print(json.dumps(asdict(result), ensure_ascii=False, indent=2, default=str))

    except Exception as e:
        print(f"工作流执行失败: {str(e)}")


if __name__ == "__main__":
    asyncio.run(main())