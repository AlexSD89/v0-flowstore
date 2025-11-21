---
title: "业务服务 CLAUDE 指南"
owners:
  - "LaunchX Business Ops"
status: "active"
last_update: "2025-10-15"
related:
  - "./README.md"
  - "./RULES.md"
  - "./AGENTS.md"
source: "自动生成（Codex CLI）"
impact: "指导 AI 在业务域安全协作"
---

# 业务服务 CLAUDE 指南

## Phase 0 Checklist
1. 快速扫描：@根目录指挥文档第15-25行（核心协作原则）+ @本目录README.md第1-10行（业务域概述）
2. 精确读取：@RULES.md第17-30行（业务域技能触发规则）+ @memory-bank/support_modules/launchx/USEME.md第1-20行（模板位置）
3. 定位查询：`find "🚀 Launchx业务服务" -name "*客户*" -o -name "*case*" | head -3` 获取最近客户资料
4. 快速确认：`grep -n "保密等级\|NDA\|对外" "🚀 Launchx业务服务"/*.md | tail -5` 查看保密要求
5. 强制要求：复杂业务任务必须创建Dev Docs三文件（见@RULES.md第63-75行模板）

> 使用 spec-kit 或其它生成器产出的 `/spec`、`/plan`、`/do` 草稿，统一存放在 `🤖 AI生成 auto-generated/YYYYMMDD/<slug>/` 并维护索引；经审核通过后 24 小时内迁移至目标目录（如 `study/specs/`、`plans/`、客户子目录），同时更新 frontmatter 与 Summary。

## 执行流程
| 阶段 | 行动 | 产出 |
| --- | --- | --- |
| `/spec` | 复盘需求、确认禁区、列出任务清单 | Checklist、风险提示、所需资料 |
| `/plan` | 拆解交付步骤，标注所需协作者 | 时间线、责任人、验证节点 |
| `/do` | 编写材料、整合资源、同步进展 | 提案稿、会议纪要、交付记录 |
| 归档 | 更新案例库、伙伴列表、指标表 | README 索引、Summary、后续行动 |

## 工具与模板
- 提案：`memory-bank/support_modules/launchx/templates/proposal-*`（如存在）。
- 会议：使用 `memory-bank/support_modules/launchx/checklists/meeting.md` 记录议程与行动项。
- 指标：`📊 reports` 与业务指标表同步。
- 传播：与设计域共享 `b_知识传播与品牌策略` 中的素材。
- 自动化：与 Automation Liaison 协作，在 `🧩 bmad` 维护高频交付脚本。

## 质量守则
- 所有对外材料需双重审校：业务负责人 + 品牌/法律（如涉及敏感信息）。
- 每次客户互动后 24h 内更新 `Ⅱ_对外业务`，记录决策与待办。
- 使用 Summary 模板回传交付状态，附验证（客户反馈、会议结论、指标）。
- 若需引入第三方工具或数据，提前在 `/spec` 说明合规风险。
- 草稿阶段内容需标注状态，并在归档时同步 Automation Liaison 判断是否脚本化。

## 上下文索引
- 需求池：`Ⅰ_待处理信息/README`（若缺失需先补齐）。
- 案例库：`a_企业AI转型服务策略与案例`。
- 品牌资产：`b_知识传播与品牌策略`、`🎨 设计美学资源库`。
- 知识支持：`🟣 knowledge/03_研究报告`、`05_方法论中心`。
