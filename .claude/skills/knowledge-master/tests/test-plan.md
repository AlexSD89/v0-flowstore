---
title: 知识管理大师测试计划
owners:
- LaunchX Skills团队
status: active
last_update: '2025-10-24'
related:
- ../SKILL.md
- ../instructions.md
- ../README.md
- ../../🟣 knowledge/07_市场项目档案/综合分析/20251024-品牌传播型_vs_开发者大会案例对照.md
source: 人工采集
impact: 确保知识管理大师技能输出符合知识库回写与归档规范
tags:
- knowledge-management
---

## 测试范围
- Inbox→知识库整理流程的准确性与时效性。
- 周报/月报自动生成内容的结构化程度。
- 回链与引用标注的完整性。
- 新增事件案例库的归档与引用：确保在输出中正确引用《品牌传播型 vs 开发者大会案例对照》，并在 24h 内完成 frontmatter/related 更新。

## 手动测试用例

### T1 Inbox 分类与去重
- **命令**: `/skill knowledge-master "整理🟣 knowledge/01_Inbox/markdown 中的AI投资素材"`
- **验证点**:
  - 输出包含分类表与归档建议。
  - 重复或过期内容被标记并附上处理建议。

### T2 周报生成
- **命令**: `/skill knowledge-master "基于09_周报月报资料生成本周知识运营复盘"`
- **验证点**:
  - 模板包含执行摘要、核心指标、行动项。
  - 引用的知识文档标注路径且匹配 frontmatter。

### T3 知识图谱构建
- **命令**: `/skill knowledge-master "汇总AI投资方法论相关文档，输出知识图谱节点"`
- **验证点**:
  - 至少输出节点分类、关键链接、维护责任人。
  - 给出下一步维护建议。

## 自动化与脚本
- TODO: 为 scripts/ 目录下的 `sync_knowledge_index.py` 编写 smoke test，验证 frontmatter 更新。
- TODO: 增加案例库解析脚本，自动生成事件案例索引并推送至知识图谱节点。

## 回归记录
- [ ] 2025-10-24：首轮手动测试完成，结果符合知识库整理标准。
- [ ] ________：______________________________
