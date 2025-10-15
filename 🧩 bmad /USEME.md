# BMAD v5.3 - AI 能力使用指南

> **最后更新**: 2025-10-14
> **适用对象**: Claude Code / AI Assistant
> **核心能力**: 10个原生Tasks + 70+专业Agent协作

---

## 🎯 能力概览

### 核心定位
**全能AI助手生态系统** - 优先复用现有能力，避免重复造轮子

### 主要能力清单
- **市场分析**: `trend_researcher` + `business_analyst` + `data_scientist`
- **技术评估**: `backend_architect` + `ai_engineer` + technical_due_diligence
- **投资决策**: `risk_manager` + financial_modeling + ROI_prediction
- **商业创新**: product_management + business_model_design
- **风险管理**: risk_assessment + mitigation_strategies

## 🔧 如何调用 BMAD 能力

### 1. 原生Tasks调用 (优先)
```javascript
// 优先使用 bmad-core/src/bmad-native-tasks.js 中的现成Tasks
const { BMADNativeTasks } = require('./bmad-core/src/bmad-native-tasks');

// 可用Tasks (不要重新实现):
- analyzeMarketOpportunity()     // 市场机会分析
- assessTechnicalFeasibility()   // 技术可行性评估
- predictInvestmentReturn()      // 投资回报预测
- assessRiskMitigationStrategies() // 风险评估
- generateBusinessInnovation()    // 商业创新方案
```

### 2. 智能路由系统
```javascript
// 使用 bmad-core/src/native-first-bmad-system.js 自动路由
const { NativeFirstBMADSystem } = require('./bmad-core/src/native-first-bmad-system');

// 自动识别任务类型并路由到最佳Agent组合
const result = await bmadSystem.routeAndExecute(
  '分析这家AI公司的投资价值',
  { collaboration_type: 'swarm' }
);
```

### 3. MCP工具集成
```javascript
// 5通道并发搜索 (已有实现，不要重写)
- WebSearch (Claude原生)
- Tavily Search (MCP)
- Jina Reader (MCP)
- GitHub Search (MCP)
- Media Crawler (MCP)
```

## ❌ 禁止事项 (常见陷阱)

1. **不要重新实现核心Tasks** - 优先使用 `bmad-native-tasks.js`
2. **不要单独创建Agent** - 使用路由系统自动组合
3. **不要硬编码搜索逻辑** - 复用5通道并发搜索
4. **不要绕过性能监控** - 使用 `synergy-monitor.js`
5. **不要忽略缓存机制** - 配置文件已设置最佳实践

## ✅ 推荐模式

### 复用现有能力
```javascript
// ✅ 正确: 复用原生Tasks
const marketAnalysis = await bmadTasks.analyzeMarketOpportunity(
  query, analysis_dimensions
);

// ❌ 错误: 重新造轮子
// 不要自己实现市场分析逻辑
```

### 使用智能路由
```javascript
// ✅ 正确: 让系统自动路由
const result = await bmadSystem.routeAndExecute(
  user_request, options
);

// ❌ 错误: 手动选择Agent
// 不要硬编码Agent选择逻辑
```

## 🔗 相关文件索引

- **核心实现**: `bmad-core/src/bmad-native-tasks.js`
- **路由系统**: `bmad-core/src/native-first-bmad-system.js`
- **配置文件**: `bmad-core/config/native-first-bmad-core-config.yaml`
- **性能监控**: `bmad-core/src/synergy-monitor.js`
- **演示示例**: `bmad-core/demo/`

## 📊 质量指标

- **分析质量提升**: 20-40%
- **决策质量分数**: 8.2 → 9.2+
- **协同效应**: 3.5x-5.0x效率提升
- **知识转移效率**: 0.87

## 🚀 快速开始

```bash
# 查看可用演示
node bmad-core/demo/investment-analysis-demo.js
node bmad-core/demo/enterprise-service-demo.js

# 运行验证
npm run bmad:validate
```

---

> **重要**: 在实现新功能前，请先检查 `bmad-core/src/bmad-native-tasks.js` 中是否已有对应能力。优先复用，避免重复开发。