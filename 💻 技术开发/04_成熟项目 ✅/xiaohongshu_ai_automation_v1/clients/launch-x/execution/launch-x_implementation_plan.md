# 技术实施计划 / Implementation Plan

## 技术栈 / Stack
- AI Agent: Claude 3.5 Sonnet
- MCP 服务: xiaohongshu-mcp + rube + playwright
- 数据存储: SQLite(运行)+DuckDB(分析)+S3归档

## 执行流程 / Execution Flow
1. 信息收集: Rube 工作流抓取竞品/话题 + Tavily 行业快照
2. 策略生成: BMAD Subagent 论坛生成三阶段策略并与品牌宪章对齐
3. 图文生产: 按 A/B/C/D 占比生成内容池并写入 drafts
4. 图片生成/选图: Flux Schnell 主模型 + 品牌图库兜底
5. 发布执行: XHS MCP 定时调度 + 失败自动重试 + 人工 override
6. 反馈监控: 每15分钟同步表现 -> performance_log.csv
7. 自动化执行: python automation/run_client.py --client launch-x

## 执行入口 / Runbook
- 命令: `python automation/run_client.py --client launch-x`
- 日志: `clients/launch-x/logs/`
- 产出: `clients/launch-x/data/` 与 `clients/launch-x/assets/generated/`

## 自动化组件 / Automation Components
- Claude Tasks: automation/claude_tasks/launch-x.yaml
- RUBE 工作流: gather_xhs_intel, capture_performance, partner_matching
- 小红书 MCP: publish_content, check_login_status, fetch_comments
- 自动化运行脚本: python automation/run_client.py --client launch-x
- 其他 MCP: playwright-mcp: 登录态巡检

## 测试与验证 / Testing & Validation
- 预发布检查: 登录态、合规、图片尺寸、品牌词
- 监控与报警: Prometheus 指标 + Slack Webhook
- 质量评估: 曝光、互动率、合格潜客、双边撮合转化

## 素材策略 / Asset Strategy
- 优先级: 评测套件 > 行业洞察 > 互动问答
- AI 模型: flux-schnell
- 版权管理: 保存 prompt、模型、授权凭证进 assets/manifest

## 交付节奏 / Cadence
- 发布频率: 日更4篇 / 系列每周一集
- 报告频率: weekly
- 回顾会议: 每周一 09:30 全托管例会
