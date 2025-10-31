/**
 * LaunchX 智链平台 v3 - 核心类型定义
 * 
 * 本文件包含了整个平台的核心类型定义，支持：
 * - 业务实体类型
 * - 组件接口类型  
 * - API 响应类型
 * - 状态管理类型
 */

// ========== 基础类型定义 ==========

/** 用户身份角色 */
export type UserRole = 'buyer' | 'vendor' | 'distributor' | 'guest';

/** AI 专家角色 */
export type AgentRole = 'alex' | 'sarah' | 'mike' | 'emma' | 'david' | 'catherine';

/** 产品类型 */
export type ProductType = 'workforce' | 'expert_module' | 'market_report';

/** 定价模型 */
export type PricingModel = 'subscription' | 'one_time' | 'usage_based' | 'freemium';

/** 链接状态 */
export type LinkStatus = 'active' | 'paused' | 'expired' | 'draft';

/** 消息类型 */
export type MessageType = 'user' | 'agent' | 'system' | 'error';

/** 消息状态 */
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

/** 协作阶段 */
export type CollaborationPhase = 'analysis' | 'design' | 'planning' | 'synthesis' | 'completed';

/** 排序选项 */
export type SortOption = 'relevance' | 'price_low' | 'price_high' | 'rating' | 'popularity' | 'newest' | 'trending';

// ========== 用户相关类型 ==========

/** 用户基本信息 */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  availableRoles: UserRole[];
  verified: boolean;
  company?: string;
  industry?: string;
  memberSince: Date;
  lastActive: Date;
  notifications: number;
  cartItems: number;
  favoriteItems: number;
  stats?: UserStats;
}

/** 用户统计数据 */
export interface UserStats {
  purchases?: number;
  revenue?: number;
  commission?: number;
  sales?: number;
}

/** 角色权限配置 */
export interface RoleCapabilities {
  canPurchase: boolean;
  canSell: boolean;
  canDistribute: boolean;
  canAccessAnalytics: boolean;
  canManageProducts: boolean;
  canEarnCommission: boolean;
  canAccessPremium: boolean;
  maxProducts?: number;
  commissionRate?: number;
  supportLevel: 'basic' | 'premium' | 'enterprise';
}

/** 角色统计数据 */
export interface RoleStats {
  buyer: {
    totalPurchases: number;
    activeSolutions: number;
    savedItems: number;
    totalSpent: number;
    avgRating: number;
  };
  vendor: {
    totalProducts: number;
    totalSales: number;
    activeCustomers: number;
    revenue: number;
    avgRating: number;
  };
  distributor: {
    totalReferrals: number;
    activeLinks: number;
    commission: number;
    conversionRate: number;
    topProducts: string[];
  };
}

/** 角色切换历史 */
export interface RoleSwitchHistory {
  id: string;
  fromRole: UserRole;
  toRole: UserRole;
  timestamp: Date;
  context: string;
  duration?: number;
}

// ========== 产品相关类型 ==========

/** 供应商信息 */
export interface VendorInfo {
  id: string;
  name: string;
  avatar?: string;
  verified: boolean;
  rating: number;
}

/** 定价信息 */
export interface PricingInfo {
  model: PricingModel;
  basePrice: number;
  currency: string;
  period?: string;
  tierName?: string;
  commissionRate?: number;
}

/** 产品指标 */
export interface ProductMetrics {
  rating: number;
  reviewCount: number;
  userCount: number;
  successRate?: number;
  responseTime?: string;
  uptime?: number;
}

/** 产品数据 */
export interface ProductData {
  id: string;
  name: string;
  description: string;
  type: ProductType;
  vendor: VendorInfo;
  pricing: PricingInfo;
  capabilities: string[];
  metrics: ProductMetrics;
  tags: string[];
  featured: boolean;
  trending: boolean;
  status: 'active' | 'beta' | 'coming_soon';
  lastUpdated: Date;
  thumbnail?: string;
  category: string;
  compatibility: string[];
}

// ========== AI 协作相关类型 ==========

