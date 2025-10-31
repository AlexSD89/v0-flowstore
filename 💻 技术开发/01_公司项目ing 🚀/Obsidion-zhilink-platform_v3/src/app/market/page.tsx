"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
} from "lucide-react";
import { motion } from "framer-motion";
import type { ProductData, SearchFilters, ProductType, SortOption } from "@/types";

// 模拟产品数据
const generateMockProducts = (): ProductData[] => [
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
  {
    id: "product-2", 
    name: "DataMind 商业智能分析",
    description: "专为中小企业设计的数据分析平台，无需编程即可创建专业的数据报表和商业洞察。",
    type: "expert_module",
    vendor: {
      id: "vendor-2",
      name: "DataVision Inc",
      avatar: "/images/vendors/datavision.jpg", 
      verified: true,
      rating: 4.6,
    },
    pricing: {
      model: "subscription",
      basePrice: 899,
      currency: "CNY",
      period: "月",
      tierName: "商业版",
      commissionRate: 20,
    },
    capabilities: [
      "数据可视化", "报表生成", "预测分析", "实时监控", "自定义仪表盘"
    ],
    metrics: {
      rating: 4.6,
      reviewCount: 89,
      userCount: 876,
      successRate: 88,
      responseTime: "<5秒",
      uptime: 99.5,
    },
    tags: ["数据分析", "商业智能", "报表", "可视化"],
    featured: true,
    trending: false,
    status: "active",
    lastUpdated: new Date("2024-01-08"),
    thumbnail: "/images/products/datamind.jpg",
    category: "数据分析",
    compatibility: ["Web", "Excel", "API"],
  },
  {
    id: "product-3",
    name: "法务AI助手专业版",
    description: "专为法律行业打造的AI助手，提供合同审查、法条检索、案例分析等专业服务。",
    type: "workforce",
    vendor: {
      id: "vendor-3",
      name: "LegalTech Solutions",
      avatar: "/images/vendors/legaltech.jpg",
      verified: true,
      rating: 4.9,
    },
    pricing: {
      model: "subscription",
      basePrice: 1999,
      currency: "CNY", 
      period: "月",
      tierName: "专业版",
      commissionRate: 25,
    },
    capabilities: [
      "合同审查", "法条检索", "案例分析", "风险评估", "文档生成"
    ],
    metrics: {
      rating: 4.9,
      reviewCount: 234,
      userCount: 1540,
      successRate: 95,
      responseTime: "<3秒",
      uptime: 99.8,
    },
    tags: ["法律", "合同", "审查", "AI助手"],
    featured: true,
    trending: true,
    status: "active", 
    lastUpdated: new Date("2024-01-12"),
    thumbnail: "/images/products/legal-ai.jpg",
    category: "法律服务",
    compatibility: ["Web", "移动端", "Office"],
  },
  {
    id: "product-4",
    name: "医疗AI诊断报告",
    description: "基于深度学习的医疗影像分析报告，涵盖心血管、肺部、骨科等多个专科领域。",
    type: "market_report",
    vendor: {
      id: "vendor-4", 
      name: "MedAI Research",
      avatar: "/images/vendors/medai.jpg",
      verified: true,
      rating: 4.7,
    },
    pricing: {
      model: "one_time",
      basePrice: 4999,
      currency: "CNY",
      tierName: "完整报告",
      commissionRate: 30,
    },
    capabilities: [
      "影像分析", "疾病诊断", "风险评估", "治疗建议", "数据统计"
    ],
    metrics: {
      rating: 4.7,
      reviewCount: 67,
      userCount: 456,
      successRate: 91,
      responseTime: "<10秒",
      uptime: 99.3,
    },
    tags: ["医疗", "诊断", "AI分析", "报告"],
    featured: false,
    trending: true,
    status: "active",
    lastUpdated: new Date("2024-01-05"),
    thumbnail: "/images/products/medical-ai.jpg", 
    category: "医疗健康",
    compatibility: ["DICOM", "Web", "PDF"],
  },
  {
    id: "product-5",
    name: "E-commerce智能推荐引擎",
    description: "为电商平台提供个性化商品推荐，基于用户行为和商品特征进行智能匹配。",
    type: "workforce",
    vendor: {
      id: "vendor-5",
      name: "RecommendAI",
      avatar: "/images/vendors/recommendai.jpg",
      verified: true,
      rating: 4.5,
    },
    pricing: {
      model: "usage_based",
      basePrice: 0.05,
      currency: "CNY",
      period: "每次调用",
      tierName: "按量付费",
      commissionRate: 18,
    },
    capabilities: [
      "个性化推荐", "行为分析", "A/B测试", "实时优化", "多场景适配"
    ],
    metrics: {
      rating: 4.5,
      reviewCount: 198,
      userCount: 3240,
      successRate: 87,
      responseTime: "<1秒",
      uptime: 99.7,
    },
    tags: ["电商", "推荐系统", "个性化", "机器学习"],
    featured: false,
    trending: false,
    status: "active",
    lastUpdated: new Date("2024-01-07"),
    thumbnail: "/images/products/ecommerce-ai.jpg",
    category: "电子商务",
    compatibility: ["REST API", "SDK", "Webhook"],
  },
  {
    id: "product-6",
    name: "金融风控专家模块",
    description: "专业的金融风险控制知识模块，包含信贷风控、反欺诈、合规检查等核心能力。",
    type: "expert_module",
    vendor: {
      id: "vendor-6",
      name: "FinRisk Pro",
      avatar: "/images/vendors/finrisk.jpg",
      verified: true,
      rating: 4.8,
    },
    pricing: {
      model: "subscription",
      basePrice: 1299,
      currency: "CNY",
      period: "月",
      tierName: "企业版",
      commissionRate: 22,
    },
    capabilities: [
      "信贷评估", "反欺诈检测", "合规检查", "风险建模", "实时监控"
    ],
    metrics: {
      rating: 4.8,
      reviewCount: 145,
      userCount: 987,
      successRate: 94,
      responseTime: "<2秒",
      uptime: 99.6,
    },
    tags: ["金融", "风控", "反欺诈", "合规"],
    featured: true,
    trending: false,
    status: "active",
    lastUpdated: new Date("2024-01-09"),
    thumbnail: "/images/products/finrisk.jpg",
    category: "金融科技",
    compatibility: ["API", "SDK", "数据库"],
  }
];

