/**
 * Dev Docs工作流Hook - Reddit指南集成版
 *
 * 核心理念：将5步认知法的思维指导与Dev Docs三文件系统相结合
 * 形成完整的"思考-执行-记忆"闭环，解决AI失忆问题
 *
 * 功能：
 * 1. 复杂任务自动识别（Level M/L）
 * 2. 强制Dev Docs三文件创建
 * 3. 工程化检查点验证
 * 4. 4维领域分析集成
 * 5. 基础设施状态检查
 */

const fs = require('fs');
const path = require('path');

class DevDocsWorkflowHook {
  constructor() {
    this.complexityThreshold = 5; // 超过5个步骤的任务视为复杂
    this.devDocsDir = 'dev-docs';
  }

  /**
   * 检测任务复杂度
   */
  detectTaskComplexity(userInput, context) {
    const complexityIndicators = [
      /implement|create|build|develop|refactor/i,
      /system|architecture|infrastructure/i,
      /multiple|several|various/i,
      /integration|migration|upgrade/i,
      /test|validate|verify/i
    ];

    const complexityScore = complexityIndicators.reduce((score, pattern) => {
      return score + (userInput.match(pattern) ? 1 : 0);
    }, 0);

    // 检查文件操作复杂度
    const fileOperations = context.recentFiles?.length || 0;
    const estimatedSteps = this.estimateSteps(userInput);

    return {
      score: complexityScore,
      estimatedSteps,
      isComplex: complexityScore >= 2 || estimatedSteps > this.complexityThreshold || fileOperations > 3
    };
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
   * 创建Dev Docs三文件模板
   */
  createDevDocsTemplates(projectName, userInput, complexity) {
    const timestamp = new Date().toISOString().split('T')[0];
    const projectDir = path.join(this.devDocsDir, projectName);

    // 确保目录存在
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }

    // 生成plan.md模板
    const planTemplate = this.generatePlanTemplate(projectName, userInput, complexity);
    fs.writeFileSync(path.join(projectDir, 'plan.md'), planTemplate);

    // 生成context.md模板
    const contextTemplate = this.generateContextTemplate(projectName, complexity);
    fs.writeFileSync(path.join(projectDir, 'context.md'), contextTemplate);

    // 生成tasks.md模板
    const tasksTemplate = this.generateTasksTemplate(projectName, userInput, complexity);
    fs.writeFileSync(path.join(projectDir, 'tasks.md'), tasksTemplate);

    return {
      projectDir,
      files: ['plan.md', 'context.md', 'tasks.md'],
      message: `🎯 Dev Docs已创建：${projectDir}/`
    };
  }

  /**
   * 生成plan.md模板 - 目标记忆
   */
  generatePlanTemplate(projectName, userInput, complexity) {
    return `---
title: "${projectName} 项目计划"
owners: ["LaunchX Team"]
status: "active"
last_update: "${new Date().toISOString().split('T')[0]}"
project: "${projectName}"
complexity: "${complexity.isComplex ? 'Level L' : 'Level M'}"
source: "Reddit Dev Docs方法论 + 5步认知法"
impact: "high"
---

# ${projectName} - 项目计划

## 🎯 项目目标
<!-- 来自Collect阶段的需求分析 -->

### 核心目标
${complexity.isComplex ? '- [ ] 复杂系统重构' : '- [ ] 功能实现'}
- [ ] ${userInput.substring(0, 100)}...

### 成功标准
- [ ] 功能完整性验证
- [ ] 性能指标达标
- [ ] 代码质量检查通过
- [ ] 文档完整性确认

## 📋 技术路线图
<!-- 来自Compare阶段的方案选择 -->

### 阶段规划
1. **Phase 1**: 基础架构搭建
2. **Phase 2**: 核心功能实现
3. **Phase 3**: 测试与优化
4. **Phase 4**: 部署与监控

### 关键决策点
- [ ] 技术栈确认
- [ ] 架构设计批准
- [ ] 风险评估完成

## ⚠️ 风险矩阵
<!-- 来自Compare阶段的风险评估 -->

| 风险 | 概率 | 影响 | 缓解策略 |
|------|------|------|----------|
| 技术风险 | 中 | 高 | 充分调研 + 原型验证 |
| 时间风险 | 中 | 中 | 分阶段交付 |
| 质量风险 | 低 | 高 | 自动化测试 + Code Review |

## ✅ 验收标准
<!-- 来自Align阶段的验收确认 -->

### 功能验收
- [ ] 核心功能完整实现
- [ ] 用户体验符合预期
- [ ] 性能指标达标

### 技术验收
- [ ] 代码质量检查通过
- [ ] 测试覆盖率达标
- [ ] 文档完整准确

### 交付验收
- [ ] 部署环境就绪
- [ ] 监控系统配置
- [ ] 运维文档完善

---
**创建时间**: ${new Date().toISOString()}
**更新周期**: 每个阶段完成后更新
**责任人**: LaunchX Team
`;
  }

