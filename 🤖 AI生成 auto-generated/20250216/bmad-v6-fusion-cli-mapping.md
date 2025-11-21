---
title: "BMAD Fusion CLI 映射设计草稿"
owners:
  - Launch X Codex Team
status: draft
last_update: 2025-02-16
related:
  - "../../specs/20250215-bmad-v6-native-fusion.md"
  - "../20250215/bmad-v6-fusion-mapping.md"
source: 人工梳理
impact: medium
---

# BMAD Fusion CLI 映射设计（初稿）

## 1. 目标

- **遵循 v6 官方安装流程**：所有能力通过 BMAD 安装器导出到 `.claude/commands`、`~/.codex/prompts` 等目录，避免在运行时直接调 OpenAI API。
- **复用现有资产**：基于 v5.4 `optimized-bmad-config-v5.3.json`、`codex-subagents.json` 和任务脚本，生成对应的 Markdown Agents、Workflow、Command 等资源。
- **兼容多 IDE/CLI**：确保 Claude Code CLI、Codex CLI 均能读取到同一套导出文件。

## 2. 映射关系

| v5.4 资产 | v6 CLI 产物 | 存放路径 | 生成方式 |
| --- | --- | --- | --- |
| `native_subagents`（JSON） | Agent Markdown（persona + 指令） | `bmad/fusion/agents/*.md` | 渲染模板，将 description/use_cases 映射为 persona/menus |
| `task_routing`、核心任务 | Workflow YAML + Task prompts | `bmad/fusion/workflows/*.yaml`、`bmad/fusion/tasks/*.md` | 将 `routeAndExecute` 的任务拆成工作流步骤/命令 |
| `collaboration_types` & synergy 指标 | 文档/配置注释 + 可能的 checklist | `bmad/fusion/docs/*.md` 或 workflow 附件 | 作为指南供 CLI 提示加载 |
| Subagent 定义（原 `codex-subagents.json`） | Claude Code sub-agent Markdown | `src/modules/fusion/sub-modules/claude-code/sub-agents/*.md` | 使用 CLAUDE Sub-module 机制选择性安装 |
| Mock/降级说明 | README/提示模板 | `bmad/fusion/docs/fusion-cli-guide.md` | 提示 CLI 用户如何加载/降级 |

## 3. 安装流程整合

1. **模块结构**
   - 新增 `bmad/fusion/` 目录，包含 `agents/`、`workflows/`、`tasks/`、`docs/`。
   - 在 `tools/platform-codes.yaml` 中复用现有 codex/claude-code 平台。
   - 为 `fusion` 模块提供 `_module-installer/injections.yaml`（Claude Code）与可选 `installer.js`。

2. **Codex 导出**
   - 由 `tools/cli/installers/lib/ide/codex.js` 读取 `bmad/fusion/agents/*.md`、`workflows` 生成 `~/.codex/prompts/bmad-fusion-*.md`。
   - 需要确保生成的 Markdown 结构与 codex prompt 规范兼容（例如顶部 frontmatter + 指令 XML）。

3. **Claude Code 导出**
   - `claude-code.js` 复制 `bmad/fusion/agents/*.md` 至 `.claude/commands/bmad/fusion/agents/`。
   - 若需要 sub-agent（Claude 原生命令），通过 `src/modules/fusion/sub-modules/claude-code/sub-agents/` 提供 Markdown，供安装器提示用户选择。

4. **Workflow/Task 命令**
   - 更新 `workflow-manifest.csv` / `task-manifest`，让 `WorkflowCommandGenerator`、`TaskToolCommandGenerator` 自动生成 CLI 命令。
   - 每个任务应映射为 `/fusion:tasks:*`（Claude）或 `/bmad-fusion-tasks-*`（Codex）。

## 4. TODO 列表

- [ ] 定义 Fusion 模块目录结构与模板（agents/workflows/tasks/docs/sub-modules）。
- [ ] 编写从 `optimized-bmad-config` 自动生成 Markdown/Workflow 的脚本（可放在 `tools/migration/`）。
- [ ] 在 `specs/20250215-bmad-v6-native-fusion.md` 更新实现思路、清理 OpenAI 依赖计划。
- [ ] 修改 backlog，新增“CLI 资源生成”“安装器集成”“移除 runtime invoker”等任务。
- [ ] 提供 README/使用指南：在 CLI 中如何激活 Fusion agents/workflows。

## 5. 风险提示

- Markdown/Workflow 模板需符合官方安装器解析规则，避免破坏现有 CLI 行为。
- 需要确认 `WorkflowCommandGenerator` 是否支持新增模块命名（若不支持需补补丁）。
- 去掉 runtime invoker 后，Fusion Core 的 JS 代码仍可作为“离线执行器”存在，但 CLI 用户主要依赖导出命令；需评估二者是否并存或完全转向 CLI 模式。
