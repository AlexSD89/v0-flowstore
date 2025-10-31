# Agent OS客户引导模板 - v4.0增强版

## 客户配置模板结构

### 基础信息配置
```yaml
client_basic_info:
  client_name: "{{client_name}}"
  client_slug: "{{client_slug}}"
  industry: "{{industry}}"
  company_size: "{{company_size}}"
  target_audience: "{{target_audience}}"
  business_objectives: "{{business_objectives}}"

  contact_information:
    primary_contact: "{{primary_contact_name}}"
    email: "{{primary_contact_email}}"
    phone: "{{primary_contact_phone}}"
    role: "{{primary_contact_role}}"

  project_timeline:
    start_date: "{{project_start_date}}"
    expected_duration: "{{expected_duration}}"
    key_milestones: "{{key_milestones}}"
    success_criteria: "{{success_criteria}}"
```

### 品牌调性配置 - 增强版
```yaml
brand_personality_v4:
  core_brand_attributes:
    brand_archetype: "{{brand_archetype}}"
    personality_traits: "{{personality_traits}}"
    communication_style: "{{communication_style}}"
    value_proposition: "{{value_proposition}}"

  voice_guidelines:
    tone_characteristics:
      warmth: "{{tone_warmth_score}}" # 0-1 scale
      authority: "{{tone_authority_score}}" # 0-1 scale
      innovation: "{{tone_innovation_score}}" # 0-1 scale
      tradition: "{{tone_tradition_score}}" # 0-1 scale

    linguistic_patterns:
      vocabulary_level: "{{vocabulary_complexity}}"
      sentence_preference: "{{sentence_structure_preference}}"
      formality_level: "{{formality_level}}"
      emotionality: "{{emotional_expression_level}}"

  content_guidelines:
    must_have_elements: "{{required_content_elements}}"
    forbidden_topics: "{{prohibited_topics}}"
    preferred_formats: "{{preferred_content_formats}}"
    storytelling_approach: "{{storytelling_methodology}}"

  visual_identity:
    color_palette:
      primary_color: "{{primary_color_hex}}"
      secondary_color: "{{secondary_color_hex}}"
      accent_colors: "{{accent_color_list}}"

    typography:
      headline_font: "{{headline_font_family}}"
      body_font: "{{body_font_family}}"
      brand_fonts: "{{additional_brand_fonts}}"

    imagery_style:
      photography_style: "{{photography_style_description}}"
      illustration_approach: "{{illustration_style}}"
      visual_mood: "{{overall_visual_mood}}"
```

### Agent OS配置集成
```yaml
agent_os_integration:
  agent_configuration:
    trend_analyst_config:
      industry_focus: "{{industry_trend_focus}}"
      competitor_monitoring: "{{competitor_tracking_list}}"
      trend_sources: "{{trend_data_sources}}"
      analysis_depth: "{{trend_analysis_depth}}"

    content_creator_config:
      brand_consistency_enforcement: "{{brand_consistency_level}}"
      content_variation_strategy: "{{content_diversification_approach}}"
      optimization_goals: "{{content_optimization_objectives}}"
      creative_constraints: "{{creative_boundary_rules}}"

    brand_matcher_config:
      matching_algorithm: "{{brand_matching_algorithm}}"
      confidence_threshold: "{{brand_match_confidence_threshold}}"
      learning_rate: "{{brand_learning_rate}}"
      adaptation_frequency: "{{brand_adaptation_schedule}}"

    engagement_optimizer_config:
      optimization_targets: "{{engagement_optimization_targets}}"
      platform_specific_strategies: "{{platform_engagement_strategies}}"
      timing_optimization: "{{publishing_timing_optimization}}"
      interaction_stimulation: "{{interaction_enhancement_techniques}}"

  collaboration_configuration:
    workflow_design:
      collaboration_type: "{{primary_collaboration_type}}"
      agent_coordination_strategy: "{{agent_coordination_method}}"
      decision_making_process: "{{agent_decision_making_flow}}"
      conflict_resolution: "{{agent_conflict_resolution_mechanism}}"

    performance_monitoring:
      success_metrics: "{{agent_performance_metrics}}"
      monitoring_frequency: "{{performance_monitoring_interval}}"
      alert_thresholds: "{{performance_alert_thresholds}}"
      optimization_schedule: "{{agent_optimization_schedule}}"
```

