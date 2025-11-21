---
title: "小红书数据系统 & Agent 设计 · 实施计划（Plan）"
owners:
  - LaunchX Tech Core
status: active
last_update: "2025-11-21"
related:
  - "./context.md"
  - "./tasks.md"
  - "./00-数据源与采集策略.md"
  - "./01-Agent与工具架构设计.md"
  - "./02-数据留存与访问规范.md"
  - "../xiaohongshu-ops-spec/README.md"
  - "../../../xiaohongshu_ai_automation_v1/docs/Data_Driven_Content_Automation_Flow_2025-09-24.md"
source: "V1 数据流设计 + tools 代码架构 + 本轮文档重构设计"
impact: "为小红书运营提供可执行的数据与 Agent 系统演进路线，使工具调用与业务 Spec 严格对齐"
---

# 小红书数据系统 & Agent 设计 · 实施计划

> 目标：在不推翻 V1 的前提下，把数据与 Agent 体系抽象成可复用、可文档化、可扩展的模块，支撑后续多个 Client/行业。

## 1. 阶段划分

### Phase 1 · 资产梳理与工具挂接（当前阶段）

- 时间：1–2 周
- 目标：
  - 梳理现有 V1 项目和 `🧰 tools/` 中与小红书相关的数据流与 Agent；
  - 在 `01-Agent与工具架构设计.md` 中建立第一版「工具集成矩阵」；
  - 在 `00-数据源与采集策略.md` 中列出主要数据源与采集策略草稿；
  - 定义最小可用的数据留存规范（`02-数据留存与访问规范.md`）。
- 验收：
  - 至少覆盖 LaunchX 客户（`clients/launch-x`）的全部关键数据源与 Agent；
  - 对 `xiaohongshu-mcp`、`weibo-public-opinion-analysis-system`、`obsidian-content-distributor`、`launchx-spec-kit-cli` 的角色有明确描述与路径引用。

### Phase 2 · 标准化数据管道（多 Client 复用）

- 时间：2–4 周
- 目标：
  - 基于 LaunchX 客户的实践，将数据管道抽象为「行业/Client 无关」的通用结构；
  - 明确：
    - 标准的 `data/raw` / `data/processed` / `data/learning` 命名规则；
    - Agent 调度层与工具层的分工（Codex vs Claude / BMAD）；
    - 与运营 Spec（Post Spec、Client SDK）之间的数据接口（例如 trending_snapshot_id 的来源）；
  - 为下一个垂直（如汽车小红书号）提供可直接复用的 Data Pipeline 模板。
- 验收：
  - 可以在不改核心代码的前提下，为新 Client 配置一条最小可用的数据管道；
  - 所有关键 Agent 任务都有「工具依赖 + 输出路径」说明；
  - 与 `xiaohongshu-ops-spec/` 中的 Post Spec 有明确字段映射（如 trending_snapshot_id 对应的 JSON 路径）。

### Phase 3 · 与演化系统联动（Evolution 层）

- 时间：持续演进
- 目标：
  - 将数据输出与演化系统（Pattern Library、Experiment Log、季度认知快照）打通；
  - 让 trending 学习、质量日志、迭代报告自动更新：
    - Pattern 的优先级与权重；
    - Client Spec 中的推荐标签/结构；
    - 方法论文档中的「升级日志」。
- 验收：
  - 在 `xiaohongshu-evolution-system/` 中可以追溯「某个 Pattern/方法论是在哪些实验数据支持下被采纳的」。

## 2. 与 Claude / Codex 角色分工

- Codex（你现在使用的 CLI）：
  - 负责：
    - 维护本目录文档结构与内容；
    - 在代码中新增/修改数据相关逻辑时，更新对应文档（特别是 `01-Agent与工具架构设计.md` 与 `02-数据留存与访问规范.md`）；
    - 在 Summary 中记录实际运行时的数据路径与日志位置。
  - 不负责：
    - 直接运行 BMAD Flow / 调度外部 MCP 服务。

- Claude（作为 Gate OS 操作系统的一部分）：
  - 负责：
    - 根据本目录中的设计，在 BMAD / Hooks / MCP 中具体配置定时任务与执行流程；
    - 在实际运行后，将日志与关键结果回写到本目录引用的路径；
    - 按 Evolution 层的规范，定期提炼方法论与 Pattern。

## 3. 当前优先级（LaunchX 客户场景）

1. 为 `clients/launch-x` 明确：
   - 小红书相关的数据源列表与采集策略（首要关注：AI 工具评测垂直）；
   - 使用 `xiaohongshu-mcp` 采集哪些数据、调用哪些 API；
   - 使用 `weibo-public-opinion-analysis-system` 的哪些架构/模块，迁移到小红书舆情分析；
   - trending 学习结果在文件系统中的位置与 schema（供 Post Spec 使用）。

2. 将以上结论写入：
   - `00-数据源与采集策略.md`；
   - `01-Agent与工具架构设计.md`；
   - `02-数据留存与访问规范.md`。

