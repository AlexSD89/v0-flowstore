# Story #001: Database Foundation & Core Schema
**BMAD Phase 1 - Week 1 Foundation Story**

**Story ID**: AI-MRR-001  
**Epic**: System Architecture Foundation  
**Agent**: backend-developer (Lead) + typescript-expert (Support)  
**Priority**: P0 (Highest - Blocking)  
**Story Points**: 13 (Complex)  
**Sprint**: Phase 1, Week 1  

**Created**: 2025-01-24  
**Status**: 🚀 Ready for Development  
**Dependencies**: None (Foundation Story)  

---

## 🎯 Story Overview

### User Story
```
As a system architect and future AI agents,
I need a robust, scalable database foundation with complete TypeScript type safety,
So that all subsequent development can build upon a solid data architecture
that supports AI-driven MRR tracking and investment analysis at enterprise scale.
```

### Business Value
- **Foundation for AI/ML**: 确保数据结构支持AI模型训练和预测
- **Type Safety**: 完整的TypeScript类型系统，减少运行时错误90%+
- **Scalability**: 数据架构支持1000+企业的MRR数据追踪
- **Performance**: 优化的索引设计，确保查询响应时间<2秒

---

## 📋 Detailed Requirements

### Functional Requirements

#### FR-001: PostgreSQL Database Setup
```yaml
数据库环境配置:
  版本: "PostgreSQL 15+"
  扩展插件:
    - uuid-ossp: "UUID主键生成"
    - pg_trgm: "模糊搜索支持"
    - btree_gin: "复合索引优化"
    - pg_stat_statements: "查询性能分析"
  
  环境配置:
    开发环境: "本地Docker容器"
    测试环境: "Docker Compose集成"
    生产环境: "云数据库服务"
    
  数据库参数优化:
    shared_buffers: "256MB"
    effective_cache_size: "1GB" 
    random_page_cost: "1.1"
    work_mem: "64MB"
```

#### FR-002: Core Table Structure
基于architecture.md设计，实现完整的表结构：

```sql
-- 1. 企业主表 (核心实体)
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  website VARCHAR(255),
  logo_url VARCHAR(255),
  founded_date DATE,
  team_size_min INTEGER CHECK (team_size_min >= 1),
  team_size_max INTEGER CHECK (team_size_max >= team_size_min),
  industry_primary VARCHAR(100) NOT NULL,
  industry_secondary VARCHAR(100)[],
  location_country VARCHAR(50),
  location_city VARCHAR(100),
  ai_application_fields JSONB,
  technology_stack JSONB,
  funding_stage VARCHAR(50),
  total_funding_amount DECIMAL(15,2),
  last_funding_date DATE,
  is_active BOOLEAN DEFAULT true,
  data_quality_score INTEGER CHECK (data_quality_score BETWEEN 0 AND 100),
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 约束检查
  CONSTRAINT companies_name_length CHECK (length(name) >= 2),
  CONSTRAINT companies_website_format CHECK (website ~* '^https?://.*' OR website IS NULL),
  CONSTRAINT companies_funding_positive CHECK (total_funding_amount >= 0 OR total_funding_amount IS NULL)
);

-- 2. MRR数据表 (时间序列核心)
CREATE TABLE mrr_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  mrr_amount DECIMAL(15,2) NOT NULL CHECK (mrr_amount >= 0),
  mrr_currency VARCHAR(3) DEFAULT 'CNY',
  mrr_usd_amount DECIMAL(15,2) CHECK (mrr_usd_amount >= 0),
  
  -- 数据来源和质量
  data_source VARCHAR(100) NOT NULL,
  collection_method data_collection_method_enum NOT NULL,
  confidence_score INTEGER NOT NULL CHECK (confidence_score BETWEEN 0 AND 100),
  validation_status validation_status_enum DEFAULT 'pending',
  
  -- 增长分析字段
  mom_growth_rate DECIMAL(8,4), -- 环比增长率 (Month over Month)
  yoy_growth_rate DECIMAL(8,4), -- 同比增长率 (Year over Year)
  
  -- 元数据和审计
  raw_data_snapshot JSONB,
  extraction_metadata JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 唯一性约束：每家企业每天每个数据源只能有一条记录
  UNIQUE(company_id, record_date, data_source)
);

-- 3. 投资评分表
CREATE TABLE investment_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  score_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- 7维度评分详情
  total_score INTEGER NOT NULL CHECK (total_score BETWEEN 0 AND 100),
  mrr_scale_score INTEGER NOT NULL CHECK (mrr_scale_score BETWEEN 0 AND 100),
  growth_rate_score INTEGER NOT NULL CHECK (growth_rate_score BETWEEN 0 AND 100),
  growth_quality_score INTEGER NOT NULL CHECK (growth_quality_score BETWEEN 0 AND 100),
  market_opportunity_score INTEGER NOT NULL CHECK (market_opportunity_score BETWEEN 0 AND 100),
  team_quality_score INTEGER CHECK (team_quality_score BETWEEN 0 AND 100),
  technology_moat_score INTEGER CHECK (technology_moat_score BETWEEN 0 AND 100),
  financial_health_score INTEGER CHECK (financial_health_score BETWEEN 0 AND 100),
  
  -- 投资建议和风险评估
  recommendation investment_recommendation_enum NOT NULL,
  recommendation_reasoning TEXT,
  risk_level risk_level_enum NOT NULL,
  risk_factors TEXT[],
  
  -- 算法版本和置信度
  scoring_algorithm_version VARCHAR(20) NOT NULL DEFAULT 'v1.0',
  model_confidence DECIMAL(5,4) CHECK (model_confidence BETWEEN 0 AND 1),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 每天每家企业只能有一条评分记录
  UNIQUE(company_id, score_date)
);

-- 4. 增长预测表
CREATE TABLE growth_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  prediction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  prediction_horizon_months INTEGER NOT NULL CHECK (prediction_horizon_months BETWEEN 1 AND 24),
  
  -- 预测结果数据
  predicted_mrr_timeline JSONB NOT NULL, -- [{month: 1, mrr: 100000, confidence: 0.85}]
  prediction_confidence DECIMAL(5,4) NOT NULL CHECK (prediction_confidence BETWEEN 0 AND 1),
  prediction_uncertainty_range JSONB, -- {lower: 80000, upper: 120000}
  
  -- 模型元数据
  model_name VARCHAR(50) NOT NULL,
  model_version VARCHAR(20) NOT NULL,
  feature_importance JSONB,
  key_growth_drivers TEXT[],
  risk_factors TEXT[],
  
  -- 预测验证
  accuracy_score DECIMAL(5,4) CHECK (accuracy_score BETWEEN 0 AND 1),
  is_validated BOOLEAN DEFAULT false,
  validation_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 每家企业每个预测日期每个模型只能有一条记录
  UNIQUE(company_id, prediction_date, model_name)
);

-- 5. 投资组合表
CREATE TABLE investment_portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id),
  
  -- 投资基本信息
  investment_date DATE NOT NULL,
  investment_amount DECIMAL(15,2) NOT NULL CHECK (investment_amount > 0),
  investment_currency VARCHAR(3) DEFAULT 'CNY',
  investment_usd_amount DECIMAL(15,2),
  investment_stage VARCHAR(50) NOT NULL,
  
  -- 持股信息
  equity_percentage DECIMAL(7,4) CHECK (equity_percentage BETWEEN 0 AND 100),
  share_class VARCHAR(20),
  liquidation_preference DECIMAL(5,2),
  
  -- 估值跟踪
  current_valuation DECIMAL(15,2),
  current_valuation_date DATE,
  unrealized_gain_loss DECIMAL(15,2),
  realized_gain_loss DECIMAL(15,2) DEFAULT 0,
  
  -- 投资状态管理
  investment_status investment_status_enum DEFAULT 'active',
  exit_date DATE,
  exit_valuation DECIMAL(15,2),
  exit_multiple DECIMAL(8,4),
  irr_percentage DECIMAL(8,4),
  
  -- 投资决策记录
  investment_thesis TEXT,
  key_milestones JSONB,
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 数据采集任务表
CREATE TABLE data_collection_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  task_type VARCHAR(50) NOT NULL,
  data_source VARCHAR(100) NOT NULL,
  
  -- 任务调度信息
  status task_status_enum DEFAULT 'pending',
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- 执行结果统计
  success_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  collected_data_count INTEGER DEFAULT 0,
  error_messages TEXT[],
  
  -- 任务配置和重试
  task_config JSONB,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 定义枚举类型
CREATE TYPE data_collection_method_enum AS ENUM (
  'direct_api', 'web_scraping', 'manual_input', 'calculated', 'estimated'
);

CREATE TYPE validation_status_enum AS ENUM (
  'pending', 'validated', 'flagged', 'rejected', 'needs_review'
);

CREATE TYPE investment_recommendation_enum AS ENUM (
  'STRONG_BUY', 'BUY', 'HOLD', 'AVOID', 'SELL'
);

CREATE TYPE risk_level_enum AS ENUM (
  'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH'
);

CREATE TYPE investment_status_enum AS ENUM (
  'active', 'exited', 'written_off', 'partial_exit'
);

CREATE TYPE task_status_enum AS ENUM (
  'pending', 'running', 'completed', 'failed', 'cancelled'
);
```

