# Weibo 舆情系统整合方案（初稿）

## 目标
- 将 `tools/Weibo_PublicOpinion_AnalysisSystem` 中成熟的采集、分析、报告能力逐步接入 Launch-X 小红书自动化基座。
- 保持 Launch-X 原有“PRD → 配置 → 模板 → 执行 → 复盘”闭环不变，仅在需要的环节追加舆情能力。

## 可直接复用的模块
| 模块 | 位置 | 计划用途 |
|------|------|----------|
| MindSpider 爬虫框架 | `MindSpider/` | 作为跨平台数据源，补充微博/短视频/新闻等信号，统一写入 `clients/<slug>/data/intel/` |
| Query/Media/Insight Agent + ForumEngine | `QueryEngine/`、`MediaEngine/`、`InsightEngine/`、`ForumEngine/` | 复用其多 Agent 协作机制，与 BMAD Subagent 协同生成洞察/策略 |
| ReportEngine 报告生成 | `ReportEngine/` | 生成舆情趋势/口碑分析报告，输出至 `clients/<slug>/reports/` |
| Sentiment/Topic 模块 | `SentimentAnalysisModel/`、`MindSpider/BroadTopicExtraction/` | 提供情感评分、关键词提取、热点识别能力 |

## 数据流与储存调整
1. **配置中心**：将 `config.py` 的环境变量写入 Launch-X 统一配置（`.env` 或管理后台），确保 API Keys、数据库、模型配置集中管理。
2. **数据落盘路径**：
   - 原 MySQL 可保留，但需以数据接口形式暴露，或同步到 Launch-X 使用的 DuckDB/S3。
   - 所有舆情结果输出至 `clients/<slug>/data/intel/`、`clients/<slug>/reports/`、`clients/<slug>/logs/`，遵循现有命名规范。
3. **产出格式**：除原 HTML 报告外，新增 JSON/Markdown 版本，方便自动化流程（`run_client.py`）引用。

## 接入方式
- **MCP 封装**：将 MindSpider、ReportEngine 通过轻量 API/MCP Server 暴露，Claude 任务中可像 Rube/XHS MCP 那样调用。
- **任务编排**：示例流程：
  1. `process_prd.py` 根据 PRD 判断是否需要舆情模块，若需要则启用 `use_weibo_modules=true`。
  2. `run_client.py` 在执行主流程前调用 Weibo MCP 采集 → 写入数据 → 触发 ReportEngine 生成附加报告。
  3. 在 `status.json` 记录舆情任务执行结果，供后续复盘。
- **逐步落地**：先集成 ReportEngine（生成附加报告），再扩展数据采集与多 Agent 协作。

## 待办清单
- [ ] 设计 Weibo MCP/HTTP 接口，并生成调用示例
- [ ] 将 `config.py` 参数迁移到 Launch-X 配置体系
- [ ] 调整 ReportEngine 输出，兼容 Markdown/JSON
- [ ] 在 `automation/claude_tasks/` 添加示例任务（如 `weibo-intel.yaml`）
- [ ] 更新 `run_client.py`，在检测到 `use_weibo_modules=true` 时调用舆情流程
- [ ] 编写监控脚本，将 Weibo 模块运行日志合入 `clients/<slug>/status.json`

---

这份文档作为整合路线的初稿，后续可根据项目需求迭代完善。
