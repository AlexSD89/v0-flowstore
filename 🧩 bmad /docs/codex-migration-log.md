# Codex ⇆ CC BMad 能力迁移日志

> 记录将原有 Claude Code（CC）环境中的 BMad 子代理、任务、脚本迁移到 Codex CLI 的过程，确保两套环境保持并行可用。

- **2025-01-27**：建立迁移日志，Codex 读取 `🧩 bmad/bmad-core/codex/codex-subagents.json`，AGENTS.md 同步指向；后续每次新增/修改角色、脚本、SOP，请追加条目，注明影响范围与验证结果。

记录模板：

```
## YYYY-MM-DD — 变更名称
- 涉及能力：business_analyst / backend_architect / …
- 修改内容：
  1. …
  2. …
- 验证：npm run bmad:validate / npm run test / 其它命令
- 影响目录：
  - Codex：AGENTS.md / specs/... / scripts...
  - CC：.claude/... / CCPlugins/...
```

## 2025-01-27 — Codex validation bootstrap
- 涉及能力：business_analyst、backend_architect、ai_engineer 等 native subagents
- 修改内容：
  1. 新增 `config/agents-sdk-config.json` 作为 Codex 验证桥接层
  2. 增补 `enhanced-bmad-tasks.ts`、`examples/codex_integration_example.js`、`tests/codex_smoke_test.js`
  3. 安装 `@anthropic-ai/claude-agent-sdk` 依赖，确保验证脚本通过
- 验证：`npm install`、`npm run validate`
- 影响目录：
  - Codex：`AGENTS.md` / `🧩 bmad/bmad-core` 新增文件
  - CC：保持现有路径不变，共享同一配置

### 补充 — 2025-01-27
- 调整 `codex-bmad-core-task-enhancer.js` / `codex-bmad-native-tasks.js` 的模块引用路径，避免 `./codex/codex-sdk` 相对路径错误。
- 新增示例与测试运行：`node examples/codex_integration_example.js`、`node tests/codex_smoke_test.js`。
- `npm run test` 在未配置 OPENAI_API_KEY 的情况下会失败；请提供有效 Codex/OpenAI 或 Fakercode 凭证后重试。

## 2025-10-11 — Codex CLI 接入自检
- 涉及能力：analyst、architect、bmad-master、bmad-orchestrator、dev、pm、po、qa、sm、ux-expert
- 修改内容：
  1. 在根级 `AGENTS.md` 新增 BMAD 角色映射，确保 Codex 解析 `.bmad-core/agents/*.md`
-  2. 确认现有 `🧩 bmad /bmad-core` 目录完整，复用自定义安装版本
- 验证：`npm run validate`、`node examples/codex_integration_example.js`
- 影响目录：
  - Codex：`AGENTS.md`、`🧩 bmad /docs/codex-migration-log.md`
  - CC：复用既有配置，无额外改动

### 补充 — 2025-10-11
- Fakercode 适配：`codex-sdk.js` 新增 `FAKERCODE_API_KEY`/`FAKERCODE`/`FAKERCODE_BASE_URL`，支持自建网关；缺少凭证会直接报错，需配置后重试
- 移除离线模拟：`codex-bmad-native-tasks.js`、`codex-bmad-core-task-enhancer.js` 恢复严格模式，API 调用失败将返回错误，便于问题定位
- 示例脚本 `examples/codex_integration_example.js` 用于连通性检查；若未联网或凭证无效，将显示具体异常信息