/** AI 角色状态 */
export type AgentStatus = 'idle' | 'thinking' | 'active' | 'completed' | 'error';

/** AI 角色配置 */
export interface AgentRoleConfig {
  id: AgentRole;
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

/** 协作洞察 */
export interface CollaborationInsight {
  [agentId: string]: {
    analysis: string;
    recommendations: string[];
    confidence: number;
    dataPoints: Record<string, any>;
  };
}

/** 协作综合结果 */
export interface CollaborationSynthesis {
  summary: string;
  keyFindings: string[];
  recommendations: string[];
  nextSteps: string[];
  confidence: number;
}

/** 协作会话 */
export interface CollaborationSession {
  id: string;
  userQuery: string;
  phase: CollaborationPhase;
  agents: AgentRoleConfig[];
  insights: CollaborationInsight;
  synthesis?: CollaborationSynthesis;
  startTime: Date;
  estimatedDuration?: number;
  progress: number;
}

// ========== 聊天相关类型 ==========

/** 消息附件 */
export interface MessageAttachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'audio' | 'video';
  url: string;
  size: number;
  thumbnail?: string;
}

/** 消息反应 */
export interface MessageReaction {
  type: 'like' | 'dislike' | 'helpful' | 'bookmark';
  count: number;
  userReacted: boolean;
}

/** 消息元数据 */
export interface MessageMetadata {
  confidence?: number;
  processingTime?: number;
  suggestions?: string[];
  attachments?: MessageAttachment[];
  reactions?: MessageReaction[];
  relatedProducts?: string[];
}

/** 聊天消息 */
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
  metadata?: MessageMetadata;
  isTyping?: boolean;
  isHighlighted?: boolean;
}

/** 聊天会话参与者 */
export interface ChatParticipant {
  id: string;
  name: string;
  role: AgentRole;
  avatar?: string;
  status: 'online' | 'busy' | 'away' | 'offline';
}

/** 聊天会话上下文 */
export interface ChatContext {
  topic: string;
  requirements: string[];
  budget?: number;
  timeline?: string;
  industry?: string;
}

/** 聊天会话 */
export interface ChatSession {
  id: string;
  title: string;
  participants: ChatParticipant[];
  messages: ChatMessage[];
  context?: ChatContext;
  createdAt: Date;
  updatedAt: Date;
}

// ========== 搜索过滤相关类型 ==========

/** 搜索过滤器 */
export interface SearchFilters {
  query: string;
  types: ProductType[];
  categories: string[];
  pricingModels: PricingModel[];
  priceRange: [number, number];
  rating: number;
  verified: boolean;
  trending: boolean;
  featured: boolean;
  tags: string[];
  responseTime: number;
  successRate: number;
  sortBy: SortOption;
  sortOrder: 'asc' | 'desc';
}

/** 搜索统计 */
export interface SearchStats {
  totalResults: number;
  averagePrice: number;
  averageRating: number;
  topCategories: Array<{ name: string; count: number }>;
  priceDistribution: Array<{ range: string; count: number }>;
}

/** 搜索建议 */
export interface SearchSuggestion {
  query: string;
  type: 'recent' | 'trending' | 'related';
  count?: number;
}

// ========== 分销相关类型 ==========

/** 转化事件类型 */
export type ConversionEvent = 'click' | 'view' | 'signup' | 'purchase' | 'trial';

/** 分销链接 */
export interface DistributionLink {
  id: string;
  name: string;
  url: string;
  shortUrl: string;
  productId: string;
  productName: string;
  productType: ProductType;
  status: LinkStatus;
  createdAt: Date;
  expiresAt?: Date;
  commissionRate: number;
  baseCommission: number;
  bonusCommission?: number;
  clicks: number;
  conversions: number;
  revenue: number;
  commission: number;
  conversionRate: number;
  lastClickAt?: Date;
  customParams?: Record<string, string>;
  metadata?: {
    campaign?: string;
    source?: string;
    medium?: string;
    tags?: string[];
  };
}

