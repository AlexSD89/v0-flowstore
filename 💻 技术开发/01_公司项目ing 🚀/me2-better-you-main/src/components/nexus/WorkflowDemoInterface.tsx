"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 统一颜色系统 - GitHub Copilot 风格专业配色
const BRAND_COLORS = {
  // 主品牌色 - 深蓝紫色系
  primary: {
    50: '#f0f4ff',
    100: '#e0eaff', 
    200: '#c7d8ff',
    300: '#a4bcff',
    400: '#8197ff',
    500: '#6366f1', // 主色
    600: '#5854eb',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81'
  },
  // 辅助色 - 青蓝色系
  accent: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc', 
    300: '#67e8f9',
    400: '#22d3ee', // 辅助色
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63'
  },
  // 成功色
  success: {
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a'
  },
  // 警告色
  warning: {
    400: '#fbbf24',
    500: '#f59e0b'
  },
  // 错误色
  error: {
    400: '#f87171',
    500: '#ef4444'
  },
  // 中性色 - 统一灰阶
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a'
  }
};

// 统一渐变色系统
const GRADIENTS = {
  primary: 'from-indigo-500 to-indigo-600',
  primaryHover: 'from-indigo-600 to-indigo-700', 
  accent: 'from-cyan-400 to-cyan-500',
  accentHover: 'from-cyan-500 to-cyan-600',
  success: 'from-emerald-500 to-emerald-600',
  glass: 'from-slate-800/80 to-slate-900/80',
  hero: 'from-indigo-500 via-cyan-400 to-indigo-600'
};

// 统一阴影系统
const SHADOWS = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg shadow-slate-900/10',
  xl: 'shadow-xl shadow-slate-900/20',
  glow: 'shadow-lg shadow-indigo-500/25',
  glowAccent: 'shadow-lg shadow-cyan-400/25'
};

// 统一按钮尺寸系统
const BUTTON_SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-base',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg'
};

// 统一圆角系统
const BORDER_RADIUS = {
  sm: 'rounded-lg',
  md: 'rounded-xl', 
  lg: 'rounded-2xl',
  xl: 'rounded-3xl'
};
import { 
  Brain,
  TrendingUp,
  Building2,
  Play,
  Pause,
  Target,
  Users,
  Settings,
  BarChart3,
  FileText,
  Cloud,
  CheckCircle,
  MessageSquare,
  Sparkles,
  Network,
  Layers,
  ArrowRight,
  Send,
  Database,
  Shield,
  Zap,
  Globe,
  Award,
  Cpu,
  Eye,
  Lock,
  Workflow,
  Activity,
  Menu,
  X,
  User,
  DollarSign,
  Mail,
  Video,
  MessageCircle,
  // 新增专业图标
  Briefcase,
  LineChart,
  Scale,
  PieChart,
  TrendingUpIcon as TrendUpArrow,
  UserCheck,
  BookOpen,
  Lightbulb,
  Rocket,
  Star,
  ChevronRight,
  Check,
  Infinity
} from "lucide-react";

interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  agent: string;
  icon: React.ElementType;
  color: string;
  progress: number;
}

interface CustomerInput {
  persona: string;
  input: string;
  mrdTitle: string;
}

// 客户输入示例 - 体现专业差异
const CUSTOMER_INPUTS: Record<'investor' | 'ceo' | 'consultant', CustomerInput> = {
  investor: {
    persona: "资深投资人",
    input: "我想分析一家AI医疗影像初创公司的投资价值，团队15人，月收入200万，主要做肺癌早筛，已完成A轮1000万融资，现在寻求B轮3000万，用于市场扩张和产品升级。我特别关注技术壁垒、市场规模、团队背景和竞争格局...",
    mrdTitle: "AI医疗影像初创公司投资价值分析需求文档（AI Medical Imaging Startup Investment Analysis MRD）"
  },
  ceo: {
    persona: "企业CEO",
    input: "我们是一家SaaS公司，100人规模，年收入8000万。现在面临三个重要决策：1）是否进军东南亚市场投入500万；2）技术架构升级需要300万；3）销售团队扩张到50人需要600万。资源有限只能选一个，需要基于数据和ROI分析来决策...",
    mrdTitle: "SaaS企业战略资源配置决策分析需求文档（SaaS Enterprise Strategic Resource Allocation MRD）"
  },
  consultant: {
    persona: "资深律师",
    input: "客户是一家独角兽公司的股权投资协议，涉及12亿人民币投资，协议长达68页，包含复杂的业绩承诺、对赌条款、董事会席位安排、优先清算权等。需要全面的法律风险评估，特别关注估值调整机制、触发条件、违约责任等核心条款...",
    mrdTitle: "独角兽股权投资协议法律风险评估需求文档（Unicorn Equity Investment Agreement Legal Risk Assessment MRD）"
  }
};

// 演示阶段定义
type DemoStage = 'input' | 'mrd' | 'core' | 'agents' | 'result';

