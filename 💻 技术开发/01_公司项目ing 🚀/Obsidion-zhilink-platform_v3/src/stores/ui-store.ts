/**
 * UI状态管理
 * 
 * 管理全局UI状态，如主题、侧边栏、模态框、通知等
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UIState {
  // 主题
  theme: 'light' | 'dark' | 'system';
  isDark: boolean;
  
  // 布局
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  headerVisible: boolean;
  footerVisible: boolean;
  
  // 模态框和弹窗
  modals: Record<string, {
    isOpen: boolean;
    data?: any;
    options?: any;
  }>;
  
  // 抽屉和面板
  drawers: Record<string, {
    isOpen: boolean;
    data?: any;
    position?: 'left' | 'right' | 'top' | 'bottom';
  }>;
  
  // 通知和提示
  toasts: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
    action?: {
      label: string;
      handler: () => void;
    };
    timestamp: Date;
  }>;
  
  // 加载状态
  globalLoading: boolean;
  loadingText: string;
  loadingStates: Record<string, boolean>;
  
  // 页面状态
  currentPage: string;
  pageTitle: string;
  breadcrumbs: Array<{
    label: string;
    href?: string;
    icon?: string;
  }>;
  
  // 搜索和导航
  quickSearchOpen: boolean;
  commandPaletteOpen: boolean;
  mobileMenuOpen: boolean;
  
  // 偏好设置
  preferences: {
    language: string;
    timezone: string;
    compactMode: boolean;
    animations: boolean;
    autoSave: boolean;
    notifications: boolean;
  };
  
  // 响应式
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  
  // 性能
  performanceMode: 'auto' | 'performance' | 'quality';
  reducedMotion: boolean;
  
  // 错误状态
  error: {
    hasError: boolean;
    message: string | null;
    details?: any;
  };
}

interface UIActions {
  // 主题控制
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
  updateSystemTheme: (isDark: boolean) => void;
  
  // 布局控制
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapse: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setHeaderVisible: (visible: boolean) => void;
  setFooterVisible: (visible: boolean) => void;
  
  // 模态框管理
  openModal: (key: string, data?: any, options?: any) => void;
  closeModal: (key: string) => void;
  closeAllModals: () => void;
  
  // 抽屉管理
  openDrawer: (key: string, data?: any, position?: 'left' | 'right' | 'top' | 'bottom') => void;
  closeDrawer: (key: string) => void;
  closeAllDrawers: () => void;
  
  // 通知管理
  addToast: (toast: Omit<UIState['toasts'][0], 'id' | 'timestamp'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  
  // 加载状态
  setGlobalLoading: (loading: boolean, text?: string) => void;
  setLoadingState: (key: string, loading: boolean) => void;
  clearLoadingStates: () => void;
  
  // 页面状态
  setCurrentPage: (page: string) => void;
  setPageTitle: (title: string) => void;
  setBreadcrumbs: (breadcrumbs: UIState['breadcrumbs']) => void;
  addBreadcrumb: (breadcrumb: UIState['breadcrumbs'][0]) => void;
  
  // 搜索和导航
  toggleQuickSearch: () => void;
  toggleCommandPalette: () => void;
  toggleMobileMenu: () => void;
  closeAllOverlays: () => void;
  
  // 偏好设置
  updatePreferences: (preferences: Partial<UIState['preferences']>) => void;
  setLanguage: (language: string) => void;
  setTimezone: (timezone: string) => void;
  toggleCompactMode: () => void;
  toggleAnimations: () => void;
  
  // 响应式更新
  updateScreenSize: (size: UIState['screenSize']) => void;
  updateDeviceType: (isMobile: boolean, isTablet: boolean, isDesktop: boolean) => void;
  
  // 性能控制
  setPerformanceMode: (mode: 'auto' | 'performance' | 'quality') => void;
  setReducedMotion: (reduced: boolean) => void;
  
  // 错误处理
  setError: (message: string, details?: any) => void;
  clearError: () => void;
  
  // 重置
  reset: () => void;
}

type UIStore = UIState & UIActions;

// 初始状态
const initialState: UIState = {
  theme: 'system',
  isDark: false,
  sidebarOpen: true,
  sidebarCollapsed: false,
  headerVisible: true,
  footerVisible: true,
  modals: {},
  drawers: {},
  toasts: [],
  globalLoading: false,
  loadingText: '',
  loadingStates: {},
  currentPage: '/',
  pageTitle: 'LaunchX智链平台',
  breadcrumbs: [],
  quickSearchOpen: false,
  commandPaletteOpen: false,
  mobileMenuOpen: false,
  preferences: {
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    compactMode: false,
    animations: true,
    autoSave: true,
    notifications: true,
  },
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  screenSize: 'lg',
  performanceMode: 'auto',
  reducedMotion: false,
  error: {
    hasError: false,
    message: null,
  },
};

// 检测系统主题
const getSystemTheme = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// 检测屏幕尺寸
const getScreenSize = (): UIState['screenSize'] => {
  if (typeof window === 'undefined') return 'lg';
  
  const width = window.innerWidth;
  if (width < 640) return 'xs';
  if (width < 768) return 'sm';
  if (width < 1024) return 'md';
  if (width < 1280) return 'lg';
  if (width < 1536) return 'xl';
  return '2xl';
};

// 检测设备类型
const getDeviceType = () => {
  if (typeof window === 'undefined') {
    return { isMobile: false, isTablet: false, isDesktop: true };
  }
  
  const width = window.innerWidth;
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;
  
  return { isMobile, isTablet, isDesktop };
};

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // 设置主题
      setTheme: (theme: 'light' | 'dark' | 'system') => {
        set({ theme });
        
        // 根据主题设置实际的暗色模式状态
        if (theme === 'system') {
          const systemIsDark = getSystemTheme();
          set({ isDark: systemIsDark });
        } else {
          set({ isDark: theme === 'dark' });
        }
      },

      // 切换主题
      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },

      // 更新系统主题
      updateSystemTheme: (isDark: boolean) => {
        const { theme } = get();
        if (theme === 'system') {
          set({ isDark });
        }
      },

      // 切换侧边栏
      toggleSidebar: () => {
        set(state => ({ sidebarOpen: !state.sidebarOpen }));
      },

      // 设置侧边栏开启状态
      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open });
      },

      // 切换侧边栏折叠
      toggleSidebarCollapse: () => {
        set(state => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      // 设置侧边栏折叠状态
      setSidebarCollapsed: (collapsed: boolean) => {
        set({ sidebarCollapsed: collapsed });
      },

      // 设置头部可见性
      setHeaderVisible: (visible: boolean) => {
        set({ headerVisible: visible });
      },

      // 设置底部可见性
      setFooterVisible: (visible: boolean) => {
        set({ footerVisible: visible });
      },

      // 打开模态框
      openModal: (key: string, data?: any, options?: any) => {
        set(state => ({
          modals: {
            ...state.modals,
            [key]: { isOpen: true, data, options },
          },
        }));
      },

      // 关闭模态框
      closeModal: (key: string) => {
        set(state => ({
          modals: {
            ...state.modals,
            [key]: { ...state.modals[key], isOpen: false },
          },
        }));
      },

      // 关闭所有模态框
      closeAllModals: () => {
        set(state => {
          const modals = { ...state.modals };
          Object.keys(modals).forEach(key => {
            modals[key] = { ...modals[key], isOpen: false };
          });
          return { modals };
        });
      },

      // 打开抽屉
      openDrawer: (key: string, data?: any, position = 'right') => {
        set(state => ({
          drawers: {
            ...state.drawers,
            [key]: { isOpen: true, data, position },
          },
        }));
      },

      // 关闭抽屉
      closeDrawer: (key: string) => {
        set(state => ({
          drawers: {
            ...state.drawers,
            [key]: { ...state.drawers[key], isOpen: false },
          },
        }));
      },

      // 关闭所有抽屉
      closeAllDrawers: () => {
        set(state => {
          const drawers = { ...state.drawers };
          Object.keys(drawers).forEach(key => {
            drawers[key] = { ...drawers[key], isOpen: false };
          });
          return { drawers };
        });
      },

      // 添加通知
      addToast: (toast: Omit<UIState['toasts'][0], 'id' | 'timestamp'>) => {
        const id = `toast-${Date.now()}-${Math.random()}`;
        const newToast = {
          ...toast,
          id,
          timestamp: new Date(),
          duration: toast.duration ?? 5000, // 默认5秒
        };

        set(state => ({
          toasts: [...state.toasts, newToast],
        }));

        // 自动移除
        if (newToast.duration > 0) {
          setTimeout(() => {
            get().removeToast(id);
          }, newToast.duration);
        }

        return id;
      },

      // 移除通知
      removeToast: (id: string) => {
        set(state => ({
          toasts: state.toasts.filter(toast => toast.id !== id),
        }));
      },

      // 清空所有通知
      clearToasts: () => {
        set({ toasts: [] });
      },

      // 设置全局加载状态
      setGlobalLoading: (loading: boolean, text = '') => {
        set({ globalLoading: loading, loadingText: text });
      },

      // 设置特定加载状态
      setLoadingState: (key: string, loading: boolean) => {
        set(state => ({
          loadingStates: {
            ...state.loadingStates,
            [key]: loading,
          },
        }));
      },

      // 清空所有加载状态
      clearLoadingStates: () => {
        set({ loadingStates: {} });
      },

      // 设置当前页面
      setCurrentPage: (page: string) => {
        set({ currentPage: page });
      },

      // 设置页面标题
      setPageTitle: (title: string) => {
        set({ pageTitle: title });
        if (typeof document !== 'undefined') {
          document.title = `${title} - LaunchX智链平台`;
        }
      },

      // 设置面包屑
      setBreadcrumbs: (breadcrumbs: UIState['breadcrumbs']) => {
        set({ breadcrumbs });
      },

      // 添加面包屑
      addBreadcrumb: (breadcrumb: UIState['breadcrumbs'][0]) => {
        set(state => ({
          breadcrumbs: [...state.breadcrumbs, breadcrumb],
        }));
      },

      // 切换快速搜索
      toggleQuickSearch: () => {
        set(state => ({ quickSearchOpen: !state.quickSearchOpen }));
      },

      // 切换命令面板
      toggleCommandPalette: () => {
        set(state => ({ commandPaletteOpen: !state.commandPaletteOpen }));
      },

      // 切换移动菜单
      toggleMobileMenu: () => {
        set(state => ({ mobileMenuOpen: !state.mobileMenuOpen }));
      },

      // 关闭所有覆盖层
      closeAllOverlays: () => {
        set({
          quickSearchOpen: false,
          commandPaletteOpen: false,
          mobileMenuOpen: false,
        });
        get().closeAllModals();
        get().closeAllDrawers();
      },

      // 更新偏好设置
      updatePreferences: (preferences: Partial<UIState['preferences']>) => {
        set(state => ({
          preferences: {
            ...state.preferences,
            ...preferences,
          },
        }));
      },

      // 设置语言
      setLanguage: (language: string) => {
        get().updatePreferences({ language });
      },

      // 设置时区
      setTimezone: (timezone: string) => {
        get().updatePreferences({ timezone });
      },

      // 切换紧凑模式
      toggleCompactMode: () => {
        const { preferences } = get();
        get().updatePreferences({ compactMode: !preferences.compactMode });
      },

      // 切换动画
      toggleAnimations: () => {
        const { preferences } = get();
        get().updatePreferences({ animations: !preferences.animations });
      },

      // 更新屏幕尺寸
      updateScreenSize: (size: UIState['screenSize']) => {
        set({ screenSize: size });
      },

      // 更新设备类型
      updateDeviceType: (isMobile: boolean, isTablet: boolean, isDesktop: boolean) => {
        set({ isMobile, isTablet, isDesktop });
      },

      // 设置性能模式
      setPerformanceMode: (mode: 'auto' | 'performance' | 'quality') => {
        set({ performanceMode: mode });
      },

      // 设置减少动画
      setReducedMotion: (reduced: boolean) => {
        set({ reducedMotion: reduced });
      },

      // 设置错误
      setError: (message: string, details?: any) => {
        set({
          error: {
            hasError: true,
            message,
            details,
          },
        });
      },

      // 清除错误
      clearError: () => {
        set({
          error: {
            hasError: false,
            message: null,
            details: undefined,
          },
        });
      },

      // 重置状态
      reset: () => {
        set({ ...initialState });
      },
    }),
    {
      name: 'ui-store',
      storage: createJSONStorage(() => localStorage),
      // 只持久化需要的状态
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        preferences: state.preferences,
        performanceMode: state.performanceMode,
      }),
      // 恢复后初始化
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== 'undefined') {
          // 初始化响应式状态
          const deviceType = getDeviceType();
          const screenSize = getScreenSize();
          
          state.isMobile = deviceType.isMobile;
          state.isTablet = deviceType.isTablet;
          state.isDesktop = deviceType.isDesktop;
          state.screenSize = screenSize;

          // 初始化主题
          if (state.theme === 'system') {
            state.isDark = getSystemTheme();
          } else {
            state.isDark = state.theme === 'dark';
          }

          // 监听系统主题变化
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          mediaQuery.addEventListener('change', (e) => {
            state.updateSystemTheme?.(e.matches);
          });

          // 监听窗口大小变化
          const handleResize = () => {
            const newDeviceType = getDeviceType();
            const newScreenSize = getScreenSize();
            
            state.updateDeviceType?.(
              newDeviceType.isMobile,
              newDeviceType.isTablet,
              newDeviceType.isDesktop
            );
            state.updateScreenSize?.(newScreenSize);
          };

          window.addEventListener('resize', handleResize);

          // 监听减少动画偏好
          const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
          state.reducedMotion = motionQuery.matches;
          motionQuery.addEventListener('change', (e) => {
            state.setReducedMotion?.(e.matches);
          });
        }
      },
    }
  )
);

// 选择器函数
export const selectTheme = (state: UIStore) => state.theme;
export const selectIsDark = (state: UIStore) => state.isDark;
export const selectSidebarOpen = (state: UIStore) => state.sidebarOpen;
export const selectSidebarCollapsed = (state: UIStore) => state.sidebarCollapsed;
export const selectModals = (state: UIStore) => state.modals;
export const selectDrawers = (state: UIStore) => state.drawers;
export const selectToasts = (state: UIStore) => state.toasts;
export const selectGlobalLoading = (state: UIStore) => state.globalLoading;
export const selectLoadingStates = (state: UIStore) => state.loadingStates;
export const selectCurrentPage = (state: UIStore) => state.currentPage;
export const selectPageTitle = (state: UIStore) => state.pageTitle;
export const selectBreadcrumbs = (state: UIStore) => state.breadcrumbs;
export const selectPreferences = (state: UIStore) => state.preferences;
export const selectIsMobile = (state: UIStore) => state.isMobile;
export const selectIsTablet = (state: UIStore) => state.isTablet;
export const selectIsDesktop = (state: UIStore) => state.isDesktop;
export const selectScreenSize = (state: UIStore) => state.screenSize;
export const selectError = (state: UIStore) => state.error;

export type { UIStore, UIState, UIActions };