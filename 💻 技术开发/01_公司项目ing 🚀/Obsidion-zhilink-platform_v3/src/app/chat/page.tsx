"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  Sparkles, 
  Brain, 
  Users, 
  Clock, 
  CheckCircle2,
  Loader2,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { AGENTS, AGENT_ICONS } from "@/constants/agents";
import type { 
  AgentRole, 
  ChatMessage, 
  CollaborationSession, 
  AgentRoleConfig,
  CollaborationPhase 
} from "@/types";

interface SixRolesCollaborationPageProps {}

export default function SixRolesCollaborationPage({}: SixRolesCollaborationPageProps) {
  const [userInput, setUserInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentSession, setCurrentSession] = useState<CollaborationSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activePhase, setActivePhase] = useState<CollaborationPhase>("analysis");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // 模拟的AI角色状态
  const [agentStates, setAgentStates] = useState<Record<AgentRole, AgentRoleConfig>>(() => {
    const states: Record<AgentRole, AgentRoleConfig> = {} as any;
    Object.keys(AGENTS).forEach(key => {
      const role = key as AgentRole;
      const agent = AGENTS[role];
      const IconComponent = AGENT_ICONS[role];
      
      states[role] = {
        id: role,
        name: agent.name,
        title: agent.role,
        description: agent.description,
        expertise: agent.strengths,
        avatar: `/images/agents/${role}.jpg`,
        color: {
          primary: agent.color.primary,
          bg: `${agent.color.primary}15`,
          border: `${agent.color.primary}25`,
          dark: agent.color.dark,
        },
        icon: IconComponent,
        status: "idle",
        progress: 0,
        contributions: [],
      };
    });
    return states;
  });

  // 协作阶段配置
  const collaborationPhases: Record<CollaborationPhase, { name: string; description: string; duration: number }> = {
    analysis: { name: "需求分析", description: "深度理解用户需求", duration: 30 },
    design: { name: "方案设计", description: "制定技术和设计方案", duration: 45 },
    planning: { name: "实施规划", description: "制定项目实施计划", duration: 35 },
    synthesis: { name: "综合评估", description: "整合分析结果", duration: 20 },
    completed: { name: "分析完成", description: "生成最终建议", duration: 0 },
  };

  // 启动6角色协作分析
  const startCollaboration = async () => {
    if (!userInput.trim()) return;

    setIsAnalyzing(true);
    setActivePhase("analysis");

    // 创建协作会话
    const session: CollaborationSession = {
      id: `session-${Date.now()}`,
      userQuery: userInput,
      phase: "analysis",
      agents: Object.values(agentStates),
      insights: {},
      startTime: new Date(),
      estimatedDuration: 130, // 总预估时间
      progress: 0,
    };

    setCurrentSession(session);

    // 添加用户消息
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      type: "user",
      content: userInput,
      timestamp: new Date(),
      status: "sent",
    };

    setMessages([userMessage]);

    // 系统消息
    const systemMessage: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      type: "system",
      content: "✨ 启动6角色AI专家协作分析...",
      timestamp: new Date(),
      status: "sent",
    };

    setMessages(prev => [...prev, systemMessage]);

    // 模拟分析过程
    await simulateCollaboration(session);
  };

  // 模拟协作过程
  const simulateCollaboration = async (session: CollaborationSession) => {
    const phases: CollaborationPhase[] = ["analysis", "design", "planning", "synthesis", "completed"];
    
    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i];
      if (phase === "completed") break;

      setActivePhase(phase);
      
      // 更新各个专家状态
      await simulatePhaseAnalysis(phase);
      
      // 添加阶段完成消息
      const phaseMessage: ChatMessage = {
        id: `msg-${Date.now()}-${phase}`,
        type: "system", 
        content: `✅ ${collaborationPhases[phase].name}阶段完成`,
        timestamp: new Date(),
        status: "sent",
      };

      setMessages(prev => [...prev, phaseMessage]);

      // 短暂延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // 生成最终综合建议
    await generateFinalRecommendations();
    
    setActivePhase("completed");
    setIsAnalyzing(false);
  };

  // 模拟单个阶段的分析
  const simulatePhaseAnalysis = async (phase: CollaborationPhase) => {
    const agentOrder: AgentRole[] = ["alex", "sarah", "mike", "emma", "david", "catherine"];
    const phaseDuration = collaborationPhases[phase].duration;
    const agentTime = phaseDuration / agentOrder.length;

    for (let i = 0; i < agentOrder.length; i++) {
      const agentRole = agentOrder[i];
      
      // 更新专家状态为活动中
      setAgentStates(prev => ({
        ...prev,
        [agentRole]: {
          ...prev[agentRole],
          status: "active",
          progress: 0,
        }
      }));

      // 模拟分析过程
      for (let progress = 0; progress <= 100; progress += 20) {
        setAgentStates(prev => ({
          ...prev,
          [agentRole]: {
            ...prev[agentRole],
            progress: progress,
          }
        }));
        
        await new Promise(resolve => setTimeout(resolve, agentTime * 1000 / 5));
      }

      // 完成分析
      setAgentStates(prev => ({
        ...prev,
        [agentRole]: {
          ...prev[agentRole],
          status: "completed",
          progress: 100,
          lastMessage: getAgentPhaseMessage(agentRole, phase),
        }
      }));

      // 添加专家分析消息
      const agentMessage: ChatMessage = {
        id: `msg-${Date.now()}-${agentRole}`,
        type: "agent",
        content: getAgentAnalysisContent(agentRole, phase),
        timestamp: new Date(),
        status: "sent",
        sender: {
          id: agentRole,
          name: AGENTS[agentRole].name,
          avatar: `/images/agents/${agentRole}.jpg`,
          role: agentRole,
        },
        metadata: {
          confidence: 0.85 + Math.random() * 0.1,
          processingTime: agentTime,
        },
      };

      setMessages(prev => [...prev, agentMessage]);

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // 重置所有专家状态
    setAgentStates(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => {
        const role = key as AgentRole;
        updated[role] = {
          ...updated[role],
          status: "idle",
          progress: 0,
        };
      });
      return updated;
    });
  };

  // 获取专家的阶段消息
  const getAgentPhaseMessage = (role: AgentRole, phase: CollaborationPhase): string => {
    const messages = {
      analysis: {
        alex: "深入理解了您的业务需求",
        sarah: "评估了技术实现方案",
        mike: "分析了用户体验要求",
        emma: "审查了数据基础设施",
        david: "规划了项目实施计划",
        catherine: "分析了商业价值"
      },
      design: {
        alex: "细化了功能规格说明",
        sarah: "设计了系统架构方案",
        mike: "制定了UI/UX设计框架",
        emma: "设计了数据分析策略",
        david: "制定了项目管理方案",
        catherine: "评估了投资回报率"
      },
      planning: {
        alex: "确定了需求优先级",
        sarah: "制定了技术实施路线图",
        mike: "规划了用户体验优化计划",
        emma: "设计了数据治理方案",
        david: "制定了详细的项目时间线",
        catherine: "制定了商业实施战略"
      },
      synthesis: {
        alex: "综合了所有需求分析",
        sarah: "整合了技术方案建议",
        mike: "总结了设计优化建议",
        emma: "汇总了数据策略建议",
        david: "整合了实施计划",
        catherine: "制定了最终商业建议"
      },
      completed: {
        alex: "需求分析完成",
        sarah: "技术方案完成",
        mike: "设计方案完成",
        emma: "数据策略完成",
        david: "项目计划完成",
        catherine: "商业分析完成"
      }
    };

    return messages[phase]?.[role] || "分析完成";
  };

  // 获取专家分析内容
  const getAgentAnalysisContent = (role: AgentRole, phase: CollaborationPhase): string => {
    const agent = AGENTS[role];
    
    const analysisTemplates = {
      analysis: {
        alex: `🎯 **需求深度分析**\n\n基于您的描述，我识别出以下核心需求：\n• 业务流程自动化需求\n• 用户体验提升需求\n• 数据分析能力需求\n\n**隐性需求识别**：系统需要具备良好的扩展性以适应业务增长。`,
        sarah: `⚡ **技术可行性分析**\n\n技术架构建议：\n• 采用微服务架构确保系统灵活性\n• 集成AI模型API提供智能化能力\n• 使用云原生技术保证高可用性\n\n**技术风险评估**：整体技术方案可行性较高，建议采用渐进式实施策略。`,
        mike: `🎨 **用户体验分析**\n\n体验设计要点：\n• 简化操作流程，降低学习成本\n• 提供直观的数据可视化界面\n• 支持移动端适配\n\n**设计建议**：采用渐进式披露设计，让复杂功能更易于理解和使用。`,
        emma: `📊 **数据基础分析**\n\n数据现状评估：\n• 需要建立统一的数据收集标准\n• 建议实施数据治理策略\n• 预计需要3-6个月的数据积累期\n\n**数据战略建议**：优先建立核心业务指标的数据收集体系。`,
        david: `📋 **实施计划分析**\n\n项目规划建议：\n• 建议采用3个阶段递进式实施\n• 预估项目周期：4-6个月\n• 关键里程碑节点识别\n\n**风险管控**：建议建立周报机制确保项目进度可控。`,
        catherine: `💎 **商业价值分析**\n\n价值预期：\n• 预计可提升运营效率30-50%\n• 降低人工成本约20-30%\n• 预估ROI：18个月内实现正收益\n\n**战略建议**：建议分阶段投入，降低初期投资风险。`
      }
    };

    return analysisTemplates.analysis[role] || `✨ ${agent.name}正在进行${collaborationPhases[phase].name}...`;
  };

  // 生成最终推荐
  const generateFinalRecommendations = async () => {
    const finalMessage: ChatMessage = {
      id: `msg-final-${Date.now()}`,
      type: "system",
      content: `🎯 **6角色协作分析完成**

经过我们6位AI专家的深度协作分析，为您生成以下综合建议：

## 📋 核心建议摘要
• **需求优先级**：业务流程自动化 > 数据分析能力 > 用户体验优化
• **技术方案**：采用云原生微服务架构，分3个阶段实施
• **预估投资**：15-25万初期投入，预计18个月ROI正收益
• **实施周期**：4-6个月，建议Q1启动

## 🛍️ 推荐AI解决方案
基于分析结果，我们为您推荐了3个最适合的AI产品...

[查看详细分析报告] [浏览推荐产品]`,
      timestamp: new Date(),
      status: "sent",
      metadata: {
        confidence: 0.92,
        suggestions: [
          "查看推荐的AI解决方案",
          "下载详细分析报告",
          "预约专家一对一咨询",
          "开始产品试用申请"
        ],
        relatedProducts: ["product-1", "product-2", "product-3"],
      },
    };

    setMessages(prev => [...prev, finalMessage]);
  };

  // 自动滚动到底部
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* 返回按钮 */}
      <div className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Brain className="w-8 h-8 text-cloudsway-primary-400" />
            6角色AI专家协作分析
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            通过6位AI专家的深度协作，为您提供全面的业务需求分析和解决方案推荐
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* 左侧：专家状态面板 */}
          <div className="lg:col-span-4">
            <Card className="p-6 bg-slate-800/50 border-slate-700/50">
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-5 h-5 text-cloudsway-primary-400" />
                <h2 className="text-xl font-semibold text-white">专家团队</h2>
                {activePhase !== "completed" && (
                  <Badge variant="secondary" className="ml-auto">
                    {collaborationPhases[activePhase].name}
                  </Badge>
                )}
              </div>

              <div className="space-y-4">
                {Object.values(agentStates).map((agent) => (
                  <motion.div
                    key={agent.id}
                    className={`p-4 rounded-lg border transition-all duration-300 ${
                      agent.status === "active"
                        ? "bg-slate-700/50 border-slate-600/50 shadow-lg"
                        : "bg-slate-800/30 border-slate-700/30"
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={agent.avatar} alt={agent.name} />
                        <AvatarFallback style={{ backgroundColor: agent.color.bg }}>
                          <agent.icon className="w-5 h-5" style={{ color: agent.color.primary }} />
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-white truncate">
                            {agent.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            {agent.status === "active" && (
                              <Loader2 className="w-4 h-4 text-cloudsway-primary-400 animate-spin" />
                            )}
                            {agent.status === "completed" && (
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-slate-400 truncate">
                          {agent.title}
                        </p>
                        
                        {agent.status === "active" && (
                          <div className="mt-2">
                            <Progress value={agent.progress} className="h-1" />
                          </div>
                        )}
                        
                        {agent.lastMessage && (
                          <p className="text-xs text-slate-500 mt-1">
                            {agent.lastMessage}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* 协作进度 */}
              {currentSession && (
                <div className="mt-6 pt-6 border-t border-slate-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-400">
                      预计还需 {Math.max(0, currentSession.estimatedDuration - Math.floor((Date.now() - currentSession.startTime.getTime()) / 1000))}s
                    </span>
                  </div>
                  <Progress 
                    value={activePhase === "completed" ? 100 : 
                      ["analysis", "design", "planning", "synthesis", "completed"].indexOf(activePhase) * 25
                    } 
                    className="h-2"
                  />
                </div>
              )}
            </Card>
          </div>

          {/* 右侧：对话区域 */}
          <div className="lg:col-span-8">
            <Card className="h-[700px] flex flex-col bg-slate-800/50 border-slate-700/50">
              {/* 对话头部 */}
              <div className="p-4 border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cloudsway-primary-400" />
                    <h3 className="font-semibold text-white">智能协作对话</h3>
                  </div>
                  {isAnalyzing && (
                    <Badge variant="secondary">
                      分析中...
                    </Badge>
                  )}
                </div>
              </div>

              {/* 消息区域 */}
              <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center text-slate-400 py-12">
                      <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">欢迎使用6角色AI协作分析</p>
                      <p className="text-sm">
                        请在下方描述您的业务需求，我们的AI专家团队将为您提供深度分析
                      </p>
                    </div>
                  )}

                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={`flex gap-3 ${
                          message.type === "user" ? "justify-end" : ""
                        }`}
                      >
                        {message.type !== "user" && (
                          <Avatar className="w-8 h-8">
                            {message.sender ? (
                              <>
                                <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                                <AvatarFallback>
                                  {message.sender.name.slice(0, 2)}
                                </AvatarFallback>
                              </>
                            ) : (
                              <AvatarFallback>
                                <Sparkles className="w-4 h-4" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                        )}

                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.type === "user"
                              ? "bg-cloudsway-primary-600 text-white"
                              : message.type === "system"
                              ? "bg-slate-700/50 text-slate-300"
                              : "bg-slate-600/50 text-white"
                          }`}
                        >
                          {message.sender && (
                            <div className="text-xs text-slate-400 mb-1">
                              {message.sender.name} • {message.sender.role && AGENTS[message.sender.role]?.role}
                            </div>
                          )}
                          
                          <div className="whitespace-pre-wrap">
                            {message.content}
                          </div>

                          {message.metadata?.confidence && (
                            <div className="mt-2 text-xs text-slate-400">
                              置信度: {Math.round(message.metadata.confidence * 100)}%
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>

              {/* 输入区域 */}
              <div className="p-4 border-t border-slate-700/50">
                <div className="flex gap-3">
                  <Textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="请描述您的业务需求，例如：我需要为电商平台建立智能客服系统..."
                    className="min-h-[60px] bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400"
                    disabled={isAnalyzing}
                  />
                  <Button
                    onClick={startCollaboration}
                    disabled={!userInput.trim() || isAnalyzing}
                    className="self-end bg-cloudsway-primary-600 hover:bg-cloudsway-primary-700"
                  >
                    {isAnalyzing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                
                <p className="text-xs text-slate-500 mt-2">
                  按 Ctrl+Enter 快速发送 • 支持多行输入
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}