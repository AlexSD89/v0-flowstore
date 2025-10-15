---
title: "Gate 登陆页复刻规格"
owners:
  - "LaunchX Codex"
status: "draft"
last_update: "2025-10-15"
related:
  - "./PLAN-20251015-Gate-Landing.md"
source: "自动生成（Codex CLI）"
impact: "定义 Gate 登陆页前端复刻的范围与验收"
---

# 规格文档：Gate 登陆页前端复刻（参考 Rube）

**Spec ID:** `SPEC-20251015-01`  
**标题:** Gate 营销着陆页复刻 Rube 站点  
**创建日期:** 2025年10月15日  
**状态:** `草稿`  
**负责人:** LaunchX Codex

---

## 1. 任务目标（Objectives）

- 复刻 https://rube.app/ 的前端体验，用于 Gate 品牌的营销着陆页。
- 保留 Rube 的信息架构与交互亮点，在视觉与文案上完成 Gate 化改造。
- 输出可在独立域名/静态托管下部署的高质量前端工程，后续可对接后端或表单收集。

## 2. 业务背景

- Gate 产品定位与 Rube 基本一致：围绕 AI Agent / MCP 集成的自动化场景平台。
- 目标受众为技术团队、自动化工程师及中小企业决策人，强调 "让 AI 即刻调用各类 SaaS" 的能力。
- 现阶段仅实现前端，需保证结构清晰，方便后续接入真实数据与分析脚本。

## 3. 交付范围（Scope）

### 3.1 范围内
- Next.js 15（App Router）+ React 19 + TypeScript + Tailwind CSS + Framer Motion 组合的单页应用。
- 页面结构与 Rube 首页保持一致：导航 → Hero → Usecase 分类+卡片 → 合作生态 → 安装入口 → FAQ → CTA → 页脚。
- 文案、CTA、计数器、FAQ 数据通过结构化配置（TS 常量 / JSON）驱动，便于后续接入 CMS。
- 基本动效复刻：Hero 渐入、Usecase 分类切换动画、卡片 hover/点击波纹、Logo 跑马灯、FAQ 手风琴。
- 响应式适配（≥320px 手机、平板、桌面、超宽），深浅色模式切换的预留。
- 可访问性（语义标签、键盘操作、aria 属性）与基础 SEO（meta、OG、结构化数据）。

### 3.2 范围外
- 后端接口与真实账号系统。
- 支付/注册流程、表单提交后处理。
- 多语言切换、Cookie 同意组件、分析脚本接入（预留挂载点）。
- 复杂三维动效（如 Canvas 粒子）。如需后续增强再行立项。

## 4. 信息架构与主要模块

### 4.1 顶部导航（Sticky Header）
- 左侧 Gate 字标 logo（临时采用 SVG 文字标识，待品牌提供正式视觉）。
- 菜单项：`Marketplace`、`Pricing`、`Blog`、`Solutions`（新增 Gate 分类入口，可与 Rube 对齐）、`Language`（预留 icon）。
- 右侧 CTA：`Start for free` 主按钮 + 次级 `Sign in` 链接。
- 滚动到一定距离后增加半透明背景与投影。

### 4.2 Hero & 自动化情景轮播
- 主标题：「让 Gate 为你的 AI 打开世界」；副标题复刻 Rube 结构，突出 "Now your AI can..."。
- 右侧可视化：三步流程节点（Trigger → Action → Result），与 Rube 类似的卡片轮播，展示 Gmail/Slack 等图标。
- CTA 按钮双联动：`Start building with Gate`、`Explore use cases`（锚点跳转到 Usecase 区）。
- 背景使用柔和渐变与噪点纹理，支持暗色模式。

### 4.3 Usecase 分类切换
- Tab 列表：`Featured` / `Productivity` / `Development` / `Research` / `Social Media`（与 Rube 一致）。
- 点击或键盘切换时更新下方卡片，带滑动指示条与轻微缩放动画。

### 4.4 Prompt 卡片网格
- 每张卡片包含：应用图标、标题、主要操作描述、副 CTA（`Try Prompt`）、「N 人在用」计数。
- 数据从配置文件读取，支持按分类过滤。
- Hover 时卡片抬升 + 投影增强，按钮出现轻微动效。
- 小屏使用横向滚动（Snap），桌面展示 2x3 网格，保持与 Rube 高度一致。

### 4.5 合作生态滚动展示（Logo Marquee）
- 标题：「Works with anything you use」。
- 展示多组合作应用 Logo（Claude、Cursor、VSCode、Whatsapp、OpenAI、n8n、MCP 等）。
- 使用 CSS 动画或 Framer Motion 实现无限滚动、方向交错的两行跑马灯，可在 hover 时暂停。

### 4.6 Install Gate Anywhere（渠道/安装方式）
- 模块标题+副标题+描述，列出 Browser Extension、VSCode 插件、CLI 等安装方式。
- 子卡片带图标 + 简述 + CTA（`Install`）。
- 静态展示为主，可增加渐入动画。

### 4.7 行动召唤区（Global CTA）
- 突出背景（渐变块），文案聚焦「Connect anything, automate everything」。
- CTA 按钮 + 次级链接（如 `Book a demo`）。
- 搭配装饰性粒子或网格背景。

### 4.8 FAQ 手风琴
- 复刻 Rube 问题列表（结合 Gate 产品调整用语）。
- 展开/收起带平滑高度动画与 icon 旋转，支持键盘交互与 aria-controls。

### 4.9 页脚
- 左侧品牌介绍 + 联系邮箱占位。
- 中部列出导航：`Enterprise`、`Blog`、`Terms`、`Privacy`、`Trust`。
- 右侧社交链接：X、GitHub、YouTube，使用简单图标（Heroicons / Lucide）。
- 底部版权文字更新为「© 2025 Gate by LaunchX. All rights reserved.」

