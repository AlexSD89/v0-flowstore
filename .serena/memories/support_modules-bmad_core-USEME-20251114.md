# USEME

**📂 原始分类**: support_modules/bmad_core
**🏷️ 原始标签**: 无
**🤖 智能标签**: 结构化内容, 标准格式, AI协作, 规范文档, 工具库, 可复用组件, 通用模块
**📄 内容类型**: structured
**📁 原始路径**: support_modules/bmad_core/USEME.md
**📅 转换时间**: 2025-11-14 13:06:11
**🔄 转换版本**: LaunchX Memory Bank v1.0 → Serena v2.0

---

## 📖 原始内容

# BMAD Core - AI 原生 Tasks 使用指南

> **最后更新**: 2025-11-05
> **适用对象**: Claude Code / AI Assistant
> **强制导入**: `const { BMADCore } = require('../../🧩 bmad/index.js');`
> **状态**: 已修复路径引用，新增向后兼容支持

---

## 📦 目录与导入说明

### 模块结构
```
support_modules/
└── bmad_core/
    ├── USEME.md                    # 本文档
    └── ../../🧩 bmad/              # 实际实现路径 (相对路径，已验证存在)
```

### 🔴 强制导入说明
```javascript
// ✅ 正确: 使用相对路径导入
const { BMADCore } = require('../../🧩 bmad/index.js');

// ✅ 向后兼容: 也可以使用旧接口名
const { BMADNativeTasks } = BMADCore.tasks;

// ❌ 错误: 不要使用错误的相对路径
// require('../../🧩 bmad/src/bmad-native-tasks.js')  // 路径不存在
```

---

## 🎯 重点 API 参数表

### 核心 Tasks 概览
| Task | 方法名 | 主要参数 | 返回值 | 典型场景 |
|------|--------|----------|--------|----------|
| **市场分析** | `analyzeMarketOpportunity` | `query, dimensions` | `opportunity_score, analysis` | 投资机会评估 |
| **技术评估** | `assessTechnicalFeasibility` | `technology, criteria` | `feasibility_score, details` | 技术可行性分析 |
| **投资回报** | `predictInvestmentReturn` | `investment, timeframe` | `roi_range, confidence` | ROI预测 |
| **风险评估** | `assessRiskMitigationStrategies` | `risk_type, factors` | `risk_level, mitigation` | 风险评估 |
| **商业创新** | `generateBusinessInnovation` | `domain, constraints` | `innovation_ideas, score` | 创新方案生成 |

### 详细参数规范
```javascript
// 1. 市场机会分析
await bmadTasks.analyzeMarketOpportunity(
  'AI视频生成技术市场机会',           // query: 分析主题
  ['市场规模', '竞争格局', '增长趋势']    // dimensions: 分析维度数组
);

// 2. 技术可行性评估
await bmadTasks.assessTechnicalFeasibility(
  '基于深度学习的实时视频生成系统',    // technology: 技术方案描述
  ['技术成熟度', '实现复杂度', '资源需求'] // criteria: 评估标准
);

// 3. 投资回报预测
await bmadTasks.predictInvestmentReturn(
  '投资200万到AI视频生成初创公司',      // investment: 投资描述
  '1-3年'                            // timeframe: 时间范围
);

// 4. 风险评估与缓解
await bmadTasks.assessRiskMitigationStrategies(
  'AI视频生成创业项目投资风险',         // risk_type: 风险类型
  ['技术风险', '市场风险', '运营风险']    // factors: 风险因子
);

// 5. 商业创新方案
await bmadTasks.generateBusinessInnovation(
  '企业AI数字化转型',                 // domain: 业务领域
  {budget: '100-500万', timeline: '6个月'} // constraints: 约束条件
);
```

---

## 🗂️ 分类 API 概览

### 📊 分析类 Tasks
```javascript
// 市场分析类
analyzeMarketOpportunity()     // 市场机会分析
assessTechnicalFeasibility()   // 技术可行性评估
predictInvestmentReturn()      // 投资回报预测
```

### 🛡️ 风险管理类 Tasks
```javascript
// 风险评估类
assessRiskMitigationStrategies() // 风险评估与缓解
```

### 💡 创新生成类 Tasks
```javascript
// 商业创新类
generateBusinessInnovation()    // 商业创新方案生成
```

### 🤖 智能路由系统
```javascript
// 自动路由系统 (高级功能)
// 注意：NativeFirstBMADSystem 当前不可用，仅使用 BMADCore
// const { NativeFirstBMADSystem } = require('../../🧩 bmad/src/native-first-bmad-system.js');

await bmadSystem.routeAndExecute(
  '分析这家AI公司的投资价值',         // 用户请求
  { collaboration_type: 'swarm' }     // 协作配置
);
```

---

## 🎨 组件用法示例

