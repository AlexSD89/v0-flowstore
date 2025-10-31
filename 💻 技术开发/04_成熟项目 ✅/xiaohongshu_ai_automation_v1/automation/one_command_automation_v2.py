#!/usr/bin/env python3
"""
LaunchX XiaoHongShu automation orchestrator v2.0.
智能商业战略平台版本 - 从内容生成器转型为智能客户需求分析与策略制定平台

该脚本基于四层BMAD混合智能架构，提供智能化的客户服务能力。
"""

from __future__ import annotations

import argparse
import asyncio
import json
import logging
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

# 添加项目根目录到Python路径
PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT))

from core.architecture.agent_os_launcher_v2 import AgentOSLauncherV2, LegacySystemAdapter
from core.config.agent_os_config import AgentOSConfig

# 保持向后兼容的导入
AUTOMATION_ROOT = PROJECT_ROOT / "automation"
CLIENTS_ROOT = PROJECT_ROOT / "clients"

class IntelligentAutomationOrchestrator:
    """智能自动化编排器 - v2.0版本"""

    def __init__(self, config_path: Optional[Path] = None):
        self.config = AgentOSConfig.load_config(config_path)
        self.logger = self._setup_logging()

        # 初始化新的智能系统
        self.agent_os_launcher = AgentOSLauncherV2(self.config)
        self.legacy_adapter = LegacySystemAdapter(self.agent_os_launcher)

        # 验证环境
        self._validate_environment()

    def _setup_logging(self) -> logging.Logger:
        """设置日志"""
        logger = logging.getLogger("intelligent_automation")
        logger.handlers.clear()

        log_level = getattr(logging, self.config.system_settings.get("log_level", "INFO"))
        logger.setLevel(log_level)

        formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")

        # 控制台处理器
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)

        return logger

    def _validate_environment(self):
        """验证环境配置"""
        validation_result = self.config.validate_environment()

        if not validation_result["valid"]:
            self.logger.error("环境验证失败:")
            for issue in validation_result["issues"]:
                self.logger.error(f"  - {issue}")
            raise RuntimeError("环境配置验证失败")

        if validation_result["warnings"]:
            self.logger.warning("环境警告:")
            for warning in validation_result["warnings"]:
                self.logger.warning(f"  - {warning}")

    async def orchestrate_intelligent_service(
        self,
        client_slug: str,
        mode: str,
        schedule: Optional[str] = None,
        dry_run: bool = False,
        **kwargs
    ) -> Dict[str, Any]:
        """编排智能服务"""

        self.logger.info(
            f"启动智能服务: client={client_slug} mode={mode} schedule={schedule} dry_run={dry_run}"
        )

        try:
            if mode == "intelligent":
                # 新的智能服务模式
                request = self._build_intelligent_request(client_slug, schedule, **kwargs)

                if dry_run:
                    self.logger.info(f"[DRY-RUN] 智能服务请求: {request}")
                    return self._build_dry_run_response(request)

                result = await self.agent_os_launcher.start_intelligent_service(request)

            else:
                # 兼容现有系统的模式
                if dry_run:
                    self.logger.info(f"[DRY-RUN] 兼容模式请求: client={client_slug} mode={mode}")
                    return self._build_legacy_dry_run_response(client_slug, mode, schedule)

                result = await self.legacy_adapter.adapt_one_command_automation(
                    client_slug, mode, schedule
                )

            self.logger.info(f"智能服务完成: {result.get('session_id', 'unknown')}")
            return result

        except Exception as e:
            self.logger.exception(f"智能服务执行失败: {e}")
            error_response = {
                'session_id': f"error_{datetime.now().timestamp()}",
                'error': str(e),
                'status': 'failed',
                'timestamp': datetime.now(timezone.utc).isoformat()
            }

            if dry_run:
                error_response['dry_run'] = True

            return error_response

    def _build_intelligent_request(self, client_slug: str, schedule: Optional[str], **kwargs) -> Dict[str, Any]:
        """构建智能服务请求"""

        base_request = {
            'customer_input': kwargs.get('customer_input', f"为客户 {client_slug} 提供智能商业战略服务"),
            'request_type': kwargs.get('request_type', 'comprehensive_service'),
            'client_slug': client_slug,
            'schedule': schedule,
            'priority': kwargs.get('priority', 'normal'),
            'customer_context': {
                'business_goals': kwargs.get('business_goals', []),
                'target_audience': kwargs.get('target_audience', {}),
                'budget_constraints': kwargs.get('budget_constraints', {}),
                'competitive_landscape': kwargs.get('competitive_landscape', {})
            },
            'service_preferences': {
                'automation_level': kwargs.get('automation_level', 'high'),
                'collaboration_mode': kwargs.get('collaboration_mode', 'ai_first'),
                'quality_requirements': kwargs.get('quality_requirements', 'standard')
            }
        }

        return base_request

    def _build_dry_run_response(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """构建模拟运行响应"""
        return {
            'session_id': f"dry_run_{datetime.now().timestamp()}",
            'dry_run': True,
            'request_summary': {
                'client_slug': request.get('client_slug'),
                'request_type': request.get('request_type'),
                'priority': request.get('priority')
            },
            'expected_capabilities': [
                'customer_requirement_analysis',
                'market_opportunity_identification',
                'intelligent_strategy_formulation',
                'collaborative_decision_making',
                'performance_tracking_setup'
            ],
            'estimated_processing_time': '2-5分钟',
            'status': 'dry_run_completed',
            'timestamp': datetime.now(timezone.utc).isoformat()
        }

    def _build_legacy_dry_run_response(self, client_slug: str, mode: str, schedule: Optional[str]) -> Dict[str, Any]:
        """构建兼容模式模拟运行响应"""
        return {
            'session_id': f"legacy_dry_run_{datetime.now().timestamp()}",
            'dry_run': True,
            'legacy_mode': mode,
            'client_slug': client_slug,
            'schedule': schedule,
            'compatible_stages': self._get_compatible_stages(mode),
            'status': 'legacy_dry_run_completed',
            'timestamp': datetime.now(timezone.utc).isoformat()
        }

    def _get_compatible_stages(self, mode: str) -> List[Dict[str, Any]]:
        """获取兼容的阶段信息"""
        stage_mapping = {
            "plan": [
                {"stage": "requirement_analysis", "description": "客户需求智能分析"},
                {"stage": "strategy_formulation", "description": "商业策略制定"}
            ],
            "publish": [
                {"stage": "strategy_execution", "description": "策略执行和监控"}
            ],
            "full": [
                {"stage": "comprehensive_analysis", "description": "综合客户分析"},
                {"stage": "intelligent_planning", "description": "智能规划"},
                {"stage": "strategy_execution", "description": "策略执行"},
                {"stage": "performance_optimization", "description": "效果优化"}
            ]
        }
        return stage_mapping.get(mode, [])

    # 保持向后兼容的方法
    def load_status(self, client_slug: str) -> Dict[str, Any]:
        """加载状态（兼容方法）"""
        status_path = CLIENTS_ROOT / client_slug / "status.json"
        if status_path.exists():
            try:
                return json.loads(status_path.read_text(encoding="utf-8"))
            except json.JSONDecodeError:
                return {}
        return {}

    def save_status(self, client_slug: str, status: Dict[str, Any]) -> None:
        """保存状态（兼容方法）"""
        status_path = CLIENTS_ROOT / client_slug / "status.json"
        status_path.parent.mkdir(parents=True, exist_ok=True)
        status_path.write_text(json.dumps(status, ensure_ascii=False, indent=2), encoding="utf-8")

# CLI接口保持兼容，但增加智能模式
def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="LaunchX XiaoHongShu 智能自动化编排器 v2.0")
    parser.add_argument("--client", required=True, help="客户 slug，例如 launch-x")
    parser.add_argument(
        "--mode",
        choices=["plan", "publish", "full", "intelligent"],
        default="intelligent",
        help="plan=情报+策略，publish=执行，full=全流程，intelligent=智能服务"
    )
    parser.add_argument("--schedule", choices=["daily", "weekly", "adhoc"], help="调度标签")
    parser.add_argument("--dry-run", action="store_true", help="模拟运行")
    parser.add_argument("--config", type=Path, help="配置文件路径")
    parser.add_argument("--customer-input", help="客户需求描述")
    parser.add_argument("--request-type", choices=["comprehensive_service", "strategic_planning", "strategy_execution"],
                       default="comprehensive_service", help="请求类型")
    parser.add_argument("--priority", choices=["low", "normal", "high"], default="normal", help="优先级")
    parser.add_argument("--automation-level", choices=["low", "medium", "high"], default="high", help="自动化程度")
    parser.add_argument("--collaboration-mode", choices=["ai_first", "human_first", "balanced"], default="ai_first", help="协作模式")
    return parser.parse_args()

