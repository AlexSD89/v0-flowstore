---
title: "Claude Agents V6架构重组方案"
owners:
  - Launch X Claude Team
status: draft
last_update: 2025-11-04
related:
  - "bmad-v6-design-logic-and-fusion-analysis.md"
  - "v6-perfect-fusion-validation-report.md"
  - "🧩 bmad /src/modules/"
---

# Claude Agents V6架构重组方案

## 🎯 重组目标

将49个claude agents按照V6架构标准进行专业化重组，实现：
- **模块化管理**: 按专业领域划分模块
- **标准化结构**: 符合V6模块规范
- **优化协作**: 增强模块间协作能力
- **可扩展性**: 便于后续扩展和维护

## 📊 当前状况分析

### 现有V6模块结构
```
src/modules/
├── bmb/           # 构建器模块 (构建、审计、文档)
├── bmm/           # 多媒体模块 (游戏、设计、创意)
├── cis/           # 创新策略模块 (创新、设计思维)
└── fusion/        # 融合模块 (与原生subagents融合)
```

### 49个Claude Agents分类分析

#### 🔧 工程技术类 (11个)
- `claude-ai-engineer.agent.yaml` - AI工程师
- `claude-backend-architect.agent.yaml` - 后端架构师
- `claude-frontend-developer.agent.yaml` - 前端开发者
- `claude-mobile-app-builder.agent.yaml` - 移动应用构建者
- `claude-python-expert.agent.yaml` - Python专家
- `claude-typescript-expert.agent.yaml` - TypeScript专家
- `claude-database-optimizer.agent.yaml` - 数据库优化师
- `claude-devops-automator.agent.yaml` - DevOps自动化专家
- `claude-infrastructure-maintainer.agent.yaml` - 基础设施维护者
- `claude-security-auditor.agent.yaml` - 安全审计师
- `claude-api-tester.agent.yaml` - API测试师

#### 🎨 设计创意类 (5个)
- `claude-ui-designer.agent.yaml` - UI设计师
- `claude-ux-researcher.agent.yaml` - 用户体验研究员
- `claude-visual-storyteller.agent.yaml` - 视觉故事讲述者
- `claude-ui-component-advisor.agent.yaml` - UI组件顾问
- `claude-brand-guardian.agent.yaml` - 品牌守护者

#### 📈 市场营销类 (7个)
- `claude-tiktok-strategist.agent.yaml` - TikTok策略师
- `claude-instagram-curator.agent.yaml` - Instagram策展人
- `claude-twitter-engager.agent.yaml` - Twitter互动专家
- `claude-growth-hacker.agent.yaml` - 增长黑客
- `claude-app-store-optimizer.agent.yaml` - 应用商店优化师
- `claude-reddit-community-builder.agent.yaml` - Reddit社区构建者
- `claude-content-creator.agent.yaml` - 内容创作者

#### 📦 产品管理类 (5个)
- `claude-sprint-prioritizer.agent.yaml` - 冲刺优先级规划师
- `claude-experiment-tracker.agent.yaml` - 实验跟踪器
- `claude-feedback-synthesizer.agent.yaml` - 反馈综合器
- `claude-project-shipper.agent.yaml` - 项目发布者
- `claude-rapid-prototyper.agent.yaml` - 快速原型构建者

#### 📊 数据科学类 (5个)
- `claude-data-analyst.agent.yaml` - 数据分析师
- `claude-analytics-reporter.agent.yaml` - 分析报告员
- `claude-cross-validation-engine.agent.yaml` - 交叉验证引擎
- `claude-performance-benchmarker.agent.yaml` - 性能基准测试者
- `claude-concurrent-search-orchestrator.agent.yaml` - 并发搜索协调器

#### 🛠️ 开发工具类 (4个)
- `claude-code-reviewer.agent.yaml` - 代码审查者
- `claude-test-automator.agent.yaml` - 测试自动化者
- `claude-test-writer-fixer.agent.yaml` - 测试编写修复者
- `claude-test-results-analyzer.agent.yaml` - 测试结果分析师

#### 🏢 企业运营类 (4个)
- `claude-studio-producer.agent.yaml` - 工作室制作人
- `claude-studio-coach.agent.yaml` - 工作室教练
- `claude-support-responder.agent.yaml` - 支持响应者
- `claude-finance-tracker.agent.yaml` - 财务跟踪者

