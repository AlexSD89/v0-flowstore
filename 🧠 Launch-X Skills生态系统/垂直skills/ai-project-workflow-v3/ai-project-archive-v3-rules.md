# AI项目档案管理工作流v3.0 Rules

> **Skill类型**: 垂直工作流Rules  
> **功能**: 100%执行v2.4设计确认的AI项目档案管理工作流  
> **输入**: 项目名称 + 基础需求描述  
> **输出**: A+级专业分析报告  
> **调用方式**: `/skill ai-project-archive-v3-rules "项目名称"`

## 🎯 Rules定义

### Rule 1: 工作流启动规则
```yaml
rule_name: "workflow_initiation"
condition: "收到项目分析请求"
action: "启动六步智能工作流"
parameters:
  - project_name: string (required)
  - quality_target: "A+" (default)
  - analysis_depth: "comprehensive" (default)
validation:
  - 项目名称不能为空
  - 项目描述长度≥10字符
```

### Rule 2: 智能技能分配规则
```yaml
rule_name: "skills_allocation"
condition: "基于项目类型和需求自动分配Skills"
action: "映射Skills到工作流步骤"
mapping:
  STEP1_DUPLICATE_SCAN: "knowledge-master"
  STEP2_DATA_HARVEST: 
    - "trend-researcher"
    - "data-analyst"
  STEP3_CONTENT_GEN: "data-analyst"
  STEP4_DELIVER_CHECK: "academic-researcher"
  STEP5_MCP_VALIDATION: "独立工具验证"
  STEP6_CROSS_VALIDATION: "综合评估"
```

### Rule 3: 质量门控规则
```yaml
rule_name: "quality_gates"
condition: "每个工作流步骤完成时"
action: "执行质量检查"
gates:
  STEP3:
    min_score: 85
    required_dimensions: ["结构完整性", "分析深度", "洞察质量"]
  STEP4:
    min_score: 88
    required_dimensions: ["质量符合性", "完整性检查", "准确性验证"]
  FINAL:
    min_score: 90
    required_dimensions: ["可信度评分", "验证覆盖度", "最终评估"]
```

### Rule 4: 自动重试规则
```yaml
rule_name: "automatic_retry"
condition: "质量检查未达标"
action: "执行智能重试策略"
strategy:
  max_attempts: 2
  retry_triggers:
    - quality_score_below_threshold
    - validation_failure
    - insufficient_data_sources
  escalation_rules:
    quality_below_80: "manual_review"
    data_insufficiency: "source_enhancement"
    logic_inconsistency: "restructuring"
```

## 🔄 工作流执行序列

### Phase 1: 项目初始化
```python
def initialize_project(project_name: str, requirements: dict):
    """初始化项目并配置执行参数"""
    # Rule 1: 验证输入参数
    validate_project_input(project_name, requirements)
    
    # Rule 2: 分配Skills映射
    skills_mapping = allocate_skills(requirements)
    
    # Rule 3: 设置质量目标
    quality_targets = set_quality_standards(requirements.get('quality_target', 'A+'))
    
    return {
        'project_name': project_name,
        'skills_mapping': skills_mapping,
        'quality_targets': quality_targets,
        'execution_plan': generate_execution_plan()
    }
```

### Phase 2: 智能重复性检测
```python
def execute_duplicate_scan(project_config: dict):
    """执行STEP1: 智能重复性检测"""
    skill_name = "knowledge-master"
    task_context = build_duplicate_scan_context(project_config)
    
    # Rule 4: 执行Codex Skill调用
    result = execute_codex_skill(skill_name, "智能重复性检测", task_context, "STEP1")
    
    # Rule 3: 质量检查
    if not validate_step_result(result, "STEP1"):
        return execute_retry("STEP1", result)
    
    return result
```

### Phase 3: 智能数据采集编排
```python
def execute_data_harvest(project_config: dict, step1_result: dict):
    """执行STEP2: 智能数据采集编排"""
    skills = ["trend-researcher", "data-analyst"]
    task_context = build_data_harvest_context(project_config, step1_result)
    
    # 并行执行Skills
    results = []
    for skill in skills:
        result = execute_codex_skill(skill, "智能数据采集", task_context, "STEP2")
        results.append(result)
    
    # 合并结果
    combined_result = merge_skill_results(results)
    
    # Rule 3: 质量检查
    if not validate_step_result(combined_result, "STEP2"):
        return execute_retry("STEP2", combined_result)
    
    return combined_result
```

### Phase 4: 结构化内容生成
```python
def execute_content_generation(project_config: dict, step2_result: dict):
    """执行STEP3: 结构化内容生成"""
    skill_name = "data-analyst"
    task_context = build_content_generation_context(project_config, step2_result)
    
    result = execute_codex_skill(skill_name, "结构化内容生成", task_context, "STEP3")
    
    # Rule 3: 质量门控
    quality_score = assess_content_quality(result)
    if quality_score < 85:
        return execute_retry("STEP3", result)
    
    return result
```

