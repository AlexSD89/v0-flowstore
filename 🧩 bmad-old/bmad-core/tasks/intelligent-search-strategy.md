# <!-- Powered by BMAD™ Core -->

# Intelligent Search Strategy with MCP Integration

## Purpose

Execute advanced search strategies with iterative refinement, multi-source verification, and intelligent information value assessment. Integrates MCP web search capabilities with sophisticated query optimization and pattern recognition.

## Inputs

```yaml
required:
  - research_objective: 'Clear definition of research goals'
  - primary_questions: 'List of key questions to answer'
  - target_depth: 'surface|moderate|deep|comprehensive'
  - quality_threshold: 'minimum acceptable information quality (1-10)'

optional:
  - geographic_scope: 'global|regional|country-specific'
  - temporal_scope: 'current|historical|predictive|comprehensive'
  - competitive_focus: 'include direct/indirect competitors'
  - industry_context: 'specific industry or domain'
  - information_priorities: 'ranked list of information types'
```

## SEQUENTIAL Task Execution

### Phase 1: Search Strategy Development

#### 1.1 Research Objective Analysis
- Parse research objective into specific, measurable sub-goals
- Identify primary and secondary research questions
- Determine information priorities and success criteria
- Assess complexity level and resource requirements

#### 1.2 Keyword Strategy Matrix Development
**Primary Keyword Clusters:**
- Core subject matter terms
- Industry-specific terminology
- Geographic and temporal modifiers
- Stakeholder and entity names

**Semantic Expansion:**
- Synonyms and alternative terminology
- Related concepts and adjacent topics
- Technical vs. business language variations
- Regional and cultural language differences

**Boolean Logic Framework:**
```
Level 1: Broad Discovery
  - OR operators for semantic alternatives
  - Wildcard (*) for term variations
  - Basic temporal filters

Level 2: Targeted Search  
  - AND operators for precision
  - NOT operators for exclusion
  - Site-specific searches (site:domain.com)
  - File type filters (filetype:pdf)

Level 3: Advanced Refinement
  - Proximity operators (NEAR, AROUND)
  - Exact phrase matching ("term")
  - Complex nested Boolean logic
  - Advanced temporal filtering (after:YYYY-MM-DD)
```

#### 1.3 Source Prioritization Framework
**Tier 1 - Authoritative Sources (Weight: 40%)**
- Government agencies and regulatory bodies
- Academic institutions and peer-reviewed journals
- Industry associations and standards organizations
- Major financial and consulting firms (McKinsey, BCG, Deloitte)

**Tier 2 - Professional Sources (Weight: 35%)**
- Industry publications and trade magazines
- Professional conference proceedings
- Expert blogs and opinion leaders
- Corporate white papers and case studies

**Tier 3 - Community Sources (Weight: 25%)**
- Industry forums and communities
- Social media from verified experts
- Product reviews and user feedback
- News and media coverage

### Phase 2: Initial Search Execution

#### 2.1 Broad Discovery Search
**MCP WebSearch Implementation:**
```
FOR EACH keyword_cluster IN primary_clusters:
  query = optimize_query(keyword_cluster, "exploratory")
  results = WebSearch(query, filters={
    "time_range": "recent_2_years",
    "source_diversity": "high",
    "result_limit": 50
  })
  
  FOR EACH result IN results:
    credibility_score = assess_source_credibility(result.domain)
    relevance_score = calculate_relevance(result.content, research_objective)
    
    IF credibility_score >= 6 AND relevance_score >= 7:
      priority_sources.add(result)
```

**Pattern Recognition:**
- Identify recurring themes and concepts
- Map relationships between sources and information
- Detect consensus vs. conflicting viewpoints
- Flag emerging trends and weak signals

#### 2.2 Content Deep-Dive Analysis
**MCP WebFetch Implementation:**
```
FOR EACH source IN priority_sources:
  content = WebFetch(source.url, extract={
    "full_text": true,
    "metadata": true,
    "citations": true,
    "publication_date": true,
    "author_info": true
  })
  
  analysis = {
    "key_facts": extract_factual_claims(content),
    "opinions": extract_opinions(content),
    "data_points": extract_quantitative_data(content),
    "citations": extract_citations(content),
    "bias_indicators": assess_bias(content),
    "freshness_score": calculate_freshness(content.date)
  }
  
  knowledge_base.add(analysis)
```

### Phase 3: Information Value Assessment

#### 3.1 Quality Scoring Framework
**Information Completeness Assessment:**
```
completeness_score = (
  answered_questions / total_questions * 100
)

SCORING:
- Excellent: >= 90%
- Good: 70-89%
- Needs Improvement: < 70%
```

**Source Credibility Assessment:**
```
FOR EACH source:
  credibility_factors = {
    "domain_authority": check_domain_metrics(source.domain),
    "author_expertise": verify_author_credentials(source.author),
    "publication_reputation": assess_publication_quality(source.publication),
    "peer_citations": count_citation_references(source),
    "bias_detection": analyze_content_bias(source.content),
    "fact_check_status": verify_factual_claims(source.facts)
  }
  
  credibility_score = weighted_average(credibility_factors)
```

