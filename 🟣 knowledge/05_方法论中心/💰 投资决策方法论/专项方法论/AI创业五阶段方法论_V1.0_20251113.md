---
title: "AI创业五阶段方法论（AI-Native Startup Playbook）"
owners:
  - LaunchX Knowledge Lab
status: active
last_update: 2025-11-13
related:
  - "../../README.md"
  - "../../RULES.md"
  - "../../../dev-docs/<project>/plan.md"
source: "Lovable《The AI Playbook for Founders》+ LaunchX Dev Docs 映射实践"
impact: "为AI创业类项目提供五阶段执行框架，并与Dev Docs三文件形成闭环"
tags:
  - AI创业
  - 方法论
  - DevDocs映射
---

# AI创业五阶段方法论 · LaunchX Dev Docs映射版

> 核心思路：将 Lovable 发布的《The AI Playbook for Founders》五个阶段，转译为 LaunchX 5步认知 × Dev Docs 的可执行手册，保证每个阶段都能在 `dev-docs/<project>/plan.md / context.md / tasks.md` 中有对应落点[[RULES.md:174]][[RULES.md:207]]。

## 0. 方法论速览

| 阶段 | 主要目标 | 关键动作 | Dev Docs映射 | 验收指标 |
| --- | --- | --- | --- | --- |
| Phase 0 Problem | 验证“值得解决的痛点” | 100+ 深访、付费意愿验证、绝望语料 | `plan.md` 记录目标/风险；`context.md` 记录访谈证据 | ≥3 个付费中的真实痛点 |
| Phase 1 Launch | 72 小时拿到法人+银行+能收款的 MVP | Stripe Atlas、Mercury、Lovable V1 | `tasks.md` 写明注册 & 财务流水线；`context.md` 同步系统架构 | 首笔真实收费或意向金 |
| Phase 2 Believers | 构建“内容→漏斗→付费”闭环 | 日更内容、单页漏斗、逐个访谈 | `plan.md` 更新增长假设；`tasks.md` 建内容流水线 | 落地页转化 ≥10%，20+ 高频反馈 |
| Phase 3 PMF | 以留存和盈利验证产品市场匹配 | 日迭代、留存看板、默认活着 | `context.md` 维护指标板；`plan.md` 记录风险 & 缓解 | 30日留存 ≥40%，毛利为正 |
| Phase 4 Scale | 多渠道增长且保持用户亲密度 | SEO/联盟/付费实验、用户办公小时 | `tasks.md` 标记各渠道实验 & 回滚；`context.md` 跟踪依赖 | CAC < LTV/3，周营收持续上升 |

来源：Lovable《The AI Playbook for Founders》公开网页（ai-native-startup-playbook.lovable.app）

---

## 1. 原则与准备

1. **五步认知 × 五阶段映射**  
   - Collect：Phase 0 的问题验证结果写入 `plan.md` 目标区，并在 `context.md` 记录访谈素材[[RULES.md:174]]。  
   - Model：Phase 1/2 形成的任务拆解直接输出到 `tasks.md`，同步依赖。  
   - Compare & Align：在 Phase 3 评估 PMF 假设时，一律回写 `plan.md` 的方案对比、验收标准[[RULES.md:207]]。  
   - Deliver：Phase 4 的渠道实验必须三文件同步更新，保证可追溯。
2. **路径统一与引用闭环**  
   - 所有外部脚本、模板先在 `memory-bank/support_modules/knowledge/` 检查路径对齐[[🛠️ 系统管理/memory-bank/README.md:17]]；缺口以 “TODO｜待补充 + 来源” 记录。  
   - 新建方法论一旦落地，需在 `README.md`/`mapping.md` 更新互链，确保七大域导航可达。
