---
title: Claude Skills官方标准学习
owners:
  - LaunchX Skills团队
status: active
last_update: '2025-11-13'
related:
  - ./🎯 Skills生态系统总览-优化版.md
  - ./README.md
  - ./git-claudecode指导/README.md
  - ./git-claudecode指导/resources/doc-driven-bdd-prompt.md
source: 基于官方技能分析整理
impact: 梳理Claude官方要求并映射Launch-X Skills质量门槛
tags: [claude-skills, official-standards, refactoring-guide]
---
# Claude Skills 官方标准学习

## 📋 官方定义

### Skills的核心概念
> **Skills are modular, self-contained packages that extend Claude's capabilities by providing specialized knowledge, workflows, and tools. Think of them as "onboarding guides" for specific domains or tasks—they transform Claude from a general-purpose agent into a specialized agent equipped with procedural knowledge that no model can fully possess.**

**Claude Skills是模块化、自包含的软件包，通过提供专业化知识、工作流程和工具来扩展Claude的能力。包含：**
- **SKILL.md** (必需) - 技能描述文件，包含YAML frontmatter和markdown指令
- **Bundled Resources** (可选) - 脚本、参考资料和资产
  - **scripts/** - 可执行代码（Python/Bash等）
  - **references/** - 需要加载到上下文的文档
  - **assets/** - 输出中使用的文件（模板、图标等）

### 官方技能的核心能力
1. **Specialized workflows** - 特定领域的多步骤程序
2. **Tool integrations** - 特定文件格式或API的工作指令
3. **Domain expertise** - 公司特定知识、模式、业务逻辑
4. **Bundled resources** - 复杂和重复任务的脚本、参考资料和资产

## 🏗️ 官方标准文件结构

### 完整Skills目录结构 (官方标准)
```
skill-name/
├── SKILL.md              # 技能描述文件 (必需)
└── Bundled Resources (可选)  # 捆绑资源
    ├── scripts/          # 可执行代码
    │   └── script.py
    ├── references/       # 供Claude参考的文档
    │   └── reference.md
    └── assets/           # 输出中使用的文件
        └── template.docx
```

### 官方Progressive Disclosure设计原则
Skills使用三级加载系统来高效管理上下文：
1. **Metadata (name + description)** - 始终在上下文中 (~100 words)
2. **SKILL.md body** - 当技能触发时 (<5k words)
3. **Bundled resources** - 按需由Claude加载 (无限*)

## 📝 SKILL.md 官方标准模板

### YAML Frontmatter 官方格式 (基于官方技能分析)
```yaml
---
name: skill-name                          # 必填，机器友好标识符
description: "详细描述技能用途和使用时机"     # 必填，第三人称说明
license: Complete terms in LICENSE.txt     # 必填，许可证信息
---
```

**关键要求：**
- **name**: 简洁的机器友好标识符，用于技能索引
- **description**: 详细说明技能用途，使用第三人称（"This skill should be used when..."）
- **license**: 许可证信息，通常指向LICENSE.txt文件

**官方示例分析：**
```yaml
---
name: docx
description: "Comprehensive document creation, editing, and analysis with support for tracked changes, comments, formatting preservation, and text extraction. When Claude needs to work with professional documents (.docx files) for: (1) Creating new documents, (2) Modifying or editing content, (3) Working with tracked changes, or any other document tasks"
license: Complete terms in LICENSE.txt
---
```

### 官方技能内容结构分析

基于对官方技能的深度分析，SKILL.md内容结构遵循以下模式：

#### 1. 直接工作流程导向
官方技能省略了冗余的元数据，直接进入工作流程指导：

**示例 (docx技能):**
```markdown
# DOCX creation, editing, and analysis

## Overview

A user may ask you to create, edit, or analyze the contents of a .docx file. A .docx file is essentially a ZIP archive containing XML files and other resources that you can read or edit. You have different tools and workflows available for different tasks.

## Workflow Decision Tree

### Reading/Analyzing Content
Use "Text extraction" or "Raw XML access" sections below

### Creating New Document
Use "Creating a new Word document" workflow

### Editing Existing Document
- **Your own document + simple changes**: Use "Basic OOXML editing" workflow
- **Someone else's document**: Use **"Redlining workflow"** (recommended default)
```

#### 2. 工作流程决策树
- 提供清晰的决策路径
- 基于用户需求和场景进行分类
- 每个路径都有具体的工作流程

#### 3. 实操指导为主
- 重点在于"如何做"，而不是"是什么"
- 提供具体的工具使用方法
- 包含代码示例和命令行操作

## 📚 官方技能设计原则分析

### 核心设计哲学
从官方技能分析中提取的关键设计原则：

#### 1. Progressive Disclosure设计
- **Metadata层级**: 精确的name和description决定技能触发
- **SKILL.md主体**: <5k字的实用指导
- **Bundled Resources**: 按需加载，无容量限制

#### 2. 工作流程优先
- **决策树结构**: 根据用户需求提供清晰的路径选择
- **直接可操作**: 每个步骤都包含具体的工具使用方法
- **实用主义**: 重点解决实际问题，避免理论化描述

#### 3. 工具集成导向
- **明确工具边界**: 清楚说明何时使用哪个工具
- **命令行优先**: 提供可执行的命令和脚本
- **错误处理**: 包含常见问题和解决方案

### 官方技能分类模式
基于28个官方技能的分析，可归类为：

#### Creative类 (创造类)
- **algorithmic-art**: 算法艺术生成
- **artifacts-builder**: 前端构件构建

#### Development类 (开发类)
- **skill-creator**: 技能创建指导

#### Document Processing类 (文档处理类)
- **docx**: Word文档处理

#### Communication类 (沟通类)
- 无明确示例，但预期包含邮件、报告等

#### Tools类 (工具类)
- 无明确示例，但预期包含各种实用工具

## 🔄 LaunchX技能改造指南

### 改造原则
基于官方标准分析，LaunchX技能需要进行以下改造：

#### 1. Frontmatter简化
**删除多余字段，保留官方标准:**
```yaml
---
# 删除: allowed-tools, owners, status, last_update, related, source, impact, tags
# 保留: name, description, license
---
```

#### 2. 描述字段重写
**改为第三人称，明确使用场景:**
```yaml
# 修改前:
description: "企业投资决策支持系统，提供ROI评估、风险分析和投资建议"

# 修改后:
description: "Investment decision support system for analyzing business opportunities, conducting ROI analysis, and providing investment recommendations. This skill should be used when users need to evaluate investment opportunities, assess financial risks, or make data-driven investment decisions."
```

#### 3. 内容结构重构
**从"角色扮演"改为"工作流程指导":**
- 删除冗长的角色定义和工作原则
- 增加直接的工作流程决策树
- 提供具体的工具使用指导

#### 4. 文件结构调整
**按照官方标准重新组织:**
```
skill-name/
├── SKILL.md              # 简化为官方格式
├── scripts/              # 保留实用脚本
├── references/           # 重命名resources/
└── assets/              # 保留模板文件
```

### 自动识别调用
Claude会根据用户问题自动识别并调用本技能。

## 🚨 官方vs LaunchX对比分析

### 关键差异总结

| 方面 | 官方标准 | LaunchX当前 | 改造建议 |
|------|----------|-------------|----------|
| **Frontmatter** | 3字段: name, description, license | 10+字段: owners, status, tags等 | 简化为官方格式 |
| **描述风格** | 第三人称，具体使用场景 | 第一人称，功能描述 | 重写为工作流程导向 |
| **内容结构** | 工作流程决策树 | 角色扮演+工作原则 | 重构为直接指导 |
| **文件组织** | scripts/references/assets | 复杂的多层目录 | 按官方标准重组 |
| **设计哲学** | Progressive disclosure | 详细文档化 | 简化为实用导向 |

### LaunchX扩展价值保留
虽然需要遵循官方格式，但LaunchX的以下特色值得保留：
1. **业务场景绑定**: 与memory-bank的知识体系集成
2. **质量保障机制**: Hook检查和测试驱动
3. **团队协作支持**: 多人开发和版本控制
4. **企业级部署**: PM2监控和增量构建

---

*基于Claude Skills官方标准整理*
*最后更新: 2025-11-13*