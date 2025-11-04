/**
 * 内容质量门控Hook
 * 确保生成的内容符合质量标准，避免废话和无效内容
 */

class ContentQualityHook {
  constructor() {
    this.name = 'content-quality-hook';
    this.version = '1.0.0';
    this.description = '内容质量验证和过滤系统';

    // 质量评估权重
    this.weights = {
      clarity: 0.25,      // 清晰度
      value: 0.30,        // 价值密度
      completeness: 0.20,  // 完整性
      structure: 0.15,    // 结构性
      readability: 0.10   // 可读性
    };

    // 无效内容检测模式
    this.invalidPatterns = {
      emptyContent: /^\s*$/,
      onlyTemplates: /^#+\s*(?:模板|template|template)/i,
      fillerWords: /(?:可以说|那么|然后|也就是说|换句话说|总的来说|基本上|其实|可能|大概|似乎|好像|应该|通常|一般|往往|大概|基本上|实际上|事实上|实际上)/gi,
      redundantPhrases: /(?:重复来说|再次强调|需要说明的是|值得一提的是|值得注意的是|需要指出的是)/gi,
      weakStatements: /(?:可能需要|可以考虑|也许应该|或许可以|可能有助于|可能会有助于|或许有助于)/gi,
      meaninglessContent: /(?:这是一个很好的|这是一个重要的|这是一个关键的|这是一个必要的)/gi
    };
  }

  /**
   * 验证内容质量
   * @param {string} content - 内容文本
   * @param {Object} context - 上下文信息
   * @returns {Object} 质量验证结果
   */
  async validateContent(content, context = {}) {
    const result = {
      overallScore: 0,
      passed: false,
      qualityMetrics: {},
      issues: [],
      suggestions: [],
      shouldFilter: false,
      analysis: {}
    };

    try {
      // 1. 基础内容检查
      const basicCheck = this.performBasicContentCheck(content);
      result.analysis.basic = basicCheck;

      // 2. 质量指标评估
      const qualityMetrics = this.assessQualityMetrics(content, context);
      result.qualityMetrics = qualityMetrics;

      // 3. 无效内容检测
      const invalidContentCheck = this.detectInvalidContent(content);
      result.analysis.invalid = invalidContentCheck;

      // 4. 计算综合质量分数
      result.overallScore = this.calculateOverallScore(qualityMetrics);

      // 5. 生成质量问题和建议
      const qualityIssues = this.identifyQualityIssues(content, qualityMetrics, invalidContentCheck);
      result.issues = qualityIssues.issues;
      result.suggestions = qualityIssues.suggestions;

      // 6. 判断是否需要过滤
      result.shouldFilter = this.shouldFilterContent(result.overallScore, invalidContentCheck, basicCheck);

      // 7. 最终质量判断
      result.passed = result.overallScore >= 0.6 && !result.shouldFilter;

      return result;
    } catch (error) {
      throw new Error(`内容质量验证失败: ${error.message}`);
    }
  }

  /**
   * 执行基础内容检查
   */
  performBasicContentCheck(content) {
    return {
      isEmpty: this.isEmptyContent(content),
      isTooShort: this.isTooShort(content),
      isTooLong: this.isTooLong(content),
      hasMeaningfulContent: this.hasMeaningfulContent(content),
      hasStructuredContent: this.hasStructuredContent(content),
      wordCount: this.countWords(content),
      lineCount: this.countLines(content),
      characterCount: content.length
    };
  }

  /**
   * 评估质量指标
   */
  assessQualityMetrics(content, context) {
    return {
      clarity: this.assessClarity(content),
      value: this.assessValue(content, context),
      completeness: this.assessCompleteness(content, context),
      structure: this.assessStructure(content),
      readability: this.assessReadability(content)
    };
  }

