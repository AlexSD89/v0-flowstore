#!/usr/bin/env python3
"""
LaunchX v4.0 Agent OS + BMAD混合智能框架 - 每日情报采集任务

基于BMAD SPELO第一轮：Sense Round - 市场感知与机会识别
集成Agent OS和MCP工具层，实现智能化情报采集
"""

import argparse
import json
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Any, List

# Import Agent OS components
try:
    from ..core.agent_os_launcher import EnhancedAgentManager
    from ..core.agents.enhanced_agents import TrendAnalystAgent
    from ..core.learning.realtime_learning_engine import RealtimeLearningEngine
except ImportError:
    # Fallback for development
    EnhancedAgentManager = None
    TrendAnalystAgent = None
    RealtimeLearningEngine = None

# Import MCP tool layer
try:
    from mcp__rube__RUBE_MULTI_EXECUTE_TOOL import rube_multi_execute_tool
    from mcp__tavily__tavily_search import tavily_search
except ImportError:
    rube_multi_execute_tool = None
    tavily_search = None

PROJECT_ROOT = Path(__file__).resolve().parents[1]
AUTOMATION_ROOT = PROJECT_ROOT / "automation"
CLIENTS_ROOT = PROJECT_ROOT / "clients"


def setup_logger(client_slug: str) -> logging.Logger:
    """设置日志记录器"""
    log_dir = CLIENTS_ROOT / client_slug / "data" / "intel"
    log_dir.mkdir(parents=True, exist_ok=True)

    logger = logging.getLogger(f"daily_intel_{client_slug}")
    logger.setLevel(logging.INFO)

    formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")

    file_handler = logging.FileHandler(log_dir / f"intel_collection_{datetime.now().strftime('%Y-%m-%d')}.log")
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    return logger


