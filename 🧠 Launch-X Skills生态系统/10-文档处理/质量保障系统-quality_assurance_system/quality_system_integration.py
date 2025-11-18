#!/usr/bin/env python3
"""
质量保障系统集成 (Quality System Integration) - 三层质量验证体系完整实现
基于AI项目档案管理工作流v2.4-完整版的质量保障系统集成

核心功能:
- DELIVER_CHECK阶段 - 质量检查器集成
- MCP_VALIDATION阶段 - MCP验证器集成
- CROSS_VALIDATION阶段 - 交叉验证器集成
- 完整工作流程编排
- 综合质量报告生成
"""

import asyncio
import json
import time
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
from datetime import datetime
from pathlib import Path

from quality_checker import QualityChecker, QualityMetrics
from mcp_validator import MCPValidator, MCPValidationReport
from cross_validator import CrossValidator, CrossValidationResult, FinalQualityRating


@dataclass
class QualitySystemConfiguration:
    """质量保障系统配置"""
    project_name: str
    content: str
    validation_sources: List[Dict[str, Any]]
    enable_deliver_check: bool = True
    enable_mcp_validation: bool = True
    enable_cross_validation: bool = True
    parallel_execution: bool = True
    quality_thresholds: Dict[str, float] = None

    def __post_init__(self):
        if self.quality_thresholds is None:
            self.quality_thresholds = {
                "deliver_check_threshold": 85.0,
                "mcp_validation_threshold": 0.7,
                "cross_validation_min_grade": "B",
                "overall_quality_threshold": 80.0
            }


@dataclass
class SystemExecutionResult:
    """系统执行结果"""
    project_name: str
    execution_id: str
    start_time: str
    end_time: str
    total_execution_time: float
    deliver_check_result: Optional[QualityMetrics] = None
    mcp_validation_result: Optional[MCPValidationReport] = None
    cross_validation_result: Optional[Dict[str, Any]] = None
    overall_quality_grade: str = "UNKNOWN"
    system_status: str = "completed"
    execution_summary: Dict[str, Any] = None
    recommendations: List[str] = None
    final_report_path: Optional[str] = None


