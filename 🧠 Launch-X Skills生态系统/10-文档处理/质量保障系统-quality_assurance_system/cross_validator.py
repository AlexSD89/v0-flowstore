#!/usr/bin/env python3
"""
交叉验证器 (Cross Validator) - CROSS_VALIDATION阶段实现
基于AI项目档案管理工作流v2.4-完整版的综合交叉验证分析

核心功能:
- 多源数据交叉验证
- 矛盾检测和解决
- 最终质量评级 (A+可信度)
- 验证完整性统计
"""

import json
import hashlib
import re
from typing import Dict, List, Tuple, Any, Optional, Set
from dataclasses import dataclass, asdict
from datetime import datetime
from enum import Enum
import difflib


class ConflictSeverity(Enum):
    """冲突严重程度枚举"""
    LOW = "low"        # 轻微差异
    MEDIUM = "medium"  # 中等冲突
    HIGH = "high"      # 严重冲突
    CRITICAL = "critical"  # 关键冲突


class DataSourceType(Enum):
    """数据源类型枚举"""
    PRIMARY = "primary"      # 主要来源
    SECONDARY = "secondary"  # 次要来源
    TERTIARY = "tertiary"    # 第三方来源
    GENERATED = "generated"  # 生成内容


@dataclass
class DataConflict:
    """数据冲突信息"""
    conflict_id: str
    field_name: str
    source_a_value: str
    source_b_value: str
    source_a_type: DataSourceType
    source_b_type: DataSourceType
    severity: ConflictSeverity
    confidence: float
    resolution_suggestion: str
    detected_at: str


@dataclass
class CrossValidationResult:
    """交叉验证结果"""
    field_name: str
    sources_verified: List[str]
    consensus_value: Any
    confidence_score: float
    conflicts_found: int
    resolution_method: str
    validation_status: str


@dataclass
class FinalQualityRating:
    """最终质量评级"""
    overall_grade: str           # A+, A, B+, B, C, D
    trustworthiness_score: float  # 0-100
    data_confidence: float       # 0-100
    source_diversity: float      # 0-100
    validation_completeness: float  # 0-100
    conflict_resolution_rate: float  # 0-100
    grade_details: Dict[str, Any]


