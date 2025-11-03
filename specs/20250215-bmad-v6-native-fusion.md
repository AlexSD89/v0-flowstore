---
title: "BMAD v6 本地化融合方案（草稿）"
owners:
  - Launch X Codex Team
status: draft
last_update: 2025-02-15
related:
  - "BMAD_v6融合开发实施方案_V2.0_20251102.md"
  - "🧩 bmad /README.md"
  - "BMAD-METHOD-main-6/README.md"
source: 人工编制
impact: high
---

# BMAD v6 本地化融合方案

> 目标：在保持 v6 官方框架优势的前提下，将 v5.4 本地化（原 v4 fork）中的智能路由、原生 Subagent 协作、5 通道搜索与质量监控等能力迁移到 `BMAD-METHOD-main-6` 仓库中，实现统一的企业级智能协作底座。

## 1. 背景与现状

- 本地仓库 `🧩 bmad /bmad-core/codex` 已构建 v5.4 “原生 Subagent 优先”体系，涵盖任务路由、多协作模式、并发搜索与性能指标[[🧩 bmad /bmad-core/codex/codex-native-first-bmad-system.js:11]] [[🧩 bmad /bmad-core/codex/codex-bmad-core-task-enhancer.js:18]] [[🧩 bmad /bmad-core/codex/codex-bmad-native-tasks.js:18]]。
- 官方 v6 基座 `BMAD-METHOD-main-6` 目前仅保留模块骨架与 `_cfg` Update-Safe 配置框架，核心执行代码待补充[[BMAD-METHOD-main-6/README.md:1]] [[BMAD-METHOD-main-6/bmad/_cfg/manifest.yaml:1]]。
- 历史总结文档确认 v5.4 的性能指标与协作优势，需要在升级中予以保留[[🧩 bmad /BMAD_v5.3_原生Subagent优先系统总结.md:7]]。

## 2. 目标与非目标

### 2.1 目标
- 复用 v6 官方结构（目录、模块、Update-Safe 配置），将本地 v5.4 能力以插件化方式迁移至 `BMAD-METHOD-main-6`。
- 构建新版 `fusion` 子系统：包含 Agent Registry、Collaboration Engine、Search Orchestrator、Performance Monitor 等组件，并与 v5.4 配置数据兼容。
- 提供迁移工具链，实现 v5.4 JSON/YAML 配置 → v6 `_cfg` 结构的自动映射。
- 兼容 Codex CLI 与 Claude Code CLI 调用：统一暴露 `createFusionCore` 接口，可通过环境变量注入真实 subagent 调用或使用降级模式。
- 保留并验证 v5.4 的关键指标（协同效率、质量分数、搜索覆盖），并输出升级报告。

### 2.2 非目标
- 不更改 v5.4 原仓库结构（`🧩 bmad`）的历史记录；仅读取复用。
- 不在本迭代内接入外部 MCP 付费服务（保留接口，标记 TODO）。
- 不重写 v6 CLI 安装脚本，聚焦核心运行时和配置迁移。

## 3. 范围与输出

| 模块 | 迁移重点 | 预期产出 |
| --- | --- | --- |
| Agent Registry | 将 v5.4 Subagent 映射到 v6 注册体系 | `src/fusion/agents/`（新建）+ `_cfg/agents/*.json` 生成器 |
| Collaboration Engine | 并行、层次、Swarm、跨域模式 | `src/fusion/collaboration/` 实现 + 协作指标 |
| Search Orchestrator | 并发 5 通道搜索 + 结果批评 | `src/fusion/search/` 组件 + `search` 配置 |
| Performance Monitor | 协同效率、质量门控 | `src/fusion/monitoring/` + 指标落库方案 |
| Workflow Templates | 投资/技术/市场工作流 | `src/fusion/workflow/` 模板 + 校验 |
| Update-Safe 配置 | 自动迁移 v5.4 配置文件 | `tools/migration/*.js` + CLI 命令 |
| 文档与报告 | 融合手册与升级说明 | `/docs/fusion/README.md` + 迁移报告 |

> 当前子代理调用依赖 `openai` SDK 与 `OPENAI_API_KEY / CODEX_API_KEY / FAKERCODE` 等环境变量；缺失时自动降级为模拟结果，后续需补齐凭证管理与错误提示。

## 4. 引用资产与复用策略

