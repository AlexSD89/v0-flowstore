---
title: LaunchX 知识库总览
last_update: '2025-10-24'
owners:
- LaunchX Knowledge Lab
status: active
impact: 统一知识域定位、工作流与治理节奏
related:
- 🟣 knowledge/README.md
- 🟣 knowledge/AGENTS.md
- 🟣 knowledge/CLAUDE.md
- memory-bank/support_modules/knowledge/USEME.md
source:
- 知识域复查（2025-10-24）
---

## 📋 执行摘要

LaunchX 知识域围绕“判断 → 趋势 → 结论”闭环组织资产：`01_Inbox` 采集原始信号，`02_分析与洞察` 负责结构化加工，`03/07/08` 输出面向业务与外部的成品，并将成果回写 `09_周报月报` 与 `memory-bank`。2025Q4 的治理重点聚焦三点：① 清空 Inbox 与历史观点堆积并补齐引用链；② 用 `05_方法论中心`、`06_工作流模版与规范` 做执行手册，确保方法论与模板同步更新；③ 依托 `🛠️ Knowledge-Audit-Tools` 的脚本、清单建立周度巡检。当前市场档案、投资方法论、Skills 资料已形成索引，但仍需修复旧命名、规范脚本归属，并在 Summary 中声明“知识库索引已更新”以保持跨目录追溯。

# LaunchX 知识库总览

## 1. 角色定位
- **使命支撑**：为投资、企业服务、传播、内部运营提供数据、方法论、模板与案例。
- **外部大脑**：与根级协作总览、`memory-bank/README.md`、`memory-bank/support_modules/knowledge/USEME.md` 协同，为 Claude/Codex 提供可复用资产。
- **闭环模式**：判断（方法论）→ 趋势（研究）→ 结论（输出），形成可执行洞察。

## 2. 三段式知识流水线
| 阶段 | 目录 | 说明 |
| --- | --- | --- |
| **采集** | `01_Inbox/` | 收集原始资料、打标签；24h 内迁移或清理 |
| **分析** | `02_分析与洞察/` | 结构化信息、撰写阶段性洞察、引用 5 通道结果 |
| **生成** | `03_研究报告/`、`07_市场项目档案/`、`08_知识传播与品牌/` | 输出报告、档案、传播素材；补 frontmatter 与“引用于”段落 |
| **归档/复盘** | `09_周报月报/`、`memory-bank/` | 记录周期成果、更新记忆库、触发改进 |

> Frontmatter 统一字段：`title/owners/status/last_update/related/source/impact`，并注明“自动生成 / 人工采集”。

## 3. 核心资产地图
| 类型 | 路径 | 内容 |
| --- | --- | --- |
| 方法论体系 | `05_方法论中心/` | 判断/趋势/结论方法论、AI Context 实施指南、提示词模板 |
| 模块引导 | `00_模块引导系统/` | AI 投资、企业服务、知识传播、系统迭代等模块导航 |
| 档案库 | `04_被投企业数据库/`、`07_市场项目档案/` | 投资/市场档案、案例库 |
| 工作流模板 | `06_工作流模版与规范/` | 研究模板、报告结构、流程指南 |
| 传播资产 | `08_知识传播与品牌/` | 对外内容、品牌策略、素材模板 |
| 数据源 | `study/` (根目录) | 原始数据、实验笔记、脚本 |

相关 `memory-bank/support_modules/knowledge/USEME.md` 提供导入方式、常用脚本、注意事项。

## 4. 推荐工具与脚本
- MCP：`tavily-remote-mcp`（实时搜索）、`jina-ai`（内容解析）、`media-crawler`（全平台素材）、`chart-server`（图表）、`knowledge-search`（本地检索）。
- Python：位于 `study/tools/`（例如趋势分析、数据清洗脚本）。
- Shell：`scripts/validate-ai-context.sh`、`scripts/ai-context-check.sh`（如存在则执行并更新日志）。

使用原则：优先复用既有工具；输出图表或数据需标注脚本/命令、时间、来源。

## 5. 质量与流程守则
1. **采集**：记录来源、时间、可靠性等级，24 小时内决定“转入分析 / 废弃”。
2. **分析**：对照 `05_方法论中心/📚 知识管理方法论/🟢_管理_观点复查方法论_V1.1_20251023.md` 执行五通道验证。
3. **生成**：按模板输出，补齐 frontmatter、引用与验证说明。
4. **归档**：在 README 与 `memory-bank` 回写索引，并在变更 Summary 中声明“知识库索引已更新”。

## 6. 维护责任与节奏
- **知识库管理员**：把控目录结构、frontmatter 完整性，以及跨域引用的同步。
- **贡献者**：提交产出时更新相关 README / 方法论，并补充回写说明。
- **巡检例行**：每周运行 `🛠️ Knowledge-Audit-Tools/knowledge_audit.py` 并在 `09_周报月报` 登记结果；每月复查主题方法论与市场档案。

## 7. 近期优先事项（2025-10）
1. 完成 `01_Inbox` 堆积稿件的归档或淘汰，并记录在 `perspective_registry.jsonl`。
2. 更新 `02_分析与洞察` 与 `03_研究报告` 中的历史观点，补齐 2025 数据引用。
3. 清理目录命名与脚本归属，形成例外说明或迁移计划。
4. 在 `09_周报月报` 建立“知识复查周志”章节，追踪巡检与整改。

## 8. 关键链接
- 根级指挥与协作：`CLAUDE.md` · `README.md` · `AGENTS.md`
- 操作手册：`05_方法论中心/` · `06_工作流模版与规范/` · `memory-bank/support_modules/knowledge/USEME.md`
- 自动化工具：`🛠️ Knowledge-Audit-Tools/` · `📊 Bilibili视频数据/`
- 业务资产：`c_AI投资研究/` · `07_市场项目档案/` · `08_知识传播与品牌/`

如需新增流程或工具，请在 Summary 中说明“知识指挥体系已更新”，并同步本文档、`memory-bank/support_modules/knowledge/USEME.md` 及相关索引。
