---
description: Test-driven development workflow with Red-Green-Refactor process and branch management / 测试驱动开发工作流程：红-绿-重构过程和分支管理
category: code-analysis-testing
allowed-tools: Read, Write, Edit, Bash(git *)
---

# 测试驱动开发 / Test-Driven Development (TDD)

## 🎯 功能概述 / Function Overview

测试驱动开发工作流程，遵循红-绿-重构循环模式
Test-driven development workflow following Red-Green-Refactor cycle pattern.

### 🔧 核心流程 / Core Process

1. **红阶段 / Red Phase**: 编写失败的测试
2. **绿阶段 / Green Phase**: 编写最少代码使测试通过
3. **重构阶段 / Refactor Phase**: 优化代码结构

## 📝 使用方法 / Usage

```bash
# 启动TDD开发流程
/test-driven-development

# 开发新功能时自动遵循TDD原则
# Automatically follow TDD principles when developing new features
```

## 🔄 标准开发流程 / Standard Development Process

### 准备阶段 / Preparation Phase
```
[ ] 确认在main分支开始（除非指定特定分支）
[ ] 理解现有代码结构和逻辑
[ ] 为功能/修复/重构创建新分支
[ ] 准备测试环境
```

### TDD执行流程 / TDD Execution Process
1. **编写测试** / Write Test: 先写测试用例
2. **运行测试** / Run Test: 确保测试失败（红状态）
3. **编写代码** / Write Code: 最少代码使测试通过（绿状态）
4. **重构优化** / Refactor: 改进代码质量
5. **重复循环** / Repeat: 继续下一个功能点

### Git工作流 / Git Workflow
```
[ ] 功能开发完成后提交代码
[ ] 推送分支到GitHub
[ ] 创建Pull Request
[ ] 代码审查和合并
```

## 📋 开发规范 / Development Standards

### 测试优先原则 / Test-First Principles
- **测试先行**：先写测试，再写实现代码
- **小步快跑**：每次只实现一个功能点
- **持续重构**：保持代码简洁和可维护

### 代码质量标准 / Code Quality Standards
- **单一职责**：每个函数只做一件事
- **简洁明了**：避免过度复杂的实现
- **测试覆盖**：关键逻辑必须有测试覆盖

## 🎨 最佳实践 / Best Practices

### 红-绿-重构循环 / Red-Green-Refactor Cycle
```yaml
红阶段 Red Phase:
  - 编写失败的测试用例
  - 确保测试描述清晰
  - 验证测试逻辑正确

绿阶段 Green Phase:
  - 编写最少可行代码
  - 不追求完美，只求通过
  - 保持代码简单直接

重构阶段 Refactor Phase:
  - 改进代码结构
  - 消除重复代码
  - 提升可读性和维护性
```

### 分支管理策略 / Branch Management Strategy
- **功能分支**：每个功能使用独立分支
- **命名规范**：`feature/功能描述` 或 `fix/问题描述`
- **及时合并**：完成后立即创建PR合并

## 📊 质量检查清单 / Quality Checklist

### 测试质量 / Test Quality
```
[ ] 测试用例覆盖主要功能路径
[ ] 测试描述清晰易懂
[ ] 测试边界条件明确
[ ] 异常情况有测试覆盖
```

### 代码质量 / Code Quality
```
[ ] 代码遵循项目规范
[ ] 函数命名清晰有意义
[ ] 无重复代码
[ ] 逻辑简单易懂
```

### 文档完整性 / Documentation Completeness
```
[ ] 功能有适当的注释说明
[ ] 复杂逻辑有解释
[ ] API接口有文档
[ ] 使用示例完整
```

## 🔍 常见问题解决 / Common Issues Resolution

### 测试失败处理 / Test Failure Handling
- **分析失败原因**：理解测试期望vs实际结果
- **检查测试逻辑**：确保测试本身没有问题
- **逐步调试**：分步骤定位问题

### 代码重构技巧 / Refactoring Techniques
- **小步重构**：每次只改一处
- **保持测试通过**：重构过程中测试始终通过
- **使用IDE工具**：利用自动重构功能

## 🎯 适用场景 / Applicable Scenarios

### 推荐使用 / Recommended For
- **新功能开发**：确保功能正确性
- **代码重构**：保证重构安全性
- **Bug修复**：验证修复效果
- **API开发**：确保接口稳定性

### 注意事项 / Considerations
- **时间成本**：初期开发速度较慢
- **学习曲线**：需要适应TDD思维模式
- **团队协作**：需要团队统一TDD规范

## 🚀 高级技巧 / Advanced Techniques

### 测试驱动设计 / Test-Driven Design
- 通过测试用例驱动API设计
- 用测试指导代码架构
- 确保代码可测试性

### 重构策略 / Refactoring Strategies
- **提取方法**：将复杂逻辑拆分
- **引入参数对象**：减少参数数量
- **替换条件表达式**：使用多态或策略模式

遵循TDD原则能够显著提升代码质量和系统稳定性，建议在所有关键业务逻辑开发中使用。

---

**命令版本 / Command Version**: v1.0
**适用技术栈 / Tech Stack**: 通用 / Universal
**更新频率 / Update Frequency**: 根据实践反馈优化