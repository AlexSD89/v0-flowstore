# CLAUDE.md - AI智能投资MRR追踪系统

## 🎯 项目定位与核心架构

### 项目身份配置
```yaml
项目名称: "AI智能投资MRR追踪系统"
项目代码: "AI-MRR-Tracker"
版本标识: "v1.0"
创建时间: "2025-01-22_160000"
技术类型: "TypeScript + LangChain + 自动化数据采集"

业务定位:
  核心目标: "专注200万以下MRR的AI初创企业投资追踪"
  目标用户: "0代码背景的AI投资人"
  投资策略: "50万投资3-10人AI初创，追求1.5倍回报"
  数据焦点: "MRR收集、增长追踪、投资决策支持"
```

### BMAD混合智能架构 (基于OpenBook优化)
```
AI投资MRR追踪系统/
├── 🧠 Brain-Tier (投资人主导层)/
│   ├── 投资策略制定和风险偏好
│   ├── 投资机会判断和价值评估
│   └── 投资决策确认和组合管理
├── 🤖 AI-Tier (自动化执行层)/
│   ├── 数据收集引擎 (7×24小时采集)
│   ├── MRR计算和增长分析
│   ├── 投资评分和风险预警
│   └── 智能推荐和趋势预测
├── 🔄 数据处理流程/
│   ├── 多源信息采集 (ProductHunt, GitHub, 招聘等)
│   ├── LangChain智能提取和结构化
│   ├── MRR识别和增长率计算  
│   └── 投资建议生成和预警通知
└── 📊 投资决策支持/
    ├── MRR排行榜和增长趋势
    ├── 企业详情和竞品对比
    ├── 投资评分和风险分析
    └── 投资组合跟踪管理
```

## 🔧 技术栈与开发环境

### 核心技术配置 (基于OpenBook架构验证)
```yaml
编程语言:
  - TypeScript: "主要开发语言，类型安全保障"
  - Python: "数据处理和机器学习算法"
  - SQL: "数据库查询和分析统计"

AI框架:
  - LangChain: "智能数据提取和文本分析"
  - OpenAI GPT-4: "自然语言理解和结构化提取"
  - Langsmith: "LLM应用监控和调试"

数据存储:
  - SQLite: "开发环境轻量级数据库"
  - PostgreSQL: "生产环境关系型数据库"
  - Redis: "缓存和会话管理"

Web框架:
  - Next.js: "全栈React框架"
  - Express.js: "API服务和后端逻辑"
  - Tailwind CSS: "现代化UI样式框架"

自动化工具:
  - Node-cron: "定时任务调度"
  - Puppeteer: "网页自动化和数据采集"
  - Cheerio: "服务端DOM操作和解析"

部署运维:
  - Docker: "容器化部署"
  - Railway/Vercel: "云平台部署"
  - GitHub Actions: "CI/CD自动化"
```

### 关键开发命令
```bash
# 项目初始化和环境配置
npm init -y
npm install typescript @types/node ts-node nodemon
npm install langchain @langchain/openai @langchain/community
npm install express cors dotenv node-cron
npm install puppeteer cheerio axios
npm install sqlite3 pg redis

# 开发环境启动
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器

# 数据采集和处理
npm run collect      # 启动数据采集任务
npm run analyze      # 运行MRR分析算法
npm run score        # 计算投资评分

# 数据库管理
npm run db:migrate   # 运行数据库迁移
npm run db:seed      # 初始化种子数据
npm run db:backup    # 备份数据库
```

## 📝 AI投资MRR追踪系统文档生成规范

### 🏷️ 项目专用配置
```yaml
项目标识: "AI_MRR_Tracker"
项目全称: "AI智能投资MRR追踪系统 (AI Investment MRR Tracker)"
版本控制: "v1.x (投资追踪系统语义化版本)"
创建时间: "2025-01-22_160000"
更新频率: "基于MRR数据更新和投资反馈"

文档分类标签:
  - "mrr_tracking"
  - "investment_analysis"  
  - "ai_startup_monitoring"
  - "growth_analytics"
  - "investment_decision_support"
```

