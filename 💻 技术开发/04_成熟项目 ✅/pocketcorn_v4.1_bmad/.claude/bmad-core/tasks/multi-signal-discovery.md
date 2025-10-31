# Multi-Signal AI Project Discovery Task

## Task Overview
Execute the PocketCorn v4.1 BMAD multi-signal discovery methodology that has successfully discovered and verified real projects including Parallel Web Systems ($30M A-round), Fira (YC W25), and FuseAI (YC W25). 

**Core Philosophy**: 智能化的关键在于决策节点，而非程序复杂度
**Proven Success**: 100% authenticity rate, discovered 3 real high-value AI startups
**Breakthrough**: Avoided v4.0's false discovery problems (e.g., "智聊AI客服" non-existent projects)

## Task Inputs
- search_period: Time range for discovery (default: 6months)
- target_regions: Geographic focus (default: ["China", "US"])  
- industry_focus: Industry vertical (default: "AI")
- team_size_range: Target team size (default: [3, 50])
- funding_stage: Preferred stages (default: ["seed", "series_a", "pmf"])

## Task Workflow

### Phase 1: Initialize Multi-Signal Collection
**Objective**: Set up parallel monitoring of 4 signal sources

1. **Twitter Signal Setup**
   - Keywords: ["AI startup", "人工智能创业", "Series A AI", "AI产品发布"]
   - Monitor: Product launches, founder announcements, community discussions
   - Confidence weight: 7-8/10

2. **LinkedIn Signal Setup**  
   - Keywords: ["AI engineer", "NLP engineer", "ML researcher", "AI startup"]
   - Monitor: Job postings, team expansion, role descriptions
   - Confidence weight: 8-9/10

3. **YCombinator Signal Setup**
   - Monitor: Latest batches (YC W25, S25), Demo Day projects
   - Track: Batch announcements, portfolio updates
   - Confidence weight: 9-10/10

4. **Funding News Signal Setup**
   - Sources: TechCrunch, 36Kr, Crunchbase
   - Monitor: Investment announcements, funding rounds
   - Confidence weight: 8-10/10

### Phase 2: Execute Signal Collection
**Objective**: Collect raw signals from all 4 sources in parallel

For each signal source:
1. Run keyword-based search queries
2. Extract project/company mentions
3. Calculate initial signal strength (1-10 scale)
4. Record discovery timestamp and source metadata
5. Flag potential duplicates across sources

**Success Criteria**: 
- Minimum 20 raw signals collected
- All 4 sources active and responsive
- Signal quality score average > 5.0

### Phase 3: Cross-Signal Validation
**Objective**: Apply multi-signal cross-validation to identify legitimate projects

For each discovered project:
1. **Time Consistency Check**
   - Verify signals appear within similar timeframes
   - Flag projects with temporal inconsistencies

2. **Data Logic Validation**
   - Check business logic coherence (team size vs funding vs product stage)
   - Validate claimed metrics against industry benchmarks

3. **Multi-Source Confirmation**
   - Require minimum 3 independent signal sources
   - Calculate composite confidence score

4. **Duplicate Elimination**
   - Merge duplicate entries across signal sources
   - Consolidate into unique project entities

**Success Criteria**:
- Minimum 3 signals per validated project
- Confidence score > 7.0/10 for included projects
- <5% duplicate rate in final list

### Phase 4: Generate Discovery Results
**Objective**: Package validated projects with rich metadata

For each validated project, compile:
- **Basic Information**: Company name, founders, location, team size
- **Signal Sources**: Which signals triggered discovery, confidence scores
- **Discovery Metadata**: Timestamps, search context, validation scores
- **Investment Potential**: Estimated MRR, funding stage, growth indicators

**Output Format** (Based on v4.1 Verified Success Pattern):
```yaml
discovery_session:
  session_id: "discovery_YYYYMMDD_HHMMSS"
  discovery_time: "ISO timestamp"  
  methodology: "v4.1 BMAD Multi-Signal Cross-Verification"
  core_philosophy: "智能化的关键在于决策节点，而非程序复杂度"
  proven_discoveries: ["Parallel Web Systems", "Fira (YC W25)", "FuseAI (YC W25)"]
  
  # 基于原launcher验证成功的真实项目模式
  discovered_projects:
    - name: "Parallel Web Systems"
      verification_status: "真实验证通过"
      discovery_signals:
        - "Twitter产品发布活动追踪"
        - "LinkedIn团队招聘活跃度分析" 
        - "Crunchbase $30M A轮融资确认"
      momentum_score: 0.92
      investment_potential:
        estimated_mrr: 60000
        team_size: 25
        recovery_months: 5.6
        expected_monthly_dividend: 58500  # 15% * MRR * 6.5汇率
        recommendation: "强烈推荐"
        confidence_level: "高"
        
    - name: "Fira (YC W25)"
      verification_status: "真实验证通过"
      discovery_signals:
        - "Y Combinator W25批次确认"
        - "LinkedIn英国团队招聘信息"
        - "£500k Pre-seed融资公告"  
      momentum_score: 0.85
      investment_potential:
        estimated_mrr: 25000
        team_size: 4
        recovery_months: 8.0
        expected_monthly_dividend: 24375
        recommendation: "推荐"
        confidence_level: "中高"
        
  methodology_validation:
    authenticity_rate: "100%"
    v4_0_problems_solved:
      - "避免发现'智聊AI客服'等虚假项目"
      - "建立多信号交叉验证机制"
      - "智能决策节点替代机械评分"
    breakthrough_value: "发现并验证3个真实高价值AI初创项目"
        
  summary:
    total_discovered: 3
    high_potential: 1  # recovery_months <= 6
    medium_potential: 2  # recovery_months 6-8
    validation_rate: "100%"
    expected_total_investment: 1500000  # 3 * 500,000
    projected_annual_return: 1314000  # 基于15%分红制
```

## Success Metrics
- **Quantity**: 3-10 validated projects per discovery session
- **Quality**: >80% of discovered projects pass authenticity verification
- **Efficiency**: Complete discovery cycle in <30 minutes
- **Accuracy**: <10% false positive rate (validated projects that don't exist)

## Error Handling
- **API Rate Limits**: Implement exponential backoff, rotate sources
- **Data Quality Issues**: Flag and quarantine suspicious signals
- **Network Failures**: Cache partial results, resume from last checkpoint
- **No Results Found**: Expand search terms, extend time range, adjust filters

## Post-Task Actions
1. Save discovery results to `outputs/discovery/discovery_YYYYMMDD_HHMMSS.yaml`
2. Generate summary metrics for performance tracking
3. Update signal source confidence scores based on validation outcomes
4. Queue validated projects for authenticity verification task

## Notes
- This task implements the core "多信号交叉验证" methodology that distinguishes v4.1 from v4.0's hardcoded approach
- Intelligence is applied at validation decision points, not technical complexity
- Results feed directly into authenticity-verification task for the complete discovery pipeline