async def main():
    args = parse_args()

    # 初始化智能编排器
    orchestrator = IntelligentAutomationOrchestrator(args.config)

    # 构建请求参数
    kwargs = {
        'customer_input': args.customer_input,
        'request_type': args.request_type,
        'priority': args.priority,
        'automation_level': args.automation_level,
        'collaboration_mode': args.collaboration_mode
    }

    try:
        # 执行智能服务
        result = await orchestrator.orchestrate_intelligent_service(
            client_slug=args.client,
            mode=args.mode,
            schedule=args.schedule,
            dry_run=args.dry_run,
            **kwargs
        )

        # 输出结果
        print(f"\n{'='*60}")
        print(f"智能服务执行完成")
        print(f"{'='*60}")
        print(f"会话ID: {result.get('session_id', 'N/A')}")
        print(f"状态: {result.get('status', 'unknown')}")
        print(f"时间戳: {result.get('timestamp', 'N/A')}")

        if args.dry_run:
            print(f"\n模拟运行结果:")
            if 'expected_capabilities' in result:
                print(f"预期能力: {', '.join(result['expected_capabilities'])}")
            if 'estimated_processing_time' in result:
                print(f"预计处理时间: {result['estimated_processing_time']}")
            if 'compatible_stages' in result:
                print(f"兼容阶段: {[stage['description'] for stage in result['compatible_stages']]}")
        else:
            if 'business_strategy' in result:
                strategy = result['business_strategy']
                print(f"\n商业策略已生成:")
                print(f"- 客户理解: {len(strategy.get('customer_understanding', {}))} 个维度")
                print(f"- 战略建议: {len(strategy.get('strategic_recommendations', {}))} 个类别")
                print(f"- 执行计划: {len(strategy.get('execution_plan', {}))} 个组件")
                print(f"- 预期成果: {len(strategy.get('expected_outcomes', {}))} 项指标")

            if 'layer_results' in result:
                print(f"\n分层结果:")
                for layer_name, layer_result in result['layer_results'].items():
                    print(f"- {layer_name}: 已完成")

        print(f"{'='*60}")

        # 保存状态（兼容性）
        if not args.dry_run and args.mode != "intelligent":
            orchestrator.save_status(args.client, {
                "last_run": result,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "mode": args.mode,
                "version": "v2.0"
            })

    except KeyboardInterrupt:
        print("\n用户中断执行")
        sys.exit(1)
    except Exception as e:
        print(f"\n执行失败: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())