  /**
   * 生成context.md模板 - 状态记忆
   */
  generateContextTemplate(projectName, complexity) {
    return `---
title: "${projectName} 项目上下文"
owners: ["LaunchX Team"]
status: "active"
last_update: "${new Date().toISOString().split('T')[0]}"
project: "${projectName}"
type: "context"
source: "Reddit Dev Docs方法论 + 5步认知法"
---

# ${projectName} - 项目上下文

## 🌍 系统环境
<!-- 来自Collect阶段的上下文加载 -->

### 技术栈
- **前端**: React + TypeScript + Vite
- **后端**: Node.js + Express + TypeScript
- **数据库**: PostgreSQL + Prisma ORM
- **部署**: PM2 + Docker

### 开发环境
- **Node.js**: \`${process.version}\`
- **npm**: \`${this.getNpmVersion()}\`
- **操作系统**: \`${process.platform}\`

## 📁 项目结构
<!-- 来自Model阶段的环境分析 -->

\`\`\`
${projectName}/
├── src/           # 源代码
├── tests/         # 测试文件
├── docs/          # 项目文档
├── scripts/       # 构建脚本
└── dev-docs/      # Dev Docs (当前目录)
\`\`\`

## 🔧 配置信息
<!-- 关键配置和约束条件 -->

### 环境变量
\`\`\`
NODE_ENV=development
DATABASE_URL=postgresql://...
API_BASE_URL=http://localhost:3000
\`\`\`

### 依赖关系
- 核心依赖已在package.json中定义
- 开发依赖通过npm install安装
- 测试依赖配置完成

## 📊 当前状态
<!-- 实时更新的项目状态 -->

### 进度概览
- **总体进度**: 0%
- **代码完成**: 0%
- **测试覆盖**: 0%
- **文档完善**: 100% (本文件)

### 关键指标
- **性能基准**: 待测试
- **质量分数**: 待评估
- **用户反馈**: 待收集

## 🎯 决策记录
<!-- 重要决策的历史记录 -->

### 架构决策
- **时间**: ${new Date().toISOString()}
- **决策**: 采用Dev Docs工作流
- **原因**: 解决AI失忆问题，确保项目连续性
- **影响**: 提升开发效率，降低项目风险

### 技术选型
- **时间**: ${new Date().toISOString()}
- **决策**: 使用PM2进程管理
- **原因**: Reddit指南推荐，提升可观测性
- **影响**: 增强调试能力，改善运维体验

---
**最后更新**: ${new Date().toISOString()}
**更新频率**: 每个重要决策后更新
**维护者**: LaunchX Team
`;
  }

  /**
   * 生成tasks.md模板 - 进度记忆
   */
  generateTasksTemplate(projectName, userInput, complexity) {
    return `---
title: "${projectName} 任务清单"
owners: ["LaunchX Team"]
status: "active"
last_update: "${new Date().toISOString().split('T')[0]}"
project: "${projectName}"
type: "tasks"
source: "Reddit Dev Docs方法论 + 5步认知法"
---

# ${projectName} - 任务清单

## 📋 Phase 1: 基础架构搭建
<!-- 来自Model阶段的问题拆解 -->

### 环境准备
- [ ] 创建项目目录结构
- [ ] 初始化package.json
- [ ] 配置TypeScript
- [ ] 设置ESLint + Prettier
- [ ] 配置Git仓库

### 基础设施
- [ ] 设置PM2配置
- [ ] 配置日志系统
- [ ] 创建开发脚本
- [ ] 设置热重载
- [ ] 配置环境变量

## 📋 Phase 2: 核心功能实现
<!-- 用户需求的核心功能 -->

### 功能开发
- [ ] 分析用户需求
- [ ] 设计API接口
- [ ] 实现数据模型
- [ ] 开发业务逻辑
- [ ] 创建用户界面

### 集成开发
- [ ] 前后端联调
- [ ] 数据库集成
- [ ] 第三方服务集成
- [ ] 错误处理完善
- [ ] 性能优化

## 📋 Phase 3: 测试与优化
<!-- 质量保障和性能优化 -->

### 测试覆盖
- [ ] 单元测试编写
- [ ] 集成测试设计
- [ ] E2E测试实现
- [ ] 性能测试执行
- [ ] 安全测试检查

### 质量优化
- [ ] 代码审查完成
- [ ] 性能瓶颈分析
- [ ] 内存泄漏检查
- [ ] 用户体验优化
- [ ] 错误处理增强

## 📋 Phase 4: 部署与监控
<!-- 来自Align阶段的交付确认 -->

### 部署准备
- [ ] 生产环境配置
- [ ] 数据库迁移
- [ ] 环境变量配置
- [ ] 域名和SSL配置
- [ ] 备份策略实施

### 监控运维
- [ ] PM2进程监控
- [ ] 日志系统配置
- [ ] 性能监控设置
- [ ] 错误告警配置
- [ ] 健康检查实现

## 🚧 阻塞问题
<!-- 阻塞任务的问题和解决方案 -->

### 当前阻塞
- [ ] **无阻塞问题** - 项目刚开始

### 历史阻塞
<!-- 记录已解决的阻塞问题 -->

---
**任务统计**:
- 总任务数: ${complexity.estimatedSteps || 15}
- 已完成: 0
- 进行中: 0
- 待开始: ${complexity.estimatedSteps || 15}

**进度计算**: 0% (0/${complexity.estimatedSteps || 15})

**最后更新**: ${new Date().toISOString()}
**更新频率**: 每个任务完成后更新
**质量检查点**: 每个Phase结束时进行
`;
  }

