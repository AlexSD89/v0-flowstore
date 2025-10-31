"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  Star, 
  Users, 
  Zap, 
  Brain, 
  ShoppingCart,
  ArrowRight,
  Sparkles,
  Clock,
  DollarSign
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Recommendation {
  id: string;
  type: 'workforce' | 'expert_module' | 'market_report';
  title: string;
  provider: string;
  description: string;
  price: string;
  rating: number;
  users: number;
  trend: 'up' | 'hot' | 'new';
  icon: any;
  color: string;
}

const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: '1',
    type: 'workforce',
    title: 'AI客服助手',
    provider: 'TechFlow',
    description: '24/7智能客服，支持多语言对话',
    price: '¥299/月',
    rating: 4.8,
    users: 1240,
    trend: 'hot',
    icon: Users,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: '2',
    type: 'expert_module',
    title: '合同智能审查',
    provider: '法律科技',
    description: '专业律师经验沉淀，秒级合同风险识别',
    price: '¥1,899/月',
    rating: 4.9,
    users: 856,
    trend: 'up',
    icon: Brain,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: '3',
    type: 'market_report',
    title: '2024 AI医疗行业报告',
    provider: '智研咨询',
    description: '深度分析AI在医疗领域的应用前景',
    price: '¥3,999',
    rating: 4.7,
    users: 423,
    trend: 'new',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: '4',
    type: 'workforce',
    title: '智能数据分析',
    provider: 'DataMind',
    description: '自动化数据清洗与可视化分析',
    price: '¥599/月',
    rating: 4.6,
    users: 967,
    trend: 'up',
    icon: Zap,
    color: 'from-orange-500 to-red-500'
  }
];

const TRENDING_KEYWORDS = [
  '智能客服', 'RPA自动化', '数据分析', '合同审查', 
  '风险管控', '用户画像', '推荐系统', 'NLP处理'
];

interface DynamicRecommendationsProps {
  className?: string;
}

export function DynamicRecommendations({ className }: DynamicRecommendationsProps) {
  const [currentRecommendations, setCurrentRecommendations] = useState(MOCK_RECOMMENDATIONS.slice(0, 3));
  const [activeKeyword, setActiveKeyword] = useState(0);

  // 轮播推荐内容
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRecommendations(prev => {
        const startIndex = Math.floor(Math.random() * MOCK_RECOMMENDATIONS.length);
        return MOCK_RECOMMENDATIONS.slice(startIndex, startIndex + 3);
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // 轮播热门关键词
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveKeyword(prev => (prev + 1) % TRENDING_KEYWORDS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'hot': return '🔥';
      case 'up': return '📈';
      case 'new': return '✨';
      default: return '';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'workforce': return 'AI劳动力';
      case 'expert_module': return '专家模块';
      case 'market_report': return '市场报告';
      default: return '';
    }
  };

  return (
    <div className={cn("w-full max-w-sm", className)}>
      {/* 头部标题 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-cloudsway-primary-400" />
          <h3 className="text-lg font-semibold text-white">智能推荐</h3>
        </div>
        <p className="text-sm text-slate-400">
          基于您的浏览偏好和行业趋势
        </p>
      </motion.div>

      {/* 热门关键词轮播 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6 p-4 rounded-xl bg-slate-800/40 border border-slate-700/30"
      >
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-medium text-white">热门搜索</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeKeyword}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-cloudsway-primary-400 font-medium"
          >
            #{TRENDING_KEYWORDS[activeKeyword]}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* 推荐产品列表 */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {currentRecommendations.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="group relative p-4 rounded-xl bg-slate-800/50 border border-slate-700/30 hover:border-slate-600/50 hover:bg-slate-800/70 transition-all cursor-pointer"
            >
              {/* 趋势标签 */}
              <div className="absolute -top-1 -right-1 text-xs">
                {getTrendIcon(item.trend)}
              </div>

              {/* 产品类型标签 */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs px-2 py-1 rounded-full bg-slate-700/50 text-slate-300">
                  {getTypeLabel(item.type)}
                </span>
                <div className="flex items-center gap-1 text-xs text-yellow-400">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{item.rating}</span>
                </div>
              </div>

              {/* 产品信息 */}
              <div className="mb-3">
                <h4 className="font-medium text-white text-sm mb-1 group-hover:text-cloudsway-primary-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 mb-2 line-clamp-2">
                  {item.description}
                </p>
                <div className="text-xs text-slate-500">
                  by {item.provider}
                </div>
              </div>

              {/* 底部信息 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{item.users}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    <span className="font-medium text-cloudsway-accent-400">{item.price}</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cloudsway-primary-400 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 查看更多按钮 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6"
      >
        <Button
          variant="outline"
          className="w-full text-sm border-slate-600/50 text-slate-300 hover:border-cloudsway-primary-500/50 hover:text-cloudsway-primary-300"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          浏览全部产品
        </Button>
      </motion.div>

      {/* 实时统计 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 p-4 rounded-xl bg-gradient-to-r from-cloudsway-primary-500/10 to-cloudsway-accent-500/10 border border-cloudsway-primary-500/20"
      >
        <div className="text-center">
          <div className="text-lg font-bold text-white mb-1">2,847</div>
          <div className="text-xs text-slate-400 mb-2">今日AI解决方案咨询</div>
          <div className="flex items-center justify-center gap-1 text-xs text-green-400">
            <Clock className="w-3 h-3" />
            <span>实时更新</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}