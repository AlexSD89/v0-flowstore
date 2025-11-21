---
title: "document-skills 文档技能管理器指南"
owners:
  - Launch X Claude Team
status: active
last_update: 2025-11-21
related:
  - ./SKILL.md
  - ./instructions.md
  - ../Word文档处理器-Word-Document-Processor/SKILL.md
  - ../PDF文档处理器-PDF-Document-Processor/SKILL.md
  - ../PowerPoint处理器-PowerPoint-Processor/SKILL.md
  - ../Excel处理器-Excel-Processor/SKILL.md
source: LaunchX 文档处理实践与技能路由设计
impact: "帮助人类理解并使用文档技能中控台进行多格式协同处理"
---

# document-skills · 文档技能管理器

## 概述

`document-skills` 是 LaunchX 中的**文档处理中控台**：
负责在 Word、PDF、PowerPoint、Excel 等文档技能之间做路由与编排，
让多个文档技能在统一工作流下协同工作。

它不重新实现具体读写逻辑，而是基于用户需求：

- 判断涉及哪些文档类型；
- 选择合适的底层技能；
- 设计端到端处理步骤（如：数据 → 报告 → 演示）。

## 主要功能

- 自动识别用户任务所需的文档类型与技能组合
- 在 `docx` / `pdf` / `pptx` / `xlsx` 技能之间做路由与多步编排
- 支持跨格式工作流（如 Excel → Word → PPT，或多 Word 合并导出 PDF）
- 提供常见编排模式（汇总报告、合规审阅、归档等）的结构化指导
- 与 LaunchX Dev Docs 模板协同，生成标准化项目文档集

## 使用方法（面向人类）

1. 在 Claude 中描述你的文档目标，例如：
   - “用这份 Excel 生成专业报告和演示稿”
   - “把这几十份 PDF 合同做成风险汇总表”
2. 不必指定具体技能，由 `document-skills` 分析：
   - 所需的文档类型
   - 建议的处理步骤和底层技能组合
3. 根据回答中给出的步骤，按需继续展开到具体技能（如 `pdf`、`docx` 等）进行细化。

> 更详细的决策逻辑与编排模式请参见同目录下 `SKILL.md` 文件。

---
*维护者: Launch X Claude Team*
