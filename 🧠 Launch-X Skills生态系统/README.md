---
title: "Launch-X Skills 生态系统总览"
owners:
  - LaunchX Skills 团队
status: active
last_update: '2025-10-31'
related:
  - ./AGENTS.md
  - ./CLAUDE.md
  - ./🎯 Skills生态系统总览-优化版.md
  - ./📚 Claude Skills官方标准学习.md
source: 本地技能资产
impact: "统一管理 Claude Code Skills 的定义、验证与回写，支撑跨域协同"
---

# Launch-X Skills 生态系统

> **愿景**：将知识域的复盘、案例与方法论转化为可复用的 Claude Code Skills，使“知识 → 技能 → 工作流”形成闭环。
>
> 📌 **写作原则**：所有内容基于仓库内的技能定义、脚本、验证记录。引用官方标准时需注明差异；新增或调整技能后，务必同步 `CLAUDE.md`、`AGENTS.md` 与相关方法论，并遵循 `📖README-LaunchX系统总体指南.md` 中的目录配套约定。

---

## 🚀 快速入口
- 📋 [Skills 生态系统指挥总则](./AGENTS.md) —— 角色分工、质量门槛、交付流程  
- 🔧 [Skills 开发协作指南](./CLAUDE.md) —— Collect → Align → Deliver 工作流、验证要求  
- 📚 [Claude Skills 官方标准学习](./📚%20Claude%20Skills官方标准学习.md) —— 官方规范与 LaunchX 扩展说明  
- 🎯 [生态系统概览（优化版）](./🎯%20Skills生态系统总览-优化版.md) —— 精简地图、互联关系  
- 🧠 

---

## 🧭 技能架构概览
| Skill | 角色定位 | 核心来源目录 | 代表产出 |
| --- | --- | --- | --- |
| 1️⃣ 商业决策支持专家 | 投资与商业价值评估 | 🟣 knowledge/02·05、c_AI投资研究 | 投资分析、ROI 测算、风险提示 |
| 2️⃣ 企业研究分析师 | 企业尽调与行业研究 | 🟣 knowledge/03·04 | 企业档案、行业研究、竞争分析 |
| 3️⃣ 市场情报专家 | 市场趋势与机会识别 | 🟣 knowledge/07、e_AI技术栈趋势 | 市场洞察、竞品情报、机会地图 |
| 4️⃣ 知识管理大师 | 知识库整理与内容运营 | 🟣 knowledge/01·08·09 | 知识归档、自动化报告、内容路线图 |
| 5️⃣ 项目架构规划师 | 项目初始化与流程治理 | study/项目规划、💻 技术开发 | 项目结构基线、流程规范、风险矩阵 |
| 6️⃣ 技术设计专家 | 技术方案与架构设计 | 💻 技术开发、study、Gate-OS 资料 | 技术选型、架构草图、部署策略 |
| Codex-ClaCode 联动 | Codex CLI + Claude Code 安全协作 | 🧠 Launch-X Skills生态系统/codex-claudecode协作 | 审批对齐的 Codex 命令模板、验证与回滚提示 |
| 8️⃣ 深度学习专家 | 模型研发与学习路径 | study、🟣 knowledge/方法论 | 学习计划、训练方案、部署优化 |

> 每个技能目录下必须包含：`README.md`（能力说明）、`instructions.md`（提示模板）、`scripts/`（执行脚本）、`tests/`（验证计划）、`resources/`（素材），并记录回滚方案。

---

## 🔄 协同工作流示例
### 1. 投资决策闭环
1. **Skill 1 商业决策支持专家** → 价值评估与 ROI 测算  
2. **Skill 2 企业研究分析师** → 企业档案与行业深潜  
3. **Skill 3 市场情报专家** → 市场趋势与竞品对标  
4. **Skill 4 知识管理大师** → 生成综合决策报告并回写知识库

### 2. AI 产品化交付流
1. **Skill 5 项目架构规划师** → 项目结构与里程碑  
2. **Skill 6 技术设计专家** → 技术方案与非功能指标  
3. **Skill 8 深度学习专家** → 模型方案、训练计划、部署指导  
4. **Skill 4 知识管理大师** → 归档交付物、生成维护 SOP

---

## 📝 写作与维护要求
- **信息来源**：主张本地事实优先（技能脚本、执行日志、回滚记录）；外部仅限官方标准作对照补充。
- **输出颗粒度**：  
  - `README.md` —— 描述角色定位、依赖目录、协同接口、验证要求。  
  - `instructions/` —— Claude 提示模板，需附示例与注意事项。  
  - `scripts/` —— 可直接运行的脚本或调用封装，注释输入输出。  
  - `tests/` —— 手动/自动验证手册，注明通过条件与回滚步骤。  
- **互链要求**：技能更新后，需在相关方法论、工具、bmad 文档中记录引用关系；Summary 标注“Skills 生态已更新”。
- **巡检节奏**：每月对技能可用性与覆盖率进行复查（见 `CLAUDE.md` 巡检章节），并将结果回写 `🛠️ 系统管理/memory-bank/support_modules/skills/`。

---

## ✅ 维护清单
```
[ ] 新增/修改技能前，完成 `/spec` → `/plan` 审核流程
[ ] 更新技能目录的 README、instructions、scripts、tests、resources
[ ] 同步 memory-bank、方法论中心与相关工具文档的互链
[ ] 记录验证日志与回滚方案，存档于技能目录或 bmad 日志
```

> Skills 生态是 Claude Code 的能力中枢。请按以上要求维护，确保技能与知识、工具、自动化保持同步，持续支撑 LaunchX 的跨域协作。
[全局协作哲学](../🟣%20knowledge/05_方法论中心/🎯%20claudecode-全局设计哲学.md) —— 技能设计的理论基线