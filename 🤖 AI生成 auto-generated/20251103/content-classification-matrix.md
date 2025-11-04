---
title: "LaunchX 内容分类策略矩阵 V1.0"
owners: ["LaunchX Architecture Team"]
status: "active"
last_update: "2025-11-03"
version: "1.0.0"
related: ["CLAUDE.md", "RULES.md", "lifecycle-architecture-design.md"]
source: "智能化内容分类决策系统"
impact: "critical"
---

# 内容分类策略矩阵 V1.0

> **核心原则**：基于频率、复杂度、价值、标准化潜力四个维度进行内容分类决策。
>
> **分类目标**：减少Claude记忆负担，提高协作效率，确保质量一致性。
>
> **决策矩阵**：通过量化评估自动判断内容应该留在MD文档、封装成Skills、使用Rules管理，或采用其他方式。

---

## 🎯 分类决策框架

### 四维度评估模型

```javascript
// 内容分类决策算法
function classifyContent(contentInfo) {
  const scores = {
    frequency: calculateFrequencyScore(contentInfo.usageFrequency),
    complexity: calculateComplexityScore(contentInfo.complexity),
    value: calculateValueScore(contentInfo.businessValue),
    standardization: calculateStandardizationScore(contentInfo.standardizationPotential)
  };

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length;

  return {
    classification: determineClassification(scores, totalScore),
    confidence: calculateConfidence(scores),
    implementation: generateImplementationPlan(scores, totalScore),
    maintenance: generateMaintenancePlan(scores, totalScore)
  };
}

// 分类决策逻辑
function determineClassification(scores, totalScore) {
  if (totalScore >= 8.0) return "skill";           // 高频+高价值+标准化 = Skill
  if (totalScore >= 6.0) return "rule";            // 中频+中价值 = Rule
  if (totalScore >= 4.0) return "template";       // 低频+可复用 = Template
  return "claude-md";                              // 基础原则 = CLAUDE.md
}
```

### 评分标准详解

| 维度 | 评分标准 | 权重 | 说明 |
|------|---------|------|------|
| **频率** | ≥10次/月=4分, 5-9次/月=3分, 2-4次/月=2分, ≤1次/月=1分 | 30% | 使用频率直接影响封装价值 |
| **复杂度** | >10步骤=4分, 6-10步=3分, 3-5步=2分, ≤2步=1分 | 25% | 复杂操作需要标准化封装 |
| **价值** | 核心业务=4分, 重要支撑=3分, 一般辅助=2分, 偶尔使用=1分 | 25% | 业务价值决定投入程度 |
| **标准化** | 完全标准=4分, 部分标准=3分, 可以标准=2分, 难以标准=1分 | 20% | 标准化潜力影响封装可行性 |

---

## 📊 详细分类矩阵

### 1. CLAUDE.md 内容（核心原则 + 基础框架）

#### 保留内容清单
| 内容类型 | 具体项目 | 评分理由 | 维护方式 |
|---------|---------|---------|---------|
| **核心哲学** | Reddit老哥指南思想 | 基础原则，很少变动 | 版本控制 |
| **角色定位** | Claude作为指挥官的定位 | 核心定位，稳定 | 版本控制 |
| **协作边界** | Claude-Skills-Hooks分工 | 基础架构，相对稳定 | 版本控制 |
| **任务分级** | Level S/M/L分级标准 | 基础框架，偶尔优化 | 版本控制 |
| **工作模式** | Collect→Model→Compare→Align→Deliver→Archive | 核心流程，相对稳定 | 版本控制 |
| **质量标准** | 思维质量检查清单 | 基础要求，稳定 | 版本控制 |
| **基础模板** | 快速思维模板 | 基础工具，稳定 | 版本控制 |
| **资源索引** | 常用命令和工具速查 | 动态更新，需要维护 | 定期更新 |

