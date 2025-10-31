"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Send, 
  Mic, 
  Paperclip, 
  Brain,
  Users,
  TrendingUp,
  BarChart3,
  Target,
  Shield,
  ChevronRight,
  Play
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AGENTS, AGENT_ICONS, type AgentRole } from "@/constants/agents";

interface MegaChatInterfaceProps {
  className?: string;
  onStartAnalysis?: (message: string) => void;
}

const INDUSTRY_EXAMPLES = [
  {
    icon: Shield,
    title: "法律行业",
    example: "我们是一家中型律师事务所，希望用AI提升合同审查效率",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Users,
    title: "医疗行业", 
    example: "我们医院需要AI辅助诊断系统，提升医疗服务质量",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: TrendingUp,
    title: "电商行业",
    example: "我们电商平台想用AI优化推荐算法，提升转化率",
    color: "from-purple-500 to-pink-500"
  }
];

const AI_COLLABORATION_STEPS = [
  { agent: "alex", step: "需求理解", desc: "深度挖掘业务需求" },
  { agent: "sarah", step: "技术分析", desc: "评估技术可行性" },
  { agent: "mike", step: "体验设计", desc: "优化用户体验" },
  { agent: "emma", step: "数据分析", desc: "制定数据策略" },
  { agent: "david", step: "项目规划", desc: "制定实施路径" },
  { agent: "catherine", step: "战略建议", desc: "提供商业价值分析" }
];

export function MegaChatInterface({ className, onStartAnalysis }: MegaChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自动播放协作流程动画
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % AI_COLLABORATION_STEPS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    
    setIsAnalyzing(true);
    setIsTyping(true);
    
    // 模拟AI分析过程
    setTimeout(() => {
      onStartAnalysis?.(message);
      setIsAnalyzing(false);
      setIsTyping(false);
    }, 2000);
  };

  const handleExampleClick = (example: string) => {
    setMessage(example);
    textareaRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      {/* 主对话框容器 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        {/* 6AI协作状态指示器 */}
        <div className="mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-4"
          >
            <h3 className="text-xl font-semibold text-white mb-2">
              6位AI专家正在待命
            </h3>
            <p className="text-slate-400 text-sm">
              描述您的需求，让AI专家团队为您提供定制化解决方案
            </p>
          </motion.div>

          {/* AI协作流程可视化 */}
          <div className="flex items-center justify-center gap-3 mb-6 overflow-x-auto pb-2">
            {AI_COLLABORATION_STEPS.map((step, index) => {
              const agent = AGENTS[step.agent as AgentRole];
              const Icon = AGENT_ICONS[step.agent as AgentRole];
              const isActive = index === activeStep;
              const isCompleted = isAnalyzing && index <= activeStep;

              return (
                <div key={step.agent} className="flex items-center gap-3">
                  <motion.div
                    className={cn(
                      "relative flex flex-col items-center gap-2 min-w-[80px]",
                      isActive && "scale-110"
                    )}
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      opacity: isActive ? 1 : 0.7
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* AI头像 */}
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center text-white relative",
                        isActive && "shadow-lg"
                      )}
                      style={{
                        background: `linear-gradient(135deg, ${agent.color.primary}, ${agent.color.dark})`,
                        boxShadow: isActive ? `0 0 20px ${agent.color.primary}40` : 'none'
                      }}
                    >
                      <Icon className="w-6 h-6" />
                      {isCompleted && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                        >
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </motion.div>
                      )}
                    </div>
                    
                    {/* 步骤信息 */}
                    <div className="text-center">
                      <div className="text-xs font-medium text-white">{step.step}</div>
                      <div className="text-xs text-slate-400">{step.desc}</div>
                    </div>

                    {/* 活跃指示器 */}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute -inset-2 rounded-xl bg-gradient-to-r from-cloudsway-primary-500/20 to-cloudsway-accent-500/20 -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.div>

                  {/* 连接线 */}
                  {index < AI_COLLABORATION_STEPS.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 大对话框主体 */}
        <div className="relative bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* 对话框头部 */}
          <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/80 to-slate-700/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white font-medium">AI专家团队协作分析</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Brain className="w-4 h-4" />
                <span>智能推荐引擎已就绪</span>
              </div>
            </div>
          </div>

          {/* 输入区域 */}
          <div className="p-6">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="请详细描述您的业务需求，例如：行业背景、当前挑战、期望目标..."
                className="w-full min-h-[120px] bg-slate-900/50 border border-slate-600/50 rounded-xl p-4 text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-cloudsway-primary-500/50 focus:border-cloudsway-primary-500/50 text-lg"
                disabled={isAnalyzing}
              />
              
              {/* 输入工具栏 */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsRecording(!isRecording)}
                    className={cn(
                      "text-slate-400 hover:text-white",
                      isRecording && "text-red-400"
                    )}
                  >
                    <Mic className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!message.trim() || isAnalyzing}
                  className="bg-gradient-to-r from-cloudsway-primary-500 to-cloudsway-accent-500 hover:from-cloudsway-primary-600 hover:to-cloudsway-accent-600 text-white px-6 py-2"
                  loading={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <Brain className="w-4 h-4 mr-2 animate-pulse" />
                      分析中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      开始AI协作分析
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* 分析进度指示 */}
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-slate-700/50 bg-slate-900/50 p-4"
              >
                <div className="flex items-center justify-center gap-3 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cloudsway-primary-400 rounded-full animate-pulse" />
                    <span>AI专家团队正在协作分析您的需求...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 行业示例引导 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <div className="text-center mb-4">
            <p className="text-slate-400 text-sm">
              不知道如何开始？试试这些行业示例：
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {INDUSTRY_EXAMPLES.map((example, index) => (
              <motion.div
                key={example.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => handleExampleClick(example.example)}
              >
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/30 hover:border-slate-600/50 hover:bg-slate-800/60 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-r", example.color)}>
                      <example.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-medium text-sm">{example.title}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                    {example.example}
                  </p>
                  <div className="flex items-center mt-2 text-xs text-cloudsway-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-3 h-3 mr-1" />
                    点击使用此示例
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}