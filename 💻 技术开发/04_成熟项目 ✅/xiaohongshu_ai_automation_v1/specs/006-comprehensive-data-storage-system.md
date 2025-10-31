# 综合数据存储系统规格 | Comprehensive Data Storage System Specification
# XiaoHongShu AI Automation System v1.0

**文档版本**: v1.0  
**创建时间**: 2025-09-23_162845  
**负责人**: LaunchX Data Architecture Team  
**更新周期**: 每月更新  

## 🗄️ 数据存储理念 - "所有留痕，智能检索"

### 核心设计原则 (参考微博项目存储机制)

```yaml
数据全留痕原则:
  收集留痕: "所有数据收集过程必须记录来源、时间、方法"
  处理留痕: "数据处理的每个步骤都要记录算法、参数、结果"
  决策留痕: "AI决策过程要记录推理逻辑、置信度、影响因素"
  执行留痕: "策略执行结果要记录效果、反馈、学习点"
  
数据流动追踪:
  源头标识: "每条数据都有唯一来源标识和采集时间戳"
  处理链路: "完整记录数据从采集到应用的全流程"
  版本管控: "数据更新和模型迭代的版本管理"
  影响分析: "数据变化对下游决策的影响追踪"

智能检索优化:
  多维索引: "时间、类型、来源、质量等多维度快速检索"
  关联发现: "自动发现数据间的关联关系和依赖"
  智能推荐: "基于使用模式推荐相关数据和洞察"
  异常检测: "自动识别数据异常和质量问题"
```

## 📊 完整数据存储架构设计

### 1. 核心业务数据存储表