### 内容策略配置 - AI增强
```yaml
content_strategy_ai_enhanced:
  content_pillars:
    primary_pillars: "{{primary_content_pillars}}"
    secondary_pillars: "{{secondary_content_pillars}}"
    seasonal_content: "{{seasonal_content_plans}}"
    campaign_content: "{{campaign_content_strategies}}"

  ai_content_generation:
    generation_parameters:
      creativity_level: "{{ai_creativity_setting}}" # conservative, balanced, innovative
      brand_adherence: "{{brand_consistency_enforcement}}" # strict, moderate, flexible
      trend_integration: "{{trend_incorporation_level}}" # minimal, moderate, aggressive
      personalization_depth: "{{content_personalization_level}}"

    quality_control:
      automated_review: "{{ai_quality_check_enabled}}"
      human_review_required: "{{human_review_triggers}}"
      compliance_checking: "{{automated_compliance_validation}}"
      performance_prediction: "{{content_success_prediction}}"

  publishing_strategy:
    platform_optimization:
      xiaohongshu_strategy:
        posting_frequency: "{{xhs_posting_frequency}}"
        optimal_timing: "{{xhs_optimal_posting_times}}"
        hashtag_strategy: "{{xhs_hashtag_approach}}"
        interaction_protocol: "{{xhs_community_engagement_plan}}"

    content_mix:
      educational_content_ratio: "{{educational_content_percentage}}"
      promotional_content_ratio: "{{promotional_content_percentage}}"
      entertainment_content_ratio: "{{entertainment_content_percentage}}"
      community_content_ratio: "{{community_content_percentage}}"
```

### 数据与分析配置
```yaml
analytics_configuration:
  tracking_setup:
    key_performance_indicators:
      engagement_metrics: "{{engagement_kpi_list}}"
      conversion_metrics: "{{conversion_kpi_list}}"
      brand_metrics: "{{brand_health_kpi_list}}"
      content_metrics: "{{content_performance_kpi_list}}"

    data_sources:
      platform_analytics: "{{platform_analytics_integrations}}"
      custom_tracking: "{{custom_tracking_implementations}}"
      third_party_tools: "{{third_party_analytics_tools}}"
      manual_data_collection: "{{manual_data_collection_processes}}"

  reporting_framework:
    automated_reports:
      daily_dashboard: "{{daily_dashboard_configuration}}"
      weekly_insights: "{{weekly_insight_report_setup}}"
      monthly_analysis: "{{monthly_analysis_report_setup}}"
      quarterly_review: "{{quarterly_business_review_setup}}"

    custom_analytics:
      trend_analysis: "{{trend_analysis_configuration}}"
      competitor_analysis: "{{competitor_analytics_setup}}"
      audience_analysis: "{{audience_insights_configuration}}"
      content_analysis: "{{content_performance_analysis_setup}}"
```

### 技术集成配置
```yaml
technical_integration:
  mcp_services_configuration:
    primary_services:
      - name: "xiaohongshu-mcp"
        configuration: "{{xiaohongshu_mcp_config}}"
        authentication: "{{xiaohongshu_auth_setup}}"

      - name: "rube-mcp"
        configuration: "{{rube_mcp_config}}"
        authentication: "{{rube_auth_setup}}"

    auxiliary_services:
      - name: "tavily-search"
        configuration: "{{tavily_search_config}}"
        api_keys: "{{tavily_api_credentials}}"

      - name: "analytics-mcp"
        configuration: "{{analytics_mcp_config}}"
        data_pipeline: "{{analytics_pipeline_setup}}"

  api_integrations:
    internal_apis:
      - content_management_api: "{{content_api_configuration}}"
      - user_management_api: "{{user_api_configuration}}"
      - analytics_api: "{{analytics_api_configuration}}"

    external_apis:
      - social_media_apis: "{{social_media_api_setup}}"
      - analytics_services: "{{external_analytics_setup}}"
      - content_distribution: "{{content_distribution_api_config}}"

  data_storage:
    content_storage:
      type: "{{content_storage_type}}"
      configuration: "{{content_storage_config}}"
      backup_strategy: "{{content_backup_plan}}"

    analytics_storage:
      type: "{{analytics_storage_type}}"
      configuration: "{{analytics_storage_config}}"
      retention_policy: "{{analytics_retention_policy}}"
```

