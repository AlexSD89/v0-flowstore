/**
 * 大型文件开发方法论 - 实现文件
 * 适用于复杂文档、系统设计、架构规划等大型文件开发的完整流程
 */

class LargeFileDevelopmentMethodology {
  constructor() {
    this.name = 'large-file-development-methodology';
    this.version = '1.0.0';
    this.description = '大型文件开发方法论';

    // 开发方法论核心原则
    this.principles = {
      systematic: '系统性开发',
      iterative: '迭代式改进',
      quality_first: '质量优先',
      stakeholder_aligned: '利益相关者对齐',
      risk_managed: '风险管理'
    };

    // 开发阶段定义
    this.phases = {
      analysis: '分析阶段',
      planning: '规划阶段',
      design: '设计阶段',
      development: '开发阶段',
      validation: '验证阶段',
      delivery: '交付阶段'
    };

    // 质量标准
    this.qualityStandards = {
      clarity: '清晰度',
      completeness: '完整性',
      consistency: '一致性',
      accuracy: '准确性',
      usability: '可用性',
      maintainability: '可维护性'
    };
  }

  /**
   * 执行大型文件开发流程
   * @param {Object} input - 输入参数
   * @returns {Object} 开发结果
   */
  async execute(input) {
    const result = {
      success: false,
      development_plan: null,
      design_strategy: null,
      implementation_steps: [],
      quality_assurance: null,
      risk_management: null,
      success_metrics: null,
      recommendations: [],
      execution_log: [],
      artifacts: {}
    };

    try {
      // 记录执行开始
      result.execution_log.push({
        timestamp: new Date().toISOString(),
        phase: 'initiation',
        action: '开始大型文件开发流程',
        input_summary: this.summarizeInput(input)
      });

      // Phase 1: 需求分析
      const analysisResult = await this.analyzeRequirements(input);
      result.execution_log.push({
        timestamp: new Date().toISOString(),
        phase: 'analysis',
        action: '完成需求分析',
        result: '成功识别关键需求和约束条件'
      });

      // Phase 2: 开发计划制定
      const developmentPlan = await this.createDevelopmentPlan(input, analysisResult);
      result.development_plan = developmentPlan;
      result.execution_log.push({
        timestamp: new Date().toISOString(),
        phase: 'planning',
        action: '完成开发计划制定',
        result: `包含 ${developmentPlan.phases.length} 个阶段，预计${developmentPlan.timeline.duration}`
      });

      // Phase 3: 设计策略制定
      const designStrategy = await this.createDesignStrategy(input, developmentPlan);
      result.design_strategy = designStrategy;
      result.execution_log.push({
        timestamp: new Date().toISOString(),
        phase: 'design',
        action: '完成设计策略制定',
        result: `采用${designStrategy.architecture_approach}架构方法`
      });

      // Phase 4: 实施步骤制定
      const implementationSteps = await this.createImplementationSteps(input, developmentPlan, designStrategy);
      result.implementation_steps = implementationSteps;
      result.execution_log.push({
        timestamp: new Date().toISOString(),
        phase: 'development',
        action: '完成实施步骤制定',
        result: `制定${implementationSteps.length} 个详细步骤`
      });

      // Phase 5: 质量保证计划
      const qualityAssurance = await this.createQualityAssurance(input, developmentPlan);
      result.quality_assurance = qualityAssurance;
      result.execution_log.push({
        timestamp: new Date().toISOString(),
        phase: 'quality',
        action: '完成质量保证计划',
        result: `建立${qualityAssurance.review_process.length} 个审查点`
      });

      // Phase 6: 风险管理计划
      const riskManagement = await this.createRiskManagement(input, developmentPlan);
      result.risk_management = riskManagement;
      result.execution_log.push({
        timestamp: new Date().toISOString(),
        phase: 'risk',
        action: '完成风险管理计划',
        result: `识别${riskManagement.identified_risks.length} 个风险`
      });

      // Phase 7: 成功指标定义
      const successMetrics = await this.defineSuccessMetrics(input, developmentPlan);
      result.success_metrics = successMetrics;
      result.execution_log.push({
        timestamp: new Date().toISOString(),
        phase: 'metrics',
        action: '完成成功指标定义',
        result: `定义${successMetrics.completion_criteria.length} 项完成标准`
      });

      // Phase 8: 生成建议
      const recommendations = await this.generateRecommendations(input, result);
      result.recommendations = recommendations;
      result.execution_log.push({
        timestamp: new Date().toISOString(),
        phase: 'recommendations',
        action: '完成建议生成',
        result: `提供${recommendations.length} 项改进建议`
      });

      // 生成工件
      result.artifacts = await this.generateArtifacts(input, result);

      // 最终验证
      result.success = this.validateOutput(result);
      result.execution_log.push({
        timestamp: new Date().toISOString(),
        phase: 'completion',
        action: '完成流程执行',
        result: result.success ? '执行成功' : '执行失败，需要调整'
      });

      return result;
    } catch (error) {
      result.execution_log.push({
        timestamp: new Date().toISOString(),
        phase: 'error',
        action: '执行错误',
        error: error.message
      });
      throw error;
    }
  }

  /**
   * 分析需求
   */
  async analyzeRequirements(input) {
    const analysis = {
      project_complexity: this.assessProjectComplexity(input),
      stakeholder_needs: this.analyzeStakeholderNeeds(input),
      technical_requirements: this.identifyTechnicalRequirements(input),
      business_requirements: this.identifyBusinessRequirements(input),
      constraints: this.identifyConstraints(input),
      scope_boundaries: this.defineScopeBoundaries(input),
      success_criteria: this.defineSuccessCriteria(input),
      risk_factors: this.identifyRiskFactors(input)
    };

    // 生成需求分析报告
    analysis.report = this.generateRequirementsReport(analysis);
    analysis.recommendations = this.generateAnalysisRecommendations(analysis);

    return analysis;
  }

