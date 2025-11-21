"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain,
  ArrowRight,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Building2,
  AlertTriangle,
  Menu,
  X,
  DollarSign,
  Crown,
  Zap,
  MessageSquare,
  Users,
  Cloud,
  FileText,
  Target,
  Settings,
  Play,
  Pause
} from "lucide-react";

interface ProfessionalPersona {
  id: 'investor' | 'ceo' | 'consultant';
  label: string;
  icon: React.ElementType;
  painPoint: string;
  solution: string;
  value: string;
  color: string;
}

const PROFESSIONAL_PERSONAS: ProfessionalPersona[] = [
  {
    id: 'investor',
    label: '投资专家',
    icon: TrendingUp,
    painPoint: '投资人老张：每天收到30个项目BP，每个都要花2小时看完，脑子都糊了感觉每个都差不多',
    solution: 'Me² 永久记住你的投资逻辑，AI预筛选项目+交叉验证+生成决策建议，不是工具是专属顾问',
    value: '从每天看30个项目到只看3个高匹配，效率提升10倍，像拥有永不离职的专业合伙人',
    color: 'from-purple-600 to-indigo-600'
  },
  {
    id: 'ceo',
    label: '企业领袖',
    icon: Building2,
    painPoint: 'CEO李总：三个重要决策同时要做，资源有限只能选一个，请麦肯锡要200万还等3个月',
    solution: 'Me² 基于你的经营数据持续学习，AI提供即时决策分析+ROI计算，24/7专业咨询',
    value: '298元/月获得麦肯锡级分析，决策速度从3个月到30分钟，随时随地专业支持',
    color: 'from-blue-600 to-cyan-600'
  },
  {
    id: 'consultant',
    label: '知识工作者',
    icon: Brain,
    painPoint: '律师王总：合同审查4小时查案例+写意见，客户越来越多但时间有限，无法规模化',
    solution: 'Me² 学会你的专业方法论，基于完整案例库分析，持续积累从不遗忘',
    value: '审查时间从4小时到30分钟，质量更高覆盖95%风险点，专业能力可复制',
    color: 'from-emerald-600 to-teal-600'
  }
];

// NEXUS工作流程步骤
const ANALYSIS_WORKFLOW = [
  {
    id: 1,
    title: "CORN Agent 接收需求",
    description: "智能解析用户输入的专业需求",
    agent: "CORN Master",
    icon: Brain,
    color: "from-blue-500 to-cyan-500",
    duration: 2000
  },
  {
    id: 2,
    title: "MRD 结构化分析",
    description: "将需求转化为标准化分析框架",
    agent: "MRD 引擎",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    duration: 2500
  },
  {
    id: 3,
    title: "任务智能分配",
    description: "根据需求类型分配给专业Agent",
    agent: "Task Router",
    icon: ArrowRight,
    color: "from-green-500 to-teal-500",
    duration: 1500
  },
  {
    id: 4,
    title: "多Agent并行工作",
    description: "投资分析师、架构师、产品经理同步分析",
    agent: "专业团队",
    icon: TrendingUp,
    color: "from-yellow-500 to-orange-500",
    duration: 3000
  },
  {
    id: 5,
    title: "结果整合输出",
    description: "生成专业报告和决策建议",
    agent: "Report Generator",
    icon: CheckCircle,
    color: "from-emerald-500 to-green-500",
    duration: 2000
  },
  {
    id: 6,
    title: "线上托管部署",
    description: "24/7云端服务，随时随地访问",
    agent: "Cloud Service",
    icon: Building2,
    color: "from-indigo-500 to-blue-500",
    duration: 1500
  }
];

