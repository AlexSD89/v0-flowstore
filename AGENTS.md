---
title: "LaunchX 指挥总则"
owners:
  - Launch X Codex Team
status: active
last_update: 2025-10-30
related:
  - CLAUDE.md
  - 📖README-LaunchX系统总体指南.md
source: 人工采集
impact: high
---

# AGENTS.md · LaunchX 指挥总则

> 把 AI 当作“才华横溢但失忆的合作者”。通过外部记忆 + 流程 guardrails，让 Codex CLI 先复用资产，再交付新增价值。

**核心定位**：本文件规定 Codex CLI 的协作边界、执行流程与风险机制，确保所有操作与 LaunchX 全局策略一致。

---

## 导航索引
- [0. 使用前速览](#0-使用前速览)
- [1. 协作角色矩阵](#1-协作角色矩阵)
- [2. 任务分级决策树](#2-任务分级决策树)
- [3. Phase 0｜外部大脑加载](#3-phase-0外部大脑加载)
- [4. Collect → Align → Deliver](#4-collect--align--deliver)
- [5. 工具矩阵](#5-工具矩阵)
- [6. 输出与引用规范](#6-输出与引用规范)
- [7. 子目录指挥文档继承规范](#7-子目录指挥文档继承规范)
- [8. 升级、同步与安全](#8-升级同步与安全)
- [9. 任务识别与阅读路径](#9-任务识别与阅读路径)

---

## 核心原则（LLM 导航提示）
- **上下文先行**：先读根级 `CLAUDE.md` 与目标域 `USEME.md`，再决定是否生成 `/spec` / `/plan`（RULES.md:18-40）。
- **精准检索**：使用 `rg`、`fd` 搜索“最佳实践”“USEME”等关键词，优先复用已有段落，减少空写。
- **最小必要写作**：Collect/Align 未确认前禁止新建文档；缺口用“TODO｜待补充 + 缺口来源”标注（🛠️ 系统管理/⚙️内容归档规则.md:16）。
- **引用可追溯**：引用统一使用 `path:line` 或 README 小节；新增内容需同步 memory-bank 与相关 README 的互链（🛠️ 系统管理/memory-bank/README.md:5）。
- **先评测后放量**：涉及 AI 输出或关键流程时，优先复用/编写评测脚本，遵循 OpenAI `evals`“先建立评测再迭代”的理念。
- **目录策略**：参考 `📖README-LaunchX系统总体指南.md` 的“信息来源与输出颗粒度指南”，按目录规则选择信息来源与输出形态。

---

## 0. 使用前速览
- [ ] 阅读 `📖README-LaunchX系统总体指南.md`、本文件、`CLAUDE.md`、`RULES.md`、`🛠️ 系统管理/memory-bank/README.md`
- [ ] 参考 `🧭 LaunchX能力导航指南.md` 确认目标域，并加载该域 `README` / `CLAUDE` / `RULES` / `AGENTS`
- [ ] 使用 `rg "最佳实践" -g 'CLAUDE.md'`、`rg "USEME"` 等命令寻找可复用片段
- [ ] 对外输出统一使用中文，英文术语首次出现提供中文释义
- [ ] Summary 固定使用 `Summary / Testing / Next Steps` 模板
- [ ] 缺信息时标注 “TODO｜待补充 + 缺口来源”，引用使用 `path:line`

---

## 1. 协作角色矩阵
| 角色 | 关键职责 | 主要产出 |
| --- | --- | --- |
| **LaunchX Codex** | 执行实现、脚本运行、文档更新 | `/plan` 拆解、代码改动、验证日志 |
| **Claude Code** | 深度分析、方案设计、质量审查 | `/spec` 方案、风控建议、审查记录 |
| **域负责人** | 业务/知识/设计等领域的优先级、风险把关 | 需求确认、验收、跨域协调 |
| **Automation Steward** | 维护 `🧩 bmad`、MCP 配置、工具链 | 自动化脚本、使用说明、回滚策略 |
| **Memory Curator** | 维护 memory-bank、索引与互链 | 项目快照、索引更新、方法论回写 |

使命三线（运营守正 / 智能沉淀 / 自动化提效）在所有交付中保持同步，成果需在 24h 内归档并建立互链。

---

## 2. 任务分级决策树
- **Level S｜直接对话**  
  条件：问题单一、无需写文件或执行命令。  
  行动：口头确认需求 → 给出答案或轻量建议 → Summary 记录结论与风险。
- **Level M｜搜索 / MCP 驱动**  
  条件：需要查找资料、比对资产或生成方案草稿。  
  行动：  
  1. 检索本地资产（`rg` / `find`）→ 复用 `memory-bank/support_modules`。  
  2. 通过 MCP（优先 `rube`、`context7` 等）获取额外建议；若 `rube` 未就绪，记录阻塞并参考 `🛠️ 系统管理/memory-bank/Codex-Claude-配置指南.md` 申请配置。  
  3. 输出包含引用来源与复用路径的 checklist，再执行。  
  结果写入 Summary，并记录使用的工具、命令。
- **Level L｜结构化交付**  
  条件：涉及多步实现、代码修改、跨域影响或风险较高。  
  行动：  
  1. `/spec`：在 `specs/` 下描述目标、验收、引用资产、风险 / 回滚。  
  2. `/plan`：在 `plans/` 下拆解步骤 ≤3 个，保持 `update_plan` 同步，单一 `in_progress`。  
  3. `/do`：严格按计划执行，范围变化立即回到 `/plan` 或 `/spec`。  
  4. 验证 → Summary（含测试命令、日志路径）→ README / memory-bank 回写。  

遇到 Level 模糊时，默认提级处理。高风险事件（安全、合规、客户升级、预算超支）立即升级至域负责人并标注 `#需要人工介入`。

---

## 3. Phase 0｜外部大脑加载
```
[ ] 读取 `CLAUDE.md`，对齐协作规则与优先级
[ ] 阅读 `RULES.md`，明确硬性限制与禁令
[ ] 加载 `🛠️ 系统管理/memory-bank/README.md`，确认项目快照、工具、常用命令
[ ] 查看目标域 `CLAUDE.md` / `RULES.md` / `USEME.md`，明确能力与禁区
[ ] 复用检查：搜索 support_modules、🧩 bmad、🧰 tools 是否已有解决方案
[ ] 若需定位能力域，先查 `🧭 LaunchX能力导航指南.md`
[ ] 按照 [9. 任务识别与阅读路径](#9-任务识别与阅读路径) 进行关键词分类与 Level S/M/L + 🔴🟡🟢🔵 映射
[ ] 核实引用文档的 `last_update`、`layer`、`source` 是否与当前任务匹配
[ ] 在 `/spec` 或对话中列出 checklist，确认输入、依赖、验证方式
```
缺失 `USEME.md` 或关键配置时，先标注责任人与补齐计划，再进入执行。

---

## 4. 执行流程（Collect → Align → Deliver）
- **Collect**：梳理目标、约束、依赖、已尝试方案；标注缺口责任人。任何未确认信息留在对话或 `/spec`，暂不写入文档。  
- **Align**：用“目标 / 方案 / 风险 / TODO 草案”结构复述现状，输出 checklist 并确认引用、依赖、验证方式后，再进入 `/spec` 或 `/plan`。  
- **Deliver**：严格按 `/plan` 执行；使用 `apply_patch` 做最小改动；执行中保持 `update_plan` 最新，范围变化或新增风险立即回退 Align。

操作准则：
- **命令说明**：每个 shell 命令前说明目的，失败时保留输出与假设，必要时提请重试。  
- **搜索顺序**：`fd`（若不可用则 `find`）→ `rg` → `sg`，排除 `.git`、`node_modules`、`dist` 等噪音目录。  
- **复用优先**：优先调用 `memory-bank/support_modules`、`🧩 bmad` 现有脚本，禁止重复造轮子。  
- **计划粒度**：`update_plan` 最多 3 步，保持单一 `in_progress`，完成即勾选。  
- **验证优先**：所有改动必须提供最小化验证。涉及 AI 输出或关键业务逻辑时，优先复用或编写评测脚本，遵循 OpenAI `evals`“先评测再迭代”的实践。

---

## 5. 输出与引用规范
- **Summary 模板**：固定使用 `Summary / Testing / Next Steps`，未验证需说明风险与代办。  
- **最小必要写作**：Collect/Align checklist 未完成前禁止新建文件；缺信息时保持在对话或 `/spec` 中，以 “TODO｜待补充 + 缺口来源” 标注（🛠️ 系统管理/⚙️内容归档规则.md:16）。  
- **Frontmatter 完整**：所有 Markdown 必含 `title / owners / status / last_update / related / source / impact`。  
- **引用闭环**：引用现有资产或外部资料时标注 `path:line` 或 README 小节；新增互链需同步 memory-bank 与相关 README（🛠️ 系统管理/memory-bank/README.md:5）。  
- **验证记录**：在 Summary 中写明测试命令、脚本或人工检查步骤；无法验证时说明风险与补救。  
- **草稿治理**：AI 草稿统一保存在 `🤖 AI生成 auto-generated/YYYYMMDD/<slug>/`，24h 内迁移或删除并在 Summary 标注处理结果。

## 6. 工具与资源矩阵
| 工具/资产 | 用途 | 使用说明 |
| --- | --- | --- |
| **MCP：rube** | 拉取外部建议、自动化请求 | Level M/L 任务默认预留；Summary 标注命令与结果要点 |
| **MCP：context7 / tavily / jina** | 技术文档、网络资料、内容提取 | 在 `/spec` 记录来源与复用链接 |
| **🧩 bmad** | 多 Agent 自动化脚本、SOP | 运行前确认版本；结果写入 Summary 与相关 README |
| **support_modules/** | 公共 API、脚本、提示片段 | 引用时标注路径与函数；发现缺口先补齐 USEME |
| **🧰 tools** | 现成子项目或脚手架 | 阅读各自 README；使用后更新互链 |
| **通知/配置脚本** | Codex 配置、MCP 预热 | `bash scripts/mcp-prewarm.sh` 等命令执行后记录状态 |

调用任何外部或新增工具时，在 Summary 中写明名称、子路径、目的与风险。

---

## 7. 子目录指挥文档继承规范
- **强制继承**：子目录内的 `AGENTS.md` / `CLAUDE.md` 必须沿用根级语言策略、内容禁区、Summary 模板、工具记录要求与使命三线，并使用完整 frontmatter。
- **定制步骤**：依据 `🧭 LaunchX能力导航指南.md` 选择目标域后，阅读该域 `README.md` / `CLAUDE.md` / `RULES.md` / `USEME.md`，将域内角色分工、流程、质量指标写入子目录 `AGENTS.md`。
- **互链要求**：新增或更新子目录规则时，在根级本文件的相关节中登记互链，同时在目标域 README、memory-bank 索引中注明“引用于根级 AGENTS.md`path`”。
- **生成流程**：Collect 阶段确认域内资产 → Align 阶段列出继承条目与域专属补充 → Deliver 阶段产出指挥文档，并按 `🛠️ 系统管理/⚙️内容归档规则.md` 归档。

---

## 8. 升级、同步与安全
- **升级触发**：高风险事件、资源冲突、重大缺陷、跨域变更立即升级域负责人，并在 Summary 标记。  
- **变更同步**：涉及流程、工具或方法论的更新，需同步 `📖README-LaunchX系统总体指南.md`、`CLAUDE.md`、memory-bank 及相关目录 README，并在 Summary 声明“互链已更新”。  
- **安全约束**：禁止运行未确认的毁坏性命令；环境或权限异常需在 `/spec` 说明并等待批准。  
- **记录回滚**：对配置、脚本、自动化的修改必须写明回滚方法与影响范围。  

---

## 9. 任务识别与阅读路径

> 目标：确保请求到来后，系统先完成 Level / 方法论判定与资料加载，再进入 `/spec → /plan → /do`。

### 9.1 复杂度 × 方法论双分类
- **Level S｜直接对话**：单问题、策略建议；输出结论与风险提示。
- **Level M｜搜索 / MCP 驱动**：需要查阅仓库资产或外部资料；先复用本地文档，再调用 `rube`、`context7`、`tavily` 等 MCP，产出 checklist 或 `/spec` 草案。
- **Level L｜结构化执行**：涉及代码、流程、跨域影响；必须生成 `/spec`（含风险/回滚）并经 `/plan` 审核后执行。

配合 🟣 `knowledge/05_方法论中心` 的方法论层级：
- **🔴 系统级**：整体架构、核心协议、战略决策。
- **🟡 技术级**：实现细节、自动化脚本、系统集成。
- **🟢 管理级**：业务流程、运营规范、知识生产。
- **🔵 项目级**：具体项目、执行清单、操作 SOP。

### 9.2 关键词触发的阅读顺序
```
Phase 0: 任务识别
    → 阅读 📖README-LaunchX系统总体指南.md
    → 根据关键词加载优先级 0 指南
        skill / skills / 技能      → 🧠 Launch-X Skills生态系统/
        bmad / agent / 协作        → 🧩 bmad/
        knowledge / 知识 / 分析     → 🟣 knowledge/
        git / 版本 / 协作          → Git 规范 + memory-bank/support_modules/dev/USEME.md
    → 结合 Level S/M/L + 🔴🟡🟢🔵 决定执行模式
```
复合任务需并行加载多个目录指南；优先确认是否存在 `USEME.md`、`RULES.md` 或领域 `AGENTS.md`。

### 9.3 协作协议分层
| 协议层级 | 场景 | 必读资料 |
|---------|------|-----------|
| **Level 0｜模糊指令** | 需求不清晰 | 根级 `AGENTS.md` + 关键词触发指南，先完成澄清 |
| **Level 1｜精准反馈** | 明确改动/修复 | Phase 0 全部 + 目标目录 `CLAUDE.md` |
| **Level 2｜标杆确立** | 需制定质量标准 | 方法论中心模板 + 历史案例 |
| **Level 3｜规则抽象** | 升级流程/协议 | 方法论文档 + 领域 `RULES.md` |
| **Level 4｜协议内化** | 核心协议优化 | 系统级资料、架构图、回滚策略 |

执行中如需升级/降级协议层级，必须在 Summary 记录触发原因与新增引用文档。

### 9.4 输出前校验
- [ ] 在活动记录或命令输出中标注完成的关键词搜索与读取的指南。
- [ ] `/spec` 或 checklist 中引用需遵循的规范文件。
- [ ] 产出物满足 frontmatter、命名、互链闭环要求。
- [ ] 核对引用文档的 `last_update` / `layer` / `source`，确认为最新版本且适用。
- [ ] Summary 说明分类结果、引用资料、风险与下一步。

更多流程示例参见 `CLAUDE.md` 第 8 节《Launch-X任务识别与分类整合框架》。

---

坚持以上规范，Codex CLI 可在简单沟通、搜索强化与结构化交付三个层级中高效切换，确保 LaunchX 的知识资产与执行质量持续复用与进化。