  /**
   * 创建开发计划
   */
  async createDevelopmentPlan(input, analysis) {
    const plan = {
      overview: {
        project_name: input.project_info.project_name,
        project_type: input.project_info.project_type,
        target_audience: input.project_info.target_audience,
        scope: input.project_info.scope,
        purpose: input.context.purpose
      },
      phases: this.defineDevelopmentPhases(input, analysis),
      timeline: this.createTimeline(input, analysis),
      resources: this.identifyRequiredResources(input, analysis),
      deliverables: this.defineDeliverables(input, analysis),
      dependencies: this.identifyDependencies(input, analysis),
      milestones: this.defineMilestones(input, analysis)
    };

    // 验证计划可行性
    plan.feasibility = this.validatePlanFeasibility(plan);
    plan.optimizations = this.identifyPlanOptimizations(plan);

    return plan;
  }

  /**
   * 创建设计策略
   */
  async createDesignStrategy(input, developmentPlan) {
    const strategy = {
      architecture_approach: this.selectArchitectureApproach(input, developmentPlan),
      content_structure: this.designContentStructure(input, developmentPlan),
      information_hierarchy: this.defineInformationHierarchy(input, developmentPlan),
      navigation_strategy: this.designNavigationStrategy(input, developmentPlan),
      visual_design: this.defineVisualDesignStrategy(input, developmentPlan),
      interactive_elements: this.identifyInteractiveElements(input, developmentPlan),
      accessibility_considerations: this.incorporateAccessibility(input, developmentPlan),
      scalability_planning: this.planScalability(input, developmentPlan)
    };

    // 验证设计策略
    strategy.validation = this.validateDesignStrategy(strategy);
    strategy.alternatives = this.generateDesignAlternatives(strategy);

    return strategy;
  }

  /**
   * 创建实施步骤
   */
  async createImplementationSteps(input, developmentPlan, designStrategy) {
    const steps = [];

    // 根据开发计划创建详细步骤
    for (const [phaseIndex, phase] of developmentPlan.phases.entries()) {
      const phaseSteps = this.createPhaseSteps(phase, phaseIndex, designStrategy);
      steps.push(...phaseSteps);
    }

    // 优化步骤顺序和依赖关系
    this.optimizeStepDependencies(steps);
    this.estimateStepEffort(steps);
    this.identifyStepRisks(steps);

    return steps;
  }

  /**
   * 创建质量保证计划
   */
  async createQualityAssurance(input, developmentPlan) {
    const qa = {
      review_process: this.defineReviewProcess(input, developmentPlan),
      testing_strategy: this.defineTestingStrategy(input, developmentPlan),
      quality_metrics: this.defineQualityMetrics(input, developmentPlan),
      validation_criteria: this.defineValidationCriteria(input, developmentPlan),
      feedback_loops: this.defineFeedbackLoops(input, developmentPlan),
      quality_gates: this.defineQualityGates(input, developmentPlan)
    };

    return qa;
  }

  /**
   * 创建风险管理计划
   */
  async createRiskManagement(input, developmentPlan) {
    const risk = {
      identified_risks: this.identifyProjectRisks(input, developmentPlan),
      risk_assessment: this.assessRisks(input, developmentPlan),
      mitigation_strategies: this.developMitigationStrategies(input, developmentPlan),
      contingency_plans: this.createContingencyPlans(input, developmentPlan),
      monitoring_plan: this.defineRiskMonitoring(input, developmentPlan),
      escalation_procedures: this.defineEscalationProcedures(input, developmentPlan)
    };

    return risk;
  }

  /**
   * 定义成功指标
   */
  async defineSuccessMetrics(input, developmentPlan) {
    const metrics = {
      completion_criteria: this.defineCompletionCriteria(input, developmentPlan),
      quality_standards: this.defineQualityStandards(input, developmentPlan),
      stakeholder_satisfaction: this.defineStakeholderSatisfaction(input, developmentPlan),
      performance_metrics: this.definePerformanceMetrics(input, developmentPlan),
      business_impact: this.defineBusinessImpact(input, developmentPlan),
      learning_outcomes: this.defineLearningOutcomes(input, developmentPlan)
    };

    return metrics;
  }

  /**
   * 生成建议
   */
  async generateRecommendations(input, result) {
    const recommendations = [];

    // 基于分析结果生成建议
    if (result.development_plan.feasibility.score < 0.7) {
      recommendations.push({
        category: 'planning',
        priority: 'high',
        title: '优化开发计划',
        description: '当前计划可行性较低，建议调整时间线和资源分配',
        actions: ['重新评估项目复杂度', '调整阶段划分', '增加缓冲时间']
      });
    }

    // 基于设计策略生成建议
    if (result.design_strategy.validation.score < 0.6) {
      recommendations.push({
        category: 'design',
        priority: 'high',
        title: '改进设计策略',
        description: '设计策略需要优化以提高可维护性',
        actions: ['简化信息架构', '改善导航结构', '增强可访问性']
      });
    }

    // 基于实施步骤生成建议
    const highRiskSteps = result.implementation_steps.filter(step =>
      step.risk_level === 'high'
    );
    if (highRiskSteps.length > 0) {
      recommendations.push({
        category: 'implementation',
        priority: 'medium',
        title: '优化实施步骤',
        description: `${highRiskSteps.length}个高风险步骤需要特别关注`,
        actions: highRiskSteps.map(step => `详细规划${step.step_name}`)
      });
    }

    // 基于风险管理生成建议
    if (result.risk_management.identified_risks.length > 3) {
      recommendations.push({
        category: 'risk',
        priority: 'medium',
        title: '加强风险管理',
        description: '识别多个风险，需要加强监控和预防',
        actions: ['建立风险监控机制', '制定应急响应计划', '定期风险评估']
      });
    }

    return recommendations;
  }

