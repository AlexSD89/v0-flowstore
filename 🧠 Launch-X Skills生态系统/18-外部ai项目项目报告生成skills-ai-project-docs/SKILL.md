---
title: "AI项目文档生成与校验-AI-Project-Docs"
owners:
  - Launch X Claude Team
status: active
last_update: 2025-11-21
version: 1.0.0
category: "文档处理"
tags:
  - LaunchX
  - AI项目
  - 文档生成
  - 文档校验
related:
  - ./Poke_项目档案.md
  - ./Poke完整档案.md
  - ./config.json
  - ./scripts/ai_project_intake.py
source: 本地自动化脚本与项目档案工作流
impact: "标准化外部AI项目录入与档案生成流程"
---

---
name: ai-project-docs
description: >-
  Create or validate documentation for AI projects using structured workflows
  and bundled scripts. This skill should be used when users need to onboard a
  new AI project into the LaunchX knowledge system, validate existing project
  data, or generate standardized project dossiers and reports.
license: Complete terms in LICENSE.txt
---

# AI Project Documentation Skill

## 1. 概述（Overview）

本技能负责将**外部AI项目**的信息收集、校验并沉淀为结构化文档，
同时为后续分析/对比/归档提供稳定的入口。

典型能力：
- 从多源数据收集项目信息（公司、场景、产品形态等）
- 基于行业基准和配置进行数据校验与补全
- 按统一模板生成项目档案（如 `Poke_项目档案.md`、`Poke完整档案.md`）
- 通过完整工作流脚本自动执行“查重→分类→内容生成→归档更新”

---

## 2. 使用时机（When to use）

在以下场景触发本技能：

1. **新项目录入**  
   - 有一个新的外部AI项目（或潜在客户项目），需要进入 LaunchX 的知识/项目档案体系。
2. **已有档案校验/纠偏**  
   - 已有项目档案，但数据来源不明确或信息不完整，需要对照配置/基准进行重新校验。
3. **批量报告生成**  
   - 希望从结构化项目数据快速生成一批统一格式的项目报告/对比文档。
4. **方法论验证与示范**  
   - 需要展示“从需求到完整项目档案”的标准工作流，作为案例教学或 SOP。

若用户只需要“随便写一篇介绍”，不要求结构化字段与归档，可以只用普通写作技能；
当需要进入 LaunchX 项目档案体系或后续自动化处理时，应使用本技能。

---

## 3. 工作流决策树（Workflow Decision Tree）

```text
用户需求 → 是否已有结构化项目数据？
    ├─ 否（完全新项目）
    │    ├─ 需要完整录入工作流 → 使用 ai_project_intake.py 全流程脚本
    │    └─ 只需最小档案草稿 → 先用 data_collector.py 收集数据，再用 doc_generator.py 生成
    │
    └─ 是（已有部分数据/档案）
         ├─ 重点是数据是否有效？ → 使用 data_validator.py 进行校验/补足
         ├─ 重点是文档质量？     → 使用 correct_doc_generator.py / enhanced_doc_generator.py
         └─ 需要端到端更新？     → 使用 workflow_executor.py 组合执行
```

Claude 在使用该技能时，应先判断：
- 这是**新录入**还是**既有项目更新**？
- 用户更关心“数据正确性”还是“文档呈现质量”？
- 是否需要运行完整自动化工作流（包括归档/总览更新）？

---

## 4. 标准流程（Standard workflow）

### 4.1 新项目完整录入（推荐路径）

对应脚本：`scripts/ai_project_intake.py`（见其中的 `AIProjectIntakeWorkflow`，完整实现 9 步流程）。

典型步骤（参考 `scripts/ai_project_intake.py:25-83`）：

1. **项目查重扫描**  
   - 检查当前项目是否已在知识库中存在。  
   - 若检测为重复，工作流提前结束并返回提示。
2. **分类决策**  
   - 基于行业分类规则确定归档子目录，如 `🟣 knowledge/07_市场项目档案/<分类>/`。
3. **文件命名**  
   - 采用统一命名规范：`公司名-项目名项目档案.md`。
4. **数据收集与置信度评估**  
   - 调用内部数据采集逻辑（等价于 `data_collector.py`）收集多源信息。  
   - 若 `confidence_score < 0.6`，标记为“待补充”。
5. **VI区数据锚点预设**  
   - 为后续内容生成准备关键信息锚点（VI 区）。
6. **内容生成（从后到前）**  
   - 按既定模板（如 `Poke_项目档案.md`）生成完整内容。  
   - 可视为高级版的 `doc_generator.py/enhanced_doc_generator.py` 能力。
7. **模板对齐验证**  
   - 检查生成内容是否符合模板结构、字段齐全度等要求。  
   - 若对齐度不足，返回提示供人工或 Claude 后续修正。