### 📊 MRR追踪专用文档生成规则
```yaml
文档命名标准:
  企业分析报告: "AI_MRR_Tracker_[企业名称]_Analysis_[时间戳].md"
  MRR趋势报告: "AI_MRR_Tracker_[行业/赛道]_MRR_Trends_[时间戳].md"
  投资机会报告: "AI_MRR_Tracker_Investment_Opportunities_[时间戳].md"
  增长预警报告: "AI_MRR_Tracker_Growth_Alert_[企业名称]_[时间戳].md"
  
示例格式:
  "AI_MRR_Tracker_小红书竞品_AI内容创作平台MRR分析_Content_AI_MRR_Analysis_2025-01-22_160000.md"
  
存储路径规范:
  企业档案: "./data/companies/"
  MRR数据: "./data/mrr_records/"  
  分析报告: "./reports/analysis/"
  投资记录: "./reports/investment_decisions/"
  预警通知: "./alerts/growth_warnings/"
  
数据文件管理:
  实时数据: "./data/realtime/" (24小时自动清理)
  历史数据: "./data/historical/" (永久保存)
  缓存文件: "./cache/" (7天自动清理)
  
自动化Hook集成:
  PreDataCollect: "验证数据源可用性和采集权限"
  PostDataProcess: "自动更新MRR计算和投资评分"
  AlertTrigger: "异常变化自动预警通知"
  
质量控制要求:
  ✅ 包含完整的MRR数据采集记录
  ✅ 增长率计算和趋势分析
  ✅ 投资评分和风险评估详情
  ✅ 数据来源和置信度标记
  ✅ 自动化采集状态和异常记录
  ✅ 完整的时间戳和版本追踪
```

### 🎯 MRR追踪文档模板
```yaml
企业分析报告模板:
  头部: "企业名称: AI_MRR_Tracker_[企业名称]_MRR追踪分析 (数据截至 YYYY-MM-DD)"
  元数据: "当前MRR、增长率、投资评分、风险等级、推荐状态"
  内容: "MRR历史数据 → 增长趋势分析 → 投资价值评估 → 风险预警"
  
MRR趋势报告模板:
  头部: "趋势分析: AI_MRR_Tracker_[行业/赛道]_MRR_Trends"
  分析: "行业MRR中位数 → 增长率分布 → 头部企业对比 → 投资机会识别"
  建议: "投资时机建议和风险提示"
  
投资决策记录模板:
  头部: "投资决策: AI_MRR_Tracker_Investment_Decision_[企业名称]"
  过程: "MRR分析 → 增长评估 → 风险考量 → 投资决策 → 跟踪计划"
  追踪: "决策执行和后续MRR监控计划"
```

## 🎯 MRR追踪系统工作流程

### 标准MRR数据采集流程
```yaml
阶段1 - 信息发现 (Discovery):
  输入: "AI初创企业线索或特定目标"
  执行过程:
    数据源扫描: "ProductHunt、GitHub、招聘网站、融资公告"
    企业识别: "AI技术栈识别、团队规模判断、业务模式分析"
    基础筛选: "收入规模预估、发展阶段判断、地域匹配"
  输出: "符合条件的企业清单和基础信息档案"

阶段2 - MRR数据采集 (Collection):
  输入: "目标企业清单"
  执行过程:
    直接采集: "官网定价、财报数据、公开披露信息"
    间接推算: "用户规模推算、团队规模推算、行业对比推算"
    数据验证: "多源交叉验证、异常数据检测、置信度评分"
  输出: "结构化的MRR数据库和质量评分"

阶段3 - 增长分析 (Analysis):
  输入: "历史MRR数据"
  执行过程:
    趋势计算: "月度增长率、年化复合增长率、增长稳定性"
    风险识别: "收入下滑、增长放缓、竞争压力、团队变动"
    机会发现: "突破性增长、稳定增长、反弹机会、估值洼地"
  输出: "增长分析报告和投资机会评级"

阶段4 - 投资评分 (Scoring):
  输入: "MRR数据和增长分析"
  执行过程:
    量化评分: "MRR规模30% + 增长速度40% + 增长质量20% + 市场机会10%"
    风险评估: "收入风险、团队风险、市场风险、技术风险"
    建议生成: "强烈推荐、推荐关注、谨慎观望、不予考虑"
  输出: "投资评分报告和决策建议"

阶段5 - 持续监控 (Monitoring):
  输入: "已评估企业库"
  执行过程:
    实时更新: "7×24小时MRR数据更新监控"
    异常预警: "收入异常、增长异常、团队变动、市场变化"
    投资跟踪: "投资组合MRR表现监控"
  输出: "预警通知和投资组合报告"
```

