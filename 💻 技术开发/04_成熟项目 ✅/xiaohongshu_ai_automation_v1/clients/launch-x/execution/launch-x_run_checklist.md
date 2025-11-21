# LaunchX 全托管运行准备清单

## 1. PRD 与资料收集
- 准备最新客户 PRD / 基础资料（Markdown/文本），脚本会自动归档到 `clients/launch-x/docs/`。
- 运行 `python automation/process_prd.py --client launch-x --prd <path>`：
  - 自动补全 `automation/spec-kit/configs/launch-x.json`
  - 若有缺失字段，查看 `clients/launch-x/questions.md` 并补充。
- 完成后执行 `python automation/spec-kit/bootstrap_client.py --client launch-x --config automation/spec-kit/configs/launch-x.json --force` 更新文档。

## 2. 能力边界确认
- 查阅最新小红书 MCP 能力列表（GitHub/官方文档），确认本次所需功能均受支持；若涉及评论回复、圈子操作等超出范围，改用 Playwright 或人工。
- 核实 Rube 工作流的可用性：是否覆盖目标平台、是否有速率限制/账号风控风险。
- 判断 BMAD Subagent 是否具备本行业的专业角色，若缺失需先补充模板或提示词。
- 如果需 Playwright 执行复杂交互，列出具体页面及容错策略，确保脚本已验证通过（验证码、异步加载等）。
- 将上述确认结果写入 `clients/launch-x/questions.md` 或运行记录，方便复盘。

## 3. 环境依赖
- Claude CLI 已安装并登录：`claude --version`、`claude whoami`
- 注册 MCP 服务：
  - `claude mcp add --transport http rube http://<rube-host>:<port>/mcp`
  - `claude mcp add --transport http xiaohongshu-mcp http://<xhs-host>:<port>/mcp`
  - `claude mcp add --transport http playwright-mcp http://<playwright-host>:<port>/mcp`
- 本地安装 image-mcp（Flux 模型）并保证 `image-mcp.generate` 可调用

## 4. 项目目录初始化
- 创建数据与产出目录（若尚未生成）：
  - `projects/launch-x/data/intel/`
  - `projects/launch-x/data/drafts/`
  - `projects/launch-x/assets/generated/`
- 确认 `clients/launch-x/data/` 与 `clients/launch-x/assets/` 权限可写

## 5. 配置核对
- `clients/launch-x/client-config.json`
  - `default_run_id`: `launch-x_automation`
  - `claude_task_file`: `automation/claude_tasks/launch-x.yaml`
  - `asset_output_dir` 指向有效目录
- 小红书账号 Cookie/Session 已刷入 `xiaohongshu-mcp` 工作空间
- Rube 工作流 `gather_xhs_intel` / `capture_performance` / `partner_matching` 已在 Rube 端登记

## 6. 运行步骤
1. dry-run：`python automation/run_client.py --client launch-x --dry-run`
2. 正式执行：`python automation/run_client.py --client launch-x`
3. 观察日志：`clients/launch-x/logs/launch-x_automation_<timestamp>.log`
4. 产出核查：
   - 情报 → `clients/launch-x/data/intel/`
   - 草稿 → `clients/launch-x/data/drafts/`
   - 生图 → `clients/launch-x/assets/generated/`
   - 发布结果 → `clients/launch-x/data/performance/`（运行后生成）

## 7. 常见故障排查
- `claude: command not found` → 安装 Claude CLI 或加入 PATH
- `MCP server not registered` → 重新执行 `claude mcp add ...`
- `publish_content` 失败 → 检查小红书登录态、验证码、人机验证
- `image-mcp` 返回空 → 检查模型授权或磁盘权限

## 8. 后续动作
- 将日志摘要写入 `clients/launch-x/logs/` 同名 Markdown（可选）
- 更新 `reports/` 周报并复盘指标
- 根据结果调整 `client-config.json` 的发布频率或标签策略
 - 查看 `clients/launch-x/status.json` 中的运行记录，确保状态为 success

- 执行后运行 `python automation/update_spec_from_feedback.py --client launch-x` 生成自动化迭代报告，更新模板与内容策略。
