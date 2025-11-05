---
title: "ClaudeCode 全局技术架构实现蓝图"
owners:
  - "Launch X Platform Engineering"
status: "drafting"
last_update: "2025-11-05"
tags: [ClaudeCode, 技术架构, Hooks, MCP, 多Agent]
category: "knowledge"
layer: "technical"
related:
  - "./🎯 claudecode-全局设计哲学.md"
  - "../AGENTS.md"
  - "../CLAUDE.md"
  - "🧠 Launch-X Skills生态系统/README.md"
  - "🧩 bmad/CLAUDE.md"
source: "2025-10-14 方法论中心存档 + LaunchX 架构实践复盘"
impact: "为 ClaudeCode 技术落地提供分层视图、Hook 体系与 MCP 集成策略"
version: "0.9"
---

# ClaudeCode 全局技术架构实现蓝图

> 本文拆解 ClaudeCode 在 LaunchX 生态的技术实现：体验层、编排层、数据层、监控层，以及 Hook、MCP、Subagents 的协同策略。与《ClaudeCode 全局设计哲学》配合使用，分别承担“为什么”和“如何做”的职责[[🟣 knowledge/05_方法论中心/🎯 claudecode-全局设计哲学.md:1]]。

## 1. 分层架构总览

| 层级 | 核心目标 | 关键能力 | 依赖组件 |
| --- | --- | --- | --- |
| **体验层（Experience Surface）** | 提供稳定的 IDE/终端交互体验 | 智能输入、实时消息流、上下文感知 | ClaudeCode Runtime、流式输出控制器 |
| **编排层（Orchestration Layer）** | 任务拆解、技能路由、并发控制 | Subagents、Task Router、Hook 框架 | Agent SDK、BMAD Router、Skills SDK |
| **数据层（Persistence Layer）** | 状态持久化与知识图谱管理 | 多级缓存、一致性策略、知识图谱 | memory-bank、Redis/PostgreSQL、Neo4j |
| **监控层（Governance & Observability）** | 性能监控、质量评估、自动优化 | 指标采集、告警、参数调优 | Grafana/Prometheus、BMAD Monitor、强化学习模块 |

## 2. 体验层实现细节

### 2.1 智能输入与预处理
- 输入状态机：placeholder 提示 → 实时字符计数 → 发送按钮状态同步。
- Markdown / 多媒体支持：自动格式化、链接识别、拖拽上传、预览渲染。
- 上下文感知：对话图（消息节点 + 关系边）、实体识别（NER）、主题模型（LDA）、意图置信度更新。

### 2.2 消息流状态机
```text
草稿 → 发送中 → 流式输出 → 生成完成 → 回执确认
                   ↘ 错误检测 → 重试/降级策略
```
- 支持本地 & 服务器状态同步，冲突解决策略（最后写入胜出 + 版本号比对）。
- 错误处理：失败检测 → 自动重试 → 降级提示 → 用户通知。

## 3. 编排层实现细节

### 3.1 任务拆解与负载管理
- 任务依赖图：节点（任务）、边（依赖）、属性（复杂度、风险、资源需求）。
- 粒度优化：最小可执行单元拆解、合并策略、优先级排序。
- 动态调整：实时反馈驱动重拆解与重平衡。

### 3.2 Agent 能力匹配
- 技能矩阵：记录每个 Subagent 的能力评分、最近表现、当前负载。
- 匹配算法：加权评分 + 约束满足（Capability + Availability + Cost）。
- 团队组合：互补性分析、沟通开销评估、学习反馈更新权重。

### 3.3 并发控制
- 资源池：CPU/内存/网络配额，优先级队列调度。
- 死锁预防：资源图检测（Wait-For Graph）、超时与预警。
- 自动扩缩容：基于负载预测调节资源，结合成本优化策略。