```sql
-- ===============================
-- 账号管理和运营数据存储
-- ===============================

-- 小红书账号基础信息表
CREATE TABLE xhs_accounts (
    id SERIAL PRIMARY KEY,
    account_id VARCHAR(100) NOT NULL UNIQUE COMMENT '小红书账号ID',
    account_name VARCHAR(200) NOT NULL COMMENT '账号名称',
    account_type VARCHAR(50) NOT NULL COMMENT '账号类型(personal|brand|kol)',
    industry_category VARCHAR(100) COMMENT '行业分类',
    client_company VARCHAR(200) COMMENT '客户公司名称',
    mcp_port INTEGER NOT NULL COMMENT 'MCP服务端口号',
    sentiment_enabled BOOLEAN DEFAULT TRUE COMMENT '是否启用情感分析功能',
    sentiment_model_version VARCHAR(50) DEFAULT 'v1.0' COMMENT '使用的情感分析模型版本',
    automation_config JSONB COMMENT '自动化配置参数',
    account_status VARCHAR(20) DEFAULT 'active' COMMENT '账号状态',
    follower_count INTEGER DEFAULT 0 COMMENT '粉丝数量',
    following_count INTEGER DEFAULT 0 COMMENT '关注数量',
    total_notes INTEGER DEFAULT 0 COMMENT '总笔记数',
    total_likes INTEGER DEFAULT 0 COMMENT '总获赞数',
    account_level INTEGER DEFAULT 1 COMMENT '账号等级',
    authentication_status VARCHAR(50) COMMENT '认证状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 每日内容发布记录表
CREATE TABLE daily_content_posts (
    id SERIAL PRIMARY KEY,
    account_id VARCHAR(100) NOT NULL,
    post_id VARCHAR(100) NOT NULL COMMENT '小红书帖子ID',
    post_type VARCHAR(50) NOT NULL COMMENT '内容类型(image|video|carousel)',
    title VARCHAR(500) NOT NULL COMMENT '标题',
    content_text TEXT COMMENT '正文内容',
    hashtags TEXT[] COMMENT '话题标签数组',
    image_urls TEXT[] COMMENT '图片链接数组',
    video_url VARCHAR(500) COMMENT '视频链接',
    publish_time TIMESTAMP NOT NULL COMMENT '发布时间',
    scheduled_time TIMESTAMP COMMENT '计划发布时间',
    content_strategy_id INTEGER COMMENT '关联的内容策略ID',
    ai_generated BOOLEAN DEFAULT false COMMENT '是否AI生成',
    generation_prompt TEXT COMMENT 'AI生成时的提示词',
    post_status VARCHAR(20) DEFAULT 'published' COMMENT '发布状态',
    raw_response JSONB COMMENT '发布接口返回的原始数据',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES xhs_accounts(account_id)
);

-- 内容表现数据表 (实时更新)
CREATE TABLE content_performance_metrics (
    id SERIAL PRIMARY KEY,
    account_id VARCHAR(100) NOT NULL,
    post_id VARCHAR(100) NOT NULL,
    metric_date DATE NOT NULL COMMENT '指标统计日期',
    views_count INTEGER DEFAULT 0 COMMENT '浏览量',
    likes_count INTEGER DEFAULT 0 COMMENT '点赞数',
    comments_count INTEGER DEFAULT 0 COMMENT '评论数',
    shares_count INTEGER DEFAULT 0 COMMENT '分享数',
    saves_count INTEGER DEFAULT 0 COMMENT '收藏数',
    engagement_rate DECIMAL(5,4) COMMENT '互动率',
    reach_count INTEGER DEFAULT 0 COMMENT '触达人数',
    click_rate DECIMAL(5,4) COMMENT '点击率',
    conversion_count INTEGER DEFAULT 0 COMMENT '转化次数',
    conversion_rate DECIMAL(5,4) COMMENT '转化率',
    audience_retention_rate DECIMAL(5,4) COMMENT '观众留存率',
    viral_coefficient DECIMAL(6,4) COMMENT '病毒系数',
    quality_score DECIMAL(3,2) COMMENT '内容质量得分',
    trend_momentum DECIMAL(4,2) COMMENT '趋势动量',
    data_source VARCHAR(50) DEFAULT 'xiaohongshu_api' COMMENT '数据来源',
    collected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES xhs_accounts(account_id),
    UNIQUE KEY unique_daily_metrics (account_id, post_id, metric_date)
);

-- ===============================
-- 用户互动和客服数据存储
-- ===============================

-- 用户评论和互动记录表
CREATE TABLE user_interactions (
    id SERIAL PRIMARY KEY,
    account_id VARCHAR(100) NOT NULL,
    post_id VARCHAR(100) NOT NULL,
    interaction_type VARCHAR(50) NOT NULL COMMENT '互动类型(comment|like|share|dm)',
    user_id VARCHAR(100) NOT NULL COMMENT '互动用户ID',
    user_name VARCHAR(200) COMMENT '用户昵称',
    interaction_content TEXT COMMENT '互动内容(评论文字等)',
    interaction_time TIMESTAMP NOT NULL,
    user_follower_count INTEGER COMMENT '用户粉丝数',
    user_level INTEGER COMMENT '用户等级',
    sentiment_score DECIMAL(3,2) COMMENT '情感分析得分',
    intent_category VARCHAR(100) COMMENT '意图分类',
    response_required BOOLEAN DEFAULT false COMMENT '是否需要回复',
    ai_response_generated BOOLEAN DEFAULT false COMMENT '是否已生成AI回复',
    response_status VARCHAR(20) DEFAULT 'pending' COMMENT '回复状态',
    raw_data JSONB COMMENT '原始互动数据',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES xhs_accounts(account_id)
);

-- AI自动回复记录表
CREATE TABLE ai_auto_responses (
    id SERIAL PRIMARY KEY,
    account_id VARCHAR(100) NOT NULL,
    original_interaction_id INTEGER NOT NULL,
    response_type VARCHAR(50) NOT NULL COMMENT '回复类型(comment_reply|dm_reply)',
    response_content TEXT NOT NULL COMMENT '回复内容',
    response_template_id INTEGER COMMENT '使用的回复模板ID',
    generation_strategy VARCHAR(100) COMMENT '生成策略',
    generation_prompt TEXT COMMENT '生成提示词',
    claude_model_version VARCHAR(50) COMMENT '使用的Claude模型版本',
    response_confidence DECIMAL(3,2) COMMENT '回复置信度',
    response_time TIMESTAMP NOT NULL COMMENT '回复时间',
    customer_satisfaction_score INTEGER COMMENT '客户满意度(1-5)',
    follow_up_action VARCHAR(100) COMMENT '后续行动',
    effectiveness_score DECIMAL(3,2) COMMENT '回复效果得分',
    human_reviewed BOOLEAN DEFAULT false COMMENT '是否经过人工审核',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES xhs_accounts(account_id),
    FOREIGN KEY (original_interaction_id) REFERENCES user_interactions(id)
);

-- ===============================
-- 竞品分析数据存储 (完整留痕)
-- ===============================

-- 竞品账号档案表
CREATE TABLE competitor_profiles (
    id SERIAL PRIMARY KEY,
    competitor_account_id VARCHAR(100) NOT NULL,
    competitor_name VARCHAR(200) NOT NULL,
    industry_category VARCHAR(100),
    account_type VARCHAR(50),
    follower_count INTEGER,
    following_count INTEGER,
    total_notes INTEGER,
    avg_engagement_rate DECIMAL(5,4),
    content_posting_frequency DECIMAL(4,2) COMMENT '日均发布频率',
    account_creation_date DATE,
    last_active_date DATE,
    competitive_level VARCHAR(20) COMMENT '竞争等级(low|medium|high)',
    monitoring_priority INTEGER DEFAULT 5 COMMENT '监控优先级(1-10)',
    analysis_tags TEXT[] COMMENT '分析标签',
    data_collection_method VARCHAR(100) COMMENT '数据收集方法',
    last_analyzed_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 竞品内容监控表
CREATE TABLE competitor_content_monitoring (
    id SERIAL PRIMARY KEY,
    competitor_account_id VARCHAR(100) NOT NULL,
    post_id VARCHAR(100) NOT NULL,
    content_type VARCHAR(50),
    title VARCHAR(500),
    content_abstract TEXT,
    hashtags TEXT[],
    publish_time TIMESTAMP,
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,4),
    content_category VARCHAR(100),
    trending_status VARCHAR(20) COMMENT '趋势状态(rising|hot|declining)',
    viral_potential_score DECIMAL(3,2) COMMENT '病毒传播潜力得分',
    content_quality_score DECIMAL(3,2),
    monitored_date DATE NOT NULL,
    analysis_insights JSONB COMMENT '分析洞察',
    learning_value DECIMAL(3,2) COMMENT '学习价值评分',
    copied_strategy BOOLEAN DEFAULT false COMMENT '是否已借鉴策略',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (competitor_account_id) REFERENCES competitor_profiles(competitor_account_id)
);

-- ===============================
-- AI学习和优化数据存储
-- ===============================

-- 策略执行历史详细记录表
CREATE TABLE strategy_execution_detailed_log (
    id SERIAL PRIMARY KEY,
    account_id VARCHAR(100) NOT NULL,
    execution_session_id VARCHAR(100) NOT NULL COMMENT '执行会话ID',
    strategy_type VARCHAR(50) NOT NULL COMMENT '策略类型',
    strategy_name VARCHAR(200) NOT NULL,
    execution_stage VARCHAR(50) NOT NULL COMMENT '执行阶段',
    input_parameters JSONB NOT NULL COMMENT '输入参数',
    processing_details JSONB COMMENT '处理细节',
    intermediate_results JSONB COMMENT '中间结果',
    output_results JSONB COMMENT '输出结果',
    execution_status VARCHAR(20) COMMENT '执行状态',
    error_details TEXT COMMENT '错误详情',
    performance_metrics JSONB COMMENT '性能指标',
    resource_usage JSONB COMMENT '资源使用情况',
    execution_duration_seconds INTEGER COMMENT '执行耗时(秒)',
    mcp_tools_used TEXT[] COMMENT '使用的MCP工具列表',
    claude_api_calls INTEGER DEFAULT 0 COMMENT 'Claude API调用次数',
    data_sources_accessed TEXT[] COMMENT '访问的数据源',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES xhs_accounts(account_id)
);

-- AI决策推理记录表
CREATE TABLE ai_decision_reasoning_log (
    id SERIAL PRIMARY KEY,
    account_id VARCHAR(100) NOT NULL,
    decision_id VARCHAR(100) NOT NULL COMMENT '决策唯一ID',
    decision_type VARCHAR(100) NOT NULL COMMENT '决策类型',
    decision_context JSONB NOT NULL COMMENT '决策上下文',
    input_data JSONB NOT NULL COMMENT '输入数据',
    reasoning_steps JSONB NOT NULL COMMENT '推理步骤',
    considered_alternatives JSONB COMMENT '考虑的备选方案',
    decision_criteria JSONB COMMENT '决策标准',
    confidence_score DECIMAL(3,2) NOT NULL COMMENT '决策置信度',
    risk_assessment JSONB COMMENT '风险评估',
    expected_outcome JSONB COMMENT '预期结果',
    final_decision JSONB NOT NULL COMMENT '最终决策',
    decision_rationale TEXT COMMENT '决策理由',
    human_oversight_required BOOLEAN DEFAULT false,
    model_version VARCHAR(50) COMMENT '使用的AI模型版本',
    decision_timestamp TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES xhs_accounts(account_id)
);

-- 学习效果评估记录表
CREATE TABLE learning_effectiveness_evaluation (
    id SERIAL PRIMARY KEY,
    account_id VARCHAR(100) NOT NULL,
    evaluation_period_start DATE NOT NULL,
    evaluation_period_end DATE NOT NULL,
    learning_category VARCHAR(100) NOT NULL COMMENT '学习类别',
    baseline_metrics JSONB NOT NULL COMMENT '基线指标',
    current_metrics JSONB NOT NULL COMMENT '当前指标',
    improvement_metrics JSONB NOT NULL COMMENT '改进指标',
    learning_sources JSONB COMMENT '学习数据源',
    successful_adaptations JSONB COMMENT '成功的适应性调整',
    failed_attempts JSONB COMMENT '失败的尝试',
    key_insights JSONB COMMENT '关键洞察',
    optimization_opportunities JSONB COMMENT '优化机会',
    next_learning_focus JSONB COMMENT '下期学习重点',
    overall_learning_score DECIMAL(3,2) COMMENT '整体学习效果得分',
    model_version_before VARCHAR(50),
    model_version_after VARCHAR(50),
    evaluation_method VARCHAR(100) COMMENT '评估方法',
    evaluator VARCHAR(50) DEFAULT 'AI_AUTO' COMMENT '评估者',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES xhs_accounts(account_id)
);

-- ===============================
-- 系统运行和监控数据存储
-- ===============================

-- MCP工具调用日志表
CREATE TABLE mcp_tool_call_logs (
    id SERIAL PRIMARY KEY,
    account_id VARCHAR(100),
    session_id VARCHAR(100) NOT NULL,
    tool_name VARCHAR(200) NOT NULL,
    tool_category VARCHAR(100) COMMENT '工具分类',
    call_timestamp TIMESTAMP NOT NULL,
    input_parameters JSONB,
    output_results JSONB,
    execution_status VARCHAR(20) NOT NULL,
    error_message TEXT,
    execution_duration_ms INTEGER COMMENT '执行耗时(毫秒)',
    memory_usage_mb DECIMAL(10,2) COMMENT '内存使用(MB)',
    api_cost DECIMAL(10,4) COMMENT 'API调用成本',
    rate_limit_hit BOOLEAN DEFAULT false,
    retry_count INTEGER DEFAULT 0,
    success_rate DECIMAL(3,2) COMMENT '成功率',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 系统性能监控表
CREATE TABLE system_performance_monitoring (
    id SERIAL PRIMARY KEY,
    monitor_timestamp TIMESTAMP NOT NULL,
    account_id VARCHAR(100),
    metric_category VARCHAR(100) NOT NULL COMMENT '指标类别',
    metric_name VARCHAR(200) NOT NULL,
    metric_value DECIMAL(15,4) NOT NULL,
    metric_unit VARCHAR(50),
    threshold_warning DECIMAL(15,4),
    threshold_critical DECIMAL(15,4),
    status VARCHAR(20) DEFAULT 'normal' COMMENT 'normal|warning|critical',
    additional_context JSONB,
    alert_triggered BOOLEAN DEFAULT false,
    alert_level VARCHAR(20),
    resolution_action TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 数据质量监控表
CREATE TABLE data_quality_monitoring (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(200) NOT NULL,
    account_id VARCHAR(100),
    check_timestamp TIMESTAMP NOT NULL,
    quality_dimension VARCHAR(100) NOT NULL COMMENT '质量维度(completeness|accuracy|consistency|timeliness)',
    quality_score DECIMAL(3,2) NOT NULL COMMENT '质量得分(0-1)',
    total_records INTEGER,
    valid_records INTEGER,
    invalid_records INTEGER,
    null_count INTEGER,
    duplicate_count INTEGER,
    outlier_count INTEGER,
    quality_issues JSONB COMMENT '质量问题详情',
    improvement_suggestions TEXT[],
    remediation_actions JSONB COMMENT '修复行动',
    data_lineage JSONB COMMENT '数据血缘',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- 情感分析数据存储 (新增) 
-- ===============================

-- 内容情感分析结果表
CREATE TABLE xhs_content_sentiment_analysis (
    id SERIAL PRIMARY KEY,
    content_id VARCHAR(100) NOT NULL COMMENT '内容ID(笔记/评论ID)',
    content_type VARCHAR(20) NOT NULL COMMENT '内容类型(note|comment|user_profile)',
    account_id VARCHAR(100) COMMENT '关联账号ID',
    original_text TEXT NOT NULL COMMENT '原始文本内容',
    processed_text TEXT COMMENT '预处理后的文本',
    sentiment_label VARCHAR(20) NOT NULL COMMENT '情感标签(非常正面|正面|中性|负面|非常负面)',
    confidence_score DECIMAL(5,4) NOT NULL COMMENT '置信度分数(0-1)',
    probability_distribution JSONB COMMENT '各情感的概率分布',
    text_length INTEGER COMMENT '文本长度',
    language_detected VARCHAR(20) COMMENT '检测到的语言',
    emotional_keywords JSONB COMMENT '情感关键词数组',
    analysis_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    model_version VARCHAR(50) DEFAULT 'v1.0' COMMENT '使用的模型版本',
    processing_time_ms INTEGER COMMENT '处理耗时(毫秒)',
    
    -- 索引优化
    INDEX idx_content_sentiment_content_id (content_id),
    INDEX idx_content_sentiment_account_id (account_id),
    INDEX idx_content_sentiment_timestamp (analysis_timestamp),
    INDEX idx_content_sentiment_label (sentiment_label),
    INDEX idx_content_sentiment_confidence (confidence_score),
    
    -- 外键约束
    FOREIGN KEY (account_id) REFERENCES xhs_accounts(account_id) ON DELETE CASCADE
);

-- 批量情感分析任务表
CREATE TABLE xhs_batch_sentiment_tasks (
    id SERIAL PRIMARY KEY,
    task_id VARCHAR(100) NOT NULL UNIQUE COMMENT '批量任务唯一ID',
    account_id VARCHAR(100) COMMENT '关联账号ID',
    task_name VARCHAR(200) NOT NULL COMMENT '任务名称',
    content_source VARCHAR(50) COMMENT '内容来源(scraped_notes|scraped_comments|uploaded)',
    total_content_count INTEGER DEFAULT 0 COMMENT '总内容数量',
    processed_count INTEGER DEFAULT 0 COMMENT '已处理数量',
    success_count INTEGER DEFAULT 0 COMMENT '成功处理数量',
    failed_count INTEGER DEFAULT 0 COMMENT '失败数量',
    task_status VARCHAR(20) DEFAULT 'pending' COMMENT '任务状态(pending|processing|completed|failed)',
    sentiment_distribution JSONB COMMENT '情感分布统计结果',
    average_confidence DECIMAL(5,4) COMMENT '平均置信度',
    task_start_time TIMESTAMP WITH TIME ZONE,
    task_end_time TIMESTAMP WITH TIME ZONE,
    error_message TEXT COMMENT '错误信息',
    task_config JSONB COMMENT '任务配置参数',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 索引
    INDEX idx_batch_sentiment_task_id (task_id),
    INDEX idx_batch_sentiment_account_id (account_id),
    INDEX idx_batch_sentiment_status (task_status),
    INDEX idx_batch_sentiment_created (created_at)
);

-- 情感趋势分析表
CREATE TABLE xhs_sentiment_trend_analysis (
    id SERIAL PRIMARY KEY,
    analysis_id VARCHAR(100) NOT NULL UNIQUE COMMENT '趋势分析唯一ID',
    account_id VARCHAR(100) COMMENT '关联账号ID',
    time_period VARCHAR(20) NOT NULL COMMENT '分析时间窗口(1d|7d|30d)',
    start_date DATE NOT NULL COMMENT '分析开始日期',
    end_date DATE NOT NULL COMMENT '分析结束日期',
    sentiment_timeline JSONB NOT NULL COMMENT '情感时间线数据',
    trend_direction VARCHAR(20) COMMENT '趋势方向(improving|declining|stable|volatile)',
    trend_strength DECIMAL(3,2) COMMENT '趋势强度(0-1)',
    key_turning_points JSONB COMMENT '关键转折点',
    predictive_insights JSONB COMMENT '预测性洞察',
    content_sample_size INTEGER COMMENT '分析内容样本大小',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 索引
    INDEX idx_sentiment_trend_analysis_id (analysis_id),
    INDEX idx_sentiment_trend_account_id (account_id),
    INDEX idx_sentiment_trend_period (time_period),
    INDEX idx_sentiment_trend_date (start_date, end_date)
);

-- 竞品情感对比分析表
CREATE TABLE xhs_competitor_sentiment_comparison (
    id SERIAL PRIMARY KEY,
    comparison_id VARCHAR(100) NOT NULL UNIQUE COMMENT '对比分析唯一ID',
    main_account_id VARCHAR(100) NOT NULL COMMENT '主账号ID',
    competitor_accounts JSONB NOT NULL COMMENT '竞品账号列表',
    sentiment_scores JSONB NOT NULL COMMENT '各账号情感分数',
    sentiment_distribution JSONB NOT NULL COMMENT '各账号情感分布',
    competitive_advantages JSONB COMMENT '竞争优势分析',
    improvement_opportunities JSONB COMMENT '改进机会',
    market_position VARCHAR(20) COMMENT '市场位置(领先|中等|落后)',
    analysis_sample_size INTEGER COMMENT '分析样本大小',
    analysis_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 索引
    INDEX idx_competitor_sentiment_comparison_id (comparison_id),
    INDEX idx_competitor_sentiment_main_account (main_account_id),
    INDEX idx_competitor_sentiment_date (analysis_date)
);

-- 内容情感优化建议表
CREATE TABLE xhs_content_sentiment_optimization (
    id SERIAL PRIMARY KEY,
    optimization_id VARCHAR(100) NOT NULL UNIQUE COMMENT '优化建议唯一ID',
    content_id VARCHAR(100) NOT NULL COMMENT '内容ID',
    account_id VARCHAR(100) COMMENT '账号ID',
    current_sentiment_score DECIMAL(3,2) COMMENT '当前情感分数',
    optimization_potential DECIMAL(3,2) COMMENT '优化潜力(0-1)',
    specific_suggestions JSONB NOT NULL COMMENT '具体优化建议',
    predicted_improvement DECIMAL(3,2) COMMENT '预测改进效果',
    risk_assessment JSONB COMMENT '风险评估',
    implementation_status VARCHAR(20) DEFAULT 'pending' COMMENT '实施状态(pending|implemented|rejected)',
    actual_improvement DECIMAL(3,2) COMMENT '实际改进效果(实施后测量)',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    implemented_at TIMESTAMP WITH TIME ZONE,
    
    -- 索引
    INDEX idx_content_sentiment_opt_id (optimization_id),
    INDEX idx_content_sentiment_opt_content (content_id),
    INDEX idx_content_sentiment_opt_account (account_id),
    INDEX idx_content_sentiment_opt_status (implementation_status)
);

-- 用户情感人设分析表
CREATE TABLE xhs_user_sentiment_persona (
    id SERIAL PRIMARY KEY,
    persona_id VARCHAR(100) NOT NULL UNIQUE COMMENT '人设分析唯一ID',
    user_id VARCHAR(100) NOT NULL COMMENT '用户ID',
    account_id VARCHAR(100) COMMENT '分析的账号ID',
    sentiment_personality VARCHAR(50) COMMENT '情感人设类型',
    emotional_triggers JSONB COMMENT '情感触发词',
    content_preferences JSONB COMMENT '内容偏好',
    engagement_patterns JSONB COMMENT '互动模式',
    personalized_strategy JSONB COMMENT '个性化策略建议',
    interaction_sample_size INTEGER COMMENT '互动样本大小',
    confidence_level DECIMAL(3,2) COMMENT '分析置信度',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 索引
    INDEX idx_user_sentiment_persona_id (persona_id),
    INDEX idx_user_sentiment_user_id (user_id),
    INDEX idx_user_sentiment_account_id (account_id),
    INDEX idx_user_sentiment_personality (sentiment_personality)
);

-- 情感分析模型性能监控表
CREATE TABLE xhs_sentiment_model_performance (
    id SERIAL PRIMARY KEY,
    model_version VARCHAR(50) NOT NULL COMMENT '模型版本',
    evaluation_date DATE DEFAULT CURRENT_DATE,
    total_predictions INTEGER DEFAULT 0 COMMENT '总预测数',
    accuracy_score DECIMAL(5,4) COMMENT '准确率',
    precision_score DECIMAL(5,4) COMMENT '精确率',
    recall_score DECIMAL(5,4) COMMENT '召回率',
    f1_score DECIMAL(5,4) COMMENT 'F1分数',
    average_confidence DECIMAL(5,4) COMMENT '平均置信度',
    processing_speed_ms DECIMAL(8,2) COMMENT '平均处理速度(毫秒)',
    error_rate DECIMAL(5,4) COMMENT '错误率',
    model_config JSONB COMMENT '模型配置参数',
    performance_notes TEXT COMMENT '性能说明',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 索引
    INDEX idx_sentiment_model_version (model_version),
    INDEX idx_sentiment_model_date (evaluation_date),
    INDEX idx_sentiment_model_accuracy (accuracy_score)
);

-- ===============================
-- 报告和洞察存储
-- ===============================

-- 综合分析报告存储表
CREATE TABLE comprehensive_analysis_reports (
    id SERIAL PRIMARY KEY,
    account_id VARCHAR(100) NOT NULL,
    report_type VARCHAR(100) NOT NULL COMMENT '报告类型(daily|weekly|monthly|competitor|strategy)',
    report_subtype VARCHAR(100) COMMENT '报告子类型',
    report_period_start DATE NOT NULL,
    report_period_end DATE NOT NULL,
    report_title VARCHAR(500) NOT NULL,
    executive_summary TEXT NOT NULL,
    detailed_analysis JSONB NOT NULL COMMENT '详细分析内容',
    key_metrics JSONB NOT NULL COMMENT '关键指标',
    trends_analysis JSONB COMMENT '趋势分析',
    competitive_insights JSONB COMMENT '竞争洞察',
    actionable_recommendations JSONB NOT NULL COMMENT '可执行建议',
    risk_assessment JSONB COMMENT '风险评估',
    opportunity_analysis JSONB COMMENT '机会分析',
    next_period_strategy JSONB COMMENT '下期策略',
    supporting_data_sources JSONB COMMENT '支撑数据源',
    confidence_level DECIMAL(3,2) COMMENT '报告置信度',
    generated_by VARCHAR(50) DEFAULT 'AI_AUTO',
    reviewed_by VARCHAR(100),
    review_status VARCHAR(20) DEFAULT 'pending',
    review_comments TEXT,
    report_version INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES xhs_accounts(account_id)
);

-- 知识洞察提取记录表
CREATE TABLE knowledge_insights_extraction (
    id SERIAL PRIMARY KEY,
    source_type VARCHAR(100) NOT NULL COMMENT '来源类型(performance_data|competitor_analysis|user_feedback)',
    source_id INTEGER COMMENT '来源记录ID',
    account_id VARCHAR(100),
    extraction_date DATE NOT NULL,
    insight_category VARCHAR(100) NOT NULL,
    insight_type VARCHAR(100) NOT NULL,
    insight_content JSONB NOT NULL COMMENT '洞察内容',
    evidence_data JSONB COMMENT '支撑证据',
    confidence_score DECIMAL(3,2) NOT NULL,
    applicability_scope JSONB COMMENT '适用范围',
    potential_impact JSONB COMMENT '潜在影响',
    implementation_difficulty DECIMAL(3,2) COMMENT '实施难度',
    estimated_value DECIMAL(10,2) COMMENT '预估价值',
    validation_status VARCHAR(20) DEFAULT 'pending',
    validation_results JSONB COMMENT '验证结果',
    usage_frequency INTEGER DEFAULT 0,
    success_rate DECIMAL(3,2),
    last_applied_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔄 数据流动和处理管道

### 数据收集Pipeline
```python
class ComprehensiveDataCollectionPipeline:
    """综合数据收集管道"""
    
    def __init__(self):
        self.db_manager = DatabaseManager()
        self.mcp_client = MCPClient()
        self.data_validator = DataQualityValidator()
        
    async def content_publication_pipeline(self, account_id: str, content_data: dict):
        """内容发布数据流水线"""
        try:
            # 1. 记录发布意图和参数
            publication_intent = {
                'account_id': account_id,
                'intent_timestamp': datetime.now().isoformat(),
                'content_strategy': content_data.get('strategy'),
                'ai_generation_params': content_data.get('ai_params'),
                'scheduling_logic': content_data.get('schedule_logic')
            }
            
            # 2. 执行内容发布
            publish_result = await self.mcp_client.execute_tool(
                "XIAOHONGSHU_PUBLISH_CONTENT", 
                content_data
            )
            
            # 3. 记录发布结果到 daily_content_posts
            post_record = {
                'account_id': account_id,
                'post_id': publish_result['post_id'],
                'post_type': content_data['type'],
                'title': content_data['title'],
                'content_text': content_data['content'],
                'hashtags': content_data['hashtags'],
                'publish_time': datetime.now(),
                'ai_generated': content_data.get('ai_generated', False),
                'generation_prompt': content_data.get('prompt'),
                'raw_response': publish_result
            }
            await self.db_manager.insert('daily_content_posts', post_record)
            
            # 4. 记录MCP工具调用日志
            mcp_log = {
                'account_id': account_id,
                'session_id': content_data.get('session_id'),
                'tool_name': 'XIAOHONGSHU_PUBLISH_CONTENT',
                'tool_category': 'content_management',
                'call_timestamp': datetime.now(),
                'input_parameters': content_data,
                'output_results': publish_result,
                'execution_status': 'success' if publish_result.get('success') else 'failed'
            }
            await self.db_manager.insert('mcp_tool_call_logs', mcp_log)
            
            # 5. 启动内容表现追踪
            await self.schedule_performance_tracking(account_id, publish_result['post_id'])
            
            return publish_result
            
        except Exception as e:
            # 记录错误到系统日志
            await self.log_system_error('content_publication', str(e), {
                'account_id': account_id,
                'content_data': content_data
            })
            raise
    
    async def performance_data_collection_pipeline(self, account_id: str, post_id: str):
        """内容表现数据收集流水线"""
        try:
            # 1. 收集实时表现数据
            performance_tools = [
                "XIAOHONGSHU_GET_POST_ANALYTICS",
                "XIAOHONGSHU_GET_ENGAGEMENT_DATA",
                "XIAOHONGSHU_GET_AUDIENCE_DATA"
            ]
            
            performance_data = {}
            for tool in performance_tools:
                try:
                    result = await self.mcp_client.execute_tool(tool, {
                        'account_id': account_id,
                        'post_id': post_id
                    })
                    performance_data[tool] = result
                    
                    # 记录每个工具调用
                    await self.log_mcp_call(account_id, tool, {'post_id': post_id}, result)
                    
                except Exception as tool_error:
                    await self.log_mcp_call(account_id, tool, {'post_id': post_id}, None, str(tool_error))
            
            # 2. 数据质量检查
            quality_score = await self.data_validator.validate_performance_data(performance_data)
            
            # 3. 存储到 content_performance_metrics
            metrics_record = {
                'account_id': account_id,
                'post_id': post_id,
                'metric_date': date.today(),
                'views_count': performance_data.get('views', 0),
                'likes_count': performance_data.get('likes', 0),
                'comments_count': performance_data.get('comments', 0),
                'shares_count': performance_data.get('shares', 0),
                'engagement_rate': calculate_engagement_rate(performance_data),
                'quality_score': quality_score,
                'data_source': 'xiaohongshu_api',
                'collected_at': datetime.now()
            }
            await self.db_manager.upsert('content_performance_metrics', metrics_record, 
                                       ['account_id', 'post_id', 'metric_date'])
            
            # 4. 记录数据质量
            await self.log_data_quality('content_performance_metrics', quality_score, {
                'account_id': account_id,
                'post_id': post_id,
                'data_sources': list(performance_data.keys())
            })
            
            return performance_data
            
        except Exception as e:
            await self.log_system_error('performance_collection', str(e), {
                'account_id': account_id,
                'post_id': post_id
            })
    
    async def competitor_analysis_pipeline(self, competitor_id: str):
        """竞品分析数据流水线"""
        try:
            # 1. 收集竞品基础数据
            competitor_data = await self.mcp_client.execute_tool(
                "XIAOHONGSHU_GET_COMPETITOR_PROFILE",
                {'competitor_id': competitor_id}
            )
            
            # 2. 更新竞品档案
            profile_record = {
                'competitor_account_id': competitor_id,
                'competitor_name': competitor_data['name'],
                'follower_count': competitor_data['followers'],
                'avg_engagement_rate': competitor_data['engagement_rate'],
                'last_analyzed_date': date.today(),
                'data_collection_method': 'automated_mcp_api'
            }
            await self.db_manager.upsert('competitor_profiles', profile_record, 
                                       ['competitor_account_id'])
            
            # 3. 收集竞品内容数据
            content_data = await self.mcp_client.execute_tool(
                "XIAOHONGSHU_GET_COMPETITOR_CONTENT",
                {'competitor_id': competitor_id, 'limit': 50}
            )
            
            # 4. 存储内容监控记录
            for post in content_data['posts']:
                content_record = {
                    'competitor_account_id': competitor_id,
                    'post_id': post['id'],
                    'content_type': post['type'],
                    'title': post['title'],
                    'content_abstract': post['content'][:500],
                    'hashtags': post.get('hashtags', []),
                    'publish_time': post['publish_time'],
                    'views_count': post.get('views', 0),
                    'likes_count': post.get('likes', 0),
                    'engagement_rate': post.get('engagement_rate', 0),
                    'monitored_date': date.today(),
                    'content_quality_score': self.calculate_content_quality(post),
                    'viral_potential_score': self.calculate_viral_potential(post)
                }
                await self.db_manager.upsert('competitor_content_monitoring', content_record,
                                           ['competitor_account_id', 'post_id'])
            
            # 5. 生成竞品分析洞察
            insights = await self.generate_competitor_insights(competitor_id, content_data)
            await self.store_analysis_insights('competitor_analysis', competitor_id, insights)
            
            return {
                'profile_updated': True,
                'content_monitored': len(content_data['posts']),
                'insights_generated': len(insights)
            }
            
        except Exception as e:
            await self.log_system_error('competitor_analysis', str(e), {
                'competitor_id': competitor_id
            })
    
    async def ai_decision_logging_pipeline(self, account_id: str, decision_context: dict):
        """AI决策记录流水线"""
        try:
            # 1. 记录决策推理过程
            decision_record = {
                'account_id': account_id,
                'decision_id': f"dec_{int(time.time())}_{account_id}",
                'decision_type': decision_context['type'],
                'decision_context': decision_context['context'],
                'input_data': decision_context['input'],
                'reasoning_steps': decision_context['reasoning'],
                'considered_alternatives': decision_context.get('alternatives', []),
                'decision_criteria': decision_context['criteria'],
                'confidence_score': decision_context['confidence'],
                'final_decision': decision_context['decision'],
                'decision_rationale': decision_context['rationale'],
                'model_version': decision_context.get('model_version', 'claude-3.5-sonnet'),
                'decision_timestamp': datetime.now()
            }
            await self.db_manager.insert('ai_decision_reasoning_log', decision_record)
            
            # 2. 记录策略执行详情
            if decision_context.get('execution_details'):
                execution_record = {
                    'account_id': account_id,
                    'execution_session_id': decision_context['session_id'],
                    'strategy_type': decision_context['type'],
                    'strategy_name': decision_context['strategy_name'],
                    'execution_stage': 'decision_made',
                    'input_parameters': decision_context['input'],
                    'output_results': decision_context['decision'],
                    'execution_status': 'completed',
                    'mcp_tools_used': decision_context.get('tools_used', []),
                    'claude_api_calls': decision_context.get('api_calls', 0)
                }
                await self.db_manager.insert('strategy_execution_detailed_log', execution_record)
            
            return decision_record['decision_id']
            
        except Exception as e:
            await self.log_system_error('ai_decision_logging', str(e), {
                'account_id': account_id,
                'decision_context': decision_context
            })
