# 📖 LaunchX 系统总体指南

版本：2025-10-11 · 维护：Launch X Core

> 本指南提供根级视角的“看板”，说明组织使命、层级架构、核心流程、目录地图与引用关系。执行细节请参阅 `AGENTS.md`（Codex）与 `CLAUDE.md`（Claude Code），快速上下文请加载 `memory-bank/README.md`。

---

## 1. 使命与整体架构
- **使命三线**：运营守正 / 智能沉淀 / 自动化提效。
- **五大核心域**：
  | 域 | 职责 | 关键产出 |
  | --- | --- | --- |
  | 💻 技术开发 | 技术迭代、原型、工具 | 项目原型、自动化脚本、开发规范 |
  | 🟣 knowledge | 知识生产、方法论、趋势洞察 | 研究报告、方法论体系、市场档案 |
  | 🚀 Launchx业务服务 | 企业交付、品牌传播、运营管理 | 客户方案、SOP、品牌素材 |
  | 🔬 Deep study | 长周期研究、投资重构 | 深研报告、投资框架、案例复盘 |
  | 🎨 设计美学资源库 | 设计系统、品牌资产 | UI 组件、设计规范、视觉模板 |
- **自动化引擎**：`🧩 bmad` 提供多智能体脚本、SOP、扩展能力，并与 Codex CLI 协同。

---

## 2. 指挥体系
| 层级 | 文档 | 作用 |
| --- | --- | --- |
| Root 指挥 | `AGENTS.md` | Codex CLI（执行端）守则：Phase 0、/spec→/plan→/do、工具策略 |
| 协作总览 | `CLAUDE.md` | Claude Code（协作端）总路标：命令速查、提示模板、文档地图 |
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

## 4. 目录地图（根级）
```
study/                        ← 研究数据、脚本、实验记录
specs/                        ← /spec 模板与需求说明
plans/                        ← /plan 文档（按日期命名）
🤖 AI生成 auto-generated/     ← 生成草稿（24h 内归档或清理）
🧩 bmad/                      ← 自动化实验室（核心脚本、SOP、扩展包）
💻 技术开发/                 ← 技术迭代与成熟项目
🟣 knowledge/                 ← 知识生产流水线与方法论
🚀 Launchx业务服务/          ← 客户交付、运营资产、品牌传播
🔬 Deep study/               ← 深度研究与投资重构
🎨 设计美学资源库/           ← 设计语言与视觉资产
```

子目录中需维护：`CLAUDE.md`、`RULES.md`、`memory-bank/support_modules/<domain>/USEME.md`，确保能力与约束清晰。

---

## 5. 关键流程链路
- **知识流水线**：`01_Inbox → 02_分析与洞察 → 03_研究报告/07_市场项目档案/08_知识传播` → `09_周报月报`.
- **技术交付**：`00_开发计划 → 01_公司项目ing → 02/03 工具规范 → 04 成熟项目`，配合 /spec→/plan→/do 流程与测试脚本。
- **业务交付**：`Ⅰ_待处理信息 → Ⅱ_对外业务 → Ⅲ_公司运营`，成果同步到 `🎨` 与 `🟣`。
- **自动化闭环**：`🧩 bmad` 脚本 → 执行日志 → README/计划/方法论 回写。

所有流程均需在 Summary 中汇报 `Summary / Testing / Next Steps`，并标注上下文资产是否更新。

---

## 6. 工具与脚本提示
- **MCP 预热**：`bash scripts/mcp-prewarm.sh`
- **环境校验**（若存在）：`bash scripts/validate-ai-context.sh`
- **静态检查**（建议实现）：`check-no-barrel-imports`、`check-duplicate-utils`、`check-ssr-dangerous-api`
- **Node 项目**：`npm install`、`npm run validate`、`npm run test`
- **Python 项目**：`python -m venv venv && source venv/bin/activate`、`pip install -r requirements.txt`、`pytest`

执行后需在 Summary 记录命令与结果；若脚本缺失或失败，需创建 TODO 跟进。

---

## 7. 维护与责任
- **每日**：清理 `🤖 AI生成 auto-generated/`、更新周报/README、检查 pending TODO。
- **每周一**：复查计划与遗留项，迁移必要任务；同步 `🟣 knowledge/09_周报月报`。
- **定期**：备份 `🧩 bmad`，校验 frontmatter/索引，确认 MCP 配置有效，验证自动化脚本。
- **变更管理**：涉及架构/流程/数据流时，先在 Summary 提案（含风险与回滚），经确认后执行。

---

保持以上指引同步更新，可确保 LaunchX 的 Codex、Claude Code 及各业务域在同一体系下协同运行，实现“外部大脑 + 标准流程 + 复用优先”的协作目标。***