### 3.4 Agent SDK Loop 落地（Gather → Act → Verify）
> 该循环复用《ClaudeCode 全局设计哲学》中“任务 → Gather → Take Action → Verify”理念，并结合用户提供的 Claude Agent SDK Loop 示意图，细化到工程级实现[[🟣 knowledge/05_方法论中心/🎯 claudecode-全局设计哲学.md:83-121]]。

**Gather Context**
- **Subagent 预热**：BMAD Router 结合 Agent SDK 启动多角色子代理，基于技能矩阵与任务依赖图自动选型，保证 Collect 期的并行上下文抓取[[🟣 knowledge/05_方法论中心/🎯 claudecode-全局设计哲学.md:31-76]]。
- **上下文压缩（Compacting）**：在每个 Subagent 返回结果前调用 ContextCompactor 服务（基于 `managed-settings.json` + Redis），对 token 密集片段执行语义摘要，确保后续 Action 阶段能留足推理预算。
- **Agentic / Semantic Search**：先通过 `rg/fd/tail` 触发的 Agentic Search 抓取结构化资产，再串联 embedding + Neo4j 节点的语义检索，将 memory-bank、方法论、项目 README 的相关段落注入工作集[[AGENTS.md:18-53]]。

**Take Action**
- **Tool 编排**：Hook Layer 1-3 充当工具控制面，将技能、Slash Commands、验证脚本写成可组合模板，确保任务拆解与权限校验同步[[🟣 knowledge/05_方法论中心/🎯 claudecode-全局设计哲学.md:51-72]]。
- **MCP 执行矩阵**：使用 `managed-mcp.json` 定义实时/数据/设计集群，Agent SDK 通过 `allowed_tools` 字段动态注入，并记录每次调用的 token/延迟指标供监控层回溯[[🟣 knowledge/05_方法论中心/🎯 claudecode-全局设计哲学.md:103-121]]。
- **Bash & Scripts**：Claude Code Bash 容器负责落地本地脚本（lint、评测、数据处理），执行日志立刻写入监控层，以便 Verify 阶段复查[[RULES.md:37-95]]。
- **Code Generation**：当 Hook 判断需要变更代码或文档时，Agent SDK 创建“生成 → 代码审查 → apply_patch”子流程；同时通过 Subagent `code-reviewer` 复核差异，贴合“AI 写 AI”自举模式[[🟣 knowledge/05_方法论中心/🎯 claudecode-全局设计哲学.md:164-166]]。

**Verify Output → Final Output**
- **Defining Rules**：StopHook 校验 Summary 模板、引用格式、TODO 标注，若缺失则回退至 Action 阶段补充[[AGENTS.md:36-88]]。
- **Visual Feedback**：当任务涉及 UI/脚本展示时，触发 Playwright MCP 或内置截图 Hook，生成可视证据并附在验证记录，确保“Visual Feedback”闭环。
- **LLM-as-a-Judge**：将关键产出送入评审型模型或子代理，依据 RULES 的质量标准输出判决，并把判决摘要写入监控层指标与 memory-bank 互链，形成“先评测后放量”链路[[📖README-LaunchX系统总体指南.md:35-115]]。
- **Final Output & 回写**：通过 Layer4 StopHook 统一触发 memory-bank 回写、互链更新、风险记录，并在 Summary 中注明引用与验证命令，完成 LaunchX `Deliver → Archive` 流程[[AGENTS.md:36-108]]。

## 4. 数据层与知识图谱

- 多级缓存：本地内存 → Redis → 永久库（PostgreSQL）。
- 一致性策略：最终一致性为主，对关键事务采用强一致性（两阶段提交）。
- 备份与容灾：增量 + 全量备份，异地灾备，版本回滚。
- 知识图谱：实体抽取、关系建模、图数据库（Neo4j）、PageRank 与社群发现算法，支持实时更新与版本控制。

## 5. 监控层与优化引擎

