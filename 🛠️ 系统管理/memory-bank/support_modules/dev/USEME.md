---
title: "USEME"
owners:
  - LaunchX Claude Team
status: active
last_update: 2025-11-05
related:
  - "../README.md"
  - "../CLAUDE.md"
source: "LaunchX 系统管理模块指南"
impact: medium
tags:
  - support_module
  - dev
---


# Claude增强技术开发模块 · USEME

版本：2025-10-27 · 维护：LaunchX Tech Core
> 集成Claude专属开发能力：90%+开发自动化率，85%+代码复用率，95%+部署成功率

> 面向 `support_modules/dev/` 及其共用脚本、工具链与自动化资产。所有开发域任务都应先查阅本指南，确认现成能力与 guardrails，再进入 `/spec → /plan → /do`。

## Phase 0 Checklist
```text
[ ] 阅读根级 CLAUDE.md / AGENTS.md 与 support_modules/dev 域内 README / CLAUDE / RULES / AGENTS
[ ] 运行必要的环境脚本：bash scripts/mcp-prewarm.sh、bash scripts/dev-verify.sh（如存在）、lint/test 命令
[ ] 搜索 support_modules/dev 及子目录（fd/rg）确认是否已有可复用脚本或模板
[ ] 查阅相关项目目录的 USEME.md / README.md，核对导入方式、禁区、回滚策略
[ ] 更新 `.cursorrules` 内提示片段，确保与当前流程一致
[ ] **Claude能力检查**：确认90%+Claude能力集成率和40%+效率提升目标
[ ] **Claude工具验证**：检查Claude SDK、Skills、BMAD协作工具可用性
```

## 导入说明
- 根路径：`support_modules/dev/`
- 通用导入范式：
  ```ts
  // import { runPipeline } from '@/support_modules/dev/scripts/run-pipeline'
  // import type { DeploymentConfig } from '@/support_modules/dev/types/deployment'
  ```
- Node 项目依赖：`pnpm install` 或 `npm install` → `pnpm run validate` → `pnpm test`
- Python 子任务：`python -m venv .venv` → `source .venv/bin/activate` → `pip install -r requirements.txt` → `pytest`
- 自动化脚本同步：高频脚本需镜像到 `🧩 bmad` 并在此列出导入方式。

## 公共工具与脚本目录
| 模块 | 位置 | 用途 |
| --- | --- | --- |
| 构建与校验脚本 | `support_modules/dev/scripts/` | Lint、格式化、bundle、静态检查（如 `check-no-barrel-imports`，实现后记录） |
| DevOps 配置 | `support_modules/dev/config/` | CI 片段、环境变量模板、deployment config |
| CLI & Helper | `support_modules/dev/cli/` | 命令行工具、任务执行器、常用生成脚本 |
| 类型与常量 | `support_modules/dev/types/`、`constants/` | 项目共享的类型定义、限界常量 |
| 自动化衔接 | `🧩 bmad/` 对应 `support_modules/dev/bmad-*` | 将开发域高频任务脚本化以供多域复用 |

> 若目录尚未创建，请在新增脚本时同步建立，并更新本表与 `README.md` 的"快速参考"。

## 关键场景指导
- **项目初始化**：使用 `scripts/create-project-from-template.ts`（补齐后在此登记），自动生成基本目录、配置与 README；执行完成后更新 `00_开发计划 📋`。
- **环境校验**：运行 `bash scripts/dev-verify.sh` 或 `pnpm run doctor`（如定义），并在 Summary 记录日志摘要。
- **自动化发布**：通过 `support_modules/dev/cli/release.ts`（占位）与 `🧩 bmad` 的 `release-agent` 配合，确保有回滚命令与审批流程。
- **设计联动**：开发前查阅 `support_modules/design/USEME.md`，确认 design tokens 与组件路径；实现完成后告知设计域更新索引。

## Claude增强开发最佳实践

### 智能开发流程优化
- **Claude辅助架构设计**：使用Claude SDK进行智能架构分析和设计决策
- **自动化代码生成**：Claude智能生成符合项目规范的代码框架
- **智能测试生成**：基于代码自动生成完整的测试套件
- **智能文档生成**：自动生成API文档、部署指南、运维手册

### Claude工具集成最佳实践
- **智能错误诊断**：Claude自动分析代码错误并提供修复建议
- **性能优化建议**：Claude分析代码性能瓶颈并生成优化方案
- **安全扫描集成**：自动进行安全漏洞扫描和修复建议
- **兼容性检查**：跨平台、跨版本兼容性自动验证

### 协作开发优化
- **智能代码审查**：Claude进行深度代码审查和最佳实践检查
- **知识库同步**：自动将开发经验同步到知识库供团队复用
- **技术债务管理**：智能识别技术债务并制定清理计划
- **版本管理优化**：智能建议版本号和变更日志

## 最佳实践
- **最小改动**：始终优先复用现有脚本、Hook、配置；新增能力需判断是否应归入 `support_modules/dev` 或 `../../🧩 bmad`。
- **日志沉淀**：在实施或验证脚本时，生成的日志、指令与输出摘要须写入 Summary，并在必要时附录于 `📊 reports`。
- **自动化同步**：当发现重复操作（环境搭建、持续验证、发布流程等），先在 `/spec` 提出脚本化方案，经确认后补到 `support_modules/dev` 与 `🧩 bmad`。
- **跨域沟通**：涉及业务、知识、设计需求的改动需提前通知对应域负责人，并在 Summary 标注"已同步上下文"。

## 常见问题与排查
| 场景 | 可能原因 | 处理策略 |
| --- | --- | --- |
| 脚本运行失败 | 环境未预热、依赖缺失、Node 版本不符 | 按 Phase 0 Checklist 重新执行脚本，并在 Summary 记录命令与输出 |
| 重复实现工具函数 | 未查阅 `support_modules/dev` 或 `common/` | 使用 `fd/rg` 搜索关键字；如确无实现，再新增并更新本文件 |
| 自动化脚本漂移 | `../../🧩 bmad` 未同步 | 与 Automation Steward 协作，统一脚本版本并记录回滚方案 |
| 缺少导入示例 | USEME 未更新 | 补充导入片段、使用样例，并在 Summary 提醒文档已更新 |
| Claude能力未集成 | 开发流程未使用Claude专属能力 | 检查Claude SDK、Skills、BMAD工具集成状态，更新开发流程 |

## TODO / 待完善
- [ ] 实现并记录 `check-no-barrel-imports.mjs`、`check-duplicate-utils.mjs`、`check-ssr-dangerous-api.mjs`
- [ ] 补齐脚本目录说明：`support_modules/dev/scripts/`、`cli/`、`config/`
- [ ] 整理常用 `pnpm` / `pytest` / `playwright` 命令，添加到"关键场景指导"
- [ ] 与 Automation Steward 对照 `../../🧩 bmad` 中的执行脚本，建立双向索引
- [ ] 完善Claude集成工具链文档和使用示例