export default function MarketPage() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<ProductType | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [cartItems, setCartItems] = useState<Set<string>>(new Set());

  // 模拟数据加载
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProducts(generateMockProducts());
      setLoading(false);
    };
    
    loadProducts();
  }, []);

  // 筛选和排序产品
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = activeTab === "all" || product.type === activeTab;
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price_low":
          return a.pricing.basePrice - b.pricing.basePrice;
        case "price_high":
          return b.pricing.basePrice - a.pricing.basePrice;
        case "rating":
          return b.metrics.rating - a.metrics.rating;
        case "popularity":
          return b.metrics.userCount - a.metrics.userCount;
        case "newest":
          return b.lastUpdated.getTime() - a.lastUpdated.getTime();
        case "trending":
          return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
        default:
          return 0;
      }
    });

  // 获取产品类型图标和标题
  const getProductTypeInfo = (type: ProductType) => {
    switch (type) {
      case "workforce":
        return { icon: Bot, title: "AI劳动力", description: "即插即用的AI能力服务" };
      case "expert_module":
        return { icon: BarChart3, title: "专家模块", description: "专业知识和策略模块" };
      case "market_report":
        return { icon: FileText, title: "市场报告", description: "深度行业分析报告" };
      default:
        return { icon: Sparkles, title: "全部产品", description: "所有AI解决方案" };
    }
  };

  // 添加到收藏
  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  // 添加到购物车
  const toggleCart = (productId: string) => {
    setCartItems(prev => {
      const newCart = new Set(prev);
      if (newCart.has(productId)) {
        newCart.delete(productId);
      } else {
        newCart.add(productId);
      }
      return newCart;
    });
  };

  // 格式化价格
  const formatPrice = (pricing: ProductData["pricing"]) => {
    if (pricing.model === "usage_based") {
      return `¥${pricing.basePrice}/${pricing.period}`;
    }
    return `¥${pricing.basePrice}/${pricing.period || "次"}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* 返回按钮 */}
      <div className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-cloudsway-primary-400" />
            AI能力市场
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            发现最适合您业务需求的AI解决方案，让智能化转型更加简单高效
          </p>
        </div>

        {/* 搜索和筛选栏 */}
        <div className="mb-8">
          <Card className="p-6 bg-slate-800/50 border-slate-700/50">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* 搜索框 */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索AI产品、功能或标签..."
                  className="pl-10 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400"
                />
              </div>

              {/* 排序选择 */}
              <div className="flex gap-3">
                <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                  <SelectTrigger className="w-48 bg-slate-700/50 border-slate-600/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">相关度</SelectItem>
                    <SelectItem value="price_low">价格从低到高</SelectItem>
                    <SelectItem value="price_high">价格从高到低</SelectItem>
                    <SelectItem value="rating">评分最高</SelectItem>
                    <SelectItem value="popularity">最受欢迎</SelectItem>
                    <SelectItem value="newest">最新上架</SelectItem>
                    <SelectItem value="trending">热门趋势</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="border-slate-600/50 text-slate-300">
                  <Filter className="w-4 h-4 mr-2" />
                  筛选
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* 产品类型标签页 */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ProductType | "all")} className="mb-8">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="all" className="data-[state=active]:bg-cloudsway-primary-600">
              全部产品
            </TabsTrigger>
            <TabsTrigger value="workforce" className="data-[state=active]:bg-cloudsway-primary-600">
              AI劳动力
            </TabsTrigger>
            <TabsTrigger value="expert_module" className="data-[state=active]:bg-cloudsway-primary-600">
              专家模块
            </TabsTrigger>
            <TabsTrigger value="market_report" className="data-[state=active]:bg-cloudsway-primary-600">
              市场报告
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {/* 统计信息 */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-slate-400">
                找到 <span className="text-white font-semibold">{filteredProducts.length}</span> 个相关产品
              </div>
              
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {favorites.size} 个收藏
                </div>
                <div className="flex items-center gap-1">
                  <ShoppingCart className="w-4 h-4" />
                  {cartItems.size} 个已选择
                </div>
              </div>
            </div>

            {/* 产品网格 */}
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="p-6 bg-slate-800/50 border-slate-700/50 animate-pulse">
                    <div className="h-40 bg-slate-700/50 rounded-lg mb-4" />
                    <div className="h-4 bg-slate-700/50 rounded mb-2" />
                    <div className="h-3 bg-slate-700/50 rounded w-2/3" />
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="p-6 bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300 group">
                      {/* 产品缩略图 */}
                      <div className="relative h-40 bg-slate-700/30 rounded-lg mb-4 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-cloudsway-primary-500/20 to-cloudsway-secondary-500/20" />
                        <div className="absolute top-3 left-3">
                          <Badge
                            variant={product.type === "workforce" ? "default" : 
                              product.type === "expert_module" ? "secondary" : "outline"}
                            className="text-xs"
                          >
                            {getProductTypeInfo(product.type).title}
                          </Badge>
                        </div>
                        
                        {/* 功能标签 */}
                        <div className="absolute top-3 right-3 flex flex-col gap-1">
                          {product.featured && (
                            <Badge variant="outline" className="text-xs bg-yellow-500/20 border-yellow-500/50 text-yellow-400">
                              精选
                            </Badge>
                          )}
                          {product.trending && (
                            <Badge variant="outline" className="text-xs bg-red-500/20 border-red-500/50 text-red-400">
                              热门
                            </Badge>
                          )}
                        </div>

                        {/* 产品图标 */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          {(() => {
                            const { icon: TypeIcon } = getProductTypeInfo(product.type);
                            return <TypeIcon className="w-16 h-16 text-slate-400 group-hover:text-cloudsway-primary-400 transition-colors" />;
                          })()}
                        </div>
                      </div>

                      {/* 产品信息 */}
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-white text-lg mb-1 group-hover:text-cloudsway-primary-400 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-slate-400 text-sm line-clamp-2">
                            {product.description}
                          </p>
                        </div>

                        {/* 供应商信息 */}
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={product.vendor.avatar} alt={product.vendor.name} />
                            <AvatarFallback className="text-xs">
                              {product.vendor.name.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-slate-400 text-sm">{product.vendor.name}</span>
                          {product.vendor.verified && (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          )}
                        </div>

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

                        {/* 价格和操作 */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-400" />
                            <span className="text-white font-semibold">
                              {formatPrice(product.pricing)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleFavorite(product.id)}
                              className={`p-2 ${
                                favorites.has(product.id)
                                  ? "text-red-400 hover:text-red-300"
                                  : "text-slate-400 hover:text-red-400"
                              }`}
                            >
                              <Heart className={`w-4 h-4 ${favorites.has(product.id) ? "fill-current" : ""}`} />
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleCart(product.id)}
                              className={`p-2 ${
                                cartItems.has(product.id)
                                  ? "text-cloudsway-primary-400"
                                  : "text-slate-400"
                              }`}
                            >
                              <ShoppingCart className={`w-4 h-4 ${cartItems.has(product.id) ? "fill-current" : ""}`} />
                            </Button>

                            <Link href={`/product/${product.id}`}>
                              <Button size="sm" className="bg-cloudsway-primary-600 hover:bg-cloudsway-primary-700">
                                <ExternalLink className="w-4 h-4 mr-1" />
                                查看
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* 空状态 */}
            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">未找到相关产品</h3>
                <p className="text-slate-400 mb-4">
                  尝试调整搜索关键词或筛选条件
                </p>
                <Button onClick={() => {
                  setSearchQuery("");
                  setActiveTab("all");
                  setSortBy("relevance");
                }}>
                  重置筛选条件
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* 推荐和推广信息 */}
        {cartItems.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Card className="p-4 bg-cloudsway-primary-600 border-cloudsway-primary-500 text-white shadow-2xl">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5" />
                <div>
                  <div className="font-medium">已选择 {cartItems.size} 个产品</div>
                  <div className="text-sm opacity-90">点击查看详情或开始对比</div>
                </div>
                <Button size="sm" variant="secondary" className="ml-2">
                  查看详情
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}