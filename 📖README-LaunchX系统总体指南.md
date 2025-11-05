# 📖 LaunchX 系统总体指南

版本：2025-11-04 · 维护：Launch X Core
更新：新增Skills生态系统v2.4.0、Slack Hooks企业级集成、BMAD SubAgent军团v6.0详细说明

> 本指南提供根级视角的“看板”，说明组织使命、层级架构、核心流程、目录地图与引用关系。执行细节请参阅 `AGENTS.md`（Codex）与 `CLAUDE.md`（Claude Code），快速上下文请加载 `memory-bank/README.md`。

---
         Claude Code (协调中心)
                       ↓
  ┌─────────────────────────────────────────────────────────┐
  │              🎯 智能编排层 (Orchestration Layer)          │
  │  ┌─────────────────────────────────────────────────┐   │
  │  │     🔄 统一调度引擎 (Unified Dispatch Engine)     │   │
  │  │  - MCP ↔ Skills ↔ BMAD 双向通道                  │   │
  │  │  - 智能路由和负载均衡                             │   │
  │  │  - 资源池管理和优化                               │   │
  │  └─────────────────────────────────────────────────┘   │
  └─────────────────────────────────────────────────────────┘
             ↓                    ↓                    ↓
  ┌─────────────┐  ┌────────────────┐  ┌─────────────────┐
  │  MCP服务池   │  │   Skills生态    │  │  BMAD Agent军团  │
  │ (21个服务)   │  │ (专业能力库)     │  │ (执行协作网络)    │
  │ • 工具能力    │  │ • 垂直skills     │  │ • 专业agents     │
  │ • 数据访问    │  │ • 方法论skills   │  │ • 工作流引擎     │
  │ • 外部集成    │  │ • 系统级skills   │  │ • 融合agents     │
  └─────────────┘  └────────────────┘  └─────────────────┘
             ↓                    ↓                    ↓
  ┌─────────────────────────────────────────────────────────┐
  │            🎯 业务交付层 (Business Delivery)            │
  │    - 价值输出 | - 成果交付 | - 质量保障 | - 持续优化      │

  
## 1. 使命与三大核心能力体系
- **使命三线**：运营守正 / 智能沉淀 / 自动化提效。
- **三大核心能力**：
  | 能力维度 | 核心价值 | 覆盖领域 | 关键产出 |
  | --- | --- | --- | --- |
  | **🎯 判断能力** | 基于数据和经验做出准确判断 | 技术选型、系统决策、技能开发 | 架构方案、Agent路由、运维策略 |
  | **📈 趋势能力** | 识别、分析和预测趋势变化 | 深度研究、知识洞察、业务分析 | 研究报告、市场档案、客户洞察 |
  | **📋 结论能力** | 形成可执行结论和解决方案 | 工具开发、内容生成、系统指导 | 工具产品、AI内容、使用指南 |
- **协作闭环**：判断 → 趋势分析 → 结论形成 → 反馈优化
- **自动化引擎**：`🧩 bmad` 提供多智能体脚本、SOP、扩展能力，并与 Codex CLI 协同。

---

## 2. 指挥体系
| 层级 | 文档 | 作用 |
| --- | --- | --- |
| Root 指挥 | `AGENTS.md` | Codex CLI（执行端）守则：Phase 0、/spec→/plan→/do、工具策略 |
| 协作总览 | `CLAUDE.md` | Claude Code（协作端）总路标：命令速查、提示模板、文档地图、大型文件思维指南 |
| 外部记忆 | `memory-bank/README.md` | 平台快照、提示片段、跨仓技巧、重点项目 |
| 模块手册 | `memory-bank/support_modules/<domain>/USEME.md` | 公共能力、导入方式、示例、注意事项 |
| 目录指挥 | 各 Emoji 目录内 `CLAUDE.md` / `RULES.md` | 域内能力、禁区、回滚方案 |
| 方法论 | `🟣 knowledge/05_方法论中心/` | 判断/趋势/结论体系、AI Context 实施指南、提示词模板 |

