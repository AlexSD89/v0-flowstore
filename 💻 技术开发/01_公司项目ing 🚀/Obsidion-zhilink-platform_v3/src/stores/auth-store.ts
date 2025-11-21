/**
 * 用户认证状态管理
 * 
 * 管理用户登录状态、角色切换、权限控制等
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, UserRole, Notification, RoleSwitchHistory } from '@/types';

interface AuthState {
  // 基础状态
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // 角色管理
  currentRole: UserRole;
  availableRoles: UserRole[];
  roleHistory: RoleSwitchHistory[];
  
  // 通知系统
  notifications: Notification[];
  unreadCount: number;
  
  // 会话管理
  sessionExpiry: Date | null;
  lastActivity: Date | null;
}

interface AuthActions {
  // 认证操作
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  
  // 角色管理
  switchRole: (role: UserRole, context?: string) => Promise<void>;
  addAvailableRole: (role: UserRole) => void;
  removeAvailableRole: (role: UserRole) => void;
  
  // 通知管理
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
  
  // 会话管理
  updateActivity: () => void;
  checkSession: () => boolean;
  
  // 错误处理
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // 重置状态
  reset: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  currentRole: 'guest',
  availableRoles: ['guest'],
  roleHistory: [],
  notifications: [],
  unreadCount: 0,
  sessionExpiry: null,
  lastActivity: null,
};

// 模拟API调用
const authAPI = {
  async login(email: string, password: string): Promise<User> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 模拟登录验证
    if (email === 'demo@example.com' && password === 'demo123') {
      return {
        id: 'user-1',
        name: '张先生',
        email: 'demo@example.com',
        avatar: '/images/avatar-demo.jpg',
        role: 'buyer',
        availableRoles: ['buyer', 'vendor', 'distributor'],
        verified: true,
        company: '创新科技有限公司',
        industry: '电商',
        memberSince: new Date('2023-06-15'),
        lastActive: new Date(),
        notifications: 3,
        cartItems: 2,
        favoriteItems: 8,
        stats: {
          purchases: 5,
          revenue: 50000,
          sales: 120,
          commission: 15000
        }
      };
    }
    
    throw new Error('用户名或密码错误');
  },

  async refreshToken(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // 模拟token刷新成功
  },

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 返回更新后的用户信息
    throw new Error('Profile update not implemented');
  },

  async switchRole(userId: string, newRole: UserRole): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // 模拟角色切换
  }
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // 登录操作
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const user = await authAPI.login(email, password);
          const now = new Date();
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            currentRole: user.role,
            availableRoles: user.availableRoles,
            sessionExpiry: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 24小时后过期
            lastActivity: now,
            // 添加欢迎通知
            notifications: [
              {
                id: `welcome-${Date.now()}`,
                type: 'success',
                title: '登录成功',
                message: `欢迎回来，${user.name}！`,
                timestamp: now,
                read: false,
              }
            ],
            unreadCount: 1,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : '登录失败',
          });
        }
      },

      // 登出操作
      logout: () => {
        set({
          ...initialState,
          notifications: [],
          unreadCount: 0,
        });
      },

      // 刷新Token
      refreshToken: async () => {
        try {
          await authAPI.refreshToken();
          const now = new Date();
          set({
            sessionExpiry: new Date(now.getTime() + 24 * 60 * 60 * 1000),
            lastActivity: now,
          });
        } catch (error) {
          // Token刷新失败，执行登出
          get().logout();
        }
      },

      // 更新用户资料
      updateProfile: async (updates: Partial<User>) => {
        const { user } = get();
        if (!user) return;

        set({ isLoading: true, error: null });

        try {
          const updatedUser = { ...user, ...updates };
          set({
            user: updatedUser,
            isLoading: false,
          });

          // 添加更新成功通知
          get().addNotification({
            type: 'success',
            title: '资料更新成功',
            message: '您的个人资料已成功更新。',
            timestamp: new Date(),
            read: false,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : '更新失败',
          });
        }
      },

      // 角色切换
      switchRole: async (role: UserRole, context?: string) => {
        const { user, currentRole, roleHistory } = get();
        if (!user || !user.availableRoles.includes(role) || currentRole === role) {
          return;
        }

        set({ isLoading: true });

        try {
          await authAPI.switchRole(user.id, role);
          
          const now = new Date();
          const historyEntry: RoleSwitchHistory = {
            id: `switch-${Date.now()}`,
            fromRole: currentRole,
            toRole: role,
            timestamp: now,
            context: context || '手动切换',
          };

          set({
            currentRole: role,
            user: { ...user, role },
            roleHistory: [historyEntry, ...roleHistory].slice(0, 50), // 保留最近50条记录
            isLoading: false,
            lastActivity: now,
          });

          // 添加角色切换通知
          get().addNotification({
            type: 'info',
            title: '角色切换成功',
            message: `已切换到${role === 'buyer' ? '采购方' : role === 'vendor' ? '供应商' : '分销商'}模式。`,
            timestamp: now,
            read: false,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : '角色切换失败',
          });
        }
      },

      // 添加可用角色
      addAvailableRole: (role: UserRole) => {
        const { user, availableRoles } = get();
        if (!user || availableRoles.includes(role)) return;

        set({
          availableRoles: [...availableRoles, role],
          user: {
            ...user,
            availableRoles: [...availableRoles, role],
          },
        });
      },

      // 移除可用角色
      removeAvailableRole: (role: UserRole) => {
        const { user, availableRoles, currentRole } = get();
        if (!user || !availableRoles.includes(role) || role === currentRole) return;

        const newRoles = availableRoles.filter(r => r !== role);
        set({
          availableRoles: newRoles,
          user: {
            ...user,
            availableRoles: newRoles,
          },
        });
      },

      // 添加通知
      addNotification: (notification: Omit<Notification, 'id'>) => {
        const { notifications, unreadCount } = get();
        const newNotification: Notification = {
          ...notification,
          id: `notif-${Date.now()}-${Math.random()}`,
        };

        set({
          notifications: [newNotification, ...notifications].slice(0, 100), // 保留最近100条
          unreadCount: notification.read ? unreadCount : unreadCount + 1,
        });
      },

      // 标记通知已读
      markNotificationRead: (id: string) => {
        const { notifications, unreadCount } = get();
        const updatedNotifications = notifications.map(notif =>
          notif.id === id ? { ...notif, read: true } : notif
        );

        const wasUnread = notifications.find(n => n.id === id && !n.read);
        
        set({
          notifications: updatedNotifications,
          unreadCount: wasUnread ? Math.max(0, unreadCount - 1) : unreadCount,
        });
      },

      // 清除通知
      clearNotification: (id: string) => {
        const { notifications, unreadCount } = get();
        const notificationToRemove = notifications.find(n => n.id === id);
        
        set({
          notifications: notifications.filter(n => n.id !== id),
          unreadCount: notificationToRemove && !notificationToRemove.read 
            ? Math.max(0, unreadCount - 1) 
            : unreadCount,
        });
      },

      // 清空所有通知
      clearAllNotifications: () => {
        set({
          notifications: [],
          unreadCount: 0,
        });
      },

      // 更新活动时间
      updateActivity: () => {
        set({ lastActivity: new Date() });
      },

      // 检查会话有效性
      checkSession: () => {
        const { sessionExpiry, isAuthenticated } = get();
        if (!isAuthenticated || !sessionExpiry) return false;

        const now = new Date();
        if (now > sessionExpiry) {
          get().logout();
          return false;
        }

        return true;
      },

      // 设置错误
      setError: (error: string | null) => {
        set({ error });
      },

      // 清除错误
      clearError: () => {
        set({ error: null });
      },

      // 重置状态
      reset: () => {
        set({ ...initialState });
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => localStorage),
      // 只持久化部分状态
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        currentRole: state.currentRole,
        availableRoles: state.availableRoles,
        sessionExpiry: state.sessionExpiry,
        notifications: state.notifications.slice(0, 20), // 只保存最近20条通知
        unreadCount: state.unreadCount,
      }),
      // 版本控制
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version < 1) {
          // 处理版本升级逻辑
          return {
            ...persistedState,
            roleHistory: [],
          };
        }
        return persistedState as AuthStore;
      },
    }
  )
);

// 选择器函数，便于组件使用
export const selectUser = (state: AuthStore) => state.user;
export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated;
export const selectCurrentRole = (state: AuthStore) => state.currentRole;
export const selectNotifications = (state: AuthStore) => state.notifications;
export const selectUnreadCount = (state: AuthStore) => state.unreadCount;

export type { AuthStore, AuthState, AuthActions };