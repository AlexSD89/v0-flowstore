---
title: "小红书 Gate AI 运营系统 · 运营 Spec 总体设计"
owners:
  - LaunchX Tech Core
status: active
last_update: "2025-11-21"
related:
  - "../../README.md"
  - "../../ARCHITECTURE.md"
  - "../../../xiaohongshu_ai_automation_v1/clients/launch-x/README.md"
  - "../../../xiaohongshu_ai_automation_v1/docs/Dynamic_Spec_Iteration_Plan.md"
  - "../../../xiaohongshu_ai_automation_v1/clients/launch-x/strategy/SEO_LaunchX_Brand_Integration_Strategy_2025-09-25.md"
  - "../../../xiaohongshu_ai_automation_v1/clients/launch-x/strategy/launch-x_brand_constitution.md"
source: "V1 小红书自动化系统 + LaunchX Client 案例 + 本轮对话设计整合"
impact: "为 Claude/Gate OS 提供统一的运营视角 Spec 入口，使每个 Client 可作为 SDK 被加载和自动化运营"
---

# 小红书 Gate AI 运营系统 · 运营 Spec 总体设计

> 视角说明：本文件站在 **Claude / Gate OS** 的视角，把「小红书运营」看成一个可以加载的 SDK。  
> 每个 Client（如 `launch-x`）都被设计为一个 SDK：包含业务目标、品牌约束、内容范式、自动化入口和学习机制。

## 1. 系统定位与业务目标

### 1.1 总体定位

- **平台层**：`💻 技术开发/04_成熟项目 ✅/xiaohongshu-gate-ai运营-v4/`  
  - 提供 V1/V3 三层架构（CC 原生 / Gate OS 调度 / 客户 MD 驱动），见 `ARCHITECTURE.md`。
- **自动化内核**：`💻 技术开发/04_成熟项目 ✅/xiaohongshu_ai_automation_v1/`  
  - 提供 Agent OS v4.0、自动化脚本、动态 Spec 迭代和 Client 目录结构。
- **工具生态**：`🧰 tools/` 下的现有工具工程  
  - 如 `xiaohongshu-mcp`（发布与数据采集）、`weibo-public-opinion-analysis-system`（舆情架构参考）、`obsidian-content-distributor`（内容分发）、`launchx-spec-kit-cli`（5 步认知 + Spec-Kit）。

### 1.2 运营系统要解决的问题

1. **客户诉求颗粒度粗**：
   - 输入常常只有一句话（如「想做汽车类小红书运营」），需要通过 Spec-Kit + MCP/BMAD 扩展成完整的业务 Spec。
2. **执行颗粒度不稳定**：
   - V1 中已有 Agent OS 和自动化脚本，但在「每一篇内容」「每一周计划」层面，
     标题范式、图片结构、标签策略、实验设定仍然靠人记忆，不够结构化。
3. **最佳范式难沉淀**：
   - 已有文档如 `SEO_LaunchX_Brand_Integration_Strategy_2025-09-25.md` 定义了标签体系，
     但没有「Pattern Library + Experiment Log」层，难以跨季度、跨行业复用。
4. **智能行为未绑定到 Spec**：
   - 有 `learn_from_trending.py`、`Dynamic_Spec_Iteration_Plan.md` 等学习/迭代组件，
     但结果没有强制写入 Post 级别的 Spec 和 Weekly Plan 中，Claude 难以在执行前调用它们。

### 1.3 目标

- 把「小红书运营」从**一堆脚本 + 零散文档**，升级成：
  1. 每个 Client 都是一个可加载的 SDK（Client-as-SDK）；
  2. 每篇内容在生成前都有明确的 `Post Spec`（标题范式、结构范式、趋势依据、标签组合）；
  3. 每周/每月计划明确引用 trending 学习结果和质量日志；
  4. 所有「最佳范式」「方法论」在一个 Evolution 层沉淀，可跨项目复用；
  5. 文档结构对 Claude / Gate OS 友好，方便通过 Skills/Hooks/MCP 自动调用。

---

## 2. 文档架构总览（运营视角）

