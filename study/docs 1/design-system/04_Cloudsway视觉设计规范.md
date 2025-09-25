# Cloudsway 视觉设计规范 2.1 升级版

**版本**: 2.1.0 | **日期**: 2025-08-12 | **状态**: 拂晓深空融合版  
**基于**: 原Cloudsway设计 + 拂晓与深空设计哲学 + 智能化视觉系统

---

## 核心设计哲学：拂晓与深空

### 设计理念升级

🌅 **拂晓 (Dawn)** - 希望与创新的象征  
• **视觉表达**: 温暖的渐变、柔和的光芒、新生的力量  
• **应用场景**: CTA按钮、成功状态、激励反馈、突出显示  
• **情感传达**: 乐观、积极、温暖、充满希望

🌌 **深空 (Deep Space)** - 深度与专业的象征  
• **视觉表达**: 深郁的背景、宁静的氛围、广阔的空间  
• **应用场景**: 主体背景、工作区域、深度思考模式  
• **情感传达**: 专业、沉稳、专注、深度

### 融合策略

```css
/* 拂晓与深空核心变量 */
:root {
  /* 深空基底 */
  --deep-space-primary: #05080E;    /* 主体深空背景 */
  --deep-space-secondary: #0A0F1C;  /* 次级深空区域 */
  --deep-space-accent: #12172B;     /* 深空强调色 */
  
  /* 拂晓光芒 */
  --dawn-warm: #FFB366;              /* 温暖拂晓 */
  --dawn-bright: #FF8A4C;            /* 明亮拂晓 */
  --dawn-glow: #FFA366;              /* 拂晓光芒 */
  
  /* Cloudsway紫青主色 */
  --cloudsway-purple: #8B5CF6;       /* 核心紫色 */
  --cloudsway-cyan: #22D3EE;         /* 核心青色 */
  --cloudsway-gradient: linear-gradient(135deg, #8B5CF6 0%, #22D3EE 100%);
}
```

---

## 色彩系统

### 主色调

```css
/* Cloudsway 主色调 */
:root {
  /* 核心色彩 */
  --primary: 262 83% 58%;           /* 紫罗兰 #8B5CF6 */
  --primary-foreground: 210 40% 98%; /* 近白色 #FAFAFA */
  
  /* 背景色彩 */
  --background: 222.2 84% 4.9%;     /* 深空黑 #020617 */
  --foreground: 210 40% 98%;        /* 近白色 #FAFAFA */
  
  /* 卡片色彩 */
  --card: 222.2 84% 4.9%;           /* 深空黑 #020617 */
  --card-foreground: 210 40% 98%;   /* 近白色 #FAFAFA */
  
  /* 边框色彩 */
  --border: 217.2 32.6% 17.5%;      /* 深灰 #1E293B */
  --input: 217.2 32.6% 17.5%;       /* 深灰 #1E293B */
  
  /* 次要色彩 */
  --secondary: 217.2 32.6% 17.5%;   /* 深灰 #1E293B */
  --secondary-foreground: 210 40% 98%; /* 近白色 #FAFAFA */
  
  /* 静音色彩 */
  --muted: 217.2 32.6% 17.5%;       /* 深灰 #1E293B */
  --muted-foreground: 210 40% 96.1%; /* 浅灰 #F1F5F9 */
  
  /* 强调色彩 */
  --accent: 217.2 32.6% 17.5%;      /* 深灰 #1E293B */
  --accent-foreground: 210 40% 98%; /* 近白色 #FAFAFA */
  
  /* 弹出色彩 */
  --popover: var(--card);           /* 继承卡片色彩 */
  --popover-foreground: var(--card-foreground); /* 继承卡片前景色 */
  
  /* 破坏色彩 */
  --destructive: 0 84% 60%;         /* 红色 #EF4444 */
  --destructive-foreground: 210 40% 98%; /* 近白色 #FAFAFA */
  
  /* 环形色彩 */
  --ring: 262 83% 58%;              /* 紫罗兰 #8B5CF6 */
}
```

### 渐变系统

