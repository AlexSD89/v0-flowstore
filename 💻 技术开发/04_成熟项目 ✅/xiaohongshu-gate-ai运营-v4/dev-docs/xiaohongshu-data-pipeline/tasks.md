---
title: "小红书数据系统 & Agent 设计 · 任务清单（Tasks）"
owners:
  - LaunchX Tech Core
status: active
last_update: "2025-11-21"
related:
  - "./context.md"
  - "./plan.md"
  - "./00-数据源与采集策略.md"
  - "./01-Agent与工具架构设计.md"
  - "./02-数据留存与访问规范.md"
source: "V1 小红书自动化项目现状分析 + 未来多 Client 扩展需求"
impact: "为 Codex / Claude 提供可执行的 Checklist，确保数据系统设计与实现保持一致"
---

# 小红书数据系统 & Agent 设计 · 任务清单

> 使用方式：Codex 勾选本地已完成项；Claude 在实际调用工具/配置 BMAD 时勾选远端执行项。

## Phase 1 · 资产梳理与工具挂接

- [ ] T1-01 · 列出小红书相关数据源
  - 输出：`00-数据源与采集策略.md` 中的「数据源清单」初稿。
  - 说明：包括话题榜/搜索结果/账号主页/评论/收藏等。

- [ ] T1-02 · 完成 tools 集成表（最小版）
  - 输出：`01-Agent与工具架构设计.md` 的「XHS 数据采集与舆情分析工具矩阵」。
  - 要求：至少覆盖 `xiaohongshu-mcp`、`weibo-public-opinion-analysis-system`、`obsidian-content-distributor`、`launchx-spec-kit-cli`。

- [ ] T1-03 · LaunchX 客户数据路径对齐
  - 输出：`02-数据留存与访问规范.md` 中对 `clients/launch-x/data/*` 的引用与解释。
  - 说明：保证 V1 中已有的数据目录结构在文档中有明确定义。

## Phase 2 · 标准化数据管道

- [ ] T2-01 · 设计标准数据目录结构
  - 输出：`02-数据留存与访问规范.md` 中的「标准目录结构」小节。
  - 内容：`data/raw` / `data/processed` / `data/learning` / `data/quality_logs` / `data/performance` 等。

- [ ] T2-02 · 定义 Agent ↔ 工具 ↔ 数据路径映射
  - 输出：`01-Agent与工具架构设计.md` 中针对每个 Agent 的「使用工具 + 输出路径」说明。

- [ ] T2-03 · 与 Post Spec / Client SDK 字段联动
  - 输出：
    - 在 `01-Agent与工具架构设计.md` 中，标注哪些任务为 Post Spec 提供 `trending_snapshot_id` 等字段；
    - 在 `xiaohongshu-ops-spec/README.md` 或相关文件中补充引用说明。

## Phase 3 · 与演化系统联动

- [ ] T3-01 · 定义 Experiment Log 与 Pattern Library 的数据输入
  - 输出：在 `xiaohongshu-evolution-system` 目录中，说明从哪些数据路径读取实验结果与表现数据。

- [ ] T3-02 · 为季度认知快照定义数据源
  - 输出：在 Evolution 层方法论文档中，写明「季度总结」应引用哪些数据（trending、quality_logs、Auto_Iteration_Report 等）。

