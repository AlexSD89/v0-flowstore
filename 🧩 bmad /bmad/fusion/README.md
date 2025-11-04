# BMAD Fusion CLI 资源

> 本目录由 `tools/migration/generate-fusion-cli.js` 自动生成，用于 Codex / Claude Code 安装器导出 Fusion Agent、Workflow 与 Task 命令。文件一旦更新需重新运行安装器或 `bmad-cli` 才会同步到对应 IDE。

- `agents/`：Fusion 专用代理（Markdown），供 `.claude/commands` 与 `~/.codex/prompts` 复用。
- `workflows/`：按任务路由生成的 YAML 工作流，结合 `workflow-manifest.csv` 输出 CLI 命令。
- `tasks/`：任务/工具描述，用于 `TaskToolCommandGenerator`。
- `docs/`：可选说明/清单。

请勿手动编辑生成文件，改动应在脚本或源配置中完成。
