# 📊 AI Investment MRR Tracker - Database Foundation

## 🎯 概述

这是AI Investment MRR Tracker项目的完整数据库基础架构，采用现代化的TypeScript + Prisma + PostgreSQL技术栈，为AI初创企业投资分析提供强大的数据支撑。

## 🏗️ 架构特点

### 核心设计理念
- **类型安全**: 完整的TypeScript类型定义，编译时错误检测
- **数据一致性**: 严格的数据验证和约束机制
- **性能优化**: 智能索引和查询优化策略
- **扩展性**: 模块化设计，易于扩展和维护

### 技术栈
- **数据库**: PostgreSQL 14+
- **ORM**: Prisma 5.20+
- **类型系统**: TypeScript 5.6+
- **验证**: Zod 3.22+
- **运行时**: Node.js 18+

## 📋 数据模型

### 核心实体

#### 1. Companies (企业表)
```sql
企业基础信息存储，包含500+字段的全面企业画像
- 基础信息：name, slug, description, website
- 团队信息：teamSize, foundedYear, location
- 分类信息：industry, subIndustry, stage
- 社交信息：linkedinUrl, twitterUrl, githubUrl
- 状态标记：isActive, isPublic, isUnicorn
```

#### 2. MrrData (MRR数据表)
```sql
月度经常性收入追踪，支持多数据源和置信度评分
- 时间维度：monthYear, quarter, year, month
- 财务数据：mrrAmount, currency, growthRate
- 数据质量：confidenceScore, dataQuality, isEstimated
- 验证状态：isVerified, verifiedBy, verifiedAt
```

#### 3. InvestmentScores (投资评分表)
```sql
SPELO框架的7维度投资评分系统
- SPELO维度：scalability, productMarketFit, execution, leadership, opportunity
- 扩展维度：technology, financial, market, team, risk
- 综合评估：totalScore, normalizedScore, recommendation
- 投资建议：riskLevel, expectedReturn, timeHorizon
```

#### 4. DataSources (数据源表)
```sql
多源数据集成管理，支持API、爬虫、手动录入
- 基础配置：name, type, baseUrl, apiKey
- 性能监控：rateLimit, reliability
- 状态管理：isActive, createdAt, updatedAt
```

#### 5. CollectionTasks (采集任务表)
```sql
智能数据采集任务调度和管理
- 任务配置：taskType, priority, status
- 执行控制：scheduledAt, retryCount, maxRetries
- 结果追踪：result, errorMessage, logs
```

### 扩展实体

#### 6. FundingRounds (融资轮次)
- 融资历史追踪和估值分析
- 投资人信息和轮次详情

#### 7. CompanyMetrics (企业指标)
- 用户增长、收入、成本等关键指标
- 支持月度、季度、年度数据

#### 8. SystemConfig (系统配置)
- 动态配置管理
- 支持分类和版本控制

#### 9. AuditLog (审计日志)
- 完整的数据变更追踪
- 合规性和安全性保障

## 🔧 Repository层架构

### BaseRepository
```typescript
抽象基类提供通用CRUD操作:
- 分页查询和排序
- 批量操作和事务支持
- 错误处理和数据验证
- 审计日志自动记录
```

### 专业化Repository
- **CompanyRepository**: 企业数据管理，支持复杂搜索和统计
- **MrrDataRepository**: MRR数据分析，趋势计算和异常检测
- **InvestmentScoreRepository**: 投资评分管理，SPELO分析和排名
- **DataSourceRepository**: 数据源监控，性能分析和健康检查
- **CollectionTaskRepository**: 任务调度，队列管理和故障恢复

## 🚀 快速开始

### 1. 环境准备
```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，配置 DATABASE_URL
```

### 2. 数据库设置
```bash
# 一键设置数据库（推荐）
npm run db:setup

# 或手动执行
npm run db:generate  # 生成Prisma客户端
npm run db:migrate   # 运行数据库迁移
npm run db:seed      # 填充示例数据
```

### 3. 开发工具
```bash
# 数据库可视化
npm run db:studio

# 重置数据库（开发环境）
npm run db:reset

# 创建新迁移
npm run db:migrate -- --name "your_migration_name"
```

## 📊 数据库性能优化

