# Project Update and Maintenance Procedures

Complete procedures and guidelines for executing project updates and maintenance workflows in the external project analysis system.

## Overview

This document provides detailed procedures for the project update and maintenance workflow: `STRUCT_SCAN → DATA_VERIFY → TREND_LINK → DELIVER_CHECK`. This workflow is designed to maintain and enhance existing project archives with new information, trend analysis, and quality improvements.

## Workflow Decision Matrix

### When to Use Update Workflow

**Trigger Conditions:**
- Existing project archive detected in knowledge base
- User explicitly requests update to current analysis
- Scheduled periodic maintenance (quarterly/semi-annually)
- Significant new information available for archived project

**Update Types:**
- **Incremental**: Add new information, verify existing data
- **Comprehensive**: Complete data refresh with full trend analysis
- **Trend-Focused**: Emphasize trend analysis and insight generation

## Step-by-Step Procedures

### Step 1: STRUCT_SCAN - Archive Structure Validation

#### 1.1 Preparation Phase
```
Input: Project name, existing archive location
Output: Structure validation report, repair recommendations
```

**Procedure:**
1. **Locate Archive**: Find existing project archive using standard naming conventions
2. **Load Archive Data**: Read frontmatter, content sections, and metadata
3. **Initialize Validation**: Prepare structure validation checklist

#### 1.2 Required Sections Validation
**Checklist Items:**
- [ ] I. 项目概览 (Project Overview)
- [ ] 📊 II. 融资密码解析 (Financing Analysis)
- [ ] 🤖 III. AI范式突破点 (AI Paradigm Breakthroughs)
- [ ] 🚀 IV. LaunchX集成路线图 (Integration Roadmap)
- [ ] V. 知识价值判断 (Knowledge Value Judgment)
- [ ] 📋 VI. 完整数据溯源 (Complete Data Traceability)

**Validation Criteria:**
- **Presence**: All sections must exist
- **Completeness**: Each section must contain required subsections
- **Format**: Section headers must follow standard emoji pattern

#### 1.3 Frontmatter Validation
**Required Fields:**
```yaml
title: "Project Analysis Report"
owners: ["LaunchX Team"]
status: "completed|updated|maintained"
last_update: "YYYY-MM-DD"
quality_score: "XX/100"
version: "X.Y.Z"  # For updated archives
```

**Validation Process:**
1. Verify all required fields present
2. Check data format compliance
3. Validate last_update freshness
4. Confirm status appropriate for update workflow

#### 1.4 Archive Integrity Assessment
**Integrity Metrics:**
- **Structure Compliance**: Percentage of required elements present
- **Template Alignment**: Adherence to current template standards
- **Data Consistency**: Internal data coherence and cross-references
- **Metadata Completeness**: Quality of frontmatter and metadata

**Decision Matrix:**
| Compliance Score | Action |
|------------------|--------|
| ≥95% | Proceed with update (excellent structure) |
| 80-94% | Auto-repair minor issues, proceed |
| 70-79% | Manual review required, repair needed |
| <70% | Major restructuring required |

### Step 2: DATA_VERIFY - Data Source Validation and Credibility Assessment

#### 2.1 Data Source Classification and Weighting
**Tier System:**
```python
source_weights = {
    "tier1_primary": 1.0,      # Official website, executive statements
    "tier2_authoritative": 0.8, # Media coverage, VC announcements
    "tier3_industry": 0.6,      # Conference data, patents
    "tier4_contextual": 0.3     # Social media, forums
}
```

#### 2.2 URL Activity Verification
**Verification Process:**
1. **Accessibility Check**: Confirm URLs are reachable
2. **Content Freshness**: Verify content currency (≤6 months preferred)
3. **Source Authenticity**: Validate source credibility and authority
4. **Link Stability**: Check for redirect chains or broken links

**URL Status Categories:**
- **Active**: Fully accessible and current
- **Degraded**: Accessible but outdated content
- **Broken**: Not accessible (404, domain issues)
- **Redirected**: Successfully redirects to new location

#### 2.3 Cross-Reference Validation
**Validation Requirements:**
- **Multi-Source Verification**: Key data points require ≥2 independent sources
- **Source Diversity**: Prefer sources from different tiers
- **Consistency Check**: Resolve contradictions through source hierarchy
- **Attribution Completeness**: All data points must have source attribution

**Conflict Resolution Process:**
1. **Identify Conflicts**: Flag contradictory information
2. **Apply Source Hierarchy**: Tier 1 > Tier 2 > Tier 3 > Tier 4
3. **Document Resolution**: Record conflict resolution methodology
4. **Mark Uncertainties**: Clearly label unresolved conflicts

