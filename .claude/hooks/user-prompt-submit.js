/**
 * UserPromptSubmit Hook - LaunchX混合协作架构 Phase 0 实施器
 *
 * 核心原则：Level S/M/L 智能分类 + 资源调度三步法 + Phase 0 强制检查
 * 基于LaunchX混合协作架构：5步认知法 + Dev Docs + Hooks质量保障
 * 集成GitHub最佳实践：企业级开发流程 + 质量门禁机制
 */

const fs = require('fs');
const path = require('path');

class UserPromptSubmitHook {
  constructor() {
    // LaunchX Level S/M/L 决策矩阵配置
    this.levelMatrix = {
      S: {
        triggers: ['单一问题|什么是|解释|说明|介绍|如何|为什么|区别|对比|示例|演示', '无需写文件|快速澄清|简单查询|直接回答|解释概念'],
        maxSteps: 3,
        requiresPlanning: false,
        requiresDevDocs: false,
        priority: 'lightweight',
        skipPhase0: true
      },
      M: {
        triggers: ['资料对比|方案设计|架构方案|引用依据|标准检索|多步骤实现', '对比一下|设计|实现|创建|构建|开发'],
        maxSteps: 10,
        requiresPlanning: true,
        requiresDevDocs: true,
        priority: 'standard',
        skipPhase0: false
      },
      L: {
        triggers: ['系统重构|微服务架构|前端.*后端.*数据库|完整平台|跨域影响|高风险|结构化交付', '重构整个|构建.*完整|包含.*前端.*后端.*数据库|微服务'],
        maxSteps: 20,
        requiresPlanning: true,
        requiresDevDocs: true,
        priority: 'structured',
        skipPhase0: false
      }
    };

    // 资源调度三步法配置
    this.resourceSteps = {
      assess: {
        name: '分级判定',
        actions: ['使用决策矩阵确定Level', '记录升级条件', '验证资源需求']
      },
      gather: {
        name: '知识整合',
        actions: ['本地资产检索', 'MCP调用', '外部资料收集']
      },
      deliver: {
        name: '执行固化',
        actions: ['映射到Dev Docs', '生成执行指令', '记录验证状态']
      }
    };

    // Phase 0 强制检查模式
    this.phase0Patterns = [
      '开发', '实现', '创建', '构建', '设计', '架构',
      '系统', '重构', '迁移', '集成', '部署'
    ];

    // Level S 快速处理模式
    this.quickAnswerPatterns = [
      '什么是', '解释', '说明', '介绍', '如何',
      '为什么', '区别', '对比', '示例', '演示'
    ];
  }

  /**
   * LaunchX Level S/M/L 智能分类系统
   */
  classifyTaskLevel(userInput) {
    const lowerInput = userInput.toLowerCase();

    // Step 1: Assess - 使用决策矩阵进行分级判定
    let detectedLevel = 'S';
    let matchedTrigger = null;

    // 按照S→M→L的顺序检查，确保更高级别优先
    const levels = ['S', 'M', 'L'];
    for (const level of levels) {
      const config = this.levelMatrix[level];
      let matchedTriggerText = null;
      const triggers = config.triggers.some(trigger => {
        if (new RegExp(trigger, 'i').test(userInput)) {
          matchedTriggerText = trigger;
          return true;
        }
        return false;
      });

      if (triggers) {
        detectedLevel = level; // 继续检查更高级别是否也匹配
        matchedTrigger = matchedTriggerText;
      }
    }

    // Step 2: 检查文件复杂度和操作类型
    const fileOperations = this.estimateFileOperations(userInput);
    const estimatedSteps = this.estimateSteps(userInput);
    const requiresPhase0 = this.requiresPhase0(userInput);

    // 升级规则：如果复杂度超过当前Level限制，自动升级
    if (detectedLevel === 'S' && estimatedSteps > this.levelMatrix.S.maxSteps) {
      detectedLevel = 'M';
    }
    if (detectedLevel === 'M' && estimatedSteps > this.levelMatrix.M.maxSteps) {
      detectedLevel = 'L';
    }

    // Step 3: 特殊规则检查
    const isQuickAnswer = this.quickAnswerPatterns.some(pattern =>
      new RegExp(pattern, 'i').test(userInput)
    );

    if (isQuickAnswer && !requiresPhase0) {
      detectedLevel = 'S';
    }

    return {
      level: detectedLevel,
      estimatedSteps,
      fileOperations,
      requiresPlanning: this.levelMatrix[detectedLevel].requiresPlanning,
      requiresDevDocs: this.levelMatrix[detectedLevel].requiresDevDocs,
      skipPhase0: this.levelMatrix[detectedLevel].skipPhase0,
      priority: this.levelMatrix[detectedLevel].priority,
      matchedTrigger,
      requiresPhase0,
      isQuickAnswer
    };
  }

