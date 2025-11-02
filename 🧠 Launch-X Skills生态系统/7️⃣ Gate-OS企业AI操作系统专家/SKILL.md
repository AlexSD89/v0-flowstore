---
name: gate-os-enterprise-expert
title: Gate-OS企业AI操作系统专家 Skill 定义
description: 面向企业级 AI 操作系统规划的技能，输出架构蓝图、转型路线与产品化策略。
allowed-tools:
  - python:read-only
  - bash:read-only
  - read
owners:
- LaunchX Skills团队
status: active
last_update: '2025-10-24'
related:
- ./instructions.md
- ./README.md
- ../🟣 knowledge/02_分析与洞察/方法论中心/企业AI转型方法论
- ../🟣 knowledge/05_方法论中心/被投企业画像方法论
source: 人工采集
impact: 定义Gate-OS企业AI操作系统专家技能的职责与交付标准
tags:
- enterprise-ai-os
- digital-transformation
- strategy-analysis
---

# Gate-OS企业AI操作系统专家

## 基本信息
- **技能名称**: Gate-OS企业AI操作系统专家
- **版本**: v1.0.0
- **作者**: LaunchX团队
- **分类**: enterprise-ai-os
- **标签**: 企业AI系统、架构设计、AI产品化、数字化转型

## 功能描述
专业的Gate-OS企业AI操作系统专家，掌握企业AI操作系统架构设计、AI产品化策略、数字化转型方法论，帮助传统企业进行全面的AI化转型。

### 主要用途
- 企业AI系统架构设计
- AI产品化策略制定
- 数字化转型规划
- 技术架构现代化
- AI项目管理与实施
- 运营优化与持续改进

### 适用场景
- 传统企业数字化转型
- 大中型企业AI系统建设
- 企业AI产品化项目规划
- 组织架构调整与变革管理

### 核心价值
- 系统性AI架构设计
- 渐进式转型策略
- 企业AI能力构建
- 组织变革支持

## 使用方式

### 直接调用
```bash
/skill gate-os-enterprise-expert "为这家制造企业设计AI系统架构"
```

### 自然语言调用
```
请调用Gate-OS企业AI操作系统专家，帮我制定这个金融公司的数字化战略
```

### 自动识别调用
当用户需要进行企业AI系统设计、数字化转型、AI产品化时，Claude会自动调用本技能。

## 输入参数
- **project_type**: 项目类型 (战略规划/系统设计/产品化) (必需)
- **company_scope**: 企业规模 (大型/中型/小型) (必需)
- **transformation_scope**: 转型范围 (全面/核心系统/特定业务) (必需)
- **tech_focus**: 技术重点 (架构设计/数据分析/AI能力/云架构) (可选)
- **current_state**: 当前数字化程度 (评估中/初级/中级) (可选)

## 输出结果
- **格式**: 结构化AI系统架构方案
- **内容**: 系统架构设计、实施路线图、技术选型建议
- **示例**: 企业AI系统架构图、数字化战略、实施计划
- **交付物**: 技术方案、实施指南、项目管理工具

## 依赖项
- **知识来源**: 02_分析与洞察/方法论中心/企业AI转型方法论、05_方法论中心/被投企业画像方法论
- **工具**: 架构设计工具、AI产品化框架、数字化评估模型
- **输出**: 多格式企业AI解决方案和交付物

## 性能指标
- **平均执行时间**: 8-20分钟
- **成功率**: 90%+
- **适用复杂度**: 中到高复杂度企业AI系统项目

## 版本历史
- v1.0.0: 初始版本发布
