---
title: "技能模板生成器-Skill-Template-Generator 使用说明"
owners:
  - Launch X Claude Team
status: active
last_update: 2025-11-21
source: Claude Skills 官方标准与 LaunchX 模板实践整合
impact: "规范 Claude 在生成 SKILL.md 模板时的调用时机与步骤"
---

# Skill-Template-Generator 使用说明（面向 Claude）

本文件说明 **Claude 在什么情况下、如何调用本技能** 来生成技能模板。

## 1. 调用前准备

在触发本技能前，先从用户输入中提取以下信息：

- 目标技能的大致类型（知识 / 工具 / 编排 / 元技能）
- 目标技能要解决的主要任务与场景
- 是否有现有技能或项目可作为参考（可记录路径或名称）

若用户尚未明确，可通过追问确认上述要点。

## 2. 调用流程

1. **识别技能类型**  
   按 `SKILL.md` 中的决策树判断属于哪一类模板家族。

2. **选择模板骨架**  
   - 知识型：生成包含 Overview / Workflow Decision Tree / Frameworks / Output Guidelines 的结构。
   - 工具型：生成包含常用操作、错误处理、Integration 小节的结构。
   - 编排型：生成以 Skill Routing 与多步工作流为核心的结构。
   - 元技能：生成以创建/验证/打包其他技能为目标的结构。

3. **填充基础占位信息**  
   - 写出合理的 `name`（机器友好）与 `description`（第三人称、英文）。
   - 对无法根据上下文确定的内容，用 `TODO｜待补充：...` 标注。

4. **输出完整 SKILL.md 草稿**  
   - 包含 `---` 包裹的官方 frontmatter。
   - 后接完整 Markdown 章节结构。
   - 不额外输出解释性文字或评论，只输出草稿本身。

## 3. 与其他技能的协同

- 当用户需要更完整的开发流程指导时：
  - 在输出结尾处建议结合 `Skill-Creator-Tool` 继续完善内容。
- 当模板需要挂接脚本/文档/资产时：
  - 在模板中留出 `scripts/`、`references/`、`assets/` 对应的小节和 TODO，不直接伪造文件内容。

## 4. 质量要求

- 模板必须：
  - 明确说明技能的使用时机（When to use）。
  - 至少包含一个 Workflow Decision Tree 或等价的场景分支结构。
  - 避免出现“泛泛而谈”的描述，而是用章节标题引导后续具体化。
- 若上下文不足以生成合理结构，应主动在模板中标注限制和所需补充信息。

---
*维护者: Launch X Claude Team*
