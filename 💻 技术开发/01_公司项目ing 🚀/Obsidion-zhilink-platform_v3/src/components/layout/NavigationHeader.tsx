"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

import {
  Menu,
  Search,
  Bell,
  ShoppingCart,
  Heart,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Store,
  ShoppingBag,
  Share2,
  Crown,
  Sparkles,
  Home,
  Package,
  BarChart3,
  Users,
  MessageSquare,
  HelpCircle,
  Zap,
  Globe,
  Moon,
  Sun,
  Star,
  Award,
  TrendingUp,
  ArrowRight,
  Activity,
  Calendar,
  DollarSign,
  Eye,
  Brain
} from 'lucide-react';

import { cn } from "@/lib/utils";

// 用户身份类型
export type UserRole = 'buyer' | 'vendor' | 'distributor' | 'guest';

// 导航项目配置
interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: string;
  roles?: UserRole[];
  external?: boolean;
}

// 用户信息
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  availableRoles: UserRole[];
  verified: boolean;
  notifications: number;
  cartItems: number;
  favoriteItems: number;
  stats?: {
    revenue?: number;
    sales?: number;
    commission?: number;
    purchases?: number;
  };
}

// 通知信息
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

// 组件属性
export interface NavigationHeaderProps {
  user?: User;
  notifications?: Notification[];
  onRoleSwitch?: (role: UserRole) => void;
  onThemeToggle?: () => void;
  onSignOut?: () => void;
  isDark?: boolean;
  className?: string;
}

// 身份配置
const roleConfig = {
  buyer: {
    name: '采购方',
    icon: ShoppingBag,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20'
  },
  vendor: {
    name: '供应商',
    icon: Store,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20'
  },
  distributor: {
    name: '分销商',
    icon: Share2,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20'
  },
  guest: {
    name: '访客',
    icon: User,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-900/20'
  }
};

// 主导航配置
const mainNavigation: NavItem[] = [
  {
    label: '首页',
    href: '/',
    icon: Home,
    roles: ['buyer', 'vendor', 'distributor', 'guest']
  },
  {
    label: 'AI市场',
    href: '/market',
    icon: Package,
    badge: 'Hot',
    roles: ['buyer', 'vendor', 'distributor', 'guest']
  },
  {
    label: 'S级演示',
    href: '/s-level-demo',
    icon: Star,
    badge: 'S级',
    roles: ['buyer', 'vendor', 'distributor', 'guest']
  },
  {
    label: '专家协作',
    href: '/collaboration',
    icon: Users,
    roles: ['buyer', 'vendor']
  },
  {
    label: '分析中心',
    href: '/analytics',
    icon: BarChart3,
    roles: ['vendor', 'distributor']
  },
  {
    label: '社区',
    href: '/community',
    icon: MessageSquare,
    roles: ['buyer', 'vendor', 'distributor']
  }
];