#### FR-003: Performance-Optimized Indexing
```sql
-- 企业表索引优化
CREATE INDEX idx_companies_name_gin ON companies USING gin(to_tsvector('english', name));
CREATE INDEX idx_companies_industry ON companies (industry_primary, industry_secondary);
CREATE INDEX idx_companies_location ON companies (location_country, location_city);
CREATE INDEX idx_companies_active_updated ON companies (is_active, last_updated_at DESC);
CREATE INDEX idx_companies_funding ON companies (funding_stage, total_funding_amount DESC NULLS LAST);
CREATE INDEX idx_companies_ai_fields ON companies USING gin(ai_application_fields);

-- MRR记录表索引优化 (时间序列查询优化)
CREATE INDEX idx_mrr_company_date ON mrr_records (company_id, record_date DESC);
CREATE INDEX idx_mrr_date_amount ON mrr_records (record_date DESC, mrr_usd_amount DESC);
CREATE INDEX idx_mrr_growth_rate ON mrr_records (mom_growth_rate DESC NULLS LAST);
CREATE INDEX idx_mrr_validation ON mrr_records (validation_status, confidence_score DESC);
CREATE INDEX idx_mrr_data_source ON mrr_records (data_source, record_date DESC);

-- 复合索引支持常见查询模式
CREATE INDEX idx_mrr_company_validation_date ON mrr_records (company_id, validation_status, record_date DESC);
CREATE INDEX idx_mrr_amount_growth_composite ON mrr_records (mrr_usd_amount DESC, mom_growth_rate DESC, record_date DESC);

-- 投资评分表索引
CREATE INDEX idx_scores_company_date ON investment_scores (company_id, score_date DESC);
CREATE INDEX idx_scores_total_score ON investment_scores (total_score DESC, score_date DESC);
CREATE INDEX idx_scores_recommendation ON investment_scores (recommendation, risk_level);
CREATE INDEX idx_scores_algorithm_version ON investment_scores (scoring_algorithm_version, score_date DESC);

-- 增长预测表索引
CREATE INDEX idx_predictions_company_date ON growth_predictions (company_id, prediction_date DESC);
CREATE INDEX idx_predictions_model ON growth_predictions (model_name, model_version, prediction_date DESC);
CREATE INDEX idx_predictions_confidence ON growth_predictions (prediction_confidence DESC, prediction_date DESC);

-- 投资组合表索引
CREATE INDEX idx_portfolio_company ON investment_portfolios (company_id, investment_date DESC);
CREATE INDEX idx_portfolio_status ON investment_portfolios (investment_status, investment_date DESC);
CREATE INDEX idx_portfolio_performance ON investment_portfolios (unrealized_gain_loss DESC, investment_date DESC);

-- 数据采集任务表索引
CREATE INDEX idx_tasks_company_type ON data_collection_tasks (company_id, task_type, scheduled_at DESC);
CREATE INDEX idx_tasks_status ON data_collection_tasks (status, scheduled_at ASC);
CREATE INDEX idx_tasks_data_source ON data_collection_tasks (data_source, status, scheduled_at DESC);
```