> 本节定义 **运营 Spec 视角** 的文档分层，用于约束后续所有 Client/行业的结构。

### 2.1 四层文档分层

1. **项目级架构（已有）**  
   - `README.md`、`ARCHITECTURE.md`、`dev-docs/v1-*`、`xiaohongshu-vertical-design/`  
   - 描述三层架构、V1/V3 哲学、垂直种草生态与技术架构。

2. **数据系统 & Agent 设计（Data Pipeline 层）**  
   - 规划文档目录：`dev-docs/xiaohongshu-data-pipeline/`（后续补充）  
   - 内容：
     - 数据源与采集策略（小红书话题、账号、评论、行业资讯等）；
     - Agent 与工具映射（哪些任务用 `xiaohongshu-mcp`，哪些参考 Weibo 舆情系统架构）；
     - 数据落盘路径 & 生命周期（`clients/<slug>/data/intel|learning|quality_logs` 等）。

3. **运营 Spec 系统（本目录）**  
   - 目录：`dev-docs/xiaohongshu-ops-spec/`  
   - 内容：
     - 行业 / 垂直级 Spec（如「汽车 AI 工具评测」）；
     - Client SDK Spec（如 `client-sdk-launchx.md`）；
     - 单篇内容模板 `post-template.md`（Post Spec）；
     - Pattern Library（标题/结构/标签等范式定义）。

4. **演化系统 & 范式库（Evolution 层）**  
   - 规划目录：`dev-docs/xiaohongshu-evolution-system/`（后续补充）  
   - 内容：
     - 方法论索引（大/中/小三层方法论）；
     - Pattern Library 的抽象设计与版本管理；
     - 季度级实验总结与认知快照；
     - 与 `🛠️ 系统管理/memory-bank` 的互链策略。

本文件主要负责第 3 层的总体设计，并串联第 2 层和第 4 层的接口约定。

---

## 3. Client-as-SDK 设计

> 每个 `clients/<slug>` 目录视为一个 SDK，对 Claude / Gate OS 暴露统一接口。  
> LaunchX 自己的评测平台客户 `launch-x` 是首个完整样板。

### 3.1 Client SDK 接口分层

对每个 Client，我们统一抽象四类接口（文档 + 脚本的组合）：

1. **Describe API（认知接口）**  
   告诉 Claude：这个 Client 是谁、做什么、生存在哪个领域。
   - 典型来源：
     - 项目 Spec：`launch-x_project_spec.md`
       - `💻 技术开发/04_成熟项目 ✅/xiaohongshu_ai_automation_v1/clients/launch-x/strategy/launch-x_project_spec.md:1`
     - 品牌宪章：`launch-x_brand_constitution.md`
       - `.../clients/launch-x/strategy/launch-x_brand_constitution.md:1`

2. **Plan API（策略与计划接口）**  
   告诉 Claude：如何形成周/月内容策略与实验矩阵。
   - 典型来源：
     - 运营策略：`LaunchX_AI评测平台运营策略_*.md`
     - Weekly Plan：`LaunchX_Weekly_Content_Plan_Data_Record_2025-09-24.md`
     - 标签/SEO 策略：`SEO_LaunchX_Brand_Integration_Strategy_2025-09-25.md`

3. **Run API（执行接口）**  
   告诉 Claude：具体怎么跑自动化。
   - 典型来源：
     - 实施计划：`launch-x_implementation_plan.md`
     - Run Checklist：`launch-x_run_checklist.md`
     - 执行入口脚本：`python automation/run_client.py --client <slug>`

4. **Evolve API（学习与演化接口）**  
   告诉 Claude：如何从数据中学习并更新 Spec/模板。
   - 典型来源：
     - Trending 学习脚本：`automation/learn_from_trending.py`
     - 动态 Spec 迭代方案：`docs/Dynamic_Spec_Iteration_Plan.md`
       - `💻 技术开发/04_成熟项目 ✅/xiaohongshu_ai_automation_v1/docs/Dynamic_Spec_Iteration_Plan.md:1`
     - 反馈更新脚本：`automation/update_spec_from_feedback.py`
     - Auto Iteration 报告：`clients/<slug>/reports/Auto_Iteration_Report_*.md`

