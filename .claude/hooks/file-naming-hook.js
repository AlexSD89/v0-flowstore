/**
 * 文件命名规范Hook
 * 确保所有文件都符合LaunchX的命名规范
 */

class FileNamingHook {
  constructor() {
    this.name = 'file-naming-hook';
    this.version = '1.0.0';
    this.description = '文件命名规范验证和自动修正';
  }

  /**
   * 验证文件名是否符合规范
   * @param {string} fileName - 文件名
   * @param {Object} context - 上下文信息
   * @returns {Object} 验证结果
   */
  async validateFileName(fileName, context = {}) {
    const result = {
      isValid: false,
      suggestions: [],
      analysis: {},
      correctedName: null
    };

    try {
      // 1. 基础格式检查
      const formatAnalysis = this.analyzeFileNameFormat(fileName);
      result.analysis.format = formatAnalysis;

      // 2. 内容相关性检查
      const contentAnalysis = this.analyzeContentRelevance(fileName, context);
      result.analysis.content = contentAnalysis;

      // 3. 命名规范检查
      const namingAnalysis = this.analyzeNamingStandards(fileName);
      result.analysis.naming = namingAnalysis;

      // 4. 生成修正建议
      result.suggestions = this.generateNamingSuggestions(fileName, result.analysis);

      // 5. 生成最佳文件名
      result.correctedName = this.generateOptimalFileName(fileName, result.analysis, context);

      // 6. 综合验证结果
      result.isValid = this.isValidFileName(result.correctedName);

      return result;
    } catch (error) {
      throw new Error(`文件命名验证失败: ${error.message}`);
    }
  }

  /**
   * 分析文件名格式
   */
  analyzeFileNameFormat(fileName) {
    const patterns = {
      datePrefix: /^(\d{8})[_\-]/,  // 20251103_ 或 20251103-
      underscoreSeparator: /_/g,
      dashSeparator: /-/g,
      spaces: /\s+/,
      specialChars: /[^\w\-\_\.]/,
      extension: /\.(md|js|json|txt|py|sh)$/
    };

    return {
      hasDatePrefix: patterns.datePrefix.test(fileName),
      usesUnderscores: patterns.underscoreSeparator.test(fileName),
      usesDashes: patterns.dashSeparator.test(fileName),
      hasSpaces: patterns.spaces.test(fileName),
      hasSpecialChars: patterns.specialChars.test(fileName),
      hasValidExtension: patterns.extension.test(fileName),
      extension: fileName.match(patterns.extension)?.[1] || null,
      datePrefix: fileName.match(patterns.datePrefix)?.[1] || null
    };
  }

  /**
   * 分析内容相关性
   */
  analyzeContentRelevance(fileName, context) {
    const analysis = {
      hasDateInName: false,
      hasDescriptiveName: false,
      hasPurposeIndication: false,
      hasVersionInfo: false,
      contextMatch: false
    };

    // 检查日期信息
    if (/\d{8}/.test(fileName)) {
      analysis.hasDateInName = true;
    }

    // 检查描述性名称
    const descriptiveParts = fileName.replace(/^\d{8}[_\-]/, '').replace(/\.[^.]+$/, '').split(/[_\-]/);
    if (descriptiveParts.length >= 2) {
      analysis.hasDescriptiveName = true;
    }

    // 检查目的指示
    const purposeIndicators = ['analysis', 'design', 'plan', 'spec', 'guide', 'manual', 'report', 'summary'];
    if (purposeIndicators.some(indicator => fileName.toLowerCase().includes(indicator))) {
      analysis.hasPurposeIndication = true;
    }

    // 检查版本信息
    const versionPatterns = /[_\-](v\d+|version\d+|rev\d+)/i;
    if (versionPatterns.test(fileName)) {
      analysis.hasVersionInfo = true;
    }

    // 检查上下文匹配
    if (context.contentType || context.purpose) {
      const contextKeywords = [
        ...(context.contentType ? [context.contentType.toLowerCase()] : []),
        ...(context.purpose ? [context.purpose.toLowerCase()] : [])
      ];
      analysis.contextMatch = contextKeywords.some(keyword =>
        fileName.toLowerCase().includes(keyword)
      );
    }

    return analysis;
  }

  /**
   * 分析命名标准
   */
  analyzeNamingStandards(fileName) {
    const standards = {
      length: fileName.length,
      readability: this.calculateReadability(fileName),
      clarity: this.calculateClarity(fileName),
      consistency: this.checkConsistency(fileName)
    };

    return standards;
  }

  /**
   * 计算可读性
   */
  calculateReadability(fileName) {
    // 基于分隔符使用和单词长度计算可读性
    const withoutExtension = fileName.replace(/\.[^.]+$/, '');
    const parts = withoutExtension.split(/[_\-]/);

    if (parts.length === 0) return 0;

    const avgPartLength = parts.reduce((sum, part) => sum + part.length, 0) / parts.length;
    const idealLength = 8; // 理想的平均部分长度

    const readabilityScore = Math.max(0, 1 - Math.abs(avgPartLength - idealLength) / idealLength);
    return Math.round(readabilityScore * 100) / 100;
  }

