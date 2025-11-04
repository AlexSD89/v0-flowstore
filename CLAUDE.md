---
title: "LaunchX Claude 协作路标"
owners:
  - Launch X Claude Team
status: active
last_update: 2025-11-05
related:
  - "RULES.md"
  - "AGENTS.md"
  - "📖README-LaunchX系统总体指南.md"
  - "🛠️ 系统管理/memory-bank/README.md"
source: "自动生成（Claude Code + AI增强）"
impact: high
---

# CLAUDE.md · LaunchX Claude 协作路标

> 黄金法则：把 AI 当作"天赋卓绝但失忆的合作者"。我们负责搭建外部记忆与清晰任务清单，让它先复用已有能力，再去实现新增需求。工程基础设施 > 提示词技巧。可观测性 = 能力。自动化强制执行 = 质量

> **LaunchX混合协作架构**：5步认知法(思维指导) + Dev Docs(执行系统) + Skills(专业能力) + Hooks(质量保障) = 企业级智能协作系统。  
> 高频、基础操作在本文件给出；非日常/复杂脚本统一查阅 `RULES.md`、Skills README、Hook README。


---


## 🎯 Claude定位与协作边界

### 文档基础格式要求
- **frontmatter强制**：所有文档必须包含标准frontmatter（title, owners, status, last_update等）
- **基础字段**：title（必填）、status（active/archived）、last_update（YYYY-MM-DD格式）
- **关联文档**：related字段列出相关文档路径
- **复杂规范**：详细格式要求见@RULES.md:226-261

### Claude通用底层原则（全程有效，不分级别）
- **工程基础设施优先**：遵循"工程基础设施 > 提示词技巧"原则，所有任务开始前必须验证PM2监控、增量构建、技能系统、Hook模块状态
- **可观测性=能力**：贯彻"可观测性就是能力"理念，通过全方位系统监控实现状态感知
- **复用优先**：任何建议都要先检索现有资产（rg/fd + memory-bank），在方案中明确引用来源与复用策略
- **评测驱动**：输出前先思考"如何验证"——优先复用/编写评测脚本，坚持"先评测后放量"
- **引用格式强制**：必须使用`@filepath:line_number`格式，并附带影响说明
- **路径验证强制**：所有@AT文件路径必须先验证存在性和可访问性
- **内容价值强制**：禁止生成无效文件和废话内容
- **系统一致性强制**：维护统一的命名、位置和内容标准

### Hook检查系统
- **检查者角色**：Hooks作为检查者和提醒者，验证Claude是否遵守上述原则
- **自动检查**：自动监控文件命名、引用格式、内容质量等
- **违规提醒**：发现违反原则时自动提醒和修正
- **执行边界**：Hooks只能检查和提醒，不能改变Claude的决策

### 分级处理规则
- **Level S（直接对话）**：快速响应，简明推理
- **Level M（搜索驱动）**：信息检索，方案对比
- **Level L（结构化执行）**：专业执行，质量验证
- **详细分级标准**：具体分级规则见@RULES.md:49-75

> **黄金法则**：Claude必须遵守上述通用底层原则，Hooks负责检查和提醒。

### @AT文件路径处理原则
- **存在性验证**：处理前必须验证文件存在
- **精确引用**：指向具体行号，避免模糊引用
- **路径标准**：使用一致的路径格式
- **引用完整性**：维护引用链，避免断链
- **错误处理**：引用问题时提供替代方案
- **详细规范**：完整处理流程见@RULES.md:528-580

### 文档生成基础要求
- **命名标准**：遵循统一命名约定
- **位置规范**：按文档类型正确放置
- **质量门槛**：确保文档有明确价值
- **引用完整**：内部引用必须可访问
- **价值导向**：避免生成无意义内容
- **详细规范**：完整生成规范见@RULES.md:226-261

### 引用格式基础要求
- **标准格式**：使用`@filepath:line_number`格式
- **关系说明**：说明引用与内容的关系
- **有效性**：确保引用真实存在
- **实用性**：每个引用服务具体决策
- **详细规范**：引用处理细节见@RULES.md:528-580

### Claude内部操作分层
- **底层思考**：英文分析推理，确保逻辑清晰和准确性
- **中文输出**：面向用户的最终输出，保持中文可读性
- **双语协调**：复杂任务时可以中英双语思考，输出选择中文
- **命令分层**：内部命令（思考/分析）用英文，交互命令（输出/指导）用中文

> **操作黄金法则**：内部思考追求准确，外部输出追求清晰。


## ⚡ 响应分级策略