```

## 📈 数据检索和分析接口

### 智能查询系统
```python
class IntelligentDataRetrievalSystem:
    """智能数据检索系统"""
    
    def __init__(self):
        self.db_manager = DatabaseManager()
        self.cache_manager = CacheManager()
        
    async def get_account_performance_timeline(self, account_id: str, days: int = 30):
        """获取账号表现时间线"""
        query = """
        SELECT 
            DATE(p.publish_time) as date,
            COUNT(p.id) as posts_count,
            AVG(m.engagement_rate) as avg_engagement,
            SUM(m.views_count) as total_views,
            SUM(m.likes_count) as total_likes,
            SUM(m.comments_count) as total_comments
        FROM daily_content_posts p
        LEFT JOIN content_performance_metrics m ON p.post_id = m.post_id
        WHERE p.account_id = %s 
        AND p.publish_time >= %s
        GROUP BY DATE(p.publish_time)
        ORDER BY date DESC
        """
        
        start_date = datetime.now() - timedelta(days=days)
        return await self.db_manager.execute_query(query, [account_id, start_date])
    
    async def get_strategy_effectiveness_analysis(self, account_id: str, strategy_type: str):
        """获取策略有效性分析"""
        query = """
        SELECT 
            s.strategy_name,
            s.execution_stage,
            COUNT(*) as execution_count,
            AVG(
                CASE 
                    WHEN s.execution_status = 'completed' THEN 1.0
                    ELSE 0.0
                END
            ) as success_rate,
            AVG(s.execution_duration_seconds) as avg_duration,
            l.overall_learning_score
        FROM strategy_execution_detailed_log s
        LEFT JOIN learning_effectiveness_evaluation l 
            ON s.account_id = l.account_id 
            AND l.learning_category = %s
        WHERE s.account_id = %s 
        AND s.strategy_type = %s
        AND s.created_at >= %s
        GROUP BY s.strategy_name, s.execution_stage, l.overall_learning_score
        ORDER BY success_rate DESC, avg_duration ASC
        """
        
        start_date = datetime.now() - timedelta(days=30)
        return await self.db_manager.execute_query(
            query, [strategy_type, account_id, strategy_type, start_date]
        )
    
    async def get_competitor_insights_summary(self, industry_category: str = None):
        """获取竞品洞察汇总"""
        where_clause = "WHERE 1=1"
        params = []
        
        if industry_category:
            where_clause += " AND cp.industry_category = %s"
            params.append(industry_category)
        
        query = f"""
        SELECT 
            cp.competitor_name,
            cp.follower_count,
            cp.avg_engagement_rate,
            COUNT(ccm.id) as monitored_posts,
            AVG(ccm.engagement_rate) as competitor_avg_engagement,
            AVG(ccm.viral_potential_score) as avg_viral_potential,
            MAX(ccm.monitored_date) as last_analysis
        FROM competitor_profiles cp
        LEFT JOIN competitor_content_monitoring ccm 
            ON cp.competitor_account_id = ccm.competitor_account_id
        {where_clause}
        GROUP BY cp.competitor_account_id, cp.competitor_name, 
                 cp.follower_count, cp.avg_engagement_rate
        ORDER BY cp.avg_engagement_rate DESC
        """
        
        return await self.db_manager.execute_query(query, params)
    
    async def get_learning_insights_by_category(self, account_id: str, category: str):
        """根据类别获取学习洞察"""
        query = """
        SELECT 
            insight_type,
            insight_content,
            confidence_score,
            usage_frequency,
            success_rate,
            last_applied_date,
            potential_impact
        FROM knowledge_insights_extraction
        WHERE account_id = %s 
        AND insight_category = %s
        AND validation_status = 'validated'
        ORDER BY confidence_score DESC, usage_frequency DESC
        LIMIT 20
        """
        
        return await self.db_manager.execute_query(query, [account_id, category])
    
    async def search_similar_successful_strategies(self, strategy_context: dict):
        """搜索相似的成功策略"""
        # 使用向量搜索或者关键词匹配找到相似的成功策略
        query = """
        SELECT DISTINCT
            s.strategy_name,
            s.input_parameters,
            s.output_results,
            s.performance_metrics,
            d.confidence_score,
            d.decision_rationale
        FROM strategy_execution_detailed_log s
        JOIN ai_decision_reasoning_log d ON s.execution_session_id = d.decision_id
        WHERE s.execution_status = 'completed'
        AND s.strategy_type = %s
        AND (
            s.input_parameters::text ILIKE %s
            OR s.strategy_name ILIKE %s
        )
        ORDER BY d.confidence_score DESC
        LIMIT 10
        """
        
        strategy_type = strategy_context['type']
        search_term = f"%{strategy_context.get('keywords', '')}%"
        
        return await self.db_manager.execute_query(
            query, [strategy_type, search_term, search_term]
        )
