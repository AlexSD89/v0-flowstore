#!/usr/bin/env python3
"""
PDF数据提取验证工具
用于验证PDF提取结果的准确性和完整性
"""

import json
import os
import re
from typing import Dict, List, Any, Tuple
from datetime import datetime
import sqlite3

class PDFDataValidator:
    """PDF数据提取验证器"""
    
    def __init__(self):
        self.validation_results = {}
        self.extraction_tools = {
            "unstructured": "原始PDF解析",
            "structured": "结构化提取",
            "manual": "人工验证"
        }
    
    def validate_pdf_extraction(self, pdf_name: str, extracted_data: Dict) -> Dict:
        """验证PDF提取结果"""
        
        validation_result = {
            "pdf_name": pdf_name,
            "validation_time": datetime.now().isoformat(),
            "extraction_completeness": 0.0,
            "data_consistency": 0.0,
            "key_findings_accuracy": 0.0,
            "overall_score": 0.0,
            "issues": [],
            "recommendations": []
        }
        
        # 1. 提取完整性检查
        completeness_score = self._check_extraction_completeness(extracted_data)
        validation_result["extraction_completeness"] = completeness_score
        
        # 2. 数据一致性检查
        consistency_score = self._check_data_consistency(extracted_data)
        validation_result["data_consistency"] = consistency_score
        
        # 3. 关键发现准确性检查
        accuracy_score = self._check_key_findings_accuracy(extracted_data)
        validation_result["key_findings_accuracy"] = accuracy_score
        
        # 4. 计算总体评分
        validation_result["overall_score"] = (
            completeness_score * 0.4 + 
            consistency_score * 0.3 + 
            accuracy_score * 0.3
        )
        
        # 5. 生成建议
        validation_result["recommendations"] = self._generate_recommendations(validation_result)
        
        return validation_result
    
    def _check_extraction_completeness(self, data: Dict) -> float:
        """检查提取完整性"""
        required_fields = [
            "market_size", "growth_rate", "key_players", 
            "trends", "conclusions", "data_sources"
        ]
        
        present_fields = 0
        for field in required_fields:
            if field in data and data[field]:
                present_fields += 1
        
        return present_fields / len(required_fields)
    
    def _check_data_consistency(self, data: Dict) -> float:
        """检查数据一致性"""
        consistency_score = 1.0
        
        # 检查数值数据的一致性
        if "market_size" in data and "growth_rate" in data:
            market_size = data["market_size"]
            growth_rate = data["growth_rate"]
            
            # 简单的逻辑一致性检查
            if isinstance(market_size, (int, float)) and isinstance(growth_rate, (int, float)):
                if market_size > 0 and growth_rate > 0:
                    consistency_score *= 1.0
                else:
                    consistency_score *= 0.8
        
        return consistency_score
    
    def _check_key_findings_accuracy(self, data: Dict) -> float:
        """检查关键发现准确性"""
        accuracy_score = 1.0
        
        # 检查关键发现是否合理
        if "conclusions" in data:
            conclusions = data["conclusions"]
            if isinstance(conclusions, list) and len(conclusions) > 0:
                accuracy_score = 1.0
            else:
                accuracy_score = 0.7
        
        return accuracy_score
    
    def _generate_recommendations(self, validation_result: Dict) -> List[str]:
        """生成改进建议"""
        recommendations = []
        
        if validation_result["extraction_completeness"] < 0.8:
            recommendations.append("建议增加数据提取的完整性，补充缺失的关键字段")
        
        if validation_result["data_consistency"] < 0.9:
            recommendations.append("建议检查数据一致性，确保数值数据的逻辑合理性")
        
        if validation_result["key_findings_accuracy"] < 0.8:
            recommendations.append("建议优化关键发现的提取，确保结论的准确性")
        
        if validation_result["overall_score"] < 0.8:
            recommendations.append("建议整体优化数据提取流程，提升数据质量")
        
        return recommendations

