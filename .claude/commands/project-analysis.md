---
description: 分析多个项目的代码结构，生成综合分析报告 / Analyze multiple project codebases and generate comprehensive analysis reports
category: code-analysis-project
argument-hint: <project_paths> [output_format]
allowed-tools: Task, Read, Grep, Glob, TodoWrite, Write
---

# 多项目代码分析器 / Multi-Project Code Analyzer

## 🎯 功能概述 / Function Overview

专门针对投资分析和尽职调查的代码分析工具，能够：
Specialized code analysis tool for investment analysis and due diligence, capable of:
- 🔍 深度分析多个项目的代码结构和质量 / Deep analysis of multiple project code structures and quality
- 📊 生成投资风险评估报告 / Generate investment risk assessment reports
- 🏗️ 技术架构成熟度分析 / Technical architecture maturity analysis
- 💰 投资价值技术维度评估 / Technical dimension investment value assessment

## 📝 使用方法 / Usage

```bash
# 分析单个项目 / Analyze single project
/project-analysis "./pocketcorn-core" detailed

# 分析多个项目 / Analyze multiple projects
/project-analysis "./project1 ./project2 ./project3" comprehensive

# 生成投资报告 / Generate investment report
/project-analysis "./startup-xyz" investment-report

# 快速技术尽调 / Quick technical due diligence
/project-analysis "./target-company" due-diligence
```

## 🔄 分析流程 / Analysis Process

### 阶段1: 项目发现与扫描 / Phase 1: Project Discovery & Scanning (2-3分钟)
```yaml
扫描内容 Scan Content:
  - 技术栈识别 Tech stack identification
  - 代码规模评估 Code scale assessment
  - 架构模式分析 Architecture pattern analysis
  - 依赖关系映射 Dependency mapping
```

### 阶段2: 深度代码分析 / Phase 2: Deep Code Analysis (5-8分钟)
```yaml
分析维度 Analysis Dimensions:
  代码质量 Code Quality:
    - 复杂度指标 Complexity metrics
    - 可维护性评分 Maintainability score
    - 测试覆盖率 Test coverage
    - 文档完整性 Documentation completeness

  技术债务 Technical Debt:
    - 过时技术识别 Outdated technology identification
    - 安全漏洞 Security vulnerabilities
    - 性能瓶颈 Performance bottlenecks
    - 重构需求 Refactoring requirements
```

### 阶段3: 投资价值评估 / Phase 3: Investment Value Assessment (3-5分钟)
```yaml
评估指标 Evaluation Metrics:
  技术成熟度 Technical Maturity (1-10分 / score):
    - 架构合理性 Architecture rationality
    - 代码规范性 Code standards compliance
    - 可扩展性 Scalability
    - 安全性 Security

  商业价值技术维度 Technical Business Value:
    - 技术壁垒 Technical barriers
    - 团队技术实力 Team technical capability
    - 产品技术竞争力 Product technical competitiveness
    - 技术风险控制 Technical risk control
```

## 📊 报告格式 / Report Format

### 技术尽调报告 / Technical Due Diligence Report

```markdown
# 项目技术分析报告 / Project Technical Analysis Report

## 📊 执行摘要 / Executive Summary
- **项目名称 / Project Name**: [自动识别]
- **技术栈 / Tech Stack**: [主要技术 + 版本]
- **代码规模 / Code Scale**: [文件数 / 行数 / 模块数]
- **总体评分 / Overall Score**: [X/10分]
- **投资建议 / Investment Recommendation**: [推荐/谨慎/规避]

## 🏗️ 技术架构分析 / Technical Architecture Analysis

### 核心技术栈 / Core Tech Stack
```yaml
前端 Frontend: [React/Vue/Angular + version]
后端 Backend: [Node.js/Python/Go + framework]
数据库 Database: [PostgreSQL/MySQL/MongoDB + version]
缓存 Cache: [Redis/Memcached + version]
部署 Deployment: [Docker/K8s/云服务]
```

### 架构评估 / Architecture Assessment
- **架构模式 / Architecture Pattern**: [微服务/MVC/分层等]
- **模块化程度 / Modularity Level**: [高/中/低]
- **可扩展性 / Scalability**: [评估结果]
- **技术债务 / Technical Debt**: [低/中/高]

## 📈 代码质量分析 / Code Quality Analysis

### 质量指标 / Quality Metrics
```yaml
代码复杂度 Code Complexity: [评分/10]
测试覆盖率 Test Coverage: [百分比]
文档完整性 Documentation: [评分/10]
代码规范 Code Standards: [评分/10]
```

### 关键发现 / Key Findings
1. **优势亮点 / Strengths**:
   - [具体优势1]
   - [具体优势2]

2. **风险点 / Risk Points**:
   - [具体风险1]
   - [具体风险2]

3. **改进建议 / Improvement Suggestions**:
   - [建议1]
   - [建议2]

## 💰 投资价值评估 / Investment Value Assessment

### 技术维度评分 / Technical Dimension Scoring
```yaml
技术成熟度 Technical Maturity: [X/10]
团队技术实力 Team Tech Capability: [X/10]
产品技术竞争力 Product Tech Competitiveness: [X/10]
技术壁垒 Technical Barriers: [X/10]
风险控制能力 Risk Control: [X/10]