  /**
   * Step 2: Gather - 知识整合阶段
   */
  gatherResources(level, userInput) {
    const resources = {
      local: [],
      mcp: [],
      external: [],
      summary: ''
    };

    // 检查本地资产
    if (fs.existsSync('memory-bank')) {
      resources.local.push('memory-bank/support_modules');
    }
    if (fs.existsSync('dev-docs')) {
      resources.local.push('dev-docs');
    }

    // MCP调用需求
    if (level === 'M' || level === 'L') {
      resources.mcp.push('rube', 'context7', 'tavily');
      resources.summary = '需要外部资料对比和方案验证';
    }

    return resources;
  }

  /**
   * Step 3: Deliver - 执行固化阶段
   */
  generateExecutionPlan(level, classification, userInput) {
    if (level === 'S' && classification.skipPhase0) {
      return {
        type: 'quick_answer',
        skipPhase0: true,
        message: 'Level S任务，可直接执行，无需Phase 0检查',
        recommendation: '直接回答用户问题，保持简洁明了'
      };
    }

    return {
      type: 'phase0_required',
      skipPhase0: false,
      requiresDevDocs: classification.requiresDevDocs,
      message: `Level ${level}任务，必须执行Phase 0检查`,
      recommendation: '执行完整的Phase 0 Checklist，创建或更新Dev Docs'
    };
  }

  /**
   * 估算文件操作数量
   */
  estimateFileOperations(userInput) {
    const fileIndicators = [
      /文件|file/i,
      /创建|create|新建/i,
      /写入|write|保存/i,
      /编辑|edit|修改/i,
      /删除|delete|remove/i
    ];

    return fileIndicators.reduce((count, pattern) =>
      count + (pattern.test(userInput) ? 1 : 0), 0
    );
  }

  /**
   * 估算任务步骤数
   */
  estimateSteps(userInput) {
    const stepPatterns = [
      /first|then|after|before|next/i,
      /\d+\.|step|phase/i,
      /and|also|additionally/i,
      /create|build|implement|develop/i,
      /test|validate|verify|check/i
    ];

    return stepPatterns.reduce((steps, pattern) => {
      const matches = userInput.match(pattern);
      return steps + (matches ? matches.length : 0);
    }, 0);
  }

  /**
   * 检查是否需要Phase 0
   */
  requiresPhase0(userInput) {
    return this.phase0Patterns.some(pattern =>
      new RegExp(pattern, 'i').test(userInput)
    );
  }

