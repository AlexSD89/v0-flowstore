---
title: "知识域 RULES"
owners:
  - "LaunchX Knowledge Lab"
status: "active"
last_update: "2025-10-12"
related:
  - "./README.md"
  - "./CLAUDE.md"
  - "./AGENTS.md"
source: "自动生成（Codex CLI）"
impact: "保障知识资产质量与追溯"
---

# 知识域 RULES

## 必做事项
- 进入知识域的所有文档必须补齐 frontmatter，并注明“自动生成 / 人工采集”。
- 输出前执行五通道校验：来源、时效、权威性、交叉验证、趋势洞察。
- 生成结论需记录引用路径，更新 README / memory-bank 索引并在 Summary 声明“已回写”。
- 重要方法论或模板调整后同步 `memory-bank/support_modules/knowledge/USEME.md` 与根级指挥文档。
- `🤖 AI生成 auto-generated/日期` 仅作为 24h 内的缓冲区，逾期需立即归档或删除。

## 禁止事项
- 直接引用未经验证的社交媒体或二手信息；必须附交叉验证记录。
- 在知识域内存放源码或执行脚本，需转移至技术或自动化域。
- 不区分版本历史或缺失引用标注，导致追溯失败。
- 将待处理草稿长期存放于 `01_Inbox`（>24h）。

## 审核与发布
- 周报、月报需由 Knowledge Lab 负责人复核，确保趋势与判断一致。
- 对外材料需与业务/品牌负责人双重确认，补充风险提示。
- 更新完成后在 `09_周报月报` 记录本次变更与下一步行动。

## 数据与安全
- 涉及敏感数据（客户、投融资）需匿名化处理，并在文档中标注访问级别。
- 外部引用遵循版权要求，附原链接与获取方式。
- 数据脚本统一使用 `memory-bank/support_modules/knowledge` 中的工具，禁止本地私有脚本入仓。
