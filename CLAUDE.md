---
title: "LaunchX Claude 协作路标"
owners:
  - Launch X Claude Team
status: active
last_update: 2025-11-03
related:
  - AGENTS.md
  - 📖README-LaunchX系统总体指南.md
  - 🛠️ 系统管理/memory-bank/README.md
source: 自动生成（Claude Code + AI增强）
impact: high
---

# CLAUDE.md · LaunchX Claude 协作路标

> Claude Code = 深度分析与决策中枢。所有产出必须以复用资产、减少实现成本、守住质量门槛为第一目标。

> **黄金法则**：把 Claude Code 看成"天赋卓绝但失忆的合作者"。我们负责搭建外部记忆、Checklist 与 guardrails，让它先复用，再实现。
> **工程化原则**：用工程基础设施强制执行质量标准，确保零错误遗漏，而不是寄希望于提示词技巧。

---

## 核心原则（Claude 专用提示）
- **定位**：Claude Code 是 LaunchX 的深度分析决策中枢——负责拆解需求、设计方案、识别风险、生成知识指引，优先复用资产减少实现成本。
- **边界**：遇到实现、部署、系统操作等任务，必须提供清晰指令、风险与验证提示，可交接给专业化Agent处理。
- **外部记忆系统**：把Claude视为"失忆但优秀的同事"，我们负责搭建完备的外部记忆（CLAUDE.md、RULES.md、memory-bank、support_modules）。
- **上下文加载优先级**：根级CLAUDE.md → AGENTS.md → 目标域README/USEME → RULES.md → 生成/spec或/plan。
- **复用优先原则**：任何建议都要先检索现有资产（`rg`/`fd` + memory-bank）；在方案中明确引用来源与复用策略。
- **评测驱动**：输出前先思考"如何验证"——优先复用/编写评测脚本，坚持"先评测后放量"。
- **Checklist驱动协作**：使用结构化checklist模板，确保关键节点不遗漏，支持Summary标准化回传。

---

## 1. 快速开始（命令速查）

### LaunchX工作流 + Reddit工程化质量门禁
| 预热 MCP | `bash scripts/mcp-prewarm.sh` | 全局 |
| 检查 MCP 状态 | `claude mcp list` | 全局 |
| 任务复杂度评估 | 根据关键词自动判断 | 启动时 |
| Level S/M项目 | 创建plan.md/context.md/tasks.md | 强制 |
| 质量检查 | TypeScript编译+Lint | 关键节点强制 |
| Node 项目 | `npm install && npm run validate && npm run test` | 标准 |
| Python 项目 | `python -m venv venv && pip install -r requirements.txt && pytest` | 标准 |

> **执行原则**：所有改动使用 `apply_patch`；每条 `shell` 前说明目的，完成后"确认 + 结果/下一步"。
>
> **工程化原则**：关键节点强制质量检查，零错误交付，不寄希望于人工提醒。

> **资产管理**：所有生成内容先进入 `🤖 AI生成 auto-generated/` → 校对 → 24h内归档至目标目录。

### 1.1 提示词模板（最小上下文）
在与 Claude Code 协作时，推荐附上以下精简提示：

```
你在一个 LaunchX 项目中工作，遵循工程化方法论。
先读根目录 CLAUDE.md → AGENTS.md → 目标域README/USEME → RULES.md。
优先复用 support_modules 下的能力；禁止 barrel 导入，必须使用具体文件路径。
Level M/S任务必须创建三文件系统：plan.md/context.md/tasks.md作为需求容器。
关键节点必须通过零错误质量检查：TypeScript编译=0错误，Lint=100%通过。
使用Checklist驱动协作，确保Summary标准化回传。
```

### 1.2 跨域协作规则
- **优先级层次**：AGENTS.md（硬性流程）→ CLAUDE.md（协作指导）→ RULES.md（执行标准）→ 域级指南
- **冲突解决**：如发现规则冲突，以更高层级为准并同步更新
- **五大核心域**：技术开发、知识生产、业务交付、深研案例、设计系统，每个域都有独立的CLAUDE.md和RULES.md
- **专业化Agent激活**：Level S/M任务自动激活对应域的专业化Agent，Level L任务由基础能力直接处理

---

## 2. Monorepo 概览（包清单 + USEME 路径）

| 领域 | 目录 | 指南文件 |
| --- | --- | --- |
| 核心指挥 | 根目录 | 指挥总则文档 · `memory-bank/README.md` |
| 技术开发 | `💻 技术开发/` | `💻 技术开发/CLAUDE.md`、`RULES.md` |
| 知识生产 | `🟣 knowledge/` | `🟣 knowledge/CLAUDE.md` |
| 业务交付 | `🚀 Launchx业务服务/` | `🚀 Launchx业务服务/CLAUDE.md`、`RULES.md` |
| 深研案例 | `🔬 Deep study/` | 研究方法论与案例 |
| 设计系统 | `🎨 设计美学资源库/` | 设计规范与资产 |
| 自动化实验室 | `🧩 bmad/` | 自动化脚本与工具 |
| 需求与计划 | `specs/`、`plans/` | 模板内置于目录 |

