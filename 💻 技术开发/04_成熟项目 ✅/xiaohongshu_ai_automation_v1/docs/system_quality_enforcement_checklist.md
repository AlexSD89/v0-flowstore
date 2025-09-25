# LaunchX System Quality Enforcement Checklist

> Updated: 2025-09-25  
> Scope: 全局自动化内容生产 & 小红书发布链路

## 1. 核验流程总览
- **线索管理**：所有外部产品/工具必须登记于 `clients/launch-x/pilot_testing/LaunchX_Xiaohongshu_Pilot_Testing_Content_Packages_2025-09-25.json` 中的 `verification_tracker`，状态默认 `pending`。
- **验证顺序**：官网/官方账号 → 第三方报道 → 社区口碑 → 内部复核。未完成三步验证，不得进入正式稿件。
- **记录要求**：完成核验后更新 `verification_status`，附带引用链接；若无法核实，保留条目并在内容中标注 “待确认”。

## 2. 标签 & SEO 校验
- **必备标签**：`#LaunchX`、项目专属标签、行业标签三类齐备（参考 `docs/LaunchX_Standardized_Output_Optimization_Framework_2025-09-24.md:65`）。
- **数量**：8-12 个；脚本端需在生成阶段验证，缺失时终止任务并提示补齐。
- **同名分支清理**：自动化脚本应检查重复标签或同名分支文件，确保最终发布目录唯一。

## 3. 视觉规范落地
- **移动端标准**：遵循 `quality_benchmarks.mobile_optimization` 的比例、字体、对比度要求；生成图像时将参数传递给 MCP 或第三方制图服务。
- **品牌整合**：确认图片包含 LaunchX 标识与品牌色；若工具生成失败，回退到设计模板或人工二次处理。

## 4. 内容结构检查
- **七维评测**：内容草稿必须覆盖功能、易用性、性价比、企业适配、性能、集成、潜力七项评分与依据（见 `docs/LaunchX_Standardized_Output_Optimization_Framework_2025-09-24.md:45`）。
- **数据引用**：关键信息需提供来源，优先使用经过验证的链接，配合 `verification_tracker`。
- **结尾动作**：包含适用场景、选择建议、风险提醒三段式总结，并附互动引导。

## 5. 自动化前置校验
- **目录存在性**：执行 `automation/run_client.py` 前确保 `asset_output_dir`、`content_output_dir`、`data_output_dir` 均已创建（脚本自动处理，异常会抛出）。
- **状态文件**：`clients/<slug>/status.json` 将自动初始化；若读取失败，脚本不会写入根目录。
- **Dry-run 检查**：新增或修改任务时，先运行 `--dry-run` 验证配置与路径，再进入正式执行。
- **质量清单同步**：`execution/<client>_quality_checklist.md` 必须在发布前完成勾选并归档。
- **数据回填**：发布后 24 小时内，将封面点击率、完读率、标签曝光写入 `clients/<client>/reports/LaunchX_Content_Performance_<date>.md` 或等效周报。

## 6. 审核交付流程
1. **生成草稿**：自动化任务输出初稿及图像。
2. **质量稽核**：按上述条目完成自检，记录在质检表。
3. **核验更新**：同步 `verification_tracker` 与提交清单。
4. **发布前审阅**：内容、图像、标签核查后才允许进入发布管线。

---

保持该清单与系统脚本联动，确保所有客户项目共享同一套质量门槛。
