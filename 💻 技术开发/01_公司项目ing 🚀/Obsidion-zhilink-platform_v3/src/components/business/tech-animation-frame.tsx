"use client";

import { motion } from "framer-motion";
import { Brain, MousePointer, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface TechAnimationFrameProps {
  isAnimating?: boolean;
  onClick?: () => void;
  className?: string;
}

export function TechAnimationFrame({ isAnimating = false, onClick, className }: TechAnimationFrameProps) {
  return (
    <div 
      className={cn("hero-animation-container h-80 cursor-pointer group", className)} 
      onClick={onClick}
    >
      {/* 深空背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-background-main via-background-card to-background-main rounded-2xl overflow-hidden border border-border-primary/30">
        
        {/* 动态星点背景 */}
        <div className="tech-stars">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="tech-star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: Math.random() * 0.8 + 0.2
              }}
            />
          ))}
        </div>
        
        {/* 连接线动画 */}
        <svg className="tech-connections">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(99, 102, 241, 0.6)" />
              <stop offset="50%" stopColor="rgba(139, 92, 246, 0.8)" />
              <stop offset="100%" stopColor="rgba(6, 182, 212, 0.6)" />
            </linearGradient>
            <linearGradient id="lineGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(16, 185, 129, 0.6)" />
              <stop offset="50%" stopColor="rgba(245, 158, 11, 0.8)" />
              <stop offset="100%" stopColor="rgba(236, 72, 153, 0.6)" />
            </linearGradient>
          </defs>
          
          {/* 动态连接线 - 主要路径 */}
          <path
            d="M50,50 Q150,100 250,50 T450,100"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
            className={cn(
              "connection-line",
              isAnimating && "animate-glow-pulse"
            )}
          />
          
          {/* 动态连接线 - 次要路径 */}
          <path
            d="M100,200 Q200,120 320,180 T480,140"
            stroke="url(#lineGradient2)"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="3,3"
            className={cn(
              "connection-line opacity-60",
              isAnimating && "animate-glow-pulse"
            )}
            style={{ animationDelay: "0.5s" }}
          />
          
          {/* 交汇点 */}
          {isAnimating && (
            <>
              <circle cx="150" cy="100" r="3" fill="rgba(99, 102, 241, 0.8)" className="animate-bounce-gentle" />
              <circle cx="250" cy="50" r="2" fill="rgba(139, 92, 246, 0.8)" className="animate-bounce-gentle" style={{ animationDelay: "0.3s" }} />
              <circle cx="200" cy="120" r="2.5" fill="rgba(6, 182, 212, 0.8)" className="animate-bounce-gentle" style={{ animationDelay: "0.6s" }} />
            </>
          )}
        </svg>
        
        {/* 6角色协作环形指示器 */}
        <div className="absolute top-4 right-4">
          <div className="w-16 h-16 rounded-full border border-border-primary/50 flex items-center justify-center">
            <div className="collaboration-ring w-12 h-12" />
          </div>
        </div>
        
        {/* 中心LOGO和提示 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <motion.div 
            className="mb-6 transform group-hover:scale-110 transition-transform duration-500 relative"
            animate={isAnimating ? {
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            } : {}}
            transition={{ duration: 2, repeat: isAnimating ? Infinity : 0 }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-cloudsway-primary-500 to-cloudsway-accent-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Brain className="w-10 h-10 text-white" />
            </div>
            
            {/* 能量环绕效果 */}
            {isAnimating && (
              <div className="absolute -inset-2 border-2 border-cloudsway-primary-500/30 rounded-2xl animate-rotate-slow" />
            )}
          </motion.div>
          
          <h3 className="text-xl font-bold mb-2 text-center font-display">
            智链AI平台
          </h3>
          <p className="text-sm text-white/70 text-center max-w-xs mb-4 leading-relaxed">
            {isAnimating ? "正在启动6角色AI协作..." : "点击体验AI驱动的企业解决方案"}
          </p>
          
          {/* 点击指示 */}
          <div className={cn(
            "flex items-center gap-2 text-xs transition-colors duration-300",
            isAnimating ? "text-cloudsway-primary-300" : "text-white/50 group-hover:text-white/80"
          )}>
            {isAnimating ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>分析启动中...</span>
              </>
            ) : (
              <>
                <MousePointer className="w-4 h-4" />
                <span>点击探索</span>
              </>
            )}
          </div>
          
          {/* 6角色状态指示 */}
          {isAnimating && (
            <div className="mt-4 flex items-center gap-2">
              {["Alex", "Sarah", "Mike", "Emma", "David", "Catherine"].map((name, index) => (
                <div 
                  key={name} 
                  className="flex items-center gap-1 text-xs"
                  style={{ animationDelay: `${index * 0.5}s` }}
                >
                  <div className={cn(
                    "status-indicator",
                    index < 2 ? "status-complete" : 
                    index < 4 ? "status-active" : "status-thinking"
                  )} />
                  <span className="text-white/60">{name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* 悬停光效 */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent transition-opacity duration-700",
          isAnimating ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )} />
        
        {/* 科技粒子效果 */}
        {isAnimating && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cloudsway-accent-500 rounded-full"
                initial={{
                  x: Math.random() * 400,
                  y: Math.random() * 300,
                  opacity: 0
                }}
                animate={{
                  x: Math.random() * 400,
                  y: Math.random() * 300,
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        )}
        
        {/* 边框动画 */}
        {isAnimating && (
          <div className="absolute inset-0 rounded-2xl">
            <div className="absolute inset-0 rounded-2xl border-2 border-cloudsway-primary-500/50 animate-glow-pulse" />
            <div className="absolute inset-0 rounded-2xl border border-cloudsway-accent-500/30 animate-rotate-slow" />
          </div>
        )}
        
        {/* 进度指示器 */}
        {isAnimating && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-1">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-1 bg-cloudsway-primary-500 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}