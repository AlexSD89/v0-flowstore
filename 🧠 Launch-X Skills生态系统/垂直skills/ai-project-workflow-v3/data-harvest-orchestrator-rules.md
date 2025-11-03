# 数据采集编排Rules

> **Skill类型**: 垂直工作流子Rules  
> **功能**: 编排trend-researcher和data-analyst进行智能数据采集  
> **输入**: 项目需求和重复性检测结果  
> **输出**: 结构化数据集合  
> **调用方式**: `/skill data-harvest-orchestrator-rules "数据需求"`

## 🎯 Rules定义

### Rule 1: 数据采集启动规则
```yaml
rule_name: "data_harvest_initiation"
condition: "收到STEP2数据采集请求"
action: "启动多技能数据采集编排"
parameters:
  - project_requirements: dict (required)
  - duplicate_scan_result: dict (optional)
  - data_quality_target: "high" (default)
validation:
  - 项目需求必须包含关注领域
  - 重复性检测结果格式正确
  - 数据质量目标符合标准
```

### Rule 2: 技能编排规则
```yaml
rule_name: "skill_orchestration"
condition: "数据采集任务初始化"
action: "智能分配和编排专业技能"
orchestration_strategy:
  parallel_skills:
    - "trend-researcher": 趋势分析和市场洞察
    - "data-analyst": 数据分析和质量评估
  coordination_rules:
    - "共享上下文信息"
    - "避免重复工作"
    - "结果交叉验证"
  priority_mapping:
    high_priority:
      - trend_researcher: "行业趋势"
      - data_analyst: "核心指标"
    medium_priority:
      - trend_researcher: "竞争对手"
      - data_analyst: "用户画像"
```

### Rule 3: 数据源选择规则
```yaml
rule_name: "data_source_selection"
condition: "基于项目需求选择数据源"
action: "智能选择最佳数据源组合"
selection_criteria:
  relevance_score: "≥0.8"
  authority_level: "medium_to_high"
  data_freshness: "≤6个月"
  coverage_completeness: "≥70%"
  source_categories:
    official_documentation: "官方文档"
    academic_research: "学术研究"
    industry_reports: "行业报告"
    market_intelligence: "市场情报"
    user_analytics: "用户分析"
```

### Rule 4: 采集质量控制规则
```yaml
rule_name: "harvest_quality_control"
condition: "数据采集过程中"
action: "实时监控和控制数据质量"
quality_dimensions:
  data_accuracy: "事实准确性验证"
  source_reliability: "来源可靠性检查"
  coverage_adequacy: "覆盖充分性评估"
  timeliness: "数据时效性验证"
  consistency: "数据一致性检查"
control_actions:
  quality_below_threshold: "自动替换数据源"
  missing_critical_data: "启动补充采集"
  conflicting_data: "启动交叉验证"
```

## 🔄 执行序列

### Phase 1: 任务分析和规划
```python
def analyze_and_plan(project_requirements: dict, duplicate_scan_result: dict):
    """分析需求并规划数据采集任务"""
    # Rule 1: 验证输入
    if not validate_harvest_input(project_requirements, duplicate_scan_result):
        raise ValidationError("数据采集输入验证失败")
    
    # 分析关注领域
    focus_areas = analyze_focus_areas(project_requirements)
    
    # 识别数据需求
    data_requirements = identify_data_requirements(focus_areas, duplicate_scan_result)
    
    # 规划采集策略
    harvest_strategy = plan_harvest_strategy(data_requirements)
    
    return {
        'focus_areas': focus_areas,
        'data_requirements': data_requirements,
        'harvest_strategy': harvest_strategy
    }
```

### Phase 2: 技能编排执行
```python
def execute_skill_orchestration(harvest_strategy: dict):
    """执行技能编排"""
    # Rule 2: 初始化技能编排
    skill_configs = initialize_skill_configs(harvest_strategy)
    
    # 并行执行技能
    parallel_results = {}
    
    for skill_name, skill_config in skill_configs.items():
        if skill_config.get('parallel', True):
            # 并行执行
            result = execute_skill_parallel(skill_name, skill_config)
            parallel_results[skill_name] = result
    
    # 串行执行有依赖关系的技能
    sequential_results = {}
    for skill_name, skill_config in skill_configs.items():
        if not skill_config.get('parallel', True):
            # 串行执行
            result = execute_skill_sequential(skill_name, skill_config, parallel_results)
            sequential_results[skill_name] = result
    
    # 合并结果
    combined_results = combine_skill_results(parallel_results, sequential_results)
    
    return combined_results
```

### Phase 3: 数据源智能选择
```python
def select_optimal_data_sources(harvest_results: dict):
    """选择最优数据源组合"""
    # Rule 3: 评估候选数据源
    candidate_sources = evaluate_candidate_sources(harvest_results)
    
    # 应用选择标准
    filtered_sources = apply_selection_criteria(candidate_sources)
    
    # 优化数据源组合
    optimal_sources = optimize_source_combination(filtered_sources)
    
    # 生成数据源配置
    source_config = generate_source_configuration(optimal_sources)
    
    return {
        'selected_sources': optimal_sources,
        'source_config': source_config,
        'quality_metrics': calculate_source_quality(optimal_sources)
    }
```

