# LaunchX Memory Bank

> 版本：2025-10-11 · 维护：Launch X Codex

## 1. 平台快照
- **使命**：运营守正 / 智能沉淀 / 自动化提效三线并行。
- **核心架构**：💻 技术开发 · 🟣 knowledge · 🚀 Launchx业务服务 · 🔬 Deep study · 🎨 设计美学资源库 · 🧩 bmad（自动化实验室）。
- **知识流水线**：`🟣 knowledge/00_Inbox → 01_分析与洞察 → 02_研究报告`，24h 内完成归档与索引。
- **自动化基座**：Codex CLI（spec/plan/do + checklist）、🧩 bmad（脚本、SOP、多智能体）、MCP 工具矩阵（Context7、Rube、Playwright 等）。

## 2. 快速上手 Checklist
1. **阅读系统架构**: 📖README-LaunchX系统总体指南.md + AGENTS.md + CLAUDE.md
2. **理解协作哲学**: 🟣 knowledge/05_方法论中心/🎯 claudecode-全局设计哲学.md
3. **配置AI环境**: 运行 `bash scripts/mcp-prewarm.sh` + `bash scripts/validate-ai-context.sh`
4. **选择工作模式**: 根据任务类型选择对应的能力域
5. **建立协作Checklist**: 遵循五步协作流程

### 2.1 标准协作流程
```text
[ ] Phase 0: 读取CLAUDE.md了解全局规则
[ ] 能力定位: 查阅相关USEME.md了解可用能力
[ ] 复用检查: 搜索support_modules中是否有现成实现
[ ] 路径规范: 使用绝对路径，避免barrel导入
[ ] 验证测试: 执行最小化验证并记录结果
[ ] 成果归档: 更新相关文档和索引
```

### 2.2 智能协作进阶
```text
[ ] 基础阶段: 遵循工作流程，达到80%+复用率
[ ] 优化阶段: 记录协作效果，动态调整策略
[ ] 进化阶段: 沉淀成功模式，更新方法论
[ ] 生态阶段: 跨项目知识迁移和复用
```

### 2.1 常用提示片段
```
你在一个 pnpm + monorepo 项目中工作。
先读根目录 CLAUDE.md，再读相关包的 USEME.md。
优先复用 support_modules 下的能力；禁止 barrel 导入，必须使用具体文件路径。
涉及 UA / SSR / 性能时，优先查找 common-ua、common-react-hooks、common-util。
在给出修改前，先检查项目内已有 API 是否可复用。
```

> 建议同步粘贴到 `.cursorrules` 或编辑器常用 Prompt 中；仓库根目录已提供 `.cursorrules`，如有调整请在 Summary 中说明并同步本文。

### 2.2 跨仓协作 Tips
- `.cursorrules` 需强调：检查 Rules → 分析项目结构 → 执行；若为 monorepo 子仓库，向上查找父仓与 `support_modules` 文档。
- 通过根级 `CLAUDE.md` 的文档地图定位公共包 `USEME.md`，并在执行前阅读其导入约束与示例。
- 计划补充静态检查脚本：
  - `check-no-barrel-imports.mjs`
  - `check-duplicate-utils.mjs`
  - `check-ssr-dangerous-api.mjs`
  在完成脚本后记得更新 `support_modules/dev/USEME.md`。

## 3. 可复用资产地图
| 类型 | 位置 | 内容要点 |
| --- | --- | --- |
| 全局指挥 | `AGENTS.md` · `CLAUDE.md` | 使命、Phase 0、工具矩阵、反模式 |
| 技术项目 | `💻 技术开发/` | `00_开发计划`、`01_公司项目ing`、`02/03` 工具与规范、`04` 成熟项目 |
| 知识方法 | `🟣 knowledge/` | `CLAUDE.md`、`📖README-知识库总览.md`、方法论中心、研究报告、市场档案、周报月报 |
| 业务交付 | `🚀 Launchx业务服务/` | `Ⅰ/Ⅱ/Ⅲ` 流程、`a/b` 策略与案例 |
| 深研案例 | `🔬 Deep study/` | 长期研究、投资重构方案 |
| 设计系统 | `🎨 设计美学资源库/` | 设计语言、组件库、品牌规范 |
| 自动化实验室 | `🧩 bmad/` | `bmad-core`、`common`、`expansion-packs`、`docs`、`-BACKUP` |
| 需求模板 | `specs/` | `/spec → /plan → /do` 模板与规范 |
| 研究数据 | `study/` | 原始数据、实验笔记、方法探索 |

## 4. 常用指令与测试
- 预热 MCP：`bash scripts/mcp-prewarm.sh`
- 任务通知（macOS）：`osascript ~/.codex/notify.sh ...`
- Node 项目：`npm install`、`npm run validate`、`npm run test`
- Python 项目：`python -m venv venv && source venv/bin/activate`、`pip install -r requirements.txt`、`pytest`
- Codex 计划：`/spec` → `update_plan` → `/do`（使用 `apply_patch` 编辑）

## 5. 当前重点项目
| 项目 | 目录 | 说明 |
| --- | --- | --- |
| Pocketcorn v4.1 | `💻 技术开发/04_成熟项目 ✅/pocketcorn_*` | BMAD 智能投资系统，7 维度评分闭环 |
| Zhilink v3 | `💻 技术开发/01_公司项目ing 🚀/Obsidion-zhilink-platform_v3/` | 企业服务能力交易平台，Next.js 15 全栈 |
| AI 知识生产线 | `🟣 knowledge/03_研究报告` | 行业/方法/组织/设计四大主线 |
| 企业 AI 转型案例库 | `🚀 Launchx业务服务/a_企业AI转型服务策略与案例` | 客户方案、SOP、回滚说明 |
| 自动化脚本实验 | `🧩 bmad/bmad-core` | 多智能体脚本、SOP、验证日志 |

## 6. 关键方法论 & 模板
- 知识发现 5 通道：核心主题深挖 / 相关领域拓展 / 最新动态捕获 / 专家观点 / 趋势信号（详见 `🟣 knowledge/CLAUDE.md`）。
- 4 层方法论体系：系统级（投资、转型、设计）、技术级（Claude 集成、MCP、架构）、管理级（工作流、数据评级）、项目级（协作、评估）。
- 内容流转：`🤖 AI生成 auto-generated/日期目录 → 校对 → 目标 Emoji 目录 → README 索引`。

## 7. 配置与工具指南
- **Codex & Claude 配置**：`Codex-Claude-配置指南.md` - 完整的配置文件和命令参考
- **协作规则**：`.cursorrules` - 项目级协作规范
- **支持模块**：`support_modules/` - 可复用的能力库

## 8. 参考链接
- 根级指导：`AGENTS.md` · `CLAUDE.md`
- 系统概览：`📖README-LaunchX系统总体指南.md`
- 方法论样板：`🟣 knowledge/05_方法论中心/`
- 设计系统：`🎨 设计美学资源库/`
- 自动化指南：`🧩 bmad/docs/`

> 每当结构、流程或工具发生调整，请同步更新本记忆库，并在 Summary 中标注"memory-bank 已更新"以提醒后续会话加载最新内容。