  /**
   * 检测无效内容
   */
  detectInvalidContent(content) {
    const detections = {
      hasEmptyContent: this.invalidPatterns.emptyContent.test(content),
      hasOnlyTemplates: this.invalidPatterns.onlyTemplates.test(content),
      fillerWordCount: this.countFillerWords(content),
      redundantPhraseCount: this.countRedundantPhrases(content),
      weakStatementCount: this.countWeakStatements(content),
      meaninglessContentCount: this.countMeaninglessContent(content),
      hasTooMuchFiller: false,
      hasTooManyWeakStatements: false,
      hasMeaninglessContent: false
    };

    // 计算填充词密度
    const totalWords = this.countWords(content);
    const fillerDensity = detections.fillerWordCount / totalWords;
    detections.hasTooMuchFiller = fillerDensity > 0.15; // 超过15%的填充词

    // 计算弱陈述密度
    const weakStatementDensity = detections.weakStatementCount / totalWords;
    detections.hasTooManyWeakStatements = weakStatementDensity > 0.10; // 超过10%的弱陈述

    // 检测无意义内容
    detections.hasMeaninglessContent = detections.meaninglessContentCount > 0;

    return detections;
  }

  /**
   * 计算综合质量分数
   */
  calculateOverallScore(metrics) {
    let totalScore = 0;
    let totalWeight = 0;

    for (const [metric, score] of Object.entries(metrics)) {
      if (this.weights[metric] !== undefined) {
        totalScore += score * this.weights[metric];
        totalWeight += this.weights[metric];
      }
    }

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  /**
   * 识别质量问题和建议
   */
  identifyQualityIssues(content, metrics, invalidCheck) {
    const issues = [];
    const suggestions = [];

    // 基础内容问题
    if (invalidCheck.hasEmptyContent) {
      issues.push('内容为空');
      suggestions.push('请提供有意义的内容');
    }

    if (invalidCheck.hasOnlyTemplates) {
      issues.push('内容只包含模板标题');
      suggestions.push('请填充具体的分析内容和解决方案');
    }

    // 质量指标问题
    if (metrics.clarity < 0.6) {
      issues.push('内容清晰度不足');
      suggestions.push('请使用更简洁明确的语言表达思想');
    }

    if (metrics.value < 0.5) {
      issues.push('内容价值密度低');
      suggestions.push('请增加具体的分析、洞察和可操作建议');
    }

    if (metrics.completeness < 0.6) {
      issues.push('内容不完整');
      suggestions.push('请补充缺失的关键信息和分析');
    }

    if (metrics.structure < 0.5) {
      issues.push('内容结构混乱');
      suggestions.push('请使用清晰的标题层次和逻辑结构');
    }

    // 无效内容问题
    if (invalidCheck.hasTooMuchFiller) {
      issues.push('填充词过多，影响内容价值');
      suggestions.push('请减少填充词，直接表达核心观点');
    }

    if (invalidCheck.hasTooManyWeakStatements) {
      issues.push('弱陈述过多，缺乏决断性');
      suggestions.push('请使用更确定和有力的表达方式');
    }

    if (invalidCheck.hasMeaninglessContent) {
      issues.push('包含无意义的内容表述');
      suggestions.push('请确保每个句子都有实际的信息价值');
    }

    return { issues, suggestions };
  }

  /**
   * 判断是否应该过滤内容
   */
  shouldFilterContent(overallScore, invalidCheck, basicCheck) {
    // 明确的过滤条件
    const filterConditions = [
      basicCheck.isEmpty,
      basicCheck.isTooShort,
      overallScore < 0.4,
      invalidCheck.hasOnlyTemplates,
      invalidCheck.hasTooMuchFiller && overallScore < 0.5,
      invalidCheck.hasTooManyWeakStatements && overallScore < 0.5
    ];

    return filterConditions.some(condition => condition);
  }

  /**
   * 内容改进建议
   */
  async improveContent(content, context = {}) {
    const validation = await this.validateContent(content, context);

    if (validation.passed) {
      return {
        success: true,
        originalContent: content,
        improvedContent: content,
        changes: [],
        message: '内容质量良好，无需改进'
      };
    }

    let improvedContent = content;
    const changes = [];

    // 应用改进建议
    for (const suggestion of validation.suggestions) {
      const improvement = await this.applyImprovement(improvedContent, suggestion, context);
      if (improvement.changed) {
        improvedContent = improvement.content;
        changes.push(improvement.change);
      }
    }

    // 验证改进后的内容
    const improvedValidation = await this.validateContent(improvedContent, context);

    return {
      success: improvedValidation.passed,
      originalContent: content,
      improvedContent,
      changes,
      originalScore: validation.overallScore,
      improvedScore: improvedValidation.overallScore,
      message: improvedValidation.passed ?
        `内容质量已提升，分数从 ${validation.overallScore.toFixed(2)} 提升到 ${improvedValidation.overallScore.toFixed(2)}` :
        `内容质量有所提升，但仍需进一步优化。当前分数: ${improvedValidation.overallScore.toFixed(2)}`
    };
  }

  /**
   * 应用具体改进
   */
  async applyImprovement(content, suggestion, context) {
    const improvements = {
      '请减少填充词，直接表达核心观点': () => this.removeFillerWords(content),
      '请使用更确定和有力的表达方式': () => this.strengthenStatements(content),
      '请使用更简洁明确的语言表达思想': () => this.improveClarity(content),
      '请增加具体的分析、洞察和可操作建议': () => this.addValue(content, context),
      '请使用清晰的标题层次和逻辑结构': () => this.improveStructure(content),
      '请确保每个句子都有实际的信息价值': () => this.removeMeaninglessContent(content)
    };

    const improvementFunction = improvements[suggestion];
    if (improvementFunction) {
      const result = improvementFunction();
      return result;
    }

    return { changed: false, change: null };
  }

  /**
   * 移除填充词
   */
  removeFillerWords(content) {
    const fillerWords = [
      '可以说', '那么', '然后', '也就是说', '换句话说', '总的来说', '基本上',
      '其实', '可能', '大概', '似乎', '好像', '应该', '通常', '一般', '往往'
    ];

    let improvedContent = content;
    for (const filler of fillerWords) {
      const regex = new RegExp(`\\s*${filler}\\s*`, 'gi');
      improvedContent = improvedContent.replace(regex, ' ');
    }

    // 清理多余空格
    improvedContent = improvedContent.replace(/\s+/g, ' ').trim();

    return {
      changed: improvedContent !== content,
      content: improvedContent,
      change: { type: 'remove_filler_words', description: '移除填充词' }
    };
  }

  /**
   * 强化陈述
   */
  strengthenStatements(content) {
    const weakPatterns = [
      { pattern: /可能需要/g, replacement: '需要' },
      { pattern: /可以考虑/g, replacement: '考虑' },
      { pattern: /也许应该/g, replacement: '应该' },
      { pattern: /或许可以/g, replacement: '可以' },
      { pattern: /可能有助于/g, replacement: '有助于' }
    ];

    let improvedContent = content;
    const changes = [];

    for (const { pattern, replacement } of weakPatterns) {
      if (pattern.test(improvedContent)) {
        improvedContent = improvedContent.replace(pattern, replacement);
        changes.push({ type: 'strengthen_statement', pattern, replacement });
      }
    }

    return {
      changed: changes.length > 0,
      content: improvedContent,
      change: changes[0] || null
    };
  }

  /**
   * 改进清晰度
   */
  improveClarity(content) {
    // 分解长句子，改进表达清晰度
    const sentences = content.split(/[.!?]+/);
    let improvedContent = '';

    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (trimmed.length > 0) {
        // 如果句子太长，尝试分解
        if (trimmed.length > 100) {
          const parts = trimmed.split(/[,;]+/);
          improvedContent += parts.join('。') + '。';
        } else {
          improvedContent += trimmed + '。';
        }
      }
    }

    return {
      changed: improvedContent !== content,
      content: improvedContent,
      change: { type: 'improve_clarity', description: '改进表达清晰度' }
    };
  }

