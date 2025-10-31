/**
 * LaunchX 智链平台 v3 - 页面导航服务
 * 
 * 提供完整的页面跳转逻辑和用户路径管理，包括：
 * 1. 智能路径推荐 (Smart Path Recommendation)
 * 2. 用户意图分析 (User Intent Analysis)
 * 3. 上下文感知导航 (Context-Aware Navigation)
 * 4. 渐进式引导 (Progressive Guidance)
 * 5. 个性化路径 (Personalized Journeys)
 */

import { UserRole, ProductType, User } from '@/types';

// ==================== 导航系统类型定义 ====================

/** 页面路由定义 */
export interface PageRoute {
  path: string;
  level: 0 | 1 | 2 | 3; // 页面层级
  title: string;
  description: string;
  requiredRole?: UserRole[];
  requiresAuth?: boolean;
  category: 'landing' | 'market' | 'workspace' | 'dashboard' | 'auth' | 'profile' | 'admin';
  metadata?: {
    keywords: string[];
    estimatedTime?: string; // 预计停留时间
    complexityLevel?: 'simple' | 'moderate' | 'complex';
    primaryAction?: string;
  };
}

/** 用户意图类型 */
export type UserIntent = 
  | 'browse_products'      // 浏览产品
  | 'search_solution'      // 搜索解决方案
  | 'analyze_requirements' // 分析需求
  | 'collaborate_ai'       // AI协作
  | 'manage_business'      // 业务管理
  | 'learn_platform'       // 了解平台
  | 'complete_purchase'    // 完成购买
  | 'manage_account'       // 账户管理
  | 'seek_support'         // 寻求支持
  | 'explore_features';    // 探索功能

/** 导航上下文 */
export interface NavigationContext {
  user?: User;
  currentRole: UserRole;
  sessionData: {
    isFirstVisit: boolean;
    previousPages: string[];
    timeOnCurrentPage: number;
    totalSessionTime: number;
    interactionCount: number;
  };
  deviceInfo: {
    type: 'mobile' | 'tablet' | 'desktop';
    screenSize: string;
    touchSupport: boolean;
  };
  businessContext: {
    industry?: string;
    urgency?: 'low' | 'medium' | 'high';
    teamSize?: string;
    currentProject?: string;
  };
}

/** 路径推荐结果 */
export interface PathRecommendation {
  targetPath: string;
  confidence: number;
  reason: string;
  estimatedTime: string;
  benefits: string[];
  alternativePaths: string[];
  requiredSteps?: string[];
  contextHelp?: string;
}

/** 导航建议 */
export interface NavigationSuggestion {
  type: 'next_step' | 'shortcut' | 'related_page' | 'completion_aid' | 'discovery';
  title: string;
  description: string;
  targetPath: string;
  icon?: string;
  priority: 'high' | 'medium' | 'low';
  conditions?: string[];
}

/** 用户旅程阶段 */
export type UserJourneyStage = 
  | 'discovery'     // 发现阶段
  | 'exploration'   // 探索阶段
  | 'evaluation'    // 评估阶段
  | 'decision'      // 决策阶段
  | 'implementation' // 实施阶段
  | 'optimization'; // 优化阶段

/** 页面转换配置 */
export interface PageTransitionConfig {
  animation: 'slide' | 'fade' | 'scale' | 'flip' | 'none';
  duration: number;
  easing: string;
  preload?: boolean;
  keepAlive?: boolean;
  progressIndicator?: boolean;
}

// ==================== 路由配置 ====================

