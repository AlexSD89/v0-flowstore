"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import {
  Brain,
  Code,
  Palette,
  BarChart3,
  Calendar,
  Crown,
  Sparkles,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ArrowRight,
  Users,
  Lightbulb,
  Target,
  TrendingUp,
  Zap,
  Eye,
  Heart,
  Star,
  Award
} from 'lucide-react';

import { cn } from "@/lib/utils";

// 角色状态枚举
export type AgentStatus = 'idle' | 'thinking' | 'active' | 'completed' | 'error';

// 协作阶段
export type CollaborationPhase = 'analysis' | 'design' | 'planning' | 'synthesis' | 'completed';

// 单个角色定义
export interface AgentRole {
  id: string;
  name: string;
  title: string;
  description: string;
  expertise: string[];
  avatar?: string;
  color: {
    primary: string;
    bg: string;
    border: string;
    dark: string;
  };
  icon: React.ComponentType<any>;
  status: AgentStatus;
  progress: number;
  lastMessage?: string;
  timestamp?: Date;
  confidence?: number;
  contributions?: string[];
}

// 协作会话数据
export interface CollaborationSession {
  id: string;
  userQuery: string;
  phase: CollaborationPhase;
  agents: AgentRole[];
  insights: {
    [agentId: string]: {
      analysis: string;
      recommendations: string[];
      confidence: number;
      dataPoints: Record<string, any>;
    };
  };
  synthesis?: {
    summary: string;
    keyFindings: string[];
    recommendations: string[];
    nextSteps: string[];
    confidence: number;
  };
  startTime: Date;
  estimatedDuration?: number;
  progress: number;
}

// 组件属性
export interface AgentCollaborationPanelProps {
  session: CollaborationSession;
  onAgentClick?: (agentId: string) => void;
  onPhaseChange?: (phase: CollaborationPhase) => void;
  onSessionStop?: () => void;
  className?: string;
  compact?: boolean;
}

// 6个核心角色配置
const defaultAgents: Omit<AgentRole, 'status' | 'progress' | 'timestamp'>[] = [
  {
    id: 'alex',
    name: 'Alex',
    title: '需求理解专家',
    description: '深度需求挖掘与隐性需求识别',
    expertise: ['需求分析', '用户调研', '痛点识别', '场景建模'],
    color: {
      primary: '#3b82f6',
      bg: 'rgba(59, 130, 246, 0.1)',
      border: 'rgba(59, 130, 246, 0.3)',
      dark: '#1e40af'
    },
    icon: Brain
  },
  {
    id: 'sarah',
    name: 'Sarah',
    title: '技术架构师',
    description: '技术可行性分析与架构设计',
    expertise: ['技术架构', '系统设计', '可行性分析', '技术选型'],
    color: {
      primary: '#8b5cf6',
      bg: 'rgba(139, 92, 246, 0.1)',
      border: 'rgba(139, 92, 246, 0.3)',
      dark: '#7c3aed'
    },
    icon: Code
  },
  {
    id: 'mike',
    name: 'Mike',
    title: '体验设计师',
    description: '用户体验设计与交互优化',
    expertise: ['用户体验', '界面设计', '交互设计', '原型制作'],
    color: {
      primary: '#10b981',
      bg: 'rgba(16, 185, 129, 0.1)',
      border: 'rgba(16, 185, 129, 0.3)',
      dark: '#059669'
    },
    icon: Palette
  },
  {
    id: 'emma',
    name: 'Emma',
    title: '数据分析师',
    description: '数据基建分析与分析策略',
    expertise: ['数据分析', '统计建模', '预测分析', '可视化'],
    color: {
      primary: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.1)',
      border: 'rgba(245, 158, 11, 0.3)',
      dark: '#d97706'
    },
    icon: BarChart3
  },
  {
    id: 'david',
    name: 'David',
    title: '项目管理师',
    description: '实施路径规划与项目管理',
    expertise: ['项目管理', '资源配置', '风险评估', '进度控制'],
    color: {
      primary: '#6366f1',
      bg: 'rgba(99, 102, 241, 0.1)',
      border: 'rgba(99, 102, 241, 0.3)',
      dark: '#4f46e5'
    },
    icon: Calendar
  },
  {
    id: 'catherine',
    name: 'Catherine',
    title: '战略顾问',
    description: '商业价值分析与战略建议',
    expertise: ['战略规划', '商业分析', '价值评估', '决策支持'],
    color: {
      primary: '#ec4899',
      bg: 'rgba(236, 72, 153, 0.1)',
      border: 'rgba(236, 72, 153, 0.3)',
      dark: '#db2777'
    },
    icon: Crown
  }
];

