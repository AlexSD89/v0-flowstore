---
title: "BMAD Fusion CLI 重构 Backlog"
owners:
  - Launch X Codex Team
status: draft
last_update: 2025-02-16
related:
  - "plans/20250216-bmad-fusion-cli-refactor.md"
  - "BMAD-METHOD-main-6/tools/cli/installers/lib/ide/codex.js"
  - "BMAD-METHOD-main-6/tools/cli/installers/lib/ide/claude-code.js"
source: 人工梳理
impact: high
---

# Backlog

| 序号 | 任务 | 说明 | 依赖 | 状态 |
| --- | --- | --- | --- | --- |
| C-01 | 生成 Fusion CLI 资源 | 根据 `optimized-bmad-config`、`codex-subagents` 输出 `bmad/fusion/agents/*.md`、`workflows/*.yaml`、`tasks/*.md` | 映射脚本 | 待开始 |
| C-02 | 构建 Fusion 模块目录 | 创建 `bmad/fusion/` 及 manifest、docs、sub-modules 结构 | C-01 | 待开始 |
| C-03 | 集成 Codex 安装器 | 更新 `codex.js`，导出 Fusion 资源到 `~/.codex/prompts` | C-02 | 待开始 |
| C-04 | 集成 Claude Code 安装器 | 更新 `claude-code.js`，复制 Fusion 资源到 `.claude/commands`，支持 subagent 选择 | C-02 | 待开始 |
| C-05 | 调整 Workflow/Task 命令 | 确保 `workflow-manifest.csv`、`task-manifest.csv` 含 Fusion 项，命令命名不冲突 | C-02 | 待开始 |
| C-06 | 移除 runtime invoker | 删除 `execution/subagent-invoker.js`、`openai` 依赖，提供可选 mock 钩子 | C-03/04 | 待开始 |
| C-07 | 文档与验证 | 更新 README、spec；编写 CLI 验证步骤，记录降级策略 | C-01~C-06 | 待开始 |

> 旧 Backlog 中与 runtime invoker 相关的 B-01~B-05 已作废，此表替代后续执行计划。

# 验证计划
- Codex CLI：运行 `node tools/cli/bmad-cli.js install --target . --modules fusion --ides codex`，确认 `~/.codex/prompts/bmad-fusion-*` 生成。
- Claude Code CLI：运行 `... --ides claude-code`，检查 `.claude/commands/bmad/fusion/agents` 及可选 sub-agents。
- CLI 命令测试：在两端输入 `/fusion:*` 或 `/bmad-fusion-*`，确认命令可见并加载。
- 运行时兼容性：Fusion Core 支持注入自定义 invoker（用于测试/脚本），默认不加载 OpenAI。

# TODO / 风险
- 需确认 Workflow/Task 生成器是否支持新模块命名；如不支持需补补丁。
- CLI 生成脚本需写入安装资源，不可污染已有模块。
- 保留回滚策略：可通过 `_cfg/files-manifest.csv` 查找到所有生成文件并删除。
