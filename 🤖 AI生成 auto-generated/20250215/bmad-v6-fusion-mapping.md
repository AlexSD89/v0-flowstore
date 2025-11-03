---
title: "BMAD v5.4 → v6 能力映射草稿"
owners:
  - Launch X Codex Team
status: draft
last_update: 2025-02-15
related:
  - "../../specs/20250215-bmad-v6-native-fusion.md"
  - "../../🧩 bmad /README.md"
source: 人工整理
impact: medium
---

# BMAD v5.4 → v6 核心能力映射（初稿）

## 1. 功能组件对照

| 分类 | v5.4 实现 | 摘要 | v6 目标落点 |
| --- | --- | --- | --- |
| 智能路由核心 | `🧩 bmad /bmad-core/codex/codex-native-first-bmad-system.js:11` | 读取 `optimized-bmad-config-v5.3.json`，封装 `routeAndExecute`、多协作模式执行、协同指标计算[[🧩 bmad /bmad-core/codex/codex-native-first-bmad-system.js:22]] [[🧩 bmad /bmad-core/codex/codex-native-first-bmad-system.js:130]] | `BMAD-METHOD-main-6/src/fusion/core/v6-fusion-core.js` + `agents/`、`collaboration/`、`search/` 子模块 |
| 原生 Tasks 集 | `🧩 bmad /bmad-core/codex/codex-bmad-native-tasks.js:18` | 10 个业务任务（市场、技术、商业、风险、竞争、用户、投资等），调用 Core Task Enhancer 并输出指标[[🧩 bmad /bmad-core/codex/codex-bmad-native-tasks.js:18]] [[🧩 bmad /bmad-core/codex/codex-bmad-native-tasks.js:198]] | 在 v6 中拆分为 `tasks/native-tasks.js` 模块，后续配合 workflow 模板 |
| 核心任务增强 | `🧩 bmad /bmad-core/codex/codex-bmad-core-task-enhancer.js:18` | 对并发搜索、智能策略、投资支持等任务包装原生 Subagent，并汇总性能指标[[🧩 bmad /bmad-core/codex/codex-bmad-core-task-enhancer.js:18]] [[🧩 bmad /bmad-core/codex/codex-bmad-core-task-enhancer.js:143]] | v6 中通过 `agents/agent-registry.js` + `collaboration/*.js` + `search/orchestrator.js` 协同实现 |
| 配置体系 | `🧩 bmad /bmad-core/config/optimized-bmad-config-v5.3.json:2` | 定义 Subagent 优先策略、协作类型、任务路由、MCP 通道、编排参数[[🧩 bmad /bmad-core/config/optimized-bmad-config-v5.3.json:12]] [[🧩 bmad /bmad-core/config/optimized-bmad-config-v5.3.json:167]] | 设计转换脚本 → 生成 v6 `_cfg`（JSON/CSV）并保留 Update-Safe 特性[[BMAD-METHOD-main-6/bmad/_cfg/manifest.yaml:1]] |
| 协作指标 | `optimized-bmad-config` 的 `synergy_metrics` + `NativeFirstBMADSystem.calculateSynergyMetrics`[[🧩 bmad /bmad-core/config/optimized-bmad-config-v5.3.json:97]] | 8 指标（知识转移、效率、质量、创新等），用于衡量协作效果 | 在 v6 Performance Monitor 中落地指标采集、仪表和阈值 |
| MCP / 搜索 | 配置 5 通道并发搜索 + `callNativeSearchAnalysisSubagents`[[🧩 bmad /bmad-core/codex/codex-bmad-core-task-enhancer.js:143]] | Tavily、Jina、GitHub、Filesystem、Git MCP 并发执行，提供批评与综合 | 在 v6 `search` 子模块封装 MCP 客户端，复用配置转换 |

## 2. Agent 与协作映射

- **原生 Subagent 列表**：见 `optimized-bmad-config-v5.3.json` `native_subagents` 字段，涵盖 business_analyst、backend_architect、ai_engineer 等 10+ 专业角色[[🧩 bmad /bmad-core/config/optimized-bmad-config-v5.3.json:18]]。
- **协作类型**：sequential / parallel / hierarchical / peer_to_peer / swarm，包含效率系数与协同指标目标[[🧩 bmad /bmad-core/config/optimized-bmad-config-v5.3.json:61]]。
- **任务路由规则**：按正则匹配业务、技术、市场、AI、风险五大场景，指定主辅 Agent 与协作模式[[🧩 bmad /bmad-core/config/optimized-bmad-config-v5.3.json:167]]。
- **落地策略**：在 v6 中落库为 `agents/agent-registry.js`、`collaboration/planner.js`、`collaboration/executor.js` 与 `config/converter.js`，供 Fusion Core 初始化。

## 3. 配置与工具需求

| 项目 | v5.4 来源 | v6 预期 |
| --- | --- | --- |
| Update-Safe Manifest | v6 `_cfg` 已存在空框架[[BMAD-METHOD-main-6/bmad/_cfg/manifest.yaml:1]] | 迁移工具写入 agents/workflows/search/collaboration 配置 |
| Subagent 定义 | `🧩 bmad /bmad-core/config/optimized-bmad-config-v5.3.json:18` | 拆分为 `_cfg/agents/*.json` |
| 协作指标基线 | `synergy_metrics` 配置[[🧩 bmad /bmad-core/config/optimized-bmad-config-v5.3.json:97]] | 映射到 Performance Monitor 阈值 |
| MCP 连接 | `mcp_servers` 节[[🧩 bmad /bmad-core/config/optimized-bmad-config-v5.3.json:212]] | 生成 v6 `config/mcp/*.json` + 环境变量说明 |

## 4. 待确认点

1. `BMAD-METHOD-main-6/src` 为空，需要确认是否采纳 TypeScript（官方文档倾向 TS）。
2. `🧩 bmad` 当前使用 CommonJS；若切换 TS 需制定编译/打包策略。
3. MCP 付费服务（Tavily/Firecrawl）启用情况；若受限需提供开关或降级路径。
4. Performance Monitor 在 v5.4 中以日志输出为主，需要确定 v6 的指标持久化方式（文件/事件/CLI）。

---

> 下一步：基于该映射，设计 v6 Fusion 目标架构并梳理实现目录。
