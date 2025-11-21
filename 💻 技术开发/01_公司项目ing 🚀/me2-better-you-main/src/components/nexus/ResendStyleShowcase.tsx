"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Brain,
  Target,
  Users,
  Cloud,
  CheckCircle
} from "lucide-react";

interface ShowcaseStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  visual: React.ReactNode;
  stats?: {
    label: string;
    value: string;
    trend: string;
  }[];
}

// 保持Me² NEXUS设计风格的展示步骤
const SHOWCASE_STEPS: ShowcaseStep[] = [
  {
    id: 1,
    title: "智能需求理解",
    subtitle: "MRD理解层",
    description: "AI深度理解您的自然语言需求，自动生成专业的MRD文档，将抽象想法转化为具体的技术方案。",
    icon: Brain,
    gradient: "from-purple-600 via-indigo-600 to-purple-800",
    stats: [
      { label: "理解准确率", value: "96.8%", trend: "↗" },
      { label: "生成速度", value: "< 2min", trend: "⚡" },
      { label: "专业程度", value: "企业级", trend: "★" }
    ],
    visual: (
      <div className="space-y-4 p-6">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border-l-4 border-purple-500">
          <div className="text-sm font-medium text-purple-800 mb-2">用户输入</div>
          <p className="text-sm text-gray-700">&ldquo;我需要一个智能投资分析系统...&rdquo;</p>
        </div>
        <div className="flex items-center justify-center py-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-l-4 border-green-500">
          <div className="text-sm font-medium text-green-800 mb-2">MRD输出</div>
          <div className="space-y-1 text-xs text-gray-600">
            <div>• 需求分析: 智能投资决策支持系统</div>
            <div>• 核心功能: 7维度评分、风险预警、ROI分析</div>
            <div>• 技术架构: AI算法 + 数据可视化 + 云端部署</div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "智能决策中枢",
    subtitle: "决策指挥中心",
    description: "基于MRD文档，智能决策系统自动分解任务，协调资源配置，确保最优的执行路径。",
    icon: Target,
    gradient: "from-blue-600 via-cyan-600 to-blue-800",
    stats: [
      { label: "决策速度", value: "10x", trend: "⚡" },
      { label: "资源效率", value: "95.7%", trend: "↗" },
      { label: "协作精准度", value: "98.2%", trend: "★" }
    ],
    visual: (
      <div className="p-6 space-y-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="h-8 w-8 text-white" />
          </div>
          <h4 className="font-bold text-blue-800 mb-4">决策指挥中心</h4>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: "分析模块", progress: 100, status: "完成" },
            { name: "设计模块", progress: 85, status: "进行中" },
            { name: "开发模块", progress: 60, status: "准备中" },
            { name: "测试模块", progress: 30, status: "等待中" }
          ].map((module) => (
            <div key={module.name} className="bg-white p-3 rounded-lg border border-blue-200">
              <div className="text-xs font-medium text-blue-800 mb-1">{module.name}</div>
              <div className="w-full bg-blue-100 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                  style={{width: `${module.progress}%`}}
                ></div>
              </div>
              <div className="text-xs text-gray-600 mt-1">{module.status}</div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "专业团队执行",
    subtitle: "Agent军团",
    description: "多Agent协作执行，每个Agent专精特定领域，确保交付成果的专业性和完整性。",
    icon: Users,
    gradient: "from-emerald-600 via-teal-600 to-emerald-800",
    stats: [
      { label: "协作效率", value: "24/7", trend: "⚡" },
      { label: "专业度", value: "企业级", trend: "★" },
      { label: "交付质量", value: "99.1%", trend: "↗" }
    ],
    visual: (
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: "技术专家", avatar: "🧠", status: "工作中", task: "架构设计" },
            { name: "数据专家", avatar: "📊", status: "工作中", task: "模型训练" },
            { name: "产品专家", avatar: "🎨", status: "完成", task: "界面设计" },
            { name: "测试专家", avatar: "🔍", status: "等待", task: "质量验证" }
          ].map((agent, index) => (
            <motion.div 
              key={agent.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-3 rounded-lg border border-emerald-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{agent.avatar}</span>
                <span className="text-xs font-medium text-emerald-800">{agent.name}</span>
              </div>
              <div className={`inline-block px-2 py-1 rounded-full text-xs ${
                agent.status === '工作中' ? 'bg-emerald-100 text-emerald-700' :
                agent.status === '完成' ? 'bg-green-100 text-green-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {agent.status}
              </div>
              <div className="text-xs text-gray-600 mt-1">{agent.task}</div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "云端智能托管",
    subtitle: "持续服务",
    description: "系统托管在云端，为您提供7×24小时的智能服务，所有报告和分析结果安全存储，随时可访问。",
    icon: Cloud,
    gradient: "from-cyan-600 via-blue-600 to-cyan-800",
    stats: [
      { label: "在线率", value: "99.9%", trend: "↗" },
      { label: "响应时间", value: "< 3s", trend: "⚡" },
      { label: "数据安全", value: "银行级", trend: "★" }
    ],
    visual: (
      <div className="p-6 space-y-4">
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-medium text-cyan-800">投资AI - Alex</div>
              <div className="text-xs text-cyan-600">24/7在线为您服务</div>
            </div>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">实时监控</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">报告数量</span>
              <span className="font-medium text-cyan-700">156份</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">成功率</span>
              <span className="font-medium text-cyan-700">99.1%</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-3 rounded-lg border border-cyan-200">
          <div className="text-sm font-medium text-cyan-800 mb-2">最近报告</div>
          <div className="space-y-1">
            {['Q3投资分析报告', 'AI市场趋势分析', '风险评估报告'].map((report, index) => (
              <div key={report} className="flex items-center gap-2 text-xs">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span className="text-gray-600">{report}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
];

export function ResendStyleShowcase() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // 自动播放逻辑
  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % SHOWCASE_STEPS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const currentShowcase = SHOWCASE_STEPS[currentStep];
  const Icon = currentShowcase.icon;

  const handlePrevious = () => {
    setCurrentStep((prev) => prev === 0 ? SHOWCASE_STEPS.length - 1 : prev - 1);
  };

  const handleNext = () => {
    setCurrentStep((prev) => (prev + 1) % SHOWCASE_STEPS.length);
  };

  return (
    <div className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* 标题部分 - 保持Me² NEXUS风格 */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            完整工作流程
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            从需求输入到智能交付，体验Me² NEXUS的专业服务流程
          </p>
          
          {/* 控制按钮 */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isAutoPlay 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isAutoPlay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isAutoPlay ? '暂停演示' : '自动演示'}
            </button>
          </div>
        </motion.div>

        {/* 步骤指示器 - 保持Me² NEXUS圆角风格 */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center bg-white rounded-full p-2 shadow-lg border">
            {SHOWCASE_STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => setCurrentStep(index)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                    currentStep === index
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform scale-110'
                      : currentStep > index
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                      : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                  }`}
                >
                  {currentStep > index ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    step.id
                  )}
                </button>
                {index < SHOWCASE_STEPS.length - 1 && (
                  <div className={`w-8 h-1 mx-2 rounded transition-all ${
                    currentStep > index ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-300'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 主展示区域 - Resend风格的卡片滑动但保持Me² NEXUS设计语言 */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`bg-gradient-to-br ${currentShowcase.gradient} rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden`}
            >
              {/* 背景装饰 - 保持Me² NEXUS的玻璃态效果 */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              
              <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
                {/* 左侧内容 */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold">{currentShowcase.title}</h3>
                      <p className="text-white/80">{currentShowcase.subtitle}</p>
                    </div>
                  </div>
                  
                  <p className="text-lg text-white/90 leading-relaxed">
                    {currentShowcase.description}
                  </p>
                  
                  {/* 统计数据 */}
                  {currentShowcase.stats && (
                    <div className="grid grid-cols-3 gap-4">
                      {currentShowcase.stats.map((stat, index) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center"
                        >
                          <div className="text-2xl font-bold">{stat.value}</div>
                          <div className="text-sm text-white/70">{stat.label}</div>
                          <div className="text-xs mt-1">{stat.trend}</div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 右侧可视化 */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  {currentShowcase.visual}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* 导航按钮 - 保持Me² NEXUS圆角风格 */}
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}