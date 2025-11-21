# 技术实施计划 / Implementation Plan

## 技术栈 / Stack
- AI Agent: Claude 3.5 Sonnet
- MCP 服务: xiaohongshu-mcp + rube
- 数据存储: SQLite + Parquet + S3

## 执行流程 / Execution Flow
1. 信息收集: Rube 工作流并发抓取竞品/话题
2. 策略生成: Subagent 军团结合品牌宪章生成周策略
3. 图文生产: 按 A/B/C/D 占比批量生成草稿
4. 图片生成/选图: Flux + 素材库兜底
5. 发布执行: XHS MCP 定时发布 + 失败重试
6. 反馈监控: 10 分钟轮询表现并写入数据仓
7. 自动化执行: python automation/run_client.py --client example-client

## 执行入口 / Runbook
- 命令: `python automation/run_client.py --client example-client`
- 日志: `clients/example-client/logs/`
- 产出: `clients/example-client/data/` 与 `clients/example-client/assets/generated/`

## 自动化组件 / Automation Components
- Claude Tasks: automation/claude_tasks/<slug>.yaml
- RUBE 工作流: gather_xhs_intel, capture_performance
- 小红书 MCP: publish_content, check_login_status
- 自动化运行脚本: python automation/run_client.py --client example-client
- 其他 MCP: 

## 测试与验证 / Testing & Validation
- 预发布检查: 登录态、合规检查、图片尺寸
- 监控与报警: Prometheus + Slack 告警
- 质量评估: 曝光、互动率、转化线索

## 素材策略 / Asset Strategy
- 优先级: 图文 > 生图 > 视频
- AI 模型: flux-schnell
- 版权管理: 保存 Prompt + 模型版本用于审计

## 交付节奏 / Cadence
- 发布频率: 每日 3-5 篇
- 报告频率: weekly
- 回顾会议: 每周一早 09:30
