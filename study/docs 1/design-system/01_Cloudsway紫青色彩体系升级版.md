# Cloudsway 紫青色彩体系 2.1 升级版

**版本**: 2.1.0 | **日期**: 2025-08-12 | **状态**: 拂晓深空融合版  
**基于**: 原紫青科技风 + 拂晓与深空设计哲学 + 六角色智能化

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
  --cloudsway-violet: #7C3AED;       /* 深紫色 */
  --cloudsway-teal: #06B6D4;         /* 深青色 */
}
```

---

## 第一部分：升级后的核心色彩矩阵

### 1.1 全局色彩变量系统

```css
/* 智链平台全局色彩系统 2.1 */
:root {
  /* === 基础色彩层级 === */
  
  /* 深空背景体系 */
  --background-primary: #05080E;      /* 主背景 - 深空黑 */
  --background-secondary: #0A0F1C;    /* 次背景 - 深空灰 */
  --background-tertiary: #12172B;     /* 三级背景 - 深空蓝 */
  --background-elevated: #1A1F35;     /* 悬浮背景 */
  
  /* 拂晓光芒体系 */
  --dawn-primary: #FFB366;            /* 主拂晓色 */
  --dawn-secondary: #FF8A4C;          /* 次拂晓色 */
  --dawn-subtle: #FFA366;             /* 柔和拂晓 */
  --dawn-glow: rgba(255, 179, 102, 0.3); /* 拂晓光芒 */
  
  /* Cloudsway紫青核心 */
  --primary: #8B5CF6;                 /* 品牌主色 - 紫 */
  --primary-hover: #7C3AED;           /* 主色悬停 */
  --primary-active: #6D28D9;          /* 主色激活 */
  --primary-subtle: rgba(139, 92, 246, 0.1); /* 主色背景 */
  
  --secondary: #22D3EE;               /* 辅助主色 - 青 */
  --secondary-hover: #06B6D4;         /* 辅助悬停 */
  --secondary-active: #0891B2;        /* 辅助激活 */
  --secondary-subtle: rgba(34, 211, 238, 0.1); /* 辅助背景 */
  
  /* === 语义化色彩 === */
  
  /* 成功状态 - 融合拂晓温暖 */
  --success: #10B981;                 /* 成功主色 */
  --success-bg: rgba(16, 185, 129, 0.1);
  --success-border: rgba(16, 185, 129, 0.3);
  --success-glow: rgba(16, 185, 129, 0.4);
  
  /* 警告状态 - 拂晓主色 */
  --warning: var(--dawn-primary);     /* 使用拂晓色 */
  --warning-bg: rgba(255, 179, 102, 0.1);
  --warning-border: rgba(255, 179, 102, 0.3);
  --warning-glow: var(--dawn-glow);
  
  /* 错误状态 */
  --error: #EF4444;
  --error-bg: rgba(239, 68, 68, 0.1);
  --error-border: rgba(239, 68, 68, 0.3);
  --error-glow: rgba(239, 68, 68, 0.4);
  
  /* 信息状态 - Cloudsway青色 */
  --info: var(--secondary);
  --info-bg: var(--secondary-subtle);
  --info-border: rgba(34, 211, 238, 0.3);
  --info-glow: rgba(34, 211, 238, 0.4);
  
  /* === 文本色彩层级 === */
  
  --text-primary: #FFFFFF;            /* 主文本 - 纯白 */
  --text-secondary: #B4B8C5;          /* 次级文本 - 深空灰 */
  --text-tertiary: #6B7280;           /* 三级文本 - 中灰 */
  --text-disabled: #4B5563;           /* 禁用文本 - 深灰 */
  
  --text-brand: var(--primary);       /* 品牌文本 */
  --text-dawn: var(--dawn-primary);    /* 拂晓文本 */
  --text-success: var(--success);      /* 成功文本 */
  --text-warning: var(--warning);      /* 警告文本 */
  --text-error: var(--error);          /* 错误文本 */
  
  /* === 边框与分割线 === */
  
  --border-primary: rgba(255, 255, 255, 0.1);   /* 主边框 */
  --border-secondary: rgba(255, 255, 255, 0.05); /* 次边框 */
  --border-brand: rgba(139, 92, 246, 0.3);       /* 品牌边框 */
  --border-dawn: rgba(255, 179, 102, 0.3);       /* 拂晓边框 */
  
  --divider: rgba(255, 255, 255, 0.08);          /* 分割线 */
  --divider-strong: rgba(255, 255, 255, 0.15);   /* 强分割线 */
  
  /* === 光效与阴影 === */
  
  /* 深空阴影系统 */
  --shadow-sm: 0 2px 8px rgba(5, 8, 14, 0.3);           /* 小阴影 */
  --shadow-md: 0 4px 16px rgba(5, 8, 14, 0.4);          /* 中阴影 */
  --shadow-lg: 0 8px 32px rgba(5, 8, 14, 0.5);          /* 大阴影 */
  --shadow-xl: 0 16px 64px rgba(5, 8, 14, 0.6);         /* 超大阴影 */
  
  /* 品牌光效 */
  --glow-primary: 0 0 20px rgba(139, 92, 246, 0.4);     /* 紫色光效 */
  --glow-secondary: 0 0 20px rgba(34, 211, 238, 0.4);   /* 青色光效 */
  --glow-dawn: 0 0 20px var(--dawn-glow);               /* 拂晓光效 */
  --glow-success: 0 0 20px rgba(16, 185, 129, 0.4);     /* 成功光效 */
  
  /* === 渐变系统 === */
  
  /* 品牌渐变 */
  --gradient-brand: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  --gradient-brand-hover: linear-gradient(135deg, var(--primary-hover) 0%, var(--secondary-hover) 100%);
  --gradient-brand-vertical: linear-gradient(180deg, var(--primary) 0%, var(--secondary) 100%);
  
  /* 拂晓渐变 */
  --gradient-dawn: linear-gradient(135deg, var(--dawn-primary) 0%, var(--dawn-secondary) 100%);
  --gradient-dawn-soft: linear-gradient(135deg, var(--dawn-subtle) 0%, var(--dawn-primary) 100%);
  
  /* 深空渐变 */
  --gradient-deep-space: linear-gradient(135deg, var(--background-primary) 0%, var(--background-secondary) 100%);
  --gradient-elevated: linear-gradient(135deg, var(--background-secondary) 0%, var(--background-tertiary) 100%);
  
  /* 成功渐变 */
  --gradient-success: linear-gradient(135deg, var(--success) 0%, #059669 100%);
  
  /* === 模糊效果 === */
  
  --backdrop-blur: blur(16px);                          /* 标准模糊 */
  --backdrop-blur-strong: blur(24px);                   /* 强模糊 */
  --backdrop-blur-subtle: blur(8px);                    /* 轻模糊 */
}
```

### 1.2 响应式色彩适配

```css
/* 深色模式优先，同时支持浅色模式 */
@media (prefers-color-scheme: light) {
  :root {
    /* 浅色模式下的拂晓深空适配 */
    --background-primary: #FAFBFC;      /* 浅色背景 */
    --background-secondary: #F5F7FA;    /* 次级浅色 */
    --background-tertiary: #EDF2F7;     /* 三级浅色 */
    
    --text-primary: #1A202C;            /* 深色文本 */
    --text-secondary: #4A5568;          /* 次级深色 */
    --text-tertiary: #718096;           /* 三级深色 */
    
    /* 保持拂晓和品牌色不变 */
    --dawn-primary: #FF8A4C;            /* 浅色模式下更深的拂晓 */
    --primary: #7C3AED;                 /* 浅色模式下更深的紫 */
    
    --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.12);
    --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.15);
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  :root {
    --text-primary: #FFFFFF;
    --text-secondary: #E2E8F0;
    --border-primary: rgba(255, 255, 255, 0.3);
    --primary: #A855F7;                 /* 更高对比的紫色 */
    --secondary: #0EA5E9;               /* 更高对比的青色 */
  }
}

