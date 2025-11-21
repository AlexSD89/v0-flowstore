"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare,
  User,
  Bot,
  ArrowRight,
  CheckCircle,
  Brain,
  TrendingUp,
  Building2,
  Play,
  Pause,
  SendHorizontal
} from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  persona?: 'investor' | 'ceo' | 'consultant';
}

const DIALOG_SCENARIOS = [
  {
    id: 'investor',
    title: '投资专家场景',
    persona: 'investor',
    icon: TrendingUp,
    color: 'from-purple-600 to-indigo-600',
    conversation: [
      {
        type: 'user',
        content: '我想分析一家AI医疗初创公司的投资价值，团队15人，月收入200万，寻求A轮融资...'
      },
      {
        type: 'system',
        content: '🤖 NEXUS正在分析您的需求...\n✓ 识别关键词：AI医疗、初创、投资分析\n✓ 启动投资分析引擎\n✓ 调用专业数据源'
      },
      {
        type: 'ai',
        content: `📊 **投资分析报告已生成**

**市场分析**
• AI医疗影像市场规模：$50B，年增长15%
• 竞争格局：3家主要竞品，技术差异化明显
• 市场时机：政策支持，需求旺盛

**团队评估**
• 核心团队：清华AI博士，医疗行业10年经验
• 技术实力：已获3项核心专利
• 管理能力：上一家公司成功退出

**财务模型**
• 月收入：200万，同比增长300%
• 毛利率：75%，符合SaaS标准
• 预测：12个月内达到盈亏平衡

**投资建议**
🎯 **推荐投资** - 建议估值$200M
⚡ 风险提醒：监管政策变化需关注

*基于您的投资偏好和历史数据分析*`
      },
      {
        type: 'ai',
        content: '💡 **专属AI顾问已部署**\n\n您的投资分析AI顾问"Alex"已托管云端，将为您提供：\n• 24/7市场动态监控\n• 实时风险预警\n• 个性化投资建议\n\n月费：¥99，比传统咨询节省90%成本'
      }
    ]
  },
  {
    id: 'ceo',
    title: '企业领袖场景', 
    persona: 'ceo',
    icon: Building2,
    color: 'from-blue-600 to-cyan-600',
    conversation: [
      {
        type: 'user',
        content: 'CEO李总：销售要扩张、技术要升级、市场要加投，资源有限只能选一个，怎么决策？'
      },
      {
        type: 'system',
        content: '🤖 NEXUS决策分析中...\n✓ 解析三个战略选项\n✓ 调用企业决策框架\n✓ 加载历史成功案例'
      },
      {
        type: 'ai',
        content: `📈 **企业决策分析报告**

**优先级建议**

🥇 **技术升级优先** (推荐)
• 投入：150万，回收期：8个月
• 年节省：80万人工成本
• ROI：133%，现金流改善明显

🥈 **华南市场扩张次之**
• 市场机会大但现金流压力18个月
• 建议：6个月后技术升级见效再启动

🥉 **抖音营销暂缓**
• 获客成本上升47%，边际收益递减
• 建议：等待更好时机或优化策略

**决策依据**
基于您的核心KPI是人效提升，技术升级能直接解决当前瓶颈问题`
      },
      {
        type: 'ai',
        content: '🎯 **企业决策AI顾问上线**\n\n您的专属企业顾问"Emma"已就绪：\n• 实时业务数据分析\n• 决策方案智能推荐\n• 竞品动态监控预警\n\n比麦肯锡咨询节省98%成本，24/7随时服务'
      }
    ]
  },
  {
    id: 'consultant',
    title: '知识工作者场景',
    persona: 'consultant', 
    icon: Brain,
    color: 'from-emerald-600 to-teal-600',
    conversation: [
      {
        type: 'user',
        content: '律师王总：这份股权投资协议需要审查，但我担心遗漏风险点，传统方式需要4小时...'
      },
      {
        type: 'system',
        content: '🤖 专业法律分析中...\n✓ 加载46个相似案例\n✓ 启用风险识别引擎\n✓ 调用法规更新数据库'
      },
      {
        type: 'ai',
        content: `⚖️ **法律文件分析报告**

**发现3个主要风险点**

🚨 **业绩承诺过激**
• 参考泰康案例，建议降低15%
• 避免无法达成的承诺条款

⚠️ **触发条件模糊**  
• 建议加"连续两季度"限定
• 避免华为案例的争议问题

⚡ **缺少免责条款**
• 疫情期间3个败诉案例都是这个问题
• 建议增加不可抗力条款

**修改建议已生成**
基于您处理的46个相似案例，5分钟完成专业审查
风险覆盖率：95% vs 传统方式75%`
      },
      {
        type: 'ai',
        content: '📚 **法律助手AI已激活**\n\n您的专业法律顾问"Sophie"现已可用：\n• 合同自动风险扫描\n• 案例库智能匹配\n• 法规更新实时提醒\n\n让您的专业经验规模化，效率提升300%'
      }
    ]
  }
];

