---
title: "技能模板生成器-Skill-Template-Generator 技能指南"
owners:
  - Launch X Claude Team
status: active
last_update: 2025-11-21
related:
  - ./SKILL.md
  - ./instructions.md
  - ../技能创建工具-Skill-Creator-Tool/SKILL.md
source: Claude Skills 官方标准与 LaunchX 模板实践整合
impact: "帮助人类理解如何使用 Skill-Template-Generator 生成高质量 SKILL.md 模板"
---

# 技能模板生成器 · Skill-Template-Generator

## 概述

`Skill-Template-Generator` 是 LaunchX Skills 生态中的**模板骨架生成器**：
专门用于为新技能或待重构技能生成符合 Claude Skills 官方标准和
LaunchX 内部规范的 `SKILL.md` 模板。

它关注的是**结构与章节设计**，而不是具体领域内容。

## 主要功能

- 根据任务描述自动判断技能类型（知识型 / 工具型 / 编排型 / 元技能）
- 为不同技能类型生成对应的 `SKILL.md` 模板骨架
- 预置 Workflow Decision Tree、输出规范、资源挂载位点等章节
- 引导在模板中留出 `scripts/`、`references/`、`assets/` 的 TODO 占位
- 与 `Skill-Creator-Tool` 协同，支撑完整的技能开发流程

## 使用方法（面向人类）

1. 在 Claude 中说明：
   - 要创建或重构的技能名称
   - 面向的领域 / 工具 / 工作流
   - 希望技能解决的典型场景
2. 请求 Claude 使用 `Skill-Template-Generator` 生成一个 `SKILL.md` 模板草稿。
3. 使用 `Skill-Creator-Tool` 按流程完善模板中的 TODO 内容与资源引用。
4. 按照测试与发布流程，将完善后的技能同步到 Skills 生态系统与系统根目录。

> 详细结构与决策逻辑请参见同目录下 `SKILL.md` 文件。

---
*维护者: Launch X Claude Team*