class QualityAssuranceSystem:
    """质量保障系统 - 三层质量验证体系核心实现"""

    def __init__(self):
        self.quality_checker = QualityChecker()
        self.mcp_validator = MCPValidator()
        self.cross_validator = CrossValidator()
        self.system_config = None
        self.execution_history: List[SystemExecutionResult] = []

    async def execute_complete_quality_assurance(self, config: QualitySystemConfiguration) -> SystemExecutionResult:
        """
        执行完整的三层质量验证流程

        Args:
            config: 质量保障系统配置

        Returns:
            SystemExecutionResult: 完整的执行结果
        """
        print("🚀 启动完整三层质量验证体系...")
        print(f"📋 项目: {config.project_name}")
        print(f"🔍 启用阶段: DELIVER_CHECK={config.enable_deliver_check}, MCP_VALIDATION={config.enable_mcp_validation}, CROSS_VALIDATION={config.enable_cross_validation}")

        execution_id = f"qa_{int(time.time())}"
        start_time = datetime.now()

        # 初始化执行结果
        result = SystemExecutionResult(
            project_name=config.project_name,
            execution_id=execution_id,
            start_time=start_time.isoformat(),
            end_time="",
            total_execution_time=0.0,
            system_status="running",
            recommendations=[]
        )

        try:
            # 阶段1: DELIVER_CHECK - 质量检查
            if config.enable_deliver_check:
                print("\n" + "="*50)
                print("📋 阶段1: DELIVER_CHECK - 质量检查")
                print("="*50)

                result.deliver_check_result = self.quality_checker.run_deliver_check(config.content)

                if result.deliver_check_result.passed_threshold:
                    print(f"✅ DELIVER_CHECK通过 - 质量评分: {result.deliver_check_result.overall_score:.1f}/100")
                else:
                    print(f"❌ DELIVER_CHECK未通过 - 质量评分: {result.deliver_check_result.overall_score:.1f}/100 (需要≥{config.quality_thresholds['deliver_check_threshold']})")
                    result.system_status = "deliver_check_failed"
            else:
                print("⏭️  跳过DELIVER_CHECK阶段")

            # 阶段2: MCP_VALIDATION - MCP验证
            if config.enable_mcp_validation:
                print("\n" + "="*50)
                print("🔍 阶段2: MCP_VALIDATION - MCP验证")
                print("="*50)

                # 准备内容数据
                content_data = self._prepare_content_data(config.content)

                # 执行MCP验证
                result.mcp_validation_result = await self.mcp_validator.run_independent_mcp_validation(
                    config.project_name, content_data
                )

                # 执行RUBE验证流程
                rube_result = self.mcp_validator.run_rube_validation_process(config.project_name, config.content)

                # 将RUBE结果添加到MCP验证结果中
                if not hasattr(result.mcp_validation_result, 'rube_validation'):
                    result.mcp_validation_result.rube_validation = rube_result

                print(f"✅ MCP_VALIDATION完成 - 整体可信度: {result.mcp_validation_result.overall_credibility_score:.2f}")
            else:
                print("⏭️  跳过MCP_VALIDATION阶段")

            # 阶段3: CROSS_VALIDATION - 交叉验证
            if config.enable_cross_validation:
                print("\n" + "="*50)
                print("🔗 阶段3: CROSS_VALIDATION - 交叉验证")
                print("="*50)

                # 准备质量检查结果和MCP验证结果
                quality_check_results = self._prepare_quality_check_results(result.deliver_check_result)
                mcp_validation_results = self._prepare_mcp_validation_results(result.mcp_validation_result)

                # 执行交叉验证
                result.cross_validation_result = self.cross_validator.perform_comprehensive_cross_validation(
                    config.project_name,
                    config.content,
                    config.validation_sources,
                    quality_check_results,
                    mcp_validation_results
                )

                final_rating = result.cross_validation_result["final_quality_rating"]
                print(f"✅ CROSS_VALIDATION完成 - 最终等级: {final_rating.overall_grade}")
            else:
                print("⏭️  跳过CROSS_VALIDATION阶段")

            # 计算整体质量等级
            result.overall_quality_grade = self._calculate_overall_quality_grade(result, config)

            # 生成执行摘要
            result.execution_summary = self._generate_execution_summary(result, config)

            # 生成综合建议
            result.recommendations = self._generate_comprehensive_recommendations(result, config)

            # 完成执行
            end_time = datetime.now()
            result.end_time = end_time.isoformat()
            result.total_execution_time = (end_time - start_time).total_seconds()

            if result.system_status == "running":
                result.system_status = "completed"

            print(f"\n🎉 质量保障系统执行完成!")
            print(f"⏱️  总执行时间: {result.total_execution_time:.1f}秒")
            print(f"⭐ 整体质量等级: {result.overall_quality_grade}")

            # 保存报告
            if result:
                result.final_report_path = await self._save_comprehensive_report(result)

        except Exception as e:
            print(f"❌ 质量保障系统执行失败: {str(e)}")
            result.system_status = "error"
            result.end_time = datetime.now().isoformat()
            result.total_execution_time = (datetime.now() - start_time).total_seconds()

            # 添加错误信息到建议中
            result.recommendations = [f"系统执行失败: {str(e)}"]

        # 记录到历史
        self.execution_history.append(result)

        return result

    def _prepare_content_data(self, content: str) -> Dict[str, Any]:
        """准备内容数据用于MCP验证"""
        content_data = {}

        # 从内容中提取结构化数据
        lines = content.split('\n')
        current_section = None

        for line in lines:
            line = line.strip()
            if not line:
                continue

            # 识别章节标题
            if line.startswith('##') or line.startswith('#'):
                current_section = line.replace('#', '').strip()
                continue

            # 识别键值对
            if ':' in line or '：' in line:
                if '：' in line:
                    key, value = line.split('：', 1)
                else:
                    key, value = line.split(':', 1)

                key = key.strip()
                value = value.strip()

                if key and value:
                    # 根据键名分类
                    if any(keyword in key.lower() for keyword in ['公司', '企业', '名称']):
                        content_data.setdefault('basic_info', {})[key] = value
                    elif any(keyword in key.lower() for keyword in ['融资', '投资', '轮次', '估值']):
                        content_data.setdefault('funding_data', {})[key] = value
                    elif any(keyword in key.lower() for keyword in ['技术', '产品', '专利', '研发']):
                        content_data.setdefault('technical_data', {})[key] = value
                    elif any(keyword in key.lower() for keyword in ['用户', '客户', '收入', '增长']):
                        content_data.setdefault('business_data', {})[key] = value

        return content_data

    def _prepare_quality_check_results(self, quality_metrics: Optional[QualityMetrics]) -> Dict[str, Any]:
        """准备质量检查结果"""
        if not quality_metrics:
            return {
                "overall_score": 0.0,
                "template_compliance": 0.0,
                "data_completeness": 0.0,
                "logical_consistency": 0.0,
                "vi_zone_compliance": 0.0
            }

        return {
            "overall_score": quality_metrics.overall_score,
            "template_compliance": quality_metrics.template_compliance,
            "data_completeness": quality_metrics.data_completeness,
            "logical_consistency": quality_metrics.logical_consistency,
            "vi_zone_compliance": quality_metrics.vi_zone_compliance,
            "passed_threshold": quality_metrics.passed_threshold,
            "detailed_analysis": quality_metrics.detailed_analysis
        }

    def _prepare_mcp_validation_results(self, mcp_report: Optional[MCPValidationReport]) -> Dict[str, Any]:
        """准备MCP验证结果"""
        if not mcp_report:
            return {
                "overall_credibility_score": 0.0,
                "credibility_change": 0.0,
                "total_tools_executed": 0,
                "successful_tools": 0
            }

        return {
            "overall_credibility_score": mcp_report.overall_credibility_score,
            "credibility_change": mcp_report.credibility_change,
            "total_tools_executed": mcp_report.summary.get("total_tools_executed", 0),
            "successful_tools": mcp_report.summary.get("successful_tools", 0),
            "validation_results": [asdict(result) for result in mcp_report.validation_results],
            "recommendations": mcp_report.recommendations
        }

    def _calculate_overall_quality_grade(self, result: SystemExecutionResult, config: QualitySystemConfiguration) -> str:
        """计算整体质量等级"""
        grades = []

        # DELIVER_CHECK等级
        if result.deliver_check_result:
            deliver_score = result.deliver_check_result.overall_score
            if deliver_score >= 95:
                grades.append("A+")
            elif deliver_score >= 85:
                grades.append("A")
            elif deliver_score >= 75:
                grades.append("B+")
            elif deliver_score >= 65:
                grades.append("B")
            else:
                grades.append("C")

        # MCP验证等级
        if result.mcp_validation_result:
            credibility_score = result.mcp_validation_result.overall_credibility_score * 100
            if credibility_score >= 90:
                grades.append("A")
            elif credibility_score >= 80:
                grades.append("B+")
            elif credibility_score >= 70:
                grades.append("B")
            else:
                grades.append("C")

        # CROSS_VALIDATION等级
        if result.cross_validation_result:
            cross_grade = result.cross_validation_result["final_quality_rating"].overall_grade
            grades.append(cross_grade)

        if not grades:
            return "UNKNOWN"

        # 确定最保守的等级（最低的等级）
        grade_priority = {
            "A+": 5, "A": 4, "B+": 3, "B": 2, "C": 1, "D": 0
        }

        min_grade = min(grades, key=lambda g: grade_priority.get(g, 0))
        return min_grade

    def _generate_execution_summary(self, result: SystemExecutionResult, config: QualitySystemConfiguration) -> Dict[str, Any]:
        """生成执行摘要"""
        summary = {
            "execution_id": result.execution_id,
            "project_name": result.project_name,
            "total_execution_time": result.total_execution_time,
            "system_status": result.system_status,
            "phases_executed": [],
            "quality_metrics": {},
            "validation_statistics": {}
        }

        # 阶段执行信息
        if result.deliver_check_result:
            summary["phases_executed"].append("DELIVER_CHECK")
            summary["quality_metrics"]["deliver_check"] = {
                "score": result.deliver_check_result.overall_score,
                "passed": result.deliver_check_result.passed_threshold,
                "template_compliance": result.deliver_check_result.template_compliance,
                "data_completeness": result.deliver_check_result.data_completeness
            }

        if result.mcp_validation_result:
            summary["phases_executed"].append("MCP_VALIDATION")
            summary["quality_metrics"]["mcp_validation"] = {
                "credibility_score": result.mcp_validation_result.overall_credibility_score,
                "credibility_change": result.mcp_validation_result.credibility_change,
                "tools_successful": result.mcp_validation_result.summary.get("successful_tools", 0),
                "tools_total": result.mcp_validation_result.summary.get("total_tools_executed", 0)
            }

        if result.cross_validation_result:
            summary["phases_executed"].append("CROSS_VALIDATION")
            summary["quality_metrics"]["cross_validation"] = {
                "final_grade": result.cross_validation_result["final_quality_rating"].overall_grade,
                "trustworthiness_score": result.cross_validation_result["final_quality_rating"].trustworthiness_score,
                "conflicts_detected": result.cross_validation_result["validation_statistics"]["total_conflicts_detected"],
                "conflicts_resolved": result.cross_validation_result["validation_statistics"]["conflicts_resolved"]
            }

        # 验证统计
        summary["validation_statistics"] = {
            "total_phases": len(summary["phases_executed"]),
            "successful_phases": len([p for p in summary["phases_executed"] if p != "FAILED"]),
            "overall_quality_grade": result.overall_quality_grade
        }

        return summary

    def _generate_comprehensive_recommendations(self, result: SystemExecutionResult, config: QualitySystemConfiguration) -> List[str]:
        """生成综合建议"""
        recommendations = []

        # 基于整体质量等级的建议
        if result.overall_quality_grade in ["A+", "A"]:
            recommendations.append("🎉 数据质量优秀，可直接用于高可信度决策")
        elif result.overall_quality_grade in ["B+", "B"]:
            recommendations.append("✅ 数据质量良好，建议使用前复核关键数据点")
        elif result.overall_quality_grade == "C":
            recommendations.append("⚠️  数据质量一般，建议补充更多验证数据")
        else:
            recommendations.append("❌ 数据质量不达标，建议重新收集和验证数据")

        # 基于各阶段的具体建议
        if result.deliver_check_result:
            dc_result = result.deliver_check_result
            if not dc_result.passed_threshold:
                recommendations.append(f"📋 DELIVER_CHECK未通过 ({dc_result.overall_score:.1f}/{config.quality_thresholds['deliver_check_threshold']})")

            if dc_result.template_compliance < 100:
                recommendations.append("📝 需要完善模板对齐度")
            if dc_result.data_completeness < 90:
                recommendations.append("📊 需要提高数据完整性")
            if dc_result.logical_consistency < 80:
                recommendations.append("🧠 需要检查数据逻辑一致性")

        if result.mcp_validation_result:
            mcp_result = result.mcp_validation_result
            if mcp_result.credibility_change < 0:
                recommendations.append("🔍 MCP验证发现可信度下降，建议审查数据源")
            elif mcp_result.credibility_change > 0.1:
                recommendations.append("✅ MCP验证显著提升了数据可信度")

            failed_tools = mcp_result.summary.get("total_tools_executed", 0) - mcp_result.summary.get("successful_tools", 0)
            if failed_tools > 0:
                recommendations.append(f"🔧 {failed_tools}个MCP工具执行失败，建议检查工具配置")

        if result.cross_validation_result:
            cv_result = result.cross_validation_result
            stats = cv_result["validation_statistics"]

            if stats["total_conflicts_detected"] > 0:
                recommendations.append(f"⚠️  发现{stats['total_conflicts_detected']}个数据冲突，需要解决")

            if stats["conflicts_requiring_manual_review"] > 0:
                recommendations.append(f"👤 {stats['conflicts_requiring_manual_review']}个冲突需要人工审核")

        # 系统优化建议
        if result.total_execution_time > 300:  # 超过5分钟
            recommendations.append("⏱️  执行时间较长，建议考虑性能优化")

        # 添加各阶段的具体建议
        stage_recommendations = []

        if result.mcp_validation_result and result.mcp_validation_result.recommendations:
            stage_recommendations.extend(result.mcp_validation_result.recommendations)

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
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{reports_dir}/quality_assurance_report_{result.project_name}_{timestamp}.json"
        filename_md = f"{reports_dir}/quality_assurance_report_{result.project_name}_{timestamp}.md"

        # 准备完整的报告数据
        report_data = {
            "execution_metadata": {
                "project_name": result.project_name,
                "execution_id": result.execution_id,
                "start_time": result.start_time,
                "end_time": result.end_time,
                "total_execution_time": result.total_execution_time,
                "system_status": result.system_status
            },
            "overall_results": {
                "overall_quality_grade": result.overall_quality_grade,
                "execution_summary": result.execution_summary,
                "recommendations": result.recommendations
            },
            "phase_results": {}
        }

        # 添加各阶段结果
        if result.deliver_check_result:
            report_data["phase_results"]["deliver_check"] = asdict(result.deliver_check_result)

        if result.mcp_validation_result:
            report_data["phase_results"]["mcp_validation"] = asdict(result.mcp_validation_result)

        if result.cross_validation_result:
            report_data["phase_results"]["cross_validation"] = result.cross_validation_result

        # 保存JSON报告
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(report_data, f, indent=2, ensure_ascii=False, default=str)

        # 生成并保存Markdown报告
        md_content = self._generate_markdown_report(report_data)
        with open(filename_md, 'w', encoding='utf-8') as f:
            f.write(md_content)

        print(f"📄 综合报告已保存:")
        print(f"   JSON: {filename}")
        print(f"   Markdown: {filename_md}")

        return str(filename)

    def _generate_markdown_report(self, report_data: Dict[str, Any]) -> str:
        """生成Markdown格式的综合报告"""
        md_lines = [
            "# 质量保障系统综合报告",
            "",
            f"**项目名称**: {report_data['execution_metadata']['project_name']}",
            f"**执行ID**: {report_data['execution_metadata']['execution_id']}",
            f"**执行时间**: {report_data['execution_metadata']['total_execution_time']:.1f}秒",
            f"**系统状态**: {report_data['execution_metadata']['system_status']}",
            f"**整体质量等级**: {report_data['overall_results']['overall_quality_grade']}",
            "",
            "## 执行摘要",
            ""
        ]

        # 执行摘要
        if report_data.get("overall_results", {}).get("execution_summary"):
            summary = report_data["overall_results"]["execution_summary"]
            md_lines.extend([
                f"- **执行阶段**: {', '.join(summary.get('phases_executed', []))}",
                f"- **成功阶段**: {summary.get('validation_statistics', {}).get('successful_phases', 0)}",
                f"- **总体等级**: {summary.get('validation_statistics', {}).get('overall_quality_grade', 'N/A')}",
                ""
            ])

        # 各阶段结果
        phase_results = report_data.get("phase_results", {})

        if "deliver_check" in phase_results:
            dc = phase_results["deliver_check"]
            md_lines.extend([
                "## 阶段1: DELIVER_CHECK - 质量检查",
                f"- **质量评分**: {dc.get('overall_score', 0):.1f}/100",
                f"- **通过状态**: {'✅ 通过' if dc.get('passed_threshold', False) else '❌ 未通过'}",
                f"- **模板对齐度**: {dc.get('template_compliance', 0):.1f}/100",
                f"- **数据完整性**: {dc.get('data_completeness', 0):.1f}/100",
                f"- **逻辑一致性**: {dc.get('logical_consistency', 0):.1f}/100",
                f"- **VI区合规性**: {dc.get('vi_zone_compliance', 0):.1f}/100",
                ""
            ])

        if "mcp_validation" in phase_results:
            mcp = phase_results["mcp_validation"]
            summary = mcp.get("summary", {})
            md_lines.extend([
                "## 阶段2: MCP_VALIDATION - MCP验证",
                f"- **整体可信度**: {mcp.get('overall_credibility_score', 0):.3f}",
                f"- **可信度变化**: {mcp.get('credibility_change', 0):+.3f}",
                f"- **执行工具数**: {summary.get('total_tools_executed', 0)}",
                f"- **成功工具数**: {summary.get('successful_tools', 0)}",
                f"- **验证数据点**: {summary.get('total_data_points_verified', 0)}",
                f"- **发现不一致**: {summary.get('total_inconsistencies_found', 0)}",
                ""
            ])

        if "cross_validation" in phase_results:
            cv = phase_results["cross_validation"]
            stats = cv.get("validation_statistics", {})
            rating = cv.get("final_quality_rating", {})
            md_lines.extend([
                "## 阶段3: CROSS_VALIDATION - 交叉验证",
                f"- **最终等级**: {rating.get('overall_grade', 'N/A')}",
                f"- **可信度评分**: {rating.get('trustworthiness_score', 0):.1f}/100",
                f"- **数据置信度**: {rating.get('data_confidence', 0):.1f}/100",
                f"- **源多样性**: {rating.get('source_diversity', 0):.1f}/100",
                f"- **验证完整性**: {rating.get('validation_completeness', 0):.1f}/100",
                f"- **冲突解决率**: {rating.get('conflict_resolution_rate', 0):.1f}/100",
                f"- **验证字段**: {stats.get('total_fields_validated', 0)}",
                f"- **检测冲突**: {stats.get('total_conflicts_detected', 0)}",
                f"- **解决冲突**: {stats.get('conflicts_resolved', 0)}",
                ""
            ])

        # 综合建议
        recommendations = report_data.get("overall_results", {}).get("recommendations", [])
        if recommendations:
            md_lines.extend([
                "## 综合建议",
                ""
            ])
            for i, rec in enumerate(recommendations, 1):
                md_lines.append(f"{i}. {rec}")

        md_lines.append("\n---")
        md_lines.append(f"*报告生成时间: {datetime.now().isoformat()}*")

        return "\n".join(md_lines)

    def get_execution_history(self, project_name: Optional[str] = None, limit: int = 10) -> List[SystemExecutionResult]:
        """获取执行历史"""
        history = self.execution_history

        if project_name:
            history = [result for result in history if result.project_name == project_name]

        return history[-limit:]  # 返回最近的记录

    def get_system_statistics(self) -> Dict[str, Any]:
        """获取系统统计信息"""
        if not self.execution_history:
            return {
                "total_executions": 0,
                "successful_executions": 0,
                "average_execution_time": 0.0,
                "grade_distribution": {},
                "most_common_issues": []
            }

        total = len(self.execution_history)
        successful = len([r for r in self.execution_history if r.system_status == "completed"])
        avg_time = sum(r.total_execution_time for r in self.execution_history) / total

        # 等级分布
        grade_counts = {}
        for result in self.execution_history:
            grade = result.overall_quality_grade
            grade_counts[grade] = grade_counts.get(grade, 0) + 1

        return {
            "total_executions": total,
            "successful_executions": successful,
            "success_rate": successful / total * 100,
            "average_execution_time": avg_time,
            "grade_distribution": grade_counts,
            "last_execution": self.execution_history[-1].execution_id if self.execution_history else None
        }