```css
/* Cloudsway 渐变系统 */
:root {
  /* 主渐变 */
  --gradient-primary: linear-gradient(135deg, #8B5CF6 0%, #22D3EE 100%);
  --gradient-secondary: linear-gradient(135deg, #22D3EE 0%, #8B5CF6 100%);
  --gradient-accent: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
  
  /* 拂晓渐变 */
  --gradient-dawn-warm: linear-gradient(135deg, #FFB366 0%, #FF8A4C 100%);
  --gradient-dawn-bright: linear-gradient(135deg, #FF8A4C 0%, #FFB366 100%);
  --gradient-dawn-glow: linear-gradient(135deg, #FFA366 0%, #FFB366 100%);
  
  /* 深空渐变 */
  --gradient-deep-space: linear-gradient(135deg, #05080E 0%, #0A0F1C 100%);
  --gradient-deep-space-accent: linear-gradient(135deg, #0A0F1C 0%, #12172B 100%);
  
  /* 特殊渐变 */
  --gradient-glass: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(34, 211, 238, 0.1) 100%);
  --gradient-glow: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(34, 211, 238, 0.2) 100%);
}
```

### 语义色彩

```css
/* 语义色彩系统 */
:root {
  /* 成功色彩 */
  --success: 142 76% 36%;           /* 绿色 #16A34A */
  --success-foreground: 210 40% 98%; /* 近白色 #FAFAFA */
  
  /* 警告色彩 */
  --warning: 38 92% 50%;            /* 橙色 #F59E0B */
  --warning-foreground: 210 40% 98%; /* 近白色 #FAFAFA */
  
  /* 信息色彩 */
  --info: 199 89% 48%;              /* 蓝色 #0EA5E9 */
  --info-foreground: 210 40% 98%;   /* 近白色 #FAFAFA */
  
  /* 错误色彩 */
  --error: 0 84% 60%;               /* 红色 #EF4444 */
  --error-foreground: 210 40% 98%;  /* 近白色 #FAFAFA */
}
```

---

## 字体系统

### 字体族

```css
/* Cloudsway 字体系统 */
:root {
  /* 主要字体 */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  
  /* 等宽字体 */
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'Consolas', 'Courier New', monospace;
  
  /* 显示字体 */
  --font-display: 'Clash Display', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

### 字体大小

```css
/* 字体大小系统 */
:root {
  /* 基础字体大小 */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */
  --text-6xl: 3.75rem;   /* 60px */
  --text-7xl: 4.5rem;    /* 72px */
  --text-8xl: 6rem;      /* 96px */
  --text-9xl: 8rem;      /* 128px */
}
```

### 字体权重

```css
/* 字体权重系统 */
:root {
  --font-thin: 100;
  --font-extralight: 200;
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
  --font-black: 900;
}
```

---

## 间距系统

### 基础间距

```css
/* 间距系统 */
:root {
  /* 基础间距 */
  --space-0: 0;
  --space-1: 0.25rem;    /* 4px */
  --space-2: 0.5rem;     /* 8px */
  --space-3: 0.75rem;    /* 12px */
  --space-4: 1rem;       /* 16px */
  --space-5: 1.25rem;    /* 20px */
  --space-6: 1.5rem;     /* 24px */
  --space-8: 2rem;       /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
  --space-24: 6rem;      /* 96px */
  --space-32: 8rem;      /* 128px */
}
```

### 组件间距

```css
/* 组件间距 */
:root {
  /* 内边距 */
  --padding-xs: var(--space-2);     /* 8px */
  --padding-sm: var(--space-3);     /* 12px */
  --padding-md: var(--space-4);     /* 16px */
  --padding-lg: var(--space-6);     /* 24px */
  --padding-xl: var(--space-8);     /* 32px */
  --padding-2xl: var(--space-12);   /* 48px */
  
  /* 外边距 */
  --margin-xs: var(--space-2);      /* 8px */
  --margin-sm: var(--space-3);      /* 12px */
  --margin-md: var(--space-4);      /* 16px */
  --margin-lg: var(--space-6);      /* 24px */
  --margin-xl: var(--space-8);      /* 32px */
  --margin-2xl: var(--space-12);    /* 48px */
}
```

---

## 圆角系统

### 基础圆角

```css
/* 圆角系统 */
:root {
  /* 基础圆角 */
  --radius-none: 0;
  --radius-sm: 0.125rem;  /* 2px */
  --radius-md: 0.375rem;  /* 6px */
  --radius-lg: 0.5rem;    /* 8px */
  --radius-xl: 0.75rem;   /* 12px */
  --radius-2xl: 1rem;     /* 16px */
  --radius-3xl: 1.5rem;   /* 24px */
  --radius-full: 9999px;
}
```

### 组件圆角

```css
/* 组件圆角 */
:root {
  /* 按钮圆角 */
  --radius-button-sm: var(--radius-md);
  --radius-button-md: var(--radius-lg);
  --radius-button-lg: var(--radius-xl);
  
  /* 卡片圆角 */
  --radius-card-sm: var(--radius-lg);
  --radius-card-md: var(--radius-xl);
  --radius-card-lg: var(--radius-2xl);
  
  /* 输入框圆角 */
  --radius-input-sm: var(--radius-md);
  --radius-input-md: var(--radius-lg);
  --radius-input-lg: var(--radius-xl);
}
```

---

## 阴影系统

### 基础阴影

```css
/* 阴影系统 */
:root {
  /* 基础阴影 */
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
```

### 特殊阴影

```css
/* 特殊阴影 */
:root {
  /* 玻璃拟态阴影 */
  --shadow-glass: 0 8px 32px rgba(0, 0, 0, 0.37);
  --shadow-glass-light: 0 4px 16px rgba(0, 0, 0, 0.2);
  --shadow-glass-heavy: 0 12px 48px rgba(0, 0, 0, 0.5);
  
  /* 彩色阴影 */
  --shadow-purple: 0 4px 20px rgba(139, 92, 246, 0.3);
  --shadow-cyan: 0 4px 20px rgba(34, 211, 238, 0.3);
  --shadow-dawn: 0 4px 20px rgba(255, 179, 102, 0.3);
  
  /* 内阴影 */
  --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
  --shadow-inner-lg: inset 0 4px 8px 0 rgba(0, 0, 0, 0.1);
}
```

---

## 玻璃拟态系统

### 基础玻璃拟态

```css
/* 玻璃拟态系统 */
:root {
  /* 玻璃拟态基础 */
  --glass-bg: rgba(15, 23, 42, 0.9);
  --glass-border: rgba(39, 51, 73, 0.5);
  --glass-blur: blur(20px);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
}

/* 玻璃拟态组件 */
.glass-effect {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  backdrop-filter: var(--glass-blur);
  box-shadow: var(--glass-shadow);
}

/* 玻璃拟态变体 */
.glass-light {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(39, 51, 73, 0.3);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.glass-heavy {
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(39, 51, 73, 0.7);
  backdrop-filter: blur(30px);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5);
}
```

### 彩色玻璃拟态

```css
/* 彩色玻璃拟态 */
.glass-purple {
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.2);
}

