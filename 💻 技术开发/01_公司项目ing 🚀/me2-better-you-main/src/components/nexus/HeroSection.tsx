"use client";
import React, { useState } from "react";
import { BrainCircuit, Zap, Target, Brain, Building2, TrendingUp, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface HeroProps {
  title: string;
  subtitle: string;
  highlights: string[];
  badges?: { label: string; value: string }[];
  cta: { main: string; secondary: string };
}

interface ProfessionalPersona {
  id: 'investor' | 'ceo' | 'consultant';
  label: string;
  icon: React.ElementType;
  painPoint: string;
  solution: string;
  proof: string;
  color: string;
}

const PROFESSIONAL_PERSONAS: ProfessionalPersona[] = [
  {
    id: 'investor',
    label: '投资人',
    icon: TrendingUp,
    painPoint: '信息过载，错失好项目，投资决策依赖直觉',
    solution: '7维度智能评分，50万投资6个月1.5倍回报',
    proof: '已帮助120+投资人提升决策准确率85%',
    color: 'from-purple-600 to-indigo-600'
  },
  {
    id: 'ceo',
    label: 'CEO/CTO',
    icon: Building2,
    painPoint: '数字化转型困难，AI选型迷茫，效率提升缓慢',
    solution: 'McKinsey级决策分析，AI产品精准推荐',
    proof: '制造业客户转型后效率提升40%，成本降低30%',
    color: 'from-blue-600 to-cyan-600'
  },
  {
    id: 'consultant',
    label: '咨询顾问',
    icon: Brain,
    painPoint: '重复性分析工作，专业知识难复用，扩展受限',
    solution: 'Know-How数字化，AI分身24/7为你服务',
    proof: '咨询公司服务收入增长500%，客户满意度98%',
    color: 'from-emerald-600 to-teal-600'
  }
];

export function HeroSection({ subtitle, highlights, badges, cta }: HeroProps) {
  const [selectedPersona, setSelectedPersona] = useState<ProfessionalPersona>(PROFESSIONAL_PERSONAS[0]);

  return (
    <div className="min-h-screen flex items-center justify-center py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* 专业身份选择器 */}
        <div className="text-center mb-12">
          <motion.div 
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Target className="h-4 w-4 text-purple-600" />
            <span className="text-sm text-gray-600">为专业人士量身定制的AI决策系统</span>
          </motion.div>
          
          {/* 角色选择器 */}
          <div className="flex justify-center gap-4 mb-8">
            {PROFESSIONAL_PERSONAS.map((persona, index) => {
              const Icon = persona.icon;
              return (
                <motion.button
                  key={persona.id}
                  className={`relative px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                    selectedPersona.id === persona.id
                      ? 'bg-white text-gray-900 shadow-lg scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                  onClick={() => setSelectedPersona(persona)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${persona.color} flex items-center justify-center`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    {persona.label}
                  </div>
                  {selectedPersona.id === persona.id && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-xl border border-purple-200"
                      layoutId="persona-selection"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 左侧：核心价值主张 */}
          <motion.div 
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.h1 
              className="text-4xl sm:text-6xl font-bold leading-tight mb-6"
              key={selectedPersona.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                不是AI工具
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                而是会思考的
              </span>
              <br />
              <span className={`bg-gradient-to-r ${selectedPersona.color} bg-clip-text text-transparent`}>
                专业分身
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 mb-8 leading-relaxed"
              key={`subtitle-${selectedPersona.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {subtitle}
            </motion.p>

            {/* 性能指标 */}
            {badges && (
              <div className="flex justify-center lg:justify-start gap-6 mb-8">
                {badges.map((badge, index) => (
                  <motion.div
                    key={badge.label}
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <div className="text-2xl font-bold text-purple-600">{badge.value}</div>
                    <div className="text-sm text-gray-600">{badge.label}</div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* CTA按钮 */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <motion.button 
                className={`px-8 py-4 bg-gradient-to-r ${selectedPersona.color} text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 justify-center`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <BrainCircuit className="h-5 w-5" />
                {cta.main}
              </motion.button>
              <motion.button 
                className="px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium text-lg hover:bg-gray-50 transition-all duration-300 flex items-center gap-2 justify-center"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                {cta.secondary}
                <ChevronRight className="h-4 w-4" />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* 右侧：角色定制化内容 */}
          <motion.div 
            className="lg:pl-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedPersona.id}
                className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${selectedPersona.color} flex items-center justify-center`}>
                    <selectedPersona.icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedPersona.label}专属</h3>
                    <p className="text-gray-600">智能决策系统</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">❌ 您的痛点</h4>
                    <p className="text-red-700 text-sm">{selectedPersona.painPoint}</p>
                  </div>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">💡 Me² NEXUS解决方案</h4>
                    <p className="text-blue-700 text-sm">{selectedPersona.solution}</p>
                  </div>
                  
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">📊 成功证明</h4>
                    <p className="text-green-700 text-sm">{selectedPersona.proof}</p>
                  </div>
                </div>
                
                <motion.div 
                  className="mt-6 pt-6 border-t border-gray-100 text-center"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-sm text-gray-600 mb-2">立即体验</div>
                  <div className={`text-lg font-bold bg-gradient-to-r ${selectedPersona.color} bg-clip-text text-transparent`}>
                    免费生成您的专业MRD
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
        
        {/* 核心能力展示 */}
        <motion.div 
          className="mt-16 grid md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          {highlights.map((highlight, index) => (
            <motion.div 
              key={highlight}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-100 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div className="font-medium text-gray-900">{highlight}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
