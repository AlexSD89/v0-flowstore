"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import {
  User,
  ShoppingBag,
  Store,
  Share2,
  Crown,
  TrendingUp,
  DollarSign,
  Users,
  Package,
  BarChart3,
  Settings,
  Shield,
  Award,
  Target,
  Zap,
  Heart,
  Star,
  Eye,
  ArrowRight,
  ChevronDown,
  Activity,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Globe
} from 'lucide-react';

import { cn } from "@/lib/utils";

// 用户身份类型
export type UserRole = 'buyer' | 'vendor' | 'distributor' | 'guest';

// 身份权限和能力
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

// 用户数据
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  currentRole: UserRole;
  availableRoles: UserRole[];
  company?: string;
  industry?: string;
  verified: boolean;
  memberSince: Date;
  lastActive: Date;
}

// 身份统计数据
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

// 身份切换历史
export interface RoleSwitchHistory {
  id: string;
  fromRole: UserRole;
  toRole: UserRole;
  timestamp: Date;
  context: string;
  duration?: number;
}

// 组件属性
export interface IdentityManagerProps {
  user: UserProfile;
  roleStats: RoleStats;
  roleCapabilities: Record<UserRole, RoleCapabilities>;
  switchHistory?: RoleSwitchHistory[];
  onRoleSwitch?: (newRole: UserRole) => void;
  onRoleActivation?: (role: UserRole, activate: boolean) => void;
  onUpgrade?: (targetRole: UserRole) => void;
  className?: string;
  showHistory?: boolean;
  showStats?: boolean;
}

// 身份配置
const roleConfig = {
  buyer: {
    name: '采购方',
    description: '发现和采购AI解决方案',
    icon: ShoppingBag,
    color: 'from-blue-500 to-cyan-500',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    features: [
      '浏览AI解决方案市场',
      '获取个性化推荐',
      '6角色智能需求分析',
      '一站式采购管理',
      '专业技术支持'
    ]
  },
  vendor: {
    name: '供应商',
    description: '提供AI产品和服务',
    icon: Store,
    color: 'from-purple-500 to-pink-500',
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
    features: [
      '发布AI产品和服务',
      '管理销售渠道',
      '客户关系管理',
      '收益分析仪表板',
      '品牌推广支持'
    ]
  },
  distributor: {
    name: '分销商',
    description: '推广产品获得佣金',
    icon: Share2,
    color: 'from-emerald-500 to-teal-500',
    textColor: 'text-emerald-600',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    features: [
      '智能推广链接生成',
      '多层级佣金体系',
      '实时转化数据追踪',
      '专属推广素材',
      '个人品牌建设'
    ]
  },
  guest: {
    name: '访客',
    description: '体验平台基础功能',
    icon: User,
    color: 'from-gray-500 to-slate-500',
    textColor: 'text-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-900/20',
    borderColor: 'border-gray-200 dark:border-gray-800',
    features: [
      '浏览公开内容',
      '基础AI工具体验',
      '社区讨论参与',
      '免费资源下载'
    ]
  }
};