#### FR-004: Prisma ORM Integration
完整的Prisma Schema配置：

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Company {
  id                      String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name                    String   @unique @db.VarChar(255)
  slug                    String   @unique @db.VarChar(255)
  description             String?  @db.Text
  website                 String?  @db.VarChar(255)
  logoUrl                 String?  @map("logo_url") @db.VarChar(255)
  foundedDate             DateTime? @map("founded_date") @db.Date
  teamSizeMin             Int?     @map("team_size_min")
  teamSizeMax             Int?     @map("team_size_max")
  industryPrimary         String   @map("industry_primary") @db.VarChar(100)
  industrySecondary       String[] @map("industry_secondary") @db.VarChar(100)
  locationCountry         String?  @map("location_country") @db.VarChar(50)
  locationCity            String?  @map("location_city") @db.VarChar(100)
  aiApplicationFields     Json?    @map("ai_application_fields") @db.JsonB
  technologyStack         Json?    @map("technology_stack") @db.JsonB
  fundingStage            String?  @map("funding_stage") @db.VarChar(50)
  totalFundingAmount      Decimal? @map("total_funding_amount") @db.Decimal(15, 2)
  lastFundingDate         DateTime? @map("last_funding_date") @db.Date
  isActive                Boolean  @default(true) @map("is_active")
  dataQualityScore        Int?     @map("data_quality_score")
  lastUpdatedAt           DateTime @default(now()) @map("last_updated_at") @db.Timestamptz
  createdAt               DateTime @default(now()) @map("created_at") @db.Timestamptz

  // Relations
  mrrRecords              MrrRecord[]
  investmentScores        InvestmentScore[]
  growthPredictions       GrowthPrediction[]
  investmentPortfolios    InvestmentPortfolio[]
  dataCollectionTasks     DataCollectionTask[]

  @@map("companies")
}

model MrrRecord {
  id                    String                    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  companyId             String                    @map("company_id") @db.Uuid
  recordDate            DateTime                  @map("record_date") @db.Date
  mrrAmount             Decimal                   @map("mrr_amount") @db.Decimal(15, 2)
  mrrCurrency           String                    @default("CNY") @map("mrr_currency") @db.VarChar(3)
  mrrUsdAmount          Decimal?                  @map("mrr_usd_amount") @db.Decimal(15, 2)
  dataSource            String                    @map("data_source") @db.VarChar(100)
  collectionMethod      DataCollectionMethod      @map("collection_method")
  confidenceScore       Int                       @map("confidence_score")
  validationStatus      ValidationStatus          @default(PENDING) @map("validation_status")
  momGrowthRate         Decimal?                  @map("mom_growth_rate") @db.Decimal(8, 4)
  yoyGrowthRate         Decimal?                  @map("yoy_growth_rate") @db.Decimal(8, 4)
  rawDataSnapshot       Json?                     @map("raw_data_snapshot") @db.JsonB
  extractionMetadata    Json?                     @map("extraction_metadata") @db.JsonB
  notes                 String?                   @db.Text
  createdAt             DateTime                  @default(now()) @map("created_at") @db.Timestamptz

  // Relations
  company               Company                   @relation(fields: [companyId], references: [id], onDelete: Cascade)

  @@unique([companyId, recordDate, dataSource])
  @@map("mrr_records")
}

model InvestmentScore {
  id                        String                      @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  companyId                 String                      @map("company_id") @db.Uuid
  scoreDate                 DateTime                    @default(now()) @map("score_date") @db.Date
  totalScore                Int                         @map("total_score")
  mrrScaleScore             Int                         @map("mrr_scale_score")
  growthRateScore           Int                         @map("growth_rate_score")
  growthQualityScore        Int                         @map("growth_quality_score")
  marketOpportunityScore    Int                         @map("market_opportunity_score")
  teamQualityScore          Int?                        @map("team_quality_score")
  technologyMoatScore       Int?                        @map("technology_moat_score")
  financialHealthScore      Int?                        @map("financial_health_score")
  recommendation            InvestmentRecommendation
  recommendationReasoning   String?                     @map("recommendation_reasoning") @db.Text
  riskLevel                 RiskLevel                   @map("risk_level")
  riskFactors               String[]                    @map("risk_factors") @db.Text
  scoringAlgorithmVersion   String                      @default("v1.0") @map("scoring_algorithm_version") @db.VarChar(20)
  modelConfidence           Decimal?                    @map("model_confidence") @db.Decimal(5, 4)
  createdAt                 DateTime                    @default(now()) @map("created_at") @db.Timestamptz

  // Relations
  company                   Company                     @relation(fields: [companyId], references: [id], onDelete: Cascade)

  @@unique([companyId, scoreDate])
  @@map("investment_scores")
}

