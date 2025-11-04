---
title: "文档驱动 BDD 工作流验证清单"
owners:
  - LaunchX Skills 团队
status: draft
last_update: '2025-10-31'
related:
  - ../README.md
  - ../resources/doc-driven-bdd-prompt.md
source: LaunchX 内部自测流程
impact: "确保 Skill 输出满足测试优先与回写闭环要求"
---

# 验证清单

1. **上下文加载**
   - [ ] 已引用根级 `AGENTS.md`、目标域 `README/CLAUDE/RULES/USEME`。
   - [ ] Summary 中列出已读取的文档与命令。

2. **测试生成**
   - [ ] 输出包含主流程 + 边界流程 + 幂等验证的 BDD 场景。
   - [ ] 给出测试命令（如 `bundle exec rspec`、`npx playwright test`、`pytest -k`）。
   - [ ] 列出缺失的工厂/fixture/依赖，并标注 `TODO｜待补充`。

3. **最小实现**
   - [ ] 提供服务对象/模块骨架或伪代码，标注关键幂等、锁、索引方案。
   - [ ] 对并发、日志、回滚策略进行风险说明。

4. **回写与互链**
   - [ ] 指明 memory-bank、README、日志或监控需要更新的路径。
   - [ ] Summary 使用 `Summary / Testing / Next Steps` 模板，并注明互链已处理或待补充。

5. **Git 协作安全**
   - [ ] 告知使用 `git add <path>` 或 `git add -p` 控制范围。
   - [ ] 提示检查 `.gitignore`、敏感信息与构建产物。

> 若任一项未满足，需要在 Summary 中标注风险并给出补救计划。