/** 转化记录 */
export interface ConversionRecord {
  id: string;
  linkId: string;
  eventType: ConversionEvent;
  userId?: string;
  amount: number;
  commission: number;
  timestamp: Date;
  userInfo?: {
    country?: string;
    device?: string;
    referrer?: string;
  };
  productInfo: {
    id: string;
    name: string;
    type: string;
  };
}

/** 分销统计 */
export interface DistributionStats {
  totalLinks: number;
  activeLinks: number;
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  totalCommission: number;
  averageConversionRate: number;
  topPerformingLink?: DistributionLink;
  recentGrowth: {
    clicks: number;
    conversions: number;
    revenue: number;
    commission: number;
  };
  monthlyTrend: Array<{
    month: string;
    clicks: number;
    conversions: number;
    revenue: number;
    commission: number;
  }>;
}

/** 排行榜条目 */
export interface LeaderboardEntry {
  rank: number;
  distributorId: string;
  distributorName: string;
  avatar?: string;
  totalCommission: number;
  totalConversions: number;
  conversionRate: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  badge?: string;
}

// ========== 通知相关类型 ==========

/** 通知类型 */
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    href: string;
  };
}

// ========== API 响应类型 ==========

/** API 响应基础结构 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

/** 分页响应 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ========== 表单相关类型 ==========

/** 表单字段状态 */
export interface FormFieldState {
  value: any;
  error?: string;
  touched: boolean;
  loading?: boolean;
}

/** 表单状态 */
export interface FormState<T extends Record<string, any> = Record<string, any>> {
  fields: {
    [K in keyof T]: FormFieldState;
  };
  isValid: boolean;
  isSubmitting: boolean;
  submitCount: number;
}

// ========== 状态管理类型 ==========

/** 应用全局状态 */
export interface AppState {
  user: User | null;
  currentRole: UserRole;
  theme: 'light' | 'dark' | 'system';
  notifications: Notification[];
  loading: boolean;
  error?: string;
}

/** UI 状态 */
export interface UIState {
  sidebarOpen: boolean;
  searchQuery: string;
  activeFilters: SearchFilters;
  selectedProducts: string[];
  chatSessions: ChatSession[];
  collaborationSessions: CollaborationSession[];
}

// ========== 事件类型 ==========

/** 组件事件处理器 */
export interface ComponentEventHandlers {
  onRoleSwitch?: (role: UserRole) => void;
  onProductSelect?: (productId: string) => void;
  onFilterChange?: (filters: SearchFilters) => void;
  onMessageSend?: (message: string, attachments?: File[]) => void;
  onNotificationRead?: (notificationId: string) => void;
}

// ========== 配置类型 ==========

/** 应用配置 */
export interface AppConfig {
  apiUrl: string;
  wsUrl: string;
  cdnUrl: string;
  analytics: {
    trackingId: string;
    enabledEvents: string[];
  };
  features: {
    voiceChat: boolean;
    fileUpload: boolean;
    realtimeUpdates: boolean;
  };
  limits: {
    maxFileSize: number;
    maxMessageLength: number;
    maxProductsPerUser: number;
  };
}

/** 主题配置 */
export interface ThemeConfig {
  colors: Record<string, string>;
  fonts: Record<string, string>;
  spacing: Record<string, string>;
  breakpoints: Record<string, string>;
  animations: Record<string, any>;
}

// ========== 工具类型 ==========

/** 使用或类型创建联合类型 */
export type OneOf<T, K extends keyof T = keyof T> = K extends keyof T
  ? { [P in K]: T[P] } & { [P in Exclude<keyof T, K>]?: never }
  : never;

/** 深度可选类型 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/** 深度必需类型 */
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

/** 选择性必需类型 */
export type PartiallyRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;

/** 排除空值类型 */
export type NonNullable<T> = T extends null | undefined ? never : T;

// ========== 默认导出 ==========

export default {
  // 导出主要类型以便在其他地方使用
  User,
  ProductData,
  AgentRoleConfig,
  ChatMessage,
  DistributionLink,
  SearchFilters
} as const;