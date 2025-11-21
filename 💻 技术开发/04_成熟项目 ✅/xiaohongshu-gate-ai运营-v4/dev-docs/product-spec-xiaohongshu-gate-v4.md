---
title: "小红书 Gate AI 运营系统 v4 · 产品/开发 PRD"
owners:
  - LaunchX Tech Core
status: draft
last_update: "2025-11-21"
related:
  - "../ARCHITECTURE.md"
  - "./README.md"
  - "./plan.md"
  - "./gate-os/00-总体架构.md"
  - "./gate-os/01-模块与接口设计.md"
  - "./sdk/xiaohongshu-project-sdk.md"
  - "./xiaohongshu-ops-spec/README.md"
  - "./xiaohongshu-data-pipeline/plan.md"
  - "./xiaohongshu-evolution-system/README.md"
  - "../../xiaohongshu-ai运营-v3/v4.0-claude-code-fusion/README-LaunchX-v4.0.md"
  - "../../../🧰 tools/launchx-spec-kit-cli/README.md"
source: "v4 总纲 + 现有 dev-docs 结构 + 历史对话中对 Gate OS / SDK / Spec Kit 的要求"
impact: "将架构/文档/代码/测试/Spec Kit 集成要求汇总成一份可执行 PRD，作为后续实现与验证的唯一参考"
---

# 小红书 Gate AI 运营系统 v4 · 产品/开发 PRD

> 目标：本文件作为小红书 Gate AI 运营系统 v4 的**唯一产品/开发 PRD**，
> 对“要实现什么代码、放在哪个目录、如何和 Gate OS / SDK / Spec / 工作流 / Spec Kit 配合”给出结构化要求。

## 1. 产品定位与成功标准（简要）

- **产品定位**：
  - 以 Gate OS 为内核、CC 为底层、XHS Project SDK 为实现层的“小红书运营操作系统”；
  - 让客户只需通过 MD/Spec（Client SDK + Post Spec + Weekly Plan）表达意图，系统自动完成：
    - 搜索与对标（Collect）；
    - 模型与范式选择（Model/Compare）；
    - 运营结构对齐（Align）；
    - 生成内容与发布、回写与学习（Deliver）。

- **成功标准（抽象）**：
  - 结构层：代码/文档/目录结构与本 PRD 一致；
  - 行为层：给定一个合规的 Post Spec，系统能自动生成并发布小红书内容，并把结果写回 Spec 和数据层；
  - 学习层：实验和数据能持续沉淀为 Pattern / 方法论，形成演化闭环。

## 2. 代码架构要求

> 本节不要求一次性把所有代码写完，而是规定**目录结构与模块职责**，作为后续实现的蓝图。

### 2.1 顶层代码目录（src/）

现有：

- `src/agents/`
- `src/core/`
- `src/tools/`

在此基础上，约定 Gate OS / SDK 相关模块的预期位置：

- `src/gate_os/`
  - `agent_runtime.py`：Gate OS AgentRuntime 实现骨架
  - `skills_engine.py`：SkillsEngine 实现骨架
  - `evidence_ledger.py`：证据账本实现骨架（可参考现有 `tools/evidence_ledger_v3.py`）
  - `autonomy_manager.py`：LOAManager 实现骨架（可参考现有 `agents/autonomy_management_v3.py`）
  - `workflow_orchestrator.py`：WorkflowOrchestrator 实现骨架（可参考现有 `core/workflow_engine.py`）

- `src/sdk/xiaohongshu/`
  - `__init__.py`
  - `project_sdk.py`：实现 `XiaohongshuProjectSDK` 抽象接口（见 `dev-docs/sdk/xiaohongshu-project-sdk.md`）
  - `content_spec_service.py`：实现 ContentSpecService（读取/写入 Post Spec、Weekly Plan、Client SDK）
  - `data_pipeline_service.py`：实现 XHSDataPipelineService（调用数据采集与分析 Agent）
  - `evolution_service.py`：实现 EvolutionService（读写 Experiment Log 与 Pattern）
  - `client_config_service.py`：实现 ClientConfigService（加载不同 client 的配置）