model GrowthPrediction {
  id                          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  companyId                   String   @map("company_id") @db.Uuid
  predictionDate              DateTime @default(now()) @map("prediction_date") @db.Date
  predictionHorizonMonths     Int      @map("prediction_horizon_months")
  predictedMrrTimeline        Json     @map("predicted_mrr_timeline") @db.JsonB
  predictionConfidence        Decimal  @map("prediction_confidence") @db.Decimal(5, 4)
  predictionUncertaintyRange  Json?    @map("prediction_uncertainty_range") @db.JsonB
  modelName                   String   @map("model_name") @db.VarChar(50)
  modelVersion                String   @map("model_version") @db.VarChar(20)
  featureImportance           Json?    @map("feature_importance") @db.JsonB
  keyGrowthDrivers            String[] @map("key_growth_drivers") @db.Text
  riskFactors                 String[] @map("risk_factors") @db.Text
  accuracyScore               Decimal? @map("accuracy_score") @db.Decimal(5, 4)
  isValidated                 Boolean  @default(false) @map("is_validated")
  validationNotes             String?  @map("validation_notes") @db.Text
  createdAt                   DateTime @default(now()) @map("created_at") @db.Timestamptz

  // Relations
  company                     Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)

  @@unique([companyId, predictionDate, modelName])
  @@map("growth_predictions")
}

model InvestmentPortfolio {
  id                      String            @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  companyId               String            @map("company_id") @db.Uuid
  investmentDate          DateTime          @map("investment_date") @db.Date
  investmentAmount        Decimal           @map("investment_amount") @db.Decimal(15, 2)
  investmentCurrency      String            @default("CNY") @map("investment_currency") @db.VarChar(3)
  investmentUsdAmount     Decimal?          @map("investment_usd_amount") @db.Decimal(15, 2)
  investmentStage         String            @map("investment_stage") @db.VarChar(50)
  equityPercentage        Decimal?          @map("equity_percentage") @db.Decimal(7, 4)
  shareClass              String?           @map("share_class") @db.VarChar(20)
  liquidationPreference   Decimal?          @map("liquidation_preference") @db.Decimal(5, 2)
  currentValuation        Decimal?          @map("current_valuation") @db.Decimal(15, 2)
  currentValuationDate    DateTime?         @map("current_valuation_date") @db.Date
  unrealizedGainLoss      Decimal?          @map("unrealized_gain_loss") @db.Decimal(15, 2)
  realizedGainLoss        Decimal           @default(0) @map("realized_gain_loss") @db.Decimal(15, 2)
  investmentStatus        InvestmentStatus  @default(ACTIVE) @map("investment_status")
  exitDate                DateTime?         @map("exit_date") @db.Date
  exitValuation           Decimal?          @map("exit_valuation") @db.Decimal(15, 2)
  exitMultiple            Decimal?          @map("exit_multiple") @db.Decimal(8, 4)
  irrPercentage           Decimal?          @map("irr_percentage") @db.Decimal(8, 4)
  investmentThesis        String?           @map("investment_thesis") @db.Text
  keyMilestones           Json?             @map("key_milestones") @db.JsonB
  notes                   String?           @db.Text
  createdAt               DateTime          @default(now()) @map("created_at") @db.Timestamptz
  updatedAt               DateTime          @default(now()) @updatedAt @map("updated_at") @db.Timestamptz

  // Relations
  company                 Company           @relation(fields: [companyId], references: [id])

  @@map("investment_portfolios")
}

model DataCollectionTask {
  id                    String      @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  companyId             String?     @map("company_id") @db.Uuid
  taskType              String      @map("task_type") @db.VarChar(50)
  dataSource            String      @map("data_source") @db.VarChar(100)
  status                TaskStatus  @default(PENDING)
  scheduledAt           DateTime    @map("scheduled_at") @db.Timestamptz
  startedAt             DateTime?   @map("started_at") @db.Timestamptz
  completedAt           DateTime?   @map("completed_at") @db.Timestamptz
  successCount          Int         @default(0) @map("success_count")
  errorCount            Int         @default(0) @map("error_count")
  collectedDataCount    Int         @default(0) @map("collected_data_count")
  errorMessages         String[]    @map("error_messages") @db.Text
  taskConfig            Json?       @map("task_config") @db.JsonB
  retryCount            Int         @default(0) @map("retry_count")
  maxRetries            Int         @default(3) @map("max_retries")
  createdAt             DateTime    @default(now()) @map("created_at") @db.Timestamptz

  // Relations
  company               Company?    @relation(fields: [companyId], references: [id])

  @@map("data_collection_tasks")
}

// Enums
enum DataCollectionMethod {
  DIRECT_API    @map("direct_api")
  WEB_SCRAPING  @map("web_scraping")
  MANUAL_INPUT  @map("manual_input")
  CALCULATED    @map("calculated")
  ESTIMATED     @map("estimated")
}

enum ValidationStatus {
  PENDING       @map("pending")
  VALIDATED     @map("validated")
  FLAGGED       @map("flagged")
  REJECTED      @map("rejected")
  NEEDS_REVIEW  @map("needs_review")
}

enum InvestmentRecommendation {
  STRONG_BUY
  BUY
  HOLD
  AVOID
  SELL
}

enum RiskLevel {
  LOW
  MEDIUM
  HIGH
  VERY_HIGH
}

enum InvestmentStatus {
  ACTIVE        @map("active")
  EXITED        @map("exited")
  WRITTEN_OFF   @map("written_off")
  PARTIAL_EXIT  @map("partial_exit")
}

enum TaskStatus {
  PENDING     @map("pending")
  RUNNING     @map("running")
  COMPLETED   @map("completed")
  FAILED      @map("failed")
  CANCELLED   @map("cancelled")
}
```

### Non-Functional Requirements

#### NFR-001: Performance Requirements
```yaml
查询性能目标:
  简单查询 (单表): "<50ms"
  复杂查询 (多表JOIN): "<500ms"
  聚合查询 (统计分析): "<2s"
  全文搜索: "<100ms"
  
并发性能目标:
  数据库连接池: "最少10个连接，最多100个连接"
  并发读取: "支持1000+并发查询"
  并发写入: "支持100+并发插入/更新"
  事务吞吐: "1000+ TPS"
  
数据规模支持:
  企业数量: "支持100万+企业记录"
  MRR记录: "支持1000万+时间序列记录"
  历史数据: "支持5年+历史数据存储"
  实时数据: "支持实时数据更新和查询"
