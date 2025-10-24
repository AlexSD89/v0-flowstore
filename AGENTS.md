# AGENTS.md · LaunchX 指挥总则

最后更新：2025-10-11  
配套文档：`📖README-LaunchX系统总体指南.md` · `memory-bank/README.md`

> 黄金法则：把 AI 当作“才华横溢但失忆的合作者”。我们负责搭建外部记忆与清晰任务清单，让它先复用已有能力，再去实现新增需求。

---

## 快速导航
- [使命与核心协同](#使命与核心协同)
- [Phase 0｜外部大脑搭建](#phase-0外部大脑搭建)
- [协作流程：/spec → /plan → /do](#协作流程spec--plan--do)
- [提示范式与反模式](#提示范式与反模式)
- [工具与环境](#工具与环境)
- [目录地图](#目录地图)
- [交付与归档](#交付与归档)
- [节奏与维护](#节奏与维护)
- [安全与升级](#安全与升级)

### 仓库信息与设计逻辑
- **Git 仓库**：[`AlexSD89/Obsidion`](https://github.com/AlexSD89/Obsidion)（当前工作副本与远端保持同步）。
- **设计逻辑**：以 Obsidian 风格管理 LaunchX 全量资产——根级 `AGENTS.md` / `CLAUDE.md` 定义协作总则，`specs/`→`plans/`→各业务 Emoji 目录承载执行与归档，所有自动生成物先进入 `🤖 AI生成 auto-generated/` 再在 24h 内归档。
- **协同原则**：所有制度、脚本、方法论更新后需同时刷新仓库索引（README、memory-bank、support_modules），并确保 Git 记录与 Summary 同步，方便跨工具追溯。

> 同步提示：`CLAUDE.md` 的“仓库信息与设计逻辑”章节维护相同描述，保持指挥总则与协作路标一致。

---

## 使命与核心协同
- **使命三线**：运营管理守正 / 智能生成沉淀 / 自动化实验提效。
- **五大核心**：💻 技术开发 · 🟣 knowledge · 🚀 业务服务 · 🔬 Deep study · 🎨 设计美学资源库；无 Emoji 目录用于草稿与沙盒。
- **协同原则**：技术成果反哺知识库，研究洞察驱动业务方案，设计与自动化保持同步回写，所有产出 24h 内归档并建立链接。
- **触发词映射**：
  | 关键词 | 优先目录 | 责任人 |
  | --- | --- | --- |
  | 投资 / 估值 / 风险 | `🟣 knowledge/07_市场项目档案`、`🔬 Deep study` | Investment Desk |
  | 企业 / 交付 / 客户 | `🚀 Launchx业务服务`、`🧩 bmad/docs` | Business Ops |
  | 学习 / 方法论 / 研究 | `🟣 knowledge/05_方法论中心`、`study/` | Learning Lab |
  | 开发 / 自动化 / 脚本 | `💻 技术开发`、`🧩 bmad` | Tech Core / Launch X Codex |
  | 设计 / 视觉 | `🎨 设计美学资源库` | Design Guild |

### 设计哲学（Claude Code 最佳实践）
- 把 AI 当作"失忆但优秀的同事"：我们负责搭建完备的外部记忆，让它快速恢复上下文。
- Phase 0 先搭"第二大脑"：建立协作总览文档、`memory-bank/`、`USEME.md`、`RULES.md` 等资产，再开始提示。
- 计划先行：任何执行前先产出 checklist，逐项确认后再动手，避免"就地解决"造成的技术债。
- 反模式 90% 来自"少看多做"：强制复用既有能力，拒绝重复造轮子。——参考 [让 AI coding 不再就近解决：如何在 monorepo 中建设 AI context](https://juejin.cn/post/7540102683178123290)

### 协作进化与智能优化（进阶）
当基础协作流程熟练后，可构建具备自我学习和优化能力的高级协作系统。

#### 🤖 Claude Skills生态系统 (新增2025-10-23)
基于Claude Skills官方标准，Launch-X已构建完整的12个智能Skills生态系统：

**🧠 Launch-X Skills生态系统定位**:
- **基础模块**: Skills作为基础的能力单元，专注于特定功能
- **Agent SDK**: 更高级的智能体框架，支持多技能协作
- **协同关系**: Skills是构建Agent的基础组件，两者互补而非替代

**📚 核心文档**:
- [🧠 Launch-X Skills生态系统/README.md](🧠%20Launch-X%20Skills生态系统/README.md) - 生态系统总览和12个Skills介绍
- [📋 Skills生态系统指挥总则](🧠%20Launch-X%20Skills生态系统/AGENTS.md) - Skills开发流程和质量标准
- [📋 Skills开发协作指南](🧠%20Launch-X%20Skills生态系统/CLAUDE.md) - Skills专用开发规范
- [📚 Claude Skills官方标准学习](🧠%20Launch-X%20Skills生态系统/📚%20Claude%20Skills官方标准学习.md) - 官方开发标准
- [🔧 从零到一开发实战指南](../../🟣%20knowledge/f_AI开发技巧/Claude%20Skills从零到一开发实战指南.md) - 完整开发教程

**🚀 协作模式升级**:
1. **技能复用**: 直接调用标准化的Skills处理特定任务
2. **Agent编排**: 通过Agent SDK组合多个Skills完成复杂工作流
3. **生态共享**: Skills可在项目间共享，Agent具备跨环境执行能力

#### 🎯 从工具使用到智能协作
- **基础阶段**：遵循工作流程，复用现有能力（本文档核心）
- **进阶阶段**：动态学习用户偏好，优化协作模式
- **高级阶段**：构建自我进化的智能协作系统

#### 🔄 协作磨合机制
- **实时调整**：根据用户反馈动态优化信息处理策略
- **经验沉淀**：将有效的协作模式记录到本地方法论库
- **权重优化**：基于历史效果调整信息源和处理方式权重

#### 📚 本地方法论生成
- **协作历史**：记录每次人机对话的有效模式
- **方法提炼**：从具体案例中抽象出通用分析框架
- **持续进化**：基于新的协作经验升级方法论

> **详细指导**：参考 🟣 knowledge/05_方法论中心/🎯 claudecode-全局设计哲学.md
> 该文档提供了完整的人机协作磨合和持续优化系统指导

---

## Phase 0｜外部大脑搭建
在提出第一个请求前，确保 AI 已“看见”正确上下文。

### 0.1 必读资产
1. **根级协作总览文档**：全局使命、流程、工具矩阵、目录路由。
2. **`memory-bank/`**：项目简介、技术栈、架构图、进度表、常用命令；新会话先加载此仓库。
3. **目录级协作指南 / `USEME.md` / `RULES.md`**：列出模块能力、调用示例、常见陷阱、禁区与回滚路径。
4. **README & 索引**：定位业务上下游与引用关系。

> 新增包/模块时务必同时创建或更新 `USEME.md`，缺失时先补齐再继续实现。

### 0.2 环境准备
- 确保语言策略：内部推理可用英文；对外输出、总结、文档保持中文优先，需要双语时附英文译文。
- 首次或依赖更新后运行 `bash scripts/mcp-prewarm.sh` 预热 MCP。
- macOS 下任务通知：在 `~/.codex/config.toml` 配置 `notify` 钩子，使用 `osascript` 或 `terminal-notifier`；无 GUI 时降级为日志输出。
- 设置常用工具路径（`/opt/homebrew/bin` 等），避免命令找不到。
- 确认 Codex profile：检查 `~/.codex/config.toml`（或项目内 `.codex/config.toml`）中 `profiles.development / staging / production` 等设置；执行前用 `codex --profile <name>` 或 `codex --config <path>` 明确工作环境，并在 Summary 说明所用 profile / sandbox 策略。

---

## 协作流程：`/spec → /plan → /do`

> 本文件面向 Codex CLI（执行端）；Claude Code 相关规范请参阅协作总览指南与 `.cursorrules`。

### 1. 探索 · Collect
- 澄清目标、约束、依赖与已有资产。
- 可提出 TODO 草案或备选方案，但暂不创建 plan。

### 2. 共识 · Align
- 用“目标 / 方案 / 风险 / TODO 草案”四要素复述。
- 当需求明确时，要求 AI 先输出 checklist（勾选式任务列表），我们逐项确认。

### 3. 执行 · Deliver
- **`update_plan` 规则**：任务进入执行态立即建/更新，保持 ≤3 步 + TODO；跨轮沟通复用同一 plan 并更新状态；接手他人 plan 先复盘历史、遗留项与责任人。
- **Summary 模板**：`Summary / Testing / Next Steps`，列出产出、验证结果（或未测原因）、遗留风险/阻碍。

### 分阶段守则
- `/spec`：仅改动 `specs/` 文档，写清上下文、验收标准、引用的 `USEME.md`/`RULES.md`。
- `/plan`：拆解 approved spec，标注所需资产（文档/脚本/测试命令）。等待用户确认后再执行。
- `/do`：严格按 plan 执行，使用 `apply_patch` 做最小改动；范围变化需回退至 `/plan` 或 `/spec` 再确认。
- 所有改动都必须有最小化测试或验证日志（`pnpm test`、`pytest`、`npm run validate` 等）。
- 涉及权限或写操作的任务需在 `/spec` 说明目标 profile 与 sandbox 约束，例如“使用 `profiles.production`（`sandbox_mode = restricted`）仅支持只读命令”。

### 对话节奏
- 每条 `shell` 前写明目的；关键操作后以“@确认 + 结果/下一步”反馈。
- 过程中使用 `Ctrl+T` 观察 Claude/Codex 思路，发现偏差立刻修正。

---

## 提示范式与反模式

### 推荐提示写法
- 采用 checklist：
  ```text
  [ ] 在 models/user.py 定义 User 模型（字段：email, password_hash）
  [ ] 在 auth/router.py 添加 /login 端点（JWT 认证）
  [ ] 在 tests/test_auth.py 覆盖成功/失败用例
  ```
- 对每一项补充：输入/依赖/验收方式/应复用的函数或脚本。
- 需要深度规划或拆解时，可在提示末尾加关键字：`ultrathink`（复杂规划）、`sub-task with agents`（需要拆解）。

### 反模式速查
- ❌ 整段复制文件给 AI；请精确到函数或行号（例：`src/main.py:L15-L30`）。
- ❌ 需求与架构未确认就要求实现系统；先补齐 `/spec`、`/plan`。
- ❌ 以“能运行=没问题”为由跳过测试；所有改动必须验证。
- ❌ 重复实现通用能力（节流、懒加载、环境判断等）；先查 `USEME.md`/共享库。

### 信息提供原则
- 交付上下文：目标、约束、依赖、已尝试方案、期望输出格式。
- 善用 `@` 快捷命令或引用片段定位具体文件与符号。
- 复杂调试时说明日志路径、失败截图或复现步骤。

### 调试技巧
- 优先运行最小化测试；失败时保留日志并猜测根因、提出下一步计划。
- 将有效配置写回 `AGENTS.md`、目录 README 或 `memory-bank/`，累积“外部记忆”。

---

## 工具与环境

### Shell 执行规范
- 先说明命令目的；完成后通过“@确认 + 结果/下一步”反馈。
- 所有文件改动必须使用 `apply_patch`；补丁失败及时回滚并说明处理方式。

### MCP 服务器
- 本地 MCP 默认以 STDIO 运行，可先执行 `bash scripts/mcp-prewarm.sh` 预拉取 `mcp-deepwiki`、`open-websearch`、`spec-workflow`、`serena` 等。
- 配置实例（Context7）：
  ```toml
  [mcp_servers.context7]
  command = "/opt/homebrew/bin/npx"
  args = ["-y", "@upstash/context7-mcp", "--api-key", "<YOUR_API_KEY>"]
  ```
- 远程 MCP（如 Rube）需代理；默认不开启。若必须使用，请在总结中说明风险与代理方案。

### 搜索工具优先级
- 文件名：`fd`
- 文本内容：`rg`
- 结构/语法：`sg`（ast-grep）
- 搜索卫生：排除 `.git`、`node_modules`、`coverage`、`out`、`dist` 等目录；优先限制在 `src/` 等业务路径。

### 任务完成通知
- `~/.codex/config.toml` 中配置 `notify` 钩子，指向 `~/.codex/notify.sh`。
- macOS 示例使用 `osascript` 或 `terminal-notifier`；脚本需解析 Codex 传入的 JSON 并控制消息长度。

---

## 目录地图
- 根级指挥文档：`📖README-LaunchX系统总体指南.md`
- `💻 技术开发`：00_开发计划 📋、01_公司项目ing 🚀、02_开发工具 🛠️、03_项目开发工具规范 📚、04_成熟项目 ✅ 等。
- `🟣 knowledge`：01_Inbox、05_方法论中心、03_研究报告、07_市场项目档案、09_周报月报。
- `🚀 Launchx业务服务`：Ⅰ_待处理信息 → Ⅱ_对外业务 → Ⅲ_公司运营；`a_企业AI转型服务策略`、`b_知识传播与品牌策略`。
- `🔬 Deep study`：长篇案例与重构方案。
- `🎨 设计美学资源库`：视觉系统、品牌素材。
- `🧩 bmad`：自动化实验室（`bmad-core`、`common/`、`expansion-packs/`、`docs/`）；`🧩 bmad -BACKUP` 为冷备。
- `🤖 AI生成 auto-generated`：生成内容缓冲区，产出需在 24h 内迁移归档并补 frontmatter。
- `tools/Weibo_PublicOpinion_AnalysisSystem`：Python 多引擎栈，配置见 `config.py`，日志存于 `logs/`。
- `specs/`、`plans/`、`study/`：需求、计划与研究记录。

> 层级 `AGENTS.md`：当子目录存在独立流程或验收标准时，需补充局部 `AGENTS.md` 并在 README 标注生效范围与来源。

---

## 交付与归档
- Markdown 文件必须包含 frontmatter（`title/owners/status/last_update/related/source/impact`）并注明“自动生成 / 人工采集”；命名 `YYYYMMDD-主题.md`。
- 代码/脚本需写明目的、输入/输出、依赖、回滚方法；自动化流程需记录 SOP、版本、测试结果。
- 成果及引用必须在 Summary 与相关 README 中同步，建立跨目录索引。
- Codex / Claude 生成的草稿、报告等中间产物统一暂存于 `🤖 AI生成 auto-generated/YYYYMMDD/`，每日确认 `[ ] 草稿已迁移或删除` 并在 Summary 标注处理结果。

---

## 节奏与维护
- **每日**：清理 `🤖 AI生成 auto-generated/` 草稿；更新周报或 README；检查未完 TODO。
- **每周一**：复查 plan 与遗留项，必要时迁移至新 plan；同步 `🟣 knowledge/09_周报月报`。
- **定期**：备份 `🧩 bmad`，校验 frontmatter/标签索引，确认 MCP 配置有效，对自动化脚本执行回归测试。

---

## 安全与升级
- **变更评估**：涉及架构/流程/数据流的修改先提出方案，Summary 中列出风险与回滚策略，经确认后执行。
- **问题升级**：遇到权限受限、关键依赖缺失或安全风险，立即在 Summary 标记并建议人工介入；涉及设计/品牌/合规需明确负责人。
- **上下文同步**：新增流程或工具时，先在根 README 记录定位，再同步更新本指挥文档、相关协作指南、README 及 `memory-bank/`。

---

贯彻以上规范，AI 才能在 LaunchX 的 monorepo 中快速复用既有能力、少走弯路，实现高质量交付。***
