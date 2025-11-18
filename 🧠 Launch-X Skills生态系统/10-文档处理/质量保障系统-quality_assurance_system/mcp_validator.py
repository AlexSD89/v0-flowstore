#!/usr/bin/env python3
"""
MCP验证器 (MCP Validator) - MCP_VALIDATION阶段实现
基于AI项目档案管理工作流v2.4-完整版的独立MCP工具验证体系

核心功能:
- 独立MCP工具验证
- RUBE验证流程
- 数据可信度重新评估
- 验证报告生成
"""

import json
import asyncio
import time
from typing import Dict, List, Tuple, Any, Optional, Union
from dataclasses import dataclass, asdict
from datetime import datetime
from enum import Enum
import re


class ValidationStatus(Enum):
    """验证状态枚举"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    TIMEOUT = "timeout"


@dataclass
class MCPValidationResult:
    """MCP验证结果数据类"""
    tool_name: str
    validation_type: str
    status: ValidationStatus
    success_rate: float
    data_points_verified: int
    inconsistencies_found: int
    credibility_adjustments: Dict[str, float]
    execution_time: float
    error_message: Optional[str] = None
    raw_response: Optional[Dict[str, Any]] = None


@dataclass
class MCPValidationReport:
    """MCP验证报告数据类"""
    project_name: str
    validation_timestamp: str
    overall_credibility_score: float
    credibility_change: float
    validation_results: List[MCPValidationResult]
    summary: Dict[str, Any]
    recommendations: List[str]


class MCPValidator:
    """MCP验证器 - MCP_VALIDATION阶段核心实现"""

    def __init__(self):
        self.available_mcp_tools = self._initialize_mcp_tools()
        self.validation_config = self._load_validation_config()
        self.credibility_weights = self._load_credibility_weights()

    def _initialize_mcp_tools(self) -> Dict[str, Dict[str, Any]]:
        """初始化可用的MCP工具"""
        return {
            "rube_search_tools": {
                "name": "RUBE Search Tools",
                "capabilities": ["search", "sort", "analyze"],
                "credibility_boost": 0.15,
                "verification_strength": 0.9
            },
            "xiaohongshu_mcp": {
                "name": "小红书MCP",
                "capabilities": ["user_experience", "product_feedback", "trend_analysis"],
                "credibility_boost": 0.10,
                "verification_strength": 0.7
            },
            "crunchbase_api": {
                "name": "Crunchbase API",
                "capabilities": ["funding_data", "company_info", "investor_data"],
                "credibility_boost": 0.20,
                "verification_strength": 0.95
            },
            "github_search": {
                "name": "GitHub Search",
                "capabilities": ["code_analysis", "repository_data", "tech_stack"],
                "credibility_boost": 0.12,
                "verification_strength": 0.8
            },
            "tavily_monitoring": {
                "name": "Tavily Monitoring",
                "capabilities": ["real_time_data", "news_monitoring", "market_intelligence"],
                "credibility_boost": 0.10,
                "verification_strength": 0.75
            },
            "web_search": {
                "name": "Web Search",
                "capabilities": ["general_search", "website_analysis", "content_extraction"],
                "credibility_boost": 0.05,
                "verification_strength": 0.6
            }
        }

    def _load_validation_config(self) -> Dict[str, Any]:
        """加载验证配置"""
        return {
            "timeout_seconds": 120,  # 每个工具超时时间
            "max_concurrent_tools": 3,  # 最大并发工具数
            "min_success_rate": 0.6,  # 最低成功率
            "credibility_threshold": 0.7,  # 可信度阈值
            "inconsistency_tolerance": 0.2,  # 不一致性容忍度
            "validation_categories": {
                "basic_info": ["rube_search_tools", "web_search", "crunchbase_api"],
                "funding_data": ["crunchbase_api", "rube_search_tools"],
                "technical_data": ["github_search", "web_search"],
                "user_feedback": ["xiaohongshu_mcp", "tavily_monitoring"],
                "market_data": ["tavily_monitoring", "rube_search_tools"]
            }
        }

    def _load_credibility_weights(self) -> Dict[str, float]:
        """加载可信度权重配置"""
        return {
            "official_source": 1.0,      # 官方来源
            "verified_database": 0.95,   # 验证数据库
            "professional_media": 0.85,  # 专业媒体
            "user_generated": 0.65,      # 用户生成内容
            "unverified": 0.3            # 未验证内容
        }

    async def run_independent_mcp_validation(self, project_name: str, content_data: Dict[str, Any]) -> MCPValidationReport:
        """
        执行独立MCP工具验证

        Args:
            project_name: 项目名称
            content_data: 内容数据

        Returns:
            MCPValidationReport: 完整的MCP验证报告
        """
        print("🔍 开始MCP_VALIDATION独立验证...")

        # 1. 选择合适的MCP工具组合
        selected_tools = self._select_validation_tools(content_data)
        print(f"  🛠️  选择了{len(selected_tools)}个验证工具")

        # 2. 并行执行验证
        validation_results = await self._execute_parallel_validation(project_name, selected_tools, content_data)

        # 3. 分析验证结果
        credibility_analysis = self._analyze_validation_results(validation_results, content_data)

        # 4. 生成验证报告
        report = self._generate_validation_report(project_name, validation_results, credibility_analysis)

        print(f"  📊 验证完成: {len(validation_results)}个工具")
        print(f"  🎯 整体可信度: {report.overall_credibility_score:.2f}")
        print(f"  📈 可信度变化: {report.credibility_change:+.2f}")

        return report

    def _select_validation_tools(self, content_data: Dict[str, Any]) -> List[str]:
        """智能选择验证工具"""
        selected_tools = []

        # 基于内容类别选择工具
        content_categories = self._analyze_content_categories(content_data)

        for category, tools in self.validation_config["validation_categories"].items():
            if category in content_categories:
                # 为每个类别选择1-2个最合适的工具
                category_tools = tools[:2]  # 选择前2个最相关的工具
                selected_tools.extend(category_tools)

        # 去重并限制工具数量
        selected_tools = list(set(selected_tools))
        if len(selected_tools) > self.validation_config["max_concurrent_tools"]:
            selected_tools = selected_tools[:self.validation_config["max_concurrent_tools"]]

        # 确保至少包含基础工具
        if "rube_search_tools" not in selected_tools:
            selected_tools.append("rube_search_tools")
        if "web_search" not in selected_tools and len(selected_tools) < self.validation_config["max_concurrent_tools"]:
            selected_tools.append("web_search")

        return selected_tools

    def _analyze_content_categories(self, content_data: Dict[str, Any]) -> List[str]:
        """分析内容类别"""
        categories = []

        content_text = str(content_data).lower()

        # 检查融资相关信息
        funding_keywords = ["融资", "轮次", "投资", "估值", "funding", "investment", "valuation"]
        if any(keyword in content_text for keyword in funding_keywords):
            categories.append("funding_data")

        # 检查技术相关信息
        tech_keywords = ["技术", "产品", "专利", "代码", "开发", "technology", "product", "patent", "code"]
        if any(keyword in content_text for keyword in tech_keywords):
            categories.append("technical_data")

        # 检查用户反馈信息
        user_keywords = ["用户", "客户", "反馈", "评价", "user", "customer", "feedback", "review"]
        if any(keyword in content_text for keyword in user_keywords):
            categories.append("user_feedback")

        # 检查市场信息
        market_keywords = ["市场", "竞争", "行业", "市场份额", "market", "competition", "industry"]
        if any(keyword in content_text for keyword in market_keywords):
            categories.append("market_data")

        # 默认包含基础信息
        categories.append("basic_info")

        return categories

    async def _execute_parallel_validation(self, project_name: str, tools: List[str], content_data: Dict[str, Any]) -> List[MCPValidationResult]:
        """并行执行验证任务"""
        tasks = []

        for tool_name in tools:
            task = self._execute_single_tool_validation(project_name, tool_name, content_data)
            tasks.append(task)

        # 等待所有任务完成
        results = await asyncio.gather(*tasks, return_exceptions=True)

        # 处理结果
        validation_results = []
        for i, result in enumerate(results):
            tool_name = tools[i]

            if isinstance(result, Exception):
                validation_results.append(MCPValidationResult(
                    tool_name=tool_name,
                    validation_type="error",
                    status=ValidationStatus.FAILED,
                    success_rate=0.0,
                    data_points_verified=0,
                    inconsistencies_found=0,
                    credibility_adjustments={},
                    execution_time=0.0,
                    error_message=str(result)
                ))
            else:
                validation_results.append(result)

        return validation_results

    async def _execute_single_tool_validation(self, project_name: str, tool_name: str, content_data: Dict[str, Any]) -> MCPValidationResult:
        """执行单个工具验证"""
        start_time = time.time()
        tool_config = self.available_mcp_tools.get(tool_name)

        if not tool_config:
            return MCPValidationResult(
                tool_name=tool_name,
                validation_type="error",
                status=ValidationStatus.FAILED,
                success_rate=0.0,
                data_points_verified=0,
                inconsistencies_found=0,
                credibility_adjustments={},
                execution_time=0.0,
                error_message=f"Unknown tool: {tool_name}"
            )

        try:
            print(f"    🔧 执行{tool_name}验证...")

            # 模拟MCP工具调用
            validation_result = await self._simulate_mcp_tool_call(project_name, tool_name, content_data)

            execution_time = time.time() - start_time

            return MCPValidationResult(
                tool_name=tool_name,
                validation_type=tool_config["capabilities"][0] if tool_config["capabilities"] else "general",
                status=ValidationStatus.COMPLETED,
                success_rate=validation_result["success_rate"],
                data_points_verified=validation_result["data_points_verified"],
                inconsistencies_found=validation_result["inconsistencies_found"],
                credibility_adjustments=validation_result["credibility_adjustments"],
                execution_time=execution_time,
                raw_response=validation_result
            )

        except asyncio.TimeoutError:
            execution_time = time.time() - start_time
            return MCPValidationResult(
                tool_name=tool_name,
                validation_type="timeout",
                status=ValidationStatus.TIMEOUT,
                success_rate=0.0,
                data_points_verified=0,
                inconsistencies_found=0,
                credibility_adjustments={},
                execution_time=execution_time,
                error_message="Tool execution timeout"
            )

        except Exception as e:
            execution_time = time.time() - start_time
            return MCPValidationResult(
                tool_name=tool_name,
                validation_type="error",
                status=ValidationStatus.FAILED,
                success_rate=0.0,
                data_points_verified=0,
                inconsistencies_found=0,
                credibility_adjustments={},
                execution_time=execution_time,
                error_message=str(e)
            )

    async def _simulate_mcp_tool_call(self, project_name: str, tool_name: str, content_data: Dict[str, Any]) -> Dict[str, Any]:
        """模拟MCP工具调用 (实际实现中替换为真实的MCP调用)"""
        # 模拟网络延迟
        await asyncio.sleep(0.5 + (hash(tool_name) % 3) * 0.3)

        # 根据工具类型生成不同的验证结果
        tool_config = self.available_mcp_tools.get(tool_name, {})
        verification_strength = tool_config.get("verification_strength", 0.7)

        # 模拟验证数据点
        data_points = {
            "rube_search_tools": 15,
            "crunchbase_api": 8,
            "github_search": 12,
            "xiaohongshu_mcp": 20,
            "tavily_monitoring": 18,
            "web_search": 25
        }

        # 模拟成功率 (基于工具强度)
        base_success_rate = verification_strength * 100
        success_rate = base_success_rate + (hash(project_name) % 20) - 10  # 添加随机性
        success_rate = max(60, min(95, success_rate))

        # 模拟不一致性发现
        inconsistencies = max(0, int((100 - success_rate) * 0.3))

        # 生成可信度调整
        credibility_adjustments = {}
        content_keys = ["basic_info", "funding_data", "technical_data", "market_data"]

        for key in content_keys:
            if key in str(content_data).lower():
                # 根据工具特性调整可信度
                adjustment = (success_rate - 80) * 0.01  # 成功率转换为可信度调整
                credibility_adjustments[key] = adjustment

        return {
            "success_rate": success_rate / 100,
            "data_points_verified": data_points.get(tool_name, 10),
            "inconsistencies_found": inconsistencies,
            "credibility_adjustments": credibility_adjustments,
            "verified_fields": self._generate_verified_fields(tool_name, content_data),
            "validation_details": {
                "tool_version": "1.0",
                "query_complexity": "medium",
                "data freshness": "recent"
            }
        }

    def _generate_verified_fields(self, tool_name: str, content_data: Dict[str, Any]) -> List[str]:
        """生成验证字段列表"""
        field_mapping = {
            "rube_search_tools": ["公司名称", "行业分类", "竞争对手", "市场地位"],
            "crunchbase_api": ["融资轮次", "融资金额", "投资方", "估值"],
            "github_search": ["技术栈", "开源项目", "开发活跃度", "技术团队"],
            "xiaohongshu_mcp": ["用户评价", "产品体验", "品牌认知", "市场反馈"],
            "tavily_monitoring": ["最新动态", "媒体报道", "行业趋势", "实时数据"],
            "web_search": ["官方网站", "公司简介", "产品信息", "联系方式"]
        }

        return field_mapping.get(tool_name, ["基础信息"])

    def _analyze_validation_results(self, validation_results: List[MCPValidationResult], content_data: Dict[str, Any]) -> Dict[str, Any]:
        """分析验证结果并重新评估可信度"""
        analysis = {
            "original_credibility": 0.8,  # 初始可信度
            "validated_credibility": 0.0,
            "credibility_change": 0.0,
            "conflicting_data": [],
            "high_confidence_data": [],
            "adjustments_by_category": {}
        }

        # 计算初始可信度 (基于内容本身的质量)
        analysis["original_credibility"] = self._calculate_initial_credibility(content_data)

        # 汇总验证结果
        total_success_rate = 0.0
        total_weight = 0.0
        credibility_changes = {}

        for result in validation_results:
            if result.status == ValidationStatus.COMPLETED:
                tool_config = self.available_mcp_tools.get(result.tool_name, {})
                weight = tool_config.get("verification_strength", 0.5)

                total_success_rate += result.success_rate * weight
                total_weight += weight

                # 收集可信度调整
                for category, adjustment in result.credibility_adjustments.items():
                    if category not in credibility_changes:
                        credibility_changes[category] = []
                    credibility_changes[category].append(adjustment)

                # 收集冲突数据
                if result.inconsistencies_found > 0:
                    analysis["conflicting_data"].append({
                        "tool": result.tool_name,
                        "inconsistencies": result.inconsistencies_found,
                        "details": result.raw_response.get("validation_details", {}) if result.raw_response else {}
                    })

        # 计算加权平均成功率
        if total_weight > 0:
            overall_success_rate = total_success_rate / total_weight
        else:
            overall_success_rate = 0.6  # 默认值

        # 计算各类别的平均可信度调整
        for category, adjustments in credibility_changes.items():
            avg_adjustment = sum(adjustments) / len(adjustments)
            analysis["adjustments_by_category"][category] = avg_adjustment

        # 计算验证后的可信度
        credibility_boost = overall_success_rate * 0.1  # 成功率转换为可信度提升
        analysis["validated_credibility"] = min(1.0, analysis["original_credibility"] + credibility_boost)
        analysis["credibility_change"] = analysis["validated_credibility"] - analysis["original_credibility"]

        # 识别高可信度数据
        for category, adjustment in analysis["adjustments_by_category"].items():
            if adjustment > 0.05:  # 正向调整超过5%
                analysis["high_confidence_data"].append(category)

        return analysis

    def _calculate_initial_credibility(self, content_data: Dict[str, Any]) -> float:
        """计算初始可信度"""
        base_credibility = 0.7  # 基础可信度

        # 根据内容特征调整
        content_text = str(content_data).lower()

        # 有具体数值提升可信度
        if re.search(r'\d+', content_text):
            base_credibility += 0.05

        # 有数据来源引用提升可信度
        source_indicators = ["来源:", "数据来源:", "source:", "官方网站", "官方公告"]
        if any(indicator in content_text for indicator in source_indicators):
            base_credibility += 0.1

        # 有时间信息提升可信度
        if re.search(r'\d{4}年|\d{1,2}月', content_text):
            base_credibility += 0.05

        return min(1.0, base_credibility)

    def _generate_validation_report(self, project_name: str, validation_results: List[MCPValidationResult], credibility_analysis: Dict[str, Any]) -> MCPValidationReport:
        """生成验证报告"""
        # 统计摘要
        successful_validations = [r for r in validation_results if r.status == ValidationStatus.COMPLETED]
        failed_validations = [r for r in validation_results if r.status == ValidationStatus.FAILED]
        timeout_validations = [r for r in validation_results if r.status == ValidationStatus.TIMEOUT]

        total_data_points = sum(r.data_points_verified for r in successful_validations)
        total_inconsistencies = sum(r.inconsistencies_found for r in successful_validations)
        total_execution_time = sum(r.execution_time for r in validation_results)

        # 生成建议
        recommendations = self._generate_validation_recommendations(validation_results, credibility_analysis)

        # 构建摘要
        summary = {
            "total_tools_executed": len(validation_results),
            "successful_tools": len(successful_validations),
            "failed_tools": len(failed_validations),
            "timeout_tools": len(timeout_validations),
            "total_data_points_verified": total_data_points,
            "total_inconsistencies_found": total_inconsistencies,
            "average_success_rate": sum(r.success_rate for r in successful_validations) / len(successful_validations) if successful_validations else 0.0,
            "total_execution_time": total_execution_time,
            "credibility_improvement": credibility_analysis["credibility_change"]
        }

        return MCPValidationReport(
            project_name=project_name,
            validation_timestamp=datetime.now().isoformat(),
            overall_credibility_score=credibility_analysis["validated_credibility"],
            credibility_change=credibility_analysis["credibility_change"],
            validation_results=validation_results,
            summary=summary,
            recommendations=recommendations
        )

    def _generate_validation_recommendations(self, validation_results: List[MCPValidationResult], credibility_analysis: Dict[str, Any]) -> List[str]:
        """生成验证建议"""
        recommendations = []

        # 基于验证结果的建议
        failed_tools = [r.tool_name for r in validation_results if r.status == ValidationStatus.FAILED]
        if failed_tools:
            recommendations.append(f"以下工具验证失败，建议检查数据源: {', '.join(failed_tools)}")

        # 基于不一致性的建议
        total_inconsistencies = sum(r.inconsistencies_found for r in validation_results)
        if total_inconsistencies > 5:
            recommendations.append(f"发现{total_inconsistencies}处数据不一致，建议重新核实相关数据")

        # 基于可信度变化的分析
        if credibility_analysis["credibility_change"] > 0.1:
            recommendations.append("MCP验证显著提升了数据可信度，建议继续使用此类验证方法")
        elif credibility_analysis["credibility_change"] < -0.05:
            recommendations.append("验证发现数据可信度下降，建议仔细审查数据来源")

        # 基于高可信度数据的建议
        if credibility_analysis["high_confidence_data"]:
            recommendations.append(f"以下类别数据可信度较高，可优先使用: {', '.join(credibility_analysis['high_confidence_data'])}")

        # 基于冲突数据的建议
        if credibility_analysis["conflicting_data"]:
            recommendations.append("发现数据冲突，建议采用多源交叉验证机制")

        # 通用建议
        if not recommendations:
            recommendations.append("验证结果良好，数据可信度符合预期")

        return recommendations

    def run_rube_validation_process(self, project_name: str, content: str) -> Dict[str, Any]:
        """
        执行RUBE验证流程

        Args:
            project_name: 项目名称
            content: 待验证内容

        Returns:
            Dict[str, Any]: RUBE验证结果
        """
        print("🔍 开始RUBE验证流程...")

        rube_result = {
            "validation_id": f"rube_{int(time.time())}",
            "project_name": project_name,
            "timestamp": datetime.now().isoformat(),
            "validation_steps": [],
            "credibility_assessment": {},
            "data_quality_score": 0.0,
            "verification_status": "completed"
        }

        # 步骤1: 搜索验证
        print("  🔍 步骤1: 搜索验证...")
        search_validation = self._perform_search_validation(project_name, content)
        rube_result["validation_steps"].append(search_validation)

        # 步骤2: 数据排序验证
        print("  📊 步骤2: 数据排序验证...")
        sorting_validation = self._perform_sorting_validation(content)
        rube_result["validation_steps"].append(sorting_validation)

        # 步骤3: 深度思考验证
        print("  🧠 步骤3: 深度思考验证...")
        thinking_validation = self._perform_thinking_validation(project_name, content)
        rube_result["validation_steps"].append(thinking_validation)

        # 步骤4: 综合评估
        print("  📈 步骤4: 综合评估...")
        assessment = self._perform_comprehensive_assessment(rube_result["validation_steps"])
        rube_result["credibility_assessment"] = assessment
        rube_result["data_quality_score"] = assessment["overall_score"]

        print(f"  ✅ RUBE验证完成，数据质量评分: {rube_result['data_quality_score']:.1f}/100")

        return rube_result

    def _perform_search_validation(self, project_name: str, content: str) -> Dict[str, Any]:
        """执行搜索验证"""
        # 模拟RUBE搜索验证
        content_keywords = self._extract_content_keywords(content)

        return {
            "step_name": "search_validation",
            "status": "completed",
            "keywords_verified": len(content_keywords),
            "search_confidence": 0.85,
            "external_sources_found": 12,
            "verification_details": {
                "keyword_coverage": 0.9,
                "source_diversity": 0.8,
                "recency_score": 0.85
            }
        }

    def _perform_sorting_validation(self, content: str) -> Dict[str, Any]:
        """执行数据排序验证"""
        # 模拟数据质量排序
        data_quality_metrics = {
            "completeness": 0.88,
            "accuracy": 0.85,
            "relevance": 0.92,
            "timeliness": 0.80
        }

        return {
            "step_name": "sorting_validation",
            "status": "completed",
            "quality_metrics": data_quality_metrics,
            "sort_confidence": sum(data_quality_metrics.values()) / len(data_quality_metrics),
            "verification_details": {
                "data_prioritization": "successful",
                "quality_distribution": "normal",
                "outlier_detection": "completed"
            }
        }

    def _perform_thinking_validation(self, project_name: str, content: str) -> Dict[str, Any]:
        """执行深度思考验证"""
        # 模拟RUBE深度思考验证
        thinking_analysis = {
            "logical_consistency": 0.87,
            "contextual_relevance": 0.90,
            "inference_quality": 0.83,
            "insight_generation": 0.85
        }

        return {
            "step_name": "thinking_validation",
            "status": "completed",
            "thinking_metrics": thinking_analysis,
            "thought_confidence": sum(thinking_analysis.values()) / len(thinking_analysis),
            "verification_details": {
                "reasoning_quality": "high",
                "context_understanding": "excellent",
                "inference_accuracy": "good"
            }
        }

    def _perform_comprehensive_assessment(self, validation_steps: List[Dict[str, Any]]) -> Dict[str, Any]:
        """执行综合评估"""
        # 收集各步骤的评分
        scores = []
        for step in validation_steps:
            if "confidence" in step:
                scores.append(step["confidence"])
            elif "sort_confidence" in step:
                scores.append(step["sort_confidence"])
            elif "thought_confidence" in step:
                scores.append(step["thought_confidence"])

        overall_score = sum(scores) / len(scores) * 100 if scores else 70.0

        return {
            "overall_score": overall_score,
            "confidence_level": "high" if overall_score >= 80 else "medium" if overall_score >= 60 else "low",
            "validation_completeness": 100.0,
            "data_trustworthiness": overall_score / 100,
            "assessment_details": {
                "steps_completed": len(validation_steps),
                "average_confidence": sum(scores) / len(scores) if scores else 0.0,
                "validation_robustness": "strong"
            }
        }

    def _extract_content_keywords(self, content: str) -> List[str]:
        """提取内容关键词"""
        # 简单的关键词提取
        words = re.findall(r'\b\w+\b', content.lower())

        # 过滤停用词和短词
        stop_words = {'the', 'is', 'at', 'which', 'on', '的', '是', '在', '和', '与', '或'}
        keywords = [word for word in words if len(word) > 2 and word not in stop_words]

        # 返回前20个最频繁的关键词
        from collections import Counter
        word_counts = Counter(keywords)
        return [word for word, count in word_counts.most_common(20)]

    def reevaluate_data_credibility(self, original_content: str, validation_results: List[MCPValidationResult]) -> Dict[str, Any]:
        """
        重新评估数据可信度

        Args:
            original_content: 原始内容
            validation_results: 验证结果

        Returns:
            Dict[str, Any]: 重新评估的可信度结果
        """
        print("🔄 重新评估数据可信度...")

        # 提取原始内容中的关键数据点
        data_points = self._extract_data_points(original_content)

        # 为每个数据点计算新的可信度
        credibility_results = {}

        for point_id, data_point in data_points.items():
            original_credibility = data_point.get("credibility", 0.7)

            # 基于验证结果调整可信度
            adjusted_credibility = self._adjust_credibility_with_validation(
                original_credibility, data_point, validation_results
            )

            credibility_results[point_id] = {
                "data_point": data_point,
                "original_credibility": original_credibility,
                "adjusted_credibility": adjusted_credibility,
                "credibility_change": adjusted_credibility - original_credibility,
                "validation_sources": self._get_validation_sources_for_point(data_point, validation_results)
            }

        # 计算整体可信度变化
        overall_original = sum(r["original_credibility"] for r in credibility_results.values()) / len(credibility_results)
        overall_adjusted = sum(r["adjusted_credibility"] for r in credibility_results.values()) / len(credibility_results)

        return {
            "individual_results": credibility_results,
            "overall_original_credibility": overall_original,
            "overall_adjusted_credibility": overall_adjusted,
            "overall_credibility_change": overall_adjusted - overall_original,
            "total_data_points": len(data_points),
            "upgraded_points": sum(1 for r in credibility_results.values() if r["credibility_change"] > 0),
            "downgraded_points": sum(1 for r in credibility_results.values() if r["credibility_change"] < 0)
        }

    def _extract_data_points(self, content: str) -> Dict[str, Dict[str, Any]]:
        """提取内容中的数据点"""
        data_points = {}

        # 提取数值型数据
        number_pattern = r'(\d+(?:\.\d+)?%?|\$?\d+(?:,\d{3})*(?:\.\d+)?[kMB]?)'
        numbers = re.findall(number_pattern, content)

        for i, number in enumerate(numbers):
            # 简单的上下文提取
            context_start = max(0, content.find(number) - 50)
            context_end = min(len(content), content.find(number) + len(number) + 50)
            context = content[context_start:context_end]

            data_points[f"number_{i}"] = {
                "value": number,
                "context": context.strip(),
                "type": "numeric",
                "credibility": 0.7  # 默认可信度
            }

        # 提取文本型数据
        text_patterns = [
            r'(?:CEO|创始人|负责人)[：:]?\s*([^\\n\\r]{2,20})',
            r'(?:总部地点|地址)[：:]?\s*([^\\n\\r]{2,30})',
            r'(?:最新轮次|融资阶段)[：:]?\s*([^\\n\\r]{2,20})'
        ]

        for pattern in text_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            for i, match in enumerate(matches):
                data_points[f"text_{pattern}_{i}"] = {
                    "value": match.strip(),
                    "context": pattern,
                    "type": "text",
                    "credibility": 0.7
                }

        return data_points

    def _adjust_credibility_with_validation(self, original_credibility: float, data_point: Dict[str, Any], validation_results: List[MCPValidationResult]) -> float:
        """基于验证结果调整可信度"""
        adjusted_credibility = original_credibility

        # 根据成功的验证调整可信度
        successful_validations = [r for r in validation_results if r.status == ValidationStatus.COMPLETED]

        for validation in successful_validations:
            tool_config = self.available_mcp_tools.get(validation.tool_name, {})
            credibility_boost = tool_config.get("credibility_boost", 0.0)

            # 根据验证成功率调整
            if validation.success_rate > 0.8:
                adjusted_credibility += credibility_boost * 0.8
            elif validation.success_rate > 0.6:
                adjusted_credibility += credibility_boost * 0.5

        # 根据不一致性发现调整可信度
        total_inconsistencies = sum(r.inconsistencies_found for r in successful_validations)
        if total_inconsistencies > 0:
            credibility_penalty = min(0.3, total_inconsistencies * 0.05)
            adjusted_credibility -= credibility_penalty

        # 确保可信度在合理范围内
        return max(0.1, min(1.0, adjusted_credibility))

    def _get_validation_sources_for_point(self, data_point: Dict[str, Any], validation_results: List[MCPValidationResult]) -> List[str]:
        """获取数据点的验证来源"""
        sources = []

        for validation in validation_results:
            if validation.status == ValidationStatus.COMPLETED:
                if validation.raw_response and "verified_fields" in validation.raw_response:
                    verified_fields = validation.raw_response["verified_fields"]

                    # 简单匹配检查
                    for field in verified_fields:
                        if field.lower() in data_point.get("context", "").lower():
                            sources.append(validation.tool_name)
                            break

        return list(set(sources))  # 去重

    def export_validation_report(self, report: MCPValidationReport, format: str = "json") -> str:
        """导出验证报告"""
        if format.lower() == "json":
            return json.dumps(asdict(report), indent=2, ensure_ascii=False)
        elif format.lower() == "markdown":
            return self._generate_markdown_report(report)
        else:
            raise ValueError(f"Unsupported format: {format}")

    def _generate_markdown_report(self, report: MCPValidationReport) -> str:
        """生成Markdown格式的验证报告"""
        md_lines = [
            f"# MCP验证报告 - {report.project_name}",
            f"",
            f"**验证时间**: {report.validation_timestamp}",
            f"**整体可信度评分**: {report.overall_credibility_score:.2f}/1.00",
            f"**可信度变化**: {report.credibility_change:+.2f}",
            f"",
            "## 验证摘要",
            f"- 执行工具数量: {report.summary['total_tools_executed']}",
            f"- 成功工具数量: {report.summary['successful_tools']}",
            f"- 验证数据点: {report.summary['total_data_points_verified']}",
            f"- 发现不一致: {report.summary['total_inconsistencies_found']}",
            f"- 平均成功率: {report.summary['average_success_rate']:.1%}",
            f"",
            "## 工具验证结果",
            ""
        ]

        for result in report.validation_results:
            status_icon = "✅" if result.status == ValidationStatus.COMPLETED else "❌"
            md_lines.extend([
                f"### {status_icon} {result.tool_name}",
                f"- **状态**: {result.status.value}",
                f"- **成功率**: {result.success_rate:.1%}",
                f"- **验证数据点**: {result.data_points_verified}",
                f"- **发现不一致**: {result.inconsistencies_found}",
                f"- **执行时间**: {result.execution_time:.1f}秒",
                f""
            ])

        md_lines.extend([
            "## 改进建议",
            ""
        ])

        for i, recommendation in enumerate(report.recommendations, 1):
            md_lines.append(f"{i}. {recommendation}")

        return "\n".join(md_lines)


async def main():
    """主函数 - 演示MCP验证器使用"""
    validator = MCPValidator()

    # 示例数据
    project_name = "SERVAL"
    sample_content_data = {
        "basic_info": {
            "company_name": "SERVAL",
            "founding_year": "2020",
            "headquarters": "北京"
        },
        "funding_data": {
            "latest_round": "A轮",
            "amount": "1000万美元",
            "valuation": "2亿美元"
        },
        "technical_data": {
            "main_product": "AI自动化平台",
            "tech_stack": "Python, React, AWS"
        }
    }

    # 执行独立MCP验证
    validation_report = await validator.run_independent_mcp_validation(project_name, sample_content_data)

    # 执行RUBE验证流程
    sample_content = "SERVAL是一家企业级AI自动化平台，成立于2020年，总部位于北京..."
    rube_result = validator.run_rube_validation_process(project_name, sample_content)

    # 重新评估数据可信度
    credibility_reevaluation = validator.reevaluate_data_credibility(sample_content, validation_report.validation_results)

    # 输出结果
    print("\n" + "="*60)
    print("MCP验证完成")
    print("="*60)
    print(f"整体可信度: {validation_report.overall_credibility_score:.2f}")
    print(f"可信度变化: {validation_report.credibility_change:+.2f}")
    print(f"RUBE验证评分: {rube_result['data_quality_score']:.1f}/100")
    print(f"重新评估可信度变化: {credibility_reevaluation['overall_credibility_change']:+.3f}")

    # 导出报告
    report_json = validator.export_validation_report(validation_report, "json")
    report_md = validator.export_validation_report(validation_report, "markdown")

    print(f"\n📄 已生成验证报告 (JSON: {len(report_json)} 字符, Markdown: {len(report_md)} 字符)")


if __name__ == "__main__":
    asyncio.run(main())