### 3.2 LaunchX 客户 SDK 说明（预告）

为避免本文件过长，LaunchX 客户的详细 SDK 定义放在：

- `dev-docs/xiaohongshu-ops-spec/client-sdk-launchx.md`（由本轮设计创建）  
  - 描述 LaunchX Client 的具体 Describe/Plan/Run/Evolve 映射；
  - 指定哪些文档是 Claude 加载时的「必读入口」。

---

## 4. Post Spec 与执行颗粒度设计

> 目标：让「每一篇小红书笔记」都以结构化 Spec 存在，
> 在生成内容前，Claude 必须先填/读取 Spec，而不是直接 prompt 生成。

### 4.1 单篇内容 Spec（post-template）

模板文件：`dev-docs/xiaohongshu-ops-spec/post-template.md`（由本轮设计创建）。

核心字段（摘要）：

- 基本信息：
  - client_slug、目标账号、计划发布时间；
  - 对应的运营目标（引用 Client Spec 中的目标 ID）。
- 标题设计：
  - 至少 3 个候选标题；
  - 标题范式引用：如 `P-Title-02 数字清单`；
  - 字数 & 必须/禁止词约束。
- 封面与图片：
  - 封面类型（人物/产品/场景/信息型）；
  - 内页图片数量与每张图的内容说明。
- 正文结构：
  - 开头 Hook（为谁、解决什么）；
  - 主体 3–5 段，每段目的明确（场景/冲突/解决/步骤/结果）；
  - 结尾 CTA（收藏/评论/私信等）。
- 标签策略（Tag Engine）：
  - tag_mode：保守型 / 平衡型 / 进攻型；
  - brand_tags / function_tags / hot_tags / long_tail_tags；
  - 来源：SEO 策略文档，如 `SEO_LaunchX_Brand_Integration_Strategy_2025-09-25.md`。
- 实验设定：
  - 实验编号、实验类型（标题 A/B / 封面 A/B / 结构实验 / CTA 实验）；
  - 假设与目标指标（比如收藏率、评论数、私信线索等）。
- 范式与趋势绑定：
  - 标题/结构范式 ID（Pattern Library 中的编号）；
  - trending_snapshot_id（如 `trending_learning_20251009_212454.json`）；
  - 简要说明「本篇选题/结构/标签与趋势数据的关系」。

### 4.2 执行前置约束

在新的执行规范中，任何自动化发布流程（无论是 `run_client.py` 还是 Claude Hook）都应满足：

1. 对应笔记有一份完整的 `Post Spec`（非空字段校验通过）。
2. `Post Spec` 中的 Pattern 与 Tag Engine 字段已经对齐 Client Spec：
   - 标题/结构范式来自 Pattern Library；
   - 标签模式来自 SEO 策略文档；
   - 趋势引用来自最近一次 trending 学习结果。
3. 执行脚本在日志中记录所用的 Pattern ID / Tag Mode / trending 快照 ID，便于后续在 Evolution 层回放和对比。

---

## 5. 工具与架构选型（运营视角）

> 这里从「实现某个运营目标」的角度，说明用什么架构、什么产品、什么工具。

### 5.1 Claude / Gate OS 作为操作系统

- Claude（含 BMAD、Skills、MCP 调度）是整个系统的「操作程序」。
- Gate OS（在 `🧠 Launch-X Skills生态系统` 与 `🧩 bmad` 中定义）提供三层能力：
  - Code OS / MCP 层：连接工具与外部系统；
  - 调度层：组合 Skills 与 Agent；
  - 业务层：运行本项目定义的 Client SDK。

### 5.2 平台与自动化内核

- V4 平台：`xiaohongshu-gate-ai运营-v4/`  
  - 封装 Agent、工具与工作流引擎；
  - 用于演示与验证 V1/V3 结合后的「单流程」能力。
