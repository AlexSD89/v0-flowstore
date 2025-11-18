---
title: "LaunchX 工具快速参考 · Spec-Kit CLI"
owners:
  - LaunchX Tooling Core
status: active
last_update: 2025-11-18
contact: "TODO｜待补充 - LaunchX 工具维护人联络方式（如邮箱/微信/Slack频道）"
related:
  - "../CLAUDE.md"
  - "../RULES.md"
  - "🧰 tools/launchx-spec-kit-cli/README.md"
source: "RULES.md 与 CLAUDE.md 中工具章节的汇总精简版"
impact: high
---

# LaunchX 工具快速参考 · Spec-Kit CLI

> 本文档提供 LaunchX 内部常用工具的最小可执行用法，重点围绕 **LaunchX Spec-Kit CLI**。  
> 详细规则与方法论请始终以 `RULES.md` 与 `CLAUDE.md` 为准。

## 1. LaunchX Spec-Kit CLI（唯一入口）

- **位置**：`/🧰 tools/launchx-spec-kit-cli/lx_fixed.py`  
- **角色**：把 LaunchX 5 步认知法（Collect / Model / Compare / Align / Deliver）与 Dev Docs 三文件（plan/context/tasks）打通的统一 CLI。  
- **底层引擎**：复用原始 `spec-kit` 项目的模板与执行理念（`/🧰 tools/spec-kit/`），在本地实现了简化版。

### 1.1 在任意项目中快速启动

```bash
# 进入你的项目根目录（示例）
cd /path/to/your/project

# 调用 LaunchX Spec-Kit CLI 初始化当前目录
python3 "/Users/dangsiyuan/Documents/obsidion/launch x/🧰 tools/launchx-spec-kit-cli/lx_fixed.py" init --here
```

执行后会在当前项目中创建：

- `dev-docs/plan.md`：开发计划与阶段划分  
- `dev-docs/context.md`：SESSION PROGRESS 与关键文件索引  
- `dev-docs/tasks.md`：任务清单与验收标准  

### 1.2 按 5 步认知法推进

```bash
# 收集阶段（Collect）
python3 "/Users/dangsiyuan/Documents/obsidion/launch x/🧰 tools/launchx-spec-kit-cli/lx_fixed.py" collect "收集项目需求与上下文"

# 建模阶段（Model）
python3 "/Users/dangsiyuan/Documents/obsidion/launch x/🧰 tools/launchx-spec-kit-cli/lx_fixed.py" model "进行系统建模与方案分析"

# 对比阶段（Compare）
python3 "/Users/dangsiyuan/Documents/obsidion/launch x/🧰 tools/launchx-spec-kit-cli/lx_fixed.py" compare "对比候选方案与风险"

# 对齐阶段（Align）
python3 "/Users/dangsiyuan/Documents/obsidion/launch x/🧰 tools/launchx-spec-kit-cli/lx_fixed.py" align "对齐团队共识与任务分解"

# 交付阶段（Deliver）
python3 "/Users/dangsiyuan/Documents/obsidion/launch x/🧰 tools/launchx-spec-kit-cli/lx_fixed.py" deliver "执行交付并记录验证结果"
```

运行过程中，CLI 会：

- 从 `templates/` 中读取对应阶段模板（如 `collect.md`、`model.md`）；  
- 在当前项目的 `dev-docs/<step>_output.md` 中生成结构化输出；  
- 尝试更新 `dev-docs/context.md` 的 SESSION PROGRESS；  
- 通过内置 `RulesManager` 打印 `RULES.md` / `CLAUDE.md` / 本文件的引用路径，方便回溯规则。

> 提示：如果 CLI 提示未找到 `RULES.md` / `CLAUDE.md`，通常是当前环境不在 LaunchX 仓库路径下，仅影响规则引用提示，不影响 CLI 主流程。

### 1.3 与规则体系的对应关系（索引视图）

- 使用时机与 Level / 三步法映射：`RULES.md` 中 “LaunchX Spec-Kit工具使用时机与规则” 小节。  
- Claude 调用与协作规范：根级 `CLAUDE.md` 中 “🛠️ LaunchX Spec-Kit工具执行指南”。  
- CLI 详细说明与扩展方式：`🧰 tools/launchx-spec-kit-cli/README.md` 与 `🧰 tools/launchx-spec-kit-cli/LAUNCHX_SPEC-KIT_INTEGRATION.md`。  

## 2. 其它工具的占位说明（TODO）

> 为避免本文件过度膨胀，其它大型工具（如 Gate 工具链、Serena 仪表盘相关脚本等）仅保留占位，详细用法请各自查阅 README。

- TODO｜待补充：`Gate` 系列工具快速命令（参考 `🧰 tools/Gate/README.md`）  
- TODO｜待补充：Serena 监控与 memory-bank 验证脚本入口（参考 `🛠️ 系统管理/memory-bank/README.md`）  

以上 TODO 会在后续按需由 Claude / Codex 补充，并在 `RULES.md` 与各自目录的 README 中建立互链。

