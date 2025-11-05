---
title: "ClaudeCode 全局设计哲学"
owners:
  - Launch X Claude Team
status: review
last_update: '2025-11-05'
related:
  - 🧠 Launch-X Skills生态系统/README.md
  - 🧠 Launch-X Skills生态系统/AGENTS.md
  - 🧠 Launch-X Skills生态系统/CLAUDE.md
  - 🧩 bmad/CLAUDE.md
  - AGENTS.md
  - RULES.md
  - 📖README-LaunchX系统总体指南.md
source: AI生成（基于官方资料整合） + 2025-10-14 方法论中心快照
impact: high
---

# 🎯 ClaudeCode 全局设计哲学

> 基于 Anthropic 官方文档梳理 Claude Code、Agent Skills、Subagents、MCP 与 Agent SDK 的协同架构，为 LaunchX 的技能与自动化建设提供复用基线。

---

## 0. 文档范围与资料基线
- 官方能力映射来源于 Anthropic 对 Agent Skills、Claude Code Skills、Subagents、CLI、Agent SDK 与 MCP 的公开说明[^skills-overview][^claudecode-skills][^subagents][^slash-commands][^agent-sdk][^mcp-doc][^mcp-connector][^cli-reference][^claudecode-overview]。
- 本地交付需同时遵循 LaunchX Phase 0、引用、互链与 `/spec → /plan → /do` Guardrail[[AGENTS.md:36-88]]。

---

## 1. 官方架构视角

### 1.1 运行表面与能力映射
| 表面 | 核心用途 | Skills 支持 | 典型扩展 |
| --- | --- | --- | --- |
| **Claude Code** | 终端/IDE 中的交互式开发与自动化，具备 Bash/文件系统能力[^claudecode-overview] | 仅支持本地文件系统技能（个人 `~/.claude/skills/`、项目 `.claude/skills/`）[^claudecode-skills] | Subagents、Slash Commands、MCP、本地 hooks[^subagents][^slash-commands][^mcp-doc] |
| **Claude Agent SDK** | 在 TypeScript/Python 中构建生产级 Agent，继承 Claude Code 能力[^agent-sdk] | 读取 `.claude/skills/`，需在配置中显式声明 | 可加载 Subagents、Hooks、Slash Commands、插件、MCP 等同等能力[^agent-sdk] |
| **Claude API** | 消息接口 + 代码执行容器，支持预置/自定义技能 | 通过 `skill_id` 或上传技能目录；需额外 beta headers[^skills-overview] | MCP Connector 可直接使用远程 MCP 服务器[^mcp-connector] |
| **Claude.ai** | SaaS 界面，快速加载个人技能与官方预置技能[^skills-overview] | 自定义技能需单独上传，不与其他表面共享[^skills-overview] | 适合轻量知识沉淀，仍受运行时约束限制 |

### 1.2 组件协同要点
- Skills 以“进阶披露”方式加载：元数据常驻、`SKILL.md` 触发式加载、额外资源按需调用，确保上下文可控[^skills-overview]。
- Subagents 通过独立上下文与工具权限在复杂任务中承担专业角色，可由 CLI 临时注入或作为插件分发[^subagents]。
- Slash Commands 负责显式触发的标准化操作，与自动触发的 Skills 形成互补[^slash-commands]。
- MCP 提供跨系统数据与工具访问，无论在 Claude Code 还是 API 都以受限的 Tool 调用形式出现，支持企业级管控[^mcp-doc][^mcp-connector]。

---

## 2. 核心组件解构

### 2.1 Agent Skills（技能层）
- 技能目录由 `SKILL.md` 及可选脚本、参考文档组成，描述“做什么 + 何时触发”，支持多文件引用[^skills-overview][^claudecode-skills]。
- Claude Code 技能遵循本地文件系统结构；项目级可随代码版本化共享，个人技能用于跨项目复用[^claudecode-skills]。
- 运行约束：技能执行环境无法联网、不可安装新依赖，只能利用预装包——技能脚本必须自给自足[^skills-overview]。

### 2.2 Slash Commands 与 CLI
- 内置命令覆盖权限、模型、MCP、诊断等高频操作；自定义命令以 Markdown 形式存放并支持参数占位、安全禁用[^slash-commands]。
- `claude` CLI 除交互模式外，可通过 `--agents` 注入子代理、`--add-dir` 扩展工作目录、`claude mcp` 管理 MCP 连接，支持自动化脚本调用[^cli-reference]。

### 2.3 Subagents（协同作业层）
- Markdown Frontmatter 描述 `name/description/tools/model`，项目级优先于用户级，CLI JSON 定义优先级介于两者之间[^subagents]。
- 子代理以独立上下文运行，可聚焦代码审查、调试、数据分析等子场景，降低主线程上下文压力[^subagents]。

