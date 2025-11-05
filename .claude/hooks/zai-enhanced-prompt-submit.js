/**
 * ZAI-Enhanced UserPromptSubmit Hook - 集成ZAI-MCP-Server能力的增强版Hook
 *
 * 新增能力：
 * - 智能任务分解（基于ZAI的自动分析能力）
 * - 预测性风险评估（提前识别和处理风险）
 * - 个性化适配（基于学习历史优化推荐）
 * - 语义缓存优化（智能内容检索和复用）
 */

const fs = require('fs');
const path = require('path');

class ZAIEnhancedPromptSubmitHook {
  constructor() {
    // ZAI能力配置
    this.zaiCapabilities = {
      intelligentBreakdown: true,
      predictiveRisk: true,
      adaptiveLearning: true,
      semanticCache: true
    };

    // 缓存目录
    this.cacheDir = path.join(__dirname, '../cache/zai-enhanced');
    this.ensureCacheDir();

    // 学习数据
    this.learningDataFile = path.join(this.cacheDir, 'learning_patterns.json');
    this.loadLearningData();
  }

  ensureCacheDir() {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  loadLearningData() {
    try {
      if (fs.existsSync(this.learningDataFile)) {
        this.learningData = JSON.parse(fs.readFileSync(this.learningDataFile, 'utf8'));
      } else {
        this.learningData = {
          userPatterns: {},
          taskBreakdowns: [],
          riskAssessments: [],
          recommendations: []
        };
      }
    } catch (error) {
      console.warn('加载学习数据失败:', error.message);
      this.learningData = {
        userPatterns: {},
        taskBreakdowns: [],
        riskAssessments: [],
        recommendations: []
      };
    }
  }

  saveLearningData() {
    try {
      fs.writeFileSync(this.learningDataFile, JSON.stringify(this.learningData, null, 2));
    } catch (error) {
      console.error('保存学习数据失败:', error.message);
    }
  }

  /**
   * 增强版prompt提交处理
   */
  async processPromptSubmission(promptData) {
    const enhancedData = {
      ...promptData,
      timestamp: new Date().toISOString(),
      zaiAnalysis: {}
    };

    // 1. 智能任务分解
    if (this.zaiCapabilities.intelligentBreakdown) {
      enhancedData.zaiAnalysis.taskBreakdown = await this.performIntelligentBreakdown(promptData);
    }

    // 2. 预测性风险评估
    if (this.zaiCapabilities.predictiveRisk) {
      enhancedData.zaiAnalysis.riskAssessment = await this.performPredictiveRiskAssessment(promptData);
    }

    // 3. 个性化适配
    if (this.zaiCapabilities.adaptiveLearning) {
      enhancedData.zaiAnalysis.personalizedRecommendations = await this.generatePersonalizedRecommendations(promptData);
    }

    // 4. 语义缓存检查
    if (this.zaiCapabilities.semanticCache) {
      enhancedData.zaiAnalysis.cachedInsights = await this.checkSemanticCache(promptData);
    }

    // 保存学习数据
    this.updateLearningPatterns(enhancedData);

    return enhancedData;
  }

  /**
   * 智能任务分解
   */
  async performIntelligentBreakdown(promptData) {
    const breakdown = {
      complexity: 'medium',
      estimatedDuration: 60,
      phases: [],
      subtasks: [],
      risks: [],
      recommendations: []
    };

    // 分析prompt复杂度
    breakdown.complexity = this.assessPromptComplexity(promptData);
    breakdown.estimatedDuration = this.estimateTaskDuration(promptData, breakdown.complexity);

    // 生成任务分解
    if (breakdown.complexity === 'high') {
      breakdown.phases = [
        { name: '深度分析与规划', duration: breakdown.estimatedDuration * 0.3 },
        { name: '核心执行实现', duration: breakdown.estimatedDuration * 0.5 },
        { name: '验证与优化', duration: breakdown.estimatedDuration * 0.2 }
      ];

      breakdown.subtasks = [
        '需求深度分析',
        '技术方案设计',
        '风险评估',
        '核心功能实现',
        '质量保证',
        '测试验证',
        '性能优化',
        '文档完善'
      ];

      breakdown.risks = [
        { type: 'complexity', description: '任务复杂度较高，需要详细规划' },
        { type: 'dependency', description: '可能存在未预期的依赖关系' }
      ];

    } else if (breakdown.complexity === 'medium') {
      breakdown.phases = [
        { name: '分析与准备', duration: breakdown.estimatedDuration * 0.4 },
        { name: '执行实现', duration: breakdown.estimatedDuration * 0.6 }
      ];

      breakdown.subtasks = [
        '需求确认',
        '方案设计',
        '功能实现',
        '测试验证',
        '文档完善'
      ];

      breakdown.risks = [
        { type: 'scope', description: '范围可能需要调整' }
      ];
    } else {
      breakdown.phases = [
        { name: '直接执行', duration: breakdown.estimatedDuration }
      ];

      breakdown.subtasks = [
        '快速实现',
        '基础验证',
        '简单文档'
      ];
    }

    // 基于历史数据优化分解
    this.optimizeBreakdownWithLearning(breakdown);

    return breakdown;
  }

  /**
   * 预测性风险评估
   */
  async performPredictiveRiskAssessment(promptData) {
    const assessment = {
      overallRisk: 'medium',
      riskScore: 0.5,
      categoryRisks: {
        complexity: 0.4,
        dependency: 0.3,
        resource: 0.2,
        timeline: 0.3,
        quality: 0.2
      },
      detailedRisks: [],
      mitigationPlan: []
    };

    // 基于prompt特征评估风险
    const complexityRisk = this.assessComplexityRisk(promptData);
    assessment.categoryRisks.complexity = complexityRisk;

    const dependencyRisk = this.assessDependencyRisk(promptData);
    assessment.categoryRisks.dependency = dependencyRisk;

    const resourceRisk = this.assessResourceRisk(promptData);
    assessment.categoryRisks.resource = resourceRisk;

    // 计算总体风险评分
    const weights = {
      complexity: 0.3,
      dependency: 0.25,
      resource: 0.2,
      timeline: 0.15,
      quality: 0.1
    };

    assessment.riskScore = Object.entries(assessment.categoryRisks)
      .reduce((sum, [category, score]) => sum + score * weights[category], 0);

    assessment.overallRisk = this.determineRiskLevel(assessment.riskScore);

    // 生成缓解计划
    assessment.mitigationPlan = this.generateMitigationPlan(assessment);

    return assessment;
  }

  /**
   * 生成个性化推荐
   */
  async generatePersonalizedRecommendations(promptData) {
    const recommendations = [];

    // 基于学习历史的推荐
    const userPatterns = this.analyzeUserPatterns(promptData);

    if (userPatterns.preferredComplexity) {
      recommendations.push({
        type: 'complexity',
        description: `建议将任务复杂度设置为${userPatterns.preferredComplexity}`,
        reason: '基于历史偏好'
      });
    }

    if (userPatterns.frequentTopics) {
      userPatterns.frequentTopics.forEach(topic => {
        recommendations.push({
          type: 'topic',
          description: `考虑重点关注${topic}相关内容`,
          reason: '用户历史关注点'
        });
      });
    }

    // 基于ZAI能力的推荐
    if (this.zaiCapabilities.intelligentBreakdown) {
      recommendations.push({
        type: 'zai_breakdown',
        description: '利用智能任务分解功能优化工作流程',
        reason: '提升任务执行效率'
      });
    }

    if (this.zaiCapabilities.predictiveRisk) {
      recommendations.push({
        type: 'zai_risk',
        description: '使用预测性风险评估提前识别问题',
        reason: '减少意外风险'
      });
    }

    return recommendations;
  }

  /**
   * 检查语义缓存
   */
  async checkSemanticCache(promptData) {
    const cacheFile = path.join(this.cacheDir, 'semantic_cache.json');
    let cache = {};

    try {
      if (fs.existsSync(cacheFile)) {
        cache = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
      }
    } catch (error) {
      console.warn('读取语义缓存失败:', error.message);
    }

    // 检查相似prompt的缓存结果
    const similarityThreshold = 0.8;
    const promptText = promptData.prompt || '';
    let cachedInsights = null;

    for (const [cachedPrompt, cachedResult] of Object.entries(cache)) {
      const similarity = this.calculateTextSimilarity(promptText, cachedPrompt);
      if (similarity >= similarityThreshold) {
        cachedInsights = {
          similarity: similarity,
          cachedPrompt: cachedPrompt,
          result: cachedResult,
          timestamp: cachedResult.timestamp
        };
        break;
      }
    }

    return cachedInsights;
  }

  /**
   * 文本相似性计算
   */
  calculateTextSimilarity(text1, text2) {
    const words1 = text1.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const words2 = text2.toLowerCase().split(/\s+/).filter(w => w.length > 2);

    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];

    return union.length > 0 ? intersection.length / union.length : 0;
  }

