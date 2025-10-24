---
alwaysApply: false
category: knowledge
description: AI项目档案管理工作流v2.4 - RUBE MCP集成版
globs:
- '**/*报告*'
- '**/*分析*'
last_update: '2025-10-24'
owners: []
status: published
tags: []
title: ''
---

# AI项目档案管理工作流v2.4 - RUBE MCP智能集成版

> **核心理念**: 将RUBE MCP的搜索、排序、思考能力深度融入6步智能工作流，实现从重复检测到交叉验证的全流程自动化
>
> **版本**: v2.4 | **状态**: ACTIVE | **最后更新**: 2025-01-15

---

## 🚀 工作流概览

### v2.4六步智能工作流

```
STEP1: DUPLICATE_SCAN → STEP2: DATA_HARVEST → STEP3: CONTENT_GEN
↓                    ↓                    ↓
STEP4: DELIVER_CHECK ← STEP5: MCP_VALIDATION ← STEP6: CROSS_VALIDATION
```

### 核心创新点

1. **RUBE MCP深度集成**: 搜索、排序、思考能力全流程嵌入
2. **三层质量验证体系**: 交付检查 → MCP验证 → 交叉验证
3. **A+可信度评级系统**: 量化评估报告质量(≥90分)
4. **并行工具链执行**: 多MCP工具同时工作，效率提升60%+

---

## 📋 详细执行步骤

### STEP 1: DUPLICATE_SCAN - 重复性扫描与知识资产识别
**核心目标**: 避免重复研究，识别现有知识资产

**执行逻辑**:
```python
def step1_duplicate_scan(project_name):
    # 知识库扫描

## 📋 执行摘要

[请在此处提供文档的核心内容摘要，包括关键发现、主要结论和重要建议。建议控制在200-300字以内。]

**核心要点**:
- [要点1]
- [要点2]
- [要点3]


    duplicate_analysis = {
        "knowledge_base_scan": scan_existing_knowledge_base(project_name),
        "content_similarity_check": calculate_content_similarity(project_name),
        "update_vs_create_decision": determine_update_or_create_strategy(project_name)
    }

    # 智能决策
    if duplicate_analysis["similarity_score"] >= 0.8:
        return {
            "recommendation": "UPDATE_EXISTING",
            "existing_report_id": duplicate_analysis["matching_report_id"],
            "update_areas": identify_update_areas(project_name)
        }
    else:
        return {
            "recommendation": "CREATE_NEW",
            "confidence_score": duplicate_analysis["uniqueness_score"],
            "existing_gaps": identify_knowledge_gaps(project_name)
        }
```

**输出格式**:
```json
{
  "duplicate_scan_status": "PASSED",
  "recommendation": "CREATE_NEW|UPDATE_EXISTING",
  "similarity_score": "0.65",
  "existing_assets": [],
  "confidence_score": "85%"
}
```

---

### STEP 2: DATA_HARVEST - RUBE MCP智能数据采集
**核心目标**: 使用RUBE MCP工具进行搜索、排序、思考的全方位信息采集

**执行逻辑**:
1. **RUBE搜索** - 发现适用于项目的最佳MCP工具
2. **并行采集** - 使用多个工具同时收集数据
3. **智能排序** - 对数据源按质量和相关性排序
4. **深度分析** - 使用RUBE思考能力提取洞察

**RUBE使用方式**:
```python
# 1. 发现可用工具
available_tools = mcp__rube__RUBE_SEARCH_TOOLS(
    use_case=f"AI项目{project_name}深度分析",
    session={"generate_id": True}
)

# 2. 并行执行数据采集 (搜索+爬取+GitHub分析)
data_collection = mcp__rube__RUBE_MULTI_EXECUTE_TOOL(
    tools=[
        {
            "tool_slug": "TAVILY_TAVILY_SEARCH",
            "arguments": {"query": f"{project_name} AI workflow", "max_results": 15}
        },
        {
            "tool_slug": "FIRECRAWL_SEARCH",
            "arguments": {"query": f"{project_name} technical documentation", "limit": 10}
        },
        {
            "tool_slug": "GITHUB_SEARCH_REPOSITORIES",
            "arguments": {"query": f"{project_name} automation", "language": "python"}
        }
    ],
    session={"id": "harvest_session"},
    memory={"project_focus": [project_name, "AI项目档案管理"]}
)

# 3. 智能排序和分析
ranked_data = mcp__rube__RUBE_REMOTE_WORKBENCH(
    session_id="harvest_session",
    code_to_execute="""
# 对采集的数据按相关性、权威性、时效性排序
# 提取关键洞察和趋势信号
# 生成数据质量评估报告
""",
    thought_process="对多源数据进行智能排序和深度分析"
)

return ranked_data
```