#### 2.4 Credibility Scoring
**Scoring Formula:**
```
Zone Credibility = Σ(Source Weight × Accessibility Score) / Total Sources
Overall Credibility = Σ(Zone Credibility) / Number of Zones
```

**Credibility Thresholds:**
- **High**: ≥0.8 (Excellent data quality)
- **Medium**: 0.6-0.79 (Acceptable data quality)
- **Low**: <0.6 (Requires data improvement)

### Step 3: TREND_LINK - Trend Analysis and Insight Generation

#### 3.1 Change Pattern Analysis
**Pattern Categories:**
- **Financing Changes**: Funding rounds, investment amounts, valuations
- **Product Evolution**: Feature updates, technology changes, user metrics
- **Team Dynamics**: Hiring activity, executive changes, team growth
- **Market Position**: Competitive positioning, market share, customer adoption

**Analysis Process:**
1. **Historical Comparison**: Compare current data with previous archive versions
2. **Change Magnitude**: Calculate significance of each change
3. **Pattern Recognition**: Identify recurring patterns and anomalies
4. **Impact Assessment**: Evaluate business impact of changes

#### 3.2 Similar Project Clustering
**Similarity Criteria:**
- **Industry Alignment**: Same or adjacent industry sectors
- **Technology Stack**: Similar technical approaches and tools
- **Business Model**: Comparable revenue models and target markets
- **Development Stage**: Similar maturity and growth phase

**Clustering Process:**
1. **Project Selection**: Identify similar projects from database
2. **Similarity Scoring**: Calculate similarity scores (0-1 scale)
3. **Cluster Formation**: Group projects by similarity thresholds
4. **Pattern Analysis**: Identify common patterns across clusters

#### 3.3 Macro Trend Mapping
**Trend Categories:**
- **Industry Trends**: Market growth, consolidation, regulatory changes
- **Technology Trends**: Emerging technologies, adoption rates, maturity levels
- **Market Trends**: Customer behavior shifts, demand patterns, competitive landscape

**Mapping Process:**
1. **Trend Identification**: Extract relevant macro trends from industry data
2. **Relevance Scoring**: Assess trend relevance to specific project
3. **Alignment Analysis**: Evaluate project alignment with macro trends
4. **Opportunity Assessment**: Identify strategic opportunities and threats

#### 3.4 Counter-Trend Investigation
**Investigation Areas:**
- **Contradictory Evidence**: Data that contradicts identified trends
- **Risk Assessment**: Potential risks from counter-trends
- **Validation Requirements**: Need for additional validation
- **Confidence Adjustment**: Impact on trend confidence levels

**Validation Process:**
1. **Contradiction Search**: Actively search for contradictory evidence
2. **Risk Quantification**: Assess potential impact of counter-trends
3. **Validation Planning**: Determine need for additional verification
4. **Confidence Adjustment**: Modify confidence scores based on findings

### Step 4: DELIVER_CHECK - Update Quality Assurance

#### 4.1 Updated Structure Validation
**Validation Requirements:**
- **Template Compliance**: 100% alignment with updated template standards
- **Section Completeness**: All required sections present and complete
- **Format Consistency**: Consistent formatting across all sections
- **Cross-Reference Integrity**: All internal references valid and accurate

#### 4.2 Enhanced Quality Metrics
**Quality Categories:**
- **Update Completeness**: All new information properly integrated
- **Data Accuracy**: Verified accuracy of updated data
- **Insight Quality**: Actionability and relevance of generated insights
- **Documentation Quality**: Clarity and completeness of change documentation

**Scoring System:**
```python
update_quality_score = (
    structure_compliance * 0.25 +
    data_accuracy * 0.30 +
    insight_quality * 0.25 +
    documentation_quality * 0.20
)
```

#### 4.3 Change Documentation
**Documentation Requirements:**
- **Change Summary**: Overview of all changes made
- **Source Attribution**: New sources added with credibility weights
- **Methodology Documentation**: Approach used for updates and analysis
- **Quality Metrics**: Scores and validation results

**Change Log Format:**
```markdown
## Update Summary (v{new_version})
- **Update Date**: YYYY-MM-DD
- **Update Type**: {incremental|comprehensive|trend_focused}
- **Quality Score**: {score}/100

### Major Changes
- {Category}: {Description of change}
- {Category}: {Description of change}

### New Sources Added
- {Tier} {Source}: {URL} (Weight: {weight})

### Trend Analysis Results
- Trend Strength: {strength}
- Key Insights: {count} insights generated
```