/** 平台所有路由定义 */
export const PLATFORM_ROUTES: Record<string, PageRoute> = {
  // Level 0: 动画诱饵主页
  home: {
    path: '/',
    level: 0,
    title: '智链平台 - AI解决方案市场',
    description: '发现最适合您业务的AI解决方案',
    category: 'landing',
    metadata: {
      keywords: ['AI', '人工智能', '解决方案', '市场', '企业'],
      estimatedTime: '2-5分钟',
      complexityLevel: 'simple',
      primaryAction: '开始探索'
    }
  },

  // Level 1: AI能力市场
  market: {
    path: '/market',
    level: 1,
    title: 'AI能力市场',
    description: '浏览和发现AI产品与服务',
    category: 'market',
    metadata: {
      keywords: ['AI产品', '市场', '浏览', '发现'],
      estimatedTime: '10-30分钟',
      complexityLevel: 'moderate',
      primaryAction: '浏览产品'
    }
  },
  
  marketSearch: {
    path: '/market/search',
    level: 2,
    title: '智能搜索',
    description: '精确搜索AI解决方案',
    category: 'market',
    metadata: {
      keywords: ['搜索', '筛选', '查找'],
      estimatedTime: '5-15分钟',
      complexityLevel: 'simple'
    }
  },
  
  marketCategory: {
    path: '/market/category/[slug]',
    level: 2,
    title: '分类浏览',
    description: '按类别浏览AI产品',
    category: 'market',
    metadata: {
      keywords: ['分类', '类别', '专业领域'],
      estimatedTime: '8-20分钟',
      complexityLevel: 'moderate'
    }
  },
  
  marketCompare: {
    path: '/market/compare',
    level: 2,
    title: '产品对比',
    description: '详细对比AI解决方案',
    category: 'market',
    metadata: {
      keywords: ['对比', '比较', '分析'],
      estimatedTime: '15-45分钟',
      complexityLevel: 'complex'
    }
  },

  // Level 2: 产品详情
  productDetail: {
    path: '/product/[id]',
    level: 2,
    title: '产品详情',
    description: '查看AI产品的详细信息',
    category: 'market',
    metadata: {
      keywords: ['产品详情', '功能', '价格', '评价'],
      estimatedTime: '10-25分钟',
      complexityLevel: 'moderate',
      primaryAction: '了解产品'
    }
  },
  
  productDemo: {
    path: '/product/[id]/demo',
    level: 3,
    title: '产品演示',
    description: '体验AI产品功能',
    category: 'market',
    metadata: {
      keywords: ['演示', '试用', '体验'],
      estimatedTime: '5-15分钟',
      complexityLevel: 'simple'
    }
  },

  // Level 1: 智能工作台
  workspace: {
    path: '/workspace',
    level: 1,
    title: '智能工作台',
    description: '项目管理和AI协作中心',
    category: 'workspace',
    requiresAuth: true,
    metadata: {
      keywords: ['工作台', '项目', '协作'],
      estimatedTime: '20-60分钟',
      complexityLevel: 'complex',
      primaryAction: '开始工作'
    }
  },
  
  workspaceProjects: {
    path: '/workspace/projects',
    level: 2,
    title: '项目管理',
    description: '管理您的AI项目',
    category: 'workspace',
    requiresAuth: true,
    metadata: {
      keywords: ['项目管理', '进度跟踪'],
      estimatedTime: '15-45分钟',
      complexityLevel: 'moderate'
    }
  },
  
  workspaceSpecs: {
    path: '/workspace/specs',
    level: 2,
    title: '需求分析',
    description: 'AI驱动的需求分析',
    category: 'workspace',
    requiresAuth: true,
    metadata: {
      keywords: ['需求分析', 'AI协作'],
      estimatedTime: '30-90分钟',
      complexityLevel: 'complex'
    }
  },
  
  workspaceCollaboration: {
    path: '/workspace/collaboration/[sessionId]',
    level: 3,
    title: 'AI协作会话',
    description: '与AI专家团队协作',
    category: 'workspace',
    requiresAuth: true,
    metadata: {
      keywords: ['AI协作', '专家咨询'],
      estimatedTime: '45-120分钟',
      complexityLevel: 'complex'
    }
  },

  // Level 1: AI智能对话
  chat: {
    path: '/chat',
    level: 1,
    title: 'AI智能对话',
    description: '与AI助手实时对话',
    category: 'workspace',
    metadata: {
      keywords: ['对话', 'AI助手', '咨询'],
      estimatedTime: '10-30分钟',
      complexityLevel: 'simple',
      primaryAction: '开始对话'
    }
  },

  // Level 1: 多角色仪表盘
  dashboardBuyer: {
    path: '/dashboard/buyer',
    level: 1,
    title: '采购方仪表盘',
    description: '采购数据和订单管理',
    category: 'dashboard',
    requiredRole: ['buyer'],
    requiresAuth: true,
    metadata: {
      keywords: ['采购', '订单', '数据分析'],
      estimatedTime: '15-30分钟',
      complexityLevel: 'moderate'
    }
  },
  
  dashboardVendor: {
    path: '/dashboard/vendor',
    level: 1,
    title: '供应商仪表盘',
    description: '销售数据和产品管理',
    category: 'dashboard',
    requiredRole: ['vendor'],
    requiresAuth: true,
    metadata: {
      keywords: ['销售', '产品管理', '客户'],
      estimatedTime: '20-45分钟',
      complexityLevel: 'complex'
    }
  },
  
  dashboardDistributor: {
    path: '/dashboard/distributor',
    level: 1,
    title: '分销商仪表盘',
    description: '分销数据和佣金管理',
    category: 'dashboard',
    requiredRole: ['distributor'],
    requiresAuth: true,
    metadata: {
      keywords: ['分销', '佣金', '推广'],
      estimatedTime: '15-35分钟',
      complexityLevel: 'moderate'
    }
  },

  // Level 2: 用户认证
  login: {
    path: '/auth/login',
    level: 2,
    title: '用户登录',
    description: '登录您的账户',
    category: 'auth',
    metadata: {
      keywords: ['登录', '账户'],
      estimatedTime: '2-5分钟',
      complexityLevel: 'simple'
    }
  },
  
  register: {
    path: '/auth/register',
    level: 2,
    title: '用户注册',
    description: '创建新账户',
    category: 'auth',
    metadata: {
      keywords: ['注册', '新用户'],
      estimatedTime: '5-10分钟',
      complexityLevel: 'moderate'
    }
  },
  
  onboarding: {
    path: '/auth/onboarding',
    level: 3,
    title: '新用户引导',
    description: '了解平台功能',
    category: 'auth',
    requiresAuth: true,
    metadata: {
      keywords: ['引导', '新用户', '功能介绍'],
      estimatedTime: '10-20分钟',
      complexityLevel: 'simple'
    }
  },

  // Level 2: 用户档案
  profile: {
    path: '/profile',
    level: 2,
    title: '个人档案',
    description: '管理个人信息',
    category: 'profile',
    requiresAuth: true,
    metadata: {
      keywords: ['个人信息', '档案'],
      estimatedTime: '5-15分钟',
      complexityLevel: 'simple'
    }
  }
};

