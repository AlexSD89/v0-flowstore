"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain,
  ArrowRight,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Building2,
  X,
  Users,
  Globe,
  Star,
  Play,
  Pause,
  ChevronRight,
  Code,
  Terminal,
  FileText,
  Lightbulb,
  Wand2
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
    painPoint: 'VC合伙人张总：每月看50个项目，只能深度分析5个，其余全凭感觉',
    solution: 'Me² 学习你的投资判断逻辑，AI负责信息搜索+交叉验证+决策处理，输出投资策略',
    value: '从70%错失率到85%准确率，每个决策节省200-500万风险',
    color: 'from-indigo-600 to-blue-600'
  },
  {
    id: 'ceo',
    label: '企业领袖',
    icon: Building2,
    painPoint: '制造业CEO王总：想用AI提升效率，但不知道选哪个产品，担心踩坑',
    solution: 'Me² 学习你的决策框架，AI负责市场调研+方案对比+风险评估，输出选型策略',
    value: '避免60%选错风险，节省50-200万试错成本和6个月时间',
    color: 'from-blue-600 to-cyan-600'
  },
  {
    id: 'consultant',
    label: '知识工作者',
    icon: Brain,
    painPoint: '专业人士李总：每个项目都要重新做行业分析，90%工作都在重复',
    solution: 'Me² 学习你的分析方法论，AI负责数据收集+信息验证+模式识别，输出分析报告',
    value: '效率提升300%，服务收入增长500%，从个人服务到规模化',
    color: 'from-emerald-600 to-teal-600'
  }
];

// VS Code风格的代码演示序列
const CODE_DEMOS = [
  {
    id: 'investment_analysis',
    title: '投资分析AI Agent',
    language: 'python',
    filename: 'investment_analyzer.py',
    content: `# Me² NEXUS - 智能投资分析系统
class InvestmentAnalyzer:
    def __init__(self, user_profile):
        self.profile = user_profile
        self.decision_matrix = self.load_decision_patterns()
        
    def analyze_project(self, project_data):
        # 基于你的投资逻辑进行智能分析
        market_score = self.evaluate_market_potential(project_data)
        team_score = self.assess_team_capability(project_data)
        tech_score = self.analyze_technical_moat(project_data)
        
        # 使用你的决策权重
        final_score = (
            team_score * 0.7 +  # 你最看重团队
            tech_score * 0.2 +  # 技术壁垒次之
            market_score * 0.1   # 市场时机最后
        )
        
        return {
            'recommendation': 'INVEST' if final_score > 8.5 else 'PASS',
            'confidence': final_score,
            'reasoning': self.generate_reasoning(project_data),
            'risk_alerts': self.identify_risks(project_data)
        }`,
    typing_delays: [50, 30, 60, 40, 35, 45, 55, 30, 40, 50, 35, 45, 60, 30, 40]
  },
  {
    id: 'business_consultant',
    title: '企业咨询AI Agent', 
    language: 'javascript',
    filename: 'business_consultant.js',
    content: `// Me² NEXUS - 智能企业咨询系统
class BusinessConsultant {
  constructor(ceoProfile) {
    this.ceoStyle = ceoProfile.decisionMaking;
    this.industryKnowledge = this.loadIndustryData();
  }
  
  async analyzeBusinessDecision(options) {
    // 并行分析多个方案
    const analyses = await Promise.all([
      this.calculateROI(options),
      this.assessRisks(options),
      this.evaluateTimeline(options),
      this.analyzeCashFlow(options)
    ]);
    
    // 基于CEO的决策偏好排序
    const recommendations = this.rankOptions(analyses, this.ceoStyle);
    
    return {
      topChoice: recommendations[0],
      reasoning: this.explainDecision(recommendations),
      riskMitigation: this.suggestRiskMitigation(),
      nextSteps: this.generateActionPlan()
    };
  }
  
  explainDecision(options) {
    return \`基于您过往的决策模式分析：
    1. 您偏好技术升级类投资（成功率87%）
    2. 现金流优先策略与您风格匹配
    3. 建议时机：Q1启动，Q2见效果\`;
  }
}`,
    typing_delays: [45, 35, 50, 30, 40, 55, 35, 45, 60, 30, 50, 40, 35, 45]
  }
];

