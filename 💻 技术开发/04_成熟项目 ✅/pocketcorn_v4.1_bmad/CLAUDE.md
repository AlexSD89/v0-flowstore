# CLAUDE.md - Pocketcorn v4.1 BMAD智能投资分析系统

## 🎯 投资分析系统定位与用户身份

### 投资人身份配置
```yaml
用户角色: "0代码背景的AI投资人"
核心需求:
  - 智能投资决策: "50万投资3-10人AI初创，追求1.5倍回报"
  - BMAD混合智能: "人类判断 + AI分析的混合决策系统"
  - SPELO闭环决策: "搜集、处理、评估、学习、优化的完整流程"
  - 7维度评分: "技术、市场、团队、商业模式、竞争优势、风险、时机"

工作特点:
  决策模式: "数据驱动 + 直觉判断的快速投资决策"
  技术理解: "将技术概念转换为商业价值和投资风险评估"
  协作方式: "通过自然语言与BMAD系统深度协作"
  成果导向: "每个分析都要转化为明确的投资建议和行动计划"
```

## 🧠 BMAD智能投资分析架构

### BMAD v4.1核心架构
```
Pocketcorn v4.1 BMAD智能投资分析系统/
├── 🧠 BMAD混合智能层/
│   ├── Brain-Tier (人类主导)
│   │   ├── 投资价值观和风险偏好设定
│   │   ├── 战略决策和方向判断
│   │   └── 创意洞察和机会识别
│   └── AI-Tier (机器执行)
│       ├── 数据收集和预处理
│       ├── 模式识别和趋势分析
│       └── 量化评分和风险建模
├── 🔄 SPELO闭环决策系统/
│   ├── Search (搜集) - 多源信息搜集
│   ├── Process (处理) - 数据清洗和分析  
│   ├── Evaluate (评估) - 7维度评分系统
│   ├── Learn (学习) - 历史决策学习
│   └── Optimize (优化) - 策略持续优化
├── 📊 7维度评分引擎/
│   ├── 技术评估 (Technology Assessment)
│   ├── 市场评估 (Market Analysis) 
│   ├── 团队评估 (Team Evaluation)
│   ├── 商业模式 (Business Model)
│   ├── 竞争优势 (Competitive Advantage)
│   ├── 风险评估 (Risk Assessment)
│   └── 时机判断 (Timing Analysis)
└── 🎯 智能决策输出/
    ├── 投资建议等级 (推荐/观望/拒绝)
    ├── 风险收益分析
    ├── 投资时机建议
    └── 后续跟踪计划
```

## 🔧 技术栈与开发环境

### 核心技术配置
```yaml
编程语言:
  - Python 3.12: "主要开发语言"
  - SQL: "数据库查询和分析"
  - JavaScript: "前端数据可视化"

核心依赖:
  数据处理:
    - pandas: "数据处理和分析"
    - numpy: "数值计算"
    - sqlite3: "轻量级数据库"
    
  机器学习:
    - scikit-learn: "机器学习算法"
    - xgboost: "梯度提升树"
    - tensorflow/pytorch: "深度学习模型"
    
  数据获取:
    - requests: "API数据获取"
    - beautifulsoup4: "网页数据抓取"
    - yfinance: "金融数据获取"
    
  可视化:
    - matplotlib: "基础图表"
    - plotly: "交互式图表"
    - streamlit: "Web应用界面"

开发环境:
  IDE: "VS Code + Python扩展"
  版本控制: "Git + GitHub"
  数据库: "SQLite (本地) + PostgreSQL (生产)"
  部署: "Docker容器化部署"
```

### 关键开发命令
```bash
# 环境激活和依赖安装
python -m venv venv
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt

# 核心功能运行
python main_BMAD.py           # 启动主要分析系统
python analyze_real_projects.py  # 运行项目分析
python temp_file_manager.py  # 临时文件管理

# 数据处理和分析
python -c "from main_BMAD import *; run_investment_analysis('公司名称')"

# 系统优化和学习
python -c "from evolution import *; optimize_decision_model()"

# 报告生成
python -c "from reports import *; generate_investment_report()"
```

## 📝 Pocketcorn v4.1 文档生成规范 (继承主系统标准)