> **文档引用优先级**：AGENTS.md（硬性流程）→ CLAUDE.md（协作指导）→ RULES.md（执行标准）→ 域级指南

---

## 3. LaunchX三大工作路集（Reddit工程化优化）

### Reddit工程化：三文件需求承载系统

**核心思想**：用标准化三文件结构化承载需求信息，保持LaunchX原有工作流程

| LaunchX流程 | 承载文件 | 存储内容 |
| --- | --- | --- |
| **Collect → Model** | plan.md | 项目目标、成功指标、交付战略 |
| **Model → Compare** | context.md | 环境分析、资产复用、约束条件 |
| **Align → Deliver → Archive** | tasks.md | 任务分解、验收标准、交付清单 |

### 三文件需求承载模板

**plan.md - 承载Collect→Model阶段需求**
```markdown
# 项目需求规划 - [项目名称]

## Collect阶段收集的信息
- [ ] 用户原始需求描述
- [ ] 业务背景和痛点
- [ ] 预期价值和收益

## Model阶段的建模输出
- [ ] 解决方案架构
- [ ] 技术选型理由
- [ ] 实施范围界定
- [ ] 成功度量标准

## Level M/S要求
- [ ] 需求完整性确认
- [ ] 技术可行性验证
- [ ] 资源投入评估
```

**context.md - 承载Model→Compare阶段分析**
```markdown
# 项目上下文分析 - [项目名称]

## 环境和约束分析
- [ ] 技术栈兼容性
- [ ] 现有系统集成点
- [ ] 团队能力匹配度
- [ ] 时间和预算限制

## 资产复用调研
- [ ] memory-bank可复用模块
- [ ] 已有组件和工具
- [ ] 外部依赖评估
- [ ] 知识库相关资料

## Compare阶段对比基准
- [ ] 替代方案分析
- [ ] 技术路径对比
- [ ] 风险收益评估
```

**tasks.md - 承载Align→Deliver→Archive阶段执行**
```markdown
# 项目执行任务 - [项目名称]

## Align阶段对齐任务
- [ ] 团队分工确认
- [ ] 交付标准对齐
- [ ] 验收方式定义

## Deliver阶段交付任务
- [ ] 核心功能开发（负责人：XXX）
- [ ] 测试验证执行（负责人：XXX）
- [ ] 文档撰写完成（负责人：XXX）

## Archive阶段归档任务
- [ ] README更新
- [ ] memory-bank同步
- [ ] 经验总结归档
- [ ] 索引链接维护
```

### LaunchX工作流程与三文件承载关系

```
LaunchX原有工作流程（保持不变）
        ↓
Collect → Model → Compare → Align → Deliver → Archive
        ↓                ↓                ↓
      plan.md        context.md        tasks.md
      (承载需求)      (承载分析)        (承载执行)
```

### 认知负荷管理（根据任务复杂度动态调整）

**Level L任务（简单）**
- Phase 0：1-8项基础检查
- 三文件：简化模板，快速填写

**Level M任务（中等）**
- Phase 0：10-15项标准检查
- 三文件：标准模板，完整填写

**Level S任务（复杂）**
- Phase 0：20-25项深度检查
- 三文件：增强模板 + 风险管理附录

```bash
# 关键节点零错误检查（Level M/S强制）
critical_quality_check() {
  # TypeScript编译错误必须为0
  if ! npx tsc --noEmit; then
    echo "🚫 TypeScript编译失败，拒绝继续"
    return 1
  fi

  # 代码格式检查必须100%通过
  if ! npm run lint --silent; then
    echo "🚫 代码格式不合规，拒绝继续"
    return 1
  fi

  echo "✅ 质量门禁通过"
}
```

### Claude Code + MCP工具集成（每个路集的具体工具）

**路集1工具配置**
```bash
# 规划阶段MCP工具组合
collect_assets() {
  # 搜索现有资产
  mcp_search "相关项目" "历史方案" "最佳实践"

  # 数据收集和分析
  mcp_tavily "市场数据" "竞品分析" "行业报告"

  # 生成规划文档
  mcp_write plan.md context.md
}
```

**路集2工具配置**
```bash
# 执行阶段MCP工具组合
execute_delivery() {
  # 代码生成和优化
  mcp_code_generation "根据tasks.md生成代码"

  # 测试执行
  mcp_test_runner "自动化测试" "性能测试"

  # 部署验证
  mcp_deploy_check "预发布验证" "生产部署"
}
```

**路集3工具配置**
```bash
# 归档阶段MCP工具组合
archive_results() {
  # 自动生成文档
  mcp_doc_generator "API文档" "用户手册"

  # 更新索引
  mcp_index_update "README" "知识库索引"

  # 经验总结
  mcp_knowledge_extract "最佳实践" "经验总结"
}
```