// ==================== 页面导航服务主类 ====================

export class PageNavigationService {
  private intentPatterns: Map<UserIntent, RegExp[]> = new Map();
  private routeHistory: string[] = [];
  private navigationAnalytics: Map<string, any> = new Map();

  constructor() {
    this.initializeIntentPatterns();
  }

  /**
   * 分析用户输入并推荐最佳路径
   */
  public analyzeUserIntent(
    userInput: string,
    context: NavigationContext
  ): PathRecommendation {
    const intent = this.detectUserIntent(userInput);
    const currentStage = this.identifyUserJourneyStage(context);
    
    return this.generatePathRecommendation(intent, currentStage, context);
  }

  /**
   * 检测用户意图
   */
  private detectUserIntent(userInput: string): UserIntent {
    const input = userInput.toLowerCase();
    
    for (const [intent, patterns] of this.intentPatterns.entries()) {
      for (const pattern of patterns) {
        if (pattern.test(input)) {
          return intent;
        }
      }
    }
    
    // 默认意图：浏览产品
    return 'browse_products';
  }

  /**
   * 识别用户旅程阶段
   */
  private identifyUserJourneyStage(context: NavigationContext): UserJourneyStage {
    const { sessionData, user } = context;
    
    // 新用户或首次访问
    if (sessionData.isFirstVisit || !user) {
      return 'discovery';
    }
    
    // 基于用户行为分析
    if (sessionData.interactionCount < 5) {
      return 'exploration';
    } else if (sessionData.previousPages.some(page => page.includes('/product/'))) {
      return 'evaluation';
    } else if (sessionData.previousPages.some(page => page.includes('/workspace'))) {
      return 'implementation';
    }
    
    return 'exploration';
  }

  /**
   * 生成路径推荐
   */
  private generatePathRecommendation(
    intent: UserIntent,
    stage: UserJourneyStage,
    context: NavigationContext
  ): PathRecommendation {
    const recommendations = this.getIntentRouteMapping();
    const baseRecommendation = recommendations[intent];
    
    if (!baseRecommendation) {
      return this.getDefaultRecommendation(context);
    }

    // 根据用户旅程阶段调整推荐
    const adjustedPath = this.adjustPathForStage(baseRecommendation.targetPath, stage, context);
    
    return {
      ...baseRecommendation,
      targetPath: adjustedPath,
      confidence: this.calculateConfidence(intent, stage, context),
      requiredSteps: this.generateRequiredSteps(adjustedPath, context),
      contextHelp: this.generateContextHelp(intent, stage)
    };
  }

