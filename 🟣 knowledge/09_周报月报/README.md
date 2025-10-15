---
title: "20251011-周报月报指南"
owners: ["Investment Desk", "Knowledge Lab"]
status: published
last_update: 2025-10-11
related: ["🟣 knowledge/CLAUDE.md", "support_modules/knowledge/USEME.md"]
source: ["口袋玉米投研流程", "MCP 数据抓取日志"]
impact: "规范日报/周报/月报产出，保障趋势追踪与投资决策一致性"
---

# 周报月报 · 输出指南

## 1. 目录定位
记录 AI 投资与行业趋势的日报、周报、月报，是判断→趋势→结论闭环中的“周期复盘层”。报告需可追溯到数据来源，并能驱动下一步行动。

## 2. 目录结构
| 子目录 | 说明 |
| --- | --- |
| `🎯 内部投资决策/` | 针对内部决策的日报/摘要 |
| `📊 AI投资行业信息/` | 日报/周报/月报三类输出 |
- 子目录可按年份或专项再建子文件夹，需同步更新索引。

## 3. frontmatter 模板
```yaml
---
title: "2025W30-AI投资建议周报"
owners: ["撰写人", "审核人"]
status: published | review | draft
last_update: 2025-07-28
period: daily | weekly | monthly
related: ["🟣 knowledge/02_分析与洞察/...", "🟣 knowledge/03_研究报告/..." ]
source: ["tavily-remote-mcp", "MediaCrawler", "内部数据库"]
impact: "提供投资建议 / 行业趋势 / 风险提示"
---
```

## 4. 内容结构建议
1. Summary（关键发现 / 验证方式 / 下一步）
2. 周期回顾：市场动态、融资事件、政策等
3. 趋势观察：基于 5 通道的趋势强度评级
4. 投资机会：候选项目、指标、风险评估
5. 推荐行动：调研 / 会议 / 跟踪计划
6. 数据附录：关键数据表、引用链接、脚本说明

## 5. 质量要求
- 所有数字与观点必须注明来源（`[[🟣 knowledge/01_Inbox/...]]` 或外部链接）。
- 趋势评级需引用 `02_分析与洞察` 中的计算或数据库条目。
- 执行 Summary 采用 `Summary / Testing / Next Steps` 模板，说明验证方式。
- 发布后在周会/日报中复盘执行情况，更新 `memory-bank/README.md`。

## 6. 自动化与脚本
- 可以利用 `support_modules/knowledge/USEME.md` 提供的抓取脚本、趋势计算工具。
- 通过 MCP（Tavily、Jina）更新数据；抓取结果先落地到 `01_Inbox`，再按流程转化。
- 建议开发/使用 `scripts/weekly_report_builder.py`（如存在）自动汇总指标，输出 Markdown 草稿。

## 7. 交付与归档
- 归档周期：日报/周报/月报按周期命名，超过 3 个月可移至 `archive/`。
- 对外引用需同步至 `08_知识传播与品牌/`，对客户方案需在 `🚀 Launchx业务服务/` 中登记。
- 若报告涉及敏感数据，请标注权限并存放在受限目录。

保持周期报告的结构化和可追溯性，有助于迅速识别趋势变化并驱动后续策略。***