// 阶段配置
const phaseConfig = {
  analysis: { 
    name: '需求分析', 
    description: '理解用户需求和业务目标',
    icon: Brain,
    color: 'text-blue-500' 
  },
  design: { 
    name: '方案设计', 
    description: '设计技术方案和用户体验',
    icon: Palette,
    color: 'text-purple-500' 
  },
  planning: { 
    name: '规划实施', 
    description: '制定实施计划和资源配置',
    icon: Calendar,
    color: 'text-green-500' 
  },
  synthesis: { 
    name: '综合分析', 
    description: '整合所有建议形成最终方案',
    icon: Sparkles,
    color: 'text-yellow-500' 
  },
  completed: { 
    name: '完成', 
    description: '协作完成，输出最终建议',
    icon: CheckCircle2,
    color: 'text-emerald-500' 
  }
};

export const AgentCollaborationPanel: React.FC<AgentCollaborationPanelProps> = ({
  session,
  onAgentClick,
  onPhaseChange,
  onSessionStop,
  className,
  compact = false
}) => {
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<'agents' | 'insights' | 'synthesis'>('agents');
  
  const currentPhaseConfig = phaseConfig[session.phase];
  
  // 计算整体协作进度
  const overallProgress = Math.round(
    session.agents.reduce((sum, agent) => sum + agent.progress, 0) / session.agents.length
  );

  // 获取活跃角色数量
  const activeAgentsCount = session.agents.filter(agent => 
    agent.status === 'active' || agent.status === 'thinking'
  ).length;

  const completedAgentsCount = session.agents.filter(agent => 
    agent.status === 'completed'
  ).length;

  const handleAgentClick = (agentId: string) => {
    setActiveAgent(activeAgent === agentId ? null : agentId);
    onAgentClick?.(agentId);
  };

  // 渲染单个角色卡片
  const renderAgentCard = (agent: AgentRole, isCompact: boolean = false) => {
    const IconComponent = agent.icon;
    const isSelected = activeAgent === agent.id;
    
    return (
      <TooltipProvider key={agent.id}>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAgentClick(agent.id)}
              className="cursor-pointer"
            >
              <Card className={cn(
                "transition-all duration-300 hover:shadow-lg",
                "border-border-primary bg-background-glass backdrop-blur-xl",
                isSelected && "border-accent shadow-glow-primary",
                agent.status === 'active' && "ring-2 ring-opacity-50",
                agent.status === 'completed' && "border-status-success",
                agent.status === 'error' && "border-status-error"
              )} 
              style={{
                '--ring-color': agent.color.primary
              } as React.CSSProperties}
              >
                <CardHeader className={cn("pb-3", isCompact && "p-3")}>
                  <div className="flex items-center gap-3">
                    {/* 头像区域 */}
                    <div className="relative">
                      <Avatar className={cn(
                        "border-2",
                        isCompact ? "w-8 h-8" : "w-12 h-12"
                      )}
                      style={{ borderColor: agent.color.primary }}>
                        <AvatarImage src={agent.avatar} />
                        <AvatarFallback 
                          className="text-white font-semibold"
                          style={{ backgroundColor: agent.color.primary }}
                        >
                          <IconComponent className={cn(isCompact ? "w-4 h-4" : "w-6 h-6")} />
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* 状态指示器 */}
                      <div className={cn(
                        "absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-background-main",
                        isCompact && "w-5 h-5"
                      )}>
                        {agent.status === 'thinking' && (
                          <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
                        )}
                        {agent.status === 'active' && (
                          <Sparkles className="w-3 h-3 text-yellow-500" />
                        )}
                        {agent.status === 'completed' && (
                          <CheckCircle2 className="w-3 h-3 text-status-success" />
                        )}
                        {agent.status === 'error' && (
                          <AlertTriangle className="w-3 h-3 text-status-error" />
                        )}
                        {agent.status === 'idle' && (
                          <Clock className="w-3 h-3 text-text-muted" />
                        )}
                      </div>
                    </div>

                    {/* 基本信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className={cn(
                          "font-semibold text-text-primary truncate",
                          isCompact ? "text-sm" : "text-base"
                        )}>
                          {agent.name}
                        </h4>
                        {agent.status === 'completed' && (
                          <Award className="w-4 h-4 text-status-success flex-shrink-0" />
                        )}
                      </div>
                      <p className={cn(
                        "text-text-secondary truncate",
                        isCompact ? "text-xs" : "text-sm"
                      )}>
                        {agent.title}
                      </p>
                      {agent.confidence && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3 text-red-500" />
                            <span className="text-xs font-medium">
                              {Math.round(agent.confidence * 100)}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 进度环 */}
                    {!isCompact && (
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <svg className="w-12 h-12 transform -rotate-90">
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="3"
                            fill="none"
                          />
                          <motion.circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke={agent.color.primary}
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 20}`}
                            initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
                            animate={{ 
                              strokeDashoffset: 2 * Math.PI * 20 * (1 - agent.progress / 100) 
                            }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-semibold text-text-primary">
                            {agent.progress}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardHeader>

                {!isCompact && (
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {/* 专长标签 */}
                      <div className="flex flex-wrap gap-1">
                        {agent.expertise.slice(0, 3).map((skill, index) => (
                          <Badge 
                            key={index}
                            variant="secondary"
                            className="text-xs px-2 py-0.5"
                            style={{
                              backgroundColor: agent.color.bg,
                              color: agent.color.primary,
                              borderColor: agent.color.border
                            }}
                          >
                            {skill}
                          </Badge>
                        ))}
                        {agent.expertise.length > 3 && (
                          <Badge variant="outline" className="text-xs px-2 py-0.5">
                            +{agent.expertise.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* 最新消息 */}
                      {agent.lastMessage && (
                        <div 
                          className="p-3 rounded-lg text-xs leading-relaxed"
                          style={{
                            backgroundColor: agent.color.bg,
                            borderLeft: `3px solid ${agent.color.primary}`
                          }}
                        >
                          {agent.lastMessage}
                        </div>
                      )}

                      {/* 贡献点 */}
                      {agent.contributions && agent.contributions.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-text-secondary">关键贡献:</p>
                          <ul className="space-y-1">
                            {agent.contributions.slice(0, 2).map((contribution, index) => (
                              <li key={index} className="flex items-start gap-2 text-xs text-text-secondary">
                                <div 
                                  className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                                  style={{ backgroundColor: agent.color.primary }}
                                />
                                {contribution}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-2">
              <p className="font-semibold">{agent.name} - {agent.title}</p>
              <p className="text-sm">{agent.description}</p>
              <div className="flex items-center gap-2 text-xs">
                <span>状态:</span>
                <Badge variant="outline" className="text-xs">
                  {agent.status === 'idle' && '等待中'}
                  {agent.status === 'thinking' && '思考中'}
                  {agent.status === 'active' && '工作中'}
                  {agent.status === 'completed' && '已完成'}
                  {agent.status === 'error' && '出错'}
                </Badge>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* 协作会话头部 */}
      <Card className="border-border-primary bg-background-glass backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <currentPhaseConfig.icon className={cn("w-6 h-6", currentPhaseConfig.color)} />
                  <h2 className="text-xl font-semibold text-text-primary">
                    {currentPhaseConfig.name}
                  </h2>
                </div>
                <Badge 
                  variant="outline" 
                  className={cn("px-3 py-1", currentPhaseConfig.color.replace('text-', 'border-'))}
                >
                  {currentPhaseConfig.description}
                </Badge>
              </div>
              
              {/* 用户查询 */}
              <div className="bg-background-card rounded-xl p-4 border border-border-primary">
                <p className="text-sm text-text-secondary mb-1">用户需求:</p>
                <p className="text-text-primary font-medium leading-relaxed">
                  {session.userQuery}
                </p>
              </div>
            </div>
            
            {onSessionStop && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onSessionStop}
                className="flex-shrink-0 ml-4"
              >
                停止协作
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          {/* 总体进度 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-text-secondary" />
                  <span className="text-sm text-text-secondary">协作进度</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    <span>{activeAgentsCount} 活跃</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-status-success" />
                    <span>{completedAgentsCount} 完成</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-text-primary">{overallProgress}%</p>
                <p className="text-xs text-text-secondary">整体完成度</p>
              </div>
            </div>
            
            <Progress value={overallProgress} className="h-2" />
            
            {/* 阶段时间信息 */}
            <div className="flex items-center justify-between text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>
                  开始时间: {session.startTime.toLocaleTimeString()}
                </span>
              </div>
              {session.estimatedDuration && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>预计耗时: {session.estimatedDuration}分钟</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 主要内容区域 */}
      <Tabs value={selectedView} onValueChange={(value) => setSelectedView(value as any)}>
        <TabsList className="grid w-full grid-cols-3 bg-background-glass backdrop-blur-xl">
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            角色协作
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            分析洞察
          </TabsTrigger>
          <TabsTrigger value="synthesis" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            综合建议
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          {compact ? (
            /* 紧凑视图 - 网格布局 */
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {session.agents.map(agent => renderAgentCard(agent, true))}
            </div>
          ) : (
            /* 完整视图 - 响应式网格 */
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {session.agents.map(agent => renderAgentCard(agent, false))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <ScrollArea className="h-[600px] pr-4">
            {session.agents
              .filter(agent => session.insights[agent.id])
              .map(agent => {
                const insight = session.insights[agent.id];
                const IconComponent = agent.icon;
                
                return (
                  <Card key={agent.id} className="mb-6 border-border-primary bg-background-glass backdrop-blur-xl">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border-2" style={{ borderColor: agent.color.primary }}>
                          <AvatarFallback 
                            className="text-white"
                            style={{ backgroundColor: agent.color.primary }}
                          >
                            <IconComponent className="w-5 h-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-text-primary">{agent.name}的分析</h3>
                          <div className="flex items-center gap-2 text-sm text-text-secondary">
                            <span>置信度: {Math.round(insight.confidence * 100)}%</span>
                            <Separator orientation="vertical" className="h-4" />
                            <span>{insight.recommendations.length} 项建议</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* 分析内容 */}
                      <div 
                        className="p-4 rounded-xl border-l-4"
                        style={{
                          backgroundColor: agent.color.bg,
                          borderLeftColor: agent.color.primary
                        }}
                      >
                        <h4 className="font-medium text-text-primary mb-2">核心分析</h4>
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {insight.analysis}
                        </p>
                      </div>

                      {/* 建议列表 */}
                      {insight.recommendations.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-text-primary">关键建议</h4>
                          <ul className="space-y-2">
                            {insight.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <div 
                                  className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
                                  style={{ backgroundColor: agent.color.primary }}
                                />
                                <span className="text-sm text-text-secondary leading-relaxed">
                                  {rec}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="synthesis" className="space-y-4">
          {session.synthesis ? (
            <Card className="border-border-primary bg-background-glass backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary">综合分析报告</h3>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>置信度: {Math.round(session.synthesis.confidence * 100)}%</span>
                      <Separator orientation="vertical" className="h-4" />
                      <span>{session.synthesis.keyFindings.length} 项关键发现</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 执行摘要 */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6">
                  <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    执行摘要
                  </h4>
                  <p className="text-text-secondary leading-relaxed">
                    {session.synthesis.summary}
                  </p>
                </div>

                {/* 关键发现 */}
                {session.synthesis.keyFindings.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      关键发现
                    </h4>
                    <div className="grid gap-3">
                      {session.synthesis.keyFindings.map((finding, index) => (
                        <div 
                          key={index}
                          className="flex items-start gap-3 p-4 rounded-xl bg-background-card border border-border-primary"
                        >
                          <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-white">{index + 1}</span>
                          </div>
                          <p className="text-sm text-text-secondary leading-relaxed">
                            {finding}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 核心建议 */}
                {session.synthesis.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-500" />
                      核心建议
                    </h4>
                    <div className="space-y-3">
                      {session.synthesis.recommendations.map((rec, index) => (
                        <div 
                          key={index}
                          className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/30 dark:border-green-800/30"
                        >
                          <ArrowRight className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-text-secondary leading-relaxed">
                            {rec}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 下一步行动 */}
                {session.synthesis.nextSteps.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-purple-500" />
                      下一步行动
                    </h4>
                    <div className="space-y-3">
                      {session.synthesis.nextSteps.map((step, index) => (
                        <div 
                          key={index}
                          className="flex items-center gap-3 p-4 rounded-xl bg-background-card border border-border-primary hover:border-border-accent transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-white">{index + 1}</span>
                          </div>
                          <p className="text-sm text-text-secondary leading-relaxed">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border-primary bg-background-glass backdrop-blur-xl">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-cloudsway-primary-500 mb-4" />
                <h3 className="font-semibold text-text-primary mb-2">正在生成综合分析...</h3>
                <p className="text-text-secondary text-sm max-w-md">
                  各位专家正在协作分析您的需求，请稍候片刻，我们将为您呈现最全面的解决方案建议。
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentCollaborationPanel;