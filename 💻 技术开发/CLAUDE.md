---
title: "技术开发 CLAUDE 指南"
owners:
  - "LaunchX Tech Core"
status: "active"
last_update: "2025-10-12"
related:
  - "./README.md"
  - "./RULES.md"
  - "./AGENTS.md"
source: "自动生成（Codex CLI）"
impact: "规范开发域内的 AI 协作流程"
---

# 技术开发 CLAUDE 指南

## Phase 0 Checklist
1. 阅读根级 `CLAUDE.md`、本目录 `README.md`、`RULES.md`，并对照 `.cursorrules` 确认本地提示配置一致。
2. 同步 `memory-bank/support_modules/dev/USEME.md` 与相关包的 `USEME.md`。
3. 加载 `memory-bank/README.md` 了解当前项目快照与常用命令。
4. 确认环境脚本是否需要执行（`bash scripts/mcp-prewarm.sh`、`scripts/check-*`）。
5. 在 `/spec` 输出 checklist：输入、依赖、测试、回写要求。

> `memory-bank/support_modules/dev/USEME.md` 仍为占位符，遇到空白段落时需优先补齐导入说明与示例后再继续实现。

## 执行流程
| 阶段 | 行动 | 检查项 |
| --- | --- | --- |
| `/spec` | 梳理需求、约束、复用能力 | 引用现有模块、确认影响面 |
| `/plan` | 拆解任务、列出脚本/测试 | `update_plan` 控制 ≤3 步，标注验证方式 |
| `/do` | 迭代实现，记录命令 | 所有 `shell` 需说明目的，使用 `apply_patch` 改动 |
| 归档 | 回写 README / 方法论 / `memory-bank` | Summary 使用 `Summary / Testing / Next Steps` 模板 |

## 工具与命令
- 预热与检查：`bash scripts/mcp-prewarm.sh`、`bash scripts/dev-verify.sh`（如存在）。
- Node/PNPM 项目：`pnpm install` → `pnpm run validate` → `pnpm test`。
- Python 项目：`python -m venv .venv` → `pip install -r requirements.txt` → `pytest`。
- 代码搜索：`fd`（文件）、`rg`（文本）、`sg`（语法）。

### 自动化协同
- 高频流程脚本化：复用或扩展 `🧩 bmad` 中的脚本与多智能体任务。
- 新增自动化能力时，需同步 `memory-bank/support_modules/dev/USEME.md` 与 `memory-bank/README.md`。
- 若自动化脚本涉及跨域影响，先在 `/spec` 与相关域确认接口与回滚策略。

## 质量守则
- 优先复用 `support_modules`，发现重复能力需先整理公共模块再落地业务代码。
- 禁止“能运行=没问题”，最小化验证日志必须可复现。
- 变更涉及架构或脚本时，在 Summary 标记风险、回滚策略、影响面。
- 文档更新需补前端索引（README 或知识库）并声明“已同步上下文”。

## 上下文索引
- 根级指挥：`../CLAUDE.md`、`../AGENTS.md`。
- 公共能力：`memory-bank/support_modules/dev/USEME.md`、`memory-bank/support_modules/bmad/USEME.md`。
- 方法论：`🟣 knowledge/05_方法论中心`（工程实践与复盘模板）。
- 设计协同：`🎨 设计美学资源库/README.md`、`memory-bank/support_modules/design/USEME.md`。
