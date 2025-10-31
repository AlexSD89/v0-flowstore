"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, 
  Target, 
  Users, 
  Zap, 
  Cpu, 
  ChevronRight,
  Activity,
  Shield,
  CheckCircle
} from "lucide-react";

interface ArchitectureLevel {
  id: 'mrd' | 'decision' | 'agents';
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  color: string;
  gradientColor: string;
  capabilities: string[];
  metrics: { label: string; value: string; trend: 'up' | 'stable' }[];
  techSpecs: { label: string; value: string }[];
}

const ARCHITECTURE_LEVELS: ArchitectureLevel[] = [
  {
    id: 'mrd',
    title: 'MRD理解层',
    subtitle: '智能需求解析',
    description: '通过深度语义分析，精确理解用户的专业需求和业务场景，将复杂的自然语言转换为结构化的需求文档',
    icon: Brain,
    color: 'text-purple-600',
    gradientColor: 'from-purple-600 to-violet-600',
    capabilities: [
      '自然语言语义分析',
      '专业术语智能识别', 
      '需求分类和优先级',
      '业务场景理解',
      'MRD文档自动生成'
    ],
    metrics: [
      { label: '理解准确率', value: '96.8%', trend: 'up' },
      { label: '处理速度', value: '< 3分钟', trend: 'stable' },
      { label: '需求匹配度', value: '94.2%', trend: 'up' }
    ],
    techSpecs: [
      { label: '语言模型', value: 'GPT-4 Turbo + 专业微调' },
      { label: '处理能力', value: '10万token/分钟' },
      { label: '支持语言', value: '中文、英文、专业术语' }
    ]
  },
  {
    id: 'decision',
    title: '决策指挥中心',
    subtitle: '智能分析决策',
    description: '基于多源数据融合和知识图谱，进行深度分析和决策推理，为用户提供最优的解决方案建议',
    icon: Target,
    color: 'text-blue-600',
    gradientColor: 'from-blue-600 to-indigo-600',
    capabilities: [
      '多维度数据分析',
      '决策树智能构建',
      '风险评估建模',
      '方案对比优化',
      '实时市场匹配'
    ],
    metrics: [
      { label: '决策准确率', value: '92.5%', trend: 'up' },
      { label: '分析深度', value: '7个维度', trend: 'stable' },
      { label: '响应时间', value: '< 30秒', trend: 'up' }
    ],
    techSpecs: [
      { label: '数据源', value: '200+ API实时接入' },
      { label: '处理架构', value: '分布式向量计算' },
      { label: '决策引擎', value: '多Agent协作推理' }
    ]
  },
  {
    id: 'agents',
    title: 'Agent军团',
    subtitle: '专业协作执行',
    description: '8个专业Agent并行协作，每个都专精特定领域，确保从需求到交付的全链路专业化处理',
    icon: Users,
    color: 'text-cyan-600', 
    gradientColor: 'from-cyan-600 to-teal-600',
    capabilities: [
      '8个专业Agent并行',
      '任务智能分配',
      '质量交叉验证',
      '成果实时整合',
      '24/7无间断服务'
    ],
    metrics: [
      { label: '协作效率', value: '95.7%', trend: 'up' },
      { label: '质量一致性', value: '98.3%', trend: 'stable' },
      { label: '并发处理', value: '100+任务', trend: 'up' }
    ],
    techSpecs: [
      { label: 'Agent数量', value: '8个专业Agent' },
      { label: '协作协议', value: 'Multi-Agent Framework' },
      { label: '质量保证', value: '三重验证机制' }
    ]
  }
];

