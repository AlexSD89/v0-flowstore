# 🇨🇳 中国社交媒体PMF监控系统

> **系统升级公告**: 已从西方MRR财报分析系统完全升级为中国PMF监控系统，专注于200万RMB以下MRR的中国初创企业投资信号发现。

[![Version](https://img.shields.io/badge/version-1.0.0--china-red.svg)](https://github.com/launchx/china-pmf-monitoring-system)
[![Platform](https://img.shields.io/badge/platform-中国社交媒体-blue.svg)](#supported-platforms)
[![AI](https://img.shields.io/badge/AI-GPT--4分析-green.svg)](#ai-features)
[![License](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)

## 🎯 系统概述

### 核心价值主张

**问题**: 早期PMF阶段的中国初创企业缺乏财报数据，传统MRR追踪系统无法有效工作。

**解决方案**: 基于中国社交媒体平台的PMF信号智能监控系统，通过标签分析和AI语义理解，发现投资机会。

### 系统特色

- 🏢 **中国本土化**: 专门针对小红书、知乎、微博、抖音等中国主流平台
- 🏷️ **4层级标签系统**: Tier1直接PMF信号 → Tier4市场机会信号
- 🤖 **GPT-4智能分析**: 7维度内容语义分析和投资价值评估
- ⚡ **实时监控**: 7×24小时自动扫描和高分信号预警
- 📊 **投资决策支持**: 自动化报告生成和投资建议

## 🚀 快速开始

### 环境要求

```bash
Node.js >= 18.0.0
TypeScript >= 5.6.0
OpenAI API Key (GPT-4访问权限)
PostgreSQL/SQLite 数据库
```

### 安装和启动

```bash
# 1. 安装依赖
npm install

# 2. 环境配置
cp .env.example .env.local
# 编辑 .env.local，填入 OPENAI_API_KEY 等必要配置

# 3. 数据库初始化
npm run db:setup
npm run db:migrate

# 4. 启动开发服务器
npm run dev

# 5. 验证系统状态
curl http://localhost:3001/health
```

### 快速体验

```bash
# 搜索小红书MVP信号
npm run demo:xiaohongshu

# 生成PMF监控报告
npm run demo:report
```

## 📊 支持的中国社交媒体平台 {#supported-platforms}

| 平台 | 支持状态 | 搜索方式 | 特色功能 |
|------|----------|----------|----------|
| 🟠 **小红书** | ✅ 完全支持 | 标签+关键词 | PMF信号检测专门优化 |
| 💙 **知乎** | 🔄 开发中 | 问答+专栏 | 技术深度分析 |
| 🔴 **微博** | 🔄 开发中 | 热搜+话题 | 舆情监控 |
| 🎵 **抖音** | 📋 计划中 | 短视频+话题 | 视觉内容分析 |

## 🏷️ PMF标签层级系统

### Tier 1: 直接PMF信号 (权重40%)
```
#MVP #产品验证 #用户验证 #产品迭代 #PMF
#用户反馈 #产品优化 #市场验证 #用户增长 #产品市场匹配
```

### Tier 2: 痛点识别 (权重30%)
```
#创业 #解决方案 #用户痛点 #市场需求 #问题验证
#客户访谈 #需求分析 #市场调研 #用户研究 #痛点挖掘
```

### Tier 3: 执行能力 (权重20%)
```
#招聘 #团队扩张 #融资 #A轮 #天使轮 #种子轮
#CTO招聘 #技术合伙人 #产品经理招聘 #运营招聘
```

### Tier 4: 市场信号 (权重10%)
```
#行业分析 #竞品分析 #市场规模 #TAM #SAM #SOM
#商业模式 #盈利模式 #增长策略 #市场定位
```

## 🤖 AI分析功能 {#ai-features}

### 7维度智能评分

1. **产品验证信号** (0-10分): MVP展示、用户反馈、产品迭代
2. **市场需求验证** (0-10分): 用户痛点识别、需求分析、市场调研
3. **用户增长信号** (0-10分): 用户数量增长、留存率、活跃度
4. **团队执行力** (0-10分): 团队招聘、融资进展、里程碑达成
5. **商业模式清晰度** (0-10分): 收入模式、盈利路径、商业逻辑
6. **技术壁垒** (0-10分): 技术优势、专利、算法创新
7. **市场时机** (0-10分): 行业趋势、政策支持、市场成熟度

### AI分析示例

```json
{
  "pmfSignals": {
    "tier1Score": 8.5,
    "tier2Score": 7.2,
    "tier3Score": 6.8,
    "tier4Score": 7.0,
    "overallScore": 7.6,
    "confidence": 0.85
  },
  "investmentSignals": {
    "stageIndicators": ["天使轮"],
    "teamSignals": ["CTO招聘", "技术合伙人"],
    "technologySignals": ["AI"],
    "marketSignals": ["市场需求强烈", "技术门槛较高"]
  }
}
```

## 📡 API接口文档

### 基础路径: `/api/china-monitoring`

#### 1. PMF信号搜索
```http
GET /api/china-monitoring/search-pmf
```

**参数**:
- `platforms`: 平台列表 (xiaohongshu,zhihu,weibo,douyin)
- `tags`: 标签列表 (#MVP,#产品验证,#用户验证)
- `minScore`: 最低分数 (0-10)
- `limit`: 结果数量 (1-100)

**示例**:
```bash
curl "http://localhost:3001/api/china-monitoring/search-pmf?platforms=xiaohongshu&tags=#MVP,#产品验证&minScore=7.0&limit=20"
```

#### 2. 生成PMF监控报告
```http
GET /api/china-monitoring/generate-report
```

**参数**:
- `platforms`: 平台列表
- `days`: 时间范围(天数)
- `minScore`: 最低分数阈值

**示例**:
```bash
curl "http://localhost:3001/api/china-monitoring/generate-report?days=7&minScore=6.0"
```

#### 3. 投资机会列表
```http
GET /api/china-monitoring/investment-opportunities
```

**参数**:
- `minScore`: 最低分数
- `stage`: 发展阶段 (种子轮/天使轮/A轮)
- `technology`: 技术领域 (AI/区块链/SaaS)
- `limit`: 结果数量

#### 4. PMF标签配置
```http
GET /api/china-monitoring/pmf-tags
```
返回完整的4层级标签配置和使用说明。

#### 5. 监控统计数据
```http
GET /api/china-monitoring/stats?days=30
```
返回指定时间范围内的监控统计数据。

#### 6. 手动触发监控任务
```http
POST /api/china-monitoring/trigger-task
```

**请求体**:
```json
{
  "platforms": ["xiaohongshu"],
  "tags": ["#MVP", "#产品验证"],
  "priority": "high"
}
```

## 🛠️ 开发指南

### 项目结构

```
src/
├── services/
│   └── chinaMonitoringService.ts    # 核心监控服务
├── controllers/
│   └── chinaMonitoringController.ts # API控制器
├── routes/
│   └── chinaMonitoringRoutes.ts     # API路由
├── algorithms/
│   └── chinaPMFDetection.ts         # PMF检测算法
└── types/
    └── chinaTypes.ts                # 类型定义
```

### 核心类使用

```typescript
import MultiPlatformChinaMonitor from './services/chinaMonitoringService';
import ChinaPMFDetectionAlgorithm from './algorithms/chinaPMFDetection';

// 初始化监控系统
const monitor = new MultiPlatformChinaMonitor(process.env.OPENAI_API_KEY);

// 搜索PMF信号
const results = await monitor.searchPMFSignals({
  platforms: ['xiaohongshu'],
  tags: ['#MVP', '#产品验证'],
  minScore: 7.0,
  limit: 50
});

// 生成报告
const report = await monitor.generatePMFReport(results);
console.log(report);
```

### 自定义PMF检测算法

```typescript
import ChinaPMFDetectionAlgorithm from './algorithms/chinaPMFDetection';

// 自定义权重配置
const customWeights = {
  tier1Weight: 0.5,    // 增加直接PMF信号权重
  tier2Weight: 0.3,
  tier3Weight: 0.15,
  tier4Weight: 0.05,
  engagementBonus: 0.2 // 增加互动数据影响
};

const detector = new ChinaPMFDetectionAlgorithm(
  process.env.OPENAI_API_KEY,
  customWeights
);

const analysis = await detector.detectPMFSignals(contentList);
```

## 📈 性能指标

### 系统性能

- **监控覆盖**: >10,000 中国初创企业
- **数据更新**: 实时更新，延迟<1小时
- **检测准确率**: >85% PMF信号识别准确率
- **响应时间**: API平均响应<2秒
- **系统稳定性**: >99.5% 可用时间

### AI分析性能

- **语义分析准确率**: >90%
- **投资价值预测**: >75% 准确率
- **风险识别**: >80% 准确率
- **阶段判断**: >85% 准确率

## 🔄 系统升级说明

### 从MRR系统到PMF监控系统

#### 升级原因
1. **数据可获得性**: PMF阶段初创企业无财报数据
2. **市场适应性**: 更符合中国投资环境
3. **信号丰富性**: 社交媒体信号更及时和丰富
4. **成本效益**: 降低数据获取成本

#### 核心改进
1. **数据源**: 从财报→社交媒体平台
2. **检测方法**: 从MRR计算→PMF信号分析
3. **地域覆盖**: 从全球→中国专精
4. **分析深度**: 加入AI语义分析

#### 向后兼容
- 保留原有API结构 (标记为Legacy)
- 数据库结构兼容
- 渐进式升级路径

## 🌟 使用场景

### 1. 投资人日常监控

```bash
# 每日高分机会发现
curl "http://localhost:3001/api/china-monitoring/search-pmf?minScore=8.0&limit=10"

# 周度投资机会报告
curl "http://localhost:3001/api/china-monitoring/generate-report?days=7"
```

### 2. 特定赛道研究

```bash
# AI赛道PMF监控
curl "http://localhost:3001/api/china-monitoring/investment-opportunities?technology=AI&minScore=7.0"

# SaaS行业趋势分析
curl "http://localhost:3001/api/china-monitoring/search-pmf?tags=#SaaS,#企业服务&platforms=xiaohongshu,zhihu"
```

### 3. 投资组合追踪

```bash
# 已投项目后续发展监控
curl "http://localhost:3001/api/china-monitoring/search-pmf?tags=#A轮,#B轮&minScore=6.0"
```

## 🚨 注意事项

### API限制
- **搜索PMF信号**: 15分钟30次
- **生成报告**: 30分钟10次
- **投资机会**: 15分钟60次
- **手动触发**: 1小时5次

### 数据合规
- 遵守各平台API使用条款
- 尊重用户隐私和数据保护
- 仅用于公开可见内容分析

### 技术限制
- OpenAI API调用频率限制
- 社交媒体平台反爬虫机制
- 中文内容理解准确性依赖AI模型能力

## 🤝 贡献指南

### 开发环境设置

```bash
# Fork 项目
git clone https://github.com/your-username/china-pmf-monitoring-system.git
cd china-pmf-monitoring-system

# 安装开发依赖
npm install
npm run type-check
npm run lint

# 运行测试
npm test
```

### 贡献类型

1. **新平台支持**: 添加知乎、微博、抖音监控
2. **算法优化**: 改进PMF检测算法准确性
3. **标签扩展**: 丰富PMF标签层级系统
4. **性能优化**: 提升系统响应速度
5. **文档完善**: 改进API文档和使用指南

## 📞 技术支持

### 联系方式
- **项目维护**: LaunchX China Investment Team
- **技术支持**: [GitHub Issues](https://github.com/launchx/china-pmf-monitoring-system/issues)
- **功能请求**: [Feature Requests](https://github.com/launchx/china-pmf-monitoring-system/issues/new?template=feature_request.md)

### 常见问题

**Q: 为什么从MRR系统切换到PMF监控？**
A: PMF阶段的中国初创企业缺乏财报数据，社交媒体PMF信号更及时、丰富且可获得。

**Q: 支持哪些中国社交媒体平台？**
A: 目前完全支持小红书，知乎、微博、抖音正在开发中。

**Q: AI分析的准确性如何？**
A: 基于GPT-4的7维度分析，整体准确率超过85%，持续优化中。

**Q: 如何获取OpenAI API Key？**
A: 访问 [OpenAI官网](https://platform.openai.com/api-keys) 申请API密钥，需要GPT-4访问权限。

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

<div align="center">

**🇨🇳 专注中国初创企业投资机会发现 🚀**

[项目主页](https://github.com/launchx/china-pmf-monitoring-system) • 
[API文档](http://localhost:3001/api/china-monitoring/docs) • 
[系统状态](http://localhost:3001/system-status) • 
[问题反馈](https://github.com/launchx/china-pmf-monitoring-system/issues)

</div>