---
title: Claude Code AI短剧全流程升级建议指南
owners:
  - LaunchX Codex
status: draft
last_update: 2025-10-24
related:
  - CLAUDE.md
  - 🟣 knowledge/claude code 使用研究库/20251024-Claude-Code短剧编剧团队多Agent协作系统案例研究.md
  - 🟣 knowledge/claude code 使用研究库/20251024-Claude-CodeAI短剧使用规律指南.md
  - 🟣 knowledge/claude code 使用研究库/20251024-网文改编短剧提示词框架-使用规律指南.md
source:
  - "飞书文档：https://feicaiclub.feishu.cn/wiki/L1P1w1Uuuiid5gksrVtceOMunxQ（公开页面及试读信息）"
  - "QuestMobile《2024微短剧用户洞察》公开版、巨量引擎行业分享（公开资料）"
origin: 自动生成
impact: 支持Claude Code短剧团队复用飞书框架并升级为数据驱动的全流程闭环。
---

# Claude Code AI短剧全流程升级建议指南

> 面向 LaunchX 短剧业务线，梳理飞书文档核心做法，结合 2024-2025 行业趋势与外部最佳实践，形成可直接落地的流程、工具与指标升级方案。

## 1. 文档定位
- **目标角色**：短剧编剧主力、项目制片、AI 编排工程师、数据分析师。
- **交付结果**：标准化创作流水线、度量指标体系、迭代 SOP、工具链升级建议。
- **使用方式**：先对照第 2、3 章复盘现状，再按第 4-6 章落地迭代，第 7 章作为风险检查表。

## 2. 飞书文档核心要点复盘
- **多 Agent 编剧体系**：主编剧 / Script Aligner / Script Recorder 三角协作，强调 PASS/FAIL 审核与创作记忆（见 `20251024-Claude-Code短剧编剧团队多Agent协作系统案例研究.md`）。
- **分镜生成链路**：Nano Banana 等视觉工具负责镜头构图、角色定位、景别与转场设计，确保视觉表现力。
- **网文改编框架**：四步流程（内容拆解→结构重组→视觉转写→剧本输出），辅以角色档案库与剧本评估模块（参考 `20251024-网文改编短剧提示词框架-使用规律指南.md`）。
- **Claude 官方渠道要求**：优先 Claude 3.5 Sonnet 官方 Web/App，避免第三方 API 引起系统 prompt 缺失。

## 3. 行业与平台趋势要点
- **市场规模**：QuestMobile 2024 数据显示微短剧市场规模 504.4 亿，预计 2027 年破 1000 亿；抖音短剧播放量同比 +350%，说明“爽点密度+付费转化”仍是商业核心。
- **平台算法偏好**：重点看 3s-10s 观感、剧情节奏、评论复盘；平台强调“前三集免费 + 20 集付费断点”常规设计。
- **用户行为**：重度用户日均 10 集以上，偏好“强反差开头 + 高频反转 + 情绪触发”结构；女性 25-34 岁群体在家居休闲时段消费峰值明显。

## 4. 升级策略（较飞书原文的增强建议）
- **多 Agent 拓展**：在原三角基础上新增三类角色：  
  1. *Audience Analyst*（数据分析）负责拆解平台留存/付费数据并驱动脚本重写；  
  2. *Compliance Reviewer*（合规校验）覆盖题材审核、版权风险、平台红线；  
  3. *Performance Optimizer*（实验驱动）针对象限、台词密度等指标给出 AB 方案。
- **内容产品化**：沉淀“爽点模板库”“人物冲突卡片”“转场包”，并在 `memory-bank/` 建立索引，快捷调用。
- **数据驱动迭代**：结合巨量引擎公开指标，建立“Hook 留存-转化”双指标表：  
  - `Hook 留存`（3s、10s、首集完播率）；  
  - `付费转化`（第 18/20 集强转点、次日付费率、付费后留存）。  
  将指标写入 Script Recorder 的字段并自动同步至 `script.progress.md`。
