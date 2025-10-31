# <!-- Powered by BMAD™ Core -->

# Enterprise Solution Intelligence Assessment

## Purpose

Intelligently assess incoming project requirements to determine if they require the enterprise-level complex solution methodology. This task implements the proven "问题识别 → 解决方案 → 生成 → 逻辑验证" pattern recognition and automatically recommends the appropriate workflow based on project complexity, stakeholder requirements, and business context.

## Intelligence Assessment Framework

### Project Complexity Indicators

#### 企业级别指标 (Enterprise-Level Indicators)
```yaml
complexity_assessment:
  stakeholder_complexity:
    government_partnership: "Requires government collaboration or compliance"
    multi_department: "Involves 3+ departments or business units"
    regulatory_compliance: "Subject to strict regulatory requirements"
    enterprise_scale: "Serves 1000+ users or enterprise deployment"
    
  technical_complexity:
    multi_system_integration: "Requires integration with 3+ existing systems"
    security_critical: "High security requirements (financial, healthcare, government)"
    performance_critical: "High-performance requirements (real-time, high-throughput)"
    multi_platform: "Cross-platform deployment (web, mobile, enterprise)"
    
  business_complexity:
    strategic_initiative: "Strategic business initiative or transformation"
    market_disruption: "New market entry or business model innovation"
    competitive_advantage: "Requires unique competitive differentiation"
    revenue_critical: "Direct impact on primary revenue streams"
    
  coordination_complexity:
    multi_agent_required: "Benefits from structured AI collaboration"
    expert_coordination: "Requires coordination of multiple domain experts"
    iterative_refinement: "Requires multiple rounds of optimization"
    quality_gates: "Needs comprehensive quality validation processes"
```

### Intelligent Decision Matrix

#### 自动评分系统 (Automatic Scoring System)
```yaml
scoring_framework:
  complexity_dimensions:
    - dimension: "stakeholder_complexity"
      weight: 0.25
      scoring:
        government_partnership: 10
        multi_department: 8
        regulatory_compliance: 9
        enterprise_scale: 7
        
    - dimension: "technical_complexity"  
      weight: 0.30
      scoring:
        multi_system_integration: 8
        security_critical: 9
        performance_critical: 7
        multi_platform: 6
        
    - dimension: "business_complexity"
      weight: 0.25
      scoring:
        strategic_initiative: 8
        market_disruption: 9
        competitive_advantage: 7
        revenue_critical: 8
        
    - dimension: "coordination_complexity"
      weight: 0.20
      scoring:
        multi_agent_required: 8
        expert_coordination: 7
        iterative_refinement: 9
        quality_gates: 8

  decision_thresholds:
    enterprise_complex_solution: ">= 7.5/10"
    enhanced_standard_workflow: "6.0-7.4/10"
    standard_workflow: "< 6.0/10"
```

## SEQUENTIAL Task Execution

### 1. 项目需求智能分析 (Project Requirements Intelligence Analysis)

#### 1.1 需求文本解析 (Requirement Text Parsing)
```
ANALYZE user_input FOR complexity_indicators:

stakeholder_indicators = EXTRACT_PATTERNS([
  "政府", "government", "合规", "compliance", "监管", "regulatory",
  "企业级", "enterprise", "大型", "large-scale", "多部门", "multi-department",
  "认证", "certification", "审计", "audit", "标准", "standards"
])

technical_indicators = EXTRACT_PATTERNS([
  "集成", "integration", "API", "微服务", "microservice", "分布式", "distributed",
  "高并发", "high-concurrency", "实时", "real-time", "安全", "security",
  "性能", "performance", "可扩展", "scalable", "高可用", "high-availability"
])

business_indicators = EXTRACT_PATTERNS([
  "战略", "strategic", "转型", "transformation", "创新", "innovation", 
  "竞争", "competitive", "市场", "market", "商业模式", "business model",
  "收入", "revenue", "盈利", "profit", "投资", "investment"
])

coordination_indicators = EXTRACT_PATTERNS([
  "多轮", "multi-round", "迭代", "iterative", "优化", "optimization",
  "质量", "quality", "专家", "expert", "协作", "collaboration",
  "AI", "智能", "intelligent", "自动化", "automation"
])
```

