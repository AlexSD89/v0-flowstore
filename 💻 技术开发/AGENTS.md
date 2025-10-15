---
title: "技术开发域 AGENTS"
owners:
  - "LaunchX Tech Core"
status: "active"
last_update: "2025-10-12"
related:
  - "./README.md"
  - "./CLAUDE.md"
  - "./RULES.md"
source: "自动生成（Codex CLI）"
impact: "明确开发域人机协作分工"
---

# 技术开发域协作图

## 角色矩阵
| 角色 | 职责 | 核心交付 |
| --- | --- | --- |
| Tech Core Maintainer | 规划路线图、审查方案、把控风险 | `/spec` 审核、架构决策、发布把关 |
| LaunchX Codex | 执行实现、撰写文档、产出测试 | `/plan` 拆解、代码提交、Summary 归档 |
| QA / Review Crew | 运行验证、监控质量、收敛反馈 | 验证日志、缺陷记录、回滚建议 |
| 业务/知识联络人 | 同步需求、回写成果、协调优先级 | 需求列表、指标更新、知识沉淀 |
| Automation Steward | 维护 `🧩 bmad` 脚本与工具链 | 自动化脚本、使用说明、联动计划 |

## 任务分工
- **规划**：Maintainer 依据业务目标更新 `00_开发计划 📋`，Codex 拉齐执行清单。
- **实现**：Codex 负责复用公共能力、最小化改动并输出验证；QA 复核并记录结论。
- **归档**：Codex 更新 README、方法论；联络人负责将成果同步至业务域或知识域。
- **自动化**：Automation Steward 评估高频需求，沉淀脚本至 `🧩 bmad` 并提醒更新 `memory-bank/support_modules/dev/USEME.md`。

## 同步节奏
- 每周一更新开发计划、确认遗留事项与新需求。
- 每日站会（或 async 更新）记录进度、风险、阻塞项。
- 重大变更即时通知相关域，在 Summary 与 `📊 reports` 双重留痕。

## 升级路径
- 当遇到权限、依赖或安全问题时，立即升级至 Maintainer，并在 Summary 标注 `#需要人工介入`。
- 对新工具或流程试点，需先在 `/spec` 说明预期收益与风险，经确认后执行。
- 经验与模式沉淀至 `🟣 knowledge/05_方法论中心`，并更新 `memory-bank/support_modules/dev/USEME.md`。
- 自动化脚本影响多域时，提前与相关负责人同步回滚策略并更新各域 RULES。