3. **最小可行 Dev Docs 初始化**  
   - Level M/L 的 AI 创业项目默认需要 `dev-docs/ai-startup-playbook/` 目录，含 plan/context/tasks/README 四件套[[RULES.md:198]]。  
   - 若用户仅索要方法论，可在 Summary 中提醒由项目Owner初始化 Dev Docs，再按本文件执行。

---

## 2. Phase 0｜Problem 深潜

**目标**：在投入资源前确认“痛点 + 付费 + 绝望语境”。  
**关键动作（结合 Lovable Playbook）**：
1. 忘掉解决方案，沉浸痛点；只采访（不少于）100 位潜在用户。
2. 查找聚集地：Discord/Reddit/行业群，抓取原话。
3. 询问“目前怎么解决/是否付费”，若答案为“没有付费”则降低优先级。
4. 形成“绝望语料库”作为产品文案与优先级依据。

**Dev Docs映射**  
- `plan.md`：记录目标客户画像、痛点、判断标准、对照表。  
- `context.md`：粘贴代表性访谈摘要与音视频/表单链接。  
- 质量门槛：访谈样本、付费证据缺一不可；缺口以 TODO 形式列出并指派负责人。

**验收**  
- ≥3 个愿意付款的真实案例 + 对应替代方案成本描述。  
- 绝望语料覆盖“触发场景 / 期望结果 / 阻碍”三段式。

---

## 3. Phase 1｜Launch Weekend

**目标**：72 小时完成 “注册 → 银行 → 可收款 MVP”。  
**关键动作**（参考 Lovable Playbook）：
1. **Incorporate**：用 Stripe Atlas 或本地代理完成 Delaware C-Corp，相关文件即刻上传 `dev-docs/.../assets`。  
2. **Banking**：通过 Mercury 申请账户，若 EIN 未到可先 KYC；将卡片和预算写入 `tasks.md`。  
3. **Build MVP**：使用 Lovable 一键生成功能 Demo，最少实现“支付 + 核心任务”闭环。

**Dev Docs映射**  
- `tasks.md`：列出注册、银行、产品三条流水线，附 Responsible & Deadline。  
- `context.md`：同步技术栈、第三方服务、API Key 管理策略。  
- `plan.md`：新增“首单指标”与风险矩阵（如合规、KYC、限额）。

**验收**  
- 完成首笔真实收费或已收意向金（截图 + 交易ID）。  
- MVP 代码仓库/环境在 `context.md` 明确指向，支持随时恢复。

---

## 4. Phase 2｜Find Your First Believers

**目标**：让内容飞轮驱动首批付费信徒。  
**关键动作**：
1. **Create content relentlessly**：围绕 Phase 0 的绝望语料日更（视频/线程/文章）。  
2. **Drive to a simple funnel**：所有内容归到单一 landing page → Stripe Checkout。  
3. **Talk to every user**：创始人亲自访谈、记录反对意见与语言。

**Dev Docs映射**  
- `plan.md`：列出内容主题、转化假设、KPI（关注→注册→付费）。  
- `tasks.md`：搭建内容日历、落地页迭代、客服/访谈安排。  
- `context.md`：沉淀用户语料库，@引用 Phase 0 访谈方便追溯。

**验收**  
- Landing Page 转化率 ≥10%；累计 ≥20 条高质量反馈在 `context.md`。  
- 对每条反馈给出状态（已转需求/观察/弃用），保持追踪。

---

## 5. Phase 3｜Iterate to Product-Market Fit

**目标**：通过留存 & 现金流确认 PMF。  
**关键动作**：
1. **Act fast**：基于用户反馈每日迭代；任务走看板。  
2. **Measure retention**：建立 30 日留存、活跃率、营收指标看板。  
3. **Default to profitability**：控制烧钱率，做到 “Default Alive”。

**Dev Docs映射**  
- `context.md`：嵌入指标面板链接（Looker/Notion/Sheet），记录关键迭代。  
- `plan.md`：更新 PMF 假设、风险与缓解策略。  
- `tasks.md`：明确迭代节奏（如每日站会 → 上线 → 复盘）。  
- 若触达 Level L，需在 `plan.md` 附 Dev Docs 初始化检查清单，防止遗漏[[RULES.md:229]]。

