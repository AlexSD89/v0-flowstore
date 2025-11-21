/**
 * LaunchX 智链平台 v3 - 增强版AI能力市场页面
 * 
 * 集成智能推荐系统和完整用户体验的市场页面，特性包括：
 * 1. 智能产品推荐 - 基于用户行为和偏好
 * 2. 多维度筛选 - 14个分类的动态筛选系统
 * 3. 实时搜索 - 智能搜索建议和结果展示
 * 4. 产品对比 - 多产品并行对比功能
 * 5. 个性化体验 - 基于角色的适配展示
 */

"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft,
  Search,
  Filter,
  Star,
  TrendingUp,
  Users,
  Zap,
  CheckCircle,
  Clock,
  Sparkles,
  ShoppingCart,
  Heart,
  ExternalLink,
  DollarSign,
  BarChart3,
  FileText,
  Bot,
  Grid3X3,
  List,
  SlidersHorizontal,
  Bookmark,
  Share2,
  MoreHorizontal,
  Eye,
  MessageCircle,
  ThumbsUp,
  Download,
  Play,
  Pause,
  Volume2,
  VolumeX
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { ProductData, ProductType, SortOption, SearchFilters } from '@/types';
import { useAppStore } from '@/stores/comprehensive-app-store';
import { intelligentRecommendationEngine } from '@/services/intelligent-recommendation-engine';
import { pageNavigationService } from '@/services/page-navigation-service';

// ==================== 常量定义 ====================

const PRODUCT_CATEGORIES = [
  { id: 'text_processing', name: '文本处理', icon: FileText, color: '#3b82f6' },
  { id: 'image_processing', name: '图像处理', icon: Eye, color: '#10b981' },
  { id: 'voice_processing', name: '语音处理', icon: Volume2, color: '#f59e0b' },
  { id: 'video_processing', name: '视频处理', icon: Play, color: '#ef4444' },
  { id: 'legal_professional', name: '法律专业', icon: BarChart3, color: '#8b5cf6' },
  { id: 'medical_professional', name: '医疗专业', icon: Heart, color: '#ec4899' },
  { id: 'finance_professional', name: '金融专业', icon: DollarSign, color: '#06b6d4' },
  { id: 'education_professional', name: '教育专业', icon: Sparkles, color: '#84cc16' },
  { id: 'customer_service', name: '客户服务', icon: MessageCircle, color: '#f97316' },
  { id: 'data_analysis', name: '数据分析', icon: BarChart3, color: '#6366f1' },
  { id: 'content_creation', name: '内容创作', icon: FileText, color: '#14b8a6' },
  { id: 'automation', name: '流程自动化', icon: Zap, color: '#f59e0b' },
  { id: 'robotics', name: '机器人技术', icon: Bot, color: '#8b5cf6' },
  { id: 'iot_integration', name: '物联网集成', icon: Zap, color: '#10b981' }
];

const VIEW_MODES = ['grid', 'list', 'compact'] as const;
type ViewMode = typeof VIEW_MODES[number];

// ==================== 主组件 ====================