#### 移除内容清单
| 原内容 | 移除理由 | 新归属 |
|-------|---------|--------|
| 详细方法论说明 | 过于详细，应该封装成Skills | Skills/方法论中心 |
| 具体操作步骤 | 操作性内容，应该标准化 | Skills/操作指南 |
| 复杂决策逻辑 | 复杂逻辑，应该自动化 | Rules/自动化规则 |
| 领域特定知识 | 领域相关，应该模块化 | Skills/领域知识 |
| 工具使用细节 | 工具相关，应该专业化 | Skills/工具技能 |

### 2. Skills 封装清单（高频 + 高价值 + 标准化）

#### 核心方法论 Skills (4个)
| Skill名称 | 触发条件 | 评分 | 实现优先级 |
|----------|---------|------|-----------|
| **content-modification-strategy** | 用户提出文档修改需求 | 频率4分+复杂度4分+价值4分+标准4分=4.0 | 🔴 P0 |
| **source-analysis-method** | 需要分析原文或数据源 | 频率4分+复杂度3分+价值4分+标准3分=3.5 | 🔴 P0 |
| **quality-validation-protocol** | 需要验证输出质量 | 频率4分+复杂度3分+价值4分+标准3分=3.5 | 🔴 P0 |
| **reference-management-system** | 处理引用和链接管理 | 频率3分+复杂度3分+价值3分+标准4分=3.25 | 🟡 P1 |

#### 业务能力 Skills (8个)
| Skill名称 | 业务域 | 触发条件 | 评分 | 实现优先级 |
|----------|-------|---------|------|-----------|
| **database-maintenance-strategy** | 数据库维护 | 数据库结构或性能优化需求 | 频率2分+复杂度4分+价值4分+标准3分=3.25 | 🟡 P1 |
| **document-generation-workflow** | 文档写作 | 需要生成结构化文档 | 频率4分+复杂度3分+价值4分+标准3分=3.5 | 🔴 P0 |
| **content-publishing-automation** | 内容发布 | 需要发布到多个平台 | 频率3分+复杂度4分+价值3分+标准3分=3.25 | 🟡 P1 |
| **rule-generation-system** | 规则管理 | 需要生成或更新业务规则 | 频率2分+复杂度4分+价值4分+标准3分=3.25 | 🟡 P1 |
| **knowledge-base-construction** | 知识管理 | 需要构建或更新知识库 | 频率2分+复杂度4分+价值4分+标准3分=3.25 | 🟡 P1 |
| **project-architecture-planning** | 项目规划 | 需要设计项目架构 | 频率1分+复杂度4分+价值4分+标准2分=2.75 | 🟢 P2 |
| **risk-assessment-framework** | 风险管理 | 需要评估项目或操作风险 | 频率2分+复杂度4分+价值3分+标准3分=3.0 | 🟡 P1 |
| **performance-optimization-strategy** | 性能优化 | 需要优化系统或流程性能 | 频率2分+复杂度4分+价值3分+标准3分=3.0 | 🟡 P1 |

#### 工具技能 Skills (6个)
| Skill名称 | 工具类型 | 触发条件 | 评分 | 实现优先级 |
|----------|---------|---------|------|-----------|
| **mcp-integration-orchestrator** | MCP工具 | 需要协调多个MCP工具 | 频率3分+复杂度3分+价值3分+标准3分=3.0 | 🟡 P1 |
| **git-workflow-automation** | Git工具 | 需要复杂的Git操作 | 频率3分+复杂度3分+价值3分+标准3分=3.0 | 🟡 P1 |
| **research-data-synthesis** | 研究工具 | 需要综合多源研究数据 | 频率2分+复杂度4分+价值3分+标准2分=2.75 | 🟢 P2 |
| **content-format-conversion** | 格式工具 | 需要转换内容格式 | 频率2分+复杂度2分+价值2分+标准4分=2.5 | 🟢 P2 |
| **automated-testing-setup** | 测试工具 | 需要建立测试环境 | 频率1分+复杂度4分+价值3分+标准2分=2.5 | 🟢 P2 |
| **deployment-protocol** | 部署工具 | 需要部署应用或系统 | 频率1分+复杂度4分+价值4分+标准2分=2.75 | 🟢 P2 |