  /**
   * 意图到路由的映射
   */
  private getIntentRouteMapping(): Record<UserIntent, Partial<PathRecommendation>> {
    return {
      browse_products: {
        targetPath: '/market',
        reason: '您想要浏览AI产品，市场页面提供了全面的产品展示',
        estimatedTime: '10-30分钟',
        benefits: ['发现多样化AI解决方案', '对比不同产品功能', '了解市场趋势'],
        alternativePaths: ['/market/search', '/market/category/ai-workforce']
      },
      
      search_solution: {
        targetPath: '/market/search',
        reason: '基于您的搜索需求，智能搜索页面能快速找到匹配的解决方案',
        estimatedTime: '5-15分钟',
        benefits: ['精确搜索匹配', '智能筛选功能', '个性化推荐'],
        alternativePaths: ['/market', '/chat']
      },
      
      analyze_requirements: {
        targetPath: '/workspace/specs/new',
        reason: '需求分析是项目成功的关键，我们的AI专家团队将协助您',
        estimatedTime: '30-90分钟',
        benefits: ['专业需求梳理', '6AI专家协作', '智能解决方案匹配'],
        alternativePaths: ['/workspace', '/chat']
      },
      
      collaborate_ai: {
        targetPath: '/chat',
        reason: '与AI专家实时对话，获得即时的专业建议',
        estimatedTime: '10-30分钟',
        benefits: ['即时AI咨询', '专业建议', '个性化对话'],
        alternativePaths: ['/workspace/collaboration', '/workspace/specs']
      },
      
      manage_business: {
        targetPath: '/dashboard/buyer', // 默认，根据角色调整
        reason: '仪表盘提供全面的业务数据和管理功能',
        estimatedTime: '15-45分钟',
        benefits: ['业务数据分析', '订单管理', '性能监控'],
        alternativePaths: ['/workspace', '/profile']
      },
      
      learn_platform: {
        targetPath: '/',
        reason: '从主页开始，逐步了解平台的各项功能',
        estimatedTime: '15-30分钟',
        benefits: ['全面功能介绍', '引导式体验', '逐步学习'],
        alternativePaths: ['/auth/onboarding', '/chat']
      },
      
      complete_purchase: {
        targetPath: '/market',
        reason: '浏览产品并进入采购流程',
        estimatedTime: '20-60分钟',
        benefits: ['产品对比', '价格透明', '安全支付'],
        alternativePaths: ['/workspace/projects', '/dashboard/buyer']
      },
      
      manage_account: {
        targetPath: '/profile',
        reason: '个人档案页面提供完整的账户管理功能',
        estimatedTime: '5-15分钟',
        benefits: ['信息管理', '安全设置', '偏好配置'],
        alternativePaths: ['/profile/settings', '/profile/security']
      },
      
      seek_support: {
        targetPath: '/chat',
        reason: 'AI助手可以为您提供即时支持和帮助',
        estimatedTime: '5-20分钟',
        benefits: ['即时响应', '专业支持', '问题解决'],
        alternativePaths: ['/workspace', '/profile']
      },
      
      explore_features: {
        targetPath: '/workspace',
        reason: '工作台集成了平台的核心功能，是探索的最佳起点',
        estimatedTime: '20-45分钟',
        benefits: ['功能体验', '实际操作', '深度了解'],
        alternativePaths: ['/market', '/chat']
      }
    };
  }

  /**
   * 根据旅程阶段调整路径
   */
  private adjustPathForStage(
    basePath: string,
    stage: UserJourneyStage,
    context: NavigationContext
  ): string {
    const { currentRole } = context;
    
    // 根据用户角色调整仪表盘路径
    if (basePath === '/dashboard/buyer') {
      return `/dashboard/${currentRole}`;
    }
    
    // 根据旅程阶段调整
    switch (stage) {
      case 'discovery':
        // 新用户优先引导到主页或简单功能
        if (basePath === '/workspace/specs/new') {
          return '/chat'; // 降低复杂度
        }
        break;
        
      case 'implementation':
        // 实施阶段用户可能需要更高级功能
        if (basePath === '/chat') {
          return '/workspace/collaboration'; // 升级到协作功能
        }
        break;
        
      case 'optimization':
        // 优化阶段用户可能需要数据分析
        if (basePath === '/market') {
          return '/dashboard/' + currentRole; // 引导到仪表盘
        }
        break;
    }
    
    return basePath;
  }

