/**
 * 工作流程质量监控Hook - 提升企业级质量保障
 *
 * 功能：基于Reddit工程化实践的端到端工作流质量监控系统
 * - 实时质量监控：持续跟踪工作流执行质量
 * - 阶段质量检查：每个关键阶段的质量验证
 * - 流程合规性：确保工作流符合企业标准
 * - 性能监控：跟踪执行效率和质量指标
 * - 异常检测：自动识别和报告流程异常
 *
 * 来源：RULES.md工作流程质量标准的工程化实现
 * 最后更新：2025-11-04
 */
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'workflow-quality-monitor',
  description: '工作流程质量监控Hook - 提升企业级质量保障',
  version: '1.0.0',

  /**
   * 工作流程质量监控主函数
   */
  async execute(context) {
    console.log('🔍 [工作流程质量监控器] 开始质量监控...');

    const monitoring = {
      workflow: context.workflow || {},
      stage: context.stage || 'unknown',
      metrics: context.metrics || {},
      timestamp: new Date().toISOString()
    };

    try {
      // 1. 阶段质量检查
      const stageQuality = this.checkStageQuality(monitoring);

      // 2. 流程合规性验证
      const complianceCheck = this.checkWorkflowCompliance(monitoring);

      // 3. 性能指标分析
      const performanceAnalysis = this.analyzePerformance(monitoring);

      // 4. 异常检测
      const anomalyDetection = this.detectAnomalies(monitoring);

      // 5. 综合质量评分
      const qualityScore = this.calculateWorkflowQualityScore(
        stageQuality,
        complianceCheck,
        performanceAnalysis,
        anomalyDetection
      );

      // 6. 生成监控报告
      const monitoringReport = this.generateMonitoringReport(
        monitoring,
        stageQuality,
        complianceCheck,
        performanceAnalysis,
        anomalyDetection,
        qualityScore
      );

      // 7. 实时警报检查
      const alertCheck = this.checkAlertConditions(monitoringReport);

      console.log('✅ [工作流程质量监控器] 监控完成');
      return {
        ...monitoringReport,
        alertCheck
      };

    } catch (error) {
      console.error('❌ [工作流程质量监控器] 监控失败:', error.message);
      return {
        success: false,
        error: error.message,
        stage: monitoring.stage,
        severity: 'HIGH'
      };
    }
  },

  /**
   * 阶段质量检查
   */
  checkStageQuality(monitoring) {
    const { stage, workflow } = monitoring;

    const stageQualityMetrics = {
      inputQuality: this.checkInputQuality(stage, workflow),
      processingQuality: this.checkProcessingQuality(stage, workflow),
      outputQuality: this.checkOutputQuality(stage, workflow),
      transitionQuality: this.checkTransitionQuality(stage, workflow)
    };

    const stageScore = this.calculateStageScore(stageQualityMetrics);
    const stageIssues = this.identifyStageIssues(stageQualityMetrics);

    return {
      stage,
      score: stageScore,
      metrics: stageQualityMetrics,
      issues: stageIssues,
      status: stageScore >= 70 ? 'HEALTHY' : 'NEEDS_ATTENTION'
    };
  },

  /**
   * 检查输入质量
   */
  checkInputQuality(stage, workflow) {
    const inputIndicators = {
      completeness: this.checkInputCompleteness(stage, workflow),
      accuracy: this.checkInputAccuracy(stage, workflow),
      consistency: this.checkInputConsistency(stage, workflow),
      timeliness: this.checkInputTimeliness(stage, workflow)
    };

    const inputScore = this.calculateInputScore(inputIndicators);

    return {
      score: inputScore,
      indicators: inputIndicators,
      details: this.getInputDetails(stage, workflow)
    };
  },

  /**
   * 检查输入完整性
   */
  checkInputCompleteness(stage, workflow) {
    const requiredInputs = this.getRequiredInputs(stage);
    const availableInputs = workflow.inputs || [];

    const missingInputs = requiredInputs.filter(input =>
      !availableInputs.includes(input)
    );

    const completenessScore = Math.max(0, 100 - (missingInputs.length * 20));

    return {
      score: completenessScore,
      missing: missingInputs,
      total: requiredInputs.length,
      available: availableInputs.length
    };
  },

  /**
   * 获取阶段必需输入
   */
  getRequiredInputs(stage) {
    const requiredInputs = {
      'planning': ['requirements', 'constraints', 'objectives'],
      'design': ['specifications', 'requirements', 'constraints'],
      'implementation': ['design', 'resources', 'timeline'],
      'testing': ['implementation', 'test-cases', 'acceptance-criteria'],
      'deployment': ['tested-code', 'deployment-plan', 'rollback-plan'],
      'monitoring': ['deployed-system', 'metrics', 'alerts'],
      'unknown': []
    };

    return requiredInputs[stage] || [];
  },

  /**
   * 检查输入准确性
   */
  checkInputAccuracy(stage, workflow) {
    const accuracyChecks = {
      validationStatus: this.checkValidationStatus(workflow),
      errorRate: this.calculateErrorRate(workflow),
      qualityScore: this.getQualityScore(workflow)
    };

    const averageAccuracy = (accuracyChecks.validationStatus +
                              (100 - accuracyChecks.errorRate) +
                              accuracyChecks.qualityScore) / 3;

    return {
      score: Math.round(averageAccuracy),
      checks: accuracyChecks
    };
  },

  /**
   * 检查验证状态
   */
  checkValidationStatus(workflow) {
    return workflow.validated ? 100 : 0;
  },

  /**
   * 计算错误率
   */
  calculateErrorRate(workflow) {
    const total = workflow.total || 1;
    const errors = workflow.errors || 0;
    return Math.round((errors / total) * 100);
  },

  /**
   * 获取质量评分
   */
  getQualityScore(workflow) {
    return workflow.qualityScore || 50;
  },

  /**
   * 检查输入一致性
   */
  checkInputConsistency(stage, workflow) {
    const consistencyChecks = {
      formatConsistency: this.checkFormatConsistency(workflow),
      dataConsistency: this.checkDataConsistency(workflow),
      versionConsistency: this.checkVersionConsistency(workflow)
    };

    const consistencyScore = (consistencyChecks.formatConsistency +
                               consistencyChecks.dataConsistency +
                               consistencyChecks.versionConsistency) / 3;

    return {
      score: Math.round(consistencyScore),
      checks: consistencyChecks
    };
  },

  /**
   * 检查格式一致性
   */
  checkFormatConsistency(workflow) {
    return workflow.formatConsistent ? 100 : 50;
  },

  /**
   * 检查数据一致性
   */
  checkDataConsistency(workflow) {
    return workflow.dataConsistent ? 100 : 50;
  },

  /**
   * 检查版本一致性
   */
  checkVersionConsistency(workflow) {
    return workflow.versionConsistent ? 100 : 50;
  },

  /**
   * 检查输入及时性
   */
  checkInputTimeliness(stage, workflow) {
    if (!workflow.startTime) return 50;

    const now = new Date();
    const startTime = new Date(workflow.startTime);
    const delayHours = (now - startTime) / (1000 * 60 * 60);

    const expectedDelay = this.getExpectedDelay(stage);
    const timelinessScore = Math.max(0, 100 - ((delayHours - expectedDelay) * 10));

    return {
      score: Math.round(timelinessScore),
      delayHours: Math.round(delayHours * 10) / 10,
      expectedDelay
    };
  },

  /**
   * 获取预期延迟
   */
  getExpectedDelay(stage) {
    const expectedDelays = {
      'planning': 24,
      'design': 48,
      'implementation': 72,
      'testing': 24,
      'deployment': 12,
      'monitoring': 0,
      'unknown': 24
    };

    return expectedDelays[stage] || 24;
  },

  /**
   * 获取输入详情
   */
  getInputDetails(stage, workflow) {
    return {
      inputCount: (workflow.inputs || []).length,
      lastUpdated: workflow.lastUpdated || 'unknown',
      sources: workflow.inputSources || [],
      validationResults: workflow.validationResults || {}
    };
  },

  /**
   * 计算输入评分
   */
  calculateInputScore(indicators) {
    const weights = {
      completeness: 0.3,
      accuracy: 0.3,
      consistency: 0.2,
      timeliness: 0.2
    };

    return Math.round(
      indicators.completeness.score * weights.completeness +
      indicators.accuracy.score * weights.accuracy +
      indicators.consistency.score * weights.consistency +
      indicators.timeliness.score * weights.timeliness
    );
  },

  /**
   * 检查处理质量
   */
  checkProcessingQuality(stage, workflow) {
    const processingIndicators = {
      efficiency: this.checkProcessingEfficiency(stage, workflow),
      correctness: this.checkProcessingCorrectness(stage, workflow),
      compliance: this.checkProcessingCompliance(stage, workflow),
      traceability: this.checkProcessingTraceability(stage, workflow)
    };

    const processingScore = this.calculateProcessingScore(processingIndicators);
    const processingIssues = this.identifyProcessingIssues(processingIndicators);

    return {
      score: processingScore,
      indicators: processingIndicators,
      issues: processingIssues,
      details: this.getProcessingDetails(stage, workflow)
    };
  },

  /**
   * 检查处理效率
   */
  checkProcessingEfficiency(stage, workflow) {
    const efficiency = {
      timeEfficiency: this.checkTimeEfficiency(stage, workflow),
      resourceEfficiency: this.checkResourceEfficiency(stage, workflow),
      throughput: this.checkThroughput(stage, workflow)
    };

    const efficiencyScore = (efficiency.timeEfficiency +
                               efficiency.resourceEfficiency +
                               efficiency.throughput) / 3;

    return {
      score: Math.round(efficiencyScore),
      metrics: efficiency
    };
  },

  /**
   * 检查时间效率
   */
  checkTimeEfficiency(stage, workflow) {
    const actualDuration = workflow.actualDuration || 0;
    const expectedDuration = this.getExpectedDuration(stage);

    if (expectedDuration === 0) return 100;

    const efficiency = Math.min(100, (expectedDuration / actualDuration) * 100);
    return Math.round(efficiency);
  },

  /**
   * 获取预期持续时间
   */
  getExpectedDuration(stage) {
    const expectedDurations = {
      'planning': 8,
      'design': 16,
      'implementation': 40,
      'testing': 12,
      'deployment': 4,
      'monitoring': 1,
      'unknown': 10
    };

    return expectedDurations[stage] || 10;
  },

  /**
   * 检查资源效率
   */
  checkResourceEfficiency(stage, workflow) {
    const actualResources = workflow.actualResources || 1;
    const expectedResources = this.getExpectedResources(stage);

    const efficiency = Math.min(100, (expectedResources / actualResources) * 100);
    return Math.round(efficiency);
  },

  /**
   * 获取预期资源
   */
  getExpectedResources(stage) {
    const expectedResources = {
      'planning': 2,
      'design': 3,
      'implementation': 5,
      'testing': 3,
      'deployment': 2,
      'monitoring': 1,
      'unknown': 2
    };

    return expectedResources[stage] || 2;
  },

  /**
   * 检查吞吐量
   */
  checkThroughput(stage, workflow) {
    const processedItems = workflow.processedItems || 1;
    const timeSpent = workflow.actualDuration || 1;

    const throughput = processedItems / timeSpent;
    const expectedThroughput = this.getExpectedThroughput(stage);

    const efficiency = Math.min(100, (throughput / expectedThroughput) * 100);
    return Math.round(efficiency);
  },

  /**
   * 获取预期吞吐量
   */
  getExpectedThroughput(stage) {
    const expectedThroughputs = {
      'planning': 0.5,
      'design': 0.3,
      'implementation': 0.1,
      'testing': 0.8,
      'deployment': 2,
      'monitoring': 5,
      'unknown': 1
    };

    return expectedThroughputs[stage] || 1;
  },

  /**
   * 检查处理正确性
   */
  checkProcessingCorrectness(stage, workflow) {
    const correctness = {
      errorRate: workflow.errorRate || 0,
      defectRate: workflow.defectRate || 0,
      reworkRate: workflow.reworkRate || 0
    };

    const correctnessScore = 100 - (correctness.errorRate + correctness.defectRate + correctness.reworkRate);
    return Math.max(0, Math.round(correctnessScore));
  },

  /**
   * 检查处理合规性
   */
  checkProcessingCompliance(stage, workflow) {
    const complianceChecks = {
      standardsCompliance: this.checkStandardsCompliance(workflow),
      policyCompliance: this.checkPolicyCompliance(workflow),
      regulatoryCompliance: this.checkRegulatoryCompliance(workflow)
    };

    const complianceScore = (complianceChecks.standardsCompliance +
                              complianceChecks.policyCompliance +
                              complianceChecks.regulatoryCompliance) / 3;

    return Math.round(complianceScore);
  },

  /**
   * 检查标准合规
   */
  checkStandardsCompliance(workflow) {
    return workflow.standardsCompliant ? 100 : 50;
  },

  /**
   * 检查政策合规
   */
  checkPolicyCompliance(workflow) {
    return workflow.policyCompliant ? 100 : 50;
  },

  /**
   * 检查法规合规
   */
  checkRegulatoryCompliance(workflow) {
    return workflow.regulatoryCompliant ? 100 : 50;
  },

  /**
   * 检查处理可追溯性
   */
  checkProcessingTraceability(stage, workflow) {
    const traceability = {
      auditTrail: workflow.auditTrail ? 100 : 0,
      decisionLog: workflow.decisionLog ? 100 : 0,
      changeLog: workflow.changeLog ? 100 : 0
    };

    const traceabilityScore = (traceability.auditTrail +
                               traceability.decisionLog +
                               traceability.changeLog) / 3;

    return Math.round(traceabilityScore);
  },

  /**
   * 获取处理详情
   */
  getProcessingDetails(stage, workflow) {
    return {
      duration: workflow.actualDuration || 0,
      resources: workflow.actualResources || 0,
      processedItems: workflow.processedItems || 0,
      qualityMetrics: workflow.qualityMetrics || {}
    };
  },

  /**
   * 计算处理评分
   */
  calculateProcessingScore(indicators) {
    const weights = {
      efficiency: 0.3,
      correctness: 0.3,
      compliance: 0.2,
      traceability: 0.2
    };

    return Math.round(
      indicators.efficiency.score * weights.efficiency +
      indicators.correctness * weights.correctness +
      indicators.compliance * weights.compliance +
      indicators.traceability * weights.traceability
    );
  },

  /**
   * 识别处理问题
   */
  identifyProcessingIssues(indicators) {
    const issues = [];

    if (indicators.efficiency.score < 70) {
      issues.push('处理效率低下');
    }

    if (indicators.correctness < 80) {
      issues.push('处理正确性不足');
    }

    if (indicators.compliance < 80) {
      issues.push('合规性不达标');
    }

    if (indicators.traceability < 70) {
      issues.push('可追溯性不足');
    }

    return issues;
  },

  /**
   * 检查输出质量
   */
  checkOutputQuality(stage, workflow) {
    const outputIndicators = {
      completeness: this.checkOutputCompleteness(stage, workflow),
      quality: this.checkOutputQuality(workflow),
      usability: this.checkOutputUsability(workflow),
      documentation: this.checkOutputDocumentation(workflow)
    };

    const outputScore = this.calculateOutputScore(outputIndicators);
    const outputIssues = this.identifyOutputIssues(outputIndicators);

    return {
      score: outputScore,
      indicators: outputIndicators,
      issues: outputIssues,
      details: this.getOutputDetails(stage, workflow)
    };
  },

  /**
   * 检查输出完整性
   */
  checkOutputCompleteness(stage, workflow) {
    const requiredOutputs = this.getRequiredOutputs(stage);
    const actualOutputs = workflow.outputs || [];

    const missingOutputs = requiredOutputs.filter(output =>
      !actualOutputs.includes(output)
    );

    const completenessScore = Math.max(0, 100 - (missingOutputs.length * 25));

    return {
      score: completenessScore,
      missing: missingOutputs,
      total: requiredOutputs.length,
      actual: actualOutputs.length
    };
  },

  /**
   * 获取阶段必需输出
   */
  getRequiredOutputs(stage) {
    const requiredOutputs = {
      'planning': ['project-plan', 'requirements', 'timeline'],
      'design': ['design-doc', 'architecture-diagram', 'api-spec'],
      'implementation': ['source-code', 'tests', 'documentation'],
      'testing': ['test-results', 'bug-reports', 'coverage-report'],
      'deployment': ['deployment-package', 'deployment-logs', 'rollback-plan'],
      'monitoring': ['monitoring-dashboard', 'alerts', 'reports'],
      'unknown': []
    };

    return requiredOutputs[stage] || [];
  },

  /**
   * 检查输出质量
   */
  checkOutputQuality(workflow) {
    const qualityChecks = {
      functionalQuality: workflow.functionalQuality || 50,
      performanceQuality: workflow.performanceQuality || 50,
      securityQuality: workflow.securityQuality || 50,
      maintainability: workflow.maintainability || 50
    };

    const averageQuality = Object.values(qualityChecks).reduce((sum, score) => sum + score, 0) / Object.keys(qualityChecks).length;

    return Math.round(averageQuality);
  },

  /**
   * 检查输出可用性
   */
  checkOutputUsability(workflow) {
    const usabilityChecks = {
      userFriendly: workflow.userFriendly || 50,
      wellDocumented: workflow.wellDocumented || 50,
      accessible: workflow.accessible || 50,
      maintainable: workflow.maintainable || 50
    };

    const averageUsability = Object.values(usabilityChecks).reduce((sum, score) => sum + score, 0) / Object.keys(usabilityChecks).length;

    return Math.round(averageUsability);
  },

  /**
   * 检查输出文档
   */
  checkOutputDocumentation(workflow) {
    const documentationChecks = {
      hasReadme: workflow.hasReadme ? 100 : 0,
      hasApiDocs: workflow.hasApiDocs ? 100 : 0,
      hasUserGuide: workflow.hasUserGuide ? 100 : 0,
      hasTechnicalDocs: workflow.hasTechnicalDocs ? 100 : 0
    };

    const documentationScore = Object.values(documentationChecks).reduce((sum, score) => sum + score, 0) / Object.keys(documentationChecks).length;

    return Math.round(documentationScore);
  },

  /**
   * 获取输出详情
   */
  getOutputDetails(stage, workflow) {
    return {
      outputCount: (workflow.outputs || []).length,
      artifacts: workflow.artifacts || [],
      qualityMetrics: workflow.outputQualityMetrics || {},
      validationResults: workflow.outputValidationResults || {}
    };
  },

  /**
   * 计算输出评分
   */
  calculateOutputScore(indicators) {
    const weights = {
      completeness: 0.3,
      quality: 0.3,
      usability: 0.2,
      documentation: 0.2
    };

    return Math.round(
      indicators.completeness.score * weights.completeness +
      indicators.quality * weights.quality +
      indicators.usability * weights.usability +
      indicators.documentation * weights.documentation
    );
  },

  /**
   * 识别输出问题
   */
  identifyOutputIssues(indicators) {
    const issues = [];

    if (indicators.completeness.score < 70) {
      issues.push('输出不完整');
    }

    if (indicators.quality < 70) {
      issues.push('输出质量不达标');
    }

    if (indicators.usability < 70) {
      issues.push('输出可用性不足');
    }

    if (indicators.documentation < 70) {
      issues.push('文档不充分');
    }

    return issues;
  },

  /**
   * 检查阶段转换质量
   */
  checkTransitionQuality(stage, workflow) {
    const transitionIndicators = {
      handoffQuality: this.checkHandoffQuality(stage, workflow),
      integrationQuality: this.checkIntegrationQuality(stage, workflow),
      coordinationQuality: this.checkCoordinationQuality(stage, workflow)
    };

    const transitionScore = this.calculateTransitionScore(transitionIndicators);
    const transitionIssues = this.identifyTransitionIssues(transitionIndicators);

    return {
      score: transitionScore,
      indicators: transitionIndicators,
      issues: transitionIssues,
      details: this.getTransitionDetails(stage, workflow)
    };
  },

  /**
   * 检查交接质量
   */
  checkHandoffQuality(stage, workflow) {
    const handoffChecks = {
      clearResponsibility: workflow.clearResponsibility ? 100 : 0,
      completeInformation: workflow.completeInformation ? 100 : 0,
      properDocumentation: workflow.properDocumentation ? 100 : 0,
      timelyTransfer: workflow.timelyTransfer ? 100 : 0
    };

    const handoffScore = Object.values(handoffChecks).reduce((sum, score) => sum + score, 0) / Object.keys(handoffChecks).length;

    return Math.round(handoffScore);
  },

  /**
   * 检查集成质量
   */
  checkIntegrationQuality(stage, workflow) {
    const integrationChecks = {
      seamlessIntegration: workflow.seamlessIntegration ? 100 : 0,
      compatibleFormats: workflow.compatibleFormats ? 100 : 0,
      testedIntegration: workflow.testedIntegration ? 100 : 0,
      monitoredIntegration: workflow.monitoredIntegration ? 100 : 0
    };

    const integrationScore = Object.values(integrationChecks).reduce((sum, score) => sum + score, 0) / Object.keys(integrationChecks).length;

    return Math.round(integrationScore);
  },

  /**
   * 检查协调质量
   */
  checkCoordinationQuality(stage, workflow) {
    const coordinationChecks = {
      clearCommunication: workflow.clearCommunication ? 100 : 0,
      effectiveCollaboration: workflow.effectiveCollaboration ? 100 : 0,
      properCoordination: workflow.properCoordination ? 100 : 0,
      documentedDecisions: workflow.documentedDecisions ? 100 : 0
    };

    const coordinationScore = Object.values(coordinationChecks).reduce((sum, score) => sum + score, 0) / Object.keys(coordinationChecks).length;

    return Math.round(coordinationScore);
  },

  /**
   * 获取转换详情
   */
  getTransitionDetails(stage, workflow) {
    return {
      previousStage: workflow.previousStage || 'unknown',
      nextStage: workflow.nextStage || 'unknown',
      transitionTime: workflow.transitionTime || 0,
      participants: workflow.participants || []
    };
  },

  /**
   * 计算转换评分
   */
  calculateTransitionScore(indicators) {
    const weights = {
      handoffQuality: 0.4,
      integrationQuality: 0.3,
      coordinationQuality: 0.3
    };

    return Math.round(
      indicators.handoffQuality * weights.handoffQuality +
      indicators.integrationQuality * weights.integrationQuality +
      indicators.coordinationQuality * weights.coordinationQuality
    );
  },

  /**
   * 识别转换问题
   */
  identifyTransitionIssues(indicators) {
    const issues = [];

    if (indicators.handoffQuality < 70) {
      issues.push('交接质量不佳');
    }

    if (indicators.integrationQuality < 70) {
      issues.push('集成问题');
    }

    if (indicators.coordinationQuality < 70) {
      issues.push('协调问题');
    }

    return issues;
  },

  /**
   * 计算阶段评分
   */
  calculateStageScore(metrics) {
    const weights = {
      inputQuality: 0.25,
      processingQuality: 0.35,
      outputQuality: 0.25,
      transitionQuality: 0.15
    };

    return Math.round(
      metrics.inputQuality.score * weights.inputQuality +
      metrics.processingQuality.score * weights.processingQuality +
      metrics.outputQuality.score * weights.outputQuality +
      metrics.transitionQuality.score * weights.transitionQuality
    );
  },

  /**
   * 识别阶段问题
   */
  identifyStageIssues(metrics) {
    const issues = [
      ...metrics.inputQuality.issues,
      ...metrics.processingQuality.issues,
      ...metrics.outputQuality.issues,
      ...metrics.transitionQuality.issues
    ];

    return [...new Set(issues)]; // 去重
  },

  /**
   * 流程合规性验证
   */
  checkWorkflowCompliance(monitoring) {
    const { workflow } = monitoring;

    const complianceChecks = {
      standardCompliance: this.checkStandardCompliance(workflow),
      processAdherence: this.checkProcessAdherence(workflow),
      qualityStandards: this.checkQualityStandards(workflow),
      securityCompliance: this.checkSecurityCompliance(workflow)
    };

    const complianceScore = this.calculateComplianceScore(complianceChecks);
    const complianceViolations = this.identifyComplianceViolations(complianceChecks);

    return {
      score: complianceScore,
      checks: complianceChecks,
      violations: complianceViolations,
      status: complianceScore >= 80 ? 'COMPLIANT' : 'NON_COMPLIANT'
    };
  },

  /**
   * 检查标准合规
   */
  checkStandardCompliance(workflow) {
    return workflow.compliantWithStandards ? 100 : 0;
  },

  /**
   * 检查流程遵守
   */
  checkProcessAdherence(workflow) {
    return workflow.followsStandardProcess ? 100 : 0;
  },

  /**
   * 检查质量标准
   */
  checkQualityStandards(workflow) {
    return workflow.meetsQualityStandards ? 100 : 0;
  },

  /**
   * 检查安全合规
   */
  checkSecurityCompliance(workflow) {
    return workflow.securityCompliant ? 100 : 0;
  },

  /**
   * 计算合规评分
   */
  calculateComplianceScore(checks) {
    const complianceScore = (checks.standardCompliance +
                             checks.processAdherence +
                             checks.qualityStandards +
                             checks.securityCompliance) / 4;

    return Math.round(complianceScore);
  },

  /**
   * 识别合规违规
   */
  identifyComplianceViolations(checks) {
    const violations = [];

    if (checks.standardCompliance < 100) {
      violations.push('标准合规违规');
    }

    if (checks.processAdherence < 100) {
      violations.push('流程遵守违规');
    }

    if (checks.qualityStandards < 100) {
      violations.push('质量标准违规');
    }

    if (checks.securityCompliance < 100) {
      violations.push('安全合规违规');
    }

    return violations;
  },

  /**
   * 性能指标分析
   */
  analyzePerformance(monitoring) {
    const { workflow } = monitoring;

    const performanceMetrics = {
      cycleTime: this.analyzeCycleTime(workflow),
      throughput: this.analyzeThroughput(workflow),
      resourceUtilization: this.analyzeResourceUtilization(workflow),
      qualityMetrics: this.analyzeQualityMetrics(workflow)
    };

    const performanceScore = this.calculatePerformanceScore(performanceMetrics);
    const performanceIssues = this.identifyPerformanceIssues(performanceMetrics);

    return {
      score: performanceScore,
      metrics: performanceMetrics,
      issues: performanceIssues,
      trends: this.analyzePerformanceTrends(workflow)
    };
  },

  /**
   * 分析周期时间
   */
  analyzeCycleTime(workflow) {
    const cycleTime = workflow.cycleTime || 0;
    const benchmarkCycleTime = this.getBenchmarkCycleTime(workflow.stage);

    const cycleTimeScore = benchmarkCycleTime > 0 ?
      Math.min(100, (benchmarkCycleTime / cycleTime) * 100) : 50;

    return {
      current: cycleTime,
      benchmark: benchmarkCycleTime,
      score: cycleTimeScore,
      trend: this.getCycleTimeTrend(workflow)
    };
  },

  /**
   * 获取基准周期时间
   */
  getBenchmarkCycleTime(stage) {
    const benchmarks = {
      'planning': 8,
      'design': 16,
      'implementation': 40,
      'testing': 12,
      'deployment': 4,
      'monitoring': 1,
      'unknown': 10
    };

    return benchmarks[stage] || 10;
  },

  /**
   * 获取周期时间趋势
   */
  getCycleTimeTrend(workflow) {
    const historicalData = workflow.historicalCycleTimes || [];
    if (historicalData.length < 2) return 'STABLE';

    const recent = historicalData.slice(-3);
    const older = historicalData.slice(-6, -3);

    const recentAvg = recent.reduce((sum, time) => sum + time, 0) / recent.length;
    const olderAvg = older.reduce((sum, time) => sum + time, 0) / older.length;

    if (recentAvg < olderAvg * 0.9) return 'IMPROVING';
    if (recentAvg > olderAvg * 1.1) return 'DEGRADING';
    return 'STABLE';
  },

  /**
   * 分析吞吐量
   */
  analyzeThroughput(workflow) {
    const throughput = workflow.throughput || 0;
    const benchmarkThroughput = this.getBenchmarkThroughput(workflow.stage);

    const throughputScore = benchmarkThroughput > 0 ?
      Math.min(100, (throughput / benchmarkThroughput) * 100) : 50;

    return {
      current: throughput,
      benchmark: benchmarkThroughput,
      score: throughputScore,
      trend: this.getThroughputTrend(workflow)
    };
  },

  /**
   * 获取基准吞吐量
   */
  getBenchmarkThroughput(stage) {
    const benchmarks = {
      'planning': 0.5,
      'design': 0.3,
      'implementation': 0.1,
      'testing': 0.8,
      'deployment': 2,
      'monitoring': 5,
      'unknown': 1
    };

    return benchmarks[stage] || 1;
  },

  /**
   * 获取吞吐量趋势
   */
  getThroughputTrend(workflow) {
    const historicalData = workflow.historicalThroughput || [];
    if (historicalData.length < 2) return 'STABLE';

    const recent = historicalData.slice(-3);
    const older = historicalData.slice(-6, -3);

    const recentAvg = recent.reduce((sum, throughput) => sum + throughput, 0) / recent.length;
    const olderAvg = older.reduce((sum, throughput) => sum + throughput, 0) / older.length;

    if (recentAvg > olderAvg * 1.1) return 'IMPROVING';
    if (recentAvg < olderAvg * 0.9) return 'DEGRADING';
    return 'STABLE';
  },

  /**
   * 分析资源利用率
   */
  analyzeResourceUtilization(workflow) {
    const utilization = {
      cpuUtilization: workflow.cpuUtilization || 50,
      memoryUtilization: workflow.memoryUtilization || 50,
      teamUtilization: workflow.teamUtilization || 50,
      toolUtilization: workflow.toolUtilization || 50
    };

    const averageUtilization = Object.values(utilization).reduce((sum, util) => sum + util, 0) / Object.keys(utilization).length;

    return {
      utilization,
      average: Math.round(averageUtilization),
      efficiency: this.calculateResourceEfficiency(utilization)
    };
  },

  /**
   * 计算资源效率
   */
  calculateResourceEfficiency(utilization) {
    const targetUtilization = 75;
    const efficiency = 100 - Math.abs(averageUtilization - targetUtilization);
    return Math.max(0, Math.round(efficiency));
  },

  /**
   * 分析质量指标
   */
  analyzeQualityMetrics(workflow) {
    const qualityMetrics = {
      defectRate: workflow.defectRate || 0,
      customerSatisfaction: workflow.customerSatisfaction || 50,
      reworkRate: workflow.reworkRate || 0,
      firstTimeSuccess: workflow.firstTimeSuccess || 50
    };

    const qualityScore = 100 - (qualityMetrics.defectRate + qualityMetrics.reworkRate) +
                            (qualityMetrics.customerSatisfaction + qualityMetrics.firstTimeSuccess) / 2;

    return {
      metrics: qualityMetrics,
      score: Math.max(0, Math.round(qualityScore)),
      trend: this.getQualityTrend(workflow)
    };
  },

  /**
   * 获取质量趋势
   */
  getQualityTrend(workflow) {
    const historicalData = workflow.historicalQualityScores || [];
    if (historicalData.length < 2) return 'STABLE';

    const recent = historicalData.slice(-3);
    const older = historicalData.slice(-6, -3);

    const recentAvg = recent.reduce((sum, score) => sum + score, 0) / recent.length;
    const olderAvg = older.reduce((sum, score) => sum + score, 0) / older.length;

    if (recentAvg > olderAvg * 1.05) return 'IMPROVING';
    if (recentAvg < olderAvg * 0.95) return 'DEGRADING';
    return 'STABLE';
  },

  /**
   * 计算性能评分
   */
  calculatePerformanceScore(metrics) {
    const weights = {
      cycleTime: 0.25,
      throughput: 0.25,
      resourceUtilization: 0.25,
      qualityMetrics: 0.25
    };

    return Math.round(
      metrics.cycleTime.score * weights.cycleTime +
      metrics.throughput.score * weights.throughput +
      metrics.resourceUtilization.efficiency * weights.resourceUtilization +
      metrics.qualityMetrics.score * weights.qualityMetrics
    );
  },

  /**
   * 识别性能问题
   */
  identifyPerformanceIssues(metrics) {
    const issues = [];

    if (metrics.cycleTime.score < 70) {
      issues.push('周期时间过长');
    }

    if (metrics.throughput.score < 70) {
      issues.push('吞吐量不足');
    }

    if (metrics.resourceUtilization.efficiency < 70) {
      issues.push('资源利用率不佳');
    }

    if (metrics.qualityMetrics.score < 70) {
      issues.push('质量指标不达标');
    }

    return issues;
  },

  /**
   * 分析性能趋势
   */
  analyzePerformanceTrends(workflow) {
    const trends = {
      cycleTime: metrics.cycleTime.trend,
      throughput: metrics.throughput.trend,
      quality: metrics.qualityMetrics.trend
    };

    const improvingCount = Object.values(trends).filter(trend => trend === 'IMPROVING').length;
    const degradingCount = Object.values(trends).filter(trend => trend === 'DEGRADING').length;

    if (improvingCount > degradingCount) return 'IMPROVING';
    if (degradingCount > improvingCount) return 'DEGRADING';
    return 'STABLE';
  },

  /**
   * 异常检测
   */
  detectAnomalies(monitoring) {
    const { workflow } = monitoring;

    const anomalyChecks = {
      performanceAnomalies: this.detectPerformanceAnomalies(workflow),
      qualityAnomalies: this.detectQualityAnomalies(workflow),
      processAnomalies: this.detectProcessAnomalies(workflow),
      resourceAnomalies: this.detectResourceAnomalies(workflow)
    };

    const detectedAnomalies = this.collectDetectedAnomalies(anomalyChecks);
    const anomalySeverity = this.assessAnomalySeverity(detectedAnomalies);

    return {
      detected: detectedAnomalies,
      severity: anomalySeverity,
      checks: anomalyChecks,
      recommendations: this.generateAnomalyRecommendations(detectedAnomalies)
    };
  },

  /**
   * 检测性能异常
   */
  detectPerformanceAnomalies(workflow) {
    const anomalies = [];

    // 周期时间异常
    if (workflow.cycleTime && workflow.cycleTime > this.getBenchmarkCycleTime(workflow.stage) * 2) {
      anomalies.push({
        type: 'PERFORMANCE',
        category: 'CYCLE_TIME',
        severity: 'HIGH',
        description: `周期时间 ${workflow.cycleTime}小时超过基准值 ${this.getBenchmarkCycleTime(workflow.stage)}小时的2倍`,
        recommendation: '优化流程效率或调整预期时间'
      });
    }

    // 吞吐量异常
    if (workflow.throughput && workflow.throughput < this.getBenchmarkThroughput(workflow.stage) * 0.5) {
      anomalies.push({
        type: 'PERFORMANCE',
        category: 'THROUGHPUT',
        severity: 'MEDIUM',
        description: `吞吐量 ${workflow.throughput}低于基准值 ${this.getBenchmarkThroughput(workflow.stage)}的50%`,
        recommendation: '检查流程瓶颈或增加并行处理'
      });
    }

    return anomalies;
  },

  /**
   * 检测质量异常
   */
  detectQualityAnomalies(workflow) {
    const anomalies = [];

    // 缺陷率异常
    if (workflow.defectRate && workflow.defectRate > 10) {
      anomalies.push({
        type: 'QUALITY',
        category: 'DEFECT_RATE',
        severity: 'HIGH',
        description: `缺陷率 ${workflow.defectRate}% 超过10%阈值`,
        recommendation: '加强质量检查和测试覆盖'
      });
    }

    // 返工率异常
    if (workflow.reworkRate && workflow.reworkRate > 15) {
      anomalies.push({
        type: 'QUALITY',
        category: 'REWORK_RATE',
        severity: 'MEDIUM',
        description: `返工率 ${workflow.reworkRate}% 超过15%阈值`,
        recommendation: '改进需求分析和设计质量'
      });
    }

    return anomalies;
  },

  /**
   * 检测流程异常
   */
  detectProcessAnomalies(workflow) {
    const anomalies = [];

    // 跳过必要步骤
    if (workflow.skippedSteps && workflow.skippedSteps.length > 0) {
      anomalies.push({
        type: 'PROCESS',
        category: 'SKIPPED_STEPS',
        severity: 'HIGH',
        description: `跳过了${workflow.skippedSteps.length}个必要步骤: ${workflow.skippedSteps.join(', ')}`,
        recommendation: '补全所有必要步骤或重新评估流程'
      });
    }

    // 流程中断
    if (workflow.interrupted && workflow.interrupted.length > 0) {
      anomalies.push({
        type: 'PROCESS',
        category: 'INTERRUPTION',
        severity: 'HIGH',
        description: `流程中断${workflow.interrupted.length}次`,
        recommendation: '分析中断原因并优化流程稳定性'
      });
    }

    return anomalies;
  },

  /**
   * 检测资源异常
   */
  detectResourceAnomalies(workflow) {
    const anomalies = [];

    // CPU使用率异常
    if (workflow.cpuUtilization && workflow.cpuUtilization > 90) {
      anomalies.push({
        type: 'RESOURCE',
        category: 'CPU_UTILIZATION',
        severity: 'HIGH',
        description: `CPU使用率${workflow.cpuUtilization}%过高`,
        recommendation: '优化算法或增加计算资源'
      });
    }

    // 内存使用率异常
    if (workflow.memoryUtilization && workflow.memoryUtilization > 85) {
      anomalies.push({
        type: 'RESOURCE',
        category: 'MEMORY_UTILIZATION',
        severity: 'MEDIUM',
        description: `内存使用率${workflow.memoryUtilization}%过高`,
        recommendation: '优化内存使用或增加内存资源'
      });
    }

    return anomalies;
  },

  /**
   * 收集检测到的异常
   */
  collectDetectedAnomalies(checks) {
    return [
      ...checks.performanceAnomalies,
      ...checks.qualityAnomalies,
      ...checks.processAnomalies,
      ...checks.resourceAnomalies
    ];
  },

  /**
   * 评估异常严重性
   */
  assessAnomalySeverity(anomalies) {
    const highSeverityCount = anomalies.filter(a => a.severity === 'HIGH').length;
    const mediumSeverityCount = anomalies.filter(a => a.severity === 'MEDIUM').length;

    if (highSeverityCount > 0) return 'CRITICAL';
    if (mediumSeverityCount >= 2) return 'HIGH';
    if (anomalies.length > 0) return 'MEDIUM';
    return 'LOW';
  },

  /**
   * 生成异常建议
   */
  generateAnomalyRecommendations(anomalies) {
    return anomalies.map(anomaly => ({
      anomaly: anomaly.description,
      recommendation: anomaly.recommendation,
      priority: anomaly.severity,
      actionRequired: anomaly.severity === 'HIGH' ? 'IMMEDIATE' : 'SCHEDULED'
    }));
  },

  /**
   * 计算工作流质量评分
   */
  calculateWorkflowQualityScore(stageQuality, complianceCheck, performanceAnalysis, anomalyDetection) {
    const weights = {
      stageQuality: 0.3,
      compliance: 0.3,
      performance: 0.3,
      anomalyPenalty: 0.1
    };

    const anomalyPenalty = anomalyDetection.severity === 'CRITICAL' ? 50 :
                          anomalyDetection.severity === 'HIGH' ? 30 :
                          anomalyDetection.severity === 'MEDIUM' ? 15 : 0;

    const baseScore = stageQuality.score * weights.stageQuality +
                       complianceCheck.score * weights.compliance +
                       performanceAnalysis.score * weights.performance;

    const finalScore = Math.max(0, baseScore - anomalyPenalty);

    return Math.round(finalScore);
  },

  /**
   * 生成监控报告
   */
  generateMonitoringReport(monitoring, stageQuality, complianceCheck, performanceAnalysis, anomalyDetection, qualityScore) {
    const overallStatus = qualityScore >= 70 ? 'HEALTHY' : 'NEEDS_ATTENTION';

    return {
      success: true,
      timestamp: new Date().toISOString(),
      workflow: {
        stage: stageQuality.stage,
        overall: {
          score: qualityScore,
          status: overallStatus,
          grade: this.getWorkflowGrade(qualityScore)
        }
      },
      stageQuality,
      complianceCheck,
      performanceAnalysis,
      anomalyDetection,
      summary: this.generateWorkflowSummary(stageQuality, complianceCheck, performanceAnalysis, anomalyDetection),
      recommendations: this.generateWorkflowRecommendations(stageQuality, complianceCheck, performanceAnalysis, anomalyDetection)
    };
  },

  /**
   * 获取工作流等级
   */
  getWorkflowGrade(score) {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  },

  /**
   * 生成工作流摘要
   */
  generateWorkflowSummary(stageQuality, complianceCheck, performanceAnalysis, anomalyDetection) {
    return {
      health: `${stageQuality.score}% (${stageQuality.status})`,
      compliance: `${complianceCheck.score}% (${complianceCheck.status})`,
      performance: `${performanceAnalysis.score}% (${performanceAnalysis.trends})`,
      anomalies: `${anomalyDetection.detected.length} (${anomalyDetection.severity})`,
      issues: [
        ...stageQuality.issues,
        ...complianceCheck.violations,
        ...performanceAnalysis.issues,
        ...anomalyDetection.detected.map(a => a.description)
      ]
    };
  },

  /**
   * 生成工作流建议
   */
  generateWorkflowRecommendations(stageQuality, complianceCheck, performanceAnalysis, anomalyDetection) {
    const recommendations = [];

    // 阶段质量建议
    if (stageQuality.score < 70) {
      recommendations.push({
        priority: 'HIGH',
        category: 'STAGE_QUALITY',
        suggestion: `改进${stageQuality.stage}阶段质量: ${stageQuality.issues.join(', ')}`
      });
    }

    // 合规性建议
    if (complianceCheck.score < 80) {
      recommendations.push({
        priority: 'HIGH',
        category: 'COMPLIANCE',
        suggestion: `解决合规问题: ${complianceCheck.violations.join(', ')}`
      });
    }

    // 性能建议
    if (performanceAnalysis.score < 70) {
      recommendations.push({
        priority: 'MEDIUM',
        category: 'PERFORMANCE',
        suggestion: `优化性能: ${performanceAnalysis.issues.join(', ')}`
      });
    }

    // 异常处理建议
    if (anomalyDetection.detected.length > 0) {
      recommendations.push({
        priority: anomalyDetection.severity === 'CRITICAL' ? 'HIGH' : 'MEDIUM',
        category: 'ANOMALY',
        suggestion: `处理${anomalyDetection.detected.length}个异常`
      });
    }

    return recommendations;
  },

  /**
   * 检查警报条件
   */
  checkAlertConditions(monitoringReport) {
    const { overall, anomalyDetection, recommendations } = monitoringReport;

    const alertConditions = {
      criticalAnomalies: anomalyDetection.severity === 'CRITICAL',
      lowQuality: overall.score < 50,
      highPriorityIssues: recommendations.some(rec => rec.priority === 'HIGH'),
      multipleAnomalies: anomalyDetection.detected.length > 5
    };

    const shouldAlert = Object.values(alertConditions).some(condition => condition);

    return {
      triggered: shouldAlert,
      conditions: alertConditions,
      severity: shouldAlert ? this.determineAlertSeverity(alertConditions) : 'NONE',
      message: shouldAlert ? this.generateAlertMessage(alertConditions, monitoringReport) : null
    };
  },

  /**
   * 确定警报严重性
   */
  determineAlertSeverity(conditions) {
    if (conditions.criticalAnomalies) return 'CRITICAL';
    if (conditions.lowQuality || conditions.highPriorityIssues) return 'HIGH';
    if (conditions.multipleAnomalies) return 'MEDIUM';
    return 'LOW';
  },

  /**
   * 生成警报消息
   */
  generateAlertMessage(conditions, report) {
    const messages = [];

    if (conditions.criticalAnomalies) {
      messages.push('🚨 检测到关键异常');
    }

    if (conditions.lowQuality) {
      messages.push(`⚠️ 工作流质量评分低于50分: ${report.workflow.overall.grade}`);
    }

    if (conditions.highPriorityIssues) {
      messages.push(`⚠️ 存在${recommendations.filter(r => r.priority === 'HIGH').length}个高优先级问题`);
    }

    if (conditions.multipleAnomalies) {
      messages.push(`⚠️ 检测到${anomalyDetection.detected.length}个异常`);
    }

    return messages.join(' | ');
  }
};