.glass-cyan {
  background: rgba(34, 211, 238, 0.1);
  border: 1px solid rgba(34, 211, 238, 0.3);
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(34, 211, 238, 0.2);
}

.glass-dawn {
  background: rgba(255, 179, 102, 0.1);
  border: 1px solid rgba(255, 179, 102, 0.3);
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(255, 179, 102, 0.2);
}
```

---

## 动效系统

### 基础动效

```css
/* 动效系统 */
:root {
  /* 基础动效 */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;
  --transition-bounce: 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --transition-spring: 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* 基础动效类 */
.transition-fast { transition: all var(--transition-fast); }
.transition-normal { transition: all var(--transition-normal); }
.transition-slow { transition: all var(--transition-slow); }
.transition-bounce { transition: all var(--transition-bounce); }
.transition-spring { transition: all var(--transition-spring); }
```

### 悬停动效

```css
/* 悬停动效 */
.hover-lift {
  transition: transform var(--transition-normal);
}

.hover-lift:hover {
  transform: translateY(-4px);
}

.hover-scale {
  transition: transform var(--transition-normal);
}

.hover-scale:hover {
  transform: scale(1.05);
}

.hover-glow {
  transition: box-shadow var(--transition-normal);
}

.hover-glow:hover {
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.3);
}
```

### 进入动效

```css
/* 进入动效 */
.fade-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.slide-up {
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from { 
    opacity: 0; 
    transform: translateY(30px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

.scale-in {
  animation: scaleIn 0.6s ease-out;
}

@keyframes scaleIn {
  from { 
    opacity: 0; 
    transform: scale(0.9); 
  }
  to { 
    opacity: 1; 
    transform: scale(1); 
  }
}
```

---

## 组件规范

### 按钮系统

```css
/* 按钮系统 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-button-md);
  font-weight: var(--font-medium);
  transition: all var(--transition-normal);
  cursor: pointer;
  border: none;
  outline: none;
}

/* 按钮尺寸 */
.btn-sm {
  padding: var(--padding-sm) var(--padding-md);
  font-size: var(--text-sm);
}

.btn-md {
  padding: var(--padding-md) var(--padding-lg);
  font-size: var(--text-base);
}

.btn-lg {
  padding: var(--padding-lg) var(--padding-xl);
  font-size: var(--text-lg);
}

/* 按钮变体 */
.btn-primary {
  background: var(--gradient-primary);
  color: var(--primary-foreground);
  box-shadow: var(--shadow-purple);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.4);
}

.btn-secondary {
  background: var(--secondary);
  color: var(--secondary-foreground);
  border: 1px solid var(--border);
}

.btn-secondary:hover {
  background: var(--accent);
  border-color: var(--primary);
}

.btn-ghost {
  background: transparent;
  color: var(--foreground);
  border: 1px solid var(--border);
}

.btn-ghost:hover {
  background: var(--accent);
  border-color: var(--primary);
}
```

### 卡片系统

```css
/* 卡片系统 */
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-card-md);
  padding: var(--padding-lg);
  transition: all var(--transition-normal);
}

