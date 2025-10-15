# Codex Integration Module

该目录集中存放所有与 Codex CLI / OpenAI Responses API 集成相关的实现，包括：

- `codex-sdk.js`：对 Codex Responses API 的轻量封装，提供与 Subagent 类似的调用接口。
- `codex-subagents.json`：Codex 专用的 persona / 子代理配置，用于快速切换不同专业角色。

> **使用提醒**：此模块仅针对 Codex 环境。运行前请确保设置 `OPENAI_API_KEY`（或 `CODEX_API_KEY`）及所需模型变量。

在业务代码中，可通过 `require('./codex/codex-sdk')` 引入，并在调用时传入 `subagent_type` 等参数实现“伪 Subagent”行为。
