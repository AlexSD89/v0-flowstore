"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import {
  Send,
  Mic,
  MicOff,
  Image,
  Paperclip,
  MoreHorizontal,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Share2,
  Bookmark,
  Download,
  Zap,
  Brain,
  Code,
  Palette,
  BarChart3,
  Calendar,
  Crown,
  Users,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Sparkles,
  Star,
  Activity,
  Eye,
  Heart,
  Lightbulb,
  Target,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

import { cn } from "@/lib/utils";

// 消息类型
export type MessageType = 'user' | 'agent' | 'system' | 'error';
export type AgentRole = 'alex' | 'sarah' | 'mike' | 'emma' | 'david' | 'catherine';

// 消息状态
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

// 消息接口
export interface ChatMessage {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  status: MessageStatus;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
    role?: AgentRole;
  };
  metadata?: {
    confidence?: number;
    processingTime?: number;
    suggestions?: string[];
    attachments?: MessageAttachment[];
    reactions?: MessageReaction[];
    relatedProducts?: string[];
  };
  isTyping?: boolean;
  isHighlighted?: boolean;
}

// 消息附件
export interface MessageAttachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'audio' | 'video';
  url: string;
  size: number;
  thumbnail?: string;
}

// 消息反应
export interface MessageReaction {
  type: 'like' | 'dislike' | 'helpful' | 'bookmark';
  count: number;
  userReacted: boolean;
}