  /**
   * 获取npm版本
   */
  getNpmVersion() {
    try {
      const { execSync } = require('child_process');
      return execSync('npm --version', { encoding: 'utf8' }).trim();
    } catch (error) {
      return '未知';
    }
  }

  /**
   * 验证基础设施状态
   */
  validateInfrastructure() {
    const checks = [
      { name: 'PM2状态', check: () => this.checkPM2() },
      { name: 'Git仓库', check: () => this.checkGit() },
      { name: 'Node.js版本', check: () => this.checkNodeVersion() },
      { name: '项目结构', check: () => this.checkProjectStructure() }
    ];

    const results = checks.map(check => ({
      ...check,
      status: check.check(),
      timestamp: new Date().toISOString()
    }));

    return results;
  }

  /**
   * 检查PM2状态
   */
  checkPM2() {
    try {
      const { execSync } = require('child_process');
      execSync('pm2 --version', { stdio: 'ignore' });
      return '✅ PM2已安装';
    } catch (error) {
      return '❌ PM2未安装，建议: npm install -g pm2';
    }
  }

  /**
   * 检查Git仓库
   */
  checkGit() {
    try {
      const { execSync } = require('child_process');
      execSync('git status', { stdio: 'ignore' });
      return '✅ Git仓库正常';
    } catch (error) {
      return '❌ 非Git仓库，建议: git init';
    }
  }

  /**
   * 检查Node.js版本
   */
  checkNodeVersion() {
    const version = process.version;
    const majorVersion = parseInt(version.slice(1).split('.')[0]);

    if (majorVersion >= 18) {
      return `✅ Node.js版本正常 (${version})`;
    } else {
      return `⚠️ Node.js版本较低 (${version})，建议升级到v18+`;
    }
  }

  /**
   * 检查项目结构
   */
  checkProjectStructure() {
    const requiredDirs = ['src', 'package.json'];
    const missing = requiredDirs.filter(dir => {
      if (dir === 'package.json') {
        return !fs.existsSync(dir);
      }
      return !fs.existsSync(dir);
    });

    if (missing.length === 0) {
      return '✅ 项目结构完整';
    } else {
      return `⚠️ 缺少必要文件/目录: ${missing.join(', ')}`;
    }
  }

  /**
   * 生成4维领域分析
   */
  generateDomainAnalysis(userInput, complexity) {
    return {
      **技术维度分析**: {
        技术栈: this.analyzeTechStack(userInput),
        架构复杂度: complexity.isComplex ? '高' : '中',
        依赖关系: '待分析',
        集成难度: '待评估'
      },

      **业务维度分析**: {
        业务价值: this.analyzeBusinessValue(userInput),
        用户影响: this.analyzeUserImpact(userInput),
        数据复杂度: '待分析',
        流程复杂度: '待评估'
      },

      **质量维度分析**: {
        代码质量要求: '高',
        测试覆盖目标: '≥90%',
        性能要求: this.analyzePerformanceRequirements(userInput),
        安全要求: '中高'
      },

      **运维维度分析**: {
        部署复杂度: complexity.isComplex ? '高' : '中',
        监控需求: '实时',
        维护成本: '待评估',
        扩展性要求: '待分析'
      }
    };
  }

