# Cloudsway 现代设计系统 v2.0

**版本**: 2.0  
**创建时间**: 2025-01-27  
**最后更新**: 2025-01-27  
**设计理念**: 简洁、现代、专业、科技感

---

## 🎯 设计哲学

Cloudsway 设计系统 v2.0 基于"**云端优雅，简约科技**"的核心理念，为现代科技产品提供统一、优雅、高效的视觉语言。

### 核心原则
- **简约至上** (Simplicity First) - 去除一切非必要元素
- **层次清晰** (Clear Hierarchy) - 信息架构层次分明
- **优雅互动** (Elegant Interaction) - 微妙而有意义的动效
- **科技美学** (Tech Aesthetics) - 体现科技产品的专业性

## 🎨 比例与布局系统

### 视觉层次架构

Cloudsway 的核心优势在于**精密的视觉层次控制**，通过精心设计的比例系统创造优雅的视觉体验：

#### 1. 黄金比例网格 (Golden Ratio Grid)
```css
/* 基于 1.618 黄金比例的空间系统 */
--cloudsway-golden-ratio: 1.618;
--cloudsway-space-base: 8px;

/* 黄金比例间距序列 */
--cloudsway-space-xs: calc(var(--cloudsway-space-base) / var(--cloudsway-golden-ratio)); /* 4.9px ≈ 5px */
--cloudsway-space-sm: var(--cloudsway-space-base); /* 8px */
--cloudsway-space-md: calc(var(--cloudsway-space-base) * var(--cloudsway-golden-ratio)); /* 12.9px ≈ 13px */
--cloudsway-space-lg: calc(var(--cloudsway-space-base) * var(--cloudsway-golden-ratio) * var(--cloudsway-golden-ratio)); /* 20.9px ≈ 21px */
--cloudsway-space-xl: calc(var(--cloudsway-space-base) * var(--cloudsway-golden-ratio) * var(--cloudsway-golden-ratio) * var(--cloudsway-golden-ratio)); /* 33.8px ≈ 34px */
```

#### 2. 字体比例系统 (Typographic Scale)
```css
/* 基于 1.25 大三度音程的字体比例 */
--cloudsway-type-ratio: 1.25; /* 大三度音程比例 */

--cloudsway-text-xs: 0.75rem;    /* 12px - 基础小字 */
--cloudsway-text-sm: 0.875rem;   /* 14px - 正文小字 */
--cloudsway-text-base: 1rem;     /* 16px - 基础正文 */
--cloudsway-text-lg: 1.125rem;   /* 18px - 正文大字 */
--cloudsway-text-xl: 1.25rem;    /* 20px - 小标题 */
--cloudsway-text-2xl: 1.5rem;    /* 24px - 中标题 */
--cloudsway-text-3xl: 1.875rem;  /* 30px - 大标题 */
--cloudsway-text-4xl: 2.25rem;   /* 36px - 特大标题 */
--cloudsway-text-5xl: 3rem;      /* 48px - 英雄标题 */
--cloudsway-text-6xl: 3.75rem;   /* 60px - 展示标题 */
```

#### 3. 组件比例系统 (Component Proportions)

**卡片比例**
```css
/* 卡片内边距比例 - 基于内容重要性 */
.cloudsway-card-compact {
  padding: var(--cloudsway-space-4); /* 16px - 紧凑型 */
}

.cloudsway-card-standard {
  padding: var(--cloudsway-space-6); /* 24px - 标准型 */
}

.cloudsway-card-spacious {
  padding: var(--cloudsway-space-8); /* 32px - 宽松型 */
}

.cloudsway-card-hero {
  padding: var(--cloudsway-space-12); /* 48px - 英雄型 */
}
```

