---
title: "support_modules-knowledge-USEME-20251114"
owners: ["Serena Sync Service"]
status: "active"
last_update: "2025-11-17"
related: []
source: "Serena Memory (auto-sync)"
impact: "medium"
---

# support_modules-knowledge-USEME-20251114

> **来源**: Serena Memory自动同步
> **同步时间**: 2025-11-17 14:07:44

## 📖 原始内容



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
- 方法论索引：`05_方法论中心/README.md`
- 方法论治理 TODO：`05_方法论中心/todo-20251115-methodology-cleanup.md`
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


---

## 🤖 Serena AI增强

### 智能特性
- **语义搜索**: 支持自然语言查询和语义理解
- **上下文关联**: 自动关联相关知识和最佳实践
- **AI辅助**: 结合LaunchX方法论提供智能建议
- **代码集成**: 深度理解项目结构和代码语义

### 🎯 LaunchX方法论集成
- **5步认知法**: Collect → Model → Compare → Align → Deliver → Archive
- **Dev Docs系统**: plan.md + context.md + tasks.md 工作流
- **Skills生态**: 专业能力工具包和质量保障
- **Memory Bank增强**: 结构化知识管理和智能检索

### 🔍 使用建议
1. **自然语言查询**: 直接询问相关问题，如"Dev Docs工作流程"
2. **上下文检索**: 系统会自动关联相关知识
3. **AI辅助生成**: 基于现有内容提供改进建议
4. **知识管理**: 支持自动分类、标签化和关联推荐

### 📚 关联知识
- 与`support_modules/knowledge`分类下的其他知识自动关联
- 与`structured`类型内容建立智能链接
- 基于标签`结构化内容, 标准格式, AI协作, support_module, 规范文档, knowledge, 工具库, 可复用组件, 通用模块`构建知识网络

---

*此记忆已从LaunchX Memory Bank智能转换到Serena平台，获得AI增强能力*

---

## 同步信息

- **同步方向**: Serena → LaunchX
- **同步时间**: 2025-11-17T14:07:44.214094
- **同步服务**: LaunchX-Serena Memory Bank双向同步服务