```

#### NFR-002: Data Integrity Requirements
```yaml
数据一致性:
  ACID事务: "所有关键操作确保ACID特性"
  外键约束: "严格的关系完整性约束"
  检查约束: "业务规则级别的数据验证"
  唯一性约束: "防止重复数据"
  
数据验证:
  输入验证: "所有用户输入严格验证"
  业务规则验证: "复杂业务逻辑验证"
  数据格式验证: "JSON schema验证"
  范围验证: "数值范围和枚举验证"
  
数据备份:
  自动备份: "每天全量备份"
  增量备份: "每小时增量备份"
  恢复测试: "月度恢复演练"
  异地备份: "跨区域备份策略"
```

---

## 🛠️ Technical Implementation

### Development Tasks Breakdown

#### Task 1: Database Environment Setup (4 hours)
```bash
# 1.1 Docker PostgreSQL配置
cat > docker-compose.db.yml << 'EOF'
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: mrr_tracker_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: mrr_tracker_dev
      POSTGRES_INITDB_ARGS: "--encoding=UTF8 --lc-collate=en_US.UTF-8 --lc-ctype=en_US.UTF-8"
    ports:
      - "5432:5432"
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data
      - ./database/init:/docker-entrypoint-initdb.d
    command: >
      postgres -c shared_buffers=256MB
               -c effective_cache_size=1GB
               -c random_page_cost=1.1
               -c work_mem=64MB
               -c maintenance_work_mem=256MB
               -c checkpoint_completion_target=0.9
               -c wal_buffers=16MB
               -c default_statistics_target=100
    restart: unless-stopped
    
volumes:
  postgres_dev_data:
EOF

# 1.2 数据库初始化脚本
mkdir -p database/init
cat > database/init/01-extensions.sql << 'EOF'
-- 启用必要的PostgreSQL扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- 设置数据库参数
ALTER SYSTEM SET track_activity_query_size = 2048;
ALTER SYSTEM SET pg_stat_statements.track = 'all';
SELECT pg_reload_conf();
EOF
```

#### Task 2: Core Schema Implementation (8 hours)
```typescript
// database/schema.ts - TypeScript类型定义
export interface Company {
  id: string;
  name: string;
  slug: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  foundedDate?: Date;
  teamSizeMin?: number;
  teamSizeMax?: number;
  industryPrimary: string;
  industrySecondary: string[];
  locationCountry?: string;
  locationCity?: string;
  aiApplicationFields?: AIApplicationField[];
  technologyStack?: TechnologyStackItem[];
  fundingStage?: string;
  totalFundingAmount?: number;
  lastFundingDate?: Date;
  isActive: boolean;
  dataQualityScore?: number;
  lastUpdatedAt: Date;
  createdAt: Date;
}

export interface MRRRecord {
  id: string;
  companyId: string;
  recordDate: Date;
  mrrAmount: number;
  mrrCurrency: string;
  mrrUsdAmount?: number;
  dataSource: string;
  collectionMethod: DataCollectionMethod;
  confidenceScore: number;
  validationStatus: ValidationStatus;
  momGrowthRate?: number;
  yoyGrowthRate?: number;
  rawDataSnapshot?: any;
  extractionMetadata?: any;
  notes?: string;
  createdAt: Date;
  company?: Company;
}

export interface InvestmentScore {
  id: string;
  companyId: string;
  scoreDate: Date;
  totalScore: number;
  mrrScaleScore: number;
  growthRateScore: number;
  growthQualityScore: number;
  marketOpportunityScore: number;
  teamQualityScore?: number;
  technologyMoatScore?: number;
  financialHealthScore?: number;
  recommendation: InvestmentRecommendation;
  recommendationReasoning?: string;
  riskLevel: RiskLevel;
  riskFactors: string[];
  scoringAlgorithmVersion: string;
  modelConfidence?: number;
  createdAt: Date;
  company?: Company;
}

// 枚举类型定义
export enum DataCollectionMethod {
  DIRECT_API = 'direct_api',
  WEB_SCRAPING = 'web_scraping',
  MANUAL_INPUT = 'manual_input',
  CALCULATED = 'calculated',
  ESTIMATED = 'estimated'
}

export enum ValidationStatus {
  PENDING = 'pending',
  VALIDATED = 'validated',
  FLAGGED = 'flagged',
  REJECTED = 'rejected',
  NEEDS_REVIEW = 'needs_review'
}

export enum InvestmentRecommendation {
  STRONG_BUY = 'STRONG_BUY',
  BUY = 'BUY',
  HOLD = 'HOLD',
  AVOID = 'AVOID',
  SELL = 'SELL'
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  VERY_HIGH = 'VERY_HIGH'
}

// 辅助接口
export interface AIApplicationField {
  field: string;
  description?: string;
  confidence: number;
}

export interface TechnologyStackItem {
  category: string;
  technology: string;
  version?: string;
}
```

#### Task 3: Prisma Integration & Migration (6 hours)
```bash
# 3.1 Prisma初始化和配置
npm install prisma @prisma/client
npx prisma init

# 3.2 环境变量配置
cat > .env.example << 'EOF'
# Database Configuration
DATABASE_URL="postgresql://mrr_tracker_user:YOUR_PASSWORD@localhost:5432/mrr_tracker_dev?schema=public"

# Development Database
DEV_DATABASE_URL="postgresql://mrr_tracker_user:YOUR_PASSWORD@localhost:5432/mrr_tracker_dev?schema=public"

# Test Database  
TEST_DATABASE_URL="postgresql://mrr_tracker_user:YOUR_PASSWORD@localhost:5432/mrr_tracker_test?schema=public"

# Production Database (will be configured later)
PROD_DATABASE_URL=""
EOF

# 3.3 Prisma迁移脚本
npx prisma migrate dev --name initial_schema
npx prisma generate

