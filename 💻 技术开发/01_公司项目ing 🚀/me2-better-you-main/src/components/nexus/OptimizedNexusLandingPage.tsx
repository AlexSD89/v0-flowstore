"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain,
  Target,
  Users,
  ArrowRight,
  CheckCircle,
  MessageSquare,
  Sparkles,
  ChevronRight,
  User,
  Clock,
  DollarSign,
  TrendingUp,
  Building2,
  Zap,
  Play,
  Code,
  FileText,
  Settings,
  Cloud,
  AlertTriangle,
  Star,
  Globe,
  Shield
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
    label: '投资人',
    icon: TrendingUp,
    painPoint: 'VC合伙人张总：每月看50个项目，只能深度分析5个，其余全凭感觉',
    solution: '3分钟对话，AI学会你的投资逻辑，生成专业MRD和投资建议',
    value: '从70%错失率到85%准确率，每个决策节省200-500万风险',
    color: 'from-purple-600 to-indigo-600'
  },
  {
    id: 'ceo',
    label: 'CEO/CTO',
    icon: Building2,
    painPoint: '制造业CEO王总：想用AI提升效率，但不知道选哪个产品，担心踩坑',
    solution: 'AI分析你的业务场景，推荐最适合的AI解决方案和服务商',
    value: '避免60%选错风险，节省50-200万试错成本和6个月时间',
    color: 'from-blue-600 to-cyan-600'
  },
  {
    id: 'consultant',
    label: '咨询师',
    icon: Brain,
    painPoint: '战略咨询师李总：每个项目都要重新做行业分析，90%工作都在重复',
    solution: 'AI学会你的方法论，自动化重复分析，专业经验数字化复用',
    value: '效率提升300%，服务收入增长500%，从个人服务到规模化',
    color: 'from-emerald-600 to-teal-600'
  }
];

const TRUST_COMPANIES = [
  "红杉资本", "腾讯投资", "阿里巴巴", "字节跳动", "美团", "滴滴出行"
];

const PRICING_PLANS = [
  {
    name: "免费体验",
    price: "0",
    period: "永久",
    description: "快速体验Me² NEXUS的核心功能",
    features: [
      "1次专业MRD生成",
      "基础需求分析",
      "AI顾问预览",
      "邮件支持"
    ],
    cta: "立即免费体验",
    popular: false
  },
  {
    name: "专业版",
    price: "99",
    period: "月",
    description: "最受欢迎的专业AI顾问服务",
    features: [
      "无限制MRD生成",
      "专属AI顾问(3个专业领域)",
      "24/7智能分析服务",
      "高级数据源接入",
      "专属报告库",
      "优先技术支持"
    ],
    cta: "开始30天免费试用",
    popular: true
  },
  {
    name: "企业版",
    price: "399",
    period: "月",
    description: "团队协作和企业级定制功能",
    features: [
      "专业版所有功能",
      "团队协作空间",
      "自定义AI训练",
      "企业数据集成",
      "专属客户经理",
      "SLA服务保障"
    ],
    cta: "联系销售",
    popular: false
  }
];

