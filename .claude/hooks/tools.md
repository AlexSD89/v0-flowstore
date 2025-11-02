# LaunchX AI协作工具集 - Tools.md

> **核心定位**: 描述Claude Code Hook系统中的工具、触发点和自动化流程  
> **更新时间**: 2025-08-15 21:45:00

---

## 🛠️ 工具生态架构

### 核心理念
LaunchX通过Claude Code Hook系统实现"编辑→格式化→Lint→构建/测试→自动修复"的完整质量闭环，每个文件类型都有专门的工具链支持。

### 工具分类体系

```yaml
工具分类架构:
  代码质量工具:
    格式化器: "统一代码风格和格式规范"
    检查器: "静态代码分析和质量检查"
    构建器: "编译验证和语法检查"
    测试器: "自动化测试运行和覆盖率检查"
    
  AI协作工具:
    Agent系统: "专业化AI代理处理复杂任务"
    Hook系统: "事件驱动的自动化流程控制"
    MCP服务器: "模型上下文协议服务集成"
    
  项目管理工具:
    文档生成器: "智能文档同步和更新系统"
    冲突解决器: "Hook-Agent协调和优先级管理"
    通知系统: "声音和视觉反馈机制"
```

---

## 📋 文件类型工具映射

### Swift/SwiftUI 工具链

**触发条件**: `Edit(*.swift)`  
**Hook文件**: `.claude/hooks/swift-quality-pipeline.sh`

| 阶段 | 工具 | 功能描述 | 触发点 | 配置文件 |
|------|------|----------|--------|----------|
| 格式化 | `swiftformat` | 统一Swift代码格式 | 文件编辑后 | `.swiftformat` |
| 代码检查 | `swiftlint` | Swift代码质量分析 | 格式化后 | `.swiftlint.yml` |
| 编译验证 | `xcodebuild` | Swift项目构建验证 | Lint检查后 | `*.xcodeproj` |
| 单元测试 | `xcodebuild test` | 自动化测试运行 | 构建成功后 | 测试Target |
| 可访问性 | 自定义审计 | SwiftUI可访问性检查 | 测试后 | 内置规则 |
| AI修复 | Claude Code | 智能错误分析修复 | 发现问题时 | 自动触发 |

**安装要求**:
```bash
# 必需工具
brew install swiftformat swiftlint
xcode-select --install

# 可选增强
brew install xcpretty  # 构建输出美化
```

### Python 工具链

**触发条件**: `Edit(*.py)`  
**Hook文件**: `.claude/hooks/python-quality-pipeline.sh`

| 阶段 | 工具 | 功能描述 | 触发点 | 配置文件 |
|------|------|----------|--------|----------|
| 导入排序 | `isort` | Python导入语句规范化 | 文件编辑后 | `.isort.cfg` |
| 代码格式化 | `black` | Python代码格式统一 | isort后 | `pyproject.toml` |
| 代码检查 | `flake8` | PEP8和代码质量检查 | 格式化后 | `.flake8` |
| 类型检查 | `mypy` | 静态类型分析 | flake8后 | `mypy.ini` |
| 语法验证 | `python -m py_compile` | Python语法编译检查 | 类型检查后 | 内置 |
| 单元测试 | `pytest` | 自动化测试执行 | 语法验证后 | `pytest.ini` |

**安装要求**:
```bash
# 核心工具
pip install black isort flake8 mypy pytest
# 或者使用 poetry/pipenv 管理
```

### JavaScript/TypeScript 工具链

**触发条件**: `Edit(*.js)|Edit(*.jsx)|Edit(*.ts)|Edit(*.tsx)`  
**Hook文件**: `.claude/hooks/javascript-quality-pipeline.sh`

| 阶段 | 工具 | 功能描述 | 触发点 | 配置文件 |
|------|------|----------|--------|----------|
| 代码格式化 | `prettier` | JS/TS代码格式统一 | 文件编辑后 | `.prettierrc` |
| 代码检查 | `eslint` | JavaScript代码质量分析 | 格式化后 | `.eslintrc.js` |
| 类型检查 | `tsc --noEmit` | TypeScript类型验证 | ESLint后 | `tsconfig.json` |
| 构建验证 | `npm run build` | 项目构建验证 | 类型检查后 | `package.json` |
| 单元测试 | `npm test` | Jest/Vitest测试运行 | 构建后 | `jest.config.js` |

**安装要求**:
```bash
# 项目依赖
npm install --save-dev prettier eslint @typescript-eslint/parser
npm install --save-dev jest @types/jest
```

### Rust 工具链

**触发条件**: `Edit(*.rs)`  
**Hook文件**: `.claude/hooks/rust-quality-pipeline.sh`