**输出格式**:
```json
{
  "data_harvest_status": "SUCCESS",
  "total_sources": 25,
  "high_quality_sources": 18,
  "data_quality_score": "87%",
  "key_insights": [],
  "rube_tools_used": ["RUBE_SEARCH_TOOLS", "RUBE_MULTI_EXECUTE_TOOL", "RUBE_REMOTE_WORKBENCH"]
}
```

---

### STEP 3: CONTENT_GEN - 结构化内容生成
**核心目标**: 基于8段式结构生成完整分析报告

**8段式结构模板**:
```markdown
---
title: [报告标题]
date: 2025-01-15
version: v2.4
credibility_score: "待评估"
mcp_tools: ["rube", "tavily", "firecrawl"]
---

## 1. 执行摘要
## 2. 项目背景与范围
## 3. 核心发现与洞察
## 4. 深度分析
## 5. 技术规格评估
## 6. 竞争格局分析
## 7. 趋势与展望
## 8. 结论与建议
```

**执行逻辑**:
```python
def step3_content_gen(harvested_data):
    # 基于采集数据生成结构化内容
    content_structure = {
        "executive_summary": generate_executive_summary(harvested_data),
        "project_background": extract_project_background(harvested_data),
        "core_findings": synthesize_core_findings(harvested_data),
        "deep_analysis": perform_deep_analysis(harvested_data),
        "technical_specs": extract_technical_specifications(harvested_data),
        "competitive_landscape": analyze_competitive_landscape(harvested_data),
        "trends_outlook": identify_trends_and_outlook(harvested_data),
        "conclusions_recommendations": formulate_conclusions(harvested_data)
    }

    return structure_content(content_structure)
```

---

### STEP 4: DELIVER_CHECK - 交付质量检查
**核心目标**: 确保报告质量和完整性

**检查清单**:
```python
def step4_deliver_check(generated_content):
    quality_checks = {
        "structure_completeness": verify_structure_completeness(generated_content),
        "content_quality": assess_content_quality(generated_content),
        "data_consistency": validate_data_consistency(generated_content),
        "format_compliance": check_markdown_formatting(generated_content),
        "citation_integrity": verify_citation_integrity(generated_content)
    }

    quality_score = calculate_overall_quality_score(quality_checks)

    return {
        "delivery_status": "APPROVED" if quality_score >= 85 else "NEEDS_REVISION",
        "quality_score": quality_score,
        "issues_identified": identify_quality_issues(quality_checks),
        "recommendations": generate_improvement_recommendations(quality_checks)
    }
```

---

### STEP 5: MCP_VALIDATION - 独立MCP工具验证
**核心目标**: 使用独立MCP工具验证数据准确性

**执行逻辑**:
```python
def step5_mcp_validation(report_data):
    # 独立MCP工具验证
    validation_results = {
        "rube_cross_check": mcp__rube__RUBE_MULTI_EXECUTE_TOOL(
            tools=[{"tool_slug": "VERIFY_COMPANY_DATA", "arguments": report_data}],
            session={"id": report_data["session_id"]},
            memory={"validation": ["independent_company_verification"]}
        ),
        "market_validation": validate_market_data_independently(report_data),
        "technical_review": validate_technical_claims(report_data)
    }

    # 交叉验证评分
    validation_score = calculate_validation_score(validation_results)

    return {
        "validation_status": "VALIDATED" if validation_score >= 85 else "NEEDS_REVIEW",
        "validation_score": validation_score,
        "discrepancies": identify_data_discrepancies(validation_results),
        "recommendations": generate_validation_recommendations(validation_results)
    }
```

---

### STEP 6: CROSS_VALIDATION - 综合交叉验证分析
**核心目标**: 多维度数据一致性检查，确保分析可靠性