class CrossValidationTool:
    """交叉验证工具"""
    
    def __init__(self):
        self.validation_results = {}
    
    def cross_validate_reports(self, reports_data: Dict) -> Dict:
        """交叉验证多个报告的数据"""
        
        validation_result = {
            "validation_time": datetime.now().isoformat(),
            "total_reports": len(reports_data),
            "consistency_score": 0.0,
            "data_overlap": 0.0,
            "conflicting_findings": [],
            "validated_conclusions": [],
            "recommendations": []
        }
        
        # 1. 检查数据一致性
        consistency_score = self._check_reports_consistency(reports_data)
        validation_result["consistency_score"] = consistency_score
        
        # 2. 分析数据重叠度
        overlap_score = self._analyze_data_overlap(reports_data)
        validation_result["data_overlap"] = overlap_score
        
        # 3. 识别冲突发现
        conflicts = self._identify_conflicting_findings(reports_data)
        validation_result["conflicting_findings"] = conflicts
        
        # 4. 验证结论
        validated_conclusions = self._validate_conclusions(reports_data)
        validation_result["validated_conclusions"] = validated_conclusions
        
        # 5. 生成建议
        validation_result["recommendations"] = self._generate_cross_validation_recommendations(validation_result)
        
        return validation_result
    
    def _check_reports_consistency(self, reports_data: Dict) -> float:
        """检查报告间的一致性"""
        consistency_scores = []
        
        # 比较关键指标的一致性
        key_metrics = ["market_size", "growth_rate", "key_players"]
        
        for metric in key_metrics:
            values = []
            for report_name, report_data in reports_data.items():
                if metric in report_data:
                    values.append(report_data[metric])
            
            if len(values) > 1:
                # 简单的数值一致性检查
                if all(isinstance(v, (int, float)) for v in values):
                    max_val = max(values)
                    min_val = min(values)
                    if max_val > 0:
                        consistency = 1 - (max_val - min_val) / max_val
                        consistency_scores.append(max(0, consistency))
        
        return sum(consistency_scores) / len(consistency_scores) if consistency_scores else 1.0
    
    def _analyze_data_overlap(self, reports_data: Dict) -> float:
        """分析数据重叠度"""
        all_data_points = set()
        common_data_points = set()
        
        for report_name, report_data in reports_data.items():
            report_data_points = set(str(v) for v in report_data.values() if v)
            all_data_points.update(report_data_points)
            
            if not common_data_points:
                common_data_points = report_data_points
            else:
                common_data_points = common_data_points.intersection(report_data_points)
        
        if all_data_points:
            return len(common_data_points) / len(all_data_points)
        return 0.0
    
    def _identify_conflicting_findings(self, reports_data: Dict) -> List[Dict]:
        """识别冲突的发现"""
        conflicts = []
        
        # 检查市场规模的冲突
        market_sizes = []
        for report_name, report_data in reports_data.items():
            if "market_size" in report_data:
                market_sizes.append({
                    "report": report_name,
                    "value": report_data["market_size"]
                })
        
        if len(market_sizes) > 1:
            values = [item["value"] for item in market_sizes if isinstance(item["value"], (int, float))]
            if values:
                max_val = max(values)
                min_val = min(values)
                if max_val > 0 and (max_val - min_val) / max_val > 0.5:
                    conflicts.append({
                        "metric": "market_size",
                        "conflict_level": "high",
                        "values": market_sizes,
                        "description": "市场规模数据存在显著差异"
                    })
        
        return conflicts
    
    def _validate_conclusions(self, reports_data: Dict) -> List[Dict]:
        """验证结论的一致性"""
        validated_conclusions = []
        
        # 收集所有结论
        all_conclusions = []
        for report_name, report_data in reports_data.items():
            if "conclusions" in report_data:
                conclusions = report_data["conclusions"]
                if isinstance(conclusions, list):
                    for conclusion in conclusions:
                        all_conclusions.append({
                            "report": report_name,
                            "conclusion": conclusion
                        })
        
        # 分析结论的一致性
        conclusion_groups = {}
        for item in all_conclusions:
            conclusion_key = self._normalize_conclusion(item["conclusion"])
            if conclusion_key not in conclusion_groups:
                conclusion_groups[conclusion_key] = []
            conclusion_groups[conclusion_key].append(item)
        
        # 验证结论
        for conclusion_key, items in conclusion_groups.items():
            if len(items) > 1:
                validated_conclusions.append({
                    "conclusion": items[0]["conclusion"],
                    "supporting_reports": [item["report"] for item in items],
                    "confidence": len(items) / len(reports_data),
                    "status": "validated"
                })
            else:
                validated_conclusions.append({
                    "conclusion": items[0]["conclusion"],
                    "supporting_reports": [items[0]["report"]],
                    "confidence": 1.0 / len(reports_data),
                    "status": "single_source"
                })
        
        return validated_conclusions
    
    def _normalize_conclusion(self, conclusion: str) -> str:
        """标准化结论文本"""
        # 简单的文本标准化
        normalized = re.sub(r'[^\w\s]', '', conclusion.lower())
        return ' '.join(normalized.split())
    
    def _generate_cross_validation_recommendations(self, validation_result: Dict) -> List[str]:
        """生成交叉验证建议"""
        recommendations = []
        
        if validation_result["consistency_score"] < 0.8:
            recommendations.append("建议进一步验证数据来源，确保报告间数据的一致性")
        
        if validation_result["data_overlap"] < 0.3:
            recommendations.append("建议增加数据重叠度，提高结论的可信度")
        
        if validation_result["conflicting_findings"]:
            recommendations.append("发现数据冲突，建议进行深入调查以确定准确数据")
        
        return recommendations

