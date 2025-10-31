import { Prisma } from '@prisma/client';

// 基础类型导出
export type Company = Prisma.CompanyGetPayload<{}>;
export type MrrData = Prisma.MrrDataGetPayload<{}>;
export type InvestmentScore = Prisma.InvestmentScoreGetPayload<{}>;
export type DataSource = Prisma.DataSourceGetPayload<{}>;
export type CollectionTask = Prisma.CollectionTaskGetPayload<{}>;
export type FundingRound = Prisma.FundingRoundGetPayload<{}>;
export type CompanyMetrics = Prisma.CompanyMetricsGetPayload<{}>;
export type SystemConfig = Prisma.SystemConfigGetPayload<{}>;
export type AuditLog = Prisma.AuditLogGetPayload<{}>;

// 包含关联数据的复合类型
export type CompanyWithMrrData = Prisma.CompanyGetPayload<{
  include: {
    mrrData: true;
    investmentScores: true;
    fundingRounds: true;
    companyMetrics: true;
  };
}>;

export type MrrDataWithCompany = Prisma.MrrDataGetPayload<{
  include: {
    company: true;
    dataSource: true;
  };
}>;

export type InvestmentScoreWithCompany = Prisma.InvestmentScoreGetPayload<{
  include: {
    company: true;
  };
}>;

export type CollectionTaskWithRelations = Prisma.CollectionTaskGetPayload<{
  include: {
    company: true;
    dataSource: true;
  };
}>;

// 创建和更新的输入类型
export type CreateCompanyInput = Prisma.CompanyCreateInput;
export type UpdateCompanyInput = Prisma.CompanyUpdateInput;
export type CreateMrrDataInput = Prisma.MrrDataCreateInput;
export type UpdateMrrDataInput = Prisma.MrrDataUpdateInput;
export type CreateInvestmentScoreInput = Prisma.InvestmentScoreCreateInput;
export type UpdateInvestmentScoreInput = Prisma.InvestmentScoreUpdateInput;
export type CreateDataSourceInput = Prisma.DataSourceCreateInput;
export type UpdateDataSourceInput = Prisma.DataSourceUpdateInput;
export type CreateCollectionTaskInput = Prisma.CollectionTaskCreateInput;
export type UpdateCollectionTaskInput = Prisma.CollectionTaskUpdateInput;

// 查询选项类型
export type CompanyQueryOptions = {
  include?: Prisma.CompanyInclude;
  where?: Prisma.CompanyWhereInput;
  orderBy?: Prisma.CompanyOrderByWithRelationInput;
  skip?: number;
  take?: number;
};

export type MrrDataQueryOptions = {
  include?: Prisma.MrrDataInclude;
  where?: Prisma.MrrDataWhereInput;
  orderBy?: Prisma.MrrDataOrderByWithRelationInput;
  skip?: number;
  take?: number;
};

// 业务逻辑类型
export interface CompanyOverview {
  id: string;
  name: string;
  slug: string;
  industry: string | null;
  stage: string | null;
  teamSize: number | null;
  website: string | null;
  description: string | null;
  isActive: boolean;
  lastDataUpdate: Date | null;
  latestMrr: number | null;
  latestMrrGrowth: number | null;
  investmentScore: number | null;
  recommendation: string | null;
}

export interface MrrTrend {
  companyId: string;
  monthYear: string;
  mrrAmount: number;
  growthRate: number | null;
  yoyGrowthRate: number | null;
  confidenceScore: number;
  isEstimated: boolean;
}

export interface InvestmentAnalysis {
  companyId: string;
  totalScore: number;
  normalizedScore: number;
  recommendation: string;
  riskLevel: string;
  expectedReturn: number | null;
  timeHorizon: number | null;
  keyInsights: Record<string, any> | null;
  riskFactors: Record<string, any> | null;
  strengths: Record<string, any> | null;
  weaknesses: Record<string, any> | null;
}

// 数据采集相关类型
export interface CollectionResult {
  success: boolean;
  dataCount: number;
  errors: string[];
  warnings: string[];
  executionTime: number;
  timestamp: Date;
}

export interface DataSourceConfig {
  type: 'api' | 'scraping' | 'manual' | 'file_upload';
  baseUrl?: string;
  apiKey?: string;
  rateLimit?: number;
  parameters?: Record<string, any>;
  headers?: Record<string, string>;
}

export interface TaskParameters {
  targetDate?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  dataTypes?: string[];
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  retryPolicy?: {
    maxRetries: number;
    backoffMultiplier: number;
  };
}

// 统计分析类型
export interface MarketStatistics {
  totalCompanies: number;
  activeCompanies: number;
  averageMrr: number;
  medianMrr: number;
  totalMarketSize: number;
  averageGrowthRate: number;
  topPerformers: CompanyOverview[];
  industrialDistribution: Record<string, number>;
  stageDistribution: Record<string, number>;
}

export interface CompanyAnalytics {
  companyId: string;
  mrrTrend: MrrTrend[];
  growthAnalysis: {
    averageGrowthRate: number;
    volatility: number;
    trend: 'growing' | 'stable' | 'declining';
    seasonality: Record<string, number>;
  };
  benchmarking: {
    industryRank: number;
    industryPercentile: number;
    peerComparison: Array<{
      companyId: string;
      name: string;
      mrrRatio: number;
      growthRatio: number;
    }>;
  };
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
}

// 分页参数
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 搜索过滤器
export interface CompanyFilters {
  search?: string;
  industry?: string[];
  stage?: string[];
  teamSizeMin?: number;
  teamSizeMax?: number;
  mrrMin?: number;
  mrrMax?: number;
  growthRateMin?: number;
  growthRateMax?: number;
  isActive?: boolean;
  hasRecentData?: boolean;
}

export interface MrrDataFilters {
  companyId?: string;
  dateFrom?: string;
  dateTo?: string;
  confidenceMin?: number;
  dataQuality?: string[];
  isVerified?: boolean;
  isEstimated?: boolean;
}

// 错误类型
export interface DatabaseError {
  code: string;
  message: string;
  field?: string;
  value?: any;
  constraint?: string;
}

// 配置类型
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
  maxConnections?: number;
  connectionTimeout?: number;
  queryTimeout?: number;
}

export interface CacheConfig {
  enabled: boolean;
  ttl: number; // Time to live in seconds
  maxSize: number;
  strategy: 'lru' | 'fifo' | 'lfu';
}