**按钮比例**
```css
/* 按钮高度比例 - 基于交互重要性 */
.cloudsway-btn-xs {
  height: 28px; /* 超紧凑 */
  padding: var(--cloudsway-space-1) var(--cloudsway-space-3);
}

.cloudsway-btn-sm {
  height: 32px; /* 紧凑 */
  padding: var(--cloudsway-space-2) var(--cloudsway-space-4);
}

.cloudsway-btn-md {
  height: 40px; /* 标准 */
  padding: var(--cloudsway-space-3) var(--cloudsway-space-6);
}

.cloudsway-btn-lg {
  height: 48px; /* 突出 */
  padding: var(--cloudsway-space-4) var(--cloudsway-space-8);
}

.cloudsway-btn-xl {
  height: 56px; /* 英雄 */
  padding: var(--cloudsway-space-5) var(--cloudsway-space-10);
}
```

### 布局分布原则

#### 1. 呼吸空间 (Breathing Space)
```css
/* 组件间距 - 创造视觉呼吸感 */
.cloudsway-section {
  margin-bottom: var(--cloudsway-space-16); /* 64px - 段落间距 */
}

.cloudsway-component-group {
  margin-bottom: var(--cloudsway-space-8); /* 32px - 组件组间距 */
}

.cloudsway-component {
  margin-bottom: var(--cloudsway-space-4); /* 16px - 组件间距 */
}
```

#### 2. 视觉重量分布 (Visual Weight Distribution)
```css
/* 基于视觉重要性的间距分配 */
.cloudsway-layout-primary {
  margin-bottom: var(--cloudsway-space-12); /* 48px - 主要内容 */
}

.cloudsway-layout-secondary {
  margin-bottom: var(--cloudsway-space-8); /* 32px - 次要内容 */
}

.cloudsway-layout-tertiary {
  margin-bottom: var(--cloudsway-space-6); /* 24px - 辅助内容 */
}

.cloudsway-layout-minimal {
  margin-bottom: var(--cloudsway-space-4); /* 16px - 最小内容 */
}
```

#### 3. 网格比例系统 (Grid Proportion System)
```css
/* 12 列网格系统 - 基于黄金比例 */
.cloudsway-grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--cloudsway-space-6); /* 24px 网格间距 */
}

/* 常用比例组合 */
.cloudsway-layout-hero {
  grid-column: span 12; /* 全宽 - 英雄区域 */
}

.cloudsway-layout-main {
  grid-column: span 8; /* 2/3 宽度 - 主要内容 */
}

.cloudsway-layout-sidebar {
  grid-column: span 4; /* 1/3 宽度 - 侧边栏 */
}

.cloudsway-layout-balanced {
  grid-column: span 6; /* 1/2 宽度 - 平衡布局 */
}

.cloudsway-layout-feature {
  grid-column: span 4; /* 1/3 宽度 - 特性展示 */
}

.cloudsway-layout-compact {
  grid-column: span 3; /* 1/4 宽度 - 紧凑展示 */
}
```

### 层次深度控制

#### 1. 阴影层次 (Shadow Hierarchy)
```css
/* 基于内容重要性的阴影深度 */
.cloudsway-elevation-0 {
  box-shadow: none; /* 无阴影 - 基础层 */
}

.cloudsway-elevation-1 {
  box-shadow: var(--cloudsway-shadow-xs); /* 微阴影 - 卡片层 */
}

.cloudsway-elevation-2 {
  box-shadow: var(--cloudsway-shadow-sm); /* 轻阴影 - 悬停层 */
}

.cloudsway-elevation-3 {
  box-shadow: var(--cloudsway-shadow-md); /* 中阴影 - 模态层 */
}

.cloudsway-elevation-4 {
  box-shadow: var(--cloudsway-shadow-lg); /* 重阴影 - 弹出层 */
}

.cloudsway-elevation-5 {
  box-shadow: var(--cloudsway-shadow-xl); /* 特重阴影 - 浮动层 */
}
```

