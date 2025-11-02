---
title: "文档驱动 BDD 提示词模板"
owners:
  - LaunchX Skills 团队
status: active
last_update: '2025-10-31'
related:
  - ../README.md
  - ../instructions.md
source: 结合外部实践与 LaunchX 方法论
impact: "指导 Claude Code 从单页文档产出测试、实现与回写计划"
---

# 文档驱动 BDD 提示词模板

> 参考《用 Claude Code 做“面向文档编程”＋ RSpec BDD，把 Rails 新功能几分钟搞定》以及 LaunchX 文档驱动方法论整理。

## 标准 Claude Code 提示
```text
角色：资深 <tech_stack> 工程师 + 测试教练
上下文：已加载根级 AGENTS.md、CLAUDE.md、目标域 README/RULES/USEME
目标：根据下述功能文档，完成“文档→测试→实现→回写”闭环
输出：
1. BDD/验收测试脚本（含主流程 + 边界 + 幂等用例）
2. 最小实现建议（服务对象/模块骨架、数据查询、锁/索引/日志策略）
3. 验证命令与日志记录方式
4. 回写/互链清单与开放问题
约束：
- 引用使用 path:line，例如 memory-bank 与 README
- 缺失资产以“TODO｜待补充 + 缺口来源”记录
- 测试优先，未通过测试不得提交实现方案

附：功能文档
<粘贴业务或技术说明>
```

## 可选参数
- `tech_stack`：`rails`（默认）/`node`/`python`/`api`/自定义。
- `time_window`：业务聚合窗口，例如 `60s`、`5m`。
- `log_target`：需要记录的表、索引或事件流。

## 生成要点
- **测试优先**：先产出验收脚本，再补充测试数据工厂与执行命令。
- **幂等与锁**：识别需要的互斥锁、唯一索引、回放日志策略。
- **验证与回写**：明确测试命令、日志路径，并指示回写 memory-bank 与 README。
- **跨栈自适应**：若 `tech_stack!=rails`，需换成 Playwright/Vitest、pytest-bdd 或 Postman collection，并说明依赖安装命令。

## 示例引用
- rails 示例：`tech_stack=rails` + RSpec + FactoryBot。
- node 示例：`tech_stack=node` + Playwright + Prisma 事务。
- python 示例：`tech_stack=python` + pytest-bdd + SQLAlchemy。

> 若仓库缺少所需依赖或测试目录，需在输出中生成任务清单并提醒执行端先补齐环境。
