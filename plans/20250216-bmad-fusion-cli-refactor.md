---
title: "Fusion CLI 重构计划"
owners:
  - Launch X Codex Team
status: draft
last_update: 2025-02-16
related:
  - "specs/20250216-bmad-fusion-cli-refactor.md"
  - "tools/migration/generate-fusion-cli.js"
source: 人工规划
impact: high
---

1. **生成 CLI 资源**：实现脚本 `tools/migration/generate-fusion-cli.js`（已完成样本导出）。
2. **模块集成**：将 `bmad/fusion` 注册到 manifest，补充 docs/agents/workflows/tasks。
3. **安装器适配**：更新 `tools/cli/installers/lib/ide/codex.js` 与 `claude-code.js` 读取 Fusion 目录。
4. **清理依赖**：移除运行时 `execution/subagent-invoker.js` 与 `openai`，保留可注入 mock 钩子。
5. **文档/测试**：更新 README、CLI 指南，记录手动验证步骤与降级策略。

> 详细拆解与进度请见 `plans/20250216-bmad-fusion-cli-refactor.md`（本文件）与 `🤖 AI生成 auto-generated/20250216/bmad-v6-fusion-backlog.md`（需复制到本仓库）。
