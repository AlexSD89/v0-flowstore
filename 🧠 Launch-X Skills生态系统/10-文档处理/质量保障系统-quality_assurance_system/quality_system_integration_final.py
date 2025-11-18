#!/usr/bin/env python3
"""
质量保障系统集成模块 - 三层质量验证体系核心实现
基于AI项目档案管理工作流v2.4-完整版的要求

DELIVER_CHECK → MCP_VALIDATION → CROSS_VALIDATION
"""

import asyncio
import json
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional, Any, Tuple
from enum import Enum

from quality_checker_fixed import QualityChecker, QualityMetrics
from mcp_validator import MCPValidator, MCPValidationResult
from cross_validator_fixed import CrossValidator, CrossValidationResult


class ValidationPhase(Enum):
    """验证阶段枚举"""
    DELIVER_CHECK = "deliver_check"
    MCP_VALIDATION = "mcp_validation"
    CROSS_VALIDATION = "cross_validation"


class SystemStatus(Enum):
    """系统执行状态"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    ERROR = "error"


@dataclass
class QualityThresholds:
    """质量阈值配置"""
    deliver_check_threshold: float = 85.0
    mcp_validation_threshold: float = 0.7
    cross_validation_min_grade: str = "B"
    overall_quality_threshold: float = 80.0


@dataclass
class QualitySystemConfiguration:
    """质量保障系统配置"""
    project_name: str
    content: str
    validation_sources: List[Dict[str, Any]]
    enable_deliver_check: bool = True
    enable_mcp_validation: bool = True
    enable_cross_validation: bool = True
    parallel_execution: bool = False
    quality_thresholds: QualityThresholds = field(default_factory=QualityThresholds)
    output_directory: str = "reports"
    save_intermediate_results: bool = True


@dataclass
class SystemExecutionResult:
    """系统执行结果"""
    project_name: str
    system_status: SystemStatus
    start_time: float
    end_time: float
    total_execution_time: float

    # 各阶段结果
    deliver_check_result: Optional[QualityMetrics] = None
    mcp_validation_result: Optional[MCPValidationResult] = None
    cross_validation_result: Optional[CrossValidationResult] = None

    # 整体质量评估
    overall_quality_grade: str = "N/A"
    overall_quality_score: float = 0.0

    # 执行统计
    phases_executed: List[str] = field(default_factory=list)
    successful_phases: int = 0
    failed_phases: List[str] = field(default_factory=list)

    # 建议和改进
    recommendations: List[str] = field(default_factory=list)

    # 系统统计
    execution_summary: Dict[str, Any] = field(default_factory=dict)


class QualityAssuranceSystem:
    """质量保障系统核心类"""

    def __init__(self):
        """初始化质量保障系统"""
        self.quality_checker = QualityChecker()
        self.mcp_validator = MCPValidator()
        self.cross_validator = CrossValidator()

        # 系统统计
        self.total_executions = 0
        self.successful_executions = 0
        self.execution_history = []

        # 日志记录
        self.logger = self._setup_logger()

    def _setup_logger(self):
        """设置日志记录器"""
        import logging

        logger = logging.getLogger("QualityAssuranceSystem")
        logger.setLevel(logging.INFO)

        # 避免重复添加处理器
        if not logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            )
            handler.setFormatter(formatter)
            logger.addHandler(handler)

        return logger

    async def execute_complete_quality_assurance(
        self,
        config: QualitySystemConfiguration
    ) -> SystemExecutionResult:
        """
        执行完整的三层质量验证体系

        Args:
            config: 系统配置

        Returns:
            SystemExecutionResult: 执行结果
        """
        print("🚀 启动完整三层质量验证体系...")
        print(f"📋 项目: {config.project_name}")
        print(f"🔍 启用阶段: DELIVER_CHECK={config.enable_deliver_check}, MCP_VALIDATION={config.enable_mcp_validation}, CROSS_VALIDATION={config.enable_cross_validation}")

        # 初始化执行结果
        result = SystemExecutionResult(
            project_name=config.project_name,
            system_status=SystemStatus.RUNNING,
            start_time=time.time(),
            end_time=0.0,
            total_execution_time=0.0
        )

        try:
            # 阶段1: DELIVER_CHECK - 质量检查
            if config.enable_deliver_check:
                result = await self._execute_deliver_check_phase(config, result)

            # 阶段2: MCP_VALIDATION - MCP验证
            if config.enable_mcp_validation:
                result = await self._execute_mcp_validation_phase(config, result)

            # 阶段3: CROSS_VALIDATION - 交叉验证
            if config.enable_cross_validation:
                result = await self._execute_cross_validation_phase(config, result)

            # 计算整体质量等级
            result = await self._calculate_overall_quality_assessment(config, result)

            # 生成综合建议
            result.recommendations = await self._generate_comprehensive_recommendations(config, result)

            # 保存综合报告
            if config.save_intermediate_results:
                report_path = await self._save_comprehensive_report(result)
                result.execution_summary["report_path"] = report_path

            # 更新系统状态
            result.system_status = SystemStatus.COMPLETED
            result.successful_phases = len(result.phases_executed) - len(result.failed_phases)

            print("🎉 质量保障系统执行完成!")
            print(f"⏱️  总执行时间: {result.total_execution_time:.1f}秒")
            print(f"⭐ 整体质量等级: {result.overall_quality_grade}")

        except Exception as e:
            self.logger.error(f"系统执行失败: {str(e)}")
            result.system_status = SystemStatus.ERROR
            result.failed_phases.append("system_error")
            result.recommendations = [f"❌ 系统执行失败: {str(e)}"]

        finally:
            result.end_time = time.time()
            result.total_execution_time = result.end_time - result.start_time

            # 更新系统统计
            self._update_system_statistics(result)

        return result

    async def _execute_deliver_check_phase(
        self,
        config: QualitySystemConfiguration,
        result: SystemExecutionResult
    ) -> SystemExecutionResult:
        """执行DELIVER_CHECK阶段"""
        print("\n" + "="*50)
        print("📋 阶段1: DELIVER_CHECK - 质量检查")
        print("="*50)

        try:
            # 执行质量检查
            check_result = self.quality_checker.run_deliver_check(config.content)
            result.deliver_check_result = check_result
            result.phases_executed.append("DELIVER_CHECK")

            # 检查是否通过阈值
            threshold = config.quality_thresholds.deliver_check_threshold
            passed = check_result.overall_score >= threshold

            if passed:
                print(f"✅ DELIVER_CHECK通过 - 质量评分: {check_result.overall_score:.1f}/100")
            else:
                print(f"❌ DELIVER_CHECK未通过 - 质量评分: {check_result.overall_score:.1f}/100 (需要≥{threshold})")
                result.failed_phases.append("DELIVER_CHECK")

        except Exception as e:
            self.logger.error(f"DELIVER_CHECK阶段失败: {str(e)}")
            result.failed_phases.append("DELIVER_CHECK")
            raise

        return result

    async def _execute_mcp_validation_phase(
        self,
        config: QualitySystemConfiguration,
        result: SystemExecutionResult
    ) -> SystemExecutionResult:
        """执行MCP_VALIDATION阶段"""
        print("\n" + "="*50)
        print("🔍 阶段2: MCP_VALIDATION - MCP验证")
        print("="*50)

        try:
            # 从内容中提取基础数据
            extracted_data = await self._extract_basic_data_from_content(config.content)

            # 执行MCP验证
            mcp_result = await self.mcp_validator.run_independent_mcp_validation(
                config.project_name,
                extracted_data
            )
            result.mcp_validation_result = mcp_result
            result.phases_executed.append("MCP_VALIDATION")

            # 检查是否通过阈值
            threshold = config.quality_thresholds.mcp_validation_threshold
            passed = mcp_result.overall_credibility_score >= threshold

            if passed:
                print(f"✅ MCP_VALIDATION完成 - 整体可信度: {mcp_result.overall_credibility_score:.3f}")
            else:
                print(f"❌ MCP_VALIDATION未通过 - 可信度: {mcp_result.overall_credibility_score:.3f} (需要≥{threshold})")
                result.failed_phases.append("MCP_VALIDATION")

        except Exception as e:
            self.logger.error(f"MCP_VALIDATION阶段失败: {str(e)}")
            result.failed_phases.append("MCP_VALIDATION")
            raise

        return result

    async def _execute_cross_validation_phase(
        self,
        config: QualitySystemConfiguration,
        result: SystemExecutionResult
    ) -> SystemExecutionResult:
        """执行CROSS_VALIDATION阶段"""
        print("\n" + "="*50)
        print("🔗 阶段3: CROSS_VALIDATION - 交叉验证")
        print("="*50)

        try:
            # 准备交叉验证数据
            quality_checker_results = {}
            mcp_validation_results = {}

            if result.deliver_check_result:
                quality_checker_results = {
                    "overall_score": result.deliver_check_result.overall_score,
                    "template_compliance": result.deliver_check_result.template_compliance,
                    "data_completeness": result.deliver_check_result.data_completeness,
                    "logical_consistency": result.deliver_check_result.logical_consistency,
                    "vi_zone_compliance": result.deliver_check_result.vi_zone_compliance
                }

            if result.mcp_validation_result:
                mcp_validation_results = {
                    "overall_credibility_score": result.mcp_validation_result.overall_credibility_score,
                    "credibility_change": result.mcp_validation_result.credibility_change
                }

            # 执行交叉验证
            cross_result = self.cross_validator.perform_comprehensive_cross_validation(
                project_name=config.project_name,
                content=config.content,
                validation_sources=config.validation_sources,
                quality_checker_results=quality_checker_results,
                mcp_validation_results=mcp_validation_results
            )
            result.cross_validation_result = cross_result
            result.phases_executed.append("CROSS_VALIDATION")

            # 检查是否达到最低等级要求
            min_grade = config.quality_thresholds.cross_validation_min_grade
            current_grade = cross_result["final_quality_rating"].overall_grade

            grade_priority = {"A+": 6, "A": 5, "B+": 4, "B": 3, "C": 2, "D": 1}
            min_priority = grade_priority.get(min_grade, 2)
            current_priority = grade_priority.get(current_grade, 1)

            if current_priority >= min_priority:
                print(f"✅ CROSS_VALIDATION完成 - 最终等级: {current_grade}")
            else:
                print(f"❌ CROSS_VALIDATION未达到要求 - 等级: {current_grade} (需要≥{min_grade})")
                result.failed_phases.append("CROSS_VALIDATION")

        except Exception as e:
            self.logger.error(f"CROSS_VALIDATION阶段失败: {str(e)}")
            result.failed_phases.append("CROSS_VALIDATION")
            raise

        return result

    async def _calculate_overall_quality_assessment(
        self,
        config: QualitySystemConfiguration,
        result: SystemExecutionResult
    ) -> SystemExecutionResult:
        """计算整体质量评估"""
        print("\n🎯 计算整体质量评估...")

        grades = []
        scores = []

        # 收集各阶段等级和分数
        if result.deliver_check_result:
            dc_score = result.deliver_check_result.overall_score
            scores.append(dc_score)
            if dc_score >= 95:
                grades.append("A+")
            elif dc_score >= 90:
                grades.append("A")
            elif dc_score >= 85:
                grades.append("B+")
            elif dc_score >= 80:
                grades.append("B")
            elif dc_score >= 70:
                grades.append("C")
            else:
                grades.append("D")

        if result.mcp_validation_result:
            mcp_score = result.mcp_validation_result.overall_credibility_score * 100
            scores.append(mcp_score)
            if mcp_score >= 95:
                grades.append("A+")
            elif mcp_score >= 90:
                grades.append("A")
            elif mcp_score >= 85:
                grades.append("B+")
            elif mcp_score >= 80:
                grades.append("B")
            elif mcp_score >= 70:
                grades.append("C")
            else:
                grades.append("D")

        if result.cross_validation_result:
            grade = result.cross_validation_result["final_quality_rating"].overall_grade
            grades.append(grade)

            # 将等级转换为分数进行计算
            grade_to_score = {
                "A+": 95, "A": 90, "B+": 85, "B": 80, "C": 70, "D": 60
            }
            scores.append(grade_to_score.get(grade, 60))

        # 计算整体等级（取最低等级）
        if grades:
            grade_priority = {"A+": 6, "A": 5, "B+": 4, "B": 3, "C": 2, "D": 1}
            min_grade = min(grades, key=lambda g: grade_priority.get(g, 0))
            result.overall_quality_grade = min_grade
        else:
            result.overall_quality_grade = "N/A"

        # 计算整体分数（平均分）
        if scores:
            result.overall_quality_score = sum(scores) / len(scores)
        else:
            result.overall_quality_score = 0.0

        print(f"📊 整体质量等级: {result.overall_quality_grade}")
        print(f"📈 整体质量分数: {result.overall_quality_score:.1f}/100")

        return result

    async def _generate_comprehensive_recommendations(
        self,
        config: QualitySystemConfiguration,
        result: SystemExecutionResult
    ) -> List[str]:
        """生成综合改进建议"""
        recommendations = []

        # 基于各阶段结果生成建议

        # DELIVER_CHECK建议
        if result.deliver_check_result:
            dc = result.deliver_check_result
            if dc.template_compliance < 100:
                recommendations.append("📋 模板对齐度未达100%，建议按照标准模板格式调整内容结构")

            if dc.data_completeness < 90:
                recommendations.append("📊 数据完整性不足90%，建议补充缺失的关键数据字段")

            if dc.logical_consistency < 100:
                recommendations.append("🧠 逻辑一致性存在问题，建议检查数据间的逻辑关系")

            if dc.vi_zone_compliance < 100:
                recommendations.append("🎯 VI区数据锚点不完整，建议按照A-G分区要求补充数据")

        # MCP_VALIDATION建议
        if result.mcp_validation_result:
            mcp = result.mcp_validation_result
            if mcp.overall_credibility_score < 0.8:
                recommendations.append("🔗 数据可信度偏低，建议通过更多权威源验证信息")

            if mcp.credibility_change < 0:
                recommendations.append("⚠️  验证后可信度下降，建议检查数据准确性")

        # CROSS_VALIDATION建议
        if result.cross_validation_result:
            cv = result.cross_validation_result
            stats = cv.get("validation_statistics", {})

            if stats.get("total_conflicts_detected", 0) > 0:
                resolved = stats.get("conflicts_resolved", 0)
                total = stats.get("total_conflicts_detected", 1)
                resolution_rate = resolved / total
                if resolution_rate < 0.8:
                    recommendations.append(f"🔄 冲突解决率较低({resolution_rate:.1%})，建议人工审核未解决冲突")

            if stats.get("conflicts_requiring_manual_review", 0) > 0:
                count = stats.get("conflicts_requiring_manual_review", 0)
                recommendations.append(f"👤 {count}个冲突需要人工审核")

        # 系统优化建议
        if result.total_execution_time > 300:  # 超过5分钟
            recommendations.append("⏱️  执行时间较长，建议考虑性能优化")

        # 添加各阶段的具体建议
        stage_recommendations = []

        if result.deliver_check_result and hasattr(result.deliver_check_result, 'recommendations') and result.deliver_check_result.recommendations:
            stage_recommendations.extend(result.deliver_check_result.recommendations)

        if result.mcp_validation_result and result.mcp_validation_result.recommendations:
            stage_recommendations.extend(result.mcp_validation_result.recommendations)

        # 修复这里：正确访问cross_validation_result中的recommendations
        if result.cross_validation_result and result.cross_validation_result.get("recommendations"):
            stage_recommendations.extend(result.cross_validation_result["recommendations"])

        # 去重并添加到总体建议中
        unique_recommendations = list(set(stage_recommendations))
        recommendations.extend([f"💡 {rec}" for rec in unique_recommendations[:5]])  # 限制数量

        return recommendations

    async def _save_comprehensive_report(self, result: SystemExecutionResult) -> str:
        """保存综合报告"""
        # 创建报告目录
        reports_dir = Path("reports")
        reports_dir.mkdir(exist_ok=True)

        # 生成文件名
        timestamp = time.strftime("%Y%m%d_%H%M%S")
        filename = f"{result.project_name}_quality_assurance_report_{timestamp}.json"
        filepath = reports_dir / filename

        # 准备报告数据
        report_data = {
            "project_info": {
                "name": result.project_name,
                "timestamp": timestamp,
                "system_status": result.system_status.value,
                "execution_time": result.total_execution_time
            },
            "overall_results": {
                "quality_grade": result.overall_quality_grade,
                "quality_score": result.overall_quality_score,
                "recommendations": result.recommendations,
                "execution_summary": {
                    "phases_executed": result.phases_executed,
                    "successful_phases": result.successful_phases,
                    "failed_phases": result.failed_phases
                }
            },
            "phase_results": {}
        }

        # 添加各阶段结果
        if result.deliver_check_result:
            dc = result.deliver_check_result
            report_data["phase_results"]["deliver_check"] = {
                "overall_score": dc.overall_score,
                "passed_threshold": dc.passed_threshold,
                "template_compliance": dc.template_compliance,
                "data_completeness": dc.data_completeness,
                "logical_consistency": dc.logical_consistency,
                "vi_zone_compliance": dc.vi_zone_compliance,
                "quality_grade": dc.detailed_analysis.get("quality_grade", "N/A") if hasattr(dc, 'detailed_analysis') else "N/A",
                "recommendations": dc.detailed_analysis.get("recommendations", []) if hasattr(dc, 'detailed_analysis') else []
            }

        if result.mcp_validation_result:
            mcp = result.mcp_validation_result
            report_data["phase_results"]["mcp_validation"] = {
                "overall_credibility_score": mcp.overall_credibility_score,
                "credibility_change": mcp.credibility_change,
                "summary": {
                    "total_tools_executed": mcp.summary.get("total_tools_executed", 0),
                    "successful_tools": mcp.summary.get("successful_tools", 0),
                    "total_data_points_verified": mcp.summary.get("total_data_points_verified", 0),
                    "total_inconsistencies_found": mcp.summary.get("total_inconsistencies_found", 0)
                },
                "recommendations": mcp.recommendations
            }

        if result.cross_validation_result:
            cv = result.cross_validation_result
            stats = cv.get("validation_statistics", {})
            rating = cv.get("final_quality_rating", {})
            report_data["phase_results"]["cross_validation"] = {
                "validation_statistics": {
                    "total_fields_validated": stats.get("total_fields_validated", 0),
                    "total_conflicts_detected": stats.get("total_conflicts_detected", 0),
                    "conflicts_resolved": stats.get("conflicts_resolved", 0),
                    "conflicts_requiring_manual_review": stats.get("conflicts_requiring_manual_review", 0),
                    "auto_resolution_rate": stats.get("auto_resolution_rate", 0.0),
                    "confidence_level": stats.get("confidence_level", 0.0),
                    "successful_phases": result.successful_phases
                },
                "final_quality_rating": {
                    "overall_grade": getattr(rating, 'overall_grade', 'N/A'),
                    "trustworthiness_score": getattr(rating, 'trustworthiness_score', 0.0),
                    "data_confidence": getattr(rating, 'data_confidence', 0.0),
                    "source_diversity": getattr(rating, 'source_diversity', 0.0),
                    "validation_completeness": getattr(rating, 'validation_completeness', 0.0),
                    "conflict_resolution_rate": getattr(rating, 'conflict_resolution_rate', 0.0)
                },
                "recommendations": cv.get("recommendations", [])
            }

        # 保存报告
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(report_data, f, ensure_ascii=False, indent=2)

        self.logger.info(f"综合报告已保存至: {filepath}")
        return str(filepath)

    async def _extract_basic_data_from_content(self, content: str) -> Dict[str, Any]:
        """从内容中提取基础数据用于MCP验证"""
        # 这里实现一个简单的数据提取逻辑
        # 在实际应用中，可以使用更复杂的NLP技术

        data = {}

        # 提取公司名称
        lines = content.split('\n')
        for line in lines:
            if '公司名称' in line or '项目名称' in line:
                if '：' in line:
                    data["company_name"] = line.split('：')[1].strip()
                elif ':' in line:
                    data["company_name"] = line.split(':')[1].strip()

        # 提取成立时间
        for line in lines:
            if '成立时间' in line:
                if '年' in line:
                    data["founding_year"] = line.split('年')[0].split()[-1]

        # 提取融资信息
        for line in lines:
            if '融资轮次' in line or '融资阶段' in line:
                data["latest_round"] = line.split('：')[1].strip() if '：' in line else line.split(':')[1].strip()

        return data

    def _update_system_statistics(self, result: SystemExecutionResult):
        """更新系统统计信息"""
        self.total_executions += 1

        if result.system_status == SystemStatus.COMPLETED:
            self.successful_executions += 1

        self.execution_history.append({
            "timestamp": time.time(),
            "project_name": result.project_name,
            "status": result.system_status.value,
            "execution_time": result.total_execution_time,
            "quality_grade": result.overall_quality_grade
        })

        # 保持历史记录在合理范围内
        if len(self.execution_history) > 100:
            self.execution_history = self.execution_history[-100:]

    def get_system_statistics(self) -> Dict[str, Any]:
        """获取系统统计信息"""
        if self.total_executions == 0:
            return {
                "total_executions": 0,
                "success_rate": 0.0,
                "average_execution_time": 0.0,
                "grade_distribution": {}
            }

        success_rate = (self.successful_executions / self.total_executions) * 100

        avg_time = sum(exec["execution_time"] for exec in self.execution_history) / len(self.execution_history)

        # 计算等级分布
        grade_counts = {}
        for exec in self.execution_history:
            grade = exec["quality_grade"]
            grade_counts[grade] = grade_counts.get(grade, 0) + 1

        return {
            "total_executions": self.total_executions,
            "success_rate": success_rate,
            "average_execution_time": avg_time,
            "grade_distribution": grade_counts
        }

    async def generate_markdown_report(self, result: SystemExecutionResult) -> str:
        """生成Markdown格式的质量报告"""
        report_lines = [
            f"# {result.project_name} - 质量保障报告",
            "",
            f"**生成时间**: {time.strftime('%Y-%m-%d %H:%M:%S')}",
            f"**系统状态**: {result.system_status.value}",
            f"**执行时间**: {result.total_execution_time:.2f}秒",
            f"**整体质量等级**: {result.overall_quality_grade}",
            f"**整体质量分数**: {result.overall_quality_score:.1f}/100",
            "",
            "## 执行摘要",
            ""
        ]

        # 添加各阶段结果
        if result.deliver_check_result:
            dc = result.deliver_check_result
            report_lines.extend([
                "### 📋 DELIVER_CHECK - 质量检查",
                f"- **质量评分**: {dc.overall_score:.1f}/100",
                f"- **通过状态**: {'✅ 通过' if dc.passed_threshold else '❌ 未通过'}",
                f"- **模板对齐度**: {dc.template_compliance:.1f}/100",
                f"- **数据完整性**: {dc.data_completeness:.1f}/100",
                f"- **逻辑一致性**: {dc.logical_consistency:.1f}/100",
                f"- **VI区合规性**: {dc.vi_zone_compliance:.1f}/100",
                f"- **质量等级**: {dc.detailed_analysis.get('quality_grade', 'N/A') if hasattr(dc, 'detailed_analysis') else 'N/A'}",
                ""
            ])

        if result.mcp_validation_result:
            mcp = result.mcp_validation_result
            summary = mcp.summary
            report_lines.extend([
                "### 🔗 MCP_VALIDATION - MCP验证",
                f"- **整体可信度**: {mcp.overall_credibility_score:.3f}",
                f"- **可信度变化**: {mcp.credibility_change:+.3f}",
                f"- **执行工具数**: {summary.get('total_tools_executed', 0)}",
                f"- **成功工具数**: {summary.get('successful_tools', 0)}",
                f"- **验证数据点**: {summary.get('total_data_points_verified', 0)}",
                f"- **发现不一致**: {summary.get('total_inconsistencies_found', 0)}",
                ""
            ])

        if result.cross_validation_result:
            cv = result.cross_validation_result
            stats = cv.get("validation_statistics", {})
            rating = cv.get("final_quality_rating", {})
            report_lines.extend([
                "### 🔗 CROSS_VALIDATION - 交叉验证",
                f"- **最终等级**: {getattr(rating, 'overall_grade', 'N/A')}",
                f"- **可信度评分**: {getattr(rating, 'trustworthiness_score', 0.0):.1f}/100",
                f"- **数据置信度**: {getattr(rating, 'data_confidence', 0.0):.1f}/100",
                f"- **源多样性**: {getattr(rating, 'source_diversity', 0.0):.1f}/100",
                f"- **验证完整性**: {getattr(rating, 'validation_completeness', 0.0):.1f}/100",
                f"- **冲突解决率**: {getattr(rating, 'conflict_resolution_rate', 0.0):.1f}/100",
                f"- **验证字段**: {stats.get('total_fields_validated', 0)}",
                f"- **检测冲突**: {stats.get('total_conflicts_detected', 0)}",
                f"- **解决冲突**: {stats.get('conflicts_resolved', 0)}",
                f"- **需人工审核**: {stats.get('conflicts_requiring_manual_review', 0)}",
                ""
            ])

        # 添加建议
        if result.recommendations:
            report_lines.extend([
                "## 💡 改进建议",
                ""
            ])
            for i, rec in enumerate(result.recommendations, 1):
                report_lines.append(f"{i}. {rec}")
            report_lines.append("")

        # 添加系统统计
        stats = self.get_system_statistics()
        report_lines.extend([
            "## 📊 系统统计",
            f"- **总执行次数**: {stats['total_executions']}",
            f"- **成功率**: {stats['success_rate']:.1f}%",
            f"- **平均执行时间**: {stats['average_execution_time']:.1f}秒",
            f"- **等级分布**: {stats['grade_distribution']}",
            ""
        ])

        return "\n".join(report_lines)


# 导出的主要接口
__all__ = [
    'QualityAssuranceSystem',
    'QualitySystemConfiguration',
    'QualityThresholds',
    'SystemExecutionResult',
    'ValidationPhase',
    'SystemStatus'
]