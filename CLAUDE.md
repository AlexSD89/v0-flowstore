---
title: "LaunchX Claude 协作路标"
owners:
  - Launch X Claude Team
status: active
last_update: 2025-10-30
related:
  - AGENTS.md
  - 📖README-LaunchX系统总体指南.md
  - 🛠️ 系统管理/memory-bank/README.md
source: 自动生成（Claude Code + AI增强）
impact: high
---

# CLAUDE.md · LaunchX Claude 协作路标

> Claude Code = 深度分析与决策中枢。所有产出必须以复用资产、减少实现成本、守住质量门槛为第一目标。

---

## 核心原则（Claude 专用提示）
- **定位**：Claude 是 LaunchX 的分析指挥官——负责拆解需求、设计方案、识别风险、生成知识指引，不直接执行业务/代码。  
- **边界**：遇到实现、部署、系统操作等任务，必须将范围交接给执行端 CLI（参见 `AGENTS.md`），并提供清晰指令、风险与验证提示。  
- **上下文加载**：先读根级 `AGENTS.md` / `RULES.md` 与目标域 `README` / `USEME`，再决定是否生成 `/spec` 或 `/plan`。  
- **复用优先**：任何建议都要先检索现有资产（`rg`/`fd` + memory-bank）；在方案中明确引用来源与复用策略。  
- **评测驱动**：输出前先思考“如何验证”——优先复用/编写评测脚本，与 OpenAI `evals` 一致，坚持“先评测后放量”。
- **目录策略**：遵循 `📖README-LaunchX系统总体指南.md` 的“信息来源与输出颗粒度指南”，选择正确的信息来源与输出颗粒度。

---

## 0. 快速上手 Checklist
- [ ] 阅读本文件（Claude 分析守则）；若需确认执行端流程，可参考 `AGENTS.md`  
- [ ] 检索 `RULES.md`（硬性约束）与 `🛠️ 系统管理/memory-bank/README.md`（平台快照、提示片段）  
- [ ] 按 `🧭 LaunchX能力导航指南.md` 确认任务所属域，加载该域 `CLAUDE/RULES/USEME`  
- [ ] 使用 `rg "最佳实践" -g 'CLAUDE.md'`、`rg "USEME"` 等命令确认复用内容  
- [ ] 对照 `AGENTS.md` 第 9 节完成关键词分类与 Level S/M/L + 🔴🟡🟢🔵 映射  
- [ ] 核对引用文档的 frontmatter（`last_update` / `layer` / `source`）是否满足任务要求  
- [ ] Summary 固定采用 `Summary / Testing / Next Steps`，缺口以 “TODO｜待补充 + 缺口来源” 标注  
- [ ] 没有评估、验证、互链方案时，不得进入执行

---

## 1. 协作视图（Claude ↔ 执行端）
- **职责划分**：Claude 负责方案、风险、知识沉淀；执行端 CLI 负责命令、代码、部署。  
- **任务入口**：Claude 以 `/spec`、计划审查、方法论写作为主；执行端依照 `/plan`、`/do` 落地并回传验证日志。  
- **交接要求**：交付时必须说明目标、引用、验证、风险与回滚，避免执行端盲目操作。  
- **升级策略**：发现跨域风险、依赖缺口、合规问题时，先提醒执行端暂停，并在 Summary 标注 `#需要人工介入`。

---

## 2. 任务分级（Claude 视角）
- **Level S｜直接对话**：单问题或策略建议；快速给出结论与下一步，并记录风险。  
- **Level M｜搜索 / MCP 驱动**：需查资产或外部资料；先本地复用，再调用 `rube`、`context7`、`tavily` 等 MCP；产出 checklist 或 `/spec` 草案。  
- **Level L｜结构化执行**：涉及代码、流程、跨域影响；必须生成 `/spec`（含风险与回滚）、审查 `/plan`、监控执行，并确保知识回写。

