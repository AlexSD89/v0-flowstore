# External Project Analysis Workflow Standards

Complete workflow execution guidelines and quality standards for the external project information entry and archival system.

## Workflow Overview

The external project analysis workflow follows a strict four-step process:

```
DUPLICATE_SCAN → DATA_HARVEST → CONTENT_GEN → DELIVER_CHECK
```

Each step must complete successfully before proceeding to the next step.

## Step 1: DUPLICATE_SCAN - Project Duplicate Detection

### Execution Requirements
- **Search Patterns**: Must check for project name variations, aliases, and company cross-references
- **Knowledge Base Scan**: Comprehensive search across all existing project archives
- **Status Determination**: Return clear NEW_PROJECT_OK or DUPLICATE_PROJECT status

### Success Criteria
- ✅ Completed knowledge base search
- ✅ Pattern matching for name variations
- ✅ Company cross-reference verification
- ✅ Clear status determination

### Error Handling
- **Duplicate Found**: Provide details of existing analysis and ask for update confirmation
- **Search Error**: Retry with alternative search patterns
- **Inconclusive Results**: Mark as NEW_PROJECT with confidence score

## Step 2: DATA_HARVEST - Multi-Source Information Collection

### Source Tier Classification

#### Tier 1 Sources (Weight: 1.0) - Primary Evidence
- **Official Websites**: Direct verification of company existence
- **Founder/Executive Statements**: Direct quotes and official communications
- **Official Announcements**: Press releases, company announcements
- **Financial Reports**: SEC filings, investor updates, financial statements

#### Tier 2 Sources (Weight: 0.8) - Authoritative Secondary
- **VC/Angel Announcements**: Investment round announcements
- **Reputable Media Coverage**: Established tech and business publications
- **Industry Analyst Reports**: Professional market research and analysis
- **Academic Research Papers**: Peer-reviewed publications and research

#### Tier 3 Sources (Weight: 0.6) - Industry Context
- **Conference Presentations**: Industry talks and presentations
- **Patent Applications**: Intellectual property filings
- **User Reviews/Testimonials**: Customer feedback and case studies
- **Competitor Mentions**: References in competitor materials

#### Tier 4 Sources (Weight: 0.3) - Contextual Evidence
- **Social Media Discussions**: Public social media conversations
- **Forum Discussions**: Community forum posts and discussions
- **Employee Reviews**: Employee feedback and insights
- **Community Engagement**: Developer community activity

### Data Quality Standards
- **Minimum Credibility Score**: ≥0.7 (70%)
- **Cross-Validation Requirement**: Key data points must have ≥2 independent sources
- **Source Documentation**: Every data point must include source attribution
- **Freshness Requirement**: Data must be within last 24 months for dynamic information

### Collection Process
1. **Parallel Collection**: Collect from all tiers simultaneously
2. **Weight-Based Scoring**: Apply credibility weights to all collected data
3. **Conflict Resolution**: Resolve contradictory information through source hierarchy
4. **Gap Analysis**: Identify missing critical information

## Step 3: CONTENT_GEN - Standardized Report Generation

### Template Compliance Requirements

#### Required Frontmatter Fields
```yaml
title: "Project Analysis Report"
owners: ["LaunchX Team"]
status: "completed"
last_update: "YYYY-MM-DD"
quality_score: "XX/100"
```

#### Required Sections (100% Compliance)
1. **I. Project Overview**
   - Value proposition statement
   - Core tags and classification
   - Key metrics dashboard
   - Development stage assessment
   - Team core advantages

2. **📊 II. Financing Analysis**
   - Financing commonality tracking table
   - Core market data timeline
   - Investment value judgment

3. **🤖 III. AI Paradigm Breakthroughs**
   - Technology breakthrough timeline
   - AI value evolution trajectory
   - Similar project comparison analysis

4. **🚀 IV. LaunchX Integration Roadmap**
   - Capability structured tags
   - Reusability assessment
   - Integration strategy design

5. **V. Knowledge Value Judgment**
   - Entrepreneur insights
   - Enterprise recommendations
   - Industry trend judgments
   - Reusable business patterns

6. **📋 VI. Complete Data Traceability**
   - A-G zone complete data support
   - All links and block IDs only in this section
   - Source credibility assessment
   - Collection methodology documentation