  /**
   * 生成工件
   */
  async generateArtifacts(input, result) {
    const artifacts = {
      project_charter: await this.generateProjectCharter(input, result),
      development_plan: await this.generateDevelopmentPlanDocument(result.development_plan),
      design_specification: await this.generateDesignSpecification(result.design_strategy),
      implementation_guide: await this.generateImplementationGuide(result.implementation_steps),
      quality_checklist: await this.generateQualityChecklist(result.quality_assurance),
      risk_register: await this.generateRiskRegister(result.risk_management),
      success_matrix: await this.generateSuccessMatrix(result.success_metrics)
    };

    return artifacts;
  }

  /**
   * 验证输出结果
   */
  validateOutput(result) {
    const validation = {
      has_development_plan: result.development_plan !== null,
      has_design_strategy: result.design_strategy !== null,
      has_implementation_steps: result.implementation_steps.length > 0,
      has_quality_assurance: result.quality_assurance !== null,
      has_risk_management: result.risk_management !== null,
      has_success_metrics: result.success_metrics !== null,
      has_recommendations: result.recommendations.length > 0,
      has_execution_log: result.execution_log.length > 0
    };

    // 计算完整性分数
    const totalChecks = Object.keys(validation).length;
    const passedChecks = Object.values(validation).filter(Boolean).length;
    validation.completeness_score = passedChecks / totalChecks;

    return validation.completeness_score >= 0.8;
  }

  // 辅助方法
  summarizeInput(input) {
    return {
      project_name: input.project_info?.project_name || '未命名',
      project_type: input.project_info?.project_type || 'unknown',
      complexity: input.development_requirements?.complexity_level || 'unknown',
      urgency: input.context?.urgency || 'medium'
    };
  }

  assessProjectComplexity(input) {
    const complexityFactors = {
      scope_size: input.project_info?.scope?.length || 0,
      stakeholder_count: input.development_requirements?.stakeholders?.length || 1,
      constraint_count: input.project_info?.constraints?.length || 0,
      complexity_level: input.development_requirements?.complexity_level || 'medium'
    };

    let score = 0;
    if (complexityFactors.scope_size > 1000) score += 2;
    if (complexityFactors.stakeholder_count > 5) score += 1;
    if (complexityFactors.constraint_count > 3) score += 1;

    if (complexityFactors.complexity_level === 'very_complex') score += 2;
    else if (complexityFactors.complexity_level === 'complex') score += 1;

    return {
      score,
      level: score >= 4 ? 'very_complex' : score >= 2 ? 'complex' : 'simple',
      factors: complexityFactors
    };
  }

  analyzeStakeholderNeeds(input) {
    return {
      primary_stakeholders: input.development_requirements?.stakeholders || [],
      needs_analysis: '基于项目类型和目标受众分析需求',
      alignment_requirements: '确保所有利益相关者需求对齐'
    };
  }

  identifyTechnicalRequirements(input) {
    return {
      infrastructure_needs: this.analyzeInfrastructureNeeds(input),
      tool_requirements: this.analyzeToolRequirements(input),
      integration_requirements: this.analyzeIntegrationRequirements(input),
      performance_requirements: this.analyzePerformanceRequirements(input)
    };
  }

  identifyBusinessRequirements(input) {
    return {
      business_objectives: this.extractBusinessObjectives(input),
      success_criteria: this.extractSuccessCriteria(input),
      value_proposition: this.analyzeValueProposition(input),
      competitive_analysis: this.performCompetitiveAnalysis(input)
    };
  }

  identifyConstraints(input) {
    return {
      time_constraints: input.development_requirements?.timeline || 'unknown',
      resource_constraints: this.analyzeResourceConstraints(input),
      technical_constraints: this.analyzeTechnicalConstraints(input),
      regulatory_constraints: this.analyzeRegulatoryConstraints(input)
    };
  }

  defineScopeBoundaries(input) {
    return {
      in_scope: this.defineInScope(input),
      out_of_scope: this.defineOutOfScope(input),
      scope_validation: this.createScopeValidation(input)
    };
  }

  defineSuccessCriteria(input) {
    return {
      functional_criteria: this.defineFunctionalCriteria(input),
      non_functional_criteria: this.defineNonFunctionalCriteria(input),
      business_criteria: this.defineBusinessCriteria(input),
      quality_criteria: this.defineQualityCriteria(input)
    };
  }

  identifyRiskFactors(input) {
    return {
      project_risks: this.identifyProjectRisks(input),
      technical_risks: this.identifyTechnicalRisks(input),
      business_risks: this.identifyBusinessRisks(input),
      operational_risks: this.identifyOperationalRisks(input)
    };
  }

  generateRequirementsReport(analysis) {
    return {
      summary: '需求分析完成',
      key_findings: this.extractKeyFindings(analysis),
      recommendations: analysis.recommendations,
      next_steps: ['制定开发计划', '设计架构', '定义质量标准']
    };
  }

  generateAnalysisRecommendations(analysis) {
    return [
      '确保所有利益相关者需求得到充分考虑',
      '建立清晰的范围边界',
      '制定详细的成功标准',
      '准备应对潜在风险'
    ];
  }

  defineDevelopmentPhases(input, analysis) {
    const basePhases = [
      { name: '需求分析', duration: '2-3天', deliverables: ['需求文档', '分析报告'] },
      { name: '架构设计', duration: '3-5天', deliverables: ['架构文档', '设计方案'] },
      { name: '内容开发', duration: '5-10天', deliverables: ['草稿文档', '内容审查'] },
      { name: '质量验证', duration: '2-3天', deliverables: ['验证报告', '质量检查'] },
      { name: '最终交付', duration: '1-2天', deliverables: ['最终文档', '交付报告'] }
    ];

    // 根据复杂度调整阶段
    if (analysis.project_complexity.level === 'very_complex') {
      basePhases.forEach(phase => {
        phase.duration = this.extendDuration(phase.duration, 1.5);
      });
    }

    return basePhases.map((phase, index) => ({
      ...phase,
      phase_number: index + 1,
      start_date: this.calculatePhaseStartDate(index, basePhases),
      dependencies: index > 0 ? [index] : []
    }));
  }