### Phase 5: 交付标准验证
```python
def execute_delivery_check(step3_result: dict):
    """执行STEP4: 交付标准验证"""
    skill_name = "academic-researcher"
    task_context = build_delivery_check_context(step3_result)
    
    result = execute_codex_skill(skill_name, "交付标准验证", task_context, "STEP4")
    
    # Rule 3: 质量检查
    if not validate_step_result(result, "STEP4"):
        return execute_retry("STEP4", result)
    
    return result
```

### Phase 6: MCP独立验证
```python
def execute_mcp_validation(step4_result: dict):
    """执行STEP5: MCP独立工具验证"""
    # 使用独立MCP工具进行验证
    validation_tools = ["data-validation", "consistency-check", "quality-assessment"]
    
    validation_results = []
    for tool in validation_tools:
        result = execute_mcp_tool(tool, step4_result)
        validation_results.append(result)
    
    # 综合验证结果
    combined_validation = combine_validation_results(validation_results)
    
    # Rule 3: 验证通过标准
    if not validate_mcp_results(combined_validation):
        return execute_retry("STEP5", combined_validation)
    
    return combined_validation
```

### Phase 7: 综合交叉验证
```python
def execute_cross_validation(project_config: dict, all_previous_results: dict):
    """执行STEP6: 综合交叉验证"""
    # 整合所有步骤结果
    integrated_results = integrate_all_results(all_previous_results)
    
    # 执行最终评估
    final_assessment = conduct_final_assessment(integrated_results)
    
    # 生成可信度评分
    credibility_score = calculate_credibility_score(final_assessment)
    
    # Rule 3: 最终质量门控
    if credibility_score < 90:
        return execute_final_retry("STEP6", final_assessment)
    
    return generate_final_report(final_assessment, credibility_score)
```

## 📊 质量标准Rules

### A+质量标准规则
```yaml
quality_standard: "A+"
credibility_score:
  min: 90
  max: 100
  components:
    data_quality: 0.3
    analysis_depth: 0.25
    logic_consistency: 0.2
    practical_value: 0.15
    innovation_insight: 0.1

data_sources_requirements:
  minimum_count: 15
  preferred_count: 20
  quality_categories:
    - "官方文档"
    - "学术研究"
    - "行业报告"
    - "权威数据源"
  reliability_threshold: 0.8

content_requirements:
  structure_integrity: 0.9
  logical_consistency: 0.9
  factual_accuracy: 0.95
  completeness: 0.85
```

## 🔧 Codex Skill集成Rules

### Codex调用规则
```yaml
codex_execution_rules:
  sandbox_mode: "workspace-write"
  model: "claude-sonnet-4-5-20250929"
  reasoning_effort: "medium"
  timeout_per_skill: 300
  retry_on_failure: true
  max_retries: 2
  
skill_call_format: |
  /skill {skill_name} "{task_description}"
  Context: {context_info}
  Step: {workflow_step}
  Quality Target: {quality_standard}
```

### 上下文传递规则
```yaml
context_rules:
  preservation: "完整保留工作流上下文"
  formatting: "结构化JSON格式"
  compression: "智能压缩关键信息"
  encryption: "敏感信息加密处理"
  
context_structure:
  project_metadata: "项目基础信息"
  previous_results: "前置步骤结果"
  quality_metrics: "质量评估指标"
  decisions_made: "已做出的智能决策"
```

## 🚨 错误处理Rules

### 异常处理规则
```yaml
error_handling_rules:
  skill_execution_failure:
    action: "自动重试"
    max_attempts: 2
    escalation: "人工介入"
  
  quality_below_threshold:
    action: "智能优化"
    optimization_strategies:
      - "数据源增强"
      - "分析深度调整"
      - "逻辑结构重排"
  
  timeout_exceeded:
    action: "优雅降级"
    fallback_strategies:
      - "减少数据源数量"
      - "简化分析维度"
      - "延长执行时间"
```

## 📈 执行监控Rules

### 性能监控规则
```yaml
performance_rules:
  execution_time_limits:
    quick_analysis: "30分钟"
    standard_analysis: "45分钟"
    deep_analysis: "90分钟"
  
  resource_usage_limits:
    memory_usage: "8GB"
    processing_efficiency: "优化"
    network_bandwidth: "合理使用"
  
  quality_consistency_rules:
    quality_variance: "<5分"
    reproducibility: "高"
    success_rate: "≥90%"
```

---

**版本**: v3.0.0  
**基于**: v2.4设计确认的智能决策部分  
**执行保证**: 100%忠实执行既定Rules