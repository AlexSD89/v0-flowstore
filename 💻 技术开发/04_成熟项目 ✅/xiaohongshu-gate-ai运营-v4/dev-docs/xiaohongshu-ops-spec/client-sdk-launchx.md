---
title: "LaunchX AI评测平台 · Client SDK 规格说明"
owners:
  - LaunchX Tech Core
status: active
last_update: "2025-11-21"
related:
  - "./README.md"
  - "../../../xiaohongshu_ai_automation_v1/clients/launch-x/README.md"
  - "../../../xiaohongshu_ai_automation_v1/clients/launch-x/strategy/launch-x_project_spec.md"
  - "../../../xiaohongshu_ai_automation_v1/clients/launch-x/strategy/launch-x_brand_constitution.md"
  - "../../../xiaohongshu_ai_automation_v1/clients/launch-x/strategy/SEO_LaunchX_Brand_Integration_Strategy_2025-09-25.md"
  - "../../../xiaohongshu_ai_automation_v1/docs/Dynamic_Spec_Iteration_Plan.md"
  - "../../../xiaohongshu_ai_automation_v1/clients/launch-x/execution/launch-x_run_checklist.md"
source: "V1 launch-x 客户文档 + Agent OS v4.0 设计 + 本轮对话整合"
impact: "为 Claude / Gate OS 提供一个可直接加载的 LaunchX 客户 SDK 规范，统一描述/计划/执行/演化接口"
---

# LaunchX AI评测平台 · Client SDK 规格说明

> 视角：本文件是 Gate OS / Claude 在加载 `launch-x` 客户时的「客户端 SDK 说明书」。  
> 目标：让 Claude 只需理解本文件和相关路径，就能围绕 LaunchX 客户完成「理解 → 计划 → 执行 → 学习」。

## 1. Client 基本信息与业务目标（Describe）

### 1.1 Client 标识

- `client_slug`: `launch-x`
- 业务域：企业级 AI 工具评测平台（Rube 复刻双边市场）
- 主运营平台：小红书（评测号 + 品牌号），辅平台：微博 / B站 / 公众号

### 1.2 项目与场景

- 项目 Spec：`launch-x_project_spec.md`
  - 路径：
    - `💻 技术开发/04_成熟项目 ✅/xiaohongshu_ai_automation_v1/clients/launch-x/strategy/launch-x_project_spec.md:1`
  - 关键信息：
    - 核心场景：AI 功能深度评测 / 企业选型指导 / 生态合作撮合
    - 重要约束：T0+90 天三阶段里程碑，人工审核 ≤ 1 人天/周，小红书为主阵地

- 品牌宪章：`launch-x_brand_constitution.md`
  - 路径：
    - `.../clients/launch-x/strategy/launch-x_brand_constitution.md:1`
  - 关键信息：
    - 品牌定位：AI 自动化 / 数字化决策者
    - 语调：权威、可信、专业；Emoji 使用上限；禁止表达（如「割韭菜」）
    - 视觉风格：赛博蓝 + 清晨暖光，中心主体 + 留白
    - 质量与合规：内容长度、图片尺寸、敏感话题审核要求

### 1.3 成功指标 & 时间线

- 总览：`clients/launch-x/README.md`
  - 路径：
    - `.../clients/launch-x/README.md:1`
  - 主要 KPI：
    - 供给侧：50+ AI 公司集成 MCP；
    - 需求侧：200+ 企业/个人用户使用评测平台；
    - 权威性：AI 工具评测标准制定者；
    - 商业：3/6/12 个月 GMV 与生态目标。

- Runbook 中的阶段划分：
  - 系统部署 → 权威建设 → 转化优化（参见 `launch-x_implementation_plan.md`）。


### 1.4 LaunchX 小红书账号内容任务拆分

- 内容任务类型（供 Post Spec 使用）：
  - C1 Gate 解决方案日记（Gate Solution Diary）：
    - 讲真实 Gate 项目 / 自动化方案落地的故事，用于展示解决复杂问题的能力。
  - C2 行业 / 分线在干啥（Industry / Line Diary）：
    - 围绕某个行业 vertical 或内部业务线，记录「最近行业发生了什么」以及「我们在这一条线上的观察与动作」。
  - C3 知识 / 方法论总结（Knowledge / Playbook）：
    - 将评测/项目中的经验抽象为框架/步骤/清单，方便读者直接应用。
  - C4 招聘 / 团队文化（Recruiting / Team Story）：
    - 介绍团队、项目和岗位机会，通常以轻触点方式出现在 C1/C2/C3 结尾，辅以少量专门招聘贴。

