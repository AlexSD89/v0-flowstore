---
title: "BMAD v6 Fusion 首批迁移 Backlog"
owners:
  - Launch X Codex Team
status: draft
last_update: 2025-02-15
related:
  - "../../specs/20250215-bmad-v6-native-fusion.md"
  - "bmad-v6-fusion-mapping.md"
  - "bmad-v6-fusion-architecture.md"
source: 人工计划
impact: medium
---

# 首批迁移 Backlog（迭代建议）

## 1. 核心任务拆解

| 序号 | 任务 | 说明 | 依赖 | 验证 |
| --- | --- | --- | --- | --- |
| B-01 | 初始化 `src/fusion` 目录与入口 | 创建 `index.js`、`core/v6-fusion-core.js` 骨架，接入现有 CLI 配置 | 架构草稿 | `npm run lint`、自测导出（✅ 初版完成） |
| B-02 | 构建 Agent Registry | 实现 `_cfg` 解析、性能指标存储，迁移 `native_subagents` 配置[[🧩 bmad /bmad-core/config/optimized-bmad-config-v5.3.json:18]] | B-01、迁移脚本 | 单元测试（模拟配置）、schema 校验（进行中，待完善测试） |
| B-03 | 协作 Planner & Executor | 迁移并行/层次/Swarm 等模式[[🧩 bmad /bmad-core/codex/codex-native-first-bmad-system.js:130]]，建立事件回调 | B-02 | Jest 测试覆盖各模式、质量门控（骨架已落地，已接入 subagent invoker，待补测试） |
| B-04 | Search Orchestrator | 实现 5 通道 MCP 搜索与批评流程[[🧩 bmad /bmad-core/codex/codex-bmad-core-task-enhancer.js:143]]；支持通道开关 | B-02 | Mock MCP 客户端、验证聚合输出（当前默认 Mock，待接入真实 MCP） |
| B-05 | Performance Monitor | 收集协作/搜索指标，对比 `_cfg` 阈值[[🧩 bmad /bmad-core/config/optimized-bmad-config-v5.3.json:97]] | B-02、B-03、B-04 | 单元测试 + 集成测试记录指标（骨架完成） |
| B-06 | Workflow Templates & Native Tasks | 迁移任务封装[[🧩 bmad /bmad-core/codex/codex-bmad-native-tasks.js:18]]，与 Fusion Core 集成 | B-03、B-04 | 端到端集成测试 |
| B-07 | 配置迁移 CLI | `tools/migration/migrate-v54.js`：读取 `🧩 bmad` 配置，输出 `_cfg` JSON | B-02 | CLI 自测 + schema 校验 |
| B-08 | 文档与 README | 更新 `docs/fusion/README.md`、迁移指南、回滚说明 | B-01~B-07 | 文档审校、Summary 互链 |

## 2. 验证矩阵

| 测试类型 | 内容 | 触发任务 |
| --- | --- | --- |
| 单元测试 | Registry 解析、协作模式、搜索聚合、指标计算 | B-02~B-05 |
| 集成测试 | `fusionCore.executeTask` 完整流程（投资、市场、技术、风险四类场景） | B-06 |
| 性能基线 | 对比 v5.4 协同效率、质量提升、搜索时延 | B-03、B-04、B-05 |
| CLI 验证 | `bmad fusion status`、`bmad fusion migrate` 命令（若新增） | B-07 |
| 文档检查 | README frontmatter、互链、缺口标注 | B-08 |

## 3. 依赖与协同

- **配置获取**：需访问 `🧩 bmad /bmad-core/config`、`codex-subagents.json`，确保版本一致。
- **MCP 凭证**：Tavily / Jina / GitHub / Filesystem / git-mcp；若环境不可用，需 Mock 客户端。
- **工具链**：项目已提供 `eslint`、`jest`、`prettier`，需在实现中补充测试脚本。
- **依赖说明**：为兼容 Codex / Claude Code CLI，已默认允许通过 `createFusionCore` 注入自定义 invoker；若使用内置 invoker，请确保 `openai` 已安装并配置 API Key。
- **知识同步**：完成后更新 `memory-bank` 与根级 README / 指挥文档。

## 4. 迭代节奏建议

1. **迭代 1**：B-01 ~ B-03（框架与协作核心）。
2. **迭代 2**：B-04 ~ B-05（搜索 + 监控）。
3. **迭代 3**：B-06 ~ B-07（任务封装 + 配置迁移）。
4. **迭代 4**：B-08 + 性能验证与文档收尾。

---

> Backlog 将随实现进度更新；若引入新增依赖或跨域风险，需要在 `/plan` 后续迭代中补充。
