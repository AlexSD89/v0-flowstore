## Me² 界面规范与组件库（UI Spec）

### 1. 设计目标与原则
- 一致性：跨 Info² / Invest² 场景统一交互与视觉语言。
- 高信息密度：以“分析工作台”为核心，优先展示关键因子与可操作建议。
- 可扩展：组件可配置、可组合、支持插件化与多主题。
- 可达性：AA 对比度、键盘导航、屏幕阅读友好。

### 2. 设计令牌 Design Tokens
```css
:root {
  /* 色彩 */
  --color-bg: #0B0D10;          /* 暗色默认背景 */
  --color-bg-elevated: #111418; 
  --color-surface: #151A20;     
  --color-border: #2A3139;
  --color-text: #E6E8EB;        
  --color-subtext: #A8B0B9;
  --color-primary: #7C5CFF;     /* 品牌主色 */
  --color-primary-600: #6B4CF5;
  --color-primary-700: #5A3EE6;
  --color-success: #2ECC71;
  --color-warning: #F5A623;
  --color-danger:  #FF5A5F;

  /* 语义状态 */
  --intent-info: var(--color-primary);
  --intent-positive: var(--color-success);
  --intent-caution: var(--color-warning);
  --intent-negative: var(--color-danger);

  /* 排版 */
  --font-sans: "Inter", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  --font-size-12: 12px; --font-size-14: 14px; --font-size-16: 16px;
  --font-size-18: 18px; --font-size-20: 20px; --font-size-24: 24px; --font-size-32: 32px;

  /* 间距 & 圆角 */
  --space-4: 4px; --space-8: 8px; --space-12: 12px; --space-16: 16px;
  --space-20: 20px; --space-24: 24px; --space-32: 32px;
  --radius-6: 6px; --radius-8: 8px; --radius-12: 12px;

  /* 阴影 & 透明度 */
  --shadow-1: 0 2px 8px rgba(0,0,0,.25);
  --shadow-2: 0 8px 24px rgba(0,0,0,.35);
  --alpha-60: rgba(255,255,255,.06);
  --alpha-12: rgba(255,255,255,.12);

  /* 动效 */
  --ease-standard: cubic-bezier(.2,.8,.2,1);
  --duration-quick: 120ms; --duration-normal: 200ms; --duration-slow: 320ms;
}
```

明亮主题在 `prefers-color-scheme: light` 下反转主背景/文本并降低阴影不透明度（具体 token 映射见 `tokens.light.css`）。

### 3. 栅格与布局
- 宽屏分析工作台：12 栅格，容器最大宽度 1440px，列间距 24px。
- 窄屏（≤ 960px）：切为 4/6 栅格，卡片纵向堆叠，保留顶部操作条。
- 固定区域：
  - 顶部：全局导航/搜索/用户区。
  - 左侧：功能导航（收起时宽 72px，展开 280px）。
  - 内容：可分为“上下”或“左右”两区，支持拖拽分栏与布局持久化。

### 4. 组件库（核心组件）

#### 4.1 基础输入与操作
- 按钮 Button：`primary | secondary | ghost | danger`，尺寸 `sm | md | lg`。
- 输入框 Input：支持前后缀、语义校验、清除、loading；搜索框内嵌命令提示（/ 指令）。
- 选择器 Select：单/多选、带搜索、虚拟滚动；标签溢出折叠为 `+N`。
- 开关 Switch、复选框 Checkbox、单选 Radio：对齐 16px 基线网格。

#### 4.2 信息与反馈
- 提示 Tooltip / 气泡 Popover：延时 200ms 出现，移动端改为 Bottom Sheet。
- 通知 Toaster：右上角堆叠，最多 3 条；重要事件转系统通知。
- 进度 Progress：线形/环形；任务流使用分段进度（见 6.3）。

#### 4.3 布局与数据
- 卡片 Card：标题、操作、内容区；可折叠、可固定；支持密度 `comfortable | compact`。
- 列表 List / 表格 Table：
  - 表格列类型：文本、标签、评分、状态点、趋势微图、操作。
  - 冻结列、列宽拖拽、列配置保存到用户偏好。
  - 空状态：展示引导与示例数据导入。

#### 4.4 导航
- 顶部导航 TopBar：含全局搜索、最近任务、分身切换、通知、用户菜单。
- 侧边导航 SideNav：分区 Info² / Invest² / Settings；支持子组折叠与收起模式。
- 标签页 Tabs：用于工作台内多视角切换（概览 / 证据 / 推理 / 建议 / 日志）。