// 动态工作流程 - 展示专业后台处理能力
const DYNAMIC_WORKFLOWS = {
  investor: [
    {
      id: 1,
      title: "彭博终端数据分析Agent",
      description: "Bloomberg Terminal级实时财务数据，分析200万月收入的增长趋势、现金流模式、竞对估值对比",
      agent: "高级财务分析师",
      icon: BarChart3,
      color: "from-purple-500 to-indigo-500",
      progress: 0,
      details: "• 接入彭博终端API • 分析847个数据点 • 交叉验证6个财务模型"
    },
    {
      id: 2,
      title: "CB Insights市场情报Agent",
      description: "CB Insights级创投数据库，AI医疗影像市场图谱分析，竞争格局深度研究，投资热点识别",
      agent: "市场情报专家",
      icon: Target,
      color: "from-blue-500 to-cyan-500",
      progress: 0,
      details: "• 监控1203个竞品 • 追踪156轮融资 • 分析23个细分赛道"
    },
    {
      id: 3,
      title: "LinkedIn深度调研Agent",
      description: "团队背景穿透式调研，技术核心人员履历验证，创始团队能力评估，关键岗位风险分析",
      agent: "人才评估专家",
      icon: Users,
      color: "from-green-500 to-emerald-500",
      progress: 0,
      details: "• 调研15位核心成员 • 验证67个项目经历 • 评估技术实力等级"
    },
    {
      id: 4,
      title: "政策监管风险Agent",
      description: "医疗器械监管政策追踪，FDA/NMPA审批路径分析，合规风险评估，政策变化影响预测",
      agent: "合规风险专家",
      icon: Settings,
      color: "from-yellow-500 to-orange-500",
      progress: 0,
      details: "• 追踪34项相关政策 • 分析12个审批案例 • 评估合规成本"
    },
    {
      id: 5,
      title: "投资决策建模Agent",
      description: "基于你的投资偏好权重，多维度评分模型，投资回报率预测，风险收益平衡分析",
      agent: "投资策略专家",
      icon: FileText,
      color: "from-emerald-500 to-green-500",
      progress: 0,
      details: "• 7维度评分体系 • 3年收益预测模型 • 个人偏好权重匹配"
    },
    {
      id: 6,
      title: "专属AI投顾部署",
      description: "基于你的投资逻辑训练专属AI投顾，云端部署，24/7监控投资组合，实时风险预警",
      agent: "AI架构师",
      icon: Cloud,
      color: "from-indigo-500 to-purple-500",
      progress: 0,
      details: "• 个人投资逻辑建模 • 实时组合监控 • 24/7风险预警系统"
    }
  ],
  ceo: [
    {
      id: 1,
      title: "Salesforce数据挖掘Agent",
      description: "整合CRM、财务、运营多维数据，8000万营收结构深度分析，客户LTV和增长趋势预测",
      agent: "企业数据分析师",
      icon: BarChart3,
      color: "from-blue-500 to-cyan-500",
      progress: 0,
      details: "• 分析68万客户数据 • 识别12个增长驱动因子 • 预测6个月业务走势"
    },
    {
      id: 2,
      title: "麦肯锡ROI建模Agent",
      description: "McKinsey级财务建模，三大战略方案ROI精准计算，现金流影响分析，投资回收期预测",
      agent: "高级财务建模师",
      icon: Target,
      color: "from-purple-500 to-pink-500",
      progress: 0,
      details: "• 构建27个财务模型 • 计算3年投资回报 • 敏感性分析15个变量"
    },
    {
      id: 3,
      title: "Frost & Sullivan市场Agent",
      description: "弗若斯特级市场调研，东南亚SaaS市场深度分析，竞争格局映射，进入壁垒评估",
      agent: "市场研究总监",
      icon: Users,
      color: "from-green-500 to-teal-500",
      progress: 0,
      details: "• 调研236个竞品 • 分析6国市场环境 • 评估本地化成本"
    },
    {
      id: 4,
      title: "Gartner技术评估Agent",
      description: "Gartner魔力象限级技术架构评估，300万升级方案技术路线图，云迁移风险评估",
      agent: "企业架构师",
      icon: Settings,
      color: "from-yellow-500 to-orange-500",
      progress: 0,
      details: "• 评估14个技术方案 • 分析云架构成本 • 制定18个月路线图"
    },
    {
      id: 5,
      title: "波士顿矩阵决策Agent",
      description: "BCG决策框架，基于你的KPI权重和现金流约束，多维度决策矩阵，战略优先级排序",
      agent: "战略咨询总监",
      icon: FileText,
      color: "from-emerald-500 to-green-500",
      progress: 0,
      details: "• 构建决策矩阵 • 权衡23个关键因子 • 生成执行时序建议"
    },
    {
      id: 6,
      title: "企业AI决策大脑部署",
      description: "基于你的决策偏好训练企业级AI大脑，集成业务数据，实时决策支持，战略执行监控",
      agent: "企业AI架构师",
      icon: Cloud,
      color: "from-indigo-500 to-blue-500",
      progress: 0,
      details: "• 企业决策逻辑建模 • 多系统数据集成 • 实时战略仪表板"
    }
  ],
  consultant: [
    {
      id: 1,
      title: "Westlaw智能解析Agent",
      description: "Westlaw级法律数据库驱动，68页协议智能拆解，1247个条款逐条分析，风险等级自动标注",
      agent: "高级法律分析师",
      icon: BarChart3,
      color: "from-emerald-500 to-teal-500",
      progress: 0,
      details: "• 解析1247个条款 • 识别156个风险点 • 自动分级标注"
    },
    {
      id: 2,
      title: "判例库深度匹配Agent",
      description: "检索2847个相似判例，最高法院指导案例匹配，成功率预测模型，败诉风险评估",
      agent: "资深法律研究员",
      icon: Target,
      color: "from-purple-500 to-indigo-500",
      progress: 0,
      details: "• 匹配2847个判例 • 分析胜败率模式 • 预测争议概率"
    },
    {
      id: 3,
      title: "对赌条款风险Agent",
      description: "12亿投资对赌条款深度分析，业绩承诺合理性评估，触发机制漏洞识别，违约责任量化",
      agent: "并购法律专家",
      icon: Users,
      color: "from-red-500 to-orange-500",
      progress: 0,
      details: "• 分析34个对赌条件 • 评估履约风险 • 量化违约成本"
    },
    {
      id: 4,
      title: "证监会法规监控Agent",
      description: "实时监控最新法规变化，证监会政策影响分析，合规要求更新，监管风险预警系统",
      agent: "法规合规专家",
      icon: Settings,
      color: "from-blue-500 to-cyan-500",
      progress: 0,
      details: "• 监控156项法规更新 • 分析政策影响 • 实时合规预警"
    },
    {
      id: 5,
      title: "条款修改建议Agent",
      description: "基于你的风险偏好和客户利益，生成具体条款修改建议，谈判要点梳理，替代方案设计",
      agent: "谈判策略专家",
      icon: FileText,
      color: "from-green-500 to-emerald-500",
      progress: 0,
      details: "• 生成67条修改建议 • 制定谈判策略 • 设计3套替代方案"
    },
    {
      id: 6,
      title: "专属法律AI大脑部署",
      description: "基于你的法律判断逻辑训练专属AI法律助手，整合案例库，实时法规更新，智能风险预警",
      agent: "法律AI架构师",
      icon: Cloud,
      color: "from-indigo-500 to-purple-500",
      progress: 0,
      details: "• 个人判断逻辑建模 • 整合判例知识库 • 24/7法规监控"
    }
  ]
};

const PERSONA_INFO = [
  {
    id: 'investor',
    label: '资深投资人',
    icon: PieChart, // 更专业的投资分析图标
    color: 'from-[#6366F1] to-[#22D3EE]', // Cloudsway主渐变
    description: '彭博终端级数据源 + 你的投资直觉 = 超越个人极限的投资洞察力'
  },
  {
    id: 'ceo',
    label: '企业CEO',
    icon: Briefcase, // 更专业的企业管理图标
    color: 'from-[#22D3EE] to-[#6366F1]', // Cloudsway反向渐变
    description: '麦肯锡级咨询框架 + 你的决策经验 = 24/7企业战略智囊团'
  },
  {
    id: 'consultant',
    label: '资深律师',
    icon: Scale, // 更专业的法律天平图标
    color: 'from-[#4F46E5] to-[#0891B2]', // Cloudsway深度渐变
    description: 'Westlaw级法律数据库 + 你的专业判断 = 永不下线的法律专家'
  }
];

