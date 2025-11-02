---
title: "Codex-ClaCode 联动技能概览"
owners:
  - Launch X Codex Team
status: active
last_update: 2025-10-31
related:
  - ./SKILL.md
  - 🛠️ 系统管理/memory-bank/Codex-Claude-配置指南.md
  - AGENTS.md
  - CLAUDE.md
source: 基于 sypsyp97/claude-skill-codex 调整
impact: 提供符合 LaunchX 风险控制要求的 Codex-ClaCode 联动能力
---

# Codex-ClaCode 联动技能

> 在保持 LaunchX Guardrails（审批优先、最小权限、日志闭环）的前提下，让 Claude Code 能够调度 Codex CLI 完成代码分析与安全修改。

## 能力范围
- 自动确认任务等级（`Collect → Align`）并匹配 Codex CLI 沙箱模式；
- 基于用户偏好选择 `gpt-5` / `gpt-5-codex` 模型，以及推理力度；
- 规范化构建 `codex exec` 命令，默认遵循 `approval_policy` 与 `sandbox_mode`；
- 提供最小可执行示例（只读分析 / 可写改动 / 会话恢复），并输出验证与回滚提示；
- 记录命令、输出、测试日志，提醒按照 `Summary / Testing / Next Steps` 模板回写。

## 与原仓库差异
- 移除默认的 `--yolo`（跳过沙箱）与 `--full-auto`（全自动执行）组合，改为“经审批后显式启用”；
- 新增 LaunchX 内部校验清单（配置核对、权限确认、日志闭环）；
- 默认保留 stderr，只有在需要隐藏思维 token 时再 `2>/dev/null`；
- 对危险模式（`danger-full-access` / `--yolo`）增加严格告警与审批流程要求。

## 安装流程
1. 复制 `SKILL.md` 至 `~/.claude/skills/codex/`；
2. `Collect` 阶段确认 `~/.codex/config.toml` 已按《Codex-Claude 配置指南》启用；
3. 在 Claude Code 中提及“使用 Codex 进行 …”，技能即自动启用。

> TODO｜待补充：结合 `🧩 bmad` 自动化脚本的调用示例（责任人：Automation Steward）。
