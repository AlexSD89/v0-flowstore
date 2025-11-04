/**
 * UserPromptSubmit Hook - Reddit指南规划先行原则实施
 *
 * 核心原则：禁止直接开干，强制先规划
 * 基于Reddit指南：工程基础设施优先，自动化强制执行
 */

const fs = require('fs');
const path = require('path');

class UserPromptSubmitHook {
  constructor() {
    this.planningRequiredPatterns = [
      '开发', '实现', '创建', '构建', '设计', '架构',
      '系统', '重构', '迁移', '集成', '部署'
    ];

    this.directActionPatterns = [
      '直接', '马上', '立即', '现在就', '开始做'
    ];

    this.planningIndicators = [
      '计划', '规划', 'checklist', 'spec', '设计文档',
      'phase 0', '需求分析', '方案', ' roadmap'
    ];
  }

  /**
   * 分析用户输入，判断是否需要强制规划
   */
  analyzePlanningRequirement(prompt) {
    const lowerPrompt = prompt.toLowerCase();

    // 检测是否需要规划的任务
    const needsPlanning = this.planningRequiredPatterns.some(pattern =>
      lowerPrompt.includes(pattern)
    );

    // 检测是否直接要开干
    const directAction = this.directActionPatterns.some(pattern =>
      lowerPrompt.includes(pattern)
    );

    // 检测是否已有规划内容
    const hasPlanning = this.planningIndicators.some(indicator =>
      lowerPrompt.includes(indicator)
    );

    // 检测复杂度
    const complexity = this.assessComplexity(prompt);

    return {
      needsPlanning,
      directAction,
      hasPlanning,
      complexity,
      shouldForcePlan: needsPlanning && (!hasPlanning || directAction)
    };
  }

  /**
   * 评估任务复杂度
   */
  assessComplexity(prompt) {
    const complexityIndicators = [
      /多个|several|various/i,
      /系统|架构|infrastructure/i,
      /集成|migration|upgrade/i,
      /复杂|complex/i,
      /步骤|phase|stage/i
    ];

    const score = complexityIndicators.reduce((count, pattern) =>
      count + (pattern.test(prompt) ? 1 : 0), 0
    );

    return {
      score,
      level: score >= 3 ? 'high' : score >= 1 ? 'medium' : 'low',
      requiresPlan: score >= 1
    };
  }

  /**
   * 生成规划强制建议
   */
  generatePlanningAdvice(analysis) {
    const advice = [];

    if (analysis.shouldForcePlan) {
      advice.push({
        type: 'planning_required',
        priority: 'high',
        message: '🚨 检测到直接开干的意图！根据Reddit指南，必须先完成规划',
        action: '请先完成Phase 0 Checklist，制定/spec和/plan',
        template: this.getPlanningTemplate(analysis.complexity)
      });
    }

    if (analysis.needsPlanning && !analysis.hasPlanning) {
      advice.push({
        type: 'planning_recommended',
        priority: 'medium',
        message: '💡 建议先完成规划再开始执行',
        action: '考虑添加checklist或设计文档',
        template: this.getPlanningTemplate(analysis.complexity)
      });
    }

    return advice;
  }

  /**
   * 获取规划模板
   */
  getPlanningTemplate(complexity) {
    const templates = {
      high: `
# Phase 0 Checklist - 高复杂度任务

## 🎯 目标明确
- [ ] 明确具体要实现什么
- [ ] 定义成功标准和验收条件
- [ ] 识别关键约束和限制条件

## 📋 资产检查
- [ ] 搜索现有解决方案 (rg "关键词")
- [ ] 检查memory-bank/support_modules
- [ ] 评估是否需要Dev Docs工作流

## 🔧 技术方案
- [ ] 制定技术路线图
- [ ] 识别依赖关系
- [ ] 评估风险和回滚策略

## 📊 执行计划
- [ ] 创建 /spec 规格文档
- [ ] 制定 /plan 执行计划
- [ ] 准备 /do 执行环境
      `,

      medium: `
# 快速规划清单

## 🎯 核心目标
- 具体要实现：____
- 成功标准：____

## 📋 简要检查
- [ ] 搜索现有方案
- [ ] 确认技术可行性
- [ ] 估算时间成本

## 📊 执行步骤
1. 分析现状
2. 制定方案
3. 分步实施
4. 验证结果
      `,

      low: `
# 简单任务规划

## 目标
- 要做什么：____
- 何时完成：____

## 检查点
- [ ] 明确需求
- [ ] 准备环境
- [ ] 执行验证
      `
    };

    return templates[complexity.level] || templates.low;
  }

  /**
   * 增强用户提示
   */
  enhancePrompt(prompt, analysis) {
    let enhanced = prompt;

    // 如果检测到直接开干意图，强制添加规划提醒
    if (analysis.shouldForcePlan) {
      enhanced = `⚠️ 规划优先提醒：\n\n` +
                 `检测到此任务需要先完成规划。请先执行Phase 0 Checklist。` +
                 `\n\n原始请求：\n${prompt}`;
    }

    // 为复杂任务添加Dev Docs建议
    if (analysis.needsPlanning && analysis.complexity.level === 'high') {
      if (!enhanced.includes('Dev Docs')) {
        enhanced += `\n\n💡 高复杂度任务建议使用Dev Docs工作流：`;
        enhanced += `\n- 创建 dev-docs/<project>/plan.md（目标记忆）`;
        enhanced += `\n- 创建 dev-docs/<project>/context.md（状态记忆）`;
        enhanced += `\n- 创建 dev-docs/<project>/tasks.md（进度记忆）`;
      }
    }

    return enhanced;
  }

  /**
   * 主执行函数
   */
  async execute(context) {
    const { prompt, workspacePath, userProfile } = context;

    console.log('🎯 UserPromptSubmit Hook启动 - Reddit指南规划先行原则...');

    try {
      // 1. 分析规划需求
      const analysis = this.analyzePlanningRequirement(prompt);
      console.log(`📊 规划分析: 需要=${analysis.needsPlanning}, 已有=${analysis.hasPlanning}, 复杂度=${analysis.complexity.level}`);

      // 2. 生成规划建议
      const advice = this.generatePlanningAdvice(analysis);

      // 3. 增强用户提示
      const enhanced = this.enhancePrompt(prompt, analysis);

      // 4. 安全检查
      const dangerousPatterns = [
        /rm\s+-rf/g,
        /git\s+reset\s+--hard/g,
        /sudo\s+rm/g,
        />\s*\/dev\/null/g
      ];

      const hasDangerousContent = dangerousPatterns.some(pattern =>
        pattern.test(prompt)
      );

      // 5. 构建返回结果
      const result = {
        success: true,
        planningAnalysis: analysis,
        advice: advice,
        hasDangerousContent,
        enhanced: enhanced,
        shouldBlock: analysis.shouldForcePlan && advice.some(a => a.priority === 'high')
      };

      // 6. 输出结果
      if (result.shouldBlock) {
        console.warn('🚨 规划优先原则：阻止直接开干，强制先完成规划');
        advice.forEach(a => console.log(`- ${a.message}`));
      } else if (analysis.needsPlanning) {
        console.info('💡 建议优先完成规划，提高执行质量');
      }

      return result;

    } catch (error) {
      console.error('❌ UserPromptSubmit Hook执行失败:', error);
      return {
        success: false,
        error: error.message,
        message: `❌ 规划检查失败: ${error.message}`
      };
    }
  }
}

// 导出Hook实例
module.exports = new UserPromptSubmitHook();