**验收**  
- 30 日留存 ≥40%，高留存用户的使用路径被记录。  
- 毛利为正或手头现金 ≥6 个月 runway。

---

## 6. Phase 4｜Pour Fuel on the Fire

**目标**：在保持用户亲密度的同时扩张渠道。  
**关键动作**：
1. **Scale growth engine**：内容飞轮升级为多渠道（SEO/联盟/付费）。  
2. **Expand channels**：为每个渠道设定 CAC、LTV、回收期，按周复盘。  
3. **Stay close to users**：创始人保留“用户办公小时”，持续访谈。

**Dev Docs映射**  
- `tasks.md`：为每个渠道建立实验卡片（目标、预算、回滚）。  
- `context.md`：跟踪合作方、合规、依赖；一旦需 Hooks/MCP 支持，在 Summary 标注待 Claude。  
- `plan.md`：同步增长节点、筹资窗口、退出指标。

**验收**  
- 新渠道 CAC < LTV/3，且周营收持续走高。  
- 仍保持每周用户访谈记录，防止失去需求洞察。

---

## 7. Dev Docs & Governance Checklist

1. **Plan.md**：阶段目标、KPI、风险矩阵、验收标准（Collect/Compare/Align 输出）。  
2. **Context.md**：访谈原话、技术栈、合作伙伴、指标看板、决策记录（Collect/Model 输出）。  
3. **Tasks.md**：阶段任务拆解、负责人、依赖、质量检查（Model/Align 输出）。  
4. **README.md**：项目概览、恢复指南、互链（Deliver 输出）。  
5. **Summary 要求**：每次迭代后以 “Summary / Testing / Next Steps” 模板同步状态，并写明是否需要 Claude/BMAD 支援。  
6. **路径检查**：若引用 memory-bank 或 support_modules，遵守路径对齐零容忍原则[[🛠️ 系统管理/memory-bank/README.md:33]]。

---

## 8. 指标与风险

| 模块 | 指标 | 风险 | 缓解 |
| --- | --- | --- | --- |
| 问题验证 | 访谈数量、付费证据 | 样本失真 | 多渠道抽样 + 交叉验证 |
| 启动周末 | 注册/开户/MVP SLA | 合规延迟 | 并行推进、预备本地法人方案 |
| 信徒构建 | Landing Page 转化、反馈数 | 内容耗尽 | 以 Phase 0 语料 + 用户故事复用 |
| PMF | 留存、毛利、Runway | 数据散落 | 指标统一写入 `context.md` 并自动更新 |
| 扩张 | CAC、LTV、周营收 | 渠道黑盒 | 预设回滚脚本，所有实验入档 |

---

## 9. 沉淀与互链

1. 将本方法论加入 `README.md` 目录示例/`mapping.md` 的“专项方法论”节点，方便检索。  
2. 当项目完成任一阶段复盘时，将经验回写到 `memory-bank/support_modules/knowledge/`，并在 Summary 标记“互链已更新”。  
3. 若需 Claude 触发 Skills/MCP，例如自动生成访谈脚本或内容排程，必须在 Summary 中写明“待 Claude：<指令 + 风险>”，并记录期望输出路径。  
4. 大体量的 AI 创业研究或客户交付，应把核心结论同步 `🚀 Launchx业务服务` 目录，对应业务线可直接复用。

---

**Ready to run the playbook?**  
把本文件当作 `dev-docs` 的宏观模板：每当阶段切换，先在 Summary 更新状态，再同步到三文件，最后才执行下一步。这样既复用了 Lovable 创始人的实战经验，也确保 LaunchX 的 Dev Docs 体系始终可追溯。祝早日打造 “One-person Unicorn”！
