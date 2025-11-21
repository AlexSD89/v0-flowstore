---
title: "小红书数据 Agent 与工具架构设计"
owners:
  - LaunchX Tech Core
status: active
last_update: "2025-11-21"
related:
  - "./context.md"
  - "./00-数据源与采集策略.md"
  - "./02-数据留存与访问规范.md"
  - "../../../xiaohongshu_ai_automation_v1/automation/learn_from_trending.py"
  - "../../../xiaohongshu_ai_automation_v1/docs/Dynamic_Spec_Iteration_Plan.md"
  - "../../../🧰 tools/xiaohongshu-mcp/README.md"
  - "../../../🧰 tools/weibo-public-opinion-analysis-system/README.md"
  - "../../../🧰 tools/obsidian-content-distributor/README.md"
  - "../../../🧰 tools/launchx-spec-kit-cli/README.md"
source: "V1 Agent OS 代码结构 + tools 工程 README + 本轮设计"
impact: "建立 Agent ↔ tools ↔ 数据路径的清晰映射，避免‘上层设计一套、底层实现一套’的割裂"
---

# 小红书数据 Agent 与工具架构设计

> 本文件回答：哪些 Agent 负责哪些任务？它们各自依赖哪个 tools 工程？数据写到哪里？

## 1. 核心工具集成矩阵

### 1.1 XHS 数据采集与执行工具

#### 工具：`xiaohongshu-mcp`

- 路径：`🧰 tools/xiaohongshu-mcp`
- 参考文档：
  - README：`🧰 tools/xiaohongshu-mcp/README.md:1`
  - Mac 部署说明：`🧰 tools/xiaohongshu-mcp/deploy/macos/readme.md:1`
- 角色：
  - 小红书平台的 MCP 服务端：登录、发布图文/视频、搜索内容、获取详情、评论操作等；
  - 是所有「真实对接小红书」的数据采集与发布的统一入口。
- 在本项目中的用法（规划）：
  - Data Collector Agent：根据关键词/话题/账号抓取最新内容；
  - Publisher Agent：按 Post Spec 批量发布/更新内容；
  - Health Check：检查登录态与接口状态，为 Run Checklist 提供信号。

#### 工具：`weibo-public-opinion-analysis-system`

- 路径：`🧰 tools/weibo-public-opinion-analysis-system`
- 参考文档：
  - README：`🧰 tools/weibo-public-opinion-analysis-system/README.md:1`
- 角色：
  - 舆情系统架构参考：
    - 爬取 → 情感分析 → 中文分词 → 关键词统计 → 报表输出；
  - 可迁移到小红书评论区/话题页的舆情分析设计中。
- 在本项目中的用法（规划）：
  - 定义小红书评论舆情分析的「四段式」处理管线；
  - 其代码不直接改造小红书数据，但其架构方法会被抽象到 Evolution 层方法论中。

#### 工具：`obsidian-content-distributor`

- 路径：`🧰 tools/obsidian-content-distributor`
- 参考文档：
  - README：`🧰 tools/obsidian-content-distributor/README.md:1`
- 角色：
  - Obsidian 插件：将 Markdown 笔记一键转换为小红书/即刻/X/公众号的不同平台文案；
  - 是「运营 Spec（Post Spec）」→「实际发布文案」的一个可选转换器。
- 在本项目中的用法（规划）：
  - 将 `post-*.md` 中的结构化 Spec 映射为适合小红书的平台文案；
  - 支持同一内容跨平台分发时的风格/格式差异。

#### 工具：`launchx-spec-kit-cli`

- 路径：`🧰 tools/launchx-spec-kit-cli`
- 参考文档：
  - README：`🧰 tools/launchx-spec-kit-cli/README.md:1`
- 角色：
  - 封装了 5 步认知法（Collect/Model/Compare/Align/Deliver）与 Dev Docs 三文件更新的 CLI；
  - 在本项目中用于：
    - 从「一句话 seed」生成 Client Spec 草稿；
    - 更新任务/计划/对比分析文档。