更新流程：若结构、流程、工具发生变更，需同步本指南、`AGENTS.md`、`CLAUDE.md`、`memory-bank/README.md` 及相关 `memory-bank/support_modules/` 文档。

---

## 3. 协作流程概览
```
Phase 0：外部大脑 → 阅读指挥文档 & memory-bank → 确认资产
探索阶段：澄清目标/约束，构建 checklist
共识阶段：/spec 描述上下文与验收 → /plan 拆解步骤并标注引用
执行阶段：/do 严格按 plan 实施，使用 apply_patch 最小改动
验证与归档：测试结果、Summary、README 索引、memory-bank 更新
```

Checklist 和提示片段已固化在 `.cursorrules` 与 `memory-bank/README.md`，建议在 IDE 中启用。

---

## 4. 目录地图（根级）- 基于三大核心能力

### 目录分组与职责定位
```
指挥与配置
├── AGENTS.md / CLAUDE.md / RULES.md / 📖README      ← 根级指挥、约束、目录地图
├── 🛠️ 系统管理/                                   ← 运维决策、memory-bank 快照、配置脚本
└── .claude/                                        ← Claude 客户端配置

知识与研究
├── 🟣 knowledge/（含 05_方法论中心）                ← 方法论、知识资产、案例复盘
├── 🔬 Deep study/                                   ← 深度研究与文档型工具资源
├── study/                                          ← 实验草稿区（24h 内迁移）
└── 🤖 AI生成 auto-generated/                        ← AI 临时生成物（待处理区）

业务交付
└── 🚀 Launchx业务服务/                              ← 业务流程、客户方案、运营指标

技术执行
├── 💻 技术开发/                                    ← 项目代码、技术实现、测试脚本
└── support_modules/                                ← 可复用能力、公共 API

工具与自动化
├── 🧰 tools/                                        ← 工具库与脚手架（开发与业务皆可引用）
├── 🧠 Launch-X Skills生态系统/                     ← Claude Code 专属技能库（CC 调度）
└── 🧩 bmad/                                         ← Agent 协作逻辑参考与自动化脚本
```
> `🧰 tools/` 与 `🔬 Deep study/` 可作为跨域资源：前者提供工具/脚手架，后者沉淀研究方法与文档模板。`🧠 Launch-X Skills生态系统/` 为 Claude Code 调度的技能仓库，`🧩 bmad/` 同时承担系统逻辑参考与自动化工具角色。

子目录中需维护：`CLAUDE.md`、`RULES.md`、`memory-bank/support_modules/<domain>/USEME.md`，确保能力与约束清晰。

---

## 5.1 🧠 Launch-X Skills生态系统 (v2.5.0)
**目的**：提供专业化、可复用的AI技能，支撑复杂任务的标准化执行
**逻辑**：基于Reddit指南工程化实践，实现技能的渐进式披露、自动化激活和质量保障
**结构**：三层技能架构 + 自动化Hook系统 + 标准化管理

### 技能标准化要求 (2025-11-13更新)
**核心原则**：所有技能必须符合统一的标准化结构，确保质量一致性和可维护性。

**🏷️ 目录命名标准**
- **双语命名格式**：`中文技能名-English-Skill-Name`
- **标准化示例**：
  - `商业决策支持专家-Business-Decision-Support`
  - `Word文档处理器-Word-Document-Processor`
  - `认知策略大师-Cognitive-Strategy-Master`
- **管理工具**：`.claude/skills/skills-rename-mapping.json`

**📁 标准目录结构**
每个技能必须包含以下标准结构：
```
技能目录/
├── README.md              # 技能概述和快速入门
├── SKILL.md               # 技能详细说明（必需）
├── instructions.md        # 使用说明和操作指南
├── resources/             # 资源文件目录
│   ├── config.json        # 技能配置
│   ├── examples/          # 使用示例
│   └── templates/         # 模板文件
├── tests/                  # 测试目录
│   ├── test_cases.md      # 测试用例
│   └── expected_outputs/  # 预期输出
└── scripts/               # 脚本目录（可选）
```

