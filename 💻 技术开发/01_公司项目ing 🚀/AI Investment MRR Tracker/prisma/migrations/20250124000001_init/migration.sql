-- CreateTable
CREATE TABLE "data_sources" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "baseUrl" TEXT,
    "apiKey" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "rateLimit" INTEGER,
    "reliability" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "data_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "website" TEXT,
    "foundedYear" INTEGER,
    "teamSize" INTEGER,
    "teamSizeSource" TEXT,
    "industry" TEXT,
    "subIndustry" TEXT,
    "stage" TEXT,
    "location" TEXT,
    "logoUrl" TEXT,
    "linkedinUrl" TEXT,
    "twitterUrl" TEXT,
    "githubUrl" TEXT,
    "crunchbaseUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isUnicorn" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastDataUpdate" TIMESTAMP(3),

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mrr_data" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "dataSourceId" TEXT NOT NULL,
    "monthYear" TEXT NOT NULL,
    "quarter" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "mrrAmount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "growthRate" DECIMAL(65,30),
    "yoyGrowthRate" DECIMAL(65,30),
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "dataQuality" TEXT NOT NULL DEFAULT 'medium',
    "isEstimated" BOOLEAN NOT NULL DEFAULT false,
    "estimationMethod" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedBy" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "collectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mrr_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investment_scores" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "scalabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "productMarketFitScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "executionScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "leadershipScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "opportunityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "technologyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "financialScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "marketScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "teamScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "normalizedScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "recommendation" TEXT NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "targetValuation" DECIMAL(65,30),
    "recommendedInvestment" DECIMAL(65,30),
    "expectedReturn" DOUBLE PRECISION,
    "timeHorizon" INTEGER,
    "analysisDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "analystId" TEXT,
    "analysisMethod" TEXT,
    "keyInsights" JSONB,
    "riskFactors" JSONB,
    "strengths" JSONB,
    "weaknesses" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "investment_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection_tasks" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "dataSourceId" TEXT NOT NULL,
    "taskType" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "scheduledAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "maxRetries" INTEGER NOT NULL DEFAULT 3,
    "parameters" JSONB,
    "configuration" JSONB,
    "result" JSONB,
    "errorMessage" TEXT,
    "logs" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collection_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funding_rounds" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "roundType" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "valuation" DECIMAL(65,30),
    "valuationType" TEXT,
    "announcedDate" TIMESTAMP(3) NOT NULL,
    "closedDate" TIMESTAMP(3),
    "leadInvestors" JSONB,
    "investors" JSONB,
    "investorCount" INTEGER,
    "source" TEXT,
    "sourceUrl" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "funding_rounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_metrics" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "period" TEXT NOT NULL,
    "totalUsers" INTEGER,
    "activeUsers" INTEGER,
    "paidUsers" INTEGER,
    "churnRate" DOUBLE PRECISION,
    "revenue" DECIMAL(65,30),
    "arr" DECIMAL(65,30),
    "grossMargin" DOUBLE PRECISION,
    "burnRate" DECIMAL(65,30),
    "runway" INTEGER,
    "userGrowthRate" DOUBLE PRECISION,
    "revenueGrowthRate" DOUBLE PRECISION,
    "marketShare" DOUBLE PRECISION,
    "customerAcquisitionCost" DECIMAL(65,30),
    "lifetimeValue" DECIMAL(65,30),
    "ltv2cacRatio" DOUBLE PRECISION,
    "dataSource" TEXT,
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "isEstimated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_configs" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "changes" JSONB,
    "userId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "data_sources_name_key" ON "data_sources"("name");

-- CreateIndex
CREATE UNIQUE INDEX "companies_name_key" ON "companies"("name");

-- CreateIndex
CREATE UNIQUE INDEX "companies_slug_key" ON "companies"("slug");

-- CreateIndex
CREATE INDEX "companies_industry_idx" ON "companies"("industry");

-- CreateIndex
CREATE INDEX "companies_stage_idx" ON "companies"("stage");

-- CreateIndex
CREATE INDEX "companies_isActive_idx" ON "companies"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "mrr_data_companyId_monthYear_dataSourceId_key" ON "mrr_data"("companyId", "monthYear", "dataSourceId");

-- CreateIndex
CREATE INDEX "mrr_data_companyId_monthYear_idx" ON "mrr_data"("companyId", "monthYear");

-- CreateIndex
CREATE INDEX "mrr_data_monthYear_idx" ON "mrr_data"("monthYear");

-- CreateIndex
CREATE INDEX "mrr_data_dataSourceId_idx" ON "mrr_data"("dataSourceId");

