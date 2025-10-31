# Dynamic Spec Iteration Plan

## 概述
LaunchX 小红书自动化系统通过规范化的目录与脚本，将客户 PRD → 文案模板 → 自动执行 → 数据复盘串成闭环。为了持续提升传播率，需要让 “Spec/文案” 也具备自动迭代能力。

## 组件
1. **采集层**：Rube MCP 抓取行业/竞品数据，必要时用 Playwright 处理高价值互动。
2. **策略生成**：BMAD Subagent 根据 PRD、最新情报和运行结果输出下一轮的标题/正文/话题策略。
3. **执行层**：`run_client.py` 调用 Claude 任务与 XHS MCP 完成内容发布，Playwright 负责复杂流程。
4. **反馈层**：`status.json`、`logs/`、`data/`、`reports/` 记录表现；`update_spec_from_feedback.py` 自动产生迭代建议。

## 迭代流程
1. **PRD 更新**：`process_prd.py --client <slug> --prd <file>` → PRD 归档到 `clients/<slug>/docs/`。
2. **模板刷新**：`bootstrap_client.py --client <slug> --config ... --force` 生成最新文案和任务蓝本。
3. **执行与监控**：`run_client.py --client <slug>` 输出日志、状态、产物。
4. **自动迭代报告**：`update_spec_from_feedback.py --client <slug>` 读取 `status.json`，生成 `Auto_Iteration_Report_<timestamp>.md`：
   - 成功/失败统计
   - 传播率优化建议
   - 下一步操作（如更新关键词、图片风格、发布时间）
5. **人工审阅与调整配置**：结合周报、竞品情报，修改 `client-config.json` 与模板参数，再回到步骤 2。

## 与 Weibo 舆情系统的关系
- 可引入 `MindSpider`、`ReportEngine` 等模块补充情报与报告能力。
- 所有输出统一落在 `clients/<slug>/` 标准目录，确保小红书自动化流程可直接消费。


