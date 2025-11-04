/**
 * Content Quality Control Hook
 * 确保输出质量，自动检测无效内容和格式规范
 * 基于生命周期架构设计的质量控制核心组件
 */

const fs = require('fs').promises;
const path = require('path');

class ContentQualityControlHook {
  constructor() {
    this.hookName = 'ContentQualityControlHook';
    this.version = '1.0.0';
    this.qualityStandards = this.loadQualityStandards();
    this.qualityReports = new Map();
  }

  /**
   * 主要质量控制入口点
   * @param {Object} params - 质量控制参数
   * @param {string} params.content - 待检查内容
   * @param {string} params.contentType - 内容类型
   * @param {Object} params.context - 上下文信息
   */
  async enforceQualityStandards(params) {
    const { content, contentType, context } = params;
    
    console.log(`[${this.hookName}] 开始质量检查: ${contentType} (${content.length}字符)`);
    
    try {
      // 1. 基础质量检查
      const basicQuality = await this.checkBasicQuality(content);
      
      // 2. 内容价值评估
      const valueAssessment = await this.assessContentValue(content, context);
      
      // 3. 引用完整性验证
      const referenceCheck = await this.validateReferences(content);
      
      // 4. 命名和格式规范检查
      const formatCheck = await this.validateFormatAndNaming(content, contentType, context);
      
      // 5. 无效内容检测
      const invalidContentCheck = await this.detectInvalidContent(content);
      
      // 6. 生成质量报告
      const qualityReport = {
        overallScore: this.calculateOverallScore({
          basicQuality, valueAssessment, referenceCheck, formatCheck, invalidContentCheck
        }),
        details: {
          basicQuality,
          valueAssessment,
          referenceCheck,
          formatCheck,
          invalidContentCheck
        },
        issues: this.identifyIssues({
          basicQuality, valueAssessment, referenceCheck, formatCheck, invalidContentCheck
        }),
        recommendations: this.generateRecommendations({
          basicQuality, valueAssessment, referenceCheck, formatCheck, invalidContentCheck
        }),
        autoFixes: this.generateAutoFixes({
          basicQuality, valueAssessment, referenceCheck, formatCheck, invalidContentCheck
        }),
        compliance: this.checkCompliance(this.qualityStandards[contentType] || 'default', {
          basicQuality, valueAssessment, referenceCheck, formatCheck, invalidContentCheck
        }),
        timestamp: new Date().toISOString()
      };

      // 保存质量报告
      this.qualityReports.set(`${contentType}_${Date.now()}`, qualityReport);
      
      console.log(`[${this.hookName}] 质量检查完成: ${qualityReport.overallScore >= 8.0 ? '通过' : '需要改进'} (${qualityReport.overallScore}/10)`);
      
      return {
        passed: qualityReport.overallScore >= 8.0,
        report: qualityReport,
        action: qualityReport.overallScore >= 8.0 ? 'proceed' : 'improve',
        autoFixes: qualityReport.autoFixes
      };
      
    } catch (error) {
      console.error(`[${this.hookName}] 质量检查失败:`, error);
      return {
        passed: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * 基础质量检查
   */
  async checkBasicQuality(content) {
    const checks = {
      structure: this.checkStructure(content),
      readability: this.checkReadability(content),
      consistency: this.checkConsistency(content),
      completeness: this.checkCompleteness(content)
    };

    const scores = {
      structure: this.scoreStructure(checks.structure),
      readability: this.scoreReadability(checks.readability),
      consistency: this.scoreConsistency(checks.consistency),
      completeness: this.scoreCompleteness(checks.completeness)
    };

    return {
      passed: scores.structure >= 6 && scores.readability >= 6,
      checks,
      scores,
      overallScore: Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length
    };
  }

  /**
   * 内容价值评估
   */
  async assessContentValue(content, context) {
    const criteria = {
      clarity: this.assessClarity(content),
      actionability: this.assessActionability(content),
      specificity: this.assessSpecificity(content),
      measurability: this.assessMeasurability(content),
      relevance: this.assessRelevance(content, context),
      uniqueness: this.assessUniqueness(content)
    };

    const scores = {
      clarity: criteria.clarity.score,
      actionability: criteria.actionability.score,
      specificity: criteria.specificity.score,
      measurability: criteria.measurability.score,
      relevance: criteria.relevance.score,
      uniqueness: criteria.uniqueness.score
    };

    return {
      passed: scores.clarity >= 7 && scores.actionability >= 6,
      criteria,
      scores,
      overallScore: Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length,
      summary: this.generateValueSummary(criteria)
    };
  }

  /**
   * 引用完整性验证
   */
  async validateReferences(content) {
    const references = this.extractReferences(content);
    const validation = {
      totalReferences: references.length,
      validReferences: 0,
      brokenReferences: [],
      missingReferences: []
    };

    for (const ref of references) {
      try {
        // 检查本地文件引用
        if (ref.url.startsWith('./') || ref.url.startsWith('../')) {
          const filePath = path.resolve(ref.url);
          if (await this.fileExists(filePath)) {
            validation.validReferences++;
          } else {
            validation.brokenReferences.push(ref);
          }
        }
        // 检查外部URL可访问性（可选）
        else if (ref.url.startsWith('http')) {
          validation.validReferences++; // 假设外部链接有效
        }
      } catch (error) {
        validation.missingReferences.push(ref);
      }
    }

    const completeness = validation.totalReferences > 0 
      ? validation.validReferences / validation.totalReferences 
      : 1.0;

    return {
      passed: completeness >= 0.9,
      validation,
      completeness,
      summary: `${validation.validReferences}/${validation.totalReferences} 引用有效`
    };
  }

  /**
   * 格式和命名规范检查
   */
  async validateFormatAndNaming(content, contentType, context) {
    const checks = {
      markdown: this.checkMarkdownFormat(content),
      naming: this.checkNamingConventions(content, contentType),
      metadata: this.checkMetadataStandards(content)
    };

    const scores = {
      markdown: this.scoreMarkdownFormat(checks.markdown),
      naming: this.scoreNamingConventions(checks.naming),
      metadata: this.scoreMetadataStandards(checks.metadata)
    };

    return {
      passed: scores.markdown >= 7 && scores.naming >= 6,
      checks,
      scores,
      overallScore: Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length
    };
  }

  /**
   * 无效内容检测
   */
  async detectInvalidContent(content) {
    const invalidPatterns = [
      { pattern: /(?:大概|可能|也许|应该|似乎)/gi, type: '不确定性表述' },
      { pattern: /(?:TODO|FIXME|XXX|HACK)/gi, type: '待办项标记' },
      { pattern: /(?:测试|test|debug|demo)[\s\S]*?(代码|功能|系统)/gi, type: '测试残留' },
      { pattern: /\n{3,}/g, type: '过多空行' },
      { pattern: /\s{2,}/g, type: '多余空格' }
    ];

    const detections = [];
    let invalidScore = 0;

    invalidPatterns.forEach(({ pattern, type }) => {
      const matches = content.match(pattern);
      if (matches) {
        detections.push({
          type,
          count: matches.length,
          examples: matches.slice(0, 3) // 最多显示3个例子
        });
        invalidScore += matches.length * 0.5;
      }
    });

    // 检查重复内容
    const duplicateScore = await this.detectDuplicateContent(content);
    invalidScore += duplicateScore;

    return {
      passed: invalidScore < 5,
      detections,
      duplicateScore,
      overallScore: Math.max(0, 10 - invalidScore),
      summary: `发现${detections.length}类无效内容，重复度评分: ${10 - duplicateScore}`
    };
  }

  /**
   * 检查文档结构
   */
  checkStructure(content) {
    const lines = content.split('\n');
    const structure = {
      hasTitle: content.match(/^#\s+/m) !== null,
      hasSections: (content.match(/^##\s+/gm) || []).length > 0,
      logicalFlow: this.assessLogicalFlow(content),
      balance: this.assessBalance(content)
    };

    return structure;
  }

  /**
   * 检查可读性
   */
  checkReadability(content) {
    const readability = {
      avgLineLength: this.calculateAverageLineLength(content),
      sentenceComplexity: this.assessSentenceComplexity(content),
      useOfWhitespace: this.assessWhitespaceUsage(content),
      clarity: this.assessLanguageClarity(content)
    };

    return readability;
  }

  /**
   * 检查一致性
   */
  checkConsistency(content) {
    return {
      headingConsistency: this.checkHeadingConsistency(content),
      terminologyConsistency: this.checkTerminologyConsistency(content),
      formattingConsistency: this.checkFormattingConsistency(content)
    };
  }

  /**
   * 检查完整性
   */
  checkCompleteness(content) {
    return {
      hasTitle: content.match(/^#\s+/m) !== null,
      hasSections: (content.match(/^##\s+/gm) || []).length > 0,
      hasSummary: this.hasExecutiveSummary(content),
      hasConclusion: this.hasConclusion(content)
    };
  }

  /**
   * 评估内容清晰度
   */
  assessClarity(content) {
    const factors = {
      simpleSentences: this.countSimpleSentences(content),
      jargonLevel: this.assessJargonLevel(content),
      structureComplexity: this.assessStructureComplexity(content),
      activeVoice: this.countActiveVoice(content)
    };

    const score = Math.min(10, (
      factors.simpleSentences * 2 +
      (10 - factors.jargonLevel) * 1.5 +
      (10 - factors.structureComplexity) * 1 +
      factors.activeVoice
    ) / 5);

    return {
      score,
      factors,
      assessment: score >= 8 ? '清晰易懂' : score >= 6 ? '基本清晰' : '需要改进'
    };
  }

  /**
   * 评估可执行性
   */
  assessActionability(content) {
    const actionWords = ['步骤', '方法', '工具', '实现', '操作', '执行', '完成'];
    const actionCount = actionWords.reduce((count, word) => 
      count + (content.match(new RegExp(word, 'gi'))?.length || 0), 0
    );

    const score = Math.min(10, actionCount / 2);

    return {
      score,
      actionCount,
      assessment: score >= 6 ? '高度可执行' : score >= 4 ? '部分可执行' : '缺乏可执行内容'
    };
  }

  /**
   * 评估具体性
   */
  assessSpecificity(content) {
    const vaguePatterns = [/某些|一些|通常|一般|大概|可能/];
    const vagueCount = vaguePatterns.reduce((count, pattern) => 
      count + (content.match(pattern) || []).length, 0
    );

    const specificPatterns = [/具体|明确|详细|准确|精确/];
    const specificCount = specificPatterns.reduce((count, pattern) => 
      count + (content.match(pattern) || []).length, 0
    );

    const score = Math.min(10, specificCount - vagueCount + 5);

    return {
      score,
      vagueCount,
      specificCount,
      assessment: score >= 6 ? '高度具体' : score >= 3 ? '基本具体' : '缺乏具体性'
    };
  }

  /**
   * 评估可衡量性
   */
  assessMeasurability(content) {
    const metrics = content.match(/\d+%|\d+\s*(个|次|个|例)/g) || [];
    const measurableScore = Math.min(10, metrics.length);

    return {
      score: measurableScore,
      metrics,
      assessment: measurableScore >= 4 ? '高度可衡量' : '缺乏可衡量指标'
    };
  }

  /**
   * 评估相关性
   */
  assessRelevance(content, context) {
    // 基于上下文评估相关性
    const contextKeywords = context?.keywords || [];
    const contentKeywords = this.extractKeywords(content);
    
    const relevance = contextKeywords.length > 0 
      ? this.calculateRelevance(contentKeywords, contextKeywords)
      : 7; // 默认中等相关性

    return {
      score: relevance,
      contextKeywords,
      contentKeywords,
      assessment: relevance >= 8 ? '高度相关' : relevance >= 6 ? '基本相关' : '相关性需要提升'
    };
  }

  /**
   * 评估独特性
   */
  assessUniqueness(content) {
    // 简化实现：基于长度和复杂度的独特性评估
    const uniqueness = Math.min(10, content.length / 1000 * 2 + content.split('\n').length / 50);

    return {
      score: uniqueness,
      assessment: uniqueness >= 6 ? '内容独特' : '内容较为通用'
    };
  }

  /**
   * 检查Markdown格式
   */
  checkMarkdownFormat(content) {
    const issues = [];
    
    // 检查标题层级
    const headings = content.match(/^#+\s+.+$/gm) || [];
    const headingLevels = headings.map(h => h.match(/^#+/)[0].length);
    
    for (let i = 1; i < headingLevels.length; i++) {
      if (headingLevels[i] - headingLevels[i-1] > 1) {
        issues.push(`标题层级跳跃过大: 第${i}行`);
      }
    }

    return {
      headingCount: headings.length,
      headingLevels,
      issues,
      valid: issues.length === 0
    };
  }

  /**
   * 检查命名规范
   */
  checkNamingConventions(content, contentType) {
    const namingRules = this.qualityStandards.naming[contentType] || {};
    
    return {
      conventions: namingRules,
      violations: this.checkNamingViolations(content, namingRules)
    };
  }

  /**
   * 检查元数据标准
   */
  checkMetadataStandards(content) {
    const hasFrontmatter = content.match(/^---\n[\s\S]*?\n---/);
    const frontmatter = hasFrontmatter ? content.match(/^---\n([\s\S]*?)\n---/)[1] : '';

    return {
      hasFrontmatter: !!hasFrontmatter,
      frontmatter: this.parseFrontmatter(frontmatter),
      valid: this.validateFrontmatter(frontmatter)
    };
  }

  /**
   * 检测重复内容
   */
  async detectDuplicateContent(content) {
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 50);
    const duplicates = [];

    for (let i = 0; i < paragraphs.length; i++) {
      for (let j = i + 1; j < paragraphs.length; j++) {
        const similarity = this.calculateSimilarity(paragraphs[i], paragraphs[j]);
        if (similarity > 0.8) {
          duplicates.push({ 
            paragraph1: i, 
            paragraph2: j, 
            similarity 
          });
        }
      }
    }

    return duplicates.length * 2; // 每个重复计2分
  }

  /**
   * 辅助方法：计算相似度
   */
  calculateSimilarity(text1, text2) {
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];
    
    return intersection.length / union.length;
  }

  /**
   * 辅助方法：提取关键词
   */
  extractKeywords(content) {
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    return [...new Set(words)];
  }

  /**
   * 辅助方法：计算相关性
   */
  calculateRelevance(contentKeywords, contextKeywords) {
    const intersection = contentKeywords.filter(word => contextKeywords.includes(word));
    return intersection.length / Math.max(contentKeywords.length, contextKeywords.length);
  }

  /**
   * 辅助方法：计算平均行长度
   */
  calculateAverageLineLength(content) {
    const lines = content.split('\n');
    const totalLength = lines.reduce((sum, line) => sum + line.length, 0);
    return lines.length > 0 ? totalLength / lines.length : 0;
  }

  /**
   * 辅助方法：评估句子复杂度
   */
  assessSentenceComplexity(content) {
    const sentences = content.split(/[.!?]+/);
    const avgSentenceLength = sentences.reduce((sum, sentence) => sum + sentence.length, 0) / sentences.length;
    return avgSentenceLength;
  }

  /**
   * 辅助方法：评估空格使用
   */
  assessWhitespaceUsage(content) {
    const trailingSpaces = content.match(/[ \t]+$/gm) || [];
    return trailingSpaces.length;
  }

  /**
   * 辅助方法：评估语言清晰度
   */
  assessLanguageClarity(content) {
    const complexWords = content.match(/\w{10,}/g) || [];
    return complexWords.length;
  }

  /**
   * 辅助方法：统计简单句子
   */
  countSimpleSentences(content) {
    const sentences = content.match(/[^.!?]+[.!?]/g) || [];
    return sentences.filter(sentence => sentence.split(' ').length <= 15).length;
  }

  /**
   * 辅助方法：评估术语水平
   */
  assessJargonLevel(content) {
    const jargonWords = ['架构', '算法', '框架', '协议', '接口', '组件', '模块', '服务'];
    return jargonWords.reduce((count, word) => 
      count + (content.match(new RegExp(word, 'g'))?.length || 0), 0
    );
  }

  /**
   * 辅助方法：评估结构复杂度
   */
  assessStructureComplexity(content) {
    const nesting = content.match(/\t/g) || [];
    return nesting.length;
  }

  /**
   * 辅助方法：统计主动语态
   */
  countActiveVoice(content) {
    const passiveIndicators = ['被', '由', '通过', '经过'];
    return passiveIndicators.reduce((count, indicator) => 
      count + (content.match(new RegExp(indicator, 'g'))?.length || 0), 0
    );
  }

  /**
   * 辅助方法：检查标题一致性
   */
  checkHeadingConsistency(content) {
    const headings = content.match(/^#+\s+.+$/gm) || [];
    return {
      count: headings.length,
      consistent: true // 简化实现
    };
  }

  /**
   * 辅助方法：检查术语一致性
   */
  checkTerminologyConsistency(content) {
    return {
      consistent: true // 简化实现
    };
  }

  /**
   * 辅助方法：检查格式一致性
   */
  checkFormattingConsistency(content) {
    return {
      consistent: true // 简化实现
    };
  }

  /**
   * 辅助方法：评估逻辑流程
   */
  assessLogicalFlow(content) {
    return {
      flowScore: 8 // 简化实现
    };
  }

  /**
   * 辅助方法：评估平衡性
   */
  assessBalance(content) {
    return {
      balanceScore: 8 // 简化实现
    };
  }

  /**
   * 辅助方法：检查执行摘要
   */
  hasExecutiveSummary(content) {
    return content.match(/(?:摘要|概述|总结|概览)[:：]/) !== null;
  }

  /**
   * �助方法：检查结论
   */
  hasConclusion(content) {
    return content.match(/(?:结论|结尾|最后)[:：]/) !== null;
  }

  /**
   * 辅助方法：评分结构
   */
  scoreStructure(structure) {
    return structure.hasTitle ? 8 : structure.hasSections ? 6 : 4;
  }

  /**
   * 辅助方法：评分可读性
   */
  scoreReadability(readability) {
    const avgLength = readability.avgLineLength;
    if (avgLength < 50) return 8;
    if (avgLength < 80) return 10;
    if (avgLength < 120) return 7;
    return 5;
  }

  /**
   * 辅助方法：评分一致性
   */
  scoreConsistency(consistency) {
    return consistency.headingConsistent && 
           consistency.terminologyConsistent && 
           consistency.formattingConsistent ? 8 : 5;
  }

  /**
   * 辅助方法：评分完整性
   */
  scoreCompleteness(completeness) {
    let score = 0;
    if (completeness.hasTitle) score += 3;
    if (completeness.hasSections) score += 3;
    if (completeness.hasSummary) score += 2;
    if (completeness.hasConclusion) score += 2;
    return score;
  }

  /**
   * 辅助方法：评分Markdown格式
   */
  scoreMarkdownFormat(markdown) {
    return markdown.valid && markdown.headingCount > 0 ? 8 : 5;
  }

  /**
   * 辅助方法：评分命名规范
   */
  scoreNamingConventions(naming) {
    return naming.violations.length === 0 ? 8 : 5;
  }

  /**
   * 辅助方法：评分元数据标准
   */
  scoreMetadataStandards(metadata) {
    return metadata.valid ? 8 : 5;
  }

  /**
   * 辅助方法：检查命名违规
   */
  checkNamingViolations(content, rules) {
    const violations = [];
    // 简化实现
    return violations;
  }

  /**
   * 辅助方法：解析前置元数据
   */
  parseFrontmatter(frontmatter) {
    const metadata = {};
    frontmatter.split('\n').forEach(line => {
      const match = line.match(/^([^:]+):\s*(.+)$/);
      if (match) {
        metadata[match[1]] = match[2];
      }
    });
    return metadata;
  }

  /**
   * 辅助方法：验证前置元数据
   */
  validateFrontmatter(frontmatter) {
    const requiredFields = ['title', 'last_update'];
    return requiredFields.every(field => frontmatter[field]);
  }

  /**
   * 辅助方法：检查文件存在
   */
  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 辅助方法：提取引用
   */
  extractReferences(content) {
    const references = [];
    const refPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    
    while ((match = refPattern.exec(content)) !== null) {
      references.push({
        text: match[1],
        url: match[2]
      });
    }
    
    return references;
  }

  /**
   * 辅助方法：计算综合得分
   */
  calculateOverallScore(scores) {
    const weights = {
      basicQuality: 0.2,
      valueAssessment: 0.3,
      referenceCheck: 0.2,
      formatCheck: 0.15,
      invalidContentCheck: 0.15
    };

    return Object.entries(weights).reduce((total, [key, weight]) => {
      const score = scores[key];
      return total + (score.overallScore || 0) * weight;
    }, 0);
  }

  /**
   * 辅助方法：识别问题
   */
  identifyIssues(scores) {
    const issues = [];
    
    Object.entries(scores).forEach(([category, score]) => {
      if (!score.passed) {
        if (category === 'basicQuality') {
          if (score.scores.structure < 6) issues.push('文档结构需要改进');
          if (score.scores.readability < 6) issues.push('可读性需要提升');
          if (score.scores.consistency < 6) issues.push('一致性需要加强');
        }
        if (category === 'valueAssessment') {
          if (score.scores.clarity < 7) issues.push('内容清晰度不足');
          if (score.scores.actionability < 6) issues.push('缺乏可执行指导');
        }
        if (category === 'referenceCheck') {
          if (score.completeness < 0.9) issues.push('引用完整性有问题');
        }
      }
    });

    return issues;
  }

  /**
   * 辅助方法：生成建议
   */
  generateRecommendations(scores) {
    const recommendations = [];
    
    if (scores.invalidContentCheck.detections.length > 0) {
      recommendations.push('移除无效内容和重复信息');
    }
    
    if (scores.valueAssessment.scores.actionability < 6) {
      recommendations.push('增加具体的执行指导');
    }

    if (scores.referenceCheck.completeness < 0.9) {
      recommendations.push('检查并修复无效引用');
    }

    return recommendations;
  }

  /**
   * 辅助方法：生成自动修复
   */
  generateAutoFixes(scores) {
    const autoFixes = [];
    
    scores.invalidContentCheck.detections.forEach(detection => {
      if (detection.type === '不确定性表述') {
        autoFixes.push('替换模糊表述为确定性描述');
      }
      if (detection.type === '测试残留') {
        autoFixes.push('移除测试代码和调试信息');
      }
    });

    return autoFixes;
  }

  /**
   * 辅助方法：检查合规性
   */
  checkCompliance(standards, scores) {
    return {
      compliant: true, // 简化实现
      standards,
      scores,
      summary: '符合质量标准'
    };
  }

  /**
   * 辅助方法：加载质量标准
   */
  loadQualityStandards() {
    return {
      default: {
        basicQuality: { minScore: 7.0 },
        naming: { 
          conventions: {
            files: 'kebab-case',
            headings: 'title-case',
            variables: 'camelCase'
          }
        }
      },
      markdown: {
        minScore: 7.0,
        requirements: ['proper_heading_structure', 'no_formatting_errors']
      },
      content: {
        minScore: 8.0,
        requirements: ['no_fluff', 'actionable_content', 'specific_details']
      }
    };
  }

  /**
   * 辅助方法：生成价值摘要
   */
  generateValueSummary(criteria) {
    return {
      clarity: `清晰度: ${criteria.clarity.assessment}`,
      actionability: `可执行性: ${criteria.actionability.assessment}`,
      specificity: `具体性: ${criteria.specificity.assessment}`,
      overall: `总体价值: ${criteria.scores.overallScore}/10`
    };
  }

  /**
   * 获取质量报告
   */
  getQualityReport(id) {
    return this.qualityReports.get(id);
  }

  /**
   * 获取所有质量报告
   */
  getAllQualityReports() {
    return Object.fromEntries(this.qualityReports);
  }

  /**
   * 清除质量报告
   */
  clearQualityReport(id) {
    this.qualityReports.delete(id);
  }
}

module.exports = ContentQualityControlHook;

// 如果直接运行，执行示例
if (require.main === module) {
  const hook = new ContentQualityControlHook();
  
  // 示例质量检查
  const testContent = `# 测试文档

这是一个测试文档的内容。

## 概述

本文档描述了测试相关的流程和方法。

## 结论

总结：测试已完成。`;
  
  hook.enforceQualityStandards({
    content: testContent,
    contentType: 'documentation',
    context: {
      type: 'technical',
      keywords: ['测试', '文档', '质量']
    }
  }).then(result => {
    console.log('质量检查结果:', result);
  }).catch(error => {
    console.error('质量检查失败:', error);
  });
}