```

## 🔍 数据质量保证和监控

### 自动化质量检查
```python
class DataQualityAssuranceSystem:
    """数据质量保证系统"""
    
    async def run_daily_quality_checks(self):
        """每日数据质量检查"""
        tables_to_check = [
            'daily_content_posts',
            'content_performance_metrics',
            'user_interactions',
            'competitor_content_monitoring',
            'ai_decision_reasoning_log'
        ]
        
        quality_report = {}
        
        for table in tables_to_check:
            quality_metrics = await self.check_table_quality(table)
            quality_report[table] = quality_metrics
            
            # 记录质量检查结果
            await self.log_quality_check(table, quality_metrics)
            
            # 如果质量分数低于阈值，触发告警
            if quality_metrics['overall_score'] < 0.8:
                await self.trigger_quality_alert(table, quality_metrics)
        
        return quality_report
    
    async def check_data_freshness(self, table_name: str, expected_frequency_hours: int):
        """检查数据新鲜度"""
        query = f"""
        SELECT 
            MAX(created_at) as last_update,
            COUNT(*) as total_records,
            COUNT(CASE WHEN created_at >= %s THEN 1 END) as recent_records
        FROM {table_name}
        """
        
        cutoff_time = datetime.now() - timedelta(hours=expected_frequency_hours)
        result = await self.db_manager.execute_query(query, [cutoff_time])
        
        freshness_score = result[0]['recent_records'] / max(result[0]['total_records'], 1)
        
        return {
            'freshness_score': freshness_score,
            'last_update': result[0]['last_update'],
            'expected_frequency_hours': expected_frequency_hours,
            'is_fresh': freshness_score > 0.1  # 至少10%的数据是最近的
        }
```

---

**文档版本控制**: v1.0 (2025-09-23_162845)  
**下次更新**: 2025-10-01  
**维护责任**: LaunchX Data Architecture Team  
**审核状态**: 待技术架构师评审