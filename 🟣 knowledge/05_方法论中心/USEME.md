---
title: "USEME｜05_方法论中心"
owners:
  - "LaunchX Knowledge Lab"
status: "published"
last_update: "2025-11-01"
tags: [方法论中心, 使用说明, 目录导航, 复用指引]
category: "knowledge"
layer: "system"
related:
  - "./README.md"
  - "./RULES.md"
  - "../CLAUDE.md"
  - "../AGENTS.md"
  - "../memory-bank/support_modules/knowledge/USEME.md"
source: "基于 2025-10-28 版本重建，并合并 2025-10-14 快照内容"
impact: "为团队与 AI 协作者提供方法论中心的标准使用入口、导航与复用流程"
---

# 05_方法论中心使用指南

> 方法论中心承载 LaunchX 的判断、趋势、结论核心能力，需在进入 `/plan → /do` 前完成上下文加载与能力匹配[[🟣 knowledge/05_方法论中心/README.md:19-92]][[AGENTS.md:36-65]]。

## 1. 使用场景
- **Phase 0 外部大脑**：在进入复杂任务前快速定位对应方法论，确认输入、约束、验证方式[[AGENTS.md:36-65]]。
- **方案设计与质量把关**：依据 7 大业务域方法论（投资、业务服务、技术开发、设计系统、知识管理、品牌传播、深度研究）制定 Collect→Model→Compare→Align 流程[[🟣 knowledge/05_方法论中心/README.md:35-92]]。
- **知识复用与沉淀**：与 memory-bank、Skills、🧩 bmad 的互链保持一致，避免重复造轮子[[🛠️ 系统管理/memory-bank/README.md:5-75]]。

## 2. Phase 0 Checklist
1. 阅读根级 `CLAUDE.md`、`AGENTS.md`、目标域 `README`/`RULES`，加载方法论中心本指南[[AGENTS.md:36-53]][[🟣 knowledge/05_方法论中心/README.md:19-92]]。
2. 检索 `memory-bank/support_modules/knowledge/USEME.md` 与相关专题是否已有解决方案，必要时标注 TODO 缺口[[🛠️ 系统管理/memory-bank/README.md:5-75]]。
3. 若需调用 BMAD 或 Skills，核对 `RULES.md` 命名规范、版本号与互链要求，确保新建或更新文件前完成 `/spec` 审核[[🟣 knowledge/05_方法论中心/RULES.md:45-107]][[RULES.md:37-55]]。

## 3. 目录导航（2025-10-28 结构）

| 能力域 | 目标 | 入口 | 备注 |
| --- | --- | --- | --- |
| 💰 投资决策方法论 | 投资判断、风险评估、策略执行 | `💰 投资决策方法论/专项方法论/` | 包含趋势/案例专项 + archived 历史稿 + 垂直简介 |
| 🏢 业务服务方法论 | AI 共创、咨询、业务转型 | `🏢 业务服务方法论/专项方法论/` | 已迁入历史稿并发布垂直简介，按业务场景引用 |
| 🛠️ 技术开发方法论 | BMAD 混合智能、开发流程、Hook/MCP | `🛠️ 技术开发方法论/专项方法论/` | 已整理专题+archived 文档，并提供垂直简介统筹 |
| 🎨 产品设计系统方法论 | 诱饵式体验、设计系统、图文一体化 | `🎨 产品设计系统方法论/产品设计专项/` | 新版 + archived 合并完毕，含垂直简介 |
| 📚 知识管理方法论 | 反脆弱知识系统、工作流、数据评级 | `📚 知识管理方法论/专项方法论/` | 已包含历史稿（archived）与 20251028 版本，以及垂直简介 |
| 📝 品牌传播方法论 | 品牌叙事、AI 内容创作、传播评估 | `📝 品牌传播方法论/专项方法论/` | 20251028 方法论 + 垂直简介，持续补充案例 |
| 🔬 深度研究方法论 | 趋势研究、碎片库、投资/技术合集 | `🔬 深度研究方法论/专项方法论/` | 合集 + archived 碎片 + 垂直简介规划碎片库 |

> 说明：2025-10-14 历史稿均已迁入各域 `专项方法论/` 并标记 archived，处理状态详见 `mapping.md`。

## 4. 调用流程
1. **识别任务→选定域**：依据需求分类选择对应目录；若跨域，优先确定主域并记录辅助域[[🟣 knowledge/05_方法论中心/README.md:35-92]]。
2. **加载规范→确认命名**：复核 `RULES.md` 的命名规则、frontmatter 模板与版本管理要求，确保新增或恢复文件符合格式[[🟣 knowledge/05_方法论中心/RULES.md:45-170]]。
3. **复用现有资产**：优先引用 `专项方法论` 内文件；若需细化，查找旧稿或碎片库，在文档内以引用或 TODO 标注差异，避免臆造内容[[RULES.md:12-55]]。
4. **记录互链与验证**：更新 Summary 时写明引用文件、验证命令与互链更新路径（README / memory-bank / Skills），若存在缺口需标注责任人[[AGENTS.md:36-53]][[🛠️ 系统管理/memory-bank/README.md:5-75]]。

## 5. 常用工具与复用提示
- **BMAD 知识发现引擎**：调用 5 通道搜索、任务编排、质量评估；执行前确认 `🧩 bmad/USEME.md` 与 `CLAUDE.md` 中的约束[[🛠️ 系统管理/memory-bank/README.md:5-75]]。
- **Skills 生态**：若方法论需转化为技能，参考 `🧠 Launch-X Skills生态系统/README.md` 的技能结构与生命周期（spec→plan→skill→test→deploy）[[🧠 Launch-X Skills生态系统/README.md:88-162]]。
- **memory-bank 支撑**：更新或新增方法论后，需在 `memory-bank/support_modules/knowledge` 中同步索引；缺失时先在 Summary 标记 TODO，等待 Memory Curator 复核[[🛠️ 系统管理/memory-bank/README.md:5-75]]。

## 6. 快速提示词片段

```markdown
你在 LaunchX 方法论中心工作，需要根据 `USEME` 指南完成目标。

步骤要求：
1. 先阅读 `🟣 knowledge/05_方法论中心/README.md` 与 `RULES.md`
2. 按 7 大业务域定位方法论文件
3. 若发现缺失，请在文档中添加 `TODO｜待补充 + 缺口来源`
4. 记录互链更新及验证命令

任务说明：{{在此描述 Collect→Model→Compare 的目标}}
```

```markdown
请基于 `🎨 产品设计系统方法论/产品设计专项/` 中的现有文档，为“图文一体化内容设计”输出执行清单。
要求：
- 引用已有方法论中的核心指标
- 如果需要旧版补充内容，请标注 TODO 并指向 `mapping.md`
- 给出最小验证步骤与互链更新建议
```

## 7. 禁止事项与提醒
- **禁止直接复制旧稿**：必须根据 `RULES.md` 更新命名、frontmatter，并说明差异来源[[🟣 knowledge/05_方法论中心/RULES.md:70-107]]。
- **禁止跳过 `/spec → /plan → /do`**：涉及方法论新增或大规模调整时，需遵循标准流程并输出验证记录[[RULES.md:37-55]]。
- **禁止臆造指标或外部案例**：缺乏事实依据时以 TODO 标注，待来源确认后补充[[RULES.md:12-32]]。
- **提醒**：当前仍有 2025-10-14 文档待恢复，执行任务时需查阅 `analysis.md` 与 `mapping.md` 了解差异状态，避免遗漏。