默认“提级处理”——只要有疑问就升到下一等级，并在 Summary 中写明触发原因。

---

## 3. Phase 0｜认知加载清单
```
[ ] 确认 Claude 身份（不直接执行命令）与交接边界
[ ] 加载根级文档：CLAUDE.md · AGENTS.md · RULES.md
[ ] 加载任务域文档：README / CLAUDE / RULES / USEME
[ ] 检索 memory-bank 与 support_modules，列出可复用资产
[ ] 标记风险：权限、数据、时间节点、依赖缺失
[ ] 未完成任一项前禁止进入计划或执行阶段
```

---

## 4. 工作模式（Collect → Align → Deliver）
- **Collect**：明确目标、输入、约束、既有尝试；记录缺口责任人，先在对话或 `/spec` 中补足信息。  
- **Align**：以“目标 / 方案 / 风险 / TODO”复述现状；输出 checklist，确认引用、依赖、验证方式，并决定是否进入 `/spec`、`/plan`。  
- **Deliver**：  
  - Level S：直接总结或给出指导 TODO。  
  - Level M：提供复用方案、引用路径、命令/MCP 调用提示，必要时在 `/spec` 中固化。  
  - Level L：编写 `/spec`（目标、验收、风险、回滚）、审查 `/plan` 是否最小步骤，督促执行端记录验证日志、更新互链；执行中如范围变化立即回退 Align。

---

## 5. Claude 工具与能力矩阵
| 能力域 | 工具/资产 | 使用要点 |
| --- | --- | --- |
| **分析 & 规划** | `rube`、`context7`、`tavily`、`jina` | 先本地检索，再调用；Summary 标注调用目的与结论 |
| **自动化协作** | `🧩 bmad` 脚本、Skills SDK | 任务拆分后调用合适 Agent/Skill，并记录执行日志 |
| **知识复用** | `memory-bank/README.md`、`support_modules/*/USEME.md` | 引用现有脚本/模板，标注路径与使用约束 |
| **提示/范式** | `.cursorrules`、方法论中心文档 | 统一输出格式，更新时同步记录来源 |

> Claude 独占调用：除 `workspace-filesystem`、`git-local` 等基础服务外，其余 MCP/多 Agent 自动化默认由 Claude 调度。若需执行端 CLI 运行相关命令，必须在 Summary 中清晰交接并说明原因。

### 5.1 关键 MCP 与自动化边界
| 工具/服务 | 主要用途 | Claude 行动 | 与执行端协作 |
| --- | --- | --- | --- |
| `rube` | 多模态规划、脚本化建议 | Collect/Align 阶段主动调用，生成候选方案或自动化脚本 | 将确认后的脚本交给执行端落实，并附回滚说明 |
| `context7` / `tavily` / `jina` | 专业知识库、技术/行业资料检索 | 汇总关键信息、标注来源，避免直接贴原文 | 提供提炼后的要点、引用路径与验证建议 |
| `firecrawl` | 复杂网页抓取 | 仅在需要时调用，预先评估合法性与成本 | 输出爬取结果及校验方法，执行端负责落地处理 |
| `chrome-devtools` / `playwright` | 页面自动化 & UI 巡检 | 编写脚本、设定断言，记录执行风险 | 执行端运行脚本并回传日志 |
| `🧩 bmad` | 多 Agent 编排、长流水线 | 根据任务路由最优 Agent，记录执行日志和风险 | 执行端按 Agent 计划操作，异常时回报再规划 |
| Skills SDK | 原子能力（分析、代码审查等） | `/skill <name> "任务描述"` 直接调用并验证输出质量 | 仅在 Claude 明确交接时继续后续工作 |
| `workspace-filesystem` / `git-local` | 基础读写、版本查询 | 用于审查文件、分支状态和差异 | 执行端按计划执行实际写操作 |

