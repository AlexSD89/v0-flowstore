---
category: knowledge
impact: 界定知识域人机协作职责
last_update: '2025-10-24'
owners:
- LaunchX Knowledge Lab
related:
- ./README.md
- ./CLAUDE.md
- ./RULES.md
source: 自动生成（Codex CLI）
status: active
tags: []
title: 知识域 AGENTS
---

## 📋 执行摘要

知识域的治理说明已集中至 `📖README-知识库总览.md`。本指挥文档聚焦“谁负责什么、何时升级”。所有执行人员在进入 Knowledge 域前，需完成 Phase 0（加载 `CLAUDE.md`、`RULES.md`、`memory-bank/support_modules/knowledge/USEME.md`），并按照最新巡检结果（见 `09_周报月报`）确认当前优先事项。

# 知识域协作图

## 角色矩阵
| 角色 | 职责 | 核心交付 |
| --- | --- | --- |
| Knowledge Lead | 策略制定、质量把关、跨域协调 | 研究议题、审核报告、版本管理 |
| LaunchX Codex | 执行五通道检索、撰写分析、回写索引 | 结构化洞察、引用记录、Summary |
| 业务联络官 | 把研究成果映射到客户/内部需求 | 提案要点、FAQ、定制化材料 |
| 方法论维护者 | 更新框架、模板、提示词 | `05_方法论中心` 文档、脚本说明 |

## 协作节奏
- 每周整理趋势与重点案例，纳入 `09_周报月报`。
- 大型研究（>2 天）先在 `/spec` 备案，确认输入、产出、审校节点。
- 与业务域保持双周同步会议，审视知识资产对交付的支持度。

## 工作接口
- 与技术域：共享实现方案、实验数据，沉淀为方法论或案例库。
- 与设计域：提取视觉化要素，更新品牌/传播模板。
- 与深度研究域：同步长线课题，避免重复调研。
- 与自动化实验室：将高频检索与报告生成脚本化，记录在 `🧩 bmad` 与 `memory-bank/support_modules/knowledge/USEME.md`。

## 升级触发
- 巡检发现 Inbox > 24h 堆积、frontmatter 缺失或脚本留存违规时，立即通报 Knowledge Lead 并在周志登记整改计划。
- 涉及跨域方法论更新、市场档案大规模迁移，先提交 `/spec`，确认引用链与回写路径后执行。
- 对外发布或对投资决策产生影响的报告，需完成业务/品牌复核并在 Summary 标记审批状态。

- 遇到敏感信息、版权风险或跨部门决策，立即升级给 Knowledge Lead 并标记 `#需要人工介入`。
- 对外公开稿件需经过法律/品牌审核并在 Summary 备注审批结论。
- 发现知识空缺（无模板、无方法论）时，先立项补齐再继续执行。