# 3.4 创建种子数据脚本
cat > prisma/seed.ts << 'EOF'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 创建示例企业数据
  const sampleCompanies = [
    {
      name: 'AI智能客服科技',
      slug: 'ai-customer-service-tech',
      description: '基于大模型的智能客服解决方案提供商',
      website: 'https://example-ai-cs.com',
      industryPrimary: 'AI客服',
      industrySecondary: ['NLP', '客户服务'],
      locationCountry: '中国',
      locationCity: '北京',
      fundingStage: '种子轮',
      teamSizeMin: 5,
      teamSizeMax: 8,
      isActive: true,
      dataQualityScore: 85,
      aiApplicationFields: [
        { field: 'NLP', description: '自然语言处理', confidence: 0.9 },
        { field: 'Chatbot', description: '智能对话机器人', confidence: 0.95 }
      ]
    },
    // 更多示例数据...
  ];

  for (const companyData of sampleCompanies) {
    const company = await prisma.company.create({
      data: companyData
    });
    
    // 创建示例MRR数据
    await prisma.mRRRecord.create({
      data: {
        companyId: company.id,
        recordDate: new Date(),
        mrrAmount: 150000,
        mrrCurrency: 'CNY',
        mrrUsdAmount: 21000,
        dataSource: 'manual_seed',
        collectionMethod: 'MANUAL_INPUT',
        confidenceScore: 100,
        validationStatus: 'VALIDATED'
      }
    });
  }
  
  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
EOF

# 运行种子数据
npx prisma db seed
```

#### Task 4: Database Service Layer (10 hours)
```typescript
// database/client.ts - 数据库连接客户端
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'info', 'warn', 'error']
    : ['error'],
  errorFormat: 'pretty'
});

// 连接管理
export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
  console.log('Database disconnected');
}

// database/repositories/CompanyRepository.ts
import { prisma } from '../client';
import { Company, InvestmentRecommendation } from '../schema';

export class CompanyRepository {
  // 创建企业
  async create(data: Omit<Company, 'id' | 'createdAt' | 'lastUpdatedAt'>): Promise<Company> {
    return await prisma.company.create({
      data: {
        ...data,
        slug: this.generateSlug(data.name)
      }
    });
  }
  
  // 根据ID查询企业
  async findById(id: string): Promise<Company | null> {
    return await prisma.company.findUnique({
      where: { id },
      include: {
        mrrRecords: {
          orderBy: { recordDate: 'desc' },
          take: 12 // 最近12个月
        },
        investmentScores: {
          orderBy: { scoreDate: 'desc' },
          take: 1 // 最新评分
        }
      }
    });
  }
  
  // 搜索企业（支持全文搜索）
  async search(query: {
    keyword?: string;
    industry?: string;
    location?: string;
    fundingStage?: string;
    mrrRange?: { min: number; max: number };
    recommendation?: InvestmentRecommendation;
    limit?: number;
    offset?: number;
  }): Promise<{ companies: Company[]; total: number }> {
    const whereConditions: any = {
      isActive: true
    };
    
    if (query.keyword) {
      whereConditions.OR = [
        { name: { contains: query.keyword, mode: 'insensitive' } },
        { description: { contains: query.keyword, mode: 'insensitive' } }
      ];
    }
    
    if (query.industry) {
      whereConditions.industryPrimary = query.industry;
    }
    
    if (query.location) {
      whereConditions.locationCountry = query.location;
    }
    
    if (query.fundingStage) {
      whereConditions.fundingStage = query.fundingStage;
    }
    
    // MRR范围查询（需要JOIN）
    if (query.mrrRange) {
      whereConditions.mrrRecords = {
        some: {
          mrrUsdAmount: {
            gte: query.mrrRange.min,
            lte: query.mrrRange.max
          }
        }
      };
    }
    
    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where: whereConditions,
        include: {
          mrrRecords: {
            orderBy: { recordDate: 'desc' },
            take: 1
          },
          investmentScores: {
            orderBy: { scoreDate: 'desc' },
            take: 1
          }
        },
        skip: query.offset || 0,
        take: query.limit || 20,
        orderBy: { lastUpdatedAt: 'desc' }
      }),
      prisma.company.count({ where: whereConditions })
    ]);
    
    return { companies, total };
  }
  
  // 更新企业信息
  async update(id: string, data: Partial<Company>): Promise<Company> {
    return await prisma.company.update({
      where: { id },
      data: {
        ...data,
        lastUpdatedAt: new Date()
      }
    });
  }
  
  // 批量更新数据质量评分
  async updateDataQualityScores(scores: { id: string; score: number }[]): Promise<void> {
    const updatePromises = scores.map(({ id, score }) =>
      prisma.company.update({
        where: { id },
        data: { 
          dataQualityScore: score,
          lastUpdatedAt: new Date()
        }
      })
    );
    
    await Promise.all(updatePromises);
  }
  
  // 生成URL友好的slug
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
}

// database/repositories/MRRRepository.ts
import { prisma } from '../client';
import { MRRRecord, DataCollectionMethod } from '../schema';

export class MRRRepository {
  // 创建MRR记录
  async create(data: Omit<MRRRecord, 'id' | 'createdAt'>): Promise<MRRRecord> {
    // 计算USD金额（如果未提供）
    if (!data.mrrUsdAmount && data.mrrCurrency !== 'USD') {
      data.mrrUsdAmount = await this.convertToUSD(data.mrrAmount, data.mrrCurrency);
    }
    
    return await prisma.mRRRecord.create({
      data,
      include: { company: true }
    });
  }
  
  // 批量创建MRR记录（用于数据采集）
  async createMany(records: Array<Omit<MRRRecord, 'id' | 'createdAt'>>): Promise<number> {
    // 处理汇率转换
    const processedRecords = await Promise.all(
      records.map(async (record) => ({
        ...record,
        mrrUsdAmount: record.mrrUsdAmount || 
          await this.convertToUSD(record.mrrAmount, record.mrrCurrency)
      }))
    );
    
    const result = await prisma.mRRRecord.createMany({
      data: processedRecords,
      skipDuplicates: true // 避免重复插入
    });
    
    return result.count;
  }
  
