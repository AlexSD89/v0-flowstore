/**
 * LaunchX 智链平台 v3 - 综合应用状态管理
 * 
 * 基于 Zustand 的状态管理系统，提供：
 * 1. 用户状态管理 (User State Management)
 * 2. 多角色切换 (Multi-Role Switching) 
 * 3. 推荐系统状态 (Recommendation State)
 * 4. 导航状态管理 (Navigation State)
 * 5. 实时数据同步 (Real-time Sync)
 */

import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import type { 
  User, 
  UserRole, 
  ProductData, 
  ChatSession,
  CollaborationSession,
  SearchFilters,
  Notification,
  DistributionLink,
  ProductRecommendation,
  UserPreferences
} from '@/types';

// ==================== 状态类型定义 ====================

/** 应用主题 */
export type AppTheme = 'light' | 'dark' | 'system';

/** 侧边栏状态 */
export interface SidebarState {
  isOpen: boolean;
  isPinned: boolean;
  activeSection: string | null;
}

/** 模态框状态 */
export interface ModalState {
  [modalId: string]: {
    isOpen: boolean;
    props?: any;
    onClose?: () => void;
  };
}

/** 加载状态 */
export interface LoadingState {
  global: boolean;
  [key: string]: boolean;
}

/** 错误状态 */
export interface ErrorState {
  global: string | null;
  [key: string]: string | null;
}

/** 用户会话状态 */
export interface SessionState {
  sessionId: string;
  startTime: Date;
  lastActivity: Date;
  pageViews: number;
  interactionCount: number;
  timeSpent: number;
}

/** 搜索状态 */
export interface SearchState {
  query: string;
  filters: SearchFilters;
  results: ProductData[];
  suggestions: string[];
  recentSearches: string[];
  isSearching: boolean;
}

/** 购物车状态 */
export interface CartState {
  items: Array<{
    productId: string;
    product: ProductData;
    quantity: number;
    addedAt: Date;
    customization?: any;
  }>;
  total: number;
  currency: string;
}

/** 收藏状态 */
export interface FavoritesState {
  products: string[];
  vendors: string[];
  reports: string[];
  lastUpdated: Date;
}

/** 推荐状态 */
export interface RecommendationState {
  current: ProductRecommendation[];
  history: Array<{
    timestamp: Date;
    query: string;
    recommendations: ProductRecommendation[];
  }>;
  preferences: UserPreferences | null;
  lastUpdated: Date;
  isLoading: boolean;
}

/** 协作状态 */
export interface CollaborationState {
  activeSessions: CollaborationSession[];
  currentSession: CollaborationSession | null;
  history: CollaborationSession[];
  agentStatus: Record<string, 'idle' | 'active' | 'thinking' | 'error'>;
}

/** 通知状态 */
export interface NotificationState {
  items: Notification[];
  unreadCount: number;
  settings: {
    enabled: boolean;
    types: string[];
    frequency: 'realtime' | 'batched' | 'daily';
  };
}

/** 分析数据状态 */
export interface AnalyticsState {
  userBehavior: {
    pageViews: Record<string, number>;
    timeSpent: Record<string, number>;
    clickPatterns: any[];
    conversionEvents: any[];
  };
  businessMetrics: {
    orders: number;
    revenue: number;
    conversions: number;
    retention: number;
  };
  lastSynced: Date;
}

// ==================== 综合应用状态接口 ====================

export interface AppState {
  // 用户相关状态
  user: User | null;
  currentRole: UserRole;
  availableRoles: UserRole[];
  isAuthenticated: boolean;
  sessionState: SessionState;
  
  // UI状态
  theme: AppTheme;
  sidebar: SidebarState;
  modals: ModalState;
  loading: LoadingState;
  errors: ErrorState;
  
  // 业务状态
  search: SearchState;
  cart: CartState;
  favorites: FavoritesState;
  recommendations: RecommendationState;
  collaboration: CollaborationState;
  
  // 通知和分析
  notifications: NotificationState;
  analytics: AnalyticsState;
  
  // 应用元数据
  appVersion: string;
  lastSync: Date;
  isOnline: boolean;
}

export interface AppActions {
  // ==================== 用户管理 ====================
  