1. 原生任务与协作逻辑：`🧩 bmad /bmad-core/codex/codex-native-first-bmad-system.js`、`codex-bmad-core-task-enhancer.js`、`codex-bmad-native-tasks.js`。
2. 业务指标与方法论：`🧩 bmad /BMAD_v5.3_原生Subagent优先系统总结.md`（性能、协同指标）。
3. v6 Update-Safe 基础：`BMAD-METHOD-main-6/bmad/_cfg/*.csv` + `manifest.yaml`。
4. 战略路线参考：`BMAD_v6融合开发实施方案_V2.0_20251102.md`（阶段划分、风险提示）。

## 5. 计划拆解与阶段

### Phase A｜能力梳理与映射（Collect & Model）
- 对 v5.4 代码进行模块分类（路由、任务、搜索、指标），产出映射表。
- 盘点 v6 仓库现有目录结构，定义新建 `src/fusion`、`docs/fusion` 等路径。
- 输出配置映射规范（v5.4 JSON/YAML → v6 `_cfg`）与差异清单。

### Phase B｜架构设计与脚手架（Compare & Align）
- 设计 Fusion Core 架构（Agent Registry + Collaboration Engine + Search Orchestrator + Update-Safe Manager）。
- 生成初版 TypeScript/JavaScript 模板、接口定义、依赖注入方式。（✅ 已落地 `core/`、`agents/`、`collaboration/`、`search/`、`monitoring/`、`config/`、`tasks/` 目录骨架）
- 定义质量指标采集与验证策略（单元、集成、性能测试矩阵）。

### Phase C｜功能迁移与实现（Deliver）
- 逐模块迁移 v5.4 能力，确保落地到 v6 目录并通过 lint/test。
- 实现配置迁移 CLI（读取 `🧩 bmad` 配置 → 生成 `_cfg`），附回滚脚本。
- 构建测试覆盖：核心任务快照、协作模式验证、搜索模拟、性能基线。

### Phase D｜验证与文档化（Archive）
- 运行自动化测试与性能评测，对比 v5.4 指标。
- 撰写升级指引、回滚方案、Known Issues。
- 更新相关 README、memory-bank 互链，并输出融合总结报告。

## 6. 里程碑与验收标准

| 里程碑 | 验收标准 |
| --- | --- |
| M1：能力映射完成 | 产出模块映射表 + 配置差异清单，团队评审通过 |
| M2：Fusion Core 框架 | `src/fusion` 结构、接口定义、单元测试通过 |
| M3：功能迁移落地 | 主要任务/协作/搜索模块迁移完成，测试覆盖 ≥80% |
| M4：配置迁移工具 | CLI 可完成 v5.4 → v6 `_cfg` 迁移并生成报告 |
| M5：验证与文档 | 性能指标达标或给出偏差解释，文档与互链更新 |

## 7. 验证策略

- **单元测试**：对子模块的核心逻辑编写 Jest/Node 测试；覆盖任务路由、协作模式、搜索聚合。
- **集成测试**：模拟完整任务执行流程，验证协同指标与搜索结果结构。
- **性能评估**：对比 v5.4 指标（协作效率、质量分数），记录差异。
- **配置回归**：迁移工具生成的 `_cfg` 文件需通过 schema 校验并支持回滚。

## 8. 风险与应对

| 风险 | 描述 | 应对 |
| --- | --- | --- |
| 架构差异 | v6 官方模块尚未提供运行时代码 | 自建 `fusion` 模块并与现有 CLI 解耦；必要时 mock 接口 |
| 配置不兼容 | v5.4 YAML/JSON 字段与 v6 `_cfg` 不一致 | 定义映射器 + 校验器，输出差异报告 |
| 性能回退 | 新实现可能偏离 v5.4 指标 | 建立基准测试，允许 ±5% 偏差并给出补偿计划 |
| 工期压力 | 跨模块迁移体量大 | 采取分阶段交付，优先核心路由与任务模块 |

## 9. 开放问题 / TODO

- 是否需要同步更新 `support_modules/` 或 memory-bank 索引？（待与知识管理确认）
- v6 CLI 在 Alpha 状态，需评估是否引入 TypeScript 构建流程或保持 CommonJS。
- MCP 付费渠道（Tavily、Firecrawl）是否可在目标环境启用？若受限需要替代方案。

---

> **后续动作**：待本方案获批后，进入 `/plan` 阶段，输出 2-3 步执行计划并逐步实现。
