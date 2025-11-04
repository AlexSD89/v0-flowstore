---
title: "Fusion CLI 重构 Backlog"
owners:
  - Launch X Codex Team
status: draft
last_update: 2025-02-16
related:
  - "plans/20250216-bmad-fusion-cli-refactor.md"
  - "tools/migration/generate-fusion-cli.js"
source: 自动生成（手工维护）
impact: high
---

| 序号 | 任务 | 说明 | 依赖 | 状态 |
| --- | --- | --- | --- | --- |
| C-01 | 生成 Fusion CLI 资源 | `generate-fusion-cli.js` 输出 agents/tasks/workflows | - | ✅ 样例生成 |
| C-02 | Fusion 模块目录 | 确认 `bmad/fusion/` 结构、README | C-01 | ✅ |
| C-03 | Codex 安装器 | 更新 `codex.js` 导出 Fusion prompts | C-01/C-02 | ⏳ |
| C-04 | Claude 安装器 | 更新 `claude-code.js` 导出 Fusion commands | C-01/C-02 | ⏳ |
| C-05 | Manifest/命令 | 更新 `_cfg/*manifest.csv`、命名校验 | C-03/C-04 | ⏳ |
| C-06 | 移除 runtime invoker | 删除 `execution/subagent-invoker.js`、`openai` 依赖 | C-03/C-04 | ⏳ |
| C-07 | 文档/验证 | README、指南、验证脚本更新 | C-01~C-06 | ⏳ |

> 注：后续执行时请同步更新此表状态，确保 CLI 路线闭环。
