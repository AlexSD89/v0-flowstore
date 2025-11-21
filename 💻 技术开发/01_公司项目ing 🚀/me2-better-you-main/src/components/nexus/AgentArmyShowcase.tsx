"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, 
  Target, 
  Users,
  Activity,
  BarChart3
} from "lucide-react";

interface Layer {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  progress: number;
  status: 'processing' | 'completed' | 'idle';
  currentTask: string;
  capabilities: string[];
}

// 三层架构体系数据
const THREE_TIER_SYSTEM: Layer[] = [
  {
    id: 'mrd-layer',
    name: 'MRD理解层',
    description: '智能需求分析',
    icon: Brain,
    color: 'from-purple-500 to-indigo-600',
    progress: 85,
    status: 'processing',
    currentTask: '正在深度理解客户需求，构建专业MRD文档...',
    capabilities: ['需求理解', 'MRD生成', '场景分析', '技术转译']
  },
  {
    id: 'decision-center',
    name: '决策指挥中心', 
    description: '智能分析决策',
    icon: Target,
    color: 'from-blue-500 to-cyan-600',
    progress: 92,
    status: 'processing',
    currentTask: '基于MRD进行智能决策，分配任务组织工作...',
    capabilities: ['智能决策', '任务分配', '资源调度', '策略制定']
  },
  {
    id: 'agent-army',
    name: 'Agent军团',
    description: '专业协作执行',
    icon: Users,
    color: 'from-green-500 to-emerald-600', 
    progress: 78,
    status: 'processing',
    currentTask: '专业Agent团队协作执行，生成最终交付成果...',
    capabilities: ['专业执行', '协作配合', '质量保证', '成果交付']
  }
];

const STATUS_CONFIG = {
  processing: {
    label: '运行中',
    color: 'text-blue-300',
    bgColor: 'bg-blue-900/30',
    dotColor: 'bg-blue-400'
  },
  completed: {
    label: '已完成',
    color: 'text-green-300',
    bgColor: 'bg-green-900/30',
    dotColor: 'bg-green-400'
  },
  idle: {
    label: '待机中',
    color: 'text-gray-300',
    bgColor: 'bg-gray-700/30',
    dotColor: 'bg-gray-400'
  }
};

export function AgentArmyShowcase() {
  const [selectedLayer, setSelectedLayer] = useState<Layer>(THREE_TIER_SYSTEM[0]);
  const [viewMode, setViewMode] = useState<'overview' | 'detail'>('overview');

  // 计算三层体系整体进度
  const getOverallProgress = () => {
    const totalProgress = THREE_TIER_SYSTEM.reduce((sum, layer) => sum + layer.progress, 0);
    return Math.round(totalProgress / THREE_TIER_SYSTEM.length);
  };

  const getActiveLayerCount = () => {
    return THREE_TIER_SYSTEM.filter(layer => layer.status === 'processing').length;
  };

  return (
    <div className="py-16 bg-gradient-to-br from-slate-900 via-gray-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* 标题区域 */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Me² NEXUS 三层智能架构
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            三层协作体系，为您提供完整的AI决策支持体验
          </p>
          
          {/* 实时状态总览 */}
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-blue-400">{getOverallProgress()}%</div>
              <div className="text-sm text-gray-300">总体进度</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-green-400">{getActiveLayerCount()}</div>
              <div className="text-sm text-gray-300">活跃层级</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-yellow-400">95.7%</div>
              <div className="text-sm text-gray-300">协作效率</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-purple-400">24/7</div>
              <div className="text-sm text-gray-300">在线服务</div>
            </div>
          </div>

          {/* 视图切换 */}
          <div className="flex justify-center gap-2 mb-8">
            {[
              { id: 'overview', label: '架构总览', icon: Activity },
              { id: 'detail', label: '层级详情', icon: BarChart3 }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as 'overview' | 'detail')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === mode.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <mode.icon className="h-4 w-4" />
                {mode.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* 主要内容区域 */}
        <AnimatePresence mode="wait">
          {viewMode === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* 三层架构可视化 */}
              <div className="relative">
                {/* 连接线 */}
                <div className="absolute left-1/2 top-24 bottom-24 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-green-500 transform -translate-x-0.5"></div>
                
                {/* 层级展示 */}
                <div className="space-y-8">
                  {THREE_TIER_SYSTEM.map((layer, index) => {
                    const Icon = layer.icon;
                    const statusConfig = STATUS_CONFIG[layer.status];
                    
                    return (
                      <motion.div
                        key={layer.id}
                        className="relative"
                        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                      >
                        <div className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} gap-8`}>
                          {/* 层级卡片 */}
                          <div 
                            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all cursor-pointer flex-1 max-w-md"
                            onClick={() => {setSelectedLayer(layer); setViewMode('detail');}}
                          >
                            <div className="flex items-center gap-4 mb-4">
                              <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${layer.color} flex items-center justify-center shadow-lg`}>
                                <Icon className="h-8 w-8 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-white mb-1">{layer.name}</h3>
                                <p className="text-gray-400 text-sm">{layer.description}</p>
                              </div>
                            </div>
                            
                            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${statusConfig.bgColor} mb-3`}>
                              <div className={`w-2 h-2 rounded-full ${statusConfig.dotColor} animate-pulse`}></div>
                              <span className={`text-xs font-medium ${statusConfig.color}`}>{statusConfig.label}</span>
                            </div>
                            
                            <p className="text-sm text-gray-300 mb-4">{layer.currentTask}</p>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs text-gray-400">
                                <span>进度</span>
                                <span>{layer.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full bg-gradient-to-r ${layer.color} transition-all duration-500`}
                                  style={{width: `${layer.progress}%`}}
                                ></div>
                              </div>
                            </div>
                          </div>
                          
                          {/* 层级指示器 */}
                          <div className="relative z-10">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-gray-800 to-gray-700 border-4 border-white/20 flex items-center justify-center">
                              <span className="text-2xl font-bold text-white">{index + 1}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {viewMode === 'detail' && (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
            >
              <div className="grid lg:grid-cols-2 gap-8">
                {/* 左侧：层级信息 */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${selectedLayer.color} flex items-center justify-center shadow-lg`}>
                      <selectedLayer.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{selectedLayer.name}</h3>
                      <p className="text-gray-400">{selectedLayer.description}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed">{selectedLayer.currentTask}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">核心能力</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedLayer.capabilities.map((capability) => (
                          <span 
                            key={capability}
                            className="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300 border border-white/20"
                          >
                            {capability}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 右侧：性能指标 */}
                <div>
                  <h4 className="font-semibold text-white mb-4">运行状态</h4>
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300">完成进度</span>
                        <span className="text-green-400 font-bold">{selectedLayer.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-gradient-to-r ${selectedLayer.color}`}
                          style={{width: `${selectedLayer.progress}%`}}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300">运行状态</span>
                        <span className={`font-bold ${
                          selectedLayer.status === 'processing' ? 'text-blue-400' :
                          selectedLayer.status === 'completed' ? 'text-green-400' : 'text-gray-400'
                        }`}>
                          {STATUS_CONFIG[selectedLayer.status].label}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <h5 className="text-white font-medium mb-2">当前任务</h5>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {selectedLayer.currentTask}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex gap-2">
                    <button 
                      onClick={() => setViewMode('overview')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      返回总览
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}