**📋 SKILL.md文件标准**
- **frontmatter必须字段**：title, owners, status, last_update, version, category
- **内容结构**：技能概述、核心能力、使用方法、配置选项、最佳实践、技术规格
- **质量要求**：详细说明、完整示例、测试覆盖、格式一致

**🛠️ 质量保障工具**
- **标准检查**：`scripts/validate-skills-structure.sh`
- **重命名工具**：`scripts/skills-ecosystem-sync.sh`
- **生态系统管理**：`scripts/skills-manager.sh`

**📊 技能分类统计**
- **18个专业类别**：商业决策、企业研究、市场情报、知识管理等
- **35个标准技能**：全部符合双语命名和结构标准
- **动态管理**：支持技能创建、更新、删除的标准化流程

### 📋 实际部署文件统一性检查 (2025-11-13更新)

#### ✅ 部署状态总览
**标准合规性**: 100% - 所有技能符合统一标准化要求

**📁 目录结构统一性**
```
每个技能目录都包含标准结构：
├── README.md              ✅ 35个技能已创建
├── SKILL.md               ✅ 35个技能已存在
├── instructions.md        ✅ 35个技能已创建
├── resources/             ✅ 35个技能已标准化
│   ├── config.json        ✅ 配置文件统一
│   ├── examples/          ✅ 示例目录已创建
│   └── templates/         ✅ 模板目录已创建
├── tests/                  ✅ 35个技能已标准化
│   ├── test_cases.md      ✅ 测试用例已创建
│   └── expected_outputs/  ✅ 预期输出目录已创建
└── scripts/               ✅ 按需创建的脚本目录
```

**🏷️ 命名规范统一性**
- **双语命名格式**: `中文技能名-English-Skill-Name`
- **标准化示例**:
  - ✅ 商业决策支持专家-Business-Decision-Support
  - ✅ Word文档处理器-Word-Document-Processor
  - ✅ 认知策略大师-Cognitive-Strategy-Master
- **旧目录清理**: 所有重复的英文目录已删除

**📊 部署统计**
- **技能类别**: 18个专业类别 + 1个其他类别
- **标准技能**: 35个（全部符合双语命名）
- **部署状态**: 完全标准化
- **管理工具**: 4个自动化脚本

#### 🔍 统一性验证工具

**自动验证脚本**:
```bash
# 验证技能结构标准
./scripts/validate-skills-structure.sh

# 同步技能生态系统
./scripts/skills-ecosystem-sync.sh

# 管理技能生命周期
./scripts/skills-manager.sh
```

**配置文件统一性**:
- **映射文件**: `.claude/skills/skills-rename-mapping.json`
- **分类索引**: `.claude/skills/categories/README.md`
- **完成报告**: `.claude/skills/Skills生态系统标准化完成报告.md`

#### 🎯 质量保障机制
- **结构一致性**: 所有技能使用相同的目录结构模板
- **命名一致性**: 统一的双英双语命名规范
- **内容一致性**: 标准化的frontmatter和内容格式
- **功能一致性**: 统一的配置文件和测试用例格式

#### 📈 维护指南
1. **新增技能**: 使用标准模板创建，确保符合命名规范
2. **更新技能**: 保持结构完整性，同步更新映射文件
3. **质量检查**: 定期运行验证脚本确保标准合规性
4. **文档同步**: 及时更新README和索引文件

### 核心技能类别
- **Level 1 核心技能包**：商业决策支持、项目架构规划、技术设计专家 (自动加载，max 2000 tokens)
- **Level 2 专业扩展包**：企业研究分析、市场情报专家、知识管理大师 (按需加载，max 3000 tokens)
- **Level 3 高级专家包**：Gate-OS企业AI专家、深度学习专家、认知策略大师 (复杂任务专用，max 5000 tokens)

### 自动化Hook系统
- **技能渐进披露Hook**：`skills-progressive-disclosure/hook.js` - 智能技能加载与Token效率优化
- **用户交互Hook**：`user-interaction/hook.js` - 用户体验优化和交互流程管理
- **技能激活Hook**：`skill-activation/hook.js` - 技能自动激活和性能监控