8. **归档与总览更新**  
   - 将内容写入目标路径，如：`🟣 knowledge/07_市场项目档案/<分类>/<文件名>`。  
   - 更新项目总览文件（如 `@ai潜在学习项目总览.md`）。
9. **交付检查**  
   - 对最终内容进行质量检查（完整性、一致性、格式），输出检查结果。

在 Claude 的回答中，应以文字形式概述这 9 步，并说明在哪些步骤会调用自动化脚本，
哪些步骤需要人工/Claude 进行补充判断。

### 4.2 仅进行数据校验与修正

对应脚本：`data_validator.py`、`correct_doc_generator.py`。

适用场景：
- 已有项目档案，但担心数据过时或字段缺失；
- 在正式对外输出前，希望快速进行一致性检查与小幅修正。

推荐流程：
1. 使用 `data_validator.py` 对原始数据/文档进行校验，识别缺失字段和异常值。  
2. 视情况调用 `correct_doc_generator.py` 或手动在 Claude 中修改，保证关键字段一致。  
3. 如有必要，再通过 `enhanced_doc_generator.py` 生成更完整/更精炼版本。

### 4.3 批量文档生成与更新

对应脚本：`workflow_executor.py`、`doc_generator.py`、`data_collector.py`。

推荐流程：
1. 确定批处理范围（项目列表/配置），并更新 `config.json` 或相应数据源。  
2. 使用 `data_collector.py` 批量收集/同步数据。  
3. 使用 `workflow_executor.py` 调用文档生成与归档流程。  
4. 在 Claude 回答中返回：
   - 已处理项目数量；
   - 成功/失败项目列表；
   - 生成/更新的档案路径示例。

---

## 5. 可用脚本与资源（Helper scripts & resources）

> 所有脚本都应通过 `--help` 获取具体参数说明；在回答中只描述策略和调用时机，不对脚本内部实现做长篇复述。

### 验证与校验脚本
- `data_validator.py` - 项目存在性检查与字段校验

### 文档生成脚本
- `doc_generator.py` - 基于已验证数据生成标准项目档案
- `enhanced_doc_generator.py` - 生成更详细、结构更丰富的文档版本
- `correct_doc_generator.py` - 基于现有档案进行纠偏/修订

### 工作流脚本
- `workflow_executor.py` - 编排完整“收集 → 校验 → 生成 → 归档”工作流
- `scripts/ai_project_intake.py` - 端到端 AI 项目录入工作流 v2.4 实现（查重、分类、锚点、模板对齐等）

### 数据与模板资源
- `config.json` - 工作流配置与参数
- `industry_benchmarks.json` - 行业基准数据，用于对比与评分
- `Poke_项目档案.md` / `Poke完整档案.md` - 项目档案模板/示例

---

## 6. 与 LaunchX Dev Docs / 知识体系的集成

本技能生成的项目档案通常会作为：

- 🟣 knowledge 域中的项目档案（如 `🟣 knowledge/07_市场项目档案/...`）；
- 后续分析/复盘的输入（如对比不同 AI 项目的效果、成熟度、商业模式）；
- 其他技能（如企业研究/市场情报）的上游数据来源。

集成建议：

- 在 Dev Docs 中记录每次批量录入/更新的命令与输出路径：
  - plan: 在项目 `plan.md` 中记录使用了 ai-project-docs 的工作流和目标。  
  - context: 在 `context.md` 的 SESSION PROGRESS 里更新“已录入/已更新的项目列表”。  
  - tasks: 在 `tasks.md` 中加入“项目档案生成/校验”的具体任务条目。
- 如需与 MCP/bmad/Agent 协同（例如自动从外部 API 拉取项目数据）：
  - 在回答中以 `TODO｜待 Claude / Agent 调用相关 MCP/bmad workflow` 的形式明确标注，
    并说明预期效果和风险，不在本技能内直接执行远程自动化。

---

## 7. 风险与注意事项（Risks & caveats）

- **数据准确性**：外部数据源可能存在缺失或错误，`confidence_score` 较低时应标记为“待补充”，并提醒用户不要直接对外使用。  
- **重复录入**：必须先进行查重（由 `ai_project_intake.py` 或 `data_validator.py` 负责），避免在知识库中产生大量重复档案。  
- **归档路径**：修改 `archive_path` 规则前应谨慎，避免打乱现有目录结构和链接引用。  
- **脚本执行环境**：运行脚本前确认当前工作目录与 Python 版本，必要时在 Dev Docs 中记录环境说明和依赖。  

---

通过以上结构，本技能不只是“列出脚本名称”，而是为 Claude 提供了一套完整的
AI 项目文档生成与校验方法论 + 自动化执行框架，可以在 LaunchX 的知识体系中稳定复用。