  createTimeline(input, analysis) {
    const totalDuration = this.calculateTotalDuration(input.development_requirements.timeline);
    return {
      start_date: new Date().toISOString().split('T')[0],
      duration: totalDuration,
      end_date: this.calculateEndDate(totalDuration),
      milestones: this.defineMilestones(input, analysis),
      buffer_time: totalDuration * 0.2, // 20%缓冲时间
      critical_path: this.identifyCriticalPath(input, analysis)
    };
  }

  identifyRequiredResources(input, analysis) {
    return {
      human_resources: this.identifyHumanResources(input, analysis),
      technical_resources: this.identifyTechnicalResources(input, analysis),
      financial_resources: this.estimateFinancialResources(input, analysis),
      external_resources: this.identifyExternalResources(input, analysis)
    };
  }

  defineDeliverables(input, analysis) {
    return {
      phase_deliverables: this.definePhaseDeliverables(input, analysis),
      final_deliverables: this.defineFinalDeliverables(input, analysis),
      documentation_deliverables: this.defineDocumentationDeliverables(input, analysis),
      quality_deliverables: this.defineQualityDeliverables(input, analysis)
    };
  }

  identifyDependencies(input, analysis) {
    return {
      internal_dependencies: this.identifyInternalDependencies(input, analysis),
      external_dependencies: this.identifyExternalDependencies(input, analysis),
      technical_dependencies: this.identifyTechnicalDependencies(input, analysis),
      resource_dependencies: this.identifyResourceDependencies(input, analysis)
    };
  }

  defineMilestones(input, analysis) {
    return [
      {
        name: '需求分析完成',
        date: this.calculateMilestoneDate(1, 'days'),
        deliverables: ['需求文档', '分析报告'],
        success_criteria: ['所有需求已识别', '利益相关者已确认']
      },
      {
        name: '架构设计完成',
        date: this.calculateMilestoneDate(7, 'days'),
        deliverables: ['架构文档', '设计方案'],
        success_criteria: ['架构已验证', '设计方案已批准']
      },
      {
        name: '内容开发完成',
        date: this.calculateMilestoneDate(17, 'days'),
        deliverables: ['完整文档', '内容审查报告'],
        success_criteria: ['内容符合要求', '质量检查通过']
      },
      {
        name: '项目交付完成',
        date: this.calculateMilestoneDate(20, 'days'),
        deliverables: ['最终文档', '交付报告', '用户指南'],
        success_criteria: ['所有交付物完成', '用户验收通过']
      }
    ];
  }

  validatePlanFeasibility(plan) {
    return {
      score: this.calculateFeasibilityScore(plan),
      issues: this.identifyFeasibilityIssues(plan),
      recommendations: this.generateFeasibilityRecommendations(plan),
      confidence: this.calculateFeasibilityConfidence(plan)
    };
  }

  identifyPlanOptimizations(plan) {
    return [
      {
        area: '时间线优化',
        suggestion: '考虑并行执行某些阶段以缩短总时间',
        impact: 'medium'
      },
      {
        area: '资源优化',
        suggestion: '评估资源使用效率，寻找优化机会',
        impact: 'high'
      }
    ];
  }

  selectArchitectureApproach(input, developmentPlan) {
    const approaches = {
      'modular': '模块化架构',
      'layered': '分层架构',
      'service_oriented': '面向服务架构',
      'event_driven': '事件驱动架构'
    };

    // 基于项目类型选择架构方法
    const projectType = input.project_info.project_type;

    switch (projectType) {
      case 'technical_spec':
        return approaches.modular;
      case 'architecture_design':
        return approaches.layered;
      case 'business_plan':
        return approaches.service_oriented;
      default:
        return approaches.modular;
    }
  }

  designContentStructure(input, developmentPlan) {
    return {
      information_hierarchy: [
        { level: 1, type: 'executive_summary', title: '执行摘要' },
        { level: 2, type: 'introduction', title: '介绍' },
        { level: 3, type: 'main_content', title: '主要内容' },
        { level: 4, type: 'technical_details', title: '技术细节' },
        { level: 5, type: 'appendices', title: '附录' }
      ],
      section_template: this.defineSectionTemplate(),
      navigation_structure: this.defineNavigationStructure(),
      content_guidelines: this.defineContentGuidelines()
    };
  }

  defineInformationHierarchy(input, developmentPlan) {
    return {
      primary_hierarchy: [
        {
          level: 'strategic',
          sections: ['执行摘要', '战略目标', '关键决策'],
          detail_level: 'high'
        },
        {
          level: 'tactical',
          sections: ['实施计划', '操作流程', '技术架构'],
          detail_level: 'medium'
        },
        {
          level: 'operational',
          sections: ['具体步骤', '操作细节', '工具使用'],
          detail_level: 'detailed'
        }
      ],
      cross_references: this.defineCrossReferences(),
      information_flow: this.defineInformationFlow()
    };
  }

  designNavigationStrategy(input, developmentPlan) {
    return {
      navigation_types: ['table_of_contents', 'cross_references', 'index', 'search'],
      accessibility_features: ['screen_reader_support', 'keyboard_navigation', 'high_contrast'],
      user_guidance: ['breadcrumbs', 'progress_indicators', 'help_systems'],
      mobile_considerations: ['responsive_design', 'touch_friendly']
    };
  }

  defineVisualDesignStrategy(input, developmentPlan) {
    return {
      design_principles: ['clarity', 'consistency', 'professionalism', 'accessibility'],
      color_scheme: this.defineColorScheme(),
      typography: this.defineTypography(),
      layout_system: this.defineLayoutSystem(),
      branding_elements: this.defineBrandingElements()
    };
  }

