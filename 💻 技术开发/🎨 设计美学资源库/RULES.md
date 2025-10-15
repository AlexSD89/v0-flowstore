---
title: "设计美学域 RULES"
owners:
  - "LaunchX Design Guild"
status: "active"
last_update: "2025-10-12"
related:
  - "./README.md"
  - "./CLAUDE.md"
  - "./AGENTS.md"
source: "自动生成（Codex CLI）"
impact: "锁定设计资产的一致性与质量"
---

# 设计美学域 RULES

## 必做事项
- 所有设计文件、模板、素材需在 README 或索引补充 frontmatter 与版本号。
- 交付前与业务/技术域确认需求与使用场景，记录反馈与调整记录。
- 组件库更新需同步 design tokens、实现指导与回滚方案。
- 对外发布素材需通过品牌审核，确保版权、授权合法。
- 草稿仅可暂存于 `🤖 AI生成 auto-generated/日期`，必须在 24 小时内整理并归档。

## 禁止事项
- 未经确认修改品牌主元素（Logo、主色、字体）。
- 在仓库中存放源文件而未标注访问方式（Figma、链接、版本）。
- 直接覆盖历史素材而无版本记录。
- 将实验性视觉直接投放生产环境，未通过评审或测试。

## 审核与发布
- 新模板、设计系统扩展需由 Design Guild 审核并记录在 `README_索引.md`。
- 大型交付（品牌升级、产品视觉大改）需完成设计评审与业务/技术对齐。
- 回滚流程：保留上一版本包，明确恢复命令/操作，记录影响面。

## 资产管理
- 视觉素材使用统一命名：`YYYYMMDD-主题-版本`。
- 静态资源、字体需检查版权并声明来源。
- 与自动化脚本联动时（批量导出/转换），在 `memory-bank/support_modules/design` 登记脚本与使用说明。