#### 4.5 Me² 专属组件
- 分身卡 AvatarCard：头像、领域、版本、准确率、近 7 天满意度；快捷操作：启用/停用、分享范围（private/friends/public）。
- 分身创建向导 AvatarWizard（4 步）：访谈 > 引擎集成 > 验证 > 激活（详见交互 6.2）。
- 分析结果卡 InsightCard：标题、要点（3-5）、证据锚点、置信度、行动建议。
- 质量评分条 QualityBar：综合评分 + 维度拆分（准确/完整/相关/专业/可用）。
- 协作房间面板 CollaborationPanel：成员、实时事件流、任务面板、反馈窗。

### 5. 页面模板（核心页面）
1) 登录 / 首次体验
- 支持 magic link 与 OAuth；新用户展示 3 分钟引导与示例。

2) 仪表盘 Dashboard
- 我的小队（分身）/ 最近任务 / 质量趋势 / 系统告警；全部卡片可重排与固定。

3) 分身创建 Me² Wizard
- 步骤进度、草稿保存、随步验证；最后提供预估准确度与可改进提示。

4) 信息分析工作台 Info²
- 左：查询与上下文；中：洞见/证据/推理；右：行动建议与质量评分。
- 顶部：隐含需求抽取开关、交叉验证阈值、导出报告。

5) 投资分析工作台 Invest²
- 7 维度评估卡、风险雷达、投资人匹配、条款建议；支持一键生成投资备忘录。

6) 任务详情页
- 进度流（时间轴）+ 中间结果快照 + 反馈记录；失败步骤可重试或编辑参数再跑。

7) 协作房间
- 参与者状态、任务进展共享、实时反馈广播、重要变更确认对话框。

8) 设置与偏好
- 主题、密度、快捷键、数据导出、可见性与分享范围、隐私与合规。

### 6. 交互细节（与 06_数据交互 对应）
- 任务进度：采用 WebSocket 分段事件（10/25/50/75/90/100）。
- 结果质量 < 阈值（默认 0.8）自动触发二次优化，UI 以微型流程条展示二次迭代。
- 反馈面板：`👍/👎` + 结构化原因（内容/结构/证据/语气/时效）+ 可选即时调整项。

### 7. 无障碍与可用性
- 对比度 AA：主要文本 ≥ 4.5:1，次要 ≥ 3:1。
- 键盘：Tab 顺序与视觉顺序一致；所有弹层可 Esc 关闭；焦点陷阱。
- 屏幕阅读：组件具备 aria- 属性；状态变化伴随 `aria-live` 区域公告。

### 8. 国际化与本地化
- 采用 key-value 文案；日期/数字/货币格式根据 locale 自动切换。
- 专有名词词汇表维护在 `i18n/glossary.json`，避免翻译歧义。

### 9. 响应式断点
- xs: ≤576px, sm: ≤768px, md: ≤960px, lg: ≤1200px, xl: ≤1440px, 2xl: >1440px。
- 工作台在 md 以下切换为单列；抽屉替代侧边栏。

### 10. 前端实现建议
- 技术栈：Next.js / React + shadcn/ui + Tailwind（或 CSS 变量直写）。
- 图表：ECharts 或 Recharts；颜色映射与 tokens 对齐。
- 组件代码风格：无障碍优先、可控/不可控双模式、事件外抛（onXxx）。

### 11. 关键组件属性草案
```ts
type QualityBarProps = {
  overall: number; // 0~1
  details: { accuracy: number; completeness: number; relevance: number; professionalism: number; usability: number };
};

type InsightCardProps = {
  title: string;
  bullets: { text: string; evidenceAnchor?: string; confidence: number }[]; // 3-5 条
  actions?: { label: string; onClick: () => void }[];
};

type AvatarWizardState = {
  step: 1 | 2 | 3 | 4;
  interview: { transcript: string; domain: string; preferences: Record<string, any> };
  engine: { vectorDbReady: boolean; modelTuned: boolean; weightsCalibrated: boolean };
  validation: { scenarios: number; passRate: number };
  activation: { visibility: 'private' | 'friends' | 'public' };
};
```

### 12. 动效与微交互
- 悬浮：卡片轻量升起 `--shadow-1`；主要操作按钮阴影与主色同步。
- 切换：Tabs 使用下划线滑动过渡 `--duration-normal`，进度变化使用缓出 `--ease-standard`。
- 骨架屏：列表、卡片、表格在 >200ms 加载时显示骨架；避免内容跳动。

### 13. 质量与度量（UI 层）
- 首屏可交互 < 2s（P95），关键操作反馈 < 100ms。
- 任务进度事件到 UI 呈现 < 200ms；掉线自动重连 < 3s。

—— 本规范与《06_数据交互/Me2_交互流程与状态规范》配套使用。


