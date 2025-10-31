# Cloudsway视觉设计规范

**版本**: 1.5.0 | **日期**: 2025年8月12日 | **状态**: 完整视觉设计系统规范
**基于**: Cloudsway紫青科技风 + 六角色视觉系统

---

## 概述

Cloudsway视觉设计规范定义了智链平台完整的视觉设计语言，以紫青科技风为核心，为六个AI角色创建独特而统一的视觉标识系统。

## 核心品牌色彩系统

### 主色调定义
```css
:root {
  /* === 核心品牌色 === */
  --primary: hsl(262, 83%, 58%);           /* #8B5CF6 - 主紫色 */
  --primary-foreground: hsl(210, 40%, 98%); /* #FEFEFE - 主紫色文字 */
  
  /* === 辅助紫色渐变 === */
  --purple-50: hsl(270, 100%, 99%);        /* #FBFAFF */
  --purple-100: hsl(269, 100%, 95%);       /* #F3F0FF */
  --purple-200: hsl(269, 100%, 92%);       /* #E9E5FF */
  --purple-300: hsl(268, 100%, 86%);       /* #D4CDFF */
  --purple-400: hsl(270, 95%, 75%);        /* #B794F6 */
  --purple-500: hsl(262, 83%, 58%);        /* #8B5CF6 - 主色 */
  --purple-600: hsl(258, 90%, 66%);        /* #7C3AED */
  --purple-700: hsl(256, 84%, 60%);        /* #6D28D9 */
  --purple-800: hsl(253, 78%, 50%);        /* #5B21B6 */
  --purple-900: hsl(250, 84%, 38%);        /* #4C1D95 */
  
  /* === 青色渐变 === */
  --cyan-50: hsl(183, 100%, 96%);          /* #F0FDFA */
  --cyan-100: hsl(180, 100%, 90%);         /* #CCFBF1 */
  --cyan-200: hsl(180, 93%, 82%);          /* #99F6E4 */
  --cyan-300: hsl(180, 90%, 70%);          /* #5EEAD4 */
  --cyan-400: hsl(172, 85%, 60%);          /* #2DD4BF */
  --cyan-500: hsl(173, 80%, 40%);          /* #14B8A6 */
  --cyan-600: hsl(175, 84%, 32%);          /* #0D9488 */
  --cyan-700: hsl(175, 77%, 26%);          /* #0F766E */
  --cyan-800: hsl(176, 69%, 22%);          /* #115E59 */
  --cyan-900: hsl(176, 61%, 19%);          /* #134E4A */
}
```

### 深空背景系统
```css
:root {
  /* === 深空背景渐变 === */
  --background: hsl(222.2, 84%, 4.9%);     /* #0A1429 - 深空背景 */
  --background-secondary: hsl(217.2, 80%, 8%); /* #0F172A - 次级背景 */
  --background-tertiary: hsl(215, 28%, 17%);   /* #1E293B - 三级背景 */
  
  /* === 卡片和容器 === */
  --card: hsl(222.2, 84%, 4.9%);          /* 卡片背景 */
  --card-foreground: hsl(210, 40%, 98%);   /* 卡片文字 */
  --popover: hsl(222.2, 84%, 4.9%);       /* 弹窗背景 */
  --popover-foreground: hsl(210, 40%, 98%); /* 弹窗文字 */
  
  /* === 边框和分割线 === */
  --border: hsl(217.2, 32.6%, 17.5%);     /* #1E293B - 边框 */
  --input: hsl(217.2, 32.6%, 17.5%);      /* 输入框边框 */
  
  /* === 文字色彩 === */
  --foreground: hsl(210, 40%, 98%);       /* 主文字 */
  --muted: hsl(217.2, 32.6%, 17.5%);     /* 静音背景 */
  --muted-foreground: hsl(215, 20.2%, 65.1%); /* 静音文字 */
  
  /* === 强调色 === */
  --accent: hsl(217.2, 32.6%, 17.5%);     /* 强调背景 */
  --accent-foreground: hsl(210, 40%, 98%); /* 强调文字 */
  
  /* === 状态色 === */
  --destructive: hsl(0, 62.8%, 30.6%);    /* 错误/删除 */
  --destructive-foreground: hsl(210, 40%, 98%); /* 错误文字 */
  --ring: hsl(262, 83%, 58%);             /* 焦点环 */
}
```

