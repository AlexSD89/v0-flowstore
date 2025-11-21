"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Brain, 
  Sparkles, 
  Zap, 
  ShoppingCart, 
  MessageCircle,
  ArrowRight,
  Globe,
  Star,
  TrendingUp
} from 'lucide-react';

// 页面转场动画配置
export interface TransitionConfig {
  type: 'zoom_in' | 'slide_up' | 'morphing' | 'circular_reveal' | 'shared_element';
  duration: number;
  easing: string;
  centerPoint?: 'ai_expert_center' | 'search_bar' | 'product_card' | 'nav_button';
  stages?: Array<{
    stage: string;
    delay: number;
  }>;
  sharedElements?: string[];
  staggers?: {
    productCards?: number;
    filters?: number;
    searchBar?: number;
  };
}

// 转场类型映射
const TRANSITION_CONFIGS: Record<string, TransitionConfig> = {
  'landing_to_market': {
    type: 'slide_up',
    duration: 1200,
    easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    staggers: {
      productCards: 100,
      filters: 150,
      searchBar: 200
    }
  },
  'landing_to_chat': {
    type: 'circular_reveal',
    duration: 1500,
    easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    centerPoint: 'ai_expert_center',
    stages: [
      { stage: 'expert_activation', delay: 0 },
      { stage: 'chat_interface_reveal', delay: 800 },
      { stage: 'input_focus', delay: 1200 }
    ]
  },
  'card_to_detail': {
    type: 'shared_element',
    duration: 600,
    easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    sharedElements: [
      'product_image',
      'product_title',
      'price_display',
      'rating_stars'
    ]
  },
  'market_to_auth': {
    type: 'morphing',
    duration: 800,
    easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
  }
};

// 转场触发器类型
export type TransitionTrigger = 
  | 'explore_products' 
  | 'search_action'
  | 'start_ai_collaboration'
  | 'product_card_click'
  | 'auth_navigation'
  | 'role_switch';

// 转场上下文
export interface TransitionContext {
  from: string;
  to: string;
  trigger: TransitionTrigger;
  data?: any;
}

// 转场覆盖层组件
const TransitionOverlay: React.FC<{ config: TransitionConfig; context: TransitionContext }> = ({ 
  config, 
  context 
}) => {
  const renderTransitionContent = () => {
    switch (config.type) {
      case 'circular_reveal':
        return (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-cloudsway-primary-600 to-cloudsway-accent-600"
            initial={{ scale: 0, borderRadius: '50%' }}
            animate={{ scale: 10, borderRadius: '0%' }}
            transition={{ duration: config.duration / 1000, ease: config.easing }}
          >
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="text-center text-white">
                {context.trigger === 'start_ai_collaboration' ? (
                  <>
                    <Brain className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                    <h2 className="text-2xl font-bold mb-2">启动AI专家团队</h2>
                    <p className="text-lg opacity-90">6位AI专家正在为您准备...</p>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-16 h-16 mx-auto mb-4 animate-spin" />
                    <h2 className="text-2xl font-bold mb-2">正在跳转</h2>
                    <p className="text-lg opacity-90">请稍候...</p>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        );

      case 'slide_up':
        return (
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-800 to-transparent"
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            transition={{ duration: config.duration / 1000, ease: config.easing }}
          >
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <div className="text-center text-white">
                <ShoppingCart className="w-16 h-16 mx-auto mb-4 animate-bounce" />
                <h2 className="text-2xl font-bold mb-2">进入AI产品市场</h2>
                <p className="text-lg opacity-90">发现最适合您的AI解决方案</p>
                
                {/* 加载动画产品卡片 */}
                <motion.div
                  className="mt-8 grid grid-cols-3 gap-4 max-w-md mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-16 h-16 bg-white/10 rounded-lg"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        delay: 0.8 + i * (config.staggers?.productCards || 100) / 1000,
                        duration: 0.3
                      }}
                    />
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        );

      case 'morphing':
        return (
          <motion.div
            className="absolute inset-0"
            initial={{ clipPath: 'circle(0% at 50% 50%)' }}
            animate={{ clipPath: 'circle(150% at 50% 50%)' }}
            transition={{ duration: config.duration / 1000, ease: config.easing }}
          >
            <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <motion.div
                className="text-center text-white"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <Globe className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                <h2 className="text-2xl font-bold mb-2">身份验证</h2>
                <p className="text-lg opacity-90">安全登录中...</p>
              </motion.div>
            </div>
          </motion.div>
        );

      default:
        return (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: config.duration / 1000 }}
          >
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-white">
                <Zap className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                <h2 className="text-2xl font-bold">页面切换中...</h2>
              </div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {renderTransitionContent()}
    </motion.div>
  );
};

