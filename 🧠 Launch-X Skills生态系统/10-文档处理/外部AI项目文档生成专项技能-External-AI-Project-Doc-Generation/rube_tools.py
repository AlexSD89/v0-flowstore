"""
RUBE专用工具封装模块
===================

基于AI项目档案管理工作流v2.4-完整版中的RUBE MCP集成要求，
提供RUBE专用工具的高级封装和便捷接口。

Author: LaunchX Claude Team
Version: 1.0.0
Created: 2025-01-18
"""

import asyncio
import json
import logging
from typing import Dict, List, Any, Optional, Union, Tuple
from dataclasses import dataclass, asdict
from datetime import datetime
import uuid

from mcp_integration import get_mcp_integration, MCPIntegrationCore


@dataclass
class RUBESearchConfig:
    """RUBE搜索配置"""
    use_case: str
    max_results: int = 20
    search_depth: str = "medium"  # shallow, medium, deep
    session_id: Optional[str] = None
    generate_session_id: bool = True
    filters: Optional[Dict[str, Any]] = None


@dataclass
class RUBEToolConfig:
    """RUBE工具执行配置"""
    tool_slug: str
    arguments: Dict[str, Any]
    priority: int = 1
    timeout: Optional[int] = None


@dataclass
class RUBEMultiExecuteConfig:
    """RUBE并行执行配置"""
    tools: List[RUBEToolConfig]
    session_id: Optional[str] = None
    memory: Optional[Dict[str, Any]] = None
    parallel_limit: int = 3
    continue_on_error: bool = True


@dataclass
class RUBEWorkbenchConfig:
    """RUBE远程工作台配置"""
    session_id: str
    code_to_execute: str
    thought_process: Optional[str] = None
    analysis_type: str = "analysis"  # sorting, analysis, insights
    data_context: Optional[Dict[str, Any]] = None


@dataclass
class RUBESearchResult:
    """RUBE搜索结果"""
    session_id: str
    available_tools: List[str]
    tool_count: int
    search_capabilities: List[str]
    metadata: Dict[str, Any]
    timestamp: datetime


@dataclass
class RUBEMultiExecuteResult:
    """RUBE并行执行结果"""
    session_id: str
    total_tools: int
    successful_executions: int
    failed_executions: int
    execution_results: List[Dict[str, Any]]
    aggregated_data: Dict[str, Any]
    execution_time: float
    timestamp: datetime


@dataclass
class RUBEWorkbenchResult:
    """RUBE工作台执行结果"""
    session_id: str
    analysis_result: str
    insights: List[str]
    data_quality_score: float
    recommendations: List[str]
    processed_data: Dict[str, Any]
    execution_time: float
    timestamp: datetime