## 六角色专属色彩系统

### Alex - 战略分析师
```css
:root {
  /* Alex 专属渐变 - 智慧金紫 */
  --alex-primary: hsl(45, 100%, 70%);     /* #FFD700 - 智慧金 */
  --alex-secondary: hsl(262, 83%, 58%);   /* #8B5CF6 - 品牌紫 */
  --alex-gradient: linear-gradient(135deg, 
    hsl(45, 100%, 70%) 0%,                /* 智慧金起点 */
    hsl(50, 90%, 65%) 25%,               /* 中间过渡 */
    hsl(262, 83%, 58%) 100%              /* 品牌紫终点 */
  );
  
  /* Alex 状态色 */
  --alex-active: hsl(45, 100%, 70%);      /* 活跃状态 */
  --alex-thinking: hsl(48, 95%, 65%);     /* 思考状态 */
  --alex-responding: hsl(45, 90%, 75%);   /* 响应状态 */
  
  /* Alex 背景和边框 */
  --alex-bg-primary: hsla(45, 100%, 70%, 0.1); /* 主背景 */
  --alex-bg-secondary: hsla(45, 100%, 70%, 0.05); /* 次背景 */
  --alex-border: hsla(45, 100%, 70%, 0.3); /* 边框 */
}
```

### Kulu - 解决方案架构师
```css
:root {
  /* Kulu 专属渐变 - 科技蓝紫 */
  --kulu-primary: hsl(210, 100%, 60%);    /* #3B82F6 - 科技蓝 */
  --kulu-secondary: hsl(262, 83%, 58%);   /* #8B5CF6 - 品牌紫 */
  --kulu-gradient: linear-gradient(135deg,
    hsl(210, 100%, 60%) 0%,              /* 科技蓝起点 */
    hsl(235, 90%, 58%) 50%,              /* 中间过渡 */
    hsl(262, 83%, 58%) 100%              /* 品牌紫终点 */
  );
  
  /* Kulu 状态色 */
  --kulu-active: hsl(210, 100%, 60%);     /* 活跃状态 */
  --kulu-thinking: hsl(215, 95%, 65%);    /* 思考状态 */
  --kulu-responding: hsl(210, 90%, 70%);  /* 响应状态 */
  
  /* Kulu 背景和边框 */
  --kulu-bg-primary: hsla(210, 100%, 60%, 0.1); /* 主背景 */
  --kulu-bg-secondary: hsla(210, 100%, 60%, 0.05); /* 次背景 */
  --kulu-border: hsla(210, 100%, 60%, 0.3); /* 边框 */
}
```

### Mike - 交付工程师
```css
:root {
  /* Mike 专属渐变 - 实干橙紫 */
  --mike-primary: hsl(25, 100%, 65%);     /* #FF8C42 - 实干橙 */
  --mike-secondary: hsl(262, 83%, 58%);   /* #8B5CF6 - 品牌紫 */
  --mike-gradient: linear-gradient(135deg,
    hsl(25, 100%, 65%) 0%,               /* 实干橙起点 */
    hsl(320, 90%, 62%) 50%,              /* 中间过渡 */
    hsl(262, 83%, 58%) 100%              /* 品牌紫终点 */
  );
  
  /* Mike 状态色 */
  --mike-active: hsl(25, 100%, 65%);      /* 活跃状态 */
  --mike-thinking: hsl(30, 95%, 68%);     /* 思考状态 */
  --mike-responding: hsl(25, 90%, 70%);   /* 响应状态 */
  
  /* Mike 背景和边框 */
  --mike-bg-primary: hsla(25, 100%, 65%, 0.1); /* 主背景 */
  --mike-bg-secondary: hsla(25, 100%, 65%, 0.05); /* 次背景 */
  --mike-border: hsla(25, 100%, 65%, 0.3); /* 边框 */
}
```

