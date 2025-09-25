# 技术实施计划 / Implementation Plan

## 技术栈 / Stack
- AI Agent: Claude Code Beta + Tasks
- MCP 服务: xiaohongshu-mcp、rube、(可选) weibo-mcp
- 数据存储: 本地 PostgreSQL (运营库) + S3 归档

## 执行流程 / Execution Flow
1. 信息收集: RUBE 搜集当周热门穿搭/节日趋势、竞品表现
2. 策略生成: Claude 根据宪章和趋势生成内容主题与角度
3. 图文生产: Claude 撰写文案，引用品牌语调与 campaign 主题
4. 图片生成/选图: 首选内部图库；若缺图则调用 Flux + ControlNet 生成 3:4 竖图
5. 发布执行: 小红书 MCP 上传图片并发帖，必要时转人工复核
6. 反馈监控: RUBE 定时抓取数据，写入运营库并生成周报

## 自动化组件 / Automation Components
- Claude Tasks: `demo_fashion_automation`
- RUBE 工作流: `gather_xhs_intel`, `text_guard`, `capture_performance`
- 小红书 MCP: `publish_content`, `check_login_status`
- 其他 MCP: `weibo-mcp.publish`（阶段二启用）

## 测试与验证 / Testing & Validation
- 预发布检查: 图片路径与格式校验、标题长度校验、敏感词扫描
- 监控与报警: 监控 HTTP 429、登录失效、审核拒绝事件
- 质量评估: 每周抽样人工质检 20% 内容

## 交付节奏 / Cadence
- 发布频率: 每周一至周五每天 1 篇
- 报告频率: 每周五 18:00 前输出周报
- 回顾会议: 每周一上午 10:00 线上同步

## 素材策略 / Asset Strategy
- 优先级: 内部 lookbook -> 用户UGC精选 -> AI 生图备选
- AI 模型: Flux Schnell + 控制器 (pose, lighting)
- 版权管理: 所有生成图附带 prompt、模型版本记录；库存图片注明来源与授权编号