.card:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

/* 玻璃拟态卡片 */
.card-glass {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  backdrop-filter: var(--glass-blur);
  box-shadow: var(--glass-shadow);
  border-radius: var(--radius-card-lg);
  padding: var(--padding-xl);
}

.card-glass:hover {
  border-color: var(--primary);
  box-shadow: 0 12px 48px rgba(139, 92, 246, 0.3);
  transform: translateY(-4px);
}
```

### 输入框系统

```css
/* 输入框系统 */
.input {
  background: var(--input);
  border: 1px solid var(--border);
  border-radius: var(--radius-input-md);
  padding: var(--padding-sm) var(--padding-md);
  color: var(--foreground);
  transition: all var(--transition-normal);
}

.input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 输入框尺寸 */
.input-sm {
  padding: var(--padding-xs) var(--padding-sm);
  font-size: var(--text-sm);
}

.input-md {
  padding: var(--padding-sm) var(--padding-md);
  font-size: var(--text-base);
}

.input-lg {
  padding: var(--padding-md) var(--padding-lg);
  font-size: var(--text-lg);
}
```

---

## 响应式设计

### 断点系统

```css
/* 断点系统 */
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}

/* 响应式工具类 */
@media (min-width: 640px) { .sm\:block { display: block; } }
@media (min-width: 768px) { .md\:block { display: block; } }
@media (min-width: 1024px) { .lg\:block { display: block; } }
@media (min-width: 1280px) { .xl\:block { display: block; } }
@media (min-width: 1536px) { .\2xl\:block { display: block; } }
```

### 容器系统

```css
/* 容器系统 */
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--padding-md);
  padding-right: var(--padding-md);
}

@media (min-width: 640px) {
  .container { max-width: 640px; }
}

@media (min-width: 768px) {
  .container { max-width: 768px; }
}

@media (min-width: 1024px) {
  .container { max-width: 1024px; }
}

@media (min-width: 1280px) {
  .container { max-width: 1280px; }
}

@media (min-width: 1536px) {
  .container { max-width: 1536px; }
}
```

---

## 无障碍设计

### 焦点样式

```css
/* 焦点样式 */
.focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .btn,
  .card,
  .input {
    border: 2px solid currentColor;
  }
}

/* 减少动效 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 总结

这个升级版的Cloudsway视觉设计规范融合了拂晓与深空的设计哲学，为智链平台提供了完整的视觉设计系统。通过精心设计的色彩、字体、间距、圆角、阴影、玻璃拟态和动效系统，确保整个平台具有一致性和专业性的视觉体验。

**核心特点：**
- 🌅 拂晓光芒：温暖、希望、创新
- 🌌 深空基底：专业、深度、专注
- 🎨 完整系统：色彩、字体、间距、圆角、阴影
- ✨ 玻璃拟态：现代、透明、层次感
- ⚡ 流畅动效：自然的交互反馈
- 📱 响应式设计：适配各种设备
- ♿ 无障碍支持：包容性设计
- 🚀 性能优化：流畅的用户体验