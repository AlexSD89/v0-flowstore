#!/usr/bin/env python3
"""
质量检查器 (Quality Checker) - DELIVER_CHECK阶段实现
基于AI项目档案管理工作流v2.4-完整版的三层质量验证体系要求

核心功能:
- 模板对齐度检查 (100%要求)
- 数据完整性验证 (≥90%要求)
- 逻辑一致性检查
- VI区数据锚点验证
- 综合质量评分系统 (≥85分)
"""

import re
import json
import hashlib
from typing import Dict, List, Tuple, Any, Optional
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path


@dataclass
class QualityMetrics:
    """质量指标数据类"""
    template_compliance: float  # 模板对齐度 (0-100)
    data_completeness: float    # 数据完整性 (0-100)
    logical_consistency: float  # 逻辑一致性 (0-100)
    vi_zone_compliance: float   # VI区数据锚点合规性 (0-100)
    overall_score: float        # 综合质量评分 (0-100)
    passed_threshold: bool      # 是否通过阈值 (≥85分)
    detailed_analysis: Dict[str, Any]  # 详细分析结果


class QualityChecker:
    """质量检查器 - DELIVER_CHECK阶段核心实现"""

    def __init__(self):
        self.template_requirements = self._load_template_requirements()
        self.vi_zone_requirements = self._load_vi_zone_requirements()
        self.quality_thresholds = {
            "template_compliance": 100.0,  # 必须100%对齐
            "data_completeness": 90.0,    # 至少90%完整
            "logical_consistency": 80.0,   # 至少80%一致
            "vi_zone_compliance": 95.0,    # 至少95%VI区合规
            "overall_score": 85.0          # 综合至少85分
        }

    def _load_template_requirements(self) -> Dict[str, Any]:
        """加载模板要求配置"""
        return {
            "required_sections": [
                "## 1. 项目核心概览",
                "## 1.1 价值定位",
                "## 1.2 关键数据快照",
                "## 1.3 发展阶段判断",
                "## 1.4 团队核心优势",
                "## 2. 核心数据分析",
                "## 2.1 融资历程与估值增长",
                "## 2.2 用户增长与留存数据",
                "## 2.3 收入结构与盈利模式",
                "## 8. 完整数据溯源"
            ],
            "vi_zone_sections": [
                "### A区：基础信息数据",
                "### B区：市场与商业数据",
                "### C区：技术产品数据",
                "### D区：财务投资数据",
                "### E区：LaunchX集成数据",
                "### F区：知识价值数据",
                "### G区：补充信息"
            ],
            "critical_tables": [
                "核心指标", "具体数据", "数据来源", "可信度"
            ],
            "required_metadata": [
                "一句话定位", "核心标签", "当前阶段", "核心优势"
            ]
        }

    def _load_vi_zone_requirements(self) -> Dict[str, Any]:
        """加载VI区数据锚点要求"""
        return {
            "zone_a": {
                "name": "基础信息数据",
                "required_fields": [
                    "基本信息", "当前估值", "最新轮次", "成立时间", "总部地点"
                ],
                "min_credibility": 0.8
            },
            "zone_b": {
                "name": "市场与商业数据",
                "required_fields": [
                    "市场份额", "客户数量", "竞争地位", "市场规模"
                ],
                "min_credibility": 0.7
            },
            "zone_c": {
                "name": "技术产品数据",
                "required_fields": [
                    "核心产品", "专利数量", "技术团队", "研发投入"
                ],
                "min_credibility": 0.8
            },
            "zone_d": {
                "name": "财务投资数据",
                "required_fields": [
                    "ARR收入", "增长率", "盈利状况", "投资方"
                ],
                "min_credibility": 0.9
            },
            "zone_e": {
                "name": "LaunchX集成数据",
                "required_fields": [
                    "集成状态", "API可用性", "文档完整性", "社区活跃度"
                ],
                "min_credibility": 0.7
            },
            "zone_f": {
                "name": "知识价值数据",
                "required_fields": [
                    "行业洞察", "趋势分析", "竞争分析", "机会识别"
                ],
                "min_credibility": 0.6
            },
            "zone_g": {
                "name": "补充信息",
                "required_fields": [
                    "媒体报道", "用户评价", "专家观点", "其他数据"
                ],
                "min_credibility": 0.5
            }
        }

    def check_template_compliance(self, content: str) -> Tuple[float, Dict[str, Any]]:
        """
        模板对齐度检查 (100%要求)

        Args:
            content: 待检查内容

        Returns:
            Tuple[对齐度分数, 详细分析]
        """
        analysis = {
            "missing_sections": [],
            "present_sections": [],
            "section_analysis": {},
            "format_issues": [],
            "total_required": len(self.template_requirements["required_sections"]),
            "total_present": 0
        }

        content_lower = content.lower()
        compliance_score = 0.0
        section_weight = 100.0 / len(self.template_requirements["required_sections"])

        # 检查必需章节
        for section in self.template_requirements["required_sections"]:
            section_lower = section.lower()
            if section_lower in content_lower:
                analysis["present_sections"].append(section)
                analysis["section_analysis"][section] = {
                    "status": "present",
                    "confidence": self._calculate_section_presence_confidence(content, section)
                }
                compliance_score += section_weight
                analysis["total_present"] += 1
            else:
                analysis["missing_sections"].append(section)
                analysis["section_analysis"][section] = {
                    "status": "missing",
                    "suggestions": self._generate_section_suggestions(section)
                }

        # 检查VI区结构
        vi_compliance = self._check_vi_zone_structure(content)
        analysis["vi_zone_analysis"] = vi_compliance

        # 检查表格格式
        table_issues = self._check_table_format(content)
        analysis["format_issues"].extend(table_issues)

        # 计算格式合规性扣分
        if analysis["format_issues"]:
            format_deduction = min(10.0, len(analysis["format_issues"]) * 2.0)
            compliance_score = max(0.0, compliance_score - format_deduction)

        return compliance_score, analysis

    def _calculate_section_presence_confidence(self, content: str, section: str) -> float:
        """计算章节存在置信度"""
        section_pattern = re.escape(section)
        matches = re.findall(section_pattern, content, re.IGNORECASE)

        # 基础置信度基于匹配次数
        confidence = min(1.0, len(matches) * 0.5)

        # 检查章节下是否有实质内容
        section_pos = content.lower().find(section.lower())
        if section_pos != -1:
            # 提取章节后的内容 (最多1000字符)
            remaining_content = content[section_pos + len(section):section_pos + len(section) + 1000]
            if len(remaining_content.strip()) > 50:
                confidence = min(1.0, confidence + 0.3)

        return confidence

    def _generate_section_suggestions(self, section: str) -> List[str]:
        """生成缺失章节的建议"""
        suggestions = []

        section_suggestions = {
            "## 1. 项目核心概览": [
                "添加项目基本介绍和定位描述",
                "包含一句话价值定位",
                "概述核心业务和目标用户"
            ],
            "## 1.1 价值定位": [
                "添加一句话定位描述",
                "包含核心标签列表",
                "明确项目独特价值主张"
            ],
            "## 1.2 关键数据快照": [
                "创建关键指标表格",
                "包含成立时间、融资阶段、团队规模等数据",
                "添加数据来源和可信度评级"
            ],
            "## 8. 完整数据溯源": [
                "添加VI区数据锚点结构",
                "按A-G区域组织数据溯源信息",
                "确保所有关键数据都有明确来源"
            ]
        }

        return section_suggestions.get(section, ["请参考标准模板添加此章节内容"])

    def _check_vi_zone_structure(self, content: str) -> Dict[str, Any]:
        """检查VI区结构合规性"""
        vi_analysis = {
            "present_zones": [],
            "missing_zones": [],
            "zone_details": {},
            "compliance_score": 0.0
        }

        content_lower = content.lower()
        zones_found = 0
        zone_weight = 100.0 / len(self.vi_zone_requirements)

        for zone_key, zone_info in self.vi_zone_requirements.items():
            zone_pattern = f"### {zone_key[0].upper()}区：{zone_info['name']}".lower()

            if zone_pattern in content_lower:
                vi_analysis["present_zones"].append(zone_key)
                vi_analysis["zone_details"][zone_key] = {
                    "status": "present",
                    "required_fields_count": len(zone_info["required_fields"]),
                    "field_analysis": self._analyze_zone_fields(content, zone_key, zone_info)
                }
                zones_found += 1
            else:
                vi_analysis["missing_zones"].append(zone_key)
                vi_analysis["zone_details"][zone_key] = {
                    "status": "missing",
                    "required_fields": zone_info["required_fields"]
                }

        vi_analysis["compliance_score"] = (zones_found / len(self.vi_zone_requirements)) * 100

        return vi_analysis

    def _analyze_zone_fields(self, content: str, zone_key: str, zone_info: Dict[str, Any]) -> Dict[str, Any]:
        """分析VI区域字段完整性"""
        field_analysis = {
            "present_fields": [],
            "missing_fields": [],
            "credibility_scores": []
        }

        # 提取该区域的内容
        zone_pattern = f"### {zone_key[0].upper()}区：{zone_info['name']}"
        zone_start = content.lower().find(zone_pattern.lower())

        if zone_start != -1:
            # 找到下一个区域的位置作为内容边界
            next_zone_start = len(content)
            for next_key in self.vi_zone_requirements:
                if next_key > zone_key:
                    next_pattern = f"### {next_key[0].upper()}区："
                    next_pos = content.lower().find(next_pattern.lower())
                    if next_pos != -1 and next_pos > zone_start:
                        next_zone_start = next_pos
                        break

            zone_content = content[zone_start:next_zone_start]

            # 检查必需字段
            for field in zone_info["required_fields"]:
                if field.lower() in zone_content.lower():
                    field_analysis["present_fields"].append(field)
                    # 尝试提取可信度评分
                    credibility = self._extract_field_credibility(zone_content, field)
                    if credibility is not None:
                        field_analysis["credibility_scores"].append(credibility)
                else:
                    field_analysis["missing_fields"].append(field)

        return field_analysis

    def _extract_field_credibility(self, zone_content: str, field: str) -> Optional[float]:
        """提取字段的可信度评分"""
        # 查找字段后的可信度星级或评分
        field_pattern = re.escape(field)
        credibility_pattern = r'(?:★+|★☆+| credibility:|可信度:)\s*([0-9.]+|★+)'

        field_pos = zone_content.lower().find(field.lower())
        if field_pos != -1:
            # 在字段后100字符内查找可信度信息
            search_content = zone_content[field_pos:field_pos + 100]
            match = re.search(credibility_pattern, search_content)

            if match:
                credibility_str = match.group(1)
                if '★' in credibility_str:
                    # 星级评分转换
                    star_count = credibility_str.count('★')
                    return star_count * 0.2  # 5星制，每颗星0.2分
                else:
                    # 数字评分
                    try:
                        return float(credibility_str)
                    except ValueError:
                        pass

        return None

    def _check_table_format(self, content: str) -> List[str]:
        """检查表格格式问题"""
        issues = []

        # 检查表格语法
        table_patterns = [
            r'\|.*\|',  # 基础表格语法
            r'\|:-+\|',  # 表头分隔符
        ]

        has_basic_table = any(re.search(pattern, content) for pattern in table_patterns)

        if has_basic_table:
            # 检查关键数据表格是否存在
            if "核心指标" not in content and "关键数据快照" in content:
                issues.append("关键数据快照部分缺少数据表格")

            # 检查表格对齐
            lines = content.split('\n')
            for i, line in enumerate(lines):
                if '|' in line and i + 1 < len(lines):
                    next_line = lines[i + 1]
                    if '|' in next_line and '---' not in next_line and ':---' not in next_line:
                        issues.append(f"第{i+1}行表格缺少表头分隔符")
                        break
        else:
            issues.append("文档缺少数据表格格式")

        return issues

    def check_data_completeness(self, content: str) -> Tuple[float, Dict[str, Any]]:
        """
        数据完整性验证 (≥90%要求)

        Args:
            content: 待检查内容

        Returns:
            Tuple[完整性分数, 详细分析]
        """
        analysis = {
            "data_points_found": [],
            "critical_missing_data": [],
            "data_quality_score": 0.0,
            "credibility_distribution": {},
            "completeness_by_category": {}
        }

        # 定义关键数据类别
        data_categories = {
            "basic_info": {
                "name": "基础信息",
                "fields": ["成立时间", "总部地点", "CEO", "团队规模"],
                "weight": 0.25
            },
            "funding_data": {
                "name": "融资数据",
                "fields": ["最新轮次", "融资金额", "估值", "投资方"],
                "weight": 0.25
            },
            "business_data": {
                "name": "业务数据",
                "fields": ["用户规模", "收入", "增长率", "客户数量"],
                "weight": 0.20
            },
            "technical_data": {
                "name": "技术数据",
                "fields": ["核心产品", "技术栈", "专利", "研发投入"],
                "weight": 0.15
            },
            "market_data": {
                "name": "市场数据",
                "fields": ["市场份额", "竞争对手", "市场规模", "行业地位"],
                "weight": 0.15
            }
        }

        total_weighted_score = 0.0
        total_weight = 0.0

        for category_key, category_info in data_categories.items():
            category_score = self._check_category_completeness(content, category_info)
            analysis["completeness_by_category"][category_key] = {
                "name": category_info["name"],
                "score": category_score,
                "details": self._get_category_details(content, category_info["fields"])
            }

            total_weighted_score += category_score * category_info["weight"]
            total_weight += category_info["weight"]

        # 计算总体完整性分数
        overall_completeness = total_weighted_score / total_weight if total_weight > 0 else 0.0
        analysis["data_quality_score"] = overall_completeness

        # 识别关键缺失数据
        analysis["critical_missing_data"] = self._identify_critical_missing_data(
            content, data_categories
        )

        # 分析可信度分布
        analysis["credibility_distribution"] = self._analyze_credibility_distribution(content)

        return overall_completeness, analysis

    def _check_category_completeness(self, content: str, category_info: Dict[str, Any]) -> float:
        """检查特定类别的完整性"""
        fields_found = 0
        total_fields = len(category_info["fields"])

        for field in category_info["fields"]:
            if field.lower() in content.lower():
                fields_found += 1

        return (fields_found / total_fields) * 100.0 if total_fields > 0 else 0.0

    def _get_category_details(self, content: str, fields: List[str]) -> Dict[str, Any]:
        """获取类别详细信息"""
        details = {
            "present_fields": [],
            "missing_fields": [],
            "field_quality": {}
        }

        for field in fields:
            if field.lower() in content.lower():
                details["present_fields"].append(field)
                # 评估字段数据质量
                quality = self._assess_field_data_quality(content, field)
                details["field_quality"][field] = quality
            else:
                details["missing_fields"].append(field)

        return details

    def _assess_field_data_quality(self, content: str, field: str) -> Dict[str, Any]:
        """评估字段数据质量"""
        quality = {
            "has_specific_value": False,
            "has_source_reference": False,
            "has_credibility_rating": False,
            "quality_score": 0.0
        }

        # 查找字段相关内容
        field_pos = content.lower().find(field.lower())
        if field_pos != -1:
            # 检查字段后100字符内的内容
            field_context = content[field_pos:field_pos + 200]

            # 检查是否有具体数值
            number_pattern = r'\d+(?:\.\d+)?%?|\$\d+(?:\.\d+)?[kMB]?'
            if re.search(number_pattern, field_context):
                quality["has_specific_value"] = True

            # 检查是否有来源引用
            source_patterns = [r'来源:.*?\|', r'数据来源:.*?\|', r'source:.*?\|']
            for pattern in source_patterns:
                if re.search(pattern, field_context):
                    quality["has_source_reference"] = True
                    break

            # 检查是否有可信度评级
            credibility_patterns = [r'★+', r'可信度:\s*\d+', r'credibility:\s*\d+']
            for pattern in credibility_patterns:
                if re.search(pattern, field_context):
                    quality["has_credibility_rating"] = True
                    break

            # 计算质量分数
            score = 0
            if quality["has_specific_value"]:
                score += 40
            if quality["has_source_reference"]:
                score += 30
            if quality["has_credibility_rating"]:
                score += 30

            quality["quality_score"] = score

        return quality

    def _identify_critical_missing_data(self, content: str, data_categories: Dict[str, Any]) -> List[str]:
        """识别关键缺失数据"""
        critical_missing = []

        # 高优先级类别
        high_priority_categories = ["basic_info", "funding_data"]

        for category_key in high_priority_categories:
            if category_key in data_categories:
                category_info = data_categories[category_key]
                for field in category_info["fields"]:
                    if field.lower() not in content.lower():
                        critical_missing.append(f"{category_info['name']}: {field}")

        return critical_missing

    def _analyze_credibility_distribution(self, content: str) -> Dict[str, Any]:
        """分析可信度分布"""
        distribution = {
            "high_credibility": 0,    # ≥0.8
            "medium_credibility": 0,  # 0.5-0.8
            "low_credibility": 0,     # <0.5
            "unrated": 0,
            "average_credibility": 0.0,
            "total_credible_items": 0
        }

        # 提取所有可信度评分
        credibility_scores = []

        # 星级评分
        star_matches = re.findall(r'(★+)', content)
        for stars in star_matches:
            score = len(stars) * 0.2  # 5星制
            credibility_scores.append(min(1.0, score))

        # 数字评分
        number_matches = re.findall(r'(?:可信度|credibility|rating):\s*([0-9.]+)', content, re.IGNORECASE)
        for num_str in number_matches:
            try:
                score = float(num_str)
                if score > 1.0:  # 如果是百分制，转换为小数
                    score = score / 100.0
                credibility_scores.append(min(1.0, score))
            except ValueError:
                pass

        # 分类统计
        for score in credibility_scores:
            if score >= 0.8:
                distribution["high_credibility"] += 1
            elif score >= 0.5:
                distribution["medium_credibility"] += 1
            else:
                distribution["low_credibility"] += 1
            distribution["total_credible_items"] += 1

        # 计算平均可信度
        if credibility_scores:
            distribution["average_credibility"] = sum(credibility_scores) / len(credibility_scores)

        # 估算未评级项目数量（基于表格行数）
        table_rows = content.count('|') - content.count('\n|')
        if table_rows > 0:
            distribution["unrated"] = max(0, table_rows // 4 - distribution["total_credible_items"])

        return distribution

    def check_logical_consistency(self, content: str) -> Tuple[float, Dict[str, Any]]:
        """
        逻辑一致性检查

        Args:
            content: 待检查内容

        Returns:
            Tuple[一致性分数, 详细分析]
        """
        analysis = {
            "consistency_issues": [],
            "validation_results": {},
            "logic_score": 0.0,
            "recommendations": []
        }

        consistency_score = 100.0
        issue_deduction = 0.0

        # 检查数据逻辑一致性
        consistency_checks = [
            self._check_financial_logic(content),
            self._check_timeline_logic(content),
            self._check_growth_metrics_logic(content),
            self._check_competitive_positioning_logic(content)
        ]

        for check_name, check_result in consistency_checks:
            analysis["validation_results"][check_name] = check_result

            if not check_result["is_consistent"]:
                analysis["consistency_issues"].extend(check_result["issues"])
                issue_deduction += check_result["severity"] * 10  # 严重程度1-3，每个扣10分

        # 检查数值范围合理性
        range_issues = self._check_value_ranges(content)
        analysis["range_validation"] = range_issues
        if range_issues["issues"]:
            analysis["consistency_issues"].extend(range_issues["issues"])
            issue_deduction += len(range_issues["issues"]) * 5

        # 检查描述一致性
        description_issues = self._check_description_consistency(content)
        analysis["description_validation"] = description_issues
        if description_issues["issues"]:
            analysis["consistency_issues"].extend(description_issues["issues"])
            issue_deduction += len(description_issues["issues"]) * 3

        # 计算最终一致性分数
        consistency_score = max(0.0, consistency_score - issue_deduction)
        analysis["logic_score"] = consistency_score

        # 生成改进建议
        analysis["recommendations"] = self._generate_consistency_recommendations(
            analysis["consistency_issues"]
        )

        return consistency_score, analysis

    def _check_financial_logic(self, content: str) -> Tuple[str, Dict[str, Any]]:
        """检查财务数据逻辑"""
        result = {
            "is_consistent": True,
            "issues": [],
            "severity": 1
        }

        # 提取关键财务数据
        funding_data = self._extract_funding_data(content)
        revenue_data = self._extract_revenue_data(content)

        # 检查融资轮次与估值的逻辑关系
        if funding_data["latest_round"] and funding_data["valuation"]:
            round_valuation_map = {
                "种子轮": (0.01, 0.1),      # 10M-100M
                "天使轮": (0.1, 0.5),       # 100M-500M
                "A轮": (0.5, 2.0),          # 500M-2B
                "B轮": (2.0, 10.0),         # 2B-10B
                "C轮": (10.0, 50.0),        # 10B-50B
                "D轮": (50.0, float('inf')) # 50B+
            }

            round_name = funding_data["latest_round"].lower()
            for round_key, (min_val, max_val) in round_valuation_map.items():
                if round_key in round_name:
                    if funding_data["valuation"] < min_val or funding_data["valuation"] > max_val:
                        result["is_consistent"] = False
                        result["issues"].append(
                            f"融资轮次{funding_data['latest_round']}与估值${funding_data['valuation']}B不符"
                        )
                        result["severity"] = 2
                    break

        # 检查收入与估值的比例关系
        if revenue_data["annual_revenue"] and funding_data["valuation"]:
            revenue_multiple = funding_data["valuation"] / max(revenue_data["annual_revenue"], 0.001)

            # 一般SaaS公司估值是收入的10-30倍
            if revenue_multiple > 100 or revenue_multiple < 2:
                result["is_consistent"] = False
                result["issues"].append(
                    f"估值${funding_data['valuation']}B与年收入${revenue_data['annual_revenue']}B的比例异常({revenue_multiple:.1f}倍)"
                )
                result["severity"] = 2

        return "financial_logic", result

    def _extract_funding_data(self, content: str) -> Dict[str, Any]:
        """提取融资数据"""
        funding_data = {
            "latest_round": None,
            "valuation": None,
            "amount": None
        }

        # 提取最新轮次
        round_patterns = [
            r'最新轮次[：:]\s*([A-Z]+轮|种子轮|天使轮)',
            r'融资阶段[：:]\s*([A-Z]+轮|种子轮|天使轮)'
        ]

        for pattern in round_patterns:
            match = re.search(pattern, content)
            if match:
                funding_data["latest_round"] = match.group(1)
                break

        # 提取估值（十亿美元）
        valuation_patterns = [
            r'估值[：:]?\s*\$?([0-9.]+)[Bb]?\s*(?:billion|B)?',
            r'valuation[：:]?\s*\$?([0-9.]+)\s*(?:billion|B|b)'
        ]

        for pattern in valuation_patterns:
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                try:
                    funding_data["valuation"] = float(match.group(1))
                    break
                except ValueError:
                    pass

        return funding_data

    def _extract_revenue_data(self, content: str) -> Dict[str, Any]:
        """提取收入数据"""
        revenue_data = {
            "annual_revenue": None,
            "growth_rate": None
        }

        # 提取年收入（十亿美元）
        revenue_patterns = [
            r'ARR[：:]?\s*\$?([0-9.]+)[BbM]?\s*(?:billion|B|m|M)?',
            r'年收入[：:]?\s*\$?([0-9.]+)[BbM]?\s*(?:billion|B|m|M)?',
            r'annual revenue[：:]?\s*\$?([0-9.]+)\s*(?:billion|B|m|M)'
        ]

        for pattern in revenue_patterns:
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                try:
                    amount = float(match.group(1))
                    # 根据单位调整
                    if 'm' in pattern.lower() or 'M' in match.group(0):
                        amount = amount / 1000  # M转B
                    revenue_data["annual_revenue"] = amount
                    break
                except ValueError:
                    pass

        # 提取增长率
        growth_patterns = [
            r'增长率[：:]?\s*([0-9.]+)%',
            r'growth rate[：:]?\s*([0-9.]+)%',
            r'同比增长[：:]?\s*([0-9.]+)%'
        ]

        for pattern in growth_patterns:
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                try:
                    revenue_data["growth_rate"] = float(match.group(1))
                    break
                except ValueError:
                    pass

        return revenue_data

    def _check_timeline_logic(self, content: str) -> Tuple[str, Dict[str, Any]]:
        """检查时间线逻辑"""
        result = {
            "is_consistent": True,
            "issues": [],
            "severity": 1
        }

        # 提取时间信息
        founding_date = self._extract_founding_date(content)
        funding_dates = self._extract_funding_dates(content)

        if founding_date and funding_dates:
            # 检查融资时间是否晚于成立时间
            for funding_date in funding_dates:
                if funding_date and funding_date < founding_date:
                    result["is_consistent"] = False
                    result["issues"].append(
                        f"融资日期{funding_date}早于成立日期{founding_date}"
                    )
                    result["severity"] = 3

        # 检查发展阶段与时间的合理性
        stage_analysis = self._analyze_development_stage_timeline(content)
        if not stage_analysis["is_consistent"]:
            result["is_consistent"] = False
            result["issues"].extend(stage_analysis["issues"])
            result["severity"] = max(result["severity"], stage_analysis["severity"])

        return "timeline_logic", result

    def _extract_founding_date(self, content: str) -> Optional[int]:
        """提取成立年份"""
        patterns = [
            r'成立时间[：:]?\s*(\d{4})',
            r'founded[：:]?\s*(\d{4})',
            r'创立于\s*(\d{4})',
            r'(\d{4})\s*年成立'
        ]

        for pattern in patterns:
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                try:
                    return int(match.group(1))
                except ValueError:
                    pass

        return None

    def _extract_funding_dates(self, content: str) -> List[int]:
        """提取融资年份"""
        dates = []
        patterns = [
            r'(\d{4})\s*年.*?融资',
            r'(\d{4})\s*年.*轮',
            r'funding.*?(\d{4})',
            r'round.*?(\d{4})'
        ]

        for pattern in patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            for match in matches:
                try:
                    dates.append(int(match))
                except ValueError:
                    pass

        return dates

    def _analyze_development_stage_timeline(self, content: str) -> Dict[str, Any]:
        """分析发展阶段时间线"""
        analysis = {
            "is_consistent": True,
            "issues": [],
            "severity": 1
        }

        founding_date = self._extract_founding_date(content)
        current_stage = self._extract_current_stage(content)

        if founding_date and current_stage:
            current_year = datetime.now().year
            company_age = current_year - founding_date

            # 检查发展阶段与公司年龄的匹配度
            stage_age_requirements = {
                "早期": (0, 2),
                "成长期": (2, 5),
                "成熟期": (5, 20),
                "扩张期": (3, 10)
            }

            for stage, (min_age, max_age) in stage_age_requirements.items():
                if stage in current_stage:
                    if company_age < min_age or company_age > max_age:
                        analysis["is_consistent"] = False
                        analysis["issues"].append(
                            f"公司年龄{company_age}年与当前阶段{current_stage}不匹配"
                        )
                        analysis["severity"] = 2
                    break

        return analysis

    def _extract_current_stage(self, content: str) -> str:
        """提取当前发展阶段"""
        patterns = [
            r'当前阶段[：:]?\s*([^\\n\\r]+)',
            r'发展阶段[：:]?\s*([^\\n\\r]+)',
            r'current stage[：:]?\s*([^\\n\\r]+)'
        ]

        for pattern in patterns:
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                return match.group(1).strip()

        return ""

    def _check_growth_metrics_logic(self, content: str) -> Tuple[str, Dict[str, Any]]:
        """检查增长指标逻辑"""
        result = {
            "is_consistent": True,
            "issues": [],
            "severity": 1
        }

        # 提取增长相关数据
        user_growth = self._extract_user_growth_data(content)
        revenue_growth = self._extract_revenue_growth_data(content)

        # 检查用户增长与收入增长的一致性
        if user_growth and revenue_growth:
            if abs(user_growth - revenue_growth) > 50:  # 差异超过50%
                result["is_consistent"] = False
                result["issues"].append(
                    f"用户增长率{user_growth}%与收入增长率{revenue_growth}%差异过大"
                )
                result["severity"] = 2

        # 检查增长率合理性
        for growth_type, growth_value in [("用户增长", user_growth), ("收入增长", revenue_growth)]:
            if growth_value and (growth_value > 1000 or growth_value < -50):
                result["is_consistent"] = False
                result["issues"].append(
                    f"{growth_type}率{growth_value}%超出合理范围(-50%到1000%)"
                )
                result["severity"] = 3

        return "growth_metrics_logic", result

    def _extract_user_growth_data(self, content: str) -> Optional[float]:
        """提取用户增长数据"""
        patterns = [
            r'用户增长[率]?[：:]?\s*([+-]?[0-9.]+)%',
            r'user growth[：:]?\s*([+-]?[0-9.]+)%',
            r'同比增长[：:]?\s*([+-]?[0-9.]+)%'
        ]

        for pattern in patterns:
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                try:
                    return float(match.group(1))
                except ValueError:
                    pass

        return None

    def _extract_revenue_growth_data(self, content: str) -> Optional[float]:
        """提取收入增长数据"""
        patterns = [
            r'收入增长[率]?[：:]?\s*([+-]?[0-9.]+)%',
            r'revenue growth[：:]?\s*([+-]?[0-9.]+)%',
            r'ARR增长[：:]?\s*([+-]?[0-9.]+)%'
        ]

        for pattern in patterns:
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                try:
                    return float(match.group(1))
                except ValueError:
                    pass

        return None

    def _check_competitive_positioning_logic(self, content: str) -> Tuple[str, Dict[str, Any]]:
        """检查竞争定位逻辑"""
        result = {
            "is_consistent": True,
            "issues": [],
            "severity": 1
        }

        # 提取竞争相关数据
        market_share = self._extract_market_share(content)
        competitive_ranking = self._extract_competitive_ranking(content)

        # 检查市场份额与排名的一致性
        if market_share and competitive_ranking:
            # 一般排名越高，市场份额应该越小
            if competitive_ranking <= 3 and market_share < 1.0:
                result["is_consistent"] = False
                result["issues"].append(
                    f"竞争排名{competitive_ranking}但市场份额仅{market_share}%，存在逻辑矛盾"
                )
                result["severity"] = 2
            elif competitive_ranking > 10 and market_share > 20.0:
                result["is_consistent"] = False
                result["issues"].append(
                    f"竞争排名{competitive_ranking}但市场份额高达{market_share}%，存在逻辑矛盾"
                )
                result["severity"] = 2

        return "competitive_positioning_logic", result

    def _extract_market_share(self, content: str) -> Optional[float]:
        """提取市场份额"""
        patterns = [
            r'市场份额[：:]?\s*([0-9.]+)%',
            r'market share[：:]?\s*([0-9.]+)%'
        ]

        for pattern in patterns:
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                try:
                    return float(match.group(1))
                except ValueError:
                    pass

        return None

    def _extract_competitive_ranking(self, content: str) -> Optional[int]:
        """提取竞争排名"""
        patterns = [
            r'竞争地位[：:]?\s*第?([0-9]+)',
            r'市场排名[：:]?\s*第?([0-9]+)',
            r'行业排名[：:]?\s*第?([0-9]+)'
        ]

        for pattern in patterns:
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                try:
                    return int(match.group(1))
                except ValueError:
                    pass

        return None

    def _check_value_ranges(self, content: str) -> Dict[str, Any]:
        """检查数值范围合理性"""
        result = {
            "is_consistent": True,
            "issues": []
        }

        # 定义数值范围检查规则
        range_checks = [
            ("团队规模", r'团队规模[：:]?\s*([0-9,]+)', 1, 100000),
            ("用户数量", r'用户[数量]?[：:]?\s*([0-9,]+)', 1, 10000000000),
            ("专利数量", r'专利[数量]?[：:]?\s*([0-9,]+)', 0, 10000),
            ("增长率", r'增长率?[：:]?\s*([+-]?[0-9.]+)%', -100, 1000)
        ]

        for field_name, pattern, min_val, max_val in range_checks:
            matches = re.findall(pattern, content, re.IGNORECASE)
            for match in matches:
                try:
                    # 移除逗号并转换为数值
                    if field_name == "增长率":
                        value = float(match)
                    else:
                        value = int(match.replace(',', ''))

                    if value < min_val or value > max_val:
                        result["is_consistent"] = False
                        result["issues"].append(
                            f"{field_name}数值{value}超出合理范围({min_val}-{max_val})"
                        )
                except ValueError:
                    pass

        return result

    def _check_description_consistency(self, content: str) -> Dict[str, Any]:
        """检查描述一致性"""
        result = {
            "is_consistent": True,
            "issues": []
        }

        # 检查公司描述的一致性
        descriptions = self._extract_company_descriptions(content)
        if len(descriptions) > 1:
            # 简单检查描述是否基本一致（检查关键词重叠度）
            for i, desc1 in enumerate(descriptions):
                for j, desc2 in enumerate(descriptions[i+1:], i+1):
                    similarity = self._calculate_description_similarity(desc1, desc2)
                    if similarity < 0.3:  # 相似度低于30%
                        result["is_consistent"] = False
                        result["issues"].append(
                            f"发现不一致的公司描述，相似度仅{similarity:.1%}"
                        )

        return result

    def _extract_company_descriptions(self, content: str) -> List[str]:
        """提取公司描述"""
        descriptions = []

        patterns = [
            r'(?:公司简介|企业描述|业务描述)[：:]?\s*([^\\n\\r]{10,200})',
            r'(?:一句话定位|价值定位)[：:]?\s*([^\\n\\r]{10,200})',
            r'company description[：:]?\s*([^\\n\\r]{10,200})'
        ]

        for pattern in patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            descriptions.extend(matches)

        return descriptions

    def _calculate_description_similarity(self, desc1: str, desc2: str) -> float:
        """计算描述相似度"""
        words1 = set(desc1.lower().split())
        words2 = set(desc2.lower().split())

        intersection = words1.intersection(words2)
        union = words1.union(words2)

        return len(intersection) / len(union) if union else 0.0

    def _generate_consistency_recommendations(self, issues: List[str]) -> List[str]:
        """生成一致性改进建议"""
        recommendations = []

        if any("估值" in issue for issue in issues):
            recommendations.append("检查融资轮次与估值的匹配关系，确保符合行业常规")

        if any("时间" in issue or "日期" in issue for issue in issues):
            recommendations.append("核实所有时间信息的准确性，确保时间线逻辑合理")

        if any("增长" in issue for issue in issues):
            recommendations.append("检查增长率数据，确保用户增长与收入增长的协调性")

        if any("竞争" in issue for issue in issues):
            recommendations.append("验证竞争地位与市场份额的一致性")

        if any("范围" in issue for issue in issues):
            recommendations.append("检查所有数值是否在合理范围内，避免异常值")

        return recommendations

    def check_vi_zone_compliance(self, content: str) -> Tuple[float, Dict[str, Any]]:
        """
        VI区数据锚点验证

        Args:
            content: 待检查内容

        Returns:
            Tuple[VI区合规性分数, 详细分析]
        """
        analysis = {
            "vi_zones_present": [],
            "vi_zones_missing": [],
            "zone_compliance_scores": {},
            "data_anchors_found": 0,
            "data_anchors_required": 0,
            "credibility_rating_issues": []
        }

        total_score = 0.0
        zones_checked = 0

        for zone_key, zone_info in self.vi_zone_requirements.items():
            zone_score, zone_details = self._check_single_vi_zone(content, zone_key, zone_info)
            analysis["zone_compliance_scores"][zone_key] = zone_score

            if zone_score > 0:
                analysis["vi_zones_present"].append(zone_key)
                total_score += zone_score
                zones_checked += 1

                # 统计数据锚点
                analysis["data_anchors_found"] += zone_details["anchors_found"]
                analysis["data_anchors_required"] += zone_details["anchors_required"]

                # 收集可信度问题
                analysis["credibility_rating_issues"].extend(zone_details["credibility_issues"])
            else:
                analysis["vi_zones_missing"].append(zone_key)

        # 计算总体VI区合规性分数
        overall_vi_score = total_score / len(self.vi_zone_requirements) if self.vi_zone_requirements else 0.0
        analysis["overall_compliance"] = overall_vi_score

        # 添加数据锚点完成度分析
        if analysis["data_anchors_required"] > 0:
            analysis["anchor_completion_rate"] = (
                analysis["data_anchors_found"] / analysis["data_anchors_required"]
            ) * 100
        else:
            analysis["anchor_completion_rate"] = 0.0

        return overall_vi_score, analysis

    def _check_single_vi_zone(self, content: str, zone_key: str, zone_info: Dict[str, Any]) -> Tuple[float, Dict[str, Any]]:
        """检查单个VI区域"""
        zone_details = {
            "anchors_found": 0,
            "anchors_required": len(zone_info["required_fields"]),
            "credibility_issues": [],
            "missing_fields": [],
            "present_fields": []
        }

        # 查找区域内容
        zone_pattern = f"### {zone_key[0].upper()}区：{zone_info['name']}"
        zone_start = content.lower().find(zone_pattern.lower())

        if zone_start == -1:
            return 0.0, zone_details

        # 提取区域内容
        next_zone_start = len(content)
        for next_key in self.vi_zone_requirements:
            if next_key > zone_key:
                next_pattern = f"### {next_key[0].upper()}区："
                next_pos = content.lower().find(next_pattern.lower())
                if next_pos != -1 and next_pos > zone_start:
                    next_zone_start = next_pos
                    break

        zone_content = content[zone_start:next_zone_start]

        # 检查必需字段
        for field in zone_info["required_fields"]:
            if field.lower() in zone_content.lower():
                zone_details["present_fields"].append(field)
                zone_details["anchors_found"] += 1

                # 检查该字段的可信度评级
                credibility = self._extract_field_credibility(zone_content, field)
                if credibility is not None and credibility < zone_info["min_credibility"]:
                    zone_details["credibility_issues"].append(
                        f"{zone_key}区字段'{field}'可信度{credibility:.2f}低于最低要求{zone_info['min_credibility']:.2f}"
                    )
            else:
                zone_details["missing_fields"].append(field)

        # 计算区域分数
        zone_score = (zone_details["anchors_found"] / zone_details["anchors_required"]) * 100

        # 可信度问题扣分
        if zone_details["credibility_issues"]:
            credibility_deduction = len(zone_details["credibility_issues"]) * 5
            zone_score = max(0.0, zone_score - credibility_deduction)

        return zone_score, zone_details

    def calculate_overall_quality_score(self, metrics: Dict[str, float]) -> QualityMetrics:
        """
        计算综合质量评分 (≥85分)

        Args:
            metrics: 各项质量指标分数

        Returns:
            QualityMetrics: 综合质量指标
        """
        # 权重分配
        weights = {
            "template_compliance": 0.30,    # 模板对齐度权重30%
            "data_completeness": 0.25,      # 数据完整性权重25%
            "logical_consistency": 0.20,    # 逻辑一致性权重20%
            "vi_zone_compliance": 0.25      # VI区合规性权重25%
        }

        # 计算加权总分
        overall_score = sum(
            metrics.get(metric, 0.0) * weight
            for metric, weight in weights.items()
        )

        # 检查是否通过阈值
        passed_threshold = overall_score >= self.quality_thresholds["overall_score"]

        # 特殊条件：模板对齐度必须100%
        if metrics.get("template_compliance", 0.0) < 100.0:
            passed_threshold = False

        # 特殊条件：数据完整性必须≥90%
        if metrics.get("data_completeness", 0.0) < 90.0:
            passed_threshold = False

        return QualityMetrics(
            template_compliance=metrics.get("template_compliance", 0.0),
            data_completeness=metrics.get("data_completeness", 0.0),
            logical_consistency=metrics.get("logical_consistency", 0.0),
            vi_zone_compliance=metrics.get("vi_zone_compliance", 0.0),
            overall_score=overall_score,
            passed_threshold=passed_threshold,
            detailed_analysis=self._generate_detailed_quality_analysis(metrics)
        )

    def _generate_detailed_quality_analysis(self, metrics: Dict[str, float]) -> Dict[str, Any]:
        """生成详细质量分析"""
        analysis = {
            "strengths": [],
            "weaknesses": [],
            "improvement_priorities": [],
            "quality_grade": self._calculate_quality_grade(metrics["overall_score"]),
            "recommendations": []
        }

        # 分析优势
        for metric, score in metrics.items():
            if score >= 90:
                analysis["strengths"].append(f"{metric}: {score:.1f}分 (优秀)")
            elif score >= 80:
                analysis["strengths"].append(f"{metric}: {score:.1f}分 (良好)")

        # 分析弱点
        for metric, score in metrics.items():
            if score < 70:
                analysis["weaknesses"].append(f"{metric}: {score:.1f}分 (需要改进)")
            elif score < 80:
                analysis["weaknesses"].append(f"{metric}: {score:.1f}分 (有待提升)")

        # 确定改进优先级
        if metrics.get("template_compliance", 0.0) < 100.0:
            analysis["improvement_priorities"].append("模板对齐度 - 必须达到100%")

        if metrics.get("data_completeness", 0.0) < 90.0:
            analysis["improvement_priorities"].append("数据完整性 - 必须达到90%以上")

        if metrics.get("vi_zone_compliance", 0.0) < 80.0:
            analysis["improvement_priorities"].append("VI区数据锚点 - 建议完善数据溯源")

        if metrics.get("logical_consistency", 0.0) < 75.0:
            analysis["improvement_priorities"].append("逻辑一致性 - 检查数据逻辑关系")

        return analysis

    def _calculate_quality_grade(self, score: float) -> str:
        """计算质量等级"""
        if score >= 95:
            return "A+ (卓越)"
        elif score >= 90:
            return "A (优秀)"
        elif score >= 85:
            return "B+ (良好)"
        elif score >= 80:
            return "B (合格)"
        elif score >= 70:
            return "C (需要改进)"
        else:
            return "D (不合格)"

    def run_deliver_check(self, content: str) -> QualityMetrics:
        """
        执行完整的DELIVER_CHECK质量检查

        Args:
            content: 待检查的内容

        Returns:
            QualityMetrics: 完整的质量检查结果
        """
        print("🔍 开始DELIVER_CHECK质量检查...")

        # 1. 模板对齐度检查
        print("  📋 检查模板对齐度...")
        template_score, template_analysis = self.check_template_compliance(content)
        print(f"    模板对齐度: {template_score:.1f}/100")

        # 2. 数据完整性检查
        print("  📊 检查数据完整性...")
        completeness_score, completeness_analysis = self.check_data_completeness(content)
        print(f"    数据完整性: {completeness_score:.1f}/100")

        # 3. 逻辑一致性检查
        print("  🧠 检查逻辑一致性...")
        consistency_score, consistency_analysis = self.check_logical_consistency(content)
        print(f"    逻辑一致性: {consistency_score:.1f}/100")

        # 4. VI区数据锚点检查
        print("  🎯 检查VI区数据锚点...")
        vi_score, vi_analysis = self.check_vi_zone_compliance(content)
        print(f"    VI区合规性: {vi_score:.1f}/100")

        # 5. 计算综合质量评分
        print("  📈 计算综合质量评分...")
        metrics = {
            "template_compliance": template_score,
            "data_completeness": completeness_score,
            "logical_consistency": consistency_score,
            "vi_zone_compliance": vi_score
        }

        quality_metrics = self.calculate_overall_quality_score(metrics)

        print(f"  🎯 综合质量评分: {quality_metrics.overall_score:.1f}/100")
        print(f"  📊 质量等级: {quality_metrics.detailed_analysis['quality_grade']}")
        print(f"  ✅ 通过状态: {'是' if quality_metrics.passed_threshold else '否'}")

        # 添加详细分析结果
        quality_metrics.detailed_analysis.update({
            "template_analysis": template_analysis,
            "completeness_analysis": completeness_analysis,
            "consistency_analysis": consistency_analysis,
            "vi_analysis": vi_analysis,
            "check_timestamp": datetime.now().isoformat(),
            "content_hash": hashlib.md5(content.encode()).hexdigest()
        })

        return quality_metrics


def main():
    """主函数 - 演示质量检查器使用"""
    # 示例使用
    sample_content = """
# SERVAL企业级AI智能解决方案提供商项目档案

## 1. 项目核心概览

## 1.1 价值定位
**一句话定位**: 企业级AI自动化平台解决方案提供商

**核心标签**: AI自动化, 企业服务, 智能决策, 效率提升

## 1.2 关键数据快照
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
    """

    checker = QualityChecker()
    result = checker.run_deliver_check(sample_content)

    print("\n" + "="*50)
    print("DELIVER_CHECK 质量检查报告")
    print("="*50)
    print(f"综合质量评分: {result.overall_score:.1f}/100")
    print(f"质量等级: {result.detailed_analysis['quality_grade']}")
    print(f"通过状态: {'✅ 通过' if result.passed_threshold else '❌ 不通过'}")

    print("\n详细指标:")
    print(f"  模板对齐度: {result.template_compliance:.1f}/100")
    print(f"  数据完整性: {result.data_completeness:.1f}/100")
    print(f"  逻辑一致性: {result.logical_consistency:.1f}/100")
    print(f"  VI区合规性: {result.vi_zone_compliance:.1f}/100")


if __name__ == "__main__":
    main()