### 示例 1: 完整的市场分析流程
```javascript
const { BMADCore } = require('../../🧩 bmad/index.js');
const { BMADNativeTasks } = BMADCore.tasks;

// 初始化 BMAD Tasks
const bmadTasks = new BMADNativeTasks();

async function performMarketAnalysis() {
  try {
    // 步骤 1: 市场机会分析
    const marketAnalysis = await bmadTasks.analyzeMarketOpportunity(
      'AI视频生成技术在企业级应用的市场机会',
      ['市场规模', '竞争格局', '增长趋势', '技术趋势']
    );

    console.log(`市场机会评分: ${marketAnalysis.opportunity_metrics.overall_opportunity_score}/10`);
    console.log(`市场规模评分: ${marketAnalysis.market_size_score}`);

    // 步骤 2: 技术可行性评估
    const techFeasibility = await bmadTasks.assessTechnicalFeasibility(
      '基于深度学习的实时视频生成系统',
      ['技术成熟度', '实现复杂度', '资源需求', '时间成本']
    );

    console.log(`技术可行性: ${techFeasibility.feasibility_score}/10`);

    // 步骤 3: 投资回报预测
    const roiPrediction = await bmadTasks.predictInvestmentReturn(
      '基于市场分析和技术评估的投资方案',
      '2-5年'
    );

    console.log(`预期ROI范围: ${roiPrediction.expected_roi_range}`);

    return {
      market: marketAnalysis,
      technical: techFeasibility,
      financial: roiPrediction
    };

  } catch (error) {
    console.error('分析过程中出现错误:', error);
    throw error;
  }
}
```

### 示例 2: 智能路由使用
```javascript
// 注意：NativeFirstBMADSystem 当前不可用，请使用 BMADCore
// const { NativeFirstBMADSystem } = require('../../🧩 bmad/src/native-first-bmad-system.js');

// 注意：此示例当前不可用，NativeFirstBMADSystem 尚未实现
async function intelligentAnalysis(query) {
  // const bmadSystem = new NativeFirstBMADSystem();
  // 替代方案：使用 BMADCore
  const { BMADCore } = require('../../🧩 bmad/index.js');
  const bmadCore = new BMADCore();

  try {
    // 自动路由到最佳 Agent 组合
    // 注意：routeAndExecute 方法当前不可用
    // const result = await bmadSystem.routeAndExecute(
    //   query,
    //   {
    //     collaboration_type: 'swarm',      // 群体智能协作
    //     include_synergy_metrics: true,    // 包含协同效应指标
    //     timeout: 60000                    // 60秒超时
    //   }
    // );

    // 替代方案：直接使用 BMADCore 的方法
    const result = await bmadCore.tasks.analyzeMarketOpportunity(query, ['basic']);

    console.log('分析结果:', result);
    // 注意：routing_decision 等字段当前不可用

    return result;

  } catch (error) {
    console.error('智能分析失败:', error);
    throw error;
  }
}

// 使用示例
intelligentAnalysis('评估这家AI视频生成初创公司的投资价值');
```

### 示例 3: 风险评估与缓解
```javascript
async function comprehensiveRiskAssessment(projectDescription) {
  try {
    // 全面的风险评估
    const riskAssessment = await bmadTasks.assessRiskMitigationStrategies(
      projectDescription,
      [
        '技术风险',      // 技术实现风险
        '市场风险',      // 市场接受度风险
        '运营风险',      // 运营管理风险
        '财务风险',      // 资金流动性风险
        '合规风险'       // 法律合规风险
      ]
    );

    console.log(`整体风险级别: ${riskAssessment.overall_risk_level}`);
    console.log(`缓解策略有效性: ${riskAssessment.mitigation_effectiveness}`);

    // 输出具体建议
    if (riskAssessment.overall_risk_level === 'high') {
      console.log('⚠️  高风险项目，建议采取以下措施:');
      riskAssessment.mitigation_strategies.forEach((strategy, index) => {
        console.log(`${index + 1}. ${strategy}`);
      });
    }

    return riskAssessment;

  } catch (error) {
    console.error('风险评估失败:', error);
    throw error;
  }
}
```

---

## ⚠️ 注意事项

### 🔴 必须遵守的约束
1. **绝对路径导入** - 必须使用绝对路径，避免相对路径错误
2. **错误处理** - 所有异步调用必须包含 try-catch
3. **参数验证** - 调用前验证参数类型和范围
4. **资源管理** - 避免过度并发调用，遵守频率限制

### 🔄 性能优化建议
```javascript
// ✅ 推荐: 使用缓存机制
const analysisCache = new Map();

async function cachedAnalysis(query, dimensions) {
  const cacheKey = `${query}_${dimensions.join('_')}`;

  if (analysisCache.has(cacheKey)) {
    return analysisCache.get(cacheKey);
  }

  const result = await bmadTasks.analyzeMarketOpportunity(query, dimensions);
  analysisCache.set(cacheKey, result);

  return result;
}

// ✅ 推荐: 并发控制
const pLimit = require('p-limit');
const limit = pLimit(3); // 最大并发3个

async function batchAnalysis(analyses) {
  return Promise.all(
    analyses.map(analysis =>
      limit(() => bmadTasks.analyzeMarketOpportunity(analysis.query, analysis.dimensions))
    )
  );
}
```