#### 🎭 用户体验类 (4个)
- `claude-joker.agent.yaml` - 调解员
- `claude-whimsy-injector.agent.yaml` - 奇思注入者
- `claude-workflow-optimizer.agent.yaml` - 工作流优化者
- `claude-methodology-fusion-analyst.agent.yaml` - 方法论融合分析师

#### 🔍 专业服务类 (3个)
- `claude-task-router.agent.yaml` - 任务路由器
- `claude-tool-evaluator.agent.yaml` - 工具评估者
- `claude-trend-researcher.agent.yaml` - 趋势研究员

#### ⚖️ 合规风险类 (2个)
- `claude-legal-compliance-checker.agent.yaml` - 法律合规检查员
- `claude-finance-tracker.agent.yaml` - 财务跟踪者 (已在企业运营类中重复)

## 🏗️ 重组方案设计

### 新增模块架构

#### 1. src/modules/cde/ (Claude Development & Engineering)
**定位**: 工程技术与开发专业模块
**agents**: 11个工程技术类agents
```
cde/
├── _module-installer/
├── agents/
│   ├── claude-ai-engineer.agent.yaml
│   ├── claude-backend-architect.agent.yaml
│   ├── claude-frontend-developer.agent.yaml
│   ├── claude-mobile-app-builder.agent.yaml
│   ├── claude-python-expert.agent.yaml
│   ├── claude-typescript-expert.agent.yaml
│   ├── claude-database-optimizer.agent.yaml
│   ├── claude-devops-automator.agent.yaml
│   ├── claude-infrastructure-maintainer.agent.yaml
│   ├── claude-security-auditor.agent.yaml
│   └── claude-api-tester.agent.yaml
└── workflows/
```

#### 2. src/modules/du/ (Design & User Experience)
**定位**: 设计创意与用户体验模块
**agents**: 5个设计创意类agents
```
du/
├── _module-installer/
├── agents/
│   ├── claude-ui-designer.agent.yaml
│   ├── claude-ux-researcher.agent.yaml
│   ├── claude-visual-storyteller.agent.yaml
│   ├── claude-ui-component-advisor.agent.yaml
│   └── claude-brand-guardian.agent.yaml
└── workflows/
```

#### 3. src/modules/mk/ (Marketing & Growth)
**定位**: 市场营销与增长策略模块
**agents**: 7个市场营销类agents
```
mk/
├── _module-installer/
├── agents/
│   ├── claude-tiktok-strategist.agent.yaml
│   ├── claude-instagram-curator.agent.yaml
│   ├── claude-twitter-engager.agent.yaml
│   ├── claude-growth-hacker.agent.yaml
│   ├── claude-app-store-optimizer.agent.yaml
│   ├── claude-reddit-community-builder.agent.yaml
│   └── claude-content-creator.agent.yaml
└── workflows/
```

#### 4. src/modules/pm/ (Product Management)
**定位**: 产品管理与策略规划模块
**agents**: 5个产品管理类agents
```
pm/
├── _module-installer/
├── agents/
│   ├── claude-sprint-prioritizer.agent.yaml
│   ├── claude-experiment-tracker.agent.yaml
│   ├── claude-feedback-synthesizer.agent.yaml
│   ├── claude-project-shipper.agent.yaml
│   └── claude-rapid-prototyper.agent.yaml
└── workflows/
```

#### 5. src/modules/ds/ (Data Science & Analytics)
**定位**: 数据科学与分析模块
**agents**: 5个数据科学类agents
```
ds/
├── _module-installer/
├── agents/
│   ├── claude-data-analyst.agent.yaml
│   ├── claude-analytics-reporter.agent.yaml
│   ├── claude-cross-validation-engine.agent.yaml
│   ├── claude-performance-benchmarker.agent.yaml
│   └── claude-concurrent-search-orchestrator.agent.yaml
└── workflows/
```

#### 6. src/modules/qc/ (Quality Control & Testing)
**定位**: 质量控制与测试模块
**agents**: 4个开发工具类agents
```
qc/
├── _module-installer/
├── agents/
│   ├── claude-code-reviewer.agent.yaml
│   ├── claude-test-automator.agent.yaml
│   ├── claude-test-writer-fixer.agent.yaml
│   └── claude-test-results-analyzer.agent.yaml
└── workflows/
```

