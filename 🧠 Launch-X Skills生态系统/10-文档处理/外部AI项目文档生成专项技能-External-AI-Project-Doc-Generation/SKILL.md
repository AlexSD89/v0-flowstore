---
title: "外部AI项目文档生成专项技能 (External AI Project Documentation Generation Specialist)"
owners:
  - Launch X Claude Team
status: active
last_update: 2025-11-18
version: 3.1.0
category: "文档处理"
tags:
  - LaunchX
  - AI技能
  - 文档生成
  - 项目档案
  - 外部AI项目
  - 线索驱动
  - 多工具协同
related:
  - ../02-企业研究/企业研究分析师-Enterprise-Research-Analyst/SKILL.md
  - ../03-市场情报/市场情报专家-Market-Intelligence-Expert/SKILL.md
---

---
name: external-ai-project-doc-generation
description: "外部AI项目文档生成专项技能 - v3.1版：基于线索驱动信息收集法和通用信息采集验证方法论的专业技能，严格执行'DUPLICATE_SCAN → DATA_HARVEST → CONTENT_GEN → DELIVER_CHECK'四步闭环工作流，将外部AI项目信息转化为LaunchX标准化的项目档案文档。支持新项目分析和项目更新维护双工作流。"
license: Complete terms in LICENSE.txt
---

# 外部AI项目文档生成专项技能 (External AI Project Documentation Generation Specialist)

专业的AI项目文档生成技能，基于Poke项目验证的线索驱动信息收集法和《通用信息采集验证方法论》，严格执行"查重→采集→生成→交付"四步闭环工作流，专注将外部AI项目信息转化为标准化的项目档案文档。

## Workflow Decision Tree

### New Project Analysis
**Trigger**: No existing project archive found or user explicitly requests new analysis
```
Use DUPLICATE_SCAN → DATA_HARVEST → CONTENT_GEN → DELIVER_CHECK workflow
```

### Existing Project Update
**Trigger**: Existing project archive detected or user requests update to current analysis
```
Use STRUCT_SCAN → DATA_VERIFY → TREND_LINK → DELIVER_CHECK workflow
```

## New Project Analysis Workflow

### DUPLICATE_SCAN: Project Duplicate Detection
1. **Project Existence Check**: Search knowledge base for existing analysis
2. **Name Pattern Matching**: Check for project name variations and aliases
3. **Company Cross-Reference**: Verify if parent company analysis exists
4. **Status Determination**: NEW_PROJECT_OK or DUPLICATE_PROJECT

### DATA_HARVEST: Multi-Source Information Collection
1. **Tier 1 Sources** (Weight 1.0):
   - Official website validation
   - Founder/executive statements
   - Official announcements and press releases
   - Financial reports and investor updates

2. **Tier 2 Sources** (Weight 0.8):
   - VC/angel investor announcements
   - Reputable media coverage
   - Industry analyst reports
   - Academic research papers

3. **Tier 3 Sources** (Weight 0.6):
   - Industry conference presentations
   - Patent applications and filings
   - User reviews and testimonials
   - Competitor mentions

4. **Tier 4 Sources** (Weight 0.3):
   - Social media discussions
   - Forum conversations
   - Employee reviews and insights

### CONTENT_GEN: Standardized Report Generation
Based on the external project content template, generate comprehensive analysis with:

1. **I. Project Overview**: Value proposition, key metrics, development stage, team strengths
2. **📊 II. Financing Analysis**: Funding patterns, market timeline, investment value judgment
3. **🤖 III. AI Paradigm Breakthroughs**: Technical innovations, competitive comparison, AI applications
4. **🚀 IV. LaunchX Integration Roadmap**: Capability mapping, reusability assessment, integration strategy
5. **V. Knowledge Value Judgment**: Entrepreneur insights, enterprise recommendations, industry trends
6. **📋 VI. Complete Data Traceability**: A-Z zone data sourcing with weight grading