### 🏷️ 项目专用配置
```yaml
项目标识: "Pocketcorn_v4.1"
项目全称: "BMAD智能投资分析系统 (BMAD Intelligent Investment Analysis System)"
版本控制: "v4.1.x (投资系统语义化版本)"
创建时间: "2025-08-24_135459"
更新频率: "基于投资决策反馈和市场变化"

文档分类标签:
  - "investment_analysis"
  - "bmad_framework"
  - "spelo_decision"
  - "7dimension_scoring"
  - "ai_investment"
```

### 📊 投资分析专用文档生成规则
```yaml
文档命名标准:
  投资分析报告: "Pocketcorn_v4.1_[公司名称]_Investment_Analysis_[时间戳].md"
  市场研究报告: "Pocketcorn_v4.1_[行业领域]_Market_Research_[时间戳].md"
  风险评估报告: "Pocketcorn_v4.1_[项目名称]_Risk_Assessment_[时间戳].md"
  投资决策记录: "Pocketcorn_v4.1_[决策类型]_Decision_Log_[时间戳].md"
  
示例格式:
  "Pocketcorn_v4.1_OpenAI竞品分析_AI大模型市场研究_OpenAI_Competitive_Analysis_2025-08-24_135459.md"
  
存储路径规范:
  投资报告: "./reports/investment_analysis/"
  市场研究: "./reports/market_research/"
  风险评估: "./reports/risk_assessment/"
  决策记录: "./reports/decision_logs/"
  数据文件: "./data/analysis_data/"
  
BMAD决策记录:
  Brain层决策: "./docs/brain_tier_decisions/"
  AI层分析: "./docs/ai_tier_analysis/"
  SPELO流程: "./docs/spelo_process/"
  
自动化Hook集成:
  PreToolUse: "验证投资金额和风险等级符合投资策略"
  PostToolUse: "自动更新投资组合和学习模型"
  文档分类: "按投资阶段、行业类别、风险等级分类"

质量控制要求:
  ✅ 包含完整的BMAD分析过程
  ✅ 7维度评分详细记录
  ✅ SPELO闭环决策轨迹
  ✅ 风险收益量化分析
  ✅ 投资建议等级明确
  ✅ 完整的时间戳和版本记录
```

### 🎯 投资分析文档模板
```yaml
投资分析报告模板:
  头部: "项目名称: Pocketcorn_v4.1_[公司名称]_投资分析 (数据截至 YYYY-MM-DD)"
  元数据: "投资等级、风险评分、预期收益、投资建议"
  内容: "BMAD分析 → 7维度评分 → SPELO决策过程 → 投资建议"
  
风险评估模板:
  头部: "风险评估: Pocketcorn_v4.1_[项目名称]_Risk_Assessment"
  评估: "技术风险 → 市场风险 → 团队风险 → 财务风险"
  建议: "风险缓解策略和监控要点"
  
投资决策记录模板:
  头部: "决策记录: Pocketcorn_v4.1_[决策类型]_Decision_Log"
  过程: "Brain层思考 → AI层分析 → SPELO流程 → 最终决策"
  跟踪: "决策执行计划和后续监控"
```

## 🎯 BMAD投资分析工作流程

### 标准投资决策流程
```yaml
阶段1 - 项目发现 (Search):
  输入: "投资项目信息或市场线索"
  BMAD执行:
    Brain-Tier: "判断项目是否符合投资方向和价值观"
    AI-Tier: "收集公司基础信息、财务数据、市场数据"
  输出: "项目基础信息包和初步筛选结果"

阶段2 - 数据处理 (Process):
  输入: "原始项目数据"
  BMAD执行:
    AI-Tier: "数据清洗、标准化、补充缺失信息"
    Brain-Tier: "验证数据合理性，识别关键信息缺口"
  输出: "结构化的投资分析数据包"

阶段3 - 综合评估 (Evaluate):
  输入: "处理后的项目数据"
  BMAD执行:
    AI-Tier: "7维度量化评分，风险收益建模"
    Brain-Tier: "综合判断，考虑软性因素和直觉洞察"
  输出: "投资评估报告和建议等级"

阶段4 - 经验学习 (Learn):
  输入: "投资决策结果和实际表现"
  BMAD执行:
    AI-Tier: "更新模型参数，优化评分算法"
    Brain-Tier: "总结决策经验，调整投资策略"
  输出: "优化的决策模型和策略更新"

阶段5 - 策略优化 (Optimize):
  输入: "历史决策数据和市场反馈"
  BMAD执行:
    Brain-Tier: "投资策略和风险偏好调整"
    AI-Tier: "算法优化和特征工程改进"
  输出: "更新的投资决策系统"
```

