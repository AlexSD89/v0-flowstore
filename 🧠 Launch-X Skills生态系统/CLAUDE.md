---
title: Launch-X Skills开发协作指南
owners:
- LaunchX Skills团队
status: active
last_update: '2025-10-24'
related:
- ./README.md
- ./🎯 Skills生态系统总览-优化版.md
- ./📚 Claude Skills官方标准学习.md
- ../../CLAUDE.md
source: 人工采集
impact: 规范七大Skills的开发流程、质量门槛与协同机制
tags:
- skills
- workflow
---

# Skills CLAUDE.md · Launch-X Skills开发协作指南

> **目标**：让 Claude / Codex 在开发与维护 Launch-X 七大核心 Skills 时，遵循统一流程、质量标准与协同机制，确保“知识 → 技能 → 工作流”的闭环可复用。

---

## 🚀 快速导航
| 阶段 | 核心文档 | 关键收获 |
| --- | --- | --- |
| **标准研读** | [📚 Claude Skills官方标准学习](./📚%20Claude%20Skills官方标准学习.md) | 官方结构、Launch-X 扩展质量清单 |
| **生态全览** | [🧠 Skills生态系统总览](./README.md) | 七大 Skills 定位、目录结构、工作流 |
| **实践指引** | 本文档 | Skills 开发流程、测试与协同规范 |
| **方法论补充** | [🔧 从零到一开发实战指南](../../🟣%20knowledge/f_AI开发技巧/Claude%20Skills从零到一开发实战指南.md) | 30 分钟建设 Skills 的实操步骤 |

---

## 🎯 Skills开发的四条底线
1. **官方标准优先**：遵循 Claude Skills 模块化结构（`SKILL.md` + `instructions.md` + `scripts/` + `resources/` + `tests/`）。  
2. **单一职责**：七大核心 Skills（1/2/3/4/5/6/8）必须各司其职，新增能力先确认与现有技能不冲突。  
3. **可验证性**：每个技能提供最少一份手动测试清单；关键脚本须规划 smoke test。  
4. **知识回写**：所有产出 24 小时内回写知识库，并更新 frontmatter/related 索引。

---

## 🧱 Phase 0 Checklist（每次开发前确认）
- [ ] 核对需求是否已在 `plans/` 或 `specs/` 立项，明确验收标准。  
- [ ] 查看 `🧠 Skills生态系统总览/README.md`，确认 7 个技能的职责边界。  
- [ ] 查阅 `tests/test-plan.md`，了解现有验证覆盖情况。  
- [ ] 检查知识资产是否齐全（🟣 knowledge、templates、历史案例）。  
- [ ] 预热必要脚本/数据（如 `scripts/` 下的工具或 MCP 服务）。

---

## 🔧 Skills开发标准流程
```mermaid
graph TD
  A[需求澄清] --> B[方案确认]
  B --> C[目录就绪]
  C --> D[文档编写]
  D --> E[脚本与资源]
  E --> F[测试与回归]
  F --> G[归档与回写]
  G --> H[生态更新]
```

### 1. 需求→方案（Spec → Plan）
- 明确技能服务的业务场景、输入输出、依赖知识域。  
- 对照 7 个 Skills 现况，判断是增强现有能力还是新增扩展包。  
- 形成 `/plan` 清单，经负责人确认后进入 `/do`。

### 2. 目录就绪
标准结构如下：
```
技能目录/
├── SKILL.md
├── instructions.md
├── README.md
├── scripts/
├── resources/
└── tests/
```
- **新增文件须补 frontmatter**，确保标题、owners、last_update、related 字段齐全。  
- `related` 中至少包含 `instructions.md`、`README.md` 以及关键知识库引用。

### 3. 文档编写
- `SKILL.md`：使用标准模板，补充参数、输出示例、性能指标。  
- `instructions.md`：明确角色定位、流程拆解、质量检查点。  
- `README.md`：写清使用方式、目录说明、协同建议、质量清单。  
- `tests/test-plan.md`：列出手动测试场景与待办的自动化用例。

