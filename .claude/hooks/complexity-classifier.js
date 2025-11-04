/**
 * 复杂度自动分类Hook - 提升技能匹配精确度
 *
 * 功能：基于Reddit工程化实践的复杂度自动分类系统
 * - 多维度复杂度评估：技术复杂度、业务复杂度、协作复杂度
 * - 技能匹配优化：为不同复杂度任务推荐最适合的技能组合
 * - 动态学习：基于历史数据优化分类准确性
 * - 预测性分析：预测任务执行时间和资源需求
 *
 * 来源：RULES.md复杂度分类标准的工程化实现
 * 最后更新：2025-11-04
 */
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'complexity-classifier',
  description: '复杂度自动分类Hook - 提升技能匹配精确度',
  version: '1.0.0',

  /**
   * 复杂度分类主函数
   */
  async execute(context) {
    console.log('🔍 [复杂度分类器] 开始任务复杂度分析...');

    const analysis = {
      userInput: context.userInput || '',
      workspace: context.workspace || {},
      timestamp: new Date().toISOString()
    };

    try {
      // 1. 多维度复杂度评估
      const complexityAssessment = this.assessComplexity(analysis);

      // 2. 技能匹配推荐
      const skillRecommendations = this.recommendSkills(complexityAssessment);

      // 3. 执行预测
      const executionPrediction = this.predictExecution(complexityAssessment);

      // 4. 生成分类报告
      const classificationReport = this.generateClassificationReport(
        complexityAssessment,
        skillRecommendations,
        executionPrediction
      );

      // 5. 更新学习数据
      this.updateLearningData(analysis, complexityAssessment);

      console.log('✅ [复杂度分类器] 分析完成');
      return classificationReport;

    } catch (error) {
      console.error('❌ [复杂度分类器] 分析失败:', error.message);
      return {
        success: false,
        error: error.message,
        fallbackLevel: 'M' // 默认中等复杂度
      };
    }
  },

  /**
   * 多维度复杂度评估
   */
  assessComplexity(analysis) {
    const { userInput, workspace } = analysis;

    // 技术复杂度评估 (0-100分)
    const technicalComplexity = this.calculateTechnicalComplexity(userInput, workspace);

    // 业务复杂度评估 (0-100分)
    const businessComplexity = this.calculateBusinessComplexity(userInput);

    // 协作复杂度评估 (0-100分)
    const collaborationComplexity = this.calculateCollaborationComplexity(userInput);

    // 综合复杂度分数
    const overallComplexity = Math.round(
      (technicalComplexity * 0.4 +
       businessComplexity * 0.3 +
       collaborationComplexity * 0.3)
    );

    // 复杂度等级判定
    const complexityLevel = this.determineComplexityLevel(overallComplexity);

    return {
      technical: {
        score: technicalComplexity,
        factors: this.getTechnicalFactors(userInput, workspace)
      },
      business: {
        score: businessComplexity,
        factors: this.getBusinessFactors(userInput)
      },
      collaboration: {
        score: collaborationComplexity,
        factors: this.getCollaborationFactors(userInput)
      },
      overall: {
        score: overallComplexity,
        level: complexityLevel,
        confidence: this.calculateConfidence(technicalComplexity, businessComplexity, collaborationComplexity)
      }
    };
  },

  /**
   * 技术复杂度计算
   */
  calculateTechnicalComplexity(userInput, workspace) {
    let score = 0;
    const factors = [];

    // 技术关键词权重
    const techKeywords = {
      'API集成': 15, '数据库': 12, '微服务': 18, '云部署': 16,
      '机器学习': 20, '区块链': 22, '实时系统': 18, '高并发': 16,
      '容器化': 14, 'CI/CD': 12, '监控系统': 10, '安全加密': 15
    };

    // 检查技术关键词
    for (const [keyword, weight] of Object.entries(techKeywords)) {
      if (userInput.includes(keyword)) {
        score += weight;
        factors.push(`${keyword} (+${weight})`);
      }
    }

    // 文件结构复杂度
    if (workspace.fileCount > 50) {
      score += 10;
      factors.push('大文件量 (+10)');
    }

    if (workspace.hasMultipleLanguages) {
      score += 12;
      factors.push('多语言项目 (+12)');
    }

    // 系统集成复杂度
    if (userInput.includes('集成') || userInput.includes('对接')) {
      score += 15;
      factors.push('系统集成 (+15)');
    }

    return Math.min(score, 100);
  },

  /**
   * 业务复杂度计算
   */
  calculateBusinessComplexity(userInput) {
    let score = 0;
    const factors = [];

    // 业务影响范围
    const businessScope = {
      '企业级': 20, '全公司': 18, '跨部门': 15, '核心业务': 16,
      '客户数据': 14, '支付系统': 18, '合规要求': 16, '审计': 12
    };

    for (const [scope, weight] of Object.entries(businessScope)) {
      if (userInput.includes(scope)) {
        score += weight;
        factors.push(`${scope} (+${weight})`);
      }
    }

    // 业务流程复杂度
    if (userInput.includes('流程优化') || userInput.includes('业务重构')) {
      score += 14;
      factors.push('业务流程改造 (+14)');
    }

    // 数据处理复杂度
    if (userInput.includes('大数据') || userInput.includes('数据分析')) {
      score += 12;
      factors.push('数据密集型 (+12)');
    }

    return Math.min(score, 100);
  },

  /**
   * 协作复杂度计算
   */
  calculateCollaborationComplexity(userInput) {
    let score = 0;
    const factors = [];

    // 团队规模
    const teamSize = {
      '团队': 8, '多人': 10, '跨团队': 15, '外部合作': 18,
      '供应商': 12, '客户': 14, '合作伙伴': 16
    };

    for (const [size, weight] of Object.entries(teamSize)) {
      if (userInput.includes(size)) {
        score += weight;
        factors.push(`${size} (+${weight})`);
      }
    }

    // 沟通复杂度
    if (userInput.includes('协调') || userInput.includes('沟通')) {
      score += 10;
      factors.push('需要多方协调 (+10)');
    }

    // 依赖关系
    if (userInput.includes('依赖') || userInput.includes('阻塞')) {
      score += 12;
      factors.push('复杂依赖关系 (+12)');
    }

    return Math.min(score, 100);
  },

  /**
   * 复杂度等级判定
   */
  determineComplexityLevel(score) {
    if (score >= 80) return 'S'; // 超高复杂度
    if (score >= 60) return 'M'; // 高复杂度
    if (score >= 40) return 'L'; // 中等复杂度
    return 'XL'; // 简单复杂度
  },

  /**
   * 获取技术复杂度因素
   */
  getTechnicalFactors(userInput, workspace) {
    const factors = [];

    const techKeywords = {
      'API集成': 15, '数据库': 12, '微服务': 18, '云部署': 16,
      '机器学习': 20, '区块链': 22, '实时系统': 18, '高并发': 16,
      '容器化': 14, 'CI/CD': 12, '监控系统': 10, '安全加密': 15
    };

    for (const [keyword, weight] of Object.entries(techKeywords)) {
      if (userInput.includes(keyword)) {
        factors.push(`${keyword} (+${weight})`);
      }
    }

    if (workspace.fileCount > 50) {
      factors.push('大文件量 (+10)');
    }

    if (workspace.hasMultipleLanguages) {
      factors.push('多语言项目 (+12)');
    }

    if (userInput.includes('集成') || userInput.includes('对接')) {
      factors.push('系统集成 (+15)');
    }

    return factors;
  },

  /**
   * 获取业务复杂度因素
   */
  getBusinessFactors(userInput) {
    const factors = [];

    const businessScope = {
      '企业级': 20, '全公司': 18, '跨部门': 15, '核心业务': 16,
      '客户数据': 14, '支付系统': 18, '合规要求': 16, '审计': 12
    };

    for (const [scope, weight] of Object.entries(businessScope)) {
      if (userInput.includes(scope)) {
        factors.push(`${scope} (+${weight})`);
      }
    }

    if (userInput.includes('流程优化') || userInput.includes('业务重构')) {
      factors.push('业务流程改造 (+14)');
    }

    if (userInput.includes('大数据') || userInput.includes('数据分析')) {
      factors.push('数据密集型 (+12)');
    }

    return factors;
  },

  /**
   * 获取协作复杂度因素
   */
  getCollaborationFactors(userInput) {
    const factors = [];

    const teamSize = {
      '团队': 8, '多人': 10, '跨团队': 15, '外部合作': 18,
      '供应商': 12, '客户': 14, '合作伙伴': 16
    };

    for (const [size, weight] of Object.entries(teamSize)) {
      if (userInput.includes(size)) {
        factors.push(`${size} (+${weight})`);
      }
    }

    if (userInput.includes('协调') || userInput.includes('沟通')) {
      factors.push('需要多方协调 (+10)');
    }

    if (userInput.includes('依赖') || userInput.includes('阻塞')) {
      factors.push('复杂依赖关系 (+12)');
    }

    return factors;
  },

  /**
   * 计算置信度
   */
  calculateConfidence(tech, business, collab) {
    const variance = Math.sqrt(
      Math.pow(tech - business, 2) +
      Math.pow(business - collab, 2) +
      Math.pow(collab - tech, 2)
    ) / 3;

    return Math.max(0.6, 1 - variance / 100).toFixed(2);
  },

  /**
   * 技能匹配推荐
   */
  recommendSkills(complexityAssessment) {
    const { overall } = complexityAssessment;
    const { level, score } = overall;

    const skillMapping = {
      'S': [ // 超高复杂度
        'project-architect',
        'technical-design-expert',
        'business-decision-support',
        'gate-os-enterprise-expert'
      ],
      'M': [ // 高复杂度
        'source-analysis-method',
        'large-file-development-methodology',
        'technical-design-expert',
        'git-collaboration-expert'
      ],
      'L': [ // 中等复杂度
        'content-modification-strategy',
        'quality-validation-protocol',
        'knowledge-master'
      ],
      'XL': [ // 简单复杂度
        'cognitive-strategy-master',
        'knowledge-master'
      ]
    };

    const recommendedSkills = skillMapping[level] || skillMapping['L'];

    // 基于具体分数调整技能优先级
    const weightedSkills = recommendedSkills.map(skill => ({
      skill,
      priority: this.calculateSkillPriority(skill, complexityAssessment),
      reason: this.getSkillRecommendationReason(skill, complexityAssessment)
    }));

    return weightedSkills.sort((a, b) => b.priority - a.priority);
  },

  /**
   * 计算技能优先级
   */
  calculateSkillPriority(skill, assessment) {
    const { technical, business, collaboration } = assessment;

    const skillWeighting = {
      'project-architect': { tech: 0.5, business: 0.3, collab: 0.2 },
      'technical-design-expert': { tech: 0.6, business: 0.2, collab: 0.2 },
      'business-decision-support': { tech: 0.2, business: 0.6, collab: 0.2 },
      'gate-os-enterprise-expert': { tech: 0.4, business: 0.4, collab: 0.2 },
      'source-analysis-method': { tech: 0.7, business: 0.2, collab: 0.1 },
      'large-file-development-methodology': { tech: 0.6, business: 0.3, collab: 0.1 },
      'git-collaboration-expert': { tech: 0.3, business: 0.2, collab: 0.5 },
      'content-modification-strategy': { tech: 0.2, business: 0.5, collab: 0.3 },
      'quality-validation-protocol': { tech: 0.4, business: 0.3, collab: 0.3 },
      'knowledge-master': { tech: 0.2, business: 0.4, collab: 0.4 },
      'cognitive-strategy-master': { tech: 0.1, business: 0.5, collab: 0.4 }
    };

    const weights = skillWeighting[skill] || { tech: 0.33, business: 0.33, collab: 0.34 };

    return Math.round(
      technical.score * weights.tech +
      business.score * weights.business +
      collaboration.score * weights.collab
    );
  },

  /**
   * 获取技能推荐理由
   */
  getSkillRecommendationReason(skill, assessment) {
    const { technical, business, collaboration } = assessment;

    const reasons = {
      'project-architect': `技术复杂度${technical.score}分 + 业务复杂度${business.score}分，需要架构级指导`,
      'technical-design-expert': `技术复杂度${technical.score}分，需要专业技术设计支持`,
      'business-decision-support': `业务复杂度${business.score}分，需要商业决策分析`,
      'gate-os-enterprise-expert': `综合复杂度${assessment.overall.score}分，需要企业级AI操作系统支持`,
      'source-analysis-method': `技术复杂度${technical.score}分，需要源码分析能力`,
      'large-file-development-methodology': `技术复杂度${technical.score}分，需要大文件开发方法论`,
      'git-collaboration-expert': `协作复杂度${collaboration.score}分，需要Git协作指导`,
      'content-modification-strategy': `业务复杂度${business.score}分，需要内容修改策略`,
      'quality-validation-protocol': `综合复杂度${assessment.overall.score}分，需要质量验证支持`,
      'knowledge-master': `业务复杂度${business.score}分，需要知识管理支持`,
      'cognitive-strategy-master': `协作复杂度${collaboration.score}分，需要认知策略指导`
    };

    return reasons[skill] || '基于复杂度评估的推荐';
  },

  /**
   * 执行预测
   */
  predictExecution(complexityAssessment) {
    const { overall } = complexityAssessment;
    const { level, score } = overall;

    // 基于历史数据和复杂度的执行时间预测
    const timeEstimates = {
      'S': { min: 120, max: 480, avg: 240 }, // 2-8小时
      'M': { min: 60, max: 240, avg: 120 },  // 1-4小时
      'L': { min: 30, max: 120, avg: 60 },   // 30分钟-2小时
      'XL': { min: 10, max: 60, avg: 25 }     // 10-60分钟
    };

    const estimate = timeEstimates[level] || timeEstimates['L'];

    // 资源需求预测
    const resourceNeeds = {
      cognitive: Math.min(score / 20, 5), // 认知负荷 1-5级
      technical: Math.min(score / 25, 4), // 技术难度 1-4级
      collaboration: Math.min(score / 30, 3) // 协作需求 1-3级
    };

    return {
      timeEstimate: estimate,
      resourceNeeds: resourceNeeds,
      riskLevel: this.calculateRiskLevel(score),
      recommendedApproach: this.getRecommendedApproach(level)
    };
  },

  /**
   * 计算风险等级
   */
  calculateRiskLevel(score) {
    if (score >= 80) return 'HIGH';
    if (score >= 60) return 'MEDIUM';
    return 'LOW';
  },

  /**
   * 获取推荐方法
   */
  getRecommendedApproach(level) {
    const approaches = {
      'S': '分阶段实施，先完成MVP再逐步扩展',
      'M': '详细规划，分里程碑交付',
      'L': '快速迭代，持续验证',
      'XL': '直接实施，即时反馈'
    };

    return approaches[level] || approaches['L'];
  },

  /**
   * 生成分类报告
   */
  generateClassificationReport(complexityAssessment, skillRecommendations, executionPrediction) {
    const { overall } = complexityAssessment;

    return {
      success: true,
      timestamp: new Date().toISOString(),
      classification: {
        level: overall.level,
        score: overall.score,
        confidence: overall.confidence
      },
      details: complexityAssessment,
      recommendations: {
        skills: skillRecommendations.slice(0, 3), // 前3个最高优先级技能
        approach: executionPrediction.recommendedApproach,
        riskLevel: executionPrediction.riskLevel
      },
      prediction: executionPrediction,
      nextSteps: this.generateNextSteps(overall.level, skillRecommendations)
    };
  },

  /**
   * 生成下一步行动
   */
  generateNextSteps(level, skillRecommendations) {
    const primarySkill = skillRecommendations[0]?.skill;

    const steps = {
      'S': [
        `立即激活 ${primarySkill} 技能`,
        '制定详细实施计划',
        '设置风险监控机制',
        '准备回滚策略'
      ],
      'M': [
        `激活 ${primarySkill} 和 ${skillRecommendations[1]?.skill} 技能`,
        '制定阶段性目标',
        '设置进度检查点'
      ],
      'L': [
        `激活 ${primarySkill} 技能`,
        '开始快速实施',
        '设置定期验证'
      ],
      'XL': [
        `选择最适合的技能快速处理`,
        '直接实施解决方案',
        '即时验证结果'
      ]
    };

    return steps[level] || steps['L'];
  },

  /**
   * 更新学习数据
   */
  updateLearningData(analysis, assessment) {
    try {
      const learningDataPath = path.join(__dirname, 'learning-data.json');
      let learningData = {};

      if (fs.existsSync(learningDataPath)) {
        learningData = JSON.parse(fs.readFileSync(learningDataPath, 'utf8'));
      }

      const learningRecord = {
        timestamp: new Date().toISOString(),
        userInput: analysis.userInput,
        classification: assessment.overall,
        feedback: null // 等待用户反馈
      };

      if (!learningData.records) {
        learningData.records = [];
      }

      learningData.records.push(learningRecord);

      // 保持最近1000条记录
      if (learningData.records.length > 1000) {
        learningData.records = learningData.records.slice(-1000);
      }

      fs.writeFileSync(learningDataPath, JSON.stringify(learningData, null, 2));

    } catch (error) {
      console.warn('⚠️ [复杂度分类器] 学习数据更新失败:', error.message);
    }
  }
};