**Cross-Verification Matrix:**
```
FOR EACH major_finding:
  supporting_sources = find_corroborating_sources(major_finding)
  
  IF len(supporting_sources) >= 3:
    verification_status = "VERIFIED"
    confidence_level = calculate_consensus_strength(supporting_sources)
  ELIF len(supporting_sources) >= 2:
    verification_status = "PARTIALLY_VERIFIED"
    confidence_level = "MODERATE"
  ELSE:
    verification_status = "UNVERIFIED"
    confidence_level = "LOW"
    flag_for_additional_research(major_finding)
```

#### 3.2 Information Gap Analysis
**Gap Detection Algorithm:**
```
research_coverage = {}

FOR EACH question IN primary_questions:
  coverage_score = assess_question_coverage(question, knowledge_base)
  research_coverage[question] = coverage_score
  
  IF coverage_score < quality_threshold:
    information_gaps.add({
      "question": question,
      "current_coverage": coverage_score,
      "missing_elements": identify_missing_information(question),
      "potential_sources": suggest_additional_sources(question),
      "search_strategies": recommend_search_refinements(question)
    })
```

### Phase 4: Conditional Search Reinforcement

#### 4.1 Reinforcement Trigger Conditions
**Automatic Reinforcement Triggers:**
- Information completeness < quality_threshold
- Source credibility average < 7.5/10
- Major findings with < 3 verification sources
- Stakeholder feedback requesting additional information
- Conflicting information requiring resolution

#### 4.2 Intensified Search Strategies
**Gap-Targeted Search Enhancement:**
```
FOR EACH gap IN information_gaps:
  
  # Semantic Expansion
  expanded_terms = generate_semantic_alternatives(gap.keywords)
  technical_terms = lookup_domain_terminology(gap.subject_area)
  
  # Temporal Broadening
  IF gap.type == "historical_context":
    search_timeframe = extend_temporal_range(current_timeframe, "expand_historical")
  ELIF gap.type == "trend_analysis":
    search_timeframe = extend_temporal_range(current_timeframe, "include_predictive")
  
  # Geographic Expansion
  IF gap.geographic_coverage == "insufficient":
    target_regions = identify_relevant_geographic_areas(gap.subject)
    regional_sources = find_regional_expertise(target_regions)
  
  # Expert Source Targeting
  domain_experts = identify_subject_experts(gap.subject_area)
  academic_sources = find_scholarly_sources(gap.research_area)
  industry_thought_leaders = locate_industry_experts(gap.domain)
  
  # Alternative Platform Search
  alternative_searches = [
    search_academic_databases(gap.keywords),
    search_government_sources(gap.policy_aspects),
    search_industry_reports(gap.market_aspects),
    search_patent_databases(gap.technical_aspects),
    search_financial_databases(gap.economic_aspects)
  ]
```

#### 4.3 Iterative Quality Re-assessment
**Reinforcement Success Validation:**
```
WHILE information_quality < quality_threshold AND iterations < max_iterations:
  
  # Execute reinforcement search
  new_information = execute_reinforcement_search(current_gaps)
  
  # Update knowledge base
  knowledge_base = merge_new_information(knowledge_base, new_information)
  
  # Re-assess information quality
  updated_quality = assess_information_quality(knowledge_base, research_objectives)
  
  # Update gap analysis
  remaining_gaps = update_gap_analysis(knowledge_base, primary_questions)
  
  # Calculate improvement
  quality_improvement = updated_quality - previous_quality
  
  IF quality_improvement < minimum_improvement_threshold:
    # Diminishing returns detected
    escalate_to_human_expert()
    BREAK
  
  iterations += 1
  previous_quality = updated_quality
```

### Phase 5: Advanced Pattern Recognition

#### 5.1 Trend Detection Algorithm
**Temporal Pattern Analysis:**
```
timeline_data = extract_temporal_data_points(knowledge_base)

FOR EACH data_series IN timeline_data:
  trend_analysis = {
    "direction": calculate_trend_direction(data_series),
    "strength": calculate_trend_strength(data_series),
    "consistency": assess_trend_consistency(data_series),
    "acceleration": detect_acceleration_patterns(data_series),
    "inflection_points": identify_trend_changes(data_series)
  }
  
  IF trend_analysis.strength > significance_threshold:
    significant_trends.add(trend_analysis)
```

**Cross-Correlation Detection:**
```
variables = extract_quantitative_variables(knowledge_base)

FOR EACH variable_pair IN combinations(variables, 2):
  correlation = calculate_correlation(variable_pair[0], variable_pair[1])
  
  IF abs(correlation) > correlation_threshold:
    relationships.add({
      "variables": variable_pair,
      "correlation_strength": correlation,
      "statistical_significance": test_significance(variable_pair),
      "causal_hypothesis": suggest_causal_relationship(variable_pair),
      "supporting_evidence": find_supporting_literature(variable_pair)
    })
```

