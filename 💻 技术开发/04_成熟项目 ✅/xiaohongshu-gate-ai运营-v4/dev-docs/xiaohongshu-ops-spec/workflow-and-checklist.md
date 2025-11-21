---
title: "小红书运营执行工作流与质量检查清单"
owners:
  - LaunchX Tech Core
status: active
last_update: "2025-11-21"
related:
  - "./README.md"
  - "./post-template.md"
  - "./client-sdk-launchx.md"
  - "../../../🧰 tools/obsidian-content-distributor/README.md"
source: "V1 LaunchX 客户执行方案 + 本轮文档设计"
impact: "为日常小红书运营提供可执行的 Daily/Weekly 工作流与质量检查清单，并集成现有工具链"
---

# 小红书运营执行工作流与质量检查清单

> 视角：运营实操 + Claude/Gate OS 调度。  
> 目标：让「每天/每周要做什么」「写一篇笔记之前必须检查什么」清晰可见，且能调用现有工具。

## 1. 每日工作流（Daily Loop）

1. **读取当前 Client SDK 与目标**
   - 打开对应 Client 的 SDK 文档（如：`client-sdk-launchx.md`）。
   - 明确今天的重点目标（例如：哪条 KPI、哪个实验）。

2. **准备当日 Post Spec**
   - 根据周计划，确定今日要产出的笔记数量与主题。
   - 对每条内容：
     - 复制 `post-template.md` → `post-YYYYMMDD-<slug>.md`；
     - 填写基本信息、标题候选、结构、标签模式、实验设定。

3. **Collect（数据收集）**
   - Claude：
     - 根据 Data Pipeline 设计，运行必要的数据采集与 trending 学习任务；
     - 更新 `clients/<slug>/data/intel` 与 `data/learning`；
   - Codex：
     - 在 Post Spec 中填入 `trending_snapshot_id` 等字段。

4. **Align（范式与策略对齐）**
   - 为每条 Post Spec 选择合适的标题/正文/CTA 范式 ID；
   - 根据 Client SEO 策略文档，确定标签组合（品牌/功能/热门/长尾）。

5. **Deliver（内容生成与分发）**
   - 方式 A：直接由 Claude 生成文案（基于 Post Spec）；
   - 方式 B：配合 Obsidian 插件 `obsidian-content-distributor`：
     - 在 Obsidian 中打开对应 Post Spec；
     - 使用插件选择「小红书模式」生成初稿；
     - 人工微调后，将最终文案粘回 Post Spec 的「实际发布版本」区域（可在未来扩展字段）。

6. **发布与记录**
   - Claude：通过 `xiaohongshu-mcp` 或既有自动化脚本发布内容；
   - Codex：
     - 在 Post Spec 中记录发布时间、链接、初步表现（T+24h）；
     - 更新可能的 Experiment Log（演化层）。

## 2. 每周工作流（Weekly Loop）

1. **周初：制定 Weekly Plan**
   - Claude：根据 Client SDK 中的 Plan API：
     - 读取 PRD、品牌宪章、SEO 策略、最近一周 performance/learning 数据；
     - 在 Weekly Plan 文档中写入本周目标与选题/实验矩阵。

2. **周中：趋势与实验中期复盘**
   - 观察本周已发布内容的中期表现；
   - 若有明显偏差（某类范式性能很差），可临时调整后续几天的 Post Spec 策略。

3. **周末：周报与演化**
   - 生成当周的 Auto Iteration 报告与 Summary；
   - 根据报告更新：
     - Pattern Library 中范式权重；
     - Client SDK 中的推荐标签/结构策略。

## 3. 小红书笔记质量检查清单（Quality Checklist）

> 写完或生成初稿后，必须过一遍本清单。

### 3.1 结构与格式

- [ ] 标题长度在 20–30 字之间，且不堆叠无意义关键词；
- [ ] 标题符合选定的范式（如 P-Title-02 数字清单型）；
- [ ] 第一屏（前 2–3 行）明确：为谁解决什么问题；
- [ ] 正文分为 3–5 段，每段不超过 3 行；
- [ ] 使用合适的小标题，而非整块长段；
- [ ] Markdown 预览无明显错位/乱码。

### 3.2 内容与认知

- [ ] 至少包含一个具体场景（时间/地点/人物）；
- [ ] 明确描述冲突/问题，而非空泛口号；
- [ ] 给出可以执行的步骤或 checklist；
- [ ] 包含结果/反馈或合理的预期效果；
- [ ] 语气与品牌宪章一致，未触碰禁忌表达。

### 3.3 视觉与标签

- [ ] 封面图焦点明确、不杂乱，分辨率与比例符合小红书要求；
- [ ] 封面文案（如有）不超过 20% 画面；
- [ ] 标签组合符合 Tag Engine 规则（品牌/功能/热门/长尾配比合理）；
- [ ] 标题与正文自然融入品牌与功能关键词，而非纯刷标签。

### 3.4 实验记录

- [ ] Post Spec 中的实验类型与假设已填写；
- [ ] 明确本次实验的对照组/基线（如有）；
- [ ] 计划在 T+24h/T+7d 回看表现并记录到 Experiment Log。