export function InteractiveArchitecture() {
  const [selectedLevel, setSelectedLevel] = useState<ArchitectureLevel>(ARCHITECTURE_LEVELS[0]);
  const [activeDemo, setActiveDemo] = useState<'metrics' | 'tech' | 'flow'>('metrics');

  return (
    <div className="py-16 bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* 标题区域 */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            NEXUS三级智能架构
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            从需求理解到决策执行的完整AI协作体系
          </p>
          
          {/* 架构总览指标 */}
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { label: '处理速度', value: '30秒', icon: Zap },
              { label: '准确率', value: '95.2%', icon: Target },
              { label: 'Agent协作', value: '8个专业', icon: Users },
              { label: '可用性', value: '99.9%', icon: Shield }
            ].map((metric, index) => (
              <motion.div
                key={metric.label}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-center mb-2">
                  <metric.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* 左侧：架构层级选择 */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">系统架构层级</h3>
            
            {ARCHITECTURE_LEVELS.map((level, index) => {
              const Icon = level.icon;
              const isSelected = selectedLevel.id === level.id;
              
              return (
                <motion.div
                  key={level.id}
                  className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    isSelected 
                      ? 'border-blue-300 bg-blue-50 shadow-lg' 
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => setSelectedLevel(level)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${level.gradientColor} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-1">{level.title}</h4>
                      <p className={`text-sm font-medium mb-2 ${level.color}`}>{level.subtitle}</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{level.description}</p>
                    </div>
                    <ChevronRight className={`h-5 w-5 transition-colors ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                  </div>
                  
                  {/* 选中指示器 */}
                  {isSelected && (
                    <motion.div
                      className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-500 rounded-l-xl"
                      layoutId="selected-indicator"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.div>
              );
            })}
          </motion.div>

          {/* 右侧：详细信息展示 */}
          <motion.div 
            className="lg:sticky lg:top-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedLevel.id}
                className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                {/* 层级标题 */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${selectedLevel.gradientColor} flex items-center justify-center`}>
                    <selectedLevel.icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedLevel.title}</h3>
                    <p className={`font-medium ${selectedLevel.color}`}>{selectedLevel.subtitle}</p>
                  </div>
                </div>

                <p className="text-gray-700 mb-8 leading-relaxed">{selectedLevel.description}</p>

                {/* 标签页切换 */}
                <div className="flex gap-2 mb-6 bg-gray-100 rounded-lg p-1">
                  {[
                    { id: 'metrics', label: '核心指标', icon: Activity },
                    { id: 'tech', label: '技术规格', icon: Cpu },
                    { id: 'flow', label: '核心能力', icon: CheckCircle }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveDemo(tab.id as 'metrics' | 'tech' | 'flow')}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        activeDemo === tab.id
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* 内容展示区域 */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeDemo}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeDemo === 'metrics' && (
                      <div className="grid grid-cols-1 gap-4">
                        {selectedLevel.metrics.map((metric) => (
                          <div key={metric.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <span className="text-gray-700 font-medium">{metric.label}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-gray-900">{metric.value}</span>
                              <div className={`w-2 h-2 rounded-full ${
                                metric.trend === 'up' ? 'bg-green-500' : 'bg-blue-500'
                              }`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeDemo === 'tech' && (
                      <div className="space-y-4">
                        {selectedLevel.techSpecs.map((spec) => (
                          <div key={spec.label} className="border-l-4 border-blue-500 pl-4">
                            <div className="font-semibold text-gray-900">{spec.label}</div>
                            <div className="text-gray-600 text-sm mt-1">{spec.value}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeDemo === 'flow' && (
                      <div className="space-y-3">
                        {selectedLevel.capabilities.map((capability, index) => (
                          <motion.div
                            key={capability}
                            className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                            <span className="text-gray-800">{capability}</span>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* 底部工作流程图 */}
        <motion.div 
          className="mt-16 bg-white rounded-2xl p-8 shadow-xl border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">完整工作流程</h3>
          
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {ARCHITECTURE_LEVELS.map((level, index) => {
              const Icon = level.icon;
              return (
                <React.Fragment key={level.id}>
                  <motion.div 
                    className="flex flex-col items-center text-center max-w-xs"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${level.gradientColor} flex items-center justify-center mb-4 shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">{level.title}</h4>
                    <p className="text-sm text-gray-600">{level.subtitle}</p>
                  </motion.div>
                  
                  {index < ARCHITECTURE_LEVELS.length - 1 && (
                    <motion.div 
                      className="flex-1 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 mx-4"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 1.2 + index * 0.2, duration: 0.5 }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}