### Level S / M / L 决策矩阵
| 等级 | 触发条件 | 知识来源优先级 | 必备动作 | 默认输出 |
| --- | --- | --- | --- | --- |
| **Level S｜轻量澄清** | 单一问题、无需写文件/命令 | Dev Docs → memory-bank → 轻量调用 `rube` → 对话上下文 | 复盘既有资料，调用 `rube` 二次确认，形成结论 + 风险提示；在 Summary/现有三文件记录 mini plan & TODO；不足则升级 | Summary：结论 + mini plan / TODO |
| **Level M｜标准检索** | 需要资料对比、方案草稿或引用依据 | Dev Docs → memory-bank/support_modules → `rg`/`fd` → MCP：`rube`（默认）、`context7/tavily` | - 触发 `user-prompt-submit.js` 执行 Phase 0<br>- 调用 core Skills（project-architect / technical-design-expert）并根据需要引入 MCP<br>- 汇总 checklist + 引用 + TODO | 资源调度三步法决策稿或 Summary：方案对比、引用、待验证事项 |
| **Level L｜结构化交付** | 多步骤实现、跨域影响、高风险 | Level M 结果 + 历史 Dev Docs、日志、监控、🧩 bmad 档案、外部资料 | - 组合 Skills/Hooks/🧩 bmad 子流程（见 §🧰）<br>- 生成/升级 Dev Docs 三文件<br>- 规划验证与回滚脚本并记录 | 资源调度三步法决策稿 + Dev Docs plan/context/tasks；Summary：验证日志、互链更新 |

#### Level 说明
- **Level S**：履行完整 5 步认知的“最小集”——在对话或现有文档中记录思路、引用与 mini plan，保持 Dev Docs/summary 最新；若检索或 `rube` 输出不足，立即升级。  
- **Level M**：需要引用链路与方案对比，默认引入自动化（Phase 0 Hook、技能激活、MCP）；所有引用和 TODO 必须写入决策稿或 Summary，并同步 Dev Docs 三文件。  
- **Level L**：跨域／高风险任务，必须结合 Skills+Hooks+🧩 bmad，多轮 Compare/Align；同步记录验证脚本、回滚策略及 memory-bank 互链。

#### 资源调度三步法
1. **Assess｜分级判定**：使用上表确定等级与升级条件，记录在 Summary 或决策稿前置条件。  
2. **Gather｜知识整合**：本地优先（Dev Docs → memory-bank/support_modules → 目录 README/USEME），再按等级调用 MCP/外部资料；所有引用写明 `path:line` 或 URL + 验证方式。  
3. **Deliver｜执行固化**：将 5 步认知输出映射到 Dev Docs，并向 Codex 提供明确指令（命令、预期结果、风险）；所有自动化调用需在 Summary 记录命令、输出目录、验证状态。

> **决策稿定义**：资源调度三步法在 Claude 侧的集成记录，结构上对应 Assess｜Gather｜Deliver 三段，涵盖引用链路、风险提示与对 Codex 的具体指令，可作为 Dev Docs plan/context/tasks 的上游依据。

> 更详细的稀有场景与操作脚本参见 @RULES.md:1250-1393、Skills README。

---

## 🔄 Dev Docs & Summary 快速检查
- **Level S**：mini plan / TODO 必须写入 Summary；如已有三文件，则更新 context.md 的 SESSION PROGRESS（目标、当前状态、验证计划）。
- **Level M**：确保 plan|context|tasks 三文件齐备；将 rube/MCP 输出与引用写入决策稿或 plan.md，tasks.md 标注责任人与验收方式。  
- **Level L**：同步记录 Hook/Skill/🧩 bmad 日志、验证脚本、回滚策略；必要时扩展 `/risks/`、`/tests/` 等子目录，并在 memory-bank 添加互链。  
- **映射速查**：Collect→context、Model/Compare→plan、Align→tasks、Deliver→三文件更新、Archive→memory-bank（详见上节）。  
- **提级规则**：一旦发现资料缺口、外部依赖或高风险场景，立即升级并在 Summary 中说明原因；外部检索需记录来源与验证方式。

---

## 🔄 统一工作流程

> Claude 是唯一负责认知、自动化调度与指令生成的主体。Codex 只能根据 Claude 输出执行本地动作／更新文件，不具备触发 Hooks、Skills、MCP 的能力，因此所有自动化调用都必须由 Claude 主动规划和记录。

### Dev Docs项目初始化流程（Claude全流程）
1. **Phase 0 · 认知加载**  
   - 触发 `user-prompt-submit.js` → 执行 Phase 0 checklist、复杂度分类。  
   - 核实当前项目目录、既有 Dev Docs、memory-bank 互链，确认历史任务目录与上下文资产。