> 说明：上述工具不会在本文件中写具体命令调用方式，真实执行由 Claude 在 BMAD / MCP 层完成；本文件只负责定义角色与数据接口。

---

## 2. Agent 任务设计与工具依赖

> Agent 视作「任务角色」，负责 orchestrate 某一段业务逻辑。下面以 LaunchX 客户为例给出最小集。

### Agent: `XHS_AutoHotTopicCollector`

- 目标：
  - 每日 7:00 为指定领域（如 AI 工具评测）采集小红书热门话题/笔记 N 条；
- 依赖工具：
  - `xiaohongshu-mcp`
- 触发方式（待 Claude）：
  - 在 BMAD / 调度系统中配置定时任务，调用 `xiaohongshu-mcp` 对应的搜索/列表接口；
- 输出路径（建议）：
  - `clients/<slug>/data/intel/xhs_topics/YYYYMMDD.json`
- 与 Spec 的关系：
  - 为周计划与 Post Spec 中的「趋势依据」「选题来源」提供数据参考。

### Agent: `XHS_AccountPerformanceCollector`

- 目标：
  - 定期抓取自有账号和标杆账号的内容表现（曝光/点赞/收藏/评论等）。
- 依赖工具：
  - `xiaohongshu-mcp`
- 输出路径（建议）：
  - `clients/<slug>/data/performance/account_metrics_YYYYMMDD.json`
- 与 Spec 的关系：
  - 为 Experiment Log 与 Pattern Library 提供性能数据源。

### Agent: `XHS_CommentSentimentAnalyzer`

- 目标：
  - 对指定内容的评论区做情感分析与关键词统计。
- 依赖工具：
  - 架构参考：`weibo-public-opinion-analysis-system`；
  - 实际执行可由 BMAD + Claude 调用合适的模型/MCP 实现。
- 输出路径（建议）：
  - `clients/<slug>/data/learning/comment_sentiment_YYYYMMDD.json`
- 与 Spec 的关系：
  - 为「互动策略」与「内容优化建议」提供依据；
  - 结果可进入 Evolution 层的方法论总结。

### Agent: `XHS_TrendingLearningOrchestrator`

- 目标：
  - 学习当前爆款内容模式，更新内部 Pattern 与推荐策略。
- 现有实现参考：
  - `automation/learn_from_trending.py` 中的 `TrendingLearningOrchestrator`
    - `💻 技术开发/04_成熟项目 ✅/xiaohongshu_ai_automation_v1/automation/learn_from_trending.py:1`
- 依赖工具：
  - 数据采集：`xiaohongshu-mcp`（实际接入后）；
  - 内部算法：`RealtimeLearningEngine` / `ViralContentDetector` / `TrendAnalystAgent`（V1 中已有）。
- 输出路径：
  - `clients/<slug>/data/learning/trending_learning_*.json`
- 与 Spec 的关系：
  - 为 Post Spec 中的 `trending_snapshot_id` 字段提供值；
  - 为 Evolution 层更新 Pattern 与 Client Spec 提供依据。

---

## 3. Codex 与 Claude 的职责边界

### 3.1 Codex（本地 CLI）负责

- 在本文件中维护：
  - 工具列表及其角色描述；
  - Agent 与工具依赖矩阵；
  - 数据输出路径命名推荐。
- 在修改/新增代码时：
  - 根据新的 Agent/工具更新本文件；
  - 确保 Dev Docs 与代码实现一致。

### 3.2 Claude / Gate OS 负责

- 在 BMAD / Hooks / MCP 中：
  - 以本文件为规范，配置具体的调用命令与调度策略；
  - 处理实际的网络请求、登录态、失败重试等。
- 在运行后：
  - 将日志与关键结果按本文件约定落盘；
  - 在 Summary 或 Evolution 文档中记录「已执行的 Agent + 输入输出位置」。