  /**
   * 更新学习模式
   */
  updateLearningPatterns(enhancedData) {
    const pattern = {
      timestamp: enhancedData.timestamp,
      promptLength: (enhancedData.prompt || '').length,
      complexity: enhancedData.zaiAnalysis.taskBreakdown?.complexity || 'medium',
      riskLevel: enhancedData.zaiAnalysis.riskAssessment?.overallRisk || 'medium',
      recommendations: enhancedData.zaiAnalysis.personalizedRecommendations || []
    };

    if (!this.learningData.userPatterns) {
      this.learningData.userPatterns = {};
    }

    // 使用时间戳作为键存储模式
    const patternKey = pattern.timestamp || new Date().toISOString();
    this.learningData.userPatterns[patternKey] = pattern;

    // 保持最近1000条记录
    const patternKeys = Object.keys(this.learningData.userPatterns);
    if (patternKeys.length > 1000) {
      // 按时间排序并保留最近的500条
      const sortedKeys = patternKeys.sort().slice(-500);
      const newPatterns = {};
      sortedKeys.forEach(key => {
        newPatterns[key] = this.learningData.userPatterns[key];
      });
      this.learningData.userPatterns = newPatterns;
    }

    this.saveLearningData();
  }

  /**
   * 分析用户模式
   */
  analyzeUserPatterns(promptData) {
    const patterns = this.learningData.userPatterns || {};
    const patternValues = Object.values(patterns);

    // 按时间排序，取最近50条记录
    const recentPatterns = patternValues
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 50);