## 📈 系统效果评估指标

### MRR数据质量指标
```yaml
数据采集能力:
  覆盖范围: "> 1000家AI初创企业持续监控"
  更新频率: "数据更新滞后 < 24小时"
  数据准确率: "> 90%的MRR数据通过验证"
  数据完整率: "> 85%的目标企业有MRR记录"

分析预测能力:
  增长预测准确率: "> 70%的月度增长预测正确"  
  风险预警准确率: "> 85%的风险预警得到验证"
  投资机会精准率: "> 75%的推荐企业表现良好"
  系统稳定性: "> 99.5%的正常运行时间"

用户体验指标:
  响应速度: "页面加载时间 < 2秒"
  数据实时性: "MRR更新延迟 < 1小时"
  操作简便性: "学习成本 < 30分钟"
  用户满意度: "综合评分 > 4.5/5.0"
```

### 投资决策支持价值
```yaml
投资效果提升:
  发现效率: "从月度筛选提升至日度实时发现"
  决策准确性: "投资成功率从60%提升至80%+"
  风险控制: "提前预警，减少损失风险50%+"
  投资回报: "更精准时机，提升回报15-25%"

业务价值实现:
  机会发现: "每月发现10-20个优质投资机会"
  风险管控: "实时监控投资组合MRR表现"
  决策支持: "数据驱动的量化投资建议"
  效率提升: "自动化监控，节省90%人工时间"
```

## 🚀 快速启动指南

### 一键启动MRR分析
```bash
# 方式1: 自然语言启动 (推荐)
"分析这家AI视频生成公司的MRR情况，团队20人，月收入估计50万"

# 方式2: 企业名称分析  
"追踪小红书竞品的MRR增长趋势，关注AI内容创作赛道"

# 方式3: 行业研究模式
"研究AI Agent行业的MRR分布，寻找200万以下的投资机会"

# 方式4: 投资组合监控
"检查我投资组合中企业的最新MRR表现，预警异常变化"
```

### 智能上下文切换
```yaml
系统识别模式:
  MRR分析触发词: "MRR|月收入|增长率|投资追踪|收入分析"
  → 自动切换到: "AI_MRR_Tracker/"
  → 加载系统: "MRR数据采集 + 增长分析引擎"
  → 启动功能: "投资评分 + 预警监控 + 决策支持"

高级功能模式:
  企业深度分析: "深度分析这家AI初创的MRR可持续性"
  行业趋势研究: "分析AI大模型行业MRR增长趋势"  
  投资机会发现: "发现MRR快速增长的投资机会"
  风险预警监控: "监控投资组合MRR异常变化"
```

---

## 🔗 相关资源链接
- 主系统: [LaunchX智能协作开发系统](../../../CLAUDE.md)
- 投资分析: [Pocketcorn v4.1 BMAD智能投资分析](../../04_成熟项目 ✅/pocketcorn_v4.1_bmad/CLAUDE.md)
- 企业服务: [Zhilink v3 AI能力交易平台](../Obsidion-zhilink-platform_v3/CLAUDE.md)

## 📚 MRR追踪学习资源
- OpenBook开源项目架构分析和优化
- LangChain AI数据提取最佳实践
- MRR计算和增长分析方法论
- 投资决策自动化系统设计

---

**专用配置版本**: v1.0.0  
**继承自**: [LaunchX主系统 CLAUDE.md](../../../CLAUDE.md)  
**专业领域**: AI初创企业MRR追踪和投资决策支持  
**特化功能**: 自动化MRR采集 + 增长分析 + 投资评分 + 风险预警  
**技术架构**: 基于OpenBook验证架构 + LangChain AI能力  
**文档标准**: 遵循LaunchX统一文档生成规范 v2025.01.22

> 🎯 **核心价值**: 专注200万以下MRR的AI初创企业，通过7×24小时自动化监控和智能分析，为投资人提供精准的投资机会发现和风险预警。

> 💡 **技术特色**: 基于OpenBook验证架构，结合LangChain AI能力，打造全自动化的MRR数据采集、增长分析和投资决策支持系统。