export function WorkflowDemoInterface() {
  const [currentPersona, setCurrentPersona] = useState<'investor' | 'ceo' | 'consultant'>('investor');
  const [workflowStep, setWorkflowStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [workflowProgress, setWorkflowProgress] = useState<{[key: number]: number}>({});
  
  // 导航状态管理
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [showCasesModal, setShowCasesModal] = useState(false);
  
  // 新增：客户体验流程状态
  const [demoStage, setDemoStage] = useState<DemoStage>('input');
  const [typingText, setTypingText] = useState('');
  const [showMRD, setShowMRD] = useState(false);
  const [coreAgentActive, setCoreAgentActive] = useState(false);
  const [agentsDistributed, setAgentsDistributed] = useState(false);
  const [currentTypingIndex, setCurrentTypingIndex] = useState(0);

  const currentWorkflow = DYNAMIC_WORKFLOWS[currentPersona];
  const personaInfo = PERSONA_INFO.find(p => p.id === currentPersona)!;

  // 客户输入打字机效果
  useEffect(() => {
    if (!autoPlay || demoStage !== 'input') return;
    
    const currentInput = CUSTOMER_INPUTS[currentPersona].input;
    
    if (currentTypingIndex < currentInput.length) {
      const timer = setTimeout(() => {
        setTypingText(currentInput.slice(0, currentTypingIndex + 1));
        setCurrentTypingIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      // 打字完成后，进入MRD生成阶段
      setTimeout(() => {
        setDemoStage('mrd');
        setShowMRD(true);
      }, 1000);
    }
  }, [currentTypingIndex, autoPlay, demoStage, currentPersona]);

  // 客户体验流程自动播放逻辑
  useEffect(() => {
    if (!autoPlay) return;

    let timer: NodeJS.Timeout;

    switch (demoStage) {
      case 'mrd':
        timer = setTimeout(() => {
          setDemoStage('core');
          setCoreAgentActive(true);
        }, 3000);
        break;
      case 'core':
        timer = setTimeout(() => {
          setDemoStage('agents');
          setAgentsDistributed(true);
        }, 2500);
        break;
      case 'agents':
        timer = setTimeout(() => {
          setDemoStage('result');
        }, 8000); // 给Agent们充足的展示时间
        break;
      case 'result':
        timer = setTimeout(() => {
          // 切换到下一个客户身份，重新开始流程
          const personas: ('investor' | 'ceo' | 'consultant')[] = ['investor', 'ceo', 'consultant'];
          const currentIndex = personas.indexOf(currentPersona);
          const nextPersona = personas[(currentIndex + 1) % personas.length];
          setCurrentPersona(nextPersona);
          // 重置所有状态
          setDemoStage('input');
          setTypingText('');
          setCurrentTypingIndex(0);
          setShowMRD(false);
          setCoreAgentActive(false);
          setAgentsDistributed(false);
          setWorkflowStep(0);
          setWorkflowProgress({});
        }, 4000);
        break;
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [demoStage, autoPlay, currentPersona]);

  // 模拟实时进度更新 - 仅在agents阶段
  useEffect(() => {
    if (!autoPlay || demoStage !== 'agents') return;
    
    const progressTimer = setInterval(() => {
      setWorkflowProgress(prev => ({
        ...prev,
        [workflowStep]: Math.min((prev[workflowStep] || 0) + Math.random() * 15, 100)
      }));
    }, 800);

    return () => clearInterval(progressTimer);
  }, [workflowStep, autoPlay, demoStage]);

  // Agent步骤切换 - 仅在agents阶段
  useEffect(() => {
    if (!autoPlay || demoStage !== 'agents') return;

    const workflowTimer = setInterval(() => {
      setWorkflowStep(prev => {
        const nextStep = (prev + 1) % currentWorkflow.length;
        return nextStep;
      });
    }, 1500);

    return () => clearInterval(workflowTimer);
  }, [autoPlay, demoStage, currentWorkflow.length]);

  const switchPersona = (persona: 'investor' | 'ceo' | 'consultant') => {
    setCurrentPersona(persona);
    setWorkflowStep(0);
    setWorkflowProgress({});
    // 重置客户体验流程
    setDemoStage('input');
    setTypingText('');
    setCurrentTypingIndex(0);
    setShowMRD(false);
    setCoreAgentActive(false);
    setAgentsDistributed(false);
    setAutoPlay(true); // 保持自动播放以显示输入内容
  };

  const restartDemo = () => {
    setDemoStage('input');
    setTypingText('');
    setCurrentTypingIndex(0);
    setShowMRD(false);
    setCoreAgentActive(false);
    setAgentsDistributed(false);
    setWorkflowStep(0);
    setWorkflowProgress({});
    setAutoPlay(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* 统一背景光效 */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/60 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-500/60 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-indigo-600/40 rounded-full blur-[80px] animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* 顶部导航 - 统一设计 */}
      <nav className="relative z-10 border-b border-slate-700/50 backdrop-blur-[20px] bg-slate-800/40 shadow-xl shadow-slate-900/50 p-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <div className="text-white font-bold">M²</div>
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">Me² NEXUS</h1>
              <p className="text-purple-300 text-xs">专业个体超级增强器</p>
            </div>
          </div>

          {/* 桌面导航菜单 */}
          <div className="hidden lg:flex items-center gap-6">
            <button 
              onClick={() => setShowFeaturesModal(true)}
              className="text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium flex items-center gap-1"
            >
              <Sparkles className="h-4 w-4" />
              产品功能
            </button>
            <button 
              onClick={() => setShowPricingModal(true)}
              className="text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium flex items-center gap-1"
            >
              <DollarSign className="h-4 w-4" />
              定价方案
            </button>
            <button 
              onClick={() => setShowCasesModal(true)}
              className="text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium flex items-center gap-1"
            >
              <Star className="h-4 w-4" />
              客户案例
            </button>
            <button 
              onClick={() => setAutoPlay(!autoPlay)}
              className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-colors duration-200 ${
                autoPlay ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
              }`}
            >
              {autoPlay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {autoPlay ? '自动演示' : '手动控制'}
            </button>
          </div>

          {/* 登录按钮组 */}
          <div className="hidden lg:flex items-center gap-3">
            <button 
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl backdrop-blur-[20px] bg-slate-800/60 border border-slate-700/60 text-white hover:bg-slate-800/80 hover:border-slate-600/80 transition-all duration-300 text-base font-medium shadow-lg shadow-slate-900/25"
            >
              <User className="h-4 w-4" />
              登录
            </button>
            <button className="relative overflow-hidden flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 text-white hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 text-base font-semibold group">
              <span className="relative z-10">免费开始</span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* 移动端菜单按钮 */}
          <div className="lg:hidden flex items-center gap-2">
            <button 
              onClick={() => setAutoPlay(!autoPlay)}
              className={`flex items-center gap-2 px-2 py-1 rounded-lg text-xs ${
                autoPlay ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
              }`}
            >
              {autoPlay ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            </button>
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* 移动端下拉菜单 */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 border-t border-white/20 pt-4"
            >
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    setShowFeaturesModal(true);
                    setShowMobileMenu(false);
                  }}
                  className="text-left text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium py-2 flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  产品功能
                </button>
                <button 
                  onClick={() => {
                    setShowPricingModal(true);
                    setShowMobileMenu(false);
                  }}
                  className="text-left text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium py-2 flex items-center gap-2"
                >
                  <DollarSign className="h-4 w-4" />
                  定价方案
                </button>
                <button 
                  onClick={() => {
                    setShowCasesModal(true);
                    setShowMobileMenu(false);
                  }}
                  className="text-left text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium py-2 flex items-center gap-2"
                >
                  <Star className="h-4 w-4" />
                  客户案例
                </button>
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => {
                      setShowLoginModal(true);
                      setShowMobileMenu(false);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg backdrop-blur-[20px] bg-white/10 border border-white/20 text-white text-sm font-medium"
                  >
                    <User className="h-4 w-4" />
                    登录
                  </button>
                  <button className="relative overflow-hidden flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#00d4ff] text-white text-base font-semibold group transition-all duration-300 hover:shadow-lg">
                    <span className="relative z-10">免费开始</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#22d3ee] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto p-6">
        {/* 专业身份选择器 - 重新设计布局 */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-500 bg-clip-text text-transparent tracking-tight">
              遇见更强的专业自己
            </h1>
            <p className="text-2xl md:text-3xl text-slate-400 leading-relaxed mb-10 font-medium">
              Me² NEXUS - 专业个体超级增强器
            </p>
            <div className="max-w-6xl mx-auto mb-8">
              <div className="backdrop-blur-[20px] bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-3xl p-8 md:p-12 border border-slate-700/50 shadow-xl shadow-slate-900/25">
                {/* 核心概念展示 */}
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-5xl font-black text-white mb-1 tracking-tight">
                        Me² = Me × Me
                      </h2>
                      <p className="text-cyan-400 font-medium">专业能力的指数级增强</p>
                    </div>
                  </div>
                  <p className="text-2xl text-slate-300 leading-relaxed max-w-4xl mx-auto font-medium">
                    不是简单的AI工具，而是<span className="text-indigo-400 font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">学会你思维的专业分身</span>
                  </p>
                </div>

                {/* 四大核心能力 - 统一只使用两种主色 */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  <motion.div 
                    className="group bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 rounded-2xl p-6 border border-indigo-500/20 hover:border-indigo-400/40 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25"
                    whileHover={{ y: -4 }}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg group-hover:shadow-indigo-500/25 transition-shadow duration-300">
                        <Brain className="h-7 w-7 text-white" />
                      </div>
                      <h4 className="text-white font-semibold text-lg mb-2">学会思维</h4>
                      <p className="text-slate-300 text-sm leading-relaxed">理解你的专业逻辑和判断标准</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="group bg-gradient-to-br from-cyan-400/10 to-cyan-500/10 rounded-2xl p-6 border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/25"
                    whileHover={{ y: -4 }}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center mb-4 shadow-lg group-hover:shadow-cyan-400/25 transition-shadow duration-300">
                        <Target className="h-7 w-7 text-white" />
                      </div>
                      <h4 className="text-white font-semibold text-lg mb-2">复制方法</h4>
                      <p className="text-slate-300 text-sm leading-relaxed">基于Know-How训练专属AI模型</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="group bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 rounded-2xl p-6 border border-indigo-500/20 hover:border-indigo-400/40 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25"
                    whileHover={{ y: -4 }}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg group-hover:shadow-indigo-500/25 transition-shadow duration-300">
                        <Zap className="h-7 w-7 text-white" />
                      </div>
                      <h4 className="text-white font-semibold text-lg mb-2">放大能力</h4>
                      <p className="text-slate-300 text-sm leading-relaxed">24/7不间断处理海量信息</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="group bg-gradient-to-br from-cyan-400/10 to-cyan-500/10 rounded-2xl p-6 border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/25"
                    whileHover={{ y: -4 }}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center mb-4 shadow-lg group-hover:shadow-cyan-400/25 transition-shadow duration-300">
                        <Award className="h-7 w-7 text-white" />
                      </div>
                      <h4 className="text-white font-semibold text-lg mb-2">超越极限</h4>
                      <p className="text-slate-300 text-sm leading-relaxed">专业能力指数级增强</p>
                    </div>
                  </motion.div>
                </div>

                {/* 底部说明 */}
                <div className="text-center mt-10 pt-8 border-t border-slate-700/50">
                  <p className="text-slate-400 text-sm">
                    🎯 <span className="text-indigo-400">3分钟对话</span> → <span className="text-cyan-400">专属AI顾问</span> → <span className="text-emerald-400">永远在线服务</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 核心演示对话框 - 重新设计为左右布局 */}
        <div className="relative flex gap-8">
          {/* 左侧：客户类型选择按钮 */}
          <div className="w-64 flex-shrink-0">
            <h3 className="text-white text-lg font-semibold mb-4 text-center">选择您的身份</h3>
            <div className="space-y-4">
              {PERSONA_INFO.map((persona) => {
                const Icon = persona.icon;
                const isActive = currentPersona === persona.id;
                
                return (
                  <button
                    key={persona.id}
                    onClick={() => switchPersona(persona.id as any)}
                    className={`w-full p-4 rounded-xl border transition-all duration-300 hover:transform hover:scale-105 ${
                      isActive 
                        ? `bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 border-indigo-400/40 shadow-lg shadow-indigo-500/25 backdrop-blur-[20px]` 
                        : 'backdrop-blur-[20px] bg-slate-800/40 border-slate-700/40 hover:bg-slate-800/60 hover:border-slate-600/60'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                      isActive ? 'from-indigo-500 to-indigo-600' : 'from-slate-600 to-slate-700'
                    } flex items-center justify-center mb-3 mx-auto shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-white font-semibold text-sm mb-2">{persona.label}</h4>
                    <p className="text-slate-300 text-xs leading-relaxed">{persona.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 右侧：主要演示区域 */}
          <div className="flex-1 relative">
          {/* 统一背景光效 */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-transparent to-cyan-400/20 blur-xl rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-slate-800/10 blur-2xl rounded-3xl"></div>
          
          <div className="relative backdrop-blur-[20px] bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 rounded-3xl shadow-xl shadow-slate-900/50 p-10 md:p-12">
          {/* 流程进度指示器 - 优化设计 */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center space-x-4">
              {['客户输入', 'MRD生成', 'Core Agent', '团队协作', '结果聚合'].map((stage, index) => {
                const stageKeys: DemoStage[] = ['input', 'mrd', 'core', 'agents', 'result'];
                const currentStageIndex = stageKeys.indexOf(demoStage);
                const isActive = index === currentStageIndex;
                const isCompleted = index < currentStageIndex;
                
                return (
                  <React.Fragment key={stage}>
                    <button 
                      onClick={() => {
                        setAutoPlay(false);
                        setDemoStage(stageKeys[index]);
                      }}
                      className={`flex items-center space-x-3 px-5 py-3 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-[10px] ${
                        isActive ? 'bg-gradient-to-r from-indigo-500/30 to-indigo-600/30 border border-indigo-400/60 shadow-lg shadow-indigo-500/25' : 
                        isCompleted ? 'bg-gradient-to-r from-emerald-500/30 to-emerald-600/30 border border-emerald-400/60 shadow-lg shadow-emerald-500/25' : 
                        'bg-slate-800/40 border border-slate-700/40 hover:bg-slate-800/60 hover:border-slate-600/60'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full shadow-lg ${
                        isActive ? 'bg-indigo-400 animate-pulse' : 
                        isCompleted ? 'bg-emerald-400' : 'bg-slate-500'
                      }`} />
                      <span className={`text-base font-semibold tracking-wide ${
                        isActive ? 'text-indigo-300' : 
                        isCompleted ? 'text-emerald-300' : 'text-slate-400'
                      }`}>{stage}</span>
                    </button>
                    {index < 4 && (
                      <ArrowRight className={`w-4 h-4 ${
                        index < currentStageIndex ? 'text-emerald-400' : 'text-slate-600'
                      }`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            <button 
              onClick={restartDemo}
              className="ml-8 px-6 py-3 bg-gradient-to-r from-indigo-500 to-cyan-400 hover:shadow-lg text-white rounded-xl text-base font-semibold transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-[10px] flex items-center gap-2 hover:from-indigo-600 hover:to-cyan-500"
            >
              <personaInfo.icon className="h-5 w-5" />
              重新开始{personaInfo.label}演示
            </button>
          </div>



          {/* 主要演示：全屏单页切换 - 优化容器 */}
          <div className="min-h-[700px] relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={demoStage}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0 w-full"
              >
                {/* 阶段1：客户输入 */}
                {demoStage === 'input' && (
                  <div className="h-full">
                    <div className="text-center mb-10">
                      <h3 className="text-4xl font-bold text-white mb-6 bg-gradient-to-r from-[#00d4ff] to-[#4f46e5] bg-clip-text text-transparent">
                        客户需求输入
                      </h3>
                      <p className="text-gray-300 text-xl font-medium">
                        {CUSTOMER_INPUTS[currentPersona].persona}正在描述具体需求...
                      </p>
                    </div>
                    
                    <div className="max-w-6xl mx-auto">
                      <div className="relative group">
                        {/* 内容卡片发光效果 */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#4f46e5]/20 to-[#00d4ff]/20 blur-xl rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                        <div className="relative backdrop-blur-[20px] bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-10 border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-white/40 transition-all duration-500">
                        <div className="text-center mb-8">
                          <h4 className="text-white font-bold text-2xl mb-3 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">简单描述你的需求</h4>
                          <p className="text-gray-400 text-lg">无需复杂表格或专业术语，用自然语言即可</p>
                        </div>
                        
                        <div className="flex items-start space-x-4">
                          <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-[0_8px_32px_rgba(79,70,229,0.3)] hover:shadow-[0_12px_40px_rgba(79,70,229,0.4)] transition-all duration-300">
                            <div className="text-white font-black text-2xl">{CUSTOMER_INPUTS[currentPersona].persona.charAt(0)}</div>
                          </div>
                          <div className="flex-1">
                            <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 rounded-3xl p-10 border border-gray-600/40 backdrop-blur-[10px] shadow-inner">
                              <div className="text-gray-200 text-xl leading-relaxed min-h-[240px] font-medium">
                                {typingText}<span className="animate-pulse text-blue-400 font-bold">|</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-6">
                              <div className="flex items-center text-gray-400 group">
                                <Send className="w-6 h-6 mr-4 text-[#4f46e5] group-hover:text-[#00d4ff] transition-colors duration-300" />
                                <span className="text-xl font-medium">{CUSTOMER_INPUTS[currentPersona].persona}正在输入...</span>
                              </div>
                              <div className="flex items-center space-x-8 text-gray-400">
                                <span className="flex items-center gap-3 text-lg font-medium">
                                  <Users className="w-5 h-5 text-[#00d4ff]" />
                                  简单易用
                                </span>
                                <span className="flex items-center gap-3 text-lg font-medium">
                                  <Zap className="w-5 h-5 text-[#4f46e5]" />
                                  快速理解
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 阶段2：MRD生成 */}
                {demoStage === 'mrd' && (
                  <div className="h-full">
                    <div className="text-center mb-10">
                      <h3 className="text-4xl font-bold text-white mb-6 bg-gradient-to-r from-[#00d4ff] to-[#4f46e5] bg-clip-text text-transparent">
                        AI智能生成MRD
                      </h3>
                      <p className="text-gray-300 text-xl font-medium">
                        基于客户输入，自动生成详细需求文档
                      </p>
                    </div>
                    
                    <div className="max-w-6xl mx-auto">
                      <div className="backdrop-blur-[20px] bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-2xl p-8 border border-purple-400/30 shadow-[0_8px_32px_rgba(79,70,229,0.3)]">
                        <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                              <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <span className="text-purple-300 font-semibold text-xl">AI智能理解生成中</span>
                              <div className="flex items-center space-x-2 mt-2">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                </div>
                                <span className="text-purple-300">正在深度分析您的需求...</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-gray-400">
                            <span className="flex items-center gap-2">
                              <Brain className="w-4 h-4" />
                              智能理解
                            </span>
                            <span className="flex items-center gap-2">
                              <Globe className="w-4 h-4" />
                              全球数据
                            </span>
                            <span className="flex items-center gap-2">
                              <Award className="w-4 h-4" />
                              专业级
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="bg-gray-900/40 rounded-2xl p-6 border border-gray-600/30 backdrop-blur-sm">
                            <h4 className="text-white font-bold text-xl mb-4 flex items-center gap-3">
                              <FileText className="w-6 h-6 text-blue-400" />
                              生成专业MRD文档
                            </h4>
                            <h5 className="text-blue-300 font-medium mb-4">
                              {CUSTOMER_INPUTS[currentPersona].mrdTitle}
                            </h5>
                            <div className="text-gray-300 space-y-3">
                              <p className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                需求理解和关键信息提取完成
                              </p>
                              <p className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                目标用户和使用场景分析完成
                              </p>
                              <p className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                功能需求和技术要求梳理完成
                              </p>
                              <p className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                预期成果和验收标准定义完成
                              </p>
                            </div>
                          </div>
                          
                          <div className="bg-gray-900/40 rounded-2xl p-6 border border-gray-600/30 backdrop-blur-sm">
                            <h4 className="text-white font-bold text-xl mb-4 flex items-center gap-3">
                              <Activity className="w-6 h-6 text-purple-400" />
                              AI理解深度统计
                            </h4>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-300">关键信息提取</span>
                                <span className="text-blue-400 font-mono text-lg">847个数据点</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-300">业务逻辑分析</span>
                                <span className="text-green-400 font-mono text-lg">98.5%精度</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-300">风险评估模型</span>
                                <span className="text-yellow-400 font-mono text-lg">23个维度</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-300">竞品对比分析</span>
                                <span className="text-purple-400 font-mono text-lg">156家公司</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 阶段3：Core Agent分析 */}
                {demoStage === 'core' && (
                  <div className="h-full">
                    <div className="text-center mb-8">
                      <h3 className="text-3xl font-bold text-white mb-4">
                        Core Agent 智能分析
                      </h3>
                      <p className="text-gray-300 text-lg">
                        MRD进入核心决策Agent，进行深度理解和任务分解
                      </p>
                    </div>
                    
                    <div className="max-w-4xl mx-auto">
                      <div className="backdrop-blur-sm bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-8 border border-blue-400/40">
                        <div className="text-center mb-8">
                          <div className="relative mb-6">
                            <div className="w-24 h-24 bg-gradient-to-r from-[#4f46e5] to-[#00d4ff] rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                              <Brain className="w-12 h-12 text-white" />
                            </div>
                            <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-[#4f46e5] to-[#00d4ff] rounded-3xl mx-auto animate-pulse opacity-30"></div>
                            <div className="absolute -inset-6 w-36 h-36 border-2 border-blue-400/30 rounded-full mx-auto animate-spin" style={{animationDuration: '8s'}}></div>
                          </div>
                          <h4 className="text-blue-300 font-bold text-2xl mb-2">Core Agent</h4>
                          <p className="text-blue-200 mb-6">决策中心 · 智能理解</p>
                          
                          <div className="space-y-4 text-left max-w-md mx-auto">
                            <div className="flex items-center space-x-3 text-blue-100">
                              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                              <span className="text-lg">正在深度理解MRD内容...</span>
                            </div>
                            <div className="flex items-center space-x-3 text-blue-100">
                              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                              <span className="text-lg">识别关键任务和优先级...</span>
                            </div>
                            <div className="flex items-center space-x-3 text-blue-100">
                              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                              <span className="text-lg">规划最优执行路径...</span>
                            </div>
                            <div className="flex items-center space-x-3 text-blue-100">
                              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
                              <span className="text-lg">准备分配给专业Agent...</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 阶段4：Agents协作 */}
                {demoStage === 'agents' && (
                  <div className="h-full">
                    <div className="text-center mb-8">
                      <h3 className="text-3xl font-bold text-white mb-4">
                        专业Agent团队协作
                      </h3>
                      <p className="text-gray-300 text-lg">
                        Core Agent将任务分配给专业团队，并行处理
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                      {currentWorkflow.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = index === workflowStep;
                        const isCompleted = workflowProgress[index] === 100;
                        const currentProgress = workflowProgress[index] || 0;
                        
                        return (
                          <motion.div
                            key={step.id}
                            className={`p-6 rounded-xl border transition-all duration-300 ${
                              isActive 
                                ? `backdrop-blur-[20px] bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 border-indigo-400/40 shadow-lg shadow-indigo-500/25 scale-105` 
                                : isCompleted
                                  ? 'backdrop-blur-[20px] bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border-emerald-400/40 shadow-lg shadow-emerald-500/25'
                                  : 'backdrop-blur-[20px] bg-slate-800/40 border-slate-700/40 hover:bg-slate-800/60'
                            }`}
                            initial={{ opacity: 0.6 }}
                            animate={{ 
                              opacity: isActive ? 1 : (isCompleted ? 0.9 : 0.6),
                              scale: isActive ? 1.05 : 1
                            }}
                            whileHover={{ scale: 1.02, y: -2 }}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                                  isActive ? 'bg-gradient-to-br from-indigo-500 to-indigo-600' :
                                  isCompleted ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' :
                                  'bg-gradient-to-br from-slate-600 to-slate-700'
                                }`}>
                                  {isCompleted ? (
                                    <CheckCircle className="h-6 w-6 text-white" />
                                  ) : (
                                    <Icon className="h-6 w-6 text-white" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-white font-semibold">{step.title}</h4>
                                  <p className="text-slate-400 text-sm flex items-center gap-1">
                                    <Award className="h-3 w-3" />
                                    {step.agent}
                                  </p>
                                </div>
                              </div>
                              {isActive && (
                                <div className="flex items-center gap-1">
                                  <Activity className="h-4 w-4 text-cyan-400 animate-pulse" />
                                  <span className="text-sm text-cyan-400">处理中</span>
                                </div>
                              )}
                            </div>
                            
                            <p className="text-slate-300 text-sm mb-3 leading-relaxed">
                              {step.description}
                            </p>
                            
                            {step.details && (
                              <div className="bg-slate-800/40 rounded-lg p-3 mb-3 border border-slate-700/40">
                                <p className="text-xs text-slate-400 leading-relaxed flex items-start gap-2">
                                  <Database className="h-3 w-3 mt-0.5 text-cyan-400 flex-shrink-0" />
                                  <span>{step.details}</span>
                                </p>
                              </div>
                            )}
                            
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-400 flex items-center gap-1">
                                  <Cpu className="h-3 w-3" />
                                  处理进度
                                </span>
                                <span className={`font-mono ${
                                  currentProgress === 100 ? 'text-emerald-400' : 
                                  currentProgress > 50 ? 'text-cyan-400' : 'text-slate-400'
                                }`}>{Math.round(currentProgress)}%</span>
                              </div>
                              <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                                <motion.div 
                                  className={`h-2 rounded-full shadow-lg ${
                                    currentProgress === 100 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
                                    'bg-gradient-to-r from-indigo-400 to-cyan-400'
                                  }`}
                                  initial={{ width: "0%" }}
                                  animate={{ width: `${currentProgress}%` }}
                                  transition={{ duration: 0.5, ease: "easeOut" }}
                                />
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 阶段5：云端部署 */}
                {demoStage === 'result' && (
                  <div className="h-full">
                    <div className="text-center mb-8">
                      <h3 className="text-3xl font-bold text-white mb-4">
                        专属AI顾问云端部署成功
                      </h3>
                      <p className="text-slate-300 text-lg">
                        不是一次性报告，是24/7持续在线的专业助手
                      </p>
                    </div>
                    
                    <div className="max-w-5xl mx-auto">
                      <div className="backdrop-blur-[20px] bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl p-8 border border-slate-700/50 shadow-xl shadow-slate-900/50">
                        <div className="text-center mb-8">
                          <div className="relative mb-6">
                            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/25">
                              <Cloud className="w-12 h-12 text-white" />
                            </div>
                            <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl mx-auto animate-pulse opacity-30"></div>
                            <div className="absolute -inset-6 w-36 h-36 border-2 border-blue-400/30 rounded-full mx-auto animate-spin" style={{animationDuration: '8s'}}></div>
                          </div>
                          <h4 className="text-blue-300 font-bold text-2xl mb-2">云端部署成功</h4>
                          <p className="text-blue-200 mb-4">你的专属AI{PERSONA_INFO.find(p => p.id === currentPersona)?.label}已在AWS云端24/7运行</p>
                          
                          <div className="inline-flex items-center space-x-3 bg-blue-600/20 text-blue-300 px-6 py-3 rounded-full border border-blue-400/30">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="font-medium">在线工作中 - 随时为您提供专业分析</span>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-6">
                          <div className="bg-gray-900/40 rounded-2xl p-6 border border-gray-600/30 backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                                <Activity className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h5 className="text-white font-semibold">24/7持续监控</h5>
                                <p className="text-gray-400 text-xs">实时数据更新</p>
                              </div>
                            </div>
                            <p className="text-gray-300 text-sm">持续监控市场变化和新机会，及时发送关键信息预警</p>
                          </div>
                          
                          <div className="bg-gray-900/40 rounded-2xl p-6 border border-gray-600/30 backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                                <Zap className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h5 className="text-white font-semibold">智能预警系统</h5>
                                <p className="text-gray-400 text-xs">主动推送分析</p>
                              </div>
                            </div>
                            <p className="text-gray-300 text-sm">发现重要投资机会或风险时，立即推送详细分析报告</p>
                          </div>
                          
                          <div className="bg-gray-900/40 rounded-2xl p-6 border border-gray-600/30 backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h5 className="text-white font-semibold">随时在线对话</h5>
                                <p className="text-gray-400 text-xs">专业AI助手</p>
                              </div>
                            </div>
                            <p className="text-gray-300 text-sm">随时通过Web界面与您的专属AI顾问深度对话</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
      </div>

      {/* 定价方案弹窗 */}
      <AnimatePresence>
        {showPricingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPricingModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="backdrop-blur-[20px] bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white">定价方案</h2>
                <button
                  onClick={() => setShowPricingModal(false)}
                  className="text-white/60 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* 免费体验套餐 */}
                <div className="backdrop-blur-[20px] bg-gradient-to-br from-gray-900/40 to-gray-800/40 border border-gray-600/30 rounded-xl p-6">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-gray-600 to-gray-500 mb-4">
                      <Star className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">免费方案</h3>
                    <div className="text-3xl font-bold text-white mb-1">
                      ¥0
                      <span className="text-base font-normal text-gray-400">/月</span>
                    </div>
                    <p className="text-gray-400 text-sm">探索AI增强的专业能力</p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-2 text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm">每日1个分析任务</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm">3个基础Agent仓库</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm">基础MRD生成</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm">社区支持</span>
                    </li>
                  </ul>
                  <button className="w-full py-3 px-6 bg-gradient-to-r from-gray-600 to-gray-500 text-white rounded-xl font-semibold hover:from-gray-500 hover:to-gray-400 transition-all duration-300 hover:shadow-lg">
                    立即开始免费体验
                  </button>
                </div>

                {/* 专业版套餐 */}
                <div className="backdrop-blur-[20px] bg-gradient-to-br from-indigo-500/10 to-cyan-400/10 rounded-xl p-6 border-2 border-indigo-500/30 hover:border-indigo-400/50 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/30 relative">
                  {/* 推荐标签 */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 text-white px-4 py-1 rounded-full text-xs font-semibold">
                      推荐方案
                    </div>
                  </div>
                  
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-400 mb-4 shadow-lg">
                      <Rocket className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">专业方案</h3>
                    <div className="text-3xl font-bold text-white mb-1">
                      ¥99
                      <span className="text-base font-normal text-gray-400">/月</span>
                    </div>
                    <p className="text-gray-300 text-sm">专业人士的AI超级增强器</p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-2 text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm"><strong className="text-cyan-400">24/7</strong> 无限制服务</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm">每月<strong className="text-cyan-400">3个MRD免费</strong>生成</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm">额外MRD <strong className="text-cyan-400">12元/篇</strong></span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm"><strong className="text-cyan-400">5个专业</strong>Agent仓库</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
                        <Infinity className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm"><strong className="text-cyan-400">无限制</strong>分析任务</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm">专属客服支持</span>
                    </li>
                  </ul>
                  <button className="w-full py-3 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 hover:shadow-lg">
                    立即升级专业版
                  </button>
                </div>

                {/* 企业定制套餐 */}
                <div className="backdrop-blur-[20px] bg-gradient-to-br from-slate-900/40 to-slate-800/40 border border-slate-600/30 rounded-xl p-6 hover:border-slate-500/50 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-lg">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-slate-600 to-slate-500 mb-4">
                      <Building2 className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">企业定制</h3>
                    <div className="text-2xl font-bold text-white mb-1">
                      联系销售
                    </div>
                    <p className="text-gray-300 text-sm">Enterprise</p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-2 text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm">无限制MRD生成</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm">专属Agent仓库</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm">私有化部署</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm">7×24技术支持</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm">定制化培训</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm">SLA服务保障</span>
                    </li>
                  </ul>
                  <button className="w-full py-3 px-6 border border-slate-500 text-slate-300 rounded-xl hover:bg-slate-700/30 hover:border-slate-400 transition-all duration-300 font-semibold">
                    联系销售
                  </button>
                </div>
              </div>

              <div className="mt-8 p-6 backdrop-blur-[20px] bg-gradient-to-r from-gray-900/30 to-gray-800/30 border border-gray-600/30 rounded-xl">
                <h4 className="text-white font-semibold mb-4 text-center">为什么选择 Me² NEXUS?</h4>
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-2">
                      <Shield className="h-6 w-6 text-blue-400" />
                    </div>
                    <h5 className="text-white font-medium mb-1">数据安全</h5>
                    <p className="text-gray-400 text-sm">银行级安全保护</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-2">
                      <Zap className="h-6 w-6 text-green-400" />
                    </div>
                    <h5 className="text-white font-medium mb-1">快速部署</h5>
                    <p className="text-gray-400 text-sm">3分钟即可上线</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-2">
                      <Globe className="h-6 w-6 text-purple-400" />
                    </div>
                    <h5 className="text-white font-medium mb-1">7×24服务</h5>
                    <p className="text-gray-400 text-sm">永不下线的顾问</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 登录弹窗 */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowLoginModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="backdrop-blur-[20px] bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-8 max-w-md w-full shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">登录 Me² NEXUS</h2>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="text-white/60 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* 邮箱登录 */}
                <button className="w-full flex items-center justify-center gap-3 py-3 px-4 backdrop-blur-[20px] bg-slate-800/60 border border-slate-700/60 rounded-lg text-white hover:bg-slate-800/80 hover:border-slate-600/80 transition-all duration-200">
                  <Mail className="h-5 w-5" />
                  <span>邮箱快速登录</span>
                </button>

                {/* TikTok登录 */}
                <button className="w-full flex items-center justify-center gap-3 py-3 px-4 backdrop-blur-[20px] bg-gradient-to-r from-pink-600/80 to-red-600/80 border border-pink-500/40 rounded-lg text-white hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-200">
                  <Video className="h-5 w-5" />
                  <span>TikTok 登录</span>
                </button>

                {/* 微信登录 */}
                <button className="w-full flex items-center justify-center gap-3 py-3 px-4 backdrop-blur-[20px] bg-gradient-to-r from-emerald-600/80 to-green-600/80 border border-emerald-500/40 rounded-lg text-white hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200">
                  <MessageCircle className="h-5 w-5" />
                  <span>微信登录</span>
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-700/50">
                <p className="text-slate-400 text-center text-sm">
                  首次登录即表示同意
                  <span className="text-cyan-400 hover:text-cyan-300 cursor-pointer"> 用户协议 </span>
                  和
                  <span className="text-cyan-400 hover:text-cyan-300 cursor-pointer"> 隐私政策</span>
                </p>
              </div>

              <div className="mt-6 p-4 backdrop-blur-[20px] bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border border-indigo-400/30 rounded-lg">
                <p className="text-indigo-300 text-center text-sm">
                  🎉 新用户注册即获得 <span className="font-semibold text-white">7天专业版免费试用</span>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 产品功能弹窗 */}
      <AnimatePresence>
        {showFeaturesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowFeaturesModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="backdrop-blur-[20px] bg-white/5 border border-white/20 rounded-2xl p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white">产品功能</h2>
                <button
                  onClick={() => setShowFeaturesModal(false)}
                  className="text-white/60 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="backdrop-blur-[20px] bg-white/5 border border-[#00d4ff]/20 rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#4f46e5] flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-xl mb-3">AI思维学习</h3>
                  <p className="text-gray-300 mb-4">通过深度对话理解你的专业逻辑和判断标准，建立个性化思维模型</p>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• 3分钟快速学习个人思维模式</li>
                    <li>• 专业领域知识自动整合</li>
                    <li>• 决策逻辑智能复制</li>
                  </ul>
                </div>

                <div className="backdrop-blur-[20px] bg-white/5 border border-[#4f46e5]/20 rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#00d4ff] flex items-center justify-center mb-4">
                    <Workflow className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-xl mb-3">智能工作流</h3>
                  <p className="text-gray-300 mb-4">自动化专业工作流程，从需求分析到方案生成一站式完成</p>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• 自动生成专业MRD文档</li>
                    <li>• 多Agent协同作业</li>
                    <li>• 24/7云端持续服务</li>
                  </ul>
                </div>

                <div className="backdrop-blur-[20px] bg-white/5 border border-[#00d4ff]/20 rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#4f46e5] flex items-center justify-center mb-4">
                    <Database className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-xl mb-3">专业数据源</h3>
                  <p className="text-gray-300 mb-4">接入彭博终端、Westlaw等专业级数据源，确保分析质量</p>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• 实时市场数据接入</li>
                    <li>• 专业法律数据库</li>
                    <li>• 企业情报深度分析</li>
                  </ul>
                </div>

                <div className="backdrop-blur-[20px] bg-white/5 border border-[#4f46e5]/20 rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#00d4ff] flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-xl mb-3">企业级安全</h3>
                  <p className="text-gray-300 mb-4">银行级数据加密，符合金融、法律行业安全标准</p>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• 端到端加密通信</li>
                    <li>• 合规审计日志</li>
                    <li>• 私有化部署支持</li>
                  </ul>
                </div>

                <div className="backdrop-blur-[20px] bg-white/5 border border-[#00d4ff]/20 rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#4f46e5] flex items-center justify-center mb-4">
                    <Rocket className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-xl mb-3">快速部署</h3>
                  <p className="text-gray-300 mb-4">3分钟完成专属AI顾问部署，即开即用的专业服务</p>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• 零代码快速配置</li>
                    <li>• 一键云端部署</li>
                    <li>• API接口灵活调用</li>
                  </ul>
                </div>

                <div className="backdrop-blur-[20px] bg-white/5 border border-[#4f46e5]/20 rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#00d4ff] flex items-center justify-center mb-4">
                    <LineChart className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-xl mb-3">智能分析</h3>
                  <p className="text-gray-300 mb-4">基于你的专业方法论，提供深度分析和预测建议</p>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• 个性化分析框架</li>
                    <li>• 趋势预测模型</li>
                    <li>• 风险评估系统</li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <button className="bg-gradient-to-r from-[#4f46e5] to-[#00d4ff] text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200">
                  立即体验产品功能
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 客户案例弹窗 */}
      <AnimatePresence>
        {showCasesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCasesModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="backdrop-blur-[20px] bg-white/5 border border-white/20 rounded-2xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white">客户案例</h2>
                <button
                  onClick={() => setShowCasesModal(false)}
                  className="text-white/60 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* 投资人案例 */}
                <div className="backdrop-blur-[20px] bg-white/5 border border-[#00d4ff]/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <PieChart className="h-8 w-8 text-[#00d4ff]" />
                    <div>
                      <h3 className="text-white font-semibold text-lg">资深投资人 - 李总</h3>
                      <p className="text-gray-400 text-sm">某知名投资机构合伙人</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="bg-[#00d4ff]/10 border border-[#00d4ff]/20 rounded-lg p-3">
                      <p className="text-[#00d4ff] text-sm font-medium mb-2">使用场景</p>
                      <p className="text-gray-300 text-sm">AI初创企业投资决策分析，50万投资额度快速评估</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-white font-medium mb-2">效果提升</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">分析速度</span>
                        <span className="text-[#00d4ff] font-semibold">↑ 85%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">决策精准度</span>
                        <span className="text-[#00d4ff] font-semibold">↑ 72%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">投资回报率</span>
                        <span className="text-[#00d4ff] font-semibold">↑ 1.8x</span>
                      </div>
                    </div>
                  </div>
                  <blockquote className="border-l-2 border-[#00d4ff] pl-3 text-gray-300 text-sm italic">
                    "AI顾问让我的投资决策更加数据化和系统化，7维度评分系统特别实用"
                  </blockquote>
                </div>

                {/* 企业CEO案例 */}
                <div className="backdrop-blur-[20px] bg-white/5 border border-[#4f46e5]/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Briefcase className="h-8 w-8 text-[#4f46e5]" />
                    <div>
                      <h3 className="text-white font-semibold text-lg">企业CEO - 王总</h3>
                      <p className="text-gray-400 text-sm">制造业科技公司CEO</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="bg-[#4f46e5]/10 border border-[#4f46e5]/20 rounded-lg p-3">
                      <p className="text-[#4f46e5] text-sm font-medium mb-2">使用场景</p>
                      <p className="text-gray-300 text-sm">企业数字化转型决策，AI质检系统选型和实施</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-white font-medium mb-2">效果提升</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">决策效率</span>
                        <span className="text-[#4f46e5] font-semibold">↑ 68%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">成本节约</span>
                        <span className="text-[#4f46e5] font-semibold">↓ 45%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">实施成功率</span>
                        <span className="text-[#4f46e5] font-semibold">↑ 90%</span>
                      </div>
                    </div>
                  </div>
                  <blockquote className="border-l-2 border-[#4f46e5] pl-3 text-gray-300 text-sm italic">
                    "24/7的企业战略智囊团，帮我们找到了最适合的AI解决方案"
                  </blockquote>
                </div>

                {/* 资深律师案例 */}
                <div className="backdrop-blur-[20px] bg-white/5 border border-[#00d4ff]/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Scale className="h-8 w-8 text-[#00d4ff]" />
                    <div>
                      <h3 className="text-white font-semibold text-lg">资深律师 - 张律师</h3>
                      <p className="text-gray-400 text-sm">顶级律所高级合伙人</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="bg-[#00d4ff]/10 border border-[#00d4ff]/20 rounded-lg p-3">
                      <p className="text-[#00d4ff] text-sm font-medium mb-2">使用场景</p>
                      <p className="text-gray-300 text-sm">复杂并购协议条款分析，12亿投资对赌条款审查</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-white font-medium mb-2">效果提升</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">审查速度</span>
                        <span className="text-[#00d4ff] font-semibold">↑ 92%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">风险识别</span>
                        <span className="text-[#00d4ff] font-semibold">↑ 156%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">客户满意度</span>
                        <span className="text-[#00d4ff] font-semibold">↑ 98%</span>
                      </div>
                    </div>
                  </div>
                  <blockquote className="border-l-2 border-[#00d4ff] pl-3 text-gray-300 text-sm italic">
                    "Westlaw级数据库 + AI分析，让法律服务更专业更高效"
                  </blockquote>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button className="bg-gradient-to-r from-[#4f46e5] to-[#00d4ff] text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200">
                  查看更多客户案例
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

        {/* 价格方案区域 */}
        <div className="mt-16 pt-16 border-t border-white/10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 bg-gradient-to-r from-[#00d4ff] to-[#4f46e5] bg-clip-text text-transparent">
              选择适合您的方案
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              从免费体验到专业服务，为每一位专业人士量身定制
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* 免费方案 */}
            <div className="backdrop-blur-[20px] bg-gradient-to-br from-white/5 to-white/2 rounded-3xl p-8 border border-white/20 hover:border-white/30 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-gray-600 to-gray-500 mb-4">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">免费体验</h3>
                <div className="flex items-baseline justify-center gap-1 mb-4">
                  <span className="text-4xl font-black text-white">¥0</span>
                  <span className="text-gray-400">/月</span>
                </div>
                <p className="text-gray-300 text-sm">探索AI增强的专业能力</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm">每日1个分析任务</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm">3个基础Agent仓库</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm">基础MRD生成</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm">社区支持</span>
                </li>
              </ul>
              
              <button className="w-full py-3 px-6 bg-gradient-to-r from-gray-600 to-gray-500 text-white rounded-xl font-semibold hover:from-gray-500 hover:to-gray-400 transition-all duration-300 hover:shadow-lg">
                立即开始免费体验
              </button>
            </div>

            {/* 专业方案 */}
            <div className="backdrop-blur-[20px] bg-gradient-to-br from-[#4f46e5]/10 to-[#00d4ff]/10 rounded-3xl p-8 border-2 border-[#4f46e5]/30 hover:border-[#4f46e5]/50 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(79,70,229,0.3)] relative">
              {/* 推荐标签 */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-[#4f46e5] to-[#00d4ff] text-white px-4 py-1 rounded-full text-xs font-semibold">
                  推荐方案
                </div>
              </div>
              
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-[#4f46e5] to-[#00d4ff] mb-4 shadow-lg">
                  <Rocket className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">专业方案</h3>
                <div className="flex items-baseline justify-center gap-1 mb-4">
                  <span className="text-4xl font-black text-white">¥99</span>
                  <span className="text-gray-400">/月</span>
                </div>
                <p className="text-gray-300 text-sm">专业人士的AI超级增强器</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#4f46e5] to-[#00d4ff] flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm"><strong className="text-[#00d4ff]">24/7</strong> 无限制服务</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#4f46e5] to-[#00d4ff] flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm">每月<strong className="text-[#00d4ff]">3个MRD免费</strong>生成</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#4f46e5] to-[#00d4ff] flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm">额外MRD <strong className="text-[#00d4ff]">12元/篇</strong></span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#4f46e5] to-[#00d4ff] flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm"><strong className="text-[#00d4ff]">5个专业</strong>Agent仓库</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#4f46e5] to-[#00d4ff] flex items-center justify-center flex-shrink-0">
                    <Infinity className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm"><strong className="text-[#00d4ff]">无限制</strong>分析任务</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#4f46e5] to-[#00d4ff] flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm">专属客服支持</span>
                </li>
              </ul>
              
              <button className="w-full py-3 px-6 bg-gradient-to-r from-[#10B981] to-[#059669] text-white rounded-xl font-semibold hover:from-[#059669] hover:to-[#047857] transition-all duration-300 hover:shadow-lg">
                立即升级专业版
              </button>
            </div>
          </div>
          
          <div className="text-center mt-8 pt-6 border-t border-white/10">
            <p className="text-gray-400 text-sm">
              💡 所有方案均支持<span className="text-[#4f46e5]">7天无理由退款</span>，让您安心体验
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