  /**
   * 计算推荐置信度
   */
  private calculateConfidence(
    intent: UserIntent,
    stage: UserJourneyStage,
    context: NavigationContext
  ): number {
    let confidence = 0.7; // 基础置信度
    
    // 基于用户历史行为调整
    if (context.sessionData.previousPages.length > 0) {
      confidence += 0.1;
    }
    
    // 基于用户角色调整
    if (context.user?.role) {
      confidence += 0.1;
    }
    
    // 基于意图明确性调整
    const intentConfidenceMap: Record<UserIntent, number> = {
      browse_products: 0.9,
      search_solution: 0.85,
      analyze_requirements: 0.8,
      collaborate_ai: 0.85,
      manage_business: 0.75,
      learn_platform: 0.7,
      complete_purchase: 0.8,
      manage_account: 0.9,
      seek_support: 0.75,
      explore_features: 0.7
    };
    
    confidence = Math.max(confidence, intentConfidenceMap[intent] || 0.6);
    
    return Math.min(confidence, 1.0);
  }

  /**
   * 生成必要步骤
   */
  private generateRequiredSteps(
    targetPath: string,
    context: NavigationContext
  ): string[] {
    const steps: string[] = [];
    const route = this.findRouteByPath(targetPath);
    
    // 检查认证要求
    if (route?.requiresAuth && !context.user) {
      steps.push('登录或注册账户');
    }
    
    // 检查角色要求
    if (route?.requiredRole && context.user) {
      const hasRequiredRole = route.requiredRole.includes(context.currentRole);
      if (!hasRequiredRole) {
        steps.push(`切换到${route.requiredRole.join('或')}角色`);
      }
    }
    
    // 基于复杂度添加准备步骤
    if (route?.metadata?.complexityLevel === 'complex') {
      steps.push('建议先了解相关功能');
    }
    
    return steps;
  }

  /**
   * 生成上下文帮助
   */
  private generateContextHelp(intent: UserIntent, stage: UserJourneyStage): string {
    const helpMessages: Record<string, string> = {
      'discovery_browse_products': '作为新用户，建议从浏览精选产品开始，了解平台提供的AI解决方案类型。',
      'exploration_search_solution': '您可以使用智能搜索功能，输入具体需求关键词来快速定位相关产品。',
      'evaluation_analyze_requirements': '在这个阶段，建议使用我们的6AI专家协作功能，深入分析您的具体需求。',
      'implementation_collaborate_ai': 'AI协作功能将帮助您制定详细的实施计划和时间表。',
      'optimization_manage_business': '通过仪表盘数据分析，您可以优化现有解决方案的使用效果。'
    };
    
    const key = `${stage}_${intent}`;
    return helpMessages[key] || '我们将为您提供最适合的功能引导。';
  }

  /**
   * 获取默认推荐
   */
  private getDefaultRecommendation(context: NavigationContext): PathRecommendation {
    return {
      targetPath: '/market',
      confidence: 0.6,
      reason: '建议从AI能力市场开始探索',
      estimatedTime: '10-30分钟',
      benefits: ['了解可用解决方案', '发现新的可能性', '获得灵感'],
      alternativePaths: ['/chat', '/workspace']
    };
  }

