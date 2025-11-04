/**
 * 决策路径验证Hook - 确保决策过程质量
 *
 * 功能：基于Reddit工程化实践的决策质量保障系统
 * - 决策路径完整性检查：确保决策过程符合标准流程
 * - 逻辑一致性验证：检查决策逻辑的内在一致性
 * - 风险评估验证：确保风险识别和缓解策略完整
 * - 质量门禁：低质量决策自动阻止和提醒
 * - 决策透明度：记录完整的决策链条供审查
 *
 * 来源：RULES.md决策质量标准的工程化实现
 * 最后更新：2025-11-04
 */
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'decision-path-validator',
  description: '决策路径验证Hook - 确保决策过程质量',
  version: '1.0.0',

  /**
   * 决策路径验证主函数
   */
  async execute(context) {
    console.log('🔍 [决策路径验证器] 开始决策质量验证...');

    const validation = {
      userInput: context.userInput || '',
      workspace: context.workspace || {},
      decisionContext: context.decisionContext || {},
      timestamp: new Date().toISOString()
    };

    try {
      // 1. 决策路径完整性检查
      const pathCompleteness = this.validatePathCompleteness(validation);

      // 2. 逻辑一致性验证
      const logicalConsistency = this.validateLogicalConsistency(validation);

      // 3. 风险评估验证
      const riskAssessment = this.validateRiskAssessment(validation);

      // 4. 决策质量评分
      const qualityScore = this.calculateDecisionQualityScore(
        pathCompleteness,
        logicalConsistency,
        riskAssessment
      );

      // 5. 生成验证报告
      const validationReport = this.generateValidationReport(
        validation,
        pathCompleteness,
        logicalConsistency,
        riskAssessment,
        qualityScore
      );

      // 6. 质量门禁检查
      const gateCheck = this.performQualityGate(validationReport);

      console.log('✅ [决策路径验证器] 验证完成');
      return {
        ...validationReport,
        gateCheck
      };

    } catch (error) {
      console.error('❌ [决策路径验证器] 验证失败:', error.message);
      return {
        success: false,
        error: error.message,
        blocked: true,
        reason: '决策路径验证系统异常'
      };
    }
  },

  /**
   * 决策路径完整性检查
   */
  validatePathCompleteness(validation) {
    const { userInput, decisionContext } = validation;

    const requiredElements = {
      problemDefinition: this.checkProblemDefinition(userInput),
      requirementAnalysis: this.checkRequirementAnalysis(userInput),
      alternativeEvaluation: this.checkAlternativeEvaluation(userInput),
      decisionCriteria: this.checkDecisionCriteria(userInput),
      riskAssessment: this.checkRiskAssessment(userInput),
      implementationPlan: this.checkImplementationPlan(userInput),
      validationMethod: this.checkValidationMethod(userInput)
    };

    const completenessScore = this.calculateCompletenessScore(requiredElements);
    const missingElements = this.identifyMissingElements(requiredElements);

    return {
      score: completenessScore,
      elements: requiredElements,
      missing: missingElements,
      status: completenessScore >= 70 ? 'PASS' : 'FAIL'
    };
  },

  /**
   * 检查问题定义
   */
  checkProblemDefinition(userInput) {
    const indicators = [
      '问题',
      '挑战',
      '需求',
      '目标',
      '解决',
      '改进'
    ];

    const hasDefinition = indicators.some(indicator =>
      userInput.includes(indicator)
    );

    return {
      present: hasDefinition,
      confidence: hasDefinition ? 0.8 : 0.2,
      evidence: hasDefinition ? '包含问题定义关键词' : '缺少问题定义'
    };
  },

  /**
   * 检查需求分析
   */
  checkRequirementAnalysis(userInput) {
    const analysisIndicators = [
      '需求',
      '规格',
      '约束',
      '条件',
      '限制',
      '要求'
    ];

    const hasAnalysis = analysisIndicators.some(indicator =>
      userInput.includes(indicator)
    );

    return {
      present: hasAnalysis,
      confidence: hasAnalysis ? 0.7 : 0.3,
      evidence: hasAnalysis ? '包含需求分析内容' : '缺少需求分析'
    };
  },

  /**
   * 检查备选方案评估
   */
  checkAlternativeEvaluation(userInput) {
    const alternativeIndicators = [
      '方案A',
      '方案B',
      '选择',
      '对比',
      '评估',
      '选项',
      '备选',
      '替代'
    ];

    const hasAlternatives = alternativeIndicators.some(indicator =>
      userInput.includes(indicator)
    );

    return {
      present: hasAlternatives,
      confidence: hasAlternatives ? 0.9 : 0.1,
      evidence: hasAlternatives ? '包含方案对比评估' : '缺少备选方案评估'
    };
  },

  /**
   * 检查决策标准
   */
  checkDecisionCriteria(userInput) {
    const criteriaIndicators = [
      '标准',
      '指标',
      '原则',
      '基准',
      '衡量',
      '评估'
    ];

    const hasCriteria = criteriaIndicators.some(indicator =>
      userInput.includes(indicator)
    );

    return {
      present: hasCriteria,
      confidence: hasCriteria ? 0.8 : 0.2,
      evidence: hasCriteria ? '包含决策标准' : '缺少明确决策标准'
    };
  },

  /**
   * 检查风险评估
   */
  checkRiskAssessment(userInput) {
    const riskIndicators = [
      '风险',
      '问题',
      '挑战',
      '困难',
      '障碍',
      '不确定性'
    ];

    const hasRiskAssessment = riskIndicators.some(indicator =>
      userInput.includes(indicator)
    );

    return {
      present: hasRiskAssessment,
      confidence: hasRiskAssessment ? 0.8 : 0.2,
      evidence: hasRiskAssessment ? '包含风险评估' : '缺少风险评估'
    };
  },

  /**
   * 检查实施计划
   */
  checkImplementationPlan(userInput) {
    const planIndicators = [
      '步骤',
      '计划',
      '流程',
      '实施',
      '执行',
      '安排',
      '时间表'
    ];

    const hasPlan = planIndicators.some(indicator =>
      userInput.includes(indicator)
    );

    return {
      present: hasPlan,
      confidence: hasPlan ? 0.9 : 0.1,
      evidence: hasPlan ? '包含实施计划' : '缺少实施计划'
    };
  },

  /**
   * 检查验证方法
   */
  checkValidationMethod(userInput) {
    const validationIndicators = [
      '验证',
      '测试',
      '检查',
      '确认',
      '审核',
      '评估'
    ];

    const hasValidation = validationIndicators.some(indicator =>
      userInput.includes(indicator)
    );

    return {
      present: hasValidation,
      confidence: hasValidation ? 0.7 : 0.3,
      evidence: hasValidation ? '包含验证方法' : '缺少验证方法'
    };
  },

  /**
   * 计算完整性评分
   */
  calculateCompletenessScore(elements) {
    const presentElements = Object.values(elements).filter(el => el.present).length;
    const totalElements = Object.keys(elements).length;

    return Math.round((presentElements / totalElements) * 100);
  },

  /**
   * 识别缺失元素
   */
  identifyMissingElements(elements) {
    return Object.entries(elements)
      .filter(([key, value]) => !value.present)
      .map(([key]) => {
        const elementNames = {
          problemDefinition: '问题定义',
          requirementAnalysis: '需求分析',
          alternativeEvaluation: '备选方案评估',
          decisionCriteria: '决策标准',
          riskAssessment: '风险评估',
          implementationPlan: '实施计划',
          validationMethod: '验证方法'
        };
        return elementNames[key];
      });
  },

  /**
   * 逻辑一致性验证
   */
  validateLogicalConsistency(validation) {
    const { userInput } = validation;

    const consistencyChecks = {
      problemSolutionAlignment: this.checkProblemSolutionAlignment(userInput),
      criteriaConsistency: this.checkCriteriaConsistency(userInput),
      riskMitigationAlignment: this.checkRiskMitigationAlignment(userInput),
      resourceFeasibility: this.checkResourceFeasibility(userInput),
      timelineRealism: this.checkTimelineRealism(userInput)
    };

    const consistencyScore = this.calculateConsistencyScore(consistencyChecks);
    const inconsistencies = this.identifyInconsistencies(consistencyChecks);

    return {
      score: consistencyScore,
      checks: consistencyChecks,
      inconsistencies: inconsistencies,
      status: consistencyScore >= 70 ? 'PASS' : 'FAIL'
    };
  },

  /**
   * 检查问题-解决方案对齐
   */
  checkProblemSolutionAlignment(userInput) {
    const problemWords = ['问题', '挑战', '困难', '缺陷'];
    const solutionWords = ['解决', '方案', '方法', '改进', '优化'];

    const hasProblem = problemWords.some(word => userInput.includes(word));
    const hasSolution = solutionWords.some(word => userInput.includes(word));

    const aligned = hasProblem && hasSolution;

    return {
      aligned,
      confidence: aligned ? 0.9 : 0.3,
      evidence: aligned ? '问题和解决方案对齐' : '问题与解决方案不匹配'
    };
  },

  /**
   * 检查标准一致性
   */
  checkCriteriaConsistency(userInput) {
    const criteriaWords = ['标准', '指标', '要求'];
    const decisionWords = ['决定', '选择', '确定'];

    const hasCriteria = criteriaWords.some(word => userInput.includes(word));
    const hasDecision = decisionWords.some(word => userInput.includes(word));

    const consistent = hasCriteria && hasDecision;

    return {
      consistent,
      confidence: consistent ? 0.8 : 0.4,
      evidence: consistent ? '决策标准与决定一致' : '缺少标准或决定'
    };
  },

  /**
   * 检查风险缓解对齐
   */
  checkRiskMitigationAlignment(userInput) {
    const riskWords = ['风险', '问题', '威胁'];
    const mitigationWords = ['缓解', '预防', '应对', '解决'];

    const hasRisk = riskWords.some(word => userInput.includes(word));
    const hasMitigation = mitigationWords.some(word => userInput.includes(word));

    const aligned = hasRisk && hasMitigation;

    return {
      aligned,
      confidence: aligned ? 0.9 : 0.2,
      evidence: aligned ? '风险识别与缓解策略对齐' : '风险缓解不完整'
    };
  },

  /**
   * 检查资源可行性
   */
  checkResourceFeasibility(userInput) {
    const resourceIndicators = ['资源', '人力', '时间', '预算', '成本'];
    const feasibilityIndicators = ['可行', '能够', '可以', '支持'];

    const mentionsResources = resourceIndicators.some(indicator =>
      userInput.includes(indicator)
    );
    const mentionsFeasibility = feasibilityIndicators.some(indicator =>
      userInput.includes(indicator)
    );

    const feasible = mentionsResources && mentionsFeasibility;

    return {
      feasible,
      confidence: feasible ? 0.8 : 0.5,
      evidence: feasible ? '资源考虑充分' : '资源考虑不充分'
    };
  },

  /**
   * 检查时间表现实性
   */
  checkTimelineRealism(userInput) {
    const timeIndicators = ['时间', '日期', '日程', '计划', '周期'];
    const realisticIndicators = ['合理', '现实', '可行', '适当'];

    const mentionsTime = timeIndicators.some(indicator =>
      userInput.includes(indicator)
    );
    const mentionsRealism = realisticIndicators.some(indicator =>
      userInput.includes(indicator)
    );

    const realistic = mentionsTime && mentionsRealism;

    return {
      realistic,
      confidence: realistic ? 0.7 : 0.4,
      evidence: realistic ? '时间表考虑现实' : '时间表考虑不充分'
    };
  },

  /**
   * 计算一致性评分
   */
  calculateConsistencyScore(checks) {
    const passedChecks = Object.values(checks).filter(check =>
      check.aligned || check.consistent || check.feasible || check.realistic
    ).length;

    const totalChecks = Object.keys(checks).length;

    return Math.round((passedChecks / totalChecks) * 100);
  },

  /**
   * 识别不一致点
   */
  identifyInconsistencies(checks) {
    const inconsistencies = [];

    Object.entries(checks).forEach(([key, check]) => {
      if (!(check.aligned || check.consistent || check.feasible || check.realistic)) {
        inconsistencies.push({
          type: key,
          issue: check.evidence
        });
      }
    });

    return inconsistencies;
  },

  /**
   * 风险评估验证
   */
  validateRiskAssessment(validation) {
    const { userInput } = validation;

    const riskAnalysis = {
      riskIdentification: this.analyzeRiskIdentification(userInput),
      riskCategorization: this.analyzeRiskCategorization(userInput),
      riskImpact: this.analyzeRiskImpact(userInput),
      mitigationPlanning: this.analyzeMitigationPlanning(userInput),
      contingencyPlanning: this.analyzeContingencyPlanning(userInput)
    };

    const riskScore = this.calculateRiskScore(riskAnalysis);
    const criticalRisks = this.identifyCriticalRisks(riskAnalysis);

    return {
      score: riskScore,
      analysis: riskAnalysis,
      criticalRisks: criticalRisks,
      status: riskScore >= 70 ? 'PASS' : 'FAIL'
    };
  },

  /**
   * 分析风险识别
   */
  analyzeRiskIdentification(userInput) {
    const riskIndicators = [
      '风险', '问题', '挑战', '困难', '威胁',
      '不确定性', '障碍', '限制', '依赖'
    ];

    const identifiedRisks = riskIndicators.filter(indicator =>
      userInput.includes(indicator)
    ).length;

    return {
      count: identifiedRisks,
      completeness: identifiedRisks >= 2 ? 0.9 : identifiedRisks >= 1 ? 0.6 : 0.2,
      evidence: `识别到${identifiedRisks}个风险因素`
    };
  },

  /**
   * 分析风险分类
   */
  analyzeRiskCategorization(userInput) {
    const categoryIndicators = {
      '技术风险': ['技术', '系统', '架构', '开发'],
      '业务风险': ['业务', '市场', '客户', '竞争'],
      '管理风险': ['管理', '团队', '协调', '沟通'],
      '资源风险': ['资源', '预算', '时间', '人力']
    };

    const identifiedCategories = Object.entries(categoryIndicators)
      .filter(([category, indicators]) =>
        indicators.some(indicator => userInput.includes(indicator))
      )
      .map(([category]) => category);

    return {
      categories: identifiedCategories,
      completeness: identifiedCategories.length >= 2 ? 0.8 :
                     identifiedCategories.length >= 1 ? 0.6 : 0.3,
      evidence: `识别到${identifiedCategories.length}个风险类别`
    };
  },

  /**
   * 分析风险影响
   */
  analyzeRiskImpact(userInput) {
    const impactIndicators = [
      '影响', '后果', '损失', '成本', '时间',
      '严重', '重大', '轻微', '可接受'
    ];

    const mentionsImpact = impactIndicators.some(indicator =>
      userInput.includes(indicator)
    );

    return {
      mentioned: mentionsImpact,
      completeness: mentionsImpact ? 0.8 : 0.3,
      evidence: mentionsImpact ? '考虑了风险影响' : '缺少风险影响分析'
    };
  },

  /**
   * 分析缓解计划
   */
  analyzeMitigationPlanning(userInput) {
    const mitigationIndicators = [
      '缓解', '预防', '应对', '解决', '降低',
      '策略', '方法', '措施', '行动'
    ];

    const hasMitigation = mitigationIndicators.some(indicator =>
      userInput.includes(indicator)
    );

    return {
      hasPlan: hasMitigation,
      completeness: hasMitigation ? 0.9 : 0.2,
      evidence: hasMitigation ? '有缓解计划' : '缺少风险缓解计划'
    };
  },

  /**
   * 分析应急计划
   */
  analyzeContingencyPlanning(userInput) {
    const contingencyIndicators = [
      '应急', '备选', '备份', '替代', '预案',
      '如果', '万一', 'fallback', 'plan B'
    ];

    const hasContingency = contingencyIndicators.some(indicator =>
      userInput.includes(indicator)
    );

    return {
      hasPlan: hasContingency,
      completeness: hasContingency ? 0.7 : 0.4,
      evidence: hasContingency ? '有应急计划' : '缺少应急计划'
    };
  },

  /**
   * 计算风险评分
   */
  calculateRiskScore(riskAnalysis) {
    const scores = [
      riskAnalysis.riskIdentification.completeness,
      riskAnalysis.riskCategorization.completeness,
      riskAnalysis.riskImpact.completeness,
      riskAnalysis.mitigationPlanning.completeness,
      riskAnalysis.contingencyPlanning.completeness
    ];

    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return Math.round(averageScore * 100);
  },

  /**
   * 识别关键风险
   */
  identifyCriticalRisks(riskAnalysis) {
    const criticalIssues = [];

    if (riskAnalysis.riskIdentification.count < 2) {
      criticalIssues.push('风险识别不充分');
    }

    if (!riskAnalysis.mitigationPlanning.hasPlan) {
      criticalIssues.push('缺少风险缓解计划');
    }

    if (!riskAnalysis.riskImpact.mentioned) {
      criticalIssues.push('未考虑风险影响');
    }

    return criticalIssues;
  },

  /**
   * 计算决策质量评分
   */
  calculateDecisionQualityScore(completeness, consistency, riskAssessment) {
    const weights = {
      completeness: 0.3,
      consistency: 0.3,
      riskAssessment: 0.4
    };

    const weightedScore =
      completeness.score * weights.completeness +
      consistency.score * weights.consistency +
      riskAssessment.score * weights.riskAssessment;

    return Math.round(weightedScore);
  },

  /**
   * 生成验证报告
   */
  generateValidationReport(validation, completeness, consistency, riskAssessment, qualityScore) {
    const overallStatus = qualityScore >= 70 ? 'PASS' : 'FAIL';

    return {
      success: true,
      timestamp: new Date().toISOString(),
      overall: {
        score: qualityScore,
        status: overallStatus,
        grade: this.getDecisionGrade(qualityScore)
      },
      completeness: completeness,
      consistency: consistency,
      riskAssessment: riskAssessment,
      recommendations: this.generateRecommendations(completeness, consistency, riskAssessment),
      actionItems: this.generateActionItems(completeness, consistency, riskAssessment)
    };
  },

  /**
   * 获取决策等级
   */
  getDecisionGrade(score) {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  },

  /**
   * 生成改进建议
   */
  generateRecommendations(completeness, consistency, riskAssessment) {
    const recommendations = [];

    if (completeness.score < 70) {
      recommendations.push({
        priority: 'HIGH',
        area: '决策完整性',
        suggestion: '补充缺失的决策元素：' + completeness.missing.join('、')
      });
    }

    if (consistency.score < 70) {
      recommendations.push({
        priority: 'MEDIUM',
        area: '逻辑一致性',
        suggestion: '检查并修正逻辑不一致点：' + consistency.inconsistencies.map(i => i.issue).join('、')
      });
    }

    if (riskAssessment.score < 70) {
      recommendations.push({
        priority: 'HIGH',
        area: '风险评估',
        suggestion: '完善风险评估：' + riskAssessment.criticalRisks.join('、')
      });
    }

    return recommendations;
  },

  /**
   * 生成行动项
   */
  generateActionItems(completeness, consistency, riskAssessment) {
    const actionItems = [];

    completeness.missing.forEach(element => {
      actionItems.push({
        task: `补充${element}`,
        priority: 'HIGH',
        description: `在决策过程中明确${element}部分`
      });
    });

    consistency.inconsistencies.forEach(inconsistency => {
      actionItems.push({
        task: `修正${inconsistency.type}`,
        priority: 'MEDIUM',
        description: `解决${inconsistency.issue}`
      });
    });

    riskAssessment.criticalRisks.forEach(risk => {
      actionItems.push({
        task: `处理${risk}`,
        priority: 'HIGH',
        description: '完善相应的风险缓解策略'
      });
    });

    return actionItems;
  },

  /**
   * 质量门禁检查
   */
  performQualityGate(validationReport) {
    const { overall, recommendations } = validationReport;

    const hasHighPriorityIssues = recommendations.some(rec => rec.priority === 'HIGH');
    const scoreThreshold = 70;

    const gateStatus = overall.score >= scoreThreshold && !hasHighPriorityIssues;

    return {
      passed: gateStatus,
      blocked: !gateStatus,
      threshold: scoreThreshold,
      blockingIssues: recommendations.filter(rec => rec.priority === 'HIGH'),
      warningIssues: recommendations.filter(rec => rec.priority === 'MEDIUM'),
      message: gateStatus ?
        '✅ 决策质量门禁通过' :
        '🚫 决策质量门禁未通过，请处理高风险问题后继续'
    };
  }
};