# 技术架构规格说明 | Technical Architecture Specification  
# XiaoHongShu AI Automation Platform v1.1

**文档版本**: v1.1  
**最后更新**: 2025-10-09  
**负责人**: LaunchX Technical Team  
**适用对象**: 架构师、Agent 开发者、运维工程师  

---

## 目录
1. [Claude Agent OS 总体架构](#claude-agent-os-总体架构)
2. [子代理注册表（Agent Registry）](#子代理注册表agent-registry)
3. [工具与 MCP 集成](#工具与-mcp-集成)
4. [流水线工作流定义](#流水线工作流定义)
5. [状态管理与数据 Schema](#状态管理与数据-schema)
6. [目录规范与数据治理](#目录规范与数据治理)
7. [部署、监控与安全](#部署监控与安全)
8. [演进路线图](#演进路线图)

---

## Claude Agent OS 总体架构

```yaml
核心组件:
  Agent Runtime:
    - Claude Agent SDK (v2025.09)
    - Agent Registry Loader: 解析 agents/*.yaml
    - Workflow Engine: 执行 YAML/JSON 工作流
    - Event Logger: 写入 status.json、log files、Telemetry

  Integration Layer:
    MCP Drivers:
      - xiaohongshu-mcp (发布/互动)
      - rube-mcp (情报/外部工作流)
      - playwright-mcp (复杂页面操作)
      - weibo-intel (舆情补充)
    Tool Handlers:
      - CLI Adapter (python scripts, shell commands)
      - HTTP/REST Adapter
      - Secret Manager Adapter

  Data Plane:
    - 客户目录 clients/<slug>/
    - 状态存储 status.json
    - 日志与运行轨迹 logs/
    - 数据资产 data/intel|drafts|performance|quality_logs|dynamic_opt
    - 报告与复盘 reports/

运行模式:
  - Manual Trigger (开发者执行 CLI)
  - Scheduled Trigger (scheduler.yaml + cron/Airflow)
  - Agent-to-Agent 调度（子代理互相调用）
```

### 分层说明
| 层级 | 主要职责 | 关键文件/工具 |
|------|----------|---------------|
| 内核层 | 加载代理、执行工作流、收集日志 | `automation/claude_os_manager.py`（预留）、Claude Agent SDK |
| 代理层 | 子代理逻辑、权限控制、状态回写 | `config/agents/*.yaml`、`.claude/agents/*.json` |
| 工具层 | MCP、CLI、HTTP 工具封装 | `config/mcp.json`、`automation/*.py` |
| 数据层 | 存储所有输入/输出/日志 | `clients/<slug>/...`、`status.json` |
| 监控层 | 健康检查、告警、审计 | `automation/check_automation_health.py`（规划中）、日志、status.json |

---

## 子代理注册表（Agent Registry）

### 代理角色一览
| Stage | Agent ID | 说明 | 主要脚本/工具 | 状态写入 |
|-------|----------|------|---------------|----------|
| A | `intel_scout` | 情报采集团队 | `automation/daily_intel_task.py`、Rube/Playwright MCP | `status.json.intel_runs` |
| B | `content_studio` | 草稿生成与模板刷新 | `automation/spec-kit/bootstrap_client.py`、Claude 文案 Agent | `status.json.pipeline_runs[].stages` |
| B | `quality_gatekeeper` | 质量审核、流程决策 | 质检模板、规则引擎 | `clients/<slug>/data/quality_logs/` |
| C | `execution_pilot` | 发布与互动执行 | `automation/one_command_automation.py`、`run_client.py`、XHS MCP | `status.json.runs`、`pipeline_runs` |
| D | `insight_curator` | 数据回写与模板迭代 | `automation/learn_from_trending.py`、`update_spec_from_feedback.py` | `status.json.learning_runs`、`reports/` |
| Supporting | `packaging_agent` | 周报、交付打包 | `docs/templates/weekly_plan_template.md`、`reports/weekly/` | `reports/weekly/` |

### 代理配置模板（示例）
```yaml
# config/agents/intel_scout.yaml
agent_id: intel_scout
description: "收集每日情报并写入 data/intel/"
entrypoint:
  type: cli
  command: ["python", "automation/daily_intel_task.py", "--client", "{{client_slug}}"]
tooling:
  - rube-mcp
  - playwright-mcp
permissions:
  data_write:
    - clients/{{client_slug}}/data/intel/
    - clients/{{client_slug}}/data/performance/
  status_write: true
triggers:
  - type: schedule
    cron: "0 6 * * *"   # 每日06:00
  - type: manual
    command: "intel_scout.run"
```

> 其余代理参照该模板，按功能定义 `entrypoint`、`tooling`、`permissions`、`triggers`。

---

## 工具与 MCP 集成

### MCP 配置文件 `config/mcp.json`
```json
{
  "xiaohongshu": {
    "transport": "tcp",
    "host": "127.0.0.1",
    "port": 18060,
    "auth": {"token": "env:XHS_MCP_TOKEN"},
    "rate_limit_per_min": 60
  },
  "rube": {
    "transport": "http",
    "endpoint": "http://localhost:18100/mcp",
    "auth": {"token": "env:RUBE_TOKEN"}
  },
  "playwright": {
    "transport": "http",
    "endpoint": "http://localhost:4001",
    "headless": true
  },
  "weibo_intel": {
    "transport": "docker",
    "container": "weibo-intel-agent",
    "endpoint": "http://weibo-agent:5000/mcp"
  }
}
```

### 工具调用治理
1. 所有子代理只能调用在 Registry 中授权的 MCP/工具。
2. 默认启用速率限制和熔断策略：超过阈值进入降级或排队。
3. 关键操作（发帖、删除、账号变更）要求双确认：Agent 完成前写入 `status.json.pending_actions`，人工审核后标记即可继续。
4. 失败重试策略：
   - CLI 工具：异常立即抛出，由 Workflow Engine 捕获并决定重试或告警。
   - MCP 工具：根据 `mcp.json` 中的容错策略（如 `retry: 3, backoff: 2s`）自动重试。

---

## 流水线工作流定义

### Orchestration Workflow（简化示例）
```yaml
workflow:
  id: launchx_full_pipeline
  name: LaunchX Full Automation Pipeline
  triggers:
    - schedule: "0 7 * * *"   # 每日 07:00 调度
    - manual: "automation/one_command_automation.py --client {{client_slug}} --mode full"

  sequence:
    - agent: intel_scout
      stage: "Stage A 情报采集"
      output_ref: "intel_snapshot"

    - agent: content_studio
      stage: "Stage B 模板刷新与草稿生成"
      requires: ["intel_snapshot"]
      output_ref: "draft_batch"

    - quality_gate:
        agent: quality_gatekeeper
        stage: "Stage B 质量审核"
        requires: ["draft_batch"]
        validation_rules:
          - ensure_field: "draft_reviews[*].status == approved"
          - ensure_attachment: "quality_logs/quality_log_*.json"
        on_failure:
          action: halt
          notify: "strategy_team"

    - agent: execution_pilot
      stage: "Stage C 发布与互动"
      requires: ["draft_batch"]
      guard: "quality_gatekeeper.approved"
      output_ref: "execution_results"

    - agent: insight_curator
      stage: "Stage D 复盘与迭代"
      requires: ["intel_snapshot", "execution_results"]
      output_ref: "iteration_report"

    - agent: packaging_agent
      stage: "Week Summary"
      condition: "schedule == 'weekly'"
      requires: ["iteration_report"]
```

### CLI 映射
- `automation/one_command_automation.py` 会根据 `--mode` 参数选择执行上述工作流的子集，并自动写入 `status.json.pipeline_runs`。
- `automation/run_client.py` 保持可单独调用，用于人工调试或紧急发布，但仍执行质量门控。

---

## 状态管理与数据 Schema

### status.json Schema
```json
{
  "runs": [
    {
      "timestamp": "2025-09-26T11:32:04.402Z",
      "task_id": "launch-x_automation",
      "status": "success",
      "exit_code": 0,
      "log": "clients/launch-x/logs/launch-x_automation_20250926T113204Z.log",
      "quality_gate": "quality_log_2025-09-25.json"
    }
  ],
  "intel_runs": [
    {
      "timestamp": "2025-10-09T04:56:26.156Z",
      "intel_file": "clients/launch-x/data/intel/intel_snapshot_20251009T045626Z.json",
      "performance_file": "clients/launch-x/data/performance/performance_snapshot_20251009T045626Z.json",
      "topics": ["市场趋势", "品牌声量", "内容热点"]
    }
  ],
  "learning_runs": [
    {
      "timestamp": "2025-10-09T04:56:48.208Z",
      "intel_source": "clients/launch-x/data/intel/intel_snapshot_20251009T045626Z.json",
      "recommendation_file": "clients/launch-x/data/dynamic_opt/trending_recommendations_20251009T045648Z.json"
    }
  ],
  "pipeline_runs": [
    {
      "timestamp": "2025-10-09T05:05:19.138Z",
      "mode": "full",
      "schedule": "daily",
      "dry_run": false,
      "stages": [
        {"stage": "daily_intel", "status": "completed"},
        {"stage": "spec_refresh", "status": "completed"},
        {"stage": "run_client", "status": "completed", "task_id": "launch-x_automation", "quality_gate": "quality_log_2025-09-25.json"},
        {"stage": "learn_from_trending", "status": "completed"},
        {"stage": "update_spec_from_feedback", "status": "completed"}
      ],
      "log": "clients/launch-x/logs/one_command_20251009T050519Z.log"
    }
  ],
  "health_checks": [
    {
      "timestamp": "2025-10-09T02:00:00Z",
      "mcp_status": {"xiaohongshu": "ok", "rube": "ok"},
      "last_successful_run": "2025-10-09T01:30:00Z",
      "warnings": []
    }
  ]
}
```

> 建议使用 JSON Schema 验证，确保字段安全与可维护性。未来若接入监控平台，可直接解析 `status.json` 生成仪表板。

### 数据文件 Schema
1. **Intel Snapshot (`data/intel/intel_snapshot_*.json`)**
   ```json
   {
     "generated_at": "2025-10-09T04:56:26.155Z",
     "industry": "企业应用层AI功能评测",
     "topics": ["市场趋势", "品牌声量", "内容热点"],
     "trending_posts": [
       {
         "title": "...",
         "topic": "...",
         "summary": "...",
         "engagement_score": 0.76,
         "hashtags": ["#AI评测", "#市场趋势"],
         "sample_accounts": ["KOL_A", "品牌号_B"]
       }
     ]
   }
   ```
2. **Quality Log (`data/quality_logs/quality_log_YYYY-MM-DD.json`)**
   ```json
   {
     "date": "2025-09-25",
     "reviewer": "运营专家A",
     "draft_reviews": [
       {
         "draft_id": "LaunchX_AI_Content_Day1_Post1",
         "source_path": "...",
         "status": "approved",
         "edits_summary": "...",
         "final_asset_path": "...",
         "next_actions": "..."
       }
     ],
     "overall_notes": "...",
     "attachments": ["clients/launch-x/assets/content/Week1_brand_visuals.pdf"]
   }
   ```
3. **Dynamic Optimization (`data/dynamic_opt/trending_recommendations_*.json`)**
   ```json
   {
     "generated_at": "2025-10-09T04:56:48.205Z",
     "recommended_topics": ["市场趋势", "品牌声量"],
     "recommended_hashtags": ["#AI策略", "#小红书精选"],
     "avg_engagement_score": 0.68,
     "notes": "示例算法..."
   }
   ```

---

## 目录规范与数据治理

```bash
clients/<slug>/
├── client-config.json        # Level 1 (只读 + 审批)
├── docs/                     # PRD、访谈、公关手册
│   └── archive/              # 历史材料
├── strategy/                 # 品牌策略、视觉规范
├── execution/                # SOP、Runbook、Checklist
├── data/
│   ├── intel/                # 情报快照
│   ├── performance/          # KPI 记录（CSV/JSON）
│   ├── drafts/               # 草稿（待审/已审）
│   ├── quality_logs/         # 审核记录
│   └── dynamic_opt/          # AI 优化结果
├── reports/
│   ├── weekly/               # 周报、周计划
│   └── Auto_Iteration_Report_*.md
├── logs/                     # 运行日志、one-command 记录
└── status.json               # 全局状态
```

**治理策略**
- **命名统一**：文件命名遵循 `<Client>_<Type>_<YYYY-MM-DD>.<ext>`，质量日志固定 `quality_log_YYYY-MM-DD.json`。
- **生命周期管理**：
  - 日志按周归档（超过 30 天移动至 `logs/archive/`）。
  - 数据快照按季度归档；性能数据可导入数据仓库后移除本地副本。
- **权限分层**：
  - Level 1（只读 + 审批）：`client-config.json`、`config/`。
  - Level 2（读写）：`strategy/`、`execution/`、`reports/`。
  - Level 3（系统托管）：`data/`、`logs/`（禁止人工修改，必要时通过脚本更新）。
- **审计与追踪**：所有修改通过 Git 记录，关键目录启用文件变更告警；MCP 调用写入 `logs/mcp_calls/*.log`。

---

## 部署、监控与安全

### 配置与部署流程
1. **配置准备**
   - `config/mcp.json`：填写端口、密钥（推荐使用 `env:` 引用环境变量）。
   - `config/agents/`：为各子代理创建 YAML 配置，对应 README 中的角色。
   - `config/scheduler.yaml`：定义每日/每周调度任务、重试策略、告警渠道。
2. **本地开发**
   - 启动本地 MCP（docker-compose 或脚本）。
   - 运行 `python automation/one_command_automation.py --client launch-x --mode plan --dry-run` 验证流程。
3. **生产部署**
   - 使用 CI/CD 拉起 Agent Runtime 容器（或部署到洛杉矶/自建服务器）。
   - 注入密钥：使用 Vault/SOPS 等方式把敏感信息加载到 `config/secrets/`。
   - 配置外部调度（Airflow/Cron）调用 `one_command_automation.py` 或 Agent API。

### 监控与告警
- **健康检查脚本**（规划中）：`automation/check_automation_health.py` 检查 MCP 端口、登录态、最近运行时间、质量门控状态。
- **status.jsonHealth**：解析 `status.json` 中 `health_checks` 和 `pipeline_runs`，若出现失败或超时，推送告警到 Slack/飞书。
- **MCP Telemetry**：记录每次 MCP 调用耗时、错误率，超过阈值自动降级或通知。

### 安全策略
- **最小权限原则**：子代理只能访问授权目录与工具，强制读写隔离。
+- **审计与回滚**：每次全流程执行会生成 log 与 status 记录，可恢复到任意阶段的输入数据。
- **数据加密与脱敏**：敏感数据（如客户名单、cookie）保存在 `secrets/`，运行时通过环境变量注入，不写入 repo。

---

## 演进路线图

| 时间 | 目标 | 说明 |
|------|------|------|
| 2025 Q4 | Agent Registry 全量化 | 所有子代理迁移至统一 YAML 配置，并实现热加载。 |
| 2026 Q1 | 可视化控制台 | 基于 status.json 构建仪表板，支持手动触发、审批、告警管理。 |
| 2026 Q1 | 健康检查与告警体系 | 实现 `check_automation_health.py` + Slack/飞书告警。 |
| 2026 Q2 | 多平台扩展 | 在 Registry 中引入微博/抖音子代理，实现跨平台流水线复用。 |
| 2026 Q2 | 全自动质控 | 基于历史审核数据训练模型，自动判定草稿是否可发布，实现“自动放行 + 人工抽检”。 |

---

如需补充或修改本规格，请提交 PR 并更新版本号、最后更新时间。任何新增脚本或 Agent 需同步更新本文件及 `config/README.md`。***
