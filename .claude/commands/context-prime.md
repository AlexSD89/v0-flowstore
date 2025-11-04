---
description: 智能项目上下文初始化，基于awesome-claude-code最佳实践的项目理解初始化命令
category: project-analysis-technical
argument-hint: "[--project] [--depth] [--focus]"
allowed-tools: Task, WebSearch, WebFetch, Read, Write
---

# 🚀 智能项目上下文初始化 / Intelligent Project Context Prime

基于awesome-claude-code最佳实践的项目理解初始化命令
Project understanding initialization command based on awesome-claude-code best practices

## 概述

### 功能说明
全面的项目理解初始化，包含仓库结构加载、开发上下文设置、项目目标建立，专为LaunchX智能协作系统优化。

### 适用场景
- **主要场景**: 新项目接手、团队成员onboarding
- **次要场景**: 项目阶段切换、复杂功能开发前的上下文重建
- **LaunchX特化**: PocketCorn/Zhilink项目快速上下文切换

### 复杂度级别
- **任务级别**: A级 (重要分析)
- **预期时间**: 3-8分钟
- **资源需求**: workspace-filesystem, methodology-library

## 语法格式

### 基础语法
```bash
/context-prime
```

### 完整语法
```bash
/context-prime 
  --project [pocketcorn|zhilink|general]
  --depth [shallow|medium|deep]
  --focus [architecture|business|technical]
  --output [summary|detailed|actionable]
```

## 参数说明

### 可选参数
- **--project** (`enum`): 项目类型
  - `pocketcorn`: 投资分析引擎项目
  - `zhilink`: AI能力交易平台
  - `general`: 通用项目分析
- **--depth** (`string`): 分析深度
  - `shallow`: 快速概览（2-3分钟）
  - `medium`: 标准分析（5-8分钟）
  - `deep`: 全面深入（10-15分钟）
- **--focus** (`string`): 重点关注维度
  - `architecture`: 技术架构和代码结构
  - `business`: 业务逻辑和用户需求
  - `technical`: 技术实现和开发规范

## Agent调用链

### 主要执行流程
```yaml
阶段1 - 项目结构扫描:
  - Agent: general-purpose
  - 功能: 扫描目录结构、识别技术栈
  - 输出: 项目技术档案

阶段2 - 核心文档解析:
  - Agent: technical-researcher
  - 功能: 解析CLAUDE.md、README、配置文件
  - 输出: 项目规范和约束

阶段3 - 业务上下文理解:
  - Agent: business-analyst
  - 功能: 理解项目目标和业务逻辑
  - 输出: 业务需求档案

阶段4 - 开发上下文设置:
  - Agent: ai-engineer
  - 功能: 设置最佳开发策略和工具链
  - 输出: 开发行动指南
```

### MCP服务调用
```yaml
文件系统服务:
  - workspace-filesystem: 项目文件扫描
  - methodology-library: 开发规范参考
  
项目特定服务:
  - pocketcorn-data: 投资分析项目数据
  - zhilink-platform: AI平台代码库
  - knowledge-base: 项目知识库
```

## 输出格式

### 标准上下文报告
```markdown
# 项目上下文分析报告

## 📊 项目概况
- **项目名称**: [自动识别]
- **项目类型**: [PocketCorn/Zhilink/通用]
- **技术栈**: [自动检测的技术栈]
- **开发阶段**: [初期/开发/成熟]
- **团队规模**: [基于代码提交推测]

## 🏗️ 架构分析
- **前端技术**: [React/Vue/Angular + 具体版本]
- **后端技术**: [Node.js/Python/Go + 框架]
- **数据库**: [PostgreSQL/Redis/MongoDB]
- **部署方式**: [Docker/K8s/云服务]
- **核心依赖**: [关键技术依赖列表]

## 📋 关键文件识别
- **配置文件**: package.json, requirements.txt, etc.
- **入口文件**: [主要入口点]
- **核心模块**: [重要业务模块]
- **测试文件**: [测试覆盖情况]
- **文档文件**: README, API docs, etc.

## 🎯 开发规范
- **代码风格**: [ESLint/Prettier配置]
- **提交规范**: [Conventional Commits/其他]
- **分支策略**: [GitFlow/GitHub Flow]
- **CI/CD**: [GitHub Actions/其他流程]

## 🚀 快速开始建议
1. **环境搭建**: [具体步骤]
2. **本地开发**: [开发服务器启动]
3. **测试运行**: [测试命令]
4. **构建部署**: [构建和部署流程]

## 💡 开发建议
- **推荐IDE**: [基于项目特点推荐]
- **必装插件**: [提升开发效率的插件]
- **调试工具**: [项目特定调试工具]
- **性能监控**: [推荐的监控工具]

## ⚠️ 注意事项
- **已知问题**: [从issues和TODO中提取]
- **技术债务**: [代码分析发现的问题]
- **依赖风险**: [过期或有风险的依赖]
- **安全考虑**: [安全相关的注意事项]

## 🔄 下一步行动
- [ ] 熟悉核心业务模块: [具体模块列表]
- [ ] 理解数据流: [数据处理流程]
- [ ] 配置开发环境: [环境配置检查清单]
- [ ] 运行测试套件: [确保环境正常]
```

