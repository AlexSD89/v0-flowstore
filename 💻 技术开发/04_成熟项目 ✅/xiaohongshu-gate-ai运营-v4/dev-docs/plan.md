---
title: "小红书 Gate AI 运营系统 · 开发总体计划与文档映射"
owners:
  - LaunchX Tech Core
status: active
last_update: "2025-11-21"
related:
  - "../ARCHITECTURE.md"
  - "./README.md"
  - "./xiaohongshu-ops-spec/README.md"
  - "./xiaohongshu-data-pipeline/plan.md"
  - "./xiaohongshu-evolution-system/README.md"
  - "../../xiaohongshu-ai运营-v3/v4.0-claude-code-fusion/README-LaunchX-v4.0.md"
source: "v4 总纲 + 历史对话需求 + 现有 dev-docs 结构"
impact: "把从架构目标到具体文档/数据设计的关系讲清楚，作为 Codex/Claude 的统一 plan 入口和回测检查锚点"
---

# 小红书 Gate AI 运营系统 · 开发总体计划与文档映射

> 定位：本文件不是“另起一套设计”，而是把你已经定下的架构/哲学/细节，
> 和当前 `dev-docs/` 里的所有设计文档串成一条线，给 Codex/Claude 一个统一的 plan 与状态锚点。

## 1. 统一认知框架：三层 + 三步 + 五步

### 1.1 三层结构（底层 / 中间层 / SDK 实现层）

- **Layer 1 · CC / Claude Code（底层操作系统）**
  - 角色：
    - 5 步认知法（Collect → Model → Compare → Align → Deliver）执行器；
    - Dev Docs / Hooks / Skills / MCP 能力的原生宿主；
  - 文档锚点：
    - `xiaohongshu-ai运营-v3/v4.0-claude-code-fusion/README-LaunchX-v4.0.md`

- **Layer 2 · Gate OS（中间调度层）**
  - 角色：
    - 在 CC 之上，负责 Agent 生命周期管理、Skills 编排、证据驱动决策；
    - 理解「客户 MD / Spec」→ 调度 CC 能力 → 回写结果；
  - 文档锚点：
    - `ARCHITECTURE.md` 中的整体架构
    - v4 总纲中关于 Gate OS 的章节

- **Layer 3 · SDK / Project 层（具体运营系统实例）**
  - 角色：
    - 像 `xiaohongshu-gate-ai运营-v4` 这样的项目；
    - 把某一领域（小红书运营）封装成 Gate OS 可加载的 SDK：
      - Project SDK：项目级能力说明（见 `dev-docs/sdk/xiaohongshu-project-sdk.md`）；
      - 客户/行业 Spec；
      - 数据与 Agent 设计；
      - 演化与范式库；
  - 文档锚点：
    - 本目录 `dev-docs/`（`gate-os/` + `sdk/` + XHS 四个领域模块）。

### 1.2 三步策略（Design → Plan → Run）

结合你在对话里多次提到的“三步法”（设计 / 计划 / 实践），我们约定：

1. **Design（设计）**
   - 定义目标、架构、玩法哲学；
   - 文档：
     - v4 总纲 `README-LaunchX-v4.0.md`
     - `dev-docs/xiaohongshu-vertical-design/`（垂直生态设计哲学）
     - `dev-docs/xiaohongshu-ops-spec/README.md`（运营 Spec 总体设计）

2. **Plan（计划）**
   - 把设计拆成阶段、任务、入口文档；
   - 文档：
     - 本文件：`dev-docs/plan.md`（总计划与映射）
     - `dev-docs/xiaohongshu-data-pipeline/plan.md` + `tasks.md`
     - Weekly 内容计划模板：`xiaohongshu-ops-spec/LaunchX_Weekly_Content_Plan_Template.md`

3. **Run（实践 / 执行）**
   - 调用 Gate OS / MCP / 代码，按照 Spec 与 Plan 执行；
   - 文档 & 数据：
     - V1 自动化代码与日志：`xiaohongshu_ai_automation_v1/...`
     - 发布工作流设计：`xiaohongshu-data-pipeline/03-发布工作流设计.md`
     - 实际 Post Spec（如 Gate 场景日记 02 财务月底）：`xiaohongshu-ops-spec/post-*.md`
     - 实验日志：`xiaohongshu-evolution-system/experiment-log-*.md`

