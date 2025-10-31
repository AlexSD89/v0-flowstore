"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain,
  Target,
  Users,
  ArrowRight,
  Play,
  Pause,
  CheckCircle,
  Settings,
  FileText,
  Cloud,
  Zap,
  BarChart3,
  MessageSquare,
  Sparkles,
  ChevronRight,
  User
} from "lucide-react";

interface WorkflowStep {
  id: number;
  phase: "input" | "process" | "output";
  title: string;
  subtitle: string;
  customerPerspective: string;
  ourSupport: string;
  customerOutput: string;
  icon: React.ElementType;
  gradient: string;
  nexusLevel?: {
    name: string;
    function: string;
    agents: string[];
  };
}

const UNIFIED_WORKFLOW: WorkflowStep[] = [
  {
    id: 1,
    phase: "input",
    title: "客户输入需求",
    subtitle: "3分钟自然对话",
    customerPerspective: "我用自然语言描述需求",
    ourSupport: "MRD理解层智能解析",
    customerOutput: "获得结构化需求分析",
    icon: MessageSquare,
    gradient: "from-purple-600 to-indigo-600",
    nexusLevel: {
      name: "MRD理解层",
      function: "智能需求分析与语义理解",
      agents: ["语义分析师", "需求架构师", "场景分析师"]
    }
  },
  {
    id: 2,
    phase: "process",
    title: "AI智能决策",
    subtitle: "决策指挥中心分析",
    customerPerspective: "系统为我智能分析",
    ourSupport: "NEXUS Master决策调度",
    customerOutput: "获得专业分析方案",
    icon: Brain,
    gradient: "from-blue-600 to-cyan-600",
    nexusLevel: {
      name: "决策指挥中心",
      function: "智能决策与Agent编排调度",
      agents: ["决策分析师", "资源调度师", "质量管控师"]
    }
  },
  {
    id: 3,
    phase: "process",
    title: "专业团队协作",
    subtitle: "Agent军团并行执行",
    customerPerspective: "多个专家为我服务",
    ourSupport: "专业Agent军团协作",
    customerOutput: "获得专业级工作成果",
    icon: Users,
    gradient: "from-emerald-600 to-teal-600",
    nexusLevel: {
      name: "专业Agent军团",
      function: "多专业协作并行执行",
      agents: ["投资分析师", "架构设计师", "产品经理", "技术专家", "质检师"]
    }
  },
  {
    id: 4,
    phase: "output",
    title: "云端托管服务",
    subtitle: "24/7专属AI伙伴",
    customerPerspective: "获得永远在线的专业伙伴",
    ourSupport: "云端部署与持续服务",
    customerOutput: "享受专属AI顾问服务",
    icon: Cloud,
    gradient: "from-cyan-500 to-blue-600",
    nexusLevel: {
      name: "云端服务层",
      function: "专属AI顾问持续服务",
      agents: ["专属顾问", "数据监控师", "服务优化师"]
    }
  }
];

