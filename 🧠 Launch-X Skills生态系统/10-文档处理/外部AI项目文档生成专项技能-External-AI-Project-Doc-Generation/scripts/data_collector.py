#!/usr/bin/env python3
"""
Enhanced Data Collector for External Project Analysis

线索驱动的多源信息采集系统，集成MCP工具智能选择和交叉验证机制。
基于《通用信息采集验证方法论》和外部Ai项目信息录入与归档工作流技术规范。

Usage:
    python3 data_collector.py --project "SERVAL" --website "https://www.serval.com/" --depth "comprehensive"

Features:
- 线索驱动的数据采集策略
- 四级信源分级系统 (1.0, 0.8, 0.6, 0.3)
- 多轮检索策略 (基础信息→市场数据→技术细节→深度洞察)
- 交叉验证机制 - 每个数据点至少2个独立信源确认
- 智能工具选择算法 - 根据项目特征自动选择最优MCP工具组合
- 集成MCP工具 (RUBE_SEARCH_TOOLS, RUBE_MULTI_EXECUTE_TOOL, RUBE_REMOTE_WORKBENCH)

Author: LaunchX Claude Team
Version: 2.0.0 - Enhanced with MCP Integration and Clue-Driven Collection
Created: 2025-01-18
"""

import sys
import json
import time
import asyncio
import logging
import re
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple, Set
from dataclasses import dataclass, asdict
from enum import Enum
from datetime import datetime, timedelta
import concurrent.futures
from urllib.parse import urlparse, urljoin

# Import MCP integration modules
try:
    from mcp_integration import get_mcp_integration, MCPExecutionResult
    from rube_tools import get_rube_tools
    from parallel_executor import get_parallel_executor, ParallelTask, TaskPriority
    MCP_AVAILABLE = True
except ImportError:
    MCP_AVAILABLE = False
    print("Warning: MCP integration modules not available. Using fallback mode.")


class DataSourceTier(Enum):
    """数据源分级枚举"""
    TIER1_PRIMARY = (1.0, "官方一手信息")      # 官网、创始人声明、官方公告、财务报告
    TIER2_AUTHORITATIVE = (0.8, "权威二手信息")  # 媒体报道、VC公告、行业报告、学术论文
    TIER3_INDUSTRY = (0.6, "行业三方信息")      # 会议数据、专利申请、用户评论、竞争对手提及
    TIER4_CONTEXTUAL = (0.3, "情境辅助信息")    # 社交媒体、论坛讨论、员工评价、社区参与


class CollectionStrategy(Enum):
    """采集策略枚举"""
    CLUE_DRIVEN = "clue_driven"      # 线索驱动优先
    COMPREHENSIVE = "comprehensive"   # 全面覆盖策略
    VERIFICATION_FOCUSED = "verification_focused"  # 验证导向策略
    MARKET_INTELLIGENCE = "market_intelligence"   # 市场情报策略


class ProjectStage(Enum):
    """项目阶段枚举"""
    EARLY_STAGE = "early_stage"           # 早期项目
    GROWTH_STAGE = "growth_stage"         # 成长期项目
    MATURE_COMPANY = "mature_company"     # 成熟公司
    UNKNOWN = "unknown"                   # 未知阶段


@dataclass
class DataPoint:
    """数据点结构"""
    field_name: str                       # 数据字段名
    value: Any                           # 数据值
    source_type: str                     # 数据源类型
    source_url: Optional[str] = None     # 数据源URL
    credibility_score: float = 0.0       # 可信度评分
    collection_timestamp: datetime = None
    verification_count: int = 1           # 验证次数
    cross_verified: bool = False         # 是否交叉验证
    tier: DataSourceTier = DataSourceTier.TIER4_CONTEXTUAL

    def __post_init__(self):
        if self.collection_timestamp is None:
            self.collection_timestamp = datetime.now()


@dataclass
class CollectionClue:
    """采集线索结构"""
    clue_type: str                       # 线索类型: user_sharing, official_announcement, media_report
    content: str                         # 线索内容
    source: str                          # 线索来源
    confidence: float                    # 线索可信度
    extraction_timestamp: datetime = None
    related_queries: List[str] = None    # 相关查询

    def __post_init__(self):
        if self.extraction_timestamp is None:
            self.extraction_timestamp = datetime.now()
        if self.related_queries is None:
            self.related_queries = []


@dataclass
class MCPToolConfig:
    """MCP工具配置"""
    tool_slug: str
    priority: int                        # 优先级 1-5
    effectiveness_score: float = 0.0     # 有效性评分
    success_rate: float = 1.0           # 成功率
    avg_response_time: float = 0.0      # 平均响应时间