#### 2. 边框层次 (Border Hierarchy)
```css
/* 基于交互状态的边框粗细 */
.cloudsway-border-subtle {
  border-width: 1px; /* 微妙边框 - 默认状态 */
}

.cloudsway-border-emphasis {
  border-width: 2px; /* 强调边框 - 悬停状态 */
}

.cloudsway-border-focus {
  border-width: 3px; /* 聚焦边框 - 激活状态 */
}
```

### 响应式比例适配

#### 1. 断点比例调整
```css
/* 移动端 - 紧凑比例 */
@media (max-width: 640px) {
  .cloudsway-responsive {
    --cloudsway-space-base: 6px; /* 减小基础间距 */
    --cloudsway-type-ratio: 1.2; /* 减小字体比例 */
  }
}

/* 平板端 - 标准比例 */
@media (min-width: 641px) and (max-width: 1024px) {
  .cloudsway-responsive {
    --cloudsway-space-base: 8px; /* 标准基础间距 */
    --cloudsway-type-ratio: 1.25; /* 标准字体比例 */
  }
}

/* 桌面端 - 宽松比例 */
@media (min-width: 1025px) {
  .cloudsway-responsive {
    --cloudsway-space-base: 10px; /* 增加基础间距 */
    --cloudsway-type-ratio: 1.3; /* 增加字体比例 */
  }
}
```

#### 2. 内容密度控制
```css
/* 高密度布局 - 信息密集型 */
.cloudsway-density-compact {
  --cloudsway-component-spacing: var(--cloudsway-space-2);
  --cloudsway-section-spacing: var(--cloudsway-space-6);
}

/* 标准密度布局 - 平衡型 */
.cloudsway-density-standard {
  --cloudsway-component-spacing: var(--cloudsway-space-4);
  --cloudsway-section-spacing: var(--cloudsway-space-8);
}

/* 低密度布局 - 展示型 */
.cloudsway-density-spacious {
  --cloudsway-component-spacing: var(--cloudsway-space-6);
  --cloudsway-section-spacing: var(--cloudsway-space-12);
}
```

### 最佳实践指南

#### 1. 比例一致性
- 始终使用设计系统中的比例值
- 避免随意设置间距和尺寸
- 保持视觉节奏的一致性

#### 2. 层次清晰度
- 使用阴影和间距创建清晰的视觉层次
- 重要内容使用更大的间距和更深的阴影
- 次要内容使用较小的间距和较浅的阴影

#### 3. 呼吸感营造
- 在内容块之间留出足够的呼吸空间
- 使用黄金比例创造自然的视觉节奏
- 避免内容过于拥挤或过于稀疏

#### 4. 响应式适配
- 在不同屏幕尺寸下调整比例
- 保持视觉层次在不同设备上的一致性
- 根据内容重要性调整布局密度

## 🎨 色彩系统

### 主色调 - 云天渐变
```css
/* 主色调 - 深邃紫蓝 */
--cloudsway-primary: #6366F1;        /* Indigo 500 */
--cloudsway-primary-light: #818CF8;  /* Indigo 400 */
--cloudsway-primary-dark: #4F46E5;   /* Indigo 600 */

/* 辅助色 - 晨曦青绿 */
--cloudsway-secondary: #22D3EE;      /* Cyan 400 */
--cloudsway-secondary-light: #67E8F9; /* Cyan 300 */
--cloudsway-secondary-dark: #0891B2;  /* Cyan 600 */

/* 核心渐变 */
--cloudsway-gradient-primary: linear-gradient(135deg, #6366F1 0%, #22D3EE 100%);
--cloudsway-gradient-soft: linear-gradient(135deg, #818CF8 0%, #67E8F9 100%);
--cloudsway-gradient-intense: linear-gradient(135deg, #4F46E5 0%, #0891B2 100%);
```

