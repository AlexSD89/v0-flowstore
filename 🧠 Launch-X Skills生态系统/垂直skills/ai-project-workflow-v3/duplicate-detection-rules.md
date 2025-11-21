# 重复性检测Rules

> **Skill类型**: 垂直工作流子Rules  
> **功能**: 基于knowledge-master进行智能重复性检测  
> **输入**: 项目名称和描述  
> **输出**: 重复性分析报告  
> **调用方式**: `/skill duplicate-detection-rules "项目分析"`

## 🎯 Rules定义

### Rule 1: 重复性检测触发规则
```yaml
rule_name: "duplicate_detection_trigger"
condition: "收到项目分析请求"
action: "启动knowledge-master进行重复性检测"
parameters:
  - project_name: string (required)
  - project_description: string (required)
  - detection_scope: "comprehensive" (default)
validation:
  - 项目名称长度≥2字符
  - 项目描述长度≥10字符
```

### Rule 2: 知识库搜索规则
```yaml
rule_name: "knowledge_base_search"
condition: "开始重复性检测"
action: "在LaunchX知识库中搜索相似项目"
search_strategy:
  - 项目名称相似度匹配 (权重: 0.3)
  - 关键词匹配 (权重: 0.4)
  - 主题领域匹配 (权重: 0.3)
similarity_threshold: 0.7
max_results: 10
```

### Rule 3: 重复性分析规则
```yaml
rule_name: "duplicate_analysis"
condition: "获取搜索结果"
action: "分析重复性程度和影响"
analysis_dimensions:
  - 直接重复: 完全相同的项目
  - 高度相似: 90%+相似度
  - 部分重叠: 70-89%相似度
  - 主题相关: 50-69%相似度
decision_rules:
  - direct_duplicate: "停止重复工作"
  - highly_similar: "整合分析结果"
  - partial_overlap: "差异化分析"
  - thematically_related: "参考历史分析"
```

### Rule 4: 影响评估规则
```yaml
rule_name: "impact_assessment"
condition: "识别到重复性"
action: "评估重复性对当前分析的影响"
impact_factors:
  - 数据源重复度
  - 分析方法重复度
  - 结论重复度
  - 建议重复度
mitigation_strategies:
  - 跳过重复部分
  - 整合现有结果
  - 专注差异化分析
  - 建立知识关联
```

## 🔄 执行序列

### Phase 1: 输入验证和预处理
```python
def validate_and_preprocess(project_name: str, project_description: str):
    """验证输入参数并进行预处理"""
    # Rule 1: 参数验证
    if not validate_project_input(project_name, project_description):
        raise ValidationError("输入参数不符合要求")
    
    # 预处理项目描述
    processed_description = preprocess_description(project_description)
    
    # 提取关键词
    keywords = extract_keywords(processed_description)
    
    # 确定检测范围
    detection_scope = determine_detection_scope(keywords)
    
    return {
        'project_name': project_name,
        'processed_description': processed_description,
        'keywords': keywords,
        'detection_scope': detection_scope
    }
```

### Phase 2: 知识库搜索执行
```python
def execute_knowledge_search(search_config: dict):
    """执行知识库搜索"""
    # Rule 2: 构建搜索查询
    search_query = build_search_query(search_config)
    
    # 执行knowledge-master搜索
    search_results = call_knowledge_master("search_similar_projects", search_query)
    
    # 应用相似度阈值过滤
    filtered_results = filter_by_similarity(search_results, threshold=0.7)
    
    # 限制结果数量
    limited_results = limit_results(filtered_results, max_count=10)
    
    return limited_results
```

### Phase 3: 重复性分析
```python
def analyze_duplicates(search_results: list, current_project: dict):
    """分析重复性程度"""
    # Rule 3: 对每个结果进行详细分析
    duplicate_analysis = []
    
    for result in search_results:
        analysis = analyze_single_duplicate(result, current_project)
        duplicate_analysis.append(analysis)
    
    # 分类重复性结果
    categorized_results = categorize_duplicates(duplicate_analysis)
    
    # 生成重复性报告
    duplicate_report = generate_duplicate_report(categorized_results)
    
    return duplicate_report
```

### Phase 4: 影响评估和建议
```python
def assess_impact_and_recommend(duplicate_report: dict, current_project: dict):
    """评估影响并提供建议"""
    # Rule 4: 评估影响
    impact_assessment = assess_duplicate_impact(duplicate_report, current_project)
    
    # 生成缓解策略
    mitigation_strategies = generate_mitigation_strategies(impact_assessment)
    
    # 提供执行建议
    execution_recommendations = generate_execution_recommendations(
        impact_assessment, mitigation_strategies
    )
    
    return {
        'duplicate_report': duplicate_report,
        'impact_assessment': impact_assessment,
        'mitigation_strategies': mitigation_strategies,
        'execution_recommendations': execution_recommendations
    }
```

