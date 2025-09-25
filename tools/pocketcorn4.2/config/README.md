# Configuration Guide

Pocketcorn 使用以下配置文件：

- `config/mindspider/*.yaml`：MindSpider 爬虫账号、关键词、存储信息。
- `config/mcp/playwith.yaml`：Playwith MCP 浏览器自动化配置。
- `config/mcp/rube.yaml`：Rube MCP 结构化任务配置。
- `config/analysis/*.yaml`：情感、主题等分析模块的参数。
- `config/observability.yaml`：监控与日志汇聚配置（在 Phase 4 生成）。

敏感信息建议通过环境变量或密钥管理服务注入，`.env.example` 提供参考字段。
