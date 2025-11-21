---
title: "Document-Skills"
owners:
  - Launch X Claude Team
status: active
last_update: 2025-11-21
version: 1.0.0
category: "文档处理"
tags:
  - LaunchX
  - AI技能
  - 文档管理
related:
  - ./README.md
  - ./instructions.md
  - ../Word文档处理器-Word-Document-Processor/SKILL.md
  - ../PDF文档处理器-PDF-Document-Processor/SKILL.md
  - ../PowerPoint处理器-PowerPoint-Processor/SKILL.md
  - ../Excel处理器-Excel-Processor/SKILL.md
source: LaunchX 文档处理实践与技能路由设计
impact: "作为文档技能中控台，统一路由和编排 Word/PDF/PPT/Excel 工作流"
---

---
name: document-skills
description: >-
  Document processing suite and router that orchestrates Word, PDF, PowerPoint, and
  Excel skills. This skill should be used whenever a user asks to work with one or
  more office documents and you need to select, sequence, or combine the
  appropriate document skills.
license: Complete terms in LICENSE.txt
---

# Document-Skills Manager · Document Processing Suite

> 该技能充当**文档处理总调度中心**：根据用户需求和文件类型，在
> `docx` / `pdf` / `pptx` / `xlsx` 等文档技能之间进行路由与编排，
> 支持单一文档操作、跨格式转换与多步工作流。
>
> 不重复实现底层读写逻辑，而是**合理选择和组合已有文档技能**。

---

## 1. 使用时机（When to use）

在以下场景优先触发本技能：

1. **用户没有明确指定具体文档技能**  
   - 例如只说“帮我整理这份报告/表格/演示文稿”，而没有提到 pdf/docx/xlsx。  
   - 需要先识别文档类型，再路由到合适的技能。

2. **涉及多种文档格式协同**  
   - 例如“从这份 Excel 生成一份汇总报告 Word + PPT 演示稿”。  
   - 需要 orchestrate `excel` → `docx` → `pptx` 等多个子技能。

3. **跨文档批量操作**  
   - 例如“对这几十份 PDF 做统一摘要，并生成一个 Excel 汇总表”和“把所有 Word 合并成一个 PDF”。

4. **构建标准化文档工作流**  
   - 例如结合 LaunchX Dev Docs 模板，为项目生成完整的计划/上下文/任务三件套并导出为多种格式。

若用户已经明确指定某个文件类型且任务简单（如“从这个 PDF 提取文本”），可以直接调用对应单一技能，无需经过本管理器。

---

## 2. 总体流程（High-level workflow）

可以将本技能的工作分为四步：

1. **分析需求与资源**  
   - 识别用户目标：阅读？编辑？汇总？转换？对比？  
   - 列出涉及的文件：名称、格式、数量、来源路径（若可用）。

2. **选择底层技能组合**  
   - 为每种文件类型选定基础技能：`docx` / `pdf` / `pptx` / `xlsx`。  
   - 决定是否需要跨技能编排（例如 Excel → Word → PPT 的链路）。

3. **设计编排步骤**  
   - 用 3–7 步描述端到端流程，每步标明：
     - 输入来源（文件/上一步输出）
     - 使用的技能
     - 期望输出形式

4. **执行与校验**  
   - 按步骤逐个调用对应技能，串联中间结果。  
   - 在关键节点添加轻量检查（如字数、页数、字段完整性）。

---

## 3. 决策树（Workflow Decision Tree）

使用本技能时按下列顺序思考：

1. **任务范围**  
   - 若任务仅涉及单一文件类型且操作简单 → 直接交给对应单一技能。  
   - 若涉及多种格式/批量文件/复杂工作流 → 使用本技能进行编排。

2. **文档类型识别**  
   - 若用户给出扩展名（.docx / .pdf / .pptx / .xlsx）→ 直接映射。  
   - 若未给出扩展名：根据描述判断，大致分类：
     - “报告、合同、说明书” → 通常对应 Word（`docx`）或 PDF。  
     - “演示稿、PPT、slides” → `pptx`。  
     - “表格、数据表、报表” → `xlsx`。

3. **路由策略**  
   - 单一格式 → 选择相应技能，并在输出中明确说明使用哪个技能。  
   - 多格式 → 画出一条链路，例如：
     - `xlsx` 分析 → `docx` 报告 → `pptx` 演示。  
     - 多个 `docx` 合并 → 导出 `pdf` 总版。

