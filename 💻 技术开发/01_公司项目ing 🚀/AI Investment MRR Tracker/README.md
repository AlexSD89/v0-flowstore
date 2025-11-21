# AI Investment MRR Tracker

**AI智能投资MRR追踪系统** - 专注于200万以下MRR的AI初创企业投资分析和追踪

## 🎯 项目概述

基于OpenBook开源项目架构优化，结合LangChain AI能力，构建的全自动化AI初创企业MRR（月度经常性收入）追踪和投资决策支持系统。

### 核心特性
- 🤖 **7×24小时自动化数据采集**: 持续监控ProductHunt、GitHub、招聘网站等信息源
- 📊 **智能MRR计算和分析**: AI驱动的收入识别、增长率计算和趋势分析  
- 🎯 **精准投资机会发现**: 专注月收入200万以下的AI初创企业
- ⚡ **实时预警和通知**: 收入异常、增长变化、团队动态实时监控
- 📈 **量化投资决策支持**: 7维度评分系统和投资建议生成

### 技术架构
```
TypeScript + LangChain + PostgreSQL + Next.js
自动化调度 + 智能数据提取 + 增长分析 + 投资评分
```

## 🚀 快速开始

### 环境要求
- Node.js 18+
- PostgreSQL 14+
- OpenAI API Key
- 4GB+ RAM

### 安装步骤
```bash
# 1. 克隆项目
git clone https://github.com/your-org/ai-investment-mrr-tracker.git
cd ai-investment-mrr-tracker

# 2. 安装依赖
npm install

# 3. 环境配置
cp .env.example .env
# 编辑 .env 文件，配置数据库和API密钥

# 4. 数据库初始化
npm run db:migrate
npm run db:seed

# 5. 启动开发服务器
npm run dev
```

### 核心配置
```env
# OpenAI API配置
OPENAI_API_KEY=your_openai_api_key

# 数据库配置
DATABASE_URL=postgresql://username:password@localhost:5432/mrr_tracker

# 调度配置
COLLECTION_INTERVAL=0 */6 * * *  # 每6小时采集一次
ANALYSIS_INTERVAL=0 0 */12 * *   # 每12小时分析一次
```

## 📊 功能模块

### 1. 数据采集引擎
- **多源信息采集**: ProductHunt新产品、GitHub项目活跃度、招聘信息等
- **智能内容提取**: LangChain驱动的非结构化数据解析
- **实时更新机制**: 增量采集和全量更新相结合

### 2. MRR分析系统  
- **收入计算算法**: 直接数据 + 推算模型的混合计算
- **增长趋势分析**: 月度环比、年度复合增长率、增长稳定性
- **质量评估**: 多源验证、异常检测、置信度评分

### 3. 投资评分引擎
- **多维度评分**: MRR规模(30%) + 增长速度(40%) + 增长质量(20%) + 市场机会(10%)
- **风险评估模型**: 收入风险、团队风险、市场风险、技术风险
- **投资建议生成**: 推荐等级和具体投资建议

### 4. 监控预警系统
- **异常检测**: 收入突变、增长异常、团队变动
- **实时通知**: 邮件、微信、系统内通知
- **投资组合跟踪**: 已投资企业表现监控

## 📈 使用示例

### 企业MRR分析
```typescript
// 分析特定企业MRR情况
const analysis = await mrrAnalyzer.analyzeCompany({
  name: "AI视频生成公司",
  website: "https://example.com",
  estimatedTeamSize: 20
});

console.log(analysis);
// 输出: MRR数据、增长分析、投资评分、风险评估
```

### 行业趋势研究
```typescript  
// 研究AI内容创作行业MRR趋势
const trends = await mrrAnalyzer.analyzeIndustryTrends({
  industry: "AI内容创作",
  mrrRange: [0, 2000000], // 200万以下
  timeRange: "last_6_months"
});
```

### 投资机会发现
```typescript
// 发现投资机会
const opportunities = await investmentFinder.findOpportunities({
  minGrowthRate: 0.15,      // 月增长15%以上
  maxMRR: 2000000,         // MRR 200万以下
  minConfidence: 0.8,      // 数据置信度80%以上
  industries: ["AI", "机器学习"]
});
```

## 🛠️ 开发指南

### 项目结构
```
src/
├── collectors/          # 数据采集模块
│   ├── sources/        # 各种数据源适配器
│   └── schedulers/     # 采集任务调度
├── analyzers/          # 分析引擎模块
│   ├── mrr/           # MRR计算分析
│   └── growth/        # 增长趋势分析
├── scorers/            # 评分系统模块
│   ├── investment/    # 投资价值评分
│   └── risk/          # 风险评估模型
├── api/                # API接口层
├── web/                # Web界面
└── utils/              # 工具函数
```

### 核心API

#### 企业管理
```typescript
GET    /api/companies           # 获取企业列表
POST   /api/companies           # 添加新企业
GET    /api/companies/:id       # 获取企业详情
PUT    /api/companies/:id       # 更新企业信息
```

#### MRR数据
```typescript
GET    /api/mrr/:companyId      # 获取企业MRR历史
POST   /api/mrr/analyze         # 触发MRR分析
GET    /api/mrr/trends          # 获取行业MRR趋势
```

#### 投资分析  
```typescript
GET    /api/investment/scores   # 获取投资评分
POST   /api/investment/evaluate # 评估投资价值
GET    /api/investment/opportunities # 获取投资机会
```

### 数据模型

#### 企业信息
```sql
companies:
  - id: 企业唯一标识
  - name: 企业名称
  - description: 企业描述
  - website: 官方网站
  - team_size: 团队规模
  - industry: 所属行业
  - founded_date: 成立时间
```

#### MRR数据
```sql
mrr_data:
  - company_id: 企业ID
  - month_year: 数据月份
  - mrr_amount: MRR金额
  - growth_rate: 增长率
  - confidence_score: 置信度
  - data_source: 数据来源
```

## 📋 部署指南

### Docker部署
```bash
# 构建镜像
docker build -t ai-mrr-tracker .

# 启动服务
docker-compose up -d
```

### 生产环境配置
```yaml
# docker-compose.prod.yml
services:
  app:
    image: ai-mrr-tracker:latest
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      OPENAI_API_KEY: ${OPENAI_API_KEY}
  
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: mrr_tracker
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
  
  redis:
    image: redis:7-alpine
```

## 🔍 监控和运维

### 健康检查
- `/health` - 系统健康状态
- `/metrics` - 系统性能指标  
- `/status` - 数据采集状态

### 日志管理
- 数据采集日志: 采集成功率、错误记录
- 分析处理日志: 处理时间、准确率统计
- 系统运行日志: 性能监控、异常告警

### 备份策略
- 数据库每日自动备份
- MRR历史数据永久保存
- 系统配置文件版本管理

## 🚨 故障排除

### 常见问题
1. **数据采集失败**: 检查网络连接和API限制
2. **MRR计算异常**: 验证数据源质量和算法参数
3. **系统性能问题**: 优化数据库查询和缓存策略
4. **预警不及时**: 检查调度任务和通知配置

### 支持资源
- 📚 [完整文档](./docs/)
- 🔧 [配置指南](./docs/configuration.md)
- 🚀 [部署说明](./docs/deployment.md)
- ❓ [FAQ](./docs/faq.md)

## 📄 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

---

**项目状态**: 🚧 开发中  
**版本**: v1.0.0-alpha  
**最后更新**: 2025-01-22  
**维护团队**: LaunchX投资分析团队

> 🎯 **愿景**: 成为AI投资人的智能决策助手，通过精准的MRR追踪和分析，帮助发现下一个独角兽企业。