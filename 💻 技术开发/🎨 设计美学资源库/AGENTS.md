---
title: "设计美学域 AGENTS"
owners:
  - "LaunchX Design Guild"
status: "active"
last_update: "2025-10-12"
related:
  - "./README.md"
  - "./CLAUDE.md"
  - "./RULES.md"
source: "自动生成（Codex CLI）"
impact: "厘清设计域协作角色"
---

# 设计美学域协作图

## 角色矩阵
| 角色 | 职责 | 核心交付 |
| --- | --- | --- |
| Design Lead | 守护品牌语言、审批关键交付 | 设计路线图、评审结论、版本记录 |
| LaunchX Codex | 设计执行、组件整理、交付归档 | 设计稿、交付包、Summary |
| Tech Partner | 组件实现、性能与可访问性反馈 | 组件指南、代码建议、落地计划 |
| Business Partner | 场景定义、客户反馈、落地评估 | 需求说明、使用反馈、成效指标 |
| Automation Liaison | 批量导出、脚本化处理、维护 `🧩 bmad` 流程 | 自动化脚本、导出清单、回滚方案 |

## 协作节奏
- 周度同步设计需求、跨域依赖与当前优先级。
- 重大项目设定设计里程碑（概念稿、定稿、交付），每阶段提交 Summary。
- 设计系统更新后 24h 内通知技术、知识、业务域，并更新索引。
- 每日检查 `🤖 AI生成` 草稿，确保 24h 内归档并标注版本。

## 工作接口
- `UI设计素材库/`：设计资产主目录，由 Codex 维护结构与说明。
- `品牌设计/`：品牌规范、对外素材，与业务域共享。
- `memory-bank/support_modules/design/USEME.md`：工具、tokens、导出流程。
- `🚀 Launchx业务服务` & `🟣 knowledge`：获取场景与内容输入。
- `🧩 bmad/`：存放设计自动化脚本，与 Automation Liaison 协同维护。

## 升级触发
- 品牌主元素变更或跨域争议 → 升级至 Design Lead 决策。
- 可访问性或实现风险 → 联合 Tech Partner 评估并制定改进方案。
- 素材版权、授权异常 → 立即停止使用并通知法务/品牌对口。
- 自动化脚本异常或导致批量误差 → 通知 Automation Liaison 评估回滚并更新流程。