- **全链路监控**：响应时间、吞吐量、错误率、资源利用率；结合业务指标（用户活跃、功能使用、满意度）。
- **告警机制**：阈值配置、多级告警、自动恢复流程。
- **智能优化**：参数调优（遗传算法、贝叶斯优化）、模型更新（在线学习、增量训练）、策略优化（强化学习、多臂老虎机）。
- **反馈闭环**：Hook 收集执行质量 → BMAD Monitor 聚合 → 触发系统级调参。

## 6. Hook 体系（四层挂钩）

| 层级 | Hook 名称 | 关键功能 | 自动化能力 |
| --- | --- | --- | --- |
| Layer 1 | `UserPromptSubmitHook` | 意图识别、任务分级、上下文切换、学习记录 | 预测场景、预加载工具、个性化配置 |
| Layer 2 | `PreToolUseHook` | 权限申请、工具组合优化、安全检查、性能预测 | 自动审批权限、冲突检测、执行时间评估 |
| Layer 3 | `PostToolUseHook` | 结果评估、学习数据提取、自动纠错、性能优化 | 质量评分、常见错误修复、策略调整 |
| Layer 4 | `StopHook` | 完成度评估、知识沉淀、方法论更新、系统进化 | 自动归档经验、更新知识库、触发参数优化 |

### 6.1 指标采集与回滚策略
- **Layer 1｜UserPromptSubmitHook**  
  - *指标*：任务分级准确率、Phase 0 checklist 覆盖率、上下文预加载耗时。  
  - *采集方法*：将 Hook 输出写入 `hooks/user_prompt.metrics.jsonl`，由 BMAD Monitor 按 5 分钟窗口聚合。  
  - *回滚策略*：若分级准确率 <90%，自动回退到默认 S 级路径并通知值班人检查任务描述。
- **Layer 2｜PreToolUseHook**  
  - *指标*：权限审批命中率、工具冲突次数、预计执行时间误差。  
  - *采集方法*：在 `PreToolUseHook` 中记录 `tool_id`、`approval_id`、预测/实际耗时，由 Prometheus Exporter 抓取。  
  - *回滚策略*：若审批连续失败 3 次或误差>30%，暂停自动批复并切换到人工审批脚本，同时提示重试命令。
- **Layer 3｜PostToolUseHook**  
  - *指标*：工具成功率、自动纠错次数、质量评分均值。  
  - *采集方法*：将 `tool_result` 连同评分写入 `post_tool_use.log`，供 BMAD 质量看板可视化。  
  - *回滚策略*：若成功率 <95%，触发 `tool-retry` 流程最多两次；失败则将任务标记为 `Need Claude Review` 并回退代码更改。
- **Layer 4｜StopHook**  
  - *指标*：Summary 合规率、互链更新率、TODO 关闭率。  
  - *采集方法*：StopHook 校验完成后将结果追加到 `stop_hook_audit.csv` 并推送到 memory-bank 的质量索引。  
  - *回滚策略*：若任一指标低于阈值，自动回滚至上一提交（保留工作区），生成 `rollback-plan.md` 指派责任人补写。

## 7. MCP 工具集成矩阵

- **实时数据集群**：`tavily-search`（趋势监控）、`jina-reader`（文档解析）、`firecrawl`（站点抓取）、`hotnews`（热点聚合）。
- **开发执行集群**：`code-interpreter`（沙盒执行）、`workspace-filesystem`（文件操作）、`git-mcp`（版本控制）。
- **设计集群**：`shadcn-ui`、`design-system`。
- **数据处理集群**：`python-sandbox`、`analytics-engine`、`database-tools`。
- **编排策略**：并发执行、故障转移、负载均衡、成本优化。必要时通过 `MCP Connector` 将远程服务映射进本地 Agent[[🟣 knowledge/05_方法论中心/🎯 claudecode-全局设计哲学.md:104-160]]。

### 7.1 调用拓扑与网络/权限
1. **拓扑分层**  
   - *Core Layer*（本地）：`workspace-filesystem`、`git-mcp`、`code-interpreter` 运行在内网 Sandbox，只暴露给 Claude Code/BMAD。  
   - *Edge Layer*（受控外网）：`tavily-search`、`firecrawl` 等 HTTP/SSE 服务器放置在 DMZ，通过 API Gateway 统一鉴权。  
   - *Partner Layer*（第三方 SaaS）：`hotnews`、`design-system` 等依赖合作方账号，必须通过 MCP Connector 的 OAuth 代理。