## 📊 质量标准Rules

### 重复性检测质量规则
```yaml
detection_quality_rules:
  search_completeness:
    min_coverage: "80%"
    required_sources:
      - "项目历史记录"
      - "分析报告库"
      - "决策文档"
      - "最佳实践库"
  
  similarity_accuracy:
    min_similarity_score: 0.7
    validation_methods:
      - "人工抽样验证"
      - "交叉引用检查"
      - "一致性验证"
  
  analysis_depth:
    required_dimensions:
      - "内容相似度"
      - "方法论相似度"
      - "结论相似度"
      - "建议相似度"
    min_analysis_score: 0.8
```

### 决策准确性规则
```yaml
decision_accuracy_rules:
  duplicate_identification:
    precision_target: 0.95
    recall_target: 0.90
    f1_score_target: 0.92
  
  impact_assessment:
    accuracy_target: 0.85
    completeness_target: 0.90
    actionability_target: 0.80
```

## 🔧 Knowledge Master集成Rules

### 调用格式规则
```yaml
knowledge_master_rules:
  call_format: |
    /skill knowledge-master "重复性检测分析"
    项目: {project_name}
    描述: {project_description}
    关键词: {keywords}
    检测范围: {detection_scope}
  
  context_format:
    structured_output: true
    include_metadata: true
    enable_traceability: true
```

### 结果处理规则
```yaml
result_processing_rules:
  data_extraction:
    extract_similarity_scores: true
    extract_project_metadata: true
    extract_analysis_timestamps: true
    extract_decision_reasoning: true
  
  result_validation:
    validate_similarity_calculations: true
    validate_decision_logic: true
    validate_recommendation_feasibility: true
```

## 🚨 异常处理Rules

### 搜索失败处理
```yaml
search_failure_rules:
  no_results_found:
    action: "调整搜索策略"
    fallback_strategies:
      - "扩大搜索范围"
      - "降低相似度阈值"
      - "使用关键词变体"
      - "进行主题分类搜索"
  
  search_timeout:
    action: "优雅降级"
    timeout_handling:
      - "使用缓存结果"
      - "执行基础搜索"
      - "记录异常情况"
```

### 分析异常处理
```yaml
analysis_failure_rules:
  similarity_calculation_error:
    action: "重试分析"
    retry_strategies:
      - "使用备用算法"
      - "调整参数设置"
      - "分段进行分析"
  
  categorization_failure:
    action: "手动分类"
    fallback_categorization:
      - "使用简单规则"
      - "人工审核分类"
      - "延迟分类处理"
```

## 📈 监控和优化Rules

### 性能监控规则
```yaml
performance_monitoring_rules:
  search_performance:
    max_search_time: "30秒"
    max_results_processing_time: "60秒"
    max_total_processing_time: "120秒"
  
  analysis_quality:
    min_decision_accuracy: "85%"
    min_recommendation_relevance: "80%"
    max_false_positive_rate: "5%"
```

### 持续优化规则
```yaml
continuous_optimization_rules:
  feedback_loop:
    collect_user_feedback: true
    analyze_feedback_patterns: true
    update_similarity_thresholds: true
    refine_search_strategies: true
  
  learning_mechanism:
    track_success_patterns: true
    identify_optimal_parameters: true
    update_decision_rules: true
    share_best_practices: true
```

## 🎯 输出格式Rules

### 标准输出格式
```yaml
output_format_rules:
  structure:
    section_1: "项目基本信息"
    section_2: "搜索结果概览"
    section_3: "重复性详细分析"
    section_4: "影响评估"
    section_5: "执行建议"
    section_6: "决策结论"
  
  quality_requirements:
    sections_complete: true
    metrics_included: true
    recommendations_actionable: true
    decision_justification: true
```

### 指标要求
```yaml
metrics_requirements:
  required_metrics:
    - "相似度评分"
    - "重复性等级"
    - "影响程度评估"
    - "处理建议"
    - "决策依据"
  
  quality_thresholds:
    clarity_score: "≥8/10"
    completeness_score: "≥9/10"
    actionability_score: "≥8/10"
    accuracy_score: "≥9/10"
```

---

**版本**: v3.0.0  
**核心Skill**: knowledge-master  
**垂直领域**: AI项目档案管理重复性检测