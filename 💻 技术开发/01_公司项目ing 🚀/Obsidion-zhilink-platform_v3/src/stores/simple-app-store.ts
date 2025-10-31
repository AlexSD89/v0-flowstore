"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 简化版应用状态管理
interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'vendor' | 'distributor';
  avatar?: string;
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface SimpleAppState {
  // 用户状态
  user: User | null;
  isAuthenticated: boolean;
  
  // 导航状态
  currentPage: string;
  searchQuery: string;
  selectedFilters: string[];
  
  // UI状态
  isLoading: boolean;
  showSidebar: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
  
  // 推荐状态
  recommendations: any[];
  lastRecommendationUpdate: number;
  
  // Actions
  setUser: (user: User) => void;
  switchRole: (role: 'buyer' | 'vendor' | 'distributor', context?: string) => Promise<void>;
  logout: () => void;
  setCurrentPage: (page: string) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: string[]) => void;
  setLoading: (loading: boolean) => void;
  toggleSidebar: () => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setRecommendations: (recommendations: any[]) => void;
  trackPageView: (path: string, data?: any) => void;
  fetchRecommendations: () => Promise<void>;
}

export const useAppStore = create<SimpleAppState>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      isAuthenticated: false,
      currentPage: 'home',
      searchQuery: '',
      selectedFilters: [],
      isLoading: false,
      showSidebar: false,
      theme: 'dark',
      notifications: [],
      recommendations: [],
      lastRecommendationUpdate: 0,
      
      // Actions
      setUser: (user) => set({ 
        isAuthenticated: true, 
        user
      }),
      
      switchRole: async (role, context) => {
        const { user } = get();
        if (user) {
          set({ 
            user: { ...user, role },
            isLoading: true
          });
          
          // 模拟API调用
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set({ isLoading: false });
        }
      },
      
      logout: () => set({ 
        isAuthenticated: false, 
        user: null
      }),
      
      setCurrentPage: (page) => set({ currentPage: page }),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      setFilters: (filters) => set({ selectedFilters: filters }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      toggleSidebar: () => set((state) => ({ 
        showSidebar: !state.showSidebar 
      })),
      
      toggleTheme: () => set((state) => ({
        theme: state.theme === 'dark' ? 'light' : 'dark'
      })),
      
      setTheme: (theme) => set({ theme }),
      
      setRecommendations: (recommendations) => set({ 
        recommendations,
        lastRecommendationUpdate: Date.now()
      }),
      
      trackPageView: (path, data) => {
        console.log('Page view tracked:', path, data);
      },
      
      fetchRecommendations: async () => {
        const { user } = get();
        if (user) {
          set({ isLoading: true });
          
          // 模拟推荐API调用
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const mockRecommendations = [
            { id: '1', name: 'AI文本处理', type: 'workforce' },
            { id: '2', name: '法律专家模块', type: 'expert_module' }
          ];
          
          set({ 
            recommendations: mockRecommendations,
            lastRecommendationUpdate: Date.now(),
            isLoading: false
          });
        }
      },
    }),
    {
      name: 'launchx-app-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
        selectedFilters: state.selectedFilters,
      }),
    }
  )
);

export default useAppStore;