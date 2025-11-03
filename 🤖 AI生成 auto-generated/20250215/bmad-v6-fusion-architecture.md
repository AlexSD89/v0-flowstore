---
title: "BMAD v6 Fusion 模块目标架构草图"
owners:
  - Launch X Codex Team
status: draft
last_update: 2025-02-15
related:
  - "../../specs/20250215-bmad-v6-native-fusion.md"
source: 人工设计
impact: medium
---

# BMAD v6 Fusion 模块架构（初稿）

## 1. 技术选型

- **运行时**：沿用 repo 默认 Node.js (>=20) + CommonJS；`package.json` 主入口指向 `tools/cli/bmad-cli.js`，暂无 TS 构建链[[BMAD-METHOD-main-6/package.json:1]]。
- **语言**：Fusion 模块使用 `.js`（CommonJS）并配合 JSDoc/`zod` 定义类型；如后续切换 TS，可追加编译流程。
- **配置**：继续使用 `_cfg` Update-Safe 机制，新增 JSON/CSV/ YAML 文件通过迁移脚本生成。

## 2. 目录规划

```
BMAD-METHOD-main-6/
└── src/
    └── fusion/
        ├── index.js                     # Fusion Core 对外入口
        ├── core/
        │   └── v6-fusion-core.js        # orchestrator，负责生命周期与任务执行
        ├── agents/
        │   └── agent-registry.js        # 解析 _cfg/agents/ + v5.4 映射
        ├── collaboration/
        │   ├── planner.js               # 任务与模式匹配
        │   └── executor.js              # 阶段执行、质量门控
        ├── search/
        │   └── orchestrator.js          # 5 通道搜索调度（后续接入 MCP）
        ├── monitoring/
        │   └── performance-monitor.js   # 协作/任务指标
        ├── config/
        │   ├── converter.js             # v5.4 → v6 映射
        │   ├── update-safe-manager.js   # 迁移后配置管理
        │   └── data/
        │       └── codex-subagents.json # 原生 subagent 定义
        └── tasks/
            └── native-tasks.js          # 封装 v5.4 原生任务
```

## 3. 模块职责

| 模块 | 责任 | 关键输入/输出 |
| --- | --- | --- |
| `core/v6-fusion-core.js` | 初始化组件、执行任务流程（分析→选 agent→协作→搜索→汇总） | 输入：任务描述、选项；输出：执行结果、指标 |
| `agents/agent-registry.js` | 解析 `_cfg/agents/*.json` + 运行态指标，提供 Agent 查询与负载信息 | 输入：配置、性能数据；输出：Agent 实例列表 |
| `collaboration/planner.js` | 将任务分析映射到协作模式与 Agent 组合 | 输入：任务分析、路由规则；输出：协作计划 |
| `collaboration/executor.js` | 调度模式执行（并行、层次、Peer、Swarm、顺序），并触发质量门控 | 输入：协作计划、Agent 实例；输出：阶段结果 |
| `search/orchestrator.js` | 并发调用 MCP 通道 + 本地搜索，生成聚合结果与批评建议 | 输入：查询、路由配置；输出：搜索结果、批评报告 |
| `monitoring/performance-monitor.js` | 收集协作/任务/搜索指标，与 `_cfg` 阈值比对，输出告警 | 输入：执行事件、阈值配置；输出：指标快照、告警 |
| `config/update-safe-manager.js` | 维护 `_cfg` 文件、备份与迁移；提供 schema 校验 | 输入：配置变更请求；输出：写入磁盘记录、备份 |
| `config/converter.js` | 读取 `🧩 bmad` 配置并转换为 v6 `_cfg` 结构 | 输入：v5.4 JSON/YAML；输出：v6 JSON/CSV |
| `tasks/native-tasks.js` | 将标准任务暴露给 CLI/SDK（调用协作与搜索模块） | 输入：业务参数；输出：任务结果与指标 |

> TODO：workflow 模块、搜索通道适配器、metrics store 等在后续迭代补齐；同时保留 Codex CLI / Claude Code CLI 双入口能力。

> Subagent invoker 依赖 `openai` SDK 及相关 API Key，未配置时系统会自动回退为模拟输出并提示需要凭证。

## 4. 关键接口草案

- `fusionCore.executeTask(description, options)`：主入口，返回 `{ result, metrics, collaborationPlan }`。
- `agentRegistry.findOptimalAgents(taskAnalysis)`：返回带评分的 Agent 列表。
- `collaborationPlanner.plan(taskAnalysis, candidateAgents)`：返回 `collaborationPlan`。
- `collaborationExecutor.run(plan)`：执行 plan，产出阶段性结果事件。
- `searchOrchestrator.execute(query, options)`：返回 `{ results, critic, metrics }`。
- `performanceMonitor.record(event)` / `flush()`。
- `updateSafeManager.load(type)` / `write(type, payload)`。

## 5. 数据与流程

1. **任务入口**：Fusion Core 接收任务 → 调用 `agentRegistry` 解析 `_cfg` 与指标 → 返回候选 Agent。
2. **协作计划**：`collaboration/planner` 根据任务路由和配置生成 plan，与 `monitoring` 注册指标。
3. **协作执行**：`collaboration/executor` 分阶段执行，输出事件给 `performanceMonitor`。
4. **搜索/批评**：如任务需要搜索，`search/orchestrator` 并发通道，`critic` 给出改进建议。
5. **结果汇总**：Fusion Core 综合协作、搜索、工作流、指标 → 产出最终结果。
6. **配置管理**：`config/converters/from-v54` 负责迁移数据到 `_cfg`；`update-safe-manager` 负责持久化和备份。

## 6. 打包与集成

- `src/fusion/index.js` 导出 `createFusionCore` 工厂，供 CLI、SDK 与未来模块调用。
- CLI 可在 `tools/cli/bmad-cli.js` 中新增命令：`fusion status`、`fusion migrate`、`fusion run`.
- 迁移脚本放置在 `tools/migration/`（例如 `tools/migration/migrate-v54.js`），调用 `config/converters/from-v54.js`。

## 7. TODO / 决策点

1. 是否需要在 CLI 中注入新的子命令（待与产品确认）。
2. Performance Monitor 指标存储方式（JSON 文件 / 控制台 / API）尚未定稿。
3. MCP 客户端（Tavily/Jina）在生产环境的凭证管理策略，需要配合 `.env` 或配置中心。
4. 是否需要与现有 `bmad/bmb` 模块交互（例如 Builder 模式），后续评审。

---

> 下一步：基于架构草稿，整理首批迁移 backlog（模块创建顺序、测试计划、依赖）。
