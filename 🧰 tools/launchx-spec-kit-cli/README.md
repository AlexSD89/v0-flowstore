---
title: "LaunchX Spec-Kit CLI · 入口"
owners:
  - LaunchX Tooling Core
status: active
last_update: 2025-11-17
contact: "TODO｜待补充 - LaunchX CLI 维护人联络方式（如邮箱/微信/Slack频道）"
related:
  - "../../CLAUDE.md"
  - "../../RULES.md"
source: "LAUNCHX_SPEC-KIT_INTEGRATION.md + LaunchX Spec-Kit集成项目 README 汇总"
impact: high
---

# LaunchX Spec-Kit CLI · 5步认知法 + Spec-Kit融合入口

> 本 README 是 LaunchX 在工具域内对外暴露的统一 CLI 入口：  
> - 面向「日常项目使用者」：如何用一个 CLI 跑通 5 步认知法 + Dev Docs 三文件更新；  
> - 将 Spec-Kit 的执行框架内化为 LaunchX 的 `lx_fixed.py`，不要求用户单独理解原始 spec-kit 项目。

## 🎯 定位

- 提供一个**本地可执行的 CLI**，把 LaunchX 5 步认知法（Collect / Model / Compare / Align / Deliver）和 Dev Docs 三文件（plan/context/tasks）直接打通。  
- 吸收 GitHub Spec-Kit 的 CLI 设计、模板与步骤跟踪思想，但通过 `lx_fixed.py` 简化实现，避免对外部依赖的强绑定。  
- 作为 CLAUDE / RULES / AGENTS 中提到的 “LaunchX Spec-Kit 工具” 的唯一入口；底层 `launchx-spec-kit` 工程视为内部实现说明。

## 🧱 核心组件

- `lx_fixed.py`：LaunchX CLI 主实现文件  
  - 实现了 5 个核心子命令：`collect` / `model` / `compare` / `align` / `deliver`（对应认知阶段）。  
  - 内置 `StepTracker` 和 `SimpleConsole`，用于本地进度可视化与彩色输出。  
  - `RulesManager` 负责引用根目录 `RULES.md` / `CLAUDE.md`，在 CLI 输出中附带规则路径，方便回溯。  
- `templates/`：认知阶段与 Dev Docs 模板  
  - 如 `collect.md` / `model.md` / `plan.md` / `tasks.md` 等，用于生成基础文档骨架。  
- `dev-docs/`：示例 Dev Docs 三文件结构  
  - `plan.md` / `context.md` / `tasks.md` 以及若干输出文件（如 `collect_output.md`）。  
- `LAUNCHX_SPEC-KIT_INTEGRATION.md`：  
  - 记录本 CLI 如何映射 Spec-Kit 的 `specify/plan/tasks/implement` 思想，以及 StepTracker / 模板系统的实现细节。

## 🚀 基本使用方式（概览）

> 详细的命令行参数、示例和演练流程，请结合 `LAUNCHX_SPEC-KIT_INTEGRATION.md` 与 `🧰 tools/LAUNCHX_TOOLS_QUICK_REFERENCE.md` 使用；下方只给出最小可执行路径。

```bash
cd "/Users/dangsiyuan/Documents/obsidion/launch x/🧰 tools/launchx-spec-kit-cli"

# 初始化当前目录为 LaunchX 项目（可选，一次性）
python3 lx_fixed.py init --here

# 按 5 步认知法执行
python3 lx_fixed.py collect "收集项目需求与上下文"
python3 lx_fixed.py model "进行系统建模与方案分析"
python3 lx_fixed.py compare "对比候选方案与风险"
python3 lx_fixed.py align "对齐团队共识与任务分解"
python3 lx_fixed.py deliver "执行交付与记录验证结果"
```

运行过程中，CLI 会：

- 使用模板生成对应阶段的 Markdown 文档；  
- 更新 `dev-docs/plan.md`、`dev-docs/context.md`、`dev-docs/tasks.md` 中的相关段落；  
- 通过 `StepTracker` 在终端展示进度；  
- 在必要时打印出 `@/RULES.md:line` / `@/CLAUDE.md:line` 等引用，提示关联规则位置。

## 🔗 与 LaunchX 规则体系的关系

- CLAUDE / RULES / AGENTS 中所有关于 “LaunchX Spec-Kit 工具” 的说明，默认指向本 CLI：  
  - 使用时机与 Level / 资源调度三步法映射：见 `RULES.md` “LaunchX Spec-Kit工具使用时机与规则” 小节；  
  - Claude 侧调用规范：见根级 `CLAUDE.md` 中 “🛠️ LaunchX Spec-Kit工具执行指南”。  
- 对于需要深入理解 Spec-Kit 集成实现、模板体系或扩展 CLI 行为的开发者，可继续查阅：  
  - `LAUNCHX_SPEC-KIT_INTEGRATION.md`（LaunchX CLI 与 Spec-Kit 的融合设计说明）；  
  - `../spec-kit/README.md`（原始 Spec-Kit 官方项目，提供完整 CLI 说明与模板体系）。

## 🧪 建议验证步骤

1. 在沙盒目录中新建一个测试项目，执行 `init` 与若干认知子命令，确认：  
   - 必要目录与 Dev Docs 三文件均被正确创建；  
   - 模板内容与实际需求匹配度可接受。  
2. 在真实项目（如 Gate v4 / 小红书）中，选择一个小范围任务，用 LaunchX CLI 跑完 Collect→Deliver 全流程，并对比：  
   - CLI 生成的 Dev Docs 与手写规范的一致性；  
   - 任务推进过程中的可追溯性与复盘体验。  

> 如需调整 CLI 行为（如新增自定义阶段、替换模板、集成 MCP 调用），请在变更前补充 `/spec` 说明，并更新本 README 与 `LAUNCHX_SPEC-KIT_INTEGRATION.md` 的相关段落。