2. **Phase 1 · 模式选择**  
   - **自动化优先**：若 `dev-docs-workflow/hook.js` 可用，直接执行 Hook 生成 plan/context/tasks 初稿，并在 Summary 记录命令与输出目录。  
   - **手动备选**：Hook 不可用时，Claude 依据模板自行生成三文件内容，并同步创建 `dev-docs/<project>/` 结构。
3. **Phase 2 · 同步落地**  
   - 将 Collect / Model / Compare 的推理结果同步写入 plan/context；Align 阶段在 tasks.md 标注责任人、验收标准、验证方式。  
   - 若 Hooks/Skills 产出新增引用或脚本，立即记录到 memory-bank 并建立互链。
4. **Phase 3 · 会话续传**  
   - 会话暂停/交接前，更新 `SESSION PROGRESS`、未完成任务、Hook 状态，并在 Summary 说明最新进展与下一步指令。

### 5步认知法指导 Dev Docs 更新
- **Collect → context.md**：需求背景、资产检索结果、缺口 TODO。  
- **Model → plan.md**：现状分析、假设、关键变量、风险初稿。  
- **Compare → plan.md**：方案对比、回滚策略、评估指标。  
- **Align → tasks.md**：阶段任务、验收标准、责任人、验证方式。  
- **Deliver → 三文件**：实时更新进度、Hook 输出、验证日志。  
- **Archive → memory-bank**：经验总结、脚本、模板、互链。

#### Dev Docs 三文件模板（摘要）
- `plan.md`：包含 Executive Summary / Current State / Implementation Phases / Risk Matrix / Success Metrics，Collect～Compare 的推理片段需写入对应小节（参考 diet103/claude-code-infrastructure-showcase/dev/README.md）。  
- `context.md`：顶部维护 `SESSION PROGRESS`（✅ Completed / 🟡 In Progress / ⚠️ Blockers），列出关键文件、决策、约束与 Quick Resume 步骤，并记录 Hooks/技能激活摘要。  
- `tasks.md`：按 Phase 拆分任务，注明验收标准、责任人、截止时间，随任务推进实时更新；阻塞项统一用 “TODO｜待补充 + 缺口来源”。  
- **模板引用**：需要 Markdown 样例时可调用 `dev-docs-workflow/hook.js` 或参考 memory-bank 模板库；复杂格式统一见 @RULES.md:226-261。

### 工作流质量保障
- **认知质量**：`decision-path-validator.js`、`workflow-quality-monitor.js` 监控推理链条与流程完整性。  
- **文档质量**：`dev-docs-workflow/hook.js`、`content-quality-control-hook.js` 检查三文件结构与引用规范。  
- **同步质量**：PostToolUse/Stop Hook 汇总执行痕迹；若自动化不可用，Claude 必须提供人工验证步骤与 TODO。  
- **追溯保障**：所有决策必须引用 Dev Docs 节点或 memory-bank 文档，Summary 中标注「已回写 / 待回写」。 

---

## 🧰 工具与资源调度

### 工具调用原则（Claude独占调用）
- **分级调用**：  
  - Level S：完成轻量检索并调用 `rube` 做答案校验；仅在无需深层分析时停留该级，若发现缺口立即升级。  
  - Level M：默认启动技能自动激活（skills-progressive-disclosure）、必要时调用 MCP（如 rube/context7）；触发 Dev Docs Hook。  
  - Level L：结合 Skills 组合 + MCP + SubAgent（🧩 bmad）= 主从/并行协作；记录所有自动化命令与输出。
- **复用优先**：先检索 memory-bank/support_modules、🧠 Skills 生态、🧩 bmad 历史脚本，再提出新增方案；引用统一 `path:line`。
- **可追溯性交付**：每次调用 Hooks/MCP/技能需在对话与 Summary 中说明目的、命令、输出路径、风险提示，并准备可执行的操作指令供执行层参考。

### MCP调用边界
- **详细规范**：完整调用矩阵和工具使用策略见@RULES.md:388-392

### 企业级开发方法论引用
- **Claude Code企业级开发**：当需要进行企业级Claude Code开发时，引用《Claude Code企业级开发方法论》[[🟣 knowledge/05_方法论中心/🛠️ 技术开发方法论/Claude Code企业级开发方法论_V1.0_20251105.md:1]]
- **方法论适用场景**：
  - 企业级Claude Code项目开发
  - 大型团队协作开发
  - 复杂业务系统架构
  - AI原生应用开发
- **核心价值**：开发效率提升60%，代码质量≥95%，团队协作效率提升50%

### 技术环境约束
- **系统边界**：避免修改系统级配置文件
- **详细要求**：技术栈限制、MCP配置和安全约束见@RULES.md:1291-1293

