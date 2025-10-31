"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingDown,
  AlertTriangle,
  Brain,
  Building2,
  Target,
  DollarSign,
  Users,
  ChevronRight
} from "lucide-react";

interface ProfessionalScenario {
  id: string;
  title: string;
  persona: string;
  painPoint: string;
  realScenario: string;
  specificProblem: string;
  currentSolution: string;
  failureRate: string;
  costImpact: string;
  icon: React.ElementType;
  gradient: string;
}

const PROFESSIONAL_SCENARIOS: ProfessionalScenario[] = [
  {
    id: 'investor',
    title: 'InvestNEXUS 投资顾问',
    persona: '投资人专用',
    painPoint: '投资决策靠直觉，错失好项目',
    realScenario: 'VC合伙人张总：每月看50个项目，只能深度分析5个，其余全凭感觉',
    specificProblem: '信息过载 + 分析时间不够 + 缺乏系统化评估',
    currentSolution: '人工筛选 + Excel表格 + 凭经验判断',
    failureRate: '70%项目错失或判断失误',
    costImpact: '每个错误决策：平均损失200-500万',
    icon: TrendingDown,
    gradient: 'from-purple-600 to-indigo-600'
  },
  {
    id: 'enterprise',
    title: 'BizNEXUS 企业顾问', 
    persona: 'CEO/CTO专用',
    painPoint: 'AI选型迷茫，数字化转型困难',
    realScenario: '制造业CEO王总：想用AI提升效率，但市面上AI产品太多，不知道选哪个',
    specificProblem: 'AI产品眼花缭乱 + 不知道哪个适合 + 担心踩坑',
    currentSolution: '咨询公司建议 + 网上搜索 + 朋友推荐',
    failureRate: '60%企业选错AI工具',
    costImpact: '每次选错：浪费50-200万 + 6个月时间',
    icon: Building2,
    gradient: 'from-blue-600 to-cyan-600'
  },
  {
    id: 'consultant',
    title: 'ConsultNEXUS 咨询顾问',
    persona: '专业咨询师专用', 
    painPoint: '重复分析累死人，专业经验难复用',
    realScenario: '战略咨询师李总：每个项目都要重新做行业分析，90%工作都在重复',
    specificProblem: '重复性工作占90% + 专业经验无法沉淀 + 扩张受限',
    currentSolution: '人工分析 + Word模板 + 团队加班',
    failureRate: '无法标准化，难以规模化',
    costImpact: '效率低下：收入增长有天花板',
    icon: Brain,
    gradient: 'from-emerald-600 to-teal-600'
  }
];

export function IndustryPainPoints() {
  const [selectedScenario, setSelectedScenario] = useState(PROFESSIONAL_SCENARIOS[0]);

  return (
    <div className="py-16 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
      <div className="max-w-6xl mx-auto px-6">
        {/* 标题区域 */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
            <Target className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-gray-300">真实专业场景</span>
          </div>
          <h2 className="text-4xl font-bold mb-4 text-white">
            专业人士的真实困境
          </h2>
          <p className="text-xl text-gray-400 mb-8 leading-relaxed">
            每个专业人士都有自己的分析方法，但都面临相同的效率瓶颈
          </p>
        </motion.div>

        {/* 专业角色选择 */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {PROFESSIONAL_SCENARIOS.map((scenario, index) => {
            const Icon = scenario.icon;
            const isSelected = selectedScenario.id === scenario.id;
            
            return (
              <motion.button
                key={scenario.id}
                onClick={() => setSelectedScenario(scenario)}
                className={`relative p-6 rounded-2xl border transition-all text-left ${
                  isSelected 
                    ? 'bg-white/15 border-white/30 shadow-xl scale-105' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:scale-102'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${scenario.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{scenario.title}</h3>
                <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs text-white/80 mb-3">
                  {scenario.persona}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {scenario.painPoint}
                </p>
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl border border-purple-400/30"
                    layoutId="scenario-selection"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* 场景详情 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedScenario.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl"
          >
            <div className="grid lg:grid-cols-3 gap-8">
              {/* 左侧：真实场景 */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${selectedScenario.gradient} flex items-center justify-center shadow-2xl`}>
                    <selectedScenario.icon className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">{selectedScenario.title}</h3>
                    <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white/90">
                      {selectedScenario.persona}
                    </div>
                  </div>
                </div>
                
                {/* 真实场景描述 */}
                <div className="bg-gradient-to-r from-orange-900/40 to-red-900/40 border border-orange-500/30 rounded-2xl p-6 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-orange-400" />
                    <span className="font-semibold text-orange-300">真实场景</span>
                  </div>
                  <p className="text-orange-100 leading-relaxed mb-4">{selectedScenario.realScenario}</p>
                  <div className="text-sm text-orange-200">
                    <strong>具体问题：</strong>{selectedScenario.specificProblem}
                  </div>
                </div>
                
                {/* 当前解决方案的问题 */}
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-600/30 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <span className="font-semibold text-gray-300">传统做法的问题</span>
                  </div>
                  <p className="text-gray-300 mb-3">{selectedScenario.currentSolution}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-red-300">
                      <div className="text-xs text-red-400 font-medium">失败率</div>
                      <div className="text-lg font-bold">{selectedScenario.failureRate}</div>
                    </div>
                    <div className="text-red-300">
                      <div className="text-xs text-red-400 font-medium">成本影响</div>
                      <div className="text-lg font-bold">{selectedScenario.costImpact}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 右侧：Me² NEXUS解决方案 */}
              <div>
                <div className={`bg-gradient-to-br ${selectedScenario.gradient} rounded-2xl p-6 text-white shadow-xl`}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Target className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-lg">专属AI顾问解决方案</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-sm opacity-90 mb-1">3分钟对话</div>
                      <div className="font-medium">AI学会你的分析方法</div>
                    </div>
                    
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-sm opacity-90 mb-1">24小时交付</div>
                      <div className="font-medium">专属AI顾问上线服务</div>
                    </div>
                    
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-sm opacity-90 mb-1">99元/月</div>
                      <div className="font-medium">永远在线的专业伙伴</div>
                    </div>
                  </div>
                  
                  <motion.button
                    className="w-full mt-6 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 flex items-center justify-center gap-2 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="font-medium">免费体验专属顾问</span>
                    <ChevronRight className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </div>
            
            {/* 底部流程预告 */}
            <motion.div 
              className="mt-8 p-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl border border-purple-500/20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-center">
                <div className="text-purple-300 mb-2 text-sm font-medium">向下查看</div>
                <div className="text-white text-lg font-bold">完整服务流程演示</div>
                <div className="text-purple-200 text-sm mt-1">看看AI顾问如何为你工作</div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}