### Emma - 商业分析师
```css
:root {
  /* Emma 专属渐变 - 洞察绿紫 */
  --emma-primary: hsl(142, 76%, 50%);     /* #10B981 - 洞察绿 */
  --emma-secondary: hsl(262, 83%, 58%);   /* #8B5CF6 - 品牌紫 */
  --emma-gradient: linear-gradient(135deg,
    hsl(142, 76%, 50%) 0%,               /* 洞察绿起点 */
    hsl(173, 80%, 40%) 30%,              /* 青色过渡 */
    hsl(262, 83%, 58%) 100%              /* 品牌紫终点 */
  );
  
  /* Emma 状态色 */
  --emma-active: hsl(142, 76%, 50%);      /* 活跃状态 */
  --emma-thinking: hsl(145, 70%, 55%);    /* 思考状态 */
  --emma-responding: hsl(142, 70%, 60%);  /* 响应状态 */
  
  /* Emma 背景和边框 */
  --emma-bg-primary: hsla(142, 76%, 50%, 0.1); /* 主背景 */
  --emma-bg-secondary: hsla(142, 76%, 50%, 0.05); /* 次背景 */
  --emma-border: hsla(142, 76%, 50%, 0.3); /* 边框 */
}
```

### David - 项目总监
```css
:root {
  /* David 专属渐变 - 统筹红紫 */
  --david-primary: hsl(348, 83%, 60%);    /* #E11D48 - 统筹红 */
  --david-secondary: hsl(262, 83%, 58%);  /* #8B5CF6 - 品牌紫 */
  --david-gradient: linear-gradient(135deg,
    hsl(348, 83%, 60%) 0%,               /* 统筹红起点 */
    hsl(305, 85%, 59%) 50%,              /* 中间过渡 */
    hsl(262, 83%, 58%) 100%              /* 品牌紫终点 */
  );
  
  /* David 状态色 */
  --david-active: hsl(348, 83%, 60%);     /* 活跃状态 */
  --david-thinking: hsl(350, 80%, 65%);   /* 思考状态 */
  --david-responding: hsl(348, 75%, 70%); /* 响应状态 */
  
  /* David 背景和边框 */
  --david-bg-primary: hsla(348, 83%, 60%, 0.1); /* 主背景 */
  --david-bg-secondary: hsla(348, 83%, 60%, 0.05); /* 次背景 */
  --david-border: hsla(348, 83%, 60%, 0.3); /* 边框 */
}
```

### Catherine - 首席顾问
```css
:root {
  /* Catherine 专属渐变 - 权威紫金 */
  --catherine-primary: hsl(262, 83%, 58%); /* #8B5CF6 - 品牌紫 */
  --catherine-secondary: hsl(45, 100%, 70%); /* #FFD700 - 权威金 */
  --catherine-gradient: linear-gradient(135deg,
    hsl(262, 83%, 58%) 0%,               /* 品牌紫起点 */
    hsl(280, 85%, 62%) 30%,              /* 中间过渡 */
    hsl(45, 100%, 70%) 100%              /* 权威金终点 */
  );
  
  /* Catherine 状态色 */
  --catherine-active: hsl(262, 83%, 58%);  /* 活跃状态 */
  --catherine-thinking: hsl(265, 80%, 63%); /* 思考状态 */
  --catherine-responding: hsl(262, 75%, 68%); /* 响应状态 */
  
  /* Catherine 背景和边框 */
  --catherine-bg-primary: hsla(262, 83%, 58%, 0.1); /* 主背景 */
  --catherine-bg-secondary: hsla(262, 83%, 58%, 0.05); /* 次背景 */
  --catherine-border: hsla(262, 83%, 58%, 0.3); /* 边框 */
}
```

## 玻璃拟态效果系统

### 基础玻璃拟态
```css
.glass-morphism {
  /* 背景模糊效果 */
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  
  /* 边框光效 */
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  
  /* 阴影效果 */
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.glass-morphism-card {
  /* 卡片级玻璃拟态 */
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.glass-morphism-panel {
  /* 面板级玻璃拟态 */
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
}
```