- V1 自动化内核：`xiaohongshu_ai_automation_v1/`  
  - 提供 Client 目录结构、Agent OS、自动化脚本与动态 Spec 迭代；
  - `clients/launch-x` 是首个完整「Client-as-SDK」实例。

### 5.3 关键工具与产品

- **小红书 MCP**：`🧰 tools/xiaohongshu-mcp`  
  - 登录、发布、搜索、获取详情、评论等；
  - 是数据采集与内容发布的主力工具。
- **舆情分析架构参考**：`🧰 tools/weibo-public-opinion-analysis-system`  
  - 提供「爬取 → 情感分析 → 关键词统计 → 报表」的架构范式；
  - 可套用到小红书评论区舆情分析与复盘。
- **内容分发插件**：`🧰 tools/obsidian-content-distributor`  
  - 把 Obsidian 笔记转换为小红书/即刻/X/公众号多平台文案；
  - 可作为 Post Spec → 实际文案的一个实现路径。
- **Spec-Kit CLI 集成**：`🧰 tools/launchx-spec-kit-cli`  
  - 实现 Collect/Model/Compare/Align/Deliver 五步认知；
  - 可用于从「一句话 seed」生成 Client Spec 初稿。

---

## 6. 整体实施颗粒度与计划

> 本节从时间与颗粒度的视角，说明如何在后续迭代中逐步用上本设计。

### 6.1 颗粒度分层

- **季度 / 项目级**：
  - 更新项目级架构文档与方法论（Layer 0 + Evolution 层）；
  - 新增/迁移 Client SDK（如新增「汽车行业媒体号」）。
- **周级**：
  - 在 Plan API 层生成/更新 Weekly Plan（选题矩阵 + 实验矩阵）；
  - 引用最新 trending/质量日志，调整 Pattern/Tag Engine。
- **日级**：
  - 为当天每一篇内容创建/更新 Post Spec；
  - 调用 Run API 执行发布，并写回性能与日志。
- **单条内容级**：
  - 每条内容严格按照 Post Spec 中的结构与标签生成；
  - 实验配置（A/B）落在 Post Spec，而不是散在 Prompt 里。

### 6.2 近期实施计划（建议）

1. **Phase 1：LaunchX 客户 SDK 固化**
   - 编写 `client-sdk-launchx.md`（本目录内，已规划）；
   - 在其中把 V1 客户文档（Spec/宪章/SEO/Runbook）映射到 Describe/Plan/Run/Evolve 接口；
   - 补一个最小可用的 `post-template.md`，并在 LaunchX 客户目录试用。

2. **Phase 2：数据 Pipeline 与 Evolution 层落地**
   - 在 `dev-docs/xiaohongshu-data-pipeline/` 中整理数据源与 Agent-Tools 映射；
   - 在 `dev-docs/xiaohongshu-evolution-system/` 中定义 Pattern Library 结构，
     并与 `clients/launch-x/data/learning` / `reports/Auto_Iteration_Report_*` 互链。

3. **Phase 3：多 Client / 多行业复制**
   - 以 LaunchX 客户 SDK 为蓝本，为下一个垂直（如「汽车 AI 媒体号」）创建新的 Client SDK 文档与目录；
   - 将通用部分（方法论/范式库）抽到 Evolution 层，对不同行业进行参数化。

---

## 7. 后续文档与开发的关系

- 本文件定义的是**「运营视角下的文档与接口架构」**，后续开发与自动化行为应遵循：
  - 任意新代码/脚本若承担新的职责（数据源、Agent、Spec 迭代逻辑），
    需在对应层的设计文档中登记（Data Pipeline / Ops Spec / Evolution）；
  - 新增 Client 时，先补 Client SDK 文档，再允许自动化执行；
  - Claude 侧的 Hook/Skill 设计，应以本目录中的 Spec 为输入/输出契约。

- 对 Codex 来说，本文件是：
  - 在本地修改/新增代码前，确定该修改对应的「层级与接口」；
  - 更新 Dev Docs 时的参照源，避免重复创造模式化内容；
  - 为 Summary/plan/context 提供引用路径（使用 `path:line`）。