- **分镜到成片链路**：Nano Banana 输出 16:9 与 9:16 双版本，配合 Runway/Pika/HeyGen 做快速 previz；同时形成镜头资产库（Shot Bank）便于重复调用。
- **自动化补强**：  
  - 通过 Claude Code Template + shell task 实现批量生成 episodes/EP-XX.md；  
  - 利用 `sg` / `rg` 自动审查剧本中的敏感词、冗长对话（>15 字）。
- **商业化设计**：引入“付费情绪阶梯”（第 5 集情绪爆发 → 第 12 集反转 → 第 18 集危机 → 第 20 集付费点）模板，保证剧本在标准节点有明确钩子。

## 5. Prompt 与配置升级
- **Claude Output Style 增强**：在 `Description` 加入“支持按照平台指标输出剧情+指标预测”，`Instruction` 增补“每集附上爽点标记和预估留存曲线建议”。  
- **Aligner 审核 Prompt**：增加三类检查项：  
  1. Hook 指标预估（3s/10s/全集完播率）；  
  2. 付费窗口是否含“强事件 + 未解答悬念”；  
  3. 合规扫描（题材、广告、隐私）。  
- **Recorder 模板**：结构化记录字段示例：
```yaml
episode: EP-05
status: in_progress
hook_moment: "00:05 离婚协议摔桌"
retention_note: "预估10s留存85%，建议剪短律师对白"
paid_trigger: "EP-20 前夕设置反转：亲子鉴定出错"
next_action: "Aligner复核冲突逻辑"
```
- **Cross-Tool 组合**：对接 `Nano Banana` 分镜 prompt、`HeyGen` 演员配音脚本模板、`Runway` 视觉风格 preset，形成可复用的 prompt bundle。

## 6. 度量与验证流程
- **周度例行**：  
  - 数据侧：汇总平台留存、付费、评论关键词，更新至 `memory-bank/AI短剧数据面板.md`；  
  - 创作侧：脚本 PASS 率、修改轮次、生成用时。  
- **AB 测试 SOP**：  
  1. 明确单变量（如开场台词、景别）；  
  2. 使用 Claude 生成 A/B 剧本与分镜；  
  3. 通过小流量投放或灰度上线验证；  
  4. Recorder 回写实验结论与下一步动作。  
- **质量门槛**：上线前需满足：Hook 留存 ≥80%，首付费集停留率 ≥55%，违规风险零件。

## 7. 风险与合规清单
- **题材限制**：规避涉政、涉黄、变相赌博；敏感历史需审核。  
- **版权与肖像**：改编前确权 IP；分镜人物不直接引用明星肖像。  
- **数据安全**：脚本草稿与项目数据统一存储在 LaunchX 私有空间，避免外泄。  
- **模型调用**：遵守 Claude 官方渠道政策，记录每次 prompt 版本与输出日志，必要时可追溯。

## 8. 落地路线图（建议）
| 时间 | 核心动作 | 产出 |
| --- | --- | --- |
| 0-2 周 | 建立多 Agent 扩展角色、完善 CLAUDE 配置、梳理现有项目目录 | 新版 `.claude/agents`、`Shot Bank` 草稿 |
| 2-4 周 | 导入指标体系 & Recorder 字段，完成首轮剧本-分镜-指标联动实验 | 试点剧集 + 数据看板（周报） |
| 4-8 周 | LaunchX 视频团队联合试拍，验证付费转化模板，形成 SOP | 《短剧创作工作手册 1.0》、风险清单 |

## 9. 参考与后续任务
- [飞书文档：AI 短剧专题](https://feicaiclub.feishu.cn/wiki/L1P1w1Uuuiid5gksrVtceOMunxQ)（需登录）  
- 巨量引擎 2024 微短剧行业分享、QuestMobile 行业洞察（公开节选）  
- 内部 TODO：  
  - [ ] 在 `memory-bank/` 建立短剧数据面板与指标解释文档  
  - [ ] 更新 `CLAUDE.md`，同步新增 Agent 与审核规则  
  - [ ] 为 Shot Bank 制作素材归档流程

---

*自动生成 · LaunchX Codex · 2025-10-24*