  // 获取企业MRR历史数据
  async getCompanyMRRHistory(
    companyId: string, 
    options: {
      startDate?: Date;
      endDate?: Date;
      dataSource?: string;
      limit?: number;
    } = {}
  ): Promise<MRRRecord[]> {
    const whereConditions: any = { companyId };
    
    if (options.startDate || options.endDate) {
      whereConditions.recordDate = {};
      if (options.startDate) whereConditions.recordDate.gte = options.startDate;
      if (options.endDate) whereConditions.recordDate.lte = options.endDate;
    }
    
    if (options.dataSource) {
      whereConditions.dataSource = options.dataSource;
    }
    
    return await prisma.mRRRecord.findMany({
      where: whereConditions,
      include: { company: true },
      orderBy: { recordDate: 'desc' },
      take: options.limit
    });
  }
  
  // 计算MRR增长率
  async calculateGrowthRates(companyId: string): Promise<void> {
    const records = await prisma.mRRRecord.findMany({
      where: { companyId },
      orderBy: { recordDate: 'asc' }
    });
    
    for (let i = 1; i < records.length; i++) {
      const current = records[i];
      const previous = records[i - 1];
      const previousYear = records.find(r => 
        r.recordDate.getFullYear() === current.recordDate.getFullYear() - 1 &&
        r.recordDate.getMonth() === current.recordDate.getMonth()
      );
      
      // 计算环比增长率 (MoM)
      const momGrowthRate = previous 
        ? (current.mrrUsdAmount! - previous.mrrUsdAmount!) / previous.mrrUsdAmount! * 100
        : null;
      
      // 计算同比增长率 (YoY)
      const yoyGrowthRate = previousYear
        ? (current.mrrUsdAmount! - previousYear.mrrUsdAmount!) / previousYear.mrrUsdAmount! * 100
        : null;
      
      await prisma.mRRRecord.update({
        where: { id: current.id },
        data: {
          momGrowthRate: momGrowthRate,
          yoyGrowthRate: yoyGrowthRate
        }
      });
    }
  }
  
  // 获取高增长企业
  async getHighGrowthCompanies(
    minGrowthRate: number = 10,
    timeframe: 'mom' | 'yoy' = 'mom',
    limit: number = 50
  ): Promise<Array<{ company: Company; latestMRR: MRRRecord }>> {
    const growthField = timeframe === 'mom' ? 'momGrowthRate' : 'yoyGrowthRate';
    
    const records = await prisma.mRRRecord.findMany({
      where: {
        [growthField]: { gte: minGrowthRate },
        validationStatus: 'VALIDATED'
      },
      include: { company: true },
      orderBy: { [growthField]: 'desc' },
      take: limit
    });
    
    return records.map(record => ({
      company: record.company!,
      latestMRR: record
    }));
  }
  
  // 汇率转换（简单版本，生产环境需要接入实时汇率API）
  private async convertToUSD(amount: number, currency: string): Promise<number> {
    const exchangeRates: { [key: string]: number } = {
      'CNY': 0.14, // 1 CNY = 0.14 USD (示例汇率)
      'EUR': 1.08, // 1 EUR = 1.08 USD
      'GBP': 1.25, // 1 GBP = 1.25 USD
      'USD': 1.0   // 1 USD = 1 USD
    };
    
    return amount * (exchangeRates[currency] || 1);
  }
}
```

### Testing Strategy

#### Unit Tests (Jest + Prisma Test Environment)
```typescript
// tests/repositories/CompanyRepository.test.ts
import { CompanyRepository } from '../../database/repositories/CompanyRepository';
import { prisma } from '../../database/client';
import { setupTestDatabase, teardownTestDatabase } from '../helpers/database';

describe('CompanyRepository', () => {
  let companyRepository: CompanyRepository;
  
  beforeAll(async () => {
    await setupTestDatabase();
    companyRepository = new CompanyRepository();
  });
  
  afterAll(async () => {
    await teardownTestDatabase();
  });
  
  beforeEach(async () => {
    // 清理测试数据
    await prisma.company.deleteMany();
  });
  
  describe('create', () => {
    it('should create a company with valid data', async () => {
      const companyData = {
        name: 'Test AI Company',
        industryPrimary: 'AI Technology',
        industrySecondary: ['NLP', 'Computer Vision'],
        locationCountry: 'China',
        isActive: true
      };
      
      const company = await companyRepository.create(companyData);
      
      expect(company).toBeDefined();
      expect(company.name).toBe('Test AI Company');
      expect(company.slug).toBe('test-ai-company');
      expect(company.isActive).toBe(true);
    });
    
    it('should generate unique slug for companies with same name', async () => {
      const companyData = {
        name: 'Duplicate Name',
        industryPrimary: 'AI Technology',
        industrySecondary: [],
        isActive: true
      };
      
      const company1 = await companyRepository.create(companyData);
      const company2 = await companyRepository.create({
        ...companyData,
        name: 'Duplicate Name 2'
      });
      
      expect(company1.slug).not.toBe(company2.slug);
    });
  });
  
  describe('search', () => {
    beforeEach(async () => {
      // 创建测试数据
      await companyRepository.create({
        name: 'AI Search Company',
        description: 'Advanced AI search technology',
        industryPrimary: 'Search Technology',
        industrySecondary: ['AI', 'NLP'],
        locationCountry: 'China',
        isActive: true
      });
    });
    
    it('should search companies by keyword', async () => {
      const result = await companyRepository.search({
        keyword: 'AI Search',
        limit: 10
      });
      
      expect(result.companies).toHaveLength(1);
      expect(result.companies[0].name).toBe('AI Search Company');
      expect(result.total).toBe(1);
    });
    
    it('should filter companies by industry', async () => {
      const result = await companyRepository.search({
        industry: 'Search Technology'
      });
      
      expect(result.companies).toHaveLength(1);
      expect(result.companies[0].industryPrimary).toBe('Search Technology');
    });
  });
});