// 角色专用导航
const roleSpecificNavigation: Record<UserRole, NavItem[]> = {
  buyer: [
    { label: '我的需求', href: '/buyer/specs', icon: Search },
    { label: '购买记录', href: '/buyer/orders', icon: ShoppingCart },
    { label: '收藏夹', href: '/buyer/favorites', icon: Heart }
  ],
  vendor: [
    { label: '产品管理', href: '/vendor/products', icon: Package },
    { label: '销售数据', href: '/vendor/sales', icon: TrendingUp },
    { label: '客户管理', href: '/vendor/customers', icon: Users }
  ],
  distributor: [
    { label: '推广链接', href: '/distributor/links', icon: Share2 },
    { label: '佣金收入', href: '/distributor/earnings', icon: DollarSign },
    { label: '转化分析', href: '/distributor/analytics', icon: BarChart3 }
  ],
  guest: [
    { label: '注册', href: '/auth/register', icon: User },
    { label: '登录', href: '/auth/login', icon: LogOut }
  ]
};

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  user,
  notifications = [],
  onRoleSwitch,
  onThemeToggle,
  onSignOut,
  isDark = false,
  className
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // 计算未读通知数量
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  // 获取当前用户的角色配置
  const currentRoleConfig = user ? roleConfig[user.role] : roleConfig.guest;
  const CurrentRoleIcon = currentRoleConfig.icon;

  // 获取适合当前角色的导航项
  const getNavItemsForRole = (role: UserRole) => {
    return mainNavigation.filter(item => 
      !item.roles || item.roles.includes(role)
    );
  };

  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // 渲染用户头像菜单
  const renderUserMenu = () => {
    if (!user) {
      return (
        <div className="flex items-center gap-3">
          <Link href="/auth/login">
            <Button variant="outline" size="sm">登录</Button>
          </Link>
          <Link href="/auth/register">
            <Button size="sm">注册</Button>
          </Link>
        </div>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-12 w-12 rounded-full p-0">
            <Avatar className="h-10 w-10 border-2 border-border-primary">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-gradient-primary text-white">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {user.verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-status-success rounded-full flex items-center justify-center border-2 border-background-main">
                <Award className="w-3 h-3 text-white" />
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-80 p-0" align="end" forceMount>
          {/* 用户信息头部 */}
          <div className="p-4 bg-gradient-primary text-white">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-white/20">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-white/20 text-white">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm opacity-90">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className={cn(
                    "flex items-center gap-1 px-2 py-0.5 rounded text-xs",
                    "bg-white/20 backdrop-blur-sm"
                  )}>
                    <CurrentRoleIcon className="w-3 h-3" />
                    {currentRoleConfig.name}
                  </div>
                  {user.verified && (
                    <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                      已认证
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 角色切换 */}
          {user.availableRoles.length > 1 && (
            <>
              <div className="p-3">
                <p className="text-sm font-medium text-text-secondary mb-2">切换身份</p>
                <div className="grid grid-cols-2 gap-2">
                  {user.availableRoles.map(role => {
                    const config = roleConfig[role];
                    const IconComponent = config.icon;
                    const isActive = role === user.role;
                    
                    return (
                      <button
                        key={role}
                        onClick={() => onRoleSwitch?.(role)}
                        className={cn(
                          "flex items-center gap-2 p-2 rounded-lg text-sm transition-all",
                          "hover:bg-background-card",
                          isActive && "bg-gradient-primary text-white"
                        )}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span>{config.name}</span>
                        {isActive && <Crown className="w-3 h-3 ml-auto" />}
                      </button>
                    );
                  })}
                </div>
              </div>
              <DropdownMenuSeparator />
            </>
          )}

          {/* 角色专用统计 */}
          {user.stats && (
            <>
              <div className="p-3">
                <p className="text-sm font-medium text-text-secondary mb-2">数据概览</p>
                <div className="grid grid-cols-2 gap-3 text-center">
                  {user.role === 'vendor' && (
                    <>
                      <div className="p-2 bg-background-card rounded-lg">
                        <p className="text-lg font-bold text-text-primary">
                          ¥{user.stats.revenue?.toLocaleString() || 0}
                        </p>
                        <p className="text-xs text-text-secondary">总收益</p>
                      </div>
                      <div className="p-2 bg-background-card rounded-lg">
                        <p className="text-lg font-bold text-text-primary">
                          {user.stats.sales || 0}
                        </p>
                        <p className="text-xs text-text-secondary">销售量</p>
                      </div>
                    </>
                  )}
                  {user.role === 'distributor' && (
                    <>
                      <div className="p-2 bg-background-card rounded-lg">
                        <p className="text-lg font-bold text-text-primary">
                          ¥{user.stats.commission?.toLocaleString() || 0}
                        </p>
                        <p className="text-xs text-text-secondary">佣金</p>
                      </div>
                      <div className="p-2 bg-background-card rounded-lg">
                        <p className="text-lg font-bold text-text-primary">
                          {user.stats.sales || 0}
                        </p>
                        <p className="text-xs text-text-secondary">推广</p>
                      </div>
                    </>
                  )}
                  {user.role === 'buyer' && (
                    <>
                      <div className="p-2 bg-background-card rounded-lg">
                        <p className="text-lg font-bold text-text-primary">
                          {user.stats.purchases || 0}
                        </p>
                        <p className="text-xs text-text-secondary">购买</p>
                      </div>
                      <div className="p-2 bg-background-card rounded-lg">
                        <p className="text-lg font-bold text-text-primary">
                          {user.favoriteItems || 0}
                        </p>
                        <p className="text-xs text-text-secondary">收藏</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator />
            </>
          )}

          {/* 快捷操作 */}
          <div className="py-2">
            <DropdownMenuItem>
              <Link href="/profile" className="flex items-center gap-3 w-full">
                <User className="w-4 h-4" />
                个人资料
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/settings" className="flex items-center gap-3 w-full">
                <Settings className="w-4 h-4" />
                账户设置
              </Link>
            </DropdownMenuItem>
            {user.role !== 'guest' && (
              <>
                <DropdownMenuItem>
                  <Link href="/dashboard" className="flex items-center gap-3 w-full">
                    <BarChart3 className="w-4 h-4" />
                    数据仪表板
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </div>

          <DropdownMenuSeparator />

          {/* 主题切换和登出 */}
          <div className="py-2">
            <DropdownMenuItem onClick={onThemeToggle} className="flex items-center gap-3">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {isDark ? '浅色模式' : '深色模式'}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/help" className="flex items-center gap-3 w-full">
                <HelpCircle className="w-4 h-4" />
                帮助中心
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={onSignOut}
              className="flex items-center gap-3 text-status-error focus:text-status-error"
            >
              <LogOut className="w-4 h-4" />
              退出登录
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // 渲染通知菜单
  const renderNotificationsMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-80 p-0" align="end">
        <div className="p-4 border-b border-border-primary">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-text-primary">通知</h3>
            {unreadCount > 0 && (
              <Badge variant="outline" className="text-xs">
                {unreadCount} 条未读
              </Badge>
            )}
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.slice(0, 5).map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "p-4 border-b border-border-primary/50 hover:bg-background-card transition-colors cursor-pointer",
                  !notification.read && "bg-blue-50/50 dark:bg-blue-900/10"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full flex-shrink-0 mt-2",
                    notification.type === 'success' && "bg-status-success",
                    notification.type === 'warning' && "bg-status-warning",
                    notification.type === 'error' && "bg-status-error",
                    notification.type === 'info' && "bg-status-info"
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-text-primary">
                      {notification.title}
                    </p>
                    <p className="text-xs text-text-secondary mt-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-text-muted">
                        {notification.timestamp.toLocaleString()}
                      </span>
                      {notification.action && (
                        <Link href={notification.action.href}>
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="text-xs h-auto p-0"
                          >
                            {notification.action.label}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <Bell className="w-8 h-8 text-text-muted mx-auto mb-2" />
              <p className="text-sm text-text-secondary">暂无通知</p>
            </div>
          )}
        </div>

        {notifications.length > 5 && (
          <div className="p-3 border-t border-border-primary">
            <Link href="/notifications">
              <Button variant="ghost" size="sm" className="w-full">查看所有通知</Button>
            </Link>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <TooltipProvider>
      <header className={cn(
        "sticky top-0 z-50 w-full",
        "bg-background-glass/80 backdrop-blur-xl border-b border-border-primary",
        "supports-[backdrop-filter]:bg-background-glass/60",
        className
      )}>
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo区域 */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-2xl bg-gradient-primary flex items-center justify-center transition-transform group-hover:scale-105">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    LaunchX
                  </h1>
                  <p className="text-xs text-text-secondary -mt-1">智链平台</p>
                </div>
              </Link>

              {/* 主导航 - 桌面版 */}
              <nav className="hidden lg:flex items-center gap-1">
                {getNavItemsForRole(user?.role || 'guest').map((item) => {
                  const IconComponent = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <Tooltip key={item.href}>
                      <TooltipTrigger asChild>
                        <Link href={item.href} target={item.external ? '_blank' : undefined}>
                          <Button
                            variant={isActive ? "secondary" : "ghost"}
                            size="sm"
                            className={cn(
                              "flex items-center gap-2 h-10",
                              isActive && "bg-background-card"
                            )}
                          >
                            <IconComponent className="w-4 h-4" />
                            <span>{item.label}</span>
                            {item.badge && (
                              <Badge variant="secondary" className="text-xs ml-1 px-1.5 py-0.5">
                                {item.badge}
                              </Badge>
                            )}
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{item.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </nav>
            </div>

            {/* 中间搜索区域 */}
            <div className="flex-1 max-w-xl mx-8">
              <form onSubmit={handleSearch} className="relative">
                <div className={cn(
                  "relative flex items-center transition-all duration-200",
                  isSearchFocused && "scale-105"
                )}>
                  <Search className="absolute left-3 w-4 h-4 text-text-secondary" />
                  <Input
                    type="search"
                    placeholder="搜索AI解决方案..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className={cn(
                      "pl-10 pr-4 h-10 bg-background-glass backdrop-blur-sm",
                      "border-border-primary focus:border-cloudsway-primary-500",
                      "transition-all duration-200"
                    )}
                  />
                  {searchQuery && (
                    <Button
                      type="submit"
                      size="icon"
                      className="absolute right-1 h-8 w-8"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </form>
            </div>

            {/* 右侧操作区域 */}
            <div className="flex items-center gap-2">
              {/* 快捷操作按钮 */}
              {user && (
                <div className="hidden md:flex items-center gap-1">
                  {/* 购物车 */}
                  {user.role === 'buyer' && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href="/cart">
                          <Button variant="ghost" size="icon" className="relative">
                            <ShoppingCart className="w-5 h-5" />
                            {user.cartItems > 0 && (
                              <Badge 
                                variant="destructive" 
                                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                              >
                                {user.cartItems}
                              </Badge>
                            )}
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>购物车 ({user.cartItems})</p>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  {/* 收藏夹 */}
                  {user.role !== 'guest' && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href="/favorites">
                          <Button variant="ghost" size="icon" className="relative">
                            <Heart className="w-5 h-5" />
                            {user.favoriteItems > 0 && (
                              <Badge 
                                variant="outline" 
                                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                              >
                                {user.favoriteItems}
                              </Badge>
                            )}
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>收藏夹 ({user.favoriteItems})</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              )}

              {/* 通知 */}
              {user && renderNotificationsMenu()}

              {/* 用户菜单 */}
              {renderUserMenu()}

              {/* 移动端菜单 */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0">
                  <SheetHeader className="p-6 bg-gradient-primary text-white">
                    <SheetTitle className="text-white">导航菜单</SheetTitle>
                    {user && (
                      <div className="flex items-center gap-3 mt-4">
                        <Avatar className="h-10 w-10 border-2 border-white/20">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-white/20 text-white">
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="font-semibold">{user.name}</p>
                          <div className="flex items-center gap-1 text-sm opacity-90">
                            <CurrentRoleIcon className="w-3 h-3" />
                            {currentRoleConfig.name}
                          </div>
                        </div>
                      </div>
                    )}
                  </SheetHeader>

                  <div className="flex-1 overflow-y-auto">
                    {/* 主导航 */}
                    <div className="p-4 space-y-2">
                      <h3 className="text-sm font-semibold text-text-secondary mb-3">
                        主导航
                      </h3>
                      {getNavItemsForRole(user?.role || 'guest').map((item) => {
                        const IconComponent = item.icon;
                        const isActive = pathname === item.href;
                        
                        return (
                          <Link key={item.href} href={item.href}>
                            <Button
                              variant={isActive ? "secondary" : "ghost"}
                              size="sm"
                              className="w-full justify-start gap-3"
                            >
                              <IconComponent className="w-4 h-4" />
                              <span>{item.label}</span>
                              {item.badge && (
                                <Badge variant="secondary" className="ml-auto text-xs">
                                  {item.badge}
                                </Badge>
                              )}
                            </Button>
                          </Link>
                        );
                      })}
                    </div>

                    {/* 角色专用导航 */}
                    {user && roleSpecificNavigation[user.role].length > 0 && (
                      <div className="p-4 space-y-2 border-t border-border-primary">
                        <h3 className="text-sm font-semibold text-text-secondary mb-3">
                          {currentRoleConfig.name}专区
                        </h3>
                        {roleSpecificNavigation[user.role].map((item) => {
                          const IconComponent = item.icon;
                          const isActive = pathname === item.href;
                          
                          return (
                            <Link key={item.href} href={item.href}>
                              <Button
                                variant={isActive ? "secondary" : "ghost"}
                                size="sm"
                                className="w-full justify-start gap-3"
                              >
                                <IconComponent className="w-4 h-4" />
                                <span>{item.label}</span>
                              </Button>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* 角色切换进度条 */}
        <AnimatePresence>
          {user && user.availableRoles.length > 1 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-border-primary bg-background-glass/50"
            >
              <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                <div className="flex items-center justify-center gap-4">
                  <span className="text-xs text-text-secondary">身份切换:</span>
                  <div className="flex items-center gap-2">
                    {user.availableRoles.map((role) => {
                      const config = roleConfig[role];
                      const IconComponent = config.icon;
                      const isActive = role === user.role;
                      
                      return (
                        <button
                          key={role}
                          onClick={() => onRoleSwitch?.(role)}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all",
                            "hover:bg-background-card border",
                            isActive 
                              ? "bg-gradient-primary text-white border-cloudsway-primary-500" 
                              : "bg-transparent text-text-secondary border-border-primary hover:border-border-accent"
                          )}
                        >
                          <IconComponent className="w-3 h-3" />
                          <span>{config.name}</span>
                          {isActive && <Crown className="w-3 h-3" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </TooltipProvider>
  );
};

export default NavigationHeader;