class ReportQualityAnalyzer:
    """报告质量分析器"""
    
    def __init__(self):
        self.quality_metrics = {
            "completeness": 0.0,
            "accuracy": 0.0,
            "consistency": 0.0,
            "relevance": 0.0,
            "clarity": 0.0
        }
    
    def analyze_report_quality(self, report_data: Dict) -> Dict:
        """分析报告质量"""
        
        quality_result = {
            "report_name": report_data.get("name", "Unknown"),
            "analysis_time": datetime.now().isoformat(),
            "quality_score": 0.0,
            "strengths": [],
            "weaknesses": [],
            "improvement_suggestions": []
        }
        
        # 1. 完整性分析
        completeness = self._analyze_completeness(report_data)
        quality_result["completeness"] = completeness
        
        # 2. 准确性分析
        accuracy = self._analyze_accuracy(report_data)
        quality_result["accuracy"] = accuracy
        
        # 3. 一致性分析
        consistency = self._analyze_consistency(report_data)
        quality_result["consistency"] = consistency
        
        # 4. 相关性分析
        relevance = self._analyze_relevance(report_data)
        quality_result["relevance"] = relevance
        
        # 5. 清晰度分析
        clarity = self._analyze_clarity(report_data)
        quality_result["clarity"] = clarity
        
        # 计算总体质量评分
        quality_result["quality_score"] = (
            completeness * 0.25 +
            accuracy * 0.25 +
            consistency * 0.2 +
            relevance * 0.15 +
            clarity * 0.15
        )
        
        # 生成改进建议
        quality_result["improvement_suggestions"] = self._generate_quality_improvements(quality_result)
        
        return quality_result
    
    def _analyze_completeness(self, report_data: Dict) -> float:
        """分析完整性"""
        required_sections = [
            "executive_summary", "market_overview", "key_findings",
            "conclusions", "data_sources", "methodology"
        ]
        
        present_sections = 0
        for section in required_sections:
            if section in report_data and report_data[section]:
                present_sections += 1
        
        return present_sections / len(required_sections)
    
    def _analyze_accuracy(self, report_data: Dict) -> float:
        """分析准确性"""
        # 简单的准确性检查
        accuracy_score = 1.0
        
        # 检查数据格式
        if "data_sources" in report_data:
            sources = report_data["data_sources"]
            if isinstance(sources, list) and len(sources) > 0:
                accuracy_score *= 1.0
            else:
                accuracy_score *= 0.8
        
        return accuracy_score
    
    def _analyze_consistency(self, report_data: Dict) -> float:
        """分析一致性"""
        consistency_score = 1.0
        
        # 检查内部一致性
        if "key_findings" in report_data and "conclusions" in report_data:
            findings = report_data["key_findings"]
            conclusions = report_data["conclusions"]
            
            if isinstance(findings, list) and isinstance(conclusions, list):
                if len(findings) > 0 and len(conclusions) > 0:
                    consistency_score = 1.0
                else:
                    consistency_score = 0.7
        
        return consistency_score
    
    def _analyze_relevance(self, report_data: Dict) -> float:
        """分析相关性"""
        relevance_score = 1.0
        
        # 检查内容相关性
        if "market_overview" in report_data:
            overview = report_data["market_overview"]
            if overview and len(str(overview)) > 100:
                relevance_score = 1.0
            else:
                relevance_score = 0.6
        
        return relevance_score
    
    def _analyze_clarity(self, report_data: Dict) -> float:
        """分析清晰度"""
        clarity_score = 1.0
        
        # 检查结构清晰度
        if "executive_summary" in report_data:
            summary = report_data["executive_summary"]
            if summary and len(str(summary)) > 50:
                clarity_score = 1.0
            else:
                clarity_score = 0.7
        
        return clarity_score
    
    def _generate_quality_improvements(self, quality_result: Dict) -> List[str]:
        """生成质量改进建议"""
        suggestions = []
        
        if quality_result["completeness"] < 0.8:
            suggestions.append("增加缺失的报告章节，提高完整性")
        
        if quality_result["accuracy"] < 0.8:
            suggestions.append("验证数据来源，提高准确性")
        
        if quality_result["consistency"] < 0.8:
            suggestions.append("检查内部逻辑一致性")
        
        if quality_result["relevance"] < 0.8:
            suggestions.append("增强内容相关性，聚焦核心主题")
        
        if quality_result["clarity"] < 0.8:
            suggestions.append("优化报告结构，提高清晰度")
        
        return suggestions