  /** 设置用户信息 */
  setUser: (user: User | null) => void;
  
  /** 切换用户角色 */
  switchRole: (role: UserRole, context?: string) => Promise<void>;
  
  /** 用户登录 */
  login: (credentials: { email: string; password: string }) => Promise<void>;
  
  /** 用户登出 */
  logout: () => void;
  
  /** 更新用户偏好 */
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  
  /** 更新会话活动 */
  updateSessionActivity: () => void;
  
  // ==================== UI状态管理 ====================
  
  /** 切换主题 */
  toggleTheme: () => void;
  
  /** 设置主题 */
  setTheme: (theme: AppTheme) => void;
  
  /** 切换侧边栏 */
  toggleSidebar: () => void;
  
  /** 设置侧边栏状态 */
  setSidebarState: (state: Partial<SidebarState>) => void;
  
  /** 打开模态框 */
  openModal: (modalId: string, props?: any, onClose?: () => void) => void;
  
  /** 关闭模态框 */
  closeModal: (modalId: string) => void;
  
  /** 设置加载状态 */
  setLoading: (key: string, loading: boolean) => void;
  
  /** 设置错误状态 */
  setError: (key: string, error: string | null) => void;
  
  // ==================== 搜索管理 ====================
  
  /** 执行搜索 */
  performSearch: (query: string, filters?: Partial<SearchFilters>) => Promise<void>;
  
  /** 更新搜索过滤器 */
  updateSearchFilters: (filters: Partial<SearchFilters>) => void;
  
  /** 清除搜索结果 */
  clearSearch: () => void;
  
  /** 添加搜索历史 */
  addSearchHistory: (query: string) => void;
  
  // ==================== 购物车管理 ====================
  
  /** 添加到购物车 */
  addToCart: (product: ProductData, quantity?: number, customization?: any) => void;
  
  /** 从购物车移除 */
  removeFromCart: (productId: string) => void;
  
  /** 更新购物车数量 */
  updateCartQuantity: (productId: string, quantity: number) => void;
  
  /** 清空购物车 */
  clearCart: () => void;
  
  /** 计算购物车总价 */
  calculateCartTotal: () => void;
  
  // ==================== 收藏管理 ====================
  
  /** 切换产品收藏 */
  toggleProductFavorite: (productId: string) => void;
  
  /** 切换供应商收藏 */
  toggleVendorFavorite: (vendorId: string) => void;
  
  /** 批量管理收藏 */
  manageFavorites: (type: 'products' | 'vendors' | 'reports', ids: string[], action: 'add' | 'remove') => void;
  
  // ==================== 推荐系统 ====================
  
  /** 获取推荐 */
  fetchRecommendations: (context?: any) => Promise<void>;
  
  /** 更新推荐偏好 */
  updateRecommendationPreferences: (preferences: Partial<UserPreferences>) => void;
  
  /** 记录推荐交互 */
  recordRecommendationInteraction: (productId: string, action: string) => void;
  
  /** 刷新推荐 */
  refreshRecommendations: () => Promise<void>;
  
  // ==================== 协作管理 ====================
  
  /** 开始协作会话 */
  startCollaboration: (query: string, context?: any) => Promise<string>;
  
  /** 结束协作会话 */
  endCollaboration: (sessionId: string) => void;
  
  /** 更新协作状态 */
  updateCollaborationStatus: (sessionId: string, status: any) => void;
  
  /** 发送协作消息 */
  sendCollaborationMessage: (sessionId: string, message: string) => void;
  
  // ==================== 通知管理 ====================
  
  /** 添加通知 */
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  
  /** 标记通知已读 */
  markNotificationRead: (notificationId: string) => void;
  
  /** 清除所有通知 */
  clearNotifications: () => void;
  
  /** 更新通知设置 */
  updateNotificationSettings: (settings: Partial<NotificationState['settings']>) => void;
  
  // ==================== 数据同步 ====================
  
  /** 同步用户数据 */
  syncUserData: () => Promise<void>;
  
  /** 同步业务数据 */
  syncBusinessData: () => Promise<void>;
  
  /** 备份状态到服务器 */
  backupState: () => Promise<void>;
  
  /** 从服务器恢复状态 */
  restoreState: () => Promise<void>;
  
