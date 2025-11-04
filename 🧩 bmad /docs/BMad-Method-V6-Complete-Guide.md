# BMad Method V6 完整使用指南

> **🚨 ALPHA版本指南** - 本文档适用于BMad Method v6.0.0-alpha.3
>
> **适用人群**：开发者、项目经理、AI协作用户
>
> **前置要求**：Node.js v20+

## 📋 目录

- [快速开始](#快速开始)
- [系统架构](#系统架构)
- [核心模块](#核心模块)
- [Fusion代理系统](#fusion代理系统)
- [CLI工具使用](#cli工具使用)
- [IDE集成](#ide集成)
- [最佳实践](#最佳实践)
- [故障排除](#故障排除)

## 🚀 快速开始

### 1. 系统验证

```bash
# 克隆项目
git clone <repository-url>
cd BMAD-METHOD-main-6

# 安装依赖
npm install

# 验证CLI工具
npm run bmad -- --help

# 查看可用模块
npm run bmad -- list
```

### 2. Fusion模块快速使用

```bash
# 生成Fusion CLI资源
node tools/migration/generate-fusion-cli.js

# 安装Fusion模块到当前项目
npm run bmad -- install --modules fusion --ides claude-code

# 验证安装
npm run bmad -- status
```

### 3. 基础功能测试

```bash
# 运行测试套件
npm test

# 验证agent schema
npm run validate:schemas
```

## 🏗️ 系统架构

### BMAD-CORE (核心引擎)

```
BMAD-CORE Framework
├── BMM (BMad Method)     # 敏捷AI开发方法论
├── BMB (BMad Builder)     # 自定义解决方案构建器
├── CIS (Creative Suite)   # 创新智能套件
└── Fusion System         # 融合代理系统 (codex完成)
```

### 关键特性

- **Agent Orchestration** - 专业化AI代理编排
- **Workflow Engine** - 引导式多步骤工作流
- **Modular Architecture** - 领域特定扩展
- **IDE Integration** - 跨开发环境集成
- **Update-Safe Customization** - 持久化配置

## 📦 核心模块

### 1. BMM - BMad Method (敏捷AI开发)

**规模自适应工作流 (Levels 0-4)**：

| Level | 项目规模 | 文档复杂度 | 典型场景 |
|-------|----------|------------|----------|
| 0     | 单个修改  | 最小化     | Bug修复 |
| 1     | 1-10个故事 | 轻量PRD   | 小功能 |
| 2     | 5-15个故事 | 专注PRD   | 中功能 |
| 3     | 12-40个故事 | 完整架构  | 大功能 |
| 4     | 40+个故事  | 企业级   | 复杂系统 |

**专业代理**：
- **PM** - 产品经理 (规划和需求)
- **Analyst** - 商业分析师
- **Architect** - 技术架构师
- **SM** - Scrum Master (冲刺管理)
- **DEV** - 开发者 (实现)
- **TEA** - 测试架构师 (质量保证)
- **UX** - 用户体验设计师

### 2. CIS - Creative Intelligence Suite

**5大创意工作流**：

1. **Brainstorming** (36种技巧)
   - 发散/收敛思维
   - 横向连接
   - 强制关联

2. **Design Thinking** (5阶段流程)
   - 共情 → 定义 → 构思 → 原型 → 测试

3. **Problem Solving** (系统化方法)
   - 5Why、鱼骨图
   - 根因分析
   - 解决方案生成

4. **Innovation Strategy** (商业模式创新)
   - 蓝海战略
   - 任务导向设计
   - 颠覆性创新模式

5. **Storytelling** (25种叙事框架)
   - 英雄之旅
   - 故事圈
   - 说服性结构

**5个专家代理**：
- **Carson** - 头脑风暴专家
- **Maya** - 设计思维大师
- **Dr. Quinn** - 问题解决者
- **Victor** - 创新预言家
- **Sophia** - 故事大师

### 3. BMB - BMad Builder

**三种Agent类型**：
- **Full Module** - 完整模块代理
- **Hybrid** - 混合代理
- **Standalone** - 独立代理

## 🤖 Fusion代理系统

### 核心设计 (codex完成)

**10个专业代理**：

| 代理名称 | 专业领域 | 核心能力 | 协作模式 |
|----------|----------|----------|----------|
| business_analyst | 商业分析 | 投资评估、商业模式分析 | hierarchical |
| backend_architect | 技术架构 | 系统设计、可扩展性评估 | peer_to_peer |
| ai_engineer | AI工程 | 算法实现、模型优化 | sequential |
| data_scientist | 数据科学 | 量化分析、预测建模 | parallel |
| risk_manager | 风险管理 | 风险识别、合规检查 | parallel |
| trend_researcher | 趋势研究 | 市场洞察、技术预测 | parallel |
| frontend_developer | 前端开发 | UI/UX、用户体验 | sequential |
| product_manager | 产品策略 | 需求分析、产品定位 | hierarchical |
| studio_producer | 项目统筹 | 多Agent协调、进度控制 | swarm |
| code_reviewer | 代码审查 | 质量检查、安全审计 | peer_to_peer |

### 智能任务路由

```json
{
  "task_pattern": "投资.*分析|投资.*评估|投资.*机会",
  "primary_agent": "business_analyst",
  "supporting_agents": ["risk_manager", "data_scientist"],
  "collaboration_type": "hierarchical",
  "expected_synergy": 3.2
}
```

### 协作模式详解

1. **Sequential (顺序执行)** - 效率因子 1.2x
   - 适用于：线性工作流、数据处理管道

2. **Parallel (并行协作)** - 效率因子 3.5x
   - 适用于：多维度分析、并发搜索

3. **Hierarchical (层次协作)** - 效率因子 2.1x
   - 适用于：复杂项目管理、系统架构

4. **Peer-to-Peer (对等协作)** - 效率因子 1.8x
   - 适用于：创新方案、质量优化

5. **Swarm (群体智能)** - 效率因子 4.2x
   - 适用于：复杂问题解决、创新发现

## 💻 CLI工具使用

### 基础命令

```bash
# 查看帮助
npm run bmad -- --help

# 列出可用模块
npm run bmad -- list

# 查看安装状态
npm run bmad -- status
```

### 安装命令

```bash
# 交互式安装
npm run bmad -- install

# 快速安装指定模块
npm run bmad -- install --modules fusion,bmm --ides claude-code

# 强制重新安装
npm run bmad -- install --force

# 安装到指定目录
npm run bmad -- install --target /path/to/project
```

### 模块管理

```bash
# 构建agent文件
npm run bmad -- build <agent-name>

# 更新现有安装
npm run bmad -- update

# 卸载BMAD
npm run bmad -- uninstall
```

### 开发工具

```bash
# 代码格式化
npm run format:fix

# 代码检查
npm run lint

# 构建bundle
npm run bundle

# 验证schemas
npm run validate:schemas
```

## 🔌 IDE集成

### Claude Code集成

```bash
# 安装Claude Code集成
npm run bmad -- install --ides claude-code --modules fusion

# 使用方式
/fusion:agents:business_analyst "投资项目分析"
/fusion:tasks:business_analyst "具体商业需求"
```

### Codex集成

```bash
# 安装Codex集成
npm run bmad -- install --ides codex --modules all

# 使用方式
fusion business_analyst "投资机会评估"
```

### 配置文件位置

```
项目根目录/
├── bmad/
│   ├── core/                 # 核心框架
│   ├── bmm/                  # BMad Method模块
│   ├── bmb/                  # BMad Builder模块
│   ├── cis/                  # Creative Suite模块
│   ├── fusion/               # Fusion代理系统
│   └── _cfg/                 # 用户配置
│       └── agents/           # 自定义agent配置
```

## 🎯 最佳实践

### 1. 项目启动

```bash
# 1. 初始化新项目
mkdir my-project && cd my-project
npm init -y

# 2. 安装BMAD Core
npm install bmad-method@alpha

# 3. 安装到项目
npx bmad-method install --modules bmm,fusion

# 4. 加载PM agent开始工作
# 在IDE中加载 bmad/bmm/agents/pm.agent.yaml
```

### 2. 工作流使用

```bash
# 产品需求文档 (PRD)
*prd

# 技术规格文档
*tech-spec

# Fusion代理协作
/fusion:agents:business_analyst "市场分析"
```

### 3. 规模自适应

```bash
# Level 0-1: 小项目 (1-10个故事)
*tech-spec

# Level 2-3: 中大项目 (12-40个故事)
*prd -> *architecture -> *tech-spec

# Level 4: 企业级项目 (40+个故事)
完整四阶段工作流
```

### 4. 质量保证

```bash
# 运行测试
npm test

# 验证agent配置
npm run validate:schemas

# 代码质量检查
npm run lint
```

## 🔧 故障排除

### 常见问题

**1. CLI命令无法执行**
```bash
# 检查Node.js版本
node --version  # 需要 >= v20

# 重新安装依赖
rm -rf node_modules package-lock.json
npm install
```

**2. 模块安装失败**
```bash
# 检查权限
ls -la bmad/

# 强制重新安装
npm run bmad -- install --force
```

**3. Fusion代理不工作**
```bash
# 重新生成Fusion资源
node tools/migration/generate-fusion-cli.js

# 检查配置文件
cat bmad/_cfg/templates/optimized-bmad-config-v5.4.json
```

**4. IDE集成问题**
```bash
# 检查IDE配置
npm run bmad -- status

# 重新安装IDE集成
npm run bmad -- install --ides claude-code,codex
```

### 调试模式

```bash
# 启用详细日志
DEBUG=bmad:* npm run bmad -- status

# 检查agent配置
npm run validate:schemas

# 查看系统状态
npm run bmad -- status --verbose
```

### 获取帮助

```bash
# CLI帮助
npm run bmad -- --help
npm run bmad -- install --help

# 查看模块信息
npm run bmad -- list

# 社区支持
# Discord: https://discord.gg/gk8jAdXWmj
# GitHub Issues: https://github.com/bmad-code-org/BMAD-METHOD/issues
```

## 📈 性能监控

### 协同效应指标

系统自动监控以下8个关键指标：

1. **知识传递效率** - 目标值: 0.85
2. **任务完成加速** - 目标值: 2.5x
3. **质量提升因子** - 目标值: 1.5x
4. **创新评分** - 目标值: 3.0
5. **资源利用率** - 目标值: 0.8
6. **沟通效率** - 目标值: 0.9
7. **冲突解决率** - 目标值: 0.95
8. **整体协同评分** - 目标值: 0.85

### 监控命令

```bash
# 查看协同指标
npm run bmad -- status --metrics

# 导出性能报告
npm run bmad -- status --export-report
```

## 🎉 下一步

恭喜！您已经完成了BMad Method V6的基础设置。现在可以：

1. **开始第一个项目** - 使用PM agent创建PRD
2. **探索Fusion代理** - 体验多Agent协作
3. **自定义配置** - 在`bmad/_cfg/agents/`中创建自己的agent
4. **集成开发流程** - 将BMAD融入您的日常工作流

---

**文档版本**: v6.0.0-alpha.3
**更新时间**: 2025-11-04
**状态**: 活跃开发中
**下次更新**: IDE集成增强和性能优化