> 注意：本 PRD **只要求未来代码按此结构实现**，当前不强制立即创建所有文件。

### 2.2 模块职责与现有代码映射

- `src/core/workflow_engine.py`
  - 未来可逐步演进为 Gate OS 的 WorkflowOrchestrator 内核实现；
  - 在实现前，应先在 `gate-os/01-模块与接口设计.md` 中更新接口定义。

- `src/tools/data_collector_v1.py` / `src/tools/evidence_ledger_v3.py`
  - 可分别作为 XHSDataPipelineService 和 EvidenceLedger 的底层实现参考；
  - 在新结构下，推荐通过 `gate_os` / `sdk` 层封装后再被调用。

- `src/agents/autonomy_management_v3.py`
  - 对应 LOAManager 的早期实现；
  - 将来在 `src/gate_os/autonomy_manager.py` 中包装成为 Gate OS 内核的一部分。

## 3. SDK & Spec 结构要求

### 3.1 Project SDK（XHS 项目级）

- 设计文档：
  - `dev-docs/sdk/xiaohongshu-project-sdk.md`

- 必须实现的抽象接口（见设计文档中定义）：
  - `load_client(client_slug)`
  - `build_content_intent(post_spec_path)`
  - `build_weekly_plan_intent(weekly_plan_path)`
  - `summarize_experiment(experiment_id)`

- 代码应按以下方式组织：
  - `project_sdk.py`：聚合接口，Gate OS 只通过这一层交互；
  - `content_spec_service.py`：解析/生成 Post Spec & Weekly Plan；
  - `data_pipeline_service.py`：与 `xiaohongshu-data-pipeline` 文档对应；
  - `evolution_service.py`：与 `xiaohongshu-evolution-system` 文档对应；
  - `client_config_service.py`：加载 `client-sdk-*.md` 与 V1 客户数据。

### 3.2 Client SDK（每个 client 一份）

- 设计文档示例：
  - `dev-docs/xiaohongshu-ops-spec/client-sdk-launchx.md`

- 要求所有 client SDK 文档遵循统一模板（后续可在 G-4 中补一份 `client-sdk-template.md`）：
  - 基本信息：品牌/账号/目标人群/KPI；
  - 内容任务类型（C1–C4）及比例建议；
  - Search Spec：对标对象、搜索渠道、时间窗口、评估标准；
  - Tag Engine：四层标签体系（品牌/功能/热门/长尾）与组合模式；
  - 风格约束与禁止项。

### 3.3 Spec 模板与实例

- Post Spec 模板：
  - `dev-docs/xiaohongshu-ops-spec/post-template.md` 为唯一模板；
  - 所有 `post-*.md` 必须以此模板为基础生成，包含：
    - client_slug、内容任务类型 C1–C4、Pattern ID、trending_snapshot_id、Tag Engine 字段；
    - 文本草稿 + 最终版本 + 实验设定 + 发布信息。

- Post Spec 实例（例如 Gate 场景日记）：
  - 现有示例：`post-2025-11-22-gate-finance-diary-02.md`；
  - 未来新增时，命名规范：
    - `post-YYYYMMDD-<slug>.md`，slug 建议包含系列名 + 场景关键词。

## 4. 工作流（Workflow）要求

### 4.1 典型工作流：生成并发布一篇 Gate 场景日记

1. **输入**
   - 人类或上游系统创建/调整一个符合模板的 Post Spec 文件；
   - 例如：`post-2025-11-22-gate-finance-diary-02.md`。

2. **Project SDK 层**
   - 调用 `XiaohongshuProjectSDK.build_content_intent(post_spec_path)`：
     - 解析 Post Spec；
     - 结合 Client SDK（LaunchX）信息；
     - 生成 Intent Package。