### 角色专属玻璃拟态
```css
/* Alex 智慧金玻璃拟态 */
.glass-alex {
  background: rgba(255, 215, 0, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 215, 0, 0.15);
  box-shadow: 
    0 8px 32px rgba(255, 215, 0, 0.1),
    inset 0 1px 0 rgba(255, 215, 0, 0.1);
}

/* Kulu 科技蓝玻璃拟态 */
.glass-kulu {
  background: rgba(59, 130, 246, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(59, 130, 246, 0.15);
  box-shadow: 
    0 8px 32px rgba(59, 130, 246, 0.1),
    inset 0 1px 0 rgba(59, 130, 246, 0.1);
}

/* Mike 实干橙玻璃拟态 */
.glass-mike {
  background: rgba(255, 140, 66, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 140, 66, 0.15);
  box-shadow: 
    0 8px 32px rgba(255, 140, 66, 0.1),
    inset 0 1px 0 rgba(255, 140, 66, 0.1);
}

/* Emma 洞察绿玻璃拟态 */
.glass-emma {
  background: rgba(16, 185, 129, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(16, 185, 129, 0.15);
  box-shadow: 
    0 8px 32px rgba(16, 185, 129, 0.1),
    inset 0 1px 0 rgba(16, 185, 129, 0.1);
}

/* David 统筹红玻璃拟态 */
.glass-david {
  background: rgba(225, 29, 72, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(225, 29, 72, 0.15);
  box-shadow: 
    0 8px 32px rgba(225, 29, 72, 0.1),
    inset 0 1px 0 rgba(225, 29, 72, 0.1);
}

/* Catherine 权威紫玻璃拟态 */
.glass-catherine {
  background: rgba(139, 92, 246, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(139, 92, 246, 0.15);
  box-shadow: 
    0 8px 32px rgba(139, 92, 246, 0.1),
    inset 0 1px 0 rgba(139, 92, 246, 0.1);
}
```

## 字体系统规范

### 字体族定义
```css
:root {
  /* 无衬线字体栈 - 主要界面文字 */
  --font-sans: 'Inter Variable', 'Inter', -apple-system, BlinkMacSystemFont, 
               'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  
  /* 等宽字体栈 - 代码和数据 */
  --font-mono: 'JetBrains Mono Variable', 'JetBrains Mono', 'Fira Code', 
               'Cascadia Code', 'SF Mono', Monaco, 'Cascadia Mono', 
               'Roboto Mono', Consolas, 'Liberation Mono', 'Menlo', monospace;
  
  /* 衬线字体栈 - 标题和强调 */
  --font-serif: 'Crimson Pro Variable', 'Crimson Pro', 'Georgia', 
                'Times New Roman', Times, serif;
}
```

### 字体大小和行高
```css
:root {
  /* 字体大小系统 */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px - 基础字体 */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
  --text-5xl: 3rem;        /* 48px */
  
  /* 行高系统 */
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;   /* 默认行高 */
  --leading-relaxed: 1.625;
  --leading-loose: 2;
  
  /* 字重系统 */
  --font-light: 300;
  --font-normal: 400;      /* 默认字重 */
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
}
```

### 角色专属字体样式
```css
/* Alex - 权威专业字体 */
.text-alex {
  font-family: var(--font-sans);
  font-weight: var(--font-semibold);
  letter-spacing: -0.01em;
  color: var(--alex-primary);
}

/* Kulu - 技术精确字体 */
.text-kulu {
  font-family: var(--font-mono);
  font-weight: var(--font-medium);
  letter-spacing: 0;
  color: var(--kulu-primary);
}

/* Mike - 实用清晰字体 */
.text-mike {
  font-family: var(--font-sans);
  font-weight: var(--font-medium);
  letter-spacing: 0.01em;
  color: var(--mike-primary);
}

/* Emma - 数据友好字体 */
.text-emma {
  font-family: var(--font-sans);
  font-weight: var(--font-normal);
  letter-spacing: 0;
  color: var(--emma-primary);
}

/* David - 领导力字体 */
.text-david {
  font-family: var(--font-sans);
  font-weight: var(--font-bold);
  letter-spacing: -0.02em;
  color: var(--david-primary);
}

/* Catherine - 顾问级字体 */
.text-catherine {
  font-family: var(--font-serif);
  font-weight: var(--font-semibold);
  letter-spacing: -0.01em;
  color: var(--catherine-primary);
}
```

## 间距和布局系统

