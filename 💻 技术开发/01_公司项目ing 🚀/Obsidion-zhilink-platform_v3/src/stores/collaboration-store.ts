/**
 * 6角色协作状态管理
 * 
 * 管理AI专家协作分析的状态、进度、结果等
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type {
  CollaborationSession,
  CollaborationPhase,
  AgentRole,
  AgentRoleConfig,
  ChatMessage,
  CollaborationInsight,
  CollaborationSynthesis,
} from '@/types';
import { 
  collaborationService, 
  type CollaborationRequest, 
  type CollaborationResponse 
} from '@/services/six-roles-collaboration';

interface CollaborationState {
  // 当前会话
  currentSession: CollaborationSession | null;
  sessionId: string | null;
  
  // 会话列表
  sessions: CollaborationSession[];
  recentSessions: string[]; // 最近的会话ID
  
  // 协作状态
  isAnalyzing: boolean;
  currentPhase: CollaborationPhase;
  progress: number;
  estimatedTimeRemaining: number;
  
  // AI角色状态
  agents: Record<AgentRole, AgentRoleConfig>;
  activeAgent: AgentRole | null;
  completedAgents: AgentRole[];
  
  // 消息和结果
  messages: ChatMessage[];
  insights: CollaborationInsight;
  synthesis: CollaborationSynthesis | null;
  recommendations: Array<{
    id: string;
    type: 'product' | 'strategy' | 'action';
    title: string;
    description: string;
    confidence: number;
    priority: 'high' | 'medium' | 'low';
  }>;
  
  // UI状态
  showAgentDetails: boolean;
  expandedAgent: AgentRole | null;
  messageFilter: 'all' | 'user' | 'agent' | 'system';
  
  // 错误处理
  error: string | null;
  retryCount: number;
  maxRetries: number;
}

interface CollaborationActions {
  // 会话管理
  startCollaboration: (userQuery: string, options?: {
    industry?: string;
    budget?: number;
    timeline?: string;
    requirements?: string[];
  }) => Promise<void>;
  pauseCollaboration: () => void;
  resumeCollaboration: () => void;
  stopCollaboration: () => void;
  
  // 会话导航
  loadSession: (sessionId: string) => Promise<void>;
  deleteSession: (sessionId: string) => void;
  clearSessions: () => void;
  
  // 消息管理
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  clearMessages: () => void;
  
  // 角色状态管理
  updateAgentStatus: (role: AgentRole, updates: Partial<AgentRoleConfig>) => void;
  setActiveAgent: (role: AgentRole | null) => void;
  markAgentCompleted: (role: AgentRole) => void;
  resetAgentStates: () => void;
  
  // 阶段管理
  updatePhase: (phase: CollaborationPhase, progress?: number) => void;
  updateProgress: (progress: number) => void;
  updateTimeRemaining: (seconds: number) => void;
  
  // 结果管理
  updateInsights: (insights: Partial<CollaborationInsight>) => void;
  setSynthesis: (synthesis: CollaborationSynthesis) => void;
  addRecommendation: (recommendation: any) => void;
  clearResults: () => void;
  
  // UI控制
  toggleAgentDetails: () => void;
  expandAgent: (role: AgentRole | null) => void;
  setMessageFilter: (filter: 'all' | 'user' | 'agent' | 'system') => void;
  
  // 错误处理
  setError: (error: string | null) => void;
  clearError: () => void;
  retry: () => Promise<void>;
  
  // 重置
  reset: () => void;
}

type CollaborationStore = CollaborationState & CollaborationActions;

// 初始状态
const initialState: CollaborationState = {
  currentSession: null,
  sessionId: null,
  sessions: [],
  recentSessions: [],
  isAnalyzing: false,
  currentPhase: 'analysis',
  progress: 0,
  estimatedTimeRemaining: 0,
  agents: {} as Record<AgentRole, AgentRoleConfig>,
  activeAgent: null,
  completedAgents: [],
  messages: [],
  insights: {},
  synthesis: null,
  recommendations: [],
  showAgentDetails: true,
  expandedAgent: null,
  messageFilter: 'all',
  error: null,
  retryCount: 0,
  maxRetries: 3,
};

export const useCollaborationStore = create<CollaborationStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // 启动协作分析
    startCollaboration: async (userQuery: string, options = {}) => {
      const state = get();
      
      // 重置状态
      set({
        isAnalyzing: true,
        currentPhase: 'analysis',
        progress: 0,
        messages: [],
        insights: {},
        synthesis: null,
        recommendations: [],
        completedAgents: [],
        activeAgent: null,
        error: null,
        retryCount: 0,
      });

      try {
        // 添加用户消息
        get().addMessage({
          type: 'user',
          content: userQuery,
          status: 'sent',
        });

        // 添加系统启动消息
        get().addMessage({
          type: 'system',
          content: '🚀 启动6角色AI专家协作分析...',
          status: 'sent',
        });

        // 构建协作请求
        const request: CollaborationRequest = {
          userQuery,
          context: {
            industry: options.industry,
            budget: options.budget,
            timeline: options.timeline,
            requirements: options.requirements,
          },
          options: {
            enableRealtime: true,
          },
        };

        // 调用协作服务
        const response = await collaborationService.startCollaboration(request);
        
        set({
          sessionId: response.sessionId,
          currentSession: {
            id: response.sessionId,
            userQuery,
            phase: response.currentPhase,
            agents: [],
            insights: {},
            startTime: response.metadata.startTime,
            estimatedDuration: 130, // 默认预估时间
            progress: 0,
          },
        });

        // 开始监控协作进度
        get().monitorCollaboration(response.sessionId);

      } catch (error) {
        set({
          isAnalyzing: false,
          error: error instanceof Error ? error.message : '协作启动失败',
        });
      }
    },

    // 监控协作进度（内部方法）
    monitorCollaboration: async (sessionId: string) => {
      const pollInterval = 1000; // 1秒轮询
      let lastPhase: CollaborationPhase = 'analysis';
      
      const poll = async () => {
        try {
          const status = collaborationService.getSessionStatus(sessionId);
          if (!status) return;

          const state = get();
          
          // 更新阶段
          if (status.currentPhase !== lastPhase) {
            lastPhase = status.currentPhase;
            get().updatePhase(status.currentPhase);
            
            // 添加阶段转换消息
            get().addMessage({
              type: 'system',
              content: `✅ ${getPhaseDisplayName(status.currentPhase)}阶段开始`,
              status: 'sent',
            });
          }

          // 更新洞察
          if (Object.keys(status.insights).length > 0) {
            get().updateInsights(status.insights);
            
            // 为每个新的专家分析添加消息
            Object.entries(status.insights).forEach(([role, insight]) => {
              const agentRole = role as AgentRole;
              if (!state.completedAgents.includes(agentRole)) {
                get().addMessage({
                  type: 'agent',
                  content: insight.analysis,
                  status: 'sent',
                  sender: {
                    id: agentRole,
                    name: getAgentName(agentRole),
                    role: agentRole,
                  },
                  metadata: {
                    confidence: insight.confidence,
                  },
                });
                
                get().markAgentCompleted(agentRole);
              }
            });
          }

          // 更新综合结果
          if (status.synthesis) {
            get().setSynthesis(status.synthesis);
          }

          // 更新推荐
          if (status.recommendations) {
            set({ recommendations: status.recommendations });
          }

          // 检查完成状态
          if (status.status === 'completed') {
            set({
              isAnalyzing: false,
              currentPhase: 'completed',
              progress: 100,
            });

            get().addMessage({
              type: 'system',
              content: '🎉 6角色协作分析完成！已生成综合建议和产品推荐。',
              status: 'sent',
              metadata: {
                suggestions: [
                  '查看推荐的AI解决方案',
                  '下载详细分析报告',
                  '开始产品试用申请'
                ],
              },
            });
            return; // 停止轮询
          }

          if (status.status === 'failed') {
            set({
              isAnalyzing: false,
              error: '协作分析失败，请重试',
            });
            return; // 停止轮询
          }

          // 继续轮询
          if (state.isAnalyzing) {
            setTimeout(poll, pollInterval);
          }

        } catch (error) {
          console.error('Collaboration monitoring error:', error);
          const state = get();
          if (state.retryCount < state.maxRetries) {
            set({ retryCount: state.retryCount + 1 });
            setTimeout(poll, pollInterval * 2); // 延长间隔重试
          } else {
            set({
              isAnalyzing: false,
              error: '监控协作进度失败',
            });
          }
        }
      };

      // 开始轮询
      setTimeout(poll, 100);
    },

    // 暂停协作
    pauseCollaboration: () => {
      set({ isAnalyzing: false });
    },

    // 恢复协作
    resumeCollaboration: () => {
      const { sessionId } = get();
      if (sessionId) {
        set({ isAnalyzing: true });
        get().monitorCollaboration(sessionId);
      }
    },

    // 停止协作
    stopCollaboration: () => {
      set({
        isAnalyzing: false,
        activeAgent: null,
        progress: 0,
      });
    },

    // 加载会话
    loadSession: async (sessionId: string) => {
      // 模拟加载会话数据
      // 实际项目中会从API或本地存储加载
      set({ sessionId });
    },

    // 删除会话
    deleteSession: (sessionId: string) => {
      const { sessions } = get();
      set({
        sessions: sessions.filter(s => s.id !== sessionId),
        recentSessions: get().recentSessions.filter(id => id !== sessionId),
      });
    },

    // 清空会话
    clearSessions: () => {
      set({
        sessions: [],
        recentSessions: [],
      });
    },

    // 添加消息
    addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
      const newMessage: ChatMessage = {
        ...message,
        id: `msg-${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
      };

      set(state => ({
        messages: [...state.messages, newMessage]
      }));
    },

    // 更新消息
    updateMessage: (id: string, updates: Partial<ChatMessage>) => {
      set(state => ({
        messages: state.messages.map(msg =>
          msg.id === id ? { ...msg, ...updates } : msg
        )
      }));
    },

    // 清空消息
    clearMessages: () => {
      set({ messages: [] });
    },

    // 更新AI角色状态
    updateAgentStatus: (role: AgentRole, updates: Partial<AgentRoleConfig>) => {
      set(state => ({
        agents: {
          ...state.agents,
          [role]: {
            ...state.agents[role],
            ...updates,
          },
        },
      }));
    },

    // 设置活动角色
    setActiveAgent: (role: AgentRole | null) => {
      set({ activeAgent: role });
    },

    // 标记角色完成
    markAgentCompleted: (role: AgentRole) => {
      set(state => ({
        completedAgents: state.completedAgents.includes(role)
          ? state.completedAgents
          : [...state.completedAgents, role],
        activeAgent: state.activeAgent === role ? null : state.activeAgent,
      }));
    },

    // 重置角色状态
    resetAgentStates: () => {
      set({
        agents: {} as Record<AgentRole, AgentRoleConfig>,
        activeAgent: null,
        completedAgents: [],
      });
    },

    // 更新阶段
    updatePhase: (phase: CollaborationPhase, progress = 0) => {
      set({
        currentPhase: phase,
        progress,
      });
    },

    // 更新进度
    updateProgress: (progress: number) => {
      set({ progress: Math.min(100, Math.max(0, progress)) });
    },

    // 更新剩余时间
    updateTimeRemaining: (seconds: number) => {
      set({ estimatedTimeRemaining: Math.max(0, seconds) });
    },

    // 更新洞察
    updateInsights: (newInsights: Partial<CollaborationInsight>) => {
      set(state => ({
        insights: {
          ...state.insights,
          ...newInsights,
        },
      }));
    },

    // 设置综合分析
    setSynthesis: (synthesis: CollaborationSynthesis) => {
      set({ synthesis });
    },

    // 添加推荐
    addRecommendation: (recommendation: any) => {
      set(state => ({
        recommendations: [...state.recommendations, recommendation]
      }));
    },

    // 清空结果
    clearResults: () => {
      set({
        insights: {},
        synthesis: null,
        recommendations: [],
      });
    },

    // 切换角色详情显示
    toggleAgentDetails: () => {
      set(state => ({
        showAgentDetails: !state.showAgentDetails
      }));
    },

    // 展开角色
    expandAgent: (role: AgentRole | null) => {
      set({ expandedAgent: role });
    },

    // 设置消息过滤器
    setMessageFilter: (filter: 'all' | 'user' | 'agent' | 'system') => {
      set({ messageFilter: filter });
    },

    // 设置错误
    setError: (error: string | null) => {
      set({ error });
    },

    // 清除错误
    clearError: () => {
      set({ error: null });
    },

    // 重试
    retry: async () => {
      const { currentSession, sessionId } = get();
      if (currentSession && sessionId) {
        set({
          error: null,
          retryCount: 0,
          isAnalyzing: true,
        });
        
        // 重新开始监控
        get().monitorCollaboration(sessionId);
      }
    },

    // 重置
    reset: () => {
      set({ ...initialState });
    },
  }))
);

// 辅助函数
function getPhaseDisplayName(phase: CollaborationPhase): string {
  const phaseNames = {
    analysis: '需求分析',
    design: '方案设计',
    planning: '实施规划',
    synthesis: '综合评估',
    completed: '分析完成',
  };
  return phaseNames[phase] || phase;
}

function getAgentName(role: AgentRole): string {
  const agentNames = {
    alex: 'Alex',
    sarah: 'Sarah', 
    mike: 'Mike',
    emma: 'Emma',
    david: 'David',
    catherine: 'Catherine',
  };
  return agentNames[role] || role;
}

// 选择器
export const selectCurrentSession = (state: CollaborationStore) => state.currentSession;
export const selectIsAnalyzing = (state: CollaborationStore) => state.isAnalyzing;
export const selectMessages = (state: CollaborationStore) => state.messages;
export const selectFilteredMessages = (state: CollaborationStore) => {
  const { messages, messageFilter } = state;
  if (messageFilter === 'all') return messages;
  return messages.filter(msg => msg.type === messageFilter);
};
export const selectCurrentPhase = (state: CollaborationStore) => state.currentPhase;
export const selectProgress = (state: CollaborationStore) => state.progress;
export const selectAgents = (state: CollaborationStore) => state.agents;
export const selectInsights = (state: CollaborationStore) => state.insights;
export const selectSynthesis = (state: CollaborationStore) => state.synthesis;
export const selectRecommendations = (state: CollaborationStore) => state.recommendations;

export type { CollaborationStore, CollaborationState, CollaborationActions };