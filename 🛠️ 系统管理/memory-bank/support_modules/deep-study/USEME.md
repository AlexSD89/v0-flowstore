# 深度研究模块 · USEME

> 面向 `🔬 Deep study/`，统一长周期研究、投资重构与深度分析能力。

## 导入说明
- 根路径：`🔬 Deep study/`
- 示例：
  ```md
  ![[🔬 Deep study/投资框架重构/SPELO决策框架_2025-10-15.md]]
  ```
- 依赖：研究数据集、分析模型、投资框架
- 方法论指引：`🟣 knowledge/05_方法论中心/投资研究方法论/`

## 重点 API 参数表
| 组件 | 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| 研究框架 | framework_type | string | "spelo" | 研究框架类型 |
| 数据分析 | model_version | string | "v2.1" | 分析模型版本 |
| 投资评估 | scoring_dimensions | array | ["tech","market","team","finance"] | 评分维度 |
| 深度报告 | time_horizon | string | "12-month" | 研究时间跨度 |

## 分类 API 概览
- **研究框架系统**：SPELO决策框架、投资评估模型、行业分析框架
- **数据分析工具**：数据采集脚本、统计分析模型、可视化工具
- **投资管理系统**：项目筛选、风险评估、组合管理
- **深度报告生成**：研究报告模板、洞察提取、结论生成

## 组件用法示例
```bash
# 趋势分析
python study/tools/trend_analyzer.py --input data/energy.csv --output 🔬Deep study/...

# SPELO框架评估
python study/tools/spelo_analyzer.py --project "startup-xyz" --dimensions 7

# 投资组合分析
python study/tools/portfolio_analyzer.py --config config/portfolio.yaml

# 研究报告生成
python study/tools/report_generator.py --template "investment-analysis" --data data/analysis.json
```

## 注意事项
- 所有研究数据需在 `study/` 目录建立原始数据档案
- 投资决策需结合 `💻 技术开发/04_成熟项目/pocketcorn_*` 的分析工具
- 深度洞察需回写到 `🟣 knowledge/03_研究报告/` 形成知识沉淀
- 研究方法论需与 `🟣 knowledge/05_方法论中心/` 保持同步
- 标注信息来源与数据更新时间
- 与 `🟣 knowledge` 互通：成果需回写方法论或市场档案

## 最佳实践
- 遵循SPELO七维度评分体系，确保投资决策科学性
- 建立研究数据版本管理，确保分析可追溯
- 定期更新研究框架，适应市场变化
- 结合定量分析与定性洞察，形成完整投资逻辑
- 采用 SPELO 或三位一体评估框架

## 故障排除
- 数据质量问题 → 检查 `study/` 原始数据源的完整性和准确性
- 模型偏差 → 使用 `framework/validation.py` 进行模型校准
- 评分不一致 → 运行 `scoring/consistency_check.py` 验证评分标准
- 报告生成失败 → 检查 `templates/reports/` 模板文件的完整性
- 数据缺口 → 在 Summary 标注并创建 TODO
- 结论冲突 → 记录在 README 的"修订历史"段落