### DELIVER_CHECK: Quality Assurance Validation
1. **Structure Compliance**: 100% template alignment verification
2. **Data Completeness**: ≥90% required data points coverage
3. **Source Reliability**: ≥80% weighted source credibility
4. **Quality Scoring**: Overall score ≥85 for delivery approval
5. **Archive Verification**: Correct classification and file path confirmation

## Project Update and Maintenance Workflow

### STRUCT_SCAN: Archive Structure Validation
1. **Required Sections Check**: Verify presence of all required sections
2. **Template Compliance**: Ensure alignment with current template standards
3. **Archive Integrity**: Validate file structure and metadata completeness
4. **Update Feasibility**: Assess if content can be safely updated

### DATA_VERIFY: Data Source Validation and Credibility Assessment
1. **Data Source Classification**: Tier-based credibility weighting (1.0, 0.8, 0.6, 0.3)
2. **URL Activity Verification**: Check source links for accessibility and freshness
3. **Cross-Reference Validation**: Verify data consistency across multiple sources
4. **Credibility Scoring**: Calculate weighted credibility scores and reliability tags [高/中/低]
5. **VI Zone Mapping**: Ensure all data points are properly traced to VI zone

#### Data Verification Process
```python
# For each data point in the archive:
1. Extract and classify data content (融资/团队/产品/市场)
2. Determine source tier and calculate confidence weight
3. Locate corresponding VI zone entry and validate existing mapping
4. Verify URL status and data freshness
5. Calculate comprehensive credibility score
6. Apply reliability tag based on score thresholds
7. Execute appropriate follow-up actions
```

### TREND_LINK: Trend Analysis and Insight Generation
1. **Change Pattern Analysis**: Identify significant changes in project data
2. **Similar Project Clustering**: Analyze patterns across related projects
3. **Macro Trend Mapping**: Connect project changes to broader industry trends
4. **Counter-Trend Investigation**: Validate trends against contrary evidence
5. **Trend Strength Assessment**: Evaluate trend significance and reliability

#### Trend Analysis Logic
```python
# Trend correlation analysis process:
1. Classify change type and magnitude (融资/产品/团队/市场)
2. Find similar projects and analyze cluster patterns
3. Map to macro trend observatory data
4. Search for counter-trend cases and risk indicators
5. Calculate trend strength and generate insights
```

### DELIVER_CHECK: Update Quality Assurance
1. **Updated Structure Validation**: Verify compliance with updated template standards
2. **Enhanced Quality Metrics**: Apply additional quality criteria for updated content
3. **Change Documentation**: Ensure all changes are properly documented
4. **Trend Integration**: Verify trend insights are properly integrated
5. **Archive Update**: Confirm file is properly updated and versioned

## Quick Start Examples

### New Project Documentation Generation
```
"生成这个AI项目的文档: SERVAL"
"为这家AI公司生成项目档案: Anthropic"
"创建OpenAI的项目档案文档"
"生成Poke项目的标准化档案"
```

### Project Updates and Maintenance
```
"更新SERVAL项目档案的最新信息"
"刷新Anthropic分析中的新融资轮次数据"
"为OpenAI项目档案添加最新竞争情报"
```

### Documentation Focus
```
"为这家AI创业公司生成完整的项目档案"
"基于外部信息创建AI项目标准化文档"
"将AI项目信息转化为LaunchX标准档案格式"
```

## Advanced Features

### Dual Workflow Intelligence
- **Automatic Detection**: Skill automatically determines whether to execute analysis or update workflow
- **Seamless Transition**: Updates can be performed on existing archives without recreation
- **Change Tracking**: All updates are documented with timestamp and source attribution
- **Quality Consistency**: Maintains quality standards across both workflows

