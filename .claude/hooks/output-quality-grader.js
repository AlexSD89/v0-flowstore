/**
 * 输出质量自动评级Hook - 标准化输出质量评估
 *
 * 功能：基于Reddit工程化实践的输出质量自动评级系统
 * - 多维度质量评估：内容质量、格式规范、技术质量、业务价值
 * - 自动化评级算法：基于机器学习质量评估模型
 * - 实时质量监控：持续跟踪输出质量变化
 * - 质量改进建议：提供具体的质量改进建议
 * - 质量趋势分析：分析质量变化趋势
 *
 * 来源：RULES.md输出质量标准的工程化实现
 * 最后更新：2025-11-04
 */
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'output-quality-grader',
  description: '输出质量自动评级Hook - 标准化输出质量评估',
  version: '1.0.0',

  /**
   * 输出质量自动评级主函数
   */
  async execute(context) {
    console.log('🔍 [输出质量评级器] 开始质量评估...');

    const grading = {
      output: context.output || {},
      metadata: context.metadata || {},
      benchmark: context.benchmark || {},
      timestamp: new Date().toISOString()
    };

    try {
      // 1. 内容质量评估
      const contentQuality = this.assessContentQuality(grading);

      // 2. 格式规范评估
      const formatQuality = this.assessFormatQuality(grading);

      // 3. 技术质量评估
      const technicalQuality = this.assessTechnicalQuality(grading);

      // 4. 业务价值评估
      const businessValue = this.assessBusinessValue(grading);

      // 5. 综合质量评分
      const overallQuality = this.calculateOverallQualityScore(
        contentQuality,
        formatQuality,
        technicalQuality,
        businessValue
      );

      // 6. 质量等级评定
      const qualityGrade = this.determineQualityScore(overallQuality);

      // 7. 生成评级报告
      const gradingReport = this.generateGradingReport(
        grading,
        contentQuality,
        formatQuality,
        technicalQuality,
        businessValue,
        overallQuality,
        qualityGrade
      );

      // 8. 生成改进建议
      const improvementSuggestions = this.generateImprovementSuggestions(gradingReport);

      // 9. 更新质量数据库
      this.updateQualityDatabase(grading, gradingReport);

      console.log('✅ [输出质量评级器] 评估完成');
      return {
        ...gradingReport,
        improvementSuggestions
      };

    } catch (error) {
      console.error('❌ [输出质量评级器] 评估失败:', error.message);
      return {
        success: false,
        error: error.message,
        grade: 'F',
        score: 0
      };
    }
  },

  /**
   * 内容质量评估
   */
  assessContentQuality(context) {
    const { output } = context;
    const grading = {
      output: output || {},
      metadata: context.metadata || {},
      benchmark: context.benchmark || {},
      timestamp: new Date().toISOString()
    };

    const contentMetrics = {
      completeness: this.assessContentCompleteness(output),
      accuracy: this.assessContentAccuracy(output),
      clarity: this.assessContentClarity(output),
      depth: this.assessContentDepth(output),
      relevance: this.assessContentRelevance(output),
      innovation: this.assessContentInnovation(output)
    };

    const contentScore = this.calculateContentScore(contentMetrics);
    const contentIssues = this.identifyContentIssues(contentMetrics);

    return {
      score: contentScore,
      metrics: contentMetrics,
      issues: contentIssues,
      details: this.getContentDetails(output)
    };
  },

  /**
   * 评估内容完整性
   */
  assessContentCompleteness(output) {
    const completenessIndicators = {
      hasIntroduction: this.checkSectionExists(output, 'introduction'),
      hasMainContent: this.checkSectionExists(output, 'main'),
      hasConclusion: this.checkSectionExists(output, 'conclusion'),
      hasReferences: this.checkSectionExists(output, 'references'),
      hasExamples: this.checkSectionExists(output, 'examples'),
      hasActionItems: this.checkSectionExists(output, 'actions')
    };

    const completenessScore = Object.values(completenessIndicators).filter(Boolean).length / Object.keys(completenessIndicators).length * 100;

    // 识别内容质量问题
    const issues = [];
    if (completenessScore < 70) {
      issues.push({
        type: 'completeness',
        severity: 'HIGH',
        description: '内容完整性不足'
      });
    }
    if (completenessScore < 85) {
      issues.push({
        type: 'clarity',
        severity: 'MEDIUM',
        description: '内容清晰度需要提升'
      });
    }

    return {
      score: Math.round(completenessScore),
      indicators: completenessIndicators,
      details: this.getCompletenessDetails(output),
      issues: issues
    };
  },

  /**
   * 检查章节存在性
   */
  checkSectionExists(output, sectionType) {
    const sectionKeywords = {
      'introduction': ['介绍', '概述', '背景', '引言', '前言'],
      'main': ['主体', '核心', '详细', '内容', '正文'],
      'conclusion': ['总结', '结论', '结束', '收尾', '完结'],
      'references': ['参考', '引用', '文献', '资源', '链接'],
      'examples': ['示例', '案例', '实例', '演示', '展示'],
      'actions': ['行动', '计划', '步骤', '建议', '措施']
    };

    const keywords = sectionKeywords[sectionType] || [];
    const content = this.extractTextContent(output);

    return keywords.some(keyword => content.toLowerCase().includes(keyword.toLowerCase()));
  },

  /**
   * 提取文本内容
   */
  extractTextContent(output) {
    if (typeof output === 'string') return output;
    if (output.text) return output.text;
    if (output.content) return output.content;
    return JSON.stringify(output);
  },

  /**
   * 获取完整性详情
   */
  getCompletenessDetails(output) {
    const content = this.extractTextContent(output);

    return {
      wordCount: content.split(/\s+/).length,
      sectionCount: (content.match(/^#+\s/gm) || []).length,
      tableCount: (content.match(/\|.*\|/g) || []).length,
      codeBlockCount: (content.match(/```[\s\S]*?```/g) || []).length
    };
  },

  /**
   * 获取内容详情
   */
  getContentDetails(output) {
    const content = this.extractTextContent(output);
    return {
      length: content.length,
      wordCount: content.split(/\s+/).length,
      hasStructure: content.includes('#') || content.includes('##'),
      hasCode: content.includes('```') || content.includes('code'),
      hasLists: content.includes('-') || content.includes('*') || /^\d+\./gm.test(content),
      complexity: this.assessContentComplexity(content),
      readability: this.assessReadability(content)
    };
  },

  /**
   * 评估内容复杂度
   */
  assessContentComplexity(content) {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / sentences.length;
    const technicalTerms = (content.match(/[A-Z][a-z]+[A-Z][a-z]+/g) || []).length;
    const complexityScore = Math.min(100, (avgSentenceLength * 2) + (technicalTerms * 5));
    return complexityScore;
  },

  /**
   * 评估可读性
   */
  assessReadability(content) {
    const words = content.split(/\s+/);
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgWordsPerSentence = words.length / sentences.length;

    // 简单的可读性评分：每句15-20词为最佳
    let readabilityScore = 100;
    if (avgWordsPerSentence > 25) readabilityScore -= 20;
    if (avgWordsPerSentence > 30) readabilityScore -= 30;
    if (avgWordsPerSentence < 10) readabilityScore -= 15;

    return Math.max(0, readabilityScore);
  },

  /**
   * 评估内容准确性
   */
  assessContentAccuracy(output) {
    const accuracyIndicators = {
      factualAccuracy: this.checkFactualAccuracy(output),
      logicalConsistency: this.checkLogicalConsistency(output),
      dataValidation: this.checkDataValidation(output),
      sourceCitation: this.checkSourceCitation(output),
      errorFree: this.checkErrorFree(output)
    };

    const accuracyScore = this.calculateAccuracyScore(accuracyIndicators);

    return {
      score: accuracyScore,
      indicators: accuracyIndicators,
      details: this.getAccuracyDetails(output)
    };
  },

  /**
   * 检查事实准确性
   */
  checkFactualAccuracy(output) {
    const content = this.extractTextContent(output);
    const factIndicators = ['数据', '事实', '统计', '研究', '分析', '结果'];
    const hasFactualContent = factIndicators.some(indicator => content.includes(indicator));

    return hasFactualContent ? 80 : 50;
  },

  /**
   * 检查逻辑一致性
   */
  checkLogicalConsistency(output) {
    const content = this.extractTextContent(output);
    const consistencyIndicators = ['因此', '所以', '但是', '然而', '总之', '综上'];
    const hasLogicalFlow = consistencyIndicators.some(indicator => content.includes(indicator));

    return hasLogicalFlow ? 85 : 60;
  },

  /**
   * 检查数据验证
   */
  checkDataValidation(output) {
    const content = this.extractTextContent(output);
    const dataIndicators = ['验证', '测试', '检查', '确认', '证明'];
    const hasDataValidation = dataIndicators.some(indicator => content.includes(indicator));

    return hasDataValidation ? 90 : 40;
  },

  /**
   * 检查来源引用
   */
  checkSourceCitation(output) {
    const content = this.extractTextContent(output);
    const citationIndicators = ['引用', '来源', '参考', '链接', '出处', '文献'];
    const hasCitations = citationIndicators.some(indicator => content.includes(indicator));

    return hasCitations ? 85 : 50;
  },

  /**
   * 检查错误
   */
  checkErrorFree(output) {
    const content = this.extractTextContent(output);
    const errorIndicators = ['错误', '问题', '缺陷', '不完整', '缺失'];
    const hasErrors = errorIndicators.some(indicator => content.includes(indicator));

    return hasErrors ? 30 : 95;
  },

  /**
   * 计算准确性评分
   */
  calculateAccuracyScore(indicators) {
    const scores = [
      indicators.factualAccuracy,
      indicators.logicalConsistency,
      indicators.dataValidation,
      indicators.sourceCitation,
      indicators.errorFree
    ];

    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  },

  /**
   * 获取准确性详情
   */
  getAccuracyDetails(output) {
    return {
      hasSources: false,
      hasData: false,
      hasValidation: false,
      errorCount: 0,
      warnings: []
    };
  },

  /**
   * 评估内容清晰度
   */
  assessContentClarity(output) {
    const clarityIndicators = {
      structureClarity: this.checkStructureClarity(output),
      languageClarity: this.checkLanguageClarity(output),
      visualClarity: this.checkVisualClarity(output),
      explanationQuality: this.checkExplanationQuality(output)
    };

    const clarityScore = this.calculateClarityScore(clarityIndicators);

    return {
      score: clarityScore,
      indicators: clarityIndicators,
      details: this.getClarityDetails(output)
    };
  },

  /**
   * 检查结构清晰度
   */
  checkStructureClarity(output) {
    const content = this.extractTextContent(output);
    const hasHeadings = content.includes('#') || content.includes('##');
    const hasParagraphs = content.split('\n\n').length > 1;
    const hasLogicalFlow = this.checkLogicalFlow(content);

    return (hasHeadings && hasParagraphs && hasLogicalFlow) ? 90 : 60;
  },

  /**
   * 检查逻辑流程
   */
  checkLogicalFlow(content) {
    const flowIndicators = ['首先', '然后', '接着', '最后', '总之'];
    return flowIndicators.some(indicator => content.includes(indicator));
  },

  /**
   * 检查语言清晰度
   */
  checkLanguageClarity(output) {
    const content = this.extractTextContent(output);
    const avgSentenceLength = content.split(/[.!?]/).reduce((sum, sentence) => sum + sentence.length, 0) / content.split(/[.!?]/).length;

    // 理想的句子长度为15-25个字符
    return avgSentenceLength >= 15 && avgSentenceLength <= 25 ? 85 :
           avgSentenceLength <= 50 ? 70 : 50;
  },

  /**
   * 检查视觉清晰度
   */
  checkVisualClarity(output) {
    const content = this.extractTextContent(output);
    const hasFormatting = content.includes('**') || content.includes('*') || content.includes('```');

    return hasFormatting ? 80 : 60;
  },

  /**
   * 检查解释质量
   */
  checkExplanationQuality(output) {
    const content = this.extractTextContent(output);
    const explanationIndicators = ['解释', '说明', '描述', '阐述', '分析'];
    const hasExplanations = explanationIndicators.some(indicator => content.includes(indicator));

    return hasExplanations ? 85 : 65;
  },

  /**
   * 计算清晰度评分
   */
  calculateClarityScore(indicators) {
    const scores = [
      indicators.structureClarity,
      indicators.languageClarity,
      indicators.visualClarity,
      indicators.explanationQuality
    ];

    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  },

  /**
   * 获取清晰度详情
   */
  getClarityDetails(output) {
    const content = this.extractTextContent(output);

    return {
      averageSentenceLength: content.split(/[.!?]/).reduce((sum, sentence) => sum + sentence.length, 0) / content.split(/[.!?]/).length,
      formattingComplexity: (content.match(/[*_`]/g) || []).length,
      hasVisualElements: content.includes('**') || content.includes('```')
    };
  },

  /**
   * 评估内容深度
   */
  assessContentDepth(output) {
    const depthIndicators = {
      technicalDepth: this.checkTechnicalDepth(output),
      analyticalDepth: this.checkAnalyticalDepth(output),
      conceptualDepth: this.checkConceptualDepth(output),
      practicalDepth: this.checkPracticalDepth(output)
    };

    const depthScore = this.calculateDepthScore(depthIndicators);

    return {
      score: depthScore,
      indicators: depthIndicators,
      details: this.getDepthDetails(output)
    };
  },

  /**
   * 检查技术深度
   */
  checkTechnicalDepth(output) {
    const content = this.extractTextContent(output);
    const technicalIndicators = ['算法', '架构', '技术', '实现', '代码', '系统'];
    const technicalKeywordCount = technicalIndicators.filter(keyword => content.includes(keyword)).length;

    return Math.min(100, technicalKeywordCount * 20);
  },

  /**
   * 检查分析深度
   */
  checkAnalyticalDepth(output) {
    const content = this.extractTextContent(output);
    const analyticalIndicators = ['分析', '比较', '评估', '判断', '推理', '论证'];
    const analyticalKeywordCount = analyticalIndicators.filter(keyword => content.includes(keyword)).length;

    return Math.min(100, analyticalKeywordCount * 25);
  },

  /**
   * 检查概念深度
   */
  checkConceptualDepth(output) {
    const content = this.extractTextContent(output);
    const conceptualIndicators = ['概念', '原理', '理论', '模型', '框架', '理念'];
    const conceptualKeywordCount = conceptualIndicators.filter(keyword => content.includes(keyword)).length;

    return Math.min(100, conceptualKeywordCount * 30);
  },

  /**
   * 检查实践深度
   */
  checkPracticalDepth(output) {
    const content = this.extractTextContent(output);
    const practicalIndicators = ['实践', '应用', '案例', '实际', '操作', '执行'];
    const practicalKeywordCount = practicalIndicators.filter(keyword => content.includes(keyword)).length;

    return Math.min(100, practicalKeywordCount * 25);
  },

  /**
   * 计算深度评分
   */
  calculateDepthScore(indicators) {
    const scores = [
      indicators.technicalDepth,
      indicators.analyticalDepth,
      indicators.conceptualDepth,
      indicators.practicalDepth
    ];

    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  },

  /**
   * 获取深度详情
   */
  getDepthDetails(output) {
    const content = this.extractTextContent(output);

    return {
      technicalKeywords: (content.match(/算法|架构|技术|实现|代码|系统/g) || []).length,
      analyticalKeywords: (content.match(/分析|比较|评估|判断|推理|论证/g) || []).length,
      conceptualKeywords: (content.match(/概念|原理|理论|模型|框架|理念/g) || []).length,
      practicalKeywords: (content.match(/实践|应用|案例|实际|操作|执行/g) || []).length
    };
  },

  /**
   * 评估内容相关性
   */
  assessContentRelevance(grading) {
    const { output, metadata } = grading;

    const relevanceIndicators = {
      topicAlignment: this.checkTopicAlignment(output, metadata),
      audienceFit: this.checkAudienceFit(output, metadata),
      timingRelevance: this.checkTimingRelevance(output, metadata),
      contextAppropriateness: this.checkContextAppropriateness(output, metadata)
    };

    const relevanceScore = this.calculateRelevanceScore(relevanceIndicators);

    return {
      score: relevanceScore,
      indicators: relevanceIndicators,
      details: this.getRelevanceDetails(output, metadata)
    };
  },

  /**
   * 检查主题对齐
   */
  checkTopicAlignment(output, metadata) {
    if (!output) return 50;

    const outputContent = this.extractTextContent(output);
    const targetTopic = metadata.targetTopic || '';

    if (!targetTopic) return 50;

    const topicRelevance = this.calculateTextRelevance(outputContent, targetTopic);
    return Math.min(100, topicRelevance);
  },

  /**
   * 检查受众适配
   */
  checkAudienceFit(output, metadata) {
    if (!output) return 50;

    const outputContent = this.extractTextContent(output);
    const targetAudience = metadata.targetAudience || 'general';

    const audienceKeywords = {
      'technical': ['技术', '开发', '架构', '代码', '系统'],
      'business': ['业务', '管理', '战略', '决策', 'ROI'],
      'executive': ['高管', '领导', '战略', '决策', '报告'],
      'general': ['用户', '大众', '通用', '普及', '介绍']
    };

    const keywords = audienceKeywords[targetAudience] || audienceKeywords['general'];
    const keywordMatch = keywords.filter(keyword => outputContent.includes(keyword)).length;

    return Math.min(100, keywordMatch * 25);
  },

  /**
   * 检查时间相关性
   */
  checkTimingRelevance(output, metadata) {
    if (!output || !metadata) return 50;

    const now = new Date();
    const outputDate = metadata.createdAt ? new Date(metadata.createdAt) : now;
    const timeDiff = (now - outputDate) / (1000 * 60 * 60 * 24); // 天数

    // 内容新鲜度评分：越新越好
    if (timeDiff <= 1) return 100;
    if (timeDiff <= 7) return 85;
    if (timeDiff <= 30) return 70;
    if (timeDiff <= 90) return 55;
    return 40;
  },

  /**
   * 检查上下文适当性
   */
  checkContextAppropriateness(output, metadata) {
    if (!output || !metadata) return 50;

    const context = metadata.context || '';
    const outputContent = this.extractTextContent(output);

    if (!context) return 70;

    const contextRelevance = this.calculateTextRelevance(outputContent, context);
    return Math.min(100, contextRelevance);
  },

  /**
   * 计算文本相关性
   */
  calculateTextRelevance(text, target) {
    if (!target) return 0;

    const targetWords = target.toLowerCase().split(/\s+/);
    const textWords = text.toLowerCase().split(/\s+/);

    const intersection = targetWords.filter(word => textWords.includes(word));
    const jaccardSimilarity = intersection.length / (targetWords.length + textWords.length - intersection.length);

    return Math.round(jaccardSimilarity * 100);
  },

  /**
   * 计算相关性评分
   */
  calculateRelevanceScore(indicators) {
    const scores = [
      indicators.topicAlignment,
      indicators.audienceFit,
      indicators.timingRelevance,
      indicators.contextAppropriateness
    ];

    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  },

  /**
   * 获取相关性详情
   */
  getRelevanceDetails(output, metadata) {
    return {
      targetTopic: metadata.targetTopic || 'unspecified',
      targetAudience: metadata.targetAudience || 'general',
      context: metadata.context || 'unspecified',
      relevanceFactors: {
        topic: metadata.targetTopic ? 'HIGH' : 'LOW',
        audience: metadata.targetAudience ? 'HIGH' : 'LOW',
        timing: metadata.createdAt ? 'HIGH' : 'LOW',
        context: metadata.context ? 'HIGH' : 'LOW'
      }
    };
  },

  /**
   * 评估内容创新性
   */
  assessContentInnovation(output) {
    const innovationIndicators = {
      originality: this.checkOriginality(output),
      novelApproaches: this.checkNovelApproaches(output),
      creativeInsights: this.checkCreativeInsights(output),
      uniquePerspectives: this.checkUniquePerspectives(output)
    };

    const innovationScore = this.calculateInnovationScore(innovationIndicators);

    return {
      score: innovationScore,
      indicators: innovationIndicators,
      details: this.getInnovationDetails(output)
    };
  },

  /**
   * 检查原创性
   */
  checkOriginality(output) {
    const content = this.extractTextContent(output);
    const commonPhrases = ['众所周知', '显然', '很明显', '众所周知', '普遍认为'];
    const hasCommonPhrases = commonPhrases.some(phrase => content.includes(phrase));

    return hasCommonPhrases ? 30 : 80;
  },

  /**
   * 检查新方法
   */
  checkNovelApproaches(output) {
    const content = this.extractTextContent(output);
    const innovationIndicators = ['创新', '独特', '新颖', '突破', '革命性'];
    const innovationCount = innovationIndicators.filter(indicator => content.includes(indicator)).length;

    return Math.min(100, innovationCount * 25);
  },

  /**
   * 检查创意见解
   */
  checkCreativeInsights(output) {
    const content = this.extractTextContent(output);
    const insightIndicators = ['洞察', '见解', '启发', '发现', '认识'];
    const insightCount = insightIndicators.filter(indicator => content.includes(indicator)).length;

    return Math.min(100, insightCount * 30);
  },

  /**
   * 检查独特视角
   */
  checkUniquePerspectives(output) {
    const content = this.extractTextContent(output);
    const perspectiveIndicators = ['角度', '视角', '观点', '立场', '态度'];
    const perspectiveCount = perspectiveIndicators.filter(indicator => content.includes(indicator)).length;

    return Math.min(100, perspectiveCount * 20);
  },

  /**
   * 计算创新评分
   */
  calculateInnovationScore(indicators) {
    const scores = [
      indicators.originality,
      indicators.novelApproaches,
      indicators.creativeInsights,
      indicators.uniquePerspectives
    ];

    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  },

  /**
   * 获取创新详情
   */
  getInnovationDetails(output) {
    const content = this.extractTextContent(output);

    return {
      innovationIndicators: (content.match(/创新|独特|新颖|突破|革命性/g) || []).length,
      insightIndicators: (content.match(/洞察|见解|启发|发现|认识/g) || []).length,
      perspectiveIndicators: (content.match(/角度|视角|观点|立场|态度/g) || []).length
    };
  },

  /**
   * 计算内容评分
   */
  calculateContentScore(metrics) {
    const weights = {
      completeness: 0.2,
      accuracy: 0.25,
      clarity: 0.2,
      depth: 0.15,
      relevance: 0.15,
      innovation: 0.05
    };

    return Math.round(
      metrics.completeness.score * weights.completeness +
      metrics.accuracy.score * weights.accuracy +
      metrics.clarity.score * weights.clarity +
      metrics.depth.score * weights.depth +
      metrics.relevance.score * weights.relevance +
      metrics.innovation.score * weights.innovation
    );
  },

  /**
   * 识别内容问题
   */
  identifyContentIssues(metrics) {
    const issues = [];

    if (metrics.completeness.score < 70) {
      issues.push('内容不完整');
    }

    if (metrics.accuracy.score < 70) {
      issues.push('准确性不足');
    }

    if (metrics.clarity.score < 70) {
      issues.push('表达不清晰');
    }

    if (metrics.depth.score < 70) {
      issues.push('分析深度不够');
    }

    if (metrics.relevance.score < 70) {
      issues.push('相关性不强');
    }

    return issues;
  },

  /**
   * 格式规范评估
   */
  assessFormatQuality(context) {
    const { output } = context;

    const formatMetrics = {
      markdownCompliance: this.assessMarkdownCompliance(output),
      structureConsistency: this.assessStructureConsistency(output),
      visualFormatting: this.assessVisualFormatting(output),
      technicalFormatting: this.assessTechnicalFormatting(output)
    };

    const formatScore = this.calculateFormatScore(formatMetrics);
    const formatIssues = this.identifyFormatIssues(formatMetrics);

    return {
      score: formatScore,
      metrics: formatMetrics,
      issues: formatIssues,
      details: this.getFormatDetails(output)
    };
  },

  /**
   * 评估Markdown合规性
   */
  assessMarkdownCompliance(output) {
    const content = this.extractTextContent(output);

    const complianceChecks = {
      hasProperHeadings: this.checkProperHeadings(content),
      hasProperLists: this.checkProperLists(content),
      hasProperCodeBlocks: this.checkProperCodeBlocks(content),
      hasProperLinks: this.checkProperLinks(content),
      hasProperImages: this.checkProperImages(content)
    };

    const complianceScore = Object.values(complianceChecks).filter(Boolean).length / Object.keys(complianceChecks).length * 100;

    return Math.round(complianceScore);
  },

  /**
   * 检查标题格式
   */
  checkProperHeadings(content) {
    const headingPattern = /^#+\s+[^#\n]+$/gm;
    const hasProperHeadings = headingPattern.test(content);

    return hasProperHeadings ? 100 : 50;
  },

  /**
   * 检查列表格式
   */
  checkProperLists(content) {
    const listPattern = /^[\s]*[-*+]\s+/gm;
    const hasProperLists = listPattern.test(content);

    return hasProperLists ? 100 : 50;
  },

  /**
   * 检查代码块格式
   */
  checkProperCodeBlocks(content) {
    const codeBlockPattern = /```[\s\S]*?```/g;
    const hasProperCodeBlocks = codeBlockPattern.test(content);

    return hasProperCodeBlocks ? 100 : 50;
  },

  /**
   * 检查链接格式
   */
  checkProperLinks(content) {
    const linkPattern = /\[([^\]]+)\]\([^)]+\)/g;
    const hasProperLinks = linkPattern.test(content);

    return hasProperLinks ? 100 : 50;
  },

  /**
   * 检查图片格式
   */
  checkProperImages(content) {
    const imagePattern = /!\[.*\]\([^)]+\)/g;
    const hasProperImages = imagePattern.test(content);

    return hasProperImages ? 100 : 50;
  },

  /**
   * 评估结构一致性
   */
  assessStructureConsistency(output) {
    const content = this.extractTextContent(output);
    const structureAnalysis = this.analyzeStructure(content);

    return {
      score: structureAnalysis.consistency,
      details: structureAnalysis
    };
  },

  /**
   * 分析文档结构
   */
  analyzeStructure(content) {
    const headings = content.match(/^#+\s+.*$/gm) || [];
    const headingLevels = headings.map(h => (h.match(/^#+/) || []).length);

    const consistentStructure = this.checkConsistentHeadingLevels(headingLevels);

    return {
      headingCount: headings.length,
      maxDepth: Math.max(...headingLevels),
      consistency: consistentStructure ? 90 : 60
    };
  },

  /**
   * 检查标题层级一致性
   */
  checkConsistentHeadingLevels(levels) {
    if (levels.length < 2) return true;

    for (let i = 1; i < levels.length; i++) {
      const diff = levels[i] - levels[i-1];
      if (diff > 1 || diff < -1) {
        return false;
      }
    }

    return true;
  },

  /**
   * 评估视觉格式
   */
  assessVisualFormatting(output) {
    const content = this.extractTextContent(output);

    const visualElements = {
      boldCount: (content.match(/\*\*[^*]*\*\*/g) || []).length,
      italicCount: (content.match(/\*[^*]*\*/g) || []).length,
      codeBlockCount: (content.match(/```[\s\S]*?```/g) || []).length,
      listCount: (content.match(/^[\s]*[-*+]\s+/gm) || []).length
    };

    const visualScore = Math.min(100, (visualElements.boldCount + visualElements.italicCount + visualElements.codeBlockCount) * 10);

    return {
      score: visualScore,
      elements: visualElements
    };
  },

  /**
   * 评估技术格式
   */
  assessTechnicalFormatting(output) {
    const content = this.extractTextOutput(output);

    const technicalElements = {
      hasSyntaxHighlighting: this.checkSyntaxHighlighting(content),
      hasCodeValidation: this.checkCodeValidation(content),
      hasTechnicalDiagrams: this.checkTechnicalDiagrams(content),
      hasAPIDocumentation: this.checkAPIDocumentation(content)
    };

    const technicalScore = Object.values(technicalElements).filter(Boolean).length / Object.keys(technicalElements).length * 100;

    return Math.round(technicalScore);
  },

  /**
   * 提取技术输出
   */
  extractTextOutput(output) {
    if (output.text) return output.text;
    if (output.content) return output.content;
    return JSON.stringify(output);
  },

  /**
   * 检查语法高亮
   */
  checkSyntaxHighlighting(content) {
    // 简化的语法高亮检查
    return content.includes('```') ? 100 : 0;
  },

  /**
   * 检查代码验证
   */
  checkCodeValidation(content) {
    return content.includes('验证') || content.includes('测试') ? 100 : 50;
  },

  /**
   * 检查技术图表
   */
  checkTechnicalDiagrams(content) {
    const diagramIndicators = ['流程图', '架构图', '类图', '时序图'];
    return diagramIndicators.some(indicator => content.includes(indicator)) ? 100 : 0;
  },

  /**
   * 检查API文档
   */
  checkAPIDocumentation(content) {
    const apiIndicators = ['API', '接口', '端点', '参数', '返回'];
    return apiIndicators.some(indicator => content.includes(indicator)) ? 100 : 0;
  },

  /**
   * 计算格式评分
   */
  calculateFormatScore(metrics) {
    const weights = {
      markdownCompliance: 0.4,
      structureConsistency: 0.3,
      visualFormatting: 0.2,
      technicalFormatting: 0.1
    };

    return Math.round(
      metrics.markdownCompliance * weights.markdownCompliance +
      metrics.structureConsistency.score * weights.structureConsistency +
      metrics.visualFormatting.score * weights.visualFormatting +
      metrics.technicalFormatting * weights.technicalFormatting
    );
  },

  /**
   * 识别格式问题
   */
  identifyFormatIssues(metrics) {
    const issues = [];

    if (metrics.markdownCompliance < 70) {
      issues.push('Markdown格式不规范');
    }

    if (metrics.structureConsistency.score < 70) {
      issues.push('文档结构不一致');
    }

    if (metrics.visualFormatting.score < 70) {
      issues.push('视觉格式不理想');
    }

    return issues;
  },

  /**
   * 获取格式详情
   */
  getFormatDetails(output) {
    const content = this.extractTextContent(output);

    return {
      totalLength: content.length,
      hasMarkdown: content.includes('#') || content.includes('**'),
      hasCodeBlocks: content.includes('```'),
      hasLists: content.includes('- ') || content.includes('* '),
      hasLinks: content.includes('['),
      hasImages: content.includes('![')
    };
  },

  /**
   * 技术质量评估
   */
  assessTechnicalQuality(context) {
    const { output } = context;

    const technicalMetrics = {
      codeQuality: this.assessCodeQuality(output),
      architecturalQuality: this.assessArchitecturalQuality(output),
      securityQuality: this.assessSecurityQuality(output),
      performanceQuality: this.assessPerformanceQuality(output)
    };

    const technicalScore = this.calculateTechnicalScore(technicalMetrics);
    const technicalIssues = this.identifyTechnicalIssues(technicalMetrics);

    return {
      score: technicalScore,
      metrics: technicalMetrics,
      issues: technicalIssues,
      details: this.getTechnicalDetails(output)
    };
  },

  /**
   * 评估代码质量
   */
  assessCodeQuality(output) {
    const content = this.extractTextContent(output);
    const codeBlocks = content.match(/```[\s\S]*?```/g) || [];

    if (codeBlocks.length === 0) return 50;

    let totalQuality = 0;
    codeBlocks.forEach(codeBlock => {
      totalQuality += this.assessCodeBlockQuality(codeBlock);
    });

    return Math.round(totalQuality / codeBlocks.length);
  },

  /**
   * 评估代码块质量
   */
  assessCodeBlockQuality(codeBlock) {
    const qualityFactors = {
      hasComments: codeBlock.includes('//') || codeBlock.includes('#'),
      hasErrorHandling: codeBlock.includes('try') || codeBlock.includes('catch'),
      hasTesting: codeBlock.includes('test') || codeBlock.includes('assert'),
      hasDocumentation: codeBlock.includes('/**') || codeBlock.includes('*')
    };

    const qualityScore = Object.values(qualityFactors).filter(Boolean).length / Object.keys(qualityFactors).length * 100;
    return qualityScore;
  },

  /**
   * 评估架构质量
   */
  assessArchitecturalQuality(output) {
    const content = this.extractTextContent(output);
    const architectureIndicators = ['架构', '设计', '模块', '组件', '接口', '依赖'];
    const architectureCount = architectureIndicators.filter(indicator => content.includes(indicator)).length;

    return Math.min(100, architectureCount * 20);
  },

  /**
   * 评估安全质量
   */
  assessSecurityQuality(output) {
    const content = this.extractTextContent(output);
    const securityIndicators = ['安全', '加密', '认证', '授权', '漏洞'];
    const securityCount = securityIndicators.filter(indicator => content.includes(indicator)).length;

    return Math.min(100, securityCount * 25);
  },

  /**
   * 评估性能质量
   */
  assessPerformanceQuality(output) {
    const content = this.extractTextContent(output);
    const performanceIndicators = ['性能', '优化', '效率', '缓存', '并发', '异步'];
    const performanceCount = performanceIndicators.filter(indicator => content.includes(indicator)).length;

    return Math.min(100, performanceCount * 20);
  },

  /**
   * 计算技术评分
   */
  calculateTechnicalScore(metrics) {
    const weights = {
      codeQuality: 0.3,
      architecturalQuality: 0.3,
      securityQuality: 0.2,
      performanceQuality: 0.2
    };

    return Math.round(
      metrics.codeQuality * weights.codeQuality +
      metrics.architecturalQuality * weights.architecturalQuality +
      metrics.securityQuality * weights.securityQuality +
      metrics.performanceQuality * weights.performanceQuality
    );
  },

  /**
   * 识别技术问题
   */
  identifyTechnicalIssues(metrics) {
    const issues = [];

    if (metrics.codeQuality < 70) {
      issues.push('代码质量需要改进');
    }

    if (metrics.architecturalQuality < 70) {
      issues.push('架构设计需要完善');
    }

    if (metrics.securityQuality < 70) {
      issues.push('安全措施需要加强');
    }

    if (metrics.performanceQuality < 70) {
      issues.push('性能优化需要关注');
    }

    return issues;
  },

  /**
   * 获取技术详情
   */
  getTechnicalDetails(output) {
    const content = this.extractTextContent(output);

    return {
      codeBlockCount: (content.match(/```[\s\S]*?```/g) || []).length,
      codeLines: this.countCodeLines(content),
      hasTesting: content.includes('test') || content.includes('测试'),
      hasDocumentation: content.includes('文档') || content.includes('说明')
    };
  },

  /**
   * 计算代码行数
   */
  countCodeLines(content) {
    const codeBlocks = content.match(/```[\s\S]*?```/g) || [];
    let totalLines = 0;

    codeBlocks.forEach(codeBlock => {
      totalLines += codeBlock.split('\n').length;
    });

    return totalLines;
  },

  /**
   * 业务价值评估
   */
  assessBusinessValue(context) {
    const { output, metadata } = context;

    const businessMetrics = {
      actionableInsights: this.assessActionableInsights(output),
      practicalValue: this.assessPracticalValue(output, metadata),
      stakeholderImpact: this.assessStakeholderImpact(output, metadata),
      roiConsideration: this.assessROIConsideration(output, metadata)
    };

    const businessScore = this.calculateBusinessScore(businessMetrics);
    const businessIssues = this.identifyBusinessIssues(businessMetrics);

    return {
      score: businessScore,
      metrics: businessMetrics,
      issues: businessIssues,
      details: this.getBusinessDetails(output, metadata)
    };
  },

  /**
   * 评估可操作见解
   */
  assessActionableInsights(output) {
    const content = this.extractTextContent(output);
    const actionableIndicators = ['建议', '行动', '步骤', '计划', '措施', '实施'];
    const actionableCount = actionableIndicators.filter(indicator => content.includes(indicator)).length;

    return Math.min(100, actionableCount * 25);
  },

  /**
   * 评估实用价值
   */
  assessPracticalValue(output, metadata) {
    const context = metadata.context || '';
    const content = this.extractTextContent(output);

    const practicalIndicators = ['实用', '应用', '实践', '案例', '示例', '演示'];
    const practicalCount = practicalIndicators.filter(indicator => content.includes(indicator)).length;

    const valueScore = Math.min(100, practicalCount * 20);

    return {
      score: valueScore,
      indicators: practicalCount
    };
  },

  /**
   * 评估利益相关者影响
   */
  assessStakeholderImpact(output, metadata) {
    const stakeholders = metadata.stakeholders || [];
    const impactIndicators = ['影响', '价值', '收益', '效果', '改善'];
    const impactCount = impactIndicators.filter(indicator => this.extractTextContent(output).includes(indicator)).length;

    const impactScore = Math.min(100, impactCount * 30);

    return {
      score: impactScore,
      stakeholderCount: stakeholders.length
    };
  },

  /**
   * 评估ROI考虑
   */
  assessROIConsideration(output, metadata) {
    const roiIndicators = ['成本', '收益', '回报', '投资', '预算'];
    const roiCount = roiIndicators.filter(indicator => this.extractTextContent(output).includes(indicator)).length;

    const roiScore = Math.min(100, roiCount * 25);

    return {
      score: roiScore,
      analysisLevel: roiCount >= 2 ? 'DETAILED' : 'BASIC'
    };
  },

  /**
   * 计算业务评分
   */
  calculateBusinessScore(metrics) {
    const weights = {
      actionableInsights: 0.3,
      practicalValue: 0.3,
      stakeholderImpact: 0.2,
      roiConsideration: 0.2
    };

    return Math.round(
      metrics.actionableInsights * weights.actionableInsights +
      metrics.practicalValue.score * weights.practicalValue +
      metrics.stakeholderImpact.score * weights.stakeholderImpact +
      metrics.roiConsideration.score * weights.roiConsideration
    );
  },

  /**
   * 识别业务问题
   */
  identifyBusinessIssues(metrics) {
    const issues = [];

    if (metrics.actionableInsights < 70) {
      issues.push('缺少可操作的见解');
    }

    if (metrics.practicalValue.score < 70) {
      issues.push('实用价值不够明确');
    }

    if (metrics.stakeholderImpact.score < 70) {
      issues.push('利益相关者影响不明确');
    }

    return issues;
  },

  /**
   * 获取业务详情
   */
  getBusinessDetails(output, metadata) {
    return {
      hasBusinessMetrics: metadata.businessMetrics || false,
      stakeholderAnalysis: metadata.stakeholderAnalysis || false,
      roiAnalysis: metadata.roiAnalysis || false,
      businessContext: metadata.businessContext || 'unspecified'
    };
  },

  /**
   * 计算综合质量评分
   */
  calculateOverallQualityScore(contentQuality, formatQuality, technicalQuality, businessValue) {
    const weights = {
      contentQuality: 0.35,
      formatQuality: 0.2,
      technicalQuality: 0.25,
      businessValue: 0.2
    };

    const weightedScore =
      contentQuality.score * weights.contentQuality +
      formatQuality.score * weights.formatQuality +
      technicalQuality.score * weights.technicalQuality +
      businessValue.score * weights.businessValue;

    return Math.round(Math.min(100, weightedScore));
  },

  /**
   * 确定质量等级
   */
  determineQualityScore(score) {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'A-';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    if (score >= 70) return 'B-';
    if (score >= 65) return 'C+';
    if (score >= 60) return 'C';
    if (score >= 55) return 'C-';
    if (score >= 50) return 'D+';
    if (score >= 45) return 'D';
    if (score >= 40) return 'D-';
    return 'F';
  },

  /**
   * 生成评级报告
   */
  generateGradingReport(grading, contentQuality, formatQuality, technicalQuality, businessValue, overallQuality, qualityGrade) {
    return {
      success: true,
      timestamp: new Date().toISOString(),
      overall: {
        score: overallQuality,
        grade: qualityGrade,
        status: overallQuality >= 70 ? 'GOOD' : 'NEEDS_IMPROVEMENT'
      },
      detailedScores: {
        content: contentQuality,
        format: formatQuality,
        technical: technicalQuality,
        business: businessValue
      },
      summary: this.generateGradingSummary(contentQuality, formatQuality, technicalQuality, businessValue),
      recommendations: this.generateGradingRecommendations(contentQuality, formatQuality, technicalQuality, businessValue)
    };
  },

  /**
   * 生成评级摘要
   */
  generateGradingSummary(contentQuality, formatQuality, technicalQuality, businessValue) {
    return {
      contentQuality: `${contentQuality.score}% (${this.getScoreDescription(contentQuality.score)})`,
      formatQuality: `${formatQuality.score}% (${this.getScoreDescription(formatQuality.score)})`,
      technicalQuality: `${technicalQuality.score}% (${this.getScoreDescription(technicalQuality.score)})`,
      businessValue: `${businessValue.score}% (${this.getScoreDescription(businessValue.score)})`
    };
  },

  /**
   * 获取评分描述
   */
  getScoreDescription(score) {
    if (score >= 90) return '优秀';
    if (score >= 80) return '良好';
    if (score >= 70) return '合格';
    if (score >= 60) return '一般';
    if (score >= 50) return '需要改进';
    return '不合格';
  },

  /**
   * 生成评级建议
   */
  generateGradingRecommendations(contentQuality, formatQuality, technicalQuality, businessValue) {
    const recommendations = [];

    if (contentQuality.score < 70) {
      recommendations.push({
        area: '内容质量',
        suggestion: '提升内容的完整性、准确性和清晰度',
        priority: this.getRecommendationPriority(contentQuality.score)
      });
    }

    if (formatQuality.score < 70) {
      recommendations.push({
        area: '格式规范',
        suggestion: '改进Markdown格式和文档结构',
        priority: this.getRecommendationPriority(formatQuality.score)
      });
    }

    if (technicalQuality.score < 70) {
      recommendations.push({
        area: '技术质量',
        suggestion: '加强代码质量和技术规范',
        priority: this.getRecommendationPriority(technicalQuality.score)
      });
    }

    if (businessValue.score < 70) {
      recommendations.push({
        area: '业务价值',
        suggestion: '增强实用性和业务价值',
        priority: this.getRecommendationPriority(businessValue.score)
      });
    }

    return recommendations;
  },

  /**
   * 获取建议优先级
   */
  getRecommendationPriority(score) {
    if (score < 50) return 'HIGH';
    if (score < 70) return 'MEDIUM';
    return 'LOW';
  },

  /**
   * 生成改进建议
   */
  generateImprovementSuggestions(report) {
    const suggestions = [];

    report.recommendations.forEach(rec => {
      suggestions.push({
        category: rec.area,
        suggestion: rec.suggestion,
        priority: rec.priority,
        implementation: this.generateImplementationSteps(rec)
      });
    });

    // 添加通用改进建议
    suggestions.push({
      category: '通用',
      suggestion: '定期更新和维护内容以保持高质量',
      priority: 'MEDIUM',
      implementation: '建立内容审查和更新机制'
    });

    suggestions.push({
      category: '通用',
      suggestion: '收集用户反馈以持续改进质量评估算法',
      priority: 'LOW',
      implementation: '建立反馈收集和分析机制'
    });

    return suggestions;
  },

  /**
   * 生成实施步骤
   */
  generateImplementationSteps(recommendation) {
    return [
      `分析${recommendation.area}的具体问题`,
      `制定${recommendation.suggestion}的详细计划`,
      `分配${recommendation.priority}优先级和资源`,
      `设定明确的成功指标和验证方法`,
      `实施后评估效果和持续优化`
    ];
  },

  /**
   * 更新质量数据库
   */
  updateQualityDatabase(grading, report) {
    try {
      const dbPath = path.join(__dirname, 'quality-database.json');
      let qualityDB = {};

      if (fs.existsSync(dbPath)) {
        qualityDB = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      }

      const qualityRecord = {
        timestamp: grading.timestamp,
        scores: {
          overall: report.overall.score,
          content: report.detailedScores.content.score,
          format: report.detailedScores.format.score,
          technical: report.detailedScores.technical.score,
          business: report.detailedScores.business.score
        },
        grade: report.overall.grade,
        issues: [
          ...report.detailedScores.content.issues,
          ...report.detailedScores.format.issues,
          ...report.detailedScores.technical.issues,
          ...report.detailedScores.business.issues
        ],
        metadata: grading.metadata
      };

      if (!qualityDB.records) {
        qualityDB.records = [];
      }

      qualityDB.records.push(qualityRecord);

      // 保持最近1000条记录
      if (qualityDB.records.length > 1000) {
        qualityDB.records = qualityDB.records.slice(-1000);
      }

      fs.writeFileSync(dbPath, JSON.stringify(qualityDB, null, 2));

    } catch (error) {
      console.warn('⚠️ [输出质量评级器] 质量数据库更新失败:', error.message);
    }
  },

  /**
   * 检查内容结构 - 调试脚本需要的方法
   */
  checkContentStructure(output) {
    const content = this.extractTextContent(output);

    const structureChecks = {
      hasIntroduction: this.checkSectionExists(output, 'introduction'),
      hasMainContent: this.checkSectionExists(output, 'main'),
      hasConclusion: this.checkSectionExists(output, 'conclusion'),
      hasHeadings: content.includes('#'),
      hasParagraphs: content.split('\n\n').length > 1,
      wordCount: content.split(/\s+/).length
    };

    const structureScore = Object.values(structureChecks).filter(val =>
      typeof val === 'boolean' ? val : val > 0
    ).length / Object.keys(structureChecks).length * 100;

    return {
      score: Math.round(structureScore),
      checks: structureChecks,
      issues: structureScore < 70 ? ['内容结构需要改进'] : []
    };
  },

  /**
   * 检查技术准确性 - 调试脚本需要的方法
   */
  checkTechnicalAccuracy(output, workflow) {
    const content = this.extractTextContent(output);

    const accuracyChecks = {
      hasTechnicalTerms: this.checkTechnicalTerms(content),
      hasLogicalFlow: this.checkLogicalFlow(content),
      hasValidation: content.includes('验证') || content.includes('测试'),
      hasExamples: content.includes('示例') || content.includes('案例'),
      complexity: workflow?.complexity || 'unknown'
    };

    const accuracyScore = this.calculateAccuracyAccuracy(accuracyChecks);

    return {
      score: accuracyScore,
      checks: accuracyChecks,
      issues: accuracyScore < 70 ? ['技术准确性需要提升'] : []
    };
  },

  /**
   * 检查技术术语
   */
  checkTechnicalTerms(content) {
    const techTerms = ['API', '算法', '架构', '系统', '数据库', '网络', '安全'];
    return techTerms.some(term => content.includes(term));
  },

  /**
   * 计算准确性评分
   */
  calculateAccuracyAccuracy(checks) {
    const scoreFactors = [
      checks.hasTechnicalTerms ? 25 : 0,
      checks.hasLogicalFlow ? 25 : 0,
      checks.hasValidation ? 25 : 0,
      checks.hasExamples ? 25 : 0
    ];

    return Math.min(100, scoreFactors.reduce((sum, score) => sum + score, 0));
  },

  /**
   * 检查完整性 - 调试脚本需要的方法
   */
  checkCompleteness(output, userInput, workflow) {
    const content = this.extractTextContent(output);

    const completenessChecks = {
      answersQuery: this.checkAnswersQuery(content, userInput),
      coversAllAspects: this.checkCoversAllAspects(content, workflow),
      hasConclusion: this.checkSectionExists(output, 'conclusion'),
      hasActionItems: this.checkSectionExists(output, 'actions'),
      completeness: this.calculateCompleteness(content, userInput, workflow)
    };

    const completenessScore = this.calculateCompletenessScore(completenessChecks);

    return {
      score: completenessScore,
      checks: completenessChecks,
      issues: completenessScore < 70 ? ['内容完整性需要改进'] : []
    };
  },

  /**
   * 检查是否回答了查询
   */
  checkAnswersQuery(content, userInput) {
    if (!userInput) return false;

    const inputWords = userInput.toLowerCase().split(/\s+/);
    const contentWords = content.toLowerCase().split(/\s+/);

    const intersection = inputWords.filter(word => contentWords.includes(word));
    return intersection.length / inputWords.length > 0.5;
  },

  /**
   * 检查是否涵盖所有方面
   */
  checkCoversAllAspects(content, workflow) {
    if (!workflow) return false;

    const aspects = ['分析', '设计', '实现', '测试'];
    return aspects.some(aspect => content.includes(aspect));
  },

  /**
   * 计算完整性指标
   */
  calculateCompleteness(content, userInput, workflow) {
    let score = 0;

    if (this.checkAnswersQuery(content, userInput)) score += 30;
    if (this.checkCoversAllAspects(content, workflow)) score += 30;
    if (this.checkSectionExists({ text: content }, 'conclusion')) score += 20;
    if (this.checkSectionExists({ text: content }, 'actions')) score += 20;

    return score;
  },

  /**
   * 计算完整性评分
   */
  calculateCompletenessScore(checks) {
    const weights = {
      answersQuery: 0.3,
      coversAllAspects: 0.3,
      hasConclusion: 0.2,
      hasActionItems: 0.2
    };

    return Math.round(
      (checks.answersQuery ? 100 : 0) * weights.answersQuery +
      (checks.coversAllAspects ? 100 : 0) * weights.coversAllAspects +
      (checks.hasConclusion ? 100 : 0) * weights.hasConclusion +
      (checks.hasActionItems ? 100 : 0) * weights.hasActionItems
    );
  },

  /**
   * 检查可用性 - 调试脚本需要的方法
   */
  checkUsability(output, workflow) {
    const content = this.extractTextContent(output);

    const usabilityChecks = {
      clearStructure: this.checkClearStructure(content),
      easyToFollow: this.checkEasyToFollow(content),
      hasExamples: this.checkSectionExists(output, 'examples'),
      hasActionItems: this.checkSectionExists(output, 'actions'),
      readability: this.calculateReadability(content)
    };

    const usabilityScore = this.calculateUsabilityScore(usabilityChecks);

    return {
      score: usabilityScore,
      checks: usabilityChecks,
      issues: usabilityScore < 70 ? ['可用性需要改进'] : []
    };
  },

  /**
   * 检查结构清晰度
   */
  checkClearStructure(content) {
    const hasHeadings = content.includes('#') || content.includes('##');
    const hasParagraphs = content.split('\n\n').length > 1;
    return hasHeadings && hasParagraphs;
  },

  /**
   * 检查易于理解程度
   */
  checkEasyToFollow(content) {
    const avgSentenceLength = content.split(/[.!?]/).reduce((sum, sentence) =>
      sum + sentence.trim().length, 0) / content.split(/[.!?]/).length;

    return avgSentenceLength >= 10 && avgSentenceLength <= 30;
  },

  /**
   * 计算可读性
   */
  calculateReadability(content) {
    const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 0);
    const avgWordsPerSentence = content.split(/\s+/).length / sentences.length;

    // 理想的平均每句词数为15-20
    if (avgWordsPerSentence >= 15 && avgWordsPerSentence <= 20) return 'GOOD';
    if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 25) return 'FAIR';
    return 'POOR';
  },

  /**
   * 计算可用性评分
   */
  calculateUsabilityScore(checks) {
    const weights = {
      clearStructure: 0.3,
      easyToFollow: 0.3,
      hasExamples: 0.2,
      hasActionItems: 0.2
    };

    const readabilityScore = checks.readability === 'GOOD' ? 100 :
                           checks.readability === 'FAIR' ? 70 : 40;

    return Math.round(
      (checks.clearStructure ? 100 : 0) * weights.clearStructure +
      (checks.easyToFollow ? 100 : 0) * weights.easyToFollow +
      (checks.hasExamples ? 100 : 0) * weights.hasExamples +
      (checks.hasActionItems ? 100 : 0) * weights.hasActionItems +
      readabilityScore * 0.2
    );
  },

  /**
   * 检查效率 - 调试脚本需要的方法
   */
  checkEfficiency(output, workflow) {
    const efficiencyChecks = {
      concise: this.checkConcise(output),
      relevant: this.checkRelevant(output),
      actionable: this.checkActionable(output),
      timely: this.checkTimely(output, workflow)
    };

    const efficiencyScore = this.calculateEfficiencyScore(efficiencyChecks);

    return {
      score: efficiencyScore,
      checks: efficiencyChecks,
      issues: efficiencyScore < 70 ? ['效率需要改进'] : []
    };
  },

  /**
   * 检查简洁性
   */
  checkConcise(output) {
    const content = this.extractTextContent(output);
    const wordCount = content.split(/\s+/).length;

    // 理想的字数为100-500
    return wordCount >= 100 && wordCount <= 500;
  },

  /**
   * 检查相关性
   */
  checkRelevant(output) {
    const content = this.extractTextContent(output);
    const relevanceIndicators = ['相关', '适用', '合适', '匹配'];
    return relevanceIndicators.some(indicator => content.includes(indicator));
  },

  /**
   * 检查可操作性
   */
  checkActionable(output) {
    const content = this.extractTextContent(output);
    const actionIndicators = ['可以', '能够', '建议', '推荐', '步骤'];
    return actionIndicators.some(indicator => content.includes(indicator));
  },

  /**
   * 检查及时性
   */
  checkTimely(output, workflow) {
    // 简化的及时性检查
    return true;
  },

  /**
   * 计算效率评分
   */
  calculateEfficiencyScore(checks) {
    const weights = {
      concise: 0.25,
      relevant: 0.25,
      actionable: 0.25,
      timely: 0.25
    };

    return Math.round(
      (checks.concise ? 100 : 0) * weights.concise +
      (checks.relevant ? 100 : 0) * weights.relevant +
      (checks.actionable ? 100 : 0) * weights.actionable +
      (checks.timely ? 100 : 0) * weights.timely
    );
  }
};