  identifyInteractiveElements(input, developmentPlan) {
    return {
      interactive_components: ['navigation', 'search', 'filters', 'forms'],
      user_interactions: ['click', 'scroll', 'search', 'filter', 'expand'],
      feedback_mechanisms: ['loading_states', 'error_messages', 'success_confirmations'],
      accessibility_features: ['alt_text', 'aria_labels', 'keyboard_support']
    };
  }

  incorporateAccessibility(input, developmentPlan) {
    return {
      wcag_compliance: ['AA', 'AAA'],
      screen_reader_support: true,
      keyboard_navigation: true,
      color_contrast: 'enhanced',
      text_resizing: 'supported',
      focus_management: 'comprehensive'
    };
  }

  planScalability(input, developmentPlan) {
    return {
      content_scalability: '模块化设计支持内容扩展',
      user_scalability: '设计支持多用户场景',
      technical_scalability: '架构支持高并发访问',
      maintenance_scalability: '设计支持便捷维护更新'
    };
  }

  validateDesignStrategy(strategy) {
    return {
      score: this.calculateDesignScore(strategy),
      issues: this.identifyDesignIssues(strategy),
      recommendations: this.generateDesignRecommendations(strategy),
      alternatives: this.generateDesignAlternatives(strategy)
    };
  }

  generateDesignAlternatives(strategy) {
    return [
      {
        approach: 'minimalist_design',
        description: '简化设计，关注核心功能',
        trade_offs: ['功能完整性', '用户体验']
      },
      {
        approach: 'comprehensive_design',
        description: '全面设计，包含所有功能',
        trade_offs: ['开发复杂度', '维护成本']
      }
    ];
  }

  createPhaseSteps(phase, phaseIndex, designStrategy) {
    const stepTemplates = {
      '需求分析': [
        { name: '收集需求', actions: ['访谈', '调研', '文档分析'], duration: '0.5天' },
        { name: '分析需求', actions: ['分类', '优先级排序', '冲突解决'], duration: '1天' },
        { name: '验证需求', actions: ['评审', '确认', '修订'], duration: '0.5天' }
      ],
      '架构设计': [
        { name: '架构设计', actions: ['高层设计', '详细设计', '技术选型'], duration: '2天' },
        { name: '设计评审', actions: ['架构评审', '技术评估', '风险分析'], duration: '1天' },
        { name: '设计确认', actions: ['利益相关者评审', '方案优化', '最终确认'], duration: '1天' }
      ]
    };

    const template = stepTemplates[phase.name] || stepTemplates['需求分析'];

    return template.map((step, stepIndex) => ({
      ...step,
      step_number: phaseIndex * 10 + stepIndex + 1,
      phase_number: phaseIndex + 1,
      phase_name: phase.name,
      dependencies: stepIndex > 0 ? [phaseIndex * 10 + stepIndex] : [],
      expected_output: `${phase.name}_${step.name}_output`,
      validation_method: '专家评审',
      risk_level: this.assessStepRisk(phase, step),
      quality_criteria: this.defineStepQualityCriteria(step)
    }));
  }

  optimizeStepDependencies(steps) {
    // 优化步骤依赖关系
    steps.forEach((step, index) => {
      // 移除不必要的依赖
      if (step.dependencies.length > 2) {
        step.dependencies = step.dependencies.slice(0, 2);
      }

      // 确保关键路径的依赖
      if (index > 0) {
        const hasRequiredDependency = step.dependencies.includes(index - 1);
        if (!hasRequiredDependency && step.risk_level === 'high') {
          step.dependencies.push(index - 1);
        }
      }
    });
  }

  estimateStepEffort(steps) {
    steps.forEach(step => {
      step.estimated_effort = this.calculateStepEffort(step);
      step.effort_confidence = this.calculateEffortConfidence(step);
    });
  }

  identifyStepRisks(steps) {
    steps.forEach(step => {
      step.risk_factors = this.identifyStepRiskFactors(step);
      step.mitigation_strategies = this.generateStepMitigationStrategies(step);
    });
  }

  defineReviewProcess(input, developmentPlan) {
    return [
      {
        name: '需求评审',
        stage: 'planning',
        reviewers: ['产品经理', '技术负责人', '业务分析师'],
        criteria: ['需求完整性', '可行性', '优先级合理性'],
        deliverables: ['需求评审报告']
      },
      {
        name: '设计评审',
        stage: 'design',
        reviewers: ['架构师', '技术专家', '用户体验专家'],
        criteria: ['架构合理性', '技术可行性', '用户体验'],
        deliverables: ['设计评审报告']
      },
      {
        name: '内容评审',
        stage: 'development',
        reviewers: ['内容专家', '技术编辑', '质量保证'],
        criteria: ['内容质量', '格式规范', '用户体验'],
        deliverables: ['内容评审报告']
      }
    ];
  }

  defineTestingStrategy(input, developmentPlan) {
    return {
      testing_types: [
        { type: 'unit_test', scope: '组件级别', automation: 'high' },
        { type: 'integration_test', scope: '系统集成', automation: 'medium' },
        { type: 'user_acceptance_test', scope: '端到端', automation: 'low' },
        { type: 'performance_test', scope: '性能指标', automation: 'medium' }
      ],
      test_environment: this.defineTestEnvironment(),
      test_data: this.defineTestData(),
      success_criteria: this.defineTestSuccessCriteria()
    };
  }

  defineQualityMetrics(input, developmentPlan) {
    return {
      content_metrics: [
        { name: '准确性', target: '95%', measurement: '专家评估' },
        { name: '完整性', target: '100%', measurement: '检查清单' },
        { name: '清晰度', target: '90%', measurement: '用户反馈' },
        { name: '一致性', target: '95%', measurement: '自动检查' }
      ],
      process_metrics: [
        { name: '按时交付率', target: '95%', measurement: '时间跟踪' },
        { name: '质量通过率', target: '90%', measurement: '审查统计' },
        { name: '变更控制', target: '减少变更', measurement: '变更统计' }
      ]
    };
  }