### 1.3 五步认知（Spec-Kit / Collect-Model-Compare-Align-Deliver）

在上述三步中的每一次“认真动脑筋”的环节，默认都走 5 步认知：

- Collect：外部搜索 + 本地资产（V1 客户文档、tools、对话历史）；
- Model：在 Spec / Pattern / Data Pipeline 中形成结构化模型；
- Compare：对标 n8n / 竞品 / 市场最佳范式；
- Align：与 Gate OS 角色、LaunchX 品牌、业务目标对齐；
- Deliver：落到具体文件（Post Spec、Plan、实验设计）和代码执行入口。

这一点已经分散落在：

- Search Spec：`xiaohongshu-ops-spec/client-sdk-launchx.md` 中的 Search 章节；
- Pattern Library：`xiaohongshu-ops-spec/pattern-library.md`；
- Data Pipeline & Evolution 文档中。

本文件的作用，是把这些分散的设计，统一挂到一个 Plan 视角下。

## 2. 文档模块 ↔ 职责映射

> 你可以把这一节当成“从宏观到微观，哪一块文档负责哪件事”的索引。

### 2.1 Gate OS 内核层：`gate-os/`

- `gate-os/00-总体架构.md`
  - 定义 Gate OS 在 CC 之上的角色：AgentRuntime / SkillsEngine / Evidence&LOA / WorkflowOrchestrator；
  - 说明它如何连接 Project/Client SDK 与 CC。

- `gate-os/01-模块与接口设计.md`
  - 为 Gate OS 提供模块级接口约定：
    - 抽象类与方法签名（design-level），用于指导未来代码实现；
    - 明确预期代码路径（如 `src/gate_os/agent_runtime.py` 等）。

### 2.2 Project SDK 层：`sdk/`

- `sdk/xiaohongshu-project-sdk.md`
  - 从 Gate OS 视角看小红书运营 Project SDK：
    - ContentSpecService / XHSDataPipelineService / EvolutionService / ClientConfigService；
  - 定义 SDK→Gate OS 的接口（如 `build_content_intent`、`load_client`）。

### 2.3 运营 Spec 层：`xiaohongshu-ops-spec/`

- `README.md`
  - 运营视角总设计：
    - 定义 4 层文档分层（项目级 / Data Pipeline / Ops Spec / Evolution）；
    - 把「Client-as-SDK」思路写清楚（每个客户都是可加载 SDK）。

- `client-sdk-launchx.md`
  - LaunchX 客户级 SDK：
    - 品牌宪章 / KPI / 内容任务类型 C1–C4；
    - Search Spec：每次策划新场景前如何对标 n8n/竞品。

- `post-template.md`
  - 单篇 Post Spec 模板：
    - 标题/正文/图片/标签/实验设定；
    - 内容任务类型（C1–C4）+ Pattern + trending_snapshot_id + Tag Engine 字段；
    - 为执行和发布提供 **唯一输入格式**。

- `post-*.md`
  - 具体内容实例（例如 Gate 场景日记 02 财务月底结账）：
    - 包含完整的 Spec + 你认可的最终标题与正文；
    - 预留“实际发布信息”和表现数据字段，供 Run 阶段回写。

- `LaunchX_Weekly_Content_Plan_Template.md`
  - 周级计划模板：
    - 把 C1/C2/C3/C4 分布、实验矩阵、数据引用（trending/quality_logs）写成一页纸；
    - 对应三步中的 Plan 层。

### 2.4 数据 & Agent 层：`xiaohongshu-data-pipeline/`

- `context.md`
  - 为什么要有单独的数据系统：
    - 复用 V1 的 clients/<slug>/data 结构；
    - 避免“工具调一堆、数据没标准”的割裂。

