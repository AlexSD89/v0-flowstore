---
title: "Generator"
owners:
  - Launch X Claude Team
status: active
last_update: 2025-11-21
version: 1.0.0
category: "办公自动化"
tags:
  - LaunchX
  - AI技能
  - 专业工具
related:
  - ./README.md
  - ./instructions.md
  - ../技能创建工具-Skill-Creator-Tool/SKILL.md
  - ../../📚 Claude Skills官方标准学习.md
source: Claude Skills 官方标准与 LaunchX 模板实践整合
impact: "为不同类型 Skills 生成符合官方规范的 SKILL.md 模板骨架"
---

---
name: skill-template-generator
description: >-
  Generate high-quality SKILL.md templates and scaffolding for new or refactored skills
  that follow Claude Skills official standards and LaunchX Skills ecosystem
  conventions. This skill should be used when you want to create, refactor, or audit
  a skill's structure (frontmatter, sections, workflows, resources) rather than
  domain-specific content.
license: Complete terms in LICENSE.txt
---

# Skill Template Generator

> 专门用于为新技能或待重构技能生成 **SKILL.md 模板骨架**，保证同时满足
> Claude Skills 官方规范与 LaunchX Skills 生态的内部约定。
>
> 搭配 `Skill-Creator-Tool` 一起使用：本技能负责**输出模板结构**，
> `Skill-Creator-Tool` 负责指导完整开发流程和质量要求。

---

## 1. 使用时机（When to use）

仅在以下场景触发本技能：

1. **创建新技能之前**  
   - 用户希望为某个领域/工具/工作流创建一个新的 Skill，但还没有合适的 SKILL.md 结构。
2. **重构旧技能**  
   - 现有 SKILL.md 内容杂乱或不符合官方规范，需要整体重排结构。
3. **批量标准化**  
   - 希望为一批技能统一 frontmatter 字段、章节命名和 Workflow Decision Tree 写法。
4. **教学与示范**  
   - 需要展示"官方风格"的技能模板供团队成员学习或参考。

遇到以上情况时，本技能只负责生成**模板骨架**，不要直接填入长篇领域内容，而是保留清晰的 TODO 标记。

---

## 2. 模板家族（Template families）

根据 LaunchX Skills 分类与 Claude 官方标准，模板分为四大类：

1. **知识型技能（Knowledge Skill）**  
   作用：把某一知识域的方法论、框架、检查表转化为可执行指令。  
   代表：`Enterprise-Research-Analyst`、`Market-Intelligence-Expert`、`Knowledge-Master` 等。

2. **工具/接口型技能（Tool / API Skill）**  
   作用：包裹具体工具、文件格式或 API，提供稳定的调用步骤和错误处理。  
   代表：`pdf` / `docx` / `pptx` 文档处理技能、`codex`、`mcp-server-builder` 等。

3. **工作流/编排型技能（Workflow / Orchestrator Skill）**  
   作用：在多个基础技能之上进行编排、路由与组合，形成端到端流程。  
   代表：`Document-Skills-Manager`（文档技能路由）、`Gate-OS-Enterprise-Expert` 等。

4. **元技能/系统技能（Meta / System Skill）**  
   作用：用于构建、评审和维护其他技能或系统工作流本身。  
   代表：`Skill-Creator-Tool`、`Skill-Template-Generator`（本技能）、`Changelog-Generator` 等。

生成模板时，先判断目标技能属于以上哪一类，再选择对应的模板结构。

---

## 3. 决策树（Workflow Decision Tree）

生成 SKILL 模板前，按如下决策树判断：

1. **识别技能类型**  
   - 如果描述中包含「知识体系」「方法论」「研究框架」→ 使用**知识型技能模板**。  
   - 如果提到具体工具/文件类型/API（如 PDF、Git、MCP、CRM）→ 使用**工具/接口型模板**。  
   - 如果强调「组合多个技能」「路由/编排」「端到端」→ 使用**工作流/编排型模板**。  
   - 如果聚焦于「Skill 开发/测试/打包/治理」→ 使用**元技能模板**。

2. **判断是否需要 Bundled Resources**  
   - 若领域内已有大量脚本、文档、模板 → 在模板中预留 `scripts/`、`references/`、`assets/` 段落，并加上 TODO 提示。  
   - 若目前信息较少 → 只在模板中注明未来可扩展的资源类型，不强行创建复杂结构。

3. **确定上下游集成点**  
   - 若技能需要与 MCP / bmad / Agent 或现有工具项目集成：  
     - 在模板中加入 `Integration` 小节与 `related` 路径占位符。  
     - 标记 TODO，提示后续补充具体命令与路径。

在决策完成后，按照对应模板结构生成完整的 SKILL.md 框架，并在关键位置插入简短的 TODO 说明（中文即可）。

---

## 4. 模板结构约定（Per-family skeletons）

### 4.1 知识型技能模板

生成的 SKILL.md 应包含以下结构：

