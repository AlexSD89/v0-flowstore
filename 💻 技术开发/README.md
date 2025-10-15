---
title: "技术开发域总览"
owners:
  - "LaunchX Tech Core"
status: "active"
last_update: "2025-10-12"
related:
  - "./CLAUDE.md"
  - "./RULES.md"
  - "./AGENTS.md"
source: "自动生成（Codex CLI）"
impact: "对齐开发流程与跨域协同"
---

# 技术开发域总览

## 使命与范围
- 负责 LaunchX 平台的工程实现、工具链治理与自动化基础设施。
- 连接业务需求与支撑能力，确保代码、脚本与文档的双向同步。
- 维护与扩展 `memory-bank/support_modules/dev` 及公共组件，驱动跨域复用。

## 目录结构
| 目录 | 用途 |
| --- | --- |
| `00_开发计划 📋` | 月度/季度开发计划、优先级及资源分配 |
| `01_公司项目ing 🚀` | 进行中的项目代码与交付物链接 |
| `02_开发工具 🛠️` | 自研脚本、环境配置、生产力工具说明 |
| `03_项目开发工具的规范和原理 📚` | 工程规范、架构决策记录、最佳实践 |
| `04_成熟项目 ✅` | 已完成项目的归档、回顾与维护日志 |
| `📊 reports` | 指标报表、性能监测与回归结果 |
| `🎨 设计美学资源库/` | 设计体系与素材库（独立域，见子目录文档） |

## 核心工作流
1. **启动**：在 `/spec` 明确需求 → 同步 `memory-bank/support_modules/dev/USEME.md` → 产出 checklist。
2. **交付**：在 `/plan` 确认影响范围 → 迭代开发 → 提供最小化验证日志。
3. **归档**：更新 README / 方法论 / `memory-bank`，并回写关联域（知识库、业务交付等）。

### 自动化联动
- 将高频脚本、验证流程沉淀至 `🧩 bmad`，保持代码与自动化能力同步。
- `memory-bank/support_modules/dev/USEME.md` 当前为占位符，新增能力时需优先补齐使用说明与导入示例。
- 例行脚本（预热、验证、检查）若有调整，需同步更新 `scripts/` 与对应 USEME。

## 依赖与协作
- **知识域**：沉淀技术方案到 `🟣 knowledge/05_方法论中心`，保持方法论闭环。
- **业务服务域**：接收需求、交付可复用的解决方案或脚本。
- **设计域**：与 `🎨 设计美学资源库` 联动，统一组件与视觉规范。
- **自动化实验室**：向 `🧩 bmad` 回写可推广的脚本与实验结果。

## 交付要求
- 所有 Markdown 必含 frontmatter，说明来源及更新日期。
- 代码 / 脚本提交需附测试与验证结果，记录命令与输出摘要。
- 重大变更需在 `📊 reports` 留痕，并在 Summary 标注风险与回滚方案。
- 24 小时内完成知识回写，对应索引必须在 README 或 memory-bank 更新。

## 待办提醒
- `memory-bank/support_modules/dev/USEME.md`：补充公共函数、脚本范式与常见陷阱。
- 自动化脚本自检：落实 `check-no-barrel-imports` 等静态检查的实现与记录。

## 快速参考
- `memory-bank/support_modules/dev/USEME.md`：公共函数、脚本、命令范式。
- 根级 `CLAUDE.md`、`AGENTS.md`：全局流程与指挥原则。
- `scripts/`：环境预热、验证、检查脚本。
- `memory-bank/README.md`：项目快照与提示模板。