| 阶段 | 工具 | 功能描述 | 触发点 | 配置文件 |
|------|------|----------|--------|----------|
| 代码格式化 | `rustfmt` | Rust代码格式规范 | 文件编辑后 | `rustfmt.toml` |
| 代码检查 | `clippy` | Rust代码质量和最佳实践检查 | 格式化后 | `clippy.toml` |
| 编译验证 | `cargo build` | Rust项目编译检查 | Clippy后 | `Cargo.toml` |
| 单元测试 | `cargo test` | Rust测试套件运行 | 编译后 | 内置 |

### Go 工具链

**触发条件**: `Edit(*.go)`  
**Hook文件**: `.claude/hooks/go-quality-pipeline.sh`

| 阶段 | 工具 | 功能描述 | 触发点 | 配置文件 |
|------|------|----------|--------|----------|
| 代码格式化 | `gofmt` | Go代码格式标准化 | 文件编辑后 | 内置 |
| 代码检查 | `golint` + `go vet` | Go代码质量和潜在错误检查 | 格式化后 | 内置 |
| 编译验证 | `go build` | Go项目编译验证 | 检查后 | `go.mod` |
| 单元测试 | `go test` | Go测试包运行 | 编译后 | 内置 |

### Java 工具链

**触发条件**: `Edit(*.java)`  
**Hook文件**: `.claude/hooks/java-quality-pipeline.sh`

| 阶段 | 工具 | 功能描述 | 触发点 | 配置文件 |
|------|------|----------|--------|----------|
| 代码格式化 | `google-java-format` | Java代码格式统一 | 文件编辑后 | 内置Google标准 |
| 代码检查 | `checkstyle` | Java代码规范检查 | 格式化后 | `checkstyle.xml` |
| 静态分析 | `spotbugs` | Java潜在bug检测 | checkstyle后 | `spotbugs.xml` |
| 编译验证 | `mvn compile` / `gradle build` | Java项目编译 | 静态分析后 | `pom.xml` / `build.gradle` |
| 单元测试 | `mvn test` / `gradle test` | JUnit测试运行 | 编译后 | 测试配置 |

---

## 🎯 AI协作工具

### Agent系统

**触发方式**: 通过`Task()`工具调用专业化Agent

| Agent类型 | 专业领域 | 触发场景 | 工具权限 |
|-----------|----------|----------|----------|
| `general-purpose` | 通用复杂任务 | 多步骤开发任务 | 所有工具 |
| `swift-quality-pipeline` | Swift开发 | Swift文件质量检查 | Swift工具链 |
| `frontend-developer` | 前端开发 | UI/UX相关任务 | Web开发工具 |
| `backend-architect` | 后端架构 | API和数据库设计 | 服务器工具 |
| `ai-engineer` | AI集成 | 机器学习功能 | AI/ML工具 |
| `user-intervention-notifier` | 用户交互 | 需要人工决策时 | 通知工具 |

### Hook协调系统

**管理器**: `.claude/hooks/hook-coordination-manager.sh`

**功能特性**:
- 🔒 **资源锁定**: 防止并发操作冲突
- 📊 **优先级管理**: 基于Hook类型、文件类型、Agent重要性的优先级计算
- ⏰ **队列处理**: 冲突时自动排队等待
- 📈 **性能监控**: 协调效率和成功率统计

**优先级配置**:
```json
{
  "hook_priorities": {
    "UserPromptSubmit": 100,
    "PreToolUse": 90,
    "PostToolUse": 70,
    "Stop": 50
  },
  "file_type_priorities": {
    "*.swift": 85,
    "*.py": 80,
    "*.js": 80,
    "*.ts": 80
  }
}
```

---

## 🔔 通知和反馈系统

### 声音通知工具

**Hook文件**: `.claude/hooks/user-intervention-notifier.sh`

| 场景类型 | 声音 | 含义 | 触发条件 |
|----------|------|------|----------|
| 成功完成 | `Glass.aiff` | 操作成功 | 质量检查通过 |
| 警告问题 | `Ping.aiff` | 需要注意 | 发现质量问题 |
| 严重错误 | `Sosumi.aiff` × 3 | 需要干预 | 编译失败等 |
| 安全警告 | `Funk.aiff` × 5 | 安全关注 | 权限问题 |
| 用户介入 | `Hero.aiff` | 等待决策 | 需要人工判断 |

### 视觉通知工具

**横幅通知**: 全屏状态显示，包含：
- 🚨 紧急程度标识
- 📋 详细问题描述  
- ⏰ 等待时间显示
- 🎯 建议操作方案

---

## 📚 文档工具

### 自动文档生成

**Hook文件**: `.claude/hooks/documentation-update-pipeline.sh`

