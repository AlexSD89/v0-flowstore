---
title: "USEME"
owners:
  - LaunchX Claude Team
status: active
last_update: 2025-11-05
related:
  - "../README.md"
  - "../CLAUDE.md"
source: "LaunchX 系统管理模块指南"
impact: medium
tags:
  - support_module
  - launchx
---


# LaunchX 业务服务模块 · USEME

> 面向 `support_modules/launchx/`，统一企业交付、品牌传播与运营管理能力。

## 导入说明
- 根路径：`support_modules/launchx/`
- 示例：
  ```md
  ![[support_modules/launchx/a_企业AI转型服务策略与案例/客户方案模板.md]]
  ```
- 依赖：企业交付方法论、品牌规范、运营SOP
- 方法论指引：support_modules/knowledge/05_方法论中心/企业服务方法论/`

## 重点 API 参数表
| 组件 | 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| 企业服务提案 | template_id | string | "standard-2025" | 提案模板编号 |
| 客户访谈 | duration | number | 60 | 访谈时长(分钟) |
| 品牌物料 | format | string | "launchx-brand" | 品牌规范格式 |
| 运营指标 | period | string | "monthly" | 指标统计周期 |

## 分类 API 概览
- **企业服务能力**：AI转型方案、客户访谈、需求分析、交付管理
- **品牌传播工具**：品牌素材库、内容模板、传播策略
- **运营管理系统**：指标监控、SOP执行、质量管理
- **客户协同平台**：项目跟踪、反馈收集、知识沉淀

## 组件用法示例
```bash
# 客户方案生成
python tools/generate_proposal.py --client "企业名称" --template "ai-transformation-2025"

# 舆情分析系统
python tools/Weibo_PublicOpinion_AnalysisSystem/app.py --config config/client.yaml

# 会议记录（使用标准模板）
cat support_modules/launchx/checklists/meeting.md
```

## 注意事项
- 任何客户交付方案需遵循 LaunchX 品牌规范，并在 `support_modules/design/` 获取最新素材
- 企业服务方法论需结合 support_modules/knowledge/05_方法论中心/` 的最新研究成果
- 运营数据需定期同步到 `support_modules/deep-study/` 进行深度分析
- 品牌传播内容需在 `memory-bank/` 建立素材档案
- 所有对外材料需同步到 `support_modules/design` 的视觉稿
- 回滚与验收步骤必须写在方案文档中

## 最佳实践
- 结合企业服务方法论 + AI技术能力
- 标准化交付流程，确保服务质量一致性
- 建立客户知识库，形成长期合作关系
- 定期复盘优化服务模板和SOP
- 方案 = 数据洞察 + 方法论引用 + 回滚策略

## 故障排除
- 提案模板不一致 → 检查 support_modules/launchx/templates/` 最新版本
- 客户访谈效果不佳 → 使用 `checklists/meeting.md` 标准流程
- 品牌素材缺失 → 联系 `support_modules/design/` 获取最新资源
- 运营指标异常 → 检查 `support_modules/deep-study/` 分析框架
- 依赖缺失 → 检查 `tools/Weibo_PublicOpinion_AnalysisSystem` 日志
- 案例冲突 → 在 README 添加版本说明并指向最新文档