// 完整客户体验流程
const CUSTOMER_JOURNEY_STEPS = [
  {
    id: 1,
    title: "客户对话输入",
    subtitle: "3分钟自然语言描述需求",
    icon: MessageSquare,
    color: "from-blue-500 to-indigo-600",
    demo: {
      input: "我想分析一家AI医疗初创公司的投资价值，团队15人，月收入200万，寻求A轮融资...",
      processing: "正在理解需求，识别关键信息点..."
    }
  },
  {
    id: 2,
    title: "MRD智能生成", 
    subtitle: "30分钟专业分析文档",
    icon: FileText,
    color: "from-purple-500 to-pink-600",
    demo: {
      sections: [
        "市场分析：AI医疗影像市场规模$50B",
        "竞品研究：3家主要竞争对手对比", 
        "团队评估：核心技术团队背景分析",
        "投资建议：推荐投资，估值$200M"
      ]
    }
  },
  {
    id: 3,
    title: "Agent智能分配",
    subtitle: "多专业AI协作执行",
    icon: Users,
    color: "from-green-500 to-emerald-600", 
    demo: {
      agents: [
        { name: "投资分析师", task: "财务模型构建", progress: 95 },
        { name: "行业专家", task: "市场趋势分析", progress: 88 },
        { name: "技术评估师", task: "产品技术评估", progress: 92 }
      ]
    }
  },
  {
    id: 4,
    title: "云端托管服务",
    subtitle: "24/7专属AI顾问上线",
    icon: Cloud,
    color: "from-cyan-500 to-blue-600",
    demo: {
      aiAdvisor: "投资分析AI - Alex",
      features: ["实时市场监控", "风险预警提醒", "个性化投资建议"],
      reports: ["Q3投资组合分析", "AI市场趋势报告", "风险评估报告"]
    }
  }
];