### 2.4 Agent SDK
- SDK 与 Claude Code 同源，继承 Subagents、Skills、Hooks、Slash Commands、插件、`CLAUDE.md` 记忆等能力，并提供 TypeScript/Python API、上下文压缩、权限编排能力[^agent-sdk]。
- 程序化场景需显式配置 `allowed_tools`、`settingSources`，确保加载所需工具与说明[^agent-sdk]。

### 2.5 MCP 生态（工具层）
- Claude Code 通过 `claude mcp add` 支持 HTTP/SSE/STDIO 服务器，并可设置输出 token 上限及企业级 allow/deny 列表[^mcp-doc]。
- API 侧的 MCP Connector 允许在 Messages API 中声明远程服务器、OAuth Token，并接收 `mcp_tool_use`／`mcp_tool_result` 结构化输出[^mcp-connector]。
- 组织可用 `managed-mcp.json` 与 `managed-settings.json` 统一配置，确保跨团队一致性[^mcp-doc]。

---

## 3. ClaudeCode 交互循环（Action Loop）
1. **CLI/SDK 启动**：通过 `claude` CLI 或 Agent SDK 建立会话，声明模型、权限、附加工作目录[^cli-reference]。
2. **技能发现**：Claude 读取技能元数据，根据用户请求触发 `SKILL.md` 并按需加载附属脚本[^skills-overview][^claudecode-skills]。
3. **子代理分工**：当任务匹配专业描述时，委派至 Subagent，以独立上下文执行专责步骤[^subagents]。
4. **Slash Command & Hooks**：显式命令（如 `/review`、`/mcp`）触发标准流程或权限设置，与技能互补[^slash-commands]。
5. **MCP Tool 调用**：通过本地或远程 MCP 服务器访问外部系统，遵从输出与权限限制[^mcp-doc][^mcp-connector]。
6. **结果汇总与治理**：Agent SDK / Claude Code 汇总执行结果，并与 LaunchX 的 `/spec → /plan → /do` 流程、Summary 守则对齐[[AGENTS.md:69-88]]。

### 3.1 Agent SDK Loop：Task → Gather → Take Action → Verify
> Claude Agent SDK 的全周期循环由“任务 → 收集上下文 → 执行 → 验证输出”构成，配套能力组合来自用户提供的官方示意图[^user-loop]。

**Task 与 Gather Context**
- **SubAgents**：在 Gather 阶段创建专长子代理，实现多线程上下文收集与差分验证，减少主线程 token 压力[^subagents]。
- **Compacting**：Agent SDK 内置上下文压缩器，可在子代理返回结果前执行自动摘要，确保后续步骤仍能读到关键事实[^agent-sdk][^user-loop]。
- **Agentic Search**：结合 CLI 工具（`rg`、`fd`、`tail` 等）实现文件/日志级检索，缩短 Collect 时间并匹配 LaunchX Phase 0 的“精准检索”要求[[AGENTS.md:18-35]]。
- **Semantic Search**：当上下文分散在多份文档时，再用嵌入或图谱检索建立语义邻域，加速对技能和 MCP 资产的复用[^user-loop]。

**Take Action**
- **Tools**：技能、Slash Commands 与自研脚本组成可组合工具集，用于调用 Hook、评测脚本或自定义函数[^slash-commands][^claudecode-skills]。
- **MCP**：通过标准化的 MCP 连接访问外部系统，并在 `managed-mcp.json` 中声明白名单以满足审计[^mcp-doc]。
- **Bash & Scripts**：借助 Claude Code 的 Bash 会话执行本地脚本，对应 LaunchX 的“最小必要写作 + 自动验证”守则[[RULES.md:37-95]]。
- **Code Generation**：Agent SDK 允许在流程中插入专门的代码生成/修改任务，并配合 Hooks 记录差异，支撑“AI 写 AI”的自举路径[^agent-sdk][^officechai-80percent]。

**Verify Output → Final Output**
- **Defining Rules**：通过 Guardrail（Summary 模板、引用、互链、TODO）判断输出是否满足 LaunchX 规范，确保跨文档一致性[[AGENTS.md:36-88]]。
- **Visual Feedback**：结合 CLI 预览、MCP 可视化（如 Playwright MCP）等方式拾取界面/截图证据，留存验证上下文[^user-loop]。
- **LLM-as-a-Judge**：在必要时引入评审模型复核生成物，尤其是跨域结论或含模糊约束的任务，使“先评测后放量”可程序化执行[[AGENTS.md:18-33]][^user-loop]。

---

