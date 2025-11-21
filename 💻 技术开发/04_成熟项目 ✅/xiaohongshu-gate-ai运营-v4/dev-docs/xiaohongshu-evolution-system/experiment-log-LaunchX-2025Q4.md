---
title: "LaunchX 小红书运营实验日志 · 2025 Q4"
owners:
  - LaunchX Tech Core
status: active
last_update: "2025-11-21"
related:
  - "../xiaohongshu-ops-spec/pattern-library.md"
  - "../xiaohongshu-ops-spec/client-sdk-launchx.md"
  - "../xiaohongshu-ops-spec/workflow-and-checklist.md"
  - "../xiaohongshu-data-pipeline/02-数据留存与访问规范.md"
  - "../../../xiaohongshu_ai_automation_v1/clients/launch-x/data/learning/"
  - "../../../xiaohongshu_ai_automation_v1/clients/launch-x/data/performance/"
  - "../../../xiaohongshu_ai_automation_v1/clients/launch-x/reports/Auto_Iteration_Report_20251009T132454Z.md"
source: "V1 质量日志 + Auto Iteration 报告结构 + 本轮 LaunchX 小红书 Spec 设计"
impact: "为 LaunchX 小红书运营提供一个季度级实验记录框架，支撑 Pattern 与方法论的演化判断"
---

# LaunchX 小红书运营实验日志 · 2025 Q4

> 使用方式：每次运行实验（或一组内容）后，在本文件中追加一条记录。  
> 记录重点是「使用了哪些范式」「服务了什么业务目标」「结果如何」「下次要怎么改」。

## 1. 记录规范

- 一条实验记录可以对应：
  - 单条内容（一个 Post Spec）；
  - 或一组内容（例如同一实验编号下的多条 A/B 内容）。
- 建议以「实验编号」为一级标题，方便查找与引用。
- 实验结果可以是定量（数据）+ 定性（观察、读者反馈）的结合。

## 2. 示例：EXP-LX-2025-11-23-001（占位示例）

> 以下仅为结构示意，具体数据可在真实运行后填充或复制到此格式。

### 实验编号

- `experiment_id`: `EXP-LX-2025-11-23-001`
- 时间范围：2025-11-23 ~ 2025-11-25
- 涉及内容：
  - `post-2025-11-21-launchx-ai-tools-review.md`

### 实验设定

- 内容类型：
  - C1 Gate 解决方案日记： [ ] 是  [x] 否
  - C2 行业 / 分线日记：   [ ] 是  [x] 否
  - C3 知识 / 方法论：     [x] 是  [ ] 否
  - C4 招聘 / 团队文化：   [ ] 是  [x] 含轻触点（如有）

- 使用的范式：
  - 标题范式：`P-Title-02`（数字清单） vs `P-Title-03`（对比/踩坑）
  - 正文结构：`P-Body-01`（场景-冲突-解决-结果）
  - CTA：`P-CTA-01`（评论互动） + 可选 `P-CTA-02`（私信咨询）
  - 标签模式：`P-TagMode-02`（平衡型）
  - 内容类型：`P-Content-??`（根据实际选择补充）

- 关键假设（摘自 Post Spec）：
  - 「踩坑型标题的评论率高于数字清单型标题，但收藏率相近。」
  - 「在品牌标签不变前提下，加入热门标签 `#AI工具推荐` / `#办公神器` / `#效率提升` 能显著提升曝光和点击。」

### 数据来源

- trending 学习：
  - `clients/launch-x/data/learning/trending_learning_20251009_212454.json`
- 内容表现数据：
  - `clients/launch-x/data/performance/account_metrics_YYYYMMDD.json`（如已实现）
- 质量日志：
  - `clients/launch-x/data/quality_logs/quality_log_2025-10-11.json`

### 实验结果（示例结构）

- 标题 A/B：
  - 版本 A（数字清单）：
    - 曝光：
    - 点赞：
    - 收藏：
    - 评论：
  - 版本 B（踩坑型）：
    - 曝光：
    - 点赞：
    - 收藏：
    - 评论：
  - 初步结论：
    - 例如：版本 B 评论率确实更高，收藏差异不大，下次在 C1/C2 类型中优先试用 B 类标题。

- 标签表现：
  - 带有 `#办公神器` 的版本在曝光上是否有明显优势；
  - 是否出现了更多与「销售团队」相关的评论/私信。

- 读者反馈：
  - 评论中的典型问题/赞同点；
  - 是否有人展示实际使用案例或提出合作/求职意向。

### 后续动作

- Pattern 调整建议：
  - 是否提高某个标题/结构范式在 C1/C2 场景下的优先级；
- Client SDK 调整建议：
  - 是否在 LaunchX Weekly Plan 中增加某种内容类型的比例；
- 方法论/知识沉淀：
  - 是否值得在 `dev/` 或 Evolution 层方法论文档中补充一个专门条目。

---

## 3. 待补充实验记录

> 后续在这里按「实验编号」追加新的实验条目。

