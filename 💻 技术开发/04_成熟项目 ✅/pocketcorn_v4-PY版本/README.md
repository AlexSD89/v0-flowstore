# 🚀 Pocketcorn v4.0 - AI初创分红权投资系统（精简架构版）

## 🎯 愿景与目的
- 用标准化工作流在6-8个月内回收¥50万分红权投资，并取得超额收益。
- 以“少而精”的模块化架构完成从发现→验证→决策→学习的闭环。
- 避免模块无序膨胀，用明确边界与治理机制持续进化系统智能。

---

## 🏗️ 设计大纲（Spec → Plan → Execute → Observe → Learn）
1) Spec：根据业务目标与规则生成“任务说明/成功准则”
- 负责人：`zz_系统/00_manus_core.py`（策略/规则/权重基线）

2) Plan：把Spec转成可执行计划（数据源、步骤、校验）
- 负责人：`zz_系统/01_pocketcorn_main.py`、`02_mcp_bridge.py`

3) Execute：执行扫描、分析与评分，产出报告与候选
- 负责人：`zz_系统/06_global_trend_tracker.py`、`07_explosion_detector.py`、`05_roi_engine.py`、`04_professional_analyzer.py`

4) Observe：记录数据与结果，评估不确定性与来源质量
- 负责人：`zz_系统/11_uncertainty_validator.py`、`13_data_source_registry.py`

5) Learn：从历史与结果差异中学习，回写权重与策略
- 负责人：`zz_系统/09_iteration_optimizer.py`、`14_history_enricher.py`、`03_enhanced_weights.py#learn_from_history`

该闭环由调度器统一编排：`zz_系统/main_scheduler.py`

---

## 🧭 模块边界与能力面（防止无限扩张）
- 核心原则：保持“一个能力面=一个清晰负责人”
- 新模块准入（全部满足才可加入）
  1. 不与现有模块职责重叠（或可合并至既有模块）
  2. 有明确输入/输出与质量指标
  3. 有学习反馈点（可度量改进）
  4. 能被调度器编排且可无停机上线
- 废弃策略：若连续2个迭代无显著贡献，合并或下线

---

## 📁 目录映射（与现状一致）
- `zz_系统/`（系统层）
  - 00_manus_core.py（动态计划设计师 / 规则+权重基线）
  - 01_pocketcorn_main.py（主控决策引擎）
  - 02_mcp_bridge.py（数据工具集成/MCP桥）
  - 03_enhanced_weights.py（动态权重引擎，支持从历史学习）
  - 04_professional_analyzer.py（专业分析器/风险矩阵/估值）
  - 05_roi_engine.py（ROI引擎/反脆弱因子）
  - 06_global_trend_tracker.py（全球趋势追踪）
  - 07_explosion_detector.py（爆发期识别）
  - 09_iteration_optimizer.py（方法论效果追踪/优化报告）
  - 11_uncertainty_validator.py（不确定性验证/置信区间）
  - 12_special_search_pec.py（PEC相似技术/生态/个人专项搜索）
  - 13_data_source_registry.py（数据源注册表/冲突与权重建议）
  - 14_history_enricher.py（历史数据富化/时序构建）
  - 99_file_manager.py（文件/命名/保存）
  - report_templates.py（报告模板）
  - main_scheduler.py（统一调度）
- `zz_配置/`（热更新配置）
  - 01_screening_rules.json（筛选规则）
  - 02_weights_config.json（权重配置）
  - 03_search_strategies.json（搜索策略）
  - 03_mcp_servers.json（MCP服务器）
- `zz_数据/`（运行数据与历史DB）
  - history.db、data_registry.db、各类中间JSON
- `01_reports/`（面向人类阅读的报告）
- `01_data/`（结构化JSON输出）

---

## 🔌 工具与MCP
- 数据收集入口：`02_mcp_bridge.py`（默认模拟，可逐步接入真实MCP服务器）
- MCP服务器清单：`zz_配置/03_mcp_servers.json`
- 建议：任何新工具优先通过MCP桥接，避免在系统内散落临时脚本

---

## 📚 数据与历史学习
- 历史富化：`14_history_enricher.py` 扫描 `zz_数据` 与 `01_data`，统一入库到 `history.db`
- 来源质量：`13_data_source_registry.py` 统计字段冲突率，给出来源权重建议
- 不确定性：`11_uncertainty_validator.py` 输出置信度与区间，作为决策边界
- 学习回写：`03_enhanced_weights.py#learn_from_history` 结合历史覆盖度/均值对权重进行小步校准

---

## 📏 目标与指标（内置度量）
- 发现质量：Top-K候选的真实MRR命中率/增长命中率
- 决策效率：从发现→尽调→TS的时间（周）
- 可信度：不确定性置信区间宽度变化（收敛趋势）
- 来源可靠性：冲突率下降/高权重来源占比上升
- 投资回报：6-8个月回本率、倍数分布

---

## 🚀 使用方法

### 1) 每日分析（发现+报告）
```bash
cd pocketcorn_v4
python zz_系统/main_scheduler.py daily
```
- 输出：`01_reports/reports/explosion/…md` + `01_data/…json`

### 2) 周度回顾（历史富化+权重校准+总结报告）
```bash
python zz_系统/main_scheduler.py weekly
```
- 自动执行：`14_history_enricher.py` → `03_enhanced_weights.py#learn_from_history` → 生成周报
- 权重写回：`zz_配置/02_weights_config.json`

### 3) 专项搜索（PEC相似技术/生态/个人）
```bash
python zz_系统/12_special_search_pec.py
```
- 输出：`01_data/…pec_like_candidates.json` + `01_reports/…PEC相似技术_生态_个人_候选报告.md`

### 4) 不确定性验证（单项目）
```python
from zz_系统.11_uncertainty_validator import UncertaintyValidatorV4
uv = UncertaintyValidatorV4()
uv.validate_project({"name": "Demo", "mrr": 20000, "growth_rate": 0.3, "team_quality": 0.8, "data_sources": []})
```

---

## 🔄 配置热更新
- 修改后立即生效，无需重启
- 路径统一在 `zz_配置/`
  - 规则：`01_screening_rules.json`
  - 权重：`02_weights_config.json`
  - 策略：`03_search_strategies.json`
  - MCP：`03_mcp_servers.json`

---

## 🧪 扩展/治理策略
- 新需求优先评估：能否在现有模块扩展？若需新增，必须给出输入/输出/指标与学习反馈点
- 版本治理：保持模块“少而精”，避免并行功能重复
- 观测先行：任何新增算法需先接入 `history.db` 与 `data_registry.db` 的观测与质量验证

---

## ✅ 系统状态（v4）
- 核心闭环：已上线（Spec→Plan→Execute→Observe→Learn）
- 自动化：每日/周度任务+报告生成
- 学习机制：历史学习+不确定性验证+来源权重建议
- 专项能力：PEC相似技术/生态/个人追踪
- 就绪度：可直接投入生产使用