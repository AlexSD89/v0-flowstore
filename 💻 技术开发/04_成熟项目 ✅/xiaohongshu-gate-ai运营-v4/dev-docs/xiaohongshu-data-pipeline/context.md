---
title: "小红书数据系统 & Agent 设计 · 上下文（Context）"
owners:
  - LaunchX Tech Core
status: active
last_update: "2025-11-21"
related:
  - "../../ARCHITECTURE.md"
  - "../xiaohongshu-ops-spec/README.md"
  - "../../../xiaohongshu_ai_automation_v1/docs/Data_Driven_Content_Automation_Flow_2025-09-24.md"
  - "../../../xiaohongshu_ai_automation_v1/docs/Dynamic_Spec_Iteration_Plan.md"
  - "../../../xiaohongshu_ai_automation_v1/clients/launch-x/README.md"
source: "V1 小红书自动化系统代码与文档 + 本轮设计对话"
impact: "为小红书运营提供统一的数据采集、落盘与 Agent 调度上下文，避免工具与业务割裂"
---

# 小红书数据系统 & Agent 设计 · 上下文

> 本文件回答：小红书运营智能系统要依赖哪些数据？这些数据由谁采集、怎样落盘、如何被 Claude / Gate OS 消费？

## 1. 业务背景（简要）

- 目标：支撑「小红书 Gate AI 运营系统」的智能行为，包括：
  - 选题与内容策略（结合趋势与竞品）；
  - 标签与 SEO 优化（基于真实搜索/浏览行为）；
  - 舆情与口碑监控（评论情感与高价值互动）；
  - 实验与演化（A/B 结果、质量日志、迭代报告）。
- 当前状态（V1）：
  - `xiaohongshu_ai_automation_v1` 中已经存在完整的 Client 目录结构：
    - `clients/<slug>/data/intel`：Rube / MCP 情报输入；
    - `clients/<slug>/data/learning`：trending 学习结果；
    - `clients/<slug>/data/quality_logs`：质量日志；
  - 存在数据驱动自动化流程的文档：
    - `Data_Driven_Content_Automation_Flow_2025-09-24.md`；
    - `Dynamic_Spec_Iteration_Plan.md`。
- Gap：
  - 数据源与采集任务没有系统化地挂到 `🧰 tools/` 的具体项目上；
  - Agent（如趋势学习、舆情分析）与工具依赖关系只在代码里隐含，没有在 Dev Docs 中声明；
  - V1 的数据路径主要围绕 `clients/launch-x`，尚未抽象为可复用的「行业/Client 数据管道设计」。

## 2. 本目录目标

- 为小红书运营定义一个可复用的数据与 Agent 设计规范：
  1. 明确数据源列表（平台、入口、用途、刷新频率）；
  2. 明确每个采集/分析任务对应的工具与 Agent（来自 `🧰 tools/` 与 V1 core/agents）；
  3. 定义统一的落盘路径与命名规范，便于 Claude / Gate OS / BMAD 直接消费；
  4. 定义 Codex / Claude 的职责分工：Codex 负责文档与 schema；Claude 负责实际调度与运行。

## 3. 文档结构

- `context.md`（本文件）：
  - 描述业务上下文与现有资产（V1 / tools）。
- `plan.md`：
  - 规划数据系统与 Agent 的演进路线（优先支持哪些数据源与场景）。
- `tasks.md`：
  - 以 Checklist 形式列出要实现/对齐的具体任务。
- `00-数据源与采集策略.md`：
  - 定义小红书相关的数据源与采集策略（话题榜、账号主页、评论区、竞品等）。
- `01-Agent与工具架构设计.md`：
  - 建立「Agent ↔ tools 工程 ↔ 数据路径」的映射表，是工具集成总览文档。
- `02-数据留存与访问规范.md`：
  - 规定数据在仓内/外部的数据仓中如何存放、命名与清理，以及如何被上层 Spec 与演化系统使用。

这些文档共同确保：当我们在 V4 中提到「运行一个数据采集/趋势学习/舆情分析任务」时，Claude/Codex 都知道要去哪找工具、去哪读写数据、对应哪一步业务逻辑。

