---
title: "Template-Generator"
owners:
  - Launch X Claude Team
status: active
last_update: 2025-11-21
version: 1.0.0
category: "其他"
tags:
  - LaunchX
  - AI技能
  - 模板生成
related:
  - ./README.md
  - ./instructions.md
  - ../../🧰 tools/launchx-spec-kit-cli/dev-docs/plan.md
  - ../../🧰 tools/launchx-spec-kit-cli/dev-docs/context.md
  - ../../🧰 tools/launchx-spec-kit-cli/dev-docs/tasks.md
source: LaunchX 模板实践沉淀
impact: "统一技能/文档/项目/配置的模板结构，支撑高复用与协同"
---

---
name: template-generator
description: >-
  Generates structured templates for skills, documents, projects, and
  configurations based on LaunchX methodologies and Dev Docs patterns. This
  skill should be used when users need reusable, standardized templates rather
  than one-off drafts, especially for documents that will participate in
  LaunchX's 5-step cognition and Dev Docs workflows.
license: Complete terms in LICENSE.txt
---

# Template-Generator

## 1. 概述（Overview）

`Template-Generator` 专注于生成**可复用的结构化模板**，而不是直接产出一次性内容。

适用对象包括：
- 技能模板（例如新的 SKILL.md 骨架、instructions/README 结构）
- 文档模板（项目计划、评审文档、会议纪要、研究报告等）
- 项目模板（Dev Docs 三文件、目录结构、任务清单）
- 配置模板（配置文件 skeleton、环境变量示例、自动化脚本配置）

本技能的目标是：
- 统一模板结构与命名规范；
- 显式标记 TODO｜待补充 部分，避免幻造细节；
- 与 LaunchX 的 Dev Docs 与知识资产形成互链。

---

## 2. 使用时机（When to use）

在以下场景使用本技能：

1. **启动新项目/新技能时**  
   - 需要一份“符合 LaunchX 规范”的文档/技能/项目模板作为起点。
2. **对现有文档/技能进行重构时**  
   - 发现结构混乱、字段不统一，希望从一个新的模板骨架重新组织内容。
3. **为团队沉淀标准输出形态时**  
   - 希望把“项目计划/评审说明/会议纪要”等高频文档固化为统一模板。
4. **为自动化工具准备模板资产时**  
   - 需要为 bmad/MCP/脚本提供可填充的模板（例如报告模版、配置模版）。

不适合的场景：
- 用户只需要一次性内容草稿，而不打算复用结构；
- 已存在成熟模板且仅需微调内容（此时可以直接编辑原模板）。

---

## 3. 模板类型与结构（Template types & structure）

### 3.1 技能模板（Skill templates）

用于为新的 LaunchX 技能生成目录与 SKILL.md 结构。推荐与
`技能模板生成器-Skill-Template-Generator` 协同使用：

- 由 `Skill-Template-Generator` 决定 Skill 类型（知识型/工具型/编排型/元技能）并输出 SKILL.md 骨架；
- 本技能则用于生成配套的 `README.md` / `instructions.md` / `resources/` 目录说明。

典型 Skill 模板应包含：
- README（人类视角）：定位、主要功能、使用方法。
- instructions（Claude 视角）：触发条件、调用步骤、与其他技能的接口协议。
- SKILL.md：参考对应类型模板（见 `Skill-Template-Generator` 的说明）。

### 3.2 文档模板（Document templates）

用于生成常见业务/技术文档的骨架，例如：
- 项目计划/技术方案/评审文档
- 会议纪要/决策记录/复盘报告
- 研究报告/竞品分析/市场调研

每个文档模板至少需要：
- 元信息区（标题/负责人/时间/版本/状态等）；
- 结构化章节（背景/目标/范围/方案/风险/决策等）；
- TODO 标记，提示后续需要补充的数据/结论。

### 3.3 项目模板（Project templates）

对应 LaunchX Dev Docs 三文件体系与目录结构：
- `dev-docs/plan.md`：项目目标、阶段划分、风险矩阵；
- `dev-docs/context.md`：SESSION PROGRESS、关键文件、技术栈；
- `dev-docs/tasks.md`：任务拆解与验收标准。