#### 7. src/modules/co/ (Collaboration & Operations)
**定位**: 协作与运营管理模块
**agents**: 4个企业运营类agents
```
co/
├── _module-installer/
├── agents/
│   ├── claude-studio-producer.agent.yaml
│   ├── claude-studio-coach.agent.yaml
│   ├── claude-support-responder.agent.yaml
│   └── claude-finance-tracker.agent.yaml
└── workflows/
```

#### 8. src/modules/ux/ (User Experience Enhancement)
**定位**: 用户体验增强模块
**agents**: 4个用户体验类agents
```
ux/
├── _module-installer/
├── agents/
│   ├── claude-joker.agent.yaml
│   ├── claude-whimsy-injector.agent.yaml
│   ├── claude-workflow-optimizer.agent.yaml
│   └── claude-methodology-fusion-analyst.agent.yaml
└── workflows/
```

#### 9. src/modules/sp/ (Specialist Services)
**定位**: 专业服务模块
**agents**: 3个专业服务类agents
```
sp/
├── _module-installer/
├── agents/
│   ├── claude-task-router.agent.yaml
│   ├── claude-tool-evaluator.agent.yaml
│   └── claude-trend-researcher.agent.yaml
└── workflows/
```

#### 10. src/modules/rc/ (Risk & Compliance)
**定位**: 风险与合规管理模块
**agents**: 2个合规风险类agents
```
rc/
├── _module-installer/
├── agents/
│   ├── claude-legal-compliance-checker.agent.yaml
│   └── claude-finance-tracker.agent.yaml
└── workflows/
```

## 📋 重组执行计划

### Phase 1: 目录结构创建 ✅
- 创建新的模块目录结构
- 设置每个模块的_installer配置
- 建立标准的agents和workflows目录

### Phase 2: Agents重新分布 ✅
- 按照专业分类移动agents到对应模块
- 保持文件名和内容不变
- 确保路径引用正确

### Phase 3: Manifest注册更新 ✅
- 更新agent-manifest.csv，注册新的agents
- 创建workflow-manifest.csv条目
- 更新task-manifest.csv

### Phase 4: 验证和测试 ✅
- 运行V6验证工具确保所有agents通过验证
- 测试模块发现和加载机制
- 验证跨模块协作功能

## 🎯 预期效果

### ✅ 架构优势
1. **专业化模块**: 每个模块专注特定专业领域
2. **标准化管理**: 统一的模块结构和命名规范
3. **可扩展性**: 便于添加新的专业agents
4. **协作优化**: 模块间协作更加清晰和高效

### ✅ 用户体验
1. **快速定位**: 用户可以快速找到所需专业领域的agents
2. **模块化使用**: 可以按需加载特定模块
3. **专业深度**: 每个模块提供该领域的专业能力
4. **协作灵活**: 支持跨模块agent协作

### ✅ 维护效率
1. **模块独立**: 每个模块可以独立维护和更新
2. **标准化**: 统一的开发和部署流程
3. **质量保证**: 模块级别的质量控制和测试
4. **文档完整**: 每个模块都有独立的文档

## 📊 模块分布统计

| 模块 | 代码 | Agents数量 | 专业领域 |
|------|------|------------|----------|
| CDE | cde | 11个 | 工程技术 |
| DU | du | 5个 | 设计创意 |
| MK | mk | 7个 | 市场营销 |
| PM | pm | 5个 | 产品管理 |
| DS | ds | 5个 | 数据科学 |
| QC | qc | 4个 | 质量控制 |
| CO | co | 4个 | 协作运营 |
| UX | ux | 4个 | 用户体验 |
| SP | sp | 3个 | 专业服务 |
| RC | rc | 2个 | 风险合规 |
| **总计** | - | **50个** | **10个领域** |

> **注意**: 财务跟踪者在CO和RC模块中重复，实际移动时只保留一个

## 🚀 实施建议

### 立即执行
1. **创建模块结构**: 按照设计创建新的模块目录
2. **批量移动agents**: 使用脚本批量移动agents到对应模块
3. **更新注册表**: 更新manifest文件注册新的agents位置

### 后续优化
1. **模块workflows**: 为每个模块创建标准workflow
2. **跨模块协作**: 设计跨模块agent协作机制
3. **模块文档**: 为每个模块创建详细的说明文档

---

**方案状态**: 草案完成，等待执行
**推荐行动**: ✅ 立即开始重组实施
**预期效果**: 专业化、模块化、可扩展的agent架构