综合技术评分 Overall Technical Score: [X/10]
```

### 投资建议 / Investment Recommendations
- **技术投资价值 / Technical Investment Value**: [高/中/低]
- **技术风险等级 / Technical Risk Level**: [低/中/高]
- **关键成功因素 / Key Success Factors**: [因素列表]
- **潜在风险点 / Potential Risk Points**: [风险列表]

## 📋 尽调清单 / Due Diligence Checklist

### ✅ 技术合规性 / Technical Compliance
- [ ] 开源协议合规 Open source license compliance
- [ ] 数据安全合规 Data security compliance
- [ ] API设计规范 API design standards
- [ ] 代码质量标准 Code quality standards

### ✅ 团队能力 / Team Capability
- [ ] 代码审查机制 Code review mechanism
- [ ] 测试流程 Test process
- [ ] CI/CD管道 CI/CD pipeline
- [ ] 文档管理 Documentation management

## 🎯 后续行动建议 / Next Steps Recommendations

### 短期行动 (1-3个月) / Short-term Actions (1-3 months)
1. [具体行动建议1]
2. [具体行动建议2]
3. [具体行动建议3]

### 中期规划 (3-12个月) / Mid-term Planning (3-12 months)
1. [中期规划1]
2. [中期规划2]
3. [中期规划3]

### 长期战略 (1-3年) / Long-term Strategy (1-3 years)
1. [长期战略1]
2. [长期战略2]
3. [长期战略3]

---
**分析完成时间 / Analysis Completion**: [时间戳]
**分析师 / Analyst**: LaunchX AI Analysis System
**报告版本 / Report Version**: v1.0
```

## ⚙️ 参数配置 / Parameters

### 输出格式 / Output Format
- **detailed**: 详细技术报告 / Detailed technical report
- **summary**: 执行摘要版 / Executive summary version
- **investment-report**: 投资导向报告 / Investment-oriented report
- **due-diligence**: 尽调格式报告 / Due diligence format report

### 分析深度 / Analysis Depth
- **basic**: 基础分析 (5-10分钟) / Basic analysis (5-10 min)
- **comprehensive**: 全面分析 (15-30分钟) / Comprehensive analysis (15-30 min)
- **deep**: 深度尽调 (30-60分钟) / Deep due diligence (30-60 min)

## 🚀 LaunchX特色功能 / LaunchX Special Features

### 投资分析专用 / Investment Analysis Specialized
- **SPELO决策循环应用 / SPELO Decision Cycle Application**: 将技术分析纳入投资决策流程
- **7维度评分系统 / 7-Dimension Scoring System**: 全方位技术价值评估
- **风险量化模型 / Risk Quantification Model**: 技术风险货币化评估
- **对标分析 / Benchmark Analysis**: 与行业标杆对比

### 多项目对比 / Multi-Project Comparison
```yaml
对比维度 Comparison Dimensions:
  - 技术栈相似度 Tech stack similarity
  - 代码质量对比 Code quality comparison
  - 架构成熟度对比 Architecture maturity comparison
  - 投资价值对比 Investment value comparison
```

这个工具特别适合投资前的技术尽调，能够为投资决策提供专业的技术维度分析支持。

**命令版本 / Command Version**: v1.0
**适用场景 / Use Cases**: 投资尽调、技术评估、项目收购
**更新频率 / Update Frequency**: 根据市场需求持续优化