export function UnifiedWorkflowShowcase() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showNexusDetail, setShowNexusDetail] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => (prev >= UNIFIED_WORKFLOW.length ? 1 : prev + 1));
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentStepData = UNIFIED_WORKFLOW.find(step => step.id === currentStep) || UNIFIED_WORKFLOW[0];

  return (
    <div className="py-16 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* 标题区域 */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-gray-300">从客户角度看服务全流程</span>
          </div>
          <h2 className="text-4xl font-bold mb-4 text-white">
            客户输入 → 我们支持 → 客户获得
          </h2>
          <p className="text-xl text-gray-400 mb-8 leading-relaxed max-w-3xl mx-auto">
            Me² NEXUS三层智能架构就是完整工作流程，为您提供从需求理解到持续服务的一站式专业体验
          </p>
          
          {/* 控制按钮 */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                isPlaying 
                  ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg' 
                  : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg'
              }`}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying ? '暂停演示' : '自动演示'}
            </button>
            <button
              onClick={() => setShowNexusDetail(!showNexusDetail)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-white/10 text-white hover:bg-white/20 transition-all border border-white/20"
            >
              <Settings className="h-4 w-4" />
              {showNexusDetail ? '隐藏架构详情' : '显示NEXUS架构'}
            </button>
          </div>
        </motion.div>

        {/* 步骤导航 */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center bg-white/10 backdrop-blur-lg rounded-2xl p-3 border border-white/20">
            {UNIFIED_WORKFLOW.map((step, index) => (
              <React.Fragment key={step.id}>
                <motion.button
                  onClick={() => setCurrentStep(step.id)}
                  className={`relative px-4 py-2 rounded-xl transition-all ${
                    currentStep === step.id
                      ? 'bg-white/20 text-white shadow-lg scale-105'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${step.gradient} flex items-center justify-center`}>
                      <step.icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">{step.phase === "input" ? "输入" : step.phase === "process" ? "处理" : "输出"}</span>
                  </div>
                </motion.button>
                {index < UNIFIED_WORKFLOW.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-gray-500 mx-2" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 主要内容展示 */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* 左侧：客户视角流程 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`workflow-${currentStep}`}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4 }}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${currentStepData.gradient} flex items-center justify-center shadow-2xl`}>
                  <currentStepData.icon className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{currentStepData.title}</h3>
                  <p className="text-purple-300">{currentStepData.subtitle}</p>
                </div>
              </div>

              {/* 三个维度展示 */}
              <div className="space-y-6">
                {/* 客户角度 */}
                <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-2xl p-6 border border-blue-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="h-5 w-5 text-blue-400" />
                    <span className="font-semibold text-blue-300">客户视角：我的体验</span>
                  </div>
                  <p className="text-blue-100 text-lg">{currentStepData.customerPerspective}</p>
                </div>

                {/* 我们的支持 */}
                <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-2xl p-6 border border-purple-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="h-5 w-5 text-purple-400" />
                    <span className="font-semibold text-purple-300">Me² NEXUS：我们的支持</span>
                  </div>
                  <p className="text-purple-100 text-lg">{currentStepData.ourSupport}</p>
                </div>

                {/* 客户获得 */}
                <div className="bg-gradient-to-r from-emerald-900/40 to-teal-900/40 rounded-2xl p-6 border border-emerald-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                    <span className="font-semibold text-emerald-300">客户获得：实际价值</span>
                  </div>
                  <p className="text-emerald-100 text-lg">{currentStepData.customerOutput}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* 右侧：NEXUS架构详情 */}
          <AnimatePresence mode="wait">
            {showNexusDetail && currentStepData.nexusLevel && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-3xl p-8 border border-gray-600/30 shadow-2xl"
              >
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="h-6 w-6 text-yellow-400" />
                    <span className="text-yellow-300 font-bold text-lg">NEXUS技术架构</span>
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">{currentStepData.nexusLevel.name}</h4>
                  <p className="text-gray-300">{currentStepData.nexusLevel.function}</p>
                </div>

                <div className="space-y-4">
                  <h5 className="font-semibold text-gray-200 mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    参与的专业Agent
                  </h5>
                  <div className="grid grid-cols-1 gap-3">
                    {currentStepData.nexusLevel.agents.map((agent, index) => (
                      <motion.div
                        key={agent}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/10 rounded-xl p-4 border border-white/10 flex items-center gap-3"
                      >
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${currentStepData.gradient} flex items-center justify-center`}>
                          <BarChart3 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-white">{agent}</div>
                          <div className="text-xs text-gray-400">专业协作中...</div>
                        </div>
                        <div className="ml-auto">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* 实时状态 */}
                <div className="mt-6 p-4 bg-green-900/30 rounded-xl border border-green-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-green-300 font-medium">系统状态</span>
                  </div>
                  <div className="text-green-200 text-sm">
                    {currentStep === 1 && "正在理解和分析您的需求..."}
                    {currentStep === 2 && "智能决策系统正在为您分析最佳方案..."}
                    {currentStep === 3 && "专业Agent团队正在为您协作工作..."}
                    {currentStep === 4 && "您的专属AI顾问已准备就绪，24/7为您服务"}
                  </div>
                </div>
              </motion.div>
            )}

            {!showNexusDetail && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-8 text-white shadow-2xl"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <h4 className="text-2xl font-bold mb-4">体验Me² NEXUS</h4>
                  <p className="text-white/80 mb-6 leading-relaxed">
                    从需求输入到专属AI顾问服务，体验完整的专业化AI决策流程
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-sm opacity-90 mb-1">免费体验</div>
                      <div className="font-medium">3分钟生成您的专业MRD</div>
                    </div>
                    
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-sm opacity-90 mb-1">专属服务</div>
                      <div className="font-medium">99元/月专业AI顾问</div>
                    </div>
                  </div>
                  
                  <motion.button
                    className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 flex items-center justify-center gap-2 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="font-medium">立即开始免费体验</span>
                    <ChevronRight className="h-4 w-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 底部价值总结 */}
        <motion.div 
          className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h4 className="text-2xl font-bold text-white mb-4">
            一个系统，三个维度，全程服务
          </h4>
          <p className="text-gray-300 text-lg mb-6 max-w-4xl mx-auto leading-relaxed">
            Me² NEXUS将复杂的AI技术转化为简单的客户体验。您只需输入需求，我们的三层智能架构为您提供从理解到交付的全程专业服务。
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-xl p-6 border border-white/10">
              <MessageSquare className="h-8 w-8 text-purple-400 mx-auto mb-3" />
              <h5 className="font-bold text-white mb-2">您的输入</h5>
              <p className="text-gray-300 text-sm">自然语言描述需求，3分钟轻松沟通</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 border border-white/10">
              <Brain className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h5 className="font-bold text-white mb-2">我们的支持</h5>
              <p className="text-gray-300 text-sm">三层AI架构智能分析，专业团队协作</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 border border-white/10">
              <Sparkles className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <h5 className="font-bold text-white mb-2">您的获得</h5>
              <p className="text-gray-300 text-sm">专属AI顾问，永远在线的专业伙伴</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}