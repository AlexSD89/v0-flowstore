"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { 
  Star, 
  Users, 
  TrendingUp, 
  Share2, 
  ShoppingCart, 
  Eye,
  MoreVertical,
  ExternalLink,
  Heart,
  Bookmark,
  Calendar,
  DollarSign,
  Award,
  Zap,
  Shield,
  CheckCircle2
} from 'lucide-react';

import { cn } from "@/lib/utils";

// 产品类型定义
export type ProductType = 'workforce' | 'expert_module' | 'market_report';
export type PricingModel = 'subscription' | 'one_time' | 'usage_based' | 'freemium';
export type UserRole = 'buyer' | 'vendor' | 'distributor';

// 产品数据接口
export interface ProductData {
  id: string;
  name: string;
  description: string;
  type: ProductType;
  vendor: {
    id: string;
    name: string;
    avatar?: string;
    verified: boolean;
    rating: number;
  };
  pricing: {
    model: PricingModel;
    basePrice: number;
    currency: string;
    period?: string;
    tierName?: string;
    commissionRate?: number;
  };
  capabilities: string[];
  metrics: {
    rating: number;
    reviewCount: number;
    userCount: number;
    successRate?: number;
    responseTime?: string;
    uptime?: number;
  };
  tags: string[];
  featured: boolean;
  trending: boolean;
  status: 'active' | 'beta' | 'coming_soon';
  lastUpdated: Date;
  thumbnail?: string;
  category: string;
  compatibility: string[];
}

// 组件属性
export interface ProductCardProps {
  product: ProductData;
  userRole: UserRole;
  compact?: boolean;
  showDistribution?: boolean;
  onAddToCart?: (productId: string) => void;
  onShare?: (product: ProductData) => void;
  onFavorite?: (productId: string) => void;
  onViewDetails?: (productId: string) => void;
  onDistribute?: (productId: string) => void;
  className?: string;
}

// 产品类型映射
const productTypeConfig = {
  workforce: {
    color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    icon: '🤖',
    label: 'AI劳动力',
    description: '即用型AI能力'
  },
  expert_module: {
    color: 'bg-gradient-to-br from-purple-500 to-pink-500',
    icon: '🧠',
    label: '专家模块',
    description: '专业知识模块'
  },
  market_report: {
    color: 'bg-gradient-to-br from-emerald-500 to-teal-500',
    icon: '📊',
    label: '市场报告',
    description: '行业洞察分析'
  }
};

