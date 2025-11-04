---
title: "LaunchX业务服务 CLAUDE 指南"
owners:
  - "LaunchX Business Ops"
status: "active"
last_update: "2025-10-27"
related:
  - "./README.md"
  - "./RULES.md"
  - "./AGENTS.md"
  - "🧩 bmad/CLAUDE.md"
  - "🧠 Launch-X Skills生态系统/README.md"
source: "自动生成（Claude Code + AI增强）"
impact: "业务服务域内的AI协作流程与Claude智能商业能力"
---

# LaunchX业务服务 CLAUDE 指南

<<<<<<< Updated upstream
> **核心定位**：业务服务域是LaunchX的商业价值实现中心，集成Claude AI商业分析能力、BMAD智能协作和Skills生态系统，实现AI增强的企业服务与价值创造。
=======
## Phase 0 Checklist
1. 快速扫描：@根目录指挥文档第15-25行（核心协作原则）+ @本目录README.md第1-10行（业务域概述）
2. 精确读取：@RULES.md第17-30行（业务域技能触发规则）+ @memory-bank/support_modules/launchx/USEME.md第1-20行（模板位置）
3. 定位查询：`find "🚀 Launchx业务服务" -name "*客户*" -o -name "*case*" | head -3` 获取最近客户资料
4. 快速确认：`grep -n "保密等级\|NDA\|对外" "🚀 Launchx业务服务"/*.md | tail -5` 查看保密要求
5. 强制要求：复杂业务任务必须创建Dev Docs三文件（见@RULES.md第63-75行模板）
>>>>>>> Stashed changes

> 📌 **信息来源原则**：业务方案、案例、指标必须基于 LaunchX 自有项目和复盘记录；外部市场数据或 benchmark 仅作参考，需注明出处与差异。遵循 `📖README-LaunchX系统总体指南.md` 的信息颗粒度指南，AI 草稿在 24h 内完成人工校验与归档。

## 🚀 Claude专属业务能力

### 🧠 AI增强商业分析
- **智能市场分析**：基于多维度数据的市场趋势分析与预测
- **商业决策支持**：AI辅助的投资决策、风险评估、战略规划
- **客户需求洞察**：深度理解客户需求并提供个性化解决方案
- **竞争情报分析**：实时的竞争对手分析与战略建议

### 🎯 核心商业能力
- **Claude SDK商业技能**：business-decision-support, enterprise-research-analyst, market-intelligence-expert
- **BMAD商业Agent**：商业分析师、市场研究员、企业咨询专家、风险评估师
- **5通道商业情报**：市场数据、行业报告、竞争对手、客户反馈、政策法规
- **智能提案生成**：基于客户需求的个性化商业提案自动生成

### 📊 业务效率指标
- **市场分析准确率**：≥92%（AI预测与实际市场对比）
- **客户满意度**：≥90%（AI增强的客户服务体验）
- **商业决策效率**：提升50%+（相比传统决策模式）
- **提案生成速度**：提升70%+（智能提案生成系统）

## Phase 0 Checklist（Claude增强版）
1. **基础环境检查**：
   - 阅读根级 `CLAUDE.md`、本目录 `README.md`、`RULES.md`
   - 验证Claude商业分析能力和BMAD商业Agent状态
   - 确认商业数据源和分析工具的可用性

2. **业务能力同步**：
   - 同步 `memory-bank/support_modules/launchx/USEME.md`
   - 了解AI增强的提案模板、访谈脚本、指标分析工具
   - 验证商业智能分析系统和数据可视化工具

3. **客户情报加载**：
   - 查阅关联客户资料：`Ⅰ_待处理信息` 或 `Ⅱ_对外业务`
   - 加载历史项目数据和客户反馈分析
   - 导入行业趋势和竞争情报数据

4. **合规与策略确认**：
   - 明确对外/内部输出的语言策略与保密等级
   - 确认商业数据的合规使用和隐私保护
   - 验证AI分析结果的合规性和可解释性

5. **智能需求checklist**：
   - 在 `/spec` 中列出客户目标、商业价值、AI能力应用
   - 明确交付物标准、质量指标、验证方式
   - 确认BMAD商业Agent协作需求和Claude Skills使用计划

> **智能生成管理**：使用AI生成的 `/spec`、`/plan`、`/do` 草稿，按项目规模分级存放：
> - **小项目**：统一存放在 `🤖 AI生成 auto-generated/YYYYMMDD/<slug>/`，经AI质量审核后24小时内迁移至目标目录
> - **大项目**：直接在项目文件夹内生成所有资料内容，保持项目资料的完整性和独立性

## 🔄 AI增强业务服务流程

### 智能业务流程（AI集成版）
| 阶段 | 行动 | Claude增强 | 产出 |
| --- | --- | --- | --- |
| `/spec` | 需求分析、市场调研、客户洞察 | AI市场分析、竞争情报、需求预测 | 智能Checklist、风险评估、商业机会分析 |
| `/plan` | 商业策略设计、服务方案规划 | AI战略规划、资源配置优化 | 智能时间线、Agent协作计划、价值交付节点 |
| `/do` | 提案生成、客户沟通、价值交付 | 智能提案生成、客户需求匹配 | AI增强提案稿、智能会议纪要、价值交付记录 |
| 归档 | 案例沉淀、知识管理、价值评估 | AI案例分析、知识图谱构建 | 智能案例库、商业洞察、后续行动建议 |

