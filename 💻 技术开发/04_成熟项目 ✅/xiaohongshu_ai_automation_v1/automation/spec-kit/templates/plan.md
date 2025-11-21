# 技术实施计划 / Implementation Plan

## 技术栈 / Stack
- AI Agent: {{preferred_agent}}
- MCP 服务: {{mcp_services}}
- 数据存储: {{data_storage}}

## 执行流程 / Execution Flow
1. 信息收集: {{intel_gathering_plan}}
2. 策略生成: {{strategy_plan}}
3. 图文生产: {{content_plan}}
4. 图片生成/选图: {{image_generation_plan}}
5. 发布执行: {{publishing_plan}}
6. 反馈监控: {{monitoring_plan}}
7. 自动化执行: python automation/run_client.py --client {{client_slug}}

## 执行入口 / Runbook
- 命令: `python automation/run_client.py --client {{client_slug}}`
- 日志: `clients/{{client_slug}}/logs/`
- 产出: `clients/{{client_slug}}/data/` 与 `clients/{{client_slug}}/assets/generated/`

## 自动化组件 / Automation Components
- Claude Tasks: {{claude_tasks}}
- RUBE 工作流: {{rube_workflows}}
- 小红书 MCP: {{xhs_mcp_usage}}
- 自动化运行脚本: python automation/run_client.py --client {{client_slug}}
- 其他 MCP: {{additional_mcp_usage}}

## 测试与验证 / Testing & Validation
- 预发布检查: {{preflight_checks}}
- 监控与报警: {{monitoring_alerting}}
- 质量评估: {{quality_metrics}}

## 素材策略 / Asset Strategy
- 优先级: {{asset_priority}}
- AI 模型: {{image_ai_models}}
- 版权管理: {{asset_rights_policy}}

## 交付节奏 / Cadence
- 发布频率: {{publish_frequency}}
- 报告频率: {{report_frequency}}
- 回顾会议: {{retro_cadence}}