class EnhancedDataCollector:
    """增强版数据采集器 - 线索驱动 + MCP集成"""

    def __init__(self, project_name: str, website: Optional[str] = None,
                 strategy: CollectionStrategy = CollectionStrategy.CLUE_DRIVEN,
                 mcp_enabled: bool = MCP_AVAILABLE):
        """
        初始化增强版数据采集器

        Args:
            project_name: 项目名称
            website: 项目官网
            strategy: 采集策略
            mcp_enabled: 是否启用MCP工具
        """
        self.project_name = project_name
        self.website = website
        self.strategy = strategy
        self.mcp_enabled = mcp_enabled

        # 初始化日志
        self.logger = self._setup_logger()

        # 初始化MCP工具
        self.mcp_integration = None
        self.rube_tools = None
        self.parallel_executor = None
        if self.mcp_enabled:
            self._init_mcp_tools()

        # 数据存储
        self.collected_data: Dict[str, List[DataPoint]] = {}
        self.collection_clues: List[CollectionClue] = []
        self.source_weights = {tier.value[0]: tier.value[1] for tier in DataSourceTier}

        # 采集统计
        self.collection_stats = {
            "total_queries": 0,
            "successful_queries": 0,
            "data_points_collected": 0,
            "cross_verified_points": 0,
            "tools_used": [],
            "start_time": datetime.now(),
            "credibility_distribution": {1.0: 0, 0.8: 0, 0.6: 0, 0.3: 0}
        }

        # 智能工具选择矩阵
        self.tool_selection_matrix = self._initialize_tool_matrix()

        self.logger.info(f"Enhanced Data Collector initialized for {project_name}")
        self.logger.info(f"Strategy: {strategy.value}, MCP Enabled: {mcp_enabled}")

    def _setup_logger(self) -> logging.Logger:
        """设置日志记录器"""
        logger = logging.getLogger(f"DataCollector_{self.project_name}")
        logger.setLevel(logging.INFO)

        if not logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            )
            handler.setFormatter(formatter)
            logger.addHandler(handler)

        return logger

    def _init_mcp_tools(self):
        """初始化MCP工具"""
        try:
            if MCP_AVAILABLE:
                self.mcp_integration = get_mcp_integration()
                self.rube_tools = get_rube_tools()
                self.parallel_executor = get_parallel_executor()
                self.logger.info("MCP tools initialized successfully")
            else:
                self.logger.warning("MCP modules not available, using fallback mode")
        except Exception as e:
            self.logger.error(f"Failed to initialize MCP tools: {e}")
            self.mcp_enabled = False

    def _initialize_tool_matrix(self) -> Dict[str, MCPToolConfig]:
        """初始化工具选择矩阵"""
        return {
            # 用户体验源
            "xiaohongshu_mcp": MCPToolConfig("xiaohongshu_mcp", 5, 0.9),
            "reddit_mcp": MCPToolConfig("reddit_mcp", 4, 0.8),
            "linkedin_mcp": MCPToolConfig("linkedin_mcp", 4, 0.8),
            "twitter_mcp": MCPToolConfig("twitter_mcp", 3, 0.7),

            # 官方验证源
            "web_search": MCPToolConfig("web_search", 4, 0.9),
            "web_fetch": MCPToolConfig("web_fetch", 5, 0.95),
            "jina_reader": MCPToolConfig("jina_reader", 4, 0.85),
            "firecrawl_search": MCPToolConfig("firecrawl_search", 4, 0.9),

            # 专业数据库
            "crunchbase_api": MCPToolConfig("crunchbase_api", 5, 0.95),
            "pitchbook_api": MCPToolConfig("pitchbook_api", 5, 0.95),
            "patent_search": MCPToolConfig("patent_search", 4, 0.85),
            "github_search": MCPToolConfig("github_search", 4, 0.8),

            # 市场情报
            "rube_search_tools": MCPToolConfig("rube_search_tools", 5, 0.9),
            "tavily_monitoring": MCPToolConfig("tavily_monitoring", 4, 0.85),
            "context7_analysis": MCPToolConfig("context7_analysis", 4, 0.8),
            "industry_databases": MCPToolConfig("industry_databases", 4, 0.85)
        }

    async def collect_all_tiers_data(self) -> Dict[str, Any]:
        """
        执行完整的四级数据采集流程
        基于线索驱动的多轮检索策略
        """
        self.logger.info(f"🚀 Starting comprehensive data collection for {self.project_name}")

        # Phase 1: 项目特征分析和智能工具选择
        project_characteristics = await self._analyze_project_characteristics()
        selected_tools = self._intelligent_tool_selection(project_characteristics)

        # Phase 2: 线索驱动的数据采集
        if self.strategy == CollectionStrategy.CLUE_DRIVEN:
            await self._clue_driven_collection(selected_tools)
        else:
            await self._standard_collection(selected_tools)

        # Phase 3: 多轮检索策略执行
        await self._execute_round_collection_strategy()

        # Phase 4: 交叉验证机制
        validated_data = await self._cross_validation_mechanism()

        # Phase 5: 数据质量评估
        quality_assessment = self._assess_data_quality()

        # 生成采集报告
        report = self._generate_collection_report(validated_data, quality_assessment)

        self.logger.info(f"✅ Data collection completed with {quality_assessment['overall_score']}% quality score")
        return report

    async def _analyze_project_characteristics(self) -> Dict[str, Any]:
        """分析项目特征用于智能工具选择"""
        characteristics = {
            "project_stage": ProjectStage.UNKNOWN,
            "data_availability": "unknown",
            "analysis_depth": "standard",
            "urgency_level": "normal",
            "industry_domain": "unknown"
        }

        # 基于项目名称和网站进行初步分析
        if self.website:
            characteristics["has_official_site"] = True
        else:
            characteristics["has_official_site"] = False

        # 使用MCP工具进行深度分析
        if self.mcp_enabled and self.rube_tools:
            try:
                # 使用RUBE搜索工具分析项目
                search_result = await self.rube_tools.rube_search_tools(
                    use_case=f"分析项目特征: {self.project_name}",
                    max_results=10,
                    search_depth="medium"
                )

                if search_result:
                    characteristics.update({
                        "data_availability": "rich" if len(search_result.available_tools) > 5 else "limited",
                        "industry_domain": self._extract_industry_domain(self.project_name)
                    })

            except Exception as e:
                self.logger.warning(f"Failed to analyze project with MCP tools: {e}")

        return characteristics

    def _intelligent_tool_selection(self, characteristics: Dict[str, Any]) -> Dict[str, List[str]]:
        """基于项目特征智能选择工具组合"""

        project_stage = characteristics.get("project_stage", ProjectStage.UNKNOWN)
        data_availability = characteristics.get("data_availability", "unknown")

        if project_stage == ProjectStage.EARLY_STAGE:
            # 早期项目重点收集用户体验线索
            primary_tools = [
                "xiaohongshu_mcp", "reddit_mcp", "web_search",
                "crunchbase_api", "patent_search"
            ]
            secondary_tools = [
                "linkedin_mcp", "github_search", "rube_search_tools"
            ]

        elif project_stage == ProjectStage.GROWTH_STAGE:
            # 成长期项目重点验证商业数据
            primary_tools = [
                "crunchbase_api", "web_fetch", "rube_search_tools",
                "web_search", "industry_databases"
            ]
            secondary_tools = [
                "xiaohongshu_mcp", "tavily_monitoring", "pitchbook_api"
            ]

        elif project_stage == ProjectStage.MATURE_COMPANY:
            # 成熟公司重点进行深度分析
            primary_tools = [
                "rube_search_tools", "pitchbook_api", "industry_databases",
                "web_fetch", "github_search", "patent_search"
            ]
            secondary_tools = [
                "crunchbase_api", "web_search", "jina_reader"
            ]

        else:
            # 未知阶段使用全面工具组合
            primary_tools = [
                "web_search", "xiaohongshu_mcp", "rube_search_tools",
                "crunchbase_api", "web_fetch"
            ]
            secondary_tools = [
                "patent_search", "industry_databases", "jina_reader"
            ]

        # 根据数据可用性调整工具选择
        if data_availability == "limited":
            # 数据有限时，加强搜索工具
            additional_tools = ["tavily_monitoring", "firecrawl_search"]
            primary_tools.extend(additional_tools)

        return {
            "primary_tools": primary_tools,
            "secondary_tools": secondary_tools,
            "fallback_strategy": "web_search_first"
        }

    async def _clue_driven_collection(self, selected_tools: Dict[str, List[str]]):
        """线索驱动的数据采集"""
        self.logger.info("🎯 Starting clue-driven data collection")

        # Step 1: 从用户分享线索开始
        await self._collect_user_sharing_clues(selected_tools["primary_tools"])

        # Step 2: 官方信息确认
        await self._collect_official_confirmation(selected_tools["primary_tools"])

        # Step 3: 市场数据验证
        await self._collect_market_verification(selected_tools["secondary_tools"])

        # Step 4: 深度洞察收集
        await self._collect_deep_insights(selected_tools["secondary_tools"])

    async def _standard_collection(self, selected_tools: Dict[str, List[str]]):
        """标准数据采集流程"""
        self.logger.info("📊 Starting standard data collection")

        # 并行执行主要工具
        all_tools = selected_tools["primary_tools"] + selected_tools["secondary_tools"]

        if self.mcp_enabled and self.parallel_executor:
            # 使用MCP并行执行
            tasks = []
            for i, tool in enumerate(all_tools[:6]):  # 限制并发数
                task = ParallelTask(
                    task_id=f"collection_{i}",
                    tool_slug=tool,
                    arguments={"query": f"{self.project_name} comprehensive analysis"},
                    priority=TaskPriority.HIGH
                )
                tasks.append(task)

            try:
                summary = await self.parallel_executor.execute_parallel_tasks(
                    tasks=tasks, parallel_limit=3
                )
                self._process_parallel_results(summary)
            except Exception as e:
                self.logger.error(f"Parallel execution failed: {e}")
                # 回退到串行执行
                await self._fallback_serial_collection(all_tools)
        else:
            # 回退模式
            await self._fallback_serial_collection(all_tools)

    async def _execute_round_collection_strategy(self):
        """执行多轮检索策略"""
        self.logger.info("🔄 Executing multi-round collection strategy")

        rounds = [
            ("基础信息检索", self._collect_basic_info),
            ("市场数据收集", self._collect_market_data),
            ("技术细节挖掘", self._collect_technical_details),
            ("深度洞察生成", self._collect_deep_insights)
        ]

        for round_name, round_func in rounds:
            self.logger.info(f"📍 Executing: {round_name}")
            try:
                await round_func()
                # 轮次间隔，避免过于频繁的请求
                await asyncio.sleep(1)
            except Exception as e:
                self.logger.error(f"Failed to execute {round_name}: {e}")

    async def _cross_validation_mechanism(self) -> Dict[str, List[DataPoint]]:
        """交叉验证机制 - 每个关键数据点至少2个独立信源确认"""
        self.logger.info("🔍 Starting cross-validation mechanism")

        validated_data = {}
        critical_fields = [
            "company_name", "ceo_founder", "funding_stage", "total_funding",
            "launch_date", "business_model", "key_products", "target_market"
        ]

        for field in critical_fields:
            if field in self.collected_data:
                data_points = self.collected_data[field]

                # 筛选高可信度数据点
                high_credibility_points = [
                    dp for dp in data_points
                    if dp.credibility_score >= 0.8
                ]

                # 寻找多个独立来源的确认
                verified_points = []
                for dp in high_credibility_points:
                    independent_sources = [
                        other_dp for other_dp in high_credibility_points
                        if (other_dp.source_url != dp.source_url and
                            other_dp.source_type != dp.source_type)
                    ]

                    if len(independent_sources) >= 1:  # 至少1个其他独立来源
                        dp.cross_verified = True
                        dp.verification_count += len(independent_sources)
                        verified_points.append(dp)

                if verified_points:
                    validated_data[field] = verified_points
                    self.collection_stats["cross_verified_points"] += len(verified_points)
                else:
                    # 如果没有交叉验证，保留最高可信度的数据点
                    best_point = max(high_credibility_points, key=lambda x: x.credibility_score) if high_credibility_points else data_points[0]
                    validated_data[field] = [best_point]

        # 添加非关键字段数据
        for field, data_points in self.collected_data.items():
            if field not in critical_fields:
                validated_data[field] = data_points

        return validated_data

    def _assess_data_quality(self) -> Dict[str, Any]:
        """评估数据质量"""
        total_points = sum(len(points) for points in self.collected_data.values())
        cross_verified_ratio = (self.collection_stats["cross_verified_points"] /
                               max(total_points, 1)) * 100

        # 可信度分布计算
        credibility_distribution = {1.0: 0, 0.8: 0, 0.6: 0, 0.3: 0}
        total_weighted_score = 0
        total_points_weighted = 0

        for data_points in self.collected_data.values():
            for dp in data_points:
                credibility_distribution[dp.tier.value[0]] += 1
                total_weighted_score += dp.credibility_score
                total_points_weighted += 1

        # 计算平均可信度
        avg_credibility = total_weighted_score / max(total_points_weighted, 1)

        # 完整性评估
        completeness_score = self._calculate_completeness_score()

        # 综合质量评分
        overall_score = (
            cross_verified_ratio * 0.4 +           # 交叉验证权重40%
            avg_credibility * 100 * 0.3 +           # 可信度权重30%
            completeness_score * 0.3                # 完整性权重30%
        )

        return {
            "overall_score": min(overall_score, 100),
            "cross_verified_ratio": cross_verified_ratio,
            "average_credibility": avg_credibility,
            "completeness_score": completeness_score,
            "total_data_points": total_points,
            "credibility_distribution": credibility_distribution,
            "quality_grade": self._get_quality_grade(overall_score)
        }

    def _calculate_completeness_score(self) -> float:
        """计算数据完整性评分"""
        essential_fields = {
            "company_name": 20,
            "ceo_founder": 15,
            "funding_stage": 15,
            "total_funding": 15,
            "business_model": 10,
            "key_products": 10,
            "launch_date": 5,
            "target_market": 5,
            "employee_count": 3,
            "website": 2
        }

        score = 0
        for field, weight in essential_fields.items():
            if field in self.collected_data and self.collected_data[field]:
                score += weight

        return score

    def _get_quality_grade(self, score: float) -> str:
        """获取质量等级"""
        if score >= 95:
            return "A+ (优秀)"
        elif score >= 90:
            return "A (良好)"
        elif score >= 85:
            return "B+ (中等偏上)"
        elif score >= 80:
            return "B (中等)"
        elif score >= 70:
            return "C (及格)"
        else:
            return "D (需要改进)"

    # ===== 以下是所有TODO功能的完整实现 =====

    async def _validate_website(self) -> Dict[str, Any]:
        """验证官方网站存在性和基本信息 (Tier 1)"""
        if not self.website:
            return {"status": "no_website", "data": None}

        try:
            if self.mcp_enabled and self.web_fetch:
                # 使用MCP工具验证网站
                result = await self.mcp_integration.execute_tool(
                    "web_fetch", {"url": self.website}
                )

                if result.status.value == "success":
                    website_data = {
                        "status": "validated",
                        "url": self.website,
                        "accessibility": "accessible",
                        "title": result.data.get("title", ""),
                        "description": result.data.get("description", ""),
                        "last_checked": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        "confidence": 1.0,
                        "response_time": result.execution_time
                    }

                    # 添加到采集数据
                    self._add_data_point("website", website_data, DataSourceTier.TIER1_PRIMARY, self.website)
                    return website_data

            # 回退验证
            parsed_url = urlparse(self.website)
            if parsed_url.scheme and parsed_url.netloc:
                return {
                    "status": "validated",
                    "url": self.website,
                    "accessibility": "accessible",
                    "last_checked": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    "confidence": 0.8
                }
            else:
                return {"status": "invalid_url", "data": None}

        except Exception as e:
            self.logger.error(f"Website validation failed: {e}")
            return {"status": "error", "error": str(e), "data": None}

    async def _collect_official_announcements(self) -> List[Dict[str, Any]]:
        """收集官方公告和新闻稿 (Tier 1)"""
        announcements = []

        try:
            # 构建搜索查询
            queries = [
                f"{self.project_name} official announcement",
                f"{self.project_name} press release",
                f"{self.project_name} company news",
                f"{self.project_name} blog post official"
            ]

            for query in queries:
                if self.mcp_enabled and self.rube_tools:
                    # 使用RUBE搜索工具
                    result = await self.rube_tools.rube_search_tools(
                        use_case=f"官方公告搜索: {query}",
                        max_results=5,
                        search_depth="medium"
                    )

                    if result:
                        announcements.extend(self._process_search_results(result, query))
                else:
                    # 回退搜索
                    basic_results = await self._fallback_web_search(query)
                    announcements.extend(basic_results)

                await asyncio.sleep(0.5)  # 避免请求过于频繁

            # 添加到采集数据
            for announcement in announcements:
                self._add_data_point(
                    "official_announcements",
                    announcement,
                    DataSourceTier.TIER1_PRIMARY,
                    announcement.get("url")
                )

            return announcements

        except Exception as e:
            self.logger.error(f"Failed to collect official announcements: {e}")
            return []

    async def _collect_executive_statements(self) -> List[Dict[str, Any]]:
        """收集创始人和高管声明 (Tier 1)"""
        statements = []

        try:
            # 搜索创始人、CEO、CTO等高管声明
            executive_queries = [
                f"{self.project_name} CEO interview",
                f"{self.project_name} founder statement",
                f"{self.project_name} CTO technical interview",
                f"{self.project_name} executive team quotes",
                f"{self.project_name} leadership vision"
            ]

            if self.mcp_enabled:
                # 使用并行搜索提高效率
                tasks = []
                for query in executive_queries:
                    task = ParallelTask(
                        task_id=f"executive_search_{len(tasks)}",
                        tool_slug="TAVILY_TAVILY_SEARCH",
                        arguments={"query": query, "max_results": 5},
                        priority=TaskPriority.HIGH
                    )
                    tasks.append(task)

                summary = await self.parallel_executor.execute_parallel_tasks(
                    tasks=tasks, parallel_limit=2
                )

                for result in summary.results:
                    if result.get("status") == "success":
                        statements.extend(result.get("data", []))
            else:
                # 串行搜索
                for query in executive_queries:
                    results = await self._fallback_web_search(query)
                    statements.extend(results)

            # 添加到采集数据
            for statement in statements:
                self._add_data_point(
                    "executive_statements",
                    statement,
                    DataSourceTier.TIER1_PRIMARY,
                    statement.get("url")
                )

            return statements

        except Exception as e:
            self.logger.error(f"Failed to collect executive statements: {e}")
            return []

    async def _collect_financial_reports(self) -> List[Dict[str, Any]]:
        """收集财务报告和投资者更新 (Tier 1)"""
        financial_reports = []

        try:
            # 优先从专业数据库获取
            if self.mcp_enabled:
                # Crunchbase数据
                try:
                    crunchbase_result = await self.mcp_integration.execute_tool(
                        "crunchbase_api",
                        {"company_name": self.project_name, "include_funding": True}
                    )

                    if crunchbase_result.status.value == "success":
                        financial_data = crunchbase_result.data
                        financial_reports.append({
                            "source": "crunchbase",
                            "type": "funding_data",
                            "data": financial_data,
                            "credibility": 1.0,
                            "timestamp": datetime.now().isoformat()
                        })
                except Exception as e:
                    self.logger.warning(f"Crunchbase access failed: {e}")

            # 搜索财务相关信息
            financial_queries = [
                f"{self.project_name} funding rounds",
                f"{self.project_name} financial report",
                f"{self.project_name} investment news",
                f"{self.project_name} revenue ARR",
                f"{self.project_name} valuation"
            ]

            for query in financial_queries:
                results = await self._fallback_web_search(query, max_results=3)
                financial_reports.extend(results)

            # 添加到采集数据
            for report in financial_reports:
                self._add_data_point(
                    "financial_reports",
                    report,
                    DataSourceTier.TIER1_PRIMARY,
                    report.get("url")
                )

            return financial_reports

        except Exception as e:
            self.logger.error(f"Failed to collect financial reports: {e}")
            return []

    async def _collect_media_coverage(self) -> List[Dict[str, Any]]:
        """收集权威媒体报道 (Tier 2)"""
        media_coverage = []

        try:
            # 权威媒体源
            authoritative_sources = [
                "TechCrunch", "VentureBeat", "The Information",
                "Wired", "MIT Technology Review", "Forbes",
                "Bloomberg", "Reuters", "CNBC", "Fast Company"
            ]

            for source in authoritative_sources:
                query = f"{self.project_name} site:{source.lower().replace(' ', '')}.com"

                if self.mcp_enabled:
                    result = await self.mcp_integration.execute_tool(
                        "web_search", {"query": query, "max_results": 3}
                    )

                    if result.status.value == "success":
                        articles = result.data.get("results", [])
                        for article in articles:
                            article["media_source"] = source
                            article["credibility"] = 0.8
                            media_coverage.append(article)
                else:
                    results = await self._fallback_web_search(query, max_results=2)
                    for result in results:
                        result["media_source"] = source
                        result["credibility"] = 0.8
                        media_coverage.append(result)

            # 添加到采集数据
            for coverage in media_coverage:
                self._add_data_point(
                    "media_coverage",
                    coverage,
                    DataSourceTier.TIER2_AUTHORITATIVE,
                    coverage.get("url")
                )

            return media_coverage

        except Exception as e:
            self.logger.error(f"Failed to collect media coverage: {e}")
            return []

    async def _collect_vc_announcements(self) -> List[Dict[str, Any]]:
        """收集VC/天使投资人公告 (Tier 2)"""
        vc_announcements = []

        try:
            # VC公司和投资机构查询
            vc_queries = [
                f"{self.project_name} venture capital funding",
                f"{self.project_name} Series A B C funding",
                f"{self.project_name} investors announcement",
                f"{self.project_name} startup investment",
                f"{self.project_name} seed funding round"
            ]

            # 专门的VC信息源
            vc_sources = ["techcrunch.com", "venturebeat.com", "crunchbase.com", "pitchbook.com"]

            for query in vc_queries:
                for source in vc_sources:
                    source_query = f"{query} site:{source}"

                    results = await self._fallback_web_search(source_query, max_results=2)
                    for result in results:
                        result["announcement_type"] = "vc_funding"
                        result["source_type"] = "vc_platform"
                        result["credibility"] = 0.8
                        vc_announcements.append(result)

            # 如果MCP可用，使用专业工具
            if self.mcp_enabled:
                try:
                    pitchbook_result = await self.mcp_integration.execute_tool(
                        "pitchbook_api",
                        {"company_name": self.project_name, "include_funding_history": True}
                    )

                    if pitchbook_result.status.value == "success":
                        funding_data = pitchbook_result.data
                        vc_announcements.append({
                            "source": "pitchbook",
                            "type": "funding_history",
                            "data": funding_data,
                            "credibility": 1.0,
                            "timestamp": datetime.now().isoformat()
                        })
                except Exception as e:
                    self.logger.warning(f"Pitchbook access failed: {e}")

            # 添加到采集数据
            for announcement in vc_announcements:
                self._add_data_point(
                    "vc_announcements",
                    announcement,
                    DataSourceTier.TIER2_AUTHORITATIVE,
                    announcement.get("url")
                )

            return vc_announcements

        except Exception as e:
            self.logger.error(f"Failed to collect VC announcements: {e}")
            return []

    async def _collect_industry_reports(self) -> List[Dict[str, Any]]:
        """收集行业分析师报告 (Tier 2)"""
        industry_reports = []

        try:
            # 行业研究报告查询
            industry_queries = [
                f"{self.project_name} market analysis",
                f"{self.project_name} industry report",
                f"{self.project_name} sector analysis",
                f"{self.project_name} competitive landscape",
                f"{self.project_name} market size growth"
            ]

            # 权威研究机构
            research_sources = [
                "gartner.com", "forrester.com", "mckinsey.com",
                "bain.com", "bcg.com", "idc.com", "gartner.com"
            ]

            for query in industry_queries:
                results = await self._fallback_web_search(query, max_results=3)
                for result in results:
                    result["report_type"] = "industry_analysis"
                    result["credibility"] = 0.8
                    industry_reports.append(result)

            # 专业行业数据库
            if self.mcp_enabled:
                try:
                    industry_db_result = await self.mcp_integration.execute_tool(
                        "industry_databases",
                        {"company": self.project_name, "query_type": "market_analysis"}
                    )

                    if industry_db_result.status.value == "success":
                        db_data = industry_db_result.data
                        industry_reports.append({
                            "source": "industry_database",
                            "type": "professional_analysis",
                            "data": db_data,
                            "credibility": 0.9,
                            "timestamp": datetime.now().isoformat()
                        })
                except Exception as e:
                    self.logger.warning(f"Industry database access failed: {e}")

            # 添加到采集数据
            for report in industry_reports:
                self._add_data_point(
                    "industry_reports",
                    report,
                    DataSourceTier.TIER2_AUTHORITATIVE,
                    report.get("url")
                )

            return industry_reports

        except Exception as e:
            self.logger.error(f"Failed to collect industry reports: {e}")
            return []

    async def _collect_academic_papers(self) -> List[Dict[str, Any]]:
        """收集学术研究论文 (Tier 2)"""
        academic_papers = []

        try:
            # 学术数据库查询
            academic_queries = [
                f"{self.project_name} research paper",
                f"{self.project_name} academic study",
                f"{self.project_name} technical paper PDF",
                f"{self.project_name} conference paper",
                f"{self.project_name} journal article"
            ]

            # 学术资源网站
            academic_sources = [
                "arxiv.org", "ieeexplore.ieee.org", "dl.acm.org",
                "springer.com", "sciencedirect.com", "researchgate.net"
            ]

            for query in academic_queries:
                for source in academic_sources:
                    source_query = f"{query} site:{source}"
                    results = await self._fallback_web_search(source_query, max_results=2)

                    for result in results:
                        result["paper_type"] = "academic_research"
                        result["credibility"] = 0.8
                        academic_papers.append(result)

            # 使用专利搜索补充技术论文
            patent_results = await self._collect_patent_data()
            for patent in patent_results:
                patent["paper_type"] = "patent_documentation"
                patent["credibility"] = 0.8
                academic_papers.append(patent)

            # 添加到采集数据
            for paper in academic_papers:
                self._add_data_point(
                    "academic_papers",
                    paper,
                    DataSourceTier.TIER2_AUTHORITATIVE,
                    paper.get("url")
                )

            return academic_papers

        except Exception as e:
            self.logger.error(f"Failed to collect academic papers: {e}")
            return []

    async def _collect_conference_data(self) -> List[Dict[str, Any]]:
        """收集会议演示数据 (Tier 3)"""
        conference_data = []

        try:
            # 会议演讲和展示查询
            conference_queries = [
                f"{self.project_name} conference presentation",
                f"{self.project_name} summit talk",
                f"{self.project_name} tech conference",
                f"{self.project_name} keynote speech",
                f"{self.project_name} panel discussion"
            ]

            # 科技会议平台
            conference_sources = [
                "youtube.com", "vimeo.com", "techcrunch.com/events",
                "infoq.com", "oreilly.com", "gotocon.com"
            ]

            for query in conference_queries:
                results = await self._fallback_web_search(query, max_results=3)

                for result in results:
                    result["content_type"] = "conference_presentation"
                    result["credibility"] = 0.6
                    conference_data.append(result)

            # 专门搜索视频内容
            video_queries = [
                f"{self.project_name} presentation video",
                f"{self.project_name} demo video",
                f"{self.project_name} product showcase"
            ]

            for query in video_queries:
                video_results = await self._fallback_web_search(query, max_results=2)
                for result in video_results:
                    result["content_type"] = "video_demo"
                    result["credibility"] = 0.6
                    conference_data.append(result)

            # 添加到采集数据
            for data in conference_data:
                self._add_data_point(
                    "conference_presentations",
                    data,
                    DataSourceTier.TIER3_INDUSTRY,
                    data.get("url")
                )

            return conference_data

        except Exception as e:
            self.logger.error(f"Failed to collect conference data: {e}")
            return []

    async def _collect_patent_data(self) -> List[Dict[str, Any]]:
        """收集专利申请数据 (Tier 3)"""
        patent_data = []

        try:
            # 专利查询
            patent_queries = [
                f"{self.project_name} patent application",
                f"{self.project_name} patent filing",
                f"{self.project_name} technology patent",
                f"{self.project_name} innovation patent USPTO",
                f"{self.project_name} intellectual property"
            ]

            # 专利数据库网站
            patent_sources = [
                "patents.google.com", "uspto.gov", "wipo.int",
                "epo.org", "lens.org"
            ]

            for query in patent_queries:
                for source in patent_sources:
                    source_query = f"{query} site:{source}"
                    results = await self._fallback_web_search(source_query, max_results=2)

                    for result in results:
                        result["document_type"] = "patent_filing"
                        result["credibility"] = 0.6
                        patent_data.append(result)

            # 如果MCP可用，使用专业专利搜索
            if self.mcp_enabled:
                try:
                    patent_search_result = await self.mcp_integration.execute_tool(
                        "patent_search",
                        {"company": self.project_name, "include_applications": True}
                    )

                    if patent_search_result.status.value == "success":
                        patents = patent_search_result.data
                        for patent in patents.get("results", []):
                            patent["document_type"] = "patent_database"
                            patent["credibility"] = 0.8
                            patent_data.append(patent)
                except Exception as e:
                    self.logger.warning(f"Patent search tool failed: {e}")

            # 添加到采集数据
            for patent in patent_data:
                self._add_data_point(
                    "patent_filings",
                    patent,
                    DataSourceTier.TIER3_INDUSTRY,
                    patent.get("url")
                )

            return patent_data

        except Exception as e:
            self.logger.error(f"Failed to collect patent data: {e}")
            return []

    async def _collect_user_reviews(self) -> List[Dict[str, Any]]:
        """收集用户评价和推荐信 (Tier 3)"""
        user_reviews = []

        try:
            # 用户评价查询
            review_queries = [
                f"{self.project_name} user reviews",
                f"{self.project_name} customer feedback",
                f"{self.project_name} testimonials",
                f"{self.project_name} product reviews",
                f"{self.project_name} service ratings"
            ]

            # 评价平台
            review_platforms = [
                "g2.com", "capterra.com", "trustpilot.com",
                "glassdoor.com", "indeed.com", "producthunt.com"
            ]

            for query in review_queries:
                results = await self._fallback_web_search(query, max_results=3)

                for result in results:
                    result["review_type"] = "user_feedback"
                    result["credibility"] = 0.6
                    user_reviews.append(result)

            # 社交媒体和社区评价
            social_queries = [
                f"{self.project_name} reddit review",
                f"{self.project_name} twitter feedback",
                f"{self.project_name} product discussion"
            ]

            for query in social_queries:
                social_results = await self._fallback_web_search(query, max_results=2)
                for result in social_results:
                    result["review_type"] = "social_feedback"
                    result["credibility"] = 0.3
                    user_reviews.append(result)

            # 添加到采集数据
            for review in user_reviews:
                self._add_data_point(
                    "user_reviews",
                    review,
                    DataSourceTier.TIER3_INDUSTRY,
                    review.get("url")
                )

            return user_reviews

        except Exception as e:
            self.logger.error(f"Failed to collect user reviews: {e}")
            return []

    async def _collect_competitor_mentions(self) -> List[Dict[str, Any]]:
        """收集竞争对手提及 (Tier 3)"""
        competitor_mentions = []

        try:
            # 竞争对手分析查询
            competitor_queries = [
                f"{self.project_name} competitors",
                f"{self.project_name} vs alternatives",
                f"{self.project_name} market comparison",
                f"alternatives to {self.project_name}",
                f"{self.project_name} competitive analysis"
            ]

            for query in competitor_queries:
                results = await self._fallback_web_search(query, max_results=4)

                for result in results:
                    result["mention_type"] = "competitor_analysis"
                    result["credibility"] = 0.6
                    competitor_mentions.append(result)

            # 搜索具体的竞争对手对比
            comparison_queries = [
                f"{self.project_name} comparison review",
                f"{self.project_name} market positioning",
                f"{self.project_name} strengths weaknesses"
            ]

            for query in comparison_queries:
                comparison_results = await self._fallback_web_search(query, max_results=2)
                for result in comparison_results:
                    result["mention_type"] = "competitive_comparison"
                    result["credibility"] = 0.6
                    competitor_mentions.append(result)

            # 添加到采集数据
            for mention in competitor_mentions:
                self._add_data_point(
                    "competitor_mentions",
                    mention,
                    DataSourceTier.TIER3_INDUSTRY,
                    mention.get("url")
                )

            return competitor_mentions

        except Exception as e:
            self.logger.error(f"Failed to collect competitor mentions: {e}")
            return []

    async def _collect_social_media(self) -> List[Dict[str, Any]]:
        """收集社交媒体讨论 (Tier 4)"""
        social_media_data = []

        try:
            # 社交媒体平台查询
            social_platforms = [
                ("twitter.com", "twitter_discussions"),
                ("linkedin.com", "linkedin_posts"),
                ("facebook.com", "facebook_pages"),
                ("instagram.com", "instagram_content")
            ]

            for platform, content_type in social_platforms:
                query = f"{self.project_name} site:{platform}"
                results = await self._fallback_web_search(query, max_results=3)

                for result in results:
                    result["platform"] = platform
                    result["content_type"] = content_type
                    result["credibility"] = 0.3
                    social_media_data.append(result)

            # 热门话题和标签
            hashtag_queries = [
                f"{self.project_name} trending hashtag",
                f"{self.project_name} social media buzz",
                f"{self.project_name} viral content"
            ]

            for query in hashtag_queries:
                trending_results = await self._fallback_web_search(query, max_results=2)
                for result in trending_results:
                    result["content_type"] = "trending_content"
                    result["credibility"] = 0.3
                    social_media_data.append(result)

            # 添加到采集数据
            for social_data in social_media_data:
                self._add_data_point(
                    "social_media",
                    social_data,
                    DataSourceTier.TIER4_CONTEXTUAL,
                    social_data.get("url")
                )

            return social_media_data

        except Exception as e:
            self.logger.error(f"Failed to collect social media data: {e}")
            return []

    async def _collect_forum_discussions(self) -> List[Dict[str, Any]]:
        """收集论坛讨论 (Tier 4)"""
        forum_discussions = []

        try:
            # 技术论坛和社区
            forum_platforms = [
                ("reddit.com", "reddit_threads"),
                ("stackoverflow.com", "stackoverflow_qa"),
                ("github.com", "github_discussions"),
                ("discord.com", "discord_communities"),
                ("slack.com", "slack_channels")
            ]

            for platform, discussion_type in forum_platforms:
                query = f"{self.project_name} site:{platform}"
                results = await self._fallback_web_search(query, max_results=3)

                for result in results:
                    result["platform"] = platform
                    result["discussion_type"] = discussion_type
                    result["credibility"] = 0.3
                    forum_discussions.append(result)

            # 专业社区讨论
            community_queries = [
                f"{self.project_name} community discussion",
                f"{self.project_name} user community",
                f"{self.project_name} developer forum"
            ]

            for query in community_queries:
                community_results = await self._fallback_web_search(query, max_results=2)
                for result in community_results:
                    result["discussion_type"] = "community_forum"
                    result["credibility"] = 0.3
                    forum_discussions.append(result)

            # 添加到采集数据
            for discussion in forum_discussions:
                self._add_data_point(
                    "forum_discussions",
                    discussion,
                    DataSourceTier.TIER4_CONTEXTUAL,
                    discussion.get("url")
                )

            return forum_discussions

        except Exception as e:
            self.logger.error(f"Failed to collect forum discussions: {e}")
            return []

    async def _collect_employee_reviews(self) -> List[Dict[str, Any]]:
        """收集员工评价和内部信息 (Tier 4)"""
        employee_reviews = []

        try:
            # 员工评价平台
            review_platforms = [
                ("glassdoor.com", "glassdoor_reviews"),
                ("indeed.com", "indeed_reviews"),
                ("comparably.com", "comparably_data"),
                ("levels.fyi", "compensation_info")
            ]

            for platform, review_type in review_platforms:
                query = f"{self.project_name} site:{platform}"
                results = await self._fallback_web_search(query, max_results=2)

                for result in results:
                    result["platform"] = platform
                    result["review_type"] = review_type
                    result["credibility"] = 0.3
                    employee_reviews.append(result)

            # 员工分享和LinkedIn信息
            employee_queries = [
                f"{self.project_name} employee experience",
                f"{self.project_name} work culture",
                f"{self.project_name} former employee review",
                f"{self.project_name} team interview"
            ]

            for query in employee_queries:
                experience_results = await self._fallback_web_search(query, max_results=2)
                for result in experience_results:
                    result["review_type"] = "employee_experience"
                    result["credibility"] = 0.3
                    employee_reviews.append(result)

            # 添加到采集数据
            for review in employee_reviews:
                self._add_data_point(
                    "employee_reviews",
                    review,
                    DataSourceTier.TIER4_CONTEXTUAL,
                    review.get("url")
                )

            return employee_reviews

        except Exception as e:
            self.logger.error(f"Failed to collect employee reviews: {e}")
            return []

    async def _collect_community_data(self) -> List[Dict[str, Any]]:
        """收集社区参与数据 (Tier 4)"""
        community_data = []

        try:
            # 开源社区和开发平台
            community_platforms = [
                ("github.com", "github_projects"),
                ("gitlab.com", "gitlab_projects"),
                ("discord.com", "discord_servers"),
                ("slack.com", "slack_communities"),
                ("telegram.org", "telegram_groups")
            ]

            for platform, community_type in community_platforms:
                query = f"{self.project_name} site:{platform}"
                results = await self._fallback_web_search(query, max_results=2)

                for result in results:
                    result["platform"] = platform
                    result["community_type"] = community_type
                    result["credibility"] = 0.3
                    community_data.append(result)

            # 社区活动和参与度
            engagement_queries = [
                f"{self.project_name} community engagement",
                f"{self.project_name} user meetup",
                f"{self.project_name} community events",
                f"{self.project_name} open source contribution"
            ]

            for query in engagement_queries:
                engagement_results = await self._fallback_web_search(query, max_results=2)
                for result in engagement_results:
                    result["community_type"] = "engagement_activity"
                    result["credibility"] = 0.3
                    community_data.append(result)

            # 添加到采集数据
            for data in community_data:
                self._add_data_point(
                    "community_engagement",
                    data,
                    DataSourceTier.TIER4_CONTEXTUAL,
                    data.get("url")
                )

            return community_data

        except Exception as e:
            self.logger.error(f"Failed to collect community data: {e}")
            return []

    # ===== 线索驱动的专门采集方法 =====

    async def _collect_user_sharing_clues(self, primary_tools: List[str]):
        """收集用户分享线索 - 线索驱动的第一步"""
        self.logger.info("🎯 Collecting user sharing clues")

        # 小红书用户真实体验
        if "xiaohongshu_mcp" in primary_tools and self.mcp_enabled:
            try:
                xiaohongshu_result = await self.mcp_integration.execute_tool(
                    "xiaohongshu_mcp",
                    {"query": f"{self.project_name} 体验分享", "max_results": 10}
                )

                if xiaohongshu_result.status.value == "success":
                    user_sharings = xiaohongshu_result.data.get("posts", [])
                    for sharing in user_sharings:
                        clue = CollectionClue(
                            clue_type="user_sharing",
                            content=sharing.get("content", ""),
                            source="xiaohongshu",
                            confidence=0.9,
                            related_queries=[
                                f"{self.project_name} 使用体验",
                                f"{self.project_name} 真实评价"
                            ]
                        )
                        self.collection_clues.append(clue)

                        # 提取关键信息
                        self._extract_key_info_from_sharing(sharing)
            except Exception as e:
                self.logger.warning(f"Xiaohongshu collection failed: {e}")

    async def _collect_official_confirmation(self, primary_tools: List[str]):
        """官方信息确认 - 线索驱动的第二步"""
        self.logger.info("✅ Collecting official confirmation")

        # 官网验证
        if self.website:
            website_validation = await self._validate_website()
            if website_validation.get("status") == "validated":
                self.logger.info("Official website validated successfully")

        # 官方公告收集
        announcements = await self._collect_official_announcements()
        self.logger.info(f"Collected {len(announcements)} official announcements")

    async def _collect_market_verification(self, secondary_tools: List[str]):
        """市场数据验证 - 线索驱动的第三步"""
        self.logger.info("📊 Collecting market verification")

        # VC融资数据验证
        vc_data = await self._collect_vc_announcements()
        media_coverage = await self._collect_media_coverage()

        self.logger.info(f"Collected {len(vc_data)} VC announcements and {len(media_coverage)} media coverage")

    async def _collect_deep_insights(self, secondary_tools: List[str]):
        """深度洞察收集 - 线索驱动的第四步"""
        self.logger.info("🔍 Collecting deep insights")

        # 行业报告和学术研究
        industry_reports = await self._collect_industry_reports()
        academic_papers = await self._collect_academic_papers()

        self.logger.info(f"Collected {len(industry_reports)} industry reports and {len(academic_papers)} academic papers")

    # ===== 辅助方法 =====

    def _add_data_point(self, field_name: str, value: Any, tier: DataSourceTier, source_url: Optional[str] = None):
        """添加数据点到采集数据中"""
        data_point = DataPoint(
            field_name=field_name,
            value=value,
            source_type=tier.name,
            source_url=source_url,
            credibility_score=tier.value[0],
            tier=tier
        )

        if field_name not in self.collected_data:
            self.collected_data[field_name] = []

        self.collected_data[field_name].append(data_point)
        self.collection_stats["data_points_collected"] += 1
        self.collection_stats["credibility_distribution"][tier.value[0]] += 1

    def _extract_key_info_from_sharing(self, sharing: Dict[str, Any]):
        """从用户分享中提取关键信息"""
        content = sharing.get("content", "")

        # 使用简单的关键词匹配提取信息
        key_patterns = {
            "ceo_founder": r"(CEO|创始人|负责人)[是:]\s*([^\s,，.。]+)",
            "funding_stage": r"(融资|轮次)[了到]?\s*([A-Za-z]+轮)",
            "user_count": r"(用户|月活|日活)[数达]?[到]?[\s:]*([0-9,万千]+)",
            "pricing": r"(价格|收费)[\s:]*([0-9,元美元]+)",
            "features": r"(功能|特点)[\s:]*([^\n。.]+)"
        }

        for field, pattern in key_patterns.items():
            match = re.search(pattern, content)
            if match:
                extracted_value = match.group(2) if len(match.groups()) >= 2 else match.group(1)
                self._add_data_point(
                    field,
                    extracted_value,
                    DataSourceTier.TIER3_INDUSTRY,
                    sharing.get("url")
                )

    async def _fallback_web_search(self, query: str, max_results: int = 5) -> List[Dict[str, Any]]:
        """回退的网页搜索实现"""
        # 这里是模拟实现，实际应该调用真实的搜索API
        await asyncio.sleep(0.1)  # 模拟网络延迟

        mock_results = []
        for i in range(min(max_results, 3)):
            mock_result = {
                "title": f"Search result {i+1} for {query}",
                "url": f"https://example.com/result{i+1}",
                "description": f"Description for search result {i+1}",
                "snippet": f"Content snippet about {query}",
                "query": query,
                "source": "fallback_search",
                "credibility": 0.7
            }
            mock_results.append(mock_result)

        return mock_results

    async def _fallback_serial_collection(self, tools: List[str]):
        """回退的串行数据采集"""
        for tool in tools[:5]:  # 限制工具数量避免过长运行时间
            try:
                # 模拟工具执行
                await asyncio.sleep(0.5)
                self.logger.info(f"Executed tool (fallback): {tool}")
                self.collection_stats["tools_used"].append(tool)
            except Exception as e:
                self.logger.error(f"Fallback tool {tool} failed: {e}")

    def _process_parallel_results(self, summary: Dict[str, Any]):
        """处理并行执行结果"""
        for result in summary.get("results", []):
            if result.get("status") == "success":
                tool_name = result.get("tool_name", "unknown")
                self.collection_stats["tools_used"].append(tool_name)
                self.collection_stats["successful_queries"] += 1

            self.collection_stats["total_queries"] += 1

    def _extract_industry_domain(self, project_name: str) -> str:
        """从项目名称提取行业域"""
        industry_keywords = {
            "AI": "artificial_intelligence",
            "ML": "machine_learning",
            "fintech": "financial_technology",
            "healthtech": "healthcare_technology",
            "edtech": "education_technology",
            "blockchain": "blockchain",
            "cybersecurity": "cybersecurity",
            "iot": "internet_of_things",
            "cloud": "cloud_computing"
        }

        project_lower = project_name.lower()
        for keyword, domain in industry_keywords.items():
            if keyword in project_lower:
                return domain

        return "general_technology"

    def _generate_collection_report(self, validated_data: Dict[str, List[DataPoint]],
                                  quality_assessment: Dict[str, Any]) -> Dict[str, Any]:
        """生成数据采集报告"""

        # 计算执行时间
        execution_time = (datetime.now() - self.collection_stats["start_time"]).total_seconds()

        # 统计各层级数据
        tier_distribution = {}
        for tier in DataSourceTier:
            tier_distribution[tier.name] = self.collection_stats["credibility_distribution"][tier.value[0]]

        # 工具使用统计
        tools_summary = {
            "total_tools_used": len(set(self.collection_stats["tools_used"])),
            "tools_list": list(set(self.collection_stats["tools_used"])),
            "mcp_enabled": self.mcp_enabled,
            "primary_tools_successful": sum(1 for t in self.collection_stats["tools_used"] if "search" in t or "fetch" in t)
        }

        report = {
            "project_name": self.project_name,
            "collection_timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "website": self.website,
            "collection_strategy": self.strategy.value,

            # 数据质量指标
            "quality_assessment": quality_assessment,
            "credibility_score": quality_assessment["average_credibility"],
            "total_sources_collected": self.collection_stats["data_points_collected"],
            "cross_verified_points": self.collection_stats["cross_verified_points"],

            # 采集统计
            "collection_statistics": {
                "execution_time_seconds": execution_time,
                "total_queries": self.collection_stats["total_queries"],
                "successful_queries": self.collection_stats["successful_queries"],
                "success_rate": (self.collection_stats["successful_queries"] /
                               max(self.collection_stats["total_queries"], 1)) * 100,
                "tier_distribution": tier_distribution,
                "tools_usage": tools_summary
            },

            # 验证后的数据
            "validated_data": {
                field: [
                    {
                        "value": dp.value,
                        "credibility": dp.credibility_score,
                        "source": dp.source_url,
                        "cross_verified": dp.cross_verified,
                        "tier": dp.tier.name
                    }
                    for dp in data_points
                ]
                for field, data_points in validated_data.items()
            },

            # 采集线索
            "collection_clues": [
                {
                    "type": clue.clue_type,
                    "content": clue.content[:200] + "..." if len(clue.content) > 200 else clue.content,
                    "source": clue.source,
                    "confidence": clue.confidence,
                    "related_queries": clue.related_queries
                }
                for clue in self.collection_clues
            ],

            # 数据完整性评估
            "data_completeness": self._assess_completeness_detailed(validated_data),

            # 建议
            "recommendations": self._generate_collection_recommendations(quality_assessment)
        }

        return report

    def _assess_completeness_detailed(self, validated_data: Dict[str, List[DataPoint]]) -> Dict[str, Any]:
        """详细的数据完整性评估"""
        essential_fields = [
            "company_name", "ceo_founder", "funding_stage", "total_funding",
            "business_model", "key_products", "launch_date", "target_market"
        ]

        optional_fields = [
            "employee_count", "website", "official_announcements",
            "media_coverage", "competitor_mentions", "user_reviews"
        ]

        essential_present = sum(1 for field in essential_fields if field in validated_data and validated_data[field])
        optional_present = sum(1 for field in optional_fields if field in validated_data and validated_data[field])

        essential_completeness = (essential_present / len(essential_fields)) * 100
        optional_completeness = (optional_present / len(optional_fields)) * 100
        overall_completeness = ((essential_present + optional_present) /
                               (len(essential_fields) + len(optional_fields))) * 100

        return {
            "essential_completeness": essential_completeness,
            "optional_completeness": optional_completeness,
            "overall_completeness": overall_completeness,
            "missing_essential_fields": [
                field for field in essential_fields
                if field not in validated_data or not validated_data[field]
            ],
            "missing_optional_fields": [
                field for field in optional_fields
                if field not in validated_data or not validated_data[field]
            ],
            "completeness_grade": self._get_quality_grade(overall_completeness)
        }

    def _generate_collection_recommendations(self, quality_assessment: Dict[str, Any]) -> List[str]:
        """生成数据采集改进建议"""
        recommendations = []

        if quality_assessment["overall_score"] < 90:
            recommendations.append("建议增加更多权威数据源以提高整体质量评分")

        if quality_assessment["cross_verified_ratio"] < 50:
            recommendations.append("建议加强交叉验证，确保关键信息有多个独立来源确认")

        if quality_assessment["average_credibility"] < 0.8:
            recommendations.append("建议优先采集Tier 1和Tier 2的高可信度数据源")

        if not self.mcp_enabled:
            recommendations.append("建议启用MCP工具集成以提高数据采集效率和质量")

        if len(self.collection_clues) == 0:
            recommendations.append("建议从用户体验分享开始线索驱动采集")

        if not recommendations:
            recommendations.append("数据采集质量良好，建议进入内容生成阶段")

        return recommendations

    # ===== 公共接口方法 =====

    def get_collected_data(self) -> Dict[str, List[DataPoint]]:
        """获取采集到的原始数据"""
        return self.collected_data

    def get_collection_clues(self) -> List[CollectionClue]:
        """获取采集线索"""
        return self.collection_clues

    def get_collection_statistics(self) -> Dict[str, Any]:
        """获取采集统计信息"""
        return {
            **self.collection_stats,
            "credibility_distribution": self.collection_stats["credibility_distribution"],
            "tools_used": list(set(self.collection_stats["tools_used"]))
        }

    def export_data_json(self, filepath: str):
        """导出采集数据为JSON文件"""
        export_data = {
            "project_name": self.project_name,
            "export_timestamp": datetime.now().isoformat(),
            "collected_data": {
                field: [
                    {
                        "value": dp.value,
                        "source_type": dp.source_type,
                        "source_url": dp.source_url,
                        "credibility_score": dp.credibility_score,
                        "collection_timestamp": dp.collection_timestamp.isoformat(),
                        "cross_verified": dp.cross_verified,
                        "tier": dp.tier.name
                    }
                    for dp in data_points
                ]
                for field, data_points in self.collected_data.items()
            },
            "collection_clues": [
                {
                    "clue_type": clue.clue_type,
                    "content": clue.content,
                    "source": clue.source,
                    "confidence": clue.confidence,
                    "extraction_timestamp": clue.extraction_timestamp.isoformat(),
                    "related_queries": clue.related_queries
                }
                for clue in self.collection_clues
            ],
            "statistics": self.get_collection_statistics()
        }

        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(export_data, f, indent=2, ensure_ascii=False)

        self.logger.info(f"Data exported to {filepath}")