### Reddit指南集成
- 工程基础设施优先：核心技能强制加载
- 可观测性 = 能力：全面的技能使用状态追踪
- 资产复用优先：智能检测技能复用机会
- 自动化强制执行：技能自动激活和质量门禁

---

## 5.2 🔗 Slack Hooks系统 (企业级集成)
**目的**：实现企业级工作流自动化，保障关键流程的质量和合规性
**逻辑**：基于Hook机制实现前置验证、过程监控、结果验证的完整质量闭环
**结构**：多层Hook架构 + 企业级监控

### 核心Hook组件
- **Dev Docs工作流Hook**：`dev-docs-workflow/hook.js` - 复杂任务自动创建三文件工作环境
- **AI代码审查Hook**：`user-interaction/ai-code-review-hook.js` - Reddit指南"让AI审查自己的代码"
- **文件编辑追踪Hook**：`file-edit-tracker/basic-error-check-hook.js` - 零错误遗漏机制实现
- **增量构建Hook**：`incremental-build-system/hook.js` - 自动化构建和质量检查

### 企业级监控 (PM2集成)
- **PM2监控Hook**：`pm2-monitoring/pm2-monitor.js` - 实时进程监控和系统健康检查
- **外部记忆加载器**：`pm2-monitoring/external-memory-loader.js` - 核心资产强制加载和完整性验证
- **资产复用验证器**：`pm2-monitoring/asset-reuse-validator.js` - 智能资产复用检测和优化建议

### 质量保障机制
- **前置验证**：操作前的质量检查和风险评估
- **过程监控**：任务执行中的实时状态追踪
- **结果验证**：输出结果的自动质量评估和合规检查
- **持续优化**：基于反馈的Hook能力提升和知识积累

---

## 5.3 🧩 BMAD SubAgent军团 (v6.0)
**目的**：提供企业级多智能体协作能力，实现复杂任务的分布式处理
**逻辑**：基于Reddit指南企业级Agent架构，实现智能调度、协作机制和知识增强
**结构**：Fusion架构 + SubAgent军团 + 专业协作模式

### 专业Agent类别
- **Level 1 核心专业Agent**：商业决策支持、项目架构、技术设计 (高频使用)
- **Level 2 专业分析Agent**：企业研究、市场情报、知识管理 (专业分析)
- **Level 3 高级系统Agent**：Gate-OS企业AI、深度学习、认知策略 (复杂任务)

### SubAgent协作模式
- **主从协作模式**：主Agent负责任务分解，从Agent执行具体子任务
- **并行协作模式**：多Agent同时处理不同方面，结果合并优化
- **链式协作模式**：Agent按序处理不同阶段，质量传递优化

### 智能调度系统
- **任务复杂度评估**：基于5维度指标（领域特异性、技术复杂度、协作需求、时间紧迫性、不确定性）
- **SubAgent选择策略**：简单任务单Agent、中等任务主从协作、复杂任务多Agent并行
- **资源优化调度**：Agent负载均衡、Token效率优化、质量优先原则

### 知识增强引擎
- **知识共享机制**：Agent间知识共享和经验积累
- **自适应学习**：基于任务反馈的Agent能力持续优化
- **协作历史**：Agent协作模式历史记录和优化建议

---

## 6. 三大核心能力流程链路

### 🎯 判断能力流程
```
需求分析 → 能力判断 → 技术选型 → 架构决策 → Agent路由 → 运维策略
↓
判断输出：技术方案、协作策略、系统架构
```

### 📈 趋势能力流程
```
信息收集 → 深度研究 → 趋势识别 → 洞察提取 → 市场分析 → 客户洞察
↓
趋势输出：研究报告、市场档案、投资框架、客户洞察
```

### 📋 结论能力流程
```
判断整合 → 趋势验证 → 方案设计 → 工具开发 → 内容生成 → 实现指导
↓
结论输出：工具产品、AI内容、系统指南、执行方案
```

