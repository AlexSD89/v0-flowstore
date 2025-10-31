# RULES.md · LaunchX 协作规则

最后更新：2025-10-27
生效范围：全体 AI 协作者（Claude Code、Codex CLI）

> 黄金法则：把 AI 当作"天赋卓绝但失忆的合作者"。我们负责搭建外部记忆与清晰任务清单，让它先复用已有能力，再去实现新增需求。

---

## 🚫 绝对禁止 (Hard Constraints)

### 内容生成禁止项
- **禁止臆想内容**：不生成没有事实依据的内容、数据、案例、指标
- **禁止编造信息**：不为"完整"而虚构段落、统计数据或引用
- **必须标注缺口**：无依据内容必须标注"待补充"并说明缺口来源

### 工作流程禁止项
- **禁止整段复制文件**：必须指向具体函数或行号（例：`src/main.py:L15-L30`）
- **禁止跳过计划阶段**：需求与架构未确认前不得直接实现系统
- **禁止省略测试验证**：所有改动必须提供最小化验证结果
- **禁止重复造轮子**：必须复用 `memory-bank/support_modules/*/USEME.md` 中的现有能力

---

## ✅ 必须遵守 (Mandatory Requirements)

### Phase 0 必做清单
1. **先读根目录 CLAUDE.md** – 获取全局规范、命令速查、流程指引
2. **再读相关包的 USEME.md** – 了解模块能力、导入方式与常见陷阱
3. **优先复用 support_modules** – 避免重复造轮子，引用现有实现
4. **禁止 barrel 导入** – 所有导入必须指向具体文件路径
5. **涉及 UA/SSR/性能** – 首先查阅 `common-ua`、`common-react-hooks`、`common-util`

### 标准工作流程
所有任务必须遵循 `/spec → /plan → /do` 流程：

- **`/spec` 阶段**：仅改动 `specs/` 文档，写清上下文、验收标准、引用的 `USEME.md`/`RULES.md`
- **`/plan` 阶段**：拆解 approved spec，标注所需资产（文档/脚本/测试命令），等待用户确认
- **`/do` 阶段**：严格按 plan 执行，使用 `apply_patch` 做最小改动；范围变化需回退至 `/plan` 或 `/spec`

### 输出格式要求
- **Summary 模板**：必须使用 `Summary / Testing / Next Steps` 格式
- **Checklist 驱动**：所有需求一律先输出 checklist，逐项确认输入、依赖、测试、引用对象
- **文件引用规范**：引用文件必须使用 `path:line` 格式并说明用途

---

## ⚠️ 环境约束 (Environmental Constraints)

### 技术栈限制
- **运行环境**：macOS 13+，Node.js 18+/22+，Python 3.10+；路径默认 `/opt/homebrew/bin`
- **包管理**：pnpm + monorepo 项目，禁止 barrel 导入
- **代码修改**：所有文件改动必须使用 `apply_patch`

### MCP 配置要求
- **17个标准MCP服务**：fetch、firecrawl、jina、hotnews、tavily、workspace-filesystem、shadcn-ui、playwright、context7、git-local、filesystem-shtse、gemini-cli、ant-design、rube、chrome-devtools、web-search-prime、zai-mcp-server
- **配置位置**：需在 `~/.codex/config.toml` 或项目 `.claude/mcp.json` 声明
- **远程MCP**：需代理方案，必须在 Summary 中说明风险和使用目的
- **预热流程**：首次或依赖更新后运行 `bash scripts/mcp-prewarm.sh` 预热常用服务
- **多模态处理**：使用zai-mcp-server处理图片/视频内容，chrome-devtools执行页面操作

### 权限与安全
- 涉及权限或写操作的任务需在 `/spec` 说明目标 profile 与 sandbox 约束
- 配置文件修改必须说明回滚策略
- 关键依赖缺失或安全风险需立即在 Summary 标记并建议人工介入

---

## 📋 质量保障 (Quality Assurance)

### 测试验证要求
- **最小化测试**：所有改动必须提供验证结果，说明验证方式
- **环境差异处理**：macOS 默认路径 `/opt/homebrew/bin`；依赖缺失需在 `USEME.md` 写明安装方式
- **失败处理**：命令失败时保留关键输出并给出下一步假设

### 文档归档要求
- **命名规范**：采用 `YYYYMMDD-主题.md` 格式
- **Frontmatter 完整**：必须包含 `title/owners/status/last_update/related/source/impact`
- **24小时归档**：所有生成内容先进入 `🤖 AI生成 auto-generated/YYYYMMDD/`，24h 内迁移至目标目录
- **索引更新**：生成文档后务必更新相关 README 的索引锚点
- **目录策略**：编写和更新文档时，需遵循 `📖README-LaunchX系统总体指南.md` 中“信息来源与输出颗粒度指南”的目录规则
- **AI生成标注**：frontmatter中必须标注"自动生成"或"人工采集"
- **引用闭环**：新增文档需在相关README建立索引，被引用文档需注明"引用于路径"