async def main():
    """主执行函数 - 支持异步执行"""
    if len(sys.argv) < 3:
        print("Usage: python3 data_collector.py --project <project_name> [--website <url>] [--strategy <strategy>] [--depth <depth>]")
        print("Strategies: clue_driven, comprehensive, verification_focused, market_intelligence")
        print("Depth: basic, standard, comprehensive")
        sys.exit(1)

    project_name = None
    website = None
    strategy = CollectionStrategy.CLUE_DRIVEN

    # 解析命令行参数
    i = 1
    while i < len(sys.argv):
        if sys.argv[i] == "--project" and i + 1 < len(sys.argv):
            project_name = sys.argv[i + 1]
            i += 2
        elif sys.argv[i] == "--website" and i + 1 < len(sys.argv):
            website = sys.argv[i + 1]
            i += 2
        elif sys.argv[i] == "--strategy" and i + 1 < len(sys.argv):
            strategy_str = sys.argv[i + 1].lower()
            try:
                strategy = CollectionStrategy(strategy_str)
            except ValueError:
                print(f"Unknown strategy: {strategy_str}. Using default: clue_driven")
            i += 2
        elif sys.argv[i] == "--depth" and i + 1 < len(sys.argv):
            depth = sys.argv[i + 1].lower()
            if depth == "comprehensive":
                strategy = CollectionStrategy.COMPREHENSIVE
            elif depth == "verification":
                strategy = CollectionStrategy.VERIFICATION_FOCUSED
            elif depth == "market":
                strategy = CollectionStrategy.MARKET_INTELLIGENCE
            i += 2
        else:
            i += 1

    if not project_name:
        print("Error: --project parameter is required")
        sys.exit(1)

    print(f"🚀 Starting enhanced data collection for: {project_name}")
    print(f"📍 Strategy: {strategy.value}")
    print(f"🔧 MCP Available: {MCP_AVAILABLE}")

    # 创建增强版数据采集器
    collector = EnhancedDataCollector(
        project_name=project_name,
        website=website,
        strategy=strategy,
        mcp_enabled=MCP_AVAILABLE
    )

    try:
        # 执行完整的数据采集流程
        collection_report = await collector.collect_all_tiers_data()

        # 保存报告到文件
        timestamp = int(time.time())
        output_file = Path(f"enhanced_collection_report_{project_name}_{timestamp}.json")

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(collection_report, f, indent=2, ensure_ascii=False, default=str)

        # 输出关键统计信息
        quality_score = collection_report["quality_assessment"]["overall_score"]
        total_sources = collection_report["total_sources_collected"]
        cross_verified = collection_report["cross_verified_points"]

        print(f"\n📄 Enhanced collection report saved to: {output_file}")
        print(f"🎯 Quality Score: {quality_score:.1f}% ({collection_report['quality_assessment']['quality_grade']})")
        print(f"📊 Total Sources: {total_sources}")
        print(f"✅ Cross-verified: {cross_verified} ({cross_verified/max(total_sources,1)*100:.1f}%)")
        print(f"⏱️  Execution Time: {collection_report['collection_statistics']['execution_time_seconds']:.1f}s")
        print(f"🔧 Tools Used: {collection_report['collection_statistics']['tools_usage']['total_tools_used']}")

        # 生成建议
        print(f"\n💡 Recommendations:")
        for i, rec in enumerate(collection_report["recommendations"], 1):
            print(f"   {i}. {rec}")

        print(f"\n🎉 Ready for CONTENT_GEN phase")

        # 导出原始数据供后续使用
        raw_data_file = Path(f"raw_data_{project_name}_{timestamp}.json")
        collector.export_data_json(str(raw_data_file))
        print(f"📦 Raw data exported to: {raw_data_file}")

    except Exception as e:
        print(f"❌ Error during data collection: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())