- 周级规划建议（示例）：
  - 每周至少保持：
    - 1–2 条 C1 Gate 日记；
    - 1–2 条 C2 行业/分线日记；
    - 视情况补充 C3 知识类长文与 1 条 C4 招聘索引贴。

- 与 Pattern Library 的关系：
  - C1 默认优先使用 `P-Content-01` 及其推荐的标题/正文/CTA/标签组合；
  - C2 默认优先使用 `P-Content-02` 及其推荐组合；
  - C3/C4 可根据实验数据在 Evolution 层逐步补充新的内容范式。

Claude 在「理解 LaunchX 客户」时，默认先加载以上三个文档，并在小红书运营相关任务中持续引用。

---

## 2. 策略与计划接口（Plan API）

## 1.5 Search Spec（对标与范式发现）

> 说明：LaunchX 小红书的内容与场景选择，必须以「外网对标 + 本地经验」为基础。
> 本节定义每次策划新系列/新场景/新贴子前的**搜索与对标步骤**，避免完全凭直觉选题。

- 对标对象（Who）：
  - Primary：
    - n8n（开源工作流自动化标杆）
  - Secondary：
    - 其他自动化/工作流工具：Make、Zapier、Notion Automation 等；
    - 国内/行业内类似的企业自动化、AI 工作流产品（后续可按需补充名单）。

- 搜索渠道（Where）：
  - 小红书：
    - 关键词：`n8n`、`自动化工作流`、`低代码自动化`、`无代码自动化`、`内容自动化`、`客服自动化` 等；
    - 关注指标：点赞、收藏、评论数量与评论质量。
  - 其他公开渠道：
    - n8n 官方社区/模板市场/博客/YouTube；
    - 相关技术博客/论坛/社群中关于自动化工作流的讨论。

- 时间窗口（When）：
  - 默认：最近 90 天内的内容与讨论；
  - 如需观察长期趋势，可查看 6–12 个月的热门场景变化。

- 评估指标（What is “best”）：
  - 内容/场景是否被频繁使用或讨论（模板数量、使用量、转载量）；
  - 是否与 LaunchX 目标人群高度相关（企业决策者、产品/运营/工程、对 AI/自动化敏感的人群）；
  - 是否有清晰的业务闭环（痛点 → 流程 → 结果），便于 Gate 做复刻与超越。

- 抽象输出（What we learn）：
  每次搜索完成后，建议在内部记录以下信息（可写入 Evolution 层或 dev 文档）：
  - 热门场景列表（例如：客服自动化、内容自动化、电商订单、潜客开发等）；
  - 代表性内容/模板的写法模式：标题结构、正文结构、CTA 方式、标签组合；
  - 对 Gate 而言可复刻/可超越的关键点。

- 对 Gate 场景日记的作用：
  - 场景选择：在候选池中优先选择最近 3 个月在 n8n/竞品里表现好的场景，作为 Gate 场景日记的主题；
  - 写法选择：将优秀对标的叙事方式转化为 Pattern（标题/结构/CTA/标签），再用 Gate/LaunchX 的视角做调整。



> Plan API 负责从 PRD、品牌宪章、SEO 策略、数据反馈中生成「周/月级计划」与「实验矩阵」。

### 2.1 策略文档入口

- 客户运营策略：
  - `LaunchX首个客户专属方案_AI评测平台运营策略_2025-01-22.md`
  - `LaunchX_AI评测平台运营策略_2025-09-24_193800.md`

- 品牌整合与 SEO 策略：
  - `SEO_LaunchX_Brand_Integration_Strategy_2025-09-25.md`
    - 路径：
      - `.../clients/launch-x/strategy/SEO_LaunchX_Brand_Integration_Strategy_2025-09-25.md:1`
    - 提供 4 层标签体系 + 组合模式（保守/平衡/进攻） + A/B 测试建议。

- Weekly Plan 与数据记录：
  - `docs/LaunchX_Weekly_Content_Plan_Data_Record_2025-09-24.md`
  - `docs/LaunchX_Weekly_Automation_Status_2025-09-24.md`

### 2.2 对 Claude 的 Plan API 约定

当 Claude 需要为 LaunchX 生成/更新周计划时，应执行：