  /**
   * 根据当前页面生成导航建议
   */
  public generateNavigationSuggestions(
    currentPath: string,
    context: NavigationContext
  ): NavigationSuggestion[] {
    const suggestions: NavigationSuggestion[] = [];
    const currentRoute = this.findRouteByPath(currentPath);
    
    if (!currentRoute) return suggestions;

    // 基于当前页面类型生成建议
    switch (currentRoute.category) {
      case 'landing':
        suggestions.push(
          {
            type: 'next_step',
            title: '探索AI产品',
            description: '浏览我们精选的AI解决方案',
            targetPath: '/market',
            priority: 'high'
          },
          {
            type: 'discovery',
            title: '与AI对话',
            description: '直接咨询AI专家获得建议',
            targetPath: '/chat',
            priority: 'medium'
          }
        );
        break;
        
      case 'market':
        suggestions.push(
          {
            type: 'shortcut',
            title: '快速搜索',
            description: '使用智能搜索快速找到解决方案',
            targetPath: '/market/search',
            priority: 'high'
          },
          {
            type: 'next_step',
            title: '需求分析',
            description: '让AI专家帮您分析具体需求',
            targetPath: '/workspace/specs/new',
            priority: 'medium'
          }
        );
        break;
        
      case 'workspace':
        if (context.currentRole === 'buyer') {
          suggestions.push({
            type: 'related_page',
            title: '查看订单',
            description: '管理您的采购订单',
            targetPath: '/dashboard/buyer/orders',
            priority: 'medium'
          });
        }
        break;
    }

    // 基于用户角色添加建议
    this.addRoleBasedSuggestions(suggestions, context);
    
    // 基于用户历史添加建议
    this.addHistoryBasedSuggestions(suggestions, context);

    return suggestions.sort((a, b) => 
      this.getPriorityWeight(b.priority) - this.getPriorityWeight(a.priority)
    );
  }

  /**
   * 添加基于角色的建议
   */
  private addRoleBasedSuggestions(
    suggestions: NavigationSuggestion[],
    context: NavigationContext
  ): void {
    const { currentRole, user } = context;
    
    if (!user) {
      suggestions.push({
        type: 'completion_aid',
        title: '登录账户',
        description: '登录以获得个性化体验',
        targetPath: '/auth/login',
        priority: 'medium'
      });
      return;
    }

    switch (currentRole) {
      case 'buyer':
        suggestions.push({
          type: 'shortcut',
          title: '采购仪表盘',
          description: '查看采购数据和订单状态',
          targetPath: '/dashboard/buyer',
          priority: 'medium'
        });
        break;
        
      case 'vendor':
        suggestions.push({
          type: 'shortcut',
          title: '供应商中心',
          description: '管理您的产品和销售数据',
          targetPath: '/dashboard/vendor',
          priority: 'medium'
        });
        break;
        
      case 'distributor':
        suggestions.push({
          type: 'shortcut',
          title: '分销中心',
          description: '管理推广链接和佣金',
          targetPath: '/dashboard/distributor',
          priority: 'medium'
        });
        break;
    }
  }

  /**
   * 添加基于历史的建议
   */
  private addHistoryBasedSuggestions(
    suggestions: NavigationSuggestion[],
    context: NavigationContext
  ): void {
    const { previousPages } = context.sessionData;
    
    // 如果用户看过产品详情，建议对比
    if (previousPages.some(page => page.includes('/product/'))) {
      suggestions.push({
        type: 'related_page',
        title: '产品对比',
        description: '对比您感兴趣的产品',
        targetPath: '/market/compare',
        priority: 'medium'
      });
    }
    
    // 如果用户在工作台，建议继续项目
    if (previousPages.some(page => page.includes('/workspace'))) {
      suggestions.push({
        type: 'completion_aid',
        title: '继续项目',
        description: '回到您的工作项目',
        targetPath: '/workspace/projects',
        priority: 'high'
      });
    }
  }

  /**
   * 记录页面访问
   */
  public recordPageVisit(
    path: string,
    context: NavigationContext,
    duration?: number
  ): void {
    this.routeHistory.push(path);
    
    // 记录分析数据
    const analytics = this.navigationAnalytics.get(path) || {
      visits: 0,
      totalTime: 0,
      bounceRate: 0,
      commonNextPages: new Map()
    };
    
    analytics.visits++;
    if (duration) {
      analytics.totalTime += duration;
    }
    
    this.navigationAnalytics.set(path, analytics);
  }

  /**
   * 获取页面转换配置
   */
  public getTransitionConfig(
    fromPath: string,
    toPath: string,
    context: NavigationContext
  ): PageTransitionConfig {
    const fromRoute = this.findRouteByPath(fromPath);
    const toRoute = this.findRouteByPath(toPath);
    
    // 基于页面层级确定动画
    let animation: PageTransitionConfig['animation'] = 'fade';
    
    if (fromRoute && toRoute) {
      if (toRoute.level > fromRoute.level) {
        animation = 'slide'; // 深入时滑动
      } else if (toRoute.level < fromRoute.level) {
        animation = 'scale'; // 返回时缩放
      }
    }
    
    // 基于设备类型调整
    const duration = context.deviceInfo.type === 'mobile' ? 300 : 400;
    
    return {
      animation,
      duration,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      preload: toRoute?.metadata?.complexityLevel === 'complex',
      progressIndicator: toRoute?.metadata?.estimatedTime ? 
        parseInt(toRoute.metadata.estimatedTime) > 10 : false
    };
  }

