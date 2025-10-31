#!/usr/bin/env python3
"""
LaunchX v4.0 Agent OS - 爆款内容学习分析脚本

基于Agent OS + BMAD学习引擎，分析小红书爆款内容，
提取成功模式，优化内容策略。
"""

import argparse
import json
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Any, Optional

PROJECT_ROOT = Path(__file__).resolve().parents[1]
AUTOMATION_ROOT = PROJECT_ROOT / "automation"
CLIENTS_ROOT = PROJECT_ROOT / "clients"

# Import Agent OS learning components
try:
    from ..core.learning.realtime_learning_engine import RealtimeLearningEngine
    from ..core.algorithms.xiaohongshu_ai_algorithms import ViralContentDetector
    from ..core.agents.enhanced_agents import TrendAnalystAgent
except ImportError:
    RealtimeLearningEngine = None
    ViralContentDetector = None
    TrendAnalystAgent = None


def setup_logger(client_slug: str) -> logging.Logger:
    """设置日志记录器"""
    log_dir = CLIENTS_ROOT / client_slug / "logs"
    log_dir.mkdir(parents=True, exist_ok=True)

    logger = logging.getLogger(f"learn_from_trending_{client_slug}")
    logger.setLevel(logging.INFO)

    formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")

    log_file = log_dir / f"trending_learning_{datetime.now().strftime('%Y-%m-%d')}.log"
    file_handler = logging.FileHandler(log_file)
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    return logger