1. **收集输入**：
   - PRD / 客户画像：`LaunchX_AI_Evaluation_Platform_PRD_2025-01-25.md`
     - 路径：`.../clients/launch-x/docs/LaunchX_AI_Evaluation_Platform_PRD_2025-01-25.md`
   - 品牌宪章：`launch-x_brand_constitution.md`
   - SEO 策略：`SEO_LaunchX_Brand_Integration_Strategy_2025-09-25.md`
   - 上一周期表现：`LaunchX_Content_Performance_*.md`（如存在）
   - Trending 学习结果：`clients/launch-x/data/learning/trending_learning_*.json`
   - 质量日志：`clients/launch-x/data/quality_logs/*.json`

2. **生成周计划草稿**：
   - 输出目标：
     - 本周重点目标（2–3 条）；
     - 每天的内容数量/类型（评测/对比/故事/干货）；
     - 实验矩阵（本周要验证哪些范式/标签组合/发布时间）；
   - 建议写入：
     - `docs/LaunchX_Weekly_Content_Plan_Data_Record_<date>.md`

3. **显式引用 SEO 与范式**：
   - 在周计划中，要写明：
     - 使用哪一种标签组合模式为主（保守/平衡/进攻）；
     - 将重点测试哪几种标题/结构范式；
     - 哪些观测指标决定下周是否切换策略。

Plan API 只改文档与配置，不直接触发执行脚本。

---

## 3. 执行接口（Run API）

> Run API 将策略/模板转化为自动化执行。

### 3.1 核心执行入口

- 单 Client 执行：

```bash
python automation/run_client.py --client launch-x
```

- Dry run：

```bash
python automation/run_client.py --client launch-x --dry-run
```

- 对应 Runbook：
  - `execution/launch-x_run_checklist.md`
    - 路径：`.../clients/launch-x/execution/launch-x_run_checklist.md:1`

### 3.2 Run 前置条件（Claude 视角）

在 Gate OS / BMAD 调度中，只有满足以下条件时，才可以调用 Run API：

1. Client 配置就绪：
   - `client-config.json` 中的基础字段已填完整；
   - `claude_task_file` 指向正确的 Claude 任务定义（如 `automation/claude_tasks/launch-x.yaml`）。

2. 当日/本批次的 Post Spec 已准备：
   - 对于将要发布的每一篇内容，应存在一份 Post Spec：
     - `dev-docs/xiaohongshu-ops-spec/post-YYYYMMDD-<slug>.md`
   - Post Spec 中的标题/结构/标签/实验设定字段不为空。

3. 环境与依赖通过 Run Checklist：
   - Claude 根据 `launch-x_run_checklist.md` 检查：
     - Claude CLI / MCP 是否配置；
     - `xiaohongshu-mcp` 是否登录；
     - Rube 工作流是否注册；
     - 数据与产出目录是否可写。

### 3.3 执行后的产出路径

- 情报数据：`clients/launch-x/data/intel/`
- 内容草稿：`clients/launch-x/data/drafts/`
- 生成素材：`clients/launch-x/assets/generated/`
- 质量日志：`clients/launch-x/data/quality_logs/`
- 性能数据（如已实现）：`clients/launch-x/data/performance/`

Run API 本身不做决策，只按既定配置和 Spec 执行，并确保所有数据落盘到上述目录，为 Evolve API 提供输入。

---

## 4. 学习与演化接口（Evolve API）

> Evolve API 负责从实际表现中学习，并更新 Spec / 模板 / Pattern Library。

### 4.1 Trending 学习

- 学习脚本：`automation/learn_from_trending.py`
  - 路径：`💻 技术开发/04_成熟项目 ✅/xiaohongshu_ai_automation_v1/automation/learn_from_trending.py:1`
  - 主要职责：
    - 收集小红书爆款数据（当前是模拟，未来接入 `xiaohongshu-mcp`）；
    - 使用 ViralContentDetector / TrendAnalystAgent 分析模式；
    - 更新 RealtimeLearningEngine 状态；
    - 输出 `trending_learning_*.json` 与建议。

- 数据输出：`clients/launch-x/data/learning/trending_learning_*.json`

Claude 调用 Evolve API 时，应：

1. 运行或触发 `learn_from_trending.py`（或对应 BMAD/MCP 工作流）；
2. 将结果摘要写入：
   - Evolution 层文档（未来：`dev-docs/xiaohongshu-evolution-system/`）；
   - 周计划文档的「趋势依据」章节。

