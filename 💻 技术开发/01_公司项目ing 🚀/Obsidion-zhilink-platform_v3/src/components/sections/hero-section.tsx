"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Users,
  Shield,
  Zap
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAuthStore, useUIStore } from "@/stores";

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useUIStore();

  const [isAnimating, setIsAnimating] = useState(false);

  const handleStartAnalysis = () => {
    setIsAnimating(true);

    if (!isAuthenticated) {
      addToast({
        type: 'info',
        title: '需要登录',
        message: '请先登录以开始AI协作分析'
      });
      setTimeout(() => setIsAnimating(false), 1000);
      return;
    }

    // 导航到协作分析页面
    router.push('/chat');
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleExploreProducts = () => {
    router.push('/market');
  };

  return (
    <section className={cn("relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900", className)}>
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-96 h-96 rounded-full bg-cloudsway-primary-500/10 blur-3xl top-20 left-20" />
        <div className="absolute w-96 h-96 rounded-full bg-cloudsway-accent-500/8 blur-3xl bottom-20 right-20" />
      </div>

      {/* 主要内容 */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* 左侧内容区域 */}
          <div className="space-y-8">
            {/* 导航式介绍 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>LaunchX 智链平台</span>
                </div>
                <div className="w-1 h-1 bg-slate-600 rounded-full" />
                <span>AI时代企业转型伙伴</span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold text-white">
                <span className="bg-gradient-to-r from-cloudsway-primary-400 to-cloudsway-secondary-400 bg-clip-text text-transparent">智能推荐</span><br />
                <span className="text-white">精准匹配</span><br />
                <span className="bg-gradient-to-r from-cloudsway-accent-400 to-cloudsway-primary-400 bg-clip-text text-transparent">加速转型</span>
              </h1>

              <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
                通过<strong className="text-cloudsway-primary-400">6角色AI专家团队协作</strong>，
                为法律、医疗、电商等行业企业提供个性化的AI解决方案推荐，
                <span className="text-cloudsway-accent-400 font-semibold">加速数字化转型进程</span>。
              </p>
            </motion.div>

            {/* 行动按钮 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                onClick={handleStartAnalysis}
                className="bg-cloudsway-primary-600 hover:bg-cloudsway-primary-700 text-white px-8 py-3 text-lg"
                disabled={isAnimating}
              >
                {isAnimating ? (
                  <>
                    <Brain className="w-5 h-5 mr-2 animate-pulse" />
                    启动中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    开始AI协作分析
                  </>
                )}
              </Button>

              <Button
                onClick={handleExploreProducts}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-3 text-lg"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                浏览AI产品
              </Button>
            </motion.div>

            {/* 信任指标 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="flex items-center justify-start gap-8 text-sm text-slate-400"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span>企业级安全认证</span>
              </div>

              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cloudsway-primary-400" />
                <span>500+企业信赖</span>
              </div>

              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cloudsway-accent-400" />
                <span>24/7智能服务</span>
              </div>
            </motion.div>
          </div>

          {/* 右侧：产品展示区域 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-6"
          >
            {/* AI劳动力 */}
            <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm hover:scale-105 transition-all cursor-pointer group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-cloudsway-primary-600/20 border border-cloudsway-primary-500/30 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-cloudsway-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI劳动力</h3>
                  <p className="text-sm text-cloudsway-primary-400">200+ 即用能力</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 mb-4">
                即插即用的AI能力服务，覆盖客服、分析、创作等多个场景。
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">热门推荐</span>
                <ArrowRight className="w-4 h-4 text-cloudsway-primary-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 专家模块 */}
            <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm hover:scale-105 transition-all cursor-pointer group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-cloudsway-accent-600/20 border border-cloudsway-accent-500/30 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-cloudsway-accent-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">专家模块</h3>
                  <p className="text-sm text-cloudsway-accent-400">80+ 专业策略</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 mb-4">
                行业专家的方法论与策略模块，提供专业指导和决策支持。
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">精选推荐</span>
                <ArrowRight className="w-4 h-4 text-cloudsway-accent-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}