### 空间单位系统
```css
:root {
  /* 基础间距单位 - 4px base */
  --space-0: 0;
  --space-px: 1px;
  --space-0_5: 0.125rem;   /* 2px */
  --space-1: 0.25rem;      /* 4px */
  --space-1_5: 0.375rem;   /* 6px */
  --space-2: 0.5rem;       /* 8px */
  --space-2_5: 0.625rem;   /* 10px */
  --space-3: 0.75rem;      /* 12px */
  --space-3_5: 0.875rem;   /* 14px */
  --space-4: 1rem;         /* 16px */
  --space-5: 1.25rem;      /* 20px */
  --space-6: 1.5rem;       /* 24px */
  --space-7: 1.75rem;      /* 28px */
  --space-8: 2rem;         /* 32px */
  --space-9: 2.25rem;      /* 36px */
  --space-10: 2.5rem;      /* 40px */
  --space-11: 2.75rem;     /* 44px */
  --space-12: 3rem;        /* 48px */
  --space-14: 3.5rem;      /* 56px */
  --space-16: 4rem;        /* 64px */
  --space-20: 5rem;        /* 80px */
  --space-24: 6rem;        /* 96px */
  --space-28: 7rem;        /* 112px */
  --space-32: 8rem;        /* 128px */
}
```

### 布局容器系统
```css
/* 主容器 - 三栏布局 */
.main-container {
  display: grid;
  grid-template-columns: 1fr 3fr 6fr; /* 1:3:6 黄金比例 */
  gap: var(--space-4);
  height: 100vh;
  max-width: 1920px;
  margin: 0 auto;
  padding: var(--space-4);
}

/* 左侧导航栏 */
.sidebar-left {
  min-width: 200px;
  max-width: 280px;
  background: var(--glass-morphism-panel);
  padding: var(--space-6);
  border-radius: 16px;
}

/* 中央聊天区域 */
.chat-center {
  min-width: 400px;
  background: var(--glass-morphism-card);
  padding: var(--space-4);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
}

/* 右侧内容面板 */
.content-right {
  background: var(--glass-morphism-panel);
  padding: var(--space-6);
  border-radius: 16px;
  overflow: hidden;
}
```

## 圆角和阴影系统

### 圆角系统
```css
:root {
  /* 圆角大小系统 */
  --radius-none: 0;
  --radius-sm: 0.125rem;    /* 2px */
  --radius-base: 0.25rem;   /* 4px */
  --radius-md: 0.375rem;    /* 6px */
  --radius-lg: 0.5rem;      /* 8px */
  --radius-xl: 0.75rem;     /* 12px */
  --radius-2xl: 1rem;       /* 16px */
  --radius-3xl: 1.5rem;     /* 24px */
  --radius-full: 9999px;    /* 完全圆形 */
}
```

### 阴影系统
```css
:root {
  /* 阴影深度系统 */
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 
               0 1px 2px -1px rgba(0, 0, 0, 0.1);
  --shadow-base: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
                 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 
               0 4px 6px -4px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
               0 8px 10px -6px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
  
  /* 彩色阴影 - 角色专属 */
  --shadow-alex: 0 8px 25px -8px rgba(255, 215, 0, 0.3);
  --shadow-kulu: 0 8px 25px -8px rgba(59, 130, 246, 0.3);
  --shadow-mike: 0 8px 25px -8px rgba(255, 140, 66, 0.3);
  --shadow-emma: 0 8px 25px -8px rgba(16, 185, 129, 0.3);
  --shadow-david: 0 8px 25px -8px rgba(225, 29, 72, 0.3);
  --shadow-catherine: 0 8px 25px -8px rgba(139, 92, 246, 0.3);
}
```

## 响应式断点系统

### 断点定义
```css
:root {
  /* 响应式断点 */
  --breakpoint-xs: 320px;   /* 超小屏手机 */
  --breakpoint-sm: 640px;   /* 小屏手机 */
  --breakpoint-md: 768px;   /* 平板 */
  --breakpoint-lg: 1024px;  /* 笔记本 */
  --breakpoint-xl: 1280px;  /* 桌面 */
  --breakpoint-2xl: 1536px; /* 大屏桌面 */
}

/* 响应式布局调整 */
@media (max-width: 768px) {
  .main-container {
    grid-template-columns: 1fr; /* 移动端单栏 */
    gap: var(--space-2);
    padding: var(--space-2);
  }
  
  .sidebar-left {
    display: none; /* 移动端隐藏侧边栏 */
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .main-container {
    grid-template-columns: 2fr 5fr; /* 平板双栏 */
  }
  
  .content-right {
    order: -1; /* 调整内容顺序 */
  }
}
```

---

*此文档定义了智链平台完整的Cloudsway视觉设计系统，为所有界面元素提供统一的设计语言和实现规范。*