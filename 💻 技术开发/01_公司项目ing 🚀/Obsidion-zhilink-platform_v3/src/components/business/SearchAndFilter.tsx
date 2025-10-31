"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  X,
  ChevronDown,
  ChevronUp,
  Settings2,
  Tag,
  DollarSign,
  Star,
  Calendar,
  TrendingUp,
  Users,
  Zap,
  Shield,
  Award,
  Clock,
  Target,
  BarChart3,
  Globe,
  Sparkles,
  RefreshCw,
  BookmarkCheck,
  Eye,
  Heart,
  Share2,
  Package,
  Store,
  ShoppingBag
} from 'lucide-react';

import { cn } from "@/lib/utils";

// 产品类型
export type ProductType = 'workforce' | 'expert_module' | 'market_report';
export type PricingModel = 'subscription' | 'one_time' | 'usage_based' | 'freemium';
export type SortOption = 'relevance' | 'price_low' | 'price_high' | 'rating' | 'popularity' | 'newest' | 'trending';

// 搜索过滤器接口
export interface SearchFilters {
  query: string;
  types: ProductType[];
  categories: string[];
  pricingModels: PricingModel[];
  priceRange: [number, number];
  rating: number;
  verified: boolean;
  trending: boolean;
  featured: boolean;
  tags: string[];
  responseTime: number;
  successRate: number;
  sortBy: SortOption;
  sortOrder: 'asc' | 'desc';
}

// 搜索结果统计
export interface SearchStats {
  totalResults: number;
  averagePrice: number;
  averageRating: number;
  topCategories: Array<{ name: string; count: number }>;
  priceDistribution: Array<{ range: string; count: number }>;
}

// 建议搜索
export interface SearchSuggestion {
  query: string;
  type: 'recent' | 'trending' | 'related';
  count?: number;
}

// 组件属性
export interface SearchAndFilterProps {
  initialFilters?: Partial<SearchFilters>;
  suggestions?: SearchSuggestion[];
  stats?: SearchStats;
  availableCategories?: string[];
  availableTags?: string[];
  onFiltersChange?: (filters: SearchFilters) => void;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  isLoading?: boolean;
  className?: string;
  showStats?: boolean;
  showAdvanced?: boolean;
}

// 默认过滤器
const defaultFilters: SearchFilters = {
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
  responseTime: 0,
  successRate: 0,
  sortBy: 'relevance',
  sortOrder: 'desc'
};

// 产品类型配置
const productTypeConfig = {
  workforce: {
    name: 'AI劳动力',
    icon: ShoppingBag,
    color: 'text-blue-600',
    description: '即用型AI能力'
  },
  expert_module: {
    name: '专家模块',
    icon: Package,
    color: 'text-purple-600',
    description: '专业知识模块'
  },
  market_report: {
    name: '市场报告',
    icon: BarChart3,
    color: 'text-emerald-600',
    description: '行业洞察分析'
  }
};

// 定价模型配置
const pricingModelConfig = {
  subscription: { name: '订阅制', icon: RefreshCw, color: 'text-blue-600' },
  one_time: { name: '买断制', icon: DollarSign, color: 'text-green-600' },
  usage_based: { name: '按量付费', icon: BarChart3, color: 'text-orange-600' },
  freemium: { name: '免费增值', icon: Gift, color: 'text-purple-600' }
};

