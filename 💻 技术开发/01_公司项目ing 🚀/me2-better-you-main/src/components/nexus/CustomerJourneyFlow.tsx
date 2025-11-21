"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  FileText, 
  Target, 
  Cloud, 
  CheckCircle,
  Brain,
  Settings,
  BarChart3,
  Play,
  Pause
} from "lucide-react";

interface FlowStep {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  demo: React.ReactNode;
  description: string;
}

// 4个清晰步骤的客户体验流程
const FLOW_STEPS: FlowStep[] = [
  {
    id: 1,
    title: "需求输入 & MRD生成",
    subtitle: "智能理解，专业转译",
    icon: User,
    color: "from-blue-500 to-indigo-600",
    description: "客户自然语言输入需求，系统智能生成专业MRD文档",
    demo: (
      <div className="grid md:grid-cols-2 gap-6">
        {/* 左侧：客户输入 */}
        <div className="bg-blue-50 border-2 border-dashed border-blue-300 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-800">客户需求</span>
          </div>
          <div className="bg-white p-3 rounded border-l-4 border-blue-500">
            <p className="text-sm text-gray-700">
              &ldquo;我需要一个智能投资分析系统，能够自动评估项目风险，生成详细报告，帮助我做出更好的投资决策...&rdquo;
            </p>
          </div>
        </div>
        
        {/* 右侧：MRD生成 */}
        <div className="bg-green-50 border-2 border-green-300 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-800">MRD文档</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="bg-white p-2 rounded border-l-2 border-green-400">
              <strong>需求分析:</strong> 智能投资决策支持系统
            </div>
            <div className="bg-white p-2 rounded border-l-2 border-green-400">
              <strong>核心功能:</strong> 风险评估、数据分析、报告生成
            </div>
            <div className="bg-white p-2 rounded border-l-2 border-green-400">
              <strong>技术方案:</strong> AI算法 + 数据可视化 + 云端部署
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "智能决策 & 任务分配",
    subtitle: "Agent Core 工作中枢",
    icon: Target,
    color: "from-purple-500 to-pink-600",
    description: "基于MRD进行智能决策分析，自动分配任务给专业Agent团队",
    demo: (
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-2">
            <Target className="h-8 w-8 text-white" />
          </div>
          <h4 className="font-bold text-gray-800">Agent Core 决策中心</h4>
        </div>
        
        <div className="grid md:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-3 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="h-4 w-4 text-purple-600" />
              <span className="font-medium">分析Agent</span>
            </div>
            <p className="text-gray-600">负责数据分析和风险评估</p>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="h-4 w-4 text-purple-600" />
              <span className="font-medium">报告Agent</span>
            </div>
            <p className="text-gray-600">生成专业投资报告</p>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-1">
              <Settings className="h-4 w-4 text-purple-600" />
              <span className="font-medium">系统Agent</span>
            </div>
            <p className="text-gray-600">管理系统集成和部署</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "协作执行 & 成果汇总",
    subtitle: "专业团队协作交付",
    icon: Settings,
    color: "from-green-500 to-emerald-600",
    description: "多Agent协作执行，生成文档工具，最终汇总交付成果",
    demo: (
      <div className="bg-green-50 p-6 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {['数据分析', '风险评估', '报告生成', '系统部署'].map((task, index) => (
            <div key={task} className="bg-white p-2 rounded border border-green-200 text-center">
              <div className={`w-full bg-green-200 rounded-full h-1.5 mb-1`}>
                <div 
                  className="bg-green-500 h-1.5 rounded-full transition-all duration-1000"
                  style={{width: `${[100, 85, 70, 45][index]}%`}}
                ></div>
              </div>
              <span className="text-xs font-medium text-green-800">{task}</span>
            </div>
          ))}
        </div>
        
        <div className="bg-white p-4 rounded-lg border-2 border-green-300">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-800">交付成果</span>
          </div>
          <div className="text-sm text-gray-700">
            ✓ 智能投资分析系统<br/>
            ✓ 风险评估报告<br/>
            ✓ 数据可视化仪表板<br/>
            ✓ 云端部署方案
          </div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "云端托管 & 日常使用",
    subtitle: "专属AI伙伴常伴左右",
    icon: Cloud,
    color: "from-cyan-500 to-blue-600", 
    description: "系统托管云端，客户获得专属AI伙伴，报告库可随时访问",
    demo: (
      <div className="bg-cyan-50 p-6 rounded-lg">
        <div className="grid md:grid-cols-2 gap-4">
          {/* 专属AI伙伴 */}
          <div className="bg-white p-4 rounded-lg border border-cyan-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <h5 className="font-medium text-cyan-800">投资分析AI - Alex</h5>
                <p className="text-xs text-cyan-600">您的专属投资顾问</p>
              </div>
            </div>
            <div className="text-xs text-gray-600">
              <p>• 24/7 在线分析市场动态</p>
              <p>• 实时风险预警提醒</p>
              <p>• 个性化投资建议</p>
            </div>
          </div>
          
          {/* 报告库 */}
          <div className="bg-white p-4 rounded-lg border border-cyan-200">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-cyan-600" />
              <span className="font-medium text-cyan-800">报告存储库</span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="p-2 bg-cyan-50 rounded border-l-2 border-cyan-400 cursor-pointer hover:bg-cyan-100">
                📊 Q3投资组合分析 - 2024.08.20
              </div>
              <div className="p-2 bg-cyan-50 rounded border-l-2 border-cyan-400 cursor-pointer hover:bg-cyan-100">  
                📈 AI市场趋势报告 - 2024.08.18
              </div>
              <div className="p-2 bg-cyan-50 rounded border-l-2 border-cyan-400 cursor-pointer hover:bg-cyan-100">
                ⚠️ 风险评估报告 - 2024.08.15
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
];

export function CustomerJourneyFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  // 自动播放逻辑
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => (prev >= FLOW_STEPS.length ? 1 : prev + 1));
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentStepData = FLOW_STEPS.find(step => step.id === currentStep) || FLOW_STEPS[0];

  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* 标题区域 */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            体验您的专属AI决策流程
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            从需求输入到智能交付，感受Me² NEXUS的完整服务体验
          </p>
          
          {/* 控制按钮 */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isPlaying 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying ? '暂停演示' : '自动演示'}
            </button>
            <span className="text-gray-500">当前步骤: {currentStep}/4</span>
          </div>
        </motion.div>

        {/* 步骤指示器 */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center bg-white rounded-full p-2 shadow-lg border">
            {FLOW_STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                    currentStep === step.id
                      ? 'bg-blue-600 text-white shadow-lg transform scale-110'
                      : currentStep > step.id
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    step.id
                  )}
                </button>
                {index < FLOW_STEPS.length - 1 && (
                  <div className={`w-8 h-1 mx-2 rounded transition-all ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 当前步骤展示 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-8 shadow-xl border"
          >
            {/* 步骤头部 */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${currentStepData.color} flex items-center justify-center shadow-lg`}>
                <currentStepData.icon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{currentStepData.title}</h3>
                <p className="text-gray-600">{currentStepData.subtitle}</p>
              </div>
            </div>

            {/* 步骤描述 */}
            <p className="text-gray-700 mb-6">{currentStepData.description}</p>

            {/* 步骤演示 */}
            <div className="bg-gray-50 rounded-xl p-6">
              {currentStepData.demo}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 导航按钮 */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            上一步
          </button>
          <button
            onClick={() => setCurrentStep(Math.min(FLOW_STEPS.length, currentStep + 1))}
            disabled={currentStep === FLOW_STEPS.length}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            下一步
          </button>
        </div>
      </div>
    </div>
  );
}