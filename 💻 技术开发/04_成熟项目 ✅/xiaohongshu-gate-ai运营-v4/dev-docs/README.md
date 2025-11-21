---
title: "小红书 Gate AI 运营系统 · 设计文档总入口"
owners:
  - LaunchX Tech Core
status: active
last_update: "2025-11-21"
related:
  - "../ARCHITECTURE.md"
  - "./xiaohongshu-ops-spec/README.md"
  - "./xiaohongshu-data-pipeline/context.md"
  - "./xiaohongshu-evolution-system/README.md"
  - "../..//xiaohongshu-ai运营-v3/v4.0-claude-code-fusion/README-LaunchX-v4.0.md"
source: "V4 总纲 + 现有 dev-docs 子目录结构整合"
impact: "明确本项目唯一设计文档根目录，并标注当前架构下的主动维护模块与历史归档模块"
---

# 小红书 Gate AI 运营系统 · 设计文档总入口

> 本目录是 `xiaohongshu-gate-ai运营-v4` 项目的**唯一设计文档文件夹（dev-docs）**。  
> 所有与架构、运营 Spec、数据管道、演化系统相关的设计，统一在此维护；其他同项目下的设计草稿若未并入本架构，统一标记为历史归档。

## 1. 当前架构下的「主动维护模块」

这些子目录与 v4 总纲保持一致，会随着实际运营与实现持续更新：

- `gate-os/`
  - Gate OS 内核总体架构与模块设计（AgentRuntime / SkillsEngine / Evidence & LOA / WorkflowOrchestrator）；
  - 只描述 Gate OS 在 CC 之上的职责，不写具体业务规则。
- `sdk/`
  - 从 Gate OS 视角看各 Project SDK 的结构，目前包含：
    - `xiaohongshu-project-sdk.md`：小红书运营项目级 SDK 设计；
  - Client SDK（如 LaunchX）仍在对应领域模块内定义，此处只做总览。
- `xiaohongshu-ops-spec/`
  - 运营 Spec 总体设计（系统定位、四层文档分层）；
  - Client SDK（如 `client-sdk-launchx.md`）；
  - Post Spec 模板与 Gate 场景日记实例（如财务月底结账场景）。
- `xiaohongshu-data-pipeline/`
  - 数据源与采集策略；
  - Agent 与 tools 映射（含 `xiaohongshu-mcp` 等）；
  - 数据留存规范与发布工作流设计（Post Spec → MCP → 发布 → 回写）。
- `xiaohongshu-evolution-system/`
  - 演化系统 README；
  - Pattern Library 与 Experiment Log（如 `experiment-log-LaunchX-2025Q4.md`）。
- `xiaohongshu-vertical-design/`
  - 小红书垂直/种草生态的通用设计哲学与技术架构；
  - 作为 Ops Spec / Data Pipeline / Evolution 的上层思想背景，不单独跑项目。

> 说明：之后新增设计工作，优先考虑放入上述模块之一；若出现新的设计维度，再在本文件补充说明。

## 2. 建议的使用方式

- 找「该去哪看设计？」：
  - **项目顶层哲学 / 架构** → `v4.0-claude-code-fusion/README-LaunchX-v4.0.md` + `ARCHITECTURE.md`
  - **Gate OS 内核设计** → `gate-os/`
  - **Project SDK 视角（XHS 项目）** → `sdk/`
  - **运营视角与内容层 Spec** → `xiaohongshu-ops-spec/`
  - **数据与 Agent 层** → `xiaohongshu-data-pipeline/`
  - **演化 / 范式 / 实验层** → `xiaohongshu-evolution-system/`
  - **小红书垂直生态思想** → `xiaohongshu-vertical-design/`

- 看到 `v1-*` 或 `xiaohongshu-*optimization/brand-promotion`：
  - 默认当做历史设计演化记录；
  - 若发现有还没有吸收进现架构的精华，可以：
    - 在主动维护模块中补充；
    - 然后在对应历史文档边上标明「已被合并至 XXX」。

> 结论：从现在起，`dev-docs/` 即本项目**唯一**设计文档根目录，上述四个主动维护模块是唯一的设计入口。