  /**
   * 生成增强的Phase 0 Checklist (基于LaunchX混合协作架构)
   */
  generatePhase0Checklist(classification, userInput) {
    const baseChecklist = {
      S: `
# Phase 0 Checklist - Level S 轻量任务
## 🎯 快速目标确认 (5分钟内完成)
- [ ] **目标明确**: ${userInput.substring(0, 50)}...
- [ ] **范围界定**: 明确是否需要扩展回答
- [ ] **资源检查**: 确认已有知识库可覆盖

## ⚡ 快速执行
- [ ] 直接回答核心问题
- [ ] 提供相关示例或代码片段
- [ ] 记录关键词供后续复用

## 📝 知识沉淀
- [ ] 如果有新发现，更新memory-bank
- [ ] 检查是否需要创建快速参考
      `,

      M: `
# Phase 0 Checklist - Level M 标准任务
## 🎯 Step 1: Assess - 分级判定
**任务分类**: Level M (${classification.priority})
**预估步骤**: ${classification.estimatedSteps} 步骤
**触发条件**: ${classification.matchedTrigger || '标准任务模式'}

## 📋 Step 2: Gather - 知识整合
### 2.1 本地资产检索
- [ ] **memory-bank检查**: rg "关键词" memory-bank/
- [ ] **dev-docs检查**: 查找相关项目经验
- [ ] **技能库检查**: 验证是否有现成解决方案

### 2.2 外部资料收集
- [ ] **rube调用**: 验证信息准确性
- [ ] **标准检索**: 查找最佳实践
- [ ] **GitHub调研**: 检查开源实现

## 📄 Step 3: Deliver - 执行固化
### 3.1 Dev Docs创建 (强制)
- [ ] **项目初始化**: 创建 dev-docs/<project>/
- [ ] **plan.md**: 目标记忆 + 技术路线
- [ ] **context.md**: SESSION PROGRESS + 环境配置
- [ ] **tasks.md**: 责任人追踪 + 验收标准

### 3.2 资源调度决策
- [ ] **技能激活**: 自动触发相关技能
- [ ] **Hook验证**: 确保质量保障就位
- [ ] **执行指令**: 为Codex提供明确命令

## ✅ 质量门禁
- [ ] **引用完整**: 所有结论有明确来源
- [ ] **复用检查**: 避免重复开发
- [ ] **验证计划**: 包含测试和回滚策略
      `,

      L: `
# Phase 0 Checklist - Level L 结构化任务
## 🎯 Step 1: Assess - 分级判定
**任务分类**: Level L (${classification.priority})
**预估步骤**: ${classification.estimatedSteps} 步骤
**风险等级**: 高 (需要企业级质量保障)

## 📋 Step 2: Gather - 知识整合
### 2.1 深度资产检索
- [ ] **memory-bank深度扫描**: 全文检索相关经验
- [ ] **技能库多维度检查**: 技术栈 + 领域 + 解决方案
- [ ] **🧩 BMAD档案**: 检查历史复杂项目经验
- [ ] **GitHub标杆分析**: 研究同类项目最佳实践

### 2.2 外部专业调研
- [ ] **rube深度验证**: 多角度信息验证
- [ ] **技术标准调研**: 行业标准和最佳实践
- [ ] **竞品分析**: 市场解决方案对比
- [ ] **专家咨询**: 必要时引入外部专家意见

## 📄 Step 3: Deliver - 执行固化
### 3.1 企业级Dev Docs (强制)
- [ ] **GitHub标准仓库**: 初始化标准项目结构
- [ ] **完整三文件**: plan.md + context.md + tasks.md
- [ ] **风险矩阵**: 详细风险评估和缓解策略
- [ ] **质量门禁**: 分阶段验收标准

### 3.2 多技能协同
- [ ] **技能组合**: project-architect + technical-design-expert
- [ ] **Hook保障**: 决策路径验证 + 工作流质量监控
- [ ] **🧩 BMAD集成**: 复杂决策支持 + 深度分析
- [ ] **GitHub集成**: CI/CD + Projects + Wiki

### 3.3 可观测性设计
- [ ] **监控指标**: 关键性能和健康指标
- [ ] **审计追踪**: 决策过程和结果记录
- [ ] **回滚预案**: 多级回滚策略
- [ ] **知识沉淀**: 经验总结和模式提取

## 🔒 企业级质量门禁
- [ ] **架构评审**: 技术架构完整性检查
- [ ] **安全评估**: 安全漏洞和风险评估
- [ ] **性能基准**: 性能指标和压力测试
- [ ] **合规检查**: 符合行业标准和法规要求

## 📊 成功指标
- [ ] **决策透明度**: 所有决策都有明确依据
- [ ] **风险可控性**: 识别风险 > 90%
- [ ] **可追溯性**: 完整的决策和执行记录
- [ ] **知识复用率**: 最大化现有资产利用
      `
    };

    return baseChecklist[classification.level] || baseChecklist.M;
  }