#### 1.2 上下文智能识别 (Context Intelligence Recognition)
```
project_context = ANALYZE_CONTEXT({
  input_source: "user_description | existing_project | stakeholder_brief",
  domain_detection: DETECT_DOMAIN(user_input),
  scale_assessment: ASSESS_PROJECT_SCALE(user_input),
  timeline_analysis: EXTRACT_TIMELINE_REQUIREMENTS(user_input),
  resource_implications: ASSESS_RESOURCE_REQUIREMENTS(user_input)
})

complexity_signals = {
  explicit_complexity: COUNT(complexity_indicators),
  implicit_complexity: ANALYZE_SEMANTIC_COMPLEXITY(user_input),
  domain_complexity: GET_DOMAIN_COMPLEXITY_BASELINE(project_context.domain),
  scale_complexity: CALCULATE_SCALE_COMPLEXITY(project_context.scale)
}
```

### 2. 智能评分计算 (Intelligence Scoring Calculation)

#### 2.1 维度评分 (Dimensional Scoring)
```
FOR EACH dimension IN complexity_dimensions:
  dimension_score = 0
  
  FOR EACH indicator IN stakeholder_indicators:
    IF indicator FOUND_IN user_input:
      dimension_score += scoring_framework[dimension][indicator]
      confidence_factors.add(indicator)
  
  # 语义相似度加分 (Semantic Similarity Bonus)
  semantic_matches = FIND_SEMANTIC_MATCHES(user_input, dimension.indicators)
  dimension_score += CALCULATE_SEMANTIC_BONUS(semantic_matches)
  
  # 领域特定加分 (Domain-Specific Bonus)
  domain_bonus = GET_DOMAIN_COMPLEXITY_BONUS(project_context.domain, dimension)
  dimension_score += domain_bonus
  
  weighted_scores[dimension] = dimension_score * dimension.weight

final_complexity_score = SUM(weighted_scores) / MAX_POSSIBLE_SCORE * 10
```

#### 2.2 置信度评估 (Confidence Assessment)
```
confidence_assessment = {
  text_clarity: ASSESS_INPUT_CLARITY(user_input),
  indicator_strength: CALCULATE_INDICATOR_STRENGTH(complexity_signals),
  semantic_consistency: CHECK_SEMANTIC_CONSISTENCY(user_input),
  domain_certainty: ASSESS_DOMAIN_CLASSIFICATION_CERTAINTY(project_context.domain)
}

overall_confidence = WEIGHTED_AVERAGE(confidence_assessment)
```

### 3. 工作流推荐决策 (Workflow Recommendation Decision)

#### 3.1 决策逻辑 (Decision Logic)
```
decision_logic = {
  IF complexity_score >= 7.5 AND confidence >= 0.7:
    recommended_workflow = "enterprise-complex-solution"
    justification = "High complexity indicators detected with high confidence"
    
  ELIF complexity_score >= 7.5 AND confidence < 0.7:
    recommended_workflow = "enterprise-complex-solution"
    justification = "High complexity detected, recommend enterprise solution with validation"
    validation_needed = TRUE
    
  ELIF complexity_score >= 6.0 AND complexity_score < 7.5:
    recommended_workflow = "enhanced-standard-workflow"
    justification = "Medium complexity, enhanced workflow recommended"
    
  ELSE:
    recommended_workflow = "standard-workflow"
    justification = "Standard complexity, regular workflow sufficient"
}
```

#### 3.2 替代方案评估 (Alternative Assessment)
```
alternative_workflows = {
  primary_recommendation: decision_logic.recommended_workflow,
  
  alternative_options: [
    {
      workflow: "research-intensive",
      condition: "IF high_research_requirements_detected",
      match_score: CALCULATE_RESEARCH_MATCH_SCORE(user_input)
    },
    {
      workflow: "brownfield-fullstack", 
      condition: "IF existing_system_integration_detected",
      match_score: CALCULATE_BROWNFIELD_MATCH_SCORE(user_input)
    },
    {
      workflow: "greenfield-fullstack",
      condition: "IF new_system_development_detected", 
      match_score: CALCULATE_GREENFIELD_MATCH_SCORE(user_input)
    }
  ]
}

# 找到最佳匹配的替代方案
best_alternative = MAX(alternative_options, key="match_score")
```

### 4. 推荐输出与验证 (Recommendation Output and Validation)