  /**
   * 增加价值
   */
  addValue(content, context) {
    // 基于上下文添加价值内容
    let improvedContent = content;

    // 如果内容过于简单，添加深度分析提示
    if (this.countWords(content) < 50) {
      improvedContent += '\n\n**深度分析建议：**\n';
      improvedContent += '- 请提供具体的背景信息\n';
      improvedContent += '- 分析问题的关键因素\n';
      improvedContent += '- 提出可执行的解决方案\n';
    }

    return {
      changed: improvedContent !== content,
      content: improvedContent,
      change: { type: 'add_value', description: '增加深度分析建议' }
    };
  }

  /**
   * 改进结构
   */
  improveStructure(content) {
    let improvedContent = content;

    // 确保有适当的标题结构
    if (!content.includes('#') && content.length > 200) {
      // 为长内容添加标题
      improvedContent = `# 内容摘要\n\n${improvedContent}`;
    }

    return {
      changed: improvedContent !== content,
      content: improvedContent,
      change: { type: 'improve_structure', description: '改进内容结构' }
    };
  }

  /**
   * 移除无意义内容
   */
  removeMeaninglessContent(content) {
    const meaninglessPatterns = [
      '这是一个很好的',
      '这是一个重要的',
      '这是一个关键的',
      '这是一个必要的'
    ];

    let improvedContent = content;
    for (const pattern of meaninglessPatterns) {
      const regex = new RegExp(pattern, 'gi');
      improvedContent = improvedContent.replace(regex, '');
    }

    // 清理多余的空行和空格
    improvedContent = improvedContent.replace(/\n\s*\n\s*\n/g, '\n\n').trim();

    return {
      changed: improvedContent !== content,
      content: improvedContent,
      change: { type: 'remove_meaningless_content', description: '移除无意义内容' }
    };
  }