### 📊 质量监控
```javascript
// 监控执行质量
function logExecutionMetrics(task, startTime, result, error = null) {
  const executionTime = Date.now() - startTime;

  console.log(`Task: ${task}`);
  console.log(`Execution Time: ${executionTime}ms`);
  console.log(`Success: ${error ? 'No' : 'Yes'}`);

  if (result) {
    console.log(`Quality Score: ${result.quality_score || 'N/A'}`);
  }

  // 记录到监控系统
  // sendToMonitoring(task, executionTime, error !== null);
}

// 使用示例
const startTime = Date.now();
try {
  const result = await bmadTasks.analyzeMarketOpportunity(query, dimensions);
  logExecutionMetrics('market_analysis', startTime, result);
} catch (error) {
  logExecutionMetrics('market_analysis', startTime, null, error);
}
```

---

## 🛠️ 最佳实践与故障排除

### ✅ 最佳实践
1. **初始化检查** - 使用前验证系统状态
2. **参数标准化** - 统一参数格式和命名
3. **结果验证** - 验证返回数据的完整性
4. **日志记录** - 记录关键操作和错误
5. **资源清理** - 及时释放不再使用的资源

### 🔧 常见故障排除

#### 问题 1: 模块导入失败
```javascript
// ✅ 解决方案: 验证路径存在
const fs = require('fs');
const bmadPath = '../../🧩 bmad/index.js';

if (!fs.existsSync(bmadPath)) {
  console.error('❌ BMAD 模块文件不存在:', bmadPath);
  console.log('请检查文件路径是否正确');
  process.exit(1);
}
```

#### 问题 2: 异步调用超时
```javascript
// ✅ 解决方案: 添加超时控制
async function timeoutAnalysis(query, timeoutMs = 30000) {
  return Promise.race([
    bmadTasks.analyzeMarketOpportunity(query, ['basic']),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('分析超时')), timeoutMs)
    )
  ]);
}
```

#### 问题 3: 内存使用过高
```javascript
// ✅ 解决方案: 流式处理大数据集
async function streamAnalysis(largeDataset) {
  const results = [];
  const batchSize = 10;

  for (let i = 0; i < largeDataset.length; i += batchSize) {
    const batch = largeDataset.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(item => bmadTasks.analyzeMarketOpportunity(item, ['basic']))
    );
    results.push(...batchResults);

    // 释放内存
    if (i % (batchSize * 10) === 0) {
      if (global.gc) global.gc(); // 手动垃圾回收
    }
  }

  return results;
}
```

---

## 📞 技术支持

### 获取帮助
- **API 文档**: 查看 `🧩 bmad/README.md` 下的详细文档
- **演示示例**: 运行 `🧩 bmad/demo/` 下的演示脚本
- **配置参考**: 查看 `🧩 bmad/config/` 下的配置文件

### 问题上报
遇到技术问题时，请提供以下信息：
1. 具体的错误信息和堆栈跟踪
2. 调用的具体方法和参数
3. 系统环境信息 (Node.js版本、操作系统等)
4. 复现步骤

---

> **重要**: 本模块是 LaunchX 的核心 AI 能力库，所有调用必须严格遵循本文档规范。如有疑问，请优先查阅相关文档或联系技术支持。

---

## 🤖 Serena AI增强

### 智能特性
- **语义搜索**: 支持自然语言查询和语义理解
- **上下文关联**: 自动关联相关知识和最佳实践
- **AI辅助**: 结合LaunchX方法论提供智能建议
- **代码集成**: 深度理解项目结构和代码语义

### 🎯 LaunchX方法论集成
- **5步认知法**: Collect → Model → Compare → Align → Deliver → Archive
- **Dev Docs系统**: plan.md + context.md + tasks.md 工作流
- **Skills生态**: 专业能力工具包和质量保障
- **Memory Bank增强**: 结构化知识管理和智能检索

### 🔍 使用建议
1. **自然语言查询**: 直接询问相关问题，如"Dev Docs工作流程"
2. **上下文检索**: 系统会自动关联相关知识
3. **AI辅助生成**: 基于现有内容提供改进建议
4. **知识管理**: 支持自动分类、标签化和关联推荐

### 📚 关联知识
- 与`support_modules/bmad_core`分类下的其他知识自动关联
- 与`structured`类型内容建立智能链接
- 基于标签`结构化内容, 标准格式, AI协作, 规范文档, 工具库, 可复用组件, 通用模块`构建知识网络

---

*此记忆已从LaunchX Memory Bank智能转换到Serena平台，获得AI增强能力*