**执行逻辑**:
```python
def step6_cross_validation(report_data, mcp_validation):
    # 综合交叉验证分析
    cross_validation_analysis = {
        "internal_consistency": analyze_internal_logic_consistency(report_data),
        "external_verification": compare_with_external_sources(report_data),
        "multi_source_reconciliation": reconcile_different_data_sources(report_data),
        "temporal_consistency": verify_timeline_consistency(report_data),
        "quantitative_validation": validate_numerical_data_accuracy(report_data)
    }

    # 生成交叉验证报告
    credibility_score = calculate_credibility_score(cross_validation_analysis)

    return {
        "cross_validation_status": "PASSED" if credibility_score >= 90 else "REQUIRES_ATTENTION",
        "credibility_score": credibility_score,
        "credibility_grade": assign_credibility_grade(credibility_score),
        "validation_details": cross_validation_analysis,
        "final_recommendations": generate_final_recommendations(cross_validation_analysis)
    }
```

---

## 📊 v2.4工作流优势对比

| 维度 | 传统4步流程 | v2.4六步流程 |
|---|---|---|
| **处理效率** | 串行处理，单一通道 | 并行MCP工具链，多通道并发 |
| **数据质量** | 单一来源验证 | 多源交叉验证，MCP独立验证 |
| **重复检测** | 无内置机制 | STEP1专用重复性扫描 |
| **质量控制** | 基础质量检查 | STEP4交付检查 + STEP5 MCP验证 + STEP6交叉验证 |
| **可信度评级** | 无量化标准 | A+可信度评级系统 (≥90分) |
| **可追溯性** | 基础文档记录 | 完整VI数据溯源区，多源验证链路 |
| **自动化程度** | 人工密集型 | AI原生 + MCP工具链自动化 |

---

## 🎯 核心创新详解

### 1. 重复性扫描机制 (STEP1)
```python
# 避免重复研究的智能检测
duplicate_detection = {
    "knowledge_base_scan": "扫描已有知识库相似项目",
    "content_similarity_check": "内容相似度检测",
    "update_vs_create_decision": "智能决策更新或新建"
}
```

### 2. RUBE MCP智能数据采集 (STEP2)
```python
# 使用RUBE进行搜索、排序、思考的智能数据采集
rube_mcp_features = {
    "智能搜索": "RUBE_SEARCH_TOOLS - 自动发现最佳工具",
    "并行执行": "RUBE_MULTI_EXECUTE_TOOL - 多工具同时工作",
    "智能排序": "RUBE_REMOTE_WORKBENCH - 数据质量排序",
    "深度分析": "基于LLM的洞察提取和趋势分析"
}
```

### 3. 三层质量验证体系 (STEP4-6)
```python
# 三层递进式质量验证
quality_validation_pyramid = {
    "layer1_delivery_check": "基础质量和完整性检查",
    "layer2_mcp_validation": "独立MCP工具验证",
    "layer3_cross_validation": "综合交叉验证分析"
}
```

### 4. A+可信度评级系统
```python
# 量化可信度评估
credibility_scoring = {
    "data_consistency": "数据一致性评分 (0-100)",
    "source_authority": "信息来源权威性评分 (0-100)",
    "analysis_depth": "分析深度评分 (0-100)",
    "cross_validation": "交叉验证通过率 (0-100)",
    "overall_credibility": "综合可信度评分 (0-100)",
    "grade_assignment": "A+/A/B+/B/C 等级评定"
}
```

---

## 🤖 AI统一输出格式

```json
{
  "workflow_version": "v2.4",
  "ai_flow": "6step_core",
  "traditional_mapping": "12step_compatible",
  "current_step": "STEP1|STEP2|STEP3|STEP4|STEP5|STEP6",
  "status": "SUCCESS|ERROR|WARNING",
  "credibility_score": "94.5/100",
  "credibility_grade": "A+",
  "mcp_tools_used": ["rube", "tavily", "context7"],
  "validation_status": "PASSED",
  "next_action": "下一步指令"
}
```

---

## 🚨 异常处理协议

### 数据采集异常
```
ERROR: MCP_TOOL_FAILURE
ACTION: 降级到备用工具，标记数据质量警告
OUTPUT: 生成数据质量评估报告
```

### 验证失败异常
```
ERROR: VALIDATION_FAILED
ACTION: 重新执行数据采集，调整验证阈值
OUTPUT: 生成验证修复建议
```

### 可信度不足异常
```
ERROR: CREDIBILITY_BELOW_THRESHOLD
ACTION: 触发补充数据采集，重新分析
OUTPUT: 生成质量提升行动计划
```

---

## 📈 性能指标