## 4. 场景蓝图：小红书营销方案生成与执行
1. **技能定制**  
   - 创建 `xhs-campaign` 技能目录，包含品牌调性说明、内容模板、脚本化分析工具，写入项目级 `.claude/skills/` 以便团队共享[^claudecode-skills]。  
   - 技能描述需明确触发条件（例如“当用户提及小红书营销方案时加载”），并说明可调用脚本（如热门笔记抓取、文案模板）。  
2. **子代理角色**  
   - 定义 `xhs-strategist` 子代理，系统提示聚焦“小红书人群洞察与内容排期”，允许工具 `Read/Grep/Bash` 方便读取技能脚本与数据[^subagents]。  
   - 可再定义 `xhs-sentiment-analyst` 处理评论分析、`xhs-assets-curator` 负责素材整理，实现多代理协作。  
3. **Slash Commands 与 CLI 自动化**  
   - 新增 `/xhs-brief` 命令，快速注入“品牌背景 + 目标人群 + KPI”提示，保证输入一致[^slash-commands]。  
   - 使用 CLI 脚本批量执行：`cat briefs/*.md | claude -p "按小红书技能生成排期并同步 MCP 结果"`[^cli-reference]。  
4. **MCP 数据接入**  
   - 连接内部舆情、商品库、联盟数据等 MCP 服务器，结合 `allowedMcpServers` 管控访问，并调高 `MAX_MCP_OUTPUT_TOKENS` 以接收长篇内容[^mcp-doc]。  
   - 若需在 API 层自动化，将服务器配置进 `mcp_servers` 使 Agent 可直接完成跨系统任务[^mcp-connector]。  
5. **交付与沉淀**  
   - 子代理返回内容后，由主线程汇总生成《小红书整合方案》，保持结构化输出（内容策略、KOL 阶段、预算分配）。  
   - 按 LaunchX Phase 0 要求更新 memory-bank、README 与互链，记录 MCP 调用与技能版本[[AGENTS.md:36-65]]。

---

## 5. 实施 Checklist 与 Guardrail
1. **Phase 0**：加载根级指挥文档、目标域 README/CLAUDE/RULES/USEME，确认技能、MCP、子代理的复用资产[[AGENTS.md:36-52]][[AGENTS.md:95-108]]。  
2. **/spec 阶段**：明确技能需求、MCP 范围、模型权限，记录引用的官方资料（例如本文脚注）。  
3. **/plan 阶段**：拆解技能开发、子代理配置、MCP 接入、验证脚本与归档动作，不超过三步并持续更新[[AGENTS.md:85-88]]。  
4. **/do 阶段**：依计划执行，所有文件使用 `apply_patch`，并在 Summary 填写命令、验证、互链状态[[RULES.md:37-66]]。  
5. **Archive**：24h 内迁移 AI 生成物、同步 memory-bank、更新互链，缺口以 TODO 表达并标注责任人[[RULES.md:88-145]][[AGENTS.md:36-52]]。

---

## 6. 方案对比（Compare）
| 方案 | 描述 | 优势 | 风险 | 适用场景 |
| --- | --- | --- | --- | --- |
| **技能优先编排** | 通过本地/项目技能构建主流程，Subagent/Slash Command 作为支撑，必要时再调用 MCP | 文档化好、上下文消耗小、易在 Git 中版本化[^claudecode-skills][^subagents][^slash-commands] | 依赖技能覆盖度，面对实时数据或跨系统任务需要额外扩展 | 规范内容生成、知识型流程、团队技能库建设 |
| **MCP 优先编排** | 以 MCP 服务器和 API 连接为核心，技能只负责包装调用逻辑，Agent SDK 承载 Orchestration | 快速对接外部系统、适合流程自动化、CLI/SDK 可部署在后端服务[^agent-sdk][^mcp-doc][^mcp-connector] | MCP 输出体积大、依赖网络稳定；需额外安全审计与 Token 管理 | 数据驱动、跨平台自动化、需要调度多个 SaaS 的运营任务 |

**决策建议**：优先采用“技能优先”确保可追溯知识沉淀；当场景要求强交互或数据实时性，再引入 MCP 优先方案，并在 `/spec` 中定义输出上限与审计策略。

---

## 7. 风险、合规与 TODO
- Skills 脚本需验证缺失依赖；若依赖外部 API 必须落入 MCP 连接并设置授权，禁止在技能中直接请求网络[^skills-overview][^mcp-doc]。
- Slash Commands 应使用 `disable-model-invocation` 保护敏感操作，必要时结合权限模式限制 CLI 执行[^slash-commands][^cli-reference]。
- MCP 输出大于默认上限需在环境变量中显式声明并记录在 Summary，防止上下文溢出[^mcp-doc]。
- 遵循 LaunchX Summary 模板与引用规范，更新 memory-bank/README 的互链状态[[AGENTS.md:36-65]][[RULES.md:88-145]]。