### 运营流程配置
```yaml
operational_workflows:
  content_creation_workflow:
    stages:
      - stage: "intelligence_gathering"
        agents: ["trend_analyst"]
        tools: ["rube-mcp", "tavily-search"]
        output_format: "intel_report.json"
        quality_gates: "{{intel_quality_gates}}"

      - stage: "content_generation"
        agents: ["content_creator", "brand_matcher"]
        tools: ["claude-llm", "brand_database"]
        output_format: "content_drafts.json"
        quality_gates: "{{content_quality_gates}}"

      - stage: "optimization"
        agents: ["engagement_optimizer"]
        tools: ["performance_predictor", "timing_optimizer"]
        output_format: "optimized_content.json"
        quality_gates: "{{optimization_quality_gates}}"

      - stage: "publishing"
        agents: ["content_creator"]
        tools: ["xiaohongshu-mcp", "scheduler"]
        output_format: "published_content_log.json"
        quality_gates: "{{publishing_quality_gates}}"

  review_and_approval:
    approval_hierarchy: "{{content_approval_hierarchy}}"
    review_checkpoints: "{{content_review_checkpoints}}"
    escalation_triggers: "{{approval_escalation_conditions}}"
    emergency_publishing: "{{emergency_publishing_protocol}}"

  monitoring_and_optimization:
    performance_monitoring: "{{content_performance_monitoring_setup}}"
    automated_optimization: "{{automated_optimization_configuration}}"
    learning_integration: "{{learning_engine_integration_setup}}"
    feedback_loops: "{{feedback_loop_configuration}}"
```

## 配置生成指令

### 模板变量替换规则
```yaml
template_variables:
  customer_provided:
    - client_name
    - client_slug
    - industry
    - target_audience
    - brand_guidelines
    - business_objectives

  system_generated:
    - project_id
    - configuration_timestamp
    - agent_assignments
    - workflow_customization
    - integration_setup

  default_values:
    - ai_model_selection
    - performance_thresholds
    - monitoring_frequency
    - backup_configurations
    - security_settings
```

### 引导流程步骤
```yaml
onboarding_steps:
  1. basic_info_collection:
     description: "收集客户基础信息"
     required_fields: ["client_name", "industry", "target_audience"]
     validation_rules: "{{basic_info_validation_rules}}"

  2. brand_configuration:
     description: "配置品牌调性和指导原则"
     required_fields: ["brand_voice", "visual_guidelines", "content_restrictions"]
     ai_assistance: "brand_analysis_agent"

  3. agent_setup:
     description: "配置专业化Agent参数"
     required_fields: ["agent_preferences", "collaboration_type", "performance_targets"]
     ai_assistance: "agent_configuration_specialist"

  4. integration_configuration:
     description: "设置技术集成和数据流"
     required_fields: ["mcp_services", "api_integrations", "data_storage"]
     technical_assistance: "integration_specialist"

  5. workflow_customization:
     description: "定制运营工作流程"
     required_fields: ["content_workflow", "approval_process", "monitoring_setup"]
     ai_assistance: "workflow_design_agent"

  6. testing_and_validation:
     description: "测试配置并验证功能"
     validation_steps: "{{configuration_validation_steps}}"
     success_criteria: "{{onboarding_success_criteria}}"
```