### 4. 脚本与资源
- `scripts/`：重要脚本需包含 docstring、使用示例和回滚提示。  
- `resources/`：存放模板、样本数据、配置；结构化数据优先 JSON/CSV。  
- 任何脚本/资源更新需同步在 README/测试计划中说明。

### 5. 测试与回归
- 根据 `tests/test-plan.md` 完成最小验证，记录执行日期与结果。  
- 若脚本有自动化能力，可在 `scripts/ci/` 或测试计划中备注 TODO。  
- 发现风险需回写到 Summary，并与相关技能负责人沟通。

### 6. 归档与回写
- 输出先存入 `🤖 AI生成 auto-generated/YYYYMMDD/`，审核后归档至目标目录。  
- 更新涉及文档的 frontmatter `last_update`。  
- 若影响全局索引，记得同步 `memory-bank/`、根 README 或其他指挥文档。

### 7. 生态更新
- 目录结构/责任分工有变动时，更新 `🎯 Skills生态系统总览-优化版.md`。  
- 新增测试、脚本或流程需在 Summary 中说明并通知相关协作者。

---

## ✅ 质量与性能标准

### 输出质量
- 结构化：执行摘要 + 主体 + 行动项/指标。  
- 可溯源：关键结论引用数据、知识库或案例路径。  
- 行动化：输出包含负责人、节点或下一步建议。  
- 语言规范：对外文档优先中文，涉及技术脚本可中英结合。

### 性能门槛
- Skills 响应时间控制在 3–8 分钟。  
- 复杂调用需在 Summary 中注明预估耗时与资源占用。  
- 对外输出前须保证前一次回归不超过 7 天。

### 合规提醒
- 禁止引用未授权数据源或不明渠道信息。  
- 涉及公司机密/合规风险的场景需在 Summary 明确标红，并提出升级路径。

---

## 🔄 七大Skills协同策略
- **投资三角（1️⃣+2️⃣+3️⃣）**：商业决策支持、企业研究、市场情报联动，形成投资闭环。  
- **知识回写（4️⃣）**：所有技能输出由知识管理大师沉淀，维护索引与版本。  
- **项目交付（5️⃣+6️⃣+8️⃣）**：项目架构 → 技术设计 → 深度学习三段式，实现产品化落地。  
- **跨技能引用**：在各 README/Instructions 中标注协同触发条件及回滚方案。

---

## ❓ 常见问题
| 问题 | 诊断步骤 | 处理建议 |
| --- | --- | --- |
| 技能职责重叠 | 查阅 `🎯 Skills生态系统总览-优化版.md` 和历史 Summary | 重走 `/spec`，安排能力迁移或合并 |
| 输出质量不稳 | 检查 `instructions.md` 是否缺失质量门槛 | 补充验证步骤、引用来源、示例 |
| 测试缺失 | 查看 `tests/test-plan.md` 是否记录最近回归 | 先手动验证记录时间，再排期自动化 |
| 知识回写遗漏 | 对比知识库索引与 Summary | 及时补齐 frontmatter / related / README |

---

## ♻️ 持续改进
- **反馈闭环**：Summary 中记录风险或用户反馈，定期整理到 `🟣 knowledge/09_周报月报`。  
- **案例沉淀**：将优秀调用案例、外部标杆事件沉淀至 `🟣 knowledge/07_市场项目档案`。  
- **能力升级**：新增技能或重大改版需先在 `plans/` 输出影响评估与回滚策略。  
- **生态同步**：每次大更新后在 `README.md` 与根级指挥文档中写明变更摘要。

> 将本指南与七大 Skill 的 README、测试计划配合使用，即可在 Launch-X 生态中实现高标准、可追踪、可复用的技能建设流程。