### Content Quality Standards
- **Template Alignment**: 100% compliance with section structure
- **Data Integration**: All conclusions must reference VI zone data
- **Link Restrictions**: No external links in sections I-V
- **Citation Format**: Consistent source attribution format
- **Insight Quality**: Actionable, specific, and evidence-based insights

### Generation Process
1. **Data Mapping**: Map collected data to template sections
2. **Content Generation**: Generate section content based on mapped data
3. **Insight Extraction**: Derive actionable insights from collected data
4. **Quality Validation**: Ensure template compliance and data integrity

## Step 4: DELIVER_CHECK - Quality Assurance Validation

### Quality Checklist Verification

#### Structure Completeness (Required)
- [ ] Frontmatter完整性验证
- [ ] 6章节结构完整验证
- [ ] 子章节内容完整验证
- [ ] Emoji使用规范验证

#### Data Quality Assessment (Required)
- [ ] 数据溯源完整性检查
- [ ] 源可信度评估验证
- [ ] 交叉验证数据一致性
- [ ] 逻辑连贯性审查

#### Format Compliance (Required)
- [ ] 链接规范检查（仅在VI区）
- [ ] 表格格式一致性验证
- [ ] 引用格式标准检查
- [ ] 日期系统格式验证

#### Archive Standards (Required)
- [ ] 文件路径正确性确认
- [ ] 分类规则遵循验证
- [ ] 批次记录完整性
- [ ] 知识库同步状态

### Quality Scoring System

#### Scoring Metrics
- **Data Completeness** (30%): ≥90% required data points coverage
- **Source Reliability** (25%): ≥80% weighted source credibility
- **Template Alignment** (20%): 100% template structure compliance
- **Content Quality** (15%): Insight quality and actionable recommendations
- **Format Standards** (10%): Markdown and citation format compliance

#### Quality Thresholds
- **Excellent**: ≥95 points
- **Good**: 85-94 points
- **Acceptable**: 70-84 points
- **Requires Revision**: <70 points

### Delivery Decision Matrix
| Quality Score | Action | Notes |
|--------------|--------|-------|
| ≥95 | Auto-Deliver | Excellence achieved |
| 85-94 | Auto-Deliver | Meets minimum standards |
| 70-84 | Manual Review | Minor revisions needed |
| <70 | Require Revisions | Significant improvements required |

## Error Handling and Recovery

### Step-Level Error Recovery
- **DUPLICATE_SCAN Errors**: Restart with alternative search patterns
- **DATA_HARVEST Errors**: Continue with available data, mark gaps
- **CONTENT_GEN Errors**: Auto-repair template issues, log attempts
- **DELIVER_CHECK Errors**: Provide specific improvement guidance

### System-Level Failures
- **Timeout Protection**: 10-minute maximum per step
- **Retry Logic**: Up to 3 automatic retries per step
- **Fallback Mechanisms**: Progressive degradation when ideal data unavailable
- **Error Logging**: Comprehensive error capture for process improvement

## Performance Standards

### Efficiency Targets
- **Total Processing Time**: <3 minutes per project
- **Per Step Time Limits**:
  - DUPLICATE_SCAN: <30 seconds
  - DATA_HARVEST: <90 seconds
  - CONTENT_GEN: <60 seconds
  - DELIVER_CHECK: <30 seconds

### Quality Metrics
- **Success Rate**: >98% of projects complete successfully
- **Average Quality Score**: >88 points
- **Template Compliance**: 100% for delivered projects
- **Customer Satisfaction**: >90% positive feedback

## Continuous Improvement

### Process Optimization
- **Success Pattern Analysis**: Identify common success factors
- **Failure Pattern Recognition**: Detect and prevent recurring issues
- **Quality Trend Monitoring**: Track quality score evolution
- **Efficiency Benchmarking**: Compare processing times and optimize

### Template Evolution
- **User Feedback Integration**: Incorporate user suggestions
- **Industry Standard Updates**: Align with best practice changes
- **Technology Adaptation**: Leverage new data sources and tools
- **Regulatory Compliance**: Ensure adherence to evolving requirements

---

**Version**: 1.0.0 | **Last Updated**: 2025-11-18 | **Next Review**: 2025-12-18