2. **网络策略**  
   - Core↔Edge 之间仅允许 443/6006 端口；Edge↔Partner 加入流量白名单，并设置输出 token 上限，防止泄露。  
   - 所有连接通过 `managed-mcp.json` 指定 `tlsRequired` 与 `maxOutputTokens`，Prometheus 监控 RTT 与错误率。
3. **权限治理**  
   - 每个 MCP Server 绑定 `allowed_tools`、`allowed_models` 列表，Layer 2 Hook 负责审批 token。  
   - 对含敏感数据的服务启用 `justification_required` 字段，要求调用方说明使用目的并写入审计日志。

## 8. Subagents 协作网络
- 核心代理：Meta-Agent（路由与战略）、Data-Analyst、Researcher、Automation Steward 等。
- 协作模式：70+ 专业化 Agent 通过技能矩阵动态编组；支持任务分层（Collect、Model、Compare、Align、Deliver、Archive）的并行执行。
- 数据回写：将执行结果、验证日志推送至 memory-bank 与方法论中心，保持知识闭环。

## 9. 治理指标

- **可靠性**：执行成功率、平均恢复时间、Hook 失败率。
- **效率**：任务拆解时间、Agent 响应时间、资源利用率。
- **知识沉淀**：互链更新率、TODO 关闭率、方法论复用率。
- **安全性**：权限申请命中率、越权尝试数、敏感操作审计覆盖率。

## 10. 执行流水线示例

### 10.1 城市房价情报流水线
1. **Collect**：UserPromptSubmitHook 识别房价任务 → Agentic Search 抓取本地研究报告，Edge 层 `tavily-search` 拉取最新新闻。  
2. **Model/Plan**: PreToolUseHook 申请 `analytics-engine` 与 `python-sandbox`，生成预测指标与脚本清单。  
3. **Do**: Subagent `housing-analyst` 在 `python-sandbox` 运行价格回归模型；PostToolUseHook 根据误差评分自动重训或降级。  
4. **Deliver**: StopHook 校验 Summary、互链，成果写入 `📚 知识管理方法论` 对应档案。

### 10.2 VC 投资策略流水线
1. **Collect**：加载 `💰 投资决策方法论/专项方法论/VC投资策略对比...`，并用 MCP `database-tools` 取出基金数据。  
2. **Model/Plan**：PreToolUseHook 审批 `code-interpreter` 生成估值模型，Subagent `vc-researcher` 制定 Compare 框架。  
3. **Do**：执行 `git-mcp` 同步投资模型脚本，PostToolUseHook 评估方案成功率与风控阈值。  
4. **Deliver**：StopHook 推送结果至 memory-bank、更新投资方法论 README，并触发 BMAD Monitor 记录风控指标。

### 10.3 技术栈演进流水线
1. **Collect**：UserPromptSubmitHook 标记为技术研究，Subagent `tech-scout` 调用 `firecrawl`/`jina-reader` 抓最新文档。  
2. **Model/Plan**：PreToolUseHook 申请 `workspace-filesystem`、`code-interpreter`，生成 POC 计划。  
3. **Do**：Automation Steward 通过 Agent SDK 执行脚本、运行性能测试；PostToolUseHook 收集吞吐/延迟指标。  
4. **Deliver**：StopHook 输出技术评估报告，并在 `🛠️ 技术开发方法论` 添加互链。

## 11. 后续工作
- 与 BMAD 质量看板联动：将 Hook/工具指标汇聚至 `bmaddash/metrics`，设置 SLA 告警和回滚剧本。

> 如需更新，请同步《ClaudeCode 全局设计哲学》、方法论索引与相关 README，确保设计/实现文档一致。