```markdown
---
name: <machine-friendly-skill-name>
description: "Clear description of what this knowledge skill does and when it should be used."
license: Complete terms in LICENSE.txt
---

# <Human-readable Skill Title>

## Overview
- 用 2-3 句说明该技能覆盖的知识域与核心价值。
- 强调"什么时候应该触发本技能"。

## Workflow Decision Tree
- 按典型使用场景拆成 3-5 个分支（如：入门研究 / 深度分析 / 报告生成）。
- 为每个分支写出触发条件与推荐小节。

## Core Frameworks & Checklists
- 罗列本领域关键分析框架（如 SWOT、五力模型等）。
- 每个框架下提供条目化检查清单。

## Output Guidelines
- 说明输出格式（如：调研报告提纲、表格字段、要点列表）。

## References (optional)
- TODO：列出应放入 `references/` 目录的文档名称与简要说明。
```

### 4.2 工具/接口型技能模板

```markdown
---
name: <tool-skill-name>
description: "Tool or API skill for working with <FILETYPE or API>. This skill should be used when..."
license: Proprietary. LICENSE.txt has complete terms
---

# <Tool Skill Title>

## Overview
- 介绍工具/文件格式的作用与常见任务。

## Workflow Decision Tree
- Reading / Analyzing
- Creating / Editing
- Converting / Exporting
- Error Handling

## Usage Patterns
### Basic Operations
- 列出最常用的 3-5 个操作及步骤。

### Advanced Operations
- 复杂场景的组合操作（如批量处理、管道组合）。

## Error Handling
- 常见错误类型 + 建议恢复步骤。

## Integration
- TODO：列出需要集成的 CLI 工具、库、MCP 服务器或外部系统。
```

### 4.3 工作流/编排型技能模板

```markdown
---
name: <orchestrator-skill-name>
description: "Orchestrates multiple underlying skills to deliver an end-to-end workflow for <domain>."
license: Complete terms in LICENSE.txt
---

# <Workflow Orchestrator Skill>

## Overview
- 概述该技能负责的端到端流程与主要产出。

## Workflow Decision Tree
- Step 1: 需求分类
- Step 2: 选择下游技能（路由规则）
- Step 3: 多步编排（执行顺序与依赖关系）
- Step 4: 汇总输出与验收

## Skill Routing
- 列出所有下游技能及其触发条件。

## Integration Points
- TODO：描述与 MCP、bmad workflows、Agents 或 CI/CD 的集成点。

## Failure & Recovery
- 说明关键步骤失败时的替代路径与回滚策略。
```

### 4.4 元技能/系统技能模板

```markdown
---
name: <meta-skill-name>
description: "Meta-level skill for creating, validating, or maintaining other skills or systems."
license: Complete terms in LICENSE.txt
---

# <Meta Skill Title>

## Purpose
- 说明该技能在整个生态系统中的作用（如：创建技能、打包技能、生成变更日志）。

## Usage Scenarios
- 列出 3-5 个典型使用场景。

## Step-by-step Workflow
- 给出清晰的流程步骤（Collect → Design → Implement → Validate → Ship）。

## Tools & Scripts
- TODO：列出应放在 `scripts/` 中的关键脚本及其用途。

## Quality Checklist
- 提供一份检查清单，确保生成的技能/制品符合质量要求。
```

在生成具体模板时，只需要将上述骨架中的占位符 `<...>` 替换为目标技能的具体信息，并保留中文 TODO 注释，提醒后续人工或 Claude 继续完善细节。

---

## 5. 与 LaunchX 资产的联动

设计模板时，应参考以下本地资产（无需自动加载全部内容，只需在模板中留下引用提示）：

- Dev Docs 三文件模板：
  - 项目计划：`🧰 tools/launchx-spec-kit-cli/dev-docs/plan.md`
  - 项目上下文：`🧰 tools/launchx-spec-kit-cli/dev-docs/context.md`
  - 任务清单：`🧰 tools/launchx-spec-kit-cli/dev-docs/tasks.md`
- Claude Skills 官方规范总结：`🧠 Launch-X Skills生态系统/📚 Claude Skills官方标准学习.md`
- 代表性高质量技能样本：
  - `02-企业研究/企业研究分析师-Enterprise-Research-Analyst/SKILL.md`
  - `10-文档处理/PDF文档处理器-PDF-Document-Processor/SKILL.md`
  - `12-开发工具/MCP服务器构建器-MCP-Server-Builder/SKILL.md`

在模板中使用简短引用（如"参考：Enterprise-Research-Analyst/SKILL.md"），指导后续填充者去查阅具体示例，而不是在模板里复制大段内容。

---

## 6. 输出要求（Output format）

当用户请求模板时：

1. **只输出一个完整的 SKILL.md 草稿**  
   - 从 `---` 开始，到正文结束，组成一份可直接保存为 SKILL.md 的内容。
2. **保留 TODO 注释**  
   - 对于需要人工补充的地方，用 `TODO｜待补充：<说明>` 标记，避免幻造细节。
3. **避免重复粘贴已有长文档**  
   - 若需要参考 LaunchX 现有文档，只在模板中写明引用路径和用途，不复制全文。
4. **遵守 frontmatter 规范**  
   - 至少包含 `name`、`description`、`license` 三个字段。  
   - 如需额外字段（owners/tags 等），优先放在 LaunchX 外层 frontmatter 中维护。

遵循以上规则，本技能生成的模板能够在 LaunchX Skills 生态内部复用，同时与 Claude Skills 官方标准保持一致。