-- CreateIndex
CREATE UNIQUE INDEX "investment_scores_companyId_analysisDate_key" ON "investment_scores"("companyId", "analysisDate");

-- CreateIndex
CREATE INDEX "investment_scores_companyId_idx" ON "investment_scores"("companyId");

-- CreateIndex
CREATE INDEX "investment_scores_recommendation_idx" ON "investment_scores"("recommendation");

-- CreateIndex
CREATE INDEX "investment_scores_riskLevel_idx" ON "investment_scores"("riskLevel");

-- CreateIndex
CREATE INDEX "investment_scores_normalizedScore_idx" ON "investment_scores"("normalizedScore");

-- CreateIndex
CREATE INDEX "collection_tasks_status_scheduledAt_idx" ON "collection_tasks"("status", "scheduledAt");

-- CreateIndex
CREATE INDEX "collection_tasks_companyId_taskType_idx" ON "collection_tasks"("companyId", "taskType");

-- CreateIndex
CREATE INDEX "collection_tasks_dataSourceId_idx" ON "collection_tasks"("dataSourceId");

-- CreateIndex
CREATE INDEX "collection_tasks_status_idx" ON "collection_tasks"("status");

-- CreateIndex
CREATE INDEX "funding_rounds_companyId_announcedDate_idx" ON "funding_rounds"("companyId", "announcedDate");

-- CreateIndex
CREATE INDEX "funding_rounds_announcedDate_idx" ON "funding_rounds"("announcedDate");

-- CreateIndex
CREATE UNIQUE INDEX "company_metrics_companyId_date_period_key" ON "company_metrics"("companyId", "date", "period");

-- CreateIndex
CREATE INDEX "company_metrics_companyId_date_idx" ON "company_metrics"("companyId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "system_configs_key_key" ON "system_configs"("key");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "audit_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_timestamp_idx" ON "audit_logs"("timestamp");

-- AddForeignKey
ALTER TABLE "mrr_data" ADD CONSTRAINT "mrr_data_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mrr_data" ADD CONSTRAINT "mrr_data_dataSourceId_fkey" FOREIGN KEY ("dataSourceId") REFERENCES "data_sources"("id") ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investment_scores" ADD CONSTRAINT "investment_scores_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_tasks" ADD CONSTRAINT "collection_tasks_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_tasks" ADD CONSTRAINT "collection_tasks_dataSourceId_fkey" FOREIGN KEY ("dataSourceId") REFERENCES "data_sources"("id") ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funding_rounds" ADD CONSTRAINT "funding_rounds_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_metrics" ADD CONSTRAINT "company_metrics_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Insert initial system configurations
INSERT INTO "system_configs" ("id", "key", "value", "description", "category") VALUES
('clxxxxxxxxxxxxxxxxxxxxxxxx', 'app.version', '1.0.0', 'Application version', 'app'),
('clxxxxxxxxxxxxxxxxxxxxxxxy', 'data.collection.batch_size', '100', 'Default batch size for data collection', 'collection'),
('clxxxxxxxxxxxxxxxxxxxxxxxz', 'data.collection.retry_delay', '300', 'Delay between retries in seconds', 'collection'),
('clxxxxxxxxxxxxxxxxxxxxxxx1', 'data.mrr.confidence_threshold', '0.7', 'Minimum confidence score for MRR data', 'data'),
('clxxxxxxxxxxxxxxxxxxxxxxx2', 'investment.score.weights', '{"scalability": 0.25, "productMarketFit": 0.25, "execution": 0.2, "leadership": 0.15, "opportunity": 0.15}', 'SPELO scoring weights', 'investment'),
('clxxxxxxxxxxxxxxxxxxxxxxx3', 'api.rate_limit.default', '1000', 'Default API rate limit per hour', 'api'),
('clxxxxxxxxxxxxxxxxxxxxxxx4', 'notification.email.enabled', 'false', 'Enable email notifications', 'notification');

-- Insert sample data sources
INSERT INTO "data_sources" ("id", "name", "type", "description", "reliability") VALUES
('dsxxxxxxxxxxxxxxxxxxxxxxx1', 'Manual Entry', 'manual', 'Manual data entry by analysts', 0.9),
('dsxxxxxxxxxxxxxxxxxxxxxxx2', 'Company Reports', 'file_upload', 'Upload company financial reports', 0.8),
('dsxxxxxxxxxxxxxxxxxxxxxxx3', 'Web Scraping', 'scraping', 'Automated web scraping', 0.6),
('dsxxxxxxxxxxxxxxxxxxxxxxx4', 'API Integration', 'api', 'Third-party API integration', 0.7);