// 排序选项配置
const sortOptions = [
  { value: 'relevance', label: '相关度', icon: Target },
  { value: 'price_low', label: '价格从低到高', icon: SortAsc },
  { value: 'price_high', label: '价格从高到低', icon: SortDesc },
  { value: 'rating', label: '评分', icon: Star },
  { value: 'popularity', label: '热门度', icon: TrendingUp },
  { value: 'newest', label: '最新', icon: Clock },
  { value: 'trending', label: '趋势', icon: Sparkles }
] as const;

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  initialFilters,
  suggestions = [],
  stats,
  availableCategories = [],
  availableTags = [],
  onFiltersChange,
  onSearch,
  onClear,
  isLoading = false,
  className,
  showStats = true,
  showAdvanced = false
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    ...defaultFilters,
    ...initialFilters
  });
  
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(showAdvanced);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.query);

  // 活跃过滤器统计
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.query) count++;
    if (filters.types.length) count++;
    if (filters.categories.length) count++;
    if (filters.pricingModels.length) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) count++;
    if (filters.rating > 0) count++;
    if (filters.verified) count++;
    if (filters.trending) count++;
    if (filters.featured) count++;
    if (filters.tags.length) count++;
    if (filters.responseTime > 0) count++;
    if (filters.successRate > 0) count++;
    return count;
  }, [filters]);

  // 更新过滤器
  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange?.(updatedFilters);
  };

  // 处理搜索
  const handleSearch = (query?: string) => {
    const searchQuery = query ?? searchInput;
    updateFilters({ query: searchQuery });
    onSearch?.(searchQuery);
    setShowSuggestions(false);
  };

  // 清除所有过滤器
  const handleClearAll = () => {
    const clearedFilters = {
      ...defaultFilters,
      query: filters.query // 保留搜索查询
    };
    setFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
    onClear?.();
  };

  // 清除单个过滤器
  const handleClearFilter = (filterKey: keyof SearchFilters) => {
    switch (filterKey) {
      case 'types':
      case 'categories':
      case 'pricingModels':
      case 'tags':
        updateFilters({ [filterKey]: [] });
        break;
      case 'priceRange':
        updateFilters({ [filterKey]: [0, 10000] });
        break;
      case 'rating':
      case 'responseTime':
      case 'successRate':
        updateFilters({ [filterKey]: 0 });
        break;
      case 'verified':
      case 'trending':
      case 'featured':
        updateFilters({ [filterKey]: false });
        break;
      case 'query':
        setSearchInput('');
        updateFilters({ [filterKey]: '' });
        break;
      default:
        break;
    }
  };

  // 渲染搜索建议
  const renderSearchSuggestions = () => (
    <AnimatePresence>
      {showSuggestions && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 z-50 mt-2 bg-background-glass backdrop-blur-xl border border-border-primary rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-secondary">搜索建议</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => setShowSuggestions(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {suggestions.slice(0, 6).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(suggestion.query)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-background-card rounded-lg transition-colors"
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                    suggestion.type === 'recent' && "bg-blue-100 dark:bg-blue-900/20 text-blue-600",
                    suggestion.type === 'trending' && "bg-red-100 dark:bg-red-900/20 text-red-600",
                    suggestion.type === 'related' && "bg-green-100 dark:bg-green-900/20 text-green-600"
                  )}>
                    {suggestion.type === 'recent' && <Clock className="w-3 h-3" />}
                    {suggestion.type === 'trending' && <TrendingUp className="w-3 h-3" />}
                    {suggestion.type === 'related' && <Target className="w-3 h-3" />}
                  </div>
                  <span className="flex-1 text-sm text-text-primary">
                    {suggestion.query}
                  </span>
                  {suggestion.count && (
                    <Badge variant="outline" className="text-xs">
                      {suggestion.count}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // 渲染活跃过滤器标签
  const renderActiveFilters = () => {
    const activeItems = [];

    if (filters.query) {
      activeItems.push(
        <Badge 
          key="query" 
          variant="secondary" 
          className="flex items-center gap-1 pr-1"
        >
          搜索: {filters.query}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 hover:bg-transparent"
            onClick={() => handleClearFilter('query')}
          >
            <X className="w-3 h-3" />
          </Button>
        </Badge>
      );
    }

    if (filters.types.length > 0) {
      activeItems.push(
        <Badge 
          key="types" 
          variant="secondary" 
          className="flex items-center gap-1 pr-1"
        >
          类型: {filters.types.length}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 hover:bg-transparent"
            onClick={() => handleClearFilter('types')}
          >
            <X className="w-3 h-3" />
          </Button>
        </Badge>
      );
    }

    if (filters.categories.length > 0) {
      activeItems.push(
        <Badge 
          key="categories" 
          variant="secondary" 
          className="flex items-center gap-1 pr-1"
        >
          分类: {filters.categories.length}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 hover:bg-transparent"
            onClick={() => handleClearFilter('categories')}
          >
            <X className="w-3 h-3" />
          </Button>
        </Badge>
      );
    }

    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) {
      activeItems.push(
        <Badge 
          key="price" 
          variant="secondary" 
          className="flex items-center gap-1 pr-1"
        >
          价格: ¥{filters.priceRange[0]} - ¥{filters.priceRange[1]}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 hover:bg-transparent"
            onClick={() => handleClearFilter('priceRange')}
          >
            <X className="w-3 h-3" />
          </Button>
        </Badge>
      );
    }

    if (filters.rating > 0) {
      activeItems.push(
        <Badge 
          key="rating" 
          variant="secondary" 
          className="flex items-center gap-1 pr-1"
        >
          评分: ≥{filters.rating}星
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 hover:bg-transparent"
            onClick={() => handleClearFilter('rating')}
          >
            <X className="w-3 h-3" />
          </Button>
        </Badge>
      );
    }

    // 添加更多过滤器标签...

    return activeItems.length > 0 ? (
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-text-secondary">已筛选:</span>
        {activeItems}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearAll}
          className="text-xs h-7 text-status-error hover:text-status-error"
        >
          清除全部
        </Button>
      </div>
    ) : null;
  };

  // 渲染过滤器面板内容
  const renderFilterContent = () => (
    <div className="space-y-6">
      {/* 产品类型 */}
      <div className="space-y-3">
        <h3 className="font-semibold text-text-primary flex items-center gap-2">
          <Package className="w-4 h-4" />
          产品类型
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {(Object.keys(productTypeConfig) as ProductType[]).map((type) => {
            const config = productTypeConfig[type];
            const IconComponent = config.icon;
            const isChecked = filters.types.includes(type);
            
            return (
              <div key={type} className="flex items-center space-x-3">
                <Checkbox
                  id={`type-${type}`}
                  checked={isChecked}
                  onCheckedChange={(checked) => {
                    const newTypes = checked
                      ? [...filters.types, type]
                      : filters.types.filter(t => t !== type);
                    updateFilters({ types: newTypes });
                  }}
                />
                <label
                  htmlFor={`type-${type}`}
                  className="flex items-center gap-2 cursor-pointer flex-1"
                >
                  <IconComponent className={cn("w-4 h-4", config.color)} />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-text-primary">
                      {config.name}
                    </span>
                    <p className="text-xs text-text-secondary">
                      {config.description}
                    </p>
                  </div>
                </label>
              </div>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* 分类筛选 */}
      {availableCategories.length > 0 && (
        <>
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full">
              <h3 className="font-semibold text-text-primary flex items-center gap-2">
                <Tag className="w-4 h-4" />
                分类筛选
              </h3>
              <ChevronDown className="w-4 h-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="grid grid-cols-2 gap-2">
                {availableCategories.map((category) => {
                  const isChecked = filters.categories.includes(category);
                  
                  return (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          const newCategories = checked
                            ? [...filters.categories, category]
                            : filters.categories.filter(c => c !== category);
                          updateFilters({ categories: newCategories });
                        }}
                      />
                      <label
                        htmlFor={`category-${category}`}
                        className="text-sm text-text-primary cursor-pointer flex-1"
                      >
                        {category}
                      </label>
                    </div>
                  );
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
          <Separator />
        </>
      )}

      {/* 价格范围 */}
      <div className="space-y-4">
        <h3 className="font-semibold text-text-primary flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          价格范围
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">¥{filters.priceRange[0]}</span>
            <span className="text-text-secondary">¥{filters.priceRange[1]}</span>
          </div>
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
            max={10000}
            min={0}
            step={100}
            className="w-full"
          />
          <div className="flex items-center gap-2 text-sm">
            <Input
              type="number"
              value={filters.priceRange[0]}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                updateFilters({ 
                  priceRange: [value, filters.priceRange[1]] 
                });
              }}
              className="flex-1 h-8"
              placeholder="最低价"
            />
            <span className="text-text-secondary">-</span>
            <Input
              type="number"
              value={filters.priceRange[1]}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 10000;
                updateFilters({ 
                  priceRange: [filters.priceRange[0], value] 
                });
              }}
              className="flex-1 h-8"
              placeholder="最高价"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* 评分筛选 */}
      <div className="space-y-3">
        <h3 className="font-semibold text-text-primary flex items-center gap-2">
          <Star className="w-4 h-4" />
          最低评分
        </h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <input
                type="radio"
                id={`rating-${rating}`}
                name="rating"
                checked={filters.rating === rating}
                onChange={() => updateFilters({ rating })}
                className="w-4 h-4"
              />
              <label
                htmlFor={`rating-${rating}`}
                className="flex items-center gap-1 cursor-pointer text-sm"
              >
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-3 h-3",
                        i < rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      )}
                    />
                  ))}
                </div>
                <span className="text-text-secondary">及以上</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* 特色筛选 */}
      <div className="space-y-3">
        <h3 className="font-semibold text-text-primary flex items-center gap-2">
          <Award className="w-4 h-4" />
          特色筛选
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-status-success" />
              <span className="text-sm text-text-primary">认证供应商</span>
            </div>
            <Switch
              checked={filters.verified}
              onCheckedChange={(verified) => updateFilters({ verified })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-status-warning" />
              <span className="text-sm text-text-primary">热门产品</span>
            </div>
            <Switch
              checked={filters.trending}
              onCheckedChange={(trending) => updateFilters({ trending })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cloudsway-primary-500" />
              <span className="text-sm text-text-primary">精选推荐</span>
            </div>
            <Switch
              checked={filters.featured}
              onCheckedChange={(featured) => updateFilters({ featured })}
            />
          </div>
        </div>
      </div>

      {/* 高级筛选 */}
      <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h3 className="font-semibold text-text-primary flex items-center gap-2">
            <Settings2 className="w-4 h-4" />
            高级筛选
          </h3>
          {isAdvancedOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 space-y-6">
          <Separator />
          
          {/* 响应时间 */}
          <div className="space-y-3">
            <h4 className="font-medium text-text-primary flex items-center gap-2">
              <Clock className="w-4 h-4" />
              最大响应时间 (秒)
            </h4>
            <Slider
              value={[filters.responseTime]}
              onValueChange={([value]) => updateFilters({ responseTime: value })}
              max={60}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="text-sm text-text-secondary text-center">
              {filters.responseTime === 0 ? '不限制' : `${filters.responseTime}秒内`}
            </div>
          </div>

          {/* 成功率 */}
          <div className="space-y-3">
            <h4 className="font-medium text-text-primary flex items-center gap-2">
              <Target className="w-4 h-4" />
              最低成功率 (%)
            </h4>
            <Slider
              value={[filters.successRate]}
              onValueChange={([value]) => updateFilters({ successRate: value })}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
            <div className="text-sm text-text-secondary text-center">
              {filters.successRate === 0 ? '不限制' : `${filters.successRate}%以上`}
            </div>
          </div>

          {/* 标签筛选 */}
          {availableTags.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-text-primary">热门标签</h4>
              <div className="flex flex-wrap gap-2">
                {availableTags.slice(0, 12).map((tag) => {
                  const isSelected = filters.tags.includes(tag);
                  
                  return (
                    <button
                      key={tag}
                      onClick={() => {
                        const newTags = isSelected
                          ? filters.tags.filter(t => t !== tag)
                          : [...filters.tags, tag];
                        updateFilters({ tags: newTags });
                      }}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs border transition-all",
                        isSelected
                          ? "bg-gradient-primary text-white border-cloudsway-primary-500"
                          : "bg-background-card text-text-secondary border-border-primary hover:border-border-accent"
                      )}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );

  return (
    <TooltipProvider>
      <div className={cn("space-y-4", className)}>
        {/* 搜索栏 */}
        <Card className="border-border-primary bg-background-glass backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <Input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSearch();
                    }
                    if (e.key === 'Escape') {
                      setShowSuggestions(false);
                    }
                  }}
                  placeholder="搜索AI解决方案、专家模块、市场报告..."
                  className="pl-10 pr-4 h-12 text-base"
                />
                {renderSearchSuggestions()}
              </div>
              
              <Button
                onClick={() => handleSearch()}
                size="lg"
                className="px-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <Search className="w-5 h-5" />
                )}
                <span className="ml-2 hidden sm:inline">搜索</span>
              </Button>
              
              {/* 移动端过滤器按钮 */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="lg" className="lg:hidden relative">
                    <Filter className="w-5 h-5" />
                    {activeFiltersCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                      >
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0">
                  <SheetHeader className="p-6 bg-gradient-primary text-white">
                    <SheetTitle className="text-white">搜索过滤器</SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto p-6">
                    {renderFilterContent()}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            
            {/* 排序和视图选项 */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-primary">
              <div className="flex items-center gap-4">
                <Select
                  value={filters.sortBy}
                  onValueChange={(value: SortOption) => updateFilters({ sortBy: value })}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="排序方式" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateFilters({ 
                    sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
                  })}
                >
                  {filters.sortOrder === 'asc' ? (
                    <SortAsc className="w-4 h-4" />
                  ) : (
                    <SortDesc className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* 搜索统计 */}
              {showStats && stats && (
                <div className="flex items-center gap-4 text-sm text-text-secondary">
                  <span>共 {stats.totalResults.toLocaleString()} 个结果</span>
                  {stats.averagePrice > 0 && (
                    <span>均价 ¥{stats.averagePrice.toFixed(0)}</span>
                  )}
                  {stats.averageRating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{stats.averageRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* 活跃过滤器标签 */}
            {renderActiveFilters()}
          </CardContent>
        </Card>

        <div className="flex gap-6">
          {/* 桌面端过滤器面板 */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <Card className="sticky top-24 border-border-primary bg-background-glass backdrop-blur-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    筛选条件
                  </CardTitle>
                  {activeFiltersCount > 0 && (
                    <Badge variant="outline">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="max-h-[calc(100vh-200px)] overflow-y-auto">
                {renderFilterContent()}
              </CardContent>
            </Card>
          </div>

          {/* 搜索结果内容区域 */}
          <div className="flex-1 min-w-0">
            {/* 这里将显示搜索结果内容 */}
            <div className="text-center py-12 text-text-secondary">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>搜索结果将在这里显示</p>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default SearchAndFilter;