class TrendingLearningOrchestrator:
    """爆款内容学习协调器"""

    def __init__(self, client_slug: str, config: Dict[str, Any], logger: logging.Logger):
        self.client_slug = client_slug
        self.config = config
        self.logger = logger

        # 初始化Agent OS组件
        if RealtimeLearningEngine:
            self.learning_engine = RealtimeLearningEngine()
        else:
            self.learning_engine = None

        if ViralContentDetector:
            self.viral_detector = ViralContentDetector()
        else:
            self.viral_detector = None

        if TrendAnalystAgent:
            self.trend_analyst = TrendAnalystAgent()
        else:
            self.trend_analyst = None

    async def analyze_trending_content(self) -> Dict[str, Any]:
        """分析爆款内容模式"""
        self.logger.info("开始爆款内容学习分析")

        results = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "client": self.client_slug,
            "analysis_type": "trending_learning",
            "viral_patterns": [],
            "content_insights": {},
            "optimization_recommendations": []
        }

        try:
            # 1. 收集小红书爆款数据
            viral_data = await self._collect_viral_data()
            results["viral_data_collection"] = viral_data

            # 2. 爆款模式识别
            if self.viral_detector:
                viral_patterns = await self._identify_viral_patterns(viral_data)
                results["viral_patterns"] = viral_patterns

            # 3. 趋势分析师深度解读
            if self.trend_analyst:
                trend_insights = await self._analyze_trend_insights(viral_data)
                results["trend_insights"] = trend_insights

            # 4. 学习引擎更新
            if self.learning_engine:
                learning_update = await self._update_learning_engine(results)
                results["learning_update"] = learning_update

            # 5. 生成优化建议
            recommendations = await self._generate_optimization_recommendations(results)
            results["optimization_recommendations"] = recommendations

            # 保存学习结果
            await self._save_learning_results(results)

            self.logger.info("爆款内容学习分析完成")
            return results

        except Exception as e:
            self.logger.error(f"爆款内容学习分析失败: {e}")
            results["error"] = str(e)
            return results

    async def _collect_viral_data(self) -> Dict[str, Any]:
        """收集小红书爆款数据"""
        self.logger.info("收集小红书爆款数据")

        # 模拟爆款数据收集（实际应该通过MCP工具获取）
        return {
            "source": "xiaohongshu_trending",
            "collection_time": datetime.now(timezone.utc).isoformat(),
            "viral_posts": [
                {
                    "id": "viral_001",
                    "title": "AI工具实测：这5个效率神器彻底改变我的工作方式",
                    "engagement_rate": 0.12,
                    "viral_score": 0.89,
                    "content_type": "工具评测",
                    "key_elements": ["数字标题", "实测体验", "具体工具", "效果对比"],
                    "hashtags": ["AI工具", "效率神器", "工作技巧", "科技好物"]
                },
                {
                    "id": "viral_002",
                    "title": "打工人必看！3个AI让你告别加班，工作效率提升300%",
                    "engagement_rate": 0.15,
                    "viral_score": 0.92,
                    "content_type": "效率提升",
                    "key_elements": ["身份认同", "具体数字", "问题解决方案", "效果承诺"],
                    "hashtags": ["打工人", "AI助手", "效率提升", "工作技巧"]
                },
                {
                    "id": "viral_003",
                    "title": "终于找到了！这个AI写作工具让我10分钟写出专业报告",
                    "engagement_rate": 0.11,
                    "viral_score": 0.87,
                    "content_type": "写作工具",
                    "key_elements": ["情感共鸣", "时间节省", "专业成果", "具体工具"],
                    "hashtags": ["AI写作", "效率工具", "职场必备", "文案神器"]
                }
            ],
            "market_trends": {
                "ai_tools": "持续热门",
                "efficiency_improvement": "需求强烈",
                "specific_solutions": "最受欢迎",
                "quantified_results": "传播力强"
            }
        }

    async def _identify_viral_patterns(self, viral_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """识别爆款模式"""
        self.logger.info("识别爆款内容模式")

        patterns = []

        for post in viral_data.get("viral_posts", []):
            pattern = {
                "pattern_id": post["id"],
                "content_structure": self._analyze_structure(post),
                "engagement_factors": self._analyze_engagement_factors(post),
                "viral_triggers": self._identify_viral_triggers(post),
                "replicability_score": self._calculate_replicability(post)
            }
            patterns.append(pattern)

        return patterns

    async def _analyze_trend_insights(self, viral_data: Dict[str, Any]) -> Dict[str, Any]:
        """趋势分析师深度解读"""
        self.logger.info("趋势分析师深度解读")

        return {
            "market_insights": {
                "primary_demand": "AI工具效率提升",
                "user_pain_points": ["工作效率低", "技术门槛高", "选择困难", "效果不确定"],
                "success_factors": ["具体工具推荐", "实测数据", "量化效果", "简单易用"],
                "trend_momentum": "持续上升"
            },
            "content_insights": {
                "effective_hooks": ["数字承诺", "身份认同", "问题解决", "时间节省"],
                "optimal_structure": ["问题引入→工具介绍→实测展示→效果对比→使用建议"],
                "engagement_triggers": ["实用性强", "结果可见", "易于模仿", "分享价值高"],
                "timing_factors": ["工作日早晨", "周末充电", "季度总结"]
            },
            "brand_alignment": {
                "authority_positioning": "专业评测师",
                "trust_building": "实测数据支撑",
                "value_proposition": "效率提升专家",
                "differentiation": "深度分析 + 实用建议"
            }
        }

    async def _update_learning_engine(self, analysis_results: Dict[str, Any]) -> Dict[str, Any]:
        """更新学习引擎"""
        self.logger.info("更新学习引擎")

        if not self.learning_engine:
            return {"status": "skipped", "reason": "learning_engine not available"}

        try:
            # 提取学习事件
            learning_events = []

            for pattern in analysis_results.get("viral_patterns", []):
                event = {
                    "event_type": "VIRAL_PATTERN_DETECTED",
                    "data": pattern,
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "confidence": pattern.get("replicability_score", 0.8)
                }
                learning_events.append(event)

            # 触发学习事件
            for event in learning_events:
                await self.learning_engine.trigger_learning_event(event)

            return {
                "status": "success",
                "events_processed": len(learning_events),
                "learning_type": "viral_pattern_learning"
            }

        except Exception as e:
            self.logger.error(f"学习引擎更新失败: {e}")
            return {"status": "failed", "error": str(e)}

    async def _generate_optimization_recommendations(self, analysis_results: Dict[str, Any]) -> List[Dict[str, Any]]:
        """生成优化建议"""
        self.logger.info("生成内容优化建议")

        recommendations = []

        # 基于爆款模式的建议
        viral_patterns = analysis_results.get("viral_patterns", [])
        if viral_patterns:
            recommendations.append({
                "category": "content_optimization",
                "priority": "high",
                "recommendation": "采用爆款标题模式：数字承诺 + 身份认同 + 效果保证",
                "implementation": "标题模板：'X个AI工具让你Y，效果提升Z%'",
                "expected_impact": "预计互动率提升40-60%"
            })

        # 基于市场趋势的建议
        market_trends = analysis_results.get("viral_data_collection", {}).get("market_trends", {})
        if market_trends:
            recommendations.append({
                "category": "trending_topics",
                "priority": "high",
                "recommendation": "重点覆盖AI工具效率提升主题",
                "implementation": "增加实测类内容，提供具体工具推荐和使用指南",
                "expected_impact": "预计传播度提升50%"
            })

        # 基于用户痛点的建议
        if self.trend_analyst and analysis_results.get("trend_insights"):
            insights = analysis_results["trend_insights"]
            pain_points = insights.get("market_insights", {}).get("user_pain_points", [])
            if pain_points:
                recommendations.append({
                    "category": "user_pain_addressing",
                    "priority": "medium",
                    "recommendation": f"针对性解决用户痛点：{', '.join(pain_points[:3])}",
                    "implementation": "每篇内容至少解决1-2个具体痛点，提供可操作方案",
                    "expected_impact": "预计用户满意度提升30%"
                })

        return recommendations

    async def _save_learning_results(self, results: Dict[str, Any]) -> None:
        """保存学习结果"""
        output_dir = CLIENTS_ROOT / self.client_slug / "data" / "learning"
        output_dir.mkdir(parents=True, exist_ok=True)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file = output_dir / f"trending_learning_{timestamp}.json"

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)

        self.logger.info(f"学习结果已保存: {output_file}")

    def _analyze_structure(self, post: Dict[str, Any]) -> Dict[str, Any]:
        """分析内容结构"""
        title = post.get("title", "")

        return {
            "has_numbers": any(char.isdigit() for char in title),
            "has_promise_words": any(word in title for word in ["必看", "神器", "告别", "终于", "让你"]),
            "has_identity_words": any(word in title for word in ["打工人", "职场", "上班族"]),
            "length_optimal": 20 <= len(title) <= 30,
            "hook_strength": "high" if any(indicator in title for indicator in ["!", "？", "必看", "神器"]) else "medium"
        }

    def _analyze_engagement_factors(self, post: Dict[str, Any]) -> List[str]:
        """分析互动因素"""
        factors = []

        if post.get("engagement_rate", 0) > 0.1:
            factors.append("高互动率")

        title = post.get("title", "")
        if any(char.isdigit() for char in title):
            factors.append("数字化表达")

        if "AI" in title:
            factors.append("AI热门话题")

        if any(word in title for word in ["效率", "工具", "神器"]):
            factors.append("实用价值")

        return factors

    def _identify_viral_triggers(self, post: Dict[str, Any]) -> List[str]:
        """识别爆款触发点"""
        triggers = []

        key_elements = post.get("key_elements", [])
        if "数字标题" in key_elements:
            triggers.append("数字承诺")
        if "实测体验" in key_elements:
            triggers.append("真实体验")
        if "具体工具" in key_elements:
            triggers.append("解决方案")
        if "效果对比" in key_elements:
            triggers.append("价值证明")

        return triggers

    def _calculate_replicability(self, post: Dict[str, Any]) -> float:
        """计算可复制性得分"""
        score = 0.5  # 基础分

        title = post.get("title", "")
        key_elements = post.get("key_elements", [])

        # 结构化程度
        if any(char.isdigit() for char in title):
            score += 0.1

        # 实用性
        if any(element in key_elements for element in ["具体工具", "实测体验", "效果对比"]):
            score += 0.2

        # 话题普适性
        if "AI" in title and any(word in title for word in ["效率", "工具", "工作"]):
            score += 0.15

        # 情感共鸣
        if any(word in title for word in ["打工人", "职场", "终于", "神器"]):
            score += 0.05

        return min(1.0, score)


