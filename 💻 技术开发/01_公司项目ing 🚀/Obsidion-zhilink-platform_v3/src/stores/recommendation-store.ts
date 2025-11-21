/**
 * 推荐引擎状态管理
 * 
 * 管理智能推荐相关的状态、缓存、用户反馈等
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ProductData } from '@/types';
import { 
  recommendationEngine,
  type RecommendationRequest,
  type RecommendationResult,
  type RecommendationStrategy,
} from '@/services/smart-recommendation-engine';

interface RecommendationState {
  // 推荐结果
  recommendations: RecommendationResult | null;
  isLoading: boolean;
  error: string | null;
  
  // 推荐历史
  recommendationHistory: Array<{
    id: string;
    request: RecommendationRequest;
    result: RecommendationResult;
    timestamp: Date;
  }>;
  
  // 用户反馈
  userFeedback: Record<string, {
    productId: string;
    helpful: boolean;
    reason?: string;
    timestamp: Date;
  }>;
  
  // 个性化数据
  userProfile: {
    industry?: string;
    companySize?: 'startup' | 'sme' | 'enterprise';
    budget?: number;
    priorities?: string[];
    previousPurchases?: string[];
  };
  
  // 行为数据
  behaviorData: {
    viewedProducts: string[];
    favoriteProducts: string[];
    searchHistory: string[];
    clickHistory: Array<{
      productId: string;
      timestamp: Date;
      context: 'search' | 'recommendation' | 'featured' | 'trending';
    }>;
  };
  
  // 推荐设置
  settings: {
    strategy: RecommendationStrategy;
    diversify: boolean;
    explainReasons: boolean;
    includeAlternatives: boolean;
    maxRecommendations: number;
    refreshInterval: number; // 分钟
  };
  
  // 缓存管理
  cache: Record<string, {
    result: RecommendationResult;
    timestamp: Date;
    ttl: number; // 生存时间（毫秒）
  }>;
  
  // 实时推荐
  contextualRecommendations: Array<{
    context: 'product_view' | 'search' | 'cart' | 'profile';
    contextData?: any;
    recommendations: ProductData[];
    timestamp: Date;
  }>;
  
  // A/B测试
  experimentConfig: {
    enabled: boolean;
    variant: 'A' | 'B' | 'C';
    metrics: Record<string, number>;
  };
}

interface RecommendationActions {
  // 获取推荐
  getRecommendations: (request: RecommendationRequest) => Promise<void>;
  refreshRecommendations: () => Promise<void>;
  clearRecommendations: () => void;
  
  // 用户反馈
  provideFeedback: (productId: string, helpful: boolean, reason?: string) => void;
  getFeedback: (productId: string) => RecommendationState['userFeedback'][string] | null;
  clearFeedback: () => void;
  
  // 个性化数据管理
  updateUserProfile: (profile: Partial<RecommendationState['userProfile']>) => void;
  addToViewHistory: (productId: string) => void;
  addToSearchHistory: (query: string) => void;
  addToClickHistory: (productId: string, context: 'search' | 'recommendation' | 'featured' | 'trending') => void;
  clearBehaviorData: () => void;
  
  // 设置管理
  updateSettings: (settings: Partial<RecommendationState['settings']>) => void;
  setStrategy: (strategy: RecommendationStrategy) => void;
  toggleDiversify: () => void;
  toggleExplainReasons: () => void;
  
  // 缓存管理
  getCachedRecommendations: (requestHash: string) => RecommendationResult | null;
  setCachedRecommendations: (requestHash: string, result: RecommendationResult, ttl?: number) => void;
  clearCache: () => void;
  cleanupExpiredCache: () => void;
  
  // 上下文推荐
  getContextualRecommendations: (
    context: 'product_view' | 'search' | 'cart' | 'profile',
    contextData?: any
  ) => Promise<void>;
  clearContextualRecommendations: () => void;
  
  // 推荐历史
  getRecommendationHistory: (limit?: number) => RecommendationState['recommendationHistory'];
  clearHistory: () => void;
  
  // A/B测试
  initializeExperiment: (variant: 'A' | 'B' | 'C') => void;
  recordMetric: (key: string, value: number) => void;
  getExperimentMetrics: () => RecommendationState['experimentConfig']['metrics'];
  
  // 分析和统计
  getRecommendationStats: () => {
    totalRecommendations: number;
    averageAccuracy: number;
    topCategories: string[];
    userEngagement: number;
  };
  
  // 错误处理
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // 重置
  reset: () => void;
}

type RecommendationStore = RecommendationState & RecommendationActions;

// 初始状态
const initialState: RecommendationState = {
  recommendations: null,
  isLoading: false,
  error: null,
  recommendationHistory: [],
  userFeedback: {},
  userProfile: {},
  behaviorData: {
    viewedProducts: [],
    favoriteProducts: [],
    searchHistory: [],
    clickHistory: [],
  },
  settings: {
    strategy: 'hybrid' as RecommendationStrategy,
    diversify: true,
    explainReasons: true,
    includeAlternatives: true,
    maxRecommendations: 10,
    refreshInterval: 30, // 30分钟
  },
  cache: {},
  contextualRecommendations: [],
  experimentConfig: {
    enabled: false,
    variant: 'A',
    metrics: {},
  },
};

// 生成请求哈希
const generateRequestHash = (request: RecommendationRequest): string => {
  return btoa(JSON.stringify(request)).replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
};

export const useRecommendationStore = create<RecommendationStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // 获取推荐
      getRecommendations: async (request: RecommendationRequest) => {
        const requestHash = generateRequestHash(request);
        
        // 检查缓存
        const cached = get().getCachedRecommendations(requestHash);
        if (cached) {
          set({ recommendations: cached, error: null });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const result = await recommendationEngine.getRecommendations(request);
          
          set({ 
            recommendations: result,
            isLoading: false,
          });

          // 缓存结果
          get().setCachedRecommendations(requestHash, result);

          // 添加到历史记录
          const historyEntry = {
            id: `rec-${Date.now()}`,
            request,
            result,
            timestamp: new Date(),
          };

          set(state => ({
            recommendationHistory: [historyEntry, ...state.recommendationHistory].slice(0, 100), // 保留最近100条
          }));

          // 记录A/B测试指标
          if (get().experimentConfig.enabled) {
            get().recordMetric('recommendations_generated', 1);
            get().recordMetric('total_products_recommended', result.products.length);
          }

        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : '获取推荐失败',
          });
        }
      },

      // 刷新推荐
      refreshRecommendations: async () => {
        const { recommendations } = get();
        if (!recommendations) return;

        // 基于当前推荐重新生成
        const lastHistory = get().recommendationHistory[0];
        if (lastHistory) {
          await get().getRecommendations(lastHistory.request);
        }
      },

      // 清除推荐
      clearRecommendations: () => {
        set({ recommendations: null });
      },

      // 提供用户反馈
      provideFeedback: (productId: string, helpful: boolean, reason?: string) => {
        const feedback = {
          productId,
          helpful,
          reason,
          timestamp: new Date(),
        };

        set(state => ({
          userFeedback: {
            ...state.userFeedback,
            [`${productId}-${Date.now()}`]: feedback,
          },
        }));

        // 记录A/B测试指标
        if (get().experimentConfig.enabled) {
          get().recordMetric(helpful ? 'positive_feedback' : 'negative_feedback', 1);
        }
      },

      // 获取反馈
      getFeedback: (productId: string) => {
        const { userFeedback } = get();
        const feedbackEntries = Object.values(userFeedback).filter(f => f.productId === productId);
        return feedbackEntries.length > 0 ? feedbackEntries[feedbackEntries.length - 1] : null;
      },

      // 清除反馈
      clearFeedback: () => {
        set({ userFeedback: {} });
      },

      // 更新用户画像
      updateUserProfile: (profile: Partial<RecommendationState['userProfile']>) => {
        set(state => ({
          userProfile: {
            ...state.userProfile,
            ...profile,
          },
        }));
      },

      // 添加到浏览历史
      addToViewHistory: (productId: string) => {
        set(state => {
          const viewedProducts = state.behaviorData.viewedProducts.filter(id => id !== productId);
          return {
            behaviorData: {
              ...state.behaviorData,
              viewedProducts: [productId, ...viewedProducts].slice(0, 100), // 保留最近100个
            },
          };
        });
      },

      // 添加到搜索历史
      addToSearchHistory: (query: string) => {
        if (!query.trim()) return;
        
        set(state => {
          const searchHistory = state.behaviorData.searchHistory.filter(q => q !== query);
          return {
            behaviorData: {
              ...state.behaviorData,
              searchHistory: [query, ...searchHistory].slice(0, 50), // 保留最近50个
            },
          };
        });
      },

      // 添加到点击历史
      addToClickHistory: (productId: string, context: 'search' | 'recommendation' | 'featured' | 'trending') => {
        const clickRecord = {
          productId,
          timestamp: new Date(),
          context,
        };

        set(state => ({
          behaviorData: {
            ...state.behaviorData,
            clickHistory: [clickRecord, ...state.behaviorData.clickHistory].slice(0, 200), // 保留最近200个
          },
        }));

        // 记录A/B测试指标
        if (get().experimentConfig.enabled) {
          get().recordMetric(`clicks_from_${context}`, 1);
        }
      },

      // 清除行为数据
      clearBehaviorData: () => {
        set({
          behaviorData: {
            viewedProducts: [],
            favoriteProducts: [],
            searchHistory: [],
            clickHistory: [],
          },
        });
      },

      // 更新设置
      updateSettings: (settings: Partial<RecommendationState['settings']>) => {
        set(state => ({
          settings: {
            ...state.settings,
            ...settings,
          },
        }));
      },

      // 设置策略
      setStrategy: (strategy: RecommendationStrategy) => {
        get().updateSettings({ strategy });
        get().clearCache(); // 策略改变时清除缓存
      },

      // 切换多样化
      toggleDiversify: () => {
        const { settings } = get();
        get().updateSettings({ diversify: !settings.diversify });
      },

      // 切换解释原因
      toggleExplainReasons: () => {
        const { settings } = get();
        get().updateSettings({ explainReasons: !settings.explainReasons });
      },

      // 获取缓存的推荐
      getCachedRecommendations: (requestHash: string) => {
        const { cache } = get();
        const cached = cache[requestHash];
        
        if (!cached) return null;
        
        const now = Date.now();
        const cacheTime = cached.timestamp.getTime();
        
        if (now - cacheTime > cached.ttl) {
          // 缓存过期，清除
          set(state => {
            const newCache = { ...state.cache };
            delete newCache[requestHash];
            return { cache: newCache };
          });
          return null;
        }
        
        return cached.result;
      },

      // 设置缓存推荐
      setCachedRecommendations: (requestHash: string, result: RecommendationResult, ttl = 15 * 60 * 1000) => {
        const cached = {
          result,
          timestamp: new Date(),
          ttl,
        };

        set(state => ({
          cache: {
            ...state.cache,
            [requestHash]: cached,
          },
        }));
      },

      // 清除缓存
      clearCache: () => {
        set({ cache: {} });
      },

      // 清理过期缓存
      cleanupExpiredCache: () => {
        const { cache } = get();
        const now = Date.now();
        const cleanedCache: typeof cache = {};

        Object.entries(cache).forEach(([key, cached]) => {
          const cacheTime = cached.timestamp.getTime();
          if (now - cacheTime <= cached.ttl) {
            cleanedCache[key] = cached;
          }
        });

        set({ cache: cleanedCache });
      },

      // 获取上下文推荐
      getContextualRecommendations: async (context, contextData) => {
        try {
          const { behaviorData, userProfile } = get();
          
          const request: RecommendationRequest = {
            userProfile,
            behaviorData,
            options: {
              limit: 6,
              diversify: true,
            },
          };

          // 根据上下文调整请求
          switch (context) {
            case 'product_view':
              if (contextData?.productId) {
                request.constraints = { excludeTypes: [] };
                // 可以基于当前产品推荐相似产品
              }
              break;
            case 'search':
              if (contextData?.query) {
                request.userQuery = contextData.query;
              }
              break;
            case 'cart':
              // 基于购物车内容推荐补充产品
              break;
            case 'profile':
              // 基于用户画像推荐
              break;
          }

          const result = await recommendationEngine.getRecommendations(request);
          
          const contextualRec = {
            context,
            contextData,
            recommendations: result.products.map(p => p.product),
            timestamp: new Date(),
          };

          set(state => ({
            contextualRecommendations: [contextualRec, ...state.contextualRecommendations].slice(0, 20),
          }));

        } catch (error) {
          console.error('Failed to get contextual recommendations:', error);
        }
      },

      // 清除上下文推荐
      clearContextualRecommendations: () => {
        set({ contextualRecommendations: [] });
      },

      // 获取推荐历史
      getRecommendationHistory: (limit = 10) => {
        const { recommendationHistory } = get();
        return recommendationHistory.slice(0, limit);
      },

      // 清除历史
      clearHistory: () => {
        set({ recommendationHistory: [] });
      },

      // 初始化实验
      initializeExperiment: (variant: 'A' | 'B' | 'C') => {
        set({
          experimentConfig: {
            enabled: true,
            variant,
            metrics: {},
          },
        });
      },

      // 记录指标
      recordMetric: (key: string, value: number) => {
        set(state => ({
          experimentConfig: {
            ...state.experimentConfig,
            metrics: {
              ...state.experimentConfig.metrics,
              [key]: (state.experimentConfig.metrics[key] || 0) + value,
            },
          },
        }));
      },

      // 获取实验指标
      getExperimentMetrics: () => {
        return get().experimentConfig.metrics;
      },

      // 获取推荐统计
      getRecommendationStats: () => {
        const { recommendationHistory, userFeedback, behaviorData } = get();
        
        const totalRecommendations = recommendationHistory.length;
        const feedbackValues = Object.values(userFeedback);
        const positiveFeedback = feedbackValues.filter(f => f.helpful).length;
        const averageAccuracy = feedbackValues.length > 0 ? positiveFeedback / feedbackValues.length : 0;
        
        // 统计热门类别
        const categoryCount = new Map<string, number>();
        recommendationHistory.forEach(history => {
          history.result.products.forEach(product => {
            const category = product.product.category;
            categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
          });
        });
        
        const topCategories = Array.from(categoryCount.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([category]) => category);
        
        const userEngagement = behaviorData.clickHistory.length;
        
        return {
          totalRecommendations,
          averageAccuracy,
          topCategories,
          userEngagement,
        };
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
      name: 'recommendation-store',
      storage: createJSONStorage(() => localStorage),
      // 持久化用户行为数据和设置
      partialize: (state) => ({
        userProfile: state.userProfile,
        behaviorData: {
          ...state.behaviorData,
          viewedProducts: state.behaviorData.viewedProducts.slice(0, 50),
          searchHistory: state.behaviorData.searchHistory.slice(0, 20),
          clickHistory: state.behaviorData.clickHistory.slice(0, 100),
        },
        settings: state.settings,
        userFeedback: Object.fromEntries(
          Object.entries(state.userFeedback).slice(-50) // 只保存最近50条反馈
        ),
      }),
      // 版本控制
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version < 1) {
          return {
            ...persistedState,
            contextualRecommendations: [],
            experimentConfig: initialState.experimentConfig,
          };
        }
        return persistedState as RecommendationStore;
      },
    }
  )
);

// 选择器函数
export const selectRecommendations = (state: RecommendationStore) => state.recommendations;
export const selectIsLoading = (state: RecommendationStore) => state.isLoading;
export const selectError = (state: RecommendationStore) => state.error;
export const selectUserProfile = (state: RecommendationStore) => state.userProfile;
export const selectBehaviorData = (state: RecommendationStore) => state.behaviorData;
export const selectSettings = (state: RecommendationStore) => state.settings;
export const selectContextualRecommendations = (state: RecommendationStore) => state.contextualRecommendations;
export const selectRecommendationHistory = (state: RecommendationStore) => state.recommendationHistory;

export type { RecommendationStore, RecommendationState, RecommendationActions };