### 中性色调 - 云雾灰阶
```css
/* 深色背景系列 */
--cloudsway-slate-950: #0F172A;     /* 主背景 */
--cloudsway-slate-900: #1E293B;     /* 卡片背景 */
--cloudsway-slate-800: #334155;     /* 悬停背景 */
--cloudsway-slate-700: #475569;     /* 边框色 */

/* 文字颜色系列 */
--cloudsway-slate-400: #94A3B8;     /* 次要文字 */
--cloudsway-slate-300: #CBD5E1;     /* 主要文字 */
--cloudsway-slate-100: #F1F5F9;     /* 高亮文字 */
--cloudsway-slate-50: #F8FAFC;      /* 纯白文字 */
```

### 语义色彩 - 状态表达
```css
/* 成功 */
--cloudsway-success: #10B981;       /* Emerald 500 */
--cloudsway-success-light: #34D399; /* Emerald 400 */
--cloudsway-success-bg: rgba(16, 185, 129, 0.1);

/* 警告 */
--cloudsway-warning: #F59E0B;       /* Amber 500 */
--cloudsway-warning-light: #FBBF24; /* Amber 400 */
--cloudsway-warning-bg: rgba(245, 158, 11, 0.1);

/* 错误 */
--cloudsway-error: #EF4444;         /* Red 500 */
--cloudsway-error-light: #F87171;   /* Red 400 */
--cloudsway-error-bg: rgba(239, 68, 68, 0.1);

/* 信息 */
--cloudsway-info: #3B82F6;          /* Blue 500 */
--cloudsway-info-light: #60A5FA;    /* Blue 400 */
--cloudsway-info-bg: rgba(59, 130, 246, 0.1);
```

## 🔤 字体系统

### 字体族
```css
/* 主字体 - Inter */
--cloudsway-font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

/* 等宽字体 - JetBrains Mono */
--cloudsway-font-mono: "JetBrains Mono", "Fira Code", Consolas, monospace;

/* 中文字体 */
--cloudsway-font-zh: "PingFang SC", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif;
```

### 字体尺寸 - 模块化比例
```css
/* 基础 16px，比例 1.25 (大三度) */
--cloudsway-text-xs: 0.75rem;    /* 12px */
--cloudsway-text-sm: 0.875rem;   /* 14px */
--cloudsway-text-base: 1rem;     /* 16px */
--cloudsway-text-lg: 1.125rem;   /* 18px */
--cloudsway-text-xl: 1.25rem;    /* 20px */
--cloudsway-text-2xl: 1.5rem;    /* 24px */
--cloudsway-text-3xl: 1.875rem;  /* 30px */
--cloudsway-text-4xl: 2.25rem;   /* 36px */
--cloudsway-text-5xl: 3rem;      /* 48px */
--cloudsway-text-6xl: 3.75rem;   /* 60px */
```

### 字重系统
```css
--cloudsway-font-thin: 100;
--cloudsway-font-light: 300;
--cloudsway-font-normal: 400;
--cloudsway-font-medium: 500;
--cloudsway-font-semibold: 600;
--cloudsway-font-bold: 700;
--cloudsway-font-extrabold: 800;
```

## 📐 空间系统

### 间距比例 - 8px 基础网格
```css
--cloudsway-space-0: 0px;
--cloudsway-space-1: 0.25rem;    /* 4px */
--cloudsway-space-2: 0.5rem;     /* 8px */
--cloudsway-space-3: 0.75rem;    /* 12px */
--cloudsway-space-4: 1rem;       /* 16px */
--cloudsway-space-5: 1.25rem;    /* 20px */
--cloudsway-space-6: 1.5rem;     /* 24px */
--cloudsway-space-8: 2rem;       /* 32px */
--cloudsway-space-10: 2.5rem;    /* 40px */
--cloudsway-space-12: 3rem;      /* 48px */
--cloudsway-space-16: 4rem;      /* 64px */
--cloudsway-space-20: 5rem;      /* 80px */
--cloudsway-space-24: 6rem;      /* 96px */
--cloudsway-space-32: 8rem;      /* 128px */
```