class CrossValidator:
    """交叉验证器 - CROSS_VALIDATION阶段核心实现"""

    def __init__(self):
        self.source_credibility_weights = self._initialize_source_weights()
        self.conflict_resolution_strategies = self._initialize_resolution_strategies()
        self.quality_rating_criteria = self._initialize_rating_criteria()

    def _initialize_source_weights(self) -> Dict[DataSourceType, float]:
        """初始化数据源可信度权重"""
        return {
            DataSourceType.PRIMARY: 1.0,    # 官方来源
            DataSourceType.SECONDARY: 0.8,  # 验证数据库
            DataSourceType.TERTIARY: 0.6,   # 专业媒体
            DataSourceType.GENERATED: 0.4   # AI生成内容
        }

    def _initialize_resolution_strategies(self) -> Dict[ConflictSeverity, str]:
        """初始化冲突解决策略"""
        return {
            ConflictSeverity.LOW: "merge_values",
            ConflictSeverity.MEDIUM: "weighted_average",
            ConflictSeverity.HIGH: "prioritize_primary_source",
            ConflictSeverity.CRITICAL: "flag_for_manual_review"
        }

    def _initialize_rating_criteria(self) -> Dict[str, Dict[str, float]]:
        """初始化质量评级标准"""
        return {
            "A+": {
                "trustworthiness_score": 95.0,
                "data_confidence": 90.0,
                "source_diversity": 85.0,
                "validation_completeness": 95.0,
                "conflict_resolution_rate": 90.0
            },
            "A": {
                "trustworthiness_score": 85.0,
                "data_confidence": 80.0,
                "source_diversity": 75.0,
                "validation_completeness": 85.0,
                "conflict_resolution_rate": 80.0
            },
            "B+": {
                "trustworthiness_score": 75.0,
                "data_confidence": 70.0,
                "source_diversity": 65.0,
                "validation_completeness": 75.0,
                "conflict_resolution_rate": 70.0
            },
            "B": {
                "trustworthiness_score": 65.0,
                "data_confidence": 60.0,
                "source_diversity": 55.0,
                "validation_completeness": 65.0,
                "conflict_resolution_rate": 60.0
            },
            "C": {
                "trustworthiness_score": 55.0,
                "data_confidence": 50.0,
                "source_diversity": 45.0,
                "validation_completeness": 55.0,
                "conflict_resolution_rate": 50.0
            }
        }

    def perform_comprehensive_cross_validation(self, project_name: str, primary_content: str,
                                             validation_sources: List[Dict[str, Any]],
                                             quality_checker_results: Dict[str, Any],
                                             mcp_validation_results: Dict[str, Any]) -> Dict[str, Any]:
        """
        执行综合交叉验证分析

        Args:
            project_name: 项目名称
            primary_content: 主要内容
            validation_sources: 验证源数据
            quality_checker_results: 质量检查结果
            mcp_validation_results: MCP验证结果

        Returns:
            Dict[str, Any]: 完整的交叉验证报告
        """
        print("🔍 开始CROSS_VALIDATION综合交叉验证...")

        cross_validation_report = {
            "project_name": project_name,
            "validation_timestamp": datetime.now().isoformat(),
            "data_fields_validated": [],
            "conflicts_detected": [],
            "conflicts_resolved": [],
            "final_quality_rating": None,
            "validation_statistics": {},
            "recommendations": []
        }

        # 1. 数据提取和标准化
        print("  📊 步骤1: 数据提取和标准化...")
        extracted_data = self._extract_and_standardize_data(primary_content, validation_sources)

        # 2. 字段级交叉验证
        print("  🔍 步骤2: 字段级交叉验证...")
        field_validations = self._perform_field_level_validation(extracted_data)
        cross_validation_report["data_fields_validated"] = field_validations

        # 3. 冲突检测和分析
        print("  ⚠️  步骤3: 冲突检测和分析...")
        conflicts = self._detect_data_conflicts(field_validations, extracted_data)
        cross_validation_report["conflicts_detected"] = conflicts

        # 4. 冲突解决
        print("  🔧 步骤4: 冲突解决...")
        resolved_conflicts = self._resolve_conflicts(conflicts, extracted_data)
        cross_validation_report["conflicts_resolved"] = resolved_conflicts

        # 5. 质量评级
        print("  ⭐ 步骤5: 最终质量评级...")
        quality_rating = self._calculate_final_quality_rating(
            field_validations, conflicts, resolved_conflicts,
            quality_checker_results, mcp_validation_results
        )
        cross_validation_report["final_quality_rating"] = quality_rating

        # 6. 验证统计
        print("  📈 步骤6: 生成验证统计...")
        statistics = self._generate_validation_statistics(
            extracted_data, field_validations, conflicts, resolved_conflicts
        )
        cross_validation_report["validation_statistics"] = statistics

        # 7. 生成建议
        print("  💡 步骤7: 生成改进建议...")
        recommendations = self._generate_cross_validation_recommendations(
            conflicts, resolved_conflicts, quality_rating
        )
        cross_validation_report["recommendations"] = recommendations

        print(f"  ✅ 交叉验证完成")
        print(f"  📊 验证字段: {len(field_validations)}")
        print(f"  ⚠️  检测冲突: {len(conflicts)}")
        print(f"  ✅ 解决冲突: {len(resolved_conflicts)}")
        print(f"  ⭐ 最终评级: {quality_rating.overall_grade}")

        return cross_validation_report

    def _extract_and_standardize_data(self, primary_content: str, validation_sources: List[Dict[str, Any]]) -> Dict[str, Any]:
        """提取和标准化数据"""
        extracted_data = {
            "primary_source": {
                "type": DataSourceType.PRIMARY,
                "content": primary_content,
                "fields": self._extract_fields_from_content(primary_content)
            },
            "validation_sources": []
        }

        # 处理验证源数据
        for source in validation_sources:
            source_type = DataSourceType(source.get("type", "secondary"))
            content = source.get("content", "")

            extracted_source = {
                "type": source_type,
                "name": source.get("name", "unknown"),
                "content": content,
                "fields": self._extract_fields_from_content(content),
                "credibility_score": source.get("credibility_score", 0.7)
            }
            extracted_data["validation_sources"].append(extracted_source)

        return extracted_data

    def _extract_fields_from_content(self, content: str) -> Dict[str, Any]:
        """从内容中提取结构化字段"""
        fields = {}

        # 提取基础信息字段
        basic_patterns = {
            "company_name": r'(?:公司名称|企业名称|公司名)[：:]?\s*([^\n\r]+)',
            "founding_year": r'(?:成立时间|创立于|成立于)[：:]?\s*(\d{4})',
            "headquarters": r'(?:总部地点|总部|地址)[：:]?\s*([^\n\r]+)',
            "ceo": r'(?:CEO|创始人|负责人)[：:]?\s*([^\n\r]+)',
            "employee_count": r'(?:员工数|团队规模|员工人数)[：:]?\s*([0-9,]+)',
            "website": r'(?:官网|网站|官方网站)[：:]?\s*(https?://[^\s]+)'
        }

        for field_name, pattern in basic_patterns.items():
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                fields[field_name] = {
                    "value": match.group(1).strip(),
                    "confidence": 0.9,
                    "source_context": match.group(0)
                }

        # 提取融资数据字段
        funding_patterns = {
            "latest_round": r'(?:最新轮次|融资阶段|当前轮次)[：:]?\s*([^\n\r]+)',
            "funding_amount": r'(?:融资金额|融资额)[：:]?\s*([^\n\r]+)',
            "valuation": r'(?:估值|公司估值)[：:]?\s*([^\n\r]+)',
            "investors": r'(?:投资方|投资者)[：:]?\s*([^\n\r]+)',
            "funding_date": r'(?:融资时间|融资日期)[：:]?\s*([^\n\r]+)'
        }

        for field_name, pattern in funding_patterns.items():
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                fields[field_name] = {
                    "value": match.group(1).strip(),
                    "confidence": 0.85,
                    "source_context": match.group(0)
                }

        # 提取业务数据字段
        business_patterns = {
            "user_count": r'(?:用户数|用户数量|活跃用户)[：:]?\s*([0-9,]+)',
            "revenue": r'(?:收入|营收|年收入)[：:]?\s*([^\n\r]+)',
            "growth_rate": r'(?:增长率|增长速度)[：:]?\s*([0-9.]+%)',
            "market_share": r'(?:市场份额|市场占有率)[：:]?\s*([0-9.]+%)',
            "product_name": r'(?:核心产品|主要产品|产品名称)[：:]?\s*([^\n\r]+)'
        }

        for field_name, pattern in business_patterns.items():
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                fields[field_name] = {
                    "value": match.group(1).strip(),
                    "confidence": 0.8,
                    "source_context": match.group(0)
                }

        # 提取技术数据字段
        tech_patterns = {
            "tech_stack": r'(?:技术栈|技术架构)[：:]?\s*([^\n\r]+)',
            "patent_count": r'(?:专利数|专利数量)[：:]?\s*([0-9,]+)',
            "rd_team_size": r'(?:研发团队|技术团队)[：:]?\s*([0-9,]+)',
            "main_category": r'(?:行业分类|所属行业)[：:]?\s*([^\n\r]+)'
        }

        for field_name, pattern in tech_patterns.items():
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                fields[field_name] = {
                    "value": match.group(1).strip(),
                    "confidence": 0.75,
                    "source_context": match.group(0)
                }

        return fields

    def _perform_field_level_validation(self, extracted_data: Dict[str, Any]) -> List[CrossValidationResult]:
        """执行字段级交叉验证"""
        field_validations = []

        # 收集所有源的数据
        all_sources = [extracted_data["primary_source"]] + extracted_data["validation_sources"]

        # 获取所有唯一字段名
        all_field_names = set()
        for source in all_sources:
            all_field_names.update(source["fields"].keys())

        # 对每个字段进行交叉验证
        for field_name in all_field_names:
            validation = self._validate_single_field(field_name, all_sources)
            field_validations.append(validation)

        return field_validations

    def _validate_single_field(self, field_name: str, sources: List[Dict[str, Any]]) -> CrossValidationResult:
        """验证单个字段"""
        sources_with_field = []
        field_values = []

        for source in sources:
            if field_name in source["fields"]:
                field_data = source["fields"][field_name]
                sources_with_field.append({
                    "source_name": source.get("name", "primary"),
                    "source_type": source["type"],
                    "value": field_data["value"],
                    "confidence": field_data.get("confidence", 0.7),
                    "credibility_weight": self.source_credibility_weights[source["type"]]
                })
                field_values.append(field_data["value"])

        # 计算共识值
        consensus_value, confidence_score = self._calculate_consensus_value(sources_with_field, field_values)

        # 检测冲突
        conflicts = self._detect_field_conflicts(field_values)

        # 确定解决方法
        resolution_method = self._determine_resolution_method(conflicts, sources_with_field)

        return CrossValidationResult(
            field_name=field_name,
            sources_verified=[s["source_name"] for s in sources_with_field],
            consensus_value=consensus_value,
            confidence_score=confidence_score,
            conflicts_found=len(conflicts),
            resolution_method=resolution_method,
            validation_status="verified" if confidence_score > 0.7 else "uncertain"
        )

    def _calculate_consensus_value(self, sources_with_field: List[Dict[str, Any]], field_values: List[str]) -> Tuple[Any, float]:
        """计算共识值和置信度"""
        if not sources_with_field:
            return None, 0.0

        if len(sources_with_field) == 1:
            return sources_with_field[0]["value"], sources_with_field[0]["confidence"]

        # 标准化数值型数据
        normalized_values = []
        weights = []

        for source in sources_with_field:
            value = source["value"]
            weight = source["credibility_weight"] * source["confidence"]

            normalized_value = self._normalize_field_value(value)
            if normalized_value is not None:
                normalized_values.append(normalized_value)
                weights.append(weight)

        if not normalized_values:
            return field_values[0], 0.5

        # 计算加权平均
        if isinstance(normalized_values[0], (int, float)):
            # 数值型数据
            weighted_sum = sum(v * w for v, w in zip(normalized_values, weights))
            total_weight = sum(weights)
            consensus_numeric = weighted_sum / total_weight if total_weight > 0 else 0

            # 选择最接近加权平均值的原始值
            closest_value = min(sources_with_field, key=lambda s: abs(self._normalize_field_value(s["value"]) - consensus_numeric))
            consensus_value = closest_value["value"]
        else:
            # 文本型数据 - 选择权重最高的值
            best_source = max(sources_with_field, key=lambda s: s["credibility_weight"] * s["confidence"])
            consensus_value = best_source["value"]

        # 计算整体置信度
        confidence_score = min(1.0, sum(weights) / len(sources_with_field))

        return consensus_value, confidence_score

    def _normalize_field_value(self, value: str) -> Any:
        """标准化字段值"""
        if not value:
            return None

        value = value.strip()

        # 尝试解析为数字
        numeric_patterns = [
            r'^\$?([0-9,]+(?:\.[0-9]*)?)\s*([kmb]?)$',
            r'^([0-9,]+(?:\.[0-9]*)?)\s*(%|percent)?$'
        ]

        for pattern in numeric_patterns:
            match = re.match(pattern, value, re.IGNORECASE)
            if match:
                num_str = match.group(1).replace(',', '')
                suffix = match.group(2).lower() if len(match.groups()) > 1 else ''

                try:
                    num_value = float(num_str)

                    # 处理单位后缀
                    if suffix in ['k', 'kb']:
                        num_value *= 1000
                    elif suffix in ['m', 'mb', 'million']:
                        num_value *= 1000000
                    elif suffix in ['b', 'bb', 'billion']:
                        num_value *= 1000000000
                    elif suffix == '%':
                        num_value = num_value / 100.0

                    return num_value
                except ValueError:
                    pass

        # 移除常见前缀后缀
        cleaned = re.sub(r'^(?:第|大约|约|超过|少于)\s*', '', value)
        cleaned = re.sub(r'\s*(?:名|位|人|个|美元|元|万|亿)$', '', cleaned)

        return cleaned if cleaned else value

    def _detect_field_conflicts(self, field_values: List[str]) -> List[Dict[str, Any]]:
        """检测字段冲突"""
        conflicts = []

        if len(field_values) < 2:
            return conflicts

        # 标准化所有值
        normalized_values = []
        for value in field_values:
            normalized = self._normalize_field_value(value)
            normalized_values.append(normalized)

        # 检测冲突
        for i in range(len(normalized_values)):
            for j in range(i + 1, len(normalized_values)):
                val1, val2 = normalized_values[i], normalized_values[j]

                if self._is_significant_difference(val1, val2):
                    similarity = difflib.SequenceMatcher(None, str(val1), str(val2)).ratio()

                    if similarity < 0.7:  # 相似度低于70%认为是冲突
                        severity = self._assess_conflict_severity(val1, val2)

                        conflicts.append({
                            "source_a_index": i,
                            "source_b_index": j,
                            "value_a": field_values[i],
                            "value_b": field_values[j],
                            "normalized_a": val1,
                            "normalized_b": val2,
                            "similarity": similarity,
                            "severity": severity
                        })

        return conflicts

    def _is_significant_difference(self, val1: Any, val2: Any) -> bool:
        """判断是否为显著差异"""
        if val1 is None or val2 is None:
            return True

        # 数值型比较
        if isinstance(val1, (int, float)) and isinstance(val2, (int, float)):
            larger = max(abs(val1), abs(val2))
            if larger == 0:
                return False
            return abs(val1 - val2) / larger > 0.1  # 10%以上差异

        # 字符串比较
        str1, str2 = str(val1).lower(), str(val2).lower()
        if str1 == str2:
            return False

        # 计算编辑距离
        similarity = difflib.SequenceMatcher(None, str1, str2).ratio()
        return similarity < 0.8

    def _assess_conflict_severity(self, val1: Any, val2: Any) -> ConflictSeverity:
        """评估冲突严重程度"""
        if isinstance(val1, (int, float)) and isinstance(val2, (int, float)):
            larger = max(abs(val1), abs(val2))
            if larger == 0:
                return ConflictSeverity.LOW

            diff_ratio = abs(val1 - val2) / larger
            if diff_ratio > 0.5:
                return ConflictSeverity.CRITICAL
            elif diff_ratio > 0.3:
                return ConflictSeverity.HIGH
            elif diff_ratio > 0.1:
                return ConflictSeverity.MEDIUM
            else:
                return ConflictSeverity.LOW

        # 字符串冲突严重程度
        str1, str2 = str(val1), str(val2)
        similarity = difflib.SequenceMatcher(None, str1, str2).ratio()

        if similarity < 0.3:
            return ConflictSeverity.CRITICAL
        elif similarity < 0.5:
            return ConflictSeverity.HIGH
        elif similarity < 0.7:
            return ConflictSeverity.MEDIUM
        else:
            return ConflictSeverity.LOW

    def _determine_resolution_method(self, conflicts: List[Dict[str, Any]], sources_with_field: List[Dict[str, Any]]) -> str:
        """确定冲突解决方法"""
        if not conflicts:
            return "no_conflict"

        # 找到最严重的冲突
        max_severity = ConflictSeverity.LOW
        for conflict in conflicts:
            if conflict["severity"].value > max_severity.value:
                max_severity = conflict["severity"]

        # 根据严重程度选择解决策略
        if max_severity == ConflictSeverity.CRITICAL:
            return "manual_review_required"
        elif max_severity == ConflictSeverity.HIGH:
            return "prioritize_primary_source"
        elif max_severity == ConflictSeverity.MEDIUM:
            return "weighted_consensus"
        else:
            return "merge_if_possible"

    def _detect_data_conflicts(self, field_validations: List[CrossValidationResult], extracted_data: Dict[str, Any]) -> List[DataConflict]:
        """检测数据冲突"""
        conflicts = []

        for validation in field_validations:
            if validation.conflicts_found > 0:
                # 创建冲突对象
                conflict = DataConflict(
                    conflict_id=f"{validation.field_name}_{int(datetime.now().timestamp())}",
                    field_name=validation.field_name,
                    source_a_value=str(validation.consensus_value),
                    source_b_value="CONFLICT_DETECTED",
                    source_a_type=DataSourceType.PRIMARY,
                    source_b_type=DataSourceType.SECONDARY,
                    severity=ConflictSeverity.MEDIUM,  # 默认中等严重程度
                    confidence=1.0 - validation.confidence_score,
                    resolution_suggestion=validation.resolution_method,
                    detected_at=datetime.now().isoformat()
                )
                conflicts.append(conflict)

        # 检测跨字段逻辑冲突
        cross_field_conflicts = self._detect_cross_field_conflicts(field_validations)
        conflicts.extend(cross_field_conflicts)

        return conflicts

    def _detect_cross_field_conflicts(self, field_validations: List[CrossValidationResult]) -> List[DataConflict]:
        """检测跨字段逻辑冲突"""
        conflicts = []

        # 创建字段值映射
        field_values = {fv.field_name: fv.consensus_value for fv in field_validations}

        # 检查逻辑关系
        logical_checks = [
            self._check_funding_stage_consistency(field_values),
            self._check_company_age_funding_logic(field_values),
            self._check_team_size_revenue_logic(field_values),
            self._check_growth_rate_consistency(field_values)
        ]

        for check_result in logical_checks:
            if check_result["has_conflict"]:
                conflict = DataConflict(
                    conflict_id=f"logic_{check_result['field_a']}_{check_result['field_b']}_{int(datetime.now().timestamp())}",
                    field_name=f"{check_result['field_a']}_vs_{check_result['field_b']}",
                    source_a_value=str(check_result.get("value_a", "")),
                    source_b_value=str(check_result.get("value_b", "")),
                    source_a_type=DataSourceType.PRIMARY,
                    source_b_type=DataSourceType.PRIMARY,
                    severity=ConflictSeverity.HIGH,
                    confidence=0.8,
                    resolution_suggestion="verify_data_sources",
                    detected_at=datetime.now().isoformat()
                )
                conflicts.append(conflict)

        return conflicts

    def _check_funding_stage_consistency(self, field_values: Dict[str, Any]) -> Dict[str, Any]:
        """检查融资阶段一致性"""
        funding_round = field_values.get("latest_round", "")
        funding_amount = field_values.get("funding_amount", "")
        valuation = field_values.get("valuation", "")

        # 标准化融资轮次
        round_stages = {
            "种子轮": 1, "天使轮": 2, "Pre-A": 3, "A轮": 4, "B轮": 5, "C轮": 6, "D轮": 7, "E轮": 8
        }

        round_stage = 0
        for stage_name, stage_num in round_stages.items():
            if stage_name in funding_round:
                round_stage = stage_num
                break

        # 简单的融资逻辑检查
        has_conflict = False
        conflict_details = {}

        if round_stage > 0 and funding_amount:
            amount_num = self._extract_numeric_value(funding_amount)
            if amount_num:
                # 轮次越高，融资金额应该越大
                expected_min = round_stage * 5  # 简化的预期最小值
                if amount_num < expected_min and round_stage > 3:
                    has_conflict = True
                    conflict_details = {
                        "field_a": "latest_round",
                        "field_b": "funding_amount",
                        "value_a": funding_round,
                        "value_b": funding_amount,
                        "issue": "融资金额与轮次不匹配"
                    }

        return {
            "has_conflict": has_conflict,
            **conflict_details
        }

    def _check_company_age_funding_logic(self, field_values: Dict[str, Any]) -> Dict[str, Any]:
        """检查公司年龄与融资逻辑"""
        founding_year = field_values.get("founding_year")
        latest_round = field_values.get("latest_round", "")

        if founding_year and latest_round:
            try:
                current_year = datetime.now().year
                company_age = current_year - int(founding_year)

                # 过早获得后期融资可能不合理
                advanced_rounds = ["C轮", "D轮", "E轮"]
                if company_age < 3 and any(round_name in latest_round for round_name in advanced_rounds):
                    return {
                        "has_conflict": True,
                        "field_a": "founding_year",
                        "field_b": "latest_round",
                        "value_a": str(founding_year),
                        "value_b": latest_round,
                        "issue": f"公司年龄{company_age}年但已进入{latest_round}"
                    }
            except (ValueError, TypeError):
                pass

        return {"has_conflict": False}

    def _check_team_size_revenue_logic(self, field_values: Dict[str, Any]) -> Dict[str, Any]:
        """检查团队规模与收入逻辑"""
        employee_count = field_values.get("employee_count")
        revenue = field_values.get("revenue")

        if employee_count and revenue:
            try:
                emp_num = self._extract_numeric_value(str(employee_count))
                revenue_num = self._extract_numeric_value(str(revenue))

                if emp_num and revenue_num:
                    # 人均收入检查
                    revenue_per_employee = revenue_num / emp_num if emp_num > 0 else 0

                    # 人均收入过高或过低可能不合理
                    if revenue_per_employee > 1000000:  # 100万美元/人
                        return {
                            "has_conflict": True,
                            "field_a": "employee_count",
                            "field_b": "revenue",
                            "value_a": str(employee_count),
                            "value_b": str(revenue),
                            "issue": f"人均收入{revenue_per_employee:,.0f}异常高"
                        }
                    elif revenue_per_employee < 1000 and revenue_num > 100000:  # 收入较大但人均较低
                        return {
                            "has_conflict": True,
                            "field_a": "employee_count",
                            "field_b": "revenue",
                            "value_a": str(employee_count),
                            "value_b": str(revenue),
                            "issue": f"人均收入{revenue_per_employee:,.0f}异常低"
                        }
            except (ValueError, TypeError, ZeroDivisionError):
                pass

        return {"has_conflict": False}

    def _check_growth_rate_consistency(self, field_values: Dict[str, Any]) -> Dict[str, Any]:
        """检查增长率一致性"""
        growth_rate = field_values.get("growth_rate")
        revenue = field_values.get("revenue")
        market_share = field_values.get("market_share")

        # 极高增长率与稳定市场地位的矛盾
        if growth_rate and market_share:
            try:
                growth_num = self._extract_numeric_value(str(growth_rate))
                share_num = self._extract_numeric_value(str(market_share))

                if growth_num and share_num:
                    # 超高增长率但市场份额很高可能矛盾
                    if growth_num > 200 and share_num > 20:  # 增长率>200%且市场份额>20%
                        return {
                            "has_conflict": True,
                            "field_a": "growth_rate",
                            "field_b": "market_share",
                            "value_a": str(growth_rate),
                            "value_b": str(market_share),
                            "issue": "超高增长率与高市场份额并存可能矛盾"
                        }
            except (ValueError, TypeError):
                pass

        return {"has_conflict": False}

    def _extract_numeric_value(self, value_str: str) -> Optional[float]:
        """从字符串中提取数值"""
        if not value_str:
            return None

        # 移除非数字字符
        cleaned = re.sub(r'[^\d.]', '', value_str)

        try:
            return float(cleaned) if cleaned else None
        except ValueError:
            return None

    def _resolve_conflicts(self, conflicts: List[DataConflict], extracted_data: Dict[str, Any]) -> List[DataConflict]:
        """解决冲突"""
        resolved_conflicts = []

        for conflict in conflicts:
            resolution_strategy = self.conflict_resolution_strategies.get(conflict.severity, "flag_for_manual_review")

            resolved_conflict = self._apply_resolution_strategy(conflict, resolution_strategy, extracted_data)
            resolved_conflicts.append(resolved_conflict)

        return resolved_conflicts

    def _apply_resolution_strategy(self, conflict: DataConflict, strategy: str, extracted_data: Dict[str, Any]) -> DataConflict:
        """应用冲突解决策略"""
        # 为冲突添加解决信息
        if strategy == "merge_values":
            conflict.resolution_suggestion = "尝试合并相近值"
        elif strategy == "weighted_average":
            conflict.resolution_suggestion = "使用加权平均值"
        elif strategy == "prioritize_primary_source":
            conflict.resolution_suggestion = "优先使用主要来源数据"
        elif strategy == "flag_for_manual_review":
            conflict.resolution_suggestion = "需要人工审核"
        else:
            conflict.resolution_suggestion = "使用默认解决策略"

        return conflict

    def _calculate_final_quality_rating(self, field_validations: List[CrossValidationResult],
                                      conflicts: List[DataConflict], resolved_conflicts: List[DataConflict],
                                      quality_checker_results: Dict[str, Any],
                                      mcp_validation_results: Dict[str, Any]) -> FinalQualityRating:
        """计算最终质量评级"""
        # 1. 计算可信度评分
        trustworthiness_score = self._calculate_trustworthiness_score(field_validations, conflicts)

        # 2. 计算数据置信度
        data_confidence = self._calculate_data_confidence(field_validations)

        # 3. 计算源多样性
        source_diversity = self._calculate_source_diversity(field_validations)

        # 4. 计算验证完整性
        validation_completeness = self._calculate_validation_completeness(field_validations)

        # 5. 计算冲突解决率
        conflict_resolution_rate = self._calculate_conflict_resolution_rate(conflicts, resolved_conflicts)

        # 6. 确定最终等级
        overall_grade = self._determine_quality_grade(
            trustworthiness_score, data_confidence, source_diversity,
            validation_completeness, conflict_resolution_rate
        )

        return FinalQualityRating(
            overall_grade=overall_grade,
            trustworthiness_score=trustworthiness_score,
            data_confidence=data_confidence,
            source_diversity=source_diversity,
            validation_completeness=validation_completeness,
            conflict_resolution_rate=conflict_resolution_rate,
            grade_details={
                "criteria_scores": {
                    "trustworthiness": trustworthiness_score,
                    "data_confidence": data_confidence,
                    "source_diversity": source_diversity,
                    "validation_completeness": validation_completeness,
                    "conflict_resolution": conflict_resolution_rate
                },
                "quality_checker_score": quality_checker_results.get("overall_score", 0.0),
                "mcp_credibility_score": mcp_validation_results.get("overall_credibility_score", 0.0) * 100
            }
        )

    def _calculate_trustworthiness_score(self, field_validations: List[CrossValidationResult], conflicts: List[DataConflict]) -> float:
        """计算可信度评分"""
        if not field_validations:
            return 0.0

        # 基础分数来自字段验证的置信度
        base_score = sum(fv.confidence_score for fv in field_validations) / len(field_validations) * 100

        # 根据冲突数量扣分
        critical_conflicts = sum(1 for c in conflicts if c.severity == ConflictSeverity.CRITICAL)
        high_conflicts = sum(1 for c in conflicts if c.severity == ConflictSeverity.HIGH)

        penalty = (critical_conflicts * 15) + (high_conflicts * 8)

        return max(0.0, base_score - penalty)

    def _calculate_data_confidence(self, field_validations: List[CrossValidationResult]) -> float:
        """计算数据置信度"""
        if not field_validations:
            return 0.0

        # 基于验证状态和置信度计算
        verified_fields = sum(1 for fv in field_validations if fv.validation_status == "verified")
        total_confidence = sum(fv.confidence_score for fv in field_validations)

        confidence_ratio = verified_fields / len(field_validations)
        average_confidence = total_confidence / len(field_validations)

        return (confidence_ratio * 0.6 + average_confidence * 0.4) * 100

    def _calculate_source_diversity(self, field_validations: List[CrossValidationResult]) -> float:
        """计算源多样性"""
        if not field_validations:
            return 0.0

        # 统计不同源的使用情况
        all_sources = set()
        total_sources = 0

        for fv in field_validations:
            sources = set(fv.sources_verified)
            all_sources.update(sources)
            total_sources += len(sources)

        if total_sources == 0:
            return 0.0

        # 多样性分数 = 不同源数量 / 总源引用数
        diversity_ratio = len(all_sources) / total_sources

        # 考虑源数量本身
        source_count_factor = min(1.0, len(all_sources) / 5.0)  # 5个源为满分

        return (diversity_ratio * 0.7 + source_count_factor * 0.3) * 100

    def _calculate_validation_completeness(self, field_validations: List[CrossValidationResult]) -> float:
        """计算验证完整性"""
        if not field_validations:
            return 0.0

        # 验证字段覆盖率
        fields_with_multiple_sources = sum(1 for fv in field_validations if len(fv.sources_verified) > 1)
        fields_with_high_confidence = sum(1 for fv in field_validations if fv.confidence_score > 0.8)

        completeness_score = (
            fields_with_multiple_sources / len(field_validations) * 0.6 +
            fields_with_high_confidence / len(field_validations) * 0.4
        ) * 100

        return completeness_score

    def _calculate_conflict_resolution_rate(self, conflicts: List[DataConflict], resolved_conflicts: List[DataConflict]) -> float:
        """计算冲突解决率"""
        if not conflicts:
            return 100.0

        # 计算已解决的冲突数量
        resolved_count = sum(1 for rc in resolved_conflicts
                           if "manual_review" not in rc.resolution_suggestion.lower())

        return (resolved_count / len(conflicts)) * 100

    def _determine_quality_grade(self, trustworthiness: float, data_confidence: float,
                               source_diversity: float, validation_completeness: float,
                               conflict_resolution: float) -> str:
        """确定质量等级"""
        scores = {
            "trustworthiness_score": trustworthiness,
            "data_confidence": data_confidence,
            "source_diversity": source_diversity,
            "validation_completeness": validation_completeness,
            "conflict_resolution_rate": conflict_resolution
        }

        # 按等级标准检查
        for grade, criteria in reversed(self.quality_rating_criteria.items()):
            if all(scores.get(metric, 0) >= threshold for metric, threshold in criteria.items()):
                return grade

        return "D"  # 默认最低等级

    def _generate_validation_statistics(self, extracted_data: Dict[str, Any],
                                       field_validations: List[CrossValidationResult],
                                       conflicts: List[DataConflict],
                                       resolved_conflicts: List[DataConflict]) -> Dict[str, Any]:
        """生成验证统计"""
        return {
            "total_data_sources": len(extracted_data["validation_sources"]) + 1,  # +1 for primary
            "total_fields_validated": len(field_validations),
            "fields_with_multiple_sources": sum(1 for fv in field_validations if len(fv.sources_verified) > 1),
            "fields_with_high_confidence": sum(1 for fv in field_validations if fv.confidence_score > 0.8),
            "total_conflicts_detected": len(conflicts),
            "conflicts_by_severity": {
                "critical": sum(1 for c in conflicts if c.severity == ConflictSeverity.CRITICAL),
                "high": sum(1 for c in conflicts if c.severity == ConflictSeverity.HIGH),
                "medium": sum(1 for c in conflicts if c.severity == ConflictSeverity.MEDIUM),
                "low": sum(1 for c in conflicts if c.severity == ConflictSeverity.LOW)
            },
            "conflicts_resolved": len(resolved_conflicts),
            "conflicts_requiring_manual_review": sum(1 for rc in resolved_conflicts
                                                   if "manual_review" in rc.resolution_suggestion.lower()),
            "average_confidence_score": sum(fv.confidence_score for fv in field_validations) / len(field_validations) if field_validations else 0.0,
            "validation_coverage": len(field_validations) / max(1, len(set().union(*(fv.sources_verified for fv in field_validations)))) * 100
        }

    def _generate_cross_validation_recommendations(self, conflicts: List[DataConflict],
                                                 resolved_conflicts: List[DataConflict],
                                                 quality_rating: FinalQualityRating) -> List[str]:
        """生成交叉验证建议"""
        recommendations = []

        # 基于质量等级的建议
        if quality_rating.overall_grade in ["A+", "A"]:
            recommendations.append("数据质量优秀，可以进行高可信度的决策制定")
        elif quality_rating.overall_grade in ["B+", "B"]:
            recommendations.append("数据质量良好，建议在使用前进行关键数据点复核")
        elif quality_rating.overall_grade == "C":
            recommendations.append("数据质量一般，建议补充更多数据源进行验证")
        else:
            recommendations.append("数据质量较低，强烈建议重新收集和验证数据")

        # 基于冲突的建议
        critical_conflicts = sum(1 for c in conflicts if c.severity == ConflictSeverity.CRITICAL)
        if critical_conflicts > 0:
            recommendations.append(f"发现{critical_conflicts}个关键冲突，需要优先人工审核解决")

        # 基于置信度的建议
        if quality_rating.data_confidence < 70:
            recommendations.append("数据置信度偏低，建议增强数据源多样性和验证深度")

        # 基于源多样性的建议
        if quality_rating.source_diversity < 60:
            recommendations.append("数据源多样性不足，建议整合更多独立数据源")

        # 基于冲突解决的建议
        if quality_rating.conflict_resolution_rate < 80:
            recommendations.append("冲突解决率偏低，建议改进自动化冲突解决策略")

        # 具体改进建议
        low_confidence_fields = [fv.field_name for fv in field_validations if fv.confidence_score < 0.6]
        if low_confidence_fields:
            recommendations.append(f"以下字段置信度较低，建议重点验证: {', '.join(low_confidence_fields)}")

        return recommendations

    def export_cross_validation_report(self, report: Dict[str, Any], format: str = "json") -> str:
        """导出交叉验证报告"""
        if format.lower() == "json":
            return json.dumps(report, indent=2, ensure_ascii=False, default=str)
        elif format.lower() == "markdown":
            return self._generate_cross_validation_markdown(report)
        else:
            raise ValueError(f"Unsupported format: {format}")

    def _generate_cross_validation_markdown(self, report: Dict[str, Any]) -> str:
        """生成Markdown格式的交叉验证报告"""
        md_lines = [
            f"# 交叉验证报告 - {report['project_name']}",
            f"",
            f"**验证时间**: {report['validation_timestamp']}",
            f"**最终质量等级**: {report['final_quality_rating'].overall_grade}",
            f"**可信度评分**: {report['final_quality_rating'].trustworthiness_score:.1f}/100",
            f"",
            "## 验证统计摘要",
            f"- 验证字段总数: {report['validation_statistics']['total_fields_validated']}",
            f"- 多源验证字段: {report['validation_statistics']['fields_with_multiple_sources']}",
            f"- 高置信度字段: {report['validation_statistics']['fields_with_high_confidence']}",
            f"- 检测到冲突: {report['validation_statistics']['total_conflicts_detected']}",
            f"- 已解决冲突: {report['validation_statistics']['conflicts_resolved']}",
            f"- 需要人工审核: {report['validation_statistics']['conflicts_requiring_manual_review']}",
            f"",
            "## 质量评级详情",
            f""
        ]

        rating = report["final_quality_rating"]
        md_lines.extend([
            f"- **可信度评分**: {rating.trustworthiness_score:.1f}/100",
            f"- **数据置信度**: {rating.data_confidence:.1f}/100",
            f"- **源多样性**: {rating.source_diversity:.1f}/100",
            f"- **验证完整性**: {rating.validation_completeness:.1f}/100",
            f"- **冲突解决率**: {rating.conflict_resolution_rate:.1f}/100",
            f""
        ])

        # 冲突详情
        if report["conflicts_detected"]:
            md_lines.extend([
                "## 冲突检测详情",
                ""
            ])

            for conflict in report["conflicts_detected"][:10]:  # 限制显示前10个
                severity_icon = {"critical": "🔴", "high": "🟠", "medium": "🟡", "low": "🟢"}
                icon = severity_icon.get(conflict["severity"].value, "⚪")

                md_lines.extend([
                    f"### {icon} {conflict['field_name']}",
                    f"- **严重程度**: {conflict['severity'].value}",
                    f"- **置信度**: {conflict['confidence']:.2f}",
                    f"- **解决建议**: {conflict['resolution_suggestion']}",
                    f""
                ])

        # 改进建议
        if report["recommendations"]:
            md_lines.extend([
                "## 改进建议",
                ""
            ])

            for i, recommendation in enumerate(report["recommendations"], 1):
                md_lines.append(f"{i}. {recommendation}")

        return "\n".join(md_lines)


