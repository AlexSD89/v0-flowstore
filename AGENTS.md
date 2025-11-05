---
title: "LaunchX 指挥总则"
owners:
  - Launch X Codex Team
status: active
last_update: 2025-11-05
related:
  - CLAUDE.md
  - 📖README-LaunchX系统总体指南.md
source: 人工采集
impact: high
---

# AGENTS.md · LaunchX 指挥总则

> 把 AI 当作“才华横溢但失忆的合作者”。通过外部记忆 + 流程 guardrails，让 Codex CLI 先复用资产，再交付新增价值。

**核心定位**：本文件规定 Codex CLI 的协作边界、执行流程与风险机制，确保所有操作与 LaunchX 全局策略一致。

## 1. 核心原则（LLM 导航提示）
- **上下文先行**：先读根级 `CLAUDE.md` 与目标域 `USEME.md`，再判定资源调度三步法（Assess｜Gather｜Deliver）与 Dev Docs 三文件的更新范围（CLAUDE.md:48-95；RULES.md:18-40）。
- **精准检索**：使用 `rg`、`fd` 搜索“最佳实践”“USEME”等关键词，优先复用已有段落，减少空写。
- **最小必要写作**：Collect/Align 未确认前禁止新建文档；缺口用“TODO｜待补充 + 缺口来源”标注（🛠️ 系统管理/⚙️内容归档规则.md:16）。
- **引用可追溯**：引用统一使用 `path:line` 或 README 小节；新增内容需同步 memory-bank 与相关 README 的互链（🛠️ 系统管理/memory-bank/README.md:5）。
- **先评测后放量**：涉及 AI 输出或关键流程时，优先复用/编写评测脚本，遵循 OpenAI `evals`“先建立评测再迭代”的理念。
- **目录策略**：参考 `📖README-LaunchX系统总体指南.md` 的“信息来源与输出颗粒度指南”，按目录规则选择信息来源与输出形态。
- **能力边界**：Codex 仅执行本地命令与最小文档改动；涉及 Skills/Hooks/SubAgents 的动作需提前与 Claude 对齐，并在 Summary 记录交接。

---

## 2. 使用前速览
- [ ] 阅读 `📖README-LaunchX系统总体指南.md`、本文件、`CLAUDE.md`、`RULES.md`、`🛠️ 系统管理/memory-bank/README.md`
- [ ] 参考 `🧭 LaunchX能力导航指南.md` 确认目标域，并加载该域 `README` / `CLAUDE` / `RULES` / `AGENTS`
- [ ] 使用 `rg "最佳实践" -g 'CLAUDE.md'`、`rg "USEME"` 等命令寻找可复用片段
- [ ] 对外输出统一使用中文，英文术语首次出现提供中文释义
- [ ] Summary 固定使用 `Summary / Testing / Next Steps` 模板
- [ ] 缺信息时标注 “TODO｜待补充 + 缺口来源”，引用使用 `path:line`

---

### Codex ↔ Claude 协同提示
- **执行范围**：Codex 聚焦仓内检索、最小化代码/文档改动与验证记录；Claude 负责 Skills、Hooks、SubAgents 调度及方案推演。
- **交接机制**：需要 Claude 介入（如触发 Hook、调用 MCP、编写复杂决策稿）时需在对话中显式说明，并在 Summary 标注“交接给 Claude”与预期输出。
- **结果同步**：Claude 返回的分析或自动化结果由 Codex 落地到仓库（代码、Dev Docs、memory-bank），确保双侧上下文保持一致。

---

## 4. 统一工作流程（Codex视角）

> Claude 负责认知与自动化调度，Codex 仅执行本地命令和文档更新；详细流程见 `CLAUDE.md`“统一工作流程”。
## 5. 响应分级策略（Codex执行）