export const IdentityManager: React.FC<IdentityManagerProps> = ({
  user,
  roleStats,
  roleCapabilities,
  switchHistory = [],
  onRoleSwitch,
  onRoleActivation,
  onUpgrade,
  className,
  showHistory = true,
  showStats = true
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.currentRole);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentRoleConfig = roleConfig[user.currentRole];
  const currentCapabilities = roleCapabilities[user.currentRole];

  // 处理身份切换
  const handleRoleSwitch = async (newRole: UserRole) => {
    if (newRole === user.currentRole || isAnimating) return;
    
    setIsAnimating(true);
    setSelectedRole(newRole);
    
    // 模拟切换动画
    setTimeout(() => {
      onRoleSwitch?.(newRole);
      setIsAnimating(false);
    }, 800);
  };

  // 渲染单个身份卡片
  const renderRoleCard = (role: UserRole, isActive: boolean = false, isAvailable: boolean = true) => {
    const config = roleConfig[role];
    const capabilities = roleCapabilities[role];
    const IconComponent = config.icon;
    const stats = roleStats[role as keyof typeof roleStats];

    return (
      <motion.div
        key={role}
        whileHover={isAvailable ? { scale: 1.02, y: -4 } : {}}
        whileTap={isAvailable ? { scale: 0.98 } : {}}
        onClick={() => isAvailable && handleRoleSwitch(role)}
        className={cn(
          "cursor-pointer transition-all duration-300",
          !isAvailable && "cursor-not-allowed opacity-60"
        )}
      >
        <Card className={cn(
          "h-full overflow-hidden transition-all duration-500",
          "border-border-primary bg-background-glass backdrop-blur-xl",
          isActive && "ring-2 ring-cloudsway-primary-500 shadow-glow-primary",
          isAvailable && !isActive && "hover:border-border-accent hover:shadow-lg",
          !isAvailable && "border-dashed"
        )}>
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center text-white",
                  `bg-gradient-to-br ${config.color}`
                )}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary text-lg">
                    {config.name}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {config.description}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                {isActive && (
                  <Badge variant="default" className="bg-gradient-primary text-white">
                    <Crown className="w-3 h-3 mr-1" />
                    当前身份
                  </Badge>
                )}
                {!isAvailable && (
                  <Badge variant="outline" className="border-status-warning text-status-warning">
                    需要激活
                  </Badge>
                )}
                {user.verified && (
                  <CheckCircle2 className="w-5 h-5 text-status-success" />
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* 核心功能列表 */}
            <div className="space-y-2">
              <h4 className="font-medium text-text-primary text-sm">核心功能</h4>
              <ul className="space-y-1.5">
                {config.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div 
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2"
                      style={{
                        background: config.color.includes('blue') ? '#3b82f6' :
                                   config.color.includes('purple') ? '#8b5cf6' :
                                   config.color.includes('emerald') ? '#10b981' : '#6b7280'
                      }}
                    />
                    <span className="text-text-secondary">{feature}</span>
                  </li>
                ))}
                {config.features.length > 3 && (
                  <li className="text-sm text-text-muted">
                    +{config.features.length - 3} 更多功能...
                  </li>
                )}
              </ul>
            </div>

            {/* 关键指标 */}
            {stats && isAvailable && (
              <div className="space-y-3">
                <Separator />
                <div className="grid grid-cols-2 gap-3 text-center">
                  {role === 'buyer' && (
                    <>
                      <div className="space-y-1">
                        <p className="text-lg font-bold text-text-primary">
                          {stats.totalPurchases || 0}
                        </p>
                        <p className="text-xs text-text-secondary">总购买</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-bold text-text-primary">
                          ¥{(stats.totalSpent || 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-text-secondary">总消费</p>
                      </div>
                    </>
                  )}
                  
                  {role === 'vendor' && (
                    <>
                      <div className="space-y-1">
                        <p className="text-lg font-bold text-text-primary">
                          {stats.totalProducts || 0}
                        </p>
                        <p className="text-xs text-text-secondary">产品数</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-bold text-text-primary">
                          ¥{(stats.revenue || 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-text-secondary">总收益</p>
                      </div>
                    </>
                  )}
                  
                  {role === 'distributor' && (
                    <>
                      <div className="space-y-1">
                        <p className="text-lg font-bold text-text-primary">
                          {stats.totalReferrals || 0}
                        </p>
                        <p className="text-xs text-text-secondary">推广数</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-bold text-text-primary">
                          ¥{(stats.commission || 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-text-secondary">佣金收入</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* 权限列表 */}
            <div className="space-y-2">
              <h4 className="font-medium text-text-primary text-sm">权限等级</h4>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">支持等级</span>
                  <Badge variant="outline" className="text-xs capitalize">
                    {capabilities.supportLevel}
                  </Badge>
                </div>
                {capabilities.commissionRate && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">佣金比例</span>
                    <span className="font-medium text-emerald-600">
                      {capabilities.commissionRate}%
                    </span>
                  </div>
                )}
                {capabilities.maxProducts && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">产品上限</span>
                    <span className="font-medium text-text-primary">
                      {capabilities.maxProducts}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 激活/升级按钮 */}
            {!isActive && (
              <div className="pt-2">
                {isAvailable ? (
                  <Button 
                    onClick={() => handleRoleSwitch(role)}
                    className="w-full"
                    variant="outline"
                    disabled={isAnimating}
                  >
                    {isAnimating && selectedRole === role ? (
                      <>
                        <Activity className="w-4 h-4 mr-2 animate-pulse" />
                        切换中...
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-4 h-4 mr-2" />
                        切换到{config.name}
                      </>
                    )}
                  </Button>
                ) : (
                  <Button 
                    onClick={() => onUpgrade?.(role)}
                    className="w-full"
                    variant="default"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    激活{config.name}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <TooltipProvider>
      <div className={cn("space-y-6", className)}>
        {/* 当前身份概览 */}
        <Card className="border-border-primary bg-background-glass backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-cloudsway-primary-500">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-xl bg-gradient-primary text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">
                    {user.name}
                  </h2>
                  <div className="flex items-center gap-3 text-sm text-text-secondary">
                    <span>{user.email}</span>
                    {user.company && (
                      <>
                        <Separator orientation="vertical" className="h-4" />
                        <span>{user.company}</span>
                      </>
                    )}
                    {user.verified && (
                      <>
                        <Separator orientation="vertical" className="h-4" />
                        <div className="flex items-center gap-1 text-status-success">
                          <Shield className="w-4 h-4" />
                          <span>已认证</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium",
                  currentRoleConfig.bgColor,
                  currentRoleConfig.textColor,
                  currentRoleConfig.borderColor,
                  "border"
                )}>
                  <currentRoleConfig.icon className="w-4 h-4" />
                  {currentRoleConfig.name}
                </div>
                <p className="text-xs text-text-secondary mt-1">
                  当前身份
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 账户信息 */}
              <div className="space-y-3">
                <h3 className="font-semibold text-text-primary">账户信息</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-text-secondary" />
                    <span className="text-text-secondary">注册时间:</span>
                    <span className="text-text-primary">
                      {user.memberSince.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-text-secondary" />
                    <span className="text-text-secondary">最后活跃:</span>
                    <span className="text-text-primary">
                      {user.lastActive.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-text-secondary" />
                    <span className="text-text-secondary">行业:</span>
                    <span className="text-text-primary">
                      {user.industry || '未设置'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 可用身份 */}
              <div className="space-y-3">
                <h3 className="font-semibold text-text-primary">可用身份</h3>
                <div className="flex flex-wrap gap-2">
                  {user.availableRoles.map(role => {
                    const config = roleConfig[role];
                    const IconComponent = config.icon;
                    return (
                      <Badge 
                        key={role}
                        variant={role === user.currentRole ? "default" : "outline"}
                        className={cn(
                          "flex items-center gap-1 px-3 py-1",
                          role === user.currentRole && "bg-gradient-primary text-white"
                        )}
                      >
                        <IconComponent className="w-3 h-3" />
                        {config.name}
                      </Badge>
                    );
                  })}
                </div>
                <p className="text-xs text-text-secondary">
                  共 {user.availableRoles.length} 个身份可用
                </p>
              </div>

              {/* 当前权限 */}
              <div className="space-y-3">
                <h3 className="font-semibold text-text-primary">当前权限</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">购买权限</span>
                    <div className="flex items-center gap-1">
                      {currentCapabilities.canPurchase ? (
                        <CheckCircle2 className="w-4 h-4 text-status-success" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-status-warning" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">销售权限</span>
                    <div className="flex items-center gap-1">
                      {currentCapabilities.canSell ? (
                        <CheckCircle2 className="w-4 h-4 text-status-success" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-status-warning" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">分销权限</span>
                    <div className="flex items-center gap-1">
                      {currentCapabilities.canDistribute ? (
                        <CheckCircle2 className="w-4 h-4 text-status-success" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-status-warning" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 身份切换选项 */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-primary">
              身份管理
            </h2>
            <Select value={selectedRole} onValueChange={(value) => handleRoleSwitch(value as UserRole)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="快速切换身份" />
              </SelectTrigger>
              <SelectContent>
                {user.availableRoles.map(role => {
                  const config = roleConfig[role];
                  const IconComponent = config.icon;
                  return (
                    <SelectItem key={role} value={role}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        {config.name}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {(Object.keys(roleConfig) as UserRole[]).map(role => 
              renderRoleCard(
                role, 
                role === user.currentRole,
                user.availableRoles.includes(role)
              )
            )}
          </div>
        </div>

        {/* 详细统计和历史 */}
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-background-glass backdrop-blur-xl">
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              统计分析
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              切换历史
            </TabsTrigger>
          </TabsList>

          {showStats && (
            <TabsContent value="stats" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {user.availableRoles
                  .filter(role => role !== 'guest')
                  .map(role => {
                    const config = roleConfig[role];
                    const stats = roleStats[role as keyof typeof roleStats];
                    const IconComponent = config.icon;

                    return (
                      <Card key={role} className="border-border-primary bg-background-glass backdrop-blur-xl">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center text-white",
                              `bg-gradient-to-br ${config.color}`
                            )}>
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-text-primary">
                                {config.name}统计
                              </h3>
                              <p className="text-sm text-text-secondary">
                                身份表现数据
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {stats && (
                            <div className="grid grid-cols-2 gap-4 text-center">
                              {role === 'buyer' && (
                                <>
                                  <div>
                                    <p className="text-2xl font-bold text-text-primary">
                                      {stats.totalPurchases}
                                    </p>
                                    <p className="text-xs text-text-secondary">总购买数</p>
                                  </div>
                                  <div>
                                    <p className="text-2xl font-bold text-text-primary">
                                      {stats.activeSolutions}
                                    </p>
                                    <p className="text-xs text-text-secondary">活跃方案</p>
                                  </div>
                                  <div>
                                    <p className="text-2xl font-bold text-text-primary">
                                      ¥{stats.totalSpent.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-text-secondary">累计消费</p>
                                  </div>
                                  <div>
                                    <div className="flex items-center justify-center gap-1">
                                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                      <span className="text-lg font-bold text-text-primary">
                                        {stats.avgRating.toFixed(1)}
                                      </span>
                                    </div>
                                    <p className="text-xs text-text-secondary">平均评分</p>
                                  </div>
                                </>
                              )}
                              
                              {role === 'vendor' && (
                                <>
                                  <div>
                                    <p className="text-2xl font-bold text-text-primary">
                                      {stats.totalProducts}
                                    </p>
                                    <p className="text-xs text-text-secondary">产品总数</p>
                                  </div>
                                  <div>
                                    <p className="text-2xl font-bold text-text-primary">
                                      {stats.totalSales}
                                    </p>
                                    <p className="text-xs text-text-secondary">销售次数</p>
                                  </div>
                                  <div>
                                    <p className="text-2xl font-bold text-text-primary">
                                      ¥{stats.revenue.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-text-secondary">总收益</p>
                                  </div>
                                  <div>
                                    <div className="flex items-center justify-center gap-1">
                                      <Users className="w-4 h-4 text-blue-500" />
                                      <span className="text-lg font-bold text-text-primary">
                                        {stats.activeCustomers}
                                      </span>
                                    </div>
                                    <p className="text-xs text-text-secondary">活跃客户</p>
                                  </div>
                                </>
                              )}
                              
                              {role === 'distributor' && (
                                <>
                                  <div>
                                    <p className="text-2xl font-bold text-text-primary">
                                      {stats.totalReferrals}
                                    </p>
                                    <p className="text-xs text-text-secondary">推广总数</p>
                                  </div>
                                  <div>
                                    <p className="text-2xl font-bold text-text-primary">
                                      {stats.activeLinks}
                                    </p>
                                    <p className="text-xs text-text-secondary">活跃链接</p>
                                  </div>
                                  <div>
                                    <p className="text-2xl font-bold text-text-primary">
                                      ¥{stats.commission.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-text-secondary">佣金收入</p>
                                  </div>
                                  <div>
                                    <p className="text-2xl font-bold text-text-primary">
                                      {Math.round(stats.conversionRate * 100)}%
                                    </p>
                                    <p className="text-xs text-text-secondary">转化率</p>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </TabsContent>
          )}

          {showHistory && switchHistory.length > 0 && (
            <TabsContent value="history" className="space-y-4">
              <Card className="border-border-primary bg-background-glass backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    身份切换历史
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {switchHistory.slice(0, 10).map((record) => {
                      const fromConfig = roleConfig[record.fromRole];
                      const toConfig = roleConfig[record.toRole];
                      const FromIcon = fromConfig.icon;
                      const ToIcon = toConfig.icon;

                      return (
                        <div 
                          key={record.id}
                          className="flex items-center gap-4 p-4 rounded-xl bg-background-card border border-border-primary"
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs",
                              `bg-gradient-to-br ${fromConfig.color}`
                            )}>
                              <FromIcon className="w-4 h-4" />
                            </div>
                            <ArrowRight className="w-4 h-4 text-text-secondary" />
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs",
                              `bg-gradient-to-br ${toConfig.color}`
                            )}>
                              <ToIcon className="w-4 h-4" />
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <p className="font-medium text-text-primary text-sm">
                              {fromConfig.name} → {toConfig.name}
                            </p>
                            <p className="text-xs text-text-secondary">
                              {record.context}
                            </p>
                          </div>
                          
                          <div className="text-right text-xs text-text-secondary">
                            <p>{record.timestamp.toLocaleString()}</p>
                            {record.duration && (
                              <p>持续 {Math.round(record.duration / 60)} 分钟</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </TooltipProvider>
  );
};

export default IdentityManager;