  // ==================== 辅助方法 ====================

  /**
   * 初始化意图识别模式
   */
  private initializeIntentPatterns(): void {
    this.intentPatterns.set('browse_products', [
      /浏览|查看|看看|产品|解决方案/,
      /有什么|都有|推荐/,
      /市场|商品|服务/
    ]);
    
    this.intentPatterns.set('search_solution', [
      /找|搜索|查找|寻找/,
      /需要.*的|要.*功能/,
      /解决.*问题|处理.*业务/
    ]);
    
    this.intentPatterns.set('analyze_requirements', [
      /需求|分析|评估/,
      /不知道|不确定|怎么选/,
      /复杂|具体|详细/
    ]);
    
    this.intentPatterns.set('collaborate_ai', [
      /咨询|问|请教|建议/,
      /AI|人工智能|助手/,
      /对话|聊天|交流/
    ]);
    
    this.intentPatterns.set('manage_business', [
      /管理|数据|统计|报表/,
      /订单|销售|采购/,
      /仪表盘|控制台/
    ]);
    
    this.intentPatterns.set('learn_platform', [
      /了解|学习|怎么用/,
      /新用户|第一次|刚|初/,
      /教程|指南|帮助/
    ]);
    
    this.intentPatterns.set('complete_purchase', [
      /购买|采购|买|下单/,
      /价格|付费|费用/,
      /订购|签约/
    ]);
    
    this.intentPatterns.set('manage_account', [
      /账户|个人|资料|信息/,
      /设置|配置|修改/,
      /密码|安全/
    ]);
    
    this.intentPatterns.set('seek_support', [
      /帮助|支持|客服/,
      /问题|困难|不会/,
      /联系|投诉/
    ]);
    
    this.intentPatterns.set('explore_features', [
      /功能|特性|能力/,
      /试试|体验|测试/,
      /工作台|平台/
    ]);
  }

  /**
   * 根据路径查找路由
   */
  private findRouteByPath(path: string): PageRoute | undefined {
    // 处理动态路由
    const normalizedPath = path.replace(/\/[^\/]+(?=\/|$)/g, (match) => {
      if (match.match(/^\/\d+$/) || match.match(/^\/[a-f0-9-]{36}$/)) {
        return '/[id]';
      }
      return match;
    });
    
    return Object.values(PLATFORM_ROUTES).find(route => 
      route.path === normalizedPath || route.path === path
    );
  }

  /**
   * 获取优先级权重
   */
  private getPriorityWeight(priority: 'high' | 'medium' | 'low'): number {
    const weights = { high: 3, medium: 2, low: 1 };
    return weights[priority];
  }

  /**
   * 获取面包屑导航
   */
  public generateBreadcrumbs(currentPath: string): Array<{ label: string; href: string }> {
    const breadcrumbs: Array<{ label: string; href: string }> = [];
    const pathSegments = currentPath.split('/').filter(Boolean);
    
    // 始终包含首页
    breadcrumbs.push({ label: '首页', href: '/' });
    
    let currentPathBuilder = '';
    pathSegments.forEach((segment, index) => {
      currentPathBuilder += '/' + segment;
      
      const route = this.findRouteByPath(currentPathBuilder);
      if (route) {
        breadcrumbs.push({
          label: route.title,
          href: currentPathBuilder
        });
      } else {
        // 处理动态路由段
        const label = this.formatDynamicSegment(segment);
        breadcrumbs.push({
          label,
          href: currentPathBuilder
        });
      }
    });
    
    return breadcrumbs;
  }

  /**
   * 格式化动态路由段
   */
  private formatDynamicSegment(segment: string): string {
    if (segment.match(/^[a-f0-9-]{36}$/)) {
      return '详情';
    }
    if (segment.match(/^\d+$/)) {
      return `项目 ${segment}`;
    }
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  }
}

// ==================== 默认导出 ====================

/** 全局页面导航服务实例 */
export const pageNavigationService = new PageNavigationService();

export default pageNavigationService;