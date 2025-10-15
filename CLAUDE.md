# CLAUDE.md · LaunchX 总路标

最后更新：2025-10-11  
参考：[@jserTang《让 AI coding 不再就近解决：如何在 monorepo 中建设 AI context》](https://juejin.cn/post/7540102683178123290)

> 黄金法则：把 Claude Code 看成“天赋卓绝但失忆的合作者”。我们负责搭建外部记忆、Checklist 与 guardrails，让它先复用，再实现。

---

## 仓库信息与设计逻辑
- **Git 仓库**：[`AlexSD89/Obsidion`](https://github.com/AlexSD89/Obsidion)（当前工作副本与远端保持同步）。
- **设计逻辑**：以 Obsidian 风格管理 LaunchX 全量资产——根级 `AGENTS.md` / `CLAUDE.md` 定义协作总则，`specs/`→`plans/`→各业务 Emoji 目录承载执行与归档，所有自动生成物先进入 `🤖 AI生成 auto-generated/` 再在 24h 内归档。
- **协同原则**：所有制度、脚本、方法论更新后需同时刷新仓库索引（README、memory-bank、support_modules），并确保 Git 记录与 Summary 同步，方便跨工具追溯。

> 同步提示：该信息与 `AGENTS.md` 的“仓库信息与设计逻辑”章节保持一致，确保协作原则统一。

## 1. 快速开始（命令速查）

| 场景 | 命令 / 操作 | 备注 |
| --- | --- | --- |
| 预热 MCP | `bash scripts/mcp-prewarm.sh` | 预拉取 `mcp-deepwiki`、`open-websearch`、`spec-workflow`、`serena` |
| 检查 MCP 状态 | `codex /mcp status` | Context7 需在 `~/.codex/config.toml` 配置 API Key |
| 任务通知（macOS） | `osascript ~/.codex/notify.sh '<payload>'` | 无 GUI 时降级为日志输出 |
| 切换 Codex profile | `codex --profile <name>` 或 `codex --config <path>` | 与 `AGENTS.md` 定义的环境保持一致（development / staging / production） |
| Node 项目 | `npm install && npm run validate && npm run test` | 失败时记录日志与推测根因 |
| Python 项目 | `python -m venv venv && source venv/bin/activate` → `pip install -r requirements.txt` → `pytest` | 退出请 `deactivate` |
| Phase 0 Checklist | `memory-bank/README.md` | 包含平台快照、指令与模板 |
| 计划流程 | `/spec` → `update_plan` → `/do` | Summary 用 `Summary / Testing / Next Steps` |

> 所有文件改动使用 `apply_patch`；每条 `shell` 前先说明目的，完成后“@确认 + 结果/下一步”。

> **仓库提醒**：当前仓库源自 [`AlexSD89/Obsidion`](https://github.com/AlexSD89/Obsidion)，设计逻辑遵循 Obsidian 风格的“指挥总则（AGENTS.md）+ 协作路标（CLAUDE.md）+ Emoji 域分层分工”，所有生成内容先进入 `🤖 AI生成 auto-generated/` 再 24h 内归档，配合 `/spec → /plan → /do` 流程确保版本与文档闭环。

### 1.1 提示词模板（最小上下文）
在与 Claude 协作时，推荐附上以下精简提示，确保其遵循既定规则：

```
你在一个 pnpm + monorepo 项目中工作。
先读根目录 CLAUDE.md，再读相关包的 USEME.md。
优先复用 support_modules 下的能力；禁止 barrel 导入，必须使用具体文件路径。
涉及 UA / SSR / 性能时，优先查找 common-ua、common-react-hooks、common-util。
在给出修改前，先检查项目内已有 API 是否可复用。
```

建议将该模板固化到 `.cursorrules` 或常用 Prompt 片段中，减少重复粘贴。

### 1.2 跨仓协作规则
- `.cursorrules` 建议内容：
  ```
  严格遵循工作流程：收到任务 → 检查 Rules → 分析项目结构 → 执行。
  阅读 package.json、CLAUDE.md、USEME.md 以遵循约定。
  若为 monorepo 子仓库，向上查看父仓库与 support_modules 的指导文件。
  ```
- “文档地图”即本文件中的 Monorepo 概览，可帮助 AI 定位公共包的 `USEME.md`。
- 公共库的 `USEME.md` 对业务代码具有更高优先级；如发现冲突，须先更新公共库后再修改业务实现。
- 推荐在 CI 或本地加入静态检查（禁止 barrel 导入、检测重复工具、查找危险 SSR API），相关脚本可记录在 `memory-bank/support_modules/dev/USEME.md`。

### 1.3 与 Codex `AGENTS.md` 的协同角色
- **职责对照**：`AGENTS.md` 管控硬性流程（技术栈、脚本、验收阈值），本文件聚焦软性协作（语气、信息拓扑、模型提示）。当两处涉及同一主题时，以 `AGENTS.md` 规则为准，并在 Summary 中提醒 Codex/Claude 双方同步阅读更新。
- **Profile / Sandbox 提示语**：若执行依赖 `~/.codex/config.toml` 或项目级 `.codex/config.toml` 中的特定 profile，请在提示语显式声明，例如：`当前对话使用 profiles.production（sandbox_mode=restricted），禁止写操作，仅允许 readonly shell`。
- **输出缓存规范**：Claude 生成的长文稿、报告默认为草稿。请先写入 `🤖 AI生成 auto-generated/YYYYMMDD/`，完成校对后 24 小时内迁移至目标目录并补充 frontmatter；最终 Summary 中补一句“草稿已归档（文件路径）”。
- **信息链闭环**：每当 `AGENTS.md` 新增自动化命令或流程节点，应在此处追加相应 background（例如需要准备的上下文、交付物格式），确保 Claude 在补充说明时不会与硬性要求冲突。

---

## 2. Monorepo 概览（包清单 + USEME 路径）

| 领域 | 目录 | 指南文件 |
| --- | --- | --- |
| 核心指挥 | 根目录 | 指挥总则文档 · `memory-bank/README.md` |
| 技术迭代 | `💻 技术开发/` | `memory-bank/support_modules/dev/USEME.md`（待补） |
| 知识生产 | `🟣 knowledge/` | `🟣 knowledge/CLAUDE.md`、`memory-bank/support_modules/knowledge/USEME.md`（待补） |
| 业务交付 | `🚀 Launchx业务服务/` | `memory-bank/support_modules/launchx/USEME.md`（待补） |
| 深研案例 | `🔬 Deep study/` | `memory-bank/support_modules/deep-study/USEME.md`（待补） |
| 设计系统 | `🎨 设计美学资源库/` | `memory-bank/support_modules/design/USEME.md`（待补） |
| 自动化实验室 | `🧩 bmad/` | `memory-bank/support_modules/bmad/USEME.md`（待补） |
| 需求 / 计划 | `specs/`、`plans/` | 模板内置于目录 |

> 每个 `memory-bank/support_modules/*/USEME.md` 负责列出导入路径、API 参数、组件/脚本用法与最佳实践。空缺部分请在接手模块时补全。

---

## 3. AI 协作规范（Do / Don't）

### Do ✅
- 在 Phase 0 先读 `memory-bank/`、目录 `CLAUDE.md / USEME.md / RULES.md`，确认可复用能力与禁区。
- 所有需求一律先输出 checklist，逐项确认输入、依赖、测试、引用对象。
- 在 `/spec` 中写清上下文、验收标准、引用文档；在 `/plan` 标注需要的脚本与测试命令；在 `/do` 严格按 plan 执行。
- 对每次改动提供最小化验证结果，并在 Summary 中说明验证方式。
- 更新上下文资产（`memory-bank/`、`USEME.md`、README）后在 Summary 里标注“已同步上下文”。
- 阅读 `AGENTS.md` 获取硬性流程（技术栈、脚本、验收阈值）；如需变更流程，先与 Codex 对齐后再调整本文件的协作提示。
- 生成长文或分析内容时，先写入 `🤖 AI生成 auto-generated/YYYYMMDD/` 并标注“草稿”，24 小时内迁移至目标目录补 frontmatter。

### Don't ❌
- 不要整段复制文件交给 Claude；请指向具体函数或行号（例：`src/main.py:L15-L30`）。
- 不要在需求、架构未确认前直接要求实现系统；先补齐 `/spec` 与 `/plan`。
- 不要忽略测试或验证；“能运行=没问题”的假设是大部分故障的根源。
- 不要重复造轮子（节流/懒加载/环境判断等）；复用 `memory-bank/support_modules/*/USEME.md` 中的能力。
- 不要遗忘成果归档；所有产出 24 小时内要归档至对应 Emoji 目录并建立链接。

---

## 4. 常见坑与约束
- **上下文失配**：未加载 `memory-bank` 或目录 `USEME.md` 导致 AI 就地实现 → 先跑 `fd/rg/sg` 搜索现成能力。
- **Checklist 缺失**：直接说“帮我写 XX 功能” → 需先列 checklist，再逐项执行。
- **spec/plan/do 混用**：跳过 `/plan` 直接改代码 → 强制回滚至计划阶段确认。
- **测试遗漏**：未运行最小测试或未附验证结果 → Summary 中必须列出测试命令与结论。
- **引用丢失**：生成内容未在 README 建链接或补 frontmatter → 需立即补齐以保证追溯。
- **环境差异**：macOS 默认路径 `/opt/homebrew/bin`；若依赖缺失，需在 `memory-bank/support_modules/*/USEME.md` 写明安装方式。

---

## 5. AI Context 系统导航

### 🎯 标准协作流程
Claude Code 严格遵循以下五步工作流程：

1. **先读根目录 CLAUDE.md** – 获取全局规范、命令速查、流程指引。
2. **再读相关包的 USEME.md** – 了解模块能力、导入方式与常见陷阱。
3. **优先复用 support_modules** – 避免重复造轮子，引用现有实现。
4. **禁止 barrel 导入** – 所有导入必须指向具体文件。
5. **涉及 UA / SSR / 性能** – 首先查阅 `common-ua`、`common-react-hooks`、`common-util`。

### 📚 文档层次结构

- **Layer 1：总路标（本文）** – 提供快速命令、协作规范、文档地图。
- **Layer 2：模块指南** – 各目录内的 `CLAUDE.md`、`memory-bank/support_modules/*/USEME.md`、`RULES.md`，列出能力、约束与示例。
- **Layer 3：方法论与模板** – 推荐在 `🟣 knowledge/05_方法论中心/` 维护 AI Context 实施指南、提示词模板、质量保障要点；也可在 `memory-bank/` 记录常用 Prompt。
- **Layer 4：具体实现** – `memory-bank/support_modules/` 公共能力仓库、`apps/` 业务应用；遵循绝对路径导入及 Checklist 驱动流程。

### 🔄 质量保障机制
- **静态检查**：建议提供脚本检测 barrel 导入、重复实现、危险 SSR API（参见 `memory-bank/support_modules/dev/USEME.md`）。
- **验证脚本**：可在 `scripts/` 中维护环境校验、文档覆盖检查；执行完成后更新日志。
- **持续监控**：定期检查文档是否同步、上下文资产是否与代码一致，并在 Summary 提醒补齐。

## 6. 文档地图与生成
- **根级指挥**：组织指挥总则、协作总览（本文件）。
- **记忆库**：`memory-bank/README.md`，含项目快照、Checklist 模板、常用命令、重点项目。
- **业务域指南**：各 Emoji 目录内的 `CLAUDE.md` + `memory-bank/support_modules/<domain>/USEME.md`。
- **边界说明**：`RULES.md` 列出禁区、版本约束、回滚策略。
- **需求与计划**：`specs/`、`plans/`，文件需采用 `YYYYMMDD-主题.md` 命名并附 frontmatter。
- **知识归档**：`🤖 AI生成 auto-generated/YYYYMMDD` 缓冲 → 校对 → 目标目录（补 frontmatter 与"引用于"段落）。
- **自动化记录**：`🧩 bmad/docs/` 存 SOP、升级日志、验证结果。

> 生成文档后务必更新相关 README 的索引锚点，保持知识闭环。

---

## 7. 版本与兼容性说明
- **运行环境**：macOS 13+，Node.js 18+/22+，Python 3.10+；路径默认 `/opt/homebrew/bin`。
- **MCP 配置**：Context7、Rube、Playwright 等需在 `~/.codex/config.toml` 声明；远程 MCP 需代理。
- **通知脚本**：macOS 使用 `osascript` / `terminal-notifier`；Windows 脚本已移除，如需使用需另建 PowerShell 版本。
- **自动化依赖**：`🧩 bmad` 需运行 `npm install`、`npm run validate`、`npm run test`；Python 工具需 `pip install -r requirements.txt`。
- **兼容性更新**：当依赖版本、MCP 接口或目录结构调整时，必须同步更新协作总览、相关 `memory-bank/support_modules/*/USEME.md`、`memory-bank/README.md` 以及关联 README/计划文档。

---

遵循以上总路标，Claude Code 才能在 LaunchX monorepo 中快速定位能力、复用已有资产，并在 `/spec → /plan → /do` 流程下安全交付。***
