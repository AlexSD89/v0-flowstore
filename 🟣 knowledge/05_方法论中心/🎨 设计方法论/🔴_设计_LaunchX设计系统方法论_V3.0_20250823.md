---
title: "20250823-LaunchX设计系统方法论_v3.0"
owners: ["Design Guild"]
status: published
last_update: 2025-08-23
related: ["memory-bank/support_modules/design/USEME.md", "memory-bank/README.md"]
source: ["内部设计评审", "jserTang AI Context 最佳实践"]
impact: "指导 LaunchX 设计体系的 Landing → 功能页设计、动画规范与实现流程"
---

# LaunchX 设计系统方法论 v3.0

## 01. 使命与使用范围
- **使命**：统一 LaunchX 前台体验，兼顾“专业可信 + 情绪诱导”，以“动画诱饵”让用户顺滑进入真实功能。
- **适用场景**：品牌站点、Landing Page、AI 协作控制台 `/chat`、设计宣传物料。
- **执行角色**：设计 Guild、前端实现、内容与品牌团队、Claude Code（参考 `CLAUDE.md` 提示模板）。

## 02. 设计哲学与原则
| 原则 | 说明 | 实践要点 |
| --- | --- | --- |
| 诱饵式体验 | 首屏负责“吸引”，功能在二级页 | 主页只做视觉/情绪，功能在 `/chat` |
| 情绪驱动 | 好奇 → 兴趣 → 点击 → 体验 → 转化 | 视觉冲击、角色故事、强 CTA |
| 专业可信 | 即使有趣也要保持专业度 | 色彩、排版、动效均需有品牌逻辑 |
| 丝滑转场 | 点击后体验不能断层 | 1.5s 内完成转场 + 角色状态切换 |

## 03. 页面架构蓝图
### 3.1 主页（Landing）
```
品牌标识区
│
├─ 粒子背景（50 个粒子 + 连接线）
│
├─ AI 专家环绕协作动画（6 位角色 + 思考气泡）
│   └─ 中心协作 Hub + 状态轮询
│
├─ CTA：立即体验（主） / 观看演示（次）
│
└─ 额外信任元素（合作 Logos / 指标）
```

### 3.2 功能页（/chat）
```
左侧：AI 专家面板（状态、角色、任务）
中部：实时对话区（70%） + 输入框、进度条、建议
右侧：推荐卡片与成果快照（30%）
```

## 04. 动画与交互系统
### 4.1 AI 专家环绕动画
```typescript
const aiExperts: AIExpert[] = [
  { id: 'alex', color: 'emerald', icon: 'Users', thinking: '理解需求中...' },
  { id: 'sarah', color: 'blue', icon: 'Code', thinking: '技术评估中...' },
  { id: 'mike', color: 'purple', icon: 'Palette', thinking: '体验设计中...' },
  { id: 'emma', color: 'orange', icon: 'BarChart', thinking: '数据分析中...' },
  { id: 'david', color: 'cyan', icon: 'Calendar', thinking: '项目规划中...' },
  { id: 'catherine', color: 'pink', icon: 'Target', thinking: '战略分析中...' }
]

const expertAnimation = {
  layout: 'hexagon',
  hoverScale: 1.1,
  bubbleAnimation: 'fade-up',
  linkPulse: true,
  rotation: 'auto-orbit'
}
```

### 4.2 粒子背景系统
```typescript
const particleSystem = {
  count: 50,
  motion: 'brownian + gravity',
  color: 'rgba(255,255,255,0.35)',
  connectLines: true,
  pointerInteraction: 'attract',
  performance: 'transform3d + requestAnimationFrame'
}
```

### 4.3 转场动画（Landing → /chat）
| 步骤 | 时长 | 说明 |
| --- | --- | --- |
| 1. 圆形遮罩放大 | 0.5s | 以点击点为中心，铺满画面 |
| 2. 启动提示浮层 | 0.3s | “启动 AI 专家团队...” |
| 3. 专家状态切换 | 0.4s | 环绕角色由“展示”→“激活” |
| 4. 功能区淡入 | 0.3s | `/chat` UI 显示，保留过渡元素 |

## 05. 品牌与视觉系统
| 元素 | 规范 |
| --- | --- |
| 色板 | 主色 #1F8EFA，辅色 #9B51E0/#2ECC71 等 | 
| 字体 | Inter / HarmonyOS Sans；标题 48-64px，正文 16-18px |
| 图标 | Lucide 系列+自制线条，统一线宽 1.5 |
| CTA | 主按钮采用渐变 + 亮边阴影，次按钮细描边 |
| 视觉素材 | 粒子背景、角色插画、品牌图标需存于 `🎨 设计美学资源库/` |

## 06. 交付清单
- `Figma` 组件库：`🎨 设计美学资源库/UI设计素材库/`
- 动画原型（视频/GIF）：同目录 `Animations/`
- 前端实现指南：`memory-bank/support_modules/design/USEME.md`
- 体验文档：本方法论 + `memory-bank/README.md` 中的提示片段

## 07. 质量评估
| 维度 | 指标 |
| --- | --- |
| 转化流程 | CTA 点击率、转场完成率 |
| 品牌一致性 | 色板/字体/组件符合规范，审核通过率 |
| 性能 | 首屏 < 2.5s，转场动画 < 1.5s |
| 复用率 | 设计组件/动效被 2+ 页面引用 |

## 08. 实施步骤（给设计 & 前端）
1. 按本方法论搭建 Landing / `/chat` 原型。
2. 将成品组件、动效上传 `🎨 设计美学资源库` 并在 README 标注版本。
3. 参照 `memory-bank/support_modules/design/USEME.md` 提供的导入路径与注意事项完成前端实现。
4. 验证动画与性能指标，记录日志于 `memory-bank/README.md`（Design update）。
5. 在 Summary 中说明“设计方法论/资产已更新”，通知相关团队复用。

## 09. 变更记录
- **v3.0（2025-08-23）**：定义“动画诱饵”策略、Landing ↔ `/chat` 架构、动效系统与质量指标。
- 旧版本（v1.0/v2.0）存档于 `🎨 设计方法论/archive/`，仅供参考，不再使用。