本技能可用于生成：
- 针对新项目的 `dev-docs/<project>/` 基本结构；
- 针对特定项目类型（如外部 AI 项目、插件开发项目）的定制三文件模板。

### 3.4 配置模板（Configuration templates）

用于生成配置类文件的骨架，如：
- `config.yml` / `config.json` 示例；
- 环境变量 `.env.example`；
- 自动化脚本的参数配置说明。

模板中应明确：
- 每个字段的意义与取值范围；
- 必填/可选标记；
- 与其他系统/技能的依赖关系。

---

## 4. 决策流程（Decision workflow）

在生成模板前，Claude 应遵循以下步骤：

1. **确定模板对象**  
   - 明确这是技能模板、文档模板、项目模板还是配置模板。  
   - 若用户描述不清，可主动追问用途与目标读者。

2. **确认输出环境**  
   - 模板最终会存放在哪个目录（如 dev-docs、knowledge、项目特定目录）。  
   - 是否需要与现有模板兼容或互链（例如引用 Dev Docs 现有示例）。

3. **选择参考范本**  
   - 技能模板：参考 `Skill-Template-Generator` 输出骨架。  
   - 项目模板：参考 `🧰 tools/launchx-spec-kit-cli/dev-docs/*.md`。  
   - 文档模板：可引用现有项目中的成功文档作为结构参考，而不是复制内容。

4. **生成模板草稿**  
   - 使用清晰层级（标题/小节）组织；
   - 对不确定内容使用 `TODO｜待补充：<说明>` 标记；
   - 不注入虚构数据或结论。

---

## 5. 与 LaunchX 资产的集成

本技能生成的模板应优先对齐以下资产：

- Dev Docs 模板：
  - `🧰 tools/launchx-spec-kit-cli/dev-docs/plan.md`
  - `🧰 tools/launchx-spec-kit-cli/dev-docs/context.md`
  - `🧰 tools/launchx-spec-kit-cli/dev-docs/tasks.md`
- 高质量技能范本：
  - `02-企业研究/企业研究分析师-Enterprise-Research-Analyst/SKILL.md`
  - `10-文档处理/PDF文档处理器-PDF-Document-Processor/SKILL.md`
  - `12-开发工具/MCP服务器构建器-MCP-Server-Builder/SKILL.md`
- 外部方法论资料：
  - 可根据需要引用（并在模板中写明“参考来源”），但不直接复制大段内容。

生成模板时，应在适当位置写明“参考路径”，例如：
- `参考：🧰 tools/launchx-spec-kit-cli/dev-docs/plan.md 的阶段划分结构`；
- `参考：企业研究分析师 SKILL 的决策树和分析框架章节`。

---

## 6. 输出要求（Output format）

当用户请求生成模板时：

1. **仅输出模板正文**  
   - 对于 Markdown/文本模板：直接输出完整 Markdown 模板；
   - 对于配置模板：输出完整的 YAML/JSON 示例结构。
2. **使用清晰占位符**  
   - 对需要补充的内容使用：`TODO｜待补充：<说明>`；
   - 对可选字段使用注释说明（例如 `# 可选：...`）。
3. **不要“写完所有内容”**  
   - 模板不应包含实际项目数据或虚构结论；
   - 重点在于结构、字段与章节说明，而不是填满所有文字。
4. **保持与目标目录规范一致**  
   - 若模板是给 dev-docs 使用，需要包含标准 frontmatter；
   - 若模板是给 knowledge 使用，需遵循 knowledge 域的标题与索引规范。

---

## 7. 风险与注意事项

- 模板一旦被大量复用，其结构变更会产生较大影响，修改模板前应在 Dev Docs 或
  相关 README 中记录变更说明；
- 对外使用的模板（如对外报告模版）需注意是否包含内部敏感字段或流程说明；
- 对自动化工具使用的配置模板，字段命名与类型更改前，应同步更新相关脚本与文档。

通过以上约定，本技能可以在 LaunchX 内部充当“模板工厂”的角色，为不同领域的
技能、文档、项目和配置提供统一、可复用的结构化模板。
