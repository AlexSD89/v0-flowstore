# Spec Kit Scaffold for LaunchX Automation

This directory提供统一的模板、脚本与结构约束，使任何客户项目都可以在“零干预”下完成初始化、文档生成与自动化任务编排。

## 🔄 工作流总览
1. **输入 PRD**：`python automation/process_prd.py --client <client> --prd <path>` 从 PRD 中抽取行业/语调/目标，生成或更新 `configs/<client>.json`，并自动将 PRD 归档至 `clients/<client>/docs/`，输出 `clients/<client>/questions.md` 待确认清单。
2. **能力边界确认**：对照各 MCP 官方文档，确认 Rube / XHS MCP / Playwright / 图像模型等是否覆盖本次需求；若超出范围，提前设计 fallback（Playwright、人工、节流策略）。
3. **生成模板**：`python automation/spec-kit/bootstrap_client.py --client <client> --config ...` （可加 `--force`）刷新策略/执行文档与 Claude 任务蓝本。
4. **人工补充**：根据需要修改 `automation/claude_tasks/<client>.yaml`、`client-config.json` 或补充缺失信息。
5. **执行自动化**：`python automation/run_client.py --client <client>`（或 `--dry-run`）拉起 Rube/BMAD + MCP 流程，日志写入 `clients/<client>/logs/`，状态记录至 `clients/<client>/status.json`。
6. **批量并发**：`python automation/run_all.py --refresh-docs --force` 依据 `automation/client_registry.json` 批量调度多客户任务。
7. **复盘迭代**：检查 `data/`、`assets/`、`reports/`，迭代配置后重复执行，形成闭环。

## Structure

```
automation/spec-kit/
├── README.md
├── bootstrap_client.py
├── templates/
│   ├── constitution.md
│   ├── spec.md
│   ├── plan.md
│   ├── tasks.md
│   └── client-config.json
└── projects/
```

- `templates/`: Liquid 风格占位符模板 (`{{client_name}}` 等)。
- `bootstrap_client.py`: 幂等脚本，按约定生成客户目录、渲染模板并输出 Claude 任务蓝本。
- `projects/`: 可选 staging 目录，用于离线演练或归档脚本输出。

## Client Folder Contract

所有客户目录遵循同一结构，方便自动化脚本检索：

```
clients/<client_slug>/
├── client-config.json        # 机器可读配置（语调、目标、任务参数）
├── strategy/                 # 品牌宪章、市场画像、调研洞察
├── execution/                # 任务编排、实施计划、验证方案
├── reports/                  # 周报、复盘、效果分析
├── logs/                     # 执行日志与异常明细
├── assets/
│   └── generated/            # 生图、内容包、对外交付物
└── data/
    ├── intel/
    └── drafts/
```

Claude / Python 自动化流程默认读取 `client-config.json` 获取业务参数，再按需访问各子目录。

## Bootstrap Workflow

1. **准备配置**：编写 `<client>.json`，字段与 `templates/client-config.json` 保持一致。
2. **执行脚本**：
   ```bash
   python automation/spec-kit/bootstrap_client.py \
     --client launch-x \
     --config automation/spec-kit/configs/launch-x.json
   ```
   - 未提供 `--config` 时，脚本会生成带示例占位的模板，便于后续补充。
   - 已存在文件默认跳过，支持幂等运行。

3. **自动化任务同步**：脚本会在 `automation/claude_tasks/<client_slug>.yaml` 生成 Claude 任务骨架；根据客户特定需求补充步骤后即可运行。
4. **运行全托管流程**：
   ```bash
   python automation/run_client.py --client <client_slug>
   ```
   - 支持 `--task-id` / `--task-file` 覆盖，默认读取 `client-config.json` 的 `default_run_id`。
   - 执行日志自动写入 `clients/<client_slug>/logs/`，方便回溯。
5. **归档产出**：自动化脚本应将生成的内容、日志、报告写回上述约定目录，保持可追溯性。

## Tips

- `bootstrap_client.py` 可反复运行，用于在模板扩展后批量补齐历史客户目录。
- 将通用提示词、合规规则放在 `automation/shared/`（可自建），通过 templates 内的相对路径引用，确保所有客户共用最新规范。
- 扩展模板字段后，需同步更新脚本中的占位符映射及示例配置，保证自动渲染不出差错。