#### 5.2 Weak Signal Detection
**Emerging Pattern Identification:**
```
content_frequency = analyze_term_frequency_trends(knowledge_base)
source_emergence = track_new_source_patterns(knowledge_base)
expert_attention = monitor_expert_discussion_patterns(knowledge_base)

weak_signals = []

FOR EACH pattern IN content_frequency:
  IF pattern.growth_rate > emergence_threshold AND pattern.recency > newness_threshold:
    signal_strength = calculate_signal_strength(pattern)
    potential_impact = assess_potential_impact(pattern)
    
    weak_signals.add({
      "pattern": pattern,
      "strength": signal_strength,
      "potential_impact": potential_impact,
      "monitoring_recommendation": design_monitoring_strategy(pattern)
    })
```

### Phase 6: Intelligence Synthesis

#### 6.1 Multi-Source Integration
**Consensus Building:**
```
FOR EACH research_question:
  source_responses = extract_question_responses(knowledge_base, research_question)
  
  consensus_analysis = {
    "strong_consensus": identify_unanimous_agreement(source_responses),
    "majority_consensus": identify_majority_agreement(source_responses),
    "conflicting_views": identify_disagreements(source_responses),
    "outlier_opinions": identify_outlier_positions(source_responses)
  }
  
  synthesized_answer = build_nuanced_response(consensus_analysis)
  confidence_level = calculate_answer_confidence(consensus_analysis)
```

#### 6.2 Strategic Insight Generation
**Opportunity Identification:**
```
market_gaps = identify_market_gaps(competitive_analysis)
technology_opportunities = identify_tech_opportunities(trend_analysis)
regulatory_opportunities = identify_regulatory_opportunities(legal_analysis)

FOR EACH opportunity IN [market_gaps, technology_opportunities, regulatory_opportunities]:
  opportunity_assessment = {
    "size_estimate": estimate_opportunity_size(opportunity),
    "accessibility": assess_market_entry_barriers(opportunity),
    "competition_level": assess_competitive_intensity(opportunity),
    "timing_factors": identify_optimal_timing(opportunity),
    "risk_factors": identify_key_risks(opportunity),
    "strategic_fit": assess_organizational_fit(opportunity)
  }
  
  strategic_opportunities.add(opportunity_assessment)
```

## Output Artifacts

### 1. Search Strategy Report
- Keyword strategy matrix with performance metrics
- Source prioritization framework with quality scores
- Search execution log with query performance data
- MCP integration effectiveness analysis

### 2. Information Quality Assessment
- Completeness scores by research question
- Source credibility distribution analysis
- Cross-verification matrix with confidence levels
- Information gap analysis with remediation strategies

### 3. Intelligence Synthesis Document
- Consolidated findings with source attribution
- Consensus analysis and conflicting viewpoints
- Trend analysis with pattern recognition results
- Strategic insights and opportunity identification

### 4. Reinforcement Documentation (if applicable)
- Gap analysis with specific improvement targets
- Intensification strategies employed
- Quality improvement metrics
- Diminishing returns analysis

## Quality Gates

### Information Quality Thresholds
- **Completeness:** >= 85% of research questions adequately answered
- **Source Credibility:** Average >= 8.0/10 across all sources
- **Verification:** >= 80% of major findings verified by 3+ sources
- **Freshness:** >= 75% of information less than 12 months old

### Search Strategy Effectiveness
- **Query Performance:** >= 70% relevant results in top 20
- **Source Diversity:** >= 5 different source types represented
- **Geographic Coverage:** Appropriate to research scope
- **Temporal Coverage:** Spans relevant time periods

### Pattern Recognition Validation
- **Trend Significance:** Statistical significance >= 95%
- **Correlation Strength:** |r| >= 0.7 for claimed relationships
- **Weak Signal Validation:** >= 3 independent emergence indicators
- **Expert Consensus:** >= 60% expert agreement on major trends

## Best Practices

### Search Query Optimization
- Start broad, then narrow systematically
- Use domain-specific terminology when targeting expert sources
- Employ temporal filters strategically based on information decay rates
- Combine multiple search strategies for comprehensive coverage

### Source Credibility Management
- Maintain minimum 30% Tier 1 sources for critical findings
- Cross-reference controversial claims across source tiers
- Document source limitations and potential biases
- Update credibility assessments based on verification results

### Information Gap Resolution
- Prioritize gaps by strategic importance and feasibility
- Use reinforcement searches judiciously to avoid diminishing returns
- Escalate persistent gaps to domain experts when appropriate
- Document gap resolution strategies for future research

### Quality Assurance
- Implement continuous quality monitoring throughout the process
- Validate major findings through multiple verification methods
- Maintain detailed audit trail of all search and analysis decisions
- Conduct post-research quality review with stakeholder feedback

## Integration with BMAD Workflow

This task integrates seamlessly with the research-intensive workflow:
- Triggered by search-specialist agent in discovery and reinforcement phases
- Outputs feed directly into competitive analysis and trend detection phases
- Quality gates align with overall research validation requirements
- Documentation standards support final intelligence packaging phase