### 索引策略
```sql
-- 复合索引优化查询性能
CREATE INDEX idx_mrr_company_month ON mrr_data(company_id, month_year);
CREATE INDEX idx_investment_score_recommendation ON investment_scores(recommendation, normalized_score);
CREATE INDEX idx_collection_tasks_status_priority ON collection_tasks(status, priority, scheduled_at);
```

### 查询优化
- 使用LATERAL JOIN优化最新数据查询
- 预计算聚合数据减少实时计算
- 分页查询避免OFFSET性能问题

## 🔍 Repository使用示例

### 企业数据查询
```typescript
import { getCompanyRepository } from '@/repositories';

const companyRepo = getCompanyRepository();

// 获取公司概览（包含最新MRR和投资评分）
const companies = await companyRepo.getCompanyOverviews({
  industry: ['FinTech', 'AI'],
  teamSizeMin: 10,
  hasRecentData: true
}, { page: 1, limit: 20 });

// 搜索公司
const results = await companyRepo.searchCompanies('AI analytics', 10);
```

### MRR数据分析
```typescript
import { getMrrDataRepository } from '@/repositories';

const mrrRepo = getMrrDataRepository();

// 获取公司MRR趋势
const trend = await mrrRepo.getCompanyMrrTrend('company_id', 12);

// 批量插入MRR数据
const result = await mrrRepo.bulkUpsertMrrData([
  {
    companyId: 'company_id',
    monthYear: '2025-01',
    mrrAmount: 50000,
    // ... 其他字段
  }
]);
```

### 投资评分管理
```typescript
import { getInvestmentScoreRepository } from '@/repositories';

const scoreRepo = getInvestmentScoreRepository();

// 获取投资排行榜
const ranking = await scoreRepo.getInvestmentRanking('strong_buy', 'low', 50);

// 获取投资组合分析
const portfolio = await scoreRepo.getPortfolioAnalysis(['company1', 'company2']);
```

## 🛡️ 数据验证

### Zod Schema验证
```typescript
import { validateData, companySchema } from '@/lib/validation';

// 验证企业数据
const validatedData = validateData(companySchema, inputData);

// 异步验证（含业务规则）
const validatedData = await validateDataAsync(
  companySchema, 
  inputData,
  [customValidators.validateUniqueCompanyName]
);
```

### 自定义验证器
- 企业名称唯一性检查
- MRR数据重复检测
- 投资评分合理性验证

## 📈 监控和维护

### 性能监控
- Repository层自动性能记录
- 慢查询识别和优化建议
- 数据源健康状态监控

### 数据清理
```typescript
// 清理过期任务
await collectionTaskRepo.cleanupOldTasks(90);

// 检测异常数据
const anomalies = await mrrRepo.detectAnomalies('company_id', 3.0);
```

### 审计追踪
- 所有数据变更自动记录
- 支持按实体类型和时间范围查询
- 合规性报告生成

## 🔒 安全考虑

### 数据保护
- 敏感字段（如API Key）加密存储
- SQL注入防护
- 输入数据严格验证

### 访问控制
- Repository层权限检查
- 审计日志记录操作者信息
- 数据隔离和多租户支持

## 🚦 环境配置

### 开发环境
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ai_mrr_tracker_dev"
NODE_ENV="development"
SEED_DATABASE="true"
```

### 生产环境
```env
DATABASE_URL="postgresql://user:password@prod-db:5432/ai_mrr_tracker_prod"
NODE_ENV="production"
SEED_DATABASE="false"
```

## 📚 扩展指南

### 添加新的数据模型
1. 在 `prisma/schema.prisma` 中定义新模型
2. 创建对应的 TypeScript 类型
3. 实现专业化的 Repository 类
4. 添加数据验证 Schema
5. 创建数据库迁移

### 性能优化建议
- 合理使用数据库索引
- 避免N+1查询问题
- 使用批量操作提高效率
- 适当的数据缓存策略

## 🤝 贡献指南

1. 遵循现有的代码风格和架构模式
2. 为新功能添加完整的类型定义
3. 编写单元测试和集成测试
4. 更新相关文档和示例

## 📞 技术支持

如有问题或建议，请联系：
- 技术架构师：backend-architect@launchx.com
- 数据库团队：database-team@launchx.com
- GitHub Issues：https://github.com/launchx/ai-investment-mrr-tracker/issues

---

🎯 **AI Investment MRR Tracker Database Foundation v1.0**
Built with ❤️ by LaunchX Investment Analysis Team