---
description: 启动智能并发信息研究工作流 / Launch intelligent concurrent information research workflow with multi-Agent collaboration
category: data-analysis-information
argument-hint: <research_topic> [depth_level]
allowed-tools: Task, WebSearch, WebFetch, Read, Write
---

# 智能信息研究工作流 / Intelligent Information Research Workflow

## 🎯 功能概述 / Function Overview

🔍 **智能信息研究工作流** - 专门针对复杂信息搜集任务的多Agent协作系统
Launch intelligent information research workflow command - Multi-Agent collaboration system for complex information gathering tasks.

### 📋 信息特制能力 / Information Specialization Capabilities

- **并发多源信息采集** - 同时从学术、新闻、技术、商业多个维度搜集信息
- **交叉验证和可信度评分** - A/B/C三级信息可信度评估体系
- **LaunchX方法论应用** - SPELO决策循环 + 第一性原理分析 + 7维度评分
- **投资导向信息处理** - 专门为投资分析和商业决策优化的信息处理流程

## 🎯 核心功能 / Core Features

启动完整的智能研究流程，包括：
Launch complete intelligent research process including:
- 🔄 并发多源搜索 / Concurrent multi-source search
- ✅ 交叉验证分析 / Cross-validation analysis
- 🧠 方法论融合应用 / Methodology integration
- 📊 质量评分输出 / Quality scoring output

## 📝 使用方法 / Usage

```bash
# 基础研究 / Basic Research
/smart-research "AI投资趋势分析" / "AI investment trends analysis"

# 深度研究 / Deep Research
/smart-research "区块链技术发展" deep / "blockchain technology development" deep

# 全面研究 / Comprehensive Research
/smart-research "智能制造市场" comprehensive / "smart manufacturing market" comprehensive
```

## 🔄 执行流程 / Execution Process

### 第1阶段: 研究规划 (30秒) / Phase 1: Research Planning (30 seconds)
自动分析研究主题，制定多维度搜索策略：

```yaml
规划内容:
  - 关键词扩展和分类
  - 信息源优先级排序
  - 搜索深度级别设定
  - 验证标准制定
```

### 第2阶段: 并发搜索 (1-2分钟) / Phase 2: Concurrent Search (1-2 minutes)
启动 `concurrent-search-orchestrator` agent：

```yaml
并发搜索线程:
  学术线程: 论文、研究报告、专业期刊
  新闻线程: 实时资讯、行业动态、市场报告  
  技术线程: GitHub、技术文档、开源项目
  商业线程: 企业报告、投资信息、财务数据
```

### 第3阶段: 交叉验证 (2-3分钟)
启动 `cross-validation-engine` agent：

```yaml
验证流程:
  信息去重: 识别和合并重复信息
  质量评分: 10维度评分系统
  一致性检查: 多源信息对比验证
  可信度排序: A/B/C级信息分类
```

### 第4阶段: 方法论融合 (1-2分钟)
启动 `methodology-fusion-analyst` agent：

```yaml
方法论应用:
  SPELO循环: 完整决策流程
  第一性原理: 本质问题分析
  多维评分: 综合评估体系
  智能优化: 持续改进机制
```

## 📊 输出报告格式

```markdown
# 智能并发研究报告: [研究主题]

## 🎯 研究概况
- 研究主题: [主题]
- 研究深度: [deep/comprehensive/basic]
- 信息源数量: [数量]
- 总体可信度: [评分]/10

## 📋 核心发现摘要
1. **关键趋势**: [主要趋势]
2. **核心洞察**: [重要发现]  
3. **风险机会**: [风险和机会分析]
4. **投资建议**: [具体建议]

## 📚 信息源分析

### 🥇 A级信息源 (高可信度 8.0-10.0分)
[详细信息源列表和分析]

### 🥈 B级信息源 (中等可信度 6.0-8.0分) 
[详细信息源列表和分析]

### 🥉 C级信息源 (参考使用 4.0-6.0分)
[详细信息源列表和分析]

## 🔍 深度分析

### 技术维度分析
- 技术成熟度: [分析]
- 创新突破点: [分析]
- 技术风险: [分析]

### 市场维度分析
- 市场规模: [数据]
- 增长趋势: [趋势]
- 竞争格局: [分析]

### 投资维度分析
- 投资热度: [评分]
- 估值水平: [分析]
- 投资风险: [评估]

## 💡 智能建议

### 短期行动建议 (3个月)
1. [具体建议1]
2. [具体建议2]
3. [具体建议3]

### 中期战略建议 (6-12个月)
1. [具体建议1]
2. [具体建议2]
3. [具体建议3]

### 长期布局建议 (1-3年)
1. [具体建议1]
2. [具体建议2] 
3. [具体建议3]

## 📈 后续研究建议
- 需要深入的研究方向
- 建议关注的新兴信息源
- 持续监控的关键指标
```

## ⚙️ 参数说明

### 研究深度级别
- **basic**: 基础搜索，15-20个信息源，5分钟完成
- **deep**: 深度研究，30-50个信息源，10分钟完成  
- **comprehensive**: 全面研究，50+信息源，15分钟完成

### 特殊参数
```bash
# 指定行业聚焦
/smart-research "AI医疗应用" deep --industry=healthcare

# 指定时间范围
/smart-research "区块链投资" --timeframe=2024

# 指定地区聚焦  
/smart-research "智能汽车市场" --region=china
```

## 🎪 项目特定优化

### PocketCorn投资引擎集成
- 自动生成投资评分 (1-10分)
- 风险等级评估 (低/中/高)
- ROI预期计算
- 投资时机建议

### Zhilink平台集成  
- AI技术趋势分析
- 市场需求评估
- 竞品分析
- 商业化可行性评估

### TradingAgents集成
- 市场数据验证
- 交易信号质量评估
- 风险因子识别
- 策略优化建议

启动命令后，三个专业Agent将并发工作，提供全面、可靠、有深度的研究报告。