### 圆角系统
```css
--cloudsway-radius-none: 0px;
--cloudsway-radius-sm: 0.125rem;  /* 2px */
--cloudsway-radius-md: 0.375rem;  /* 6px */
--cloudsway-radius-lg: 0.5rem;    /* 8px */
--cloudsway-radius-xl: 0.75rem;   /* 12px */
--cloudsway-radius-2xl: 1rem;     /* 16px */
--cloudsway-radius-3xl: 1.5rem;   /* 24px */
--cloudsway-radius-full: 9999px;
```

## 🎭 阴影系统

### 层次阴影 - 柔和科技感
```css
/* 微妙阴影 */
--cloudsway-shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
--cloudsway-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);

/* 常规阴影 */
--cloudsway-shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06);
--cloudsway-shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);

/* 强调阴影 */
--cloudsway-shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04);
--cloudsway-shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25);

/* 彩色发光阴影 */
--cloudsway-shadow-primary: 0 0 20px rgba(99, 102, 241, 0.2);
--cloudsway-shadow-secondary: 0 0 20px rgba(34, 211, 238, 0.2);
--cloudsway-shadow-inner: inset 0 2px 4px rgba(0, 0, 0, 0.06);
```

## ✨ 动效系统

### 缓动函数
```css
--cloudsway-ease-linear: linear;
--cloudsway-ease-in: cubic-bezier(0.4, 0, 1, 1);
--cloudsway-ease-out: cubic-bezier(0, 0, 0.2, 1);
--cloudsway-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--cloudsway-ease-back: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--cloudsway-ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

### 动画时长
```css
--cloudsway-duration-75: 75ms;
--cloudsway-duration-100: 100ms;
--cloudsway-duration-150: 150ms;
--cloudsway-duration-200: 200ms;
--cloudsway-duration-300: 300ms;
--cloudsway-duration-500: 500ms;
--cloudsway-duration-700: 700ms;
--cloudsway-duration-1000: 1000ms;
```

## 🧩 组件规范

### 按钮系统
```css
/* 主要按钮 */
.cloudsway-btn-primary {
  background: var(--cloudsway-gradient-primary);
  color: var(--cloudsway-slate-50);
  border: none;
  border-radius: var(--cloudsway-radius-lg);
  padding: var(--cloudsway-space-3) var(--cloudsway-space-6);
  font-weight: var(--cloudsway-font-medium);
  font-size: var(--cloudsway-text-sm);
  transition: all var(--cloudsway-duration-200) var(--cloudsway-ease-out);
  box-shadow: var(--cloudsway-shadow-md);
}

.cloudsway-btn-primary:hover {
  box-shadow: var(--cloudsway-shadow-lg), var(--cloudsway-shadow-primary);
  transform: translateY(-1px);
}

/* 次要按钮 */
.cloudsway-btn-secondary {
  background: transparent;
  color: var(--cloudsway-slate-300);
  border: 1px solid var(--cloudsway-slate-700);
  border-radius: var(--cloudsway-radius-lg);
  padding: var(--cloudsway-space-3) var(--cloudsway-space-6);
  font-weight: var(--cloudsway-font-medium);
  font-size: var(--cloudsway-text-sm);
  transition: all var(--cloudsway-duration-200) var(--cloudsway-ease-out);
}

.cloudsway-btn-secondary:hover {
  border-color: var(--cloudsway-primary);
  color: var(--cloudsway-primary);
  box-shadow: var(--cloudsway-shadow-primary);
}
```

### 卡片系统
```css
.cloudsway-card {
  background: var(--cloudsway-slate-900);
  border: 1px solid var(--cloudsway-slate-800);
  border-radius: var(--cloudsway-radius-xl);
  padding: var(--cloudsway-space-6);
  box-shadow: var(--cloudsway-shadow-sm);
  transition: all var(--cloudsway-duration-300) var(--cloudsway-ease-out);
}

