---
name: git-claudecode-guide
title: Git协作专家 Skill 定义
description: 结合 Git 守护与文档驱动开发的协作技能，指导测试先行、最小实现与互链回写闭环。
allowed-tools:
  - bash:read-only
  - python:read-only
  - read
owners:
  - LaunchX Skills团队
status: active
last_update: '2025-10-31'
related:
  - ./instructions.md
  - ./README.md
  - ./resources/doc-driven-bdd-prompt.md
source: 人工采集
impact: 保障 Codex-ClaCode 协作中的 Git 操作安全、测试闭环与资产回写
tags:
  - git
  - document-driven
  - bdd
---

# Git协作专家技能

## 基本信息
- **技能名称**: Git协作专家 (Git Collaboration Expert)
- **技能版本**: 1.0.0
- **技能分类**: 协作工具
- **技能标签**: git, version-control, collaboration, workflow
- **开发者**: LaunchX Skills团队
- **创建日期**: 2025-10-31

## 功能描述
在 Git 协作管理的基础上，扩展文档驱动开发（Document-Driven Development）与 BDD（行为驱动开发）能力：将需求文档转化为测试脚本、最小实现方案与回写提示，确保交付闭环。

## 适用场景
- 多人协作项目开发
- 分支管理和版本发布
- 代码审查和合并
- 远程仓库同步
- 冲突解决和回滚
- 文档驱动的测试先行开发
- 跨技术栈的 BDD 场景生成与验证
- Git 工作流程标准化

## 使用方式

### 直接调用
```
/skill git-collaboration-expert "处理Git分支合并冲突，确保代码质量"
```

### 自然语言调用
```
"我需要在团队项目中实施Git最佳实践，请帮我建立标准工作流程"
```

### 自动识别
当检测到以下关键词时自动调用（新增文档驱动触发词）：
- "git分支"、"合并冲突"、"代码同步"
- "版本发布"、"回滚操作"、"团队协作"
- "远程仓库"、"代码审查"、"工作流"
- "文档驱动"、"BDD"、"RSpec"、"验收测试"、"Playwright"、"pytest-bdd"

## 输入参数

### 必需参数
- **任务类型** (string): Git 或 文档驱动任务类型
  - 选项: "分支管理"、"代码同步"、"冲突解决"、"工作流程"、"团队协作"、"文档驱动开发"

### 可选参数
- **项目路径** (string): Git项目路径，默认当前目录
- **分支策略** (string): 分支管理策略
  - 选项: "GitFlow"、"GitHubFlow"、"GitLabFlow"、"自定义"
- **团队规模** (string): 团队大小
  - 选项: "小型(1-5人)"、"中型(6-20人)"、"大型(20+人)"
- **紧急程度** (string): 操作紧急程度
  - 选项: "紧急"、"常规"、"低优先级"
- **tech_stack** (string): 测试/实现技术栈
  - 选项: "rails"、"node"、"python"、"api"、"custom"
- **time_window** (string): 业务时间窗或批处理周期（如 "60s"、"5m"）
- **log_table** (string): 需要回写日志或审计的表/索引名称

## 输出结果

### 主要输出
- **Git操作方案**: 详细的步骤说明和命令
- **BDD 测试剧本**: RSpec / Playwright / pytest-bdd 等验收脚本模板
- **最小实现指导**: 服务对象骨架、幂等策略、并发控制建议
- **风险评估**: 潜在风险和预防措施
- **回写提示**: memory-bank、README、日志互链与开放问题记录
- **故障排除指南**: 常见问题的解决方案

### 辅助输出
- **命令清单**: 可执行的Git命令列表
- **检查脚本**: 自动化检查脚本与测试命令
- **团队规范**: Git协作与文档驱动开发规范
- **提示词引用**: `resources/doc-driven-bdd-prompt.md` 中的标准模板

## 依赖项

### 知识来源
- Git官方文档和最佳实践
- Pro Git书籍
- GitHub、GitLab官方指南
- 实际项目经验总结
- LaunchX 文档驱动开发方法论[[🟣 knowledge/02_分析与洞察/项目开发方法论/PROJECT_DEVELOPMENT_METHODOLOGY.md:20]]
- 外部案例：《用 Claude Code 做“面向文档编程”＋ RSpec BDD，把 Rails 新功能几分钟搞定》

### 分析工具
- Git命令行工具
- 分支可视化工具
- 代码差异分析工具
- BDD 框架文档（RSpec、Playwright、pytest-bdd 等）

### 决策模板
- 分支策略选择框架
- 冲突解决决策树
- 工作流程优化模板
- 文档→测试→实现→回写工作流清单

## 性能指标
- **响应时间**: 2-5秒（常规操作），10-15秒（复杂流程设计）
- **准确率**: ≥95%（Git操作建议准确性）
- **成功率**: ≥98%（提供方案的可行性）
- **覆盖度**: 支持主流Git工作流程和文档驱动开发场景

## 质量标准
- 提供的Git命令必须经过验证，可安全执行
- 分支策略需符合团队规模和项目复杂度
- 冲突解决方案必须保证数据完整性
- 工作流程建议需考虑实际可操作性
- BDD 场景需覆盖正常流 + 边界流，提供验证命令和回滚提示
- Summary 必须标注互链与测试日志

## 使用示例

### 示例1: 分支管理优化
```
输入: "团队有10个开发者，需要优化分支管理"
输出: 提供GitFlow实施方案，包括主分支、开发分支、功能分支管理策略
```

### 示例2: 冲突解决
```
输入: "多人同时修改同一文件导致合并冲突"
输出: 提供标准化的冲突解决流程，包括冲突定位、解决策略和验证方法
```

### 示例3: 工作流程建立
```
输入: "为新项目建立Git工作流程规范"
输出: 提供完整的Git协作规范，包括提交规范、分支策略、代码审查流程
```

### 示例4: 文档驱动的 Rails 能力合并
```
输入: "根据合并需求文档生成 RSpec BDD 场景，并给出服务对象骨架与回写建议"
输出: 生成 RSpec Feature/Service spec、RecordMerger 服务骨架、with_advisory_lock 使用说明、memory-bank 回写 checklist
```

### 示例5: 跨技术栈验证
```
输入: "帮我把该文档转成 Playwright 测试，并列出 Node.js 项目需要的依赖"
输出: 提供 Playwright 测试脚本模板、npm 依赖列表、CI 执行命令以及回滚策略
```

## 更新日志
- **v1.0.0** (2025-10-31): 初始版本发布，包含基础Git协作功能
- **v1.1.0** (2025-10-31): 增强文档驱动开发与多技术栈 BDD 支持，新增提示模板与互链回写提醒