3. **Gate OS 层**
   - WorkflowOrchestrator 接收 Intent Package，依次调用：
     - Collect：搜索最佳范式 + 读取历史表现（数据管道）；
     - Model/Compare：匹配 Pattern / 对标 n8n 等外部案例；
     - Align：根据 Client SDK / 品牌宪章作调整；
     - Deliver：调用 SkillsEngine 生成内容草稿，并通过 `xiaohongshu-mcp` 发布。

4. **结果回写**
   - Post Spec：补充 note_id / note_url / 发布时间；
   - 数据目录：写入 publish_log / performance 数据；
   - Evolution：记录一次实验条目。

### 4.2 其他工作流（略，按 Plan 中 Phase A/B/C 逐步补完）

## 5. Spec Kit（launchx-spec-kit-cli）集成要求

> Spec Kit 负责“从一句话诉求 → 结构化 Spec 文档”，Gate OS/SDK 负责“从 Spec → 执行与演化”。

- 工具位置：
  - `🧰 tools/launchx-spec-kit-cli/`

- 使用场景：
  - 初始化新的 Project/Client SDK 文档：
    - 根据客户的一句话需求，生成 `client-sdk-*.md` 草稿；
  - 初始化新的 Post Spec：
    - 根据“系列 + 场景简述”生成 `post-*.md` 草稿；
  - 初始化新的 Experiment Log 条目：
    - 根据测试计划生成实验条目的骨架。

- 集成要求：
  - 在 Gate OS/Project SDK 层，不直接写死 Spec Kit 的逻辑；
  - 在 dev-docs 中通过 Plan/Checklist 规定：
    - 什么时候用 Spec Kit 生成文档；
    - 生成后由谁（人/AI）确认再进入正式文档树。

## 6. 测试与验收计划（高层）

> 不要求立刻写完所有测试代码，但要求后续测试按本节定义的层级与目标来设计。

### 6.1 单元测试层

- Gate OS 内核：
  - 目标：
    - AgentRuntime/SkillsEngine/Evidence&LOA/WorkflowOrchestrator 接口行为稳定；
  - 建议路径：
    - `tests/gate_os/test_agent_runtime.py`
    - `tests/gate_os/test_skills_engine.py`
    - `tests/gate_os/test_evidence_loa.py`

- Project SDK（xiaohongshu）：
  - 目标：
    - `build_content_intent` / `load_client` 等函数能在不依赖网络的情况下正确解析 Spec 与配置；
  - 建议路径：
    - `tests/sdk/xiaohongshu/test_project_sdk.py`

### 6.2 集成测试层

- 工作流集成测试：
  - 目标：
    - 给定一个 Post Spec，整个“生成 → 发布 → 回写”链路能跑通（允许使用测试账号或 stub）；
  - 建议路径：
    - `tests/integration/test_xhs_publish_workflow.py`

- 数据管道测试：
  - 目标：
    - Agent 采集的数据能正确落盘并被 Evolution 层读取；
  - 建议路径：
    - `tests/integration/test_data_pipeline.py`

### 6.3 验收标准

- **最低可用版本（MVP）** 验收：
  - 至少有一个 Client（LaunchX），完成以下闭环：
    1. 用 Spec Kit + 手工整理生成 Client SDK 与 1 条 Post Spec；
    2. Gate OS + XHS Project SDK 支持从该 Spec 生成内容草稿；
    3. 通过 MCP 发布到小红书测试账号；
    4. 将发布结果写回 Spec 与数据目录；
    5. 在 Experiment Log 中增加一条实验记录。

- **可复制版本** 验收：
  - 新增一个 Client 时，只需：
    - 复制 Client SDK 模板并填写；
    - 配置少量数据源/Agent；
    - 不改 Gate OS 内核、不改主流程代码，就能完成同样闭环。

---

> 本 PRD 与 `dev-docs/plan.md` 配合使用：
> - `plan.md` 管“阶段/编号/状态”；
> - 本文件管“具体要写哪些代码模块/Tests/工作流与 Spec Kit 约束”。
> 之后的实现与变更，应统一从这两份文件出发，保证不同终端/不同开发者拿到的永远是一致的系统蓝图。