## 📈 投资分析效果评估

### 投资决策质量指标
```yaml
准确性指标:
  投资成功率: "> 75%的推荐项目实现预期收益"
  风险预测准确率: "> 90%的风险警告准确"
  收益预测误差: "< 20%的收益预测偏差"
  时机判断准确率: "> 80%的投资时机建议正确"

效率指标:
  分析速度: "< 2小时完成完整项目分析"
  数据处理能力: "> 100个项目并行分析"
  报告生成时间: "< 30分钟生成投资报告"
  决策支持响应: "< 10分钟回答投资决策问题"

学习优化指标:
  模型改进频率: "每月基于新数据优化模型"
  策略适应性: "根据市场变化调整投资策略"
  经验积累速度: "每个决策都产生可学习的经验"
  错误纠正能力: "快速识别和纠正决策偏差"
```

### 商业价值实现
```yaml
投资回报指标:
  预期年化收益: "15-25%目标收益率"
  风险调整收益: "夏普比率 > 1.5"
  投资成功率: "> 70%项目实现正收益"
  资金周转效率: "平均持有期 6-18个月"

决策支持价值:
  决策时间缩短: "从数周缩短至数小时"
  分析覆盖广度: "同时跟踪500+潜在项目"
  风险识别能力: "提前识别95%的重大风险"
  机会发现能力: "发现更多早期优质项目"
```

## 🚀 快速启动指南

### 一键启动投资分析
```bash
# 方式1: 自然语言启动 (推荐)
"分析OpenAI这家公司的投资价值，团队规模500人，年收入20亿美金"

# 方式2: 项目文件分析
"读取这个项目的商业计划书，给出投资建议"

# 方式3: 市场研究模式
"研究AI大模型行业，寻找值得投资的早期项目"
```

### 智能上下文切换
```yaml
系统识别模式:
  投资分析触发词: "投资|分析|评估|收益|风险|回报|估值|融资"
  → 自动切换到: "pocketcorn_v4.1_bmad/"
  → 加载系统: "BMAD混合智能 + SPELO闭环决策"
  → 启动引擎: "7维度评分 + 风险收益建模"

高级功能:
  项目深度分析: "深度分析这家AI初创公司"
  行业趋势研究: "分析AI Agent行业投资机会"  
  风险预警监控: "监控投资组合风险变化"
  投资策略优化: "基于最新市场数据优化投资策略"
```

---

## 🔗 相关资源链接
- 主系统: [LaunchX智能协作开发系统](../../../CLAUDE.md)
- 企业服务: [Zhilink v3 AI能力交易平台](../../01_公司项目ing 🚀/Obsidion-zhilink-platform_v3/CLAUDE.md)
- 知识库: [Knowledge 知识发现与研究系统](../../../🟣 knowledge/CLAUDE.md)

## 📚 投资分析学习资源
- BMAD混合智能框架理论与实践
- SPELO闭环决策系统设计原理
- 7维度投资评分体系构建
- AI驱动的投资决策优化方法

---

**专用配置版本**: v4.1.0  
**继承自**: [LaunchX主系统 CLAUDE.md](../../../CLAUDE.md)  
**专业领域**: AI驱动的智能投资分析和决策系统  
**特化功能**: BMAD混合智能 + SPELO闭环决策 + 7维度评分
**文档标准**: 遵循LaunchX统一文档生成规范 v2025.08.24

> 🎯 **投资理念**: 基于BMAD混合智能的科学投资决策，让人类智慧与AI分析完美结合，实现更准确、更高效的投资决策。

> 💡 **核心价值**: 为0代码背景的AI投资人提供专业级的投资分析能力，通过系统化的决策流程和量化的评估体系，提高投资成功率和风险控制能力。