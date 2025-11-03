---
title: "技术开发域 RULES"
owners:
  - "LaunchX Tech Core"
status: "active"
last_update: "2025-10-12"
related:
  - "./README.md"
  - "./CLAUDE.md"
  - "./AGENTS.md"
source: "自动生成（Codex CLI）"
impact: "约束开发域的交付与安全边界"
---

# 技术开发域 RULES

## 🔥 技术开发域四大核心系统

### 1. 技能自动激活系统（技术域专用）

#### 📋 技术域技能触发规则
```json
// tech-domain-skill-rules.json
{
  "frontend-dev": {
    "keywords": ["react", "component", "hook", "state", "layout", "tsx", "jsx"],
    "filePathTriggers": ["src/components/**", "*.tsx", "*.jsx", "src/hooks/**"],
    "contentTriggers": ["import.*from ['\"]react['\"]", "useState|useEffect|useContext"],
    "requiredSkills": ["react-19-patterns", "typescript-strict-standards", "testing-guidelines"],
    "description": "React 19 + TypeScript 严格模式 + 测试驱动开发"
  },
  "backend-api": {
    "keywords": ["api", "route", "controller", "service", "database", "express", "fastify"],
    "filePathTriggers": ["src/routes/**", "src/controllers/**", "src/services/**", "prisma/**"],
    "contentTriggers": ["@Controller|@Service|@Repository", "import.*express", "app.get|app.post"],
    "requiredSkills": ["restful-api-design", "database-orm-patterns", "error-handling-middleware"],
    "description": "RESTful API + ORM设计 + 错误处理中间件"
  },
  "infrastructure": {
    "keywords": ["docker", "kubernetes", "ci/cd", "deploy", "terraform"],
    "filePathTriggers": ["docker/**", "k8s/**", ".github/workflows/**", "infra/**"],
    "contentTriggers": ["FROM.*node|FROM.*python", "kubectl|docker-compose", "workflow:"],
    "requiredSkills": ["containerization-best-practices", "k8s-deployment-patterns", "ci-cd-security"],
    "description": "容器化 + K8s部署 + CI/CD安全"
  },
  "performance": {
    "keywords": ["performance", "optimization", "cache", "monitoring", "metrics"],
    "filePathTriggers": ["src/performance/**", "monitoring/**", "benchmark/**"],
    "contentTriggers": ["performance\\.mark|measure|timing", "cache|redis|memcached"],
    "requiredSkills": ["performance-profiling", "caching-strategies", "monitoring-setup"],
    "description": "性能分析 + 缓存策略 + 监控体系"
  }
}
```

#### 🔍 技能自动激活强制检查
- [ ] **关键词检测**：用户prompt包含技术关键词时立即激活对应技能
- [ ] **文件路径触发**：编辑特定技术文件路径时自动加载相关技能规范
- [ ] **代码模式识别**：代码内容包含特定技术模式时强制激活技能
- [ ] **技能文档加载**：确保技术规范文档已完整加载到AI上下文
- [ ] **激活确认机制**：AI必须确认已理解并严格执行技术规范

### 2. Dev Docs技术开发工作流

#### 📋 技术项目Dev Docs模板
```bash
#!/bin/bash
# tech-dev-docs.sh - 技术项目Dev Docs创建

create_tech_dev_docs() {
  local project_name="$1"
  local tech_stack="$2"
  local architecture="$3"

  TASK_DIR="$(date +%Y%m%d)-${project_name}-tech"
  mkdir -p "$TASK_DIR"

  # plan.md - 技术实施计划
  cat > "$TASK_DIR/plan.md" << EOF
# 技术实施计划 - ${project_name}

## 技术目标
- 项目名称：${project_name}
- 技术栈：${tech_stack}
- 架构模式：${architecture}
- 预期交付：$(date +%Y-%m-%d)

## 技术架构实施
### 阶段1：基础架构搭建
- [ ] 项目初始化和依赖配置
- [ ] 开发环境Docker化
- [ ] CI/CD流水线配置
- [ ] 代码质量检查工具集成

### 阶段2：核心功能开发
- [ ] 核心模块设计实现
- [ ] API接口开发
- [ ] 数据库设计实现
- [ ] 前端组件开发

### 阶段3：测试与优化
- [ ] 单元测试覆盖>80%
- [ ] 集成测试实施
- [ ] 性能基准测试
- [ ] 安全性扫描

## 技术质量门禁
- TypeScript编译错误数=0
- 代码覆盖率>80%
- 性能基准达标
- 安全扫描通过

## 技术风险评估
- 技术债务风险：
- 性能瓶颈风险：
- 安全漏洞风险：
- 可维护性风险：
EOF

  # context.md - 技术上下文
  cat > "$TASK_DIR/context.md" << EOF
# 技术实施上下文 - ${project_name}

## 技术环境
- Node.js版本：$(node --version)
- TypeScript版本：$(tsc --version)
- 包管理器：pnpm/npm/yarn
- 容器环境：Docker $(docker --version)

## 项目结构
\`find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | head -20\`

## 相关技术资产
- 公共组件库：memory-bank/support_modules/dev/
- 基础配置：.github/workflows/, docker/
- 测试框架：jest/vitest/cypress
- 监控工具：已集成的监控方案

## 技术约束条件
- 兼容性要求：Node.js 18+, TypeScript 5.0+
- 性能要求：API响应<200ms, 首屏<3s
- 安全要求：HTTPS, CSP, XSS防护
- 维护性要求：代码覆盖率>80%, 文档完整性100%

## 技术参考资源
- 技术文档：相关技术栈官方文档
- API规范：RESTful API设计指南
- 最佳实践：memory-bank/support_modules/dev/USEME.md
- 监控指标：现有监控仪表盘
EOF

  echo "✅ 技术Dev Docs已创建：$TASK_DIR"
}
```