**TODO｜待补充**
- TODO｜待补充 + Skills 自动化测试清单：确认最新技能测试脚本路径与执行命令（责任人：Skills QA）。  
- TODO｜待补充 + MCP 服务器清册：梳理当前可用的远程/本地 MCP 服务及权限策略（责任人：Automation Steward）。  
- TODO｜待补充 + 小红书场景验证：为 `xhs-campaign` 技能编写最小化 e2e 验证用例，涵盖技能触发、Subagent 协作与 MCP 数据回读（责任人：业务域负责人）。

---

> 本文聚焦 ClaudeCode 官方架构与 LaunchX Guardrail 的结合。后续迁移至正式目录前，请完成 TODO 并在 Summary 中记录互链更新与验证状态。

---

## 8. 头部实践者视角洞察

- **Simon Willison（Datasette 作者）**：通过反编译 Claude Code npm 包发现 `"think"`→4k tokens、`"megathink"`→10k tokens、`"ultrathink"`→31,999 tokens 的推理预算映射[^simon-ultrathink]。这意味着 Claude Code 把“思考时间”作为可编排资源接口，开发者可以显式控制推理深度，类似操作系统的资源调度。
- **swyx（Latent Space）对话 Boris Cherny / Cat Wu**：强调 Claude Code 的定位是“Unix utility”，一切以文本 I/O、/think、Markdown memory、Hooks、MCP 等可组合原语为主[^latentspace-interview]。这定义了“AI 底层 OS” 在 CLI 层的边界：核心是可脚本化与自由组合，非封闭 IDE。
- **Boris Cherny（Claude Code 负责人）**：透露约 80% 的 Claude Code 代码由 Claude Code 本身生成，工程师负责审查与把关[^officechai-80percent]。这证明了“AI 写 AI”的自举模式已经落地，也提示我们设计 Guardrail、评估与 code review 机制的重要性。
- **Chip Huyen（《AI Engineering》作者）**：分享了 Claude Code 因判断“问题不影响核心功能”而拒绝修复 bug 的案例[^chip-huyen-bug]，提醒我们：在关键链路要补充上下文与优先级控制，必要时通过技能或 MCP 显式注入依赖，避免模型误判任务重要性。

这些观点共同勾勒了 Claude Code 作为“AI 底层操作系统”的潜力与边界：具备推理资源调度、轻量原语、可组合扩展和自举能力，但仍需 Guardrail、上下文管理与人工审查来确保可靠性。

[^skills-overview]: Anthropic. Agent Skills Overview. https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview  
[^claudecode-skills]: Anthropic. Use Skills in Claude Code. https://docs.claude.com/en/docs/claude-code/skills  
[^subagents]: Anthropic. Subagents Documentation. https://docs.claude.com/en/docs/claude-code/subagents  
[^slash-commands]: Anthropic. Slash Commands Reference. https://docs.claude.com/en/docs/claude-code/slash-commands  
[^agent-sdk]: Anthropic. Claude Agent SDK Overview. https://docs.claude.com/en/api/agent-sdk/overview  
[^mcp-doc]: Anthropic. Connect Claude Code to tools via MCP. https://docs.claude.com/en/docs/claude-code/mcp  
[^mcp-connector]: Anthropic. MCP Connector (Messages API). https://docs.claude.com/en/docs/agents-and-tools/mcp-connector  
[^cli-reference]: Anthropic. Claude Code CLI Reference. https://docs.claude.com/en/docs/claude-code/cli-reference  
[^claudecode-overview]: Anthropic. Claude Code Overview. https://docs.claude.com/en/docs/claude-code/overview
[^simon-ultrathink]: Simon Willison. “Claude Code: Best practices for agentic coding.” 2025-04-19. https://simonwillison.net/2025/Apr/19/claude-code-best-practices/  
[^latentspace-interview]: Latent Space. “Claude Code: Anthropic’s Agent in Your Terminal.” 2025-05-07. http://www.latent.space/p/claude-code  
[^officechai-80percent]: OfficeChai. “80% Of Claude Code's Code Is Written By Claude Code: Anthropic Lead Engineer.” 2025-05-12. https://officechai.com/ai/80-of-claude-codes-code-is-written-by-claude-code-anthropic-lead-engineer/  
[^chip-huyen-bug]: OfficeChai. “‘Minor Issue, Doesn't Break Functionality’: Claude Code Refused To Fix Bug, Says AI Author Chip Huyen.” 2025-06-16. https://officechai.com/ai/minor-issue-doesnt-break-functionality-claude-code-refused-to-fix-bug-says-ai-author-chip-huyen/
[^user-loop]: 用户提供的「Claude Agent SDK Loop」示意图，展示 Task → Gather Context → Take Action → Verify Output 流程（2025-11-05）。
