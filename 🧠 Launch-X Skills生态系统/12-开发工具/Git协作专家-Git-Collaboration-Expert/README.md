---
title: "Git-claudecode 指导 Skill 概览"
owners:
  - LaunchX Skills 团队
status: active
last_update: '2025-10-31'
related:
  - ./SKILL.md
  - ./instructions.md
  - ./resources/doc-driven-bdd-prompt.md
  - ./tests/doc-driven-workflow-checklist.md
source: 本地技能资产
impact: "为 Claude Code 提供文档驱动开发 + Git 协作的执行指引"
---

# Git-claudecode 指导 Skill

> 在 Git 协作规范的基础上，新增“文档→测试→实现→回写”闭环支持，帮助 Claude Code 将需求文档直接驱动 BDD（行为驱动开发）与后续代码迭代。

## 🚀 能力概览
- **文档驱动开发（Document-Driven Development）**：按照 LaunchX 项目方法论的“先文档、后实现”原则组织需求、测试与实现[[🟣 knowledge/02_分析与洞察/项目开发方法论/PROJECT_DEVELOPMENT_METHODOLOGY.md:20]]。
- **BDD 测试生成**：根据功能文档产出 RSpec（Ruby on Rails）或替代框架的验收剧本、边界用例与测试夹具。
- **最小可行实现规划**：结合 Git 协作经验，给出服务对象/脚本骨架、并发与幂等策略提示。
- **回写与互链提醒**：指引将验证结果、开放问题、日志回写到 memory-bank、README 及互链文档，维持知识闭环[[AGENTS.md:38]]。

## 📈 文档→测试→实现→回写 工作流
1. **Collect｜收集**：抽取功能文档核心目标、约束、时间窗等参数；确认可复用资产与责任人。
2. **Align｜对齐**：编制 BDD 场景（Given/When/Then 或 RSpec 场景），并列出验证脚本、幂等策略、风险与回滚。
3. **Deliver｜交付**：指导执行端按照测试驱动实现，记录 Git 操作、锁机制、索引以及代码变更。
4. **Archive｜回写**：将测试结果、日志与开放问题同步回原始文档、memory-bank、项目 README，实现可追溯沉淀。

## 🧪 技术栈适配
| 场景 | 默认建议 | 替代方案 |
| --- | --- | --- |
| Rails / Ruby | RSpec + FactoryBot + Capybara 场景生成 | Minitest（保留行为描述），结合 YARD 文档 |
| Node.js / TypeScript | Playwright / Vitest BDD 插件，或 Cucumber.js | Jest + supertest，保留 Gherkin 场景 |
| Python 服务 | pytest-bdd / behave | pytest + requests +自定义验收脚本 |
| 低代码 / 接口测试 | Postman/Newman collection，结合 JSON schema | Karate / k6 负载脚本 |

> Skill 会依据仓库语言、依赖与现有测试目录自动给出匹配建议，并提示需要补充的数据工厂、锁与日志。

## 📂 目录与资源
- `instructions.md` —— Claude Code 提示模板、执行前检查表、技术栈适配策略。
- `SKILL.md` —— 技能元信息、输入输出参数、能力矩阵。
- `resources/doc-driven-bdd-prompt.md` —— 标准提示词、Rails 示例与跨技术栈映射。
- `tests/doc-driven-workflow-checklist.md` —— 最小验证清单，覆盖测试生成、实现与回写环节。

## 🧭 典型调用场景
- 将业务功能文档转化为可执行的 RSpec 验收测试。
- 在非 Rails 项目中复制“文档驱动 + BDD”方法论，自动补齐 Playwright / pytest 等测试骨架。
- 结合 Git 协作策略，规划测试先行的增量开发与回滚方案。
- 协助执行端记录测试日志、互链 memory-bank，以满足 `AGENTS.md` 对可追溯性的要求[[AGENTS.md:36-53]]。

该 Skill 让 Claude Code 能够在跨技术栈环境中执行统一的文档驱动流程，并确保所有新增资产被纳入项目治理闭环。