// AI建议弹窗内容
const AI_SUGGESTIONS = [
  {
    type: 'autocomplete',
    icon: Lightbulb,
    title: 'AI智能补全',
    content: '基于你的专业领域，我建议添加风险评估模块...',
    confidence: 95
  },
  {
    type: 'optimization',
    icon: Wand2,
    title: '代码优化建议',
    content: '可以使用并行处理提升分析速度3倍',
    confidence: 87
  },
  {
    type: 'insight',
    icon: Brain,
    title: '专业洞察',
    content: '基于你过往42个成功案例，建议调整权重分配',
    confidence: 92
  }
];

// 语法高亮函数
const syntaxHighlight = (code: string, language: string) => {
  if (language === 'python') {
    return code
      .replace(/(class|def|import|from|if|else|elif|for|while|try|except|return|yield|async|await|with|as)\b/g, '<span style="color: #569cd6">$1</span>')
      .replace(/(self|True|False|None)\b/g, '<span style="color: #569cd6">$1</span>')
      .replace(/#[^\n]*/g, '<span style="color: #6a9955">$&</span>')
      .replace(/(['"])((?:\\.|(?!\1)[^\\\n])*)\1/g, '<span style="color: #ce9178">$&</span>')
      .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span style="color: #b5cea8">$1</span>')
      .replace(/\b(__init__|__str__|__repr__|len|range|print|sum|max|min)\b/g, '<span style="color: #dcdcaa">$1</span>')
      .replace(/([a-zA-Z_][a-zA-Z0-9_]*)(?=\s*\()/g, '<span style="color: #dcdcaa">$1</span>');
  } else if (language === 'javascript') {
    return code
      .replace(/(class|function|const|let|var|if|else|for|while|try|catch|return|async|await|import|export|from)\b/g, '<span style="color: #569cd6">$1</span>')
      .replace(/(this|true|false|null|undefined)\b/g, '<span style="color: #569cd6">$1</span>')
      .replace(/\/\/[^\n]*/g, '<span style="color: #6a9955">$&</span>')
      .replace(/(['"`])((?:\\.|(?!\1)[^\\\n])*)\1/g, '<span style="color: #ce9178">$&</span>')
      .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span style="color: #b5cea8">$1</span>')
      .replace(/\b(console|Promise|Array|Object|String|Number|Boolean)\b/g, '<span style="color: #4ec9b0">$1</span>')
      .replace(/([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*\()/g, '<span style="color: #dcdcaa">$1</span>');
  }
  return code;
};


// 基于策略文档的真实场景对话
const DEMO_CONVERSATIONS = [
  {
    user: "我是投资人老张，每天收到30个项目BP，每个都说自己是'AI+教育'颠覆者，太累了...",
    ai: `🧠 **记住你的投资逻辑**：教育赛道Pre-A轮，看团队70%、技术壁垒20%、市场时机10%

📊 **智能预筛选进行中**：
├── 数据抓取: 30个项目官网、融资历史、团队背景
├── 交叉验证: 与公开数据库比对真实性
├── 模式识别: 基于你过往43个成功案例的决策模式
└── 风险评估: 识别出15个常见陷阱和警告信号

🔍 **深度对比分析完成**：
• 高匹配项目(3个): "智学AI"最相似，团队背景80%匹配
• 中匹配项目(5个): 有潜力但需补强关键指标
• 低匹配项目(22个): 不符合你的投资逻辑，已自动过滤

💰 **投资建议**：建议深入尽调"智学AI"，预期3年5-8倍回报，风险可控`
  },
  {
    user: "我是CEO李总，销售要扩张、技术要升级、市场要加投，资源有限只能选一个",
    ai: `🎯 **基于你的经营数据深度分析**：

📈 **ROI计算矩阵**：
1️⃣ 系统升级：投入120万 → 8个月回收 → 年节省80万人工成本
   ├── 技术风险：低(成熟方案)
   ├── 实施周期：3个月
   └── 预期收益：280万/年

2️⃣ 华南扩张：投入200万 → 18个月回收 → 现金流压力93天
   ├── 市场风险：中(竞争激烈)
   ├── 管理复杂度：高
   └── 预期收益：180万/年

3️⃣ 抖音加投：投入80万 → ROI边际递减，当前获客成本已上升47%
   ├── 流量成本：持续上涨
   ├── 转化率：连续3月下滑
   └── 建议：暂缓，观察Q2数据

💡 **决策模型建议**：技术升级 > 扩张计划 > 广告投入
基于你过往决策偏好和企业现金流状况的最优解`
  }
];

export function CopilotStyleNexusLandingPage() {
  const [currentConversation, setCurrentConversation] = useState(0);
  const [mascotAnimation, setMascotAnimation] = useState('idle');
  const [autoPlay, setAutoPlay] = useState(true);
  const [typingText, setTypingText] = useState('');
  const [showCodeCompletion, setShowCodeCompletion] = useState(false);
  
  // VS Code编辑器状态
  const [currentDemo, setCurrentDemo] = useState(0);
  const [codeTypingText, setCodeTypingText] = useState('');
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showAISuggestion, setShowAISuggestion] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState(0);
  const [tabs, setTabs] = useState([CODE_DEMOS[0]]);
  const [activeTab, setActiveTab] = useState(0);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const codeTypingRef = useRef<NodeJS.Timeout | null>(null);

  // 自动切换对话演示
  useEffect(() => {
    if (!autoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentConversation(prev => (prev + 1) % DEMO_CONVERSATIONS.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [autoPlay]);

  // 高级打字机动画效果
  useEffect(() => {
    if (!autoPlay) return;
    
    const currentText = DEMO_CONVERSATIONS[currentConversation].user;
    let i = 0;
    setTypingText('');
    setShowCodeCompletion(false);
    
    const typeInterval = setInterval(() => {
      if (i < currentText.length) {
        setTypingText(currentText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => setShowCodeCompletion(true), 500);
      }
    }, 50); // 打字速度
    
    return () => clearInterval(typeInterval);
  }, [currentConversation, autoPlay]);

  // VS Code风格代码打字机动画
  useEffect(() => {
    if (!autoPlay) return;
    
    const demo = CODE_DEMOS[currentDemo];
    const lines = demo.content.split('\n');
    let currentLine = 0;
    let currentChar = 0;
    
    setCodeTypingText('');
    setCurrentLineIndex(0);
    setShowAISuggestion(false);
    
    codeTypingRef.current = setInterval(() => {
      if (currentLine < lines.length) {
        const line = lines[currentLine];
        if (currentChar < line.length) {
          // 模拟真实编程打字节奏
          const delay = demo.typing_delays[Math.min(currentLine, demo.typing_delays.length - 1)];
          
          setCodeTypingText(() => {
            const newText = lines.slice(0, currentLine).join('\n') + 
                           (currentLine > 0 ? '\n' : '') + 
                           line.slice(0, currentChar + 1);
            return newText;
          });
          
          currentChar++;
          
          // 调整间隔以模拟真实打字
          clearInterval(codeTypingRef.current);
          setTimeout(() => {
            if (codeTypingRef.current) {
              codeTypingRef.current = setInterval(arguments.callee, delay);
            }
          }, delay);
          
        } else {
          currentLine++;
          currentChar = 0;
          setCurrentLineIndex(currentLine);
          
          // 在关键行显示AI建议
          if (currentLine === 8 || currentLine === 15 || currentLine === 22) {
            setTimeout(() => {
              setShowAISuggestion(true);
              setCurrentSuggestion(Math.floor(Math.random() * AI_SUGGESTIONS.length));
              setTimeout(() => setShowAISuggestion(false), 3000);
            }, 500);
          }
        }
      } else {
        clearInterval(codeTypingRef.current);
        // 完成后切换到下一个演示
        setTimeout(() => {
          setCurrentDemo(prev => (prev + 1) % CODE_DEMOS.length);
        }, 3000);
      }
    }, 80);
    
    return () => {
      if (codeTypingRef.current) {
        clearInterval(codeTypingRef.current);
      }
    };
  }, [currentDemo, autoPlay]);

  // Tab管理
  const addNewTab = (demo: typeof CODE_DEMOS[0]) => {
    const existingIndex = tabs.findIndex(tab => tab.id === demo.id);
    if (existingIndex >= 0) {
      setActiveTab(existingIndex);
    } else {
      setTabs(prev => [...prev, demo]);
      setActiveTab(tabs.length);
    }
  };

  const closeTab = (index: number) => {
    if (tabs.length === 1) return;
    
    setTabs(prev => prev.filter((_, i) => i !== index));
    if (activeTab >= index && activeTab > 0) {
      setActiveTab(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1b3c 50%, #0a0e27 100%)'
    }}>
      {/* 毛玻璃风格导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #00d4ff, #4f46e5)',
                  boxShadow: '0 4px 16px rgba(0, 212, 255, 0.3)'
                }}
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
              <div className="text-xl font-semibold">
                <span className="text-white">Me²</span>
                <span className="text-[#00d4ff] ml-1">NEXUS</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <motion.a 
                href="#features" 
                className="text-[#a1a1aa] hover:text-white transition-colors relative"
                whileHover={{ scale: 1.05 }}
              >
                Features
                <motion.div 
                  className="absolute bottom-0 left-0 h-0.5 bg-[#00d4ff]"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
              <motion.button 
                className="px-6 py-2 rounded-lg font-medium transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #00d4ff, #4f46e5)',
                  boxShadow: '0 4px 16px rgba(79, 70, 229, 0.3)'
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 8px 32px rgba(79, 70, 229, 0.5)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                Get started
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* 动态背景光效 */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, #00d4ff 0%, #4f46e5 100%)' }}
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.3, 0.15]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, #4f46e5 0%, #00d4ff 100%)' }}
        />
      </div>

      {/* 右上角毛玻璃吉祥物 */}
      <div className="fixed top-24 right-8 z-40">
        <motion.div
          className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl cursor-pointer"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
          }}
          animate={{
            scale: mascotAnimation === 'bounce' ? [1, 1.2, 1] : 1,
            rotate: mascotAnimation === 'thinking' ? [0, -10, 10, 0] : 0
          }}
          transition={{ duration: 2, repeat: Infinity }}
          whileHover={{ scale: 1.1, y: -2 }}
          onHoverStart={() => setMascotAnimation('bounce')}
          onHoverEnd={() => setMascotAnimation('idle')}
        >
          <Brain className="w-8 h-8 text-[#00d4ff]" />
        </motion.div>
      </div>
      
      {/* 主内容 */}
      <div className="relative z-10">

        {/* Hero区域 */}
        <div className="pt-32 pb-20">
          <div className="max-w-6xl mx-auto px-6">
            {/* 主标题区 */}
            <div className="text-center mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 mb-8"
              >
                <Star className="w-4 h-4 text-indigo-400" />
                <span className="text-sm text-indigo-300">AI that learns your expertise</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
              >
                Me² = Me × Me
                <br/>
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  专业个体超级增强器
                </span>
              </motion.h1>
              
              {/* Me²公式详细展示 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mb-8 max-w-4xl mx-auto"
              >
                <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-800/30 rounded-2xl p-8 mb-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-indigo-300 mb-3">Me² = Me × Me 升级公式详解</h2>
                    <p className="text-slate-300">不是通用AI工具，而是学会你专业思维的个体增强器</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6 text-sm">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">Me¹</span>
                      </div>
                      <h3 className="font-semibold text-blue-300 mb-2">原始的你</h3>
                      <p className="text-slate-400">专业能力 + 经验积累 + 思维模式 + 决策逻辑</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">×</span>
                      </div>
                      <h3 className="font-semibold text-purple-300 mb-2">AI学习复制</h3>
                      <p className="text-slate-400">30分钟深度对话 → AI掌握你的专业逻辑和工作方式</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">Me²</span>
                      </div>
                      <h3 className="font-semibold text-emerald-300 mb-2">增强的你</h3>
                      <p className="text-slate-400">24/7不眠工作 + 无限信息处理 + 持续学习进化</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* VS Code风格的代码编辑器演示 */}
              <div className="max-w-6xl mx-auto mb-16">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #0a0e27 0%, #1a1b3c 50%, #0a0e27 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    borderRadius: '16px'
                  }}
                >
                  {/* VS Code标题栏 */}
                  <div className="flex items-center justify-between px-4 py-3" style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-sm text-slate-400 flex items-center space-x-2">
                      <Code className="w-4 h-4" />
                      <span>Me² NEXUS Code Studio</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setAutoPlay(!autoPlay)}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                      >
                        {autoPlay ? <Pause className="w-4 h-4 text-slate-400" /> : <Play className="w-4 h-4 text-slate-400" />}
                      </button>
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                        <span>AI协作中</span>
                      </div>
                    </div>
                  </div>

                  {/* 标签栏 */}
                  <div className="flex items-center" style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    {tabs.map((tab, index) => (
                      <div
                        key={tab.id}
                        className={`flex items-center space-x-2 px-4 py-2 text-sm cursor-pointer transition-colors relative ${
                          index === activeTab 
                            ? 'bg-slate-800/50 text-white border-b-2 border-indigo-400' 
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                        onClick={() => setActiveTab(index)}
                      >
                        <FileText className="w-4 h-4" />
                        <span>{tab.filename}</span>
                        {tabs.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              closeTab(index);
                            }}
                            className="ml-2 hover:bg-red-500/20 rounded p-0.5 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const availableDemo = CODE_DEMOS.find(demo => !tabs.some(tab => tab.id === demo.id));
                        if (availableDemo) addNewTab(availableDemo);
                      }}
                      className="px-3 py-2 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* 编辑器主体 */}
                  <div className="flex">
                    {/* 行号列 */}
                    <div className="w-12 py-4" style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRight: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      {codeTypingText.split('\n').map((_, index) => (
                        <div 
                          key={index} 
                          className={`text-xs text-center py-0.5 transition-colors ${
                            index === currentLineIndex ? 'text-indigo-400 bg-indigo-400/10' : 'text-slate-600'
                          }`}
                        >
                          {index + 1}
                        </div>
                      ))}
                    </div>

                    {/* 代码区域 */}
                    <div className="flex-1 relative">
                      <div 
                        ref={editorRef}
                        className="p-4 font-mono text-sm leading-relaxed min-h-[400px] overflow-hidden"
                        style={{ background: '#1e1e1e' }}
                      >
                        <pre className="text-slate-200 whitespace-pre-wrap">
                          <code dangerouslySetInnerHTML={{
                            __html: syntaxHighlight(codeTypingText, tabs[activeTab]?.language || CODE_DEMOS[currentDemo].language)
                          }} />
                        </pre>
                        
                        {/* 光标 */}
                        <span className="inline-block w-0.5 h-5 bg-white animate-pulse ml-1"></span>
                      </div>

                      {/* AI建议弹窗 */}
                      <AnimatePresence>
                        {showAISuggestion && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="absolute top-20 right-4 max-w-xs"
                            style={{
                              background: 'rgba(255, 255, 255, 0.1)',
                              backdropFilter: 'blur(20px)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              borderRadius: '12px',
                              boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                            }}
                          >
                            <div className="p-4">
                              <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                                  {React.createElement(AI_SUGGESTIONS[currentSuggestion].icon, { className: "w-4 h-4 text-white" })}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-white text-sm mb-1">
                                    {AI_SUGGESTIONS[currentSuggestion].title}
                                  </h4>
                                  <p className="text-xs text-slate-300 mb-2">
                                    {AI_SUGGESTIONS[currentSuggestion].content}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <div className="w-16 h-1 bg-slate-700 rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-1000"
                                          style={{ width: `${AI_SUGGESTIONS[currentSuggestion].confidence}%` }}
                                        />
                                      </div>
                                      <span className="text-xs text-emerald-400 font-medium">
                                        {AI_SUGGESTIONS[currentSuggestion].confidence}%
                                      </span>
                                    </div>
                                    <div className="flex space-x-1">
                                      <button className="px-2 py-1 bg-indigo-500 hover:bg-indigo-600 text-white text-xs rounded transition-colors">
                                        应用
                                      </button>
                                      <button 
                                        onClick={() => setShowAISuggestion(false)}
                                        className="px-2 py-1 bg-slate-600 hover:bg-slate-700 text-white text-xs rounded transition-colors"
                                      >
                                        忽略
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  
                  {/* 状态栏 */}
                  <div className="flex items-center justify-between px-4 py-2 text-xs" style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <div className="flex items-center space-x-4 text-slate-400">
                      <span>行 {currentLineIndex + 1}, 列 {codeTypingText.split('\n')[currentLineIndex]?.length || 0}</span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        <span>{tabs[activeTab]?.language || CODE_DEMOS[currentDemo].language}</span>
                      </span>
                      <span>•</span>
                      <span>UTF-8</span>
                    </div>
                    <div className="flex items-center space-x-4 text-slate-400">
                      <span className="flex items-center space-x-1">
                        <Brain className="w-3 h-3" />
                        <span>AI协助已启用</span>
                      </span>
                      <span>•</span>
                      <span>Me² Agent: 活跃</span>
                    </div>
                  </div>

                  {/* 终端对话演示 */}
                  <div className="mt-8 p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Terminal className="w-5 h-5 text-indigo-400" />
                      <span className="text-sm text-slate-400">终端交互演示</span>
                    </div>
                    
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentConversation}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-4"
                        style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          padding: '16px'
                        }}
                      >
                        {/* 用户输入 */}
                        <div className="flex items-start space-x-3">
                          <span className="text-indigo-400 font-mono text-sm">You:</span>
                          <div className="flex-1">
                            <div className="bg-slate-700/50 rounded-lg px-4 py-3">
                              <p className="text-sm text-slate-200">
                                {DEMO_CONVERSATIONS[currentConversation].user}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* AI响应 */}
                        <div className="flex items-start space-x-3">
                          <span className="text-purple-400 font-mono text-sm">Me² AI:</span>
                          <div className="flex-1">
                            <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-800/50 rounded-lg px-4 py-3">
                              <div className="text-sm text-slate-200 whitespace-pre-line">
                                {DEMO_CONVERSATIONS[currentConversation].ai}
                              </div>
                            </div>
                            <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <span>⚡ 处理时间: 2.3秒</span>
                                <span>🧠 调用Agent: 6个</span>
                                <span>📊 数据源: 12个</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">高置信度 95%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                    
                    {/* 进度指示器 */}
                    <div className="flex justify-center mt-6 space-x-2">
                      {DEMO_CONVERSATIONS.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentConversation(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentConversation ? 'bg-indigo-400' : 'bg-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* CTA按钮 */}
              <div className="flex justify-center space-x-4">
                <motion.button
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '0 20px 40px rgba(79, 70, 229, 0.4)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center gap-2 relative overflow-hidden group"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    boxShadow: '0 8px 32px rgba(79, 70, 229, 0.3)'
                  }}
                >
                  {/* 悬停光效 */}
                  <motion.div 
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />
                  <span className="relative z-10 text-white">开始体验</span>
                  <ChevronRight className="w-5 h-5 relative z-10 text-white" />
                </motion.button>
                
                <motion.button
                  whileHover={{ 
                    scale: 1.02,
                    borderColor: 'rgba(99, 102, 241, 1)',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 relative overflow-hidden group"
                  style={{
                    border: '1px solid rgba(100, 116, 139, 1)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)'
                  }}
                >
                  <span className="text-white">查看演示</span>
                </motion.button>
              </div>
            </div>

            {/* 企业展示区 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-center"
            >
              <p className="text-slate-400 text-sm mb-8">受到专业人士的信赖</p>
              <div className="flex justify-center items-center space-x-12">
                {[
                  { icon: Building2, name: '红杉资本', color: '#ff6b6b' },
                  { icon: TrendingUp, name: '腾讯投资', color: '#4ecdc4' },
                  { icon: Users, name: '麦肯锡咨询', color: '#45b7d1' },
                  { icon: Globe, name: '德勤咨询', color: '#96ceb4' }
                ].map((company, index) => (
                  <motion.div 
                    key={company.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 0.7, y: 0 }}
                    whileHover={{ 
                      opacity: 1, 
                      y: -2,
                      scale: 1.05
                    }}
                    transition={{ 
                      duration: 0.3,
                      delay: index * 0.1
                    }}
                    className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg"
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <company.icon className="w-6 h-6" style={{ color: company.color }} />
                    <span className="font-semibold text-slate-300">{company.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}