  /**
   * 计算清晰度
   */
  calculateClarity(fileName) {
    // 基于描述性和信息丰富度计算清晰度
    const withoutExtension = fileName.replace(/\.[^.]+$/, '');
    const parts = withoutExtension.split(/[_\-]/);

    let clarityScore = 0;

    // 日期信息加分
    if (/^\d{8}/.test(fileName)) clarityScore += 0.3;

    // 描述性部分加分
    if (parts.length >= 3) clarityScore += 0.4;
    else if (parts.length >= 2) clarityScore += 0.2;

    // 扩展名加分
    if (/\.(md|txt|json)$/.test(fileName)) clarityScore += 0.3;

    return Math.round(clarityScore * 100) / 100;
  }

  /**
   * 检查一致性
   */
  checkConsistency(fileName) {
    // 检查命名风格的一致性
    const hasUnderscores = /_/.test(fileName);
    const hasDashes = /-/.test(fileName);
    const hasMixed = hasUnderscores && hasDashes;

    return {
      hasUnderscores,
      hasDashes,
      hasMixed,
      isConsistent: !hasMixed
    };
  }

  /**
   * 生成命名建议
   */
  generateNamingSuggestions(fileName, analysis) {
    const suggestions = [];

    // 格式建议
    if (!analysis.format.hasDatePrefix) {
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      suggestions.push(`建议添加日期前缀: ${today}_`);
    }

    if (analysis.format.hasSpaces) {
      suggestions.push('文件名中包含空格，建议使用下划线或破折号替代');
    }

    if (analysis.format.hasSpecialChars) {
      suggestions.push('文件名中包含特殊字符，建议只使用字母、数字、下划线和破折号');
    }

    if (!analysis.format.hasValidExtension) {
      suggestions.push('建议添加合适的文件扩展名 (.md, .js, .json 等)');
    }

    // 内容建议
    if (!analysis.content.hasDescriptiveName) {
      suggestions.push('建议添加更具体的描述性名称');
    }

    if (!analysis.content.hasPurposeIndication) {
      suggestions.push('建议添加目的指示词 (如: analysis, design, plan, guide 等)');
    }

    // 命名标准建议
    if (analysis.naming.readability < 0.6) {
      suggestions.push('建议优化文件名可读性，适当分割长单词');
    }

    if (analysis.naming.clarity < 0.6) {
      suggestions.push('建议提高文件名清晰度，添加更多描述性信息');
    }

    if (!analysis.naming.consistency.isConsistent) {
      suggestions.push('建议统一使用下划线或破折号，避免混用');
    }

    return suggestions;
  }

  /**
   * 生成最佳文件名
   */
  generateOptimalFileName(fileName, analysis, context) {
    let newName = fileName;

    // 1. 添加日期前缀（如果没有）
    if (!analysis.format.hasDatePrefix) {
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      newName = `${today}_${newName}`;
    }

    // 2. 清理特殊字符
    newName = newName.replace(/[^\w\-\_\.]/g, '_');

    // 3. 替换空格为下划线
    newName = newName.replace(/\s+/g, '_');

    // 4. 统一使用下划线
    newName = newName.replace(/-/g, '_');

    // 5. 清理多个连续的下划线
    newName = newName.replace(/_+/g, '_');

    // 6. 移除开头和结尾的下划线
    newName = newName.replace(/^_+|_+$/g, '');

    // 7. 确保有扩展名
    if (!analysis.format.hasValidExtension) {
      // 根据上下文推断扩展名
      const inferredExtension = this.inferExtension(context);
      if (inferredExtension) {
        newName += `.${inferredExtension}`;
      }
    }

    return newName;
  }

  /**
   * 根据上下文推断文件扩展名
   */
  inferExtension(context) {
    if (context.contentType) {
      const typeMap = {
        'markdown': 'md',
        'text': 'txt',
        'json': 'json',
        'javascript': 'js',
        'python': 'py',
        'shell': 'sh',
        'config': 'json'
      };

      const contentType = context.contentType.toLowerCase();
      return typeMap[contentType] || 'md';
    }

    // 默认扩展名
    return 'md';
  }

  /**
   * 验证文件名是否有效
   */
  isValidFileName(fileName) {
    const patterns = {
      validFormat: /^\d{8}_[\w\-_]+\.[a-z]+$/,
      noSpaces: !/\s/,
      noSpecialChars: !/[^\w\-_\.\/]/,
      hasDate: /^\d{8}/,
      hasExtension: /\.[a-z]+$/,
      reasonableLength: fileName.length >= 10 && fileName.length <= 100
    };

    return Object.values(patterns).every(pattern => pattern === true || typeof pattern === 'object' && pattern.test !== false);
  }

  /**
   * 自动修正文件名
   */
  async correctFileName(fileName, context = {}) {
    const validation = await this.validateFileName(fileName, context);

    if (validation.isValid) {
      return {
        success: true,
        originalName: fileName,
        correctedName: fileName,
        changes: [],
        message: '文件名已符合规范'
      };
    }

    const changes = [];

    // 记录所有变更
    if (validation.correctedName !== fileName) {
      changes.push({
        type: 'rename',
        from: fileName,
        to: validation.correctedName,
        reason: '文件名规范化'
      });
    }

    return {
      success: true,
      originalName: fileName,
      correctedName: validation.correctedName,
      changes,
      suggestions: validation.suggestions,
      analysis: validation.analysis,
      message: `文件名已修正为: ${validation.correctedName}`
    };
  }
}

module.exports = FileNamingHook;