#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
门赢客户Excel业务数据深度分析脚本
深度分析Excel文件中的业务逻辑、数据结构和客户需求
"""

import openpyxl
import json
import os
from datetime import datetime
import sys

def analyze_excel_file(file_path):
    """
    深度分析Excel文件的业务数据结构
    """
    try:
        workbook = openpyxl.load_workbook(file_path, data_only=True)
        analysis_result = {
            "文件信息": {},
            "工作表分析": {},
            "业务逻辑洞察": {},
            "数据质量评估": {},
            "可复制模式": {}
        }

        # 基本信息
        analysis_result["文件信息"] = {
            "文件名": os.path.basename(file_path),
            "工作表数量": len(workbook.sheetnames),
            "工作表列表": workbook.sheetnames,
            "分析时间": datetime.now().isoformat()
        }

        # 逐个分析工作表
        for sheet_name in workbook.sheetnames:
            sheet = workbook[sheet_name]
            sheet_analysis = analyze_worksheet(sheet)
            analysis_result["工作表分析"][sheet_name] = sheet_analysis

        # 业务逻辑洞察
        analysis_result["业务逻辑洞察"] = extract_business_logic(analysis_result["工作表分析"])

        # 数据质量评估
        analysis_result["数据质量评估"] = assess_data_quality(analysis_result["工作表分析"])

        # 可复制模式
        analysis_result["可复制模式"] = identify_replicable_patterns(analysis_result["工作表分析"])

        return analysis_result

    except Exception as e:
        return {
            "错误": f"分析Excel文件时发生错误: {str(e)}",
            "文件路径": file_path
        }

def analyze_worksheet(sheet):
    """
    分析单个工作表
    """
    analysis = {
        "基本信息": {
            "名称": sheet.title,
            "最大行数": sheet.max_row,
            "最大列数": sheet.max_column,
            "数据范围": f"A1:{sheet.max_column_letter}{sheet.max_row}"
        },
        "数据结构": {},
        "内容分析": {},
        "字段详情": {}
    }

    # 分析数据结构
    data_structure = analyze_data_structure(sheet)
    analysis["数据结构"] = data_structure

    # 分析内容
    content_analysis = analyze_content(sheet)
    analysis["内容分析"] = content_analysis

    # 详细字段分析
    field_details = analyze_fields(sheet)
    analysis["字段详情"] = field_details

    return analysis

def analyze_data_structure(sheet):
    """
    分析数据结构
    """
    structure = {
        "表头信息": [],
        "数据行数": 0,
        "空值统计": {},
        "数据类型分布": {}
    }

    # 获取表头
    headers = []
    for col in range(1, sheet.max_column + 1):
        cell_value = sheet.cell(row=1, column=col).value
        if cell_value:
            headers.append(str(cell_value))
        else:
            headers.append(f"Column_{col}")

    structure["表头信息"] = headers

    # 统计数据行数
    data_rows = 0
    for row in range(2, sheet.max_row + 1):
        has_data = False
        for col in range(1, sheet.max_column + 1):
            if sheet.cell(row=row, column=col).value:
                has_data = True
                break
        if has_data:
            data_rows += 1

    structure["数据行数"] = data_rows

    # 空值统计
    empty_stats = {}
    for i, header in enumerate(headers):
        empty_count = 0
        for row in range(2, sheet.max_row + 1):
            if not sheet.cell(row=row, column=i+1).value:
                empty_count += 1
        empty_stats[header] = {
            "空值数量": empty_count,
            "空值率": f"{(empty_count/data_rows*100):.1f}%" if data_rows > 0 else "0%"
        }

    structure["空值统计"] = empty_stats

    return structure

def analyze_content(sheet):
    """
    分析内容特征
    """
    content = {
        "关键词统计": {},
        "文本长度分析": {},
        "数值特征": {},
        "业务主题识别": []
    }

    # 关键词统计
    all_text = []
    for row in range(1, sheet.max_row + 1):
        for col in range(1, sheet.max_column + 1):
            cell_value = sheet.cell(row=row, column=col).value
            if cell_value and isinstance(cell_value, str):
                all_text.append(cell_value.lower())

    # 业务关键词识别
    business_keywords = [
        "品牌", "公司", "产品", "服务", "客户", "营销", "设计", "技术", "研发",
        "认证", "质量", "团队", "规模", "国际", "市场", "销售", "生产", "定制",
        "门窗", "建筑", "工程", "项目", "案例", "合作", "全球", "专业"
    ]

    keyword_count = {}
    for keyword in business_keywords:
        count = sum(text.count(keyword) for text in all_text)
        if count > 0:
            keyword_count[keyword] = count

    content["关键词统计"] = keyword_count

    # 业务主题识别
    themes = []
    if keyword_count.get("门窗", 0) > 0:
        themes.append("门窗制造业务")
    if keyword_count.get("品牌", 0) > 0:
        themes.append("品牌建设需求")
    if keyword_count.get("国际", 0) > 0 or keyword_count.get("全球", 0) > 0:
        themes.append("国际化业务")
    if keyword_count.get("认证", 0) > 0:
        themes.append("质量认证需求")

    content["业务主题识别"] = themes

    return content

def analyze_fields(sheet):
    """
    详细字段分析
    """
    fields = {}

    for col in range(1, sheet.max_column + 1):
        header = sheet.cell(row=1, column=col).value
        if not header:
            continue

        field_name = str(header)
        field_data = []

        for row in range(2, sheet.max_row + 1):
            cell_value = sheet.cell(row=row, column=col).value
            if cell_value:
                field_data.append(str(cell_value))

        if field_data:
            fields[field_name] = {
                "数据类型": detect_data_type(field_data),
                "样本数量": len(field_data),
                "唯一值数量": len(set(field_data)),
                "样本数据": field_data[:3],  # 前3个样本
                "完整性": f"{(len(field_data)/(sheet.max_row-1)*100):.1f}%"
            }

    return fields

def detect_data_type(data_list):
    """
    检测数据类型
    """
    if not data_list:
        return "空"

    # 检查是否为数值
    numeric_count = 0
    for item in data_list:
        try:
            float(item.replace(",", "").replace("元", "").replace("$", ""))
            numeric_count += 1
        except:
            pass

    if numeric_count / len(data_list) > 0.7:
        return "数值"

    # 检查是否为日期
    date_keywords = ["年", "月", "日", "成立", "建立"]
    if any(keyword in str(data_list[0]) for keyword in date_keywords):
        return "日期"

    # 检查是否为URL
    if any("http" in item for item in data_list):
        return "链接"

    return "文本"

def extract_business_logic(sheet_analysis):
    """
    提取业务逻辑洞察
    """
    insights = {
        "数据收集目的": [],
        "业务流程特征": [],
        "客户需求层次": [],
        "数据复用策略": []
    }

    # 分析所有工作表
    for sheet_name, sheet_data in sheet_analysis.items():
        content = sheet_data.get("内容分析", {})
        keywords = content.get("关键词统计", {})
        themes = content.get("业务主题识别", [])

        # 数据收集目的
        if "品牌" in keywords:
            insights["数据收集目的"].append("品牌信息收集")
        if "产品" in keywords:
            insights["数据收集目的"].append("产品信息整理")
        if "公司" in keywords:
            insights["数据收集目的"].append("企业信息统计")

        # 业务流程特征
        if "定制" in keywords:
            insights["业务流程特征"].append("定制化服务流程")
        if "国际" in keywords or "全球" in keywords:
            insights["业务流程特征"].append("国际化业务流程")
        if "认证" in keywords:
            insights["业务流程特征"].append("质量认证流程")

        # 客户需求层次
        if themes:
            insights["客户需求层次"].extend(themes)

    # 数据复用策略
    sheet_names = list(sheet_analysis.keys())
    if len(sheet_names) > 1:
        insights["数据复用策略"] = [
            f"多工作表数据关联 ({' → '.join(sheet_names)})",
            "数据一致性检查机制",
            "跨表数据引用优化"
        ]

    return insights

def assess_data_quality(sheet_analysis):
    """
    评估数据质量
    """
    quality = {
        "完整性评分": 0,
        "一致性评分": 0,
        "准确性评分": 0,
        "可用性评分": 0,
        "改进建议": []
    }

    total_completeness = 0
    total_consistency = 0
    sheet_count = len(sheet_analysis)

    for sheet_name, sheet_data in sheet_analysis.items():
        structure = sheet_data.get("数据结构", {})
        empty_stats = structure.get("空值统计", {})

        # 完整性评分
        if empty_stats:
            avg_completeness = 100 - sum(float(rate.replace("%", "")) for rate in empty_stats.values()) / len(empty_stats)
            total_completeness += avg_completeness

        # 一致性评分
        fields = sheet_data.get("字段详情", {})
        if fields:
            consistency_score = 0
            for field_name, field_data in fields.items():
                completeness = float(field_data.get("完整性", "0%").replace("%", ""))
                consistency_score += completeness

            if len(fields) > 0:
                avg_consistency = consistency_score / len(fields)
                total_consistency += avg_consistency

    # 计算平均分
    if sheet_count > 0:
        quality["完整性评分"] = round(total_completeness / sheet_count, 1)
        quality["一致性评分"] = round(total_consistency / sheet_count, 1)

    # 准确性和可用性评分（基于完整性推算）
    quality["准确性评分"] = min(quality["完整性评分"], 90)
    quality["可用性评分"] = min(quality["一致性评分"], 85)

    # 改进建议
    if quality["完整性评分"] < 80:
        quality["改进建议"].append("提高数据完整性，减少空值")
    if quality["一致性评分"] < 85:
        quality["改进建议"].append("加强数据一致性检查")
    if sheet_count > 1:
        quality["改进建议"].append("建立跨工作表数据验证机制")

    return quality

def identify_replicable_patterns(sheet_analysis):
    """
    识别可复制的模式
    """
    patterns = {
        "数据结构模式": [],
        "业务规则模式": [],
        "处理流程模式": [],
        "质量控制模式": []
    }

    # 分析数据结构模式
    for sheet_name, sheet_data in sheet_analysis.items():
        structure = sheet_data.get("数据结构", {})
        headers = structure.get("表头信息", [])

        if len(headers) > 5:
            patterns["数据结构模式"].append(f"{sheet_name}: 结构化数据收集模式")

        if "品牌" in " ".join(headers):
            patterns["业务规则模式"].append("品牌信息标准化收集")

        if "产品" in " ".join(headers):
            patterns["业务规则模式"].append("产品信息分类管理")

    # 处理流程模式
    patterns["处理流程模式"] = [
        "信息收集 → 数据验证 → 内容生成 → 质量检查",
        "模板驱动的内容生产流程",
        "多语言内容适配流程"
    ]

    # 质量控制模式
    patterns["质量控制模式"] = [
        "数据完整性检查机制",
        "内容质量评分体系",
        "跨表一致性验证"
    ]

    return patterns

def main():
    """
    主函数
    """
    excel_file = "/Users/dangsiyuan/Documents/obsidion/launch x/Gate客户项目/奇境-小龙项目/01-客户数据/原始数据/整理共同性可AI化项目/旺铺商家需求/门赢/门赢-领航会员信息收集表格 (1).xlsx"

    if not os.path.exists(excel_file):
        print(f"错误：文件不存在 {excel_file}")
        return

    print("开始深度分析门赢客户Excel数据...")
    analysis_result = analyze_excel_file(excel_file)

    # 保存分析结果
    output_file = "/Users/dangsiyuan/Documents/obsidion/launch x/Gate客户项目/奇境-小龙项目/01-客户数据/分析报告/门赢Excel深度分析结果.json"

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(analysis_result, f, ensure_ascii=False, indent=2)

    print(f"分析完成！结果已保存到: {output_file}")

    # 打印关键洞察
    if "业务逻辑洞察" in analysis_result:
        print("\n=== 业务逻辑洞察 ===")
        for category, insights in analysis_result["业务逻辑洞察"].items():
            print(f"{category}:")
            for insight in insights:
                print(f"  - {insight}")

    if "可复制模式" in analysis_result:
        print("\n=== 可复制模式 ===")
        for category, patterns in analysis_result["可复制模式"].items():
            print(f"{category}:")
            for pattern in patterns:
                print(f"  - {pattern}")

if __name__ == "__main__":
    main()