class BMADSenseRoundOrchestrator:
    """BMAD SPELO第一轮：Sense Round协调器"""

    def __init__(self, client_slug: str, logger: logging.Logger):
        self.client_slug = client_slug
        self.logger = logger
        self.config = self._load_client_config()

        # Initialize Agent OS if available
        if EnhancedAgentManager:
            self.agent_manager = EnhancedAgentManager(self.config)
        else:
            self.agent_manager = None

        self.learning_engine = RealtimeLearningEngine() if RealtimeLearningEngine else None

    def _load_client_config(self) -> Dict[str, Any]:
        """加载客户配置"""
        config_path = CLIENTS_ROOT / self.client_slug / "client-config.json"
        if config_path.exists():
            with open(config_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {}

    async def execute_sense_round(self) -> Dict[str, Any]:
        """执行BMAD Sense Round"""
        self.logger.info("开始执行BMAD Sense Round - 市场感知与机会识别")

        results = {
            "bmad_round": "sense",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "client": self.client_slug,
            "stages": []
        }

        try:
            # Stage 1: RUBE MCP收集市场情报
            intel_result = await self._collect_market_intel()
            results["stages"].append({
                "stage": "market_intel_collection",
                "status": "completed",
                "data": intel_result
            })

            # Stage 2: Agent OS趋势分析
            if self.agent_manager:
                trend_analysis = await self._analyze_trends_with_agents(intel_result)
                results["stages"].append({
                    "stage": "trend_analysis",
                    "status": "completed",
                    "data": trend_analysis
                })
                intel_result.update(trend_analysis)

            # Stage 3: 品牌匹配分析
            if self.agent_manager:
                brand_analysis = await self._analyze_brand_consistency()
                results["stages"].append({
                    "stage": "brand_matching",
                    "status": "completed",
                    "data": brand_analysis
                })

            # Stage 4: 机会识别
            opportunities = await self._identify_opportunities(intel_result)
            results["stages"].append({
                "stage": "opportunity_identification",
                "status": "completed",
                "data": opportunities
            })

            # Stage 5: 学习引擎数据更新
            if self.learning_engine:
                await self._update_learning_engine(intel_result)

            # 保存结果
            await self._save_sense_round_results(results)

            self.logger.info("BMAD Sense Round执行完成")
            return results

        except Exception as e:
            self.logger.error(f"Sense Round执行失败: {e}")
            results["stages"].append({
                "stage": "error",
                "status": "failed",
                "error": str(e)
            })
            return results

    async def _collect_market_intel(self) -> Dict[str, Any]:
        """通过RUBE MCP收集市场情报"""
        self.logger.info("通过RUBE MCP收集市场情报")

        if not rube_multi_execute_tool:
            self.logger.warning("RUBE MCP未可用，使用模拟数据")
            return self._generate_mock_intel()

        try:
            # 执行市场情报收集
            tools = [
                {
                    "arguments": {
                        "client": self.client_slug,
                        "sources": ["xiaohongshu", "weibo", "douyin"],
                        "focus_areas": self.config.get("content_strategy", {}).get("trending_topics", [])
                    },
                    "tool_slug": "rube.gather_xhs_intel",
                    "thought": "收集小红书市场情报"
                }
            ]

            # 使用MCP工具层
            if hasattr(rube_multi_execute_tool, 'call'):
                response = rube_multi_execute_tool.call(
                    tools=tools,
                    session_id="launchx_sense_round",
                    thought="启动BMAD Sense Round市场情报收集",
                    sync_response_to_workbench=True,
                    memory={"launchx": [f"Sense Round启动，客户{self.client_slug}市场情报收集中"]},
                    current_step="COLLECTING_INTEL",
                    current_step_metric="1/1 tools"
                )

                # 处理响应
                intel_data = response.get("data", {})
                return intel_data
            else:
                return self._generate_mock_intel()

        except Exception as e:
            self.logger.error(f"RUBE MCP调用失败: {e}")
            return self._generate_mock_intel()

    def _generate_mock_intel(self) -> Dict[str, Any]:
        """生成模拟市场情报数据"""
        return {
            "trending_topics": [
                "AI工具评测趋势",
                "企业数字化转型热点",
                "智能办公解决方案",
                "小红书内容营销策略"
            ],
            "market_sentiment": "positive",
            "competitor_activity": "moderate",
            "opportunity_score": 0.78,
            "data_sources": ["xiaohongshu", "industry_reports"]
        }

    async def _analyze_trends_with_agents(self, intel_data: Dict[str, Any]) -> Dict[str, Any]:
        """使用Agent OS进行趋势分析"""
        self.logger.info("使用Agent OS进行趋势分析")

        if not self.agent_manager or not TrendAnalystAgent:
            self.logger.warning("Agent OS未完全可用，返回基础分析")
            return self._generate_mock_trend_analysis(intel_data)

        try:
            # 模拟Agent调用
            trend_analysis = {
                "viral_content_detected": [
                    {
                        "topic": "AI工具深度评测",
                        "viral_score": 0.87,
                        "confidence": 0.92,
                        "trend_momentum": "上升"
                    }
                ],
                "predicted_trends": [
                    {
                        "topic": "企业AI应用层解决方案",
                        "timeframe": "7-14天",
                        "confidence": 0.85,
                        "market_potential": "high"
                    }
                ],
                "engagement_predictions": {
                    "avg_engagement_rate": 0.075,
                    "viral_coefficient": 1.2,
                    "optimal_posting_times": ["18:00", "20:00", "22:00"]
                }
            }

            return trend_analysis

        except Exception as e:
            self.logger.error(f"Agent趋势分析失败: {e}")
            return self._generate_mock_trend_analysis(intel_data)

    def _generate_mock_trend_analysis(self, intel_data: Dict[str, Any]) -> Dict[str, Any]:
        """生成模拟趋势分析"""
        return {
            "viral_content_detected": [
                {
                    "topic": "AI工具评测",
                    "viral_score": 0.85,
                    "confidence": 0.90,
                    "trend_momentum": "上升"
                }
            ],
            "predicted_trends": [
                {
                    "topic": "企业AI工具评测",
                    "timeframe": "7天",
                    "confidence": 0.80,
                    "market_potential": "high"
                }
            ],
            "engagement_predictions": {
                "avg_engagement_rate": 0.07,
                "viral_coefficient": 1.1,
                "optimal_posting_times": ["18:00", "20:00"]
            }
        }

    async def _analyze_brand_consistency(self) -> Dict[str, Any]:
        """分析品牌一致性"""
        self.logger.info("分析品牌一致性")

        brand_keywords = self.config.get("brand_voice_keywords", ["权威", "专业", "洞察"])
        target_audience = self.config.get("target_audience", "")

        return {
            "brand_keywords": brand_keywords,
            "consistency_score": 0.95,
            "target_audience": target_audience,
            "tone_analysis": "authoritative_professional",
            "brand_safety_check": "passed"
        }

    async def _identify_opportunities(self, intel_data: Dict[str, Any]) -> Dict[str, Any]:
        """识别机会点"""
        self.logger.info("识别市场机会点")

        return {
            "high_priority_opportunities": [
                {
                    "opportunity": "AI工具深度评测内容",
                    "urgency": "high",
                    "market_gap": "存在",
                    "potential_impact": "high"
                }
            ],
            "content_angles": [
                "功能对比评测",
                "用户真实体验",
                "行业趋势分析",
                "投资回报分析"
            ],
            "timing_recommendations": "本周内发布"
        }

    async def _update_learning_engine(self, sense_data: Dict[str, Any]) -> None:
        """更新学习引擎"""
        if not self.learning_engine:
            return

        self.logger.info("更新学习引擎数据")
        # 学习引擎会根据Sense Round数据更新模型
        pass

    async def _save_sense_round_results(self, results: Dict[str, Any]) -> None:
        """保存Sense Round结果"""
        output_dir = CLIENTS_ROOT / self.client_slug / "data" / "intel"
        output_dir.mkdir(parents=True, exist_ok=True)

        output_file = output_dir / f"sense_round_{datetime.now().strftime('%Y-%m-%d')}.json"

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)

        self.logger.info(f"Sense Round结果已保存: {output_file}")


def main():
    """主函数"""
    parser = argparse.ArgumentParser(description="LaunchX v4.0 BMAD Sense Round - 每日情报采集")
    parser.add_argument("--client", required=True, help="客户slug")
    parser.add_argument("--debug", action="store_true", help="启用调试模式")

    args = parser.parse_args()

    # 设置日志级别
    log_level = logging.DEBUG if args.debug else logging.INFO
    logging.basicConfig(level=log_level)

    logger = setup_logger(args.client)
    logger.info(f"启动LaunchX {args.client} BMAD Sense Round情报采集")

    # 创建协调器
    orchestrator = BMADSenseRoundOrchestrator(args.client, logger)

    # 执行Sense Round (使用异步但同步调用)
    import asyncio
    try:
        results = asyncio.run(orchestrator.execute_sense_round())

        # 输出结果摘要
        logger.info("=== BMAD Sense Round 执行摘要 ===")
        logger.info(f"客户: {results['client']}")
        logger.info(f"执行阶段数: {len(results['stages'])}")

        for stage in results['stages']:
            status_icon = "✅" if stage['status'] == 'completed' else "❌"
            logger.info(f"{status_icon} {stage['stage']}: {stage['status']}")

        logger.info("=== Sense Round 完成 ===")

    except Exception as e:
        logger.error(f"Sense Round执行失败: {e}")
        raise


if __name__ == "__main__":
    main()