export default function EnhancedMarketPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 状态管理
  const {
    search,
    cart,
    favorites,
    recommendations,
    currentRole,
    user,
    performSearch,
    updateSearchFilters,
    addToCart,
    toggleProductFavorite,
    fetchRecommendations,
    trackPageView,
    trackInteraction
  } = useAppStore();

  // 本地状态
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [isComparing, setIsComparing] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductData[]>([]);

  // ==================== 生命周期 ====================

  useEffect(() => {
    // 记录页面访问
    trackPageView('/market', {
      role: currentRole,
      searchQuery: searchParams.get('q'),
      category: searchParams.get('category')
    });

    // 初始化页面数据
    initializePage();
  }, []);

  useEffect(() => {
    // 监听搜索参数变化
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const type = searchParams.get('type') as ProductType;

    if (query !== search.query) {
      performSearch(query, {
        categories: category ? [category] : [],
        types: type ? [type] : []
      });
    }
  }, [searchParams]);

  useEffect(() => {
    // 当推荐更新时刷新数据
    if (recommendations.current.length > 0) {
      integrateRecommendations();
    }
  }, [recommendations.current]);

  // ==================== 初始化方法 ====================

  const initializePage = async () => {
    setLoading(true);
    
    try {
      // 并行执行多个初始化任务
      await Promise.all([
        loadProducts(),
        fetchRecommendations(),
        loadUserPreferences()
      ]);
    } catch (error) {
      console.error('Page initialization failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products?' + new URLSearchParams({
        limit: '50',
        sortBy,
        role: currentRole
      }));
      
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const loadUserPreferences = async () => {
    if (user) {
      // 加载用户偏好和历史数据
      trackInteraction('market_visit', {
        hasPreferences: !!recommendations.preferences,
        favoriteCount: favorites.products.length,
        cartCount: cart.items.length
      });
    }
  };

  const integrateRecommendations = () => {
    // 将推荐产品集成到产品列表中
    const recommendedProductIds = new Set(recommendations.current.map(rec => rec.product.id));
    
    // 为推荐产品添加标记
    setProducts(prevProducts => 
      prevProducts.map(product => ({
        ...product,
        isRecommended: recommendedProductIds.has(product.id),
        recommendationScore: recommendations.current.find(rec => rec.product.id === product.id)?.score
      }))
    );
  };

  // ==================== 搜索和筛选 ====================

  const handleSearch = useCallback(async (query: string) => {
    await performSearch(query, search.filters);
    trackInteraction('search', { query, hasResults: search.results.length > 0 });
  }, [search.filters, performSearch, trackInteraction]);

  const handleFilterChange = useCallback((key: keyof SearchFilters, value: any) => {
    const newFilters = { ...search.filters, [key]: value };
    updateSearchFilters(newFilters);
    
    // 自动执行搜索
    if (search.query.trim()) {
      performSearch(search.query, newFilters);
    }

    trackInteraction('filter_change', { key, value });
  }, [search.filters, search.query, updateSearchFilters, performSearch, trackInteraction]);

  const handleSortChange = useCallback((newSortBy: SortOption) => {
    setSortBy(newSortBy);
    trackInteraction('sort_change', { sortBy: newSortBy });
    
    // 重新排序产品
    const sortedProducts = sortProducts(products, newSortBy);
    setProducts(sortedProducts);
  }, [products, trackInteraction]);

  // ==================== 产品操作 ====================

  const handleProductSelect = useCallback((productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else if (newSelected.size < 5) { // 最多选择5个产品
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
    
    trackInteraction('product_select', { 
      productId, 
      action: newSelected.has(productId) ? 'add' : 'remove',
      totalSelected: newSelected.size 
    });
  }, [selectedProducts, trackInteraction]);

  const handleAddToCart = useCallback((product: ProductData, event: React.MouseEvent) => {
    event.stopPropagation();
    addToCart(product);
    trackInteraction('add_to_cart', { productId: product.id, from: 'market' });
  }, [addToCart, trackInteraction]);

  const handleToggleFavorite = useCallback((productId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    toggleProductFavorite(productId);
    trackInteraction('toggle_favorite', { 
      productId, 
      action: favorites.products.includes(productId) ? 'remove' : 'add' 
    });
  }, [toggleProductFavorite, favorites.products, trackInteraction]);

  const handleProductClick = useCallback((product: ProductData) => {
    trackInteraction('product_click', { productId: product.id, from: 'market' });
    router.push(`/product/${product.id}`);
  }, [router, trackInteraction]);

  // ==================== 产品对比 ====================

  const startComparison = useCallback(() => {
    if (selectedProducts.size < 2) {
      // 显示提示
      return;
    }
    
    const productIds = Array.from(selectedProducts).join(',');
    trackInteraction('start_comparison', { 
      productIds: Array.from(selectedProducts),
      count: selectedProducts.size 
    });
    
    router.push(`/market/compare?products=${productIds}`);
  }, [selectedProducts, router, trackInteraction]);

  // ==================== 工具函数 ====================

  const sortProducts = (products: ProductData[], sortBy: SortOption): ProductData[] => {
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return a.pricing.basePrice - b.pricing.basePrice;
        case 'price_high':
          return b.pricing.basePrice - a.pricing.basePrice;
        case 'rating':
          return b.metrics.rating - a.metrics.rating;
        case 'popularity':
          return b.metrics.userCount - a.metrics.userCount;
        case 'newest':
          return b.lastUpdated.getTime() - a.lastUpdated.getTime();
        case 'trending':
          return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
        case 'relevance':
        default:
          // 推荐分数优先，然后是特色产品，最后是评分
          const aScore = (a as any).recommendationScore || 0;
          const bScore = (b as any).recommendationScore || 0;
          if (aScore !== bScore) return bScore - aScore;
          
          const aFeatured = a.featured ? 1 : 0;
          const bFeatured = b.featured ? 1 : 0;
          if (aFeatured !== bFeatured) return bFeatured - aFeatured;
          
          return b.metrics.rating - a.metrics.rating;
      }
    });
  };

  const getFilteredProducts = useMemo(() => {
    let filtered = products;

    // 应用搜索查询
    if (search.query.trim()) {
      const query = search.query.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.toLowerCase().includes(query)) ||
        product.capabilities.some(cap => cap.toLowerCase().includes(query))
      );
    }

    // 应用类型筛选
    if (search.filters.types.length > 0) {
      filtered = filtered.filter(product => search.filters.types.includes(product.type));
    }

    // 应用分类筛选
    if (search.filters.categories.length > 0) {
      filtered = filtered.filter(product => search.filters.categories.includes(product.category));
    }

    // 应用价格范围筛选
    const [minPrice, maxPrice] = search.filters.priceRange;
    filtered = filtered.filter(product => 
      product.pricing.basePrice >= minPrice && product.pricing.basePrice <= maxPrice
    );

    // 应用评分筛选
    if (search.filters.rating > 0) {
      filtered = filtered.filter(product => product.metrics.rating >= search.filters.rating);
    }

    // 应用其他筛选条件
    if (search.filters.verified) {
      filtered = filtered.filter(product => product.vendor.verified);
    }

    if (search.filters.trending) {
      filtered = filtered.filter(product => product.trending);
    }

    if (search.filters.featured) {
      filtered = filtered.filter(product => product.featured);
    }

    return sortProducts(filtered, sortBy);
  }, [products, search.query, search.filters, sortBy]);

  // ==================== 渲染组件 ====================

  const renderToolbar = () => (
    <Card className="p-4 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* 搜索栏 */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input
            value={search.query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="搜索AI产品、功能或标签..."
            className="pl-10 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400"
          />
          
          {/* 搜索建议 */}
          {search.suggestions.length > 0 && (
            <Card className="absolute top-full left-0 right-0 z-10 mt-1 p-2 bg-slate-800 border-slate-700">
              {search.suggestions.slice(0, 5).map((suggestion, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-slate-300 hover:bg-slate-700"
                  onClick={() => handleSearch(suggestion)}
                >
                  <Search className="w-4 h-4 mr-2" />
                  {suggestion}
                </Button>
              ))}
            </Card>
          )}
        </div>

        {/* 筛选和排序 */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={`border-slate-600/50 ${showFilters ? 'bg-slate-700' : ''}`}
          >
            <Filter className="w-4 h-4 mr-2" />
            筛选
            {Object.values(search.filters).some(v => 
              Array.isArray(v) ? v.length > 0 : v !== 0 && v !== false && v !== ''
            ) && (
              <Badge variant="secondary" className="ml-2 px-1 py-0 text-xs">
                ·
              </Badge>
            )}
          </Button>

          <Select value={sortBy} onValueChange={(value: SortOption) => handleSortChange(value)}>
            <SelectTrigger className="w-48 bg-slate-700/50 border-slate-600/50 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">智能推荐</SelectItem>
              <SelectItem value="price_low">价格从低到高</SelectItem>
              <SelectItem value="price_high">价格从高到低</SelectItem>
              <SelectItem value="rating">评分最高</SelectItem>
              <SelectItem value="popularity">最受欢迎</SelectItem>
              <SelectItem value="newest">最新上架</SelectItem>
              <SelectItem value="trending">热门趋势</SelectItem>
            </SelectContent>
          </Select>

          {/* 视图模式切换 */}
          <div className="flex items-center border border-slate-600/50 rounded-lg p-1">
            {VIEW_MODES.map((mode) => {
              const Icon = mode === 'grid' ? Grid3X3 : mode === 'list' ? List : BarChart3;
              return (
                <Button
                  key={mode}
                  variant={viewMode === mode ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode(mode)}
                  className="p-2"
                >
                  <Icon className="w-4 h-4" />
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 高级筛选面板 */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-slate-700/50"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 产品类型 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">产品类型</label>
                <div className="space-y-2">
                  {['workforce', 'expert_module', 'market_report'].map((type) => (
                    <label key={type} className="flex items-center gap-2 text-sm text-slate-300">
                      <input
                        type="checkbox"
                        checked={search.filters.types.includes(type as ProductType)}
                        onChange={(e) => {
                          const newTypes = e.target.checked
                            ? [...search.filters.types, type as ProductType]
                            : search.filters.types.filter(t => t !== type);
                          handleFilterChange('types', newTypes);
                        }}
                        className="rounded border-slate-600"
                      />
                      {type === 'workforce' ? 'AI劳动力' : 
                       type === 'expert_module' ? '专家模块' : '市场报告'}
                    </label>
                  ))}
                </div>
              </div>

              {/* 价格范围 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">价格范围</label>
                <div className="px-2">
                  <Slider
                    value={search.filters.priceRange}
                    onValueChange={(value) => handleFilterChange('priceRange', value)}
                    max={10000}
                    min={0}
                    step={100}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>¥{search.filters.priceRange[0]}</span>
                    <span>¥{search.filters.priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* 评分筛选 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">最低评分</label>
                <Select 
                  value={search.filters.rating.toString()} 
                  onValueChange={(value) => handleFilterChange('rating', parseInt(value))}
                >
                  <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">不限</SelectItem>
                    <SelectItem value="3">3星及以上</SelectItem>
                    <SelectItem value="4">4星及以上</SelectItem>
                    <SelectItem value="5">5星</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 其他筛选 */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-white">其他条件</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <Switch
                      checked={search.filters.verified}
                      onCheckedChange={(checked) => handleFilterChange('verified', checked)}
                    />
                    认证供应商
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <Switch
                      checked={search.filters.trending}
                      onCheckedChange={(checked) => handleFilterChange('trending', checked)}
                    />
                    热门产品
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <Switch
                      checked={search.filters.featured}
                      onCheckedChange={(checked) => handleFilterChange('featured', checked)}
                    />
                    精选产品
                  </label>
                </div>
              </div>
            </div>

            {/* 清除筛选 */}
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  updateSearchFilters({
                    types: [],
                    categories: [],
                    priceRange: [0, 10000],
                    rating: 0,
                    verified: false,
                    trending: false,
                    featured: false
                  });
                }}
                className="border-slate-600/50 text-slate-300"
              >
                清除筛选
              </Button>

              <div className="text-sm text-slate-400">
                找到 <span className="text-white font-medium">{getFilteredProducts.length}</span> 个产品
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );

  const renderProductGrid = () => (
    <div className={`grid gap-6 ${
      viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' :
      viewMode === 'list' ? 'grid-cols-1' : 
      'md:grid-cols-2 lg:grid-cols-4'
    }`}>
      {getFilteredProducts.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          viewMode={viewMode}
          isSelected={selectedProducts.has(product.id)}
          isFavorited={favorites.products.includes(product.id)}
          isInCart={cart.items.some(item => item.productId === product.id)}
          onSelect={() => handleProductSelect(product.id)}
          onFavorite={(e) => handleToggleFavorite(product.id, e)}
          onAddToCart={(e) => handleAddToCart(product, e)}
          onClick={() => handleProductClick(product)}
          animationDelay={index * 0.1}
        />
      ))}
    </div>
  );

  const renderRecommendations = () => {
    if (!recommendations.current.length) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="p-6 bg-gradient-to-r from-cloudsway-primary-600/10 to-cloudsway-secondary-600/10 border-cloudsway-primary-500/20 mb-6 relative overflow-hidden">
          {/* 动态背景效果 */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-cloudsway-primary-500/5 to-cloudsway-secondary-500/5"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <motion.div 
            className="w-10 h-10 rounded-full bg-cloudsway-primary-600/20 flex items-center justify-center relative"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <Sparkles className="w-5 h-5 text-cloudsway-primary-400" />
            
            {/* 辐射效果 */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-cloudsway-primary-400/30"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          
          <div>
            <h3 className="font-semibold text-white flex items-center gap-2">
              AI智能推荐
              <Badge variant="outline" className="text-xs bg-green-500/20 border-green-500/50 text-green-400">
                实时更新
              </Badge>
            </h3>
            <p className="text-sm text-slate-400">基于您的需求和偏好定制推荐</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.current.slice(0, 3).map((rec, index) => (
            <motion.div
              key={rec.product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card 
                className="p-4 bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 hover:border-cloudsway-primary-500/30 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                onClick={() => handleProductClick(rec.product)}
              >
                {/* 优化：借鉴Hugging Face的卡片悬停效果 */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-cloudsway-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex items-start gap-3 relative z-10">
                  <motion.div 
                    className="w-12 h-12 rounded-lg bg-gradient-to-br from-cloudsway-primary-500/20 to-cloudsway-secondary-500/20 flex items-center justify-center relative"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Bot className="w-6 h-6 text-cloudsway-primary-400 group-hover:scale-110 transition-transform" />
                    
                    {/* 推荐置信度环 */}
                    <svg className="absolute inset-0 w-full h-full">
                      <circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray={`${rec.confidence * 100 * 2.8} 280`}
                        strokeDashoffset="-70"
                        className="text-cloudsway-primary-400/30"
                        transform="rotate(-90 24 24)"
                      />
                    </svg>
                  </motion.div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white truncate group-hover:text-cloudsway-primary-300 transition-colors">{rec.product.name}</h4>
                    <p className="text-sm text-slate-400 line-clamp-2 mt-1">{rec.explanation}</p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        {/* 动态匹配度显示 */}
                        <div className="flex items-center gap-1">
                          <div className="h-1.5 w-12 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${rec.score * 100}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            />
                          </div>
                          <span className="text-xs text-slate-400">
                            {Math.round(rec.score * 100)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-slate-300">{rec.product.metrics.rating}</span>
                      </div>
                    </div>
                    
                    {/* 快速操作按钮 */}
                    <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        预览
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                        <Heart className="w-3 h-3 mr-1" />
                        收藏
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchRecommendations()}
          className="mt-4 border-cloudsway-primary-500/50 text-cloudsway-primary-400 hover:bg-cloudsway-primary-500/10"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          刷新推荐
        </Button>
      </Card>
    );
  };

  const renderComparisonBar = () => {
    if (selectedProducts.size === 0) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
      >
        <Card className="p-4 bg-slate-800 border-slate-700 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-cloudsway-primary-400" />
              <span className="text-white font-medium">
                已选择 {selectedProducts.size} 个产品
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedProducts(new Set())}
                className="border-slate-600 text-slate-300"
              >
                清除
              </Button>
              
              <Button
                size="sm"
                onClick={startComparison}
                disabled={selectedProducts.size < 2}
                className="bg-cloudsway-primary-600 hover:bg-cloudsway-primary-700"
              >
                对比产品 ({selectedProducts.size})
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  // ==================== 主渲染 ====================

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <Card key={i} className="p-6 bg-slate-800/50 border-slate-700/50 animate-pulse">
                <div className="h-40 bg-slate-700/50 rounded-lg mb-4" />
                <div className="h-4 bg-slate-700/50 rounded mb-2" />
                <div className="h-3 bg-slate-700/50 rounded w-2/3" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* 返回按钮 */}
      <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            AI能力市场
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            发现、对比和采购最适合您业务需求的AI解决方案
          </p>
        </div>

        {/* 智能推荐区域 */}
        {renderRecommendations()}

        {/* 工具栏 */}
        {renderToolbar()}

        {/* 产品网格 */}
        {getFilteredProducts.length > 0 ? (
          renderProductGrid()
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-800/50 flex items-center justify-center">
              <Search className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">未找到相关产品</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              尝试调整搜索关键词或筛选条件，或者浏览我们的推荐产品
            </p>
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  handleSearch('');
                  updateSearchFilters({
                    types: [],
                    categories: [],
                    priceRange: [0, 10000],
                    rating: 0,
                    verified: false,
                    trending: false,
                    featured: false
                  });
                }}
                className="border-slate-600 text-slate-300"
              >
                重置筛选
              </Button>
              <Button
                onClick={() => router.push('/chat')}
                className="bg-cloudsway-primary-600 hover:bg-cloudsway-primary-700"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                咨询AI专家
              </Button>
            </div>
          </div>
        )}

        {/* 产品对比栏 */}
        {renderComparisonBar()}
      </div>
    </div>
  );
}

// ==================== 产品卡片组件 ====================

interface ProductCardProps {
  product: ProductData;
  viewMode: ViewMode;
  isSelected: boolean;
  isFavorited: boolean;
  isInCart: boolean;
  onSelect: () => void;
  onFavorite: (e: React.MouseEvent) => void;
  onAddToCart: (e: React.MouseEvent) => void;
  onClick: () => void;
  animationDelay?: number;
}

function ProductCard({
  product,
  viewMode,
  isSelected,
  isFavorited,
  isInCart,
  onSelect,
  onFavorite,
  onAddToCart,
  onClick,
  animationDelay = 0
}: ProductCardProps) {
  const getProductTypeInfo = (type: ProductType) => {
    switch (type) {
      case "workforce":
        return { icon: Bot, title: "AI劳动力", color: "text-blue-400" };
      case "expert_module":
        return { icon: BarChart3, title: "专家模块", color: "text-green-400" };
      case "market_report":
        return { icon: FileText, title: "市场报告", color: "text-purple-400" };
      default:
        return { icon: Sparkles, title: "AI产品", color: "text-slate-400" };
    }
  };

  const formatPrice = (pricing: ProductData["pricing"]) => {
    if (pricing.model === "usage_based") {
      return `¥${pricing.basePrice}/${pricing.period}`;
    }
    return `¥${pricing.basePrice}/${pricing.period || "次"}`;
  };

  const typeInfo = getProductTypeInfo(product.type);
  const TypeIcon = typeInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: animationDelay }}
    >
      <Card 
        className={`group relative cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-cloudsway-primary-500/10 ${
          viewMode === 'list' ? 'p-4' : 'p-6'
        } ${
          isSelected 
            ? 'bg-cloudsway-primary-600/10 border-cloudsway-primary-500/50 scale-[1.02]' 
            : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 hover:border-cloudsway-primary-500/30'
        } overflow-hidden`}
        onClick={onClick}
      >
        {/* 选择指示器 - 优化：动态效果 */}
        <AnimatePresence>
          {isSelected && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="absolute top-3 left-3 w-6 h-6 bg-cloudsway-primary-600 rounded-full flex items-center justify-center z-10 shadow-lg"
            >
              <CheckCircle className="w-4 h-4 text-white" />
              
              {/* 辐射效果 */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-cloudsway-primary-400"
                animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* 背景光效 */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-cloudsway-primary-500/5 to-cloudsway-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* 产品缩略图 - 优化：动态效果和交互式标签 */}
        <div className={`relative ${viewMode === 'list' ? 'w-24 h-24' : 'h-40'} bg-slate-700/30 rounded-lg mb-4 overflow-hidden group/thumbnail`}>
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-cloudsway-primary-500/20 to-cloudsway-secondary-500/20"
            animate={{
              background: [
                'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(6, 182, 212, 0.2))',
                'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2))',
                'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.2))'
              ]
            }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          
          {/* 产品标签 - 优化：动态和颜色编码 */}
          <motion.div 
            className="absolute top-3 left-3"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: animationDelay }}
          >
            <Badge
              className={`text-xs backdrop-blur-sm border transition-all duration-300 ${
                product.type === "workforce" ? "bg-blue-500/20 border-blue-500/50 text-blue-300" : 
                product.type === "expert_module" ? "bg-green-500/20 border-green-500/50 text-green-300" : 
                "bg-purple-500/20 border-purple-500/50 text-purple-300"
              } group-hover/thumbnail:scale-105`}
            >
              {typeInfo.title}
            </Badge>
          </motion.div>
          
          {/* 特殊标签 - 优化：动态显示和效果 */}
          <div className="absolute top-3 right-3 flex flex-col gap-1">
            <AnimatePresence>
              {product.featured && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ delay: animationDelay + 0.1 }}
                >
                  <Badge className="text-xs bg-yellow-500/20 border-yellow-500/50 text-yellow-400 backdrop-blur-sm relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    <span className="relative z-10">精选</span>
                  </Badge>
                </motion.div>
              )}
              {product.trending && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ delay: animationDelay + 0.2 }}
                >
                  <Badge className="text-xs bg-red-500/20 border-red-500/50 text-red-400 backdrop-blur-sm">
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      🔥 热门
                    </motion.span>
                  </Badge>
                </motion.div>
              )}
              {(product as any).isRecommended && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ delay: animationDelay + 0.3 }}
                >
                  <Badge className="text-xs bg-cloudsway-primary-500/20 border-cloudsway-primary-500/50 text-cloudsway-primary-400 backdrop-blur-sm">
                    <motion.span
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="inline-block"
                    >
                      ✨
                    </motion.span>
                    推荐
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 产品图标 - 优化：动态交互效果 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              whileHover={{ 
                scale: 1.1, 
                rotate: [0, -5, 5, 0],
                transition: { duration: 0.3 }
              }}
              className="relative"
            >
              <TypeIcon className={`${viewMode === 'list' ? 'w-8 h-8' : 'w-16 h-16'} text-slate-400 group-hover:text-cloudsway-primary-400 transition-all duration-300 drop-shadow-lg`} />
              
              {/* 悬停时的光效 */}
              <motion.div
                className={`absolute inset-0 ${viewMode === 'list' ? 'w-8 h-8' : 'w-16 h-16'} rounded-full border-2 border-cloudsway-primary-400/50 opacity-0 group-hover:opacity-100`}
                animate={{ scale: [1, 1.2, 1], opacity: [0, 0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          </div>
          
          {/* 悬停时的快速操作 */}
          <motion.div
            className="absolute inset-x-0 bottom-2 flex justify-center gap-1 opacity-0 group-hover/thumbnail:opacity-100 transition-opacity duration-300"
            initial={{ y: 10 }}
            animate={{ y: 0 }}
          >
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 bg-slate-800/80 backdrop-blur-sm hover:bg-cloudsway-primary-600/80">
              <Eye className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 bg-slate-800/80 backdrop-blur-sm hover:bg-red-600/80">
              <Heart className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 bg-slate-800/80 backdrop-blur-sm hover:bg-green-600/80">
              <ShoppingCart className="w-3 h-3" />
            </Button>
          </motion.div>
        </div>

        {/* 产品信息 - 优化：更好的排版和交互 */}
        <div className="space-y-3 relative z-10">
          <div>
            <motion.h3 
              className={`font-semibold text-white group-hover:text-cloudsway-primary-400 transition-colors ${
                viewMode === 'compact' ? 'text-base' : 'text-lg'
              } mb-1 leading-tight`}
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              {product.name}
            </motion.h3>
            
            <p className={`text-slate-400 ${
              viewMode === 'list' ? 'line-clamp-2' : viewMode === 'compact' ? 'line-clamp-1' : 'line-clamp-2'
            } text-sm leading-relaxed group-hover:text-slate-300 transition-colors`}>
              {product.description}
            </p>
            
            {/* 产品状态指示器 */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${
                  product.status === 'active' ? 'bg-green-500 animate-pulse' :
                  product.status === 'beta' ? 'bg-yellow-500' : 'bg-gray-500'
                }`} />
                <span className="text-xs text-slate-500 capitalize">{product.status}</span>
              </div>
              
              {product.metrics.uptime && (
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-400">{product.metrics.uptime}%</span>
                </div>
              )}
            </div>
          </div>

          {/* 供应商信息 - 优化：更丰富的供应商信息展示 */}
          <motion.div 
            className="flex items-center gap-2 p-2 rounded-lg bg-slate-700/30 group-hover:bg-slate-700/50 transition-colors"
            whileHover={{ scale: 1.02 }}
          >
            <Avatar className="w-6 h-6 ring-2 ring-slate-600 group-hover:ring-cloudsway-primary-500/50 transition-all">
              <AvatarImage src={product.vendor.avatar} alt={product.vendor.name} />
              <AvatarFallback className="text-xs bg-cloudsway-primary-600/20 text-cloudsway-primary-300">
                {product.vendor.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-slate-400 text-sm truncate">{product.vendor.name}</span>
                {product.vendor.verified && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: animationDelay + 0.5 }}
                  >
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </motion.div>
                )}
              </div>
              
              {/* 供应商评分 */}
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs text-slate-500">{product.vendor.rating}</span>
                <span className="text-xs text-slate-600">·</span>
                <span className="text-xs text-slate-500">企业级</span>
              </div>
            </div>
          </motion.div>

          {/* 评分和统计 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-white">{product.metrics.rating}</span>
                <span className="text-xs text-slate-400">({product.metrics.reviewCount})</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-400">{product.metrics.userCount}</span>
              </div>
            </div>

            {product.metrics.successRate && (
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-xs text-green-400">{product.metrics.successRate}%</span>
              </div>
            )}
          </div>

          {/* 能力标签 */}
          {viewMode !== 'compact' && (
            <div className="flex flex-wrap gap-1">
              {product.capabilities.slice(0, 3).map((capability) => (
                <Badge key={capability} variant="outline" className="text-xs">
                  {capability}
                </Badge>
              ))}
              {product.capabilities.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{product.capabilities.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* 价格和操作 */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-white font-semibold">
                {formatPrice(product.pricing)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* 选择按钮 */}
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
                className="p-2"
              >
                <CheckCircle className={`w-4 h-4 ${isSelected ? 'text-cloudsway-primary-400' : 'text-slate-400'}`} />
              </Button>

              {/* 收藏按钮 */}
              <Button
                size="sm"
                variant="ghost"
                onClick={onFavorite}
                className={`p-2 ${
                  isFavorited
                    ? "text-red-400 hover:text-red-300"
                    : "text-slate-400 hover:text-red-400"
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
              </Button>
              
              {/* 购物车按钮 */}
              <Button
                size="sm"
                variant="ghost"
                onClick={onAddToCart}
                className={`p-2 ${
                  isInCart
                    ? "text-cloudsway-primary-400"
                    : "text-slate-400"
                }`}
              >
                <ShoppingCart className={`w-4 h-4 ${isInCart ? "fill-current" : ""}`} />
              </Button>

              {/* 查看详情按钮 */}
              <Button 
                size="sm" 
                className="bg-cloudsway-primary-600 hover:bg-cloudsway-primary-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                查看
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}