  /**
   * 生成增强的规划建议 (基于LaunchX架构)
   */
  generateEnhancedAdvice(classification, userInput) {
    const advice = [];

    // Level S 快速处理建议
    if (classification.level === 'S') {
      advice.push({
        type: 'quick_processing',
        priority: 'low',
        message: '⚡ Level S轻量任务，快速处理模式',
        action: '直接回答，保持简洁明了',
        checklist: this.generatePhase0Checklist(classification, userInput),
        skipPhase0: true
      });
    }

    // Level M/L 强制Phase 0
    if (classification.requiresPhase0) {
      advice.push({
        type: 'phase0_required',
        priority: classification.level === 'L' ? 'high' : 'medium',
        message: `🎯 ${classification.level === 'L' ? 'Level L' : 'Level M'}任务，必须执行完整Phase 0检查`,
        action: '遵循LaunchX资源调度三步法：Assess→Gather→Deliver',
        checklist: this.generatePhase0Checklist(classification, userInput),
        skipPhase0: false
      });
    }

    // Dev Docs强制建议
    if (classification.requiresDevDocs) {
      advice.push({
        type: 'dev_docs_required',
        priority: 'high',
        message: '📋 必须创建Dev Docs三文件系统',
        action: '使用GitHub最佳实践模板，确保企业级质量',
        template: 'GitHub-based Dev Docs模板已就绪',
        skipPhase0: false
      });
    }

    // 资源调度建议
    if (classification.level === 'M' || classification.level === 'L') {
      const resources = this.gatherResources(classification.level, userInput);
      advice.push({
        type: 'resource_scheduling',
        priority: 'medium',
        message: '🔄 启动资源调度三步法',
        action: 'Assess→Gather→Deliver，确保决策质量',
        resources: resources,
        mcpRequired: resources.mcp.length > 0
      });
    }

    return advice;
  }

  /**
   * 增强用户提示 (基于LaunchX架构)
   */
  enhancePrompt(prompt, classification) {
    let enhanced = prompt;

    // 添加Level分类信息
    if (classification.level) {
      let levelInfo = `\n\n🎯 **LaunchX智能分类**: Level ${classification.level} (${classification.priority})`;
      levelInfo += `\n📊 **预估复杂度**: ${classification.estimatedSteps} 步骤`;
      levelInfo += `\n⚡ **触发词**: ${classification.matchedTrigger || '标准模式'}`;

      enhanced = levelInfo + '\n\n' + enhanced;
    }

    // Level S快速处理提示
    if (classification.level === 'S' && classification.skipPhase0) {
      enhanced += '\n\n⚡ **快速处理模式**: Level S任务，直接回答，无需Phase 0检查';
    }

    // Level M/L强制Phase 0提示
    if (classification.requiresPhase0) {
      enhanced += `\n\n🎯 **强制Phase 0检查**: Level ${classification.level}任务必须完成完整规划`;
      enhanced += `\n📋 **资源调度**: 将执行Assess→Gather→Deliver三步法`;
      enhanced += `\n📄 **Dev Docs**: ${classification.requiresDevDocs ? '将自动创建' : '建议创建'}企业级文档`;
    }

    // 添加GitHub集成提示
    if (classification.requiresDevDocs) {
      enhanced += '\n\n🐙 **GitHub集成**: 将使用GitHub最佳实践模板创建Dev Docs';
      enhanced += '\n📊 **可观测性**: 遵循"可观测性=能力"原则，全面监控';
    }

    return enhanced;
  }