export function SimplifiedNexusLandingPage() {
  const [selectedPersona, setSelectedPersona] = useState<ProfessionalPersona>(PROFESSIONAL_PERSONAS[0]);
  const [selectedDemo, setSelectedDemo] = useState<'mrd' | 'analysis' | 'advisor'>('mrd');
  const [autoPlay, setAutoPlay] = useState(true);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [showPricing, setShowPricing] = useState(false);
  const [currentJourneyStep, setCurrentJourneyStep] = useState(1);

  // 自动播放逻辑
  useEffect(() => {
    if (!autoPlay) return;
    
    const demoSequence = ['mrd', 'analysis', 'advisor'] as const;
    const interval = setInterval(() => {
      setSelectedDemo(prev => {
        const currentIndex = demoSequence.indexOf(prev);
        const nextIndex = (currentIndex + 1) % demoSequence.length;
        return demoSequence[nextIndex];
      });
    }, 8000); // 每8秒切换一次

    return () => clearInterval(interval);
  }, [autoPlay]);

  // 专业身份自动轮播
  useEffect(() => {
    if (!autoPlay) return;
    
    const personaInterval = setInterval(() => {
      setSelectedPersona(prev => {
        const currentIndex = PROFESSIONAL_PERSONAS.findIndex(p => p.id === prev.id);
        const nextIndex = (currentIndex + 1) % PROFESSIONAL_PERSONAS.length;
        return PROFESSIONAL_PERSONAS[nextIndex];
      });
    }, 6000); // 每6秒切换专业身份

    return () => clearInterval(personaInterval);
  }, [autoPlay]);

  // 客户体验流程自动播放
  useEffect(() => {
    if (!autoPlay) return;
    
    const journeyInterval = setInterval(() => {
      setCurrentJourneyStep(prev => {
        const nextStep = prev >= CUSTOMER_JOURNEY_STEPS.length ? 1 : prev + 1;
        return nextStep;
      });
    }, 5000); // 每5秒切换一个流程步骤

    return () => clearInterval(journeyInterval);
  }, [autoPlay]);

  // AI分析步骤自动播放
  useEffect(() => {
    if (selectedDemo !== 'analysis') {
      setAnalysisStep(0);
      return;
    }

    const stepInterval = setInterval(() => {
      setAnalysisStep(prev => {
        const nextStep = (prev + 1) % ANALYSIS_WORKFLOW.length;
        return nextStep;
      });
    }, 2500); // 每2.5秒切换步骤

    return () => clearInterval(stepInterval);
  }, [selectedDemo]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
      {/* 顶部导航栏 */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Me² Logo Design */}
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <div className="text-white font-bold text-lg tracking-tight">
                    M
                    <span className="text-xs align-super">²</span>
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
                  <Brain className="h-2.5 w-2.5 text-white" />
                </div>
              </div>
              <div>
                <div className="text-white font-bold text-xl tracking-tight">
                  Me² NEXUS
                </div>
                <div className="text-purple-300 text-xs -mt-1">
                  专业个体超级增强器
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => setAutoPlay(!autoPlay)}
                className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
              >
                {autoPlay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {autoPlay ? '暂停演示' : '自动演示'}
              </button>
              <button className="text-gray-300 hover:text-white transition-colors">产品功能</button>
              <button className="text-gray-300 hover:text-white transition-colors">使用场景</button>
              <button 
                onClick={() => setShowPricing(!showPricing)}
                className="text-gray-300 hover:text-white transition-colors flex items-center gap-1"
              >
                <DollarSign className="h-4 w-4" />
                订阅价格
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all">
                免费体验
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* 简洁开场白 - 我们是谁 */}
      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div 
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-8 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-gray-300">不是AI工具，是专业个体超级增强器</span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              不是AI聊天工具<br/>
            </span>
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              而是会思考的专业顾问
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-400 mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            3分钟对话，AI学会你的分析方法<br/>
            创建专属的投资/企业/咨询顾问，托管在云端<br/>
            <span className="text-purple-400 font-medium">就像拥有一个永远在线的专业合伙人</span>
          </motion.p>
          
          <motion.div 
            className="mb-12 max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-lg text-gray-400 text-center mb-4">核心价值：记忆型专属AI vs 健忘型通用AI</div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-gray-300">
                <div className="text-center">
                  <div className="text-purple-300 font-semibold">你的专业Know-How</div>
                  <div className="text-sm text-gray-400">判断逻辑·决策框架</div>
                </div>
                <div className="text-purple-400 text-2xl">×</div>
                <div className="text-center">
                  <div className="text-blue-300 font-semibold">AI的200万级数据源</div>
                  <div className="text-sm text-gray-400">信息采集·交叉验证</div>
                </div>
                <div className="text-purple-400 text-2xl">×</div>
                <div className="text-center">
                  <div className="text-green-300 font-semibold">智能决策处理</div>
                  <div className="text-sm text-gray-400">策略输出·持续优化</div>
                </div>
                <div className="text-purple-400 text-2xl">=</div>
                <div className="text-center">
                  <div className="text-yellow-300 font-bold text-lg">更强的专业自己</div>
                  <div className="text-sm text-gray-400">Me² NEXUS</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 核心交互界面 */}
      <div className="pb-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* 自动播放状态 */}
          {autoPlay && (
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">自动演示中 - 展示三种专业AI顾问</span>
                <div className="flex gap-1">
                  {PROFESSIONAL_PERSONAS.map((persona, index) => (
                    <div 
                      key={persona.id}
                      className={`w-2 h-2 rounded-full transition-all ${
                        selectedPersona.id === persona.id 
                          ? 'bg-purple-400' 
                          : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* 专业身份选择 */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {PROFESSIONAL_PERSONAS.map((persona) => {
              const Icon = persona.icon;
              const isSelected = selectedPersona.id === persona.id;
              
              return (
                <motion.button
                  key={persona.id}
                  onClick={() => setSelectedPersona(persona)}
                  className={`relative p-6 rounded-2xl border transition-all text-left backdrop-blur-md ${
                    isSelected 
                      ? 'bg-white/20 border-white/40 shadow-2xl scale-105' 
                      : 'bg-white/10 border-white/20 hover:bg-white/15 hover:scale-102'
                  }`}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: persona.id === 'investor' ? 0.1 : persona.id === 'ceo' ? 0.2 : 0.3 }}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${persona.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2">{persona.label}专属AI顾问</h3>
                  <p className="text-gray-300 text-sm">
                    学习你的{persona.label === '投资专家' ? '投资判断逻辑' : persona.label === '企业领袖' ? '决策框架' : '分析方法论'}，AI处理海量信息，输出专业策略
                  </p>
                  {isSelected && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-2xl border border-purple-400/50"
                      layoutId="persona-selection"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* 动态交互演示区 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPersona.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl"
            >
              <div className="grid lg:grid-cols-2 gap-8">
                {/* 左侧：问题场景 */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${selectedPersona.color} flex items-center justify-center shadow-2xl`}>
                      <selectedPersona.icon className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{selectedPersona.label}专属解决方案</h3>
                      <p className="text-purple-300">AI学会你的专业方法</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <motion.div 
                      className="bg-red-900/20 border border-red-500/20 rounded-2xl p-6 backdrop-blur-sm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                        <span className="font-semibold text-red-300">现实困境</span>
                      </div>
                      <p className="text-red-100 leading-relaxed">{selectedPersona.painPoint}</p>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-blue-900/20 border border-blue-500/20 rounded-2xl p-6 backdrop-blur-sm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Brain className="h-5 w-5 text-blue-400" />
                        <span className="font-semibold text-blue-300">Me² NEXUS解决方案</span>
                      </div>
                      <p className="text-blue-100 leading-relaxed">{selectedPersona.solution}</p>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-green-900/20 border border-green-500/20 rounded-2xl p-6 backdrop-blur-sm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <span className="font-semibold text-green-300">实际价值</span>
                      </div>
                      <p className="text-green-100 leading-relaxed">{selectedPersona.value}</p>
                    </motion.div>
                  </div>
                </div>

                {/* 右侧：实时交互演示 */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 backdrop-blur-lg border border-gray-600/30">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-white font-semibold text-lg">Me² NEXUS 实时演示</h4>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setAutoPlay(!autoPlay)}
                        className={`px-3 py-1 rounded-lg text-xs transition-all ${
                          autoPlay 
                            ? 'bg-green-600/80 text-white' 
                            : 'bg-gray-600/60 text-gray-300 border border-gray-500/30'
                        }`}
                      >
                        {autoPlay ? '自动播放' : '手动控制'}
                      </button>
                      <div className="flex gap-2">
                        {['mrd', 'analysis', 'advisor'].map((demo) => (
                          <button
                            key={demo}
                            onClick={() => {
                              setAutoPlay(false);
                              setSelectedDemo(demo as any);
                            }}
                            className={`px-4 py-2 rounded-lg text-sm transition-all backdrop-blur-sm ${
                              selectedDemo === demo 
                                ? 'bg-purple-600/80 text-white shadow-lg' 
                                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/60 border border-gray-600/30'
                            }`}
                          >
                            {demo === 'mrd' ? 'MRD 生成' : demo === 'analysis' ? 'NEXUS 分析' : 'Me² 顾问'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={selectedDemo}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      {selectedDemo === 'mrd' && (
                        <div className="space-y-4">
                          <motion.div 
                            className="bg-blue-900/30 rounded-xl p-5 backdrop-blur-sm border border-blue-500/20"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                          >
                            <div className="text-blue-300 text-sm mb-2 font-medium">👤 用户输入</div>
                            <div className="text-blue-100 text-sm leading-relaxed">&ldquo;我想分析一家AI医疗初创公司的投资价值...&rdquo;</div>
                          </motion.div>
                          
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: 360 }}
                            transition={{ delay: 0.3 }}
                            className="flex justify-center"
                          >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                              <ArrowRight className="h-4 w-4 text-white" />
                            </div>
                          </motion.div>
                          
                          <motion.div 
                            className="bg-green-900/30 rounded-xl p-5 backdrop-blur-sm border border-green-500/20"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            <div className="text-green-300 text-sm mb-2 font-medium">🤖 AI生成MRD</div>
                            <div className="space-y-2 text-sm text-green-100">
                              <motion.div 
                                initial={{ opacity: 0, x: -10 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                transition={{ delay: 0.7 }}
                                className="flex items-center gap-2"
                              >
                                <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                                <span>市场规模：AI医疗影像 $50B，年增长15%</span>
                              </motion.div>
                              <motion.div 
                                initial={{ opacity: 0, x: -10 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                transition={{ delay: 0.9 }}
                                className="flex items-center gap-2"
                              >
                                <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                                <span>竞争分析：3家主要竞品，技术差异化明显</span>
                              </motion.div>
                              <motion.div 
                                initial={{ opacity: 0, x: -10 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                transition={{ delay: 1.1 }}
                                className="flex items-center gap-2"
                              >
                                <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                                <span>团队评估：核心团队清华AI博士，经验丰富</span>
                              </motion.div>
                              <motion.div 
                                initial={{ opacity: 0, x: -10 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                transition={{ delay: 1.3 }}
                                className="flex items-center gap-2"
                              >
                                <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                                <span>投资建议：推荐投资，建议估值$200M</span>
                              </motion.div>
                            </div>
                          </motion.div>
                        </div>
                      )}
                      
                      {selectedDemo === 'analysis' && (
                        <div className="space-y-4">
                          <div className="bg-gradient-to-br from-slate-800/50 to-gray-800/50 rounded-xl p-6 border border-slate-600/30">
                            <h5 className="text-white font-semibold mb-4 text-center">NEXUS 三级智能决策架构</h5>
                            
                            {/* 工作流程步骤显示 */}
                            <div className="space-y-3">
                              {ANALYSIS_WORKFLOW.map((step, index) => {
                                const Icon = step.icon;
                                const isActive = index === analysisStep;
                                const isCompleted = index < analysisStep;
                                
                                return (
                                  <motion.div
                                    key={step.id}
                                    className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                                      isActive 
                                        ? 'bg-gradient-to-r ' + step.color + '/20 border border-white/20' 
                                        : isCompleted
                                          ? 'bg-green-900/20 border border-green-500/20'
                                          : 'bg-gray-700/20 border border-gray-600/20'
                                    }`}
                                    initial={{ opacity: 0.5, x: -10 }}
                                    animate={{ 
                                      opacity: isActive ? 1 : (isCompleted ? 0.8 : 0.5),
                                      x: 0,
                                      scale: isActive ? 1.02 : 1
                                    }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    {/* 步骤图标 */}
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                      isActive 
                                        ? 'bg-gradient-to-r ' + step.color + ' shadow-lg' 
                                        : isCompleted
                                          ? 'bg-green-500'
                                          : 'bg-gray-600'
                                    }`}>
                                      {isCompleted ? (
                                        <CheckCircle className="h-5 w-5 text-white" />
                                      ) : (
                                        <Icon className="h-5 w-5 text-white" />
                                      )}
                                    </div>
                                    
                                    {/* 步骤内容 */}
                                    <div className="flex-1">
                                      <div className={`font-medium text-sm ${
                                        isActive ? 'text-white' : isCompleted ? 'text-green-300' : 'text-gray-400'
                                      }`}>
                                        {step.title}
                                      </div>
                                      <div className={`text-xs ${
                                        isActive ? 'text-gray-300' : 'text-gray-500'
                                      }`}>
                                        {step.description}
                                      </div>
                                    </div>
                                    
                                    {/* Agent 标识 */}
                                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                                      isActive 
                                        ? 'bg-white/20 text-white' 
                                        : isCompleted
                                          ? 'bg-green-500/20 text-green-300'
                                          : 'bg-gray-600/20 text-gray-400'
                                    }`}>
                                      {step.agent}
                                    </div>
                                    
                                    {/* 活动指示器 */}
                                    {isActive && (
                                      <motion.div 
                                        className="w-2 h-2 bg-white rounded-full"
                                        animate={{ opacity: [1, 0.3, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                      />
                                    )}
                                  </motion.div>
                                );
                              })}
                            </div>
                            
                            {/* 底部状态显示 */}
                            <div className="mt-4 pt-4 border-t border-gray-600/30">
                              <div className="flex items-center justify-between">
                                <div className="text-gray-400 text-xs">
                                  步骤 {analysisStep + 1} / {ANALYSIS_WORKFLOW.length}
                                </div>
                                <div className="text-gray-400 text-xs">
                                  为 {selectedPersona.label} 定制分析中...
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {selectedDemo === 'advisor' && (
                        <motion.div 
                          className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-6 backdrop-blur-sm border border-purple-500/20"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="flex items-center gap-4 mb-4">
                            <motion.div 
                              className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg"
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <selectedPersona.icon className="h-6 w-6 text-white" />
                            </motion.div>
                            <div>
                              <div className="text-white font-medium text-lg">{selectedPersona.label}AI顾问 - Alex</div>
                              <div className="text-purple-300 text-sm flex items-center gap-2">
                                <motion.div 
                                  className="w-2 h-2 bg-green-400 rounded-full"
                                  animate={{ opacity: [1, 0.3, 1] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                />
                                24/7在线服务
                              </div>
                            </div>
                          </div>
                          <motion.div 
                            className="text-purple-100 leading-relaxed text-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            {selectedPersona.id === 'investor' && (
                              <>
                                &ldquo;张总早上好！昨晚收到32个新项目，已按你的投资框架筛选：
                                <br /><br />
                                <div className="bg-green-900/30 rounded-lg p-3 border border-green-500/30 mb-3">
                                  <strong className="text-green-300">✅ 高度匹配3个</strong>
                                  <div className="text-sm text-green-200 mt-1">智能教育赛道，团队+技术双优</div>
                                </div>
                                
                                <div className="bg-yellow-900/30 rounded-lg p-3 border border-yellow-500/30 mb-3">
                                  <strong className="text-yellow-300">🟡 中度匹配5个</strong>
                                  <div className="text-sm text-yellow-200 mt-1">赛道OK但团队或技术有缺陷</div>
                                </div>
                                
                                <div className="bg-red-900/30 rounded-lg p-3 border border-red-500/30 mb-3">
                                  <strong className="text-red-300">❌ 其余24个</strong>
                                  <div className="text-sm text-red-200 mt-1">不符合Pre-A教育投资标准，已归档</div>
                                </div>
                                
                                <em className="text-blue-300">重点推荐：'智慧课堂'项目与你投的'学而思在线'相似，但B端市场更大。</em>
                                &rdquo;
                              </>
                            )}
                            {selectedPersona.id === 'ceo' && (
                              <>
                                &ldquo;李总，关于三个方案的优先级建议：
                                <br /><br />
                                <div className="space-y-3">
                                  <div className="flex items-start gap-3">
                                    <span className="text-green-400 font-bold">1️⃣</span>
                                    <div>
                                      <strong className="text-green-300">系统升级优先</strong>
                                      <br />投入150万，8个月回收，年节省80万人工成本
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-start gap-3">
                                    <span className="text-yellow-400 font-bold">2️⃣</span>
                                    <div>
                                      <strong className="text-yellow-300">华南扩张次之</strong>
                                      <br />市场机会大但现金流压力18个月，建议6个月后启动
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-start gap-3">
                                    <span className="text-red-400 font-bold">3️⃣</span>
                                    <div>
                                      <strong className="text-red-300">抖音暂缓</strong>
                                      <br />获客成本上升47%，边际收益递减
                                    </div>
                                  </div>
                                </div>
                                <br />
                                <em className="text-purple-300">基于你的核心KPI是人效提升，系统升级能直接解决当前瓶颈问题。</em>
                                &rdquo;
                              </>
                            )}
                            {selectedPersona.id === 'consultant' && (
                              <>
                                &ldquo;王律师，这份股权投资协议有3个主要风险点：
                                <br /><br />
                                <div className="space-y-4">
                                  <div className="border-l-3 border-red-500 pl-4">
                                    <strong className="text-red-300">🚨 业绩承诺过激</strong>
                                    <div className="text-sm text-red-200">参考你处理的泰康案例，建议降低15%</div>
                                  </div>
                                  
                                  <div className="border-l-3 border-yellow-500 pl-4">
                                    <strong className="text-yellow-300">⚠️ 触发条件模糊</strong>
                                    <div className="text-sm text-yellow-200">建议加'连续两季度'限定，避免华为案例问题</div>
                                  </div>
                                  
                                  <div className="border-l-3 border-orange-500 pl-4">
                                    <strong className="text-orange-300">⚡ 缺免责条款</strong>
                                    <div className="text-sm text-orange-200">疫情期间3个败诉案例都是这个问题</div>
                                  </div>
                                </div>
                                <br />
                                <div className="bg-blue-900/30 rounded-lg p-3 border border-blue-500/30">
                                  <strong className="text-blue-300">💡 修改建议已生成</strong>
                                  <div className="text-sm text-blue-200">基于你46个相似案例，5分钟完成专业审查</div>
                                </div>
                                &rdquo;
                              </>
                            )}
                          </motion.div>
                        </motion.div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 完整客户体验流程展示 */}
      <div className="py-16 bg-gradient-to-br from-gray-900/50 to-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-bold mb-4 text-white">
              完整客户体验流程演示
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              从对话输入到云端托管，感受Me² NEXUS的完整专业AI服务体验
            </p>
            
            {autoPlay && (
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300">自动演示中 - 完整服务流程</span>
                  <div className="flex gap-1">
                    {CUSTOMER_JOURNEY_STEPS.map((step, index) => (
                      <div 
                        key={step.id}
                        className={`w-2 h-2 rounded-full transition-all ${
                          currentJourneyStep === step.id 
                            ? 'bg-purple-400' 
                            : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* 流程步骤指示器 */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center bg-white/10 rounded-full p-2 shadow-lg border border-white/20">
              {CUSTOMER_JOURNEY_STEPS.map((step, index) => (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => {
                      setCurrentJourneyStep(step.id);
                      setAutoPlay(false);
                    }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                      currentJourneyStep === step.id
                        ? 'bg-purple-600 text-white shadow-lg transform scale-110'
                        : currentJourneyStep > step.id
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    }`}
                  >
                    {currentJourneyStep > step.id ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      step.id
                    )}
                  </button>
                  {index < CUSTOMER_JOURNEY_STEPS.length - 1 && (
                    <div className={`w-8 h-1 mx-2 rounded transition-all ${
                      currentJourneyStep > step.id ? 'bg-green-500' : 'bg-gray-600'
                    }`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* 当前流程步骤展示 */}
          <AnimatePresence mode="wait">
            {CUSTOMER_JOURNEY_STEPS.map((step) => {
              if (currentJourneyStep !== step.id) return null;
              const Icon = step.icon;
              
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl"
                >
                  {/* 步骤头部 */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                      <p className="text-gray-300">{step.subtitle}</p>
                    </div>
                  </div>

                  {/* 步骤演示内容 */}
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 backdrop-blur-lg border border-gray-600/30">
                    {step.id === 1 && (
                      <div className="space-y-4">
                        <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-500/30">
                          <div className="text-blue-300 text-sm mb-2 font-medium">👤 客户输入</div>
                          <div className="text-blue-100 text-sm leading-relaxed">
                            "{step.demo.input}"
                          </div>
                        </div>
                        <motion.div 
                          className="text-center py-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          <div className="text-purple-300 text-sm mb-2">🤖 AI处理中...</div>
                          <div className="text-gray-400 text-xs">{step.demo.processing}</div>
                          <motion.div 
                            className="w-full bg-gray-700 rounded-full h-2 mt-3"
                          >
                            <motion.div 
                              className="bg-blue-500 h-2 rounded-full"
                              animate={{ width: ["0%", "100%"] }}
                              transition={{ duration: 3, repeat: Infinity }}
                            />
                          </motion.div>
                        </motion.div>
                      </div>
                    )}
                    
                    {step.id === 2 && (
                      <div className="space-y-3">
                        <div className="text-green-300 text-sm mb-4 font-medium">📄 专业MRD文档生成</div>
                        {step.demo.sections?.map((section, index) => (
                          <motion.div 
                            key={index}
                            className="bg-green-900/30 rounded-lg p-3 border border-green-500/30"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.2 }}
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                              <span className="text-green-100 text-sm">{section}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                    
                    {step.id === 3 && (
                      <div className="space-y-4">
                        <div className="text-emerald-300 text-sm mb-4 font-medium">👥 专业Agent团队协作</div>
                        {step.demo.agents?.map((agent, index) => (
                          <motion.div 
                            key={index}
                            className="bg-emerald-900/30 rounded-lg p-4 border border-emerald-500/30"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.3 }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-emerald-100 font-medium">{agent.name}</span>
                              <span className="text-emerald-300 text-sm">{agent.progress}%</span>
                            </div>
                            <div className="text-emerald-200 text-sm mb-2">{agent.task}</div>
                            <div className="w-full bg-emerald-800/30 rounded-full h-2">
                              <motion.div 
                                className="bg-emerald-500 h-2 rounded-full"
                                animate={{ width: `${agent.progress}%` }}
                                transition={{ duration: 2 }}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                    
                    {step.id === 4 && (
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* 专属AI顾问 */}
                        <div className="bg-cyan-900/30 rounded-xl p-4 border border-cyan-500/30">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                              <Brain className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <div className="text-cyan-100 font-medium">{step.demo.aiAdvisor}</div>
                              <div className="text-cyan-300 text-xs">您的专属投资顾问</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {step.demo.features?.map((feature, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                                <span className="text-cyan-100 text-xs">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* 报告存储库 */}
                        <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-500/30">
                          <div className="flex items-center gap-2 mb-4">
                            <FileText className="h-5 w-5 text-blue-400" />
                            <span className="text-blue-100 font-medium">专业报告库</span>
                          </div>
                          <div className="space-y-2">
                            {step.demo.reports?.map((report, index) => (
                              <motion.div 
                                key={index}
                                className="p-2 bg-blue-800/30 rounded border-l-2 border-blue-400 cursor-pointer hover:bg-blue-700/30 transition-colors"
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <div className="text-blue-100 text-xs">📊 {report}</div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* 底部定价区域 */}
      <AnimatePresence>
        {showPricing && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-xl border-t border-white/10"
          >
            <div className="max-w-4xl mx-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-xl">订阅价格</h3>
                <button 
                  onClick={() => setShowPricing(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                {/* 免费体验 */}
                <div className="bg-white/10 rounded-2xl p-6 border border-white/20 backdrop-blur-sm">
                  <div className="text-center">
                    <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
                    <h4 className="text-white font-bold text-lg mb-2">免费体验</h4>
                    <div className="text-3xl font-bold text-white mb-4">¥0 <span className="text-sm text-gray-400">/永久</span></div>
                    <ul className="text-sm text-gray-300 space-y-2 mb-4">
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" />1次 MRD 生成</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" />基础分析功能</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" />AI 顾问预览</li>
                    </ul>
                    <button className="w-full py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                      立即体验
                    </button>
                  </div>
                </div>

                {/* 专业版 */}
                <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-2xl p-6 border border-purple-500/50 backdrop-blur-sm relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      最受欢迎
                    </div>
                  </div>
                  <div className="text-center">
                    <Crown className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                    <h4 className="text-white font-bold text-lg mb-2">专业版</h4>
                    <div className="text-3xl font-bold text-white mb-4">¥99 <span className="text-sm text-gray-400">/月</span></div>
                    <ul className="text-sm text-gray-300 space-y-2 mb-4">
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" />无限 MRD 生成</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" />专属 AI 顾问</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" />24/7 智能分析</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" />高级数据源</li>
                    </ul>
                    <button className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all">
                      30天免费试用
                    </button>
                  </div>
                </div>

                {/* 企业版 */}
                <div className="bg-white/10 rounded-2xl p-6 border border-white/20 backdrop-blur-sm">
                  <div className="text-center">
                    <Building2 className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                    <h4 className="text-white font-bold text-lg mb-2">企业版</h4>
                    <div className="text-3xl font-bold text-white mb-4">¥399 <span className="text-sm text-gray-400">/月</span></div>
                    <ul className="text-sm text-gray-300 space-y-2 mb-4">
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" />专业版所有功能</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" />团队协作空间</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" />自定义训练</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" />专属客户经理</li>
                    </ul>
                    <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      联系销售
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}