// tests/helpers/database.ts
import { execSync } from 'child_process';
import { prisma } from '../../database/client';

export async function setupTestDatabase() {
  // 创建测试数据库
  execSync('npx prisma migrate reset --force --skip-seed', { stdio: 'inherit' });
  await prisma.$connect();
}

export async function teardownTestDatabase() {
  await prisma.$disconnect();
}

export async function createTestCompany(overrides = {}) {
  return await prisma.company.create({
    data: {
      name: 'Test Company',
      slug: 'test-company',
      industryPrimary: 'Technology',
      industrySecondary: [],
      isActive: true,
      ...overrides
    }
  });
}
```

---

## ✅ Acceptance Criteria

### Definition of Done
```yaml
Database Foundation:
  ✅ PostgreSQL 15+数据库成功部署
  ✅ 所有核心表结构创建完成
  ✅ 性能优化索引全部建立
  ✅ 数据约束和完整性检查有效
  ✅ Prisma ORM集成和迁移成功

TypeScript类型安全:
  ✅ 完整的TypeScript接口定义
  ✅ Prisma Client类型生成成功
  ✅ 所有数据库操作类型安全
  ✅ 枚举类型正确映射
  ✅ 编译时类型检查通过

Repository层:
  ✅ CompanyRepository核心功能实现
  ✅ MRRRepository核心功能实现
  ✅ 数据访问层抽象设计合理
  ✅ 错误处理机制完善
  ✅ 日志记录机制完整

性能和质量:
  ✅ 单表查询响应时间 < 50ms
  ✅ 复杂查询响应时间 < 500ms
  ✅ 并发连接池配置优化
  ✅ 单元测试覆盖率 ≥ 90%
  ✅ 集成测试全部通过

开发体验:
  ✅ 开发环境一键启动 (docker-compose up)
  ✅ 数据迁移脚本稳定可靠
  ✅ 种子数据脚本提供示例
  ✅ 开发文档完整清晰
  ✅ 调试和监控工具配置完成
```

### Performance Benchmarks
```yaml
查询性能验证:
  companies表全扫描: "< 100ms (10万记录)"
  基于索引的查询: "< 10ms"
  全文搜索查询: "< 50ms"
  复杂JOIN查询: "< 200ms"
  分页查询: "< 30ms"
  
写入性能验证:
  单条记录插入: "< 5ms"
  批量插入(1000条): "< 100ms"
  事务提交: "< 20ms"
  索引更新: "< 10ms"
  
并发性能验证:
  100并发读取: "成功率 100%，响应时间 < 100ms"
  50并发写入: "成功率 100%，响应时间 < 200ms"
  混合读写: "读写比8:2，整体响应时间 < 150ms"
```

### Code Quality Gates
```yaml
TypeScript质量:
  ✅ strict模式启用
  ✅ noImplicitAny: true
  ✅ strictNullChecks: true
  ✅ 类型覆盖率 100%

代码规范:
  ✅ ESLint配置和检查通过
  ✅ Prettier格式化规范
  ✅ 命名规范一致性
  ✅ 注释和文档完整性

测试质量:
  ✅ 单元测试覆盖率 ≥ 90%
  ✅ 集成测试覆盖关键流程
  ✅ 错误场景测试完整
  ✅ 性能回归测试通过
```

---

## 🔄 Story Dependencies & Next Steps

### Blocking Dependencies
**None** - 这是基础Story，为后续所有开发提供数据层支持

### Dependent Stories (将被此Story解除阻塞)
1. **Story #002**: AI Data Collection Service (需要Company和DataCollectionTask表)
2. **Story #003**: MRR Analysis Engine (需要MRRRecord表和相关索引)
3. **Story #004**: Investment Scoring System (需要InvestmentScore表)
4. **Story #005**: API Gateway & Authentication (需要完整数据模型)

### Integration Points
```yaml
与后续Agent协作:
  ai-engineer: "依赖Company和MRRRecord表进行AI数据分析"
  data-scientist: "依赖完整数据模型进行评分算法开发"
  python-expert: "依赖DataCollectionTask表进行任务管理"
  frontend-developer: "依赖API层(需要数据库支持)进行界面开发"
  ml-engineer: "依赖GrowthPrediction表进行模型训练"
```

---

## 📊 Story Metrics & Tracking

### Development Metrics
```yaml
工作量估算:
  数据库设计: 8小时
  Prisma配置: 4小时
  Repository开发: 12小时
  测试开发: 8小时
  文档编写: 4小时
  总计: 36小时 (约4.5工作日)

质量指标:
  代码覆盖率目标: ≥90%
  类型安全覆盖: 100%
  性能基准达成: 100%
  文档完整性: 100%
```

### Risk Mitigation
```yaml
潜在风险:
  数据迁移风险: "多环境测试，回滚方案准备"
  性能风险: "基准测试，索引优化验证"
  兼容性风险: "PostgreSQL版本锁定，扩展兼容性验证"
  数据一致性风险: "事务测试，约束验证"

应对策略:
  渐进式部署: "先开发环境，后测试环境，最后生产环境"
  监控预警: "查询性能监控，异常告警机制"
  备份策略: "自动备份，快速恢复机制"
```

---

**Story Status**: ✅ Ready for Implementation  
**Next Action**: 由backend-developer Agent开始数据库基础架构开发  
**Expected Completion**: Phase 1, Week 1 结束前  
**Success Criteria**: 所有验收条件满足，为后续5个Story解除阻塞  

> 🎯 **Story重要性**: 作为系统的数据层基础，此Story的成功实施将为整个AI Investment MRR Tracker项目提供坚实的数据架构支撑，确保后续AI分析、投资评分、预测模型等核心功能的顺利开发。