def load_client_config(client_slug: str) -> Dict[str, Any]:
    """加载客户配置"""
    config_path = CLIENTS_ROOT / client_slug / "client-config.json"
    if not config_path.exists():
        raise FileNotFoundError(f"客户配置文件不存在: {config_path}")

    return json.loads(config_path.read_text(encoding='utf-8'))


async def main():
    """主函数"""
    parser = argparse.ArgumentParser(description="LaunchX爆款内容学习分析")
    parser.add_argument("--client", required=True, help="客户slug")
    parser.add_argument("--debug", action="store_true", help="启用调试模式")

    args = parser.parse_args()

    # 设置日志
    log_level = logging.DEBUG if args.debug else logging.INFO
    logging.basicConfig(level=log_level)

    logger = setup_logger(args.client)
    logger.info(f"启动LaunchX {args.client} 爆款内容学习分析")

    try:
        # 加载客户配置
        config = load_client_config(args.client)

        # 创建学习协调器
        orchestrator = TrendingLearningOrchestrator(args.client, config, logger)

        # 执行学习分析
        results = await orchestrator.analyze_trending_content()

        # 输出结果摘要
        logger.info("=== 爆款内容学习分析完成 ===")
        logger.info(f"客户: {results['client']}")
        logger.info(f"分析类型: {results['analysis_type']}")
        logger.info(f"识别爆款模式: {len(results.get('viral_patterns', []))}个")
        logger.info(f"优化建议: {len(results.get('optimization_recommendations', []))}条")

        if "error" in results:
            logger.error(f"分析过程中出现错误: {results['error']}")

        logger.info("=== 学习分析完成 ===")

    except Exception as e:
        logger.error(f"爆款内容学习分析失败: {e}")
        raise


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())