#### 4.1 推荐报告生成 (Recommendation Report Generation)
```markdown
# 企业解决方案智能评估报告

## 项目复杂度评估
- **总体复杂度评分**: {complexity_score}/10
- **置信度**: {overall_confidence}%
- **推荐工作流**: {recommended_workflow}

## 复杂度维度分析
### 利益相关者复杂度: {stakeholder_score}/10
- 检测到的指标: {stakeholder_indicators_found}
- 关键因素: {key_stakeholder_factors}

### 技术复杂度: {technical_score}/10  
- 检测到的指标: {technical_indicators_found}
- 关键因素: {key_technical_factors}

### 业务复杂度: {business_score}/10
- 检测到的指标: {business_indicators_found}
- 关键因素: {key_business_factors}

### 协调复杂度: {coordination_score}/10
- 检测到的指标: {coordination_indicators_found}
- 关键因素: {key_coordination_factors}

## 推荐理由
{justification}

## 替代方案
1. **{alternative_1}** (匹配度: {match_score_1}%)
2. **{alternative_2}** (匹配度: {match_score_2}%)

## 建议的下一步行动
{recommended_next_actions}
```

#### 4.2 ZHILINK4对话确认流程 (ZHILINK4 Dialogue Confirmation Process)
```
# 基于ZHILINK4成功经验的对话确认机制
zhilink4_dialogue_confirmation = {
  
  # 第一阶段：初步评估展示
  initial_assessment_presentation:
    PRESENT_TO_USER({
      assessment_summary: recommendation_report,
      zhilink4_pattern_match: "检测到ZHILINK4成功模式，匹配度: {match_score}%",
      decision_rationale: detailed_analysis,
      
      # ZHILINK4特有的对话确认选项
      zhilink4_confirmation_options: [
        "✅ 确认使用企业级复杂方案 + ZHILINK4方法论",
        "📋 提供更多项目信息以完善评估 (类似ZHILINK4资料补充)",
        "🔄 启动多轮搜索判断更新流程",
        "⚙️ 手动调整工作流配置",
        "❌ 选择其他工作流"
      ]
    })
  
  # 第二阶段：资料补充和完善 (基于ZHILINK4经验)
  information_supplement_phase:
    IF user_choice == "提供更多项目信息":
      补充信息收集 = {
        商业模式细节: "类似ZHILINK4商业模式总体分析的详细信息",
        技术架构偏好: "具体的技术栈偏好和约束条件", 
        政府合作需求: "是否有政府合作或合规要求",
        团队协作模式: "团队规模和协作偏好",
        质量标准要求: "项目质量标准和验收标准",
        时间和资源约束: "开发时间线和资源限制"
      }
      
      # 多轮信息收集，每次收集后重新评估
      FOR EACH 信息类别 IN 补充信息收集:
        user_input = REQUEST_DETAILED_INFO(信息类别)
        updated_assessment = RE_ASSESS_WITH_NEW_INFO(user_input)
        confidence_improvement = CALCULATE_CONFIDENCE_CHANGE()
        
        IF confidence_improvement > 0.1:
          NOTIFY_USER("新信息显著改善了评估准确性")
        
  # 第三阶段：多轮搜索判断更新 (ZHILINK4核心机制)
  multi_round_search_update:
    IF user_choice == "启动多轮搜索判断更新":
      
      # Round 1: 搜索类似项目案例
      search_round_1 = {
        目标: "搜索类似企业级项目的成功案例",
        方法: "使用search-specialist进行并发搜索",
        范围: ["行业最佳实践", "政府合作案例", "企业级架构参考"],
        输出: "external_validation_report.md"
      }
      
      # Round 2: 判断评估更新
      assessment_round_2 = {
        目标: "基于搜索结果更新项目评估",
        方法: "对比外部案例，调整复杂度评分",
        验证: "验证技术选型和架构决策",
        输出: "updated_project_assessment.md"
      }
      
      # Round 3: 最终确认和配置
      final_round_3 = {
        目标: "最终确认工作流配置",
        方法: "整合所有信息，生成最终推荐",
        用户确认: "展示完整分析过程和最终推荐",
        输出: "final_workflow_configuration.json"
      }
      
      # 执行多轮更新循环
      FOR round IN [search_round_1, assessment_round_2, final_round_3]:
        round_result = EXECUTE_ROUND(round)
        user_feedback = REQUEST_ROUND_FEEDBACK(round_result)
        
        IF user_feedback.requires_adjustment:
          ADJUST_ROUND_PARAMETERS(user_feedback)
          round_result = RE_EXECUTE_ROUND(round)
  
  # 第四阶段：最终决策确认
  final_decision_confirmation:
    # 展示完整的分析过程 (类似ZHILINK4的Layer 0-3文档)
    complete_analysis = {
      Layer_0_价值分析: "项目价值和商业目标分析",
      Layer_1_商业分析: "商业模式和市场定位分析", 
      Layer_2_业务分析: "业务流程和协作机制分析",
      Layer_3_技术分析: "技术架构和实现方案分析"
    }
    
    PRESENT_COMPLETE_ANALYSIS(complete_analysis)
    
    final_user_confirmation = REQUEST_FINAL_CONFIRMATION({
      推荐工作流: final_workflow,
      配置参数: workflow_parameters,
      预期收益: expected_benefits,
      实施计划: implementation_plan,
      风险评估: risk_assessment
    })
    
    IF final_user_confirmation.approved:
      INITIATE_WORKFLOW(final_workflow, enhanced_configuration)
    ELSE:
      RETURN_TO_DIALOGUE_PHASE(final_user_confirmation.feedback)
}

# 执行对话确认流程
user_choice = AWAIT_USER_INPUT()
final_workflow = EXECUTE_ZHILINK4_DIALOGUE_CONFIRMATION(user_choice)
```