### 🔄 协作闭环流程
- **知识流水线**：`01_Inbox → 02_分析与洞察 → 03_研究报告/07_市场项目档案/08_知识传播` → `09_周报月报`.
- **技术交付**：`00_开发计划 → 01_公司项目ing → 02/03 工具规范 → 04 成熟项目`，配合 /spec→/plan→/do 流程与测试脚本。
- **业务交付**：`Ⅰ_待处理信息 → Ⅱ_对外业务 → Ⅲ_公司运营`，成果同步到各能力域。
- **自动化闭环**：`🧩 bmad` 脚本 → 执行日志 → README/计划/方法论 回写。

所有流程均需在 Summary 中汇报 `Summary / Testing / Next Steps`，并标注上下文资产是否更新。

---

## 7. 工具与脚本提示
- **MCP 预热**：`bash scripts/mcp-prewarm.sh`
- **环境校验**（若存在）：`bash scripts/validate-ai-context.sh`
- **静态检查**（建议实现）：`check-no-barrel-imports`、`check-duplicate-utils`、`check-ssr-dangerous-api`
- **Node 项目**：`npm install`、`npm run validate`、`npm run test`
- **Python 项目**：`python -m venv venv && source venv/bin/activate`、`pip install -r requirements.txt`、`pytest`

执行后需在 Summary 记录命令与结果；若脚本缺失或失败，需创建 TODO 跟进。

---

## 8. 维护与责任
- **每日**：清理 `🤖 AI生成 auto-generated/`、更新周报/README、检查 pending TODO。
- **每周一**：复查计划与遗留项，迁移必要任务；同步 `🟣 knowledge/09_周报月报`。
- **定期**：备份 `🧩 bmad`，校验 frontmatter/索引，确认 MCP 配置有效，验证自动化脚本。
- **变更管理**：涉及架构/流程/数据流时，先在 Summary 提案（含风险与回滚），经确认后执行。

---

## 9. 信息来源与输出颗粒度指南
| 类型 / 目录 | 信息来源优先级 | 主要输出形态 | AI / 外部资料使用策略 |
| --- | --- | --- | --- |
| 根级指挥文档（`AGENTS.md`、`CLAUDE.md`、`RULES.md`、本指南、`🛠️ 系统管理/memory-bank/README.md`） | 内部流程复盘 > 外部最佳实践 | Guardrails、流程、Checklist | 外部资料仅作对照，必须结合本地事实并标注来源 |
| `🛠️ 系统管理/`、`memory-bank/` 配置类文档 | 实际环境状态 > 历史记录 | 配置快照、运维指引 | 禁止臆测；外部资料仅可链接官方文档 |
| `🟣 knowledge/05_方法论中心` | 本地案例与复盘 | 策略、方法论、衡量指标（无代码） | 不得凭空生成；若缺案例以 `TODO｜待补充 + 缺口来源` 标注，外部资料仅作补充对照 |
| `🟣 knowledge` 其他研究 / `🔬 Deep study` | 内部数据 + 验证过的外部情报 | 研究报告、情报分析 | 外部来源必须注明出处与差异点 |
| `🚀 Launchx业务服务` | 内部业务流程 / 客户案例 | SOP、方案、运营指标 | 外部信息仅作 benchmark，需标注来源 |
| 技术执行类（`💻 技术开发/`、`🧰 tools/`、`support_modules/`） | 本仓代码、脚本 | 代码、测试、命令、回滚策略 | 可借鉴外部实现，但需 `/spec` 评估并转化为本地代码、注明来源 |
| 自动化协作（`🧩 bmad/`、`🧠 Launch-X Skills生态系统/`） | 本地脚本、技能定义 | Agent 计划、技能模板、执行日志 | Claude 优先调度；外部资料仅用于优化提示或策略，需记录验证 |
| 学习实验（`study/`、`🤖 AI生成 auto-generated/`） | 草稿 / 实验数据 | 临时记录、草稿 | `🤖 AI生成` 为暂存区，24h 内迁移或删除；引用前需转入正式目录 |

