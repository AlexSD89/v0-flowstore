/**
 * LaunchX 智链平台 v3 - 增强版主页英雄区
 * 
 * 集成智能导航系统的动画诱饵主页，特性包括：
 * 1. 大对话框中心设计 - 全屏沉浸式体验
 * 2. 智能路径推荐 - 基于用户输入的意图分析
 * 3. 6AI角色展示 - 动态角色介绍和交互
 * 4. 渐进式引导 - 从视觉到功能的自然过渡
 * 5. 个性化体验 - 基于用户角色的适配
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  Search,
  Sparkles, 
  ArrowRight,
  Lightbulb,
  Users,
  Zap,
  Target,
  Brain,
  Rocket,
  ChevronDown,
  PlayCircle,
  Mic,
  MicOff,
  Send
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { AGENTS, AGENT_ICONS, type AgentRole } from "@/constants/agents";
import { useAppStore } from "@/stores";
import { pageNavigationService, type NavigationContext } from "@/services/page-navigation-service";
import { intelligentRecommendationEngine } from "@/services/intelligent-recommendation-engine";

// ==================== 组件类型定义 ====================

interface TypingEffect {
  text: string;
  isVisible: boolean;
  delay: number;
}

interface AIAgentDemo {
  agent: AgentRole;
  message: string;
  isActive: boolean;
  confidence: number;
}

interface PathSuggestion {
  path: string;
  title: string;
  description: string;
  confidence: number;
  icon: React.ComponentType<any>;
  benefits: string[];
}

// ==================== 主组件 ====================

export function EnhancedHeroSection() {
  const router = useRouter();
  const { user, currentRole } = useAppStore();
  
  // 状态管理
  const [userInput, setUserInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [pathSuggestions, setPathSuggestions] = useState<PathSuggestion[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentRole | null>(null);
  const [showAgentDemo, setShowAgentDemo] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'welcome' | 'input' | 'analysis' | 'recommendation'>('welcome');
  
  // 动画状态
  const [typingTexts, setTypingTexts] = useState<TypingEffect[]>([]);
  const [showAgentCards, setShowAgentCards] = useState(false);
  const [agentDemos, setAgentDemos] = useState<AIAgentDemo[]>([]);
  
  // 引用
  const inputRef = useRef<HTMLInputElement>(null);
  const analysisRef = useRef<HTMLDivElement>(null);

  // ==================== 生命周期 ====================

  useEffect(() => {
    // 初始化动画序列
    initializeAnimationSequence();
    
    // 延迟显示AI角色卡片
    const timer = setTimeout(() => {
      setShowAgentCards(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // 当输入改变时，延迟分析用户意图
    if (userInput.trim().length > 5) {
      const debounceTimer = setTimeout(() => {
        analyzeUserIntent(userInput);
      }, 800);
      
      return () => clearTimeout(debounceTimer);
    }
  }, [userInput]);

  // ==================== 动画初始化 ====================

  const initializeAnimationSequence = () => {
    const welcomeTexts: TypingEffect[] = [
      {
        text: "欢迎来到智链平台",
        isVisible: false,
        delay: 0
      },
      {
        text: "AI解决方案的智能发现与协作中心",
        isVisible: false,
        delay: 1500
      },
      {
        text: "让6位AI专家为您量身定制解决方案",
        isVisible: false,
        delay: 3000
      }
    ];

    setTypingTexts(welcomeTexts);

    // 逐个显示文本
    welcomeTexts.forEach((text, index) => {
      setTimeout(() => {
        setTypingTexts(prev => 
          prev.map((item, i) => 
            i === index ? { ...item, isVisible: true } : item
          )
        );
      }, text.delay);
    });

    // 4秒后进入输入阶段
    setTimeout(() => {
      setCurrentPhase('input');
    }, 4500);
  };

  // ==================== 用户意图分析 ====================

  const analyzeUserIntent = async (input: string) => {
    setIsAnalyzing(true);
    setCurrentPhase('analysis');

    try {
      // 构建导航上下文
      const navigationContext: NavigationContext = {
        user,
        currentRole,
        sessionData: {
          isFirstVisit: !user,
          previousPages: [],
          timeOnCurrentPage: Date.now(),
          totalSessionTime: 0,
          interactionCount: 1
        },
        deviceInfo: {
          type: getDeviceType(),
          screenSize: `${window.innerWidth}x${window.innerHeight}`,
          touchSupport: 'ontouchstart' in window
        },
        businessContext: {
          urgency: 'medium'
        }
      };

      // 分析用户意图并获取路径推荐
      const pathRec = pageNavigationService.analyzeUserIntent(input, navigationContext);
      
      // 模拟AI专家分析过程
      await simulateAIAnalysis(input);
      
      // 生成路径建议
      const suggestions = generatePathSuggestions(pathRec, input);
      setPathSuggestions(suggestions);
      
      setCurrentPhase('recommendation');
      setShowSuggestions(true);
      
    } catch (error) {
      console.error('Intent analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const simulateAIAnalysis = async (input: string): Promise<void> => {
    // 模拟6个AI专家的分析过程
    const agents: AgentRole[] = ['alex', 'sarah', 'mike', 'emma', 'david', 'catherine'];
    const demos: AIAgentDemo[] = [];

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];
      const agentConfig = AGENTS[agent];
      
      // 生成专家分析消息
      const analysisMessage = generateAgentAnalysis(agent, input);
      
      demos.push({
        agent,
        message: analysisMessage,
        isActive: false,
        confidence: 0.7 + Math.random() * 0.3
      });

      // 延迟显示每个专家的分析
      setTimeout(() => {
        setAgentDemos(prev => {
          const updated = [...prev];
          if (updated[i]) {
            updated[i].isActive = true;
          } else {
            updated.push(demos[i]);
          }
          return updated;
        });
      }, i * 500);
    }

    // 等待所有分析完成
    await new Promise(resolve => setTimeout(resolve, agents.length * 500 + 1000));
  };

  const generateAgentAnalysis = (agent: AgentRole, input: string): string => {
    const agentConfig = AGENTS[agent];
    const analysisTemplates: Record<AgentRole, string[]> = {
      alex: [
        "我分析出您需要解决业务流程自动化问题",
        "从需求角度看，这涉及到效率提升和成本控制",
        "建议优先考虑易于集成的解决方案"
      ],
      sarah: [
        "技术架构上需要考虑系统兼容性",
        "推荐采用云原生架构确保扩展性",
        "API集成是关键的技术要求"
      ],
      mike: [
        "用户体验设计应该注重简洁性",
        "界面交互需要符合用户习惯",
        "建议进行用户测试验证可用性"
      ],
      emma: [
        "数据分析显示这类需求增长趋势明显",
        "建议建立数据监控和分析体系",
        "ROI预期在6-12个月内可见"
      ],
      david: [
        "项目实施建议分3个阶段进行",
        "预计实施周期为2-3个月",
        "需要考虑变更管理和培训计划"
      ],
      catherine: [
        "从商业价值角度这是明智的投资",
        "市场趋势支持这个决策方向",
        "建议制定清晰的成功指标"
      ]
    };

    const templates = analysisTemplates[agent];
    return templates[Math.floor(Math.random() * templates.length)];
  };

  // ==================== 路径建议生成 ====================

  const generatePathSuggestions = (pathRec: any, input: string): PathSuggestion[] => {
    const suggestions: PathSuggestion[] = [
      {
        path: pathRec.targetPath,
        title: "推荐路径",
        description: pathRec.reason,
        confidence: pathRec.confidence,
        icon: getPathIcon(pathRec.targetPath),
        benefits: pathRec.benefits || []
      }
    ];

    // 添加替代路径
    if (pathRec.alternativePaths) {
      pathRec.alternativePaths.forEach((altPath: string, index: number) => {
        suggestions.push({
          path: altPath,
          title: `替代方案 ${index + 1}`,
          description: getPathDescription(altPath),
          confidence: pathRec.confidence * 0.8,
          icon: getPathIcon(altPath),
          benefits: getPathBenefits(altPath)
        });
      });
    }

    return suggestions.slice(0, 3); // 最多显示3个建议
  };

  const getPathIcon = (path: string): React.ComponentType<any> => {
    if (path.includes('/market')) return Search;
    if (path.includes('/chat')) return MessageCircle;
    if (path.includes('/workspace')) return Lightbulb;
    if (path.includes('/dashboard')) return Target;
    return Sparkles;
  };

  const getPathDescription = (path: string): string => {
    const descriptions: Record<string, string> = {
      '/market': '浏览AI产品市场，发现适合的解决方案',
      '/chat': '与AI专家对话，获得即时专业建议',
      '/workspace': '创建项目，使用AI协作工具深度分析',
      '/dashboard/buyer': '查看采购数据和订单管理',
      '/dashboard/vendor': '管理产品和查看销售分析',
      '/dashboard/distributor': '管理分销链接和佣金收益'
    };
    
    return descriptions[path] || '探索平台功能，找到最佳解决方案';
  };

  const getPathBenefits = (path: string): string[] => {
    const benefits: Record<string, string[]> = {
      '/market': ['产品对比', '价格透明', '用户评价'],
      '/chat': ['即时响应', '专业建议', '个性化'],
      '/workspace': ['AI协作', '项目管理', '深度分析'],
      '/dashboard/buyer': ['数据洞察', '订单追踪', '成本分析'],
      '/dashboard/vendor': ['销售分析', '客户管理', '产品优化'],
      '/dashboard/distributor': ['佣金管理', '推广分析', '收益优化']
    };
    
    return benefits[path] || ['智能推荐', '专业服务', '高效便捷'];
  };

  // ==================== 事件处理 ====================

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    if (e.target.value.trim().length === 0) {
      setShowSuggestions(false);
      setCurrentPhase('input');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      analyzeUserIntent(userInput);
    }
  };

  const handleSuggestionClick = (suggestion: PathSuggestion) => {
    // 记录用户选择
    pageNavigationService.recordPageVisit('/', {
      user,
      currentRole,
      sessionData: {
        isFirstVisit: !user,
        previousPages: [],
        timeOnCurrentPage: Date.now(),
        totalSessionTime: 0,
        interactionCount: 1
      },
      deviceInfo: {
        type: getDeviceType(),
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        touchSupport: 'ontouchstart' in window
      },
      businessContext: {}
    });

    // 导航到建议路径
    router.push(suggestion.path);
  };

  const handleAgentClick = (agent: AgentRole) => {
    setSelectedAgent(agent);
    setShowAgentDemo(true);
    
    // 延迟跳转到对话页面
    setTimeout(() => {
      router.push(`/chat?agent=${agent}`);
    }, 1000);
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    
    if (!isListening) {
      startVoiceRecognition();
    } else {
      stopVoiceRecognition();
    }
  };

  const startVoiceRecognition = () => {
    // 语音识别实现
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'zh-CN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.start();
    }
  };

  const stopVoiceRecognition = () => {
    setIsListening(false);
  };

  // ==================== 工具函数 ====================

  const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  };

  // ==================== 渲染组件 ====================

  const renderWelcomePhase = () => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center space-y-8 relative"
    >
      {/* 主标题动画 */}
      <div className="space-y-4">
        {typingTexts.map((text, index) => (
          <AnimatePresence key={index}>
            {text.isVisible && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={index === 0 ? "text-5xl font-bold" : index === 1 ? "text-2xl" : "text-xl text-slate-400"}
              >
                <TypewriterText text={text.text} speed={50} />
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>

      {/* 功能特色展示 - 优化：借鉴Hugging Face的卡片设计和AWS的信任标识 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 4 }}
        className="grid grid-cols-3 gap-8 max-w-4xl mx-auto"
      >
        {[
          { icon: Brain, title: "AI智能分析", desc: "6专家协作", badge: "核心技术", color: "from-blue-500/20 to-purple-500/20" },
          { icon: Zap, title: "即时推荐", desc: "个性化匹配", badge: "实时计算", color: "from-green-500/20 to-blue-500/20" },
          { icon: Users, title: "企业级服务", desc: "专业可靠", badge: "企业认证", color: "from-purple-500/20 to-pink-500/20" }
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 4.5 + index * 0.2 }}
            className={`group relative text-center p-6 rounded-xl bg-gradient-to-br ${feature.color} backdrop-blur-sm border border-slate-700/50 hover:border-cloudsway-primary-500/50 transition-all duration-300 cursor-pointer overflow-hidden`}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* 信任标识 - AWS风格 */}
            <div className="absolute top-3 right-3">
              <Badge variant="outline" className="text-xs bg-green-500/20 border-green-500/50 text-green-400">
                {feature.badge}
              </Badge>
            </div>
            
            {/* 背景光效 */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-cloudsway-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <feature.icon className="w-12 h-12 mx-auto mb-3 text-cloudsway-primary-400 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="font-semibold text-white mb-1 group-hover:text-cloudsway-primary-300 transition-colors">{feature.title}</h3>
            <p className="text-sm text-slate-400">{feature.desc}</p>
            
            {/* 交互提示 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 6 + index * 0.3 }}
              className="mt-3 text-xs text-cloudsway-primary-400/60"
            >
              点击了解更多
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );

  const renderInputPhase = () => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto space-y-8"
    >
      {/* 输入框区域 */}
      <Card className="p-8 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            描述您的需求，让AI为您推荐最佳解决方案
          </h2>
          <p className="text-slate-400">
            支持自然语言描述，我们的AI专家团队将为您提供个性化建议
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            {/* 优化：借鉴OpenAI的实时搜索建议和Linear的快速操作 */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-cloudsway-primary-400 transition-colors">
              <MessageCircle className="w-5 h-5" />
            </div>
            
            <Input
              ref={inputRef}
              value={userInput}
              onChange={handleInputChange}
              placeholder="例如：我需要一个智能客服系统，能够处理多语言客户咨询..."
              className="pl-12 pr-20 py-4 text-lg bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 rounded-xl transition-all duration-300 focus:border-cloudsway-primary-500/50 focus:bg-slate-700/70 focus:shadow-lg focus:shadow-cloudsway-primary-500/10"
              disabled={isAnalyzing}
            />
            
            {/* 输入进度指示器 */}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-cloudsway-primary-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: userInput.length > 0 ? `${Math.min(userInput.length / 50 * 100, 100)}%` : 0 }}
              transition={{ duration: 0.3 }}
            />
            
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={toggleVoiceInput}
                className={`p-2 ${isListening ? 'text-red-400' : 'text-slate-400'}`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              
              <Button
                type="submit"
                size="sm"
                disabled={!userInput.trim() || isAnalyzing}
                className="bg-cloudsway-primary-600 hover:bg-cloudsway-primary-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {isListening && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-red-400 text-sm flex items-center justify-center gap-2"
            >
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              正在聆听您的语音...
            </motion.div>
          )}
        </form>

        {/* 快速入口 - 优化：借鉴Linear的快速操作设计 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {[
            { label: "浏览产品", icon: Search, path: "/market", shortcut: "Cmd+M", color: "hover:border-blue-500/50 hover:text-blue-400" },
            { label: "AI对话", icon: MessageCircle, path: "/chat", shortcut: "Cmd+K", color: "hover:border-green-500/50 hover:text-green-400" },
            { label: "需求分析", icon: Lightbulb, path: "/workspace/specs/new", shortcut: "Cmd+N", color: "hover:border-purple-500/50 hover:text-purple-400" },
            { label: "了解平台", icon: PlayCircle, path: "/?demo=true", shortcut: "Cmd+?", color: "hover:border-orange-500/50 hover:text-orange-400" }
          ].map((quick, index) => (
            <motion.div key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(quick.path)}
                className={`w-full border-slate-600/50 text-slate-300 hover:bg-slate-700/50 flex items-center gap-2 relative group transition-all duration-200 ${quick.color}`}
              >
                <quick.icon className="w-4 h-4" />
                <span className="flex-1 text-left">{quick.label}</span>
                <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 px-1 py-0.5 rounded">
                  {quick.shortcut}
                </span>
              </Button>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* AI角色展示 */}
      <AnimatePresence>
        {showAgentCards && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, staggerChildren: 0.1 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">认识我们的AI专家团队</h3>
              <p className="text-slate-400">6位专业AI助手，为您提供全方位的智能服务</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(AGENTS).map(([agentId, agent], index) => {
                const IconComponent = AGENT_ICONS[agentId as AgentRole];
                return (
                  <motion.div
                    key={agentId}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card 
                      className="p-4 bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300 cursor-pointer group"
                      onClick={() => handleAgentClick(agentId as AgentRole)}
                    >
                      <div className="text-center space-y-3">
                        <div 
                          className="w-16 h-16 mx-auto rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: agent.color.primary + '20' }}
                        >
                          <IconComponent 
                            className="w-8 h-8" 
                            style={{ color: agent.color.primary }}
                          />
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-white">{agent.name}</h4>
                          <p className="text-xs text-slate-400 line-clamp-2">{agent.role}</p>
                        </div>
                        
                        <Badge variant="outline" className="text-xs">
                          {agent.speciality.split('与')[0]}
                        </Badge>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const renderAnalysisPhase = () => (
    <motion.div
      ref={analysisRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-6xl mx-auto space-y-6"
    >
      <div className="text-center mb-8">
        <motion.h2 
          className="text-3xl font-bold text-white mb-2"
          animate={{ 
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{
            background: 'linear-gradient(45deg, #fff, #6366f1, #06b6d4, #fff)',
            backgroundSize: '300% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          AI专家团队正在分析您的需求
        </motion.h2>
        <p className="text-slate-400 mb-4">6位专业AI正在协作，为您提供最佳解决方案</p>
        
        {/* 优化：借鉴Midjourney的实时生成展示 */}
        <div className="flex items-center justify-center gap-2 text-sm text-cloudsway-primary-400">
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-cloudsway-primary-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
          <span>实时分析中...</span>
        </div>
      </div>

      {/* AI分析过程展示 - 优化：借鉴Claude的对话式交互和Figma的实时协作可视化 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(AGENTS).map(([agentId, agent], index) => {
          const demo = agentDemos.find(d => d.agent === agentId);
          const IconComponent = AGENT_ICONS[agentId as AgentRole];
          
          return (
            <motion.div
              key={agentId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: demo?.isActive ? 1 : 0.3, 
                scale: demo?.isActive ? 1 : 0.9 
              }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: demo?.isActive ? 1.02 : 0.9 }}
            >
              <Card className={`p-4 relative overflow-hidden transition-all duration-500 ${
                demo?.isActive 
                  ? 'bg-slate-800/50 border-slate-600/50 shadow-lg shadow-cloudsway-primary-500/10' 
                  : 'bg-slate-800/20 border-slate-700/30'
              }`}>
                {/* 动态背景效果 */}
                {demo?.isActive && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-cloudsway-primary-500/5 to-cloudsway-secondary-500/5"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
                
                {/* 活跃状态指示器 */}
                {demo?.isActive && (
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <motion.div
                      className="w-2 h-2 bg-green-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <span className="text-xs text-green-400">正在分析</span>
                  </div>
                )}
                <div className="flex items-start gap-3 relative z-10">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 relative"
                    style={{ backgroundColor: agent.color.primary + '20' }}
                  >
                    {/* 处理动画 */}
                    {demo?.isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-cloudsway-primary-400"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        style={{ borderTopColor: 'transparent' }}
                      />
                    )}
                    
                    <IconComponent 
                      className="w-5 h-5 transition-all duration-300" 
                      style={{ color: agent.color.primary }}
                    />
                  </div>
                  
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-white">{agent.name}</h4>
                      {demo?.isActive && (
                        <Badge variant="outline" className="text-xs">
                          {Math.round((demo.confidence || 0) * 100)}%
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-xs text-slate-400">{agent.role}</p>
                    
                    {demo?.isActive && demo.message && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
                        className="text-sm text-slate-300 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-lg p-3 border border-slate-600/30 relative overflow-hidden"
                      >
                        {/* 消息背景效果 */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cloudsway-primary-500/5 to-transparent opacity-50" />
                        
                        <div className="relative z-10">
                          <TypewriterText text={demo.message} speed={30} />
                        </div>
                        
                        {/* 置信度指示器 */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-600/30">
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <span>置信度:</span>
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <div key={i} className={`w-1 h-3 rounded-full ${
                                  i < Math.round((demo.confidence || 0) * 5) 
                                    ? 'bg-green-400' 
                                    : 'bg-slate-600'
                                }`} />
                              ))}
                            </div>
                            <span>{Math.round((demo.confidence || 0) * 100)}%</span>
                          </div>
                          
                          <span className="text-xs text-slate-500">
                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </motion.div>
                    )}
                    
                    {demo?.isActive && (
                      <motion.div 
                        className="flex items-center gap-2 text-xs text-slate-500"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <div className="flex gap-1">
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-1 h-1 bg-green-400 rounded-full"
                              animate={{ 
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 1, 0.5]
                              }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: i * 0.2
                              }}
                            />
                          ))}
                        </div>
                        正在分析...
                      </motion.div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* 分析进度 - 优化：更丰富的进度指示器 */}
      <div className="max-w-md mx-auto space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">分析进度</span>
          <span className="text-white font-medium">
            {agentDemos.filter(d => d.isActive).length}/6 专家已完成
          </span>
        </div>
        
        <div className="relative">
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(agentDemos.filter(d => d.isActive).length / 6) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-cloudsway-primary-600 to-cloudsway-secondary-600 rounded-full relative"
            >
              {/* 动态光效 */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
          
          {/* 阶段指示器 */}
          <div className="absolute top-0 w-full h-2 flex items-center">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full border-2 border-slate-800 transition-all duration-300 ${
                  i < agentDemos.filter(d => d.isActive).length 
                    ? 'bg-white scale-110' 
                    : 'bg-slate-600'
                }`}
                style={{ marginLeft: i === 0 ? 0 : 'calc(20% - 4px)' }}
              />
            ))}
          </div>
        </div>
        
        {/* 当前分析专家 */}
        {agentDemos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-sm text-slate-400"
          >
            当前正在分析：
            <span className="text-cloudsway-primary-400 ml-1">
              {Object.values(AGENTS)
                .filter((_, i) => !agentDemos[i]?.isActive)
                .slice(0, 1)
                .map(agent => agent.name)
                .join(', ') || '全部完成'}
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );

  const renderRecommendationPhase = () => (
    <AnimatePresence>
      {showSuggestions && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-5xl mx-auto space-y-6"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">为您推荐最佳路径</h2>
            <p className="text-slate-400">基于AI分析，为您量身定制的解决方案路径</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pathSuggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  type: "spring",
                  bounce: 0.3
                }}
                whileHover={{ 
                  scale: 1.02, 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className="relative p-6 bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 hover:border-cloudsway-primary-500/30 transition-all duration-300 cursor-pointer group h-full overflow-hidden"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {/* 优先级指示器 */}
                  {index === 0 && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-cloudsway-primary-600 text-white text-xs">
                        推荐
                      </Badge>
                    </div>
                  )}
                  
                  {/* 背景光效 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-cloudsway-primary-500/5 to-cloudsway-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <motion.div 
                          className="w-12 h-12 rounded-xl bg-cloudsway-primary-600/20 flex items-center justify-center relative"
                          whileHover={{ rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          {/* 动态边框 */}
                          <motion.div
                            className="absolute inset-0 rounded-xl border-2 border-cloudsway-primary-400/30"
                            animate={{
                              scale: [1, 1.1, 1],
                              opacity: [0.3, 0.6, 0.3]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: index * 0.3
                            }}
                          />
                          
                          <suggestion.icon className="w-6 h-6 text-cloudsway-primary-400 group-hover:scale-110 transition-transform" />
                        </motion.div>
                        
                        <div>
                          <h3 className="font-semibold text-white group-hover:text-cloudsway-primary-300 transition-colors">{suggestion.title}</h3>
                          
                          {/* 置信度显示 */}
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <div className="h-1.5 w-16 bg-slate-700 rounded-full overflow-hidden">
                                <motion.div 
                                  className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${suggestion.confidence * 100}%` }}
                                  transition={{ duration: 1, delay: index * 0.2 }}
                                />
                              </div>
                              <span className="text-xs text-slate-400">
                                {Math.round(suggestion.confidence * 100)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-cloudsway-primary-400 transition-colors" />
                      </motion.div>
                    </div>
                    
                    <p className="text-slate-300 text-sm leading-relaxed">{suggestion.description}</p>
                    
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-cloudsway-primary-400" />
                        核心优势:
                      </h4>
                      
                      <div className="space-y-2">
                        {suggestion.benefits.slice(0, 3).map((benefit, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                            className="flex items-center gap-2"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-cloudsway-primary-400" />
                            <span className="text-xs text-slate-300">{benefit}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        className="w-full bg-gradient-to-r from-cloudsway-primary-600 to-cloudsway-secondary-600 hover:from-cloudsway-primary-700 hover:to-cloudsway-secondary-700 group-hover:from-cloudsway-primary-500 group-hover:to-cloudsway-secondary-500 transition-all duration-300 relative overflow-hidden"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSuggestionClick(suggestion);
                        }}
                      >
                        {/* 按钮光效 */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                        
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          开始探索
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </Button>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* 其他操作 - 优化：更丰富的操作选项 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center space-y-6"
          >
            <div className="space-y-2">
              <p className="text-slate-400">不满意推荐结果？</p>
              <p className="text-sm text-slate-500">您可以重新描述需求或与AI专家深入对话</p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={() => {
                    setUserInput("");
                    setShowSuggestions(false);
                    setCurrentPhase('input');
                  }}
                  className="border-slate-600/50 text-slate-300 hover:border-cloudsway-primary-500/50 hover:text-cloudsway-primary-300 transition-all duration-200 min-w-[140px]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  重新描述
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={() => router.push('/chat')}
                  className="border-slate-600/50 text-slate-300 hover:border-green-500/50 hover:text-green-400 transition-all duration-200 min-w-[140px]"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  AI对话
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={() => router.push('/market')}
                  className="border-slate-600/50 text-slate-300 hover:border-blue-500/50 hover:text-blue-400 transition-all duration-200 min-w-[140px]"
                >
                  <Search className="w-4 h-4 mr-2" />
                  浏览市场
                </Button>
              </motion.div>
            </div>
            
            {/* 反馈机制 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="pt-4 border-t border-slate-700/30"
            >
              <p className="text-xs text-slate-500 mb-2">帮助我们改进推荐系统</p>
              <div className="flex justify-center gap-2">
                {['😍', '😊', '😐', '🙁', '😡'].map((emoji, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    className="text-lg hover:bg-slate-700/50 rounded-full p-1 transition-colors"
                    onClick={() => {
                      // 记录反馈
                      console.log(`User feedback: ${5 - idx} stars`);
                    }}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // ==================== 主渲染 ====================

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative">
      {/* 背景效果 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        
        {/* 动态光效 */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cloudsway-primary-500/10 blur-3xl"
        />
        
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cloudsway-secondary-500/8 blur-3xl"
        />
      </div>

      {/* 主内容 */}
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {currentPhase === 'welcome' && renderWelcomePhase()}
        {currentPhase === 'input' && renderInputPhase()}
        {currentPhase === 'analysis' && renderAnalysisPhase()}
        {currentPhase === 'recommendation' && renderRecommendationPhase()}
      </div>

      {/* 滚动提示 */}
      {currentPhase === 'input' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-slate-400 text-center"
          >
            <ChevronDown className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm">向下滚动探索更多</span>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

// ==================== 工具组件 ====================

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
}

function TypewriterText({ text, speed = 50, className = "" }: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={className}>
      {displayText}
      {currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-0.5 h-6 bg-cloudsway-primary-400 ml-1"
        />
      )}
    </span>
  );
}

export default EnhancedHeroSection;