async def main():
    """主函数 - 演示质量保障系统完整使用"""
    print("🚀 质量保障系统演示")
    print("="*60)

    # 创建系统实例
    qa_system = QualityAssuranceSystem()

    # 准备示例配置
    config = QualitySystemConfiguration(
        project_name="SERVAL",
        content="""
        # SERVAL企业级AI智能解决方案提供商项目档案

        ## 1. 项目核心概览

        ### 1.1 价值定位
        **一句话定位**: 企业级AI自动化平台解决方案提供商

        **核心标签**: AI自动化, 企业服务, 智能决策, 效率提升

        ### 1.2 关键数据快照
        | 核心指标 | 具体数据 | 数据来源 | 可信度 |
        |:---------|:--------:|:--------:|:--------:|
        | **成立时间** | 2020年 | 官方网站 | ★★★★☆ |
        | **融资阶段** | A轮 | VC公告 | ★★★★★ |
        | **团队规模** | 150人 | LinkedIn | ★★★★☆ |
        | **用户基数** | 50万+ | 应用商店 | ★★★☆☆ |
        | **ARR收入** | 2000万 | 财务报告 | ★★★★☆ |

        ## 8. 完整数据溯源

        ### A区：基础信息数据
        #### A.1 项目基础档案
        | 字段类别 | 精确数据 | 数据来源 | 可信度 | 整合状态 |
        |----------|----------|----------|:------:|----------|
        | **基本信息** | 企业AI自动化平台 | 官方网站 | ★★★★☆ | 已整合 |
        | **当前估值** | 2亿美元 | 融资数据库 | ★★★★☆ | 已整合 |
        | **最新轮次** | A轮 | VC公告 | ★★★★★ | 已整合 |
        """,
        validation_sources=[
            {
                "name": "Crunchbase",
                "type": "secondary",
                "content": "SERVAL成立于2020年，A轮融资1200万美元，估值2.5亿美元，员工200人",
                "credibility_score": 0.9
            },
            {
                "name": "官方网站",
                "type": "primary",
                "content": "SERVAL，领先的AI自动化平台，成立于2020年，团队规模180人",
                "credibility_score": 0.95
            }
        ],
        parallel_execution=True
    )

    # 执行完整质量保障流程
    result = await qa_system.execute_complete_quality_assurance(config)

    # 显示结果摘要
    print("\n" + "="*60)
    print("📊 执行结果摘要")
    print("="*60)
    print(f"项目: {result.project_name}")
    print(f"执行ID: {result.execution_id}")
    print(f"执行时间: {result.total_execution_time:.1f}秒")
    print(f"系统状态: {result.system_status}")
    print(f"整体质量等级: {result.overall_quality_grade}")

    # 显示详细指标
    if result.execution_summary:
        print("\n📈 质量指标:")
        for phase, metrics in result.execution_summary.get("quality_metrics", {}).items():
            print(f"  {phase}:")
            for key, value in metrics.items():
                print(f"    {key}: {value}")

    # 显示建议
    if result.recommendations:
        print("\n💡 综合建议:")
        for i, rec in enumerate(result.recommendations, 1):
            print(f"  {i}. {rec}")

    # 系统统计
    stats = qa_system.get_system_statistics()
    print(f"\n📊 系统统计:")
    print(f"  总执行次数: {stats['total_executions']}")
    print(f"  成功率: {stats['success_rate']:.1f}%")
    print(f"  平均执行时间: {stats['average_execution_time']:.1f}秒")
    print(f"  等级分布: {stats['grade_distribution']}")


if __name__ == "__main__":
    asyncio.run(main())