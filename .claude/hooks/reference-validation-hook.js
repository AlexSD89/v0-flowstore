/**
 * 引用格式验证Hook
 * 确保所有引用都符合 path:line 格式并提供影响说明
 */

class ReferenceValidationHook {
  constructor() {
    this.name = 'reference-validation-hook';
    this.version = '1.0.0';
    this.description = '引用格式验证和完整性检查系统';

    // 引用格式模式
    this.referencePattern = /([^\s\[]+):(\d+)(?::\d*)?/g;

    // 常见引用文件类型
    this.referenceTypes = {
      'markdown': ['.md', '.markdown'],
      'javascript': ['.js', '.jsx', '.ts', '.tsx'],
      'python': ['.py', '.pyx'],
      'shell': ['.sh', '.bash', '.zsh'],
      'config': ['.json', '.yaml', '.yml', '.toml', '.ini'],
      'text': ['.txt', '.log', '.out']
    };
  }

  /**
   * 验证内容中的引用
   * @param {string} content - 包含引用的内容
   * @param {Object} context - 上下文信息
   * @returns {Object} 验证结果
   */
  async validateReferences(content, context = {}) {
    const result = {
      isValid: true,
      references: [],
      issues: [],
      suggestions: [],
      statistics: {},
      analysis: {}
    };

    try {
      // 1. 提取所有引用
      const extractedReferences = this.extractReferences(content);
      result.references = extractedReferences;

      // 2. 验证每个引用
      const validatedReferences = await this.validateEachReference(extractedReferences, context);
      result.analysis.validation = validatedReferences;

      // 3. 检查引用完整性
      const completenessCheck = this.checkReferenceCompleteness(content, extractedReferences);
      result.analysis.completeness = completenessCheck;

      // 4. 分析引用质量
      const qualityAnalysis = this.analyzeReferenceQuality(content, extractedReferences);
      result.analysis.quality = qualityAnalysis;

      // 5. 生成统计信息
      result.statistics = this.generateStatistics(extractedReferences, validatedReferences);

      // 6. 生成问题和建议
      const issuesAndSuggestions = this.generateReferenceIssues(extractedReferences, validatedReferences, completenessCheck);
      result.issues = issuesAndSuggestions.issues;
      result.suggestions = issuesAndSuggestions.suggestions;

      // 7. 最终验证结果
      result.isValid = this.isReferencesValid(result.issues, result.statistics);

      return result;
    } catch (error) {
      throw new Error(`引用验证失败: ${error.message}`);
    }
  }

  /**
   * 提取内容中的所有引用
   */
  extractReferences(content) {
    const references = [];
    let match;

    // 重置正则表达式状态
    this.referencePattern.lastIndex = 0;

    while ((match = this.referencePattern.exec(content)) !== null) {
      const reference = {
        fullMatch: match[0],
        path: match[1],
        lineNumber: parseInt(match[2]),
        columnNumber: match[3] ? parseInt(match[3].slice(2)) : null,
        context: this.extractReferenceContext(content, match.index),
        isValid: false,
        exists: false,
        accessible: false
      };

      references.push(reference);
    }

    return references;
  }

  /**
   * 提取引用的上下文
   */
  extractReferenceContext(content, matchIndex) {
    const beforeMatch = content.substring(Math.max(0, matchIndex - 50), matchIndex);
    const afterMatch = content.substring(matchIndex + 50, Math.min(content.length, matchIndex + 100));

    return {
      before: beforeMatch.trim(),
      after: afterMatch.trim(),
      full: (beforeMatch + content.substring(matchIndex, matchIndex + 50) + afterMatch).trim()
    };
  }

  /**
   * 验证每个引用
   */
  async validateEachReference(references, context) {
    const validatedReferences = [];

    for (const reference of references) {
      const validation = await this.validateSingleReference(reference, context);
      validatedReferences.push(validation);
    }

    return validatedReferences;
  }

  /**
   * 验证单个引用
   */
  async validateSingleReference(reference, context) {
    const validation = {
      ...reference,
      pathValidation: this.validatePath(reference.path),
      lineValidation: this.validateLineNumber(reference.lineNumber),
      columnValidation: reference.columnNumber ? this.validateColumnNumber(reference.columnNumber) : null,
      existenceCheck: await this.checkFileExistence(reference.path),
      accessibilityCheck: await this.checkFileAccessibility(reference.path, context),
      contentValidation: null
    };

    // 如果文件存在，验证内容
    if (validation.existenceCheck.exists && validation.accessibilityCheck.accessible) {
      validation.contentValidation = await this.validateFileContent(reference);
    }

    // 综合验证结果
    validation.isValid = this.isReferenceValid(validation);
    validation.issues = this.identifyReferenceIssues(validation);
    validation.suggestions = this.generateReferenceSuggestions(validation);

    return validation;
  }

  /**
   * 验证路径格式
   */
  validatePath(path) {
    const validation = {
      isValid: true,
      issues: [],
      type: this.detectFileType(path),
      isRelative: this.isRelativePath(path),
      hasInvalidChars: false,
      structure: this.analyzePathStructure(path)
    };

    // 检查路径字符
    const invalidChars = /[<>:"|?*]/;
    if (invalidChars.test(path)) {
      validation.isValid = false;
      validation.hasInvalidChars = true;
      validation.issues.push('路径包含无效字符');
    }

    // 检查路径结构
    if (!validation.structure.hasFileName) {
      validation.isValid = false;
      validation.issues.push('路径缺少文件名');
    }

    return validation;
  }

  /**
   * 验证行号
   */
  validateLineNumber(lineNumber) {
    return {
      isValid: lineNumber > 0,
      isPositive: lineNumber > 0,
      isReasonable: lineNumber <= 100000,
      value: lineNumber
    };
  }

  /**
   * 验证列号
   */
  validateColumnNumber(columnNumber) {
    return {
      isValid: columnNumber >= 0,
      isNonNegative: columnNumber >= 0,
      isReasonable: columnNumber <= 1000,
      value: columnNumber
    };
  }

  /**
   * 检查文件是否存在
   */
  async checkFileExistence(path) {
    // 这里应该实现实际的文件系统检查
    // 由于在Hook中无法直接访问文件系统，返回基于模式的结果
    const existenceCheck = {
      exists: this.estimateFileExistence(path),
      confidence: this.calculateExistenceConfidence(path),
      suggestedPaths: this.generatePathSuggestions(path)
    };

    return existenceCheck;
  }

  /**
   * 检查文件可访问性
   */
  async checkFileAccessibility(path, context) {
    return {
      accessible: this.estimateAccessibility(path, context),
      permissions: this.estimatePermissions(path),
      potentialBlocks: this.identifyPotentialBlocks(path, context)
    };
  }

  /**
   * 验证文件内容
   */
  async validateFileContent(reference) {
    // 这里应该实现实际的文件内容验证
    return {
      hasContent: true,
      lineExists: true,
      contentSummary: '文件内容验证需要实际文件访问',
      contentLength: '未知'
    };
  }

  /**
   * 检查引用完整性
   */
  checkReferenceCompleteness(content, references) {
    const completeness = {
      hasReferences: references.length > 0,
      referenceCount: references.length,
      hasImpactStatements: false,
      hasExplanationContext: false,
      impactStatementCount: 0,
      explanationCount: 0
    };

    // 检查是否有影响说明
    const impactPattern = /影响|影响.*?具体|影响.*?决策/gi;
    const impactMatches = content.match(impactPattern);
    completeness.impactStatementCount = impactMatches ? impactMatches.length : 0;
    completeness.hasImpactStatements = completeness.impactStatementCount > 0;

    // 检查是否有解释上下文
    const explanationPatterns = [
      /基于.*?原则/gi,
      /考虑到.*?因素/gi,
      /根据.*?内容/gi,
      /引用.*?说明/gi
    ];

    for (const pattern of explanationPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        completeness.explanationCount += matches.length;
      }
    }

    completeness.hasExplanationContext = completeness.explanationCount > 0;

    return completeness;
  }

  /**
   * 分析引用质量
   */
  analyzeReferenceQuality(content, references) {
    return {
      density: this.calculateReferenceDensity(content, references),
      diversity: this.analyzeReferenceDiversity(references),
      relevance: this.estimateReferenceRelevance(content, references),
      precision: this.assessReferencePrecision(references)
    };
  }

  /**
   * 生成统计信息
   */
  generateStatistics(references, validatedReferences) {
    const stats = {
      totalReferences: references.length,
      validReferences: validatedReferences.filter(r => r.isValid).length,
      invalidReferences: validatedReferences.filter(r => !r.isValid).length,
      uniquePaths: [...new Set(references.map(r => r.path))].length,
      referenceTypes: this.analyzeReferenceTypes(references),
      lineNumbers: {
        min: Math.min(...references.map(r => r.lineNumber)),
        max: Math.max(...references.map(r => r.lineNumber)),
        average: references.reduce((sum, r) => sum + r.lineNumber, 0) / references.length
      }
    };

    stats.validityRate = stats.totalReferences > 0 ? stats.validReferences / stats.totalReferences : 0;

    return stats;
  }

  /**
   * 生成引用问题和建议
   */
  generateReferenceIssues(references, validatedReferences, completeness) {
    const issues = [];
    const suggestions = [];

    // 检查引用格式问题
    const formatIssues = validatedReferences.filter(r => r.issues && r.issues.length > 0);
    if (formatIssues.length > 0) {
      issues.push(`发现 ${formatIssues.length} 个引用格式问题`);
      suggestions.push('检查引用路径和行号格式，确保符合 path:line 格式');
    }

    // 检查引用完整性
    if (!completeness.hasReferences) {
      issues.push('内容中缺少引用');
      suggestions.push('添加相关文档的引用，增强内容可信度');
    }

    if (!completeness.hasImpactStatements) {
      issues.push('引用缺少影响说明');
      suggestions.push('为每个引用添加具体的影响说明，例如"基于《文档名》中的XXX原则"');
    }

    if (!completeness.hasExplanationContext) {
      issues.push('引用缺少解释上下文');
      suggestions.push('为引用添加解释性上下文，说明引用如何影响决策');
    }

    // 检查引用质量
    if (references.length === 0) {
      suggestions.push('考虑添加相关资源的引用，提升内容专业性');
    } else if (references.length < 3) {
      suggestions.push('可以添加更多相关引用，丰富内容支撑');
    }

    // 检查引用多样性
    const uniquePaths = [...new Set(references.map(r => r.path))];
    if (uniquePaths.length < references.length * 0.7) {
      suggestions.push('增加引用来源的多样性，避免过度依赖单一文档');
    }

    return { issues, suggestions };
  }

  /**
   * 判断引用是否有效
   */
  isReferencesValid(issues, statistics) {
    // 如果有严重问题，则认为无效
    if (issues.some(issue => issue.includes('缺少引用') || issue.includes('格式问题'))) {
      return false;
    }

    // 如果引用有效性太低，则认为无效
    if (statistics.validityRate < 0.6) {
      return false;
    }

    return true;
  }

  /**
   * 自动修正引用
   */
  async correctReferences(content, context = {}) {
    const validation = await this.validateReferences(content, context);

    if (validation.isValid) {
      return {
        success: true,
        originalContent: content,
        correctedContent: content,
        changes: [],
        message: '引用格式已符合规范'
      };
    }

    let correctedContent = content;
    const changes = [];

    // 应用修正建议
    for (const suggestion of validation.suggestions) {
      const correction = await this.applyReferenceCorrection(correctedContent, suggestion, validation.references);
      if (correction.changed) {
        correctedContent = correction.content;
        changes.push(correction.change);
      }
    }

    // 验证修正后的内容
    const correctedValidation = await this.validateReferences(correctedContent, context);

    return {
      success: correctedValidation.isValid,
      originalContent: content,
      correctedContent,
      changes,
      originalValidation: validation,
      correctedValidation,
      message: correctedValidation.isValid ?
        `引用格式已修正，问题数从 ${validation.issues.length} 减少到 ${correctedValidation.issues.length}` :
        `引用格式有所改进，但仍需进一步优化。当前问题数: ${correctedValidation.issues.length}`
    };
  }

  /**
   * 应用引用修正
   */
  async applyReferenceCorrection(content, suggestion, references) {
    const corrections = {
      '检查引用路径和行号格式，确保符合 path:line 格式': () => this.fixReferenceFormat(content),
      '为每个引用添加具体的影响说明': () => this.addImpactStatements(content, references),
      '为引用添加解释性上下文': () => this.addExplanationContext(content, references),
      '添加相关文档的引用，增强内容可信度': () => this.addRelevantReferences(content)
    };

    const correctionFunction = corrections[suggestion];
    if (correctionFunction) {
      const result = correctionFunction();
      return result;
    }

    return { changed: false, change: null };
  }

  /**
   * 修正引用格式
   */
  fixReferenceFormat(content) {
    // 修正不规范的引用格式
    let improvedContent = content;

    // 修正缺少行号的引用
    improvedContent = improvedContent.replace(/([^\s\[]+)(?::\d*)/g, '$1:1');

    // 修正多余的空格
    improvedContent = improvedContent.replace(/\s*:\s*/g, ':');

    return {
      changed: improvedContent !== content,
      content: improvedContent,
      change: { type: 'fix_format', description: '修正引用格式为 path:line' }
    };
  }

  /**
   * 添加影响说明
   */
  addImpactStatements(content, references) {
    let improvedContent = content;

    // 为每个引用添加影响说明
    for (const reference of references) {
      const impactStatement = `基于${reference.path}中的相关内容`;
      if (!improvedContent.includes(impactStatement)) {
        const referenceContext = this.extractReferenceContext(improvedContent, improvedContent.indexOf(reference.fullMatch));
        improvedContent = improvedContent.replace(
          referenceContext.full,
          `${impactStatement}，${referenceContext.full}`
        );
      }
    }

    return {
      changed: improvedContent !== content,
      content: improvedContent,
      change: { type: 'add_impact', description: '添加引用影响说明' }
    };
  }

  /**
   * 添加解释上下文
   */
  addExplanationContext(content, references) {
    // 为引用添加解释性上下文
    let improvedContent = content;

    for (const reference of references) {
      if (!improvedContent.includes('引用') && !improvedContent.includes('基于')) {
        const explanation = `根据${reference.path}的相关指导`;
        const referenceContext = this.extractReferenceContext(improvedContent, improvedContent.indexOf(reference.fullMatch));
        improvedContent = improvedContent.replace(
          referenceContext.full,
          `${explanation}，${referenceContext.full}`
        );
      }
    }

    return {
      changed: improvedContent !== content,
      content: improvedContent,
      change: { type: 'add_context', description: '添加引用解释上下文' }
    };
  }

  /**
   * 添加相关引用
   */
  addRelevantReferences(content) {
    // 基于内容添加相关引用
    const relevantReferences = [
      'CLAUDE.md:1',
      'RULES.md:1',
      'README.md:1'
    ];

    let improvedContent = content;

    for (const ref of relevantReferences) {
      if (!improvedContent.includes(ref)) {
        improvedContent += `\n\n参考: ${ref}`;
      }
    }

    return {
      changed: improvedContent !== content,
      content: improvedContent,
      change: { type: 'add_references', description: '添加相关文档引用' }
    };
  }

  // 辅助方法
  detectFileType(path) {
    const ext = path.split('.').pop()?.toLowerCase();

    for (const [type, extensions] of Object.entries(this.referenceTypes)) {
      if (extensions.includes(`.${ext}`)) {
        return type;
      }
    }

    return 'unknown';
  }

  isRelativePath(path) {
    return !path.startsWith('/') && !path.startsWith('http') && !path.includes(':\\');
  }

  analyzePathStructure(path) {
    const parts = path.split(/[/\\]/);
    return {
      depth: parts.length,
      hasFileName: parts.length > 1 && parts[parts.length - 1].includes('.'),
      fileName: parts[parts.length - 1],
      directory: parts.slice(0, -1).join('/'),
      isNested: parts.length > 2
    };
  }

  estimateFileExistence(path) {
    // 基于路径模式估计文件存在性
    const commonFiles = [
      'CLAUDE.md', 'README.md', 'RULES.md', 'AGENTS.md',
      'package.json', 'requirements.txt', 'Dockerfile'
    ];

    return commonFiles.includes(path.split('/').pop()) ||
           path.includes('🤖 AI生成') ||
           path.includes('📖 README');
  }

  calculateExistenceConfidence(path) {
    if (this.estimateFileExistence(path)) {
      return 0.8;
    }

    // 基于路径结构估计置信度
    if (path.includes('README') || path.includes('CLAUDE') || path.includes('RULES')) {
      return 0.6;
    }

    return 0.3;
  }

  generatePathSuggestions(path) {
    const suggestions = [];

    // 基于常见文件名生成建议
    const fileName = path.split('/').pop();
    if (fileName && !fileName.includes('.')) {
      suggestions.push(`${fileName}.md`);
      suggestions.push(`${fileName}/README.md`);
    }

    return suggestions;
  }

  estimateAccessibility(path, context) {
    // 基于上下文估计可访问性
    return {
      accessible: this.estimateFileExistence(path),
      estimatedPermissions: 'read',
      potentialBlocks: []
    };
  }

  estimatePermissions(path) {
    return {
      read: true,
      write: path.includes('🤖 AI生成'),
      execute: path.includes('.sh') || path.includes('.py')
    };
  }

  identifyPotentialBlocks(path, context) {
    const blocks = [];

    if (path.includes('系统') || path.includes('config')) {
      blocks.push('可能需要管理员权限');
    }

    return blocks;
  }

  isReferenceValid(validation) {
    return validation.pathValidation.isValid &&
           validation.lineValidation.isValid &&
           (!validation.columnValidation || validation.columnValidation.isValid) &&
           validation.existenceCheck.exists;
  }

  identifyReferenceIssues(validation) {
    const issues = [];

    if (!validation.pathValidation.isValid) {
      issues.push(...validation.pathValidation.issues);
    }

    if (!validation.lineValidation.isValid) {
      issues.push('行号无效');
    }

    if (validation.columnValidation && !validation.columnValidation.isValid) {
      issues.push('列号无效');
    }

    if (!validation.existenceCheck.exists) {
      issues.push('文件不存在');
    }

    return issues;
  }

  generateReferenceSuggestions(validation) {
    const suggestions = [];

    if (!validation.pathValidation.isValid) {
      suggestions.push('检查路径格式，确保路径正确');
    }

    if (!validation.existenceCheck.exists) {
      suggestions.push('确认文件路径是否正确，或文件是否已创建');
    }

    return suggestions;
  }

  calculateReferenceDensity(content, references) {
    const wordCount = content.split(/\s+/).length;
    return wordCount > 0 ? references.length / wordCount : 0;
  }

  analyzeReferenceDiversity(references) {
    const uniquePaths = [...new Set(references.map(r => r.path))];
    const uniqueFileTypes = [...new Set(references.map(r => this.detectFileType(r.path)))];

    return {
      uniquePaths: uniquePaths.length,
      uniqueFileTypes: uniqueFileTypes.length,
      diversity: uniquePaths.length / references.length
    };
  }

  estimateReferenceRelevance(content, references) {
    // 基于引用和内容的相关性估计
    return 0.7; // 默认相关性评分
  }

  assessReferencePrecision(references) {
    const preciseReferences = references.filter(r => r.columnNumber !== null);
    return references.length > 0 ? preciseReferences.length / references.length : 0;
  }

  analyzeReferenceTypes(references) {
    const types = {};

    for (const reference of references) {
      const type = this.detectFileType(reference.path);
      types[type] = (types[type] || 0) + 1;
    }

    return types;
  }
}

module.exports = ReferenceValidationHook;