---
title: "Dev Docs工作流命令"
description: "Reddit指南Dev Docs三文件工作流 - 快速创建项目管理文档"
category: "project-management"
tags: ["dev-docs", "planning", "documentation", "reddit-guide"]

# /dev-docs - Dev Docs工作流命令

> **基于Reddit指南**：使用Dev Docs三文件系统解决AI失忆问题，实现思维到执行的完整闭环

## 功能描述

快速启动Dev Docs工作流，为复杂任务自动创建标准化的项目管理文档结构。

## 使用方法

```bash
/dev-docs <project-name> [options]
```

### 参数说明

- **project-name** (必需): 项目名称，用于创建文档目录
- **--template**: 指定模板类型 (默认: `standard`)
  - `standard`: 标准三文件模板
  - `simple`: 简化模板
  - `complex`: 复杂项目模板
- **--force**: 强制覆盖现有文档
- **--no-hooks**: 跳过Hook自动检查

## 工作流程

### 1. 自动分析任务复杂度
- 检测关键词和复杂度指标
- 确定是否需要Dev Docs工作流
- 提供项目建议

### 2. 创建Dev Docs结构
```
dev-docs/<project-name>/
├── plan.md      # 目标记忆 - 来自Collect阶段
├── context.md   # 状态记忆 - 来自Model阶段  
└── tasks.md     # 进度记忆 - 来自Align阶段
```

### 3. 5步认知法映射
- **Collect** → plan.md(目标) + context.md(状态)
- **Model** → context.md(状态) + tasks.md(进度)
- **Compare** → plan.md(技术路线) + context.md(决策)
- **Align** → plan.md(验收标准) + tasks.md(任务清单)
- **Deliver** → 三文件同步更新

### 4. 自动化质量保障
- Hook系统自动监控文档更新
- 实时验证思维到执行的完整性
- 确保项目连续性和可追溯性

## 模板示例

### 标准模板 (默认)
适用于大多数开发任务，包含完整的项目管理要素。

### 简化模板
适用于简单任务，减少文档复杂度，提高效率。

### 复杂模板
适用于大型项目，包含详细的风险管理、架构设计和质量保障。

## 集成功能

### 自动资产检索
- 搜索现有memory-bank资产
- 检查support_modules复用性
- 推荐最佳实践

### 基础设施检查
- PM2进程状态验证
- Git仓库完整性检查
- 开发环境配置验证

### 4维领域分析
- 技术维度：架构、依赖、集成
- 业务维度：价值、影响、数据
- 质量维度：标准、测试、性能
- 运维维度：部署、监控、维护

## 使用示例

### 基础使用
```bash
/dev-docs my-new-feature
```

### 指定模板
```bash
/dev-docs enterprise-system --template complex
```

### 强制覆盖
```bash
/dev-docs existing-project --force
```

## 输出文件

### plan.md (目标记忆)
- 项目目标和成功标准
- 技术路线图和里程碑
- 风险矩阵和缓解策略
- 验收标准和交付物

### context.md (状态记忆)
- 系统环境和配置信息
- 技术栈和依赖关系
- 决策记录和架构信息
- 当前状态和进度指标

### tasks.md (进度记忆)
- 任务清单和完成状态
- 阻塞问题和解决方案
- 质量检查点和验证结果
- 任务统计和进度计算

## 最佳实践

### Reddit指南原则
1. **工程基础设施优先** - 先验证环境再开始
2. **可观测性=能力** - 保持过程透明化
3. **自动化强制执行** - 关键流程不依赖自觉
4. **零错误遗漏机制** - 质量检查前置

### Dev Docs维护
- 定期更新三文件状态
- 保持思维和执行的同步
- 使用Hook监控文档质量
- 项目完成后归档经验

### 协作建议
- 所有团队成员共同维护Dev Docs
- 定期review和更新文档内容
- 建立文档版本控制机制
- 集成到现有工作流程

---

**Reddit指南来源**: 一个人，半年，30万行代码：Reddit 老哥的 Claude Code 硬核指南
**集成版本**: LaunchX Dev Docs混合协作系统 v3.0