### 5. 工作流启动准备 (Workflow Initiation Preparation)

#### 5.1 上下文传递 (Context Handoff)
```
workflow_context = {
  intelligence_assessment: {
    complexity_score: complexity_score,
    confidence_level: overall_confidence,
    key_indicators: all_detected_indicators,
    domain_analysis: project_context
  },
  
  enterprise_solution_parameters: {
    optimization_rounds_recommended: CALCULATE_OPTIMIZATION_ROUNDS(complexity_score),
    quality_gates_required: DETERMINE_QUALITY_GATES(stakeholder_complexity),
    research_depth_required: DETERMINE_RESEARCH_DEPTH(technical_complexity),
    coordination_level_required: DETERMINE_COORDINATION_LEVEL(coordination_complexity)
  },
  
  success_criteria: {
    government_partnership_readiness: ASSESS_GOVERNMENT_READINESS_REQUIREMENT(stakeholder_indicators),
    enterprise_certification: ASSESS_CERTIFICATION_REQUIREMENTS(business_indicators),
    security_compliance_level: DETERMINE_SECURITY_LEVEL(technical_indicators),
    performance_benchmarks: DEFINE_PERFORMANCE_REQUIREMENTS(user_input)
  }
}

HANDOFF_TO_WORKFLOW(final_workflow, workflow_context)
```

## Integration with BMAD Intelligence System

### 智能注入点集成 (Intelligence Injection Point Integration)
```yaml
bmad_integration:
  intelligence_injection_point_1:
    trigger: "UserPromptSubmit OR *workflow-guidance command"
    agent: "enterprise-solution-intelligence"
    purpose: "Replace mechanical workflow selection with intelligent assessment"
    output: "enterprise_solution_assessment.json"
    
  workflow_orchestrator_enhancement:
    input: "enterprise_solution_assessment.json"
    enhanced_decision_making: "Use assessment data for intelligent workflow configuration"
    adaptive_parameters: "Adjust workflow parameters based on complexity assessment"
    
  interaction_orchestrator_integration:
    assessment_confidence_based_interaction: "Adjust user interaction depth based on confidence level"
    validation_requirements: "Request user validation when confidence < 0.8"
    explanation_depth: "Provide detailed rationale for enterprise-level recommendations"
```

### 学习与优化机制 (Learning and Optimization Mechanism)
```yaml
continuous_improvement:
  assessment_accuracy_tracking:
    feedback_collection: "Track user satisfaction with workflow recommendations"
    outcome_monitoring: "Monitor project success rates by recommended workflow"
    accuracy_metrics: "Calculate recommendation accuracy over time"
    
  model_refinement:
    threshold_optimization: "Adjust decision thresholds based on feedback"
    indicator_weight_tuning: "Optimize indicator weights based on outcomes"
    new_pattern_detection: "Identify new complexity patterns from successful projects"
    
  knowledge_base_updates:
    domain_expertise_accumulation: "Build domain-specific complexity baselines"
    industry_pattern_recognition: "Identify industry-specific complexity patterns"
    emerging_technology_adaptation: "Adapt to new technology complexity factors"
```

## Output Integration

### 文件输出 (File Outputs)
- `docs/intelligence/enterprise-solution-assessment.json` - 详细评估数据
- `docs/intelligence/complexity-analysis-report.md` - 人类可读的分析报告
- `docs/intelligence/workflow-recommendation.md` - 工作流推荐说明

### 工作流集成 (Workflow Integration)  
- 自动触发推荐的工作流
- 传递上下文参数到目标工作流
- 配置工作流的优化参数
- 设置适当的质量门禁和验证要求

### 用户交互 (User Interaction)
- 智能推荐展示
- 替代方案说明
- 决策理由解释
- 用户确认和覆盖选项