def main():
    """主函数 - 演示工具使用"""
    
    # 初始化工具
    validator = PDFDataValidator()
    cross_validator = CrossValidationTool()
    quality_analyzer = ReportQualityAnalyzer()
    
    # 模拟PDF提取数据
    sample_data = {
        "AI应用Web端半年度报告": {
            "market_size": 1000000000,
            "growth_rate": 0.15,
            "key_players": ["OpenAI", "Anthropic", "Google"],
            "conclusions": ["市场快速增长", "竞争激烈", "技术驱动"],
            "data_sources": ["SimilarWeb", "行业报告"]
        },
        "中美AI应用访问量分析报告": {
            "market_size": 950000000,
            "growth_rate": 0.12,
            "key_players": ["OpenAI", "Anthropic", "百度"],
            "conclusions": ["美国领先", "中国追赶", "差异化竞争"],
            "data_sources": ["SimilarWeb", "市场调研"]
        }
    }
    
    print("=== PDF数据提取验证工具演示 ===\n")
    
    # 1. 验证单个PDF提取
    print("1. 单个PDF提取验证:")
    for pdf_name, data in sample_data.items():
        result = validator.validate_pdf_extraction(pdf_name, data)
        print(f"   {pdf_name}: {result['overall_score']:.2f}")
    
    # 2. 交叉验证
    print("\n2. 交叉验证结果:")
    cross_result = cross_validator.cross_validate_reports(sample_data)
    print(f"   一致性评分: {cross_result['consistency_score']:.2f}")
    print(f"   数据重叠度: {cross_result['data_overlap']:.2f}")
    
    # 3. 质量分析
    print("\n3. 报告质量分析:")
    for report_name, data in sample_data.items():
        data["name"] = report_name
        quality_result = quality_analyzer.analyze_report_quality(data)
        print(f"   {report_name}: {quality_result['quality_score']:.2f}")
    
    print("\n=== 验证完成 ===")

if __name__ == "__main__":
    main()