> **示例**：`🟣 knowledge/05_方法论中心` 仅记录已经在仓库落地的案例和方法，禁止引入外部推测或代码实现；若缺少支撑案例，以 `TODO｜待补充 + 缺口来源` 明确责任人与补充计划。

---

## 10. 指挥文档分层提示
- 根级：`AGENTS.md` 提供任务路由与最小执行要求；`CLAUDE.md` 面向分析与调度；`RULES.md` 汇总硬性禁令与必须遵守事项；本指南负责目录地图与信息来源指引。  
- 域级：各目录下的 `CLAUDE.md` / `AGENTS.md` / `RULES.md` / `USEME.md` 承载域专属能力、约束与回滚策略，仅在任务涉及该域时加载。  
- 执行流程：通常流程为 `AGENTS.md` 定级 → 参阅本指南定位目录 → 加载目标域文档 → 使用 `support_modules`、`🧩 bmad`、Skills 等资产完成任务。

---

## 11. 目录配套文件约定
| 目录 | 必备文件 | 内容要求 | 备注 / 更新入口 |
| --- | --- | --- | --- |
| `/` 根目录 | `AGENTS.md`、`CLAUDE.md`、`RULES.md`、本指南 | 指挥总则、协作路标、硬性约束、目录地图；以本地流程与事实为准 | 修改需同步四个文件，并在 Summary 标注 |
| `🛠️ 系统管理/` | `README.md`、`memory-bank/README.md`、`support_modules/<domain>/USEME.md` | 运维快照、常用命令、可复用能力；记录实际环境状态与回滚策略 | 变更环境时优先更新 `memory-bank`，再更新此表 |
| `🟣 knowledge/` | `README.md`、`AGENTS.md`、`CLAUDE.md`、`RULES.md` | 知识生产流程、AI 写作约束、审核标准 | 外部资料仅作参考，需注明来源；方法论类文件以本地案例为准 |
| `🟣 knowledge/05_方法论中心/` | `README.md`、`RULES.md`（若存在） | 仅记录落地案例沉淀的策略 / 指标；禁止加入代码实现 | 缺案例时以 TODO 标注责任人，待补后更新 |
| `💻 技术开发/` | 目录 `README.md`、子域 `USEME.md`、执行脚本说明 | 代码、测试、命令、回滚方案，必须经过 `/spec` 评估 | 若引用外部方案需注明来源并写入验证步骤 |
| `🧩 bmad/` | `README.md`、Agent 说明文档、执行日志 | 多 Agent 编排、自动化 SOP；记录执行风险与回滚 | Claude 调用后必须回写日志；变更脚本同步 `support_modules` |
| `🧠 Launch-X Skills生态系统/` | `README.md`、`AGENTS.md`、技能模板 | 技能定义、调用示例、质量标准；保持与 Claude 指挥一致 | 新增/调整技能需同步 `CLAUDE.md` 的工具表 |
| `🚀 Launchx业务服务/` | 目录 `README.md`、业务 SOP、案例归档 | 业务流程、客户方案、指标；外部信息仅作 benchmark | 变更需同步相关方法论或研究文档 |
| `🧰 tools/` | 工具库 `README.md`、使用说明、CI 配置 | 工具定位、安装/使用步骤、维护责任 | 发布新工具时补充验证与回滚指南 |
| `study/` | `README.md`（若有） | 实验/草稿区，无需正式结构；引用前需迁出 | 24 小时内清理或迁移到目标目录 |
| `🤖 AI生成 auto-generated/` | 目录结构文档（若存在） | 临时存放 AI 生成物；必须标注来源与处理状态 | 24 小时内迁移到正式目录或删除 |

> 更新对应目录内容时，请遵循此表：先定位必备文件，按照列出的内容要求补齐或修改，并同步在 Summary 中说明影响范围。

---

保持以上指引同步更新，可确保 LaunchX 的分析端与执行端在同一体系下协同运行，实现“外部大脑 + 标准流程 + 复用优先”的协作目标。***