### AI生成文件规范
- **生成位置**：所有AI生成内容必须首先存放在 `🤖 AI生成 auto-generated/YYYYMMDD/<slug>/`
- **目录结构**：
  ```
  🤖 AI生成 auto-generated/
  ├── YYYYMMDD/
  │   ├── <slug>/
  │   │   ├── spec.md        # 需求规格
  │   │   ├── plan.md       # 执行计划
  │   │   ├── deliverable.md # 交付物
  │   │   └── assets/        # 附件资源
  │   └── other-projects/
  ```
- **质量审核**：AI生成内容必须经过质量审查后才能迁移至目标目录
- **版本管理**：每次生成都需要更新frontmatter的last_update字段
- **关联维护**：生成文档后必须更新相关文档的引用关系

### 文件类型与目标映射
- **业务相关** → `🚀 Launchx业务服务/`
- **研究分析** → `🔬 Deep study/`
- **知识生产** → `🟣 knowledge/`
- **技术开发** → `💻 技术开发/`
- **设计资源** → `🎨 设计资源库/`
- **工具文档** → `🧰 tools/`
- **系统管理** → `🛠️ 系统管理/`
- **BMAD系统** → `🧩 bmad/`
- **Skills生态** → `🧠 Launch-X Skills生态系统/`

### 二级规则文件生成标准
- **模板遵循**：必须遵循根目录CLAUDE.md中的域文档模板
- **规范继承**：必须继承根文档的核心规范和质量标准
- **领域扩展**：可根据域特性扩展专门规范，但不能与根规范冲突
- **术语一致**：必须使用统一的术语体系和表达方式
- **格式统一**：文档结构、frontmatter、代码格式必须保持一致

### 系统逻辑语言规范
- **主要逻辑语言**：系统逻辑和思维过程使用中文表达
- **技术术语处理**：技术术语保持英文原词，首次出现时括号标注中文解释
- **代码注释语言**：代码注释使用英文，遵循国际开发规范
- **文档输出语言**：
  - **用户交互**：优先使用中文，确保用户理解
  - **技术文档**：可使用英文，确保技术准确性
  - **API文档**：标准英文格式，便于国际化使用
  - **代码注释**：统一使用英文

### 输出语言策略
- **面向用户的内容**：使用中文表达，专业术语保持英文并加中文解释
- **技术实现内容**：代码使用英文，注释用英文，技术文档用中文
- **学术研究内容**：遵循英文学术写作规范，总结用中文
- **业务分析内容**：中文表达为主，关键指标和术语保持英文

#### 语言混合示例
```markdown
## 技术架构设计

采用React框架进行前端开发，结合Redux进行状态管理。
后端使用Node.js + Express搭建RESTful API服务。

### 核心技术栈
- **前端**：React 18 + TypeScript + Tailwind CSS
- **后端**：Node.js 18 + Express + PostgreSQL
- **部署**：Docker + Kubernetes + AWS ECS

### 开发流程
实现CI/CD（持续集成/持续部署）流程，
配置CDN（内容分发网络）加速静态资源访问，
遵循SOLID原则进行面向对象设计。
```

### 代码质量约束
- **静态检查**：建议检测 barrel 导入、重复实现、危险 SSR API
- **绝对路径导入**：所有导入必须指向具体文件，禁止相对路径的 barrel 导入
- **复用优先**：必须检查项目内已有 API 是否可复用

---

## 🔄 协同规则 (Collaboration Rules)

### Claude vs Codex 协作边界
- **Claude专属能力**：Skills SDK、BMAD协作、5通道搜索、智能任务路由、AI内容生成
- **Codex执行能力**：代码实现、系统操作、部署运维、数据库操作
- **协作模式**：Claude设计策略 → Codex执行实现 → Claude质量验收

### 跨仓协作
- **文档地图**：通过根级 `CLAUDE.md` 的9大核心域导航定位目标域
- **公共库优先**：公共库的 `USEME.md` 对业务代码具有更高优先级；如发现冲突，须先更新公共库
- **层级检查**：若为 monorepo 子仓库，向上查看父仓库与 `support_modules` 的指导文件