.cloudsway-card:hover {
  border-color: var(--cloudsway-slate-700);
  box-shadow: var(--cloudsway-shadow-lg);
  transform: translateY(-2px);
}

.cloudsway-card-premium {
  border: 1px solid transparent;
  background: linear-gradient(var(--cloudsway-slate-900), var(--cloudsway-slate-900)) padding-box,
              var(--cloudsway-gradient-primary) border-box;
}
```

### 输入框系统
```css
.cloudsway-input {
  background: var(--cloudsway-slate-800);
  border: 1px solid var(--cloudsway-slate-700);
  border-radius: var(--cloudsway-radius-lg);
  padding: var(--cloudsway-space-3) var(--cloudsway-space-4);
  color: var(--cloudsway-slate-100);
  font-size: var(--cloudsway-text-sm);
  transition: all var(--cloudsway-duration-200) var(--cloudsway-ease-out);
}

.cloudsway-input:focus {
  outline: none;
  border-color: var(--cloudsway-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.cloudsway-input::placeholder {
  color: var(--cloudsway-slate-400);
}
```

## 📱 响应式设计

### 断点系统
```css
--cloudsway-breakpoint-sm: 640px;   /* 手机 */
--cloudsway-breakpoint-md: 768px;   /* 平板 */
--cloudsway-breakpoint-lg: 1024px;  /* 笔记本 */
--cloudsway-breakpoint-xl: 1280px;  /* 桌面 */
--cloudsway-breakpoint-2xl: 1536px; /* 大屏幕 */
```

### 响应式网格
```css
.cloudsway-container {
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--cloudsway-space-4);
}

@media (min-width: 640px) {
  .cloudsway-container { max-width: 640px; }
}

@media (min-width: 768px) {
  .cloudsway-container { max-width: 768px; }
}

@media (min-width: 1024px) {
  .cloudsway-container { max-width: 1024px; }
}

@media (min-width: 1280px) {
  .cloudsway-container { max-width: 1280px; }
}
```

## 🎪 特色组件

### 渐变边框卡片
```css
.cloudsway-gradient-card {
  position: relative;
  padding: var(--cloudsway-space-6);
  border-radius: var(--cloudsway-radius-xl);
  background: var(--cloudsway-slate-900);
}

.cloudsway-gradient-card::before {
  content: '';
  position: absolute;
  inset: 0;
  padding: 1px;
  background: var(--cloudsway-gradient-primary);
  border-radius: inherit;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
}
```

### 浮动动效
```css
@keyframes cloudsway-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.cloudsway-float {
  animation: cloudsway-float 6s ease-in-out infinite;
}
```

### 渐变文字
```css
.cloudsway-text-gradient {
  background: var(--cloudsway-gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: var(--cloudsway-font-bold);
}
```

## 🌟 最佳实践

### 1. 层次构建
- 使用微妙的阴影和边框创建层次
- 保持 8px 网格对齐
- 利用留白营造呼吸感

### 2. 交互反馈
- 悬停状态添加微妙的上移动效
- 使用渐变和发光效果突出重点
- 保持动画流畅自然

### 3. 色彩运用
- 主色调用于强调和引导
- 大面积使用中性色
- 语义色彩仅用于状态表达

### 4. 可访问性
- 保证足够的颜色对比度
- 支持键盘导航
- 提供清晰的视觉层次

## 📋 使用指南

### 快速开始
1. 引入 Cloudsway CSS 变量文件
2. 设置基础 HTML 结构
3. 应用组件类名
4. 根据需要自定义样式

### 集成建议
- 可与现有 CSS 框架（如 Tailwind CSS）结合使用
- 支持 CSS-in-JS 方案集成
- 提供 React/Vue 组件库版本

---

**Cloudsway 设计系统 v2.0** - *云端优雅，简约科技，为每个数字体验注入专业美感。*

**版权**: © 2025 LaunchX  
**许可**: MIT License  
**维护**: LaunchX 设计团队