  /**
   * 分析技术栈
   */
  analyzeTechStack(userInput) {
    const techKeywords = {
      'React': /react|jsx|tsx/i,
      'Vue': /vue|vue3/i,
      'Node.js': /node|express|koa/i,
      'Python': /python|django|flask/i,
      'TypeScript': /typescript|ts/i,
      'Database': /database|db|sql/i
    };

    const detected = Object.entries(techKeywords)
      .filter(([tech, pattern]) => pattern.test(userInput))
      .map(([tech]) => tech);

    return detected.length > 0 ? detected.join('+') : '通用技术栈';
  }

  /**
   * 分析业务价值
   */
  analyzeBusinessValue(userInput) {
    const valueIndicators = [
      /important|critical|urgent/i,
      /revenue|profit|business/i,
      /user.*experience|customer/i,
      /efficiency|productivity/i
    ];

    const hasHighValue = valueIndicators.some(pattern => pattern.test(userInput));
    return hasHighValue ? '高' : '中';
  }

  /**
   * 分析用户影响
   */
  analyzeUserImpact(userInput) {
    const impactIndicators = [
      /many|multiple|all.*users/i,
      /critical.*path|core.*feature/i,
      /user.*interface|ui/i,
      /accessibility|usability/i
    ];

    const hasHighImpact = impactIndicators.some(pattern => pattern.test(userInput));
    return hasHighImpact ? '高' : '中';
  }

  /**
   * 分析性能要求
   */
  analyzePerformanceRequirements(userInput) {
    const performanceIndicators = [
      /fast|quick|performance/i,
      /real.*time|streaming/i,
      /large.*data|big.*data/i,
      /high.*traffic|scaling/i
    ];

    const hasHighPerf = performanceIndicators.some(pattern => pattern.test(userInput));
    return hasHighPerf ? '高' : '标准';
  }

  /**
   * 主执行函数 - 复杂任务自动创建Dev Docs
   */
  async execute(userInput, context = {}) {
    console.log('🎯 Dev Docs工作流Hook启动...');

    // 1. 检测任务复杂度
    const complexity = this.detectTaskComplexity(userInput, context);
    console.log(`📊 任务复杂度分析: Level ${complexity.isComplex ? 'L' : 'M'} (评分: ${complexity.score}, 预估步骤: ${complexity.estimatedSteps})`);

    // 2. 如果是复杂任务，强制创建Dev Docs
    if (complexity.isComplex) {
      console.log('🚨 检测到复杂任务，自动启动Dev Docs工作流...');

      // 提取项目名称
      const projectName = this.extractProjectName(userInput) || `project-${Date.now()}`;

      // 创建Dev Docs三文件
      const result = this.createDevDocsTemplates(projectName, userInput, complexity);

      // 验证基础设施
      const infraStatus = this.validateInfrastructure();

      // 生成4维领域分析
      const domainAnalysis = this.generateDomainAnalysis(userInput, complexity);

      console.log('✅ Dev Docs创建完成:', result.message);
      console.log('📋 基础设施状态:', infraStatus.map(item => `${item.name}: ${item.status}`).join(' | '));

      return {
        action: 'dev_docs_created',
        projectName,
        complexity,
        files: result.files,
        infrastructure: infraStatus,
        domainAnalysis,
        message: `🎯 已为复杂任务创建Dev Docs工作环境。\\n\\n📁 项目位置: ${result.projectDir}\\n📄 包含文件: ${result.files.join(', ')}\\n\\n📋 下一步: 按照tasks.md中的清单开始执行，记得定期更新三个文件！`
      };
    } else {
      console.log('💡 检测到简单任务，可以继续直接执行。');
      return {
        action: 'simple_task',
        complexity,
        message: '💡 简单任务，可以直接执行。如需创建Dev Docs，请使用 /dev-docs 命令。'
      };
    }
  }

  /**
   * 从用户输入中提取项目名称
   */
  extractProjectName(userInput) {
    // 尝试从输入中提取项目名称
    const projectPatterns = [
      /project\s+(\w+)/i,
      /build\s+(\w+)/i,
      /create\s+(\w+)/i,
      /implement\s+(\w+)/i,
      /develop\s+(\w+)/i
    ];

    for (const pattern of projectPatterns) {
      const match = userInput.match(pattern);
      if (match && match[1]) {
        return match[1].toLowerCase().replace(/\s+/g, '-');
      }
    }

    return null;
  }
}

// 导出Hook实例
module.exports = new DevDocsWorkflowHook();