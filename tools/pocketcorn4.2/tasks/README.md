# Pocketcorn v4.2 Task Suite

为了将 Pocketcorn v4.2 升级为“自动发现 → 深度分析 → 自动报告”的生产系统，我们将改造路径拆解为一组可执行任务。

## 目录结构

```
tasks/
├── master_plan.yaml          # 总览，各阶段挂钩 LaunchX Master Plan
├── phase1_collectors.yaml    # 真实数据采集层接入（MindSpider/MCP）
├── phase2_analysis.yaml      # 情感/主题/风险等分析模块落地
├── phase3_reporting.yaml     # 报告 & CLI 全流程自动化
└── phase4_deploy.yaml        # 部署、监控、CI/CD 验收
```

每个任务文件包含：
- `id`：唯一任务编号
- `name`/`description`
- `commands`：建议执行的脚本或测试
- `depends_on`：任务间依赖
- `outputs`：产生或更新的文件
- `tags`：便于筛选

## Task Orchestrator

在仓库根目录提供 `manage_tasks.py`：

```
python manage_tasks.py list                 # 列出所有任务
python manage_tasks.py list --phase phase2  # 查看某阶段任务
python manage_tasks.py run T201             # 执行单个任务（默认 dry-run）
python manage_tasks.py run phase1 --execute # 顺序执行阶段任务并真正运行命令
```

- 默认 `run` 仅输出将要执行的指令；加 `--execute` 会按顺序执行 `commands`。
- 运行日志写入 `reports/task_logs/<timestamp>.log`。
- 支持 `--continue-on-error` / `--stop-on-error` 等参数（见 `python manage_tasks.py --help`）。

## 依赖

Task Orchestrator 依赖 `PyYAML` 和 `rich`（可用于美化输出）。若环境尚未安装，可执行：

```
pip install pyyaml rich
```

## 下一步

1. 按 master_plan 顺序执行 Phase 1 → Phase 4。
2. 每阶段完成后，`tools/export_phase_report.py` 会生成阶段报告（详见相应任务）。
3. 所有任务执行完毕，即可获得全自动、可观察、可报告的 Pocketcorn 发现系统。

如需扩展新的平台/分析能力，新增任务到对应 YAML，并通过 `manage_tasks.py` 执行即可。
