---
title: "Gate 营销着陆页开发计划"
owners:
  - "LaunchX Codex"
status: "draft"
last_update: "2025-10-15"
related:
  - "./SPEC-20251015-Gate-Landing.md"
source: "自动生成（Codex CLI）"
impact: "规划 Gate Landing 前端交付路径"
---

# Gate Landing Page 开发计划

## 1. 目标回顾
- 按 `SPEC-20251015-01` 复刻 Rube 首页体验，完成 Gate 品牌化改造。
- 交付可扩展、可维护的 Next.js 15 + React 19 单页应用，并预留后续集成空间。

## 2. 里程碑与时间线（预估 1.5 周）
| 阶段 | 时间 | 核心产出 |
| --- | --- | --- |
| M1. 基础搭建 | D0-D2 | Next.js 项目脚手架、Tailwind/Framer 配置、全局样式与主题预留 |
| M2. 结构搭建 | D2-D5 | 导航 + CTA、Hero 粒子场景、Usecase Tabs & Prompt 卡片、Logo 跑马灯 |
| M3. 价值呈现 | D5-D7 | 实时 Demo、客户证言、FAQ、Global CTA、Footer、配置化数据 |
| M4. 质检交付 | D7-D8 | 自测报告、Lighthouse 结果、可访问性校验、交接文档 |

> 时间线基于 8 个工作日估算，具体可随资源调整。

## 3. 任务拆解

1. **项目初始化**
   - 使用 `create-next-app` 或内部模板构建项目，启用 App Router + `src/` 结构。
   - 集成开发工具：ESLint、Prettier、Tailwind、Framer Motion、Husky（如需）。
   - 配置基础布局（`layout.tsx`）、全局 CSS、颜色/字体 Token。

2. **核心结构实现**
   - `Navigation`：Sticky header、滚动透明度、移动端 Drawer；主 CTA 触发圆形遮罩转场。
   - `HeroSection`：粒子/能量环背景 + 三节点流程演绎（Trigger → Action → Result），双 CTA 分别承接自助体验与销售线索。
   - `UsecaseTabs` + `PromptGrid`：Tab 状态管理、配置化数据；卡片含用例指标与「Why Gate recommends this」。
   - `LogoMarquee`：双行滚动生态 Logo + Agent 头像，hover 暂停，突出可信度与广度。

3. **价值与可信度呈现**
   - `InstallGateAnywhere`：整合浏览器扩展、VSCode 插件、CLI 的卡片组件。
   - `WorkflowDemo`：嵌入交互式终端或视频占位，展示 Gmail/Slack 工作流。
   - `Testimonials` 与 `FAQAccordion`：引用客户证言、关键问答，支持键盘与屏幕阅读器。
   - `GlobalCTA` + `Footer`：对齐品牌语调，补充联系渠道与社交链接。

4. **数据配置与国际化预留**
   - 在 `src/data/` 建立 `navigation.ts`, `usecases.ts`, `install-options.ts`, `faq.ts` 等常量。
   - 确保文案集中存放，后续便于接入 CMS 或 i18n。
   - 设计 Hook `useThemeToggle` 预留深浅色切换。

5. **质检与交付**
   - 编写自测脚本：`pnpm lint`, `pnpm test`, `pnpm format:check`。
   - 使用 Lighthouse（桌面 + 移动）、axe DevTools 验证性能与无障碍。
   - 生成交接清单：部署指引、配置项说明、未来迭代建议。
   - 更新 `README` 与 `USEME`（如需），附上 Demo 截图与核心指标。

## 4. 资源依赖
- 参考资料：`../../../references/*`、`../../../memory-bank/support_modules/design/USEME.md`。
- 复用组件：`💻 技术开发/01_公司项目ing 🚀/me2-better-you-main/src/components/nexus` 中的 Persona/CTA 模块。
- 设计物料：待品牌团队提供 Gate Logo 与配色；临时使用 LaunchX 设计系统色板。

## 5. 风险缓释
- **品牌资产延迟**：提前定义占位方案，收到素材后在单独分支替换。
- **动效性能**：粒子/能量环先用 CSS/渐变，必要时再接入 Canvas；设置 `prefers-reduced-motion` 降级。
- **跨团队沟通**：关键节点在 `plans/PLAN-20251015-Gate-Landing` 中记录进度（迁移前先保留草稿）。

## 6. 下一步行动
- [ ] 制作 `/spec` 审阅 checklist，确认范围与验收。
- [ ] 在 `🤖 AI生成 auto-generated/20251015/gate-landing/` 维护草稿，审阅通过后迁移到 `study/specs/`、`plans/`、`study/research/`。
- [ ] 与设计、业务负责人同步时间线与资源需求。

---

> 本计划为自动生成草稿，待人工校对后方可迁移至正式目录。