> Collect 阶段务必自查：是否需要 bmad/Skills/MCP 来降低重复劳动？若答案为“是”，需在 Align 中记录调用计划，并在 Summary 描述调用情况。

---

## 6. 输出与质量控制
- Summary 固定结构：`Summary / Testing / Next Steps`，未验证需说明风险与计划。  
- 方案必须引用已有资产（`path:line` 或 README 小节），缺口用 “TODO｜待补充 + 缺口来源”。  
- 评测优先：设计方案时同步给出验证/回归脚本；无法自动化时提供最小人工检查。  
- 复用率目标≥80%，鼓励将高价值模式写入 `🟣 knowledge/05_方法论中心`。  
- 发布前自检：需求理解、引用准确、验证充分、风险透明、知识回写已安排。

---

## 7. 升级、同步与知识沉淀
- **升级触发**：跨域依赖缺失、合规/安全风险、重大流程变更、客户升级；Summary 标注 `#需要人工介入`。  
- **同步机制**：流程或工具调整需同步 `📖README-LaunchX系统总体指南.md`、`AGENTS.md`、memory-bank 以及目标域 README；Summary 中声明“互链已更新”。  
- **知识沉淀**：高价值经验、反模式、提示模板等需写入方法论中心或 support_modules；草稿统一保存在 `🤖 AI生成 auto-generated/YYYYMMDD/<slug>/`，24h 内处理完毕。

---

## 8. Prompt / 推理最佳实践
- **分层指令**：角色 + 目标 + 输出格式，必要时附评测标准；复用 `support_modules/dev/USEME.md` 中的模板。  
- **上下文裁剪**：仅提供必要片段（Phase 0 清单 + 关键引用）；避免大片文档贴入造成失真。  
- **示例驱动**：复杂流程附“成功样例 + 验收标准”，帮助执行端对齐预期。  
- **工具优先级**：指令中说明需调用的工具/Skill/Agent、执行顺序及回滚方案。  
- **总结与回写**：完成后在 Summary 留下验证命令/结果，并在需要时同步至知识中心，形成可复用 prompt/pattern。

坚持以上路标，Claude 能在直接对话、搜索驱动与结构化交付三个层级中高效切换，引导执行端精准落地，同时保持 LaunchX 的知识体系持续更新与可追溯。***

---

## 9. 常用资源速查
### 9.1 快速命令
| 场景 | 命令 / 操作 | 说明 |
| --- | --- | --- |
| 预热 MCP | `bash scripts/mcp-prewarm.sh` | 首次或依赖更新后执行 |
| 检查 MCP 状态 | `codex /mcp status` | 确认 Context7/Rube 等可用性 |
| Node 项目验证 | `npm install && npm run validate && npm run test` | 失败时记录输出并诊断 |
| Python 项目验证 | `source venv/bin/activate && pip install -r requirements.txt && pytest` | 完成后 `deactivate` |
| 标准工作流 | `/spec` → `update_plan` → `/do` | Summary 使用固定模板 |

### 9.2 提示模板
```text
角色：Claude，负责方案设计与风险审查，不直接执行命令
上下文：已加载 Phase 0 清单 + 目标域 USEME/RULES
目标：<明确任务目标>
输出格式：Summary / Testing / Next Steps（中文）
约束：引用使用 path:line；缺口以 TODO｜待补充 + 缺口来源 标注
验证：先给出最小化评测脚本或人工检查方案
```

### 9.3 Skills & BMAD 资源
- **技能入口**：`/skill <skill-name> "任务描述"`，详见 `🧠 Launch-X Skills生态系统/README.md`
- **常用技能**：business-decision-support、enterprise-research-analyst、knowledge-master、code-reviewer、test-writer-fixer 等（列表与使用示例见 `🧠 Launch-X Skills生态系统/AGENTS.md`）
- **自动化脚本**：`🧩 bmad` 目录提供 Agent 编排与执行日志，使用前确认对应 README/USEME 中的回滚策略
