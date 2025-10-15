---
title: "深度研究域 AGENTS"
owners:
  - "LaunchX Deep Study"
status: "active"
last_update: "2025-10-12"
related:
  - "./README.md"
  - "./CLAUDE.md"
  - "./RULES.md"
source: "自动生成（Codex CLI）"
impact: "明确深度研究协作者职责"
---

# 深度研究域协作图

## 角色矩阵
| 角色 | 职责 | 核心交付 |
| --- | --- | --- |
| Research Lead | 定义课题、审查方法、控制质量 | 立项文档、阶段评审、最终结论 |
| LaunchX Codex | 推进研究、整理资料、撰写报告 | 分析笔记、模型说明、Summary |
| Domain Expert (Tech/Business) | 提供行业洞察、验证假设 | 专家访谈、评估意见、实施建议 |
| Knowledge Liaison | 同步方法论、维护引用索引 | 方法论更新、引用表、回写记录 |
| Automation Partner | 维护研究自动化脚本、协调 `🧩 bmad` 任务 | 数据处理脚本、自动化日志、回滚方案 |

## 协作节奏
- 课题立项后定义里程碑与评审节奏（至少双周一次）。
- 每个阶段完成后在 `/plan` 更新状态，提交 Summary 与风险列表。
- 与相关域共创实验或试点，记录反馈并调整研究假设。
- 每日整理 `🤖 AI生成` 草稿，确保临时笔记在 24h 内归档。

## 工作接口
- `memory-bank/README.md`：课题概览、时间线、资源配置。
- `🟣 knowledge/02_分析与洞察`：共享中期成果与方法论。
- `🚀 Launchx业务服务`：验证商业可行性、收集客户反馈。
- `💻 技术开发`：协调实验脚本与 PoC 实现。
- `🧩 bmad/`：存放自动化管线、实验脚本，与 Automation Partner 协同维护。

## 升级触发
- 出现数据缺口、权限受限、伦理/合规问题时立即升级至 Research Lead。
- 项目超期或资源不足需在 Summary 标注并联络业务/技术负责人调整。
- 新方法论或框架成熟后，及时同步到知识域与 `memory-bank/support_modules/deep-study`。
- 自动化脚本出现异常或跨域影响时，立即通知 Automation Partner 评估回滚。
