---
title: "设计美学 CLAUDE 指南"
owners:
  - "LaunchX Design Guild"
status: "active"
last_update: "2025-10-12"
related:
  - "./README.md"
  - "./RULES.md"
  - "./AGENTS.md"
source: "自动生成（Codex CLI）"
impact: "保障设计域 AI 协作一致性"
---

# 设计美学 CLAUDE 指南

## Phase 0 Checklist
1. 阅读根级指挥文档与本目录 `README.md`、`RULES.md`。
2. 加载 `memory-bank/support_modules/design/USEME.md`，了解组件命名、配色变量、输出模板。
3. 确认本次任务面向对象（产品设计 / 品牌传播 / 客户提案）。
4. 收集参考：复查业务或知识域的需求背景与故事线。
5. `/spec` 中列出：目标受众、风格约束、交付形式、所需协作者。

> 草稿可暂存 `🤖 AI生成 auto-generated/日期`，需在 24 小时内整理并归档至本目录。

## 执行流程
| 阶段 | 行动 | 交付 |
| --- | --- | --- |
| 构思 (Discovery) | 收集输入、明确品牌调性、列出约束 | Moodboard、风格基调、检查单 |
| 设计 (Design) | 选择设计系统、生成组件或版式方案 | 线框/高保真稿、配色/排版说明 |
| 实现 (Handoff) | 与技术域同步组件实现，输出标注与资源 | 交付包、变量表、交付说明 |
| 归档 (Archive) | 回写索引、更新模板、记录反馈 | README 更新、Summary、版本记录 |

## 工具与模板
- 视觉稿模板：`memory-bank/support_modules/design/templates/*`。
- 组件变量表：参考 `memory-bank/support_modules/design/tokens`（若存在）。
- 品牌素材：`品牌设计/` 目录及相关 Figma 链接。
- 客户提案：与 `🚀 Launchx业务服务` 协作的品牌模板。

## 质量守则
- 所有输出需遵循品牌色、字体、图形系统；变更需备案。
- 交付文件需包含组件切图、变量定义、响应式说明与可访问性考虑。
- 优先复用现有 design tokens 与组件，避免重复建构。
- 与技术/业务域保持反馈循环，24h 内回应关键修改请求。
- 草稿阶段产出需标注版本，并在归档前同步 Automation Liaison 确认是否需脚本化导出。

## 上下文索引
- `memory-bank/support_modules/design/USEME.md`：设计语言、组件说明、导出流程。
- `🚀 Launchx业务服务/b_知识传播与品牌策略`：对外传播资源与排期。
- `🟣 knowledge/05_方法论中心`：设计方法、协作指南。
- `💻 技术开发/README.md`：与开发域的接口约束。
