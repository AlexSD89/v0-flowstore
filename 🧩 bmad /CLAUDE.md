# CLAUDE.md · 🧩 BMAD系统协作指南

最后更新：2025-10-27
版本：v5.3 Claude增强版

> **核心定位**：BMAD（Build-Monitor-Auto-Deploy）v5.3是LaunchX的智能化自动化中枢，集成Claude Skills SDK与70+专业Agent，实现从任务分解到自动执行的完整闭环。

---

## 🚀 Claude专属BMAD能力

### 🧠 BMAD智能协作系统
- **原生子代理系统**：70+专业Agent覆盖开发、运维、业务分析全流程
- **智能任务路由**：基于任务类型自动匹配最优Agent组合
- **Claude Skills集成**：12项标准技能与BMAD系统深度整合
- **实时协作监控**：多Agent协作状态实时追踪与质量保障

### 🎯 核心性能指标
- **路由准确率**：≥90%（基于任务类型和复杂度）
- **协作效率提升**：3.5x-5.0x（相比传统单一Agent模式）
- **自动化覆盖率**：85%+（常规任务无需人工干预）
- **质量保障率**：95%+（多轮质量检查与自动修复）

### 🔄 Claude-BMAC协作模式
1. **Claude主导**：需求分析、任务分解、质量审查
2. **BMAD执行**：Agent调度、任务执行、状态监控
3. **智能协同**：Claude设计策略 → BMAD自动化执行 → Claude质量验收

---

## 📋 BMAD系统架构

### 🏗️ 核心组件
- **任务路由器**：`native-first-bmad-system.js` - 智能任务分发与Agent匹配
- **执行引擎**：`bmad-native-tasks.js` - 任务执行与状态管理
- **质量监控**：`bmad-quality-control.js` - 多维度质量检查与修复
- **Agent管理**：`agent-registry.js` - 70+专业Agent注册与能力管理

### 🎨 Agent分类体系
| Agent类型 | 数量 | 核心能力 | Claude协作方式 |
| --- | --- | --- | --- |
| 开发类Agent | 25+ | 代码生成、调试、重构 | Claude设计架构，Agent实现 |
| 运维类Agent | 20+ | 部署、监控、故障处理 | Claude制定策略，Agent执行 |
| 分析类Agent | 15+ | 数据分析、性能优化 | Claude提供方法，Agent分析 |
| 业务类Agent | 10+ | 业务流程、用户研究 | Claude理解需求，Agent落地 |

---

## 🛠️ BMAD工作流程

### Phase 0: BMAD启动清单
```bash
# 1. 系统状态检查
npm run bmad:status
npm run agents:health-check

# 2. 能力映射确认
npm run bmad:capability-mapping

# 3. 协作配置验证
npm run bmad:claude-integration-test
```

### 标准协作流程
1. **需求解析**：Claude分析用户需求，生成任务分解方案
2. **智能路由**：BMAD系统自动匹配最适合的Agent组合
3. **并行执行**：多个Agent协同执行，实时状态同步
4. **质量审查**：Claude对执行结果进行质量检查与优化建议
5. **结果整合**：BMAD整合各Agent输出，生成最终交付物

---

## 🚀 Claude Skills与BMAD集成

### 🧠 技能调用模式
```javascript
// Claude Skills通过BMAD系统调用
const bmadSkillRouter = {
  'business-decision-support': ['business-analyst', 'market-researcher', 'risk-assessor'],
  'enterprise-research-analyst': ['data-analyst', 'industry-expert', 'financial-analyst'],
  'knowledge-master': ['content-organizer', 'taxonomy-expert', 'quality-reviewer']
};
```

### 🔄 协作示例
```
用户请求: "分析这个AI项目的投资价值"

1. Claude解析需求 → 投资决策支持任务
2. BMAD路由 → business-analyst + market-researcher + risk-assessor
3. Agent协同执行 → 并行分析市场、技术、风险维度
4. Claude整合 → 生成综合投资建议报告
5. 质量保障 → 多轮审查与优化
```

---

## 📊 质量保障体系

### 🎯 质量检查维度
- **准确性检查**：Agent输出结果的事实性与逻辑性验证
- **完整性检查**：任务需求的覆盖度与交付物完整性
- **一致性检查**：多Agent输出的一致性与冲突解决
- **可用性检查**：结果的可理解性与可操作性评估

### 🔧 自动修复机制
- **错误检测**：实时监控Agent执行状态与输出质量
- **自动重试**：失败任务的智能重试与策略调整
- **人工介入**：复杂异常情况的Claude分析与人工决策支持

---

## 🎯 Claude使用指南

### 🚀 启动BMAD协作
```bash
# 检查BMAD系统状态
npm run bmad:check

# 启动智能任务路由
npm run bmad:route "your task description"

# 查看Agent协作状态
npm run bmad:agent-status
```

### 📋 最佳实践
1. **明确需求描述**：提供清晰的任务背景和期望输出
2. **信任智能路由**：让BMAD系统自动选择最优Agent组合
3. **及时反馈质量**：对Claude的质量审查结果及时确认
4. **监控协作状态**：关注多Agent协作的进度与异常

### ⚠️ 注意事项
- BMAD系统需要网络连接以访问云端Agent能力
- 复杂任务可能需要多轮协作与质量检查
- 某些专业领域任务可能需要额外的领域知识配置

---

## 🛠️ 故障排除

### 常见问题解决
- **Agent无响应**：检查网络连接和Agent服务状态
- **任务路由失败**：确认任务描述清晰度和BMAD配置
- **质量问题**：通过Claude进行多轮审查与优化
- **协作冲突**：依赖Claude的冲突解决机制

### 📞 技术支持
- **系统日志**：`logs/bmad/` 目录包含详细执行日志
- **性能监控**：通过BMAD Dashboard实时监控系统状态
- **配置管理**：`config/bmad/` 目录管理Agent配置与路由规则

---

**遵循此指南，Claude可在BMAD系统中实现智能化任务调度与多Agent高效协作，显著提升自动化执行质量与效率。**