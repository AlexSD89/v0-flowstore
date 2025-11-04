---
name: codex
title: LaunchX Codex Execution Skill
description: LaunchX Guardrailed Codex CLI integration for Claude Code，确保命令审批、最小权限与验证闭环。
allowed-tools:
  - bash:read-only
  - python:read-only
  - read
owners:
  - LaunchX Skills团队
status: active
last_update: '2025-10-31'
related:
  - ./README.md
  - ./instructions.md
source: 人工采集
impact: 规范 Codex CLI 在 Claude Code 场景下的指令构建、执行与归档流程
tags:
  - codex
  - guardrails
location: user
---

# LaunchX Codex Execution Skill

> Claude Code 通过该技能安全地调用 `codex exec`，严格遵循 LaunchX 的 `Collect → Align → Deliver → Archive` 流程。

## Phase 0 ｜外部大脑加载
- ☐ 阅读 `AGENTS.md`、`CLAUDE.md`、`🛠️ 系统管理/memory-bank/Codex-Claude-配置指南.md`，确认 Guardrails[[AGENTS.md:13]][🛠️ 系统管理/memory-bank/Codex-Claude-配置指南.md:1]
- ☐ 校验 `~/.codex/config.toml`：`approval_policy != "never"`、`sandbox_mode` 与任务级别匹配[[🛠️ 系统管理/memory-bank/Codex-Claude-配置指南.md:96]]
- ☐ 明确任务等级（Level S/M/L），完成 `Collect` 清单后再进入执行[[AGENTS.md:60]]

## Collect → Align 清单
1. 任务分类  
   - Level S：只读分析 → 建议 `sandbox=read-only`  
   - Level M：方案对比/多文件分析 → 可选 `read-only` + `--full-auto`（需已审批）  
   - Level L：需要写入 → `sandbox=workspace-write`，执行前确认 git 快照与回滚策略
2. 参数收集  
   - 统一通过 `AskUserQuestion` 获取：模型(`gpt-5` / `gpt-5-codex`)、推理力度(`minimal`/`low`/`medium`/`high`)、是否允许写入、日志输出偏好  
   - 若用户未确认，默认：`model=gpt-5`、`model_reasoning_effort="medium"`、`sandbox="read-only"`
3. 风险确认  
   - 只在获得 Automation Steward 或域负责人明确批准时才使用 `danger-full-access` 或 `--yolo`[[🛠️ 系统管理/memory-bank/Codex-Claude-配置指南.md:114]]  
   - 记录潜在破坏性命令、网络访问需求和回滚路径

## 命令构建准则
```bash
codex exec \
  -m <MODEL> \
  -c model_reasoning_effort="<EFFORT>" \
  -s <SANDBOX> \
  --skip-git-repo-check \
  [--full-auto] \
  "<PROMPT>"
```

- **只读分析**  
  ```bash
  codex exec \
    -m {{model}} \
    -c model_reasoning_effort="{{effort}}" \
    -s read-only \
    --skip-git-repo-check \
    "{{prompt}}"
  ```
- **需要写入**（经审批）  
  ```bash
  codex exec \
    -m {{model}} \
    -c model_reasoning_effort="{{effort}}" \
    -s workspace-write \
    --skip-git-repo-check \
    --full-auto \
    "{{prompt}}"
  ```
- **会话恢复**  
  ```bash
  echo "{{follow_up}}" | codex exec --skip-git-repo-check resume --last
  ```

### 禁用与警示
- 默认不添加 `2>/dev/null`，除非用户请求隐藏思维 token；
- **禁止默认使用** `--yolo`（绕过审批与沙箱）。如遇 HPC / Landlock 限制，需：
  1. 在 Summary 记录原因、风险与审批人；
  2. 使用 `--yolo` 时移除 `--full-auto`，并执行后立即回到安全沙箱；
  3. 复核执行日志与文件 diff。

## Deliver ｜执行步骤
1. 构建命令前再次广播：目标、模型、沙箱、回滚方案；
2. 执行 `codex exec`，保留 stdout/stderr，非 0 退出需给出排错建议；
3. 若执行包含写入：  
   - `git status` 验证改动；  
   - 回写测试日志及验证命令；  
   - 提醒执行端在 Summary 中补充 `Testing / Next Steps`。

## Archive ｜沉淀要求
- Summary 强制使用 `Summary / Testing / Next Steps`；列出使用的命令、日志位置、互链更新；
- 更新相关 README / memory-bank（如本技能目录与《Codex-Claude 配置指南》）；
- 标注未解决风险、所需人工介入及责任人；
- TODO｜待补充：结合 `🧩 bmad` 自动化管线的调用模板。

## 故障排除
- **命令拒绝执行**：检查 `~/.codex/config.toml` 是否缺少 `model` / `model_reasoning_effort`，或 `approval_policy` 被强制为 `never`；
- **沙箱错误**：确认当前目录是否在 git 仓库内，或适当启用 `--skip-git-repo-check`；如确需全局访问，走人工审批流程；
- **网络/权限异常**：参考 `🛠️ 系统管理/memory-bank/Codex-Claude-配置指南.md` 第 7 节，必要时联系 Automation Steward。

> 该技能默认继承 LaunchX 的 Guardrails。任何超出本文件约束的操作必须在 Summary 中记录“偏离原因 + 审批记录”，并同步域负责人。