## 使用示例

### 基础用法 - 快速上手新项目
```bash
# 加入新项目，快速理解整体情况
/context-prime

# 输出示例
📊 项目上下文分析完成
🏗️ 检测到: Next.js 14 + TypeScript + PostgreSQL
📋 核心模块: 用户管理、数据分析、API网关
🎯 开发规范: ESLint + Prettier + Husky
💡 建议: 使用VS Code + TypeScript插件
⚠️ 注意: 需要配置环境变量文件 .env.local
```

### 标准用法 - 项目深度分析
```bash
# 深入理解PocketCorn投资引擎
/context-prime --project pocketcorn --depth deep --focus business

# 输出示例  
📊 PocketCorn投资分析引擎 - 深度分析报告
🎯 业务核心: SPELO投资决策闭环 + 7维度评分
📈 关键算法: 风险量化、不确定性分析、智能推荐
💰 投资逻辑: 50万投资 → 6-8月 → 1.5倍回收
🔧 技术亮点: 42个Python模块 + 实时数据处理
```

### 高级用法 - 技术架构分析
```bash
# 深入分析Zhilink平台技术架构
/context-prime --project zhilink --depth deep --focus architecture

# 输出示例
🏗️ Zhilink AI平台 - 技术架构深度分析
⚡ 前端: Next.js 14 + React 18 + Cloudsway设计系统
🔧 后端: Node.js + PostgreSQL + Redis + MCP集成
🤖 AI系统: 6角色协作 + Claude Code集成
🎨 UI组件: shadcn/ui + Tailwind CSS + 暗黑模式
🚀 部署: Docker + K8s + 企业级监控
```

## 特殊功能

### LaunchX项目自动识别
```yaml
项目识别规则:
  PocketCorn项目:
    - 包含"investment", "SPELO", "scoring"关键词
    - 存在投资分析相关Python模块
    - 配置文件中有金融数据源
    
  Zhilink项目:
    - 包含"AI", "platform", "collaboration"关键词
    - 存在6角色系统相关代码
    - Next.js + React技术栈
    
  通用项目:
    - 不匹配上述特征的其他项目
```

### 智能开发建议生成
```python
def generate_development_suggestions(project_context):
    """
    基于项目特点生成个性化开发建议
    """
    suggestions = []
    
    # 基于技术栈推荐工具
    if 'React' in project_context.tech_stack:
        suggestions.append("推荐使用React DevTools")
        
    if 'TypeScript' in project_context.tech_stack:
        suggestions.append("配置严格的TypeScript检查")
        
    # 基于项目规模推荐实践
    if project_context.file_count > 100:
        suggestions.append("建议使用模块化架构")
        
    # 基于团队规模推荐流程
    if project_context.contributors > 3:
        suggestions.append("使用代码审查流程")
        
    return suggestions
```

## 错误处理

### 常见问题解决
```yaml
权限问题:
  错误: "Permission denied"
  解决: 检查文件系统MCP配置和权限

项目类型识别失败:
  错误: "Unable to determine project type"
  解决: 手动指定 --project 参数

分析超时:
  错误: "Analysis timeout"
  解决: 降低 --depth 参数或分步分析
```

## 性能优化

### 缓存策略
```yaml
项目结构缓存: 24小时有效期
配置文件缓存: 1小时有效期
依赖分析缓存: 每次npm/pip安装后更新
```

### 并行处理
```yaml
文件扫描: 并行读取多个目录
依赖分析: 异步解析package.json等文件
代码分析: 多线程处理大型代码库
```

---

## 集成特性

### Hook系统集成
- 在项目切换时自动触发context-prime
- 新分支创建时自动运行上下文分析
- 团队成员加入时自动生成onboarding指南

### Agent协作
- 为后续Agent执行提供丰富上下文信息
- 智能推荐最适合的Agent组合
- 基于项目特点调整Agent参数

### 持续学习
- 记录成功的上下文分析模式
- 基于用户反馈优化分析算法
- 自动更新项目识别规则

**命令版本**: v2.0 (基于awesome-claude-code最佳实践)  
**兼容性**: 完全兼容LaunchX智能协作系统  
**更新频率**: 随项目发展持续优化