---
title: "USEME"
owners:
  - LaunchX Claude Team
status: active
last_update: 2025-11-05
related:
  - "../README.md"
  - "../CLAUDE.md"
source: "LaunchX 系统管理模块指南"
impact: medium
tags:
  - support_module
  - knowledge
---


# 知识生产模块 · USEME

版本：2025-10-11

> 使用前请阅读 `support_modules/knowledge/CLAUDE.md`，并加载 `memory-bank/README.md` 中的提示片段。

## 导入说明
- 根路径：`support_modules/knowledge/`
- 常用引用：
  ```md
  ![[support_modules/knowledge/03_研究报告/20251001-AI产业趋势洞察.md]]
  ![[support_modules/knowledge/02_分析与洞察/20250928-新能源行业深度分析.md]]
  ```
- 标签与 frontmatter 模板：见 `memory-bank/README.md`
- 方法论索引：`05_方法论中心/方法论中心索引_新结构.md`
- 模板与流程：`06_工作流模版与规范/`

## 重点字段要求
| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | ✔ | `YYYYMMDD-主题` 格式 |
| `owners` | ✔ | 责任人，可填写多人 |
| `status` | ✔ | draft / review / published |
| `last_update` | ✔ | YYYY-MM-DD |
| `related` | ✔ | 引用的文档、脚本、数据源列表 |
| `source` | ✔ | 数据来源、时间、可信度（A/B/C） |
| `impact` | ✔ | 对投资/业务/设计等的影响说明 |

## 分类导航
- **采集**：`01_Inbox/` – 快速记录链接、原文、初步标签；24h 内迁移。
- **分析**：`02_分析与洞察/` – 依据 5 通道流程整理信息，撰写阶段性洞察。
- **成果**：`03_研究报告/`（趋势洞察）、`07_市场项目档案/`（市场档案）、`08_知识传播与品牌/`（对外内容）。
- **方法论**：`05_方法论中心/` – 判断/趋势/结论体系、AI Context 实施指南、提示词模板。
- **模板**：`06_工作流模版与规范/` – 报告、洞察、传播模板。

## 常用脚本与 MCP
```bash
# 趋势分析示例
python support_modules/knowledge/tools/trend_analyzer.py --input data/ai.csv --output "support_modules/knowledge/02_分析与洞察/20251001-AI趋势分析.md"

# 周报生成（若存在）
python study/tools/report_generator.py --config configs/weekly.yaml

# 社交媒体抓取
uv run main.py --platform xhs --lt qrcode --type search --keywords "AI投资" --save_data_option sqlite

# 知识治理巡检
python "🛠️ 系统管理/memory-bank/support_modules/knowledge/tools/knowledge_audit.py"
```
- 搜索 / 抓取：`tavily-remote-mcp`、`jina-ai`、`media-crawler`
- 图表：`chart-server`、`quickchart`
- 本地检索：`knowledge-search`

## 注意事项
- 24 小时归档：`🤖 AI生成 auto-generated/日期` 内草稿须在 24h 内迁移或删除。
- 引用回写：成果需在 README、`memory-bank/README.md` 或相关索引中添加链接。
- 5 通道执行：Checklist 中需明确五类通道结果及验证方式。
- 示例完整：演示代码需包含错误处理、`finally`、数据来源说明。

## 最佳实践
- 计划阶段使用 checklist 驱动任务：来源确认 → 验证方式 → 输出模板。
- 研究完成后，在 `09_周报月报/` 记录结论摘要，并在 Summary 标注“知识库索引已更新”。
- 更新方法论/模板后，同步 `memory-bank/README.md` 与本文件。

## 故障排除
- 标签缺失 → 参考 `🏷️@外部版-供应商简介清单.md` / `🏷️@内部版-供应商合作清单总览.md`。
- 文档冲突 → 在对应 README 的“版本说明”段落注明差异并指向最新版本。
- 数据来源失效 → 在 Summary 记录阻塞，创建 TODO 跟进替代方案。