## 5. 文案与命名映射

| Rube 原文 | Gate 初版文案 | 备注 |
| --- | --- | --- |
| Rube | Gate | 页面 Logo、Title、meta |
| Now your AI can | Gate 让你的 AI 即刻上手 | 保留节奏感 |
| Install Rube Anywhere | Install Gate Anywhere |  |
| Start building with Rube | Start building with Gate | CTA |
| Works with anything you use | Works with anything you already use | 轻微调整语气 |
| FAQ 问题 | 文案保持结构，替换为 Gate 名字与 LaunchX 背书 | 视业务反馈再调 |

> 文案最终稿在 `/plan` 阶段确认，若业务团队有品牌词需替换请备注。

## 6. 技术实现要求

- 框架：Next.js 15 App Router，使用 `src/` 目录结构；启用 TypeScript `strict`。
- 样式：Tailwind CSS + PostCSS；统一引用 `@/styles/tokens.css`（如需新建）。
- 动效：Framer Motion；轻量交互可使用 CSS Transition，避免性能瓶颈。
- 图标与 Logo：优先调用现有开源图标，合作伙伴 Logo 通过 `next/image` 远程加载（需配置 domains）。
- 数据配置：`src/data/usecases.ts`, `src/data/install-options.ts`, `src/data/faq.ts` 等模块化定义。
- 组件拆分：`src/components` 下按模块归档，如 `Hero`, `UsecaseTabs`, `PromptCard`, `LogoMarquee`, `FAQAccordion`, `GlobalCTA`, `Footer`。
- 主题：通过 `next-themes` 或自研 hook 预留暗色模式（当前仅 Light 实现）。
- 国际化：暂不接入 i18n，但文案集中管理，后续可对接。

## 7. 状态管理与数据结构

- Usecase 选项使用本地 `useState` 或 `useOptimistic`，不引入全局状态库。
- Prompt 数据结构示例：
  ```ts
  type PromptCard = {
    id: string;
    title: string;
    description: string;
    category: 'featured' | 'productivity' | 'development' | 'research' | 'social';
    apps: { name: string; iconUrl: string; }[];
    users: number;
    ctaLabel?: string;
  };
  ```
- FAQ 结构：`{ question: string; answer: string; tags?: string[] }`。
- CTA 与导航数据以常量对象维护，方便未来改动。

## 8. 交互与动效细节

- Hero 动效：页面加载时主标题、按钮依次淡入，右侧流程图节点做路径动画。
- Tab 切换：使用 Framer Motion `layoutId` 实现滑块跟随效果。
- 卡片：Hover 抬升（translateY & shadow），按钮 hover 颜色渐变；移动端保持点击波纹。
- Logo 跑马灯：两条队列不同速度滚动，hover/触摸时暂停。
- FAQ：展开时高度动画 + 图标旋转；键盘 Enter/Space 触发。
- 动效时长控制在 200-400ms，遵循平台动效规范。

## 9. 响应式 & 可访问性

- 断点：`sm` 640px、`md` 768px、`lg` 1024px、`xl` 1280px、`2xl` 1536px。
- 320-480px：导航折叠为汉堡菜单；Usecase Tabs 横向滚动；卡片单列滑动。
- 768px 以上恢复为多列布局；Hero 采用左右分栏。
- 采用语义结构（`header/main/section/footer`），CTA 按钮使用 `aria-label` 与 `aria-describedby`。
- Tab、FAQ 支持键盘导航，Focus Ring 与颜色对比达到 WCAG AA。

## 10. 性能、SEO 与可观测性

- 使用 `next/image`、`next/font` 优化资源；外部 Logo 设置尺寸与延迟加载。
- 预渲染首页（`export const dynamic = "force-static"`），为未来静态部署做准备。
- Meta：`title`, `description`, `og:*`, `twitter:*`；构建组织 Schema（JSON-LD）。
- 预留事件埋点接口（`data-analytics-id` 属性），后续可接入 Segment/GA。

## 11. 验收标准

1. 页面结构、模块内容、动效与 Rube 参考站点保持高一致性，品牌命名替换为 Gate。
2. Lighthouse 桌面评分 ≥ 90（Performance/Accessibility/Best Practices/SEO）。
3. 支持 Chrome、Safari、Firefox、Edge 最新两个大版本；移动端 iOS Safari/Android Chrome。
4. 组件化完成，核心数据均可通过配置维护，无硬编码在组件内部。
5. 所有按钮、链接具备 hover 与 focus 状态；键盘导航可访问全部交互元素。
6. 调整窗口尺寸检查无明显布局错乱。

## 12. 风险与假设

- Gate 品牌色与 Logo 尚未确定，暂用 Rube 色系与文字标识；待品牌素材提供后替换。
- Rube 站点后续如果结构更新，需二次比对更新计划。
- 合作伙伴 Logo 的远程加载可能受限于跨域，可准备本地占位图。
- 若后续需要接入真实用例数据，需与后端定义接口；本阶段仅提供静态配置。

## 13. 参考资料

- Rube 官网：https://rube.app/
- HTML 快照：`../../../references/rube-home.html`
- 文案抽取：`../../../references/rube-text.txt`
- 设计动效观察：`../../../references/chunks/` 内相关脚本
- LaunchX 协作规范：`../../../AGENTS.md`、`../../../💻 技术开发/README.md`

---

> 本规格文档确认后，将在 `/plan` 阶段拆解具体实现任务与里程碑。若有新增需求或品牌素材，请在反馈中补充。
