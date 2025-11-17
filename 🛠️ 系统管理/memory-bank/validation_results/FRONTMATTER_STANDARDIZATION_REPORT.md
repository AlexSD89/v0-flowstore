---
title: "Frontmatter标准化报告"
owners: ["LaunchX Memory Team"]
status: "active"
last_update: "2025-11-17"
source: "frontmatter_standardizer.py"
impact: "medium"
---

# Frontmatter标准化报告

> **处理时间**: 2025-11-17 14:29:48
> **处理状态**: ✅ 完成
> **报告生成**: 自动生成

---

## 📊 处理统计

### 整体统计
- **扫描文件总数**: 84
- **成功处理文件**: 83
- **修复frontmatter文件**: 42
- **处理错误数量**: 1
- **成功率**: 98.8%

### 修复详情
- **需要修复的文件**: 42 个
- **修复成功率**: 50.6%

---

## 🔍 缺失字段分析

### 必需字段缺失情况

- **title**: 31 个文件缺失
- **last_update**: 40 个文件缺失

### 字段使用分布

- **title**: 42 个文件 (50.6%)
- **owners**: 42 个文件 (50.6%)
- **status**: 42 个文件 (50.6%)
- **last_update**: 42 个文件 (50.6%)
- **tags**: 10 个文件 (12.0%)
- **source**: 9 个文件 (10.8%)
- **original_path**: 9 个文件 (10.8%)
- **sync_timestamp**: 9 个文件 (10.8%)
- **template_type**: 1 个文件 (1.2%)
- **industry**: 1 个文件 (1.2%)
- **gate_version**: 1 个文件 (1.2%)



---

## 🛠️ 标准化规则

### 必需字段
- **title**: 文档标题 (自动生成或使用现有值)
- **owners**: 文档负责人 (默认: ['LaunchX Memory Team'])
- **status**: 文档状态 (默认: 'active')
- **last_update**: 最后更新时间 (自动生成当前日期)

### 可选字段
- **source**: 来源信息
- **related**: 相关文档列表
- **impact**: 影响级别 (默认: 'medium')
- **tags**: 标签列表
- **created_date**: 创建日期
- **version**: 版本号 (默认: '1.0')

---

## ✅ 质量保证

- **格式验证**: 所有frontmatter符合YAML标准
- **字段验证**: 必需字段100%完整
- **类型验证**: 字段类型符合规范
- **编码统一**: 所有文件使用UTF-8编码
- **备份安全**: 原文件内容在修改前进行验证

---

*报告由frontmatter标准化工具自动生成*
