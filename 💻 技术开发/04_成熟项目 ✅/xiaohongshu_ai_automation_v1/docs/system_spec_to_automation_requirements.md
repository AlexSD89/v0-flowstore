# Spec-kit ⇢ Automation 执行要求

> Updated: 2025-09-25  
> Purpose: 统一不同客户项目的交付强度，防止生成文件不完整导致自动化失败。

## 1. 触发入口
- **PRD 解析**：通过 `automation/process_prd.py` 生成 `clients/<slug>/docs/` 下的 PRD 摘要、问题清单、关键指标表。
- **Spec-kit 引导**：运行 `automation/spec-kit/bootstrap_client.py`，依据客户配置生成以下基础文档：
  - `clients/<slug>/client-config.json`
  - `automation/claude_tasks/<slug>.yaml`
  - `clients/<slug>/README.md`（或等价说明）
  - `clients/<slug>/status.json`（若不存在时初始化）

## 2. 必备 Artifact 清单
| 类型 | 文件 / 目录 | 说明 |
| --- | --- | --- |
| 配置 | `client-config.json` | 包含品牌定位、目录指针（asset/content/data）、调度信息、MCP 配置。|
| 任务 | `automation/claude_tasks/<slug>.yaml` | 任务蓝图 + 钩子；禁止引用项目外路径。|
| 运行记录 | `clients/<slug>/status.json` | 记录每一次自动化状态，确保可追溯。|
| 资产 | `clients/<slug>/assets/` | 图像、模板输出；需与 `quality_benchmarks` 对齐。|
| 内容 | `clients/<slug>/assets/content/` | 文稿输出目录；命名遵循`<主题>_YYYY-MM-DD.md`。|
| 数据 | `clients/<slug>/data/` | 中间数据、报告原始数据。|
| 日志 | `clients/<slug>/logs/` | 由 `automation/run_client.py` 自动生成。|
| 质量稽核 | `clients/<slug>/execution/<slug>_quality_checklist.md` | 自动生成质量自检单，发布前需逐项勾选。|

## 3. 运行前检查
1. `automation/run_client.py --client <slug> --dry-run`
   - 校验任务文件存在且位于项目内。
   - 自动创建资产、内容、数据目录。
2. 检查 `client-config.json` 中的路径字段（`asset_output_dir` 等）是否指向上述目录。
3. 确认 `verification_tracker`/`quality_benchmarks` 条目在当前项目场景下是否需要扩展或覆盖。

## 4. 自动化执行要求
- 脚本会在运行时调用 `ensure_client_outputs`，若检测到目录位于项目外，将抛出异常，阻止错误写入。
- 日志通过 `write_log` 保存，`update_status` 同步写入 `status.json`；任何解析失败会被记录。
- 建议将每次运行的 `log` 字段复制到周报或客户可见的执行记录中，保证透明度。

## 5. 交付目标对齐
- 内容质量：必须满足 `docs/system_quality_enforcement_checklist.md` 的检查项。
- 视觉输出：需证明 `quality_benchmarks.mobile_optimization` 已被执行（截图或自动化校验日志）。
- SEO & 标签：提交前执行脚本或人工复核，生成勾选结果存档。

## 6. 持续优化建议
- 将 Spec-kit 输出与自动化产物映射到统一的状态面板（可写入 `status.json` 的 `artifacts` 字段）。
- 对特殊项目（例如多语言或特殊渠道）扩展自定义校验模块，但仍遵循此基础框架。
- 每次新增脚本或模板，优先更新本文件与 `system_quality_enforcement_checklist.md`，保持团队共识。

---

按上述要求回溯仓库历史，补齐缺失的 artifact 与目录结构，再进入新的项目执行。
