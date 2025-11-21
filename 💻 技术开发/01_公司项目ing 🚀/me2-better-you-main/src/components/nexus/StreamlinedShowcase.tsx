"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
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
  AlertTriangle
} from "lucide-react";

interface ShowcaseSection {
  id: string;
  title: string;
  problem: string;
  solution: string;
  value: string;
  icon: React.ElementType;
  gradient: string;
  demo: React.ReactNode;
  metrics: {
    before: string;
    after: string;
    improvement: string;
  };
}

const SHOWCASE_FLOW: ShowcaseSection[] = [
  {
    id: "problem",
    title: "专业人士的真实困境",
    problem: "VC合伙人张总：每月看50个项目，只能深度分析5个，其余全凭感觉",
    solution: "Me² NEXUS为您提供专属投资分析AI顾问",
    value: "从直觉决策升级为数据驱动的精准投资",
    icon: AlertTriangle,
    gradient: "from-red-500 to-orange-500",
    metrics: {
      before: "70%项目错失",
      after: "85%决策准确率",
      improvement: "+215%投资成功率"
    },
    demo: (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
            <User className="h-5 w-5" />
          </div>
          <div>
            <div className="font-bold">投资人张总</div>
            <div className="text-gray-400 text-sm">VC合伙人 • 月看50个项目</div>
          </div>
        </div>
        <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 mb-4">
          <div className="text-red-300 text-sm mb-2">💭 传统困境</div>
          <div className="text-red-100">"时间不够，只能凭经验和直觉快速判断，经常错过好项目"</div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="text-red-400 font-bold">15-30天</div>
            <div className="text-gray-300 text-xs">人工分析时间</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="text-red-400 font-bold">70%</div>
            <div className="text-gray-300 text-xs">项目错失率</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="text-red-400 font-bold">200-500万</div>
            <div className="text-gray-300 text-xs">每次错误成本</div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "solution",
    title: "3分钟生成专业MRD",
    problem: "复杂需求难以表达，传统分析太慢太贵",
    solution: "AI学会你的分析方法，3分钟对话生成专业级MRD",
    value: "专业分析师级别的需求理解和结构化输出",
    icon: MessageSquare,
    gradient: "from-purple-600 to-indigo-600",
    metrics: {
      before: "15-30天人工分析",
      after: "3分钟AI理解",
      improvement: "效率提升300倍"
    },
    demo: (
      <div className="space-y-4">
        <div className="bg-blue-900/30 border border-blue-500/30 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-4 w-4 text-blue-400" />
            <span className="text-blue-300 text-sm">客户输入 (自然语言)</span>
          </div>
          <div className="text-blue-100 text-sm">
            "我需要分析一家AI医疗初创公司，团队20人，B轮融资，主要做影像识别..."
          </div>
        </div>
        <div className="flex justify-center">
          <ArrowRight className="h-6 w-6 text-purple-400" />
        </div>
        <div className="bg-green-900/30 border border-green-500/30 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-green-400" />
            <span className="text-green-300 text-sm">AI生成专业MRD</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="bg-green-800/50 rounded p-2">✓ 市场规模分析：AI医疗影像市场$50亿</div>
            <div className="bg-green-800/50 rounded p-2">✓ 竞争格局：主要竞品3家，技术对比</div>
            <div className="bg-green-800/50 rounded p-2">✓ 团队评估：CTO清华AI博士，核心团队稳定</div>
            <div className="bg-green-800/50 rounded p-2">✓ 投资建议：推荐投资，建议估值$200M</div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "architecture",
    title: "三层AI架构为您工作",
    problem: "AI工具千篇一律，无法学会你的专业方法",
    solution: "NEXUS三层架构：理解→决策→执行，学会你的思维方式",
    value: "像拥有一个永远在线的专业分析团队",
    icon: Brain,
    gradient: "from-blue-600 to-cyan-600",
    metrics: {
      before: "通用AI回答",
      after: "专业级分析",
      improvement: "准确率提升85%"
    },
    demo: (
      <div className="space-y-4">
        <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-5 w-5 text-purple-400" />
            <span className="text-purple-300 font-medium">MRD理解层</span>
          </div>
          <div className="text-purple-100 text-sm">智能理解你的需求，转化为结构化分析框架</div>
          <div className="mt-2 flex gap-2">
            {["语义分析师", "需求架构师", "场景分析师"].map(agent => (
              <div key={agent} className="bg-purple-700/50 text-purple-200 px-2 py-1 rounded text-xs">
                {agent}
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-5 w-5 text-blue-400" />
            <span className="text-blue-300 font-medium">决策指挥中心</span>
          </div>
          <div className="text-blue-100 text-sm">NEXUS Master智能决策，分配最适合的专业Agent</div>
          <div className="mt-2 flex gap-2">
            {["决策分析师", "资源调度师", "质量管控师"].map(agent => (
              <div key={agent} className="bg-blue-700/50 text-blue-200 px-2 py-1 rounded text-xs">
                {agent}
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-5 w-5 text-emerald-400" />
            <span className="text-emerald-300 font-medium">专业Agent军团</span>
          </div>
          <div className="text-emerald-100 text-sm">多专业Agent并行协作，生成专业级分析报告</div>
          <div className="mt-2 flex gap-2">
            {["投资分析师", "技术评估师", "市场研究师"].map(agent => (
              <div key={agent} className="bg-emerald-700/50 text-emerald-200 px-2 py-1 rounded text-xs">
                {agent}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  {
    id: "value",
    title: "24/7专属AI顾问",
    problem: "专业咨询师昂贵且不能随时服务",
    solution: "99元/月获得专属AI顾问，永远在线的专业伙伴",
    value: "传统咨询费用的1%，获得24/7专业服务",
    icon: Sparkles,
    gradient: "from-emerald-600 to-teal-600",
    metrics: {
      before: "5000元/天咨询费",
      after: "99元/月全天候",
      improvement: "成本降低99%"
    },
    demo: (
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Sparkles className="h-8 w-8" />
          </div>
          <h4 className="text-xl font-bold mb-2">投资分析AI - Alex</h4>
          <div className="text-emerald-100">您的专属投资顾问</div>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <div className="text-sm opacity-90 mb-1">实时分析</div>
            <div className="font-medium">24/7监控市场动态，主动提供投资建议</div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <div className="text-sm opacity-90 mb-1">专业服务</div>
            <div className="font-medium">基于你的投资逻辑，个性化分析报告</div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <div className="text-sm opacity-90 mb-1">成本对比</div>
            <div className="font-medium">99元/月 vs 传统咨询5000元/天</div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-white/80 text-sm mb-3">价值对比</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-900/50 rounded-lg p-3">
              <div className="text-red-300 text-sm">传统咨询</div>
              <div className="font-bold">150万/年</div>
              <div className="text-xs text-red-200">工作日8小时</div>
            </div>
            <div className="bg-green-900/50 rounded-lg p-3">
              <div className="text-green-300 text-sm">Me² NEXUS</div>
              <div className="font-bold">1188元/年</div>
              <div className="text-xs text-green-200">24/7全天候</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
];

export function StreamlinedShowcase() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlay) {
      interval = setInterval(() => {
        setCurrentSection((prev) => (prev + 1) % SHOWCASE_FLOW.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const ScrollToSection = ({ index }: { index: number }) => {
    sectionRefs.current[index]?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'center'
    });
    setCurrentSection(index);
  };

  return (
    <div className="py-16 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* 导航控制 */}
        <div className="sticky top-6 z-50 mb-12">
          <div className="flex justify-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 border border-white/20 shadow-2xl">
              <div className="flex items-center gap-2">
                {SHOWCASE_FLOW.map((section, index) => (
                  <motion.button
                    key={section.id}
                    onClick={() => ScrollToSection({ index })}
                    className={`relative px-4 py-2 rounded-xl transition-all text-sm font-medium ${
                      currentSection === index
                        ? 'bg-white/20 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-lg bg-gradient-to-r ${section.gradient} flex items-center justify-center`}>
                        <section.icon className="h-3 w-3 text-white" />
                      </div>
                      <span className="hidden md:block">{section.title.split('')[0]}...</span>
                    </div>
                  </motion.button>
                ))}
                <div className="w-px h-6 bg-white/20 mx-2" />
                <button
                  onClick={() => setIsAutoPlay(!isAutoPlay)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isAutoPlay 
                      ? 'bg-green-600/20 text-green-300 border border-green-500/30' 
                      : 'bg-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <Play className="h-3 w-3" />
                  {isAutoPlay ? '自动' : '手动'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="space-y-24">
          {SHOWCASE_FLOW.map((section, index) => (
            <motion.div
              key={section.id}
              ref={(el) => (sectionRefs.current[index] = el)}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              className="min-h-screen flex items-center"
            >
              <div className="w-full grid lg:grid-cols-2 gap-12 items-center">
                {/* 左侧：内容描述 */}
                <motion.div 
                  className="space-y-8"
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${section.gradient} flex items-center justify-center shadow-2xl`}>
                        <section.icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">第{index + 1}步</div>
                        <h2 className="text-3xl font-bold text-white">{section.title}</h2>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertTriangle className="h-5 w-5 text-red-400" />
                          <span className="font-semibold text-red-300">现状问题</span>
                        </div>
                        <p className="text-red-100 leading-relaxed">{section.problem}</p>
                      </div>
                      
                      <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="h-5 w-5 text-blue-400" />
                          <span className="font-semibold text-blue-300">Me² NEXUS解决方案</span>
                        </div>
                        <p className="text-blue-100 leading-relaxed">{section.solution}</p>
                      </div>
                      
                      <div className="bg-green-900/20 border border-green-500/30 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                          <span className="font-semibold text-green-300">客户价值</span>
                        </div>
                        <p className="text-green-100 leading-relaxed">{section.value}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* 指标对比 */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-yellow-400" />
                      效果对比
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-red-400 font-bold text-lg">{section.metrics.before}</div>
                        <div className="text-gray-400 text-sm">优化前</div>
                      </div>
                      <div className="text-center">
                        <div className="text-green-400 font-bold text-lg">{section.metrics.after}</div>
                        <div className="text-gray-400 text-sm">使用后</div>
                      </div>
                      <div className="text-center">
                        <div className="text-yellow-400 font-bold text-lg">{section.metrics.improvement}</div>
                        <div className="text-gray-400 text-sm">提升效果</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* 右侧：演示区域 */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl"
                >
                  {section.demo}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 底部CTA */}
        <motion.div 
          className="mt-24 text-center bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-sm rounded-3xl p-12 border border-purple-500/20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-4xl font-bold text-white mb-6">
            Ready to 10x Your Professional Performance?
          </h3>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            从专业困境到AI增强，从重复劳动到智能决策。Me² NEXUS让每个专业人士都能拥有超级分析能力。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button 
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="h-5 w-5" />
              免费生成专业MRD
            </motion.button>
            <motion.button 
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-medium text-lg hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              查看完整Demo
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          </div>
          
          <div className="mt-8 text-sm text-gray-400">
            3分钟体验 • 24小时交付 • 99元/月专属服务
          </div>
        </motion.div>
      </div>
    </div>
  );
}