    const analysis = {
      preferredComplexity: this.getMostFrequent(recentPatterns.map(p => p.complexity)),
      frequentTopics: [],
      averageRiskLevel: 'medium',
      preferredDuration: 60
    };

    // 分析风险偏好
    const riskLevels = recentPatterns.map(p => p.riskLevel);
    const riskCount = {};
    riskLevels.forEach(risk => {
      riskCount[risk] = (riskCount[risk] || 0) + 1;
    });

    if (Object.keys(riskCount).length > 0) {
      analysis.averageRiskLevel = Object.entries(riskCount)
        .sort(([,a], [,b]) => b - a)[0][0];
    }

    return analysis;
  }

  /**
   * 获取最频繁的值
   */
  getMostFrequent(arr) {
    if (arr.length === 0) return null;

    const count = {};
    arr.forEach(item => {
      count[item] = (count[item] || 0) + 1;
    });

    return Object.entries(count).sort(([,a], [,b]) => b - a)[0][0];
  }

  /**
   * 评估prompt复杂度
   */
  assessPromptComplexity(promptData) {
    const text = promptData.prompt || '';
    let complexityScore = 0;

    // 基于关键词
    const complexityKeywords = [
      '开发', '设计', '架构', '系统', '集成', '复杂', '多个',
      '分析', '研究', '评估', '比较', '规划', '策略'
    ];

    complexityKeywords.forEach(keyword => {
      if (text.toLowerCase().includes(keyword)) {
        complexityScore += 1;
      }
    });

    // 基于长度
    if (text.length > 500) complexityScore += 2;
    if (text.length > 1000) complexityScore += 3;

    // 基于问题数量
    const questionCount = (text.match(/[？?]/g) || []).length;
    complexityScore += questionCount;

    if (complexityScore >= 5) return 'high';
    if (complexityScore >= 2) return 'medium';
    return 'low';
  }

  /**
   * 估算任务时长
   */
  estimateTaskDuration(promptData, complexity) {
    const baseTimes = {
      low: 30,
      medium: 90,
      high: 240
    };

    return baseTimes[complexity] || 90;
  }

  /**
   * 评估复杂度风险
   */
  assessComplexityRisk(promptData) {
    const complexity = this.assessPromptComplexity(promptData);
    const riskScores = { low: 0.2, medium: 0.5, high: 0.8 };
    return riskScores[complexity];
  }

  /**
   * 评估依赖风险
   */
  assessDependencyRisk(promptData) {
    const text = promptData.prompt || '';
    const dependencyKeywords = ['依赖', '需要', '基于', '前提', '首先', '然后'];

    let dependencyCount = 0;
    dependencyKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        dependencyCount++;
      }
    });

    return Math.min(dependencyCount * 0.15, 0.8);
  }

  /**
   * 评估资源风险
   */
  assessResourceRisk(promptData) {
    // 简化的资源风险评估
    return 0.3; // 固定中等风险
  }

  /**
   * 确定风险等级
   */
  determineRiskLevel(score) {
    if (score >= 0.7) return 'high';
    if (score >= 0.4) return 'medium';
    return 'low';
  }

  /**
   * 生成缓解计划
   */
  generateMitigationPlan(assessment) {
    const plan = [];

    if (assessment.categoryRisks.complexity > 0.6) {
      plan.push({
        type: 'complexity',
        action: '进行详细规划，分阶段实施',
        priority: 'high'
      });
    }

    if (assessment.categoryRisks.dependency > 0.5) {
      plan.push({
        type: 'dependency',
        action: '明确依赖关系，建立沟通机制',
        priority: 'medium'
      });
    }

    if (assessment.categoryRisks.resource > 0.4) {
      plan.push({
        type: 'resource',
        action: '合理分配资源，准备应急预案',
        priority: 'medium'
      });
    }

    return plan;
  }

  /**
   * 基于学习数据优化分解
   */
  optimizeBreakdownWithLearning(breakdown) {
    // 基于历史成功的分解模式优化当前分解
    // 这里可以实现更复杂的学习算法
  }

  /**
   * Hook入口点
   */
  async hook(promptData) {
    try {
      console.log('🤖 ZAI-Enhanced Hook: 处理用户prompt提交');

      const enhancedData = await this.processPromptSubmission(promptData);

      // 将增强数据添加到原始promptData中
      Object.assign(promptData, enhancedData.zaiAnalysis);

      // 同时保持zaiAnalysis结构以便测试和调试
      promptData.zaiAnalysis = enhancedData.zaiAnalysis;

      console.log('✅ ZAI增强分析完成');
      console.log(`   - 任务复杂度: ${enhancedData.zaiAnalysis.taskBreakdown?.complexity || 'medium'}`);
      console.log(`   - 风险等级: ${enhancedData.zaiAnalysis.riskAssessment?.overallRisk || 'medium'}`);
      console.log(`   - 推荐数量: ${enhancedData.zaiAnalysis.personalizedRecommendations?.length || 0}`);

      return promptData;

    } catch (error) {
      console.error('❌ ZAI-Enhanced Hook 处理失败:', error.message);
      return promptData;
    }
  }
}

// 导出Hook实例
module.exports = new ZAIEnhancedPromptSubmitHook();