4. **质量与回滚**  
   - 关键步骤失败时，说明已经完成的部分以及可行的替代路径。  
   - 对破坏性操作（如覆盖原文件）应优先建议用户在副本上操作。

---

## 4. 技能路由表（Routing table）

> 本表用于帮助 Claude 选择底层技能；实际实现由 Claude 内部“调用对应技能指令”完成，不在此重写各技能细节。

| 文档类型 | 首选技能 | 典型任务示例 |
| -------- | -------- | ------------ |
| Word (.docx) | `docx` Word 文档处理器 | 撰写/编辑报告、对比修订、结构化重排 |
| PDF (.pdf)   | `pdf` PDF 文档处理器   | 批量抽取文本/表格、表单填充、合并拆分 |
| PowerPoint (.pptx) | `pptx` PowerPoint 处理器 | 从大纲生成演示稿、模板套用、美化结构 |
| Excel (.xlsx) | `xlsx` Excel 处理器 | 数据清洗、指标计算、汇总报表生成 |

在回复中，不需要具体实现每个技能的细节，而是：

- 明确指出 "此处应调用 `<skill-name>` 技能完成具体操作"；
- 若需要，可以在回答中引用对应 SKILL.md 的章节标题作为参考（例如：PDF 处理中的 "Quick Start" 或 "Advanced Table Extraction" 小节）。

---

## 5. 常见编排场景（Orchestration patterns）

### 5.1 数据 → 报告 → 演示

典型链路：`xlsx` → `docx` → `pptx`

1. 使用 `xlsx` 技能：从 Excel 中提取指标与图表。  
2. 使用 `docx` 技能：生成结构化分析报告（如：背景 / 数据洞察 / 结论）。  
3. 使用 `pptx` 技能：基于报告生成简化版演示稿（要点 + 关键图表）。

### 5.2 多文档汇总与归档

典型链路：多份 `docx` / `pptx` → 合并 → 导出 `pdf`

1. 识别需要汇总的文件列表与顺序。  
2. 使用 `docx` 或 `pptx` 技能按顺序合并或重排内容。  
3. 使用 `pdf` 技能将最终版本导出为 PDF 用于归档或对外分享。

### 5.3 合规与审阅工作流

典型链路：`pdf` 合同 → `docx` 审阅稿 → `xlsx` 风险清单

1. 使用 `pdf` 技能提取合同条款与关键字段。  
2. 使用 `docx` 技能生成带批注/修订的审阅稿。  
3. 使用 `xlsx` 技能生成条款/风险清单，便于后续跟踪。

在回答用户时，应选取最贴近需求的一种或几种模式，并根据实际情况做裁剪。

---

## 6. 与 LaunchX 资产和工具的集成

本技能本身不直接调用外部工具，而是指导 Claude：

- 如何组合 LaunchX 内部文档技能；
- 何时建议用户使用现有模板与项目规范。

集成建议：

- 当用户需要**项目级文档三件套**时，可引导参考：
  - `🧰 tools/launchx-spec-kit-cli/dev-docs/plan.md`（项目计划模板）
  - `🧰 tools/launchx-spec-kit-cli/dev-docs/context.md`（上下文与 SESSION PROGRESS）
  - `🧰 tools/launchx-spec-kit-cli/dev-docs/tasks.md`（任务清单）
- 如需跨 Skill 与 MCP/bmad/Agent 协同（例如自动生成并分发文档）：
  - 在回答中标注 `TODO｜待 Claude 触发相关 MCP / bmad workflow`，并简要说明所需自动化步骤。

---

## 7. 输出与安全注意事项

- 对于**可能覆盖原文档**的操作，应优先建议在副本上处理，并在答案中明确提醒。  
- 对批量操作，应在开始前总结预期影响范围，并在结束时简要回顾处理结果。  
- 当文档格式或内容不确定时，先进行轻量探测（如仅提取首页或少量样本），再决定是否执行大规模处理。

通过上述约定，本技能可以作为 LaunchX 文档处理体系的“中控台”，
让下游的 `docx` / `pdf` / `pptx` / `xlsx` 技能在清晰的工作流下协同工作。
