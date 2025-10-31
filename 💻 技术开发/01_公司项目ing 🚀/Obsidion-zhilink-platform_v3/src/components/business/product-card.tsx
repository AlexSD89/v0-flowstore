import * as React from "react";
import { motion } from "framer-motion";
import { Star, Heart, ExternalLink, Zap, Brain, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface Product {
  id: string;
  name: string;
  description: string;
  type: 'workforce' | 'expert_module' | 'market_report';
  vendor: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  rating: {
    score: number;
    count: number;
  };
  pricing: {
    model: 'subscription' | 'usage' | 'one_time';
    amount: number;
    currency: string;
    unit?: string;
  };
  metrics: {
    accuracy?: number;
    responseTime?: string;
    languages?: number;
    availability?: string;
  };
  image?: string;
  tags: string[];
}

export interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'detailed';
  showActions?: boolean;
  onFavorite?: (productId: string) => void;
  onView?: (productId: string) => void;
  className?: string;
}

const getProductTypeConfig = (type: Product['type']) => {
  const configs = {
    workforce: {
      name: 'AI劳动力',
      color: 'rgb(59 130 246)',
      bgColor: 'rgb(59 130 246 / 0.05)',
      borderColor: 'rgb(59 130 246 / 0.2)',
      icon: Zap,
      gradient: 'from-blue-500 to-blue-700'
    },
    expert_module: {
      name: '专家模块',
      color: 'rgb(139 92 246)',
      bgColor: 'rgb(139 92 246 / 0.05)',
      borderColor: 'rgb(139 92 246 / 0.2)',
      icon: Brain,
      gradient: 'from-purple-500 to-purple-700'
    },
    market_report: {
      name: '市场报告',
      color: 'rgb(16 185 129)',
      bgColor: 'rgb(16 185 129 / 0.05)',
      borderColor: 'rgb(16 185 129 / 0.2)',
      icon: FileText,
      gradient: 'from-green-500 to-green-700'
    }
  };
  return configs[type];
};

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({ 
    product, 
    variant = 'default',
    showActions = true,
    onFavorite,
    onView,
    className 
  }, ref) => {
    const [isFavorited, setIsFavorited] = React.useState(false);
    const typeConfig = getProductTypeConfig(product.type);
    const Icon = typeConfig.icon;
    
    const handleFavorite = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsFavorited(!isFavorited);
      onFavorite?.(product.id);
    };
    
    const handleView = () => {
      onView?.(product.id);
    };
    
    return (
      <motion.div
        ref={ref}
        className={cn(
          "group relative overflow-hidden rounded-xl border border-border-primary bg-background-card backdrop-blur-xl transition-all duration-300",
          "hover:border-border-accent hover:shadow-xl hover:shadow-black/10",
          "hover:-translate-y-1 cursor-pointer",
          className
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleView}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Product Header */}
        <div className="relative h-48">
          {/* Product Type Badge */}
          <div className="absolute left-4 top-4 z-10">
            <Badge 
              variant="primary" 
              className="text-xs"
              style={{ 
                color: typeConfig.color,
                backgroundColor: typeConfig.bgColor,
                borderColor: typeConfig.borderColor
              }}
            >
              {typeConfig.name}
            </Badge>
          </div>
          
          {/* Favorite Button */}
          <button
            className={cn(
              "absolute right-4 top-4 z-10 p-2 rounded-full transition-all",
              "bg-white/10 backdrop-blur-sm hover:bg-white/20",
              isFavorited ? "text-red-400 bg-red-400/20" : "text-white/60 hover:text-white"
            )}
            onClick={handleFavorite}
          >
            <Heart className={cn("w-4 h-4", isFavorited && "fill-current")} />
          </button>
          
          {/* Product Image/Icon */}
          <div 
            className={cn(
              "h-full overflow-hidden bg-gradient-to-br relative",
              typeConfig.gradient
            )}
          >
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Icon className="w-16 h-16 text-white/80" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
          </div>
        </div>
        
        {/* Product Content */}
        <div className="p-6">
          {/* Rating and Vendor */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 text-sm font-medium">{product.rating.score}</span>
                <span className="ml-1 text-xs text-text-muted">
                  ({product.rating.count})
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <img 
                src={product.vendor.avatar} 
                alt={product.vendor.name}
                className="h-6 w-6 rounded-full"
              />
              <span className="text-xs text-text-muted">{product.vendor.name}</span>
              {product.vendor.verified && (
                <div className="w-4 h-4 bg-cloudsway-success rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </div>
          </div>
          
          {/* Product Name and Description */}
          <h3 className="mb-2 text-lg font-semibold text-text-primary line-clamp-2">
            {product.name}
          </h3>
          
          <p className="mb-4 text-sm text-text-secondary line-clamp-3">
            {product.description}
          </p>
          
          {/* Core Metrics */}
          <div className="mb-4 grid grid-cols-3 gap-3">
            {product.metrics.accuracy && (
              <div className="text-center">
                <div 
                  className="text-lg font-bold mb-1"
                  style={{ color: typeConfig.color }}
                >
                  {product.metrics.accuracy}%
                </div>
                <div className="text-xs text-text-muted">准确率</div>
              </div>
            )}
            
            {product.metrics.responseTime && (
              <div className="text-center">
                <div 
                  className="text-lg font-bold mb-1"
                  style={{ color: typeConfig.color }}
                >
                  {product.metrics.responseTime}
                </div>
                <div className="text-xs text-text-muted">响应时间</div>
              </div>
            )}
            
            {product.metrics.languages && (
              <div className="text-center">
                <div 
                  className="text-lg font-bold mb-1"
                  style={{ color: typeConfig.color }}
                >
                  {product.metrics.languages}+
                </div>
                <div className="text-xs text-text-muted">语言支持</div>
              </div>
            )}
          </div>
          
          {/* Price and Actions */}
          <div className="flex items-center justify-between">
            <div className="pricing">
              <span className="text-lg font-bold">
                {product.pricing.currency === 'USD' ? '$' : '¥'}{product.pricing.amount}
              </span>
              {product.pricing.unit && (
                <span className="text-sm text-text-muted">
                  /{product.pricing.unit}
                </span>
              )}
            </div>
            
            {showActions && (
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle external link
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm"
                  style={{ backgroundColor: typeConfig.color }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView();
                  }}
                >
                  立即试用
                </Button>
              </div>
            )}
          </div>
          
          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1">
              {product.tags.slice(0, 3).map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  size="sm"
                  className="text-xs"
                >
                  {tag}
                </Badge>
              ))}
              {product.tags.length > 3 && (
                <Badge variant="secondary" size="sm" className="text-xs">
                  +{product.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  }
);

ProductCard.displayName = "ProductCard";

export { ProductCard };