// 对话会话
export interface ChatSession {
  id: string;
  title: string;
  participants: Array<{
    id: string;
    name: string;
    role: AgentRole;
    avatar?: string;
    status: 'online' | 'busy' | 'away' | 'offline';
  }>;
  messages: ChatMessage[];
  context?: {
    topic: string;
    requirements: string[];
    budget?: number;
    timeline?: string;
    industry?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// 组件属性
export interface ChatInterfaceProps {
  session: ChatSession;
  currentUserId: string;
  isLoading?: boolean;
  isTyping?: boolean;
  typingUsers?: string[];
  onSendMessage?: (message: string, attachments?: File[]) => void;
  onReaction?: (messageId: string, reaction: MessageReaction['type']) => void;
  onRetry?: (messageId: string) => void;
  onCopy?: (content: string) => void;
  onShare?: (messageId: string) => void;
  onBookmark?: (messageId: string) => void;
  className?: string;
  enableVoice?: boolean;
  enableAttachments?: boolean;
  maxMessageLength?: number;
}

// 角色配置
const agentRoles = {
  alex: {
    name: 'Alex',
    title: '需求理解专家',
    icon: Brain,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    description: '深度需求挖掘与隐性需求识别'
  },
  sarah: {
    name: 'Sarah',
    title: '技术架构师',
    icon: Code,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    description: '技术可行性分析与架构设计'
  },
  mike: {
    name: 'Mike',
    title: '体验设计师',
    icon: Palette,
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    description: '用户体验设计与交互优化'
  },
  emma: {
    name: 'Emma',
    title: '数据分析师',
    icon: BarChart3,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    description: '数据基建分析与分析策略'
  },
  david: {
    name: 'David',
    title: '项目管理师',
    icon: Calendar,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    description: '实施路径规划与项目管理'
  },
  catherine: {
    name: 'Catherine',
    title: '战略顾问',
    icon: Crown,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20',
    description: '商业价值分析与战略建议'
  }
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  session,
  currentUserId,
  isLoading = false,
  isTyping = false,
  typingUsers = [],
  onSendMessage,
  onReaction,
  onRetry,
  onCopy,
  onShare,
  onBookmark,
  className,
  enableVoice = false,
  enableAttachments = true,
  maxMessageLength = 2000
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 自动滚动到底部
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [session.messages, scrollToBottom]);

  // 发送消息
  const handleSendMessage = () => {
    if (!message.trim() && attachments.length === 0) return;
    
    onSendMessage?.(message.trim(), attachments);
    setMessage('');
    setAttachments([]);
  };

  // 处理键盘事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  // 移除附件
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // 渲染消息气泡
  const renderMessage = (msg: ChatMessage, index: number) => {
    const isUser = msg.type === 'user';
    const isAgent = msg.type === 'agent';
    const isSystem = msg.type === 'system';
    const isError = msg.type === 'error';
    
    const agentConfig = isAgent && msg.sender?.role ? agentRoles[msg.sender.role] : null;
    const AgentIcon = agentConfig?.icon;

    return (
      <motion.div
        key={msg.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className={cn(
          "flex gap-3 mb-6",
          isUser && "flex-row-reverse",
          (isSystem || isError) && "justify-center"
        )}
      >
        {/* 头像 */}
        {(isAgent || isUser) && (
          <Avatar className={cn(
            "w-10 h-10 flex-shrink-0",
            agentConfig && "border-2",
            agentConfig && `border-${agentConfig.color.replace('text-', '')}`
          )}>
            <AvatarImage src={msg.sender?.avatar} />
            <AvatarFallback className={cn(
              "text-white font-semibold",
              isUser && "bg-gradient-primary",
              agentConfig && agentConfig.bgColor.replace('bg-', 'bg-').replace('/20', '')
            )}>
              {isUser ? (
                currentUserId.charAt(0).toUpperCase()
              ) : AgentIcon ? (
                <AgentIcon className="w-5 h-5" />
              ) : (
                msg.sender?.name?.charAt(0).toUpperCase()
              )}
            </AvatarFallback>
          </Avatar>
        )}

        {/* 消息内容 */}
        <div className={cn(
          "flex-1 min-w-0",
          isUser && "flex flex-col items-end",
          (isSystem || isError) && "max-w-md"
        )}>
          {/* 发送者信息 */}
          {(isAgent || isUser) && (
            <div className={cn(
              "flex items-center gap-2 mb-2",
              isUser && "flex-row-reverse"
            )}>
              <span className="text-sm font-medium text-text-primary">
                {isUser ? '你' : msg.sender?.name}
              </span>
              {agentConfig && (
                <Badge variant="outline" className={cn("text-xs", agentConfig.color)}>
                  {agentConfig.title}
                </Badge>
              )}
              <span className="text-xs text-text-muted">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              {msg.metadata?.processingTime && (
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="outline" className="text-xs">
                      {msg.metadata.processingTime}ms
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>处理耗时</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          )}

          {/* 消息气泡 */}
          <div className={cn(
            "relative max-w-2xl rounded-2xl px-4 py-3 transition-all duration-200",
            isUser && "bg-gradient-primary text-white rounded-br-md",
            isAgent && "bg-background-card border border-border-primary rounded-bl-md",
            isSystem && "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300",
            isError && "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300",
            msg.isHighlighted && "ring-2 ring-cloudsway-primary-500 shadow-glow-primary"
          )}>
            {/* 消息状态指示器 */}
            {msg.status === 'sending' && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                <Loader2 className="w-3 h-3 animate-spin text-cloudsway-primary-500" />
              </div>
            )}
            {msg.status === 'failed' && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                <AlertTriangle className="w-3 h-3 text-status-error" />
              </div>
            )}

            {/* 消息内容 */}
            <div className="space-y-2">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </p>

              {/* 置信度显示 */}
              {msg.metadata?.confidence && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs opacity-75">置信度:</span>
                  <Progress 
                    value={msg.metadata.confidence * 100} 
                    className="h-1.5 w-20"
                  />
                  <span className="text-xs opacity-75">
                    {Math.round(msg.metadata.confidence * 100)}%
                  </span>
                </div>
              )}

              {/* 附件显示 */}
              {msg.metadata?.attachments && msg.metadata.attachments.length > 0 && (
                <div className="space-y-2 mt-3">
                  {msg.metadata.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center gap-2 p-2 rounded-lg bg-background-glass border border-border-primary"
                    >
                      <div className="w-8 h-8 rounded bg-cloudsway-primary-500 flex items-center justify-center text-white">
                        <Paperclip className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{attachment.name}</p>
                        <p className="text-xs text-text-secondary">
                          {(attachment.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* 建议回复 */}
              {msg.metadata?.suggestions && msg.metadata.suggestions.length > 0 && (
                <div className="space-y-2 mt-3">
                  <p className="text-xs opacity-75">建议回复:</p>
                  <div className="flex flex-wrap gap-2">
                    {msg.metadata.suggestions.map((suggestion, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => setMessage(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 消息操作菜单 */}
            <div className={cn(
              "absolute top-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1",
              isUser ? "-left-12" : "-right-12"
            )}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => onCopy?.(msg.content)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>复制</p></TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => onShare?.(msg.id)}
                  >
                    <Share2 className="w-3 h-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>分享</p></TooltipContent>
              </Tooltip>
              
              {msg.status === 'failed' && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => onRetry?.(msg.id)}
                    >
                      <RefreshCw className="w-3 h-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>重试</p></TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          {/* 消息反应 */}
          {msg.metadata?.reactions && msg.metadata.reactions.length > 0 && (
            <div className={cn(
              "flex items-center gap-2 mt-2",
              isUser && "justify-end"
            )}>
              {msg.metadata.reactions.map((reaction) => (
                <Button
                  key={reaction.type}
                  variant={reaction.userReacted ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => onReaction?.(msg.id, reaction.type)}
                >
                  {reaction.type === 'like' && <ThumbsUp className="w-3 h-3 mr-1" />}
                  {reaction.type === 'dislike' && <ThumbsDown className="w-3 h-3 mr-1" />}
                  {reaction.type === 'helpful' && <Lightbulb className="w-3 h-3 mr-1" />}
                  {reaction.type === 'bookmark' && <Bookmark className="w-3 h-3 mr-1" />}
                  {reaction.count}
                </Button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // 渲染正在输入指示器
  const renderTypingIndicator = () => {
    if (!isTyping && typingUsers.length === 0) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="flex gap-3 mb-4"
      >
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-gradient-secondary text-white">
            <Brain className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="bg-background-card border border-border-primary rounded-2xl rounded-bl-md px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm text-text-secondary">
                AI正在分析您的需求...
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <TooltipProvider>
      <div className={cn("flex flex-col h-full", className)}>
        {/* 对话头部 */}
        <Card className="border-border-primary bg-background-glass backdrop-blur-xl mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary text-lg">
                    {session.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <span>{session.participants.length} 位专家</span>
                    <Separator orientation="vertical" className="h-4" />
                    <span>创建于 {session.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* 参与者头像 */}
              <div className="flex items-center -space-x-2">
                {session.participants.slice(0, 6).map((participant) => {
                  const roleConfig = agentRoles[participant.role];
                  const RoleIcon = roleConfig?.icon;
                  
                  return (
                    <Tooltip key={participant.id}>
                      <TooltipTrigger>
                        <Avatar className={cn(
                          "w-8 h-8 border-2 border-background-main ring-2 ring-background-main",
                          participant.status === 'online' && "ring-status-success",
                          participant.status === 'busy' && "ring-status-warning",
                          participant.status === 'away' && "ring-status-info",
                          participant.status === 'offline' && "ring-border-primary"
                        )}>
                          <AvatarImage src={participant.avatar} />
                          <AvatarFallback className={roleConfig?.bgColor}>
                            {RoleIcon ? (
                              <RoleIcon className="w-4 h-4" />
                            ) : (
                              participant.name.charAt(0).toUpperCase()
                            )}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-center">
                          <p className="font-medium">{participant.name}</p>
                          <p className="text-xs text-text-secondary">{roleConfig?.title}</p>
                          <p className="text-xs capitalize">{participant.status}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
                {session.participants.length > 6 && (
                  <div className="w-8 h-8 rounded-full bg-background-card border-2 border-background-main ring-2 ring-background-main flex items-center justify-center">
                    <span className="text-xs font-medium text-text-secondary">
                      +{session.participants.length - 6}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 对话上下文 */}
            {session.context && (
              <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200/30 dark:border-blue-800/30">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-2">
                    <p className="font-medium text-blue-700 dark:text-blue-300">
                      {session.context.topic}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {session.context.requirements.map((req, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-blue-600 dark:text-blue-400">
                      {session.context.budget && (
                        <span>预算: ¥{session.context.budget.toLocaleString()}</span>
                      )}
                      {session.context.timeline && (
                        <span>时间线: {session.context.timeline}</span>
                      )}
                      {session.context.industry && (
                        <span>行业: {session.context.industry}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 消息列表 */}
        <ScrollArea className="flex-1 px-1">
          <div className="space-y-1 pb-6 group">
            <AnimatePresence mode="popLayout">
              {session.messages.map((message, index) => 
                renderMessage(message, index)
              )}
              {renderTypingIndicator()}
            </AnimatePresence>
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* 输入区域 */}
        <Card className="border-border-primary bg-background-glass backdrop-blur-xl mt-4">
          <CardContent className="p-4">
            {/* 附件预览 */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3 p-3 bg-background-card rounded-xl">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-background-main px-3 py-2 rounded-lg border border-border-primary"
                  >
                    <Paperclip className="w-4 h-4 text-text-secondary" />
                    <span className="text-sm text-text-primary truncate max-w-32">
                      {file.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => removeAttachment(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              {/* 输入框 */}
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="输入您的需求，AI专家们将为您提供专业建议..."
                  className="min-h-[44px] max-h-32 resize-none pr-20"
                  maxLength={maxMessageLength}
                  disabled={isLoading}
                />
                
                <div className="absolute bottom-2 right-3 flex items-center gap-2">
                  {/* 字数统计 */}
                  <span className={cn(
                    "text-xs",
                    message.length > maxMessageLength * 0.8 
                      ? "text-status-warning" 
                      : "text-text-muted"
                  )}>
                    {message.length}/{maxMessageLength}
                  </span>
                  
                  {/* 附件上传 */}
                  {enableAttachments && (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        hidden
                        onChange={handleFileUpload}
                        accept="image/*,document/*,.pdf,.doc,.docx,.txt"
                      />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isLoading}
                          >
                            <Paperclip className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>添加附件</p></TooltipContent>
                      </Tooltip>
                    </>
                  )}

                  {/* 语音输入 */}
                  {enableVoice && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-6 w-6",
                            isRecording && "text-status-error animate-pulse"
                          )}
                          onClick={() => setIsRecording(!isRecording)}
                          disabled={isLoading}
                        >
                          {isRecording ? (
                            <MicOff className="w-4 h-4" />
                          ) : (
                            <Mic className="w-4 h-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isRecording ? '停止录音' : '语音输入'}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>

              {/* 发送按钮 */}
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() && attachments.length === 0 || isLoading}
                className="h-11 px-6"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
                <span className="ml-2 hidden sm:inline">发送</span>
              </Button>
            </div>

            {/* 快捷操作 */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-primary">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Sparkles className="w-4 h-4" />
                <span>AI正在待命，随时为您提供专业建议</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <Activity className="w-3 h-3 mr-1" />
                  {session.participants.filter(p => p.status === 'online').length} 在线
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  {session.messages.length} 消息
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default ChatInterface;