### 4.2 动态 Spec 迭代

- 参照文档：`docs/Dynamic_Spec_Iteration_Plan.md`
  - 路径：`💻 技术开发/04_成熟项目 ✅/xiaohongshu_ai_automation_v1/docs/Dynamic_Spec_Iteration_Plan.md:1`

- 关键脚本：
  - `automation/update_spec_from_feedback.py --client launch-x`
    - 读取 `status.json`、质量日志、执行结果；
    - 生成 `Auto_Iteration_Report_<timestamp>.md`；
    - 提出「更新标题/结构/标签/发布时间」等建议。

Claude 在执行 Evolve API 时要做的：

1. 读取最新一轮 Run 的日志与性能数据；
2. 调用/请求 `update_spec_from_feedback.py` 生成迭代报告；
3. 将关键建议落入：
   - Pattern Library（例如标记某些范式为高/低表现）；
   - Client Spec（例如更新「推荐标签组合模式」）；
   - Post 模板（例如新的标题范式例句）。

---

## 5. Pattern 与 Tag Engine（内容与标签范式）

> Pattern / Tag Engine 是 Client SDK 的「知识核心」。LaunchX 已有一套标签体系和部分内容范式，是后续所有内容生成与实验的基础。

### 5.1 标签引擎（Tag Engine）

- 定义文档：`SEO_LaunchX_Brand_Integration_Strategy_2025-09-25.md`
- 四层结构：
  1. 品牌核心标签（必选，如 `#LaunchX`、`#LaunchX评测`）；
  2. 功能定位标签（如 `#AI工具评测`、`#效率工具测评`）；
  3. 热门流量标签（如 `#AI工具推荐`、`#办公神器`、`#效率提升`）；
  4. 长尾精准标签（行业 + 功能 + 场景）。

- 组合模式：
  - Conservative / Balanced / Aggressive 三种；
  - 每种模式对应不同的品牌/流量平衡策略。

### 5.2 内容范式（Pattern Library）

- V1 中的部分范式散落在：
  - `LaunchX_XHS_Publication_Success_Record_2025-09-24.md`
  - `LaunchX_XiaoHongShu_Architecture_Analysis_Report_2025-09-24.md`
  - SEO 策略文档的「内容质量升级策略」中。

- 后续演化方向：
  - 将这些范式整理到 `dev-docs/xiaohongshu-ops-spec/pattern-library.md`；
  - 以 ID 形式在 Post Spec 中引用，例如：
    - `P-Title-02: 数字清单型标题`
    - `P-Body-01: 场景-冲突-解决-结果结构`
    - `P-CTA-01: 评论互动型 CTA`。

Claude 在生成内容或优化策略时，应优先尝试使用现有 Pattern，并在 Experiment Log 中记录 Pattern ID 与表现，为 Evolve API 提供依据。

---

## 6. 总结：Claude 如何「加载」 LaunchX Client SDK

1. **初始化（一次性）**：
   - 读取本文件 + 相关 `related` 文档；
   - 建立对 LaunchX 客户的内部表示（业务目标、品牌约束、标签引擎）。

2. **每周开始前**：
   - 调用 Plan API：
     - 结合 PRD / 品牌 / SEO / trending/quality 日志，输出本周计划；
   - 更新/生成若干 Post Spec 草稿（本周的候选内容）。

3. **每天执行时**：
   - 对每一条要发布的内容：
     - 读取/填充 Post Spec；
     - 应用 Pattern 与 Tag Engine；
     - 调用 Run API 进行自动化发布；
     - 将结果写回 data/ 与 logs/。

4. **周期性学习**：
   - 调用 Evolve API：
     - 跑 trending 学习脚本；
     - 跑 update_spec_from_feedback 脚本；
     - 更新 Pattern Library 与 Client Spec。

从 Gate OS 的角度看：
- `clients/launch-x` 是一个具备清晰接口的 SDK；
- `xiaohongshu-gate-ai运营-v4/dev-docs/xiaohongshu-ops-spec/` 提供了 SDK 规范与 Post Spec 模板；
- `🧰 tools` 下的各工具工程是具体的 Skills/MCP 实现；
- Claude 通过 Skills/Hooks 调度这些组件，即可完成从「一句话诉求」到「持续自动化运营」的闭环。