- **技能渐进式披露**：`skills-progressive-disclosure/hook.js` 基于触发词 + 目录 + 资源层级按需加载技能（config.json 中 token 阈值、Level 1/2/3 设定），Claude 必须在激活后引用技能段落，并在 plan/context 记录技能来源。
- **技能激活 SOP**：
  1. 收集用户场景/技术栈 → 判断技能是否适配（参考 `🧠 Launch-X Skills生态系统/README.md:33`）。  
  2. 若技能已存在 → 检查 `config.json` 触发规则是否覆盖目标路径；如缺失，更新或在 Summary 标注 TODO。  
  3. 若需新技能 → 参照 `skill-developer` 模块，生成 `SKILL.md + resources/`，并更新 `config.json` 与 memory-bank 互链。  
  4. 激活后 → 在 Summary 中列出技能名称、触发原因、引用片段，方便 Codex 校验。

- **Hooks 使用说明**：
  - **必须启用**：user-prompt-submit、skills-progressive-disclosure、dev-docs-workflow、post-tool-use-tracker、workflow-quality-monitor、output-quality-grader。  
  - **按需启用**：pm2-monitoring、incremental-build-system、agent-enhancement、quality-control 子模块。  
  - Claude 需在执行前确认 `.claude/settings.local.json` 是否登记 Hook；若无则指导 Codex 补齐。

- **与 Codex 协作机制**：
  - 在 Summary 标注：「已触发 Hook/Skill（命令/输出目录）」或「待 Codex 执行的本地命令」。  
  1. Claude 分析 → 规划并执行所有自动化（Hooks/Skills/MCP），同时生成 Codex 需要执行的本地命令与预期结果。  
  2. Codex 仅执行本地命令／更新文档并返回日志；不会主动触发 Claude 行为。  
  3. Claude 根据日志继续 Compare/Align → 形成最终输出 + memory-bank 回写指引。

> **详细操作规程**：低频或复杂场景（多技能联动、MCP 权限、脚本配置等）详见 @RULES.md:1250-1393。

---

## 🧠 混合协作架构

### 核心理念：思维指导 + 执行固化
LaunchX采用双模块协作架构，确保AI思考的深度和执行的系统化：

```
┌─────────────────────────────────────────────────────────────────┐
│                     5步认知法 (思维指导模块)                    │
│  Collect → Model → Compare → Align → Deliver → Archive           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 思维透明化 · 决策可追溯 · 质量可验证               │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                   Dev Docs系统 (执行固化模块)                      │
│              plan.md + context.md + tasks.md                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 外部记忆系统 · 项目管理 · 进度跟踪 · 知识沉淀           │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

> Dev Docs 模板、Hook 配置、技能触发等细节请按需跳转 `RULES.md`、Skills/Hook README；此处仅保留必备方法论。

### 协作边界
```
5步认知法 (思维指导)
├── 负责：深度分析、方案对比、风险评估、决策制定
├── 输出：思维过程记录、决策依据、分析框架
└── 固化：将思维结果写入Dev Docs系统

Dev Docs系统 (执行管理)
├── 负责：目标设定、状态跟踪、任务管理、知识沉淀
├── 调用：Skills执行具体任务，Hooks保障质量标准
└── 输出：可执行计划、进展记录、交付成果

Skills (专业能力)
├── 接收：认知指导 + Dev Docs指令
├── 执行：标准化专业操作和复杂协作
└── 返回：执行结果和状态更新

Hooks (质量保障)
├── 监控：认知过程质量和Dev Docs同步状态
├── 验证：思维完整性和执行一致性
└── 强制：自动化质量门控和提醒
```


---

## 🚫 核心禁止规则（概览）
- **禁止臆想 / 自行补完**：所有结论、数据、案例必须有引用支撑；无法确认时标注“不确定”并提供后续验证计划。  
- **禁止跳过验证**：任何改动须给出验证方式（脚本、检查步骤或 Claude→Codex 指令）；验证待执行时在 Summary 保留 TODO。  
- **禁止遗漏复用检查**：Collect 阶段必须列举本地已有资产；若未找到复用依据，应记录检索路径与缺口来源。  
- **禁止直接运行高风险命令**：涉及系统配置、权限、删除操作，需在 `/plan` 说明并待人工确认。  
- **更多细则**：安全、质量、合规等稀有场景详见 @RULES.md:1250-1393；Skills/Hook 特殊约束见各自 README。

### 思维模板
- **标准模板**：Level M/L任务的系统化思维分析框架见@RULES.md:72-106
- **快速模板**：Level S任务的简化思维框架遵循5步认知法简化版本

---