| 等级 | Codex 行动 | Claude 行动 | Dev Docs / Summary 要求 |
| --- | --- | --- | --- |
| **Level S** | 复盘 Dev Docs/memory-bank，整理轻量 5 步 mini plan；执行可行本地命令 | 触发 `rube` 校验或补充答案；信息不足时升级 | Summary 记录结论 + mini plan/TODO + 待 Claude 操作 |
| **Level M** | 输出 checklist、引用、待验证事项；更新或创建三文件 | 启动 Phase 0 Hook、核心 Skills、MCP，回传自动化结果 | plan/context/tasks 同步更新；Summary 标注命令/日志引用 |
| **Level L** | 跟踪风险、验证状态、知识回写需求；维护 Dev Docs（plan/context/tasks）中本地部分 | 组合 Skills/Hooks/🧩 bmad，多轮 Compare/Align，生成验证/回滚脚本 | Dev Docs 扩展 `/risks` `/tests`；memory-bank 互链由 Claude 回写 |

> 分级依据与自动化策略以 `CLAUDE.md` 为准；Codex 只需落实表内本地动作并准确记录交接。


### Phase 0｜认知加载
- 阅读 `CLAUDE.md`、目标域 `README/USEME`、现有 Dev Docs，记录已加载的上下文与缺口。
- **智能Skills检测**：若用户输入复杂需求，检查RULES.md的"🎯 智能Skills检测与替代系统"是否触发相应Skills功能，记录检测到的Skills名称和置信度。
- 列出可复用资产（Dev Docs、memory-bank、support_modules）；不足之处使用 "TODO｜待补充 + 来源" 标注。
- 若缺少 Dev Docs，在 Summary 写明"待 Claude 初始化 dev-docs/<project>/"。

### Phase 1｜计划定位
- 梳理 mini plan（目标、范围、阻塞、验证方式），写入 Summary 或 plan.md。
- 标注需要 Claude 执行的自动化（Hook/MCP/Skill 等），准备命令与风险说明。

### Phase 2｜执行与记录
- 按 mini plan / tasks.md 执行本地命令；命令前说明目的，失败时保留日志。
- 无法执行的自动化项，在 Summary 标注“待 Claude：<命令/脚本 + 目的 + 风险>”，等待 Claude 处理。

### Phase 3｜收尾与沉淀
- 会话结束或交接前更新 context.md 的 SESSION PROGRESS（或在 Summary 维持同结构）。
- 回写验证命令、日志路径、未完成事项；如需知识沉淀，提出 memory-bank 更新建议，由 Claude 回写。

---



---

## 6. Dev Docs & Summary 快速检查
- **plan / mini plan**：写明目标、范围、风险；无三文件时在 Summary 维护最新 mini plan。
- **context / SESSION PROGRESS**：更新 ✅ 已完成 / 🟡 进行中 / ⚠️ 阻塞，并注明关键文件、负责人。
- **tasks / Checklist**：拆解任务并标注状态，Codex 仅勾选本地完成项。
- **Summary 模板**：使用 `Summary / Testing / Next Steps`；Next Steps 中注明“待 Claude：<命令/风险>”与 Codex TODO。
- **验证与互链**：所有命令、日志路径、引用来源需记录；需要 memory-bank 更新时提出建议，等待 Claude 回写。

---

## 7. 工具与资源边界
- Codex 只能执行仓库内命令、编辑文件、记录日志；不得触发 Hooks、Skills、MCP、🧩 bmad。
- 如需自动化支持：
  1. 在 Summary 或 plan/context 中写明命令/脚本、目的与风险；
  2. 标注“待 Claude：<说明>”，并给出期望输出位置；
  3. 收到结果后更新 Dev Docs 与 Summary。
- 本地工具默认顺序：`rg`/`fd`/`sg` → 仓库脚本 → lint/测试命令；执行前说明目的，失败时保留输出。
- 复用优先：先查 `memory-bank/support_modules`、目标域 README/USEME；仍缺信息再请求 Claude 调用 Skills/MCP。

---