// 页面转场管理器
export interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className }) => {
  const router = useRouter();
  const [transitionState, setTransitionState] = useState<{
    isTransitioning: boolean;
    config?: TransitionConfig;
    context?: TransitionContext;
  }>({
    isTransitioning: false
  });

  // 执行页面转场
  const executeTransition = useCallback(async (
    to: string, 
    trigger: TransitionTrigger, 
    data?: any
  ) => {
    const from = window.location.pathname;
    const transitionKey = getTransitionKey(from, to, trigger);
    const config = TRANSITION_CONFIGS[transitionKey] || TRANSITION_CONFIGS['landing_to_market'];
    
    const context: TransitionContext = { from, to, trigger, data };
    
    setTransitionState({
      isTransitioning: true,
      config,
      context
    });

    // 等待动画完成的一部分时间再进行路由跳转
    const routerDelay = config.duration * 0.6; // 在动画60%处跳转
    
    setTimeout(() => {
      router.push(to);
    }, routerDelay);

    // 动画完成后清理状态
    setTimeout(() => {
      setTransitionState({ isTransitioning: false });
    }, config.duration);
  }, [router]);

  // 获取转场配置键
  const getTransitionKey = (from: string, to: string, trigger: TransitionTrigger): string => {
    // 根据路径和触发器组合生成转场配置键
    if (from === '/' && to === '/market') return 'landing_to_market';
    if (from === '/' && to === '/chat') return 'landing_to_chat';
    if (to.startsWith('/product/')) return 'card_to_detail';
    if (to.startsWith('/auth/')) return 'market_to_auth';
    
    return 'landing_to_market'; // 默认配置
  };

  // 暴露转场方法到全局
  useEffect(() => {
    (window as any).executePageTransition = executeTransition;
    
    return () => {
      delete (window as any).executePageTransition;
    };
  }, [executeTransition]);

  return (
    <div className={className}>
      {children}
      
      {/* 转场覆盖层 */}
      <AnimatePresence>
        {transitionState.isTransitioning && transitionState.config && transitionState.context && (
          <TransitionOverlay 
            config={transitionState.config} 
            context={transitionState.context}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// 页面转场触发器Hook
export const usePageTransition = () => {
  const router = useRouter();

  const transitionTo = useCallback((
    to: string, 
    trigger: TransitionTrigger = 'explore_products',
    data?: any
  ) => {
    if (typeof window !== 'undefined' && (window as any).executePageTransition) {
      (window as any).executePageTransition(to, trigger, data);
    } else {
      // 降级到普通路由跳转
      router.push(to);
    }
  }, [router]);

  return { transitionTo };
};

// 智能转场按钮组件
export interface SmartTransitionButtonProps {
  to: string;
  trigger: TransitionTrigger;
  children: React.ReactNode;
  className?: string;
  data?: any;
  onClick?: () => void;
}

export const SmartTransitionButton: React.FC<SmartTransitionButtonProps> = ({
  to,
  trigger,
  children,
  className = '',
  data,
  onClick
}) => {
  const { transitionTo } = usePageTransition();

  const handleClick = useCallback(() => {
    onClick?.();
    transitionTo(to, trigger, data);
  }, [onClick, transitionTo, to, trigger, data]);

  return (
    <motion.button
      className={`${className} relative overflow-hidden group`}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* 悬停效果 */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />
      
      {children}
    </motion.button>
  );
};

// 共享元素转场组件
export interface SharedElementProps {
  elementId: string;
  children: React.ReactNode;
  className?: string;
}

export const SharedElement: React.FC<SharedElementProps> = ({
  elementId,
  children,
  className = ''
}) => {
  return (
    <motion.div
      layoutId={elementId}
      className={className}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
};

// 产品卡片转场增强器
export const withProductTransition = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return React.forwardRef<any, P & { productId?: string }>((props, ref) => {
    const { transitionTo } = usePageTransition();
    const { productId, ...componentProps } = props;

    const handleProductClick = useCallback(() => {
      if (productId) {
        transitionTo(`/product/${productId}`, 'product_card_click', { productId });
      }
    }, [productId, transitionTo]);

    return (
      <motion.div
        ref={ref}
        onClick={handleProductClick}
        whileHover={{ scale: 1.02, y: -5 }}
        transition={{ duration: 0.2 }}
        className="cursor-pointer"
      >
        <Component {...(componentProps as P)} />
      </motion.div>
    );
  });
};

// 预设转场动画变体
export const transitionVariants = {
  // 页面进入动画
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      staggerChildren: 0.1
    }
  },
  // 页面退出动画
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.4,
      ease: 'easeIn'
    }
  },
  // 初始状态
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95
  }
};

// 错峰动画组件
export const StaggeredContainer: React.FC<{
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}> = ({ children, staggerDelay = 0.1, className = '' }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      variants={{
        animate: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};

export const StaggeredItem: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={className}
      variants={{
        initial: { opacity: 0, y: 20, scale: 0.9 },
        animate: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: { duration: 0.4, ease: 'easeOut' }
        }
      }}
    >
      {children}
    </motion.div>
  );
};