class RUBEToolsManager:
    """RUBE工具管理器"""

    def __init__(self, mcp_integration: Optional[MCPIntegrationCore] = None):
        """
        初始化RUBE工具管理器

        Args:
            mcp_integration: MCP集成实例，如果为None则使用全局实例
        """
        self.mcp = mcp_integration or get_mcp_integration()
        self.logger = self._setup_logger()

    def _setup_logger(self) -> logging.Logger:
        """设置日志记录器"""
        logger = logging.getLogger("RUBETools")
        logger.setLevel(logging.INFO)

        if not logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            )
            handler.setFormatter(formatter)
            logger.addHandler(handler)

        return logger

    async def rube_search_tools(
        self,
        use_case: str,
        max_results: int = 20,
        search_depth: str = "medium",
        session_id: Optional[str] = None,
        generate_session_id: bool = True,
        filters: Optional[Dict[str, Any]] = None
    ) -> RUBESearchResult:
        """
        RUBE_SEARCH_TOOLS - 智能搜索工具集成

        Args:
            use_case: 使用场景描述
            max_results: 最大结果数量
            search_depth: 搜索深度
            session_id: 会话ID
            generate_session_id: 是否生成新的会话ID
            filters: 搜索过滤器

        Returns:
            RUBESearchResult: 搜索结果
        """
        self.logger.info(f"RUBE搜索工具调用: use_case={use_case}")

        # 构建参数
        session = {}
        if session_id:
            session["id"] = session_id
        elif generate_session_id:
            session["generate_id"] = True

        parameters = {
            "use_case": use_case,
            "session": session,
            "max_results": max_results,
            "search_depth": search_depth
        }

        if filters:
            parameters["filters"] = filters

        # 执行MCP工具
        result = await self.mcp.execute_tool(
            tool_slug="RUBE_SEARCH_TOOLS",
            parameters=parameters,
            session_id=session_id
        )

        if result.status.value != "success":
            raise Exception(f"RUBE搜索工具执行失败: {result.error}")

        # 构建返回结果
        data = result.data or {}

        return RUBESearchResult(
            session_id=data.get("session_id", result.session_id),
            available_tools=data.get("available_tools", []),
            tool_count=data.get("tool_count", 0),
            search_capabilities=data.get("search_capabilities", []),
            metadata=data.get("metadata", {}),
            timestamp=result.timestamp
        )

    async def rube_multi_execute_tool(
        self,
        tools: List[RUBEToolConfig],
        session_id: Optional[str] = None,
        memory: Optional[Dict[str, Any]] = None,
        parallel_limit: int = 3,
        continue_on_error: bool = True
    ) -> RUBEMultiExecuteResult:
        """
        RUBE_MULTI_EXECUTE_TOOL - 并行工具执行集成

        Args:
            tools: 要执行的工具列表
            session_id: 会话ID
            memory: 内存数据
            parallel_limit: 并行限制
            continue_on_error: 遇到错误是否继续

        Returns:
            RUBEMultiExecuteResult: 并行执行结果
        """
        self.logger.info(f"RUBE并行执行工具调用: tools_count={len(tools)}")

        # 构建工具参数
        tools_parameters = []
        for tool in tools:
            tool_param = {
                "tool_slug": tool.tool_slug,
                "arguments": tool.arguments,
                "priority": tool.priority
            }
            if tool.timeout:
                tool_param["timeout"] = tool.timeout

            tools_parameters.append(tool_param)

        # 构建执行参数
        parameters = {
            "tools": tools_parameters,
            "session": {"id": session_id} if session_id else {},
            "memory": memory or {},
            "parallel_limit": parallel_limit,
            "continue_on_error": continue_on_error
        }

        # 执行MCP工具
        result = await self.mcp.execute_tool(
            tool_slug="RUBE_MULTI_EXECUTE_TOOL",
            parameters=parameters,
            session_id=session_id
        )

        if result.status.value != "success":
            raise Exception(f"RUBE并行执行工具失败: {result.error}")

        # 构建返回结果
        data = result.data or {}
        parallel_results = data.get("parallel_results", [])

        successful_count = len([
            r for r in parallel_results
            if r.get("status") == "success"
        ])
        failed_count = len(parallel_results) - successful_count

        return RUBEMultiExecuteResult(
            session_id=result.session_id,
            total_tools=len(tools),
            successful_executions=successful_count,
            failed_executions=failed_count,
            execution_results=parallel_results,
            aggregated_data=data.get("aggregated_data", {}),
            execution_time=result.execution_time,
            timestamp=result.timestamp
        )

    async def rube_remote_workbench(
        self,
        session_id: str,
        code_to_execute: str,
        thought_process: Optional[str] = None,
        analysis_type: str = "analysis",
        data_context: Optional[Dict[str, Any]] = None
    ) -> RUBEWorkbenchResult:
        """
        RUBE_REMOTE_WORKBENCH - 数据排序和分析集成

        Args:
            session_id: 会话ID
            code_to_execute: 要执行的代码
            thought_process: 思考过程描述
            analysis_type: 分析类型
            data_context: 数据上下文

        Returns:
            RUBEWorkbenchResult: 工作台执行结果
        """
        self.logger.info(f"RUBE远程工作台调用: session_id={session_id}, type={analysis_type}")

        # 构建执行参数
        parameters = {
            "session_id": session_id,
            "code_to_execute": code_to_execute,
            "analysis_type": analysis_type
        }

        if thought_process:
            parameters["thought_process"] = thought_process

        if data_context:
            parameters["data_context"] = data_context

        # 执行MCP工具
        result = await self.mcp.execute_tool(
            tool_slug="RUBE_REMOTE_WORKBENCH",
            parameters=parameters,
            session_id=session_id
        )

        if result.status.value != "success":
            raise Exception(f"RUBE远程工作台执行失败: {result.error}")

        # 构建返回结果
        data = result.data or {}

        return RUBEWorkbenchResult(
            session_id=session_id,
            analysis_result=data.get("analysis_result", ""),
            insights=data.get("insights_generated", []),
            data_quality_score=data.get("data_quality_score", 0.0),
            recommendations=data.get("recommendations", []),
            processed_data=data.get("processed_data", {}),
            execution_time=result.execution_time,
            timestamp=result.timestamp
        )

    async def execute_project_analysis_workflow(
        self,
        project_name: str,
        analysis_depth: str = "comprehensive"
    ) -> Dict[str, Any]:
        """
        执行完整的项目分析工作流

        Args:
            project_name: 项目名称
            analysis_depth: 分析深度 (basic, standard, comprehensive)

        Returns:
            Dict: 完整的工作流执行结果
        """
        self.logger.info(f"开始执行项目分析工作流: project={project_name}, depth={analysis_depth}")

        workflow_result = {
            "project_name": project_name,
            "analysis_depth": analysis_depth,
            "start_time": datetime.now(),
            "steps": {},
            "final_result": None
        }

        try:
            # Step 1: 搜索可用工具
            self.logger.info("Step 1: 搜索可用工具")
            search_result = await self.rube_search_tools(
                use_case=f"AI项目{project_name}深度分析",
                search_depth="deep" if analysis_depth == "comprehensive" else "medium"
            )
            workflow_result["steps"]["search_tools"] = asdict(search_result)

            # Step 2: 并行执行数据采集
            self.logger.info("Step 2: 并行数据采集")
            tools_to_execute = [
                RUBEToolConfig(
                    tool_slug="TAVILY_TAVILY_SEARCH",
                    arguments={"query": f"{project_name} AI workflow", "max_results": 15}
                ),
                RUBEToolConfig(
                    tool_slug="FIRECRAWL_SEARCH",
                    arguments={"query": f"{project_name} technical documentation", "limit": 10}
                ),
                RUBEToolConfig(
                    tool_slug="GITHUB_SEARCH_REPOSITORIES",
                    arguments={"query": f"{project_name} automation", "language": "python"}
                )
            ]

            if analysis_depth == "comprehensive":
                tools_to_execute.extend([
                    RUBEToolConfig(
                        tool_slug="CONTEXT7_ANALYSIS",
                        arguments={"topic": project_name, "depth": "deep"}
                    ),
                    RUBEToolConfig(
                        tool_slug="INDUSTRY_DATABASES",
                        arguments={"company": project_name, "include_financials": True}
                    )
                ])

            multi_execute_result = await self.rube_multi_execute_tool(
                tools=tools_to_execute,
                session_id=search_result.session_id,
                parallel_limit=3 if analysis_depth == "comprehensive" else 2
            )
            workflow_result["steps"]["data_collection"] = asdict(multi_execute_result)

            # Step 3: 数据排序和分析
            self.logger.info("Step 3: 数据排序和分析")
            analysis_code = f"""
# 对采集的数据按相关性、权威性、时效性排序
project_data = {json.dumps(multi_execute_result.aggregated_data, ensure_ascii=False, indent=2)}

# 提取关键洞察和趋势信号
key_insights = extract_insights_from_data(project_data)
trend_signals = analyze_trends(project_data)

# 生成数据质量评估报告
quality_report = assess_data_quality(project_data)

# 生成标准化项目档案
standard_report = generate_project_archive(project_data, key_insights, trend_signals)
"""

            workbench_result = await self.rube_remote_workbench(
                session_id=multi_execute_result.session_id,
                code_to_execute=analysis_code,
                thought_process=f"对多源数据进行智能排序和深度分析，生成{project_name}的标准化项目档案",
                analysis_type="analysis",
                data_context={"project_name": project_name, "analysis_depth": analysis_depth}
            )
            workflow_result["steps"]["data_analysis"] = asdict(workbench_result)

            # 最终结果
            workflow_result["final_result"] = {
                "status": "success",
                "data_quality_score": workbench_result.data_quality_score,
                "insights_count": len(workbench_result.insights),
                "recommendations_count": len(workbench_result.recommendations),
                "total_execution_time": (datetime.now() - workflow_result["start_time"]).total_seconds()
            }

        except Exception as e:
            self.logger.error(f"项目分析工作流执行失败: {str(e)}")
            workflow_result["final_result"] = {
                "status": "failed",
                "error": str(e),
                "total_execution_time": (datetime.now() - workflow_result["start_time"]).total_seconds()
            }

        workflow_result["end_time"] = datetime.now()
        return workflow_result

    async def get_tool_status(self) -> Dict[str, Any]:
        """获取RUBE工具状态"""
        available_tools = self.mcp.get_available_tools()
        rube_tools = [
            tool for tool in available_tools
            if tool.tool_slug.startswith("RUBE_")
        ]

        return {
            "total_rube_tools": len(rube_tools),
            "available_tools": [
                {
                    "slug": tool.tool_slug,
                    "name": tool.tool_name,
                    "description": tool.description,
                    "priority": tool.priority
                }
                for tool in rube_tools
            ],
            "integration_status": "healthy"
        }

    def export_session_data(self, session_id: str, output_path: str):
        """导出会话数据"""
        session = self.mcp.get_session(session_id)
        if not session:
            raise ValueError(f"Session {session_id} not found")

        session_history = self.mcp.get_session_history(session_id)

        export_data = {
            "session_info": asdict(session),
            "execution_history": [
                {
                    "tool_name": result.tool_name,
                    "status": result.status.value,
                    "data": result.data,
                    "error": result.error,
                    "execution_time": result.execution_time,
                    "timestamp": result.timestamp.isoformat()
                }
                for result in session_history
            ]
        }

        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(export_data, f, ensure_ascii=False, indent=2)

        self.logger.info(f"会话数据已导出到: {output_path}")


# 全局RUBE工具管理器实例
_rube_tools_manager: Optional[RUBEToolsManager] = None


def get_rube_tools() -> RUBEToolsManager:
    """获取全局RUBE工具管理器实例"""
    global _rube_tools_manager

    if _rube_tools_manager is None:
        _rube_tools_manager = RUBEToolsManager()

    return _rube_tools_manager


def init_rube_tools(mcp_integration: Optional[MCPIntegrationCore] = None) -> RUBEToolsManager:
    """初始化RUBE工具管理器"""
    global _rube_tools_manager
    _rube_tools_manager = RUBEToolsManager(mcp_integration)
    return _rube_tools_manager