- `plan.md` + `tasks.md`
  - Data Pipeline 的开发计划与 Checklist：
    - Phase 1：资产梳理 + 工具挂接（当前主要工作）；
    - Phase 2：标准化数据管道，支撑多个 Client；
    - Phase 3：与演化层联动。

- `00-数据源与采集策略.md`
  - 列出小红书相关的数据源与采集策略（话题、账号、评论、行业资讯等）。

- `01-Agent与工具架构设计.md`
  - Agent 与 tools 映射矩阵：
    - `xiaohongshu-mcp` / `weibo-public-opinion-analysis-system` / `obsidian-content-distributor` / `launchx-spec-kit-cli`；
    - 例如 `XHS_AutoHotTopicCollector`、`XHS_TrendingLearningOrchestrator` 及其输出路径。

- `02-数据留存与访问规范.md`
  - 标准目录结构与路径约定：
    - `data/raw` / `data/processed` / `data/learning` / `data/quality_logs` / `data/performance`；
    - trending 学习 / 质量日志 / Auto_Iteration_Report 等的落盘规则。

- `03-发布工作流设计.md`
  - Post Spec → `xiaohongshu-mcp` → note_id/note_url → publish_log → Experiment Log 的完整链路：
    - 明确字段映射与回写路径；
    - Codex vs Claude 职责边界。

### 2.5 演化 & 范式层：`xiaohongshu-evolution-system/`

- `README.md`
  - 演化系统的定位：
    - Pattern Library（标题/正文/CTA/Tag 等范式）；
    - Experiment Log（如 `experiment-log-LaunchX-2025Q4.md`）。

- `experiment-log-LaunchX-2025Q4.md`
  - Q4 实验日志：
    - 每个实验条目记录：Post Spec、类型 C1–C4、使用范式、数据表现、结论与后续动作；
    - 是“先抄 60 分 → 用数据找 80–90 分”的执行记录。

### 2.6 垂直生态哲学层：`xiaohongshu-vertical-design/`

- `00-小红书种草生态设计哲学.md` 等
  - 把“小红书从撰稿到复盘的六大支柱”讲清楚：
    - 智能撰稿 / 沟通协作 / AI 创作 / 发布管理 / 数据分析 / 智能复盘；
  - 为 Ops Spec / Data Pipeline / Evolution 提供长期不变的“天花板”，不直接跑项目。

## 3. 项目阶段 & 状态（可供 @ 引用）

> 下面这部分是给 Codex/Claude 和你自己用的“分段计划”。  
> 在对话或 Summary 里，可以直接 @ 某个阶段或任务 ID，判断做到哪一步、哪里还空着。

### 3.1 Phase A · LaunchX 客户作为种子项目

- **A-1 · 架构与哲学对齐** ✅（已完成）
  - v4 总纲完成：`v4.0-claude-code-fusion/README-LaunchX-v4.0.md`
  - CC / Gate OS / Project 三层关系明确：`ARCHITECTURE.md`

- **A-2 · LaunchX Client SDK 建立** ✅（完成基础版，可迭代）
  - `client-sdk-launchx.md`：品牌宪章 / KPI / 内容任务类型 / Search Spec；
  - 标签策略：引用 V1 的 `SEO_LaunchX_Brand_Integration_Strategy_2025-09-25.md`。

- **A-3 · Gate 场景日记范式 + 实例** ✅（第一批样例已完成）
  - Pattern Library 已加入 C1/C2 等内容范式；
  - Gate 场景日记 02 · 财务月底结账 Spec + 最终文案：
    - `post-2025-11-22-gate-finance-diary-02.md`。

- **A-4 · 发布工作流设计 & MCP 接口** ✅（设计已就绪，等待实际跑）
  - `03-发布工作流设计.md`：从 Post Spec 到 MCP 的字段映射与回写规则。

- **A-5 · 实际运行 + 实验记录** 🟡（尚未执行）
  - 需要：
    - 用 `xiaohongshu-mcp` 真正发布 Gate 场景日记 02；
    - 回写 note_id/note_url 到对应 Post Spec；
    - 在 `publish_log_YYYYMMDD.json` 写入记录；
    - 在 `experiment-log-LaunchX-2025Q4.md` 增加一条实验条目。

