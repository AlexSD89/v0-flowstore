/**
 * 产品数据状态管理
 * 
 * 管理产品列表、搜索、过滤、收藏、购物车等状态
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { 
  ProductData, 
  SearchFilters, 
  ProductType, 
  SortOption,
  PaginatedResponse 
} from '@/types';

interface ProductState {
  // 产品数据
  products: ProductData[];
  featuredProducts: ProductData[];
  trendingProducts: ProductData[];
  categories: string[];
  totalProducts: number;
  
  // 搜索和过滤
  searchQuery: string;
  searchHistory: string[];
  activeFilters: SearchFilters;
  sortBy: SortOption;
  sortOrder: 'asc' | 'desc';
  
  // 分页
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  
  // 用户行为
  favorites: Set<string>;
  cartItems: Set<string>;
  viewHistory: Array<{
    productId: string;
    timestamp: Date;
    duration?: number;
  }>;
  
  // 加载状态
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
  
  // 缓存
  lastFetchTime: Date | null;
  cacheExpiry: number; // 缓存过期时间（毫秒）
}

interface ProductActions {
  // 产品获取
  fetchProducts: (options?: {
    page?: number;
    limit?: number;
    filters?: Partial<SearchFilters>;
    forceRefresh?: boolean;
  }) => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  fetchTrendingProducts: () => Promise<void>;
  fetchProductById: (id: string) => Promise<ProductData | null>;
  
  // 搜索功能
  search: (query: string, options?: {
    filters?: Partial<SearchFilters>;
    sort?: SortOption;
  }) => Promise<void>;
  clearSearch: () => void;
  addToSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  
  // 过滤和排序
  updateFilters: (filters: Partial<SearchFilters>) => void;
  clearFilters: () => void;
  setSortBy: (sortBy: SortOption, order?: 'asc' | 'desc') => void;
  applyFilters: () => Promise<void>;
  
  // 分页
  setPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setPageSize: (size: number) => void;
  
  // 用户行为
  toggleFavorite: (productId: string) => void;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  addToViewHistory: (productId: string, duration?: number) => void;
  
  // 批量操作
  addMultipleToCart: (productIds: string[]) => void;
  removeMultipleFromCart: (productIds: string[]) => void;
  addMultipleToFavorites: (productIds: string[]) => void;
  
  // 推荐功能
  getRecommendedProducts: (productId?: string, limit?: number) => ProductData[];
  getSimilarProducts: (productId: string, limit?: number) => ProductData[];
  getPersonalizedRecommendations: (limit?: number) => ProductData[];
  
  // 统计和分析
  getProductStats: () => {
    totalViewed: number;
    totalFavorited: number;
    totalInCart: number;
    mostViewedCategories: Array<{ category: string; count: number }>;
    averageRating: number;
  };
  
  // 缓存管理
  invalidateCache: () => void;
  clearCache: () => void;
  
  // 错误处理
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // 重置
  reset: () => void;
}

type ProductStore = ProductState & ProductActions;

// 初始状态
const initialState: ProductState = {
  products: [],
  featuredProducts: [],
  trendingProducts: [],
  categories: [],
  totalProducts: 0,
  searchQuery: '',
  searchHistory: [],
  activeFilters: {
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
    responseTime: 10,
    successRate: 0,
    sortBy: 'relevance',
    sortOrder: 'desc',
  },
  sortBy: 'relevance',
  sortOrder: 'desc',
  currentPage: 1,
  pageSize: 12,
  hasNextPage: false,
  hasPreviousPage: false,
  favorites: new Set(),
  cartItems: new Set(),
  viewHistory: [],
  isLoading: false,
  isSearching: false,
  error: null,
  lastFetchTime: null,
  cacheExpiry: 5 * 60 * 1000, // 5分钟缓存
};

// 模拟API服务
const productAPI = {
  async getProducts(options: any = {}): Promise<PaginatedResponse<ProductData>> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 模拟产品数据
    const mockProducts: ProductData[] = [
      {
        id: "product-1",
        name: "ChatBot Pro AI客服系统",
        description: "基于GPT-4的智能客服机器人，支持多语言对话，24/7自动响应，可处理90%的常见客户咨询。",
        type: "workforce",
        vendor: {
          id: "vendor-1",
          name: "TechFlow AI",
          avatar: "/images/vendors/techflow.jpg",
          verified: true,
          rating: 4.8,
        },
        pricing: {
          model: "subscription",
          basePrice: 299,
          currency: "CNY",
          period: "月",
          tierName: "专业版",
          commissionRate: 15,
        },
        capabilities: [
          "智能对话", "多语言支持", "情感识别", "知识库集成", "API集成"
        ],
        metrics: {
          rating: 4.8,
          reviewCount: 156,
          userCount: 2340,
          successRate: 92,
          responseTime: "<2秒",
          uptime: 99.9,
        },
        tags: ["客服", "对话AI", "自动化", "多语言"],
        featured: true,
        trending: true,
        status: "active",
        lastUpdated: new Date("2024-01-10"),
        thumbnail: "/images/products/chatbot-pro.jpg",
        category: "客户服务",
        compatibility: ["Web", "移动端", "API"],
      },
      // 可以添加更多产品...
    ];

    const filtered = mockProducts.filter(product => {
      if (options.type && product.type !== options.type) return false;
      if (options.category && product.category !== options.category) return false;
      if (options.query) {
        const query = options.query.toLowerCase();
        return product.name.toLowerCase().includes(query) ||
               product.description.toLowerCase().includes(query) ||
               product.tags.some((tag: string) => tag.toLowerCase().includes(query));
      }
      return true;
    });

    const start = (options.page - 1) * options.limit;
    const end = start + options.limit;
    const paginatedProducts = filtered.slice(start, end);

    return {
      success: true,
      data: paginatedProducts,
      pagination: {
        page: options.page || 1,
        limit: options.limit || 12,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / (options.limit || 12)),
        hasNext: end < filtered.length,
        hasPrev: (options.page || 1) > 1,
      },
      timestamp: new Date(),
    };
  },

  async searchProducts(query: string, filters: any = {}): Promise<PaginatedResponse<ProductData>> {
    return this.getProducts({ ...filters, query });
  },

  async getProductById(id: string): Promise<ProductData | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 模拟根据ID查找产品
    const response = await this.getProducts({ limit: 100 });
    return response.data?.find(p => p.id === id) || null;
  },
};

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // 获取产品列表
      fetchProducts: async (options = {}) => {
        const state = get();
        
        // 检查缓存
        if (!options.forceRefresh && state.lastFetchTime) {
          const timeSinceLastFetch = Date.now() - state.lastFetchTime.getTime();
          if (timeSinceLastFetch < state.cacheExpiry) {
            return; // 使用缓存数据
          }
        }

        set({ isLoading: true, error: null });

        try {
          const response = await productAPI.getProducts({
            page: options.page || state.currentPage,
            limit: options.limit || state.pageSize,
            ...options.filters,
          });

          if (response.success && response.data) {
            set({
              products: response.data,
              totalProducts: response.pagination.total,
              currentPage: response.pagination.page,
              hasNextPage: response.pagination.hasNext,
              hasPreviousPage: response.pagination.hasPrev,
              lastFetchTime: new Date(),
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '获取产品列表失败',
            isLoading: false,
          });
        }
      },

      // 获取精选产品
      fetchFeaturedProducts: async () => {
        try {
          const response = await productAPI.getProducts({ featured: true, limit: 6 });
          if (response.success && response.data) {
            set({ featuredProducts: response.data });
          }
        } catch (error) {
          console.error('Failed to fetch featured products:', error);
        }
      },

      // 获取热门产品
      fetchTrendingProducts: async () => {
        try {
          const response = await productAPI.getProducts({ trending: true, limit: 8 });
          if (response.success && response.data) {
            set({ trendingProducts: response.data });
          }
        } catch (error) {
          console.error('Failed to fetch trending products:', error);
        }
      },

      // 根据ID获取产品
      fetchProductById: async (id: string) => {
        try {
          const product = await productAPI.getProductById(id);
          return product;
        } catch (error) {
          console.error('Failed to fetch product:', error);
          return null;
        }
      },

      // 搜索产品
      search: async (query: string, options = {}) => {
        set({ 
          isSearching: true, 
          searchQuery: query, 
          error: null,
          currentPage: 1, // 搜索时重置页码
        });

        // 添加到搜索历史
        get().addToSearchHistory(query);

        try {
          const response = await productAPI.searchProducts(query, {
            page: 1,
            limit: get().pageSize,
            ...options.filters,
            sortBy: options.sort || get().sortBy,
          });

          if (response.success && response.data) {
            set({
              products: response.data,
              totalProducts: response.pagination.total,
              hasNextPage: response.pagination.hasNext,
              hasPreviousPage: response.pagination.hasPrev,
              isSearching: false,
              activeFilters: {
                ...get().activeFilters,
                query,
                ...options.filters,
              },
            });
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '搜索失败',
            isSearching: false,
          });
        }
      },

      // 清除搜索
      clearSearch: () => {
        set({ 
          searchQuery: '',
          activeFilters: {
            ...get().activeFilters,
            query: '',
          }
        });
        get().fetchProducts({ forceRefresh: true });
      },

      // 添加到搜索历史
      addToSearchHistory: (query: string) => {
        if (!query.trim()) return;
        
        set(state => {
          const history = state.searchHistory.filter(item => item !== query);
          return {
            searchHistory: [query, ...history].slice(0, 10), // 保留最近10条
          };
        });
      },

      // 清除搜索历史
      clearSearchHistory: () => {
        set({ searchHistory: [] });
      },

      // 更新过滤器
      updateFilters: (filters: Partial<SearchFilters>) => {
        set(state => ({
          activeFilters: {
            ...state.activeFilters,
            ...filters,
          },
        }));
      },

      // 清除过滤器
      clearFilters: () => {
        set({
          activeFilters: {
            ...initialState.activeFilters,
            query: get().searchQuery, // 保留搜索查询
          }
        });
      },

      // 设置排序
      setSortBy: (sortBy: SortOption, order = 'desc') => {
        set({ sortBy, sortOrder: order });
        get().applyFilters();
      },

      // 应用过滤器
      applyFilters: async () => {
        const { activeFilters, currentPage, pageSize } = get();
        await get().fetchProducts({
          page: currentPage,
          limit: pageSize,
          filters: activeFilters,
          forceRefresh: true,
        });
      },

      // 设置页码
      setPage: (page: number) => {
        set({ currentPage: page });
        get().fetchProducts();
      },

      // 下一页
      nextPage: () => {
        const { currentPage, hasNextPage } = get();
        if (hasNextPage) {
          get().setPage(currentPage + 1);
        }
      },

      // 上一页
      previousPage: () => {
        const { currentPage, hasPreviousPage } = get();
        if (hasPreviousPage) {
          get().setPage(currentPage - 1);
        }
      },

      // 设置页面大小
      setPageSize: (size: number) => {
        set({ pageSize: size, currentPage: 1 });
        get().fetchProducts();
      },

      // 切换收藏
      toggleFavorite: (productId: string) => {
        set(state => {
          const newFavorites = new Set(state.favorites);
          if (newFavorites.has(productId)) {
            newFavorites.delete(productId);
          } else {
            newFavorites.add(productId);
          }
          return { favorites: newFavorites };
        });
      },

      // 添加到购物车
      addToCart: (productId: string) => {
        set(state => ({
          cartItems: new Set([...state.cartItems, productId])
        }));
      },

      // 从购物车移除
      removeFromCart: (productId: string) => {
        set(state => {
          const newCartItems = new Set(state.cartItems);
          newCartItems.delete(productId);
          return { cartItems: newCartItems };
        });
      },

      // 清空购物车
      clearCart: () => {
        set({ cartItems: new Set() });
      },

      // 添加到浏览历史
      addToViewHistory: (productId: string, duration?: number) => {
        set(state => {
          const newHistory = state.viewHistory.filter(item => item.productId !== productId);
          return {
            viewHistory: [
              { productId, timestamp: new Date(), duration },
              ...newHistory
            ].slice(0, 50), // 保留最近50条记录
          };
        });
      },

      // 批量添加到购物车
      addMultipleToCart: (productIds: string[]) => {
        set(state => ({
          cartItems: new Set([...state.cartItems, ...productIds])
        }));
      },

      // 批量从购物车移除
      removeMultipleFromCart: (productIds: string[]) => {
        set(state => {
          const newCartItems = new Set(state.cartItems);
          productIds.forEach(id => newCartItems.delete(id));
          return { cartItems: newCartItems };
        });
      },

      // 批量添加收藏
      addMultipleToFavorites: (productIds: string[]) => {
        set(state => ({
          favorites: new Set([...state.favorites, ...productIds])
        }));
      },

      // 获取推荐产品
      getRecommendedProducts: (productId?: string, limit = 6) => {
        const { products, viewHistory } = get();
        
        // 简单的推荐算法：基于浏览历史和相似标签
        let recommended = products.filter(p => {
          if (productId && p.id === productId) return false;
          
          if (viewHistory.length > 0) {
            const viewedProducts = products.filter(prod => 
              viewHistory.some(h => h.productId === prod.id)
            );
            
            // 查找相似标签的产品
            return viewedProducts.some(viewed => 
              p.tags.some(tag => viewed.tags.includes(tag))
            );
          }
          
          return p.featured || p.trending;
        });

        return recommended.slice(0, limit);
      },

      // 获取相似产品
      getSimilarProducts: (productId: string, limit = 4) => {
        const { products } = get();
        const targetProduct = products.find(p => p.id === productId);
        
        if (!targetProduct) return [];

        const similar = products.filter(p => {
          if (p.id === productId) return false;
          
          // 基于类型、类别和标签的相似性
          const sameType = p.type === targetProduct.type;
          const sameCategory = p.category === targetProduct.category;
          const commonTags = p.tags.filter(tag => targetProduct.tags.includes(tag)).length;
          
          return sameType || sameCategory || commonTags > 0;
        });

        return similar.slice(0, limit);
      },

      // 获取个性化推荐
      getPersonalizedRecommendations: (limit = 8) => {
        const { products, favorites, viewHistory, cartItems } = get();
        
        // 基于用户行为的个性化推荐
        const userInteractions = new Set([
          ...Array.from(favorites),
          ...Array.from(cartItems),
          ...viewHistory.map(h => h.productId),
        ]);

        const interactedProducts = products.filter(p => userInteractions.has(p.id));
        
        // 基于交互产品找相似产品
        const recommended = products.filter(p => {
          if (userInteractions.has(p.id)) return false;
          
          return interactedProducts.some(interacted => 
            p.category === interacted.category ||
            p.tags.some(tag => interacted.tags.includes(tag))
          );
        });

        return recommended.slice(0, limit);
      },

      // 获取产品统计
      getProductStats: () => {
        const { products, viewHistory, favorites, cartItems } = get();
        
        const totalViewed = viewHistory.length;
        const totalFavorited = favorites.size;
        const totalInCart = cartItems.size;
        
        // 统计最常浏览的类别
        const categoryCount = new Map<string, number>();
        viewHistory.forEach(({ productId }) => {
          const product = products.find(p => p.id === productId);
          if (product) {
            const count = categoryCount.get(product.category) || 0;
            categoryCount.set(product.category, count + 1);
          }
        });

        const mostViewedCategories = Array.from(categoryCount.entries())
          .map(([category, count]) => ({ category, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        const averageRating = products.reduce((sum, p) => sum + p.metrics.rating, 0) / products.length;

        return {
          totalViewed,
          totalFavorited,
          totalInCart,
          mostViewedCategories,
          averageRating: Math.round(averageRating * 10) / 10,
        };
      },

      // 使缓存失效
      invalidateCache: () => {
        set({ lastFetchTime: null });
      },

      // 清除缓存
      clearCache: () => {
        set({
          products: [],
          featuredProducts: [],
          trendingProducts: [],
          lastFetchTime: null,
        });
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
      name: 'product-store',
      storage: createJSONStorage(() => localStorage),
      // 只持久化用户行为数据
      partialize: (state) => ({
        favorites: Array.from(state.favorites),
        cartItems: Array.from(state.cartItems),
        searchHistory: state.searchHistory,
        viewHistory: state.viewHistory.slice(0, 20), // 只保存最近20条
        pageSize: state.pageSize,
      }),
      // 恢复时重新构建Set对象
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.favorites = new Set((state as any).favorites || []);
          state.cartItems = new Set((state as any).cartItems || []);
        }
      },
    }
  )
);

// 选择器函数
export const selectProducts = (state: ProductStore) => state.products;
export const selectFeaturedProducts = (state: ProductStore) => state.featuredProducts;
export const selectTrendingProducts = (state: ProductStore) => state.trendingProducts;
export const selectIsLoading = (state: ProductStore) => state.isLoading;
export const selectSearchQuery = (state: ProductStore) => state.searchQuery;
export const selectActiveFilters = (state: ProductStore) => state.activeFilters;
export const selectFavorites = (state: ProductStore) => state.favorites;
export const selectCartItems = (state: ProductStore) => state.cartItems;
export const selectCartCount = (state: ProductStore) => state.cartItems.size;
export const selectFavoriteCount = (state: ProductStore) => state.favorites.size;

export type { ProductStore, ProductState, ProductActions };