// 定价模型映射
const pricingModelConfig = {
  subscription: { label: '订阅制', icon: '🔄' },
  one_time: { label: '买断制', icon: '💰' },
  usage_based: { label: '按量付费', icon: '📊' },
  freemium: { label: '免费增值', icon: '🎁' }
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  userRole,
  compact = false,
  showDistribution = false,
  onAddToCart,
  onShare,
  onFavorite,
  onViewDetails,
  onDistribute,
  className
}) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const typeConfig = productTypeConfig[product.type];
  const pricingConfig = pricingModelConfig[product.pricing.model];

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    onFavorite?.(product.id);
  };

  const handleAddToCart = () => {
    onAddToCart?.(product.id);
  };

  const handleShare = () => {
    onShare?.(product);
  };

  const handleViewDetails = () => {
    onViewDetails?.(product.id);
  };

  const handleDistribute = () => {
    onDistribute?.(product.id);
  };

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -4 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={cn(
          "relative group",
          className
        )}
      >
        <Card className={cn(
          "h-full overflow-hidden transition-all duration-500",
          "border-border-primary bg-background-glass backdrop-blur-xl",
          "hover:border-border-accent hover:shadow-glow-primary",
          isHovered && "shadow-2xl",
          compact ? "max-w-sm" : "max-w-lg"
        )}>
          {/* 顶部标签区 */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
            {product.featured && (
              <Badge variant="default" className="bg-gradient-primary text-white">
                <Award className="w-3 h-3 mr-1" />
                精选
              </Badge>
            )}
            {product.trending && (
              <Badge variant="secondary" className="bg-gradient-secondary text-white">
                <TrendingUp className="w-3 h-3 mr-1" />
                热门
              </Badge>
            )}
            {product.status === 'beta' && (
              <Badge variant="outline" className="border-status-warning text-status-warning">
                Beta
              </Badge>
            )}
          </div>

          {/* 右上角操作菜单 */}
          <div className="absolute top-3 right-3 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 bg-background-glass backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleViewDetails}>
                  <Eye className="w-4 h-4 mr-2" />
                  查看详情
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  分享产品
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleFavorite}>
                  <Heart className={cn("w-4 h-4 mr-2", isFavorited && "fill-red-500 text-red-500")} />
                  {isFavorited ? '取消收藏' : '添加收藏'}
                </DropdownMenuItem>
                {(userRole === 'distributor' || showDistribution) && (
                  <DropdownMenuItem onClick={handleDistribute}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    分销产品
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <CardHeader className="pb-3">
            {/* 产品缩略图和类型 */}
            <div className="flex items-start gap-4">
              <div className={cn(
                "flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl",
                typeConfig.color
              )}>
                {typeConfig.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-text-primary truncate text-lg">
                    {product.name}
                  </h3>
                  {product.vendor.verified && (
                    <Tooltip>
                      <TooltipTrigger>
                        <CheckCircle2 className="w-5 h-5 text-status-success flex-shrink-0" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>认证供应商</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <Badge variant="outline" className="text-xs">
                  {typeConfig.label}
                </Badge>
              </div>
            </div>

            {/* 产品描述 */}
            {!compact && (
              <p className="text-text-secondary text-sm leading-relaxed mt-3 line-clamp-2">
                {product.description}
              </p>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {/* 供应商信息 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={product.vendor.avatar} />
                  <AvatarFallback className="text-xs bg-background-card">
                    {product.vendor.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-text-primary text-sm">
                    {product.vendor.name}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-text-secondary">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{product.vendor.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-text-primary">
                  {product.pricing.currency}{product.pricing.basePrice}
                  {product.pricing.period && (
                    <span className="text-xs text-text-secondary font-normal">
                      /{product.pricing.period}
                    </span>
                  )}
                </p>
                <p className="text-xs text-text-secondary">
                  {pricingConfig.icon} {pricingConfig.label}
                </p>
              </div>
            </div>

            {/* 关键指标 */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-text-primary">
                    {product.metrics.rating.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-text-secondary">{product.metrics.reviewCount} 评价</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1">
                  <Users className="w-4 h-4 text-cloudsway-secondary-500" />
                  <span className="font-semibold text-text-primary">
                    {product.metrics.userCount > 1000 ? 
                      `${(product.metrics.userCount / 1000).toFixed(1)}k` : 
                      product.metrics.userCount
                    }
                  </span>
                </div>
                <p className="text-xs text-text-secondary">用户</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1">
                  <Zap className="w-4 h-4 text-status-success" />
                  <span className="font-semibold text-text-primary">
                    {product.metrics.successRate ? `${product.metrics.successRate}%` : '99%'}
                  </span>
                </div>
                <p className="text-xs text-text-secondary">成功率</p>
              </div>
            </div>

            {/* 性能指标 */}
            {!compact && product.metrics.uptime && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary">运行时间</span>
                  <span className="text-sm font-medium text-text-primary">
                    {product.metrics.uptime}%
                  </span>
                </div>
                <Progress value={product.metrics.uptime} className="h-2" />
              </div>
            )}

            {/* 核心能力 */}
            {!compact && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-text-secondary">核心能力</p>
                <div className="flex flex-wrap gap-2">
                  {product.capabilities.slice(0, 3).map((capability, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-xs bg-agent-alex-bg text-agent-alex-primary border-agent-alex-border"
                    >
                      {capability}
                    </Badge>
                  ))}
                  {product.capabilities.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{product.capabilities.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* 分销信息 */}
            {(userRole === 'distributor' || showDistribution) && product.pricing.commissionRate && (
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      佣金比例
                    </span>
                  </div>
                  <span className="text-lg font-bold text-emerald-600">
                    {product.pricing.commissionRate}%
                  </span>
                </div>
                <p className="text-xs text-emerald-600/80 mt-1">
                  每笔成交可获得 ¥{(product.pricing.basePrice * (product.pricing.commissionRate / 100)).toFixed(2)} 佣金
                </p>
              </div>
            )}
          </CardContent>

          <Separator />

          <CardFooter className="pt-4">
            <div className="flex gap-3 w-full">
              {userRole === 'buyer' && (
                <>
                  <Button 
                    onClick={handleAddToCart}
                    className="flex-1"
                    variant="primary"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    加入购物车
                  </Button>
                  <Button 
                    onClick={handleViewDetails}
                    variant="outline"
                    size="icon"
                    className="flex-shrink-0"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </>
              )}

              {userRole === 'distributor' && (
                <>
                  <Button 
                    onClick={handleDistribute}
                    className="flex-1"
                    variant="primary"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    开始分销
                  </Button>
                  <Button 
                    onClick={handleViewDetails}
                    variant="outline"
                    size="icon"
                    className="flex-shrink-0"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </>
              )}

              {userRole === 'vendor' && (
                <>
                  <Button 
                    onClick={handleViewDetails}
                    className="flex-1"
                    variant="primary"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    查看详情
                  </Button>
                  <Button 
                    onClick={handleShare}
                    variant="outline"
                    size="icon"
                    className="flex-shrink-0"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </CardFooter>

          {/* 悬浮效果 */}
          <div className={cn(
            "absolute inset-0 rounded-2xl transition-all duration-500 pointer-events-none",
            "bg-gradient-to-br from-cloudsway-primary-500/5 via-transparent to-cloudsway-secondary-500/5",
            isHovered ? "opacity-100" : "opacity-0"
          )} />
        </Card>
      </motion.div>
    </TooltipProvider>
  );
};

export default ProductCard;