### 3. 技术域关键节点Hook系统

#### 🚨 核心质量检查Hook（仅关键节点）
```bash
#!/bin/bash
# tech-critical-hooks.sh - 技术域关键节点质量检查

# 节点1：代码提交前 - 零错误门禁
critical_pre_commit_check() {
  echo "🔍 关键节点：代码提交前质量检查"

  # TypeScript编译错误必须为0
  if ! npx tsc --noEmit; then
    echo "🚫 关键错误：TypeScript编译失败，拒绝提交"
    exit 1
  fi

  # 基础代码格式检查
  if ! npm run lint --silent; then
    echo "🚫 关键错误：代码格式不合规，请运行 npm run lint:fix"
    exit 1
  fi

  echo "✅ 关键节点检查通过"
}

# 节点2：生产发布前 - 构建验证
critical_production_check() {
  echo "🔍 关键节点：生产发布前验证"

  # 构建必须成功
  if ! npm run build; then
    echo "🚫 关键错误：生产构建失败，拒绝发布"
    exit 1
  fi

  # 关键依赖安全检查
  if npm audit --audit-level moderate; then
    echo "⚠️ 关键警告：存在中危安全漏洞，请确认风险"
  fi

  echo "✅ 生产发布检查通过"
}
```

#### 🔍 关键节点UserPromptSubmit Hook
```typescript
// 仅在关键AI协作节点执行检查
interface CriticalTechCheck {
  hasDevDocs: boolean;
  followsSpecPlanDo: boolean;
  hasValidationOutput: boolean;
}

const criticalTechCheck: CriticalTechCheck = {
  hasDevDocs: checkTechDevDocsExist(),
  followsSpecPlanDo: checkWorkflowCompliance(),
  hasValidationOutput: checkValidationExists()
};

// 关键检查：Dev Docs完整性
function checkTechDevDocsExist(): boolean {
  return fs.existsSync('plan.md') &&
         fs.existsSync('context.md') &&
         fs.existsSync('tasks.md');
}

// 关键检查：遵循/spec → /plan → /do流程
function checkWorkflowCompliance(): boolean {
  return hasSpecDocument && hasPlanDocument && hasDoExecution;
}

// 关键检查：有验证输出
function checkValidationExists(): boolean {
  return hasTestResults || hasBuildOutput || hasDeploymentLog;
}
```

### 4. 技术域专业化Agent配置

#### 🤖 技术域Agent配置
```json
// tech-domain-agents.json
{
  "frontend-architect": {
    "role": "前端架构师",
    "expertise": "React 19, TypeScript, 状态管理, 性能优化",
    "tools": ["react-devtools", "typescript-compiler", "webpack-analyzer"],
    "outputFormat": "component-architecture-plan",
    "qualityStandards": ["组件化设计", "类型安全", "可测试性", "性能优化"],
    "activationTriggers": ["前端架构", "组件设计", "状态管理", "性能优化"]
  },
  "backend-specialist": {
    "role": "后端专家",
    "expertise": "Node.js, API设计, 数据库, 微服务架构",
    "tools": ["express-generator", "prisma-studio", "api-testing"],
    "outputFormat": "api-specification-document",
    "qualityStandards": ["RESTful设计", "数据一致性", "错误处理", "API安全"],
    "activationTriggers": ["API开发", "数据库设计", "微服务", "后端架构"]
  },
  "devops-engineer": {
    "role": "DevOps工程师",
    "expertise": "Docker, K8s, CI/CD, 监控告警",
    "tools": ["docker", "kubectl", "github-actions", "prometheus"],
    "outputFormat": "infrastructure-as-code",
    "qualityStandards": ["容器化标准", "自动化部署", "监控覆盖", "安全配置"],
    "activationTriggers": ["部署", "CI/CD", "容器化", "监控配置"]
  }
}
```

## 必做事项（精确定位版）
- **精确@定位**：使用@符号指定具体行号读取，避免整篇阅读（例：@CLAUDE.md第18-22行）
- **快速扫描**：使用find/grep定位关键信息，限制返回数量（例：`find . -name "*.ts" | head -5`）
- **分段验证**：每个改动独立验证，记录命令+输出+结论（不超过3行）
- **技能激活**：触发技术关键词时立即读取@RULES.md第19-35行对应技能规则
- **Dev Docs强制**：Level M+任务必须创建三文件（模板见@RULES.md第63-85行）
- **零错误门禁**：提交前执行@RULES.md第158-180行检查脚本
- **Agent专业化**：Level S任务激活@RULES.md第236-265行对应Agent
- **24小时归档**：生成内容自动移入目标目录，更新frontmatter

## 禁止事项
- 不经查阅 `support_modules` 就地实现公共能力。
- 未经审批执行破坏性命令（`rm -rf`、`git reset --hard` 等）。
- 在未补前置 frontmatter、索引的情况下提交文档或脚本。
- 跳过测试或仅口头说明“已验证”而无日志佐证。

## 发布与回滚
- 发布前确认：代码通过 CI / 本地验证、文档索引已更新、业务/知识域已同步。
- 回滚策略必须写入 Summary，包含触发条件、操作命令、影响面评估。
- 若依赖外部服务或密钥，需在 `memory-bank/support_modules/dev/USEME.md` 记录使用说明与替代方案。
- 自动化脚本调整需同步 `scripts/` 与 `🧩 bmad`，保持工具链一致。

## 版本基线
- Node.js ≥ 18 / 22，Python ≥ 3.10，Shell 默认 `zsh`。
- MCP 服务需提前在 `~/.codex/config.toml` 配置；若需远程访问，记录代理与安全策略。
- 统一使用 `apply_patch` 修改文件；提交前运行适用的 lint / format 命令。