  // ==================== 分析和监控 ====================
  
  /** 记录页面访问 */
  trackPageView: (path: string, metadata?: any) => void;
  
  /** 记录用户交互 */
  trackInteraction: (event: string, data?: any) => void;
  
  /** 记录转化事件 */
  trackConversion: (event: string, value?: number) => void;
  
  /** 获取分析数据 */
  getAnalytics: (timeRange?: string) => any;
}

// ==================== Store 实现 ====================

export const useAppStore = create<AppState & AppActions>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // ==================== 初始状态 ====================
        
        // 用户状态
        user: null,
        currentRole: 'guest',
        availableRoles: ['guest'],
        isAuthenticated: false,
        sessionState: {
          sessionId: generateSessionId(),
          startTime: new Date(),
          lastActivity: new Date(),
          pageViews: 0,
          interactionCount: 0,
          timeSpent: 0
        },
        
        // UI状态
        theme: 'system',
        sidebar: {
          isOpen: false,
          isPinned: false,
          activeSection: null
        },
        modals: {},
        loading: {
          global: false
        },
        errors: {
          global: null
        },
        
        // 业务状态
        search: {
          query: '',
          filters: {
            query: '',
            types: [],
            categories: [],
            pricingModels: [],
            priceRange: [0, 10000],
            rating: 0,
            verified: false,
            trending: false,
            featured: false,
            tags: [],
            responseTime: 10000,
            successRate: 0,
            sortBy: 'relevance',
            sortOrder: 'desc'
          },
          results: [],
          suggestions: [],
          recentSearches: [],
          isSearching: false
        },
        cart: {
          items: [],
          total: 0,
          currency: 'CNY'
        },
        favorites: {
          products: [],
          vendors: [],
          reports: [],
          lastUpdated: new Date()
        },
        recommendations: {
          current: [],
          history: [],
          preferences: null,
          lastUpdated: new Date(),
          isLoading: false
        },
        collaboration: {
          activeSessions: [],
          currentSession: null,
          history: [],
          agentStatus: {}
        },
        
        // 通知和分析
        notifications: {
          items: [],
          unreadCount: 0,
          settings: {
            enabled: true,
            types: ['system', 'recommendations', 'orders'],
            frequency: 'realtime'
          }
        },
        analytics: {
          userBehavior: {
            pageViews: {},
            timeSpent: {},
            clickPatterns: [],
            conversionEvents: []
          },
          businessMetrics: {
            orders: 0,
            revenue: 0,
            conversions: 0,
            retention: 0
          },
          lastSynced: new Date()
        },
        
        // 应用元数据
        appVersion: '3.0.0',
        lastSync: new Date(),
        isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,

        // ==================== 用户管理方法 ====================
        
        setUser: (user) => {
          set({ 
            user,
            isAuthenticated: !!user,
            availableRoles: user?.availableRoles || ['guest'],
            currentRole: user?.role || 'guest'
          });
          
          if (user) {
            get().trackInteraction('user_login', { userId: user.id, role: user.role });
          }
        },

        switchRole: async (role, context) => {
          const { user } = get();
          if (!user || !user.availableRoles.includes(role)) {
            throw new Error('无权限切换到该角色');
          }

          set({ currentRole: role });
          
          // 记录角色切换
          get().trackInteraction('role_switch', { 
            from: get().currentRole, 
            to: role, 
            context 
          });
          
          // 刷新相关数据
          await get().fetchRecommendations();
          await get().syncUserData();
        },

        login: async (credentials) => {
          set({ loading: { ...get().loading, global: true } });
          
          try {
            // 模拟登录API调用
            const response = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(credentials)
            });
            
            if (!response.ok) {
              throw new Error('登录失败');
            }
            
            const userData = await response.json();
            get().setUser(userData);
            
            // 初始化用户数据
            await get().syncUserData();
            
          } catch (error) {
            get().setError('login', (error as Error).message);
            throw error;
          } finally {
            set({ loading: { ...get().loading, global: false } });
          }
        },

        logout: () => {
          get().trackInteraction('user_logout');
          
          set({
            user: null,
            currentRole: 'guest',
            availableRoles: ['guest'],
            isAuthenticated: false,
            cart: { items: [], total: 0, currency: 'CNY' },
            favorites: { products: [], vendors: [], reports: [], lastUpdated: new Date() },
            collaboration: { activeSessions: [], currentSession: null, history: [], agentStatus: {} }
          });
        },

        updateUserPreferences: (preferences) => {
          const { user } = get();
          if (!user) return;
          
          const updatedUser = {
            ...user,
            preferences: { ...user.preferences, ...preferences }
          };
          
          set({ user: updatedUser });
          get().trackInteraction('preferences_updated', preferences);
        },

        updateSessionActivity: () => {
          const now = new Date();
          set({
            sessionState: {
              ...get().sessionState,
              lastActivity: now,
              interactionCount: get().sessionState.interactionCount + 1
            }
          });
        },

        // ==================== UI状态管理方法 ====================
        
        toggleTheme: () => {
          const themes: AppTheme[] = ['light', 'dark', 'system'];
          const currentIndex = themes.indexOf(get().theme);
          const nextTheme = themes[(currentIndex + 1) % themes.length];
          set({ theme: nextTheme });
        },

        setTheme: (theme) => {
          set({ theme });
        },

        toggleSidebar: () => {
          set({
            sidebar: {
              ...get().sidebar,
              isOpen: !get().sidebar.isOpen
            }
          });
        },

        setSidebarState: (state) => {
          set({
            sidebar: { ...get().sidebar, ...state }
          });
        },

        openModal: (modalId, props, onClose) => {
          set({
            modals: {
              ...get().modals,
              [modalId]: { isOpen: true, props, onClose }
            }
          });
        },

        closeModal: (modalId) => {
          const { modals } = get();
          const modal = modals[modalId];
          if (modal?.onClose) {
            modal.onClose();
          }
          
          const newModals = { ...modals };
          delete newModals[modalId];
          set({ modals: newModals });
        },

        setLoading: (key, loading) => {
          set({
            loading: { ...get().loading, [key]: loading }
          });
        },

        setError: (key, error) => {
          set({
            errors: { ...get().errors, [key]: error }
          });
        },

        // ==================== 搜索管理方法 ====================
        
        performSearch: async (query, filters = {}) => {
          const currentFilters = get().search.filters;
          const newFilters = { ...currentFilters, ...filters, query };
          
          set({
            search: {
              ...get().search,
              query,
              filters: newFilters,
              isSearching: true
            }
          });

          try {
            const response = await fetch('/api/products/search', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ query, filters: newFilters })
            });

            const results = await response.json();
            
            set({
              search: {
                ...get().search,
                results: results.data || [],
                isSearching: false
              }
            });

            get().addSearchHistory(query);
            get().trackInteraction('search', { query, resultsCount: results.data?.length || 0 });

          } catch (error) {
            get().setError('search', '搜索失败');
            set({
              search: { ...get().search, isSearching: false }
            });
          }
        },

        updateSearchFilters: (filters) => {
          set({
            search: {
              ...get().search,
              filters: { ...get().search.filters, ...filters }
            }
          });
        },

        clearSearch: () => {
          set({
            search: {
              ...get().search,
              query: '',
              results: [],
              isSearching: false
            }
          });
        },

        addSearchHistory: (query) => {
          const { recentSearches } = get().search;
          const newHistory = [query, ...recentSearches.filter(q => q !== query)].slice(0, 10);
          
          set({
            search: { ...get().search, recentSearches: newHistory }
          });
        },

        // ==================== 购物车管理方法 ====================
        
        addToCart: (product, quantity = 1, customization) => {
          const { cart } = get();
          const existingItem = cart.items.find(item => item.productId === product.id);
          
          if (existingItem) {
            get().updateCartQuantity(product.id, existingItem.quantity + quantity);
          } else {
            const newItem = {
              productId: product.id,
              product,
              quantity,
              addedAt: new Date(),
              customization
            };
            
            set({
              cart: {
                ...cart,
                items: [...cart.items, newItem]
              }
            });
          }
          
          get().calculateCartTotal();
          get().trackInteraction('cart_add', { productId: product.id, quantity });
        },

        removeFromCart: (productId) => {
          const { cart } = get();
          set({
            cart: {
              ...cart,
              items: cart.items.filter(item => item.productId !== productId)
            }
          });
          
          get().calculateCartTotal();
          get().trackInteraction('cart_remove', { productId });
        },

        updateCartQuantity: (productId, quantity) => {
          const { cart } = get();
          
          if (quantity <= 0) {
            get().removeFromCart(productId);
            return;
          }
          
          set({
            cart: {
              ...cart,
              items: cart.items.map(item =>
                item.productId === productId ? { ...item, quantity } : item
              )
            }
          });
          
          get().calculateCartTotal();
        },

        clearCart: () => {
          set({
            cart: { items: [], total: 0, currency: 'CNY' }
          });
          
          get().trackInteraction('cart_clear');
        },

        calculateCartTotal: () => {
          const { cart } = get();
          const total = cart.items.reduce((sum, item) => {
            return sum + (item.product.pricing.basePrice * item.quantity);
          }, 0);
          
          set({
            cart: { ...cart, total }
          });
        },

        // ==================== 收藏管理方法 ====================
        
        toggleProductFavorite: (productId) => {
          const { favorites } = get();
          const isCurrentlyFavorited = favorites.products.includes(productId);
          
          const newProducts = isCurrentlyFavorited
            ? favorites.products.filter(id => id !== productId)
            : [...favorites.products, productId];
          
          set({
            favorites: {
              ...favorites,
              products: newProducts,
              lastUpdated: new Date()
            }
          });
          
          get().trackInteraction('favorite_toggle', { 
            productId, 
            action: isCurrentlyFavorited ? 'remove' : 'add' 
          });
        },

        toggleVendorFavorite: (vendorId) => {
          const { favorites } = get();
          const isCurrentlyFavorited = favorites.vendors.includes(vendorId);
          
          const newVendors = isCurrentlyFavorited
            ? favorites.vendors.filter(id => id !== vendorId)
            : [...favorites.vendors, vendorId];
          
          set({
            favorites: {
              ...favorites,
              vendors: newVendors,
              lastUpdated: new Date()
            }
          });
        },

        manageFavorites: (type, ids, action) => {
          const { favorites } = get();
          const currentItems = favorites[type];
          
          const newItems = action === 'add'
            ? [...new Set([...currentItems, ...ids])]
            : currentItems.filter(id => !ids.includes(id));
          
          set({
            favorites: {
              ...favorites,
              [type]: newItems,
              lastUpdated: new Date()
            }
          });
        },

        // ==================== 推荐系统方法 ====================
        
        fetchRecommendations: async (context) => {
          set({
            recommendations: { ...get().recommendations, isLoading: true }
          });

          try {
            // 这里调用智能推荐服务
            const response = await fetch('/api/recommendations', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: get().user?.id,
                userProfile: get().user,
                context: {
                  currentRole: get().currentRole,
                  sessionContext: get().sessionState,
                  ...context
                }
              })
            });

            const data = await response.json();
            
            set({
              recommendations: {
                ...get().recommendations,
                current: data.recommendations || [],
                lastUpdated: new Date(),
                isLoading: false
              }
            });

          } catch (error) {
            get().setError('recommendations', '获取推荐失败');
            set({
              recommendations: { ...get().recommendations, isLoading: false }
            });
          }
        },

        updateRecommendationPreferences: (preferences) => {
          set({
            recommendations: {
              ...get().recommendations,
              preferences: { ...get().recommendations.preferences, ...preferences }
            }
          });
          
          // 触发推荐刷新
          get().fetchRecommendations();
        },

        recordRecommendationInteraction: (productId, action) => {
          get().trackInteraction('recommendation_interaction', { productId, action });
          
          // 这里可以调用推荐系统的反馈API
          fetch('/api/recommendations/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: get().user?.id,
              productId,
              action,
              timestamp: new Date()
            })
          }).catch(console.error);
        },

        refreshRecommendations: async () => {
          await get().fetchRecommendations({ refresh: true });
        },

        // ==================== 协作管理方法 ====================
        
        startCollaboration: async (query, context) => {
          try {
            const response = await fetch('/api/collaboration/start', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userQuery: query,
                userId: get().user?.id,
                context: {
                  currentRole: get().currentRole,
                  ...context
                }
              })
            });

            const data = await response.json();
            const sessionId = data.sessionId;
            
            set({
              collaboration: {
                ...get().collaboration,
                currentSession: data.session,
                activeSessions: [...get().collaboration.activeSessions, data.session]
              }
            });

            get().trackInteraction('collaboration_start', { sessionId, query });
            return sessionId;

          } catch (error) {
            get().setError('collaboration', '启动协作失败');
            throw error;
          }
        },

        endCollaboration: (sessionId) => {
          const { collaboration } = get();
          
          set({
            collaboration: {
              ...collaboration,
              activeSessions: collaboration.activeSessions.filter(s => s.id !== sessionId),
              currentSession: collaboration.currentSession?.id === sessionId ? null : collaboration.currentSession
            }
          });
          
          get().trackInteraction('collaboration_end', { sessionId });
        },

        updateCollaborationStatus: (sessionId, status) => {
          const { collaboration } = get();
          
          set({
            collaboration: {
              ...collaboration,
              activeSessions: collaboration.activeSessions.map(session =>
                session.id === sessionId ? { ...session, ...status } : session
              )
            }
          });
        },

        sendCollaborationMessage: (sessionId, message) => {
          // 发送消息到协作服务
          fetch(`/api/collaboration/${sessionId}/message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, userId: get().user?.id })
          }).catch(console.error);
          
          get().trackInteraction('collaboration_message', { sessionId, messageLength: message.length });
        },

        // ==================== 通知管理方法 ====================
        
        addNotification: (notification) => {
          const newNotification: Notification = {
            ...notification,
            id: generateId(),
            timestamp: new Date(),
            read: false
          };
          
          set({
            notifications: {
              ...get().notifications,
              items: [newNotification, ...get().notifications.items].slice(0, 50), // 保留最新50条
              unreadCount: get().notifications.unreadCount + 1
            }
          });
        },

        markNotificationRead: (notificationId) => {
          const { notifications } = get();
          const notification = notifications.items.find(n => n.id === notificationId);
          
          if (notification && !notification.read) {
            set({
              notifications: {
                ...notifications,
                items: notifications.items.map(n =>
                  n.id === notificationId ? { ...n, read: true } : n
                ),
                unreadCount: Math.max(0, notifications.unreadCount - 1)
              }
            });
          }
        },

        clearNotifications: () => {
          set({
            notifications: {
              ...get().notifications,
              items: [],
              unreadCount: 0
            }
          });
        },

        updateNotificationSettings: (settings) => {
          set({
            notifications: {
              ...get().notifications,
              settings: { ...get().notifications.settings, ...settings }
            }
          });
        },

        // ==================== 数据同步方法 ====================
        
        syncUserData: async () => {
          if (!get().user) return;
          
          try {
            const response = await fetch('/api/user/sync', {
              method: 'GET',
              headers: { 'Authorization': `Bearer ${get().user.id}` }
            });
            
            const data = await response.json();
            
            // 更新用户相关数据
            if (data.favorites) {
              set({ favorites: { ...data.favorites, lastUpdated: new Date() } });
            }
            
            if (data.preferences) {
              get().updateUserPreferences(data.preferences);
            }
            
            set({ lastSync: new Date() });
            
          } catch (error) {
            console.error('User data sync failed:', error);
          }
        },

        syncBusinessData: async () => {
          // 同步业务数据的实现
          console.log('Syncing business data...');
        },

        backupState: async () => {
          if (!get().user) return;
          
          const stateToBackup = {
            favorites: get().favorites,
            cart: get().cart,
            preferences: get().recommendations.preferences,
            settings: {
              theme: get().theme,
              notifications: get().notifications.settings
            }
          };
          
          try {
            await fetch('/api/user/backup', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${get().user.id}`
              },
              body: JSON.stringify(stateToBackup)
            });
          } catch (error) {
            console.error('State backup failed:', error);
          }
        },

        restoreState: async () => {
          if (!get().user) return;
          
          try {
            const response = await fetch('/api/user/restore', {
              method: 'GET',
              headers: { 'Authorization': `Bearer ${get().user.id}` }
            });
            
            const data = await response.json();
            
            // 恢复状态
            if (data.favorites) set({ favorites: data.favorites });
            if (data.cart) set({ cart: data.cart });
            if (data.settings) {
              if (data.settings.theme) set({ theme: data.settings.theme });
              if (data.settings.notifications) {
                set({
                  notifications: {
                    ...get().notifications,
                    settings: data.settings.notifications
                  }
                });
              }
            }
            
          } catch (error) {
            console.error('State restore failed:', error);
          }
        },

        // ==================== 分析和监控方法 ====================
        
        trackPageView: (path, metadata) => {
          const { analytics } = get();
          const pageViews = { ...analytics.userBehavior.pageViews };
          pageViews[path] = (pageViews[path] || 0) + 1;
          
          set({
            analytics: {
              ...analytics,
              userBehavior: {
                ...analytics.userBehavior,
                pageViews
              }
            },
            sessionState: {
              ...get().sessionState,
              pageViews: get().sessionState.pageViews + 1
            }
          });
          
          // 发送分析数据到服务器
          fetch('/api/analytics/pageview', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              path,
              metadata,
              userId: get().user?.id,
              sessionId: get().sessionState.sessionId,
              timestamp: new Date()
            })
          }).catch(console.error);
        },

        trackInteraction: (event, data) => {
          const { analytics } = get();
          
          set({
            analytics: {
              ...analytics,
              userBehavior: {
                ...analytics.userBehavior,
                clickPatterns: [
                  ...analytics.userBehavior.clickPatterns,
                  { event, data, timestamp: new Date() }
                ].slice(-100) // 保留最新100个交互
              }
            }
          });
          
          get().updateSessionActivity();
          
          // 发送交互数据到服务器
          fetch('/api/analytics/interaction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event,
              data,
              userId: get().user?.id,
              sessionId: get().sessionState.sessionId,
              timestamp: new Date()
            })
          }).catch(console.error);
        },

        trackConversion: (event, value) => {
          const { analytics } = get();
          
          set({
            analytics: {
              ...analytics,
              userBehavior: {
                ...analytics.userBehavior,
                conversionEvents: [
                  ...analytics.userBehavior.conversionEvents,
                  { event, value, timestamp: new Date() }
                ]
              },
              businessMetrics: {
                ...analytics.businessMetrics,
                conversions: analytics.businessMetrics.conversions + 1
              }
            }
          });
          
          // 发送转化数据到服务器
          fetch('/api/analytics/conversion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event,
              value,
              userId: get().user?.id,
              sessionId: get().sessionState.sessionId,
              timestamp: new Date()
            })
          }).catch(console.error);
        },

        getAnalytics: (timeRange = '7d') => {
          const { analytics } = get();
          
          // 这里可以实现更复杂的分析逻辑
          return {
            summary: {
              totalPageViews: Object.values(analytics.userBehavior.pageViews).reduce((a, b) => a + b, 0),
              totalInteractions: analytics.userBehavior.clickPatterns.length,
              totalConversions: analytics.userBehavior.conversionEvents.length,
              sessionDuration: get().sessionState.timeSpent
            },
            details: analytics
          };
        }
      }),
      {
        name: 'zhilink-app-state',
        partialize: (state) => ({
          // 只持久化必要的状态
          user: state.user,
          currentRole: state.currentRole,
          theme: state.theme,
          favorites: state.favorites,
          cart: state.cart,
          search: {
            recentSearches: state.search.recentSearches,
            filters: state.search.filters
          },
          notifications: {
            settings: state.notifications.settings
          },
          recommendations: {
            preferences: state.recommendations.preferences
          }
        })
      }
    )
  )
);

// ==================== 工具函数 ====================

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ==================== 导出 ====================

export default useAppStore;

// 便捷的状态选择器
export const useUser = () => useAppStore((state) => state.user);
export const useCurrentRole = () => useAppStore((state) => state.currentRole);
export const useTheme = () => useAppStore((state) => state.theme);
export const useCart = () => useAppStore((state) => state.cart);
export const useFavorites = () => useAppStore((state) => state.favorites);
export const useNotifications = () => useAppStore((state) => state.notifications);
export const useRecommendations = () => useAppStore((state) => state.recommendations);
export const useSearch = () => useAppStore((state) => state.search);
export const useCollaboration = () => useAppStore((state) => state.collaboration);