def main():
    """主函数 - 演示交叉验证器使用"""
    validator = CrossValidator()

    # 示例数据
    project_name = "SERVAL"
    primary_content = """
    SERVAL企业级AI智能解决方案提供商

    基本信息：
    - 公司名称：SERVAL科技
    - 成立时间：2020年
    - 总部：北京
    - CEO：张三
    - 员工数：150人

    融资信息：
    - 最新轮次：A轮
    - 融资金额：1000万美元
    - 估值：2亿美元
    - 投资方：红杉资本

    业务数据：
    - 用户数：500,000
    - 年收入：2000万
    - 增长率：150%
    - 市场份额：5%
    """

    validation_sources = [
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
    ]

    # 模拟质量检查和MCP验证结果
    quality_checker_results = {
        "overall_score": 88.5,
        "template_compliance": 100.0,
        "data_completeness": 92.0,
        "logical_consistency": 85.0,
        "vi_zone_compliance": 88.0
    }

    mcp_validation_results = {
        "overall_credibility_score": 0.87,
        "credibility_change": 0.12,
        "total_tools_executed": 5,
        "successful_tools": 4
    }

    # 执行交叉验证
    cross_validation_report = validator.perform_comprehensive_cross_validation(
        project_name, primary_content, validation_sources,
        quality_checker_results, mcp_validation_results
    )

    # 输出结果
    print("\n" + "="*60)
    print("交叉验证完成")
    print("="*60)
    print(f"最终质量等级: {cross_validation_report['final_quality_rating'].overall_grade}")
    print(f"可信度评分: {cross_validation_report['final_quality_rating'].trustworthiness_score:.1f}/100")
    print(f"验证字段: {cross_validation_report['validation_statistics']['total_fields_validated']}")
    print(f"检测冲突: {cross_validation_report['validation_statistics']['total_conflicts_detected']}")
    print(f"解决冲突: {cross_validation_report['validation_statistics']['conflicts_resolved']}")

    # 导出报告
    report_json = validator.export_cross_validation_report(cross_validation_report, "json")
    report_md = validator.export_cross_validation_report(cross_validation_report, "markdown")

    print(f"\n📄 已生成交叉验证报告")
    print(f"   JSON格式: {len(report_json)} 字符")
    print(f"   Markdown格式: {len(report_md)} 字符")


if __name__ == "__main__":
    main()