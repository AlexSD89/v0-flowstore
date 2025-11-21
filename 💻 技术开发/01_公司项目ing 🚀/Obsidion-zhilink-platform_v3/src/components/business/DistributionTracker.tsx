"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Share2,
  Eye,
  Clock,
  Calendar,
  Target,
  Award,
  Star,
  Copy,
  ExternalLink,
  Download,
  RefreshCw,
  Filter,
  Search,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Globe,
  Link2,
  MousePointer,
  ShoppingCart,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Gift,
  Crown,
  Sparkles
} from 'lucide-react';

import { cn } from "@/lib/utils";

// 分销链接状态
export type LinkStatus = 'active' | 'paused' | 'expired' | 'draft';

// 转化事件类型
export type ConversionEvent = 'click' | 'view' | 'signup' | 'purchase' | 'trial';

// 分销链接数据
export interface DistributionLink {
  id: string;
  name: string;
  url: string;
  shortUrl: string;
  productId: string;
  productName: string;
  productType: 'workforce' | 'expert_module' | 'market_report';
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

// 转化记录
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

// 统计数据
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

// 排行榜数据
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

// 组件属性
export interface DistributionTrackerProps {
  distributorId: string;
  links: DistributionLink[];
  conversions: ConversionRecord[];
  stats: DistributionStats;
  leaderboard?: LeaderboardEntry[];
  onCreateLink?: (productId: string, config: Partial<DistributionLink>) => void;
  onUpdateLink?: (linkId: string, updates: Partial<DistributionLink>) => void;
  onDeleteLink?: (linkId: string) => void;
  onCopyLink?: (url: string) => void;
  onWithdraw?: (amount: number) => void;
  className?: string;
}

// 等级配置
const tierConfig = {
  bronze: { name: '青铜', color: 'text-amber-600', bgColor: 'bg-amber-50 dark:bg-amber-900/20', icon: Award },
  silver: { name: '白银', color: 'text-gray-600', bgColor: 'bg-gray-50 dark:bg-gray-900/20', icon: Award },
  gold: { name: '黄金', color: 'text-yellow-600', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20', icon: Crown },
  platinum: { name: '铂金', color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-900/20', icon: Crown },
  diamond: { name: '钻石', color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20', icon: Sparkles }
};

// 产品类型配置
const productTypeConfig = {
  workforce: { name: 'AI劳动力', color: 'text-blue-600', icon: Zap },
  expert_module: { name: '专家模块', color: 'text-purple-600', icon: Target },
  market_report: { name: '市场报告', color: 'text-emerald-600', icon: BarChart3 }
};

export const DistributionTracker: React.FC<DistributionTrackerProps> = ({
  distributorId,
  links,
  conversions,
  stats,
  leaderboard = [],
  onCreateLink,
  onUpdateLink,
  onDeleteLink,
  onCopyLink,
  onWithdraw,
  className
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [filterStatus, setFilterStatus] = useState<LinkStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'clicks' | 'conversions' | 'commission' | 'conversionRate'>('commission');

  // 过滤和排序链接
  const filteredLinks = useMemo(() => {
    let filtered = links.filter(link => {
      const matchesSearch = link.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           link.productName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || link.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'clicks':
          return b.clicks - a.clicks;
        case 'conversions':
          return b.conversions - a.conversions;
        case 'commission':
          return b.commission - a.commission;
        case 'conversionRate':
          return b.conversionRate - a.conversionRate;
        default:
          return 0;
      }
    });
  }, [links, searchQuery, filterStatus, sortBy]);

  // 计算当前用户排名
  const currentUserRank = useMemo(() => {
    return leaderboard.find(entry => entry.distributorId === distributorId)?.rank || 0;
  }, [leaderboard, distributorId]);

  // 渲染统计卡片
  const renderStatCard = (
    title: string,
    value: string | number,
    icon: React.ComponentType<any>,
    change?: number,
    format?: 'currency' | 'percentage' | 'number'
  ) => {
    const IconComponent = icon;
    const isPositive = change && change > 0;
    const isNegative = change && change < 0;

    return (
      <Card className="border-border-primary bg-background-glass backdrop-blur-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">{title}</p>
              <p className="text-2xl font-bold text-text-primary mt-1">
                {format === 'currency' && '¥'}
                {typeof value === 'number' ? value.toLocaleString() : value}
                {format === 'percentage' && '%'}
              </p>
              {change !== undefined && (
                <div className={cn(
                  "flex items-center gap-1 mt-2 text-sm",
                  isPositive && "text-status-success",
                  isNegative && "text-status-error",
                  change === 0 && "text-text-secondary"
                )}>
                  {isPositive && <ArrowUpRight className="w-4 h-4" />}
                  {isNegative && <ArrowDownRight className="w-4 h-4" />}
                  <span>
                    {change > 0 && '+'}
                    {change}% vs 上期
                  </span>
                </div>
              )}
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center">
              <IconComponent className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 渲染分销链接卡片
  const renderLinkCard = (link: DistributionLink) => {
    const statusConfig = {
      active: { color: 'text-status-success', bg: 'bg-green-50 dark:bg-green-900/20', label: '活跃' },
      paused: { color: 'text-status-warning', bg: 'bg-yellow-50 dark:bg-yellow-900/20', label: '暂停' },
      expired: { color: 'text-status-error', bg: 'bg-red-50 dark:bg-red-900/20', label: '过期' },
      draft: { color: 'text-text-muted', bg: 'bg-gray-50 dark:bg-gray-900/20', label: '草稿' }
    };

    const status = statusConfig[link.status];
    const productType = productTypeConfig[link.productType];
    const ProductIcon = productType.icon;

    return (
      <Card key={link.id} className="border-border-primary bg-background-glass backdrop-blur-xl hover:border-border-accent transition-colors">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center",
                productType.color.replace('text-', 'bg-').replace('600', '100'),
                "dark:bg-opacity-20"
              )}>
                <ProductIcon className={cn("w-6 h-6", productType.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-text-primary truncate">{link.name}</h3>
                <p className="text-sm text-text-secondary truncate">{link.productName}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className={cn("text-xs", status.color)}>
                    {status.label}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {productType.name}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {link.commissionRate}% 佣金
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onCopyLink?.(link.shortUrl)}
              className="flex-shrink-0"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          {/* 关键指标 */}
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-text-primary">{link.clicks}</p>
              <p className="text-xs text-text-secondary">点击</p>
            </div>
            <div>
              <p className="text-lg font-bold text-text-primary">{link.conversions}</p>
              <p className="text-xs text-text-secondary">转化</p>
            </div>
            <div>
              <p className="text-lg font-bold text-text-primary">
                {(link.conversionRate * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-text-secondary">转化率</p>
            </div>
            <div>
              <p className="text-lg font-bold text-emerald-600">
                ¥{link.commission.toLocaleString()}
              </p>
              <p className="text-xs text-text-secondary">佣金</p>
            </div>
          </div>

          {/* 转化率进度条 */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">转化进度</span>
              <span className="text-text-primary">{(link.conversionRate * 100).toFixed(1)}%</span>
            </div>
            <Progress value={link.conversionRate * 100} className="h-2" />
          </div>

          {/* 链接信息 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Link2 className="w-4 h-4 text-text-secondary" />
              <code className="flex-1 bg-background-card px-2 py-1 rounded text-xs truncate">
                {link.shortUrl}
              </code>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => window.open(link.shortUrl, '_blank')}
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
            {link.lastClickAt && (
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Clock className="w-4 h-4" />
                <span>最后点击: {link.lastClickAt.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-2 pt-2 border-t border-border-primary">
            <Button variant="outline" size="sm" className="flex-1">
              <Eye className="w-4 h-4 mr-2" />
              详情
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <BarChart3 className="w-4 h-4 mr-2" />
              分析
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <TooltipProvider>
      <div className={cn("space-y-6", className)}>
        {/* 顶部统计概览 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {renderStatCard(
            "总佣金收入",
            stats.totalCommission,
            DollarSign,
            stats.recentGrowth.commission,
            'currency'
          )}
          {renderStatCard(
            "总点击量",
            stats.totalClicks,
            MousePointer,
            stats.recentGrowth.clicks,
            'number'
          )}
          {renderStatCard(
            "总转化数",
            stats.totalConversions,
            ShoppingCart,
            stats.recentGrowth.conversions,
            'number'
          )}
          {renderStatCard(
            "平均转化率",
            (stats.averageConversionRate * 100).toFixed(1),
            Target,
            undefined,
            'percentage'
          )}
        </div>

        {/* 排行榜和快速操作 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 个人排名卡片 */}
          <Card className="border-border-primary bg-background-glass backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                我的排名
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold">
                  #{currentUserRank || '—'}
                </div>
                <p className="mt-2 font-semibold text-text-primary">
                  {currentUserRank ? `第 ${currentUserRank} 名` : '未上榜'}
                </p>
                <p className="text-sm text-text-secondary">本月排名</p>
              </div>
              
              {leaderboard.slice(0, 3).map((entry) => (
                <div key={entry.distributorId} className="flex items-center gap-3 p-2 rounded-lg bg-background-card">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-bold">
                    {entry.rank}
                  </div>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={entry.avatar} />
                    <AvatarFallback className="text-xs">
                      {entry.distributorName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-text-primary truncate">
                      {entry.distributorName}
                    </p>
                    <p className="text-xs text-text-secondary">
                      ¥{entry.totalCommission.toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="outline" className={cn("text-xs", tierConfig[entry.tier].color)}>
                    {tierConfig[entry.tier].name}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 快速操作 */}
          <Card className="border-border-primary bg-background-glass backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                快速操作
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                创建新链接
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                导出数据
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <DollarSign className="w-4 h-4 mr-2" />
                提现佣金
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                查看分析
              </Button>
            </CardContent>
          </Card>

          {/* 最佳表现链接 */}
          {stats.topPerformingLink && (
            <Card className="border-border-primary bg-background-glass backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  最佳表现
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <h3 className="font-semibold text-text-primary">
                    {stats.topPerformingLink.name}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {stats.topPerformingLink.productName}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-text-primary">
                      {stats.topPerformingLink.conversions}
                    </p>
                    <p className="text-xs text-text-secondary">转化</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-emerald-600">
                      ¥{stats.topPerformingLink.commission.toLocaleString()}
                    </p>
                    <p className="text-xs text-text-secondary">佣金</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">转化率</span>
                    <span className="text-text-primary">
                      {(stats.topPerformingLink.conversionRate * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={stats.topPerformingLink.conversionRate * 100} className="h-2" />
                </div>
                
                <Button variant="outline" size="sm" className="w-full">
                  查看详情
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 主要内容区域 */}
        <Tabs defaultValue="links" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-background-glass backdrop-blur-xl">
            <TabsTrigger value="links" className="flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              分销链接
            </TabsTrigger>
            <TabsTrigger value="conversions" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              转化记录
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              数据分析
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              排行榜
            </TabsTrigger>
          </TabsList>

          {/* 分销链接列表 */}
          <TabsContent value="links" className="space-y-6">
            {/* 过滤和搜索 */}
            <Card className="border-border-primary bg-background-glass backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
                    <Input
                      placeholder="搜索链接名称或产品..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as any)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="active">活跃</SelectItem>
                      <SelectItem value="paused">暂停</SelectItem>
                      <SelectItem value="expired">过期</SelectItem>
                      <SelectItem value="draft">草稿</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="commission">佣金</SelectItem>
                      <SelectItem value="clicks">点击量</SelectItem>
                      <SelectItem value="conversions">转化数</SelectItem>
                      <SelectItem value="conversionRate">转化率</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* 链接网格 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredLinks.map(link => renderLinkCard(link))}
            </div>

            {filteredLinks.length === 0 && (
              <Card className="border-border-primary bg-background-glass backdrop-blur-xl">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Link2 className="w-12 h-12 text-text-muted mb-4" />
                  <h3 className="font-semibold text-text-primary mb-2">暂无匹配的链接</h3>
                  <p className="text-text-secondary text-center max-w-md">
                    {searchQuery || filterStatus !== 'all' 
                      ? '尝试调整搜索条件或筛选器'
                      : '开始创建您的第一个分销链接，开启佣金收入之旅'
                    }
                  </p>
                  {(!searchQuery && filterStatus === 'all') && (
                    <Button className="mt-4">
                      <Share2 className="w-4 h-4 mr-2" />
                      创建链接
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* 转化记录 */}
          <TabsContent value="conversions" className="space-y-4">
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {conversions.slice(0, 20).map((conversion) => (
                  <Card key={conversion.id} className="border-border-primary bg-background-glass backdrop-blur-xl">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-text-primary">
                              {conversion.productInfo.name}
                            </p>
                            <p className="text-sm text-text-secondary">
                              {conversion.eventType} • {conversion.timestamp.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-emerald-600">
                            +¥{conversion.commission.toLocaleString()}
                          </p>
                          <p className="text-sm text-text-secondary">
                            订单 ¥{conversion.amount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* 数据分析 */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 趋势图表占位 */}
              <Card className="border-border-primary bg-background-glass backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>收入趋势</CardTitle>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center text-text-secondary">
                  <BarChart3 className="w-12 h-12 mb-4" />
                  图表组件占位
                </CardContent>
              </Card>
              
              <Card className="border-border-primary bg-background-glass backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>转化分析</CardTitle>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center text-text-secondary">
                  <PieChart className="w-12 h-12 mb-4" />
                  图表组件占位
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 排行榜 */}
          <TabsContent value="leaderboard">
            <Card className="border-border-primary bg-background-glass backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  分销商排行榜
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {leaderboard.map((entry) => {
                      const tierData = tierConfig[entry.tier];
                      const TierIcon = tierData.icon;
                      
                      return (
                        <div
                          key={entry.distributorId}
                          className={cn(
                            "flex items-center gap-4 p-4 rounded-xl border transition-colors",
                            entry.distributorId === distributorId 
                              ? "bg-gradient-primary/10 border-cloudsway-primary-500" 
                              : "bg-background-card border-border-primary hover:border-border-accent"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold",
                              entry.rank <= 3 ? "bg-gradient-primary" : "bg-background-main border border-border-primary text-text-primary"
                            )}>
                              {entry.rank}
                            </div>
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={entry.avatar} />
                              <AvatarFallback>
                                {entry.distributorName.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-text-primary">
                                {entry.distributorName}
                              </h3>
                              {entry.distributorId === distributorId && (
                                <Badge variant="default" className="text-xs">你</Badge>
                              )}
                              {entry.badge && (
                                <Badge variant="outline" className="text-xs">{entry.badge}</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-text-secondary">
                              <span>转化: {entry.totalConversions}</span>
                              <span>转化率: {(entry.conversionRate * 100).toFixed(1)}%</span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-xl font-bold text-emerald-600">
                              ¥{entry.totalCommission.toLocaleString()}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              <TierIcon className={cn("w-4 h-4", tierData.color)} />
                              <span className={cn("text-sm font-medium", tierData.color)}>
                                {tierData.name}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
};

export default DistributionTracker;