## 8. 输出与引用规范
- **Summary 模板**：固定使用 `Summary / Testing / Next Steps`，未验证需说明风险与代办。  
- **最小必要写作**：Collect/Align checklist 未完成前禁止新建文件；缺信息时保持在对话或 plan/context 中，以 “TODO｜待补充 + 缺口来源” 标注（🛠️ 系统管理/⚙️内容归档规则.md:16）。  
- **Frontmatter 完整**：所有 Markdown 必含 `title / owners / status / last_update / related / source / impact`。  
- **引用闭环**：引用现有资产或外部资料时标注 `path:line` 或 README 小节；新增互链需同步 memory-bank 与相关 README（🛠️ 系统管理/memory-bank/README.md:5）。  
- **验证记录**：在 Summary 中写明测试命令、脚本或人工检查步骤；无法验证时说明风险与补救。  
- **草稿治理**：AI 草稿统一保存在 `🤖 AI生成 auto-generated/YYYYMMDD/<slug>/`，24h 内迁移或删除并在 Summary 标注处理结果。
- **思维产出**：Level M/L 任务的 Summary 必须附上 Model/Compare 摘要或链接，说明推理链条与方案取舍。

## 9. 工具与资源矩阵
| 工具/资产 | 用途 | 使用说明 |
| --- | --- | --- |
| **MCP：rube** | 拉取外部建议、自动化请求 | Codex 记录命令与目的，待 Claude 执行并回传结果 |
| **MCP：context7 / tavily / jina** | 技术文档、网络资料、内容提取 | 在 plan.md 或 context.md 记录来源与复用链接，标注“待 Claude 调用” |
| **🧩 bmad** | 多 Agent 自动化脚本、SOP | 编制运行指令与风险提示；执行与结果由 Claude 记录 |
| **support_modules/** | 公共 API、脚本、提示片段 | 引用时标注路径与函数；发现缺口先补齐 USEME |
| **🧰 tools** | 现成子项目或脚手架 | 阅读各自 README；使用后更新互链 |
| **质量/配置 Hooks** | 自动化质量检查、配置校验 | 仅准备 `.claude/hooks/*` 执行指令与备注，由 Claude 触发并反馈日志 |

调用任何外部或新增工具时，在 Summary 中写明名称、子路径、目的与风险。

---

## 10. 子目录指挥文档继承规范
- **强制继承**：子目录内的 `AGENTS.md` / `CLAUDE.md` 必须沿用根级语言策略、内容禁区、Summary 模板、工具记录要求与使命三线，并使用完整 frontmatter。
- **定制步骤**：依据 `🧭 LaunchX能力导航指南.md` 选择目标域后，阅读该域 `README.md` / `CLAUDE.md` / `RULES.md` / `USEME.md`，将域内角色分工、流程、质量指标写入子目录 `AGENTS.md`。
- **互链要求**：新增或更新子目录规则时，在根级本文件的相关节中登记互链，同时在目标域 README、memory-bank 索引中注明“引用于根级 AGENTS.md`path`”。
- **生成流程**：Collect 阶段确认域内资产 → Align 阶段列出继承条目与域专属补充 → Deliver 阶段产出指挥文档，并按 `🛠️ 系统管理/⚙️内容归档规则.md` 归档。

---

## 11. 升级、同步与安全
- **升级触发**：高风险事件、资源冲突、重大缺陷、跨域变更立即升级域负责人，并在 Summary 标记。  
- **变更同步**：涉及流程、工具或方法论的更新，需同步 `📖README-LaunchX系统总体指南.md`、`CLAUDE.md`、memory-bank 及相关目录 README，并在 Summary 声明“互链已更新”。  
- **安全约束**：禁止运行未确认的毁坏性命令；环境或权限异常需在 plan.md 或 Summary 说明并等待批准。  
- **记录回滚**：对配置、脚本、自动化的修改必须写明回滚方法与影响范围。  

---


### 9.4 输出前校验
- [ ] 在活动记录或命令输出中标注完成的关键词搜索与读取的指南。
- [ ] plan.md 或 checklist 中引用需遵循的规范文件。
- [ ] 产出物满足 frontmatter、命名、互链闭环要求。
- [ ] 核对引用文档的 `last_update` / `layer` / `source`，确认为最新版本且适用。
- [ ] Summary 说明分类结果、引用资料、风险与下一步。

更多流程示例参见 `CLAUDE.md` 第 8 节《Launch-X任务识别与分类整合框架》。

---

坚持以上规范，Codex CLI 可在简单沟通、搜索强化与结构化交付三个层级中高效切换，确保 LaunchX 的知识资产与执行质量持续复用与进化。
