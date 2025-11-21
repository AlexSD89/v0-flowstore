---
title: "Template-Generator 技能指南"
owners:
  - Launch X Claude Team
status: active
last_update: 2025-11-21
related:
  - ./SKILL.md
  - ./instructions.md
  - ../../🧰 tools/launchx-spec-kit-cli/dev-docs/plan.md
  - ../../🧰 tools/launchx-spec-kit-cli/dev-docs/context.md
  - ../../🧰 tools/launchx-spec-kit-cli/dev-docs/tasks.md
source: LaunchX 模板实践沉淀
impact: "为不同场景生成统一、可复用的模板骨架"
---

# Template-Generator · 模板生成器

## 概述

`Template-Generator` 用于为 LaunchX 内部不同场景生成**可复用的结构化模板**，而不是一次性内容草稿。

支持的模板类型包括：
- 技能模板：SKILL.md + README + instructions 的结构骨架
- 文档模板：项目计划、评审文档、会议纪要、研究报告等
- 项目模板：Dev Docs 三文件（plan/context/tasks）及目录结构
- 配置模板：config 示例、环境变量示例、自动化脚本配置文件

## 主要功能

- 把“方法论/工作流”沉淀为可落地的模板结构
- 为不同模板类型预置统一的章节和字段
- 在模板中显式标注 `TODO｜待补充`，避免虚构细节
- 与 `Skill-Template-Generator`、Dev Docs 模板等协同使用

## 使用方法（面向人类）

1. 在 Claude 对话中说明：
   - 想要生成的模板类型（技能/文档/项目/配置）
   - 典型使用场景和目标读者
   - 是否有可参考的现有文档/项目
2. 要求 Claude 使用 `Template-Generator` 输出对应的模板草稿。
3. 对模板进行人工审阅：
   - 补充 TODO 部分；
   - 调整不符合团队习惯的字段/章节名称。
4. 将审阅后的模板保存到合适目录（如 dev-docs/ 或 knowledge/），并在相关 README 中建立互链。

> 模板生成时，推荐结合 `🧰 tools/launchx-spec-kit-cli/dev-docs/*.md` 作为参考，
> 保证 Dev Docs 三文件与业务文档之间的结构一致性。

---
*维护者: Launch X Claude Team*