### Data Source Management
- **Tier-Based Credibility**: Sophisticated source weighting and validation system
- **Freshness Monitoring**: Automatic detection of outdated information
- **Cross-Reference Validation**: Multi-source verification ensures data accuracy
- **URL Health Checking**: Ongoing monitoring of source link reliability

### Trend Analysis Engine
- **Pattern Recognition**: Identifies meaningful patterns across project datasets
- **Macro Correlation**: Connects project changes to industry-wide trends
- **Risk Assessment**: Identifies potential issues and opportunities
- **Insight Generation**: Automatically derives actionable insights from trend analysis

## Usage Guidelines

### When to Use Each Workflow

**New Project Analysis Workflow**:
- First-time discovery of external AI projects or companies
- Competitive research on new market entrants
- Due diligence for investment decisions
- Market intelligence gathering on emerging trends

**Update and Maintenance Workflow**:
- Adding new funding round information to existing archives
- Incorporating recent product updates and launches
- Updating competitive landscape analysis
- Refreshing market positioning with new data
- Incorporating user feedback and performance metrics

### Input Requirements
- **Project Name**: Required for both workflows
- **Analysis Focus**: Optional - can specify technology, market, financial focus
- **Update Depth**: Optional - can specify incremental or comprehensive updates
- **Quality Thresholds**: Optional - can adjust minimum quality scores

### Output Standards
- **Unified Quality Scoring**: Both workflows use same quality assessment framework
- **Template Consistency**: Maintains 6-section structure across all analyses
- **Version Control**: Updates create new versions while preserving history
- **Change Documentation**: All modifications include detailed change tracking

## Integration Capabilities

### Primary Skill Integration
- **Enterprise Research Analyst**: Deep company analysis and due diligence
- **Market Intelligence Expert**: Market context and competitive intelligence
- **Project Architect**: Technical architecture assessment

### MCP Tool Integration
- **RUBE Search**: Advanced search capabilities for information gathering
- **Web Validation**: Automated URL checking and content verification
- **Data Aggregation**: Multi-source data collection and synthesis

## Quality Assurance Framework

### Unified Quality Metrics
- **New Project Scoring**: ≥85 points minimum threshold
- **Update Quality Scoring**: Same standards apply to updated content
- **Data Credibility**: ≥80% weighted source credibility for both workflows
- **Template Compliance**: 100% required for all deliveries

### Continuous Improvement
- **Performance Monitoring**: Track efficiency and quality metrics across workflows
- **User Feedback Integration**: Incorporate feedback for workflow optimization
- **Template Evolution**: Maintain alignment with latest standards and best practices
- **Error Pattern Learning**: Learn from common issues and improve handling

## Resources

### Scripts Directory
- **data_collector.py**: Multi-source information gathering with credibility weighting
- **duplicate_scanner.py**: Project existence and duplicate detection
- **structure_validator.py**: Archive structure and template compliance checking
- **update_manager.py**: Project update and version control management
- **trend_analyzer.py**: Trend analysis and insight generation
- **quality_scorer.py**: Unified quality assessment for both workflows
- **archive_manager.py**: Classification, versioning, and file path management

### References Directory
- **workflow_standards.md**: Complete workflow execution guidelines
- **update_procedures.md**: Project update and maintenance procedures
- **data_source_weights.md**: Comprehensive source credibility weighting methodology
- **trend_analysis_methods.md**: Trend analysis techniques and best practices
- **quality_metrics.md**: Unified quality assessment framework

### Assets Directory
- **quality_checklist.json**: Enhanced quality validation checklist for both workflows
- **update_templates.md**: Standardized update procedures and templates
- **version_control.json**: Archive versioning and change tracking rules
- **scoring_weights.json**: Quality scoring parameter configurations for all analyses

---

**Version**: 3.1.0 | **Last Updated**: 2025-11-18 | **Specialization**: 外部AI项目文档生成 | **Clue-Driven Methodology**: ✅ | **Multi-Tool Collaboration**: ✅ | **Quality Assurance**: ✅