export function OptimizedNexusLandingPage() {
  const [selectedPersona, setSelectedPersona] = useState<ProfessionalPersona>(PROFESSIONAL_PERSONAS[0]);
  const [selectedDemo, setSelectedDemo] = useState<'mrd' | 'analysis' | 'advisor'>('mrd');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
      {/* Hero Section - GitHub Copilot Style */}
      <div className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          {/* 超级简洁的Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-gray-300">Now supercharged with AI专业分身</span>
          </motion.div>
          
          {/* 核心价值主张 - 一句话说清楚 */}
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              AI that thinks 
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              like a pro
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            3分钟对话，AI学会你的专业方法。获得24/7在线的投资、企业、咨询专属顾问。
          </motion.p>
          
          {/* CTA按钮 */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button 
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 justify-center"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Brain className="h-5 w-5" />
              免费生成专业MRD
            </motion.button>
            <motion.button 
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-medium text-lg hover:bg-white/20 transition-all duration-300 flex items-center gap-2 justify-center"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              查看定价
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          </motion.div>
          
          {/* 社会证明 - GitHub Style */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-gray-500 text-sm mb-4">已为这些知名机构提供专业AI顾问服务</p>
            <div className="flex flex-wrap justify-center gap-8 items-center opacity-60">
              {TRUST_COMPANIES.map((company, index) => (
                <motion.div
                  key={company}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="text-gray-400 font-medium"
                >
                  {company}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section - Delegate like a boss */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Delegate like a boss
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              你的专业需求不再积压。分配给Me² NEXUS专属AI顾问，让你的智能分身在后台思考、分析和生成专业报告。
            </p>
          </div>

          {/* Professional Persona Selector */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {PROFESSIONAL_PERSONAS.map((persona) => {
              const Icon = persona.icon;
              const isSelected = selectedPersona.id === persona.id;
              
              return (
                <motion.button
                  key={persona.id}
                  onClick={() => setSelectedPersona(persona)}
                  className={`relative p-6 rounded-2xl border transition-all text-left ${
                    isSelected 
                      ? 'bg-white/15 border-white/30 shadow-xl scale-105' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:scale-102'
                  }`}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${persona.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2">{persona.label}专属AI顾问</h3>
                  <p className="text-gray-300 text-sm">
                    学会你的{persona.label === '投资人' ? '投资方法' : persona.label === 'CEO/CTO' ? '决策逻辑' : '咨询方法论'}，24/7为你分析
                  </p>
                  {isSelected && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl border border-purple-400/30"
                      layoutId="persona-selection"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Selected Persona Demo - 动态显示效果 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPersona.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl"
            >
              <div className="grid lg:grid-cols-2 gap-8">
                {/* 左侧：问题和解决方案 */}
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
                      className="bg-red-900/30 border border-red-500/30 rounded-2xl p-6"
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
                      className="bg-blue-900/30 border border-blue-500/30 rounded-2xl p-6"
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
                      className="bg-green-900/30 border border-green-500/30 rounded-2xl p-6"
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

                {/* 右侧：交互演示 - GitHub Copilot式动态效果 */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-white font-semibold">实时演示</h4>
                    <div className="flex gap-2">
                      {['mrd', 'analysis', 'advisor'].map((demo) => (
                        <button
                          key={demo}
                          onClick={() => setSelectedDemo(demo as any)}
                          className={`px-3 py-1 rounded-lg text-sm transition-all ${
                            selectedDemo === demo 
                              ? 'bg-purple-600 text-white' 
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {demo === 'mrd' ? 'MRD生成' : demo === 'analysis' ? 'AI分析' : 'AI顾问'}
                        </button>
                      ))}
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
                        <div className="space-y-3">
                          <motion.div 
                            className="bg-blue-900/50 rounded-lg p-4"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                          >
                            <div className="text-blue-300 text-sm mb-1">👤 用户输入</div>
                            <div className="text-blue-100 text-sm">&ldquo;我想分析一家AI医疗初创公司的投资价值...&rdquo;</div>
                          </motion.div>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: 360 }}
                            transition={{ delay: 0.3 }}
                            className="flex justify-center"
                          >
                            <ArrowRight className="h-4 w-4 text-gray-500" />
                          </motion.div>
                          <motion.div 
                            className="bg-green-900/50 rounded-lg p-4"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            <div className="text-green-300 text-sm mb-1">🤖 AI生成MRD</div>
                            <div className="space-y-1 text-xs text-green-100">
                              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
                                • 市场规模：AI医疗影像 $50B，年增长15%
                              </motion.div>
                              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}>
                                • 竞争分析：3家主要竞品，技术差异化明显
                              </motion.div>
                              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1 }}>
                                • 团队评估：核心团队清华AI博士，经验丰富
                              </motion.div>
                              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.3 }}>
                                • 投资建议：推荐投资，建议估值$200M
                              </motion.div>
                            </div>
                          </motion.div>
                        </div>
                      )}
                      
                      {selectedDemo === 'analysis' && (
                        <div className="space-y-3">
                          <div className="text-center py-8">
                            <motion.div 
                              className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
                              animate={{ 
                                scale: [1, 1.1, 1],
                                rotate: [0, 180, 360]
                              }}
                              transition={{ 
                                duration: 2, 
                                repeat: Infinity,
                                ease: "easeInOut" 
                              }}
                            >
                              <Brain className="h-8 w-8 text-white" />
                            </motion.div>
                            <div className="text-white font-medium mb-2">AI正在深度分析中...</div>
                            <div className="text-gray-400 text-sm">运用您的{selectedPersona.label}专业逻辑</div>
                            <motion.div 
                              className="w-full bg-gray-700 rounded-full h-2 mt-4"
                              initial={{ width: 0 }}
                            >
                              <motion.div 
                                className="bg-purple-600 h-2 rounded-full"
                                animate={{ width: ["0%", "30%", "60%", "90%"] }}
                                transition={{ duration: 3, repeat: Infinity }}
                              />
                            </motion.div>
                          </div>
                        </div>
                      )}
                      
                      {selectedDemo === 'advisor' && (
                        <motion.div 
                          className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg p-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <motion.div 
                              className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center"
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <selectedPersona.icon className="h-5 w-5 text-white" />
                            </motion.div>
                            <div>
                              <div className="text-white font-medium">{selectedPersona.label}AI顾问 - Alex</div>
                              <div className="text-purple-300 text-sm flex items-center gap-1">
                                <motion.div 
                                  className="w-2 h-2 bg-green-400 rounded-full"
                                  animate={{ opacity: [1, 0.5, 1] }}
                                  transition={{ duration: 1, repeat: Infinity }}
                                />
                                24/7在线服务
                              </div>
                            </div>
                          </div>
                          <motion.div 
                            className="text-purple-100 text-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            &ldquo;基于我对你投资偏好的学习，这个项目符合你关注的AI+医疗赛道，团队背景优秀，建议深度调研。&rdquo;
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

      {/* Pricing Section - GitHub Style */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Take flight with Me² NEXUS
            </h2>
            <p className="text-xl text-gray-400">
              从免费体验到专业服务，选择适合你的AI顾问计划
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {PRICING_PLANS.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border transition-all hover:scale-105 ${
                  plan.popular 
                    ? 'border-purple-500/50 shadow-2xl shadow-purple-500/20' 
                    : 'border-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      最受欢迎
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-white">¥{plan.price}</span>
                    <span className="text-gray-400 ml-2">/{plan.period}</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <motion.button 
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg'
                      : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {plan.cta}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div 
            className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-sm rounded-3xl p-12 border border-purple-500/20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-bold text-white mb-6">
              Ready to 10x Your Professional Performance?
            </h3>
            <p className="text-xl text-gray-300 mb-8">
              3分钟对话，获得永远在线的专业AI伙伴。从重复劳动到智能决策的飞跃。
            </p>
            
            <motion.button 
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 mx-auto"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Brain className="h-5 w-5" />
              免费开始体验
            </motion.button>
            
            <div className="mt-6 text-sm text-gray-400">
              无需信用卡 • 3分钟设置 • 24小时专属AI顾问上线
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}