### 🛠️ AI增强业务工具

#### 智能业务工具集
- **AI提案生成器**：
  ```bash
  npm run business:proposal:generate
  npm run business:proposal:optimize
  npm run business:proposal:client-match
  ```
- **市场情报分析**：
  ```bash
  npm run market:intelligence:analyze
  npm run competitor:analysis:real-time
  npm run trend:prediction:update
  ```
- **客户洞察系统**：
  ```bash
  npm run customer:insight:analyze
  npm run customer:need:predict
  npm run customer:satisfaction:track
  ```

#### Claude商业技能集成
- **business-decision-support**：商业决策智能分析
- **enterprise-research-analyst**：企业深度研究与尽调
- **market-intelligence-expert**：市场情报与趋势分析
- **customer-success-manager**：客户成功与满意度管理

#### BMAD商业Agent协作
- **商业分析师Agent**：市场分析、商业模式设计
- **企业咨询Agent**：战略规划、组织优化
- **风险评估Agent**：风险识别、控制措施设计
- **客户洞察Agent**：需求分析、体验优化

### 📊 智能模板与工具
- **AI增强提案模板**：
  - `memory-bank/support_modules/launchx/templates/ai-proposal-market-entry.md`
  - `memory-bank/support_modules/launchx/templates/ai-proposal-digital-transformation.md`
  - `memory-bank/support_modules/launchx/templates/ai-proposal-ai-strategy.md`

- **智能会议工具**：
  - AI会议纪要自动生成
  - 智能行动项识别与分配
  - 会议效果评估与优化建议

- **商业指标仪表板**：
  - 实时业务指标监控
  - AI驱动的业绩预测
  - 智能异常检测与预警

## 📋 质量守则（AI增强版）

### 🎯 业务质量标准
- **智能双重审校**：所有对外材料需AI预审 + 人工复核（业务负责人 + 品牌/法律）
- **实时情报更新**：每次客户互动后24h内更新 `Ⅱ_对外业务`，AI辅助记录决策与待办
- **数据驱动验证**：使用AI分析客户反馈、会议结论、业务指标，形成智能验证报告
- **合规风险管控**：第三方工具和数据引入前，AI进行合规风险评估与建议

### 🧠 AI质量保障机制
- **内容质量分析**：Claude自动分析提案材料的逻辑性、完整性和说服力
- **客户匹配度评估**：AI评估提案与客户需求的匹配度和定制化程度
- **商业价值评估**：智能分析项目商业价值、投资回报率和成功概率
- **风险预测分析**：AI预测项目风险点并提供应对策略建议

### 📚 智能知识管理
- **案例智能分类**：AI自动分析案例特征，构建智能案例库和推荐系统
- **知识图谱构建**：自动构建业务知识图谱，支持智能关联和推荐
- **最佳实践提取**：从历史项目中AI提取最佳实践和成功模式
- **持续学习优化**：基于项目反馈持续优化AI分析模型和服务质量

## 🗺️ 业务资源导航

### 📋 核心业务资产
- **客户需求池**：`Ⅰ_待处理信息/README`（AI需求分析和优先级排序）
- **智能案例库**：`a_企业AI转型服务策略与案例`（AI案例推荐和匹配）
- **品牌资产库**：`b_知识传播与品牌策略`、`🎨 设计美学资源库`（AI品牌内容生成）

### 🎯 商业智能支持
- **知识支持中心**：`🟣 knowledge/03_研究报告`、`05_方法论中心`
- **市场情报系统**：实时行业数据、竞争分析、趋势预测
- **客户洞察平台**：客户行为分析、需求预测、满意度管理

### 🚀 Claude商业能力导航
- **Business Decision Support**：
  - 市场机会分析
  - 投资价值评估
  - 风险收益分析
  - 战略决策支持

- **Enterprise Research Analyst**：
  - 企业深度尽调
  - 财务状况分析
  - 竞争优势评估
  - 发展潜力预测

- **Market Intelligence Expert**：
  - 行业趋势分析
  - 竞争对手监控
  - 客户需求洞察
  - 新机会识别

### 🤖 BMAD商业Agent网络
- **商业分析Agent团队**：市场分析、商业模式创新、价值主张设计
- **企业咨询Agent团队**：战略规划、组织变革、数字化转型
- **客户成功Agent团队**：客户关系管理、成功案例打造、满意度提升
- **风险控制Agent团队**：风险识别、合规管理、应急预案制定

### 📞 技术支持与保障
- **商业AI工具问题**：检查Claude商业技能状态和数据源连接
- **Agent协作异常**：查看BMAD商业Agent运行状态和协作日志
- **分析质量优化**：使用AI质量分析工具优化分析结果
- **客户数据安全**：确保商业数据的合规存储和隐私保护

---

**遵循此指南，Claude可在业务服务域实现AI增强的智能商业服务，显著提升客户满意度、商业决策质量和价值创造效率。**
