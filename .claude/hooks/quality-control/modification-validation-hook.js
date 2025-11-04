/**
 * Modification Validation Hook
 * 确保每次修改都有充分准备和风险评估
 * 基于生命周期架构设计的关键质量保障组件
 */

const fs = require('fs').promises;
const path = require('path');

class ModificationValidationHook {
  constructor() {
    this.hookName = 'ModificationValidationHook';
    this.version = '1.0.0';
    this.validationResults = new Map();
  }

  /**
   * 主要验证入口点
   * @param {Object} params - 验证参数
   * @param {string} params.targetPath - 目标文件路径
   * @param {Object} params.changeRequest - 修改请求
   * @param {Object} params.context - 上下文信息
   */
  async validateBeforeModification(params) {
    const { targetPath, changeRequest, context } = params;
    
    console.log(`[${this.hookName}] 开始验证修改: ${targetPath}`);
    
    try {
      // 1. 强制原文分析
      const originalAnalysis = await this.analyzeOriginalContent(targetPath);
      
      // 2. 修改类型智能判断
      const modificationType = await this.determineModificationType(
        targetPath, changeRequest, originalAnalysis
      );
      
      // 3. 影响范围评估
      const impactAnalysis = await this.assessModificationImpact(
        targetPath, modificationType
      );
      
      // 4. 风险评估和回滚计划
      const riskAssessment = await this.assessRisks(impactAnalysis);
      
      // 5. 生成验证结果
      const validationResult = {
        approved: riskAssessment.acceptableRisk,
        modificationType: modificationType,
        requirements: impactAnalysis.prerequisites,
        rollbackPlan: riskAssessment.rollbackPlan,
        qualityGates: this.generateQualityGates(modificationType),
        analysis: {
          original: originalAnalysis,
          impact: impactAnalysis,
          risk: riskAssessment
        },
        timestamp: new Date().toISOString()
      };
      
      // 保存验证结果
      this.validationResults.set(targetPath, validationResult);
      
      console.log(`[${this.hookName}] 验证完成: ${validationResult.approved ? '通过' : '拒绝'}`);
      
      return validationResult;
      
    } catch (error) {
      console.error(`[${this.hookName}] 验证失败:`, error);
      return {
        approved: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * 分析原始内容
   */
  async analyzeOriginalContent(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      
      const analysis = {
        wordCount: content.split(/\s+/).length,
        lineCount: content.split('\n').length,
        structure: this.analyzeStructure(content),
        complexity: this.assessContentComplexity(content),
        dependencies: this.identifyDependencies(content),
        references: this.extractReferences(content)
      };
      
      return {
        success: true,
        analysis,
        summary: this.generateContentSummary(analysis)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        summary: '无法读取原始内容'
      };
    }
  }

  /**
   * 智能判断修改类型
   */
  async determineModificationType(filePath, changeRequest, originalAnalysis) {
    if (!originalAnalysis.success) {
      return { type: 'unknown', confidence: 0 };
    }

    const { complexity, structure, dependencies } = originalAnalysis.analysis;
    const { changeScope, changeNature } = changeRequest;

    // 修改类型决策算法
    let modificationType = 'update';
    let confidence = 0.7;
    let reasoning = '';

    // 基于复杂度和范围判断
    if (complexity.score > 8 || dependencies.count > 5) {
      if (changeScope === 'structural' || changeNature === 'major') {
        modificationType = 'rebuild';
        confidence = 0.9;
        reasoning = '高复杂度 + 重大变更 = 重建';
      } else {
        modificationType = 'optimize';
        confidence = 0.8;
        reasoning = '高复杂度 + 局部优化';
      }
    } else if (changeScope === 'content' && changeNature === 'minor') {
      modificationType = 'update';
      confidence = 0.8;
      reasoning = '低复杂度 + 内容更新';
    }

    return {
      type: modificationType,
      confidence,
      reasoning,
      factors: {
        complexity: complexity.score,
        dependencies: dependencies.count,
        changeScope,
        changeNature
      }
    };
  }

  /**
   * 评估修改影响
   */
  async assessModificationImpact(filePath, modificationType) {
    const impact = {
      scope: 'local',
      affectedFiles: [filePath],
      dependencies: [],
      prerequisites: [],
      riskLevel: 'low'
    };

    // 根据修改类型评估影响
    switch (modificationType.type) {
      case 'rebuild':
        impact.scope = 'global';
        impact.riskLevel = 'high';
        impact.prerequisites = [
          '备份当前文件',
          '确认依赖关系',
          '准备回滚方案'
        ];
        break;
        
      case 'optimize':
        impact.scope = 'local';
        impact.riskLevel = 'medium';
        impact.prerequisites = [
          '验证优化逻辑',
          '测试优化效果'
        ];
        break;
        
      case 'update':
        impact.scope = 'local';
        impact.riskLevel = 'low';
        impact.prerequisites = [
          '确认更新内容准确性'
        ];
        break;
    }

    return impact;
  }

  /**
   * 风险评估
   */
  async assessRisks(impactAnalysis) {
    const risks = {
      dataLoss: this.assessDataLossRisk(impactAnalysis),
      breakingChange: this.assessBreakingChangeRisk(impactAnalysis),
      regression: this.assessRegressionRisk(impactAnalysis),
      performance: this.assessPerformanceRisk(impactAnalysis)
    };

    const overallRisk = Math.max(
      risks.dataLoss,
      risks.breakingChange,
      risks.regression,
      risks.performance
    );

    return {
      acceptableRisk: overallRisk <= 7.0,
      overallRisk,
      risks,
      rollbackPlan: this.generateRollbackPlan(impactAnalysis, risks)
    };
  }

  /**
   * 生成质量门控
   */
  generateQualityGates(modificationType) {
    const gates = {
      preModification: [
        '原文分析完成',
        '修改类型确认',
        '影响范围评估',
        '风险评估通过'
      ],
      duringModification: [
        '遵循质量标准',
        '保持引用完整性',
        '维护文档结构'
      ],
      postModification: [
        '质量验证通过',
        '影响评估完成',
        '文档更新同步'
      ]
    };

    // 根据修改类型调整门控
    if (modificationType.type === 'rebuild') {
      gates.preModification.push('完整测试覆盖');
      gates.duringModification.push('逐步验证');
      gates.postModification.push('全面回归测试');
    }

    return gates;
  }

  /**
   * 辅助方法：分析内容结构
   */
  analyzeStructure(content) {
    const lines = content.split('\n');
    const structure = {
      headings: 0,
      codeBlocks: 0,
      lists: 0,
      tables: 0,
      references: 0
    };

    lines.forEach(line => {
      if (line.match(/^#+\s/)) structure.headings++;
      if (line.match(/```/)) structure.codeBlocks++;
      if (line.match(/^[\s]*[-*+]/)) structure.lists++;
      if (line.match(/\|/)) structure.tables++;
      if (line.match(/\[.*\]/)) structure.references++;
    });

    return structure;
  }

  /**
   * 辅助方法：评估内容复杂度
   */
  assessContentComplexity(content) {
    const factors = {
      length: content.length / 1000, // 每1000字符1分
      words: content.split(/\s+/).length / 100, // 每100词1分
      references: (content.match(/\[.*\]/g) || []).length * 2, // 每个引用2分
      nested: (content.match(/\t/g) || []).length, // 每层嵌套1分
      complexity: 0
    };

    factors.complexity = factors.length + factors.words + factors.references + factors.nested;
    
    return {
      score: Math.min(factors.complexity, 10),
      factors
    };
  }

  /**
   * 辅助方法：识别依赖关系
   */
  identifyDependencies(content) {
    const dependencies = {
      internal: [],
      external: [],
      count: 0
    };

    // 识别内部依赖（引用其他文件）
    const internalRefs = content.match(/\[.*\]\(.*\.md\)/g) || [];
    dependencies.internal = internalRefs.map(ref => ref.slice(1, -1));

    // 识别外部依赖（URL、外部资源）
    const externalRefs = content.match(/https?:\/\/[^\s\)]+/g) || [];
    dependencies.external = externalRefs;

    dependencies.count = dependencies.internal.length + dependencies.external.length;

    return dependencies;
  }

  /**
   * 辅助方法：提取引用
   */
  extractReferences(content) {
    const references = [];
    const refMatches = content.match(/\[([^\]]+)\]\([^)]+\)/g) || [];
    
    refMatches.forEach(match => {
      const [text, url] = match.match(/\[([^\]]+)\]\(([^)]+)\)/).slice(1);
      references.push({ text, url });
    });

    return references;
  }

  /**
   * 辅助方法：生成内容摘要
   */
  generateContentSummary(analysis) {
    return {
      size: `${analysis.wordCount} 词, ${analysis.lineCount} 行`,
      structure: `标题:${analysis.structure.headings}, 代码:${analysis.structure.codeBlocks}, 列表:${analysis.structure.lists}`,
      complexity: `评分: ${analysis.complexity.score}/10`,
      dependencies: `内部:${analysis.dependencies.internal.length}, 外部:${analysis.dependencies.external.length}`,
      references: `共${analysis.references.length}个引用`
    };
  }

  /**
   * 辅助方法：评估数据丢失风险
   */
  assessDataLossRisk(impactAnalysis) {
    if (impactAnalysis.scope === 'global') return 8;
    if (impactAnalysis.scope === 'wide') return 6;
    return 2;
  }

  /**
   * 辅助方法：评估破坏性变更风险
   */
  assessBreakingChangeRisk(impactAnalysis) {
    return impactAnalysis.prerequisites.length * 1.5;
  }

  /**
   * 辅助方法：评估回归风险
   */
  assessRegressionRisk(impactAnalysis) {
    return impactAnalysis.affectedFiles.length * 1.2;
  }

  /**
   * 辅助方法：评估性能风险
   */
  assessPerformanceRisk(impactAnalysis) {
    return impactAnalysis.dependencies.count * 0.8;
  }

  /**
   * 辅助方法：生成回滚计划
   */
  generateRollbackPlan(impactAnalysis, risks) {
    const plan = [
      '1. 立即停止当前修改操作',
      '2. 恢复备份文件（如果存在）',
      '3. 检查受影响的依赖文件',
      '4. 验证系统功能正常',
      '5. 通知相关人员'
    ];

    if (risks.dataLoss > 5) {
      plan.unshift('0. 立即创建完整备份');
    }

    return plan;
  }

  /**
   * 获取验证结果
   */
  getValidationResult(filePath) {
    return this.validationResults.get(filePath);
  }

  /**
   * 清除验证结果
   */
  clearValidationResult(filePath) {
    this.validationResults.delete(filePath);
  }

  /**
   * 获取所有验证结果
   */
  getAllValidationResults() {
    return Object.fromEntries(this.validationResults);
  }
}

module.exports = ModificationValidationHook;

// 如果直接运行，执行示例
if (require.main === module) {
  const hook = new ModificationValidationHook();
  
  // 示例验证
  hook.validateBeforeModification({
    targetPath: './test.md',
    changeRequest: {
      changeScope: 'content',
      changeNature: 'minor'
    },
    context: {
      user: 'test-user',
      timestamp: new Date().toISOString()
    }
  }).then(result => {
    console.log('验证结果:', result);
  }).catch(error => {
    console.error('验证失败:', error);
  });
}