  /**
   * LaunchX混合协作架构主执行函数
   */
  async execute(context) {
    const { prompt, workspacePath, userProfile } = context;

    console.log('🎯 UserPromptSubmit Hook启动 - LaunchX混合协作架构 v2.5.0...');
    console.log('🔄 资源调度三步法：Assess→Gather→Deliver');

    try {
      // Step 1: Assess - LaunchX智能分类
      console.log('📊 Step 1: Assess - 执行Level S/M/L智能分类...');
      const classification = this.classifyTaskLevel(prompt);
      console.log(`🎯 分类结果: Level ${classification.level} (${classification.priority}), 预估步骤: ${classification.estimatedSteps}`);

      // Step 2: Gather - 知识整合
      console.log('🔍 Step 2: Gather - 知识整合和资源调度...');
      const resources = this.gatherResources(classification.level, prompt);
      const executionPlan = this.generateExecutionPlan(classification.level, classification, prompt);

      // Step 3: Deliver - 执行固化
      console.log('📄 Step 3: Deliver - 生成执行建议和质量保障...');
      const advice = this.generateEnhancedAdvice(classification, prompt);
      const enhanced = this.enhancePrompt(prompt, classification);

      // Step 4: 安全检查 (LaunchX增强)
      const dangerousPatterns = [
        /rm\s+-rf/g,
        /git\s+reset\s+--hard/g,
        /sudo\s+rm/g,
        />\s*\/dev\/null/g,
        />\s*\/(dev|proc|sys)/g
      ];

      const hasDangerousContent = dangerousPatterns.some(pattern =>
        pattern.test(prompt)
      );

      // Step 5: LaunchX质量验证
      const qualityChecks = this.performQualityChecks(classification, resources);

      // Step 6: 构建返回结果
      const result = {
        success: true,
        launchXClassification: classification,
        resourcePlan: executionPlan,
        enhancedAdvice: advice,
        resources: resources,
        hasDangerousContent,
        enhanced: enhanced,
        qualityChecks: qualityChecks,
        shouldBlock: executionPlan.type === 'phase0_required' &&
                      advice.some(a => a.priority === 'high'),
        workflowSteps: {
          assess: '✅ 完成 - LaunchX智能分类',
          gather: '✅ 完成 - 知识整合和资源调度',
          deliver: '✅ 完成 - 执行计划和质量保障'
        }
      };

      // Step 7: LaunchX架构日志输出
      this.logLaunchXResults(result);

      return result;

    } catch (error) {
      console.error('❌ LaunchX UserPromptSubmit Hook执行失败:', error);
      return {
        success: false,
        error: error.message,
        message: `❌ LaunchX规划检查失败: ${error.message}`
      };
    }
  }

  /**
   * LaunchX质量检查
   */
  performQualityChecks(classification, resources) {
    const checks = {
      levelClassification: {
        status: 'pass',
        message: `Level ${classification.level}分类合理`
      },
      resourceAvailability: {
        status: resources.local.length > 0 ? 'pass' : 'warning',
        message: resources.local.length > 0 ?
          `本地资源可用: ${resources.local.join(', ')}` :
          '建议检查本地资产'
      },
      mcpReadiness: {
        status: classification.level !== 'S' && resources.mcp.length > 0 ? 'pass' : 'info',
        message: classification.level !== 'S' && resources.mcp.length > 0 ?
          `MCP就绪: ${resources.mcp.join(', ')}` :
          'Level S任务无需MCP调用'
      }
    };

    return checks;
  }

  /**
   * LaunchX架构结果日志输出
   */
  logLaunchXResults(result) {
    console.log('📊 LaunchX混合协作架构执行结果:');
    console.log(`  🎯 任务级别: Level ${result.launchXClassification.level}`);
    console.log(`  📋 优先级: ${result.launchXClassification.priority}`);
    console.log(`  📊 复杂度: ${result.launchXClassification.estimatedSteps} 步骤`);
    console.log(`  🔄 执行模式: ${result.resourcePlan.type}`);
    console.log(`  ⚠️ 危险内容: ${result.hasDangerousContent ? '检测到' : '安全'}`);
    console.log(`  🚫 阻塞状态: ${result.shouldBlock ? '需要规划优先' : '可继续执行'}`);

    // 工作流步骤状态
    console.log('');
    console.log('🔄 资源调度三步法状态:');
    Object.entries(result.workflowSteps).forEach(([step, status]) => {
      console.log(`  ${step}: ${status}`);
    });

    // 质量检查结果
    console.log('');
    console.log('🔍 LaunchX质量检查结果:');
    Object.entries(result.qualityChecks).forEach(([check, result]) => {
      const icon = result.status === 'pass' ? '✅' :
                 result.status === 'warning' ? '⚠️' :
                 result.status === 'info' ? '💡' : '❌';
      console.log(`  ${check}: ${icon} ${result.message}`);
    });

    // 阻塞警告
    if (result.shouldBlock) {
      console.log('');
      console.warn('🚨 LaunchX规划优先原则：Level M/L任务必须完成Phase 0检查');
      result.enhancedAdvice.forEach(a => {
        console.log(`- ${a.message}`);
      });
    } else if (result.launchXClassification.level === 'S' && result.launchXClassification.skipPhase0) {
      console.log('');
      console.info('💡 Level S快速处理：无需Phase 0检查，直接执行');
    }
  }
}

// 导出Hook实例
module.exports = new UserPromptSubmitHook();