### 效率指标
- **处理时间**: 单报告 < 8分钟 (相比传统方法提升60%+)
- **并行度**: 最多3个MCP工具同时执行
- **成功率**: 首次通过率 ≥ 85%

### 质量指标
- **数据源覆盖**: ≥ 15个高质量来源
- **交叉验证**: 关键数据至少3个独立来源确认
- **可信度评分**: A+等级 ≥ 90分

### RUBE集成效果
- **工具发现准确率**: ≥ 95%
- **智能排序效果**: 高质量数据源占比 ≥ 80%
- **深度分析质量**: 洞察提取准确率 ≥ 90%

---

## 🎯 使用指南

### 快速开始
1. **项目输入**: 提供AI项目名称和分析要求
2. **自动执行**: 系统自动执行6步工作流
3. **质量监控**: 实时监控各步骤执行状态
4. **结果交付**: 生成A+可信度报告

### 高级配置
```yaml
workflow_config:
  rube_settings:
    parallel_tools: ["tavily", "firecrawl", "github"]
    quality_threshold: 0.8
    analysis_depth: "comprehensive"

  validation_layers:
    delivery_check: true
    mcp_validation: true
    cross_validation: true

  output_requirements:
    credibility_grade: "A+"
    min_sources: 15
    format_standard: "markdown"
```

---

## 📚 附录

## 📊 核心发现

### 发现1: [标题]
[详细描述关键发现的内容、数据和意义]

### 发现2: [标题]
[详细描述关键发现的内容、数据和意义]

### 发现3: [标题]
[详细描述关键发现的内容、数据和意义]

## 🎯 重要意义

## 💡 结论与建议

## 📈 监控指标

## 📚 参考链接

### 内部资料
- [相关内部文档链接]
- [相关项目文档链接]
- [相关研究报告链接]

### 外部资源
- [外部研究报告链接]
- [行业分析链接]
- [专家观点链接]

### 数据来源
- [数据来源1] - [访问时间]
- [数据来源2] - [访问时间]
- [数据来源3] - [访问时间]

### 工具和平台
- [推荐工具1]
- [推荐工具2]
- [推荐工具3]



### 核心指标
- **[指标名称]**: [目标值] - [监控频率]
- **[指标名称]**: [目标值] - [监控频率]
- **[指标名称]**: [目标值] - [监控频率]

### 跟踪方法
- [监控方法1]
- [监控方法2]
- [监控方法3]

### 评估标准
- [标准1]: [评估方法]
- [标准2]: [评估方法]



### 主要结论
基于以上分析，我们得出以下核心结论：

1. [结论1 - 基于数据分析得出的结论]
2. [结论2 - 基于市场观察得出的结论]
3. [结论3 - 基于趋势判断得出的结论]

### 行动建议

#### 立即行动项 (0-30天)
- [行动项1] - [具体执行步骤]
- [行动项2] - [具体执行步骤]

#### 短期优化项 (30-90天)
- [优化项1] - [具体实施计划]
- [优化项2] - [具体实施计划]

#### 长期发展项 (90-180天)
- [发展项1] - [战略规划]
- [发展项2] - [战略规划]

### 成功指标
- [指标1]: [目标值] - [监控方法]
- [指标2]: [目标值] - [监控方法]



这些发现对[相关领域/决策]具有重要的指导意义，特别是：

1. [意义1]
2. [意义2]
3. [意义3]



### RUBE MCP工具映射
| 功能 | RUBE工具 | 用途 |
|---|---|---|
| 智能搜索 | RUBE_SEARCH_TOOLS | 发现最佳MCP工具组合 |
| 并行执行 | RUBE_MULTI_EXECUTE_TOOL | 多工具同时数据采集 |
| 智能分析 | RUBE_REMOTE_WORKBENCH | 数据排序和深度分析 |

### 报告类型映射
```python
report_types = {
    "T": "趋势洞察",
    "C": "关键结论",
    "ARG": "商业论证",
    "P": "人物画像",
    "TECH": "技术分析",
    "F": "分析框架",
    "S": "投资策略"
}
```

### 输出路径规范
```
knowledge/03_研究报告/
├── 1_趋势洞察/
├── 2_商业分析/
├── 4_技术洞察/
├── 5_方法论/
└── 5.1_投资相关/
```

---

> **执行确认**: 本工作流v2.4已深度集成RUBE MCP能力，实现智能搜索、并行采集、排序分析和深度思考的全流程自动化。每次执行后请记录关键指标和改进建议。