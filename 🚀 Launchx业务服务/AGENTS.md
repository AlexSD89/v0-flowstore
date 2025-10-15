---
title: "业务服务域 AGENTS"
owners:
  - "LaunchX Business Ops"
status: "active"
last_update: "2025-10-15"
related:
  - "./README.md"
  - "./CLAUDE.md"
  - "./RULES.md"
source: "自动生成（Codex CLI）"
impact: "明确业务域人机分工与节奏"
---

# 业务服务域协作图

## 角色矩阵
| 角色 | 职责 | 核心交付 |
| --- | --- | --- |
| Business Lead | 统筹客户关系、审批方案、协调资源 | 项目路线图、审批记录、关键决策 |
| LaunchX Codex | 撰写内容、整合数据、维护进度 | 提案草稿、会议纪要、Summary |
| Solution Architect | 评估技术可行性、协调开发支持 | 技术估算、风险评估、实施计划 |
| Brand/PR Partner | 保障品牌一致性、监督对外表达 | 视觉素材、传播排期、合规确认 |
| Automation Liaison | 将可复用流程脚本化、维护 `🧩 bmad` 任务 | 自动化脚本、使用指标、回滚指南 |

## 协作节奏
- 周度：更新项目看板、确认客户满意度与风险级别。
- 关键里程碑前后 24h 内发布 Summary，记录交付状态与下一步。
- 双周与知识域/技术域联合评审高价值提案与案例回写。
- 每日整理 `🤖 AI生成` 草稿，确保 24h 内归档并同步责任人。

## 工作接口
- `Ⅰ_待处理信息`：线索入库与优先级确认。
- `Ⅱ_对外业务`：项目执行主目录，由 Codex 维护状态。
- `Ⅳ_合作伙伴list`：与合作伙伴协同、资源调配。
- `a_企业AI转型服务策略与案例`：沉淀最佳实践供复用。
- `🧩 bmad/`：自动化脚本、标准化任务，与 Automation Liaison 协同维护。

## 升级触发
- 客户升级、合规风险、预算超支等高风险事件 → 立即通知 Business Lead 并标记 `#urgent`。
- 资源冲突或工期不可行 → 与技术域协商调整，并更新 `/plan`。
- 对外发布或重大公告 → 品牌方、法律双重确认后执行。
- 新方法论或脚本影响多域 → Automation Liaison 评估自动化方案并更新相关 RULES。

## 文档生成与归档规范
- **Kit 输出位置**：运行 `/spec`、`/plan`、`/do` 生成脚本时，草稿统一写入 `🤖 AI生成 auto-generated/YYYYMMDD/<slug>/`，严禁直接落在根目录或业务目录。
- **审阅归档**：经 Business Lead / Brand 审核通过后 24 小时内迁移至对应正式目录（如 `study/specs/`、`plans/`、`Ⅱ_对外业务/`），并更新 frontmatter `status`、`last_update`。
- **索引同步**：归档后同步更新本目录 `README.md`、Summary 及关联 `memory-bank` 索引，确保跨域检索与责任人追溯。
