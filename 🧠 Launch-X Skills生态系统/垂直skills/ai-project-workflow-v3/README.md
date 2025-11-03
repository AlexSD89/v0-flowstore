# AI项目档案管理工作流v3.0 - 垂直化Skills生态系统

> **定位**: 100%执行v2.4设计确认的智能决策部分，以Rules形式封装为Skills
> **特性**: 垂直工作流，不做其他工作，专精AI项目档案管理
> **架构**: Rules-as-Skills，与Claude Code原生融合

## 🎯 核心设计原则

### 1. **垂直专精原则**
- **单一职责**: 专门执行AI项目档案管理工作流
- **不做其他工作**: 不包含通用分析或其他领域功能
- **深度优化**: 针对AI项目档案场景的极致优化

### 2. **Rules-as-Skills封装**
- **方法论即规则**: 将v2.4确认的设计原则封装为可执行的Rules
- **决策智能化**: 智能决策部分完全自动化执行
- **人工确认点**: 在关键决策点提供人工确认机制

### 3. **100%v2.4执行保证**
- **设计忠实**: 100%按照v2.4设计中确认的智能决策部分执行
- **质量标准**: 严格遵循v2.4定义的A+质量标准
- **流程一致**: 确保每次执行都符合既定工作流程

## 📁 Skills架构设计

### 核心工作流Skills

#### `ai-project-archive-v3-rules` - 主工作流执行器
```
功能: 执行完整的AI项目档案管理工作流v3.0
输入: 项目名称 + 基础需求
输出: A+级专业分析报告
调用: /skill ai-project-archive-v3-rules "项目名称"
```

#### `duplicate-detection-rules` - 重复性检测Rules
```
功能: 基于knowledge-master进行智能重复性检测
输入: 项目名称和描述
输出: 重复性分析报告
调用: /skill duplicate-detection-rules "项目分析"
```

#### `data-harvest-orchestrator-rules` - 数据采集编排Rules
```
功能: 编排trend-researcher和data-analyst进行智能数据采集
输入: 项目需求和重复性检测结果
输出: 结构化数据集合
调用: /skill data-harvest-orchestrator-rules "数据需求"
```

#### `content-generation-quality-rules` - 内容生成质量Rules
```
功能: 基于采集数据生成结构化内容并进行质量检查
输入: 结构化数据和质量要求
输出: 符合A+标准的分析内容
调用: /skill content-generation-quality-rules "内容生成"
```

#### `delivery-validation-rules` - 交付验证Rules
```
功能: 对生成内容进行交付标准验证
输入: 待验证内容
输出: 验证报告和改进建议
调用: /skill delivery-validation-rules "质量验证"
```

#### `mcp-cross-validation-rules` - MCP交叉验证Rules
```
功能: 使用独立工具进行交叉验证
输入: 已验证内容
输出: 交叉验证报告
调用: /skill mcp-cross-validation-rules "交叉验证"
```

#### `final-assessment-rules` - 最终评估Rules
```
功能: 综合评估生成最终质量报告
输入: 所有验证结果
输出: A+级最终报告
调用: /skill final-assessment-rules "最终评估"
```

## 🔧 实现特性

### 1. **智能决策执行**
- **自动决策**: 基于v2.4设计自动执行智能决策
- **规则引擎**: 内置完整的规则引擎支持复杂决策逻辑
- **学习机制**: 基于执行结果持续优化决策规则

### 2. **质量保障机制**
- **多层验证**: 每个步骤都有独立的质量验证
- **A+标准**: 严格遵循90-100分的A+质量标准
- **自动重试**: 质量不达标时自动执行改进策略

### 3. **Claude Code原生集成**
- **无缝调用**: 与Claude Code的原生集成，无需适配层
- **上下文保持**: 完整保留执行过程中的上下文信息
- **状态同步**: 实时同步执行状态和结果

## 📋 使用指南

### 基础使用
```bash
# 完整工作流执行
/skill ai-project-archive-v3-rules "OpenAI GPT-4技术分析"

# 单步执行
/skill duplicate-detection-rules "OpenAI GPT-4技术分析"
/skill data-harvest-orchestrator-rules "技术趋势和竞争分析"
/skill content-generation-quality-rules "生成技术分析报告"
```

### 高级配置
```bash
# 带质量目标执行
/skill ai-project-archive-v3-rules "项目名称" --quality A++ --timeout 90m

# 批量处理
/skill batch-project-processor-rules "projects-list.json"
```

## 🎯 质量标准

### A+标准要求
- **可信度评分**: 90-100分
- **数据源数量**: ≥15个高质量数据源
- **分析维度**: ≥6个专业维度
- **验证层次**: 4层质量验证

### 执行指标
- **自动化水平**: 95%+
- **成功率**: ≥90%
- **执行时间**: 30-45分钟/项目
- **质量一致性**: ≥95%

## 🔄 持续优化

### 学习机制
- **执行反馈**: 基于每次执行结果优化Rules
- **质量跟踪**: 持续监控质量指标变化
- **规则更新**: 定期更新和优化决策规则

### 版本管理
- **向后兼容**: 确保新版本与现有配置兼容
- **渐进升级**: 支持渐进式Rules升级
- **回滚机制**: 支持快速回滚到稳定版本

---

**版本**: v3.0.0  
**最后更新**: 2025-11-03  
**维护者**: LaunchX Skills生态系统团队