### 3.2 Phase B · 复制到第二个垂直 / 客户

- **B-1 · 选择第二个种子垂直** 🟡（待你拍板）
  - 例如：
    - 汽车行业小红书号；
    - 某条内部业务线（客服 / HR / 销售 / 运营）
  - 文档：新建 `client-sdk-<slug>.md`，复制 LaunchX 模式并调整。

- **B-2 · 复用 Data Pipeline & Evolution 模板** 🟡
  - 使用同一套 `xiaohongshu-data-pipeline/` 结构；
  - 在 Evolution 层增加新的实验日志文件。

### 3.3 Phase C · SDK 化与长期运营

- **C-1 · 把「Gate 场景日记」固化为 SDK 能力** ⚪（长期目标）
  - 为 Gate OS 定义：
    - 如何从任意 Client SDK + Pattern + Search Spec，自动生成新场景日记系列；
  - 文档：未来在 `xiaohongshu-ops-spec/` 和 Evolution 层扩展。

- **C-2 · 标准化数据清理 / 学习 / 归档流程** ⚪
  - 把 V1 的数据清理、学习、Auto_Iteration_Report 逻辑抽象成通用流程；
  - 在 Data Pipeline / Evolution 文档中补充“季度/年度”级别的数据治理规范。

### 3.4 Phase G · Gate OS / SDK 设计层

- **G-1 · Gate OS 总体架构文档** ✅（基础版已写可迭代）
  - 文档：`dev-docs/gate-os/00-总体架构.md`；
  - 状态：
    - 已定义 Gate OS 在三层结构中的角色与四大职责域；
    - 后续可根据实现演进补充细节与示例。

- **G-2 · Gate OS 模块与接口设计文档** ✅（基础版已写可迭代）
  - 文档：`dev-docs/gate-os/01-模块与接口设计.md`；
  - 状态：
    - 已给出 AgentRuntime / SkillsEngine / Evidence&LOA / WorkflowOrchestrator 抽象接口草图；
    - 后续在实际写代码前，可根据需要进一步细化参数与返回结构。

- **G-3 · 小红书 Project SDK 设计文档** ✅（基础版已写可迭代）
  - 文档：`dev-docs/sdk/xiaohongshu-project-sdk.md`；
  - 状态：
    - 已定义 Project SDK 内部模块划分与对 Gate OS 的抽象接口；
    - 后续新增其他 Project SDK 时，可按此文档为模板。

- **G-4 · Client SDK 规范整理** 🟡（部分已有，待统一）
  - 现状：
    - LaunchX 客户的 Client SDK 内容已经在 `client-sdk-launchx.md` 中存在；
  - 待办：
    - 在合适时机增加一份“Client SDK 规范说明”（可挂在 ops-spec 或 sdk 模块下），
      把不同客户的共用字段和命名规则整理成统一模板。

## 4. 使用方式（给你 & 给 AI）

- 对你来说：
  - 想问“我们做到哪一步了？”
    - 可以直接在对话里引用：
      - 「A-5 还没做，帮我把 Gate 场景日记 02 真正跑一遍」；
      - 「现在进入 B-1，选一个汽车垂直当第二个种子」；
  - 想看“某一层的详细设计”：
    - 从本文件跳到对应子目录的 README / plan / Post Spec / Experiment Log 即可。

- 对 Codex/Claude 来说：
  - Codex：
    - 每次在本地改代码/文档时，先确认这项工作属于 A/B/C 哪一段；
    - 在 Summary 里引用本文件的阶段编号和重要路径。
  - Claude / Gate OS：
    - 在执行 BMAD / MCP / 实际自动化任务时，以本文件 + 各层 plan/tasks 为“任务排布表”。

> 总结：从现在起，如果你想让整套系统“从宏观到微观”有一条清晰的线，
> 可以把 `dev-docs/plan.md` + `dev-docs/README.md` 当成总入口，其他所有设计/Spec/数据文档都是它们的子节点。
