/**
 * AI代码审查Hook - Reddit指南核心原则实施
 * 
 * 核心理念：让AI审查自己的代码，建立自动化质量门禁机制
 * 基于Reddit指南的工程化原则：可观测性=能力，零错误遗漏机制
 */

const fs = require('fs');
const path = require('path');

class AICodeReviewHook {
  constructor() {
    this.reviewThresholds = {
      complexity: 10,  // 超过10个函数视为复杂
      lines: 500,     // 超过500行需要审查
      imports: 20,    // 超过20个导入需要检查
      riskPatterns: ['eval', 'innerHTML', 'document.write', 'setTimeout(callback', 'setInterval(callback)']
    };
  }

  /**
   * 检测代码复杂度
   */
  detectCodeComplexity(filePath, content) {
    const lines = content.split('\n');
    const functions = content.match(/function\s+\w+|=>\s*{|class\s+\w+/g) || [];
    const imports = content.match(/import\s+.*from|require\s*\(/g) || [];
    const riskPatterns = this.reviewThresholds.riskPatterns.filter(pattern => 
      content.includes(pattern)
    );

    return {
      lines: lines.length,
      functions: functions.length,
      imports: imports.length,
      riskPatterns: riskPatterns,
      isComplex: lines.length > this.reviewThresholds.lines || 
                 functions.length > this.reviewThresholds.complexity ||
                 imports.length > this.reviewThresholds.imports ||
                 riskPatterns.length > 0
    };
  }

  /**
   * 执行AI代码审查
   */
  async performCodeReview(filePath, content, complexity) {
    console.log(`🔍 AI代码审查开始: ${filePath}`);

    const review = {
      timestamp: new Date().toISOString(),
      file: filePath,
      complexity,
      dimensions: {
        architecture: this.analyzeArchitecture(content),
        performance: this.analyzePerformance(content),
        security: this.analyzeSecurity(content),
        maintainability: this.analyzeMaintainability(content),
        testability: this.analyzeTestability(content)
      },
      recommendations: [],
      riskLevel: 'low',
      overallScore: 0
    };

    // 计算风险等级和总分
    review.riskLevel = this.calculateRiskLevel(review.dimensions);
    review.overallScore = this.calculateOverallScore(review.dimensions);
    review.recommendations = this.generateRecommendations(review.dimensions);

    return review;
  }

  /**
   * 架构分析
   */
  analyzeArchitecture(content) {
    const patterns = {
      singleResponsibility: this.checkSingleResponsibility(content),
      dependencyInjection: this.checkDependencyInjection(content),
      modularity: this.checkModularity(content),
      coupling: this.checkCoupling(content)
    };

    return {
      score: Object.values(patterns).filter(Boolean).length / Object.keys(patterns).length,
      patterns,
      issues: this.identifyArchitectureIssues(patterns)
    };
  }

  /**
   * 性能分析
   */
  analyzePerformance(content) {
    const issues = [];
    
    // 检查性能问题
    if (content.includes('for')) issues.push('发现for循环，建议检查效率');
    if (content.includes('JSON.parse')) issues.push('JSON解析操作，建议添加错误处理');
    if (content.includes('document.querySelectorAll')) issues.push('DOM查询操作，建议缓存结果');
    if (content.includes('addEventListener')) issues.push('事件监听器，建议检查内存泄漏风险');

    return {
      score: Math.max(0, 1 - issues.length * 0.2),
      issues,
      optimizations: this.generateOptimizationSuggestions(issues)
    };
  }

  /**
   * 安全分析
   */
  analyzeSecurity(content) {
    const securityIssues = [];
    const riskKeywords = ['eval', 'innerHTML', 'document.write', 'setTimeout(callback', 'Function('];

    riskKeywords.forEach(keyword => {
      if (content.includes(keyword)) {
        securityIssues.push({
          type: 'security_risk',
          keyword,
          severity: 'high',
          description: `检测到安全风险: ${keyword}`
        });
      }
    });

    return {
      score: Math.max(0, 1 - securityIssues.length * 0.3),
      issues: securityIssues,
      safe: securityIssues.length === 0
    };
  }

  /**
   * 可维护性分析
   */
  analyzeMaintainability(content) {
    const metrics = {
      functionLength: this.analyzeFunctionLength(content),
      naming: this.analyzeNaming(content),
      comments: this.analyzeComments(content),
      structure: this.analyzeStructure(content)
    };

    const score = Object.values(metrics).reduce((sum, metric) => sum + metric.score, 0) / Object.keys(metrics).length;

    return {
      score,
      metrics,
      improvements: this.generateMaintainabilityImprovements(metrics)
    };
  }

  /**
   * 可测试性分析
   */
  analyzeTestability(content) {
    const indicators = {
      pureFunctions: this.countPureFunctions(content),
      dependencies: this.countExternalDependencies(content),
      sideEffects: this.identifySideEffects(content),
      testable: this.checkTestability(content)
    };

    return {
      score: indicators.testable ? 0.8 : 0.4,
      indicators,
      suggestions: this.generateTestabilitySuggestions(indicators)
    };
  }

  /**
   * 计算风险等级
   */
  calculateRiskLevel(dimensions) {
    const avgScore = (
      dimensions.architecture.score + 
      dimensions.performance.score + 
      dimensions.security.score + 
      dimensions.maintainability.score + 
      dimensions.testability.score
    ) / 5;

    if (avgScore >= 0.8) return 'low';
    if (avgScore >= 0.6) return 'medium';
    return 'high';
  }

  /**
   * 计算总体分数
   */
  calculateOverallScore(dimensions) {
    return Math.round((
      dimensions.architecture.score * 0.2 +
      dimensions.performance.score * 0.2 +
      dimensions.security.score * 0.25 +
      dimensions.maintainability.score * 0.2 +
      dimensions.testability.score * 0.15
    ) * 100);
  }

  /**
   * 生成改进建议
   */
  generateRecommendations(dimensions) {
    const recommendations = [];

    // 架构建议
    if (dimensions.architecture.score < 0.7) {
      recommendations.push({
        category: '架构',
        priority: 'high',
        suggestion: '建议重构以提高模块化和降低耦合度',
        details: dimensions.architecture.issues
      });
    }

    // 性能建议
    if (dimensions.performance.score < 0.7) {
      recommendations.push({
        category: '性能',
        priority: 'medium',
        suggestion: '优化性能瓶颈',
        details: dimensions.performance.optimizations
      });
    }

    // 安全建议
    if (dimensions.security.score < 0.8) {
      recommendations.push({
        category: '安全',
        priority: 'high',
        suggestion: '修复安全漏洞',
        details: dimensions.security.issues
      });
    }

    return recommendations;
  }

  /**
   * 辅助分析方法
   */
  checkSingleResponsibility(content) {
    const functions = content.match(/function\s+\w+.*?{[\s\S]*?}/g) || [];
    return functions.every(fn => fn.split('\n').length < 50);
  }

  checkDependencyInjection(content) {
    return content.includes('constructor') || content.includes('inject');
  }

  checkModularity(content) {
    const exports = content.match(/export\s+/g) || [];
    return exports.length > 0 && exports.length < 10;
  }

  checkCoupling(content) {
    const requires = content.match(/require\s*\(/g) || [];
    return requires.length < 5;
  }

  analyzeFunctionLength(content) {
    const functions = content.match(/function\s+\w+.*?{[\s\S]*?}/g) || [];
    const avgLength = functions.reduce((sum, fn) => sum + fn.split('\n').length, 0) / functions.length;
    return {
      average: avgLength,
      score: avgLength < 30 ? 1 : avgLength < 50 ? 0.7 : 0.4
    };
  }

  analyzeNaming(content) {
    const hasGoodNaming = !content.match(/\b[a-z]\b/g) || content.match(/\b[a-z]\b/g).length < 5;
    return { score: hasGoodNaming ? 1 : 0.6 };
  }

  analyzeComments(content) {
    const comments = content.match(/\/\*[\s\S]*?\*\/|\/\/.*$/gm) || [];
    const commentRatio = comments.length / (content.split('\n').length / 10);
    return { score: commentRatio > 0.1 ? 1 : 0.5 };
  }

  analyzeStructure(content) {
    const hasGoodStructure = content.includes('class') || content.includes('function') || content.includes('export');
    return { score: hasGoodStructure ? 1 : 0.6 };
  }

  countPureFunctions(content) {
    const functions = content.match(/function\s+\w+.*?{[\s\S]*?}/g) || [];
    return functions.filter(fn => !fn.includes('console') && !fn.includes('document')).length;
  }

  countExternalDependencies(content) {
    return (content.match(/import|require/g) || []).length;
  }

  identifySideEffects(content) {
    const sideEffects = content.match(/console\.|document\.|window\.|localStorage|fetch\(/g) || [];
    return sideEffects.length;
  }

  checkTestability(content) {
    const hasExports = content.includes('export');
    const fewSideEffects = this.identifySideEffects(content) < 5;
    return hasExports && fewSideEffects;
  }

  identifyArchitectureIssues(patterns) {
    const issues = [];
    if (!patterns.singleResponsibility) issues.push('违反单一职责原则');
    if (!patterns.dependencyInjection) issues.push('缺少依赖注入');
    if (!patterns.modularity) issues.push('模块化程度不足');
    if (!patterns.coupling) issues.push('耦合度过高');
    return issues;
  }

  generateOptimizationSuggestions(issues) {
    return issues.map(issue => ({
      issue,
      suggestion: this.getOptimizationForIssue(issue)
    }));
  }

  getOptimizationForIssue(issue) {
    const suggestions = {
      '发现for循环，建议检查效率': '使用while循环或Array方法优化',
      'JSON解析操作，建议添加错误处理': '使用try-catch包装JSON操作',
      'DOM查询操作，建议缓存结果': '将查询结果缓存到变量中',
      '事件监听器，建议检查内存泄漏风险': '确保在组件卸载时移除事件监听器'
    };
    return suggestions[issue] || '请进一步分析优化方案';
  }

  generateMaintainabilityImprovements(metrics) {
    const improvements = [];
    if (metrics.functionLength.score < 0.7) {
      improvements.push('函数过长，建议拆分为更小的函数');
    }
    if (metrics.naming.score < 0.7) {
      improvements.push('命名不规范，建议使用更描述性的名称');
    }
    if (metrics.comments.score < 0.7) {
      improvements.push('注释不足，建议添加更多文档注释');
    }
    return improvements;
  }

  generateTestabilitySuggestions(indicators) {
    const suggestions = [];
    if (indicators.pureFunctions === 0) {
      suggestions.push('增加纯函数以提高可测试性');
    }
    if (indicators.dependencies > 5) {
      suggestions.push('减少外部依赖或使用依赖注入');
    }
    if (indicators.sideEffects > 3) {
      suggestions.push('隔离副作用或使用模拟对象');
    }
    return suggestions;
  }

  /**
   * 生成审查报告
   */
  generateReviewReport(review) {
    return `
# AI代码审查报告

## 📊 审查概览
- **文件**: ${review.file}
- **时间**: ${review.timestamp}
- **风险等级**: ${review.riskLevel}
- **总体分数**: ${review.overallScore}/100

## 🔍 维度分析

### 架构质量 (${Math.round(review.dimensions.architecture.score * 100)}%)
${review.dimensions.architecture.issues.length > 0 ? 
  '**问题**: ' + review.dimensions.architecture.issues.join(', ') : 
  '✅ 架构质量良好'}

### 性能 (${Math.round(review.dimensions.performance.score * 100)}%)
${review.dimensions.performance.issues.length > 0 ? 
  '**问题**: ' + review.dimensions.performance.issues.join(', ') : 
  '✅ 性能表现良好'}

### 安全性 (${Math.round(review.dimensions.security.score * 100)}%)
${review.dimensions.security.issues.length > 0 ? 
  '**风险**: ' + review.dimensions.security.issues.map(i => i.description).join(', ') : 
  '✅ 安全性良好'}

### 可维护性 (${Math.round(review.dimensions.maintainability.score * 100)}%)
${review.dimensions.maintainability.improvements.length > 0 ? 
  '**改进建议**: ' + review.dimensions.maintainability.improvements.join(', ') : 
  '✅ 可维护性良好'}

### 可测试性 (${Math.round(review.dimensions.testability.score * 100)}%)
${review.dimensions.testability.suggestions.length > 0 ? 
  '**建议**: ' + review.dimensions.testability.suggestions.join(', ') : 
  '✅ 可测试性良好'}

## 💡 改进建议
${review.recommendations.map(rec => 
  `- **${rec.category}** (${rec.priority}): ${rec.suggestion}`
).join('\n')}

---
**AI审查完成时间**: ${new Date().toISOString()}
**下次审查建议**: 重大修改后重新审查
    `;
  }

  /**
   * 主执行函数
   */
  async execute(filePath, content, context = {}) {
    console.log('🤖 AI代码审查Hook启动...');

    try {
      // 1. 检测代码复杂度
      const complexity = this.detectCodeComplexity(filePath, content);
      console.log(`📊 复杂度分析: ${complexity.lines}行, ${complexity.functions}个函数, ${complexity.riskPatterns.length}个风险模式`);

      // 2. 执行AI代码审查
      const review = await this.performCodeReview(filePath, content, complexity);
      console.log(`🔍 审查完成: 风险等级=${review.riskLevel}, 总分=${review.overallScore}/100`);

      // 3. 生成审查报告
      const report = this.generateReviewReport(review);

      // 4. 保存报告到文件
      const reportPath = filePath.replace(/\.[^/.]+$/, '_ai-review.md');
      fs.writeFileSync(reportPath, report);

      // 5. 根据风险等级决定是否阻止提交
      const shouldBlock = review.riskLevel === 'high' && review.overallScore < 60;

      return {
        action: shouldBlock ? 'block_commit' : 'review_completed',
        filePath,
        review,
        reportPath,
        shouldBlock,
        message: shouldBlock ? 
          `🚨 AI审查阻止: 发现高风险问题(${review.overallScore}/100)，请修复后重新提交。详细报告: ${reportPath}` :
          `✅ AI审查完成: 分数${review.overallScore}/100，风险等级${review.riskLevel}。详细报告: ${reportPath}`
      };

    } catch (error) {
      console.error('❌ AI代码审查失败:', error);
      return {
        action: 'review_failed',
        filePath,
        error: error.message,
        message: `❌ AI代码审查失败: ${error.message}`
      };
    }
  }
}

// 导出Hook实例
module.exports = new AICodeReviewHook();