  // 辅助方法
  isEmptyContent(content) {
    return content.trim().length === 0;
  }

  isTooShort(content) {
    return this.countWords(content) < 10;
  }

  isTooLong(content) {
    return this.countWords(content) > 5000;
  }

  hasMeaningfulContent(content) {
    // 检查是否包含有意义的内容词汇
    const meaningfulWords = [
      '分析', '解决', '方案', '策略', '方法', '问题', '原因', '结果',
      '建议', '步骤', '流程', '系统', '数据', '信息', '知识', '技能'
    ];

    return meaningfulWords.some(word =>
      content.toLowerCase().includes(word.toLowerCase())
    );
  }

  hasStructuredContent(content) {
    return content.includes('#') || content.includes('-') || content.includes('*');
  }

  countWords(content) {
    return content.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  countLines(content) {
    return content.split('\n').length;
  }

  assessClarity(content) {
    // 基于句子长度和复杂性评估清晰度
    const sentences = content.split(/[.!?]+/);
    const avgSentenceLength = sentences.reduce((sum, sentence) =>
      sum + sentence.trim().split(/\s+/).length, 0) / sentences.length;

    // 理想句子长度为15-25词
    const clarityScore = Math.max(0, 1 - Math.abs(avgSentenceLength - 20) / 20);
    return Math.round(clarityScore * 100) / 100;
  }

  assessValue(content, context) {
    // 基于信息密度和价值词汇评估价值
    const valueWords = [
      '分析', '解决', '方案', '策略', '方法', '问题', '原因', '结果',
      '建议', '步骤', '流程', '系统', '数据', '信息', '知识', '技能',
      '优化', '改进', '提升', '效率', '质量', '效果', '影响', '价值'
    ];

    const valueWordCount = valueWords.filter(word =>
      content.toLowerCase().includes(word.toLowerCase())
    ).length;

    const totalWords = this.countWords(content);
    const valueDensity = totalWords > 0 ? valueWordCount / totalWords : 0;

    return Math.round(valueDensity * 100) / 100;
  }

  assessCompleteness(content, context) {
    // 基于内容结构评估完整性
    const structureElements = [
      content.includes('#') ? 1 : 0,      // 有标题
      content.includes('##') ? 1 : 0,    // 有子标题
      content.includes('-') ? 1 : 0,      // 有列表
      content.includes('**') ? 1 : 0     // 有强调
    ];

    const completenessScore = structureElements.reduce((sum, element) => sum + element, 0) / 4;
    return Math.round(completenessScore * 100) / 100;
  }

  assessStructure(content) {
    // 基于逻辑结构评估结构性
    const structureScore = this.assessCompleteness(content, {});
    return Math.round(structureScore * 100) / 100;
  }

  assessReadability(content) {
    // 基于简单指标评估可读性
    const avgWordLength = content.split(/\s+/).reduce((sum, word) =>
      sum + word.length, 0) / this.countWords(content);

    // 理想平均词长为4-6字符
    const readabilityScore = Math.max(0, 1 - Math.abs(avgWordLength - 5) / 5);
    return Math.round(readabilityScore * 100) / 100;
  }

  countFillerWords(content) {
    return (content.match(this.invalidPatterns.fillerWords) || []).length;
  }

  countRedundantPhrases(content) {
    return (content.match(this.invalidPatterns.redundantPhrases) || []).length;
  }

  countWeakStatements(content) {
    return (content.match(this.invalidPatterns.weakStatements) || []).length;
  }

  countMeaninglessContent(content) {
    return (content.match(this.invalidPatterns.meaninglessContent) || []).length;
  }
}

module.exports = ContentQualityHook;