---

## 4. AI 协作规范（Do / Don't）

### Do ✅ 核心要求
- **Phase 0启动**：按优先级加载CLAUDE.md → AGENTS.md → 目标域README/USEME → RULES.md
- **任务复杂度自动判断**：基于关键词、文件路径、内容模式自动识别Level S/M/L
- **三文件需求承载**：Level M/S任务必须创建plan.md/context.md/tasks.md作为需求容器
- **零错误质量门禁**：关键节点强制TypeScript编译=0错误，Lint=100%通过，失败则拒绝执行
- **外部记忆复用优先**：优先使用memory-bank和support_modules，禁止重复造轮子
- **绝对路径导入**：禁止barrel导入，必须指向具体文件
- **Checklist驱动协作**：使用结构化checklist确保关键节点不遗漏
- **Summary标准化回传**：使用Summary / Testing / Next Steps模板确保信息闭环
- **验证闭环**：每次改动提供验证结果，更新相关README和索引

### Don't ❌ 严格禁止
- **跳过Phase 0**：未按优先级加载指南文档直接开始任务
- **绕过质量门禁**：检查失败时继续执行
- **缺失Dev Docs**：Level M/S任务没有完整的三文件需求承载系统
- **草稿不归档**：生成内容24小时内未迁移至目标目录
- **破坏性命令未经审批**：执行`rm -rf`、`git reset --hard`等危险操作
- **重复实现公共能力**：未检查support_modules就地开发

### 📚 深度方法论参考
详见：`🟣 knowledge/05_方法论中心/LaunchX_工程化方法论.md`

---

## 5. 常见坑与解决方案

### 🚫 重大风险（强制规避）
- **质量门禁绕过**：任何情况下都不能跳过零错误检查
- **Dev Docs缺失**：Level M/S任务没有完整的三文件系统
- **重复实现**：未检查support_modules就地开发

### ⚠️ 常见问题
- **上下文不足**：未充分加载相关文档 → 重复工作或错误方向
- **归档延迟**：生成内容未及时归档 → 知识资产丢失

### 💡 最佳实践
- **渐进式提升**：从基础标准逐步提升到卓越工程`

---

## 6. 版本与环境管理

### 🖥️ 运行环境
- **基础环境**：macOS 13+，Node.js 18+/22+，Python 3.10+
- **工程化工具**：Docker、Git、TypeScript、ESLint、Prettier
- **MCP配置**：`~/.claude/settings.json` 配置环境变量，MCP服务器通过 `claude mcp add` 管理

### 📦 包管理策略
- **Node.js项目**：`npm install && npm run validate && npm run test`
- **Python项目**：`python -m venv venv && pip install -r requirements.txt && pytest`
- **自动化脚本**：`🧩 bmad`统一管理，版本化依赖配置

---

## 总结：LaunchX工程化方法论融合要点

### 🎯 三大融合原则
1. **保持原有优雅架构**：LaunchX的Collect→Model→Compare→Align→Deliver→Archive工作流程不变
2. **三文件需求承载系统**：plan.md/context.md/tasks.md作为结构化容器承载各阶段需求信息，而非工作流替代
3. **外部记忆系统**：把Claude视为"失忆但优秀的同事"，构建完备的外部记忆和Checklist驱动协作
4. **关键节点零错误门禁**：用工程基础设施强制执行质量标准，确保零错误遗漏

### 💡 Claude Code实践指导
- **启动时**：按优先级加载文档，自动评估任务复杂度，Level M/S必须创建三文件需求承载系统
- **执行时**：三文件承载需求信息，专业化Agent处理复杂任务，保持原有工作流程
- **质量检查**：关键节点强制TypeScript编译=0错误，Lint=100%通过，失败则拒绝执行
- **Level L任务**：使用简化流程，快速处理，避免过度工程化

### 🔧 工程化四大核心系统
1. **技能自动激活系统**：基于关键词、文件路径、内容模式自动识别并激活对应专业技能
2. **Dev Docs三文件工作流**：标准化需求承载容器，支持动态认知负荷管理
3. **零错误质量门禁系统**：关键节点强制检查，TypeScript编译=0错误，代码质量100%通过
4. **专业化Agent配置系统**：Level S/M任务自动激活对应域专家Agent，Level L任务基础能力处理

### 📋 实践检查清单
- [ ] 理解外部记忆系统：CLAUDE.md + AGENTS.md + RULES.md + memory-bank + support_modules
- [ ] 掌握三文件需求承载：plan.md（战略）+ context.md（分析）+ tasks.md（执行）
- [ ] 熟练零错误质量门禁：TypeScript编译检查 + 代码格式检查 + 测试验证
- [ ] 应用Checklist驱动协作：结构化模板 + Summary标准化回传 + 信息闭环
- [ ] 专业化Agent协作：复杂任务自动激活专家Agent，简单任务基础能力处理