/* 动效减少模式支持 */
@media (prefers-reduced-motion: reduce) {
  :root {
    --transition-fast: none;
    --transition-normal: none;
    --transition-slow: none;
  }
}
```

---

## 第二部分：组件级色彩应用

### 2.1 按钮组件色彩系统

```css
/* 主要按钮 - 拂晓风格 */
.btn-primary {
  background: var(--gradient-dawn);
  color: var(--background-primary);
  border: 1px solid var(--dawn-primary);
  box-shadow: var(--glow-dawn);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary:hover {
  background: var(--gradient-dawn-soft);
  box-shadow: var(--glow-dawn), var(--shadow-md);
  transform: translateY(-2px);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

/* 次要按钮 - Cloudsway风格 */
.btn-secondary {
  background: var(--gradient-brand);
  color: var(--text-primary);
  border: 1px solid var(--primary);
  box-shadow: var(--glow-primary);
}

.btn-secondary:hover {
  background: var(--gradient-brand-hover);
  box-shadow: var(--glow-primary), var(--shadow-md);
}

/* 线框按钮 - 深空风格 */
.btn-outline {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
  backdrop-filter: var(--backdrop-blur-subtle);
}

.btn-outline:hover {
  background: var(--primary-subtle);
  border-color: var(--primary);
  color: var(--primary);
}

/* 危险按钮 */
.btn-danger {
  background: linear-gradient(135deg, var(--error) 0%, #DC2626 100%);
  color: var(--text-primary);
  border: 1px solid var(--error);
  box-shadow: var(--glow-error);
}
```

### 2.2 卡片组件色彩系统

```css
/* 基础卡片 - 深空风格 */
.card {
  background: var(--gradient-elevated);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
  box-shadow: var(--shadow-md);
  backdrop-filter: var(--backdrop-blur);
}

/* 品牌卡片 - Cloudsway风格 */
.card-brand {
  background: var(--gradient-brand);
  border: 1px solid var(--primary);
  box-shadow: var(--glow-primary), var(--shadow-lg);
  color: var(--text-primary);
}

/* 成功卡片 - 拂晓成功风格 */
.card-success {
  background: linear-gradient(135deg, 
    var(--success-bg) 0%, 
    rgba(255, 179, 102, 0.05) 100%);
  border: 1px solid var(--success-border);
  box-shadow: var(--glow-success);
}

/* 警告卡片 - 拂晓主风格 */
.card-warning {
  background: linear-gradient(135deg, 
    var(--warning-bg) 0%, 
    rgba(255, 179, 102, 0.1) 100%);
  border: 1px solid var(--warning-border);
  box-shadow: var(--glow-dawn);
}

/* 悬浮卡片 */
.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
  border-color: var(--border-brand);
}
```

### 2.3 表单组件色彩系统

```css
/* 输入框 - 深空风格 */
.input {
  background: var(--background-secondary);
  border: 1px solid var(--border-primary);
  color: var(--text-primary);
  border-radius: 8px;
  padding: 12px 16px;
  transition: all 0.3s ease;
}

.input:focus {
  background: var(--background-tertiary);
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-subtle), var(--glow-primary);
  outline: none;
}

.input::placeholder {
  color: var(--text-tertiary);
}

/* 选择框 */
.select {
  background: var(--background-secondary);
  border: 1px solid var(--border-primary);
  color: var(--text-primary);
  border-radius: 8px;
}

.select:focus {
  border-color: var(--primary);
  box-shadow: var(--glow-primary);
}

/* 复选框和单选框 */
.checkbox, .radio {
  accent-color: var(--primary);
  width: 18px;
  height: 18px;
}

.checkbox:checked, .radio:checked {
  box-shadow: var(--glow-primary);
}
```

---

## 第三部分：六角色专属色彩升级

### 3.1 角色色彩升级矩阵

```css
/* Alex - 需求分析师色彩升级 */
:root {
  --alex-primary: #8B5CF6;                    /* 保持紫色主调 */
  --alex-secondary: var(--secondary);          /* 融合青色 */
  --alex-gradient: var(--gradient-brand);      /* 使用品牌渐变 */
  --alex-glow: var(--glow-primary);           /* 品牌光效 */
  --alex-dawn-accent: var(--dawn-subtle);     /* 拂晓点缀 */
}

/* Sarah - 技术架构师色彩升级 */
:root {
  --sarah-primary: #7C3AED;                   /* 深紫科技色 */
  --sarah-secondary: #6366F1;                 /* 靠购技术蓝 */
  --sarah-gradient: linear-gradient(135deg, #7C3AED 0%, #6366F1 100%);
  --sarah-glow: 0 0 20px rgba(124, 58, 237, 0.4);
  --sarah-circuit: rgba(255, 255, 255, 0.1);  /* 电路纹理 */
}

/* Mike - 创意总监色彩升级 */
:root {
  --mike-primary: var(--primary);             /* 紫色创意 */
  --mike-secondary: #EC4899;                  /* 粉色激情 */
  --mike-dawn: var(--dawn-primary);           /* 拂晓灵感 */
  --mike-gradient: linear-gradient(135deg, var(--primary) 0%, #EC4899 30%, var(--dawn-primary) 100%);
  --mike-creative-glow: 0 0 30px rgba(236, 72, 153, 0.4);
}

/* Emma - 数据分析师色彩升级 */
:root {
  --emma-primary: var(--secondary);           /* 青色智慧 */
  --emma-secondary: #10B981;                  /* 绿色成长 */
  --emma-gradient: linear-gradient(135deg, var(--secondary) 0%, #10B981 100%);
  --emma-data-glow: var(--glow-secondary);
  --emma-flow: rgba(16, 185, 129, 0.3);       /* 数据流动 */
}

/* David - 项目经理色彩升级 */
:root {
  --david-primary: var(--secondary);          /* 青色协调 */
  --david-secondary: #67E8F9;                 /* 浅青平衡 */
  --david-gradient: linear-gradient(135deg, var(--secondary) 0%, #67E8F9 100%);
  --david-glow: var(--glow-secondary);
  --david-timeline: rgba(34, 211, 238, 0.2);  /* 时间线 */
}

/* Lisa - 首席顾问色彩升级 */
:root {
  --lisa-primary: var(--primary);             /* 紫色权威 */
  --lisa-secondary: var(--dawn-primary);      /* 金色尊贵 */
  --lisa-gradient: linear-gradient(135deg, var(--primary) 0%, var(--dawn-primary) 100%);
  --lisa-expert-glow: 0 0 40px rgba(245, 158, 11, 0.6);
  --lisa-crown: var(--dawn-bright);           /* 皇冠色 */
  --lisa-aura: conic-gradient(from 0deg, var(--dawn-primary), transparent 60deg, transparent 120deg, var(--dawn-primary) 180deg);
}
```

### 3.2 角色状态色彩系统

```css
/* 角色通用状态 */
.role-avatar {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: visible;
}

/* 等待状态 - 深空静止 */
.role-avatar.waiting {
  opacity: 0.4;
  filter: grayscale(30%);
  transform: scale(0.95);
  box-shadow: var(--shadow-sm);
}

/* 激活状态 - 拂晓爆发 */
.role-avatar.active {
  opacity: 1;
  filter: none;
  transform: scale(1.05);
  box-shadow: var(--role-glow), var(--shadow-lg);
}

.role-avatar.active::before {
  content: '';
  position: absolute;
  inset: -4px;
  background: var(--role-gradient);
  border-radius: inherit;
  z-index: -1;
  opacity: 0.3;
  animation: roleActivePulse 2s ease-in-out infinite;
}

@keyframes roleActivePulse {
  0%, 100% { 
    transform: scale(1);
    opacity: 0.3;
  }
  50% { 
    transform: scale(1.1);
    opacity: 0.6;
  }
}

/* 思考状态 - 智能脖波 */
.role-avatar.thinking {
  position: relative;
}

.role-avatar.thinking::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--role-gradient);
  animation: roleThinking 2s ease-in-out infinite;
  z-index: -1;
}

@keyframes roleThinking {
  0%, 100% { 
    opacity: 0.2;
    transform: scale(1);
  }
  50% { 
    opacity: 0.6;
    transform: scale(1.03);
  }
}

/* Lisa专家激活状态 - 专家光环 */
.role-avatar.lisa.expert-activated {
  position: relative;
  animation: lisaExpertAura 3s ease-in-out infinite;
}

.role-avatar.lisa.expert-activated::before {
  content: '';
  position: absolute;
  inset: -8px;
  background: var(--lisa-aura);
  border-radius: 50%;
  animation: lisaAuraRotation 8s linear infinite;
  z-index: -2;
  filter: blur(2px);
}

@keyframes lisaExpertAura {
  0%, 100% {
    box-shadow: 
      var(--lisa-expert-glow),
      0 0 60px rgba(245, 158, 11, 0.4),
      0 0 100px rgba(245, 158, 11, 0.2);
  }
  50% {
    box-shadow: 
      var(--lisa-expert-glow),
      0 0 80px rgba(245, 158, 11, 0.6),
      0 0 120px rgba(245, 158, 11, 0.3);
  }
}

@keyframes lisaAuraRotation {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

---

## 第四部分：动态色彩系统

### 4.1 上下文适应色彩

```css
/* 基于激活角色动态调整界面色彩 */
.chat-container[data-active-role="alex"] {
  --context-primary: var(--alex-primary);
  --context-gradient: var(--alex-gradient);
  --context-glow: var(--alex-glow);
}

.chat-container[data-active-role="sarah"] {
  --context-primary: var(--sarah-primary);
  --context-gradient: var(--sarah-gradient);
  --context-glow: var(--sarah-glow);
}

.chat-container[data-active-role="mike"] {
  --context-primary: var(--mike-primary);
  --context-gradient: var(--mike-gradient);
  --context-glow: var(--mike-creative-glow);
}

.chat-container[data-active-role="emma"] {
  --context-primary: var(--emma-primary);
  --context-gradient: var(--emma-gradient);
  --context-glow: var(--emma-data-glow);
}

.chat-container[data-active-role="david"] {
  --context-primary: var(--david-primary);
  --context-gradient: var(--david-gradient);
  --context-glow: var(--david-glow);
}

.chat-container[data-active-role="lisa"] {
  --context-primary: var(--lisa-primary);
  --context-gradient: var(--lisa-gradient);
  --context-glow: var(--lisa-expert-glow);
}

/* 上下文相关的动态组件 */
.context-button {
  background: var(--context-gradient);
  box-shadow: var(--context-glow);
  border: 1px solid var(--context-primary);
}

.context-card {
  border-left: 3px solid var(--context-primary);
  background: linear-gradient(135deg, 
    var(--background-secondary) 0%, 
    rgba(var(--context-primary-rgb), 0.05) 100%);
}

.context-progress {
  background: var(--context-gradient);
  box-shadow: var(--context-glow);
}
```

### 4.2 协作模式色彩

```css
/* 多角色协作时的色彩混合 */
.collaboration-mode {
  --collab-gradient: linear-gradient(135deg, 
    var(--role1-primary) 0%, 
    var(--role2-primary) 50%, 
    var(--role3-primary) 100%);
  
  background: var(--collab-gradient);
  opacity: 0.1;
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: -1;
}

/* 协作连接线色彩 */
.collaboration-connection {
  stroke: url(#collaborationGradient);
  stroke-width: 2;
  fill: none;
  animation: collaborationFlow 3s linear infinite;
}

/* SVG渐变定义 */
#collaborationGradient {
  stop:nth-child(1) { stop-color: var(--role1-primary); }
  stop:nth-child(2) { stop-color: var(--role2-primary); }
  stop:nth-child(3) { stop-color: var(--role3-primary); }
}

@keyframes collaborationFlow {
  0% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: 20; }
}
```

---

## 第五部分：实时色彩反馈系统

### 5.1 用户交互反馈

```css
/* 成功状态 - 拂晓风格 */
.feedback-success {
  background: var(--gradient-dawn);
  color: var(--background-primary);
  border: 1px solid var(--dawn-primary);
  box-shadow: var(--glow-dawn);
  animation: feedbackSuccess 0.6s ease-out;
}

@keyframes feedbackSuccess {
  0% {
    transform: scale(0.8) rotate(-5deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.1) rotate(2deg);
    opacity: 0.8;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

/* 错误状态 */
.feedback-error {
  background: linear-gradient(135deg, var(--error) 0%, #DC2626 100%);
  color: var(--text-primary);
  border: 1px solid var(--error);
  box-shadow: var(--glow-error);
  animation: feedbackError 0.5s ease-out;
}

@keyframes feedbackError {
  0%, 20%, 50%, 80%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 70%, 90% {
    transform: translateX(-8px);
  }
  40%, 60% {
    transform: translateX(8px);
  }
}

/* 加载状态 */
.feedback-loading {
  background: var(--gradient-elevated);
  border: 1px solid var(--border-primary);
  position: relative;
  overflow: hidden;
}

.feedback-loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: var(--gradient-brand);
  opacity: 0.3;
  animation: loadingShimmer 2s ease-in-out infinite;
}

@keyframes loadingShimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}
```

### 5.2 智能状态指示器

```css
/* 置信度指示器 */
.confidence-indicator {
  height: 4px;
  background: var(--background-secondary);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}

.confidence-fill {
  height: 100%;
  background: var(--gradient-brand);
  border-radius: 2px;
  transition: width 1s ease-out;
  position: relative;
}

.confidence-fill::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 100%;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 100%);
  animation: confidencePulse 2s ease-in-out infinite;
}

@keyframes confidencePulse {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}

/* AI思考波纹 */
.thinking-waves {
  display: flex;
  align-items: center;
  gap: 4px;
}

.thinking-wave {
  width: 8px;
  height: 8px;
  background: var(--primary);
  border-radius: 50%;
  animation: thinkingWave 1.4s ease-in-out infinite;
}

.thinking-wave:nth-child(2) { animation-delay: 0.2s; }
.thinking-wave:nth-child(3) { animation-delay: 0.4s; }
.thinking-wave:nth-child(4) { animation-delay: 0.6s; }

@keyframes thinkingWave {
  0%, 80%, 100% {
    transform: scale(1);
    opacity: 0.4;
  }
  40% {
    transform: scale(1.3);
    opacity: 1;
  }
}
```

---

## 第六部分：可访问性与性能优化

### 6.1 色彩可访问性

```css
/* 确保足够的对比度 */
:root {
  --contrast-ratio-aa: 4.5;   /* WCAG AA标准 */
  --contrast-ratio-aaa: 7;    /* WCAG AAA标准 */
}

/* 高对比度变体 */
.high-contrast {
  --text-primary: #FFFFFF;
  --text-secondary: #F0F0F0;
  --background-primary: #000000;
  --background-secondary: #1A1A1A;
  --primary: #A855F7;
  --secondary: #0EA5E9;
  --dawn-primary: #FFD700;
}

/* 焦点状态可见性 */
.focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px var(--primary-subtle);
}

/* 减少动效支持 */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 6.2 性能优化

```css
/* CSS变量优化 */
:root {
  /* 使用 color-mix 减少计算 */
  --primary-10: color-mix(in srgb, var(--primary) 10%, transparent);
  --primary-20: color-mix(in srgb, var(--primary) 20%, transparent);
  --primary-30: color-mix(in srgb, var(--primary) 30%, transparent);
  
  /* 使用 oklch 更好的颜色表达 */
  --primary-oklch: oklch(0.65 0.25 270);
  --secondary-oklch: oklch(0.75 0.15 200);
}

/* GPU加速的动画 */
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform, opacity;
}

/* 优化的渐变渲染 */
.optimized-gradient {
  background-image: 
    linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  background-attachment: fixed;
  background-size: 200% 200%;
}

/* 减少重绘的合成层 */
.composite-layer {
  contain: layout style paint;
  isolation: isolate;
}
```

---

## 结语：智能化色彩生态系统

这次Cloudsway紫青色彩体系的升级，将传统的静态色彩系统转化为智能化、动态化的色彩生态：

🌅 **拂晓与深空的完美融合** - 温暖与专业的平衡表达  
🎨 **六角色个性化色彩** - 每个角色都有独特的视觉身份  
🧠 **智能上下文适应** - 根据情境动态调整界面色彩  
🌌 **深空��质体验** - 专业级的深色界面设计  
✨ **光效与动效增强** - 丰富的视觉反馈和交互体验

通过这套升级的色彩系统，智链平台将具备：
- 🎯 **更强的品牌识别度**
- 👤 **更个性化的用户体验**
- 🚀 **更高的交互效率**
- 🎨 **更丰富的视觉层次**

---

**文档维护者**: 智链设计团队  
**最后更新**: 2025年8月12日  
**文档版本**: 2.1.0 - Cloudsway拂晓深空融合版  
**文档状态**: 色彩系统升级方案 - 待实施