  defineValidationCriteria(input, developmentPlan) {
    return {
      functional_criteria: [
        { name: '功能完整性', requirement: '所有功能按需求实现' },
        { name: '性能要求', requirement: '满足性能指标' },
        { name: '兼容性', requirement: '支持目标环境' }
      ],
      non_functional_criteria: [
        { name: '可用性', requirement: '满足可用性标准' },
        { name: '可访问性', requirement: '符合WCAG标准' },
        { name: '安全性', requirement: '通过安全评估' }
      ],
      business_criteria: [
        { name: '业务价值', requirement: '实现业务目标' },
        { name: '投资回报', requirement: '符合ROI预期' },
        name: '市场竞争力', requirement: '具备竞争优势' }
      ]
    };
  }

  defineFeedbackLoops(input, developmentPlan) {
    return [
      {
        name: '持续改进',
        frequency: '每周',
        participants: ['项目团队', '利益相关者'],
        mechanism: '迭代评审',
        output: '改进建议'
      },
      {
        name: '质量反馈',
        frequency: '每个阶段完成时',
        participants: ['质量团队', '技术专家'],
        mechanism: '质量评估',
        output: '质量报告'
      }
    ];
  }

  defineQualityGates(input, developmentPlan) {
    return [
      {
        name: '需求确认门控',
        stage: 'planning',
        criteria: ['需求已确认', '范围已明确', '利益相关者已同意'],
        approvers: ['产品经理', '业务负责人']
      },
      {
        name: '设计确认门控',
        stage: 'design',
        criteria: ['设计已通过评审', '技术已验证', '架构已批准'],
        approvers: ['技术负责人', '架构师']
      },
      {
        name: '质量确认门控',
        stage: 'delivery',
        criteria: ['质量检查通过', '用户测试通过', '文档完整'],
        approvers: ['质量负责人', '项目管理者']
      }
    ];
  }

  identifyProjectRisks(input, developmentPlan) {
    return [
      {
        id: 'scope_creep',
        name: '范围蔓延风险',
        probability: 'medium',
        impact: 'high',
        description: '项目范围可能超出原始计划',
        category: 'project_management'
      },
      {
        id: 'resource_shortage',
        name: '资源不足风险',
        probability: 'low',
        impact: 'high',
        description: '项目资源可能不足以完成任务',
        category: 'resource'
      },
      {
        id: 'stakeholder_conflict',
        name: '利益相关者冲突',
        probability: 'medium',
        impact: 'medium',
        description: '不同利益相关者可能有冲突需求',
        category: 'stakeholder'
      }
    ];
  }

  assessRisks(input, developmentPlan) {
    const risks = this.identifyProjectRisks(input, developmentPlan);
    return risks.map(risk => ({
      ...risk,
      risk_score: this.calculateRiskScore(risk),
      priority: this.calculateRiskPriority(risk),
      monitoring_frequency: this.defineRiskMonitoring(risk)
    }));
  }

  developMitigationStrategies(input, developmentPlan) {
    const risks = this.identifyProjectRisks(input, developmentPlan);
    return risks.map(risk => ({
      ...risk,
      prevention_strategy: this.definePreventionStrategy(risk),
      mitigation_plan: this.defineMitigationPlan(risk),
      contingency_plan: this.defineContingencyPlan(risk),
      owner: this.assignRiskOwner(risk),
      timeline: this.defineRiskTimeline(risk)
    }));
  }

  createContingencyPlans(input, developmentPlan) {
    return [
      {
        trigger: '关键人员离职',
        plan: '启用备用人员，重新分配任务',
        timeline: '1-2周',
        impact: 'medium'
      },
      {
        trigger: '技术障碍',
        plan: '切换到备用技术方案',
        timeline: '2-4周',
        impact: 'high'
      },
      {
        trigger: '需求重大变更',
        plan: '重新评估计划并调整',
        timeline: '1-3周',
        impact: 'high'
      }
    ];
  }

  defineRiskMonitoring(input, developmentPlan) {
    return {
      monitoring_frequency: 'weekly',
      reporting_format: '风险状态报告',
      escalation_triggers: ['风险等级升高', '缓解策略失效', '新风险出现'],
      review_meetings: '风险评审会议',
      tracking_tools: ['风险登记表', '状态仪表板']
    };
  }

  defineEscalationProcedures(input, developmentPlan) {
    return [
      {
        trigger: '高风险事件',
        escalation_path: ['项目团队', '管理层', '执行层'],
        response_time: '24小时',
        decision_authority: '项目经理'
      },
      {
        trigger: '项目延期',
        escalation_path: ['项目经理', '产品经理', '业务负责人'],
        response_time: '48小时',
        decision_authority: '高级管理层'
      }
    ];
  }

  defineCompletionCriteria(input, developmentPlan) {
    return [
      '所有开发阶段已完成',
      '所有交付物已交付',
      '质量标准已达到',
      '利益相关者已验收',
      '项目文档已归档'
    ];
  }

  defineQualityStandards(input, developmentPlan) {
    return {
      documentation_standards: [
        '文档结构清晰',
        '内容准确完整',
        '格式符合规范',
        '引用完整准确'
      ],
      process_standards: [
        '开发流程遵循标准',
        '质量检查严格执行',
        '变更控制有效管理',
        '反馈机制及时响应'
      ],
      user_experience_standards: [
        '用户界面友好',
        '导航体验顺畅',
        '交互响应及时',
        '错误处理完善'
      ]
    };
  }

  defineStakeholderSatisfaction(input, developmentPlan) {
    return {
      satisfaction_metrics: [
        { metric: '需求满足度', target: '90%', measurement: '问卷调查' },
        { metric: '质量满意度', target: '85%', measurement: '专家评审' },
        { metric: '及时交付满意度', target: '95%', measurement: '时间跟踪' },
        { metric: '整体项目满意度', target: '90%', measurement: '综合评估' }
      ],
      feedback_mechanisms: ['定期调研', '用户访谈', '利益相关者会议'],
      improvement_actions: this.defineImprovementActions()
    };
  }

  definePerformanceMetrics(input, developmentPlan) {
    return [
      {
        name: '项目按时交付率',
        target: '95%',
        measurement: '时间跟踪统计'
      },
      {
        name: '质量通过率',
        target: '90%',
        measurement: '质量检查统计'
      },
      {
        name: '变更控制效果',
        target: '减少80%',
        measurement: '变更请求统计'
      }
    ];
  }

  defineBusinessImpact(input, developmentPlan) {
    return {
      business_objectives: this.extractBusinessObjectives(input),
      roi_metrics: this.defineROIMetrics(input),
      competitive_advantages: this.defineCompetitiveAdvantages(input),
      market_opportunities: this.defineMarketOpportunities(input)
    };
  }

  defineLearningOutcomes(input, developmentPlan) {
    return [
      '最佳实践总结',
      '经验教训记录',
      '知识资产创建',
      '流程改进建议',
      '团队能力提升'
    ];
  }

  // 时间计算辅助方法
  calculatePhaseStartDate(phaseIndex, phases) {
    const today = new Date();
    let startDate = new Date(today);

    for (let i = 0; i < phaseIndex; i++) {
      const phase = phases[i];
      const duration = this.parseDuration(phase.duration);
      startDate.setDate(startDate.getDate() + duration);
    }

    return startDate.toISOString().split('T')[0];
  }

  calculateMilestoneDate(daysFromNow, unit) {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
  }

  calculateEndDate(totalDuration) {
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + totalDuration);
    return endDate.toISOString().split('T')[0];
  }

  calculateTotalDuration(timeline) {
    return this.parseDuration(timeline.duration);
  }

  parseDuration(duration) {
    const match = duration.match(/(\d+)([天周月])/);
    if (!match) return 10; // 默认10天

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case '天': return value;
      case '周': return value * 7;
      case '月': return value * 30;
      default: return value;
    }
  }

  extendDuration(duration, factor) {
    const originalDays = this.parseDuration(duration);
    return Math.round(originalDays * factor);
  }

  // 质量评分辅助方法
  calculateFeasibilityScore(plan) {
    let score = 0.8; // 基础分数

    // 根据阶段数量评分
    if (plan.phases.length >= 4) score += 0.1;
    if (plan.phases.length >= 6) score += 0.1;

    // 根据资源完整性评分
    if (plan.resources && Object.keys(plan.resources).length >= 3) score += 0.1;

    return Math.min(score, 1.0);
  }

  calculateFeasibilityConfidence(plan) {
    // 基于计划完整性计算置信度
    const completenessFactors = [
      plan.overview ? 0.2 : 0,
      plan.phases.length > 0 ? 0.2 : 0,
      plan.timeline ? 0.2 : 0,
      plan.resources ? 0.2 : 0,
      plan.deliverables ? 0.2 : 0
    ];

    return completenessFactors.reduce((sum, factor) => sum + factor, 0);
  }

  calculateDesignScore(strategy) {
    let score = 0.7; // 基础分数

    if (strategy.content_structure) score += 0.1;
    if (strategy.navigation_strategy) score += 0.1;
    if (strategy.visual_design_strategy) score += 0.1;

    return Math.min(score, 1.0);
  }

  calculateRiskScore(risk) {
    const probabilityMap = {
      'low': 0.3,
      'medium': 0.6,
      'high': 0.8
    };

    const impactMap = {
      'low': 0.3,
      'medium': 0.6,
      'high': 0.9
    };

    return probabilityMap[risk.probability] * impactMap[risk.impact];
  }

  calculateRiskPriority(risk) {
    const score = this.calculateRiskScore(risk);
    if (score >= 0.7) return 'critical';
    if (score >= 0.5) return 'high';
    if (score >= 0.3) return 'medium';
    return 'low';
  }

  // 风险评估辅助方法
  assessStepRisk(phase, step) {
    const riskFactors = [
      { factor: 'complexity', weight: 0.3 },
      { factor: 'dependencies', weight: 0.4 },
      { factor: 'uncertainty', weight: 0.3 }
    ];

    let riskScore = 0;
    for (const factor of riskFactors) {
      riskScore += this.assessFactorRisk(step, factor) * factor.weight;
    }

    if (riskScore >= 0.7) return 'high';
    if (riskScore >= 0.4) return 'medium';
    return 'low';
  }

  assessFactorRisk(step, factor) {
    switch (factor.factor) {
      case 'complexity':
        return step.actions && step.actions.length > 3 ? 0.8 : 0.3;
      case 'dependencies':
        return step.dependencies && step.dependencies.length > 1 ? 0.7 : 0.2;
      case 'uncertainty':
        return !step.expected_output || step.expected_output.length < 20 ? 0.6 : 0.2;
      default:
        return 0.3;
    }
  }

  // 工件生成辅助方法
  async generateProjectCharter(input, result) {
    return {
      file_name: `${input.project_info.project_name}_project_charter.md`,
      content: this.generateProjectCharterContent(input, result),
      creation_date: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  async generateDevelopmentPlanDocument(developmentPlan) {
    return {
      file_name: 'development_plan.md',
      content: this.generateDevelopmentPlanContent(developmentPlan),
      creation_date: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  async generateDesignSpecification(designStrategy) {
    return {
      file_name: 'design_specification.md',
      content: this.generateDesignSpecificationContent(designStrategy),
      creation_date: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  async generateImplementationGuide(implementationSteps) {
    return {
      file_name: 'implementation_guide.md',
      content: this.generateImplementationGuideContent(implementationSteps),
      creation_date: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  async generateQualityChecklist(qualityAssurance) {
    return {
      file_name: 'quality_checklist.md',
      content: this.generateQualityChecklistContent(qualityAssurance),
      creation_date: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  async generateRiskRegister(riskManagement) {
    return {
      file_name: 'risk_register.md',
      content: this.generateRiskRegisterContent(riskManagement),
      creation_date: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  async generateSuccessMatrix(successMetrics) {
    return {
      file_name: 'success_matrix.md',
      content: this.generateSuccessMatrixContent(successMetrics),
      creation_date: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  // 内容生成辅助方法
  generateProjectCharterContent(input, result) {
    return `
# 项目概述

## 基本信息
- **项目名称**: ${input.project_info.project_name}
- **项目类型**: ${input.project_info.project_type}
- **目标受众**: ${input.project_info.target_audience}
- **项目范围**: ${input.project_info.scope}
- **紧急程度**: ${input.context.urgency}

## 项目目标
${input.context.purpose}

## 开发需求
- **复杂度**: ${input.development_requirements.complexity_level}
- **时间线**: ${input.development_requirements.timeline}
- **质量要求**: ${input.development_requirements.quality_requirements.join(', ')}

## 利益相关者
${input.development_requirements.stakeholders.join(', ')}

## 约束条件
${input.project_info.constraints.join(', ')}

## 成功标准
${input.context.success_criteria?.join(', ') || '待定义'}
`;
  }

  generateDevelopmentPlanContent(developmentPlan) {
    return `
# 开发计划

## 项目概述
${JSON.stringify(developmentPlan.overview, null, 2)}

## 开发阶段
${developmentPlan.phases.map((phase, index) => `
### 阶段 ${phase.phase_number}: ${phase.name}
- **持续时间**: ${phase.duration}
- **交付物**: ${phase.deliverables.join(', ')}
- **开始日期**: ${phase.start_date}
- **依赖关系**: ${phase.dependencies.length > 0 ? '依赖阶段: ' + phase.dependencies.map(d => d + 1).join(', ') : '无依赖'}
`).join('\n')}

## 时间线
- **开始日期**: ${developmentPlan.timeline.start_date}
- **持续时间**: ${developmentPlan.timeline.duration}
- **结束日期**: ${developmentPlan.timeline.end_date}
- **缓冲时间**: ${developmentPlan.timeline.buffer_time} 天

## 里程碑
${developmentPlan.timeline.milestones.map(milestone => `
### ${milestone.name}
- **日期**: ${milestone.date}
- **交付物**: ${milestone.deliverables.join(', ')}
- **成功标准**: ${milestone.success_criteria.join(', ')}
`).join('\n')}

## 所需资源
${JSON.stringify(developmentPlan.resources, null, 2)}

## 交付物清单
${developmentPlan.deliverables.final_deliverables.join(', ')}
`;
  }

  generateDesignSpecificationContent(designStrategy) {
    return `
# 设计规格

## 架构方法
${designStrategy.architecture_approach}

## 内容结构
${JSON.stringify(designStrategy.content_structure, null, 2)}

## 信息层次
${JSON.stringify(designStrategy.information_hierarchy, null, 2)}

## 导航策略
${JSON.stringify(designStrategy.navigation_strategy, null, 2)}

## 视觉设计
${JSON.stringify(designStrategy.visual_design_strategy, null, 2)}

## 交互元素
${JSON.stringify(designStrategy.interactive_elements, null, 2)}

## 可访问性考虑
${JSON.stringify(designStrategy.accessibility_considerations, null, 2)}

## 可扩展性规划
${JSON.stringify(designStrategy.scalability_planning, null, 2)}
`;
  }

  generateImplementationGuideContent(implementationSteps) {
    return `
# 实施指南

## 实施步骤概览
共 ${implementationSteps.length} 个步骤，预计总工时 ${implementationSteps.reduce((total, step) => {
      const effort = this.parseDuration(step.estimated_time || step.estimated_effort || '1天');
      return total + effort;
    }, 0)} 天

## 详细步骤
${implementationSteps.map((step, index) => `
### 步骤 ${step.step_number}: ${step.step_name}

**描述**: ${step.description}

**执行操作**:
${step.actions.map(action => `- ${action}`).join('\n')}

**预期输出**: ${step.expected_output}

**验证方法**: ${step.validation_method}

**预估时间**: ${step.estimated_time}

**风险级别**: ${step.risk_level}

**依赖关系**: ${step.dependencies.length > 0 ? '依赖步骤: ' + step.dependencies.map(d => d + 1).join(', ') : '无依赖'}

**质量标准**: ${step.quality_criteria.join(', ')}
`).join('\n\n')}
`;
  }

  generateQualityChecklistContent(qualityAssurance) {
    return `
# 质量检查清单

## 审查流程
${qualityAssurance.review_process.map((review, index) => `
### ${review.name}
- **阶段**: ${review.stage}
- **审查者**: ${review.reviewers.join(', ')}
- **检查标准**: ${review.criteria.join(', ')}
- **交付物**: ${review.deliverables.join(', ')}
`).join('\n\n')}
`;
  }

  generateRiskRegisterContent(riskManagement) {
    return `
# 风险登记册

## 识别的风险
${riskManagement.identified_risks.map((risk, index) => `
### 风险 ${index + 1}: ${risk.name}
- **概率**: ${risk.probability}
- **影响**: ${risk.impact}
- **描述**: ${risk.description}
- **类别**: ${risk.category}
- **风险评分**: ${risk.risk_score}
- **优先级**: ${risk.priority}
- **监控频率**: ${risk.monitoring_frequency}
- **负责人**: ${risk.owner}
- **时间线**: ${risk.timeline}
`).join('\n\n')}
`;
  }

  generateSuccessMatrixContent(successMetrics) {
    return `
# 成功指标矩阵

## 完成标准
${successMetrics.completion_criteria.join(', ')}

## 质量标准
${Object.entries(successMetrics.quality_standards).map(([category, standards]) => `
### ${category}
${standards.join(', ')}
`).join('\n\n')}
`;
  }
}

module.exports = LargeFileDevelopmentMethodology;