#### 4.4 Trend Integration Verification
**Integration Requirements:**
- **Insight Incorporation**: All trend insights properly integrated into analysis
- **Strategic Alignment**: Insights aligned with project strategy
- **Actionability**: Insights translated into actionable recommendations
- **Consistency**: Trend insights consistent with other analysis sections

#### 4.5 Archive Update Confirmation
**Update Procedures:**
1. **Version Control**: Create new version while preserving history
2. **File Path Management**: Maintain consistent file naming and structure
3. **Metadata Update**: Update frontmatter with new version information
4. **Archive Indexing**: Update project index and search metadata

## Quality Control and Assurance

### Quality Gates

**Gate 1: Structural Integrity**
- Minimum compliance score: 80%
- Required sections: 100% present
- Frontmatter completeness: 100%

**Gate 2: Data Quality**
- Minimum credibility score: 0.7
- Cross-validation: ≥80% of key data points
- URL accessibility: ≥90% of links active

**Gate 3: Analysis Quality**
- Trend strength: ≥0.5 for trend-focused updates
- Insight generation: Minimum 3 actionable insights
- Similarity analysis: ≥3 similar projects for comparative analysis

**Gate 4: Delivery Readiness**
- Overall quality score: ≥85
- Documentation completeness: 100%
- Change tracking: Fully documented

### Error Handling and Recovery

**Common Error Scenarios:**

1. **Archive Structure Issues**
   - **Problem**: Missing or malformed sections
   - **Recovery**: Auto-repair common issues, flag complex problems for manual review
   - **Escalation**: Major restructuring required

2. **Data Quality Problems**
   - **Problem**: Low credibility scores or broken links
   - **Recovery**: Mark gaps, suggest alternative sources, continue with available data
   - **Escalation**: Critical data missing for analysis

3. **Trend Analysis Failures**
   - **Problem**: Insufficient data for meaningful trend analysis
   - **Recovery**: Focus on available data, document limitations
   - **Escalation**: Cannot proceed without additional data

4. **Quality Score Below Threshold**
   - **Problem**: Overall quality score <85
   - **Recovery**: Provide specific improvement guidance, allow manual override
   - **Escalation**: Major quality issues requiring comprehensive revision

### Continuous Improvement

**Performance Monitoring:**
- Track update success rates and quality scores
- Monitor processing time and efficiency metrics
- Analyze common issues and failure patterns
- Collect user feedback and satisfaction metrics

**Process Optimization:**
- Regularly review and update validation criteria
- Improve error handling and recovery procedures
- Enhance trend analysis algorithms and models
- Streamline documentation and change tracking

## Tools and Automation

### Automated Scripts

**update_manager.py**
- Orchestrates complete update workflow
- Handles step transitions and error recovery
- Generates comprehensive update reports
- Manages version control and archiving

**trend_analyzer.py**
- Executes advanced trend analysis
- Performs similarity clustering and correlation analysis
- Generates actionable insights and recommendations
- Assesses trend strength and reliability

**quality_checker.py**
- Validates updated content against quality standards
- Calculates quality scores and metrics
- Identifies areas for improvement
- Generates quality assessment reports

### Integration Points

**MCP Tools:**
- RUBE Search for finding similar projects and trends
- Web validation for checking URL accessibility
- Data aggregation for collecting updated information

**External APIs:**
- Company databases for updated company information
- Funding databases for recent investment data
- Patent databases for intellectual property updates
- News APIs for recent media coverage and announcements

## Best Practices and Guidelines

### Data Management Best Practices

**Source Selection:**
- Prioritize Tier 1 sources for critical information
- Use multiple sources for cross-validation
- Regularly update source lists and weights
- Document source selection rationale

**Version Control:**
- Maintain clear version numbering and changelogs
- Preserve previous versions for reference
- Use consistent file naming conventions
- Implement proper backup and recovery procedures

### Analysis Quality Best Practices

**Trend Analysis:**
- Use consistent methodology across updates
- Validate trends against multiple data sources
- Consider counter-trends and alternative explanations
- Document assumptions and limitations

**Insight Generation:**
- Focus on actionable and specific insights
- Support insights with evidence and data
- Consider strategic implications and recommendations
- Validate insights with domain experts when possible

### Documentation Best Practices

**Change Documentation:**
- Document all changes with timestamps and attribution
- Explain rationale behind major changes and decisions
- Provide context for trend analysis and insights
- Include quality metrics and validation results

**Communication:**
- Use clear and consistent terminology
- Provide executive summaries for complex analyses
- Include visualizations and charts for data presentation
- Tailor communication to audience expertise level

---

**Version**: 1.0.0 | **Last Updated**: 2025-11-18 | **Next Review**: 2025-12-18 | **Workflow Specification**: @项目档案二次数据更新与维护工作流_v2.md.mdc