### 与 Codex AGENTS.md 协同
- **职责对照**：`AGENTS.md` 管控硬性流程（技术栈、脚本、验收阈值），本文件聚焦协作规则
- **冲突处理**：当两处涉及同一主题时，以 `AGENTS.md` 规则为准，并在 Summary 中提醒双方同步
- **Profile 声明**：若依赖特定 profile，需在提示语显式声明，例如：`当前对话使用 profiles.production（sandbox_mode=restricted）`

### Claude Skills 使用规范
- **技能调用**：使用 `/skill <skill-name> "任务描述"` 格式调用标准技能
- **12项标准技能**：business-decision-support、enterprise-research-analyst、market-intelligence-expert、knowledge-master、academic-researcher、data-analyst、trend-researcher、code-reviewer、test-writer-fixer、performance-benchmarker等
- **生态协同**：Skills作为原子能力，Agent SDK负责高级编排，两者互补而非替代

---

## 🎯 Claude专属行为规范

### Claude能力边界规则
- **专属能力范围**：Skills SDK、BMAD协作、5通道搜索、智能分析、复杂推理
- **禁止越界行为**：不得执行具体的代码实现、系统操作、部署运维
- **协作要求**：需要Codex执行的任务必须明确交接和指导

### Claude质量保障标准
- **理解准确率**：≥95%（需求理解和方案设计）
- **分析深度**：≥90%（洞察提取和关联分析）
- **方案可行性**：≥85%（技术方案的可执行性）
- **知识创新性**：≥80%（新洞察和价值创造）

### Claude工作流规范
- **Phase 0强制执行**：每次任务开始前必须完成认知加载
- **自我审查机制**：所有输出必须经过逻辑、事实、完整性、价值性审查
- **知识沉淀要求**：有价值的经验必须转化为方法论并存储
- **持续学习义务**：基于反馈持续优化协作模式和能力

### Claude Skills使用规范
- **技能调用格式**：`/skill <skill-name> "任务描述"`
- **技能分类使用**：
  - 商业智能类：business-decision-support、enterprise-research-analyst、market-intelligence-expert
  - 知识处理类：knowledge-master、academic-researcher、data-analyst
  - 技术能力类：code-reviewer、test-writer-fixer、performance-benchmarker
  - 综合分析类：trend-researcher、content-strategist
- **质量标准**：技能使用后必须评估效果并记录

### BMAD协作规范
- **Agent路由规则**：基于任务类型自动匹配最优Agent组合
- **协作效率要求**：3.5x-5.0x协作效率提升
- **质量保障机制**：95%+多轮质量检查与自动修复
- **结果整合标准**：Claude必须对Agent输出进行质量审查和整合

---

## 🚨 反模式处理 (Anti-Patterns)

### Claude专属反模式
| 反模式 | 纠正措施 |
| --- | --- |
| 能力越界：执行Codex专属任务 | 立即停止，明确任务边界 |
| 跳过认知加载：直接开始执行 | 强制执行Phase 0认知加载 |
| 质量审查缺失：输出无验证 | 必须完成自我质量审查 |
| 知识不沉淀：有价值经验未记录 | 强制转化为方法论存储 |

### 通用反模式
| 反模式 | 纠正措施 |
| --- | --- |
| 上下文失配：未加载 `memory-bank` 或目录 `USEME.md` | 先跑 `fd/rg/sg` 搜索现成能力 |
| Checklist 缺失：直接说"帮我写 XX 功能" | 需先列 checklist，再逐项执行 |
| spec/plan/do 混用：跳过 `/plan` 直接改代码 | 强制回滚至计划阶段确认 |
| 测试遗漏：未运行最小测试或未附验证结果 | Summary 中必须列出测试命令与结论 |
| 引用丢失：生成内容未在 README 建链接 | 需立即补齐以保证追溯 |

### 处罚机制
- 发现反模式立即停止当前任务
- 回退到 `/spec` 或 `/plan` 阶段重新确认
- 在 `memory-bank/` 记录该案例及修正方式
- 必要时建议人工介入

---

## 📚 引用与扩展

### 相关文档
- **指挥总则**：`AGENTS.md` - 硬性流程、技术栈、验收阈值
- **协作路标**：`CLAUDE.md` - 软性协作、提示范式、命令速查
- **项目快照**：`memory-bank/README.md` - 平台架构、常用命令、重点项目
- **能力地图**：各目录 `USEME.md` - 具体能力、调用示例、常见陷阱

### 更新机制
- 当依赖版本、MCP 接口或目录结构调整时，必须同步更新相关文档
- 新增流程或工具时，先在根 README 记录定位，再同步更新相关文档
- 所有制度、脚本、方法论更新后需同时刷新仓库索引

---

**遵循以上规则，确保 AI 在 LaunchX monorepo 中安全、高效地复用既有能力并实现高质量交付。**
