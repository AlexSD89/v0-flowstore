"""
报告自动生成工具
跨特化的输出生成组件
"""

import os
import json
from datetime import datetime
from typing import Dict, List, Any, Optional
import logging
import markdown
from jinja2 import Template


class ReportAutoGenerator:
    """报告自动生成器，为3个特化提供统一的输出生成"""

    def __init__(self, config_file: str = None):
        """
        初始化报告生成器

        Args:
            config_file: 配置文件路径
        """
        self.config = self._load_config(config_file)
        self.logger = self._setup_logger()
        self.results = {}

    def _load_config(self, config_file: str) -> Dict:
        """加载配置文件"""
        if config_file and os.path.exists(config_file):
            with open(config_file, 'r', encoding='utf-8') as f:
                return json.load(f)

        # 默认配置
        return {
            "output_formats": ["markdown", "html", "json"],
            "template_paths": {
                "excel_analyzer": "./templates/excel_report",
                "design_reviewer": "./templates/design_report", 
                "project_coordinator": "./templates/project_report"
            },
            "report_sections": {
                "excel_analyzer": [
                    "executive_summary",
                    "data_overview", 
                    "business_insights",
                    "recommendations",
                    "appendix"
                ],
                "design_reviewer": [
                    "executive_summary",
                    "design_analysis",
                    "quality_assessment",
                    "channel_recommendations",
                    "action_items"
                ],
                "project_coordinator": [
                    "executive_summary",
                    "complexity_assessment",
                    "coordination_plan",
                    "resource_allocation",
                    "risk_mitigation"
                ]
            },
            "styling": {
                "company_branding": True,
                "include_charts": True,
                "include_tables": True,
                "language": "zh"
            }
        }

    def _setup_logger(self) -> logging.Logger:
        """设置日志器"""
        logger = logging.getLogger('ReportAutoGenerator')
        logger.setLevel(logging.INFO)

        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)

        return logger

    def generate_report(self, data: Dict, specialization: str, output_formats: List[str] = None) -> Dict[str, Any]:
        """
        生成报告的主入口

        Args:
            data: 输入数据
            specialization: 特化类型
            output_formats: 输出格式列表

        Returns:
            生成结果字典
        """
        self.logger.info(f"开始生成报告: 特化={specialization}, 格式={output_formats}")

        try:
            # 验证输入数据
            validation_result = self._validate_input_data(data, specialization)
            if not validation_result['valid']:
                return {
                    'success': False,
                    'error': validation_result['error'],
                    'specialization': specialization
                }

            # 设置输出格式
            if output_formats is None:
                output_formats = self.config['output_formats']

            # 生成报告内容
            content_result = self._generate_report_content(data, specialization)

            # 生成不同格式的报告
            format_results = {}
            for format_type in output_formats:
                format_result = self._generate_single_report(content_result, format_type, specialization)
                format_results[format_type] = format_result

            # 质量检查
            quality_result = self._assess_report_quality(content_result, format_results)

            # 记录执行日志
            self._log_execution(specialization, output_formats, quality_result)

            result = {
                'success': True,
                'specialization': specialization,
                'timestamp': datetime.now().isoformat(),
                'content': content_result,
                'formats': format_results,
                'quality_assessment': quality_result
            }

            return result

        except Exception as e:
            self.logger.error(f"报告生成失败: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'specialization': specialization
            }

    def _validate_input_data(self, data: Dict, specialization: str) -> Dict:
        """验证输入数据"""
        validation = {
            'valid': True,
            'error': None,
            'warnings': []
        }

        # 检查数据是否为空
        if not data:
            validation['valid'] = False
            validation['error'] = '输入数据为空'
            return validation

        # 检查特化类型
        valid_specializations = ['excel_analyzer', 'design_reviewer', 'project_coordinator']
        if specialization not in valid_specializations:
            validation['valid'] = False
            validation['error'] = f'不支持的特化类型: {specialization}'
            return validation

        # 特化数据验证
        if specialization == 'excel_analyzer':
            validation = self._validate_excel_data(data, validation)
        elif specialization == 'design_reviewer':
            validation = self._validate_design_data(data, validation)
        elif specialization == 'project_coordinator':
            validation = self._validate_project_data(data, validation)

        return validation

    def _validate_excel_data(self, data: Dict, validation: Dict) -> Dict:
        """验证Excel分析数据"""
        required_sections = ['structure_analysis', 'business_analysis', 'quality_assessment']
        
        for section in required_sections:
            if section not in data:
                validation['warnings'].append(f"缺少必需的数据节: {section}")

        return validation

    def _validate_design_data(self, data: Dict, validation: Dict) -> Dict:
        """验证设计审查数据"""
        required_sections = ['design_recognition', 'channel_analysis', 'quality_gates']
        
        for section in required_sections:
            if section not in data:
                validation['warnings'].append(f"缺少必需的数据节: {section}")

        return validation

    def _validate_project_data(self, data: Dict, validation: Dict) -> Dict:
        """验证项目协调数据"""
        required_sections = ['complexity_assessment', 'capability_analysis', 'coordination_plan']
        
        for section in required_sections:
            if section not in data:
                validation['warnings'].append(f"缺少必需的数据节: {section}")

        return validation

    def _generate_report_content(self, data: Dict, specialization: str) -> Dict:
        """生成报告内容"""
        content = {
            'metadata': self._generate_metadata(specialization),
            'executive_summary': self._generate_executive_summary(data, specialization),
            'main_content': self._generate_main_content(data, specialization),
            'recommendations': self._generate_recommendations(data, specialization),
            'appendix': self._generate_appendix(data, specialization)
        }

        return content

    def _generate_metadata(self, specialization: str) -> Dict:
        """生成元数据"""
        metadata = {
            'report_title': self._get_report_title(specialization),
            'generation_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'specialization': specialization,
            'version': '1.0',
            'language': self.config['styling']['language'],
            'author': 'AI自动化系统'
        }

        return metadata

    def _get_report_title(self, specialization: str) -> str:
        """获取报告标题"""
        title_mapping = {
            'excel_analyzer': 'Excel数据分析报告',
            'design_reviewer': '设计质量审查报告',
            'project_coordinator': '项目协调分析报告'
        }

        return title_mapping.get(specialization, '分析报告')

    def _generate_executive_summary(self, data: Dict, specialization: str) -> str:
        """生成执行摘要"""
        summary_templates = {
            'excel_analyzer': self._get_excel_summary_template(),
            'design_reviewer': self._get_design_summary_template(),
            'project_coordinator': self._get_project_summary_template()
        }

        template = summary_templates.get(specialization, summary_templates['excel_analyzer'])
        
        # 使用Jinja2模板生成摘要
        try:
            jinja_template = Template(template)
            summary = jinja_template.render(data=data)
        except Exception as e:
            self.logger.warning(f"模板渲染失败: {str(e)}")
            summary = self._generate_fallback_summary(data, specialization)

        return summary

    def _get_excel_summary_template(self) -> str:
        """获取Excel分析摘要模板"""
        return """
# 执行摘要

## 项目概述
本报告基于对{{ data.structure_analysis.file_path | default('Excel文件') }}的深度分析，采用自动化分析技术，从业务数据结构、质量评估和洞察生成三个维度进行全面解析。

## 关键发现
{% if data.business_analysis.file_type %}
- **文件类型**: {{ data.business_analysis.file_type }}
{% endif %}
{% if data.business_analysis.industry_type %}
- **行业类型**: {{ data.business_analysis.industry_type }}
{% endif %}
{% if data.business_analysis.data_quality_score %}
- **数据质量分数**: {{ "%.1f"|format(data.business_analysis.data_quality_score) }}/100
{% endif %}

## 主要结论
{% if data.business_analysis.business_patterns %}
发现{{ data.business_analysis.business_patterns|length }}个业务模式：
{% for pattern in data.business_analysis.business_patterns %}
- **{{ pattern.sheet_name }}**: {{ pattern.data_structure.row_count }}行数据，业务意图为{{ pattern.business_intent }}
{% endfor %}
{% endif %}

{% if data.business_analysis.recommendations %}
## 关键建议
{% for recommendation in data.business_analysis.recommendations %}
- {{ recommendation }}
{% endfor %}
{% endif %}

## 质量评估
{% if data.quality_assessment.overall_score %}
- **内容质量分数**: {{ "%.1f"|format(data.quality_assessment.overall_score) }}/100
- **完整性**: {{ "%.1f"|format(data.quality_assessment.completeness_score) }}%
- **准确性**: {{ "%.1f"|format(data.quality_assessment.accuracy_score) }}%
- **有用性**: {{ "%.1f"|format(data.quality_assessment.usefulness_score) }}%
{% endif %}
        """.strip()

    def _get_design_summary_template(self) -> str:
        """获取设计审查摘要模板"""
        return """
# 执行摘要

## 项目概述
本报告基于对设计文件的深度质量审查，从设计识别、渠道适配、质量门控三个维度进行全面评估，确保设计符合业务要求和渠道标准。

## 关键发现
{% if data.design_recognition.design_type %}
- **设计类型**: {{ data.design_recognition.design_type }}
{% endif %}
{% if data.channel_analysis.identified_channels %}
- **适用渠道**: {{ data.channel_analysis.identified_channels | join(', ') }}
{% endif %}
{% if data.channel_analysis.compatibility_score %}
- **渠道兼容性**: {{ "%.1f"|format(data.channel_analysis.compatibility_score * 100) }}%
{% endif %}

## 质量评估结果
{% if data.quality_gates.overall_score %}
- **总体质量分数**: {{ "%.1f"|format(data.quality_gates.overall_score * 100) }}%
- **合规性检查**: {{ "通过" if data.quality_gates.compliance_check.passed else "未通过" }}
- **技术标准**: {{ "通过" if data.quality_gates.technical_standards.passed else "未通过" }}
- **品牌一致性**: {{ "通过" if data.quality_gates.brand_consistency.passed else "未通过" }}
- **用户体验**: {{ "通过" if data.quality_gates.user_experience.passed else "未通过" }}
{% endif %}

{% if data.quality_gates.blocking_issues %}
## 阻塞问题
{% for issue in data.quality_gates.blocking_issues %}
- **{{ issue.gate }}**: {{ issue.issue }} ({{ issue.severity }})
{% endfor %}
{% endif %}

## 发布建议
{% if data.recommendations.release_readiness %}
✅ **发布就绪**: 符合所有质量要求，可以发布
{% else %}
⚠️ **需要优化**: 存在需要解决的问题，不建议立即发布
{% endif %}

{% if data.recommendations.immediate_actions %}
## 即时行动
{% for action in data.recommendations.immediate_actions %}
- {{ action }}
{% endfor %}
{% endif %}
        """.strip()

    def _get_project_summary_template(self) -> str:
        """获取项目协调摘要模板"""
        return """
# 执行摘要

## 项目概述
本报告基于项目复杂度评估和能力分析，为项目协调提供科学的决策依据和资源配置建议。

## 复杂度评估
{% if data.complexity_assessment.overall_score %}
- **总体复杂度分数**: {{ "%.1f"|format(data.complexity_assessment.overall_score) }}/100
- **复杂度等级**: {{ data.complexity_assessment.complexity_level | default('待评估') }}
{% endif %}

## 能力需求分析
{% if data.capability_analysis.required_capabilities %}
- **所需能力**: {{ data.capability_analysis.required_capabilities | length }}项
- **核心能力**: {{ data.capability_analysis.core_capabilities | join(', ') | default('待识别') }}
{% endif %}

## 协调方案
{% if data.coordination_solution.strategy %}
- **协调策略**: {{ data.coordination_solution.strategy }}
- **资源分配**: {{ data.coordination_solution.resource_allocation | default('待制定') }}
{% endif %}

## 关键指标
{% if data.coordination_metrics.efficiency_metrics %}
### 效率指标
{% for metric, value in data.coordination_metrics.efficiency_metrics.items() %}
- **{{ metric }}**: {{ value }}
{% endfor %}
{% endif %}

{% if data.coordination_metrics.quality_metrics %}
### 质量指标
{% for metric, value in data.coordination_metrics.quality_metrics.items() %}
- **{{ metric }}**: {{ value }}
{% endfor %}
{% endif %}

## 实施建议
{% if data.coordination_solution.implementation_roadmap %}
- **实施阶段**: {{ data.coordination_solution.implementation_roadmap.phase_count | default('待定义') }}个阶段
- **预计周期**: {{ data.coordination_solution.implementation_roadmap.timeline | default('待评估') }}
{% endif %}
        """.strip()

    def _generate_fallback_summary(self, data: Dict, specialization: str) -> str:
        """生成备用摘要"""
        return f"""
# 执行摘要

本报告针对{specialization}进行了全面分析。分析涵盖了数据质量、业务洞察和建议等关键方面。

## 主要发现
- 数据来源已成功处理
- 质量评估已完成
- 业务洞察已生成

## 建议
基于分析结果，建议继续关注数据质量和业务流程优化。

## 结论
自动化分析系统成功完成了对输入数据的处理和分析。
        """.strip()

    def _generate_main_content(self, data: Dict, specialization: str) -> Dict:
        """生成主要内容"""
        sections = self.config['report_sections'].get(specialization, [])
        main_content = {}

        for section in sections:
            if section == 'executive_summary':
                continue  # 已经单独生成
            elif section == 'data_overview' and specialization == 'excel_analyzer':
                main_content[section] = self._generate_data_overview(data)
            elif section == 'business_insights' and specialization == 'excel_analyzer':
                main_content[section] = self._generate_business_insights(data)
            elif section == 'design_analysis' and specialization == 'design_reviewer':
                main_content[section] = self._generate_design_analysis(data)
            elif section == 'quality_assessment':
                main_content[section] = self._generate_quality_assessment_section(data)
            elif section == 'complexity_assessment' and specialization == 'project_coordinator':
                main_content[section] = self._generate_complexity_assessment_section(data)
            else:
                main_content[section] = self._generate_generic_section(data, section)

        return main_content

    def _generate_data_overview(self, data: Dict) -> str:
        """生成数据概览"""
        structure = data.get('structure_analysis', {})
        
        overview = f"""
## 数据概览

### 文件信息
- **文件大小**: {structure.get('file_size', 0)} 字节
- **工作表数量**: {len(structure.get('worksheets', []))}
- **共享字符串数量**: {len(structure.get('shared_strings', []))}

### 工作表详情
"""
        
        for worksheet in structure.get('worksheets', []):
            overview += f"""
#### {worksheet['name']}
- **数据行数**: {worksheet.get('data_rows', 0)}
- **列数**: {len(worksheet.get('columns', []))}
- **列名**: {', '.join(worksheet.get('columns', [])[:5])}{'...' if len(worksheet.get('columns', [])) > 5 else ''}
"""
        
        return overview.strip()

    def _generate_business_insights(self, data: Dict) -> str:
        """生成业务洞察"""
        business = data.get('business_analysis', {})
        
        insights = f"""
## 业务洞察

### 业务模式识别
"""
        
        for pattern in business.get('business_patterns', []):
            insights += f"""
#### {pattern['sheet_name']}
- **业务意图**: {pattern['business_intent']}
- **数据结构**: {pattern['data_structure']['column_count']}列，{pattern['data_structure']['row_count']}行
- **数据密度**: {pattern['data_structure']['data_density']:.1%}
"""
        
        if business.get('recommendations'):
            insights += f"""
### 业务建议
"""
            for rec in business['recommendations']:
                insights += f"- {rec}\n"
        
        return insights.strip()

    def _generate_design_analysis(self, data: Dict) -> str:
        """生成设计分析"""
        design = data.get('design_recognition', {})
        channel = data.get('channel_analysis', {})
        
        analysis = f"""
## 设计分析

### 设计识别
- **设计类型**: {design.get('design_type', '未知')}
- **版本信息**: {design.get('version_info', {}).get('review_status', '未知')}
- **内容指标**: {design.get('content_indicators', {})}

### 渠道适配分析
- **识别渠道**: {', '.join(channel.get('identified_channels', []))}
- **兼容性分数**: {channel.get('compatibility_score', 0):.2f}

### 适配建议
"""
        
        for suggestion in channel.get('adaptation_suggestions', []):
            analysis += f"- {suggestion}\n"
        
        return analysis.strip()

    def _generate_quality_assessment_section(self, data: Dict) -> str:
        """生成质量评估章节"""
        quality_key = None
        
        # 根据数据结构找到质量评估信息
        if 'quality_assessment' in data:
            quality_key = 'quality_assessment'
        elif 'quality_gates' in data:
            quality_key = 'quality_gates'
        
        if not quality_key:
            return "## 质量评估\n\n质量评估数据暂未提供。"
        
        quality = data[quality_key]
        
        assessment = f"""
## 质量评估

### 总体评分
- **质量分数**: {quality.get('overall_score', 0):.1%}
- **评估状态**: {'通过' if quality.get('overall_score', 0) > 0.7 else '需要改进'}

### 详细指标
"""
        
        if 'completeness_score' in quality:
            assessment += f"- **完整性**: {quality['completeness_score']:.1%}\n"
        if 'accuracy_score' in quality:
            assessment += f"- **准确性**: {quality['accuracy_score']:.1%}\n"
        if 'usefulness_score' in quality:
            assessment += f"- **有用性**: {quality['usefulness_score']:.1%}\n"
        
        return assessment.strip()

    def _generate_complexity_assessment_section(self, data: Dict) -> str:
        """生成复杂度评估章节"""
        complexity = data.get('complexity_assessment', {})
        
        assessment = f"""
## 复杂度评估

### 评估结果
- **复杂度分数**: {complexity.get('overall_score', 0):.1f}/100
- **复杂度等级**: {complexity.get('complexity_level', '未定义')}

### 评估维度
"""
        
        if 'dimensional_scores' in complexity:
            for dimension, score in complexity['dimensional_scores'].items():
                assessment += f"- **{dimension}**: {score:.1f}/100\n"
        
        return assessment.strip()

    def _generate_generic_section(self, data: Dict, section_name: str) -> str:
        """生成通用章节"""
        return f"""
## {section_name}

本章节内容基于输入数据自动生成。

### 分析结果
- 数据处理完成
- 分析结果已整合
- 建议已生成

更多详细信息请参考相关章节。
        """.strip()

    def _generate_recommendations(self, data: Dict, specialization: str) -> List[str]:
        """生成建议"""
        recommendations = []
        
        # 基于特化类型生成建议
        if specialization == 'excel_analyzer':
            business = data.get('business_analysis', {})
            recommendations.extend(business.get('recommendations', []))
        elif specialization == 'design_reviewer':
            recs = data.get('recommendations', {})
            recommendations.extend(recs.get('immediate_actions', []))
            recommendations.extend(recs.get('optimization_suggestions', []))
        elif specialization == 'project_coordinator':
            solution = data.get('coordination_solution', {})
            if isinstance(solution, dict):
                recommendations.append("建议按照协调方案执行项目")
                recommendations.append("定期监控项目进展和质量指标")
        
        # 添加通用建议
        if not recommendations:
            recommendations = [
                "继续关注数据质量和业务流程优化",
                "建立定期评估和改进机制",
                "加强跨部门协作和沟通"
            ]
        
        return recommendations

    def _generate_appendix(self, data: Dict, specialization: str) -> Dict:
        """生成附录"""
        appendix = {
            'technical_details': self._generate_technical_details(data),
            'data_sources': self._generate_data_sources(data),
            'methodology': self._generate_methodology(specialization)
        }

        return appendix

    def _generate_technical_details(self, data: Dict) -> str:
        """生成技术细节"""
        return """
## 技术细节

### 分析方法
- 自动化数据处理
- 智能模式识别
- 质量评估算法
- 业务逻辑推理

### 技术栈
- Python数据处理
- 机器学习算法
- 自然语言处理
- 模板引擎渲染

### 质量保障
- 多维度验证
- 自动化测试
- 结果一致性检查
- 错误处理机制
        """.strip()

    def _generate_data_sources(self, data: Dict) -> List[str]:
        """生成数据源信息"""
        sources = []
        
        # 从数据中提取数据源信息
        if 'file_path' in data:
            sources.append(f"主数据源: {data['file_path']}")
        
        if 'timestamp' in data:
            sources.append(f"数据时间戳: {data['timestamp']}")
        
        if not sources:
            sources = ["数据源: 自动化分析系统", "时间戳: " + datetime.now().isoformat()]
        
        return sources

    def _generate_methodology(self, specialization: str) -> str:
        """生成方法论说明"""
        methodology_mapping = {
            'excel_analyzer': """
### Excel分析方法论
1. **结构解析**: 使用XML解析技术深度解析Excel文件结构
2. **业务识别**: 基于列名和数据内容识别业务模式
3. **质量评估**: 多维度评估数据质量和完整性
4. **洞察生成**: 运用业务规则生成可操作洞察
            """.strip(),
            'design_reviewer': """
### 设计审查方法论
1. **设计识别**: 分析文件命名和路径推断设计特征
2. **渠道适配**: 评估设计在不同渠道的适配性
3. **质量门控**: 多层次质量检查和风险评估
4. **建议生成**: 基于分析结果生成优化建议
            """.strip(),
            'project_coordinator': """
### 项目协调方法论
1. **复杂度评估**: 多维度评估项目复杂度和风险
2. **能力匹配**: 分析项目需求和可用能力资源
3. **协调规划**: 制定科学的协调方案和资源分配
4. **执行监控**: 建立执行监控和质量保障机制
            """.strip()
        }
        
        return methodology_mapping.get(specialization, "通用分析方法论")

    def _generate_single_report(self, content: Dict, format_type: str, specialization: str) -> Dict:
        """生成单个格式的报告"""
        if format_type == 'markdown':
            return self._generate_markdown_report(content, specialization)
        elif format_type == 'html':
            return self._generate_html_report(content, specialization)
        elif format_type == 'json':
            return self._generate_json_report(content, specialization)
        else:
            return {'success': False, 'error': f'不支持的格式: {format_type}'}

    def _generate_markdown_report(self, content: Dict, specialization: str) -> Dict:
        """生成Markdown格式报告"""
        try:
            report_content = f"""# {content['metadata']['report_title']}

{content['executive_summary']}

---

{self._render_main_content(content['main_content'])}

---

## 建议与行动项
"""
            
            for i, recommendation in enumerate(content['recommendations'], 1):
                report_content += f"\n{i}. {recommendation}"
            
            report_content += "\n\n---\n\n## 附录\n\n"
            report_content += content['appendix']['technical_details']
            
            result = {
                'success': True,
                'content': report_content,
                'file_extension': '.md',
                'mime_type': 'text/markdown'
            }
            
        except Exception as e:
            result = {
                'success': False,
                'error': f'Markdown生成失败: {str(e)}'
            }
        
        return result

    def _render_main_content(self, main_content: Dict) -> str:
        """渲染主要内容"""
        rendered = ""
        
        for section_name, section_content in main_content.items():
            if isinstance(section_content, str):
                rendered += f"\n{section_content}\n\n"
            elif isinstance(section_content, dict):
                rendered += f"## {section_name}\n\n"
                for key, value in section_content.items():
                    rendered += f"- **{key}**: {value}\n"
                rendered += "\n"
        
        return rendered.strip()

    def _generate_html_report(self, content: Dict, specialization: str) -> Dict:
        """生成HTML格式报告"""
        try:
            # 先生成Markdown
            md_result = self._generate_markdown_report(content, specialization)
            if not md_result['success']:
                return md_result
            
            # 转换为HTML
            html_content = markdown.markdown(md_result['content'], extensions=['tables', 'fenced_code'])
            
            # 添加HTML模板
            full_html = f"""<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{content['metadata']['report_title']}</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }}
        h1, h2, h3 {{
            color: #2c3e50;
            margin-top: 30px;
        }}
        table {{
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
        }}
        th, td {{
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }}
        th {{
            background-color: #f8f9fa;
        }}
        code {{
            background-color: #f4f4f4;
            padding: 2px 4px;
            border-radius: 3px;
        }}
        .metadata {{
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }}
    </style>
</head>
<body>
    <div class="metadata">
        <p><strong>生成时间:</strong> {content['metadata']['generation_date']}</p>
        <p><strong>报告类型:</strong> {content['metadata']['specialization']}</p>
        <p><strong>版本:</strong> {content['metadata']['version']}</p>
    </div>
    {html_content}
</body>
</html>"""
            
            result = {
                'success': True,
                'content': full_html,
                'file_extension': '.html',
                'mime_type': 'text/html'
            }
            
        except Exception as e:
            result = {
                'success': False,
                'error': f'HTML生成失败: {str(e)}'
            }
        
        return result

    def _generate_json_report(self, content: Dict, specialization: str) -> Dict:
        """生成JSON格式报告"""
        try:
            # 准备JSON数据
            json_data = {
                'metadata': content['metadata'],
                'executive_summary': content['executive_summary'],
                'main_content': content['main_content'],
                'recommendations': content['recommendations'],
                'appendix': content['appendix'],
                'generation_info': {
                    'generator': 'ReportAutoGenerator',
                    'specialization': specialization,
                    'timestamp': datetime.now().isoformat()
                }
            }
            
            result = {
                'success': True,
                'content': json_data,
                'file_extension': '.json',
                'mime_type': 'application/json'
            }
            
        except Exception as e:
            result = {
                'success': False,
                'error': f'JSON生成失败: {str(e)}'
            }
        
        return result

    def _assess_report_quality(self, content: Dict, format_results: Dict) -> Dict:
        """评估报告质量"""
        quality = {
            'content_quality': self._assess_content_quality(content),
            'format_quality': self._assess_format_quality(format_results),
            'overall_score': 0.0,
            'issues': [],
            'recommendations': []
        }

        # 计算总体分数
        content_score = quality['content_quality']['score']
        format_score = quality['format_quality']['score']
        quality['overall_score'] = (content_score + format_score) / 2

        # 收集问题
        quality['issues'].extend(quality['content_quality']['issues'])
        quality['issues'].extend(quality['format_quality']['issues'])

        # 生成改进建议
        if quality['overall_score'] < 0.8:
            quality['recommendations'].append("建议增加更多细节和分析深度")
        if len(quality['issues']) > 0:
            quality['recommendations'].append("需要解决报告中的质量问题")

        return quality

    def _assess_content_quality(self, content: Dict) -> Dict:
        """评估内容质量"""
        quality = {
            'score': 0.0,
            'issues': []
        }

        score = 0
        
        # 检查元数据
        if content.get('metadata'):
            score += 20
        else:
            quality['issues'].append("缺少元数据")
        
        # 检查执行摘要
        if content.get('executive_summary') and len(content['executive_summary']) > 100:
            score += 30
        else:
            quality['issues'].append("执行摘要过于简短")
        
        # 检查主要内容
        if content.get('main_content') and len(content['main_content']) > 0:
            score += 30
        else:
            quality['issues'].append("缺少主要内容")
        
        # 检查建议
        if content.get('recommendations') and len(content['recommendations']) > 0:
            score += 20
        else:
            quality['issues'].append("缺少建议和行动项")
        
        quality['score'] = score
        
        return quality

    def _assess_format_quality(self, format_results: Dict) -> Dict:
        """评估格式质量"""
        quality = {
            'score': 0.0,
            'issues': []
        }

        successful_formats = sum(1 for result in format_results.values() if result.get('success', False))
        total_formats = len(format_results)

        if total_formats > 0:
            quality['score'] = (successful_formats / total_formats) * 100
        else:
            quality['issues'].append("没有成功生成任何格式")

        # 检查每种格式的问题
        for format_type, result in format_results.items():
            if not result.get('success', False):
                quality['issues'].append(f"{format_type}格式生成失败: {result.get('error', '未知错误')}")

        return quality

    def _log_execution(self, specialization: str, output_formats: List[str], quality_result: Dict):
        """记录执行日志"""
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'specialization': specialization,
            'output_formats': output_formats,
            'overall_quality_score': quality_result.get('overall_score', 0),
            'issues_count': len(quality_result.get('issues', [])),
            'status': 'success'
        }

        self.logger.info(f"执行日志: {json.dumps(log_entry, ensure_ascii=False, indent=2)}")

    def save_report(self, report_result: Dict, output_dir: str, filename_prefix: str = None) -> Dict:
        """保存报告到文件"""
        if not report_result.get('success', False):
            return {'success': False, 'error': '报告生成失败，无法保存'}

        try:
            os.makedirs(output_dir, exist_ok=True)
            
            specialization = report_result.get('specialization', 'report')
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            
            if filename_prefix is None:
                filename_prefix = f"{specialization}_report"
            
            saved_files = {}
            
            for format_type, format_result in report_result.get('formats', {}).items():
                if format_result.get('success', False):
                    filename = f"{filename_prefix}_{timestamp}_{format_type}{format_result.get('file_extension', '.txt')}"
                    file_path = os.path.join(output_dir, filename)
                    
                    if format_type == 'json':
                        with open(file_path, 'w', encoding='utf-8') as f:
                            json.dump(format_result['content'], f, ensure_ascii=False, indent=2)
                    else:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(format_result['content'])
                    
                    saved_files[format_type] = file_path
            
            result = {
                'success': True,
                'saved_files': saved_files,
                'output_directory': output_dir
            }
            
            self.logger.info(f"报告已保存到: {output_dir}")
            
        except Exception as e:
            result = {
                'success': False,
                'error': f"保存报告失败: {str(e)}"
            }
        
        return result


def main():
    """主函数示例"""
    generator = ReportAutoGenerator()

    # 示例数据
    sample_data = {
        'structure_analysis': {
            'file_size': 1024,
            'worksheets': [{'name': 'Sheet1', 'data_rows': 100}]
        },
        'business_analysis': {
            'file_type': 'customer_data',
            'data_quality_score': 85.0,
            'recommendations': ['建议增加数据验证', '优化数据结构']
        }
    }

    # 生成报告
    result = generator.generate_report(
        data=sample_data,
        specialization='excel_analyzer',
        output_formats=['markdown', 'html', 'json']
    )

    if result['success']:
        print("报告生成成功!")
        print(f"质量分数: {result['quality_assessment']['overall_score']:.2f}")
        
        # 保存报告
        save_result = generator.save_report(result, './output')
        if save_result['success']:
            print(f"报告已保存: {save_result['saved_files']}")
    else:
        print(f"报告生成失败: {result['error']}")


if __name__ == "__main__":
    main()