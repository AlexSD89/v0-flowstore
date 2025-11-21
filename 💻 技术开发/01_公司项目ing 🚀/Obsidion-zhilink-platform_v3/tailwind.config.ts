import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // === Cloudsway 2.0 核心品牌色彩 ===
        cloudsway: {
          primary: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#6366f1', // 深邃紫色 - 主品牌色
            600: '#4f46e5',
            700: '#4338ca',
            800: '#3730a3',
            900: '#312e81',
          },
          secondary: {
            50: '#f0fdfa',
            100: '#ccfbf1',
            200: '#99f6e4',
            300: '#5eead4',
            400: '#2dd4bf',
            500: '#06b6d4', // 清澈青色 - 次要品牌色
            600: '#0891b2',
            700: '#0e7490',
            800: '#155e75',
            900: '#164e63',
          },
          accent: {
            50: '#f5f3ff',
            100: '#ede9fe',
            200: '#ddd6fe',
            300: '#c4b5fd',
            400: '#a78bfa',
            500: '#8b5cf6', // 神秘紫罗兰 - 强调色
            600: '#7c3aed',
            700: '#6d28d9',
            800: '#5b21b6',
            900: '#4c1d95',
          },
        },

        // === 深空背景系统 ===
        background: {
          main: '#0f172a', // 深空主背景
          card: '#1e293b', // 卡片背景
          glass: 'rgba(30, 41, 59, 0.8)', // 玻璃态背景
          overlay: 'rgba(15, 23, 42, 0.9)', // 遮罩背景
        },

        // === 文本色彩系统 ===
        text: {
          primary: '#f8fafc', // 主要文本
          secondary: '#cbd5e1', // 次要文本
          muted: '#64748b', // 弱化文本
          inverse: '#0f172a', // 反色文本
        },

        // === 边框与分割线 ===
        border: {
          primary: 'rgba(203, 213, 225, 0.2)',
          secondary: 'rgba(100, 116, 139, 0.3)',
          accent: 'rgba(139, 92, 246, 0.4)',
        },

        // === 功能性色彩 ===
        status: {
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#06b6d4',
        },

        // === 6角色专属色彩 ===
        agent: {
          alex: {
            primary: '#3b82f6', // 蓝色 - 信任与洞察
            bg: 'rgba(59, 130, 246, 0.1)',
            border: 'rgba(59, 130, 246, 0.3)',
            dark: '#1e40af',
          },
          sarah: {
            primary: '#8b5cf6', // 紫色 - 专业与创新
            bg: 'rgba(139, 92, 246, 0.1)',
            border: 'rgba(139, 92, 246, 0.3)',
            dark: '#7c3aed',
          },
          mike: {
            primary: '#10b981', // 绿色 - 创意与活力
            bg: 'rgba(16, 185, 129, 0.1)',
            border: 'rgba(16, 185, 129, 0.3)',
            dark: '#059669',
          },
          emma: {
            primary: '#f59e0b', // 橙色 - 洞察与智慧
            bg: 'rgba(245, 158, 11, 0.1)',
            border: 'rgba(245, 158, 11, 0.3)',
            dark: '#d97706',
          },
          david: {
            primary: '#6366f1', // 靛青 - 执行与秩序
            bg: 'rgba(99, 102, 241, 0.1)',
            border: 'rgba(99, 102, 241, 0.3)',
            dark: '#4f46e5',
          },
          catherine: {
            primary: '#ec4899', // 粉色 - 远见与价值
            bg: 'rgba(236, 72, 153, 0.1)',
            border: 'rgba(236, 72, 153, 0.3)',
            dark: '#db2777',
          },
        },

        // === 三大产品类型色彩 ===
        workforce: {
          primary: '#3b82f6',
          secondary: '#1e40af',
          bg: 'rgba(59, 130, 246, 0.05)',
          border: 'rgba(59, 130, 246, 0.2)',
        },
        expert: {
          primary: '#8b5cf6',
          secondary: '#7c3aed',
          bg: 'rgba(139, 92, 246, 0.05)',
          border: 'rgba(139, 92, 246, 0.2)',
        },
        report: {
          primary: '#10b981',
          secondary: '#059669',
          bg: 'rgba(16, 185, 129, 0.05)',
          border: 'rgba(16, 185, 129, 0.2)',
        },
      },

      // === 字体系统 ===
      fontFamily: {
        sans: ['Inter', 'PingFang SC', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Inter Tight', 'PingFang SC', 'serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Cascadia Code', 'Consolas', 'monospace'],
        display: ['Orbitron', 'Inter Tight', 'sans-serif'], // 科技感标题字体
        numeric: ['JetBrains Mono', 'monospace'], // 数字专用字体
      },

      // === 间距系统 ===
      spacing: {
        '18': '4.5rem', // 72px
        '88': '22rem', // 352px
        '128': '32rem', // 512px
      },

      // === 黄金比例布局系统 ===
      width: {
        'sidebar': '38.2%', // φ⁻¹ × 100%
        'content': '61.8%', // φ⁻² × 100%
        'nav': '10%', // 导航栏
        'side': '30%', // 侧边栏
        'main': '60%', // 主内容区
      },

      // === 动画时间 ===
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
      },

      // === 自定义阴影 ===
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.1)',
        'glow-primary': '0 0 20px rgba(99, 102, 241, 0.3)',
        'glow-secondary': '0 0 20px rgba(6, 182, 212, 0.3)',
        'glow-accent': '0 0 20px rgba(139, 92, 246, 0.3)',
      },

      // === 自定义背景 ===
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(248, 250, 252, 0.1) 0%, rgba(203, 213, 225, 0.05) 100%)',
        'hero-bg': 'radial-gradient(ellipse at top, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(ellipse at bottom, rgba(6, 182, 212, 0.1) 0%, transparent 50%)',
        'collaboration-gradient': 'conic-gradient(from 0deg, #3b82f6 0deg 60deg, #8b5cf6 60deg 120deg, #10b981 120deg 180deg, #f59e0b 180deg 240deg, #6366f1 240deg 300deg, #ec4899 300deg 360deg)',
      },

      // === 自定义滤镜 ===
      backdropBlur: {
        xs: '2px',
      },

      // === 断点系统 ===
      screens: {
        'xs': '475px',
        '3xl': '1792px',
      },

      // === 动画关键帧 ===
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(99, 102, 241, 0.6)' },
        },
        'rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
      },
      
      // === 动画名称 ===
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'rotate': 'rotate 60s linear infinite',
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
  darkMode: ['class', '[data-theme="dark"]'],
};

export default config;