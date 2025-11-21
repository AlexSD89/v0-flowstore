---
title: "LaunchX 小红书周度内容计划模板"
owners:
  - LaunchX Tech Core
status: template
last_update: "2025-11-21"
related:
  - "./client-sdk-launchx.md"
  - "./pattern-library.md"
  - "./workflow-and-checklist.md"
  - "../xiaohongshu-data-pipeline/context.md"
source: "LaunchX Client SDK + V1 Weekly 计划文档结构 + 本轮系统设计"
impact: "为 LaunchX 小红书账号提供一个结构化的周计划模板，统一内容类型/实验/数据引用方式"
---

# LaunchX 小红书周度内容计划模板

> 使用方式：复制为 `LaunchX_Weekly_Content_Plan_YYYYWW.md` 并填写。  
> 一周结束后，可结合数据与 Experiment Log 进行复盘。

## 1. 本周基本信息

- 周次：2025年第 XX 周
- 时间范围：YYYY-MM-DD ~ YYYY-MM-DD
- Client：launch-x（LaunchX AI评测平台）

- 本周业务目标（可多选）：
  - [ ] 品牌权威建设（提高在 AI 工具评测 / Gate 解决方案领域的认知）
  - [ ] 业务线索获取（吸引企业决策者咨询 / 预约评测）
  - [ ] 招聘曝光（吸引对 Gate / AI 自动化感兴趣的候选人）
  - [ ] 行业教育（为目标人群提供清晰认知框架）

- 特殊约束 / 关注点（比如某项目保密、平台风控、资源限制等）：

## 2. 内容类型配比计划（C1/C2/C3/C4）

> 内容类型定义见 `client-sdk-launchx.md` 1.4 节。

- 本周计划总发文数：

- 类型配比：
  - C1 Gate 解决方案日记：  计划 __ 条
  - C2 行业 / 分线在干啥：  计划 __ 条
  - C3 知识 / 方法论总结：  计划 __ 条
  - C4 招聘 / 团队文化：    计划 __ 条（含专门招聘贴 __ 条）

- 是否有重点项目 / 行业线：
  - 例如：本周更多聚焦「销售团队自动化」、或「AI 工具评测平台自身建设」。

## 3. 每日内容规划（草案）

> 简要列出每天的预期内容，后续用具体 Post Spec 补充细节。

### Day 1（周一）

- 目标侧重：
  - [ ] 品牌  [ ] 线索  [ ] 招聘  [ ] 行业教育
- 预期内容：
  - 类型：C1 / C2 / C3 / C4
  - 暂定主题：
  - 关联 Gate 项目 / 业务线：
  - 备注：

### Day 2（周二）

- 同上结构…

### Day 3（周三）

### Day 4（周四）

### Day 5（周五）

### Day 6–7（周末，可选）

- [ ] 本周末不发文
- [ ] 周末发文（说明类型与目标）：

## 4. 实验矩阵（本周要验证什么）

> 结合 Pattern Library 与历史数据，指定本周要重点验证的 2–3 个实验方向。

- 标题实验：
  - 例如：C1 场景中 `P-Title-03` vs `P-Title-02` 的表现；
- 结构实验：
  - 例如：C2 场景中 `P-Body-01` vs `P-Body-02`；
- 标签/Tag Engine 实验：
  - 例如：平衡型 `P-TagMode-02` vs 进攻型 `P-TagMode-03`；
- CTA 实验：
  - 例如：评论互动型 vs 私信引导型；

为每个实验记录：

- 实验编号：EXP-LX-2025-XX-XXX
- 涉及内容：对应的 Post Spec 列表
- 观察指标：曝光 / 收藏 / 评论 / 私信 / 线索 / 招聘信号等

## 5. 数据与趋势引用

> 记录本周计划制定时，参考了哪些数据与趋势快照。

- trending 学习快照：
  - 例如：`clients/launch-x/data/learning/trending_learning_20251009_212454.json`
  - 关键结论摘要：

- 质量日志 / Auto Iteration 报告：
  - 例如：`clients/launch-x/data/quality_logs/quality_log_2025-10-11.json`
  - 例如：`clients/launch-x/reports/Auto_Iteration_Report_20251009T132454Z.md`

- 其他外部情报（可由 Claude 通过 MCP/Rube 获取）：
  - 最近行业事件 / 热门话题 / 竞品动态摘要。

## 6. 周末复盘提示（占位）

> 一周结束后，可在此文件末尾补充：
> - 本周实际发文数与类型分布；
> - 不同实验结果的初步结论；
> - 下周计划需要调整的方向（内容类型配比、Pattern 默认值等）。