**触发条件**:
- `Edit(*.md)` - Markdown文档变更
- `Edit(CLAUDE.md)` - 项目配置变更
- `Edit(package.json)` - 依赖变更
- 代码结构变更

**生成内容**:
- 📖 **README.md**: 项目概述和快速开始
- 📚 **API文档**: 自动提取API端点
- 🛠️ **开发指南**: 环境配置和工作流
- 📝 **变更日志**: 自动记录项目变更

### 知识库同步

**目标目录**: `/Users/dangsiyuan/Documents/obsidion/launch x/🟣 knowledge`

**同步内容**:
- 行业趋势和技术洞察
- 项目经验和最佳实践
- AI协作模式和优化策略
- 质量保证方法论

---

## ⚙️ 工具配置管理

### 环境变量控制

在`.claude/settings.local.json`中配置：

```json
{
  "env": {
    "SOUND_NOTIFICATIONS": "true",      // 声音通知开关
    "AUTO_FORMAT_ENABLED": "true",      // 自动格式化
    "AUTO_LINT_ENABLED": "true",        // 自动代码检查
    "AUTO_BUILD_ENABLED": "true",       // 自动构建验证
    "AUTO_FIX_ENABLED": "true",         // AI自动修复
    "DOCUMENTATION_AUTO_UPDATE": "true" // 文档自动更新
  }
}
```

### 工具安装检查

每个质量管道都包含环境检查功能：

```bash
# 示例：Swift环境检查
check_swift_environment() {
    # 检查 Xcode 工具
    command -v xcodebuild || install_xcode_tools
    # 检查 SwiftFormat
    command -v swiftformat || brew install swiftformat
    # 检查 SwiftLint
    command -v swiftlint || brew install swiftlint
}
```

---

## 🎪 工具集成最佳实践

### 1. 新工具集成流程

```yaml
步骤:
  1. 工具评估: "评估工具的必要性和适配性"
  2. 权限配置: "在settings.local.json中添加权限"
  3. Hook创建: "创建或更新质量管道Hook"
  4. 配置文件: "添加工具专用配置文件"
  5. 测试验证: "验证工具集成效果"
  6. 文档更新: "更新tools.md和相关文档"
```

### 2. 工具冲突解决

**策略**:
- 🔒 **资源锁定**: 同一资源同时只能被一个工具使用
- 📊 **优先级排序**: 重要工具优先执行
- ⏰ **超时机制**: 避免工具执行死锁
- 🔄 **自动重试**: 失败时智能重试

### 3. 工具性能优化

**方法**:
- 📦 **并行执行**: 无依赖关系的工具并行运行
- 💾 **结果缓存**: 缓存工具执行结果
- 🎯 **增量检查**: 只检查变更文件
- 📈 **性能监控**: 持续优化工具执行效率

---

## 🚀 扩展和定制

### 自定义工具添加

1. **在`settings.local.json`中添加权限**:
```json
"permissions": {
  "allow": [
    "Bash(your-tool:*)"
  ]
}
```

2. **创建质量管道Hook**:
```bash
#!/bin/bash
# .claude/hooks/custom-quality-pipeline.sh
# 自定义工具质量管道
```

3. **配置Hook触发器**:
```json
"PostToolUse": [
  {
    "matcher": "Edit(*.ext)",
    "hooks": [
      {
        "type": "command",
        "command": ".claude/hooks/custom-quality-pipeline.sh"
      }
    ]
  }
]
```

### 工具链定制

可以根据项目需求定制工具链：
- 🎨 **前端项目**: 重点关注UI/UX和性能
- 🔧 **后端项目**: 强调API质量和安全性
- 📱 **移动开发**: 突出可访问性和性能
- 🤖 **AI项目**: 包含模型训练和推理质量检查

---

## 📊 工具效果监控

### 质量指标

- ✅ **代码通过率**: 各阶段检查通过比例
- ⏱️ **执行时间**: 工具链执行效率
- 🔧 **修复率**: AI自动修复成功率
- 👥 **用户介入**: 需要人工干预的频率

### 报告生成

每次工具执行都会生成详细报告：
- 📂 **JSON报告**: `.claude/reports/` 目录
- 📈 **质量分数**: 0-100分质量评估
- 💡 **改进建议**: 具体的优化建议
- 📋 **下一步行动**: 推荐的后续操作

---

**🎯 目标**: 通过完整的工具生态，实现真正的AI驱动开发体验，让开发者专注于创意和业务逻辑，工具负责质量保证。

**📝 维护**: 本文档随工具集的演进持续更新，确保信息的准确性和时效性。

---

*文档由LaunchX AI协作系统自动维护 | 最后更新: 2025-08-15 21:45:00*