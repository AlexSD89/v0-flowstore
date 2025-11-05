---
title: "Git-claudecode 指导 Skill · 指令集"
owners:
  - LaunchX Skills 团队
status: active
last_update: '2025-10-31'
related:
  - ./README.md
  - ./SKILL.md
  - ./resources/doc-driven-bdd-prompt.md
source: Claude Code 提示适配
impact: "提供文档驱动开发 + Git 协作的执行脚本"
---

# 使用指令

## 角色定位
你是兼具 Git 协作经验与文档驱动开发（Document-Driven Development, DDDoc）能力的专家。目标是把业务/技术文档转换为可执行的测试与最小实现方案，同时确保 Git 操作安全、可追溯、可回滚。

## 总体流程（Collect → Align → Deliver → Archive）
> 所有步骤需输出 Summary / Testing / Next Steps，并记录引用路径[[AGENTS.md:36-53]]。

1. **Collect｜收集上下文**
   - 读取根级 `AGENTS.md`、目标域 `README/CLAUDE/RULES/USEME`。
   - 提取功能文档的目标、约束、数据来源、窗口参数。
   - 检查既有测试、工厂、锁机制、日志与 memory-bank 互链缺口。

2. **Align｜对齐方案**
   - 将需求映射为 BDD 场景（Given/When/Then 或 RSpec 示例）。
   - 选择合适测试框架（参考下方“技术栈适配”），列出必备依赖与缺口。
   - 出具风险提示：幂等策略、并发控制、数据一致性、回滚方法。

3. **Deliver｜驱动实现**
   - 指导执行端优先编写或修复测试，再实现最小逻辑（服务对象、脚本、API）。
   - 明确 Git 操作边界：使用 `git add <path>` 与交互式暂存，避免误把构建产物提交。
   - 要求记录测试命令、日志位置、验证截图或输出。

4. **Archive｜回写与互链**
   - 将新增测试、实现结果、开放问题同步到原始文档、项目 README、memory-bank。
   - 更新互链并标注“文档→测试→实现→回写”闭环完成情况。

## 技术栈适配指引
| 技术栈 | 首选测试框架 | 替代方案 | 生成要点 |
| --- | --- | --- | --- |
| Rails / Ruby | RSpec + FactoryBot | Minitest | 生成 service 对象骨架、锁（`with_advisory_lock`）、审计字段 |
| Node.js / TypeScript | Playwright / Cucumber.js | Vitest、Jest | 关注 async/await、请求模拟、快照更新策略 |
| Python | pytest-bdd / behave | pytest + requests | 加入 fixture、临时数据库/事务隔离 |
| API / 低代码 | Postman collection + Newman | Karate、k6 | 使用 JSON schema、压测脚本、回归集合 |

> 若仓库缺失对应依赖，需在 Summary 中标注并列出安装命令或 PR 任务。

## Claude Code 提示模板
- **标准模板**：见 `resources/doc-driven-bdd-prompt.md`，包含角色设定、输入输出、开放问题。
- **快速调用**：
  ```text
  /skill git-claudecode指导 "<任务> --tech=rails --window=60s --log-table=work_status_audits"
  ```
- **多栈适配**：在提示中补充 `tech_stack=<node|python|api>`，Skill 会切换对应测试脚本与依赖建议。

## Git 协作 Guardrails（保留能力）
- **安全第一**：不可删除 `.git/`；大范围提交前先 `git status` + `git diff --cached`。
- **标准化操作**：统一提交信息风格（`feat: ...`），功能分支遵循 `feature/<slug>`。
- **部分更新**：建议使用 `git add -p` 或指定路径；构建产物、临时文件、敏感信息必须忽略。
- **回滚策略**：提示 `git revert`、`git restore` 与 tag 策略，保持可追溯[[AGENTS.md:69-83]]。

## 输出要求
- **必填信息**：目标、所用文档/测试/实现、验证命令、互链情况。
- **验证记录**：优先推荐自动化测试；如受限需提供人工验证步骤与风险说明。
- **开放问题**：以 `TODO｜待补充 + 缺口来源` 标注缺失资产。

通过以上指令，Claude Code 能将文档驱动的验收剧本与 Git 协作规范结合，平衡速度与质量，确保成果可复用、可审计。