### 3. Rules 管理清单（中频 + 简单逻辑 + 验证需求）

#### 自动化 Rules
| Rule名称 | 管理内容 | 触发条件 | 评分 | 维护方式 |
|---------|---------|---------|------|---------|
| **file-naming-convention** | 文件命名规范 | 创建或重命名文件 | 频率4分+复杂度1分+价值3分+标准4分=3.0 | 自动化Hook |
| **content-quality-gates** | 内容质量门控 | 内容生成或修改时 | 频率4分+复杂度2分+价值4分+标准3分=3.25 | 自动化Hook |
| **reference-format-validation** | 引用格式验证 | 添加或修改引用 | 频率3分+复杂度1分+价值3分+标准4分=2.75 | 自动化Hook |
| **directory-structure-rules** | 目录结构规则 | 创建目录或移动文件 | 频率2分+复杂度2分+价值3分+标准4分=2.75 | 自动化Hook |
| **version-control-policy** | 版本控制策略 | Git操作时 | 频率3分+复杂度2分+价值3分+标准3分=2.75 | 自动化Hook |
| **documentation-standards** | 文档标准规范 | 文档创建时 | 频率2分+复杂度2分+价值3分+标准3分=2.5 | 自动化Hook |

#### 手动 Rules
| Rule名称 | 管理内容 | 应用场景 | 评分 | 执行方式 |
|---------|---------|---------|------|---------|
| **content-deletion-policy** | 内容删除策略 | 清理过期内容 | 频率1分+复杂度2分+价值2分+标准3分=2.0 | 手动审核 |
| **access-control-rules** | 访问控制规则 | 权限管理 | 频率1分+复杂度3分+价值4分+标准2分=2.5 | 手动配置 |
| **backup-procedures** | 备份程序 | 数据备份 | 频率1分+复杂度2分+价值4分+标准3分=2.5 | 半自动 |
| **emergency-response-protocols** | 应急响应协议 | 系统故障时 | 频率0.5分+复杂度4分+价值4分+标准2分=2.125 | 手动执行 |

### 4. Templates 和 Checklists（低频 + 结构化 + 复用需求）

#### 模板类内容
| 模板名称 | 用途 | 使用频率 | 评分 | 存储位置 |
|---------|------|---------|------|---------|
| **meeting-summary-template** | 会议纪要模板 | 周会 | 频率2分+复杂度1分+价值3分+标准4分=2.5 | Templates/ |
| **project-proposal-template** | 项目提案模板 | 按需 | 频率1分+复杂度2分+价值4分+标准4分=2.75 | Templates/ |
| **status-report-template** | 状态报告模板 | 周报 | 频率2分+复杂度1分+价值3分+标准4分=2.5 | Templates/ |
| **risk-assessment-checklist** | 风险评估清单 | 项目启动时 | 频率1分+复杂度2分+价值4分+标准4分=2.75 | Checklists/ |
| **quality-assurance-checklist** | 质量保证清单 | 交付前 | 频率3分+复杂度2分+价值4分+标准3分=3.0 | Checklists/ |
| **deployment-checklist** | 部署检查清单 | 部署前 | 频率1分+复杂度3分+价值4分+标准3分=2.75 | Checklists/ |

---

## 🔄 动态调整机制

### 分类再评估触发条件