export function DialogDemoInterface() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const scenario = DIALOG_SCENARIOS[currentScenario];

  // 自动播放逻辑
  useEffect(() => {
    if (!autoPlay) return;

    const timer = setTimeout(() => {
      if (currentMessageIndex < scenario.conversation.length) {
        setIsTyping(true);
        setTimeout(() => {
          const newMessage: Message = {
            id: Date.now().toString(),
            type: scenario.conversation[currentMessageIndex].type as 'user' | 'ai' | 'system',
            content: scenario.conversation[currentMessageIndex].content,
            timestamp: new Date(),
            persona: scenario.persona
          };
          setDisplayedMessages(prev => [...prev, newMessage]);
          setCurrentMessageIndex(prev => prev + 1);
          setIsTyping(false);
        }, 1500);
      } else {
        // 当前场景结束，切换到下一个场景
        setTimeout(() => {
          setCurrentScenario(prev => (prev + 1) % DIALOG_SCENARIOS.length);
          setCurrentMessageIndex(0);
          setDisplayedMessages([]);
        }, 3000);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentMessageIndex, scenario, autoPlay]);

  const resetDemo = () => {
    setCurrentMessageIndex(0);
    setDisplayedMessages([]);
    setIsTyping(false);
  };

  const switchScenario = (index: number) => {
    setCurrentScenario(index);
    resetDemo();
    setAutoPlay(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1b3c] to-[#0a0e27] relative overflow-hidden">
      {/* 背景光效 */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00d4ff] rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-[#4f46e5] rounded-full blur-[80px] animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      {/* 顶部导航 - 毛玻璃效果 */}
      <nav className="relative z-10 border-b border-white/20 backdrop-blur-[20px] bg-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#4f46e5] to-[#00d4ff] rounded-xl flex items-center justify-center shadow-lg">
              <div className="text-white font-bold">M²</div>
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">Me² NEXUS</h1>
              <p className="text-purple-300 text-xs">专业个体超级增强器</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setAutoPlay(!autoPlay)}
              className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm ${
                autoPlay ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
              }`}
            >
              {autoPlay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {autoPlay ? '自动演示' : '手动控制'}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        {/* 场景选择器 */}
        <div className="relative z-10 mb-6">
          <div className="text-center mb-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              完整客户体验演示
            </h2>
            <p className="text-xl text-[#a1a1aa] leading-relaxed">
              通过真实对话展示Me² NEXUS的专业AI顾问服务
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {DIALOG_SCENARIOS.map((s, index) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => switchScenario(index)}
                  className={`p-4 rounded-xl border transition-all duration-300 hover:transform hover:scale-105 hover:shadow-[0_0_30px_rgba(79,70,229,0.3)] ${
                    currentScenario === index 
                      ? `bg-gradient-to-r ${s.color}/20 border-white/30` 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-6 w-6 text-white mb-2" />
                  <h3 className="text-white font-semibold">{s.title}</h3>
                </button>
              );
            })}
          </div>
        </div>

        {/* 对话界面 - 毛玻璃风格 */}
        <div className="relative z-10 grid lg:grid-cols-2 gap-6">
          {/* 左侧：对话框 - 增强毛玻璃效果 */}
          <div className="backdrop-blur-[20px] bg-white/5 border border-white/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] transition-all duration-300">
            <div className="p-4 border-b border-white/20 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <scenario.icon className="h-5 w-5 text-white" />
                <h3 className="text-white font-semibold">{scenario.title}</h3>
                <div className="flex items-center gap-1 ml-auto">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-300">实时演示</span>
                </div>
              </div>
            </div>
            
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {displayedMessages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type !== 'user' && (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'system' ? 'bg-gray-600' : `bg-gradient-to-r ${scenario.color}`
                      }`}>
                        {message.type === 'system' ? (
                          <Brain className="h-4 w-4 text-white" />
                        ) : (
                          <Bot className="h-4 w-4 text-white" />
                        )}
                      </div>
                    )}
                    
                    <div className={`max-w-xs lg:max-w-sm p-3 rounded-2xl backdrop-blur-sm ${
                      message.type === 'user' 
                        ? 'bg-purple-600 text-white ml-auto' 
                        : message.type === 'system'
                          ? 'bg-gray-700/50 text-gray-200'
                          : 'bg-white/10 text-white'
                    }`}>
                      <div className="text-sm whitespace-pre-line">{message.content}</div>
                    </div>
                    
                    {message.type === 'user' && (
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3"
                >
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${scenario.color} flex items-center justify-center`}>
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white/10 p-3 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input 
                  placeholder="体验对话输入..." 
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                />
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <SendHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* 右侧：服务流程 - 增强毛玻璃效果 */}
          <div className="backdrop-blur-[20px] bg-white/5 border border-white/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6">
            <h3 className="text-white font-semibold text-xl mb-6">Me² NEXUS 服务流程</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-blue-900/20 rounded-xl border border-blue-500/30 backdrop-blur-sm hover:bg-blue-900/30 transition-all duration-300 hover:transform hover:scale-[1.02]">
                <MessageSquare className="h-8 w-8 text-blue-400" />
                <div>
                  <h4 className="text-blue-200 font-semibold">1. 客户对话输入</h4>
                  <p className="text-blue-100 text-sm">3分钟自然语言描述需求</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-purple-900/20 rounded-xl border border-purple-500/30 backdrop-blur-sm hover:bg-purple-900/30 transition-all duration-300 hover:transform hover:scale-[1.02]">
                <Brain className="h-8 w-8 text-purple-400" />
                <div>
                  <h4 className="text-purple-200 font-semibold">2. NEXUS智能分析</h4>
                  <p className="text-purple-100 text-sm">30分钟生成专业MRD文档</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-green-900/20 rounded-xl border border-green-500/30 backdrop-blur-sm hover:bg-green-900/30 transition-all duration-300 hover:transform hover:scale-[1.02]">
                <TrendingUp className="h-8 w-8 text-green-400" />
                <div>
                  <h4 className="text-green-200 font-semibold">3. Agent协作执行</h4>
                  <p className="text-green-100 text-sm">多专业AI团队协作交付</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-cyan-900/20 rounded-xl border border-cyan-500/30 backdrop-blur-sm hover:bg-cyan-900/30 transition-all duration-300 hover:transform hover:scale-[1.02]">
                <CheckCircle className="h-8 w-8 text-cyan-400" />
                <div>
                  <h4 className="text-cyan-200 font-semibold">4. 云端托管服务</h4>
                  <p className="text-cyan-100 text-sm">24/7专属AI顾问在线</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl border border-purple-500/30 backdrop-blur-sm hover:shadow-[0_0_20px_rgba(79,70,229,0.2)] transition-all duration-300">
              <h4 className="text-white font-semibold mb-2">Me² 核心公式</h4>
              <div className="text-sm text-gray-300 text-center">
                你的专业Know-How × AI的200万级数据源 × 智能决策处理 = <span className="text-yellow-300 font-bold">更强的专业自己</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}