### Phase 4: 数据质量控制
```python
def execute_quality_control(source_config: dict):
    """执行数据质量控制"""
    # Rule 4: 启动质量监控
    quality_monitor = initialize_quality_monitor()
    
    # 逐个数据源质量检查
    quality_results = {}
    for source in source_config['selected_sources']:
        quality_result = assess_source_quality(source)
        quality_results[source['id']] = quality_result
        
        # 实时质量控制
        if quality_result['quality_score'] < 0.8:
            action = determine_quality_action(quality_result)
            execute_quality_action(source, action)
    
    # 综合质量评估
    overall_quality = assess_overall_quality(quality_results)
    
    # 生成质量控制报告
    quality_report = generate_quality_report(quality_results, overall_quality)
    
    return quality_report
```

## 📊 质量标准Rules

### 数据源质量规则
```yaml
data_source_quality_rules:
  authority_levels:
    official: 1.0
    academic: 0.9
    industry: 0.8
    professional: 0.7
    user_generated: 0.5
  
  reliability_factors:
    publication_frequency: "regular"
    peer_review: "yes"
    citation_count: "≥100"
    institutional_backing: "yes"
    methodology_transparency: "high"
```

### 采集质量规则
```yaml
harvest_quality_rules:
  completeness_threshold: "≥70%"
  accuracy_threshold: "≥85%"
  consistency_threshold: "≥80%"
  timeliness_threshold: "≤6个月"
  diversity_threshold: "≥5个不同类型来源"
  
  quality_metrics:
    data_volume_score: "数据量充足性"
    data_diversity_score: "数据类型多样性"
    data_freshness_score: "数据时效性"
    data_reliability_score: "数据可靠性"
```

## 🔧 Trend Researcher集成Rules

### 趋势研究调用规则
```yaml
trend_researcher_rules:
  call_format: |
    /skill trend-researcher "趋势研究分析"
    关注领域: {focus_areas}
    时间范围: {time_range}
    地域范围: {geographic_scope}
    数据源偏好: {source_preferences}
  
  context_format:
    include_market_trends: true
    include_technology_trends: true
    include_competitor_analysis: true
    include_regulatory_updates: true
```

### Data Analyst集成规则
```yaml
data_analyst_rules:
  call_format: |
    /skill data-analyst "数据分析评估"
    分析目标: {analysis_objectives}
    数据类型: {data_types}
    分析方法: {analysis_methods}
    质量标准: {quality_standards}
  
  analysis_requirements:
    statistical_validation: "required"
    data_visualization: "recommended"
    insight_generation: "required"
    recommendation_support: "required"
```

## 🚨 异常处理Rules

### 技能执行异常
```yaml
skill_execution_failure_rules:
  trend_researcher_failure:
    action: "数据源扩展"
    fallback_strategies:
      - "扩大搜索范围"
      - "使用备用数据源"
      - "降低搜索精度"
      - "手动补充数据"
  
  data_analyst_failure:
    action: "分析方法调整"
    fallback_strategies:
      - "简化分析模型"
      - "使用基础统计方法"
      - "人工数据分析"
      - "分段分析处理"
```

### 数据质量异常
```yaml
data_quality_failure_rules:
  low_data_quality:
    action: "质量提升策略"
    improvement_methods:
      - "增加权威数据源"
      - "提高数据验证标准"
      - "实施交叉验证"
      - "调整分析参数"
  
  insufficient_data:
    action: "数据补充策略"
    supplementation_methods:
      - "扩展搜索范围"
      - "使用替代数据源"
      - "估算缺失数据"
      - "调整分析范围"
```

## 📈 性能优化Rules

### 并行处理规则
```yaml
parallel_processing_rules:
  max_concurrent_skills: 2
  resource_allocation:
    memory_per_skill: "2GB"
    cpu_per_skill: "50%"
    network_bandwidth: "合理分配"
  
  coordination_overhead:
    max_coordination_time: "5秒"
    context_sharing_efficiency: "≥80%"
    result_merge_complexity: "中等"
```

### 缓存策略规则
```yaml
caching_strategy_rules:
  cache_duration: "24小时"
  cache_hit_rate_target: "≥60%"
  cache_invalidation:
    - "数据源更新"
    - "质量标准变化"
    - "项目需求变更"
  cache_size_limit: "500MB"
```

## 🎯 输出格式Rules

### 结构化数据格式
```yaml
output_format_rules:
  data_structure:
    metadata: "数据元信息"
    sources: "数据源详细信息"
    raw_data: "原始数据集合"
    processed_data: "处理后数据"
    quality_metrics: "质量评估指标"
    analysis_insights: "分析洞察"
  
  quality_requirements:
    metadata_completeness: "100%"
    source_traceability: "100%"
    data_validation: "100%"
    quality_documentation: "100%"
```

### 分析洞察格式
```yaml
insight_format_rules:
  insight_categories:
    market_trends: "市场趋势洞察"
    technology_advances: "技术发展洞察"
    competitive_intelligence: "竞争情报洞察"
    risk_assessment: "风险评估洞察"
    opportunity_identification: "机会识别洞察"
  
  insight_quality:
    evidence_support: "必需"
    logical_reasoning: "清晰"
    actionability: "可执行"
    relevance_score: "≥8/10"
```

---

**版本**: v3.0.0  
**核心Skills**: trend-researcher + data-analyst  
**编排策略**: 智能并行 + 结果整合  
**垂直领域**: AI项目档案管理数据采集