```javascript
// 分类再评估触发器
function shouldReevaluateClassification(contentItem, usageData) {
  const triggers = {
    frequencyChange: Math.abs(usageData.currentFrequency - usageData.baselineFrequency) / usageData.baselineFrequency > 0.5,
    complexityEvolution: contentItem.complexityLevel !== contentItem.originalComplexity,
    valueShift: contentItem.businessValue !== contentItem.originalValue,
    standardizationOpportunity: contentItem.standardizationPotential > contentItem.originalStandardization * 1.5,
    userFeedback: contentItem.userSatisfaction < 4.0 || contentItem.usageComplaints > 3
  };

  return {
    shouldReevaluate: Object.values(triggers).some(trigger => trigger),
    priority: calculateReevaluationPriority(triggers),
    suggestedNewClassification: suggestNewClassification(contentItem, usageData)
  };
}
```

### 自动化分类建议系统

```javascript
// 智能分类建议生成器
class IntelligentClassificationAdvisor {
  generateClassificationRecommendation(contentInfo, context) {
    const analysis = {
      currentUsage: this.analyzeCurrentUsage(contentInfo),
      trendAnalysis: this.analyzeUsageTrends(contentInfo),
      businessImpact: this.assessBusinessImpact(contentInfo),
      standardizationPotential: this.assessStandardizationPotential(contentInfo),
      userFeedback: this.analyzeUserFeedback(contentInfo)
    };

    const recommendation = {
      suggestedClassification: this.classifyBasedOnAnalysis(analysis),
      confidence: this.calculateConfidence(analysis),
      implementationPlan: this.createImplementationPlan(analysis),
      expectedBenefits: this.estimateBenefits(analysis),
      migrationStrategy: this.createMigrationStrategy(analysis)
    };

    return recommendation;
  }
}
```

---

## 📈 实施路线图

### Phase 1: 核心内容迁移（Week 1-2）
- [x] CLAUDE.md精简优化 ✅
- [x] RULES.md智能化升级 ✅
- [ ] 核心Skills（4个方法论）封装
- [ ] 基础Rules（6个）自动化实现
- [ ] 模板和Checklists标准化

### Phase 2: 业务能力扩展（Week 3-4）
- [ ] 业务技能Skills（8个）开发
- [ ] 工具技能Skills（6个）开发
- [ ] 高级Rules（6个）实现
- [ ] Hooks集成和测试

### Phase 3: 系统优化和智能化（Week 5-6）
- [ ] 分类算法优化
- [ ] 自动化建议系统
- [ ] 性能监控和分析
- [ ] 用户反馈收集和改进

---

## 🎯 成功指标

### 量化指标
- **Claude记忆负担减少**: ≥60%（通过内容分类和封装）
- **标准化操作覆盖率**: ≥80%（高频操作标准化程度）
- **自动化规则执行率**: ≥90%（规则自动执行比例）
- **内容分类准确率**: ≥85%（分类决策的准确性）
- **用户满意度**: ≥4.5/5（整体系统满意度）

### 质性指标
- **系统可维护性**: 内容分类清晰，维护成本低
- **扩展性**: 新内容能够快速准确分类
- **一致性**: 同类内容处理方式一致
- **智能化**: 系统能够自动建议分类优化

---

## 🛠️ 实施工具

### 分类决策支持工具
```bash
# 内容分类评估工具
./scripts/content-classification-assessor.sh [content_path] [usage_data]

# 批量分类工具
./scripts/batch-content-classifier.sh [directory_path]

# 分类效果分析工具
./scripts/classification-effectiveness-analyzer.sh [time_range]
```

### 自动化迁移工具
```bash
# CLAUDE.md内容精简工具
./scripts/claude-md-optimizer.sh

# Skills自动生成工具
./scripts/skills-generator.sh [content_source]

# Rules自动化工具
./scripts/rules-automation.sh [rule_definitions]
```

---

**本内容分类策略矩阵将指导LaunchX系统的所有内容组织决策，确保内容以最合适的形式存在，最大化系统效率和维护便利性。**

---

*版本：v1.0.0*
*创建时间：2025-11-03*
*下次评估：2025-12-03*