/**
 * Dev Docs工作流Hook - LaunchX混合协作架构版
 *
 * 核心理念：5步认知法(思维指导) + Dev Docs(执行系统) + 资源调度三步法
 * 集成GitHub仓库最佳实践，形成完整的"思考-调度-执行-记忆"闭环
 *
 * 功能：
 * 1. Level S/M/L 自动识别与决策矩阵
 * 2. 资源调度三步法：Assess→Gather→Deliver
 * 3. Dev Docs三文件标准化创建
 * 4. GitHub仓库模板集成（diet103/claude-code-infrastructure-showcase）
 * 5. SESSION PROGRESS 模式支持
 * 6. 工程基础设施状态验证
 */

const fs = require('fs');
const path = require('path');

class DevDocsWorkflowHook {
  constructor() {
    this.devDocsDir = 'dev-docs';

    // Level S/M/L 决策矩阵配置 - 与user-prompt-submit.js保持一致
    this.levelMatrix = {
      S: {
        triggers: ['单一问题|什么是|解释|说明|介绍|如何|为什么|区别|对比|示例|演示', '无需写文件|快速澄清|简单查询|直接回答|解释概念'],
        maxSteps: 3,
        requiresDevDocs: false,
        priority: 'lightweight'
      },
      M: {
        triggers: ['资料对比|方案设计|架构方案|引用依据|标准检索|多步骤实现', '对比一下|设计|实现|创建|构建|开发'],
        maxSteps: 10,
        requiresDevDocs: true,
        priority: 'standard'
      },
      L: {
        triggers: ['系统重构|微服务架构|前端.*后端.*数据库|完整平台|跨域影响|高风险|结构化交付', '重构整个|构建.*完整|包含.*前端.*后端.*数据库|微服务'],
        maxSteps: 20,
        requiresDevDocs: true,
        priority: 'structured'
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
   * Level S/M/L 智能分类 - 使用与user-prompt-submit.js相同的逻辑
   */
  classifyTaskLevel(userInput, context) {
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
   * Step 1: Assess - 分级判定
   */
  assessLevel(userInput, context) {
    let detectedLevel = 'S'; // 默认Level S
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

    // 检查文件复杂度
    const fileOperations = context.recentFiles?.length || 0;
    const estimatedSteps = this.estimateSteps(userInput);

    // 升级规则
    if (detectedLevel === 'S' && (estimatedSteps > this.levelMatrix.S.maxSteps || fileOperations > 3)) {
      detectedLevel = 'M';
    }
    if (detectedLevel === 'M' && (estimatedSteps > this.levelMatrix.M.maxSteps || fileOperations > 5)) {
      detectedLevel = 'L';
    }

      return {
      level: detectedLevel,
      estimatedSteps,
      fileOperations,
      requiresDevDocs: this.levelMatrix[detectedLevel].requiresDevDocs,
      priority: this.levelMatrix[detectedLevel].priority,
      matchedTrigger,
      requiresPhase0: detectedLevel !== 'S',
      isQuickAnswer: detectedLevel === 'S'
    };
  }

  /**
   * Step 2: Gather - 知识整合
   */
  gatherResources(userInput, levelAssessment) {
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
    if (levelAssessment.level === 'M' || levelAssessment.level === 'L') {
      resources.mcp.push('rube', 'context7', 'tavily');
      resources.summary = '需要外部资料对比和方案验证';
    }

    return resources;
  }

  /**
   * Step 3: Deliver - 执行固化
   */
  deliverClassification(levelAssessment, resourceNeeds) {
    return {
      level: levelAssessment.level,
      priority: levelAssessment.priority,
      requiresDevDocs: levelAssessment.requiresDevDocs,
      resourcePlan: resourceNeeds,
      decisionReason: `基于Level ${levelAssessment.level}决策矩阵，优先级：${levelAssessment.priority}`,
      estimatedSteps: levelAssessment.estimatedSteps
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
   * 创建Dev Docs三文件模板 - 集成GitHub最佳实践
   */
  createDevDocsTemplates(projectName, userInput, classification) {
    const timestamp = new Date().toISOString().split('T')[0];
    const projectDir = path.join(this.devDocsDir, projectName);

    // 确保目录存在
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }

    // 基于GitHub仓库的最佳实践生成模板
    const planTemplate = this.generateGitHubBasedPlanTemplate(projectName, userInput, classification);
    const contextTemplate = this.generateGitHubBasedContextTemplate(projectName, classification);
    const tasksTemplate = this.generateGitHubBasedTasksTemplate(projectName, userInput, classification);

    fs.writeFileSync(path.join(projectDir, 'plan.md'), planTemplate);
    fs.writeFileSync(path.join(projectDir, 'context.md'), contextTemplate);
    fs.writeFileSync(path.join(projectDir, 'tasks.md'), tasksTemplate);

    return {
      projectDir,
      files: ['plan.md', 'context.md', 'tasks.md'],
      classification: classification,
      message: `🎯 Dev Docs已创建：${projectDir}/ [Level ${classification.level} - ${classification.priority}]`
    };
  }

  /**
   * 生成GitHub最佳实践的plan.md模板 - 目标记忆
   */
  generateGitHubBasedPlanTemplate(projectName, userInput, classification) {
    return `---
title: "${projectName} Project Plan"
owners: ["LaunchX Team"]
status: "active"
last_update: "${new Date().toISOString().split('T')[0]}"
project: "${projectName}"
complexity: "Level ${classification.level}"
source: "LaunchX Dev Docs方法论 + GitHub最佳实践"
impact: "high"
version: "1.0.0"
---

# ${projectName} - Project Plan

## 📋 Executive Summary
<!-- 来自Collect阶段的需求分析 + GitHub README模式 -->

**项目类型**: ${classification.level === 'L' ? '复杂系统重构' : '功能实现'}
**预估工期**: ${classification.estimatedSteps} 步骤
**优先级**: ${classification.priority}

### 核心目标
- [ ] **主要目标**: ${userInput.substring(0, 150)}...
- [ ] **交付保障**: 基于GitHub CI/CD的最佳实践
- [ ] **质量标准**: 遵循LaunchX企业级开发规范

### 成功标准 (GitHub-inspired)
- [ ] ✅ **功能完整性**: 通过GitHub Actions自动测试
- [ ] ✅ **性能指标**: 达到预设基准并持续监控
- [ ] ✅ **代码质量**: 通过ESLint/Prettier + Code Review
- [ ] ✅ **文档完整**: README + API文档 + 部署指南齐全

## 🏗️ Current State Analysis
<!-- 来自Model阶段的现状分析 -->

### 现有资产评估
${classification.level === 'L' ? '- [ ] **复杂度评估**: 高，需要分阶段实施' : '- [ ] **复杂度评估**: 中等，可直接开发'}
- [ ] **技术债务**: 评估现有代码质量
- [ ] **依赖分析**: 检查第三方库兼容性
- [ ] **团队技能**: 评估技术栈熟悉度

### 技术栈决策
基于GitHub生态系统选择：
- **前端**: React + TypeScript + Vite (GitHub原生支持)
- **后端**: Node.js + Express + TypeScript
- **数据库**: PostgreSQL + Prisma ORM
- **部署**: GitHub Actions + Docker + PM2

## 📈 Implementation Phases
<!-- 来自Compare阶段的方案选择 + GitHub项目管理最佳实践 -->

### Phase 1: Foundation Setup (基础设施搭建)
**目标**: 建立可扩展的开发基础

**关键任务**:
- [ ] 🏗️ **项目初始化**
  - [ ] 创建GitHub仓库，设置标准分支策略
  - [ ] 配置GitHub Actions CI/CD流水线
  - [ ] 设置代码质量检查 (ESLint, Prettier, Husky)
- [ ] 🔧 **开发环境**
  - [ ] Docker化开发环境
  - [ ] PM2配置文件设置
  - [ ] 环境变量管理 (.env.example)
- [ ] 📚 **文档基础**
  - [ ] README.md (项目介绍、快速开始、贡献指南)
  - [ ] CHANGELOG.md (版本变更记录)
  - [ ] LICENSE (开源协议)

### Phase 2: Core Implementation (核心功能实现)
**目标**: 实现主要业务功能

**关键任务**:
- [ ] 🎯 **功能开发**
  - [ ] 核心API设计与实现
  - [ ] 数据模型设计与迁移
  - [ ] 前端组件开发
- [ ] 🔗 **集成开发**
  - [ ] 前后端API联调
  - [ ] 第三方服务集成
  - [ ] 错误处理和日志记录

### Phase 3: Quality Assurance (质量保障)
**目标**: 确保企业级代码质量

**关键任务**:
- [ ] 🧪 **测试覆盖**
  - [ ] 单元测试 (Jest)
  - [ ] 集成测试 (Supertest)
  - [ ] E2E测试 (Playwright)
- [ ] 🔍 **代码质量**
  - [ ] TypeScript严格模式
  - [ ] 代码覆盖率 (>90%)
  - [ ] 性能测试 (Lighthouse)

### Phase 4: Production Deployment (生产部署)
**目标**: 稳定的生产环境部署

**关键任务**:
- [ ] 🚀 **部署准备**
  - [ ] 生产环境配置
  - [ ] 数据库迁移脚本
  - [ ] 健康检查实现
- [ ] 📊 **监控运维**
  - [ ] PM2进程监控
  - [ ] 日志聚合 (Winston)
  - [ ] 错误追踪 (Sentry)

## ⚠️ Risk Matrix (GitHub项目管理风格)
<!-- 来自Compare阶段的风险评估 -->

| 风险类型 | 概率 | 影响 | 缓解策略 | GitHub解决方案 |
|----------|------|------|----------|----------------|
| **技术风险** | 中 | 高 | 充分调研 + 原型验证 | GitHub Discussions技术讨论 |
| **时间风险** | 中 | 中 | 分阶段交付 + MVP优先 | GitHub Projects里程碑管理 |
| **质量风险** | 低 | 高 | 自动化测试 + Code Review | GitHub Actions PR检查 |
| **团队风险** | 低 | 中 | 文档完善 + 知识共享 | GitHub Wiki + README模板 |

## ✅ Acceptance Criteria (GitHub标准)
<!-- 来自Align阶段的验收确认 -->

### 功能验收标准
- [ ] **核心功能**: 所有用户故事完成并通过验收测试
- [ ] **用户体验**: 界面响应式设计，无障碍访问支持
- [ ] **性能指标**: 页面加载时间 < 2秒，API响应 < 500ms

### 技术验收标准
- [ ] **代码质量**: TypeScript严格模式，0 linting errors
- [ ] **测试覆盖**: 单元测试覆盖率 > 90%，集成测试覆盖关键路径
- [ ] **安全检查**: 通过OWASP安全扫描，无高危漏洞

### 交付验收标准
- [ ] **部署就绪**: Docker镜像构建成功，环境变量配置完整
- [ ] **监控配置**: PM2监控、日志收集、错误追踪全部就位
- [ ] **文档完整**: README、API文档、部署指南、运维手册齐全

## 📊 Success Metrics (可观测性指标)
<!-- LaunchX"可观测性=能力"原则体现 -->

### 开发效率指标
- **代码提交频率**: 每日提交次数，开发活跃度
- **PR合并时间**: 从创建到合并的平均时间
- **构建成功率**: GitHub Actions构建成功率 > 95%

### 质量指标
- **Bug密度**: 每千行代码的Bug数量 < 1
- **测试覆盖率**: 代码测试覆盖率 > 90%
- **性能回归**: 版本间性能变化 < 5%

### 运维指标
- **系统可用性**: 服务可用性 > 99.9%
- **响应时间**: API平均响应时间 < 500ms
- **错误率**: 5xx错误率 < 0.1%

---
**创建时间**: ${new Date().toISOString()}
**更新周期**: 每个Phase完成后更新
**责任人**: LaunchX Team
**GitHub仓库**: 待创建
**CI/CD状态**: 待配置
`;
  }

  /**
   * 生成GitHub最佳实践的context.md模板 - 状态记忆 + SESSION PROGRESS
   */
  generateGitHubBasedContextTemplate(projectName, classification) {
    return `---
title: "${projectName} Project Context"
owners: ["LaunchX Team"]
status: "active"
last_update: "${new Date().toISOString().split('T')[0]}"
project: "${projectName}"
type: "context"
source: "LaunchX Dev Docs方法论 + GitHub最佳实践"
complexity: "Level ${classification.level}"
---

# ${projectName} - Project Context

## 🎯 SESSION PROGRESS
<!-- GitHub风格的项目进度追踪 - 实时更新 -->

### 当前会话状态
**Session开始时间**: ${new Date().toISOString()}
**任务等级**: Level ${classification.level} (${classification.priority})
**预估步骤**: ${classification.estimatedSteps}

### 进度概览
- **✅ 已完成**: 0 / ${classification.estimatedSteps} 步骤
- **🟡 进行中**: 0 个任务
- **⚠️ 阻塞项**: 0 个阻塞
- **📊 总体进度**: 0%

### Quick Resume (快速恢复)
\`\`\`bash
# 快速恢复开发环境命令
npm install                    # 安装依赖
npm run dev                    # 启动开发服务器
pm2 start ecosystem.config.js   # 启动PM2进程管理
npm run test                   # 运行测试套件
\`\`\`

## 🌍 System Environment
<!-- 来自Collect阶段的上下文加载 + GitHub环境标准 -->

### Technology Stack (基于GitHub生态)
- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Testing**: Jest + Supertest + Playwright
- **Deployment**: GitHub Actions + Docker + PM2
- **Monitoring**: Winston + Sentry + PM2 Monitoring

### Development Environment
- **Node.js**: \`${process.version}\`
- **npm**: \`${this.getNpmVersion()}\`
- **Platform**: \`${process.platform}\`
- **Git**: \`${this.getGitVersion()}\`
- **Docker**: \`${this.getDockerVersion()}\`

### GitHub Integration Status
- **Repository**: 待创建
- **Actions CI/CD**: 待配置
- **Projects Kanban**: 待设置
- **Wiki Documentation**: 待初始化
- **Discussions**: 待启用

## 📁 Project Structure (GitHub标准结构)
<!-- 来自Model阶段的环境分析 -->

\`\`\`
${projectName}/
├── .github/                   # GitHub配置
│   ├── workflows/            # GitHub Actions
│   ├── ISSUE_TEMPLATE/       # Issue模板
│   └── PULL_REQUEST_TEMPLATE.md
├── src/                       # 源代码
│   ├── components/           # React组件
│   ├── pages/               # 页面组件
│   ├── api/                 # API路由
│   └── utils/               # 工具函数
├── tests/                     # 测试文件
│   ├── unit/                # 单元测试
│   ├── integration/         # 集成测试
│   └── e2e/                 # E2E测试
├── docs/                      # 项目文档
│   ├── api/                 # API文档
│   └── guides/              # 使用指南
├── scripts/                   # 构建脚本
├── docker/                    # Docker配置
├── .env.example              # 环境变量模板
├── package.json              # 项目配置
├── README.md                 # 项目说明
├── CHANGELOG.md              # 变更日志
├── LICENSE                   # 开源协议
├── .gitignore               # Git忽略文件
├── .dockerignore             # Docker忽略文件
├── ecosystem.config.js       # PM2配置
├── docker-compose.yml        # Docker Compose配置
└── dev-docs/                 # Dev Docs (当前目录)
    ├── plan.md               # 项目计划
    ├── context.md            # 项目上下文 (本文件)
    └── tasks.md              # 任务清单
\`\`\`

## 🔧 Configuration & Constraints
<!-- 关键配置和约束条件 + GitHub最佳实践 -->

### Environment Variables
\`\`\`bash
# 开发环境
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://localhost:5432/\${DB_NAME}
API_BASE_URL=http://localhost:3000

# GitHub配置
GITHUB_TOKEN=your_github_token
GITHUB_REPO=your-username/\${projectName}

# 监控配置
SENTRY_DSN=your_sentry_dsn
LOG_LEVEL=debug
\`\`\`

### Development Dependencies Status
- **✅ 核心依赖**: package.json已配置
- **🟡 开发依赖**: 待执行 npm install
- **🟡 测试依赖**: Jest配置待完成
- **🟡 构建工具**: Vite + TypeScript待设置

### GitHub Actions CI/CD Pipeline (待配置)
\`\`\`yaml
# .github/workflows/ci.yml 概览
name: CI/CD Pipeline
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
\`\`\`

## 📊 Current Status & Metrics
<!-- 实时更新的项目状态 + LaunchX可观测性原则 -->

### Development Progress
- **Code Completion**: 0% (0/${classification.estimatedSteps} features)
- **Test Coverage**: 0% (0 tests written)
- **Documentation**: 100% (Dev Docs initialized)
- **CI/CD Setup**: 0% (GitHub Actions pending)

### Quality Metrics (LaunchX可观测性)
- **Performance Baseline**: 待测试 (Lighthouse target: >90)
- **Code Quality Score**: 待评估 (ESLint + Prettier target: 0 errors)
- **Security Scan**: 待执行 (OWASP ZAP target: 0 high vulnerabilities)
- **User Feedback**: 待收集 (Post-launch metric)

### System Health (实时监控)
- **Build Status**: 🟢 Not configured yet
- **Test Status**: 🟢 No tests to run
- **Deployment Status**: 🟢 Not deployed
- **Monitoring Status**: 🟢 PM2 not started

## 🎯 Decision Records (ADRs)
<!-- 重要决策的历史记录 + GitHub ADR模式 -->

### ADR-001: Architecture Decision
- **Date**: ${new Date().toISOString().split('T')[0]}
- **Status**: Proposed
- **Decision**: 采用LaunchX Dev Docs工作流 + GitHub标准开发流程
- **Context**: 解决AI失忆问题，确保项目连续性和团队协作效率
- **Consequences**:
  - ✅ Positive: 提升开发效率，降低项目风险
  - ➖ Negative: 需要额外维护文档
  - 📊 Impact: 高影响，中等复杂度

### ADR-002: Technology Stack Selection
- **Date**: ${new Date().toISOString().split('T')[0]}
- **Status**: Accepted
- **Decision**: Node.js + React + TypeScript + PostgreSQL技术栈
- **Context**: 基于GitHub生态系统兼容性和团队技能考虑
- **Consequences**:
  - ✅ Positive: GitHub原生支持，社区生态丰富
  - ➖ Negative: 学习曲线相对陡峭
  - 📊 Impact: 中等影响，低风险

### ADR-003: Process Management
- **Date**: ${new Date().toISOString().split('T')[0]}
- **Status**: Accepted
- **Decision**: 使用PM2进行进程管理和监控
- **Context**: Reddit指南推荐，企业级可观测性要求
- **Consequences**:
  - ✅ Positive: 增强调试能力，改善运维体验
  - ➖ Negative: 增加配置复杂度
  - 📊 Impact: 中等影响，低风险

## 🔄 Session Handoff Information
<!-- 会话交接信息 - 确保连续性 -->

### Next Session Quick Start
1. **恢复上下文**: 阅读本文件的SESSION PROGRESS部分
2. **检查环境**: 运行 \`npm run dev\` 和 \`pm2 status\`
3. **继续任务**: 参考tasks.md中的下一个待完成任务
4. **更新状态**: 更新SESSION PROGRESS中的进度信息

### Critical Information for Continuity
- **Project Directory**: \`${process.cwd()}/dev-docs/${projectName}\`
- **Main Configuration**: \`package.json\`, \`ecosystem.config.js\`
- **Key Commands**: \`npm run dev\`, \`npm test\`, \`pm2 restart\`
- **Documentation**: 本context.md文件是项目的"单一信息源"

---
**最后更新**: ${new Date().toISOString()}
**更新频率**: 每个重要决策后更新
**维护者**: LaunchX Team
**GitHub集成**: 待配置
**PM2监控**: 待启动
**下次会话恢复**: 查看SESSION PROGRESS部分
`;
  }

  /**
   * 生成GitHub最佳实践的tasks.md模板 - 进度记忆 + 责任人追踪
   */
  generateGitHubBasedTasksTemplate(projectName, userInput, classification) {
    return `---
title: "${projectName} Task Management"
owners: ["LaunchX Team"]
status: "active"
last_update: "${new Date().toISOString().split('T')[0]}"
project: "${projectName}"
type: "tasks"
source: "LaunchX Dev Docs方法论 + GitHub最佳实践"
complexity: "Level ${classification.level}"
total_tasks: ${classification.estimatedSteps}
---

# ${projectName} - Task Management

## 📊 Task Overview (GitHub Projects风格)
<!-- 来自Model阶段的问题拆解 + GitHub Projects最佳实践 -->

### 任务统计
- **📋 总任务数**: ${classification.estimatedSteps} 个任务
- **✅ 已完成**: 0 个任务 (0%)
- **🟡 进行中**: 0 个任务
- **⚠️ 阻塞**: 0 个任务
- **📅 待开始**: ${classification.estimatedSteps} 个任务

### 里程碑追踪
- **🎯 Phase 1**: Foundation Setup (0/5 完成)
- **🎯 Phase 2**: Core Implementation (0/8 完成)
- **🎯 Phase 3**: Quality Assurance (0/6 完成)
- **🎯 Phase 4**: Production Deployment (0/5 完成)

## 📋 Phase 1: Foundation Setup (基础设施搭建)
**预计工期**: 3-5天 | **负责人**: LaunchX Team | **优先级**: 🔴 High

### 1.1 项目初始化 (GitHub标准)
- [ ] **🏗️ 创建GitHub仓库**
  - [ ] 创建私有/公开仓库
  - [ ] 设置标准分支策略 (main/develop/feature/*)
  - [ ] 配置分支保护规则
  - [ ] 设置仓库描述和标签
  - **验收标准**: 仓库创建成功，分支策略生效
  - **预计时间**: 30分钟

- [ ] **⚙️ 配置GitHub Actions CI/CD**
  - [ ] 创建 \`.github/workflows/ci.yml\`
  - [ ] 配置Node.js构建环境
  - [ ] 设置自动测试流水线
  - [ ] 配置自动部署到staging
  - **验收标准**: Push触发CI/CD，测试自动运行
  - **预计时间**: 2小时

- [ ] **📝 初始化项目配置文件**
  - [ ] 创建 \`package.json\` (包含所有依赖)
  - [ ] 配置 \`tsconfig.json\` (TypeScript严格模式)
  - [ ] 设置 \`.eslintrc.js\` + \`.prettierrc\`
  - [ ] 配置 \`husky\` + \`lint-staged\`
  - **验收标准**: 所有配置文件生效，无linting错误
  - **预计时间**: 1小时

### 1.2 开发环境配置
- [ ] **🐳 Docker化开发环境**
  - [ ] 创建 \`Dockerfile\` (多阶段构建)
  - [ ] 配置 \`docker-compose.yml\` (开发环境)
  - [ ] 设置 \`.dockerignore\`
  - [ ] 验证容器构建和运行
  - **验收标准**: Docker容器正常启动，开发环境可用
  - **预计时间**: 3小时

- [ ] **🔧 PM2进程管理配置**
  - [ ] 创建 \`ecosystem.config.js\`
  - [ ] 配置开发/生产环境
  - [ ] 设置日志轮转和监控
  - [ ] 配置自动重启策略
  - **验收标准**: PM2正常启动应用，日志记录正常
  - **预计时间**: 1小时

### 1.3 文档基础 (GitHub README标准)
- [ ] **📚 创建核心文档**
  - [ ] \`README.md\` (项目介绍、安装、使用、贡献)
  - [ ] \`CHANGELOG.md\` (版本变更记录)
  - [ ] \`LICENSE\` (开源协议选择)
  - [ ] \`.env.example\` (环境变量模板)
  - **验收标准**: 文档完整，新手可快速上手
  - **预计时间**: 2小时

## 📋 Phase 2: Core Implementation (核心功能实现)
**预计工期**: 5-8天 | **负责人**: LaunchX Team | **优先级**: 🔴 High

### 2.1 架构设计与数据模型
- [ ] **🏗️ 系统架构设计**
  - [ ] 绘制系统架构图
  - [ ] 定义API接口规范
  - [ ] 设计数据库ER图
  - [ ] 制定编码规范
  - **验收标准**: 架构文档完整，团队达成共识
  - **预计时间**: 4小时

- [ ] **🗄️ 数据库设计与实现**
  - [ ] 创建数据库迁移脚本
  - [ ] 实现Prisma数据模型
  - [ ] 配置数据库连接池
  - [ ] 编写数据库种子数据
  - **验收标准**: 数据库迁移成功，基础数据可用
  - **预计时间**: 6小时

### 2.2 后端核心功能开发
- [ ] **🔌 API接口实现**
  - [ ] 实现认证授权中间件
  - [ ] 创建RESTful API路由
  - [ ] 实现数据CRUD操作
  - [ ] 添加API文档 (Swagger)
  - **验收标准**: API接口完整，文档齐全
  - **预计时间**: 12小时

- [ ] **🛡️ 安全与错误处理**
  - [ ] 实现输入验证和清理
  - [ ] 配置CORS策略
  - [ ] 添加全局错误处理中间件
  - [ ] 实现日志记录系统
  - **验收标准**: 安全测试通过，错误处理完善
  - **预计时间**: 4小时

### 2.3 前端核心功能开发
- [ ] **⚛️ React组件开发**
  - [ ] 创建项目路由结构
  - [ ] 实现核心业务组件
  - [ ] 配置状态管理 (Context/Redux)
  - [ ] 实现响应式布局
  - **验收标准**: 核心功能可用，移动端适配
  - **预计时间**: 16小时

- [ ] **🔗 前后端集成**
  - [ ] 实现API客户端封装
  - [ ] 处理异步数据加载
  - [ ] 实现错误边界组件
  - [ ] 添加加载状态管理
  - **验收标准**: 前后端数据流通畅，用户体验良好
  - **预计时间**: 8小时

## 📋 Phase 3: Quality Assurance (质量保障)
**预计工期**: 3-6天 | **负责人**: LaunchX Team | **优先级**: 🟡 Medium

### 3.1 测试覆盖 (TDD方式)
- [ ] **🧪 单元测试**
  - [ ] 后端API单元测试 (Jest)
  - [ ] 前端组件单元测试 (React Testing Library)
  - [ ] 工具函数单元测试
  - [ ] 数据库操作单元测试
  - **验收标准**: 测试覆盖率 > 80%
  - **预计时间**: 8小时

- [ ] **🔗 集成测试**
  - [ ] API端到端测试 (Supertest)
  - [ ] 数据库集成测试
  - [ ] 第三方服务集成测试
  - [ ] 前后端集成测试
  - **验收标准**: 关键业务流程测试通过
  - **预计时间**: 6小时

- [ ] **🌐 E2E测试**
  - [ ] 用户关键路径测试 (Playwright)
  - [ ] 跨浏览器兼容性测试
  - [ ] 移动端响应式测试
  - [ ] 性能基准测试
  - **验收标准**: 核心用户场景测试通过
  - **预计时间**: 8小时

### 3.2 代码质量与性能优化
- [ ] **🔍 代码质量检查**
  - [ ] TypeScript严格模式检查
  - [ ] ESLint规则完善
  - [ ] 代码复杂度分析
  - [ ] 安全漏洞扫描
  - **验收标准**: 0 high-priority issues
  - **预计时间**: 4小时

- [ ] **⚡ 性能优化**
  - [ ] 前端代码分割和懒加载
  - [ ] API响应时间优化
  - [ ] 数据库查询优化
  - [ ] 静态资源压缩
  - **验收标准**: Lighthouse分数 > 90
  - **预计时间**: 6小时

## 📋 Phase 4: Production Deployment (生产部署)
**预计工期**: 2-4天 | **负责人**: LaunchX Team | **优先级**: 🟡 Medium

### 4.1 部署准备
- [ ] **🚀 生产环境配置**
  - [ ] 生产环境变量配置
  - [ ] 数据库生产环境设置
  - [ ] SSL证书配置
  - [ ] 域名和DNS配置
  - **验收标准**: 生产环境可访问，HTTPS正常
  - **预计时间**: 4小时

- [ ] **📦 CI/CD流水线完善**
  - [ ] 生产环境自动部署
  - [ ] 数据库迁移自动化
  - [ ] 健康检查集成
  - [ ] 回滚机制实现
  - **验收标准**: 一键部署成功，回滚可用
  - **预计时间**: 6小时

### 4.2 监控与运维
- [ ] **📊 监控系统配置**
  - [ ] PM2进程监控仪表板
  - [ ] 日志聚合和分析
  - [ ] 错误追踪系统 (Sentry)
  - [ ] 性能监控指标
  - **验收标准**: 监控数据正常，告警及时
  - **预计时间**: 4小时

- [ ] **📖 运维文档完善**
  - [ ] 部署手册编写
  - [ ] 故障排查指南
  - [ ] 性能调优文档
  - [ ] 安全运维规范
  - **验收标准**: 文档完整，新人可独立运维
  - **预计时间**: 3小时

## 🚧 Blockers & Issues (阻塞问题追踪)
<!-- 阻塞任务的问题和解决方案 - GitHub Issues风格 -->

### Current Blockers (当前阻塞)
- [ ] **🟢 无阻塞问题** - 项目刚开始，进展顺利

### Risk Mitigation (风险缓解)
- [ ] **⚠️ 技术风险**: 新技术栈学习曲线
  - **缓解策略**: 预留学习时间，准备技术调研
  - **责任人**: LaunchX Team
  - **状态**: 监控中

### Dependencies Management (依赖管理)
- [ ] **🔗 外部依赖**: GitHub Actions配置
  - **依赖项**: GitHub平台稳定性
  - **备选方案**: 自建CI/CD服务器
  - **状态**: 可用

## 📈 Quality Gates (质量门禁)
<!-- GitHub Pull Request模板风格的质量检查点 -->

### Phase Completion Criteria (阶段完成标准)
每个Phase完成前必须满足：

**Phase 1 完成标准**:
- [ ] ✅ GitHub仓库设置完成
- [ ] ✅ CI/CD流水线可正常运行
- [ ] ✅ 开发环境Docker化成功
- [ ] ✅ PM2配置验证通过
- [ ] ✅ 基础文档齐全

**Phase 2 完成标准**:
- [ ] ✅ 所有API接口实现并测试
- [ ] ✅ 前端核心功能可用
- [ ] ✅ 数据库设计稳定
- [ ] ✅ 前后端集成无问题
- [ ] ✅ 安全检查通过

**Phase 3 完成标准**:
- [ ] ✅ 测试覆盖率 > 80%
- [ ] ✅ 性能基准达标
- [ ] ✅ 代码质量检查通过
- [ ] ✅ 安全扫描无高危漏洞
- [ ] ✅ E2E测试稳定

**Phase 4 完成标准**:
- [ ] ✅ 生产环境部署成功
- [ ] ✅ 监控系统正常运行
- [ ] ✅ 运维文档完整
- [ ] ✅ 备份策略实施
- [ ] ✅ 用户验收测试通过

## 📊 Progress Tracking (进度追踪)
<!-- GitHub Projects风格的进度可视化 -->

### Burndown Chart (燃尽图)
- **开始日期**: ${new Date().toISOString().split('T')[0]}
- **目标完成日期**: 待定
- **当前进度**: 0/${classification.estimatedSteps} (0%)
- **预计剩余时间**: ${Math.ceil(classification.estimatedSteps * 0.5)} 天

### Velocity Metrics (速度指标)
- **平均任务完成时间**: 待统计
- **任务完成率**: 0%
- **质量返工率**: 0%
- **Blocker解决时间**: N/A

---
**任务统计详情**:
- **总任务数**: ${classification.estimatedSteps}
- **已完成**: 0
- **进行中**: 0
- **待开始**: ${classification.estimatedSteps}
- **进度计算**: 0% (0/${classification.estimatedSteps})

**质量检查点**: 每个Phase结束时进行全面质量评估
**最后更新**: ${new Date().toISOString()}
**更新频率**: 每个任务完成后更新
**GitHub集成**: 项目管理采用GitHub Projects
**PM2监控**: 进程状态实时监控
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
   * 获取Git版本
   */
  getGitVersion() {
    try {
      const { execSync } = require('child_process');
      return execSync('git --version', { encoding: 'utf8' }).trim();
    } catch (error) {
      return '未安装';
    }
  }

  /**
   * 获取Docker版本
   */
  getDockerVersion() {
    try {
      const { execSync } = require('child_process');
      return execSync('docker --version', { encoding: 'utf8' }).trim();
    } catch (error) {
      return '未安装';
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
  generateDomainAnalysis(userInput, classification) {
    const isComplex = classification.level === 'L';
    return {
      '技术维度分析': {
        技术栈: this.analyzeTechStack(userInput),
        架构复杂度: isComplex ? '高' : '中',
        依赖关系: '待分析',
        集成难度: '待评估'
      },

      '业务维度分析': {
        业务价值: this.analyzeBusinessValue(userInput),
        用户影响: this.analyzeUserImpact(userInput),
        数据复杂度: '待分析',
        流程复杂度: '待评估'
      },

      '质量维度分析': {
        代码质量要求: '高',
        测试覆盖目标: '≥90%',
        性能要求: this.analyzePerformanceRequirements(userInput),
        安全要求: '中高'
      },

      '运维维度分析': {
        部署复杂度: isComplex ? '高' : '中',
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
    const classification = this.classifyTaskLevel(userInput, context);
    console.log(`📊 任务复杂度分析: Level ${classification.level} (${classification.priority}, 预估步骤: ${classification.estimatedSteps})`);

    // 2. 如果是复杂任务，强制创建Dev Docs
    if (classification.level === 'M' || classification.level === 'L') {
      console.log('🚨 检测到复杂任务，自动启动Dev Docs工作流...');

      // 提取项目名称
      const projectName = this.extractProjectName(userInput) || `project-${Date.now()}`;

      // 创建Dev Docs三文件
      const result = this.createDevDocsTemplates(projectName, userInput, classification);

      // 验证基础设施
      const infraStatus = this.validateInfrastructure();

      // 生成4维领域分析
      const domainAnalysis = this.generateDomainAnalysis(userInput, classification);

      console.log('✅ Dev Docs创建完成:', result.message);
      console.log('📋 基础设施状态:', infraStatus.map(item => `${item.name}: ${item.status}`).join(' | '));

      return {
        action: 'dev_docs_created',
        projectName,
        classification,
        files: result.files,
        infrastructure: infraStatus,
        domainAnalysis,
        message: `🎯 已为复杂任务创建Dev Docs工作环境。\\n\\n📁 项目位置: ${result.projectDir}\\n📄 包含文件: ${result.files.join(', ')}\\n\\n📋 下一步: 按照tasks.md中的清单开始执行，记得定期更新三个文件！`
      };
    } else {
      console.log('💡 检测到简单任务，可以继续直接执行。');
      return {
        action: 'simple_task',
        classification,
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