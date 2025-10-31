---
title: "技术开发域 RULES"
owners:
  - "LaunchX Tech Core"
status: "active"
last_update: "2025-10-12"
related:
  - "./README.md"
  - "./CLAUDE.md"
  - "./AGENTS.md"
source: "自动生成（Codex CLI）"
impact: "约束开发域的交付与安全边界"
---

# 技术开发域 RULES

## 必做事项
- 所有需求进入 `/spec → /plan → /do` 流程，plan 保持 ≤3 步并实时同步。
- 任何改动需附验证记录：命令、输出摘要、结论，失败时写出推测根因与下一步。
- 代码、脚本、配置变更需在 24 小时内更新相关 README、`memory-bank` 与方法论文档。
- 架构或流程调整前需提交方案，获确认后方可执行，并在 Summary 记录风险与回滚路径。
- 公共能力更新前优先补齐 `memory-bank/support_modules/dev/USEME.md`，并同步自动化脚本到 `🧩 bmad`（如适用）。

## 禁止事项
- 不经查阅 `support_modules` 就地实现公共能力。
- 未经审批执行破坏性命令（`rm -rf`、`git reset --hard` 等）。
- 在未补前置 frontmatter、索引的情况下提交文档或脚本。
- 跳过测试或仅口头说明“已验证”而无日志佐证。

## 发布与回滚
- 发布前确认：代码通过 CI / 本地验证、文档索引已更新、业务/知识域已同步。
- 回滚策略必须写入 Summary，包含触发条件、操作命令、影响面评估。
- 若依赖外部服务或密钥，需在 `memory-bank/support_modules/dev/USEME.md` 记录使用说明与替代方案。
- 自动化脚本调整需同步 `scripts/` 与 `🧩 bmad`，保持工具链一致。

## 版本基线
- Node.js ≥ 18 / 22，Python ≥ 3.10，Shell 默认 `zsh`。
- MCP 服务需提前在 `~/.codex/config.toml` 配置；若需远程访问，记录代理与安全策略。
- 统一使用 `apply_patch` 修改文件；提交前运行适用的 lint / format 命令。
